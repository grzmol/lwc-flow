import {
  isParentSelected,
  getDragItems,
  getEventHandlerParams,
  calculateSnapOffset,
  calculateNodePosition,
  createDrag,
} from 'c/flowDrag';
import { createFlowStore } from 'c/flowStore';
import { errorMessages } from 'c/flowTypes';

/** The pane rect every gesture test measures against; jsdom lays nothing out. */
const PANE_RECT = { left: 0, top: 0, right: 800, bottom: 600, width: 800, height: 600, x: 0, y: 0 };

/**
 * jsdom ships no `PointerEvent`, so the kernel is driven with a `MouseEvent`
 * carrying the `pointerId` it identifies a gesture by.
 */
function pointerEvent(type, { x = 0, y = 0, button = 0, pointerId = 1 } = {}) {
  const event = new MouseEvent(type, { clientX: x, clientY: y, button, bubbles: true, cancelable: true });

  Object.defineProperty(event, 'pointerId', { value: pointerId });

  return event;
}

/** A lookup of plain nodes: the ancestry walk reads only id/parentId/selected. */
function lookupOf(nodes) {
  return new Map(nodes.map((node) => [node.id, node]));
}

/** Seed real internal nodes through adoption rather than hand-rolling `internals`. */
function storeWith(nodes, state = {}) {
  const store = createFlowStore();

  store.update({ width: 800, height: 600, ...state });
  store.setNodes(nodes);

  return store;
}

afterEach(() => {
  // The skill's prescribed reset; innerHTML is blocked by @lwc/lwc/no-inner-html.
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

describe('c-flow-drag isParentSelected', () => {
  it('is false for a root node, which has no ancestor to be carried by', () => {
    expect(isParentSelected({ id: 'a' }, lookupOf([{ id: 'a' }]))).toBe(false);
  });

  it('is false when the named parent is not in the lookup', () => {
    const child = { id: 'c', parentId: 'ghost' };

    expect(isParentSelected(child, lookupOf([child]))).toBe(false);
  });

  it('is true when the direct parent is selected', () => {
    const parent = { id: 'p', selected: true };
    const child = { id: 'c', parentId: 'p' };

    expect(isParentSelected(child, lookupOf([parent, child]))).toBe(true);
  });

  it('is true when a grandparent is selected, because the whole chain moves', () => {
    const grandparent = { id: 'g', selected: true };
    const parent = { id: 'p', parentId: 'g', selected: false };
    const child = { id: 'c', parentId: 'p', selected: false };

    expect(isParentSelected(child, lookupOf([grandparent, parent, child]))).toBe(true);
  });
});

describe('c-flow-drag getDragItems', () => {
  const measured = { width: 100, height: 50 };

  it('includes the grabbed node even when it is not selected', () => {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured },
      { id: 'b', position: { x: 200, y: 0 }, measured },
    ]);

    const items = getDragItems(store.state.nodeLookup, true, { x: 0, y: 0 }, 'a');

    expect(Array.from(items.keys())).toEqual(['a']);
  });

  it('includes every selected node when no single node was grabbed', () => {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured, selected: true },
      { id: 'b', position: { x: 200, y: 0 }, measured, selected: true },
      { id: 'c', position: { x: 400, y: 0 }, measured },
    ]);

    const items = getDragItems(store.state.nodeLookup, true, { x: 0, y: 0 }, undefined);

    expect(Array.from(items.keys())).toEqual(['a', 'b']);
  });

  it('excludes a child whose parent is also dragged, which would double its delta', () => {
    const store = storeWith([
      { id: 'p', position: { x: 0, y: 0 }, measured: { width: 300, height: 300 }, selected: true },
      { id: 'c', parentId: 'p', position: { x: 10, y: 10 }, measured, selected: true },
    ]);

    const items = getDragItems(store.state.nodeLookup, true, { x: 0, y: 0 }, undefined);

    expect(Array.from(items.keys())).toEqual(['p']);
  });

  it('lets an explicit draggable:false override the flow-wide default', () => {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured, selected: true, draggable: false },
      { id: 'b', position: { x: 200, y: 0 }, measured, selected: true },
    ]);

    const items = getDragItems(store.state.nodeLookup, true, { x: 0, y: 0 }, undefined);

    expect(Array.from(items.keys())).toEqual(['b']);
  });

  it('honours nodesDraggable:false for nodes that do not opt in themselves', () => {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured, selected: true },
      { id: 'b', position: { x: 200, y: 0 }, measured, selected: true, draggable: true },
    ]);

    const items = getDragItems(store.state.nodeLookup, false, { x: 0, y: 0 }, undefined);

    expect(Array.from(items.keys())).toEqual(['b']);
  });

  it('records pointer-minus-absolute distance per node, which is what preserves layout', () => {
    const store = storeWith([
      { id: 'a', position: { x: 10, y: 20 }, measured, selected: true },
      { id: 'b', position: { x: 100, y: 0 }, measured, selected: true },
    ]);

    const items = getDragItems(store.state.nodeLookup, true, { x: 50, y: 40 }, undefined);

    expect(items.get('a').distance).toEqual({ x: 40, y: 20 });
    expect(items.get('b').distance).toEqual({ x: -50, y: 40 });
    expect(items.get('a').position).toEqual({ x: 10, y: 20 });
    expect(items.get('b').position).toEqual({ x: 100, y: 0 });
  });
});

