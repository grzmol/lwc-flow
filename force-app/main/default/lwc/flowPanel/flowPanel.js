/**
 * A positioned overlay above the viewport.
 *
 * Ports `@xyflow/react/src/components/Panel/index.tsx`. Upstream splits the position string on
 * `-` and emits one class per part (`top-left` -> `top left`); the CSS then pins the corner. That
 * is reproduced verbatim so the six positions behave identically.
 *
 * Three deviations, all forced by the platform:
 * - Upstream renders children directly. Here the content arrives through a `<slot>`, which is the
 *   LWC equivalent and keeps the panel content in the consumer's own template scope.
 * - Upstream's panel is a plain absolutely positioned element inside the flow. A child component's
 *   host element is what the parent lays out, so `:host` spans the pane (pointer-events off) and
 *   the inner `<div>` is the thing that pins itself to a corner. Positioning the host instead
 *   would require the component to write to its own host class list, which it must not do.
 * - The normalised values behind the public accessors are held in ordinary fields, not in `#`
 *   private ones. Only ordinary fields are registered as reactive by the LWC compiler
 *   (`@lwc/babel-plugin-component` collects non-decorated class properties by name, and a
 *   `#name` has none), so writing a `#` field from a setter leaves the template stale.
 */

import { LightningElement, api } from 'lwc';

/** Upstream `PanelPosition`. Anything else falls back to the default. */
const PANEL_POSITIONS = new Set([
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]);
const DEFAULT_POSITION = 'top-left';

export default class FlowPanel extends LightningElement {
  _position = DEFAULT_POSITION;
  _className = '';

  /** One of the six `PanelPosition` values. */
  @api
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = PANEL_POSITIONS.has(value) ? value : DEFAULT_POSITION;
  }

  /** Extra classes for the panel element, as upstream's `className`. */
  @api
  get className() {
    return this._className;
  }
  set className(value) {
    this._className = typeof value === 'string' ? value.trim() : '';
  }

  /**
   * Classes for the panel element.
   *
   * `nopan` is not decoration: `c/flowPanZoom.isWrappedWithClass` walks the event's
   * `composedPath()` looking for it, and without it a pointer drag that starts on a panel would
   * pan the flow underneath. Upstream sets it for the same reason.
   */
  get panelClass() {
    const classes = ['flow__panel', 'nopan', ...this._position.split('-')];

    if (this._className) {
      classes.push(this._className);
    }

    return classes.join(' ');
  }
}
