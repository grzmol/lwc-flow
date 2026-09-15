/**
 * Node drag kernel for lwc-flow.
 *
 * Service component: no template, no LWC imports. Ported from
 * `@xyflow/system/src/xydrag/*`, with `d3-drag` replaced by Pointer Events.
 *
 * ## What a drag has to get right
 *
 * 1. **Offset, not absolute position.** Each dragged node records its distance
 *    from the pointer at drag start. Every move recomputes position from that
 *    offset, so the node never jumps to centre itself under the cursor and a
 *    multi-node drag keeps its relative layout.
 * 2. **Snap once for the whole selection.** Snapping each node independently
 *    would pull a selection apart. One offset is computed from the first node
 *    and applied to all.
 * 3. **Extent clamping per node.** `extent: 'parent'` resolves against the live
 *    parent rect; a coordinate extent on a child is parent-relative and has to
 *    be shifted into absolute space.
 * 4. **Auto-pan.** While the pointer sits near the pane edge the viewport keeps
 *    moving, and the drag keeps recomputing against the *new* transform, so the
 *    node follows the cursor rather than the stale pane.
 */

import { snapPosition, clampPosition, getNodeDimensions, isCoordinateExtent, calcAutoPan } from 'c/flowMath';
import { errorMessages, interactionClass, AUTO_PAN_DISTANCE } from 'c/flowTypes';
import { getPointerPosition, getEventPosition, hasSelector } from 'c/flowDom';

/**
 * True when any ancestor of `node` is selected.
 *
 * A child of a selected parent must not be dragged on its own: the parent
 * already moves it, and dragging both would double the delta.
 * @param {*} node
 * @param {Map<string, *>} nodeLookup
 * @returns {boolean}
 */
export function isParentSelected(node, nodeLookup) {
  if (!node.parentId) {
    return false;
  }

  const parentNode = nodeLookup.get(node.parentId);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodeLookup);
}

/**
 * Build the drag set: every node that should move with this gesture.
 *
 * A node qualifies when it is selected (or is the node grabbed), is not already
 * carried by a selected ancestor, and is draggable. `draggable` on the node wins
 * over the flow-wide default only when it is explicitly set.
 * @param {Map<string, *>} nodeLookup
 * @param {boolean} nodesDraggable flow-wide default
 * @param {import('c/flowTypes').XYPosition} mousePos in flow coordinates
 * @param {string} [nodeId] the grabbed node, if any
 * @returns {Map<string, *>}
 */
export function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId) {
  const dragItems = new Map();

  for (const [id, node] of nodeLookup) {
    if (
      (node.selected || node.id === nodeId) &&
      (!node.parentId || !isParentSelected(node, nodeLookup)) &&
      (node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'))
    ) {
      const internalNode = nodeLookup.get(id);

      if (internalNode) {
        dragItems.set(id, {
          id,
          position: internalNode.position || { x: 0, y: 0 },
          distance: {
            x: mousePos.x - internalNode.internals.positionAbsolute.x,
            y: mousePos.y - internalNode.internals.positionAbsolute.y,
          },
          extent: internalNode.extent,
          parentId: internalNode.parentId,
          origin: internalNode.origin,
          expandParent: internalNode.expandParent,
          internals: {
            positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 },
          },
          measured: {
            width: internalNode.measured.width ?? 0,
            height: internalNode.measured.height ?? 0,
          },
        });
      }
    }
  }

  return dragItems;
}

/**
 * The payload for a drag callback: the primary node plus the whole drag set.
 *
 * The primary is the grabbed node, or the first of the set when the gesture
 * started on the selection rectangle rather than on a specific node.
 * @param {Object} params
 * @returns {[*, Array<*>]} `[node, nodes]`
 */
export function getEventHandlerParams({ nodeId, dragItems, nodeLookup, dragging = true }) {
  const nodesFromDragItems = [];

  for (const [id, dragItem] of dragItems) {
    const node = nodeLookup.get(id)?.internals.userNode;

    if (node) {
      nodesFromDragItems.push({ ...node, position: dragItem.position, dragging });
    }
  }

  if (!nodeId) {
    return [nodesFromDragItems[0], nodesFromDragItems];
  }

  const node = nodeLookup.get(nodeId)?.internals.userNode;

  return [
    !node
      ? nodesFromDragItems[0]
      : {
          ...node,
          position: dragItems.get(nodeId)?.position || node.position,
          dragging,
        },
    nodesFromDragItems,
  ];
}

