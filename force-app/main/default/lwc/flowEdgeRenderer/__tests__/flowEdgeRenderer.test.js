import { createElement } from 'lwc';
import FlowEdgeRenderer from 'c/flowEdgeRenderer';
import { createFlowStore } from 'c/flowStore';
import { getBezierPath, getSmoothStepPath, getStraightPath } from 'c/flowEdgePaths';
import { Position, MarkerType, ConnectionMode } from 'c/flowTypes';

function flushPromises() {
  return Promise.resolve();
}

/**
 * An internal-node-shaped fixture with one source and one target handle.
 *
 * Handles are zero-size so `getHandlePosition`'s centring terms drop out and the
 * expected geometry stays readable. A real handle is ~6px and that centre offset
 * is exercised in flowMath's own suite.
 */
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

function seededStore({ nodes, edges = [], width = 800, height = 600, transform = [0, 0, 1], ...state } = {}) {
  const store = createFlowStore();

  store.update({ width, height, ...state });
  store.setNodes(nodes ?? [node('a', 0, 0), node('b', 300, 200)]);
  store.setEdges(edges);
  store.setTransform(transform);

  return store;
}

async function mount(store, props = {}) {
  const element = createElement('c-flow-edge-renderer', { is: FlowEdgeRenderer });
  element.store = store;
  element.flowId = 'f1';
  Object.assign(element, props);
  document.body.appendChild(element);
  await flushPromises();

  return element;
}

/** Geometry for the default a -> b fixture: source bottom of a, target top of b. */
const DEFAULT_GEOMETRY = {
  sourceX: 50,
  sourceY: 50,
  targetX: 350,
  targetY: 200,
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
};

