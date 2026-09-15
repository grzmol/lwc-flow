import { createElement } from 'lwc';
import FlowGroupNode from 'c/flowGroupNode';
import { createFlowStore } from 'c/flowStore';

function render(props = {}) {
  const element = createElement('c-flow-group-node', { is: FlowGroupNode });
  Object.assign(element, { flowId: 'flow-1', store: createFlowStore(), ...props });
  document.body.appendChild(element);
  return element;
}

describe('c-flow-group-node', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders no handles at all', () => {
    const element = render({ id: 'g1', data: {} });

    expect(element.querySelectorAll('.flow__handle')).toHaveLength(0);
    expect(element.querySelectorAll('.source')).toHaveLength(0);
    expect(element.querySelectorAll('.target')).toHaveLength(0);
  });

  it('draws no content, so a group is only the box the node wrapper paints', () => {
    const element = render({ id: 'g1', data: { label: 'Group A' } });

    // Upstream's GroupNode returns null; the label is accepted but deliberately not rendered.
    expect(element.querySelector('.flow__node-label')).toBeNull();
    expect(element.textContent).toBe('');
  });

  it('renders in light DOM so its group background reaches the node element', () => {
    const element = render({ id: 'g1', data: {} });

    expect(FlowGroupNode.renderMode).toBe('light');
    expect(element.shadowRoot).toBeNull();
  });

  it('accepts the whole nodeProps surface as public properties', () => {
    const store = createFlowStore();
    const element = render({ id: 'g1', data: { label: 'x' }, type: 'group', zIndex: 7, store });

    expect(element.id).toBe('g1');
    expect(element.type).toBe('group');
    expect(element.zIndex).toBe(7);
    expect(element.store).toBe(store);
  });
});
