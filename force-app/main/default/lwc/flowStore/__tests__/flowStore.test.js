import { ConnectionMode, SelectionMode, DEFAULT_MIN_ZOOM, DEFAULT_MAX_ZOOM, infiniteExtent } from 'c/flowTypes';
import { createFlowStore, shallowArrayEqual, shallowObjectEqual } from 'c/flowStore';

/**
 * A user node shaped the way `adoptUserNodes` expects.
 *
 * `handles: []` matters: without it `parseHandles` leaves `handleBounds`
 * undefined, and `getNodesInside` then reports the node visible regardless of
 * geometry so the `selectionMode` assertions could not fail.
 */
function userNode(id, x, y, width = 50, height = 50, extra = {}) {
  return {
    id,
    position: { x, y },
    measured: { width, height },
    handles: [],
    ...extra,
  };
}

/** An internal node as the lookup holds it, for the selection readers. */
function internalNode(id, x, y, width, height, extra = {}) {
  return {
    id,
    position: { x, y },
    measured: { width, height },
    internals: {
      positionAbsolute: { x, y },
      handleBounds: { source: [], target: [] },
    },
    ...extra,
  };
}

describe('c-flow-store createFlowStore', () => {
  it('starts from the documented defaults', () => {
    const { state } = createFlowStore();

    expect(state.nodes).toEqual([]);
    expect(state.edges).toEqual([]);
    expect(state.transform).toEqual([0, 0, 1]);
    expect(state.width).toBe(0);
    expect(state.height).toBe(0);
    expect(state.nodesInitialized).toBe(false);
    expect(state.minZoom).toBe(DEFAULT_MIN_ZOOM);
    expect(state.maxZoom).toBe(DEFAULT_MAX_ZOOM);
    expect(state.translateExtent).toBe(infiniteExtent);
    expect(state.nodeExtent).toBe(infiniteExtent);
    expect(state.connectionMode).toBe(ConnectionMode.Strict);
    expect(state.selectionMode).toBe(SelectionMode.Full);
    expect(state.connection).toEqual({ inProgress: false });
    expect(state.nodesDraggable).toBe(true);
    expect(state.elementsSelectable).toBe(true);
  });

  it('gives every store its own lookup instances', () => {
    const a = createFlowStore();
    const b = createFlowStore();

    expect(a.state.nodeLookup).not.toBe(b.state.nodeLookup);
    expect(a.state.nodeLookup.size).toBe(0);
    expect(a.state.edgeLookup).not.toBe(b.state.edgeLookup);
  });

  it('applies overrides over the defaults', () => {
    const { state } = createFlowStore({ minZoom: 0.1, selectionMode: SelectionMode.Partial, nodesDraggable: false });

    expect(state.minZoom).toBe(0.1);
    expect(state.selectionMode).toBe(SelectionMode.Partial);
    expect(state.nodesDraggable).toBe(false);
    // Untouched defaults survive the merge.
    expect(state.maxZoom).toBe(DEFAULT_MAX_ZOOM);
  });

  it('leaves the state object untouched for an empty or missing override', () => {
    const empty = createFlowStore({});
    const nullish = createFlowStore(null);

    expect(empty.state.minZoom).toBe(DEFAULT_MIN_ZOOM);
    expect(nullish.state.minZoom).toBe(DEFAULT_MIN_ZOOM);
  });
});

