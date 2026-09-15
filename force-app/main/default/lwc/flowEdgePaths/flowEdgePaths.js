/**
 * SVG path generators for lwc-flow edges.
 *
 * Service component: no template, no LWC imports, no DOM access. Ported from
 * `@xyflow/system/src/utils/edges/*` plus `SimpleBezierEdge.tsx`. The emitted
 * `d` strings are byte-identical to upstream, including spacing, so visual
 * output and snapshot comparisons match React Flow exactly.
 *
 * Every generator returns the same tuple:
 * `[path, labelX, labelY, offsetX, offsetY]`
 * - `path`     the `d` attribute for an SVG `<path>`
 * - `labelX/Y` where to place an edge label
 * - `offsetX/Y` absolute distance from the source point to the label point
 */

import { Position } from 'c/flowTypes';

/**
 * Midpoint of the straight span between two points, plus the half-extents.
 *
 * Used by straight edges and by the smooth-step generator's default offsets.
 * @returns {[number, number, number, number]} `[centerX, centerY, offsetX, offsetY]`
 */
export function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
}

/**
 * The `t = 0.5` point of a cubic bezier, plus its offset from the source.
 *
 * This is the algebraic midpoint in parameter space, not the arc-length
 * midpoint. Upstream accepts that approximation because it is one multiply-add
 * per coordinate instead of a curve subdivision.
 * @returns {[number, number, number, number]} `[centerX, centerY, offsetX, offsetY]`
 */
export function getBezierEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceControlX,
  sourceControlY,
  targetControlX,
  targetControlY,
}) {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;

  return [centerX, centerY, Math.abs(centerX - sourceX), Math.abs(centerY - sourceY)];
}

/**
 * How far a bezier control point sits from its handle.
 *
 * When the target is on the expected side of the source the offset is simply
 * half the gap. When the target is behind the handle the distance is negative,
 * and the control point is pushed out by a square-root term instead, which
 * makes a backwards edge bow outward rather than doubling back on itself.
 * @param {number} signedGap signed gap along the handle's axis
 * @param {number} curvature
 * @returns {number}
 */
function calculateControlOffset(signedGap, curvature) {
  if (signedGap >= 0) {
    return 0.5 * signedGap;
  }

  return curvature * 25 * Math.sqrt(-signedGap);
}

/**
 * Control point for one end of a curvature-aware bezier.
 * @returns {[number, number]}
 */
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
    default:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}

/**
 * Cubic bezier between two handles, curving away from each handle's side.
 * @param {Object} params
 * @param {number} params.sourceX
 * @param {number} params.sourceY
 * @param {Position} [params.sourcePosition='bottom']
 * @param {number} params.targetX
 * @param {number} params.targetY
 * @param {Position} [params.targetPosition='top']
 * @param {number} [params.curvature=0.25]
 * @returns {[string, number, number, number, number]}
 */
export function getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  curvature = 0.25,
}) {
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature,
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature,
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
  });

  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY,
  ];
}

/**
 * Control point for a simple bezier: always the midpoint along the handle's axis,
 * with no curvature term and no special case for backwards edges.
 * @returns {[number, number]}
 */
function getSimpleControl({ pos, x1, y1, x2, y2 }) {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }

  return [x1, 0.5 * (y1 + y2)];
}

/**
 * Cubic bezier with fixed midpoint controls. Flatter than {@link getBezierPath}
 * and cheaper, but it overlaps itself when an edge runs backwards.
 * @param {Object} params
 * @returns {[string, number, number, number, number]}
 */
export function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}) {
  const [sourceControlX, sourceControlY] = getSimpleControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  const [targetControlX, targetControlY] = getSimpleControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY,
  });

  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY,
  ];
}

/**
 * Straight line between two handles.
 * @param {Object} params
 * @returns {[string, number, number, number, number]}
 */
export function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({ sourceX, sourceY, targetX, targetY });

  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}

/** Unit vector pointing away from the node for each handle side. */
const handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
};

/**
 * Which way the route travels between two gapped points.
 *
 * A left/right handle routes horizontally first, a top/bottom handle
 * vertically, and the sign follows whichever side the target is on.
 * @returns {import('c/flowTypes').XYPosition} unit vector
 */
function getDirection({ source, sourcePosition = Position.Bottom, target }) {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }

  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}

/** Euclidean distance. */
function distance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Corner waypoints for an orthogonal route between two handles.
 *
 * This approximates orthogonal routing rather than solving it: each handle is
 * pushed `offset` pixels straight out, then the two gapped points are joined by
 * either one or two corners depending on whether the handles face each other.
 * @returns {[Array<import('c/flowTypes').XYPosition>, number, number, number, number]}
 *   `[points, labelX, labelY, offsetX, offsetY]`
 */
