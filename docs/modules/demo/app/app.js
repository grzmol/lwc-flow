import { LightningElement } from 'lwc';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'c/flowGraph';
import { MarkerType, Position } from 'c/flowTypes';
import CardNode from 'demo/cardNode';

const ARROW = Object.freeze({ type: MarkerType.ArrowClosed, width: 16, height: 16 });
const FLOWS_RIGHT = Object.freeze({ sourcePosition: Position.Right, targetPosition: Position.Left });

/** The starting graph: a revenue model, left to right, inputs to KPIs. */
function initialNodes() {
  return [
    {
      id: 'web',
      type: 'card',
      position: { x: 0, y: 0 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Web form submissions',
        meta: 'Input · Sum',
        icon: '◆',
        tone: 'blue',
        metrics: [
          { label: 'Past 7 days', value: '4,570', delta: '0.87% ↗', direction: 'up' },
          { label: 'Past 6 weeks', value: '26,958', delta: '2.71% ↗', direction: 'up' },
        ],
      },
    },
    {
      id: 'events',
      type: 'card',
      position: { x: 0, y: 160 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Event registrations',
        meta: 'Input · Sum',
        icon: '▲',
        tone: 'violet',
        metrics: [
          { label: 'Past 7 days', value: '641', delta: '1.04% ↗', direction: 'up' },
          { label: 'Past 6 weeks', value: '3,318', delta: '1.44% ↗', direction: 'up' },
        ],
      },
    },
    {
      id: 'partner',
      type: 'card',
      position: { x: 0, y: 320 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Partner referrals',
        meta: 'Input · Sum',
        icon: '●',
        tone: 'amber',
        metrics: [
          { label: 'Past 7 days', value: '188', delta: '3.10% ↘', direction: 'down' },
          { label: 'Past 6 weeks', value: '1,204', delta: 'no change', direction: 'flat' },
        ],
      },
    },
    {
      id: 'qualification',
      type: 'group',
      position: { x: 300, y: 60 },
      style: { width: 264, height: 262 },
      data: { label: 'Qualification' },
    },
    {
      id: 'mql',
      type: 'card',
      parentId: 'qualification',
      extent: 'parent',
      position: { x: 20, y: 38 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Marketing qualified',
        meta: 'Jira Epic · 4 issues',
        icon: '◈',
        tone: 'green',
        progress: 0.67,
        footer: '4 issues · 67% done',
        chip: { text: 'In progress', tone: 'green' },
      },
    },
    {
      id: 'score',
      type: 'card',
      parentId: 'qualification',
      extent: 'parent',
      position: { x: 20, y: 150 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Lead scoring model',
        meta: 'Apex · Einstein',
        icon: '✦',
        tone: 'violet',
        progress: 0.25,
        footer: '6 issues · 25% done',
        chip: { text: 'To do', tone: 'amber' },
      },
    },
    {
      id: 'pipeline',
      type: 'card',
      position: { x: 640, y: 128 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Qualified pipeline created',
        meta: 'North Star · Sum',
        icon: '★',
        tone: 'violet',
        size: 'lg',
        emphasis: true,
        metrics: [
          { label: 'Past 7 days', value: '$4.41M', delta: '0.43% ↗', direction: 'up' },
          { label: 'Past 6 weeks', value: '$26.1M', delta: '2.57% ↗', direction: 'up' },
          { label: 'Past 12 months', value: '$198M', delta: '38.59% ↗', direction: 'up' },
        ],
      },
    },
    {
      id: 'arr',
      type: 'card',
      position: { x: 1000, y: 0 },
      ...FLOWS_RIGHT,
      data: {
        title: 'ARR',
        meta: 'KPI · Amount increased',
        icon: '◆',
        tone: 'green',
        metrics: [
          { label: 'Past 6 weeks', value: '$56,760', delta: '1,676% ↗', direction: 'up' },
          { label: 'Past 12 months', value: '$612K', delta: '24.6% ↗', direction: 'up' },
        ],
      },
    },
    {
      id: 'retention',
      type: 'card',
      position: { x: 1000, y: 160 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Monthly retention',
        meta: 'KPI · Average',
        icon: '◈',
        tone: 'blue',
        metrics: [
          { label: 'Past 6 weeks', value: '71,521', delta: '3.32% ↗', direction: 'up' },
          { label: 'Past 12 months', value: '63,825', delta: '37.70% ↗', direction: 'up' },
        ],
      },
    },
    {
      id: 'cycle',
      type: 'card',
      position: { x: 1000, y: 320 },
      ...FLOWS_RIGHT,
      data: {
        title: 'Sales cycle length',
        meta: 'KPI · Average',
        icon: '●',
        tone: 'rose',
        metrics: [
          { label: 'Past 6 weeks', value: '38 days', delta: '4.10% ↘', direction: 'down' },
          { label: 'Past 12 months', value: '44 days', delta: '9.80% ↘', direction: 'down' },
        ],
      },
    },
  ];
}

