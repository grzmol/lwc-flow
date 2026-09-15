/**
 * Geometry and coordinate math for lwc-flow.
 *
 * Service component: no template, no LWC imports, no DOM access. Every function
 * here is a pure port of `@xyflow/system/src/utils/general.ts` and the
 * viewport helpers in `graph.ts`, so the formulas are kept byte-identical to
 * upstream rather than rewritten.
 */

import { Position, infiniteExtent } from 'c/flowTypes';

/**
 * Clamp `val` into `[min, max]`.
 * @param {number} val
 * @param {number} [min=0]
 * @param {number} [max=1]
 * @returns {number}
 */
export function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

/**
 * True for a finite number. Mirrors upstream `isNumeric`, which deliberately
 * rejects NaN and both infinities.
 * @param {*} n
 * @returns {boolean}
 */
export function isNumeric(n) {
  return typeof n === 'number' && !isNaN(n) && isFinite(n);
}

/**
 * True when `obj` has finite x, y, width and height.
 * @param {*} obj
 * @returns {boolean}
 */
export function isRectObject(obj) {
  return !!obj && isNumeric(obj.width) && isNumeric(obj.height) && isNumeric(obj.x) && isNumeric(obj.y);
}

/**
 * Clamp a position so the box it anchors stays inside `extent`.
 *
 * The extent's upper bound is reduced by the box size, so the far edge of the
 * box - not its origin - is what gets constrained.
 * @param {import('c/flowTypes').XYPosition} [position]
 * @param {import('c/flowTypes').CoordinateExtent} extent
 * @param {{width?: number, height?: number}} [dimensions]
 * @returns {import('c/flowTypes').XYPosition}
 */
export function clampPosition(position = { x: 0, y: 0 }, extent = infiniteExtent, dimensions = {}) {
  return {
    x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
    y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0)),
  };
}

/**
 * Clamp a child's absolute position so it stays within its parent's box.
 * @param {import('c/flowTypes').XYPosition} childPosition absolute position
 * @param {import('c/flowTypes').Dimensions} childDimensions
 * @param {{internals: {positionAbsolute: import('c/flowTypes').XYPosition}}} parent internal node
 * @returns {import('c/flowTypes').XYPosition}
 */
export function clampPositionToParent(childPosition, childDimensions, parent) {
  const { width: parentWidth, height: parentHeight } = getNodeDimensions(parent);
  const { x: parentX, y: parentY } = parent.internals.positionAbsolute;

  return clampPosition(
    childPosition,
    [
      [parentX, parentY],
      [parentX + parentWidth, parentY + parentHeight],
    ],
    childDimensions
  );
}

/**
 * One-dimensional auto-pan velocity, in the range [-1, 1].
 *
 * Returns 0 in the dead zone between `min` and `max`; outside it, the magnitude
 * ramps from `1/min` up to `1` as the pointer approaches the edge. Negative
 * means the viewport must move the other way.
 * @param {number} value pointer position along one axis, in pane pixels
 * @param {number} min distance from the near edge at which panning starts
 * @param {number} max distance from the far edge at which panning starts
 * @returns {number}
 */
function calcAutoPanVelocity(value, min, max) {
  if (value < min) {
    return clamp(Math.abs(value - min), 1, min) / min;
  }
  if (value > max) {
    return -clamp(Math.abs(value - max), 1, min) / min;
  }
  return 0;
}

/**
 * Per-frame auto-pan delta for a pointer near the pane edge.
 * @param {import('c/flowTypes').XYPosition} pos pointer position in pane pixels
 * @param {import('c/flowTypes').Dimensions} bounds pane size
 * @param {number} [speed=15] pixels per frame at full velocity
 * @param {number} [distance=40] edge band width in pixels
 * @returns {[number, number]} `[dx, dy]`
 */
export function calcAutoPan(pos, bounds, speed = 15, distance = 40) {
  const xMovement = calcAutoPanVelocity(pos.x, distance, bounds.width - distance) * speed;
  const yMovement = calcAutoPanVelocity(pos.y, distance, bounds.height - distance) * speed;

  return [xMovement, yMovement];
}

/**
 * Smallest box containing both boxes.
 * @param {import('c/flowTypes').Box} box1
 * @param {import('c/flowTypes').Box} box2
 * @returns {import('c/flowTypes').Box}
 */
export function getBoundsOfBoxes(box1, box2) {
  return {
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2),
  };
}

