import {
  Transform,
  transformIdentity,
  viewportToTransform,
  transformToViewport,
  centroid,
  scaleTransform,
  translateTransform,
  constrain,
  wheelDelta,
  interpolateZoom,
  interpolateLinear,
  interpolateTransform,
  cubicInOut,
  isMacOs,
  WHEEL_IDLE_MS,
  DBLCLICK_SCALE_FACTOR,
  DBLCLICK_DURATION,
} from 'c/flowTransform';

/** A wheel event carries only the three fields `wheelDelta` reads. */
function wheelEvent(deltaY, deltaMode, ctrlKey = false) {
  return { deltaY, deltaMode, ctrlKey };
}

describe('c-flow-transform gesture constants', () => {
  it('matches the d3-zoom defaults xyflow relies on', () => {
    expect(WHEEL_IDLE_MS).toBe(150);
    expect(DBLCLICK_SCALE_FACTOR).toBe(2);
    expect(DBLCLICK_DURATION).toBe(250);
  });
});

describe('c-flow-transform Transform', () => {
  it('stores scale and translation as given', () => {
    const t = new Transform(2, 30, -40);

    expect(t.k).toBe(2);
    expect(t.x).toBe(30);
    expect(t.y).toBe(-40);
  });

  it('maps a flow point to a pane point by scale then translate', () => {
    const t = new Transform(2, 30, -40);

    expect(t.apply([10, 20])).toEqual([50, 0]);
    expect(t.applyX(10)).toBe(50);
    expect(t.applyY(20)).toBe(0);
  });

  it('inverts a pane point back to the flow point it came from', () => {
    const t = new Transform(2, 30, -40);

    expect(t.invert([50, 0])).toEqual([10, 20]);
    expect(t.invertX(50)).toBe(10);
    expect(t.invertY(0)).toBe(20);
  });

  it('round-trips apply and invert for a non-integer scale', () => {
    const t = new Transform(0.375, -12.5, 7.25);
    const point = [13.5, -22.25];
    const [x, y] = t.invert(t.apply(point));

    expect(x).toBeCloseTo(point[0], 10);
    expect(y).toBeCloseTo(point[1], 10);
    expect(t.invertX(t.applyX(point[0]))).toBeCloseTo(point[0], 10);
    expect(t.invertY(t.applyY(point[1]))).toBeCloseTo(point[1], 10);
  });

  it('returns the same instance for scale(1) and a new one otherwise', () => {
    const t = new Transform(2, 30, -40);

    expect(t.scale(1)).toBe(t);

    const scaled = t.scale(3);

    expect(scaled).not.toBe(t);
    expect([scaled.k, scaled.x, scaled.y]).toEqual([6, 30, -40]);
  });

  it('returns the same instance for translate(0, 0) and scales the shift otherwise', () => {
    const t = new Transform(2, 30, -40);

    expect(t.translate(0, 0)).toBe(t);

    const moved = t.translate(5, -10);

    expect(moved).not.toBe(t);
    expect([moved.k, moved.x, moved.y]).toEqual([2, 40, -60]);
  });

  it('does not treat a one-axis translate as a no-op', () => {
    const t = new Transform(1, 0, 0);

    expect(t.translate(3, 0)).not.toBe(t);
    expect(t.translate(0, 3)).not.toBe(t);
  });

  it('serialises to the exact CSS transform string, translate before scale', () => {
    expect(new Transform(1.5, 10, -20).toString()).toBe('translate(10,-20) scale(1.5)');
    expect(transformIdentity.toString()).toBe('translate(0,0) scale(1)');
  });

  it('exposes an identity transform', () => {
    expect([transformIdentity.k, transformIdentity.x, transformIdentity.y]).toEqual([1, 0, 0]);
    expect(transformIdentity.apply([7, 8])).toEqual([7, 8]);
  });
});

describe('c-flow-transform viewport conversion', () => {
  it('round-trips a viewport through a transform', () => {
    const viewport = { x: 12, y: -34, zoom: 1.75 };
    const t = viewportToTransform(viewport);

    expect([t.k, t.x, t.y]).toEqual([1.75, 12, -34]);
    expect(transformToViewport(t)).toEqual(viewport);
  });
});

describe('c-flow-transform centroid', () => {
  it('returns the midpoint of an extent', () => {
    expect(
      centroid([
        [0, 0],
        [400, 300],
      ])
    ).toEqual([200, 150]);
    expect(
      centroid([
        [-100, -50],
        [100, 50],
      ])
    ).toEqual([0, 0]);
  });

  it('coerces numeric strings, as d3 does', () => {
    expect(
      centroid([
        ['0', '0'],
        ['400', '200'],
      ])
    ).toEqual([200, 100]);
  });
});

