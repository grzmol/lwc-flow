import { createElement } from 'lwc';
import FlowPanel from 'c/flowPanel';

function render(props = {}) {
  const element = createElement('c-flow-panel', { is: FlowPanel });
  Object.assign(element, props);
  document.body.appendChild(element);
  return element;
}

function panelClasses(element) {
  return Array.from(element.shadowRoot.querySelector('div').classList);
}

describe('c-flow-panel', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('defaults to the top-left corner', () => {
    const element = render();

    expect(element.position).toBe('top-left');
    expect(panelClasses(element)).toEqual(expect.arrayContaining(['flow__panel', 'top', 'left']));
  });

  it('carries nopan so a drag on the panel does not pan the flow', () => {
    const element = render({ position: 'bottom-right' });

    expect(panelClasses(element)).toContain('nopan');
  });

  it.each([
    ['top-left', ['top', 'left']],
    ['top-center', ['top', 'center']],
    ['top-right', ['top', 'right']],
    ['bottom-left', ['bottom', 'left']],
    ['bottom-center', ['bottom', 'center']],
    ['bottom-right', ['bottom', 'right']],
  ])('splits %s into one class per part', (position, expected) => {
    const element = render({ position });

    expect(panelClasses(element)).toEqual(['flow__panel', 'nopan', ...expected]);
  });

  it('falls back to top-left for a position it does not know', () => {
    const element = render({ position: 'middle-of-nowhere' });

    expect(element.position).toBe('top-left');
    expect(panelClasses(element)).toEqual(['flow__panel', 'nopan', 'top', 'left']);
  });

  it('appends the consumer class after the position classes', () => {
    const element = render({ position: 'top-right', className: ' flow__controls ' });

    expect(panelClasses(element)).toEqual(['flow__panel', 'nopan', 'top', 'right', 'flow__controls']);
  });

  it('ignores a non-string class', () => {
    const element = render({ className: 42 });

    expect(element.className).toBe('');
    expect(panelClasses(element)).toEqual(['flow__panel', 'nopan', 'top', 'left']);
  });

  it('renders a slot for the panel content', () => {
    const element = render();

    expect(element.shadowRoot.querySelector('div > slot')).not.toBeNull();
  });

  it('re-renders when the position changes after the first paint', () => {
    const element = render({ position: 'top-left' });

    element.position = 'bottom-center';

    return Promise.resolve().then(() => {
      expect(panelClasses(element)).toEqual(['flow__panel', 'nopan', 'bottom', 'center']);
    });
  });
});