/**
 * @param {import('c/flowTypes').Rect} rect
 * @returns {import('c/flowTypes').Box}
 */
export function rectToBox({ x, y, width, height }) {
  return { x, y, x2: x + width, y2: y + height };
}

/**
 * @param {import('c/flowTypes').Box} box
 * @returns {import('c/flowTypes').Rect}
 */
export function boxToRect({ x, y, x2, y2 }) {
  return { x, y, width: x2 - x, height: y2 - y };
}

/**
 * Smallest rect containing both rects.
 * @param {import('c/flowTypes').Rect} rect1
 * @param {import('c/flowTypes').Rect} rect2
 * @returns {import('c/flowTypes').Rect}
 */
export function getBoundsOfRects(rect1, rect2) {
  return boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
}

/**
 * True when the node carries internal bookkeeping, i.e. it has been adopted.
 * @param {*} node
 * @returns {boolean}
 */
export function isInternalNode(node) {
  return !!node && 'internals' in node && !!node.internals;
}

/**
 * Resolve a node's effective size.
 *
 * Precedence is measured, then explicit, then initial, then zero. Upstream uses
 * the same chain everywhere a size is needed, which is why it lives in one
 * place here.
 * @param {{measured?: {width?: number, height?: number}, width?: number, height?: number, initialWidth?: number, initialHeight?: number}} node
 * @returns {import('c/flowTypes').Dimensions}
 */
export function getNodeDimensions(node) {
  return {
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0,
  };
}

/**
 * True once a node has a usable size from any source.
 * @param {*} node
 * @returns {boolean}
 */
export function nodeHasDimensions(node) {
  return (
    (node.measured?.width ?? node.width ?? node.initialWidth) !== undefined &&
    (node.measured?.height ?? node.height ?? node.initialHeight) !== undefined
  );
}

/**
 * A node's stated position shifted by its origin.
 *
 * `origin` is a fraction of the node's own size: `[0,0]` anchors the position
 * at the top-left corner, `[0.5,0.5]` at the centre.
 * @param {*} node
 * @param {import('c/flowTypes').NodeOrigin} [nodeOrigin=[0,0]]
 * @returns {import('c/flowTypes').XYPosition}
 */
export function getNodePositionWithOrigin(node, nodeOrigin = [0, 0]) {
  const { width, height } = getNodeDimensions(node);
  const origin = node.origin ?? nodeOrigin;

  return {
    x: node.position.x - width * origin[0],
    y: node.position.y - height * origin[1],
  };
}

/**
 * Node as an absolutely positioned rect.
 *
 * An adopted node already knows its absolute position; a raw user node only has
 * a parent-relative one, so the origin shift is applied instead.
 * @param {*} node
 * @param {import('c/flowTypes').NodeOrigin} [nodeOrigin=[0,0]]
 * @returns {import('c/flowTypes').Rect}
 */
