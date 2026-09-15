import {
  getDimensions,
  getHostForElement,
  isInputDOMNode,
  getEventPosition,
  getPointerPosition,
  getHandleBounds,
  hasSelector,
  getViewportZoom,
} from 'c/flowDom';

/** jsdom never lays anything out, so the offset size has to be declared. */
function sized(element, width, height) {
  Object.defineProperty(element, 'offsetWidth', { value: width, configurable: true });
  Object.defineProperty(element, 'offsetHeight', { value: height, configurable: true });

  return element;
}

/** A key event carrying the composed path the shadow-aware check reads. */
function keyEvent(path) {
  return { target: path[0], composedPath: () => path };
}

afterEach(() => {
  // The skill's prescribed reset; innerHTML is blocked by @lwc/lwc/no-inner-html.
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

describe('c-flow-dom getDimensions', () => {
  it('reads the offset size', () => {
    const element = sized(document.createElement('div'), 120, 40);

    expect(getDimensions(element)).toEqual({ width: 120, height: 40 });
  });

  it('reports zero for an unlaid-out element', () => {
    expect(getDimensions(document.createElement('div'))).toEqual({ width: 0, height: 0 });
  });
});

describe('c-flow-dom getHostForElement', () => {
  it('returns the root node of an attached element', () => {
    const element = document.createElement('div');

    document.body.appendChild(element);

    expect(getHostForElement(element)).toBe(document);
  });

  it('returns the shadow root for an element inside one', () => {
    const host = document.createElement('div');

    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });
    const inner = document.createElement('div');

    shadow.appendChild(inner);

    expect(getHostForElement(inner)).toBe(shadow);
  });

  it('falls back to the document for a nullish or rootless target', () => {
    expect(getHostForElement(null)).toBe(document);
    expect(getHostForElement({})).toBe(document);
  });
});

describe('c-flow-dom isInputDOMNode', () => {
  it('is true for the form elements that own their own key handling', () => {
    for (const tag of ['input', 'select', 'textarea']) {
      expect(isInputDOMNode(keyEvent([document.createElement(tag), document.body, document]))).toBe(true);
    }
  });

  it('is true for a contenteditable element', () => {
    const editable = document.createElement('div');

    editable.setAttribute('contenteditable', 'true');

    expect(isInputDOMNode(keyEvent([editable, document.body, document]))).toBe(true);
  });

  it('is false for a plain div', () => {
    expect(isInputDOMNode(keyEvent([document.createElement('div'), document.body, document]))).toBe(false);
  });

  it('is true for anything inside a nokey subtree on the composed path', () => {
    const optedOut = document.createElement('div');
    const target = document.createElement('div');

    optedOut.className = 'nokey';

    expect(isInputDOMNode(keyEvent([target, optedOut, document.body, document]))).toBe(true);
  });

  it('stops walking the composed path at the document', () => {
    const optedOut = document.createElement('div');
    const target = document.createElement('div');

    optedOut.className = 'nokey';

    // `nokey` sits past the document in the path, so the walk must not reach it.
    expect(isInputDOMNode(keyEvent([target, document, optedOut]))).toBe(false);
  });

  it('falls back to a closest lookup when the composed path is empty', () => {
    const optedOut = document.createElement('div');
    const target = document.createElement('div');

    optedOut.className = 'nokey';
    optedOut.appendChild(target);
    document.body.appendChild(optedOut);

    expect(isInputDOMNode({ target, composedPath: () => [] })).toBe(true);
  });

  it('is false for an event without a composed path or an element target', () => {
    expect(isInputDOMNode({ target: document.createElement('div') })).toBe(false);
    expect(isInputDOMNode(keyEvent([window]))).toBe(false);
    expect(isInputDOMNode({ target: undefined, composedPath: () => [] })).toBe(false);
  });

  it('is false for a text node target', () => {
    const text = document.createTextNode('typed');

    expect(isInputDOMNode({ target: text, composedPath: () => [text] })).toBe(false);
  });
});

describe('c-flow-dom getEventPosition', () => {
  it('reads a mouse-like event in client coordinates', () => {
    expect(getEventPosition({ clientX: 120, clientY: 80 })).toEqual({ x: 120, y: 80 });
  });

  it('subtracts the bounds origin', () => {
    expect(getEventPosition({ clientX: 120, clientY: 80 }, { left: 20, top: 5 })).toEqual({ x: 100, y: 75 });
  });

  it('reads the first touch of a touch-like event', () => {
    const touch = {
      touches: [
        { clientX: 30, clientY: 40 },
        { clientX: 300, clientY: 400 },
      ],
    };

    expect(getEventPosition(touch)).toEqual({ x: 30, y: 40 });
    expect(getEventPosition(touch, { left: 10, top: 10 })).toEqual({ x: 20, y: 30 });
  });

  it('prefers the touch list when clientX is present but undefined', () => {
    const event = { clientX: undefined, clientY: undefined, touches: [{ clientX: 7, clientY: 9 }] };

    expect(getEventPosition(event)).toEqual({ x: 7, y: 9 });
  });
});

