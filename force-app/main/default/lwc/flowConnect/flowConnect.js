/**
 * Connection kernel for lwc-flow: handle hit-testing and connection validity.
 *
 * Service component: no template, no LWC imports. Ported from
 * `@xyflow/system/src/xyhandle/*`.
 *
 * ## Two ways to find the target handle
 *
 * Upstream resolves a drop target twice and prefers the second:
 *
 * 1. **Nearest handle by distance**, within `connectionRadius`. Gives the
 *    magnetic snap that makes connecting feel forgiving.
 * 2. **The handle actually under the pointer**, via hit-testing.
 *
 * The hit-tested handle wins when both exist, because the centre of a
 * neighbouring handle can be nearer to the cursor than the centre of the handle
 * the cursor is literally inside, and snapping away from what the user is
 * pointing at is always wrong.
 *
 * Hit-testing needs a shadow-DOM-aware path: `document.elementFromPoint`
 * returns the outermost host, so this walks `elementsFromPoint` and then
 * descends through shadow roots.
 */

import { getOverlappingArea, nodeToRect, getHandlePosition } from 'c/flowMath';
import { ConnectionMode, HANDLE_SEARCH_PADDING } from 'c/flowTypes';

/** Every handle carries this class, which is how hit-testing recognises one. */
export const HANDLE_CLASS = 'flow__handle';

/**
 * Nodes whose rect overlaps a square of side `2 * distance` around `position`.
 *
 * A cheap pre-filter so the handle scan does not touch every node in a large
 * graph. The box is generous on purpose: {@link getClosestHandle} adds
 * {@link HANDLE_SEARCH_PADDING} to the radius, because a node's *rect* can be
 * far from the pointer while one of its handles is not.
 * @param {import('c/flowTypes').XYPosition} position flow coordinates
 * @param {Map<string, *>} nodeLookup
 * @param {number} distance
 * @returns {Array<*>}
 */
function getNodesWithinDistance(position, nodeLookup, distance) {
  const nodes = [];
  const rect = {
    x: position.x - distance,
    y: position.y - distance,
    width: distance * 2,
    height: distance * 2,
  };

  for (const node of nodeLookup.values()) {
    if (getOverlappingArea(rect, nodeToRect(node)) > 0) {
      nodes.push(node);
    }
  }

  return nodes;
}

/**
 * The connectable handle nearest `position`, or null beyond `connectionRadius`.
 *
 * Ties are broken toward the handle of the opposite type: when a source and a
 * target handle sit exactly on top of each other, the one that can actually
 * complete the connection is the useful answer.
 * @param {import('c/flowTypes').XYPosition} position flow coordinates
 * @param {number} connectionRadius
 * @param {Map<string, *>} nodeLookup
 * @param {{nodeId: string, type: 'source'|'target', id?: string|null}} fromHandle
 * @returns {import('c/flowTypes').FlowHandle|null}
 */
export function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
  let closestHandles = [];
  let minDistance = Infinity;

  const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + HANDLE_SEARCH_PADDING);

  for (const node of closeNodes) {
    const allHandles = [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];

    for (const handle of allHandles) {
      // Never snap back to the handle the connection started from.
      if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
        continue;
      }

      const { x, y } = getHandlePosition(node, handle, handle.position, true);
      const distance = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));

      if (distance > connectionRadius) {
        continue;
      }

      if (distance < minDistance) {
        closestHandles = [{ ...handle, x, y }];
        minDistance = distance;
      } else if (distance === minDistance) {
        closestHandles.push({ ...handle, x, y });
      }
    }
  }

  if (!closestHandles.length) {
    return null;
  }

  if (closestHandles.length > 1) {
    const oppositeHandleType = fromHandle.type === 'source' ? 'target' : 'source';

    return closestHandles.find((handle) => handle.type === oppositeHandleType) ?? closestHandles[0];
  }

  return closestHandles[0];
}

/**
 * Resolve a specific handle on a node.
 *
 * In loose connection mode both buckets are searched, because a source handle is
 * allowed to receive a connection. With no `handleId` the node's first handle of
 * that type is used, which is what makes single-handle nodes work without ids.
 * @param {string} nodeId
 * @param {'source'|'target'} handleType
 * @param {string|null} handleId
 * @param {Map<string, *>} nodeLookup
 * @param {string} connectionMode
 * @param {boolean} [withAbsolutePosition=false] resolve x/y to flow coordinates
 * @returns {import('c/flowTypes').FlowHandle|null}
 */
export function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
  const node = nodeLookup.get(nodeId);

  if (!node) {
    return null;
  }

  const handles =
    connectionMode === ConnectionMode.Strict
      ? node.internals.handleBounds?.[handleType]
      : [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];

  const handle = (handleId ? handles?.find((h) => h.id === handleId) : handles?.[0]) ?? null;

  return handle && withAbsolutePosition
    ? { ...handle, ...getHandlePosition(node, handle, handle.position, true) }
    : handle;
}

/**
 * The handle type an element represents, from its marker classes.
 * @param {'source'|'target'|undefined} edgeUpdaterType overrides the DOM when reconnecting
 * @param {Element|null} handleDomNode
 * @returns {'source'|'target'|null}
 */
