import { createElement } from 'lwc';
import FlowBackground from 'c/flowBackground';
import { createFlowStore } from 'c/flowStore';

function render(props = {}) {
  const element = createElement('c-flow-background', { is: FlowBackground });
  Object.assign(element, props);
  document.body.appendChild(element);
  return element;
}

function pattern(element) {
  return element.shadowRoot.querySelector('pattern');
}

/** Wait for LWC to flush a rerender queued by a store notification. */
function flush() {
  return Promise.resolve();
}

describe('c-flow-background', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders a dots pattern at the identity transform by default', () => {
    const element = render();
    const tile = pattern(element);

    expect(element.variant).toBe('dots');
    expect(tile.getAttribute('width')).toBe('20');
    expect(tile.getAttribute('height')).toBe('20');
    expect(tile.getAttribute('patternUnits')).toBe('userSpaceOnUse');
    expect(element.shadowRoot.querySelector('circle')).not.toBeNull();
  });

  it('scales the tile by the zoom the store reports', () => {
    const store = createFlowStore();
    store.setTransform([0, 0, 2]);
    const element = render({ store, gap: 20 });
    const tile = pattern(element);

    expect(tile.getAttribute('width')).toBe('40');
    expect(tile.getAttribute('height')).toBe('40');
  });

  it('accepts an [x, y] gap pair', () => {
    const store = createFlowStore();
    store.setTransform([0, 0, 1.5]);
    const element = render({ store, gap: [10, 40] });
    const tile = pattern(element);

    expect(tile.getAttribute('width')).toBe('15');
    expect(tile.getAttribute('height')).toBe('60');
  });

  it('falls back to a one-unit tile when the zoom collapses the gap', () => {
    const store = createFlowStore();
    store.setTransform([0, 0, 0]);
    const element = render({ store, gap: 20 });
    const tile = pattern(element);

    expect(tile.getAttribute('width')).toBe('1');
    expect(tile.getAttribute('height')).toBe('1');
  });

  it('offsets the tile origin by the viewport translate, wrapped into one tile', () => {
    const store = createFlowStore();
    store.setTransform([30, -55, 1]);
    const element = render({ store, gap: 20 });
    const tile = pattern(element);

    // 30 % 20 = 10, -55 % 20 = -15
    expect(tile.getAttribute('x')).toBe('10');
    expect(tile.getAttribute('y')).toBe('-15');
    // Half a tile, centring the shape, plus no extra offset.
    expect(tile.getAttribute('patternTransform')).toBe('translate(-10,-10)');
  });

  it('adds the scaled offset property to the pattern transform', () => {
    const store = createFlowStore();
    store.setTransform([0, 0, 2]);
    const element = render({ store, gap: 20, offset: [3, 5] });

    // offset * zoom + tile / 2 => [3*2 + 20, 5*2 + 20]
    expect(pattern(element).getAttribute('patternTransform')).toBe('translate(-26,-30)');
  });

  it('re-offsets the pattern when the viewport pans', async () => {
    const store = createFlowStore();
    const element = render({ store, gap: 20 });

    expect(pattern(element).getAttribute('x')).toBe('0');

    store.setTransform([25, 25, 1]);
    await flush();

    expect(pattern(element).getAttribute('x')).toBe('5');
    expect(pattern(element).getAttribute('y')).toBe('5');
  });

  it('draws dots as a circle of half the scaled size', () => {
    const store = createFlowStore();
    store.setTransform([0, 0, 3]);
    const element = render({ store, variant: 'dots', size: 4 });
    const circle = element.shadowRoot.querySelector('circle');

    // 4 * 3 / 2
    expect(circle.getAttribute('r')).toBe('6');
    expect(circle.getAttribute('cx')).toBe('6');
    expect(circle.getAttribute('cy')).toBe('6');
    expect(circle.getAttribute('class')).toContain('dots');
    expect(element.shadowRoot.querySelector('path')).toBeNull();
  });

  it('draws lines as a cross-hair path spanning the whole tile', () => {
    const element = render({ variant: 'lines', gap: 20, lineWidth: 2 });
    const path = element.shadowRoot.querySelector('path');

    expect(element.shadowRoot.querySelector('circle')).toBeNull();
    expect(path.getAttribute('d')).toBe('M10 0 V20 M0 10 H20');
    expect(path.getAttribute('stroke-width')).toBe('2');
    expect(path.getAttribute('class')).toContain('lines');
  });

  it('sizes the cross path from the size property, not from the gap', () => {
    const element = render({ variant: 'cross', gap: 20 });
    const path = element.shadowRoot.querySelector('path');
    const tile = pattern(element);

    // Default cross size is 6, so the arms span 6 while the tile still steps every 20.
    expect(path.getAttribute('d')).toBe('M3 0 V6 M0 3 H6');
    expect(tile.getAttribute('width')).toBe('20');
    expect(tile.getAttribute('patternTransform')).toBe('translate(-3,-3)');
    expect(path.getAttribute('class')).toContain('cross');
  });

  it('falls back to dots for an unknown variant', () => {
    const element = render({ variant: 'hexagons' });

    expect(element.variant).toBe('dots');
    expect(element.shadowRoot.querySelector('circle')).not.toBeNull();
  });

  it('points the rect fill at the rendered pattern id', () => {
    const element = render();
    const rect = element.shadowRoot.querySelector('rect');

    expect(rect.getAttribute('fill')).toBe(`url(#${pattern(element).getAttribute('id')})`);
  });

  it('suffixes the pattern id so one flow can hold several backgrounds', () => {
    const element = render({ id: 'grid-2' });

    expect(pattern(element).getAttribute('id')).toContain('grid-2');
  });

  it('reads its geometry properties back, and never holds the caller array', () => {
    const gap = [10, 20];
    const offset = [1, 2];
    const element = render({ gap, size: 3, offset, lineWidth: null });

    expect(element.gap).toEqual([10, 20]);
    expect(element.gap).not.toBe(gap);
    expect(element.offset).toEqual([1, 2]);
    expect(element.offset).not.toBe(offset);
    expect(element.size).toBe(3);
    // A null line width falls back to the upstream default rather than erasing the stroke.
    expect(element.lineWidth).toBe(1);
  });

  it('exposes the colour properties as inline custom properties', () => {
    const element = render({ color: '#f00', bgColor: '#eee' });
    const style = element.shadowRoot.querySelector('svg').getAttribute('style');

    expect(style).toContain('--flow-background-pattern-color-props: #f00;');
    expect(style).toContain('--flow-background-color-props: #eee;');
  });

  it('appends the consumer classes to the svg and to the pattern shape', () => {
    const element = render({ className: 'my-bg', patternClassName: 'my-dots' });

    expect(element.shadowRoot.querySelector('svg').getAttribute('class')).toContain('my-bg');
    expect(element.shadowRoot.querySelector('circle').getAttribute('class')).toContain('my-dots');
  });

  it('re-renders when a geometry property changes after the first paint', async () => {
    const element = render({ gap: 20 });

    element.gap = 50;
    await flush();

    expect(pattern(element).getAttribute('width')).toBe('50');
  });

  it('keeps the same pattern element across an equal transform write', async () => {
    const store = createFlowStore();
    const element = render({ store, gap: 20 });
    const before = pattern(element);

    // A fresh but equal array must be filtered by the subscription's shallowArrayEqual.
    store.setTransform([0, 0, 1]);
    await flush();

    expect(pattern(element)).toBe(before);
    expect(before.getAttribute('width')).toBe('20');
  });

  it('renders without a store and stays at the identity transform', () => {
    const element = render({ store: undefined });

    expect(pattern(element).getAttribute('x')).toBe('0');
    expect(pattern(element).getAttribute('width')).toBe('20');
  });

  it('drops its store subscription when it is removed', async () => {
    const store = createFlowStore();
    const deliveries = [];
    const subscribe = store.subscribe.bind(store);
    jest.spyOn(store, 'subscribe').mockImplementation((selector, callback, options) =>
      subscribe(
        selector,
        (value, previous) => {
          deliveries.push(value);
          callback(value, previous);
        },
        options
      )
    );

    const element = render({ store, gap: 20 });
    store.setTransform([25, 25, 1]);
    await flush();

    const before = deliveries.length;
    document.body.removeChild(element);

    // The element is gone: a later store write must neither reach it nor throw.
    expect(() => store.setTransform([100, 100, 4])).not.toThrow();
    await flush();

    expect(deliveries).toHaveLength(before);
    expect(element.shadowRoot.querySelector('pattern').getAttribute('width')).toBe('20');
  });
});
