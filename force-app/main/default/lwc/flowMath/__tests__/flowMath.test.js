import { Position } from 'c/flowTypes';
import {
  clamp,
  isNumeric,
  isRectObject,
  clampPosition,
  clampPositionToParent,
  calcAutoPan,
  getBoundsOfBoxes,
  rectToBox,
  boxToRect,
  getBoundsOfRects,
  isInternalNode,
  getNodeDimensions,
  nodeHasDimensions,
  getNodePositionWithOrigin,
  nodeToRect,
  nodeToBox,
  getRectsOverlappingArea,
  getOverlappingArea,
  snapPosition,
  pointToRendererPoint,
  rendererPointToPoint,
  isCoordinateExtent,
  evaluateAbsolutePosition,
  areSetsEqual,
  getViewportForBounds,
  getNodesBounds,
  getInternalNodesBounds,
  getViewportRect,
  getNodesInside,
  getHandlePosition,
} from 'c/flowMath';

/** An adopted node: absolute position plus measured bounds, as `adoptUserNodes` produces. */
function internalNode(id, x, y, width, height, extra = {}) {
  return {
    id,
    position: { x, y },
    measured: { width, height },
    internals: {
      positionAbsolute: { x, y },
      handleBounds: { source: [], target: [] },
    },
    ...extra,
  };
}

describe('c-flow-math clamp', () => {
  it('passes a value already inside the range through', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns the bound itself at each end', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('clamps outside both bounds', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it('defaults to the unit range', () => {
    expect(clamp(0.5)).toBe(0.5);
    expect(clamp(2)).toBe(1);
    expect(clamp(-2)).toBe(0);
  });

  it('collapses to min when the range is inverted', () => {
    expect(clamp(5, 10, 0)).toBe(0);
  });
});

describe('c-flow-math isNumeric', () => {
  it('accepts finite numbers including zero and negatives', () => {
    expect(isNumeric(0)).toBe(true);
    expect(isNumeric(-3.5)).toBe(true);
  });

  it('rejects NaN and both infinities', () => {
    expect(isNumeric(NaN)).toBe(false);
    expect(isNumeric(Infinity)).toBe(false);
    expect(isNumeric(-Infinity)).toBe(false);
  });

  it('rejects non-numbers, including numeric strings', () => {
    expect(isNumeric('1')).toBe(false);
    expect(isNumeric(null)).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
  });
});

describe('c-flow-math isRectObject', () => {
  it('accepts a rect with four finite fields', () => {
    expect(isRectObject({ x: 0, y: 0, width: 1, height: 1 })).toBe(true);
  });

  it('rejects a rect with any field missing or non-finite', () => {
    expect(isRectObject({ x: 0, y: 0, width: 1 })).toBe(false);
    expect(isRectObject({ x: 0, y: 0, width: 1, height: NaN })).toBe(false);
    expect(isRectObject({ x: 0, y: null, width: 1, height: 1 })).toBe(false);
  });

  it('rejects nullish input', () => {
    expect(isRectObject(null)).toBe(false);
    expect(isRectObject(undefined)).toBe(false);
  });
});

describe('c-flow-math clampPosition', () => {
  const extent200 = [
    [0, 0],
    [200, 200],
  ];
  const extent10 = [
    [0, 0],
    [10, 10],
  ];

  it('reduces the upper bound by the box size so the far edge is what gets constrained', () => {
    expect(clampPosition({ x: 180, y: 190 }, extent200, { width: 50, height: 60 })).toEqual({
      x: 150,
      y: 140,
    });
  });

  it('leaves a position that already fits alone', () => {
    expect(clampPosition({ x: 100, y: 90 }, extent200, { width: 50, height: 60 })).toEqual({
      x: 100,
      y: 90,
    });
  });

  it('clamps against the lower bound', () => {
    expect(clampPosition({ x: -30, y: -40 }, extent200, { width: 10, height: 10 })).toEqual({
      x: 0,
      y: 0,
    });
  });

  it('treats a missing dimension as zero', () => {
    expect(clampPosition({ x: 15, y: 15 }, extent10)).toEqual({ x: 10, y: 10 });
    expect(clampPosition({ x: 15, y: 15 }, extent10, null)).toEqual({ x: 10, y: 10 });
    expect(clampPosition({ x: 15, y: 15 }, extent10, { width: 4 })).toEqual({ x: 6, y: 10 });
  });

  it('defaults to the origin inside an unconstrained extent', () => {
    expect(clampPosition()).toEqual({ x: 0, y: 0 });
  });
});

