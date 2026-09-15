import {
  Position,
  oppositePosition,
  ConnectionMode,
  ConnectionLineType,
  MarkerType,
  SelectionMode,
  PanOnScrollMode,
  infiniteExtent,
  elementSelectionKeys,
  interactionClass,
  ELEVATE_ON_SELECT_Z,
  DEFAULT_CONNECTION_RADIUS,
  DEFAULT_INTERACTION_WIDTH,
  DEFAULT_AUTO_PAN_SPEED,
  AUTO_PAN_DISTANCE,
  HANDLE_SEARCH_PADDING,
  DEFAULT_MIN_ZOOM,
  DEFAULT_MAX_ZOOM,
  DEFAULT_TRANSITION_DURATION,
  errorMessages,
  defaultAriaLabelConfig,
  mergeAriaLabelConfig,
} from 'c/flowTypes';

describe('c-flow-types enums', () => {
  it('maps Position to the lowercase side names upstream emits in class names', () => {
    expect(Position).toEqual({ Left: 'left', Top: 'top', Right: 'right', Bottom: 'bottom' });
  });

  it('maps ConnectionMode to strict and loose', () => {
    expect(ConnectionMode).toEqual({ Strict: 'strict', Loose: 'loose' });
  });

  it('maps ConnectionLineType with Bezier spelled "default"', () => {
    expect(ConnectionLineType).toEqual({
      Bezier: 'default',
      Straight: 'straight',
      Step: 'step',
      SmoothStep: 'smoothstep',
      SimpleBezier: 'simplebezier',
    });
  });

  it('maps MarkerType to arrow and arrowclosed', () => {
    expect(MarkerType).toEqual({ Arrow: 'arrow', ArrowClosed: 'arrowclosed' });
  });

  it('maps SelectionMode to partial and full', () => {
    expect(SelectionMode).toEqual({ Partial: 'partial', Full: 'full' });
  });

  it('maps PanOnScrollMode to free, vertical and horizontal', () => {
    expect(PanOnScrollMode).toEqual({ Free: 'free', Vertical: 'vertical', Horizontal: 'horizontal' });
  });
});

describe('c-flow-types oppositePosition', () => {
  it('mirrors each side', () => {
    expect(oppositePosition[Position.Left]).toBe(Position.Right);
    expect(oppositePosition[Position.Right]).toBe(Position.Left);
    expect(oppositePosition[Position.Top]).toBe(Position.Bottom);
    expect(oppositePosition[Position.Bottom]).toBe(Position.Top);
  });

  it('is an involution over all four sides', () => {
    for (const side of Object.values(Position)) {
      expect(oppositePosition[oppositePosition[side]]).toBe(side);
    }
  });

  it('covers exactly the four sides', () => {
    expect(Object.keys(oppositePosition).sort()).toEqual(Object.values(Position).sort());
  });
});

describe('c-flow-types constants', () => {
  it('spans the whole coordinate space with infiniteExtent', () => {
    expect(infiniteExtent).toEqual([
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ]);
  });

  it('lists the keys that select or cancel a focused element', () => {
    expect(elementSelectionKeys).toEqual(['Enter', ' ', 'Escape']);
  });

  it('names the opt-out CSS classes upstream reads off user markup', () => {
    expect(interactionClass).toEqual({
      noDrag: 'nodrag',
      noPan: 'nopan',
      noWheel: 'nowheel',
      dragHandle: 'drag-handle',
    });
  });

  it('keeps the numeric defaults upstream ships', () => {
    expect(ELEVATE_ON_SELECT_Z).toBe(1000);
    expect(DEFAULT_CONNECTION_RADIUS).toBe(20);
    expect(DEFAULT_INTERACTION_WIDTH).toBe(20);
    expect(DEFAULT_AUTO_PAN_SPEED).toBe(15);
    expect(AUTO_PAN_DISTANCE).toBe(40);
    expect(HANDLE_SEARCH_PADDING).toBe(250);
    expect(DEFAULT_MIN_ZOOM).toBe(0.5);
    expect(DEFAULT_MAX_ZOOM).toBe(2);
    expect(DEFAULT_TRANSITION_DURATION).toBe(0);
  });
});

