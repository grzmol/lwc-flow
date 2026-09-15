import { createElement } from 'lwc';
import FlowMarkers, { getMarkerId, createMarkerIds } from 'c/flowMarkers';
import { MarkerType } from 'c/flowTypes';

function render(markers) {
  const element = createElement('c-flow-markers', { is: FlowMarkers });
  element.markers = markers;
  document.body.appendChild(element);
  return element;
}

function markerElements(element) {
  return Array.from(element.shadowRoot.querySelectorAll('marker'));
}

describe('getMarkerId', () => {
  it('returns an empty string for a missing marker', () => {
    expect(getMarkerId(undefined)).toBe('');
    expect(getMarkerId(null)).toBe('');
    expect(getMarkerId('')).toBe('');
  });

  it('passes a string marker through as its own id', () => {
    expect(getMarkerId('my-marker')).toBe('my-marker');
    expect(getMarkerId('my-marker', 'flow-1')).toBe('my-marker');
  });

  it('builds the id from the sorted marker entries', () => {
    expect(getMarkerId({ type: MarkerType.ArrowClosed, color: '#f00', width: 20 })).toBe(
      'color=#f00&type=arrowclosed&width=20'
    );
  });

  it('sorts keys by name, not by insertion order', () => {
    const a = getMarkerId({ width: 20, type: MarkerType.Arrow, color: '#f00' });
    const b = getMarkerId({ color: '#f00', width: 20, type: MarkerType.Arrow });

    expect(a).toBe('color=#f00&type=arrow&width=20');
    expect(b).toBe(a);
  });

  it('prefixes the flow id so two flows on one page cannot collide', () => {
    expect(getMarkerId({ type: MarkerType.Arrow }, 'flow-1')).toBe('flow-1__type=arrow');
    expect(getMarkerId({ type: MarkerType.Arrow }, '')).toBe('type=arrow');
  });
});

describe('createMarkerIds', () => {
  it('collects one entry per distinct object marker', () => {
    const edges = [
      { id: 'e1', markerEnd: { type: MarkerType.Arrow } },
      { id: 'e2', markerEnd: { type: MarkerType.ArrowClosed } },
    ];

    expect(createMarkerIds(edges, {}).map((m) => m.id)).toEqual(['type=arrow', 'type=arrowclosed']);
  });

  it('dedupes identical markers across edges and ends', () => {
    const edges = [
      { id: 'e1', markerStart: { type: MarkerType.Arrow }, markerEnd: { type: MarkerType.Arrow } },
      { id: 'e2', markerEnd: { type: MarkerType.Arrow } },
    ];

    expect(createMarkerIds(edges, {})).toHaveLength(1);
  });

  it('ignores string markers, which already reference a definition', () => {
    const edges = [{ id: 'e1', markerEnd: 'custom', markerStart: { type: MarkerType.Arrow } }];

    expect(createMarkerIds(edges, {}).map((m) => m.id)).toEqual(['type=arrow']);
  });

  it('falls back to the default color and keeps an explicit one', () => {
    const edges = [
      { id: 'e1', markerEnd: { type: MarkerType.Arrow } },
      { id: 'e2', markerEnd: { type: MarkerType.ArrowClosed, color: '#0f0' } },
    ];

    const markers = createMarkerIds(edges, { defaultColor: '#b1b1b7' });
    const byId = Object.fromEntries(markers.map((m) => [m.id, m.color]));

    expect(byId['type=arrow']).toBe('#b1b1b7');
    expect(byId['color=#0f0&type=arrowclosed']).toBe('#0f0');
  });

  it('applies the default markers when an edge has none', () => {
    const markers = createMarkerIds([{ id: 'e1' }], {
      defaultMarkerStart: { type: MarkerType.Arrow },
      defaultMarkerEnd: { type: MarkerType.ArrowClosed },
    });

    expect(markers.map((m) => m.id)).toEqual(['type=arrow', 'type=arrowclosed']);
  });

  it('sorts by id with localeCompare, not by first use', () => {
    const edges = [
      { id: 'e1', markerEnd: { type: MarkerType.Arrow, width: 30 } },
      { id: 'e2', markerEnd: { type: MarkerType.Arrow, color: '#00f' } },
      { id: 'e3', markerEnd: { type: MarkerType.ArrowClosed } },
    ];

    expect(createMarkerIds(edges, {}).map((m) => m.id)).toEqual([
      'color=#00f&type=arrow',
      'type=arrow&width=30',
      'type=arrowclosed',
    ]);
  });

  it('prefixes every id with the flow id', () => {
    const markers = createMarkerIds([{ id: 'e1', markerEnd: { type: MarkerType.Arrow } }], { id: 'flow-1' });

    expect(markers[0].id).toBe('flow-1__type=arrow');
  });
});