describe('c-flow-dom getPointerPosition', () => {
  const event = { clientX: 110, clientY: 213 };

  it('converts to flow coordinates through the transform and container origin', () => {
    const position = getPointerPosition(event, {
      transform: [10, 20, 2],
      containerBounds: { left: 5, top: 7 },
    });

    // (110 - 5 - 10) / 2 and (213 - 7 - 20) / 2
    expect(position.x).toBeCloseTo(47.5, 10);
    expect(position.y).toBeCloseTo(93, 10);
  });

  it('returns the unsnapped value as the snapped one when snapping is off', () => {
    const position = getPointerPosition(event, {
      transform: [10, 20, 2],
      containerBounds: { left: 5, top: 7 },
      snapGrid: [15, 15],
    });

    expect(position.xSnapped).toBe(position.x);
    expect(position.ySnapped).toBe(position.y);
  });

  it('returns both the snapped and the unsnapped value when snapping is on', () => {
    const position = getPointerPosition(event, {
      transform: [10, 20, 2],
      containerBounds: { left: 5, top: 7 },
      snapToGrid: true,
      snapGrid: [15, 15],
    });

    expect(position.x).toBeCloseTo(47.5, 10);
    expect(position.y).toBeCloseTo(93, 10);
    expect(position.xSnapped).toBe(45);
    expect(position.ySnapped).toBe(90);
  });

  it('treats a missing container as an origin of zero', () => {
    const position = getPointerPosition(event, { transform: [0, 0, 1], containerBounds: null });

    expect(position).toEqual({ x: 110, y: 213, xSnapped: 110, ySnapped: 213 });
  });
});

describe('c-flow-dom getHandleBounds', () => {
  /** A handle element measured at `left`/`top` in client coordinates. */
  function handleElement(type, { handleId, handlePos, left, top, size = 8 }) {
    const element = sized(document.createElement('div'), size, size);

    element.classList.add('flow__handle', type);

    if (handleId !== undefined) {
      element.setAttribute('data-handleid', handleId);
    }
    element.setAttribute('data-handlepos', handlePos);
    element.getBoundingClientRect = () => ({ left, top, width: size, height: size });

    return element;
  }

  it('returns null when the node has no handles of that type', () => {
    const node = document.createElement('div');

    node.appendChild(handleElement('target', { handleId: 't1', handlePos: 'left', left: 0, top: 0 }));

    expect(getHandleBounds('source', node, { left: 0, top: 0 }, 1, 'n1')).toBeNull();
  });

  it('returns null for a node with no handles at all', () => {
    expect(getHandleBounds('source', document.createElement('div'), { left: 0, top: 0 }, 1, 'n1')).toBeNull();
  });

  it('reports a handle relative to the node and divided by the zoom', () => {
    const node = document.createElement('div');

    node.appendChild(handleElement('source', { handleId: 's1', handlePos: 'right', left: 120, top: 40 }));

    const [handle] = getHandleBounds('source', node, { left: 100, top: 20 }, 2, 'n1');

    expect(handle).toEqual({
      id: 's1',
      type: 'source',
      nodeId: 'n1',
      position: 'right',
      x: 10,
      y: 10,
      width: 8,
      height: 8,
    });
  });

  it('reports one entry per matching handle, in document order', () => {
    const node = document.createElement('div');

    node.appendChild(handleElement('source', { handleId: 'a', handlePos: 'right', left: 50, top: 50 }));
    node.appendChild(handleElement('source', { handleId: 'b', handlePos: 'bottom', left: 70, top: 90 }));
    node.appendChild(handleElement('target', { handleId: 'c', handlePos: 'left', left: 0, top: 0 }));

    const handles = getHandleBounds('source', node, { left: 50, top: 50 }, 1, 'n1');

    expect(handles.map((handle) => handle.id)).toEqual(['a', 'b']);
    expect(handles[0]).toMatchObject({ x: 0, y: 0 });
    expect(handles[1]).toMatchObject({ x: 20, y: 40, position: 'bottom' });
  });

  it('reports a null id for a handle without one', () => {
    const node = document.createElement('div');

    node.appendChild(handleElement('target', { handlePos: 'left', left: 0, top: 0 }));

    const [handle] = getHandleBounds('target', node, { left: 0, top: 0 }, 1, 'n1');

    expect(handle.id).toBeNull();
    expect(handle.type).toBe('target');
  });

  it('scales negative offsets too', () => {
    const node = document.createElement('div');

    node.appendChild(handleElement('target', { handleId: 't1', handlePos: 'left', left: 96, top: 120 }));

    const [handle] = getHandleBounds('target', node, { left: 100, top: 100 }, 0.5, 'n1');

    expect(handle.x).toBe(-8);
    expect(handle.y).toBe(40);
  });
});

