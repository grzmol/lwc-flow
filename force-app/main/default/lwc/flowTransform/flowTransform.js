/**
 * The viewport transform kernel for lwc-flow.
 *
 * Service component: no template, no LWC imports, no DOM access.
 *
 * xyflow delegates its viewport to `d3-zoom`, `d3-interpolate` and `d3-ease`.
 * Salesforce CSP blocks CDN scripts and this project ships no runtime
 * dependencies, so the algorithms d3 provides are reimplemented here. They are
 * ported from the d3 sources rather than approximated, because the feel of
 * panning and zooming is entirely in these formulas:
 *
 * | Source | Ported here |
 * | --- | --- |
 * | `d3-zoom/src/transform.js` | {@link Transform} |
 * | `d3-zoom/src/zoom.js` `defaultConstrain` | {@link constrain} |
 * | `d3-zoom/src/zoom.js` `scale`, `translate`, `centroid` | {@link scaleTransform}, {@link translateTransform}, {@link centroid} |
 * | `d3-zoom/src/zoom.js` `schedule` tween | {@link interpolateTransform} |
 * | `d3-interpolate/src/zoom.js` | {@link interpolateZoom} |
 * | `d3-ease` `cubicInOut` | {@link cubicInOut} |
 *
 * `@xyflow/system/src/xypanzoom/utils.ts` overrides d3's wheel delta; that
 * override is {@link wheelDelta} here.
 */

/** Below this squared distance two zoom endpoints count as the same point. */
const EPSILON2 = 1e-12;

/** Van Wijk and Nuij's curvature constant, as d3 configures it. */
const RHO = Math.SQRT2;
const RHO2 = 2;
const RHO4 = 4;

/** Wheel events stop being treated as one continuous gesture after this idle gap, in ms. */
export const WHEEL_IDLE_MS = 150;

/** Double-click zoom factor. Shift inverts it. */
export const DBLCLICK_SCALE_FACTOR = 2;

/** d3-zoom's default double-click transition duration, in ms. */
export const DBLCLICK_DURATION = 250;

/**
 * An affine viewport transform: uniform scale `k` then translation `x`, `y`.
 *
 * Immutable. Every operation returns a new instance, except that the identity
 * operations return `this` so a no-op transform write can be detected by
 * reference, which is how d3 avoids spurious renders.
 */
export class Transform {
  /**
   * @param {number} k scale
   * @param {number} x translation along x, in pane pixels
   * @param {number} y translation along y, in pane pixels
   */
  constructor(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }

  /**
   * Multiply the scale, leaving the translation alone.
   * @param {number} k
   * @returns {Transform}
   */
  scale(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  }

  /**
   * Translate by `x`, `y` expressed in *flow* units, so the shift is scaled.
   * @param {number} x
   * @param {number} y
   * @returns {Transform}
   */
  translate(x, y) {
    return x === 0 && y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  }

  /**
   * Flow point to pane point.
   * @param {[number, number]} point
   * @returns {[number, number]}
   */
  apply(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  }

  /** @param {number} x @returns {number} */
  applyX(x) {
    return x * this.k + this.x;
  }

  /** @param {number} y @returns {number} */
  applyY(y) {
    return y * this.k + this.y;
  }

  /**
   * Pane point to flow point.
   * @param {[number, number]} location
   * @returns {[number, number]}
   */
  invert(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  }

  /** @param {number} x @returns {number} */
  invertX(x) {
    return (x - this.x) / this.k;
  }

  /** @param {number} y @returns {number} */
  invertY(y) {
    return (y - this.y) / this.k;
  }

  /**
   * CSS transform string. Translate precedes scale, which is what makes `x`
   * and `y` pane pixels rather than scaled units.
   * @returns {string}
   */
  toString() {
    return `translate(${this.x},${this.y}) scale(${this.k})`;
  }
}

