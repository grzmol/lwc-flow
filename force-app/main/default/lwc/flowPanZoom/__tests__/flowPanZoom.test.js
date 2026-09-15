import { isWrappedWithClass, isRightClickPan, createFilter, createPanZoom } from 'c/flowPanZoom';
import { PanOnScrollMode } from 'c/flowTypes';
import { WHEEL_IDLE_MS } from 'c/flowTransform';

/**
 * xyflow's default: an extent this wide makes `constrain` a provable no-op, so a
 * test that is not about clamping never has to reason about it.
 */
const INFINITE_EXTENT = [
  [-Infinity, -Infinity],
  [Infinity, Infinity],
];

/** jsdom has no PointerEvent, and `pointerId` is the field the kernel keys a gesture on. */
function pointerEvent(type, { x = 0, y = 0, button = 0, pointerId = 1, ctrlKey = false, shiftKey = false } = {}) {
  const event = new MouseEvent(type, {
    clientX: x,
    clientY: y,
    button,
    ctrlKey,
    shiftKey,
    bubbles: true,
    cancelable: true,
  });

  Object.defineProperty(event, 'pointerId', { value: pointerId });
  Object.defineProperty(event, 'isPrimary', { value: true });

  return event;
}

function wheel({ deltaX = 0, deltaY = 0, deltaMode = 0, x = 0, y = 0, ctrlKey = false } = {}) {
  return new WheelEvent('wheel', {
    deltaX,
    deltaY,
    deltaMode,
    clientX: x,
    clientY: y,
    ctrlKey,
    bubbles: true,
    cancelable: true,
  });
}

/**
 * A pane with a declared rect, because jsdom lays nothing out and the kernel
 * subtracts `rect.left`/`rect.top` from every client coordinate.
 */
function makePane() {
  const pane = document.createElement('div');

  pane.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600 });
  pane.setPointerCapture = jest.fn();
  pane.releasePointerCapture = jest.fn();
  document.body.appendChild(pane);

  return pane;
}

function harness(overrides = {}) {
  const pane = makePane();
  const callbacks = {
    onTransformChange: jest.fn(),
    onPanZoomStart: jest.fn(),
    onPanZoom: jest.fn(),
    onPanZoomEnd: jest.fn(),
    onDraggingChange: jest.fn(),
  };
  const panZoom = createPanZoom({
    domNode: pane,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: INFINITE_EXTENT,
    viewport: { x: 0, y: 0, zoom: 1 },
    ...callbacks,
    ...overrides,
  });

  return { pane, panZoom, ...callbacks };
}

/** The flow-space point sitting under a pane coordinate, derived independently of the kernel. */
function flowPointUnder(viewport, paneX, paneY) {
  return [(paneX - viewport.x) / viewport.zoom, (paneY - viewport.y) / viewport.zoom];
}

/** Ancestor chain, standing in for `composedPath` on a hand-built event object. */
function pathOf(element) {
  const path = [];
  let node = element;

  while (node) {
    path.push(node);
    node = node.parentNode;
  }

  return path;
}

function stubEvent(type, props = {}) {
  const target = props.target ?? document.createElement('div');

  return { type, button: 0, ctrlKey: false, ...props, target, composedPath: () => pathOf(target) };
}

function marked(className) {
  const element = document.createElement('div');

  element.classList.add(className);

  return element;
}

afterEach(() => {
  // The skill's prescribed reset; innerHTML is blocked by @lwc/lwc/no-inner-html.
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

describe('c-flow-pan-zoom isWrappedWithClass', () => {
  it('is false when no class name is configured, so an unset option never blocks a gesture', () => {
    const event = stubEvent('pointerdown', { target: marked('nopan') });

    expect(isWrappedWithClass(event, undefined)).toBe(false);
    expect(isWrappedWithClass(event, '')).toBe(false);
  });

  it('is true when the target itself carries the class', () => {
    expect(isWrappedWithClass(stubEvent('wheel', { target: marked('nowheel') }), 'nowheel')).toBe(true);
  });

  it('is true when an ancestor carries the class', () => {
    const wrapper = marked('nopan');
    const inner = document.createElement('button');

    wrapper.appendChild(inner);
    document.body.appendChild(wrapper);

    expect(isWrappedWithClass(stubEvent('pointerdown', { target: inner }), 'nopan')).toBe(true);
  });

  it('is false when nothing in the chain carries the class', () => {
    const wrapper = document.createElement('div');
    const inner = document.createElement('button');

    wrapper.appendChild(inner);
    document.body.appendChild(wrapper);

    expect(isWrappedWithClass(stubEvent('pointerdown', { target: inner }), 'nopan')).toBe(false);
  });

  it('sees a marker outside the shadow root the event came from, which `closest` cannot', () => {
    const wrapper = marked('nopan');
    const host = document.createElement('div');

    document.body.appendChild(wrapper);
    wrapper.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('button');

    shadow.appendChild(inner);

    let composedResult = null;
    let closestResult = null;

    // `composedPath` is only populated during dispatch, so the assertion has to run in a listener.
    inner.addEventListener('pointerdown', (event) => {
      composedResult = isWrappedWithClass(event, 'nopan');
      closestResult = !!event.target.closest('.nopan');
    });

    inner.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));

    expect(composedResult).toBe(true);
    // This is the whole reason composedPath is walked: `closest` stops at the shadow root.
    expect(closestResult).toBe(false);
  });

  it('falls back to `closest` for an event with no composed path', () => {
    const wrapper = marked('nopan');
    const inner = document.createElement('button');

    wrapper.appendChild(inner);
    document.body.appendChild(wrapper);

    expect(isWrappedWithClass({ target: inner }, 'nopan')).toBe(true);
    expect(isWrappedWithClass({ target: document.createElement('div') }, 'nopan')).toBe(false);
  });
});

