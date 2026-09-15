import { errorMessages } from 'c/flowTypes';
import {
  adoptUserNodes,
  updateAbsolutePositions,
  updateConnectionLookup,
  getEdgeId,
  addEdge,
  reconnectEdge,
  applyNodeChanges,
  applyEdgeChanges,
  getSelectionChanges,
  getElementsDiffChanges,
  createSelectionChange,
  elementToRemoveChange,
  isManualZIndexMode,
} from 'c/flowGraph';

/** A measured user node, which is what adoption needs to consider a graph initialized. */
function userNode(id, x, y, extra = {}) {
  return { id, position: { x, y }, measured: { width: 10, height: 10 }, ...extra };
}

/** Fresh lookups plus the adoption result, so each test starts from a clean derivation. */
function adopt(nodes, options) {
  const nodeLookup = new Map();
  const parentLookup = new Map();
  const result = adoptUserNodes(nodes, nodeLookup, parentLookup, options);

  return { nodeLookup, parentLookup, result };
}

describe('c-flow-graph isManualZIndexMode', () => {
  it('is true only for the manual mode', () => {
    expect(isManualZIndexMode('manual')).toBe(true);
    expect(isManualZIndexMode('basic')).toBe(false);
    expect(isManualZIndexMode('auto')).toBe(false);
    expect(isManualZIndexMode(undefined)).toBe(false);
  });
});

describe('c-flow-graph adoptUserNodes lookups', () => {
  it('indexes every node by id and keeps the user object for reference checks', () => {
    const nodes = [userNode('a', 0, 0), userNode('b', 5, 5)];
    const { nodeLookup, parentLookup } = adopt(nodes);

    expect([...nodeLookup.keys()]).toEqual(['a', 'b']);
    expect(nodeLookup.get('a').internals.userNode).toBe(nodes[0]);
    expect(parentLookup.size).toBe(0);
  });

  it('rebuilds both lookups from scratch, dropping nodes that disappeared', () => {
    const nodeLookup = new Map();
    const parentLookup = new Map();

    adoptUserNodes([userNode('a', 0, 0), userNode('b', 0, 0)], nodeLookup, parentLookup);
    adoptUserNodes([userNode('a', 0, 0)], nodeLookup, parentLookup);

    expect([...nodeLookup.keys()]).toEqual(['a']);
  });

  it('indexes a child under its parent', () => {
    const { parentLookup } = adopt([userNode('p', 0, 0), userNode('c', 0, 0, { parentId: 'p' })]);

    expect([...parentLookup.keys()]).toEqual(['p']);
    expect(parentLookup.get('p').size).toBe(1);
    expect(parentLookup.get('p').has('c')).toBe(true);
  });

  it('collects several children of the same parent into one map', () => {
    const { parentLookup } = adopt([
      userNode('p', 0, 0),
      userNode('c1', 0, 0, { parentId: 'p' }),
      userNode('c2', 0, 0, { parentId: 'p' }),
    ]);

    expect([...parentLookup.get('p').keys()]).toEqual(['c1', 'c2']);
  });

  it('applies the defaults option under every user node', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0)], { defaults: { type: 'custom', selectable: false } });

    expect(nodeLookup.get('a').type).toBe('custom');
    expect(nodeLookup.get('a').selectable).toBe(false);
  });

  it('lets the user node win over the defaults', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0, { type: 'mine' })], { defaults: { type: 'custom' } });

    expect(nodeLookup.get('a').type).toBe('mine');
  });
});

