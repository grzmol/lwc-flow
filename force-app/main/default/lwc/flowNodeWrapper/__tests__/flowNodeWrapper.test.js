import { createElement } from 'lwc';
import FlowNodeWrapper from 'c/flowNodeWrapper';
import FlowDefaultNode from 'c/flowDefaultNode';
import FlowInputNode from 'c/flowInputNode';
import { createFlowStore } from 'c/flowStore';
import { createDrag } from 'c/flowDrag';

/*
 * The drag kernel is exercised by its own suite; here only the wiring matters, so `createDrag` is
 * replaced by a recorder. Everything else - store, math, DOM readers - runs for real.
 */
const mockDragInstances = [];
jest.mock('c/flowDrag', () => ({
  createDrag: jest.fn((params) => {
    const instance = { params, destroy: jest.fn() };
    mockDragInstances.push(instance);
    return instance;
  }),
}));

const NODE_WIDTH = 150;
const NODE_HEIGHT = 40;
const HANDLE_SIZE = 6;

/** jsdom lays nothing out, so offset sizes are faked per element kind. */
function stubLayout() {
  const size = (dimension) => ({
    configurable: true,
    get() {
      if (this.classList.contains('flow__node')) {
        return dimension === 'width' ? NODE_WIDTH : NODE_HEIGHT;
      }
      return this.classList.contains('flow__handle') ? HANDLE_SIZE : 0;
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', size('width'));
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', size('height'));
}

function makeStore(overrides = {}) {
  return createFlowStore({ nodeTypes: { default: FlowDefaultNode, input: FlowInputNode }, ...overrides });
}

function render(store, nodeId = 'n1') {
  const element = createElement('c-flow-node-wrapper', { is: FlowNodeWrapper });
  element.store = store;
  element.nodeId = nodeId;
  element.flowId = 'flow-1';
  document.body.appendChild(element);
  return element;
}

function root(element) {
  return element.shadowRoot.querySelector('.flow__node');
}

/*
 * The node body is instantiated with `lwc:is`, and a dynamically created component has no stable
 * tag name - the jest environment gives every one of them `x-test` - so it is addressed by
 * position instead. It is the root element's only element child.
 */
function nodeBody(element) {
  return root(element).firstElementChild;
}

function listen(element, name) {
  const listener = jest.fn();
  element.addEventListener(name, listener);
  return listener;
}

describe('c-flow-node-wrapper', () => {
  beforeAll(stubLayout);

  beforeEach(() => {
    mockDragInstances.length = 0;
  });

  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('positioning', () => {
    it('translates the root element to the absolute position', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 12, y: 34 }, data: {} }]);

      const element = render(store);
      const node = store.getInternalNode('n1');

      expect(node.internals.positionAbsolute).toEqual({ x: 12, y: 34 });
      expect(root(element).style.transform).toBe('translate(12px,34px)');
    });

    it('follows a parent, so the transform is the absolute and not the relative position', () => {
      const store = makeStore();
      store.setNodes([
        { id: 'g1', position: { x: 100, y: 100 }, width: 400, height: 400, data: {} },
        { id: 'n1', position: { x: 10, y: 20 }, parentId: 'g1', data: {} },
      ]);

      const element = render(store);

      expect(root(element).style.transform).toBe('translate(110px,120px)');
    });

    it('takes z-index from the internal node', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, zIndex: 7, data: {} }]);

      const element = render(store);

      expect(store.getInternalNode('n1').internals.z).toBe(7);
      expect(root(element).style.zIndex).toBe('7');
    });

    it('hides a node that has never been measured', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const element = render(store);

      expect(root(element).style.visibility).toBe('hidden');
    });

    it('shows a node once it has a measurement', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, measured: { width: 150, height: 40 } }]);

      const element = render(store);

      expect(root(element).style.visibility).toBe('visible');
    });

    it('writes an explicit size inline', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, width: 200, height: 80, data: {} }]);

      const element = render(store);

      expect(root(element).style.width).toBe('200px');
      expect(root(element).style.height).toBe('80px');
    });

    it('leaves the size to the stylesheet when the node declares none', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const element = render(store);

      expect(root(element).style.width).toBe('');
      expect(root(element).style.height).toBe('');
    });

    it('serialises a consumer style object', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, style: { backgroundColor: 'red' } }]);

      const element = render(store);

      expect(root(element).style.backgroundColor).toBe('red');
    });

    it('re-renders in place when the node moves', async () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);
      const element = render(store);

      store.setNodes([{ id: 'n1', position: { x: 5, y: 6 }, data: {} }]);
      await Promise.resolve();

      expect(root(element).style.transform).toBe('translate(5px,6px)');
    });
  });

  describe('classes', () => {
    it('marks the node with its type, selectability and draggability', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const classes = root(render(store)).classList;

      expect(classes.contains('flow__node')).toBe(true);
      expect(classes.contains('flow__node-default')).toBe(true);
      expect(classes.contains('selectable')).toBe(true);
      expect(classes.contains('draggable')).toBe(true);
      expect(classes.contains('nopan')).toBe(true);
      expect(classes.contains('selected')).toBe(false);
      expect(classes.contains('parent')).toBe(false);
    });

    it('marks a selected node and a parent node', () => {
      const store = makeStore();
      store.setNodes([
        { id: 'n1', position: { x: 0, y: 0 }, data: {}, selected: true },
        { id: 'n2', position: { x: 0, y: 0 }, parentId: 'n1', data: {} },
      ]);

      const classes = root(render(store)).classList;

      expect(classes.contains('selected')).toBe(true);
      expect(classes.contains('parent')).toBe(true);
    });

    it('drops the interaction classes when the flow disables them', () => {
      const store = makeStore({ nodesDraggable: false, elementsSelectable: false });
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const classes = root(render(store)).classList;

      expect(classes.contains('draggable')).toBe(false);
      expect(classes.contains('selectable')).toBe(false);
    });

    it('carries the node class name through', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, className: 'custom' }]);

      expect(root(render(store)).classList.contains('custom')).toBe(true);
    });
  });

  describe('node type resolution', () => {
    it('renders the registered type for the node', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Go' } }]);

      const element = render(store);

      // The input type has exactly one source handle and no target handle.
      expect(element.shadowRoot.querySelectorAll('.source')).toHaveLength(1);
      expect(element.shadowRoot.querySelectorAll('.target')).toHaveLength(0);
      expect(root(element).classList.contains('flow__node-input')).toBe(true);
    });

    it('falls back to the default type and reports an unknown one', () => {
      const onError = jest.fn();
      const store = makeStore({ onError });
      store.setNodes([{ id: 'n1', type: 'nope', position: { x: 0, y: 0 }, data: {} }]);

      const element = render(store);

      expect(onError).toHaveBeenCalledWith('003', 'Node type "nope" not found. Using fallback type "default".');
      expect(root(element).classList.contains('flow__node-default')).toBe(true);
      expect(element.shadowRoot.querySelectorAll('.source')).toHaveLength(1);
      expect(element.shadowRoot.querySelectorAll('.target')).toHaveLength(1);
    });

    it('reports an unknown type once, not once per render', async () => {
      const onError = jest.fn();
      const store = makeStore({ onError });
      store.setNodes([{ id: 'n1', type: 'nope', position: { x: 0, y: 0 }, data: {} }]);
      render(store);

      store.setNodes([{ id: 'n1', type: 'nope', position: { x: 1, y: 1 }, data: {} }]);
      await Promise.resolve();

      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('spreads the node props onto the node component', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 3, y: 4 }, width: 200, height: 80, data: { label: 'Hi' } }]);

      const element = render(store);
      const body = nodeBody(element);

      expect(body.id).toBe('n1');
      expect(body.type).toBe('default');
      expect(body.data).toEqual({ label: 'Hi' });
      expect(body.isConnectable).toBe(true);
      expect(body.positionAbsoluteX).toBe(3);
      expect(body.positionAbsoluteY).toBe(4);
      expect(body.width).toBe(200);
      expect(body.height).toBe(80);
      expect(body.store).toBe(store);
      expect(body.flowId).toBe('flow-1');
    });

    it('renders nothing for a hidden node', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, hidden: true }]);

      expect(root(render(store))).toBeNull();
    });

    it('renders nothing when the node is not in the lookup', () => {
      expect(root(render(makeStore(), 'missing'))).toBeNull();
    });
  });

  describe('measurement', () => {
    it('reports its size and its handles upward once', async () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const element = createElement('c-flow-node-wrapper', { is: FlowNodeWrapper });
      element.store = store;
      element.nodeId = 'n1';
      element.flowId = 'flow-1';
      const listener = listen(element, 'nodemeasured');
      document.body.appendChild(element);

      expect(listener).toHaveBeenCalledTimes(1);

      const { id, dimensions, handleBounds } = listener.mock.calls[0][0].detail;
      expect(id).toBe('n1');
      expect(dimensions).toEqual({ width: NODE_WIDTH, height: NODE_HEIGHT });
      expect(handleBounds.source).toHaveLength(1);
      expect(handleBounds.target).toHaveLength(1);
      expect(handleBounds.source[0]).toMatchObject({
        id: null,
        type: 'source',
        nodeId: 'n1',
        position: 'bottom',
        width: HANDLE_SIZE,
        height: HANDLE_SIZE,
      });

      store.setNodes([{ id: 'n1', position: { x: 9, y: 9 }, data: {} }]);
      await Promise.resolve();

      // A move changes nothing measurable; re-reporting here is what would loop.
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('re-measures when the handle positions change', async () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const element = createElement('c-flow-node-wrapper', { is: FlowNodeWrapper });
      element.store = store;
      element.nodeId = 'n1';
      const listener = listen(element, 'nodemeasured');
      document.body.appendChild(element);

      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, sourcePosition: 'right' }]);
      await Promise.resolve();

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls[1][0].detail.handleBounds.source[0].position).toBe('right');
    });

    it('reports no handles for a type that renders none', () => {
      const store = makeStore({ nodeTypes: { default: FlowDefaultNode, input: FlowInputNode } });
      store.setNodes([{ id: 'n1', type: 'input', position: { x: 0, y: 0 }, data: {} }]);

      const element = createElement('c-flow-node-wrapper', { is: FlowNodeWrapper });
      element.store = store;
      element.nodeId = 'n1';
      const listener = listen(element, 'nodemeasured');
      document.body.appendChild(element);

      expect(listener.mock.calls[0][0].detail.handleBounds.target).toBeNull();
      expect(listener.mock.calls[0][0].detail.handleBounds.source).toHaveLength(1);
    });
  });

  describe('interaction', () => {
    function renderNode(storeOverrides = {}) {
      const store = makeStore(storeOverrides);
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);
      return { store, element: render(store) };
    }

    it('dispatches nodeclick with the node id', () => {
      const { element } = renderNode();
      const listener = listen(element, 'nodeclick');

      root(element).click();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail.id).toBe('n1');
    });

    it('asks the renderer to select on click when the drag path will not', () => {
      const { element } = renderNode({ nodeDragThreshold: 1 });
      const listener = listen(element, 'nodeclick');

      root(element).click();

      expect(listener.mock.calls[0][0].detail.select).toBe(true);
    });

    it('leaves selection to the drag start when the press already selects', () => {
      const { element } = renderNode({ nodeDragThreshold: 0, selectNodesOnDrag: true });
      const listener = listen(element, 'nodeclick');

      root(element).click();

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail.select).toBe(false);
    });

    it.each([
      ['dblclick', 'nodedoubleclick'],
      ['contextmenu', 'nodecontextmenu'],
      ['mouseenter', 'nodemouseenter'],
      ['mouseleave', 'nodemouseleave'],
    ])('turns a %s into %s', (domEvent, flowEvent) => {
      const { element } = renderNode();
      const listener = listen(element, flowEvent);

      // MouseEvent rather than Event: these are real pointer interactions, and
      // @lwc/lwc/prefer-custom-event rejects the bare Event constructor.
      root(element).dispatchEvent(new MouseEvent(domEvent));

      expect(listener.mock.calls[0][0].detail).toEqual({ id: 'n1' });
    });

    it('forwards connectstart from the node body', () => {
      const { element } = renderNode();
      const listener = listen(element, 'connectstart');
      const detail = { nodeId: 'n1', handleId: null, handleType: 'source' };

      nodeBody(element).dispatchEvent(new CustomEvent('connectstart', { detail }));

      expect(listener.mock.calls[0][0].detail).toEqual(detail);
    });

    it('does not let its own events escape the shadow boundary', () => {
      const { element } = renderNode();
      const listener = listen(element, 'nodeclick');

      root(element).click();

      const event = listener.mock.calls[0][0];
      expect(event.bubbles).toBe(false);
      expect(event.composed).toBe(false);
    });
  });

  describe('keyboard', () => {
    function renderSelected(selected) {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, selected }]);
      return render(store);
    }

    it('is focusable and labelled', () => {
      const element = renderSelected(false);

      expect(root(element).getAttribute('tabindex')).toBe('0');
      expect(root(element).getAttribute('role')).toBe('group');
      expect(root(element).getAttribute('aria-label')).toBe(
        'Press enter or space to select a node. Press delete to remove it and escape to cancel.'
      );
    });

    it('is not focusable when the flow says nodes are not', () => {
      const store = makeStore({ nodesFocusable: false });
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      expect(root(render(store)).getAttribute('tabindex')).toBeNull();
    });

    it.each(['Enter', ' '])('selects on %s', (key) => {
      const element = renderSelected(false);
      const listener = listen(element, 'nodeclick');

      root(element).dispatchEvent(new KeyboardEvent('keydown', { key }));

      expect(listener.mock.calls[0][0].detail).toEqual({ id: 'n1', select: true, unselect: false });
    });

    it('deselects on Escape', () => {
      const element = renderSelected(true);
      const listener = listen(element, 'nodeclick');

      root(element).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(listener.mock.calls[0][0].detail).toEqual({ id: 'n1', select: false, unselect: true });
    });

    it('moves a selected node with the arrow keys', () => {
      const element = renderSelected(true);
      const listener = listen(element, 'nodemove');

      root(element).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(listener.mock.calls[0][0].detail).toEqual({ id: 'n1', dx: 1, dy: 0 });
    });

    it('moves further while shift is held', () => {
      const element = renderSelected(true);
      const listener = listen(element, 'nodemove');

      root(element).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true }));

      expect(listener.mock.calls[0][0].detail).toEqual({ id: 'n1', dx: 0, dy: -4 });
    });

    it('ignores arrow keys on an unselected node', () => {
      const element = renderSelected(false);
      const listener = listen(element, 'nodemove');

      root(element).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('dragging', () => {
    function renderDraggable() {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {}, dragHandle: '.grip' }]);
      return { store, element: render(store) };
    }

    it('attaches the drag kernel to the root element once', async () => {
      const { store, element } = renderDraggable();

      expect(mockDragInstances).toHaveLength(1);
      expect(mockDragInstances[0].params.domNode).toBe(root(element));
      expect(mockDragInstances[0].params.nodeId).toBe('n1');
      expect(mockDragInstances[0].params.handleSelector).toBe('.grip');
      expect(mockDragInstances[0].params.store).toBe(store);

      store.setNodes([{ id: 'n1', position: { x: 4, y: 4 }, data: {}, dragHandle: '.grip' }]);
      await Promise.resolve();

      expect(createDrag).toHaveBeenCalledTimes(1);
    });

    it('forwards the drag lifecycle and marks the node as dragging', async () => {
      const { element } = renderDraggable();
      const { params } = mockDragInstances[0];
      const start = listen(element, 'nodedragstart');
      const move = listen(element, 'nodedrag');
      const stop = listen(element, 'nodedragstop');
      const changes = [{ id: 'n1', type: 'position', position: { x: 5, y: 5 }, dragging: true }];

      params.onDragStart({}, { id: 'n1' }, [{ id: 'n1' }]);
      await Promise.resolve();

      expect(start.mock.calls[0][0].detail).toEqual({
        id: 'n1',
        changes: [],
        node: { id: 'n1' },
        nodes: [{ id: 'n1' }],
      });
      expect(root(element).classList.contains('dragging')).toBe(true);

      params.onDrag({}, changes, { id: 'n1' }, [{ id: 'n1' }]);
      expect(move.mock.calls[0][0].detail.changes).toBe(changes);

      params.onDragStop({}, changes, { id: 'n1' }, [{ id: 'n1' }]);
      await Promise.resolve();

      expect(stop.mock.calls[0][0].detail.changes).toBe(changes);
      expect(root(element).classList.contains('dragging')).toBe(false);
    });
  });

  describe('teardown', () => {
    it('releases the store subscriptions and the drag instance on disconnect', () => {
      const store = makeStore();
      store.setNodes([{ id: 'n1', position: { x: 0, y: 0 }, data: {} }]);

      const realSubscribe = store.subscribe.bind(store);
      const unsubscribes = [];
      jest.spyOn(store, 'subscribe').mockImplementation((selector, callback, options) => {
        const unsubscribe = jest.fn(realSubscribe(selector, callback, options));
        unsubscribes.push(unsubscribe);
        return unsubscribe;
      });

      const element = render(store);
      const drag = mockDragInstances[0];

      document.body.removeChild(element);

      expect(unsubscribes.length).toBeGreaterThan(0);
      unsubscribes.forEach((unsubscribe) => expect(unsubscribe).toHaveBeenCalledTimes(1));
      expect(drag.destroy).toHaveBeenCalledTimes(1);
    });

    it('survives being rendered without a store', () => {
      const element = createElement('c-flow-node-wrapper', { is: FlowNodeWrapper });
      element.nodeId = 'n1';

      expect(() => {
        document.body.appendChild(element);
        document.body.removeChild(element);
      }).not.toThrow();
    });
  });
});