describe('c-flow-math clampPositionToParent', () => {
  const parent = {
    measured: { width: 100, height: 100 },
    internals: { positionAbsolute: { x: 10, y: 20 } },
  };

  it('pins the child inside the parent far edge, minus the child size', () => {
    expect(clampPositionToParent({ x: 200, y: 200 }, { width: 30, height: 40 }, parent)).toEqual({
      x: 80,
      y: 80,
    });
  });

  it('pins the child to the parent origin when it runs off the near edge', () => {
    expect(clampPositionToParent({ x: 0, y: 0 }, { width: 30, height: 40 }, parent)).toEqual({ x: 10, y: 20 });
  });

  it('leaves a child that already fits alone', () => {
    expect(clampPositionToParent({ x: 40, y: 50 }, { width: 30, height: 40 }, parent)).toEqual({ x: 40, y: 50 });
  });
});

describe('c-flow-math calcAutoPan', () => {
  const bounds = { width: 400, height: 300 };

  it('returns no movement in the dead zone', () => {
    expect(calcAutoPan({ x: 200, y: 150 }, bounds)).toEqual([0, 0]);
  });

  it('returns no movement exactly at the band boundary', () => {
    expect(calcAutoPan({ x: 40, y: 40 }, bounds)).toEqual([0, 0]);
    expect(calcAutoPan({ x: 360, y: 260 }, bounds)).toEqual([0, 0]);
  });

  it('ramps positively near the near edges', () => {
    expect(calcAutoPan({ x: 10, y: 150 }, bounds)).toEqual([11.25, 0]);
    expect(calcAutoPan({ x: 200, y: 5 }, bounds)).toEqual([0, 13.125]);
  });

  it('flips the sign at the far edges', () => {
    expect(calcAutoPan({ x: 395, y: 150 }, bounds)).toEqual([-13.125, 0]);
    expect(calcAutoPan({ x: 200, y: 299 }, bounds)).toEqual([0, -14.625]);
  });

  it('keeps a floor of one pixel of velocity just inside the band', () => {
    expect(calcAutoPan({ x: 39.5, y: 150 }, bounds)).toEqual([0.375, 0]);
  });

  it('scales linearly with the speed argument', () => {
    expect(calcAutoPan({ x: 10, y: 150 }, bounds, 30, 40)).toEqual([22.5, 0]);
  });

  it('widens the band with the distance argument', () => {
    // 60 sits in the dead zone at distance 40 but inside the band at distance 100.
    expect(calcAutoPan({ x: 60, y: 150 }, bounds, 15, 100)).toEqual([6, 0]);
  });
});

describe('c-flow-math box and rect conversion', () => {
  it('takes the smallest box containing both boxes', () => {
    expect(getBoundsOfBoxes({ x: 0, y: 0, x2: 10, y2: 10 }, { x: 5, y: -5, x2: 20, y2: 8 })).toEqual({
      x: 0,
      y: -5,
      x2: 20,
      y2: 10,
    });
  });

  it('round-trips a rect through a box', () => {
    const rect = { x: 1, y: 2, width: 3, height: 4 };

    expect(rectToBox(rect)).toEqual({ x: 1, y: 2, x2: 4, y2: 6 });
    expect(boxToRect(rectToBox(rect))).toEqual(rect);
  });

  it('takes the smallest rect containing both rects', () => {
    expect(getBoundsOfRects({ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 5, width: 10, height: 10 })).toEqual({
      x: 0,
      y: 0,
      width: 30,
      height: 15,
    });
  });

  it('returns the enclosing rect when one rect contains the other', () => {
    expect(getBoundsOfRects({ x: 0, y: 0, width: 50, height: 50 }, { x: 10, y: 10, width: 5, height: 5 })).toEqual({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    });
  });
});