describe('c-flow-graph adoptUserNodes absolute positions', () => {
  it('uses the stated position for a root node', () => {
    const { nodeLookup } = adopt([userNode('a', 40, 60)]);

    expect(nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: 40, y: 60 });
  });

  it('adds the parent offset for a child', () => {
    const { nodeLookup } = adopt([
      { id: 'p', position: { x: 100, y: 100 }, measured: { width: 200, height: 200 } },
      { id: 'c', parentId: 'p', position: { x: 10, y: 20 }, measured: { width: 10, height: 10 } },
    ]);

    expect(nodeLookup.get('c').internals.positionAbsolute).toEqual({ x: 110, y: 120 });
    expect(nodeLookup.get('p').internals.positionAbsolute).toEqual({ x: 100, y: 100 });
  });

  it('clamps a parent-extent child inside the parent box, minus its own size', () => {
    const { nodeLookup } = adopt([
      { id: 'p', position: { x: 0, y: 0 }, measured: { width: 100, height: 100 } },
      {
        id: 'c',
        parentId: 'p',
        extent: 'parent',
        position: { x: 200, y: 200 },
        measured: { width: 20, height: 20 },
      },
    ]);

    expect(nodeLookup.get('c').internals.positionAbsolute).toEqual({ x: 80, y: 80 });
  });

  it('leaves a parent-extent child that already fits alone', () => {
    const { nodeLookup } = adopt([
      { id: 'p', position: { x: 0, y: 0 }, measured: { width: 100, height: 100 } },
      {
        id: 'c',
        parentId: 'p',
        extent: 'parent',
        position: { x: 10, y: 10 },
        measured: { width: 20, height: 20 },
      },
    ]);

    expect(nodeLookup.get('c').internals.positionAbsolute).toEqual({ x: 10, y: 10 });
  });

  it('applies a coordinate extent on the node itself', () => {
    const { nodeLookup } = adopt([
      userNode('a', 500, 500, {
        extent: [
          [0, 0],
          [100, 100],
        ],
      }),
    ]);

    expect(nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: 90, y: 90 });
  });

  it('applies the flow node origin', () => {
    const { nodeLookup } = adopt([userNode('a', 100, 100)], { nodeOrigin: [0.5, 0.5] });

    expect(nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: 95, y: 95 });
  });
});

describe('c-flow-graph adoptUserNodes initialization', () => {
  it('is not initialized while any visible node lacks a measured size', () => {
    const { result } = adopt([userNode('a', 0, 0), { id: 'b', position: { x: 0, y: 0 } }]);

    expect(result.nodesInitialized).toBe(false);
  });

  it('is not initialized when only one axis was measured', () => {
    const { result } = adopt([{ id: 'a', position: { x: 0, y: 0 }, measured: { width: 10 } }]);

    expect(result.nodesInitialized).toBe(false);
  });

  it('is initialized once every visible node is measured', () => {
    const { result } = adopt([userNode('a', 0, 0), userNode('b', 0, 0)]);

    expect(result.nodesInitialized).toBe(true);
  });

  it('does not let a hidden unmeasured node block initialization', () => {
    const { result } = adopt([userNode('a', 0, 0), { id: 'b', position: { x: 0, y: 0 }, hidden: true }]);

    expect(result.nodesInitialized).toBe(true);
  });

  it('is not initialized for an empty graph', () => {
    const { result } = adopt([]);

    expect(result.nodesInitialized).toBe(false);
  });

  it('reports whether any node is selected', () => {
    expect(adopt([userNode('a', 0, 0)]).result.hasSelectedNodes).toBe(false);
    expect(adopt([userNode('a', 0, 0, { selected: false })]).result.hasSelectedNodes).toBe(false);
    expect(adopt([userNode('a', 0, 0), userNode('b', 0, 0, { selected: true })]).result.hasSelectedNodes).toBe(true);
  });
});

describe('c-flow-graph adoptUserNodes z-index', () => {
  it('adds the selection bump to a selected node', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0, { selected: true, zIndex: 5 })]);

    expect(nodeLookup.get('a').internals.z).toBe(1005);
  });

  it('does not bump an unselected node', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0, { zIndex: 5 })]);

    expect(nodeLookup.get('a').internals.z).toBe(5);
  });

  it('treats a non-numeric zIndex as zero', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0, { zIndex: 'high' })]);

    expect(nodeLookup.get('a').internals.z).toBe(0);
  });

  it('does not bump in manual mode', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0, { selected: true, zIndex: 5 })], {
      zIndexMode: 'manual',
    });

    expect(nodeLookup.get('a').internals.z).toBe(5);
  });

  it('does not bump when elevateNodesOnSelect is off', () => {
    const { nodeLookup } = adopt([userNode('a', 0, 0, { selected: true, zIndex: 5 })], {
      elevateNodesOnSelect: false,
    });

    expect(nodeLookup.get('a').internals.z).toBe(5);
  });

  it('keeps a child at least one above its parent', () => {
    const { nodeLookup } = adopt([userNode('p', 0, 0, { zIndex: 10 }), userNode('c', 0, 0, { parentId: 'p' })]);

    expect(nodeLookup.get('c').internals.z).toBe(11);
  });

  it('leaves a child that already sits above its parent alone', () => {
    const { nodeLookup } = adopt([
      userNode('p', 0, 0, { zIndex: 10 }),
      userNode('c', 0, 0, { parentId: 'p', zIndex: 50 }),
    ]);

    expect(nodeLookup.get('c').internals.z).toBe(50);
  });

  it('gives each root parent subtree its own z band in auto mode', () => {
    const { nodeLookup } = adopt(
      [
        userNode('p1', 0, 0),
        userNode('c1', 0, 0, { parentId: 'p1' }),
        userNode('p2', 0, 0),
        userNode('c2', 0, 0, { parentId: 'p2' }),
      ],
      { zIndexMode: 'auto' }
    );

    expect(nodeLookup.get('p1').internals.z).toBe(10);
    expect(nodeLookup.get('c1').internals.z).toBe(11);
    expect(nodeLookup.get('p2').internals.z).toBe(20);
    expect(nodeLookup.get('c2').internals.z).toBe(21);
  });
});