describe('c-flow-transform scaleTransform', () => {
  const extent = [0.5, 4];

  it('clamps to the upper bound of the scale extent', () => {
    const next = scaleTransform(new Transform(2, 10, 20), 10, extent);

    expect([next.k, next.x, next.y]).toEqual([4, 10, 20]);
  });

  it('clamps to the lower bound of the scale extent', () => {
    const next = scaleTransform(new Transform(2, 10, 20), 0.1, extent);

    expect([next.k, next.x, next.y]).toEqual([0.5, 10, 20]);
  });

  it('returns the same instance when the clamped scale is unchanged', () => {
    const t = new Transform(2, 10, 20);

    expect(scaleTransform(t, 2, extent)).toBe(t);
  });

  it('returns the same instance when the request only violates a bound already reached', () => {
    const t = new Transform(4, 10, 20);

    expect(scaleTransform(t, 9, extent)).toBe(t);
  });
});

describe('c-flow-transform translateTransform', () => {
  it('holds the flow point under the pane point', () => {
    const next = translateTransform(new Transform(2, 0, 0), [100, 50], [10, 5]);

    expect([next.k, next.x, next.y]).toEqual([2, 80, 40]);
    expect(next.apply([10, 5])).toEqual([100, 50]);
  });

  it('keeps the anchor fixed after a scale change', () => {
    const zoomed = new Transform(3, 0, 0);
    const anchored = translateTransform(zoomed, [200, 120], [25, 15]);

    expect(anchored.apply([25, 15])).toEqual([200, 120]);
  });

  it('returns the same instance when the translation already satisfies the anchor', () => {
    const t = new Transform(2, 80, 40);

    expect(translateTransform(t, [100, 50], [10, 5])).toBe(t);
  });
});

describe('c-flow-transform constrain', () => {
  const pane = [
    [0, 0],
    [100, 100],
  ];

  it('corrects only the violated leading edge when the content is larger than the pane', () => {
    const next = constrain(new Transform(1, 0, 0), pane, [
      [10, 10],
      [500, 500],
    ]);

    // Left/top are past the bound by 10 flow units; the trailing edges still have slack.
    expect([next.k, next.x, next.y]).toEqual([1, -10, -10]);
    expect(next.invertX(pane[0][0])).toBe(10);
  });

  it('corrects only the violated trailing edge', () => {
    const next = constrain(new Transform(1, 0, 0), pane, [
      [-500, -500],
      [50, 50],
    ]);

    expect([next.k, next.x, next.y]).toEqual([1, 50, 50]);
    expect(next.invertX(pane[1][0])).toBe(50);
  });

  it('centres the content when it is smaller than the pane', () => {
    const next = constrain(new Transform(1, 0, 0), pane, [
      [0, 0],
      [50, 50],
    ]);

    // dx0 = 0, dx1 = 50, so the midpoint shift of 25 centres the 50-wide content.
    expect([next.k, next.x, next.y]).toEqual([1, 25, 25]);
    expect(next.applyX(0) + next.applyX(50)).toBe(100);
  });

  it('centres correctly at a non-unit scale', () => {
    const next = constrain(new Transform(2, 0, 0), pane, [
      [0, 0],
      [10, 10],
    ]);

    // The pane centre must land on the content centre, flow 5, and the content
    // must sit symmetrically inside the 100px pane at 40..60.
    expect(next.invertX(50)).toBeCloseTo(5, 10);
    expect(next.invertY(50)).toBeCloseTo(5, 10);
    expect(next.applyX(0)).toBeCloseTo(40, 10);
    expect(next.applyX(10)).toBeCloseTo(60, 10);
  });

  it('is a no-op that preserves instance identity when already inside the extent', () => {
    const t = new Transform(1, 0, 0);

    expect(
      constrain(t, pane, [
        [-1000, -1000],
        [1000, 1000],
      ])
    ).toBe(t);
  });

  it('is a no-op for an infinite translate extent', () => {
    const t = new Transform(1.5, 33, -44);
    const infinite = [
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ];

    expect(constrain(t, pane, infinite)).toBe(t);
  });
});

