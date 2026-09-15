import { createElement } from 'lwc';
import Flow from 'c/flow';
import { Position, ConnectionMode, SelectionMode } from 'c/flowTypes';

function flushPromises() {
  return Promise.resolve();
}

/**
 * jsdom reports a zero rect for every element, and the flow measures its pane
 * during the first render. Stub the prototype so the measurement taken on that
 * first pass is a realistic 800x600; a real browser gets this from layout, and
 * subsequent changes from the ResizeObserver that jsdom does not implement.
 */
const PANE = { width: 800, height: 600, left: 0, top: 0 };

function stubRects(rect = PANE) {
  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      right: rect.left + rect.width,
      bottom: rect.top + rect.height,
      x: rect.left,
      y: rect.top,
    };
  };
}

function node(id, x, y, { width = 100, height = 50, ...rest } = {}) {
  return {
    id,
    position: { x, y },
    measured: { width, height },
    handles: [
      { id: null, type: 'source', position: Position.Bottom, x: width / 2, y: height, width: 0, height: 0 },
      { id: null, type: 'target', position: Position.Top, x: width / 2, y: 0, width: 0, height: 0 },
    ],
    ...rest,
  };
}

async function mount(props = {}) {
  const element = createElement('c-flow', { is: Flow });
  Object.assign(element, props);
  document.body.appendChild(element);
  await flushPromises();

  const pane = element.shadowRoot.querySelector('.flow__pane');
  pane.setPointerCapture = jest.fn();
  pane.releasePointerCapture = jest.fn();

  return element;
}

function pointer(type, { clientX = 0, clientY = 0, pointerId = 1, button = 0 } = {}) {
  // jsdom has no PointerEvent constructor.
  const event = new MouseEvent(type, { clientX, clientY, button, bubbles: true, cancelable: true });
  Object.defineProperty(event, 'pointerId', { value: pointerId });

  return event;
}

