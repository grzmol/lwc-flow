/**
 * Graph state derivation for lwc-flow: node adoption, lookups, connection maps
 * and the change reducers.
 *
 * Service component: no template, no LWC imports, no DOM access. Ported from
 * `@xyflow/system/src/utils/store.ts`, `utils/edges/general.ts` and
 * `@xyflow/react/src/utils/changes.ts`.
 *
 * The central idea, kept from upstream: the user owns a plain array of nodes and
 * edges, and the flow derives an *internal* view of it. Derivation never mutates
 * the user's objects; the original is kept on `internals.userNode` so a repeat
 * adoption of an unchanged node can be skipped by reference.
 */

import { infiniteExtent, ELEVATE_ON_SELECT_Z, errorMessages } from 'c/flowTypes';
import {
  clampPosition,
  clampPositionToParent,
  getNodeDimensions,
  getNodePositionWithOrigin,
  isCoordinateExtent,
  isNumeric,
} from 'c/flowMath';

/** z-index added to a node that is selected while `elevateNodesOnSelect` is on. */
const SELECTED_NODE_Z = ELEVATE_ON_SELECT_Z;

/** z-index step between successive root-level parent subtrees. */
const ROOT_PARENT_Z_INCREMENT = 10;

const defaultOptions = {
  nodeOrigin: [0, 0],
  nodeExtent: infiniteExtent,
  elevateNodesOnSelect: true,
  zIndexMode: 'basic',
  defaults: {},
};

const adoptUserNodesDefaultOptions = { ...defaultOptions, checkEquality: true };

/**
 * Shallow merge where an explicit `undefined` does not clobber the base value.
 * @template T
 * @param {T} base
 * @param {Partial<T>} [incoming]
 * @returns {T}
 */
function mergeObjects(base, incoming) {
  const result = { ...base };

  for (const key in incoming) {
    if (incoming[key] !== undefined) {
      result[key] = incoming[key];
    }
  }

  return result;
}

/** True when `zIndexMode` hands z-index control entirely to the caller. */
export function isManualZIndexMode(zIndexMode) {
  return zIndexMode === 'manual';
}

/**
 * Normalise user-declared handles into source/target buckets.
 *
 * Returning `undefined` for an unmeasured node without declared handles is what
 * makes the node get measured: a missing `handleBounds` is the signal that the
 * DOM has not been read yet. When the node *is* measured, the previously
 * measured bounds are carried over instead of being thrown away.
 * @param {*} userNode
 * @param {*} [internalNode] the previous internal node, if any
 * @returns {{source: Array<*>, target: Array<*>}|undefined}
 */
function parseHandles(userNode, internalNode) {
  if (!userNode.handles) {
    return !userNode.measured ? undefined : internalNode?.internals.handleBounds;
  }

  const source = [];
  const target = [];

  for (const handle of userNode.handles) {
    const handleBounds = {
      id: handle.id,
      width: handle.width ?? 1,
      height: handle.height ?? 1,
      nodeId: userNode.id,
      x: handle.x,
      y: handle.y,
      position: handle.position,
      type: handle.type,
    };

    if (handle.type === 'source') {
      source.push(handleBounds);
    } else if (handle.type === 'target') {
      target.push(handleBounds);
    }
  }

  return { source, target };
}

/**
 * z-index for one node: its own, plus the selection bump when enabled.
 * @returns {number}
 */
function calculateZ(node, selectedNodeZ, zIndexMode) {
  const zIndex = isNumeric(node.zIndex) ? node.zIndex : 0;

  if (isManualZIndexMode(zIndexMode)) {
    return zIndex;
  }

  return zIndex + (node.selected ? selectedNodeZ : 0);
}

/**
 * Absolute position and z-index of a child node.
 *
 * A child's `position` is relative to its parent, so the parent's absolute
 * position is added. A child is always at least one above its parent, otherwise
 * it would render behind the parent's own background.
 * @returns {{x: number, y: number, z: number}}
 */