function getPoints({
  source,
  sourcePosition = Position.Bottom,
  target,
  targetPosition = Position.Top,
  center,
  offset,
  stepPosition,
}) {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getDirection({ source: sourceGapped, sourcePosition, target: targetGapped });
  const dirAccessor = dir.x !== 0 ? 'x' : 'y';
  const currDir = dir[dirAccessor];

  let points = [];
  let centerX;
  let centerY;
  const sourceGapOffset = { x: 0, y: 0 };
  const targetGapOffset = { x: 0, y: 0 };

  const [, , defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y,
  });

  // Handles face each other: route through one shared mid-line.
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    if (dirAccessor === 'x') {
      centerX = center.x ?? sourceGapped.x + (targetGapped.x - sourceGapped.x) * stepPosition;
      centerY = center.y ?? (sourceGapped.y + targetGapped.y) / 2;
    } else {
      centerX = center.x ?? (sourceGapped.x + targetGapped.x) / 2;
      centerY = center.y ?? sourceGapped.y + (targetGapped.y - sourceGapped.y) * stepPosition;
    }

    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y },
    ];
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY },
    ];

    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
    }
  } else {
    // One corner. `sourceTarget` takes x from the source and y from the target.
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];

    if (dirAccessor === 'x') {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }

    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);

      /*
       * Same side on both ends and closer together than the gap: the corner
       * would land on top of a gapped point and the route would kink. Pull
       * one gap back so the three points stay distinct.
       */
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
        }
      }
    }

    // Mixed sides, e.g. Right -> Bottom: the corner may need to flip.
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget =
        (sourceDir[dirAccessor] === 1 && ((!isSameDir && sourceGtTargetOppo) || (isSameDir && sourceLtTargetOppo))) ||
        (sourceDir[dirAccessor] !== 1 && ((!isSameDir && sourceLtTargetOppo) || (isSameDir && sourceGtTargetOppo)));

      if (flipSourceTarget) {
        points = dirAccessor === 'x' ? sourceTarget : targetSource;
      }
    }

    const sourceGapPoint = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
    const targetGapPoint = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));

    // Put the label on the longest segment.
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
      centerY = points[0].y;
    } else {
      centerX = points[0].x;
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }

  const gappedSource = { x: sourceGapped.x + sourceGapOffset.x, y: sourceGapped.y + sourceGapOffset.y };
  const gappedTarget = { x: targetGapped.x + targetGapOffset.x, y: targetGapped.y + targetGapOffset.y };

  const pathPoints = [
    source,
    // Skip a gapped point that coincides with the first/last corner: a duplicate
    // point makes the bend calculation produce a zero-length arc.
    ...(gappedSource.x !== points[0].x || gappedSource.y !== points[0].y ? [gappedSource] : []),
    ...points,
    ...(gappedTarget.x !== points[points.length - 1].x || gappedTarget.y !== points[points.length - 1].y
      ? [gappedTarget]
      : []),
    target,
  ];

  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}

/**
 * One rounded corner at `b`, coming from `a` and leaving toward `c`.
 *
 * The radius is capped at half of either adjacent segment so two corners on a
 * short segment cannot overlap. Collinear triples get a plain line instead.
 * @param {import('c/flowTypes').XYPosition} a
 * @param {import('c/flowTypes').XYPosition} b corner
 * @param {import('c/flowTypes').XYPosition} c
 * @param {number} size requested corner radius
 * @returns {string} SVG path commands
 */
function getBend(a, b, c, size) {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;

  // Collinear: nothing to round.
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  // Arriving horizontally.
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

/**
 * Orthogonal route with rounded corners.
 *
 * `borderRadius: 0` produces hard corners, which is exactly the built-in `step`
 * edge; there is no separate generator for it.
 * @param {Object} params
 * @param {number} params.sourceX
 * @param {number} params.sourceY
 * @param {Position} [params.sourcePosition='bottom']
 * @param {number} params.targetX
 * @param {number} params.targetY
 * @param {Position} [params.targetPosition='top']
 * @param {number} [params.borderRadius=5]
 * @param {number} [params.centerX] override for the mid-line x
 * @param {number} [params.centerY] override for the mid-line y
 * @param {number} [params.offset=20] how far the route leaves each handle before turning
 * @param {number} [params.stepPosition=0.5] where the mid-line sits between the handles
 * @returns {[string, number, number, number, number]}
 */
export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
  centerX,
  centerY,
  offset = 20,
  stepPosition = 0.5,
}) {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset,
    stepPosition,
  });

  let path = `M${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    path += getBend(points[i - 1], points[i], points[i + 1], borderRadius);
  }

  path += `L${points[points.length - 1].x} ${points[points.length - 1].y}`;

  return [path, labelX, labelY, offsetX, offsetY];
}