describe('c-flow', () => {
  const originalGetRect = Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    stubRects();
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetRect;
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  describe('composition', () => {
    it('renders the pane, the edge layer and the node layer', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });

      expect(element.shadowRoot.querySelector('.flow__pane')).not.toBeNull();
      expect(element.shadowRoot.querySelector('.flow__viewport')).not.toBeNull();
      expect(element.shadowRoot.querySelector('c-flow-edge-renderer')).not.toBeNull();
      expect(element.shadowRoot.querySelector('c-flow-node-renderer')).not.toBeNull();
    });

    it('omits every addon by default and renders them on request', async () => {
      const bare = await mount();

      expect(bare.shadowRoot.querySelector('c-flow-background')).toBeNull();
      expect(bare.shadowRoot.querySelector('c-flow-controls')).toBeNull();
      expect(bare.shadowRoot.querySelector('c-flow-minimap')).toBeNull();

      document.body.removeChild(bare);

      const full = await mount({ showBackground: true, showControls: true, showMinimap: true });

      expect(full.shadowRoot.querySelector('c-flow-background')).not.toBeNull();
      expect(full.shadowRoot.querySelector('c-flow-controls')).not.toBeNull();
      expect(full.shadowRoot.querySelector('c-flow-minimap')).not.toBeNull();
    });

    it('hands the same store instance to every layer', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const edges = element.shadowRoot.querySelector('c-flow-edge-renderer');
      const nodes = element.shadowRoot.querySelector('c-flow-node-renderer');

      expect(element.store).not.toBeNull();
      expect(edges.store).toBe(element.store);
      expect(nodes.store).toBe(element.store);
    });

    it('gives two flows on one page independent stores', async () => {
      const a = await mount({ nodes: [node('a', 0, 0)] });
      const b = await mount({ nodes: [node('b', 0, 0)] });

      expect(a.store).not.toBe(b.store);
      expect(a.flowId).not.toBe(b.flowId);
      expect(a.getNode('a')).toBeDefined();
      expect(a.getNode('b')).toBeUndefined();
    });

    it('emits init once the pane is live', async () => {
      const handler = jest.fn();
      const element = createElement('c-flow', { is: Flow });
      element.addEventListener('init', handler);
      document.body.appendChild(element);
      await flushPromises();

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail.flowId).toBe(element.flowId);
      expect(element.viewportInitialized).toBe(true);
    });
  });

  describe('inbound data', () => {
    it('normalises a non-array to an empty array', async () => {
      const element = await mount({ nodes: undefined, edges: null });

      expect(element.getNodes()).toEqual([]);
      expect(element.getEdges()).toEqual([]);
    });

    it("never writes to the caller's nodes", async () => {
      const original = node('a', 0, 0);
      const frozen = Object.freeze([Object.freeze(original)]);

      /*
       * Adoption must not write to the user's objects. Identity is not
       * asserted because LWC hands an @api value through its reactivity
       * membrane, so the property reads back as a proxy of the same data.
       */
      const element = await mount({ nodes: frozen });

      expect(() => element.store.setNodes(frozen)).not.toThrow();
      expect(element.getNodes()).toEqual(frozen);
      expect(original.position).toEqual({ x: 0, y: 0 });
      expect(original.selected).toBeUndefined();
    });

    it('adopts nodes into the lookup and exposes them', async () => {
      const element = await mount({ nodes: [node('a', 10, 20), node('b', 100, 200)] });

      expect(element.getNode('a').position).toEqual({ x: 10, y: 20 });
      expect(element.getInternalNode('b').internals.positionAbsolute).toEqual({ x: 100, y: 200 });
    });

    it('indexes edges for lookup and connection queries', async () => {
      const element = await mount({
        nodes: [node('a', 0, 0), node('b', 200, 0)],
        edges: [{ id: 'e1', source: 'a', target: 'b', sourceHandle: 's1' }],
      });

      expect(element.getEdge('e1')).toBeDefined();
      expect(element.getNodeConnections({ nodeId: 'a' })).toHaveLength(1);
      expect(element.getNodeConnections({ nodeId: 'a', type: 'source', handleId: 's1' })).toHaveLength(1);
      expect(element.getNodeConnections({ nodeId: 'a', type: 'target' })).toHaveLength(0);
    });
  });

  describe('change plumbing', () => {
    it('forwards node changes from the node layer', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);

      const changes = [{ id: 'a', type: 'position', position: { x: 5, y: 5 } }];
      element.shadowRoot
        .querySelector('c-flow-node-renderer')
        .dispatchEvent(new CustomEvent('nodeschange', { detail: { changes } }));

      expect(handler.mock.calls[0][0].detail.changes).toBe(changes);
    });

    it('does not emit an empty change list', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);

      element.shadowRoot
        .querySelector('c-flow-node-renderer')
        .dispatchEvent(new CustomEvent('nodeschange', { detail: { changes: [] } }));

      expect(handler).not.toHaveBeenCalled();
    });

    it('applies node changes through the reducer without mutating the input', async () => {
      const nodes = [node('a', 0, 0)];
      const element = await mount({ nodes });
      const next = element.applyNodeChanges([{ id: 'a', type: 'position', position: { x: 9, y: 9 } }]);

      expect(next[0].position).toEqual({ x: 9, y: 9 });
      expect(nodes[0].position).toEqual({ x: 0, y: 0 });
    });

    it('adds an edge and refuses a duplicate', async () => {
      const element = await mount({
        nodes: [node('a', 0, 0), node('b', 200, 0)],
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
      });

      expect(element.addEdge({ source: 'a', target: 'b' })).toHaveLength(1);
      expect(element.addEdge({ source: 'b', target: 'a' })).toHaveLength(2);
    });

    it('reports an invalid edge through flowerror', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const handler = jest.fn();
      element.addEventListener('flowerror', handler);

      element.addEdge({ source: '', target: 'a' });

      expect(handler.mock.calls[0][0].detail.id).toBe('006');
    });

    it('forwards a connection from the node layer', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const handler = jest.fn();
      element.addEventListener('connect', handler);

      const connection = { source: 'a', target: 'b', sourceHandle: null, targetHandle: null };
      element.shadowRoot
        .querySelector('c-flow-node-renderer')
        .dispatchEvent(new CustomEvent('connect', { detail: connection }));

      expect(handler.mock.calls[0][0].detail).toEqual(connection);
    });
  });

  describe('deleteElements', () => {
    it('cascades to child nodes and connected edges', async () => {
      const element = await mount({
        nodes: [node('parent', 0, 0), node('child', 10, 10, { parentId: 'parent' }), node('other', 400, 0)],
        edges: [
          { id: 'e-child', source: 'child', target: 'other' },
          { id: 'e-other', source: 'other', target: 'other' },
        ],
      });
      const nodeHandler = jest.fn();
      const edgeHandler = jest.fn();
      element.addEventListener('nodeschange', nodeHandler);
      element.addEventListener('edgeschange', edgeHandler);

      const removed = element.deleteElements({ nodes: [{ id: 'parent' }] });

      expect(removed.nodes.map((n) => n.id).sort()).toEqual(['child', 'parent']);
      expect(removed.edges.map((e) => e.id)).toEqual(['e-child']);
      expect(nodeHandler.mock.calls[0][0].detail.changes).toEqual([
        { id: 'parent', type: 'remove' },
        { id: 'child', type: 'remove' },
      ]);
      expect(edgeHandler.mock.calls[0][0].detail.changes).toEqual([{ id: 'e-child', type: 'remove' }]);
    });

    it('respects deletable false', async () => {
      const element = await mount({
        nodes: [node('a', 0, 0, { deletable: false }), node('b', 200, 0)],
      });
      const removed = element.deleteElements({ nodes: [{ id: 'a' }, { id: 'b' }] });

      expect(removed.nodes.map((n) => n.id)).toEqual(['b']);
    });

    it('can be vetoed by beforeDelete', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);
      element.beforeDelete = () => false;

      expect(element.deleteElements({ nodes: [{ id: 'a' }] })).toEqual({ nodes: [], edges: [] });
      expect(handler).not.toHaveBeenCalled();
    });

    it('passes the resolved set to beforeDelete', async () => {
      const beforeDelete = jest.fn(() => true);
      const element = await mount({
        nodes: [node('a', 0, 0), node('b', 200, 0)],
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
      });
      element.beforeDelete = beforeDelete;

      element.deleteElements({ nodes: [{ id: 'a' }] });

      expect(beforeDelete.mock.calls[0][0].nodes.map((n) => n.id)).toEqual(['a']);
      expect(beforeDelete.mock.calls[0][0].edges.map((e) => e.id)).toEqual(['e1']);
    });
  });

  describe('coordinate conversion', () => {
    it('round-trips a point through screen and flow space', async () => {
      stubRects({ width: 800, height: 600, left: 30, top: 40 });
      const element = await mount();

      await element.setViewport({ x: -100, y: -50, zoom: 2 });

      const screen = { x: 230, y: 240 };
      const flow = element.screenToFlowPosition(screen);
      const back = element.flowToScreenPosition(flow);

      expect(flow).toEqual({ x: (230 - 30 + 100) / 2, y: (240 - 40 + 50) / 2 });
      expect(back.x).toBeCloseTo(screen.x, 6);
      expect(back.y).toBeCloseTo(screen.y, 6);
    });

    it('snaps when asked', async () => {
      const element = await mount({ snapToGrid: true, snapGrid: [25, 25] });

      expect(element.screenToFlowPosition({ x: 61, y: 61 })).toEqual({ x: 50, y: 50 });
      expect(element.screenToFlowPosition({ x: 61, y: 61 }, { snapToGrid: false })).toEqual({ x: 61, y: 61 });
    });
  });

  describe('viewport api', () => {
    it('reports and sets the viewport', async () => {
      const element = await mount();

      expect(element.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });

      await element.setViewport({ x: -10, y: -20, zoom: 1.5 });

      expect(element.getViewport()).toEqual({ x: -10, y: -20, zoom: 1.5 });
      expect(element.getZoom()).toBe(1.5);
    });

    it('zooms in and out by the upstream factor', async () => {
      const element = await mount();

      await element.zoomIn();
      expect(element.getZoom()).toBeCloseTo(1.2, 6);

      await element.zoomOut();
      expect(element.getZoom()).toBeCloseTo(1, 6);
    });

    it('clamps zoom to minZoom and maxZoom', async () => {
      const element = await mount({ minZoom: 0.5, maxZoom: 2 });

      await element.zoomTo(99);
      expect(element.getZoom()).toBe(2);

      await element.zoomTo(0.01);
      expect(element.getZoom()).toBe(0.5);
    });

    it('centres a flow point', async () => {
      const element = await mount();

      await element.setCenter(100, 50, { zoom: 1 });

      // pane is 800x600, so the centre lands at 400,300.
      expect(element.getViewport()).toEqual({ x: 400 - 100, y: 300 - 50, zoom: 1 });
    });

    it('fits given bounds', async () => {
      const element = await mount({ minZoom: 0.1, maxZoom: 4 });

      await element.fitBounds({ x: 0, y: 0, width: 400, height: 300 }, { padding: 0 });

      // 800/400 and 600/300 both give 2.
      expect(element.getZoom()).toBeCloseTo(2, 6);
    });

    it('fits every node and refuses when nothing is measured', async () => {
      const element = await mount({ nodes: [node('a', 0, 0), node('b', 300, 200)], minZoom: 0.1, maxZoom: 4 });

      await expect(element.fitViewport({ padding: 0 })).resolves.toBe(true);
      expect(element.getZoom()).toBeGreaterThan(1);

      document.body.removeChild(element);

      const unmeasured = await mount({ nodes: [{ id: 'a', position: { x: 0, y: 0 } }] });
      await expect(unmeasured.fitViewport()).resolves.toBe(false);
    });

    it('fits only the requested nodes', async () => {
      const element = await mount({
        nodes: [node('a', 0, 0), node('b', 5000, 5000)],
        minZoom: 0.01,
        maxZoom: 4,
      });

      await element.fitViewport({ nodes: [{ id: 'a' }], padding: 0 });
      const zoomForOne = element.getZoom();

      await element.fitViewport({ padding: 0 });

      // Fitting both nodes must zoom out further than fitting one.
      expect(element.getZoom()).toBeLessThan(zoomForOne);
    });

    it('fits automatically once nodes are initialised when fitView is set', async () => {
      const handler = jest.fn();
      const element = await mount({
        fitView: true,
        fitViewOptions: { padding: 0 },
        minZoom: 0.1,
        maxZoom: 4,
      });
      element.addEventListener('nodesinitialized', handler);

      element.nodes = [node('a', 0, 0), node('b', 300, 200)];
      await flushPromises();

      expect(handler).toHaveBeenCalled();
      expect(element.getZoom()).not.toBe(1);
    });
  });

  describe('intersection api', () => {
    it('finds nodes overlapping a rect', async () => {
      const element = await mount({ nodes: [node('a', 0, 0), node('b', 1000, 1000)] });
      const hits = element.getIntersectingNodes({ x: 0, y: 0, width: 50, height: 50 });

      expect(hits.map((n) => n.id)).toEqual(['a']);
    });

    it('excludes the reference node itself', async () => {
      const element = await mount({ nodes: [node('a', 0, 0), node('b', 50, 0)] });
      const hits = element.getIntersectingNodes({ id: 'a' });

      expect(hits.map((n) => n.id)).not.toContain('a');
    });

    it('requires full containment when partially is false', async () => {
      const element = await mount({ nodes: [node('a', 0, 0, { width: 100, height: 50 })] });
      const partial = { x: 50, y: 0, width: 200, height: 200 };

      expect(element.isNodeIntersecting({ id: 'a' }, partial, true)).toBe(true);
      expect(element.isNodeIntersecting({ id: 'a' }, partial, false)).toBe(false);
    });

    it('reports the bounds of all nodes and of a subset', async () => {
      const element = await mount({ nodes: [node('a', 0, 0), node('b', 300, 200)] });

      expect(element.getNodesBounds()).toEqual({ x: 0, y: 0, width: 400, height: 250 });
      expect(element.getNodesBounds([{ id: 'a' }])).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });
  });

  describe('toObject', () => {
    it('serialises a copy of the graph plus the viewport', async () => {
      const nodes = [node('a', 0, 0)];
      const element = await mount({ nodes, edges: [{ id: 'e1', source: 'a', target: 'a' }] });

      await element.setViewport({ x: -5, y: -6, zoom: 1.25 });
      const snapshot = element.toObject();

      expect(snapshot.viewport).toEqual({ x: -5, y: -6, zoom: 1.25 });
      expect(snapshot.nodes[0]).not.toBe(nodes[0]);
      expect(snapshot.nodes[0].id).toBe('a');
      expect(snapshot.edges).toHaveLength(1);
    });
  });

  describe('keyboard', () => {
    it('deletes the selected elements on the delete key', async () => {
      const element = await mount({
        nodes: [node('a', 0, 0, { selected: true }), node('b', 200, 0)],
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
      });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      expect(handler.mock.calls[0][0].detail.changes).toEqual([{ id: 'a', type: 'remove' }]);
    });

    it('ignores keys typed into an input', async () => {
      const element = await mount({ nodes: [node('a', 0, 0, { selected: true })] });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);

      const input = document.createElement('input');
      document.body.appendChild(input);
      const event = new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true });
      input.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });

    it('tracks the modifier keys in the store', async () => {
      const element = await mount();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
      expect(element.store.state.selectionKeyPressed).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
      expect(element.store.state.selectionKeyPressed).toBe(false);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta' }));
      expect(element.store.state.multiSelectionActive).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta' }));
      expect(element.store.state.multiSelectionActive).toBe(false);
    });

    it('stops listening after removal', async () => {
      const element = await mount({ nodes: [node('a', 0, 0, { selected: true })] });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);

      document.body.removeChild(element);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('marquee selection', () => {
    it('selects the nodes the rect covers while the selection key is held', async () => {
      const element = await mount({
        nodes: [node('a', 0, 0), node('b', 1000, 1000)],
        selectionMode: SelectionMode.Full,
      });
      const handler = jest.fn();
      element.addEventListener('nodeschange', handler);
      const pane = element.shadowRoot.querySelector('.flow__pane');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
      pane.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
      pane.dispatchEvent(pointer('pointermove', { clientX: 200, clientY: 200 }));

      expect(element.store.state.userSelectionActive).toBe(true);
      expect(handler.mock.calls[0][0].detail.changes).toEqual([{ id: 'a', type: 'select', selected: true }]);

      pane.dispatchEvent(pointer('pointerup', { clientX: 200, clientY: 200 }));
      expect(element.store.state.userSelectionActive).toBe(false);
      expect(element.store.state.userSelectionRect).toBeNull();
    });

    it('normalises a rect dragged up and to the left', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const pane = element.shadowRoot.querySelector('.flow__pane');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' }));
      pane.dispatchEvent(pointer('pointerdown', { clientX: 300, clientY: 300 }));
      pane.dispatchEvent(pointer('pointermove', { clientX: 100, clientY: 50 }));

      expect(element.store.state.userSelectionRect).toEqual({ x: 100, y: 50, width: 200, height: 250 });
    });

    it('does not start without the selection key or selectionOnDrag', async () => {
      const element = await mount({ nodes: [node('a', 0, 0)] });
      const pane = element.shadowRoot.querySelector('.flow__pane');

      pane.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));

      expect(element.store.state.userSelectionActive).toBe(false);
    });

    it('clears the selection when empty pane is clicked', async () => {
      const element = await mount({ nodes: [node('a', 0, 0, { selected: true })] });
      const handler = jest.fn();
      const paneHandler = jest.fn();
      element.addEventListener('nodeschange', handler);
      element.addEventListener('paneclick', paneHandler);
      const pane = element.shadowRoot.querySelector('.flow__pane');

      pane.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(handler.mock.calls[0][0].detail.changes).toEqual([{ id: 'a', type: 'select', selected: false }]);
      expect(paneHandler).toHaveBeenCalled();
    });
  });

  describe('viewport transform', () => {
    it('writes the transform onto the viewport layer only', async () => {
      const element = await mount();

      await element.setViewport({ x: -40, y: -60, zoom: 1.5 });
      await flushPromises();

      const viewport = element.shadowRoot.querySelector('.flow__viewport');
      const pane = element.shadowRoot.querySelector('.flow__pane');

      expect(viewport.getAttribute('style')).toContain('translate(-40px, -60px) scale(1.5)');
      // The pane must never be transformed; gestures are measured against it.
      expect(pane.getAttribute('style')).toBeNull();
    });

    it('emits move lifecycle events', async () => {
      const element = await mount();
      const start = jest.fn();
      const move = jest.fn();
      const end = jest.fn();
      element.addEventListener('movestart', start);
      element.addEventListener('move', move);
      element.addEventListener('moveend', end);

      await element.setViewport({ x: -10, y: -10, zoom: 1 });

      expect(start).toHaveBeenCalled();
      expect(move).toHaveBeenCalled();
      expect(end).toHaveBeenCalled();
      expect(move.mock.calls[0][0].detail.viewport).toEqual({ x: -10, y: -10, zoom: 1 });
    });
  });

  describe('configuration pass-through', () => {
    it('mirrors interaction props into the store', async () => {
      const element = await mount({
        connectionMode: ConnectionMode.Loose,
        connectionRadius: 42,
        nodesDraggable: false,
        selectionMode: SelectionMode.Partial,
        renderVisibleOnly: true,
      });

      expect(element.store.state.connectionMode).toBe(ConnectionMode.Loose);
      expect(element.store.state.connectionRadius).toBe(42);
      expect(element.store.state.nodesDraggable).toBe(false);
      expect(element.store.state.selectionMode).toBe(SelectionMode.Partial);
      expect(element.store.state.onlyRenderVisibleElements).toBe(true);
    });

    it('merges the aria label config over the defaults', async () => {
      const element = await mount({ ariaLabelConfig: { 'minimap.ariaLabel': 'Overview' } });

      expect(element.store.state.ariaLabelConfig['minimap.ariaLabel']).toBe('Overview');
      expect(element.store.state.ariaLabelConfig['controls.ariaLabel']).toBe('Control Panel');
    });
  });

  it('tears everything down on disconnect', async () => {
    const element = await mount({ nodes: [node('a', 0, 0)] });
    const store = element.store;

    document.body.removeChild(element);

    expect(element.viewportInitialized).toBe(false);
    // A post-teardown store write must not reach anything.
    expect(() => store.setTransform([1, 1, 1])).not.toThrow();
  });
});
