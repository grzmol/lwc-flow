/**
 * Edge marker (arrowhead) definitions.
 *
 * Ports `@xyflow/system/src/utils/marker.ts` (`getMarkerId`, `createMarkerIds`) plus the React
 * `MarkerDefinitions`, `Marker` and `MarkerSymbols` components from
 * `@xyflow/react/src/container/EdgeRenderer/`.
 *
 * Deviations from upstream:
 * - Upstream reads the edge list and the default edge options straight from its store. There is no
 *   store here, so the parent dedupes with {@link createMarkerIds} and hands the result over as the
 *   `markers` property.
 * - Upstream reports an unknown marker type through the flow's `onError` callback. Without a store
 *   there is nobody to report to, so an unknown type is dropped with a warning that reuses the
 *   upstream `error009` text.
 * - Upstream returns `null` when there is no marker. A template needs a root element, so the
 *   `<svg>` is always rendered and its `<defs>` is simply empty.
 * - Upstream writes `refX="0" refY="0"`. The LWC template compiler rejects any attribute name
 *   ending in an uppercase letter, and `0` is already the SVG default for both, so they are left
 *   off rather than written through a lifecycle hook.
 */

import { LightningElement, api } from 'lwc';
import { MarkerType, errorMessages } from 'c/flowTypes';

/** `<marker>` attribute defaults, from the React `Marker` component. */
const DEFAULT_MARKER_WIDTH = 12.5;
const DEFAULT_MARKER_HEIGHT = 12.5;
const DEFAULT_MARKER_UNITS = 'strokeWidth';
const DEFAULT_ORIENT = 'auto-start-reverse';

/** Symbol defaults, from `ArrowSymbol` / `ArrowClosedSymbol`. */
const DEFAULT_SYMBOL_COLOR = 'none';
const DEFAULT_SYMBOL_STROKE_WIDTH = 1;

/**
 * The two arrowheads upstream ships. Both are `<polyline>` elements - upstream draws them with
 * `points`, not with a path `d`, so the point lists are copied verbatim from `MarkerSymbols.tsx`.
 * `arrowclosed` repeats the first point to close the triangle so the fill covers it.
 */
const MARKER_SHAPES = Object.freeze({
  [MarkerType.Arrow]: { shapeClass: 'arrow', points: '-5,-4 0,0 -5,4', filled: false },
  [MarkerType.ArrowClosed]: { shapeClass: 'arrowclosed', points: '-5,-4 0,0 -5,4 -5,-4', filled: true },
});

/**
 * Stable id for a marker. A string marker is already an id reference; an object marker is
 * identified by its own values so that two edges asking for the same arrowhead share one `<marker>`.
 * @param {string|Object} [marker] marker type string or `EdgeMarker` object
 * @param {string} [id] flow id, prefixed so several flows on one page cannot collide
 * @returns {string}
 */
export function getMarkerId(marker, id) {
  if (!marker) {
    return '';
  }

  if (typeof marker === 'string') {
    return marker;
  }

  const idPrefix = id ? `${id}__` : '';

  return `${idPrefix}${Object.keys(marker)
    .sort()
    .map((key) => `${key}=${marker[key]}`)
    .join('&')}`;
}

/**
 * The deduped set of `<marker>` definitions a set of edges needs. String markers are skipped: they
 * reference a definition the consumer supplied. Sorted by id so the rendered order is stable.
 * @param {Array<Object>} edges
 * @param {Object} options
 * @param {string} [options.id] flow id, forwarded to {@link getMarkerId}
 * @param {string} [options.defaultColor] used when a marker carries no `color`
 * @param {string|Object} [options.defaultMarkerStart]
 * @param {string|Object} [options.defaultMarkerEnd]
 * @returns {Array<Object>} marker props, each with a generated `id`
 */
export function createMarkerIds(edges, { id, defaultColor, defaultMarkerStart, defaultMarkerEnd }) {
  const ids = new Set();

  return edges
    .reduce((markers, edge) => {
      [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach((marker) => {
        if (marker && typeof marker === 'object') {
          const markerId = getMarkerId(marker, id);
          if (!ids.has(markerId)) {
            markers.push({ id: markerId, color: marker.color || defaultColor, ...marker });
            ids.add(markerId);
          }
        }
      });

      return markers;
    }, [])
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Inline style for an arrowhead. Mirrors the React symbol components: the stroke width is always
 * written, the stroke (and, for the closed arrow, the fill) only when a color is present, which
 * lets a `null` color fall through to the stylesheet.
 * @param {Object} marker
 * @param {boolean} filled
 * @returns {string}
 */
function symbolStyle(marker, filled) {
  const color = marker.color === undefined ? DEFAULT_SYMBOL_COLOR : marker.color;
  const strokeWidth = marker.strokeWidth === undefined ? DEFAULT_SYMBOL_STROKE_WIDTH : marker.strokeWidth;

  let style = `stroke-width: ${strokeWidth};`;

  if (color) {
    style += ` stroke: ${color};`;

    if (filled) {
      style += ` fill: ${color};`;
    }
  }

  return style;
}

/**
 * Apply upstream's attribute defaults and resolve each marker's arrowhead shape.
 *
 * Exported as a plain function, not only as a component getter, because a
 * marker has to be defined in the SAME shadow root as the paths that reference
 * it: an `url(#id)` reference does not cross a shadow boundary, so a `<defs>`
 * living in this component's own root would be invisible to the edge layer.
 * `c-flow-edge-renderer` therefore emits its own `<defs>` from these rows.
 *
 * Unknown marker types are dropped rather than rendered empty, and reported.
 * @param {Array<Object>} markers as produced by {@link createMarkerIds}
 * @param {(id: string, message: string) => void} [onError]
 * @returns {Array<Object>} template-ready marker rows
 */
export function resolveMarkers(markers, onError) {
  if (!Array.isArray(markers)) {
    return [];
  }

  return markers.reduce((resolved, marker) => {
    const shape = MARKER_SHAPES[marker.type];

    if (!shape) {
      const message = errorMessages.error009(marker.type);

      if (onError) {
        onError('009', message);
      } else {
        console.warn(message);
      }

      return resolved;
    }

    resolved.push({
      id: marker.id,
      markerWidth: `${marker.width === undefined ? DEFAULT_MARKER_WIDTH : marker.width}`,
      markerHeight: `${marker.height === undefined ? DEFAULT_MARKER_HEIGHT : marker.height}`,
      markerUnits: marker.markerUnits === undefined ? DEFAULT_MARKER_UNITS : marker.markerUnits,
      orient: marker.orient === undefined ? DEFAULT_ORIENT : marker.orient,
      shapeClass: shape.shapeClass,
      points: shape.points,
      filled: shape.filled,
      style: symbolStyle(marker, shape.filled),
    });

    return resolved;
  }, []);
}

/**
 * Standalone marker `<defs>` host.
 *
 * Only useful when the consumer's own SVG lives in this component's root. The
 * flow itself does not use it, for the shadow-boundary reason documented on
 * {@link resolveMarkers}.
 */
export default class FlowMarkers extends LightningElement {
  /** Marker props as produced by {@link createMarkerIds}. */
  @api markers;

  /** Markers with upstream's attribute defaults applied, unknown types dropped. */
  get resolvedMarkers() {
    return resolveMarkers(this.markers);
  }
}
