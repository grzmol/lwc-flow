import { LightningElement, api } from 'lwc';
import {
  ConnectionMode,
  ConnectionLineType,
  SelectionMode,
  PanOnScrollMode,
  infiniteExtent,
  mergeAriaLabelConfig,
  DEFAULT_MIN_ZOOM,
  DEFAULT_MAX_ZOOM,
  DEFAULT_CONNECTION_RADIUS,
  DEFAULT_AUTO_PAN_SPEED,
} from 'c/flowTypes';
import { createFlowStore, shallowArrayEqual } from 'c/flowStore';
import { createPanZoom } from 'c/flowPanZoom';
import { isInputDOMNode } from 'c/flowDom';
import {
  getViewportForBounds,
  getNodesBounds,
  getInternalNodesBounds,
  pointToRendererPoint,
  rendererPointToPoint,
  nodeToRect,
  getOverlappingArea,
  nodeHasDimensions,
  clamp,
} from 'c/flowMath';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as addEdgeToArray,
  reconnectEdge as reconnectEdgeInArray,
  elementToRemoveChange,
} from 'c/flowGraph';

/**
 * Coerce an attribute-or-property value to a boolean, keeping `fallback` when
 * nothing was supplied.
 *
 * A declarative attribute always arrives as a string, so `"false"` has to be
 * treated as false; an empty string means the attribute was present with no
 * value, which HTML defines as true.
 * @param {*} value
 * @param {boolean} fallback
 * @returns {boolean}
 */
function toBool(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'string') {
    return value !== 'false';
  }

  return Boolean(value);
}

/**
 * `c-flow` - the root of a flow.
 *
 * Owns the store, creates the pan/zoom controller, and exposes the public
 * instance API. Everything below it receives the store as `@api store`; see
 * `docs/ARCHITECTURE.md` decision 2 for why that is the LWC substitute for
 * React context.
 *
 * ## Controlled by default
 *
 * Like xyflow, this component does not own the graph. `nodes` and `edges` come
 * in as properties and every mutation leaves as an `onnodeschange` /
 * `onedgeschange` event carrying a change array, which the consumer folds back
 * in with `applyNodeChanges` / `applyEdgeChanges`. That is what makes undo,
 * validation and server persistence possible without the flow knowing about
 * any of them.
 */
export default class Flow extends LightningElement {
  // ------------------------------------------------------------------ data

  #nodes = [];
  #edges = [];

  /**
   * The nodes to render. Parents must precede their children.
   * @type {Array<import('c/flowTypes').FlowNode>}
   */
  @api
  get nodes() {
    return this.#nodes;
  }
  set nodes(value) {
    // Normalise on the way in; the owner's array is never mutated.
    this.#nodes = Array.isArray(value) ? value : [];
    this.#store?.setNodes(this.#nodes);
  }

  /**
   * The edges to render.
   * @type {Array<import('c/flowTypes').FlowEdge>}
   */
  @api
  get edges() {
    return this.#edges;
  }
  set edges(value) {
    this.#edges = Array.isArray(value) ? value : [];
    this.#store?.setEdges(this.#edges);
  }

  /** Type name to LWC constructor, for custom nodes. */
  @api nodeTypes;

  /** Type name to `{ getPath, defaults }`, for custom edges. */
  @api edgeTypes;

  // -------------------------------------------------------------- viewport

  @api minZoom = DEFAULT_MIN_ZOOM;
  @api maxZoom = DEFAULT_MAX_ZOOM;
  @api translateExtent = infiniteExtent;
  @api nodeExtent = infiniteExtent;
  @api nodeOrigin = [0, 0];
  @api defaultViewport = { x: 0, y: 0, zoom: 1 };

  /** Fit the graph into view once nodes have been measured. */
  @api fitView = false;
  @api fitViewOptions;

  @api snapToGrid = false;
  @api snapGrid = [15, 15];

  /**
   * Render only nodes and edges intersecting the viewport.
   *
   * Named `renderVisibleOnly` rather than upstream's `onlyRenderVisibleElements`
   * because LWC reserves every public property beginning with `on` for event
   * handlers (LWC1108). The store field keeps the upstream name.
   */
  @api renderVisibleOnly = false;

  // ----------------------------------------------------------- interaction

  /*
   * Booleans whose upstream default is `true` are getter/setter pairs, not
   * plain fields.
   *
   * LWC1099 forbids a public boolean property from defaulting to `true`,
   * because an HTML attribute's presence is what makes it true and its
   * absence must therefore mean false. The validator only rejects a literal
   * `= true` initializer (`isBooleanPropDefaultTrue` tests for a
   * `BooleanLiteral`), so an accessor pair keeps both the upstream name and
   * the upstream default. `_toBool` also accepts the string "false", which is
   * what a declarative `nodes-draggable="false"` attribute actually delivers.
   */

