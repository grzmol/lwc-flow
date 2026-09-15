/**
 * Node-type registry.
 *
 * Ports upstream's `builtinNodeTypes` (`@xyflow/react/src/container/NodeRenderer/utils.ts`), where
 * the four shipped node components are merged under the consumer's `nodeTypes` before the renderer
 * looks a type up. Unlike an edge type, a node type *is* a component: the node wrapper instantiates
 * it with `lwc:is`, so this module maps a type name to a constructor.
 *
 * Merging happens here rather than in the store so the store stays a plain mirror of the flow's
 * props, and so a consumer's `default` entry still wins - exactly upstream's precedence.
 */

import FlowInputNode from 'c/flowInputNode';
import FlowDefaultNode from 'c/flowDefaultNode';
import FlowOutputNode from 'c/flowOutputNode';
import FlowGroupNode from 'c/flowGroupNode';

/** The four node types lwc-flow ships, keyed by the name a node's `type` field uses. */
export const builtinNodeTypes = Object.freeze({
  input: FlowInputNode,
  default: FlowDefaultNode,
  output: FlowOutputNode,
  group: FlowGroupNode,
});

/**
 * The registry the node wrapper resolves against: the built-ins, overridden by the consumer's.
 * @param {Record<string, Function>} [nodeTypes] the flow's `nodeTypes` prop
 * @returns {Record<string, Function>} every type name the flow can render
 */
export function resolveNodeTypes(nodeTypes) {
  return nodeTypes ? { ...builtinNodeTypes, ...nodeTypes } : builtinNodeTypes;
}