describe('c-flow-transform wheelDelta', () => {
  it('uses 0.002 per pixel', () => {
    expect(wheelDelta(wheelEvent(-100, 0))).toBeCloseTo(0.2, 12);
  });

  it('uses 0.05 per line', () => {
    expect(wheelDelta(wheelEvent(-100, 1))).toBeCloseTo(5, 12);
  });

  it('uses 1 per page', () => {
    expect(wheelDelta(wheelEvent(-100, 2))).toBeCloseTo(100, 12);
  });

  it('inverts the sign of deltaY', () => {
    expect(wheelDelta(wheelEvent(100, 0))).toBeCloseTo(-0.2, 12);
  });

  it('applies the 10x ctrl factor only on macOS', () => {
    expect(wheelDelta(wheelEvent(-100, 0, true), true)).toBeCloseTo(2, 12);
    expect(wheelDelta(wheelEvent(-100, 0, true), false)).toBeCloseTo(0.2, 12);
    expect(wheelDelta(wheelEvent(-100, 0, true))).toBeCloseTo(0.2, 12);
  });

  it('ignores the mac flag without the ctrl key', () => {
    expect(wheelDelta(wheelEvent(-100, 0, false), true)).toBeCloseTo(0.2, 12);
  });
});

describe('c-flow-transform interpolateZoom', () => {
  it('pins both endpoints for the pure-zoom special case', () => {
    const i = interpolateZoom([100, 50, 200], [100, 50, 800]);

    expect(i(0)[0]).toBeCloseTo(100, 10);
    expect(i(0)[1]).toBeCloseTo(50, 10);
    expect(i(0)[2]).toBeCloseTo(200, 10);
    expect(i(1)[0]).toBeCloseTo(100, 10);
    expect(i(1)[1]).toBeCloseTo(50, 10);
    expect(i(1)[2]).toBeCloseTo(800, 10);
  });

  it('interpolates width geometrically, not linearly, in the pure-zoom case', () => {
    const i = interpolateZoom([0, 0, 100], [0, 0, 400]);

    // Geometric midpoint is 200, the linear one would be 250.
    expect(i(0.5)[2]).toBeCloseTo(200, 8);
  });

  it('treats a sub-epsilon pan as pure zoom', () => {
    const i = interpolateZoom([0, 0, 100], [1e-7, 0, 400]);

    expect(i(1)[0]).toBeCloseTo(1e-7, 14);
    expect(i(1)[2]).toBeCloseTo(400, 8);
  });

  it('reports a positive finite duration for the pure-zoom case', () => {
    const i = interpolateZoom([0, 0, 100], [0, 0, 400]);

    expect(i.duration).toBeGreaterThan(0);
    expect(Number.isFinite(i.duration)).toBe(true);
  });

  it('pins both endpoints for the general pan-and-zoom case', () => {
    const i = interpolateZoom([0, 0, 100], [500, 0, 100]);

    expect(i(0)[0]).toBeCloseTo(0, 8);
    expect(i(0)[1]).toBeCloseTo(0, 8);
    expect(i(0)[2]).toBeCloseTo(100, 8);
    expect(i(1)[0]).toBeCloseTo(500, 8);
    expect(i(1)[1]).toBeCloseTo(0, 8);
    expect(i(1)[2]).toBeCloseTo(100, 8);
  });

  it('zooms out through the middle of a long pan', () => {
    const i = interpolateZoom([0, 0, 100], [500, 0, 100]);

    // The Van Wijk path widens the view mid-flight so the pan reads as one move.
    expect(i(0.5)[2]).toBeGreaterThan(100);
  });

  it('reports a positive finite duration for the general case', () => {
    const i = interpolateZoom([0, 0, 100], [500, 250, 300]);

    expect(i.duration).toBeGreaterThan(0);
    expect(Number.isFinite(i.duration)).toBe(true);
  });
});

describe('c-flow-transform interpolateLinear', () => {
  it('interpolates each component linearly', () => {
    const i = interpolateLinear([0, 0, 100], [100, 200, 300]);

    expect(i(0)).toEqual([0, 0, 100]);
    expect(i(0.5)).toEqual([50, 100, 200]);
    expect(i(1)).toEqual([100, 200, 300]);
  });

  it('reports a zero duration so the caller supplies one', () => {
    expect(interpolateLinear([0, 0, 1], [1, 1, 2]).duration).toBe(0);
  });
});