  _nodesDraggable = true;

  /** Nodes may be dragged. @type {boolean} @default true */
  @api
  get nodesDraggable() {
    return this._nodesDraggable;
  }
  set nodesDraggable(value) {
    this._nodesDraggable = toBool(value, true);
  }

  _nodesConnectable = true;

  /** Handles may start a connection. @type {boolean} @default true */
  @api
  get nodesConnectable() {
    return this._nodesConnectable;
  }
  set nodesConnectable(value) {
    this._nodesConnectable = toBool(value, true);
  }

  _nodesFocusable = true;

  /** Nodes take keyboard focus. @type {boolean} @default true */
  @api
  get nodesFocusable() {
    return this._nodesFocusable;
  }
  set nodesFocusable(value) {
    this._nodesFocusable = toBool(value, true);
  }

  _edgesFocusable = true;

  /** Edges take keyboard focus. @type {boolean} @default true */
  @api
  get edgesFocusable() {
    return this._edgesFocusable;
  }
  set edgesFocusable(value) {
    this._edgesFocusable = toBool(value, true);
  }

  _elementsSelectable = true;

  /** Nodes and edges may be selected. @type {boolean} @default true */
  @api
  get elementsSelectable() {
    return this._elementsSelectable;
  }
  set elementsSelectable(value) {
    this._elementsSelectable = toBool(value, true);
  }

  _elevateNodesOnSelect = true;

  /** A selected node rises above its peers. @type {boolean} @default true */
  @api
  get elevateNodesOnSelect() {
    return this._elevateNodesOnSelect;
  }
  set elevateNodesOnSelect(value) {
    this._elevateNodesOnSelect = toBool(value, true);
  }

  _selectNodesOnDrag = true;

  /** Pressing a node selects it before the drag begins. @type {boolean} @default true */
  @api
  get selectNodesOnDrag() {
    return this._selectNodesOnDrag;
  }
  set selectNodesOnDrag(value) {
    this._selectNodesOnDrag = toBool(value, true);
  }

  _autoPanOnNodeDrag = true;

  /** The viewport follows a node dragged past the pane edge. @type {boolean} @default true */
  @api
  get autoPanOnNodeDrag() {
    return this._autoPanOnNodeDrag;
  }
  set autoPanOnNodeDrag(value) {
    this._autoPanOnNodeDrag = toBool(value, true);
  }

  _autoPanOnConnect = true;

  /** The viewport follows a connection dragged past the pane edge. @type {boolean} @default true */
  @api
  get autoPanOnConnect() {
    return this._autoPanOnConnect;
  }
  set autoPanOnConnect(value) {
    this._autoPanOnConnect = toBool(value, true);
  }

  _zoomOnScroll = true;

  /** The wheel zooms the viewport. @type {boolean} @default true */
  @api
  get zoomOnScroll() {
    return this._zoomOnScroll;
  }
  set zoomOnScroll(value) {
    this._zoomOnScroll = toBool(value, true);
  }

  _zoomOnPinch = true;

  /** A trackpad pinch zooms the viewport. @type {boolean} @default true */
  @api
  get zoomOnPinch() {
    return this._zoomOnPinch;
  }
  set zoomOnPinch(value) {
    this._zoomOnPinch = toBool(value, true);
  }

  _zoomOnDoubleClick = true;

  /** A double click zooms in, shift double click zooms out. @type {boolean} @default true */
  @api
  get zoomOnDoubleClick() {
    return this._zoomOnDoubleClick;
  }
  set zoomOnDoubleClick(value) {
    this._zoomOnDoubleClick = toBool(value, true);
  }

  _preventScrolling = true;

  /** The wheel is consumed by the flow instead of scrolling the page. @type {boolean} @default true */
  @api
  get preventScrolling() {
    return this._preventScrolling;
  }
  set preventScrolling(value) {
    this._preventScrolling = toBool(value, true);
  }

  _panOnDrag = true;

  /**
   * Whether dragging the pane pans the viewport.
   *
   * Accepts `true`, `false`, or an array of mouse button numbers to restrict
   * panning to those buttons, so it is not passed through {@link toBool}.
   * @type {boolean|Array<number>}
   * @default true
   */
  @api
  get panOnDrag() {
    return this._panOnDrag;
  }
  set panOnDrag(value) {
    this._panOnDrag = Array.isArray(value) ? value : toBool(value, true);
  }

