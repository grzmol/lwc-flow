/**
 * One node's root element: position, interaction state, measurement and the user's node component.
 *
 * Ports `@xyflow/react/src/components/NodeWrapper/index.tsx` together with its `utils.tsx` helpers
 * (`arrowKeyDiffs`, `getNodeInlineStyleDimensions`) and `useNodeObserver`.
 *
 * ## Deviations from upstream
 *
 * - **Measurement is reported upward, never written down.** Upstream observes every node with one
 *   shared `ResizeObserver` owned by the renderer and writes straight into the store. A parent
 *   reaching into a child's shadow root is forbidden here, so this component measures its own root
 *   element and dispatches `nodemeasured`; the renderer's owner applies it. The re-measure trigger
 *   is the same one `useNodeObserver` uses: size, node type, `sourcePosition` or `targetPosition`
 *   changed.
 * - **Selection travels out as events.** The store returns selection changes rather than applying
 *   them, because the consumer owns the node array, so a click dispatches `nodeclick` carrying
 *   whether the renderer should also select. Upstream's press-time selection
 *   (`selectNodesOnDrag`) needs no separate signal: `XYDrag` starts on press, so `nodedragstart`
 *   is exactly that moment.
 * - **Arrow keys dispatch `nodemove`.** Upstream calls `moveSelectedNodes` on the store directly.
 *
 * The node component is instantiated with `lwc:is`, which is why the bundle declares the
 * `lightning__dynamicComponent` capability. It must render in light DOM: `getHandleBounds` finds
 * handles with `querySelectorAll` on this component's root element, and that query stops at the
 * first shadow boundary. See `c/flowHandle` for the full argument.
 */

import { LightningElement, api } from 'lwc';
import { errorMessages, elementSelectionKeys, interactionClass, mergeAriaLabelConfig } from 'c/flowTypes';
import { getNodeDimensions, nodeHasDimensions } from 'c/flowMath';
import { getDimensions, getHandleBounds, isInputDOMNode } from 'c/flowDom';
import { createDrag } from 'c/flowDrag';
import { shallowObjectEqual } from 'c/flowStore';

/** Position delta per arrow key, from upstream's `arrowKeyDiffs`. */
const ARROW_KEY_DIFFS = Object.freeze({
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
});

/** Extra distance an arrow key covers while shift is held, from upstream. */
const SHIFT_FACTOR = 4;

/** The flow-wide flags a node's appearance and behaviour depend on. */
function selectFlags(state) {
  return {
    nodesDraggable: state.nodesDraggable,
    elementsSelectable: state.elementsSelectable,
    nodesConnectable: state.nodesConnectable,
    nodesFocusable: state.nodesFocusable,
    selectNodesOnDrag: state.selectNodesOnDrag,
    nodeDragThreshold: state.nodeDragThreshold,
    nodeTypes: state.nodeTypes,
    ariaLabelConfig: state.ariaLabelConfig,
    onError: state.onError,
  };
}

/**
 * Explicit inline size, ported from upstream's `getNodeInlineStyleDimensions`.
 *
 * Before the first measurement an `initialWidth` still counts, so a node that declares its size
 * renders at that size instead of collapsing and then jumping.
 */
function inlineDimensions(node) {
  if (node.internals.handleBounds === undefined || node.internals.handleBounds === null) {
    return {
      width: node.width ?? node.initialWidth ?? node.style?.width,
      height: node.height ?? node.initialHeight ?? node.style?.height,
    };
  }

  return { width: node.width ?? node.style?.width, height: node.height ?? node.style?.height };
}

