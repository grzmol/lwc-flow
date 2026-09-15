import { builtinEdgeTypes, resolveEdgeType, getEdgePathData } from 'c/flowEdgeTypes';
import { getBezierPath, getSimpleBezierPath, getSmoothStepPath, getStraightPath } from 'c/flowEdgePaths';
import { Position } from 'c/flowTypes';

const GEOMETRY = Object.freeze({
  sourceX: 0,
  sourceY: 0,
  sourcePosition: Position.Bottom,
  targetX: 100,
  targetY: 100,
  targetPosition: Position.Top,
});

const SIDEWAYS = Object.freeze({
  sourceX: 0,
  sourceY: 0,
  sourcePosition: Position.Right,
  targetX: 200,
  targetY: 120,
  targetPosition: Position.Left,
});

describe('builtinEdgeTypes', () => {
  it('registers exactly the five upstream shapes', () => {
    expect(Object.keys(builtinEdgeTypes)).toEqual(['default', 'straight', 'step', 'smoothstep', 'simplebezier']);
  });

  it('draws the default type with getBezierPath', () => {
    const [path, labelX, labelY, offsetX, offsetY] = getBezierPath(GEOMETRY);

    expect(builtinEdgeTypes.default.getPath(GEOMETRY)).toEqual({ path, labelX, labelY, offsetX, offsetY });
    expect(builtinEdgeTypes.default.getPath(GEOMETRY).path).toBe('M0,0 C0,50 100,50 100,100');
  });

  it('draws the straight type with getStraightPath', () => {
    expect(builtinEdgeTypes.straight.getPath(GEOMETRY).path).toBe(getStraightPath(GEOMETRY)[0]);
    expect(builtinEdgeTypes.straight.getPath(GEOMETRY).path).toBe('M 0,0L 100,100');
  });

  it('draws the simplebezier type with getSimpleBezierPath', () => {
    expect(builtinEdgeTypes.simplebezier.getPath(SIDEWAYS).path).toBe(getSimpleBezierPath(SIDEWAYS)[0]);
    expect(builtinEdgeTypes.simplebezier.getPath(SIDEWAYS).path).toBe('M0,0 C100,0 100,120 200,120');
  });

  it('draws the smoothstep type with getSmoothStepPath', () => {
    expect(builtinEdgeTypes.smoothstep.getPath(SIDEWAYS).path).toBe(getSmoothStepPath(SIDEWAYS)[0]);
    expect(builtinEdgeTypes.smoothstep.getPath(SIDEWAYS).path).toBe(
      'M0 0L20 0L 95,0Q 100,0 100,5L 100,115Q 100,120 105,120L180 120L200 120'
    );
  });

  it('draws the step type with getSmoothStepPath and no corner rounding', () => {
    expect(builtinEdgeTypes.step.getPath(SIDEWAYS).path).toBe(getSmoothStepPath({ ...SIDEWAYS, borderRadius: 0 })[0]);
    expect(builtinEdgeTypes.step.getPath(SIDEWAYS).path).toBe(
      'M0 0L20 0L 100,0Q 100,0 100,0L 100,120Q 100,120 100,120L180 120L200 120'
    );
  });

  it('agrees with smoothstep once smoothstep loses its corner rounding', () => {
    expect(builtinEdgeTypes.step.getPath(SIDEWAYS).path).toBe(
      builtinEdgeTypes.smoothstep.getPath({ ...SIDEWAYS, borderRadius: 0 }).path
    );
    expect(builtinEdgeTypes.step.getPath(GEOMETRY).path).toBe(
      builtinEdgeTypes.smoothstep.getPath({ ...GEOMETRY, borderRadius: 0 }).path
    );
  });

  it('keeps a step edge square even when the caller asks for a radius', () => {
    expect(builtinEdgeTypes.step.getPath({ ...SIDEWAYS, borderRadius: 20 }).path).toBe(
      builtinEdgeTypes.step.getPath(SIDEWAYS).path
    );
  });

  it('reports the label anchor and its offset from the source', () => {
    expect(builtinEdgeTypes.straight.getPath({ sourceX: 10, sourceY: 20, targetX: 110, targetY: 220 })).toEqual({
      path: 'M 10,20L 110,220',
      labelX: 60,
      labelY: 120,
      offsetX: 50,
      offsetY: 100,
    });
  });

  it('carries the option defaults of each generator', () => {
    expect(builtinEdgeTypes.default.defaults).toEqual({ curvature: 0.25 });
    expect(builtinEdgeTypes.smoothstep.defaults).toEqual({ borderRadius: 5, offset: 20, stepPosition: 0.5 });
    expect(builtinEdgeTypes.step.defaults).toEqual({ borderRadius: 0 });
  });
});