describe('c-flow-math isInternalNode', () => {
  it('is true only for a node carrying live internals', () => {
    expect(isInternalNode({ internals: { positionAbsolute: { x: 0, y: 0 } } })).toBe(true);
    expect(isInternalNode({ internals: undefined })).toBe(false);
    expect(isInternalNode({ id: 'a' })).toBe(false);
    expect(isInternalNode(null)).toBe(false);
  });
});

describe('c-flow-math getNodeDimensions', () => {
  it('prefers the measured size', () => {
    expect(
      getNodeDimensions({
        measured: { width: 10, height: 20 },
        width: 1,
        height: 2,
        initialWidth: 3,
        initialHeight: 4,
      })
    ).toEqual({ width: 10, height: 20 });
  });

  it('falls back to the explicit size', () => {
    expect(getNodeDimensions({ width: 5, height: 6, initialWidth: 7, initialHeight: 8 })).toEqual({
      width: 5,
      height: 6,
    });
  });

  it('falls back to the initial size', () => {
    expect(getNodeDimensions({ initialWidth: 9, initialHeight: 11 })).toEqual({ width: 9, height: 11 });
  });

  it('falls back to zero', () => {
    expect(getNodeDimensions({})).toEqual({ width: 0, height: 0 });
  });

  it('resolves each axis independently', () => {
    expect(getNodeDimensions({ measured: { width: 10 }, height: 7, initialHeight: 99 })).toEqual({
      width: 10,
      height: 7,
    });
  });
});

describe('c-flow-math nodeHasDimensions', () => {
  it('is true for any source of a size, including an explicit zero', () => {
    expect(nodeHasDimensions({ measured: { width: 1, height: 2 } })).toBe(true);
    expect(nodeHasDimensions({ width: 1, height: 2 })).toBe(true);
    expect(nodeHasDimensions({ initialWidth: 1, initialHeight: 2 })).toBe(true);
    expect(nodeHasDimensions({ width: 0, height: 0 })).toBe(true);
  });

  it('is false only when every source of that axis is undefined', () => {
    expect(nodeHasDimensions({})).toBe(false);
    expect(nodeHasDimensions({ initialWidth: 1 })).toBe(false);
    expect(nodeHasDimensions({ measured: { width: 1 }, height: undefined })).toBe(false);
  });
});

describe('c-flow-math getNodePositionWithOrigin', () => {
  const node = { position: { x: 100, y: 200 }, measured: { width: 40, height: 20 } };

  it('leaves the position alone at the default top-left origin', () => {
    expect(getNodePositionWithOrigin(node)).toEqual({ x: 100, y: 200 });
  });

  it('shifts by a fraction of the node size', () => {
    expect(getNodePositionWithOrigin(node, [0.5, 0.5])).toEqual({ x: 80, y: 190 });
  });

  it('lets the node origin win over the flow origin', () => {
    expect(getNodePositionWithOrigin({ ...node, origin: [1, 1] }, [0, 0])).toEqual({ x: 60, y: 180 });
  });
});