function calculateChildXYZ(childNode, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode) {
  const { x: parentX, y: parentY } = parentNode.internals.positionAbsolute;
  const childDimensions = getNodeDimensions(childNode);
  const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
  const clampedPosition = isCoordinateExtent(childNode.extent)
    ? clampPosition(positionWithOrigin, childNode.extent, childDimensions)
    : positionWithOrigin;

  let absolutePosition = clampPosition(
    { x: parentX + clampedPosition.x, y: parentY + clampedPosition.y },
    nodeExtent,
    childDimensions
  );

  if (childNode.extent === 'parent') {
    absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
  }

  const childZ = calculateZ(childNode, selectedNodeZ, zIndexMode);
  const parentZ = parentNode.internals.z ?? 0;

  return {
    x: absolutePosition.x,
    y: absolutePosition.y,
    z: parentZ >= childZ ? parentZ + 1 : childZ,
  };
}

/** Register `node` under its parent in `parentLookup`. */
function updateParentLookup(node, parentLookup) {
  if (!node.parentId) {
    return;
  }

  const childNodes = parentLookup.get(node.parentId);

  if (childNodes) {
    childNodes.set(node.id, node);
  } else {
    parentLookup.set(node.parentId, new Map([[node.id, node]]));
  }
}

/**
 * Recompute a child's absolute position and z-index, and index it under its parent.
 *
 * Requires the parent to already be in `nodeLookup`, which is why the node array
 * must list parents before their children. A missing parent is reported and the
 * child is left where it is rather than silently reparented to the root.
 * @param {*} node internal child node
 * @param {Map<string, *>} nodeLookup
 * @param {Map<string, Map<string, *>>} parentLookup
 * @param {Object} options
 * @param {{i: number}} [rootParentIndex] running counter used to separate parent subtrees
 * @param {(id: string, message: string) => void} [onError]
 */
function updateChildNode(node, nodeLookup, parentLookup, options, rootParentIndex, onError) {
  const { elevateNodesOnSelect, nodeOrigin, nodeExtent, zIndexMode } = mergeObjects(defaultOptions, options);
  const parentId = node.parentId;
  const parentNode = nodeLookup.get(parentId);

  if (!parentNode) {
    onError?.(
      '005',
      `Parent node ${parentId} not found. Make sure that parent nodes come before their child nodes in the nodes array.`
    );
    return;
  }

  updateParentLookup(node, parentLookup);

  /*
   * Each root-level parent gets its own z band so that a child of one group can
   * never interleave with a child of another. Only the first child triggers the
   * assignment; later children reuse the band.
   */
  if (
    rootParentIndex &&
    !parentNode.parentId &&
    parentNode.internals.rootParentIndex === undefined &&
    zIndexMode === 'auto'
  ) {
    parentNode.internals.rootParentIndex = ++rootParentIndex.i;
    parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
  }

  if (rootParentIndex && parentNode.internals.rootParentIndex !== undefined) {
    rootParentIndex.i = parentNode.internals.rootParentIndex;
  }

  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const { x, y, z } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
  const { positionAbsolute } = node.internals;
  const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;

  if (positionChanged || z !== node.internals.z) {
    // A new object marks the node as updated for subscribers comparing by reference.
    nodeLookup.set(node.id, {
      ...node,
      internals: {
        ...node.internals,
        positionAbsolute: positionChanged ? { x, y } : positionAbsolute,
        z,
      },
    });
  }
}

/**
 * Recompute every node's absolute position in place.
 *
 * Cheaper than a full adoption; used after a viewport-independent change such as
 * `nodeExtent` moving.
 * @param {Map<string, *>} nodeLookup
 * @param {Map<string, Map<string, *>>} parentLookup
 * @param {Object} [options]
 */
export function updateAbsolutePositions(nodeLookup, parentLookup, options) {
  const opts = mergeObjects(defaultOptions, options);

  for (const node of nodeLookup.values()) {
    if (node.parentId) {
      updateChildNode(node, nodeLookup, parentLookup, opts);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(node, opts.nodeOrigin);
      const extent = isCoordinateExtent(node.extent) ? node.extent : opts.nodeExtent;
      node.internals.positionAbsolute = clampPosition(positionWithOrigin, extent, getNodeDimensions(node));
    }
  }
}