describe('c-flow-pan-zoom isRightClickPan', () => {
  it('is true only for button 2 when panOnDrag lists button 2', () => {
    expect(isRightClickPan([0, 2], 2)).toBe(true);
  });

  it('is false for a boolean panOnDrag, which cannot opt button 2 in', () => {
    expect(isRightClickPan(true, 2)).toBe(false);
  });

  it('is false for any other button', () => {
    expect(isRightClickPan([0, 2], 0)).toBe(false);
    expect(isRightClickPan([0, 2], 1)).toBe(false);
  });

  it('is false when the array omits button 2', () => {
    expect(isRightClickPan([0, 1], 2)).toBe(false);
  });
});

describe('c-flow-pan-zoom createFilter', () => {
  const ALL_ENABLED = {
    panActivationKeyPressed: false,
    zoomActivationKeyPressed: false,
    zoomOnScroll: true,
    zoomOnPinch: true,
    panOnDrag: true,
    panOnScroll: false,
    zoomOnDoubleClick: true,
    userSelectionActive: false,
    connectionInProgress: false,
  };

  const ALL_DISABLED = {
    ...ALL_ENABLED,
    zoomOnScroll: false,
    zoomOnPinch: false,
    panOnDrag: false,
    panOnScroll: false,
    zoomOnDoubleClick: false,
  };

  it.each(['flow__node', 'flow__edge', 'flow__selection', 'flow__nodesselection'])(
    'allows a middle-button press on .%s even with every interaction disabled',
    (className) => {
      const filter = createFilter(ALL_DISABLED);

      expect(filter(stubEvent('pointerdown', { button: 1, target: marked(className) }))).toBe(true);
    }
  );

  it('allows a middle-button mousedown on a node as well as a pointerdown', () => {
    const filter = createFilter(ALL_DISABLED);

    expect(filter(stubEvent('mousedown', { button: 1, target: marked('flow__node') }))).toBe(true);
  });

  it('rejects a middle-button press on bare pane markup once everything is disabled', () => {
    const filter = createFilter(ALL_DISABLED);

    expect(filter(stubEvent('pointerdown', { button: 1 }))).toBe(false);
  });

  it('rejects every event when no interaction is enabled', () => {
    const filter = createFilter(ALL_DISABLED);

    expect(filter(stubEvent('pointerdown'))).toBe(false);
    expect(filter(stubEvent('wheel'))).toBe(false);
    expect(filter(stubEvent('dblclick'))).toBe(false);
  });

  it('rejects every event while a marquee selection owns the pointer', () => {
    const filter = createFilter({ ...ALL_ENABLED, userSelectionActive: true });

    expect(filter(stubEvent('pointerdown'))).toBe(false);
    expect(filter(stubEvent('wheel'))).toBe(false);
    expect(filter(stubEvent('dblclick'))).toBe(false);
  });

  it('rejects non-wheel events mid-connection but still allows the wheel', () => {
    const filter = createFilter({ ...ALL_ENABLED, connectionInProgress: true });

    expect(filter(stubEvent('pointerdown'))).toBe(false);
    expect(filter(stubEvent('dblclick'))).toBe(false);
    expect(filter(stubEvent('wheel'))).toBe(true);
  });

  it('rejects only the wheel inside a nowheel element', () => {
    const filter = createFilter(ALL_ENABLED);
    const target = marked('nowheel');

    expect(filter(stubEvent('wheel', { target }))).toBe(false);
    expect(filter(stubEvent('pointerdown', { target }))).toBe(true);
  });

  it('honours a custom noWheelClassName instead of the default', () => {
    const filter = createFilter({ ...ALL_ENABLED, noWheelClassName: 'keep-scroll' });

    expect(filter(stubEvent('wheel', { target: marked('keep-scroll') }))).toBe(false);
    expect(filter(stubEvent('wheel', { target: marked('nowheel') }))).toBe(true);
  });

  it('rejects non-wheel events inside a nopan element, but not a zooming wheel', () => {
    const filter = createFilter(ALL_ENABLED);
    const target = marked('nopan');

    expect(filter(stubEvent('pointerdown', { target }))).toBe(false);
    expect(filter(stubEvent('wheel', { target }))).toBe(true);
  });

  it('rejects a wheel inside a nopan element when panOnScroll would pan it', () => {
    const target = marked('nopan');

    expect(createFilter({ ...ALL_ENABLED, panOnScroll: true })(stubEvent('wheel', { target }))).toBe(false);
  });

  it('allows a wheel inside a nopan element when the zoom activation key overrides panOnScroll', () => {
    const filter = createFilter({ ...ALL_ENABLED, panOnScroll: true, zoomActivationKeyPressed: true });

    expect(filter(stubEvent('wheel', { target: marked('nopan') }))).toBe(true);
  });

  it('rejects a ctrl-modified wheel when pinch zoom is off', () => {
    const filter = createFilter({ ...ALL_ENABLED, zoomOnPinch: false });

    expect(filter(stubEvent('wheel', { ctrlKey: true }))).toBe(false);
    expect(filter(stubEvent('wheel'))).toBe(true);
  });

  it('rejects a wheel when neither zoom-on-scroll, pan-on-scroll nor pinch applies', () => {
    const filter = createFilter({ ...ALL_ENABLED, zoomOnScroll: false, panOnScroll: false });

    expect(filter(stubEvent('wheel'))).toBe(false);
    // A ctrl-modified wheel is the pinch gesture, so the same config still allows it.
    expect(filter(stubEvent('wheel', { ctrlKey: true }))).toBe(true);
  });

  it('rejects a pointerdown when panOnDrag is off', () => {
    const filter = createFilter({ ...ALL_ENABLED, panOnDrag: false });

    expect(filter(stubEvent('pointerdown'))).toBe(false);
    expect(filter(stubEvent('mousedown'))).toBe(false);
  });

  it('rejects buttons a panOnDrag array does not list', () => {
    const filter = createFilter({ ...ALL_ENABLED, panOnDrag: [0] });

    expect(filter(stubEvent('pointerdown', { button: 2 }))).toBe(false);
    expect(filter(stubEvent('pointerdown', { button: 0 }))).toBe(true);
    // The same rule has to hold for a legacy mousedown, which upstream still routes here.
    expect(filter(stubEvent('mousedown', { button: 2 }))).toBe(false);
  });

  it('rejects a ctrl-modified drag unless ctrl is the pan activation key', () => {
    expect(createFilter(ALL_ENABLED)(stubEvent('pointerdown', { ctrlKey: true }))).toBe(false);
    expect(
      createFilter({ ...ALL_ENABLED, panActivationKeyPressed: true })(stubEvent('pointerdown', { ctrlKey: true }))
    ).toBe(true);
  });

  it('rejects a button above 1 unless panOnDrag lists it', () => {
    expect(createFilter(ALL_ENABLED)(stubEvent('pointerdown', { button: 2 }))).toBe(false);
    expect(createFilter({ ...ALL_ENABLED, panOnDrag: [2] })(stubEvent('pointerdown', { button: 2 }))).toBe(true);
  });

  it('allows the primary and middle buttons for a boolean panOnDrag', () => {
    const filter = createFilter(ALL_ENABLED);

    expect(filter(stubEvent('pointerdown', { button: 0 }))).toBe(true);
    expect(filter(stubEvent('pointerdown', { button: 1 }))).toBe(true);
  });
});

