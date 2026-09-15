import { createElement } from 'lwc';
import FlowInputNode from 'c/flowInputNode';
import { createFlowStore } from 'c/flowStore';
import { Position } from 'c/flowTypes';

function render(props = {}) {
  const element = createElement('c-flow-input-node', { is: FlowInputNode });
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

describe('c-flow-input-node', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders the label from data', () => {
    const element = render({ id: 'n1', data: { label: 'Start' } });

    expect(element.querySelector('.flow__node-label').textContent).toBe('Start');
  });

  it('renders exactly one source handle, on the bottom', () => {
    const element = render({ id: 'n1', data: {} });
    const rendered = handles(element);

    expect(rendered).toHaveLength(1);
    expect(rendered[0].classList.contains('source')).toBe(true);
    expect(rendered[0].getAttribute('data-handlepos')).toBe(Position.Bottom);
    expect(element.querySelectorAll('.target')).toHaveLength(0);
  });

  it('honours an explicit source position', () => {
    const element = render({ id: 'n1', data: {}, sourcePosition: Position.Right });

    expect(handles(element)[0].getAttribute('data-handlepos')).toBe(Position.Right);
  });

  it('renders handle markup into the light tree so node measurement can reach it', () => {
    const element = render({ id: 'n1', data: {} });

    expect(FlowInputNode.renderMode).toBe('light');
    expect(element.shadowRoot).toBeNull();
    expect(element.querySelectorAll('.source')).toHaveLength(1);
  });

  it('re-dispatches connectstart from its handle', () => {
    const element = render({ id: 'n1', data: {} });
    const listener = jest.fn();
    element.addEventListener('connectstart', listener);

    pointerDown(handles(element)[0]);

    expect(listener.mock.calls[0][0].detail).toEqual({
      nodeId: 'n1',
      handleId: null,
      handleType: 'source',
    });
  });
});