describe('c-flow-graph adoptUserNodes equality fast path', () => {
  it('reuses the internal node when the user node is reference-identical', () => {
    const nodes = [userNode('a', 0, 0)];
    const nodeLookup = new Map();
    const parentLookup = new Map();

    adoptUserNodes(nodes, nodeLookup, parentLookup);
    const first = nodeLookup.get('a');
    adoptUserNodes(nodes, nodeLookup, parentLookup);

    expect(nodeLookup.get('a')).toBe(first);
  });

  it('re-derives when the user node object changed', () => {
    const nodeLookup = new Map();
    const parentLookup = new Map();

    adoptUserNodes([userNode('a', 0, 0)], nodeLookup, parentLookup);
    const first = nodeLookup.get('a');
    adoptUserNodes([userNode('a', 40, 0)], nodeLookup, parentLookup);

    expect(nodeLookup.get('a')).not.toBe(first);
    expect(nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: 40, y: 0 });
  });

  it('re-derives every node when checkEquality is off', () => {
    const nodes = [userNode('a', 0, 0)];
    const nodeLookup = new Map();
    const parentLookup = new Map();

    adoptUserNodes(nodes, nodeLookup, parentLookup);
    const first = nodeLookup.get('a');
    adoptUserNodes(nodes, nodeLookup, parentLookup, { checkEquality: false });

    expect(nodeLookup.get('a')).not.toBe(first);
  });
});

describe('c-flow-graph adoptUserNodes handle bounds', () => {
  it('leaves handle bounds undefined for an unmeasured node so it gets measured', () => {
    const { nodeLookup } = adopt([{ id: 'a', position: { x: 0, y: 0 } }]);

    expect(nodeLookup.get('a').internals.handleBounds).toBeUndefined();
  });

  it('splits declared handles into source and target buckets with defaulted sizes', () => {
    const { nodeLookup } = adopt([
      userNode('a', 0, 0, {
        handles: [
          { id: 's', type: 'source', x: 1, y: 2, position: 'right' },
          { id: 't', type: 'target', x: 3, y: 4, width: 8, height: 6, position: 'left' },
          { id: 'x', type: 'other', x: 0, y: 0 },
        ],
      }),
    ]);
    const bounds = nodeLookup.get('a').internals.handleBounds;

    expect(bounds.source).toEqual([
      { id: 's', width: 1, height: 1, nodeId: 'a', x: 1, y: 2, position: 'right', type: 'source' },
    ]);
    expect(bounds.target).toEqual([
      { id: 't', width: 8, height: 6, nodeId: 'a', x: 3, y: 4, position: 'left', type: 'target' },
    ]);
  });

  it('carries measured handle bounds over to a re-derived node', () => {
    const nodeLookup = new Map();
    const parentLookup = new Map();

    adoptUserNodes(
      [userNode('a', 0, 0, { handles: [{ id: 's', type: 'source', x: 0, y: 0, position: 'right' }] })],
      nodeLookup,
      parentLookup
    );
    const measured = nodeLookup.get('a').internals.handleBounds;

    adoptUserNodes([userNode('a', 10, 0)], nodeLookup, parentLookup);

    expect(nodeLookup.get('a').internals.handleBounds).toBe(measured);
  });
});

describe('c-flow-graph adoptUserNodes missing parent', () => {
  it('reports 005 and leaves the child where it is', () => {
    const onError = jest.fn();
    const { nodeLookup, parentLookup } = adopt([userNode('c', 5, 6, { parentId: 'ghost' })], { onError });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBe('005');
    expect(onError.mock.calls[0][1]).toContain('ghost');
    expect(nodeLookup.get('c').internals.positionAbsolute).toEqual({ x: 5, y: 6 });
    expect(parentLookup.size).toBe(0);
  });

  it('survives a missing parent with no error handler', () => {
    const { nodeLookup } = adopt([userNode('c', 5, 6, { parentId: 'ghost' })]);

    expect(nodeLookup.get('c').internals.positionAbsolute).toEqual({ x: 5, y: 6 });
  });
});

