/**
 * A connection point on a node.
 *
 * Ports `@xyflow/react/src/components/Handle/index.tsx`.
 *
 * ## Why this component renders in light DOM
 *
 * `c/flowDom.getHandleBounds` measures a node's handles with
 * `nodeElement.querySelectorAll('.source')` / `'.target'`. `querySelectorAll` never crosses a
 * shadow boundary, so a handle that kept its marker element inside its own shadow root would be
 * invisible to that query: `handleBounds` would stay `null`, every edge would fail to locate its
 * endpoint, and nothing would ever be drawn. Light DOM puts the marker element directly into the
 * node's root, where the measurement can reach it.
 *
 * The trade-off, which `sf-lwc-development` pattern 9 requires to be stated: light DOM gives up
 * style scoping. This bundle's stylesheet is injected into whichever root the handle lands in
 * rather than into a private one, so every selector in `flowHandle.css` is anchored on the
 * `flow__handle` class to keep its reach to this component's own markup. Theming still crosses
 * boundaries the normal way, through inherited CSS custom properties.
 *
 * The same reasoning forces the built-in node components (`c/flowDefaultNode` and friends) into
 * light DOM: they sit between the node wrapper's root element and this handle, and a shadow root
 * anywhere on that path would hide the marker again.
 *
 * ## Deviations from upstream
 *
 * - Upstream reaches the store directly and runs the whole connection gesture from
 *   `XYHandle.onPointerDown`. Here the node renderer owns the gesture, so a press only reports
 *   `connectstart` upward and the handle stays a passive marker.
 * - Upstream's `connectOnClick` click-to-connect path is not part of this bundle.
 */

import { LightningElement, api } from 'lwc';
import { Position, ConnectionMode, errorMessages, interactionClass } from 'c/flowTypes';
import { HANDLE_CLASS } from 'c/flowConnect';

export default class FlowHandle extends LightningElement {
  /** See the class comment: measurement across shadow roots forces light DOM. */
  static renderMode = 'light';

  /** @type {import('c/flowStore').FlowStore} */
  @api store;

  /** Id of the node this handle belongs to. */
  @api nodeId;

  /** Id of the owning flow, used to build the globally unique `data-id`. */
  @api flowId;

  /** Consumer override for connection validity, forwarded to the gesture owner. */
  @api isValidConnection;

  _type = 'source';
  _position;
  _handleId = null;
  _isConnectable = true;
  _isConnectableStart = true;
  _isConnectableEnd = true;

  /**
   * Latest `connection` slice of the store; drives the connecting classes.
   *
   * An ordinary field, not a `#` one: the LWC babel plugin builds its reactive-field list from
   * `ClassProperty` nodes only, so a `#field` is never reactive and a template that reads it -
   * here through the `handleClass` getter - would never re-render.
   */
  _connection;

  /** Subscription handle. Never read by the template, so it may stay private. */
  #unsubscribe;

  /** Class-list cache; read only during render, keyed on everything that feeds the list. */
  _classKey;
  _className = '';

