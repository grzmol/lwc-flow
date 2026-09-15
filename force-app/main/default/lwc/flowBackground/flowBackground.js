/**
 * The background pattern layer.
 *
 * Ports `@xyflow/react/src/additional-components/Background/` (`Background.tsx`, `Patterns.tsx`,
 * `types.ts`). The whole component is one `<svg>` holding a single `<pattern>` and a `<rect>`
 * filled with it: panning and zooming only move the pattern's origin and scale its tile, so the
 * browser repaints one rect instead of thousands of dots. The tile math is copied literally from
 * upstream, including the `|| 1` guard that keeps a zero-width tile from freezing the renderer.
 *
 * Deviations from upstream:
 * - Upstream reads `transform` and `rfId` from its store through `useStore`. Here the transform
 *   arrives through a store subscription set up in `connectedCallback`, and the pattern id needs
 *   no flow-level namespace: the `<svg>` lives in this component's shadow root, so two flows on
 *   one page cannot collide. `id` is still honoured for the several-backgrounds-per-flow case.
 * - Upstream composes the `url(#…)` fill from the same string it wrote as the pattern id. LWC
 *   rewrites every template `id` under synthetic shadow (`engine-core`'s `gid` appends the vm
 *   index) and does not rewrite `fill` alongside it, so the reference is read back from the
 *   rendered pattern in `renderedCallback` rather than composed.
 * - Template-visible state lives in ordinary fields, never in `#` private ones: only ordinary
 *   class properties are registered as reactive by the LWC compiler, so a `#` field written from
 *   a subscription would never reach the template.
 */

import { LightningElement, api } from 'lwc';
import { shallowArrayEqual } from 'c/flowStore';

/** Upstream `BackgroundVariant`. */
const VARIANTS = new Set(['dots', 'lines', 'cross']);
const DEFAULT_VARIANT = 'dots';

/** Upstream `defaultSize`: a dot is 1 unit across, a cross arm 6. */
const DEFAULT_SIZE = Object.freeze({ dots: 1, lines: 1, cross: 6 });

const DEFAULT_GAP = 20;
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_OFFSET = 0;

/** Base pattern id. Namespaced by the shadow root, suffixed by the `id` property. */
const PATTERN_ID = 'flow-background-pattern';

/** Read a `number | [number, number]` property as a pair, as upstream's `Array.isArray` branches. */
function toPair(value, fallback) {
  if (Array.isArray(value)) {
    return [Number(value[0]), Number(value[1])];
  }

  const single = value === undefined || value === null ? fallback : Number(value);

  return [single, single];
}

export default class FlowBackground extends LightningElement {
  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  /**
   * Disambiguates the pattern id when one flow renders several backgrounds, as upstream's `id`.
   * Declaring it public shadows `LightningElement`'s reflective `id`, so the value does not also
   * land on the host element as an attribute - which is right, this id is an SVG-internal ref.
   */
  @api id;

  /** Pattern colour. Falls back to the stylesheet's per-variant default. */
  @api color;

  /** Colour painted behind the pattern. */
  @api bgColor;

  /** Extra classes for the `<svg>`. */
  @api className;

  /** Extra classes for the pattern shape. */
  @api patternClassName;

  /** Reactive render state: the current viewport transform, `[x, y, zoom]`. */
  transformState = [0, 0, 1];

  _variant = DEFAULT_VARIANT;
  _gap = DEFAULT_GAP;
  _size;
  _offset = DEFAULT_OFFSET;
  _lineWidth = DEFAULT_LINE_WIDTH;

  /** Subscription handle and tile memo: the template never reads either directly. */
  #unsubscribe = null;
  #patternKey = '';
  #pattern = null;