describe('c-flow-graph updateAbsolutePositions', () => {
  it('re-clamps a root node against a new node extent', () => {
    const { nodeLookup, parentLookup } = adopt([userNode('a', 500, 500)]);

    updateAbsolutePositions(nodeLookup, parentLookup, {
      nodeExtent: [
        [0, 0],
        [100, 100],
      ],
    });

    expect(nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: 90, y: 90 });
  });

  it('recomputes a child against its parent', () => {
    const { nodeLookup, parentLookup } = adopt([
      { id: 'p', position: { x: 0, y: 0 }, measured: { width: 100, height: 100 } },
      { id: 'c', parentId: 'p', position: { x: 10, y: 10 }, measured: { width: 10, height: 10 } },
    ]);

    // The pass re-derives the parent from its stated position, so move that, not the
    // derived absolute one, and let the child follow.
    nodeLookup.get('p').position = { x: 200, y: 300 };
    updateAbsolutePositions(nodeLookup, parentLookup);

    expect(nodeLookup.get('c').internals.positionAbsolute).toEqual({ x: 210, y: 310 });
  });
});

describe('c-flow-graph updateConnectionLookup', () => {
  it('indexes a handled connection under all three key shapes, from both ends', () => {
    const connectionLookup = new Map();
    const edgeLookup = new Map();
    const edge = { id: 'e1', source: 'a', target: 'b', sourceHandle: 'sh', targetHandle: 'th' };

    updateConnectionLookup(connectionLookup, edgeLookup, [edge]);

    expect([...connectionLookup.keys()]).toEqual(['a', 'a-source', 'a-source-sh', 'b', 'b-target', 'b-target-th']);
  });

  it('keys the source side by the target descriptor and vice versa', () => {
    const connectionLookup = new Map();
    const edgeLookup = new Map();

    updateConnectionLookup(connectionLookup, edgeLookup, [
      { id: 'e1', source: 'a', target: 'b', sourceHandle: 'sh', targetHandle: 'th' },
    ]);

    expect([...connectionLookup.get('a').keys()]).toEqual(['b-th--a-sh']);
    expect([...connectionLookup.get('b-target').keys()]).toEqual(['a-sh--b-th']);
    expect(connectionLookup.get('a-source-sh').get('b-th--a-sh')).toEqual({
      edgeId: 'e1',
      source: 'a',
      target: 'b',
      sourceHandle: 'sh',
      targetHandle: 'th',
    });
  });

  it('omits the handle key when the edge declares no handle', () => {
    const connectionLookup = new Map();
    const edgeLookup = new Map();

    updateConnectionLookup(connectionLookup, edgeLookup, [{ id: 'e2', source: 'a', target: 'b' }]);

    expect([...connectionLookup.keys()]).toEqual(['a', 'a-source', 'b', 'b-target']);
    expect([...connectionLookup.get('a').keys()]).toEqual(['b-null--a-null']);
  });

  it('accumulates several connections on one node', () => {
    const connectionLookup = new Map();
    const edgeLookup = new Map();

    updateConnectionLookup(connectionLookup, edgeLookup, [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'a', target: 'c' },
    ]);

    expect(connectionLookup.get('a-source').size).toBe(2);
  });

  it('keys edgeLookup by edge id and stores the edge itself', () => {
    const connectionLookup = new Map();
    const edgeLookup = new Map();
    const edges = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'c' },
    ];

    updateConnectionLookup(connectionLookup, edgeLookup, edges);

    expect([...edgeLookup.keys()]).toEqual(['e1', 'e2']);
    expect(edgeLookup.get('e1')).toBe(edges[0]);
  });

  it('clears both lookups before rebuilding', () => {
    const connectionLookup = new Map();
    const edgeLookup = new Map();

    updateConnectionLookup(connectionLookup, edgeLookup, [{ id: 'e1', source: 'a', target: 'b' }]);
    updateConnectionLookup(connectionLookup, edgeLookup, [{ id: 'e2', source: 'c', target: 'd' }]);

    expect([...edgeLookup.keys()]).toEqual(['e2']);
    expect(connectionLookup.has('a')).toBe(false);
  });
});

describe('c-flow-graph getEdgeId', () => {
  it('concatenates both endpoints and their handles', () => {
    expect(getEdgeId({ source: 'a', sourceHandle: 's', target: 'b', targetHandle: 't' })).toBe('xy-edge__as-bt');
  });

  it('treats a null or missing handle as empty', () => {
    expect(getEdgeId({ source: 'a', target: 'b' })).toBe('xy-edge__a-b');
    expect(getEdgeId({ source: 'a', sourceHandle: null, target: 'b', targetHandle: null })).toBe('xy-edge__a-b');
  });

  it('is deterministic for the same pair of handles', () => {
    const connection = { source: 'a', sourceHandle: 's', target: 'b', targetHandle: 't' };

    expect(getEdgeId(connection)).toBe(getEdgeId({ ...connection }));
  });
});

