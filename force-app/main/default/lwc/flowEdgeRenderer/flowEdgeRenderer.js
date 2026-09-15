import { LightningElement, api } from 'lwc';
import { ConnectionMode, ConnectionLineType, DEFAULT_INTERACTION_WIDTH, ELEVATE_ON_SELECT_Z } from 'c/flowTypes';
import {
  getHandlePosition,
  getNodeDimensions,
  nodeToBox,
  getBoundsOfBoxes,
  boxToRect,
  getOverlappingArea,
} from 'c/flowMath';
import { getEdgePathData, builtinEdgeTypes } from 'c/flowEdgeTypes';
import { shallowArrayEqual } from 'c/flowStore';
import { getMarkerId, createMarkerIds, resolveMarkers } from 'c/flowMarkers';

/**
 * The edge layer: one `<svg>` holding every edge plus the in-flight connection
 * line.
 *
 * Every edge is painted from THIS template. That is not a style preference, it
 * is forced: LWC fixes the SVG namespace at template-compile time, so a
 * component whose root is `<g>` compiles to HTML-namespace elements, and a
 * custom element nested inside `<svg>` never upgrades in a browser. See
 * `docs/ARCHITECTURE.md`, decision 3. Consequently an edge *type* is a
 * registered path provider in `c/flowEdgeTypes`, not a component.
 *
 * Edge labels are the exception: they are HTML, and render in a sibling layer
 * above this SVG, which is also how upstream's `EdgeLabelRenderer` works.
 */
export default class FlowEdgeRenderer extends LightningElement {
  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  /** Flow instance id, used to namespace marker ids across multiple flows. */
  @api flowId;

  /** Default marker applied to edges that declare none. */
  @api defaultMarkerStart;
  @api defaultMarkerEnd;

  /** Fallback edge type name for edges without one. */
  @api defaultEdgeType = 'default';

  /** Shape of the in-flight connection line. */
  @api connectionLineType = ConnectionLineType.Bezier;

  #unsubscribers = [];
  _edgeRows = [];
  _markers = [];
  _connectionPath = null;
  _viewportStyle = '';

