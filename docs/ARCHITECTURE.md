# lwc-flow architecture

A port of [xyflow](https://github.com/xyflow/xyflow) (`@xyflow/react` 12.11.6, `@xyflow/system`
0.0.82) to Salesforce Lightning Web Components.

The upstream monorepo already separates a framework-agnostic core (`@xyflow/system`) from its React
bindings (`@xyflow/react`). That split is the port's biggest asset: `system` is the behaviour to
reproduce, `react` is only one possible binding of it. This port replaces the React binding with an
LWC binding and reimplements the parts of `system` that depend on d3.

## Constraints that shape every decision

Conventions come from the `vibe-force` plugin (`~/Dokumenty/GitHub/vibe-force`), skills
`sf-lwc-development`, `sf-lwc-jest-testing`, `sf-project-structure`.

| Constraint                                                  | Source                             | Consequence here                                                |
| ----------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------- |
| No runtime npm dependencies                                 | vibe-force invariant               | d3 is reimplemented, not bundled                                |
| CDN `<script>` and inline `<script>` are blocked by CSP     | `sf-lwc-development` anti-patterns | Third-party JS would have to be a static resource; we ship none |
| API version pinned to `67.0`                                | `config/vibe-force.defaults.json`  | Every `*.js-meta.xml` carries `<apiVersion>67.0</apiVersion>`   |
| Every LWC bundle needs `__tests__`                          | gate `requireJestForLwc`           | One Jest suite per bundle, no exceptions                        |
| Jest coverage floor 80% lines/statements                    | gate `jestCoverageMin`             | Logic lives in plain modules that are cheap to cover            |
| Shadow DOM per component, no cross-boundary selectors       | `sf-lwc-development` pattern 9     | No single global stylesheet; CSS is per bundle                  |
| `key` in `for:each` must be a stable business id            | `sf-lwc-development` anti-patterns | Node/edge `id` is the key everywhere                            |
| No home-grown global pubsub                                 | `sf-lwc-development` anti-patterns | See "Store" below: instance-scoped, not global                  |
| `@api` properties are owned by the parent and never mutated | `sf-lwc-development` pattern 3     | Inbound `nodes`/`edges` are normalised on the way in            |

## Decision 1: reimplement d3, do not bundle it

`@xyflow/system` depends on `d3-zoom`, `d3-drag`, `d3-selection` and `d3-interpolate`
(`packages/system/package.json`). On the Salesforce platform there are two ways to get that code
into a component, and both are worse than rewriting it:

- **Static resource + `lightning/platformResourceLoader`.** Adds a deploy-time coupling between a
  component bundle and a `StaticResource`, makes `loadScript` an async precondition of first
  render, and runs d3's DOM and event handling inside the Lightning Web Security sandbox where
  `globalThis` and event objects are distorted.
- **CDN script tag.** Blocked outright by CSP.

So the port implements the gesture layer natively on pointer and wheel events. The surface that
actually has to be reproduced is narrow:

| d3 usage in xyflow                               | Native replacement                                                    |
| ------------------------------------------------ | --------------------------------------------------------------------- |
| `zoom()` transform state, `zoomIdentity`         | A plain `{x, y, zoom}` value object plus a compose/invert helper      |
| `.scaleExtent`, `.translateExtent`, `.constrain` | Explicit clamp functions applied on every transform write             |
| `.filter`                                        | One predicate over `PointerEvent` / `WheelEvent` / modifier-key state |
| `.wheelDelta`                                    | The wheel-delta formula, copied literally, over `deltaMode`           |
| `.transform` with a transition, `interpolate`    | `requestAnimationFrame` loop with the same duration and easing        |
| `drag()` start/drag/end, `.clickDistance`        | `pointerdown` + `setPointerCapture` + `pointermove` + `pointerup`     |

This is the single largest deviation from upstream and the main source of behavioural risk. It is
mitigated by making the kernels pure and testable: the transform math and the event predicate are
plain functions with no DOM dependency, unit-tested against the literal formulas extracted from
xyflow source.

## Decision 2: the store is instance-scoped, not a global pubsub

React Flow holds state in a Zustand store reached through React context
(`packages/react/src/components/ReactFlowProvider`). LWC has no context API. The options:

1. Thread every value through `@api` properties. Rejected: the viewport changes at pointer-move
   frequency, and the node list is read by a dozen descendants. Property threading would re-render
   the whole tree on every frame.
2. A module-level singleton store. Rejected: it is exactly the `pubsub.js` anti-pattern from
   `sf-lwc-development`, and it breaks the moment two flows appear on one Lightning page.