describe('c-flow-graph addEdge', () => {
  it('generates an id for a bare connection', () => {
    expect(addEdge({ source: 'a', target: 'b' }, [])).toEqual([{ source: 'a', target: 'b', id: 'xy-edge__a-b' }]);
  });

  it('keeps the id of an object that already looks like an edge', () => {
    expect(addEdge({ id: 'mine', source: 'a', target: 'b' }, [])).toEqual([{ id: 'mine', source: 'a', target: 'b' }]);
  });

  it('uses a custom id generator when one is supplied', () => {
    const getId = jest.fn(() => 'custom');

    expect(addEdge({ source: 'a', target: 'b' }, [], { getEdgeId: getId })[0].id).toBe('custom');
    expect(getId).toHaveBeenCalledWith({ source: 'a', target: 'b' });
  });

  it('strips a null handle so later equality checks stay simple', () => {
    const [edge] = addEdge({ source: 'a', target: 'b', sourceHandle: null, targetHandle: null }, []);

    expect('sourceHandle' in edge).toBe(false);
    expect('targetHandle' in edge).toBe(false);
    expect(edge.id).toBe('xy-edge__a-b');
  });

  it('keeps a real handle', () => {
    const [edge] = addEdge({ source: 'a', target: 'b', sourceHandle: 'sh', targetHandle: null }, []);

    expect(edge.sourceHandle).toBe('sh');
    expect('targetHandle' in edge).toBe(false);
  });

  it('returns the same array and reports 006 when the source or target is missing', () => {
    const edges = [{ id: 'e1', source: 'a', target: 'b' }];
    const onError = jest.fn();

    expect(addEdge({ target: 'b' }, edges, { onError })).toBe(edges);
    expect(addEdge({ source: 'a' }, edges, { onError })).toBe(edges);
    expect(onError).toHaveBeenCalledTimes(2);
    expect(onError).toHaveBeenCalledWith('006', errorMessages.error006());
  });

  it('survives a missing source with no error handler', () => {
    const edges = [];

    expect(addEdge({ target: 'b' }, edges)).toBe(edges);
  });

  it('returns the same array for a duplicate connection', () => {
    const edges = [{ id: 'e1', source: 'a', target: 'b' }];

    expect(addEdge({ source: 'a', target: 'b' }, edges)).toBe(edges);
  });

  it('treats a null handle and a missing handle as the same connection', () => {
    const edges = [{ id: 'e1', source: 'a', target: 'b' }];

    expect(addEdge({ source: 'a', target: 'b', sourceHandle: null, targetHandle: null }, edges)).toBe(edges);
  });

  it('adds an edge that differs only by handle', () => {
    const edges = [{ id: 'e1', source: 'a', target: 'b', sourceHandle: 'x' }];
    const result = addEdge({ source: 'a', target: 'b', sourceHandle: 'y' }, edges);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe(edges[0]);
    expect(edges).toHaveLength(1);
  });
});

describe('c-flow-graph reconnectEdge', () => {
  const makeEdges = () => [
    { id: 'e1', source: 'a', target: 'b', label: 'L' },
    { id: 'e2', source: 'c', target: 'd' },
  ];

  it('replaces the id from the new connection by default and moves the edge last', () => {
    const edges = makeEdges();
    const result = reconnectEdge(edges[0], { source: 'a', target: 'z', sourceHandle: null, targetHandle: null }, edges);

    expect(result.map((e) => e.id)).toEqual(['e2', 'xy-edge__a-z']);
    expect(result[1]).toEqual({
      id: 'xy-edge__a-z',
      source: 'a',
      target: 'z',
      sourceHandle: null,
      targetHandle: null,
      label: 'L',
    });
    expect(edges.map((e) => e.id)).toEqual(['e1', 'e2']);
  });

  it('keeps the old id when shouldReplaceId is false', () => {
    const edges = makeEdges();
    const result = reconnectEdge(edges[0], { source: 'a', target: 'z' }, edges, { shouldReplaceId: false });

    expect(result.map((e) => e.id)).toEqual(['e2', 'e1']);
    expect(result[1].target).toBe('z');
  });

  it('uses a custom id generator when replacing the id', () => {
    const edges = makeEdges();
    const result = reconnectEdge(edges[0], { source: 'a', target: 'z' }, edges, {
      shouldReplaceId: true,
      getEdgeId: () => 'custom',
    });

    expect(result[1].id).toBe('custom');
  });

  it('returns the same array and reports 007 for an unknown edge', () => {
    const edges = makeEdges();
    const onError = jest.fn();

    expect(
      reconnectEdge({ id: 'ghost', source: 'a', target: 'b' }, { source: 'a', target: 'z' }, edges, { onError })
    ).toBe(edges);
    expect(onError).toHaveBeenCalledWith('007', errorMessages.error007('ghost'));
  });

  it('returns the same array and reports 006 for an incomplete connection', () => {
    const edges = makeEdges();
    const onError = jest.fn();

    expect(reconnectEdge(edges[0], { source: 'a' }, edges, { onError })).toBe(edges);
    expect(onError).toHaveBeenCalledWith('006', errorMessages.error006());
  });
});

