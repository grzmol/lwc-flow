/**
 * Shared enumerations, constants and typedefs for lwc-flow.
 *
 * Service component: no template, no LWC imports. Ported from
 * `@xyflow/system/src/types` and `@xyflow/system/src/constants.ts`.
 */

/**
 * Side of a node that a handle sits on.
 * @readonly
 * @enum {string}
 */
export const Position = Object.freeze({
  Left: 'left',
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
});

/** Opposite side for each {@link Position}. Used when a handle position must be mirrored. */
export const oppositePosition = Object.freeze({
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top,
});

/**
 * Which connections a handle will accept.
 * - `strict`: source may only connect to target.
 * - `loose`: any handle may connect to any other handle.
 * @readonly
 * @enum {string}
 */
export const ConnectionMode = Object.freeze({
  Strict: 'strict',
  Loose: 'loose',
});

/**
 * Built-in shape of the in-flight connection line.
 * @readonly
 * @enum {string}
 */
export const ConnectionLineType = Object.freeze({
  Bezier: 'default',
  Straight: 'straight',
  Step: 'step',
  SmoothStep: 'smoothstep',
  SimpleBezier: 'simplebezier',
});

/**
 * Marker rendered at an edge end.
 * @readonly
 * @enum {string}
 */
export const MarkerType = Object.freeze({
  Arrow: 'arrow',
  ArrowClosed: 'arrowclosed',
});

/**
 * How a node must overlap the marquee rectangle to be selected.
 * - `partial`: any overlap selects.
 * - `full`: the node must be entirely inside.
 * @readonly
 * @enum {string}
 */
export const SelectionMode = Object.freeze({
  Partial: 'partial',
  Full: 'full',
});

/**
 * Axis constraint applied while panning with the scroll wheel.
 * @readonly
 * @enum {string}
 */
export const PanOnScrollMode = Object.freeze({
  Free: 'free',
  Vertical: 'vertical',
  Horizontal: 'horizontal',
});

/** An extent that imposes no constraint. */
export const infiniteExtent = Object.freeze([
  Object.freeze([Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]),
  Object.freeze([Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]),
]);

/** Keys that select or cancel a focused node or edge. */
export const elementSelectionKeys = Object.freeze(['Enter', ' ', 'Escape']);

/**
 * CSS class names the flow reacts to on user markup. Upstream reads these off
 * the DOM to opt an element out of a gesture.
 */
export const interactionClass = Object.freeze({
  /** Element does not start a node drag. */
  noDrag: 'nodrag',
  /** Element does not pan the viewport. */
  noPan: 'nopan',
  /** Element keeps its own wheel handling; the viewport does not zoom. */
  noWheel: 'nowheel',
  /** Marks an element as a drag handle for its node. */
  dragHandle: 'drag-handle',
});

/** z-index added to a selected element when `elevateOnSelect` is on. */
export const ELEVATE_ON_SELECT_Z = 1000;

/** Default pointer-to-handle capture radius, in flow units. */
export const DEFAULT_CONNECTION_RADIUS = 20;

/** Default stroke width of an edge's invisible interaction path. */
export const DEFAULT_INTERACTION_WIDTH = 20;

/** Default auto-pan speed in pixels per frame. */
export const DEFAULT_AUTO_PAN_SPEED = 15;

/** Distance from the pane edge at which auto-pan engages, in pixels. */
export const AUTO_PAN_DISTANCE = 40;

/** Extra distance added when searching for a connectable handle. */
export const HANDLE_SEARCH_PADDING = 250;

/** Default viewport zoom bounds. */
export const DEFAULT_MIN_ZOOM = 0.5;
export const DEFAULT_MAX_ZOOM = 2;

/** Default duration in ms of a viewport transition when one is requested. */
export const DEFAULT_TRANSITION_DURATION = 0;

/** Error and warning text, keyed the same way as upstream so reports are comparable. */
export const errorMessages = Object.freeze({
  error002: () =>
    "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component.",
  error003: (nodeType) => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => 'The parent container needs a width and a height to render the graph.',
  error005: () => 'Only child nodes can use a parent extent.',
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (id) => `The old edge with id=${id} does not exist.`,
  error009: (type) => `Marker type "${type}" doesn't exist.`,
  error010: () => 'Handle: No node id found. Make sure to only use a handle inside a custom node.',
  error011: (edgeType) => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: (id) =>
    `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before its click handler is called.`,
  error015: () => 'It seems that you are trying to drag a node that is not initialized.',
  error016: (id) =>
    `Edge with id "${id}" does not exist, it may have been removed. This can happen when an edge is deleted before its click handler is called.`,
});