  /** `'source'` or `'target'`. Anything else is normalised to `'source'`, as upstream does. */
  @api
  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value === 'target' ? 'target' : 'source';
  }

  /**
   * Side of the node the handle sits on. Upstream defaults every handle to `Position.Top`; the
   * built-in nodes then pass `Bottom` for sources, so the useful default here is per type.
   */
  @api
  get position() {
    if (this._position) {
      return this._position;
    }

    return this._type === 'target' ? Position.Top : Position.Bottom;
  }

  set position(value) {
    this._position = value || undefined;
  }

  /** Handle id, or `null` for a node's unnamed handle. */
  @api
  get handleId() {
    return this._handleId;
  }

  set handleId(value) {
    this._handleId = value ?? null;
  }

  @api
  get isConnectable() {
    return this._isConnectable;
  }

  set isConnectable(value) {
    this._isConnectable = value === undefined || value === null ? true : !!value;
  }

  @api
  get isConnectableStart() {
    return this._isConnectableStart;
  }

  set isConnectableStart(value) {
    this._isConnectableStart = value === undefined || value === null ? true : !!value;
  }

  @api
  get isConnectableEnd() {
    return this._isConnectableEnd;
  }

  set isConnectableEnd(value) {
    this._isConnectableEnd = value === undefined || value === null ? true : !!value;
  }

  connectedCallback() {
    if (!this.nodeId) {
      // Upstream reports this through the flow's `onError`; there is no node id to report to.
      console.warn(errorMessages.error010());
    }

    this.#unsubscribe = this.store?.subscribe(
      (state) => state.connection,
      (connection) => {
        this._connection = connection;
      }
    );
  }

  disconnectedCallback() {
    this.#unsubscribe?.();
    this.#unsubscribe = undefined;
  }

  /**
   * Globally unique handle id. `c/flowConnect.isValidHandle` looks a handle's DOM element up by
   * exactly this string, so the `null` that a template literal produces for an unnamed handle is
   * part of the contract, not an accident.
   */
  get handleDomId() {
    return `${this.flowId}-${this.nodeId}-${this._handleId}-${this._type}`;
  }

  /**
   * The handle's class list.
   *
   * Rebuilt only when one of its inputs changes: a connection drag notifies every handle in the
   * flow on every pointer move, and all but one or two of them end up with an unchanged list.
   */
  get handleClass() {
    const fromHandle = this._connection?.fromHandle ?? null;
    const connectingFrom = this._identifies(fromHandle);
    const connectingTo = this._identifies(this._connection?.toHandle ?? null);
    const valid = connectingTo && this._connection?.isValid === true;
    const connectionInProcess = !!fromHandle;
    const indicator = this._showsIndicator(fromHandle, connectionInProcess);

    const key = `${this._type}|${this.position}|${+this._isConnectable}${+this._isConnectableStart}${+this
      ._isConnectableEnd}${+connectingFrom}${+connectingTo}${+valid}${+indicator}`;

    if (key === this._classKey) {
      return this._className;
    }

    const classes = [
      HANDLE_CLASS,
      `${HANDLE_CLASS}-${this.position}`,
      this._type,
      interactionClass.noDrag,
      interactionClass.noPan,
    ];

    if (this._isConnectable) {
      classes.push('connectable');
    }
    if (this._isConnectableStart) {
      classes.push('connectablestart');
    }
    if (this._isConnectableEnd) {
      classes.push('connectableend');
    }
    if (connectingFrom) {
      classes.push('connectingfrom');
    }
    if (connectingTo) {
      classes.push('connectingto');
    }
    if (valid) {
      classes.push('valid');
    }
    if (indicator) {
      classes.push('connectionindicator');
    }

    this._classKey = key;
    this._className = classes.join(' ');

    return this._className;
  }

  /**
   * Report a press so the gesture owner can start a connection.
   *
   * Mirrors upstream's guard: only the primary mouse button starts a connection, and only when
   * this handle may be a connection's origin.
   * @param {PointerEvent} event
   */
  handlePointerDown(event) {
    if (!this.nodeId || !this._isConnectableStart) {
      return;
    }

    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('connectstart', {
        detail: { nodeId: this.nodeId, handleId: this._handleId, handleType: this._type },
      })
    );
  }

  /** True when `handle` names this exact handle. */
  _identifies(handle) {
    return (
      !!handle && handle.nodeId === this.nodeId && (handle.id ?? null) === this._handleId && handle.type === this._type
    );
  }

  /**
   * Whether the handle advertises itself as a place a connection can start from or end on.
   * Copied from upstream's `connectionindicator` condition.
   */
  _showsIndicator(fromHandle, connectionInProcess) {
    if (!this._isConnectable) {
      return false;
    }

    const connectionMode = this.store?.state?.connectionMode ?? ConnectionMode.Strict;
    const isPossibleEndHandle =
      connectionMode === ConnectionMode.Strict
        ? fromHandle?.type !== this._type
        : this.nodeId !== fromHandle?.nodeId || this._handleId !== (fromHandle?.id ?? null);

    if (connectionInProcess && !isPossibleEndHandle) {
      return false;
    }

    return connectionInProcess ? this._isConnectableEnd : this._isConnectableStart;
  }
}
