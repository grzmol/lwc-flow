import { createElement } from 'lwc';
import FlowControls from 'c/flowControls';
import { createFlowStore } from 'c/flowStore';
import { defaultAriaLabelConfig } from 'c/flowTypes';

/** Stand-in for `c/flowPanZoom`'s controller: Controls only ever calls `scaleBy` on it. */
function fakePanZoom() {
  return { scaleBy: jest.fn() };
}

function render(props = {}) {
  const element = createElement('c-flow-controls', { is: FlowControls });
  Object.assign(element, props);
  document.body.appendChild(element);
  return element;
}

function buttons(element) {
  return Array.from(element.shadowRoot.querySelectorAll('button'));
}

function button(element, name) {
  return element.shadowRoot.querySelector(`.flow__controls-${name}`);
}

function flush() {
  return Promise.resolve();
}

describe('c-flow-controls', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('renders the four buttons with the default accessible labels', () => {
    const element = render({ store: createFlowStore() });

    expect(buttons(element).map((b) => b.getAttribute('aria-label'))).toEqual([
      defaultAriaLabelConfig['controls.zoomIn.ariaLabel'],
      defaultAriaLabelConfig['controls.zoomOut.ariaLabel'],
      defaultAriaLabelConfig['controls.fitView.ariaLabel'],
      defaultAriaLabelConfig['controls.interactive.ariaLabel'],
    ]);
    expect(buttons(element).map((b) => b.getAttribute('title'))).toEqual([
      'Zoom In',
      'Zoom Out',
      'Fit View',
      'Toggle Interactivity',
    ]);
    expect(buttons(element).every((b) => b.getAttribute('type') === 'button')).toBe(true);
  });

  it('labels the group from the store config, and lets the property win', async () => {
    const store = createFlowStore({ ariaLabelConfig: { 'controls.ariaLabel': 'Flussdiagramm' } });
    const element = render({ store });
    await flush();

    expect(element.shadowRoot.querySelector('[role="group"]').getAttribute('aria-label')).toBe('Flussdiagramm');

    element.ariaLabel = 'Map controls';
    await flush();

    expect(element.shadowRoot.querySelector('[role="group"]').getAttribute('aria-label')).toBe('Map controls');
  });

  it('takes a zoom label override from the store', async () => {
    const store = createFlowStore({ ariaLabelConfig: { 'controls.zoomIn.ariaLabel': 'Näher ran' } });
    const element = render({ store });
    await flush();

    expect(button(element, 'zoomin').getAttribute('aria-label')).toBe('Näher ran');
    // Unspecified keys still come from the defaults.
    expect(button(element, 'zoomout').getAttribute('aria-label')).toBe('Zoom Out');
  });

  it('hides each button group on request', () => {
    const element = render({ showZoom: false, showFitView: false, showInteractive: false });

    expect(buttons(element)).toHaveLength(0);
  });

  it('reads an attribute-form "false" as off, and anything else as on', () => {
    const off = render({ showZoom: 'false' });
    const on = render({ showZoom: undefined, showFitView: true });

    expect(off.showZoom).toBe(false);
    expect(off.shadowRoot.querySelector('.flow__controls-zoomin')).toBeNull();
    expect(on.showZoom).toBe(true);
    expect(on.shadowRoot.querySelector('.flow__controls-zoomin')).not.toBeNull();
  });

  it('zooms in through the store panZoom by the upstream step', () => {
    const panZoom = fakePanZoom();
    const store = createFlowStore({ panZoom });
    const element = render({ store });

    button(element, 'zoomin').click();

    expect(panZoom.scaleBy).toHaveBeenCalledWith(1.2);
  });

  it('zooms out by the reciprocal step', () => {
    const panZoom = fakePanZoom();
    const store = createFlowStore({ panZoom });
    const element = render({ store });

    button(element, 'zoomout').click();

    expect(panZoom.scaleBy).toHaveBeenCalledWith(1 / 1.2);
  });

  it('reports the zoom clicks as events', () => {
    const panZoom = fakePanZoom();
    const element = render({ store: createFlowStore({ panZoom }) });
    const zoomIn = jest.fn();
    const zoomOut = jest.fn();
    element.addEventListener('zoomin', zoomIn);
    element.addEventListener('zoomout', zoomOut);

    button(element, 'zoomin').click();
    button(element, 'zoomout').click();

    expect(zoomIn).toHaveBeenCalledTimes(1);
    expect(zoomOut).toHaveBeenCalledTimes(1);
  });

  it('does not throw when the flow has not installed a panZoom yet', () => {
    const element = render({ store: createFlowStore() });

    expect(() => button(element, 'zoomin').click()).not.toThrow();
    expect(() => button(element, 'zoomout').click()).not.toThrow();
  });

  it('dispatches fitview with the configured options, because the root owns fit view', () => {
    const fitViewOptions = { padding: 0.2, duration: 400 };
    const element = render({ store: createFlowStore(), fitViewOptions });
    const handler = jest.fn();
    element.addEventListener('fitview', handler);

    button(element, 'fitview').click();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][0].detail).toEqual(fitViewOptions);
    expect(handler.mock.calls[0][0].bubbles).toBe(false);
    expect(handler.mock.calls[0][0].composed).toBe(false);
  });

  it('flips all three interaction flags together and reports the new value', () => {
    const store = createFlowStore();
    const element = render({ store });
    const handler = jest.fn();
    element.addEventListener('interactivechange', handler);

    button(element, 'interactive').click();

    expect(store.state.nodesDraggable).toBe(false);
    expect(store.state.nodesConnectable).toBe(false);
    expect(store.state.elementsSelectable).toBe(false);
    expect(handler.mock.calls[0][0].detail).toBe(false);

    button(element, 'interactive').click();

    expect(store.state.nodesDraggable).toBe(true);
    expect(store.state.nodesConnectable).toBe(true);
    expect(store.state.elementsSelectable).toBe(true);
    expect(handler.mock.calls[1][0].detail).toBe(true);
  });

  it('shows the lock state on the button and in aria-pressed', async () => {
    const store = createFlowStore();
    const element = render({ store });
    const lock = button(element, 'interactive');

    expect(lock.getAttribute('aria-pressed')).toBe('false');
    const unlockedIcon = lock.querySelector('path').getAttribute('d');

    lock.click();
    await flush();

    expect(button(element, 'interactive').getAttribute('aria-pressed')).toBe('true');
    expect(button(element, 'interactive').querySelector('path').getAttribute('d')).not.toBe(unlockedIcon);
  });

  it('treats one live flag as still interactive, as upstream does', async () => {
    const store = createFlowStore({ nodesDraggable: false, nodesConnectable: false });
    const element = render({ store });
    await flush();

    expect(button(element, 'interactive').getAttribute('aria-pressed')).toBe('false');

    store.update({ elementsSelectable: false });
    await flush();

    expect(button(element, 'interactive').getAttribute('aria-pressed')).toBe('true');
  });

  it('disables zoom in once the transform sits at maxZoom', async () => {
    const store = createFlowStore({ maxZoom: 2 });
    const element = render({ store });

    expect(button(element, 'zoomin').disabled).toBe(false);

    store.setTransform([0, 0, 2]);
    await flush();

    expect(button(element, 'zoomin').disabled).toBe(true);
    expect(button(element, 'zoomout').disabled).toBe(false);
  });

  it('disables zoom out once the transform sits at minZoom', async () => {
    const store = createFlowStore({ minZoom: 0.5 });
    const element = render({ store });

    store.setTransform([0, 0, 0.5]);
    await flush();

    expect(button(element, 'zoomout').disabled).toBe(true);
    expect(button(element, 'zoomin').disabled).toBe(false);
  });

  it('positions itself bottom-left by default and follows the position property', async () => {
    const element = render({ store: createFlowStore() });
    const panel = element.shadowRoot.querySelector('c-flow-panel');

    expect(element.position).toBe('bottom-left');
    expect(panel.position).toBe('bottom-left');

    element.position = 'top-right';
    await flush();

    expect(element.shadowRoot.querySelector('c-flow-panel').position).toBe('top-right');
  });

  it('lays the buttons out vertically unless told otherwise', () => {
    const vertical = render({ store: createFlowStore() });
    const horizontal = render({ store: createFlowStore(), orientation: 'horizontal', className: 'my-controls' });

    expect(vertical.shadowRoot.querySelector('[role="group"]').className).toBe('flow__controls vertical');
    expect(horizontal.shadowRoot.querySelector('[role="group"]').className).toBe(
      'flow__controls horizontal my-controls'
    );
    expect(render({ store: createFlowStore(), orientation: 'sideways' }).orientation).toBe('vertical');
  });

  it('works without a store: the lock toggle still tracks its own state', async () => {
    const element = render();
    const handler = jest.fn();
    element.addEventListener('interactivechange', handler);

    button(element, 'interactive').click();
    await flush();

    expect(handler.mock.calls[0][0].detail).toBe(false);
    expect(button(element, 'interactive').getAttribute('aria-pressed')).toBe('true');
  });

  it('releases every store subscription when it is removed', async () => {
    const store = createFlowStore({ maxZoom: 2 });
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

    const element = render({ store });
    store.setTransform([0, 0, 1.5]);
    await flush();

    // Three subscriptions, each delivered once immediately, plus the zoom bounds change.
    expect(deliveries).toHaveLength(4);
    document.body.removeChild(element);

    expect(() => store.setTransform([0, 0, 2])).not.toThrow();
    store.update({ nodesDraggable: false, nodesConnectable: false, elementsSelectable: false });
    await flush();

    expect(deliveries).toHaveLength(4);
    // Still enabled, and still unlocked: no notification reached the detached component.
    expect(element.shadowRoot.querySelector('.flow__controls-zoomin').disabled).toBe(false);
    expect(element.shadowRoot.querySelector('.flow__controls-interactive').getAttribute('aria-pressed')).toBe('false');
  });
});