3. **Lightning Message Service.** Rejected: LMS is org-global, requires a `MessageChannel`
   metadata type, is asynchronous, and has no notion of "this flow instance".
4. **An instance-scoped store object, created by the root component and handed down as an `@api`
   property.** Chosen.

Option 4 is the LWC analogue of context: the root `c-flow` constructs one store, children receive
the same object reference via `@api store`, subscribe with a selector in `connectedCallback`, and
`unsubscribe` in `disconnectedCallback`. It is not a global: nothing is reachable without the
reference, two flows on a page are fully isolated, and the subscription lifecycle is explicit and
therefore leak-free. The anti-pattern the skill names is a _global_ module used for _cross-DOM-tree_
communication; this is neither.

The store itself is a plain module with no LWC import, which keeps it trivially unit-testable and
keeps it out of the component coverage problem.

## Decision 3: custom node types are components, custom edge types are functions

Nodes and edges cannot use the same extension mechanism, because SVG forces them apart.

### Nodes: `lwc:is`

A node is HTML, so a custom node is an LWC component instantiated dynamically:

```html
<lwc:component lwc:is="{nodeCtor}" data-id="{node.id}"></lwc:component>
```

`lwc:is` requires the `lightning__dynamicComponent` capability in `js-meta.xml`
(`sf-lwc-development/references/component-reference.md:66`). Consumers register a type by supplying
a constructor, obtained with a dynamic `import()`, in the `nodeTypes` map. Built-in types
(`default`, `input`, `output`, `group`) are resolved from the same map, pre-populated.
`lwc:spread` passes the whole `NodeProps` object through in one binding rather than enumerating
every field as an attribute.

**A custom node that renders handles must be light DOM.** Handles are measured with
`nodeElement.querySelectorAll('.source' | '.target')` (`c/flowDom.getHandleBounds`), and
`querySelectorAll` does not cross a shadow boundary. Every component between the
`div.flow__node` element and the handle marker therefore declares:

```js
static renderMode = 'light';
```

```html
<template lwc:render-mode="light"></template>
```

`c-flow-handle` and all four built-in node types do this. If a user-registered node type renders
`c-flow-handle` from inside a shadow root, `handleBounds` stays `null`, and every edge attached to
that node silently fails to find an endpoint and is skipped. This is the one real constraint the
port imposes on consumer code that upstream does not; it is enforced by measurement returning
`null` rather than by an error, so it is called out here and in `c-flow-handle`'s own comment.

Light DOM gives up style scoping for those components, which is why their CSS is written with
explicitly namespaced class names rather than relying on shadow encapsulation.

### Edges: a path-provider registry, not components

An edge is SVG, and two independent platform facts rule out an edge component:

1. **LWC decides the SVG namespace at compile time, per template.** A template whose root is `<g>`
   compiles to `parseFragment` and `api_element("g", {key: 0})` - the HTML-namespace creator. The
   same markup nested under an `<svg>` in the _same_ template compiles to `parseSVGFragment` and
   `{key: 0, svg: true}`. A component therefore cannot emit SVG unless it owns its own `<svg>`
   root, and an edge cannot: it has to share one `<svg>` with every other edge so they paint in a
   single coordinate space.
2. **A custom element never upgrades inside `<svg>`.** Custom element upgrade applies to
   HTML-namespace elements. An `<c-flow-bezier-edge>` placed inside `<svg>` stays an inert unknown
   element in every browser.

Verified against `@lwc/template-compiler` 8.28.2.

So `c-flow-edge-renderer` owns the single `<svg>` and paints every edge declaratively from its own
template, and an edge _type_ is a registered pair of functions rather than a component:

```js
// c/flowEdgeTypes
{ getPath(geometry) -> { path, labelX, labelY, offsetX, offsetY }, defaults }
```

`getPath` returns an object rather than upstream's `[path, labelX, labelY, ...]` tuple because LWC
template expressions support only dot access and cannot index an array.

Edge _labels_ keep full component freedom: they render in a separate absolutely positioned HTML
layer above the SVG, which is also how upstream's `EdgeLabelRenderer` works, so a label may be
arbitrary markup even though the edge path cannot.

## Decision 4: rendering topology keeps panning off the re-render path

The transform lives on exactly one element. Panning and zooming mutate that element's
`style.transform` only; nodes and edges are untouched and do not re-render.

```
c-flow                        root, owns the store, sizes itself
└── c-flow-renderer           pane: pointer targets, marquee, keyboard
    ├── c-flow-background     SVG pattern, reads viewport
    ├── div.viewport          <-- the ONLY transformed element
    │   ├── c-flow-edge-renderer   one <svg>, edges as <g>, markers in <defs>
    │   ├── c-flow-node-renderer   absolutely positioned nodes
    │   │   └── c-flow-node-wrapper (per node)
    │   │       ├── <lwc:component lwc:is={ctor}>  the user's node
    │   │       └── c-flow-handle (per handle)
    │   └── c-flow-connection-line  in-flight connection
    ├── c-flow-minimap
    ├── c-flow-controls
    └── c-flow-panel          slotted overlays
```