describe('c-flow-pan-zoom construction', () => {
  it('clamps the initial viewport zoom into the scale extent and emits it once', () => {
    const { onTransformChange } = harness({ viewport: { x: 0, y: 0, zoom: 5 } });

    expect(onTransformChange).toHaveBeenCalledTimes(1);
    expect(onTransformChange).toHaveBeenCalledWith([0, 0, 2]);
  });

  it('clamps an initial viewport below minZoom up to minZoom', () => {
    const { onTransformChange, panZoom } = harness({ viewport: { x: 10, y: 20, zoom: 0.1 } });

    expect(onTransformChange).toHaveBeenCalledWith([10, 20, 0.5]);
    expect(panZoom.getViewport()).toEqual({ x: 10, y: 20, zoom: 0.5 });
  });

  it('caches the pane extent from the measured rect', () => {
    const { panZoom } = harness();

    expect(panZoom.getExtent()).toEqual([
      [0, 0],
      [800, 600],
    ]);
  });

  it('rejects all input until update() has built the filter', () => {
    const { pane, onPanZoomStart, onPanZoom } = harness();

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 150, y: 150 }));

    expect(onPanZoomStart).not.toHaveBeenCalled();
    expect(onPanZoom).not.toHaveBeenCalled();
  });
});

describe('c-flow-pan-zoom viewport reads and writes', () => {
  it('getViewport reflects the current transform', () => {
    const { panZoom } = harness({ viewport: { x: 12, y: -34, zoom: 1.25 } });

    expect(panZoom.getViewport()).toEqual({ x: 12, y: -34, zoom: 1.25 });
  });

  it('syncViewport writes the transform without reporting a user gesture', () => {
    const { panZoom, onTransformChange, onPanZoom, onPanZoomStart } = harness();

    panZoom.syncViewport({ x: 10, y: 20, zoom: 2 });

    expect(panZoom.getViewport()).toEqual({ x: 10, y: 20, zoom: 2 });
    expect(onTransformChange).toHaveBeenLastCalledWith([10, 20, 2]);
    expect(onPanZoom).not.toHaveBeenCalled();
    expect(onPanZoomStart).not.toHaveBeenCalled();
  });

  it('syncViewport with an identical viewport is a no-op', () => {
    const { panZoom, onTransformChange } = harness();

    panZoom.syncViewport({ x: 10, y: 20, zoom: 2 });
    onTransformChange.mockClear();
    panZoom.syncViewport({ x: 10, y: 20, zoom: 2 });

    expect(onTransformChange).not.toHaveBeenCalled();
  });
});