export function nodeToRect(node, nodeOrigin = [0, 0]) {
  const { x, y } = isInternalNode(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  const { width, height } = getNodeDimensions(node);

  return { x, y, width, height };
}

/**
 * Node as an absolutely positioned box.
 * @param {*} node
 * @param {import('c/flowTypes').NodeOrigin} [nodeOrigin=[0,0]]
 * @returns {import('c/flowTypes').Box}
 */
export function nodeToBox(node, nodeOrigin = [0, 0]) {
  const { x, y } = isInternalNode(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  const { width, height } = getNodeDimensions(node);

  return { x, y, x2: x + width, y2: y + height };
}

/**
 * Area of the intersection of two rects, rounded up. Zero when they miss.
 * @returns {number}
 */
export function getRectsOverlappingArea(aX, aY, aWidth, aHeight, bX, bY, bWidth, bHeight) {
  const xOverlap = Math.max(0, Math.min(aX + aWidth, bX + bWidth) - Math.max(aX, bX));
  const yOverlap = Math.max(0, Math.min(aY + aHeight, bY + bHeight) - Math.max(aY, bY));

  return Math.ceil(xOverlap * yOverlap);
}

/**
 * Area of the intersection of two rects, rounded up. Zero when they miss.
 * @param {import('c/flowTypes').Rect} rectA
 * @param {import('c/flowTypes').Rect} rectB
 * @returns {number}
 */
export function getOverlappingArea(rectA, rectB) {
  return getRectsOverlappingArea(
    rectA.x,
    rectA.y,
    rectA.width,
    rectA.height,
    rectB.x,
    rectB.y,
    rectB.width,
    rectB.height
  );
}

/**
 * Snap a position to the nearest grid intersection.
 * @param {import('c/flowTypes').XYPosition} position
 * @param {import('c/flowTypes').SnapGrid} [snapGrid=[1,1]]
 * @returns {import('c/flowTypes').XYPosition}
 */
export function snapPosition(position, snapGrid = [1, 1]) {
  return {
    x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
    y: snapGrid[1] * Math.round(position.y / snapGrid[1]),
  };
}

/**
 * Pane pixels to flow coordinates.
 * @param {import('c/flowTypes').XYPosition} point position relative to the pane
 * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
 * @param {boolean} [snapToGrid=false]
 * @param {import('c/flowTypes').SnapGrid} [snapGrid=[1,1]]
 * @returns {import('c/flowTypes').XYPosition}
 */
export function pointToRendererPoint({ x, y }, [tx, ty, tScale], snapToGrid = false, snapGrid = [1, 1]) {
  const position = { x: (x - tx) / tScale, y: (y - ty) / tScale };

  return snapToGrid ? snapPosition(position, snapGrid) : position;
}

/**
 * Flow coordinates to pane pixels. Inverse of {@link pointToRendererPoint}.
 * @param {import('c/flowTypes').XYPosition} point
 * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
 * @returns {import('c/flowTypes').XYPosition}
 */
export function rendererPointToPoint({ x, y }, [tx, ty, tScale]) {
  return { x: x * tScale + tx, y: y * tScale + ty };
}

/**
 * True when `extent` is a real coordinate extent rather than the `'parent'` sentinel.
 * @param {*} extent
 * @returns {boolean}
 */
export function isCoordinateExtent(extent) {
  return extent !== undefined && extent !== null && extent !== 'parent';
}

/**
 * Turn a child's parent-relative position into an absolute one.
 *
 * The parent's own origin shifts the child, which is why the child's dimensions
 * are needed even though only the parent moves.
 * @param {import('c/flowTypes').XYPosition} position
 * @param {{width?: number, height?: number}} [dimensions]
 * @param {string} parentId
 * @param {Map<string, *>} nodeLookup
 * @param {import('c/flowTypes').NodeOrigin} nodeOrigin
 * @returns {import('c/flowTypes').XYPosition}
 */
export function evaluateAbsolutePosition(
  position,
  dimensions = { width: 0, height: 0 },
  parentId,
  nodeLookup,
  nodeOrigin
) {
  const positionAbsolute = { ...position };
  const parent = nodeLookup.get(parentId);

  if (parent) {
    const origin = parent.origin || nodeOrigin;
    positionAbsolute.x += parent.internals.positionAbsolute.x - (dimensions.width ?? 0) * origin[0];
    positionAbsolute.y += parent.internals.positionAbsolute.y - (dimensions.height ?? 0) * origin[1];
  }

  return positionAbsolute;
}

/**
 * Set equality by membership.
 * @param {Set<string>} a
 * @param {Set<string>} b
 * @returns {boolean}
 */
export function areSetsEqual(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
}

/**
 * Resolve one padding value to pixels.
 *
 * A number is a fraction of the viewport expressed the way upstream does it:
 * the viewport is divided by `1 + padding` and half the difference becomes the
 * padding, so `0.1` leaves roughly 4.5% on each side rather than 10%. Strings
 * ending in `px` or `%` are taken literally.
 * @param {number|string} padding
 * @param {number} viewport width or height in pixels
 * @returns {number} pixels, floored
 */
function parsePadding(padding, viewport) {
  if (typeof padding === 'number') {
    return Math.floor((viewport - viewport / (1 + padding)) * 0.5);
  }

  if (typeof padding === 'string' && padding.endsWith('px')) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(paddingValue);
    }
  }

  if (typeof padding === 'string' && padding.endsWith('%')) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(viewport * paddingValue * 0.01);
    }
  }

  return 0;
}

/**
 * Resolve a padding shorthand to per-side pixels plus the axis totals.
 * @param {number|string|{top?: *, right?: *, bottom?: *, left?: *, x?: *, y?: *}} padding
 * @param {number} width
 * @param {number} height
 * @returns {{top: number, right: number, bottom: number, left: number, x: number, y: number}}
 */
