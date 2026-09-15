import { createElement } from 'lwc';
import FlowDefaultNode from 'c/flowDefaultNode';
import { createFlowStore } from 'c/flowStore';
import { Position } from 'c/flowTypes';

function render(props = {}) {
  const element = createElement('c-flow-default-node', { is: FlowDefaultNode });
  Object.assign(element, { flowId: 'flow-1', store: createFlowStore(), ...props });
  document.body.appendChild(element);
  return element;
}

function handles(element) {
  return Array.from(element.querySelectorAll('.flow__handle'));
}

/** jsdom has no `PointerEvent`; a `MouseEvent` carries everything the handle reads. */
function pointerDown(target, init = {}) {
  const event = new MouseEvent('pointerdown', { button: 0, ...init });
  Object.defineProperty(event, 'pointerType', { value: init.pointerType ?? 'mouse' });
  target.dispatchEvent(event);
}

describe('c-flow-default-node', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders the label from data', () => {
    const element = render({ id: 'n1', data: { label: 'Step one' } });

    expect(element.querySelector('.flow__node-label').textContent).toBe('Step one');
  });

  it('renders an empty label when data has none', () => {
    const element = render({ id: 'n1', data: {} });

    expect(element.querySelector('.flow__node-label').textContent).toBe('');
  });

  it('renders one target handle on top and one source handle on the bottom', () => {
    const element = render({ id: 'n1', data: { label: 'x' } });
    const [target, source] = handles(element);

    expect(handles(element)).toHaveLength(2);
    expect(target.classList.contains('target')).toBe(true);
    expect(target.getAttribute('data-handlepos')).toBe(Position.Top);
    expect(source.classList.contains('source')).toBe(true);
    expect(source.getAttribute('data-handlepos')).toBe(Position.Bottom);
  });

  it('honours explicit handle positions', () => {
    const element = render({
      id: 'n1',
      data: {},
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    });
    const [target, source] = handles(element);

    expect(target.getAttribute('data-handlepos')).toBe(Position.Left);
    expect(source.getAttribute('data-handlepos')).toBe(Position.Right);
  });

  it('renders handle markup into the light tree so node measurement can reach it', () => {
    const element = render({ id: 'n1', data: {} });

    expect(FlowDefaultNode.renderMode).toBe('light');
    expect(element.shadowRoot).toBeNull();
    expect(element.querySelectorAll('.source')).toHaveLength(1);
    expect(element.querySelectorAll('.target')).toHaveLength(1);
  });

  it('forwards the node id and flow id into each handle data-id', () => {
    const element = render({ id: 'n1', data: {} });
    const [target, source] = handles(element);

    expect(target.getAttribute('data-nodeid')).toBe('n1');
    expect(target.getAttribute('data-id')).toBe('flow-1-n1-null-target');
    expect(source.getAttribute('data-id')).toBe('flow-1-n1-null-source');
  });

  it('marks handles unconnectable when isConnectable is false', () => {
    const element = render({ id: 'n1', data: {}, isConnectable: false });

    handles(element).forEach((handle) => expect(handle.classList.contains('connectable')).toBe(false));
  });

  it('re-dispatches connectstart from a handle', () => {
    const element = render({ id: 'n1', data: {} });
    const listener = jest.fn();
    element.addEventListener('connectstart', listener);

    pointerDown(handles(element)[1]);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener.mock.calls[0][0].detail).toEqual({
      nodeId: 'n1',
      handleId: null,
      handleType: 'source',
    });
  });

  it('ignores a press with a non-primary mouse button', () => {
    const element = render({ id: 'n1', data: {} });
    const listener = jest.fn();
    element.addEventListener('connectstart', listener);

    pointerDown(handles(element)[1], { button: 2 });

    expect(listener).not.toHaveBeenCalled();
  });
});