describe('c-flow-math nodeToRect and nodeToBox', () => {
  const raw = { position: { x: 10, y: 20 }, width: 30, height: 40 };
  const adopted = {
    position: { x: 1, y: 2 },
    measured: { width: 5, height: 6 },
    internals: { positionAbsolute: { x: 100, y: 200 } },
  };

  it('uses the origin-shifted position for a raw user node', () => {
    expect(nodeToRect(raw)).toEqual({ x: 10, y: 20, width: 30, height: 40 });
    expect(nodeToRect(raw, [0.5, 0])).toEqual({ x: -5, y: 20, width: 30, height: 40 });
  });

  it('uses the stored absolute position for an adopted node and ignores the origin', () => {
    expect(nodeToRect(adopted, [0.5, 0.5])).toEqual({ x: 100, y: 200, width: 5, height: 6 });
  });

  it('produces the matching box form', () => {
    expect(nodeToBox(raw)).toEqual({ x: 10, y: 20, x2: 40, y2: 60 });
    expect(nodeToBox(adopted)).toEqual({ x: 100, y: 200, x2: 105, y2: 206 });
    expect(nodeToBox(raw, [0.5, 0])).toEqual({ x: -5, y: 20, x2: 25, y2: 60 });
  });
});

describe('c-flow-math getOverlappingArea', () => {
  const a = { x: 0, y: 0, width: 10, height: 10 };

  it('returns the intersection area when the rects overlap', () => {
    expect(getOverlappingArea(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(25);
  });

  it('returns zero when the rects only touch along an edge', () => {
    expect(getOverlappingArea(a, { x: 10, y: 0, width: 10, height: 10 })).toBe(0);
    expect(getOverlappingArea(a, { x: 0, y: 10, width: 10, height: 10 })).toBe(0);
  });

  it('returns zero for disjoint rects rather than a negative area', () => {
    expect(getOverlappingArea(a, { x: 20, y: 20, width: 5, height: 5 })).toBe(0);
    expect(getOverlappingArea(a, { x: -30, y: 0, width: 5, height: 10 })).toBe(0);
  });

  it('rounds the area up', () => {
    // 9.5 * 9.5 = 90.25 -> 91
    expect(getOverlappingArea(a, { x: 0.5, y: 0.5, width: 10, height: 10 })).toBe(91);
  });

  it('returns the contained area when one rect swallows the other', () => {
    expect(getOverlappingArea(a, { x: 2, y: 2, width: 3, height: 4 })).toBe(12);
  });

  it('exposes the same maths in scalar form', () => {
    expect(getRectsOverlappingArea(0, 0, 10, 10, 5, 5, 10, 10)).toBe(25);
    expect(getRectsOverlappingArea(0, 0, 10, 10, 20, 20, 5, 5)).toBe(0);
  });
});

describe('c-flow-math snapPosition', () => {
  it('rounds to the nearest intersection', () => {
    expect(snapPosition({ x: 12, y: 17 }, [10, 10])).toEqual({ x: 10, y: 20 });
  });

  it('rounds negatives toward the nearest intersection', () => {
    expect(snapPosition({ x: -12, y: -17 }, [10, 10])).toEqual({ x: -10, y: -20 });
  });

  it('rounds an exact midpoint up, in both signs', () => {
    expect(snapPosition({ x: 15, y: 25 }, [10, 10])).toEqual({ x: 20, y: 30 });
    expect(snapPosition({ x: -15, y: -25 }, [10, 10])).toEqual({ x: -10, y: -20 });
  });

  it('uses independent grid steps per axis', () => {
    expect(snapPosition({ x: 13, y: 13 }, [5, 20])).toEqual({ x: 15, y: 20 });
  });

  it('defaults to a unit grid', () => {
    expect(snapPosition({ x: 1.4, y: 1.6 })).toEqual({ x: 1, y: 2 });
  });
});

describe('c-flow-math pointToRendererPoint and rendererPointToPoint', () => {
  const transforms = [
    [0, 0, 1],
    [100, 50, 2],
    [-20, 30, 0.5],
  ];

  it('converts pane pixels to flow coordinates', () => {
    expect(pointToRendererPoint({ x: 300, y: 150 }, [100, 50, 2])).toEqual({ x: 100, y: 50 });
    expect(pointToRendererPoint({ x: 0, y: 0 }, [-20, 30, 0.5])).toEqual({ x: 40, y: -60 });
  });

  it('converts flow coordinates back to pane pixels', () => {
    expect(rendererPointToPoint({ x: 100, y: 50 }, [100, 50, 2])).toEqual({ x: 300, y: 150 });
    expect(rendererPointToPoint({ x: 40, y: -60 }, [-20, 30, 0.5])).toEqual({ x: 0, y: 0 });
  });

  it('round-trips for every transform', () => {
    for (const transform of transforms) {
      const point = { x: 123, y: -45 };

      expect(rendererPointToPoint(pointToRendererPoint(point, transform), transform)).toEqual(point);
    }
  });

  it('snaps only when asked', () => {
    expect(pointToRendererPoint({ x: 53, y: 57 }, [0, 0, 1], false, [25, 25])).toEqual({ x: 53, y: 57 });
    expect(pointToRendererPoint({ x: 53, y: 57 }, [0, 0, 1], true, [25, 25])).toEqual({ x: 50, y: 50 });
  });

  it('snaps after the transform, not before', () => {
    // (300 - 100) / 2 = 100, (150 - 50) / 2 = 50; on a 30 grid that is 90 and 60.
    expect(pointToRendererPoint({ x: 300, y: 150 }, [100, 50, 2], true, [30, 30])).toEqual({ x: 90, y: 60 });
  });
});

describe('c-flow-math isCoordinateExtent', () => {
  it('rejects the parent sentinel and nullish values', () => {
    expect(isCoordinateExtent('parent')).toBe(false);
    expect(isCoordinateExtent(undefined)).toBe(false);
    expect(isCoordinateExtent(null)).toBe(false);
  });

  it('accepts a real extent', () => {
    expect(
      isCoordinateExtent([
        [0, 0],
        [1, 1],
      ])
    ).toBe(true);
  });
});

describe('c-flow-math evaluateAbsolutePosition', () => {
  const nodeLookup = new Map([['p', { internals: { positionAbsolute: { x: 100, y: 200 } } }]]);

  it('adds the parent absolute position', () => {
    expect(evaluateAbsolutePosition({ x: 10, y: 20 }, { width: 50, height: 60 }, 'p', nodeLookup, [0, 0])).toEqual({
      x: 110,
      y: 220,
    });
  });

  it('subtracts the flow origin scaled by the child size', () => {
    expect(evaluateAbsolutePosition({ x: 10, y: 20 }, { width: 50, height: 60 }, 'p', nodeLookup, [0.5, 0.5])).toEqual({
      x: 85,
      y: 190,
    });
  });

  it('lets the parent origin win over the flow origin', () => {
    const withOrigin = new Map([['p', { origin: [1, 1], internals: { positionAbsolute: { x: 100, y: 200 } } }]]);

    expect(evaluateAbsolutePosition({ x: 10, y: 20 }, { width: 50, height: 60 }, 'p', withOrigin, [0, 0])).toEqual({
      x: 60,
      y: 160,
    });
  });

  it('treats a missing dimensions argument as zero-sized', () => {
    expect(evaluateAbsolutePosition({ x: 1, y: 2 }, undefined, 'p', nodeLookup, [0.5, 0.5])).toEqual({
      x: 101,
      y: 202,
    });
  });

  it('treats an individually missing dimension as zero', () => {
    expect(evaluateAbsolutePosition({ x: 1, y: 2 }, {}, 'p', nodeLookup, [0.5, 0.5])).toEqual({
      x: 101,
      y: 202,
    });
  });

  it('returns a copy of the position when the parent is unknown', () => {
    const position = { x: 10, y: 20 };
    const result = evaluateAbsolutePosition(position, { width: 5, height: 5 }, 'ghost', nodeLookup, [0, 0]);

    expect(result).toEqual(position);
    expect(result).not.toBe(position);
  });
});

describe('c-flow-math areSetsEqual', () => {
  it('is true for the same membership regardless of insertion order', () => {
    expect(areSetsEqual(new Set(['a', 'b']), new Set(['b', 'a']))).toBe(true);
    expect(areSetsEqual(new Set(), new Set())).toBe(true);
  });

  it('is false for a different size', () => {
    expect(areSetsEqual(new Set(['a']), new Set(['a', 'b']))).toBe(false);
    expect(areSetsEqual(new Set(['a', 'b']), new Set(['a']))).toBe(false);
  });

  it('is false for the same size with different members', () => {
    expect(areSetsEqual(new Set(['a', 'b']), new Set(['a', 'c']))).toBe(false);
  });
});

describe('c-flow-math getViewportForBounds', () => {
  const bounds = { x: 0, y: 0, width: 100, height: 100 };

  it('centres the bounds at the fitting zoom with no padding', () => {
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, 0)).toEqual({ x: 0, y: 0, zoom: 2 });
  });

  it('treats a numeric padding as a fraction of the viewport divided by 1 + padding', () => {
    // 200 - 200 / 1.1 = 18.18..., halved and floored gives 9 per side.
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, 0.1)).toEqual({ x: 9, y: 9, zoom: 1.82 });
  });

  it('takes a px padding literally', () => {
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, '20px')).toEqual({ x: 20, y: 20, zoom: 1.6 });
  });

  it('takes a percent padding as a share of the viewport', () => {
    // 10% of 200 is the same 20px as above.
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, '10%')).toEqual({ x: 20, y: 20, zoom: 1.6 });
  });

  it('falls back to no padding for an unparseable value', () => {
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, 'abc')).toEqual({ x: 0, y: 0, zoom: 2 });
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, {})).toEqual({ x: 0, y: 0, zoom: 2 });
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, undefined)).toEqual({ x: 0, y: 0, zoom: 2 });
  });

  it('clamps the zoom at minZoom when the bounds cannot fit', () => {
    const viewport = getViewportForBounds({ x: 0, y: 0, width: 1000, height: 1000 }, 200, 200, 0.5, 2, 0);

    expect(viewport.zoom).toBe(0.5);
    expect(viewport).toEqual({ x: -150, y: -150, zoom: 0.5 });
  });

  it('clamps the zoom at maxZoom when the bounds are tiny', () => {
    const viewport = getViewportForBounds({ x: 0, y: 0, width: 10, height: 10 }, 200, 200, 0.5, 2, 0);

    expect(viewport.zoom).toBe(2);
    expect(viewport).toEqual({ x: 90, y: 90, zoom: 2 });
  });

  it('fits the tighter axis when x and y padding differ', () => {
    // y padding of 30 per side leaves 140px for 100 units, so the y axis wins.
    expect(getViewportForBounds(bounds, 200, 200, 0.1, 4, { x: '10px', y: '30px' })).toEqual({
      x: 30,
      y: 30,
      zoom: 1.4,
    });
  });

  it('nudges the centred view inward to honour asymmetric padding', () => {
    // Zoom is pinned at maxZoom, so centring alone would leave only 90px on the
    // left where 150px was asked for; the offset pulls the view right by 60.
    expect(
      getViewportForBounds({ x: 0, y: 0, width: 10, height: 10 }, 200, 200, 0.5, 2, {
        left: '150px',
        right: '0px',
        top: '0px',
        bottom: '0px',
      })
    ).toEqual({ x: 150, y: 90, zoom: 2 });
  });
});

