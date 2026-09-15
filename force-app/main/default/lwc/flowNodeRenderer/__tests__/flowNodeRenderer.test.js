import { createElement } from 'lwc';
import FlowNodeRenderer from 'c/flowNodeRenderer';
import FlowDefaultNode from 'c/flowDefaultNode';
import { createFlowStore } from 'c/flowStore';

// The drag kernel is exercised by its own suite; the node layer only needs it not to touch the DOM.
jest.mock('c/flowDrag', () => ({ createDrag: jest.fn(() => ({ destroy: jest.fn() })) }));

function makeStore(overrides = {}) {
  return createFlowStore({ nodeTypes: { default: FlowDefaultNode }, ...overrides });
}

function render(store) {
  const element = createElement('c-flow-node-renderer', { is: FlowNodeRenderer });
  element.store = store;
  element.flowId = 'flow-1';
  document.body.appendChild(element);
  return element;
}

function wrappers(element) {
  return Array.from(element.shadowRoot.querySelectorAll('c-flow-node-wrapper'));
}

function renderedIds(element) {
  return wrappers(element).map((wrapper) => wrapper.nodeId);
}

/*
 * A node the culling test can place precisely. Both a size and declared handles are needed:
 * `getNodesInside` force-renders any node whose `handleBounds` is still missing, and
 * `adoptUserNodes` only fills `handleBounds` from `handles`.
 */
function measuredNode(id, x, y) {
  return {
    id,
    position: { x, y },
    data: {},
    width: 50,
    height: 50,
    measured: { width: 50, height: 50 },
    handles: [],
  };
}