describe('c-flow-dom hasSelector', () => {
  /** `outer.nodrag > pane > child`, with `pane` acting as the search boundary. */
  function tree() {
    const outer = document.createElement('div');
    const pane = document.createElement('div');
    const child = document.createElement('div');

    outer.className = 'nodrag';
    document.body.appendChild(outer);
    outer.appendChild(pane);
    pane.appendChild(child);

    return { outer, pane, child };
  }

  it('matches the target itself', () => {
    const target = document.createElement('div');

    target.className = 'nodrag';

    expect(hasSelector(target, '.nodrag', document.body)).toBe(true);
  });

  it('matches an ancestor by walking parentElement', () => {
    const pane = document.createElement('div');
    const marked = document.createElement('div');
    const child = document.createElement('div');

    marked.className = 'nodrag';
    document.body.appendChild(pane);
    pane.appendChild(marked);
    marked.appendChild(child);

    expect(hasSelector(child, '.nodrag', pane)).toBe(true);
  });

  it('stops at the boundary element', () => {
    const { pane, child } = tree();

    // `.nodrag` is outside the boundary, so it must not be found.
    expect(hasSelector(child, '.nodrag', pane)).toBe(false);
  });

  it('returns false when nothing matches up to the document', () => {
    const child = document.createElement('div');

    document.body.appendChild(child);

    expect(hasSelector(child, '.nodrag', document.body)).toBe(false);
  });

  it('matches through the composed path first', () => {
    const { pane, child } = tree();

    child.className = 'nodrag';

    expect(hasSelector(child, '.nodrag', pane, { composedPath: () => [child, pane] })).toBe(true);
  });

  it('stops the composed path walk at the boundary element', () => {
    const { outer, pane, child } = tree();

    expect(hasSelector(child, '.nodrag', pane, { composedPath: () => [child, pane, outer] })).toBe(false);
  });

  it('stops the composed path walk at the document', () => {
    const { outer, pane, child } = tree();

    expect(hasSelector(child, '.nodrag', pane, { composedPath: () => [child, document, outer] })).toBe(false);
  });

  it('falls back to the parent walk for an event without a composed path', () => {
    const pane = document.createElement('div');
    const marked = document.createElement('div');
    const child = document.createElement('div');

    marked.className = 'nodrag';
    document.body.appendChild(pane);
    pane.appendChild(marked);
    marked.appendChild(child);

    expect(hasSelector(child, '.nodrag', pane, {})).toBe(true);
  });

  it('tolerates a nullish target and non-element path entries', () => {
    expect(hasSelector(null, '.nodrag', document.body)).toBe(false);
    expect(hasSelector(null, '.nodrag', document.body, { composedPath: () => [window] })).toBe(false);
  });
});

describe('c-flow-dom getViewportZoom', () => {
  const original = window.DOMMatrixReadOnly;

  afterEach(() => {
    if (original === undefined) {
      delete window.DOMMatrixReadOnly;
    } else {
      window.DOMMatrixReadOnly = original;
    }
  });

  /** Minimal DOMMatrixReadOnly stand-in: jsdom does not ship one. */
  function installMatrix(parse) {
    window.DOMMatrixReadOnly = class {
      constructor(transform) {
        this.m22 = parse(transform);
      }
    };
  }

  function stubTransform(transform) {
    jest.spyOn(window, 'getComputedStyle').mockReturnValue({ transform });
  }

  it('returns 1 without an element', () => {
    expect(getViewportZoom(null)).toBe(1);
    expect(getViewportZoom(undefined)).toBe(1);
  });

  it('returns 1 when the platform has no DOMMatrixReadOnly', () => {
    delete window.DOMMatrixReadOnly;
    stubTransform('matrix(3, 0, 0, 3, 0, 0)');

    expect(getViewportZoom(document.createElement('div'))).toBe(1);
  });

  it('reads m22 from the computed transform', () => {
    installMatrix((transform) => Number(transform.split(',')[3]));
    stubTransform('matrix(3, 0, 0, 3, 0, 0)');

    expect(getViewportZoom(document.createElement('div'))).toBe(3);
  });

  it('falls back to 1 for a zero scale', () => {
    installMatrix(() => 0);
    stubTransform('none');

    expect(getViewportZoom(document.createElement('div'))).toBe(1);
  });

  it('falls back to 1 when the transform cannot be parsed', () => {
    installMatrix(() => {
      throw new SyntaxError('unparseable');
    });
    stubTransform('not-a-transform');

    expect(getViewportZoom(document.createElement('div'))).toBe(1);
  });

  it('reads the real computed style when jsdom supplies a matrix', () => {
    installMatrix((transform) => {
      const match = /matrix\(([^)]*)\)/.exec(transform);

      return match ? Number(match[1].split(',')[3]) : 1;
    });

    const element = document.createElement('div');

    element.style.transform = 'matrix(1, 0, 0, 1.5, 0, 0)';
    document.body.appendChild(element);

    expect(getViewportZoom(element)).toBe(1.5);
  });
});
