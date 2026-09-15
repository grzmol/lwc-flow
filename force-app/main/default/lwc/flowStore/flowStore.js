/**
 * The per-flow state container for lwc-flow.
 *
 * Service component: no template, no LWC imports, no DOM access.
 *
 * ## Why this shape
 *
 * React Flow keeps state in a Zustand store reached through React context. LWC
 * has no context, and the three obvious substitutes are all wrong here:
 *
 * - Threading state through `@api` properties re-renders the whole subtree on
 *   every pointer move, because the viewport changes at pointer frequency.
 * - A module-level singleton is the `pubsub.js` anti-pattern, and breaks the
 *   moment two flows share a Lightning page.
 * - Lightning Message Service is org-global, asynchronous, needs a
 *   `MessageChannel` metadata type, and has no concept of "this flow".
 *
 * So the root component calls {@link createFlowStore} once and hands the
 * instance down as an `@api store` property. Children subscribe with a selector
 * in `connectedCallback` and unsubscribe in `disconnectedCallback`. Nothing is
 * reachable without the reference, two flows are fully isolated, and the
 * subscription lifecycle is explicit and therefore leak-free.
 *
 * ## Subscription model
 *
 * A subscriber supplies a selector and a callback. The selector runs on every
 * commit; the callback only fires when its result changes under the comparator.
 * That keeps a node component from re-rendering because an unrelated edge moved.
 * The default comparator is `Object.is`, so a selector returning a fresh object
 * every call would fire every commit - selectors should return primitives, or a
 * stable reference, or pass a comparator.
 */

import { infiniteExtent, ConnectionMode, SelectionMode, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM } from 'c/flowTypes';
import { adoptUserNodes, updateConnectionLookup, getSelectionChanges } from 'c/flowGraph';
import { getNodesInside, areSetsEqual } from 'c/flowMath';

/**
 * State every flow starts with.
 *
 * Kept as a factory rather than a shared frozen object because the Maps and
 * arrays here are mutated in place by the graph derivation.
 * @returns {Object}
 */
function createInitialState() {
  return {
    // graph input, owned by the consumer
    nodes: [],
    edges: [],

    // derived graph views, rebuilt by setNodes/setEdges
    nodeLookup: new Map(),
    parentLookup: new Map(),
    edgeLookup: new Map(),
    connectionLookup: new Map(),

    // pane geometry
    width: 0,
    height: 0,
    transform: [0, 0, 1],

    // lifecycle
    nodesInitialized: false,
    fitViewQueued: false,
    fitViewOptions: undefined,
    panZoom: null,
    domNode: null,

    // viewport configuration
    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    translateExtent: infiniteExtent,
    nodeExtent: infiniteExtent,
    nodeOrigin: [0, 0],
    snapToGrid: false,
    snapGrid: [15, 15],
    onlyRenderVisibleElements: false,

    // interaction flags
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesReconnectable: false,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: false,
    zIndexMode: 'basic',
    selectNodesOnDrag: true,
    autoPanOnNodeDrag: true,
    autoPanOnConnect: true,
    autoPanSpeed: 15,
    connectionMode: ConnectionMode.Strict,
    connectionRadius: 20,
    selectionMode: SelectionMode.Full,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    paneClickDistance: 0,
    nodeClickDistance: 0,

    // transient gesture state
    dragging: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connection: { inProgress: false },
    multiSelectionActive: false,

    // key state, driven by the renderer's global key handler
    selectionKeyPressed: false,
    deleteKeyPressed: false,
    multiSelectionKeyPressed: false,
    panActivationKeyPressed: false,
    zoomActivationKeyPressed: false,

    // type registries: type name -> LWC constructor, for lwc:is
    nodeTypes: {},
    edgeTypes: {},

    // reporting
    onError: undefined,
    ariaLabelConfig: undefined,
  };
}

/**
 * A flow's state container.
 *
 * Not exported directly; construct through {@link createFlowStore}.
 */
class FlowStore {
  /** @type {Object} current state; treat as read-only from outside */
  state;

  /** @type {Set<{selector: Function, callback: Function, compare: Function, last: *}>} */
  #subscribers = new Set();

  /** Commit depth, so nested `update` calls notify once at the outermost exit. */
  #batchDepth = 0;

  /** Set while a batch is open and at least one `update` landed. */
  #dirty = false;

  constructor() {
    this.state = createInitialState();
  }

  /**
   * Subscribe to a slice of state.
   *
   * The callback fires immediately with the current value so a subscriber does
   * not need a separate initial read, and then on every change.
   * @param {(state: Object) => *} selector
   * @param {(value: *, previous: *) => void} callback
   * @param {{compare?: (a: *, b: *) => boolean, immediate?: boolean}} [options]
   * @returns {() => void} unsubscribe
   */
  subscribe(selector, callback, options = {}) {
    const entry = {
      selector,
      callback,
      compare: options.compare ?? Object.is,
      last: selector(this.state),
    };

    this.#subscribers.add(entry);

    if (options.immediate !== false) {
      callback(entry.last, undefined);
    }

    return () => {
      this.#subscribers.delete(entry);
    };
  }