function parsePaddings(padding, width, height) {
  if (typeof padding === 'string' || typeof padding === 'number') {
    const paddingY = parsePadding(padding, height);
    const paddingX = parsePadding(padding, width);

    return {
      top: paddingY,
      right: paddingX,
      bottom: paddingY,
      left: paddingX,
      x: paddingX * 2,
      y: paddingY * 2,
    };
  }

  if (padding && typeof padding === 'object') {
    const top = parsePadding(padding.top ?? padding.y ?? 0, height);
    const bottom = parsePadding(padding.bottom ?? padding.y ?? 0, height);
    const left = parsePadding(padding.left ?? padding.x ?? 0, width);
    const right = parsePadding(padding.right ?? padding.x ?? 0, width);

    return { top, right, bottom, left, x: left + right, y: top + bottom };
  }

  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}

/**
 * The padding a candidate viewport would actually leave around `bounds`.
 * @returns {{left: number, top: number, right: number, bottom: number}}
 */
function calculateAppliedPaddings(bounds, x, y, zoom, width, height) {
  const { x: left, y: top } = rendererPointToPoint(bounds, [x, y, zoom]);
  const { x: boundRight, y: boundBottom } = rendererPointToPoint(
    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
    [x, y, zoom]
  );

  return {
    left: Math.floor(left),
    top: Math.floor(top),
    right: Math.floor(width - boundRight),
    bottom: Math.floor(height - boundBottom),
  };
}

/**
 * Viewport that encloses `bounds` inside a `width` x `height` pane.
 *
 * Centres the bounds at the largest zoom that fits both axes, clamps that zoom,
 * then nudges the result so asymmetric padding is respected. The nudge only
 * ever pulls inward: `Math.min(..., 0)` discards slack when the fitted view
 * already leaves more room than requested.
 * @param {import('c/flowTypes').Rect} bounds
 * @param {number} width
 * @param {number} height
 * @param {number} minZoom
 * @param {number} maxZoom
 * @param {number|string|Object} padding
 * @returns {import('c/flowTypes').Viewport}
 */
export function getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding) {
  const p = parsePaddings(padding, width, height);

  const xZoom = (width - p.x) / bounds.width;
  const yZoom = (height - p.y) / bounds.height;

  const zoom = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom, minZoom, maxZoom);

  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y = height / 2 - boundsCenterY * clampedZoom;

  const newPadding = calculateAppliedPaddings(bounds, x, y, clampedZoom, width, height);

  const offset = {
    left: Math.min(newPadding.left - p.left, 0),
    top: Math.min(newPadding.top - p.top, 0),
    right: Math.min(newPadding.right - p.right, 0),
    bottom: Math.min(newPadding.bottom - p.bottom, 0),
  };

  return {
    x: x - offset.left + offset.right,
    y: y - offset.top + offset.bottom,
    zoom: clampedZoom,
  };
}

/**
 * Bounding rect of a set of nodes, given as nodes or as ids.
 *
 * Entries that cannot be resolved are skipped. Merging a phantom box for a
 * stale id would stretch the bounds to include the origin, which is why the
 * accumulator starts at infinity and an all-unresolved set returns a zero rect
 * rather than the infinite one.
 * @param {Array<*|string>|Map<string, *>} nodes
 * @param {{nodeOrigin?: import('c/flowTypes').NodeOrigin, nodeLookup?: Map<string, *>}} [params]
 * @returns {import('c/flowTypes').Rect}
 */
export function getNodesBounds(nodes, params = {}) {
  const nodeOrigin = params.nodeOrigin ?? [0, 0];
  const nodeLookup = params.nodeLookup;
  const list = nodes instanceof Map ? Array.from(nodes.values()) : nodes;

  if (list.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let hasNode = false;
  let box = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };

  for (const nodeOrId of list) {
    const isId = typeof nodeOrId === 'string';
    let currentNode = !nodeLookup && !isId ? nodeOrId : undefined;

    if (nodeLookup) {
      if (isId) {
        currentNode = nodeLookup.get(nodeOrId);
      } else if (!isInternalNode(nodeOrId)) {
        currentNode = nodeLookup.get(nodeOrId.id);
      } else {
        currentNode = nodeOrId;
      }
    }

    if (!currentNode) {
      continue;
    }

    hasNode = true;
    box = getBoundsOfBoxes(box, nodeToBox(currentNode, nodeOrigin));
  }

  return hasNode ? boxToRect(box) : { x: 0, y: 0, width: 0, height: 0 };
}

/**
 * Bounding rect of every internal node passing `filter`.
 * @param {Map<string, *>} nodeLookup
 * @param {{filter?: (node: *) => boolean}} [params]
 * @returns {import('c/flowTypes').Rect}
 */
