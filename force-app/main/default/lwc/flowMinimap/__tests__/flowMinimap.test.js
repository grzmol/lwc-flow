import { createElement } from 'lwc';
import FlowMinimap from 'c/flowMinimap';
import { createFlowStore } from 'c/flowStore';

function flushPromises() {
  return Promise.resolve();
}

/** A store with two measured nodes and a known viewport. */
function seededStore({ transform = [0, 0, 1], width = 400, height = 300, nodes } = {}) {
  const store = createFlowStore();

  store.update({ width, height });
  store.setNodes(
    nodes ?? [
      { id: 'a', position: { x: 0, y: 0 }, measured: { width: 100, height: 50 } },
      { id: 'b', position: { x: 200, y: 100 }, measured: { width: 100, height: 50 } },
    ]
  );
  store.setTransform(transform);

  return store;
}

async function mount(store, props = {}) {
  const element = createElement('c-flow-minimap', { is: FlowMinimap });
  element.store = store;
  Object.assign(element, props);
  document.body.appendChild(element);
  await flushPromises();

  return element;
}

describe('c-flow-minimap', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  describe('viewBox', () => {
    it('fits the union of the node bounds and the viewport', async () => {
      // nodes span 0,0 -> 300,150; viewport at zoom 1 spans 0,0 -> 400,300
      const element = await mount(seededStore());
      const svg = element.shadowRoot.querySelector('svg');
      const [x, y, w, h] = svg.getAttribute('viewBox').split(' ').map(Number);

      /*
       * bounds = union = 0,0,400,300. elementWidth/Height default 200/150,
       * so viewScale = max(400/200, 300/150) = 2, viewWidth/Height =
       * 400/300, offset = offsetScale 5 * 2 = 10.
       */
      expect(x).toBe(0 - (400 - 400) / 2 - 10);
      expect(y).toBe(0 - (300 - 300) / 2 - 10);
      expect(w).toBe(400 + 20);
      expect(h).toBe(300 + 20);
    });

    it('centres the shorter axis when the bounds are not the minimap aspect ratio', async () => {
      const store = seededStore({
        width: 100,
        height: 100,
        nodes: [{ id: 'a', position: { x: 0, y: 0 }, measured: { width: 400, height: 100 } }],
      });
      const element = await mount(store);
      const [, y, , h] = element.shadowRoot.querySelector('svg').getAttribute('viewBox').split(' ').map(Number);

      // Wide bounds, so the height is padded out to keep the 200x150 ratio.
      const viewScale = Math.max(400 / 200, 100 / 150);
      const viewHeight = viewScale * 150;
      const offset = 5 * viewScale;

      expect(y).toBeCloseTo(0 - (viewHeight - 100) / 2 - offset, 6);
      expect(h).toBeCloseTo(viewHeight + offset * 2, 6);
    });

    it('falls back to the viewport alone when every node is hidden', async () => {
      const store = seededStore({
        transform: [-50, -50, 1],
        nodes: [{ id: 'a', position: { x: 9000, y: 9000 }, measured: { width: 10, height: 10 }, hidden: true }],
      });
      const element = await mount(store);
      const [x, y] = element.shadowRoot.querySelector('svg').getAttribute('viewBox').split(' ').map(Number);

      /*
       * The hidden node sits at 9000,9000. If it were unioned in, the
       * viewBox would start near the viewport and stretch to it. Instead
       * the viewBox must be derived from the viewport only, which at
       * transform [-50,-50,1] begins at 50,50.
       */
      expect(x).toBeLessThan(60);
      expect(y).toBeLessThan(60);
    });

    it('recomputes when the viewport moves', async () => {
      const store = seededStore();
      const element = await mount(store);
      const before = element.shadowRoot.querySelector('svg').getAttribute('viewBox');

      store.setTransform([-500, -500, 1]);
      await flushPromises();

      expect(element.shadowRoot.querySelector('svg').getAttribute('viewBox')).not.toBe(before);
    });
  });

  describe('mask', () => {
    it('draws the outer rect then the viewport rect so evenodd cuts a hole', async () => {
      const element = await mount(seededStore());
      const mask = element.shadowRoot.querySelector('.flow__minimap-mask');

      expect(mask.getAttribute('fill-rule')).toBe('evenodd');
      // Two subpaths: the outer frame and the viewport cut-out.
      expect(mask.getAttribute('d').match(/M/g)).toHaveLength(2);
    });

    it('places the cut-out at the viewport in flow coordinates', async () => {
      // transform [-100,-50,2] => viewport starts at 50,25 and is 200x150
      const element = await mount(seededStore({ transform: [-100, -50, 2] }));
      const d = element.shadowRoot.querySelector('.flow__minimap-mask').getAttribute('d');

      expect(d).toContain('M50,25h200v150h-200z');
    });
  });

  describe('nodes', () => {
    it('renders one rect per visible node at its absolute position', async () => {
      const element = await mount(seededStore());
      const rects = element.shadowRoot.querySelectorAll('.flow__minimap-node');

      expect(rects).toHaveLength(2);
      expect(rects[0].getAttribute('x')).toBe('0');
      expect(rects[1].getAttribute('x')).toBe('200');
      expect(rects[1].getAttribute('y')).toBe('100');
      expect(rects[1].getAttribute('width')).toBe('100');
    });

    it('skips hidden nodes and unmeasured nodes', async () => {
      const store = seededStore({
        nodes: [
          { id: 'a', position: { x: 0, y: 0 }, measured: { width: 10, height: 10 } },
          { id: 'b', position: { x: 10, y: 0 }, measured: { width: 10, height: 10 }, hidden: true },
          { id: 'c', position: { x: 20, y: 0 } },
        ],
      });
      const element = await mount(store);

      expect(element.shadowRoot.querySelectorAll('.flow__minimap-node')).toHaveLength(1);
    });

    it('marks a selected node', async () => {
      const store = seededStore({
        nodes: [
          { id: 'a', position: { x: 0, y: 0 }, measured: { width: 10, height: 10 }, selected: true },
          { id: 'b', position: { x: 20, y: 0 }, measured: { width: 10, height: 10 } },
        ],
      });
      const element = await mount(store);
      const rects = element.shadowRoot.querySelectorAll('.flow__minimap-node');

      expect(rects[0].classList.contains('selected')).toBe(true);
      expect(rects[1].classList.contains('selected')).toBe(false);
    });

    it('applies nodeBorderRadius and nodeClassName', async () => {
      const element = await mount(seededStore(), { nodeBorderRadius: 9, nodeClassName: 'custom' });
      const rect = element.shadowRoot.querySelector('.flow__minimap-node');

      expect(rect.getAttribute('rx')).toBe('9');
      expect(rect.classList.contains('custom')).toBe(true);
    });
  });

  describe('interaction', () => {
    function pointer(type, { clientX = 0, clientY = 0, pointerId = 1 } = {}) {
      // jsdom has no PointerEvent constructor.
      const event = new MouseEvent(type, { clientX, clientY, bubbles: true });
      Object.defineProperty(event, 'pointerId', { value: pointerId });

      return event;
    }

    function stubSvgRect(element) {
      const svg = element.shadowRoot.querySelector('svg');
      svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 150 });
      svg.setPointerCapture = jest.fn();
      svg.releasePointerCapture = jest.fn();

      return svg;
    }

    it('reports a click in flow coordinates', async () => {
      const element = await mount(seededStore());
      const svg = stubSvgRect(element);
      const handler = jest.fn();
      element.addEventListener('minimapclick', handler);

      // viewBox is "-10 -10 420 320" for this fixture.
      svg.dispatchEvent(pointer('click', { clientX: 100, clientY: 75 }));

      const detail = handler.mock.calls[0][0].detail;
      expect(detail.x).toBeCloseTo(-10 + (100 / 200) * 420, 6);
      expect(detail.y).toBeCloseTo(-10 + (75 / 150) * 320, 6);
    });

    it('reports a node click with its id and does not also report a map click', async () => {
      const element = await mount(seededStore());
      stubSvgRect(element);
      const mapHandler = jest.fn();
      const nodeHandler = jest.fn();
      element.addEventListener('minimapclick', mapHandler);
      element.addEventListener('minimapnodeclick', nodeHandler);

      element.shadowRoot.querySelector('.flow__minimap-node').dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(nodeHandler.mock.calls[0][0].detail).toEqual({ id: 'a' });
      expect(mapHandler).not.toHaveBeenCalled();
    });

    it('does not pan when pannable is false', async () => {
      const store = seededStore();
      const panBy = jest.fn();
      store.update({ panZoom: { panBy } });
      const element = await mount(store);
      const svg = stubSvgRect(element);

      svg.dispatchEvent(pointer('pointerdown', { clientX: 10, clientY: 10 }));
      svg.dispatchEvent(pointer('pointermove', { clientX: 50, clientY: 50 }));

      expect(panBy).not.toHaveBeenCalled();
    });

    it('pans the viewport opposite to the drag by default', async () => {
      const store = seededStore({ transform: [0, 0, 2] });
      const panBy = jest.fn();
      store.update({ panZoom: { panBy } });
      const element = await mount(store, { pannable: true });
      const svg = stubSvgRect(element);

      svg.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
      svg.dispatchEvent(pointer('pointermove', { clientX: 20, clientY: 0 }));

      // Dragging right must pan the content left, so dx is negative.
      expect(panBy).toHaveBeenCalledTimes(1);
      expect(panBy.mock.calls[0][0].x).toBeLessThan(0);
      // `0 * -1` is `-0`, which is functionally identical here.
      expect(panBy.mock.calls[0][0].y).toBeCloseTo(0, 10);
    });

    it('pans with the drag when inversePan is set', async () => {
      const store = seededStore({ transform: [0, 0, 2] });
      const panBy = jest.fn();
      store.update({ panZoom: { panBy } });
      const element = await mount(store, { pannable: true, inversePan: true });
      const svg = stubSvgRect(element);

      svg.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
      svg.dispatchEvent(pointer('pointermove', { clientX: 20, clientY: 0 }));

      expect(panBy.mock.calls[0][0].x).toBeGreaterThan(0);
    });

    it('stops panning after pointer up', async () => {
      const store = seededStore();
      const panBy = jest.fn();
      store.update({ panZoom: { panBy } });
      const element = await mount(store, { pannable: true });
      const svg = stubSvgRect(element);

      svg.dispatchEvent(pointer('pointerdown', { clientX: 0, clientY: 0 }));
      svg.dispatchEvent(pointer('pointerup', { clientX: 0, clientY: 0 }));
      panBy.mockClear();
      svg.dispatchEvent(pointer('pointermove', { clientX: 40, clientY: 40 }));

      expect(panBy).not.toHaveBeenCalled();
    });

    it('zooms on wheel only when zoomable', async () => {
      const store = seededStore();
      const scaleBy = jest.fn();
      store.update({ panZoom: { scaleBy } });
      const element = await mount(store);
      const svg = stubSvgRect(element);

      svg.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));
      expect(scaleBy).not.toHaveBeenCalled();

      element.zoomable = true;
      await flushPromises();
      element.shadowRoot
        .querySelector('svg')
        .dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));

      // Scrolling up zooms in, so the factor must exceed 1.
      expect(scaleBy).toHaveBeenCalledTimes(1);
      expect(scaleBy.mock.calls[0][0]).toBeGreaterThan(1);
    });
  });

  describe('presentation', () => {
    it('uses the configured aria label and links it to the svg', async () => {
      const element = await mount(seededStore(), { ariaLabel: 'Overview' });
      const svg = element.shadowRoot.querySelector('svg');
      const title = element.shadowRoot.querySelector('title');

      expect(title.textContent).toBe('Overview');
      expect(svg.getAttribute('aria-labelledby')).toBe(title.getAttribute('id'));
    });

    it('falls back to the default aria label', async () => {
      const element = await mount(seededStore());

      expect(element.shadowRoot.querySelector('title').textContent).toBe('Mini Map');
    });

    it('scales maskStrokeWidth by the view scale', async () => {
      // viewScale is 2 for this fixture, so a stroke width of 3 becomes 6.
      const element = await mount(seededStore(), { maskStrokeWidth: 3 });
      const style = element.shadowRoot.querySelector('svg').getAttribute('style');

      expect(style).toContain('--flow-minimap-mask-stroke-width: 6');
    });

    it('passes colour overrides through as custom properties', async () => {
      const element = await mount(seededStore(), { maskColor: 'red', nodeColor: 'blue' });
      const style = element.shadowRoot.querySelector('svg').getAttribute('style');

      expect(style).toContain('--flow-minimap-mask-fill: red');
      expect(style).toContain('--flow-minimap-node-fill: blue');
    });

    it('positions itself from the position property', async () => {
      const element = await mount(seededStore(), { position: 'top-left' });

      expect(element.shadowRoot.querySelector('.flow__minimap--top-left')).not.toBeNull();
    });
  });

  it('releases its store subscription on disconnect', async () => {
    const store = seededStore();
    const element = await mount(store);

    document.body.removeChild(element);

    // A write after removal must neither throw nor reach the detached component.
    expect(() => store.setTransform([-999, -999, 3])).not.toThrow();
  });

  it('renders nothing store-driven when no store is supplied', async () => {
    const element = createElement('c-flow-minimap', { is: FlowMinimap });
    document.body.appendChild(element);
    await flushPromises();

    expect(element.shadowRoot.querySelectorAll('.flow__minimap-node')).toHaveLength(0);
  });
});
