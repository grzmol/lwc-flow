/**
 * Pan and zoom gesture controller for lwc-flow.
 *
 * Service component: no template, no LWC imports. Touches the DOM, but only the
 * element handed to {@link createPanZoom}.
 *
 * Replaces `d3-zoom`'s event layer (`@xyflow/system/src/xypanzoom/*`). The
 * arithmetic lives in `c/flowTransform` and is numerically identical to d3; what
 * is rewritten here is the plumbing: d3 attaches `mousedown`/`mousemove` plus
 * `touchstart`/`touchmove` and manages its own gesture bookkeeping, this uses
 * Pointer Events with `setPointerCapture`, which gives mouse, touch and pen in
 * one path and keeps receiving moves when the pointer leaves the pane.
 *
 * ## Gesture sequencing
 *
 * d3 runs one `Gesture` at a time and emits `start` / `zoom` / `end`. The same
 * contract is kept here because xyflow's callbacks depend on it:
 * - `start` fires once when a gesture begins, not once per pointer.
 * - `zoom` fires per transform change.
 * - `end` fires once, and for wheel gestures only after `WHEEL_IDLE_MS` of
 *   quiet, so a scroll flick is one gesture rather than dozens.
 */

import {
  Transform,
  constrain,
  scaleTransform,
  translateTransform,
  centroid,
  wheelDelta,
  interpolateTransform,
  interpolateZoom,
  interpolateLinear,
  cubicInOut,
  viewportToTransform,
  transformToViewport,
  isMacOs,
  WHEEL_IDLE_MS,
  DBLCLICK_SCALE_FACTOR,
  DBLCLICK_DURATION,
} from 'c/flowTransform';
import { PanOnScrollMode, interactionClass } from 'c/flowTypes';
import { clamp, isNumeric } from 'c/flowMath';

/**
 * True when `event`'s target is inside an element carrying `className`.
 *
 * `closest` stops at a shadow root, so `composedPath` is walked instead. Without
 * that, a `nopan` marker on consumer markup inside a custom node would never be
 * seen from the pane's own root.
 * @param {Event} event
 * @param {string} [className]
 * @returns {boolean}
 */
export function isWrappedWithClass(event, className) {
  if (!className) {
    return false;
  }

  const path = event.composedPath?.() ?? [];

  for (const node of path) {
    if (node?.classList?.contains?.(className)) {
      return true;
    }
    // Stop at the document: anything above is not part of the flow.
    if (node === document) {
      break;
    }
  }

  // Fall back to `closest` for synthetic events with no composed path.
  return !!event.target?.closest?.(`.${className}`);
}

/**
 * Whether a right-button drag is an allowed pan.
 * @param {boolean|Array<number>} panOnDrag
 * @param {number} usedButton
 * @returns {boolean}
 */
export function isRightClickPan(panOnDrag, usedButton) {
  return usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
}

/**
 * Build the predicate deciding whether an event may start a pan or zoom.
 *
 * Ported from `@xyflow/system/src/xypanzoom/filter.ts`. The order of the checks
 * is significant: each early return is a different reason to refuse, and moving
 * one changes which reason wins.
 * @param {Object} params
 * @returns {(event: Event) => boolean}
 */