describe('c-flow-drag getEventHandlerParams', () => {
  const measured = { width: 100, height: 50 };

  /** Drag items whose positions have already moved, as a live drag would leave them. */
  function movedSet() {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured, selected: true, data: { label: 'A' } },
      { id: 'b', position: { x: 100, y: 50 }, measured, selected: true, data: { label: 'B' } },
    ]);
    const dragItems = getDragItems(store.state.nodeLookup, true, { x: 0, y: 0 }, undefined);

    dragItems.get('a').position = { x: 5, y: 6 };
    dragItems.get('b').position = { x: 105, y: 56 };

    return { nodeLookup: store.state.nodeLookup, dragItems };
  }

  it('puts the grabbed node first and carries the drag item position onto the user node', () => {
    const { nodeLookup, dragItems } = movedSet();

    const [node, nodes] = getEventHandlerParams({ nodeId: 'b', dragItems, nodeLookup });

    expect(node.id).toBe('b');
    expect(node.position).toEqual({ x: 105, y: 56 });
    expect(node.dragging).toBe(true);
    // The payload is the consumer's own node object, not the internal one.
    expect(node.data).toEqual({ label: 'B' });
    expect(nodes.map((n) => n.id)).toEqual(['a', 'b']);
    expect(nodes.map((n) => n.position)).toEqual([
      { x: 5, y: 6 },
      { x: 105, y: 56 },
    ]);
  });

  it('falls back to the first of the set when the gesture started on the selection rect', () => {
    const { nodeLookup, dragItems } = movedSet();

    const [node, nodes] = getEventHandlerParams({ nodeId: undefined, dragItems, nodeLookup });

    expect(node.id).toBe('a');
    expect(node).toBe(nodes[0]);
  });

  it('falls back to the first of the set when the named node is gone from the lookup', () => {
    const { nodeLookup, dragItems } = movedSet();

    const [node, nodes] = getEventHandlerParams({ nodeId: 'ghost', dragItems, nodeLookup });

    expect(node).toBe(nodes[0]);
    expect(node.id).toBe('a');
  });

  it('stamps the dragging flag it was given onto every node', () => {
    const { nodeLookup, dragItems } = movedSet();

    const [node, nodes] = getEventHandlerParams({ nodeId: 'a', dragItems, nodeLookup, dragging: false });

    expect(node.dragging).toBe(false);
    expect(nodes.map((n) => n.dragging)).toEqual([false, false]);
  });
});

describe('c-flow-drag calculateSnapOffset', () => {
  it('returns null for an empty drag set', () => {
    expect(calculateSnapOffset({ dragItems: new Map(), snapGrid: [15, 15], x: 20, y: 20 })).toBeNull();
  });

  it('derives one shared offset from the first item, so the selection does not shear', () => {
    const dragItems = new Map([
      ['a', { distance: { x: 3, y: 3 } }],
      ['b', { distance: { x: -20, y: 7 } }],
    ]);

    /*
     * First item: (20-3, 20-3) = (17,17), snapped to (15,15), offset (-2,-2).
     * The second item alone would yield (5,2); one offset for both is the point.
     */
    expect(calculateSnapOffset({ dragItems, snapGrid: [15, 15], x: 20, y: 20 })).toEqual({ x: -2, y: -2 });
  });
});