function initialEdges() {
  return [
    { id: 'e-web-mql', source: 'web', target: 'mql', markerEnd: ARROW },
    { id: 'e-events-mql', source: 'events', target: 'mql', markerEnd: ARROW },
    { id: 'e-partner-score', source: 'partner', target: 'score', markerEnd: ARROW },
    { id: 'e-mql-pipeline', source: 'mql', target: 'pipeline', animated: true, markerEnd: ARROW },
    { id: 'e-score-pipeline', source: 'score', target: 'pipeline', markerEnd: ARROW },
    { id: 'e-pipeline-arr', source: 'pipeline', target: 'arr', animated: true, markerEnd: ARROW },
    { id: 'e-pipeline-retention', source: 'pipeline', target: 'retention', markerEnd: ARROW },
    { id: 'e-pipeline-cycle', source: 'pipeline', target: 'cycle', markerEnd: ARROW },
  ].map((edge) => ({ ...edge, type: 'default' }));
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

const NODE_TYPES = ['card', 'input', 'output', 'default', 'group'];
const TONES = ['violet', 'blue', 'green', 'amber', 'rose'];
const CHIP_TONES = ['slate', ...TONES];
const SIZES = ['md', 'lg'];
const POSITIONS = [Position.Top, Position.Right, Position.Bottom, Position.Left];

function emptyDraft(sequence) {
  return {
    id: `node-${sequence}`,
    type: 'card',
    title: `Metric ${sequence}`,
    meta: 'Input · Sum',
    icon: '◆',
    tone: 'blue',
    size: 'md',
    chipText: '',
    chipTone: 'slate',
    progress: '',
    x: 0,
    y: 0,
    width: 260,
    height: 200,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
    selectable: true,
    connectable: true,
    deletable: true,
    parentId: '',
  };
}

/** `<option selected>` cannot be an expression in an LWC template, so the flag is computed here. */
function options(values, current) {
  return values.map((value) => ({
    key: value || 'none',
    value,
    label: value || '(none)',
    selected: value === current,
  }));
}

/** Turn the form draft into a node object of the shape `c-flow` expects for the chosen type. */
function buildNode(draft) {
  const node = {
    id: draft.id,
    type: draft.type,
    position: { x: Number(draft.x) || 0, y: Number(draft.y) || 0 },
    sourcePosition: draft.sourcePosition,
    targetPosition: draft.targetPosition,
    draggable: draft.draggable,
    selectable: draft.selectable,
    connectable: draft.connectable,
    deletable: draft.deletable,
    data: { label: draft.title, title: draft.title },
  };

  if (draft.parentId) {
    node.parentId = draft.parentId;
    node.extent = 'parent';
  }

  if (draft.type === 'group') {
    node.style = { width: Number(draft.width) || 200, height: Number(draft.height) || 160 };
    return node;
  }

  if (draft.type !== 'card') {
    return node;
  }

  node.data = {
    title: draft.title,
    meta: draft.meta || undefined,
    icon: draft.icon || '◆',
    tone: draft.tone,
    size: draft.size,
  };

  if (draft.chipText) {
    node.data.chip = { text: draft.chipText, tone: draft.chipTone };
  }

  if (draft.progress !== '') {
    node.data.progress = Math.min(1, Math.max(0, Number(draft.progress) / 100));
  }

  return node;
}

const LOG_LIMIT = 9;
const HISTORY_LIMIT = 40;

/**
 * Which changes are worth a history entry. A drag emits a position change per pointer move, so only
 * the one that ends it counts; dimension and select changes are measurement and focus, not edits.
 */
function isUndoable(change) {
  if (change.type === 'position') {
    return change.dragging === false;
  }

  return change.type === 'remove' || change.type === 'add' || change.type === 'replace';
}

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

  nodeTypes = { card: CardNode };
  edgeTypes = edgeTypes;

  snapToGrid = false;
  showMinimap = true;
  showBackground = true;
  showControls = true;
  fitView = true;
  fitViewOptions = { padding: 0.12 };

  zoomLabel = '100%';
  logEntries = [];

  locked = false;
  theme = 'light';
  adding = false;
  draft = emptyDraft(1);
  selectedId = null;
  selectedKind = null;

  _nextId = 1;
  _logSeq = 0;
  _past = [];
  _future = [];

  /**
   * Passed to `c-flow` as a property, so it must be a stable bound function: a fresh arrow on every
   * render would reset the connection gesture mid-drag.
   */
  isValidConnection = (connection) => {
    if (connection.source === connection.target) {
      return false;
    }

    return !this.edges.some((edge) => edge.source === connection.source && edge.target === connection.target);
  };

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

  get hasNoSelection() {
    return this.selectedCount === 0;
  }

  get nodesDraggable() {
    return !this.locked;
  }

  get themeIcon() {
    return this.theme === 'dark' ? '☀' : '☾';
  }

  get themeTitle() {
    return this.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }

  get cannotUndo() {
    return this._past.length === 0;
  }

  get cannotRedo() {
    return this._future.length === 0;
  }

  // -------------------------------------------------------------- inspector

  get inspected() {
    if (this.selectedKind === 'node') {
      return this.nodes.find((node) => node.id === this.selectedId) ?? null;
    }

    if (this.selectedKind === 'edge') {
      return this.edges.find((edge) => edge.id === this.selectedId) ?? null;
    }

    return null;
  }

  get hasInspected() {
    return this.inspected !== null;
  }

  get inspectedIsNode() {
    return this.hasInspected && this.selectedKind === 'node';
  }

  get inspectedTitle() {
    return this.inspected?.data?.title ?? this.inspected?.data?.label ?? '';
  }

  get inspectedRows() {
    const element = this.inspected;

    if (!element) {
      return [];
    }

    const rows =
      this.selectedKind === 'node'
        ? [
            ['id', element.id],
            ['type', element.type ?? 'default'],
            ['position', `${Math.round(element.position.x)}, ${Math.round(element.position.y)}`],
            ['size', `${Math.round(element.measured?.width ?? 0)} x ${Math.round(element.measured?.height ?? 0)}`],
            ['parent', element.parentId ?? '-'],
          ]
        : [
            ['id', element.id],
            ['type', element.type ?? 'default'],
            ['source', element.source],
            ['target', element.target],
            ['animated', element.animated ? 'true' : 'false'],
          ];

    return rows.map(([label, value]) => ({ key: `${element.id}-${label}`, label, value: String(value) }));
  }

  // ------------------------------------------------------------ new node

  get isCardDraft() {
    return this.draft.type === 'card';
  }

  get isGroupDraft() {
    return this.draft.type === 'group';
  }

  get typeOptions() {
    return options(NODE_TYPES, this.draft.type);
  }

  get draftToneOptions() {
    return options(TONES, this.draft.tone);
  }

  get draftChipToneOptions() {
    return options(CHIP_TONES, this.draft.chipTone);
  }

  get sizeOptions() {
    return options(SIZES, this.draft.size);
  }

  get sourceOptions() {
    return options(POSITIONS, this.draft.sourcePosition);
  }

  get targetOptions() {
    return options(POSITIONS, this.draft.targetPosition);
  }

  get parentOptions() {
    const groups = this.nodes.filter((node) => node.type === 'group').map((node) => node.id);

    return options(['', ...groups], this.draft.parentId);
  }

  get toneOptions() {
    const current = this.inspected?.data?.tone;

    return ['violet', 'blue', 'green', 'amber', 'rose'].map((tone) => ({
      key: tone,
      tone,
      selected: tone === current,
    }));
  }

  // -------------------------------------------------- the controlled cycle

  handleNodesChange(event) {
    const { changes } = event.detail;

    if (changes.some(isUndoable)) {
      this._commit();
    }

    this.nodes = applyNodeChanges(changes, this.nodes);
    this._log(changes.map((change) => `node ${change.type}: ${change.id}`));
  }

  handleEdgesChange(event) {
    const { changes } = event.detail;

    if (changes.some(isUndoable)) {
      this._commit();
    }

    this.edges = applyEdgeChanges(changes, this.edges);
    this._log(changes.map((change) => `edge ${change.type}: ${change.id}`));
  }

  handleConnect(event) {
    const connection = event.detail;

    this._commit();
    this.edges = addEdge({ ...connection, type: 'default', markerEnd: ARROW }, this.edges);
    this._log([`connect: ${connection.source} -> ${connection.target}`]);
  }

  // ------------------------------------------------------------- selection

  handleNodeClick(event) {
    this.selectedKind = 'node';
    this.selectedId = event.detail.id;
  }

  handleEdgeClick(event) {
    this.selectedKind = 'edge';
    this.selectedId = event.detail.id;
  }

  handlePaneClick() {
    this.selectedKind = null;
    this.selectedId = null;
  }

  handleTitleInput(event) {
    const title = event.target.value;

    this.nodes = this.nodes.map((node) =>
      node.id === this.selectedId ? { ...node, data: { ...node.data, title } } : node
    );
  }

  handleToneClick(event) {
    const tone = event.currentTarget.dataset.tone;

    this._commit();
    this.nodes = this.nodes.map((node) =>
      node.id === this.selectedId ? { ...node, data: { ...node.data, tone } } : node
    );
    this._log([`tone ${this.selectedId}: ${tone}`]);
  }

  handleToggleAnimated() {
    this._commit();
    this.edges = this.edges.map((edge) => (edge.id === this.selectedId ? { ...edge, animated: !edge.animated } : edge));
    this._log([`animated ${this.selectedId}`]);
  }

  // --------------------------------------------------------- undo and redo

  handleUndo() {
    const previous = this._past.pop();

    if (!previous) {
      return;
    }

    this._future.push(this._snapshot());
    this._restore(previous);
    this._log(['undo']);
  }

  handleRedo() {
    const next = this._future.pop();

    if (!next) {
      return;
    }

    this._past.push(this._snapshot());
    this._restore(next);
    this._log(['redo']);
  }

  handleMove(event) {
    this._showZoom(event.detail.viewport.zoom);
  }

  handleNodesInitialized() {
    this._showZoom(this.refs.flow.getZoom());
  }

  connectedCallback() {
    document.documentElement.dataset.theme = this.theme;
  }

  handleFlowError(event) {
    this._log([`error ${event.detail.id}`]);
  }

  // ------------------------------------------------------------- toolbar

  handleOpenAdd() {
    const pane = this.template.querySelector('.demo__canvas').getBoundingClientRect();
    const centre = this.refs.flow.screenToFlowPosition({
      x: pane.left + pane.width / 2,
      y: pane.top + pane.height / 2,
    });

    this.draft = { ...emptyDraft(this._nextId), x: Math.round(centre.x), y: Math.round(centre.y) };
    this.adding = true;
  }

  handleCancelAdd() {
    this.adding = false;
  }

  handleDraftChange(event) {
    const { field } = event.target.dataset;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

    this.draft = { ...this.draft, [field]: value };
  }

  handleCreateNode() {
    const draft = this.draft;

    if (this.nodes.some((node) => node.id === draft.id)) {
      this._log([`id taken: ${draft.id}`]);
      return;
    }

    this._commit();
    this.nodes = [...this.nodes, buildNode(draft)];
    this._nextId += 1;
    this.adding = false;
    this._log([`added ${draft.id} (${draft.type})`]);
  }

  handleDeleteSelected() {
    this.refs.flow.deleteElements({
      nodes: this.nodes.filter((node) => node.selected),
      edges: this.edges.filter((edge) => edge.selected),
    });
  }

  handleFitView() {
    this.refs.flow.fitViewport({ padding: 0.12, duration: 400 });
  }

  handleEdgeTypeChange(event) {
    const type = event.target.value;

    this._commit();
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

  handleLockChange(event) {
    this.locked = event.target.checked;
  }

  /**
   * The palette lives on :root, not on this component: a custom property is the only thing that
   * crosses a shadow boundary, so one attribute on <html> re-themes the flow and the node cards too.
   */
  handleThemeToggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = this.theme;
  }

  async handleCopyJson() {
    const json = JSON.stringify({ nodes: this.nodes, edges: this.edges }, null, 2);

    try {
      await navigator.clipboard.writeText(json);
      this._log([`copied ${json.length} bytes`]);
    } catch {
      this._log(['clipboard blocked']);
    }
  }

  handleReset() {
    this._commit();
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

  _snapshot() {
    return { nodes: this.nodes, edges: this.edges };
  }

  /** Push the state as it is now, then drop the redo stack: a new branch invalidates the old one. */
  _commit() {
    this._past = [...this._past.slice(-HISTORY_LIMIT + 1), this._snapshot()];
    this._future = [];
  }

  _restore({ nodes, edges }) {
    this.nodes = nodes;
    this.edges = edges;
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
