/**
 * DOM readers for lwc-flow.
 *
 * Service component: no template, no LWC imports. Every function here reads the
 * DOM; nothing writes it. Isolated into its own bundle so the rest of the port
 * stays pure and cheap to test.
 *
 * Ported from `@xyflow/system/src/utils/dom.ts`, with the shadow-DOM
 * adjustments the LWC binding needs: upstream can walk `parentElement` and call
 * `closest` freely because React Flow renders one flat tree, while here every
 * component has its own shadow root and a naive walk stops at the first
 * boundary.
 */

import { pointToRendererPoint, snapPosition } from 'c/flowMath';

/**
 * Offset size of an element.
 *
 * `offsetWidth`/`offsetHeight` rather than `getBoundingClientRect`, because
 * these are unaffected by the viewport's CSS scale and so report the node's own
 * layout size at zoom 1. A rect-based measurement would shrink as the user
 * zooms out and the stored size would drift.
 * @param {HTMLElement} node
 * @returns {import('c/flowTypes').Dimensions}
 */
export function getDimensions(node) {
  return { width: node.offsetWidth, height: node.offsetHeight };
}

/**
 * The root node an element belongs to: its shadow root, or the document.
 * @param {EventTarget|HTMLElement|null} element
 * @returns {Document|ShadowRoot}
 */
export function getHostForElement(element) {
  return element?.getRootNode?.() || document;
}

/** Elements whose own key handling must win over the flow's shortcuts. */
const INPUT_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];

/**
 * True when a key event originated in something the user is typing into.
 *
 * Uses `composedPath` so an input inside a custom node's shadow root is still
 * recognised; `event.target` alone would be retargeted to the node host and the
 * check would silently fail, letting Delete remove the node while the user was
 * editing a field.
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
export function isInputDOMNode(event) {
  const path = event.composedPath?.() ?? [];
  const target = path[0] ?? event.target;

  if (target?.nodeType !== 1) {
    return false;
  }

  if (INPUT_TAGS.includes(target.nodeName) || target.hasAttribute?.('contenteditable')) {
    return true;
  }

  // `nokey` opts a subtree out of flow keyboard handling.
  for (const node of path) {
    if (node?.classList?.contains?.('nokey')) {
      return true;
    }
    if (node === document) {
      break;
    }
  }

  return !!target.closest?.('.nokey');
}

/**
 * Pointer or touch position in client coordinates, minus an optional origin.
 * @param {MouseEvent|TouchEvent|PointerEvent} event
 * @param {DOMRect} [bounds]
 * @returns {import('c/flowTypes').XYPosition}
 */
export function getEventPosition(event, bounds) {
  const isMouse = 'clientX' in event && event.clientX !== undefined;
  const evtX = isMouse ? event.clientX : event.touches?.[0]?.clientX;
  const evtY = isMouse ? event.clientY : event.touches?.[0]?.clientY;

  return { x: evtX - (bounds?.left ?? 0), y: evtY - (bounds?.top ?? 0) };
}

/**
 * Pointer position in flow coordinates, with and without grid snapping.
 *
 * Both are returned because the drag loop compares the snapped value to decide
 * whether anything actually moved, while the unsnapped value is what the
 * gesture's own bookkeeping tracks.
 * @param {MouseEvent|TouchEvent|PointerEvent} event
 * @param {Object} params
 * @param {import('c/flowTypes').Transform} params.transform
 * @param {import('c/flowTypes').SnapGrid} [params.snapGrid=[0,0]]
 * @param {boolean} [params.snapToGrid=false]
 * @param {DOMRect|null} params.containerBounds
 * @returns {{x: number, y: number, xSnapped: number, ySnapped: number}}
 */
export function getPointerPosition(event, { snapGrid = [0, 0], snapToGrid = false, transform, containerBounds }) {
  const { x, y } = getEventPosition(event);
  const pointerPos = pointToRendererPoint(
    { x: x - (containerBounds?.left ?? 0), y: y - (containerBounds?.top ?? 0) },
    transform
  );
  const { x: xSnapped, y: ySnapped } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;

  return { xSnapped, ySnapped, ...pointerPos };
}

/**
 * Measure a node's handles, relative to the node.
 *
 * Positions are divided by the viewport zoom so the stored bounds are in flow
 * units and stay valid at any zoom level. Returns `null` when the node has no
 * handles of that type, which is the signal the caller uses to distinguish
 * "measured, none present" from "not measured yet".
 *
 * Handles are found with `querySelectorAll` on the node element. Under shadow
 * DOM that only sees the node component's own root, so `c-flow-handle` renders
 * its marker class into that root rather than nesting it inside its own shadow.
 * @param {'source'|'target'} type
 * @param {HTMLElement} nodeElement
 * @param {DOMRect} nodeBounds bounding rect of `nodeElement`
 * @param {number} zoom current viewport scale
 * @param {string} nodeId
 * @returns {Array<import('c/flowTypes').FlowHandle>|null}
 */
export function getHandleBounds(type, nodeElement, nodeBounds, zoom, nodeId) {
  const handles = nodeElement.querySelectorAll(`.${type}`);

  if (!handles || !handles.length) {
    return null;
  }

  return Array.from(handles).map((handle) => {
    const handleBounds = handle.getBoundingClientRect();

    return {
      id: handle.getAttribute('data-handleid'),
      type,
      nodeId,
      position: handle.getAttribute('data-handlepos'),
      x: (handleBounds.left - nodeBounds.left) / zoom,
      y: (handleBounds.top - nodeBounds.top) / zoom,
      ...getDimensions(handle),
    };
  });
}

/**
 * True when `target`, or an ancestor up to `domNode`, matches `selector`.
 *
 * Walks `composedPath` first so the search crosses shadow boundaries; a
 * `dragHandle` selector or a `nodrag` marker declared inside a custom node must
 * be visible from the pane. Falls back to a `parentElement` walk for synthetic
 * events without a composed path.
 * @param {EventTarget|Element|null} target
 * @param {string} selector
 * @param {Element} domNode search stops here
 * @param {Event} [event] supplies `composedPath` when available
 * @returns {boolean}
 */
export function hasSelector(target, selector, domNode, event) {
  const path = event?.composedPath?.() ?? [];

  for (const node of path) {
    if (node?.matches?.(selector)) {
      return true;
    }
    if (node === domNode || node === document) {
      return false;
    }
  }

  let current = target;

  do {
    if (current?.matches?.(selector)) {
      return true;
    }
    if (current === domNode) {
      return false;
    }
    current = current?.parentElement;
  } while (current);

  return false;
}

/**
 * Read the viewport's live scale from its CSS transform.
 *
 * Taken from the computed style rather than from store state so measurement
 * cannot disagree with what is actually painted, which matters while a zoom
 * transition is mid-flight.
 * @param {Element|null} viewportElement
 * @returns {number} scale, 1 when it cannot be determined
 */
export function getViewportZoom(viewportElement) {
  if (!viewportElement || typeof window === 'undefined') {
    return 1;
  }

  const style = window.getComputedStyle(viewportElement);

  if (typeof window.DOMMatrixReadOnly !== 'function') {
    return 1;
  }

  try {
    // m22 is the y scale; the flow only ever applies a uniform scale.
    const { m22 } = new window.DOMMatrixReadOnly(style.transform);
    return m22 || 1;
  } catch {
    // An unparseable transform means nothing has been applied yet.
    return 1;
  }
}