describe('c-flow-pan-zoom drag pan', () => {
  it('translates the viewport by the pointer delta and brackets the gesture once', () => {
    const { pane, panZoom, onPanZoomStart, onPanZoom, onPanZoomEnd, onDraggingChange } = harness();

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));

    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
    expect(onPanZoomStart.mock.calls[0][1]).toEqual({ x: 0, y: 0, zoom: 1 });
    expect(onDraggingChange).toHaveBeenNthCalledWith(1, true);
    expect(pane.setPointerCapture).toHaveBeenCalledWith(1);

    pane.dispatchEvent(pointerEvent('pointermove', { x: 150, y: 130 }));

    expect(onPanZoom).toHaveBeenCalledTimes(1);
    expect(onPanZoom.mock.calls[0][1]).toEqual({ x: 50, y: 30, zoom: 1 });

    pane.dispatchEvent(pointerEvent('pointermove', { x: 160, y: 140 }));

    expect(onPanZoom).toHaveBeenCalledTimes(2);
    expect(panZoom.getViewport()).toEqual({ x: 60, y: 40, zoom: 1 });
    // A drag only translates; the start scale has to survive the whole gesture.
    expect(onPanZoomStart).toHaveBeenCalledTimes(1);

    pane.dispatchEvent(pointerEvent('pointerup', { x: 160, y: 140 }));

    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
    expect(onPanZoomEnd.mock.calls[0][1]).toEqual({ x: 60, y: 40, zoom: 1 });
    expect(onDraggingChange).toHaveBeenNthCalledWith(2, false);
    expect(pane.releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('scales the pan delta by the current zoom so the grab point stays under the cursor', () => {
    const { pane, panZoom } = harness({ viewport: { x: 0, y: 0, zoom: 2 } });

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 140, y: 100 }));

    // The viewport offset is in pane pixels, so it moves by the raw pointer delta.
    expect(panZoom.getViewport()).toEqual({ x: 40, y: 0, zoom: 2 });
  });

  it('ignores a pointermove belonging to a different pointer', () => {
    const { pane, panZoom, onPanZoom } = harness();

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100, pointerId: 1 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 300, y: 300, pointerId: 2 }));

    expect(onPanZoom).not.toHaveBeenCalled();
    expect(panZoom.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });

    // The original pointer still owns the gesture.
    pane.dispatchEvent(pointerEvent('pointermove', { x: 110, y: 100, pointerId: 1 }));

    expect(panZoom.getViewport()).toEqual({ x: 10, y: 0, zoom: 1 });
  });

  it('ignores a pointerup belonging to a different pointer', () => {
    const { pane, panZoom, onPanZoomEnd, onDraggingChange } = harness();

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100, pointerId: 1 }));
    pane.dispatchEvent(pointerEvent('pointerup', { x: 100, y: 100, pointerId: 7 }));

    expect(onPanZoomEnd).not.toHaveBeenCalled();
    expect(onDraggingChange).toHaveBeenCalledTimes(1);
  });

  it('ends the gesture on pointercancel, so a lost pointer cannot leave dragging stuck on', () => {
    const { pane, panZoom, onPanZoomEnd, onDraggingChange } = harness();

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointercancel', { x: 100, y: 100 }));

    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
    expect(onDraggingChange).toHaveBeenNthCalledWith(2, false);
  });

  it('keeps the first pointer when a second one goes down mid-drag', () => {
    const { pane, panZoom, onPanZoomStart } = harness();

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100, pointerId: 1 }));
    pane.dispatchEvent(pointerEvent('pointerdown', { x: 500, y: 500, pointerId: 2 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 120, y: 100, pointerId: 1 }));

    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
    expect(panZoom.getViewport()).toEqual({ x: 20, y: 0, zoom: 1 });
  });

  it('clamps a drag to translateExtent', () => {
    const { pane, panZoom } = harness({
      translateExtent: [
        [0, 0],
        [800, 600],
      ],
    });

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 400, y: 100 }));

    // The flow content exactly fills the pane, so there is no slack to pan into.
    expect(panZoom.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });
  });
});