describe('c-flow-edge-renderer', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  describe('svg namespacing', () => {
    it('creates its elements in the SVG namespace', async () => {
      const element = await mount(seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] }));
      const svg = element.shadowRoot.querySelector('svg');
      const path = element.shadowRoot.querySelector('path');

      /*
       * The whole reason edges are painted from this template rather than
       * from per-edge components: namespacing is decided by the enclosing
       * <svg> in the SAME template.
       */
      expect(svg.namespaceURI).toBe('http://www.w3.org/2000/svg');
      expect(path.namespaceURI).toBe('http://www.w3.org/2000/svg');
    });
  });

  describe('edge geometry', () => {
    it('emits the exact path the edge type produces for the resolved handles', async () => {
      const element = await mount(seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] }));
      const [expected] = getBezierPath({ ...DEFAULT_GEOMETRY, curvature: 0.25 });

      expect(element.shadowRoot.querySelector('.flow__edge-path').getAttribute('d')).toBe(expected);
    });

    it('uses the edge type named on the edge', async () => {
      const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b', type: 'straight' }] });
      const element = await mount(store);
      const [expected] = getStraightPath(DEFAULT_GEOMETRY);

      expect(element.shadowRoot.querySelector('.flow__edge-path').getAttribute('d')).toBe(expected);
    });

    it('forces a square corner for the step type', async () => {
      const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b', type: 'step' }] });
      const element = await mount(store);
      const [expected] = getSmoothStepPath({ ...DEFAULT_GEOMETRY, borderRadius: 0 });
      const d = element.shadowRoot.querySelector('.flow__edge-path').getAttribute('d');

      expect(d).toBe(expected);
      /*
       * At radius 0 upstream still emits a `Q`, but a degenerate one whose
       * control point equals both endpoints, so the corner renders square.
       * Asserting "no Q" would be asserting a divergence from upstream.
       */
      expect(d).toMatch(/Q 50,125 50,125/);
    });

    it('resolves a named handle rather than the first one', async () => {
      const nodes = [
        {
          id: 'a',
          position: { x: 0, y: 0 },
          measured: { width: 100, height: 50 },
          handles: [
            { id: 'left', type: 'source', position: Position.Left, x: 0, y: 25, width: 0, height: 0 },
            { id: 'right', type: 'source', position: Position.Right, x: 100, y: 25, width: 0, height: 0 },
          ],
        },
        node('b', 300, 200),
      ];
      const store = seededStore({
        nodes,
        edges: [{ id: 'e1', source: 'a', target: 'b', sourceHandle: 'right' }],
      });
      const element = await mount(store);
      const d = element.shadowRoot.querySelector('.flow__edge-path').getAttribute('d');

      // The `right` handle sits at x = 100, y = 25.
      expect(d.startsWith('M100,25')).toBe(true);
    });

    it('skips an edge whose endpoint node is missing', async () => {
      const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'ghost' }] });
      const element = await mount(store);

      expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(0);
    });

    it('skips an edge whose node has not been measured and reports it', async () => {
      const onError = jest.fn();
      const store = seededStore({
        nodes: [{ id: 'a', position: { x: 0, y: 0 } }, node('b', 300, 200)],
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
        onError,
      });
      const element = await mount(store);

      expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(0);
      // No handleBounds at all is "not measured yet", not a configuration error.
      expect(onError).not.toHaveBeenCalled();
    });

    it('reports a missing handle on a measured node', async () => {
      const onError = jest.fn();
      const store = seededStore({
        nodes: [
          {
            id: 'a',
            position: { x: 0, y: 0 },
            measured: { width: 10, height: 10 },
            handles: [{ id: null, type: 'target', position: Position.Top, x: 5, y: 0, width: 1, height: 1 }],
          },
          node('b', 300, 200),
        ],
        edges: [{ id: 'e1', source: 'a', target: 'b' }],
        onError,
      });
      await mount(store);

      expect(onError).toHaveBeenCalledWith('008', expect.stringContaining('e1'));
    });

    it('hides a hidden edge', async () => {
      const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b', hidden: true }] });
      const element = await mount(store);

      expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(0);
    });

    it('searches both handle buckets in loose connection mode', async () => {
      const nodes = [
        node('a', 0, 0),
        {
          // b has only a SOURCE handle, so strict mode cannot terminate here.
          id: 'b',
          position: { x: 300, y: 200 },
          measured: { width: 100, height: 50 },
          handles: [{ id: null, type: 'source', position: Position.Top, x: 50, y: 0, width: 1, height: 1 }],
        },
      ];
      const strict = await mount(seededStore({ nodes, edges: [{ id: 'e1', source: 'a', target: 'b' }] }));
      expect(strict.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(0);

      document.body.removeChild(strict);

      const loose = await mount(
        seededStore({
          nodes,
          edges: [{ id: 'e1', source: 'a', target: 'b' }],
          connectionMode: ConnectionMode.Loose,
        })
      );
      expect(loose.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(1);
    });
  });

  describe('edge presentation', () => {
    it('applies the state class names', async () => {
      const store = seededStore({
        edges: [{ id: 'e1', source: 'a', target: 'b', selected: true, animated: true }],
      });
      const element = await mount(store);
      const g = element.shadowRoot.querySelector('.flow__edge');

      expect(g.classList.contains('selected')).toBe(true);
      expect(g.classList.contains('animated')).toBe(true);
      expect(g.classList.contains('selectable')).toBe(true);
      expect(g.getAttribute('data-id')).toBe('e1');
      expect(element.shadowRoot.querySelector('.flow__edge-path').classList.contains('animated')).toBe(true);
    });

    it('renders the interaction path by default and omits it at width 0', async () => {
      const withPath = await mount(seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] }));
      const interaction = withPath.shadowRoot.querySelector('.flow__edge-interaction');

      expect(interaction).not.toBeNull();
      expect(interaction.getAttribute('stroke-width')).toBe('20');
      // Same geometry as the visible path, so the hit area follows the curve.
      expect(interaction.getAttribute('d')).toBe(
        withPath.shadowRoot.querySelector('.flow__edge-path').getAttribute('d')
      );

      document.body.removeChild(withPath);

      const without = await mount(
        seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b', interactionWidth: 0 }] })
      );
      expect(without.shadowRoot.querySelector('.flow__edge-interaction')).toBeNull();
    });

    it('orders edges by z-index so paint order matches', async () => {
      const store = seededStore({
        edges: [
          { id: 'high', source: 'a', target: 'b', zIndex: 10 },
          { id: 'low', source: 'a', target: 'b', zIndex: 1 },
        ],
      });
      const element = await mount(store);
      const ids = Array.from(element.shadowRoot.querySelectorAll('.flow__edge')).map((g) => g.dataset.id);

      // SVG has no z-index; document order IS paint order.
      expect(ids).toEqual(['low', 'high']);
    });

    it('honours manual z-index mode by not elevating a selected edge', async () => {
      const store = seededStore({
        edges: [
          { id: 'sel', source: 'a', target: 'b', selected: true, zIndex: 1 },
          { id: 'other', source: 'a', target: 'b', zIndex: 5 },
        ],
        zIndexMode: 'manual',
        elevateEdgesOnSelect: true,
      });
      const element = await mount(store);
      const ids = Array.from(element.shadowRoot.querySelectorAll('.flow__edge')).map((g) => g.dataset.id);

      expect(ids).toEqual(['sel', 'other']);
    });

    it('elevates a selected edge when configured', async () => {
      const store = seededStore({
        edges: [
          { id: 'sel', source: 'a', target: 'b', selected: true, zIndex: 1 },
          { id: 'other', source: 'a', target: 'b', zIndex: 5 },
        ],
        elevateEdgesOnSelect: true,
      });
      const element = await mount(store);
      const ids = Array.from(element.shadowRoot.querySelectorAll('.flow__edge')).map((g) => g.dataset.id);

      expect(ids).toEqual(['other', 'sel']);
    });

    it('mirrors the viewport transform onto the inner group', async () => {
      const element = await mount(
        seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }], transform: [10, 20, 2] })
      );

      expect(element.shadowRoot.querySelector('.flow__edges-viewport').getAttribute('style')).toContain(
        'translate(10px, 20px) scale(2)'
      );
    });
  });

  describe('markers', () => {
    it('defines a marker in its own root and references it by url', async () => {
      const store = seededStore({
        edges: [
          {
            id: 'e1',
            source: 'a',
            target: 'b',
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ],
      });
      const element = await mount(store);
      const marker = element.shadowRoot.querySelector('marker');
      const path = element.shadowRoot.querySelector('.flow__edge-path');

      /*
       * An url(#id) reference does not cross a shadow boundary, so the
       * <defs> must live in this component's root alongside the paths.
       */
      expect(marker).not.toBeNull();
      expect(path.getAttribute('marker-end')).toBe(`url(#${marker.getAttribute('id')})`);
    });

    it('deduplicates identical markers across edges', async () => {
      const store = seededStore({
        edges: [
          { id: 'e1', source: 'a', target: 'b', markerEnd: { type: MarkerType.Arrow } },
          { id: 'e2', source: 'a', target: 'b', markerEnd: { type: MarkerType.Arrow } },
        ],
      });
      const element = await mount(store);

      expect(element.shadowRoot.querySelectorAll('marker')).toHaveLength(1);
    });

    it('applies a default marker to an edge that declares none', async () => {
      const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] });
      const element = await mount(store, { defaultMarkerEnd: { type: MarkerType.Arrow } });

      expect(element.shadowRoot.querySelector('marker')).not.toBeNull();
      expect(element.shadowRoot.querySelector('.flow__edge-path').getAttribute('marker-end')).toContain('url(#');
    });

    it('leaves marker attributes unset when the edge has no marker', async () => {
      const element = await mount(seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] }));

      expect(element.shadowRoot.querySelector('.flow__edge-path').getAttribute('marker-end')).toBeNull();
    });
  });

  describe('connection line', () => {
    it('renders nothing while no connection is in progress', async () => {
      const element = await mount(seededStore());

      expect(element.shadowRoot.querySelector('.flow__connectionline')).toBeNull();
    });

    it('draws from the origin handle to the pointer', async () => {
      const store = seededStore();
      const element = await mount(store);

      store.update({
        connection: {
          inProgress: true,
          from: { x: 10, y: 20 },
          to: { x: 200, y: 300 },
          fromPosition: Position.Bottom,
          toPosition: Position.Top,
        },
      });
      await flushPromises();

      const line = element.shadowRoot.querySelector('.flow__connectionline');
      const [expected] = getBezierPath({
        sourceX: 10,
        sourceY: 20,
        targetX: 200,
        targetY: 300,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        curvature: 0.25,
      });

      expect(line.getAttribute('d')).toBe(expected);
    });

    it('reflects validity in its class', async () => {
      const store = seededStore();
      const element = await mount(store);
      const connection = {
        inProgress: true,
        from: { x: 0, y: 0 },
        to: { x: 50, y: 50 },
        fromPosition: Position.Bottom,
        toPosition: Position.Top,
      };

      store.update({ connection: { ...connection, isValid: true } });
      await flushPromises();
      expect(element.shadowRoot.querySelector('.flow__connectionline').classList.contains('valid')).toBe(true);

      store.update({ connection: { ...connection, isValid: false } });
      await flushPromises();
      expect(element.shadowRoot.querySelector('.flow__connectionline').classList.contains('invalid')).toBe(true);

      // null means "nowhere near a handle": neither style applies.
      store.update({ connection: { ...connection, isValid: null } });
      await flushPromises();
      const neutral = element.shadowRoot.querySelector('.flow__connectionline');
      expect(neutral.classList.contains('valid')).toBe(false);
      expect(neutral.classList.contains('invalid')).toBe(false);
    });

    it('uses the configured connection line type', async () => {
      const store = seededStore();
      const element = await mount(store, { connectionLineType: 'straight' });

      store.update({
        connection: {
          inProgress: true,
          from: { x: 0, y: 0 },
          to: { x: 100, y: 100 },
          fromPosition: Position.Bottom,
          toPosition: Position.Top,
        },
      });
      await flushPromises();

      const [expected] = getStraightPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 100 });
      expect(element.shadowRoot.querySelector('.flow__connectionline').getAttribute('d')).toBe(expected);
    });
  });

  describe('culling', () => {
    it('drops an edge outside the viewport when onlyRenderVisibleElements is on', async () => {
      const store = seededStore({
        nodes: [node('a', 0, 0), node('b', 300, 200), node('far1', 9000, 9000), node('far2', 9400, 9400)],
        edges: [
          { id: 'near', source: 'a', target: 'b' },
          { id: 'far', source: 'far1', target: 'far2' },
        ],
        onlyRenderVisibleElements: true,
      });
      const element = await mount(store);
      const ids = Array.from(element.shadowRoot.querySelectorAll('.flow__edge')).map((g) => g.dataset.id);

      expect(ids).toEqual(['near']);
    });

    it('keeps both edges when culling is off', async () => {
      const store = seededStore({
        nodes: [node('a', 0, 0), node('b', 300, 200), node('far1', 9000, 9000), node('far2', 9400, 9400)],
        edges: [
          { id: 'near', source: 'a', target: 'b' },
          { id: 'far', source: 'far1', target: 'far2' },
        ],
      });
      const element = await mount(store);

      expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(2);
    });
  });

  describe('events', () => {
    it.each([
      ['click', 'edgeclick'],
      ['dblclick', 'edgedoubleclick'],
      ['contextmenu', 'edgecontextmenu'],
      ['mouseenter', 'edgemouseenter'],
      ['mouseleave', 'edgemouseleave'],
    ])('maps %s to %s carrying the edge id', async (domEvent, flowEvent) => {
      const element = await mount(seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] }));
      const handler = jest.fn();
      element.addEventListener(flowEvent, handler);

      element.shadowRoot.querySelector('.flow__edge').dispatchEvent(new MouseEvent(domEvent, { bubbles: false }));

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler.mock.calls[0][0].detail).toEqual({ id: 'e1' });
      expect(handler.mock.calls[0][0].bubbles).toBe(false);
    });
  });

  it('redraws when the edge set changes', async () => {
    const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] });
    const element = await mount(store);

    expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(1);

    store.setEdges([
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'a' },
    ]);
    await flushPromises();

    expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(2);
  });

  it('redraws when a node moves', async () => {
    const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] });
    const element = await mount(store);
    const before = element.shadowRoot.querySelector('.flow__edge-path').getAttribute('d');

    store.setNodes([node('a', 0, 0), node('b', 500, 400)]);
    await flushPromises();

    expect(element.shadowRoot.querySelector('.flow__edge-path').getAttribute('d')).not.toBe(before);
  });

  it('releases its subscriptions on disconnect', async () => {
    const store = seededStore({ edges: [{ id: 'e1', source: 'a', target: 'b' }] });
    const element = await mount(store);

    document.body.removeChild(element);

    expect(() => {
      store.setEdges([]);
      store.setTransform([5, 5, 3]);
      store.update({ connection: { inProgress: false } });
    }).not.toThrow();
  });

  it('renders an empty layer without a store', async () => {
    const element = createElement('c-flow-edge-renderer', { is: FlowEdgeRenderer });
    document.body.appendChild(element);
    await flushPromises();

    expect(element.shadowRoot.querySelector('svg')).not.toBeNull();
    expect(element.shadowRoot.querySelectorAll('.flow__edge')).toHaveLength(0);
  });
});
