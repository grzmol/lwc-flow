/**
 * The `group` built-in node type: a bordered container with no handles and no content.
 *
 * Ports `@xyflow/react/src/components/Nodes/GroupNode.tsx`, which returns `null`. A group is
 * purely a box: its border, radius and size come from the node wrapper's root element, which
 * carries `flow__node-group`, and the nodes it contains are ordinary nodes with `parentId` set
 * rather than children in the DOM. So this component deliberately renders nothing, and `data.label`
 * is accepted but not drawn, exactly as upstream.
 *
 * Renders in light DOM to keep the whole node subtree in one root, as `c/flowHandle` documents,
 * and so that `flowGroupNode.css` reaches the node element: a light-DOM stylesheet is injected
 * unscoped into the node wrapper's root, which is where the group's own background belongs. The
 * trade-off is the loss of style scoping, so the sheet contains exactly one narrowly anchored rule.
 *
 * The `@api` surface is the `nodeProps` object the node wrapper spreads onto every node
 * component. Every field is declared even though none is used, because `lwc:spread` assigns every
 * key and an undeclared one would land as an expando rather than a public property.
 */

import { LightningElement, api } from 'lwc';

export default class FlowGroupNode extends LightningElement {
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
}