/** The do-nothing transform. */
export const transformIdentity = new Transform(1, 0, 0);

/**
 * `{x, y, zoom}` to a {@link Transform}.
 * @param {import('c/flowTypes').Viewport} viewport
 * @returns {Transform}
 */
export function viewportToTransform({ x, y, zoom }) {
  return new Transform(zoom, x, y);
}

/**
 * {@link Transform} to `{x, y, zoom}`.
 * @param {Transform} transform
 * @returns {import('c/flowTypes').Viewport}
 */
export function transformToViewport(transform) {
  return { x: transform.x, y: transform.y, zoom: transform.k };
}

/**
 * Centre of an extent.
 * @param {import('c/flowTypes').CoordinateExtent} extent
 * @returns {[number, number]}
 */
export function centroid(extent) {
  return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
}

/**
 * Replace the scale, clamped to `scaleExtent`, keeping the translation.
 *
 * Returns the input unchanged when the scale is already correct, so callers can
 * detect a no-op by reference.
 * @param {Transform} transform
 * @param {number} k
 * @param {[number, number]} scaleExtent
 * @returns {Transform}
 */
export function scaleTransform(transform, k, scaleExtent) {
  const clamped = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));

  return clamped === transform.k ? transform : new Transform(clamped, transform.x, transform.y);
}

/**
 * Move `transform` so flow point `p1` lands on pane point `p0`.
 *
 * This is the anchor operation behind every zoom: pick the point under the
 * cursor, change the scale, then translate so that point has not moved.
 * @param {Transform} transform
 * @param {[number, number]} p0 pane point
 * @param {[number, number]} p1 flow point
 * @returns {Transform}
 */
export function translateTransform(transform, p0, p1) {
  const x = p0[0] - p1[0] * transform.k;
  const y = p0[1] - p1[1] * transform.k;

  return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
}

/**
 * Pull a transform back so the pane stays inside `translateExtent`.
 *
 * For each axis: when the content is smaller than the pane the two slacks
 * disagree in sign and the content is centred; otherwise only the violated edge
 * is corrected. The `||` chain is deliberate and matches d3 exactly, including
 * the fact that a `-0` from `Math.min` is falsy and therefore falls through to
 * the opposite edge.
 * @param {Transform} transform
 * @param {import('c/flowTypes').CoordinateExtent} extent pane rect in pane pixels
 * @param {import('c/flowTypes').CoordinateExtent} translateExtent allowed flow-space rect
 * @returns {Transform}
 */
export function constrain(transform, extent, translateExtent) {
  const dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0];
  const dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0];
  const dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1];
  const dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];

  return transform.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}

/**
 * Wheel delta in zoom powers of two.
 *
 * `deltaMode` 1 is lines and 2 is pages, which report far larger numbers than
 * pixels and so need much smaller factors. xyflow diverges from d3 here: d3
 * applies the 10x Ctrl factor on every platform, xyflow only on macOS, where
 * Ctrl+wheel is the trackpad pinch gesture.
 * @param {WheelEvent} event
 * @param {boolean} [isMac=false]
 * @returns {number}
 */
export function wheelDelta(event, isMac = false) {
  const factor = event.ctrlKey && isMac ? 10 : 1;

  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
}

function cosh(x) {
  const e = Math.exp(x);
  return (e + 1 / e) / 2;
}

function sinh(x) {
  const e = Math.exp(x);
  return (e - 1 / e) / 2;
}

function tanh(x) {
  const e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
}

/**
 * Van Wijk and Nuij smooth zoom interpolation between two `[x, y, width]`
 * views.
 *
 * Interpolating scale linearly looks wrong: the view appears to accelerate as
 * it zooms in. This traces a hyperbolic path through zoom space instead, so the
 * apparent velocity stays constant. The returned function carries a `duration`
 * in ms that is the perceptually even time for the move.
 * @param {[number, number, number]} p0 `[x, y, width]`
 * @param {[number, number, number]} p1
 * @returns {((t: number) => [number, number, number]) & {duration: number}}
 */