describe('c-flow-math getNodesBounds', () => {
  const a = internalNode('a', 100, 100, 50, 50);
  const b = internalNode('b', 0, 0, 20, 20);
  const nodeLookup = new Map([
    ['a', a],
    ['b', b],
  ]);

  it('merges the boxes of every resolved id', () => {
    expect(getNodesBounds(['a', 'b'], { nodeLookup })).toEqual({ x: 0, y: 0, width: 150, height: 150 });
  });

  it('skips unresolvable ids instead of stretching the bounds to the origin', () => {
    expect(getNodesBounds(['a', 'ghost'], { nodeLookup })).toEqual({ x: 100, y: 100, width: 50, height: 50 });
  });

  it('returns a zero rect when nothing resolves', () => {
    expect(getNodesBounds(['ghost'], { nodeLookup })).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    expect(getNodesBounds(['a'])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });

  it('returns a zero rect for an empty list', () => {
    expect(getNodesBounds([])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    expect(getNodesBounds(new Map())).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });

  it('re-resolves a raw user node through the lookup', () => {
    expect(getNodesBounds([{ id: 'a', position: { x: 0, y: 0 } }], { nodeLookup })).toEqual({
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    });
  });

  it('uses an already internal node as given', () => {
    expect(getNodesBounds([a], { nodeLookup })).toEqual({ x: 100, y: 100, width: 50, height: 50 });
  });

  it('accepts a Map of nodes', () => {
    expect(getNodesBounds(nodeLookup, { nodeLookup })).toEqual({ x: 0, y: 0, width: 150, height: 150 });
  });

  it('uses raw nodes directly when no lookup is supplied', () => {
    expect(
      getNodesBounds([
        { id: 'x', position: { x: 0, y: 0 }, width: 10, height: 10 },
        { id: 'y', position: { x: 20, y: 20 }, width: 10, height: 10 },
      ])
    ).toEqual({ x: 0, y: 0, width: 30, height: 30 });
  });

  it('applies the node origin to raw nodes', () => {
    expect(
      getNodesBounds([{ id: 'x', position: { x: 100, y: 100 }, width: 40, height: 40 }], {
        nodeOrigin: [0.5, 0.5],
      })
    ).toEqual({ x: 80, y: 80, width: 40, height: 40 });
  });
});

describe('c-flow-math getInternalNodesBounds', () => {
  const nodeLookup = new Map([
    ['a', internalNode('a', 100, 100, 50, 50)],
    ['b', internalNode('b', 0, 0, 20, 20)],
  ]);

  it('merges every node when no filter is given', () => {
    expect(getInternalNodesBounds(nodeLookup)).toEqual({ x: 0, y: 0, width: 150, height: 150 });
  });

  it('honours the filter', () => {
    expect(getInternalNodesBounds(nodeLookup, { filter: (node) => node.id === 'b' })).toEqual({
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    });
  });

  it('returns a zero rect when the filter rejects everything', () => {
    expect(getInternalNodesBounds(nodeLookup, { filter: () => false })).toEqual({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    expect(getInternalNodesBounds(new Map())).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });
});

describe('c-flow-math getViewportRect', () => {
  it('inverts the transform to give the visible flow rect', () => {
    expect(getViewportRect(400, 300, [100, 50, 2])).toEqual({ x: -50, y: -25, width: 200, height: 150 });
  });

  it('is a plain translation at scale 1', () => {
    expect(getViewportRect(400, 300, [-100, -50, 1])).toEqual({ x: 100, y: 50, width: 400, height: 300 });
  });
});

describe('c-flow-math getNodesInside', () => {
  const rect = { x: 0, y: 0, width: 100, height: 100 };
  const fullyInside = internalNode('in', 10, 10, 20, 20);
  const straddling = internalNode('edge', 90, 90, 20, 20);
  const fullyOutside = internalNode('out', 500, 500, 20, 20);

  it('requires full coverage by default', () => {
    expect(getNodesInside([fullyInside, straddling, fullyOutside], rect).map((n) => n.id)).toEqual(['in']);
  });

  it('accepts any overlap when partially is set', () => {
    expect(getNodesInside([fullyInside, straddling, fullyOutside], rect, [0, 0, 1], true).map((n) => n.id)).toEqual([
      'in',
      'edge',
    ]);
  });

  it('drops non-selectable nodes only when excludeNonSelectableNodes is set', () => {
    const locked = internalNode('locked', 10, 10, 20, 20, { selectable: false });

    expect(getNodesInside([locked], rect).map((n) => n.id)).toEqual(['locked']);
    expect(getNodesInside([locked], rect, [0, 0, 1], false, true)).toEqual([]);
  });

  it('always skips hidden nodes', () => {
    const hidden = internalNode('hidden', 10, 10, 20, 20, { hidden: true });

    expect(getNodesInside([hidden], rect)).toEqual([]);
    expect(getNodesInside([hidden], rect, [0, 0, 1], true)).toEqual([]);
  });

  it('reports an unmeasured node visible even when fully outside, so it can be measured once', () => {
    const unmeasured = {
      id: 'fresh',
      position: { x: 500, y: 500 },
      internals: { positionAbsolute: { x: 500, y: 500 } },
    };

    expect(getNodesInside([unmeasured], rect).map((n) => n.id)).toEqual(['fresh']);
  });

  it('keeps a dragging node even when it leaves the rect', () => {
    const dragged = internalNode('dragged', 500, 500, 20, 20, { dragging: true });

    expect(getNodesInside([dragged], rect).map((n) => n.id)).toEqual(['dragged']);
  });

  it('applies the transform to the rect before comparing', () => {
    const shifted = internalNode('shifted', -40, -40, 20, 20);

    expect(getNodesInside([shifted], rect).map((n) => n.id)).toEqual([]);
    expect(getNodesInside([shifted], rect, [50, 50, 1]).map((n) => n.id)).toEqual(['shifted']);
  });

  it('accepts a Map of nodes', () => {
    expect(getNodesInside(new Map([['in', fullyInside]]), rect).map((n) => n.id)).toEqual(['in']);
  });

  it('falls back to the initial size when a node has not been measured yet but has handle bounds', () => {
    const initialOnly = {
      id: 'initial',
      initialWidth: 20,
      initialHeight: 20,
      internals: { positionAbsolute: { x: 10, y: 10 }, handleBounds: { source: [], target: [] } },
    };

    expect(getNodesInside([initialOnly], rect).map((n) => n.id)).toEqual(['initial']);
  });
});

describe('c-flow-math getHandlePosition', () => {
  const node = {
    id: 'n',
    position: { x: 1, y: 2 },
    measured: { width: 40, height: 20 },
    internals: { positionAbsolute: { x: 100, y: 200 } },
  };
  const handle = (position) => ({ x: 10, y: 20, width: 8, height: 6, position });

  it('snaps a top handle to the node top edge, centred horizontally', () => {
    expect(getHandlePosition(node, handle(Position.Top))).toEqual({ x: 114, y: 220 });
  });

  it('snaps a right handle to the node right edge, centred vertically', () => {
    expect(getHandlePosition(node, handle(Position.Right))).toEqual({ x: 118, y: 223 });
  });

  it('snaps a bottom handle to the node bottom edge, centred horizontally', () => {
    expect(getHandlePosition(node, handle(Position.Bottom))).toEqual({ x: 114, y: 226 });
  });

  it('snaps a left handle to the node left edge, centred vertically', () => {
    expect(getHandlePosition(node, handle(Position.Left))).toEqual({ x: 110, y: 223 });
  });

  it('returns the raw handle centre when center is set', () => {
    expect(getHandlePosition(node, handle(Position.Top), Position.Left, true)).toEqual({ x: 114, y: 223 });
  });

  it('uses the fallback position when the handle declares none', () => {
    expect(getHandlePosition(node, { x: 10, y: 20, width: 8, height: 6 }, Position.Bottom)).toEqual({
      x: 114,
      y: 226,
    });
  });

  it('treats an unknown position as left', () => {
    expect(getHandlePosition(node, handle('diagonal'))).toEqual({ x: 110, y: 223 });
  });

  it('falls back to the node dimensions and absolute position for a null handle', () => {
    expect(getHandlePosition(node, null)).toEqual({ x: 100, y: 210 });
    expect(getHandlePosition(node, null, Position.Right)).toEqual({ x: 140, y: 210 });
    expect(getHandlePosition(node, undefined, Position.Top)).toEqual({ x: 120, y: 200 });
  });
});
