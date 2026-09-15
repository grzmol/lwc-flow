/**
 * The node layer: one wrapper per visible node.
 *
 * Ports `@xyflow/react/src/container/NodeRenderer/index.tsx` and its `useVisibleNodeIds` hook.
 *
 * The split of work between this component and `c/flowNodeWrapper` is upstream's, and it is the
 * reason dragging a node does not cost anything here: this component subscribes to the *id list*
 * only, so a node moving cannot make it rebuild the list. Everything that depends on a single
 * node's data is the wrapper's business.
 *
 * Deviation from upstream: there is no shared `ResizeObserver`. A parent may not reach into a
 * child's shadow root, so each wrapper measures itself and reports `nodemeasured` upward, which
 * this component forwards along with every other node event.
 */

import { LightningElement, api } from 'lwc';
import { getNodesInside } from 'c/flowMath';
import { shallowArrayEqual } from 'c/flowStore';

/**
 * Ids of the nodes that should be in the DOM.
 *
 * With culling off this is every non-hidden node. With culling on it is `getNodesInside`, which
 * deliberately keeps an unmeasured node visible: a node has to be rendered once before it can be
 * measured, so culling it on geometry it does not have yet would keep it out of the DOM forever.
 * @param {Object} state
 * @returns {Array<string>}
 */
function selectVisibleNodeIds(state) {
  if (state.onlyRenderVisibleElements) {
    return getNodesInside(
      state.nodeLookup,
      { x: 0, y: 0, width: state.width, height: state.height },
      state.transform,
      true
    ).map((node) => node.id);
  }

  const ids = [];

  for (const [id, node] of state.nodeLookup) {
    if (!node.hidden) {
      ids.push(id);
    }
  }

  return ids;
}

export default class FlowNodeRenderer extends LightningElement {
  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  /** Id of the owning flow, handed to every wrapper. */
  @api flowId;

  /*
   * Ordinary field, not a `#` one: the LWC babel plugin only registers `ClassProperty` nodes as
   * reactive, so a `#field` the template reads would never trigger a re-render.
   */
  _nodeIds = [];

  #unsubscribe;

  connectedCallback() {
    this.#unsubscribe = this.store?.subscribe(
      selectVisibleNodeIds,
      (ids) => {
        this._nodeIds = ids;
      },
      { compare: shallowArrayEqual }
    );
  }

  disconnectedCallback() {
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
  }

  get nodeIds() {
    return this._nodeIds;
  }

  /**
   * Pass a wrapper's event on unchanged.
   *
   * One handler for every event name: nothing here inspects or rewrites a node event, and a
   * per-event method would be eleven copies of the same line.
   * @param {CustomEvent} event
   */
  handleNodeEvent(event) {
    this.dispatchEvent(new CustomEvent(event.type, { detail: event.detail }));
  }
}