  @api edgesReconnectable = false;
  @api elevateEdgesOnSelect = false;
  @api zIndexMode = 'basic';
  @api autoPanSpeed = DEFAULT_AUTO_PAN_SPEED;
  @api connectionMode = ConnectionMode.Strict;
  @api connectionRadius = DEFAULT_CONNECTION_RADIUS;
  @api connectionLineType = ConnectionLineType.Bezier;
  @api selectionMode = SelectionMode.Full;
  @api selectionOnDrag = false;
  @api nodeDragThreshold = 1;
  @api connectionDragThreshold = 1;
  @api paneClickDistance = 0;
  @api nodeClickDistance = 0;
  @api isValidConnection;

  @api panOnScroll = false;
  @api panOnScrollMode = PanOnScrollMode.Free;
  @api panOnScrollSpeed = 0.5;

  @api deleteKeyCode = 'Backspace';
  @api selectionKeyCode = 'Shift';
  @api multiSelectionKeyCode = 'Meta';
  @api panActivationKeyCode = 'Space';
  @api zoomActivationKeyCode = 'Meta';

  @api defaultMarkerStart;
  @api defaultMarkerEnd;
  @api ariaLabelConfig;

  /**
   * Called before a delete; return `false` to veto it.
   *
   * Named `beforeDelete` rather than upstream's `onBeforeDelete` for the same
   * LWC1108 reason as `renderVisibleOnly`.
   */
  @api beforeDelete;

  /*
   * Built-in addons are booleans rather than slotted children.
   *
   * Upstream composes them as `<Background />` inside `<ReactFlow>`, which
   * works because React context reaches any descendant. An LWC slot cannot:
   * slotted content is owned and rendered by the CONSUMER, so it has no way to
   * receive the store instance. Exposing flags keeps the addons wired while
   * `<slot>` stays available for arbitrary consumer overlays.
   */
  @api showBackground = false;
  @api showControls = false;
  @api showMinimap = false;

  // ------------------------------------------------------------- internals

  #store = null;
  #panZoom = null;
  #flowId = `flow-${Math.random().toString(36).slice(2, 10)}`;
  #resizeObserver = null;
  #fitViewDone = false;
  #initialised = false;
  #unsubscribers = [];
  _viewportStyle = 'transform: translate(0px, 0px) scale(1);';
  #keyListeners = null;
  #selectionOrigin = null;
  #selectionPointerId = null;

  /**
   * CSS transform for the viewport layer.
   *
   * Written as a style string rather than through a direct DOM write so LWC
   * owns the attribute; the value is recomputed only when the transform
   * actually changes, which the store already guarantees.
   */
  get viewportStyle() {
    return this._viewportStyle;
  }

  get hasBackground() {
    return this.showBackground;
  }

  get hasControls() {
    return this.showControls;
  }

  get hasMinimap() {
    return this.showMinimap;
  }

  /** Stable id, used to namespace handle and marker ids across flows. */
  @api
  get flowId() {
    return this.#flowId;
  }

  /** The store, exposed so descendants and tests can reach it. */
  @api
  get store() {
    return this.#store;
  }

