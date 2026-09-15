/**
 * The zoom / fit-view / lock control panel.
 *
 * Ports `@xyflow/react/src/additional-components/Controls/` (`Controls.tsx`, `ControlButton.tsx`,
 * `Icons/`). Sits in a `c-flow-panel`, exactly as upstream renders inside its `<Panel>`, so the
 * six corner positions and the `nopan` guard are defined in one place.
 *
 * Deviations from upstream:
 * - Fit view needs the node set, the pane size and the store's fit-view options, which belong to
 *   the root component. Upstream reaches them through `useReactFlow()`; there is no such hook
 *   here, so the button dispatches a `fitview` event carrying the configured options and the root
 *   performs the fit. Zoom in/out need none of that and drive `panZoom` directly.
 * - Upstream's `<ControlButton>` is a component so consumers can add their own buttons as
 *   children. Here the four built-in buttons are plain `<button>`s in this template and a
 *   consumer's extra buttons arrive through the `<slot>`; a button component would add a shadow
 *   root per button for nothing.
 * - `onZoomIn` / `onZoomOut` / `onFitView` / `onInteractiveChange` callbacks become the
 *   `zoomin`, `zoomout`, `fitview` and `interactivechange` events.
 * - Template-visible state lives in ordinary fields, never `#` private ones: only ordinary class
 *   properties are reactive in LWC.
 */

import { LightningElement, api } from 'lwc';
import { mergeAriaLabelConfig } from 'c/flowTypes';
import { shallowArrayEqual } from 'c/flowStore';

/** Upstream's fixed zoom step: `zoomIn` scales by 1.2, `zoomOut` by its reciprocal. */
const ZOOM_STEP = 1.2;

const DEFAULT_POSITION = 'bottom-left';
const DEFAULT_ORIENTATION = 'vertical';

/** A default-on flag: only an explicit false, or the string an attribute carries, turns it off. */
function isOn(value) {
  return value !== false && value !== 'false';
}

export default class FlowControls extends LightningElement {
  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  /*
   * The three `show*` flags default to true, and a public boolean FIELD may only default to
   * false (LWC1099: attribute presence alone would then mean true). Accessors sidestep that and
   * let an attribute-form `show-zoom="false"` turn a button off as well.
   */

  /** Show the zoom in and zoom out buttons. */
  @api
  get showZoom() {
    return this._showZoom;
  }
  set showZoom(value) {
    this._showZoom = isOn(value);
  }

  /** Show the fit view button. */
  @api
  get showFitView() {
    return this._showFitView;
  }
  set showFitView(value) {
    this._showFitView = isOn(value);
  }

  /** Show the interactivity lock button. */
  @api
  get showInteractive() {
    return this._showInteractive;
  }
  set showInteractive(value) {
    this._showInteractive = isOn(value);
  }

  /** Options handed to the root component in the `fitview` event. */
  @api fitViewOptions;

  /** Overrides the panel's own aria-label. */
  @api ariaLabel;

  /** Extra classes for the control group. */
  @api className;

  /** Reactive render state, refreshed from the store subscriptions. */
  interactive = true;
  minZoomReached = false;
  maxZoomReached = false;
  labels = mergeAriaLabelConfig();

  _showZoom = true;
  _showFitView = true;
  _showInteractive = true;
  _position = DEFAULT_POSITION;
  _orientation = DEFAULT_ORIENTATION;

  /** Subscription handles; the template never reads them. */
  #unsubscribers = [];

  /** Panel corner, one of the six `PanelPosition` values. */
  @api
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value || DEFAULT_POSITION;
  }

  /** `vertical` (default) stacks the buttons, `horizontal` lays them out in a row. */
  @api
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value === 'horizontal' ? 'horizontal' : DEFAULT_ORIENTATION;
  }

  connectedCallback() {
    if (!this.store) {
      return;
    }

    /*
     * Three subscriptions rather than one over the whole state: the zoom bounds change on
     * every wheel tick while the interaction flags and the labels almost never change, so
     * keeping them apart means zooming does not re-read either.
     */
    this.#unsubscribers.push(
      this.store.subscribe(
        (s) => [s.transform[2], s.minZoom, s.maxZoom],
        ([zoom, minZoom, maxZoom]) => {
          this.minZoomReached = zoom <= minZoom;
          this.maxZoomReached = zoom >= maxZoom;
        },
        { compare: shallowArrayEqual }
      ),
      this.store.subscribe(
        (s) => [s.nodesDraggable, s.nodesConnectable, s.elementsSelectable],
        (flags) => {
          // Upstream: interactive if ANY of the three is on.
          this.interactive = flags.some(Boolean);
        },
        { compare: shallowArrayEqual }
      ),
      this.store.subscribe(
        (s) => s.ariaLabelConfig,
        (config) => {
          this.labels = mergeAriaLabelConfig(config);
        }
      )
    );
  }

  disconnectedCallback() {
    for (const unsubscribe of this.#unsubscribers) {
      unsubscribe();
    }
    this.#unsubscribers = [];
  }

  get controlsClass() {
    const classes = ['flow__controls', this._orientation];

    if (this.className) {
      classes.push(this.className);
    }

    return classes.join(' ');
  }

  get panelAriaLabel() {
    return this.ariaLabel || this.labels['controls.ariaLabel'];
  }

  get zoomInLabel() {
    return this.labels['controls.zoomIn.ariaLabel'];
  }

  get zoomOutLabel() {
    return this.labels['controls.zoomOut.ariaLabel'];
  }

  get fitViewLabel() {
    return this.labels['controls.fitView.ariaLabel'];
  }

  get interactiveLabel() {
    return this.labels['controls.interactive.ariaLabel'];
  }

  /** The lock button is pressed while interactivity is off, which is when it shows the lock. */
  get lockPressed() {
    return this.interactive ? 'false' : 'true';
  }

  handleZoomIn() {
    this.store?.state.panZoom?.scaleBy(ZOOM_STEP);
    this.dispatchEvent(new CustomEvent('zoomin'));
  }

  handleZoomOut() {
    this.store?.state.panZoom?.scaleBy(1 / ZOOM_STEP);
    this.dispatchEvent(new CustomEvent('zoomout'));
  }

  handleFitView() {
    // The root owns fit view: only it knows the node set and the pane geometry.
    this.dispatchEvent(new CustomEvent('fitview', { detail: this.fitViewOptions }));
  }

  handleToggleInteractive() {
    const next = !this.interactive;

    this.store?.update({
      nodesDraggable: next,
      nodesConnectable: next,
      elementsSelectable: next,
    });

    /*
     * Without a store there is nothing to read the new value back from, so the local flag is
     * advanced here too. With a store the subscription lands first and this is a no-op.
     */
    this.interactive = next;
    this.dispatchEvent(new CustomEvent('interactivechange', { detail: next }));
  }
}