describe('c-flow-graph applyNodeChanges', () => {
  it('applies a select change', () => {
    expect(applyNodeChanges([{ id: 'a', type: 'select', selected: true }], [{ id: 'a' }])).toEqual([
      { id: 'a', selected: true },
    ]);
    expect(applyNodeChanges([{ id: 'a', type: 'select', selected: false }], [{ id: 'a', selected: true }])).toEqual([
      { id: 'a', selected: false },
    ]);
  });

  it('applies a position change with both fields', () => {
    expect(
      applyNodeChanges(
        [{ id: 'a', type: 'position', position: { x: 1, y: 2 }, dragging: true }],
        [{ id: 'a', position: { x: 0, y: 0 } }]
      )
    ).toEqual([{ id: 'a', position: { x: 1, y: 2 }, dragging: true }]);
  });

  it('leaves the position alone when the change omits it', () => {
    expect(
      applyNodeChanges([{ id: 'a', type: 'position', dragging: false }], [{ id: 'a', position: { x: 7, y: 8 } }])
    ).toEqual([{ id: 'a', position: { x: 7, y: 8 }, dragging: false }]);
  });

  it('leaves dragging alone when the change omits it', () => {
    expect(
      applyNodeChanges(
        [{ id: 'a', type: 'position', position: { x: 1, y: 2 } }],
        [{ id: 'a', position: { x: 0, y: 0 }, dragging: true }]
      )
    ).toEqual([{ id: 'a', position: { x: 1, y: 2 }, dragging: true }]);
  });

  it('copies the element even when a position change carries nothing', () => {
    const nodes = [{ id: 'a', position: { x: 0, y: 0 } }];
    const result = applyNodeChanges([{ id: 'a', type: 'position' }], nodes);

    expect(result[0]).toEqual(nodes[0]);
    expect(result[0]).not.toBe(nodes[0]);
  });

  it('writes measured on a dimensions change without touching the attributes', () => {
    expect(
      applyNodeChanges([{ id: 'a', type: 'dimensions', dimensions: { width: 5, height: 6 } }], [{ id: 'a' }])
    ).toEqual([{ id: 'a', measured: { width: 5, height: 6 } }]);
  });

  it('writes both attributes when setAttributes is true', () => {
    expect(
      applyNodeChanges(
        [{ id: 'a', type: 'dimensions', dimensions: { width: 5, height: 6 }, setAttributes: true }],
        [{ id: 'a' }]
      )
    ).toEqual([{ id: 'a', measured: { width: 5, height: 6 }, width: 5, height: 6 }]);
  });

  it('writes only the width when setAttributes is "width"', () => {
    expect(
      applyNodeChanges(
        [{ id: 'a', type: 'dimensions', dimensions: { width: 5, height: 6 }, setAttributes: 'width' }],
        [{ id: 'a' }]
      )
    ).toEqual([{ id: 'a', measured: { width: 5, height: 6 }, width: 5 }]);
  });

  it('writes only the height when setAttributes is "height"', () => {
    expect(
      applyNodeChanges(
        [{ id: 'a', type: 'dimensions', dimensions: { width: 5, height: 6 }, setAttributes: 'height' }],
        [{ id: 'a' }]
      )
    ).toEqual([{ id: 'a', measured: { width: 5, height: 6 }, height: 6 }]);
  });

  it('copies the dimensions rather than aliasing the change', () => {
    const dimensions = { width: 5, height: 6 };
    const [node] = applyNodeChanges([{ id: 'a', type: 'dimensions', dimensions }], [{ id: 'a' }]);

    expect(node.measured).not.toBe(dimensions);
  });

  it('applies the resizing flag on its own', () => {
    expect(applyNodeChanges([{ id: 'a', type: 'dimensions', resizing: true }], [{ id: 'a' }])).toEqual([
      { id: 'a', resizing: true },
    ]);
    expect(applyNodeChanges([{ id: 'a', type: 'dimensions', resizing: false }], [{ id: 'a', resizing: true }])).toEqual(
      [{ id: 'a', resizing: false }]
    );
  });

  it('drops a removed element', () => {
    const nodes = [{ id: 'a' }, { id: 'b' }];
    const result = applyNodeChanges([{ id: 'a', type: 'remove' }], nodes);

    expect(result).toEqual([{ id: 'b' }]);
    expect(result[0]).toBe(nodes[1]);
  });

  it('swaps in a copy of the replacement item', () => {
    const item = { id: 'a', tag: 'new' };
    const result = applyNodeChanges([{ id: 'a', type: 'replace', item }], [{ id: 'a', tag: 'old' }]);

    expect(result).toEqual([{ id: 'a', tag: 'new' }]);
    expect(result[0]).not.toBe(item);
  });

  it('appends an added item when no index is given', () => {
    const result = applyNodeChanges([{ type: 'add', item: { id: 'z' } }], [{ id: 'a' }]);

    expect(result.map((n) => n.id)).toEqual(['a', 'z']);
  });

  it('splices an added item at the given index of the final array', () => {
    const result = applyNodeChanges(
      [
        { type: 'add', item: { id: 'z' }, index: 0 },
        { id: 'a', type: 'remove' },
      ],
      [{ id: 'a' }, { id: 'b' }]
    );

    expect(result.map((n) => n.id)).toEqual(['z', 'b']);
  });

  it('discards other changes for an element queued for removal, in either order', () => {
    const nodes = [{ id: 'a', position: { x: 0, y: 0 } }, { id: 'b' }];

    expect(
      applyNodeChanges(
        [
          { id: 'a', type: 'position', position: { x: 9, y: 9 } },
          { id: 'a', type: 'remove' },
        ],
        nodes
      )
    ).toEqual([{ id: 'b' }]);
    expect(
      applyNodeChanges(
        [
          { id: 'a', type: 'remove' },
          { id: 'a', type: 'position', position: { x: 9, y: 9 } },
        ],
        nodes
      )
    ).toEqual([{ id: 'b' }]);
  });

  it('discards other changes for an element queued for replacement', () => {
    expect(
      applyNodeChanges(
        [
          { id: 'a', type: 'position', position: { x: 9, y: 9 } },
          { id: 'a', type: 'replace', item: { id: 'a', tag: 'new' } },
        ],
        [{ id: 'a', position: { x: 0, y: 0 } }]
      )
    ).toEqual([{ id: 'a', tag: 'new' }]);
  });

  it('folds several changes for the same element in order', () => {
    expect(
      applyNodeChanges(
        [
          { id: 'a', type: 'select', selected: true },
          { id: 'a', type: 'position', position: { x: 3, y: 4 } },
        ],
        [{ id: 'a', position: { x: 0, y: 0 } }]
      )
    ).toEqual([{ id: 'a', position: { x: 3, y: 4 }, selected: true }]);
  });

  it('keeps the identity of untouched elements', () => {
    const nodes = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const result = applyNodeChanges([{ id: 'b', type: 'select', selected: true }], nodes);

    expect(result[0]).toBe(nodes[0]);
    expect(result[1]).not.toBe(nodes[1]);
    expect(result[2]).toBe(nodes[2]);
  });

  it('ignores a change for an element that is not in the array', () => {
    const nodes = [{ id: 'a' }];

    expect(applyNodeChanges([{ id: 'ghost', type: 'select', selected: true }], nodes)).toEqual([{ id: 'a' }]);
  });

  it('copies but does not alter an element for an unknown change type', () => {
    const nodes = [{ id: 'a', tag: 'keep' }];
    const result = applyNodeChanges([{ id: 'a', type: 'bogus' }], nodes);

    expect(result[0]).toEqual({ id: 'a', tag: 'keep' });
    expect(result[0]).not.toBe(nodes[0]);
  });

  it('returns a new array and leaves the input untouched', () => {
    const nodes = [{ id: 'a' }];
    const result = applyNodeChanges([{ id: 'a', type: 'select', selected: true }], nodes);

    expect(result).not.toBe(nodes);
    expect(nodes[0]).toEqual({ id: 'a' });
  });
});