describe('c-flow-pan-zoom wheel zoom', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('zooms in on a negative deltaY and out on a positive one', () => {
    const zoomedIn = harness();

    zoomedIn.panZoom.update({ zoomOnScroll: true });
    zoomedIn.pane.dispatchEvent(wheel({ deltaY: -100, x: 400, y: 300 }));

    expect(zoomedIn.panZoom.getViewport().zoom).toBeCloseTo(Math.pow(2, 0.2), 10);

    const zoomedOut = harness();

    zoomedOut.panZoom.update({ zoomOnScroll: true });
    zoomedOut.pane.dispatchEvent(wheel({ deltaY: 100, x: 400, y: 300 }));

    expect(zoomedOut.panZoom.getViewport().zoom).toBeCloseTo(Math.pow(2, -0.2), 10);
  });

  it('clamps the zoom to maxZoom and minZoom', () => {
    const zoomIn = harness();

    zoomIn.panZoom.update({ zoomOnScroll: true });
    zoomIn.pane.dispatchEvent(wheel({ deltaY: -100000, x: 400, y: 300 }));

    expect(zoomIn.panZoom.getViewport().zoom).toBe(2);

    const zoomOut = harness();

    zoomOut.panZoom.update({ zoomOnScroll: true });
    zoomOut.pane.dispatchEvent(wheel({ deltaY: 100000, x: 400, y: 300 }));

    expect(zoomOut.panZoom.getViewport().zoom).toBe(0.5);
  });

  it('keeps one gesture bracket when a wheel arrives mid-drag, so end fires exactly once', () => {
    const { pane, panZoom, onPanZoomStart, onPanZoomEnd } = harness();

    panZoom.update({ panOnDrag: true, zoomOnScroll: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(wheel({ deltaY: -50, x: 100, y: 100 }));

    // The wheel joins the drag's gesture rather than opening a second one.
    expect(onPanZoomStart).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(WHEEL_IDLE_MS + 1);

    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);

    pane.dispatchEvent(pointerEvent('pointerup', { x: 100, y: 100 }));

    // The gesture is already closed, so the pointerup must not emit a second end.
    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
  });

  it('keeps the flow point under the cursor fixed, which is the point of the anchor', () => {
    const { pane, panZoom } = harness({ viewport: { x: 50, y: 30, zoom: 1 } });

    panZoom.update({ zoomOnScroll: true });

    const before = flowPointUnder(panZoom.getViewport(), 200, 150);

    pane.dispatchEvent(wheel({ deltaY: -100, x: 200, y: 150 }));

    const after = panZoom.getViewport();

    expect(after.zoom).not.toBe(1);
    expect(flowPointUnder(after, 200, 150)[0]).toBeCloseTo(before[0], 8);
    expect(flowPointUnder(after, 200, 150)[1]).toBeCloseTo(before[1], 8);
  });

  it('holds the first anchor for a continuing flick so the view does not drift under the cursor', () => {
    const { pane, panZoom } = harness({ viewport: { x: 0, y: 0, zoom: 1 } });

    panZoom.update({ zoomOnScroll: true });

    const anchorPoint = flowPointUnder(panZoom.getViewport(), 200, 150);

    pane.dispatchEvent(wheel({ deltaY: -50, x: 200, y: 150 }));
    // The second event reports a moved cursor; the gesture must still zoom about the first anchor.
    pane.dispatchEvent(wheel({ deltaY: -50, x: 600, y: 450 }));

    const after = panZoom.getViewport();

    expect(flowPointUnder(after, 200, 150)[0]).toBeCloseTo(anchorPoint[0], 8);
    expect(flowPointUnder(after, 200, 150)[1]).toBeCloseTo(anchorPoint[1], 8);
  });

  it('treats a quick succession of wheel events as one gesture, ending only after the idle gap', () => {
    const { pane, panZoom, onPanZoomStart, onPanZoom, onPanZoomEnd } = harness();

    panZoom.update({ zoomOnScroll: true });

    pane.dispatchEvent(wheel({ deltaY: -50, x: 400, y: 300 }));
    pane.dispatchEvent(wheel({ deltaY: -50, x: 400, y: 300 }));

    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
    expect(onPanZoom).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(WHEEL_IDLE_MS - 1);

    expect(onPanZoomEnd).not.toHaveBeenCalled();

    jest.advanceTimersByTime(2);

    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
  });

  it('starts a fresh gesture after the idle gap has elapsed', () => {
    const { pane, panZoom, onPanZoomStart, onPanZoomEnd } = harness();

    panZoom.update({ zoomOnScroll: true });

    pane.dispatchEvent(wheel({ deltaY: -50, x: 400, y: 300 }));
    jest.advanceTimersByTime(WHEEL_IDLE_MS + 1);
    pane.dispatchEvent(wheel({ deltaY: -50, x: 400, y: 300 }));
    jest.advanceTimersByTime(WHEEL_IDLE_MS + 1);

    expect(onPanZoomStart).toHaveBeenCalledTimes(2);
    expect(onPanZoomEnd).toHaveBeenCalledTimes(2);
  });

  it('reads a line-mode wheel with the line factor rather than the pixel factor', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ zoomOnScroll: true });
    pane.dispatchEvent(wheel({ deltaY: -4, deltaMode: 1, x: 400, y: 300 }));

    expect(panZoom.getViewport().zoom).toBeCloseTo(Math.pow(2, 0.2), 10);
  });

  it('prevents the page scroll when preventScrolling is on', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ zoomOnScroll: true, preventScrolling: true });

    const event = wheel({ deltaY: -100, x: 400, y: 300 });

    pane.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves the page scroll alone when preventScrolling is off and no ctrl key is held', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ zoomOnScroll: true, preventScrolling: false });

    const event = wheel({ deltaY: -100, x: 400, y: 300 });

    pane.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    // Not preventing the scroll must not stop the zoom itself.
    expect(panZoom.getViewport().zoom).toBeGreaterThan(1);
  });

  it('still prevents a ctrl-modified wheel when preventScrolling is off, because that is a pinch', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ zoomOnScroll: true, zoomOnPinch: true, preventScrolling: false });

    const event = wheel({ deltaY: -100, x: 400, y: 300, ctrlKey: true });

    pane.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores a wheel the filter refuses', () => {
    const { pane, panZoom, onTransformChange, onPanZoomStart } = harness();

    panZoom.update({ zoomOnScroll: false, panOnScroll: false, zoomOnPinch: false, panOnDrag: true });
    onTransformChange.mockClear();
    pane.dispatchEvent(wheel({ deltaY: -100, x: 400, y: 300 }));

    expect(onTransformChange).not.toHaveBeenCalled();
    expect(onPanZoomStart).not.toHaveBeenCalled();
  });
});