/**
 * Derive the internal node view from the user's node array.
 *
 * Rebuilds `nodeLookup` and `parentLookup` from scratch every call. That is not
 * as wasteful as it looks: when `checkEquality` is on, a node whose user object
 * is reference-identical to last time is carried over untouched, so an unchanged
 * graph costs one map insert per node and no allocation.
 *
 * Parents must precede their children in `nodes`.
 * @param {Array<*>} nodes user nodes
 * @param {Map<string, *>} nodeLookup mutated: receives the internal nodes
 * @param {Map<string, Map<string, *>>} parentLookup mutated: receives child maps
 * @param {Object} [options]
 * @param {import('c/flowTypes').NodeOrigin} [options.nodeOrigin=[0,0]]
 * @param {import('c/flowTypes').CoordinateExtent} [options.nodeExtent]
 * @param {boolean} [options.elevateNodesOnSelect=true]
 * @param {'basic'|'auto'|'manual'} [options.zIndexMode='basic']
 * @param {Object} [options.defaults] applied under every user node
 * @param {boolean} [options.checkEquality=true]
 * @param {(id: string, message: string) => void} [options.onError]
 * @returns {{nodesInitialized: boolean, hasSelectedNodes: boolean}}
 */
export function adoptUserNodes(nodes, nodeLookup, parentLookup, options = {}) {
  const opts = mergeObjects(adoptUserNodesDefaultOptions, options);
  const onError = options.onError;
  const rootParentIndex = { i: 0 };
  const tmpLookup = new Map(nodeLookup);
  const selectedNodeZ = opts.elevateNodesOnSelect && !isManualZIndexMode(opts.zIndexMode) ? SELECTED_NODE_Z : 0;

  let nodesInitialized = nodes.length > 0;
  let hasSelectedNodes = false;

  nodeLookup.clear();
  parentLookup.clear();

  for (const userNode of nodes) {
    let internalNode = tmpLookup.get(userNode.id);

    if (opts.checkEquality && userNode === internalNode?.internals.userNode) {
      nodeLookup.set(userNode.id, internalNode);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(userNode, opts.nodeOrigin);
      const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : opts.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));

      internalNode = {
        ...opts.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height,
        },
        internals: {
          positionAbsolute: clampedPosition,
          handleBounds: parseHandles(userNode, internalNode),
          z: calculateZ(userNode, selectedNodeZ, opts.zIndexMode),
          userNode,
        },
      };

      nodeLookup.set(userNode.id, internalNode);
    }

    if (
      (internalNode.measured === undefined ||
        internalNode.measured.width === undefined ||
        internalNode.measured.height === undefined) &&
      !internalNode.hidden
    ) {
      nodesInitialized = false;
    }

    if (userNode.parentId) {
      updateChildNode(internalNode, nodeLookup, parentLookup, options, rootParentIndex, onError);
    }

    hasSelectedNodes = hasSelectedNodes || (userNode.selected ?? false);
  }

  return { nodesInitialized, hasSelectedNodes };
}

/**
 * Index one connection under `nodeId`, `nodeId-type` and `nodeId-type-handleId`.
 *
 * Three keys rather than one so a consumer can ask "everything touching this
 * node", "everything on its source side", or "everything on this exact handle"
 * without scanning.
 */
function addConnectionToLookup(type, connection, connectionKey, connectionLookup, nodeId, handleId) {
  let key = nodeId;
  const nodeMap = connectionLookup.get(key) || new Map();
  connectionLookup.set(key, nodeMap.set(connectionKey, connection));

  key = `${nodeId}-${type}`;
  const typeMap = connectionLookup.get(key) || new Map();
  connectionLookup.set(key, typeMap.set(connectionKey, connection));

  if (handleId) {
    key = `${nodeId}-${type}-${handleId}`;
    const handleMap = connectionLookup.get(key) || new Map();
    connectionLookup.set(key, handleMap.set(connectionKey, connection));
  }
}

/**
 * Rebuild the connection and edge lookups from the edge array.
 * @param {Map<string, Map<string, *>>} connectionLookup mutated
 * @param {Map<string, *>} edgeLookup mutated
 * @param {Array<*>} edges
 */
export function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
  connectionLookup.clear();
  edgeLookup.clear();

  for (const edge of edges) {
    const { source: sourceNode, target: targetNode, sourceHandle = null, targetHandle = null } = edge;

    const connection = {
      edgeId: edge.id,
      source: sourceNode,
      target: targetNode,
      sourceHandle,
      targetHandle,
    };
    const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
    const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;

    addConnectionToLookup('source', connection, targetKey, connectionLookup, sourceNode, sourceHandle);
    addConnectionToLookup('target', connection, sourceKey, connectionLookup, targetNode, targetHandle);

    edgeLookup.set(edge.id, edge);
  }
}