describe('c-flow-graph applyEdgeChanges', () => {
  it('runs the same reducer over edges', () => {
    const edges = [
      { id: 'e1', source: 'a', target: 'b' },
      { id: 'e2', source: 'b', target: 'c' },
    ];
    const result = applyEdgeChanges(
      [
        { id: 'e1', type: 'select', selected: true },
        { id: 'e2', type: 'remove' },
      ],
      edges
    );

    expect(result).toEqual([{ id: 'e1', source: 'a', target: 'b', selected: true }]);
  });
});

describe('c-flow-graph selection changes', () => {
  it('builds a select change', () => {
    expect(createSelectionChange('a', true)).toEqual({ id: 'a', type: 'select', selected: true });
  });

  it('builds a remove change from an element', () => {
    expect(elementToRemoveChange({ id: 'a', extra: 1 })).toEqual({ id: 'a', type: 'remove' });
  });

  it('emits a change for every item whose selection differs', () => {
    const items = new Map([
      ['a', { id: 'a', selected: false }],
      ['b', { id: 'b', selected: true }],
    ]);

    expect(getSelectionChanges(items, new Set(['a']))).toEqual([
      { id: 'a', type: 'select', selected: true },
      { id: 'b', type: 'select', selected: false },
    ]);
  });

  it('emits nothing when every item is already in the desired state', () => {
    const items = new Map([
      ['a', { id: 'a', selected: true }],
      ['b', { id: 'b', selected: false }],
    ]);

    expect(getSelectionChanges(items, new Set(['a']))).toEqual([]);
  });

  it('treats an absent selected flag as unselected', () => {
    const items = new Map([['a', { id: 'a' }]]);

    expect(getSelectionChanges(items, new Set())).toEqual([]);
    expect(getSelectionChanges(items, new Set(['a']))).toEqual([{ id: 'a', type: 'select', selected: true }]);
  });

  it('deselects everything when no ids are supplied', () => {
    const items = new Map([['a', { id: 'a', selected: true }]]);

    expect(getSelectionChanges(items)).toEqual([{ id: 'a', type: 'select', selected: false }]);
  });

  it('leaves the items alone unless mutateItem is set', () => {
    const item = { id: 'a', selected: false };

    getSelectionChanges(new Map([['a', item]]), new Set(['a']));
    expect(item.selected).toBe(false);

    getSelectionChanges(new Map([['a', item]]), new Set(['a']), true);
    expect(item.selected).toBe(true);
  });
});