  connectedCallback() {
    this.#store = createFlowStore(this._configFromProps());
    this.#store.setNodes(this.#nodes);
    this.#store.setEdges(this.#edges);

    /*
     * `nodesInitialized` flips once every visible node has been measured.
     * A deferred fitView must wait for that, otherwise it would fit against
     * zero-size nodes and land on a meaningless viewport.
     */
    this.#unsubscribers.push(
      this.#store.subscribe(
        (s) => s.nodesInitialized,
        (initialized) => {
          if (initialized && this.fitView && !this.#fitViewDone) {
            this.#fitViewDone = true;
            this.fitViewport(this.fitViewOptions);
          }
          if (initialized) {
            this.dispatchEvent(new CustomEvent('nodesinitialized'));
          }
        }
      ),
      this.#store.subscribe(
        (s) => s.transform,
        ([x, y, k]) => {
          this._viewportStyle = `transform: translate(${x}px, ${y}px) scale(${k});`;
        },
        { compare: shallowArrayEqual }
      )
    );
  }

  renderedCallback() {
    if (this.#initialised) {
      // Props may have changed; push them down without rebuilding anything.
      this.#store.update(this._configFromProps());
      this.#panZoom?.update(this._panZoomOptions());
      return;
    }
    this.#initialised = true;

    const pane = this.refs.pane;

    if (!pane) {
      return;
    }

    this.#store.update({ domNode: pane });
    this._measurePane(pane);

    this.#panZoom = createPanZoom({
      domNode: pane,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      viewport: this.defaultViewport,
      onTransformChange: (transform) => this.#store.setTransform(transform),
      onPanZoomStart: (event, viewport) => this.dispatchEvent(new CustomEvent('movestart', { detail: { viewport } })),
      onPanZoom: (event, viewport) => this.dispatchEvent(new CustomEvent('move', { detail: { viewport } })),
      onPanZoomEnd: (event, viewport) => this.dispatchEvent(new CustomEvent('moveend', { detail: { viewport } })),
      onDraggingChange: (dragging) => this.#store.update({ paneDragging: dragging }),
    });

    this.#panZoom.update(this._panZoomOptions());
    this.#store.update({ panZoom: this.#panZoom });

    /*
     * The pane size feeds culling, fitView and auto-pan. A ResizeObserver
     * rather than a window listener, because a Lightning page can resize the
     * component without the window changing at all.
     */
    if (typeof ResizeObserver !== 'undefined') {
      this.#resizeObserver = new ResizeObserver(() => this._measurePane(pane));
      this.#resizeObserver.observe(pane);
    }

    this._attachKeyHandlers();
    this.dispatchEvent(new CustomEvent('init', { detail: { flowId: this.#flowId } }));
  }

  /**
   * Attach the document-level key listener.
   *
   * Document level, not pane level: Delete must work while a node has focus,
   * and a node lives in a descendant's shadow root, so a pane listener would
   * only see the retargeted event. The handler ignores keys originating in a
   * text field via `isInputDOMNode`.
   */
  _attachKeyHandlers() {
    this.#keyListeners = {
      keydown: (e) => this._handleKeyDown(e),
      keyup: (e) => this._handleKeyUp(e),
    };

    document.addEventListener('keydown', this.#keyListeners.keydown);
    document.addEventListener('keyup', this.#keyListeners.keyup);
  }

  _detachKeyHandlers() {
    if (!this.#keyListeners) {
      return;
    }
    document.removeEventListener('keydown', this.#keyListeners.keydown);
    document.removeEventListener('keyup', this.#keyListeners.keyup);
    this.#keyListeners = null;
  }

  /** True when `event` matches a configured key code, which may be a list. */
  _matchesKey(event, code) {
    if (!code) {
      return false;
    }

    const codes = Array.isArray(code) ? code : [code];

    return codes.some((c) => event.key === c || event.code === c);
  }

  _handleKeyDown(event) {
    if (isInputDOMNode(event)) {
      return;
    }

    if (this._matchesKey(event, this.deleteKeyCode)) {
      const s = this.#store.state;
      this.deleteElements({
        nodes: Array.from(s.nodeLookup.values()).filter((n) => n.selected),
        edges: s.edges.filter((e) => e.selected),
      });
      return;
    }

    if (this._matchesKey(event, this.selectionKeyCode)) {
      this.#store.update({ selectionKeyPressed: true });
    }
    if (this._matchesKey(event, this.multiSelectionKeyCode)) {
      this.#store.update({ multiSelectionActive: true, multiSelectionKeyPressed: true });
    }
    if (this._matchesKey(event, this.panActivationKeyCode)) {
      this.#store.update({ panActivationKeyPressed: true });
      this.#panZoom?.update(this._panZoomOptions());
    }
    if (this._matchesKey(event, this.zoomActivationKeyCode)) {
      this.#store.update({ zoomActivationKeyPressed: true });
      this.#panZoom?.update(this._panZoomOptions());
    }
  }

  _handleKeyUp(event) {
    if (this._matchesKey(event, this.selectionKeyCode)) {
      this.#store.update({ selectionKeyPressed: false });
    }
    if (this._matchesKey(event, this.multiSelectionKeyCode)) {
      this.#store.update({ multiSelectionActive: false, multiSelectionKeyPressed: false });
    }
    if (this._matchesKey(event, this.panActivationKeyCode)) {
      this.#store.update({ panActivationKeyPressed: false });
      this.#panZoom?.update(this._panZoomOptions());
    }
    if (this._matchesKey(event, this.zoomActivationKeyCode)) {
      this.#store.update({ zoomActivationKeyPressed: false });
      this.#panZoom?.update(this._panZoomOptions());
    }
  }

  // ------------------------------------------------------------- marquee

  /**
   * Start a marquee selection.
   *
   * Only when the selection key is held, or `selectionOnDrag` is on and the
   * gesture began on the pane itself rather than on a node. Pan/zoom is
   * suppressed for the duration by the `userSelectionActive` flag, which its
   * event filter already honours.
   */
  handlePanePointerDown(event) {
    const s = this.#store.state;
    const startsSelection = s.selectionKeyPressed || (this.selectionOnDrag && event.target === this.refs.pane);

    if (!startsSelection || !s.elementsSelectable || event.button !== 0) {
      return;
    }

    const rect = this.refs.pane.getBoundingClientRect();
    this.#selectionOrigin = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    this.#selectionPointerId = event.pointerId;

    this.refs.pane.setPointerCapture?.(event.pointerId);
    this.#store.update({
      userSelectionActive: true,
      userSelectionRect: { ...this.#selectionOrigin, width: 0, height: 0 },
    });
    this.#panZoom?.update(this._panZoomOptions());
  }

  handlePanePointerMove(event) {
    if (this.#selectionPointerId !== event.pointerId || !this.#selectionOrigin) {
      return;
    }

    const rect = this.refs.pane.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const origin = this.#selectionOrigin;

    // Normalise so dragging up or left still yields a positive-size rect.
    const selectionRect = {
      x: Math.min(origin.x, x),
      y: Math.min(origin.y, y),
      width: Math.abs(x - origin.x),
      height: Math.abs(y - origin.y),
    };

    this.#store.update({ userSelectionRect: selectionRect });

    const nodeIds = this.#store.getNodeIdsInRect(selectionRect);
    const { nodeChanges } = this.#store.getSelectionChangesFor(nodeIds, []);

    this._emitNodeChanges(nodeChanges);
  }

  handlePanePointerUp(event) {
    if (this.#selectionPointerId !== event.pointerId) {
      return;
    }

    this.refs.pane.releasePointerCapture?.(event.pointerId);
    this.#selectionPointerId = null;
    this.#selectionOrigin = null;

    this.#store.update({ userSelectionActive: false, userSelectionRect: null });
    this.#panZoom?.update(this._panZoomOptions());
  }

  /**
   * A click on empty pane clears the selection.
   *
   * Skipped when a marquee just ran, otherwise finishing a marquee would
   * immediately deselect everything it had just selected.
   */
  handlePaneClick(event) {
    if (event.target !== this.refs.pane || this.#store.state.userSelectionActive) {
      return;
    }

    const { nodeChanges, edgeChanges } = this.#store.getSelectionChangesFor([], []);

    this._emitNodeChanges(nodeChanges);
    this._emitEdgeChanges(edgeChanges);
    this.dispatchEvent(new CustomEvent('paneclick'));
  }

  handlePaneContextMenu(event) {
    if (event.target === this.refs.pane) {
      this.dispatchEvent(new CustomEvent('panecontextmenu'));
    }
  }

  disconnectedCallback() {
    for (const unsubscribe of this.#unsubscribers) {
      unsubscribe();
    }
    this.#unsubscribers = [];

    this._detachKeyHandlers();
    this.#resizeObserver?.disconnect();
    this.#panZoom?.destroy();
    this.#store?.destroy();

    this.#panZoom = null;
    this.#initialised = false;
  }

  _measurePane(pane) {
    const rect = pane.getBoundingClientRect();

    this.#store.setDimensions(rect.width, rect.height);
  }

  /** Every prop the store mirrors, in one object. */
  _configFromProps() {
    return {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      nodeExtent: this.nodeExtent,
      nodeOrigin: this.nodeOrigin,
      snapToGrid: this.snapToGrid,
      snapGrid: this.snapGrid,
      onlyRenderVisibleElements: this.renderVisibleOnly,
      nodesDraggable: this.nodesDraggable,
      nodesConnectable: this.nodesConnectable,
      nodesFocusable: this.nodesFocusable,
      edgesFocusable: this.edgesFocusable,
      edgesReconnectable: this.edgesReconnectable,
      elementsSelectable: this.elementsSelectable,
      elevateNodesOnSelect: this.elevateNodesOnSelect,
      elevateEdgesOnSelect: this.elevateEdgesOnSelect,
      zIndexMode: this.zIndexMode,
      selectNodesOnDrag: this.selectNodesOnDrag,
      autoPanOnNodeDrag: this.autoPanOnNodeDrag,
      autoPanOnConnect: this.autoPanOnConnect,
      autoPanSpeed: this.autoPanSpeed,
      connectionMode: this.connectionMode,
      connectionRadius: this.connectionRadius,
      selectionMode: this.selectionMode,
      nodeDragThreshold: this.nodeDragThreshold,
      connectionDragThreshold: this.connectionDragThreshold,
      paneClickDistance: this.paneClickDistance,
      nodeClickDistance: this.nodeClickDistance,
      nodeTypes: this.nodeTypes ?? {},
      edgeTypes: this.edgeTypes ?? {},
      ariaLabelConfig: mergeAriaLabelConfig(this.ariaLabelConfig),
      onError: (id, message) => this.dispatchEvent(new CustomEvent('flowerror', { detail: { id, message } })),
    };
  }

  _panZoomOptions() {
    const s = this.#store.state;

    return {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      panOnDrag: this.panOnDrag,
      panOnScroll: this.panOnScroll,
      panOnScrollMode: this.panOnScrollMode,
      panOnScrollSpeed: this.panOnScrollSpeed,
      zoomOnScroll: this.zoomOnScroll,
      zoomOnPinch: this.zoomOnPinch,
      zoomOnDoubleClick: this.zoomOnDoubleClick,
      preventScrolling: this.preventScrolling,
      paneClickDistance: this.paneClickDistance,
      selectionOnDrag: this.selectionOnDrag,
      userSelectionActive: s.userSelectionActive,
      connectionInProgress: !!s.connection?.inProgress,
      panActivationKeyPressed: s.panActivationKeyPressed,
      zoomActivationKeyPressed: s.zoomActivationKeyPressed,
    };
  }

  // ------------------------------------------------------- change plumbing

  /** Emit node changes. The consumer folds them back with `applyNodeChanges`. */
  _emitNodeChanges(changes) {
    if (changes.length) {
      this.dispatchEvent(new CustomEvent('nodeschange', { detail: { changes } }));
    }
  }

  /** Emit edge changes. The consumer folds them back with `applyEdgeChanges`. */
  _emitEdgeChanges(changes) {
    if (changes.length) {
      this.dispatchEvent(new CustomEvent('edgeschange', { detail: { changes } }));
    }
  }

  handleNodesChange(event) {
    this._emitNodeChanges(event.detail.changes);
  }

  handleEdgesChange(event) {
    this._emitEdgeChanges(event.detail.changes);
  }

  handleConnect(event) {
    this.dispatchEvent(new CustomEvent('connect', { detail: event.detail }));
  }

  /** Re-dispatch a child event under the same name, unchanged. */
  handleForward(event) {
    this.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
  }

  handleFitView(event) {
    this.fitViewport(event.detail?.fitViewOptions ?? this.fitViewOptions);
  }

  // ------------------------------------------------------- public instance

  /** @returns {Array<*>} the current node array */
  @api
  getNodes() {
    return this.#nodes;
  }

  /** @returns {Array<*>} the current edge array */
  @api
  getEdges() {
    return this.#edges;
  }

  /** @param {string} id @returns {*|undefined} */
  @api
  getNode(id) {
    return this.#store.state.nodeLookup.get(id)?.internals.userNode;
  }

  /** @param {string} id @returns {*|undefined} the adopted node, with `internals` */
  @api
  getInternalNode(id) {
    return this.#store.state.nodeLookup.get(id);
  }

  /** @param {string} id @returns {*|undefined} */
  @api
  getEdge(id) {
    return this.#store.state.edgeLookup.get(id);
  }

  /**
   * Serialise the flow.
   * @returns {{nodes: Array<*>, edges: Array<*>, viewport: import('c/flowTypes').Viewport}}
   */
  @api
  toObject() {
    return {
      nodes: this.#nodes.map((node) => ({ ...node })),
      edges: this.#edges.map((edge) => ({ ...edge })),
      viewport: this.#store.getViewport(),
    };
  }

  /**
   * Apply node changes to the inbound array and emit the result.
   *
   * A convenience for uncontrolled use: the consumer can bind `nodes` once and
   * let the flow echo the updated array back through `onnodeschange`.
   * @param {Array<*>} changes
   * @returns {Array<*>} the updated array
   */
  @api
  applyNodeChanges(changes) {
    return applyNodeChanges(changes, this.#nodes);
  }

  /**
   * Apply edge changes to the inbound array and return the result.
   * @param {Array<*>} changes
   * @returns {Array<*>}
   */
  @api
  applyEdgeChanges(changes) {
    return applyEdgeChanges(changes, this.#edges);
  }

  /**
   * Add an edge for a connection, skipping duplicates.
   * @param {*} connectionOrEdge
   * @returns {Array<*>} the updated edge array
   */
  @api
  addEdge(connectionOrEdge) {
    return addEdgeToArray(connectionOrEdge, this.#edges, { onError: this.#store.state.onError });
  }

  /**
   * Repoint an edge at a new connection.
   * @param {*} oldEdge
   * @param {*} newConnection
   * @param {Object} [options]
   * @returns {Array<*>}
   */
  @api
  reconnectEdge(oldEdge, newConnection, options) {
    return reconnectEdgeInArray(oldEdge, newConnection, this.#edges, {
      shouldReplaceId: true,
      onError: this.#store.state.onError,
      ...options,
    });
  }

  /**
   * Delete nodes and edges, cascading to child nodes and connected edges.
   *
   * Emits the changes rather than mutating: the consumer still owns the arrays.
   * `beforeDelete` can veto the whole operation.
   * @param {{nodes?: Array<{id: string}>, edges?: Array<{id: string}>}} params
   * @returns {{nodes: Array<*>, edges: Array<*>}} what was actually removed
   */
  @api
  deleteElements({ nodes = [], edges = [] } = {}) {
    const s = this.#store.state;
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edgeIds = new Set(edges.map((e) => e.id));

    // Deleting a parent must delete its subtree, transitively.
    let grew = true;
    while (grew) {
      grew = false;
      for (const [id, node] of s.nodeLookup) {
        if (!nodeIds.has(id) && node.parentId && nodeIds.has(node.parentId)) {
          nodeIds.add(id);
          grew = true;
        }
      }
    }

    // An edge with a deleted endpoint cannot survive.
    for (const edge of s.edges) {
      if (nodeIds.has(edge.source) || nodeIds.has(edge.target)) {
        edgeIds.add(edge.id);
      }
    }

    const removedNodes = this.#nodes.filter((n) => nodeIds.has(n.id) && (n.deletable ?? true));
    const removedEdges = this.#edges.filter((e) => edgeIds.has(e.id) && (e.deletable ?? true));

    if (this.beforeDelete) {
      const permitted = this.beforeDelete({ nodes: removedNodes, edges: removedEdges });

      if (permitted === false) {
        return { nodes: [], edges: [] };
      }
    }

    this._emitNodeChanges(removedNodes.map(elementToRemoveChange));
    this._emitEdgeChanges(removedEdges.map(elementToRemoveChange));

    return { nodes: removedNodes, edges: removedEdges };
  }

  /**
   * Nodes overlapping a node or rect.
   * @param {*|import('c/flowTypes').Rect} nodeOrRect
   * @param {boolean} [partially=true]
   * @param {Array<*>} [nodesToIntersect]
   * @returns {Array<*>}
   */
  @api
  getIntersectingNodes(nodeOrRect, partially = true, nodesToIntersect) {
    const s = this.#store.state;
    const isRect = !('id' in nodeOrRect);
    const nodeRect = isRect ? nodeOrRect : nodeToRect(s.nodeLookup.get(nodeOrRect.id) ?? nodeOrRect);

    if (!nodeRect) {
      return [];
    }

    const candidates = nodesToIntersect ?? Array.from(s.nodeLookup.values());

    return candidates.filter((n) => {
      const internal = s.nodeLookup.get(n.id) ?? n;

      if (!isRect && internal.id === nodeOrRect.id) {
        return false;
      }
      if (!nodeHasDimensions(internal)) {
        return false;
      }

      const currRect = nodeToRect(internal);
      const overlap = getOverlappingArea(currRect, nodeRect);

      return partially ? overlap > 0 : overlap >= nodeRect.width * nodeRect.height;
    });
  }

  /**
   * Whether a node overlaps a rect.
   * @param {*} node
   * @param {import('c/flowTypes').Rect} area
   * @param {boolean} [partially=true]
   * @returns {boolean}
   */
  @api
  isNodeIntersecting(node, area, partially = true) {
    const internal = this.#store.state.nodeLookup.get(node.id) ?? node;
    const rect = nodeToRect(internal);
    const overlap = getOverlappingArea(rect, area);

    return partially ? overlap > 0 : overlap >= area.width * area.height;
  }

  /**
   * Bounding rect of the given nodes, or of all of them.
   * @param {Array<*|string>} [nodes]
   * @returns {import('c/flowTypes').Rect}
   */
  @api
  getNodesBounds(nodes) {
    const s = this.#store.state;

    if (!nodes) {
      return getInternalNodesBounds(s.nodeLookup);
    }

    return getNodesBounds(nodes, { nodeOrigin: s.nodeOrigin, nodeLookup: s.nodeLookup });
  }

  /**
   * Connections touching a node, or a specific handle.
   * @param {{type?: 'source'|'target', nodeId: string, handleId?: string|null}} params
   * @returns {Array<*>}
   */
  @api
  getNodeConnections({ type, nodeId, handleId }) {
    const key = handleId && type ? `${nodeId}-${type}-${handleId}` : type ? `${nodeId}-${type}` : nodeId;
    const map = this.#store.state.connectionLookup.get(key);

    return map ? Array.from(map.values()) : [];
  }

  /**
   * Viewport coordinates to flow coordinates.
   * @param {import('c/flowTypes').XYPosition} position client coordinates
   * @param {{snapToGrid?: boolean}} [options]
   * @returns {import('c/flowTypes').XYPosition}
   */
  @api
  screenToFlowPosition(position, options = {}) {
    const s = this.#store.state;
    const pane = s.domNode;

    if (!pane) {
      return position;
    }

    const rect = pane.getBoundingClientRect();
    const snap = options.snapToGrid ?? s.snapToGrid;

    return pointToRendererPoint({ x: position.x - rect.left, y: position.y - rect.top }, s.transform, snap, s.snapGrid);
  }

  /**
   * Flow coordinates to viewport coordinates.
   * @param {import('c/flowTypes').XYPosition} position
   * @returns {import('c/flowTypes').XYPosition}
   */
  @api
  flowToScreenPosition(position) {
    const s = this.#store.state;
    const pane = s.domNode;
    const point = rendererPointToPoint(position, s.transform);

    if (!pane) {
      return point;
    }

    const rect = pane.getBoundingClientRect();

    return { x: point.x + rect.left, y: point.y + rect.top };
  }

  /** @returns {import('c/flowTypes').Viewport} */
  @api
  getViewport() {
    return this.#store.getViewport();
  }

  /** @returns {number} */
  @api
  getZoom() {
    return this.#store.state.transform[2];
  }

  /**
   * @param {import('c/flowTypes').Viewport} viewport
   * @param {{duration?: number}} [options]
   * @returns {Promise<boolean>}
   */
  @api
  setViewport(viewport, options) {
    return this.#panZoom?.setViewport(viewport, options) ?? Promise.resolve(false);
  }

  /** @param {{duration?: number}} [options] @returns {Promise<boolean>} */
  @api
  zoomIn(options) {
    return this.#panZoom?.scaleBy(1.2, options) ?? Promise.resolve(false);
  }

  /** @param {{duration?: number}} [options] @returns {Promise<boolean>} */
  @api
  zoomOut(options) {
    return this.#panZoom?.scaleBy(1 / 1.2, options) ?? Promise.resolve(false);
  }

  /** @param {number} zoom @param {{duration?: number}} [options] @returns {Promise<boolean>} */
  @api
  zoomTo(zoom, options) {
    return this.#panZoom?.scaleTo(zoom, options) ?? Promise.resolve(false);
  }

  /**
   * Centre a flow point.
   * @param {number} x
   * @param {number} y
   * @param {{zoom?: number, duration?: number}} [options]
   * @returns {Promise<boolean>}
   */
  @api
  setCenter(x, y, options = {}) {
    const s = this.#store.state;
    const zoom = options.zoom ?? clamp(s.transform[2], s.minZoom, s.maxZoom);

    return this.setViewport({ x: s.width / 2 - x * zoom, y: s.height / 2 - y * zoom, zoom }, options);
  }

  /**
   * Fit a rect into view.
   * @param {import('c/flowTypes').Rect} bounds
   * @param {{padding?: number, duration?: number}} [options]
   * @returns {Promise<boolean>}
   */
  @api
  fitBounds(bounds, options = {}) {
    const s = this.#store.state;
    const viewport = getViewportForBounds(bounds, s.width, s.height, s.minZoom, s.maxZoom, options.padding ?? 0.1);

    return this.setViewport(viewport, options);
  }

  /**
   * Fit every node into view.
   *
   * Named `fitViewport` rather than `fitView` because `fitView` is already a
   * boolean property on this component and LWC forbids a property and a method
   * of the same name.
   * @param {{padding?: number, minZoom?: number, maxZoom?: number, duration?: number, nodes?: Array<*>, includeHiddenNodes?: boolean}} [options]
   * @returns {Promise<boolean>}
   */
  @api
  fitViewport(options = {}) {
    const s = this.#store.state;

    if (!s.width || !s.height) {
      return Promise.resolve(false);
    }

    const wanted = options.nodes ? new Set(options.nodes.map((n) => n.id)) : null;
    const bounds = getInternalNodesBounds(s.nodeLookup, {
      filter: (node) =>
        (!wanted || wanted.has(node.id)) && (options.includeHiddenNodes || !node.hidden) && nodeHasDimensions(node),
    });

    if (bounds.width === 0 || bounds.height === 0) {
      return Promise.resolve(false);
    }

    const viewport = getViewportForBounds(
      bounds,
      s.width,
      s.height,
      options.minZoom ?? s.minZoom,
      options.maxZoom ?? s.maxZoom,
      options.padding ?? 0.1
    );

    return this.setViewport(viewport, { duration: options.duration });
  }

  /** @returns {boolean} whether the pan/zoom controller is live */
  @api
  get viewportInitialized() {
    return this.#panZoom !== null;
  }
}
