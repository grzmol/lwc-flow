# lwc-flow

A node-based flow editor for Salesforce Lightning Web Components. A port of
[xyflow](https://github.com/xyflow/xyflow) (`@xyflow/react` 12.11.6, `@xyflow/system` 0.0.82) with
**no runtime dependencies** - no d3, no npm packages, no CDN scripts.

```html
<c-flow
  nodes="{nodes}"
  edges="{edges}"
  fit-view
  show-background
  show-controls
  onnodeschange="{handleNodesChange}"
  onedgeschange="{handleEdgesChange}"
  onconnect="{handleConnect}"
>
</c-flow>
```

```js
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'c/flowGraph';

nodes = [
  { id: '1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: '2', position: { x: 160, y: 120 }, data: { label: 'Middle' } },
  { id: '3', type: 'output', position: { x: 320, y: 240 }, data: { label: 'End' } }
];
edges = [{ id: 'e1-2', source: '1', target: '2', markerEnd: { type: 'arrowclosed' } }];

handleNodesChange(event) {
  this.nodes = applyNodeChanges(event.detail.changes, this.nodes);
}
handleEdgesChange(event) {
  this.edges = applyEdgeChanges(event.detail.changes, this.edges);
}
handleConnect(event) {
  this.edges = addEdge(event.detail, this.edges);
}
```

The flow is **controlled**, exactly like upstream: it never owns your graph. Every interaction
leaves as a change array that you fold back in, which is what makes undo, validation and server
persistence possible without the flow knowing about any of them.

## What works

| Capability    | Notes                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------- |
| Pan and zoom  | Wheel, pinch, drag, double-click, pan-on-scroll, activation keys, `translateExtent` clamping       |
| Node dragging | Multi-select drag, grid snapping, `extent: 'parent'`, auto-pan at the pane edge, drag handles      |
| Connections   | Magnetic handle snapping within `connectionRadius`, strict and loose modes, live validity feedback |
| Edges         | Bezier, simple bezier, straight, step, smooth-step, plus custom path providers                     |
| Markers       | `arrow` and `arrowclosed`, deduplicated per flow                                                   |
| Selection     | Click, shift-marquee, `Full` and `Partial` modes, keyboard                                         |
| Sub-flows     | `parentId`, parent-relative extents, z-index banding                                               |
| Viewport API  | `fitViewport`, `setCenter`, `fitBounds`, `zoomTo`, `screenToFlowPosition`, and the rest            |
| Addons        | Background (dots, lines, cross), Controls, MiniMap, Panel                                          |
| Culling       | `render-visible-only` skips off-screen nodes and edges                                             |
| Accessibility | Focusable nodes and edges, arrow-key movement, overridable ARIA labels                             |

## Install

```bash
npm install
sf project deploy start --source-dir force-app --target-org my-org
```

Requires API version 67.0 or later. `c-flow` is exposed to App, Record, Home and Tab pages with
Lightning App Builder properties for the common options.

## Custom node types

A custom node is an LWC component, registered by constructor:

```js
import MyNode from 'c/myNode';

nodeTypes = { custom: MyNode };
```

**A custom node that renders handles must be light DOM.** Handle measurement uses
`querySelectorAll`, which does not cross a shadow boundary:

```js
export default class MyNode extends LightningElement {
  static renderMode = 'light';
}
```

```html
<template lwc:render-mode="light">
  <div class="my-node">{data.label}</div>
  <c-flow-handle
    store="{store}"
    node-id="{id}"
    flow-id="{flowId}"
    type="target"
    position="top"
  ></c-flow-handle>
  <c-flow-handle
    store="{store}"
    node-id="{id}"
    flow-id="{flowId}"
    type="source"
    position="bottom"
  ></c-flow-handle>
</template>
```

Omit it and `handleBounds` stays `null`, so every edge attached to that node silently fails to find
an endpoint.

## Custom edge types

An edge type is a path provider, **not** a component - LWC fixes the SVG namespace per template and
a custom element never upgrades inside `<svg>`, so all edges are painted by one renderer:

```js
edgeTypes = {
  wavy: {
    getPath: ({ sourceX, sourceY, targetX, targetY }) => ({
      path: `M${sourceX},${sourceY} Q${(sourceX + targetX) / 2},${sourceY - 60} ${targetX},${targetY}`,
      labelX: (sourceX + targetX) / 2,
      labelY: (sourceY + targetY) / 2,
      offsetX: 0,
      offsetY: 0,
    }),
    defaults: {},
  },
};
```

## Deviations from upstream

Each is forced by the platform, not a shortcut. `docs/ARCHITECTURE.md` has the evidence.

| Upstream                    | Here                               | Why                                                                                      |
| --------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------- |
| d3-zoom, d3-drag            | Native Pointer Event kernels       | CSP blocks CDN scripts; no runtime deps. The maths is a verified-identical port          |
| React context               | Store passed down as `@api store`  | LWC has no context; a module singleton would break two flows on one page                 |
| Edge components             | Edge-type path providers           | LWC decides the SVG namespace per template; custom elements never upgrade inside `<svg>` |
| `onlyRenderVisibleElements` | `render-visible-only`              | LWC reserves public properties beginning with `on` (LWC1108)                             |
| `onBeforeDelete`            | `before-delete`                    | Same                                                                                     |
| `<Background />` as a child | `show-background` flag             | A slot cannot pass the store to consumer-owned content                                   |
| One global stylesheet       | Per-bundle CSS + custom properties | Shadow DOM; theme through the properties on `c-flow`                                     |

## Theming

Set custom properties on `c-flow`. They default through SLDS global hooks, so a flow inherits the
org theme:

```css
c-flow {
  --flow-node-background: #fff;
  --flow-edge-stroke: #b1b1b7;
  --flow-handle-background: #1a192b;
}
```

## Development

```bash
npm test                      # 813 tests across 23 suites
npm run test:unit:coverage
npm run lint
npm run format:verify
```

Correctness is held by differential testing rather than by eyeballing: the geometry, graph and
transform kernels are executed side by side with the upstream TypeScript (and with real d3) over
**862,522 generated cases**, asserting identical output. See `docs/ARCHITECTURE.md`.

## Licence

MIT. Ported from xyflow, also MIT.