/**
 * One snap offset for the whole drag set, derived from its first node.
 *
 * Applying `snapPosition` per node would snap each to its own grid cell and
 * shear the selection. Returns `null` for an empty set.
 * @param {Object} params
 * @returns {import('c/flowTypes').XYPosition|null}
 */
export function calculateSnapOffset({ dragItems, snapGrid, x, y }) {
  const refDragItem = dragItems.values().next().value;

  if (!refDragItem) {
    return null;
  }

  const refPos = { x: x - refDragItem.distance.x, y: y - refDragItem.distance.y };
  const refPosSnapped = snapPosition(refPos, snapGrid);

  return { x: refPosSnapped.x - refPos.x, y: refPosSnapped.y - refPos.y };
}

/**
 * Resolve a node's next position, honouring extent, parent and origin.
 *
 * Returns both the parent-relative `position` the consumer stores and the
 * `positionAbsolute` the renderer paints. The origin term converts from the
 * node's anchor point back to its stated position.
 * @param {Object} params
 * @param {string} params.nodeId
 * @param {import('c/flowTypes').XYPosition} params.nextPosition absolute
 * @param {Map<string, *>} params.nodeLookup
 * @param {import('c/flowTypes').NodeOrigin} [params.nodeOrigin=[0,0]]
 * @param {import('c/flowTypes').CoordinateExtent} [params.nodeExtent]
 * @param {Function} [params.onError]
 * @returns {{position: import('c/flowTypes').XYPosition, positionAbsolute: import('c/flowTypes').XYPosition}}
 */