export function getHandleType(edgeUpdaterType, handleDomNode) {
  if (edgeUpdaterType) {
    return edgeUpdaterType;
  }
  if (handleDomNode?.classList?.contains('target')) {
    return 'target';
  }
  if (handleDomNode?.classList?.contains('source')) {
    return 'source';
  }

  return null;
}

/**
 * Tri-state connection validity, for driving the handle's visual feedback.
 *
 * `null` means "no opinion": the pointer is nowhere near a handle, so neither a
 * valid nor an invalid style should be shown. That is distinct from `false`,
 * which means the user is over a handle that would reject the connection.
 * @param {boolean} isInsideConnectionRadius
 * @param {boolean} isHandleValid
 * @returns {boolean|null}
 */
export function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
  if (isHandleValid) {
    return true;
  }
  if (isInsideConnectionRadius && !isHandleValid) {
    return false;
  }

  return null;
}

/**
 * The topmost handle element at a viewport point, crossing shadow boundaries.
 *
 * `elementFromPoint` stops at the outermost shadow host, so every candidate is
 * re-queried through its own `shadowRoot` until no deeper element is found. This
 * is the LWC-specific part of connection hit-testing: without it, a handle
 * inside a custom node's shadow root would be invisible to the pointer.
 * @param {Document|ShadowRoot} root
 * @param {number} x client x
 * @param {number} y client y
 * @returns {Element|null}
 */
export function handleElementFromPoint(root, x, y) {
  const doc = root?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);

  if (!doc?.elementsFromPoint) {
    return null;
  }

  for (const start of doc.elementsFromPoint(x, y)) {
    let element = start;

    // Descend while the hit element hosts a shadow root with something at this point.
    for (let depth = 0; depth < 20; depth++) {
      if (element?.classList?.contains(HANDLE_CLASS)) {
        return element;
      }

      const shadow = element?.shadowRoot;

      if (!shadow?.elementFromPoint) {
        break;
      }

      const inner = shadow.elementFromPoint(x, y);

      if (!inner || inner === element) {
        break;
      }
      element = inner;
    }
  }

  return null;
}

/**
 * Decide whether dropping at this point would create a valid connection.
 *
 * Returns the prospective `connection`, whether it is valid, the handle element
 * involved, and the resolved target handle. The connection object is returned
 * even when invalid so the caller can report it to `onConnectEnd`.
 *
 * Rejection reasons, in the order they apply:
 * - nothing connectable under the pointer or within the radius
 * - the handle is not marked `connectable` and `connectableend`
 * - strict mode: source may only meet target
 * - loose mode: the exact same handle on the same node
 * - the consumer's `isValidConnection` callback returned false
 * @param {Object} params
 * @param {import('c/flowTypes').FlowHandle|null} params.handle nearest handle, if any
 * @param {string} params.connectionMode
 * @param {string} params.fromNodeId
 * @param {string|null} params.fromHandleId
 * @param {'source'|'target'} params.fromType
 * @param {Document|ShadowRoot} params.doc
 * @param {string} params.flowId
 * @param {(connection: *) => boolean} [params.isValidConnection]
 * @param {Map<string, *>} params.nodeLookup
 * @param {{x: number, y: number}} params.clientPosition
 * @returns {{handleDomNode: Element|null, isValid: boolean, connection: *|null, toHandle: *|null}}
 */
export function isValidHandle({
  handle,
  connectionMode,
  fromNodeId,
  fromHandleId,
  fromType,
  doc,
  flowId,
  isValidConnection = () => true,
  nodeLookup,
  clientPosition,
}) {
  const isTarget = fromType === 'target';

  const handleDomNode = handle
    ? (doc?.querySelector?.(`.${HANDLE_CLASS}[data-id="${flowId}-${handle.nodeId}-${handle.id}-${handle.type}"]`) ??
      null)
    : null;

  const handleBelow = clientPosition ? handleElementFromPoint(doc, clientPosition.x, clientPosition.y) : null;

  // The handle under the cursor beats the nearest one; see the module comment.
  const handleToCheck = handleBelow ?? handleDomNode;

  const result = { handleDomNode: handleToCheck, isValid: false, connection: null, toHandle: null };

  if (!handleToCheck) {
    return result;
  }

  const handleType = getHandleType(undefined, handleToCheck);
  const handleNodeId = handleToCheck.getAttribute('data-nodeid');
  const handleId = handleToCheck.getAttribute('data-handleid');
  const connectable = handleToCheck.classList.contains('connectable');
  const connectableEnd = handleToCheck.classList.contains('connectableend');

  if (!handleNodeId || !handleType) {
    return result;
  }

  const connection = {
    source: isTarget ? handleNodeId : fromNodeId,
    sourceHandle: isTarget ? handleId : fromHandleId,
    target: isTarget ? fromNodeId : handleNodeId,
    targetHandle: isTarget ? fromHandleId : handleId,
  };

  result.connection = connection;

  const isConnectable = connectable && connectableEnd;
  const isValid =
    isConnectable &&
    (connectionMode === ConnectionMode.Strict
      ? (isTarget && handleType === 'source') || (!isTarget && handleType === 'target')
      : handleNodeId !== fromNodeId || handleId !== fromHandleId);

  result.isValid = isValid && isValidConnection(connection);
  result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);

  return result;
}