describe('c-flow-pan-zoom panOnScroll', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('pans instead of zooming, at the default speed', () => {
    const { pane, panZoom, onPanZoomStart } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false });
    pane.dispatchEvent(wheel({ deltaX: 10, deltaY: 20, x: 400, y: 300 }));

    expect(panZoom.getViewport()).toEqual({ x: -5, y: -10, zoom: 1 });
    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
  });

  it('ignores deltaX in Vertical mode', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false, panOnScrollMode: PanOnScrollMode.Vertical });
    pane.dispatchEvent(wheel({ deltaX: 999, deltaY: 20, x: 400, y: 300 }));

    expect(panZoom.getViewport()).toEqual({ x: 0, y: -10, zoom: 1 });
  });

  it('maps deltaY onto x in Horizontal mode', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false, panOnScrollMode: PanOnScrollMode.Horizontal });
    pane.dispatchEvent(wheel({ deltaX: 999, deltaY: 20, x: 400, y: 300 }));

    expect(panZoom.getViewport()).toEqual({ x: -10, y: 0, zoom: 1 });
  });

  it('scales the pan by panOnScrollSpeed', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false, panOnScrollSpeed: 2 });
    pane.dispatchEvent(wheel({ deltaX: 5, deltaY: 20, x: 400, y: 300 }));

    expect(panZoom.getViewport()).toEqual({ x: -10, y: -40, zoom: 1 });
  });

  it('divides the pan delta by the zoom so a scroll moves the same pane distance at any scale', () => {
    const { pane, panZoom } = harness({ viewport: { x: 0, y: 0, zoom: 2 } });

    panZoom.update({ panOnScroll: true, zoomOnScroll: false });
    pane.dispatchEvent(wheel({ deltaX: 0, deltaY: 20, x: 400, y: 300 }));

    expect(panZoom.getViewport()).toEqual({ x: 0, y: -10, zoom: 2 });
  });

  it('does nothing for a wheel with no delta', () => {
    const { pane, panZoom, onPanZoom, onPanZoomStart } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false });
    pane.dispatchEvent(wheel({ deltaX: 0, deltaY: 0, x: 400, y: 300 }));

    expect(onPanZoom).not.toHaveBeenCalled();
    expect(onPanZoomStart).not.toHaveBeenCalled();
  });

  it('coalesces consecutive pan-scrolls into one gesture', () => {
    const { pane, panZoom, onPanZoomStart, onPanZoomEnd } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false });
    pane.dispatchEvent(wheel({ deltaY: 20, x: 400, y: 300 }));
    pane.dispatchEvent(wheel({ deltaY: 20, x: 400, y: 300 }));

    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
    expect(onPanZoomEnd).not.toHaveBeenCalled();

    jest.advanceTimersByTime(WHEEL_IDLE_MS + 1);

    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
    expect(panZoom.getViewport()).toEqual({ x: 0, y: -20, zoom: 1 });
  });

  it('always prevents the scroll, since the pane consumed it', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false, preventScrolling: false });

    const event = wheel({ deltaY: 20, x: 400, y: 300 });

    pane.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('pinch-zooms on a ctrl-modified wheel even while panOnScroll is on', () => {
    const { pane, panZoom, onPanZoomStart } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false, zoomOnPinch: true });
    pane.dispatchEvent(wheel({ deltaY: -100, x: 400, y: 300, ctrlKey: true }));

    const after = panZoom.getViewport();

    expect(after.zoom).toBeGreaterThan(1);
    // Zooming about the cursor has to shift the offset too; a pure pan would not.
    expect(after.x).toBeLessThan(0);
    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
  });

  it('pans rather than zooming when the zoom activation key is held, which turns panOnScroll off', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnScroll: true, zoomOnScroll: false, zoomActivationKeyPressed: true });
    pane.dispatchEvent(wheel({ deltaY: -100, x: 400, y: 300 }));

    // zoomActivationKeyPressed routes the wheel back to the zoom path.
    expect(panZoom.getViewport().zoom).toBeGreaterThan(1);
  });
});

describe('c-flow-pan-zoom animated transitions', () => {
  let frames;
  let clock;
  let realRaf;
  let realCaf;

  beforeEach(() => {
    frames = [];
    clock = 0;
    realRaf = global.requestAnimationFrame;
    realCaf = global.cancelAnimationFrame;
    global.requestAnimationFrame = (callback) => frames.push(callback);
    global.cancelAnimationFrame = jest.fn();
    jest.spyOn(performance, 'now').mockImplementation(() => clock);
  });

  afterEach(() => {
    global.requestAnimationFrame = realRaf;
    global.cancelAnimationFrame = realCaf;
  });

  /** Run the queued frame as if the browser had called it at `time`. */
  function stepTo(time) {
    clock = time;
    frames.shift()();
  }

  it('double click zooms in by the double-click factor about the cursor', () => {
    const { pane, panZoom, onPanZoomStart, onPanZoom, onPanZoomEnd } = harness({ minZoom: 0.25, maxZoom: 4 });

    panZoom.update({ zoomOnDoubleClick: true });

    const event = new MouseEvent('dblclick', { clientX: 400, clientY: 300, bubbles: true, cancelable: true });

    pane.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(1);

    stepTo(0);
    stepTo(125);

    // Mid-flight the view is between the endpoints, proving this is a tween not a jump.
    expect(onPanZoom).toHaveBeenCalled();
    expect(panZoom.getViewport().zoom).toBeGreaterThan(1);
    expect(panZoom.getViewport().zoom).toBeLessThan(2);

    stepTo(250);

    expect(panZoom.getViewport()).toEqual({ x: -400, y: -300, zoom: 2 });
    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(0);
  });

  it('a shift double click zooms out by the same factor', () => {
    const { pane, panZoom } = harness({ minZoom: 0.25, maxZoom: 4 });

    panZoom.update({ zoomOnDoubleClick: true });
    pane.dispatchEvent(
      new MouseEvent('dblclick', {
        clientX: 400,
        clientY: 300,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      })
    );

    stepTo(0);
    stepTo(250);

    expect(panZoom.getViewport()).toEqual({ x: 200, y: 150, zoom: 0.5 });
  });

  it('does nothing on double click when zoomOnDoubleClick is off', () => {
    const { pane, panZoom, onPanZoomStart } = harness();

    panZoom.update({ zoomOnDoubleClick: false });

    const event = new MouseEvent('dblclick', { clientX: 400, clientY: 300, bubbles: true, cancelable: true });

    pane.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(frames).toHaveLength(0);
    expect(onPanZoomStart).not.toHaveBeenCalled();
    expect(panZoom.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('resolves a superseded transition with false when a pointer interrupts it', async () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnDrag: true });

    const pending = panZoom.scaleTo(2, { duration: 500 });

    expect(frames).toHaveLength(1);

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));

    await expect(pending).resolves.toBe(false);
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('interpolates linearly when asked to', async () => {
    const { panZoom } = harness();

    panZoom.update({});

    const pending = panZoom.setViewport({ x: -400, y: -300, zoom: 2 }, { duration: 100, interpolate: 'linear' });

    stepTo(0);
    stepTo(100);

    await expect(pending).resolves.toBe(true);
    expect(panZoom.getViewport()).toEqual({ x: -400, y: -300, zoom: 2 });
  });
});

