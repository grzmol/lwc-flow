import { LightningElement } from 'lwc';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'c/flowGraph';
import { MarkerType, Position } from 'c/flowTypes';
import PillNode from 'demo/pillNode';

const ARROW = Object.freeze({ type: MarkerType.ArrowClosed, width: 18, height: 18 });

/** The starting graph: one of every built-in node type, plus the custom `pill` type. */
function initialNodes() {
  return [
    { id: 'lead', type: 'input', position: { x: 40, y: 0 }, data: { label: 'Lead created' } },
    { id: 'score', type: 'pill', position: { x: 30, y: 110 }, data: { label: 'Score lead', badge: 'apex' } },
    { id: 'route', position: { x: 40, y: 220 }, data: { label: 'Route by score' } },
    {
      id: 'pod',
      type: 'group',
      position: { x: -220, y: 340 },
      style: { width: 260, height: 170 },
      data: { label: 'Sales pod' },
    },
    {
      id: 'ae-1',
      type: 'pill',
      parentId: 'pod',
      extent: 'parent',
      position: { x: 24, y: 40 },
      data: { label: 'Assign AE', badge: 'queue' },
    },
    {
      id: 'ae-2',
      type: 'pill',
      parentId: 'pod',
      extent: 'parent',
      position: { x: 24, y: 105 },
      data: { label: 'Notify AE', badge: 'platform event' },
    },
    { id: 'nurture', position: { x: 160, y: 380 }, data: { label: 'Nurture campaign' } },
    { id: 'converted', type: 'output', position: { x: 60, y: 560 }, data: { label: 'Converted' } },
  ];
}

function initialEdges() {
  return [
    { id: 'e-lead-score', source: 'lead', target: 'score', type: 'smoothstep', markerEnd: ARROW },
    { id: 'e-score-route', source: 'score', target: 'route', type: 'smoothstep', markerEnd: ARROW },
    { id: 'e-route-ae', source: 'route', target: 'ae-1', type: 'smoothstep', animated: true, markerEnd: ARROW },
    { id: 'e-route-nurture', source: 'route', target: 'nurture', type: 'smoothstep', markerEnd: ARROW },
    { id: 'e-ae-notify', source: 'ae-1', target: 'ae-2', type: 'step', markerEnd: ARROW },
    { id: 'e-ae-converted', source: 'ae-2', target: 'converted', type: 'wavy', markerEnd: ARROW },
    { id: 'e-nurture-converted', source: 'nurture', target: 'converted', type: 'smoothstep', markerEnd: ARROW },
  ];
}

/**
 * A custom edge type is a path provider, not a component: LWC fixes the SVG namespace per template
 * and a custom element never upgrades inside `<svg>`, so one renderer paints every edge.
 */
const edgeTypes = Object.freeze({
  wavy: Object.freeze({
    getPath: ({ sourceX, sourceY, targetX, targetY }) => {
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;

      return {
        path: `M${sourceX},${sourceY} Q${midX - 70},${midY} ${midX},${midY} T${targetX},${targetY}`,
        labelX: midX,
        labelY: midY,
        offsetX: 0,
        offsetY: 0,
      };
    },
    defaults: Object.freeze({}),
  }),
});

const LOG_LIMIT = 9;

/**
 * The demo host.
 *
 * It is deliberately written the way a consumer writes one: the graph lives here, `c-flow` never
 * owns it, and every interaction arrives as a change array that is folded back in. The change log
 * on the right is that contract made visible.
 */
export default class App extends LightningElement {
  nodes = initialNodes();
  edges = initialEdges();

  nodeTypes = { pill: PillNode };
  edgeTypes = edgeTypes;

  snapToGrid = false;
  showMinimap = true;
  showBackground = true;
  showControls = true;
  fitView = true;
  fitViewOptions = { padding: 0.18 };

  zoomLabel = '100%';
  logEntries = [];

  _nextId = 1;
  _logSeq = 0;

  // ------------------------------------------------------------------ stats

  get nodeCount() {
    return this.nodes.length;
  }

  get edgeCount() {
    return this.edges.length;
  }

  get selectedCount() {
    return this.nodes.filter((node) => node.selected).length + this.edges.filter((edge) => edge.selected).length;
  }

  get hasSelection() {
    return this.selectedCount > 0;
  }

  get hasNoSelection() {
    return this.selectedCount === 0;
  }

  get snapLabel() {
    return this.snapToGrid ? 'on' : 'off';
  }

  // -------------------------------------------------- the controlled cycle

  handleNodesChange(event) {
    const { changes } = event.detail;

    this.nodes = applyNodeChanges(changes, this.nodes);
    this._log(changes.map((change) => `node ${change.type}: ${change.id}`));
  }

  handleEdgesChange(event) {
    const { changes } = event.detail;

    this.edges = applyEdgeChanges(changes, this.edges);
    this._log(changes.map((change) => `edge ${change.type}: ${change.id}`));
  }

  handleConnect(event) {
    const connection = event.detail;

    this.edges = addEdge({ ...connection, type: 'smoothstep', markerEnd: ARROW }, this.edges);
    this._log([`connect: ${connection.source} -> ${connection.target}`]);
  }

  handleMove(event) {
    this._showZoom(event.detail.viewport.zoom);
  }

  handleNodesInitialized() {
    this._showZoom(this.refs.flow.getZoom());
  }

  handleFlowError(event) {
    this._log([`error ${event.detail.id}`]);
  }

  // ------------------------------------------------------------- toolbar

  handleAddNode() {
    const id = `added-${this._nextId++}`;
    const viewport = this.refs.flow.getViewport();
    const pane = this.template.querySelector('.demo__canvas').getBoundingClientRect();
    const position = this.refs.flow.screenToFlowPosition({
      x: pane.left + pane.width / 2,
      y: pane.top + pane.height / 2,
    });

    this.nodes = [
      ...this.nodes,
      {
        id,
        type: 'pill',
        position: { x: Math.round(position.x), y: Math.round(position.y) },
        data: { label: `Step ${this._nextId - 1}` },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
    ];
    this._log([`added ${id} at zoom ${viewport.zoom.toFixed(2)}`]);
  }

  handleDeleteSelected() {
    this.refs.flow.deleteElements({
      nodes: this.nodes.filter((node) => node.selected),
      edges: this.edges.filter((edge) => edge.selected),
    });
  }

  handleFitView() {
    this.refs.flow.fitViewport({ padding: 0.15, duration: 400 });
  }

  handleEdgeTypeChange(event) {
    const type = event.target.value;

    this.edges = this.edges.map((edge) => ({ ...edge, type }));
    this._log([`edge type: ${type}`]);
  }

  handleSnapChange(event) {
    this.snapToGrid = event.target.checked;
  }

  handleMinimapChange(event) {
    this.showMinimap = event.target.checked;
  }

  handleBackgroundChange(event) {
    this.showBackground = event.target.checked;
  }

  handleReset() {
    this.nodes = initialNodes();
    this.edges = initialEdges();
    this.logEntries = [];
    this._log(['reset']);
    this.handleFitView();
  }

  // ------------------------------------------------------------ internals

  _showZoom(zoom) {
    this.zoomLabel = `${Math.round(zoom * 100)}%`;
  }

  /** Newest first, capped: the log is a demonstration, not a store. */
  _log(messages) {
    if (messages.length === 0) {
      return;
    }

    const entries = messages.map((text) => ({ key: `log-${this._logSeq++}`, text }));

    this.logEntries = [...entries.reverse(), ...this.logEntries].slice(0, LOG_LIMIT);
  }
}