describe('c-flow-store subscribe', () => {
  it('fires immediately with the current value and no previous', () => {
    const store = createFlowStore({ width: 640 });
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(640, undefined);
  });

  it('does not fire immediately when immediate is false', () => {
    const store = createFlowStore({ width: 640 });
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });

    expect(callback).not.toHaveBeenCalled();
  });

  it('fires with the new and previous value when the slice changes', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.update({ width: 800 });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(800, 0);
  });

  it('does not fire when an unrelated slice changes', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.update({ height: 400 });

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not fire when the same value is written again', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.update({ width: 800 });
    store.update({ width: 800 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('fires every commit for a selector returning a fresh reference', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => [s.width], callback, { immediate: false });
    store.update({ height: 1 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('suppresses a notification for an equal-but-not-identical value under a custom compare', () => {
    const store = createFlowStore({ ids: ['a', 'b'] });
    const callback = jest.fn();

    store.subscribe((s) => s.ids, callback, { immediate: false, compare: shallowArrayEqual });
    store.update({ ids: ['a', 'b'] });

    expect(callback).not.toHaveBeenCalled();

    store.update({ ids: ['a', 'c'] });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(['a', 'c'], ['a', 'b']);
  });

  it('stops delivering after the returned function is called', () => {
    const store = createFlowStore();
    const callback = jest.fn();
    const unsubscribe = store.subscribe((s) => s.width, callback, { immediate: false });

    store.update({ width: 10 });
    unsubscribe();
    store.update({ width: 20 });
    store.update({ width: 30 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('tolerates a repeated unsubscribe', () => {
    const store = createFlowStore();
    const callback = jest.fn();
    const unsubscribe = store.subscribe((s) => s.width, callback, { immediate: false });

    unsubscribe();
    unsubscribe();
    store.update({ width: 20 });

    expect(callback).not.toHaveBeenCalled();
  });

  it('drops every subscriber on destroy', () => {
    const store = createFlowStore();
    const first = jest.fn();
    const second = jest.fn();

    store.subscribe((s) => s.width, first, { immediate: false });
    store.subscribe((s) => s.width, second, { immediate: false });
    store.destroy();
    store.update({ width: 20 });

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it('keeps iterating when one subscriber unsubscribes another mid-flush', () => {
    const store = createFlowStore();
    const order = [];
    /*
     * A holder rather than a `let`: the first subscriber must reference the
     * second's unsubscribe before it exists, which `no-use-before-define`
     * rejects as a bare reference and `prefer-const` rejects as a single-assign
     * `let`. The indirection satisfies both and reads the same.
     */
    const handles = {};

    store.subscribe(
      (s) => s.tick,
      () => {
        order.push('first');
        handles.second();
      },
      { immediate: false }
    );

    const second = jest.fn(() => order.push('second'));
    handles.second = store.subscribe((s) => s.tick, second, { immediate: false });

    const third = jest.fn(() => order.push('third'));

    store.subscribe((s) => s.tick, third, { immediate: false });

    store.update({ tick: 1 });

    expect(second).not.toHaveBeenCalled();
    expect(third).toHaveBeenCalledTimes(1);
    expect(order).toEqual(['first', 'third']);
  });

  it('delivers to a subscriber added during a flush on the following commit only', () => {
    const store = createFlowStore();
    const late = jest.fn();

    store.subscribe(
      (s) => s.tick,
      () => {
        store.subscribe((s) => s.tick, late, { immediate: false });
      },
      { immediate: false }
    );

    store.update({ tick: 1 });

    expect(late).not.toHaveBeenCalled();

    store.update({ tick: 2 });

    expect(late).toHaveBeenCalledTimes(1);
  });
});

describe('c-flow-store update', () => {
  it('merges a partial state object', () => {
    const store = createFlowStore();

    store.update({ width: 100, height: 200 });

    expect(store.state.width).toBe(100);
    expect(store.state.height).toBe(200);
    expect(store.state.transform).toEqual([0, 0, 1]);
  });

  it('accepts an updater function receiving the current state', () => {
    const store = createFlowStore({ width: 100 });

    store.update((state) => ({ width: state.width + 50 }));

    expect(store.state.width).toBe(150);
  });

  it('ignores a falsy patch', () => {
    const store = createFlowStore({ width: 100 });
    const callback = jest.fn();
    const before = store.state;

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.update(() => null);
    store.update(undefined);
    store.update(0);

    expect(store.state).toBe(before);
    expect(callback).not.toHaveBeenCalled();
  });

  it('replaces the state object rather than mutating it', () => {
    const store = createFlowStore();
    const before = store.state;

    store.update({ width: 1 });

    expect(store.state).not.toBe(before);
    expect(before.width).toBe(0);
  });
});

describe('c-flow-store batch', () => {
  it('notifies once for several updates', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.batch(() => {
      store.update({ width: 1 });
      store.update({ width: 2 });
      store.update({ width: 3 });
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(3, 0);
  });

  it('notifies once at the outermost exit of nested batches', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.batch(() => {
      store.update({ width: 1 });
      store.batch(() => {
        store.update({ width: 2 });
        expect(callback).not.toHaveBeenCalled();
      });
      expect(callback).not.toHaveBeenCalled();
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(2, 0);
  });

  it('returns the value the batched function returned', () => {
    const store = createFlowStore();

    expect(store.batch(() => 'done')).toBe('done');
  });

  it('does not notify when nothing was written', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });
    store.batch(() => undefined);

    expect(callback).not.toHaveBeenCalled();
  });

  it('still flushes when the batched function throws', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.width, callback, { immediate: false });

    expect(() =>
      store.batch(() => {
        store.update({ width: 7 });
        throw new Error('boom');
      })
    ).toThrow('boom');
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(7, 0);
  });
});

describe('c-flow-store setNodes', () => {
  it('populates the node lookup and reports initialisation', () => {
    const store = createFlowStore();

    store.setNodes([userNode('a', 0, 0), userNode('b', 100, 0)]);

    expect(store.state.nodes).toHaveLength(2);
    expect(store.state.nodeLookup.size).toBe(2);
    expect(store.state.nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: 0, y: 0 });
    expect(store.state.nodesInitialized).toBe(true);
    expect(store.state.nodeVersion).toBe(1);
  });

  it('reports a node without measurements as uninitialised', () => {
    const store = createFlowStore();

    store.setNodes([{ id: 'a', position: { x: 0, y: 0 } }]);

    expect(store.state.nodesInitialized).toBe(false);
  });

  it('populates the parent lookup for a child node', () => {
    const store = createFlowStore();

    store.setNodes([userNode('a', 0, 0), userNode('b', 10, 10, 50, 50, { parentId: 'a' })]);

    // The parent lookup keys children by id inside a Map per parent.
    expect([...store.state.parentLookup.get('a').keys()]).toEqual(['b']);
    expect(store.state.parentLookup.get('a').get('b').id).toBe('b');
    // A child's stored position is relative; the absolute one adds the parent origin.
    expect(store.state.nodeLookup.get('b').internals.positionAbsolute).toEqual({ x: 10, y: 10 });
  });

  it('keeps the lookup identity and bumps the version on every call', () => {
    const store = createFlowStore();
    const lookup = store.state.nodeLookup;

    store.setNodes([userNode('a', 0, 0)]);
    store.setNodes([userNode('b', 0, 0)]);

    expect(store.state.nodeLookup).toBe(lookup);
    expect(store.state.nodeLookup.has('a')).toBe(false);
    expect(store.state.nodeVersion).toBe(2);
  });

  it('notifies a version subscriber because the Map itself never changes identity', () => {
    const store = createFlowStore();
    const byVersion = jest.fn();
    const byLookup = jest.fn();

    store.subscribe((s) => s.nodeVersion, byVersion, { immediate: false });
    store.subscribe((s) => s.nodeLookup, byLookup, { immediate: false });
    store.setNodes([userNode('a', 0, 0)]);

    expect(byVersion).toHaveBeenCalledTimes(1);
    expect(byLookup).not.toHaveBeenCalled();
  });

  it('re-adopts the current node array on refreshNodeInternals', () => {
    const store = createFlowStore();
    const nodes = [userNode('a', 0, 0)];

    store.setNodes(nodes);
    store.update({ nodeOrigin: [0.5, 0.5] });
    store.refreshNodeInternals();

    expect(store.state.nodes).toBe(nodes);
    expect(store.state.nodeVersion).toBe(2);
    expect(store.state.nodeLookup.has('a')).toBe(true);
  });

  it('recomputes absolute positions when the node objects are replaced', () => {
    const store = createFlowStore({ nodeOrigin: [0.5, 0.5] });

    store.setNodes([userNode('a', 0, 0)]);

    // Origin [0.5, 0.5] centres the 50x50 node on its position.
    expect(store.state.nodeLookup.get('a').internals.positionAbsolute).toEqual({ x: -25, y: -25 });
  });

  it('exposes an internal node by id', () => {
    const store = createFlowStore();

    store.setNodes([userNode('a', 5, 6)]);

    expect(store.getInternalNode('a').id).toBe('a');
    expect(store.getInternalNode('missing')).toBeUndefined();
  });
});

describe('c-flow-store setEdges', () => {
  it('populates the edge and connection lookups', () => {
    const store = createFlowStore();

    store.setEdges([{ id: 'e1', source: 'a', target: 'b' }]);

    expect(store.state.edges).toHaveLength(1);
    expect(store.state.edgeLookup.get('e1').id).toBe('e1');
    expect(store.state.connectionLookup.get('a-source').size).toBe(1);
    expect(store.state.connectionLookup.get('b-target').size).toBe(1);
    expect([...store.state.connectionLookup.get('a').values()][0]).toEqual({
      edgeId: 'e1',
      source: 'a',
      target: 'b',
      sourceHandle: null,
      targetHandle: null,
    });
    expect(store.state.edgeVersion).toBe(1);
  });

  it('indexes a handle-specific key when the edge names handles', () => {
    const store = createFlowStore();

    store.setEdges([{ id: 'e1', source: 'a', target: 'b', sourceHandle: 's1', targetHandle: 't1' }]);

    expect(store.state.connectionLookup.get('a-source-s1').size).toBe(1);
    expect(store.state.connectionLookup.get('b-target-t1').size).toBe(1);
  });

  it('keeps the lookup identity and bumps the version on every call', () => {
    const store = createFlowStore();
    const lookup = store.state.edgeLookup;

    store.setEdges([{ id: 'e1', source: 'a', target: 'b' }]);
    store.setEdges([]);

    expect(store.state.edgeLookup).toBe(lookup);
    expect(store.state.edgeLookup.size).toBe(0);
    expect(store.state.connectionLookup.size).toBe(0);
    expect(store.state.edgeVersion).toBe(2);
  });
});

describe('c-flow-store viewport writes', () => {
  it('commits a changed transform', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => s.transform, callback, { immediate: false });
    store.setTransform([10, 20, 2]);

    expect(store.state.transform).toEqual([10, 20, 2]);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('skips the commit when the transform is unchanged', () => {
    const store = createFlowStore();
    const callback = jest.fn();
    const before = store.state;

    store.subscribe((s) => s.transform, callback, { immediate: false });
    store.setTransform([0, 0, 1]);

    expect(store.state).toBe(before);
    expect(callback).not.toHaveBeenCalled();
  });

  it('commits when only one transform component differs', () => {
    const store = createFlowStore();

    store.setTransform([0, 0, 1.0001]);

    expect(store.state.transform).toEqual([0, 0, 1.0001]);

    store.setTransform([0, 1, 1.0001]);

    expect(store.state.transform).toEqual([0, 1, 1.0001]);
  });

  it('commits changed dimensions and skips an identical write', () => {
    const store = createFlowStore();
    const callback = jest.fn();

    store.subscribe((s) => `${s.width}x${s.height}`, callback, { immediate: false });
    store.setDimensions(800, 600);

    expect(callback).toHaveBeenCalledTimes(1);

    const after = store.state;

    store.setDimensions(800, 600);

    expect(store.state).toBe(after);
    expect(callback).toHaveBeenCalledTimes(1);

    store.setDimensions(800, 601);

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('reports the viewport as x, y and zoom', () => {
    const store = createFlowStore();

    store.setTransform([-30, 40, 1.5]);

    expect(store.getViewport()).toEqual({ x: -30, y: 40, zoom: 1.5 });
  });
});

describe('c-flow-store getNodeIdsInRect', () => {
  /** Node `a` sits fully inside the test rect, node `b` only overlaps it. */
  function seeded(selectionMode) {
    const store = createFlowStore({ selectionMode });

    store.setNodes([userNode('a', 0, 0), userNode('b', 100, 0)]);

    return store;
  }

  const rect = { x: 0, y: 0, width: 120, height: 60 };

  it('requires full containment in Full mode', () => {
    expect(seeded(SelectionMode.Full).getNodeIdsInRect(rect)).toEqual(['a']);
  });

  it('accepts an overlap in Partial mode', () => {
    expect(seeded(SelectionMode.Partial).getNodeIdsInRect(rect)).toEqual(['a', 'b']);
  });

  it('accounts for the viewport transform', () => {
    const store = seeded(SelectionMode.Full);

    // Pan the content 200px left: node `b` is now the one inside the rect.
    store.setTransform([-100, 0, 1]);

    expect(store.getNodeIdsInRect({ x: 0, y: 0, width: 60, height: 60 })).toEqual(['b']);
  });

  it('excludes a non-selectable node', () => {
    const store = createFlowStore();

    store.setNodes([userNode('a', 0, 0, 50, 50, { selectable: false }), userNode('b', 0, 0)]);

    expect(store.getNodeIdsInRect(rect)).toEqual(['b']);
  });
});

describe('c-flow-store selection readers', () => {
  function seeded() {
    const store = createFlowStore();

    store.update({
      nodeLookup: new Map([
        ['a', internalNode('a', 0, 0, 50, 50, { selected: true })],
        ['b', internalNode('b', 100, 0, 50, 50, { selected: false })],
        ['c', internalNode('c', 200, 0, 50, 50)],
      ]),
      edges: [
        { id: 'e1', source: 'a', target: 'b', selected: true },
        { id: 'e2', source: 'b', target: 'c' },
      ],
      edgeLookup: new Map([
        ['e1', { id: 'e1', selected: true }],
        ['e2', { id: 'e2', selected: false }],
      ]),
    });

    return store;
  }

  it('reports the selected node ids', () => {
    expect([...seeded().getSelectedNodeIds()]).toEqual(['a']);
  });

  it('reports the selected edge ids', () => {
    expect([...seeded().getSelectedEdgeIds()]).toEqual(['e1']);
  });

  it('reports empty sets for an empty graph', () => {
    const store = createFlowStore();

    expect(store.getSelectedNodeIds().size).toBe(0);
    expect(store.getSelectedEdgeIds().size).toBe(0);
  });

  it('emits only the changes needed to reach the requested selection', () => {
    const store = seeded();
    const { nodeChanges, edgeChanges } = store.getSelectionChangesFor(['b'], ['e2']);

    expect(nodeChanges).toEqual([
      { id: 'a', type: 'select', selected: false },
      { id: 'b', type: 'select', selected: true },
    ]);
    expect(edgeChanges).toEqual([
      { id: 'e1', type: 'select', selected: false },
      { id: 'e2', type: 'select', selected: true },
    ]);
  });

  it('mutates node selection but leaves edges to the consumer', () => {
    const store = seeded();

    store.getSelectionChangesFor(['b'], ['e2']);

    expect(store.state.nodeLookup.get('a').selected).toBe(false);
    expect(store.state.nodeLookup.get('b').selected).toBe(true);
    // Edges are not mutated: `getSelectionChanges` is called with mutateItem false.
    expect(store.state.edgeLookup.get('e1').selected).toBe(true);
  });

  it('stops emitting node changes once the selection holds, but keeps re-emitting edge changes', () => {
    const store = seeded();

    store.getSelectionChangesFor(['b'], ['e2']);
    const second = store.getSelectionChangesFor(['b'], ['e2']);

    /*
     * Asymmetric on purpose, and matching upstream. Node selection is
     * written onto the INTERNAL node, which `adoptUserNodes` owns, so a
     * repeated request is a no-op. `edgeLookup` holds the consumer's own
     * edge objects, so writing `selected` there would mutate the caller's
     * array; edges therefore stay untouched and the change is re-emitted
     * until the consumer applies it and hands back a new edge array.
     */
    expect(second.nodeChanges).toEqual([]);
    expect(second.edgeChanges).toEqual([
      { id: 'e1', type: 'select', selected: false },
      { id: 'e2', type: 'select', selected: true },
    ]);
  });

  it('accepts Sets as well as arrays', () => {
    const store = seeded();
    const { nodeChanges } = store.getSelectionChangesFor(new Set(['a', 'b']), new Set());

    expect(nodeChanges).toEqual([{ id: 'b', type: 'select', selected: true }]);
  });

  it('deselects everything when called with no arguments', () => {
    const store = seeded();
    const { nodeChanges, edgeChanges } = store.getSelectionChangesFor();

    expect(nodeChanges).toEqual([{ id: 'a', type: 'select', selected: false }]);
    expect(edgeChanges).toEqual([{ id: 'e1', type: 'select', selected: false }]);
  });

  it('compares id sets for redundant selection work', () => {
    const store = createFlowStore();
    const { selectionChanged } = store.constructor;

    expect(selectionChanged(new Set(['a', 'b']), new Set(['b', 'a']))).toBe(false);
    expect(selectionChanged(new Set(['a']), new Set(['a', 'b']))).toBe(true);
    expect(selectionChanged(new Set(['a']), new Set(['b']))).toBe(true);
  });
});

describe('c-flow-store shallowArrayEqual', () => {
  it('is true for the identical reference', () => {
    const a = ['x'];

    expect(shallowArrayEqual(a, a)).toBe(true);
  });

  it('is true for equal contents in equal order', () => {
    expect(shallowArrayEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(shallowArrayEqual([], [])).toBe(true);
  });

  it('is false on a length mismatch', () => {
    expect(shallowArrayEqual(['a'], ['a', 'b'])).toBe(false);
    expect(shallowArrayEqual(['a', 'b'], ['a'])).toBe(false);
  });

  it('is false when any element differs, including by order', () => {
    expect(shallowArrayEqual(['a', 'b'], ['a', 'c'])).toBe(false);
    expect(shallowArrayEqual(['a', 'b'], ['b', 'a'])).toBe(false);
  });

  it('is false for non-arrays', () => {
    expect(shallowArrayEqual(undefined, [])).toBe(false);
    expect(shallowArrayEqual([], null)).toBe(false);
    expect(shallowArrayEqual('ab', 'ab')).toBe(true);
    expect(shallowArrayEqual({ 0: 'a', length: 1 }, ['a'])).toBe(false);
  });

  it('compares nested references identically, not structurally', () => {
    expect(shallowArrayEqual([{ id: 1 }], [{ id: 1 }])).toBe(false);
  });
});

describe('c-flow-store shallowObjectEqual', () => {
  it('is true for the identical reference', () => {
    const a = { x: 1 };

    expect(shallowObjectEqual(a, a)).toBe(true);
  });

  it('is true for the same keys and identical values', () => {
    expect(shallowObjectEqual({ x: 1, y: 'a' }, { y: 'a', x: 1 })).toBe(true);
    expect(shallowObjectEqual({}, {})).toBe(true);
  });

  it('is false on a key-count mismatch', () => {
    expect(shallowObjectEqual({ x: 1 }, { x: 1, y: 2 })).toBe(false);
    expect(shallowObjectEqual({ x: 1, y: 2 }, { x: 1 })).toBe(false);
  });

  it('is false when a key is missing rather than merely different', () => {
    expect(shallowObjectEqual({ x: 1 }, { y: 1 })).toBe(false);
  });

  it('is false when a value differs', () => {
    expect(shallowObjectEqual({ x: 1 }, { x: 2 })).toBe(false);
  });

  it('is false for nullish or non-object operands', () => {
    expect(shallowObjectEqual(null, {})).toBe(false);
    expect(shallowObjectEqual({}, null)).toBe(false);
    expect(shallowObjectEqual({}, undefined)).toBe(false);
    expect(shallowObjectEqual(1, 1)).toBe(true);
    expect(shallowObjectEqual({ x: 1 }, 'x')).toBe(false);
  });

  it('compares nested references identically, not structurally', () => {
    expect(shallowObjectEqual({ p: { x: 1 } }, { p: { x: 1 } })).toBe(false);
  });
});