describe('c-flow-graph getElementsDiffChanges', () => {
  it('emits an add for an item the lookup has never seen, with its index', () => {
    expect(getElementsDiffChanges({ items: [{ id: 'a' }, { id: 'b' }], lookup: new Map() })).toEqual([
      { item: { id: 'a' }, type: 'add', index: 0 },
      { item: { id: 'b' }, type: 'add', index: 1 },
    ]);
  });

  it('emits a remove for a lookup entry that is gone', () => {
    expect(getElementsDiffChanges({ items: [], lookup: new Map([['a', { id: 'a' }]]) })).toEqual([
      { id: 'a', type: 'remove' },
    ]);
  });

  it('defaults to removing everything when no items are supplied', () => {
    expect(getElementsDiffChanges({ lookup: new Map([['a', { id: 'a' }]]) })).toEqual([{ id: 'a', type: 'remove' }]);
  });

  it('emits a replace when the stored item is no longer reference-identical', () => {
    const item = { id: 'a', v: 2 };

    expect(getElementsDiffChanges({ items: [item], lookup: new Map([['a', { id: 'a', v: 1 }]]) })).toEqual([
      { id: 'a', item, type: 'replace' },
    ]);
  });

  it('emits nothing when the stored user node is the same object', () => {
    const item = { id: 'a' };
    const lookup = new Map([['a', { id: 'a', internals: { userNode: item } }]]);

    expect(getElementsDiffChanges({ items: [item], lookup })).toEqual([]);
  });

  it('compares against the wrapped user node, not the internal node', () => {
    const item = { id: 'a', v: 2 };
    const lookup = new Map([['a', { id: 'a', internals: { userNode: { id: 'a', v: 1 } } }]]);

    expect(getElementsDiffChanges({ items: [item], lookup })).toEqual([{ id: 'a', item, type: 'replace' }]);
  });

  it('mixes adds, replaces and removes in one pass', () => {
    const kept = { id: 'a' };
    const changed = { id: 'b', v: 2 };
    const added = { id: 'c' };
    const lookup = new Map([
      ['a', { id: 'a', internals: { userNode: kept } }],
      ['b', { id: 'b', internals: { userNode: { id: 'b', v: 1 } } }],
      ['gone', { id: 'gone' }],
    ]);

    expect(getElementsDiffChanges({ items: [kept, changed, added], lookup })).toEqual([
      { id: 'b', item: changed, type: 'replace' },
      { item: added, type: 'add', index: 2 },
      { id: 'gone', type: 'remove' },
    ]);
  });
});