export function createFilter({
  panActivationKeyPressed,
  zoomActivationKeyPressed,
  zoomOnScroll,
  zoomOnPinch,
  panOnDrag,
  panOnScroll,
  zoomOnDoubleClick,
  userSelectionActive,
  noWheelClassName = interactionClass.noWheel,
  noPanClassName = interactionClass.noPan,
  connectionInProgress,
}) {
  return (event) => {
    const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
    const pinchZoom = zoomOnPinch && event.ctrlKey;
    const isWheelEvent = event.type === 'wheel';

    /*
     * Middle-button drag starting on a node, edge or selection always pans.
     * Without this the element under the cursor would swallow the gesture,
     * and middle-drag is the one pan that users expect to work anywhere.
     */
    if (
      event.button === 1 &&
      (event.type === 'pointerdown' || event.type === 'mousedown') &&
      (isWrappedWithClass(event, 'flow__node') ||
        isWrappedWithClass(event, 'flow__edge') ||
        isWrappedWithClass(event, 'flow__selection') ||
        isWrappedWithClass(event, 'flow__nodesselection'))
    ) {
      return true;
    }

    if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
      return false;
    }

    // A marquee selection owns the pointer for its whole duration.
    if (userSelectionActive) {
      return false;
    }

    // Pinch-zooming mid-connection would fight the connection line.
    if (connectionInProgress && !isWheelEvent) {
      return false;
    }

    if (isWrappedWithClass(event, noWheelClassName) && isWheelEvent) {
      return false;
    }

    if (
      isWrappedWithClass(event, noPanClassName) &&
      (!isWheelEvent || (panOnScroll && isWheelEvent && !zoomActivationKeyPressed))
    ) {
      return false;
    }

    if (!zoomOnPinch && event.ctrlKey && isWheelEvent) {
      return false;
    }

    if (!zoomScroll && !panOnScroll && !pinchZoom && isWheelEvent) {
      return false;
    }

    if (!panOnDrag && (event.type === 'pointerdown' || event.type === 'mousedown')) {
      return false;
    }

    if (
      Array.isArray(panOnDrag) &&
      !panOnDrag.includes(event.button) &&
      (event.type === 'pointerdown' || event.type === 'mousedown')
    ) {
      return false;
    }

    const buttonAllowed =
      (Array.isArray(panOnDrag) && panOnDrag.includes(event.button)) || !event.button || event.button <= 1;

    /*
     * d3 rejects Ctrl-modified drags because Ctrl+wheel is pinch. Allow the
     * drag when Ctrl is the configured pan activation key, keeping the wheel
     * safeguard intact.
     */
    return (!event.ctrlKey || isWheelEvent || panActivationKeyPressed) && buttonAllowed;
  };
}

/**
 * Pan/zoom controller bound to one pane element.
 */