describe('c-flow-pan-zoom immediate viewport API', () => {
  it('scaleTo applies at once about the pane centre and resolves true', async () => {
    const { panZoom, onPanZoom, onPanZoomStart, onPanZoomEnd } = harness();

    panZoom.update({});

    await expect(panZoom.scaleTo(2, { duration: 0 })).resolves.toBe(true);
    expect(panZoom.getViewport()).toEqual({ x: -400, y: -300, zoom: 2 });
    expect(onPanZoomStart).toHaveBeenCalledTimes(1);
    expect(onPanZoom).toHaveBeenCalledTimes(1);
    expect(onPanZoomEnd).toHaveBeenCalledTimes(1);
  });

  it('scaleTo clamps to the scale extent', async () => {
    const { panZoom } = harness();

    panZoom.update({});

    await panZoom.scaleTo(100, { duration: 0 });

    expect(panZoom.getViewport().zoom).toBe(2);

    await panZoom.scaleTo(0.001, { duration: 0 });

    expect(panZoom.getViewport().zoom).toBe(0.5);
  });

  it('scaleBy multiplies the current zoom', async () => {
    const { panZoom } = harness();

    panZoom.update({});

    await panZoom.scaleBy(2, { duration: 0 });

    expect(panZoom.getViewport()).toEqual({ x: -400, y: -300, zoom: 2 });

    await panZoom.scaleBy(0.5, { duration: 0 });

    expect(panZoom.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('setViewport writes the requested viewport verbatim', async () => {
    const { panZoom, onTransformChange } = harness();

    panZoom.update({});

    await expect(panZoom.setViewport({ x: 10, y: 20, zoom: 1.5 }, { duration: 0 })).resolves.toBe(true);
    expect(panZoom.getViewport()).toEqual({ x: 10, y: 20, zoom: 1.5 });
    expect(onTransformChange).toHaveBeenLastCalledWith([10, 20, 1.5]);
  });

  it('setViewportConstrained returns the clamped viewport it actually applied', async () => {
    const { panZoom } = harness();

    panZoom.update({});

    const applied = await panZoom.setViewportConstrained(
      { x: 0, y: 0, zoom: 1 },
      [
        [0, 0],
        [800, 600],
      ],
      [
        [0, 0],
        [400, 300],
      ]
    );

    // The flow rect is half the pane, so the content is centred rather than edge-aligned.
    expect(applied).toEqual({ x: 200, y: 150, zoom: 1 });
    expect(panZoom.getViewport()).toEqual({ x: 200, y: 150, zoom: 1 });
  });

  it('panBy reports false for a zero delta and skips the transform write', () => {
    const { panZoom, onPanZoom } = harness();

    panZoom.update({});

    expect(panZoom.panBy({ x: 0, y: 0 })).toBe(false);
    expect(onPanZoom).not.toHaveBeenCalled();
  });

  it('panBy reports true and shifts the viewport when it moves', () => {
    const { panZoom, onPanZoom } = harness();

    panZoom.update({});

    expect(panZoom.panBy({ x: 50, y: -20 })).toBe(true);
    expect(panZoom.getViewport()).toEqual({ x: 50, y: -20, zoom: 1 });
    expect(onPanZoom).toHaveBeenCalledTimes(1);
  });

  it('panBy reports false when translateExtent leaves nowhere to go', () => {
    const { panZoom } = harness();

    panZoom.update({});
    panZoom.setTranslateExtent([
      [0, 0],
      [800, 600],
    ]);

    expect(panZoom.panBy({ x: 50, y: 0 })).toBe(false);
    expect(panZoom.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('setScaleExtent changes what a later zoom clamps to', async () => {
    const { panZoom } = harness();

    panZoom.update({});
    panZoom.setScaleExtent([0.5, 1.5]);

    await panZoom.scaleTo(10, { duration: 0 });

    expect(panZoom.getViewport()).toEqual({ x: -200, y: -150, zoom: 1.5 });
  });

  it('update() adopts a new scale extent and translate extent', async () => {
    const { panZoom } = harness();

    panZoom.update({
      minZoom: 0.1,
      maxZoom: 8,
      translateExtent: [
        [0, 0],
        [800, 600],
      ],
    });

    await panZoom.scaleTo(8, { duration: 0 });

    expect(panZoom.getViewport().zoom).toBe(8);

    // At zoom 8 the flow rect overflows the pane, so panning is allowed but stops at the edge.
    expect(panZoom.panBy({ x: 10000, y: 0 })).toBe(true);
    expect(panZoom.getViewport()).toEqual({ x: 0, y: -2100, zoom: 8 });
  });

  it('drives every gesture with no callbacks supplied at all', () => {
    const pane = makePane();
    const panZoom = createPanZoom({
      domNode: pane,
      minZoom: 0.5,
      maxZoom: 2,
      translateExtent: INFINITE_EXTENT,
      viewport: { x: 0, y: 0, zoom: 1 },
    });

    panZoom.update({ panOnDrag: true, zoomOnScroll: true });

    // Every callback is optional, so the kernel must not assume one exists.
    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 150, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointerup', { x: 150, y: 100 }));

    expect(panZoom.getViewport()).toEqual({ x: 50, y: 0, zoom: 1 });

    panZoom.destroy();
  });
});

describe('c-flow-pan-zoom click distance and context menu', () => {
  /** Right-drag pan, the configuration where the context menu has to be suppressed. */
  const RIGHT_DRAG = { panOnDrag: [0, 2] };

  function rightDrag(pane, { to = 1 } = {}) {
    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100, button: 2 }));
    if (to !== null) {
      pane.dispatchEvent(pointerEvent('pointermove', { x: 100 + to, y: 100, button: 2 }));
    }
    pane.dispatchEvent(pointerEvent('pointerup', { x: 100 + (to ?? 0), y: 100, button: 2 }));

    const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });

    pane.dispatchEvent(menu);

    return menu;
  }

  it('suppresses the context menu after a right-button pan that moved', () => {
    const { pane, panZoom } = harness();

    panZoom.update(RIGHT_DRAG);

    expect(rightDrag(pane).defaultPrevented).toBe(true);
  });

  it('lets a stationary right-click through to the consumer', () => {
    const { pane, panZoom } = harness();

    panZoom.update(RIGHT_DRAG);

    expect(rightDrag(pane, { to: null }).defaultPrevented).toBe(false);
  });

  it('lets the context menu through after a left-button drag', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ panOnDrag: true });

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 200, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointerup', { x: 200, y: 100 }));

    const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });

    pane.dispatchEvent(menu);

    expect(menu.defaultPrevented).toBe(false);
  });

  it('resets the right-button flag, so a second context menu is not suppressed', () => {
    const { pane, panZoom } = harness();

    panZoom.update(RIGHT_DRAG);
    rightDrag(pane);

    const second = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });

    pane.dispatchEvent(second);

    expect(second.defaultPrevented).toBe(false);
  });

  it('treats a move shorter than paneClickDistance as a click, not a pan', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ ...RIGHT_DRAG, paneClickDistance: 100 });

    expect(rightDrag(pane, { to: 5 }).defaultPrevented).toBe(false);
  });

  it('setClickDistance floors a negative distance at zero, so any movement counts', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ ...RIGHT_DRAG, paneClickDistance: 100 });
    panZoom.setClickDistance(-5);

    expect(rightDrag(pane, { to: 1 }).defaultPrevented).toBe(true);
  });

  it('setClickDistance floors a non-numeric distance at zero', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ ...RIGHT_DRAG, paneClickDistance: 100 });
    panZoom.setClickDistance('far');

    expect(rightDrag(pane, { to: 1 }).defaultPrevented).toBe(true);
  });

  it('setClickDistance accepts a valid threshold', () => {
    const { pane, panZoom } = harness();

    panZoom.update(RIGHT_DRAG);
    panZoom.setClickDistance(50);

    expect(rightDrag(pane, { to: 5 }).defaultPrevented).toBe(false);
  });

  it('selectionOnDrag never marks the pointer as moved, leaving the menu to the consumer', () => {
    const { pane, panZoom } = harness();

    panZoom.update({ ...RIGHT_DRAG, selectionOnDrag: true });

    expect(rightDrag(pane, { to: 400 }).defaultPrevented).toBe(false);
  });
});

