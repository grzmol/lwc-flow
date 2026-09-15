import { ConnectionMode, Position } from 'c/flowTypes';
import {
  HANDLE_CLASS,
  getClosestHandle,
  getHandle,
  getHandleType,
  isConnectionValid,
  handleElementFromPoint,
  isValidHandle,
} from 'c/flowConnect';

/** A measured handle as `getHandleBounds` stores it: offsets relative to the node. */
function handleBound(nodeId, type, id, x, y, position) {
  return { id, type, nodeId, x, y, width: 8, height: 8, position };
}

/**
 * An internal node as `adoptUserNodes` produces one.
 *
 * `getHandlePosition(node, handle, ..., true)` resolves a handle centre as
 * `positionAbsolute + handle offset + half the handle size`, so the 8x8 handles
 * below land 4px past their stored offset.
 */
function internalNode(id, x, y, width, height, handleBounds) {
  return {
    id,
    position: { x, y },
    measured: { width, height },
    internals: { positionAbsolute: { x, y }, handleBounds },
  };
}

function lookupOf(...nodes) {
  return new Map(nodes.map((node) => [node.id, node]));
}

/** A handle element carrying the marker classes and data attributes the kernel reads. */
function handleElement({ flowId = 'flow', nodeId, handleId = null, type, connectable = true, end = true }) {
  const element = document.createElement('div');

  element.classList.add(HANDLE_CLASS, type);

  if (connectable) {
    element.classList.add('connectable');
  }
  if (end) {
    element.classList.add('connectableend');
  }
  if (nodeId !== null) {
    element.setAttribute('data-nodeid', nodeId);
  }
  if (handleId !== null) {
    element.setAttribute('data-handleid', handleId);
  }
  element.setAttribute('data-id', `${flowId}-${nodeId}-${handleId}-${type}`);
  document.body.appendChild(element);

  return element;
}

afterEach(() => {
  // The skill's prescribed reset; innerHTML is blocked by @lwc/lwc/no-inner-html.
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
  delete document.elementsFromPoint;
});

describe('c-flow-connect getClosestHandle', () => {
  // Node `a` has a source handle centred at (100, 25); node `b` a target at (200, 25).
  const nodeA = internalNode('a', 0, 0, 100, 50, {
    source: [handleBound('a', 'source', 's1', 96, 21, Position.Right)],
    target: [],
  });
  const nodeB = internalNode('b', 200, 0, 100, 50, {
    source: [],
    target: [handleBound('b', 'target', 't1', -4, 21, Position.Left)],
  });
  const lookup = lookupOf(nodeA, nodeB);
  const fromA = { nodeId: 'a', type: 'source', id: 's1' };

  it('returns the nearest handle inside the radius, with resolved coordinates', () => {
    const handle = getClosestHandle({ x: 190, y: 25 }, 20, lookup, fromA);

    expect(handle).toMatchObject({ nodeId: 'b', id: 't1', type: 'target', x: 200, y: 25 });
  });

  it('returns null when every handle is beyond the radius', () => {
    expect(getClosestHandle({ x: 150, y: 25 }, 20, lookup, fromA)).toBeNull();
  });

  it('accepts a handle exactly on the radius', () => {
    expect(getClosestHandle({ x: 180, y: 25 }, 20, lookup, fromA)).toMatchObject({ id: 't1' });
  });

  it('skips the handle the connection started from', () => {
    const fromB = { nodeId: 'b', type: 'target', id: 't1' };
    const handle = getClosestHandle({ x: 200, y: 25 }, 300, lookup, fromB);

    // The nearest handle is `b`'s own, at distance 0; it must be ignored.
    expect(handle).toMatchObject({ nodeId: 'a', id: 's1', x: 100, y: 25 });
  });

  it('does not skip a same-named handle on a different node', () => {
    const other = internalNode('c', 200, 0, 100, 50, {
      source: [],
      target: [handleBound('c', 'target', 't1', -4, 21, Position.Left)],
    });
    const fromB = { nodeId: 'b', type: 'target', id: 't1' };
    const handle = getClosestHandle({ x: 200, y: 25 }, 20, lookupOf(nodeB, other), fromB);

    expect(handle).toMatchObject({ nodeId: 'c', id: 't1' });
  });

  it('returns null for an empty lookup', () => {
    expect(getClosestHandle({ x: 0, y: 0 }, 20, new Map(), fromA)).toBeNull();
  });

  it('tolerates a node that has not been measured for handles', () => {
    const unmeasured = internalNode('u', 0, 0, 50, 50, undefined);

    expect(getClosestHandle({ x: 10, y: 10 }, 50, lookupOf(unmeasured), fromA)).toBeNull();
  });

  it('ignores a node whose rect is outside the search box', () => {
    const distant = internalNode('far', 10000, 10000, 50, 50, {
      source: [handleBound('far', 'source', 's1', 0, 0, Position.Left)],
      target: [],
    });

    expect(getClosestHandle({ x: 0, y: 0 }, 20, lookupOf(distant), fromA)).toBeNull();
  });

  describe('on an exact distance tie', () => {
    // Source centre (10, 0) and target centre (-10, 0): both 10 from the origin.
    const tieSource = internalNode('c', 0, 0, 20, 20, {
      source: [handleBound('c', 'source', 'cs', 6, -4, Position.Right)],
      target: [],
    });
    const tieTarget = internalNode('d', -20, 0, 20, 20, {
      source: [],
      target: [handleBound('d', 'target', 'dt', 6, -4, Position.Left)],
    });

    it('prefers the target when the connection started from a source', () => {
      const handle = getClosestHandle({ x: 0, y: 0 }, 20, lookupOf(tieSource, tieTarget), {
        nodeId: 'z',
        type: 'source',
        id: null,
      });

      expect(handle).toMatchObject({ nodeId: 'd', type: 'target', x: -10, y: 0 });
    });

    it('prefers the source when the connection started from a target', () => {
      const handle = getClosestHandle({ x: 0, y: 0 }, 20, lookupOf(tieSource, tieTarget), {
        nodeId: 'z',
        type: 'target',
        id: null,
      });

      expect(handle).toMatchObject({ nodeId: 'c', type: 'source', x: 10, y: 0 });
    });

    it('falls back to the first tied handle when no opposite type is tied', () => {
      const alsoSource = internalNode('e', -20, 0, 20, 20, {
        source: [handleBound('e', 'source', 'es', 6, -4, Position.Left)],
        target: [],
      });
      const handle = getClosestHandle({ x: 0, y: 0 }, 20, lookupOf(tieSource, alsoSource), {
        nodeId: 'z',
        type: 'source',
        id: null,
      });

      expect(handle).toMatchObject({ nodeId: 'c', type: 'source' });
    });
  });
});