describe('c-flow-drag calculateNodePosition', () => {
  it('passes the position through when nothing constrains the node', () => {
    const store = storeWith([{ id: 'a', position: { x: 0, y: 0 }, measured: { width: 40, height: 20 } }]);

    const result = calculateNodePosition({
      nodeId: 'a',
      nextPosition: { x: 123.5, y: -7 },
      nodeLookup: store.state.nodeLookup,
    });

    expect(result).toEqual({ position: { x: 123.5, y: -7 }, positionAbsolute: { x: 123.5, y: -7 } });
  });

  it('clamps to a coordinate extent, reduced by the node size so its far edge stays inside', () => {
    const store = storeWith([
      {
        id: 'a',
        position: { x: 0, y: 0 },
        measured: { width: 40, height: 20 },
        extent: [
          [0, 0],
          [100, 100],
        ],
      },
    ]);

    const result = calculateNodePosition({
      nodeId: 'a',
      nextPosition: { x: 200, y: 200 },
      nodeLookup: store.state.nodeLookup,
    });

    expect(result.positionAbsolute).toEqual({ x: 60, y: 80 });
  });

  it("clamps extent:'parent' against the live parent rect", () => {
    const store = storeWith([
      { id: 'p', position: { x: 30, y: 10 }, measured: { width: 200, height: 100 } },
      { id: 'c', parentId: 'p', extent: 'parent', position: { x: 0, y: 0 }, measured: { width: 40, height: 20 } },
    ]);

    const result = calculateNodePosition({
      nodeId: 'c',
      nextPosition: { x: 500, y: 500 },
      nodeLookup: store.state.nodeLookup,
    });

    // Parent box [30,10]-[230,110] minus the child size, reported parent-relative.
    expect(result.positionAbsolute).toEqual({ x: 190, y: 90 });
    expect(result.position).toEqual({ x: 160, y: 80 });
  });

  it("shifts a child's coordinate extent into absolute space by the parent position", () => {
    const store = storeWith([
      { id: 'p', position: { x: 100, y: 100 }, measured: { width: 200, height: 200 } },
      {
        id: 'c',
        parentId: 'p',
        position: { x: 0, y: 0 },
        measured: { width: 10, height: 10 },
        extent: [
          [0, 0],
          [50, 50],
        ],
      },
    ]);

    const result = calculateNodePosition({
      nodeId: 'c',
      nextPosition: { x: 200, y: 200 },
      nodeLookup: store.state.nodeLookup,
    });

    // Unshifted the extent would clamp to 40 absolute, i.e. far outside the parent.
    expect(result.positionAbsolute).toEqual({ x: 140, y: 140 });
    expect(result.position).toEqual({ x: 40, y: 40 });
  });

  it('moves the reported position by the origin while the absolute position stays put', () => {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured: { width: 100, height: 50 }, origin: [0.5, 0.5] },
    ]);

    const result = calculateNodePosition({
      nodeId: 'a',
      nextPosition: { x: 300, y: 200 },
      nodeLookup: store.state.nodeLookup,
    });

    expect(result.positionAbsolute).toEqual({ x: 300, y: 200 });
    expect(result.position).toEqual({ x: 350, y: 225 });
  });

  it("reports 005 when extent:'parent' is used on a node that has no parent", () => {
    const store = storeWith([
      { id: 'a', position: { x: 0, y: 0 }, measured: { width: 40, height: 20 }, extent: 'parent' },
    ]);
    const onError = jest.fn();

    const result = calculateNodePosition({
      nodeId: 'a',
      nextPosition: { x: 10, y: 10 },
      nodeLookup: store.state.nodeLookup,
      onError,
    });

    expect(onError).toHaveBeenCalledWith('005', errorMessages.error005());
    expect(result.positionAbsolute).toEqual({ x: 10, y: 10 });
  });

  it('reports 015 when the node has not been measured yet', () => {
    const store = storeWith([{ id: 'a', position: { x: 0, y: 0 } }]);
    const onError = jest.fn();

    calculateNodePosition({
      nodeId: 'a',
      nextPosition: { x: 10, y: 10 },
      nodeLookup: store.state.nodeLookup,
      onError,
    });

    expect(onError).toHaveBeenCalledWith('015', errorMessages.error015());
  });
});