Consequences of shadow DOM that differ from upstream:

- Upstream styles nodes and edges from one global sheet. Here each bundle carries its own CSS, and
  theming crosses boundaries only through CSS custom properties on `:host`.
- Handle measurement reads `getBoundingClientRect()`, which works across shadow boundaries, so
  `handleBounds` is computed the same way as upstream.
- A parent must never reach into a child's shadow root. Node measurement is therefore reported
  _upward_ by the node wrapper into the store, rather than read _downward_ by the renderer.

## Decision 5: the change model is preserved exactly

`onNodesChange` / `onEdgesChange` with `applyNodeChanges` / `applyEdgeChanges` is the contract that
makes xyflow controllable, and it ports without modification because it is pure data. The port keeps
the same change variants (`position`, `dimensions`, `select`, `remove`, `add`, `replace`) and the
same reducer semantics, exposed as plain module functions.

Events reaching the consumer are LWC `CustomEvent`s with `bubbles: false, composed: false` and
primitives-or-plain-data in `detail`, per `sf-lwc-development` pattern 6.

## Module layout

Plain logic modules are LWC service components (a `.js` plus a `.js-meta.xml`, no template), which
is how shared JavaScript is packaged on the platform. They contain no DOM code and carry the bulk of
the test coverage.

Every bundle below is implemented, unit-tested, and lint- and format-clean.

| Bundle                                                                   | Kind      | Contents                                                                       | Status |
| ------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------ | ------ |
| `flowTypes`                                                              | service   | Enums (`Position`, `MarkerType`, ...), constants, `errorMessages`, typedefs    | done   |
| `flowMath`                                                               | service   | Rect/point math, bounds, culling, coordinate transforms, handle positions      | done   |
| `flowEdgePaths`                                                          | service   | `getBezierPath`, `getSmoothStepPath`, `getStraightPath`, `getSimpleBezierPath` | done   |
| `flowGraph`                                                              | service   | `adoptUserNodes`, lookups, connection maps, change reducers, `addEdge`         | done   |
| `flowTransform`                                                          | service   | `Transform`, `constrain`, zoom interpolation, easing - replaces d3-zoom math   | done   |
| `flowStore`                                                              | service   | Instance store: state, selector subscriptions, graph and viewport actions      | done   |
| `flowDom`                                                                | service   | DOM measurement and event-position readers, shadow-DOM aware                   | done   |
| `flowPanZoom`                                                            | service   | Pan/zoom gesture controller on Pointer Events, plus the event filter           | done   |
| `flowDrag`                                                               | service   | Node drag kernel: offsets, snapping, extent clamping, auto-pan                 | done   |
| `flowConnect`                                                            | service   | Handle hit-testing across shadow roots, connection validity                    | done   |
| `flowEdgeTypes`                                                          | service   | Edge-type registry: type name to path provider                                 | done   |
| `flowMarkers`                                                            | component | Marker `<defs>`; owns its own `<svg>` root                                     | done   |
| `flow`                                                                   | component | Root; public props and the public instance API                                 | done   |
| `flowRenderer`                                                           | component | Pane, marquee selection, global keyboard                                       | done   |
| `flowNodeRenderer` / `flowNodeWrapper`                                   | component | Node layer                                                                     | done   |
| `flowEdgeRenderer`                                                       | component | Owns the single `<svg>`; paints every edge and the connection line             | done   |
| `flowEdgeLabels`                                                         | component | HTML label layer above the SVG                                                 | done   |
| `flowHandle`                                                             | component | Handles                                                                        | done   |
| `flowBackground` / `flowControls` / `flowMinimap` / `flowPanel`          | component | Addons                                                                         | done   |
| `flowNodeResizer` / `flowNodeToolbar`                                    | component | Node addons                                                                    | done   |
| `flowDefaultNode` / `flowInputNode` / `flowOutputNode` / `flowGroupNode` | component | Built-in node types                                                            | done   |

## Platform constraints discovered while porting

Each of these cost real debugging time and is enforced by nothing but a silent failure, so they are
recorded with their evidence. Versions: `@lwc/compiler` 8.28.2, `@lwc/template-compiler` 8.28.2.