export function interpolateZoom(p0, p1) {
  const [ux0, uy0, w0] = p0;
  const [ux1, uy1, w1] = p1;
  const dx = ux1 - ux0;
  const dy = uy1 - uy0;
  const d2 = dx * dx + dy * dy;

  let i;
  let S;

  if (d2 < EPSILON2) {
    // Pure zoom, no pan: interpolate the width geometrically.
    S = Math.log(w1 / w0) / RHO;
    i = (t) => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(RHO * t * S)];
  } else {
    const d1 = Math.sqrt(d2);
    const b0 = (w1 * w1 - w0 * w0 + RHO4 * d2) / (2 * w0 * RHO2 * d1);
    const b1 = (w1 * w1 - w0 * w0 - RHO4 * d2) / (2 * w1 * RHO2 * d1);
    const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
    const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);

    S = (r1 - r0) / RHO;
    i = (t) => {
      const s = t * S;
      const coshr0 = cosh(r0);
      const u = (w0 / (RHO2 * d1)) * (coshr0 * tanh(RHO * s + r0) - sinh(r0));

      return [ux0 + u * dx, uy0 + u * dy, (w0 * coshr0) / cosh(RHO * s + r0)];
    };
  }

  i.duration = (S * 1000 * RHO) / Math.SQRT2;

  return i;
}

/**
 * Component-wise linear interpolation between two `[x, y, width]` views.
 *
 * The `'linear'` alternative to {@link interpolateZoom}, matching what xyflow
 * selects when `interpolate: 'linear'` is requested.
 * @param {[number, number, number]} p0
 * @param {[number, number, number]} p1
 * @returns {((t: number) => [number, number, number]) & {duration: number}}
 */
export function interpolateLinear(p0, p1) {
  const i = (t) => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t];

  i.duration = 0;

  return i;
}

/**
 * Build the transform tween d3 uses for an animated viewport move.
 *
 * The interpolation happens in `[x, y, width]` space around a fixed pane point,
 * not on the transform's own fields. That is what keeps the anchor point
 * stationary for the whole animation. `t === 1` returns the target transform
 * verbatim to avoid an accumulated rounding error at the end.
 * @param {Transform} from
 * @param {Transform} to
 * @param {import('c/flowTypes').CoordinateExtent} extent pane rect
 * @param {[number, number]} [point] pane point to hold fixed; defaults to the pane centre
 * @param {(p0: *, p1: *) => *} [interpolator=interpolateZoom]
 * @returns {((t: number) => Transform) & {duration: number}}
 */
export function interpolateTransform(from, to, extent, point, interpolator = interpolateZoom) {
  const p = point == null ? centroid(extent) : point;
  const w = Math.max(extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]);
  const i = interpolator(from.invert(p).concat(w / from.k), to.invert(p).concat(w / to.k));

  const tween = (t) => {
    if (t === 1) {
      return to;
    }
    const l = i(t);
    const k = w / l[2];

    return new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
  };

  tween.duration = i.duration;

  return tween;
}

/**
 * d3-ease `cubicInOut`. The easing xyflow applies to viewport transitions.
 * @param {number} t in `[0, 1]`
 * @returns {number}
 */
export function cubicInOut(t) {
  let u = t * 2;

  if (u <= 1) {
    return (u * u * u) / 2;
  }
  u -= 2;

  return (u * u * u + 2) / 2;
}

/**
 * True on macOS, where Ctrl+wheel is the trackpad pinch gesture.
 *
 * Guarded because `navigator` is absent in the Jest environment and in any
 * non-browser evaluation of this module.
 * @returns {boolean}
 */
export function isMacOs() {
  return typeof navigator !== 'undefined' && (navigator?.userAgent?.indexOf('Mac') ?? -1) >= 0;
}