describe('c-flow-markers', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  it('renders an empty defs block when there is nothing to define', () => {
    const element = render(undefined);

    expect(element.shadowRoot.querySelector('svg.flow__marker-defs')).not.toBeNull();
    expect(markerElements(element)).toHaveLength(0);
  });

  it('renders one marker per entry with the upstream attribute defaults', () => {
    const element = render([{ id: 'type=arrow', type: MarkerType.Arrow, color: '#b1b1b7' }]);
    const [marker] = markerElements(element);

    expect(marker.getAttribute('markerWidth')).toBe('12.5');
    expect(marker.getAttribute('markerHeight')).toBe('12.5');
    expect(marker.getAttribute('markerUnits')).toBe('strokeWidth');
    expect(marker.getAttribute('orient')).toBe('auto-start-reverse');
    expect(marker.getAttribute('viewBox')).toBe('-10 -10 20 20');
    expect(marker.getAttribute('id')).toContain('type=arrow');
  });

  it('honours the marker size, units and orientation it is given', () => {
    const element = render([
      {
        id: 'm1',
        type: MarkerType.ArrowClosed,
        width: 30,
        height: 20,
        markerUnits: 'userSpaceOnUse',
        orient: 'auto',
      },
    ]);
    const [marker] = markerElements(element);

    expect(marker.getAttribute('markerWidth')).toBe('30');
    expect(marker.getAttribute('markerHeight')).toBe('20');
    expect(marker.getAttribute('markerUnits')).toBe('userSpaceOnUse');
    expect(marker.getAttribute('orient')).toBe('auto');
  });

  it('draws the open arrow as an unfilled chevron', () => {
    const element = render([{ id: 'm1', type: MarkerType.Arrow, color: '#f00' }]);
    const polyline = element.shadowRoot.querySelector('polyline');

    expect(polyline.getAttribute('points')).toBe('-5,-4 0,0 -5,4');
    expect(polyline.getAttribute('class')).toContain('arrow');
    expect(polyline.getAttribute('fill')).toBe('none');
    expect(polyline.getAttribute('style')).toBe('stroke-width: 1; stroke: #f00;');
  });

  it('draws the closed arrow as a filled triangle', () => {
    const element = render([{ id: 'm1', type: MarkerType.ArrowClosed, color: '#f00', strokeWidth: 2 }]);
    const polyline = element.shadowRoot.querySelector('polyline');

    expect(polyline.getAttribute('points')).toBe('-5,-4 0,0 -5,4 -5,-4');
    expect(polyline.getAttribute('class')).toContain('arrowclosed');
    expect(polyline.getAttribute('fill')).toBeNull();
    expect(polyline.getAttribute('style')).toBe('stroke-width: 2; stroke: #f00; fill: #f00;');
  });

  it('leaves the stroke to the stylesheet when the color is null', () => {
    const element = render([{ id: 'm1', type: MarkerType.Arrow, color: null }]);

    expect(element.shadowRoot.querySelector('polyline').getAttribute('style')).toBe('stroke-width: 1;');
  });

  it('drops an unknown marker type and reports it', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const element = render([
      { id: 'm1', type: 'triangle' },
      { id: 'm2', type: MarkerType.Arrow },
    ]);

    expect(markerElements(element)).toHaveLength(1);
    expect(warn).toHaveBeenCalledWith('Marker type "triangle" doesn\'t exist.');
  });
});
