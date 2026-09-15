import { LightningElement, api } from 'lwc';

/**
 * A custom node type, registered by constructor through `c-flow`'s `node-types`.
 *
 * Light DOM is mandatory, not stylistic: `c/flowDom.getHandleBounds` finds handles with
 * `querySelectorAll` on the node wrapper's root element, and that query stops at the first shadow
 * boundary. A shadow root here would leave `handleBounds` null and every attached edge would fail
 * to find an endpoint.
 *
 * The `@api` surface mirrors `c/flowDefaultNode`: the wrapper spreads the whole node props object
 * with `lwc:spread`, and an undeclared key would land as an expando rather than a public property.
 */
export default class PillNode extends LightningElement {
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

  get label() {
    return this.data?.label;
  }

  get badge() {
    return this.data?.badge;
  }

  get hasBadge() {
    return Boolean(this.data?.badge);
  }

  get pillClass() {
    return this.dragging ? 'demo-pill demo-pill_dragging' : 'demo-pill';
  }

  /**
   * `c/flowHandle` dispatches a non-bubbling `connectstart`, so a custom node must relay it: the
   * gesture owner sits above the node wrapper and never sees the handle's own event.
   */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', { detail: event.detail }));
  }
}