describe('c-flow-node-renderer', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('node list', () => {
    it('renders one wrapper per node, in lookup order', () => {
      const store = makeStore();
      store.setNodes([
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 0, y: 0 }, data: {} },
        { id: 'c', position: { x: 0, y: 0 }, data: {} },
      ]);

      expect(renderedIds(render(store))).toEqual(['a', 'b', 'c']);
    });

    it('hands each wrapper the store and the flow id', () => {
      const store = makeStore();
      store.setNodes([{ id: 'a', position: { x: 0, y: 0 }, data: {} }]);

      const [wrapper] = wrappers(render(store));

      expect(wrapper.store).toBe(store);
      expect(wrapper.flowId).toBe('flow-1');
    });

    it('skips a hidden node', () => {
      const store = makeStore();
      store.setNodes([
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 0, y: 0 }, data: {}, hidden: true },
      ]);

      expect(renderedIds(render(store))).toEqual(['a']);
    });

    it('adds and removes wrappers as the graph changes', async () => {
      const store = makeStore();
      store.setNodes([{ id: 'a', position: { x: 0, y: 0 }, data: {} }]);
      const element = render(store);

      store.setNodes([
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 0, y: 0 }, data: {} },
      ]);
      await Promise.resolve();
      expect(renderedIds(element)).toEqual(['a', 'b']);

      store.setNodes([{ id: 'b', position: { x: 0, y: 0 }, data: {} }]);
      await Promise.resolve();
      expect(renderedIds(element)).toEqual(['b']);
    });

    it('does not rebuild the list when a node merely moves', async () => {
      const store = makeStore();
      store.setNodes([{ id: 'a', position: { x: 0, y: 0 }, data: {} }]);
      const element = render(store);
      const before = wrappers(element)[0];

      store.setNodes([{ id: 'a', position: { x: 40, y: 40 }, data: {} }]);
      await Promise.resolve();

      // The id list is shallow-compared, so an unchanged list must not re-create anything.
      expect(wrappers(element)[0]).toBe(before);
    });
  });

  describe('keying', () => {
    it('moves the existing elements when the node order changes', async () => {
      const store = makeStore();
      store.setNodes([
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 0, y: 0 }, data: {} },
        { id: 'c', position: { x: 0, y: 0 }, data: {} },
      ]);
      const element = render(store);
      const [first, second, third] = wrappers(element);

      store.setNodes([
        { id: 'c', position: { x: 0, y: 0 }, data: {} },
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 0, y: 0 }, data: {} },
      ]);
      await Promise.resolve();

      /*
       * Keyed by node id, so reordering reorders the very same elements. Keyed by index it
       * would instead keep the elements in place and re-point them at different nodes, which
       * would throw away each node's measurement and drag controller.
       */
      expect(renderedIds(element)).toEqual(['c', 'a', 'b']);
      expect(wrappers(element)).toEqual([third, first, second]);
    });

    it('keeps the surviving elements when a node is removed from the middle', async () => {
      const store = makeStore();
      store.setNodes([
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'b', position: { x: 0, y: 0 }, data: {} },
        { id: 'c', position: { x: 0, y: 0 }, data: {} },
      ]);
      const element = render(store);
      const [first, , third] = wrappers(element);

      store.setNodes([
        { id: 'a', position: { x: 0, y: 0 }, data: {} },
        { id: 'c', position: { x: 0, y: 0 }, data: {} },
      ]);
      await Promise.resolve();

      expect(wrappers(element)).toEqual([first, third]);
    });
  });

  describe('culling', () => {
    it('renders everything when onlyRenderVisibleElements is off', () => {
      const store = makeStore();
      store.setDimensions(200, 200);
      store.setNodes([measuredNode('inside', 0, 0), measuredNode('outside', 5000, 5000)]);

      expect(renderedIds(render(store))).toEqual(['inside', 'outside']);
    });

    it('drops a measured node outside the pane when culling is on', () => {
      const store = makeStore({ onlyRenderVisibleElements: true });
      store.setDimensions(200, 200);
      store.setNodes([measuredNode('inside', 0, 0), measuredNode('outside', 5000, 5000)]);

      expect(renderedIds(render(store))).toEqual(['inside']);
    });

    it('keeps an unmeasured node even when it is outside the pane', () => {
      const store = makeStore({ onlyRenderVisibleElements: true });
      store.setDimensions(200, 200);
      store.setNodes([
        measuredNode('inside', 0, 0),
        // No measurement yet: it must render once or it can never gain one.
        { id: 'fresh', position: { x: 5000, y: 5000 }, data: {} },
      ]);

      expect(renderedIds(render(store))).toEqual(['inside', 'fresh']);
    });

    it('re-culls when the viewport pans', async () => {
      const store = makeStore({ onlyRenderVisibleElements: true });
      store.setDimensions(200, 200);
      store.setNodes([measuredNode('inside', 0, 0), measuredNode('far', 400, 0)]);
      const element = render(store);

      expect(renderedIds(element)).toEqual(['inside']);

      store.setTransform([-400, 0, 1]);
      await Promise.resolve();

      expect(renderedIds(element)).toEqual(['far']);
    });
  });

  describe('events', () => {
    it.each([
      'nodeclick',
      'nodedoubleclick',
      'nodecontextmenu',
      'nodemouseenter',
      'nodemouseleave',
      'nodemeasured',
      'nodedragstart',
      'nodedrag',
      'nodedragstop',
      'nodemove',
      'connectstart',
    ])('re-dispatches %s unchanged', (name) => {
      const store = makeStore();
      store.setNodes([{ id: 'a', position: { x: 0, y: 0 }, data: {} }]);
      const element = render(store);
      const listener = jest.fn();
      element.addEventListener(name, listener);
      const detail = { id: 'a', marker: name };

      wrappers(element)[0].dispatchEvent(new CustomEvent(name, { detail }));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toBe(detail);
      expect(listener.mock.calls[0][0].type).toBe(name);
    });

    it('keeps forwarded events inside the flow', () => {
      const store = makeStore();
      store.setNodes([{ id: 'a', position: { x: 0, y: 0 }, data: {} }]);
      const element = render(store);
      const listener = jest.fn();
      element.addEventListener('nodeclick', listener);

      wrappers(element)[0].dispatchEvent(new CustomEvent('nodeclick', { detail: { id: 'a' } }));

      const event = listener.mock.calls[0][0];
      expect(event.bubbles).toBe(false);
      expect(event.composed).toBe(false);
    });
  });

  describe('teardown', () => {
    it('releases the store subscription on disconnect', () => {
      const store = makeStore();
      const realSubscribe = store.subscribe.bind(store);
      const unsubscribes = [];
      jest.spyOn(store, 'subscribe').mockImplementation((selector, callback, options) => {
        const unsubscribe = jest.fn(realSubscribe(selector, callback, options));
        unsubscribes.push(unsubscribe);
        return unsubscribe;
      });

      const element = render(store);
      document.body.removeChild(element);

      expect(unsubscribes).toHaveLength(1);
      expect(unsubscribes[0]).toHaveBeenCalledTimes(1);
    });

    it('renders an empty layer without a store', () => {
      const element = createElement('c-flow-node-renderer', { is: FlowNodeRenderer });

      expect(() => document.body.appendChild(element)).not.toThrow();
      expect(element.shadowRoot.querySelector('.flow__nodes')).not.toBeNull();
      expect(wrappers(element)).toHaveLength(0);
    });
  });
});