/**
 * Deterministic edge id from its endpoints. Two connections between the same
 * pair of handles produce the same id, which is what makes duplicate detection
 * work without an id being supplied.
 * @param {import('c/flowTypes').Connection|import('c/flowTypes').FlowEdge} params
 * @returns {string}
 */
export function getEdgeId({ source, sourceHandle, target, targetHandle }) {
  return `xy-edge__${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
}

/** True when an equivalent edge already exists. A null handle and a missing handle are the same thing. */
function connectionExists(edge, edges) {
  return edges.some(
    (el) =>
      el.source === edge.source &&
      el.target === edge.target &&
      (el.sourceHandle === edge.sourceHandle || (!el.sourceHandle && !edge.sourceHandle)) &&
      (el.targetHandle === edge.targetHandle || (!el.targetHandle && !edge.targetHandle))
  );
}

/** True when the object already looks like a full edge rather than a bare connection. */
function isEdgeLike(value) {
  return !!value && 'id' in value && 'source' in value && 'target' in value;
}

/**
 * Append an edge to an edge array, skipping invalid and duplicate edges.
 *
 * Returns the original array unchanged when nothing was added, so a caller can
 * compare by reference to detect a no-op.
 * @param {import('c/flowTypes').FlowEdge|import('c/flowTypes').Connection} edgeParams
 * @param {Array<*>} edges
 * @param {{getEdgeId?: Function, onError?: Function}} [options]
 * @returns {Array<*>}
 */
export function addEdge(edgeParams, edges, options = {}) {
  if (!edgeParams.source || !edgeParams.target) {
    options.onError?.('006', errorMessages.error006());
    return edges;
  }

  const edgeIdGenerator = options.getEdgeId || getEdgeId;
  const edge = isEdgeLike(edgeParams) ? { ...edgeParams } : { ...edgeParams, id: edgeIdGenerator(edgeParams) };

  if (connectionExists(edge, edges)) {
    return edges;
  }

  // A null handle is normalised away so later equality checks stay simple.
  if (edge.sourceHandle === null) {
    delete edge.sourceHandle;
  }
  if (edge.targetHandle === null) {
    delete edge.targetHandle;
  }

  return edges.concat(edge);
}

/**
 * Repoint an existing edge at a new connection, keeping its other properties.
 *
 * The edge is removed and re-appended rather than updated in place, so it ends
 * up last in paint order. That matches upstream.
 * @param {*} oldEdge
 * @param {import('c/flowTypes').Connection} newConnection
 * @param {Array<*>} edges
 * @param {{shouldReplaceId?: boolean, getEdgeId?: Function, onError?: Function}} [options]
 * @returns {Array<*>}
 */
export function reconnectEdge(oldEdge, newConnection, edges, options = { shouldReplaceId: true }) {
  const { id: oldEdgeId, ...rest } = oldEdge;

  if (!newConnection.source || !newConnection.target) {
    options.onError?.('006', errorMessages.error006());
    return edges;
  }

  const foundEdge = edges.find((e) => e.id === oldEdge.id);

  if (!foundEdge) {
    options.onError?.('007', errorMessages.error007(oldEdgeId));
    return edges;
  }

  const edgeIdGenerator = options.getEdgeId || getEdgeId;
  const edge = {
    ...rest,
    id: options.shouldReplaceId ? edgeIdGenerator(newConnection) : oldEdgeId,
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle,
  };

  return edges.filter((e) => e.id !== oldEdgeId).concat(edge);
}

/**
 * Apply one change to an element. Mutates `element`, which is always a fresh
 * shallow copy made by {@link applyChanges}.
 */
function applyChange(change, element) {
  switch (change.type) {
    case 'select':
      element.selected = change.selected;
      break;

    case 'position':
      if (typeof change.position !== 'undefined') {
        element.position = change.position;
      }
      if (typeof change.dragging !== 'undefined') {
        element.dragging = change.dragging;
      }
      break;

    case 'dimensions':
      if (typeof change.dimensions !== 'undefined') {
        element.measured = { ...change.dimensions };

        if (change.setAttributes) {
          if (change.setAttributes === true || change.setAttributes === 'width') {
            element.width = change.dimensions.width;
          }
          if (change.setAttributes === true || change.setAttributes === 'height') {
            element.height = change.dimensions.height;
          }
        }
      }
      if (typeof change.resizing === 'boolean') {
        element.resizing = change.resizing;
      }
      break;

    default:
      break;
  }
}

/**
 * Fold a change list into an element array, returning a new array.
 *
 * Changes are bucketed by id first so each element is visited once. A queued
 * `remove` or `replace` discards every other change for that element, because
 * applying a position update to something about to disappear is wasted work.
 * `add` changes are deferred to the end so their `index` refers to the final
 * array rather than an intermediate one.
 * @param {Array<*>} changes
 * @param {Array<*>} elements
 * @returns {Array<*>}
 */
function applyChanges(changes, elements) {
  const updatedElements = [];
  const changesMap = new Map();
  const addItemChanges = [];

  for (const change of changes) {
    if (change.type === 'add') {
      addItemChanges.push(change);
      continue;
    }

    if (change.type === 'remove' || change.type === 'replace') {
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);

      if (elementChanges) {
        elementChanges.push(change);
      } else {
        changesMap.set(change.id, [change]);
      }
    }
  }

  for (const element of elements) {
    const elementChanges = changesMap.get(element.id);

    if (!elementChanges) {
      updatedElements.push(element);
      continue;
    }

    if (elementChanges[0].type === 'remove') {
      continue;
    }

    if (elementChanges[0].type === 'replace') {
      updatedElements.push({ ...elementChanges[0].item });
      continue;
    }

    const updatedElement = { ...element };

    for (const change of elementChanges) {
      applyChange(change, updatedElement);
    }

    updatedElements.push(updatedElement);
  }

  for (const change of addItemChanges) {
    if (change.index !== undefined) {
      updatedElements.splice(change.index, 0, { ...change.item });
    } else {
      updatedElements.push({ ...change.item });
    }
  }

  return updatedElements;
}

/**
 * Apply node changes emitted by the flow to your node array.
 * @param {Array<*>} changes
 * @param {Array<*>} nodes
 * @returns {Array<*>}
 */
export function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}

/**
 * Apply edge changes emitted by the flow to your edge array.
 * @param {Array<*>} changes
 * @param {Array<*>} edges
 * @returns {Array<*>}
 */
export function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}

/**
 * A `select` change for one element.
 * @param {string} id
 * @param {boolean} selected
 * @returns {{id: string, type: 'select', selected: boolean}}
 */
export function createSelectionChange(id, selected) {
  return { id, type: 'select', selected };
}

/**
 * A `remove` change for one element.
 * @param {{id: string}} item
 * @returns {{id: string, type: 'remove'}}
 */
export function elementToRemoveChange(item) {
  return { id: item.id, type: 'remove' };
}

/**
 * The minimal set of `select` changes that moves `items` to exactly `selectedIds`.
 *
 * Only elements whose selection actually differs produce a change, so a
 * re-selection of the same set emits nothing and no re-render is triggered.
 * @param {Map<string, *>} items
 * @param {Set<string>} [selectedIds]
 * @param {boolean} [mutateItem=false] also write `selected` onto the item
 * @returns {Array<*>}
 */
export function getSelectionChanges(items, selectedIds = new Set(), mutateItem = false) {
  const changes = [];

  for (const [id, item] of items) {
    const willBeSelected = selectedIds.has(id);

    // Nothing to do when the item is already in the desired state.
    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      if (mutateItem) {
        /*
         * The Svelte and React stores keep `selected` on the item itself so
         * the renderer can read it without a second lookup.
         */
        item.selected = willBeSelected;
      }
      changes.push(createSelectionChange(item.id, willBeSelected));
    }
  }

  return changes;
}

/**
 * Changes needed to turn `lookup` into `items`: `remove` for what disappeared,
 * `add` for what appeared, `replace` for what is no longer reference-identical.
 * @param {{items?: Array<*>, lookup: Map<string, *>}} params
 * @returns {Array<*>}
 */
export function getElementsDiffChanges({ items = [], lookup }) {
  const changes = [];
  const itemsLookup = new Map(items.map((item) => [item.id, item]));

  for (const [index, item] of items.entries()) {
    const lookupItem = lookup.get(item.id);
    const storeItem = lookupItem?.internals?.userNode ?? lookupItem;

    if (storeItem !== undefined && storeItem !== item) {
      changes.push({ id: item.id, item, type: 'replace' });
    }

    if (storeItem === undefined) {
      changes.push({ item, type: 'add', index });
    }
  }

  for (const [id] of lookup) {
    const nextItem = itemsLookup.get(id);

    if (nextItem === undefined) {
      changes.push({ id, type: 'remove' });
    }
  }

  return changes;
}