describe('c-flow-transform interpolateTransform', () => {
  const from = new Transform(1, 0, 0);
  const to = new Transform(2, -100, -50);
  const extent = [
    [0, 0],
    [400, 300],
  ];
  const point = [200, 150];

  it('returns the target instance itself at t = 1', () => {
    const tween = interpolateTransform(from, to, extent, point);

    expect(tween(1)).toBe(to);
  });

  it('reproduces the source geometry at t = 0', () => {
    const tween = interpolateTransform(from, to, extent, point);
    const start = tween(0);

    expect(start).not.toBe(from);
    expect(start.k).toBeCloseTo(from.k, 8);
    expect(start.x).toBeCloseTo(from.x, 8);
    expect(start.y).toBeCloseTo(from.y, 8);
  });

  it('holds the anchor pane point fixed for the whole tween', () => {
    const tween = interpolateTransform(from, to, extent, point);

    for (const t of [0, 0.1, 0.25, 0.5, 0.75, 0.9]) {
      const transform = tween(t);
      const [x, y] = transform.apply(transform.invert(point));

      expect(x).toBeCloseTo(point[0], 8);
      expect(y).toBeCloseTo(point[1], 8);
    }
  });

  it('maps the interpolated flow point onto the anchor at every step', () => {
    const tween = interpolateTransform(from, to, extent, point);
    const trace = interpolateZoom(from.invert(point).concat(400 / from.k), to.invert(point).concat(400 / to.k));

    for (const t of [0.2, 0.4, 0.6, 0.8]) {
      const [x, y] = tween(t).apply([trace(t)[0], trace(t)[1]]);

      expect(x).toBeCloseTo(point[0], 8);
      expect(y).toBeCloseTo(point[1], 8);
    }
  });

  it('moves monotonically from the source scale to the target scale', () => {
    const tween = interpolateTransform(from, to, extent, point);
    const scales = [0, 0.25, 0.5, 0.75].map((t) => tween(t).k);

    for (let i = 1; i < scales.length; i++) {
      expect(scales[i]).toBeGreaterThan(scales[i - 1]);
    }
    expect(scales[0]).toBeCloseTo(1, 8);
  });

  it('defaults the anchor to the pane centroid', () => {
    const defaulted = interpolateTransform(from, to, extent);
    const explicit = interpolateTransform(from, to, extent, centroid(extent));

    expect(defaulted(0.5).k).toBeCloseTo(explicit(0.5).k, 12);
    expect(defaulted(0.5).x).toBeCloseTo(explicit(0.5).x, 12);
    expect(defaulted(0.5).y).toBeCloseTo(explicit(0.5).y, 12);
  });

  it('carries the interpolator duration', () => {
    const tween = interpolateTransform(from, to, extent, point);

    expect(tween.duration).toBeGreaterThan(0);
    expect(interpolateTransform(from, to, extent, point, interpolateLinear).duration).toBe(0);
  });

  it('accepts a custom interpolator', () => {
    const tween = interpolateTransform(from, to, extent, point, interpolateLinear);
    const mid = tween(0.5);

    // Linear on [x, y, width]: width goes 400 -> 200, so the midpoint width is 300.
    expect(mid.k).toBeCloseTo(400 / 300, 10);
    expect(tween(1)).toBe(to);
  });
});

describe('c-flow-transform cubicInOut', () => {
  it('pins the endpoints and the midpoint', () => {
    expect(cubicInOut(0)).toBe(0);
    expect(cubicInOut(0.5)).toBe(0.5);
    expect(cubicInOut(1)).toBe(1);
  });

  it('is symmetric about the midpoint', () => {
    for (const t of [0, 0.125, 0.25, 0.375, 0.5]) {
      expect(cubicInOut(t) + cubicInOut(1 - t)).toBe(1);
    }
  });

  it('eases in below the midpoint and out above it', () => {
    expect(cubicInOut(0.25)).toBeCloseTo(0.0625, 12);
    expect(cubicInOut(0.75)).toBeCloseTo(0.9375, 12);
    expect(cubicInOut(0.25)).toBeLessThan(0.25);
    expect(cubicInOut(0.75)).toBeGreaterThan(0.75);
  });

  it('increases monotonically', () => {
    let previous = -1;

    for (let t = 0; t <= 1.0001; t += 0.05) {
      const value = cubicInOut(Math.min(t, 1));

      expect(value).toBeGreaterThan(previous);
      previous = value;
    }
  });
});

describe('c-flow-transform isMacOs', () => {
  afterEach(() => {
    delete window.navigator.userAgent;
  });

  it('is false for a user agent without Mac', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    expect(isMacOs()).toBe(false);
  });

  it('is true for a Macintosh user agent', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      configurable: true,
    });

    expect(isMacOs()).toBe(true);
  });

  it('is false when the user agent is unreadable', () => {
    Object.defineProperty(window.navigator, 'userAgent', { value: undefined, configurable: true });

    expect(isMacOs()).toBe(false);
  });
});