describe('c-flow-pan-zoom destroy', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('ignores every later input once destroyed', () => {
    const { pane, panZoom, onTransformChange, onPanZoomStart, onPanZoom, onDraggingChange } = harness();

    panZoom.update({ panOnDrag: true, zoomOnScroll: true, zoomOnDoubleClick: true });
    panZoom.destroy();
    onTransformChange.mockClear();

    pane.dispatchEvent(pointerEvent('pointerdown', { x: 100, y: 100 }));
    pane.dispatchEvent(pointerEvent('pointermove', { x: 200, y: 200 }));
    pane.dispatchEvent(pointerEvent('pointerup', { x: 200, y: 200 }));
    pane.dispatchEvent(wheel({ deltaY: -100, x: 400, y: 300 }));
    pane.dispatchEvent(new MouseEvent('dblclick', { clientX: 400, clientY: 300, bubbles: true }));

    expect(onTransformChange).not.toHaveBeenCalled();
    expect(onPanZoomStart).not.toHaveBeenCalled();
    expect(onPanZoom).not.toHaveBeenCalled();
    expect(onDraggingChange).not.toHaveBeenCalled();
    expect(panZoom.getViewport()).toEqual({ x: 0, y: 0, zoom: 1 });
  });

  it('cancels a pending wheel-idle timer so no gesture ends after teardown', () => {
    const { pane, panZoom, onPanZoomEnd } = harness();

    panZoom.update({ zoomOnScroll: true });
    pane.dispatchEvent(wheel({ deltaY: -50, x: 400, y: 300 }));
    panZoom.destroy();
    jest.advanceTimersByTime(WHEEL_IDLE_MS * 2);

    expect(onPanZoomEnd).not.toHaveBeenCalled();
  });

  it('is idempotent', () => {
    const { panZoom } = harness();

    panZoom.update({});
    panZoom.destroy();

    expect(() => panZoom.destroy()).not.toThrow();
  });
});