describe('c-flow-connect getHandle', () => {
  const source = handleBound('a', 'source', 's1', 96, 21, Position.Right);
  const secondSource = handleBound('a', 'source', 's2', 96, 41, Position.Right);
  const target = handleBound('a', 'target', 't1', -4, 21, Position.Left);
  const lookup = lookupOf(internalNode('a', 0, 0, 100, 50, { source: [source, secondSource], target: [target] }));

  it('returns null for an unknown node', () => {
    expect(getHandle('missing', 'source', 's1', lookup, ConnectionMode.Strict)).toBeNull();
  });

  it('searches only the requested bucket in strict mode', () => {
    expect(getHandle('a', 'source', 's1', lookup, ConnectionMode.Strict)).toBe(source);
    expect(getHandle('a', 'target', 's1', lookup, ConnectionMode.Strict)).toBeNull();
    expect(getHandle('a', 'source', 't1', lookup, ConnectionMode.Strict)).toBeNull();
  });

  it('searches both buckets in loose mode', () => {
    expect(getHandle('a', 'target', 's1', lookup, ConnectionMode.Loose)).toBe(source);
    expect(getHandle('a', 'source', 't1', lookup, ConnectionMode.Loose)).toBe(target);
  });

  it('takes the first handle of the bucket without a handle id', () => {
    expect(getHandle('a', 'source', null, lookup, ConnectionMode.Strict)).toBe(source);
    expect(getHandle('a', 'target', null, lookup, ConnectionMode.Strict)).toBe(target);
    // Loose mode concatenates source before target, so the first source wins.
    expect(getHandle('a', 'target', null, lookup, ConnectionMode.Loose)).toBe(source);
  });

  it('returns null for an unknown handle id', () => {
    expect(getHandle('a', 'source', 'nope', lookup, ConnectionMode.Strict)).toBeNull();
  });

  it('returns null for a node with no measured handles', () => {
    const unmeasured = lookupOf(internalNode('u', 0, 0, 50, 50, undefined));

    expect(getHandle('u', 'source', null, unmeasured, ConnectionMode.Strict)).toBeNull();
    expect(getHandle('u', 'source', null, unmeasured, ConnectionMode.Loose)).toBeNull();
  });

  it('resolves absolute coordinates on request without mutating the stored handle', () => {
    const resolved = getHandle('a', 'source', 's1', lookup, ConnectionMode.Strict, true);

    expect(resolved).not.toBe(source);
    expect(resolved).toMatchObject({ id: 's1', type: 'source', x: 100, y: 25 });
    expect(source.x).toBe(96);
  });
});