/** Default accessible labels, overridable per flow. */
export const defaultAriaLabelConfig = Object.freeze({
  'node.a11yDescription.default':
    'Press enter or space to select a node. Press delete to remove it and escape to cancel.',
  'node.a11yDescription.keyboardDisabled':
    'Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.',
  'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
    `Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
  'edge.a11yDescription.default':
    'Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.',
  'controls.ariaLabel': 'Control Panel',
  'controls.zoomIn.ariaLabel': 'Zoom In',
  'controls.zoomOut.ariaLabel': 'Zoom Out',
  'controls.fitView.ariaLabel': 'Fit View',
  'controls.interactive.ariaLabel': 'Toggle Interactivity',
  'minimap.ariaLabel': 'Mini Map',
  'handle.ariaLabel': 'Handle',
});

/**
 * Merge a partial aria-label override map over the defaults.
 * @param {Object} [partial]
 * @returns {Object} complete label config
 */
export function mergeAriaLabelConfig(partial) {
  return { ...defaultAriaLabelConfig, ...(partial || {}) };
}

/**
 * @typedef {{x: number, y: number}} XYPosition
 * @typedef {{width: number, height: number}} Dimensions
 * @typedef {{x: number, y: number, width: number, height: number}} Rect
 * @typedef {{x: number, y: number, x2: number, y2: number}} Box
 * @typedef {{x: number, y: number, zoom: number}} Viewport
 * @typedef {[number, number, number]} Transform `[translateX, translateY, scale]`
 * @typedef {[[number, number], [number, number]]} CoordinateExtent `[[minX, minY], [maxX, maxY]]`
 * @typedef {[number, number]} NodeOrigin fraction of the node's own size, `[0,0]` is top-left
 * @typedef {[number, number]} SnapGrid
 */

/**
 * @typedef {Object} FlowNode
 * @property {string} id
 * @property {XYPosition} position position relative to the parent, or absolute when no parent
 * @property {Object} [data]
 * @property {string} [type] key into the `nodeTypes` map
 * @property {number} [width] explicit width; overrides measurement
 * @property {number} [height] explicit height; overrides measurement
 * @property {number} [initialWidth] width used before the first measurement
 * @property {number} [initialHeight] height used before the first measurement
 * @property {Dimensions} [measured] filled in by the renderer after layout
 * @property {string} [parentId]
 * @property {CoordinateExtent|'parent'} [extent]
 * @property {NodeOrigin} [origin]
 * @property {boolean} [selected]
 * @property {boolean} [hidden]
 * @property {boolean} [draggable]
 * @property {boolean} [selectable]
 * @property {boolean} [connectable]
 * @property {boolean} [deletable]
 * @property {boolean} [focusable]
 * @property {string} [dragHandle] CSS selector of the element that starts a drag
 * @property {Position} [sourcePosition]
 * @property {Position} [targetPosition]
 * @property {number} [zIndex]
 * @property {string} [className]
 * @property {Object} [style]
 * @property {string} [ariaLabel]
 */

/**
 * @typedef {Object} FlowEdge
 * @property {string} id
 * @property {string} source
 * @property {string} target
 * @property {string|null} [sourceHandle]
 * @property {string|null} [targetHandle]
 * @property {string} [type] key into the `edgeTypes` map
 * @property {Object} [data]
 * @property {string} [label]
 * @property {boolean} [animated]
 * @property {boolean} [selected]
 * @property {boolean} [hidden]
 * @property {boolean} [selectable]
 * @property {boolean} [deletable]
 * @property {boolean} [focusable]
 * @property {boolean} [reconnectable]
 * @property {number} [interactionWidth]
 * @property {number} [zIndex]
 * @property {string} [className]
 * @property {Object} [style]
 * @property {Object|string} [markerStart]
 * @property {Object|string} [markerEnd]
 * @property {string} [ariaLabel]
 */

/**
 * @typedef {Object} Connection
 * @property {string} source
 * @property {string} target
 * @property {string|null} sourceHandle
 * @property {string|null} targetHandle
 */

/**
 * @typedef {Object} FlowHandle
 * @property {string|null} id
 * @property {'source'|'target'} type
 * @property {Position} position
 * @property {number} x node-relative x
 * @property {number} y node-relative y
 * @property {number} width
 * @property {number} height
 */
