import { Position } from 'c/flowTypes';
import {
  getEdgeCenter,
  getBezierEdgeCenter,
  getBezierPath,
  getSimpleBezierPath,
  getStraightPath,
  getSmoothStepPath,
} from 'c/flowEdgePaths';

/*
 * Every expected `d` string and label coordinate below is worked out by hand from the
 * formulas documented in the module, then written as a literal. Nothing here calls the
 * function under test to build its own expectation.
 */

describe('c-flow-edge-paths getEdgeCenter', () => {
  it('returns the midpoint and the half-extents for a forward span', () => {
    expect(getEdgeCenter({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 50 })).toEqual([50, 25, 50, 25]);
  });

  it('returns the same midpoint when the span runs backwards', () => {
    expect(getEdgeCenter({ sourceX: 100, sourceY: 50, targetX: 0, targetY: 0 })).toEqual([50, 25, 50, 25]);
  });

  it('collapses to the point itself for a zero-length span', () => {
    expect(getEdgeCenter({ sourceX: 7, sourceY: 9, targetX: 7, targetY: 9 })).toEqual([7, 9, 0, 0]);
  });
});

describe('c-flow-edge-paths getBezierEdgeCenter', () => {
  it('weights the endpoints by 1/8 and the controls by 3/8', () => {
    // 0 * 0.125 + 0 * 0.375 + 100 * 0.375 + 100 * 0.125 = 50
    expect(
      getBezierEdgeCenter({
        sourceX: 0,
        sourceY: 0,
        targetX: 100,
        targetY: 100,
        sourceControlX: 0,
        sourceControlY: 50,
        targetControlX: 100,
        targetControlY: 50,
      })
    ).toEqual([50, 50, 50, 50]);
  });

  it('reports the offsets as absolute distances from the source', () => {
    // centerX = 200 * 0.125 + 0 * 0.375 + 0 * 0.375 + 0 * 0.125 = 25
    expect(
      getBezierEdgeCenter({
        sourceX: 200,
        sourceY: 0,
        targetX: 0,
        targetY: 0,
        sourceControlX: 0,
        sourceControlY: 0,
        targetControlX: 0,
        targetControlY: 0,
      })
    ).toEqual([25, 0, 175, 0]);
  });
});

describe('c-flow-edge-paths getStraightPath', () => {
  it('emits the M/L pair with upstream spacing exactly', () => {
    expect(getStraightPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 50 })).toEqual([
      'M 0,0L 100,50',
      50,
      25,
      50,
      25,
    ]);
  });

  it('emits the reversed endpoints when the edge runs backwards', () => {
    expect(getStraightPath({ sourceX: 100, sourceY: 50, targetX: 0, targetY: 0 })).toEqual([
      'M 100,50L 0,0',
      50,
      25,
      50,
      25,
    ]);
  });
});

describe('c-flow-edge-paths getBezierPath', () => {
  it('offsets both controls by half the gap at the default curvature', () => {
    // Bottom -> Top over 100 units: offset = 0.5 * 100 = 50.
    expect(getBezierPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 100 })).toEqual([
      'M0,0 C0,50 100,50 100,100',
      50,
      50,
      50,
      50,
    ]);
  });

  it('ignores the curvature when the target is on the expected side', () => {
    // distance >= 0 takes the 0.5 * distance branch, so curvature: 0 changes nothing.
    expect(
      getBezierPath({
        sourceX: 0,
        sourceY: 0,
        sourcePosition: Position.Right,
        targetX: 100,
        targetY: 0,
        targetPosition: Position.Left,
        curvature: 0,
      })
    ).toEqual(['M0,0 C50,0 50,0 100,0', 50, 0, 50, 0]);
  });

  it('flattens a backwards edge onto its endpoints at curvature 0', () => {
    // Negative distance takes the sqrt branch, which curvature 0 zeroes out.
    expect(
      getBezierPath({
        sourceX: 100,
        sourceY: 0,
        sourcePosition: Position.Right,
        targetX: 0,
        targetY: 0,
        targetPosition: Position.Left,
        curvature: 0,
      })
    ).toEqual(['M100,0 C100,0 0,0 0,0', 50, 0, 50, 0]);
  });

  it('bows a backwards edge outward through the sqrt branch', () => {
    // 0.25 * 25 * sqrt(100) = 62.5, pushed out past each handle.
    expect(
      getBezierPath({
        sourceX: 100,
        sourceY: 0,
        sourcePosition: Position.Right,
        targetX: 0,
        targetY: 0,
        targetPosition: Position.Left,
      })
    ).toEqual(['M100,0 C162.5,0 -62.5,0 0,0', 50, 0, 50, 0]);
  });
});