describe('c-flow-connect getHandleType', () => {
  it('prefers the reconnect override over the DOM', () => {
    const element = document.createElement('div');

    element.classList.add('source');

    expect(getHandleType('target', element)).toBe('target');
  });

  it('reads the marker class', () => {
    const sourceElement = document.createElement('div');
    const targetElement = document.createElement('div');

    sourceElement.classList.add('source');
    targetElement.classList.add('target');

    expect(getHandleType(undefined, sourceElement)).toBe('source');
    expect(getHandleType(undefined, targetElement)).toBe('target');
  });

  it('prefers target when an element somehow carries both markers', () => {
    const element = document.createElement('div');

    element.classList.add('source', 'target');

    expect(getHandleType(undefined, element)).toBe('target');
  });

  it('returns null without a marker class or an element', () => {
    expect(getHandleType(undefined, document.createElement('div'))).toBeNull();
    expect(getHandleType(undefined, null)).toBeNull();
    expect(getHandleType(undefined, {})).toBeNull();
  });
});

describe('c-flow-connect isConnectionValid', () => {
  it('is true whenever the handle is valid', () => {
    expect(isConnectionValid(true, true)).toBe(true);
    expect(isConnectionValid(false, true)).toBe(true);
  });

  it('is false over a handle that would reject the connection', () => {
    expect(isConnectionValid(true, false)).toBe(false);
  });

  it('is null when the pointer is nowhere near a handle', () => {
    expect(isConnectionValid(false, false)).toBeNull();
  });
});

describe('c-flow-connect handleElementFromPoint', () => {
  /** A fake element: only `classList.contains` and `shadowRoot` are read. */
  function fake(isHandle, shadowRoot) {
    return { classList: { contains: (name) => isHandle && name === HANDLE_CLASS }, shadowRoot };
  }

  function rootFor(...candidates) {
    return { ownerDocument: { elementsFromPoint: () => candidates } };
  }

  it('returns null when the document cannot hit-test', () => {
    expect(handleElementFromPoint({ ownerDocument: {} }, 0, 0)).toBeNull();
  });

  it('falls back to the global document for a nullish root', () => {
    const handle = handleElement({ nodeId: 'a', handleId: 's1', type: 'source' });

    document.elementsFromPoint = jest.fn(() => [handle]);

    expect(handleElementFromPoint(null, 3, 4)).toBe(handle);
    expect(document.elementsFromPoint).toHaveBeenCalledWith(3, 4);
  });

  it('returns a handle hit directly', () => {
    const handle = fake(true);

    expect(handleElementFromPoint(rootFor(handle), 10, 20)).toBe(handle);
  });

  it('descends into a shadow root to find the handle', () => {
    const inner = fake(true);
    const host = fake(false, { elementFromPoint: () => inner });

    expect(handleElementFromPoint(rootFor(host), 10, 20)).toBe(inner);
  });

  it('descends through several shadow roots', () => {
    const inner = fake(true);
    const middle = fake(false, { elementFromPoint: () => inner });
    const host = fake(false, { elementFromPoint: () => middle });

    expect(handleElementFromPoint(rootFor(host), 10, 20)).toBe(inner);
  });

  it('moves on to the next candidate when a branch has no handle', () => {
    const handle = fake(true);

    expect(handleElementFromPoint(rootFor(fake(false), handle), 10, 20)).toBe(handle);
  });

  it('stops descending when the shadow root reports the host itself', () => {
    const host = {};

    host.classList = { contains: () => false };
    host.shadowRoot = { elementFromPoint: () => host };

    expect(handleElementFromPoint(rootFor(host), 10, 20)).toBeNull();
  });

  it('stops descending when the shadow root hits nothing', () => {
    const host = fake(false, { elementFromPoint: () => null });

    expect(handleElementFromPoint(rootFor(host), 10, 20)).toBeNull();
  });

  it('gives up rather than looping forever on an endless shadow chain', () => {
    const endless = { elementFromPoint: () => fake(false, endless) };

    expect(handleElementFromPoint(rootFor(fake(false, endless)), 10, 20)).toBeNull();
  });

  it('returns null when nothing is under the point', () => {
    expect(handleElementFromPoint(rootFor(), 10, 20)).toBeNull();
  });

  it('uses the document for a root without an owner document', () => {
    const handle = handleElement({ nodeId: 'a', handleId: 's1', type: 'source' });

    document.elementsFromPoint = jest.fn(() => [handle]);

    // `document.ownerDocument` is null, so the fallback branch is the one taken.
    expect(handleElementFromPoint(document, 5, 5)).toBe(handle);
    expect(document.elementsFromPoint).toHaveBeenCalledWith(5, 5);
  });
});