| Constraint                                                                                                                                                                                                                                                        | Evidence                                                                   | Consequence here                                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Private methods do not compile.** `#method() {}` throws `LWC1007`; only `plugin-transform-class-properties` is enabled, not `plugin-transform-private-methods`. Private _fields_ are fine.                                                                      | The bundle fails to import in Jest and would fail to deploy                | Every internal method is `_name()`. Six bundles were affected                                                                                |
| **Private fields are never reactive.** The reactive field list is built from `classBodyItems.filter(f => f.isClassProperty(...)).map(f => f.node.key.name)`; a `#field` parses as `ClassPrivateProperty`, so it is filtered out, and `PrivateName` has no `.name` | `@lwc/babel-plugin-component/dist/index.cjs.js:1071-1074`                  | Anything the template reads is an ordinary `_field`; `#` is reserved for subscriptions, gesture bookkeeping and caches                       |
| **SVG namespace is fixed per template.** A `<g>`-rooted template compiles to `parseFragment` and `api_element("g", {key:0})`; the same markup under an `<svg>` compiles to `parseSVGFragment` and `{key:0, svg:true}`                                             | Compiled both shapes and compared output                                   | Edges cannot be components. See decision 3                                                                                                   |
| **`url(#id)` references break under synthetic shadow.** LWC rewrites every `id` to a scoped value but rewrites no SVG reference attribute: `ID_REFERENCING_ATTRIBUTES_SET` is the ARIA idrefs plus `for` and `popovertarget`                                      | `@lwc/shared/dist/index.cjs.js:438-449`                                    | `c-flow-edge-renderer` sets `marker-start` / `marker-end` in `renderedCallback` from the marker's _rendered_ id, never as a template binding |
| **Public properties may not begin with `on`.** `LWC1108` reserves them for event handlers                                                                                                                                                                         | Compile failure                                                            | `onlyRenderVisibleElements` became `renderVisibleOnly`; `onBeforeDelete` became `beforeDelete`. Store field names keep the upstream spelling |
| **A public boolean may not default to `true`.** `LWC1099`, because attribute presence is what makes a boolean true. The check only rejects a `BooleanLiteral` initializer                                                                                         | `isBooleanPropDefaultTrue` in `@lwc/babel-plugin-component`                | Every default-`true` flag is a getter/setter pair over a `_field`, which keeps the upstream name and default                                 |
| **`querySelectorAll` does not cross a shadow boundary.** Handle measurement depends on it                                                                                                                                                                         | `getHandleBounds` returns `null`, so edges silently lose their endpoints   | `c-flow-handle` and the built-in node types are light DOM, and so must any custom node that renders handles                                  |
| **Prettier destroys LWC templates.** `@prettier/plugin-xml` claims `.html` and, because XML requires quoted attribute values, rewrites `class={foo}` into `class="{foo}"`, which the compiler rejects with `LWC1034`                                              | 193 expressions across 13 templates were rewritten on the first format run | `.prettierignore` excludes `force-app/main/default/lwc/**/*.html`                                                                            |
| **jsdom lacks `PointerEvent` and `ResizeObserver`.**                                                                                                                                                                                                              | Both are guarded at runtime                                                | Tests synthesise pointer events from `MouseEvent` plus a defined `pointerId`                                                                 |

## Verification strategy

Component behaviour is covered by Jest. The four pure kernels are held to a stronger standard:
they are executed side by side with the upstream TypeScript, and `flowTransform` against real d3,
over generated inputs, asserting identical output.

| Oracle          | Compared against                                | Cases   | Result                     |
| --------------- | ----------------------------------------------- | ------- | -------------------------- |
| `flowEdgePaths` | `@xyflow/system` edge generators                | 41,920  | Byte-identical `d` strings |
| `flowMath`      | `@xyflow/system` `general.ts`, `graph.ts`       | 162,600 | Identical                  |
| `flowGraph`     | `@xyflow/system` `store.ts`, React `changes.ts` | 56,000  | Identical                  |
| `flowTransform` | `d3-zoom`, `d3-interpolate`, `d3-ease` sources  | 602,002 | Numerically identical      |

Total 862,522 differential comparisons. The harness lives outside the repository because it needs
the upstream sources; it is reproducible from `docs/ARCHITECTURE.md` and the upstream clone.

## Deliberate scope exclusions

| Upstream feature                         | Status               | Reason                                               |
| ---------------------------------------- | -------------------- | ---------------------------------------------------- |
| SSR / hydration                          | Out                  | No platform analogue                                 |
| `ReactFlowProvider` as a separate export | Folded into `c-flow` | LWC has no context to provide                        |
| Svelte bindings                          | Out                  | Different framework                                  |
| `@xyflow/system` published as a package  | Out                  | Ships as service components in one package directory |