class PanZoom {
  #domNode;
  #transform;
  #minZoom;
  #maxZoom;
  #translateExtent;
  #extent = [
    [0, 0],
    [0, 0],
  ];

  #onPanZoom;
  #onPanZoomStart;
  #onPanZoomEnd;
  #onDraggingChange;
  #onTransformChange;

  #options = {
    panOnDrag: true,
    panOnScroll: false,
    panOnScrollMode: PanOnScrollMode.Free,
    panOnScrollSpeed: 0.5,
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: true,
    preventScrolling: true,
    userSelectionActive: false,
    connectionInProgress: false,
    panActivationKeyPressed: false,
    zoomActivationKeyPressed: false,
    noWheelClassName: interactionClass.noWheel,
    noPanClassName: interactionClass.noPan,
    paneClickDistance: 0,
    selectionOnDrag: false,
    onPaneContextMenu: false,
  };

  #filter = () => false;

  // gesture bookkeeping
  #active = false;
  #pointerId = null;
  #anchor = null; // [panePoint, flowPoint] held fixed during a drag
  #startClient = null;
  #moved = false;
  #usedRightMouseButton = false;
  #wheelIdleTimer = null;
  #wheelAnchor = null;
  #panScrollTimer = null;
  #isPanScrolling = false;
  #resizeObserver = null;
  #animation = null;
  #destroyed = false;

  /** Bound listeners, retained so they can be removed. */
  #listeners = {};

  constructor({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport,
    onPanZoom,
    onPanZoomStart,
    onPanZoomEnd,
    onDraggingChange,
    onTransformChange,
  }) {
    this.#domNode = domNode;
    this.#minZoom = minZoom;
    this.#maxZoom = maxZoom;
    this.#translateExtent = translateExtent;
    this.#onPanZoom = onPanZoom;
    this.#onPanZoomStart = onPanZoomStart;
    this.#onPanZoomEnd = onPanZoomEnd;
    this.#onDraggingChange = onDraggingChange;
    this.#onTransformChange = onTransformChange;

    const bbox = domNode.getBoundingClientRect();
    this.#extent = [
      [0, 0],
      [bbox.width, bbox.height],
    ];

    /*
     * Cache the pane extent. Reading clientWidth/clientHeight per event would
     * force a synchronous layout on every pointer move, which is exactly what
     * upstream added this observer to avoid.
     */
    if (typeof ResizeObserver !== 'undefined') {
      this.#resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          this.#extent = [
            [0, 0],
            [entry.contentRect.width, entry.contentRect.height],
          ];
        }
      });
      this.#resizeObserver.observe(domNode);
    }

    this.#transform = constrain(
      viewportToTransform({
        x: viewport.x,
        y: viewport.y,
        zoom: clamp(viewport.zoom, minZoom, maxZoom),
      }),
      this.#extent,
      translateExtent
    );

    this._attach();
    this._emitTransform();
  }

  _attach() {
    const node = this.#domNode;

    this.#listeners = {
      wheel: (e) => this._onWheel(e),
      pointerdown: (e) => this._onPointerDown(e),
      pointermove: (e) => this._onPointerMove(e),
      pointerup: (e) => this._onPointerUp(e),
      pointercancel: (e) => this._onPointerUp(e),
      dblclick: (e) => this._onDoubleClick(e),
      contextmenu: (e) => this._onContextMenu(e),
    };

    // `passive: false` because zooming must be able to preventDefault the scroll.
    node.addEventListener('wheel', this.#listeners.wheel, { passive: false });
    node.addEventListener('pointerdown', this.#listeners.pointerdown);
    node.addEventListener('pointermove', this.#listeners.pointermove);
    node.addEventListener('pointerup', this.#listeners.pointerup);
    node.addEventListener('pointercancel', this.#listeners.pointercancel);
    node.addEventListener('dblclick', this.#listeners.dblclick);
    node.addEventListener('contextmenu', this.#listeners.contextmenu);
  }

  /** Pointer position relative to the pane. */
  _pointer(event) {
    const rect = this.#domNode.getBoundingClientRect();

    return [event.clientX - rect.left, event.clientY - rect.top];
  }

  _emitTransform() {
    const viewport = transformToViewport(this.#transform);
    this.#onTransformChange?.([viewport.x, viewport.y, viewport.zoom]);
  }

  /** Commit a transform and notify, skipping identical writes. */
  _setTransformInternal(next, event) {
    if (next.k === this.#transform.k && next.x === this.#transform.x && next.y === this.#transform.y) {
      return;
    }

    this.#transform = next;
    this._emitTransform();
    this.#onPanZoom?.(event, transformToViewport(next));
  }

  _startGesture(event) {
    if (this.#active) {
      return;
    }
    this.#active = true;
    this.#onPanZoomStart?.(event, transformToViewport(this.#transform));
  }

  _endGesture(event) {
    if (!this.#active) {
      return;
    }
    this.#active = false;
    this.#onPanZoomEnd?.(event, transformToViewport(this.#transform));
  }

  // ------------------------------------------------------------- wheel

  _onWheel(event) {
    if (this.#destroyed) {
      return;
    }

    const o = this.#options;
    const isPanOnScroll = o.panOnScroll && !o.zoomActivationKeyPressed && !o.userSelectionActive;

    if (!this.#filter(event)) {
      return;
    }

    if (isPanOnScroll) {
      this._handlePanOnScroll(event);
      return;
    }

    if (o.preventScrolling || event.ctrlKey) {
      event.preventDefault();
    }

    const delta = wheelDelta(event, isMacOs());
    const point = this._pointer(event);

    /*
     * Reuse the anchor for a continuing wheel gesture so a scroll flick zooms
     * toward one fixed point instead of drifting as the cursor's flow-space
     * position changes under it.
     */
    const continuingGesture = this.#wheelIdleTimer !== null;
    clearTimeout(this.#wheelIdleTimer);

    if (!continuingGesture) {
      this.#wheelAnchor = [point, this.#transform.invert(point)];
      this._startGesture(event);
    }

    const nextK = this.#transform.k * Math.pow(2, delta);
    const scaled = scaleTransform(this.#transform, nextK, [this.#minZoom, this.#maxZoom]);
    const next = constrain(
      translateTransform(scaled, this.#wheelAnchor[0], this.#wheelAnchor[1]),
      this.#extent,
      this.#translateExtent
    );

    this._setTransformInternal(next, event);

    // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture idle timer; cleared in destroy() and on the next event
    this.#wheelIdleTimer = setTimeout(() => {
      this.#wheelIdleTimer = null;
      this.#wheelAnchor = null;
      this._endGesture(event);
    }, WHEEL_IDLE_MS);
  }

  /**
   * Wheel pans instead of zooming.
   *
   * Ctrl still pinch-zooms when enabled, because on a trackpad that is the
   * pinch gesture and users expect it regardless of `panOnScroll`.
   */
  _handlePanOnScroll(event) {
    const o = this.#options;

    event.preventDefault();

    if (o.zoomOnPinch && event.ctrlKey) {
      const point = this._pointer(event);
      const delta = wheelDelta(event, isMacOs());
      const nextK = this.#transform.k * Math.pow(2, delta);
      const scaled = scaleTransform(this.#transform, nextK, [this.#minZoom, this.#maxZoom]);
      const next = constrain(
        translateTransform(scaled, point, this.#transform.invert(point)),
        this.#extent,
        this.#translateExtent
      );

      if (!this.#isPanScrolling) {
        this.#isPanScrolling = true;
        this._startGesture(event);
      }
      this._setTransformInternal(next, event);
      this._schedulePanScrollEnd(event);
      return;
    }

    const speed = o.panOnScrollSpeed ?? 0.5;
    let dx = 0;
    let dy = 0;

    if (o.panOnScrollMode === PanOnScrollMode.Vertical) {
      dy = -(event.deltaY ?? 0) * speed;
    } else if (o.panOnScrollMode === PanOnScrollMode.Horizontal) {
      dx = -(event.deltaY ?? 0) * speed;
    } else {
      dx = -(event.deltaX ?? 0) * speed;
      dy = -(event.deltaY ?? 0) * speed;
    }

    if (dx === 0 && dy === 0) {
      return;
    }

    if (!this.#isPanScrolling) {
      this.#isPanScrolling = true;
      this._startGesture(event);
    }

    // Pan deltas are pane pixels, so divide by k before Transform scales them.
    const next = constrain(
      this.#transform.translate(dx / this.#transform.k, dy / this.#transform.k),
      this.#extent,
      this.#translateExtent
    );

    this._setTransformInternal(next, event);
    this._schedulePanScrollEnd(event);
  }

  _schedulePanScrollEnd(event) {
    clearTimeout(this.#panScrollTimer);
    // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture idle timer; cleared in destroy() and on the next event
    this.#panScrollTimer = setTimeout(() => {
      this.#panScrollTimer = null;
      this.#isPanScrolling = false;
      this._endGesture(event);
    }, WHEEL_IDLE_MS);
  }

  // ------------------------------------------------------------ pointer

  _onPointerDown(event) {
    if (this.#destroyed || this.#pointerId !== null || !this.#filter(event)) {
      return;
    }

    this.#pointerId = event.pointerId;
    this.#usedRightMouseButton = isRightClickPan(this.#options.panOnDrag, event.button);
    this.#startClient = [event.clientX, event.clientY];
    this.#moved = false;

    const point = this._pointer(event);
    this.#anchor = [point, this.#transform.invert(point)];

    this._cancelAnimation();

    /*
     * Capture on the pane so the drag survives the pointer leaving it, and so
     * a child element cannot steal subsequent moves.
     */
    this.#domNode.setPointerCapture?.(event.pointerId);

    this._startGesture(event);
    this.#onDraggingChange?.(true);
  }

  _onPointerMove(event) {
    if (this.#pointerId !== event.pointerId) {
      return;
    }

    if (!this.#moved) {
      const dx = event.clientX - this.#startClient[0];
      const dy = event.clientY - this.#startClient[1];
      const clickDistance = this.#options.selectionOnDrag
        ? Infinity
        : !isNumeric(this.#options.paneClickDistance) || this.#options.paneClickDistance < 0
          ? 0
          : this.#options.paneClickDistance;

      // Squared comparison, as d3 does, to avoid a sqrt per move.
      this.#moved = dx * dx + dy * dy > clickDistance * clickDistance;
    }

    const point = this._pointer(event);
    this.#anchor[0] = point;

    const next = constrain(
      translateTransform(this.#transform, this.#anchor[0], this.#anchor[1]),
      this.#extent,
      this.#translateExtent
    );

    this._setTransformInternal(next, event);
  }

  _onPointerUp(event) {
    if (this.#pointerId !== event.pointerId) {
      return;
    }

    this.#domNode.releasePointerCapture?.(event.pointerId);
    this.#pointerId = null;
    this.#anchor = null;
    this.#startClient = null;

    this.#onDraggingChange?.(false);
    this._endGesture(event);
  }

  _onContextMenu(event) {
    /*
     * When right-drag is a configured pan, a right-button release would also
     * open the context menu. Suppress it, but only if the pointer actually
     * moved, so a stationary right-click still reaches the consumer.
     */
    if (this.#usedRightMouseButton && this.#moved) {
      event.preventDefault();
    }
    this.#usedRightMouseButton = false;
  }

  _onDoubleClick(event) {
    if (this.#destroyed || !this.#options.zoomOnDoubleClick || !this.#filter(event)) {
      return;
    }

    event.preventDefault();

    const p0 = this._pointer(event);
    const p1 = this.#transform.invert(p0);
    const factor = event.shiftKey ? 1 / DBLCLICK_SCALE_FACTOR : DBLCLICK_SCALE_FACTOR;
    const scaled = scaleTransform(this.#transform, this.#transform.k * factor, [this.#minZoom, this.#maxZoom]);
    const target = constrain(translateTransform(scaled, p0, p1), this.#extent, this.#translateExtent);

    this._runTransition(target, { duration: DBLCLICK_DURATION }, p0, event);
  }

  // ---------------------------------------------------------- transitions

  _cancelAnimation() {
    if (this.#animation) {
      cancelAnimationFrame(this.#animation.frame);
      this.#animation.resolve(false);
      this.#animation = null;
    }
  }

  /**
   * Animate to `target`, or jump when there is no duration.
   *
   * The tween interpolates in `[x, y, width]` space around `point`, which is
   * what keeps that point stationary for the whole animation; interpolating the
   * transform fields directly would swing the view sideways.
   * @returns {Promise<boolean>} resolves true on completion, false if superseded
   */
  _runTransition(target, options, point, event) {
    this._cancelAnimation();

    const duration = options?.duration ?? 0;

    if (!(typeof duration === 'number' && duration > 0)) {
      this._startGesture(event);
      this._setTransformInternal(target, event);
      this._endGesture(event);
      return Promise.resolve(true);
    }

    const ease = options?.ease ?? cubicInOut;
    const interpolator = options?.interpolate === 'linear' ? interpolateLinear : interpolateZoom;
    const tween = interpolateTransform(this.#transform, target, this.#extent, point, interpolator);
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();

    this._startGesture(event);

    return new Promise((resolve) => {
      const step = () => {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const t = Math.min(1, (now - start) / duration);

        this._setTransformInternal(tween(ease(t)), event);

        if (t < 1) {
          // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
          this.#animation.frame = requestAnimationFrame(step);
          return;
        }

        // Land exactly on the target; ease(1) can be a hair off.
        this._setTransformInternal(target, event);
        this.#animation = null;
        this._endGesture(event);
        resolve(true);
      };

      // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
      this.#animation = { resolve, frame: requestAnimationFrame(step) };
    });
  }

  // -------------------------------------------------------------- public

  /**
   * Apply configuration. Called whenever the root component's props change.
   * @param {Object} options
   */
  update(options) {
    this.#options = { ...this.#options, ...options };

    if (options.minZoom !== undefined) {
      this.#minZoom = options.minZoom;
    }
    if (options.maxZoom !== undefined) {
      this.#maxZoom = options.maxZoom;
    }
    if (options.translateExtent !== undefined) {
      this.#translateExtent = options.translateExtent;
    }

    this.#filter = createFilter(this.#options);
  }

  /** Stop responding to input. Idempotent. */
  destroy() {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;

    this._cancelAnimation();
    clearTimeout(this.#wheelIdleTimer);
    clearTimeout(this.#panScrollTimer);
    this.#resizeObserver?.disconnect();

    const node = this.#domNode;
    node.removeEventListener('wheel', this.#listeners.wheel);
    node.removeEventListener('pointerdown', this.#listeners.pointerdown);
    node.removeEventListener('pointermove', this.#listeners.pointermove);
    node.removeEventListener('pointerup', this.#listeners.pointerup);
    node.removeEventListener('pointercancel', this.#listeners.pointercancel);
    node.removeEventListener('dblclick', this.#listeners.dblclick);
    node.removeEventListener('contextmenu', this.#listeners.contextmenu);
  }

  /**
   * Move to `viewport`.
   * @param {import('c/flowTypes').Viewport} viewport
   * @param {{duration?: number, ease?: Function, interpolate?: 'linear'}} [options]
   * @returns {Promise<boolean>}
   */
  setViewport(viewport, options) {
    return this._runTransition(viewportToTransform(viewport), options, null, null);
  }

  /**
   * Move to `viewport` after clamping it into `translateExtent`.
   * @returns {Promise<import('c/flowTypes').Viewport>} the viewport actually applied
   */
  async setViewportConstrained(viewport, extent, translateExtent) {
    const target = constrain(viewportToTransform(viewport), extent, translateExtent);

    await this._runTransition(target, undefined, null, null);

    return transformToViewport(target);
  }

  /** Write a viewport with no callbacks, for syncing from external state. */
  syncViewport(viewport) {
    const next = viewportToTransform(viewport);

    if (next.k === this.#transform.k && next.x === this.#transform.x && next.y === this.#transform.y) {
      return;
    }

    this.#transform = next;
    this._emitTransform();
  }

  /** @returns {import('c/flowTypes').Viewport} */
  getViewport() {
    return transformToViewport(this.#transform);
  }

  /**
   * Zoom to an absolute level, about the pane centre.
   * @param {number} zoom
   * @param {Object} [options]
   * @returns {Promise<boolean>}
   */
  scaleTo(zoom, options) {
    const p0 = centroid(this.#extent);
    const p1 = this.#transform.invert(p0);
    const scaled = scaleTransform(this.#transform, zoom, [this.#minZoom, this.#maxZoom]);
    const target = constrain(translateTransform(scaled, p0, p1), this.#extent, this.#translateExtent);

    return this._runTransition(target, options, p0, null);
  }

  /**
   * Multiply the current zoom, about the pane centre.
   * @param {number} factor
   * @param {Object} [options]
   * @returns {Promise<boolean>}
   */
  scaleBy(factor, options) {
    return this.scaleTo(this.#transform.k * factor, options);
  }

  /** @param {[number, number]} scaleExtent */
  setScaleExtent(scaleExtent) {
    this.#minZoom = scaleExtent[0];
    this.#maxZoom = scaleExtent[1];
  }

  /** @param {import('c/flowTypes').CoordinateExtent} translateExtent */
  setTranslateExtent(translateExtent) {
    this.#translateExtent = translateExtent;
  }

  /** @param {number} distance */
  setClickDistance(distance) {
    const valid = !isNumeric(distance) || distance < 0 ? 0 : distance;
    this.#options = { ...this.#options, paneClickDistance: valid };
  }

  /**
   * Pan by a pane-pixel delta, respecting `translateExtent`.
   * @param {import('c/flowTypes').XYPosition} delta
   * @returns {boolean} whether the transform actually moved
   */
  panBy(delta) {
    if (!delta.x && !delta.y) {
      return false;
    }

    const before = this.#transform;
    const next = constrain(
      new Transform(before.k, before.x + delta.x, before.y + delta.y),
      this.#extent,
      this.#translateExtent
    );

    this._setTransformInternal(next, null);

    return next.x !== before.x || next.y !== before.y || next.k !== before.k;
  }

  /** Current pane extent, `[[0,0],[width,height]]`. */
  getExtent() {
    return this.#extent;
  }
}

/**
 * Create a pan/zoom controller for a pane element.
 * @param {Object} params
 * @param {HTMLElement} params.domNode the pane
 * @param {number} params.minZoom
 * @param {number} params.maxZoom
 * @param {import('c/flowTypes').CoordinateExtent} params.translateExtent
 * @param {import('c/flowTypes').Viewport} params.viewport initial viewport
 * @param {Function} [params.onPanZoom]
 * @param {Function} [params.onPanZoomStart]
 * @param {Function} [params.onPanZoomEnd]
 * @param {Function} [params.onDraggingChange]
 * @param {Function} [params.onTransformChange]
 * @returns {PanZoom}
 */
export function createPanZoom(params) {
  return new PanZoom(params);
}
