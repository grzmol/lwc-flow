/**
 * Edge-type registry.
 *
 * The flow's edge renderer owns the `<svg>` and paints every edge from its own template, so an edge
 * type is not a component here: it is a path generator plus that generator's option defaults. This
 * module is the lookup table the renderer consults, and it is where upstream's per-edge-type React
 * components (`BezierEdge`, `StraightEdge`, `StepEdge`, `SmoothStepEdge`, `SimpleBezierEdge`) end up.
 *
 * Deviations from upstream:
 * - `getPath` returns an object, not the `[path, labelX, labelY, offsetX, offsetY]` tuple the
 *   generators produce. LWC template expressions cannot index an array, and the renderer reads the
 *   result with dot access.
 * - Upstream reports an unknown edge type through the flow's `onError` callback. That callback can be
 *   passed in here; without one the message goes to `console.warn` so the mistake is not swallowed.
 */

import { getBezierPath, getSimpleBezierPath, getSmoothStepPath, getStraightPath } from 'c/flowEdgePaths';
import { errorMessages } from 'c/flowTypes';

/** The type every edge falls back to, matching upstream's `edge.type || 'default'`. */
const DEFAULT_EDGE_TYPE = 'default';

/** A step edge is a smooth step edge without corner rounding - upstream has no separate generator. */
const STEP_BORDER_RADIUS = 0;

/** Per-edge option names. Upstream nests these in `edge.pathOptions`; a flat edge is accepted too. */
const OPTION_KEYS = Object.freeze(['curvature', 'borderRadius', 'offset', 'stepPosition', 'centerX', 'centerY']);

/**
 * Turn a generator tuple into the shape the renderer reads.
 * @param {[string, number, number, number, number]} tuple
 * @returns {{path: string, labelX: number, labelY: number, offsetX: number, offsetY: number}}
 */
function toPathData([path, labelX, labelY, offsetX, offsetY]) {
  return { path, labelX, labelY, offsetX, offsetY };
}

/** Stands in for upstream's `onError`, which needs a store this module does not have. */
function warnOnError(code, message) {
  console.warn(message);
}

/**
 * The five edge shapes lwc-flow ships. Each entry pairs a path generator with the defaults for the
 * options that generator understands, so the renderer can merge them without knowing the shapes.
 */
export const builtinEdgeTypes = Object.freeze({
  default: Object.freeze({
    getPath: (geometry) => toPathData(getBezierPath(geometry)),
    defaults: Object.freeze({ curvature: 0.25 }),
  }),
  straight: Object.freeze({
    getPath: (geometry) => toPathData(getStraightPath(geometry)),
    defaults: Object.freeze({}),
  }),
  step: Object.freeze({
    // The radius is forced last: a step edge stays square whatever the edge asks for, which is
    // exactly what upstream's `StepEdge` does when it renders `SmoothStepEdge`.
    getPath: (geometry) => toPathData(getSmoothStepPath({ ...geometry, borderRadius: STEP_BORDER_RADIUS })),
    defaults: Object.freeze({ borderRadius: STEP_BORDER_RADIUS }),
  }),
  smoothstep: Object.freeze({
    getPath: (geometry) => toPathData(getSmoothStepPath(geometry)),
    defaults: Object.freeze({ borderRadius: 5, offset: 20, stepPosition: 0.5 }),
  }),
  simplebezier: Object.freeze({
    getPath: (geometry) => toPathData(getSimpleBezierPath(geometry)),
    defaults: Object.freeze({}),
  }),
});

/**
 * The registry entry for a type name. A consumer registry wins over the builtins, so a flow can
 * replace `default` wholesale. An unknown name falls back to `default` and is reported, as upstream
 * does; a missing name is not an error, it simply means `default`.
 * @param {string} [type]
 * @param {Object} [edgeTypes] consumer-registered types, keyed the same way
 * @param {Function} [onError] `(code, message)`, upstream's `onError`
 * @returns {{getPath: Function, defaults: Object}}
 */
export function resolveEdgeType(type, edgeTypes, onError = warnOnError) {
  const name = type || DEFAULT_EDGE_TYPE;

  if (edgeTypes && Object.prototype.hasOwnProperty.call(edgeTypes, name)) {
    return edgeTypes[name];
  }

  if (Object.prototype.hasOwnProperty.call(builtinEdgeTypes, name)) {
    return builtinEdgeTypes[name];
  }

  onError('011', errorMessages.error011(name));

  return builtinEdgeTypes[DEFAULT_EDGE_TYPE];
}

/**
 * Collect an edge's path options. Upstream keeps them in `pathOptions`; options written straight
 * onto the edge are read too, and the nested form wins when both are present.
 * @param {Object} [edge]
 * @returns {Object}
 */
function getEdgeOptions(edge) {
  if (!edge) {
    return {};
  }

  const options = {};

  for (const key of OPTION_KEYS) {
    if (edge[key] !== undefined) {
      options[key] = edge[key];
    }
  }

  return edge.pathOptions ? { ...options, ...edge.pathOptions } : options;
}

/**
 * Path and label anchor for one edge. Precedence runs defaults, then the edge's own options, then
 * the geometry the renderer measured - the geometry is never negotiable.
 * @param {Object} edge the edge, whose `type` selects the generator
 * @param {Object} geometry `{sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition}`
 * @param {Object} [edgeTypes] consumer-registered types
 * @param {Function} [onError] `(code, message)`, upstream's `onError`
 * @returns {{path: string, labelX: number, labelY: number, offsetX: number, offsetY: number}}
 */
export function getEdgePathData(edge, geometry, edgeTypes, onError) {
  const edgeType = resolveEdgeType(edge && edge.type, edgeTypes, onError);

  return edgeType.getPath({ ...edgeType.defaults, ...getEdgeOptions(edge), ...geometry });
}