describe('resolveEdgeType', () => {
  it('resolves each builtin by name', () => {
    expect(resolveEdgeType('smoothstep')).toBe(builtinEdgeTypes.smoothstep);
    expect(resolveEdgeType('straight')).toBe(builtinEdgeTypes.straight);
  });

  it('treats a missing type as the default, without reporting it', () => {
    const onError = jest.fn();

    expect(resolveEdgeType(undefined, undefined, onError)).toBe(builtinEdgeTypes.default);
    expect(resolveEdgeType('', undefined, onError)).toBe(builtinEdgeTypes.default);
    expect(onError).not.toHaveBeenCalled();
  });

  it('falls back to the default type and reports an unknown name', () => {
    const onError = jest.fn();

    expect(resolveEdgeType('spiral', undefined, onError)).toBe(builtinEdgeTypes.default);
    expect(onError).toHaveBeenCalledWith('011', 'Edge type "spiral" not found. Using fallback type "default".');
  });

  it('warns when no error handler is supplied', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(resolveEdgeType('spiral')).toBe(builtinEdgeTypes.default);
    expect(warn).toHaveBeenCalledWith('Edge type "spiral" not found. Using fallback type "default".');
  });

  it('lets a consumer type override a builtin of the same name', () => {
    const custom = {
      getPath: () => ({ path: 'M0,0', labelX: 0, labelY: 0, offsetX: 0, offsetY: 0 }),
      defaults: {},
    };

    expect(resolveEdgeType('smoothstep', { smoothstep: custom })).toBe(custom);
    expect(resolveEdgeType('default', { default: custom })).toBe(custom);
  });

  it('resolves a consumer type that no builtin covers', () => {
    const custom = { getPath: () => ({ path: 'M0,0' }), defaults: {} };
    const onError = jest.fn();

    expect(resolveEdgeType('elbow', { elbow: custom }, onError)).toBe(custom);
    expect(onError).not.toHaveBeenCalled();
  });

  it('does not mistake inherited object keys for registered types', () => {
    const onError = jest.fn();

    expect(resolveEdgeType('toString', {}, onError)).toBe(builtinEdgeTypes.default);
    expect(onError).toHaveBeenCalledWith('011', 'Edge type "toString" not found. Using fallback type "default".');
  });
});

describe('getEdgePathData', () => {
  it('routes an edge through its own type', () => {
    expect(getEdgePathData({ id: 'e1', type: 'straight' }, GEOMETRY).path).toBe('M 0,0L 100,100');
    expect(getEdgePathData({ id: 'e1' }, GEOMETRY).path).toBe(getBezierPath(GEOMETRY)[0]);
  });

  it('applies the type defaults when the edge carries no options', () => {
    const backwards = { ...GEOMETRY, sourceY: 100, targetY: 0 };

    expect(getEdgePathData({ id: 'e1' }, backwards).path).toBe(getBezierPath({ ...backwards, curvature: 0.25 })[0]);
  });

  it('lets an edge option beat the type default', () => {
    const backwards = { ...GEOMETRY, sourceY: 100, targetY: 0 };
    const withDefault = getEdgePathData({ id: 'e1' }, backwards).path;
    const withOption = getEdgePathData({ id: 'e1', curvature: 0.5 }, backwards).path;

    expect(withOption).toBe(getBezierPath({ ...backwards, curvature: 0.5 })[0]);
    expect(withOption).not.toBe(withDefault);
  });

  it('reads options out of pathOptions as upstream stores them', () => {
    const edge = { id: 'e1', type: 'smoothstep', pathOptions: { borderRadius: 0 } };

    expect(getEdgePathData(edge, SIDEWAYS).path).toBe(builtinEdgeTypes.step.getPath(SIDEWAYS).path);
  });

  it('prefers a nested option over the same option written flat', () => {
    const edge = { id: 'e1', type: 'smoothstep', borderRadius: 20, pathOptions: { borderRadius: 0 } };

    expect(getEdgePathData(edge, SIDEWAYS).path).toBe(getSmoothStepPath({ ...SIDEWAYS, borderRadius: 0 })[0]);
  });

  it('never lets an edge option overwrite the measured geometry', () => {
    const edge = { id: 'e1', type: 'straight', sourceX: 999, targetY: -999 };

    expect(getEdgePathData(edge, GEOMETRY).path).toBe('M 0,0L 100,100');
  });

  it('honours the offset and step position an edge asks for', () => {
    const edge = { id: 'e1', type: 'smoothstep', pathOptions: { offset: 40, stepPosition: 0.25 } };

    expect(getEdgePathData(edge, GEOMETRY)).toEqual({
      path: 'M0 0L0 40L 0,42.5Q 0,45 2.5,45L 95,45Q 100,45 100,50L100 60L100 100',
      labelX: 50,
      labelY: 45,
      offsetX: 50,
      offsetY: 50,
    });
  });

  it('routes an edge through a consumer type and reports an unknown one', () => {
    const custom = { getPath: (geometry) => ({ path: `M${geometry.sourceX},${geometry.sourceY}` }), defaults: {} };
    const onError = jest.fn();

    expect(getEdgePathData({ id: 'e1', type: 'elbow' }, GEOMETRY, { elbow: custom }).path).toBe('M0,0');
    expect(getEdgePathData({ id: 'e1', type: 'spiral' }, GEOMETRY, {}, onError).path).toBe(getBezierPath(GEOMETRY)[0]);
    expect(onError).toHaveBeenCalledWith('011', 'Edge type "spiral" not found. Using fallback type "default".');
  });
});