export function calculateNodePosition({ nodeId, nextPosition, nodeLookup, nodeOrigin = [0, 0], nodeExtent, onError }) {
  const node = nodeLookup.get(nodeId);
  const parentNode = node.parentId ? nodeLookup.get(node.parentId) : undefined;
  const { x: parentX, y: parentY } = parentNode ? parentNode.internals.positionAbsolute : { x: 0, y: 0 };

  const origin = node.origin ?? nodeOrigin;
  let extent = node.extent || nodeExtent;

  if (node.extent === 'parent' && !node.expandParent) {
    if (!parentNode) {
      onError?.('005', errorMessages.error005());
    } else {
      const { width: parentWidth, height: parentHeight } = getNodeDimensions(parentNode);

      // A parent with no size yet cannot constrain anything.
      if (parentWidth && parentHeight) {
        extent = [
          [parentX, parentY],
          [parentX + parentWidth, parentY + parentHeight],
        ];
      }
    }
  } else if (parentNode && isCoordinateExtent(node.extent)) {
    // A child's coordinate extent is parent-relative; shift it to absolute.
    extent = [
      [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
      [node.extent[1][0] + parentX, node.extent[1][1] + parentY],
    ];
  }

  const positionAbsolute = isCoordinateExtent(extent)
    ? clampPosition(nextPosition, extent, node.measured)
    : nextPosition;

  if (node.measured.width === undefined || node.measured.height === undefined) {
    onError?.('015', errorMessages.error015());
  }

  return {
    position: {
      x: positionAbsolute.x - parentX + (node.measured.width ?? 0) * origin[0],
      y: positionAbsolute.y - parentY + (node.measured.height ?? 0) * origin[1],
    },
    positionAbsolute,
  };
}

/**
 * Drag controller for one draggable element.
 */
class Drag {
  #store;
  #domNode;
  #nodeId;
  #handleSelector;
  #isSelectionRect;
  #onNodeMouseDown;
  #onDragStart;
  #onDrag;
  #onDragStop;

  #pointerId = null;
  #dragging = false;
  #dragStarted = false;
  #dragItems = new Map();
  /**
   * Pane-pixel pointer position. Doubles as the press reference for the drag
   * threshold until the drag starts, then tracks the last accepted move.
   */
  #mousePosition = { x: 0, y: 0 };
  /** Last snapped flow position, used to drop moves that changed nothing. */
  #lastPos = { xSnapped: 0, ySnapped: 0 };
  /** Set when a gesture must be abandoned: multitouch, or the node vanished. */
  #abortDrag = false;
  #containerBounds = null;
  #lastPointerEvent = null;
  #autoPanFrame = null;
  #autoPanStarted = false;
  #destroyed = false;
  #listeners = {};

  /**
   * @param {Object} params
   * @param {import('c/flowStore').FlowStore} params.store
   * @param {HTMLElement} params.domNode element that starts the drag
   * @param {string} [params.nodeId] omit for a selection-rectangle drag
   * @param {string} [params.handleSelector] only this selector starts a drag
   * @param {boolean} [params.isSelectionRect]
   * @param {Function} [params.onNodeMouseDown] fires before the drag, for selection
   * @param {Function} [params.onDragStart]
   * @param {Function} [params.onDrag]
   * @param {Function} [params.onDragStop]
   */
  constructor({
    store,
    domNode,
    nodeId,
    handleSelector,
    isSelectionRect = false,
    onNodeMouseDown,
    onDragStart,
    onDrag,
    onDragStop,
  }) {
    this.#store = store;
    this.#domNode = domNode;
    this.#nodeId = nodeId;
    this.#handleSelector = handleSelector;
    this.#isSelectionRect = isSelectionRect;
    this.#onNodeMouseDown = onNodeMouseDown;
    this.#onDragStart = onDragStart;
    this.#onDrag = onDrag;
    this.#onDragStop = onDragStop;

    this.#listeners = {
      pointerdown: (e) => this._handlePointerDown(e),
      pointermove: (e) => this._handlePointerMove(e),
      pointerup: (e) => this._handlePointerUp(e),
      pointercancel: (e) => this._handlePointerUp(e),
    };

    domNode.addEventListener('pointerdown', this.#listeners.pointerdown);
    domNode.addEventListener('pointermove', this.#listeners.pointermove);
    domNode.addEventListener('pointerup', this.#listeners.pointerup);
    domNode.addEventListener('pointercancel', this.#listeners.pointercancel);
  }

  /** Remove listeners and stop any running auto-pan. Idempotent. */
  destroy() {
    if (this.#destroyed) {
      return;
    }
    this.#destroyed = true;

    this._stopAutoPan();

    const node = this.#domNode;
    node.removeEventListener('pointerdown', this.#listeners.pointerdown);
    node.removeEventListener('pointermove', this.#listeners.pointermove);
    node.removeEventListener('pointerup', this.#listeners.pointerup);
    node.removeEventListener('pointercancel', this.#listeners.pointercancel);
  }

  /** @returns {boolean} whether a drag is currently in progress */
  get isDragging() {
    return this.#dragging;
  }

  _paneBounds() {
    const pane = this.#store.state.domNode;

    return pane ? pane.getBoundingClientRect() : null;
  }

  _handlePointerDown(event) {
    if (this.#destroyed) {
      return;
    }

    /*
     * A second pointer landing mid-drag is a multitouch gesture, not a drag.
     * This has to be caught here rather than in the move handler: that handler
     * returns immediately for any foreign `pointerId`, and a second finger
     * always has one, so a move-side check could never see it. Upstream gets
     * this for free from d3-drag's own multitouch filtering.
     */
    if (this.#pointerId !== null) {
      if (this.#dragStarted) {
        this.#abortDrag = true;
      }
      return;
    }

    const s = this.#store.state;

    // Primary button only; other buttons belong to pan and context menu.
    if (event.button !== 0) {
      return;
    }

    // `nodrag` opts a subtree out, e.g. a text field inside a custom node.
    if (hasSelector(event.target, `.${interactionClass.noDrag}`, this.#domNode, event)) {
      return;
    }

    if (this.#handleSelector && !hasSelector(event.target, this.#handleSelector, this.#domNode, event)) {
      return;
    }

    this.#containerBounds = this._paneBounds();

    if (!this.#containerBounds) {
      return;
    }

    this.#pointerId = event.pointerId;
    this.#lastPointerEvent = event;
    this.#dragStarted = false;
    this.#dragging = false;
    this.#abortDrag = false;

    const pointer = getPointerPosition(event, {
      transform: s.transform,
      snapGrid: s.snapGrid,
      snapToGrid: s.snapToGrid,
      containerBounds: this.#containerBounds,
    });

    this.#lastPos = pointer;
    this.#mousePosition = getEventPosition(event, this.#containerBounds);
    this.#dragItems = getDragItems(s.nodeLookup, s.nodesDraggable, pointer, this.#nodeId);

    // Selection happens on press, before any movement, so a click selects.
    this.#onNodeMouseDown?.(this.#nodeId, event);

    this.#domNode.setPointerCapture?.(event.pointerId);

    /*
     * With a zero threshold the drag is live immediately. With a threshold the
     * gesture stays a click until the pointer travels far enough, so a click
     * on a node does not emit a spurious position change.
     */
    if (this._threshold() === 0) {
      this._beginDrag(event, pointer);
    }
  }

  _threshold() {
    const s = this.#store.state;

    return this.#isSelectionRect ? 0 : (s.nodeDragThreshold ?? 1);
  }

  _beginDrag(event, pointer) {
    if (this.#dragStarted) {
      return;
    }
    this.#dragStarted = true;
    this.#dragging = true;

    this.#store.update({ dragging: true });

    if (this.#dragItems.size > 0) {
      const [node, nodes] = getEventHandlerParams({
        nodeId: this.#nodeId,
        dragItems: this.#dragItems,
        nodeLookup: this.#store.state.nodeLookup,
      });
      this.#onDragStart?.(event, node, nodes);
    }

    if (this.#store.state.autoPanOnNodeDrag && !this.#isSelectionRect) {
      this._startAutoPan();
    }

    // Apply the press position once so a zero-threshold drag is not a no-op.
    this._applyPositions(event, pointer);
  }

  _handlePointerMove(event) {
    if (this.#pointerId !== event.pointerId) {
      return;
    }

    const s = this.#store.state;
    this.#lastPointerEvent = event;

    const pointer = getPointerPosition(event, {
      transform: s.transform,
      snapGrid: s.snapGrid,
      snapToGrid: s.snapToGrid,
      containerBounds: this.#containerBounds,
    });

    /*
     * Abandon the gesture if the node was deleted underneath us; continuing
     * would apply positions to a node that no longer exists. Multitouch is
     * caught in `_handlePointerDown`, because a second finger never reaches
     * this handler: it carries a foreign `pointerId` and is rejected above.
     */
    if (this.#nodeId && !s.nodeLookup.has(this.#nodeId)) {
      this.#abortDrag = true;
    }

    if (this.#abortDrag) {
      return;
    }

    if (!this.#autoPanStarted && s.autoPanOnNodeDrag && this.#dragStarted && !this.#isSelectionRect) {
      this._startAutoPan();
    }

    if (!this.#dragStarted) {
      /*
       * Threshold is measured in pane pixels, not flow units, so the
       * gesture feels the same at every zoom level. `#mousePosition` is
       * still the press point here.
       */
      const current = getEventPosition(event, this.#containerBounds);
      const x = current.x - this.#mousePosition.x;
      const y = current.y - this.#mousePosition.y;

      if (Math.sqrt(x * x + y * y) > this._threshold()) {
        this._beginDrag(event, pointer);
      } else {
        return;
      }
    }

    // Drop moves that did not change the snapped position: nothing would move.
    if (this.#lastPos.xSnapped === pointer.xSnapped && this.#lastPos.ySnapped === pointer.ySnapped) {
      return;
    }

    this.#lastPos = pointer;
    this.#mousePosition = getEventPosition(event, this.#containerBounds);
    this._applyPositions(event, pointer);
  }

  /**
   * Recompute every dragged node's position and push the changes to the store.
   *
   * Called from both pointer moves and the auto-pan frame loop; the auto-pan
   * case reuses the last pointer position against a freshly panned transform,
   * which is what makes a node keep moving while the pointer is held still at
   * the pane edge.
   */
  _applyPositions(event, pointerOverride) {
    const s = this.#store.state;

    if (this.#dragItems.size === 0) {
      return;
    }

    const pointer =
      pointerOverride ??
      getPointerPosition(this.#lastPointerEvent, {
        transform: s.transform,
        snapGrid: s.snapGrid,
        snapToGrid: s.snapToGrid,
        containerBounds: this.#containerBounds,
      });

    const { x, y } = pointer;
    let hasChange = false;

    const snapOffset = s.snapToGrid
      ? calculateSnapOffset({ dragItems: this.#dragItems, snapGrid: s.snapGrid, x, y })
      : null;

    const changes = [];

    for (const [id, dragItem] of this.#dragItems) {
      let nextX = x - dragItem.distance.x;
      let nextY = y - dragItem.distance.y;

      if (snapOffset) {
        nextX += snapOffset.x;
        nextY += snapOffset.y;
      }

      const { position, positionAbsolute } = calculateNodePosition({
        nodeId: id,
        nextPosition: { x: nextX, y: nextY },
        nodeLookup: s.nodeLookup,
        nodeOrigin: s.nodeOrigin,
        nodeExtent: s.nodeExtent,
        onError: s.onError,
      });

      if (dragItem.position.x !== position.x || dragItem.position.y !== position.y) {
        hasChange = true;
      }

      dragItem.position = position;
      dragItem.internals.positionAbsolute = positionAbsolute;

      changes.push({ id, type: 'position', position, dragging: true });
    }

    if (!hasChange) {
      return;
    }

    const [node, nodes] = getEventHandlerParams({
      nodeId: this.#nodeId,
      dragItems: this.#dragItems,
      nodeLookup: s.nodeLookup,
    });

    this.#onDrag?.(event, changes, node, nodes);
  }

  // ------------------------------------------------------------- auto-pan

  _startAutoPan() {
    if (this.#autoPanStarted) {
      return;
    }
    this.#autoPanStarted = true;

    const step = () => {
      if (!this.#dragging || this.#destroyed) {
        this.#autoPanStarted = false;
        return;
      }

      const s = this.#store.state;
      const [xMovement, yMovement] = calcAutoPan(
        this.#mousePosition,
        { width: s.width, height: s.height },
        s.autoPanSpeed,
        AUTO_PAN_DISTANCE
      );

      if (xMovement !== 0 || yMovement !== 0) {
        /*
         * Pan first, then recompute positions against the new transform.
         * Doing it the other way round would lag the node one frame behind
         * the viewport and it would visibly drift.
         */
        const moved = s.panZoom?.panBy({ x: xMovement, y: yMovement });

        if (moved) {
          this._applyPositions(this.#lastPointerEvent);
        }
      }

      // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
      this.#autoPanFrame = requestAnimationFrame(step);
    };

    // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
    this.#autoPanFrame = requestAnimationFrame(step);
  }

  _stopAutoPan() {
    if (this.#autoPanFrame !== null) {
      cancelAnimationFrame(this.#autoPanFrame);
      this.#autoPanFrame = null;
    }
    this.#autoPanStarted = false;
  }

  _handlePointerUp(event) {
    if (this.#pointerId !== event.pointerId) {
      return;
    }

    this.#domNode.releasePointerCapture?.(event.pointerId);
    this.#pointerId = null;
    this._stopAutoPan();

    if (!this.#dragStarted) {
      // A press that never crossed the threshold: a click, not a drag.
      this.#dragItems = new Map();
      return;
    }

    this.#dragging = false;
    this.#dragStarted = false;
    this.#store.update({ dragging: false });

    if (this.#dragItems.size > 0) {
      const [node, nodes] = getEventHandlerParams({
        nodeId: this.#nodeId,
        dragItems: this.#dragItems,
        nodeLookup: this.#store.state.nodeLookup,
        dragging: false,
      });

      const changes = Array.from(this.#dragItems, ([id, item]) => ({
        id,
        type: 'position',
        position: item.position,
        dragging: false,
      }));

      this.#onDragStop?.(event, changes, node, nodes);
    }

    this.#dragItems = new Map();
  }
}

/**
 * Attach drag behaviour to an element.
 * @param {Object} params see {@link Drag}
 * @returns {Drag}
 */
export function createDrag(params) {
  return new Drag(params);
}