describe('c-flow-types immutability', () => {
  it('freezes every exported enum and constant map', () => {
    expect(Object.isFrozen(Position)).toBe(true);
    expect(Object.isFrozen(oppositePosition)).toBe(true);
    expect(Object.isFrozen(ConnectionMode)).toBe(true);
    expect(Object.isFrozen(ConnectionLineType)).toBe(true);
    expect(Object.isFrozen(MarkerType)).toBe(true);
    expect(Object.isFrozen(SelectionMode)).toBe(true);
    expect(Object.isFrozen(PanOnScrollMode)).toBe(true);
    expect(Object.isFrozen(elementSelectionKeys)).toBe(true);
    expect(Object.isFrozen(interactionClass)).toBe(true);
    expect(Object.isFrozen(errorMessages)).toBe(true);
    expect(Object.isFrozen(defaultAriaLabelConfig)).toBe(true);
  });

  it('freezes infiniteExtent and both of its rows', () => {
    expect(Object.isFrozen(infiniteExtent)).toBe(true);
    expect(Object.isFrozen(infiniteExtent[0])).toBe(true);
    expect(Object.isFrozen(infiniteExtent[1])).toBe(true);
  });

  // ES modules are always strict, so a write to a frozen enum throws rather than silently no-oping.
  it('rejects a write to a frozen enum', () => {
    expect(() => {
      Position.Left = 'nope';
    }).toThrow(TypeError);
    expect(Position.Left).toBe('left');
  });
});

describe('c-flow-types errorMessages', () => {
  it('interpolates the node type into error003', () => {
    expect(errorMessages.error003('banana')).toBe('Node type "banana" not found. Using fallback type "default".');
  });

  it('interpolates the edge id into error007', () => {
    expect(errorMessages.error007('e-42')).toBe('The old edge with id=e-42 does not exist.');
  });

  it('interpolates the marker type into error009', () => {
    expect(errorMessages.error009('triangle')).toBe('Marker type "triangle" doesn\'t exist.');
  });

  it('interpolates the edge type into error011', () => {
    expect(errorMessages.error011('wiggly')).toBe('Edge type "wiggly" not found. Using fallback type "default".');
  });

  it('interpolates the node id into error012', () => {
    expect(errorMessages.error012('n1')).toBe(
      'Node with id "n1" does not exist, it may have been removed. This can happen when a node is deleted before its click handler is called.'
    );
  });

  it('interpolates the edge id into error016', () => {
    expect(errorMessages.error016('e1')).toBe(
      'Edge with id "e1" does not exist, it may have been removed. This can happen when an edge is deleted before its click handler is called.'
    );
  });

  it('returns fixed text for the argument-free factories', () => {
    expect(errorMessages.error002()).toContain('nodeTypes or edgeTypes');
    expect(errorMessages.error004()).toBe('The parent container needs a width and a height to render the graph.');
    expect(errorMessages.error005()).toBe('Only child nodes can use a parent extent.');
    expect(errorMessages.error006()).toBe("Can't create edge. An edge needs a source and a target.");
    expect(errorMessages.error010()).toBe(
      'Handle: No node id found. Make sure to only use a handle inside a custom node.'
    );
    expect(errorMessages.error015()).toBe('It seems that you are trying to drag a node that is not initialized.');
  });

  it('exposes every message as a callable factory', () => {
    for (const factory of Object.values(errorMessages)) {
      expect(typeof factory).toBe('function');
      expect(typeof factory('x')).toBe('string');
    }
  });
});

describe('c-flow-types mergeAriaLabelConfig', () => {
  it('returns the defaults when nothing is supplied', () => {
    expect(mergeAriaLabelConfig()).toEqual(defaultAriaLabelConfig);
    expect(mergeAriaLabelConfig(null)).toEqual(defaultAriaLabelConfig);
    expect(mergeAriaLabelConfig({})).toEqual(defaultAriaLabelConfig);
  });

  it('overrides only the supplied keys and keeps the rest', () => {
    const merged = mergeAriaLabelConfig({ 'controls.ariaLabel': 'Steuerung' });

    expect(merged['controls.ariaLabel']).toBe('Steuerung');
    expect(merged['controls.zoomIn.ariaLabel']).toBe(defaultAriaLabelConfig['controls.zoomIn.ariaLabel']);
    expect(merged['minimap.ariaLabel']).toBe('Mini Map');
    expect(Object.keys(merged)).toHaveLength(Object.keys(defaultAriaLabelConfig).length);
  });

  it('lets a caller add a key the defaults do not have', () => {
    const merged = mergeAriaLabelConfig({ 'custom.key': 'v' });

    expect(merged['custom.key']).toBe('v');
    expect(Object.keys(merged)).toHaveLength(Object.keys(defaultAriaLabelConfig).length + 1);
  });

  it('returns a fresh unfrozen object so callers cannot corrupt the defaults', () => {
    const merged = mergeAriaLabelConfig({ 'handle.ariaLabel': 'Griff' });

    expect(merged).not.toBe(defaultAriaLabelConfig);
    expect(Object.isFrozen(merged)).toBe(false);
    expect(defaultAriaLabelConfig['handle.ariaLabel']).toBe('Handle');
  });

  it('keeps the live-region label as a factory that interpolates the move', () => {
    const merged = mergeAriaLabelConfig();

    expect(merged['node.a11yDescription.ariaLiveMessage']({ direction: 'up', x: 12, y: -3 })).toBe(
      'Moved selected node up. New position, x: 12, y: -3'
    );
  });
});