  /** `dots`, `lines` or `cross`. */
  @api
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = VARIANTS.has(value) ? value : DEFAULT_VARIANT;
  }

  /** Tile spacing in flow units, one number or an `[x, y]` pair. */
  @api
  get gap() {
    return this._gap;
  }
  set gap(value) {
    this._gap = Array.isArray(value) ? [...value] : value;
  }

  /** Dot diameter or cross arm length in flow units. Defaults per variant. */
  @api
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
  }

  /** Pattern offset in flow units, one number or an `[x, y]` pair. */
  @api
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = Array.isArray(value) ? [...value] : value;
  }

  /** Stroke width of the lines and cross variants. */
  @api
  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(value) {
    this._lineWidth = value === undefined || value === null ? DEFAULT_LINE_WIDTH : value;
  }

  connectedCallback() {
    if (!this.store) {
      return;
    }

    this.#unsubscribe = this.store.subscribe(
      (s) => s.transform,
      (transform) => {
        this.transformState = transform;
      },
      { compare: shallowArrayEqual }
    );
  }

  disconnectedCallback() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }

  renderedCallback() {
    /*
     * The `<rect>` references the `<pattern>` by id, and LWC scopes template ids at runtime
     * under synthetic shadow. Reading the id back off the DOM is the only way to be sure the
     * reference resolves in both shadow modes.
     */
    const pattern = this.template.querySelector('pattern');
    const rect = this.template.querySelector('rect');

    if (!pattern || !rect) {
      return;
    }

    const reference = `url(#${pattern.getAttribute('id')})`;

    if (rect.getAttribute('fill') !== reference) {
      rect.setAttribute('fill', reference);
    }
  }

  get patternId() {
    return this.id ? `${PATTERN_ID}-${this.id}` : PATTERN_ID;
  }

  get svgClass() {
    return this.className ? `flow__background ${this.className}` : 'flow__background';
  }

  /**
   * Class on the shape element. Upstream hardcodes `dots` on the circle and uses the variant
   * name on the path, which for the dots variant is the same string either way.
   */
  get patternShapeClass() {
    const classes = ['flow__background-pattern', this._variant];

    if (this.patternClassName) {
      classes.push(this.patternClassName);
    }

    return classes.join(' ');
  }

  /**
   * Colour overrides, as upstream's inline custom properties on the `<svg>`. Custom properties
   * inherit, so the shape elements resolve them from the stylesheet's own per-variant rules.
   */
  get svgStyle() {
    const declarations = [];

    if (this.bgColor) {
      declarations.push(`--flow-background-color-props: ${this.bgColor};`);
    }

    if (this.color) {
      declarations.push(`--flow-background-pattern-color-props: ${this.color};`);
    }

    return declarations.join(' ');
  }

  get isDots() {
    return this._variant === 'dots';
  }

  /**
   * Tile geometry for the current transform.
   *
   * Memoised on its inputs: a getter that rebuilt this object on every access would hand the
   * template a fresh object each render and make it re-diff every attribute for nothing.
   */
  get pattern() {
    const [x, y, zoom] = this.transformState;
    const key = `${x}|${y}|${zoom}|${this._variant}|${this._gap}|${this._size}|${this._offset}|${this._lineWidth}`;

    if (key === this.#patternKey && this.#pattern !== null) {
      return this.#pattern;
    }

    const isCross = this._variant === 'cross';
    const patternSize = this._size || DEFAULT_SIZE[this._variant];
    const gapXY = toPair(this._gap, DEFAULT_GAP);
    // `|| 1` is upstream's guard: a zero-sized tile would tile forever.
    const scaledGap = [gapXY[0] * zoom || 1, gapXY[1] * zoom || 1];
    const scaledSize = patternSize * zoom;
    const offsetXY = toPair(this._offset, DEFAULT_OFFSET);

    // A cross tile is sized by the cross itself; dots and lines tile on the gap.
    const dimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
    const scaledOffset = [offsetXY[0] * zoom + dimensions[0] / 2, offsetXY[1] * zoom + dimensions[1] / 2];

    this.#patternKey = key;
    this.#pattern = {
      // The tile origin follows the viewport translate, wrapped into a single tile.
      x: x % scaledGap[0],
      y: y % scaledGap[1],
      width: scaledGap[0],
      height: scaledGap[1],
      transform: `translate(-${scaledOffset[0]},-${scaledOffset[1]})`,
      radius: scaledSize / 2,
      d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`,
      lineWidth: this._lineWidth,
    };

    return this.#pattern;
  }
}