/** `borderRadius` -> `border-radius`, so a consumer's style object can be serialised. */
function toCssName(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/** A raw number is a pixel count; a string is already a CSS length. */
function toCssLength(value) {
  return typeof value === 'number' ? `${value}px` : value;
}

export default class FlowNodeWrapper extends LightningElement {
  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  /** Id of the node this wrapper renders. */
  @api nodeId;

  /** Id of the owning flow, forwarded to handles so their `data-id` is unique per page. */
  @api flowId;

  /*
   * Template-visible state. These must be ordinary fields: the LWC babel plugin builds its
   * reactive-field list from `ClassProperty` nodes, so a `#field` is never reactive and the
   * template would never re-render when the store pushes a new value.
   */
  _node;
  _isParent = false;
  _flags = selectFlags({});
  _dragging = false;

  /** Subscription handles, the drag controller and render-time caches: never read by the template. */
  #unsubscribers = [];
  #drag = null;
  #measuredSignature = null;
  #reportedTypes = new Set();
  #classKey;
  #className = '';
  #styleKey;
  #style = '';
  #propsNode = null;
  #propsFlags = null;
  #propsDragging = false;
  #props = {};
  #ariaSource = undefined;
  #ariaConfig = mergeAriaLabelConfig();

  connectedCallback() {
    const store = this.store;

    if (!store) {
      return;
    }

    this.#unsubscribers = [
      /*
       * `adoptUserNodes` allocates a new internal node object whenever anything about the
       * node changes, so reference comparison is exactly right here. `isParent` rides along
       * because `parentLookup` is mutated in place and changes when a *child* is added,
       * which need not touch this node's object at all.
       */
      store.subscribe(
        (state) => ({
          node: state.nodeLookup.get(this.nodeId),
          isParent: state.parentLookup.has(this.nodeId),
        }),
        ({ node, isParent }) => {
          this._node = node;
          this._isParent = isParent;
        },
        { compare: shallowObjectEqual }
      ),
      store.subscribe(
        selectFlags,
        (flags) => {
          this._flags = flags;
        },
        { compare: shallowObjectEqual }
      ),
    ];
  }

  renderedCallback() {
    this._attachDrag();
    this._measure();
  }

  disconnectedCallback() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.#unsubscribers = [];
    this.#drag?.destroy();
    this.#drag = null;
  }

  // ------------------------------------------------------------------ render

  /** A node deleted from under us, or hidden, renders nothing at all - as upstream does. */
  get hasNode() {
    return !!this._node && !this._node.hidden;
  }

  get isDraggable() {
    const node = this._node;

    return !!(node?.draggable || (this._flags.nodesDraggable && node?.draggable === undefined));
  }

  get isSelectable() {
    const node = this._node;

    return !!(node?.selectable || (this._flags.elementsSelectable && node?.selectable === undefined));
  }

  get isConnectable() {
    const node = this._node;

    return !!(node?.connectable || (this._flags.nodesConnectable && node?.connectable === undefined));
  }

  get isFocusable() {
    const node = this._node;

    return !!(node?.focusable || (this._flags.nodesFocusable && node?.focusable === undefined));
  }

  /** The registered type name, after falling back to `default` for an unknown one. */
  get nodeType() {
    const requested = this._node?.type || 'default';

    return (this._flags.nodeTypes ?? {})[requested] ? requested : 'default';
  }

  /**
   * Constructor for the node body, resolved through the flow's `nodeTypes` registry.
   *
   * An unknown type is reported once per type name, not once per render. Nothing is reported
   * while the registry itself is still empty: that is a flow that has not finished starting up,
   * not a consumer mistake.
   */
  get nodeCtor() {
    const types = this._flags.nodeTypes ?? {};
    const requested = this._node?.type || 'default';
    const ctor = types[requested];

    if (ctor) {
      return ctor;
    }

    if (types.default && !this.#reportedTypes.has(requested)) {
      this.#reportedTypes.add(requested);
      this._flags.onError?.('003', errorMessages.error003(requested));
    }

    return types.default ?? null;
  }

  /** The class list of the node's root element. Rebuilt only when one of its inputs changes. */
  get rootClass() {
    const node = this._node;
    const draggable = this.isDraggable;
    const selectable = this.isSelectable;
    const key = `${this.nodeType}|${node?.className ?? ''}|${+!!node?.selected}${+selectable}${+this
      ._isParent}${+draggable}${+this._dragging}`;

    if (key === this.#classKey) {
      return this.#className;
    }

    const classes = ['flow__node', `flow__node-${this.nodeType}`];

    if (draggable) {
      // Overridable by putting `nopan` on user markup, exactly as upstream.
      classes.push(interactionClass.noPan);
    }
    if (node?.className) {
      classes.push(node.className);
    }
    if (node?.selected) {
      classes.push('selected');
    }
    if (selectable) {
      classes.push('selectable');
    }
    if (this._isParent) {
      classes.push('parent');
    }
    if (draggable) {
      classes.push('draggable');
    }
    if (this._dragging) {
      classes.push('dragging');
    }

    this.#classKey = key;
    this.#className = classes.join(' ');

    return this.#className;
  }

  /**
   * Inline style of the node's root element.
   *
   * A node with no measurement yet is hidden rather than absent: it has to be in the DOM to be
   * measured, but drawing it at its unpositioned size would flash a wrongly sized box.
   */
  get rootStyle() {
    const node = this._node;

    if (!node) {
      return '';
    }

    const { x, y } = node.internals.positionAbsolute;
    const measured = nodeHasDimensions(node);
    const { width, height } = inlineDimensions(node);
    const interactive = this.isSelectable || this.isDraggable;
    const key = `${x}|${y}|${node.internals.z}|${+measured}|${+interactive}|${width}|${height}|${
      node.style ? JSON.stringify(node.style) : ''
    }`;

    if (key === this.#styleKey) {
      return this.#style;
    }

    const declarations = [
      `z-index: ${node.internals.z}`,
      `transform: translate(${x}px,${y}px)`,
      `pointer-events: ${interactive ? 'all' : 'none'}`,
      `visibility: ${measured ? 'visible' : 'hidden'}`,
    ];

    if (node.style) {
      for (const name of Object.keys(node.style)) {
        declarations.push(`${toCssName(name)}: ${toCssLength(node.style[name])}`);
      }
    }

    // Last, so an explicit width always wins over the same key inside `node.style`.
    if (width !== undefined) {
      declarations.push(`width: ${toCssLength(width)}`);
    }
    if (height !== undefined) {
      declarations.push(`height: ${toCssLength(height)}`);
    }

    this.#styleKey = key;
    this.#style = `${declarations.join('; ')};`;

    return this.#style;
  }

  get tabIndex() {
    return this.isFocusable ? 0 : null;
  }

  get role() {
    return this._node?.ariaRole ?? (this.isFocusable ? 'group' : null);
  }

  get ariaLabel() {
    const configured = this._flags.ariaLabelConfig;

    if (configured !== this.#ariaSource) {
      this.#ariaSource = configured;
      this.#ariaConfig = mergeAriaLabelConfig(configured);
    }

    return this._node?.ariaLabel ?? this.#ariaConfig['node.a11yDescription.default'];
  }

  /**
   * The property bag spread onto the node component.
   *
   * Built once per change: `lwc:spread` assigns every key on every render, so handing it a fresh
   * object each time would churn every public property of every node on every commit.
   */
  get nodeProps() {
    const node = this._node;

    if (!node) {
      return this.#props;
    }

    if (this.#propsNode === node && this.#propsFlags === this._flags && this.#propsDragging === this._dragging) {
      return this.#props;
    }

    const { width, height } = getNodeDimensions(node);
    const value = {
      id: node.id,
      data: node.data,
      type: this.nodeType,
      selected: node.selected ?? false,
      dragging: this._dragging,
      draggable: this.isDraggable,
      selectable: this.isSelectable,
      connectable: node.connectable,
      deletable: node.deletable ?? true,
      isConnectable: this.isConnectable,
      sourcePosition: node.sourcePosition,
      targetPosition: node.targetPosition,
      positionAbsoluteX: node.internals.positionAbsolute.x,
      positionAbsoluteY: node.internals.positionAbsolute.y,
      width,
      height,
      parentId: node.parentId,
      zIndex: node.internals.z,
      store: this.store,
      flowId: this.flowId,
    };

    this.#propsNode = node;
    this.#propsFlags = this._flags;
    this.#propsDragging = this._dragging;
    this.#props = value;

    return value;
  }

  // ------------------------------------------------------------- interaction

  handleClick() {
    /*
     * Upstream selects on click only when the drag path did not already do it on press. The
     * decision travels with the event because the consumer owns the node array; the consumer's
     * own click callback must fire either way, so the event is always dispatched.
     */
    const select =
      this.isSelectable && (!this._flags.selectNodesOnDrag || !this.isDraggable || this._flags.nodeDragThreshold > 0);

    this._emitClick(select, false);
  }

  handleDoubleClick() {
    this._emit('nodedoubleclick', { id: this.nodeId });
  }

  handleContextMenu() {
    this._emit('nodecontextmenu', { id: this.nodeId });
  }

  handleMouseEnter() {
    this._emit('nodemouseenter', { id: this.nodeId });
  }

  handleMouseLeave() {
    this._emit('nodemouseleave', { id: this.nodeId });
  }

  handleConnectStart(event) {
    this._emit('connectstart', event.detail);
  }

  handleKeyDown(event) {
    if (isInputDOMNode(event)) {
      return;
    }

    if (elementSelectionKeys.includes(event.key)) {
      if (this.isSelectable) {
        const unselect = event.key === 'Escape';
        this._emitClick(!unselect, unselect);
      }
      return;
    }

    const diff = ARROW_KEY_DIFFS[event.key];

    if (diff && this.isDraggable && this._node?.selected) {
      // Without this the pane scrolls while the node moves.
      event.preventDefault();

      const factor = event.shiftKey ? SHIFT_FACTOR : 1;
      this._emit('nodemove', { id: this.nodeId, dx: diff.x * factor, dy: diff.y * factor });
    }
  }

  // ----------------------------------------------------------------- effects

  /**
   * Attach the drag kernel to the root element, once.
   *
   * Re-attaching on a later render would leave the old listeners on the same element, so the
   * gesture would fire twice.
   */
  _attachDrag() {
    const element = this.refs?.node;

    if (this.#drag || !element || !this.store) {
      return;
    }

    this.#drag = createDrag({
      store: this.store,
      domNode: element,
      nodeId: this.nodeId,
      handleSelector: this._node?.dragHandle,
      onDragStart: (event, node, nodes) => {
        this._dragging = true;
        this._emit('nodedragstart', { id: this.nodeId, changes: [], node, nodes });
      },
      onDrag: (event, changes, node, nodes) => {
        this._emit('nodedrag', { id: this.nodeId, changes, node, nodes });
      },
      onDragStop: (event, changes, node, nodes) => {
        this._dragging = false;
        this._emit('nodedragstop', { id: this.nodeId, changes, node, nodes });
      },
    });
  }

  /**
   * Measure the node and its handles, and report the result upward.
   *
   * The signature guard is what keeps this from looping: applying a measurement re-renders this
   * component, and an unguarded dispatch would measure and report again forever. It covers the
   * same inputs `useNodeObserver` watches, so a changed type or handle position re-measures even
   * though the box did not move.
   */
  _measure() {
    const element = this.refs?.node;
    const node = this._node;

    if (!element || !node) {
      return;
    }

    const dimensions = getDimensions(element);
    const signature = `${dimensions.width}x${dimensions.height}|${this.nodeType}|${
      node.sourcePosition
    }|${node.targetPosition}`;

    if (signature === this.#measuredSignature) {
      return;
    }

    this.#measuredSignature = signature;

    const zoom = this.store?.state.transform?.[2] ?? 1;
    const bounds = element.getBoundingClientRect();

    this._emit('nodemeasured', {
      id: this.nodeId,
      dimensions,
      handleBounds: {
        source: getHandleBounds('source', element, bounds, zoom, this.nodeId),
        target: getHandleBounds('target', element, bounds, zoom, this.nodeId),
      },
    });
  }

  _emitClick(select, unselect) {
    this._emit('nodeclick', { id: this.nodeId, select, unselect });
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
}