describe('c-flow-drag createDrag', () => {
  const measured = { width: 100, height: 50 };
  const defaultNodes = () => [{ id: 'a', position: { x: 0, y: 0 }, measured, selected: true }];

  let drags;

  /** Build a pane, a node element and a store, and attach a drag to the node. */
  function harness({ nodes = defaultNodes(), state = {}, params = {} } = {}) {
    const pane = document.createElement('div');

    pane.getBoundingClientRect = () => PANE_RECT;

    const nodeEl = document.createElement('div');

    pane.appendChild(nodeEl);
    document.body.appendChild(pane);

    const store = createFlowStore();

    store.update({ domNode: pane, width: 800, height: 600, autoPanOnNodeDrag: false, ...state });
    store.setNodes(nodes);

    const handlers = {
      onNodeMouseDown: jest.fn(),
      onDragStart: jest.fn(),
      onDrag: jest.fn(),
      onDragStop: jest.fn(),
    };
    const drag = createDrag({ store, domNode: nodeEl, nodeId: 'a', ...handlers, ...params });

    drags.push(drag);

    return { store, pane, nodeEl, drag, ...handlers };
  }

  function press(target, x, y, options) {
    target.dispatchEvent(pointerEvent('pointerdown', { x, y, ...options }));
  }

  function move(target, x, y, options) {
    target.dispatchEvent(pointerEvent('pointermove', { x, y, ...options }));
  }

  function release(target, x, y, options) {
    target.dispatchEvent(pointerEvent('pointerup', { x, y, ...options }));
  }

  beforeEach(() => {
    drags = [];
  });

  afterEach(() => {
    drags.forEach((drag) => drag.destroy());
  });

  it('ignores a press from a non-primary button, which belongs to pan or context menu', () => {
    const { nodeEl, store, onNodeMouseDown } = harness();

    press(nodeEl, 10, 10, { button: 2 });

    expect(onNodeMouseDown).not.toHaveBeenCalled();
    expect(store.state.dragging).toBe(false);
  });

  it('ignores a press that originated inside a nodrag subtree', () => {
    const { nodeEl, onNodeMouseDown } = harness();
    const field = document.createElement('div');

    field.className = 'nodrag';
    nodeEl.appendChild(field);

    press(field, 10, 10);
    expect(onNodeMouseDown).not.toHaveBeenCalled();

    // Same gesture one element up: proves the opt-out, not a broken harness.
    press(nodeEl, 10, 10);
    expect(onNodeMouseDown).toHaveBeenCalledTimes(1);
  });

  it('restricts the start to the handle selector when one is given', () => {
    const { nodeEl, onNodeMouseDown } = harness({ params: { handleSelector: '.drag-handle' } });
    const handle = document.createElement('div');

    handle.className = 'drag-handle';
    nodeEl.appendChild(handle);

    press(nodeEl, 10, 10);
    expect(onNodeMouseDown).not.toHaveBeenCalled();

    press(handle, 10, 10);
    expect(onNodeMouseDown).toHaveBeenCalledTimes(1);
    expect(onNodeMouseDown.mock.calls[0][0]).toBe('a');
  });

  it('fires onNodeMouseDown on press and before any movement, so a click still selects', () => {
    const { nodeEl, store, onNodeMouseDown, onDragStart } = harness({ state: { nodeDragThreshold: 5 } });

    press(nodeEl, 10, 10);

    expect(onNodeMouseDown).toHaveBeenCalledTimes(1);
    expect(onDragStart).not.toHaveBeenCalled();
    expect(store.state.dragging).toBe(false);
  });

  it('starts the drag on press when the threshold is zero', () => {
    const { nodeEl, store, onNodeMouseDown, onDragStart, onDrag } = harness({ state: { nodeDragThreshold: 0 } });

    nodeEl.setPointerCapture = jest.fn();
    press(nodeEl, 10, 10);

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(store.state.dragging).toBe(true);
    expect(nodeEl.setPointerCapture).toHaveBeenCalledWith(1);
    // Selection has to land before the drag callbacks see the gesture.
    expect(onNodeMouseDown.mock.invocationCallOrder[0]).toBeLessThan(onDragStart.mock.invocationCallOrder[0]);
    // The press itself moves nothing, so no position change is emitted yet.
    expect(onDrag).not.toHaveBeenCalled();
  });

  it('stays a click until the pointer travels past the threshold', () => {
    const { nodeEl, store, onDragStart, onDrag } = harness({ state: { nodeDragThreshold: 5 } });

    press(nodeEl, 100, 100);
    move(nodeEl, 103, 100);

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDrag).not.toHaveBeenCalled();
    expect(store.state.dragging).toBe(false);

    move(nodeEl, 110, 100);

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenCalledTimes(1);
    expect(store.state.dragging).toBe(true);
  });

  it('measures the threshold in pane pixels, so zoom does not change when a drag starts', () => {
    for (const zoom of [1, 4]) {
      const { nodeEl, onDragStart } = harness({ state: { nodeDragThreshold: 5, transform: [0, 0, zoom] } });

      press(nodeEl, 100, 100);
      move(nodeEl, 103, 100);

      expect(onDragStart).not.toHaveBeenCalled();

      /*
       * 10 pane pixels. At zoom 4 that is only 2.5 flow units, so a
       * threshold measured in flow units would never fire here.
       */
      move(nodeEl, 110, 100);

      expect(onDragStart).toHaveBeenCalledTimes(1);
    }
  });

  it('drops a move that leaves the snapped position unchanged', () => {
    const { nodeEl, onDrag } = harness({
      state: { nodeDragThreshold: 0, snapToGrid: true, snapGrid: [15, 15] },
    });

    press(nodeEl, 100, 100);
    move(nodeEl, 103, 100);

    expect(onDrag).not.toHaveBeenCalled();

    move(nodeEl, 120, 100);

    expect(onDrag).toHaveBeenCalledTimes(1);

    const changes = onDrag.mock.calls[0][1];

    expect(changes).toEqual([{ id: 'a', type: 'position', position: { x: 15, y: 0 }, dragging: true }]);
  });

  it('emits one position change per dragged node, following the pointer offset', () => {
    const { nodeEl, onDrag } = harness({ state: { nodeDragThreshold: 0 } });

    press(nodeEl, 10, 10);
    move(nodeEl, 40, 30);

    expect(onDrag).toHaveBeenCalledTimes(1);

    const [event, changes, node, nodes] = onDrag.mock.calls[0];

    expect(event.type).toBe('pointermove');
    expect(changes).toEqual([{ id: 'a', type: 'position', position: { x: 30, y: 20 }, dragging: true }]);
    expect(node.id).toBe('a');
    expect(node.position).toEqual({ x: 30, y: 20 });
    expect(nodes).toHaveLength(1);
  });

  it('keeps the relative offset between two dragged nodes', () => {
    const { nodeEl, onDrag } = harness({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, measured, selected: true },
        { id: 'b', position: { x: 100, y: 50 }, measured, selected: true },
      ],
      state: { nodeDragThreshold: 0 },
    });

    press(nodeEl, 10, 10);
    move(nodeEl, 40, 30);

    const changes = onDrag.mock.calls[0][1];

    expect(changes).toEqual([
      { id: 'a', type: 'position', position: { x: 30, y: 20 }, dragging: true },
      { id: 'b', type: 'position', position: { x: 130, y: 70 }, dragging: true },
    ]);
    // The gap the user saw before the drag is the gap they see during it.
    expect(changes[1].position.x - changes[0].position.x).toBe(100);
    expect(changes[1].position.y - changes[0].position.y).toBe(50);
  });

  it('fires onDragStop with dragging false and clears the store flag', () => {
    const { nodeEl, store, onDragStop } = harness({ state: { nodeDragThreshold: 0 } });

    press(nodeEl, 10, 10);
    move(nodeEl, 40, 30);
    release(nodeEl, 40, 30);

    expect(onDragStop).toHaveBeenCalledTimes(1);

    const [, changes, node] = onDragStop.mock.calls[0];

    expect(changes).toEqual([{ id: 'a', type: 'position', position: { x: 30, y: 20 }, dragging: false }]);
    expect(node.dragging).toBe(false);
    expect(store.state.dragging).toBe(false);
  });

  it('ends the drag on pointercancel, which the browser fires when the gesture is stolen', () => {
    const { nodeEl, store, drag, onDragStop } = harness({ state: { nodeDragThreshold: 0 } });

    press(nodeEl, 10, 10);
    move(nodeEl, 40, 30);
    nodeEl.dispatchEvent(pointerEvent('pointercancel', { x: 40, y: 30 }));

    expect(onDragStop).toHaveBeenCalledTimes(1);
    expect(store.state.dragging).toBe(false);
    expect(drag.isDragging).toBe(false);
  });

  it('reports isDragging for the span of the gesture', () => {
    const { nodeEl, drag } = harness({ state: { nodeDragThreshold: 0 } });

    expect(drag.isDragging).toBe(false);

    press(nodeEl, 10, 10);

    expect(drag.isDragging).toBe(true);

    release(nodeEl, 10, 10);

    expect(drag.isDragging).toBe(false);
  });

  it('ignores moves and releases belonging to a different pointer', () => {
    const { nodeEl, store, onDrag, onDragStop } = harness({ state: { nodeDragThreshold: 0 } });

    press(nodeEl, 10, 10, { pointerId: 1 });

    // A second finger elsewhere on the node must not drive this gesture.
    move(nodeEl, 300, 300, { pointerId: 2 });
    release(nodeEl, 300, 300, { pointerId: 2 });

    expect(onDrag).not.toHaveBeenCalled();
    expect(onDragStop).not.toHaveBeenCalled();
    expect(store.state.dragging).toBe(true);

    move(nodeEl, 40, 30, { pointerId: 1 });

    expect(onDrag).toHaveBeenCalledTimes(1);
  });

  it('emits nothing for a gesture on a node that nothing made draggable', () => {
    const { nodeEl, onDragStart, onDrag, onDragStop } = harness({
      nodes: [{ id: 'a', position: { x: 0, y: 0 }, measured, draggable: false }],
      state: { nodeDragThreshold: 0 },
    });

    press(nodeEl, 10, 10);
    move(nodeEl, 40, 30);
    release(nodeEl, 40, 30);

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDrag).not.toHaveBeenCalled();
    expect(onDragStop).not.toHaveBeenCalled();
  });

  it('does not start when the store has no pane to measure the gesture against', () => {
    const { nodeEl, store, onNodeMouseDown } = harness({ state: { nodeDragThreshold: 0, domNode: null } });

    press(nodeEl, 10, 10);

    expect(onNodeMouseDown).not.toHaveBeenCalled();
    expect(store.state.dragging).toBe(false);
  });

  it('ignores a second press before the drag starts, without breaking the first gesture', () => {
    const { nodeEl, onNodeMouseDown, onDragStart, onDrag } = harness({ state: { nodeDragThreshold: 5 } });

    press(nodeEl, 100, 100, { pointerId: 1 });
    press(nodeEl, 300, 300, { pointerId: 2 });

    expect(onNodeMouseDown).toHaveBeenCalledTimes(1);

    // The original pointer still owns the gesture and can still start it.
    move(nodeEl, 110, 100, { pointerId: 1 });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDrag).toHaveBeenCalledTimes(1);
  });

  it('does not fire onDragStop for a press that never crossed the threshold', () => {
    const { nodeEl, store, onDragStart, onDragStop } = harness({ state: { nodeDragThreshold: 5 } });

    press(nodeEl, 100, 100);
    release(nodeEl, 100, 100);

    expect(onDragStart).not.toHaveBeenCalled();
    expect(onDragStop).not.toHaveBeenCalled();
    expect(store.state.dragging).toBe(false);
  });

  it('abandons the gesture when a second finger lands on the node mid-drag', () => {
    const { nodeEl, store, onDrag, onDragStop } = harness({ state: { nodeDragThreshold: 0 } });

    press(nodeEl, 10, 10, { pointerId: 1 });
    move(nodeEl, 40, 30, { pointerId: 1 });

    expect(onDrag).toHaveBeenCalledTimes(1);

    // A real second finger: its own pointerId, landing while the drag is live.
    press(nodeEl, 300, 300, { pointerId: 2 });
    move(nodeEl, 80, 30, { pointerId: 1 });

    expect(onDrag).toHaveBeenCalledTimes(1);

    release(nodeEl, 80, 30, { pointerId: 1 });

    /*
     * The gesture ends where it was abandoned: the move after the second
     * finger would have put the node at x:70, and must not be committed.
     */
    expect(onDragStop.mock.calls[0][1]).toEqual([
      { id: 'a', type: 'position', position: { x: 30, y: 20 }, dragging: false },
    ]);
    expect(store.state.dragging).toBe(false);
  });

  it('stops updating when the dragged node is deleted mid-gesture', () => {
    const { nodeEl, store, onDrag } = harness({ state: { nodeDragThreshold: 0 } });

    press(nodeEl, 10, 10);
    move(nodeEl, 40, 30);

    expect(onDrag).toHaveBeenCalledTimes(1);

    store.setNodes([]);

    // Applying positions to a node that no longer exists would throw.
    expect(() => move(nodeEl, 80, 30)).not.toThrow();
    expect(onDrag).toHaveBeenCalledTimes(1);
  });

  it('removes its listeners on destroy, idempotently', () => {
    const { nodeEl, drag, onNodeMouseDown } = harness({ state: { nodeDragThreshold: 0 } });

    drag.destroy();
    press(nodeEl, 10, 10);

    expect(onNodeMouseDown).not.toHaveBeenCalled();

    expect(() => drag.destroy()).not.toThrow();
    press(nodeEl, 20, 20);

    expect(onNodeMouseDown).not.toHaveBeenCalled();
  });

  describe('auto-pan', () => {
    let frames;
    let nextFrameId;
    let realRaf;
    let realCancelRaf;

    /** Run every frame callback scheduled so far, once. */
    function runFrames() {
      const pending = Array.from(frames.values());

      frames.clear();
      pending.forEach((callback) => callback());
    }

    beforeEach(() => {
      frames = new Map();
      nextFrameId = 0;
      realRaf = global.requestAnimationFrame;
      realCancelRaf = global.cancelAnimationFrame;

      global.requestAnimationFrame = jest.fn((callback) => {
        nextFrameId += 1;
        frames.set(nextFrameId, callback);

        return nextFrameId;
      });
      global.cancelAnimationFrame = jest.fn((id) => frames.delete(id));
    });

    afterEach(() => {
      global.requestAnimationFrame = realRaf;
      global.cancelAnimationFrame = realCancelRaf;
    });

    function autoPanHarness() {
      const panBy = jest.fn();

      return {
        panBy,
        ...harness({
          state: { nodeDragThreshold: 0, autoPanOnNodeDrag: true, panZoom: { panBy } },
        }),
      };
    }

    it('pans away from the edge the pointer sits near', () => {
      const { nodeEl, panBy } = autoPanHarness();

      press(nodeEl, 10, 300);
      runFrames();

      expect(panBy).toHaveBeenCalledTimes(1);

      const delta = panBy.mock.calls[0][0];

      // Pointer 30px inside the 40px left band: positive dx pushes content right.
      expect(delta.x).toBeGreaterThan(0);
      expect(delta).toEqual({ x: 11.25, y: 0 });
    });

    it('recomputes node positions against the panned transform, so the node does not drift', () => {
      const panBy = jest.fn();
      const { nodeEl, store, onDrag } = harness({
        state: { nodeDragThreshold: 0, autoPanOnNodeDrag: true, panZoom: { panBy } },
      });

      panBy.mockImplementation(({ x, y }) => {
        const [tx, ty, k] = store.state.transform;

        store.setTransform([tx + x, ty + y, k]);

        return true;
      });

      press(nodeEl, 10, 300);
      runFrames();

      /*
       * The pointer never moved, but the viewport did: the node has to follow
       * the cursor in flow space rather than stay pinned to the old transform.
       */
      expect(onDrag).toHaveBeenCalledTimes(1);
      expect(onDrag.mock.calls[0][1]).toEqual([
        { id: 'a', type: 'position', position: { x: -11.25, y: 0 }, dragging: true },
      ]);
    });

    it('does not pan while the pointer is in the middle of the pane', () => {
      const { nodeEl, panBy } = autoPanHarness();

      press(nodeEl, 400, 300);
      runFrames();

      expect(panBy).not.toHaveBeenCalled();
    });

    it('gives a selection-rectangle drag no threshold and no auto-pan', () => {
      const panBy = jest.fn();
      const { nodeEl, onDragStart } = harness({
        state: { nodeDragThreshold: 5, autoPanOnNodeDrag: true, panZoom: { panBy } },
        params: { nodeId: undefined, isSelectionRect: true },
      });

      press(nodeEl, 10, 300);

      // The rectangle tracks the pointer from the first pixel, and the pane
      // must not also slide under it.
      expect(onDragStart).toHaveBeenCalledTimes(1);
      expect(global.requestAnimationFrame).not.toHaveBeenCalled();

      runFrames();

      expect(panBy).not.toHaveBeenCalled();
    });

    it('stops the frame loop on pointerup', () => {
      const { nodeEl, panBy } = autoPanHarness();

      press(nodeEl, 10, 300);
      runFrames();

      expect(panBy).toHaveBeenCalledTimes(1);

      release(nodeEl, 10, 300);

      expect(global.cancelAnimationFrame).toHaveBeenCalled();

      runFrames();

      expect(panBy).toHaveBeenCalledTimes(1);
    });
  });
});