describe('c-flow-edge-paths getSimpleBezierPath', () => {
  it('places vertical controls at the midpoint of the y span', () => {
    expect(getSimpleBezierPath({ sourceX: 0, sourceY: 0, targetX: 100, targetY: 100 })).toEqual([
      'M0,0 C0,50 100,50 100,100',
      50,
      50,
      50,
      50,
    ]);
  });

  it('places horizontal controls at the midpoint of the x span', () => {
    expect(
      getSimpleBezierPath({
        sourceX: 0,
        sourceY: 0,
        sourcePosition: Position.Right,
        targetX: 100,
        targetY: 60,
        targetPosition: Position.Left,
      })
    ).toEqual(['M0,0 C50,0 50,60 100,60', 50, 30, 50, 30]);
  });

  it('has no backwards special case, so a reversed edge doubles back', () => {
    // Both controls land on x = 50, between the handles rather than outside them.
    expect(
      getSimpleBezierPath({
        sourceX: 100,
        sourceY: 0,
        sourcePosition: Position.Right,
        targetX: 0,
        targetY: 0,
        targetPosition: Position.Left,
      })
    ).toEqual(['M100,0 C50,0 50,0 0,0', 50, 0, 50, 0]);
  });
});

describe('c-flow-edge-paths getSmoothStepPath', () => {
  it('emits hard corners with no arc for a straight horizontal step edge', () => {
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 0,
      targetPosition: Position.Left,
      borderRadius: 0,
    });

    expect(path).toBe('M0 0L20 0L50 0L50 0L80 0L100 0');
    expect(path).not.toContain('Q');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([50, 0, 50, 0]);
  });

  it('emits hard corners with no arc for a straight vertical step edge', () => {
    const [path] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 0,
      targetY: 100,
      borderRadius: 0,
    });

    expect(path).toBe('M0 0L0 20L0 50L0 50L0 80L0 100');
    expect(path).not.toContain('Q');
  });

  it('keeps zero-length arcs at borderRadius 0 once the route actually turns', () => {
    // Upstream behaviour: a real corner still emits a Q, it is just degenerate.
    const [path] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      borderRadius: 0,
    });

    expect(path).toBe('M0 0L0 20L 0,50Q 0,50 0,50L 100,50Q 100,50 100,50L100 80L100 100');
  });

  it('rounds the corners at the default radius when the handles face each other', () => {
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Left,
    });

    expect(path).toBe('M0 0L20 0L 45,0Q 50,0 50,5L 50,95Q 50,100 55,100L80 100L100 100');
    expect(path).toContain('Q');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([50, 50, 50, 50]);
  });

  it('routes through a shared mid-line when the handles face each other backwards', () => {
    // sourceGapped.x 120 > targetGapped.x -20, so the route splits horizontally.
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 100,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 0,
      targetY: 100,
      targetPosition: Position.Left,
    });

    expect(path).toBe(
      'M100 0L 115,0Q 120,0 120,5L 120,45Q 120,50 115,50L -15,50Q -20,50 -20,55L -20,95Q -20,100 -15,100L0 100'
    );
    expect([labelX, labelY]).toEqual([50, 50]);
  });

  it('routes through a vertical split when a bottom handle sits below a top handle', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: Position.Bottom,
      targetX: 100,
      targetY: 0,
      targetPosition: Position.Top,
    });

    expect(path).toBe(
      'M0 100L 0,115Q 0,120 5,120L 45,120Q 50,120 50,115L 50,-15Q 50,-20 55,-20L 95,-20Q 100,-20 100,-15L100 0'
    );
    expect([labelX, labelY]).toEqual([50, 50]);
  });

  it('pulls one gap back when two same-side handles sit closer together than the offset', () => {
    // Right -> Right with only 10 units between them: gapOffset = min(19, 10) = 10,
    // so the source gap point moves from x 20 back to x 10.
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 10,
      targetY: 50,
      targetPosition: Position.Right,
    });

    expect(path).toBe('M0 0L10 0L 25,0Q 30,0 30,5L 30,45Q 30,50 25,50L10 50');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([30, 25, 5, 25]);
  });

  it('pulls the target gap back instead when the route runs the other way', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 10,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 0,
      targetY: 50,
      targetPosition: Position.Right,
    });

    expect(path).toBe('M10 0L 25,0Q 30,0 30,5L 30,45Q 30,50 25,50L10 50L0 50');
    expect([labelX, labelY]).toEqual([30, 25]);
  });

  it('keeps a single corner for two same-side handles further apart than the offset', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Bottom,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Bottom,
    });

    expect(path).toBe('M0 0L0 20L 0,115Q 0,120 5,120L 95,120Q 100,120 100,115L100 100');
    expect([labelX, labelY]).toEqual([50, 120]);
  });

  it('flips the corner for mixed sides such as Right -> Bottom', () => {
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Bottom,
    });

    expect(path).toBe('M0 0L 15,0Q 20,0 20,5L 20,115Q 20,120 25,120L 95,120Q 100,120 100,115L100 100');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([20, 60, 50, 50]);
  });

  it('drops a gapped point that coincides with the corner', () => {
    // Right -> Bottom where both gap points share x 20: the target gap point equals
    // the corner, so it is skipped and the route is four points instead of five.
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 20,
      targetY: 100,
      targetPosition: Position.Bottom,
    });

    expect(path).toBe('M0 0L 15,0Q 20,0 20,5L20 120L20 100');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([20, 60, 10, 50]);
  });

  it('moves the mid-line with stepPosition', () => {
    // centerX = 20 + (80 - 20) * 0.25 = 35 instead of 50.
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Left,
      stepPosition: 0.25,
    });

    expect(path).toBe('M0 0L20 0L 30,0Q 35,0 35,5L 35,95Q 35,100 40,100L80 100L100 100');
    expect([labelX, labelY]).toEqual([35, 50]);
  });

  it('collapses the source gap point into the mid-line at stepPosition 0', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Left,
      stepPosition: 0,
    });

    expect(path).toBe('M0 0L 15,0Q 20,0 20,5L 20,95Q 20,100 25,100L80 100L100 100');
    expect([labelX, labelY]).toEqual([20, 50]);
  });

  it('honours an explicit centerX and centerY override', () => {
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Left,
      centerX: 70,
      centerY: 30,
    });

    expect(path).toBe('M0 0L20 0L 65,0Q 70,0 70,5L 70,95Q 70,100 75,100L80 100L100 100');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([70, 30, 50, 50]);
  });

  it('caps the corner radius at half the shorter adjacent segment', () => {
    // The mid-line sits 4 units from the target gap point, so the requested radius
    // of 20 is capped at 2 on that corner while the roomier corner gets 20.
    const [path] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Left,
      borderRadius: 20,
      centerX: 76,
    });

    expect(path).toBe('M0 0L20 0L 56,0Q 76,0 76,20L 76,98Q 76,100 78,100L80 100L100 100');
  });

  it('takes the corner from the target when two bottom handles run upward', () => {
    // Bottom -> Bottom with the target above the source flips which gapped point
    // supplies the corner x.
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 100,
      sourcePosition: Position.Bottom,
      targetX: 100,
      targetY: 0,
      targetPosition: Position.Bottom,
    });

    expect(path).toBe('M0 100L 0,115Q 0,120 5,120L 95,120Q 100,120 100,115L100 20L100 0');
    expect([labelX, labelY]).toEqual([50, 120]);
  });

  it('pushes the source gap forward for two close left handles', () => {
    // Left handles gap to negative x, so the gap correction adds rather than subtracts.
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Left,
      targetX: -10,
      targetY: 50,
      targetPosition: Position.Left,
    });

    expect(path).toBe('M0 0L-10 0L -25,0Q -30,0 -30,5L -30,45Q -30,50 -25,50L-10 50');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([-30, 25, 5, 25]);
  });

  it('pushes the target gap forward for two close left handles running the other way', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: -10,
      sourceY: 0,
      sourcePosition: Position.Left,
      targetX: 0,
      targetY: 50,
      targetPosition: Position.Left,
    });

    expect(path).toBe('M-10 0L -25,0Q -30,0 -30,5L -30,45Q -30,50 -25,50L-10 50L0 50');
    expect([labelX, labelY]).toEqual([-30, 25]);
  });

  it('flips the corner for a vertical-first mixed route such as Bottom -> Right', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Bottom,
      targetX: 100,
      targetY: 100,
      targetPosition: Position.Right,
    });

    expect(path).toBe('M0 0L 0,15Q 0,20 5,20L 115,20Q 120,20 120,25L 120,95Q 120,100 115,100L100 100');
    expect([labelX, labelY]).toEqual([60, 20]);
  });

  it('flips the corner for a route leaving a left handle, such as Left -> Bottom', () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 100,
      sourceY: 0,
      sourcePosition: Position.Left,
      targetX: 0,
      targetY: 100,
      targetPosition: Position.Bottom,
    });

    expect(path).toBe('M100 0L 85,0Q 80,0 80,5L 80,115Q 80,120 75,120L 5,120Q 0,120 0,115L0 100');
    expect([labelX, labelY]).toEqual([80, 60]);
  });

  it('leaves the corner alone for a mixed route that already turns the right way', () => {
    // Right -> Top with both gapped points on x 20: no flip, and the target gap
    // point coincides with the corner so it is dropped.
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: 0,
      sourceY: 0,
      sourcePosition: Position.Right,
      targetX: 20,
      targetY: 100,
      targetPosition: Position.Top,
    });

    expect(path).toBe('M0 0L 15,0Q 20,0 20,5L20 80L20 100');
    expect([labelX, labelY, offsetX, offsetY]).toEqual([20, 40, 10, 50]);
  });

  it('flips the corner when both handles point the same way and the target sits above', () => {
    // Left -> Top: the handle directions agree on the cross axis, so the flip is
    // decided by the source sitting below the target rather than above it.
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: 100,
      sourceY: 100,
      sourcePosition: Position.Left,
      targetX: 0,
      targetY: 0,
      targetPosition: Position.Top,
    });

    expect(path).toBe('M100 100L 85,100Q 80,100 80,95L 80,-15Q 80,-20 75,-20L 5,-20Q 0,-20 0,-15L0 0');
    expect([labelX, labelY]).toEqual([80, 40]);
  });
});
