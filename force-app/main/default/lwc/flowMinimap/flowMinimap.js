import { LightningElement, api } from 'lwc';
import { getInternalNodesBounds, getBoundsOfRects, getNodeDimensions } from 'c/flowMath';
import { mergeAriaLabelConfig } from 'c/flowTypes';

/** Upstream's default minimap size. */
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;

/**
 * Overview of the whole flow, with the current viewport drawn as a cut-out.
 *
 * Ports `@xyflow/react/src/additional-components/MiniMap/`. It owns its own
 * `<svg>` root, so unlike the edge layer it can be a component without hitting
 * the SVG namespace problem.
 *
 * The viewport is shown by a single `<path>` with `fill-rule: evenodd`: an outer
 * rectangle covering everything and an inner rectangle for the viewport. Under
 * evenodd the inner rectangle is subtracted, so the mask dims everything except
 * the visible region in one element instead of four.
 */
export default class FlowMinimap extends LightningElement {
  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  @api width = DEFAULT_WIDTH;
  @api height = DEFAULT_HEIGHT;

  @api nodeColor;
  @api nodeStrokeColor;
  @api nodeClassName = '';
  @api nodeBorderRadius = 5;
  @api nodeStrokeWidth;

  @api maskColor;
  @api maskStrokeColor;
  @api maskStrokeWidth;

  @api position = 'bottom-right';
  @api pannable = false;
  @api zoomable = false;
  @api inversePan = false;
  @api zoomStep = 1;

  /** Padding around the fitted bounds, in minimap units scaled by `viewScale`. */
  @api offsetScale = 5;

  @api ariaLabel;

  // Template-observed state must be ordinary fields: a `#private` field is a
  // ClassPrivateProperty and the LWC babel plugin never registers it as reactive.
  _viewBox = '0 0 200 150';
  _maskPath = '';
  _nodeRects = [];
  _labelId = 'flow-minimap-desc';

  #unsubscribe = null;
  #viewScale = 1;
  #pointerId = null;
  #lastPointer = null;