  connectedCallback() {
    if (!this.store) {
      return;
    }

    /*
     * Three separate subscriptions rather than one over the whole state: an
     * edge geometry rebuild is expensive, and the connection line changes at
     * pointer frequency. Keeping them apart means dragging a connection does
     * not recompute every edge.
     */
    this.#unsubscribers.push(
      this.store.subscribe(
        (s) => [s.edgeVersion, s.nodeVersion, s.transform[2]],
        () => this._rebuildEdges(),
        { compare: shallowArrayEqual }
      ),
      this.store.subscribe(
        (s) => s.connection,
        (connection) => this._rebuildConnectionLine(connection)
      ),
      this.store.subscribe(
        (s) => s.transform,
        (transform) => this._applyViewport(transform),
        { compare: shallowArrayEqual }
      )
    );
  }

  disconnectedCallback() {
    for (const unsubscribe of this.#unsubscribers) {
      unsubscribe();
    }
    this.#unsubscribers = [];
  }

  /**
   * Point each edge path at its marker, using the marker's RENDERED id.
   *
   * This cannot be a template binding. Under synthetic shadow LWC rewrites
   * every `id` attribute to a root-scoped value, but the set of attributes it
   * rewrites alongside it (`@lwc/shared` `ID_REFERENCING_ATTRIBUTES_SET`) is
   * ARIA idrefs plus `for` and `popovertarget` - no SVG `url(#...)` attribute
   * is included. A bound `marker-end="url(#myId)"` would therefore reference
   * an id that no longer exists, and the arrowhead would silently vanish.
   * Native shadow does not mangle ids; reading the id back off the element
   * handles both modes with one code path.
   */
  renderedCallback() {
    if (!this._edgeRows.length) {
      return;
    }

    // Markers render in `_markers` order, so index maps logical id to real id.
    const rendered = this.template.querySelectorAll('marker');
    const idByLogical = new Map();

    this._markers.forEach((marker, index) => {
      const element = rendered[index];

      if (element) {
        idByLogical.set(marker.id, element.getAttribute('id'));
      }
    });

    for (const row of this._edgeRows) {
      const path = this.template.querySelector(`path[data-edge-id="${row.id}"]`);

      if (!path) {
        continue;
      }

      this._applyMarker(path, 'marker-start', idByLogical.get(row.markerStartId));
      this._applyMarker(path, 'marker-end', idByLogical.get(row.markerEndId));
    }
  }

  _applyMarker(path, attribute, resolvedId) {
    if (resolvedId) {
      path.setAttribute(attribute, `url(#${resolvedId})`);
    } else {
      path.removeAttribute(attribute);
    }
  }

  /** Rows consumed by the template: one per visible edge. */
  get edgeRows() {
    return this._edgeRows;
  }

  /** Template-ready marker definitions, deduplicated across every edge. */
  get markerRows() {
    return this._markers;
  }

  /** Path data for the connection being dragged, or null. */
  get connectionPath() {
    return this._connectionPath;
  }

  get hasConnection() {
    return this._connectionPath !== null;
  }

  get viewportStyle() {
    return this._viewportStyle;
  }

  /**
   * Rebuild the edge rows.
   *
   * Each row is fully resolved here rather than in a template getter, because
   * a getter would recompute on every unrelated render and the template cannot
   * call functions anyway.
   */
  _rebuildEdges() {
    const s = this.store.state;
    const rows = [];

    for (const edge of s.edges) {
      if (edge.hidden) {
        continue;
      }

      const sourceNode = s.nodeLookup.get(edge.source);
      const targetNode = s.nodeLookup.get(edge.target);

      // An edge whose endpoints are not both measured has nowhere to attach.
      if (!sourceNode || !targetNode) {
        continue;
      }

      const geometry = this._resolveGeometry(edge, sourceNode, targetNode, s);

      if (!geometry) {
        continue;
      }

      if (s.onlyRenderVisibleElements && !this._isEdgeVisible(sourceNode, targetNode, s)) {
        continue;
      }

      const pathData = getEdgePathData(edge, geometry, s.edgeTypes);
      const markerStartId = getMarkerId(edge.markerStart ?? this.defaultMarkerStart, this.flowId);
      const markerEndId = getMarkerId(edge.markerEnd ?? this.defaultMarkerEnd, this.flowId);

      rows.push({
        id: edge.id,
        path: pathData.path,
        labelX: pathData.labelX,
        labelY: pathData.labelY,
        label: edge.label,
        groupClass: this._edgeClass(edge, s),
        pathClass: edge.animated ? 'flow__edge-path animated' : 'flow__edge-path',
        style: edge.style ?? '',
        interactionWidth: edge.interactionWidth ?? DEFAULT_INTERACTION_WIDTH,
        hasInteraction: (edge.interactionWidth ?? DEFAULT_INTERACTION_WIDTH) !== 0,
        // Logical ids; the url(#...) reference is applied after render.
        markerStartId,
        markerEndId,
        ariaLabel: edge.ariaLabel ?? `Edge from ${edge.source} to ${edge.target}`,
        zIndex: this._edgeZIndex(edge, sourceNode, targetNode, s),
      });
    }

    /*
     * Paint order is z-index order. SVG has no z-index, so the rows are
     * sorted and emitted in that order; a stable sort keeps declaration order
     * for equal z, which matches upstream.
     */
    rows.sort((a, b) => a.zIndex - b.zIndex);

    this._edgeRows = rows;
    this._markers = resolveMarkers(
      createMarkerIds(s.edges, {
        id: this.flowId,
        defaultMarkerStart: this.defaultMarkerStart,
        defaultMarkerEnd: this.defaultMarkerEnd,
      }),
      s.onError
    );
  }

  /**
   * Resolve both endpoints to flow coordinates.
   *
   * Returns null when either handle cannot be found, which happens before the
   * node has been measured. Reporting `error008` on every frame of an
   * unmeasured graph would be noise, so it is reported only when the node is
   * measured and the handle is still missing - that is a real configuration
   * error.
   */
  _resolveGeometry(edge, sourceNode, targetNode, s) {
    const sourceBounds = sourceNode.internals.handleBounds;
    const targetBounds = targetNode.internals.handleBounds;

    if (!sourceBounds || !targetBounds) {
      return null;
    }

    const sourceHandle = this._pickHandle(sourceBounds.source ?? [], edge.sourceHandle);
    const targetHandle = this._pickHandle(
      s.connectionMode === ConnectionMode.Strict
        ? (targetBounds.target ?? [])
        : [...(targetBounds.target ?? []), ...(targetBounds.source ?? [])],
      edge.targetHandle
    );

    if (!sourceHandle || !targetHandle) {
      s.onError?.('008', `Couldn't resolve a handle for edge ${edge.id}.`);
      return null;
    }

    const sourcePosition = sourceHandle.position;
    const targetPosition = targetHandle.position;
    const source = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
    const target = getHandlePosition(targetNode, targetHandle, targetPosition);

    return {
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
      sourcePosition,
      targetPosition,
    };
  }

  /** First handle, or the one matching `handleId`. */
  _pickHandle(handles, handleId) {
    if (!handles.length) {
      return null;
    }

    return (handleId ? handles.find((h) => h.id === handleId) : handles[0]) ?? null;
  }

  /**
   * Whether either endpoint's node overlaps the viewport.
   *
   * A degenerate box (both endpoints identical) is widened by one unit,
   * otherwise a zero-area overlap test would always report invisible and a
   * self-loop would never paint.
   */
  _isEdgeVisible(sourceNode, targetNode, s) {
    const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));

    if (edgeBox.x === edgeBox.x2) {
      edgeBox.x2 += 1;
    }
    if (edgeBox.y === edgeBox.y2) {
      edgeBox.y2 += 1;
    }

    const [tx, ty, tScale] = s.transform;
    const viewRect = {
      x: -tx / tScale,
      y: -ty / tScale,
      width: s.width / tScale,
      height: s.height / tScale,
    };

    return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
  }

  /**
   * Edge z-index.
   *
   * Edges paint below nodes by default. An edge attached to a child node has
   * to rise above that child's parent, otherwise it would be hidden by the
   * group's background, which is why the node z values feed in here.
   */
  _edgeZIndex(edge, sourceNode, targetNode, s) {
    if (s.zIndexMode === 'manual') {
      return edge.zIndex ?? 0;
    }

    const elevateOnSelect = s.elevateEdgesOnSelect;
    const base = edge.zIndex ?? 0;
    const edgeZ = elevateOnSelect && edge.selected ? base + ELEVATE_ON_SELECT_Z : base;
    const nodeZ = Math.max(
      sourceNode.parentId || (elevateOnSelect && sourceNode.selected) ? sourceNode.internals.z : 0,
      targetNode.parentId || (elevateOnSelect && targetNode.selected) ? targetNode.internals.z : 0
    );

    return edgeZ + nodeZ;
  }

  _edgeClass(edge, s) {
    const classes = ['flow__edge', `flow__edge-${edge.type ?? this.defaultEdgeType}`];

    if (edge.selected) {
      classes.push('selected');
    }
    if (edge.animated) {
      classes.push('animated');
    }
    if (edge.selectable ?? s.elementsSelectable) {
      classes.push('selectable');
    }
    if (edge.reconnectable ?? s.edgesReconnectable) {
      classes.push('updatable');
    }

    return classes.join(' ');
  }

  /**
   * Build the in-flight connection path.
   *
   * The line runs from the originating handle to the pointer, or to the handle
   * the pointer has snapped to. Reusing the edge path providers keeps the
   * preview visually identical to the edge that will be created.
   */
  _rebuildConnectionLine(connection) {
    if (!connection?.inProgress) {
      this._connectionPath = null;
      return;
    }

    const from = connection.from;
    const to = connection.to;

    if (!from || !to) {
      this._connectionPath = null;
      return;
    }

    const provider = builtinEdgeTypes[this.connectionLineType] ?? builtinEdgeTypes.default;
    const { path } = provider.getPath({
      sourceX: from.x,
      sourceY: from.y,
      targetX: to.x,
      targetY: to.y,
      sourcePosition: connection.fromPosition,
      targetPosition: connection.toPosition,
      ...provider.defaults,
    });

    this._connectionPath = {
      path,
      lineClass:
        connection.isValid === false
          ? 'flow__connectionline invalid'
          : connection.isValid === true
            ? 'flow__connectionline valid'
            : 'flow__connectionline',
    };
  }

  /**
   * Mirror the viewport transform onto this SVG's inner group.
   *
   * The edge layer sits inside the pane, not inside the transformed viewport
   * div, because an SVG scaled by CSS would scale its stroke widths too. The
   * transform is applied to a `<g>` instead, which scales geometry while
   * `vector-effect: non-scaling-stroke` keeps strokes constant.
   */
  _applyViewport([x, y, k]) {
    this._viewportStyle = `transform: translate(${x}px, ${y}px) scale(${k});`;
  }

  handleEdgeClick(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgeclick', { detail: { id } }));
  }

  handleEdgeDoubleClick(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgedoubleclick', { detail: { id } }));
  }

  handleEdgeContextMenu(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgecontextmenu', { detail: { id } }));
  }

  handleEdgeMouseEnter(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgemouseenter', { detail: { id } }));
  }

  handleEdgeMouseLeave(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgemouseleave', { detail: { id } }));
  }

  /** Force a rebuild. Used by the root after a measurement round. */
  @api
  refresh() {
    if (this.store) {
      this._rebuildEdges();
    }
  }

  /** Exposed for measurement: node dimensions helper used by tests. */
  @api
  getNodeSize(nodeId) {
    const node = this.store?.state.nodeLookup.get(nodeId);

    return node ? getNodeDimensions(node) : { width: 0, height: 0 };
  }
}
