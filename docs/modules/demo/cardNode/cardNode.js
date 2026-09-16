import { LightningElement, api } from 'lwc';

/**
 * Light DOM is mandatory, not stylistic: `c/flowDom.getHandleBounds` finds handles with
 * `querySelectorAll` on the node wrapper's root element, and that query stops at the first shadow
 * boundary. A shadow root here would leave `handleBounds` null and every attached edge would fail
 * to find an endpoint.
 *
 * The `@api` surface mirrors `c/flowDefaultNode`: the wrapper spreads the whole node props object
 * with `lwc:spread`, and an undeclared key would land as an expando rather than a public property.
 */
export default class CardNode extends LightningElement {
  static renderMode = 'light';

  @api id;
  @api data;
  @api type;
  @api selected;
  @api dragging;
  @api draggable;
  @api selectable;
  @api connectable;
  @api deletable;
  @api isConnectable;
  @api sourcePosition;
  @api targetPosition;
  @api positionAbsoluteX;
  @api positionAbsoluteY;
  @api width;
  @api height;
  @api parentId;
  @api zIndex;
  @api store;
  @api flowId;

  get title() {
    return this.data?.title ?? this.data?.label;
  }

  get meta() {
    return this.data?.meta;
  }

  get hasMeta() {
    return Boolean(this.data?.meta);
  }

  get icon() {
    return this.data?.icon ?? '◆';
  }

  get iconClass() {
    return `dcard__icon dcard__icon_${this.data?.tone ?? 'violet'}`;
  }

  get cardClass() {
    return [
      'dcard',
      `dcard_${this.data?.size ?? 'md'}`,
      this.data?.emphasis ? 'dcard_emphasis' : '',
      this.dragging ? 'dcard_dragging' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get metricRows() {
    return (this.data?.metrics ?? []).map((metric, index) => ({
      key: `${this.id}-m${index}`,
      label: metric.label,
      value: metric.value,
      delta: metric.delta,
      deltaClass: `dcard__metric-delta dcard__metric-delta_${metric.direction ?? 'flat'}`,
    }));
  }

  get hasMetrics() {
    return this.metricRows.length > 0;
  }

  get hasProgress() {
    return typeof this.data?.progress === 'number';
  }

  get barStyle() {
    return `width:${Math.round(Math.min(1, Math.max(0, this.data.progress)) * 100)}%`;
  }

  get barFillClass() {
    return `dcard__bar-fill dcard__bar-fill_${this.data?.tone ?? 'violet'}`;
  }

  get footer() {
    return this.data?.footer;
  }

  get hasFooter() {
    return Boolean(this.data?.footer);
  }

  get chip() {
    return this.data?.chip?.text;
  }

  get hasChip() {
    return Boolean(this.data?.chip);
  }

  get chipClass() {
    return `dcard__chip dcard__chip_${this.data?.chip?.tone ?? 'slate'}`;
  }

  get hasFoot() {
    return this.hasFooter || this.hasChip;
  }

  /**
   * `c/flowHandle` dispatches a non-bubbling `connectstart`, so a custom node must relay it: the
   * gesture owner sits above the node wrapper and never sees the handle's own event.
   */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', { detail: event.detail }));
  }
}