  connectedCallback() {
    if (!this.store) {
      return;
    }

    this._labelId = `flow-minimap-desc-${Math.random().toString(36).slice(2, 8)}`;

    /*
     * One subscription over the whole state. The minimap has to redraw when
     * the viewport moves OR when any node moves, and those are the two
     * highest-frequency changes in the store, so a narrower selector would
     * not save anything.
     */
    this.#unsubscribe = this.store.subscribe(
      (s) => `${s.transform.join(',')}|${s.nodeVersion ?? 0}|${s.width}x${s.height}`,
      () => this._recompute()
    );
  }

  disconnectedCallback() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }

  get viewBox() {
    return this._viewBox;
  }

  get maskPath() {
    return this._maskPath;
  }

  get nodeRects() {
    return this._nodeRects;
  }

  get labelId() {
    return this._labelId;
  }

  get resolvedAriaLabel() {
    const config = mergeAriaLabelConfig(this.store?.state.ariaLabelConfig);

    return this.ariaLabel ?? config['minimap.ariaLabel'];
  }

  get panelClass() {
    return `flow__minimap flow__minimap--${this.position}`;
  }

  get svgStyle() {
    const parts = [];

    if (this.maskColor) {
      parts.push(`--flow-minimap-mask-fill: ${this.maskColor};`);
    }
    if (this.maskStrokeColor) {
      parts.push(`--flow-minimap-mask-stroke: ${this.maskStrokeColor};`);
    }
    if (typeof this.maskStrokeWidth === 'number') {
      // Stroke width is in minimap units, so it must scale with the view.
      parts.push(`--flow-minimap-mask-stroke-width: ${this.maskStrokeWidth * this.#viewScale};`);
    }
    if (this.nodeColor) {
      parts.push(`--flow-minimap-node-fill: ${this.nodeColor};`);
    }
    if (this.nodeStrokeColor) {
      parts.push(`--flow-minimap-node-stroke: ${this.nodeStrokeColor};`);
    }
    if (typeof this.nodeStrokeWidth === 'number') {
      parts.push(`--flow-minimap-node-stroke-width: ${this.nodeStrokeWidth};`);
    }

    return parts.join(' ');
  }

  /**
   * Recompute the viewBox, the mask and the node rects.
   *
   * The viewBox is fitted to the union of the node bounds and the current
   * viewport, so panning away from the graph keeps both the graph and the
   * viewport indicator visible rather than letting the indicator slide out.
   */
  _recompute() {
    const s = this.store.state;
    const [tx, ty, tk] = s.transform;

    const viewBB = { x: -tx / tk, y: -ty / tk, width: s.width / tk, height: s.height / tk };

    /*
     * `getInternalNodesBounds` returns a rect at the origin when nothing
     * passes the filter. Unioning that with the viewport would stretch the
     * bounds to include (0, 0), so an all-hidden graph falls back to the
     * viewport alone.
     */
    let hasVisibleNode = false;
    for (const node of s.nodeLookup.values()) {
      if (!node.hidden) {
        hasVisibleNode = true;
        break;
      }
    }

    const boundingRect = hasVisibleNode
      ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, { filter: (node) => !node.hidden }), viewBB)
      : viewBB;

    const elementWidth = this.width ?? DEFAULT_WIDTH;
    const elementHeight = this.height ?? DEFAULT_HEIGHT;

    // Fit the longer axis, so the aspect ratio of the minimap is preserved.
    const viewScale = Math.max(boundingRect.width / elementWidth, boundingRect.height / elementHeight);
    const viewWidth = viewScale * elementWidth;
    const viewHeight = viewScale * elementHeight;
    const offset = this.offsetScale * viewScale;

    const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    const width = viewWidth + offset * 2;
    const height = viewHeight + offset * 2;

    this.#viewScale = viewScale;
    this._viewBox = `${x} ${y} ${width} ${height}`;

    // Outer rect then inner viewport rect; evenodd subtracts the inner one.
    this._maskPath =
      `M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z` +
      `M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`;

    const rects = [];
    for (const node of s.nodeLookup.values()) {
      if (node.hidden) {
        continue;
      }

      const { width: nodeWidth, height: nodeHeight } = getNodeDimensions(node);

      // A node with no size yet would render as an invisible zero rect.
      if (!nodeWidth || !nodeHeight) {
        continue;
      }

      rects.push({
        id: node.id,
        x: node.internals.positionAbsolute.x,
        y: node.internals.positionAbsolute.y,
        width: nodeWidth,
        height: nodeHeight,
        rx: this.nodeBorderRadius,
        ry: this.nodeBorderRadius,
        rectClass: node.selected
          ? `flow__minimap-node selected ${this.nodeClassName}`.trim()
          : `flow__minimap-node ${this.nodeClassName}`.trim(),
      });
    }

    this._nodeRects = rects;
  }

  /** Minimap coordinates for a pointer event. */
  _pointerToFlow(event) {
    const svg = this.refs.svg;

    if (!svg) {
      return null;
    }

    const rect = svg.getBoundingClientRect();
    const [vx, vy, vw, vh] = this._viewBox.split(' ').map(Number);

    return {
      x: vx + ((event.clientX - rect.left) / rect.width) * vw,
      y: vy + ((event.clientY - rect.top) / rect.height) * vh,
    };
  }

  handleClick(event) {
    const point = this._pointerToFlow(event);

    if (point) {
      this.dispatchEvent(new CustomEvent('minimapclick', { detail: point }));
    }
  }

  handleNodeClick(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('minimapnodeclick', { detail: { id: event.target.dataset.id } }));
  }

  handlePointerDown(event) {
    if (!this.pannable) {
      return;
    }

    this.#pointerId = event.pointerId;
    this.#lastPointer = this._pointerToFlow(event);
    this.refs.svg?.setPointerCapture?.(event.pointerId);
  }

  /**
   * Drag the minimap to pan the main viewport.
   *
   * The delta is negated by default: dragging the mask right should move the
   * viewport right, which means panning the content left. `inversePan` swaps
   * that for consumers who expect to drag the content instead.
   */
  handlePointerMove(event) {
    if (this.#pointerId !== event.pointerId || !this.#lastPointer) {
      return;
    }

    const point = this._pointerToFlow(event);

    if (!point) {
      return;
    }

    const s = this.store.state;
    const sign = this.inversePan ? 1 : -1;
    const dx = (point.x - this.#lastPointer.x) * s.transform[2] * sign;
    const dy = (point.y - this.#lastPointer.y) * s.transform[2] * sign;

    this.#lastPointer = point;
    s.panZoom?.panBy({ x: dx, y: dy });
  }

  handlePointerUp(event) {
    if (this.#pointerId !== event.pointerId) {
      return;
    }

    this.refs.svg?.releasePointerCapture?.(event.pointerId);
    this.#pointerId = null;
    this.#lastPointer = null;
  }

  handleWheel(event) {
    if (!this.zoomable) {
      return;
    }

    event.preventDefault();

    const s = this.store.state;
    // deltaY is inverted so scrolling up zooms in, matching the main pane.
    const factor = Math.pow(2, -event.deltaY * 0.002 * this.zoomStep);

    s.panZoom?.scaleBy(factor);
  }
}