export function getInternalNodesBounds(nodeLookup, params = {}) {
  let box = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
  let hasVisibleNodes = false;

  nodeLookup.forEach((node) => {
    if (params.filter === undefined || params.filter(node)) {
      box = getBoundsOfBoxes(box, nodeToBox(node));
      hasVisibleNodes = true;
    }
  });

  return hasVisibleNodes ? boxToRect(box) : { x: 0, y: 0, width: 0, height: 0 };
}

/**
 * The visible flow-coordinate rect for a pane of `width` x `height`.
 * @param {number} width
 * @param {number} height
 * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
 * @returns {import('c/flowTypes').Rect}
 */
export function getViewportRect(width, height, [tx, ty, tScale]) {
  return {
    x: -tx / tScale,
    y: -ty / tScale,
    width: width / tScale,
    height: height / tScale,
  };
}

/**
 * Internal nodes intersecting a rect given in pane pixels.
 *
 * Used both for `onlyRenderVisibleElements` culling and for marquee selection.
 * `partially` selects on any overlap; otherwise the node must be fully covered.
 *
 * A node that has never been measured has no `handleBounds`, and is reported
 * visible regardless of geometry. That is deliberate and load-bearing: an
 * unmeasured node must render once so the DOM can be measured, otherwise
 * culling would keep it out of the DOM forever and it would never gain a size.
 * @param {Map<string, *>|Array<*>} nodes internal nodes
 * @param {import('c/flowTypes').Rect} rect in pane pixels
 * @param {import('c/flowTypes').Transform} [transform=[0,0,1]]
 * @param {boolean} [partially=false]
 * @param {boolean} [excludeNonSelectableNodes=false]
 * @returns {Array<*>}
 */
export function getNodesInside(
  nodes,
  rect,
  [tx, ty, tScale] = [0, 0, 1],
  partially = false,
  excludeNonSelectableNodes = false
) {
  // Viewport in flow coordinates, kept as scalars to avoid a Rect per node.
  const paneX = (rect.x - tx) / tScale;
  const paneY = (rect.y - ty) / tScale;
  const paneWidth = rect.width / tScale;
  const paneHeight = rect.height / tScale;

  const list = nodes instanceof Map ? Array.from(nodes.values()) : nodes;
  const visibleNodes = [];

  for (const node of list) {
    const { measured, selectable = true, hidden = false } = node;

    if ((excludeNonSelectableNodes && !selectable) || hidden) {
      continue;
    }

    const width = measured?.width ?? node.width ?? node.initialWidth ?? 0;
    const height = measured?.height ?? node.height ?? node.initialHeight ?? 0;
    const { x, y } = node.internals.positionAbsolute;

    const overlappingArea = getRectsOverlappingArea(paneX, paneY, paneWidth, paneHeight, x, y, width, height);
    const area = width * height;

    const partiallyVisible = partially && overlappingArea > 0;
    const forceInitialRender = !node.internals.handleBounds;
    const isVisible = forceInitialRender || partiallyVisible || overlappingArea >= area;

    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  }

  return visibleNodes;
}

/**
 * Absolute position of one handle, in flow coordinates.
 *
 * Handle bounds are stored relative to the node, so the node's absolute
 * position is added back. The handle's own extent is halved to land on its
 * centre, then the connecting side is snapped flush to the node edge so an edge
 * meets the node rather than the middle of the dot.
 * @param {*} node internal node
 * @param {import('c/flowTypes').FlowHandle} handle
 * @param {Position} [fallbackPosition] used when `handle.position` is absent
 * @param {boolean} [center=false] ignore the side snap and return the raw centre
 * @returns {import('c/flowTypes').XYPosition}
 */
export function getHandlePosition(node, handle, fallbackPosition = Position.Left, center = false) {
  const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
  const y = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
  const { width, height } = handle ? { width: handle.width, height: handle.height } : getNodeDimensions(node);

  if (center) {
    return { x: x + width / 2, y: y + height / 2 };
  }

  const position = handle?.position ?? fallbackPosition;

  switch (position) {
    case Position.Top:
      return { x: x + width / 2, y };
    case Position.Right:
      return { x: x + width, y: y + height / 2 };
    case Position.Bottom:
      return { x: x + width / 2, y: y + height };
    case Position.Left:
    default:
      return { x, y: y + height / 2 };
  }
}
