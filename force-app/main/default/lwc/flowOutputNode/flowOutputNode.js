/**
 * The `output` built-in node type: a single target handle above a label.
 *
 * Ports `@xyflow/react/src/components/Nodes/OutputNode.tsx`.
 *
 * Renders in light DOM for the reason `c/flowHandle` documents: `c/flowDom.getHandleBounds`
 * measures handles with `querySelectorAll` from the node wrapper's root element, and a shadow root
 * anywhere between that element and the handle marker would hide the handle from measurement. The
 * trade-off is the loss of style scoping, so `flowOutputNode.css` anchors its only selector on a
 * `flow__node-label` class.
 *
 * The `@api` surface is the `nodeProps` object the node wrapper spreads onto every node
 * component. Fields this type does not use are still declared, because `lwc:spread` assigns every
 * key and an undeclared one would land as an expando rather than a public property.
 */

import { LightningElement, api } from 'lwc';

export default class FlowOutputNode extends LightningElement {
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

  /** A handle only reports the press; the gesture owner lives further up the tree. */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', { detail: event.detail }));
  }
}