describe('c-flow-connect isValidHandle', () => {
  const targetHandleBound = handleBound('b', 'target', 't1', -4, 21, Position.Left);
  const sourceHandleBound = handleBound('b', 'source', 's1', 96, 21, Position.Right);
  const nodeLookup = lookupOf(
    internalNode('a', 0, 0, 100, 50, {
      source: [handleBound('a', 'source', 's1', 96, 21, Position.Right)],
      target: [],
    }),
    internalNode('b', 200, 0, 100, 50, { source: [sourceHandleBound], target: [targetHandleBound] })
  );

  /** Defaults for a drag that started on node `a`'s source handle. */
  function params(overrides) {
    return {
      handle: null,
      connectionMode: ConnectionMode.Strict,
      fromNodeId: 'a',
      fromHandleId: 's1',
      fromType: 'source',
      doc: document,
      flowId: 'flow',
      nodeLookup,
      clientPosition: null,
      ...overrides,
    };
  }

  it('rejects with nothing under the pointer and no nearest handle', () => {
    expect(isValidHandle(params())).toEqual({
      handleDomNode: null,
      isValid: false,
      connection: null,
      toHandle: null,
    });
  });

  it('rejects when the nearest handle has no element in the document', () => {
    const result = isValidHandle(params({ handle: targetHandleBound }));

    expect(result.handleDomNode).toBeNull();
    expect(result.connection).toBeNull();
  });

  it('resolves the nearest handle to its element by data-id', () => {
    const element = handleElement({ nodeId: 'b', handleId: 't1', type: 'target' });
    const result = isValidHandle(params({ handle: targetHandleBound }));

    expect(result.handleDomNode).toBe(element);
    expect(result.isValid).toBe(true);
  });

  it('lets the handle under the pointer win over the nearest one', () => {
    const nearest = handleElement({ nodeId: 'b', handleId: 't1', type: 'target' });
    const below = handleElement({ nodeId: 'b', handleId: 's1', type: 'source' });

    document.elementsFromPoint = jest.fn(() => [below]);

    const result = isValidHandle(params({ handle: targetHandleBound, clientPosition: { x: 5, y: 5 } }));

    expect(result.handleDomNode).toBe(below);
    expect(result.handleDomNode).not.toBe(nearest);
  });

  it('builds a source-to-target connection and marks it valid in strict mode', () => {
    handleElement({ nodeId: 'b', handleId: 't1', type: 'target' });

    const result = isValidHandle(params({ handle: targetHandleBound }));

    expect(result.connection).toEqual({
      source: 'a',
      sourceHandle: 's1',
      target: 'b',
      targetHandle: 't1',
    });
    expect(result.isValid).toBe(true);
    expect(result.toHandle).toMatchObject({ id: 't1', nodeId: 'b', type: 'target', x: 200, y: 25 });
  });

  it('orients the connection by the dragged end', () => {
    handleElement({ nodeId: 'b', handleId: 's1', type: 'source' });

    const result = isValidHandle(
      params({ handle: sourceHandleBound, fromType: 'target', fromNodeId: 'a', fromHandleId: 't1' })
    );

    expect(result.connection).toEqual({
      source: 'b',
      sourceHandle: 's1',
      target: 'a',
      targetHandle: 't1',
    });
    expect(result.isValid).toBe(true);
  });

  it('rejects source to source in strict mode but still reports the connection', () => {
    handleElement({ nodeId: 'b', handleId: 's1', type: 'source' });

    const result = isValidHandle(params({ handle: sourceHandleBound }));

    expect(result.isValid).toBe(false);
    expect(result.connection).toEqual({
      source: 'a',
      sourceHandle: 's1',
      target: 'b',
      targetHandle: 's1',
    });
    expect(result.toHandle).toMatchObject({ id: 's1', nodeId: 'b', type: 'source' });
  });

  it('accepts source to source in loose mode', () => {
    handleElement({ nodeId: 'b', handleId: 's1', type: 'source' });

    const result = isValidHandle(params({ handle: sourceHandleBound, connectionMode: ConnectionMode.Loose }));

    expect(result.isValid).toBe(true);
  });

  it('rejects only the identical handle on the identical node in loose mode', () => {
    const element = handleElement({ nodeId: 'a', handleId: 's1', type: 'source' });

    document.elementsFromPoint = jest.fn(() => [element]);

    const result = isValidHandle(params({ connectionMode: ConnectionMode.Loose, clientPosition: { x: 1, y: 1 } }));

    expect(result.isValid).toBe(false);
    expect(result.connection).toEqual({
      source: 'a',
      sourceHandle: 's1',
      target: 'a',
      targetHandle: 's1',
    });
  });

  it('accepts another handle on the same node in loose mode', () => {
    const element = handleElement({ nodeId: 'a', handleId: 's2', type: 'source' });

    document.elementsFromPoint = jest.fn(() => [element]);

    const result = isValidHandle(params({ connectionMode: ConnectionMode.Loose, clientPosition: { x: 1, y: 1 } }));

    expect(result.isValid).toBe(true);
  });

  it('rejects a handle that is not marked connectable', () => {
    handleElement({ nodeId: 'b', handleId: 't1', type: 'target', connectable: false });

    const result = isValidHandle(params({ handle: targetHandleBound }));

    expect(result.isValid).toBe(false);
    expect(result.connection).not.toBeNull();
  });

  it('rejects a handle that cannot be a connection end', () => {
    handleElement({ nodeId: 'b', handleId: 't1', type: 'target', end: false });

    const result = isValidHandle(params({ handle: targetHandleBound }));

    expect(result.isValid).toBe(false);
    expect(result.connection).not.toBeNull();
  });

  it('rejects an element without a node id before building a connection', () => {
    const element = handleElement({ nodeId: null, handleId: 't1', type: 'target' });

    document.elementsFromPoint = jest.fn(() => [element]);

    const result = isValidHandle(params({ clientPosition: { x: 1, y: 1 } }));

    expect(result).toEqual({ handleDomNode: element, isValid: false, connection: null, toHandle: null });
  });

  it('rejects an element without a handle type marker', () => {
    const element = document.createElement('div');

    element.classList.add(HANDLE_CLASS, 'connectable', 'connectableend');
    element.setAttribute('data-nodeid', 'b');
    document.body.appendChild(element);
    document.elementsFromPoint = jest.fn(() => [element]);

    const result = isValidHandle(params({ clientPosition: { x: 1, y: 1 } }));

    expect(result.connection).toBeNull();
    expect(result.isValid).toBe(false);
  });

  it('honours a consumer callback that rejects the connection', () => {
    handleElement({ nodeId: 'b', handleId: 't1', type: 'target' });

    const isValidConnection = jest.fn(() => false);
    const result = isValidHandle(params({ handle: targetHandleBound, isValidConnection }));

    expect(isValidConnection).toHaveBeenCalledWith({
      source: 'a',
      sourceHandle: 's1',
      target: 'b',
      targetHandle: 't1',
    });
    expect(result.isValid).toBe(false);
    expect(result.connection).not.toBeNull();
    expect(result.toHandle).not.toBeNull();
  });

  it('does not consult the callback for an already invalid handle', () => {
    handleElement({ nodeId: 'b', handleId: 's1', type: 'source' });

    const isValidConnection = jest.fn(() => true);

    isValidHandle(params({ handle: sourceHandleBound, isValidConnection }));

    expect(isValidConnection).not.toHaveBeenCalled();
  });

  it('reports a null handle id for an element without one', () => {
    const element = handleElement({ nodeId: 'b', handleId: null, type: 'target' });

    document.elementsFromPoint = jest.fn(() => [element]);

    const result = isValidHandle(params({ clientPosition: { x: 1, y: 1 } }));

    expect(result.connection).toEqual({
      source: 'a',
      sourceHandle: 's1',
      target: 'b',
      targetHandle: null,
    });
    // No handle id means the node's first target handle is used.
    expect(result.toHandle).toMatchObject({ id: 't1' });
  });

  it('returns a null toHandle when the node is absent from the lookup', () => {
    handleElement({ nodeId: 'z', handleId: 't1', type: 'target' });

    const result = isValidHandle(params({ handle: handleBound('z', 'target', 't1', 0, 0, Position.Left) }));

    expect(result.isValid).toBe(true);
    expect(result.toHandle).toBeNull();
  });
});
