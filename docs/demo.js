/**
 * Copyright (c) 2026 Salesforce, Inc.
 */
/**
 * Copyright (c) 2026 Salesforce, Inc.
 */
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 *
 * @param value
 * @param msg
 */
function invariant(value, msg) {
    if (!value) {
        throw new Error(`Invariant Violation: ${msg}`);
    }
}
/**
 *
 * @param value
 * @param msg
 */
function isTrue$1(value, msg) {
    if (!value) {
        throw new Error(`Assert Violation: ${msg}`);
    }
}
/**
 *
 * @param value
 * @param msg
 */
function isFalse$1(value, msg) {
    if (value) {
        throw new Error(`Assert Violation: ${msg}`);
    }
}
/**
 *
 * @param msg
 */
function fail(msg) {
    throw new Error(msg);
}

var assert = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fail: fail,
    invariant: invariant,
    isFalse: isFalse$1,
    isTrue: isTrue$1
});

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const { 
/** Detached {@linkcode Object.assign}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign MDN Reference}. */
assign, 
/** Detached {@linkcode Object.create}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create MDN Reference}. */
create, 
/** Detached {@linkcode Object.defineProperties}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties MDN Reference}. */
defineProperties, 
/** Detached {@linkcode Object.defineProperty}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty MDN Reference}. */
defineProperty, 
/** Detached {@linkcode Object.entries}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries MDN Reference}. */
entries, 
/** Detached {@linkcode Object.freeze}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze MDN Reference}. */
freeze, 
/** Detached {@linkcode Object.getOwnPropertyDescriptor}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor MDN Reference}. */
getOwnPropertyDescriptor: getOwnPropertyDescriptor$1, 
/** Detached {@linkcode Object.getOwnPropertyDescriptors}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors MDN Reference}. */
getOwnPropertyDescriptors, 
/** Detached {@linkcode Object.getOwnPropertyNames}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames MDN Reference}. */
getOwnPropertyNames: getOwnPropertyNames$1, 
/** Detached {@linkcode Object.getPrototypeOf}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf MDN Reference}. */
getPrototypeOf: getPrototypeOf$1, 
/** Detached {@linkcode Object.hasOwnProperty}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty MDN Reference}. */
hasOwnProperty: hasOwnProperty$1, 
/** Detached {@linkcode Object.isFrozen}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen MDN Reference}. */
isFrozen, 
/** Detached {@linkcode Object.keys}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys MDN Reference}. */
keys, 
/** Detached {@linkcode Object.seal}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal MDN Reference}. */
seal, 
/** Detached {@linkcode Object.setPrototypeOf}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf MDN Reference}. */
setPrototypeOf, } = Object;
const { 
/** Detached {@linkcode Array.isArray}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray MDN Reference}. */
isArray: isArray$1, 
/** Detached {@linkcode Array.from}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from MDN Reference}. */
from: ArrayFrom, } = Array;
// For some reason, JSDoc don't get picked up for multiple renamed destructured constants (even
// though it works fine for one, e.g. isArray), so comments for these are added to the export
// statement, rather than this declaration.
const { filter: ArrayFilter, indexOf: ArrayIndexOf, join: ArrayJoin, map: ArrayMap, pop: ArrayPop, push: ArrayPush$1, slice: ArraySlice, splice: ArraySplice, unshift: ArrayUnshift, forEach, // Weird anomaly!
 } = Array.prototype;
/** Detached {@linkcode String.fromCharCode}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode MDN Reference}. */
const { fromCharCode: StringFromCharCode } = String;
// No JSDocs here - see comment for Array.prototype
const { charAt: StringCharAt, charCodeAt: StringCharCodeAt, replace: StringReplace, slice: StringSlice, toLowerCase: StringToLowerCase, trim: StringTrim, } = String.prototype;
/**
 * Determines whether the argument is `undefined`.
 * @param obj Value to test
 * @returns `true` if the value is `undefined`.
 */
function isUndefined$1(obj) {
    return obj === undefined;
}
/**
 * Determines whether the argument is `null`.
 * @param obj Value to test
 * @returns `true` if the value is `null`.
 */
function isNull(obj) {
    return obj === null;
}
/**
 * Determines whether the argument is `true`.
 * @param obj Value to test
 * @returns `true` if the value is `true`.
 */
function isTrue(obj) {
    return obj === true;
}
/**
 * Determines whether the argument is `false`.
 * @param obj Value to test
 * @returns `true` if the value is `false`.
 */
function isFalse(obj) {
    return obj === false;
}
/**
 * Determines whether the argument is a function.
 * @param obj Value to test
 * @returns `true` if the value is a function.
 */
// Replacing `Function` with a narrower type that works for all our use cases is tricky...
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function isFunction$1(obj) {
    return typeof obj === 'function';
}
/**
 * Determines whether the argument is an object or null.
 * @param obj Value to test
 * @returns `true` if the value is an object or null.
 */
function isObject(obj) {
    return typeof obj === 'object';
}
/**
 * Determines whether the argument is a string.
 * @param obj Value to test
 * @returns `true` if the value is a string.
 */
function isString(obj) {
    return typeof obj === 'string';
}
/** Does nothing! 🚀 */
function noop() {
    /* Do nothing */
}
const OtS = {}.toString;
/**
 * Converts the argument to a string, safely accounting for objects with "null" prototype.
 * Note that `toString(null)` returns `"[object Null]"` rather than `"null"`.
 * @param obj Value to convert to a string.
 * @returns String representation of the value.
 */
function toString(obj) {
    if (obj?.toString) {
        // Arrays might hold objects with "null" prototype So using
        // Array.prototype.toString directly will cause an error Iterate through
        // all the items and handle individually.
        if (isArray$1(obj)) {
            // This behavior is slightly different from Array#toString:
            // 1. Array#toString calls `this.join`, rather than Array#join
            // Ex: arr = []; arr.join = () => 1; arr.toString() === 1; toString(arr) === ''
            // 2. Array#toString delegates to Object#toString if `this.join` is not a function
            // Ex: arr = []; arr.join = 'no'; arr.toString() === '[object Array]; toString(arr) = ''
            // 3. Array#toString converts null/undefined to ''
            // Ex: arr = [null, undefined]; arr.toString() === ','; toString(arr) === '[object Null],undefined'
            // 4. Array#toString converts recursive references to arrays to ''
            // Ex: arr = [1]; arr.push(arr, 2); arr.toString() === '1,,2'; toString(arr) throws
            // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString
            return ArrayJoin.call(ArrayMap.call(obj, toString), ',');
        }
        return obj.toString();
    }
    else if (typeof obj === 'object') {
        // This catches null and returns "[object Null]". Weird, but kept for backwards compatibility.
        return OtS.call(obj);
    }
    else {
        return String(obj);
    }
}
/**
 * Gets the property descriptor for the given object and property key. Similar to
 * {@linkcode Object.getOwnPropertyDescriptor}, but looks up the prototype chain.
 * @param o Value to get the property descriptor for
 * @param p Property key to get the descriptor for
 * @returns The property descriptor for the given object and property key.
 */
function getPropertyDescriptor(o, p) {
    do {
        const d = getOwnPropertyDescriptor$1(o, p);
        if (!isUndefined$1(d)) {
            return d;
        }
        o = getPrototypeOf$1(o);
    } while (o !== null);
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// These must be updated when the enum is updated.
// It's a bit annoying to do have to do this manually, but this makes the file tree-shakeable,
// passing the `verify-treeshakeable.js` test.
const allVersions = [
    58 /* APIVersion.V58_244_SUMMER_23 */,
    59 /* APIVersion.V59_246_WINTER_24 */,
    60 /* APIVersion.V60_248_SPRING_24 */,
    61 /* APIVersion.V61_250_SUMMER_24 */,
    62 /* APIVersion.V62_252_WINTER_25 */,
    63 /* APIVersion.V63_254_SPRING_25 */,
    64 /* APIVersion.V64_256_SUMMER_25 */,
    65 /* APIVersion.V65_258_WINTER_26 */,
    66 /* APIVersion.V66_260_SPRING_26 */,
];
const LOWEST_API_VERSION = allVersions[0];
/**
 * @param apiVersionFeature
 */
function minApiVersion(apiVersionFeature) {
    switch (apiVersionFeature) {
        case 0 /* APIFeature.LOWERCASE_SCOPE_TOKENS */:
        case 1 /* APIFeature.TREAT_ALL_PARSE5_ERRORS_AS_ERRORS */:
            return 59 /* APIVersion.V59_246_WINTER_24 */;
        case 3 /* APIFeature.DISABLE_OBJECT_REST_SPREAD_TRANSFORMATION */:
        case 4 /* APIFeature.SKIP_UNNECESSARY_REGISTER_DECORATORS */:
        case 5 /* APIFeature.USE_COMMENTS_FOR_FRAGMENT_BOOKENDS */:
        case 2 /* APIFeature.USE_FRAGMENTS_FOR_LIGHT_DOM_SLOTS */:
            return 60 /* APIVersion.V60_248_SPRING_24 */;
        case 7 /* APIFeature.ENABLE_ELEMENT_INTERNALS_AND_FACE */:
        case 6 /* APIFeature.USE_LIGHT_DOM_SLOT_FORWARDING */:
            return 61 /* APIVersion.V61_250_SUMMER_24 */;
        case 8 /* APIFeature.ENABLE_THIS_DOT_HOST_ELEMENT */:
        case 9 /* APIFeature.ENABLE_THIS_DOT_STYLE */:
        case 10 /* APIFeature.TEMPLATE_CLASS_NAME_OBJECT_BINDING */:
            return 62 /* APIVersion.V62_252_WINTER_25 */;
        case 11 /* APIFeature.ENABLE_COMPLEX_TEMPLATE_EXPRESSIONS */:
            return 66 /* APIVersion.V66_260_SPRING_26 */;
    }
}
/**
 *
 * @param apiVersionFeature
 * @param apiVersion
 */
function isAPIFeatureEnabled(apiVersionFeature, apiVersion) {
    return apiVersion >= minApiVersion(apiVersionFeature);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * According to the following list, there are 48 aria attributes of which two (ariaDropEffect and
 * ariaGrabbed) are deprecated:
 * https://www.w3.org/TR/wai-aria-1.1/#x6-6-definitions-of-states-and-properties-all-aria-attributes
 *
 * The above list of 46 aria attributes is consistent with the following resources:
 * https://github.com/w3c/aria/pull/708/files#diff-eacf331f0ffc35d4b482f1d15a887d3bR11060
 * https://wicg.github.io/aom/spec/aria-reflection.html
 *
 * NOTE: If you update this list, please update test files that implicitly reference this list!
 * Searching the codebase for `aria-flowto` and `ariaFlowTo` should be good enough to find all usages.
 */
const AriaPropertyNames = [
    'ariaActiveDescendant',
    'ariaAtomic',
    'ariaAutoComplete',
    'ariaBusy',
    'ariaChecked',
    'ariaColCount',
    'ariaColIndex',
    'ariaColIndexText',
    'ariaColSpan',
    'ariaControls',
    'ariaCurrent',
    'ariaDescribedBy',
    'ariaDescription',
    'ariaDetails',
    'ariaDisabled',
    'ariaErrorMessage',
    'ariaExpanded',
    'ariaFlowTo',
    'ariaHasPopup',
    'ariaHidden',
    'ariaInvalid',
    'ariaKeyShortcuts',
    'ariaLabel',
    'ariaLabelledBy',
    'ariaLevel',
    'ariaLive',
    'ariaModal',
    'ariaMultiLine',
    'ariaMultiSelectable',
    'ariaOrientation',
    'ariaOwns',
    'ariaPlaceholder',
    'ariaPosInSet',
    'ariaPressed',
    'ariaReadOnly',
    'ariaRelevant',
    'ariaRequired',
    'ariaRoleDescription',
    'ariaRowCount',
    'ariaRowIndex',
    'ariaRowIndexText',
    'ariaRowSpan',
    'ariaSelected',
    'ariaSetSize',
    'ariaSort',
    'ariaValueMax',
    'ariaValueMin',
    'ariaValueNow',
    'ariaValueText',
    'ariaBrailleLabel',
    'ariaBrailleRoleDescription',
    'role',
];
const { AriaAttrNameToPropNameMap, AriaPropNameToAttrNameMap } = /*@__PURE__*/ (() => {
    const AriaAttrNameToPropNameMap = create(null);
    const AriaPropNameToAttrNameMap = create(null);
    // Synthetic creation of all AOM property descriptors for Custom Elements
    forEach.call(AriaPropertyNames, (propName) => {
        const attrName = StringToLowerCase.call(StringReplace.call(propName, /^aria/, () => 'aria-'));
        // These type assertions are because the map types are a 1:1 mapping of ariaX to aria-x.
        // TypeScript knows we have one of ariaX | ariaY and one of aria-x | aria-y, and tries to
        // prevent us from doing ariaX: aria-y, but we that it's safe.
        AriaAttrNameToPropNameMap[attrName] = propName;
        AriaPropNameToAttrNameMap[propName] = attrName;
    });
    return { AriaAttrNameToPropNameMap, AriaPropNameToAttrNameMap };
})();

/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ContextEventName = 'lightning:context-request';
let contextKeys;
function getContextKeys() {
    return contextKeys;
}
function isTrustedContext(target) {
    {
        // The runtime didn't set a trustedContext set
        // this check should only be performed for runtimes that care about filtering context participants to track
        return true;
    }
}

/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const KEY__SHADOW_RESOLVER = '$shadowResolver$';
const KEY__SHADOW_STATIC = '$shadowStaticNode$';
const KEY__SHADOW_TOKEN = '$shadowToken$';
const KEY__SYNTHETIC_MODE = '$$lwc-synthetic-mode';
const KEY__SCOPED_CSS = '$scoped$';
const KEY__NATIVE_ONLY_CSS = '$nativeOnly$';
const KEY__NATIVE_GET_ELEMENT_BY_ID = '$nativeGetElementById$';
const KEY__NATIVE_QUERY_SELECTOR_ALL = '$nativeQuerySelectorAll$';
const XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const CAMEL_REGEX = /-([a-z])/g;
// These are HTML standard prop/attribute IDL mappings, but are not predictable based on camel/kebab-case conversion
const SPECIAL_PROPERTY_ATTRIBUTE_MAPPING = /*@__PURE__@*/ new Map([
    ['accessKey', 'accesskey'],
    ['readOnly', 'readonly'],
    ['tabIndex', 'tabindex'],
    ['bgColor', 'bgcolor'],
    ['colSpan', 'colspan'],
    ['rowSpan', 'rowspan'],
    ['contentEditable', 'contenteditable'],
    ['crossOrigin', 'crossorigin'],
    ['dateTime', 'datetime'],
    ['formAction', 'formaction'],
    ['isMap', 'ismap'],
    ['maxLength', 'maxlength'],
    ['minLength', 'minlength'],
    ['noValidate', 'novalidate'],
    ['useMap', 'usemap'],
    ['htmlFor', 'for'],
]);
// Global properties that this framework currently reflects. For CSR, the native
// descriptors for these properties are added from HTMLElement.prototype to
// LightningElement.prototype. For SSR, in order to match CSR behavior, this
// list is used to determine which attributes to reflect.
const REFLECTIVE_GLOBAL_PROPERTY_SET = /*@__PURE__@*/ new Set([
    'accessKey',
    'dir',
    'draggable',
    'hidden',
    'id',
    'lang',
    'spellcheck',
    'tabIndex',
    'title',
]);
/**
 * Map associating previously transformed HTML property into HTML attribute.
 */
const CACHED_PROPERTY_ATTRIBUTE_MAPPING = /*@__PURE__@*/ new Map();
/**
 *
 * @param propName
 */
function htmlPropertyToAttribute(propName) {
    const ariaAttributeName = AriaPropNameToAttrNameMap[propName];
    if (!isUndefined$1(ariaAttributeName)) {
        return ariaAttributeName;
    }
    const specialAttributeName = SPECIAL_PROPERTY_ATTRIBUTE_MAPPING.get(propName);
    if (!isUndefined$1(specialAttributeName)) {
        return specialAttributeName;
    }
    const cachedAttributeName = CACHED_PROPERTY_ATTRIBUTE_MAPPING.get(propName);
    if (!isUndefined$1(cachedAttributeName)) {
        return cachedAttributeName;
    }
    let attributeName = '';
    for (let i = 0, len = propName.length; i < len; i++) {
        const code = StringCharCodeAt.call(propName, i);
        if (code >= 65 && // "A"
            code <= 90 // "Z"
        ) {
            attributeName += '-' + StringFromCharCode(code + 32);
        }
        else {
            attributeName += StringFromCharCode(code);
        }
    }
    CACHED_PROPERTY_ATTRIBUTE_MAPPING.set(propName, attributeName);
    return attributeName;
}
/**
 * Map associating previously transformed kabab-case attributes into camel-case props.
 */
const CACHED_KEBAB_CAMEL_MAPPING = /*@__PURE__@*/ new Map();
/**
 *
 * @param attrName
 */
function kebabCaseToCamelCase(attrName) {
    let result = CACHED_KEBAB_CAMEL_MAPPING.get(attrName);
    if (isUndefined$1(result)) {
        result = StringReplace.call(attrName, CAMEL_REGEX, (g) => g[1].toUpperCase());
        CACHED_KEBAB_CAMEL_MAPPING.set(attrName, result);
    }
    return result;
}

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * [ncls] - Normalize class name attribute.
 *
 * Transforms the provided class property value from an object/string into a string the diffing algo
 * can operate on.
 *
 * This implementation is borrowed from Vue:
 * https://github.com/vuejs/core/blob/e790e1bdd7df7be39e14780529db86e4da47a3db/packages/shared/src/normalizeProp.ts#L63-L82
 */
function normalizeClass(value) {
    if (isUndefined$1(value) || isNull(value)) {
        // Returning undefined here improves initial render cost, because the old vnode's class will be considered
        // undefined in the `patchClassAttribute` routine, so `oldClass === newClass` will be true so we return early
        return undefined;
    }
    let res = '';
    if (isString(value)) {
        res = value;
    }
    else if (isArray$1(value)) {
        for (let i = 0; i < value.length; i++) {
            const normalized = normalizeClass(value[i]);
            if (normalized) {
                res += normalized + ' ';
            }
        }
    }
    else if (isObject(value) && !isNull(value)) {
        // Iterate own enumerable keys of the object
        const _keys = keys(value);
        for (let i = 0; i < _keys.length; i += 1) {
            const key = _keys[i];
            if (value[key]) {
                res += key + ' ';
            }
        }
    }
    return StringTrim.call(res);
}
let sanitizeHtmlContentImpl = () => {
    // locker-service patches this function during runtime to sanitize HTML content.
    throw new Error('sanitizeHtmlContent hook must be implemented.');
};
/**
 * EXPERIMENTAL: This function acts like a hook for Lightning Locker Service and other similar
 * libraries to sanitize HTML content. This hook process the content passed via the template to
 * lwc:inner-html directive.
 * It is meant to be overridden via `setHooks`; it throws an error by default.
 */
const sanitizeHtmlContent = (value) => {
    return sanitizeHtmlContentImpl();
};
function flattenStylesheets(stylesheets) {
    const list = [];
    for (const stylesheet of stylesheets) {
        if (!isArray$1(stylesheet)) {
            list.push(stylesheet);
        }
        else {
            list.push(...flattenStylesheets(stylesheet));
        }
    }
    return list;
}
function isTrustedSignal(target) {
    {
        return false;
    }
}
if (!globalThis.lwcRuntimeFlags) {
    Object.defineProperty(globalThis, 'lwcRuntimeFlags', { value: create(null) });
}
/**
 * Whether reporting is enabled.
 *
 * Note that this may seem redundant, given you can just check if the currentDispatcher is undefined,
 * but it turns out that Terser only strips out unused code if we use this explicit boolean.
 */
let enabled$1 = false;
/**
 * Return true if reporting is enabled
 */
function isReportingEnabled() {
    return enabled$1;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function getComponentTag(vm) {
    return `<${StringToLowerCase.call(vm.tagName)}>`;
}
// TODO [#1695]: Unify getComponentStack and getErrorComponentStack
function getComponentStack(vm) {
    const stack = [];
    let prefix = '';
    while (!isNull(vm.owner)) {
        ArrayPush$1.call(stack, prefix + getComponentTag(vm));
        vm = vm.owner;
        prefix += '\t';
    }
    return ArrayJoin.call(stack, '\n');
}
function getErrorComponentStack(vm) {
    const wcStack = [];
    let currentVm = vm;
    while (!isNull(currentVm)) {
        ArrayPush$1.call(wcStack, getComponentTag(currentVm));
        currentVm = currentVm.owner;
    }
    return wcStack.reverse().join('\n\t');
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function addErrorComponentStack(vm, error) {
    if (!isFrozen(error) && isUndefined$1(error.wcStack)) {
        const wcStack = getErrorComponentStack(vm);
        defineProperty(error, 'wcStack', {
            get() {
                return wcStack;
            },
        });
    }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const alreadyLoggedMessages = new Set();
function log(method, message, vm, once) {
    let msg = `[LWC ${method}]: ${message}`;
    if (!isUndefined$1(vm)) {
        msg = `${msg}\n${getComponentStack(vm)}`;
    }
    if (once) {
        if (alreadyLoggedMessages.has(msg)) {
            return;
        }
        alreadyLoggedMessages.add(msg);
    }
    try {
        throw new Error(msg);
    }
    catch (e) {
        /* eslint-disable-next-line no-console */
        console[method](e);
    }
}
function logError(message, vm) {
    log('error', message, vm, false);
}
function logWarnOnce(message, vm) {
    log('warn', message, vm, true);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let nextTickCallbackQueue = [];
const SPACE_CHAR = 32;
const EmptyObject = seal(create(null));
const EmptyArray = seal([]);
function flushCallbackQueue() {
    const callbacks = nextTickCallbackQueue;
    nextTickCallbackQueue = []; // reset to a new queue
    for (let i = 0, len = callbacks.length; i < len; i += 1) {
        callbacks[i]();
    }
}
function addCallbackToNextTick(callback) {
    if (nextTickCallbackQueue.length === 0) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        Promise.resolve().then(flushCallbackQueue);
    }
    ArrayPush$1.call(nextTickCallbackQueue, callback);
}
// Throw an error if we're running in prod mode. Ensures code is truly removed from prod mode.
function assertNotProd() {
    /* istanbul ignore if */
    {
        // this method should never leak to prod
        throw new ReferenceError();
    }
}
function shouldBeFormAssociated(Ctor) {
    const ctorFormAssociated = Boolean(Ctor.formAssociated);
    const apiVersion = getComponentAPIVersion(Ctor);
    const apiFeatureEnabled = isAPIFeatureEnabled(7 /* APIFeature.ENABLE_ELEMENT_INTERNALS_AND_FACE */, apiVersion);
    return ctorFormAssociated && apiFeatureEnabled;
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const TargetToReactiveRecordMap = new WeakMap();
function getReactiveRecord(target) {
    let reactiveRecord = TargetToReactiveRecordMap.get(target);
    if (isUndefined$1(reactiveRecord)) {
        const newRecord = create(null);
        reactiveRecord = newRecord;
        TargetToReactiveRecordMap.set(target, newRecord);
    }
    return reactiveRecord;
}
let currentReactiveObserver = null;
function valueMutated(target, key) {
    const reactiveRecord = TargetToReactiveRecordMap.get(target);
    if (!isUndefined$1(reactiveRecord)) {
        const reactiveObservers = reactiveRecord[key];
        if (!isUndefined$1(reactiveObservers)) {
            for (let i = 0, len = reactiveObservers.length; i < len; i += 1) {
                const ro = reactiveObservers[i];
                ro.notify();
            }
        }
    }
}
function valueObserved(target, key) {
    // We should determine if an active Observing Record is present to track mutations.
    if (currentReactiveObserver === null) {
        return;
    }
    const ro = currentReactiveObserver;
    const reactiveRecord = getReactiveRecord(target);
    let reactiveObservers = reactiveRecord[key];
    if (isUndefined$1(reactiveObservers)) {
        reactiveObservers = [];
        reactiveRecord[key] = reactiveObservers;
    }
    else if (reactiveObservers[0] === ro) {
        return; // perf optimization considering that most subscriptions will come from the same record
    }
    if (ArrayIndexOf.call(reactiveObservers, ro) === -1) {
        ro.link(reactiveObservers);
    }
}
class ReactiveObserver {
    constructor(callback) {
        this.listeners = [];
        this.callback = callback;
    }
    observe(job) {
        const inceptionReactiveRecord = currentReactiveObserver;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        currentReactiveObserver = this;
        let error;
        try {
            job();
        }
        catch (e) {
            error = Object(e);
        }
        finally {
            currentReactiveObserver = inceptionReactiveRecord;
            if (error !== undefined) {
                throw error; // eslint-disable-line no-unsafe-finally
            }
        }
    }
    /**
     * This method is responsible for disconnecting the Reactive Observer
     * from any Reactive Record that has a reference to it, to prevent future
     * notifications about previously recorded access.
     */
    reset() {
        const { listeners } = this;
        const len = listeners.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                const set = listeners[i];
                const setLength = set.length;
                // The length is usually 1, so avoid doing an indexOf when we know for certain
                // that `this` is the first item in the array.
                if (setLength > 1) {
                    // Swap with the last item before removal.
                    // (Avoiding splice here is a perf optimization, and the order doesn't matter.)
                    const index = ArrayIndexOf.call(set, this);
                    set[index] = set[setLength - 1];
                }
                // Remove the last item
                ArrayPop.call(set);
            }
            listeners.length = 0;
        }
    }
    // friend methods
    notify() {
        this.callback.call(undefined, this);
    }
    link(reactiveObservers) {
        ArrayPush$1.call(reactiveObservers, this);
        // we keep track of observing records where the observing record was added to so we can do some clean up later on
        ArrayPush$1.call(this.listeners, reactiveObservers);
    }
    isObserving() {
        return currentReactiveObserver === this;
    }
}

/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This map keeps track of objects to signals. There is an assumption that the signal is strongly referenced
 * on the object which allows the SignalTracker to be garbage collected along with the object.
 */
const TargetToSignalTrackerMap = new WeakMap();
function getSignalTracker(target) {
    let signalTracker = TargetToSignalTrackerMap.get(target);
    if (isUndefined$1(signalTracker)) {
        signalTracker = new SignalTracker();
        TargetToSignalTrackerMap.set(target, signalTracker);
    }
    return signalTracker;
}
function subscribeToSignal(target, signal, update) {
    const signalTracker = getSignalTracker(target);
    if (isFalse(signalTracker.seen(signal))) {
        signalTracker.subscribeToSignal(signal, update);
    }
}
function unsubscribeFromSignals(target) {
    if (TargetToSignalTrackerMap.has(target)) {
        const signalTracker = getSignalTracker(target);
        signalTracker.unsubscribeFromSignals();
        signalTracker.reset();
    }
}
/**
 * A normalized string representation of an error, because browsers behave differently
 */
const errorWithStack = (err) => {
    if (typeof err !== 'object' || err === null) {
        return String(err);
    }
    const stack = 'stack' in err ? String(err.stack) : '';
    const message = 'message' in err ? String(err.message) : '';
    const constructor = err.constructor.name;
    return stack.includes(message) ? stack : `${constructor}: ${message}\n${stack}`;
};
/**
 * This class is used to keep track of the signals associated to a given object.
 * It is used to prevent the LWC engine from subscribing duplicate callbacks multiple times
 * to the same signal. Additionally, it keeps track of all signal unsubscribe callbacks, handles invoking
 * them when necessary and discarding them.
 */
class SignalTracker {
    constructor() {
        this.signalToUnsubscribeMap = new Map();
    }
    seen(signal) {
        return this.signalToUnsubscribeMap.has(signal);
    }
    subscribeToSignal(signal, update) {
        try {
            const unsubscribe = signal.subscribe(update);
            if (isFunction$1(unsubscribe)) {
                // TODO [#3978]: Evaluate how we should handle the case when unsubscribe is not a function.
                // Long term we should throw an error or log a warning.
                this.signalToUnsubscribeMap.set(signal, unsubscribe);
            }
        }
        catch (err) {
            logWarnOnce(`Attempted to subscribe to an object that has the shape of a signal but received the following error: ${errorWithStack(err)}`);
        }
    }
    unsubscribeFromSignals() {
        try {
            this.signalToUnsubscribeMap.forEach((unsubscribe) => unsubscribe());
        }
        catch (err) {
            logWarnOnce(`Attempted to call a signal's unsubscribe callback but received the following error: ${errorWithStack(err)}`);
        }
    }
    reset() {
        this.signalToUnsubscribeMap.clear();
    }
}
function componentValueMutated(vm, key) {
    // On the server side, we don't need mutation tracking. Skipping it improves performance.
    {
        valueMutated(vm.component, key);
    }
}
function componentValueObserved(vm, key, target = {}) {
    const { component, tro } = vm;
    // On the server side, we don't need mutation tracking. Skipping it improves performance.
    {
        valueObserved(component, key);
    }
    // The portion of reactivity that's exposed to signals is to subscribe a callback to re-render the VM (templates).
    // We check the following to ensure re-render is subscribed at the correct time.
    //  1. The template is currently being rendered (there is a template reactive observer)
    //  2. There was a call to a getter to access the signal (happens during vnode generation)
    if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS &&
        isObject(target) &&
        !isNull(target) &&
        true &&
        // Only subscribe if a template is being rendered by the engine
        tro.isObserving()) {
        if (isTrustedSignal()) {
            // Subscribe the template reactive observer's notify method, which will mark the vm as dirty and schedule hydration.
            subscribeToSignal(component, target, tro.notify.bind(tro));
        }
    }
}
function createReactiveObserver(callback) {
    // On the server side, we don't need mutation tracking. Skipping it improves performance.
    return new ReactiveObserver(callback) ;
}

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function resolveCircularModuleDependency(fn) {
    const module = fn();
    return module?.__esModule ? module.default : module;
}
function isCircularModuleDependency(obj) {
    return isFunction$1(obj) && hasOwnProperty$1.call(obj, '__circular__');
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const instrumentDef = globalThis.__lwc_instrument_cmp_def ?? noop;
const instrumentInstance = globalThis.__lwc_instrument_cmp_instance ?? noop;

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// This is a temporary workaround to get the @lwc/engine-server to evaluate in node without having
// to inject at runtime.
const HTMLElementConstructor = typeof HTMLElement !== 'undefined' ? HTMLElement : function () { };
const HTMLElementPrototype = HTMLElementConstructor.prototype;

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Apply ARIA string reflection behavior to a prototype.
// This is deliberately kept separate from @lwc/aria-reflection. @lwc/aria-reflection is a global polyfill that is
// needed for backwards compatibility in LEX, whereas this is designed to only apply to our own
// LightningElement/BaseBridgeElement prototypes.
// Note we only need to handle ARIA reflections that aren't already in Element.prototype
const ariaReflectionPolyfillDescriptors = create(null);
for (const [propName, attrName] of entries(AriaPropNameToAttrNameMap)) {
    if (isUndefined$1(getPropertyDescriptor(HTMLElementPrototype, propName))) {
        // Note that we need to call this.{get,set,has,remove}Attribute rather than dereferencing
        // from Element.prototype, because these methods are overridden in LightningElement.
        ariaReflectionPolyfillDescriptors[propName] = {
            get() {
                return this.getAttribute(attrName);
            },
            set(newValue) {
                // TODO [#3284]: According to the spec, IDL nullable type values
                // (null and undefined) should remove the attribute; however, we
                // only do so in the case of null for historical reasons.
                // See also https://github.com/w3c/aria/issues/1858
                if (isNull(newValue)) {
                    this.removeAttribute(attrName);
                }
                else {
                    this.setAttribute(attrName, newValue);
                }
            },
            // configurable and enumerable to allow it to be overridden – this mimics Safari's/Chrome's behavior
            configurable: true,
            enumerable: true,
        };
    }
}
// Add descriptors for ARIA attributes
for (const [attrName, propName] of entries(AriaAttrNameToPropNameMap)) {
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This is a descriptor map that contains
 * all standard properties that a Custom Element can support (including AOM properties), which
 * determines what kind of capabilities the Base HTML Element and
 * Base Lightning Element should support.
 */
const HTMLElementOriginalDescriptors = create(null);
forEach.call(keys(AriaPropNameToAttrNameMap), (propName) => {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, some properties are on Element.prototype instead of HTMLElement, just to be sure.
    const descriptor = getPropertyDescriptor(HTMLElementPrototype, propName);
    if (!isUndefined$1(descriptor)) {
        HTMLElementOriginalDescriptors[propName] = descriptor;
    }
});
for (const propName of REFLECTIVE_GLOBAL_PROPERTY_SET) {
    // Note: intentionally using our in-house getPropertyDescriptor instead of getOwnPropertyDescriptor here because
    // in IE11, id property is on Element.prototype instead of HTMLElement, and we suspect that more will fall into
    // this category, so, better to be sure.
    const descriptor = getPropertyDescriptor(HTMLElementPrototype, propName);
    if (!isUndefined$1(descriptor)) {
        HTMLElementOriginalDescriptors[propName] = descriptor;
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function updateComponentValue(vm, key, newValue) {
    const { cmpFields } = vm;
    if (newValue !== cmpFields[key]) {
        cmpFields[key] = newValue;
        componentValueMutated(vm, key);
    }
}

/**
 * Copyright (C) 2017 salesforce.com, inc.
 */
const { isArray } = Array;
const { prototype: ObjectDotPrototype, getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty, } = Object;
const { push: ArrayPush, concat: ArrayConcat } = Array.prototype;
function isUndefined(obj) {
    return obj === undefined;
}
function isFunction(obj) {
    return typeof obj === 'function';
}
const proxyToValueMap = new WeakMap();
function registerProxy(proxy, value) {
    proxyToValueMap.set(proxy, value);
}
const unwrap$1 = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

class BaseProxyHandler {
    constructor(membrane, value) {
        this.originalTarget = value;
        this.membrane = membrane;
    }
    // Shared utility methods
    wrapDescriptor(descriptor) {
        if (hasOwnProperty.call(descriptor, 'value')) {
            descriptor.value = this.wrapValue(descriptor.value);
        }
        else {
            const { set: originalSet, get: originalGet } = descriptor;
            if (!isUndefined(originalGet)) {
                descriptor.get = this.wrapGetter(originalGet);
            }
            if (!isUndefined(originalSet)) {
                descriptor.set = this.wrapSetter(originalSet);
            }
        }
        return descriptor;
    }
    copyDescriptorIntoShadowTarget(shadowTarget, key) {
        const { originalTarget } = this;
        // Note: a property might get defined multiple times in the shadowTarget
        //       but it will always be compatible with the previous descriptor
        //       to preserve the object invariants, which makes these lines safe.
        const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
        // TODO: it should be impossible for the originalDescriptor to ever be undefined, this `if` can be removed
        /* istanbul ignore else */
        if (!isUndefined(originalDescriptor)) {
            const wrappedDesc = this.wrapDescriptor(originalDescriptor);
            ObjectDefineProperty(shadowTarget, key, wrappedDesc);
        }
    }
    lockShadowTarget(shadowTarget) {
        const { originalTarget } = this;
        const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
        targetKeys.forEach((key) => {
            this.copyDescriptorIntoShadowTarget(shadowTarget, key);
        });
        const { membrane: { tagPropertyKey }, } = this;
        if (!isUndefined(tagPropertyKey) && !hasOwnProperty.call(shadowTarget, tagPropertyKey)) {
            ObjectDefineProperty(shadowTarget, tagPropertyKey, ObjectCreate(null));
        }
        preventExtensions(shadowTarget);
    }
    // Shared Traps
    // TODO: apply() is never called
    /* istanbul ignore next */
    apply(shadowTarget, thisArg, argArray) {
        /* No op */
    }
    // TODO: construct() is never called
    /* istanbul ignore next */
    construct(shadowTarget, argArray, newTarget) {
        /* No op */
    }
    get(shadowTarget, key) {
        const { originalTarget, membrane: { valueObserved }, } = this;
        const value = originalTarget[key];
        valueObserved(originalTarget, key);
        return this.wrapValue(value);
    }
    has(shadowTarget, key) {
        const { originalTarget, membrane: { tagPropertyKey, valueObserved }, } = this;
        valueObserved(originalTarget, key);
        // since key is never going to be undefined, and tagPropertyKey might be undefined
        // we can simply compare them as the second part of the condition.
        return key in originalTarget || key === tagPropertyKey;
    }
    ownKeys(shadowTarget) {
        const { originalTarget, membrane: { tagPropertyKey }, } = this;
        // if the membrane tag key exists and it is not in the original target, we add it to the keys.
        const keys = isUndefined(tagPropertyKey) || hasOwnProperty.call(originalTarget, tagPropertyKey)
            ? []
            : [tagPropertyKey];
        // small perf optimization using push instead of concat to avoid creating an extra array
        ArrayPush.apply(keys, getOwnPropertyNames(originalTarget));
        ArrayPush.apply(keys, getOwnPropertySymbols(originalTarget));
        return keys;
    }
    isExtensible(shadowTarget) {
        const { originalTarget } = this;
        // optimization to avoid attempting to lock down the shadowTarget multiple times
        if (!isExtensible(shadowTarget)) {
            return false; // was already locked down
        }
        if (!isExtensible(originalTarget)) {
            this.lockShadowTarget(shadowTarget);
            return false;
        }
        return true;
    }
    getPrototypeOf(shadowTarget) {
        const { originalTarget } = this;
        return getPrototypeOf(originalTarget);
    }
    getOwnPropertyDescriptor(shadowTarget, key) {
        const { originalTarget, membrane: { valueObserved, tagPropertyKey }, } = this;
        // keys looked up via getOwnPropertyDescriptor need to be reactive
        valueObserved(originalTarget, key);
        let desc = getOwnPropertyDescriptor(originalTarget, key);
        if (isUndefined(desc)) {
            if (key !== tagPropertyKey) {
                return undefined;
            }
            // if the key is the membrane tag key, and is not in the original target,
            // we produce a synthetic descriptor and install it on the shadow target
            desc = { value: undefined, writable: false, configurable: false, enumerable: false };
            ObjectDefineProperty(shadowTarget, tagPropertyKey, desc);
            return desc;
        }
        if (desc.configurable === false) {
            // updating the descriptor to non-configurable on the shadow
            this.copyDescriptorIntoShadowTarget(shadowTarget, key);
        }
        // Note: by accessing the descriptor, the key is marked as observed
        // but access to the value, setter or getter (if available) cannot observe
        // mutations, just like regular methods, in which case we just do nothing.
        return this.wrapDescriptor(desc);
    }
}

const getterMap$1 = new WeakMap();
const setterMap$1 = new WeakMap();
const reverseGetterMap = new WeakMap();
const reverseSetterMap = new WeakMap();
class ReactiveProxyHandler extends BaseProxyHandler {
    wrapValue(value) {
        return this.membrane.getProxy(value);
    }
    wrapGetter(originalGet) {
        const wrappedGetter = getterMap$1.get(originalGet);
        if (!isUndefined(wrappedGetter)) {
            return wrappedGetter;
        }
        const handler = this;
        const get = function () {
            // invoking the original getter with the original target
            return handler.wrapValue(originalGet.call(unwrap$1(this)));
        };
        getterMap$1.set(originalGet, get);
        reverseGetterMap.set(get, originalGet);
        return get;
    }
    wrapSetter(originalSet) {
        const wrappedSetter = setterMap$1.get(originalSet);
        if (!isUndefined(wrappedSetter)) {
            return wrappedSetter;
        }
        const set = function (v) {
            // invoking the original setter with the original target
            originalSet.call(unwrap$1(this), unwrap$1(v));
        };
        setterMap$1.set(originalSet, set);
        reverseSetterMap.set(set, originalSet);
        return set;
    }
    unwrapDescriptor(descriptor) {
        if (hasOwnProperty.call(descriptor, 'value')) {
            // dealing with a data descriptor
            descriptor.value = unwrap$1(descriptor.value);
        }
        else {
            const { set, get } = descriptor;
            if (!isUndefined(get)) {
                descriptor.get = this.unwrapGetter(get);
            }
            if (!isUndefined(set)) {
                descriptor.set = this.unwrapSetter(set);
            }
        }
        return descriptor;
    }
    unwrapGetter(redGet) {
        const reverseGetter = reverseGetterMap.get(redGet);
        if (!isUndefined(reverseGetter)) {
            return reverseGetter;
        }
        const handler = this;
        const get = function () {
            // invoking the red getter with the proxy of this
            return unwrap$1(redGet.call(handler.wrapValue(this)));
        };
        getterMap$1.set(get, redGet);
        reverseGetterMap.set(redGet, get);
        return get;
    }
    unwrapSetter(redSet) {
        const reverseSetter = reverseSetterMap.get(redSet);
        if (!isUndefined(reverseSetter)) {
            return reverseSetter;
        }
        const handler = this;
        const set = function (v) {
            // invoking the red setter with the proxy of this
            redSet.call(handler.wrapValue(this), handler.wrapValue(v));
        };
        setterMap$1.set(set, redSet);
        reverseSetterMap.set(redSet, set);
        return set;
    }
    set(shadowTarget, key, value) {
        const { originalTarget, membrane: { valueMutated }, } = this;
        const oldValue = originalTarget[key];
        if (oldValue !== value) {
            originalTarget[key] = value;
            valueMutated(originalTarget, key);
        }
        else if (key === 'length' && isArray(originalTarget)) {
            // fix for issue #236: push will add the new index, and by the time length
            // is updated, the internal length is already equal to the new length value
            // therefore, the oldValue is equal to the value. This is the forking logic
            // to support this use case.
            valueMutated(originalTarget, key);
        }
        return true;
    }
    deleteProperty(shadowTarget, key) {
        const { originalTarget, membrane: { valueMutated }, } = this;
        delete originalTarget[key];
        valueMutated(originalTarget, key);
        return true;
    }
    setPrototypeOf(shadowTarget, prototype) {
    }
    preventExtensions(shadowTarget) {
        if (isExtensible(shadowTarget)) {
            const { originalTarget } = this;
            preventExtensions(originalTarget);
            // if the originalTarget is a proxy itself, it might reject
            // the preventExtension call, in which case we should not attempt to lock down
            // the shadow target.
            // TODO: It should not actually be possible to reach this `if` statement.
            // If a proxy rejects extensions, then calling preventExtensions will throw an error:
            // https://codepen.io/nolanlawson-the-selector/pen/QWMOjbY
            /* istanbul ignore if */
            if (isExtensible(originalTarget)) {
                return false;
            }
            this.lockShadowTarget(shadowTarget);
        }
        return true;
    }
    defineProperty(shadowTarget, key, descriptor) {
        const { originalTarget, membrane: { valueMutated, tagPropertyKey }, } = this;
        if (key === tagPropertyKey && !hasOwnProperty.call(originalTarget, key)) {
            // To avoid leaking the membrane tag property into the original target, we must
            // be sure that the original target doesn't have yet.
            // NOTE: we do not return false here because Object.freeze and equivalent operations
            // will attempt to set the descriptor to the same value, and expect no to throw. This
            // is an small compromise for the sake of not having to diff the descriptors.
            return true;
        }
        ObjectDefineProperty(originalTarget, key, this.unwrapDescriptor(descriptor));
        // intentionally testing if false since it could be undefined as well
        if (descriptor.configurable === false) {
            this.copyDescriptorIntoShadowTarget(shadowTarget, key);
        }
        valueMutated(originalTarget, key);
        return true;
    }
}

const getterMap = new WeakMap();
const setterMap = new WeakMap();
class ReadOnlyHandler extends BaseProxyHandler {
    wrapValue(value) {
        return this.membrane.getReadOnlyProxy(value);
    }
    wrapGetter(originalGet) {
        const wrappedGetter = getterMap.get(originalGet);
        if (!isUndefined(wrappedGetter)) {
            return wrappedGetter;
        }
        const handler = this;
        const get = function () {
            // invoking the original getter with the original target
            return handler.wrapValue(originalGet.call(unwrap$1(this)));
        };
        getterMap.set(originalGet, get);
        return get;
    }
    wrapSetter(originalSet) {
        const wrappedSetter = setterMap.get(originalSet);
        if (!isUndefined(wrappedSetter)) {
            return wrappedSetter;
        }
        const set = function (v) {
        };
        setterMap.set(originalSet, set);
        return set;
    }
    set(shadowTarget, key, value) {
        /* istanbul ignore next */
        return false;
    }
    deleteProperty(shadowTarget, key) {
        /* istanbul ignore next */
        return false;
    }
    setPrototypeOf(shadowTarget, prototype) {
    }
    preventExtensions(shadowTarget) {
        /* istanbul ignore next */
        return false;
    }
    defineProperty(shadowTarget, key, descriptor) {
        /* istanbul ignore next */
        return false;
    }
}

function defaultValueIsObservable(value) {
    // intentionally checking for null
    if (value === null) {
        return false;
    }
    // treat all non-object types, including undefined, as non-observable values
    if (typeof value !== 'object') {
        return false;
    }
    if (isArray(value)) {
        return true;
    }
    const proto = getPrototypeOf(value);
    return proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null;
}
const defaultValueObserved = (obj, key) => {
    /* do nothing */
};
const defaultValueMutated = (obj, key) => {
    /* do nothing */
};
function createShadowTarget(value) {
    return isArray(value) ? [] : {};
}
class ObservableMembrane {
    constructor(options = {}) {
        this.readOnlyObjectGraph = new WeakMap();
        this.reactiveObjectGraph = new WeakMap();
        const { valueMutated, valueObserved, valueIsObservable, tagPropertyKey } = options;
        this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
        this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
        this.valueIsObservable = isFunction(valueIsObservable)
            ? valueIsObservable
            : defaultValueIsObservable;
        this.tagPropertyKey = tagPropertyKey;
    }
    getProxy(value) {
        const unwrappedValue = unwrap$1(value);
        if (this.valueIsObservable(unwrappedValue)) {
            // When trying to extract the writable version of a readonly we return the readonly.
            if (this.readOnlyObjectGraph.get(unwrappedValue) === value) {
                return value;
            }
            return this.getReactiveHandler(unwrappedValue);
        }
        return unwrappedValue;
    }
    getReadOnlyProxy(value) {
        value = unwrap$1(value);
        if (this.valueIsObservable(value)) {
            return this.getReadOnlyHandler(value);
        }
        return value;
    }
    unwrapProxy(p) {
        return unwrap$1(p);
    }
    getReactiveHandler(value) {
        let proxy = this.reactiveObjectGraph.get(value);
        if (isUndefined(proxy)) {
            // caching the proxy after the first time it is accessed
            const handler = new ReactiveProxyHandler(this, value);
            proxy = new Proxy(createShadowTarget(value), handler);
            registerProxy(proxy, value);
            this.reactiveObjectGraph.set(value, proxy);
        }
        return proxy;
    }
    getReadOnlyHandler(value) {
        let proxy = this.readOnlyObjectGraph.get(value);
        if (isUndefined(proxy)) {
            // caching the proxy after the first time it is accessed
            const handler = new ReadOnlyHandler(this, value);
            proxy = new Proxy(createShadowTarget(value), handler);
            registerProxy(proxy, value);
            this.readOnlyObjectGraph.set(value, proxy);
        }
        return proxy;
    }
}
/** version: 2.0.0 */

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const lockerLivePropertyKey = Symbol.for('@@lockerLiveValue');
const reactiveMembrane = new ObservableMembrane({
    valueObserved,
    valueMutated,
    tagPropertyKey: lockerLivePropertyKey,
});
function getReadOnlyProxy(value) {
    // We must return a frozen wrapper around the value, so that child components cannot mutate properties passed to
    // them from their parents. This applies to both the client and server.
    return reactiveMembrane.getReadOnlyProxy(value);
}
function getReactiveProxy(value) {
    // On the server side, we don't need mutation tracking. Skipping it improves performance.
    return reactiveMembrane.getProxy(value) ;
}
// Making the component instance a live value when using Locker to support expandos.
function markLockerLiveObject(obj) {
    // On the server side, we don't need mutation tracking. Skipping it improves performance.
    {
        obj[lockerLivePropertyKey] = undefined;
    }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This module is responsible for producing the ComponentDef object that is always
 * accessible via `vm.def`. This is lazily created during the creation of the first
 * instance of a component class, and shared across all instances.
 *
 * This structure can be used to synthetically create proxies, and understand the
 * shape of a component. It is also used internally to apply extra optimizations.
 */
/**
 * This operation is called with a descriptor of an standard html property
 * that a Custom Element can support (including AOM properties), which
 * determines what kind of capabilities the Base Lightning Element should support. When producing the new descriptors
 * for the Base Lightning Element, it also include the reactivity bit, so the standard property is reactive.
 * @param propName
 * @param descriptor
 */
function createBridgeToElementDescriptor(propName, descriptor) {
    const { get, set, enumerable, configurable } = descriptor;
    if (!isFunction$1(get)) {
        throw new TypeError(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard getter.`);
    }
    if (!isFunction$1(set)) {
        throw new TypeError(`Detected invalid public property descriptor for HTMLElement.prototype.${propName} definition. Missing the standard setter.`);
    }
    return {
        enumerable,
        configurable,
        get() {
            const vm = getAssociatedVM(this);
            if (isBeingConstructed(vm)) {
                return;
            }
            componentValueObserved(vm, propName);
            return get.call(vm.elm);
        },
        set(newValue) {
            const vm = getAssociatedVM(this);
            updateComponentValue(vm, propName, newValue);
            return set.call(vm.elm, newValue);
        },
    };
}
const refsCache = new WeakMap();
/**
 * This class is the base class for any LWC element.
 * Some elements directly extends this class, others implement it via inheritance.
 */
// @ts-expect-error When exported, it will conform, but we need to build it first!
const LightningElement = function () {
    // This should be as performant as possible, while any initialization should be done lazily
    if (isNull(vmBeingConstructed)) {
        // Thrown when doing something like `new LightningElement()` or
        // `class Foo extends LightningElement {}; new Foo()`
        throw new TypeError('Illegal constructor');
    }
    // This is a no-op unless Lightning DevTools are enabled.
    instrumentInstance(this, vmBeingConstructed);
    const vm = vmBeingConstructed;
    const { def, elm } = vm;
    const { bridge } = def;
    setPrototypeOf(elm, bridge.prototype);
    vm.component = this;
    // Locker hooks assignment. When the LWC engine run with Locker, Locker intercepts all the new
    // component creation and passes hooks to instrument all the component interactions with the
    // engine. We are intentionally hiding this argument from the formal API of LightningElement
    // because we don't want folks to know about it just yet.
    if (arguments.length === 1) {
        const { callHook, setHook, getHook } = arguments[0];
        vm.callHook = callHook;
        vm.setHook = setHook;
        vm.getHook = getHook;
    }
    markLockerLiveObject(this);
    // Linking elm, shadow root and component with the VM.
    associateVM(this, vm);
    associateVM(elm, vm);
    if (vm.renderMode === 1 /* RenderMode.Shadow */) {
        vm.renderRoot = doAttachShadow(vm);
    }
    else {
        vm.renderRoot = elm;
    }
    return this;
};
function doAttachShadow(vm) {
    const { elm, mode, shadowMode, def: { ctor }, renderer: { attachShadow }, } = vm;
    const shadowRoot = attachShadow(elm, {
        [KEY__SYNTHETIC_MODE]: shadowMode === 1 /* ShadowMode.Synthetic */,
        delegatesFocus: Boolean(ctor.delegatesFocus),
        mode,
    });
    vm.shadowRoot = shadowRoot;
    associateVM(shadowRoot, vm);
    return shadowRoot;
}
// Type assertion because we need to build the prototype before it satisfies the interface.
LightningElement.prototype = {
    constructor: LightningElement,
    dispatchEvent(event) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { dispatchEvent }, } = vm;
        return dispatchEvent(elm, event);
    },
    addEventListener(type, listener, options) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { addEventListener }, } = vm;
        const wrappedListener = getWrappedComponentsListener(vm, listener);
        addEventListener(elm, type, wrappedListener, options);
    },
    removeEventListener(type, listener, options) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { removeEventListener }, } = vm;
        const wrappedListener = getWrappedComponentsListener(vm, listener);
        removeEventListener(elm, type, wrappedListener, options);
    },
    hasAttribute(name) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { getAttribute }, } = vm;
        return !isNull(getAttribute(elm, name));
    },
    hasAttributeNS(namespace, name) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { getAttribute }, } = vm;
        return !isNull(getAttribute(elm, name, namespace));
    },
    removeAttribute(name) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { removeAttribute }, } = vm;
        removeAttribute(elm, name);
    },
    removeAttributeNS(namespace, name) {
        const { elm, renderer: { removeAttribute }, } = getAssociatedVM(this);
        removeAttribute(elm, name, namespace);
    },
    getAttribute(name) {
        const vm = getAssociatedVM(this);
        const { elm } = vm;
        const { getAttribute } = vm.renderer;
        return getAttribute(elm, name);
    },
    getAttributeNS(namespace, name) {
        const vm = getAssociatedVM(this);
        const { elm } = vm;
        const { getAttribute } = vm.renderer;
        return getAttribute(elm, name, namespace);
    },
    setAttribute(name, value) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { setAttribute }, } = vm;
        setAttribute(elm, name, value);
    },
    setAttributeNS(namespace, name, value) {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { setAttribute }, } = vm;
        setAttribute(elm, name, value, namespace);
    },
    getBoundingClientRect() {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { getBoundingClientRect }, } = vm;
        return getBoundingClientRect(elm);
    },
    attachInternals() {
        const vm = getAssociatedVM(this);
        const { def: { ctor }, elm, apiVersion, renderer: { attachInternals }, } = vm;
        if (!isAPIFeatureEnabled(7 /* APIFeature.ENABLE_ELEMENT_INTERNALS_AND_FACE */, apiVersion)) {
            throw new Error(`The attachInternals API is only supported in API version 61 and above. ` +
                `The current version is ${apiVersion}. ` +
                `To use this API, update the LWC component API version. https://lwc.dev/guide/versioning`);
        }
        const internals = attachInternals(elm);
        if (vm.shadowMode === 1 /* ShadowMode.Synthetic */ && supportsSyntheticElementInternals(ctor)) {
            const handler = {
                get(target, prop) {
                    if (prop === 'shadowRoot') {
                        return vm.shadowRoot;
                    }
                    const value = Reflect.get(target, prop);
                    if (typeof value === 'function') {
                        return value.bind(target);
                    }
                    return value;
                },
                set(target, prop, value) {
                    return Reflect.set(target, prop, value);
                },
            };
            return new Proxy(internals, handler);
        }
        else if (vm.shadowMode === 1 /* ShadowMode.Synthetic */) {
            throw new Error('attachInternals API is not supported in synthetic shadow.');
        }
        return internals;
    },
    get isConnected() {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { isConnected }, } = vm;
        return isConnected(elm);
    },
    get classList() {
        const vm = getAssociatedVM(this);
        const { elm, renderer: { getClassList }, } = vm;
        return getClassList(elm);
    },
    get template() {
        const vm = getAssociatedVM(this);
        return vm.shadowRoot;
    },
    get hostElement() {
        const vm = getAssociatedVM(this);
        const apiVersion = getComponentAPIVersion(vm.def.ctor);
        if (!isAPIFeatureEnabled(8 /* APIFeature.ENABLE_THIS_DOT_HOST_ELEMENT */, apiVersion)) {
            // Simulate the old behavior for `this.hostElement` to avoid a breaking change
            return undefined;
        }
        return vm.elm;
    },
    get refs() {
        const vm = getAssociatedVM(this);
        if (isUpdatingTemplate) {
            // If the template is in the process of being updated, then we don't want to go through the normal
            // process of returning the refs and caching them, because the state of the refs is unstable.
            // This can happen if e.g. a template contains `<div class={foo}></div>` and `foo` is computed
            // based on `this.refs.bar`.
            return;
        }
        const { refVNodes, cmpTemplate } = vm;
        // For backwards compatibility with component written before template refs
        // were introduced, we return undefined if the template has no refs defined
        // anywhere. This fixes components that may want to add an expando called `refs`
        // and are checking if it exists with `if (this.refs)`  before adding it.
        // Note we use a null refVNodes to indicate that the template has no refs defined.
        if (isNull(refVNodes)) {
            return;
        }
        // The refNodes can be cached based on the refVNodes, since the refVNodes
        // are recreated from scratch every time the template is rendered.
        // This happens with `vm.refVNodes = null` in `template.ts` in `@lwc/engine-core`.
        let refs = refsCache.get(refVNodes);
        if (isUndefined$1(refs)) {
            refs = create(null);
            for (const key of keys(refVNodes)) {
                refs[key] = refVNodes[key].elm;
            }
            freeze(refs);
            refsCache.set(refVNodes, refs);
        }
        return refs;
    },
    // For backwards compat, we allow component authors to set `refs` as an expando
    set refs(value) {
        defineProperty(this, 'refs', {
            configurable: true,
            enumerable: true,
            writable: true,
            value,
        });
    },
    get shadowRoot() {
        // From within the component instance, the shadowRoot is always reported as "closed".
        // Authors should rely on this.template instead.
        return null;
    },
    get children() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        return renderer.getChildren(vm.elm);
    },
    get childNodes() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        // getChildNodes returns a NodeList, which has `item(index: number): Node | null`.
        // NodeListOf<T> extends NodeList, but claims to not return null. That seems inaccurate,
        // but these are built-in types, so ultimately not our problem.
        return renderer.getChildNodes(vm.elm);
    },
    get firstChild() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        return renderer.getFirstChild(vm.elm);
    },
    get firstElementChild() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        return renderer.getFirstElementChild(vm.elm);
    },
    get lastChild() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        return renderer.getLastChild(vm.elm);
    },
    get lastElementChild() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        return renderer.getLastElementChild(vm.elm);
    },
    get ownerDocument() {
        const vm = getAssociatedVM(this);
        const renderer = vm.renderer;
        return renderer.ownerDocument(vm.elm);
    },
    get tagName() {
        const { elm, renderer } = getAssociatedVM(this);
        return renderer.getTagName(elm);
    },
    get style() {
        const { elm, renderer, def } = getAssociatedVM(this);
        const apiVersion = getComponentAPIVersion(def.ctor);
        if (!isAPIFeatureEnabled(9 /* APIFeature.ENABLE_THIS_DOT_STYLE */, apiVersion)) {
            // Simulate the old behavior for `this.style` to avoid a breaking change
            return undefined;
        }
        return renderer.getStyle(elm);
    },
    render() {
        const vm = getAssociatedVM(this);
        return vm.def.template;
    },
    toString() {
        const vm = getAssociatedVM(this);
        return `[object ${vm.def.name}]`;
    },
};
const queryAndChildGetterDescriptors = create(null);
const queryMethods = [
    'getElementsByClassName',
    'getElementsByTagName',
    'querySelector',
    'querySelectorAll',
];
// Generic passthrough for query APIs on HTMLElement to the relevant Renderer APIs
for (const queryMethod of queryMethods) {
    queryAndChildGetterDescriptors[queryMethod] = {
        value(arg) {
            const vm = getAssociatedVM(this);
            const { elm, renderer } = vm;
            return renderer[queryMethod](elm, arg);
        },
        configurable: true,
        enumerable: true,
        writable: true,
    };
}
defineProperties(LightningElement.prototype, queryAndChildGetterDescriptors);
const lightningBasedDescriptors = create(null);
for (const propName in HTMLElementOriginalDescriptors) {
    lightningBasedDescriptors[propName] = createBridgeToElementDescriptor(propName, HTMLElementOriginalDescriptors[propName]);
}
// Apply ARIA reflection to LightningElement.prototype, on both the browser and server.
// This allows `this.aria*` property accessors to work from inside a component, and to reflect `aria-*` attrs.
// Note this works regardless of whether the global ARIA reflection polyfill is applied or not.
{
    // In the browser, we use createBridgeToElementDescriptor, so we can get the normal reactivity lifecycle for
    // aria* properties
    for (const [propName, descriptor] of entries(ariaReflectionPolyfillDescriptors)) {
        lightningBasedDescriptors[propName] = createBridgeToElementDescriptor(propName, descriptor);
    }
}
defineProperties(LightningElement.prototype, lightningBasedDescriptors);
defineProperty(LightningElement, 'CustomElementConstructor', {
    get() {
        // If required, a runtime-specific implementation must be defined.
        throw new ReferenceError('The current runtime does not support CustomElementConstructor.');
    },
    configurable: true,
});

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function createObservedFieldPropertyDescriptor(key) {
    return {
        get() {
            const vm = getAssociatedVM(this);
            const val = vm.cmpFields[key];
            componentValueObserved(vm, key, val);
            return val;
        },
        set(newValue) {
            const vm = getAssociatedVM(this);
            updateComponentValue(vm, key, newValue);
        },
        enumerable: true,
        configurable: true,
    };
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const AdapterToTokenMap = new Map();
function createContextWatcher(vm, wireDef, callbackWhenContextIsReady) {
    const { adapter } = wireDef;
    const adapterContextToken = AdapterToTokenMap.get(adapter);
    if (isUndefined$1(adapterContextToken)) {
        return; // no provider found, nothing to be done
    }
    const { elm, context: { wiredConnecting, wiredDisconnecting }, renderer: { registerContextConsumer }, } = vm;
    // waiting for the component to be connected to formally request the context via the token
    ArrayPush$1.call(wiredConnecting, () => {
        // This will attempt to connect the current element with one of its anscestors
        // that can provide context for the given wire adapter. This relationship is
        // keyed on the secret & internal value of `adapterContextToken`, which is unique
        // to a given wire adapter.
        //
        // Depending on the runtime environment, this connection is made using either DOM
        // events (in the browser) or a custom traversal (on the server).
        registerContextConsumer(elm, adapterContextToken, {
            setNewContext(newContext) {
                // eslint-disable-next-line @lwc/lwc-internal/no-invalid-todo
                // TODO: dev-mode validation of config based on the adapter.contextSchema
                callbackWhenContextIsReady(newContext);
                // Return true as the context is always consumed here and the consumer should
                // stop bubbling.
                return true;
            },
            setDisconnectedCallback(disconnectCallback) {
                // adds this callback into the disconnect bucket so it gets disconnected from parent
                // the the element hosting the wire is disconnected
                ArrayPush$1.call(wiredDisconnecting, disconnectCallback);
            },
        });
    });
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const DeprecatedWiredElementHost = '$$DeprecatedWiredElementHostKey$$';
const DeprecatedWiredParamsMeta = '$$DeprecatedWiredParamsMetaKey$$';
const WireMetaMap = new Map();
function createFieldDataCallback(vm, name) {
    return (value) => {
        updateComponentValue(vm, name, value);
    };
}
function createMethodDataCallback(vm, method) {
    return (value) => {
        // dispatching new value into the wired method
        runWithBoundaryProtection(vm, vm.owner, noop, () => {
            // job
            method.call(vm.component, value);
        }, noop);
    };
}
function createConfigWatcher(component, configCallback, callbackWhenConfigIsReady) {
    let hasPendingConfig = false;
    // creating the reactive observer for reactive params when needed
    const ro = createReactiveObserver(() => {
        if (hasPendingConfig === false) {
            hasPendingConfig = true;
            // collect new config in the micro-task
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.resolve().then(() => {
                hasPendingConfig = false;
                // resetting current reactive params
                ro.reset();
                // dispatching a new config due to a change in the configuration
                computeConfigAndUpdate();
            });
        }
    });
    const computeConfigAndUpdate = () => {
        let config;
        ro.observe(() => (config = configCallback(component)));
        // eslint-disable-next-line @lwc/lwc-internal/no-invalid-todo
        // TODO: dev-mode validation of config based on the adapter.configSchema
        // @ts-expect-error it is assigned in the observe() callback
        callbackWhenConfigIsReady(config);
    };
    return {
        computeConfigAndUpdate,
        ro,
    };
}
function createConnector(vm, name, wireDef) {
    const { method, adapter, configCallback, dynamic } = wireDef;
    let debugInfo;
    const fieldOrMethodCallback = isUndefined$1(method)
        ? createFieldDataCallback(vm, name)
        : createMethodDataCallback(vm, method);
    const dataCallback = (value) => {
        fieldOrMethodCallback(value);
    };
    let context;
    let connector;
    // Workaround to pass the component element associated to this wire adapter instance.
    defineProperty(dataCallback, DeprecatedWiredElementHost, {
        value: vm.elm,
    });
    defineProperty(dataCallback, DeprecatedWiredParamsMeta, {
        value: dynamic,
    });
    runWithBoundaryProtection(vm, vm, noop, () => {
        // job
        connector = new adapter(dataCallback, { tagName: vm.tagName });
    }, noop);
    const updateConnectorConfig = (config) => {
        // every time the config is recomputed due to tracking,
        // this callback will be invoked with the new computed config
        runWithBoundaryProtection(vm, vm, noop, () => {
            // job
            if ("production" !== 'production') ;
            connector.update(config, context);
        }, noop);
    };
    // Computes the current wire config and calls the update method on the wire adapter.
    // If it has params, we will need to observe changes in the next tick.
    const { computeConfigAndUpdate, ro } = createConfigWatcher(vm.component, configCallback, updateConnectorConfig);
    // if the adapter needs contextualization, we need to watch for new context and push it alongside the config
    if (!isUndefined$1(adapter.contextSchema)) {
        createContextWatcher(vm, wireDef, (newContext) => {
            // every time the context is pushed into this component,
            // this callback will be invoked with the new computed context
            if (context !== newContext) {
                context = newContext;
                // Note: when new context arrives, the config will be recomputed and pushed along side the new
                // context, this is to preserve the identity characteristics, config should not have identity
                // (ever), while context can have identity
                if (vm.state === 1 /* VMState.connected */) {
                    computeConfigAndUpdate();
                }
            }
        });
    }
    return {
        // @ts-expect-error the boundary protection executes sync, connector is always defined
        connector,
        computeConfigAndUpdate,
        resetConfigWatcher: () => ro.reset(),
    };
}
function storeWiredMethodMeta(descriptor, adapter, configCallback, dynamic) {
    // support for callable adapters
    if (adapter.adapter) {
        adapter = adapter.adapter;
    }
    const method = descriptor.value;
    const def = {
        adapter,
        method,
        configCallback,
        dynamic,
    };
    WireMetaMap.set(descriptor, def);
}
function storeWiredFieldMeta(descriptor, adapter, configCallback, dynamic) {
    // support for callable adapters
    if (adapter.adapter) {
        adapter = adapter.adapter;
    }
    const def = {
        adapter,
        configCallback,
        dynamic,
    };
    WireMetaMap.set(descriptor, def);
}
function installWireAdapters(vm) {
    const { context, def: { wire }, } = vm;
    const wiredConnecting = (context.wiredConnecting = []);
    const wiredDisconnecting = (context.wiredDisconnecting =
        []);
    for (const fieldNameOrMethod in wire) {
        const descriptor = wire[fieldNameOrMethod];
        const wireDef = WireMetaMap.get(descriptor);
        if (!isUndefined$1(wireDef)) {
            const { connector, computeConfigAndUpdate, resetConfigWatcher } = createConnector(vm, fieldNameOrMethod, wireDef);
            const hasDynamicParams = wireDef.dynamic.length > 0;
            ArrayPush$1.call(wiredConnecting, () => {
                connector.connect();
                if (!lwcRuntimeFlags.ENABLE_WIRE_SYNC_EMIT) {
                    if (hasDynamicParams) {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        Promise.resolve().then(computeConfigAndUpdate);
                        return;
                    }
                }
                computeConfigAndUpdate();
            });
            ArrayPush$1.call(wiredDisconnecting, () => {
                connector.disconnect();
                resetConfigWatcher();
            });
        }
    }
}
function connectWireAdapters(vm) {
    const { wiredConnecting } = vm.context;
    for (let i = 0, len = wiredConnecting.length; i < len; i += 1) {
        wiredConnecting[i]();
    }
}
function disconnectWireAdapters(vm) {
    const { wiredDisconnecting } = vm.context;
    runWithBoundaryProtection(vm, vm, noop, () => {
        // job
        for (let i = 0, len = wiredDisconnecting.length; i < len; i += 1) {
            wiredDisconnecting[i]();
        }
    }, noop);
}
function createPublicPropertyDescriptor(key) {
    return {
        get() {
            const vm = getAssociatedVM(this);
            if (isBeingConstructed(vm)) {
                return;
            }
            const val = vm.cmpProps[key];
            componentValueObserved(vm, key, val);
            return val;
        },
        set(newValue) {
            const vm = getAssociatedVM(this);
            vm.cmpProps[key] = newValue;
            componentValueMutated(vm, key);
        },
        enumerable: true,
        configurable: true,
    };
}
function createPublicAccessorDescriptor(key, descriptor) {
    const { get, set, enumerable, configurable } = descriptor;
    assert.invariant(isFunction$1(get), `Invalid public accessor ${toString(key)} decorated with @api. The property is missing a getter.`);
    return {
        get() {
            return get.call(this);
        },
        set(newValue) {
            getAssociatedVM(this);
            if (set) {
                set.call(this, newValue);
            }
        },
        enumerable,
        configurable,
    };
}
function internalTrackDecorator(key) {
    return {
        get() {
            const vm = getAssociatedVM(this);
            const val = vm.cmpFields[key];
            componentValueObserved(vm, key, val);
            return val;
        },
        set(newValue) {
            const vm = getAssociatedVM(this);
            const reactiveOrAnyValue = getReactiveProxy(newValue);
            updateComponentValue(vm, key, reactiveOrAnyValue);
        },
        enumerable: true,
        configurable: true,
    };
}
function internalWireFieldDecorator(key) {
    return {
        get() {
            const vm = getAssociatedVM(this);
            componentValueObserved(vm, key);
            return vm.cmpFields[key];
        },
        set(value) {
            const vm = getAssociatedVM(this);
            /**
             * Reactivity for wired fields is provided in wiring.
             * We intentionally add reactivity here since this is just
             * letting the author to do the wrong thing, but it will keep our
             * system to be backward compatible.
             */
            updateComponentValue(vm, key, value);
        },
        enumerable: true,
        configurable: true,
    };
}
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by user-land code.
 * @param Ctor
 * @param meta
 */
function registerDecorators(Ctor, meta) {
    const proto = Ctor.prototype;
    const { publicProps, publicMethods, wire, track, fields } = meta;
    const apiMethods = create(null);
    const apiFields = create(null);
    const wiredMethods = create(null);
    const wiredFields = create(null);
    const observedFields = create(null);
    const apiFieldsConfig = create(null);
    let descriptor;
    if (!isUndefined$1(publicProps)) {
        for (const fieldName in publicProps) {
            const propConfig = publicProps[fieldName];
            apiFieldsConfig[fieldName] = propConfig.config;
            descriptor = getOwnPropertyDescriptor$1(proto, fieldName);
            if (propConfig.config > 0) {
                if (isUndefined$1(descriptor)) {
                    // TODO [#3441]: This line of code does not seem possible to reach.
                    throw new Error();
                }
                descriptor = createPublicAccessorDescriptor(fieldName, descriptor);
            }
            else {
                // [W-9927596] If a component has both a public property and a private setter/getter
                // with the same name, the property is defined as a public accessor. This branch is
                // only here for backward compatibility reasons.
                if (!isUndefined$1(descriptor) && !isUndefined$1(descriptor.get)) {
                    descriptor = createPublicAccessorDescriptor(fieldName, descriptor);
                }
                else {
                    descriptor = createPublicPropertyDescriptor(fieldName);
                }
            }
            apiFields[fieldName] = descriptor;
            defineProperty(proto, fieldName, descriptor);
        }
    }
    if (!isUndefined$1(publicMethods)) {
        forEach.call(publicMethods, (methodName) => {
            descriptor = getOwnPropertyDescriptor$1(proto, methodName);
            if (isUndefined$1(descriptor)) {
                throw new Error();
            }
            apiMethods[methodName] = descriptor;
        });
    }
    if (!isUndefined$1(wire)) {
        for (const fieldOrMethodName in wire) {
            const { adapter, method, config: configCallback, dynamic = [], } = wire[fieldOrMethodName];
            descriptor = getOwnPropertyDescriptor$1(proto, fieldOrMethodName);
            if (method === 1) {
                if (isUndefined$1(descriptor)) {
                    throw new Error(`Missing descriptor for wired method "${fieldOrMethodName}".`);
                }
                wiredMethods[fieldOrMethodName] = descriptor;
                storeWiredMethodMeta(descriptor, adapter, configCallback, dynamic);
            }
            else {
                descriptor = internalWireFieldDecorator(fieldOrMethodName);
                wiredFields[fieldOrMethodName] = descriptor;
                storeWiredFieldMeta(descriptor, adapter, configCallback, dynamic);
                defineProperty(proto, fieldOrMethodName, descriptor);
            }
        }
    }
    if (!isUndefined$1(track)) {
        for (const fieldName in track) {
            descriptor = getOwnPropertyDescriptor$1(proto, fieldName);
            descriptor = internalTrackDecorator(fieldName);
            defineProperty(proto, fieldName, descriptor);
        }
    }
    if (!isUndefined$1(fields)) {
        for (let i = 0, n = fields.length; i < n; i++) {
            const fieldName = fields[i];
            descriptor = getOwnPropertyDescriptor$1(proto, fieldName);
            // [W-9927596] Only mark a field as observed whenever it isn't a duplicated public nor
            // tracked property. This is only here for backward compatibility purposes.
            const isDuplicatePublicProp = !isUndefined$1(publicProps) && fieldName in publicProps;
            const isDuplicateTrackedProp = !isUndefined$1(track) && fieldName in track;
            if (!isDuplicatePublicProp && !isDuplicateTrackedProp) {
                observedFields[fieldName] = createObservedFieldPropertyDescriptor(fieldName);
            }
        }
    }
    setDecoratorsMeta(Ctor, {
        apiMethods,
        apiFields,
        apiFieldsConfig,
        wiredMethods,
        wiredFields,
        observedFields,
    });
    return Ctor;
}
const signedDecoratorToMetaMap = new Map();
function setDecoratorsMeta(Ctor, meta) {
    signedDecoratorToMetaMap.set(Ctor, meta);
}
const defaultMeta = {
    apiMethods: EmptyObject,
    apiFields: EmptyObject,
    apiFieldsConfig: EmptyObject,
    wiredMethods: EmptyObject,
    wiredFields: EmptyObject,
    observedFields: EmptyObject,
};
function getDecoratorsMeta(Ctor) {
    const meta = signedDecoratorToMetaMap.get(Ctor);
    return isUndefined$1(meta) ? defaultMeta : meta;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const signedTemplateSet = new Set();
function defaultEmptyTemplate() {
    return [];
}
signedTemplateSet.add(defaultEmptyTemplate);
function isTemplateRegistered(tpl) {
    return signedTemplateSet.has(tpl);
}
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 * @param tpl
 */
function registerTemplate(tpl) {
    signedTemplateSet.add(tpl);
    // chaining this method as a way to wrap existing
    // assignment of templates easily, without too much transformation
    return tpl;
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This module is responsible for creating the base bridge class BaseBridgeElement
 * that represents the HTMLElement extension used for any LWC inserted in the DOM.
 */
// A bridge descriptor is a descriptor whose job is just to get the component instance
// from the element instance, and get the value or set a new value on the component.
// This means that across different elements, similar names can get the exact same
// descriptor, so we can cache them:
const cachedGetterByKey = create(null);
const cachedSetterByKey = create(null);
// Because bridge descriptors are cached by member name and shared across every component's bridge
// element, a descriptor captured from one component can be re-invoked against an unrelated component
// (e.g. `donorDescriptor.get.call(otherHost)`). The cached accessor recovers the component VM from
// the invocation receiver (`this`), so without this guard it would forward the call to whatever
// like-named member exists on the other component — including a *private* one that the other
// component never exposed publicly. `vm.def.props`/`vm.def.methods` are the authoritative sets of
// members the bridge is allowed to expose for that component, so we verify the member is present
// there before forwarding. See W-23641816.
function assertPublicBridgeMember(vm, memberMap, memberName) {
    if (lwcRuntimeFlags.DISABLE_BRIDGE_ELEMENT_PROPERTY_GUARD) {
        return;
    }
    if (!hasOwnProperty$1.call(memberMap, memberName)) {
        throw new TypeError(`Invalid attempt to access "${memberName}" on <${vm.def.name}>. This member is not a public property or method of the component.`);
    }
}
function createGetter(key) {
    let fn = cachedGetterByKey[key];
    if (isUndefined$1(fn)) {
        fn = cachedGetterByKey[key] = function () {
            const vm = getAssociatedVM(this);
            assertPublicBridgeMember(vm, vm.def.props, key);
            const { getHook } = vm;
            return getHook(vm.component, key);
        };
    }
    return fn;
}
function createSetter(key) {
    let fn = cachedSetterByKey[key];
    if (isUndefined$1(fn)) {
        fn = cachedSetterByKey[key] = function (newValue) {
            const vm = getAssociatedVM(this);
            assertPublicBridgeMember(vm, vm.def.props, key);
            const { setHook } = vm;
            newValue = getReadOnlyProxy(newValue);
            setHook(vm.component, key, newValue);
        };
    }
    return fn;
}
function createMethodCaller(methodName) {
    return function () {
        const vm = getAssociatedVM(this);
        assertPublicBridgeMember(vm, vm.def.methods, methodName);
        const { callHook, component } = vm;
        const fn = component[methodName];
        return callHook(vm.component, fn, ArraySlice.call(arguments));
    };
}
function createAttributeChangedCallback(attributeToPropMap, superAttributeChangedCallback) {
    return function attributeChangedCallback(attrName, oldValue, newValue) {
        // W-17420330 & W-23590585
        if (this instanceof BaseBridgeElement ||
            lwcRuntimeFlags.ENABLE_LEGACY_ATTRIBUTE_CHANGED_CALLBACK) {
            if (oldValue === newValue) {
                // Ignore same values.
                return;
            }
            const propName = attributeToPropMap[attrName];
            if (isUndefined$1(propName)) {
                if (!isUndefined$1(superAttributeChangedCallback)) {
                    // delegate unknown attributes to the super.
                    // Typescript does not like it when you treat the `arguments` object as an array
                    // @ts-expect-error type-mismatch
                    superAttributeChangedCallback.apply(this, arguments);
                }
                return;
            }
            // Reflect attribute change to the corresponding property when changed from outside.
            this[propName] = newValue;
        }
    };
}
function HTMLBridgeElementFactory(SuperClass, publicProperties, methods, observedFields, proto, hasCustomSuperClass) {
    const HTMLBridgeElement = class extends SuperClass {
    };
    // generating the hash table for attributes to avoid duplicate fields and facilitate validation
    // and false positives in case of inheritance.
    const attributeToPropMap = create(null);
    const { attributeChangedCallback: superAttributeChangedCallback } = SuperClass.prototype;
    const { observedAttributes: superObservedAttributes = [] } = SuperClass;
    const descriptors = create(null);
    // expose getters and setters for each public props on the new Element Bridge
    for (let i = 0, len = publicProperties.length; i < len; i += 1) {
        const propName = publicProperties[i];
        attributeToPropMap[htmlPropertyToAttribute(propName)] = propName;
        descriptors[propName] = {
            get: createGetter(propName),
            set: createSetter(propName),
            enumerable: true,
            configurable: true,
        };
    }
    // expose public methods as props on the new Element Bridge
    for (let i = 0, len = methods.length; i < len; i += 1) {
        const methodName = methods[i];
        descriptors[methodName] = {
            value: createMethodCaller(methodName),
            writable: true,
            configurable: true,
        };
    }
    // creating a new attributeChangedCallback per bridge because they are bound to the corresponding
    // map of attributes to props. We do this after all other props and methods to avoid the possibility
    // of getting overrule by a class declaration in user-land, and we make it non-writable, non-configurable
    // to preserve this definition.
    descriptors.attributeChangedCallback = {
        value: createAttributeChangedCallback(attributeToPropMap, superAttributeChangedCallback),
    };
    // To avoid leaking private component details, accessing internals from outside a component is not allowed.
    descriptors.attachInternals = {
        set() {
        },
        get() {
        },
    };
    descriptors.formAssociated = {
        set() {
        },
        get() {
        },
    };
    // Specify attributes for which we want to reflect changes back to their corresponding
    // properties via attributeChangedCallback.
    defineProperty(HTMLBridgeElement, 'observedAttributes', {
        get() {
            return [...superObservedAttributes, ...keys(attributeToPropMap)];
        },
    });
    defineProperties(HTMLBridgeElement.prototype, descriptors);
    return HTMLBridgeElement;
}
// We do some special handling of non-standard ARIA props like ariaLabelledBy as well as props without (as of this
// writing) broad cross-browser support like ariaBrailleLabel. This is so the reflection works correctly and preserves
// backwards compatibility with the previous global polyfill approach.
//
// The goal here is to expose `elm.aria*` property accessors to work from outside a component, and to reflect `aria-*`
// attrs. This is especially important because the template compiler compiles aria-* attrs on components to aria* props.
// Note this works regardless of whether the global ARIA reflection polyfill is applied or not.
//
// Also note this ARIA reflection only really makes sense in the browser. On the server, there is no
// `renderedCallback()`, so you cannot do e.g. `this.template.querySelector('x-child').ariaBusy = 'true'`. So we don't
// need to expose ARIA props outside the LightningElement
const basePublicProperties = [
    ...getOwnPropertyNames$1(HTMLElementOriginalDescriptors),
    ...(getOwnPropertyNames$1(ariaReflectionPolyfillDescriptors) ),
];
const BaseBridgeElement = HTMLBridgeElementFactory(HTMLElementConstructor, basePublicProperties, []);
freeze(BaseBridgeElement);
seal(BaseBridgeElement.prototype);

/*
 * Copyright (c) 2025, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const VALID_SCOPE_TOKEN_REGEX = /^[a-zA-Z0-9\-_]+$/;
function getOrCreateAbortSignal(cssContent) {
    return undefined;
}
function makeHostToken(token) {
    // Note: if this ever changes, update the `cssScopeTokens` returned by `@lwc/compiler`
    return `${token}-host`;
}
function createInlineStyleVNode(content) {
    return api.h('style', {
        key: 'style', // special key
        attrs: {
            type: 'text/css',
        },
    }, [api.t(content)]);
}
// TODO [#3733]: remove this dead legacy-scope-token plumbing (the ENABLE_LEGACY_SCOPE_TOKENS
// runtime flag has been removed, so the `legacy` argument is now always false).
function updateStylesheetToken(vm, template, legacy) {
    const { elm, context, renderMode, shadowMode, renderer: { getClassList, removeAttribute, setAttribute }, } = vm;
    const { stylesheets: newStylesheets } = template;
    const newStylesheetToken = template.stylesheetToken;
    const { stylesheets: newVmStylesheets } = vm;
    const isSyntheticShadow = renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 1 /* ShadowMode.Synthetic */;
    const { hasScopedStyles } = context;
    let newToken;
    let newHasTokenInClass;
    let newHasTokenInAttribute;
    // Reset the styling token applied to the host element.
    let oldToken;
    let oldHasTokenInClass;
    let oldHasTokenInAttribute;
    {
        oldToken = context.stylesheetToken;
        oldHasTokenInClass = context.hasTokenInClass;
        oldHasTokenInAttribute = context.hasTokenInAttribute;
    }
    if (!isUndefined$1(oldToken)) {
        if (oldHasTokenInClass) {
            getClassList(elm).remove(makeHostToken(oldToken));
        }
        if (oldHasTokenInAttribute) {
            removeAttribute(elm, makeHostToken(oldToken));
        }
    }
    // Apply the new template styling token to the host element, if the new template has any
    // associated stylesheets. In the case of light DOM, also ensure there is at least one scoped stylesheet.
    const hasNewStylesheets = hasStyles(newStylesheets);
    const hasNewVmStylesheets = hasStyles(newVmStylesheets);
    if (hasNewStylesheets || hasNewVmStylesheets) {
        newToken = newStylesheetToken;
    }
    // Set the new styling token on the host element
    if (!isUndefined$1(newToken)) {
        if (hasScopedStyles) {
            const hostScopeTokenClass = makeHostToken(newToken);
            getClassList(elm).add(hostScopeTokenClass);
            newHasTokenInClass = true;
        }
        if (isSyntheticShadow) {
            setAttribute(elm, makeHostToken(newToken), '');
            newHasTokenInAttribute = true;
        }
    }
    // Update the styling tokens present on the context object.
    {
        context.stylesheetToken = newToken;
        context.hasTokenInClass = newHasTokenInClass;
        context.hasTokenInAttribute = newHasTokenInAttribute;
    }
}
function evaluateStylesheetsContent(stylesheets, stylesheetToken, vm) {
    const content = [];
    let root;
    for (let i = 0; i < stylesheets.length; i++) {
        let stylesheet = stylesheets[i];
        if (isArray$1(stylesheet)) {
            ArrayPush$1.apply(content, evaluateStylesheetsContent(stylesheet, stylesheetToken, vm));
        }
        else {
            const isScopedCss = isTrue(stylesheet[KEY__SCOPED_CSS]);
            const isNativeOnlyCss = isTrue(stylesheet[KEY__NATIVE_ONLY_CSS]);
            const { renderMode, shadowMode } = vm;
            if (lwcRuntimeFlags.DISABLE_LIGHT_DOM_UNSCOPED_CSS &&
                !isScopedCss &&
                renderMode === 0 /* RenderMode.Light */) {
                logError('Unscoped CSS is not supported in Light DOM in this environment. Please use scoped CSS ' +
                    '(*.scoped.css) instead of unscoped CSS (*.css). See also: https://sfdc.co/scoped-styles-light-dom');
                continue;
            }
            // Apply the scope token only if the stylesheet itself is scoped, or if we're rendering synthetic shadow.
            const scopeToken = isScopedCss ||
                (shadowMode === 1 /* ShadowMode.Synthetic */ && renderMode === 1 /* RenderMode.Shadow */)
                ? stylesheetToken
                : undefined;
            // Use the actual `:host` selector if we're rendering global CSS for light DOM, or if we're rendering
            // native shadow DOM. Synthetic shadow DOM never uses `:host`.
            const useActualHostSelector = renderMode === 0 /* RenderMode.Light */ ? !isScopedCss : shadowMode === 0 /* ShadowMode.Native */;
            // Use the native :dir() pseudoclass only in native shadow DOM. Otherwise, in synthetic shadow,
            // we use an attribute selector on the host to simulate :dir().
            let useNativeDirPseudoclass;
            if (renderMode === 1 /* RenderMode.Shadow */) {
                useNativeDirPseudoclass = shadowMode === 0 /* ShadowMode.Native */;
            }
            else {
                // Light DOM components should only render `[dir]` if they're inside of a synthetic shadow root.
                // At the top level (root is null) or inside of a native shadow root, they should use `:dir()`.
                if (isUndefined$1(root)) {
                    // Only calculate the root once as necessary
                    root = getNearestShadowComponent(vm);
                }
                useNativeDirPseudoclass = isNull(root) || root.shadowMode === 0 /* ShadowMode.Native */;
            }
            let cssContent;
            if (isNativeOnlyCss &&
                renderMode === 1 /* RenderMode.Shadow */ &&
                shadowMode === 1 /* ShadowMode.Synthetic */) {
                // Native-only (i.e. disableSyntheticShadowSupport) CSS should be ignored entirely
                // in synthetic shadow. It's fine to use in either native shadow or light DOM, but in
                // synthetic shadow it wouldn't be scoped properly and so should be ignored.
                cssContent = '/* ignored native-only CSS */';
            }
            else {
                cssContent = stylesheet(scopeToken, useActualHostSelector, useNativeDirPseudoclass);
            }
            ArrayPush$1.call(content, cssContent);
        }
    }
    return content;
}
function getStylesheetsContent(vm, template) {
    const { stylesheets, stylesheetToken } = template;
    const { stylesheets: vmStylesheets } = vm;
    if (!isUndefined$1(stylesheetToken) && !isValidScopeToken(stylesheetToken)) {
        throw new Error('stylesheet token must be a valid string');
    }
    const hasTemplateStyles = hasStyles(stylesheets);
    const hasVmStyles = hasStyles(vmStylesheets);
    if (hasTemplateStyles) {
        const content = evaluateStylesheetsContent(stylesheets, stylesheetToken, vm);
        if (hasVmStyles) {
            // Slow path – merge the template styles and vm styles
            ArrayPush$1.apply(content, evaluateStylesheetsContent(vmStylesheets, stylesheetToken, vm));
        }
        return content;
    }
    if (hasVmStyles) {
        // No template styles, so return vm styles directly
        return evaluateStylesheetsContent(vmStylesheets, stylesheetToken, vm);
    }
    // Fastest path - no styles, so return an empty array
    return EmptyArray;
}
// It might be worth caching this to avoid doing the lookup repeatedly, but
// perf testing has not shown it to be a huge improvement yet:
// https://github.com/salesforce/lwc/pull/2460#discussion_r691208892
function getNearestShadowComponent(vm) {
    let owner = vm;
    while (!isNull(owner)) {
        if (owner.renderMode === 1 /* RenderMode.Shadow */) {
            return owner;
        }
        owner = owner.owner;
    }
    return owner;
}
/**
 * If the component that is currently being rendered uses scoped styles,
 * this returns the unique token for that scoped stylesheet. Otherwise
 * it returns null.
 * @param owner
 * @param legacy
 */
// TODO [#3733]: remove this dead legacy-scope-token plumbing (the ENABLE_LEGACY_SCOPE_TOKENS
// runtime flag has been removed, so the `legacy` argument is now always false).
function getScopeTokenClass(owner, legacy) {
    const { cmpTemplate, context } = owner;
    return ((context.hasScopedStyles &&
        (cmpTemplate?.stylesheetToken)) ||
        null);
}
function getNearestNativeShadowComponent(vm) {
    const owner = getNearestShadowComponent(vm);
    if (!isNull(owner) && owner.shadowMode === 1 /* ShadowMode.Synthetic */) {
        // Synthetic-within-native is impossible. So if the nearest shadow component is
        // synthetic, we know we won't find a native component if we go any further.
        return null;
    }
    return owner;
}
function createStylesheet(vm, stylesheets) {
    const { renderMode, shadowMode, renderer: { insertStylesheet }, } = vm;
    if (renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 1 /* ShadowMode.Synthetic */) {
        for (let i = 0; i < stylesheets.length; i++) {
            const stylesheet = stylesheets[i];
            insertStylesheet(stylesheet, undefined, getOrCreateAbortSignal());
        }
    }
    else if (vm.hydrated) {
        // Note: We need to ensure that during hydration, the stylesheets method is the same as those in ssr.
        //       This works in the client, because the stylesheets are created, and cached in the VM
        //       the first time the VM renders.
        // native shadow or light DOM, SSR
        return ArrayMap.call(stylesheets, createInlineStyleVNode);
    }
    else {
        // native shadow or light DOM, DOM renderer
        const root = getNearestNativeShadowComponent(vm);
        // null root means a global style
        const target = isNull(root) ? undefined : root.shadowRoot;
        for (let i = 0; i < stylesheets.length; i++) {
            const stylesheet = stylesheets[i];
            insertStylesheet(stylesheet, target, getOrCreateAbortSignal());
        }
    }
    return null;
}
function isValidScopeToken(token) {
    if (!isString(token)) {
        return false;
    }
    // See W-16614556
    return VALID_SCOPE_TOKEN_REGEX.test(token);
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * A map where the keys are weakly held and the values are a Set that are also each weakly held.
 * The goal is to avoid leaking the values, which is what would happen with a WeakMap<K, Set<V>>.
 *
 * Note that this is currently only intended to be used in dev/PRODDEBUG environments.
 *
 * This implementation relies on WeakRefs and FinalizationRegistry.
 * For some background, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef
 */
class WeakMultiMap {
    constructor() {
        this._map = new WeakMap();
        this._registry = new FinalizationRegistry((weakRefs) => {
            // This should be considered an optional cleanup method to remove GC'ed values from their respective arrays.
            // JS VMs are not obligated to call FinalizationRegistry callbacks.
            // Work backwards, removing stale VMs
            for (let i = weakRefs.length - 1; i >= 0; i--) {
                const vm = weakRefs[i].deref();
                if (isUndefined$1(vm)) {
                    ArraySplice.call(weakRefs, i, 1); // remove
                }
            }
        });
    }
    _getWeakRefs(key) {
        let weakRefs = this._map.get(key);
        if (isUndefined$1(weakRefs)) {
            weakRefs = [];
            this._map.set(key, weakRefs);
        }
        return weakRefs;
    }
    get(key) {
        const weakRefs = this._getWeakRefs(key);
        const result = new Set();
        for (const weakRef of weakRefs) {
            const vm = weakRef.deref();
            if (!isUndefined$1(vm)) {
                result.add(vm);
            }
        }
        return result;
    }
    add(key, value) {
        const weakRefs = this._getWeakRefs(key);
        // Skip adding if already present
        for (const weakRef of weakRefs) {
            if (weakRef.deref() === value) {
                return;
            }
        }
        ArrayPush$1.call(weakRefs, new WeakRef(value));
        // It's important here not to leak the second argument, which is the "held value." The FinalizationRegistry
        // effectively creates a strong reference between the first argument (the "target") and the held value. When
        // the target is GC'ed, the callback is called, and then the held value is GC'ed.
        // Putting the key here would mean the key is not GC'ed until the value is GC'ed, which defeats the purpose
        // of the WeakMap. Whereas putting the weakRefs array here is fine, because it doesn't have a strong reference
        // to anything. See also this example:
        // https://gist.github.com/nolanlawson/79a3d36e8e6cc25c5048bb17c1795aea
        this._registry.register(value, weakRefs);
    }
    delete(key) {
        this._map.delete(key);
    }
}
let swappedStyleMap = /*@__PURE__@*/ new WeakMap();
// The important thing here is the weak values – VMs are transient (one per component instance) and should be GC'ed,
// so we don't want to create strong references to them.
// The weak keys are kind of useless, because Templates, LightningElementConstructors, and Stylesheets are
// never GC'ed. But maybe they will be someday, so we may as well use weak keys too.
// The "pure" annotations are so that Rollup knows for sure it can remove these from prod mode
let activeTemplates = /*@__PURE__@*/ new WeakMultiMap();
let activeComponents = 
/*@__PURE__@*/ new WeakMultiMap();
let activeStyles = /*@__PURE__@*/ new WeakMultiMap();
function getStyleOrSwappedStyle(style) {
    assertNotProd(); // this method should never leak to prod
    // TODO [#4154]: shows stale content when swapping content back and forth multiple times
    const visited = new Set();
    while (swappedStyleMap.has(style) && !visited.has(style)) {
        visited.add(style);
        style = swappedStyleMap.get(style);
    }
    return style;
}
function addActiveStylesheets(stylesheets, vm) {
    if (isUndefined$1(stylesheets) || isNull(stylesheets)) {
        // Ignore non-existent stylesheets
        return;
    }
    for (const stylesheet of flattenStylesheets(stylesheets)) {
        // this is necessary because we don't hold the list of styles
        // in the vm, we only hold the selected (already swapped template)
        // but the styles attached to the template might not be the actual
        // active ones, but the swapped versions of those.
        const swappedStylesheet = getStyleOrSwappedStyle(stylesheet);
        // this will allow us to keep track of the stylesheet that are
        // being used by a hot component
        activeStyles.add(swappedStylesheet, vm);
    }
}
function setActiveVM(vm) {
    assertNotProd(); // this method should never leak to prod
    // tracking active component
    const Ctor = vm.def.ctor;
    // this will allow us to keep track of the hot components
    activeComponents.add(Ctor, vm);
    // tracking active template
    const template = vm.cmpTemplate;
    if (!isNull(template)) {
        // this will allow us to keep track of the templates that are
        // being used by a hot component
        activeTemplates.add(template, vm);
        // Tracking active styles from the template or the VM. `template.stylesheets` are implicitly associated
        // (e.g. `foo.css` associated with `foo.html`), whereas `vm.stylesheets` are from `static stylesheets`.
        addActiveStylesheets(template.stylesheets, vm);
        addActiveStylesheets(vm.stylesheets, vm);
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * This module is responsible for producing the ComponentDef object that is always
 * accessible via `vm.def`. This is lazily created during the creation of the first
 * instance of a component class, and shared across all instances.
 *
 * This structure can be used to synthetically create proxies, and understand the
 * shape of a component. It is also used internally to apply extra optimizations.
 */
const CtorToDefMap = new WeakMap();
function getCtorProto(Ctor) {
    let proto = getPrototypeOf$1(Ctor);
    if (isNull(proto)) {
        throw new ReferenceError(`Invalid prototype chain for ${Ctor.name}, you must extend LightningElement.`);
    }
    // covering the cases where the ref is circular in AMD
    if (isCircularModuleDependency(proto)) {
        const p = resolveCircularModuleDependency(proto);
        // escape hatch for Locker and other abstractions to provide their own base class instead
        // of our Base class without having to leak it to user-land. If the circular function returns
        // itself, that's the signal that we have hit the end of the proto chain, which must always
        // be base.
        proto = p === proto ? LightningElement : p;
    }
    return proto;
}
function createComponentDef(Ctor) {
    // Enforce component-level feature flag if provided at compile time
    if (!isComponentFeatureEnabled(Ctor)) {
        const metadata = getComponentMetadata(Ctor);
        const componentName = Ctor.name || metadata?.sel || 'Unknown';
        const componentFeatureFlagPath = metadata?.componentFeatureFlag?.path || 'Unknown';
        throw new Error(`Component ${componentName} is disabled by the feature flag at ${componentFeatureFlagPath}.`);
    }
    const { shadowSupportMode: ctorShadowSupportMode, renderMode: ctorRenderMode, formAssociated: ctorFormAssociated, } = Ctor;
    const decoratorsMeta = getDecoratorsMeta(Ctor);
    const { apiFields, apiFieldsConfig, apiMethods, wiredFields, wiredMethods, observedFields } = decoratorsMeta;
    const proto = Ctor.prototype;
    let { connectedCallback, disconnectedCallback, renderedCallback, errorCallback, formAssociatedCallback, formResetCallback, formDisabledCallback, formStateRestoreCallback, render, } = proto;
    const superProto = getCtorProto(Ctor);
    const hasCustomSuperClass = superProto !== LightningElement;
    const superDef = hasCustomSuperClass ? getComponentInternalDef(superProto) : lightingElementDef;
    const bridge = HTMLBridgeElementFactory(superDef.bridge, keys(apiFields), keys(apiMethods));
    const props = assign(create(null), superDef.props, apiFields);
    const propsConfig = assign(create(null), superDef.propsConfig, apiFieldsConfig);
    const methods = assign(create(null), superDef.methods, apiMethods);
    const wire = assign(create(null), superDef.wire, wiredFields, wiredMethods);
    connectedCallback = connectedCallback || superDef.connectedCallback;
    disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
    renderedCallback = renderedCallback || superDef.renderedCallback;
    errorCallback = errorCallback || superDef.errorCallback;
    formAssociatedCallback = formAssociatedCallback || superDef.formAssociatedCallback;
    formResetCallback = formResetCallback || superDef.formResetCallback;
    formDisabledCallback = formDisabledCallback || superDef.formDisabledCallback;
    formStateRestoreCallback = formStateRestoreCallback || superDef.formStateRestoreCallback;
    render = render || superDef.render;
    let shadowSupportMode = superDef.shadowSupportMode;
    if (!isUndefined$1(ctorShadowSupportMode)) {
        shadowSupportMode = ctorShadowSupportMode;
    }
    let renderMode = superDef.renderMode;
    if (!isUndefined$1(ctorRenderMode)) {
        renderMode = ctorRenderMode === 'light' ? 0 /* RenderMode.Light */ : 1 /* RenderMode.Shadow */;
    }
    let formAssociated = superDef.formAssociated;
    if (!isUndefined$1(ctorFormAssociated)) {
        formAssociated = ctorFormAssociated;
    }
    const template = getComponentRegisteredTemplate(Ctor) || superDef.template;
    const name = Ctor.name || superDef.name;
    // installing observed fields into the prototype.
    defineProperties(proto, observedFields);
    const def = {
        ctor: Ctor,
        name,
        wire,
        props,
        propsConfig,
        methods,
        bridge,
        template,
        renderMode,
        shadowSupportMode,
        formAssociated,
        connectedCallback,
        disconnectedCallback,
        errorCallback,
        formAssociatedCallback,
        formDisabledCallback,
        formResetCallback,
        formStateRestoreCallback,
        renderedCallback,
        render,
    };
    // This is a no-op unless Lightning DevTools are enabled.
    instrumentDef(def);
    return def;
}
/**
 * EXPERIMENTAL: This function allows for the identification of LWC constructors. This API is
 * subject to change or being removed.
 * @param ctor
 */
function isComponentConstructor(ctor) {
    if (!isFunction$1(ctor)) {
        return false;
    }
    // Fast path: LightningElement is part of the prototype chain of the constructor.
    if (ctor.prototype instanceof LightningElement) {
        return true;
    }
    // Slow path: LightningElement is not part of the prototype chain of the constructor, we need
    // climb up the constructor prototype chain to check in case there are circular dependencies
    // to resolve.
    let current = ctor;
    do {
        if (isCircularModuleDependency(current)) {
            const circularResolved = resolveCircularModuleDependency(current);
            // If the circular function returns itself, that's the signal that we have hit the end
            // of the proto chain, which must always be a valid base constructor.
            if (circularResolved === current) {
                return true;
            }
            current = circularResolved;
        }
        if (current === LightningElement) {
            return true;
        }
    } while (!isNull(current) && (current = getPrototypeOf$1(current)));
    // Finally return false if the LightningElement is not part of the prototype chain.
    return false;
}
function getComponentInternalDef(Ctor) {
    let def = CtorToDefMap.get(Ctor);
    if (isUndefined$1(def)) {
        if (isCircularModuleDependency(Ctor)) {
            const resolvedCtor = resolveCircularModuleDependency(Ctor);
            def = getComponentInternalDef(resolvedCtor);
            // Cache the unresolved component ctor too. The next time if the same unresolved ctor is used,
            // look up the definition in cache instead of re-resolving and recreating the def.
            CtorToDefMap.set(Ctor, def);
            return def;
        }
        if (!isComponentConstructor(Ctor)) {
            throw new TypeError(`${Ctor} is not a valid component, or does not extends LightningElement from "lwc". You probably forgot to add the extend clause on the class declaration.`);
        }
        def = createComponentDef(Ctor);
        CtorToDefMap.set(Ctor, def);
    }
    return def;
}
function getComponentHtmlPrototype(Ctor) {
    const def = getComponentInternalDef(Ctor);
    return def.bridge;
}
const lightingElementDef = {
    name: LightningElement.name,
    props: lightningBasedDescriptors,
    propsConfig: EmptyObject,
    methods: EmptyObject,
    renderMode: 1 /* RenderMode.Shadow */,
    shadowSupportMode: 'reset',
    formAssociated: undefined,
    wire: EmptyObject,
    bridge: BaseBridgeElement,
    template: defaultEmptyTemplate,
    render: LightningElement.prototype.render,
};

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function isVBaseElement(vnode) {
    const { type } = vnode;
    return type === 2 /* VNodeType.Element */ || type === 3 /* VNodeType.CustomElement */;
}
function isSameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVCustomElement(vnode) {
    return vnode.type === 3 /* VNodeType.CustomElement */;
}
function isVFragment(vnode) {
    return vnode.type === 5 /* VNodeType.Fragment */;
}
function isVScopedSlotFragment(vnode) {
    return vnode.type === 6 /* VNodeType.ScopedSlotFragment */;
}
function isVStatic(vnode) {
    return vnode.type === 4 /* VNodeType.Static */;
}
function isVStaticPartElement(vnode) {
    return vnode.type === 1 /* VStaticPartType.Element */;
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const sanitizedHtmlContentSymbol = Symbol('lwc-get-sanitized-html-content');
// W-23680734: brand "trusted sanitized HTML" objects by IDENTITY, not by a structural
// property/symbol. The previous brand check (`sanitizedHtmlContentSymbol in value`) and read
// (`value[sanitizedHtmlContentSymbol]`) resolve through `value`'s own property semantics, so an
// object with caller-controlled property behavior can report the brand and yield markup it does
// not legitimately hold — trust based on shape rather than provenance.
//
// A WeakMap keyed on the wrapper's identity closes that gap: `WeakMap.prototype.has`/`get`
// perform an internal-slot identity lookup that does not consult the object's property handlers,
// and only wrappers we created were ever registered — so any other object is `false` regardless
// of its shape. This mirrors the existing identity-based trust sets for signals/context in
// `@lwc/shared` (`isTrustedSignal`, `isTrustedContext`).
const sanitizedContentToString = new WeakMap();
function isSanitizedHtmlContent(object) {
    if (!isObject(object) || isNull(object)) {
        return false;
    }
    // Kill-switch: when the flag is set, fall back to the legacy structural symbol brand.
    // Present so the hardening can be disabled at runtime if it regresses a legit integration;
    // the default (flag unset) is the safe, identity-based check.
    if (lwcRuntimeFlags.DISABLE_SANITIZED_HTML_CONTENT_IDENTITY_CHECK) {
        return sanitizedHtmlContentSymbol in object;
    }
    // Identity check — only wrappers we created are members, independent of `object`'s shape.
    return sanitizedContentToString.has(object);
}
function getSanitizedContent(object) {
    if (lwcRuntimeFlags.DISABLE_SANITIZED_HTML_CONTENT_IDENTITY_CHECK) {
        return object[sanitizedHtmlContentSymbol];
    }
    // Read the sanitized string from OUR map by identity, never from a property access on
    // `object` (whose semantics may be caller-controlled).
    return sanitizedContentToString.get(object);
}
/**
 * Wrap a pre-sanitized string designated for `.innerHTML` via `lwc:inner-html`
 * as an object branded by identity in a module-private WeakMap that only we have access to.
 * @param sanitizedString
 * @returns SanitizedHtmlContent
 */
function createSanitizedHtmlContent(sanitizedString) {
    // The wrapper keeps the non-enumerable symbol property so the legacy kill-switch path and
    // any structural consumers still work; the authoritative brand is WeakMap membership.
    const wrapper = create(null, {
        [sanitizedHtmlContentSymbol]: {
            value: sanitizedString,
            configurable: false,
            writable: false,
        },
    });
    sanitizedContentToString.set(wrapper, sanitizedString);
    return wrapper;
}
/**
 * Safely call setProperty on an Element while handling any SanitizedHtmlContent objects correctly
 *
 * @param setProperty - renderer.setProperty
 * @param elm - Element
 * @param key - key to set
 * @param value -  value to set
 */
function safelySetProperty(setProperty, elm, key, value) {
    // See W-16614337
    // we support setting innerHTML to `undefined` because it's inherently safe
    if ((key === 'innerHTML' || key === 'outerHTML') && !isUndefined$1(value)) {
        if (isSanitizedHtmlContent(value)) {
            // it's a SanitizedHtmlContent object
            setProperty(elm, key, getSanitizedContent(value));
        }
    }
    else {
        setProperty(elm, key, value);
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ColonCharCode = 58;
function patchAttributes(oldVnode, vnode, renderer) {
    const { data, elm } = vnode;
    const { attrs } = data;
    if (isUndefined$1(attrs)) {
        return;
    }
    const oldAttrs = isNull(oldVnode) ? EmptyObject : oldVnode.data.attrs;
    // Attrs may be the same due to the static content optimization, so we can skip diffing
    if (oldAttrs === attrs) {
        return;
    }
    // Note VStaticPartData does not contain the external property so it will always default to false.
    const external = 'external' in data ? data.external : false;
    const { setAttribute, removeAttribute, setProperty } = renderer;
    for (const key in attrs) {
        const cur = attrs[key];
        const old = oldAttrs[key];
        if (old !== cur) {
            let propName;
            // For external custom elements, sniff to see if the attr should be considered a prop.
            // Use kebabCaseToCamelCase directly because we don't want to set props like `ariaLabel` or `tabIndex`
            // on a custom element versus just using the more reliable attribute format.
            if (external && (propName = kebabCaseToCamelCase(key)) in elm) {
                safelySetProperty(setProperty, elm, propName, cur);
            }
            else if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
                // Assume xml namespace
                setAttribute(elm, key, cur, XML_NAMESPACE);
            }
            else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
                // Assume xlink namespace
                setAttribute(elm, key, cur, XLINK_NAMESPACE);
            }
            else if (isNull(cur) || isUndefined$1(cur)) {
                removeAttribute(elm, key);
            }
            else {
                setAttribute(elm, key, cur);
            }
        }
    }
}
function patchSlotAssignment(oldVnode, vnode, renderer) {
    const { slotAssignment } = vnode;
    if (oldVnode?.slotAssignment === slotAssignment) {
        return;
    }
    const { elm } = vnode;
    const { setAttribute, removeAttribute } = renderer;
    if (isUndefined$1(slotAssignment) || isNull(slotAssignment)) {
        removeAttribute(elm, 'slot');
    }
    else {
        setAttribute(elm, 'slot', slotAssignment);
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function isLiveBindingProp(sel, key) {
    // For properties with live bindings, we read values from the DOM element
    // instead of relying on internally tracked values.
    return sel === 'input' && (key === 'value' || key === 'checked');
}
function patchProps(oldVnode, vnode, renderer) {
    const { props } = vnode.data;
    if (isUndefined$1(props)) {
        return;
    }
    let oldProps;
    if (!isNull(oldVnode)) {
        oldProps = oldVnode.data.props;
        // Props may be the same due to the static content optimization, so we can skip diffing
        if (oldProps === props) {
            return;
        }
        if (isUndefined$1(oldProps)) {
            oldProps = EmptyObject;
        }
    }
    const isFirstPatch = isNull(oldVnode);
    const { elm, sel } = vnode;
    const { getProperty, setProperty } = renderer;
    for (const key in props) {
        const cur = props[key];
        // Set the property if it's the first time is is patched or if the previous property is
        // different than the one previously set.
        if (isFirstPatch ||
            cur !== (isLiveBindingProp(sel, key) ? getProperty(elm, key) : oldProps[key]) ||
            !(key in oldProps) // this is required because the above case will pass when `cur` is `undefined` and key is missing in `oldProps`
        ) {
            safelySetProperty(setProperty, elm, key, cur);
        }
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const classNameToClassMap = create(null);
function getMapFromClassName(className) {
    if (isUndefined$1(className) || isNull(className) || className === '') {
        return EmptyObject;
    }
    // computed class names must be string
    // This will throw if className is a symbol or null-prototype object
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    className = isString(className) ? className : className + '';
    let map = classNameToClassMap[className];
    if (map) {
        return map;
    }
    map = create(null);
    let start = 0;
    let o;
    const len = className.length;
    for (o = 0; o < len; o++) {
        if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
            if (o > start) {
                map[StringSlice.call(className, start, o)] = true;
            }
            start = o + 1;
        }
    }
    if (o > start) {
        map[StringSlice.call(className, start, o)] = true;
    }
    classNameToClassMap[className] = map;
    return map;
}
function patchClassAttribute(oldVnode, vnode, renderer) {
    const { elm, data: { className: newClass }, } = vnode;
    const oldClass = isNull(oldVnode) ? undefined : oldVnode.data.className;
    if (oldClass === newClass) {
        return;
    }
    const newClassMap = getMapFromClassName(newClass);
    const oldClassMap = getMapFromClassName(oldClass);
    if (oldClassMap === newClassMap) {
        // These objects are cached by className string (`classNameToClassMap`), so we can only get here if there is
        // a key collision due to types, e.g. oldClass is `undefined` and newClass is `""` (empty string), or oldClass
        // is `1` (number) and newClass is `"1"` (string).
        return;
    }
    const { getClassList } = renderer;
    const classList = getClassList(elm);
    let name;
    for (name in oldClassMap) {
        // remove only if it is not in the new class collection and it is not set from within the instance
        if (isUndefined$1(newClassMap[name])) {
            classList.remove(name);
        }
    }
    for (name in newClassMap) {
        if (isUndefined$1(oldClassMap[name])) {
            classList.add(name);
        }
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The style property is a string when defined via an expression in the template.
function patchStyleAttribute(oldVnode, vnode, renderer, owner) {
    const { elm, data: { style: newStyle }, } = vnode;
    const oldStyle = isNull(oldVnode) ? undefined : oldVnode.data.style;
    if (oldStyle === newStyle) {
        return;
    }
    const { setAttribute, removeAttribute } = renderer;
    if (!isString(newStyle) || newStyle === '') {
        removeAttribute(elm, 'style');
    }
    else {
        setAttribute(elm, 'style', newStyle);
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function applyEventListeners(vnode, renderer) {
    const { elm, data } = vnode;
    const { on } = data;
    if (isUndefined$1(on)) {
        return;
    }
    const { addEventListener } = renderer;
    for (const name in on) {
        const handler = on[name];
        addEventListener(elm, name, handler);
    }
}

/*
 * Copyright (c) 2025, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchDynamicEventListeners(oldVnode, vnode, renderer, owner) {
    const { elm, data: { dynamicOn, dynamicOnRaw }, sel, } = vnode;
    // dynamicOn : A cloned version of the object passed to lwc:on, with null prototype and only its own enumerable properties.
    const oldDynamicOn = oldVnode?.data?.dynamicOn ?? EmptyObject;
    const newDynamicOn = dynamicOn ?? EmptyObject;
    // dynamicOnRaw : object passed to lwc:on
    // Compare dynamicOnRaw to check if same object is passed to lwc:on
    oldVnode?.data?.dynamicOnRaw === dynamicOnRaw;
    const { addEventListener, removeEventListener } = renderer;
    const attachedEventListeners = getAttachedEventListeners(owner, elm);
    // Properties that are present in 'oldDynamicOn' but not in 'newDynamicOn'
    for (const eventType in oldDynamicOn) {
        if (!(eventType in newDynamicOn)) {
            // Remove listeners that were attached previously but don't have a corresponding property in `newDynamicOn`
            const attachedEventListener = attachedEventListeners[eventType];
            removeEventListener(elm, eventType, attachedEventListener);
            attachedEventListeners[eventType] = undefined;
        }
    }
    // Ensure that the event listeners that are attached match what is present in `newDynamicOn`
    for (const eventType in newDynamicOn) {
        const typeExistsInOld = eventType in oldDynamicOn;
        const newCallback = newDynamicOn[eventType];
        // Skip if callback hasn't changed
        if (typeExistsInOld && oldDynamicOn[eventType] === newCallback) {
            continue;
        }
        // Remove listener that was attached previously
        if (typeExistsInOld) {
            const attachedEventListener = attachedEventListeners[eventType];
            removeEventListener(elm, eventType, attachedEventListener);
        }
        // Bind new callback to owner component and add it as listener to element
        const newBoundEventListener = bindEventListener(owner, newCallback);
        addEventListener(elm, eventType, newBoundEventListener);
        // Store the newly added eventListener
        attachedEventListeners[eventType] = newBoundEventListener;
    }
}
function getAttachedEventListeners(vm, elm) {
    let attachedEventListeners = vm.attachedEventListeners.get(elm);
    if (isUndefined$1(attachedEventListeners)) {
        attachedEventListeners = {};
        vm.attachedEventListeners.set(elm, attachedEventListeners);
    }
    return attachedEventListeners;
}
function bindEventListener(vm, fn) {
    return function (event) {
        invokeEventListener(vm, fn, vm.component, event);
    };
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The HTML class property becomes the vnode.data.classMap object when defined as a string in the template.
// The compiler takes care of transforming the inline classnames into an object. It's faster to set the
// different classnames properties individually instead of via a string.
function applyStaticClassAttribute(vnode, renderer) {
    const { elm, data: { classMap }, } = vnode;
    if (isUndefined$1(classMap)) {
        return;
    }
    const { getClassList } = renderer;
    const classList = getClassList(elm);
    for (const name in classMap) {
        classList.add(name);
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// The HTML style property becomes the vnode.data.styleDecls object when defined as a string in the template.
// The compiler takes care of transforming the inline style into an object. It's faster to set the
// different style properties individually instead of via a string.
function applyStaticStyleAttribute(vnode, renderer) {
    const { elm, data: { styleDecls }, } = vnode;
    if (isUndefined$1(styleDecls)) {
        return;
    }
    const { setCSSStyleProperty } = renderer;
    for (let i = 0; i < styleDecls.length; i++) {
        const [prop, value, important] = styleDecls[i];
        setCSSStyleProperty(elm, prop, value, important);
    }
}

/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Set a ref (lwc:ref) on a VM, from a template API
function applyRefs(vnode, owner) {
    const { data } = vnode;
    const { ref } = data;
    if (isUndefined$1(ref)) {
        return;
    }
    // If this method is called, then vm.refVNodes is set as the template has refs.
    // If not, then something went wrong and we threw an error above.
    const refVNodes = owner.refVNodes;
    // In cases of conflict (two elements with the same ref), prefer the last one,
    // in depth-first traversal order. This happens automatically due to how we render
    refVNodes[ref] = vnode;
}

/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchTextVNode(n1, n2, renderer) {
    n2.elm = n1.elm;
    if (n2.text !== n1.text) {
        updateTextContent$1(n2, renderer);
    }
}
function patchTextVStaticPart(n1, n2, renderer) {
    if (isNull(n1) || n2.text !== n1.text) {
        updateTextContent$1(n2, renderer);
    }
}
function updateTextContent$1(vnode, renderer) {
    const { elm, text } = vnode;
    const { setText } = renderer;
    setText(elm, text);
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * Given an array of static parts, mounts the DOM element to the part based on the staticPartId
 * @param root the root element
 * @param parts an array of VStaticParts
 * @param renderer the renderer to use
 */
function traverseAndSetElements(root, parts, renderer) {
    const numParts = parts.length;
    // Optimization given that, in most cases, there will be one part, and it's just the root
    if (numParts === 1) {
        const firstPart = parts[0];
        if (firstPart.partId === 0) {
            // 0 means the root node
            firstPart.elm = root;
            return;
        }
    }
    const partIdsToParts = new Map();
    for (const staticPart of parts) {
        partIdsToParts.set(staticPart.partId, staticPart);
    }
    // Note that we traverse using `*Child`/`*Sibling` rather than `children` because the browser uses a linked
    // list under the hood to represent the DOM tree, so it's faster to do this than to create an underlying array
    // by calling `children`.
    const { nextSibling, getFirstChild, getParentNode } = renderer;
    let numFoundParts = 0;
    let partId = -1;
    // Depth-first traversal. We assign a partId to each element, which is an integer based on traversal order.
    // This function is very hot, which is why it's micro-optimized. Note we don't use a stack at all; we traverse
    // using an algorithm that relies on the parentNode getter: https://stackoverflow.com/a/5285417
    // This is very slightly faster than a TreeWalker (~0.5% on js-framework-benchmark create-10k), but basically
    // the same idea.
    let node = root;
    while (!isNull(node)) {
        // visit node
        partId++;
        const part = partIdsToParts.get(partId);
        if (!isUndefined$1(part)) {
            part.elm = node;
            numFoundParts++;
            if (numFoundParts === numParts) {
                return; // perf optimization - stop traversing once we've found everything we need
            }
        }
        const child = getFirstChild(node);
        if (!isNull(child)) {
            // walk down
            node = child;
        }
        else {
            let sibling;
            while (isNull((sibling = nextSibling(node)))) {
                // walk up
                node = getParentNode(node);
            }
            // walk right
            node = sibling;
        }
    }
}
/**
 * Given an array of static parts, do all the mounting required for these parts.
 * @param root the root element
 * @param vnode the parent VStatic
 * @param renderer the renderer to use
 */
function mountStaticParts(root, vnode, renderer) {
    const { parts, owner } = vnode;
    if (isUndefined$1(parts)) {
        return;
    }
    // This adds `part.elm` to each `part`. We have to do this on every mount because the `parts`
    // array is recreated from scratch every time, so each `part.elm` is now undefined.
    traverseAndSetElements(root, parts, renderer);
    // Currently only event listeners and refs are supported for static vnodes
    for (const part of parts) {
        if (isVStaticPartElement(part)) {
            // Event listeners only need to be applied once when mounting
            applyEventListeners(part, renderer);
            // Refs must be updated after every render due to refVNodes getting reset before every render
            applyRefs(part, owner);
            patchAttributes(null, part, renderer);
            patchClassAttribute(null, part, renderer);
            patchStyleAttribute(null, part, renderer);
        }
        else {
            patchTextVStaticPart(null, part, renderer);
        }
    }
}
/**
 * Updates the static elements based on the content of the VStaticParts
 * @param n1 the previous VStatic vnode
 * @param n2 the current VStatic vnode
 * @param renderer the renderer to use
 */
function patchStaticParts(n1, n2, renderer) {
    const { parts: currParts, owner: currPartsOwner } = n2;
    if (isUndefined$1(currParts)) {
        return;
    }
    const { parts: prevParts } = n1;
    for (let i = 0; i < currParts.length; i++) {
        const prevPart = prevParts[i];
        const part = currParts[i];
        // Patch only occurs if the vnode is newly generated, which means the part.elm is always undefined
        // Since the vnode and elements are the same we can safely assume that prevParts[i].elm is defined.
        part.elm = prevPart.elm;
        if (isVStaticPartElement(part)) {
            // Refs must be updated after every render due to refVNodes getting reset before every render
            applyRefs(part, currPartsOwner);
            patchAttributes(prevPart, part, renderer);
            patchClassAttribute(prevPart, part, renderer);
            patchStyleAttribute(prevPart, part, renderer);
        }
        else {
            patchTextVStaticPart(null, part, renderer);
        }
    }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
function patchChildren(c1, c2, parent, renderer) {
    if (hasDynamicChildren(c2)) {
        updateDynamicChildren(c1, c2, parent, renderer);
    }
    else {
        updateStaticChildren(c1, c2, parent, renderer);
    }
}
function patch(n1, n2, parent, renderer) {
    if (n1 === n2) {
        return;
    }
    switch (n2.type) {
        case 0 /* VNodeType.Text */:
            // VText has no special capability, fallback to the owner's renderer
            patchTextVNode(n1, n2, renderer);
            break;
        case 1 /* VNodeType.Comment */:
            // VComment has no special capability, fallback to the owner's renderer
            patchComment(n1, n2, renderer);
            break;
        case 4 /* VNodeType.Static */:
            patchStatic(n1, n2, renderer);
            break;
        case 5 /* VNodeType.Fragment */:
            patchFragment(n1, n2, parent, renderer);
            break;
        case 2 /* VNodeType.Element */:
            patchElement(n1, n2, n2.data.renderer ?? renderer);
            break;
        case 3 /* VNodeType.CustomElement */:
            patchCustomElement(n1, n2, parent, n2.data.renderer ?? renderer);
            break;
    }
}
function mount(node, parent, renderer, anchor) {
    switch (node.type) {
        case 0 /* VNodeType.Text */:
            // VText has no special capability, fallback to the owner's renderer
            mountText(node, parent, anchor, renderer);
            break;
        case 1 /* VNodeType.Comment */:
            // VComment has no special capability, fallback to the owner's renderer
            mountComment(node, parent, anchor, renderer);
            break;
        case 4 /* VNodeType.Static */:
            // VStatic cannot have a custom renderer associated to them, using owner's renderer
            mountStatic(node, parent, anchor, renderer);
            break;
        case 5 /* VNodeType.Fragment */:
            mountFragment(node, parent, anchor, renderer);
            break;
        case 2 /* VNodeType.Element */:
            // If the vnode data has a renderer override use it, else fallback to owner's renderer
            mountElement(node, parent, anchor, node.data.renderer ?? renderer);
            break;
        case 3 /* VNodeType.CustomElement */:
            // If the vnode data has a renderer override use it, else fallback to owner's renderer
            mountCustomElement(node, parent, anchor, node.data.renderer ?? renderer);
            break;
    }
}
function mountText(vnode, parent, anchor, renderer) {
    const { owner } = vnode;
    const { createText } = renderer;
    const textNode = (vnode.elm = createText(vnode.text));
    linkNodeToShadow(textNode, owner, renderer);
    insertNode(textNode, parent, anchor, renderer);
}
function patchComment(n1, n2, renderer) {
    n2.elm = n1.elm;
    // FIXME: Comment nodes should be static, we shouldn't need to diff them together. However
    // it is the case today.
    if (n2.text !== n1.text) {
        updateTextContent$1(n2, renderer);
    }
}
function mountComment(vnode, parent, anchor, renderer) {
    const { owner } = vnode;
    const { createComment } = renderer;
    const commentNode = (vnode.elm = createComment(vnode.text));
    linkNodeToShadow(commentNode, owner, renderer);
    insertNode(commentNode, parent, anchor, renderer);
}
function mountFragment(vnode, parent, anchor, renderer) {
    const { children } = vnode;
    mountVNodes(children, parent, renderer, anchor);
    vnode.elm = vnode.leading.elm;
}
function patchFragment(n1, n2, parent, renderer) {
    const { children, stable } = n2;
    if (stable) {
        updateStaticChildren(n1.children, children, parent, renderer);
    }
    else {
        updateDynamicChildren(n1.children, children, parent, renderer);
    }
    // Note: not reusing n1.elm, because during patching, it may be patched with another text node.
    n2.elm = n2.leading.elm;
}
function mountElement(vnode, parent, anchor, renderer) {
    const { sel, owner, data: { svg }, } = vnode;
    const { createElement } = renderer;
    const namespace = isTrue(svg) ? SVG_NAMESPACE : undefined;
    const elm = (vnode.elm = createElement(sel, namespace));
    linkNodeToShadow(elm, owner, renderer);
    applyStyleScoping(elm, owner, renderer);
    applyDomManual(elm, vnode);
    patchElementPropsAndAttrsAndRefs$1(null, vnode, renderer);
    insertNode(elm, parent, anchor, renderer);
    mountVNodes(vnode.children, elm, renderer, null);
}
function patchStatic(n1, n2, renderer) {
    n2.elm = n1.elm;
    // slotAssignments can only apply to the top level element, never to a static part.
    patchSlotAssignment(n1, n2, renderer);
    // The `refs` object is blown away in every re-render, so we always need to re-apply them
    patchStaticParts(n1, n2, renderer);
}
function patchElement(n1, n2, renderer) {
    const elm = (n2.elm = n1.elm);
    patchElementPropsAndAttrsAndRefs$1(n1, n2, renderer);
    patchChildren(n1.children, n2.children, elm, renderer);
}
function mountStatic(vnode, parent, anchor, renderer) {
    const { owner } = vnode;
    const { cloneNode, isSyntheticShadowDefined } = renderer;
    const elm = (vnode.elm = cloneNode(vnode.fragment, true));
    // Define the root node shadow resolver
    linkNodeToShadow(elm, owner, renderer);
    const { renderMode, shadowMode } = owner;
    if (isSyntheticShadowDefined) {
        // Marks this node as Static to propagate the shadow resolver. must happen after elm is assigned to the proper shadow
        if (shadowMode === 1 /* ShadowMode.Synthetic */ || renderMode === 0 /* RenderMode.Light */) {
            elm[KEY__SHADOW_STATIC] = true;
        }
    }
    // slotAssignments can only apply to the top level element, never to a static part.
    patchSlotAssignment(null, vnode, renderer);
    mountStaticParts(elm, vnode, renderer);
    insertNode(elm, parent, anchor, renderer);
}
function mountCustomElement(vnode, parent, anchor, renderer) {
    const { sel, owner, ctor } = vnode;
    const { createCustomElement } = renderer;
    /**
     * Note: if the upgradable constructor does not expect, or throw when we new it
     * with a callback as the first argument, we could implement a more advanced
     * mechanism that only passes that argument if the constructor is known to be
     * an upgradable custom element.
     */
    let vm;
    const upgradeCallback = (elm) => {
        // the custom element from the registry is expecting an upgrade callback
        vm = createViewModelHook(elm, vnode, renderer);
    };
    // Should never get a tag with upper case letter at this point; the compiler
    // should produce only tags with lowercase letters. However, the Java
    // compiler may generate tagnames with uppercase letters so - for backwards
    // compatibility, we lower case the tagname here.
    const normalizedTagname = sel.toLowerCase();
    const useNativeLifecycle = !lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE;
    const isFormAssociated = shouldBeFormAssociated(ctor);
    const elm = createCustomElement(normalizedTagname, upgradeCallback, useNativeLifecycle, isFormAssociated);
    vnode.elm = elm;
    vnode.vm = vm;
    linkNodeToShadow(elm, owner, renderer);
    applyStyleScoping(elm, owner, renderer);
    if (vm) {
        allocateChildren(vnode, vm);
    }
    patchElementPropsAndAttrsAndRefs$1(null, vnode, renderer);
    insertNode(elm, parent, anchor, renderer);
    if (vm) {
        {
            if (!useNativeLifecycle) {
                runConnectedCallback(vm);
            }
        }
    }
    mountVNodes(vnode.children, elm, renderer, null);
    if (vm) {
        appendVM(vm);
    }
}
function patchCustomElement(n1, n2, parent, renderer) {
    // TODO [#3331]: This if branch should be removed in 246 with lwc:dynamic
    if (n1.ctor !== n2.ctor) {
        // If the constructor differs, unmount the current component and mount a new one using the new
        // constructor.
        const anchor = renderer.nextSibling(n1.elm);
        unmount(n1, parent, renderer, true);
        mountCustomElement(n2, parent, anchor, renderer);
    }
    else {
        // Otherwise patch the existing component with new props/attrs/etc.
        const elm = (n2.elm = n1.elm);
        const vm = (n2.vm = n1.vm);
        patchElementPropsAndAttrsAndRefs$1(n1, n2, renderer);
        if (!isUndefined$1(vm)) {
            // in fallback mode, the allocation will always set children to
            // empty and delegate the real allocation to the slot elements
            allocateChildren(n2, vm);
            // Solves an edge case with slotted VFragments in native shadow mode.
            //
            // During allocation, in native shadow, slotted VFragment nodes are flattened and their text delimiters are removed
            // to avoid interfering with native slot behavior. When this happens, if any of the fragments
            // were not stable, the children must go through the dynamic diffing algo.
            //
            // If the new children (n2.children) contain no VFragments, but the previous children (n1.children) were dynamic,
            // the new nodes must be marked dynamic so that all nodes are properly updated. The only indicator that the new
            // nodes need to be dynamic comes from the previous children, so we check that to determine whether we need to
            // mark the new children dynamic.
            //
            // Example:
            // n1.children: [div, VFragment('', div, null, ''), div] => [div, div, null, div]; // marked dynamic
            // n2.children: [div, null, div] => [div, null, div] // marked ???
            const { shadowMode, renderMode } = vm;
            if (shadowMode == 0 /* ShadowMode.Native */ &&
                renderMode !== 0 /* RenderMode.Light */ &&
                hasDynamicChildren(n1.children)) {
                // No-op if children has already been marked dynamic by 'allocateChildren()'.
                markAsDynamicChildren(n2.children);
            }
        }
        // in fallback mode, the children will be always empty, so, nothing
        // will happen, but in native, it does allocate the light dom
        patchChildren(n1.children, n2.children, elm, renderer);
        if (!isUndefined$1(vm)) {
            // this will probably update the shadowRoot, but only if the vm is in a dirty state
            // this is important to preserve the top to bottom synchronous rendering phase.
            rerenderVM(vm);
        }
    }
}
function mountVNodes(vnodes, parent, renderer, anchor, start = 0, end = vnodes.length) {
    for (; start < end; ++start) {
        const vnode = vnodes[start];
        if (isVNode(vnode)) {
            mount(vnode, parent, renderer, anchor);
        }
    }
}
function unmount(vnode, parent, renderer, doRemove = false) {
    const { type, elm, sel } = vnode;
    // When unmounting a VNode subtree not all the elements have to removed from the DOM. The
    // subtree root, is the only element worth unmounting from the subtree.
    if (doRemove && type !== 5 /* VNodeType.Fragment */) {
        // The vnode might or might not have a data.renderer associated to it
        // but the removal used here is from the owner instead.
        removeNode(elm, parent, renderer);
    }
    switch (type) {
        case 5 /* VNodeType.Fragment */: {
            unmountVNodes(vnode.children, parent, renderer, doRemove);
            break;
        }
        case 2 /* VNodeType.Element */: {
            // Slot content is removed to trigger slotchange event when removing slot.
            // Only required for synthetic shadow.
            const shouldRemoveChildren = sel === 'slot' && vnode.owner.shadowMode === 1 /* ShadowMode.Synthetic */;
            unmountVNodes(vnode.children, elm, renderer, shouldRemoveChildren);
            break;
        }
        case 3 /* VNodeType.CustomElement */: {
            const { vm } = vnode;
            // No need to unmount the children here, `removeVM` will take care of removing the
            // children.
            if (!isUndefined$1(vm)) {
                removeVM(vm);
            }
        }
    }
}
function unmountVNodes(vnodes, parent, renderer, doRemove = false, start = 0, end = vnodes.length) {
    for (; start < end; ++start) {
        const ch = vnodes[start];
        if (isVNode(ch)) {
            unmount(ch, parent, renderer, doRemove);
        }
    }
}
function isVNode(vnode) {
    return vnode != null;
}
function linkNodeToShadow(elm, owner, renderer) {
    const { renderRoot, renderMode, shadowMode } = owner;
    const { isSyntheticShadowDefined } = renderer;
    // TODO [#1164]: this should eventually be done by the polyfill directly
    if (isSyntheticShadowDefined) {
        if (shadowMode === 1 /* ShadowMode.Synthetic */ || renderMode === 0 /* RenderMode.Light */) {
            elm[KEY__SHADOW_RESOLVER] = renderRoot[KEY__SHADOW_RESOLVER];
        }
    }
}
function insertFragmentOrNode(vnode, parent, anchor, renderer) {
    if (isVFragment(vnode)) {
        const children = vnode.children;
        for (let i = 0; i < children.length; i += 1) {
            const child = children[i];
            if (!isNull(child)) {
                renderer.insert(child.elm, parent, anchor);
            }
        }
    }
    else {
        renderer.insert(vnode.elm, parent, anchor);
    }
}
function insertNode(node, parent, anchor, renderer) {
    renderer.insert(node, parent, anchor);
}
function removeNode(node, parent, renderer) {
    renderer.remove(node, parent);
}
function patchElementPropsAndAttrsAndRefs$1(oldVnode, vnode, renderer) {
    if (isNull(oldVnode)) {
        applyEventListeners(vnode, renderer);
        applyStaticClassAttribute(vnode, renderer);
        applyStaticStyleAttribute(vnode, renderer);
    }
    const { owner } = vnode;
    patchDynamicEventListeners(oldVnode, vnode, renderer, owner);
    // Attrs need to be applied to element before props IE11 will wipe out value on radio inputs if
    // value is set before type=radio.
    patchClassAttribute(oldVnode, vnode, renderer);
    patchStyleAttribute(oldVnode, vnode, renderer);
    patchAttributes(oldVnode, vnode, renderer);
    patchProps(oldVnode, vnode, renderer);
    patchSlotAssignment(oldVnode, vnode, renderer);
    // The `refs` object is blown away in every re-render, so we always need to re-apply them
    applyRefs(vnode, owner);
}
function applyStyleScoping(elm, owner, renderer) {
    const { getClassList } = renderer;
    // Set the class name for `*.scoped.css` style scoping.
    const scopeToken = getScopeTokenClass(owner);
    if (!isNull(scopeToken)) {
        if (!isValidScopeToken(scopeToken)) {
            // See W-16614556
            throw new Error('stylesheet token must be a valid string');
        }
        // TODO [#2762]: this dot notation with add is probably problematic
        // probably we should have a renderer api for just the add operation
        getClassList(elm).add(scopeToken);
    }
    // Set property element for synthetic shadow DOM style scoping.
    const { stylesheetToken: syntheticToken } = owner.context;
    if (owner.shadowMode === 1 /* ShadowMode.Synthetic */) {
        if (!isUndefined$1(syntheticToken)) {
            elm.$shadowToken$ = syntheticToken;
        }
    }
}
function applyDomManual(elm, vnode) {
    const { owner, data: { context }, } = vnode;
    if (owner.shadowMode === 1 /* ShadowMode.Synthetic */ && context?.lwc?.dom === 'manual') {
        elm.$domManual$ = true;
    }
}
function allocateChildren(vnode, vm) {
    // A component with slots will re-render because:
    // 1- There is a change of the internal state.
    // 2- There is a change on the external api (ex: slots)
    //
    // In case #1, the vnodes in the cmpSlots will be reused since they didn't changed. This routine emptied the
    // slotted children when those VCustomElement were rendered and therefore in subsequent calls to allocate children
    // in a reused VCustomElement, there won't be any slotted children.
    // For those cases, we will use the reference for allocated children stored when rendering the fresh VCustomElement.
    //
    // In case #2, we will always get a fresh VCustomElement.
    const children = vnode.aChildren || vnode.children;
    const { renderMode, shadowMode } = vm;
    // If any of the children being allocated are VFragments, we remove the text delimiters and flatten all immediate
    // children VFragments to avoid them interfering with default slot behavior.
    const allocatedChildren = flattenFragmentsInChildren(children);
    vnode.children = allocatedChildren;
    vm.aChildren = allocatedChildren;
    if (shadowMode === 1 /* ShadowMode.Synthetic */ || renderMode === 0 /* RenderMode.Light */) {
        // slow path
        allocateInSlot(vm, allocatedChildren, vnode.owner);
        // save the allocated children in case this vnode is reused.
        vnode.aChildren = allocatedChildren;
        // every child vnode is now allocated, and the host should receive none directly, it receives them via the shadow!
        vnode.children = EmptyArray;
    }
}
/**
 * Flattens the contents of all VFragments in an array of VNodes, removes the text delimiters on those VFragments, and
 * marks the resulting children array as dynamic. Uses a stack (array) to iteratively traverse the nested VFragments
 * and avoid the perf overhead of creating/destroying throwaway arrays/objects in a recursive approach.
 *
 * With the delimiters removed, the contents are marked dynamic so they are diffed correctly.
 *
 * This function is used for slotted VFragments to avoid the text delimiters interfering with slotting functionality.
 * @param children
 */
function flattenFragmentsInChildren(children) {
    const flattenedChildren = [];
    // Initialize our stack with the direct children of the custom component and check whether we have a VFragment.
    // If no VFragment is found in children, we don't need to traverse anything or mark the children dynamic and can return early.
    const nodeStack = [];
    let fragmentFound = false;
    for (let i = children.length - 1; i > -1; i -= 1) {
        const child = children[i];
        ArrayPush$1.call(nodeStack, child);
        fragmentFound = fragmentFound || !!(child && isVFragment(child));
    }
    if (!fragmentFound) {
        return children;
    }
    let currentNode;
    while (!isUndefined$1((currentNode = ArrayPop.call(nodeStack)))) {
        if (!isNull(currentNode) && isVFragment(currentNode)) {
            const fChildren = currentNode.children;
            // Ignore the start and end text node delimiters
            for (let i = fChildren.length - 2; i > 0; i -= 1) {
                ArrayPush$1.call(nodeStack, fChildren[i]);
            }
        }
        else {
            ArrayPush$1.call(flattenedChildren, currentNode);
        }
    }
    // We always mark the children as dynamic because nothing generates stable VFragments yet.
    // If/when stable VFragments are generated by the compiler, this code should be updated to
    // not mark dynamic if all flattened VFragments were stable.
    markAsDynamicChildren(flattenedChildren);
    return flattenedChildren;
}
function createViewModelHook(elm, vnode, renderer) {
    let vm = getAssociatedVMIfPresent(elm);
    // There is a possibility that a custom element is registered under tagName, in which case, the
    // initialization is already carry on, and there is nothing else to do here since this hook is
    // called right after invoking `document.createElement`.
    if (!isUndefined$1(vm)) {
        return vm;
    }
    const { sel, mode, ctor, owner } = vnode;
    vm = createVM(elm, ctor, renderer, {
        mode,
        owner,
        tagName: sel,
    });
    return vm;
}
function allocateInSlot(vm, children, owner) {
    const { cmpSlots: { slotAssignments: oldSlotsMapping }, } = vm;
    const cmpSlotsMapping = create(null);
    // Collect all slots into cmpSlotsMapping
    for (let i = 0, len = children.length; i < len; i += 1) {
        const vnode = children[i];
        if (isNull(vnode)) {
            continue;
        }
        let slotName = '';
        if (isVBaseElement(vnode) || isVStatic(vnode)) {
            slotName = vnode.slotAssignment ?? '';
        }
        else if (isVScopedSlotFragment(vnode)) {
            slotName = vnode.slotName;
        }
        // Can't use toString here because Symbol(1).toString() is 'Symbol(1)'
        // but elm.setAttribute('slot', Symbol(1)) is an error.
        // the following line also throws same error for symbols
        // Similar for Object.create(null)
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const normalizedSlotName = '' + slotName;
        const vnodes = (cmpSlotsMapping[normalizedSlotName] =
            cmpSlotsMapping[normalizedSlotName] || []);
        ArrayPush$1.call(vnodes, vnode);
    }
    vm.cmpSlots = { owner, slotAssignments: cmpSlotsMapping };
    if (isFalse(vm.isDirty)) {
        // We need to determine if the old allocation is really different from the new one
        // and mark the vm as dirty
        const oldKeys = keys(oldSlotsMapping);
        if (oldKeys.length !== keys(cmpSlotsMapping).length) {
            markComponentAsDirty(vm);
            return;
        }
        for (let i = 0, len = oldKeys.length; i < len; i += 1) {
            const key = oldKeys[i];
            if (isUndefined$1(cmpSlotsMapping[key]) ||
                oldSlotsMapping[key].length !== cmpSlotsMapping[key].length) {
                markComponentAsDirty(vm);
                return;
            }
            const oldVNodes = oldSlotsMapping[key];
            const vnodes = cmpSlotsMapping[key];
            for (let j = 0, a = cmpSlotsMapping[key].length; j < a; j += 1) {
                if (oldVNodes[j] !== vnodes[j]) {
                    markComponentAsDirty(vm);
                    return;
                }
            }
        }
    }
}
const DynamicChildren = new WeakSet();
// dynamic children means it was either generated by an iteration in a template
// or part of an unstable fragment, and will require a more complex diffing algo.
function markAsDynamicChildren(children) {
    DynamicChildren.add(children);
}
function hasDynamicChildren(children) {
    return DynamicChildren.has(children);
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    const map = {};
    for (let j = beginIdx; j <= endIdx; ++j) {
        const ch = children[j];
        if (isVNode(ch)) {
            const { key } = ch;
            if (key !== undefined) {
                map[key] = j;
            }
        }
    }
    return map;
}
function updateDynamicChildren(oldCh, newCh, parent, renderer) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    const newChEnd = newCh.length - 1;
    let newEndIdx = newChEnd;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;
    let clonedOldCh = false;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!isVNode(oldStartVnode)) {
            oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
        }
        else if (!isVNode(oldEndVnode)) {
            oldEndVnode = oldCh[--oldEndIdx];
        }
        else if (!isVNode(newStartVnode)) {
            newStartVnode = newCh[++newStartIdx];
        }
        else if (!isVNode(newEndVnode)) {
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode, parent, renderer);
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode, parent, renderer);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldStartVnode, newEndVnode)) {
            // Vnode moved right
            patch(oldStartVnode, newEndVnode, parent, renderer);
            // In the case of fragments, the `elm` property of a vfragment points to the leading
            // anchor. To determine the next sibling of the whole fragment, we need to use the
            // trailing anchor as the argument to nextSibling():
            // [..., [leading, ...content, trailing], nextSibling, ...]
            let anchor;
            if (isVFragment(oldEndVnode)) {
                anchor = renderer.nextSibling(oldEndVnode.trailing.elm);
            }
            else {
                anchor = renderer.nextSibling(oldEndVnode.elm);
            }
            insertFragmentOrNode(oldStartVnode, parent, anchor, renderer);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        }
        else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // Vnode moved left
            patch(oldEndVnode, newStartVnode, parent, renderer);
            insertFragmentOrNode(newStartVnode, parent, oldStartVnode.elm, renderer);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        }
        else {
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
            }
            idxInOld = oldKeyToIdx[newStartVnode.key];
            if (isUndefined$1(idxInOld)) {
                // New element
                mount(newStartVnode, parent, renderer, oldStartVnode.elm);
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                elmToMove = oldCh[idxInOld];
                if (isVNode(elmToMove)) {
                    if (elmToMove.sel !== newStartVnode.sel) {
                        // New element
                        mount(newStartVnode, parent, renderer, oldStartVnode.elm);
                    }
                    else {
                        patch(elmToMove, newStartVnode, parent, renderer);
                        // Delete the old child, but copy the array since it is read-only.
                        // The `oldCh` will be GC'ed after `updateDynamicChildren` is complete,
                        // so we only care about the `oldCh` object inside this function.
                        // To avoid cloning over and over again, we check `clonedOldCh`
                        // and only clone once.
                        if (!clonedOldCh) {
                            clonedOldCh = true;
                            oldCh = [...oldCh];
                        }
                        // We've already cloned at least once, so it's no longer read-only
                        oldCh[idxInOld] = undefined;
                        insertFragmentOrNode(elmToMove, parent, oldStartVnode.elm, renderer);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
            // There's some cases in which the sub array of vnodes to be inserted is followed by null(s) and an
            // already processed vnode, in such cases the vnodes to be inserted should be before that processed vnode.
            let i = newEndIdx;
            let n;
            do {
                n = newCh[++i];
            } while (!isVNode(n) && i < newChEnd);
            before = isVNode(n) ? n.elm : null;
            mountVNodes(newCh, parent, renderer, before, newStartIdx, newEndIdx + 1);
        }
        else {
            unmountVNodes(oldCh, parent, renderer, true, oldStartIdx, oldEndIdx + 1);
        }
    }
}
function updateStaticChildren(c1, c2, parent, renderer) {
    const c1Length = c1.length;
    const c2Length = c2.length;
    if (c1Length === 0) {
        // the old list is empty, we can directly insert anything new
        mountVNodes(c2, parent, renderer, null);
        return;
    }
    if (c2Length === 0) {
        // the old list is nonempty and the new list is empty so we can directly remove all old nodes
        // this is the case in which the dynamic children of an if-directive should be removed
        unmountVNodes(c1, parent, renderer, true);
        return;
    }
    // if the old list is not empty, the new list MUST have the same
    // amount of nodes, that's why we call this static children
    let anchor = null;
    for (let i = c2Length - 1; i >= 0; i -= 1) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (n2 !== n1) {
            if (isVNode(n1)) {
                if (isVNode(n2)) {
                    if (isSameVnode(n1, n2)) {
                        // both vnodes are equivalent, and we just need to patch them
                        patch(n1, n2, parent, renderer);
                        anchor = n2.elm;
                    }
                    else {
                        // removing the old vnode since the new one is different
                        unmount(n1, parent, renderer, true);
                        mount(n2, parent, renderer, anchor);
                        anchor = n2.elm;
                    }
                }
                else {
                    // removing the old vnode since the new one is null
                    unmount(n1, parent, renderer, true);
                }
            }
            else if (isVNode(n2)) {
                mount(n2, parent, renderer, anchor);
                anchor = n2.elm;
            }
        }
    }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const SymbolIterator = Symbol.iterator;
function addVNodeToChildLWC(vnode) {
    ArrayPush$1.call(getVMBeingRendered().velements, vnode);
}
// [s]tatic [p]art
function sp(partId, data, text) {
    // Static part will always have either text or data, it's guaranteed by the compiler.
    const type = isNull(text) ? 1 /* VStaticPartType.Element */ : 0 /* VStaticPartType.Text */;
    return {
        type,
        partId,
        data,
        text,
        elm: undefined, // elm is defined later
    };
}
// [s]coped [s]lot [f]actory
function ssf(slotName, factory) {
    return {
        type: 6 /* VNodeType.ScopedSlotFragment */,
        factory,
        owner: getVMBeingRendered(),
        elm: undefined,
        sel: '__scoped_slot_fragment__',
        key: undefined,
        slotName,
    };
}
// [st]atic node
function st(fragmentFactory, key, parts) {
    const owner = getVMBeingRendered();
    const fragment = fragmentFactory(parts);
    const vnode = {
        type: 4 /* VNodeType.Static */,
        sel: '__static__',
        key,
        elm: undefined,
        fragment,
        owner,
        parts,
        slotAssignment: undefined,
    };
    return vnode;
}
// [fr]agment node
function fr(key, children, stable) {
    const owner = getVMBeingRendered();
    const useCommentNodes = isAPIFeatureEnabled(5 /* APIFeature.USE_COMMENTS_FOR_FRAGMENT_BOOKENDS */, owner.apiVersion);
    const leading = useCommentNodes ? co('') : t('');
    const trailing = useCommentNodes ? co('') : t('');
    return {
        type: 5 /* VNodeType.Fragment */,
        sel: '__fragment__',
        key,
        elm: undefined,
        children: [leading, ...children, trailing],
        stable,
        owner,
        leading,
        trailing,
    };
}
// [h]tml node
function h(sel, data, children = EmptyArray) {
    const vmBeingRendered = getVMBeingRendered();
    const { key, slotAssignment } = data;
    const vnode = {
        type: 2 /* VNodeType.Element */,
        sel,
        data,
        children,
        elm: undefined,
        key,
        owner: vmBeingRendered,
        slotAssignment,
    };
    return vnode;
}
// [t]ab[i]ndex function
function ti(value) {
    // if value is greater than 0, we normalize to 0
    // If value is an invalid tabIndex value (null, undefined, string, etc), we let that value pass through
    // If value is less than -1, we don't care
    const shouldNormalize = value > 0 && !(isTrue(value) || isFalse(value));
    return shouldNormalize ? 0 : value;
}
// [s]lot element node
function s(slotName, data, children, slotset) {
    const vmBeingRendered = getVMBeingRendered();
    const { renderMode, apiVersion } = vmBeingRendered;
    if (!isUndefined$1(slotset) &&
        !isUndefined$1(slotset.slotAssignments) &&
        !isUndefined$1(slotset.slotAssignments[slotName]) &&
        slotset.slotAssignments[slotName].length !== 0) {
        const newChildren = [];
        const slotAssignments = slotset.slotAssignments[slotName];
        for (let i = 0; i < slotAssignments.length; i++) {
            const vnode = slotAssignments[i];
            if (!isNull(vnode)) {
                const assignedNodeIsScopedSlot = isVScopedSlotFragment(vnode);
                // The only sniff test for a scoped <slot> element is the presence of `slotData`
                const isScopedSlotElement = !isUndefined$1(data.slotData);
                // Check if slot types of parent and child are matching
                if (assignedNodeIsScopedSlot !== isScopedSlotElement) {
                    // Ignore slot content from parent
                    continue;
                }
                // If the passed slot content is factory, evaluate it and add the produced vnodes
                if (assignedNodeIsScopedSlot) {
                    // Evaluate in the scope of the slot content's owner
                    // if a slotset is provided, there will always be an owner. The only case where owner is
                    // undefined is for root components, but root components cannot accept slotted content
                    setVMBeingRendered(slotset.owner);
                    try {
                        // The factory function is a template snippet from the slot set owner's template,
                        // hence switch over to the slot set owner's template reactive observer
                        const { tro } = slotset.owner;
                        tro.observe(() => {
                            ArrayPush$1.call(newChildren, vnode.factory(data.slotData, data.key));
                        });
                    }
                    finally {
                        setVMBeingRendered(vmBeingRendered);
                    }
                }
                else {
                    // This block is for standard slots (non-scoped slots)
                    let clonedVNode;
                    if (renderMode === 0 /* RenderMode.Light */ &&
                        isAPIFeatureEnabled(6 /* APIFeature.USE_LIGHT_DOM_SLOT_FORWARDING */, apiVersion) &&
                        (isVBaseElement(vnode) || isVStatic(vnode)) &&
                        vnode.slotAssignment !== data.slotAssignment) {
                        // When the light DOM slot assignment (slot attribute) changes, we can't use the same reference
                        // to the vnode because the current way the diffing algo works, it will replace the original
                        // reference to the host element with a new one. This means the new element will be mounted and
                        // immediately unmounted. Creating a copy of the vnode preserves a reference to the previous
                        // host element.
                        clonedVNode = { ...vnode, slotAssignment: data.slotAssignment };
                        // For disconnectedCallback to work correctly in synthetic lifecycle mode, we need to link the
                        // current VM's velements to the clone, so that when the VM unmounts, the clone also unmounts.
                        // Note this only applies to VCustomElements, since those are the elements that we manually need
                        // to call disconnectedCallback for, when running in synthetic lifecycle mode.
                        //
                        // You might think it would make more sense to add the clonedVNode to the same velements array
                        // as the original vnode's VM (i.e. `vnode.owner.velements`) rather than the current VM (i.e.
                        // `vmBeingRendered.velements`), but this actually might not trigger disconnectedCallback
                        // in synthetic lifecycle mode. The reason for this is that a reactivity change may cause
                        // the slottable component to unmount, but _not_ the slotter component (see issue #4446).
                        //
                        // If this occurs, then the slottable component (i.e .this component we are rendering right
                        // now) is the one that needs to own the clone. Whereas if a reactivity change higher in the
                        // tree causes the slotter to unmount, then the slottable will also unmount. So using the
                        // current VM works either way.
                        if (isVCustomElement(vnode)) {
                            addVNodeToChildLWC(clonedVNode);
                        }
                    }
                    // If the slot content is standard type, the content is static, no additional
                    // processing needed on the vnode
                    ArrayPush$1.call(newChildren, clonedVNode ?? vnode);
                }
            }
        }
        children = newChildren;
    }
    const { shadowMode } = vmBeingRendered;
    if (renderMode === 0 /* RenderMode.Light */) {
        // light DOM slots - backwards-compatible behavior uses flattening, new behavior uses fragments
        if (isAPIFeatureEnabled(2 /* APIFeature.USE_FRAGMENTS_FOR_LIGHT_DOM_SLOTS */, apiVersion)) {
            return fr(data.key, children, 0);
        }
        else {
            sc(children);
            return children;
        }
    }
    if (shadowMode === 1 /* ShadowMode.Synthetic */) {
        // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
        sc(children);
    }
    return h('slot', data, children);
}
// [c]ustom element node
function c(sel, Ctor, data, children = EmptyArray) {
    const vmBeingRendered = getVMBeingRendered();
    const { key, slotAssignment } = data;
    const vnode = {
        type: 3 /* VNodeType.CustomElement */,
        sel,
        data,
        children,
        elm: undefined,
        key,
        slotAssignment,
        ctor: Ctor,
        owner: vmBeingRendered,
        mode: 'open', // TODO [#1294]: this should be defined in Ctor
        aChildren: undefined,
        vm: undefined,
    };
    addVNodeToChildLWC(vnode);
    return vnode;
}
// [i]terable node
function i(iterable, factory) {
    const list = [];
    // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
    sc(list);
    if (isUndefined$1(iterable) || isNull(iterable)) {
        return list;
    }
    const iterator = iterable[SymbolIterator]();
    let next = iterator.next();
    let j = 0;
    let { value, done: last } = next;
    while (last === false) {
        // implementing a look-back-approach because we need to know if the element is the last
        next = iterator.next();
        last = next.done;
        // template factory logic based on the previous collected value
        const vnode = factory(value, j, j === 0, last === true);
        if (isArray$1(vnode)) {
            ArrayPush$1.apply(list, vnode);
        }
        else {
            // `isArray` doesn't narrow this block properly...
            ArrayPush$1.call(list, vnode);
        }
        // preparing next value
        j += 1;
        value = next.value;
    }
    return list;
}
/**
 * [f]lattening
 * @param items
 */
function f(items) {
    const len = items.length;
    const flattened = [];
    // TODO [#1276]: compiler should give us some sort of indicator when a vnodes collection is dynamic
    sc(flattened);
    for (let j = 0; j < len; j += 1) {
        const item = items[j];
        if (isArray$1(item)) {
            ArrayPush$1.apply(flattened, item);
        }
        else {
            // `isArray` doesn't narrow this block properly...
            ArrayPush$1.call(flattened, item);
        }
    }
    return flattened;
}
// [t]ext node
function t(text) {
    return {
        type: 0 /* VNodeType.Text */,
        sel: '__text__',
        text,
        elm: undefined,
        key: undefined,
        owner: getVMBeingRendered(),
    };
}
// [co]mment node
function co(text) {
    return {
        type: 1 /* VNodeType.Comment */,
        sel: '__comment__',
        text,
        elm: undefined,
        key: undefined,
        owner: getVMBeingRendered(),
    };
}
// [d]ynamic text
function d(value) {
    return value == null ? '' : String(value);
}
// [b]ind function
function b(fn) {
    const vmBeingRendered = getVMBeingRendered();
    if (isNull(vmBeingRendered)) {
        throw new Error();
    }
    const vm = vmBeingRendered;
    return function (event) {
        invokeEventListener(vm, fn, vm.component, event);
    };
}
// [k]ey function
function k(compilerKey, obj) {
    switch (typeof obj) {
        case 'number':
        case 'string':
            return compilerKey + ':' + obj;
    }
}
// [g]lobal [id] function
function gid(id) {
    const vmBeingRendered = getVMBeingRendered();
    if (isUndefined$1(id) || id === '') {
        return id;
    }
    // We remove attributes when they are assigned a value of null
    if (isNull(id)) {
        return null;
    }
    const { idx, shadowMode } = vmBeingRendered;
    if (shadowMode === 1 /* ShadowMode.Synthetic */) {
        return StringReplace.call(id, /\S+/g, (id) => `${id}-${idx}`);
    }
    return id;
}
// [f]ragment [id] function
function fid(url) {
    const vmBeingRendered = getVMBeingRendered();
    if (isUndefined$1(url) || url === '') {
        return url;
    }
    // We remove attributes when they are assigned a value of null
    if (isNull(url)) {
        return null;
    }
    const { idx, shadowMode } = vmBeingRendered;
    // Apply transformation only for fragment-only-urls, and only in shadow DOM
    if (shadowMode === 1 /* ShadowMode.Synthetic */ && /^#/.test(url)) {
        return `${url}-${idx}`;
    }
    return url;
}
/**
 * [ddc] - create a (deprecated) dynamic component via `<x-foo lwc:dynamic={Ctor}>`
 *
 * TODO [#3331]: remove usage of lwc:dynamic in 246
 * @param sel
 * @param Ctor
 * @param data
 * @param children
 */
function ddc(sel, Ctor, data, children = EmptyArray) {
    // null or undefined values should produce a null value in the VNodes
    if (isNull(Ctor) || isUndefined$1(Ctor)) {
        return null;
    }
    if (!isComponentConstructor(Ctor)) {
        throw new Error(`Invalid LWC Constructor ${toString(Ctor)} for custom element <${sel}>.`);
    }
    return c(sel, Ctor, data, children);
}
/**
 * [dc] - create a dynamic component via `<lwc:component lwc:is={Ctor}>`
 * @param Ctor
 * @param data
 * @param children
 */
function dc(Ctor, data, children = EmptyArray) {
    // Null or undefined values should produce a null value in the VNodes.
    // This is the only value at compile time as the constructor will not be known.
    if (isNull(Ctor) || isUndefined$1(Ctor)) {
        return null;
    }
    if (!isComponentConstructor(Ctor)) {
        throw new Error(`Invalid constructor: "${toString(Ctor)}" is not a LightningElement constructor.`);
    }
    // Look up the dynamic component's name at runtime once the constructor is available.
    // This information is only known at runtime and is stored as part of registerComponent.
    const sel = getComponentRegisteredName(Ctor);
    if (isUndefined$1(sel) || sel === '') {
        throw new Error(`Invalid LWC constructor ${toString(Ctor)} does not have a registered name`);
    }
    return c(sel, Ctor, data, children);
}
/**
 * slow children collection marking mechanism. this API allows the compiler to signal
 * to the engine that a particular collection of children must be diffed using the slow
 * algo based on keys due to the nature of the list. E.g.:
 *
 * - slot element's children: the content of the slot has to be dynamic when in synthetic
 * shadow mode because the `vnode.children` might be the slotted
 * content vs default content, in which case the size and the
 * keys are not matching.
 * - children that contain dynamic components
 * - children that are produced by iteration
 * @param vnodes
 */
function sc(vnodes) {
    // We have to mark the vnodes collection as dynamic so we can later on
    // choose to use the snabbdom virtual dom diffing algo instead of our
    // static dummy algo.
    markAsDynamicChildren(vnodes);
    return vnodes;
}
// [s]anitize [h]tml [c]ontent
function shc(content) {
    const sanitizedString = sanitizeHtmlContent();
    return createSanitizedHtmlContent(sanitizedString);
}
const ncls = normalizeClass;
const api = freeze({
    s,
    h,
    c,
    i,
    f,
    t,
    d,
    b,
    k,
    co,
    dc,
    fr,
    ti,
    st,
    gid,
    fid,
    shc,
    ssf,
    ddc,
    sp,
    ncls,
});

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// HAS_SCOPED_STYLE | SHADOW_MODE_SYNTHETIC = 3
const MAX_CACHE_KEY = 3;
// Mapping of cacheKeys to `string[]` (assumed to come from a tagged template literal) to an Element.
// Note that every unique tagged template literal will have a unique `string[]`. So by using `string[]`
// as the WeakMap key, we effectively associate each Element with a unique tagged template literal.
// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates
// Also note that this array only needs to be large enough to account for the maximum possible cache key
const fragmentCache = ArrayFrom({ length: MAX_CACHE_KEY + 1 }, () => new WeakMap());
function getFromFragmentCache(cacheKey, strings) {
    return fragmentCache[cacheKey].get(strings);
}
function setInFragmentCache(cacheKey, strings, element) {
    fragmentCache[cacheKey].set(strings, element);
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let isUpdatingTemplate = false;
let vmBeingRendered = null;
function getVMBeingRendered() {
    return vmBeingRendered;
}
function setVMBeingRendered(vm) {
    vmBeingRendered = vm;
}
function validateSlots(vm) {
    assertNotProd(); // this method should never leak to prod
    const { cmpSlots } = vm;
    for (const slotName in cmpSlots.slotAssignments) {
        assert.isTrue(isArray$1(cmpSlots.slotAssignments[slotName]), `Slots can only be set to an array, instead received ${toString(cmpSlots.slotAssignments[slotName])} for slot "${slotName}" in ${vm}.`);
    }
}
function checkHasMatchingRenderMode(template, vm) {
    // don't validate in prod environments where reporting is disabled
    {
        return;
    }
}
const browserExpressionSerializer = (partToken, classAttrToken) => {
    // This will insert the scoped style token as a static class attribute in the fragment
    // bypassing the need to call applyStyleScoping when mounting static parts.
    const type = StringCharAt.call(partToken, 0);
    switch (type) {
        case "c" /* STATIC_PART_TOKEN_ID.CLASS */:
            return classAttrToken;
        case "t" /* STATIC_PART_TOKEN_ID.TEXT */:
            // Using a single space here gives us a single empty text node
            return ' ';
        default:
            return '';
    }
};
// This function serializes the expressions generated by static content optimization.
// Currently this is only needed for SSR.
// TODO [#4078]: Split the implementation between @lwc/engine-dom and @lwc/engine-server
function buildSerializeExpressionFn(parts) {
    {
        return browserExpressionSerializer;
    }
}
function buildParseFragmentFn(createFragmentFn) {
    return function parseFragment(strings, ...keys) {
        return function applyFragmentParts(parts) {
            const { context: { hasScopedStyles, stylesheetToken }, shadowMode, renderer, } = getVMBeingRendered();
            const hasStyleToken = !isUndefined$1(stylesheetToken);
            const isSyntheticShadow = shadowMode === 1 /* ShadowMode.Synthetic */;
            let cacheKey = 0;
            if (hasStyleToken && hasScopedStyles) {
                cacheKey |= 1 /* FragmentCacheKey.HAS_SCOPED_STYLE */;
            }
            if (hasStyleToken && isSyntheticShadow) {
                cacheKey |= 2 /* FragmentCacheKey.SHADOW_MODE_SYNTHETIC */;
            }
            // Cache is only here to prevent calling innerHTML multiple times which doesn't happen on the server.
            {
                // Disable this on the server to prevent cache poisoning when expressions are used.
                const cached = getFromFragmentCache(cacheKey, strings);
                if (!isUndefined$1(cached)) {
                    return cached;
                }
            }
            // See W-16614556
            // TODO [#2826]: freeze the template object
            if (hasStyleToken && !isValidScopeToken(stylesheetToken)) {
                throw new Error('stylesheet token must be a valid string');
            }
            const classToken = hasScopedStyles && hasStyleToken ? ' ' + stylesheetToken : '';
            const classAttrToken = hasScopedStyles && hasStyleToken ? ` class="${stylesheetToken}"` : '';
            const attrToken = hasStyleToken && isSyntheticShadow ? ' ' + stylesheetToken : '';
            // In the browser, we provide the entire class attribute as a perf optimization to avoid applying it on mount.
            // The remaining class expression will be applied when the static parts are mounted.
            // In SSR, the entire class attribute (expression included) is assembled along with the fragment.
            // This is why in the browser we provide the entire class attribute and in SSR we only provide the class token.
            const exprClassToken = classAttrToken ;
            // TODO [#3624]: The implementation of this function should be specific to @lwc/engine-dom and @lwc/engine-server.
            // Find a way to split this in a future refactor.
            const serializeExpression = buildSerializeExpressionFn();
            let htmlFragment = '';
            for (let i = 0, n = keys.length; i < n; i++) {
                switch (keys[i]) {
                    case 0: // styleToken in existing class attr
                        htmlFragment += strings[i] + classToken;
                        break;
                    case 1: // styleToken for added class attr
                        htmlFragment += strings[i] + classAttrToken;
                        break;
                    case 2: // styleToken as attr
                        htmlFragment += strings[i] + attrToken;
                        break;
                    case 3: // ${1}${2}
                        htmlFragment += strings[i] + classAttrToken + attrToken;
                        break;
                    default: // expressions ${partId:attributeName/textId}
                        htmlFragment +=
                            strings[i] + serializeExpression(keys[i], exprClassToken);
                        break;
                }
            }
            htmlFragment += strings[strings.length - 1];
            const element = createFragmentFn(htmlFragment, renderer);
            // Cache is only here to prevent calling innerHTML multiple times which doesn't happen on the server.
            {
                setInFragmentCache(cacheKey, strings, element);
            }
            return element;
        };
    };
}
// W-23814957: static-content markup is assembled here and assigned to `innerHTML` by
// `createFragment` (see @lwc/engine-dom). The `lwc:inner-html` directive routes its markup through
// the overridable `sanitizeHtmlContent` hook before it becomes DOM; the static-content path does
// not. When the opt-in flag is enabled, route the exact string that will be assigned to `innerHTML`
// through the same hook, so both paths are consistent. This is applied per fragment variant (rather
// than once on the pre-assembled markup) so the SVG variant is processed with its `<svg>` wrapper in
// place — i.e. in the same parsing context (namespace) `createFragment` will use. Off by default to
// preserve existing behavior (and because enabling it requires a hook that preserves the
// engine-generated scope tokens embedded in the markup).
function sanitizeFragmentIfEnabled(html) {
    if (lwcRuntimeFlags.ENABLE_PARSE_FRAGMENT_SANITIZATION) {
        return sanitizeHtmlContent();
    }
    return html;
}
// Note: at the moment this code executes, we don't have a renderer yet.
const parseFragment = buildParseFragmentFn((html, renderer) => {
    const { createFragment } = renderer;
    return createFragment(sanitizeFragmentIfEnabled(html));
});
const parseSVGFragment = buildParseFragmentFn((html, renderer) => {
    const { createFragment, getFirstChild } = renderer;
    const fragment = createFragment(sanitizeFragmentIfEnabled('<svg>' + html + '</svg>'));
    return getFirstChild(fragment);
});
function evaluateTemplate(vm, html) {
    const isUpdatingTemplateInception = isUpdatingTemplate;
    const vmOfTemplateBeingUpdatedInception = vmBeingRendered;
    let vnodes = [];
    runWithBoundaryProtection(vm, vm.owner, () => {
        // pre
        vmBeingRendered = vm;
    }, () => {
        // job
        const { component, context, cmpSlots, cmpTemplate, tro } = vm;
        tro.observe(() => {
            // Reset the cache memoizer for template when needed.
            if (html !== cmpTemplate) {
                // Check that the template was built by the compiler.
                if (!isTemplateRegistered(html)) {
                    throw new TypeError(`Invalid template returned by the render() method on ${vm.tagName}. It must return an imported template (e.g.: \`import html from "./${vm.def.name}.html"\`), instead, it has returned: ${toString(html)}.`);
                }
                checkHasMatchingRenderMode(html, vm);
                // Perf opt: do not reset the shadow root during the first rendering (there is
                // nothing to reset).
                if (!isNull(cmpTemplate)) {
                    // It is important to reset the content to avoid reusing similar elements
                    // generated from a different template, because they could have similar IDs,
                    // and snabbdom just rely on the IDs.
                    resetComponentRoot(vm);
                }
                vm.cmpTemplate = html;
                // Create a brand new template cache for the swapped templated.
                context.tplCache = create(null);
                // Set the computeHasScopedStyles property in the context, to avoid recomputing it repeatedly.
                context.hasScopedStyles = computeHasScopedStyles(html, vm);
                // Update the scoping token on the host element.
                updateStylesheetToken(vm, html, /* legacy */ false);
                // Evaluate, create stylesheet and cache the produced VNode for future
                // re-rendering.
                const stylesheetsContent = getStylesheetsContent(vm, html);
                context.styleVNodes =
                    stylesheetsContent.length === 0
                        ? null
                        : createStylesheet(vm, stylesheetsContent);
            }
            if ("production" !== 'production') ;
            // right before producing the vnodes, we clear up all internal references
            // to custom elements from the template.
            vm.velements = [];
            // Set the global flag that template is being updated
            isUpdatingTemplate = true;
            // `html.call(...)` reads a `call` property off the compiled template function. A
            // component can shadow that property with an own value, causing the engine to invoke
            // the component-supplied function (with the privileged template `api`) instead of
            // `Function.prototype.call`. Invoking through the intrinsic `Reflect.apply` uses the
            // function's internal call behavior and ignores any own `call` property. Gated behind
            // a flag so the hardened path can be rolled out separately from the default behavior.
            vnodes = lwcRuntimeFlags.ENABLE_INTRINSIC_TEMPLATE_INVOCATION
                ? Reflect.apply(html, undefined, [api, component, cmpSlots, context.tplCache])
                : html.call(undefined, api, component, cmpSlots, context.tplCache);
            const { styleVNodes } = context;
            if (!isNull(styleVNodes)) {
                // It's important here not to mutate the underlying `vnodes` returned from the template invocation.
                // The reason for this is because, due to the static content optimization, the vnodes array
                // may be a static array shared across multiple component instances. E.g. this occurs in the
                // case of an empty `<template></template>` in a `component.html` file, due to the underlying
                // children being `[]` (no children). If we append the `<style>` vnode to this array, then the same
                // array will be reused for every component instance, i.e. whenever `tmpl()` is called.
                vnodes = [...styleVNodes, ...vnodes];
            }
        });
    }, () => {
        // post
        isUpdatingTemplate = isUpdatingTemplateInception;
        vmBeingRendered = vmOfTemplateBeingUpdatedInception;
    });
    return vnodes;
}
function computeHasScopedStylesInStylesheets(stylesheets) {
    if (hasStyles(stylesheets)) {
        for (let i = 0; i < stylesheets.length; i++) {
            if (isTrue(stylesheets[i][KEY__SCOPED_CSS])) {
                return true;
            }
        }
    }
    return false;
}
function computeHasScopedStyles(template, vm) {
    const { stylesheets } = template;
    const vmStylesheets = !isUndefined$1(vm) ? vm.stylesheets : null;
    return (computeHasScopedStylesInStylesheets(stylesheets) ||
        computeHasScopedStylesInStylesheets(vmStylesheets));
}
function hasStyles(stylesheets) {
    return !isUndefined$1(stylesheets) && !isNull(stylesheets) && stylesheets.length > 0;
}
let vmBeingConstructed = null;
function isBeingConstructed(vm) {
    return vmBeingConstructed === vm;
}
function invokeComponentCallback(vm, fn, args) {
    const { component, callHook, owner } = vm;
    runWithBoundaryProtection(vm, owner, noop, () => {
        callHook(component, fn, args);
    }, noop);
}
function invokeComponentConstructor(vm, Ctor) {
    const vmBeingConstructedInception = vmBeingConstructed;
    let error;
    vmBeingConstructed = vm;
    /**
     * Constructors don't need to be wrapped with a boundary because for root elements
     * it should throw, while elements from template are already wrapped by a boundary
     * associated to the diffing algo.
     */
    try {
        // job
        const result = new Ctor();
        // When strict, reject when the constructor returns a *native* HTMLElement — that is,
        // result instanceof HTMLElement.
        const useStrictValidation = !lwcRuntimeFlags.DISABLE_STRICT_VALIDATION && true;
        const isMismatchedConstructor = vmBeingConstructed.component !== result;
        const isInvalidConstructor = isMismatchedConstructor || (useStrictValidation && result instanceof HTMLElement);
        if (isInvalidConstructor) {
            throw new TypeError('Invalid component constructor, the class should extend LightningElement.');
        }
    }
    catch (e) {
        error = Object(e);
    }
    finally {
        vmBeingConstructed = vmBeingConstructedInception;
        if (!isUndefined$1(error)) {
            addErrorComponentStack(vm, error);
            // re-throwing the original error annotated after restoring the context
            throw error; // eslint-disable-line no-unsafe-finally
        }
    }
}
function invokeComponentRenderMethod(vm) {
    const { def: { render }, callHook, component, owner, } = vm;
    const vmBeingRenderedInception = getVMBeingRendered();
    let html;
    let renderInvocationSuccessful = false;
    runWithBoundaryProtection(vm, owner, () => {
        setVMBeingRendered(vm);
    }, () => {
        // job
        vm.tro.observe(() => {
            html = callHook(component, render);
            renderInvocationSuccessful = true;
        });
    }, () => {
        setVMBeingRendered(vmBeingRenderedInception);
    });
    // If render() invocation failed, process errorCallback in boundary and return an empty template
    return renderInvocationSuccessful ? evaluateTemplate(vm, html) : [];
}
function invokeEventListener(vm, fn, thisValue, event) {
    const { callHook, owner } = vm;
    runWithBoundaryProtection(vm, owner, noop, () => {
        // job
        if ("production" !== 'production') ;
        callHook(thisValue, fn, [event]);
    }, noop);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const registeredComponentMap = new Map();
/**
 * INTERNAL: This function can only be invoked by compiled code. The compiler
 * will prevent this function from being imported by userland code.
 * @param Ctor
 * @param metadata
 */
function registerComponent(
// We typically expect a LightningElementConstructor, but technically you can call this with anything
Ctor, metadata) {
    if (isFunction$1(Ctor)) {
        // TODO [#3331]: add validation to check the value of metadata.sel is not an empty string.
        registeredComponentMap.set(Ctor, metadata);
    }
    // chaining this method as a way to wrap existing assignment of component constructor easily,
    // without too much transformation
    return Ctor;
}
function getComponentRegisteredTemplate(Ctor) {
    return registeredComponentMap.get(Ctor)?.tmpl;
}
function getComponentRegisteredName(Ctor) {
    return registeredComponentMap.get(Ctor)?.sel;
}
function getComponentAPIVersion(Ctor) {
    const metadata = registeredComponentMap.get(Ctor);
    const apiVersion = metadata?.apiVersion;
    if (isUndefined$1(apiVersion)) {
        // This should only occur in our integration tests; in practice every component
        // is registered, and so this code path should not get hit. But to be safe,
        // return the lowest possible version.
        return LOWEST_API_VERSION;
    }
    return apiVersion;
}
function supportsSyntheticElementInternals(Ctor) {
    return registeredComponentMap.get(Ctor)?.enableSyntheticElementInternals || false;
}
function isComponentFeatureEnabled(Ctor) {
    const flag = registeredComponentMap.get(Ctor)?.componentFeatureFlag;
    // Default to true if not provided
    return flag?.value !== false;
}
function getComponentMetadata(Ctor) {
    return registeredComponentMap.get(Ctor);
}
function getTemplateReactiveObserver(vm) {
    const reactiveObserver = createReactiveObserver(() => {
        const { isDirty } = vm;
        if (isFalse(isDirty)) {
            markComponentAsDirty(vm);
            scheduleRehydration(vm);
        }
    });
    return reactiveObserver;
}
function resetTemplateObserverAndUnsubscribe(vm) {
    const { tro, component } = vm;
    tro.reset();
    // Unsubscribe every time the template reactive observer is reset.
    if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS) {
        unsubscribeFromSignals(component);
    }
}
function renderComponent(vm) {
    // The engine should only hold a subscription to a signal if it is rendered in the template.
    // Because of the potential presence of conditional rendering logic, we unsubscribe on each render
    // in the scenario where it is present in one condition but not the other.
    // For example:
    // 1. There is an lwc:if=true conditional where the signal is present on the template.
    // 2. The lwc:if changes to false and the signal is no longer present on the template.
    // If the signal is still subscribed to, the template will re-render when it receives a notification
    // from the signal, even though we won't be using the new value.
    resetTemplateObserverAndUnsubscribe(vm);
    const vnodes = invokeComponentRenderMethod(vm);
    vm.isDirty = false;
    vm.isScheduled = false;
    return vnodes;
}
function markComponentAsDirty(vm) {
    vm.isDirty = true;
}
const cmpEventListenerMap = new WeakMap();
function getWrappedComponentsListener(vm, listener) {
    if (!isFunction$1(listener)) {
        throw new TypeError('Expected an EventListener but received ' + typeof listener); // avoiding problems with non-valid listeners
    }
    let wrappedListener = cmpEventListenerMap.get(listener);
    if (isUndefined$1(wrappedListener)) {
        wrappedListener = function (event) {
            invokeEventListener(vm, listener, undefined, event);
        };
        cmpEventListenerMap.set(listener, wrappedListener);
    }
    return wrappedListener;
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (typeof state === "function" ? receiver !== state || true : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _ContextBinding_renderer, _ContextBinding_providedContextVarieties, _ContextBinding_elm;
// Provider-listener teardowns per VM, registered on connect and invoked on disconnect. Without this
// the listener closures retain the detached component after every mount/unmount.
const contextProviderUnregisters = new WeakMap();
class ContextBinding {
    constructor(vm, component, providedContextVarieties) {
        _ContextBinding_renderer.set(this, void 0);
        _ContextBinding_providedContextVarieties.set(this, void 0);
        _ContextBinding_elm.set(this, void 0);
        this.component = component;
        __classPrivateFieldSet(this, _ContextBinding_renderer, vm.renderer);
        __classPrivateFieldSet(this, _ContextBinding_elm, vm.elm);
        __classPrivateFieldSet(this, _ContextBinding_providedContextVarieties, providedContextVarieties);
        // Register the component as a context provider.
        const unregister = __classPrivateFieldGet(this, _ContextBinding_renderer, "f").registerContextProvider(__classPrivateFieldGet(this, _ContextBinding_elm, "f"), ContextEventName, (contextConsumer) => {
            // This callback is invoked when the provided context is consumed somewhere down
            // in the component's subtree.
            return contextConsumer.setNewContext(__classPrivateFieldGet(this, _ContextBinding_providedContextVarieties, "f"));
        });
        // deprecated engine-server doesn't provide `unregister`
        if (unregister) {
            const unregisters = contextProviderUnregisters.get(vm);
            if (isUndefined$1(unregisters)) {
                contextProviderUnregisters.set(vm, [unregister]);
            }
            else {
                ArrayPush$1.call(unregisters, unregister);
            }
        }
    }
    provideContext(contextVariety, providedContextSignal) {
        if (__classPrivateFieldGet(this, _ContextBinding_providedContextVarieties, "f").has(contextVariety)) {
            logWarnOnce('Multiple contexts of the same variety were provided. Only the first context will be used.');
            return;
        }
        __classPrivateFieldGet(this, _ContextBinding_providedContextVarieties, "f").set(contextVariety, providedContextSignal);
    }
    consumeContext(contextVariety, contextProvidedCallback) {
        __classPrivateFieldGet(this, _ContextBinding_renderer, "f").registerContextConsumer(__classPrivateFieldGet(this, _ContextBinding_elm, "f"), ContextEventName, {
            setNewContext: (providerContextVarieties) => {
                // If the provider has the specified context variety, then it is consumed
                // and true is returned to stop bubbling.
                if (providerContextVarieties.has(contextVariety)) {
                    contextProvidedCallback(providerContextVarieties.get(contextVariety));
                    return true;
                }
                // Return false as context has not been found/consumed
                // and the consumer should continue traversing the context tree
                return false;
            },
        });
    }
}
_ContextBinding_renderer = new WeakMap(), _ContextBinding_providedContextVarieties = new WeakMap(), _ContextBinding_elm = new WeakMap();
function connectContext(vm) {
    // Non-decorated objects
    connect(vm, keys(vm.cmpFields), vm.cmpFields);
    // Decorated objects like @api context
    connect(vm, keys(vm.cmpProps), vm.cmpProps);
}
function disconnectContext(vm) {
    // Non-decorated objects
    disconnect(vm, keys(vm.cmpFields), vm.cmpFields);
    // Decorated objects like @api context
    disconnect(vm, keys(vm.cmpProps), vm.cmpProps);
    // Remove the provider listeners registered on connect.
    const unregisters = contextProviderUnregisters.get(vm);
    if (!isUndefined$1(unregisters)) {
        for (let i = 0; i < unregisters.length; i++) {
            unregisters[i]();
        }
        contextProviderUnregisters.delete(vm);
    }
}
function connect(vm, enumerableKeys, contextContainer) {
    const contextKeys = getContextKeys();
    if (isUndefined$1(contextKeys)) {
        return;
    }
    const { connectContext } = contextKeys;
    const { component } = vm;
    const contextfulKeys = ArrayFilter.call(enumerableKeys, (enumerableKey) => isTrustedContext(contextContainer[enumerableKey]));
    if (contextfulKeys.length === 0) {
        return;
    }
    const providedContextVarieties = new Map();
    try {
        for (let i = 0; i < contextfulKeys.length; i++) {
            contextContainer[contextfulKeys[i]][connectContext](new ContextBinding(vm, component, providedContextVarieties));
        }
    }
    catch (err) {
        logWarnOnce(`Attempted to connect to trusted context but received the following error: ${err.message}`);
    }
}
function disconnect(vm, enumerableKeys, contextContainer) {
    {
        return;
    }
}

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
let idx = 0;
/** The internal slot used to associate different objects the engine manipulates with the VM */
const ViewModelReflection = new WeakMap();
function callHook(cmp, fn, args = []) {
    return fn.apply(cmp, args);
}
function setHook(cmp, prop, newValue) {
    cmp[prop] = newValue;
}
function getHook(cmp, prop) {
    return cmp[prop];
}
function rerenderVM(vm) {
    rehydrate(vm);
}
function connectRootElement(elm) {
    const vm = getAssociatedVM(elm);
    // Usually means moving the element from one place to another, which is observable via
    // life-cycle hooks.
    if (vm.state === 1 /* VMState.connected */) {
        disconnectRootElement(elm);
    }
    runConnectedCallback(vm);
    rehydrate(vm);
}
function disconnectRootElement(elm) {
    const vm = getAssociatedVM(elm);
    resetComponentStateWhenRemoved(vm);
}
function appendVM(vm) {
    rehydrate(vm);
}
// just in case the component comes back, with this we guarantee re-rendering it
// while preventing any attempt to rehydration until after reinsertion.
function resetComponentStateWhenRemoved(vm) {
    const { state } = vm;
    if (state !== 2 /* VMState.disconnected */) {
        // Making sure that any observing record will not trigger the rehydrated on this vm
        resetTemplateObserverAndUnsubscribe(vm);
        runDisconnectedCallback(vm);
        // Spec: https://dom.spec.whatwg.org/#concept-node-remove (step 14-15)
        runChildNodesDisconnectedCallback(vm);
        runLightChildNodesDisconnectedCallback(vm);
    }
}
// this method is triggered by the diffing algo only when a vnode from the
// old vnode.children is removed from the DOM.
function removeVM(vm) {
    resetComponentStateWhenRemoved(vm);
}
function getNearestShadowAncestor(owner) {
    let ancestor = owner;
    while (!isNull(ancestor) && ancestor.renderMode === 0 /* RenderMode.Light */) {
        ancestor = ancestor.owner;
    }
    return ancestor;
}
function createVM(elm, ctor, renderer, options) {
    const { mode, owner, tagName, hydrated } = options;
    const def = getComponentInternalDef(ctor);
    const apiVersion = getComponentAPIVersion(ctor);
    const vm = {
        elm,
        def,
        idx: idx++,
        state: 0 /* VMState.created */,
        isScheduled: false,
        isDirty: true,
        tagName,
        mode,
        owner,
        refVNodes: null,
        attachedEventListeners: new WeakMap(),
        children: EmptyArray,
        aChildren: EmptyArray,
        velements: EmptyArray,
        cmpProps: create(null),
        cmpFields: create(null),
        cmpSlots: { slotAssignments: create(null) },
        cmpTemplate: null,
        hydrated: Boolean(hydrated),
        renderMode: def.renderMode,
        context: {
            stylesheetToken: undefined,
            hasTokenInClass: undefined,
            hasTokenInAttribute: undefined,
            legacyStylesheetToken: undefined,
            hasLegacyTokenInClass: undefined,
            hasLegacyTokenInAttribute: undefined,
            hasScopedStyles: undefined,
            styleVNodes: null,
            tplCache: EmptyObject,
            wiredConnecting: EmptyArray,
            wiredDisconnecting: EmptyArray,
        },
        // Properties set right after VM creation.
        tro: null,
        shadowMode: null,
        stylesheets: null,
        // Properties set by the LightningElement constructor.
        component: null,
        shadowRoot: null,
        renderRoot: null,
        callHook,
        setHook,
        getHook,
        renderer,
        apiVersion,
    };
    vm.stylesheets = computeStylesheets(vm, def.ctor);
    vm.shadowMode = computeShadowMode(def, vm.owner, renderer, hydrated);
    vm.tro = getTemplateReactiveObserver(vm);
    // Create component instance associated to the vm and the element.
    invokeComponentConstructor(vm, def.ctor);
    // Initializing the wire decorator per instance only when really needed
    if (hasWireAdapters(vm)) {
        installWireAdapters(vm);
    }
    return vm;
}
function validateComponentStylesheets(vm, stylesheets) {
    let valid = true;
    const validate = (arrayOrStylesheet) => {
        if (isArray$1(arrayOrStylesheet)) {
            for (let i = 0; i < arrayOrStylesheet.length; i++) {
                validate(arrayOrStylesheet[i]);
            }
        }
        else if (!isFunction$1(arrayOrStylesheet)) {
            // function assumed to be a stylesheet factory
            valid = false;
        }
    };
    if (!isArray$1(stylesheets)) {
        valid = false;
    }
    else {
        validate(stylesheets);
    }
    return valid;
}
// Validate and flatten any stylesheets defined as `static stylesheets`
function computeStylesheets(vm, ctor) {
    const { stylesheets } = ctor;
    if (!isUndefined$1(stylesheets)) {
        const valid = validateComponentStylesheets(vm, stylesheets);
        if (valid) {
            return flattenStylesheets(stylesheets);
        }
    }
    return null;
}
// Compute the shadowMode/renderMode without creating a VM. This is used in some scenarios like hydration.
function computeShadowAndRenderMode(Ctor, renderer) {
    const def = getComponentInternalDef(Ctor);
    const { renderMode } = def;
    // Assume null `owner` - this is what happens in hydration cases anyway
    // Also assume we are not in hydration mode for this exported API
    const shadowMode = computeShadowMode(def, /* owner */ null, renderer, false);
    return { renderMode, shadowMode };
}
function computeShadowMode(def, owner, renderer, hydrated) {
    if (
    // Force the shadow mode to always be native. Used for running tests with synthetic shadow patches
    // on, but components running in actual native shadow mode
    // If synthetic shadow is explicitly disabled, use pure-native
        lwcRuntimeFlags.DISABLE_SYNTHETIC_SHADOW ||
        // hydration only supports native shadow
        isTrue(hydrated)) {
        return 0 /* ShadowMode.Native */;
    }
    const { isSyntheticShadowDefined } = renderer;
    let shadowMode;
    if (isSyntheticShadowDefined) {
        if (def.renderMode === 0 /* RenderMode.Light */) {
            // ShadowMode.Native implies "not synthetic shadow" which is consistent with how
            // everything defaults to native when the synthetic shadow polyfill is unavailable.
            shadowMode = 0 /* ShadowMode.Native */;
        }
        else if (def.shadowSupportMode === 'native') {
            shadowMode = 0 /* ShadowMode.Native */;
        }
        else {
            const shadowAncestor = getNearestShadowAncestor(owner);
            if (!isNull(shadowAncestor) && shadowAncestor.shadowMode === 0 /* ShadowMode.Native */) {
                // Transitive support for native Shadow DOM. A component in native mode
                // transitively opts all of its descendants into native.
                shadowMode = 0 /* ShadowMode.Native */;
            }
            else {
                // Synthetic if neither this component nor any of its ancestors are configured
                // to be native.
                shadowMode = 1 /* ShadowMode.Synthetic */;
            }
        }
    }
    else {
        // Native if the synthetic shadow polyfill is unavailable.
        shadowMode = 0 /* ShadowMode.Native */;
    }
    return shadowMode;
}
function associateVM(obj, vm) {
    ViewModelReflection.set(obj, vm);
}
function getAssociatedVM(obj) {
    const vm = ViewModelReflection.get(obj);
    return vm;
}
function getAssociatedVMIfPresent(obj) {
    const maybeVm = ViewModelReflection.get(obj);
    return maybeVm;
}
function rehydrate(vm) {
    if (isTrue(vm.isDirty)) {
        const children = renderComponent(vm);
        patchShadowRoot(vm, children);
    }
}
function patchShadowRoot(vm, newCh) {
    const { renderRoot, children: oldCh, renderer } = vm;
    // reset the refs; they will be set during `patchChildren`
    resetRefVNodes(vm);
    // caching the new children collection
    vm.children = newCh;
    if (newCh.length > 0 || oldCh.length > 0) {
        // patch function mutates vnodes by adding the element reference,
        // however, if patching fails it contains partial changes.
        if (oldCh !== newCh) {
            runWithBoundaryProtection(vm, vm, () => {
            }, () => {
                // job
                patchChildren(oldCh, newCh, renderRoot, renderer);
            }, () => {
            });
        }
    }
    if (vm.state === 1 /* VMState.connected */) {
        // If the element is connected, that means connectedCallback was already issued, and
        // any successive rendering should finish with the call to renderedCallback, otherwise
        // the connectedCallback will take care of calling it in the right order at the end of
        // the current rehydration process.
        runRenderedCallback(vm);
    }
}
function runRenderedCallback(vm) {
    const { def: { renderedCallback }, } = vm;
    if (!isUndefined$1(renderedCallback)) {
        invokeComponentCallback(vm, renderedCallback);
    }
}
let rehydrateQueue = [];
function flushRehydrationQueue() {
    const vms = rehydrateQueue.sort((a, b) => a.idx - b.idx);
    rehydrateQueue = []; // reset to a new queue
    for (let i = 0, len = vms.length; i < len; i += 1) {
        const vm = vms[i];
        try {
            // We want to prevent rehydration from occurring when nodes are detached from the DOM as this can trigger
            // unintended side effects, like lifecycle methods being called multiple times.
            // For backwards compatibility, we use a flag to control the check.
            // 1. When flag is off, always rehydrate (legacy behavior)
            // 2. When flag is on, only rehydrate when the VM state is connected (fixed behavior)
            if (!lwcRuntimeFlags.DISABLE_DETACHED_REHYDRATION || vm.state === 1 /* VMState.connected */) {
                rehydrate(vm);
            }
        }
        catch (error) {
            if (i + 1 < len) {
                // pieces of the queue are still pending to be rehydrated, those should have priority
                if (rehydrateQueue.length === 0) {
                    addCallbackToNextTick(flushRehydrationQueue);
                }
                ArrayUnshift.apply(rehydrateQueue, ArraySlice.call(vms, i + 1));
            }
            // re-throwing the original error will break the current tick, but since the next tick is
            // already scheduled, it should continue patching the rest.
            throw error;
        }
    }
}
function runConnectedCallback(vm) {
    const { state } = vm;
    if (state === 1 /* VMState.connected */) {
        return; // nothing to do since it was already connected
    }
    vm.state = 1 /* VMState.connected */;
    if (hasWireAdapters(vm)) {
        connectWireAdapters(vm);
    }
    if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS) {
        // Setup context before connected callback is executed
        connectContext(vm);
    }
    const { connectedCallback } = vm.def;
    if (!isUndefined$1(connectedCallback)) {
        invokeComponentCallback(vm, connectedCallback);
    }
    // This test only makes sense in the browser, with synthetic lifecycle, and when reporting is enabled or
    // we're in dev mode. This is to detect a particular issue with synthetic lifecycle.
    if (lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE &&
        (isReportingEnabled())) ;
}
function hasWireAdapters(vm) {
    return getOwnPropertyNames$1(vm.def.wire).length > 0;
}
function runDisconnectedCallback(vm) {
    if (lwcRuntimeFlags.ENABLE_EXPERIMENTAL_SIGNALS) {
        disconnectContext(vm);
    }
    if (isFalse(vm.isDirty)) {
        // this guarantees that if the component is reused/reinserted,
        // it will be re-rendered because we are disconnecting the reactivity
        // linking, so mutations are not automatically reflected on the state
        // of disconnected components.
        vm.isDirty = true;
    }
    vm.state = 2 /* VMState.disconnected */;
    if (hasWireAdapters(vm)) {
        disconnectWireAdapters(vm);
    }
    const { disconnectedCallback } = vm.def;
    if (!isUndefined$1(disconnectedCallback)) {
        invokeComponentCallback(vm, disconnectedCallback);
    }
}
function runChildNodesDisconnectedCallback(vm) {
    const { velements: vCustomElementCollection } = vm;
    // Reporting disconnection for every child in inverse order since they are
    // inserted in reserved order.
    for (let i = vCustomElementCollection.length - 1; i >= 0; i -= 1) {
        const { elm } = vCustomElementCollection[i];
        // There are two cases where the element could be undefined:
        // * when there is an error during the construction phase, and an error
        //   boundary picks it, there is a possibility that the VCustomElement
        //   is not properly initialized, and therefore is should be ignored.
        // * when slotted custom element is not used by the element where it is
        //   slotted into it, as  a result, the custom element was never
        //   initialized.
        if (!isUndefined$1(elm)) {
            const childVM = getAssociatedVMIfPresent(elm);
            // The VM associated with the element might be associated undefined
            // in the case where the VM failed in the middle of its creation,
            // eg: constructor throwing before invoking super().
            if (!isUndefined$1(childVM)) {
                resetComponentStateWhenRemoved(childVM);
            }
        }
    }
}
function runLightChildNodesDisconnectedCallback(vm) {
    const { aChildren: adoptedChildren } = vm;
    recursivelyDisconnectChildren(adoptedChildren);
}
/**
 * The recursion doesn't need to be a complete traversal of the vnode graph,
 * instead it can be partial, when a custom element vnode is found, we don't
 * need to continue into its children because by attempting to disconnect the
 * custom element itself will trigger the removal of anything slotted or anything
 * defined on its shadow.
 * @param vnodes
 */
function recursivelyDisconnectChildren(vnodes) {
    for (let i = 0, len = vnodes.length; i < len; i += 1) {
        const vnode = vnodes[i];
        if (!isNull(vnode) && !isUndefined$1(vnode.elm)) {
            switch (vnode.type) {
                case 2 /* VNodeType.Element */:
                    recursivelyDisconnectChildren(vnode.children);
                    break;
                case 3 /* VNodeType.CustomElement */: {
                    const vm = getAssociatedVM(vnode.elm);
                    resetComponentStateWhenRemoved(vm);
                    break;
                }
            }
        }
    }
}
// This is a super optimized mechanism to remove the content of the root node (shadow root
// for shadow DOM components and the root element itself for light DOM) without having to go
// into snabbdom. Especially useful when the reset is a consequence of an error, in which case the
// children VNodes might not be representing the current state of the DOM.
function resetComponentRoot(vm) {
    recursivelyRemoveChildren(vm.children, vm);
    vm.children = EmptyArray;
    runChildNodesDisconnectedCallback(vm);
    vm.velements = EmptyArray;
}
// Helper function to remove all children of the root node.
// If the set of children includes VFragment nodes, we need to remove the children of those nodes too.
// Since VFragments can contain other VFragments, we need to traverse the entire of tree of VFragments.
// If the set contains no VFragment nodes, no traversal is needed.
function recursivelyRemoveChildren(vnodes, vm) {
    const { renderRoot, renderer: { remove }, } = vm;
    for (let i = 0, len = vnodes.length; i < len; i += 1) {
        const vnode = vnodes[i];
        if (!isNull(vnode)) {
            // VFragments are special; their .elm property does not point to the root element since they have no single root.
            if (isVFragment(vnode)) {
                recursivelyRemoveChildren(vnode.children, vm);
            }
            else if (!isUndefined$1(vnode.elm)) {
                remove(vnode.elm, renderRoot);
            }
        }
    }
}
function scheduleRehydration(vm) {
    if (isTrue(vm.isScheduled)) {
        return;
    }
    vm.isScheduled = true;
    if (rehydrateQueue.length === 0) {
        addCallbackToNextTick(flushRehydrationQueue);
    }
    ArrayPush$1.call(rehydrateQueue, vm);
}
function getErrorBoundaryVM(vm) {
    let currentVm = vm;
    while (!isNull(currentVm)) {
        if (!isUndefined$1(currentVm.def.errorCallback)) {
            return currentVm;
        }
        currentVm = currentVm.owner;
    }
}
function runWithBoundaryProtection(vm, owner, pre, job, post) {
    let error;
    pre();
    try {
        job();
    }
    catch (e) {
        error = Object(e);
    }
    finally {
        post();
        if (!isUndefined$1(error)) {
            addErrorComponentStack(vm, error);
            const errorBoundaryVm = isNull(owner) ? undefined : getErrorBoundaryVM(owner);
            // Error boundaries are not in effect when server-side rendering. `errorCallback`
            // is intended to allow recovery from errors - changing the state of a component
            // and instigating a re-render. That is at odds with the single-pass, synchronous
            // nature of SSR. For that reason, all errors bubble up to the `renderComponent`
            // call site.
            if (isUndefined$1(errorBoundaryVm)) {
                throw error; // eslint-disable-line no-unsafe-finally
            }
            resetComponentRoot(vm); // remove offenders
            // error boundaries must have an ErrorCallback
            const errorCallback = errorBoundaryVm.def.errorCallback;
            invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);
        }
    }
}
function runFormAssociatedCustomElementCallback(vm, faceCb, args) {
    const { renderMode, shadowMode, def: { ctor }, } = vm;
    if (shadowMode === 1 /* ShadowMode.Synthetic */ &&
        renderMode !== 0 /* RenderMode.Light */ &&
        !supportsSyntheticElementInternals(ctor)) {
        throw new Error('Form associated lifecycle methods are not available in synthetic shadow. Please use native shadow or light DOM.');
    }
    invokeComponentCallback(vm, faceCb, args);
}
function runFormAssociatedCallback(elm, form) {
    const vm = getAssociatedVM(elm);
    const { formAssociatedCallback } = vm.def;
    if (!isUndefined$1(formAssociatedCallback)) {
        runFormAssociatedCustomElementCallback(vm, formAssociatedCallback, [form]);
    }
}
function runFormDisabledCallback(elm, disabled) {
    const vm = getAssociatedVM(elm);
    const { formDisabledCallback } = vm.def;
    if (!isUndefined$1(formDisabledCallback)) {
        runFormAssociatedCustomElementCallback(vm, formDisabledCallback, [disabled]);
    }
}
function runFormResetCallback(elm) {
    const vm = getAssociatedVM(elm);
    const { formResetCallback } = vm.def;
    if (!isUndefined$1(formResetCallback)) {
        runFormAssociatedCustomElementCallback(vm, formResetCallback);
    }
}
function runFormStateRestoreCallback(elm, state, reason) {
    const vm = getAssociatedVM(elm);
    const { formStateRestoreCallback } = vm.def;
    if (!isUndefined$1(formStateRestoreCallback)) {
        runFormAssociatedCustomElementCallback(vm, formStateRestoreCallback, [state, reason]);
    }
}
function resetRefVNodes(vm) {
    const { cmpTemplate } = vm;
    vm.refVNodes = !isNull(cmpTemplate) && cmpTemplate.hasRefs ? create(null) : null;
}
// This is a "handoff" from synthetic-shadow to engine-core – we want to clean up after ourselves
// so nobody else can misuse these global APIs.
delete globalThis[KEY__NATIVE_GET_ELEMENT_BY_ID];
delete globalThis[KEY__NATIVE_QUERY_SELECTOR_ALL];
// Our detection logic relies on some modern browser features. We can just skip reporting the data
// for unsupported browsers
function supportsCssEscape() {
    return typeof CSS !== 'undefined' && isFunction$1(CSS.escape);
}
// If this page is not using synthetic shadow, then we don't need to install detection. Note
// that we are assuming synthetic shadow is loaded before LWC.
function isSyntheticShadowLoaded() {
    // We should probably be calling `renderer.isSyntheticShadowDefined`, but 1) we don't have access to the renderer,
    // and 2) this code needs to run in @lwc/engine-core, so it can access `logWarn()` and `report()`.
    return hasOwnProperty$1.call(Element.prototype, KEY__SHADOW_TOKEN);
}
// Detecting cross-root ARIA in synthetic shadow only makes sense for the browser
if (supportsCssEscape() && isSyntheticShadowLoaded()) ;
// Deeply freeze the entire array (of arrays) of stylesheet factory functions
function deepFreeze(stylesheets) {
    traverseStylesheets(stylesheets, (subStylesheets) => {
        freeze(subStylesheets);
    });
}
// Deep-traverse an array (of arrays) of stylesheet factory functions, and call the callback for every array/function
function traverseStylesheets(stylesheets, callback) {
    callback(stylesheets);
    for (let i = 0; i < stylesheets.length; i++) {
        const stylesheet = stylesheets[i];
        if (isArray$1(stylesheet)) {
            traverseStylesheets(stylesheet, callback);
        }
        else {
            callback(stylesheet);
        }
    }
}
function addLegacyStylesheetTokensShim(tmpl) {
    // When ENABLE_FROZEN_TEMPLATE is false, then we shim stylesheetTokens on top of stylesheetToken for anyone who
    // is accessing the old internal API (backwards compat). Details: W-14210169
    defineProperty(tmpl, 'stylesheetTokens', {
        enumerable: true,
        configurable: true,
        get() {
            const { stylesheetToken } = this;
            if (isUndefined$1(stylesheetToken)) {
                return stylesheetToken;
            }
            // Shim for the old `stylesheetTokens` property
            // See https://github.com/salesforce/lwc/pull/2332/files#diff-7901555acef29969adaa6583185b3e9bce475cdc6f23e799a54e0018cb18abaa
            return {
                hostAttribute: `${stylesheetToken}-host`,
                shadowAttribute: stylesheetToken,
            };
        },
        set(value) {
            // If the value is null or some other exotic object, you would be broken anyway in the past
            // because the engine would try to access hostAttribute/shadowAttribute, which would throw an error.
            // However it may be undefined in newer versions of LWC, so we need to guard against that case.
            this.stylesheetToken = isUndefined$1(value) ? undefined : value.shadowAttribute;
        },
    });
}
function freezeTemplate(tmpl) {
    // TODO [#2782]: remove this flag and delete the legacy behavior
    if (lwcRuntimeFlags.ENABLE_FROZEN_TEMPLATE) {
        // Deep freeze the template
        freeze(tmpl);
        if (!isUndefined$1(tmpl.stylesheets)) {
            deepFreeze(tmpl.stylesheets);
        }
    }
    else {
        // template is not frozen - shim, report, and warn
        // this shim should be applied in both dev and prod
        addLegacyStylesheetTokensShim(tmpl);
    }
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
//
// Feature detection
//
// This check for constructable style sheets is similar to Fast's:
// https://github.com/microsoft/fast/blob/d49d1ec/packages/web-components/fast-element/src/dom.ts#L51-L53
// See also: https://github.com/whatwg/webidl/issues/1027#issuecomment-934510070
const supportsConstructableStylesheets = isFunction$1(CSSStyleSheet.prototype.replaceSync) && isArray$1(document.adoptedStyleSheets);
const stylesheetCache = new Map();
function createFreshStyleElement(content) {
    const elm = document.createElement('style');
    elm.type = 'text/css';
    elm.textContent = content;
    // Add an attribute to distinguish global styles added by LWC as opposed to other frameworks/libraries on the page
    elm.setAttribute('data-rendered-by-lwc', '');
    return elm;
}
function createStyleElement(content, cacheData) {
    const { element, usedElement } = cacheData;
    // If the <style> was already used, then we should clone it. We cannot insert
    // the same <style> in two places in the DOM.
    if (usedElement) {
        // This `<style>` may be repeated multiple times in the DOM, so cache it. It's a bit
        // faster to call `cloneNode()` on an existing node than to recreate it every time.
        return element.cloneNode(true);
    }
    // We don't clone every time, because that would be a perf tax on the first time
    cacheData.usedElement = true;
    return element;
}
function createConstructableStylesheet(content) {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(content);
    return stylesheet;
}
function insertConstructableStylesheet(content, target, cacheData, signal) {
    const { adoptedStyleSheets } = target;
    const { stylesheet } = cacheData;
    // The reason we prefer .push() rather than reassignment is for perf: https://github.com/salesforce/lwc/pull/2683
    adoptedStyleSheets.push(stylesheet);
}
function insertStyleElement(content, target, cacheData, signal) {
    const elm = createStyleElement(content, cacheData);
    target.appendChild(elm);
}
function getCacheData(content, useConstructableStylesheet) {
    let cacheData = stylesheetCache.get(content);
    if (isUndefined$1(cacheData)) {
        cacheData = {
            stylesheet: undefined,
            element: undefined,
            roots: undefined,
            global: false,
            usedElement: false,
        };
        stylesheetCache.set(content, cacheData);
    }
    // Create <style> elements or CSSStyleSheets on-demand, as needed
    if (useConstructableStylesheet && isUndefined$1(cacheData.stylesheet)) {
        cacheData.stylesheet = createConstructableStylesheet(content);
    }
    else if (!useConstructableStylesheet && isUndefined$1(cacheData.element)) {
        cacheData.element = createFreshStyleElement(content);
    }
    return cacheData;
}
function insertGlobalStylesheet(content, signal) {
    // Force a <style> element for global stylesheets. See comment below.
    const cacheData = getCacheData(content, false);
    if (cacheData.global) {
        // already inserted
        return;
    }
    cacheData.global = true; // mark inserted
    // TODO [#2922]: use document.adoptedStyleSheets in supported browsers. Currently we can't, due to backwards compat.
    insertStyleElement(content, document.head, cacheData);
}
function insertLocalStylesheet(content, target, signal) {
    const cacheData = getCacheData(content, supportsConstructableStylesheets);
    let { roots } = cacheData;
    if (isUndefined$1(roots)) {
        roots = cacheData.roots = new WeakSet(); // lazily initialize (not needed for global styles)
    }
    else if (roots.has(target)) {
        // already inserted
        return;
    }
    roots.add(target); // mark inserted
    // Constructable stylesheets are only supported in certain browsers:
    // https://caniuse.com/mdn-api_document_adoptedstylesheets
    // The reason we use it is for perf: https://github.com/salesforce/lwc/pull/2460
    if (supportsConstructableStylesheets) {
        insertConstructableStylesheet(content, target, cacheData);
    }
    else {
        // Fall back to <style> element
        insertStyleElement(content, target, cacheData);
    }
}
/**
 * Injects a stylesheet into the global (document) level or inside a shadow root.
 * @param content CSS content to insert
 * @param target ShadowRoot to insert into, or undefined if global (document) level
 * @param signal AbortSignal for aborting the stylesheet render. Used in dev mode for HMR to unrender stylesheets.
 */
function insertStylesheet(content, target, signal) {
    if (isUndefined$1(target)) {
        // global
        insertGlobalStylesheet(content);
    }
    else {
        // local
        insertLocalStylesheet(content, target);
    }
}

/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const cachedConstructors = new Map();
const nativeLifecycleElementsToUpgradedByLWC = new WeakMap();
let elementBeingUpgradedByLWC = false;
let BaseUpgradableConstructor;
let BaseHTMLElement;
function createBaseUpgradableConstructor() {
    // Creates a constructor that is intended to be used directly as a custom element, except that the upgradeCallback is
    // passed in to the constructor so LWC can reuse the same custom element constructor for multiple components.
    // Another benefit is that only LWC can create components that actually do anything – if you do
    // `customElements.define('x-foo')`, then you don't have access to the upgradeCallback, so it's a dummy custom element.
    // This class should be created once per tag name.
    // TODO [#2972]: this class should expose observedAttributes as necessary
    BaseUpgradableConstructor = class TheBaseUpgradableConstructor extends HTMLElement {
        constructor(upgradeCallback, useNativeLifecycle) {
            super();
            if (useNativeLifecycle) {
                // When in native lifecycle mode, we need to keep track of instances that were created outside LWC
                // (i.e. not created by `lwc.createElement()`). If the element uses synthetic lifecycle, then we don't
                // need to track this.
                nativeLifecycleElementsToUpgradedByLWC.set(this, elementBeingUpgradedByLWC);
            }
            // If the element is not created using lwc.createElement(), e.g. `document.createElement('x-foo')`,
            // then elementBeingUpgradedByLWC will be false
            if (elementBeingUpgradedByLWC) {
                upgradeCallback(this);
            }
            // TODO [#2970]: LWC elements cannot be upgraded via new Ctor()
            // Do we want to support this? Throw an error? Currently for backwards compat it's a no-op.
        }
        connectedCallback() {
            // native `connectedCallback`/`disconnectedCallback` are only enabled in native lifecycle mode
            if (isTrue(nativeLifecycleElementsToUpgradedByLWC.get(this))) {
                connectRootElement(this);
            }
        }
        disconnectedCallback() {
            // native `connectedCallback`/`disconnectedCallback` are only enabled in native lifecycle mode
            if (isTrue(nativeLifecycleElementsToUpgradedByLWC.get(this))) {
                disconnectRootElement(this);
            }
        }
        formAssociatedCallback(form) {
            runFormAssociatedCallback(this, form);
        }
        formDisabledCallback(disabled) {
            runFormDisabledCallback(this, disabled);
        }
        formResetCallback() {
            runFormResetCallback(this);
        }
        formStateRestoreCallback(state, reason) {
            runFormStateRestoreCallback(this, state, reason);
        }
    };
    BaseHTMLElement = HTMLElement; // cache to track if it changes
}
const createUpgradableConstructor = (isFormAssociated) => {
    if (HTMLElement !== BaseHTMLElement) {
        // If the global HTMLElement changes out from under our feet, then we need to create a new
        // BaseUpgradableConstructor from scratch (since it extends from HTMLElement). This can occur if
        // polyfills are in play, e.g. a polyfill for scoped custom element registries.
        // This workaround can potentially be removed when W-15361244 is resolved.
        createBaseUpgradableConstructor();
    }
    // Using a BaseUpgradableConstructor superclass here is a perf optimization to avoid
    // re-defining the same logic (connectedCallback, disconnectedCallback, etc.) over and over.
    class UpgradableConstructor extends BaseUpgradableConstructor {
    }
    if (isFormAssociated) {
        // Perf optimization - the vast majority of components have formAssociated=false,
        // so we can skip the setter in those cases, since undefined works the same as false.
        UpgradableConstructor.formAssociated = isFormAssociated;
    }
    return UpgradableConstructor;
};
function getUpgradableConstructor(tagName, isFormAssociated) {
    let UpgradableConstructor = cachedConstructors.get(tagName);
    if (isUndefined$1(UpgradableConstructor)) {
        if (!isUndefined$1(customElements.get(tagName))) {
            throw new Error(`Unexpected tag name "${tagName}". This name is a registered custom element, preventing LWC to upgrade the element.`);
        }
        UpgradableConstructor = createUpgradableConstructor(isFormAssociated);
        customElements.define(tagName, UpgradableConstructor);
        cachedConstructors.set(tagName, UpgradableConstructor);
    }
    return UpgradableConstructor;
}
const createCustomElement = (tagName, upgradeCallback, useNativeLifecycle, isFormAssociated) => {
    const UpgradableConstructor = getUpgradableConstructor(tagName, isFormAssociated);
    if (Boolean(UpgradableConstructor.formAssociated) !== isFormAssociated) {
        throw new Error(`<${tagName}> was already registered with formAssociated=${UpgradableConstructor.formAssociated}. It cannot be re-registered with formAssociated=${isFormAssociated}. Please rename your component to have a different name than <${tagName}>`);
    }
    elementBeingUpgradedByLWC = true;
    try {
        return new UpgradableConstructor(upgradeCallback, useNativeLifecycle);
    }
    finally {
        elementBeingUpgradedByLWC = false;
    }
};

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
/**
 * A factory function that produces a renderer.
 * Renderer encapsulates operations that are required to render an LWC component into the underlying
 * runtime environment. In the case of @lwc/enigne-dom, it is meant to be used in a DOM environment.
 * @param baseRenderer Either null or the base renderer imported from 'lwc'.
 * @returns The created renderer
 * @example
 * import { renderer, rendererFactory } from 'lwc';
 * const customRenderer = rendererFactory(renderer);
 */
function rendererFactory(baseRenderer) {
    // Invariant (W-23814927): this factory is expected to build a renderer exactly once per realm — the
    // engine's own bootstrap of the base `renderer`. `globalThis.__lwcRendererFactoryInvoked` records
    // that a renderer has already been produced; when `ENABLE_RENDERER_FACTORY_GUARD` is set, any later
    // invocation is rejected. The flag and the marker are reached through globals (the ambient
    // `lwcRuntimeFlags` and `globalThis`) rather than through module-scoped variables, so this function
    // stays self-contained: its source text can be read via `Function.prototype.toString` and recreated
    // in another realm without referencing anything from this module. `typeof` keeps the check inert in a
    // realm where the flag global is absent, so recreation elsewhere is unaffected and, by default (flag
    // unset), the factory stays freely re-invocable exactly as before.
    const alreadyCreated = globalThis.__lwcRendererFactoryInvoked === true;
    globalThis.__lwcRendererFactoryInvoked = true;
    if (alreadyCreated &&
        typeof lwcRuntimeFlags !== 'undefined' &&
        lwcRuntimeFlags.ENABLE_RENDERER_FACTORY_GUARD) {
        throw new Error('Invalid invocation of rendererFactory. The renderer has already been created and cannot be recreated.');
    }
    // Type assertion because this is replaced by rollup with an object, not a string.
    // See `injectInlineRenderer` in /scripts/rollup/rollup.config.js
    const renderer = (function (exports) {

    /**
     * Copyright (c) 2026 Salesforce, Inc.
     */
    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    /**
     *
     * @param value
     * @param msg
     */
    function invariant(value, msg) {
        if (!value) {
            throw new Error(`Invariant Violation: ${msg}`);
        }
    }
    /**
     *
     * @param value
     * @param msg
     */
    function isTrue$1(value, msg) {
        if (!value) {
            throw new Error(`Assert Violation: ${msg}`);
        }
    }
    /**
     *
     * @param value
     * @param msg
     */
    function isFalse$1(value, msg) {
        if (value) {
            throw new Error(`Assert Violation: ${msg}`);
        }
    }
    /**
     *
     * @param msg
     */
    function fail(msg) {
        throw new Error(msg);
    }

    var assert = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fail: fail,
        invariant: invariant,
        isFalse: isFalse$1,
        isTrue: isTrue$1
    });

    /*
     * Copyright (c) 2024, Salesforce, Inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    const { 
    /** Detached {@linkcode Object.getOwnPropertyDescriptors}; see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors MDN Reference}. */
    getOwnPropertyDescriptors} = Object;
    /**
     * Determines whether the argument is `undefined`.
     * @param obj Value to test
     * @returns `true` if the value is `undefined`.
     */
    function isUndefined(obj) {
        return obj === undefined;
    }
    /**
     * Determines whether the argument is `null`.
     * @param obj Value to test
     * @returns `true` if the value is `null`.
     */
    function isNull(obj) {
        return obj === null;
    }
    /** version: 9.4.3 */

    /*
     * Copyright (c) 2024, Salesforce, Inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    // Like @lwc/shared, but for DOM APIs
    const ElementDescriptors = getOwnPropertyDescriptors(Element.prototype);
    const ElementAttachShadow = ElementDescriptors.attachShadow.value;
    const ElementShadowRootGetter = ElementDescriptors.shadowRoot.get;

    /*
     * Copyright (c) 2023, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    class WireContextSubscriptionEvent extends CustomEvent {
        constructor(adapterToken, { setNewContext, setDisconnectedCallback }) {
            super(adapterToken, {
                bubbles: true,
                composed: true,
            });
            this.setNewContext = setNewContext;
            this.setDisconnectedCallback = setDisconnectedCallback;
        }
    }
    function registerContextConsumer(elm, adapterContextToken, subscriptionPayload) {
        dispatchEvent(elm, new WireContextSubscriptionEvent(adapterContextToken, subscriptionPayload));
    }
    function registerContextProvider(elm, adapterContextToken, onContextSubscription) {
        const listener = ((evt) => {
            const { setNewContext, setDisconnectedCallback } = evt;
            // If context subscription is successful, stop event propagation
            if (onContextSubscription({
                setNewContext,
                setDisconnectedCallback,
            })) {
                evt.stopImmediatePropagation();
            }
        });
        addEventListener(elm, adapterContextToken, listener);
        // Caller removes the listener on disconnect; otherwise its closure retains the detached element.
        return () => removeEventListener(elm, adapterContextToken, listener);
    }

    /*
     * Copyright (c) 2018, salesforce.com, inc.
     * All rights reserved.
     * SPDX-License-Identifier: MIT
     * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
     */
    function cloneNode(node, deep) {
        return node.cloneNode(deep);
    }
    function createElement(tagName, namespace) {
        return isUndefined(namespace)
            ? document.createElement(tagName)
            : document.createElementNS(namespace, tagName);
    }
    function createText(content) {
        return document.createTextNode(content);
    }
    function createComment(content) {
        return document.createComment(content);
    }
    // Parse the fragment HTML string into DOM
    function createFragment(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.firstChild;
    }
    function insert(node, parent, anchor) {
        parent.insertBefore(node, anchor);
    }
    function remove(node, parent) {
        parent.removeChild(node);
    }
    function nextSibling(node) {
        return node.nextSibling;
    }
    function previousSibling(node) {
        return node.previousSibling;
    }
    function getParentNode(node) {
        return node.parentNode;
    }
    function attachShadow(element, options) {
        // `shadowRoot` will be non-null in two cases:
        //   1. upon initial load with an SSR-generated DOM, while in Shadow render mode
        //   2. when a webapp author places <c-app> in their static HTML and mounts their
        //      root component with customElement.define('c-app', Ctor)
        // see W-17441501
        const shadowRoot = ElementShadowRootGetter.call(element);
        if (!isNull(shadowRoot)) {
            return shadowRoot;
        }
        return ElementAttachShadow.call(element, options);
    }
    function setText(node, content) {
        node.nodeValue = content;
    }
    function getProperty(node, key) {
        return node[key];
    }
    function setProperty(node, key, value) {
        node[key] = value;
    }
    function getAttribute(element, name, namespace) {
        return isUndefined(namespace)
            ? element.getAttribute(name)
            : element.getAttributeNS(namespace, name);
    }
    function setAttribute(element, name, value, namespace) {
        return isUndefined(namespace)
            ? element.setAttribute(name, value)
            : element.setAttributeNS(namespace, name, value);
    }
    function removeAttribute(element, name, namespace) {
        if (isUndefined(namespace)) {
            element.removeAttribute(name);
        }
        else {
            element.removeAttributeNS(namespace, name);
        }
    }
    function addEventListener(target, type, callback, options) {
        target.addEventListener(type, callback, options);
    }
    function removeEventListener(target, type, callback, options) {
        target.removeEventListener(type, callback, options);
    }
    function dispatchEvent(target, event) {
        return target.dispatchEvent(event);
    }
    function getClassList(element) {
        return element.classList;
    }
    function setCSSStyleProperty(element, name, value, important) {
        // TODO [#0]: How to avoid this type casting? Shall we use a different type interface to
        // represent elements in the engine?
        element.style.setProperty(name, value, important ? 'important' : '');
    }
    function getBoundingClientRect(element) {
        return element.getBoundingClientRect();
    }
    function querySelector(element, selectors) {
        return element.querySelector(selectors);
    }
    function querySelectorAll(element, selectors) {
        return element.querySelectorAll(selectors);
    }
    function getElementsByTagName(element, tagNameOrWildCard) {
        return element.getElementsByTagName(tagNameOrWildCard);
    }
    function getElementsByClassName(element, names) {
        return element.getElementsByClassName(names);
    }
    function getChildren(element) {
        return element.children;
    }
    function getChildNodes(element) {
        return element.childNodes;
    }
    function getFirstChild(element) {
        return element.firstChild;
    }
    function getFirstElementChild(element) {
        return element.firstElementChild;
    }
    function getLastChild(element) {
        return element.lastChild;
    }
    function getLastElementChild(element) {
        return element.lastElementChild;
    }
    function isConnected(node) {
        return node.isConnected;
    }
    function assertInstanceOfHTMLElement(elm, msg) {
        assert.invariant(elm instanceof HTMLElement, msg);
    }
    function ownerDocument(element) {
        return element.ownerDocument;
    }
    function getTagName(elm) {
        return elm.tagName;
    }
    function getStyle(elm) {
        return elm.style;
    }
    function attachInternals(elm) {
        return attachInternalsFunc.call(elm);
    }
    // Use the attachInternals method from HTMLElement.prototype because access to it is removed
    // in HTMLBridgeElement, ie: elm.attachInternals is undefined.
    // Additionally, cache the attachInternals method to protect against 3rd party monkey-patching.
    const attachInternalsFunc = typeof ElementInternals !== 'undefined'
        ? HTMLElement.prototype.attachInternals
        : () => {
            throw new Error('attachInternals API is not supported in this browser environment.');
        };

    exports.addEventListener = addEventListener;
    exports.assertInstanceOfHTMLElement = assertInstanceOfHTMLElement;
    exports.attachInternals = attachInternals;
    exports.attachShadow = attachShadow;
    exports.cloneNode = cloneNode;
    exports.createComment = createComment;
    exports.createElement = createElement;
    exports.createFragment = createFragment;
    exports.createText = createText;
    exports.dispatchEvent = dispatchEvent;
    exports.getAttribute = getAttribute;
    exports.getBoundingClientRect = getBoundingClientRect;
    exports.getChildNodes = getChildNodes;
    exports.getChildren = getChildren;
    exports.getClassList = getClassList;
    exports.getElementsByClassName = getElementsByClassName;
    exports.getElementsByTagName = getElementsByTagName;
    exports.getFirstChild = getFirstChild;
    exports.getFirstElementChild = getFirstElementChild;
    exports.getLastChild = getLastChild;
    exports.getLastElementChild = getLastElementChild;
    exports.getParentNode = getParentNode;
    exports.getProperty = getProperty;
    exports.getStyle = getStyle;
    exports.getTagName = getTagName;
    exports.insert = insert;
    exports.isConnected = isConnected;
    exports.nextSibling = nextSibling;
    exports.ownerDocument = ownerDocument;
    exports.previousSibling = previousSibling;
    exports.querySelector = querySelector;
    exports.querySelectorAll = querySelectorAll;
    exports.registerContextConsumer = registerContextConsumer;
    exports.registerContextProvider = registerContextProvider;
    exports.remove = remove;
    exports.removeAttribute = removeAttribute;
    exports.removeEventListener = removeEventListener;
    exports.setAttribute = setAttribute;
    exports.setCSSStyleProperty = setCSSStyleProperty;
    exports.setProperty = setProperty;
    exports.setText = setText;

    return exports;

})({});
    // Meant to inherit any properties passed via the base renderer as the argument to the factory.
    Object.setPrototypeOf(renderer, baseRenderer);
    return renderer;
}

/*
 * Copyright (c) 2023, Salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Host element mutation tracking is for SSR only
const startTrackingMutations = noop;
const stopTrackingMutations = noop;
/**
 * The base renderer that will be used by engine-core.
 * This will be used for DOM operations when lwc is running in a browser environment.
 */
const renderer = assign(
// The base renderer will invoke the factory with null and assign additional properties that are
// shared across renderers. This is the factory's single expected invocation per realm; it marks
// the renderer as created so that, when ENABLE_RENDERER_FACTORY_GUARD is set, later invocations are
// rejected (see renderer-factory.ts).
rendererFactory(null), 
// Properties that are either not required to be sandboxed or rely on a globally shared information
{
    // insertStyleSheet implementation shares a global cache of stylesheet data
    insertStylesheet,
    // relies on a shared global cache
    createCustomElement,
    defineCustomElement: getUpgradableConstructor,
    isSyntheticShadowDefined: hasOwnProperty$1.call(Element.prototype, KEY__SHADOW_TOKEN),
    startTrackingMutations,
    stopTrackingMutations,
});

/*
 * Copyright (c) 2024, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// Like @lwc/shared, but for DOM APIs
const ElementDescriptors = getOwnPropertyDescriptors(Element.prototype);
ElementDescriptors.attachShadow.value;
ElementDescriptors.shadowRoot.get;
function clearNode(node) {
    const childNodes = renderer.getChildNodes(node);
    for (let i = childNodes.length - 1; i >= 0; i--) {
        renderer.remove(childNodes[i], node);
    }
}
/**
 * The real `buildCustomElementConstructor`. Should not be accessible to external users!
 * @internal
 * @param Ctor LWC constructor to build
 * @returns A Web Component class
 * @see {@linkcode deprecatedBuildCustomElementConstructor}
 */
function buildCustomElementConstructor(Ctor) {
    var _a;
    const HtmlPrototype = getComponentHtmlPrototype(Ctor);
    const { observedAttributes } = HtmlPrototype;
    const { attributeChangedCallback } = HtmlPrototype.prototype;
    return _a = class extends HTMLElement {
            constructor() {
                super();
                if (!isNull(this.shadowRoot)) {
                    clearNode(this.shadowRoot);
                }
                // Compute renderMode/shadowMode in advance. This must be done before `createVM` because `createVM` may
                // mutate the element.
                const { shadowMode, renderMode } = computeShadowAndRenderMode(Ctor, renderer);
                // Native shadow components are allowed to have pre-existing `childNodes` before upgrade. This supports
                // use cases where a custom element has declaratively-defined slotted content, e.g.:
                // https://github.com/salesforce/lwc/issues/3639
                const isNativeShadow = renderMode === 1 /* RenderMode.Shadow */ && shadowMode === 0 /* ShadowMode.Native */;
                if (!isNativeShadow && this.childNodes.length > 0) {
                    clearNode(this);
                }
                createVM(this, Ctor, renderer, {
                    mode: 'open',
                    owner: null,
                    tagName: this.tagName,
                });
            }
            connectedCallback() {
                connectRootElement(this);
            }
            disconnectedCallback() {
                disconnectRootElement(this);
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (!lwcRuntimeFlags.ENABLE_LEGACY_ATTRIBUTE_CHANGED_CALLBACK ||
                    this instanceof BaseBridgeElement) {
                    // W-17420330
                    attributeChangedCallback.call(this, name, oldValue, newValue);
                }
            }
            formAssociatedCallback(form) {
                runFormAssociatedCallback(this, form);
            }
            formDisabledCallback(disabled) {
                runFormDisabledCallback(this, disabled);
            }
            formResetCallback() {
                runFormResetCallback(this);
            }
            formStateRestoreCallback(state, reason) {
                runFormStateRestoreCallback(this, state, reason);
            }
        },
        _a.observedAttributes = observedAttributes,
        // Note CustomElementConstructor is not upgraded by LWC and inherits directly from HTMLElement which means it calls the native
        // attachInternals API.
        _a.formAssociated = Boolean(Ctor.formAssociated),
        _a;
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
// TODO [#2472]: Remove this workaround when appropriate.
// eslint-disable-next-line @lwc/lwc-internal/no-global-node
const _Node$1 = Node;
const ConnectingSlot = new WeakMap();
const DisconnectingSlot = new WeakMap();
function callNodeSlot(node, slot) {
    const fn = slot.get(node);
    if (!isUndefined$1(fn)) {
        fn(node);
    }
    return node; // for convenience
}
let monkeyPatched = false;
function monkeyPatchDomAPIs() {
    if (monkeyPatched) {
        // don't double-patch
        return;
    }
    monkeyPatched = true;
    // Monkey patching Node methods to be able to detect the insertions and removal of root elements
    // created via createElement.
    const { appendChild, insertBefore, removeChild, replaceChild } = _Node$1.prototype;
    assign(_Node$1.prototype, {
        appendChild(newChild) {
            const appendedNode = appendChild.call(this, newChild);
            return callNodeSlot(appendedNode, ConnectingSlot);
        },
        insertBefore(newChild, referenceNode) {
            const insertedNode = insertBefore.call(this, newChild, referenceNode);
            return callNodeSlot(insertedNode, ConnectingSlot);
        },
        removeChild(oldChild) {
            const removedNode = removeChild.call(this, oldChild);
            return callNodeSlot(removedNode, DisconnectingSlot);
        },
        replaceChild(newChild, oldChild) {
            const replacedNode = replaceChild.call(this, newChild, oldChild);
            callNodeSlot(replacedNode, DisconnectingSlot);
            callNodeSlot(newChild, ConnectingSlot);
            return replacedNode;
        },
    });
}
/**
 * EXPERIMENTAL: This function is almost identical to document.createElement with the slightly
 * difference that in the options, you can pass the `is` property set to a Constructor instead of
 * just a string value. The intent is to allow the creation of an element controlled by LWC without
 * having to register the element as a custom element.
 *
 * NOTE: The returned type incorrectly includes _all_ properties defined on the component class,
 * even though the runtime object only uses those decorated with `@api`. This is due to a
 * limitation of TypeScript. To avoid inferring incorrect properties, provide an explicit generic
 * parameter, e.g. `createElement<typeof LightningElement>('x-foo', { is: FooCtor })`.
 * @param sel The tagname of the element to create
 * @param options Control the behavior of the created element
 * @param options.is The LWC component that the element should be
 * @param options.mode What kind of shadow root to use
 * @returns The created HTML element
 * @throws Throws when called with invalid parameters.
 * @example
 * const el = createElement('x-foo', { is: FooCtor });
 */
function createElement(sel, options) {
    if (!isObject(options) || isNull(options)) {
        throw new TypeError(`"createElement" function expects an object as second parameter but received "${toString(options)}".`);
    }
    const Ctor = options.is;
    if (!isFunction$1(Ctor)) {
        throw new TypeError(`"createElement" function expects an "is" option with a valid component constructor.`);
    }
    const { createCustomElement } = renderer;
    // tagName must be all lowercase, unfortunately, we have legacy code that is
    // passing `sel` as a camel-case, which makes them invalid custom elements name
    // the following line guarantees that this does not leaks beyond this point.
    const tagName = StringToLowerCase.call(sel);
    const useNativeCustomElementLifecycle = !lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE;
    const isFormAssociated = shouldBeFormAssociated(Ctor);
    // the custom element from the registry is expecting an upgrade callback
    /*
     * Note: if the upgradable constructor does not expect, or throw when we new it
     * with a callback as the first argument, we could implement a more advanced
     * mechanism that only passes that argument if the constructor is known to be
     * an upgradable custom element.
     */
    const upgradeCallback = (elm) => {
        createVM(elm, Ctor, renderer, {
            tagName,
            mode: options.mode !== 'closed' ? 'open' : 'closed',
            owner: null,
        });
        if (!useNativeCustomElementLifecycle) {
            // Monkey-patch on-demand, because `lwcRuntimeFlags.DISABLE_NATIVE_CUSTOM_ELEMENT_LIFECYCLE` may be set to
            // `true` lazily, after `@lwc/engine-dom` has finished initializing but before a component has rendered.
            monkeyPatchDomAPIs();
            ConnectingSlot.set(elm, connectRootElement);
            DisconnectingSlot.set(elm, disconnectRootElement);
        }
    };
    return createCustomElement(tagName, upgradeCallback, useNativeCustomElementLifecycle, isFormAssociated);
}

/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
const ComponentConstructorToCustomElementConstructorMap = new Map();
function getCustomElementConstructor(Ctor) {
    if (Ctor === LightningElement) {
        throw new TypeError(`Invalid Constructor. LightningElement base class can't be claimed as a custom element.`);
    }
    let ce = ComponentConstructorToCustomElementConstructorMap.get(Ctor);
    if (isUndefined$1(ce)) {
        ce = buildCustomElementConstructor(Ctor);
        ComponentConstructorToCustomElementConstructorMap.set(Ctor, ce);
    }
    return ce;
}
/**
 * This static getter builds a Web Component class from a LWC constructor so it can be registered
 * as a new element via customElements.define() at any given time.
 * @example
 * import Foo from 'ns/foo';
 * customElements.define('x-foo', Foo.CustomElementConstructor);
 * const elm = document.createElement('x-foo');
 */
defineProperty(LightningElement, 'CustomElementConstructor', {
    get() {
        return getCustomElementConstructor(this);
    },
});
freeze(LightningElement);
seal(LightningElement.prototype);
/** version: 9.4.3 */

function stylesheet$e(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return [((useActualHostSelector ? ":host {" : hostSelector + " {")), "display: block;min-height: 100vh;padding: 1.75rem clamp(1rem, 4vw, 3rem) 2.5rem;box-sizing: border-box;color: var(--text);}.demo__head", shadowSelector, " {display: flex;flex-wrap: wrap;align-items: flex-start;justify-content: space-between;gap: 1rem;margin-bottom: 1.25rem;}.demo__brand", shadowSelector, " {display: flex;align-items: flex-start;gap: 0.75rem;}.demo__mark", shadowSelector, " {flex: none;display: grid;place-items: center;width: 2.5rem;height: 2.5rem;border-radius: 0.625rem;background: var(--accent-soft);color: var(--accent);}.demo__mark", shadowSelector, " svg", shadowSelector, " {width: 1.5rem;height: auto;}.demo__title", shadowSelector, " {margin: 0;font-size: 1.5rem;letter-spacing: -0.02em;}.demo__sub", shadowSelector, " {margin: 0.25rem 0 0;max-width: 62ch;font-size: 0.8125rem;line-height: 1.5;color: var(--muted);}.demo__sub", shadowSelector, " a", shadowSelector, " {color: var(--accent-strong);}.demo__actions", shadowSelector, " {display: flex;align-items: center;gap: 0.5rem;}.demo__repo", shadowSelector, " {padding: 0.5rem 0.9rem;border: 1px solid var(--border-strong);border-radius: 0.5rem;background: var(--surface);box-shadow: var(--shadow-1);color: var(--text);font-size: 0.8125rem;font-weight: 500;text-decoration: none;white-space: nowrap;}.demo__repo:hover", shadowSelector, " {border-color: var(--accent-line);}.demo__theme", shadowSelector, " {display: grid;place-items: center;width: 2.25rem;height: 2.25rem;padding: 0;border: 1px solid var(--border-strong);border-radius: 0.5rem;background: var(--surface);box-shadow: var(--shadow-1);color: var(--text);font-size: 0.9rem;cursor: pointer;}.demo__theme:hover", shadowSelector, " {border-color: var(--accent-line);}.demo__toolbar", shadowSelector, " {display: flex;flex-wrap: wrap;align-items: center;gap: 0.5rem 0.75rem;margin-bottom: 0.9rem;font-size: 0.8125rem;}.demo__btn", shadowSelector, " {padding: 0.45rem 0.8rem;border: 1px solid var(--border-strong);border-radius: 0.5rem;background: var(--surface);box-shadow: var(--shadow-1);color: var(--text);font: inherit;font-weight: 500;cursor: pointer;}.demo__btn:hover:not(:disabled)", shadowSelector, " {border-color: var(--accent-line);}.demo__btn:disabled", shadowSelector, " {opacity: 0.45;cursor: not-allowed;}.demo__btn_primary", shadowSelector, " {border-color: var(--accent);background: var(--accent);color: #fff;}.demo__btn_primary:hover:not(:disabled)", shadowSelector, " {filter: brightness(0.94);}.demo__btn_block", shadowSelector, " {width: 100%;}.demo__sep", shadowSelector, " {width: 1px;height: 1.25rem;background: var(--border);}.demo__field", shadowSelector, ",.demo__check", shadowSelector, " {display: inline-flex;align-items: center;gap: 0.4rem;color: var(--muted);}.demo__check", shadowSelector, " input", shadowSelector, " {accent-color: var(--accent);}.demo__select", shadowSelector, ",.demo__input", shadowSelector, " {padding: 0.35rem 0.5rem;border: 1px solid var(--border-strong);border-radius: 0.4rem;background: var(--surface);color: var(--text);font: inherit;}.demo__body", shadowSelector, " {display: grid;grid-template-columns: minmax(0, 1fr) 19rem;gap: 1rem;align-items: stretch;}.demo__canvas", shadowSelector, " {height: min(74vh, 48rem);border: 1px solid var(--border);border-radius: 0.875rem;overflow: hidden;background: var(--surface);box-shadow: var(--shadow-1);}c-flow", shadowSelector, " {display: block;height: 100%;--flow-node-background: var(--surface);--flow-node-color: var(--text);--flow-node-border: 1px solid var(--border);--flow-node-border-radius: 0.625rem;--flow-node-font-size: 0.8125rem;--flow-node-padding: 0.625rem 0.75rem;--flow-node-box-shadow-selected: 0 0 0 2px var(--accent-line);--flow-node-group-background: color-mix(in srgb, var(--accent) 5%, transparent);--flow-edge-stroke: var(--edge);--flow-edge-stroke-width: 1.5;--flow-edge-stroke-selected: var(--accent);--flow-connectionline-stroke: var(--accent);--flow-handle-background: var(--surface);--flow-handle-border-color: var(--accent-line);--flow-handle-size: 7px;--flow-background-pattern-color: var(--grid);--flow-selection-background: color-mix(in srgb, var(--accent) 8%, transparent);--flow-selection-border: 1px dashed var(--accent-line);--flow-minimap-background: color-mix(in srgb, var(--surface) 85%, transparent);--flow-minimap-node-fill: var(--border);--flow-minimap-node-fill-selected: var(--accent);--flow-minimap-mask-fill: color-mix(in srgb, var(--text) 6%, transparent);--flow-controls-button-background-color: var(--surface);--flow-controls-button-background-color-hover: var(--surface-2);--flow-controls-button-color: var(--muted);--flow-controls-button-border-color: var(--border);--flow-controls-box-shadow: var(--shadow-1);}.demo__hint", shadowSelector, " {display: inline-block;padding: 0.3rem 0.6rem;border: 1px solid var(--border);border-radius: 0.4rem;background: var(--surface);box-shadow: var(--shadow-1);color: var(--muted);font-size: 0.6875rem;}.demo__side", shadowSelector, " {display: flex;flex-direction: column;gap: 0.75rem;padding: 1rem;border: 1px solid var(--border);border-radius: 0.875rem;background: var(--surface);box-shadow: var(--shadow-1);min-width: 0;}.demo__stats", shadowSelector, " {display: grid;grid-template-columns: repeat(2, minmax(0, 1fr));gap: 0.5rem;}.demo__stat", shadowSelector, " {display: flex;flex-direction: column;padding: 0.5rem 0.6rem;border: 1px solid var(--border);border-radius: 0.5rem;background: var(--surface-2);font-size: 0.625rem;text-transform: uppercase;letter-spacing: 0.06em;color: var(--faint);}.demo__stat-value", shadowSelector, " {font-size: 1.25rem;font-weight: 600;letter-spacing: -0.01em;text-transform: none;color: var(--text);}.demo__side-title", shadowSelector, " {margin: 0.25rem 0 0;font-size: 0.6875rem;text-transform: uppercase;letter-spacing: 0.08em;color: var(--faint);}.demo__side-note", shadowSelector, " {margin: 0;font-size: 0.75rem;line-height: 1.5;color: var(--muted);}.demo__side-note", shadowSelector, " code", shadowSelector, " {color: var(--accent-strong);font-size: 0.6875rem;}.demo__inspect", shadowSelector, " {display: flex;flex-direction: column;gap: 0.5rem;}.demo__rename", shadowSelector, " {display: flex;flex-direction: column;gap: 0.25rem;font-size: 0.625rem;text-transform: uppercase;letter-spacing: 0.06em;color: var(--faint);}.demo__props", shadowSelector, " {display: flex;flex-direction: column;gap: 0.125rem;margin: 0;font-size: 0.6875rem;}.demo__prop", shadowSelector, " {display: flex;justify-content: space-between;gap: 0.5rem;padding: 0.2rem 0.4rem;border-radius: 0.3rem;background: var(--surface-2);}.demo__prop", shadowSelector, " dt", shadowSelector, " {color: var(--faint);}.demo__prop", shadowSelector, " dd", shadowSelector, " {margin: 0;font-family: ui-monospace, SFMono-Regular, Menlo, monospace;color: var(--text);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}.demo__tones", shadowSelector, " {display: flex;gap: 0.375rem;}.demo__tone", shadowSelector, " {width: 1.5rem;height: 1.5rem;padding: 0;border: 1px solid var(--border);border-radius: 0.375rem;background: var(--surface);cursor: pointer;}.demo__tone:hover", shadowSelector, " {border-color: var(--accent-line);}.demo__tone", shadowSelector, " span", shadowSelector, " {display: block;width: 100%;height: 100%;border-radius: 0.25rem;}.demo__tone", shadowSelector, " .violet", shadowSelector, " {background: var(--tone-violet);}.demo__tone", shadowSelector, " .blue", shadowSelector, " {background: var(--tone-blue);}.demo__tone", shadowSelector, " .green", shadowSelector, " {background: var(--tone-green);}.demo__tone", shadowSelector, " .amber", shadowSelector, " {background: var(--tone-amber);}.demo__tone", shadowSelector, " .rose", shadowSelector, " {background: var(--tone-rose);}.demo__log", shadowSelector, " {margin: 0;padding: 0;list-style: none;display: flex;flex-direction: column;gap: 0.25rem;font-family: ui-monospace, SFMono-Regular, Menlo, monospace;font-size: 0.6875rem;}.demo__log-row", shadowSelector, " {padding: 0.3rem 0.45rem;border-radius: 0.35rem;background: var(--surface-2);color: var(--muted);overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}@media (max-width: 60rem) {.demo__body", shadowSelector, " {grid-template-columns: minmax(0, 1fr);}.demo__canvas", shadowSelector, " {height: 60vh;}}.demo__form", shadowSelector, " {display: flex;flex-direction: column;gap: 0.3rem;max-height: 22rem;overflow-y: auto;padding-right: 0.25rem;}.demo__row", shadowSelector, " {display: grid;grid-template-columns: 5.5rem minmax(0, 1fr);align-items: center;gap: 0.4rem;font-size: 0.6875rem;color: var(--faint);}.demo__row", shadowSelector, " .demo__input", shadowSelector, ",.demo__row", shadowSelector, " .demo__select", shadowSelector, " {width: 100%;min-width: 0;padding: 0.25rem 0.4rem;font-size: 0.6875rem;}.demo__flags", shadowSelector, " {display: grid;grid-template-columns: repeat(2, minmax(0, 1fr));gap: 0.2rem 0.5rem;margin-top: 0.3rem;font-size: 0.6875rem;}.demo__form-actions", shadowSelector, " {display: flex;gap: 0.4rem;margin-top: 0.4rem;}.demo__form-actions", shadowSelector, " .demo__btn", shadowSelector, " {flex: 1;padding: 0.35rem 0.5rem;font-size: 0.75rem;}"].join('');
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$e = [stylesheet$e];

function stylesheet$d(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none;z-index: 5;}.flow__panel" + shadowSelector + " {position: absolute;margin: var(--flow-panel-margin, 15px);pointer-events: all;}.flow__panel.top" + shadowSelector + " {top: 0;}.flow__panel.bottom" + shadowSelector + " {bottom: 0;}.flow__panel.top.center" + shadowSelector + ",.flow__panel.bottom.center" + shadowSelector + " {left: 50%;transform: translateX(calc(var(--flow-panel-margin, 15px) * -1)) translateX(-50%);}.flow__panel.left" + shadowSelector + " {left: 0;}.flow__panel.right" + shadowSelector + " {right: 0;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$d = [stylesheet$d];

const stc0$a = {
  key: 1
};
const stc1$6 = [];
function tmpl$f($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, s: api_slot, h: api_element} = $api;
  return [api_element("div", {
    className: api_normalize_class_name($cmp.panelClass),
    key: 0
  }, [api_slot("", stc0$a, stc1$6, $slotset)])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$f = registerTemplate(tmpl$f);
tmpl$f.slots = [""];
tmpl$f.stylesheets = [];
tmpl$f.stylesheetToken = "lwc-3pcepjqj11o";
tmpl$f.legacyStylesheetToken = "lwc-flowPanel_flowPanel";
if (_implicitStylesheets$d) {
  tmpl$f.stylesheets.push.apply(tmpl$f.stylesheets, _implicitStylesheets$d);
}
freezeTemplate(tmpl$f);

/** Upstream `PanelPosition`. Anything else falls back to the default. */
const PANEL_POSITIONS = new Set(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']);
const DEFAULT_POSITION$1 = 'top-left';
class FlowPanel extends LightningElement {
  constructor(...args) {
    super(...args);
    this._position = DEFAULT_POSITION$1;
    this._className = '';
  }
  /** One of the six `PanelPosition` values. */
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = PANEL_POSITIONS.has(value) ? value : DEFAULT_POSITION$1;
  }

  /** Extra classes for the panel element, as upstream's `className`. */
  get className() {
    return this._className;
  }
  set className(value) {
    this._className = typeof value === 'string' ? value.trim() : '';
  }

  /**
   * Classes for the panel element.
   *
   * `nopan` is not decoration: `c/flowPanZoom.isWrappedWithClass` walks the event's
   * `composedPath()` looking for it, and without it a pointer drag that starts on a panel would
   * pan the flow underneath. Upstream sets it for the same reason.
   */
  get panelClass() {
    const classes = ['flow__panel', 'nopan', ...this._position.split('-')];
    if (this._className) {
      classes.push(this._className);
    }
    return classes.join(' ');
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowPanel, {
  publicProps: {
    position: {
      config: 3
    },
    className: {
      config: 3
    }
  },
  fields: ["_position", "_className"]
});
const __lwc_component_class_internal$e = registerComponent(FlowPanel, {
  tmpl: _tmpl$f,
  sel: "c-flow-panel",
  apiVersion: 66
});

function stylesheet$c(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "--flow-background-color: var(--slds-g-color-surface-container-1, #fff);--flow-background-pattern-color: var(--slds-g-color-border-1, #e2e2e2);--flow-node-background: var(--slds-g-color-surface-container-1, #fff);--flow-node-color: var(--slds-g-color-on-surface-1, #222);--flow-node-border: 1px solid var(--slds-g-color-border-2, #1a192b);--flow-node-border-radius: 3px;--flow-node-padding: 10px;--flow-node-font-size: 12px;--flow-node-box-shadow-selected: 0 0 0 0.5px var(--slds-g-color-accent-container-3, #1a192b);--flow-node-box-shadow-hover: 0 1px 4px 1px rgba(0, 0, 0, 0.08);--flow-node-group-background: rgba(240, 240, 240, 0.25);--flow-handle-size: 6px;--flow-handle-background: var(--slds-g-color-accent-container-3, #1a192b);--flow-handle-border-color: var(--slds-g-color-surface-container-1, #fff);--flow-edge-stroke: var(--slds-g-color-border-2, #b1b1b7);--flow-edge-stroke-selected: var(--slds-g-color-accent-container-3, #555);--flow-selection-background: rgba(0, 89, 220, 0.08);--flow-selection-border: 1px dotted rgba(0, 89, 220, 0.8);--flow-controls-button-background: var(--slds-g-color-surface-container-1, #fefefe);--flow-controls-button-color: var(--slds-g-color-on-surface-2, #555);--flow-controls-button-border-color: var(--slds-g-color-border-1, #eee);--flow-minimap-background: var(--slds-g-color-surface-container-1, #fff);--flow-minimap-mask-fill: rgba(240, 240, 240, 0.6);--flow-minimap-node-fill: var(--slds-g-color-border-1, #e2e2e2);display: block;min-height: 300px;height: 100%;position: relative;}.flow__pane" + shadowSelector + " {position: absolute;inset: 0;overflow: hidden;background: var(--flow-background-color);touch-action: none;contain: layout paint;}.flow__viewport" + shadowSelector + " {position: absolute;top: 0;left: 0;transform-origin: 0 0;width: 100%;height: 100%;pointer-events: none;z-index: 2;}.flow__viewport" + shadowSelector + " > *" + shadowSelector + " {pointer-events: auto;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$c = [stylesheet$c];

function stylesheet$b(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none;z-index: -1;}.flow__background" + shadowSelector + " {display: block;width: 100%;height: 100%;background-color: var(\n --flow-background-color-props,\n var(--flow-background-color, var(--slds-g-color-surface-1, transparent))\n );}.flow__background-pattern.dots" + shadowSelector + " {fill: var(\n --flow-background-pattern-color-props,\n var(--flow-background-pattern-color, var(--slds-g-color-neutral-base-50, #91919a))\n );}.flow__background-pattern.lines" + shadowSelector + " {stroke: var(\n --flow-background-pattern-color-props,\n var(--flow-background-pattern-color, var(--slds-g-color-border-1, #eee))\n );}.flow__background-pattern.cross" + shadowSelector + " {stroke: var(\n --flow-background-pattern-color-props,\n var(--flow-background-pattern-color, var(--slds-g-color-border-1, #e2e2e2))\n );}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$b = [stylesheet$b];

const $fragment1$a = parseSVGFragment`<circle${"c0"}${"a0:cx"}${"a0:cy"}${"a0:r"}${2}/>`;
const $fragment2$6 = parseSVGFragment`<path${"c0"}${"a0:stroke-width"}${"a0:d"}${2}/>`;
const $fragment3$5 = parseSVGFragment`<rect x="0" y="0" width="100%" height="100%"${3}/>`;
const stc0$9 = {
  "aria-hidden": "true"
};
function tmpl$e($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, gid: api_scoped_id, sp: api_static_part, st: api_static_fragment, fr: api_fragment, h: api_element} = $api;
  return [api_element("svg", {
    className: api_normalize_class_name($cmp.svgClass),
    style: $cmp.svgStyle,
    attrs: stc0$9,
    key: 0,
    svg: true
  }, [api_element("pattern", {
    attrs: {
      "id": api_scoped_id($cmp.patternId),
      "x": $cmp.pattern.x,
      "y": $cmp.pattern.y,
      "width": $cmp.pattern.width,
      "height": $cmp.pattern.height,
      "patternUnits": "userSpaceOnUse",
      "patternTransform": $cmp.pattern.transform
    },
    key: 1,
    svg: true
  }, [$cmp.isDots ? api_fragment(2, [api_static_fragment($fragment1$a, 4, [api_static_part(0, {
    className: api_normalize_class_name($cmp.patternShapeClass),
    attrs: {
      "cx": $cmp.pattern.radius,
      "cy": $cmp.pattern.radius,
      "r": $cmp.pattern.radius
    }
  }, null)])], 0) : api_fragment(2, [api_static_fragment($fragment2$6, 6, [api_static_part(0, {
    className: api_normalize_class_name($cmp.patternShapeClass),
    attrs: {
      "stroke-width": $cmp.pattern.lineWidth,
      "d": $cmp.pattern.d
    }
  }, null)])], 0)]), api_static_fragment($fragment3$5, 8)])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$e = registerTemplate(tmpl$e);
tmpl$e.stylesheets = [];
tmpl$e.stylesheetToken = "lwc-5qcu99shovj";
tmpl$e.legacyStylesheetToken = "lwc-flowBackground_flowBackground";
if (_implicitStylesheets$b) {
  tmpl$e.stylesheets.push.apply(tmpl$e.stylesheets, _implicitStylesheets$b);
}
freezeTemplate(tmpl$e);

/**
 * Shared enumerations, constants and typedefs for lwc-flow.
 *
 * Service component: no template, no LWC imports. Ported from
 * `@xyflow/system/src/types` and `@xyflow/system/src/constants.ts`.
 */

/**
 * Side of a node that a handle sits on.
 * @readonly
 * @enum {string}
 */
const Position = Object.freeze({
  Left: 'left',
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom'
});

/** Opposite side for each {@link Position}. Used when a handle position must be mirrored. */
const oppositePosition = Object.freeze({
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
});

/**
 * Which connections a handle will accept.
 * - `strict`: source may only connect to target.
 * - `loose`: any handle may connect to any other handle.
 * @readonly
 * @enum {string}
 */
const ConnectionMode = Object.freeze({
  Strict: 'strict',
  Loose: 'loose'
});

/**
 * Built-in shape of the in-flight connection line.
 * @readonly
 * @enum {string}
 */
const ConnectionLineType = Object.freeze({
  Bezier: 'default',
  Straight: 'straight',
  Step: 'step',
  SmoothStep: 'smoothstep',
  SimpleBezier: 'simplebezier'
});

/**
 * Marker rendered at an edge end.
 * @readonly
 * @enum {string}
 */
const MarkerType = Object.freeze({
  Arrow: 'arrow',
  ArrowClosed: 'arrowclosed'
});

/**
 * How a node must overlap the marquee rectangle to be selected.
 * - `partial`: any overlap selects.
 * - `full`: the node must be entirely inside.
 * @readonly
 * @enum {string}
 */
const SelectionMode = Object.freeze({
  Partial: 'partial',
  Full: 'full'
});

/**
 * Axis constraint applied while panning with the scroll wheel.
 * @readonly
 * @enum {string}
 */
const PanOnScrollMode = Object.freeze({
  Free: 'free',
  Vertical: 'vertical',
  Horizontal: 'horizontal'
});

/** An extent that imposes no constraint. */
const infiniteExtent = Object.freeze([Object.freeze([Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY]), Object.freeze([Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY])]);

/** Keys that select or cancel a focused node or edge. */
const elementSelectionKeys = Object.freeze(['Enter', ' ', 'Escape']);

/**
 * CSS class names the flow reacts to on user markup. Upstream reads these off
 * the DOM to opt an element out of a gesture.
 */
const interactionClass = Object.freeze({
  /** Element does not start a node drag. */
  noDrag: 'nodrag',
  /** Element does not pan the viewport. */
  noPan: 'nopan',
  /** Element keeps its own wheel handling; the viewport does not zoom. */
  noWheel: 'nowheel',
  /** Marks an element as a drag handle for its node. */
  dragHandle: 'drag-handle'
});

/** z-index added to a selected element when `elevateOnSelect` is on. */
const ELEVATE_ON_SELECT_Z = 1000;

/** Default pointer-to-handle capture radius, in flow units. */
const DEFAULT_CONNECTION_RADIUS = 20;

/** Default stroke width of an edge's invisible interaction path. */
const DEFAULT_INTERACTION_WIDTH = 20;

/** Default auto-pan speed in pixels per frame. */
const DEFAULT_AUTO_PAN_SPEED = 15;

/** Distance from the pane edge at which auto-pan engages, in pixels. */
const AUTO_PAN_DISTANCE = 40;

/** Extra distance added when searching for a connectable handle. */
const HANDLE_SEARCH_PADDING = 250;

/** Default viewport zoom bounds. */
const DEFAULT_MIN_ZOOM = 0.5;
const DEFAULT_MAX_ZOOM = 2;

/** Error and warning text, keyed the same way as upstream so reports are comparable. */
const errorMessages = Object.freeze({
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component.",
  error003: nodeType => `Node type "${nodeType}" not found. Using fallback type "default".`,
  error004: () => 'The parent container needs a width and a height to render the graph.',
  error005: () => 'Only child nodes can use a parent extent.',
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: id => `The old edge with id=${id} does not exist.`,
  error009: type => `Marker type "${type}" doesn't exist.`,
  error010: () => 'Handle: No node id found. Make sure to only use a handle inside a custom node.',
  error011: edgeType => `Edge type "${edgeType}" not found. Using fallback type "default".`,
  error012: id => `Node with id "${id}" does not exist, it may have been removed. This can happen when a node is deleted before its click handler is called.`,
  error015: () => 'It seems that you are trying to drag a node that is not initialized.',
  error016: id => `Edge with id "${id}" does not exist, it may have been removed. This can happen when an edge is deleted before its click handler is called.`
});

/** Default accessible labels, overridable per flow. */
const defaultAriaLabelConfig = Object.freeze({
  'node.a11yDescription.default': 'Press enter or space to select a node. Press delete to remove it and escape to cancel.',
  'node.a11yDescription.keyboardDisabled': 'Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.',
  'node.a11yDescription.ariaLiveMessage': ({
    direction,
    x,
    y
  }) => `Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
  'edge.a11yDescription.default': 'Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.',
  'controls.ariaLabel': 'Control Panel',
  'controls.zoomIn.ariaLabel': 'Zoom In',
  'controls.zoomOut.ariaLabel': 'Zoom Out',
  'controls.fitView.ariaLabel': 'Fit View',
  'controls.interactive.ariaLabel': 'Toggle Interactivity',
  'minimap.ariaLabel': 'Mini Map',
  'handle.ariaLabel': 'Handle'
});

/**
 * Merge a partial aria-label override map over the defaults.
 * @param {Object} [partial]
 * @returns {Object} complete label config
 */
function mergeAriaLabelConfig(partial) {
  return {
    ...defaultAriaLabelConfig,
    ...(partial || {})
  };
}

/**
 * @typedef {{x: number, y: number}} XYPosition
 * @typedef {{width: number, height: number}} Dimensions
 * @typedef {{x: number, y: number, width: number, height: number}} Rect
 * @typedef {{x: number, y: number, x2: number, y2: number}} Box
 * @typedef {{x: number, y: number, zoom: number}} Viewport
 * @typedef {[number, number, number]} Transform `[translateX, translateY, scale]`
 * @typedef {[[number, number], [number, number]]} CoordinateExtent `[[minX, minY], [maxX, maxY]]`
 * @typedef {[number, number]} NodeOrigin fraction of the node's own size, `[0,0]` is top-left
 * @typedef {[number, number]} SnapGrid
 */

/**
 * @typedef {Object} FlowNode
 * @property {string} id
 * @property {XYPosition} position position relative to the parent, or absolute when no parent
 * @property {Object} [data]
 * @property {string} [type] key into the `nodeTypes` map
 * @property {number} [width] explicit width; overrides measurement
 * @property {number} [height] explicit height; overrides measurement
 * @property {number} [initialWidth] width used before the first measurement
 * @property {number} [initialHeight] height used before the first measurement
 * @property {Dimensions} [measured] filled in by the renderer after layout
 * @property {string} [parentId]
 * @property {CoordinateExtent|'parent'} [extent]
 * @property {NodeOrigin} [origin]
 * @property {boolean} [selected]
 * @property {boolean} [hidden]
 * @property {boolean} [draggable]
 * @property {boolean} [selectable]
 * @property {boolean} [connectable]
 * @property {boolean} [deletable]
 * @property {boolean} [focusable]
 * @property {string} [dragHandle] CSS selector of the element that starts a drag
 * @property {Position} [sourcePosition]
 * @property {Position} [targetPosition]
 * @property {number} [zIndex]
 * @property {string} [className]
 * @property {Object} [style]
 * @property {string} [ariaLabel]
 */

/**
 * @typedef {Object} FlowEdge
 * @property {string} id
 * @property {string} source
 * @property {string} target
 * @property {string|null} [sourceHandle]
 * @property {string|null} [targetHandle]
 * @property {string} [type] key into the `edgeTypes` map
 * @property {Object} [data]
 * @property {string} [label]
 * @property {boolean} [animated]
 * @property {boolean} [selected]
 * @property {boolean} [hidden]
 * @property {boolean} [selectable]
 * @property {boolean} [deletable]
 * @property {boolean} [focusable]
 * @property {boolean} [reconnectable]
 * @property {number} [interactionWidth]
 * @property {number} [zIndex]
 * @property {string} [className]
 * @property {Object} [style]
 * @property {Object|string} [markerStart]
 * @property {Object|string} [markerEnd]
 * @property {string} [ariaLabel]
 */

/**
 * @typedef {Object} Connection
 * @property {string} source
 * @property {string} target
 * @property {string|null} sourceHandle
 * @property {string|null} targetHandle
 */

/**
 * @typedef {Object} FlowHandle
 * @property {string|null} id
 * @property {'source'|'target'} type
 * @property {Position} position
 * @property {number} x node-relative x
 * @property {number} y node-relative y
 * @property {number} width
 * @property {number} height
 */

/**
 * Geometry and coordinate math for lwc-flow.
 *
 * Service component: no template, no LWC imports, no DOM access. Every function
 * here is a pure port of `@xyflow/system/src/utils/general.ts` and the
 * viewport helpers in `graph.ts`, so the formulas are kept byte-identical to
 * upstream rather than rewritten.
 */


/**
 * Clamp `val` into `[min, max]`.
 * @param {number} val
 * @param {number} [min=0]
 * @param {number} [max=1]
 * @returns {number}
 */
function clamp(val, min = 0, max = 1) {
  return Math.min(Math.max(val, min), max);
}

/**
 * True for a finite number. Mirrors upstream `isNumeric`, which deliberately
 * rejects NaN and both infinities.
 * @param {*} n
 * @returns {boolean}
 */
function isNumeric(n) {
  return typeof n === 'number' && !isNaN(n) && isFinite(n);
}

/**
 * Clamp a position so the box it anchors stays inside `extent`.
 *
 * The extent's upper bound is reduced by the box size, so the far edge of the
 * box - not its origin - is what gets constrained.
 * @param {import('c/flowTypes').XYPosition} [position]
 * @param {import('c/flowTypes').CoordinateExtent} extent
 * @param {{width?: number, height?: number}} [dimensions]
 * @returns {import('c/flowTypes').XYPosition}
 */
function clampPosition(position = {
  x: 0,
  y: 0
}, extent = infiniteExtent, dimensions = {}) {
  return {
    x: clamp(position.x, extent[0][0], extent[1][0] - (dimensions?.width ?? 0)),
    y: clamp(position.y, extent[0][1], extent[1][1] - (dimensions?.height ?? 0))
  };
}

/**
 * Clamp a child's absolute position so it stays within its parent's box.
 * @param {import('c/flowTypes').XYPosition} childPosition absolute position
 * @param {import('c/flowTypes').Dimensions} childDimensions
 * @param {{internals: {positionAbsolute: import('c/flowTypes').XYPosition}}} parent internal node
 * @returns {import('c/flowTypes').XYPosition}
 */
function clampPositionToParent(childPosition, childDimensions, parent) {
  const {
    width: parentWidth,
    height: parentHeight
  } = getNodeDimensions(parent);
  const {
    x: parentX,
    y: parentY
  } = parent.internals.positionAbsolute;
  return clampPosition(childPosition, [[parentX, parentY], [parentX + parentWidth, parentY + parentHeight]], childDimensions);
}

/**
 * One-dimensional auto-pan velocity, in the range [-1, 1].
 *
 * Returns 0 in the dead zone between `min` and `max`; outside it, the magnitude
 * ramps from `1/min` up to `1` as the pointer approaches the edge. Negative
 * means the viewport must move the other way.
 * @param {number} value pointer position along one axis, in pane pixels
 * @param {number} min distance from the near edge at which panning starts
 * @param {number} max distance from the far edge at which panning starts
 * @returns {number}
 */
function calcAutoPanVelocity(value, min, max) {
  if (value < min) {
    return clamp(Math.abs(value - min), 1, min) / min;
  }
  if (value > max) {
    return -clamp(Math.abs(value - max), 1, min) / min;
  }
  return 0;
}

/**
 * Per-frame auto-pan delta for a pointer near the pane edge.
 * @param {import('c/flowTypes').XYPosition} pos pointer position in pane pixels
 * @param {import('c/flowTypes').Dimensions} bounds pane size
 * @param {number} [speed=15] pixels per frame at full velocity
 * @param {number} [distance=40] edge band width in pixels
 * @returns {[number, number]} `[dx, dy]`
 */
function calcAutoPan(pos, bounds, speed = 15, distance = 40) {
  const xMovement = calcAutoPanVelocity(pos.x, distance, bounds.width - distance) * speed;
  const yMovement = calcAutoPanVelocity(pos.y, distance, bounds.height - distance) * speed;
  return [xMovement, yMovement];
}

/**
 * Smallest box containing both boxes.
 * @param {import('c/flowTypes').Box} box1
 * @param {import('c/flowTypes').Box} box2
 * @returns {import('c/flowTypes').Box}
 */
function getBoundsOfBoxes(box1, box2) {
  return {
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2)
  };
}

/**
 * @param {import('c/flowTypes').Rect} rect
 * @returns {import('c/flowTypes').Box}
 */
function rectToBox({
  x,
  y,
  width,
  height
}) {
  return {
    x,
    y,
    x2: x + width,
    y2: y + height
  };
}

/**
 * @param {import('c/flowTypes').Box} box
 * @returns {import('c/flowTypes').Rect}
 */
function boxToRect({
  x,
  y,
  x2,
  y2
}) {
  return {
    x,
    y,
    width: x2 - x,
    height: y2 - y
  };
}

/**
 * Smallest rect containing both rects.
 * @param {import('c/flowTypes').Rect} rect1
 * @param {import('c/flowTypes').Rect} rect2
 * @returns {import('c/flowTypes').Rect}
 */
function getBoundsOfRects(rect1, rect2) {
  return boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
}

/**
 * True when the node carries internal bookkeeping, i.e. it has been adopted.
 * @param {*} node
 * @returns {boolean}
 */
function isInternalNode(node) {
  return !!node && 'internals' in node && !!node.internals;
}

/**
 * Resolve a node's effective size.
 *
 * Precedence is measured, then explicit, then initial, then zero. Upstream uses
 * the same chain everywhere a size is needed, which is why it lives in one
 * place here.
 * @param {{measured?: {width?: number, height?: number}, width?: number, height?: number, initialWidth?: number, initialHeight?: number}} node
 * @returns {import('c/flowTypes').Dimensions}
 */
function getNodeDimensions(node) {
  return {
    width: node.measured?.width ?? node.width ?? node.initialWidth ?? 0,
    height: node.measured?.height ?? node.height ?? node.initialHeight ?? 0
  };
}

/**
 * True once a node has a usable size from any source.
 * @param {*} node
 * @returns {boolean}
 */
function nodeHasDimensions(node) {
  return (node.measured?.width ?? node.width ?? node.initialWidth) !== undefined && (node.measured?.height ?? node.height ?? node.initialHeight) !== undefined;
}

/**
 * A node's stated position shifted by its origin.
 *
 * `origin` is a fraction of the node's own size: `[0,0]` anchors the position
 * at the top-left corner, `[0.5,0.5]` at the centre.
 * @param {*} node
 * @param {import('c/flowTypes').NodeOrigin} [nodeOrigin=[0,0]]
 * @returns {import('c/flowTypes').XYPosition}
 */
function getNodePositionWithOrigin(node, nodeOrigin = [0, 0]) {
  const {
    width,
    height
  } = getNodeDimensions(node);
  const origin = node.origin ?? nodeOrigin;
  return {
    x: node.position.x - width * origin[0],
    y: node.position.y - height * origin[1]
  };
}

/**
 * Node as an absolutely positioned rect.
 *
 * An adopted node already knows its absolute position; a raw user node only has
 * a parent-relative one, so the origin shift is applied instead.
 * @param {*} node
 * @param {import('c/flowTypes').NodeOrigin} [nodeOrigin=[0,0]]
 * @returns {import('c/flowTypes').Rect}
 */
function nodeToRect(node, nodeOrigin = [0, 0]) {
  const {
    x,
    y
  } = isInternalNode(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  const {
    width,
    height
  } = getNodeDimensions(node);
  return {
    x,
    y,
    width,
    height
  };
}

/**
 * Node as an absolutely positioned box.
 * @param {*} node
 * @param {import('c/flowTypes').NodeOrigin} [nodeOrigin=[0,0]]
 * @returns {import('c/flowTypes').Box}
 */
function nodeToBox(node, nodeOrigin = [0, 0]) {
  const {
    x,
    y
  } = isInternalNode(node) ? node.internals.positionAbsolute : getNodePositionWithOrigin(node, nodeOrigin);
  const {
    width,
    height
  } = getNodeDimensions(node);
  return {
    x,
    y,
    x2: x + width,
    y2: y + height
  };
}

/**
 * Area of the intersection of two rects, rounded up. Zero when they miss.
 * @returns {number}
 */
function getRectsOverlappingArea(aX, aY, aWidth, aHeight, bX, bY, bWidth, bHeight) {
  const xOverlap = Math.max(0, Math.min(aX + aWidth, bX + bWidth) - Math.max(aX, bX));
  const yOverlap = Math.max(0, Math.min(aY + aHeight, bY + bHeight) - Math.max(aY, bY));
  return Math.ceil(xOverlap * yOverlap);
}

/**
 * Area of the intersection of two rects, rounded up. Zero when they miss.
 * @param {import('c/flowTypes').Rect} rectA
 * @param {import('c/flowTypes').Rect} rectB
 * @returns {number}
 */
function getOverlappingArea(rectA, rectB) {
  return getRectsOverlappingArea(rectA.x, rectA.y, rectA.width, rectA.height, rectB.x, rectB.y, rectB.width, rectB.height);
}

/**
 * Snap a position to the nearest grid intersection.
 * @param {import('c/flowTypes').XYPosition} position
 * @param {import('c/flowTypes').SnapGrid} [snapGrid=[1,1]]
 * @returns {import('c/flowTypes').XYPosition}
 */
function snapPosition(position, snapGrid = [1, 1]) {
  return {
    x: snapGrid[0] * Math.round(position.x / snapGrid[0]),
    y: snapGrid[1] * Math.round(position.y / snapGrid[1])
  };
}

/**
 * Pane pixels to flow coordinates.
 * @param {import('c/flowTypes').XYPosition} point position relative to the pane
 * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
 * @param {boolean} [snapToGrid=false]
 * @param {import('c/flowTypes').SnapGrid} [snapGrid=[1,1]]
 * @returns {import('c/flowTypes').XYPosition}
 */
function pointToRendererPoint({
  x,
  y
}, [tx, ty, tScale], snapToGrid = false, snapGrid = [1, 1]) {
  const position = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale
  };
  return snapToGrid ? snapPosition(position, snapGrid) : position;
}

/**
 * Flow coordinates to pane pixels. Inverse of {@link pointToRendererPoint}.
 * @param {import('c/flowTypes').XYPosition} point
 * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
 * @returns {import('c/flowTypes').XYPosition}
 */
function rendererPointToPoint({
  x,
  y
}, [tx, ty, tScale]) {
  return {
    x: x * tScale + tx,
    y: y * tScale + ty
  };
}

/**
 * True when `extent` is a real coordinate extent rather than the `'parent'` sentinel.
 * @param {*} extent
 * @returns {boolean}
 */
function isCoordinateExtent(extent) {
  return extent !== undefined && extent !== null && extent !== 'parent';
}

/**
 * Set equality by membership.
 * @param {Set<string>} a
 * @param {Set<string>} b
 * @returns {boolean}
 */
function areSetsEqual(a, b) {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
}

/**
 * Resolve one padding value to pixels.
 *
 * A number is a fraction of the viewport expressed the way upstream does it:
 * the viewport is divided by `1 + padding` and half the difference becomes the
 * padding, so `0.1` leaves roughly 4.5% on each side rather than 10%. Strings
 * ending in `px` or `%` are taken literally.
 * @param {number|string} padding
 * @param {number} viewport width or height in pixels
 * @returns {number} pixels, floored
 */
function parsePadding(padding, viewport) {
  if (typeof padding === 'number') {
    return Math.floor((viewport - viewport / (1 + padding)) * 0.5);
  }
  if (typeof padding === 'string' && padding.endsWith('px')) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(paddingValue);
    }
  }
  if (typeof padding === 'string' && padding.endsWith('%')) {
    const paddingValue = parseFloat(padding);
    if (!Number.isNaN(paddingValue)) {
      return Math.floor(viewport * paddingValue * 0.01);
    }
  }
  return 0;
}

/**
 * Resolve a padding shorthand to per-side pixels plus the axis totals.
 * @param {number|string|{top?: *, right?: *, bottom?: *, left?: *, x?: *, y?: *}} padding
 * @param {number} width
 * @param {number} height
 * @returns {{top: number, right: number, bottom: number, left: number, x: number, y: number}}
 */
function parsePaddings(padding, width, height) {
  if (typeof padding === 'string' || typeof padding === 'number') {
    const paddingY = parsePadding(padding, height);
    const paddingX = parsePadding(padding, width);
    return {
      top: paddingY,
      right: paddingX,
      bottom: paddingY,
      left: paddingX,
      x: paddingX * 2,
      y: paddingY * 2
    };
  }
  if (padding && typeof padding === 'object') {
    const top = parsePadding(padding.top ?? padding.y ?? 0, height);
    const bottom = parsePadding(padding.bottom ?? padding.y ?? 0, height);
    const left = parsePadding(padding.left ?? padding.x ?? 0, width);
    const right = parsePadding(padding.right ?? padding.x ?? 0, width);
    return {
      top,
      right,
      bottom,
      left,
      x: left + right,
      y: top + bottom
    };
  }
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    x: 0,
    y: 0
  };
}

/**
 * The padding a candidate viewport would actually leave around `bounds`.
 * @returns {{left: number, top: number, right: number, bottom: number}}
 */
function calculateAppliedPaddings(bounds, x, y, zoom, width, height) {
  const {
    x: left,
    y: top
  } = rendererPointToPoint(bounds, [x, y, zoom]);
  const {
    x: boundRight,
    y: boundBottom
  } = rendererPointToPoint({
    x: bounds.x + bounds.width,
    y: bounds.y + bounds.height
  }, [x, y, zoom]);
  return {
    left: Math.floor(left),
    top: Math.floor(top),
    right: Math.floor(width - boundRight),
    bottom: Math.floor(height - boundBottom)
  };
}

/**
 * Viewport that encloses `bounds` inside a `width` x `height` pane.
 *
 * Centres the bounds at the largest zoom that fits both axes, clamps that zoom,
 * then nudges the result so asymmetric padding is respected. The nudge only
 * ever pulls inward: `Math.min(..., 0)` discards slack when the fitted view
 * already leaves more room than requested.
 * @param {import('c/flowTypes').Rect} bounds
 * @param {number} width
 * @param {number} height
 * @param {number} minZoom
 * @param {number} maxZoom
 * @param {number|string|Object} padding
 * @returns {import('c/flowTypes').Viewport}
 */
function getViewportForBounds(bounds, width, height, minZoom, maxZoom, padding) {
  const p = parsePaddings(padding, width, height);
  const xZoom = (width - p.x) / bounds.width;
  const yZoom = (height - p.y) / bounds.height;
  const zoom = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y = height / 2 - boundsCenterY * clampedZoom;
  const newPadding = calculateAppliedPaddings(bounds, x, y, clampedZoom, width, height);
  const offset = {
    left: Math.min(newPadding.left - p.left, 0),
    top: Math.min(newPadding.top - p.top, 0),
    right: Math.min(newPadding.right - p.right, 0),
    bottom: Math.min(newPadding.bottom - p.bottom, 0)
  };
  return {
    x: x - offset.left + offset.right,
    y: y - offset.top + offset.bottom,
    zoom: clampedZoom
  };
}

/**
 * Bounding rect of a set of nodes, given as nodes or as ids.
 *
 * Entries that cannot be resolved are skipped. Merging a phantom box for a
 * stale id would stretch the bounds to include the origin, which is why the
 * accumulator starts at infinity and an all-unresolved set returns a zero rect
 * rather than the infinite one.
 * @param {Array<*|string>|Map<string, *>} nodes
 * @param {{nodeOrigin?: import('c/flowTypes').NodeOrigin, nodeLookup?: Map<string, *>}} [params]
 * @returns {import('c/flowTypes').Rect}
 */
function getNodesBounds(nodes, params = {}) {
  const nodeOrigin = params.nodeOrigin ?? [0, 0];
  const nodeLookup = params.nodeLookup;
  const list = nodes instanceof Map ? Array.from(nodes.values()) : nodes;
  if (list.length === 0) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  }
  let hasNode = false;
  let box = {
    x: Infinity,
    y: Infinity,
    x2: -Infinity,
    y2: -Infinity
  };
  for (const nodeOrId of list) {
    const isId = typeof nodeOrId === 'string';
    let currentNode = !nodeLookup && !isId ? nodeOrId : undefined;
    if (nodeLookup) {
      if (isId) {
        currentNode = nodeLookup.get(nodeOrId);
      } else if (!isInternalNode(nodeOrId)) {
        currentNode = nodeLookup.get(nodeOrId.id);
      } else {
        currentNode = nodeOrId;
      }
    }
    if (!currentNode) {
      continue;
    }
    hasNode = true;
    box = getBoundsOfBoxes(box, nodeToBox(currentNode, nodeOrigin));
  }
  return hasNode ? boxToRect(box) : {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
}

/**
 * Bounding rect of every internal node passing `filter`.
 * @param {Map<string, *>} nodeLookup
 * @param {{filter?: (node: *) => boolean}} [params]
 * @returns {import('c/flowTypes').Rect}
 */
function getInternalNodesBounds(nodeLookup, params = {}) {
  let box = {
    x: Infinity,
    y: Infinity,
    x2: -Infinity,
    y2: -Infinity
  };
  let hasVisibleNodes = false;
  nodeLookup.forEach(node => {
    if (params.filter === undefined || params.filter(node)) {
      box = getBoundsOfBoxes(box, nodeToBox(node));
      hasVisibleNodes = true;
    }
  });
  return hasVisibleNodes ? boxToRect(box) : {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
}

/**
 * Internal nodes intersecting a rect given in pane pixels.
 *
 * Used both for `onlyRenderVisibleElements` culling and for marquee selection.
 * `partially` selects on any overlap; otherwise the node must be fully covered.
 *
 * A node that has never been measured has no `handleBounds`, and is reported
 * visible regardless of geometry. That is deliberate and load-bearing: an
 * unmeasured node must render once so the DOM can be measured, otherwise
 * culling would keep it out of the DOM forever and it would never gain a size.
 * @param {Map<string, *>|Array<*>} nodes internal nodes
 * @param {import('c/flowTypes').Rect} rect in pane pixels
 * @param {import('c/flowTypes').Transform} [transform=[0,0,1]]
 * @param {boolean} [partially=false]
 * @param {boolean} [excludeNonSelectableNodes=false]
 * @returns {Array<*>}
 */
function getNodesInside(nodes, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, excludeNonSelectableNodes = false) {
  // Viewport in flow coordinates, kept as scalars to avoid a Rect per node.
  const paneX = (rect.x - tx) / tScale;
  const paneY = (rect.y - ty) / tScale;
  const paneWidth = rect.width / tScale;
  const paneHeight = rect.height / tScale;
  const list = nodes instanceof Map ? Array.from(nodes.values()) : nodes;
  const visibleNodes = [];
  for (const node of list) {
    const {
      measured,
      selectable = true,
      hidden = false
    } = node;
    if (excludeNonSelectableNodes && !selectable || hidden) {
      continue;
    }
    const width = measured?.width ?? node.width ?? node.initialWidth ?? 0;
    const height = measured?.height ?? node.height ?? node.initialHeight ?? 0;
    const {
      x,
      y
    } = node.internals.positionAbsolute;
    const overlappingArea = getRectsOverlappingArea(paneX, paneY, paneWidth, paneHeight, x, y, width, height);
    const area = width * height;
    const partiallyVisible = partially && overlappingArea > 0;
    const forceInitialRender = !node.internals.handleBounds;
    const isVisible = forceInitialRender || partiallyVisible || overlappingArea >= area;
    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  }
  return visibleNodes;
}

/**
 * Absolute position of one handle, in flow coordinates.
 *
 * Handle bounds are stored relative to the node, so the node's absolute
 * position is added back. The handle's own extent is halved to land on its
 * centre, then the connecting side is snapped flush to the node edge so an edge
 * meets the node rather than the middle of the dot.
 * @param {*} node internal node
 * @param {import('c/flowTypes').FlowHandle} handle
 * @param {Position} [fallbackPosition] used when `handle.position` is absent
 * @param {boolean} [center=false] ignore the side snap and return the raw centre
 * @returns {import('c/flowTypes').XYPosition}
 */
function getHandlePosition(node, handle, fallbackPosition = Position.Left, center = false) {
  const x = (handle?.x ?? 0) + node.internals.positionAbsolute.x;
  const y = (handle?.y ?? 0) + node.internals.positionAbsolute.y;
  const {
    width,
    height
  } = handle ? {
    width: handle.width,
    height: handle.height
  } : getNodeDimensions(node);
  if (center) {
    return {
      x: x + width / 2,
      y: y + height / 2
    };
  }
  const position = handle?.position ?? fallbackPosition;
  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y
      };
    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2
      };
    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height
      };
    case Position.Left:
    default:
      return {
        x,
        y: y + height / 2
      };
  }
}

/**
 * Graph state derivation for lwc-flow: node adoption, lookups, connection maps
 * and the change reducers.
 *
 * Service component: no template, no LWC imports, no DOM access. Ported from
 * `@xyflow/system/src/utils/store.ts`, `utils/edges/general.ts` and
 * `@xyflow/react/src/utils/changes.ts`.
 *
 * The central idea, kept from upstream: the user owns a plain array of nodes and
 * edges, and the flow derives an *internal* view of it. Derivation never mutates
 * the user's objects; the original is kept on `internals.userNode` so a repeat
 * adoption of an unchanged node can be skipped by reference.
 */


/** z-index added to a node that is selected while `elevateNodesOnSelect` is on. */
const SELECTED_NODE_Z = ELEVATE_ON_SELECT_Z;

/** z-index step between successive root-level parent subtrees. */
const ROOT_PARENT_Z_INCREMENT = 10;
const defaultOptions = {
  nodeOrigin: [0, 0],
  nodeExtent: infiniteExtent,
  elevateNodesOnSelect: true,
  zIndexMode: 'basic',
  defaults: {}
};
const adoptUserNodesDefaultOptions = {
  ...defaultOptions,
  checkEquality: true
};

/**
 * Shallow merge where an explicit `undefined` does not clobber the base value.
 * @template T
 * @param {T} base
 * @param {Partial<T>} [incoming]
 * @returns {T}
 */
function mergeObjects(base, incoming) {
  const result = {
    ...base
  };
  for (const key in incoming) {
    if (incoming[key] !== undefined) {
      result[key] = incoming[key];
    }
  }
  return result;
}

/** True when `zIndexMode` hands z-index control entirely to the caller. */
function isManualZIndexMode(zIndexMode) {
  return zIndexMode === 'manual';
}

/**
 * Normalise user-declared handles into source/target buckets.
 *
 * Returning `undefined` for an unmeasured node without declared handles is what
 * makes the node get measured: a missing `handleBounds` is the signal that the
 * DOM has not been read yet. When the node *is* measured, the previously
 * measured bounds are carried over instead of being thrown away.
 * @param {*} userNode
 * @param {*} [internalNode] the previous internal node, if any
 * @returns {{source: Array<*>, target: Array<*>}|undefined}
 */
function parseHandles(userNode, internalNode) {
  if (!userNode.handles) {
    return !userNode.measured ? undefined : internalNode?.internals.handleBounds;
  }
  const source = [];
  const target = [];
  for (const handle of userNode.handles) {
    const handleBounds = {
      id: handle.id,
      width: handle.width ?? 1,
      height: handle.height ?? 1,
      nodeId: userNode.id,
      x: handle.x,
      y: handle.y,
      position: handle.position,
      type: handle.type
    };
    if (handle.type === 'source') {
      source.push(handleBounds);
    } else if (handle.type === 'target') {
      target.push(handleBounds);
    }
  }
  return {
    source,
    target
  };
}

/**
 * z-index for one node: its own, plus the selection bump when enabled.
 * @returns {number}
 */
function calculateZ(node, selectedNodeZ, zIndexMode) {
  const zIndex = isNumeric(node.zIndex) ? node.zIndex : 0;
  if (isManualZIndexMode(zIndexMode)) {
    return zIndex;
  }
  return zIndex + (node.selected ? selectedNodeZ : 0);
}

/**
 * Absolute position and z-index of a child node.
 *
 * A child's `position` is relative to its parent, so the parent's absolute
 * position is added. A child is always at least one above its parent, otherwise
 * it would render behind the parent's own background.
 * @returns {{x: number, y: number, z: number}}
 */
function calculateChildXYZ(childNode, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode) {
  const {
    x: parentX,
    y: parentY
  } = parentNode.internals.positionAbsolute;
  const childDimensions = getNodeDimensions(childNode);
  const positionWithOrigin = getNodePositionWithOrigin(childNode, nodeOrigin);
  const clampedPosition = isCoordinateExtent(childNode.extent) ? clampPosition(positionWithOrigin, childNode.extent, childDimensions) : positionWithOrigin;
  let absolutePosition = clampPosition({
    x: parentX + clampedPosition.x,
    y: parentY + clampedPosition.y
  }, nodeExtent, childDimensions);
  if (childNode.extent === 'parent') {
    absolutePosition = clampPositionToParent(absolutePosition, childDimensions, parentNode);
  }
  const childZ = calculateZ(childNode, selectedNodeZ, zIndexMode);
  const parentZ = parentNode.internals.z ?? 0;
  return {
    x: absolutePosition.x,
    y: absolutePosition.y,
    z: parentZ >= childZ ? parentZ + 1 : childZ
  };
}

/** Register `node` under its parent in `parentLookup`. */
function updateParentLookup(node, parentLookup) {
  if (!node.parentId) {
    return;
  }
  const childNodes = parentLookup.get(node.parentId);
  if (childNodes) {
    childNodes.set(node.id, node);
  } else {
    parentLookup.set(node.parentId, new Map([[node.id, node]]));
  }
}

/**
 * Recompute a child's absolute position and z-index, and index it under its parent.
 *
 * Requires the parent to already be in `nodeLookup`, which is why the node array
 * must list parents before their children. A missing parent is reported and the
 * child is left where it is rather than silently reparented to the root.
 * @param {*} node internal child node
 * @param {Map<string, *>} nodeLookup
 * @param {Map<string, Map<string, *>>} parentLookup
 * @param {Object} options
 * @param {{i: number}} [rootParentIndex] running counter used to separate parent subtrees
 * @param {(id: string, message: string) => void} [onError]
 */
function updateChildNode(node, nodeLookup, parentLookup, options, rootParentIndex, onError) {
  const {
    elevateNodesOnSelect,
    nodeOrigin,
    nodeExtent,
    zIndexMode
  } = mergeObjects(defaultOptions, options);
  const parentId = node.parentId;
  const parentNode = nodeLookup.get(parentId);
  if (!parentNode) {
    onError?.('005', `Parent node ${parentId} not found. Make sure that parent nodes come before their child nodes in the nodes array.`);
    return;
  }
  updateParentLookup(node, parentLookup);

  /*
   * Each root-level parent gets its own z band so that a child of one group can
   * never interleave with a child of another. Only the first child triggers the
   * assignment; later children reuse the band.
   */
  if (rootParentIndex && !parentNode.parentId && parentNode.internals.rootParentIndex === undefined && zIndexMode === 'auto') {
    parentNode.internals.rootParentIndex = ++rootParentIndex.i;
    parentNode.internals.z = parentNode.internals.z + rootParentIndex.i * ROOT_PARENT_Z_INCREMENT;
  }
  if (rootParentIndex && parentNode.internals.rootParentIndex !== undefined) {
    rootParentIndex.i = parentNode.internals.rootParentIndex;
  }
  const selectedNodeZ = elevateNodesOnSelect && !isManualZIndexMode(zIndexMode) ? SELECTED_NODE_Z : 0;
  const {
    x,
    y,
    z
  } = calculateChildXYZ(node, parentNode, nodeOrigin, nodeExtent, selectedNodeZ, zIndexMode);
  const {
    positionAbsolute
  } = node.internals;
  const positionChanged = x !== positionAbsolute.x || y !== positionAbsolute.y;
  if (positionChanged || z !== node.internals.z) {
    // A new object marks the node as updated for subscribers comparing by reference.
    nodeLookup.set(node.id, {
      ...node,
      internals: {
        ...node.internals,
        positionAbsolute: positionChanged ? {
          x,
          y
        } : positionAbsolute,
        z
      }
    });
  }
}

/**
 * Derive the internal node view from the user's node array.
 *
 * Rebuilds `nodeLookup` and `parentLookup` from scratch every call. That is not
 * as wasteful as it looks: when `checkEquality` is on, a node whose user object
 * is reference-identical to last time is carried over untouched, so an unchanged
 * graph costs one map insert per node and no allocation.
 *
 * Parents must precede their children in `nodes`.
 * @param {Array<*>} nodes user nodes
 * @param {Map<string, *>} nodeLookup mutated: receives the internal nodes
 * @param {Map<string, Map<string, *>>} parentLookup mutated: receives child maps
 * @param {Object} [options]
 * @param {import('c/flowTypes').NodeOrigin} [options.nodeOrigin=[0,0]]
 * @param {import('c/flowTypes').CoordinateExtent} [options.nodeExtent]
 * @param {boolean} [options.elevateNodesOnSelect=true]
 * @param {'basic'|'auto'|'manual'} [options.zIndexMode='basic']
 * @param {Object} [options.defaults] applied under every user node
 * @param {boolean} [options.checkEquality=true]
 * @param {(id: string, message: string) => void} [options.onError]
 * @returns {{nodesInitialized: boolean, hasSelectedNodes: boolean}}
 */
function adoptUserNodes(nodes, nodeLookup, parentLookup, options = {}) {
  const opts = mergeObjects(adoptUserNodesDefaultOptions, options);
  const onError = options.onError;
  const rootParentIndex = {
    i: 0
  };
  const tmpLookup = new Map(nodeLookup);
  const selectedNodeZ = opts.elevateNodesOnSelect && !isManualZIndexMode(opts.zIndexMode) ? SELECTED_NODE_Z : 0;
  let nodesInitialized = nodes.length > 0;
  let hasSelectedNodes = false;
  nodeLookup.clear();
  parentLookup.clear();
  for (const userNode of nodes) {
    let internalNode = tmpLookup.get(userNode.id);
    if (opts.checkEquality && userNode === internalNode?.internals.userNode) {
      nodeLookup.set(userNode.id, internalNode);
    } else {
      const positionWithOrigin = getNodePositionWithOrigin(userNode, opts.nodeOrigin);
      const extent = isCoordinateExtent(userNode.extent) ? userNode.extent : opts.nodeExtent;
      const clampedPosition = clampPosition(positionWithOrigin, extent, getNodeDimensions(userNode));
      internalNode = {
        ...opts.defaults,
        ...userNode,
        measured: {
          width: userNode.measured?.width,
          height: userNode.measured?.height
        },
        internals: {
          positionAbsolute: clampedPosition,
          handleBounds: parseHandles(userNode, internalNode),
          z: calculateZ(userNode, selectedNodeZ, opts.zIndexMode),
          userNode
        }
      };
      nodeLookup.set(userNode.id, internalNode);
    }
    if ((internalNode.measured === undefined || internalNode.measured.width === undefined || internalNode.measured.height === undefined) && !internalNode.hidden) {
      nodesInitialized = false;
    }
    if (userNode.parentId) {
      updateChildNode(internalNode, nodeLookup, parentLookup, options, rootParentIndex, onError);
    }
    hasSelectedNodes = hasSelectedNodes || (userNode.selected ?? false);
  }
  return {
    nodesInitialized,
    hasSelectedNodes
  };
}

/**
 * Index one connection under `nodeId`, `nodeId-type` and `nodeId-type-handleId`.
 *
 * Three keys rather than one so a consumer can ask "everything touching this
 * node", "everything on its source side", or "everything on this exact handle"
 * without scanning.
 */
function addConnectionToLookup(type, connection, connectionKey, connectionLookup, nodeId, handleId) {
  let key = nodeId;
  const nodeMap = connectionLookup.get(key) || new Map();
  connectionLookup.set(key, nodeMap.set(connectionKey, connection));
  key = `${nodeId}-${type}`;
  const typeMap = connectionLookup.get(key) || new Map();
  connectionLookup.set(key, typeMap.set(connectionKey, connection));
  if (handleId) {
    key = `${nodeId}-${type}-${handleId}`;
    const handleMap = connectionLookup.get(key) || new Map();
    connectionLookup.set(key, handleMap.set(connectionKey, connection));
  }
}

/**
 * Rebuild the connection and edge lookups from the edge array.
 * @param {Map<string, Map<string, *>>} connectionLookup mutated
 * @param {Map<string, *>} edgeLookup mutated
 * @param {Array<*>} edges
 */
function updateConnectionLookup(connectionLookup, edgeLookup, edges) {
  connectionLookup.clear();
  edgeLookup.clear();
  for (const edge of edges) {
    const {
      source: sourceNode,
      target: targetNode,
      sourceHandle = null,
      targetHandle = null
    } = edge;
    const connection = {
      edgeId: edge.id,
      source: sourceNode,
      target: targetNode,
      sourceHandle,
      targetHandle
    };
    const sourceKey = `${sourceNode}-${sourceHandle}--${targetNode}-${targetHandle}`;
    const targetKey = `${targetNode}-${targetHandle}--${sourceNode}-${sourceHandle}`;
    addConnectionToLookup('source', connection, targetKey, connectionLookup, sourceNode, sourceHandle);
    addConnectionToLookup('target', connection, sourceKey, connectionLookup, targetNode, targetHandle);
    edgeLookup.set(edge.id, edge);
  }
}

/**
 * Deterministic edge id from its endpoints. Two connections between the same
 * pair of handles produce the same id, which is what makes duplicate detection
 * work without an id being supplied.
 * @param {import('c/flowTypes').Connection|import('c/flowTypes').FlowEdge} params
 * @returns {string}
 */
function getEdgeId({
  source,
  sourceHandle,
  target,
  targetHandle
}) {
  return `xy-edge__${source}${sourceHandle || ''}-${target}${targetHandle || ''}`;
}

/** True when an equivalent edge already exists. A null handle and a missing handle are the same thing. */
function connectionExists(edge, edges) {
  return edges.some(el => el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
}

/** True when the object already looks like a full edge rather than a bare connection. */
function isEdgeLike(value) {
  return !!value && 'id' in value && 'source' in value && 'target' in value;
}

/**
 * Append an edge to an edge array, skipping invalid and duplicate edges.
 *
 * Returns the original array unchanged when nothing was added, so a caller can
 * compare by reference to detect a no-op.
 * @param {import('c/flowTypes').FlowEdge|import('c/flowTypes').Connection} edgeParams
 * @param {Array<*>} edges
 * @param {{getEdgeId?: Function, onError?: Function}} [options]
 * @returns {Array<*>}
 */
function addEdge(edgeParams, edges, options = {}) {
  if (!edgeParams.source || !edgeParams.target) {
    options.onError?.('006', errorMessages.error006());
    return edges;
  }
  const edgeIdGenerator = options.getEdgeId || getEdgeId;
  const edge = isEdgeLike(edgeParams) ? {
    ...edgeParams
  } : {
    ...edgeParams,
    id: edgeIdGenerator(edgeParams)
  };
  if (connectionExists(edge, edges)) {
    return edges;
  }

  // A null handle is normalised away so later equality checks stay simple.
  if (edge.sourceHandle === null) {
    delete edge.sourceHandle;
  }
  if (edge.targetHandle === null) {
    delete edge.targetHandle;
  }
  return edges.concat(edge);
}

/**
 * Repoint an existing edge at a new connection, keeping its other properties.
 *
 * The edge is removed and re-appended rather than updated in place, so it ends
 * up last in paint order. That matches upstream.
 * @param {*} oldEdge
 * @param {import('c/flowTypes').Connection} newConnection
 * @param {Array<*>} edges
 * @param {{shouldReplaceId?: boolean, getEdgeId?: Function, onError?: Function}} [options]
 * @returns {Array<*>}
 */
function reconnectEdge(oldEdge, newConnection, edges, options = {
  shouldReplaceId: true
}) {
  const {
    id: oldEdgeId,
    ...rest
  } = oldEdge;
  if (!newConnection.source || !newConnection.target) {
    options.onError?.('006', errorMessages.error006());
    return edges;
  }
  const foundEdge = edges.find(e => e.id === oldEdge.id);
  if (!foundEdge) {
    options.onError?.('007', errorMessages.error007(oldEdgeId));
    return edges;
  }
  const edgeIdGenerator = options.getEdgeId || getEdgeId;
  const edge = {
    ...rest,
    id: options.shouldReplaceId ? edgeIdGenerator(newConnection) : oldEdgeId,
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle
  };
  return edges.filter(e => e.id !== oldEdgeId).concat(edge);
}

/**
 * Apply one change to an element. Mutates `element`, which is always a fresh
 * shallow copy made by {@link applyChanges}.
 */
function applyChange(change, element) {
  switch (change.type) {
    case 'select':
      element.selected = change.selected;
      break;
    case 'position':
      if (typeof change.position !== 'undefined') {
        element.position = change.position;
      }
      if (typeof change.dragging !== 'undefined') {
        element.dragging = change.dragging;
      }
      break;
    case 'dimensions':
      if (typeof change.dimensions !== 'undefined') {
        element.measured = {
          ...change.dimensions
        };
        if (change.setAttributes) {
          if (change.setAttributes === true || change.setAttributes === 'width') {
            element.width = change.dimensions.width;
          }
          if (change.setAttributes === true || change.setAttributes === 'height') {
            element.height = change.dimensions.height;
          }
        }
      }
      if (typeof change.resizing === 'boolean') {
        element.resizing = change.resizing;
      }
      break;
  }
}

/**
 * Fold a change list into an element array, returning a new array.
 *
 * Changes are bucketed by id first so each element is visited once. A queued
 * `remove` or `replace` discards every other change for that element, because
 * applying a position update to something about to disappear is wasted work.
 * `add` changes are deferred to the end so their `index` refers to the final
 * array rather than an intermediate one.
 * @param {Array<*>} changes
 * @param {Array<*>} elements
 * @returns {Array<*>}
 */
function applyChanges(changes, elements) {
  const updatedElements = [];
  const changesMap = new Map();
  const addItemChanges = [];
  for (const change of changes) {
    if (change.type === 'add') {
      addItemChanges.push(change);
      continue;
    }
    if (change.type === 'remove' || change.type === 'replace') {
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);
      if (elementChanges) {
        elementChanges.push(change);
      } else {
        changesMap.set(change.id, [change]);
      }
    }
  }
  for (const element of elements) {
    const elementChanges = changesMap.get(element.id);
    if (!elementChanges) {
      updatedElements.push(element);
      continue;
    }
    if (elementChanges[0].type === 'remove') {
      continue;
    }
    if (elementChanges[0].type === 'replace') {
      updatedElements.push({
        ...elementChanges[0].item
      });
      continue;
    }
    const updatedElement = {
      ...element
    };
    for (const change of elementChanges) {
      applyChange(change, updatedElement);
    }
    updatedElements.push(updatedElement);
  }
  for (const change of addItemChanges) {
    if (change.index !== undefined) {
      updatedElements.splice(change.index, 0, {
        ...change.item
      });
    } else {
      updatedElements.push({
        ...change.item
      });
    }
  }
  return updatedElements;
}

/**
 * Apply node changes emitted by the flow to your node array.
 * @param {Array<*>} changes
 * @param {Array<*>} nodes
 * @returns {Array<*>}
 */
function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}

/**
 * Apply edge changes emitted by the flow to your edge array.
 * @param {Array<*>} changes
 * @param {Array<*>} edges
 * @returns {Array<*>}
 */
function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}

/**
 * A `select` change for one element.
 * @param {string} id
 * @param {boolean} selected
 * @returns {{id: string, type: 'select', selected: boolean}}
 */
function createSelectionChange(id, selected) {
  return {
    id,
    type: 'select',
    selected
  };
}

/**
 * A `remove` change for one element.
 * @param {{id: string}} item
 * @returns {{id: string, type: 'remove'}}
 */
function elementToRemoveChange(item) {
  return {
    id: item.id,
    type: 'remove'
  };
}

/**
 * The minimal set of `select` changes that moves `items` to exactly `selectedIds`.
 *
 * Only elements whose selection actually differs produce a change, so a
 * re-selection of the same set emits nothing and no re-render is triggered.
 * @param {Map<string, *>} items
 * @param {Set<string>} [selectedIds]
 * @param {boolean} [mutateItem=false] also write `selected` onto the item
 * @returns {Array<*>}
 */
function getSelectionChanges(items, selectedIds = new Set(), mutateItem = false) {
  const changes = [];
  for (const [id, item] of items) {
    const willBeSelected = selectedIds.has(id);

    // Nothing to do when the item is already in the desired state.
    if (!(item.selected === undefined && !willBeSelected) && item.selected !== willBeSelected) {
      if (mutateItem) {
        /*
         * The Svelte and React stores keep `selected` on the item itself so
         * the renderer can read it without a second lookup.
         */
        item.selected = willBeSelected;
      }
      changes.push(createSelectionChange(item.id, willBeSelected));
    }
  }
  return changes;
}

function _classPrivateFieldLooseBase$b(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$b = 0;
function _classPrivateFieldLooseKey$b(e) { return "__private_" + id$b++ + "_" + e; }

/**
 * State every flow starts with.
 *
 * Kept as a factory rather than a shared frozen object because the Maps and
 * arrays here are mutated in place by the graph derivation.
 * @returns {Object}
 */
function createInitialState() {
  return {
    // graph input, owned by the consumer
    nodes: [],
    edges: [],
    // derived graph views, rebuilt by setNodes/setEdges
    nodeLookup: new Map(),
    parentLookup: new Map(),
    edgeLookup: new Map(),
    connectionLookup: new Map(),
    // pane geometry
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    // lifecycle
    nodesInitialized: false,
    fitViewQueued: false,
    fitViewOptions: undefined,
    panZoom: null,
    domNode: null,
    // viewport configuration
    minZoom: DEFAULT_MIN_ZOOM,
    maxZoom: DEFAULT_MAX_ZOOM,
    translateExtent: infiniteExtent,
    nodeExtent: infiniteExtent,
    nodeOrigin: [0, 0],
    snapToGrid: false,
    snapGrid: [15, 15],
    onlyRenderVisibleElements: false,
    // interaction flags
    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesReconnectable: false,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: false,
    zIndexMode: 'basic',
    selectNodesOnDrag: true,
    autoPanOnNodeDrag: true,
    autoPanOnConnect: true,
    autoPanSpeed: 15,
    connectionMode: ConnectionMode.Strict,
    connectionRadius: 20,
    selectionMode: SelectionMode.Full,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    paneClickDistance: 0,
    nodeClickDistance: 0,
    // transient gesture state
    dragging: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connection: {
      inProgress: false
    },
    multiSelectionActive: false,
    // key state, driven by the renderer's global key handler
    selectionKeyPressed: false,
    deleteKeyPressed: false,
    multiSelectionKeyPressed: false,
    panActivationKeyPressed: false,
    zoomActivationKeyPressed: false,
    // type registries: type name -> LWC constructor, for lwc:is
    nodeTypes: {},
    edgeTypes: {},
    // reporting
    onError: undefined,
    ariaLabelConfig: undefined
  };
}

/**
 * A flow's state container.
 *
 * Not exported directly; construct through {@link createFlowStore}.
 */
var _subscribers = /*#__PURE__*/_classPrivateFieldLooseKey$b("subscribers");
var _batchDepth = /*#__PURE__*/_classPrivateFieldLooseKey$b("batchDepth");
var _dirty = /*#__PURE__*/_classPrivateFieldLooseKey$b("dirty");
class FlowStore {
  constructor() {
    /** @type {Object} current state; treat as read-only from outside */
    this.state = void 0;
    /** @type {Set<{selector: Function, callback: Function, compare: Function, last: *}>} */
    Object.defineProperty(this, _subscribers, {
      writable: true,
      value: new Set()
    });
    /** Commit depth, so nested `update` calls notify once at the outermost exit. */
    Object.defineProperty(this, _batchDepth, {
      writable: true,
      value: 0
    });
    /** Set while a batch is open and at least one `update` landed. */
    Object.defineProperty(this, _dirty, {
      writable: true,
      value: false
    });
    this.state = createInitialState();
  }

  /**
   * Subscribe to a slice of state.
   *
   * The callback fires immediately with the current value so a subscriber does
   * not need a separate initial read, and then on every change.
   * @param {(state: Object) => *} selector
   * @param {(value: *, previous: *) => void} callback
   * @param {{compare?: (a: *, b: *) => boolean, immediate?: boolean}} [options]
   * @returns {() => void} unsubscribe
   */
  subscribe(selector, callback, options = {}) {
    const entry = {
      selector,
      callback,
      compare: options.compare ?? Object.is,
      last: selector(this.state)
    };
    _classPrivateFieldLooseBase$b(this, _subscribers)[_subscribers].add(entry);
    if (options.immediate !== false) {
      callback(entry.last, undefined);
    }
    return () => {
      _classPrivateFieldLooseBase$b(this, _subscribers)[_subscribers].delete(entry);
    };
  }

  /** Drop every subscriber. Called by the root component on teardown. */
  destroy() {
    _classPrivateFieldLooseBase$b(this, _subscribers)[_subscribers].clear();
  }

  /**
   * Merge a partial state and notify affected subscribers.
   *
   * Accepts an updater function for the read-modify-write case, so a caller
   * never has to read `state` and risk acting on a stale copy.
   * @param {Object|((state: Object) => Object)} partial
   */
  update(partial) {
    const patch = typeof partial === 'function' ? partial(this.state) : partial;
    if (!patch) {
      return;
    }
    this.state = {
      ...this.state,
      ...patch
    };
    _classPrivateFieldLooseBase$b(this, _dirty)[_dirty] = true;
    if (_classPrivateFieldLooseBase$b(this, _batchDepth)[_batchDepth] === 0) {
      this._flush();
    }
  }

  /**
   * Run `fn` with notification deferred until it returns.
   *
   * Several `update` calls that belong to one logical change would otherwise
   * each notify, and a subscriber could observe a half-applied state - for
   * example new nodes with a stale lookup.
   * @template T
   * @param {() => T} fn
   * @returns {T}
   */
  batch(fn) {
    _classPrivateFieldLooseBase$b(this, _batchDepth)[_batchDepth]++;
    try {
      return fn();
    } finally {
      _classPrivateFieldLooseBase$b(this, _batchDepth)[_batchDepth]--;
      if (_classPrivateFieldLooseBase$b(this, _batchDepth)[_batchDepth] === 0 && _classPrivateFieldLooseBase$b(this, _dirty)[_dirty]) {
        this._flush();
      }
    }
  }
  _flush() {
    _classPrivateFieldLooseBase$b(this, _dirty)[_dirty] = false;

    /*
     * Iterate a copy: a callback may subscribe or unsubscribe, and mutating
     * the Set mid-iteration would skip or repeat entries.
     */
    for (const entry of Array.from(_classPrivateFieldLooseBase$b(this, _subscribers)[_subscribers])) {
      if (!_classPrivateFieldLooseBase$b(this, _subscribers)[_subscribers].has(entry)) {
        continue;
      }
      const next = entry.selector(this.state);
      if (!entry.compare(next, entry.last)) {
        const previous = entry.last;
        entry.last = next;
        entry.callback(next, previous);
      }
    }
  }

  // ---------------------------------------------------------------- graph

  /**
   * Replace the node array and rederive the internal view.
   *
   * The lookups are mutated in place by `adoptUserNodes`, so they keep their
   * identity across calls; subscribers must select into them rather than
   * comparing the Map by reference.
   * @param {Array<*>} nodes
   */
  setNodes(nodes) {
    const s = this.state;
    const {
      nodesInitialized
    } = adoptUserNodes(nodes, s.nodeLookup, s.parentLookup, {
      nodeOrigin: s.nodeOrigin,
      nodeExtent: s.nodeExtent,
      elevateNodesOnSelect: s.elevateNodesOnSelect,
      zIndexMode: s.zIndexMode,
      checkEquality: true,
      onError: s.onError
    });
    this.update({
      nodes,
      nodesInitialized,
      nodeVersion: (s.nodeVersion ?? 0) + 1
    });
  }

  /**
   * Replace the edge array and rebuild the edge and connection lookups.
   * @param {Array<*>} edges
   */
  setEdges(edges) {
    const s = this.state;
    updateConnectionLookup(s.connectionLookup, s.edgeLookup, edges);
    this.update({
      edges,
      edgeVersion: (s.edgeVersion ?? 0) + 1
    });
  }

  /**
   * Re-run node adoption without a new node array.
   *
   * Needed after anything adoption depends on changes: `nodeOrigin`,
   * `nodeExtent`, `elevateNodesOnSelect`, `zIndexMode`.
   */
  refreshNodeInternals() {
    this.setNodes(this.state.nodes);
  }

  /**
   * Apply a node's DOM measurement to its internal node.
   *
   * Upstream's `updateNodeInternals` in store terms. The internal node is
   * mutated rather than rebuilt, exactly as upstream mutates its `nodeLookup`
   * entry: the consumer's node object is the one thing that must not change,
   * and `measured` plus `internals.handleBounds` live on the internal copy.
   *
   * Re-adopting afterwards is what flips `nodesInitialized`, and node adoption
   * keeps an internal node whose `userNode` is unchanged, so the measurement
   * just written survives the pass.
   *
   * A zero measurement is refused, as upstream refuses one: a node inside a
   * collapsed or `display: none` subtree measures 0x0, and letting that land
   * would throw away a size the consumer declared and break every rect the
   * node takes part in.
   * @param {string} id
   * @param {{width: number, height: number}} dimensions
   * @param {{source: Array<*>|null, target: Array<*>|null}} handleBounds
   * @returns {boolean} whether the measurement was applied
   */
  applyNodeMeasurement(id, dimensions, handleBounds) {
    const internalNode = this.state.nodeLookup.get(id);
    if (!internalNode || !dimensions?.width || !dimensions?.height) {
      return false;
    }
    internalNode.measured = {
      width: dimensions.width,
      height: dimensions.height
    };
    internalNode.internals.handleBounds = handleBounds;
    this.refreshNodeInternals();
    return true;
  }

  /**
   * Look up an internal node.
   * @param {string} id
   * @returns {*|undefined}
   */
  getInternalNode(id) {
    return this.state.nodeLookup.get(id);
  }

  // ------------------------------------------------------------ selection

  /**
   * Select exactly `nodeIds` and `edgeIds`, emitting the minimal change set.
   *
   * Returns the changes rather than applying them: the consumer owns the node
   * and edge arrays, so selection has to travel out through `onnodeschange`
   * and `onedgeschange` like any other change.
   *
   * Nodes and edges are deliberately asymmetric here, matching upstream.
   * Node selection is written onto the INTERNAL node, which `adoptUserNodes`
   * created and owns, so calling this twice with the same selection is a
   * no-op the second time. `edgeLookup` holds the CONSUMER'S own edge objects
   * by reference, so writing `selected` there would mutate the caller's
   * array; edges are left alone and their change is re-emitted until the
   * consumer applies it. Guard the call with a set comparison if repeated
   * emission matters - that is what upstream's `Pane` does.
   * @param {Set<string>|Array<string>} [nodeIds]
   * @param {Set<string>|Array<string>} [edgeIds]
   * @returns {{nodeChanges: Array<*>, edgeChanges: Array<*>}}
   */
  getSelectionChangesFor(nodeIds, edgeIds) {
    const s = this.state;
    const nodeSet = nodeIds instanceof Set ? nodeIds : new Set(nodeIds ?? []);
    const edgeSet = edgeIds instanceof Set ? edgeIds : new Set(edgeIds ?? []);
    return {
      nodeChanges: getSelectionChanges(s.nodeLookup, nodeSet, true),
      edgeChanges: getSelectionChanges(s.edgeLookup, edgeSet, false)
    };
  }

  /**
   * Ids of nodes intersecting a pane-pixel rect, honouring `selectionMode`.
   * @param {import('c/flowTypes').Rect} rect
   * @returns {Array<string>}
   */
  getNodeIdsInRect(rect) {
    const s = this.state;
    return getNodesInside(s.nodeLookup, rect, s.transform, s.selectionMode === SelectionMode.Partial, true).map(node => node.id);
  }

  /**
   * Currently selected node ids.
   * @returns {Set<string>}
   */
  getSelectedNodeIds() {
    const ids = new Set();
    for (const [id, node] of this.state.nodeLookup) {
      if (node.selected) {
        ids.add(id);
      }
    }
    return ids;
  }

  /**
   * Currently selected edge ids.
   * @returns {Set<string>}
   */
  getSelectedEdgeIds() {
    const ids = new Set();
    for (const edge of this.state.edges) {
      if (edge.selected) {
        ids.add(edge.id);
      }
    }
    return ids;
  }

  // ------------------------------------------------------------- viewport

  /**
   * Write the transform.
   *
   * Skips the commit when nothing moved, because this is called from the
   * pan/zoom gesture at pointer frequency and an identical write would still
   * notify every viewport subscriber.
   * @param {import('c/flowTypes').Transform} transform `[tx, ty, scale]`
   */
  setTransform(transform) {
    const [x, y, k] = this.state.transform;
    if (transform[0] === x && transform[1] === y && transform[2] === k) {
      return;
    }
    this.update({
      transform
    });
  }

  /**
   * Record the pane size.
   * @param {number} width
   * @param {number} height
   */
  setDimensions(width, height) {
    if (this.state.width === width && this.state.height === height) {
      return;
    }
    this.update({
      width,
      height
    });
  }

  /** Current viewport as `{x, y, zoom}`. @returns {import('c/flowTypes').Viewport} */
  getViewport() {
    const [x, y, zoom] = this.state.transform;
    return {
      x,
      y,
      zoom
    };
  }

  // ------------------------------------------------------------ utilities

  /**
   * True when the two id sets differ. Used to skip redundant selection work.
   * @param {Set<string>} a
   * @param {Set<string>} b
   * @returns {boolean}
   */
  static selectionChanged(a, b) {
    return !areSetsEqual(a, b);
  }
}

/**
 * Create a flow store.
 *
 * One per `c-flow` instance. The root component owns it, passes it down as
 * `@api store`, and calls `destroy()` in `disconnectedCallback`.
 * @param {Object} [overrides] initial state overrides, typically the root's props
 * @returns {FlowStore}
 */
function createFlowStore(overrides = {}) {
  const store = new FlowStore();
  if (overrides && Object.keys(overrides).length > 0) {
    store.state = {
      ...store.state,
      ...overrides
    };
  }
  return store;
}

/**
 * Selector helper: shallow array equality, for selectors returning id lists.
 * @param {Array<*>} a
 * @param {Array<*>} b
 * @returns {boolean}
 */
function shallowArrayEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Selector helper: shallow object equality one level deep.
 * @param {Object} a
 * @param {Object} b
 * @returns {boolean}
 */
function shallowObjectEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) {
    return false;
  }
  for (const key of ka) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

function _classPrivateFieldLooseBase$a(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$a = 0;
function _classPrivateFieldLooseKey$a(e) { return "__private_" + id$a++ + "_" + e; }

/** Upstream `BackgroundVariant`. */
const VARIANTS = new Set(['dots', 'lines', 'cross']);
const DEFAULT_VARIANT = 'dots';

/** Upstream `defaultSize`: a dot is 1 unit across, a cross arm 6. */
const DEFAULT_SIZE = Object.freeze({
  dots: 1,
  lines: 1,
  cross: 6
});
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
var _unsubscribe$3 = /*#__PURE__*/_classPrivateFieldLooseKey$a("unsubscribe");
var _patternKey = /*#__PURE__*/_classPrivateFieldLooseKey$a("patternKey");
var _pattern = /*#__PURE__*/_classPrivateFieldLooseKey$a("pattern");
class FlowBackground extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    /**
     * Disambiguates the pattern id when one flow renders several backgrounds, as upstream's `id`.
     * Declaring it public shadows `LightningElement`'s reflective `id`, so the value does not also
     * land on the host element as an attribute - which is right, this id is an SVG-internal ref.
     */
    this.id = void 0;
    /** Pattern colour. Falls back to the stylesheet's per-variant default. */
    this.color = void 0;
    /** Colour painted behind the pattern. */
    this.bgColor = void 0;
    /** Extra classes for the `<svg>`. */
    this.className = void 0;
    /** Extra classes for the pattern shape. */
    this.patternClassName = void 0;
    /** Reactive render state: the current viewport transform, `[x, y, zoom]`. */
    this.transformState = [0, 0, 1];
    this._variant = DEFAULT_VARIANT;
    this._gap = DEFAULT_GAP;
    this._size = void 0;
    this._offset = DEFAULT_OFFSET;
    this._lineWidth = DEFAULT_LINE_WIDTH;
    /** Subscription handle and tile memo: the template never reads either directly. */
    Object.defineProperty(this, _unsubscribe$3, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _patternKey, {
      writable: true,
      value: ''
    });
    Object.defineProperty(this, _pattern, {
      writable: true,
      value: null
    });
  }
  /** `dots`, `lines` or `cross`. */
  get variant() {
    return this._variant;
  }
  set variant(value) {
    this._variant = VARIANTS.has(value) ? value : DEFAULT_VARIANT;
  }

  /** Tile spacing in flow units, one number or an `[x, y]` pair. */
  get gap() {
    return this._gap;
  }
  set gap(value) {
    this._gap = Array.isArray(value) ? [...value] : value;
  }

  /** Dot diameter or cross arm length in flow units. Defaults per variant. */
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
  }

  /** Pattern offset in flow units, one number or an `[x, y]` pair. */
  get offset() {
    return this._offset;
  }
  set offset(value) {
    this._offset = Array.isArray(value) ? [...value] : value;
  }

  /** Stroke width of the lines and cross variants. */
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
    _classPrivateFieldLooseBase$a(this, _unsubscribe$3)[_unsubscribe$3] = this.store.subscribe(s => s.transform, transform => {
      this.transformState = transform;
    }, {
      compare: shallowArrayEqual
    });
  }
  disconnectedCallback() {
    _classPrivateFieldLooseBase$a(this, _unsubscribe$3)[_unsubscribe$3]?.();
    _classPrivateFieldLooseBase$a(this, _unsubscribe$3)[_unsubscribe$3] = null;
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
    if (key === _classPrivateFieldLooseBase$a(this, _patternKey)[_patternKey] && _classPrivateFieldLooseBase$a(this, _pattern)[_pattern] !== null) {
      return _classPrivateFieldLooseBase$a(this, _pattern)[_pattern];
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
    _classPrivateFieldLooseBase$a(this, _patternKey)[_patternKey] = key;
    _classPrivateFieldLooseBase$a(this, _pattern)[_pattern] = {
      // The tile origin follows the viewport translate, wrapped into a single tile.
      x: x % scaledGap[0],
      y: y % scaledGap[1],
      width: scaledGap[0],
      height: scaledGap[1],
      transform: `translate(-${scaledOffset[0]},-${scaledOffset[1]})`,
      radius: scaledSize / 2,
      d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}`,
      lineWidth: this._lineWidth
    };
    return _classPrivateFieldLooseBase$a(this, _pattern)[_pattern];
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowBackground, {
  publicProps: {
    store: {
      config: 0
    },
    id: {
      config: 0
    },
    color: {
      config: 0
    },
    bgColor: {
      config: 0
    },
    className: {
      config: 0
    },
    patternClassName: {
      config: 0
    },
    variant: {
      config: 3
    },
    gap: {
      config: 3
    },
    size: {
      config: 3
    },
    offset: {
      config: 3
    },
    lineWidth: {
      config: 3
    }
  },
  fields: ["transformState", "_variant", "_gap", "_size", "_offset", "_lineWidth"]
});
const __lwc_component_class_internal$d = registerComponent(FlowBackground, {
  tmpl: _tmpl$e,
  sel: "c-flow-background",
  apiVersion: 66
});

function stylesheet$a(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  var suffixToken = token ? ("-" + token) : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "position: absolute;inset: 0;pointer-events: none;overflow: visible;}.flow__edges" + shadowSelector + " {width: 100%;height: 100%;overflow: visible;position: absolute;inset: 0;}.flow__edge" + shadowSelector + " {pointer-events: visiblePainted;}.flow__edge-path" + shadowSelector + " {stroke: var(--flow-edge-stroke, var(--slds-g-color-border-2, #b1b1b7));stroke-width: var(--flow-edge-stroke-width, 1);fill: none;vector-effect: non-scaling-stroke;}.flow__edge.selected" + shadowSelector + " .flow__edge-path" + shadowSelector + ",.flow__edge:focus" + shadowSelector + " .flow__edge-path" + shadowSelector + ",.flow__edge:focus-visible" + shadowSelector + " .flow__edge-path" + shadowSelector + " {stroke: var(--flow-edge-stroke-selected, var(--slds-g-color-accent-container-3, #555));}.flow__edge-interaction" + shadowSelector + " {stroke: transparent;fill: none;vector-effect: non-scaling-stroke;}.flow__edge.selectable" + shadowSelector + " {cursor: pointer;}.flow__connectionline" + shadowSelector + " {stroke: var(--flow-connectionline-stroke, var(--slds-g-color-border-2, #b1b1b7));stroke-width: var(--flow-connectionline-stroke-width, 1);fill: none;vector-effect: non-scaling-stroke;pointer-events: none;}.flow__connectionline.invalid" + shadowSelector + " {stroke: var(--flow-connectionline-stroke-invalid, var(--slds-g-color-error-base-40, #ea001e));}.flow__connectionline.valid" + shadowSelector + " {stroke: var(--flow-connectionline-stroke-valid, var(--slds-g-color-success-base-40, #2e844a));}.flow__arrowhead" + shadowSelector + " .arrow" + shadowSelector + ",.flow__arrowhead" + shadowSelector + " .arrowclosed" + shadowSelector + " {stroke: var(--flow-edge-stroke, var(--slds-g-color-border-2, #b1b1b7));}.flow__arrowhead" + shadowSelector + " .arrowclosed" + shadowSelector + " {fill: var(--flow-edge-stroke, var(--slds-g-color-border-2, #b1b1b7));}.flow__edge-path.animated" + shadowSelector + " {stroke-dasharray: 5;animation: flow-dashdraw" + suffixToken + " 0.5s linear infinite;}@keyframes flow-dashdraw" + suffixToken + " {from {stroke-dashoffset: 10;}}@media (prefers-reduced-motion: reduce) {.flow__edge-path.animated" + shadowSelector + " {animation: none;}}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$a = [stylesheet$a];

const $fragment1$9 = parseSVGFragment`<polyline${"c0"}${"s0"} stroke-linecap="round" stroke-linejoin="round"${"a0:points"}${2}/>`;
const $fragment2$5 = parseSVGFragment`<polyline${"c0"}${"s0"} stroke-linecap="round" stroke-linejoin="round" fill="none"${"a0:points"}${2}/>`;
const $fragment3$4 = parseSVGFragment`<path class="flow__edge-interaction${0}"${"a0:d"}${"a0:stroke-width"} stroke="transparent" fill="none"${2}/>`;
const $fragment4$3 = parseSVGFragment`<path${"c0"}${"a0:d"}${"s0"}${"a0:data-edge-id"} fill="none"${2}/>`;
const $fragment5$3 = parseSVGFragment`<path${"c0"}${"a0:d"} fill="none"${2}/>`;
const stc0$8 = {
  classMap: {
    "flow__edges": true
  },
  attrs: {
    "aria-label": "Flow edges"
  },
  key: 0,
  svg: true
};
const stc1$5 = {
  key: 1,
  svg: true
};
const stc2$5 = {
  "flow__arrowhead": true
};
const stc3$3 = {
  "flow__edges-viewport": true
};
function tmpl$d($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, k: api_key, ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment, fr: api_fragment, h: api_element, i: api_iterator, b: api_bind, f: api_flatten} = $api;
  const {_m0} = $ctx;
  return [api_element("svg", stc0$8, [api_element("defs", stc1$5, api_iterator($cmp.markerRows, function (marker) {
    return api_element("marker", {
      classMap: stc2$5,
      attrs: {
        "id": api_scoped_id(marker.id),
        "markerWidth": marker.markerWidth,
        "markerHeight": marker.markerHeight,
        "viewBox": "-10 -10 20 20",
        "markerUnits": marker.markerUnits,
        "orient": marker.orient
      },
      key: api_key(2, marker.id),
      svg: true
    }, [marker.filled ? api_fragment(3, [api_static_fragment($fragment1$9, 5, [api_static_part(0, {
      className: api_normalize_class_name(marker.shapeClass),
      style: marker.style,
      attrs: {
        "points": marker.points
      }
    }, null)])], 0) : api_fragment(3, [api_static_fragment($fragment2$5, 7, [api_static_part(0, {
      className: api_normalize_class_name(marker.shapeClass),
      style: marker.style,
      attrs: {
        "points": marker.points
      }
    }, null)])], 0)]);
  })), api_element("g", {
    classMap: stc3$3,
    style: $cmp.viewportStyle,
    key: 8,
    svg: true
  }, api_flatten([api_iterator($cmp.edgeRows, function (edge) {
    return api_element("g", {
      className: api_normalize_class_name(edge.groupClass),
      attrs: {
        "data-id": edge.id,
        "aria-label": edge.ariaLabel
      },
      key: api_key(9, edge.id),
      on: _m0 || ($ctx._m0 = {
        "click": api_bind($cmp.handleEdgeClick),
        "dblclick": api_bind($cmp.handleEdgeDoubleClick),
        "contextmenu": api_bind($cmp.handleEdgeContextMenu),
        "mouseenter": api_bind($cmp.handleEdgeMouseEnter),
        "mouseleave": api_bind($cmp.handleEdgeMouseLeave)
      }),
      svg: true
    }, [edge.hasInteraction ? api_fragment(10, [api_static_fragment($fragment3$4, 12, [api_static_part(0, {
      attrs: {
        "d": edge.path,
        "stroke-width": edge.interactionWidth
      }
    }, null)])], 0) : null, api_static_fragment($fragment4$3, 14, [api_static_part(0, {
      className: api_normalize_class_name(edge.pathClass),
      style: edge.style,
      attrs: {
        "d": edge.path,
        "data-edge-id": edge.id
      }
    }, null)])]);
  }), $cmp.hasConnection ? api_fragment(15, [api_static_fragment($fragment5$3, 17, [api_static_part(0, {
    className: api_normalize_class_name($cmp.connectionPath.lineClass),
    attrs: {
      "d": $cmp.connectionPath.path
    }
  }, null)])], 0) : null]))])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$d = registerTemplate(tmpl$d);
tmpl$d.stylesheets = [];
tmpl$d.stylesheetToken = "lwc-prlf33nvua";
tmpl$d.legacyStylesheetToken = "lwc-flowEdgeRenderer_flowEdgeRenderer";
if (_implicitStylesheets$a) {
  tmpl$d.stylesheets.push.apply(tmpl$d.stylesheets, _implicitStylesheets$a);
}
freezeTemplate(tmpl$d);

/**
 * SVG path generators for lwc-flow edges.
 *
 * Service component: no template, no LWC imports, no DOM access. Ported from
 * `@xyflow/system/src/utils/edges/*` plus `SimpleBezierEdge.tsx`. The emitted
 * `d` strings are byte-identical to upstream, including spacing, so visual
 * output and snapshot comparisons match React Flow exactly.
 *
 * Every generator returns the same tuple:
 * `[path, labelX, labelY, offsetX, offsetY]`
 * - `path`     the `d` attribute for an SVG `<path>`
 * - `labelX/Y` where to place an edge label
 * - `offsetX/Y` absolute distance from the source point to the label point
 */


/**
 * Midpoint of the straight span between two points, plus the half-extents.
 *
 * Used by straight edges and by the smooth-step generator's default offsets.
 * @returns {[number, number, number, number]} `[centerX, centerY, offsetX, offsetY]`
 */
function getEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY
}) {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
}

/**
 * The `t = 0.5` point of a cubic bezier, plus its offset from the source.
 *
 * This is the algebraic midpoint in parameter space, not the arc-length
 * midpoint. Upstream accepts that approximation because it is one multiply-add
 * per coordinate instead of a curve subdivision.
 * @returns {[number, number, number, number]} `[centerX, centerY, offsetX, offsetY]`
 */
function getBezierEdgeCenter({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceControlX,
  sourceControlY,
  targetControlX,
  targetControlY
}) {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  return [centerX, centerY, Math.abs(centerX - sourceX), Math.abs(centerY - sourceY)];
}

/**
 * How far a bezier control point sits from its handle.
 *
 * When the target is on the expected side of the source the offset is simply
 * half the gap. When the target is behind the handle the distance is negative,
 * and the control point is pushed out by a square-root term instead, which
 * makes a backwards edge bow outward rather than doubling back on itself.
 * @param {number} signedGap signed gap along the handle's axis
 * @param {number} curvature
 * @returns {number}
 */
function calculateControlOffset(signedGap, curvature) {
  if (signedGap >= 0) {
    return 0.5 * signedGap;
  }
  return curvature * 25 * Math.sqrt(-signedGap);
}

/**
 * Control point for one end of a curvature-aware bezier.
 * @returns {[number, number]}
 */
function getControlWithCurvature({
  pos,
  x1,
  y1,
  x2,
  y2,
  c
}) {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
    default:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}

/**
 * Cubic bezier between two handles, curving away from each handle's side.
 * @param {Object} params
 * @param {number} params.sourceX
 * @param {number} params.sourceY
 * @param {Position} [params.sourcePosition='bottom']
 * @param {number} params.targetX
 * @param {number} params.targetY
 * @param {Position} [params.targetPosition='top']
 * @param {number} [params.curvature=0.25]
 * @returns {[string, number, number, number, number]}
 */
function getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  curvature = 0.25
}) {
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}

/**
 * Control point for a simple bezier: always the midpoint along the handle's axis,
 * with no curvature term and no special case for backwards edges.
 * @returns {[number, number]}
 */
function getSimpleControl({
  pos,
  x1,
  y1,
  x2,
  y2
}) {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }
  return [x1, 0.5 * (y1 + y2)];
}

/**
 * Cubic bezier with fixed midpoint controls. Flatter than {@link getBezierPath}
 * and cheaper, but it overlaps itself when an edge runs backwards.
 * @param {Object} params
 * @returns {[string, number, number, number, number]}
 */
function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top
}) {
  const [sourceControlX, sourceControlY] = getSimpleControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY
  });
  const [targetControlX, targetControlY] = getSimpleControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [`M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}

/**
 * Straight line between two handles.
 * @param {Object} params
 * @returns {[string, number, number, number, number]}
 */
function getStraightPath({
  sourceX,
  sourceY,
  targetX,
  targetY
}) {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}

/** Unit vector pointing away from the node for each handle side. */
const handleDirections = {
  [Position.Left]: {
    x: -1,
    y: 0
  },
  [Position.Right]: {
    x: 1,
    y: 0
  },
  [Position.Top]: {
    x: 0,
    y: -1
  },
  [Position.Bottom]: {
    x: 0,
    y: 1
  }
};

/**
 * Which way the route travels between two gapped points.
 *
 * A left/right handle routes horizontally first, a top/bottom handle
 * vertically, and the sign follows whichever side the target is on.
 * @returns {import('c/flowTypes').XYPosition} unit vector
 */
function getDirection({
  source,
  sourcePosition = Position.Bottom,
  target
}) {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? {
      x: 1,
      y: 0
    } : {
      x: -1,
      y: 0
    };
  }
  return source.y < target.y ? {
    x: 0,
    y: 1
  } : {
    x: 0,
    y: -1
  };
}

/** Euclidean distance. */
function distance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Corner waypoints for an orthogonal route between two handles.
 *
 * This approximates orthogonal routing rather than solving it: each handle is
 * pushed `offset` pixels straight out, then the two gapped points are joined by
 * either one or two corners depending on whether the handles face each other.
 * @returns {[Array<import('c/flowTypes').XYPosition>, number, number, number, number]}
 *   `[points, labelX, labelY, offsetX, offsetY]`
 */
function getPoints({
  source,
  sourcePosition = Position.Bottom,
  target,
  targetPosition = Position.Top,
  center,
  offset,
  stepPosition
}) {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = {
    x: source.x + sourceDir.x * offset,
    y: source.y + sourceDir.y * offset
  };
  const targetGapped = {
    x: target.x + targetDir.x * offset,
    y: target.y + targetDir.y * offset
  };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped
  });
  const dirAccessor = dir.x !== 0 ? 'x' : 'y';
  const currDir = dir[dirAccessor];
  let points = [];
  let centerX;
  let centerY;
  const sourceGapOffset = {
    x: 0,
    y: 0
  };
  const targetGapOffset = {
    x: 0,
    y: 0
  };
  const [,, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y
  });

  // Handles face each other: route through one shared mid-line.
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    if (dirAccessor === 'x') {
      centerX = center.x ?? sourceGapped.x + (targetGapped.x - sourceGapped.x) * stepPosition;
      centerY = center.y ?? (sourceGapped.y + targetGapped.y) / 2;
    } else {
      centerX = center.x ?? (sourceGapped.x + targetGapped.x) / 2;
      centerY = center.y ?? sourceGapped.y + (targetGapped.y - sourceGapped.y) * stepPosition;
    }
    const verticalSplit = [{
      x: centerX,
      y: sourceGapped.y
    }, {
      x: centerX,
      y: targetGapped.y
    }];
    const horizontalSplit = [{
      x: sourceGapped.x,
      y: centerY
    }, {
      x: targetGapped.x,
      y: centerY
    }];
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
    }
  } else {
    // One corner. `sourceTarget` takes x from the source and y from the target.
    const sourceTarget = [{
      x: sourceGapped.x,
      y: targetGapped.y
    }];
    const targetSource = [{
      x: targetGapped.x,
      y: sourceGapped.y
    }];
    if (dirAccessor === 'x') {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    if (sourcePosition === targetPosition) {
      const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);

      /*
       * Same side on both ends and closer together than the gap: the corner
       * would land on top of a gapped point and the route would kink. Pull
       * one gap back so the three points stay distinct.
       */
      if (diff <= offset) {
        const gapOffset = Math.min(offset - 1, offset - diff);
        if (sourceDir[dirAccessor] === currDir) {
          sourceGapOffset[dirAccessor] = (sourceGapped[dirAccessor] > source[dirAccessor] ? -1 : 1) * gapOffset;
        } else {
          targetGapOffset[dirAccessor] = (targetGapped[dirAccessor] > target[dirAccessor] ? -1 : 1) * gapOffset;
        }
      }
    }

    // Mixed sides, e.g. Right -> Bottom: the corner may need to flip.
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget = sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo);
      if (flipSourceTarget) {
        points = dirAccessor === 'x' ? sourceTarget : targetSource;
      }
    }
    const sourceGapPoint = {
      x: sourceGapped.x + sourceGapOffset.x,
      y: sourceGapped.y + sourceGapOffset.y
    };
    const targetGapPoint = {
      x: targetGapped.x + targetGapOffset.x,
      y: targetGapped.y + targetGapOffset.y
    };
    const maxXDistance = Math.max(Math.abs(sourceGapPoint.x - points[0].x), Math.abs(targetGapPoint.x - points[0].x));
    const maxYDistance = Math.max(Math.abs(sourceGapPoint.y - points[0].y), Math.abs(targetGapPoint.y - points[0].y));

    // Put the label on the longest segment.
    if (maxXDistance >= maxYDistance) {
      centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
      centerY = points[0].y;
    } else {
      centerX = points[0].x;
      centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
    }
  }
  const gappedSource = {
    x: sourceGapped.x + sourceGapOffset.x,
    y: sourceGapped.y + sourceGapOffset.y
  };
  const gappedTarget = {
    x: targetGapped.x + targetGapOffset.x,
    y: targetGapped.y + targetGapOffset.y
  };
  const pathPoints = [source,
  // Skip a gapped point that coincides with the first/last corner: a duplicate
  // point makes the bend calculation produce a zero-length arc.
  ...(gappedSource.x !== points[0].x || gappedSource.y !== points[0].y ? [gappedSource] : []), ...points, ...(gappedTarget.x !== points[points.length - 1].x || gappedTarget.y !== points[points.length - 1].y ? [gappedTarget] : []), target];
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}

/**
 * One rounded corner at `b`, coming from `a` and leaving toward `c`.
 *
 * The radius is capped at half of either adjacent segment so two corners on a
 * short segment cannot overlap. Collinear triples get a plain line instead.
 * @param {import('c/flowTypes').XYPosition} a
 * @param {import('c/flowTypes').XYPosition} b corner
 * @param {import('c/flowTypes').XYPosition} c
 * @param {number} size requested corner radius
 * @returns {string} SVG path commands
 */
function getBend(a, b, c, size) {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const {
    x,
    y
  } = b;

  // Collinear: nothing to round.
  if (a.x === x && x === c.x || a.y === y && y === c.y) {
    return `L${x} ${y}`;
  }

  // Arriving horizontally.
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}

/**
 * Orthogonal route with rounded corners.
 *
 * `borderRadius: 0` produces hard corners, which is exactly the built-in `step`
 * edge; there is no separate generator for it.
 * @param {Object} params
 * @param {number} params.sourceX
 * @param {number} params.sourceY
 * @param {Position} [params.sourcePosition='bottom']
 * @param {number} params.targetX
 * @param {number} params.targetY
 * @param {Position} [params.targetPosition='top']
 * @param {number} [params.borderRadius=5]
 * @param {number} [params.centerX] override for the mid-line x
 * @param {number} [params.centerY] override for the mid-line y
 * @param {number} [params.offset=20] how far the route leaves each handle before turning
 * @param {number} [params.stepPosition=0.5] where the mid-line sits between the handles
 * @returns {[string, number, number, number, number]}
 */
function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
  centerX,
  centerY,
  offset = 20,
  stepPosition = 0.5
}) {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: {
      x: sourceX,
      y: sourceY
    },
    sourcePosition,
    target: {
      x: targetX,
      y: targetY
    },
    targetPosition,
    center: {
      x: centerX,
      y: centerY
    },
    offset,
    stepPosition
  });
  let path = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    path += getBend(points[i - 1], points[i], points[i + 1], borderRadius);
  }
  path += `L${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return [path, labelX, labelY, offsetX, offsetY];
}

/**
 * Edge-type registry.
 *
 * The flow's edge renderer owns the `<svg>` and paints every edge from its own template, so an edge
 * type is not a component here: it is a path generator plus that generator's option defaults. This
 * module is the lookup table the renderer consults, and it is where upstream's per-edge-type React
 * components (`BezierEdge`, `StraightEdge`, `StepEdge`, `SmoothStepEdge`, `SimpleBezierEdge`) end up.
 *
 * Deviations from upstream:
 * - `getPath` returns an object, not the `[path, labelX, labelY, offsetX, offsetY]` tuple the
 *   generators produce. LWC template expressions cannot index an array, and the renderer reads the
 *   result with dot access.
 * - Upstream reports an unknown edge type through the flow's `onError` callback. That callback can be
 *   passed in here; without one the message goes to `console.warn` so the mistake is not swallowed.
 */


/** The type every edge falls back to, matching upstream's `edge.type || 'default'`. */
const DEFAULT_EDGE_TYPE = 'default';

/** A step edge is a smooth step edge without corner rounding - upstream has no separate generator. */
const STEP_BORDER_RADIUS = 0;

/** Per-edge option names. Upstream nests these in `edge.pathOptions`; a flat edge is accepted too. */
const OPTION_KEYS = Object.freeze(['curvature', 'borderRadius', 'offset', 'stepPosition', 'centerX', 'centerY']);

/**
 * Turn a generator tuple into the shape the renderer reads.
 * @param {[string, number, number, number, number]} tuple
 * @returns {{path: string, labelX: number, labelY: number, offsetX: number, offsetY: number}}
 */
function toPathData([path, labelX, labelY, offsetX, offsetY]) {
  return {
    path,
    labelX,
    labelY,
    offsetX,
    offsetY
  };
}

/** Stands in for upstream's `onError`, which needs a store this module does not have. */
function warnOnError(code, message) {
  console.warn(message);
}

/**
 * The five edge shapes lwc-flow ships. Each entry pairs a path generator with the defaults for the
 * options that generator understands, so the renderer can merge them without knowing the shapes.
 */
const builtinEdgeTypes = Object.freeze({
  default: Object.freeze({
    getPath: geometry => toPathData(getBezierPath(geometry)),
    defaults: Object.freeze({
      curvature: 0.25
    })
  }),
  straight: Object.freeze({
    getPath: geometry => toPathData(getStraightPath(geometry)),
    defaults: Object.freeze({})
  }),
  step: Object.freeze({
    // The radius is forced last: a step edge stays square whatever the edge asks for, which is
    // exactly what upstream's `StepEdge` does when it renders `SmoothStepEdge`.
    getPath: geometry => toPathData(getSmoothStepPath({
      ...geometry,
      borderRadius: STEP_BORDER_RADIUS
    })),
    defaults: Object.freeze({
      borderRadius: STEP_BORDER_RADIUS
    })
  }),
  smoothstep: Object.freeze({
    getPath: geometry => toPathData(getSmoothStepPath(geometry)),
    defaults: Object.freeze({
      borderRadius: 5,
      offset: 20,
      stepPosition: 0.5
    })
  }),
  simplebezier: Object.freeze({
    getPath: geometry => toPathData(getSimpleBezierPath(geometry)),
    defaults: Object.freeze({})
  })
});

/**
 * The registry entry for a type name. A consumer registry wins over the builtins, so a flow can
 * replace `default` wholesale. An unknown name falls back to `default` and is reported, as upstream
 * does; a missing name is not an error, it simply means `default`.
 * @param {string} [type]
 * @param {Object} [edgeTypes] consumer-registered types, keyed the same way
 * @param {Function} [onError] `(code, message)`, upstream's `onError`
 * @returns {{getPath: Function, defaults: Object}}
 */
function resolveEdgeType(type, edgeTypes, onError = warnOnError) {
  const name = type || DEFAULT_EDGE_TYPE;
  if (edgeTypes && Object.prototype.hasOwnProperty.call(edgeTypes, name)) {
    return edgeTypes[name];
  }
  if (Object.prototype.hasOwnProperty.call(builtinEdgeTypes, name)) {
    return builtinEdgeTypes[name];
  }
  onError('011', errorMessages.error011(name));
  return builtinEdgeTypes[DEFAULT_EDGE_TYPE];
}

/**
 * Collect an edge's path options. Upstream keeps them in `pathOptions`; options written straight
 * onto the edge are read too, and the nested form wins when both are present.
 * @param {Object} [edge]
 * @returns {Object}
 */
function getEdgeOptions(edge) {
  if (!edge) {
    return {};
  }
  const options = {};
  for (const key of OPTION_KEYS) {
    if (edge[key] !== undefined) {
      options[key] = edge[key];
    }
  }
  return edge.pathOptions ? {
    ...options,
    ...edge.pathOptions
  } : options;
}

/**
 * Path and label anchor for one edge. Precedence runs defaults, then the edge's own options, then
 * the geometry the renderer measured - the geometry is never negotiable.
 * @param {Object} edge the edge, whose `type` selects the generator
 * @param {Object} geometry `{sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition}`
 * @param {Object} [edgeTypes] consumer-registered types
 * @param {Function} [onError] `(code, message)`, upstream's `onError`
 * @returns {{path: string, labelX: number, labelY: number, offsetX: number, offsetY: number}}
 */
function getEdgePathData(edge, geometry, edgeTypes, onError) {
  const edgeType = resolveEdgeType(edge && edge.type, edgeTypes, onError);
  return edgeType.getPath({
    ...edgeType.defaults,
    ...getEdgeOptions(edge),
    ...geometry
  });
}

const $fragment1$8 = parseSVGFragment`<polyline${"c0"}${"s0"} stroke-linecap="round" stroke-linejoin="round"${"a0:points"}${2}/>`;
const $fragment2$4 = parseSVGFragment`<polyline${"c0"}${"s0"} stroke-linecap="round" fill="none" stroke-linejoin="round"${"a0:points"}${2}/>`;
const stc0$7 = {
  classMap: {
    "flow__marker-defs": true
  },
  attrs: {
    "aria-hidden": "true"
  },
  key: 0,
  svg: true
};
const stc1$4 = {
  key: 1,
  svg: true
};
const stc2$4 = {
  "flow__arrowhead": true
};
function tmpl$c($api, $cmp, $slotset, $ctx) {
  const {gid: api_scoped_id, k: api_key, ncls: api_normalize_class_name, sp: api_static_part, st: api_static_fragment, fr: api_fragment, h: api_element, i: api_iterator} = $api;
  return [api_element("svg", stc0$7, [api_element("defs", stc1$4, api_iterator($cmp.resolvedMarkers, function (marker) {
    return api_element("marker", {
      classMap: stc2$4,
      attrs: {
        "id": api_scoped_id(marker.id),
        "markerWidth": marker.markerWidth,
        "markerHeight": marker.markerHeight,
        "viewBox": "-10 -10 20 20",
        "markerUnits": marker.markerUnits,
        "orient": marker.orient
      },
      key: api_key(2, marker.id),
      svg: true
    }, [marker.filled ? api_fragment(3, [api_static_fragment($fragment1$8, 5, [api_static_part(0, {
      className: api_normalize_class_name(marker.shapeClass),
      style: marker.style,
      attrs: {
        "points": marker.points
      }
    }, null)])], 0) : api_fragment(3, [api_static_fragment($fragment2$4, 7, [api_static_part(0, {
      className: api_normalize_class_name(marker.shapeClass),
      style: marker.style,
      attrs: {
        "points": marker.points
      }
    }, null)])], 0)]);
  }))])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$c = registerTemplate(tmpl$c);
tmpl$c.stylesheets = [];
tmpl$c.stylesheetToken = "lwc-5p3u4bilq5k";
tmpl$c.legacyStylesheetToken = "lwc-flowMarkers_flowMarkers";
freezeTemplate(tmpl$c);

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
  [MarkerType.Arrow]: {
    shapeClass: 'arrow',
    points: '-5,-4 0,0 -5,4',
    filled: false
  },
  [MarkerType.ArrowClosed]: {
    shapeClass: 'arrowclosed',
    points: '-5,-4 0,0 -5,4 -5,-4',
    filled: true
  }
});

/**
 * Stable id for a marker. A string marker is already an id reference; an object marker is
 * identified by its own values so that two edges asking for the same arrowhead share one `<marker>`.
 * @param {string|Object} [marker] marker type string or `EdgeMarker` object
 * @param {string} [id] flow id, prefixed so several flows on one page cannot collide
 * @returns {string}
 */
function getMarkerId(marker, id) {
  if (!marker) {
    return '';
  }
  if (typeof marker === 'string') {
    return marker;
  }
  const idPrefix = id ? `${id}__` : '';
  return `${idPrefix}${Object.keys(marker).sort().map(key => `${key}=${marker[key]}`).join('&')}`;
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
function createMarkerIds(edges, {
  id,
  defaultColor,
  defaultMarkerStart,
  defaultMarkerEnd
}) {
  const ids = new Set();
  return edges.reduce((markers, edge) => {
    [edge.markerStart || defaultMarkerStart, edge.markerEnd || defaultMarkerEnd].forEach(marker => {
      if (marker && typeof marker === 'object') {
        const markerId = getMarkerId(marker, id);
        if (!ids.has(markerId)) {
          markers.push({
            id: markerId,
            color: marker.color || defaultColor,
            ...marker
          });
          ids.add(markerId);
        }
      }
    });
    return markers;
  }, []).sort((a, b) => a.id.localeCompare(b.id));
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
function resolveMarkers(markers, onError) {
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
      style: symbolStyle(marker, shape.filled)
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
class FlowMarkers extends LightningElement {
  constructor(...args) {
    super(...args);
    /** Marker props as produced by {@link createMarkerIds}. */
    this.markers = void 0;
  }
  /** Markers with upstream's attribute defaults applied, unknown types dropped. */
  get resolvedMarkers() {
    return resolveMarkers(this.markers);
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowMarkers, {
  publicProps: {
    markers: {
      config: 0
    }
  }
});
registerComponent(FlowMarkers, {
  tmpl: _tmpl$c,
  sel: "c-flow-markers",
  apiVersion: 66
});

function _classPrivateFieldLooseBase$9(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$9 = 0;
function _classPrivateFieldLooseKey$9(e) { return "__private_" + id$9++ + "_" + e; }

/**
 * The edge layer: one `<svg>` holding every edge plus the in-flight connection
 * line.
 *
 * Every edge is painted from THIS template. That is not a style preference, it
 * is forced: LWC fixes the SVG namespace at template-compile time, so a
 * component whose root is `<g>` compiles to HTML-namespace elements, and a
 * custom element nested inside `<svg>` never upgrades in a browser. See
 * `docs/ARCHITECTURE.md`, decision 3. Consequently an edge *type* is a
 * registered path provider in `c/flowEdgeTypes`, not a component.
 *
 * Edge labels are the exception: they are HTML, and render in a sibling layer
 * above this SVG, which is also how upstream's `EdgeLabelRenderer` works.
 */
var _unsubscribers$3 = /*#__PURE__*/_classPrivateFieldLooseKey$9("unsubscribers");
class FlowEdgeRenderer extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    /** Flow instance id, used to namespace marker ids across multiple flows. */
    this.flowId = void 0;
    /** Default marker applied to edges that declare none. */
    this.defaultMarkerStart = void 0;
    this.defaultMarkerEnd = void 0;
    /** Fallback edge type name for edges without one. */
    this.defaultEdgeType = 'default';
    /** Shape of the in-flight connection line. */
    this.connectionLineType = ConnectionLineType.Bezier;
    Object.defineProperty(this, _unsubscribers$3, {
      writable: true,
      value: []
    });
    this._edgeRows = [];
    this._markers = [];
    this._connectionPath = null;
    this._viewportStyle = '';
  }
  connectedCallback() {
    if (!this.store) {
      return;
    }

    /*
     * Three separate subscriptions rather than one over the whole state: an
     * edge geometry rebuild is expensive, and the connection line changes at
     * pointer frequency. Keeping them apart means dragging a connection does
     * not recompute every edge.
     */
    _classPrivateFieldLooseBase$9(this, _unsubscribers$3)[_unsubscribers$3].push(this.store.subscribe(s => [s.edgeVersion, s.nodeVersion, s.transform[2]], () => this._rebuildEdges(), {
      compare: shallowArrayEqual
    }), this.store.subscribe(s => s.connection, connection => this._rebuildConnectionLine(connection)), this.store.subscribe(s => s.transform, transform => this._applyViewport(transform), {
      compare: shallowArrayEqual
    }));
  }
  disconnectedCallback() {
    for (const unsubscribe of _classPrivateFieldLooseBase$9(this, _unsubscribers$3)[_unsubscribers$3]) {
      unsubscribe();
    }
    _classPrivateFieldLooseBase$9(this, _unsubscribers$3)[_unsubscribers$3] = [];
  }

  /**
   * Point each edge path at its marker, using the marker's RENDERED id.
   *
   * This cannot be a template binding. Under synthetic shadow LWC rewrites
   * every `id` attribute to a root-scoped value, but the set of attributes it
   * rewrites alongside it (`@lwc/shared` `ID_REFERENCING_ATTRIBUTES_SET`) is
   * ARIA idrefs plus `for` and `popovertarget` - no SVG `url(#...)` attribute
   * is included. A bound `marker-end="url(#myId)"` would therefore reference
   * an id that no longer exists, and the arrowhead would silently vanish.
   * Native shadow does not mangle ids; reading the id back off the element
   * handles both modes with one code path.
   */
  renderedCallback() {
    if (!this._edgeRows.length) {
      return;
    }

    // Markers render in `_markers` order, so index maps logical id to real id.
    const rendered = this.template.querySelectorAll('marker');
    const idByLogical = new Map();
    this._markers.forEach((marker, index) => {
      const element = rendered[index];
      if (element) {
        idByLogical.set(marker.id, element.getAttribute('id'));
      }
    });
    for (const row of this._edgeRows) {
      const path = this.template.querySelector(`path[data-edge-id="${row.id}"]`);
      if (!path) {
        continue;
      }
      this._applyMarker(path, 'marker-start', idByLogical.get(row.markerStartId));
      this._applyMarker(path, 'marker-end', idByLogical.get(row.markerEndId));
    }
  }
  _applyMarker(path, attribute, resolvedId) {
    if (resolvedId) {
      path.setAttribute(attribute, `url(#${resolvedId})`);
    } else {
      path.removeAttribute(attribute);
    }
  }

  /** Rows consumed by the template: one per visible edge. */
  get edgeRows() {
    return this._edgeRows;
  }

  /** Template-ready marker definitions, deduplicated across every edge. */
  get markerRows() {
    return this._markers;
  }

  /** Path data for the connection being dragged, or null. */
  get connectionPath() {
    return this._connectionPath;
  }
  get hasConnection() {
    return this._connectionPath !== null;
  }
  get viewportStyle() {
    return this._viewportStyle;
  }

  /**
   * Rebuild the edge rows.
   *
   * Each row is fully resolved here rather than in a template getter, because
   * a getter would recompute on every unrelated render and the template cannot
   * call functions anyway.
   */
  _rebuildEdges() {
    const s = this.store.state;
    const rows = [];
    for (const edge of s.edges) {
      if (edge.hidden) {
        continue;
      }
      const sourceNode = s.nodeLookup.get(edge.source);
      const targetNode = s.nodeLookup.get(edge.target);

      // An edge whose endpoints are not both measured has nowhere to attach.
      if (!sourceNode || !targetNode) {
        continue;
      }
      const geometry = this._resolveGeometry(edge, sourceNode, targetNode, s);
      if (!geometry) {
        continue;
      }
      if (s.onlyRenderVisibleElements && !this._isEdgeVisible(sourceNode, targetNode, s)) {
        continue;
      }
      const pathData = getEdgePathData(edge, geometry, s.edgeTypes);
      const markerStartId = getMarkerId(edge.markerStart ?? this.defaultMarkerStart, this.flowId);
      const markerEndId = getMarkerId(edge.markerEnd ?? this.defaultMarkerEnd, this.flowId);
      rows.push({
        id: edge.id,
        path: pathData.path,
        labelX: pathData.labelX,
        labelY: pathData.labelY,
        label: edge.label,
        groupClass: this._edgeClass(edge, s),
        pathClass: edge.animated ? 'flow__edge-path animated' : 'flow__edge-path',
        style: edge.style ?? '',
        interactionWidth: edge.interactionWidth ?? DEFAULT_INTERACTION_WIDTH,
        hasInteraction: (edge.interactionWidth ?? DEFAULT_INTERACTION_WIDTH) !== 0,
        // Logical ids; the url(#...) reference is applied after render.
        markerStartId,
        markerEndId,
        ariaLabel: edge.ariaLabel ?? `Edge from ${edge.source} to ${edge.target}`,
        zIndex: this._edgeZIndex(edge, sourceNode, targetNode, s)
      });
    }

    /*
     * Paint order is z-index order. SVG has no z-index, so the rows are
     * sorted and emitted in that order; a stable sort keeps declaration order
     * for equal z, which matches upstream.
     */
    rows.sort((a, b) => a.zIndex - b.zIndex);
    this._edgeRows = rows;
    this._markers = resolveMarkers(createMarkerIds(s.edges, {
      id: this.flowId,
      defaultMarkerStart: this.defaultMarkerStart,
      defaultMarkerEnd: this.defaultMarkerEnd
    }), s.onError);
  }

  /**
   * Resolve both endpoints to flow coordinates.
   *
   * Returns null when either handle cannot be found, which happens before the
   * node has been measured. Reporting `error008` on every frame of an
   * unmeasured graph would be noise, so it is reported only when the node is
   * measured and the handle is still missing - that is a real configuration
   * error.
   */
  _resolveGeometry(edge, sourceNode, targetNode, s) {
    const sourceBounds = sourceNode.internals.handleBounds;
    const targetBounds = targetNode.internals.handleBounds;
    if (!sourceBounds || !targetBounds) {
      return null;
    }
    const sourceHandle = this._pickHandle(sourceBounds.source ?? [], edge.sourceHandle);
    const targetHandle = this._pickHandle(s.connectionMode === ConnectionMode.Strict ? targetBounds.target ?? [] : [...(targetBounds.target ?? []), ...(targetBounds.source ?? [])], edge.targetHandle);
    if (!sourceHandle || !targetHandle) {
      s.onError?.('008', `Couldn't resolve a handle for edge ${edge.id}.`);
      return null;
    }
    const sourcePosition = sourceHandle.position;
    const targetPosition = targetHandle.position;
    const source = getHandlePosition(sourceNode, sourceHandle, sourcePosition);
    const target = getHandlePosition(targetNode, targetHandle, targetPosition);
    return {
      sourceX: source.x,
      sourceY: source.y,
      targetX: target.x,
      targetY: target.y,
      sourcePosition,
      targetPosition
    };
  }

  /** First handle, or the one matching `handleId`. */
  _pickHandle(handles, handleId) {
    if (!handles.length) {
      return null;
    }
    return (handleId ? handles.find(h => h.id === handleId) : handles[0]) ?? null;
  }

  /**
   * Whether either endpoint's node overlaps the viewport.
   *
   * A degenerate box (both endpoints identical) is widened by one unit,
   * otherwise a zero-area overlap test would always report invisible and a
   * self-loop would never paint.
   */
  _isEdgeVisible(sourceNode, targetNode, s) {
    const edgeBox = getBoundsOfBoxes(nodeToBox(sourceNode), nodeToBox(targetNode));
    if (edgeBox.x === edgeBox.x2) {
      edgeBox.x2 += 1;
    }
    if (edgeBox.y === edgeBox.y2) {
      edgeBox.y2 += 1;
    }
    const [tx, ty, tScale] = s.transform;
    const viewRect = {
      x: -tx / tScale,
      y: -ty / tScale,
      width: s.width / tScale,
      height: s.height / tScale
    };
    return getOverlappingArea(viewRect, boxToRect(edgeBox)) > 0;
  }

  /**
   * Edge z-index.
   *
   * Edges paint below nodes by default. An edge attached to a child node has
   * to rise above that child's parent, otherwise it would be hidden by the
   * group's background, which is why the node z values feed in here.
   */
  _edgeZIndex(edge, sourceNode, targetNode, s) {
    if (s.zIndexMode === 'manual') {
      return edge.zIndex ?? 0;
    }
    const elevateOnSelect = s.elevateEdgesOnSelect;
    const base = edge.zIndex ?? 0;
    const edgeZ = elevateOnSelect && edge.selected ? base + ELEVATE_ON_SELECT_Z : base;
    const nodeZ = Math.max(sourceNode.parentId || elevateOnSelect && sourceNode.selected ? sourceNode.internals.z : 0, targetNode.parentId || elevateOnSelect && targetNode.selected ? targetNode.internals.z : 0);
    return edgeZ + nodeZ;
  }
  _edgeClass(edge, s) {
    const classes = ['flow__edge', `flow__edge-${edge.type ?? this.defaultEdgeType}`];
    if (edge.selected) {
      classes.push('selected');
    }
    if (edge.animated) {
      classes.push('animated');
    }
    if (edge.selectable ?? s.elementsSelectable) {
      classes.push('selectable');
    }
    if (edge.reconnectable ?? s.edgesReconnectable) {
      classes.push('updatable');
    }
    return classes.join(' ');
  }

  /**
   * Build the in-flight connection path.
   *
   * The line runs from the originating handle to the pointer, or to the handle
   * the pointer has snapped to. Reusing the edge path providers keeps the
   * preview visually identical to the edge that will be created.
   */
  _rebuildConnectionLine(connection) {
    if (!connection?.inProgress) {
      this._connectionPath = null;
      return;
    }
    const from = connection.from;
    const to = connection.to;
    if (!from || !to) {
      this._connectionPath = null;
      return;
    }
    const provider = builtinEdgeTypes[this.connectionLineType] ?? builtinEdgeTypes.default;
    const {
      path
    } = provider.getPath({
      sourceX: from.x,
      sourceY: from.y,
      targetX: to.x,
      targetY: to.y,
      sourcePosition: connection.fromPosition,
      targetPosition: connection.toPosition,
      ...provider.defaults
    });
    this._connectionPath = {
      path,
      lineClass: connection.isValid === false ? 'flow__connectionline invalid' : connection.isValid === true ? 'flow__connectionline valid' : 'flow__connectionline'
    };
  }

  /**
   * Mirror the viewport transform onto this SVG's inner group.
   *
   * The edge layer sits inside the pane, not inside the transformed viewport
   * div, because an SVG scaled by CSS would scale its stroke widths too. The
   * transform is applied to a `<g>` instead, which scales geometry while
   * `vector-effect: non-scaling-stroke` keeps strokes constant.
   */
  _applyViewport([x, y, k]) {
    this._viewportStyle = `transform: translate(${x}px, ${y}px) scale(${k});`;
  }
  handleEdgeClick(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgeclick', {
      detail: {
        id
      }
    }));
  }
  handleEdgeDoubleClick(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgedoubleclick', {
      detail: {
        id
      }
    }));
  }
  handleEdgeContextMenu(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgecontextmenu', {
      detail: {
        id
      }
    }));
  }
  handleEdgeMouseEnter(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgemouseenter', {
      detail: {
        id
      }
    }));
  }
  handleEdgeMouseLeave(event) {
    const id = event.currentTarget.dataset.id;
    this.dispatchEvent(new CustomEvent('edgemouseleave', {
      detail: {
        id
      }
    }));
  }

  /** Force a rebuild. Used by the root after a measurement round. */
  refresh() {
    if (this.store) {
      this._rebuildEdges();
    }
  }

  /** Exposed for measurement: node dimensions helper used by tests. */
  getNodeSize(nodeId) {
    const node = this.store?.state.nodeLookup.get(nodeId);
    return node ? getNodeDimensions(node) : {
      width: 0,
      height: 0
    };
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowEdgeRenderer, {
  publicProps: {
    store: {
      config: 0
    },
    flowId: {
      config: 0
    },
    defaultMarkerStart: {
      config: 0
    },
    defaultMarkerEnd: {
      config: 0
    },
    defaultEdgeType: {
      config: 0
    },
    connectionLineType: {
      config: 0
    }
  },
  publicMethods: ["refresh", "getNodeSize"],
  fields: ["_edgeRows", "_markers", "_connectionPath", "_viewportStyle"]
});
const __lwc_component_class_internal$c = registerComponent(FlowEdgeRenderer, {
  tmpl: _tmpl$d,
  sel: "c-flow-edge-renderer",
  apiVersion: 66
});

function stylesheet$9(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none;}.flow__nodes" + shadowSelector + " {position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none;transform-origin: 0 0;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$9 = [stylesheet$9];

function stylesheet$8(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".flow__node" + shadowSelector + " {position: absolute;user-select: none;pointer-events: all;transform-origin: 0 0;box-sizing: border-box;cursor: default;}.flow__node.selectable" + shadowSelector + " {cursor: pointer;}.flow__node.selectable:focus" + shadowSelector + ",.flow__node.selectable:focus-visible" + shadowSelector + " {outline: none;}.flow__node.draggable" + shadowSelector + " {cursor: grab;pointer-events: all;}.flow__node.draggable.dragging" + shadowSelector + " {cursor: grabbing;}.flow__node-input" + shadowSelector + ",.flow__node-default" + shadowSelector + ",.flow__node-output" + shadowSelector + ",.flow__node-group" + shadowSelector + " {padding: var(--flow-node-padding, 10px);width: 150px;font-size: var(--flow-node-font-size, 12px);text-align: center;border-radius: var(--flow-node-border-radius, var(--slds-g-radius-border-2, 3px));color: var(--flow-node-color, var(--slds-g-color-on-surface-1, #222));border: var(--flow-node-border, 1px solid var(--slds-g-color-border-2, #1a192b));background-color: var(--flow-node-background, var(--slds-g-color-surface-container-1, #ffffff));}.flow__node-input.selectable:hover" + shadowSelector + ",.flow__node-default.selectable:hover" + shadowSelector + ",.flow__node-output.selectable:hover" + shadowSelector + ",.flow__node-group.selectable:hover" + shadowSelector + " {box-shadow: var(--flow-node-box-shadow-hover, 0 1px 4px 1px rgba(0, 0, 0, 0.08));}.flow__node-input.selectable.selected" + shadowSelector + ",.flow__node-default.selectable.selected" + shadowSelector + ",.flow__node-output.selectable.selected" + shadowSelector + ",.flow__node-group.selectable.selected" + shadowSelector + ",.flow__node-input.selectable:focus" + shadowSelector + ",.flow__node-default.selectable:focus" + shadowSelector + ",.flow__node-output.selectable:focus" + shadowSelector + ",.flow__node-group.selectable:focus" + shadowSelector + ",.flow__node-input.selectable:focus-visible" + shadowSelector + ",.flow__node-default.selectable:focus-visible" + shadowSelector + ",.flow__node-output.selectable:focus-visible" + shadowSelector + ",.flow__node-group.selectable:focus-visible" + shadowSelector + " {box-shadow: var(--flow-node-box-shadow-selected, 0 0 0 0.5px #1a192b);}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$8 = [stylesheet$8];

function tmpl$b($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, ti: api_tab_index, b: api_bind, dc: api_dynamic_component, fr: api_fragment, h: api_element} = $api;
  const {_m0, _m1} = $ctx;
  return [$cmp.hasNode ? api_fragment(0, [api_element("div", {
    className: api_normalize_class_name($cmp.rootClass),
    style: $cmp.rootStyle,
    attrs: {
      "data-id": $cmp.nodeId,
      "tabindex": api_tab_index($cmp.tabIndex),
      "role": $cmp.role,
      "aria-label": $cmp.ariaLabel,
      "aria-roledescription": "node"
    },
    ref: "node",
    key: 1,
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleClick),
      "dblclick": api_bind($cmp.handleDoubleClick),
      "contextmenu": api_bind($cmp.handleContextMenu),
      "mouseenter": api_bind($cmp.handleMouseEnter),
      "mouseleave": api_bind($cmp.handleMouseLeave),
      "keydown": api_bind($cmp.handleKeyDown)
    })
  }, [$cmp.nodeCtor ? api_fragment(2, [api_dynamic_component($cmp.nodeCtor, {
    props: {
      ...$cmp.nodeProps
    },
    key: 3,
    on: _m1 || ($ctx._m1 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  })], 0) : null])], 0) : null];
  /*LWC compiler v9.4.3*/
}
var _tmpl$b = registerTemplate(tmpl$b);
tmpl$b.hasRefs = true;
tmpl$b.stylesheets = [];
tmpl$b.stylesheetToken = "lwc-77h8ablv99t";
tmpl$b.legacyStylesheetToken = "lwc-flowNodeWrapper_flowNodeWrapper";
if (_implicitStylesheets$8) {
  tmpl$b.stylesheets.push.apply(tmpl$b.stylesheets, _implicitStylesheets$8);
}
freezeTemplate(tmpl$b);

/**
 * DOM readers for lwc-flow.
 *
 * Service component: no template, no LWC imports. Every function here reads the
 * DOM; nothing writes it. Isolated into its own bundle so the rest of the port
 * stays pure and cheap to test.
 *
 * Ported from `@xyflow/system/src/utils/dom.ts`, with the shadow-DOM
 * adjustments the LWC binding needs: upstream can walk `parentElement` and call
 * `closest` freely because React Flow renders one flat tree, while here every
 * component has its own shadow root and a naive walk stops at the first
 * boundary.
 */


/**
 * Offset size of an element.
 *
 * `offsetWidth`/`offsetHeight` rather than `getBoundingClientRect`, because
 * these are unaffected by the viewport's CSS scale and so report the node's own
 * layout size at zoom 1. A rect-based measurement would shrink as the user
 * zooms out and the stored size would drift.
 * @param {HTMLElement} node
 * @returns {import('c/flowTypes').Dimensions}
 */
function getDimensions(node) {
  return {
    width: node.offsetWidth,
    height: node.offsetHeight
  };
}

/** Elements whose own key handling must win over the flow's shortcuts. */
const INPUT_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];

/**
 * True when a key event originated in something the user is typing into.
 *
 * Uses `composedPath` so an input inside a custom node's shadow root is still
 * recognised; `event.target` alone would be retargeted to the node host and the
 * check would silently fail, letting Delete remove the node while the user was
 * editing a field.
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
function isInputDOMNode(event) {
  const path = event.composedPath?.() ?? [];
  const target = path[0] ?? event.target;
  if (target?.nodeType !== 1) {
    return false;
  }
  if (INPUT_TAGS.includes(target.nodeName) || target.hasAttribute?.('contenteditable')) {
    return true;
  }

  // `nokey` opts a subtree out of flow keyboard handling.
  for (const node of path) {
    if (node?.classList?.contains?.('nokey')) {
      return true;
    }
    if (node === document) {
      break;
    }
  }
  return !!target.closest?.('.nokey');
}

/**
 * Pointer or touch position in client coordinates, minus an optional origin.
 * @param {MouseEvent|TouchEvent|PointerEvent} event
 * @param {DOMRect} [bounds]
 * @returns {import('c/flowTypes').XYPosition}
 */
function getEventPosition(event, bounds) {
  const isMouse = 'clientX' in event && event.clientX !== undefined;
  const evtX = isMouse ? event.clientX : event.touches?.[0]?.clientX;
  const evtY = isMouse ? event.clientY : event.touches?.[0]?.clientY;
  return {
    x: evtX - (bounds?.left ?? 0),
    y: evtY - (bounds?.top ?? 0)
  };
}

/**
 * Pointer position in flow coordinates, with and without grid snapping.
 *
 * Both are returned because the drag loop compares the snapped value to decide
 * whether anything actually moved, while the unsnapped value is what the
 * gesture's own bookkeeping tracks.
 * @param {MouseEvent|TouchEvent|PointerEvent} event
 * @param {Object} params
 * @param {import('c/flowTypes').Transform} params.transform
 * @param {import('c/flowTypes').SnapGrid} [params.snapGrid=[0,0]]
 * @param {boolean} [params.snapToGrid=false]
 * @param {DOMRect|null} params.containerBounds
 * @returns {{x: number, y: number, xSnapped: number, ySnapped: number}}
 */
function getPointerPosition(event, {
  snapGrid = [0, 0],
  snapToGrid = false,
  transform,
  containerBounds
}) {
  const {
    x,
    y
  } = getEventPosition(event);
  const pointerPos = pointToRendererPoint({
    x: x - (containerBounds?.left ?? 0),
    y: y - (containerBounds?.top ?? 0)
  }, transform);
  const {
    x: xSnapped,
    y: ySnapped
  } = snapToGrid ? snapPosition(pointerPos, snapGrid) : pointerPos;
  return {
    xSnapped,
    ySnapped,
    ...pointerPos
  };
}

/**
 * Measure a node's handles, relative to the node.
 *
 * Positions are divided by the viewport zoom so the stored bounds are in flow
 * units and stay valid at any zoom level. Returns `null` when the node has no
 * handles of that type, which is the signal the caller uses to distinguish
 * "measured, none present" from "not measured yet".
 *
 * Handles are found with `querySelectorAll` on the node element. Under shadow
 * DOM that only sees the node component's own root, so `c-flow-handle` renders
 * its marker class into that root rather than nesting it inside its own shadow.
 * @param {'source'|'target'} type
 * @param {HTMLElement} nodeElement
 * @param {DOMRect} nodeBounds bounding rect of `nodeElement`
 * @param {number} zoom current viewport scale
 * @param {string} nodeId
 * @returns {Array<import('c/flowTypes').FlowHandle>|null}
 */
function getHandleBounds(type, nodeElement, nodeBounds, zoom, nodeId) {
  const handles = nodeElement.querySelectorAll(`.${type}`);
  if (!handles || !handles.length) {
    return null;
  }
  return Array.from(handles).map(handle => {
    const handleBounds = handle.getBoundingClientRect();
    return {
      id: handle.getAttribute('data-handleid'),
      type,
      nodeId,
      position: handle.getAttribute('data-handlepos'),
      x: (handleBounds.left - nodeBounds.left) / zoom,
      y: (handleBounds.top - nodeBounds.top) / zoom,
      ...getDimensions(handle)
    };
  });
}

/**
 * True when `target`, or an ancestor up to `domNode`, matches `selector`.
 *
 * Walks `composedPath` first so the search crosses shadow boundaries; a
 * `dragHandle` selector or a `nodrag` marker declared inside a custom node must
 * be visible from the pane. Falls back to a `parentElement` walk for synthetic
 * events without a composed path.
 * @param {EventTarget|Element|null} target
 * @param {string} selector
 * @param {Element} domNode search stops here
 * @param {Event} [event] supplies `composedPath` when available
 * @returns {boolean}
 */
function hasSelector(target, selector, domNode, event) {
  const path = event?.composedPath?.() ?? [];
  for (const node of path) {
    if (node?.matches?.(selector)) {
      return true;
    }
    if (node === domNode || node === document) {
      return false;
    }
  }
  let current = target;
  do {
    if (current?.matches?.(selector)) {
      return true;
    }
    if (current === domNode) {
      return false;
    }
    current = current?.parentElement;
  } while (current);
  return false;
}

function _classPrivateFieldLooseBase$8(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$8 = 0;
function _classPrivateFieldLooseKey$8(e) { return "__private_" + id$8++ + "_" + e; }

/**
 * True when any ancestor of `node` is selected.
 *
 * A child of a selected parent must not be dragged on its own: the parent
 * already moves it, and dragging both would double the delta.
 * @param {*} node
 * @param {Map<string, *>} nodeLookup
 * @returns {boolean}
 */
function isParentSelected(node, nodeLookup) {
  if (!node.parentId) {
    return false;
  }
  const parentNode = nodeLookup.get(node.parentId);
  if (!parentNode) {
    return false;
  }
  if (parentNode.selected) {
    return true;
  }
  return isParentSelected(parentNode, nodeLookup);
}

/**
 * Build the drag set: every node that should move with this gesture.
 *
 * A node qualifies when it is selected (or is the node grabbed), is not already
 * carried by a selected ancestor, and is draggable. `draggable` on the node wins
 * over the flow-wide default only when it is explicitly set.
 * @param {Map<string, *>} nodeLookup
 * @param {boolean} nodesDraggable flow-wide default
 * @param {import('c/flowTypes').XYPosition} mousePos in flow coordinates
 * @param {string} [nodeId] the grabbed node, if any
 * @returns {Map<string, *>}
 */
function getDragItems(nodeLookup, nodesDraggable, mousePos, nodeId) {
  const dragItems = new Map();
  for (const [id, node] of nodeLookup) {
    if ((node.selected || node.id === nodeId) && (!node.parentId || !isParentSelected(node, nodeLookup)) && (node.draggable || nodesDraggable && typeof node.draggable === 'undefined')) {
      const internalNode = nodeLookup.get(id);
      if (internalNode) {
        dragItems.set(id, {
          id,
          position: internalNode.position || {
            x: 0,
            y: 0
          },
          distance: {
            x: mousePos.x - internalNode.internals.positionAbsolute.x,
            y: mousePos.y - internalNode.internals.positionAbsolute.y
          },
          extent: internalNode.extent,
          parentId: internalNode.parentId,
          origin: internalNode.origin,
          expandParent: internalNode.expandParent,
          internals: {
            positionAbsolute: internalNode.internals.positionAbsolute || {
              x: 0,
              y: 0
            }
          },
          measured: {
            width: internalNode.measured.width ?? 0,
            height: internalNode.measured.height ?? 0
          }
        });
      }
    }
  }
  return dragItems;
}

/**
 * The payload for a drag callback: the primary node plus the whole drag set.
 *
 * The primary is the grabbed node, or the first of the set when the gesture
 * started on the selection rectangle rather than on a specific node.
 * @param {Object} params
 * @returns {[*, Array<*>]} `[node, nodes]`
 */
function getEventHandlerParams({
  nodeId,
  dragItems,
  nodeLookup,
  dragging = true
}) {
  const nodesFromDragItems = [];
  for (const [id, dragItem] of dragItems) {
    const node = nodeLookup.get(id)?.internals.userNode;
    if (node) {
      nodesFromDragItems.push({
        ...node,
        position: dragItem.position,
        dragging
      });
    }
  }
  if (!nodeId) {
    return [nodesFromDragItems[0], nodesFromDragItems];
  }
  const node = nodeLookup.get(nodeId)?.internals.userNode;
  return [!node ? nodesFromDragItems[0] : {
    ...node,
    position: dragItems.get(nodeId)?.position || node.position,
    dragging
  }, nodesFromDragItems];
}

/**
 * One snap offset for the whole drag set, derived from its first node.
 *
 * Applying `snapPosition` per node would snap each to its own grid cell and
 * shear the selection. Returns `null` for an empty set.
 * @param {Object} params
 * @returns {import('c/flowTypes').XYPosition|null}
 */
function calculateSnapOffset({
  dragItems,
  snapGrid,
  x,
  y
}) {
  const refDragItem = dragItems.values().next().value;
  if (!refDragItem) {
    return null;
  }
  const refPos = {
    x: x - refDragItem.distance.x,
    y: y - refDragItem.distance.y
  };
  const refPosSnapped = snapPosition(refPos, snapGrid);
  return {
    x: refPosSnapped.x - refPos.x,
    y: refPosSnapped.y - refPos.y
  };
}

/**
 * Resolve a node's next position, honouring extent, parent and origin.
 *
 * Returns both the parent-relative `position` the consumer stores and the
 * `positionAbsolute` the renderer paints. The origin term converts from the
 * node's anchor point back to its stated position.
 * @param {Object} params
 * @param {string} params.nodeId
 * @param {import('c/flowTypes').XYPosition} params.nextPosition absolute
 * @param {Map<string, *>} params.nodeLookup
 * @param {import('c/flowTypes').NodeOrigin} [params.nodeOrigin=[0,0]]
 * @param {import('c/flowTypes').CoordinateExtent} [params.nodeExtent]
 * @param {Function} [params.onError]
 * @returns {{position: import('c/flowTypes').XYPosition, positionAbsolute: import('c/flowTypes').XYPosition}}
 */
function calculateNodePosition({
  nodeId,
  nextPosition,
  nodeLookup,
  nodeOrigin = [0, 0],
  nodeExtent,
  onError
}) {
  const node = nodeLookup.get(nodeId);
  const parentNode = node.parentId ? nodeLookup.get(node.parentId) : undefined;
  const {
    x: parentX,
    y: parentY
  } = parentNode ? parentNode.internals.positionAbsolute : {
    x: 0,
    y: 0
  };
  const origin = node.origin ?? nodeOrigin;
  let extent = node.extent || nodeExtent;
  if (node.extent === 'parent' && !node.expandParent) {
    if (!parentNode) {
      onError?.('005', errorMessages.error005());
    } else {
      const {
        width: parentWidth,
        height: parentHeight
      } = getNodeDimensions(parentNode);

      // A parent with no size yet cannot constrain anything.
      if (parentWidth && parentHeight) {
        extent = [[parentX, parentY], [parentX + parentWidth, parentY + parentHeight]];
      }
    }
  } else if (parentNode && isCoordinateExtent(node.extent)) {
    // A child's coordinate extent is parent-relative; shift it to absolute.
    extent = [[node.extent[0][0] + parentX, node.extent[0][1] + parentY], [node.extent[1][0] + parentX, node.extent[1][1] + parentY]];
  }
  const positionAbsolute = isCoordinateExtent(extent) ? clampPosition(nextPosition, extent, node.measured) : nextPosition;
  if (node.measured.width === undefined || node.measured.height === undefined) {
    onError?.('015', errorMessages.error015());
  }
  return {
    position: {
      x: positionAbsolute.x - parentX + (node.measured.width ?? 0) * origin[0],
      y: positionAbsolute.y - parentY + (node.measured.height ?? 0) * origin[1]
    },
    positionAbsolute
  };
}

/**
 * Drag controller for one draggable element.
 */
var _store$2 = /*#__PURE__*/_classPrivateFieldLooseKey$8("store");
var _domNode$1 = /*#__PURE__*/_classPrivateFieldLooseKey$8("domNode");
var _nodeId = /*#__PURE__*/_classPrivateFieldLooseKey$8("nodeId");
var _handleSelector = /*#__PURE__*/_classPrivateFieldLooseKey$8("handleSelector");
var _isSelectionRect = /*#__PURE__*/_classPrivateFieldLooseKey$8("isSelectionRect");
var _onNodeMouseDown = /*#__PURE__*/_classPrivateFieldLooseKey$8("onNodeMouseDown");
var _onDragStart = /*#__PURE__*/_classPrivateFieldLooseKey$8("onDragStart");
var _onDrag = /*#__PURE__*/_classPrivateFieldLooseKey$8("onDrag");
var _onDragStop = /*#__PURE__*/_classPrivateFieldLooseKey$8("onDragStop");
var _pointerId$3 = /*#__PURE__*/_classPrivateFieldLooseKey$8("pointerId");
var _dragging = /*#__PURE__*/_classPrivateFieldLooseKey$8("dragging");
var _dragStarted = /*#__PURE__*/_classPrivateFieldLooseKey$8("dragStarted");
var _dragItems = /*#__PURE__*/_classPrivateFieldLooseKey$8("dragItems");
var _mousePosition = /*#__PURE__*/_classPrivateFieldLooseKey$8("mousePosition");
var _lastPos = /*#__PURE__*/_classPrivateFieldLooseKey$8("lastPos");
var _abortDrag = /*#__PURE__*/_classPrivateFieldLooseKey$8("abortDrag");
var _containerBounds = /*#__PURE__*/_classPrivateFieldLooseKey$8("containerBounds");
var _lastPointerEvent = /*#__PURE__*/_classPrivateFieldLooseKey$8("lastPointerEvent");
var _autoPanFrame = /*#__PURE__*/_classPrivateFieldLooseKey$8("autoPanFrame");
var _autoPanStarted = /*#__PURE__*/_classPrivateFieldLooseKey$8("autoPanStarted");
var _destroyed$1 = /*#__PURE__*/_classPrivateFieldLooseKey$8("destroyed");
var _listeners$1 = /*#__PURE__*/_classPrivateFieldLooseKey$8("listeners");
class Drag {
  /**
   * @param {Object} params
   * @param {import('c/flowStore').FlowStore} params.store
   * @param {HTMLElement} params.domNode element that starts the drag
   * @param {string} [params.nodeId] omit for a selection-rectangle drag
   * @param {string} [params.handleSelector] only this selector starts a drag
   * @param {boolean} [params.isSelectionRect]
   * @param {Function} [params.onNodeMouseDown] fires before the drag, for selection
   * @param {Function} [params.onDragStart]
   * @param {Function} [params.onDrag]
   * @param {Function} [params.onDragStop]
   */
  constructor({
    store,
    domNode,
    nodeId,
    handleSelector,
    isSelectionRect = false,
    onNodeMouseDown,
    onDragStart,
    onDrag,
    onDragStop
  }) {
    Object.defineProperty(this, _store$2, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _domNode$1, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _nodeId, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _handleSelector, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isSelectionRect, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onNodeMouseDown, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onDragStart, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onDrag, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onDragStop, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _pointerId$3, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _dragging, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _dragStarted, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _dragItems, {
      writable: true,
      value: new Map()
    });
    /**
     * Pane-pixel pointer position. Doubles as the press reference for the drag
     * threshold until the drag starts, then tracks the last accepted move.
     */
    Object.defineProperty(this, _mousePosition, {
      writable: true,
      value: {
        x: 0,
        y: 0
      }
    });
    /** Last snapped flow position, used to drop moves that changed nothing. */
    Object.defineProperty(this, _lastPos, {
      writable: true,
      value: {
        xSnapped: 0,
        ySnapped: 0
      }
    });
    /** Set when a gesture must be abandoned: multitouch, or the node vanished. */
    Object.defineProperty(this, _abortDrag, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _containerBounds, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lastPointerEvent, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _autoPanFrame, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _autoPanStarted, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _destroyed$1, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _listeners$1, {
      writable: true,
      value: {}
    });
    _classPrivateFieldLooseBase$8(this, _store$2)[_store$2] = store;
    _classPrivateFieldLooseBase$8(this, _domNode$1)[_domNode$1] = domNode;
    _classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId] = nodeId;
    _classPrivateFieldLooseBase$8(this, _handleSelector)[_handleSelector] = handleSelector;
    _classPrivateFieldLooseBase$8(this, _isSelectionRect)[_isSelectionRect] = isSelectionRect;
    _classPrivateFieldLooseBase$8(this, _onNodeMouseDown)[_onNodeMouseDown] = onNodeMouseDown;
    _classPrivateFieldLooseBase$8(this, _onDragStart)[_onDragStart] = onDragStart;
    _classPrivateFieldLooseBase$8(this, _onDrag)[_onDrag] = onDrag;
    _classPrivateFieldLooseBase$8(this, _onDragStop)[_onDragStop] = onDragStop;
    _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1] = {
      pointerdown: e => this._handlePointerDown(e),
      pointermove: e => this._handlePointerMove(e),
      pointerup: e => this._handlePointerUp(e),
      pointercancel: e => this._handlePointerUp(e)
    };
    domNode.addEventListener('pointerdown', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointerdown);
    domNode.addEventListener('pointermove', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointermove);
    domNode.addEventListener('pointerup', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointerup);
    domNode.addEventListener('pointercancel', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointercancel);
  }

  /** Remove listeners and stop any running auto-pan. Idempotent. */
  destroy() {
    if (_classPrivateFieldLooseBase$8(this, _destroyed$1)[_destroyed$1]) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _destroyed$1)[_destroyed$1] = true;
    this._stopAutoPan();
    const node = _classPrivateFieldLooseBase$8(this, _domNode$1)[_domNode$1];
    node.removeEventListener('pointerdown', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointerdown);
    node.removeEventListener('pointermove', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointermove);
    node.removeEventListener('pointerup', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointerup);
    node.removeEventListener('pointercancel', _classPrivateFieldLooseBase$8(this, _listeners$1)[_listeners$1].pointercancel);
  }

  /** @returns {boolean} whether a drag is currently in progress */
  get isDragging() {
    return _classPrivateFieldLooseBase$8(this, _dragging)[_dragging];
  }
  _paneBounds() {
    const pane = _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state.domNode;
    return pane ? pane.getBoundingClientRect() : null;
  }
  _handlePointerDown(event) {
    if (_classPrivateFieldLooseBase$8(this, _destroyed$1)[_destroyed$1]) {
      return;
    }

    /*
     * A second pointer landing mid-drag is a multitouch gesture, not a drag.
     * This has to be caught here rather than in the move handler: that handler
     * returns immediately for any foreign `pointerId`, and a second finger
     * always has one, so a move-side check could never see it. Upstream gets
     * this for free from d3-drag's own multitouch filtering.
     */
    if (_classPrivateFieldLooseBase$8(this, _pointerId$3)[_pointerId$3] !== null) {
      if (_classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted]) {
        _classPrivateFieldLooseBase$8(this, _abortDrag)[_abortDrag] = true;
      }
      return;
    }
    const s = _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state;

    // Primary button only; other buttons belong to pan and context menu.
    if (event.button !== 0) {
      return;
    }

    // `nodrag` opts a subtree out, e.g. a text field inside a custom node.
    if (hasSelector(event.target, `.${interactionClass.noDrag}`, _classPrivateFieldLooseBase$8(this, _domNode$1)[_domNode$1], event)) {
      return;
    }
    if (_classPrivateFieldLooseBase$8(this, _handleSelector)[_handleSelector] && !hasSelector(event.target, _classPrivateFieldLooseBase$8(this, _handleSelector)[_handleSelector], _classPrivateFieldLooseBase$8(this, _domNode$1)[_domNode$1], event)) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds] = this._paneBounds();
    if (!_classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _pointerId$3)[_pointerId$3] = event.pointerId;
    _classPrivateFieldLooseBase$8(this, _lastPointerEvent)[_lastPointerEvent] = event;
    _classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted] = false;
    _classPrivateFieldLooseBase$8(this, _dragging)[_dragging] = false;
    _classPrivateFieldLooseBase$8(this, _abortDrag)[_abortDrag] = false;
    const pointer = getPointerPosition(event, {
      transform: s.transform,
      snapGrid: s.snapGrid,
      snapToGrid: s.snapToGrid,
      containerBounds: _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]
    });
    _classPrivateFieldLooseBase$8(this, _lastPos)[_lastPos] = pointer;
    _classPrivateFieldLooseBase$8(this, _mousePosition)[_mousePosition] = getEventPosition(event, _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]);
    _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems] = getDragItems(s.nodeLookup, s.nodesDraggable, pointer, _classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId]);

    // Selection happens on press, before any movement, so a click selects.
    _classPrivateFieldLooseBase$8(this, _onNodeMouseDown)[_onNodeMouseDown]?.(_classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId], event);
    _classPrivateFieldLooseBase$8(this, _domNode$1)[_domNode$1].setPointerCapture?.(event.pointerId);

    /*
     * With a zero threshold the drag is live immediately. With a threshold the
     * gesture stays a click until the pointer travels far enough, so a click
     * on a node does not emit a spurious position change.
     */
    if (this._threshold() === 0) {
      this._beginDrag(event, pointer);
    }
  }
  _threshold() {
    const s = _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state;
    return _classPrivateFieldLooseBase$8(this, _isSelectionRect)[_isSelectionRect] ? 0 : s.nodeDragThreshold ?? 1;
  }
  _beginDrag(event, pointer) {
    if (_classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted]) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted] = true;
    _classPrivateFieldLooseBase$8(this, _dragging)[_dragging] = true;
    _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].update({
      dragging: true
    });
    if (_classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems].size > 0) {
      const [node, nodes] = getEventHandlerParams({
        nodeId: _classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId],
        dragItems: _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems],
        nodeLookup: _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state.nodeLookup
      });
      _classPrivateFieldLooseBase$8(this, _onDragStart)[_onDragStart]?.(event, node, nodes);
    }
    if (_classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state.autoPanOnNodeDrag && !_classPrivateFieldLooseBase$8(this, _isSelectionRect)[_isSelectionRect]) {
      this._startAutoPan();
    }

    // Apply the press position once so a zero-threshold drag is not a no-op.
    this._applyPositions(event, pointer);
  }
  _handlePointerMove(event) {
    if (_classPrivateFieldLooseBase$8(this, _pointerId$3)[_pointerId$3] !== event.pointerId) {
      return;
    }
    const s = _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state;
    _classPrivateFieldLooseBase$8(this, _lastPointerEvent)[_lastPointerEvent] = event;
    const pointer = getPointerPosition(event, {
      transform: s.transform,
      snapGrid: s.snapGrid,
      snapToGrid: s.snapToGrid,
      containerBounds: _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]
    });

    /*
     * Abandon the gesture if the node was deleted underneath us; continuing
     * would apply positions to a node that no longer exists. Multitouch is
     * caught in `_handlePointerDown`, because a second finger never reaches
     * this handler: it carries a foreign `pointerId` and is rejected above.
     */
    if (_classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId] && !s.nodeLookup.has(_classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId])) {
      _classPrivateFieldLooseBase$8(this, _abortDrag)[_abortDrag] = true;
    }
    if (_classPrivateFieldLooseBase$8(this, _abortDrag)[_abortDrag]) {
      return;
    }
    if (!_classPrivateFieldLooseBase$8(this, _autoPanStarted)[_autoPanStarted] && s.autoPanOnNodeDrag && _classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted] && !_classPrivateFieldLooseBase$8(this, _isSelectionRect)[_isSelectionRect]) {
      this._startAutoPan();
    }
    if (!_classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted]) {
      /*
       * Threshold is measured in pane pixels, not flow units, so the
       * gesture feels the same at every zoom level. `#mousePosition` is
       * still the press point here.
       */
      const current = getEventPosition(event, _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]);
      const x = current.x - _classPrivateFieldLooseBase$8(this, _mousePosition)[_mousePosition].x;
      const y = current.y - _classPrivateFieldLooseBase$8(this, _mousePosition)[_mousePosition].y;
      if (Math.sqrt(x * x + y * y) > this._threshold()) {
        this._beginDrag(event, pointer);
      } else {
        return;
      }
    }

    // Drop moves that did not change the snapped position: nothing would move.
    if (_classPrivateFieldLooseBase$8(this, _lastPos)[_lastPos].xSnapped === pointer.xSnapped && _classPrivateFieldLooseBase$8(this, _lastPos)[_lastPos].ySnapped === pointer.ySnapped) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _lastPos)[_lastPos] = pointer;
    _classPrivateFieldLooseBase$8(this, _mousePosition)[_mousePosition] = getEventPosition(event, _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]);
    this._applyPositions(event, pointer);
  }

  /**
   * Recompute every dragged node's position and push the changes to the store.
   *
   * Called from both pointer moves and the auto-pan frame loop; the auto-pan
   * case reuses the last pointer position against a freshly panned transform,
   * which is what makes a node keep moving while the pointer is held still at
   * the pane edge.
   */
  _applyPositions(event, pointerOverride) {
    const s = _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state;
    if (_classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems].size === 0) {
      return;
    }
    const pointer = pointerOverride ?? getPointerPosition(_classPrivateFieldLooseBase$8(this, _lastPointerEvent)[_lastPointerEvent], {
      transform: s.transform,
      snapGrid: s.snapGrid,
      snapToGrid: s.snapToGrid,
      containerBounds: _classPrivateFieldLooseBase$8(this, _containerBounds)[_containerBounds]
    });
    const {
      x,
      y
    } = pointer;
    let hasChange = false;
    const snapOffset = s.snapToGrid ? calculateSnapOffset({
      dragItems: _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems],
      snapGrid: s.snapGrid,
      x,
      y
    }) : null;
    const changes = [];
    for (const [id, dragItem] of _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems]) {
      let nextX = x - dragItem.distance.x;
      let nextY = y - dragItem.distance.y;
      if (snapOffset) {
        nextX += snapOffset.x;
        nextY += snapOffset.y;
      }
      const {
        position,
        positionAbsolute
      } = calculateNodePosition({
        nodeId: id,
        nextPosition: {
          x: nextX,
          y: nextY
        },
        nodeLookup: s.nodeLookup,
        nodeOrigin: s.nodeOrigin,
        nodeExtent: s.nodeExtent,
        onError: s.onError
      });
      if (dragItem.position.x !== position.x || dragItem.position.y !== position.y) {
        hasChange = true;
      }
      dragItem.position = position;
      dragItem.internals.positionAbsolute = positionAbsolute;
      changes.push({
        id,
        type: 'position',
        position,
        dragging: true
      });
    }
    if (!hasChange) {
      return;
    }
    const [node, nodes] = getEventHandlerParams({
      nodeId: _classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId],
      dragItems: _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems],
      nodeLookup: s.nodeLookup
    });
    _classPrivateFieldLooseBase$8(this, _onDrag)[_onDrag]?.(event, changes, node, nodes);
  }

  // ------------------------------------------------------------- auto-pan

  _startAutoPan() {
    if (_classPrivateFieldLooseBase$8(this, _autoPanStarted)[_autoPanStarted]) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _autoPanStarted)[_autoPanStarted] = true;
    const step = () => {
      if (!_classPrivateFieldLooseBase$8(this, _dragging)[_dragging] || _classPrivateFieldLooseBase$8(this, _destroyed$1)[_destroyed$1]) {
        _classPrivateFieldLooseBase$8(this, _autoPanStarted)[_autoPanStarted] = false;
        return;
      }
      const s = _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state;
      const [xMovement, yMovement] = calcAutoPan(_classPrivateFieldLooseBase$8(this, _mousePosition)[_mousePosition], {
        width: s.width,
        height: s.height
      }, s.autoPanSpeed, AUTO_PAN_DISTANCE);
      if (xMovement !== 0 || yMovement !== 0) {
        /*
         * Pan first, then recompute positions against the new transform.
         * Doing it the other way round would lag the node one frame behind
         * the viewport and it would visibly drift.
         */
        const moved = s.panZoom?.panBy({
          x: xMovement,
          y: yMovement
        });
        if (moved) {
          this._applyPositions(_classPrivateFieldLooseBase$8(this, _lastPointerEvent)[_lastPointerEvent]);
        }
      }

      // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
      _classPrivateFieldLooseBase$8(this, _autoPanFrame)[_autoPanFrame] = requestAnimationFrame(step);
    };

    // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
    _classPrivateFieldLooseBase$8(this, _autoPanFrame)[_autoPanFrame] = requestAnimationFrame(step);
  }
  _stopAutoPan() {
    if (_classPrivateFieldLooseBase$8(this, _autoPanFrame)[_autoPanFrame] !== null) {
      cancelAnimationFrame(_classPrivateFieldLooseBase$8(this, _autoPanFrame)[_autoPanFrame]);
      _classPrivateFieldLooseBase$8(this, _autoPanFrame)[_autoPanFrame] = null;
    }
    _classPrivateFieldLooseBase$8(this, _autoPanStarted)[_autoPanStarted] = false;
  }
  _handlePointerUp(event) {
    if (_classPrivateFieldLooseBase$8(this, _pointerId$3)[_pointerId$3] !== event.pointerId) {
      return;
    }
    _classPrivateFieldLooseBase$8(this, _domNode$1)[_domNode$1].releasePointerCapture?.(event.pointerId);
    _classPrivateFieldLooseBase$8(this, _pointerId$3)[_pointerId$3] = null;
    this._stopAutoPan();
    if (!_classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted]) {
      // A press that never crossed the threshold: a click, not a drag.
      _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems] = new Map();
      return;
    }
    _classPrivateFieldLooseBase$8(this, _dragging)[_dragging] = false;
    _classPrivateFieldLooseBase$8(this, _dragStarted)[_dragStarted] = false;
    _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].update({
      dragging: false
    });
    if (_classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems].size > 0) {
      const [node, nodes] = getEventHandlerParams({
        nodeId: _classPrivateFieldLooseBase$8(this, _nodeId)[_nodeId],
        dragItems: _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems],
        nodeLookup: _classPrivateFieldLooseBase$8(this, _store$2)[_store$2].state.nodeLookup,
        dragging: false
      });
      const changes = Array.from(_classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems], ([id, item]) => ({
        id,
        type: 'position',
        position: item.position,
        dragging: false
      }));
      _classPrivateFieldLooseBase$8(this, _onDragStop)[_onDragStop]?.(event, changes, node, nodes);
    }
    _classPrivateFieldLooseBase$8(this, _dragItems)[_dragItems] = new Map();
  }
}

/**
 * Attach drag behaviour to an element.
 * @param {Object} params see {@link Drag}
 * @returns {Drag}
 */
function createDrag(params) {
  return new Drag(params);
}

function _classPrivateFieldLooseBase$7(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$7 = 0;
function _classPrivateFieldLooseKey$7(e) { return "__private_" + id$7++ + "_" + e; }

/** Position delta per arrow key, from upstream's `arrowKeyDiffs`. */
const ARROW_KEY_DIFFS = Object.freeze({
  ArrowUp: {
    x: 0,
    y: -1
  },
  ArrowDown: {
    x: 0,
    y: 1
  },
  ArrowLeft: {
    x: -1,
    y: 0
  },
  ArrowRight: {
    x: 1,
    y: 0
  }
});

/** Extra distance an arrow key covers while shift is held, from upstream. */
const SHIFT_FACTOR = 4;

/** The flow-wide flags a node's appearance and behaviour depend on. */
function selectFlags(state) {
  return {
    nodesDraggable: state.nodesDraggable,
    elementsSelectable: state.elementsSelectable,
    nodesConnectable: state.nodesConnectable,
    nodesFocusable: state.nodesFocusable,
    selectNodesOnDrag: state.selectNodesOnDrag,
    nodeDragThreshold: state.nodeDragThreshold,
    nodeTypes: state.nodeTypes,
    ariaLabelConfig: state.ariaLabelConfig,
    onError: state.onError
  };
}

/**
 * Explicit inline size, ported from upstream's `getNodeInlineStyleDimensions`.
 *
 * Before the first measurement an `initialWidth` still counts, so a node that declares its size
 * renders at that size instead of collapsing and then jumping.
 */
function inlineDimensions(node) {
  if (node.internals.handleBounds === undefined || node.internals.handleBounds === null) {
    return {
      width: node.width ?? node.initialWidth ?? node.style?.width,
      height: node.height ?? node.initialHeight ?? node.style?.height
    };
  }
  return {
    width: node.width ?? node.style?.width,
    height: node.height ?? node.style?.height
  };
}

/** `borderRadius` -> `border-radius`, so a consumer's style object can be serialised. */
function toCssName(name) {
  return name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

/** A raw number is a pixel count; a string is already a CSS length. */
function toCssLength(value) {
  return typeof value === 'number' ? `${value}px` : value;
}
var _unsubscribers$2 = /*#__PURE__*/_classPrivateFieldLooseKey$7("unsubscribers");
var _drag = /*#__PURE__*/_classPrivateFieldLooseKey$7("drag");
var _measuredSignature = /*#__PURE__*/_classPrivateFieldLooseKey$7("measuredSignature");
var _reportedTypes = /*#__PURE__*/_classPrivateFieldLooseKey$7("reportedTypes");
var _classKey = /*#__PURE__*/_classPrivateFieldLooseKey$7("classKey");
var _className = /*#__PURE__*/_classPrivateFieldLooseKey$7("className");
var _styleKey = /*#__PURE__*/_classPrivateFieldLooseKey$7("styleKey");
var _style = /*#__PURE__*/_classPrivateFieldLooseKey$7("style");
var _propsNode = /*#__PURE__*/_classPrivateFieldLooseKey$7("propsNode");
var _propsFlags = /*#__PURE__*/_classPrivateFieldLooseKey$7("propsFlags");
var _propsDragging = /*#__PURE__*/_classPrivateFieldLooseKey$7("propsDragging");
var _props = /*#__PURE__*/_classPrivateFieldLooseKey$7("props");
var _ariaSource = /*#__PURE__*/_classPrivateFieldLooseKey$7("ariaSource");
var _ariaConfig = /*#__PURE__*/_classPrivateFieldLooseKey$7("ariaConfig");
class FlowNodeWrapper extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    /** Id of the node this wrapper renders. */
    this.nodeId = void 0;
    /** Id of the owning flow, forwarded to handles so their `data-id` is unique per page. */
    this.flowId = void 0;
    /*
     * Template-visible state. These must be ordinary fields: the LWC babel plugin builds its
     * reactive-field list from `ClassProperty` nodes, so a `#field` is never reactive and the
     * template would never re-render when the store pushes a new value.
     */
    this._node = void 0;
    this._isParent = false;
    this._flags = selectFlags({});
    this._dragging = false;
    /** Subscription handles, the drag controller and render-time caches: never read by the template. */
    Object.defineProperty(this, _unsubscribers$2, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _drag, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _measuredSignature, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _reportedTypes, {
      writable: true,
      value: new Set()
    });
    Object.defineProperty(this, _classKey, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _className, {
      writable: true,
      value: ''
    });
    Object.defineProperty(this, _styleKey, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _style, {
      writable: true,
      value: ''
    });
    Object.defineProperty(this, _propsNode, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _propsFlags, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _propsDragging, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _props, {
      writable: true,
      value: {}
    });
    Object.defineProperty(this, _ariaSource, {
      writable: true,
      value: undefined
    });
    Object.defineProperty(this, _ariaConfig, {
      writable: true,
      value: mergeAriaLabelConfig()
    });
  }
  connectedCallback() {
    const store = this.store;
    if (!store) {
      return;
    }
    _classPrivateFieldLooseBase$7(this, _unsubscribers$2)[_unsubscribers$2] = [
    /*
     * `adoptUserNodes` allocates a new internal node object whenever anything about the
     * node changes, so reference comparison is exactly right here. `isParent` rides along
     * because `parentLookup` is mutated in place and changes when a *child* is added,
     * which need not touch this node's object at all.
     */
    store.subscribe(state => ({
      node: state.nodeLookup.get(this.nodeId),
      isParent: state.parentLookup.has(this.nodeId)
    }), ({
      node,
      isParent
    }) => {
      this._node = node;
      this._isParent = isParent;
    }, {
      compare: shallowObjectEqual
    }), store.subscribe(selectFlags, flags => {
      this._flags = flags;
    }, {
      compare: shallowObjectEqual
    })];
  }
  renderedCallback() {
    this._attachDrag();
    this._measure();
  }
  disconnectedCallback() {
    _classPrivateFieldLooseBase$7(this, _unsubscribers$2)[_unsubscribers$2].forEach(unsubscribe => unsubscribe());
    _classPrivateFieldLooseBase$7(this, _unsubscribers$2)[_unsubscribers$2] = [];
    _classPrivateFieldLooseBase$7(this, _drag)[_drag]?.destroy();
    _classPrivateFieldLooseBase$7(this, _drag)[_drag] = null;
  }

  // ------------------------------------------------------------------ render

  /** A node deleted from under us, or hidden, renders nothing at all - as upstream does. */
  get hasNode() {
    return !!this._node && !this._node.hidden;
  }
  get isDraggable() {
    const node = this._node;
    return !!(node?.draggable || this._flags.nodesDraggable && node?.draggable === undefined);
  }
  get isSelectable() {
    const node = this._node;
    return !!(node?.selectable || this._flags.elementsSelectable && node?.selectable === undefined);
  }
  get isConnectable() {
    const node = this._node;
    return !!(node?.connectable || this._flags.nodesConnectable && node?.connectable === undefined);
  }
  get isFocusable() {
    const node = this._node;
    return !!(node?.focusable || this._flags.nodesFocusable && node?.focusable === undefined);
  }

  /** The registered type name, after falling back to `default` for an unknown one. */
  get nodeType() {
    const requested = this._node?.type || 'default';
    return (this._flags.nodeTypes ?? {})[requested] ? requested : 'default';
  }

  /**
   * Constructor for the node body, resolved through the flow's `nodeTypes` registry.
   *
   * An unknown type is reported once per type name, not once per render. Nothing is reported
   * while the registry itself is still empty: that is a flow that has not finished starting up,
   * not a consumer mistake.
   */
  get nodeCtor() {
    const types = this._flags.nodeTypes ?? {};
    const requested = this._node?.type || 'default';
    const ctor = types[requested];
    if (ctor) {
      return ctor;
    }
    if (types.default && !_classPrivateFieldLooseBase$7(this, _reportedTypes)[_reportedTypes].has(requested)) {
      _classPrivateFieldLooseBase$7(this, _reportedTypes)[_reportedTypes].add(requested);
      this._flags.onError?.('003', errorMessages.error003(requested));
    }
    return types.default ?? null;
  }

  /** The class list of the node's root element. Rebuilt only when one of its inputs changes. */
  get rootClass() {
    const node = this._node;
    const draggable = this.isDraggable;
    const selectable = this.isSelectable;
    const key = `${this.nodeType}|${node?.className ?? ''}|${+!!node?.selected}${+selectable}${+this._isParent}${+draggable}${+this._dragging}`;
    if (key === _classPrivateFieldLooseBase$7(this, _classKey)[_classKey]) {
      return _classPrivateFieldLooseBase$7(this, _className)[_className];
    }
    const classes = ['flow__node', `flow__node-${this.nodeType}`];
    if (draggable) {
      // Overridable by putting `nopan` on user markup, exactly as upstream.
      classes.push(interactionClass.noPan);
    }
    if (node?.className) {
      classes.push(node.className);
    }
    if (node?.selected) {
      classes.push('selected');
    }
    if (selectable) {
      classes.push('selectable');
    }
    if (this._isParent) {
      classes.push('parent');
    }
    if (draggable) {
      classes.push('draggable');
    }
    if (this._dragging) {
      classes.push('dragging');
    }
    _classPrivateFieldLooseBase$7(this, _classKey)[_classKey] = key;
    _classPrivateFieldLooseBase$7(this, _className)[_className] = classes.join(' ');
    return _classPrivateFieldLooseBase$7(this, _className)[_className];
  }

  /**
   * Inline style of the node's root element.
   *
   * A node with no measurement yet is hidden rather than absent: it has to be in the DOM to be
   * measured, but drawing it at its unpositioned size would flash a wrongly sized box.
   */
  get rootStyle() {
    const node = this._node;
    if (!node) {
      return '';
    }
    const {
      x,
      y
    } = node.internals.positionAbsolute;
    const measured = nodeHasDimensions(node);
    const {
      width,
      height
    } = inlineDimensions(node);
    const interactive = this.isSelectable || this.isDraggable;
    const key = `${x}|${y}|${node.internals.z}|${+measured}|${+interactive}|${width}|${height}|${node.style ? JSON.stringify(node.style) : ''}`;
    if (key === _classPrivateFieldLooseBase$7(this, _styleKey)[_styleKey]) {
      return _classPrivateFieldLooseBase$7(this, _style)[_style];
    }
    const declarations = [`z-index: ${node.internals.z}`, `transform: translate(${x}px,${y}px)`, `pointer-events: ${interactive ? 'all' : 'none'}`, `visibility: ${measured ? 'visible' : 'hidden'}`];
    if (node.style) {
      for (const name of Object.keys(node.style)) {
        declarations.push(`${toCssName(name)}: ${toCssLength(node.style[name])}`);
      }
    }

    // Last, so an explicit width always wins over the same key inside `node.style`.
    if (width !== undefined) {
      declarations.push(`width: ${toCssLength(width)}`);
    }
    if (height !== undefined) {
      declarations.push(`height: ${toCssLength(height)}`);
    }
    _classPrivateFieldLooseBase$7(this, _styleKey)[_styleKey] = key;
    _classPrivateFieldLooseBase$7(this, _style)[_style] = `${declarations.join('; ')};`;
    return _classPrivateFieldLooseBase$7(this, _style)[_style];
  }
  get tabIndex() {
    return this.isFocusable ? 0 : null;
  }
  get role() {
    return this._node?.ariaRole ?? (this.isFocusable ? 'group' : null);
  }
  get ariaLabel() {
    const configured = this._flags.ariaLabelConfig;
    if (configured !== _classPrivateFieldLooseBase$7(this, _ariaSource)[_ariaSource]) {
      _classPrivateFieldLooseBase$7(this, _ariaSource)[_ariaSource] = configured;
      _classPrivateFieldLooseBase$7(this, _ariaConfig)[_ariaConfig] = mergeAriaLabelConfig(configured);
    }
    return this._node?.ariaLabel ?? _classPrivateFieldLooseBase$7(this, _ariaConfig)[_ariaConfig]['node.a11yDescription.default'];
  }

  /**
   * The property bag spread onto the node component.
   *
   * Built once per change: `lwc:spread` assigns every key on every render, so handing it a fresh
   * object each time would churn every public property of every node on every commit.
   */
  get nodeProps() {
    const node = this._node;
    if (!node) {
      return _classPrivateFieldLooseBase$7(this, _props)[_props];
    }
    if (_classPrivateFieldLooseBase$7(this, _propsNode)[_propsNode] === node && _classPrivateFieldLooseBase$7(this, _propsFlags)[_propsFlags] === this._flags && _classPrivateFieldLooseBase$7(this, _propsDragging)[_propsDragging] === this._dragging) {
      return _classPrivateFieldLooseBase$7(this, _props)[_props];
    }
    const {
      width,
      height
    } = getNodeDimensions(node);
    const value = {
      id: node.id,
      data: node.data,
      type: this.nodeType,
      selected: node.selected ?? false,
      dragging: this._dragging,
      draggable: this.isDraggable,
      selectable: this.isSelectable,
      connectable: node.connectable,
      deletable: node.deletable ?? true,
      isConnectable: this.isConnectable,
      sourcePosition: node.sourcePosition,
      targetPosition: node.targetPosition,
      positionAbsoluteX: node.internals.positionAbsolute.x,
      positionAbsoluteY: node.internals.positionAbsolute.y,
      width,
      height,
      parentId: node.parentId,
      zIndex: node.internals.z,
      store: this.store,
      flowId: this.flowId
    };
    _classPrivateFieldLooseBase$7(this, _propsNode)[_propsNode] = node;
    _classPrivateFieldLooseBase$7(this, _propsFlags)[_propsFlags] = this._flags;
    _classPrivateFieldLooseBase$7(this, _propsDragging)[_propsDragging] = this._dragging;
    _classPrivateFieldLooseBase$7(this, _props)[_props] = value;
    return value;
  }

  // ------------------------------------------------------------- interaction

  handleClick() {
    /*
     * Upstream selects on click only when the drag path did not already do it on press. The
     * decision travels with the event because the consumer owns the node array; the consumer's
     * own click callback must fire either way, so the event is always dispatched.
     */
    const select = this.isSelectable && (!this._flags.selectNodesOnDrag || !this.isDraggable || this._flags.nodeDragThreshold > 0);
    this._emitClick(select, false);
  }
  handleDoubleClick() {
    this._emit('nodedoubleclick', {
      id: this.nodeId
    });
  }
  handleContextMenu() {
    this._emit('nodecontextmenu', {
      id: this.nodeId
    });
  }
  handleMouseEnter() {
    this._emit('nodemouseenter', {
      id: this.nodeId
    });
  }
  handleMouseLeave() {
    this._emit('nodemouseleave', {
      id: this.nodeId
    });
  }
  handleConnectStart(event) {
    this._emit('connectstart', event.detail);
  }
  handleKeyDown(event) {
    if (isInputDOMNode(event)) {
      return;
    }
    if (elementSelectionKeys.includes(event.key)) {
      if (this.isSelectable) {
        const unselect = event.key === 'Escape';
        this._emitClick(!unselect, unselect);
      }
      return;
    }
    const diff = ARROW_KEY_DIFFS[event.key];
    if (diff && this.isDraggable && this._node?.selected) {
      // Without this the pane scrolls while the node moves.
      event.preventDefault();
      const factor = event.shiftKey ? SHIFT_FACTOR : 1;
      this._emit('nodemove', {
        id: this.nodeId,
        dx: diff.x * factor,
        dy: diff.y * factor
      });
    }
  }

  // ----------------------------------------------------------------- effects

  /**
   * Attach the drag kernel to the root element, once.
   *
   * Re-attaching on a later render would leave the old listeners on the same element, so the
   * gesture would fire twice.
   */
  _attachDrag() {
    const element = this.refs?.node;
    if (_classPrivateFieldLooseBase$7(this, _drag)[_drag] || !element || !this.store) {
      return;
    }
    _classPrivateFieldLooseBase$7(this, _drag)[_drag] = createDrag({
      store: this.store,
      domNode: element,
      nodeId: this.nodeId,
      handleSelector: this._node?.dragHandle,
      onDragStart: (event, node, nodes) => {
        this._dragging = true;
        this._emit('nodedragstart', {
          id: this.nodeId,
          changes: [],
          node,
          nodes
        });
      },
      onDrag: (event, changes, node, nodes) => {
        this._emit('nodedrag', {
          id: this.nodeId,
          changes,
          node,
          nodes
        });
      },
      onDragStop: (event, changes, node, nodes) => {
        this._dragging = false;
        this._emit('nodedragstop', {
          id: this.nodeId,
          changes,
          node,
          nodes
        });
      }
    });
  }

  /**
   * Measure the node and its handles, and report the result upward.
   *
   * The signature guard is what keeps this from looping: applying a measurement re-renders this
   * component, and an unguarded dispatch would measure and report again forever. It covers the
   * same inputs `useNodeObserver` watches, so a changed type or handle position re-measures even
   * though the box did not move.
   */
  _measure() {
    const element = this.refs?.node;
    const node = this._node;
    if (!element || !node) {
      return;
    }
    const dimensions = getDimensions(element);
    const signature = `${dimensions.width}x${dimensions.height}|${this.nodeType}|${node.sourcePosition}|${node.targetPosition}`;
    if (signature === _classPrivateFieldLooseBase$7(this, _measuredSignature)[_measuredSignature]) {
      return;
    }
    _classPrivateFieldLooseBase$7(this, _measuredSignature)[_measuredSignature] = signature;
    const zoom = this.store?.state.transform?.[2] ?? 1;
    const bounds = element.getBoundingClientRect();
    this._emit('nodemeasured', {
      id: this.nodeId,
      dimensions,
      handleBounds: {
        source: getHandleBounds('source', element, bounds, zoom, this.nodeId),
        target: getHandleBounds('target', element, bounds, zoom, this.nodeId)
      }
    });
  }
  _emitClick(select, unselect) {
    this._emit('nodeclick', {
      id: this.nodeId,
      select,
      unselect
    });
  }
  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, {
      detail
    }));
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowNodeWrapper, {
  publicProps: {
    store: {
      config: 0
    },
    nodeId: {
      config: 0
    },
    flowId: {
      config: 0
    }
  },
  fields: ["_node", "_isParent", "_flags", "_dragging"]
});
const __lwc_component_class_internal$b = registerComponent(FlowNodeWrapper, {
  tmpl: _tmpl$b,
  sel: "c-flow-node-wrapper",
  apiVersion: 66
});

const stc0$6 = {
  classMap: {
    "flow__nodes": true
  },
  key: 0
};
function tmpl$a($api, $cmp, $slotset, $ctx) {
  const {k: api_key, b: api_bind, c: api_custom_element, i: api_iterator, h: api_element} = $api;
  const {_m0} = $ctx;
  return [api_element("div", stc0$6, api_iterator($cmp.nodeIds, function (id) {
    return api_custom_element("c-flow-node-wrapper", __lwc_component_class_internal$b, {
      props: {
        "store": $cmp.store,
        "nodeId": id,
        "flowId": $cmp.flowId
      },
      key: api_key(1, id),
      on: _m0 || ($ctx._m0 = {
        "nodeclick": api_bind($cmp.handleNodeEvent),
        "nodedoubleclick": api_bind($cmp.handleNodeEvent),
        "nodecontextmenu": api_bind($cmp.handleNodeEvent),
        "nodemouseenter": api_bind($cmp.handleNodeEvent),
        "nodemouseleave": api_bind($cmp.handleNodeEvent),
        "nodemeasured": api_bind($cmp.handleNodeEvent),
        "nodedragstart": api_bind($cmp.handleNodeEvent),
        "nodedrag": api_bind($cmp.handleNodeEvent),
        "nodedragstop": api_bind($cmp.handleNodeEvent),
        "nodemove": api_bind($cmp.handleNodeEvent),
        "connectstart": api_bind($cmp.handleNodeEvent)
      })
    });
  }))];
  /*LWC compiler v9.4.3*/
}
var _tmpl$a = registerTemplate(tmpl$a);
tmpl$a.stylesheets = [];
tmpl$a.stylesheetToken = "lwc-1k1nljskumv";
tmpl$a.legacyStylesheetToken = "lwc-flowNodeRenderer_flowNodeRenderer";
if (_implicitStylesheets$9) {
  tmpl$a.stylesheets.push.apply(tmpl$a.stylesheets, _implicitStylesheets$9);
}
freezeTemplate(tmpl$a);

function _classPrivateFieldLooseBase$6(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$6 = 0;
function _classPrivateFieldLooseKey$6(e) { return "__private_" + id$6++ + "_" + e; }

/**
 * Ids of the nodes that should be in the DOM.
 *
 * With culling off this is every non-hidden node. With culling on it is `getNodesInside`, which
 * deliberately keeps an unmeasured node visible: a node has to be rendered once before it can be
 * measured, so culling it on geometry it does not have yet would keep it out of the DOM forever.
 * @param {Object} state
 * @returns {Array<string>}
 */
function selectVisibleNodeIds(state) {
  if (state.onlyRenderVisibleElements) {
    return getNodesInside(state.nodeLookup, {
      x: 0,
      y: 0,
      width: state.width,
      height: state.height
    }, state.transform, true).map(node => node.id);
  }
  const ids = [];
  for (const [id, node] of state.nodeLookup) {
    if (!node.hidden) {
      ids.push(id);
    }
  }
  return ids;
}
var _unsubscribe$2 = /*#__PURE__*/_classPrivateFieldLooseKey$6("unsubscribe");
class FlowNodeRenderer extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    /** Id of the owning flow, handed to every wrapper. */
    this.flowId = void 0;
    /*
     * Ordinary field, not a `#` one: the LWC babel plugin only registers `ClassProperty` nodes as
     * reactive, so a `#field` the template reads would never trigger a re-render.
     */
    this._nodeIds = [];
    Object.defineProperty(this, _unsubscribe$2, {
      writable: true,
      value: void 0
    });
  }
  connectedCallback() {
    _classPrivateFieldLooseBase$6(this, _unsubscribe$2)[_unsubscribe$2] = this.store?.subscribe(selectVisibleNodeIds, ids => {
      this._nodeIds = ids;
    }, {
      compare: shallowArrayEqual
    });
  }
  disconnectedCallback() {
    _classPrivateFieldLooseBase$6(this, _unsubscribe$2)[_unsubscribe$2]?.();
    _classPrivateFieldLooseBase$6(this, _unsubscribe$2)[_unsubscribe$2] = undefined;
  }
  get nodeIds() {
    return this._nodeIds;
  }

  /**
   * Pass a wrapper's event on unchanged.
   *
   * One handler for every event name: nothing here inspects or rewrites a node event, and a
   * per-event method would be eleven copies of the same line.
   * @param {CustomEvent} event
   */
  handleNodeEvent(event) {
    this.dispatchEvent(new CustomEvent(event.type, {
      detail: event.detail
    }));
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowNodeRenderer, {
  publicProps: {
    store: {
      config: 0
    },
    flowId: {
      config: 0
    }
  },
  fields: ["_nodeIds"]
});
const __lwc_component_class_internal$a = registerComponent(FlowNodeRenderer, {
  tmpl: _tmpl$a,
  sel: "c-flow-node-renderer",
  apiVersion: 66
});

function stylesheet$7(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "position: absolute;top: 0;left: 0;width: 100%;height: 100%;pointer-events: none;}.flow__controls" + shadowSelector + " {display: flex;flex-direction: column;box-shadow: var(--flow-controls-box-shadow, 0 0 2px 1px rgba(0, 0, 0, 0.08));}.flow__controls.horizontal" + shadowSelector + " {flex-direction: row;}.flow__controls-button" + shadowSelector + " {display: flex;justify-content: center;align-items: center;height: 26px;width: 26px;padding: 4px;border: none;border-bottom: 1px solid var(--flow-controls-button-border-color, var(--slds-g-color-border-1, #eee));background: var(--flow-controls-button-background-color, var(--slds-g-color-surface-1, #fefefe));color: var(--flow-controls-button-color, inherit);cursor: pointer;user-select: none;}.flow__controls-button:hover" + shadowSelector + " {background: var(--flow-controls-button-background-color-hover, var(--slds-g-color-surface-2, #f4f4f4));color: var(--flow-controls-button-color-hover, inherit);}.flow__controls-button:disabled" + shadowSelector + " {pointer-events: none;}.flow__controls-button:disabled" + shadowSelector + " svg" + shadowSelector + " {fill-opacity: 0.4;}.flow__controls-button:last-child" + shadowSelector + " {border-bottom: none;}.flow__controls.horizontal" + shadowSelector + " .flow__controls-button" + shadowSelector + " {border-bottom: none;border-right: 1px solid var(--flow-controls-button-border-color, var(--slds-g-color-border-1, #eee));}.flow__controls.horizontal" + shadowSelector + " .flow__controls-button:last-child" + shadowSelector + " {border-right: none;}.flow__controls-button" + shadowSelector + " svg" + shadowSelector + " {width: 100%;max-width: 12px;max-height: 12px;fill: currentColor;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$7 = [stylesheet$7];

const $fragment1$7 = parseFragment`<button class="flow__controls-button flow__controls-zoomin${0}" type="button"${"a0:title"}${"a0:aria-label"}${"a0:disabled"}${2}><svg viewBox="0 0 32 32" aria-hidden="true"${3}><path d="M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z"${3}/></svg></button>`;
const $fragment2$3 = parseFragment`<button class="flow__controls-button flow__controls-zoomout${0}" type="button"${"a0:title"}${"a0:aria-label"}${"a0:disabled"}${2}><svg viewBox="0 0 32 5" aria-hidden="true"${3}><path d="M0 0h32v4.2H0z"${3}/></svg></button>`;
const $fragment3$3 = parseFragment`<button class="flow__controls-button flow__controls-fitview${0}" type="button"${"a0:title"}${"a0:aria-label"}${2}><svg viewBox="0 0 32 30" aria-hidden="true"${3}><path d="M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z"${3}/></svg></button>`;
const $fragment4$2 = parseFragment`<svg viewBox="0 0 25 32" aria-hidden="true"${3}><path d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z"${3}/></svg>`;
const $fragment5$2 = parseFragment`<svg viewBox="0 0 25 32" aria-hidden="true"${3}><path d="M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z"${3}/></svg>`;
const stc0$5 = {
  "flow__controls-button": true,
  "flow__controls-interactive": true
};
const stc1$3 = {
  key: 17
};
const stc2$3 = [];
function tmpl$9($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, b: api_bind, sp: api_static_part, st: api_static_fragment, fr: api_fragment, h: api_element, s: api_slot, c: api_custom_element} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6} = $ctx;
  return [api_custom_element("c-flow-panel", __lwc_component_class_internal$e, {
    props: {
      "position": $cmp.position
    },
    key: 0
  }, [api_element("div", {
    className: api_normalize_class_name($cmp.controlsClass),
    attrs: {
      "role": "group",
      "aria-label": $cmp.panelAriaLabel
    },
    key: 1
  }, [$cmp.showZoom ? api_fragment(2, [api_static_fragment($fragment1$7, 4, [api_static_part(0, {
    on: _m1 || ($ctx._m1 = {
      "click": api_bind($cmp.handleZoomIn)
    }),
    attrs: {
      "title": $cmp.zoomInLabel,
      "aria-label": $cmp.zoomInLabel,
      "disabled": $cmp.maxZoomReached ? "" : null
    }
  }, null)]), api_static_fragment($fragment2$3, 6, [api_static_part(0, {
    on: _m3 || ($ctx._m3 = {
      "click": api_bind($cmp.handleZoomOut)
    }),
    attrs: {
      "title": $cmp.zoomOutLabel,
      "aria-label": $cmp.zoomOutLabel,
      "disabled": $cmp.minZoomReached ? "" : null
    }
  }, null)])], 0) : null, $cmp.showFitView ? api_fragment(7, [api_static_fragment($fragment3$3, 9, [api_static_part(0, {
    on: _m5 || ($ctx._m5 = {
      "click": api_bind($cmp.handleFitView)
    }),
    attrs: {
      "title": $cmp.fitViewLabel,
      "aria-label": $cmp.fitViewLabel
    }
  }, null)])], 0) : null, $cmp.showInteractive ? api_fragment(10, [api_element("button", {
    classMap: stc0$5,
    attrs: {
      "type": "button",
      "title": $cmp.interactiveLabel,
      "aria-label": $cmp.interactiveLabel,
      "aria-pressed": $cmp.lockPressed
    },
    key: 11,
    on: _m6 || ($ctx._m6 = {
      "click": api_bind($cmp.handleToggleInteractive)
    })
  }, [$cmp.interactive ? api_fragment(12, [api_static_fragment($fragment4$2, 14)], 0) : api_fragment(12, [api_static_fragment($fragment5$2, 16)], 0)])], 0) : null, api_slot("", stc1$3, stc2$3, $slotset)])])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$9 = registerTemplate(tmpl$9);
tmpl$9.slots = [""];
tmpl$9.stylesheets = [];
tmpl$9.stylesheetToken = "lwc-7nvgo9dupha";
tmpl$9.legacyStylesheetToken = "lwc-flowControls_flowControls";
if (_implicitStylesheets$7) {
  tmpl$9.stylesheets.push.apply(tmpl$9.stylesheets, _implicitStylesheets$7);
}
freezeTemplate(tmpl$9);

function _classPrivateFieldLooseBase$5(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$5 = 0;
function _classPrivateFieldLooseKey$5(e) { return "__private_" + id$5++ + "_" + e; }

/** Upstream's fixed zoom step: `zoomIn` scales by 1.2, `zoomOut` by its reciprocal. */
const ZOOM_STEP = 1.2;
const DEFAULT_POSITION = 'bottom-left';
const DEFAULT_ORIENTATION = 'vertical';

/** A default-on flag: only an explicit false, or the string an attribute carries, turns it off. */
function isOn(value) {
  return value !== false && value !== 'false';
}
var _unsubscribers$1 = /*#__PURE__*/_classPrivateFieldLooseKey$5("unsubscribers");
class FlowControls extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    /** Options handed to the root component in the `fitview` event. */
    this.fitViewOptions = void 0;
    /** Overrides the panel's own aria-label. */
    this.ariaLabel = void 0;
    /** Extra classes for the control group. */
    this.className = void 0;
    /** Reactive render state, refreshed from the store subscriptions. */
    this.interactive = true;
    this.minZoomReached = false;
    this.maxZoomReached = false;
    this.labels = mergeAriaLabelConfig();
    this._showZoom = true;
    this._showFitView = true;
    this._showInteractive = true;
    this._position = DEFAULT_POSITION;
    this._orientation = DEFAULT_ORIENTATION;
    /** Subscription handles; the template never reads them. */
    Object.defineProperty(this, _unsubscribers$1, {
      writable: true,
      value: []
    });
  }
  /*
   * The three `show*` flags default to true, and a public boolean FIELD may only default to
   * false (LWC1099: attribute presence alone would then mean true). Accessors sidestep that and
   * let an attribute-form `show-zoom="false"` turn a button off as well.
   */

  /** Show the zoom in and zoom out buttons. */
  get showZoom() {
    return this._showZoom;
  }
  set showZoom(value) {
    this._showZoom = isOn(value);
  }

  /** Show the fit view button. */
  get showFitView() {
    return this._showFitView;
  }
  set showFitView(value) {
    this._showFitView = isOn(value);
  }

  /** Show the interactivity lock button. */
  get showInteractive() {
    return this._showInteractive;
  }
  set showInteractive(value) {
    this._showInteractive = isOn(value);
  }
  /** Panel corner, one of the six `PanelPosition` values. */
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value || DEFAULT_POSITION;
  }

  /** `vertical` (default) stacks the buttons, `horizontal` lays them out in a row. */
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value === 'horizontal' ? 'horizontal' : DEFAULT_ORIENTATION;
  }
  connectedCallback() {
    if (!this.store) {
      return;
    }

    /*
     * Three subscriptions rather than one over the whole state: the zoom bounds change on
     * every wheel tick while the interaction flags and the labels almost never change, so
     * keeping them apart means zooming does not re-read either.
     */
    _classPrivateFieldLooseBase$5(this, _unsubscribers$1)[_unsubscribers$1].push(this.store.subscribe(s => [s.transform[2], s.minZoom, s.maxZoom], ([zoom, minZoom, maxZoom]) => {
      this.minZoomReached = zoom <= minZoom;
      this.maxZoomReached = zoom >= maxZoom;
    }, {
      compare: shallowArrayEqual
    }), this.store.subscribe(s => [s.nodesDraggable, s.nodesConnectable, s.elementsSelectable], flags => {
      // Upstream: interactive if ANY of the three is on.
      this.interactive = flags.some(Boolean);
    }, {
      compare: shallowArrayEqual
    }), this.store.subscribe(s => s.ariaLabelConfig, config => {
      this.labels = mergeAriaLabelConfig(config);
    }));
  }
  disconnectedCallback() {
    for (const unsubscribe of _classPrivateFieldLooseBase$5(this, _unsubscribers$1)[_unsubscribers$1]) {
      unsubscribe();
    }
    _classPrivateFieldLooseBase$5(this, _unsubscribers$1)[_unsubscribers$1] = [];
  }
  get controlsClass() {
    const classes = ['flow__controls', this._orientation];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(' ');
  }
  get panelAriaLabel() {
    return this.ariaLabel || this.labels['controls.ariaLabel'];
  }
  get zoomInLabel() {
    return this.labels['controls.zoomIn.ariaLabel'];
  }
  get zoomOutLabel() {
    return this.labels['controls.zoomOut.ariaLabel'];
  }
  get fitViewLabel() {
    return this.labels['controls.fitView.ariaLabel'];
  }
  get interactiveLabel() {
    return this.labels['controls.interactive.ariaLabel'];
  }

  /** The lock button is pressed while interactivity is off, which is when it shows the lock. */
  get lockPressed() {
    return this.interactive ? 'false' : 'true';
  }
  handleZoomIn() {
    this.store?.state.panZoom?.scaleBy(ZOOM_STEP);
    this.dispatchEvent(new CustomEvent('zoomin'));
  }
  handleZoomOut() {
    this.store?.state.panZoom?.scaleBy(1 / ZOOM_STEP);
    this.dispatchEvent(new CustomEvent('zoomout'));
  }
  handleFitView() {
    // The root owns fit view: only it knows the node set and the pane geometry.
    this.dispatchEvent(new CustomEvent('fitview', {
      detail: this.fitViewOptions
    }));
  }
  handleToggleInteractive() {
    const next = !this.interactive;
    this.store?.update({
      nodesDraggable: next,
      nodesConnectable: next,
      elementsSelectable: next
    });

    /*
     * Without a store there is nothing to read the new value back from, so the local flag is
     * advanced here too. With a store the subscription lands first and this is a no-op.
     */
    this.interactive = next;
    this.dispatchEvent(new CustomEvent('interactivechange', {
      detail: next
    }));
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowControls, {
  publicProps: {
    store: {
      config: 0
    },
    showZoom: {
      config: 3
    },
    showFitView: {
      config: 3
    },
    showInteractive: {
      config: 3
    },
    fitViewOptions: {
      config: 0
    },
    ariaLabel: {
      config: 0
    },
    className: {
      config: 0
    },
    position: {
      config: 3
    },
    orientation: {
      config: 3
    }
  },
  fields: ["interactive", "minZoomReached", "maxZoomReached", "labels", "_showZoom", "_showFitView", "_showInteractive", "_position", "_orientation"]
});
const __lwc_component_class_internal$9 = registerComponent(FlowControls, {
  tmpl: _tmpl$9,
  sel: "c-flow-controls",
  apiVersion: 66
});

function stylesheet$6(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  var hostSelector = token ? ("[" + token + "-host]") : "";
  return ((useActualHostSelector ? ":host {" : hostSelector + " {")) + "position: absolute;inset: 0;pointer-events: none;z-index: 5;}.flow__minimap" + shadowSelector + " {position: absolute;pointer-events: all;background: var(--flow-minimap-background, var(--slds-g-color-surface-container-1, #fff));margin: 15px;border-radius: 3px;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);}.flow__minimap--top-left" + shadowSelector + " {top: 0;left: 0;}.flow__minimap--top-right" + shadowSelector + " {top: 0;right: 0;}.flow__minimap--bottom-left" + shadowSelector + " {bottom: 0;left: 0;}.flow__minimap--bottom-right" + shadowSelector + " {bottom: 0;right: 0;}.flow__minimap-svg" + shadowSelector + " {display: block;}.flow__minimap-mask" + shadowSelector + " {fill: var(--flow-minimap-mask-fill, rgba(240, 240, 240, 0.6));stroke: var(--flow-minimap-mask-stroke, none);stroke-width: var(--flow-minimap-mask-stroke-width, 1);}.flow__minimap-node" + shadowSelector + " {fill: var(--flow-minimap-node-fill, var(--slds-g-color-border-1, #e2e2e2));stroke: var(--flow-minimap-node-stroke, transparent);stroke-width: var(--flow-minimap-node-stroke-width, 2);shape-rendering: crispEdges;}.flow__minimap-node.selected" + shadowSelector + " {fill: var(--flow-minimap-node-fill-selected, var(--slds-g-color-accent-container-3, #555));}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$6 = [stylesheet$6];

const $fragment1$6 = parseSVGFragment`<title${"a0:id"}${3}>${"t1"}</title>`;
const $fragment2$2 = parseSVGFragment`<rect${"c0"}${"a0:data-id"}${"a0:x"}${"a0:y"}${"a0:rx"}${"a0:ry"}${"a0:width"}${"a0:height"}${2}/>`;
const $fragment3$2 = parseSVGFragment`<path class="flow__minimap-mask${0}"${"a0:d"} fill-rule="evenodd" pointer-events="none"${2}/>`;
const stc0$4 = {
  "flow__minimap-svg": true
};
function tmpl$8($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, gid: api_scoped_id, b: api_bind, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, k: api_key, i: api_iterator, f: api_flatten, h: api_element} = $api;
  const {_m0, _m1, _m2} = $ctx;
  return [api_element("div", {
    className: api_normalize_class_name($cmp.panelClass),
    key: 0
  }, [api_element("svg", {
    classMap: stc0$4,
    style: $cmp.svgStyle,
    attrs: {
      "width": $cmp.width,
      "height": $cmp.height,
      "viewBox": $cmp.viewBox,
      "role": "img",
      "aria-labelledby": api_scoped_id($cmp.labelId)
    },
    ref: "svg",
    key: 1,
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleClick),
      "pointerdown": api_bind($cmp.handlePointerDown),
      "pointermove": api_bind($cmp.handlePointerMove),
      "pointerup": api_bind($cmp.handlePointerUp),
      "pointercancel": api_bind($cmp.handlePointerUp),
      "wheel": api_bind($cmp.handleWheel)
    }),
    svg: true
  }, api_flatten([api_static_fragment($fragment1$6, 3, [api_static_part(0, {
    attrs: {
      "id": api_scoped_id($cmp.labelId)
    }
  }, null), api_static_part(1, null, api_dynamic_text($cmp.resolvedAriaLabel))]), api_iterator($cmp.nodeRects, function (node) {
    return api_static_fragment($fragment2$2, api_key(5, node.id), [api_static_part(0, {
      on: _m2 || ($ctx._m2 = {
        "click": api_bind($cmp.handleNodeClick)
      }),
      className: api_normalize_class_name(node.rectClass),
      attrs: {
        "data-id": node.id,
        "x": node.x,
        "y": node.y,
        "rx": node.rx,
        "ry": node.ry,
        "width": node.width,
        "height": node.height
      }
    }, null)]);
  }), api_static_fragment($fragment3$2, 7, [api_static_part(0, {
    attrs: {
      "d": $cmp.maskPath
    }
  }, null)])]))])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$8 = registerTemplate(tmpl$8);
tmpl$8.hasRefs = true;
tmpl$8.stylesheets = [];
tmpl$8.stylesheetToken = "lwc-10sjhsh30pc";
tmpl$8.legacyStylesheetToken = "lwc-flowMinimap_flowMinimap";
if (_implicitStylesheets$6) {
  tmpl$8.stylesheets.push.apply(tmpl$8.stylesheets, _implicitStylesheets$6);
}
freezeTemplate(tmpl$8);

function _classPrivateFieldLooseBase$4(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$4 = 0;
function _classPrivateFieldLooseKey$4(e) { return "__private_" + id$4++ + "_" + e; }

/** Upstream's default minimap size. */
const DEFAULT_WIDTH = 200;
const DEFAULT_HEIGHT = 150;

/**
 * Overview of the whole flow, with the current viewport drawn as a cut-out.
 *
 * Ports `@xyflow/react/src/additional-components/MiniMap/`. It owns its own
 * `<svg>` root, so unlike the edge layer it can be a component without hitting
 * the SVG namespace problem.
 *
 * The viewport is shown by a single `<path>` with `fill-rule: evenodd`: an outer
 * rectangle covering everything and an inner rectangle for the viewport. Under
 * evenodd the inner rectangle is subtracted, so the mask dims everything except
 * the visible region in one element instead of four.
 */
var _unsubscribe$1 = /*#__PURE__*/_classPrivateFieldLooseKey$4("unsubscribe");
var _viewScale = /*#__PURE__*/_classPrivateFieldLooseKey$4("viewScale");
var _pointerId$2 = /*#__PURE__*/_classPrivateFieldLooseKey$4("pointerId");
var _lastPointer = /*#__PURE__*/_classPrivateFieldLooseKey$4("lastPointer");
class FlowMinimap extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    this.width = DEFAULT_WIDTH;
    this.height = DEFAULT_HEIGHT;
    this.nodeColor = void 0;
    this.nodeStrokeColor = void 0;
    this.nodeClassName = '';
    this.nodeBorderRadius = 5;
    this.nodeStrokeWidth = void 0;
    this.maskColor = void 0;
    this.maskStrokeColor = void 0;
    this.maskStrokeWidth = void 0;
    this.position = 'bottom-right';
    this.pannable = false;
    this.zoomable = false;
    this.inversePan = false;
    this.zoomStep = 1;
    /** Padding around the fitted bounds, in minimap units scaled by `viewScale`. */
    this.offsetScale = 5;
    this.ariaLabel = void 0;
    // Template-observed state must be ordinary fields: a `#private` field is a
    // ClassPrivateProperty and the LWC babel plugin never registers it as reactive.
    this._viewBox = '0 0 200 150';
    this._maskPath = '';
    this._nodeRects = [];
    this._labelId = 'flow-minimap-desc';
    Object.defineProperty(this, _unsubscribe$1, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _viewScale, {
      writable: true,
      value: 1
    });
    Object.defineProperty(this, _pointerId$2, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _lastPointer, {
      writable: true,
      value: null
    });
  }
  connectedCallback() {
    if (!this.store) {
      return;
    }
    this._labelId = `flow-minimap-desc-${Math.random().toString(36).slice(2, 8)}`;

    /*
     * One subscription over the whole state. The minimap has to redraw when
     * the viewport moves OR when any node moves, and those are the two
     * highest-frequency changes in the store, so a narrower selector would
     * not save anything.
     */
    _classPrivateFieldLooseBase$4(this, _unsubscribe$1)[_unsubscribe$1] = this.store.subscribe(s => `${s.transform.join(',')}|${s.nodeVersion ?? 0}|${s.width}x${s.height}`, () => this._recompute());
  }
  disconnectedCallback() {
    _classPrivateFieldLooseBase$4(this, _unsubscribe$1)[_unsubscribe$1]?.();
    _classPrivateFieldLooseBase$4(this, _unsubscribe$1)[_unsubscribe$1] = null;
  }
  get viewBox() {
    return this._viewBox;
  }
  get maskPath() {
    return this._maskPath;
  }
  get nodeRects() {
    return this._nodeRects;
  }
  get labelId() {
    return this._labelId;
  }
  get resolvedAriaLabel() {
    const config = mergeAriaLabelConfig(this.store?.state.ariaLabelConfig);
    return this.ariaLabel ?? config['minimap.ariaLabel'];
  }
  get panelClass() {
    return `flow__minimap flow__minimap--${this.position}`;
  }
  get svgStyle() {
    const parts = [];
    if (this.maskColor) {
      parts.push(`--flow-minimap-mask-fill: ${this.maskColor};`);
    }
    if (this.maskStrokeColor) {
      parts.push(`--flow-minimap-mask-stroke: ${this.maskStrokeColor};`);
    }
    if (typeof this.maskStrokeWidth === 'number') {
      // Stroke width is in minimap units, so it must scale with the view.
      parts.push(`--flow-minimap-mask-stroke-width: ${this.maskStrokeWidth * _classPrivateFieldLooseBase$4(this, _viewScale)[_viewScale]};`);
    }
    if (this.nodeColor) {
      parts.push(`--flow-minimap-node-fill: ${this.nodeColor};`);
    }
    if (this.nodeStrokeColor) {
      parts.push(`--flow-minimap-node-stroke: ${this.nodeStrokeColor};`);
    }
    if (typeof this.nodeStrokeWidth === 'number') {
      parts.push(`--flow-minimap-node-stroke-width: ${this.nodeStrokeWidth};`);
    }
    return parts.join(' ');
  }

  /**
   * Recompute the viewBox, the mask and the node rects.
   *
   * The viewBox is fitted to the union of the node bounds and the current
   * viewport, so panning away from the graph keeps both the graph and the
   * viewport indicator visible rather than letting the indicator slide out.
   */
  _recompute() {
    const s = this.store.state;
    const [tx, ty, tk] = s.transform;
    const viewBB = {
      x: -tx / tk,
      y: -ty / tk,
      width: s.width / tk,
      height: s.height / tk
    };

    /*
     * `getInternalNodesBounds` returns a rect at the origin when nothing
     * passes the filter. Unioning that with the viewport would stretch the
     * bounds to include (0, 0), so an all-hidden graph falls back to the
     * viewport alone.
     */
    let hasVisibleNode = false;
    for (const node of s.nodeLookup.values()) {
      if (!node.hidden) {
        hasVisibleNode = true;
        break;
      }
    }
    const boundingRect = hasVisibleNode ? getBoundsOfRects(getInternalNodesBounds(s.nodeLookup, {
      filter: node => !node.hidden
    }), viewBB) : viewBB;
    const elementWidth = this.width ?? DEFAULT_WIDTH;
    const elementHeight = this.height ?? DEFAULT_HEIGHT;

    // Fit the longer axis, so the aspect ratio of the minimap is preserved.
    const viewScale = Math.max(boundingRect.width / elementWidth, boundingRect.height / elementHeight);
    const viewWidth = viewScale * elementWidth;
    const viewHeight = viewScale * elementHeight;
    const offset = this.offsetScale * viewScale;
    const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
    const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
    const width = viewWidth + offset * 2;
    const height = viewHeight + offset * 2;
    _classPrivateFieldLooseBase$4(this, _viewScale)[_viewScale] = viewScale;
    this._viewBox = `${x} ${y} ${width} ${height}`;

    // Outer rect then inner viewport rect; evenodd subtracts the inner one.
    this._maskPath = `M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z` + `M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`;
    const rects = [];
    for (const node of s.nodeLookup.values()) {
      if (node.hidden) {
        continue;
      }
      const {
        width: nodeWidth,
        height: nodeHeight
      } = getNodeDimensions(node);

      // A node with no size yet would render as an invisible zero rect.
      if (!nodeWidth || !nodeHeight) {
        continue;
      }
      rects.push({
        id: node.id,
        x: node.internals.positionAbsolute.x,
        y: node.internals.positionAbsolute.y,
        width: nodeWidth,
        height: nodeHeight,
        rx: this.nodeBorderRadius,
        ry: this.nodeBorderRadius,
        rectClass: node.selected ? `flow__minimap-node selected ${this.nodeClassName}`.trim() : `flow__minimap-node ${this.nodeClassName}`.trim()
      });
    }
    this._nodeRects = rects;
  }

  /** Minimap coordinates for a pointer event. */
  _pointerToFlow(event) {
    const svg = this.refs.svg;
    if (!svg) {
      return null;
    }
    const rect = svg.getBoundingClientRect();
    const [vx, vy, vw, vh] = this._viewBox.split(' ').map(Number);
    return {
      x: vx + (event.clientX - rect.left) / rect.width * vw,
      y: vy + (event.clientY - rect.top) / rect.height * vh
    };
  }
  handleClick(event) {
    const point = this._pointerToFlow(event);
    if (point) {
      this.dispatchEvent(new CustomEvent('minimapclick', {
        detail: point
      }));
    }
  }
  handleNodeClick(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('minimapnodeclick', {
      detail: {
        id: event.target.dataset.id
      }
    }));
  }
  handlePointerDown(event) {
    if (!this.pannable) {
      return;
    }
    _classPrivateFieldLooseBase$4(this, _pointerId$2)[_pointerId$2] = event.pointerId;
    _classPrivateFieldLooseBase$4(this, _lastPointer)[_lastPointer] = this._pointerToFlow(event);
    this.refs.svg?.setPointerCapture?.(event.pointerId);
  }

  /**
   * Drag the minimap to pan the main viewport.
   *
   * The delta is negated by default: dragging the mask right should move the
   * viewport right, which means panning the content left. `inversePan` swaps
   * that for consumers who expect to drag the content instead.
   */
  handlePointerMove(event) {
    if (_classPrivateFieldLooseBase$4(this, _pointerId$2)[_pointerId$2] !== event.pointerId || !_classPrivateFieldLooseBase$4(this, _lastPointer)[_lastPointer]) {
      return;
    }
    const point = this._pointerToFlow(event);
    if (!point) {
      return;
    }
    const s = this.store.state;
    const sign = this.inversePan ? 1 : -1;
    const dx = (point.x - _classPrivateFieldLooseBase$4(this, _lastPointer)[_lastPointer].x) * s.transform[2] * sign;
    const dy = (point.y - _classPrivateFieldLooseBase$4(this, _lastPointer)[_lastPointer].y) * s.transform[2] * sign;
    _classPrivateFieldLooseBase$4(this, _lastPointer)[_lastPointer] = point;
    s.panZoom?.panBy({
      x: dx,
      y: dy
    });
  }
  handlePointerUp(event) {
    if (_classPrivateFieldLooseBase$4(this, _pointerId$2)[_pointerId$2] !== event.pointerId) {
      return;
    }
    this.refs.svg?.releasePointerCapture?.(event.pointerId);
    _classPrivateFieldLooseBase$4(this, _pointerId$2)[_pointerId$2] = null;
    _classPrivateFieldLooseBase$4(this, _lastPointer)[_lastPointer] = null;
  }
  handleWheel(event) {
    if (!this.zoomable) {
      return;
    }
    event.preventDefault();
    const s = this.store.state;
    // deltaY is inverted so scrolling up zooms in, matching the main pane.
    const factor = Math.pow(2, -event.deltaY * 0.002 * this.zoomStep);
    s.panZoom?.scaleBy(factor);
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(FlowMinimap, {
  publicProps: {
    store: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    nodeColor: {
      config: 0
    },
    nodeStrokeColor: {
      config: 0
    },
    nodeClassName: {
      config: 0
    },
    nodeBorderRadius: {
      config: 0
    },
    nodeStrokeWidth: {
      config: 0
    },
    maskColor: {
      config: 0
    },
    maskStrokeColor: {
      config: 0
    },
    maskStrokeWidth: {
      config: 0
    },
    position: {
      config: 0
    },
    pannable: {
      config: 0
    },
    zoomable: {
      config: 0
    },
    inversePan: {
      config: 0
    },
    zoomStep: {
      config: 0
    },
    offsetScale: {
      config: 0
    },
    ariaLabel: {
      config: 0
    }
  },
  fields: ["_viewBox", "_maskPath", "_nodeRects", "_labelId"]
});
const __lwc_component_class_internal$8 = registerComponent(FlowMinimap, {
  tmpl: _tmpl$8,
  sel: "c-flow-minimap",
  apiVersion: 66
});

const stc0$3 = {
  "flow__pane": true
};
const stc1$2 = {
  "flow__viewport": true
};
const stc2$2 = {
  key: 10
};
const stc3$2 = [];
function tmpl$7($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, c: api_custom_element, fr: api_fragment, h: api_element, s: api_slot} = $api;
  const {_m0, _m1, _m2, _m3, _m4} = $ctx;
  return [api_element("div", {
    classMap: stc0$3,
    attrs: {
      "data-flow-id": $cmp.flowId
    },
    ref: "pane",
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "pointerdown": api_bind($cmp.handlePanePointerDown),
      "pointermove": api_bind($cmp.handlePanePointerMove),
      "pointerup": api_bind($cmp.handlePanePointerUp),
      "pointercancel": api_bind($cmp.handlePanePointerUp),
      "click": api_bind($cmp.handlePaneClick),
      "contextmenu": api_bind($cmp.handlePaneContextMenu)
    })
  }, [$cmp.hasBackground ? api_fragment(1, [api_custom_element("c-flow-background", __lwc_component_class_internal$d, {
    props: {
      "store": $cmp.store
    },
    key: 2
  })], 0) : null, api_custom_element("c-flow-edge-renderer", __lwc_component_class_internal$c, {
    props: {
      "store": $cmp.store,
      "flowId": $cmp.flowId,
      "defaultMarkerStart": $cmp.defaultMarkerStart,
      "defaultMarkerEnd": $cmp.defaultMarkerEnd,
      "connectionLineType": $cmp.connectionLineType
    },
    key: 3,
    on: _m1 || ($ctx._m1 = {
      "edgeclick": api_bind($cmp.handleEdgeClick),
      "edgedoubleclick": api_bind($cmp.handleForward),
      "edgecontextmenu": api_bind($cmp.handleForward),
      "edgemouseenter": api_bind($cmp.handleForward),
      "edgemouseleave": api_bind($cmp.handleForward)
    })
  }), api_element("div", {
    classMap: stc1$2,
    style: $cmp.viewportStyle,
    ref: "viewport",
    key: 4
  }, [api_custom_element("c-flow-node-renderer", __lwc_component_class_internal$a, {
    props: {
      "store": $cmp.store,
      "flowId": $cmp.flowId
    },
    key: 5,
    on: _m2 || ($ctx._m2 = {
      "nodemeasured": api_bind($cmp.handleNodeMeasured),
      "nodeschange": api_bind($cmp.handleNodesChange),
      "connect": api_bind($cmp.handleConnect),
      "connectstart": api_bind($cmp.handleConnectStart),
      "nodeclick": api_bind($cmp.handleNodeClick),
      "nodedoubleclick": api_bind($cmp.handleForward),
      "nodecontextmenu": api_bind($cmp.handleForward),
      "nodemouseenter": api_bind($cmp.handleForward),
      "nodemouseleave": api_bind($cmp.handleForward),
      "nodedragstart": api_bind($cmp.handleForward),
      "nodedrag": api_bind($cmp.handleNodeDrag),
      "nodedragstop": api_bind($cmp.handleNodeDrag),
      "nodemove": api_bind($cmp.handleNodeMove)
    })
  })]), $cmp.hasControls ? api_fragment(6, [api_custom_element("c-flow-controls", __lwc_component_class_internal$9, {
    props: {
      "store": $cmp.store
    },
    key: 7,
    on: _m3 || ($ctx._m3 = {
      "fitview": api_bind($cmp.handleFitView),
      "zoomin": api_bind($cmp.handleForward),
      "zoomout": api_bind($cmp.handleForward),
      "interactivechange": api_bind($cmp.handleForward)
    })
  })], 0) : null, $cmp.hasMinimap ? api_fragment(8, [api_custom_element("c-flow-minimap", __lwc_component_class_internal$8, {
    props: {
      "store": $cmp.store
    },
    key: 9,
    on: _m4 || ($ctx._m4 = {
      "minimapclick": api_bind($cmp.handleForward),
      "minimapnodeclick": api_bind($cmp.handleForward)
    })
  })], 0) : null, api_slot("", stc2$2, stc3$2, $slotset)])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$7 = registerTemplate(tmpl$7);
tmpl$7.slots = [""];
tmpl$7.hasRefs = true;
tmpl$7.stylesheets = [];
tmpl$7.stylesheetToken = "lwc-3agfqve9dmn";
tmpl$7.legacyStylesheetToken = "lwc-flow_flow";
if (_implicitStylesheets$c) {
  tmpl$7.stylesheets.push.apply(tmpl$7.stylesheets, _implicitStylesheets$c);
}
freezeTemplate(tmpl$7);

/**
 * The viewport transform kernel for lwc-flow.
 *
 * Service component: no template, no LWC imports, no DOM access.
 *
 * xyflow delegates its viewport to `d3-zoom`, `d3-interpolate` and `d3-ease`.
 * Salesforce CSP blocks CDN scripts and this project ships no runtime
 * dependencies, so the algorithms d3 provides are reimplemented here. They are
 * ported from the d3 sources rather than approximated, because the feel of
 * panning and zooming is entirely in these formulas:
 *
 * | Source | Ported here |
 * | --- | --- |
 * | `d3-zoom/src/transform.js` | {@link Transform} |
 * | `d3-zoom/src/zoom.js` `defaultConstrain` | {@link constrain} |
 * | `d3-zoom/src/zoom.js` `scale`, `translate`, `centroid` | {@link scaleTransform}, {@link translateTransform}, {@link centroid} |
 * | `d3-zoom/src/zoom.js` `schedule` tween | {@link interpolateTransform} |
 * | `d3-interpolate/src/zoom.js` | {@link interpolateZoom} |
 * | `d3-ease` `cubicInOut` | {@link cubicInOut} |
 *
 * `@xyflow/system/src/xypanzoom/utils.ts` overrides d3's wheel delta; that
 * override is {@link wheelDelta} here.
 */

/** Below this squared distance two zoom endpoints count as the same point. */
const EPSILON2 = 1e-12;

/** Van Wijk and Nuij's curvature constant, as d3 configures it. */
const RHO = Math.SQRT2;
const RHO2 = 2;
const RHO4 = 4;

/** Wheel events stop being treated as one continuous gesture after this idle gap, in ms. */
const WHEEL_IDLE_MS = 150;

/** Double-click zoom factor. Shift inverts it. */
const DBLCLICK_SCALE_FACTOR = 2;

/** d3-zoom's default double-click transition duration, in ms. */
const DBLCLICK_DURATION = 250;

/**
 * An affine viewport transform: uniform scale `k` then translation `x`, `y`.
 *
 * Immutable. Every operation returns a new instance, except that the identity
 * operations return `this` so a no-op transform write can be detected by
 * reference, which is how d3 avoids spurious renders.
 */
class Transform {
  /**
   * @param {number} k scale
   * @param {number} x translation along x, in pane pixels
   * @param {number} y translation along y, in pane pixels
   */
  constructor(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
  }

  /**
   * Multiply the scale, leaving the translation alone.
   * @param {number} k
   * @returns {Transform}
   */
  scale(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  }

  /**
   * Translate by `x`, `y` expressed in *flow* units, so the shift is scaled.
   * @param {number} x
   * @param {number} y
   * @returns {Transform}
   */
  translate(x, y) {
    return x === 0 && y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  }

  /**
   * Flow point to pane point.
   * @param {[number, number]} point
   * @returns {[number, number]}
   */
  apply(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  }

  /** @param {number} x @returns {number} */
  applyX(x) {
    return x * this.k + this.x;
  }

  /** @param {number} y @returns {number} */
  applyY(y) {
    return y * this.k + this.y;
  }

  /**
   * Pane point to flow point.
   * @param {[number, number]} location
   * @returns {[number, number]}
   */
  invert(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  }

  /** @param {number} x @returns {number} */
  invertX(x) {
    return (x - this.x) / this.k;
  }

  /** @param {number} y @returns {number} */
  invertY(y) {
    return (y - this.y) / this.k;
  }

  /**
   * CSS transform string. Translate precedes scale, which is what makes `x`
   * and `y` pane pixels rather than scaled units.
   * @returns {string}
   */
  toString() {
    return `translate(${this.x},${this.y}) scale(${this.k})`;
  }
}

/**
 * `{x, y, zoom}` to a {@link Transform}.
 * @param {import('c/flowTypes').Viewport} viewport
 * @returns {Transform}
 */
function viewportToTransform({
  x,
  y,
  zoom
}) {
  return new Transform(zoom, x, y);
}

/**
 * {@link Transform} to `{x, y, zoom}`.
 * @param {Transform} transform
 * @returns {import('c/flowTypes').Viewport}
 */
function transformToViewport(transform) {
  return {
    x: transform.x,
    y: transform.y,
    zoom: transform.k
  };
}

/**
 * Centre of an extent.
 * @param {import('c/flowTypes').CoordinateExtent} extent
 * @returns {[number, number]}
 */
function centroid(extent) {
  return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
}

/**
 * Replace the scale, clamped to `scaleExtent`, keeping the translation.
 *
 * Returns the input unchanged when the scale is already correct, so callers can
 * detect a no-op by reference.
 * @param {Transform} transform
 * @param {number} k
 * @param {[number, number]} scaleExtent
 * @returns {Transform}
 */
function scaleTransform(transform, k, scaleExtent) {
  const clamped = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
  return clamped === transform.k ? transform : new Transform(clamped, transform.x, transform.y);
}

/**
 * Move `transform` so flow point `p1` lands on pane point `p0`.
 *
 * This is the anchor operation behind every zoom: pick the point under the
 * cursor, change the scale, then translate so that point has not moved.
 * @param {Transform} transform
 * @param {[number, number]} p0 pane point
 * @param {[number, number]} p1 flow point
 * @returns {Transform}
 */
function translateTransform(transform, p0, p1) {
  const x = p0[0] - p1[0] * transform.k;
  const y = p0[1] - p1[1] * transform.k;
  return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
}

/**
 * Pull a transform back so the pane stays inside `translateExtent`.
 *
 * For each axis: when the content is smaller than the pane the two slacks
 * disagree in sign and the content is centred; otherwise only the violated edge
 * is corrected. The `||` chain is deliberate and matches d3 exactly, including
 * the fact that a `-0` from `Math.min` is falsy and therefore falls through to
 * the opposite edge.
 * @param {Transform} transform
 * @param {import('c/flowTypes').CoordinateExtent} extent pane rect in pane pixels
 * @param {import('c/flowTypes').CoordinateExtent} translateExtent allowed flow-space rect
 * @returns {Transform}
 */
function constrain(transform, extent, translateExtent) {
  const dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0];
  const dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0];
  const dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1];
  const dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
  return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}

/**
 * Wheel delta in zoom powers of two.
 *
 * `deltaMode` 1 is lines and 2 is pages, which report far larger numbers than
 * pixels and so need much smaller factors. xyflow diverges from d3 here: d3
 * applies the 10x Ctrl factor on every platform, xyflow only on macOS, where
 * Ctrl+wheel is the trackpad pinch gesture.
 * @param {WheelEvent} event
 * @param {boolean} [isMac=false]
 * @returns {number}
 */
function wheelDelta(event, isMac = false) {
  const factor = event.ctrlKey && isMac ? 10 : 1;
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * factor;
}
function cosh(x) {
  const e = Math.exp(x);
  return (e + 1 / e) / 2;
}
function sinh(x) {
  const e = Math.exp(x);
  return (e - 1 / e) / 2;
}
function tanh(x) {
  const e = Math.exp(2 * x);
  return (e - 1) / (e + 1);
}

/**
 * Van Wijk and Nuij smooth zoom interpolation between two `[x, y, width]`
 * views.
 *
 * Interpolating scale linearly looks wrong: the view appears to accelerate as
 * it zooms in. This traces a hyperbolic path through zoom space instead, so the
 * apparent velocity stays constant. The returned function carries a `duration`
 * in ms that is the perceptually even time for the move.
 * @param {[number, number, number]} p0 `[x, y, width]`
 * @param {[number, number, number]} p1
 * @returns {((t: number) => [number, number, number]) & {duration: number}}
 */
function interpolateZoom(p0, p1) {
  const [ux0, uy0, w0] = p0;
  const [ux1, uy1, w1] = p1;
  const dx = ux1 - ux0;
  const dy = uy1 - uy0;
  const d2 = dx * dx + dy * dy;
  let i;
  let S;
  if (d2 < EPSILON2) {
    // Pure zoom, no pan: interpolate the width geometrically.
    S = Math.log(w1 / w0) / RHO;
    i = t => [ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(RHO * t * S)];
  } else {
    const d1 = Math.sqrt(d2);
    const b0 = (w1 * w1 - w0 * w0 + RHO4 * d2) / (2 * w0 * RHO2 * d1);
    const b1 = (w1 * w1 - w0 * w0 - RHO4 * d2) / (2 * w1 * RHO2 * d1);
    const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
    const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
    S = (r1 - r0) / RHO;
    i = t => {
      const s = t * S;
      const coshr0 = cosh(r0);
      const u = w0 / (RHO2 * d1) * (coshr0 * tanh(RHO * s + r0) - sinh(r0));
      return [ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / cosh(RHO * s + r0)];
    };
  }
  i.duration = S * 1000 * RHO / Math.SQRT2;
  return i;
}

/**
 * Component-wise linear interpolation between two `[x, y, width]` views.
 *
 * The `'linear'` alternative to {@link interpolateZoom}, matching what xyflow
 * selects when `interpolate: 'linear'` is requested.
 * @param {[number, number, number]} p0
 * @param {[number, number, number]} p1
 * @returns {((t: number) => [number, number, number]) & {duration: number}}
 */
function interpolateLinear(p0, p1) {
  const i = t => [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t];
  i.duration = 0;
  return i;
}

/**
 * Build the transform tween d3 uses for an animated viewport move.
 *
 * The interpolation happens in `[x, y, width]` space around a fixed pane point,
 * not on the transform's own fields. That is what keeps the anchor point
 * stationary for the whole animation. `t === 1` returns the target transform
 * verbatim to avoid an accumulated rounding error at the end.
 * @param {Transform} from
 * @param {Transform} to
 * @param {import('c/flowTypes').CoordinateExtent} extent pane rect
 * @param {[number, number]} [point] pane point to hold fixed; defaults to the pane centre
 * @param {(p0: *, p1: *) => *} [interpolator=interpolateZoom]
 * @returns {((t: number) => Transform) & {duration: number}}
 */
function interpolateTransform(from, to, extent, point, interpolator = interpolateZoom) {
  const p = point == null ? centroid(extent) : point;
  const w = Math.max(extent[1][0] - extent[0][0], extent[1][1] - extent[0][1]);
  const i = interpolator(from.invert(p).concat(w / from.k), to.invert(p).concat(w / to.k));
  const tween = t => {
    if (t === 1) {
      return to;
    }
    const l = i(t);
    const k = w / l[2];
    return new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
  };
  tween.duration = i.duration;
  return tween;
}

/**
 * d3-ease `cubicInOut`. The easing xyflow applies to viewport transitions.
 * @param {number} t in `[0, 1]`
 * @returns {number}
 */
function cubicInOut(t) {
  let u = t * 2;
  if (u <= 1) {
    return u * u * u / 2;
  }
  u -= 2;
  return (u * u * u + 2) / 2;
}

/**
 * True on macOS, where Ctrl+wheel is the trackpad pinch gesture.
 *
 * Guarded because `navigator` is absent in the Jest environment and in any
 * non-browser evaluation of this module.
 * @returns {boolean}
 */
function isMacOs() {
  return typeof navigator !== 'undefined' && (navigator?.userAgent?.indexOf('Mac') ?? -1) >= 0;
}

function _classPrivateFieldLooseBase$3(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$3 = 0;
function _classPrivateFieldLooseKey$3(e) { return "__private_" + id$3++ + "_" + e; }

/**
 * True when `event`'s target is inside an element carrying `className`.
 *
 * `closest` stops at a shadow root, so `composedPath` is walked instead. Without
 * that, a `nopan` marker on consumer markup inside a custom node would never be
 * seen from the pane's own root.
 * @param {Event} event
 * @param {string} [className]
 * @returns {boolean}
 */
function isWrappedWithClass(event, className) {
  if (!className) {
    return false;
  }
  const path = event.composedPath?.() ?? [];
  for (const node of path) {
    if (node?.classList?.contains?.(className)) {
      return true;
    }
    // Stop at the document: anything above is not part of the flow.
    if (node === document) {
      break;
    }
  }

  // Fall back to `closest` for synthetic events with no composed path.
  return !!event.target?.closest?.(`.${className}`);
}

/**
 * Whether a right-button drag is an allowed pan.
 * @param {boolean|Array<number>} panOnDrag
 * @param {number} usedButton
 * @returns {boolean}
 */
function isRightClickPan(panOnDrag, usedButton) {
  return usedButton === 2 && Array.isArray(panOnDrag) && panOnDrag.includes(2);
}

/**
 * Build the predicate deciding whether an event may start a pan or zoom.
 *
 * Ported from `@xyflow/system/src/xypanzoom/filter.ts`. The order of the checks
 * is significant: each early return is a different reason to refuse, and moving
 * one changes which reason wins.
 * @param {Object} params
 * @returns {(event: Event) => boolean}
 */
function createFilter({
  panActivationKeyPressed,
  zoomActivationKeyPressed,
  zoomOnScroll,
  zoomOnPinch,
  panOnDrag,
  panOnScroll,
  zoomOnDoubleClick,
  userSelectionActive,
  noWheelClassName = interactionClass.noWheel,
  noPanClassName = interactionClass.noPan,
  connectionInProgress
}) {
  return event => {
    const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
    const pinchZoom = zoomOnPinch && event.ctrlKey;
    const isWheelEvent = event.type === 'wheel';

    /*
     * Middle-button drag starting on a node, edge or selection always pans.
     * Without this the element under the cursor would swallow the gesture,
     * and middle-drag is the one pan that users expect to work anywhere.
     */
    if (event.button === 1 && (event.type === 'pointerdown' || event.type === 'mousedown') && (isWrappedWithClass(event, 'flow__node') || isWrappedWithClass(event, 'flow__edge') || isWrappedWithClass(event, 'flow__selection') || isWrappedWithClass(event, 'flow__nodesselection'))) {
      return true;
    }
    if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
      return false;
    }

    // A marquee selection owns the pointer for its whole duration.
    if (userSelectionActive) {
      return false;
    }

    // Pinch-zooming mid-connection would fight the connection line.
    if (connectionInProgress && !isWheelEvent) {
      return false;
    }
    if (isWrappedWithClass(event, noWheelClassName) && isWheelEvent) {
      return false;
    }
    if (isWrappedWithClass(event, noPanClassName) && (!isWheelEvent || panOnScroll && isWheelEvent && !zoomActivationKeyPressed)) {
      return false;
    }
    if (!zoomOnPinch && event.ctrlKey && isWheelEvent) {
      return false;
    }
    if (!zoomScroll && !panOnScroll && !pinchZoom && isWheelEvent) {
      return false;
    }
    if (!panOnDrag && (event.type === 'pointerdown' || event.type === 'mousedown')) {
      return false;
    }
    if (Array.isArray(panOnDrag) && !panOnDrag.includes(event.button) && (event.type === 'pointerdown' || event.type === 'mousedown')) {
      return false;
    }
    const buttonAllowed = Array.isArray(panOnDrag) && panOnDrag.includes(event.button) || !event.button || event.button <= 1;

    /*
     * d3 rejects Ctrl-modified drags because Ctrl+wheel is pinch. Allow the
     * drag when Ctrl is the configured pan activation key, keeping the wheel
     * safeguard intact.
     */
    return (!event.ctrlKey || isWheelEvent || panActivationKeyPressed) && buttonAllowed;
  };
}

/**
 * Pan/zoom controller bound to one pane element.
 */
var _domNode = /*#__PURE__*/_classPrivateFieldLooseKey$3("domNode");
var _transform = /*#__PURE__*/_classPrivateFieldLooseKey$3("transform");
var _minZoom = /*#__PURE__*/_classPrivateFieldLooseKey$3("minZoom");
var _maxZoom = /*#__PURE__*/_classPrivateFieldLooseKey$3("maxZoom");
var _translateExtent = /*#__PURE__*/_classPrivateFieldLooseKey$3("translateExtent");
var _extent = /*#__PURE__*/_classPrivateFieldLooseKey$3("extent");
var _onPanZoom = /*#__PURE__*/_classPrivateFieldLooseKey$3("onPanZoom");
var _onPanZoomStart = /*#__PURE__*/_classPrivateFieldLooseKey$3("onPanZoomStart");
var _onPanZoomEnd = /*#__PURE__*/_classPrivateFieldLooseKey$3("onPanZoomEnd");
var _onDraggingChange = /*#__PURE__*/_classPrivateFieldLooseKey$3("onDraggingChange");
var _onTransformChange = /*#__PURE__*/_classPrivateFieldLooseKey$3("onTransformChange");
var _options = /*#__PURE__*/_classPrivateFieldLooseKey$3("options");
var _filter = /*#__PURE__*/_classPrivateFieldLooseKey$3("filter");
var _active = /*#__PURE__*/_classPrivateFieldLooseKey$3("active");
var _pointerId$1 = /*#__PURE__*/_classPrivateFieldLooseKey$3("pointerId");
var _anchor = /*#__PURE__*/_classPrivateFieldLooseKey$3("anchor");
var _startClient = /*#__PURE__*/_classPrivateFieldLooseKey$3("startClient");
var _moved = /*#__PURE__*/_classPrivateFieldLooseKey$3("moved");
var _usedRightMouseButton = /*#__PURE__*/_classPrivateFieldLooseKey$3("usedRightMouseButton");
var _wheelIdleTimer = /*#__PURE__*/_classPrivateFieldLooseKey$3("wheelIdleTimer");
var _wheelAnchor = /*#__PURE__*/_classPrivateFieldLooseKey$3("wheelAnchor");
var _panScrollTimer = /*#__PURE__*/_classPrivateFieldLooseKey$3("panScrollTimer");
var _isPanScrolling = /*#__PURE__*/_classPrivateFieldLooseKey$3("isPanScrolling");
var _resizeObserver$1 = /*#__PURE__*/_classPrivateFieldLooseKey$3("resizeObserver");
var _animation = /*#__PURE__*/_classPrivateFieldLooseKey$3("animation");
var _destroyed = /*#__PURE__*/_classPrivateFieldLooseKey$3("destroyed");
var _listeners = /*#__PURE__*/_classPrivateFieldLooseKey$3("listeners");
class PanZoom {
  constructor({
    domNode,
    minZoom,
    maxZoom,
    translateExtent,
    viewport,
    onPanZoom,
    onPanZoomStart,
    onPanZoomEnd,
    onDraggingChange,
    onTransformChange
  }) {
    Object.defineProperty(this, _domNode, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _transform, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _minZoom, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _maxZoom, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _translateExtent, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _extent, {
      writable: true,
      value: [[0, 0], [0, 0]]
    });
    Object.defineProperty(this, _onPanZoom, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onPanZoomStart, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onPanZoomEnd, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onDraggingChange, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onTransformChange, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: {
        panOnDrag: true,
        panOnScroll: false,
        panOnScrollMode: PanOnScrollMode.Free,
        panOnScrollSpeed: 0.5,
        zoomOnScroll: true,
        zoomOnPinch: true,
        zoomOnDoubleClick: true,
        preventScrolling: true,
        userSelectionActive: false,
        connectionInProgress: false,
        panActivationKeyPressed: false,
        zoomActivationKeyPressed: false,
        noWheelClassName: interactionClass.noWheel,
        noPanClassName: interactionClass.noPan,
        paneClickDistance: 0,
        selectionOnDrag: false,
        onPaneContextMenu: false
      }
    });
    Object.defineProperty(this, _filter, {
      writable: true,
      value: () => false
    });
    // gesture bookkeeping
    Object.defineProperty(this, _active, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _pointerId$1, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _anchor, {
      writable: true,
      value: null
    });
    // [panePoint, flowPoint] held fixed during a drag
    Object.defineProperty(this, _startClient, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _moved, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _usedRightMouseButton, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _wheelIdleTimer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _wheelAnchor, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _panScrollTimer, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _isPanScrolling, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _resizeObserver$1, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _animation, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _destroyed, {
      writable: true,
      value: false
    });
    /** Bound listeners, retained so they can be removed. */
    Object.defineProperty(this, _listeners, {
      writable: true,
      value: {}
    });
    _classPrivateFieldLooseBase$3(this, _domNode)[_domNode] = domNode;
    _classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom] = minZoom;
    _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom] = maxZoom;
    _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent] = translateExtent;
    _classPrivateFieldLooseBase$3(this, _onPanZoom)[_onPanZoom] = onPanZoom;
    _classPrivateFieldLooseBase$3(this, _onPanZoomStart)[_onPanZoomStart] = onPanZoomStart;
    _classPrivateFieldLooseBase$3(this, _onPanZoomEnd)[_onPanZoomEnd] = onPanZoomEnd;
    _classPrivateFieldLooseBase$3(this, _onDraggingChange)[_onDraggingChange] = onDraggingChange;
    _classPrivateFieldLooseBase$3(this, _onTransformChange)[_onTransformChange] = onTransformChange;
    const bbox = domNode.getBoundingClientRect();
    _classPrivateFieldLooseBase$3(this, _extent)[_extent] = [[0, 0], [bbox.width, bbox.height]];

    /*
     * Cache the pane extent. Reading clientWidth/clientHeight per event would
     * force a synchronous layout on every pointer move, which is exactly what
     * upstream added this observer to avoid.
     */
    if (typeof ResizeObserver !== 'undefined') {
      _classPrivateFieldLooseBase$3(this, _resizeObserver$1)[_resizeObserver$1] = new ResizeObserver(entries => {
        const entry = entries[0];
        if (entry) {
          _classPrivateFieldLooseBase$3(this, _extent)[_extent] = [[0, 0], [entry.contentRect.width, entry.contentRect.height]];
        }
      });
      _classPrivateFieldLooseBase$3(this, _resizeObserver$1)[_resizeObserver$1].observe(domNode);
    }
    _classPrivateFieldLooseBase$3(this, _transform)[_transform] = constrain(viewportToTransform({
      x: viewport.x,
      y: viewport.y,
      zoom: clamp(viewport.zoom, minZoom, maxZoom)
    }), _classPrivateFieldLooseBase$3(this, _extent)[_extent], translateExtent);
    this._attach();
    this._emitTransform();
  }
  _attach() {
    const node = _classPrivateFieldLooseBase$3(this, _domNode)[_domNode];
    _classPrivateFieldLooseBase$3(this, _listeners)[_listeners] = {
      wheel: e => this._onWheel(e),
      pointerdown: e => this._onPointerDown(e),
      pointermove: e => this._onPointerMove(e),
      pointerup: e => this._onPointerUp(e),
      pointercancel: e => this._onPointerUp(e),
      dblclick: e => this._onDoubleClick(e),
      contextmenu: e => this._onContextMenu(e)
    };

    // `passive: false` because zooming must be able to preventDefault the scroll.
    node.addEventListener('wheel', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].wheel, {
      passive: false
    });
    node.addEventListener('pointerdown', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointerdown);
    node.addEventListener('pointermove', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointermove);
    node.addEventListener('pointerup', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointerup);
    node.addEventListener('pointercancel', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointercancel);
    node.addEventListener('dblclick', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].dblclick);
    node.addEventListener('contextmenu', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].contextmenu);
  }

  /** Pointer position relative to the pane. */
  _pointer(event) {
    const rect = _classPrivateFieldLooseBase$3(this, _domNode)[_domNode].getBoundingClientRect();
    return [event.clientX - rect.left, event.clientY - rect.top];
  }
  _emitTransform() {
    const viewport = transformToViewport(_classPrivateFieldLooseBase$3(this, _transform)[_transform]);
    _classPrivateFieldLooseBase$3(this, _onTransformChange)[_onTransformChange]?.([viewport.x, viewport.y, viewport.zoom]);
  }

  /** Commit a transform and notify, skipping identical writes. */
  _setTransformInternal(next, event) {
    if (next.k === _classPrivateFieldLooseBase$3(this, _transform)[_transform].k && next.x === _classPrivateFieldLooseBase$3(this, _transform)[_transform].x && next.y === _classPrivateFieldLooseBase$3(this, _transform)[_transform].y) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _transform)[_transform] = next;
    this._emitTransform();
    _classPrivateFieldLooseBase$3(this, _onPanZoom)[_onPanZoom]?.(event, transformToViewport(next));
  }
  _startGesture(event) {
    if (_classPrivateFieldLooseBase$3(this, _active)[_active]) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _active)[_active] = true;
    _classPrivateFieldLooseBase$3(this, _onPanZoomStart)[_onPanZoomStart]?.(event, transformToViewport(_classPrivateFieldLooseBase$3(this, _transform)[_transform]));
  }
  _endGesture(event) {
    if (!_classPrivateFieldLooseBase$3(this, _active)[_active]) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _active)[_active] = false;
    _classPrivateFieldLooseBase$3(this, _onPanZoomEnd)[_onPanZoomEnd]?.(event, transformToViewport(_classPrivateFieldLooseBase$3(this, _transform)[_transform]));
  }

  // ------------------------------------------------------------- wheel

  _onWheel(event) {
    if (_classPrivateFieldLooseBase$3(this, _destroyed)[_destroyed]) {
      return;
    }
    const o = _classPrivateFieldLooseBase$3(this, _options)[_options];
    const isPanOnScroll = o.panOnScroll && !o.zoomActivationKeyPressed && !o.userSelectionActive;
    if (!_classPrivateFieldLooseBase$3(this, _filter)[_filter](event)) {
      return;
    }
    if (isPanOnScroll) {
      this._handlePanOnScroll(event);
      return;
    }
    if (o.preventScrolling || event.ctrlKey) {
      event.preventDefault();
    }
    const delta = wheelDelta(event, isMacOs());
    const point = this._pointer(event);

    /*
     * Reuse the anchor for a continuing wheel gesture so a scroll flick zooms
     * toward one fixed point instead of drifting as the cursor's flow-space
     * position changes under it.
     */
    const continuingGesture = _classPrivateFieldLooseBase$3(this, _wheelIdleTimer)[_wheelIdleTimer] !== null;
    clearTimeout(_classPrivateFieldLooseBase$3(this, _wheelIdleTimer)[_wheelIdleTimer]);
    if (!continuingGesture) {
      _classPrivateFieldLooseBase$3(this, _wheelAnchor)[_wheelAnchor] = [point, _classPrivateFieldLooseBase$3(this, _transform)[_transform].invert(point)];
      this._startGesture(event);
    }
    const nextK = _classPrivateFieldLooseBase$3(this, _transform)[_transform].k * Math.pow(2, delta);
    const scaled = scaleTransform(_classPrivateFieldLooseBase$3(this, _transform)[_transform], nextK, [_classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom], _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom]]);
    const next = constrain(translateTransform(scaled, _classPrivateFieldLooseBase$3(this, _wheelAnchor)[_wheelAnchor][0], _classPrivateFieldLooseBase$3(this, _wheelAnchor)[_wheelAnchor][1]), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
    this._setTransformInternal(next, event);

    // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture idle timer; cleared in destroy() and on the next event
    _classPrivateFieldLooseBase$3(this, _wheelIdleTimer)[_wheelIdleTimer] = setTimeout(() => {
      _classPrivateFieldLooseBase$3(this, _wheelIdleTimer)[_wheelIdleTimer] = null;
      _classPrivateFieldLooseBase$3(this, _wheelAnchor)[_wheelAnchor] = null;
      this._endGesture(event);
    }, WHEEL_IDLE_MS);
  }

  /**
   * Wheel pans instead of zooming.
   *
   * Ctrl still pinch-zooms when enabled, because on a trackpad that is the
   * pinch gesture and users expect it regardless of `panOnScroll`.
   */
  _handlePanOnScroll(event) {
    const o = _classPrivateFieldLooseBase$3(this, _options)[_options];
    event.preventDefault();
    if (o.zoomOnPinch && event.ctrlKey) {
      const point = this._pointer(event);
      const delta = wheelDelta(event, isMacOs());
      const nextK = _classPrivateFieldLooseBase$3(this, _transform)[_transform].k * Math.pow(2, delta);
      const scaled = scaleTransform(_classPrivateFieldLooseBase$3(this, _transform)[_transform], nextK, [_classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom], _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom]]);
      const next = constrain(translateTransform(scaled, point, _classPrivateFieldLooseBase$3(this, _transform)[_transform].invert(point)), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
      if (!_classPrivateFieldLooseBase$3(this, _isPanScrolling)[_isPanScrolling]) {
        _classPrivateFieldLooseBase$3(this, _isPanScrolling)[_isPanScrolling] = true;
        this._startGesture(event);
      }
      this._setTransformInternal(next, event);
      this._schedulePanScrollEnd(event);
      return;
    }
    const speed = o.panOnScrollSpeed ?? 0.5;
    let dx = 0;
    let dy = 0;
    if (o.panOnScrollMode === PanOnScrollMode.Vertical) {
      dy = -(event.deltaY ?? 0) * speed;
    } else if (o.panOnScrollMode === PanOnScrollMode.Horizontal) {
      dx = -(event.deltaY ?? 0) * speed;
    } else {
      dx = -(event.deltaX ?? 0) * speed;
      dy = -(event.deltaY ?? 0) * speed;
    }
    if (dx === 0 && dy === 0) {
      return;
    }
    if (!_classPrivateFieldLooseBase$3(this, _isPanScrolling)[_isPanScrolling]) {
      _classPrivateFieldLooseBase$3(this, _isPanScrolling)[_isPanScrolling] = true;
      this._startGesture(event);
    }

    // Pan deltas are pane pixels, so divide by k before Transform scales them.
    const next = constrain(_classPrivateFieldLooseBase$3(this, _transform)[_transform].translate(dx / _classPrivateFieldLooseBase$3(this, _transform)[_transform].k, dy / _classPrivateFieldLooseBase$3(this, _transform)[_transform].k), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
    this._setTransformInternal(next, event);
    this._schedulePanScrollEnd(event);
  }
  _schedulePanScrollEnd(event) {
    clearTimeout(_classPrivateFieldLooseBase$3(this, _panScrollTimer)[_panScrollTimer]);
    // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture idle timer; cleared in destroy() and on the next event
    _classPrivateFieldLooseBase$3(this, _panScrollTimer)[_panScrollTimer] = setTimeout(() => {
      _classPrivateFieldLooseBase$3(this, _panScrollTimer)[_panScrollTimer] = null;
      _classPrivateFieldLooseBase$3(this, _isPanScrolling)[_isPanScrolling] = false;
      this._endGesture(event);
    }, WHEEL_IDLE_MS);
  }

  // ------------------------------------------------------------ pointer

  _onPointerDown(event) {
    if (_classPrivateFieldLooseBase$3(this, _destroyed)[_destroyed] || _classPrivateFieldLooseBase$3(this, _pointerId$1)[_pointerId$1] !== null || !_classPrivateFieldLooseBase$3(this, _filter)[_filter](event)) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _pointerId$1)[_pointerId$1] = event.pointerId;
    _classPrivateFieldLooseBase$3(this, _usedRightMouseButton)[_usedRightMouseButton] = isRightClickPan(_classPrivateFieldLooseBase$3(this, _options)[_options].panOnDrag, event.button);
    _classPrivateFieldLooseBase$3(this, _startClient)[_startClient] = [event.clientX, event.clientY];
    _classPrivateFieldLooseBase$3(this, _moved)[_moved] = false;
    const point = this._pointer(event);
    _classPrivateFieldLooseBase$3(this, _anchor)[_anchor] = [point, _classPrivateFieldLooseBase$3(this, _transform)[_transform].invert(point)];
    this._cancelAnimation();

    /*
     * Capture on the pane so the drag survives the pointer leaving it, and so
     * a child element cannot steal subsequent moves.
     */
    _classPrivateFieldLooseBase$3(this, _domNode)[_domNode].setPointerCapture?.(event.pointerId);
    this._startGesture(event);
    _classPrivateFieldLooseBase$3(this, _onDraggingChange)[_onDraggingChange]?.(true);
  }
  _onPointerMove(event) {
    if (_classPrivateFieldLooseBase$3(this, _pointerId$1)[_pointerId$1] !== event.pointerId) {
      return;
    }
    if (!_classPrivateFieldLooseBase$3(this, _moved)[_moved]) {
      const dx = event.clientX - _classPrivateFieldLooseBase$3(this, _startClient)[_startClient][0];
      const dy = event.clientY - _classPrivateFieldLooseBase$3(this, _startClient)[_startClient][1];
      const clickDistance = _classPrivateFieldLooseBase$3(this, _options)[_options].selectionOnDrag ? Infinity : !isNumeric(_classPrivateFieldLooseBase$3(this, _options)[_options].paneClickDistance) || _classPrivateFieldLooseBase$3(this, _options)[_options].paneClickDistance < 0 ? 0 : _classPrivateFieldLooseBase$3(this, _options)[_options].paneClickDistance;

      // Squared comparison, as d3 does, to avoid a sqrt per move.
      _classPrivateFieldLooseBase$3(this, _moved)[_moved] = dx * dx + dy * dy > clickDistance * clickDistance;
    }
    const point = this._pointer(event);
    _classPrivateFieldLooseBase$3(this, _anchor)[_anchor][0] = point;
    const next = constrain(translateTransform(_classPrivateFieldLooseBase$3(this, _transform)[_transform], _classPrivateFieldLooseBase$3(this, _anchor)[_anchor][0], _classPrivateFieldLooseBase$3(this, _anchor)[_anchor][1]), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
    this._setTransformInternal(next, event);
  }
  _onPointerUp(event) {
    if (_classPrivateFieldLooseBase$3(this, _pointerId$1)[_pointerId$1] !== event.pointerId) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _domNode)[_domNode].releasePointerCapture?.(event.pointerId);
    _classPrivateFieldLooseBase$3(this, _pointerId$1)[_pointerId$1] = null;
    _classPrivateFieldLooseBase$3(this, _anchor)[_anchor] = null;
    _classPrivateFieldLooseBase$3(this, _startClient)[_startClient] = null;
    _classPrivateFieldLooseBase$3(this, _onDraggingChange)[_onDraggingChange]?.(false);
    this._endGesture(event);
  }
  _onContextMenu(event) {
    /*
     * When right-drag is a configured pan, a right-button release would also
     * open the context menu. Suppress it, but only if the pointer actually
     * moved, so a stationary right-click still reaches the consumer.
     */
    if (_classPrivateFieldLooseBase$3(this, _usedRightMouseButton)[_usedRightMouseButton] && _classPrivateFieldLooseBase$3(this, _moved)[_moved]) {
      event.preventDefault();
    }
    _classPrivateFieldLooseBase$3(this, _usedRightMouseButton)[_usedRightMouseButton] = false;
  }
  _onDoubleClick(event) {
    if (_classPrivateFieldLooseBase$3(this, _destroyed)[_destroyed] || !_classPrivateFieldLooseBase$3(this, _options)[_options].zoomOnDoubleClick || !_classPrivateFieldLooseBase$3(this, _filter)[_filter](event)) {
      return;
    }
    event.preventDefault();
    const p0 = this._pointer(event);
    const p1 = _classPrivateFieldLooseBase$3(this, _transform)[_transform].invert(p0);
    const factor = event.shiftKey ? 1 / DBLCLICK_SCALE_FACTOR : DBLCLICK_SCALE_FACTOR;
    const scaled = scaleTransform(_classPrivateFieldLooseBase$3(this, _transform)[_transform], _classPrivateFieldLooseBase$3(this, _transform)[_transform].k * factor, [_classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom], _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom]]);
    const target = constrain(translateTransform(scaled, p0, p1), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
    this._runTransition(target, {
      duration: DBLCLICK_DURATION
    }, p0, event);
  }

  // ---------------------------------------------------------- transitions

  _cancelAnimation() {
    if (_classPrivateFieldLooseBase$3(this, _animation)[_animation]) {
      cancelAnimationFrame(_classPrivateFieldLooseBase$3(this, _animation)[_animation].frame);
      _classPrivateFieldLooseBase$3(this, _animation)[_animation].resolve(false);
      _classPrivateFieldLooseBase$3(this, _animation)[_animation] = null;
    }
  }

  /**
   * Animate to `target`, or jump when there is no duration.
   *
   * The tween interpolates in `[x, y, width]` space around `point`, which is
   * what keeps that point stationary for the whole animation; interpolating the
   * transform fields directly would swing the view sideways.
   * @returns {Promise<boolean>} resolves true on completion, false if superseded
   */
  _runTransition(target, options, point, event) {
    this._cancelAnimation();
    const duration = options?.duration ?? 0;
    if (!(typeof duration === 'number' && duration > 0)) {
      this._startGesture(event);
      this._setTransformInternal(target, event);
      this._endGesture(event);
      return Promise.resolve(true);
    }
    const ease = options?.ease ?? cubicInOut;
    const interpolator = options?.interpolate === 'linear' ? interpolateLinear : interpolateZoom;
    const tween = interpolateTransform(_classPrivateFieldLooseBase$3(this, _transform)[_transform], target, _classPrivateFieldLooseBase$3(this, _extent)[_extent], point, interpolator);
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this._startGesture(event);
    return new Promise(resolve => {
      const step = () => {
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const t = Math.min(1, (now - start) / duration);
        this._setTransformInternal(tween(ease(t)), event);
        if (t < 1) {
          // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
          _classPrivateFieldLooseBase$3(this, _animation)[_animation].frame = requestAnimationFrame(step);
          return;
        }

        // Land exactly on the target; ease(1) can be a hair off.
        this._setTransformInternal(target, event);
        _classPrivateFieldLooseBase$3(this, _animation)[_animation] = null;
        this._endGesture(event);
        resolve(true);
      };

      // eslint-disable-next-line @lwc/lwc/no-async-operation -- gesture loop; the handle is stored and cancelled in destroy()
      _classPrivateFieldLooseBase$3(this, _animation)[_animation] = {
        resolve,
        frame: requestAnimationFrame(step)
      };
    });
  }

  // -------------------------------------------------------------- public

  /**
   * Apply configuration. Called whenever the root component's props change.
   * @param {Object} options
   */
  update(options) {
    _classPrivateFieldLooseBase$3(this, _options)[_options] = {
      ..._classPrivateFieldLooseBase$3(this, _options)[_options],
      ...options
    };
    if (options.minZoom !== undefined) {
      _classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom] = options.minZoom;
    }
    if (options.maxZoom !== undefined) {
      _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom] = options.maxZoom;
    }
    if (options.translateExtent !== undefined) {
      _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent] = options.translateExtent;
    }
    _classPrivateFieldLooseBase$3(this, _filter)[_filter] = createFilter(_classPrivateFieldLooseBase$3(this, _options)[_options]);
  }

  /** Stop responding to input. Idempotent. */
  destroy() {
    if (_classPrivateFieldLooseBase$3(this, _destroyed)[_destroyed]) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _destroyed)[_destroyed] = true;
    this._cancelAnimation();
    clearTimeout(_classPrivateFieldLooseBase$3(this, _wheelIdleTimer)[_wheelIdleTimer]);
    clearTimeout(_classPrivateFieldLooseBase$3(this, _panScrollTimer)[_panScrollTimer]);
    _classPrivateFieldLooseBase$3(this, _resizeObserver$1)[_resizeObserver$1]?.disconnect();
    const node = _classPrivateFieldLooseBase$3(this, _domNode)[_domNode];
    node.removeEventListener('wheel', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].wheel);
    node.removeEventListener('pointerdown', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointerdown);
    node.removeEventListener('pointermove', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointermove);
    node.removeEventListener('pointerup', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointerup);
    node.removeEventListener('pointercancel', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].pointercancel);
    node.removeEventListener('dblclick', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].dblclick);
    node.removeEventListener('contextmenu', _classPrivateFieldLooseBase$3(this, _listeners)[_listeners].contextmenu);
  }

  /**
   * Move to `viewport`.
   * @param {import('c/flowTypes').Viewport} viewport
   * @param {{duration?: number, ease?: Function, interpolate?: 'linear'}} [options]
   * @returns {Promise<boolean>}
   */
  setViewport(viewport, options) {
    return this._runTransition(viewportToTransform(viewport), options, null, null);
  }

  /**
   * Move to `viewport` after clamping it into `translateExtent`.
   * @returns {Promise<import('c/flowTypes').Viewport>} the viewport actually applied
   */
  async setViewportConstrained(viewport, extent, translateExtent) {
    const target = constrain(viewportToTransform(viewport), extent, translateExtent);
    await this._runTransition(target, undefined, null, null);
    return transformToViewport(target);
  }

  /** Write a viewport with no callbacks, for syncing from external state. */
  syncViewport(viewport) {
    const next = viewportToTransform(viewport);
    if (next.k === _classPrivateFieldLooseBase$3(this, _transform)[_transform].k && next.x === _classPrivateFieldLooseBase$3(this, _transform)[_transform].x && next.y === _classPrivateFieldLooseBase$3(this, _transform)[_transform].y) {
      return;
    }
    _classPrivateFieldLooseBase$3(this, _transform)[_transform] = next;
    this._emitTransform();
  }

  /** @returns {import('c/flowTypes').Viewport} */
  getViewport() {
    return transformToViewport(_classPrivateFieldLooseBase$3(this, _transform)[_transform]);
  }

  /**
   * Zoom to an absolute level, about the pane centre.
   * @param {number} zoom
   * @param {Object} [options]
   * @returns {Promise<boolean>}
   */
  scaleTo(zoom, options) {
    const p0 = centroid(_classPrivateFieldLooseBase$3(this, _extent)[_extent]);
    const p1 = _classPrivateFieldLooseBase$3(this, _transform)[_transform].invert(p0);
    const scaled = scaleTransform(_classPrivateFieldLooseBase$3(this, _transform)[_transform], zoom, [_classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom], _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom]]);
    const target = constrain(translateTransform(scaled, p0, p1), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
    return this._runTransition(target, options, p0, null);
  }

  /**
   * Multiply the current zoom, about the pane centre.
   * @param {number} factor
   * @param {Object} [options]
   * @returns {Promise<boolean>}
   */
  scaleBy(factor, options) {
    return this.scaleTo(_classPrivateFieldLooseBase$3(this, _transform)[_transform].k * factor, options);
  }

  /** @param {[number, number]} scaleExtent */
  setScaleExtent(scaleExtent) {
    _classPrivateFieldLooseBase$3(this, _minZoom)[_minZoom] = scaleExtent[0];
    _classPrivateFieldLooseBase$3(this, _maxZoom)[_maxZoom] = scaleExtent[1];
  }

  /** @param {import('c/flowTypes').CoordinateExtent} translateExtent */
  setTranslateExtent(translateExtent) {
    _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent] = translateExtent;
  }

  /** @param {number} distance */
  setClickDistance(distance) {
    const valid = !isNumeric(distance) || distance < 0 ? 0 : distance;
    _classPrivateFieldLooseBase$3(this, _options)[_options] = {
      ..._classPrivateFieldLooseBase$3(this, _options)[_options],
      paneClickDistance: valid
    };
  }

  /**
   * Pan by a pane-pixel delta, respecting `translateExtent`.
   * @param {import('c/flowTypes').XYPosition} delta
   * @returns {boolean} whether the transform actually moved
   */
  panBy(delta) {
    if (!delta.x && !delta.y) {
      return false;
    }
    const before = _classPrivateFieldLooseBase$3(this, _transform)[_transform];
    const next = constrain(new Transform(before.k, before.x + delta.x, before.y + delta.y), _classPrivateFieldLooseBase$3(this, _extent)[_extent], _classPrivateFieldLooseBase$3(this, _translateExtent)[_translateExtent]);
    this._setTransformInternal(next, null);
    return next.x !== before.x || next.y !== before.y || next.k !== before.k;
  }

  /** Current pane extent, `[[0,0],[width,height]]`. */
  getExtent() {
    return _classPrivateFieldLooseBase$3(this, _extent)[_extent];
  }
}

/**
 * Create a pan/zoom controller for a pane element.
 * @param {Object} params
 * @param {HTMLElement} params.domNode the pane
 * @param {number} params.minZoom
 * @param {number} params.maxZoom
 * @param {import('c/flowTypes').CoordinateExtent} params.translateExtent
 * @param {import('c/flowTypes').Viewport} params.viewport initial viewport
 * @param {Function} [params.onPanZoom]
 * @param {Function} [params.onPanZoomStart]
 * @param {Function} [params.onPanZoomEnd]
 * @param {Function} [params.onDraggingChange]
 * @param {Function} [params.onTransformChange]
 * @returns {PanZoom}
 */
function createPanZoom(params) {
  return new PanZoom(params);
}

function _classPrivateFieldLooseBase$2(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$2 = 0;
function _classPrivateFieldLooseKey$2(e) { return "__private_" + id$2++ + "_" + e; }

/** Every handle carries this class, which is how hit-testing recognises one. */
const HANDLE_CLASS = 'flow__handle';

/**
 * Nodes whose rect overlaps a square of side `2 * distance` around `position`.
 *
 * A cheap pre-filter so the handle scan does not touch every node in a large
 * graph. The box is generous on purpose: {@link getClosestHandle} adds
 * {@link HANDLE_SEARCH_PADDING} to the radius, because a node's *rect* can be
 * far from the pointer while one of its handles is not.
 * @param {import('c/flowTypes').XYPosition} position flow coordinates
 * @param {Map<string, *>} nodeLookup
 * @param {number} distance
 * @returns {Array<*>}
 */
function getNodesWithinDistance(position, nodeLookup, distance) {
  const nodes = [];
  const rect = {
    x: position.x - distance,
    y: position.y - distance,
    width: distance * 2,
    height: distance * 2
  };
  for (const node of nodeLookup.values()) {
    if (getOverlappingArea(rect, nodeToRect(node)) > 0) {
      nodes.push(node);
    }
  }
  return nodes;
}

/**
 * The connectable handle nearest `position`, or null beyond `connectionRadius`.
 *
 * Ties are broken toward the handle of the opposite type: when a source and a
 * target handle sit exactly on top of each other, the one that can actually
 * complete the connection is the useful answer.
 * @param {import('c/flowTypes').XYPosition} position flow coordinates
 * @param {number} connectionRadius
 * @param {Map<string, *>} nodeLookup
 * @param {{nodeId: string, type: 'source'|'target', id?: string|null}} fromHandle
 * @returns {import('c/flowTypes').FlowHandle|null}
 */
function getClosestHandle(position, connectionRadius, nodeLookup, fromHandle) {
  let closestHandles = [];
  let minDistance = Infinity;
  const closeNodes = getNodesWithinDistance(position, nodeLookup, connectionRadius + HANDLE_SEARCH_PADDING);
  for (const node of closeNodes) {
    const allHandles = [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];
    for (const handle of allHandles) {
      // Never snap back to the handle the connection started from.
      if (fromHandle.nodeId === handle.nodeId && fromHandle.type === handle.type && fromHandle.id === handle.id) {
        continue;
      }
      const {
        x,
        y
      } = getHandlePosition(node, handle, handle.position, true);
      const distance = Math.sqrt(Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2));
      if (distance > connectionRadius) {
        continue;
      }
      if (distance < minDistance) {
        closestHandles = [{
          ...handle,
          x,
          y
        }];
        minDistance = distance;
      } else if (distance === minDistance) {
        closestHandles.push({
          ...handle,
          x,
          y
        });
      }
    }
  }
  if (!closestHandles.length) {
    return null;
  }
  if (closestHandles.length > 1) {
    const oppositeHandleType = fromHandle.type === 'source' ? 'target' : 'source';
    return closestHandles.find(handle => handle.type === oppositeHandleType) ?? closestHandles[0];
  }
  return closestHandles[0];
}

/**
 * Resolve a specific handle on a node.
 *
 * In loose connection mode both buckets are searched, because a source handle is
 * allowed to receive a connection. With no `handleId` the node's first handle of
 * that type is used, which is what makes single-handle nodes work without ids.
 * @param {string} nodeId
 * @param {'source'|'target'} handleType
 * @param {string|null} handleId
 * @param {Map<string, *>} nodeLookup
 * @param {string} connectionMode
 * @param {boolean} [withAbsolutePosition=false] resolve x/y to flow coordinates
 * @returns {import('c/flowTypes').FlowHandle|null}
 */
function getHandle(nodeId, handleType, handleId, nodeLookup, connectionMode, withAbsolutePosition = false) {
  const node = nodeLookup.get(nodeId);
  if (!node) {
    return null;
  }
  const handles = connectionMode === ConnectionMode.Strict ? node.internals.handleBounds?.[handleType] : [...(node.internals.handleBounds?.source ?? []), ...(node.internals.handleBounds?.target ?? [])];
  const handle = (handleId ? handles?.find(h => h.id === handleId) : handles?.[0]) ?? null;
  return handle && withAbsolutePosition ? {
    ...handle,
    ...getHandlePosition(node, handle, handle.position, true)
  } : handle;
}

/**
 * The handle type an element represents, from its marker classes.
 * @param {'source'|'target'|undefined} edgeUpdaterType overrides the DOM when reconnecting
 * @param {Element|null} handleDomNode
 * @returns {'source'|'target'|null}
 */
function getHandleType(edgeUpdaterType, handleDomNode) {
  if (handleDomNode?.classList?.contains('target')) {
    return 'target';
  }
  if (handleDomNode?.classList?.contains('source')) {
    return 'source';
  }
  return null;
}

/**
 * Tri-state connection validity, for driving the handle's visual feedback.
 *
 * `null` means "no opinion": the pointer is nowhere near a handle, so neither a
 * valid nor an invalid style should be shown. That is distinct from `false`,
 * which means the user is over a handle that would reject the connection.
 * @param {boolean} isInsideConnectionRadius
 * @param {boolean} isHandleValid
 * @returns {boolean|null}
 */
function isConnectionValid(isInsideConnectionRadius, isHandleValid) {
  if (isHandleValid) {
    return true;
  }
  if (isInsideConnectionRadius && !isHandleValid) {
    return false;
  }
  return null;
}

/**
 * The topmost handle element at a viewport point, crossing shadow boundaries.
 *
 * `elementFromPoint` stops at the outermost shadow host, so every candidate is
 * re-queried through its own `shadowRoot` until no deeper element is found. This
 * is the LWC-specific part of connection hit-testing: without it, a handle
 * inside a custom node's shadow root would be invisible to the pointer.
 * @param {Document|ShadowRoot} root
 * @param {number} x client x
 * @param {number} y client y
 * @returns {Element|null}
 */
function handleElementFromPoint(root, x, y) {
  const doc = root?.ownerDocument ?? (typeof document !== 'undefined' ? document : null);
  if (!doc?.elementsFromPoint) {
    return null;
  }
  for (const start of doc.elementsFromPoint(x, y)) {
    let element = start;

    // Descend while the hit element hosts a shadow root with something at this point.
    for (let depth = 0; depth < 20; depth++) {
      if (element?.classList?.contains(HANDLE_CLASS)) {
        return element;
      }
      const shadow = element?.shadowRoot;
      if (!shadow?.elementFromPoint) {
        break;
      }
      const inner = shadow.elementFromPoint(x, y);
      if (!inner || inner === element) {
        break;
      }
      element = inner;
    }
  }
  return null;
}

/**
 * Decide whether dropping at this point would create a valid connection.
 *
 * Returns the prospective `connection`, whether it is valid, the handle element
 * involved, and the resolved target handle. The connection object is returned
 * even when invalid so the caller can report it to `onConnectEnd`.
 *
 * Rejection reasons, in the order they apply:
 * - nothing connectable under the pointer or within the radius
 * - the handle is not marked `connectable` and `connectableend`
 * - strict mode: source may only meet target
 * - loose mode: the exact same handle on the same node
 * - the consumer's `isValidConnection` callback returned false
 * @param {Object} params
 * @param {import('c/flowTypes').FlowHandle|null} params.handle nearest handle, if any
 * @param {string} params.connectionMode
 * @param {string} params.fromNodeId
 * @param {string|null} params.fromHandleId
 * @param {'source'|'target'} params.fromType
 * @param {Document|ShadowRoot} params.doc
 * @param {string} params.flowId
 * @param {(connection: *) => boolean} [params.isValidConnection]
 * @param {Map<string, *>} params.nodeLookup
 * @param {{x: number, y: number}} params.clientPosition
 * @returns {{handleDomNode: Element|null, isValid: boolean, connection: *|null, toHandle: *|null}}
 */
function isValidHandle({
  handle,
  connectionMode,
  fromNodeId,
  fromHandleId,
  fromType,
  doc,
  flowId,
  isValidConnection = () => true,
  nodeLookup,
  clientPosition
}) {
  const isTarget = fromType === 'target';
  const handleDomNode = handle ? doc?.querySelector?.(`.${HANDLE_CLASS}[data-id="${flowId}-${handle.nodeId}-${handle.id}-${handle.type}"]`) ?? null : null;
  const handleBelow = clientPosition ? handleElementFromPoint(doc, clientPosition.x, clientPosition.y) : null;

  // The handle under the cursor beats the nearest one; see the module comment.
  const handleToCheck = handleBelow ?? handleDomNode;
  const result = {
    handleDomNode: handleToCheck,
    isValid: false,
    connection: null,
    toHandle: null
  };
  if (!handleToCheck) {
    return result;
  }
  const handleType = getHandleType(undefined, handleToCheck);
  const handleNodeId = handleToCheck.getAttribute('data-nodeid');
  const handleId = handleToCheck.getAttribute('data-handleid');
  const connectable = handleToCheck.classList.contains('connectable');
  const connectableEnd = handleToCheck.classList.contains('connectableend');
  if (!handleNodeId || !handleType) {
    return result;
  }
  const connection = {
    source: isTarget ? handleNodeId : fromNodeId,
    sourceHandle: isTarget ? handleId : fromHandleId,
    target: isTarget ? fromNodeId : handleNodeId,
    targetHandle: isTarget ? fromHandleId : handleId
  };
  result.connection = connection;
  const isConnectable = connectable && connectableEnd;
  const isValid = isConnectable && (connectionMode === ConnectionMode.Strict ? isTarget && handleType === 'source' || !isTarget && handleType === 'target' : handleNodeId !== fromNodeId || handleId !== fromHandleId);
  result.isValid = isValid && isValidConnection(connection);
  result.toHandle = getHandle(handleNodeId, handleType, handleId, nodeLookup, connectionMode, true);
  return result;
}

/**
 * One connection drag.
 *
 * The state it publishes is `store.state.connection`, which is what the edge
 * renderer draws the in-flight line from and what every handle reads to show
 * its connecting, valid and invalid states. Nothing else observes this class.
 *
 * Target resolution differs from upstream in one respect, forced by shadow DOM:
 * upstream finds the nearest handle's element with one `document.querySelector`
 * on its `data-id`, which cannot cross a shadow boundary here. Instead the
 * shadow-aware hit test runs a second time at the nearest handle's own client
 * point, which answers the same question - is there a connectable handle there,
 * and which one - without a selector that has to reach into three nested roots.
 */
var _store$1 = /*#__PURE__*/_classPrivateFieldLooseKey$2("store");
var _flowId$1 = /*#__PURE__*/_classPrivateFieldLooseKey$2("flowId");
var _isValidConnection = /*#__PURE__*/_classPrivateFieldLooseKey$2("isValidConnection");
var _onStart = /*#__PURE__*/_classPrivateFieldLooseKey$2("onStart");
var _onEnd = /*#__PURE__*/_classPrivateFieldLooseKey$2("onEnd");
var _from = /*#__PURE__*/_classPrivateFieldLooseKey$2("from");
var _fromHandle = /*#__PURE__*/_classPrivateFieldLooseKey$2("fromHandle");
var _pointerId = /*#__PURE__*/_classPrivateFieldLooseKey$2("pointerId");
var _origin = /*#__PURE__*/_classPrivateFieldLooseKey$2("origin");
var _started = /*#__PURE__*/_classPrivateFieldLooseKey$2("started");
var _connection = /*#__PURE__*/_classPrivateFieldLooseKey$2("connection");
var _isValid = /*#__PURE__*/_classPrivateFieldLooseKey$2("isValid");
class Connect {
  constructor({
    store,
    flowId,
    isValidConnection,
    onStart,
    onEnd
  }) {
    Object.defineProperty(this, _store$1, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _flowId$1, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isValidConnection, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onStart, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _onEnd, {
      writable: true,
      value: void 0
    });
    /** `{nodeId, handleId, handleType}` of the handle that was pressed. */
    Object.defineProperty(this, _from, {
      writable: true,
      value: null
    });
    /** That handle resolved against `handleBounds`, with absolute coordinates. */
    Object.defineProperty(this, _fromHandle, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _pointerId, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _origin, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _started, {
      writable: true,
      value: false
    });
    /** Last prospective connection, valid or not, for `connectend`. */
    Object.defineProperty(this, _connection, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _isValid, {
      writable: true,
      value: false
    });
    _classPrivateFieldLooseBase$2(this, _store$1)[_store$1] = store;
    _classPrivateFieldLooseBase$2(this, _flowId$1)[_flowId$1] = flowId;
    _classPrivateFieldLooseBase$2(this, _isValidConnection)[_isValidConnection] = isValidConnection;
    _classPrivateFieldLooseBase$2(this, _onStart)[_onStart] = onStart;
    _classPrivateFieldLooseBase$2(this, _onEnd)[_onEnd] = onEnd;
  }

  /** True once a handle has reported a press, until the pointer is released. */
  get isPending() {
    return _classPrivateFieldLooseBase$2(this, _from)[_from] !== null;
  }

  /** True once the drag threshold has been crossed and a line is being drawn. */
  get isDragging() {
    return _classPrivateFieldLooseBase$2(this, _started)[_started];
  }

  /**
   * Arm the gesture from a handle's `connectstart`.
   * @param {{nodeId: string, handleId: string|null, handleType: 'source'|'target'}} from
   * @returns {boolean} false when the handle cannot be resolved, e.g. unmeasured
   */
  start(from) {
    if (_classPrivateFieldLooseBase$2(this, _from)[_from]) {
      return false;
    }
    const s = _classPrivateFieldLooseBase$2(this, _store$1)[_store$1].state;
    const fromHandle = getHandle(from.nodeId, from.handleType, from.handleId ?? null, s.nodeLookup, s.connectionMode, true);
    if (!fromHandle) {
      return false;
    }
    _classPrivateFieldLooseBase$2(this, _from)[_from] = {
      ...from,
      handleId: from.handleId ?? null
    };
    _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle] = fromHandle;
    return true;
  }

  /**
   * Anchor the armed gesture to the pointer that started it.
   *
   * The handle's event carries no coordinates, so the press point comes from
   * the pane's own `pointerdown` for the same press, which runs immediately
   * after the handle's listener.
   * @param {PointerEvent} event
   */
  press(event) {
    if (!_classPrivateFieldLooseBase$2(this, _from)[_from] || _classPrivateFieldLooseBase$2(this, _pointerId)[_pointerId] !== null) {
      return;
    }
    _classPrivateFieldLooseBase$2(this, _pointerId)[_pointerId] = event.pointerId;
    _classPrivateFieldLooseBase$2(this, _origin)[_origin] = {
      x: event.clientX,
      y: event.clientY
    };
    if (this._threshold() === 0) {
      this._begin();
      this._track(event);
    }
  }

  /**
   * Track the pointer: snap to a handle if one is near, and publish validity.
   * @param {PointerEvent} event
   */
  move(event) {
    if (_classPrivateFieldLooseBase$2(this, _pointerId)[_pointerId] !== event.pointerId || !_classPrivateFieldLooseBase$2(this, _from)[_from]) {
      return;
    }
    if (!_classPrivateFieldLooseBase$2(this, _started)[_started]) {
      const dx = event.clientX - _classPrivateFieldLooseBase$2(this, _origin)[_origin].x;
      const dy = event.clientY - _classPrivateFieldLooseBase$2(this, _origin)[_origin].y;
      if (Math.sqrt(dx * dx + dy * dy) <= this._threshold()) {
        return;
      }
      this._begin();
    }
    this._track(event);
  }

  /**
   * Finish the gesture.
   * @param {PointerEvent} event
   * @returns {*|null} the connection to create, or null if there is none
   */
  end(event) {
    if (_classPrivateFieldLooseBase$2(this, _pointerId)[_pointerId] !== event.pointerId) {
      return null;
    }
    const started = _classPrivateFieldLooseBase$2(this, _started)[_started];
    const connection = _classPrivateFieldLooseBase$2(this, _connection)[_connection];
    const isValid = _classPrivateFieldLooseBase$2(this, _isValid)[_isValid];
    this.cancel();
    if (!started) {
      return null;
    }
    _classPrivateFieldLooseBase$2(this, _onEnd)[_onEnd]?.(connection, isValid);
    return isValid ? connection : null;
  }

  /** Abandon the gesture and clear the published state. Idempotent. */
  cancel() {
    const wasPending = _classPrivateFieldLooseBase$2(this, _from)[_from] !== null;
    _classPrivateFieldLooseBase$2(this, _from)[_from] = null;
    _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle] = null;
    _classPrivateFieldLooseBase$2(this, _pointerId)[_pointerId] = null;
    _classPrivateFieldLooseBase$2(this, _origin)[_origin] = null;
    _classPrivateFieldLooseBase$2(this, _started)[_started] = false;
    _classPrivateFieldLooseBase$2(this, _connection)[_connection] = null;
    _classPrivateFieldLooseBase$2(this, _isValid)[_isValid] = false;
    if (wasPending) {
      _classPrivateFieldLooseBase$2(this, _store$1)[_store$1].update({
        connection: {
          inProgress: false
        }
      });
    }
  }
  _threshold() {
    return _classPrivateFieldLooseBase$2(this, _store$1)[_store$1].state.connectionDragThreshold ?? 1;
  }
  _begin() {
    _classPrivateFieldLooseBase$2(this, _started)[_started] = true;
    _classPrivateFieldLooseBase$2(this, _onStart)[_onStart]?.(_classPrivateFieldLooseBase$2(this, _from)[_from]);
  }
  _track(event) {
    const s = _classPrivateFieldLooseBase$2(this, _store$1)[_store$1].state;
    const bounds = s.domNode?.getBoundingClientRect();
    if (!bounds) {
      return;
    }
    const panePoint = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    };
    const pointer = pointToRendererPoint(panePoint, s.transform);
    const closest = getClosestHandle(pointer, s.connectionRadius, s.nodeLookup, _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle]);
    const result = this._resolveTarget(event, closest, bounds);
    _classPrivateFieldLooseBase$2(this, _connection)[_connection] = result.connection;
    _classPrivateFieldLooseBase$2(this, _isValid)[_isValid] = result.isValid;
    const toHandle = result.isValid ? result.toHandle : null;
    _classPrivateFieldLooseBase$2(this, _store$1)[_store$1].update({
      connection: {
        inProgress: true,
        from: {
          x: _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle].x,
          y: _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle].y
        },
        fromPosition: _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle].position,
        fromHandle: _classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle],
        to: toHandle ? {
          x: toHandle.x,
          y: toHandle.y
        } : pointer,
        toPosition: toHandle ? toHandle.position : oppositePosition[_classPrivateFieldLooseBase$2(this, _fromHandle)[_fromHandle].position],
        toHandle: result.toHandle ?? null,
        isValid: isConnectionValid(!!closest, result.isValid)
      }
    });
  }

  /**
   * Hit-test under the pointer first, then at the nearest handle's own point.
   *
   * Two probes rather than one, because the pointer wins when it is inside a
   * handle, and the second probe is what makes the snap radius work at all.
   */
  _resolveTarget(event, closest, bounds) {
    const s = _classPrivateFieldLooseBase$2(this, _store$1)[_store$1].state;
    const params = {
      connectionMode: s.connectionMode,
      fromNodeId: _classPrivateFieldLooseBase$2(this, _from)[_from].nodeId,
      fromHandleId: _classPrivateFieldLooseBase$2(this, _from)[_from].handleId,
      fromType: _classPrivateFieldLooseBase$2(this, _from)[_from].handleType,
      doc: s.domNode?.getRootNode?.() ?? null,
      flowId: _classPrivateFieldLooseBase$2(this, _flowId$1)[_flowId$1],
      isValidConnection: _classPrivateFieldLooseBase$2(this, _isValidConnection)[_isValidConnection],
      nodeLookup: s.nodeLookup
    };
    const underPointer = isValidHandle({
      ...params,
      handle: closest,
      clientPosition: {
        x: event.clientX,
        y: event.clientY
      }
    });
    if (underPointer.handleDomNode || !closest) {
      return underPointer;
    }
    const pane = rendererPointToPoint({
      x: closest.x,
      y: closest.y
    }, s.transform);
    return isValidHandle({
      ...params,
      handle: closest,
      clientPosition: {
        x: bounds.left + pane.x,
        y: bounds.top + pane.y
      }
    });
  }
}

/**
 * Create a connection gesture controller.
 * @param {Object} params see {@link Connect}
 * @returns {Connect}
 */
function createConnect(params) {
  return new Connect(params);
}

function stylesheet$5(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".flow__node-label" + shadowSelector + " {pointer-events: none;user-select: none;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$5 = [stylesheet$5];

function stylesheet$4(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".flow__handle" + shadowSelector + " {position: absolute;pointer-events: none;box-sizing: border-box;min-width: 5px;min-height: 5px;width: var(--flow-handle-size, 6px);height: var(--flow-handle-size, 6px);background-color: var(--flow-handle-background, var(--slds-g-color-neutral-base-10, #1a192b));border: 1px solid var(--flow-handle-border-color, var(--slds-g-color-neutral-base-100, #ffffff));border-radius: 100%;}.flow__handle.connectingfrom" + shadowSelector + " {pointer-events: all;}.flow__handle.connectionindicator" + shadowSelector + " {pointer-events: all;cursor: crosshair;}.flow__handle-bottom" + shadowSelector + " {top: auto;left: 50%;bottom: 0;transform: translate(-50%, 50%);}.flow__handle-top" + shadowSelector + " {top: 0;left: 50%;transform: translate(-50%, -50%);}.flow__handle-left" + shadowSelector + " {top: 50%;left: 0;transform: translate(-50%, -50%);}.flow__handle-right" + shadowSelector + " {top: 50%;right: 0;transform: translate(50%, -50%);}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$4 = [stylesheet$4];

const $fragment1$5 = parseFragment`<div${"c0"}${"a0:data-handleid"}${"a0:data-nodeid"}${"a0:data-handlepos"}${"a0:data-id"}${2}></div>`;
function tmpl$6($api, $cmp, $slotset, $ctx) {
  const {ncls: api_normalize_class_name, b: api_bind, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0, _m1} = $ctx;
  return [api_static_fragment($fragment1$5, 1, [api_static_part(0, {
    on: _m1 || ($ctx._m1 = {
      "pointerdown": api_bind($cmp.handlePointerDown)
    }),
    className: api_normalize_class_name($cmp.handleClass),
    attrs: {
      "data-handleid": $cmp.handleId,
      "data-nodeid": $cmp.nodeId,
      "data-handlepos": $cmp.position,
      "data-id": $cmp.handleDomId
    }
  }, null)])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$6 = registerTemplate(tmpl$6);
tmpl$6.renderMode = "light";
tmpl$6.stylesheets = [];
tmpl$6.stylesheetToken = "lwc-6lktolkr1ho";
tmpl$6.legacyStylesheetToken = "lwc-flowHandle_flowHandle";
if (_implicitStylesheets$4) {
  tmpl$6.stylesheets.push.apply(tmpl$6.stylesheets, _implicitStylesheets$4);
}
freezeTemplate(tmpl$6);

function _classPrivateFieldLooseBase$1(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id$1 = 0;
function _classPrivateFieldLooseKey$1(e) { return "__private_" + id$1++ + "_" + e; }
var _unsubscribe = /*#__PURE__*/_classPrivateFieldLooseKey$1("unsubscribe");
class FlowHandle extends LightningElement {
  constructor(...args) {
    super(...args);
    /** @type {import('c/flowStore').FlowStore} */
    this.store = void 0;
    /** Id of the node this handle belongs to. */
    this.nodeId = void 0;
    /** Id of the owning flow, used to build the globally unique `data-id`. */
    this.flowId = void 0;
    /** Consumer override for connection validity, forwarded to the gesture owner. */
    this.isValidConnection = void 0;
    this._type = 'source';
    this._position = void 0;
    this._handleId = null;
    this._isConnectable = true;
    this._isConnectableStart = true;
    this._isConnectableEnd = true;
    /**
     * Latest `connection` slice of the store; drives the connecting classes.
     *
     * An ordinary field, not a `#` one: the LWC babel plugin builds its reactive-field list from
     * `ClassProperty` nodes only, so a `#field` is never reactive and a template that reads it -
     * here through the `handleClass` getter - would never re-render.
     */
    this._connection = void 0;
    /** Subscription handle. Never read by the template, so it may stay private. */
    Object.defineProperty(this, _unsubscribe, {
      writable: true,
      value: void 0
    });
    /** Class-list cache; read only during render, keyed on everything that feeds the list. */
    this._classKey = void 0;
    this._className = '';
  }
  /** `'source'` or `'target'`. Anything else is normalised to `'source'`, as upstream does. */
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
  get handleId() {
    return this._handleId;
  }
  set handleId(value) {
    this._handleId = value ?? null;
  }
  get isConnectable() {
    return this._isConnectable;
  }
  set isConnectable(value) {
    this._isConnectable = value === undefined || value === null ? true : !!value;
  }
  get isConnectableStart() {
    return this._isConnectableStart;
  }
  set isConnectableStart(value) {
    this._isConnectableStart = value === undefined || value === null ? true : !!value;
  }
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
    _classPrivateFieldLooseBase$1(this, _unsubscribe)[_unsubscribe] = this.store?.subscribe(state => state.connection, connection => {
      this._connection = connection;
    });
  }
  disconnectedCallback() {
    _classPrivateFieldLooseBase$1(this, _unsubscribe)[_unsubscribe]?.();
    _classPrivateFieldLooseBase$1(this, _unsubscribe)[_unsubscribe] = undefined;
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
    const key = `${this._type}|${this.position}|${+this._isConnectable}${+this._isConnectableStart}${+this._isConnectableEnd}${+connectingFrom}${+connectingTo}${+valid}${+indicator}`;
    if (key === this._classKey) {
      return this._className;
    }
    const classes = [HANDLE_CLASS, `${HANDLE_CLASS}-${this.position}`, this._type, interactionClass.noDrag, interactionClass.noPan];
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
    this.dispatchEvent(new CustomEvent('connectstart', {
      detail: {
        nodeId: this.nodeId,
        handleId: this._handleId,
        handleType: this._type
      }
    }));
  }

  /** True when `handle` names this exact handle. */
  _identifies(handle) {
    return !!handle && handle.nodeId === this.nodeId && (handle.id ?? null) === this._handleId && handle.type === this._type;
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
    const isPossibleEndHandle = connectionMode === ConnectionMode.Strict ? fromHandle?.type !== this._type : this.nodeId !== fromHandle?.nodeId || this._handleId !== (fromHandle?.id ?? null);
    if (connectionInProcess && !isPossibleEndHandle) {
      return false;
    }
    return connectionInProcess ? this._isConnectableEnd : this._isConnectableStart;
  }
  /*LWC compiler v9.4.3*/
}
/** See the class comment: measurement across shadow roots forces light DOM. */
FlowHandle.renderMode = 'light';
registerDecorators(FlowHandle, {
  publicProps: {
    store: {
      config: 0
    },
    nodeId: {
      config: 0
    },
    flowId: {
      config: 0
    },
    isValidConnection: {
      config: 0
    },
    type: {
      config: 3
    },
    position: {
      config: 3
    },
    handleId: {
      config: 3
    },
    isConnectable: {
      config: 3
    },
    isConnectableStart: {
      config: 3
    },
    isConnectableEnd: {
      config: 3
    }
  },
  fields: ["_type", "_position", "_handleId", "_isConnectable", "_isConnectableStart", "_isConnectableEnd", "_connection", "_classKey", "_className"]
});
const __lwc_component_class_internal$7 = registerComponent(FlowHandle, {
  tmpl: _tmpl$6,
  sel: "c-flow-handle",
  apiVersion: 66
});

const $fragment1$4 = parseFragment`<span class="flow__node-label${0}"${2}>${"t1"}</span>`;
function tmpl$5($api, $cmp, $slotset, $ctx) {
  const {d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, b: api_bind, c: api_custom_element} = $api;
  const {_m0} = $ctx;
  return [api_static_fragment($fragment1$4, 1, [api_static_part(1, null, api_dynamic_text($cmp.label))]), api_custom_element("c-flow-handle", __lwc_component_class_internal$7, {
    props: {
      "type": "source",
      "position": $cmp.sourcePosition,
      "store": $cmp.store,
      "nodeId": $cmp.id,
      "flowId": $cmp.flowId,
      "isConnectable": $cmp.isConnectable
    },
    key: 2,
    on: _m0 || ($ctx._m0 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  })];
  /*LWC compiler v9.4.3*/
}
var _tmpl$5 = registerTemplate(tmpl$5);
tmpl$5.renderMode = "light";
tmpl$5.stylesheets = [];
tmpl$5.stylesheetToken = "lwc-307e8t84k9q";
tmpl$5.legacyStylesheetToken = "lwc-flowInputNode_flowInputNode";
if (_implicitStylesheets$5) {
  tmpl$5.stylesheets.push.apply(tmpl$5.stylesheets, _implicitStylesheets$5);
}
freezeTemplate(tmpl$5);

class FlowInputNode extends LightningElement {
  constructor(...args) {
    super(...args);
    this.id = void 0;
    this.data = void 0;
    this.type = void 0;
    this.selected = void 0;
    this.dragging = void 0;
    this.draggable = void 0;
    this.selectable = void 0;
    this.connectable = void 0;
    this.deletable = void 0;
    this.isConnectable = void 0;
    this.sourcePosition = void 0;
    this.targetPosition = void 0;
    this.positionAbsoluteX = void 0;
    this.positionAbsoluteY = void 0;
    this.width = void 0;
    this.height = void 0;
    this.parentId = void 0;
    this.zIndex = void 0;
    this.store = void 0;
    this.flowId = void 0;
  }
  get label() {
    return this.data?.label;
  }

  /** A handle only reports the press; the gesture owner lives further up the tree. */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', {
      detail: event.detail
    }));
  }
  /*LWC compiler v9.4.3*/
}
FlowInputNode.renderMode = 'light';
registerDecorators(FlowInputNode, {
  publicProps: {
    id: {
      config: 0
    },
    data: {
      config: 0
    },
    type: {
      config: 0
    },
    selected: {
      config: 0
    },
    dragging: {
      config: 0
    },
    draggable: {
      config: 0
    },
    selectable: {
      config: 0
    },
    connectable: {
      config: 0
    },
    deletable: {
      config: 0
    },
    isConnectable: {
      config: 0
    },
    sourcePosition: {
      config: 0
    },
    targetPosition: {
      config: 0
    },
    positionAbsoluteX: {
      config: 0
    },
    positionAbsoluteY: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    parentId: {
      config: 0
    },
    zIndex: {
      config: 0
    },
    store: {
      config: 0
    },
    flowId: {
      config: 0
    }
  }
});
const __lwc_component_class_internal$6 = registerComponent(FlowInputNode, {
  tmpl: _tmpl$5,
  sel: "c-flow-input-node",
  apiVersion: 66
});

function stylesheet$3(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".flow__node-label" + shadowSelector + " {pointer-events: none;user-select: none;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$3 = [stylesheet$3];

const $fragment1$3 = parseFragment`<span class="flow__node-label${0}"${2}>${"t1"}</span>`;
function tmpl$4($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, c: api_custom_element, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0, _m1} = $ctx;
  return [api_custom_element("c-flow-handle", __lwc_component_class_internal$7, {
    props: {
      "type": "target",
      "position": $cmp.targetPosition,
      "store": $cmp.store,
      "nodeId": $cmp.id,
      "flowId": $cmp.flowId,
      "isConnectable": $cmp.isConnectable
    },
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  }), api_static_fragment($fragment1$3, 2, [api_static_part(1, null, api_dynamic_text($cmp.label))]), api_custom_element("c-flow-handle", __lwc_component_class_internal$7, {
    props: {
      "type": "source",
      "position": $cmp.sourcePosition,
      "store": $cmp.store,
      "nodeId": $cmp.id,
      "flowId": $cmp.flowId,
      "isConnectable": $cmp.isConnectable
    },
    key: 3,
    on: _m1 || ($ctx._m1 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  })];
  /*LWC compiler v9.4.3*/
}
var _tmpl$4 = registerTemplate(tmpl$4);
tmpl$4.renderMode = "light";
tmpl$4.stylesheets = [];
tmpl$4.stylesheetToken = "lwc-3ilbfrjlj7n";
tmpl$4.legacyStylesheetToken = "lwc-flowDefaultNode_flowDefaultNode";
if (_implicitStylesheets$3) {
  tmpl$4.stylesheets.push.apply(tmpl$4.stylesheets, _implicitStylesheets$3);
}
freezeTemplate(tmpl$4);

class FlowDefaultNode extends LightningElement {
  constructor(...args) {
    super(...args);
    this.id = void 0;
    this.data = void 0;
    this.type = void 0;
    this.selected = void 0;
    this.dragging = void 0;
    this.draggable = void 0;
    this.selectable = void 0;
    this.connectable = void 0;
    this.deletable = void 0;
    this.isConnectable = void 0;
    this.sourcePosition = void 0;
    this.targetPosition = void 0;
    this.positionAbsoluteX = void 0;
    this.positionAbsoluteY = void 0;
    this.width = void 0;
    this.height = void 0;
    this.parentId = void 0;
    this.zIndex = void 0;
    this.store = void 0;
    this.flowId = void 0;
  }
  get label() {
    return this.data?.label;
  }

  /** A handle only reports the press; the gesture owner lives further up the tree. */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', {
      detail: event.detail
    }));
  }
  /*LWC compiler v9.4.3*/
}
FlowDefaultNode.renderMode = 'light';
registerDecorators(FlowDefaultNode, {
  publicProps: {
    id: {
      config: 0
    },
    data: {
      config: 0
    },
    type: {
      config: 0
    },
    selected: {
      config: 0
    },
    dragging: {
      config: 0
    },
    draggable: {
      config: 0
    },
    selectable: {
      config: 0
    },
    connectable: {
      config: 0
    },
    deletable: {
      config: 0
    },
    isConnectable: {
      config: 0
    },
    sourcePosition: {
      config: 0
    },
    targetPosition: {
      config: 0
    },
    positionAbsoluteX: {
      config: 0
    },
    positionAbsoluteY: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    parentId: {
      config: 0
    },
    zIndex: {
      config: 0
    },
    store: {
      config: 0
    },
    flowId: {
      config: 0
    }
  }
});
const __lwc_component_class_internal$5 = registerComponent(FlowDefaultNode, {
  tmpl: _tmpl$4,
  sel: "c-flow-default-node",
  apiVersion: 66
});

function stylesheet$2(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".flow__node-label" + shadowSelector + " {pointer-events: none;user-select: none;}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$2 = [stylesheet$2];

const $fragment1$2 = parseFragment`<span class="flow__node-label${0}"${2}>${"t1"}</span>`;
function tmpl$3($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, c: api_custom_element, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment} = $api;
  const {_m0} = $ctx;
  return [api_custom_element("c-flow-handle", __lwc_component_class_internal$7, {
    props: {
      "type": "target",
      "position": $cmp.targetPosition,
      "store": $cmp.store,
      "nodeId": $cmp.id,
      "flowId": $cmp.flowId,
      "isConnectable": $cmp.isConnectable
    },
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  }), api_static_fragment($fragment1$2, 2, [api_static_part(1, null, api_dynamic_text($cmp.label))])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$3 = registerTemplate(tmpl$3);
tmpl$3.renderMode = "light";
tmpl$3.stylesheets = [];
tmpl$3.stylesheetToken = "lwc-9hfrah7aot";
tmpl$3.legacyStylesheetToken = "lwc-flowOutputNode_flowOutputNode";
if (_implicitStylesheets$2) {
  tmpl$3.stylesheets.push.apply(tmpl$3.stylesheets, _implicitStylesheets$2);
}
freezeTemplate(tmpl$3);

class FlowOutputNode extends LightningElement {
  constructor(...args) {
    super(...args);
    this.id = void 0;
    this.data = void 0;
    this.type = void 0;
    this.selected = void 0;
    this.dragging = void 0;
    this.draggable = void 0;
    this.selectable = void 0;
    this.connectable = void 0;
    this.deletable = void 0;
    this.isConnectable = void 0;
    this.sourcePosition = void 0;
    this.targetPosition = void 0;
    this.positionAbsoluteX = void 0;
    this.positionAbsoluteY = void 0;
    this.width = void 0;
    this.height = void 0;
    this.parentId = void 0;
    this.zIndex = void 0;
    this.store = void 0;
    this.flowId = void 0;
  }
  get label() {
    return this.data?.label;
  }

  /** A handle only reports the press; the gesture owner lives further up the tree. */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', {
      detail: event.detail
    }));
  }
  /*LWC compiler v9.4.3*/
}
FlowOutputNode.renderMode = 'light';
registerDecorators(FlowOutputNode, {
  publicProps: {
    id: {
      config: 0
    },
    data: {
      config: 0
    },
    type: {
      config: 0
    },
    selected: {
      config: 0
    },
    dragging: {
      config: 0
    },
    draggable: {
      config: 0
    },
    selectable: {
      config: 0
    },
    connectable: {
      config: 0
    },
    deletable: {
      config: 0
    },
    isConnectable: {
      config: 0
    },
    sourcePosition: {
      config: 0
    },
    targetPosition: {
      config: 0
    },
    positionAbsoluteX: {
      config: 0
    },
    positionAbsoluteY: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    parentId: {
      config: 0
    },
    zIndex: {
      config: 0
    },
    store: {
      config: 0
    },
    flowId: {
      config: 0
    }
  }
});
const __lwc_component_class_internal$4 = registerComponent(FlowOutputNode, {
  tmpl: _tmpl$3,
  sel: "c-flow-output-node",
  apiVersion: 66
});

function stylesheet$1(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".flow__node-group" + shadowSelector + " {background-color: var(--flow-node-group-background, rgba(240, 240, 240, 0.25));}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets$1 = [stylesheet$1];

const stc0$2 = [];
function tmpl$2($api, $cmp, $slotset, $ctx) {
  return stc0$2;
  /*LWC compiler v9.4.3*/
}
var _tmpl$2 = registerTemplate(tmpl$2);
tmpl$2.renderMode = "light";
tmpl$2.stylesheets = [];
tmpl$2.stylesheetToken = "lwc-as946s7mao";
tmpl$2.legacyStylesheetToken = "lwc-flowGroupNode_flowGroupNode";
if (_implicitStylesheets$1) {
  tmpl$2.stylesheets.push.apply(tmpl$2.stylesheets, _implicitStylesheets$1);
}
freezeTemplate(tmpl$2);

class FlowGroupNode extends LightningElement {
  constructor(...args) {
    super(...args);
    this.id = void 0;
    this.data = void 0;
    this.type = void 0;
    this.selected = void 0;
    this.dragging = void 0;
    this.draggable = void 0;
    this.selectable = void 0;
    this.connectable = void 0;
    this.deletable = void 0;
    this.isConnectable = void 0;
    this.sourcePosition = void 0;
    this.targetPosition = void 0;
    this.positionAbsoluteX = void 0;
    this.positionAbsoluteY = void 0;
    this.width = void 0;
    this.height = void 0;
    this.parentId = void 0;
    this.zIndex = void 0;
    this.store = void 0;
    this.flowId = void 0;
  }
  /*LWC compiler v9.4.3*/
}
FlowGroupNode.renderMode = 'light';
registerDecorators(FlowGroupNode, {
  publicProps: {
    id: {
      config: 0
    },
    data: {
      config: 0
    },
    type: {
      config: 0
    },
    selected: {
      config: 0
    },
    dragging: {
      config: 0
    },
    draggable: {
      config: 0
    },
    selectable: {
      config: 0
    },
    connectable: {
      config: 0
    },
    deletable: {
      config: 0
    },
    isConnectable: {
      config: 0
    },
    sourcePosition: {
      config: 0
    },
    targetPosition: {
      config: 0
    },
    positionAbsoluteX: {
      config: 0
    },
    positionAbsoluteY: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    parentId: {
      config: 0
    },
    zIndex: {
      config: 0
    },
    store: {
      config: 0
    },
    flowId: {
      config: 0
    }
  }
});
const __lwc_component_class_internal$3 = registerComponent(FlowGroupNode, {
  tmpl: _tmpl$2,
  sel: "c-flow-group-node",
  apiVersion: 66
});

/**
 * Node-type registry.
 *
 * Ports upstream's `builtinNodeTypes` (`@xyflow/react/src/container/NodeRenderer/utils.ts`), where
 * the four shipped node components are merged under the consumer's `nodeTypes` before the renderer
 * looks a type up. Unlike an edge type, a node type *is* a component: the node wrapper instantiates
 * it with `lwc:is`, so this module maps a type name to a constructor.
 *
 * Merging happens here rather than in the store so the store stays a plain mirror of the flow's
 * props, and so a consumer's `default` entry still wins - exactly upstream's precedence.
 */


/** The four node types lwc-flow ships, keyed by the name a node's `type` field uses. */
const builtinNodeTypes = Object.freeze({
  input: __lwc_component_class_internal$6,
  default: __lwc_component_class_internal$5,
  output: __lwc_component_class_internal$4,
  group: __lwc_component_class_internal$3
});

/**
 * The registry the node wrapper resolves against: the built-ins, overridden by the consumer's.
 * @param {Record<string, Function>} [nodeTypes] the flow's `nodeTypes` prop
 * @returns {Record<string, Function>} every type name the flow can render
 */
function resolveNodeTypes(nodeTypes) {
  return nodeTypes ? {
    ...builtinNodeTypes,
    ...nodeTypes
  } : builtinNodeTypes;
}

function _classPrivateFieldLooseBase(e, t) { if (!{}.hasOwnProperty.call(e, t)) throw new TypeError("attempted to use private field on non-instance"); return e; }
var id = 0;
function _classPrivateFieldLooseKey(e) { return "__private_" + id++ + "_" + e; }

/** Flow units an arrow key moves a node when snapping is off, from upstream. */
const ARROW_KEY_STEP = 5;

/**
 * Coerce an attribute-or-property value to a boolean, keeping `fallback` when
 * nothing was supplied.
 *
 * A declarative attribute always arrives as a string, so `"false"` has to be
 * treated as false; an empty string means the attribute was present with no
 * value, which HTML defines as true.
 * @param {*} value
 * @param {boolean} fallback
 * @returns {boolean}
 */
function toBool(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'string') {
    return value !== 'false';
  }
  return Boolean(value);
}

/**
 * `c-flow` - the root of a flow.
 *
 * Owns the store, creates the pan/zoom controller, and exposes the public
 * instance API. Everything below it receives the store as `@api store`; see
 * `docs/ARCHITECTURE.md` decision 2 for why that is the LWC substitute for
 * React context.
 *
 * ## Controlled by default
 *
 * Like xyflow, this component does not own the graph. `nodes` and `edges` come
 * in as properties and every mutation leaves as an `onnodeschange` /
 * `onedgeschange` event carrying a change array, which the consumer folds back
 * in with `applyNodeChanges` / `applyEdgeChanges`. That is what makes undo,
 * validation and server persistence possible without the flow knowing about
 * any of them.
 */
var _nodes = /*#__PURE__*/_classPrivateFieldLooseKey("nodes");
var _edges = /*#__PURE__*/_classPrivateFieldLooseKey("edges");
var _store = /*#__PURE__*/_classPrivateFieldLooseKey("store");
var _panZoom = /*#__PURE__*/_classPrivateFieldLooseKey("panZoom");
var _flowId = /*#__PURE__*/_classPrivateFieldLooseKey("flowId");
var _resizeObserver = /*#__PURE__*/_classPrivateFieldLooseKey("resizeObserver");
var _fitViewDone = /*#__PURE__*/_classPrivateFieldLooseKey("fitViewDone");
var _initialised = /*#__PURE__*/_classPrivateFieldLooseKey("initialised");
var _unsubscribers = /*#__PURE__*/_classPrivateFieldLooseKey("unsubscribers");
var _keyListeners = /*#__PURE__*/_classPrivateFieldLooseKey("keyListeners");
var _selectionOrigin = /*#__PURE__*/_classPrivateFieldLooseKey("selectionOrigin");
var _selectionPointerId = /*#__PURE__*/_classPrivateFieldLooseKey("selectionPointerId");
var _connect = /*#__PURE__*/_classPrivateFieldLooseKey("connect");
class Flow extends LightningElement {
  constructor(...args) {
    super(...args);
    // ------------------------------------------------------------------ data
    Object.defineProperty(this, _nodes, {
      writable: true,
      value: []
    });
    Object.defineProperty(this, _edges, {
      writable: true,
      value: []
    });
    /**
     * Type name to LWC constructor, for custom nodes. Merged over the built-in
     * `input`, `default`, `output` and `group` types, so an entry here with one
     * of those names replaces the shipped component.
     */
    this.nodeTypes = void 0;
    /** Type name to `{ getPath, defaults }`, for custom edges. */
    this.edgeTypes = void 0;
    // -------------------------------------------------------------- viewport
    this.minZoom = DEFAULT_MIN_ZOOM;
    this.maxZoom = DEFAULT_MAX_ZOOM;
    this.translateExtent = infiniteExtent;
    this.nodeExtent = infiniteExtent;
    this.nodeOrigin = [0, 0];
    this.defaultViewport = {
      x: 0,
      y: 0,
      zoom: 1
    };
    /** Fit the graph into view once nodes have been measured. */
    this.fitView = false;
    this.fitViewOptions = void 0;
    this.snapToGrid = false;
    this.snapGrid = [15, 15];
    /**
     * Render only nodes and edges intersecting the viewport.
     *
     * Named `renderVisibleOnly` rather than upstream's `onlyRenderVisibleElements`
     * because LWC reserves every public property beginning with `on` for event
     * handlers (LWC1108). The store field keeps the upstream name.
     */
    this.renderVisibleOnly = false;
    // ----------------------------------------------------------- interaction
    /*
     * Booleans whose upstream default is `true` are getter/setter pairs, not
     * plain fields.
     *
     * LWC1099 forbids a public boolean property from defaulting to `true`,
     * because an HTML attribute's presence is what makes it true and its
     * absence must therefore mean false. The validator only rejects a literal
     * `= true` initializer (`isBooleanPropDefaultTrue` tests for a
     * `BooleanLiteral`), so an accessor pair keeps both the upstream name and
     * the upstream default. `_toBool` also accepts the string "false", which is
     * what a declarative `nodes-draggable="false"` attribute actually delivers.
     */
    this._nodesDraggable = true;
    this._nodesConnectable = true;
    this._nodesFocusable = true;
    this._edgesFocusable = true;
    this._elementsSelectable = true;
    this._elevateNodesOnSelect = true;
    this._selectNodesOnDrag = true;
    this._autoPanOnNodeDrag = true;
    this._autoPanOnConnect = true;
    this._zoomOnScroll = true;
    this._zoomOnPinch = true;
    this._zoomOnDoubleClick = true;
    this._preventScrolling = true;
    this._panOnDrag = true;
    this.edgesReconnectable = false;
    this.elevateEdgesOnSelect = false;
    this.zIndexMode = 'basic';
    this.autoPanSpeed = DEFAULT_AUTO_PAN_SPEED;
    this.connectionMode = ConnectionMode.Strict;
    this.connectionRadius = DEFAULT_CONNECTION_RADIUS;
    this.connectionLineType = ConnectionLineType.Bezier;
    this.selectionMode = SelectionMode.Full;
    this.selectionOnDrag = false;
    this.nodeDragThreshold = 1;
    this.connectionDragThreshold = 1;
    this.paneClickDistance = 0;
    this.nodeClickDistance = 0;
    this.isValidConnection = void 0;
    this.panOnScroll = false;
    this.panOnScrollMode = PanOnScrollMode.Free;
    this.panOnScrollSpeed = 0.5;
    this.deleteKeyCode = 'Backspace';
    this.selectionKeyCode = 'Shift';
    this.multiSelectionKeyCode = 'Meta';
    this.panActivationKeyCode = 'Space';
    this.zoomActivationKeyCode = 'Meta';
    this.defaultMarkerStart = void 0;
    this.defaultMarkerEnd = void 0;
    this.ariaLabelConfig = void 0;
    /**
     * Called before a delete; return `false` to veto it.
     *
     * Named `beforeDelete` rather than upstream's `onBeforeDelete` for the same
     * LWC1108 reason as `renderVisibleOnly`.
     */
    this.beforeDelete = void 0;
    /*
     * Built-in addons are booleans rather than slotted children.
     *
     * Upstream composes them as `<Background />` inside `<ReactFlow>`, which
     * works because React context reaches any descendant. An LWC slot cannot:
     * slotted content is owned and rendered by the CONSUMER, so it has no way to
     * receive the store instance. Exposing flags keeps the addons wired while
     * `<slot>` stays available for arbitrary consumer overlays.
     */
    this.showBackground = false;
    this.showControls = false;
    this.showMinimap = false;
    // ------------------------------------------------------------- internals
    Object.defineProperty(this, _store, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _panZoom, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _flowId, {
      writable: true,
      value: `flow-${Math.random().toString(36).slice(2, 10)}`
    });
    Object.defineProperty(this, _resizeObserver, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _fitViewDone, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _initialised, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, _unsubscribers, {
      writable: true,
      value: []
    });
    this._viewportStyle = 'transform: translate(0px, 0px) scale(1);';
    Object.defineProperty(this, _keyListeners, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _selectionOrigin, {
      writable: true,
      value: null
    });
    Object.defineProperty(this, _selectionPointerId, {
      writable: true,
      value: null
    });
    /** @type {import('c/flowConnect').Connect|null} the live connection gesture */
    Object.defineProperty(this, _connect, {
      writable: true,
      value: null
    });
  }
  /**
   * The nodes to render. Parents must precede their children.
   * @type {Array<import('c/flowTypes').FlowNode>}
   */
  get nodes() {
    return _classPrivateFieldLooseBase(this, _nodes)[_nodes];
  }
  set nodes(value) {
    // Normalise on the way in; the owner's array is never mutated.
    _classPrivateFieldLooseBase(this, _nodes)[_nodes] = Array.isArray(value) ? value : [];
    _classPrivateFieldLooseBase(this, _store)[_store]?.setNodes(_classPrivateFieldLooseBase(this, _nodes)[_nodes]);
  }

  /**
   * The edges to render.
   * @type {Array<import('c/flowTypes').FlowEdge>}
   */
  get edges() {
    return _classPrivateFieldLooseBase(this, _edges)[_edges];
  }
  set edges(value) {
    _classPrivateFieldLooseBase(this, _edges)[_edges] = Array.isArray(value) ? value : [];
    _classPrivateFieldLooseBase(this, _store)[_store]?.setEdges(_classPrivateFieldLooseBase(this, _edges)[_edges]);
  }
  /** Nodes may be dragged. @type {boolean} @default true */
  get nodesDraggable() {
    return this._nodesDraggable;
  }
  set nodesDraggable(value) {
    this._nodesDraggable = toBool(value, true);
  }
  /** Handles may start a connection. @type {boolean} @default true */
  get nodesConnectable() {
    return this._nodesConnectable;
  }
  set nodesConnectable(value) {
    this._nodesConnectable = toBool(value, true);
  }
  /** Nodes take keyboard focus. @type {boolean} @default true */
  get nodesFocusable() {
    return this._nodesFocusable;
  }
  set nodesFocusable(value) {
    this._nodesFocusable = toBool(value, true);
  }
  /** Edges take keyboard focus. @type {boolean} @default true */
  get edgesFocusable() {
    return this._edgesFocusable;
  }
  set edgesFocusable(value) {
    this._edgesFocusable = toBool(value, true);
  }
  /** Nodes and edges may be selected. @type {boolean} @default true */
  get elementsSelectable() {
    return this._elementsSelectable;
  }
  set elementsSelectable(value) {
    this._elementsSelectable = toBool(value, true);
  }
  /** A selected node rises above its peers. @type {boolean} @default true */
  get elevateNodesOnSelect() {
    return this._elevateNodesOnSelect;
  }
  set elevateNodesOnSelect(value) {
    this._elevateNodesOnSelect = toBool(value, true);
  }
  /** Pressing a node selects it before the drag begins. @type {boolean} @default true */
  get selectNodesOnDrag() {
    return this._selectNodesOnDrag;
  }
  set selectNodesOnDrag(value) {
    this._selectNodesOnDrag = toBool(value, true);
  }
  /** The viewport follows a node dragged past the pane edge. @type {boolean} @default true */
  get autoPanOnNodeDrag() {
    return this._autoPanOnNodeDrag;
  }
  set autoPanOnNodeDrag(value) {
    this._autoPanOnNodeDrag = toBool(value, true);
  }
  /** The viewport follows a connection dragged past the pane edge. @type {boolean} @default true */
  get autoPanOnConnect() {
    return this._autoPanOnConnect;
  }
  set autoPanOnConnect(value) {
    this._autoPanOnConnect = toBool(value, true);
  }
  /** The wheel zooms the viewport. @type {boolean} @default true */
  get zoomOnScroll() {
    return this._zoomOnScroll;
  }
  set zoomOnScroll(value) {
    this._zoomOnScroll = toBool(value, true);
  }
  /** A trackpad pinch zooms the viewport. @type {boolean} @default true */
  get zoomOnPinch() {
    return this._zoomOnPinch;
  }
  set zoomOnPinch(value) {
    this._zoomOnPinch = toBool(value, true);
  }
  /** A double click zooms in, shift double click zooms out. @type {boolean} @default true */
  get zoomOnDoubleClick() {
    return this._zoomOnDoubleClick;
  }
  set zoomOnDoubleClick(value) {
    this._zoomOnDoubleClick = toBool(value, true);
  }
  /** The wheel is consumed by the flow instead of scrolling the page. @type {boolean} @default true */
  get preventScrolling() {
    return this._preventScrolling;
  }
  set preventScrolling(value) {
    this._preventScrolling = toBool(value, true);
  }
  /**
   * Whether dragging the pane pans the viewport.
   *
   * Accepts `true`, `false`, or an array of mouse button numbers to restrict
   * panning to those buttons, so it is not passed through {@link toBool}.
   * @type {boolean|Array<number>}
   * @default true
   */
  get panOnDrag() {
    return this._panOnDrag;
  }
  set panOnDrag(value) {
    this._panOnDrag = Array.isArray(value) ? value : toBool(value, true);
  }
  /**
   * CSS transform for the viewport layer.
   *
   * Written as a style string rather than through a direct DOM write so LWC
   * owns the attribute; the value is recomputed only when the transform
   * actually changes, which the store already guarantees.
   */
  get viewportStyle() {
    return this._viewportStyle;
  }
  get hasBackground() {
    return this.showBackground;
  }
  get hasControls() {
    return this.showControls;
  }
  get hasMinimap() {
    return this.showMinimap;
  }

  /** Stable id, used to namespace handle and marker ids across flows. */
  get flowId() {
    return _classPrivateFieldLooseBase(this, _flowId)[_flowId];
  }

  /** The store, exposed so descendants and tests can reach it. */
  get store() {
    return _classPrivateFieldLooseBase(this, _store)[_store];
  }
  connectedCallback() {
    _classPrivateFieldLooseBase(this, _store)[_store] = createFlowStore(this._configFromProps());
    _classPrivateFieldLooseBase(this, _store)[_store].setNodes(_classPrivateFieldLooseBase(this, _nodes)[_nodes]);
    _classPrivateFieldLooseBase(this, _store)[_store].setEdges(_classPrivateFieldLooseBase(this, _edges)[_edges]);

    /*
     * `nodesInitialized` flips once every visible node has been measured.
     * A deferred fitView must wait for that, otherwise it would fit against
     * zero-size nodes and land on a meaningless viewport.
     */
    _classPrivateFieldLooseBase(this, _unsubscribers)[_unsubscribers].push(_classPrivateFieldLooseBase(this, _store)[_store].subscribe(s => s.nodesInitialized, initialized => {
      if (initialized) {
        this._tryDeferredFitView();
        this.dispatchEvent(new CustomEvent('nodesinitialized'));
      }
    }), _classPrivateFieldLooseBase(this, _store)[_store].subscribe(s => s.transform, ([x, y, k]) => {
      this._viewportStyle = `transform: translate(${x}px, ${y}px) scale(${k});`;
    }, {
      compare: shallowArrayEqual
    }));
  }
  renderedCallback() {
    if (_classPrivateFieldLooseBase(this, _initialised)[_initialised]) {
      // Props may have changed; push them down without rebuilding anything.
      _classPrivateFieldLooseBase(this, _store)[_store].update(this._configFromProps());
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
      this._tryDeferredFitView();
      return;
    }
    _classPrivateFieldLooseBase(this, _initialised)[_initialised] = true;
    const pane = this.refs.pane;
    if (!pane) {
      return;
    }
    _classPrivateFieldLooseBase(this, _store)[_store].update({
      domNode: pane
    });
    this._measurePane(pane);
    _classPrivateFieldLooseBase(this, _panZoom)[_panZoom] = createPanZoom({
      domNode: pane,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      viewport: this.defaultViewport,
      onTransformChange: transform => _classPrivateFieldLooseBase(this, _store)[_store].setTransform(transform),
      onPanZoomStart: (event, viewport) => this.dispatchEvent(new CustomEvent('movestart', {
        detail: {
          viewport
        }
      })),
      onPanZoom: (event, viewport) => this.dispatchEvent(new CustomEvent('move', {
        detail: {
          viewport
        }
      })),
      onPanZoomEnd: (event, viewport) => this.dispatchEvent(new CustomEvent('moveend', {
        detail: {
          viewport
        }
      })),
      onDraggingChange: dragging => _classPrivateFieldLooseBase(this, _store)[_store].update({
        paneDragging: dragging
      })
    });
    _classPrivateFieldLooseBase(this, _panZoom)[_panZoom].update(this._panZoomOptions());
    _classPrivateFieldLooseBase(this, _store)[_store].update({
      panZoom: _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]
    });

    /*
     * The pane size feeds culling, fitView and auto-pan. A ResizeObserver
     * rather than a window listener, because a Lightning page can resize the
     * component without the window changing at all.
     */
    if (typeof ResizeObserver !== 'undefined') {
      _classPrivateFieldLooseBase(this, _resizeObserver)[_resizeObserver] = new ResizeObserver(() => this._measurePane(pane));
      _classPrivateFieldLooseBase(this, _resizeObserver)[_resizeObserver].observe(pane);
    }
    this._attachKeyHandlers();
    this.dispatchEvent(new CustomEvent('init', {
      detail: {
        flowId: _classPrivateFieldLooseBase(this, _flowId)[_flowId]
      }
    }));
    this._tryDeferredFitView();
  }

  /**
   * Run a pending `fitView` as soon as everything it needs exists.
   *
   * Both halves of the condition arrive out of order: a node measures itself in
   * its own `renderedCallback`, which LWC runs before this component's, so
   * `nodesInitialized` can flip while the pane is still unmeasured and the
   * pan/zoom controller unborn. Hence the attempt is made from both places and
   * is only marked done once it can actually land - the earlier version armed
   * the flag on the first, doomed attempt and the flow never fitted at all.
   */
  _tryDeferredFitView() {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    if (_classPrivateFieldLooseBase(this, _fitViewDone)[_fitViewDone] || !this.fitView || !_classPrivateFieldLooseBase(this, _panZoom)[_panZoom] || !s.nodesInitialized || !s.width || !s.height) {
      return;
    }
    _classPrivateFieldLooseBase(this, _fitViewDone)[_fitViewDone] = true;
    this.fitViewport(this.fitViewOptions);
  }

  /**
   * Attach the document-level key listener.
   *
   * Document level, not pane level: Delete must work while a node has focus,
   * and a node lives in a descendant's shadow root, so a pane listener would
   * only see the retargeted event. The handler ignores keys originating in a
   * text field via `isInputDOMNode`.
   */
  _attachKeyHandlers() {
    _classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners] = {
      keydown: e => this._handleKeyDown(e),
      keyup: e => this._handleKeyUp(e)
    };
    document.addEventListener('keydown', _classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners].keydown);
    document.addEventListener('keyup', _classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners].keyup);
  }
  _detachKeyHandlers() {
    if (!_classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners]) {
      return;
    }
    document.removeEventListener('keydown', _classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners].keydown);
    document.removeEventListener('keyup', _classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners].keyup);
    _classPrivateFieldLooseBase(this, _keyListeners)[_keyListeners] = null;
  }

  /** True when `event` matches a configured key code, which may be a list. */
  _matchesKey(event, code) {
    if (!code) {
      return false;
    }
    const codes = Array.isArray(code) ? code : [code];
    return codes.some(c => event.key === c || event.code === c);
  }
  _handleKeyDown(event) {
    if (isInputDOMNode(event)) {
      return;
    }
    if (this._matchesKey(event, this.deleteKeyCode)) {
      const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
      this.deleteElements({
        nodes: Array.from(s.nodeLookup.values()).filter(n => n.selected),
        edges: s.edges.filter(e => e.selected)
      });
      return;
    }
    if (this._matchesKey(event, this.selectionKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        selectionKeyPressed: true
      });
    }
    if (this._matchesKey(event, this.multiSelectionKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        multiSelectionActive: true,
        multiSelectionKeyPressed: true
      });
    }
    if (this._matchesKey(event, this.panActivationKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        panActivationKeyPressed: true
      });
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
    }
    if (this._matchesKey(event, this.zoomActivationKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        zoomActivationKeyPressed: true
      });
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
    }
  }
  _handleKeyUp(event) {
    if (this._matchesKey(event, this.selectionKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        selectionKeyPressed: false
      });
    }
    if (this._matchesKey(event, this.multiSelectionKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        multiSelectionActive: false,
        multiSelectionKeyPressed: false
      });
    }
    if (this._matchesKey(event, this.panActivationKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        panActivationKeyPressed: false
      });
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
    }
    if (this._matchesKey(event, this.zoomActivationKeyCode)) {
      _classPrivateFieldLooseBase(this, _store)[_store].update({
        zoomActivationKeyPressed: false
      });
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
    }
  }

  // ------------------------------------------------------------- marquee

  /**
   * Start a marquee selection.
   *
   * Only when the selection key is held, or `selectionOnDrag` is on and the
   * gesture began on the pane itself rather than on a node. Pan/zoom is
   * suppressed for the duration by the `userSelectionActive` flag, which its
   * event filter already honours.
   */
  handlePanePointerDown(event) {
    /*
     * A press on a handle arms the connection gesture before this runs: the
     * handle's own listener fires first and its `connectstart` reaches this
     * component synchronously. The pane press is what supplies the pointer, so
     * the gesture is anchored here and the pointer captured, which keeps the
     * moves coming once the cursor leaves the handle.
     */
    if (_classPrivateFieldLooseBase(this, _connect)[_connect]?.isPending) {
      _classPrivateFieldLooseBase(this, _connect)[_connect].press(event);
      this.refs.pane.setPointerCapture?.(event.pointerId);
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
      return;
    }
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const startsSelection = s.selectionKeyPressed || this.selectionOnDrag && event.target === this.refs.pane;
    if (!startsSelection || !s.elementsSelectable || event.button !== 0) {
      return;
    }
    const rect = this.refs.pane.getBoundingClientRect();
    _classPrivateFieldLooseBase(this, _selectionOrigin)[_selectionOrigin] = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    _classPrivateFieldLooseBase(this, _selectionPointerId)[_selectionPointerId] = event.pointerId;
    this.refs.pane.setPointerCapture?.(event.pointerId);
    _classPrivateFieldLooseBase(this, _store)[_store].update({
      userSelectionActive: true,
      userSelectionRect: {
        ..._classPrivateFieldLooseBase(this, _selectionOrigin)[_selectionOrigin],
        width: 0,
        height: 0
      }
    });
    _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
  }
  handlePanePointerMove(event) {
    if (_classPrivateFieldLooseBase(this, _connect)[_connect]?.isPending) {
      _classPrivateFieldLooseBase(this, _connect)[_connect].move(event);
      return;
    }
    if (_classPrivateFieldLooseBase(this, _selectionPointerId)[_selectionPointerId] !== event.pointerId || !_classPrivateFieldLooseBase(this, _selectionOrigin)[_selectionOrigin]) {
      return;
    }
    const rect = this.refs.pane.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const origin = _classPrivateFieldLooseBase(this, _selectionOrigin)[_selectionOrigin];

    // Normalise so dragging up or left still yields a positive-size rect.
    const selectionRect = {
      x: Math.min(origin.x, x),
      y: Math.min(origin.y, y),
      width: Math.abs(x - origin.x),
      height: Math.abs(y - origin.y)
    };
    _classPrivateFieldLooseBase(this, _store)[_store].update({
      userSelectionRect: selectionRect
    });
    const nodeIds = _classPrivateFieldLooseBase(this, _store)[_store].getNodeIdsInRect(selectionRect);
    const {
      nodeChanges
    } = _classPrivateFieldLooseBase(this, _store)[_store].getSelectionChangesFor(nodeIds, []);
    this._emitNodeChanges(nodeChanges);
  }
  handlePanePointerUp(event) {
    if (_classPrivateFieldLooseBase(this, _connect)[_connect]?.isPending) {
      this.refs.pane.releasePointerCapture?.(event.pointerId);
      const connection = _classPrivateFieldLooseBase(this, _connect)[_connect].end(event);
      _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
      if (connection) {
        this.dispatchEvent(new CustomEvent('connect', {
          detail: connection
        }));
      }
      return;
    }
    if (_classPrivateFieldLooseBase(this, _selectionPointerId)[_selectionPointerId] !== event.pointerId) {
      return;
    }
    this.refs.pane.releasePointerCapture?.(event.pointerId);
    _classPrivateFieldLooseBase(this, _selectionPointerId)[_selectionPointerId] = null;
    _classPrivateFieldLooseBase(this, _selectionOrigin)[_selectionOrigin] = null;
    _classPrivateFieldLooseBase(this, _store)[_store].update({
      userSelectionActive: false,
      userSelectionRect: null
    });
    _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.update(this._panZoomOptions());
  }

  /**
   * A click on empty pane clears the selection.
   *
   * Skipped when a marquee just ran, otherwise finishing a marquee would
   * immediately deselect everything it had just selected.
   */
  handlePaneClick(event) {
    if (event.target !== this.refs.pane || _classPrivateFieldLooseBase(this, _store)[_store].state.userSelectionActive) {
      return;
    }
    const {
      nodeChanges,
      edgeChanges
    } = _classPrivateFieldLooseBase(this, _store)[_store].getSelectionChangesFor([], []);
    this._emitNodeChanges(nodeChanges);
    this._emitEdgeChanges(edgeChanges);
    this.dispatchEvent(new CustomEvent('paneclick'));
  }
  handlePaneContextMenu(event) {
    if (event.target === this.refs.pane) {
      this.dispatchEvent(new CustomEvent('panecontextmenu'));
    }
  }
  disconnectedCallback() {
    for (const unsubscribe of _classPrivateFieldLooseBase(this, _unsubscribers)[_unsubscribers]) {
      unsubscribe();
    }
    _classPrivateFieldLooseBase(this, _unsubscribers)[_unsubscribers] = [];
    this._detachKeyHandlers();
    _classPrivateFieldLooseBase(this, _resizeObserver)[_resizeObserver]?.disconnect();
    _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.destroy();
    _classPrivateFieldLooseBase(this, _store)[_store]?.destroy();
    _classPrivateFieldLooseBase(this, _panZoom)[_panZoom] = null;
    _classPrivateFieldLooseBase(this, _initialised)[_initialised] = false;
  }
  _measurePane(pane) {
    const rect = pane.getBoundingClientRect();
    _classPrivateFieldLooseBase(this, _store)[_store].setDimensions(rect.width, rect.height);
  }

  /** Every prop the store mirrors, in one object. */
  _configFromProps() {
    return {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      nodeExtent: this.nodeExtent,
      nodeOrigin: this.nodeOrigin,
      snapToGrid: this.snapToGrid,
      snapGrid: this.snapGrid,
      onlyRenderVisibleElements: this.renderVisibleOnly,
      nodesDraggable: this.nodesDraggable,
      nodesConnectable: this.nodesConnectable,
      nodesFocusable: this.nodesFocusable,
      edgesFocusable: this.edgesFocusable,
      edgesReconnectable: this.edgesReconnectable,
      elementsSelectable: this.elementsSelectable,
      elevateNodesOnSelect: this.elevateNodesOnSelect,
      elevateEdgesOnSelect: this.elevateEdgesOnSelect,
      zIndexMode: this.zIndexMode,
      selectNodesOnDrag: this.selectNodesOnDrag,
      autoPanOnNodeDrag: this.autoPanOnNodeDrag,
      autoPanOnConnect: this.autoPanOnConnect,
      autoPanSpeed: this.autoPanSpeed,
      connectionMode: this.connectionMode,
      connectionRadius: this.connectionRadius,
      selectionMode: this.selectionMode,
      nodeDragThreshold: this.nodeDragThreshold,
      connectionDragThreshold: this.connectionDragThreshold,
      paneClickDistance: this.paneClickDistance,
      nodeClickDistance: this.nodeClickDistance,
      nodeTypes: resolveNodeTypes(this.nodeTypes),
      edgeTypes: this.edgeTypes ?? {},
      ariaLabelConfig: mergeAriaLabelConfig(this.ariaLabelConfig),
      onError: (id, message) => this.dispatchEvent(new CustomEvent('flowerror', {
        detail: {
          id,
          message
        }
      }))
    };
  }
  _panZoomOptions() {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    return {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      translateExtent: this.translateExtent,
      panOnDrag: this.panOnDrag,
      panOnScroll: this.panOnScroll,
      panOnScrollMode: this.panOnScrollMode,
      panOnScrollSpeed: this.panOnScrollSpeed,
      zoomOnScroll: this.zoomOnScroll,
      zoomOnPinch: this.zoomOnPinch,
      zoomOnDoubleClick: this.zoomOnDoubleClick,
      preventScrolling: this.preventScrolling,
      paneClickDistance: this.paneClickDistance,
      selectionOnDrag: this.selectionOnDrag,
      userSelectionActive: s.userSelectionActive,
      connectionInProgress: !!s.connection?.inProgress,
      panActivationKeyPressed: s.panActivationKeyPressed,
      zoomActivationKeyPressed: s.zoomActivationKeyPressed
    };
  }

  // ------------------------------------------------------- change plumbing

  /** Emit node changes. The consumer folds them back with `applyNodeChanges`. */
  _emitNodeChanges(changes) {
    if (changes.length) {
      this.dispatchEvent(new CustomEvent('nodeschange', {
        detail: {
          changes
        }
      }));
    }
  }

  /** Emit edge changes. The consumer folds them back with `applyEdgeChanges`. */
  _emitEdgeChanges(changes) {
    if (changes.length) {
      this.dispatchEvent(new CustomEvent('edgeschange', {
        detail: {
          changes
        }
      }));
    }
  }
  handleNodesChange(event) {
    this._emitNodeChanges(event.detail.changes);
  }

  /**
   * A node reported its measured box and handle positions.
   *
   * Only the wrapper can read those - the node lives in a descendant's shadow
   * root - so the measurement arrives as an event and is applied here, which is
   * what `nodesInitialized`, edge endpoints and `fitView` all wait for.
   *
   * The measurement also leaves as a `dimensions` change, upstream's
   * behaviour: a consumer that persists the graph gets the measured size, and
   * one that ignores the change loses nothing, because the internal node
   * already has it.
   */
  handleNodeMeasured(event) {
    const {
      id,
      dimensions,
      handleBounds
    } = event.detail;
    if (!_classPrivateFieldLooseBase(this, _store)[_store].applyNodeMeasurement(id, dimensions, handleBounds)) {
      return;
    }
    this._emitNodeChanges([{
      id,
      type: 'dimensions',
      dimensions
    }]);
  }

  /**
   * A click on a node selects it.
   *
   * The wrapper decides only *whether* a click should select - that depends on
   * `selectNodesOnDrag` and the drag threshold, which it already knows - and
   * the selection itself is applied here, because only this component can emit
   * the changes the consumer folds back in. The event is forwarded either way:
   * a click that changes no selection is still a click.
   */
  handleNodeClick(event) {
    const {
      id,
      select,
      unselect
    } = event.detail;
    if (select || unselect) {
      this._emitClickSelection('node', id, unselect);
    }
    this.dispatchEvent(new CustomEvent('nodeclick', {
      detail: {
        id
      }
    }));
  }

  /** A click on an edge selects it, on the same terms as a node click. */
  handleEdgeClick(event) {
    const {
      id
    } = event.detail;
    const edge = _classPrivateFieldLooseBase(this, _store)[_store].state.edgeLookup.get(id);
    if (edge?.selectable ?? this.elementsSelectable) {
      this._emitClickSelection('edge', id, false);
    }
    this.dispatchEvent(new CustomEvent('edgeclick', {
      detail: {
        id
      }
    }));
  }

  /**
   * Select exactly one element, or add to the selection while the
   * multi-selection key is held - upstream's `handleNodeClick` precedence.
   */
  _emitClickSelection(kind, id, unselect) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    if (!s.elementsSelectable) {
      return;
    }
    const additive = s.multiSelectionKeyPressed;
    const nodeIds = additive ? _classPrivateFieldLooseBase(this, _store)[_store].getSelectedNodeIds() : new Set();
    const edgeIds = additive ? _classPrivateFieldLooseBase(this, _store)[_store].getSelectedEdgeIds() : new Set();
    const ids = kind === 'node' ? nodeIds : edgeIds;
    if (unselect) {
      ids.delete(id);
    } else {
      ids.add(id);
    }
    const {
      nodeChanges,
      edgeChanges
    } = _classPrivateFieldLooseBase(this, _store)[_store].getSelectionChangesFor(nodeIds, edgeIds);
    this._emitNodeChanges(nodeChanges);
    this._emitEdgeChanges(edgeChanges);
  }

  /**
   * A drag produced new positions.
   *
   * The drag kernel computes them against copies and never touches the node
   * array, so the move only becomes real once these changes are folded back in
   * - that is the whole controlled contract. The gesture event is forwarded
   * too, for consumers that watch the gesture rather than the graph.
   */
  handleNodeDrag(event) {
    this._emitNodeChanges(event.detail.changes ?? []);
    this.handleForward(event);
  }

  /**
   * Arrow-key movement.
   *
   * The wrapper reports a direction and the shift multiplier; the step size is
   * the flow's, so it lives here: upstream's `moveSelectedNodes` moves by the
   * snap grid when snapping is on and by 5px when it is not.
   */
  handleNodeMove(event) {
    const {
      dx,
      dy
    } = event.detail;
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const stepX = dx * (s.snapToGrid ? s.snapGrid[0] : ARROW_KEY_STEP);
    const stepY = dy * (s.snapToGrid ? s.snapGrid[1] : ARROW_KEY_STEP);
    const changes = [];
    for (const [id, node] of s.nodeLookup) {
      if (!node.selected || !(node.draggable ?? s.nodesDraggable)) {
        continue;
      }
      const {
        position
      } = calculateNodePosition({
        nodeId: id,
        nextPosition: {
          x: node.internals.positionAbsolute.x + stepX,
          y: node.internals.positionAbsolute.y + stepY
        },
        nodeLookup: s.nodeLookup,
        nodeOrigin: s.nodeOrigin,
        nodeExtent: s.nodeExtent,
        onError: s.onError
      });
      changes.push({
        id,
        type: 'position',
        position,
        dragging: false
      });
    }
    this._emitNodeChanges(changes);
  }

  /**
   * A handle was pressed: arm the connection gesture.
   *
   * The gesture object is created once and reused, because it holds no state
   * between gestures and creating it needs the store, which exists from
   * `connectedCallback` on. `connectstart` leaves for the consumer only once
   * the drag actually begins, which is where upstream fires `onConnectStart`.
   */
  handleConnectStart(event) {
    _classPrivateFieldLooseBase(this, _connect)[_connect] ??= createConnect({
      store: _classPrivateFieldLooseBase(this, _store)[_store],
      flowId: _classPrivateFieldLooseBase(this, _flowId)[_flowId],
      isValidConnection: connection => this.isValidConnection?.(connection) ?? true,
      onStart: from => this.dispatchEvent(new CustomEvent('connectstart', {
        detail: from
      })),
      onEnd: (connection, isValid) => this.dispatchEvent(new CustomEvent('connectend', {
        detail: {
          connection,
          isValid
        }
      }))
    });
    _classPrivateFieldLooseBase(this, _connect)[_connect].start(event.detail);
  }
  handleEdgesChange(event) {
    this._emitEdgeChanges(event.detail.changes);
  }
  handleConnect(event) {
    this.dispatchEvent(new CustomEvent('connect', {
      detail: event.detail
    }));
  }

  /** Re-dispatch a child event under the same name, unchanged. */
  handleForward(event) {
    this.dispatchEvent(new CustomEvent(event.type, {
      detail: event.detail
    }));
  }
  handleFitView(event) {
    this.fitViewport(event.detail?.fitViewOptions ?? this.fitViewOptions);
  }

  // ------------------------------------------------------- public instance

  /** @returns {Array<*>} the current node array */
  getNodes() {
    return _classPrivateFieldLooseBase(this, _nodes)[_nodes];
  }

  /** @returns {Array<*>} the current edge array */
  getEdges() {
    return _classPrivateFieldLooseBase(this, _edges)[_edges];
  }

  /** @param {string} id @returns {*|undefined} */
  getNode(id) {
    return _classPrivateFieldLooseBase(this, _store)[_store].state.nodeLookup.get(id)?.internals.userNode;
  }

  /** @param {string} id @returns {*|undefined} the adopted node, with `internals` */
  getInternalNode(id) {
    return _classPrivateFieldLooseBase(this, _store)[_store].state.nodeLookup.get(id);
  }

  /** @param {string} id @returns {*|undefined} */
  getEdge(id) {
    return _classPrivateFieldLooseBase(this, _store)[_store].state.edgeLookup.get(id);
  }

  /**
   * Serialise the flow.
   * @returns {{nodes: Array<*>, edges: Array<*>, viewport: import('c/flowTypes').Viewport}}
   */
  toObject() {
    return {
      nodes: _classPrivateFieldLooseBase(this, _nodes)[_nodes].map(node => ({
        ...node
      })),
      edges: _classPrivateFieldLooseBase(this, _edges)[_edges].map(edge => ({
        ...edge
      })),
      viewport: _classPrivateFieldLooseBase(this, _store)[_store].getViewport()
    };
  }

  /**
   * Apply node changes to the inbound array and emit the result.
   *
   * A convenience for uncontrolled use: the consumer can bind `nodes` once and
   * let the flow echo the updated array back through `onnodeschange`.
   * @param {Array<*>} changes
   * @returns {Array<*>} the updated array
   */
  applyNodeChanges(changes) {
    return applyNodeChanges(changes, _classPrivateFieldLooseBase(this, _nodes)[_nodes]);
  }

  /**
   * Apply edge changes to the inbound array and return the result.
   * @param {Array<*>} changes
   * @returns {Array<*>}
   */
  applyEdgeChanges(changes) {
    return applyEdgeChanges(changes, _classPrivateFieldLooseBase(this, _edges)[_edges]);
  }

  /**
   * Add an edge for a connection, skipping duplicates.
   * @param {*} connectionOrEdge
   * @returns {Array<*>} the updated edge array
   */
  addEdge(connectionOrEdge) {
    return addEdge(connectionOrEdge, _classPrivateFieldLooseBase(this, _edges)[_edges], {
      onError: _classPrivateFieldLooseBase(this, _store)[_store].state.onError
    });
  }

  /**
   * Repoint an edge at a new connection.
   * @param {*} oldEdge
   * @param {*} newConnection
   * @param {Object} [options]
   * @returns {Array<*>}
   */
  reconnectEdge(oldEdge, newConnection, options) {
    return reconnectEdge(oldEdge, newConnection, _classPrivateFieldLooseBase(this, _edges)[_edges], {
      shouldReplaceId: true,
      onError: _classPrivateFieldLooseBase(this, _store)[_store].state.onError,
      ...options
    });
  }

  /**
   * Delete nodes and edges, cascading to child nodes and connected edges.
   *
   * Emits the changes rather than mutating: the consumer still owns the arrays.
   * `beforeDelete` can veto the whole operation.
   * @param {{nodes?: Array<{id: string}>, edges?: Array<{id: string}>}} params
   * @returns {{nodes: Array<*>, edges: Array<*>}} what was actually removed
   */
  deleteElements({
    nodes = [],
    edges = []
  } = {}) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const nodeIds = new Set(nodes.map(n => n.id));
    const edgeIds = new Set(edges.map(e => e.id));

    // Deleting a parent must delete its subtree, transitively.
    let grew = true;
    while (grew) {
      grew = false;
      for (const [id, node] of s.nodeLookup) {
        if (!nodeIds.has(id) && node.parentId && nodeIds.has(node.parentId)) {
          nodeIds.add(id);
          grew = true;
        }
      }
    }

    // An edge with a deleted endpoint cannot survive.
    for (const edge of s.edges) {
      if (nodeIds.has(edge.source) || nodeIds.has(edge.target)) {
        edgeIds.add(edge.id);
      }
    }
    const removedNodes = _classPrivateFieldLooseBase(this, _nodes)[_nodes].filter(n => nodeIds.has(n.id) && (n.deletable ?? true));
    const removedEdges = _classPrivateFieldLooseBase(this, _edges)[_edges].filter(e => edgeIds.has(e.id) && (e.deletable ?? true));
    if (this.beforeDelete) {
      const permitted = this.beforeDelete({
        nodes: removedNodes,
        edges: removedEdges
      });
      if (permitted === false) {
        return {
          nodes: [],
          edges: []
        };
      }
    }
    this._emitNodeChanges(removedNodes.map(elementToRemoveChange));
    this._emitEdgeChanges(removedEdges.map(elementToRemoveChange));
    return {
      nodes: removedNodes,
      edges: removedEdges
    };
  }

  /**
   * Nodes overlapping a node or rect.
   * @param {*|import('c/flowTypes').Rect} nodeOrRect
   * @param {boolean} [partially=true]
   * @param {Array<*>} [nodesToIntersect]
   * @returns {Array<*>}
   */
  getIntersectingNodes(nodeOrRect, partially = true, nodesToIntersect) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const isRect = !('id' in nodeOrRect);
    const nodeRect = isRect ? nodeOrRect : nodeToRect(s.nodeLookup.get(nodeOrRect.id) ?? nodeOrRect);
    if (!nodeRect) {
      return [];
    }
    const candidates = nodesToIntersect ?? Array.from(s.nodeLookup.values());
    return candidates.filter(n => {
      const internal = s.nodeLookup.get(n.id) ?? n;
      if (!isRect && internal.id === nodeOrRect.id) {
        return false;
      }
      if (!nodeHasDimensions(internal)) {
        return false;
      }
      const currRect = nodeToRect(internal);
      const overlap = getOverlappingArea(currRect, nodeRect);
      return partially ? overlap > 0 : overlap >= nodeRect.width * nodeRect.height;
    });
  }

  /**
   * Whether a node overlaps a rect.
   * @param {*} node
   * @param {import('c/flowTypes').Rect} area
   * @param {boolean} [partially=true]
   * @returns {boolean}
   */
  isNodeIntersecting(node, area, partially = true) {
    const internal = _classPrivateFieldLooseBase(this, _store)[_store].state.nodeLookup.get(node.id) ?? node;
    const rect = nodeToRect(internal);
    const overlap = getOverlappingArea(rect, area);
    return partially ? overlap > 0 : overlap >= area.width * area.height;
  }

  /**
   * Bounding rect of the given nodes, or of all of them.
   * @param {Array<*|string>} [nodes]
   * @returns {import('c/flowTypes').Rect}
   */
  getNodesBounds(nodes) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    if (!nodes) {
      return getInternalNodesBounds(s.nodeLookup);
    }
    return getNodesBounds(nodes, {
      nodeOrigin: s.nodeOrigin,
      nodeLookup: s.nodeLookup
    });
  }

  /**
   * Connections touching a node, or a specific handle.
   * @param {{type?: 'source'|'target', nodeId: string, handleId?: string|null}} params
   * @returns {Array<*>}
   */
  getNodeConnections({
    type,
    nodeId,
    handleId
  }) {
    const key = handleId && type ? `${nodeId}-${type}-${handleId}` : type ? `${nodeId}-${type}` : nodeId;
    const map = _classPrivateFieldLooseBase(this, _store)[_store].state.connectionLookup.get(key);
    return map ? Array.from(map.values()) : [];
  }

  /**
   * Viewport coordinates to flow coordinates.
   * @param {import('c/flowTypes').XYPosition} position client coordinates
   * @param {{snapToGrid?: boolean}} [options]
   * @returns {import('c/flowTypes').XYPosition}
   */
  screenToFlowPosition(position, options = {}) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const pane = s.domNode;
    if (!pane) {
      return position;
    }
    const rect = pane.getBoundingClientRect();
    const snap = options.snapToGrid ?? s.snapToGrid;
    return pointToRendererPoint({
      x: position.x - rect.left,
      y: position.y - rect.top
    }, s.transform, snap, s.snapGrid);
  }

  /**
   * Flow coordinates to viewport coordinates.
   * @param {import('c/flowTypes').XYPosition} position
   * @returns {import('c/flowTypes').XYPosition}
   */
  flowToScreenPosition(position) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const pane = s.domNode;
    const point = rendererPointToPoint(position, s.transform);
    if (!pane) {
      return point;
    }
    const rect = pane.getBoundingClientRect();
    return {
      x: point.x + rect.left,
      y: point.y + rect.top
    };
  }

  /** @returns {import('c/flowTypes').Viewport} */
  getViewport() {
    return _classPrivateFieldLooseBase(this, _store)[_store].getViewport();
  }

  /** @returns {number} */
  getZoom() {
    return _classPrivateFieldLooseBase(this, _store)[_store].state.transform[2];
  }

  /**
   * @param {import('c/flowTypes').Viewport} viewport
   * @param {{duration?: number}} [options]
   * @returns {Promise<boolean>}
   */
  setViewport(viewport, options) {
    return _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.setViewport(viewport, options) ?? Promise.resolve(false);
  }

  /** @param {{duration?: number}} [options] @returns {Promise<boolean>} */
  zoomIn(options) {
    return _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.scaleBy(1.2, options) ?? Promise.resolve(false);
  }

  /** @param {{duration?: number}} [options] @returns {Promise<boolean>} */
  zoomOut(options) {
    return _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.scaleBy(1 / 1.2, options) ?? Promise.resolve(false);
  }

  /** @param {number} zoom @param {{duration?: number}} [options] @returns {Promise<boolean>} */
  zoomTo(zoom, options) {
    return _classPrivateFieldLooseBase(this, _panZoom)[_panZoom]?.scaleTo(zoom, options) ?? Promise.resolve(false);
  }

  /**
   * Centre a flow point.
   * @param {number} x
   * @param {number} y
   * @param {{zoom?: number, duration?: number}} [options]
   * @returns {Promise<boolean>}
   */
  setCenter(x, y, options = {}) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const zoom = options.zoom ?? clamp(s.transform[2], s.minZoom, s.maxZoom);
    return this.setViewport({
      x: s.width / 2 - x * zoom,
      y: s.height / 2 - y * zoom,
      zoom
    }, options);
  }

  /**
   * Fit a rect into view.
   * @param {import('c/flowTypes').Rect} bounds
   * @param {{padding?: number, duration?: number}} [options]
   * @returns {Promise<boolean>}
   */
  fitBounds(bounds, options = {}) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    const viewport = getViewportForBounds(bounds, s.width, s.height, s.minZoom, s.maxZoom, options.padding ?? 0.1);
    return this.setViewport(viewport, options);
  }

  /**
   * Fit every node into view.
   *
   * Named `fitViewport` rather than `fitView` because `fitView` is already a
   * boolean property on this component and LWC forbids a property and a method
   * of the same name.
   * @param {{padding?: number, minZoom?: number, maxZoom?: number, duration?: number, nodes?: Array<*>, includeHiddenNodes?: boolean}} [options]
   * @returns {Promise<boolean>}
   */
  fitViewport(options = {}) {
    const s = _classPrivateFieldLooseBase(this, _store)[_store].state;
    if (!s.width || !s.height) {
      return Promise.resolve(false);
    }
    const wanted = options.nodes ? new Set(options.nodes.map(n => n.id)) : null;
    const bounds = getInternalNodesBounds(s.nodeLookup, {
      filter: node => (!wanted || wanted.has(node.id)) && (options.includeHiddenNodes || !node.hidden) && nodeHasDimensions(node)
    });
    if (bounds.width === 0 || bounds.height === 0) {
      return Promise.resolve(false);
    }
    const viewport = getViewportForBounds(bounds, s.width, s.height, options.minZoom ?? s.minZoom, options.maxZoom ?? s.maxZoom, options.padding ?? 0.1);
    return this.setViewport(viewport, {
      duration: options.duration
    });
  }

  /** @returns {boolean} whether the pan/zoom controller is live */
  get viewportInitialized() {
    return _classPrivateFieldLooseBase(this, _panZoom)[_panZoom] !== null;
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(Flow, {
  publicProps: {
    nodes: {
      config: 3
    },
    edges: {
      config: 3
    },
    nodeTypes: {
      config: 0
    },
    edgeTypes: {
      config: 0
    },
    minZoom: {
      config: 0
    },
    maxZoom: {
      config: 0
    },
    translateExtent: {
      config: 0
    },
    nodeExtent: {
      config: 0
    },
    nodeOrigin: {
      config: 0
    },
    defaultViewport: {
      config: 0
    },
    fitView: {
      config: 0
    },
    fitViewOptions: {
      config: 0
    },
    snapToGrid: {
      config: 0
    },
    snapGrid: {
      config: 0
    },
    renderVisibleOnly: {
      config: 0
    },
    nodesDraggable: {
      config: 3
    },
    nodesConnectable: {
      config: 3
    },
    nodesFocusable: {
      config: 3
    },
    edgesFocusable: {
      config: 3
    },
    elementsSelectable: {
      config: 3
    },
    elevateNodesOnSelect: {
      config: 3
    },
    selectNodesOnDrag: {
      config: 3
    },
    autoPanOnNodeDrag: {
      config: 3
    },
    autoPanOnConnect: {
      config: 3
    },
    zoomOnScroll: {
      config: 3
    },
    zoomOnPinch: {
      config: 3
    },
    zoomOnDoubleClick: {
      config: 3
    },
    preventScrolling: {
      config: 3
    },
    panOnDrag: {
      config: 3
    },
    edgesReconnectable: {
      config: 0
    },
    elevateEdgesOnSelect: {
      config: 0
    },
    zIndexMode: {
      config: 0
    },
    autoPanSpeed: {
      config: 0
    },
    connectionMode: {
      config: 0
    },
    connectionRadius: {
      config: 0
    },
    connectionLineType: {
      config: 0
    },
    selectionMode: {
      config: 0
    },
    selectionOnDrag: {
      config: 0
    },
    nodeDragThreshold: {
      config: 0
    },
    connectionDragThreshold: {
      config: 0
    },
    paneClickDistance: {
      config: 0
    },
    nodeClickDistance: {
      config: 0
    },
    isValidConnection: {
      config: 0
    },
    panOnScroll: {
      config: 0
    },
    panOnScrollMode: {
      config: 0
    },
    panOnScrollSpeed: {
      config: 0
    },
    deleteKeyCode: {
      config: 0
    },
    selectionKeyCode: {
      config: 0
    },
    multiSelectionKeyCode: {
      config: 0
    },
    panActivationKeyCode: {
      config: 0
    },
    zoomActivationKeyCode: {
      config: 0
    },
    defaultMarkerStart: {
      config: 0
    },
    defaultMarkerEnd: {
      config: 0
    },
    ariaLabelConfig: {
      config: 0
    },
    beforeDelete: {
      config: 0
    },
    showBackground: {
      config: 0
    },
    showControls: {
      config: 0
    },
    showMinimap: {
      config: 0
    },
    flowId: {
      config: 1
    },
    store: {
      config: 1
    },
    viewportInitialized: {
      config: 1
    }
  },
  publicMethods: ["getNodes", "getEdges", "getNode", "getInternalNode", "getEdge", "toObject", "applyNodeChanges", "applyEdgeChanges", "addEdge", "reconnectEdge", "deleteElements", "getIntersectingNodes", "isNodeIntersecting", "getNodesBounds", "getNodeConnections", "screenToFlowPosition", "flowToScreenPosition", "getViewport", "getZoom", "setViewport", "zoomIn", "zoomOut", "zoomTo", "setCenter", "fitBounds", "fitViewport"],
  fields: ["_nodesDraggable", "_nodesConnectable", "_nodesFocusable", "_edgesFocusable", "_elementsSelectable", "_elevateNodesOnSelect", "_selectNodesOnDrag", "_autoPanOnNodeDrag", "_autoPanOnConnect", "_zoomOnScroll", "_zoomOnPinch", "_zoomOnDoubleClick", "_preventScrolling", "_panOnDrag", "_viewportStyle"]
});
const __lwc_component_class_internal$2 = registerComponent(Flow, {
  tmpl: _tmpl$7,
  sel: "c-flow",
  apiVersion: 66
});

const $fragment1$1 = parseFragment`<header class="demo__head${0}"${2}><div class="demo__brand${0}"${2}><span class="demo__mark${0}"${2}><svg viewBox="0 0 48 36" aria-hidden="true"${3}><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"${3}><path d="M12 8 C22 8 26 18 36 18"${3}/><path d="M12 28 C22 28 26 18 36 18"${3}/></g><g fill="currentColor"${3}><circle cx="7" cy="8" r="5"${3}/><circle cx="7" cy="28" r="5"${3}/><circle cx="41" cy="18" r="5"${3}/></g></svg></span><div${3}><h1 class="demo__title${0}"${2}>LWC-xyflow</h1><p class="demo__sub${0}"${2}><a href="https://github.com/xyflow/xyflow"${3}>xyflow</a> ported to Lightning Web Components - no d3, no npm packages, no CDN scripts. This page runs the deployable component source unchanged.</p></div></div><div class="demo__actions${0}"${2}><button class="demo__theme${0}"${"a19:title"}${"a19:aria-label"}${2}>${"t20"}</button><a class="demo__repo${0}" href="https://github.com/grzmol/lwc-flow"${2}>View on GitHub</a></div></header>`;
const $fragment2$1 = parseFragment`<button class="demo__btn demo__btn_primary${0}"${2}>Add node</button>`;
const $fragment3$1 = parseFragment`<button class="demo__btn${0}"${"a0:disabled"}${2}>Delete selected</button>`;
const $fragment4$1 = parseFragment`<button class="demo__btn${0}"${2}>Fit view</button>`;
const $fragment5$1 = parseFragment`<button class="demo__btn${0}"${2}>Reset</button>`;
const $fragment6$1 = parseFragment`<span class="demo__sep${0}"${2}></span>`;
const $fragment7$1 = parseFragment`<button class="demo__btn${0}"${"a0:disabled"} title="Undo"${2}>↩ Undo</button>`;
const $fragment8 = parseFragment`<button class="demo__btn${0}"${"a0:disabled"} title="Redo"${2}>Redo ↪</button>`;
const $fragment9 = parseFragment`<button class="demo__btn${0}"${2}>Copy JSON</button>`;
const $fragment10 = parseFragment`<span class="demo__sep${0}"${2}></span>`;
const $fragment11 = parseFragment`<label class="demo__field${0}"${2}>Edge type<select class="demo__select${0}"${2}><option value="default" selected${3}>bezier</option><option value="smoothstep"${3}>smoothstep</option><option value="simplebezier"${3}>simple bezier</option><option value="straight"${3}>straight</option><option value="step"${3}>step</option><option value="wavy"${3}>wavy (custom)</option></select></label>`;
const $fragment12 = parseFragment`<span class="demo__hint${0}"${2}>Drag a handle to connect · shift-drag the pane to marquee-select · Backspace deletes</span>`;
const $fragment13 = parseFragment`<div class="demo__stats${0}"${2}><div class="demo__stat${0}"${2}><span class="demo__stat-value${0}"${2}>${"t3"}</span><span${3}>nodes</span></div><div class="demo__stat${0}"${2}><span class="demo__stat-value${0}"${2}>${"t8"}</span><span${3}>edges</span></div><div class="demo__stat${0}"${2}><span class="demo__stat-value${0}"${2}>${"t13"}</span><span${3}>selected</span></div><div class="demo__stat${0}"${2}><span class="demo__stat-value${0}"${2}>${"t18"}</span><span${3}>zoom</span></div></div>`;
const $fragment14 = parseFragment`<h2 class="demo__side-title${0}"${2}>New node</h2>`;
const $fragment15 = parseFragment`<span${3}>id</span>`;
const $fragment16 = parseFragment`<span${3}>type</span>`;
const $fragment17 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment18 = parseFragment`<span${3}>title</span>`;
const $fragment19 = parseFragment`<span${3}>meta</span>`;
const $fragment20 = parseFragment`<span${3}>icon</span>`;
const $fragment21 = parseFragment`<span${3}>tone</span>`;
const $fragment22 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment23 = parseFragment`<span${3}>size</span>`;
const $fragment24 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment25 = parseFragment`<span${3}>chip</span>`;
const $fragment26 = parseFragment`<span${3}>chip tone</span>`;
const $fragment27 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment28 = parseFragment`<span${3}>progress %</span>`;
const $fragment29 = parseFragment`<span${3}>width</span>`;
const $fragment30 = parseFragment`<span${3}>height</span>`;
const $fragment31 = parseFragment`<span${3}>x</span>`;
const $fragment32 = parseFragment`<span${3}>y</span>`;
const $fragment33 = parseFragment`<span${3}>source</span>`;
const $fragment34 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment35 = parseFragment`<span${3}>target</span>`;
const $fragment36 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment37 = parseFragment`<span${3}>parent</span>`;
const $fragment38 = parseFragment`<option${"a0:value"}${"a0:selected"}${3}>${"t1"}</option>`;
const $fragment39 = parseFragment`<div class="demo__form-actions${0}"${2}><button class="demo__btn demo__btn_primary${0}"${2}>Create node</button><button class="demo__btn${0}"${2}>Cancel</button></div>`;
const $fragment40 = parseFragment`<h2 class="demo__side-title${0}"${2}>Inspector</h2>`;
const $fragment41 = parseFragment`<div class="demo__prop${0}"${2}><dt${3}>${"t2"}</dt><dd${3}>${"t4"}</dd></div>`;
const $fragment42 = parseFragment`<button class="demo__tone${0}"${"a0:data-tone"}${"a0:title"}${2}><span${"c1"}${2}></span></button>`;
const $fragment43 = parseFragment`<button class="demo__btn demo__btn_block${0}"${2}>Toggle animated</button>`;
const $fragment44 = parseFragment`<p class="demo__side-note${0}"${2}>Nothing selected. Click a node or an edge.</p>`;
const $fragment45 = parseFragment`<h2 class="demo__side-title${0}"${2}>Change log</h2>`;
const $fragment46 = parseFragment`<p class="demo__side-note${0}"${2}>The flow never owns the graph. Every interaction leaves as a change array that this page folds back in with <code${3}>applyNodeChanges</code> and <code${3}>applyEdgeChanges</code>.</p>`;
const $fragment47 = parseFragment`<li class="demo__log-row${0}"${2}>${"t1"}</li>`;
const stc0$1 = {
  classMap: {
    "demo": true
  },
  key: 0
};
const stc1$1 = {
  classMap: {
    "demo__toolbar": true
  },
  key: 3
};
const stc2$1 = {
  classMap: {
    "demo__check": true
  },
  key: 24
};
const stc3$1 = {
  "type": "checkbox"
};
const stc4 = {
  classMap: {
    "demo__check": true
  },
  key: 26
};
const stc5 = {
  classMap: {
    "demo__check": true
  },
  key: 28
};
const stc6 = {
  classMap: {
    "demo__check": true
  },
  key: 30
};
const stc7 = {
  classMap: {
    "demo__body": true
  },
  key: 32
};
const stc8 = {
  classMap: {
    "demo__canvas": true
  },
  key: 33
};
const stc9 = {
  props: {
    "position": "top-right"
  },
  key: 35
};
const stc10 = {
  classMap: {
    "demo__side": true
  },
  key: 38
};
const stc11 = {
  classMap: {
    "demo__form": true
  },
  key: 44
};
const stc12 = {
  classMap: {
    "demo__row": true
  },
  key: 45
};
const stc13 = {
  "demo__input": true
};
const stc14 = {
  "type": "text",
  "data-field": "id"
};
const stc15 = {
  classMap: {
    "demo__row": true
  },
  key: 49
};
const stc16 = {
  "demo__select": true
};
const stc17 = {
  "data-field": "type"
};
const stc18 = {
  classMap: {
    "demo__row": true
  },
  key: 55
};
const stc19 = {
  "type": "text",
  "data-field": "title"
};
const stc20 = {
  classMap: {
    "demo__row": true
  },
  key: 60
};
const stc21 = {
  "type": "text",
  "data-field": "meta"
};
const stc22 = {
  classMap: {
    "demo__row": true
  },
  key: 64
};
const stc23 = {
  "type": "text",
  "maxlength": "2",
  "data-field": "icon"
};
const stc24 = {
  classMap: {
    "demo__row": true
  },
  key: 68
};
const stc25 = {
  "data-field": "tone"
};
const stc26 = {
  classMap: {
    "demo__row": true
  },
  key: 74
};
const stc27 = {
  "data-field": "size"
};
const stc28 = {
  classMap: {
    "demo__row": true
  },
  key: 80
};
const stc29 = {
  "type": "text",
  "placeholder": "(none)",
  "data-field": "chipText"
};
const stc30 = {
  classMap: {
    "demo__row": true
  },
  key: 84
};
const stc31 = {
  "data-field": "chipTone"
};
const stc32 = {
  classMap: {
    "demo__row": true
  },
  key: 90
};
const stc33 = {
  "type": "number",
  "min": "0",
  "max": "100",
  "placeholder": "(none)",
  "data-field": "progress"
};
const stc34 = {
  classMap: {
    "demo__row": true
  },
  key: 95
};
const stc35 = {
  "type": "number",
  "data-field": "width"
};
const stc36 = {
  classMap: {
    "demo__row": true
  },
  key: 99
};
const stc37 = {
  "type": "number",
  "data-field": "height"
};
const stc38 = {
  classMap: {
    "demo__row": true
  },
  key: 103
};
const stc39 = {
  "type": "number",
  "data-field": "x"
};
const stc40 = {
  classMap: {
    "demo__row": true
  },
  key: 107
};
const stc41 = {
  "type": "number",
  "data-field": "y"
};
const stc42 = {
  classMap: {
    "demo__row": true
  },
  key: 111
};
const stc43 = {
  "data-field": "sourcePosition"
};
const stc44 = {
  classMap: {
    "demo__row": true
  },
  key: 117
};
const stc45 = {
  "data-field": "targetPosition"
};
const stc46 = {
  classMap: {
    "demo__row": true
  },
  key: 123
};
const stc47 = {
  "data-field": "parentId"
};
const stc48 = {
  classMap: {
    "demo__flags": true
  },
  key: 129
};
const stc49 = {
  classMap: {
    "demo__check": true
  },
  key: 130
};
const stc50 = {
  "type": "checkbox",
  "data-field": "draggable"
};
const stc51 = {
  classMap: {
    "demo__check": true
  },
  key: 132
};
const stc52 = {
  "type": "checkbox",
  "data-field": "selectable"
};
const stc53 = {
  classMap: {
    "demo__check": true
  },
  key: 134
};
const stc54 = {
  "type": "checkbox",
  "data-field": "connectable"
};
const stc55 = {
  classMap: {
    "demo__check": true
  },
  key: 136
};
const stc56 = {
  "type": "checkbox",
  "data-field": "deletable"
};
const stc57 = {
  classMap: {
    "demo__inspect": true
  },
  key: 143
};
const stc58 = {
  classMap: {
    "demo__rename": true
  },
  key: 145
};
const stc59 = {
  "type": "text"
};
const stc60 = {
  classMap: {
    "demo__props": true
  },
  key: 147
};
const stc61 = {
  classMap: {
    "demo__tones": true
  },
  key: 151
};
const stc62 = {
  classMap: {
    "demo__log": true
  },
  key: 162
};
function tmpl$1($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, h: api_element, t: api_text, c: api_custom_element, k: api_key, i: api_iterator, fr: api_fragment, ncls: api_normalize_class_name} = $api;
  const {_m0, _m1, _m2, _m3, _m4, _m5, _m6, _m7, _m8, _m9, _m10, _m11, _m12, _m13, _m14, _m15, _m16, _m17, _m18, _m19, _m20, _m21, _m22, _m23, _m24, _m25, _m26, _m27, _m28, _m29, _m30, _m31, _m32, _m33, _m34, _m35, _m36, _m37, _m38, _m39, _m40, _m41, _m42, _m43, _m44, _m45, _m46, _m47, _m48} = $ctx;
  return [api_element("div", stc0$1, [api_static_fragment($fragment1$1, 2, [api_static_part(19, {
    on: _m0 || ($ctx._m0 = {
      "click": api_bind($cmp.handleThemeToggle)
    }),
    attrs: {
      "title": $cmp.themeTitle,
      "aria-label": $cmp.themeTitle
    }
  }, null), api_static_part(20, null, api_dynamic_text($cmp.themeIcon))]), api_element("div", stc1$1, [api_static_fragment($fragment2$1, 5, [api_static_part(0, {
    on: _m2 || ($ctx._m2 = {
      "click": api_bind($cmp.handleOpenAdd)
    })
  }, null)]), api_static_fragment($fragment3$1, 7, [api_static_part(0, {
    on: _m4 || ($ctx._m4 = {
      "click": api_bind($cmp.handleDeleteSelected)
    }),
    attrs: {
      "disabled": $cmp.hasNoSelection ? "" : null
    }
  }, null)]), api_static_fragment($fragment4$1, 9, [api_static_part(0, {
    on: _m6 || ($ctx._m6 = {
      "click": api_bind($cmp.handleFitView)
    })
  }, null)]), api_static_fragment($fragment5$1, 11, [api_static_part(0, {
    on: _m8 || ($ctx._m8 = {
      "click": api_bind($cmp.handleReset)
    })
  }, null)]), api_static_fragment($fragment6$1, 13), api_static_fragment($fragment7$1, 15, [api_static_part(0, {
    on: _m10 || ($ctx._m10 = {
      "click": api_bind($cmp.handleUndo)
    }),
    attrs: {
      "disabled": $cmp.cannotUndo ? "" : null
    }
  }, null)]), api_static_fragment($fragment8, 17, [api_static_part(0, {
    on: _m12 || ($ctx._m12 = {
      "click": api_bind($cmp.handleRedo)
    }),
    attrs: {
      "disabled": $cmp.cannotRedo ? "" : null
    }
  }, null)]), api_static_fragment($fragment9, 19, [api_static_part(0, {
    on: _m14 || ($ctx._m14 = {
      "click": api_bind($cmp.handleCopyJson)
    })
  }, null)]), api_static_fragment($fragment10, 21), api_static_fragment($fragment11, 23, [api_static_part(2, {
    on: _m15 || ($ctx._m15 = {
      "change": api_bind($cmp.handleEdgeTypeChange)
    })
  }, null)]), api_element("label", stc2$1, [api_element("input", {
    attrs: stc3$1,
    props: {
      "checked": $cmp.snapToGrid
    },
    key: 25,
    on: _m16 || ($ctx._m16 = {
      "change": api_bind($cmp.handleSnapChange)
    })
  }), api_text("Snap to grid")]), api_element("label", stc4, [api_element("input", {
    attrs: stc3$1,
    props: {
      "checked": $cmp.showBackground
    },
    key: 27,
    on: _m17 || ($ctx._m17 = {
      "change": api_bind($cmp.handleBackgroundChange)
    })
  }), api_text("Background")]), api_element("label", stc5, [api_element("input", {
    attrs: stc3$1,
    props: {
      "checked": $cmp.showMinimap
    },
    key: 29,
    on: _m18 || ($ctx._m18 = {
      "change": api_bind($cmp.handleMinimapChange)
    })
  }), api_text("Minimap")]), api_element("label", stc6, [api_element("input", {
    attrs: stc3$1,
    props: {
      "checked": $cmp.locked
    },
    key: 31,
    on: _m19 || ($ctx._m19 = {
      "change": api_bind($cmp.handleLockChange)
    })
  }), api_text("Lock nodes")])]), api_element("div", stc7, [api_element("section", stc8, [api_custom_element("c-flow", __lwc_component_class_internal$2, {
    ref: "flow",
    props: {
      "nodes": $cmp.nodes,
      "edges": $cmp.edges,
      "nodeTypes": $cmp.nodeTypes,
      "edgeTypes": $cmp.edgeTypes,
      "fitView": $cmp.fitView,
      "fitViewOptions": $cmp.fitViewOptions,
      "showBackground": $cmp.showBackground,
      "showControls": $cmp.showControls,
      "showMinimap": $cmp.showMinimap,
      "snapToGrid": $cmp.snapToGrid,
      "nodesDraggable": $cmp.nodesDraggable,
      "isValidConnection": $cmp.isValidConnection
    },
    key: 34,
    on: _m20 || ($ctx._m20 = {
      "nodeschange": api_bind($cmp.handleNodesChange),
      "edgeschange": api_bind($cmp.handleEdgesChange),
      "connect": api_bind($cmp.handleConnect),
      "move": api_bind($cmp.handleMove),
      "nodesinitialized": api_bind($cmp.handleNodesInitialized),
      "nodeclick": api_bind($cmp.handleNodeClick),
      "edgeclick": api_bind($cmp.handleEdgeClick),
      "paneclick": api_bind($cmp.handlePaneClick),
      "flowerror": api_bind($cmp.handleFlowError)
    })
  }, [api_custom_element("c-flow-panel", __lwc_component_class_internal$e, stc9, [api_static_fragment($fragment12, 37)])])]), api_element("aside", stc10, [api_static_fragment($fragment13, 40, [api_static_part(3, null, api_dynamic_text($cmp.nodeCount)), api_static_part(8, null, api_dynamic_text($cmp.edgeCount)), api_static_part(13, null, api_dynamic_text($cmp.selectedCount)), api_static_part(18, null, api_dynamic_text($cmp.zoomLabel))]), $cmp.adding ? api_fragment(41, [api_static_fragment($fragment14, 43), api_element("div", stc11, [api_element("label", stc12, [api_static_fragment($fragment15, 47), api_element("input", {
    classMap: stc13,
    attrs: stc14,
    props: {
      "value": $cmp.draft.id
    },
    key: 48,
    on: _m21 || ($ctx._m21 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc15, [api_static_fragment($fragment16, 51), api_element("select", {
    classMap: stc16,
    attrs: stc17,
    key: 52,
    on: _m22 || ($ctx._m22 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.typeOptions, function (option) {
    return api_static_fragment($fragment17, api_key(54, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("label", stc18, [api_static_fragment($fragment18, 57), api_element("input", {
    classMap: stc13,
    attrs: stc19,
    props: {
      "value": $cmp.draft.title
    },
    key: 58,
    on: _m23 || ($ctx._m23 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), $cmp.isCardDraft ? api_fragment(59, [api_element("label", stc20, [api_static_fragment($fragment19, 62), api_element("input", {
    classMap: stc13,
    attrs: stc21,
    props: {
      "value": $cmp.draft.meta
    },
    key: 63,
    on: _m24 || ($ctx._m24 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc22, [api_static_fragment($fragment20, 66), api_element("input", {
    classMap: stc13,
    attrs: stc23,
    props: {
      "value": $cmp.draft.icon
    },
    key: 67,
    on: _m25 || ($ctx._m25 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc24, [api_static_fragment($fragment21, 70), api_element("select", {
    classMap: stc16,
    attrs: stc25,
    key: 71,
    on: _m26 || ($ctx._m26 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.draftToneOptions, function (option) {
    return api_static_fragment($fragment22, api_key(73, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("label", stc26, [api_static_fragment($fragment23, 76), api_element("select", {
    classMap: stc16,
    attrs: stc27,
    key: 77,
    on: _m27 || ($ctx._m27 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.sizeOptions, function (option) {
    return api_static_fragment($fragment24, api_key(79, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("label", stc28, [api_static_fragment($fragment25, 82), api_element("input", {
    classMap: stc13,
    attrs: stc29,
    props: {
      "value": $cmp.draft.chipText
    },
    key: 83,
    on: _m28 || ($ctx._m28 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc30, [api_static_fragment($fragment26, 86), api_element("select", {
    classMap: stc16,
    attrs: stc31,
    key: 87,
    on: _m29 || ($ctx._m29 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.draftChipToneOptions, function (option) {
    return api_static_fragment($fragment27, api_key(89, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("label", stc32, [api_static_fragment($fragment28, 92), api_element("input", {
    classMap: stc13,
    attrs: stc33,
    props: {
      "value": $cmp.draft.progress
    },
    key: 93,
    on: _m30 || ($ctx._m30 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })])], 0) : null, $cmp.isGroupDraft ? api_fragment(94, [api_element("label", stc34, [api_static_fragment($fragment29, 97), api_element("input", {
    classMap: stc13,
    attrs: stc35,
    props: {
      "value": $cmp.draft.width
    },
    key: 98,
    on: _m31 || ($ctx._m31 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc36, [api_static_fragment($fragment30, 101), api_element("input", {
    classMap: stc13,
    attrs: stc37,
    props: {
      "value": $cmp.draft.height
    },
    key: 102,
    on: _m32 || ($ctx._m32 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })])], 0) : null, api_element("label", stc38, [api_static_fragment($fragment31, 105), api_element("input", {
    classMap: stc13,
    attrs: stc39,
    props: {
      "value": $cmp.draft.x
    },
    key: 106,
    on: _m33 || ($ctx._m33 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc40, [api_static_fragment($fragment32, 109), api_element("input", {
    classMap: stc13,
    attrs: stc41,
    props: {
      "value": $cmp.draft.y
    },
    key: 110,
    on: _m34 || ($ctx._m34 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  })]), api_element("label", stc42, [api_static_fragment($fragment33, 113), api_element("select", {
    classMap: stc16,
    attrs: stc43,
    key: 114,
    on: _m35 || ($ctx._m35 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.sourceOptions, function (option) {
    return api_static_fragment($fragment34, api_key(116, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("label", stc44, [api_static_fragment($fragment35, 119), api_element("select", {
    classMap: stc16,
    attrs: stc45,
    key: 120,
    on: _m36 || ($ctx._m36 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.targetOptions, function (option) {
    return api_static_fragment($fragment36, api_key(122, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("label", stc46, [api_static_fragment($fragment37, 125), api_element("select", {
    classMap: stc16,
    attrs: stc47,
    key: 126,
    on: _m37 || ($ctx._m37 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }, api_iterator($cmp.parentOptions, function (option) {
    return api_static_fragment($fragment38, api_key(128, option.key), [api_static_part(0, {
      attrs: {
        "value": option.value,
        "selected": option.selected ? "" : null
      }
    }, null), api_static_part(1, null, api_dynamic_text(option.label))]);
  }))]), api_element("div", stc48, [api_element("label", stc49, [api_element("input", {
    attrs: stc50,
    props: {
      "checked": $cmp.draft.draggable
    },
    key: 131,
    on: _m38 || ($ctx._m38 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }), api_text("draggable")]), api_element("label", stc51, [api_element("input", {
    attrs: stc52,
    props: {
      "checked": $cmp.draft.selectable
    },
    key: 133,
    on: _m39 || ($ctx._m39 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }), api_text("selectable")]), api_element("label", stc53, [api_element("input", {
    attrs: stc54,
    props: {
      "checked": $cmp.draft.connectable
    },
    key: 135,
    on: _m40 || ($ctx._m40 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }), api_text("connectable")]), api_element("label", stc55, [api_element("input", {
    attrs: stc56,
    props: {
      "checked": $cmp.draft.deletable
    },
    key: 137,
    on: _m41 || ($ctx._m41 = {
      "change": api_bind($cmp.handleDraftChange)
    })
  }), api_text("deletable")])]), api_static_fragment($fragment39, 139, [api_static_part(1, {
    on: _m42 || ($ctx._m42 = {
      "click": api_bind($cmp.handleCreateNode)
    })
  }, null), api_static_part(3, {
    on: _m43 || ($ctx._m43 = {
      "click": api_bind($cmp.handleCancelAdd)
    })
  }, null)])])], 0) : api_fragment(41, [api_static_fragment($fragment40, 141), $cmp.hasInspected ? api_fragment(142, [api_element("div", stc57, [$cmp.inspectedIsNode ? api_fragment(144, [api_element("label", stc58, [api_text("Title"), api_element("input", {
    classMap: stc13,
    attrs: stc59,
    props: {
      "value": $cmp.inspectedTitle
    },
    key: 146,
    on: _m44 || ($ctx._m44 = {
      "input": api_bind($cmp.handleTitleInput)
    })
  })])], 0) : null, api_element("dl", stc60, api_iterator($cmp.inspectedRows, function (row) {
    return api_static_fragment($fragment41, api_key(149, row.key), [api_static_part(2, null, api_dynamic_text(row.label)), api_static_part(4, null, api_dynamic_text(row.value))]);
  })), $cmp.inspectedIsNode ? api_fragment(150, [api_element("div", stc61, api_iterator($cmp.toneOptions, function (option) {
    return api_static_fragment($fragment42, api_key(153, option.key), [api_static_part(0, {
      on: _m46 || ($ctx._m46 = {
        "click": api_bind($cmp.handleToneClick)
      }),
      attrs: {
        "data-tone": option.tone,
        "title": option.tone
      }
    }, null), api_static_part(1, {
      className: api_normalize_class_name(option.tone)
    }, null)]);
  }))], 0) : api_fragment(150, [api_static_fragment($fragment43, 155, [api_static_part(0, {
    on: _m48 || ($ctx._m48 = {
      "click": api_bind($cmp.handleToggleAnimated)
    })
  }, null)])], 0)])], 0) : api_fragment(142, [api_static_fragment($fragment44, 157)], 0)], 0), api_static_fragment($fragment45, 159), api_static_fragment($fragment46, 161), api_element("ul", stc62, api_iterator($cmp.logEntries, function (entry) {
    return api_static_fragment($fragment47, api_key(164, entry.key), [api_static_part(1, null, api_dynamic_text(entry.text))]);
  }))])])])];
  /*LWC compiler v9.4.3*/
}
var _tmpl$1 = registerTemplate(tmpl$1);
tmpl$1.hasRefs = true;
tmpl$1.stylesheets = [];
tmpl$1.stylesheetToken = "lwc-28v5qac68ph";
tmpl$1.legacyStylesheetToken = "demo-app_app";
if (_implicitStylesheets$e) {
  tmpl$1.stylesheets.push.apply(tmpl$1.stylesheets, _implicitStylesheets$e);
}
freezeTemplate(tmpl$1);

function stylesheet(token, useActualHostSelector, useNativeDirPseudoclass) {
  var shadowSelector = token ? ("[" + token + "]") : "";
  return ".dcard" + shadowSelector + " {--dcard-tone: var(--tone-violet);box-sizing: border-box;display: flex;flex-direction: column;gap: 0.625rem;padding: 0.75rem;border: 1px solid var(--border);border-radius: 0.625rem;background: var(--surface);box-shadow: var(--shadow-1);font-size: 0.75rem;line-height: 1.35;color: var(--text);text-align: left;}.dcard_md" + shadowSelector + " {width: 13rem;}.dcard_lg" + shadowSelector + " {width: 16.5rem;}.dcard_emphasis" + shadowSelector + " {border-color: var(--accent-line);box-shadow:\n 0 0 0 3px var(--accent-soft),\n var(--shadow-1);}.dcard_dragging" + shadowSelector + " {box-shadow: var(--shadow-2);}.dcard__head" + shadowSelector + " {display: flex;align-items: flex-start;gap: 0.5rem;}.dcard__icon" + shadowSelector + " {flex: none;display: grid;place-items: center;width: 1.5rem;height: 1.5rem;border-radius: 0.375rem;background: color-mix(in srgb, var(--dcard-tone) 14%, transparent);color: var(--dcard-tone);font-size: 0.75rem;line-height: 1;}.dcard__heading" + shadowSelector + " {display: flex;flex-direction: column;gap: 0.125rem;min-width: 0;}.dcard__title" + shadowSelector + " {font-size: 0.8125rem;font-weight: 600;letter-spacing: -0.01em;}.dcard__meta" + shadowSelector + " {color: var(--muted);font-size: 0.6875rem;}.dcard__metrics" + shadowSelector + " {display: flex;gap: 0.5rem;padding-top: 0.5rem;border-top: 1px solid var(--rule);}.dcard__metric" + shadowSelector + " {display: flex;flex-direction: column;gap: 0.0625rem;min-width: 0;}.dcard__metric-label" + shadowSelector + " {color: var(--faint);font-size: 0.5625rem;white-space: nowrap;}.dcard__metric-value" + shadowSelector + " {font-size: 0.75rem;font-weight: 600;font-variant-numeric: tabular-nums;}.dcard__metric-delta" + shadowSelector + " {font-size: 0.5625rem;font-variant-numeric: tabular-nums;}.dcard__metric-delta_up" + shadowSelector + " {color: var(--tone-green);}.dcard__metric-delta_down" + shadowSelector + " {color: var(--tone-rose);}.dcard__metric-delta_flat" + shadowSelector + " {color: var(--faint);}.dcard__bar" + shadowSelector + " {height: 0.25rem;border-radius: 999px;background: var(--rule);overflow: hidden;}.dcard__bar-fill" + shadowSelector + " {display: block;height: 100%;border-radius: inherit;background: var(--dcard-tone);}.dcard__foot" + shadowSelector + " {display: flex;align-items: center;justify-content: space-between;gap: 0.5rem;}.dcard__footer" + shadowSelector + " {color: var(--muted);font-size: 0.6875rem;}.dcard__chip" + shadowSelector + " {--dcard-chip-tone: var(--faint);flex: none;padding: 0.0625rem 0.375rem;border-radius: 0.25rem;background: color-mix(in srgb, var(--dcard-chip-tone) 16%, transparent);color: var(--dcard-chip-tone);font-size: 0.625rem;font-weight: 500;}.dcard__chip_slate" + shadowSelector + " {--dcard-chip-tone: var(--muted);}.dcard__chip_violet" + shadowSelector + " {--dcard-chip-tone: var(--tone-violet);}.dcard__chip_blue" + shadowSelector + " {--dcard-chip-tone: var(--tone-blue);}.dcard__chip_green" + shadowSelector + " {--dcard-chip-tone: var(--tone-green);}.dcard__chip_amber" + shadowSelector + " {--dcard-chip-tone: var(--tone-amber);}.dcard__chip_rose" + shadowSelector + " {--dcard-chip-tone: var(--tone-rose);}.dcard__icon_violet" + shadowSelector + ",.dcard__bar-fill_violet" + shadowSelector + " {--dcard-tone: var(--tone-violet);}.dcard__icon_blue" + shadowSelector + ",.dcard__bar-fill_blue" + shadowSelector + " {--dcard-tone: var(--tone-blue);}.dcard__icon_green" + shadowSelector + ",.dcard__bar-fill_green" + shadowSelector + " {--dcard-tone: var(--tone-green);}.dcard__icon_amber" + shadowSelector + ",.dcard__bar-fill_amber" + shadowSelector + " {--dcard-tone: var(--tone-amber);}.dcard__icon_rose" + shadowSelector + ",.dcard__bar-fill_rose" + shadowSelector + " {--dcard-tone: var(--tone-rose);}";
  /*LWC compiler v9.4.3*/
}
var _implicitStylesheets = [stylesheet];

const $fragment1 = parseFragment`<span${"c0"}${2}>${"t1"}</span>`;
const $fragment2 = parseFragment`<span class="dcard__title${0}"${2}>${"t1"}</span>`;
const $fragment3 = parseFragment`<span class="dcard__meta${0}"${2}>${"t1"}</span>`;
const $fragment4 = parseFragment`<div class="dcard__metric${0}"${2}><span class="dcard__metric-label${0}"${2}>${"t2"}</span><span class="dcard__metric-value${0}"${2}>${"t4"}</span><span${"c5"}${2}>${"t6"}</span></div>`;
const $fragment5 = parseFragment`<div class="dcard__bar${0}"${2}><span${"c1"}${"s1"}${2}></span></div>`;
const $fragment6 = parseFragment`<span class="dcard__footer${0}"${2}>${"t1"}</span>`;
const $fragment7 = parseFragment`<span${"c0"}${2}>${"t1"}</span>`;
const stc0 = {
  classMap: {
    "dcard__head": true
  },
  key: 2
};
const stc1 = {
  classMap: {
    "dcard__heading": true
  },
  key: 5
};
const stc2 = {
  classMap: {
    "dcard__metrics": true
  },
  key: 12
};
const stc3 = {
  classMap: {
    "dcard__foot": true
  },
  key: 19
};
function tmpl($api, $cmp, $slotset, $ctx) {
  const {b: api_bind, c: api_custom_element, ncls: api_normalize_class_name, d: api_dynamic_text, sp: api_static_part, st: api_static_fragment, fr: api_fragment, h: api_element, k: api_key, i: api_iterator} = $api;
  const {_m0, _m1} = $ctx;
  return [api_custom_element("c-flow-handle", __lwc_component_class_internal$7, {
    props: {
      "type": "target",
      "position": $cmp.targetPosition,
      "store": $cmp.store,
      "nodeId": $cmp.id,
      "flowId": $cmp.flowId,
      "isConnectable": $cmp.isConnectable
    },
    key: 0,
    on: _m0 || ($ctx._m0 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  }), api_element("article", {
    className: api_normalize_class_name($cmp.cardClass),
    key: 1
  }, [api_element("header", stc0, [api_static_fragment($fragment1, 4, [api_static_part(0, {
    className: api_normalize_class_name($cmp.iconClass)
  }, null), api_static_part(1, null, api_dynamic_text($cmp.icon))]), api_element("span", stc1, [api_static_fragment($fragment2, 7, [api_static_part(1, null, api_dynamic_text($cmp.title))]), $cmp.hasMeta ? api_fragment(8, [api_static_fragment($fragment3, 10, [api_static_part(1, null, api_dynamic_text($cmp.meta))])], 0) : null])]), $cmp.hasMetrics ? api_fragment(11, [api_element("div", stc2, api_iterator($cmp.metricRows, function (metric) {
    return api_static_fragment($fragment4, api_key(14, metric.key), [api_static_part(2, null, api_dynamic_text(metric.label)), api_static_part(4, null, api_dynamic_text(metric.value)), api_static_part(5, {
      className: api_normalize_class_name(metric.deltaClass)
    }, null), api_static_part(6, null, api_dynamic_text(metric.delta))]);
  }))], 0) : null, $cmp.hasProgress ? api_fragment(15, [api_static_fragment($fragment5, 17, [api_static_part(1, {
    className: api_normalize_class_name($cmp.barFillClass),
    style: $cmp.barStyle
  }, null)])], 0) : null, $cmp.hasFoot ? api_fragment(18, [api_element("footer", stc3, [$cmp.hasFooter ? api_fragment(20, [api_static_fragment($fragment6, 22, [api_static_part(1, null, api_dynamic_text($cmp.footer))])], 0) : null, $cmp.hasChip ? api_fragment(23, [api_static_fragment($fragment7, 25, [api_static_part(0, {
    className: api_normalize_class_name($cmp.chipClass)
  }, null), api_static_part(1, null, api_dynamic_text($cmp.chip))])], 0) : null])], 0) : null]), api_custom_element("c-flow-handle", __lwc_component_class_internal$7, {
    props: {
      "type": "source",
      "position": $cmp.sourcePosition,
      "store": $cmp.store,
      "nodeId": $cmp.id,
      "flowId": $cmp.flowId,
      "isConnectable": $cmp.isConnectable
    },
    key: 26,
    on: _m1 || ($ctx._m1 = {
      "connectstart": api_bind($cmp.handleConnectStart)
    })
  })];
  /*LWC compiler v9.4.3*/
}
var _tmpl = registerTemplate(tmpl);
tmpl.renderMode = "light";
tmpl.stylesheets = [];
tmpl.stylesheetToken = "lwc-730d2bc5dd8";
tmpl.legacyStylesheetToken = "demo-cardNode_cardNode";
if (_implicitStylesheets) {
  tmpl.stylesheets.push.apply(tmpl.stylesheets, _implicitStylesheets);
}
freezeTemplate(tmpl);

/**
 * Light DOM is mandatory, not stylistic: `c/flowDom.getHandleBounds` finds handles with
 * `querySelectorAll` on the node wrapper's root element, and that query stops at the first shadow
 * boundary. A shadow root here would leave `handleBounds` null and every attached edge would fail
 * to find an endpoint.
 *
 * The `@api` surface mirrors `c/flowDefaultNode`: the wrapper spreads the whole node props object
 * with `lwc:spread`, and an undeclared key would land as an expando rather than a public property.
 */
class CardNode extends LightningElement {
  constructor(...args) {
    super(...args);
    this.id = void 0;
    this.data = void 0;
    this.type = void 0;
    this.selected = void 0;
    this.dragging = void 0;
    this.draggable = void 0;
    this.selectable = void 0;
    this.connectable = void 0;
    this.deletable = void 0;
    this.isConnectable = void 0;
    this.sourcePosition = void 0;
    this.targetPosition = void 0;
    this.positionAbsoluteX = void 0;
    this.positionAbsoluteY = void 0;
    this.width = void 0;
    this.height = void 0;
    this.parentId = void 0;
    this.zIndex = void 0;
    this.store = void 0;
    this.flowId = void 0;
  }
  get title() {
    return this.data?.title ?? this.data?.label;
  }
  get meta() {
    return this.data?.meta;
  }
  get hasMeta() {
    return Boolean(this.data?.meta);
  }
  get icon() {
    return this.data?.icon ?? '◆';
  }
  get iconClass() {
    return `dcard__icon dcard__icon_${this.data?.tone ?? 'violet'}`;
  }
  get cardClass() {
    return ['dcard', `dcard_${this.data?.size ?? 'md'}`, this.data?.emphasis ? 'dcard_emphasis' : '', this.dragging ? 'dcard_dragging' : ''].filter(Boolean).join(' ');
  }
  get metricRows() {
    return (this.data?.metrics ?? []).map((metric, index) => ({
      key: `${this.id}-m${index}`,
      label: metric.label,
      value: metric.value,
      delta: metric.delta,
      deltaClass: `dcard__metric-delta dcard__metric-delta_${metric.direction ?? 'flat'}`
    }));
  }
  get hasMetrics() {
    return this.metricRows.length > 0;
  }
  get hasProgress() {
    return typeof this.data?.progress === 'number';
  }
  get barStyle() {
    return `width:${Math.round(Math.min(1, Math.max(0, this.data.progress)) * 100)}%`;
  }
  get barFillClass() {
    return `dcard__bar-fill dcard__bar-fill_${this.data?.tone ?? 'violet'}`;
  }
  get footer() {
    return this.data?.footer;
  }
  get hasFooter() {
    return Boolean(this.data?.footer);
  }
  get chip() {
    return this.data?.chip?.text;
  }
  get hasChip() {
    return Boolean(this.data?.chip);
  }
  get chipClass() {
    return `dcard__chip dcard__chip_${this.data?.chip?.tone ?? 'slate'}`;
  }
  get hasFoot() {
    return this.hasFooter || this.hasChip;
  }

  /**
   * `c/flowHandle` dispatches a non-bubbling `connectstart`, so a custom node must relay it: the
   * gesture owner sits above the node wrapper and never sees the handle's own event.
   */
  handleConnectStart(event) {
    this.dispatchEvent(new CustomEvent('connectstart', {
      detail: event.detail
    }));
  }
  /*LWC compiler v9.4.3*/
}
CardNode.renderMode = 'light';
registerDecorators(CardNode, {
  publicProps: {
    id: {
      config: 0
    },
    data: {
      config: 0
    },
    type: {
      config: 0
    },
    selected: {
      config: 0
    },
    dragging: {
      config: 0
    },
    draggable: {
      config: 0
    },
    selectable: {
      config: 0
    },
    connectable: {
      config: 0
    },
    deletable: {
      config: 0
    },
    isConnectable: {
      config: 0
    },
    sourcePosition: {
      config: 0
    },
    targetPosition: {
      config: 0
    },
    positionAbsoluteX: {
      config: 0
    },
    positionAbsoluteY: {
      config: 0
    },
    width: {
      config: 0
    },
    height: {
      config: 0
    },
    parentId: {
      config: 0
    },
    zIndex: {
      config: 0
    },
    store: {
      config: 0
    },
    flowId: {
      config: 0
    }
  }
});
const __lwc_component_class_internal$1 = registerComponent(CardNode, {
  tmpl: _tmpl,
  sel: "demo-card-node",
  apiVersion: 66
});

const ARROW = Object.freeze({
  type: MarkerType.ArrowClosed,
  width: 16,
  height: 16
});
const FLOWS_RIGHT = Object.freeze({
  sourcePosition: Position.Right,
  targetPosition: Position.Left
});

/** The starting graph: a revenue model, left to right, inputs to KPIs. */
function initialNodes() {
  return [{
    id: 'web',
    type: 'card',
    position: {
      x: 0,
      y: 0
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Web form submissions',
      meta: 'Input · Sum',
      icon: '◆',
      tone: 'blue',
      metrics: [{
        label: 'Past 7 days',
        value: '4,570',
        delta: '0.87% ↗',
        direction: 'up'
      }, {
        label: 'Past 6 weeks',
        value: '26,958',
        delta: '2.71% ↗',
        direction: 'up'
      }]
    }
  }, {
    id: 'events',
    type: 'card',
    position: {
      x: 0,
      y: 160
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Event registrations',
      meta: 'Input · Sum',
      icon: '▲',
      tone: 'violet',
      metrics: [{
        label: 'Past 7 days',
        value: '641',
        delta: '1.04% ↗',
        direction: 'up'
      }, {
        label: 'Past 6 weeks',
        value: '3,318',
        delta: '1.44% ↗',
        direction: 'up'
      }]
    }
  }, {
    id: 'partner',
    type: 'card',
    position: {
      x: 0,
      y: 320
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Partner referrals',
      meta: 'Input · Sum',
      icon: '●',
      tone: 'amber',
      metrics: [{
        label: 'Past 7 days',
        value: '188',
        delta: '3.10% ↘',
        direction: 'down'
      }, {
        label: 'Past 6 weeks',
        value: '1,204',
        delta: 'no change',
        direction: 'flat'
      }]
    }
  }, {
    id: 'qualification',
    type: 'group',
    position: {
      x: 300,
      y: 60
    },
    style: {
      width: 264,
      height: 262
    },
    data: {
      label: 'Qualification'
    }
  }, {
    id: 'mql',
    type: 'card',
    parentId: 'qualification',
    extent: 'parent',
    position: {
      x: 20,
      y: 38
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Marketing qualified',
      meta: 'Jira Epic · 4 issues',
      icon: '◈',
      tone: 'green',
      progress: 0.67,
      footer: '4 issues · 67% done',
      chip: {
        text: 'In progress',
        tone: 'green'
      }
    }
  }, {
    id: 'score',
    type: 'card',
    parentId: 'qualification',
    extent: 'parent',
    position: {
      x: 20,
      y: 150
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Lead scoring model',
      meta: 'Apex · Einstein',
      icon: '✦',
      tone: 'violet',
      progress: 0.25,
      footer: '6 issues · 25% done',
      chip: {
        text: 'To do',
        tone: 'amber'
      }
    }
  }, {
    id: 'pipeline',
    type: 'card',
    position: {
      x: 640,
      y: 128
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Qualified pipeline created',
      meta: 'North Star · Sum',
      icon: '★',
      tone: 'violet',
      size: 'lg',
      emphasis: true,
      metrics: [{
        label: 'Past 7 days',
        value: '$4.41M',
        delta: '0.43% ↗',
        direction: 'up'
      }, {
        label: 'Past 6 weeks',
        value: '$26.1M',
        delta: '2.57% ↗',
        direction: 'up'
      }, {
        label: 'Past 12 months',
        value: '$198M',
        delta: '38.59% ↗',
        direction: 'up'
      }]
    }
  }, {
    id: 'arr',
    type: 'card',
    position: {
      x: 1000,
      y: 0
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'ARR',
      meta: 'KPI · Amount increased',
      icon: '◆',
      tone: 'green',
      metrics: [{
        label: 'Past 6 weeks',
        value: '$56,760',
        delta: '1,676% ↗',
        direction: 'up'
      }, {
        label: 'Past 12 months',
        value: '$612K',
        delta: '24.6% ↗',
        direction: 'up'
      }]
    }
  }, {
    id: 'retention',
    type: 'card',
    position: {
      x: 1000,
      y: 160
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Monthly retention',
      meta: 'KPI · Average',
      icon: '◈',
      tone: 'blue',
      metrics: [{
        label: 'Past 6 weeks',
        value: '71,521',
        delta: '3.32% ↗',
        direction: 'up'
      }, {
        label: 'Past 12 months',
        value: '63,825',
        delta: '37.70% ↗',
        direction: 'up'
      }]
    }
  }, {
    id: 'cycle',
    type: 'card',
    position: {
      x: 1000,
      y: 320
    },
    ...FLOWS_RIGHT,
    data: {
      title: 'Sales cycle length',
      meta: 'KPI · Average',
      icon: '●',
      tone: 'rose',
      metrics: [{
        label: 'Past 6 weeks',
        value: '38 days',
        delta: '4.10% ↘',
        direction: 'down'
      }, {
        label: 'Past 12 months',
        value: '44 days',
        delta: '9.80% ↘',
        direction: 'down'
      }]
    }
  }];
}
function initialEdges() {
  return [{
    id: 'e-web-mql',
    source: 'web',
    target: 'mql',
    markerEnd: ARROW
  }, {
    id: 'e-events-mql',
    source: 'events',
    target: 'mql',
    markerEnd: ARROW
  }, {
    id: 'e-partner-score',
    source: 'partner',
    target: 'score',
    markerEnd: ARROW
  }, {
    id: 'e-mql-pipeline',
    source: 'mql',
    target: 'pipeline',
    animated: true,
    markerEnd: ARROW
  }, {
    id: 'e-score-pipeline',
    source: 'score',
    target: 'pipeline',
    markerEnd: ARROW
  }, {
    id: 'e-pipeline-arr',
    source: 'pipeline',
    target: 'arr',
    animated: true,
    markerEnd: ARROW
  }, {
    id: 'e-pipeline-retention',
    source: 'pipeline',
    target: 'retention',
    markerEnd: ARROW
  }, {
    id: 'e-pipeline-cycle',
    source: 'pipeline',
    target: 'cycle',
    markerEnd: ARROW
  }].map(edge => ({
    ...edge,
    type: 'default'
  }));
}

/**
 * A custom edge type is a path provider, not a component: LWC fixes the SVG namespace per template
 * and a custom element never upgrades inside `<svg>`, so one renderer paints every edge.
 */
const edgeTypes = Object.freeze({
  wavy: Object.freeze({
    getPath: ({
      sourceX,
      sourceY,
      targetX,
      targetY
    }) => {
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      return {
        path: `M${sourceX},${sourceY} Q${midX - 70},${midY} ${midX},${midY} T${targetX},${targetY}`,
        labelX: midX,
        labelY: midY,
        offsetX: 0,
        offsetY: 0
      };
    },
    defaults: Object.freeze({})
  })
});
const NODE_TYPES = ['card', 'input', 'output', 'default', 'group'];
const TONES = ['violet', 'blue', 'green', 'amber', 'rose'];
const CHIP_TONES = ['slate', ...TONES];
const SIZES = ['md', 'lg'];
const POSITIONS = [Position.Top, Position.Right, Position.Bottom, Position.Left];
function emptyDraft(sequence) {
  return {
    id: `node-${sequence}`,
    type: 'card',
    title: `Metric ${sequence}`,
    meta: 'Input · Sum',
    icon: '◆',
    tone: 'blue',
    size: 'md',
    chipText: '',
    chipTone: 'slate',
    progress: '',
    x: 0,
    y: 0,
    width: 260,
    height: 200,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
    selectable: true,
    connectable: true,
    deletable: true,
    parentId: ''
  };
}

/** `<option selected>` cannot be an expression in an LWC template, so the flag is computed here. */
function options(values, current) {
  return values.map(value => ({
    key: value || 'none',
    value,
    label: value || '(none)',
    selected: value === current
  }));
}

/** Turn the form draft into a node object of the shape `c-flow` expects for the chosen type. */
function buildNode(draft) {
  const node = {
    id: draft.id,
    type: draft.type,
    position: {
      x: Number(draft.x) || 0,
      y: Number(draft.y) || 0
    },
    sourcePosition: draft.sourcePosition,
    targetPosition: draft.targetPosition,
    draggable: draft.draggable,
    selectable: draft.selectable,
    connectable: draft.connectable,
    deletable: draft.deletable,
    data: {
      label: draft.title,
      title: draft.title
    }
  };
  if (draft.parentId) {
    node.parentId = draft.parentId;
    node.extent = 'parent';
  }
  if (draft.type === 'group') {
    node.style = {
      width: Number(draft.width) || 200,
      height: Number(draft.height) || 160
    };
    return node;
  }
  if (draft.type !== 'card') {
    return node;
  }
  node.data = {
    title: draft.title,
    meta: draft.meta || undefined,
    icon: draft.icon || '◆',
    tone: draft.tone,
    size: draft.size
  };
  if (draft.chipText) {
    node.data.chip = {
      text: draft.chipText,
      tone: draft.chipTone
    };
  }
  if (draft.progress !== '') {
    node.data.progress = Math.min(1, Math.max(0, Number(draft.progress) / 100));
  }
  return node;
}
const LOG_LIMIT = 9;

/**
 * Which changes are worth a history entry. A drag emits a position change per pointer move, so only
 * the one that ends it counts; dimension and select changes are measurement and focus, not edits.
 */
function isUndoable(change) {
  if (change.type === 'position') {
    return change.dragging === false;
  }
  return change.type === 'remove' || change.type === 'add' || change.type === 'replace';
}

/**
 * The demo host.
 *
 * It is deliberately written the way a consumer writes one: the graph lives here, `c-flow` never
 * owns it, and every interaction arrives as a change array that is folded back in. The change log
 * on the right is that contract made visible.
 */
class App extends LightningElement {
  constructor(...args) {
    super(...args);
    this.nodes = initialNodes();
    this.edges = initialEdges();
    this.nodeTypes = {
      card: __lwc_component_class_internal$1
    };
    this.edgeTypes = edgeTypes;
    this.snapToGrid = false;
    this.showMinimap = true;
    this.showBackground = true;
    this.showControls = true;
    this.fitView = true;
    this.fitViewOptions = {
      padding: 0.12
    };
    this.zoomLabel = '100%';
    this.logEntries = [];
    this.locked = false;
    this.theme = 'light';
    this.adding = false;
    this.draft = emptyDraft(1);
    this.selectedId = null;
    this.selectedKind = null;
    this._nextId = 1;
    this._logSeq = 0;
    this._past = [];
    this._future = [];
    /**
     * Passed to `c-flow` as a property, so it must be a stable bound function: a fresh arrow on every
     * render would reset the connection gesture mid-drag.
     */
    this.isValidConnection = connection => {
      if (connection.source === connection.target) {
        return false;
      }
      return !this.edges.some(edge => edge.source === connection.source && edge.target === connection.target);
    };
  }
  // ------------------------------------------------------------------ stats

  get nodeCount() {
    return this.nodes.length;
  }
  get edgeCount() {
    return this.edges.length;
  }
  get selectedCount() {
    return this.nodes.filter(node => node.selected).length + this.edges.filter(edge => edge.selected).length;
  }
  get hasNoSelection() {
    return this.selectedCount === 0;
  }
  get nodesDraggable() {
    return !this.locked;
  }
  get themeIcon() {
    return this.theme === 'dark' ? '☀' : '☾';
  }
  get themeTitle() {
    return this.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  }
  get cannotUndo() {
    return this._past.length === 0;
  }
  get cannotRedo() {
    return this._future.length === 0;
  }

  // -------------------------------------------------------------- inspector

  get inspected() {
    if (this.selectedKind === 'node') {
      return this.nodes.find(node => node.id === this.selectedId) ?? null;
    }
    if (this.selectedKind === 'edge') {
      return this.edges.find(edge => edge.id === this.selectedId) ?? null;
    }
    return null;
  }
  get hasInspected() {
    return this.inspected !== null;
  }
  get inspectedIsNode() {
    return this.hasInspected && this.selectedKind === 'node';
  }
  get inspectedTitle() {
    return this.inspected?.data?.title ?? this.inspected?.data?.label ?? '';
  }
  get inspectedRows() {
    const element = this.inspected;
    if (!element) {
      return [];
    }
    const rows = this.selectedKind === 'node' ? [['id', element.id], ['type', element.type ?? 'default'], ['position', `${Math.round(element.position.x)}, ${Math.round(element.position.y)}`], ['size', `${Math.round(element.measured?.width ?? 0)} x ${Math.round(element.measured?.height ?? 0)}`], ['parent', element.parentId ?? '-']] : [['id', element.id], ['type', element.type ?? 'default'], ['source', element.source], ['target', element.target], ['animated', element.animated ? 'true' : 'false']];
    return rows.map(([label, value]) => ({
      key: `${element.id}-${label}`,
      label,
      value: String(value)
    }));
  }

  // ------------------------------------------------------------ new node

  get isCardDraft() {
    return this.draft.type === 'card';
  }
  get isGroupDraft() {
    return this.draft.type === 'group';
  }
  get typeOptions() {
    return options(NODE_TYPES, this.draft.type);
  }
  get draftToneOptions() {
    return options(TONES, this.draft.tone);
  }
  get draftChipToneOptions() {
    return options(CHIP_TONES, this.draft.chipTone);
  }
  get sizeOptions() {
    return options(SIZES, this.draft.size);
  }
  get sourceOptions() {
    return options(POSITIONS, this.draft.sourcePosition);
  }
  get targetOptions() {
    return options(POSITIONS, this.draft.targetPosition);
  }
  get parentOptions() {
    const groups = this.nodes.filter(node => node.type === 'group').map(node => node.id);
    return options(['', ...groups], this.draft.parentId);
  }
  get toneOptions() {
    const current = this.inspected?.data?.tone;
    return ['violet', 'blue', 'green', 'amber', 'rose'].map(tone => ({
      key: tone,
      tone,
      selected: tone === current
    }));
  }

  // -------------------------------------------------- the controlled cycle

  handleNodesChange(event) {
    const {
      changes
    } = event.detail;
    if (changes.some(isUndoable)) {
      this._commit();
    }
    this.nodes = applyNodeChanges(changes, this.nodes);
    this._log(changes.map(change => `node ${change.type}: ${change.id}`));
  }
  handleEdgesChange(event) {
    const {
      changes
    } = event.detail;
    if (changes.some(isUndoable)) {
      this._commit();
    }
    this.edges = applyEdgeChanges(changes, this.edges);
    this._log(changes.map(change => `edge ${change.type}: ${change.id}`));
  }
  handleConnect(event) {
    const connection = event.detail;
    this._commit();
    this.edges = addEdge({
      ...connection,
      type: 'default',
      markerEnd: ARROW
    }, this.edges);
    this._log([`connect: ${connection.source} -> ${connection.target}`]);
  }

  // ------------------------------------------------------------- selection

  handleNodeClick(event) {
    this.selectedKind = 'node';
    this.selectedId = event.detail.id;
  }
  handleEdgeClick(event) {
    this.selectedKind = 'edge';
    this.selectedId = event.detail.id;
  }
  handlePaneClick() {
    this.selectedKind = null;
    this.selectedId = null;
  }
  handleTitleInput(event) {
    const title = event.target.value;
    this.nodes = this.nodes.map(node => node.id === this.selectedId ? {
      ...node,
      data: {
        ...node.data,
        title
      }
    } : node);
  }
  handleToneClick(event) {
    const tone = event.currentTarget.dataset.tone;
    this._commit();
    this.nodes = this.nodes.map(node => node.id === this.selectedId ? {
      ...node,
      data: {
        ...node.data,
        tone
      }
    } : node);
    this._log([`tone ${this.selectedId}: ${tone}`]);
  }
  handleToggleAnimated() {
    this._commit();
    this.edges = this.edges.map(edge => edge.id === this.selectedId ? {
      ...edge,
      animated: !edge.animated
    } : edge);
    this._log([`animated ${this.selectedId}`]);
  }

  // --------------------------------------------------------- undo and redo

  handleUndo() {
    const previous = this._past.pop();
    if (!previous) {
      return;
    }
    this._future.push(this._snapshot());
    this._restore(previous);
    this._log(['undo']);
  }
  handleRedo() {
    const next = this._future.pop();
    if (!next) {
      return;
    }
    this._past.push(this._snapshot());
    this._restore(next);
    this._log(['redo']);
  }
  handleMove(event) {
    this._showZoom(event.detail.viewport.zoom);
  }
  handleNodesInitialized() {
    this._showZoom(this.refs.flow.getZoom());
  }
  connectedCallback() {
    document.documentElement.dataset.theme = this.theme;
  }
  handleFlowError(event) {
    this._log([`error ${event.detail.id}`]);
  }

  // ------------------------------------------------------------- toolbar

  handleOpenAdd() {
    const pane = this.template.querySelector('.demo__canvas').getBoundingClientRect();
    const centre = this.refs.flow.screenToFlowPosition({
      x: pane.left + pane.width / 2,
      y: pane.top + pane.height / 2
    });
    this.draft = {
      ...emptyDraft(this._nextId),
      x: Math.round(centre.x),
      y: Math.round(centre.y)
    };
    this.adding = true;
  }
  handleCancelAdd() {
    this.adding = false;
  }
  handleDraftChange(event) {
    const {
      field
    } = event.target.dataset;
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.draft = {
      ...this.draft,
      [field]: value
    };
  }
  handleCreateNode() {
    const draft = this.draft;
    if (this.nodes.some(node => node.id === draft.id)) {
      this._log([`id taken: ${draft.id}`]);
      return;
    }
    this._commit();
    this.nodes = [...this.nodes, buildNode(draft)];
    this._nextId += 1;
    this.adding = false;
    this._log([`added ${draft.id} (${draft.type})`]);
  }
  handleDeleteSelected() {
    this.refs.flow.deleteElements({
      nodes: this.nodes.filter(node => node.selected),
      edges: this.edges.filter(edge => edge.selected)
    });
  }
  handleFitView() {
    this.refs.flow.fitViewport({
      padding: 0.12,
      duration: 400
    });
  }
  handleEdgeTypeChange(event) {
    const type = event.target.value;
    this._commit();
    this.edges = this.edges.map(edge => ({
      ...edge,
      type
    }));
    this._log([`edge type: ${type}`]);
  }
  handleSnapChange(event) {
    this.snapToGrid = event.target.checked;
  }
  handleMinimapChange(event) {
    this.showMinimap = event.target.checked;
  }
  handleBackgroundChange(event) {
    this.showBackground = event.target.checked;
  }
  handleLockChange(event) {
    this.locked = event.target.checked;
  }

  /**
   * The palette lives on :root, not on this component: a custom property is the only thing that
   * crosses a shadow boundary, so one attribute on <html> re-themes the flow and the node cards too.
   */
  handleThemeToggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = this.theme;
  }
  async handleCopyJson() {
    const json = JSON.stringify({
      nodes: this.nodes,
      edges: this.edges
    }, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      this._log([`copied ${json.length} bytes`]);
    } catch {
      this._log(['clipboard blocked']);
    }
  }
  handleReset() {
    this._commit();
    this.nodes = initialNodes();
    this.edges = initialEdges();
    this.logEntries = [];
    this._log(['reset']);
    this.handleFitView();
  }

  // ------------------------------------------------------------ internals

  _showZoom(zoom) {
    this.zoomLabel = `${Math.round(zoom * 100)}%`;
  }
  _snapshot() {
    return {
      nodes: this.nodes,
      edges: this.edges
    };
  }

  /** Push the state as it is now, then drop the redo stack: a new branch invalidates the old one. */
  _commit() {
    this._past = [...this._past.slice(-40 + 1), this._snapshot()];
    this._future = [];
  }
  _restore({
    nodes,
    edges
  }) {
    this.nodes = nodes;
    this.edges = edges;
  }

  /** Newest first, capped: the log is a demonstration, not a store. */
  _log(messages) {
    if (messages.length === 0) {
      return;
    }
    const entries = messages.map(text => ({
      key: `log-${this._logSeq++}`,
      text
    }));
    this.logEntries = [...entries.reverse(), ...this.logEntries].slice(0, LOG_LIMIT);
  }
  /*LWC compiler v9.4.3*/
}
registerDecorators(App, {
  fields: ["nodes", "edges", "nodeTypes", "edgeTypes", "snapToGrid", "showMinimap", "showBackground", "showControls", "fitView", "fitViewOptions", "zoomLabel", "logEntries", "locked", "theme", "adding", "draft", "selectedId", "selectedKind", "_nextId", "_logSeq", "_past", "_future", "isValidConnection"]
});
const __lwc_component_class_internal = registerComponent(App, {
  tmpl: _tmpl$1,
  sel: "demo-app",
  apiVersion: 66
});

/**
 * Demo entry point.
 *
 * Nothing here is Salesforce-specific: `createElement` from the LWC engine is the same bootstrap a
 * Lightning page performs for `c-flow`, so the components under test are the deployable ones.
 */

const root = document.getElementById('root');
root.textContent = '';
root.appendChild(createElement('demo-app', {
  is: __lwc_component_class_internal
}));
