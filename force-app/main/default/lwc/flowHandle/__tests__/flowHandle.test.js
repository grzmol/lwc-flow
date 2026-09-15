import { createElement } from 'lwc';
import FlowHandle from 'c/flowHandle';
import { createFlowStore } from 'c/flowStore';
import { Position, ConnectionMode } from 'c/flowTypes';

function render(props = {}) {
  const element = createElement('c-flow-handle', { is: FlowHandle });
  Object.assign(element, { store: createFlowStore(), flowId: 'flow-1', nodeId: 'n1', ...props });
  document.body.appendChild(element);
  return element;
}

/** The marker element the light-DOM template renders; this is what measurement finds. */
function marker(element) {
  return element.querySelector('.flow__handle');
}

/** jsdom has no `PointerEvent`; a `MouseEvent` carries everything the handle reads. */
function pointerDown(target, init = {}) {
  const event = new MouseEvent('pointerdown', { button: 0, ...init });
  Object.defineProperty(event, 'pointerType', { value: init.pointerType ?? 'mouse' });
  target.dispatchEvent(event);
}

describe('c-flow-handle', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  describe('light DOM', () => {
    it('renders in light DOM so getHandleBounds can reach the marker', () => {
      // A shadow root here would hide `.source` from the node element's querySelectorAll.
      expect(FlowHandle.renderMode).toBe('light');
    });

    it('exposes the marker as a descendant of the host, not of a shadow root', () => {
      const element = render({ type: 'source' });

      expect(element.shadowRoot).toBeNull();
      expect(element.querySelectorAll('.source')).toHaveLength(1);
      expect(marker(element).parentNode).toBe(element);
    });
  });

  describe('markup', () => {
    it('carries the handle class and the type class', () => {
      const element = render({ type: 'target' });
      const classes = marker(element).classList;

      expect(classes.contains('flow__handle')).toBe(true);
      expect(classes.contains('target')).toBe(true);
      expect(classes.contains('source')).toBe(false);
    });

    it('writes the exact data-id format the connection hit-test queries', () => {
      const element = render({ type: 'source', handleId: 'a' });

      expect(marker(element).getAttribute('data-id')).toBe('flow-1-n1-a-source');
    });

    it('keeps the literal null segment for an unnamed handle', () => {
      const element = render({ type: 'target' });

      expect(marker(element).getAttribute('data-id')).toBe('flow-1-n1-null-target');
      expect(marker(element).getAttribute('data-handleid')).toBeNull();
    });

    it('writes the node id and the position measurement reads back', () => {
      const element = render({ type: 'source', position: Position.Right });
      const el = marker(element);

      expect(el.getAttribute('data-nodeid')).toBe('n1');
      expect(el.getAttribute('data-handlepos')).toBe(Position.Right);
    });

    it('defaults a source to the bottom and a target to the top', () => {
      expect(marker(render({ type: 'source' })).getAttribute('data-handlepos')).toBe(Position.Bottom);
      expect(marker(render({ type: 'target' })).getAttribute('data-handlepos')).toBe(Position.Top);
    });

    it('normalises an unknown type to source', () => {
      const element = render({ type: 'whatever' });

      expect(element.type).toBe('source');
      expect(marker(element).classList.contains('source')).toBe(true);
    });

    it('opts out of node drag and viewport pan', () => {
      const classes = marker(render({ type: 'source' })).classList;

      expect(classes.contains('nodrag')).toBe(true);
      expect(classes.contains('nopan')).toBe(true);
    });

    it('reflects the connectable flags', () => {
      const classes = marker(render({ type: 'source' })).classList;

      expect(classes.contains('connectable')).toBe(true);
      expect(classes.contains('connectablestart')).toBe(true);
      expect(classes.contains('connectableend')).toBe(true);
    });

    it('drops the connectable classes when the flags are false', () => {
      const classes = marker(
        render({ type: 'source', isConnectable: false, isConnectableStart: false, isConnectableEnd: false })
      ).classList;

      expect(classes.contains('connectable')).toBe(false);
      expect(classes.contains('connectablestart')).toBe(false);
      expect(classes.contains('connectableend')).toBe(false);
      expect(classes.contains('connectionindicator')).toBe(false);
    });
  });

  describe('connection state', () => {
    it('adds connectingfrom when the store names this handle as the origin', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'source', handleId: 'a' });

      expect(marker(element).classList.contains('connectingfrom')).toBe(false);

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n1', id: 'a', type: 'source' },
          toHandle: null,
        },
      });
      await Promise.resolve();

      expect(marker(element).classList.contains('connectingfrom')).toBe(true);
    });

    it('leaves connectingfrom off when the origin is a different handle', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'source', handleId: 'a' });

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n1', id: 'b', type: 'source' },
          toHandle: null,
        },
      });
      await Promise.resolve();

      expect(marker(element).classList.contains('connectingfrom')).toBe(false);
    });

    it('adds connectingto and valid when this handle is the accepted endpoint', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'target' });

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n2', id: null, type: 'source' },
          toHandle: { nodeId: 'n1', id: null, type: 'target' },
          isValid: true,
        },
      });
      await Promise.resolve();

      const classes = marker(element).classList;
      expect(classes.contains('connectingto')).toBe(true);
      expect(classes.contains('valid')).toBe(true);
    });

    it('withholds valid when the endpoint is rejected', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'target' });

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n2', id: null, type: 'source' },
          toHandle: { nodeId: 'n1', id: null, type: 'target' },
          isValid: false,
        },
      });
      await Promise.resolve();

      const classes = marker(element).classList;
      expect(classes.contains('connectingto')).toBe(true);
      expect(classes.contains('valid')).toBe(false);
    });

    it('hides the indicator on a same-type handle in strict mode', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'source' });

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n2', id: null, type: 'source' },
          toHandle: null,
        },
      });
      await Promise.resolve();

      expect(marker(element).classList.contains('connectionindicator')).toBe(false);
    });

    it('keeps the indicator on an opposite-type handle in strict mode', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'target' });

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n2', id: null, type: 'source' },
          toHandle: null,
        },
      });
      await Promise.resolve();

      expect(marker(element).classList.contains('connectionindicator')).toBe(true);
    });

    it('allows a same-type handle on another node in loose mode', async () => {
      const store = createFlowStore({ connectionMode: ConnectionMode.Loose });
      const element = render({ store, type: 'source' });

      store.update({
        connection: {
          inProgress: true,
          fromHandle: { nodeId: 'n2', id: null, type: 'source' },
          toHandle: null,
        },
      });
      await Promise.resolve();

      expect(marker(element).classList.contains('connectionindicator')).toBe(true);
    });

    it('reuses the cached class string while its inputs are unchanged', async () => {
      const store = createFlowStore();
      const element = render({ store, type: 'source' });
      const before = marker(element).getAttribute('class');

      store.update({ connection: { inProgress: false } });
      await Promise.resolve();

      expect(marker(element).getAttribute('class')).toBe(before);
    });

    it('releases the store subscription on disconnect', async () => {
      const store = createFlowStore();
      const realSubscribe = store.subscribe.bind(store);
      const unsubscribes = [];
      jest.spyOn(store, 'subscribe').mockImplementation((selector, callback, options) => {
        const unsubscribe = jest.fn(realSubscribe(selector, callback, options));
        unsubscribes.push(unsubscribe);
        return unsubscribe;
      });

      const element = render({ store, type: 'source' });
      document.body.removeChild(element);

      expect(unsubscribes).toHaveLength(1);
      expect(unsubscribes[0]).toHaveBeenCalledTimes(1);
    });
  });

  describe('connectstart', () => {
    it('reports a press with the handle identity', () => {
      const element = render({ type: 'source', handleId: 'a' });
      const listener = jest.fn();
      element.addEventListener('connectstart', listener);

      pointerDown(marker(element));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].detail).toEqual({
        nodeId: 'n1',
        handleId: 'a',
        handleType: 'source',
      });
    });

    it('reports null for an unnamed handle', () => {
      const element = render({ type: 'target' });
      const listener = jest.fn();
      element.addEventListener('connectstart', listener);

      pointerDown(marker(element));

      expect(listener.mock.calls[0][0].detail).toEqual({
        nodeId: 'n1',
        handleId: null,
        handleType: 'target',
      });
    });

    it('stays quiet when the handle may not start a connection', () => {
      const element = render({ type: 'source', isConnectableStart: false });
      const listener = jest.fn();
      element.addEventListener('connectstart', listener);

      pointerDown(marker(element));

      expect(listener).not.toHaveBeenCalled();
    });

    it('stays quiet for a secondary mouse button', () => {
      const element = render({ type: 'source' });
      const listener = jest.fn();
      element.addEventListener('connectstart', listener);

      pointerDown(marker(element), { button: 2 });

      expect(listener).not.toHaveBeenCalled();
    });

    it('accepts a touch press, which carries no meaningful button', () => {
      const element = render({ type: 'source' });
      const listener = jest.fn();
      element.addEventListener('connectstart', listener);

      pointerDown(marker(element), { button: 2, pointerType: 'touch' });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('does not bubble or cross the shadow boundary', () => {
      const element = render({ type: 'source' });
      const listener = jest.fn();
      element.addEventListener('connectstart', listener);

      pointerDown(marker(element));

      const event = listener.mock.calls[0][0];
      expect(event.bubbles).toBe(false);
      expect(event.composed).toBe(false);
    });
  });

  it('warns when it is used outside a node', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render({ type: 'source', nodeId: undefined });

    expect(warn).toHaveBeenCalledWith('Handle: No node id found. Make sure to only use a handle inside a custom node.');
  });
});