  /** Drop every subscriber. Called by the root component on teardown. */
  destroy() {
    this.#subscribers.clear();
  }

  /**
   * Merge a partial state and notify affected subscribers.
   *
   * Accepts an updater function for the read-modify-write case, so a caller
   * never has to read `state` and risk acting on a stale copy.
   * @param {Object|((state: Object) => Object)} partial
   */
  update(partial) {
    const patch = typeof partial === 'function' ? partial(this.state) : partial;

    if (!patch) {
      return;
    }

    this.state = { ...this.state, ...patch };
    this.#dirty = true;

    if (this.#batchDepth === 0) {
      this._flush();
    }
  }

  /**
   * Run `fn` with notification deferred until it returns.
   *
   * Several `update` calls that belong to one logical change would otherwise
   * each notify, and a subscriber could observe a half-applied state - for
   * example new nodes with a stale lookup.
   * @template T
   * @param {() => T} fn
   * @returns {T}
   */
  batch(fn) {
    this.#batchDepth++;
    try {
      return fn();
    } finally {
      this.#batchDepth--;
      if (this.#batchDepth === 0 && this.#dirty) {
        this._flush();
      }
    }
  }

  _flush() {
    this.#dirty = false;

    /*
     * Iterate a copy: a callback may subscribe or unsubscribe, and mutating
     * the Set mid-iteration would skip or repeat entries.
     */
    for (const entry of Array.from(this.#subscribers)) {
      if (!this.#subscribers.has(entry)) {
        continue;
      }

      const next = entry.selector(this.state);

      if (!entry.compare(next, entry.last)) {
        const previous = entry.last;
        entry.last = next;
        entry.callback(next, previous);
      }
    }
  }

  // ---------------------------------------------------------------- graph

  /**
   * Replace the node array and rederive the internal view.
   *
   * The lookups are mutated in place by `adoptUserNodes`, so they keep their
   * identity across calls; subscribers must select into them rather than
   * comparing the Map by reference.
   * @param {Array<*>} nodes
   */
  setNodes(nodes) {
    const s = this.state;
    const { nodesInitialized } = adoptUserNodes(nodes, s.nodeLookup, s.parentLookup, {
      nodeOrigin: s.nodeOrigin,
      nodeExtent: s.nodeExtent,
      elevateNodesOnSelect: s.elevateNodesOnSelect,
      zIndexMode: s.zIndexMode,
      checkEquality: true,
      onError: s.onError,
    });

    this.update({ nodes, nodesInitialized, nodeVersion: (s.nodeVersion ?? 0) + 1 });
  }

  /**
   * Replace the edge array and rebuild the edge and connection lookups.
   * @param {Array<*>} edges
   */
  setEdges(edges) {
    const s = this.state;
    updateConnectionLookup(s.connectionLookup, s.edgeLookup, edges);

    this.update({ edges, edgeVersion: (s.edgeVersion ?? 0) + 1 });
  }

  /**
   * Re-run node adoption without a new node array.
   *
   * Needed after anything adoption depends on changes: `nodeOrigin`,
   * `nodeExtent`, `elevateNodesOnSelect`, `zIndexMode`.
   */
  refreshNodeInternals() {
    this.setNodes(this.state.nodes);
  }

  /**
   * Apply a node's DOM measurement to its internal node.
   *
   * Upstream's `updateNodeInternals` in store terms. The internal node is
   * mutated rather than rebuilt, exactly as upstream mutates its `nodeLookup`
   * entry: the consumer's node object is the one thing that must not change,
   * and `measured` plus `internals.handleBounds` live on the internal copy.
   *
   * Re-adopting afterwards is what flips `nodesInitialized`, and node adoption
   * keeps an internal node whose `userNode` is unchanged, so the measurement
   * just written survives the pass.
   *
   * A zero measurement is refused, as upstream refuses one: a node inside a
   * collapsed or `display: none` subtree measures 0x0, and letting that land
   * would throw away a size the consumer declared and break every rect the
   * node takes part in.
   * @param {string} id
   * @param {{width: number, height: number}} dimensions
   * @param {{source: Array<*>|null, target: Array<*>|null}} handleBounds
   * @returns {boolean} whether the measurement was applied
   */
  applyNodeMeasurement(id, dimensions, handleBounds) {
    const internalNode = this.state.nodeLookup.get(id);

    if (!internalNode || !dimensions?.width || !dimensions?.height) {
      return false;
    }

    internalNode.measured = { width: dimensions.width, height: dimensions.height };
    internalNode.internals.handleBounds = handleBounds;
    this.refreshNodeInternals();

    return true;
  }

  /**
   * Look up an internal node.
   * @param {string} id
   * @returns {*|undefined}
   */
  getInternalNode(id) {
    return this.state.nodeLookup.get(id);
  }

  // ------------------------------------------------------------ selection

  /**
   * Select exactly `nodeIds` and `edgeIds`, emitting the minimal change set.
   *
   * Returns the changes rather than applying them: the consumer owns the node
   * and edge arrays, so selection has to travel out through `onnodeschange`
   * and `onedgeschange` like any other change.
   *
   * Nodes and edges are deliberately asymmetric here, matching upstream.
   * Node selection is written onto the INTERNAL node, which `adoptUserNodes`
   * created and owns, so calling this twice with the same selection is a
   * no-op the second time. `edgeLookup` holds the CONSUMER'S own edge objects
   * by reference, so writing `selected` there would mutate the caller's
   * array; edges are left alone and their change is re-emitted until the
   * consumer applies it. Guard the call with a set comparison if repeated
   * emission matters - that is what upstream's `Pane` does.
   * @param {Set<string>|Array<string>} [nodeIds]
   * @param {Set<string>|Array<string>} [edgeIds]
   * @returns {{nodeChanges: Array<*>, edgeChanges: Array<*>}}
   */
  getSelectionChangesFor(nodeIds, edgeIds) {
    const s = this.state;
    const nodeSet = nodeIds instanceof Set ? nodeIds : new Set(nodeIds ?? []);
    const edgeSet = edgeIds instanceof Set ? edgeIds : new Set(edgeIds ?? []);

    return {
      nodeChanges: getSelectionChanges(s.nodeLookup, nodeSet, true),
      edgeChanges: getSelectionChanges(s.edgeLookup, edgeSet, false),
    };
  }

  /**
   * Ids of nodes intersecting a pane-pixel rect, honouring `selectionMode`.
   * @param {import('c/flowTypes').Rect} rect
   * @returns {Array<string>}
   */
  getNodeIdsInRect(rect) {
    const s = this.state;

    return getNodesInside(s.nodeLookup, rect, s.transform, s.selectionMode === SelectionMode.Partial, true).map(
      (node) => node.id
    );
  }

  /**
   * Currently selected node ids.
   * @returns {Set<string>}
   */
  getSelectedNodeIds() {
    const ids = new Set();

    for (const [id, node] of this.state.nodeLookup) {
      if (node.selected) {
        ids.add(id);
      }
    }

    return ids;
  }

  /**
   * Currently selected edge ids.
   * @returns {Set<string>}
   */
  getSelectedEdgeIds() {
    const ids = new Set();

    for (const edge of this.state.edges) {
      if (edge.selected) {
        ids.add(edge.id);
      }
    }

    return ids;
  }

  // ------------------------------------------------------------- viewport

  /**
   * Write the transform.
   *
   * Skips the commit when nothing moved, because this is called from the
   * pan/zoom gesture at pointer frequency and an identical write would still
   * notify every viewport subscriber.
   * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
   */
  setTransform(transform) {
    const [x, y, k] = this.state.transform;

    if (transform[0] === x && transform[1] === y && transform[2] === k) {
      return;
    }

    this.update({ transform });
  }

  /**
   * Record the pane size.
   * @param {number} width
   * @param {number} height
   */
  setDimensions(width, height) {
    if (this.state.width === width && this.state.height === height) {
      return;
    }

    this.update({ width, height });
  }

  /** Current viewport as `{x, y, zoom}`. @returns {import('c/flowTypes').Viewport} */
  getViewport() {
    const [x, y, zoom] = this.state.transform;

    return { x, y, zoom };
  }

  // ------------------------------------------------------------ utilities

  /**
   * True when the two id sets differ. Used to skip redundant selection work.
   * @param {Set<string>} a
   * @param {Set<string>} b
   * @returns {boolean}
   */
  static selectionChanged(a, b) {
    return !areSetsEqual(a, b);
  }
}

/**
 * Create a flow store.
 *
 * One per `c-flow` instance. The root component owns it, passes it down as
 * `@api store`, and calls `destroy()` in `disconnectedCallback`.
 * @param {Object} [overrides] initial state overrides, typically the root's props
 * @returns {FlowStore}
 */
export function createFlowStore(overrides = {}) {
  const store = new FlowStore();

  if (overrides && Object.keys(overrides).length > 0) {
    store.state = { ...store.state, ...overrides };
  }

  return store;
}

/**
 * Selector helper: shallow array equality, for selectors returning id lists.
 * @param {Array<*>} a
 * @param {Array<*>} b
 * @returns {boolean}
 */
export function shallowArrayEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Selector helper: shallow object equality one level deep.
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
export function shallowObjectEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  const ka = Object.keys(a);
  const kb = Object.keys(b);

  if (ka.length !== kb.length) {
    return false;
  }

  for (const key of ka) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
