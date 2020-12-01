(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 566);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiStyles = __webpack_require__(81);
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(44);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(86);

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = __webpack_require__(87);
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk = Chalk(); // eslint-disable-line new-cap
chalk.supportsColor = stdoutColor;
chalk.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk.stderr.supportsColor = stderrColor;

module.exports = chalk;


/***/ }),

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var isProduction = "production" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
    if (condition) {
        return;
    }
    if (isProduction) {
        throw new Error(prefix);
    }
    throw new Error(prefix + ": " + (message || ''));
}

/* harmony default export */ __webpack_exports__["default"] = (invariant);


/***/ }),

/***/ 10:
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * A doubly linked list-based Least Recently Used (LRU) cache. Will keep most
 * recently used items while discarding least recently used items when its limit
 * is reached.
 *
 * Licensed under MIT. Copyright (c) 2010 Rasmus Andersson <http://hunch.se/>
 * See README.md for details.
 *
 * Illustration of the design:
 *
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 */
(function(g,f){
  const e =  true ? exports : undefined;
  f(e);
  if (true) { !(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }
})(this, function(exports) {

const NEWER = Symbol('newer');
const OLDER = Symbol('older');

function LRUMap(limit, entries) {
  if (typeof limit !== 'number') {
    // called as (entries)
    entries = limit;
    limit = 0;
  }

  this.size = 0;
  this.limit = limit;
  this.oldest = this.newest = undefined;
  this._keymap = new Map();

  if (entries) {
    this.assign(entries);
    if (limit < 1) {
      this.limit = this.size;
    }
  }
}

exports.LRUMap = LRUMap;

function Entry(key, value) {
  this.key = key;
  this.value = value;
  this[NEWER] = undefined;
  this[OLDER] = undefined;
}


LRUMap.prototype._markEntryAsUsed = function(entry) {
  if (entry === this.newest) {
    // Already the most recenlty used entry, so no need to update the list
    return;
  }
  // HEAD--------------TAIL
  //   <.older   .newer>
  //  <--- add direction --
  //   A  B  C  <D>  E
  if (entry[NEWER]) {
    if (entry === this.oldest) {
      this.oldest = entry[NEWER];
    }
    entry[NEWER][OLDER] = entry[OLDER]; // C <-- E.
  }
  if (entry[OLDER]) {
    entry[OLDER][NEWER] = entry[NEWER]; // C. --> E
  }
  entry[NEWER] = undefined; // D --x
  entry[OLDER] = this.newest; // D. --> E
  if (this.newest) {
    this.newest[NEWER] = entry; // E. <-- D
  }
  this.newest = entry;
};

LRUMap.prototype.assign = function(entries) {
  let entry, limit = this.limit || Number.MAX_VALUE;
  this._keymap.clear();
  let it = entries[Symbol.iterator]();
  for (let itv = it.next(); !itv.done; itv = it.next()) {
    let e = new Entry(itv.value[0], itv.value[1]);
    this._keymap.set(e.key, e);
    if (!entry) {
      this.oldest = e;
    } else {
      entry[NEWER] = e;
      e[OLDER] = entry;
    }
    entry = e;
    if (limit-- == 0) {
      throw new Error('overflow');
    }
  }
  this.newest = entry;
  this.size = this._keymap.size;
};

LRUMap.prototype.get = function(key) {
  // First, find our cache entry
  var entry = this._keymap.get(key);
  if (!entry) return; // Not cached. Sorry.
  // As <key> was found in the cache, register it as being requested recently
  this._markEntryAsUsed(entry);
  return entry.value;
};

LRUMap.prototype.set = function(key, value) {
  var entry = this._keymap.get(key);

  if (entry) {
    // update existing
    entry.value = value;
    this._markEntryAsUsed(entry);
    return this;
  }

  // new entry
  this._keymap.set(key, (entry = new Entry(key, value)));

  if (this.newest) {
    // link previous tail to the new tail (entry)
    this.newest[NEWER] = entry;
    entry[OLDER] = this.newest;
  } else {
    // we're first in -- yay
    this.oldest = entry;
  }

  // add new entry to the end of the linked list -- it's now the freshest entry.
  this.newest = entry;
  ++this.size;
  if (this.size > this.limit) {
    // we hit the limit -- remove the head
    this.shift();
  }

  return this;
};

LRUMap.prototype.shift = function() {
  // todo: handle special case when limit == 1
  var entry = this.oldest;
  if (entry) {
    if (this.oldest[NEWER]) {
      // advance the list
      this.oldest = this.oldest[NEWER];
      this.oldest[OLDER] = undefined;
    } else {
      // the cache is exhausted
      this.oldest = undefined;
      this.newest = undefined;
    }
    // Remove last strong reference to <entry> and remove links from the purged
    // entry being returned:
    entry[NEWER] = entry[OLDER] = undefined;
    this._keymap.delete(entry.key);
    --this.size;
    return [entry.key, entry.value];
  }
};

// ----------------------------------------------------------------------------
// Following code is optional and can be removed without breaking the core
// functionality.

LRUMap.prototype.find = function(key) {
  let e = this._keymap.get(key);
  return e ? e.value : undefined;
};

LRUMap.prototype.has = function(key) {
  return this._keymap.has(key);
};

LRUMap.prototype['delete'] = function(key) {
  var entry = this._keymap.get(key);
  if (!entry) return;
  this._keymap.delete(entry.key);
  if (entry[NEWER] && entry[OLDER]) {
    // relink the older entry with the newer entry
    entry[OLDER][NEWER] = entry[NEWER];
    entry[NEWER][OLDER] = entry[OLDER];
  } else if (entry[NEWER]) {
    // remove the link to us
    entry[NEWER][OLDER] = undefined;
    // link the newer entry to head
    this.oldest = entry[NEWER];
  } else if (entry[OLDER]) {
    // remove the link to us
    entry[OLDER][NEWER] = undefined;
    // link the newer entry to head
    this.newest = entry[OLDER];
  } else {// if(entry[OLDER] === undefined && entry.newer === undefined) {
    this.oldest = this.newest = undefined;
  }

  this.size--;
  return entry.value;
};

LRUMap.prototype.clear = function() {
  // Not clearing links should be safe, as we don't expose live links to user
  this.oldest = this.newest = undefined;
  this.size = 0;
  this._keymap.clear();
};


function EntryIterator(oldestEntry) { this.entry = oldestEntry; }
EntryIterator.prototype[Symbol.iterator] = function() { return this; }
EntryIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: [ent.key, ent.value] };
  } else {
    return { done: true, value: undefined };
  }
};


function KeyIterator(oldestEntry) { this.entry = oldestEntry; }
KeyIterator.prototype[Symbol.iterator] = function() { return this; }
KeyIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: ent.key };
  } else {
    return { done: true, value: undefined };
  }
};

function ValueIterator(oldestEntry) { this.entry = oldestEntry; }
ValueIterator.prototype[Symbol.iterator] = function() { return this; }
ValueIterator.prototype.next = function() {
  let ent = this.entry;
  if (ent) {
    this.entry = ent[NEWER];
    return { done: false, value: ent.value };
  } else {
    return { done: true, value: undefined };
  }
};


LRUMap.prototype.keys = function() {
  return new KeyIterator(this.oldest);
};

LRUMap.prototype.values = function() {
  return new ValueIterator(this.oldest);
};

LRUMap.prototype.entries = function() {
  return this;
};

LRUMap.prototype[Symbol.iterator] = function() {
  return new EntryIterator(this.oldest);
};

LRUMap.prototype.forEach = function(fun, thisObj) {
  if (typeof thisObj !== 'object') {
    thisObj = this;
  }
  let entry = this.oldest;
  while (entry) {
    fun.call(thisObj, entry.value, entry.key, this);
    entry = entry[NEWER];
  }
};

/** Returns a JSON (array) representation */
LRUMap.prototype.toJSON = function() {
  var s = new Array(this.size), i = 0, entry = this.oldest;
  while (entry) {
    s[i++] = { key: entry.key, value: entry.value };
    entry = entry[NEWER];
  }
  return s;
};

/** Returns a String representation */
LRUMap.prototype.toString = function() {
  var s = '', entry = this.oldest;
  while (entry) {
    s += String(entry.key)+':'+entry.value;
    entry = entry[NEWER];
    if (entry) {
      s += ' < ';
    }
  }
  return s;
};

});


/***/ }),

/***/ 107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "c", function() { return /* binding */ fill; });
__webpack_require__.d(__webpack_exports__, "f", function() { return /* binding */ urlEncode; });
__webpack_require__.d(__webpack_exports__, "e", function() { return /* binding */ normalizeToSize; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* binding */ normalize; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ extractExceptionKeysForMessage; });
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ dropUndefinedKeys; });

// UNUSED EXPORTS: walk

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(23);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/is.js
var is = __webpack_require__(5);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/browser.js

/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function htmlTreeAsString(elem) {
    // try/catch both:
    // - accessing event.target (see getsentry/raven-js#838, #768)
    // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
    // - can throw an exception in some circumstances.
    try {
        var currentElem = elem;
        var MAX_TRAVERSE_HEIGHT = 5;
        var MAX_OUTPUT_LEN = 80;
        var out = [];
        var height = 0;
        var len = 0;
        var separator = ' > ';
        var sepLength = separator.length;
        var nextStr = void 0;
        // eslint-disable-next-line no-plusplus
        while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
            nextStr = _htmlElementAsString(currentElem);
            // bail out if
            // - nextStr is the 'html' element
            // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
            //   (ignore this limit if we are on the first iteration)
            if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)) {
                break;
            }
            out.push(nextStr);
            len += nextStr.length;
            currentElem = currentElem.parentNode;
        }
        return out.reverse().join(separator);
    }
    catch (_oO) {
        return '<unknown>';
    }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */
function _htmlElementAsString(el) {
    var elem = el;
    var out = [];
    var className;
    var classes;
    var key;
    var attr;
    var i;
    if (!elem || !elem.tagName) {
        return '';
    }
    out.push(elem.tagName.toLowerCase());
    if (elem.id) {
        out.push("#" + elem.id);
    }
    // eslint-disable-next-line prefer-const
    className = elem.className;
    if (className && Object(is["h" /* isString */])(className)) {
        classes = className.split(/\s+/);
        for (i = 0; i < classes.length; i++) {
            out.push("." + classes[i]);
        }
    }
    var allowedAttrs = ['type', 'name', 'title', 'alt'];
    for (i = 0; i < allowedAttrs.length; i++) {
        key = allowedAttrs[i];
        attr = elem.getAttribute(key);
        if (attr) {
            out.push("[" + key + "=\"" + attr + "\"]");
        }
    }
    return out.join('');
}
//# sourceMappingURL=browser.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/memo.js
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Memo class used for decycle json objects. Uses WeakSet if available otherwise array.
 */
var Memo = /** @class */ (function () {
    function Memo() {
        this._hasWeakSet = typeof WeakSet === 'function';
        this._inner = this._hasWeakSet ? new WeakSet() : [];
    }
    /**
     * Sets obj to remember.
     * @param obj Object to remember
     */
    Memo.prototype.memoize = function (obj) {
        if (this._hasWeakSet) {
            if (this._inner.has(obj)) {
                return true;
            }
            this._inner.add(obj);
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var i = 0; i < this._inner.length; i++) {
            var value = this._inner[i];
            if (value === obj) {
                return true;
            }
        }
        this._inner.push(obj);
        return false;
    };
    /**
     * Removes object from internal storage.
     * @param obj Object to forget
     */
    Memo.prototype.unmemoize = function (obj) {
        if (this._hasWeakSet) {
            this._inner.delete(obj);
        }
        else {
            for (var i = 0; i < this._inner.length; i++) {
                if (this._inner[i] === obj) {
                    this._inner.splice(i, 1);
                    break;
                }
            }
        }
    };
    return Memo;
}());

//# sourceMappingURL=memo.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/stacktrace.js
var defaultFunctionName = '<anonymous>';
/**
 * Safely extract function name from itself
 */
function getFunctionName(fn) {
    try {
        if (!fn || typeof fn !== 'function') {
            return defaultFunctionName;
        }
        return fn.name || defaultFunctionName;
    }
    catch (e) {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        return defaultFunctionName;
    }
}
//# sourceMappingURL=stacktrace.js.map
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/string.js
var string = __webpack_require__(17);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/object.js






/**
 * Wrap a given object method with a higher-order function
 *
 * @param source An object that contains a method to be wrapped.
 * @param name A name of method to be wrapped.
 * @param replacement A function that should be used to wrap a given method.
 * @returns void
 */
function fill(source, name, replacement) {
    if (!(name in source)) {
        return;
    }
    var original = source[name];
    var wrapped = replacement(original);
    // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
    // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
    if (typeof wrapped === 'function') {
        try {
            wrapped.prototype = wrapped.prototype || {};
            Object.defineProperties(wrapped, {
                __sentry_original__: {
                    enumerable: false,
                    value: original,
                },
            });
        }
        catch (_Oo) {
            // This can throw if multiple fill happens on a global object like XMLHttpRequest
            // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
        }
    }
    source[name] = wrapped;
}
/**
 * Encodes given object into url-friendly format
 *
 * @param object An object that contains serializable values
 * @returns string Encoded
 */
function urlEncode(object) {
    return Object.keys(object)
        .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]); })
        .join('&');
}
/**
 * Transforms any object into an object literal with all it's attributes
 * attached to it.
 *
 * @param value Initial source that we have to transform in order to be usable by the serializer
 */
function getWalkSource(value) {
    if (Object(is["b" /* isError */])(value)) {
        var error = value;
        var err = {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
        for (var i in error) {
            if (Object.prototype.hasOwnProperty.call(error, i)) {
                err[i] = error[i];
            }
        }
        return err;
    }
    if (Object(is["c" /* isEvent */])(value)) {
        var event_1 = value;
        var source = {};
        source.type = event_1.type;
        // Accessing event.target can throw (see getsentry/raven-js#838, #768)
        try {
            source.target = Object(is["a" /* isElement */])(event_1.target)
                ? htmlTreeAsString(event_1.target)
                : Object.prototype.toString.call(event_1.target);
        }
        catch (_oO) {
            source.target = '<unknown>';
        }
        try {
            source.currentTarget = Object(is["a" /* isElement */])(event_1.currentTarget)
                ? htmlTreeAsString(event_1.currentTarget)
                : Object.prototype.toString.call(event_1.currentTarget);
        }
        catch (_oO) {
            source.currentTarget = '<unknown>';
        }
        if (typeof CustomEvent !== 'undefined' && Object(is["d" /* isInstanceOf */])(value, CustomEvent)) {
            source.detail = event_1.detail;
        }
        for (var i in event_1) {
            if (Object.prototype.hasOwnProperty.call(event_1, i)) {
                source[i] = event_1;
            }
        }
        return source;
    }
    return value;
}
/** Calculates bytes size of input string */
function utf8Length(value) {
    // eslint-disable-next-line no-bitwise
    return ~-encodeURI(value).split(/%..|./).length;
}
/** Calculates bytes size of input object */
function jsonSize(value) {
    return utf8Length(JSON.stringify(value));
}
/** JSDoc */
function normalizeToSize(object, 
// Default Node.js REPL depth
depth, 
// 100kB, as 200kB is max payload size, so half sounds reasonable
maxSize) {
    if (depth === void 0) { depth = 3; }
    if (maxSize === void 0) { maxSize = 100 * 1024; }
    var serialized = normalize(object, depth);
    if (jsonSize(serialized) > maxSize) {
        return normalizeToSize(object, depth - 1, maxSize);
    }
    return serialized;
}
/** Transforms any input value into a string form, either primitive value or a type of the input */
function serializeValue(value) {
    var type = Object.prototype.toString.call(value);
    // Node.js REPL notation
    if (typeof value === 'string') {
        return value;
    }
    if (type === '[object Object]') {
        return '[Object]';
    }
    if (type === '[object Array]') {
        return '[Array]';
    }
    var normalized = normalizeValue(value);
    return Object(is["f" /* isPrimitive */])(normalized) ? normalized : type;
}
/**
 * normalizeValue()
 *
 * Takes unserializable input and make it serializable friendly
 *
 * - translates undefined/NaN values to "[undefined]"/"[NaN]" respectively,
 * - serializes Error objects
 * - filter global objects
 */
function normalizeValue(value, key) {
    if (key === 'domain' && value && typeof value === 'object' && value._events) {
        return '[Domain]';
    }
    if (key === 'domainEmitter') {
        return '[DomainEmitter]';
    }
    if (typeof global !== 'undefined' && value === global) {
        return '[Global]';
    }
    if (typeof window !== 'undefined' && value === window) {
        return '[Window]';
    }
    if (typeof document !== 'undefined' && value === document) {
        return '[Document]';
    }
    // React's SyntheticEvent thingy
    if (Object(is["i" /* isSyntheticEvent */])(value)) {
        return '[SyntheticEvent]';
    }
    if (typeof value === 'number' && value !== value) {
        return '[NaN]';
    }
    if (value === void 0) {
        return '[undefined]';
    }
    if (typeof value === 'function') {
        return "[Function: " + getFunctionName(value) + "]";
    }
    return value;
}
/**
 * Walks an object to perform a normalization on it
 *
 * @param key of object that's walked in current iteration
 * @param value object to be walked
 * @param depth Optional number indicating how deep should walking be performed
 * @param memo Optional Memo class handling decycling
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function walk(key, value, depth, memo) {
    if (depth === void 0) { depth = +Infinity; }
    if (memo === void 0) { memo = new Memo(); }
    // If we reach the maximum depth, serialize whatever has left
    if (depth === 0) {
        return serializeValue(value);
    }
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    // If value implements `toJSON` method, call it and return early
    if (value !== null && value !== undefined && typeof value.toJSON === 'function') {
        return value.toJSON();
    }
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    // If normalized value is a primitive, there are no branches left to walk, so we can just bail out, as theres no point in going down that branch any further
    var normalized = normalizeValue(value, key);
    if (Object(is["f" /* isPrimitive */])(normalized)) {
        return normalized;
    }
    // Create source that we will use for next itterations, either objectified error object (Error type with extracted keys:value pairs) or the input itself
    var source = getWalkSource(value);
    // Create an accumulator that will act as a parent for all future itterations of that branch
    var acc = Array.isArray(value) ? [] : {};
    // If we already walked that branch, bail out, as it's circular reference
    if (memo.memoize(value)) {
        return '[Circular ~]';
    }
    // Walk all keys of the source
    for (var innerKey in source) {
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(source, innerKey)) {
            continue;
        }
        // Recursively walk through all the child nodes
        acc[innerKey] = walk(innerKey, source[innerKey], depth - 1, memo);
    }
    // Once walked through all the branches, remove the parent from memo storage
    memo.unmemoize(value);
    // Return accumulated values
    return acc;
}
/**
 * normalize()
 *
 * - Creates a copy to prevent original input mutation
 * - Skip non-enumerablers
 * - Calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializeable values (undefined/NaN/Functions) to serializable format
 * - Translates known global objects/Classes to a string representations
 * - Takes care of Error objects serialization
 * - Optionally limit depth of final output
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function normalize(input, depth) {
    try {
        return JSON.parse(JSON.stringify(input, function (key, value) { return walk(key, value, depth); }));
    }
    catch (_oO) {
        return '**non-serializable**';
    }
}
/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function extractExceptionKeysForMessage(exception, maxLength) {
    if (maxLength === void 0) { maxLength = 40; }
    var keys = Object.keys(getWalkSource(exception));
    keys.sort();
    if (!keys.length) {
        return '[object has no keys]';
    }
    if (keys[0].length >= maxLength) {
        return Object(string["c" /* truncate */])(keys[0], maxLength);
    }
    for (var includedKeys = keys.length; includedKeys > 0; includedKeys--) {
        var serialized = keys.slice(0, includedKeys).join(', ');
        if (serialized.length > maxLength) {
            continue;
        }
        if (includedKeys === keys.length) {
            return serialized;
        }
        return Object(string["c" /* truncate */])(serialized, maxLength);
    }
    return '';
}
/**
 * Given any object, return the new object with removed keys that value was `undefined`.
 * Works recursively on objects and arrays.
 */
function dropUndefinedKeys(val) {
    var e_1, _a;
    if (Object(is["e" /* isPlainObject */])(val)) {
        var obj = val;
        var rv = {};
        try {
            for (var _b = Object(tslib_es6["c" /* __values */])(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (typeof obj[key] !== 'undefined') {
                    rv[key] = dropUndefinedKeys(obj[key]);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return rv;
    }
    if (Array.isArray(val)) {
        return val.map(dropUndefinedKeys);
    }
    return val;
}
//# sourceMappingURL=object.js.map

/***/ }),

/***/ 108:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return get_UTC_timestamp_ms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return get_human_readable_UTC_timestamp_ms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return get_human_readable_UTC_timestamp_seconds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return get_human_readable_UTC_timestamp_minutes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return get_human_readable_UTC_timestamp_days; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return get_ISO8601_extended_ms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return get_ISO8601_simplified_minutes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return get_ISO8601_simplified_day; });
/////////////////////
// ex. 1542780045627
function get_UTC_timestamp_ms(now = new Date()) {
  return +now;
} /////////////////////
// spec:
// - human readable
// - as short as possible
// ex. 20181121
// assumed side effect of being castable to a number


function get_human_readable_UTC_timestamp_days(now = new Date()) {
  const YYYY = now.getUTCFullYear();
  const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
  const DD = String(now.getUTCDate()).padStart(2, '0');
  return `${YYYY}${MM}${DD}`;
} // ex. 20181121_06h00


function get_human_readable_UTC_timestamp_minutes(now = new Date()) {
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mm = String(now.getUTCMinutes()).padStart(2, '0');
  return get_human_readable_UTC_timestamp_days(now) + `_${hh}h${mm}`;
} // ex. 20190608_04h23m15


function get_human_readable_UTC_timestamp_seconds(now = new Date()) {
  const ss = String(now.getUTCSeconds()).padStart(2, '0');
  return get_human_readable_UTC_timestamp_minutes(now) + `m${ss}`;
} // ex.      20181121_06h00m45s632
// formerly 20181121_06h00+45.632


function get_human_readable_UTC_timestamp_ms(now = new Date()) {
  const mmm = String(now.getUTCMilliseconds()).padStart(3, '0');
  return get_human_readable_UTC_timestamp_seconds(now) + `s${mmm}`;
} /////////////////////
// ISO 8601 Extended Format. The format is as follows: YYYY-MM-DDTHH:mm:ss.sssZ
// http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15


function get_ISO8601_extended_ms(now = new Date()) {
  return now.toISOString();
}

function get_ISO8601_simplified_minutes(now = new Date()) {
  return get_ISO8601_extended_ms(now).slice(0, 16);
}

function get_ISO8601_simplified_day(now = new Date()) {
  return get_ISO8601_extended_ms(now).slice(0, 10);
} // fun but unclear
// https://space.stackexchange.com/questions/36628/utc-timestamp-format-for-launch-vehicles

/*function get_space_timestamp_ms(now: Readonly<Date> = new Date()): string {
    const YYYY = now.getUTCFullYear()
    const MM = now.getUTCMonth()
    const DD = ('0' + now.getUTCDate()).slice(-2)
    const hh = ('0' + now.getUTCHours()).slice(-2)
    const mm = ('0' + now.getUTCMinutes()).slice(-2)
    const ss = ('0' + now.getUTCSeconds()).slice(-2)
    const mmm = ('00' + now.getUTCMilliseconds()).slice(-3)

    return `${DD} ${hh}:${mm}:${ss}.${mmm}`
}*/
/////////////////////


 /////////////////////

/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(195);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {};
for (var key in cssKeywords) {
	if (cssKeywords.hasOwnProperty(key)) {
		reverseKeywords[cssKeywords[key]] = key;
	}
}

var convert = module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

// hide .channels and .labels properties
for (var model in convert) {
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		var channels = convert[model].channels;
		var labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}
}

convert.rgb.hsl = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var l;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	var rdif;
	var gdif;
	var bdif;
	var h;
	var s;

	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var v = Math.max(r, g, b);
	var diff = v - Math.min(r, g, b);
	var diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var h = convert.rgb.hsl(rgb)[0];
	var w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var c;
	var m;
	var y;
	var k;

	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k) || 0;
	m = (1 - g - k) / (1 - k) || 0;
	y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
	return (
		Math.pow(x[0] - y[0], 2) +
		Math.pow(x[1] - y[1], 2) +
		Math.pow(x[2] - y[2], 2)
	);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	var currentClosestDistance = Infinity;
	var currentClosestKeyword;

	for (var keyword in cssKeywords) {
		if (cssKeywords.hasOwnProperty(keyword)) {
			var value = cssKeywords[keyword];

			// Compute comparative distance
			var distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;

	// assume sRGB
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb);
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	var h = hsl[0] / 360;
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var t1;
	var t2;
	var t3;
	var rgb;
	var val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	t1 = 2 * l - t2;

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}
		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0];
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var smin = s;
	var lmin = Math.max(l, 0.01);
	var sv;
	var v;

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	v = (l + s) / 2;
	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60;
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var hi = Math.floor(h) % 6;

	var f = h - Math.floor(h);
	var p = 255 * v * (1 - s);
	var q = 255 * v * (1 - (s * f));
	var t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var h = hsv[0];
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;
	var vmin = Math.max(v, 0.01);
	var lmin;
	var sl;
	var l;

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	var h = hwb[0] / 360;
	var wh = hwb[1] / 100;
	var bl = hwb[2] / 100;
	var ratio = wh + bl;
	var i;
	var v;
	var f;
	var n;

	// wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	n = wh + f * (v - wh); // linear interpolation

	var r;
	var g;
	var b;
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100;
	var m = cmyk[1] / 100;
	var y = cmyk[2] / 100;
	var k = cmyk[3] / 100;
	var r;
	var g;
	var b;

	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	var x = xyz[0] / 100;
	var y = xyz[1] / 100;
	var z = xyz[2] / 100;
	var r;
	var g;
	var b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// assume sRGB
	r = r > 0.0031308
		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0];
	var y = xyz[1];
	var z = xyz[2];
	var l;
	var a;
	var b;

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var x;
	var y;
	var z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	var y2 = Math.pow(y, 3);
	var x2 = Math.pow(x, 3);
	var z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	var l = lab[0];
	var a = lab[1];
	var b = lab[2];
	var hr;
	var h;
	var c;

	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	var l = lch[0];
	var c = lch[1];
	var h = lch[2];
	var a;
	var b;
	var hr;

	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];
	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	var ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0];
	var g = args[1];
	var b = args[2];

	// we use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	var ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	// handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	var mult = (~~(args > 50) + 1) * 0.5;
	var r = ((color & 1) * mult) * 255;
	var g = (((color >> 1) & 1) * mult) * 255;
	var b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// handle greyscale
	if (args >= 232) {
		var c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;
	var r = Math.floor(args / 36) / 5 * 255;
	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	var b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	var integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	var colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');
	}

	var integer = parseInt(colorString, 16);
	var r = (integer >> 16) & 0xFF;
	var g = (integer >> 8) & 0xFF;
	var b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	var r = rgb[0] / 255;
	var g = rgb[1] / 255;
	var b = rgb[2] / 255;
	var max = Math.max(Math.max(r, g), b);
	var min = Math.min(Math.min(r, g), b);
	var chroma = (max - min);
	var grayscale;
	var hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma + 4;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100;
	var l = hsl[2] / 100;
	var c = 1;
	var f = 0;

	if (l < 0.5) {
		c = 2.0 * s * l;
	} else {
		c = 2.0 * s * (1.0 - l);
	}

	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100;
	var v = hsv[2] / 100;

	var c = s * v;
	var f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360;
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	var pure = [0, 0, 0];
	var hi = (h % 1) * 6;
	var v = hi % 1;
	var w = 1 - v;
	var mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var v = c + g * (1.0 - c);
	var f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;

	var l = g * (1.0 - c) + 0.5 * c;
	var s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100;
	var g = hcg[2] / 100;
	var v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100;
	var b = hwb[2] / 100;
	var v = 1 - b;
	var c = v - w;
	var g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
	var integer = (val << 16) + (val << 8) + val;

	var string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return STRICT_STANDARD_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return QUASI_STANDARD_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return COMMON_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return COMMON_ERROR_FIELDS_EXTENDED; });
const STRICT_STANDARD_ERROR_FIELDS = new Set([// standard fields
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
'name', 'message']);
const QUASI_STANDARD_ERROR_FIELDS = new Set([// conv to array needed due to a babel bug 😢
...Array.from(STRICT_STANDARD_ERROR_FIELDS), // quasi-standard: followed by all browsers + node
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
'stack']);
const COMMON_ERROR_FIELDS = new Set([// conv to array needed due to a babel bug 😢
...Array.from(QUASI_STANDARD_ERROR_FIELDS), // standard in node only:
'code', // https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes
// non standard but widely used:
'statusCode', 'shouldRedirect', 'framesToPop']);
const COMMON_ERROR_FIELDS_EXTENDED = new Set([// conv to array needed due to a babel bug 😢
...Array.from(COMMON_ERROR_FIELDS), // My (Offirmo) extensions:
'details', '_temp']);

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return generic_migrate_to_latest; });
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);



const LIBS = {};
const get_state_summary = _selectors__WEBPACK_IMPORTED_MODULE_2__[/* get_base_loose */ "a"]; ////////////////////////////////////////////////////////////////////////////////////

function generic_migrate_to_latest({
  SEC,
  LIB,
  SCHEMA_VERSION,
  legacy_state,
  hints,
  sub_states_migrate_to_latest,
  // no default to force thinking
  cleanup = (SEC, state, hints) => state,
  pipeline
}) {
  return SEC.xTry('migrate_to_latest', ({
    SEC,
    logger
  }) => {
    const existing_version = Object(_selectors__WEBPACK_IMPORTED_MODULE_2__[/* get_schema_version_loose */ "e"])(legacy_state);
    console.groupCollapsed(`migration of schema ${LIB} from v${existing_version} to v${SCHEMA_VERSION}`);
    const RSEC = SEC;
    RSEC.setLogicalStack({
      module: LIB
    });
    RSEC.setAnalyticsAndErrorDetails({
      version_from: existing_version,
      version_to: SCHEMA_VERSION
    });
    if (existing_version > SCHEMA_VERSION) throw new Error('Your data is from a more recent version of this lib. Please update!');
    let state = legacy_state; // for starter, may actually be true

    if (existing_version < SCHEMA_VERSION) {
      logger.info(`attempting to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}…`);
      RSEC.fireAnalyticsEvent('schema_migration.began');

      function previous(index, SEC, legacy_state, hints) {
        const migrate_step = pipeline[index];
        const current_step_name = index >= pipeline.length ? 'not-found' : (migrate_step === null || migrate_step === void 0 ? void 0 : migrate_step.name) || 'unknown';
        return RSEC.xTry('migration step:' + current_step_name, ({
          SEC
        }) => {
          if (index >= pipeline.length) {
            throw new Error(`No known migration for updating a v${Object(_selectors__WEBPACK_IMPORTED_MODULE_2__[/* get_schema_version_loose */ "e"])(legacy_state)}!`);
          }

          Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof migrate_step === 'function', 'migrate step should be a function!');
          const legacy_schema_version = Object(_selectors__WEBPACK_IMPORTED_MODULE_2__[/* get_schema_version_loose */ "e"])(legacy_state); //_last_SEC = SEC
          //console.log('_last_SEC now =', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())

          logger.trace(`[${LIB}] ⭆ invoking migration pipeline step ${pipeline.length - index}/${pipeline.length} "${current_step_name}"…`, get_state_summary(legacy_state));
          const state = migrate_step(SEC, legacy_state, hints, previous.bind(null, index + 1), legacy_schema_version, LIBS);
          Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(!!state, 'migration step should return something');
          logger.trace(`[${LIB}] ⭅ returned from migration pipeline step ${pipeline.length - index}/${pipeline.length} "${current_step_name}".`, get_state_summary(state)); //_check_response(SEC, index, 'out')

          return state;
        });
      } // launch the chain


      try {
        state = previous(0, RSEC, state, hints);
      } catch (err) {
        logger.error(`failed to migrate schema of ${LIB} from v${existing_version} to v${SCHEMA_VERSION}!`);
        RSEC.fireAnalyticsEvent('schema_migration.failed');
        throw err;
      }

      logger.info(`${LIB}: schema migration successful.`, get_state_summary(state));
      RSEC.fireAnalyticsEvent('schema_migration.ended');
    } // migrate sub-reducers if any...


    if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_UTBundle */ "f"])(state)) {
      state = _migrate_sub_states__bundle(SEC, state, sub_states_migrate_to_latest, hints);
    } else if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_RootState */ "c"])(state)) {
      state = _migrate_sub_states__root(SEC, state, sub_states_migrate_to_latest, hints);
    } else if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_BaseState */ "b"])(state)) {
      state = _migrate_sub_states__base(SEC, state, sub_states_migrate_to_latest, hints);
    } else {
      Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(false, 'should be a recognized OffirmoState!');
    }

    state = cleanup(SEC, state, hints);
    console.groupEnd();
    return state;
  });
}

function _migrate_sub_states__bundle(SEC, state, sub_states_migrate_to_latest, hints) {
  let has_change = false;
  let [u_state, t_state] = state;
  const unmigrated_sub_states = new Set([...Object.keys(sub_states_migrate_to_latest)]);
  const sub_states_found = new Set();
  const sub_u_states_found = new Set();
  const sub_t_states_found = new Set(); // using base state in case of a legacy state

  for (let key in u_state) {
    if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* has_versioned_schema */ "a"])(u_state[key])) {
      sub_states_found.add(key);
      sub_u_states_found.add(key);
    }
  }

  for (let key in t_state) {
    if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* has_versioned_schema */ "a"])(t_state[key])) {
      sub_states_found.add(key);
      sub_t_states_found.add(key);
    }
  }
  /*
  console.log({
      sub_states_found,
      sub_u_states_found,
      sub_t_states_found,
  })
  */


  const sub_states_migrated = new Set();
  sub_states_found.forEach(key => {
    const migrate_sub_to_latest = sub_states_migrate_to_latest[key];
    if (!migrate_sub_to_latest) throw new Error(`Found sub-state "${key}" but no migration fn was provided!`);
    const sub_hints = hints[key];
    const previous_sub_ustate = u_state[key];
    const previous_sub_tstate = t_state[key];
    let new_sub_ustate = previous_sub_ustate;
    let new_sub_tstate = previous_sub_tstate;
    SEC.xTry(`migration of sub-state "${key}"`, ({
      SEC,
      logger
    }) => {
      if (sub_u_states_found.has(key) && sub_t_states_found.has(key)) {
        // combo
        const legacy_sub_state = [previous_sub_ustate, previous_sub_tstate];
        logger.trace(`⭆ invoking migration fn of bundled sub-state "${key}"…`, get_state_summary(legacy_sub_state));
        [new_sub_ustate, new_sub_tstate] = migrate_sub_to_latest(SEC, legacy_sub_state, sub_hints);
      } else if (sub_u_states_found.has(key)) {
        logger.trace(`⭆ invoking migration fn of sub-UState "${key}"…`, get_state_summary(previous_sub_ustate));
        new_sub_ustate = migrate_sub_to_latest(SEC, previous_sub_ustate, sub_hints);
      } else if (sub_t_states_found.has(key)) {
        logger.trace(`⭆ invoking migration fn of sub-TState "${key}"…`, get_state_summary(previous_sub_tstate));
        new_sub_tstate = migrate_sub_to_latest(SEC, previous_sub_tstate, sub_hints);
      } else {
        throw new Error(`Expected sub-state "${key}" was not found!`);
      }

      logger.trace(`⭅ returned from migration fn of sub-*state "${key}".`);
    });

    if (previous_sub_ustate && new_sub_ustate !== previous_sub_ustate) {
      has_change = true;
      u_state = { ...u_state,
        [key]: new_sub_ustate
      };
    }

    if (previous_sub_tstate && new_sub_tstate !== previous_sub_tstate) {
      has_change = true;
      t_state = { ...t_state,
        [key]: new_sub_tstate
      };
    }

    sub_states_migrated.add(key);
    unmigrated_sub_states.delete(key);
  });
  if (unmigrated_sub_states.size) throw new Error(`Specified sub-states not found! ${Array.from(unmigrated_sub_states).join(',')}`);
  if (!has_change) return state;
  return [u_state, t_state];
}

function _migrate_sub_states__root(SEC, state, sub_states_migrate_to_latest, hints) {
  const {
    u_state: previous_u_state,
    t_state: previous_t_state
  } = state;
  const previous_state_as_bundle = [previous_u_state, previous_t_state];

  const migrated_bundle = _migrate_sub_states__bundle(SEC, previous_state_as_bundle, sub_states_migrate_to_latest, hints);

  if (migrated_bundle === previous_state_as_bundle) return state;
  return { ...state,
    u_state: migrated_bundle[0],
    t_state: migrated_bundle[1]
  };
}

function _migrate_sub_states__base(SEC, state, sub_states_migrate_to_latest, hints) {
  //let has_change = false
  const legacy_state = state;

  for (let key in sub_states_migrate_to_latest) {
    if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* has_versioned_schema */ "a"])(legacy_state[key])) {
      throw new Error('_migrate_sub_states__base() NIMP!');
    }
  }

  return state;
}

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return enforce_immutability; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return complete_or_cancel_eager_mutation_propagating_possible_child_mutation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return are_ustate_revision_requirements_met; });
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var icepick__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(143);
/* harmony import */ var icepick__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(icepick__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3);




const enforce_immutability = state => icepick__WEBPACK_IMPORTED_MODULE_1___default.a.freeze(state); // Use this in case of reducing a child state while unsure whether this child state has changed or not.
// - the best case is to return 'previous' = no mutation
// - if a child state's revision increased, increase ours and keep the mutation
// - it's possible that an "update to now" was invoked, it's ok to ignore that if that's the only change
// - this fn will intentionally NOT go deeper than 1st level, each state is responsible for itself!
// - this fn will intentionally NOT handle time changes, this should be done separately at the end! (separate update_to_now call)

function complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous, current, updated = previous, debug_id = 'unknown src') {
  const PREFIX = `CoCEMPPCM(${debug_id})`;
  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(previous, `${PREFIX}: should have previous`);
  /*if (!previous)
      return current*/

  if (current === previous) return previous;
  if (current === updated) return previous;

  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UTBundle */ "f"])(current)) {
    // this is a more advanced state
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UTBundle */ "f"])(previous), `${PREFIX}: previous also has bundle data structure!`);
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UTBundle */ "f"])(updated), `${PREFIX}: updated also has bundle data structure!`);
    const final_u_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous[0], current[0], updated === null || updated === void 0 ? void 0 : updated[0]);
    const final_t_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous[1], current[1], updated === null || updated === void 0 ? void 0 : updated[1]);
    if (final_u_state === previous[0] && final_t_state === previous[1]) return previous;
    if (final_u_state === updated[0] && final_t_state === updated[1]) return previous;
    return enforce_immutability([final_u_state, final_t_state]);
  } else if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_RootState */ "c"])(current)) {
    // this is a more advanced state
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_RootState */ "c"])(previous), `${PREFIX}: previous also has root data structure!`);
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_RootState */ "c"])(updated), `${PREFIX}: updated also has root data structure!`);
    const final_u_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous.u_state, current.u_state, updated.u_state, debug_id + '.u_state');
    const final_t_state = complete_or_cancel_eager_mutation_propagating_possible_child_mutation(previous.t_state, current.t_state, updated.t_state, debug_id + '.t_state');
    if (final_u_state === previous.u_state && final_t_state === previous.t_state) return previous;
    if (final_u_state === updated.u_state && final_t_state === updated.t_state) return previous;
    return enforce_immutability({ ...current,
      u_state: final_u_state,
      t_state: final_t_state
    });
  } //let is_t_state = is_TState(current)


  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UState */ "e"])(current) || Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_TState */ "d"])(current), `${PREFIX}: current has U/TState data structure!`); // unneeded except for helping TS type inference

  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UState */ "e"])(previous) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UState */ "e"])(updated) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_UState */ "e"])(current) || Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_TState */ "d"])(previous) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_TState */ "d"])(updated) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_TState */ "d"])(current), `${PREFIX}: current+previous+updated have the same U/TState data structure!`);
  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(previous.revision === updated.revision, `${PREFIX}: previous & updated should have the same revision`);
  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(current.revision >= previous.revision, `${PREFIX}: current >= previous revision`);
  if (current.revision !== previous.revision) throw new Error(`${PREFIX}: revision already incremented! This call is not needed since you’re sure there was a change!`);
  const typed_previous = previous;
  const typed_updated = updated;
  const typed_current = current;
  let has_child_revision_increment = false; //let has_non_child_key_change = false
  //let has_timestamp_change: boolean | undefined = undefined

  for (const k in typed_current) {
    const previous_has_revision = Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_WithRevision */ "g"])(typed_updated[k]);
    const current_has_revision = Object(_type_guards__WEBPACK_IMPORTED_MODULE_2__[/* is_WithRevision */ "g"])(typed_current[k]);
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(previous_has_revision === current_has_revision, `${PREFIX}/${k}: revisioning should be coherent!`);

    if (!current_has_revision) {
      //let has_change = typed_updated[k] !== typed_current[k]
      //has_non_child_key_change ||= has_change
      Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(typed_updated[k] === typed_current[k], `${PREFIX}/${k}: manual change on Base/UState non-child key seen! This call is not needed since you’re sure there was a change!`);
    }

    const previous_revision = Object(_selectors__WEBPACK_IMPORTED_MODULE_3__[/* get_revision_loose */ "c"])(typed_previous[k]);
    const updated_revision = Object(_selectors__WEBPACK_IMPORTED_MODULE_3__[/* get_revision_loose */ "c"])(typed_updated[k]);
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(previous_revision === updated_revision, `${PREFIX}/${k}: previous & updated child should have the same revision`);
    const current_revision = Object(_selectors__WEBPACK_IMPORTED_MODULE_3__[/* get_revision_loose */ "c"])(typed_current[k]);

    if (current_revision !== updated_revision) {
      if (current_revision !== updated_revision + 1) {// NO! It may be normal for a sub to have been stimulated more than once,
        // ex. gained 3 achievements
        //throw new Error(...)
      }

      has_child_revision_increment = true;
      break;
    }
  }

  if (!has_child_revision_increment) return previous;
  return enforce_immutability({ ...current,
    revision: Object(_selectors__WEBPACK_IMPORTED_MODULE_3__[/* get_revision */ "b"])(current) + 1
  });
} // check if the state is still in the revision we expect
// ex. for an action, check it's still valid, ex. object already sold?

function are_ustate_revision_requirements_met(state, requirements = {}) {
  for (const k in requirements) {
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(state.u_state[k], `are_ustate_revision_requirements_met(): sub state not found: "${k}"!`);
    const current_revision = state.u_state[k].revision;
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Number.isInteger(current_revision), `are_ustate_revision_requirements_met(): sub state has no/invalid revision: "${k}"!`);
    if (current_revision !== requirements[k]) return false;
  }

  return true;
}

/***/ }),

/***/ 112:
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getGlobalObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return uuid4; });
/* unused harmony export parseUrl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getEventDescription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return consoleSandbox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return addExceptionTypeValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return addExceptionMechanism; });
/* unused harmony export getLocationHref */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return parseSemver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return parseRetryAfterHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addContextToFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return stripUrlQueryAndFragment; });
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34);
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(17);


var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
    return (Object(_node__WEBPACK_IMPORTED_MODULE_0__[/* isNodeEnv */ "c"])()
        ? global
        : typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : fallbackGlobalObject);
}
/**
 * UUID4 generator
 *
 * @returns string Generated UUID4.
 */
function uuid4() {
    var global = getGlobalObject();
    var crypto = global.crypto || global.msCrypto;
    if (!(crypto === void 0) && crypto.getRandomValues) {
        // Use window.crypto API if available
        var arr = new Uint16Array(8);
        crypto.getRandomValues(arr);
        // set 4 in byte 7
        // eslint-disable-next-line no-bitwise
        arr[3] = (arr[3] & 0xfff) | 0x4000;
        // set 2 most significant bits of byte 9 to '10'
        // eslint-disable-next-line no-bitwise
        arr[4] = (arr[4] & 0x3fff) | 0x8000;
        var pad = function (num) {
            var v = num.toString(16);
            while (v.length < 4) {
                v = "0" + v;
            }
            return v;
        };
        return (pad(arr[0]) + pad(arr[1]) + pad(arr[2]) + pad(arr[3]) + pad(arr[4]) + pad(arr[5]) + pad(arr[6]) + pad(arr[7]));
    }
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // eslint-disable-next-line no-bitwise
        var r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-bitwise
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */
function parseUrl(url) {
    if (!url) {
        return {};
    }
    var match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {};
    }
    // coerce to undefined values to empty string so we don't get 'undefined'
    var query = match[6] || '';
    var fragment = match[8] || '';
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        relative: match[5] + query + fragment,
    };
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */
function getEventDescription(event) {
    if (event.message) {
        return event.message;
    }
    if (event.exception && event.exception.values && event.exception.values[0]) {
        var exception = event.exception.values[0];
        if (exception.type && exception.value) {
            return exception.type + ": " + exception.value;
        }
        return exception.type || exception.value || event.event_id || '<unknown>';
    }
    return event.event_id || '<unknown>';
}
/** JSDoc */
function consoleSandbox(callback) {
    var global = getGlobalObject();
    var levels = ['debug', 'info', 'warn', 'error', 'log', 'assert'];
    if (!('console' in global)) {
        return callback();
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    var originalConsole = global.console;
    var wrappedLevels = {};
    // Restore all wrapped console methods
    levels.forEach(function (level) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (level in global.console && originalConsole[level].__sentry_original__) {
            wrappedLevels[level] = originalConsole[level];
            originalConsole[level] = originalConsole[level].__sentry_original__;
        }
    });
    // Perform callback manipulations
    var result = callback();
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(function (level) {
        originalConsole[level] = wrappedLevels[level];
    });
    return result;
}
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */
function addExceptionTypeValue(event, value, type) {
    event.exception = event.exception || {};
    event.exception.values = event.exception.values || [];
    event.exception.values[0] = event.exception.values[0] || {};
    event.exception.values[0].value = event.exception.values[0].value || value || '';
    event.exception.values[0].type = event.exception.values[0].type || type || 'Error';
}
/**
 * Adds exception mechanism to a given event.
 * @param event The event to modify.
 * @param mechanism Mechanism of the mechanism.
 * @hidden
 */
function addExceptionMechanism(event, mechanism) {
    if (mechanism === void 0) { mechanism = {}; }
    // TODO: Use real type with `keyof Mechanism` thingy and maybe make it better?
    try {
        // @ts-ignore Type 'Mechanism | {}' is not assignable to type 'Mechanism | undefined'
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.exception.values[0].mechanism = event.exception.values[0].mechanism || {};
        Object.keys(mechanism).forEach(function (key) {
            // @ts-ignore Mechanism has no index signature
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            event.exception.values[0].mechanism[key] = mechanism[key];
        });
    }
    catch (_oO) {
        // no-empty
    }
}
/**
 * A safe form of location.href
 */
function getLocationHref() {
    try {
        return document.location.href;
    }
    catch (oO) {
        return '';
    }
}
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
var SEMVER_REGEXP = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */
function parseSemver(input) {
    var match = input.match(SEMVER_REGEXP) || [];
    var major = parseInt(match[1], 10);
    var minor = parseInt(match[2], 10);
    var patch = parseInt(match[3], 10);
    return {
        buildmetadata: match[5],
        major: isNaN(major) ? undefined : major,
        minor: isNaN(minor) ? undefined : minor,
        patch: isNaN(patch) ? undefined : patch,
        prerelease: match[4],
    };
}
var defaultRetryAfter = 60 * 1000; // 60 seconds
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param now current unix timestamp
 * @param header string representation of 'Retry-After' header
 */
function parseRetryAfterHeader(now, header) {
    if (!header) {
        return defaultRetryAfter;
    }
    var headerDelay = parseInt("" + header, 10);
    if (!isNaN(headerDelay)) {
        return headerDelay * 1000;
    }
    var headerDate = Date.parse("" + header);
    if (!isNaN(headerDate)) {
        return headerDate - now;
    }
    return defaultRetryAfter;
}
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */
function addContextToFrame(lines, frame, linesOfContext) {
    if (linesOfContext === void 0) { linesOfContext = 5; }
    var lineno = frame.lineno || 0;
    var maxLines = lines.length;
    var sourceLine = Math.max(Math.min(maxLines, lineno - 1), 0);
    frame.pre_context = lines
        .slice(Math.max(0, sourceLine - linesOfContext), sourceLine)
        .map(function (line) { return Object(_string__WEBPACK_IMPORTED_MODULE_1__[/* snipLine */ "b"])(line, 0); });
    frame.context_line = Object(_string__WEBPACK_IMPORTED_MODULE_1__[/* snipLine */ "b"])(lines[Math.min(maxLines - 1, sourceLine)], frame.colno || 0);
    frame.post_context = lines
        .slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext)
        .map(function (line) { return Object(_string__WEBPACK_IMPORTED_MODULE_1__[/* snipLine */ "b"])(line, 0); });
}
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */
function stripUrlQueryAndFragment(urlPath) {
    // eslint-disable-next-line no-useless-escape
    return urlPath.split(/[\?#]/, 1)[0];
}
//# sourceMappingURL=misc.js.map

/***/ }),

/***/ 141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ SemanticDifference; });
__webpack_require__.d(__webpack_exports__, "d", function() { return /* binding */ s_max; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* binding */ get_semantic_difference; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ compare; });

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/tiny-invariant/dist/tiny-invariant.esm.js
var tiny_invariant_esm = __webpack_require__(1);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/typescript-string-enums/dist/index.js
var dist = __webpack_require__(7);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/dequal/dist/index.mjs
var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/state-utils/dist/src.es2019/type-guards.js
var type_guards = __webpack_require__(2);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/state-utils/dist/src.es2019/selectors.js
var selectors = __webpack_require__(3);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/state-utils/dist/src.es2019/comparators.js




const jsondiffpatch = __webpack_require__(191);


 // tslint:disable-next-line: variable-name

const SemanticDifference = Object(dist["Enum"])('none', 'time', // TODO refine this one
'minor', 'major');
function s_max(a, b) {
  if (a === SemanticDifference.major || b === SemanticDifference.major) return SemanticDifference.major;
  if (a === SemanticDifference.minor || b === SemanticDifference.minor) return SemanticDifference.minor;
  if (a === SemanticDifference.time || b === SemanticDifference.time) return SemanticDifference.time;
  return SemanticDifference.none;
} // newer and older so that we get order check as a side-effect
// TODO improve unclear params

function get_semantic_difference(newer, older, {
  assert_newer = true
} = {}) {
  //console.log({ newer, older })
  Object(tiny_invariant_esm["default"])(newer, `get_semantic_difference() should have a newer at least!`); // trivial

  if (newer === older) return SemanticDifference.none;
  if (!older) return SemanticDifference.minor; // init, by convention
  // check major = schema version

  const newer_schema_version = Object(selectors["e" /* get_schema_version_loose */])(newer);
  const older_schema_version = Object(selectors["e" /* get_schema_version_loose */])(older); //console.log({ newer_schema_version, older_schema_version })

  if (assert_newer) {
    Object(tiny_invariant_esm["default"])(newer_schema_version >= older_schema_version, `get_semantic_difference() schema version order: ${newer_schema_version} >= ${older_schema_version}`);
  }

  if (newer_schema_version !== older_schema_version) return SemanticDifference.major; // check minor = revision

  if (Object(type_guards["c" /* is_RootState */])(newer)) {
    //console.log('root state')
    const u_diff = get_semantic_difference(newer.u_state, older === null || older === void 0 ? void 0 : older.u_state, {
      assert_newer
    });
    const t_diff = get_semantic_difference(newer.t_state, older === null || older === void 0 ? void 0 : older.t_state, {
      assert_newer
    });
    const sub_diff = s_max(u_diff, t_diff); //console.log({ u_diff, t_diff, sub_diff })

    if (sub_diff === SemanticDifference.major) throw new Error('get_semantic_difference() A major sub state change wasn’t propagated to the root!'); //console.log({ sub_diff })

    return sub_diff;
  } // do they even have revisions?


  const newer_has_revision = Object(type_guards["j" /* is_revisioned */])(newer);
  const older_has_revision = Object(type_guards["j" /* is_revisioned */])(older);
  const no_revisions = !newer_has_revision && !older_has_revision;
  if (no_revisions) return SemanticDifference.minor; // they are different. what else can we infer?

  if (assert_newer) {
    Object(tiny_invariant_esm["default"])(newer_has_revision, `get_semantic_difference() schema version order: rev=${newer_has_revision} >= rev=${older_has_revision}`);
  }

  if (newer_has_revision !== older_has_revision) return SemanticDifference.major; // compare revisions

  const newer_revision = Object(selectors["c" /* get_revision_loose */])(newer);
  const older_revision = Object(selectors["c" /* get_revision_loose */])(older); //console.log({ newer_revision, older_revision })

  if (assert_newer) Object(tiny_invariant_esm["default"])(newer_revision >= older_revision, 'get_semantic_difference() revision order');

  if (newer_revision !== older_revision) {
    //console.log({ newer_revision, older_revision })
    return SemanticDifference.minor;
  } // major & minor equal, only diff left is time


  const newer_has_timestamp = Object(type_guards["k" /* is_time_stamped */])(newer);
  const older_has_timestamp = Object(type_guards["k" /* is_time_stamped */])(older);

  if (newer_has_timestamp && older_has_timestamp) {
    const newer_timestamp = Object(selectors["f" /* get_timestamp */])(newer);
    const older_timestamp = Object(selectors["f" /* get_timestamp */])(older);

    if (assert_newer) {
      Object(tiny_invariant_esm["default"])(newer_timestamp >= older_timestamp, `get_semantic_difference() timestamp order: t=${newer_timestamp} >= t=${older_timestamp}`);
    }

    if (newer_timestamp !== older_timestamp) return SemanticDifference.time;
  } // we couldn't find any semantic difference.
  // however, the objects are different so bad immutability could have kicked in...


  const is_truely_equal = dequal(newer, older);

  if (!is_truely_equal) {
    const advanced_comparator = jsondiffpatch.create({
      // used to match objects when diffing arrays, by default only === operator is used
      objectHash: obj => JSON.stringify(obj)
    });
    const get_advanced_diff = advanced_comparator.diff.bind(advanced_comparator);
    const diff = get_advanced_diff(newer, older);
    console.error('ERROR get_semantic_difference() deep eq of semantically equal objects!', diff);
    debugger;
  }

  Object(tiny_invariant_esm["default"])(is_truely_equal, 'get_semantic_difference() deep eq of semantically equal objects');
  return SemanticDifference.none;
}
function compare(a, b) {
  //console.log('compare()', { a, b })
  const schema_version__a = Object(selectors["e" /* get_schema_version_loose */])(a);
  const schema_version__b = Object(selectors["e" /* get_schema_version_loose */])(b);
  if (schema_version__a !== schema_version__b) return schema_version__a - schema_version__b;
  const revision__a = Object(selectors["c" /* get_revision_loose */])(a);
  const revision__b = Object(selectors["c" /* get_revision_loose */])(b);
  if (revision__a !== revision__b) return revision__a - revision__b;
  const is_root__a = Object(type_guards["c" /* is_RootState */])(a);
  const is_root__b = Object(type_guards["c" /* is_RootState */])(b);
  if (is_root__a !== is_root__b) return (is_root__a ? 1 : 0) - (is_root__b ? 1 : 0);

  if (is_root__a) {
    const u_state_rev__a = Object(selectors["b" /* get_revision */])(a.u_state);
    const u_state_rev__b = Object(selectors["b" /* get_revision */])(b.u_state);
    if (u_state_rev__a !== u_state_rev__b) return u_state_rev__a - u_state_rev__b;
    const t_state_rev__a = Object(selectors["b" /* get_revision */])(a.t_state);
    const t_state_rev__b = Object(selectors["b" /* get_revision */])(b.t_state);
    if (t_state_rev__a !== t_state_rev__b) return t_state_rev__a - t_state_rev__b;
    const t_state_tms__a = Object(selectors["f" /* get_timestamp */])(b.t_state);
    const t_state_tms__b = Object(selectors["f" /* get_timestamp */])(b.t_state);
    if (t_state_tms__a !== t_state_tms__b) return t_state_tms__a - t_state_tms__b;
  }

  const tms__a = Object(selectors["g" /* get_timestamp_loose */])(a);
  const tms__b = Object(selectors["g" /* get_timestamp_loose */])(b);
  if (tms__a !== tms__b) return tms__a - tms__b;
  return 0;
}

/***/ }),

/***/ 142:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const anyMap = new WeakMap();
const eventsMap = new WeakMap();
const producersMap = new WeakMap();
const anyProducer = Symbol('anyProducer');
const resolvedPromise = Promise.resolve();

const listenerAdded = Symbol('listenerAdded');
const listenerRemoved = Symbol('listenerRemoved');

function assertEventName(eventName) {
	if (typeof eventName !== 'string' && typeof eventName !== 'symbol') {
		throw new TypeError('eventName must be a string or a symbol');
	}
}

function assertListener(listener) {
	if (typeof listener !== 'function') {
		throw new TypeError('listener must be a function');
	}
}

function getListeners(instance, eventName) {
	const events = eventsMap.get(instance);
	if (!events.has(eventName)) {
		events.set(eventName, new Set());
	}

	return events.get(eventName);
}

function getEventProducers(instance, eventName) {
	const key = typeof eventName === 'string' || typeof eventName === 'symbol' ? eventName : anyProducer;
	const producers = producersMap.get(instance);
	if (!producers.has(key)) {
		producers.set(key, new Set());
	}

	return producers.get(key);
}

function enqueueProducers(instance, eventName, eventData) {
	const producers = producersMap.get(instance);
	if (producers.has(eventName)) {
		for (const producer of producers.get(eventName)) {
			producer.enqueue(eventData);
		}
	}

	if (producers.has(anyProducer)) {
		const item = Promise.all([eventName, eventData]);
		for (const producer of producers.get(anyProducer)) {
			producer.enqueue(item);
		}
	}
}

function iterator(instance, eventNames) {
	eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

	let isFinished = false;
	let flush = () => {};
	let queue = [];

	const producer = {
		enqueue(item) {
			queue.push(item);
			flush();
		},
		finish() {
			isFinished = true;
			flush();
		}
	};

	for (const eventName of eventNames) {
		getEventProducers(instance, eventName).add(producer);
	}

	return {
		async next() {
			if (!queue) {
				return {done: true};
			}

			if (queue.length === 0) {
				if (isFinished) {
					queue = undefined;
					return this.next();
				}

				await new Promise(resolve => {
					flush = resolve;
				});

				return this.next();
			}

			return {
				done: false,
				value: await queue.shift()
			};
		},

		async return(value) {
			queue = undefined;

			for (const eventName of eventNames) {
				getEventProducers(instance, eventName).delete(producer);
			}

			flush();

			return arguments.length > 0 ?
				{done: true, value: await value} :
				{done: true};
		},

		[Symbol.asyncIterator]() {
			return this;
		}
	};
}

function defaultMethodNamesOrAssert(methodNames) {
	if (methodNames === undefined) {
		return allEmitteryMethods;
	}

	if (!Array.isArray(methodNames)) {
		throw new TypeError('`methodNames` must be an array of strings');
	}

	for (const methodName of methodNames) {
		if (!allEmitteryMethods.includes(methodName)) {
			if (typeof methodName !== 'string') {
				throw new TypeError('`methodNames` element must be a string');
			}

			throw new Error(`${methodName} is not Emittery method`);
		}
	}

	return methodNames;
}

const isListenerSymbol = symbol => symbol === listenerAdded || symbol === listenerRemoved;

class Emittery {
	static mixin(emitteryPropertyName, methodNames) {
		methodNames = defaultMethodNamesOrAssert(methodNames);
		return target => {
			if (typeof target !== 'function') {
				throw new TypeError('`target` must be function');
			}

			for (const methodName of methodNames) {
				if (target.prototype[methodName] !== undefined) {
					throw new Error(`The property \`${methodName}\` already exists on \`target\``);
				}
			}

			function getEmitteryProperty() {
				Object.defineProperty(this, emitteryPropertyName, {
					enumerable: false,
					value: new Emittery()
				});
				return this[emitteryPropertyName];
			}

			Object.defineProperty(target.prototype, emitteryPropertyName, {
				enumerable: false,
				get: getEmitteryProperty
			});

			const emitteryMethodCaller = methodName => function (...args) {
				return this[emitteryPropertyName][methodName](...args);
			};

			for (const methodName of methodNames) {
				Object.defineProperty(target.prototype, methodName, {
					enumerable: false,
					value: emitteryMethodCaller(methodName)
				});
			}

			return target;
		};
	}

	constructor() {
		anyMap.set(this, new Set());
		eventsMap.set(this, new Map());
		producersMap.set(this, new Map());
	}

	on(eventNames, listener) {
		assertListener(listener);

		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		for (const eventName of eventNames) {
			assertEventName(eventName);
			getListeners(this, eventName).add(listener);

			if (!isListenerSymbol(eventName)) {
				this.emit(listenerAdded, {eventName, listener});
			}
		}

		return this.off.bind(this, eventNames, listener);
	}

	off(eventNames, listener) {
		assertListener(listener);

		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		for (const eventName of eventNames) {
			assertEventName(eventName);
			getListeners(this, eventName).delete(listener);

			if (!isListenerSymbol(eventName)) {
				this.emit(listenerRemoved, {eventName, listener});
			}
		}
	}

	once(eventNames) {
		return new Promise(resolve => {
			const off = this.on(eventNames, data => {
				off();
				resolve(data);
			});
		});
	}

	events(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		for (const eventName of eventNames) {
			assertEventName(eventName);
		}

		return iterator(this, eventNames);
	}

	async emit(eventName, eventData) {
		assertEventName(eventName);

		enqueueProducers(this, eventName, eventData);

		const listeners = getListeners(this, eventName);
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = isListenerSymbol(eventName) ? [] : [...anyListeners];

		await resolvedPromise;
		await Promise.all([
			...staticListeners.map(async listener => {
				if (listeners.has(listener)) {
					return listener(eventData);
				}
			}),
			...staticAnyListeners.map(async listener => {
				if (anyListeners.has(listener)) {
					return listener(eventName, eventData);
				}
			})
		]);
	}

	async emitSerial(eventName, eventData) {
		assertEventName(eventName);

		const listeners = getListeners(this, eventName);
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = [...anyListeners];

		await resolvedPromise;
		/* eslint-disable no-await-in-loop */
		for (const listener of staticListeners) {
			if (listeners.has(listener)) {
				await listener(eventData);
			}
		}

		for (const listener of staticAnyListeners) {
			if (anyListeners.has(listener)) {
				await listener(eventName, eventData);
			}
		}
		/* eslint-enable no-await-in-loop */
	}

	onAny(listener) {
		assertListener(listener);
		anyMap.get(this).add(listener);
		this.emit(listenerAdded, {listener});
		return this.offAny.bind(this, listener);
	}

	anyEvent() {
		return iterator(this);
	}

	offAny(listener) {
		assertListener(listener);
		this.emit(listenerRemoved, {listener});
		anyMap.get(this).delete(listener);
	}

	clearListeners(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

		for (const eventName of eventNames) {
			if (typeof eventName === 'string' || typeof eventName === 'symbol') {
				getListeners(this, eventName).clear();

				const producers = getEventProducers(this, eventName);

				for (const producer of producers) {
					producer.finish();
				}

				producers.clear();
			} else {
				anyMap.get(this).clear();

				for (const listeners of eventsMap.get(this).values()) {
					listeners.clear();
				}

				for (const producers of producersMap.get(this).values()) {
					for (const producer of producers) {
						producer.finish();
					}

					producers.clear();
				}
			}
		}
	}

	listenerCount(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		let count = 0;

		for (const eventName of eventNames) {
			if (typeof eventName === 'string') {
				count += anyMap.get(this).size + getListeners(this, eventName).size +
					getEventProducers(this, eventName).size + getEventProducers(this).size;
				continue;
			}

			if (typeof eventName !== 'undefined') {
				assertEventName(eventName);
			}

			count += anyMap.get(this).size;

			for (const value of eventsMap.get(this).values()) {
				count += value.size;
			}

			for (const value of producersMap.get(this).values()) {
				count += value.size;
			}
		}

		return count;
	}

	bindMethods(target, methodNames) {
		if (typeof target !== 'object' || target === null) {
			throw new TypeError('`target` must be an object');
		}

		methodNames = defaultMethodNamesOrAssert(methodNames);

		for (const methodName of methodNames) {
			if (target[methodName] !== undefined) {
				throw new Error(`The property \`${methodName}\` already exists on \`target\``);
			}

			Object.defineProperty(target, methodName, {
				enumerable: false,
				value: this[methodName].bind(this)
			});
		}
	}
}

const allEmitteryMethods = Object.getOwnPropertyNames(Emittery.prototype).filter(v => v !== 'constructor');

// Subclass used to encourage TS users to type their events.
Emittery.Typed = class extends Emittery {};
Object.defineProperty(Emittery.Typed, 'Typed', {
	enumerable: false,
	value: undefined
});

Object.defineProperty(Emittery, 'listenerAdded', {
	value: listenerAdded,
	writable: false,
	enumerable: true,
	configurable: false
});
Object.defineProperty(Emittery, 'listenerRemoved', {
	value: listenerRemoved,
	writable: false,
	enumerable: true,
	configurable: false
});

module.exports = Emittery;


/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * This allows you to work with object hierarchies that have been frozen
 * with Object.freeze().  "get" operations can use the normal JS syntax,
 * but operations that modify the data will have to return partial copies of
 * the structure. The portions of the structure that did not change will
 * === their previous values.
 *
 * Inspired by clojure/mori and Immutable.js
 */



const i = exports

const identity = coll => coll

// we only care about objects or arrays for now
const weCareAbout = val => val !== null &&
    (Array.isArray(val) ||
      // This will skip objects created with `new Foo()`
      // and objects created with `Object.create(proto)`
      // The benefit is ignoring DOM elements and event emitters,
      // which are often circular.
      isObjectLike(val))

const isObjectLike = val => typeof val === 'object' &&
    (val.constructor === Object ||
      val.constructor == null) &&
    (Object.getPrototypeOf(val) === Object.prototype ||
      Object.getPrototypeOf(val) === null)

const forKeys = (obj, iter) => {
  let idx, keys
  if (Array.isArray(obj)) {
    idx = obj.length
    while (idx--) {
      iter(idx)
    }
    return
  }
  keys = Object.keys(obj)
  idx = keys.length
  while (idx--) {
    iter(keys[idx])
  }
}

const cloneObj = obj => {
  const newObj = obj.constructor == null ? Object.create(null) : {}
  const keys = Object.keys(obj)
  let idx = keys.length
  let key
  while (idx--) {
    key = keys[idx]
    newObj[key] = obj[key]
  }
  return newObj
}

const clone = (coll) => {
  if (Array.isArray(coll)) {
    return coll.slice()
  } else {
    return cloneObj(coll)
  }
}

const freezeIfNeeded =  true
? identity
: undefined

const _freeze =  true
? identity
: undefined

const prevNodes = []

const baseFreeze = (coll) => {
  if (prevNodes.some(val => val === coll)) {
    throw new Error('object has a reference cycle')
  }
  prevNodes.push(coll)
  forKeys(coll, key => {
    const prop = coll[key]
    if (weCareAbout(prop)) {
      baseFreeze(prop)
    }
  })
  prevNodes.pop()

  Object.freeze(coll)
  return coll
}

/**
 * recrursively freeze an object and all its child objects
 * @param  {Object|Array} coll
 * @return {Object|Array}
 */
exports.freeze =  true
? identity
: undefined

/**
 * recursively un-freeze an object, by cloning frozen collections
 * @param  {[type]} coll [description]
 * @return {[type]}      [description]
 */
exports.thaw = function thaw (coll) {
  if (!weCareAbout(coll) || !Object.isFrozen(coll)) return coll

  const newColl = Array.isArray(coll)
    ? new Array(coll.length)
    : {}

  forKeys(coll, key => {
    newColl[key] = thaw(coll[key])
  })
  return newColl
}

/**
 * set a value on an object or array
 * @param  {Object|Array}  coll
 * @param  {String|Number} key   Key or index
 * @param  {Object}        value
 * @return {Object|Array}        new object hierarchy with modifications
 */
exports.assoc = function assoc (coll, key, value) {
  if (coll[key] === value) {
    return _freeze(coll)
  }

  const newObj = clone(coll)

  newObj[key] = freezeIfNeeded(value)

  return _freeze(newObj)
}
exports.set = exports.assoc

/**
 * un-set a value on an object or array
 * @param  {Object|Array}  coll
 * @param  {String|Number} key  Key or Index
 * @return {Object|Array}       New object or array
 */
exports.dissoc = function dissoc (coll, key) {
  const newObj = clone(coll)

  delete newObj[key]

  return _freeze(newObj)
}
exports.unset = exports.dissoc

/**
 * set a value deep in a hierarchical structure
 * @param  {Object|Array} coll
 * @param  {Array}        path    A list of keys to traverse
 * @param  {Object}       value
 * @return {Object|Array}       new object hierarchy with modifications
 */
exports.assocIn = function assocIn (coll, path, value) {
  const key0 = path[0]
  if (path.length === 1) {
    // simplest case is a 1-element array.  Just a simple assoc.
    return i.assoc(coll, key0, value)
  } else {
    // break the problem down.  Assoc this object with the first key
    // and the result of assocIn with the rest of the keys
    return i.assoc(coll, key0, assocIn(coll[key0] || {}, path.slice(1), value))
  }
}
exports.setIn = exports.assocIn

/**
 * un-set a value on an object or array
 * @param  {Object|Array}  coll
 * @param  {Array} path  A list of keys to traverse
 * @return {Object|Array}       New object or array
 */
exports.dissocIn = function dissocIn (coll, path) {
  const key0 = path[0]
  if (!coll.hasOwnProperty(key0)) {
    return coll
  }
  if (path.length === 1) {
    // simplest case is a 1-element array.  Just a simple dissoc.
    return i.dissoc(coll, key0)
  } else {
    // break the problem down.  Assoc this object with the first key
    // and the result of dissocIn with the rest of the keys
    return i.assoc(coll, key0, dissocIn(coll[key0], path.slice(1)))
  }
}
exports.unsetIn = exports.dissocIn

/**
 * get an object from a hierachy based on an array of keys
 * @param  {Object|Array} coll
 * @param  {Array}        path    list of keys
 * @return {Object}       value, or undefined
 */
function baseGet (coll, path) {
  return (path || []).reduce((curr, key) => {
    if (!curr) { return }
    return curr[key]
  }, coll)
}

exports.getIn = baseGet

/**
 * Update a value in a hierarchy
 * @param  {Object|Array}   coll
 * @param  {Array}          path     list of keys
 * @param  {Function} callback The existing value with be passed to this.
 *                             Return the new value to set
 * @return {Object|Array}      new object hierarchy with modifications
 */
exports.updateIn = function updateIn (coll, path, callback) {
  const existingVal = baseGet(coll, path)
  return i.assocIn(coll, path, callback(existingVal))
};

// generate wrappers for the mutative array methods
['push', 'unshift', 'pop', 'shift', 'reverse', 'sort']
.forEach((methodName) => {
  exports[methodName] = function (arr, val) {
    const newArr = [...arr]

    newArr[methodName](freezeIfNeeded(val))

    return _freeze(newArr)
  }

  exports[methodName].displayName = 'icepick.' + methodName
})

// splice is special because it is variadic
exports.splice = function splice (arr, ..._args) {
  const newArr = [...arr]
  const args = _args.map(freezeIfNeeded)

  newArr.splice.apply(newArr, args)

  return _freeze(newArr)
}

// slice is non-mutative
exports.slice = function slice (arr, arg1, arg2) {
  const newArr = arr.slice(arg1, arg2)

  return _freeze(newArr)
};

['map', 'filter'].forEach((methodName) => {
  exports[methodName] = function (fn, arr) {
    const newArr = arr[methodName](fn)

    return _freeze(newArr)
  }

  exports[methodName].displayName = 'icepick.' + methodName
})

exports.extend =
exports.assign = function assign (obj, ...objs) {
  const newObj = objs.reduce(singleAssign, obj)

  return _freeze(newObj)
}

function singleAssign (obj1, obj2) {
  return Object.keys(obj2).reduce((obj, key) => {
    return i.assoc(obj, key, obj2[key])
  }, obj1)
}

exports.merge = merge
function merge (target, source, resolver) {
  if (target == null || source == null) {
    return target
  }
  return Object.keys(source).reduce((obj, key) => {
    const sourceVal = source[key]
    const targetVal = obj[key]

    const resolvedSourceVal =
      resolver ? resolver(targetVal, sourceVal, key) : sourceVal

    if (weCareAbout(sourceVal) && weCareAbout(targetVal)) {
      // if they are both frozen and reference equal, assume they are deep equal
      if (
        resolvedSourceVal === targetVal &&
        (
           true ||
          (
            false
          )
        )
      ) {
        return obj
      }
      if (Array.isArray(sourceVal)) {
        return i.assoc(obj, key, resolvedSourceVal)
      }
      // recursively merge pairs of objects
      return assocIfDifferent(obj, key,
        merge(targetVal, resolvedSourceVal, resolver))
    }

    // primitive values, stuff with prototypes
    return assocIfDifferent(obj, key, resolvedSourceVal)
  }, target)
}

function assocIfDifferent (target, key, value) {
  if (target[key] === value) {
    return target
  }
  return i.assoc(target, key, value)
}

const chainProto = {
  value: function value () {
    return this.val
  },
  thru: function thru (fn) {
    this.val = freezeIfNeeded(fn(this.val))
    return this
  }
}

Object.keys(exports).forEach((methodName) => {
  if (methodName.match(/^(map|filter)$/)) {
    chainProto[methodName] = function (fn) {
      this.val = exports[methodName](fn, this.val)
      return this
    }
    return
  }
  chainProto[methodName] = function (...args) {
    this.val = exports[methodName](this.val, ...args)
    return this
  }
})

exports.chain = function chain (val) {
  const wrapped = Object.create(chainProto)
  wrapped.val = val
  return wrapped
}

// for testing
if (false) {}


/***/ }),

/***/ 146:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on_user_recognized = exports.on_error = void 0; // https://docs.sentry.io/error-reporting/quickstart/?platform=node
// https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

const Sentry = __webpack_require__(180);

const channel_1 = __webpack_require__(39); /////////////////////////////////////////////////


Sentry.init({
  // http://getsentry.github.io/sentry-javascript/interfaces/node.nodeoptions.html
  dsn: 'https://a86696dcd573448a8fcc3bd7151349b4@sentry.io/1772719',
  debug: "production" === 'development',
  //release TODO
  environment: channel_1.CHANNEL,
  attachStacktrace: true,
  //shutdownTimeout TODO needed ?
  integrations: default_integrations => {
    // please Sentry! I don't want your crappy integrations!
    //console.log(default_integrations)
    // https://docs.sentry.io/platforms/node/#removing-an-integration
    return [];
  }
});
Sentry.configureScope(scope => {
  scope.setExtra('channel', channel_1.CHANNEL);
  scope.setExtra('node', process.versions.node); // TODO node version etc. ?
});

async function on_error(err) {
  console.log('💣 Reporting to Sentry...', err.message); // TODO inspect the SEC?

  Sentry.captureException(err);
  await Sentry.flush();
}

exports.on_error = on_error; // https://docs.sentry.io/enriching-error-data/context/?platform=node#capturing-the-user
// TODO shared across invocations??

function on_user_recognized(user) {
  Sentry.configureScope(scope => {
    scope.setUser(user);
  });
}

exports.on_user_recognized = on_user_recognized; // TODO self-triage?
// https://docs.sentry.io/enriching-error-data/context/?platform=node#setting-the-level
// TODO breadcrumb

/***/ }),

/***/ 147:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(__webpack_require__(90));
const tls_1 = __importDefault(__webpack_require__(91));
const url_1 = __importDefault(__webpack_require__(16));
const assert_1 = __importDefault(__webpack_require__(40));
const debug_1 = __importDefault(__webpack_require__(58));
const agent_base_1 = __webpack_require__(150);
const parse_proxy_response_1 = __importDefault(__webpack_require__(152));
const debug = debug_1.default('https-proxy-agent:agent');
/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * Outgoing HTTP requests are first tunneled through the proxy server using the
 * `CONNECT` HTTP request method to establish a connection to the proxy server,
 * and then the proxy server connects to the destination target and issues the
 * HTTP request from the proxy server.
 *
 * `https:` requests have their socket connection upgraded to TLS once
 * the connection to the proxy server has been established.
 *
 * @api public
 */
class HttpsProxyAgent extends agent_base_1.Agent {
    constructor(_opts) {
        let opts;
        if (typeof _opts === 'string') {
            opts = url_1.default.parse(_opts);
        }
        else {
            opts = _opts;
        }
        if (!opts) {
            throw new Error('an HTTP(S) proxy server `host` and `port` must be specified!');
        }
        debug('creating new HttpsProxyAgent instance: %o', opts);
        super(opts);
        const proxy = Object.assign({}, opts);
        // If `true`, then connect to the proxy server over TLS.
        // Defaults to `false`.
        this.secureProxy = opts.secureProxy || isHTTPS(proxy.protocol);
        // Prefer `hostname` over `host`, and set the `port` if needed.
        proxy.host = proxy.hostname || proxy.host;
        if (typeof proxy.port === 'string') {
            proxy.port = parseInt(proxy.port, 10);
        }
        if (!proxy.port && proxy.host) {
            proxy.port = this.secureProxy ? 443 : 80;
        }
        // ALPN is supported by Node.js >= v5.
        // attempt to negotiate http/1.1 for proxy servers that support http/2
        if (this.secureProxy && !('ALPNProtocols' in proxy)) {
            proxy.ALPNProtocols = ['http 1.1'];
        }
        if (proxy.host && proxy.path) {
            // If both a `host` and `path` are specified then it's most likely
            // the result of a `url.parse()` call... we need to remove the
            // `path` portion so that `net.connect()` doesn't attempt to open
            // that as a Unix socket file.
            delete proxy.path;
            delete proxy.pathname;
        }
        this.proxy = proxy;
    }
    /**
     * Called when the node-core HTTP client library is creating a
     * new HTTP request.
     *
     * @api protected
     */
    callback(req, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { proxy, secureProxy } = this;
            // Create a socket connection to the proxy server.
            let socket;
            if (secureProxy) {
                debug('Creating `tls.Socket`: %o', proxy);
                socket = tls_1.default.connect(proxy);
            }
            else {
                debug('Creating `net.Socket`: %o', proxy);
                socket = net_1.default.connect(proxy);
            }
            const headers = Object.assign({}, proxy.headers);
            const hostname = `${opts.host}:${opts.port}`;
            let payload = `CONNECT ${hostname} HTTP/1.1\r\n`;
            // Inject the `Proxy-Authorization` header if necessary.
            if (proxy.auth) {
                headers['Proxy-Authorization'] = `Basic ${Buffer.from(proxy.auth).toString('base64')}`;
            }
            // The `Host` header should only include the port
            // number when it is not the default port.
            let { host, port, secureEndpoint } = opts;
            if (!isDefaultPort(port, secureEndpoint)) {
                host += `:${port}`;
            }
            headers.Host = host;
            headers.Connection = 'close';
            for (const name of Object.keys(headers)) {
                payload += `${name}: ${headers[name]}\r\n`;
            }
            const proxyResponsePromise = parse_proxy_response_1.default(socket);
            socket.write(`${payload}\r\n`);
            const { statusCode, buffered } = yield proxyResponsePromise;
            if (statusCode === 200) {
                req.once('socket', resume);
                if (opts.secureEndpoint) {
                    const servername = opts.servername || opts.host;
                    if (!servername) {
                        throw new Error('Could not determine "servername"');
                    }
                    // The proxy is connecting to a TLS server, so upgrade
                    // this socket connection to a TLS connection.
                    debug('Upgrading socket connection to TLS');
                    return tls_1.default.connect(Object.assign(Object.assign({}, omit(opts, 'host', 'hostname', 'path', 'port')), { socket,
                        servername }));
                }
                return socket;
            }
            // Some other status code that's not 200... need to re-play the HTTP
            // header "data" events onto the socket once the HTTP machinery is
            // attached so that the node core `http` can parse and handle the
            // error status code.
            // Close the original socket, and a new "fake" socket is returned
            // instead, so that the proxy doesn't get the HTTP request
            // written to it (which may contain `Authorization` headers or other
            // sensitive data).
            //
            // See: https://hackerone.com/reports/541502
            socket.destroy();
            const fakeSocket = new net_1.default.Socket();
            fakeSocket.readable = true;
            // Need to wait for the "socket" event to re-play the "data" events.
            req.once('socket', (s) => {
                debug('replaying proxy buffer for failed request');
                assert_1.default(s.listenerCount('data') > 0);
                // Replay the "buffered" Buffer onto the fake `socket`, since at
                // this point the HTTP module machinery has been hooked up for
                // the user.
                s.push(buffered);
                s.push(null);
            });
            return fakeSocket;
        });
    }
}
exports.default = HttpsProxyAgent;
function resume(socket) {
    socket.resume();
}
function isDefaultPort(port, secure) {
    return Boolean((!secure && port === 80) || (secure && port === 443));
}
function isHTTPS(protocol) {
    return typeof protocol === 'string' ? /^https:?$/i.test(protocol) : false;
}
function omit(obj, ...keys) {
    const ret = {};
    let key;
    for (key in obj) {
        if (!keys.includes(key)) {
            ret[key] = obj[key];
        }
    }
    return ret;
}
//# sourceMappingURL=agent.js.map

/***/ }),

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(92)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 149:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(45);
const util = __webpack_require__(6);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(44);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(92)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = __webpack_require__(10);
const debug_1 = __importDefault(__webpack_require__(58));
const promisify_1 = __importDefault(__webpack_require__(151));
const debug = debug_1.default('agent-base');
function isAgent(v) {
    return Boolean(v) && typeof v.addRequest === 'function';
}
function isSecureEndpoint() {
    const { stack } = new Error();
    if (typeof stack !== 'string')
        return false;
    return stack.split('\n').some(l => l.indexOf('(https.js:') !== -1 || l.indexOf('node:https:') !== -1);
}
function createAgent(callback, opts) {
    return new createAgent.Agent(callback, opts);
}
(function (createAgent) {
    /**
     * Base `http.Agent` implementation.
     * No pooling/keep-alive is implemented by default.
     *
     * @param {Function} callback
     * @api public
     */
    class Agent extends events_1.EventEmitter {
        constructor(callback, _opts) {
            super();
            let opts = _opts;
            if (typeof callback === 'function') {
                this.callback = callback;
            }
            else if (callback) {
                opts = callback;
            }
            // Timeout for the socket to be returned from the callback
            this.timeout = null;
            if (opts && typeof opts.timeout === 'number') {
                this.timeout = opts.timeout;
            }
            // These aren't actually used by `agent-base`, but are required
            // for the TypeScript definition files in `@types/node` :/
            this.maxFreeSockets = 1;
            this.maxSockets = 1;
            this.maxTotalSockets = Infinity;
            this.sockets = {};
            this.freeSockets = {};
            this.requests = {};
            this.options = {};
        }
        get defaultPort() {
            if (typeof this.explicitDefaultPort === 'number') {
                return this.explicitDefaultPort;
            }
            return isSecureEndpoint() ? 443 : 80;
        }
        set defaultPort(v) {
            this.explicitDefaultPort = v;
        }
        get protocol() {
            if (typeof this.explicitProtocol === 'string') {
                return this.explicitProtocol;
            }
            return isSecureEndpoint() ? 'https:' : 'http:';
        }
        set protocol(v) {
            this.explicitProtocol = v;
        }
        callback(req, opts, fn) {
            throw new Error('"agent-base" has no default implementation, you must subclass and override `callback()`');
        }
        /**
         * Called by node-core's "_http_client.js" module when creating
         * a new HTTP request with this Agent instance.
         *
         * @api public
         */
        addRequest(req, _opts) {
            const opts = Object.assign({}, _opts);
            if (typeof opts.secureEndpoint !== 'boolean') {
                opts.secureEndpoint = isSecureEndpoint();
            }
            if (opts.host == null) {
                opts.host = 'localhost';
            }
            if (opts.port == null) {
                opts.port = opts.secureEndpoint ? 443 : 80;
            }
            if (opts.protocol == null) {
                opts.protocol = opts.secureEndpoint ? 'https:' : 'http:';
            }
            if (opts.host && opts.path) {
                // If both a `host` and `path` are specified then it's most
                // likely the result of a `url.parse()` call... we need to
                // remove the `path` portion so that `net.connect()` doesn't
                // attempt to open that as a unix socket file.
                delete opts.path;
            }
            delete opts.agent;
            delete opts.hostname;
            delete opts._defaultAgent;
            delete opts.defaultPort;
            delete opts.createConnection;
            // Hint to use "Connection: close"
            // XXX: non-documented `http` module API :(
            req._last = true;
            req.shouldKeepAlive = false;
            let timedOut = false;
            let timeoutId = null;
            const timeoutMs = opts.timeout || this.timeout;
            const onerror = (err) => {
                if (req._hadError)
                    return;
                req.emit('error', err);
                // For Safety. Some additional errors might fire later on
                // and we need to make sure we don't double-fire the error event.
                req._hadError = true;
            };
            const ontimeout = () => {
                timeoutId = null;
                timedOut = true;
                const err = new Error(`A "socket" was not created for HTTP request before ${timeoutMs}ms`);
                err.code = 'ETIMEOUT';
                onerror(err);
            };
            const callbackError = (err) => {
                if (timedOut)
                    return;
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                onerror(err);
            };
            const onsocket = (socket) => {
                if (timedOut)
                    return;
                if (timeoutId != null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                if (isAgent(socket)) {
                    // `socket` is actually an `http.Agent` instance, so
                    // relinquish responsibility for this `req` to the Agent
                    // from here on
                    debug('Callback returned another Agent instance %o', socket.constructor.name);
                    socket.addRequest(req, opts);
                    return;
                }
                if (socket) {
                    socket.once('free', () => {
                        this.freeSocket(socket, opts);
                    });
                    req.onSocket(socket);
                    return;
                }
                const err = new Error(`no Duplex stream was returned to agent-base for \`${req.method} ${req.path}\``);
                onerror(err);
            };
            if (typeof this.callback !== 'function') {
                onerror(new Error('`callback` is not defined'));
                return;
            }
            if (!this.promisifiedCallback) {
                if (this.callback.length >= 3) {
                    debug('Converting legacy callback function to promise');
                    this.promisifiedCallback = promisify_1.default(this.callback);
                }
                else {
                    this.promisifiedCallback = this.callback;
                }
            }
            if (typeof timeoutMs === 'number' && timeoutMs > 0) {
                timeoutId = setTimeout(ontimeout, timeoutMs);
            }
            if ('port' in opts && typeof opts.port !== 'number') {
                opts.port = Number(opts.port);
            }
            try {
                debug('Resolving socket for %o request: %o', opts.protocol, `${req.method} ${req.path}`);
                Promise.resolve(this.promisifiedCallback(req, opts)).then(onsocket, callbackError);
            }
            catch (err) {
                Promise.reject(err).catch(callbackError);
            }
        }
        freeSocket(socket, opts) {
            debug('Freeing socket %o %o', socket.constructor.name, opts);
            socket.destroy();
        }
        destroy() {
            debug('Destroying agent %o', this.constructor.name);
        }
    }
    createAgent.Agent = Agent;
    // So that `instanceof` works correctly
    createAgent.prototype = createAgent.Agent.prototype;
})(createAgent || (createAgent = {}));
module.exports = createAgent;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 151:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function promisify(fn) {
    return function (req, opts) {
        return new Promise((resolve, reject) => {
            fn.call(this, req, opts, (err, rtn) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(rtn);
                }
            });
        });
    };
}
exports.default = promisify;
//# sourceMappingURL=promisify.js.map

/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(__webpack_require__(58));
const debug = debug_1.default('https-proxy-agent:parse-proxy-response');
function parseProxyResponse(socket) {
    return new Promise((resolve, reject) => {
        // we need to buffer any HTTP traffic that happens with the proxy before we get
        // the CONNECT response, so that if the response is anything other than an "200"
        // response code, then we can re-play the "data" events on the socket once the
        // HTTP parser is hooked up...
        let buffersLength = 0;
        const buffers = [];
        function read() {
            const b = socket.read();
            if (b)
                ondata(b);
            else
                socket.once('readable', read);
        }
        function cleanup() {
            socket.removeListener('end', onend);
            socket.removeListener('error', onerror);
            socket.removeListener('close', onclose);
            socket.removeListener('readable', read);
        }
        function onclose(err) {
            debug('onclose had error %o', err);
        }
        function onend() {
            debug('onend');
        }
        function onerror(err) {
            cleanup();
            debug('onerror %o', err);
            reject(err);
        }
        function ondata(b) {
            buffers.push(b);
            buffersLength += b.length;
            const buffered = Buffer.concat(buffers, buffersLength);
            const endOfHeaders = buffered.indexOf('\r\n\r\n');
            if (endOfHeaders === -1) {
                // keep buffering
                debug('have not received end of HTTP headers yet...');
                read();
                return;
            }
            const firstLine = buffered.toString('ascii', 0, buffered.indexOf('\r\n'));
            const statusCode = +firstLine.split(' ')[1];
            debug('got proxy server response: %o', firstLine);
            resolve({
                statusCode,
                buffered
            });
        }
        socket.on('error', onerror);
        socket.on('close', onclose);
        socket.on('end', onend);
        read();
    });
}
exports.default = parseProxyResponse;
//# sourceMappingURL=parse-proxy-response.js.map

/***/ }),

/***/ 153:
/***/ (function(module, exports) {

module.exports = require("console");

/***/ }),

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ 17:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return truncate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return snipLine; });
/* unused harmony export safeJoin */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isMatchingPattern; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function truncate(str, max) {
    if (max === void 0) { max = 0; }
    if (typeof str !== 'string' || max === 0) {
        return str;
    }
    return str.length <= max ? str : str.substr(0, max) + "...";
}
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function snipLine(line, colno) {
    var newLine = line;
    var ll = newLine.length;
    if (ll <= 150) {
        return newLine;
    }
    if (colno > ll) {
        // eslint-disable-next-line no-param-reassign
        colno = ll;
    }
    var start = Math.max(colno - 60, 0);
    if (start < 5) {
        start = 0;
    }
    var end = Math.min(start + 140, ll);
    if (end > ll - 5) {
        end = ll;
    }
    if (end === ll) {
        start = Math.max(end - 140, 0);
    }
    newLine = newLine.slice(start, end);
    if (start > 0) {
        newLine = "'{snip} " + newLine;
    }
    if (end < ll) {
        newLine += ' {snip}';
    }
    return newLine;
}
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeJoin(input, delimiter) {
    if (!Array.isArray(input)) {
        return '';
    }
    var output = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (var i = 0; i < input.length; i++) {
        var value = input[i];
        try {
            output.push(String(value));
        }
        catch (e) {
            output.push('[value cannot be serialized]');
        }
    }
    return output.join(delimiter);
}
/**
 * Checks if the value matches a regex or includes the string
 * @param value The string value to be checked against
 * @param pattern Either a regex or a string that must be contained in value
 */
function isMatchingPattern(value, pattern) {
    if (!Object(_is__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "h"])(value)) {
        return false;
    }
    if (Object(_is__WEBPACK_IMPORTED_MODULE_0__[/* isRegExp */ "g"])(pattern)) {
        return pattern.test(value);
    }
    if (typeof pattern === 'string') {
        return value.indexOf(pattern) !== -1;
    }
    return false;
}
//# sourceMappingURL=string.js.map

/***/ }),

/***/ 180:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "Severity", function() { return /* reexport */ Severity; });
__webpack_require__.d(__webpack_exports__, "Status", function() { return /* reexport */ Status; });
__webpack_require__.d(__webpack_exports__, "addGlobalEventProcessor", function() { return /* reexport */ scope_addGlobalEventProcessor; });
__webpack_require__.d(__webpack_exports__, "addBreadcrumb", function() { return /* reexport */ addBreadcrumb; });
__webpack_require__.d(__webpack_exports__, "captureException", function() { return /* reexport */ captureException; });
__webpack_require__.d(__webpack_exports__, "captureEvent", function() { return /* reexport */ captureEvent; });
__webpack_require__.d(__webpack_exports__, "captureMessage", function() { return /* reexport */ captureMessage; });
__webpack_require__.d(__webpack_exports__, "configureScope", function() { return /* reexport */ configureScope; });
__webpack_require__.d(__webpack_exports__, "getHubFromCarrier", function() { return /* reexport */ getHubFromCarrier; });
__webpack_require__.d(__webpack_exports__, "getCurrentHub", function() { return /* reexport */ hub_getCurrentHub; });
__webpack_require__.d(__webpack_exports__, "Hub", function() { return /* reexport */ hub_Hub; });
__webpack_require__.d(__webpack_exports__, "makeMain", function() { return /* reexport */ makeMain; });
__webpack_require__.d(__webpack_exports__, "Scope", function() { return /* reexport */ scope_Scope; });
__webpack_require__.d(__webpack_exports__, "startTransaction", function() { return /* reexport */ startTransaction; });
__webpack_require__.d(__webpack_exports__, "setContext", function() { return /* reexport */ setContext; });
__webpack_require__.d(__webpack_exports__, "setExtra", function() { return /* reexport */ setExtra; });
__webpack_require__.d(__webpack_exports__, "setExtras", function() { return /* reexport */ setExtras; });
__webpack_require__.d(__webpack_exports__, "setTag", function() { return /* reexport */ setTag; });
__webpack_require__.d(__webpack_exports__, "setTags", function() { return /* reexport */ setTags; });
__webpack_require__.d(__webpack_exports__, "setUser", function() { return /* reexport */ setUser; });
__webpack_require__.d(__webpack_exports__, "withScope", function() { return /* reexport */ withScope; });
__webpack_require__.d(__webpack_exports__, "NodeBackend", function() { return /* reexport */ backend_NodeBackend; });
__webpack_require__.d(__webpack_exports__, "NodeClient", function() { return /* reexport */ client_NodeClient; });
__webpack_require__.d(__webpack_exports__, "defaultIntegrations", function() { return /* reexport */ sdk_defaultIntegrations; });
__webpack_require__.d(__webpack_exports__, "init", function() { return /* reexport */ init; });
__webpack_require__.d(__webpack_exports__, "lastEventId", function() { return /* reexport */ lastEventId; });
__webpack_require__.d(__webpack_exports__, "flush", function() { return /* reexport */ flush; });
__webpack_require__.d(__webpack_exports__, "close", function() { return /* reexport */ sdk_close; });
__webpack_require__.d(__webpack_exports__, "SDK_NAME", function() { return /* reexport */ SDK_NAME; });
__webpack_require__.d(__webpack_exports__, "SDK_VERSION", function() { return /* reexport */ SDK_VERSION; });
__webpack_require__.d(__webpack_exports__, "Integrations", function() { return /* binding */ INTEGRATIONS; });
__webpack_require__.d(__webpack_exports__, "Transports", function() { return /* reexport */ transports_namespaceObject; });
__webpack_require__.d(__webpack_exports__, "Handlers", function() { return /* reexport */ handlers_namespaceObject; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/index.js
var transports_namespaceObject = {};
__webpack_require__.r(transports_namespaceObject);
__webpack_require__.d(transports_namespaceObject, "BaseTransport", function() { return base_BaseTransport; });
__webpack_require__.d(transports_namespaceObject, "HTTPTransport", function() { return http_HTTPTransport; });
__webpack_require__.d(transports_namespaceObject, "HTTPSTransport", function() { return https_HTTPSTransport; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/index.js
var integrations_namespaceObject = {};
__webpack_require__.r(integrations_namespaceObject);
__webpack_require__.d(integrations_namespaceObject, "FunctionToString", function() { return FunctionToString; });
__webpack_require__.d(integrations_namespaceObject, "InboundFilters", function() { return inboundfilters_InboundFilters; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/handlers.js
var handlers_namespaceObject = {};
__webpack_require__.r(handlers_namespaceObject);
__webpack_require__.d(handlers_namespaceObject, "tracingHandler", function() { return tracingHandler; });
__webpack_require__.d(handlers_namespaceObject, "parseRequest", function() { return parseRequest; });
__webpack_require__.d(handlers_namespaceObject, "requestHandler", function() { return requestHandler; });
__webpack_require__.d(handlers_namespaceObject, "errorHandler", function() { return errorHandler; });
__webpack_require__.d(handlers_namespaceObject, "logAndExitProcess", function() { return logAndExitProcess; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/index.js
var esm_integrations_namespaceObject = {};
__webpack_require__.r(esm_integrations_namespaceObject);
__webpack_require__.d(esm_integrations_namespaceObject, "Console", function() { return console_Console; });
__webpack_require__.d(esm_integrations_namespaceObject, "Http", function() { return http_Http; });
__webpack_require__.d(esm_integrations_namespaceObject, "OnUncaughtException", function() { return onuncaughtexception_OnUncaughtException; });
__webpack_require__.d(esm_integrations_namespaceObject, "OnUnhandledRejection", function() { return onunhandledrejection_OnUnhandledRejection; });
__webpack_require__.d(esm_integrations_namespaceObject, "LinkedErrors", function() { return linkederrors_LinkedErrors; });
__webpack_require__.d(esm_integrations_namespaceObject, "Modules", function() { return modules_Modules; });

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/severity.js
/** JSDoc */
// eslint-disable-next-line import/export
var Severity;
(function (Severity) {
    /** JSDoc */
    Severity["Fatal"] = "fatal";
    /** JSDoc */
    Severity["Error"] = "error";
    /** JSDoc */
    Severity["Warning"] = "warning";
    /** JSDoc */
    Severity["Log"] = "log";
    /** JSDoc */
    Severity["Info"] = "info";
    /** JSDoc */
    Severity["Debug"] = "debug";
    /** JSDoc */
    Severity["Critical"] = "critical";
})(Severity || (Severity = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace, import/export
(function (Severity) {
    /**
     * Converts a string-based level into a {@link Severity}.
     *
     * @param level string representation of Severity
     * @returns Severity
     */
    function fromString(level) {
        switch (level) {
            case 'debug':
                return Severity.Debug;
            case 'info':
                return Severity.Info;
            case 'warn':
            case 'warning':
                return Severity.Warning;
            case 'error':
                return Severity.Error;
            case 'fatal':
                return Severity.Fatal;
            case 'critical':
                return Severity.Critical;
            case 'log':
            default:
                return Severity.Log;
        }
    }
    Severity.fromString = fromString;
})(Severity || (Severity = {}));
//# sourceMappingURL=severity.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/status.js
/** The status of an event. */
// eslint-disable-next-line import/export
var Status;
(function (Status) {
    /** The status could not be determined. */
    Status["Unknown"] = "unknown";
    /** The event was skipped due to configuration or callbacks. */
    Status["Skipped"] = "skipped";
    /** The event was sent to Sentry successfully. */
    Status["Success"] = "success";
    /** The client is currently rate limited and will try again later. */
    Status["RateLimit"] = "rate_limit";
    /** The event could not be processed. */
    Status["Invalid"] = "invalid";
    /** A server-side error ocurred during submission. */
    Status["Failed"] = "failed";
})(Status || (Status = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace, import/export
(function (Status) {
    /**
     * Converts a HTTP status code into a {@link Status}.
     *
     * @param code The HTTP response status code.
     * @returns The send status or {@link Status.Unknown}.
     */
    function fromHttpCode(code) {
        if (code >= 200 && code < 300) {
            return Status.Success;
        }
        if (code === 429) {
            return Status.RateLimit;
        }
        if (code >= 400 && code < 500) {
            return Status.Invalid;
        }
        if (code >= 500) {
            return Status.Failed;
        }
        return Status.Unknown;
    }
    Status.fromHttpCode = fromHttpCode;
})(Status || (Status = {}));
//# sourceMappingURL=status.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
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
/* global Reflect, Promise */

var tslib_es6_extendStatics = function(d, b) {
    tslib_es6_extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return tslib_es6_extendStatics(d, b);
};

function tslib_es6_extends(d, b) {
    tslib_es6_extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var tslib_es6_assign = function() {
    tslib_es6_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return tslib_es6_assign.apply(this, arguments);
}

function tslib_es6_rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function tslib_es6_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function tslib_es6_param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function tslib_es6_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function tslib_es6_awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function tslib_es6_generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function tslib_es6_createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function tslib_es6_exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function tslib_es6_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function tslib_es6_read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function tslib_es6_spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(tslib_es6_read(arguments[i]));
    return ar;
}

function tslib_es6_spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function tslib_es6_await(v) {
    return this instanceof tslib_es6_await ? (this.v = v, this) : new tslib_es6_await(v);
}

function tslib_es6_asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof tslib_es6_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function tslib_es6_asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: tslib_es6_await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function tslib_es6_asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof tslib_es6_values === "function" ? tslib_es6_values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function tslib_es6_makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function tslib_es6_importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function tslib_es6_importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function tslib_es6_classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function tslib_es6_classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/is.js
var is = __webpack_require__(5);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/time.js
var time = __webpack_require__(314);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/syncpromise.js
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** SyncPromise internal states */
var States;
(function (States) {
    /** Pending */
    States["PENDING"] = "PENDING";
    /** Resolved / OK */
    States["RESOLVED"] = "RESOLVED";
    /** Rejected / Error */
    States["REJECTED"] = "REJECTED";
})(States || (States = {}));
/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */
var syncpromise_SyncPromise = /** @class */ (function () {
    function SyncPromise(executor) {
        var _this = this;
        this._state = States.PENDING;
        this._handlers = [];
        /** JSDoc */
        this._resolve = function (value) {
            _this._setResult(States.RESOLVED, value);
        };
        /** JSDoc */
        this._reject = function (reason) {
            _this._setResult(States.REJECTED, reason);
        };
        /** JSDoc */
        this._setResult = function (state, value) {
            if (_this._state !== States.PENDING) {
                return;
            }
            if (Object(is["j" /* isThenable */])(value)) {
                value.then(_this._resolve, _this._reject);
                return;
            }
            _this._state = state;
            _this._value = value;
            _this._executeHandlers();
        };
        // TODO: FIXME
        /** JSDoc */
        this._attachHandler = function (handler) {
            _this._handlers = _this._handlers.concat(handler);
            _this._executeHandlers();
        };
        /** JSDoc */
        this._executeHandlers = function () {
            if (_this._state === States.PENDING) {
                return;
            }
            var cachedHandlers = _this._handlers.slice();
            _this._handlers = [];
            cachedHandlers.forEach(function (handler) {
                if (handler.done) {
                    return;
                }
                if (_this._state === States.RESOLVED) {
                    if (handler.onfulfilled) {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        handler.onfulfilled(_this._value);
                    }
                }
                if (_this._state === States.REJECTED) {
                    if (handler.onrejected) {
                        handler.onrejected(_this._value);
                    }
                }
                handler.done = true;
            });
        };
        try {
            executor(this._resolve, this._reject);
        }
        catch (e) {
            this._reject(e);
        }
    }
    /** JSDoc */
    SyncPromise.resolve = function (value) {
        return new SyncPromise(function (resolve) {
            resolve(value);
        });
    };
    /** JSDoc */
    SyncPromise.reject = function (reason) {
        return new SyncPromise(function (_, reject) {
            reject(reason);
        });
    };
    /** JSDoc */
    SyncPromise.all = function (collection) {
        return new SyncPromise(function (resolve, reject) {
            if (!Array.isArray(collection)) {
                reject(new TypeError("Promise.all requires an array as input."));
                return;
            }
            if (collection.length === 0) {
                resolve([]);
                return;
            }
            var counter = collection.length;
            var resolvedCollection = [];
            collection.forEach(function (item, index) {
                SyncPromise.resolve(item)
                    .then(function (value) {
                    resolvedCollection[index] = value;
                    counter -= 1;
                    if (counter !== 0) {
                        return;
                    }
                    resolve(resolvedCollection);
                })
                    .then(null, reject);
            });
        });
    };
    /** JSDoc */
    SyncPromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        return new SyncPromise(function (resolve, reject) {
            _this._attachHandler({
                done: false,
                onfulfilled: function (result) {
                    if (!onfulfilled) {
                        // TODO: ¯\_(ツ)_/¯
                        // TODO: FIXME
                        resolve(result);
                        return;
                    }
                    try {
                        resolve(onfulfilled(result));
                        return;
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                },
                onrejected: function (reason) {
                    if (!onrejected) {
                        reject(reason);
                        return;
                    }
                    try {
                        resolve(onrejected(reason));
                        return;
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                },
            });
        });
    };
    /** JSDoc */
    SyncPromise.prototype.catch = function (onrejected) {
        return this.then(function (val) { return val; }, onrejected);
    };
    /** JSDoc */
    SyncPromise.prototype.finally = function (onfinally) {
        var _this = this;
        return new SyncPromise(function (resolve, reject) {
            var val;
            var isRejected;
            return _this.then(function (value) {
                isRejected = false;
                val = value;
                if (onfinally) {
                    onfinally();
                }
            }, function (reason) {
                isRejected = true;
                val = reason;
                if (onfinally) {
                    onfinally();
                }
            }).then(function () {
                if (isRejected) {
                    reject(val);
                    return;
                }
                resolve(val);
            });
        });
    };
    /** JSDoc */
    SyncPromise.prototype.toString = function () {
        return '[object SyncPromise]';
    };
    return SyncPromise;
}());

//# sourceMappingURL=syncpromise.js.map
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/misc.js
var misc = __webpack_require__(14);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/scope.js


/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
var scope_Scope = /** @class */ (function () {
    function Scope() {
        /** Flag if notifiying is happening. */
        this._notifyingListeners = false;
        /** Callback for client to receive scope changes. */
        this._scopeListeners = [];
        /** Callback list that will be called after {@link applyToEvent}. */
        this._eventProcessors = [];
        /** Array of breadcrumbs. */
        this._breadcrumbs = [];
        /** User */
        this._user = {};
        /** Tags */
        this._tags = {};
        /** Extra */
        this._extra = {};
        /** Contexts */
        this._contexts = {};
    }
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    Scope.clone = function (scope) {
        var newScope = new Scope();
        if (scope) {
            newScope._breadcrumbs = tslib_es6_spread(scope._breadcrumbs);
            newScope._tags = tslib_es6_assign({}, scope._tags);
            newScope._extra = tslib_es6_assign({}, scope._extra);
            newScope._contexts = tslib_es6_assign({}, scope._contexts);
            newScope._user = scope._user;
            newScope._level = scope._level;
            newScope._span = scope._span;
            newScope._session = scope._session;
            newScope._transactionName = scope._transactionName;
            newScope._fingerprint = scope._fingerprint;
            newScope._eventProcessors = tslib_es6_spread(scope._eventProcessors);
        }
        return newScope;
    };
    /**
     * Add internal on change listener. Used for sub SDKs that need to store the scope.
     * @hidden
     */
    Scope.prototype.addScopeListener = function (callback) {
        this._scopeListeners.push(callback);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addEventProcessor = function (callback) {
        this._eventProcessors.push(callback);
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setUser = function (user) {
        this._user = user || {};
        if (this._session) {
            this._session.update({ user: user });
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getUser = function () {
        return this._user;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTags = function (tags) {
        this._tags = tslib_es6_assign(tslib_es6_assign({}, this._tags), tags);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTag = function (key, value) {
        var _a;
        this._tags = tslib_es6_assign(tslib_es6_assign({}, this._tags), (_a = {}, _a[key] = value, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtras = function (extras) {
        this._extra = tslib_es6_assign(tslib_es6_assign({}, this._extra), extras);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtra = function (key, extra) {
        var _a;
        this._extra = tslib_es6_assign(tslib_es6_assign({}, this._extra), (_a = {}, _a[key] = extra, _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setFingerprint = function (fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setLevel = function (level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTransactionName = function (name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Can be removed in major version.
     * @deprecated in favor of {@link this.setTransactionName}
     */
    Scope.prototype.setTransaction = function (name) {
        return this.setTransactionName(name);
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setContext = function (key, context) {
        var _a;
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        }
        else {
            this._contexts = tslib_es6_assign(tslib_es6_assign({}, this._contexts), (_a = {}, _a[key] = context, _a));
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSpan = function (span) {
        this._span = span;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSpan = function () {
        return this._span;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getTransaction = function () {
        var _a, _b, _c, _d;
        // often, this span will be a transaction, but it's not guaranteed to be
        var span = this.getSpan();
        // try it the new way first
        if ((_a = span) === null || _a === void 0 ? void 0 : _a.transaction) {
            return (_b = span) === null || _b === void 0 ? void 0 : _b.transaction;
        }
        // fallback to the old way (known bug: this only finds transactions with sampled = true)
        if ((_d = (_c = span) === null || _c === void 0 ? void 0 : _c.spanRecorder) === null || _d === void 0 ? void 0 : _d.spans[0]) {
            return span.spanRecorder.spans[0];
        }
        // neither way found a transaction
        return undefined;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setSession = function (session) {
        if (!session) {
            delete this._session;
        }
        else {
            this._session = session;
        }
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.getSession = function () {
        return this._session;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.update = function (captureContext) {
        if (!captureContext) {
            return this;
        }
        if (typeof captureContext === 'function') {
            var updatedScope = captureContext(this);
            return updatedScope instanceof Scope ? updatedScope : this;
        }
        if (captureContext instanceof Scope) {
            this._tags = tslib_es6_assign(tslib_es6_assign({}, this._tags), captureContext._tags);
            this._extra = tslib_es6_assign(tslib_es6_assign({}, this._extra), captureContext._extra);
            this._contexts = tslib_es6_assign(tslib_es6_assign({}, this._contexts), captureContext._contexts);
            if (captureContext._user && Object.keys(captureContext._user).length) {
                this._user = captureContext._user;
            }
            if (captureContext._level) {
                this._level = captureContext._level;
            }
            if (captureContext._fingerprint) {
                this._fingerprint = captureContext._fingerprint;
            }
        }
        else if (Object(is["e" /* isPlainObject */])(captureContext)) {
            // eslint-disable-next-line no-param-reassign
            captureContext = captureContext;
            this._tags = tslib_es6_assign(tslib_es6_assign({}, this._tags), captureContext.tags);
            this._extra = tslib_es6_assign(tslib_es6_assign({}, this._extra), captureContext.extra);
            this._contexts = tslib_es6_assign(tslib_es6_assign({}, this._contexts), captureContext.contexts);
            if (captureContext.user) {
                this._user = captureContext.user;
            }
            if (captureContext.level) {
                this._level = captureContext.level;
            }
            if (captureContext.fingerprint) {
                this._fingerprint = captureContext.fingerprint;
            }
        }
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clear = function () {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._span = undefined;
        this._session = undefined;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        var mergedBreadcrumb = tslib_es6_assign({ timestamp: Object(time["a" /* dateTimestampInSeconds */])() }, breadcrumb);
        this._breadcrumbs =
            maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0
                ? tslib_es6_spread(this._breadcrumbs, [mergedBreadcrumb]).slice(-maxBreadcrumbs)
                : tslib_es6_spread(this._breadcrumbs, [mergedBreadcrumb]);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clearBreadcrumbs = function () {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
    };
    /**
     * Applies the current context and fingerprint to the event.
     * Note that breadcrumbs will be added by the client.
     * Also if the event has already breadcrumbs on it, we do not merge them.
     * @param event Event
     * @param hint May contain additional informartion about the original exception.
     * @hidden
     */
    Scope.prototype.applyToEvent = function (event, hint) {
        var _a;
        if (this._extra && Object.keys(this._extra).length) {
            event.extra = tslib_es6_assign(tslib_es6_assign({}, this._extra), event.extra);
        }
        if (this._tags && Object.keys(this._tags).length) {
            event.tags = tslib_es6_assign(tslib_es6_assign({}, this._tags), event.tags);
        }
        if (this._user && Object.keys(this._user).length) {
            event.user = tslib_es6_assign(tslib_es6_assign({}, this._user), event.user);
        }
        if (this._contexts && Object.keys(this._contexts).length) {
            event.contexts = tslib_es6_assign(tslib_es6_assign({}, this._contexts), event.contexts);
        }
        if (this._level) {
            event.level = this._level;
        }
        if (this._transactionName) {
            event.transaction = this._transactionName;
        }
        // We want to set the trace context for normal events only if there isn't already
        // a trace context on the event. There is a product feature in place where we link
        // errors with transaction and it relys on that.
        if (this._span) {
            event.contexts = tslib_es6_assign({ trace: this._span.getTraceContext() }, event.contexts);
            var transactionName = (_a = this._span.transaction) === null || _a === void 0 ? void 0 : _a.name;
            if (transactionName) {
                event.tags = tslib_es6_assign({ transaction: transactionName }, event.tags);
            }
        }
        this._applyFingerprint(event);
        event.breadcrumbs = tslib_es6_spread((event.breadcrumbs || []), this._breadcrumbs);
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
        return this._notifyEventProcessors(tslib_es6_spread(getGlobalEventProcessors(), this._eventProcessors), event, hint);
    };
    /**
     * This will be called after {@link applyToEvent} is finished.
     */
    Scope.prototype._notifyEventProcessors = function (processors, event, hint, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        return new syncpromise_SyncPromise(function (resolve, reject) {
            var processor = processors[index];
            if (event === null || typeof processor !== 'function') {
                resolve(event);
            }
            else {
                var result = processor(tslib_es6_assign({}, event), hint);
                if (Object(is["j" /* isThenable */])(result)) {
                    result
                        .then(function (final) { return _this._notifyEventProcessors(processors, final, hint, index + 1).then(resolve); })
                        .then(null, reject);
                }
                else {
                    _this._notifyEventProcessors(processors, result, hint, index + 1)
                        .then(resolve)
                        .then(null, reject);
                }
            }
        });
    };
    /**
     * This will be called on every set call.
     */
    Scope.prototype._notifyScopeListeners = function () {
        var _this = this;
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            this._scopeListeners.forEach(function (callback) {
                callback(_this);
            });
            this._notifyingListeners = false;
        }
    };
    /**
     * Applies fingerprint from the scope to the event if there's one,
     * uses message if there's one instead or get rid of empty fingerprint
     */
    Scope.prototype._applyFingerprint = function (event) {
        // Make sure it's an array first and we actually have something in place
        event.fingerprint = event.fingerprint
            ? Array.isArray(event.fingerprint)
                ? event.fingerprint
                : [event.fingerprint]
            : [];
        // If we have something on the scope, then merge it with event
        if (this._fingerprint) {
            event.fingerprint = event.fingerprint.concat(this._fingerprint);
        }
        // If we have no data at all, remove empty array default
        if (event.fingerprint && !event.fingerprint.length) {
            delete event.fingerprint;
        }
    };
    return Scope;
}());

/**
 * Retruns the global event processors.
 */
function getGlobalEventProcessors() {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access  */
    var global = Object(misc["f" /* getGlobalObject */])();
    global.__SENTRY__ = global.__SENTRY__ || {};
    global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
    return global.__SENTRY__.globalEventProcessors;
    /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function scope_addGlobalEventProcessor(callback) {
    getGlobalEventProcessors().push(callback);
}
//# sourceMappingURL=scope.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/minimal/node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
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
/* global Reflect, Promise */

var tslib_tslib_es6_extendStatics = function(d, b) {
    tslib_tslib_es6_extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return tslib_tslib_es6_extendStatics(d, b);
};

function tslib_tslib_es6_extends(d, b) {
    tslib_tslib_es6_extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var tslib_tslib_es6_assign = function() {
    tslib_tslib_es6_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return tslib_tslib_es6_assign.apply(this, arguments);
}

function tslib_tslib_es6_rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function tslib_tslib_es6_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function tslib_tslib_es6_param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function tslib_tslib_es6_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function tslib_tslib_es6_awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function tslib_tslib_es6_generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function tslib_tslib_es6_createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function tslib_tslib_es6_exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function tslib_tslib_es6_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function tslib_tslib_es6_read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function tslib_tslib_es6_spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(tslib_tslib_es6_read(arguments[i]));
    return ar;
}

function tslib_tslib_es6_spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function tslib_tslib_es6_await(v) {
    return this instanceof tslib_tslib_es6_await ? (this.v = v, this) : new tslib_tslib_es6_await(v);
}

function tslib_tslib_es6_asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof tslib_tslib_es6_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function tslib_tslib_es6_asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: tslib_tslib_es6_await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function tslib_tslib_es6_asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof tslib_tslib_es6_values === "function" ? tslib_tslib_es6_values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function tslib_tslib_es6_makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function tslib_tslib_es6_importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function tslib_tslib_es6_importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function tslib_tslib_es6_classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function tslib_tslib_es6_classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/logger.js
/* eslint-disable @typescript-eslint/no-explicit-any */

// TODO: Implement different loggers for different environments
var logger_global = Object(misc["f" /* getGlobalObject */])();
/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';
/** JSDoc */
var logger_Logger = /** @class */ (function () {
    /** JSDoc */
    function Logger() {
        this._enabled = false;
    }
    /** JSDoc */
    Logger.prototype.disable = function () {
        this._enabled = false;
    };
    /** JSDoc */
    Logger.prototype.enable = function () {
        this._enabled = true;
    };
    /** JSDoc */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        Object(misc["d" /* consoleSandbox */])(function () {
            logger_global.console.log(PREFIX + "[Log]: " + args.join(' '));
        });
    };
    /** JSDoc */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        Object(misc["d" /* consoleSandbox */])(function () {
            logger_global.console.warn(PREFIX + "[Warn]: " + args.join(' '));
        });
    };
    /** JSDoc */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        Object(misc["d" /* consoleSandbox */])(function () {
            logger_global.console.error(PREFIX + "[Error]: " + args.join(' '));
        });
    };
    return Logger;
}());
// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
logger_global.__SENTRY__ = logger_global.__SENTRY__ || {};
var logger = logger_global.__SENTRY__.logger || (logger_global.__SENTRY__.logger = new logger_Logger());

//# sourceMappingURL=logger.js.map
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/node.js
var node = __webpack_require__(34);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/session.js
/**
 * Session Status
 */
var SessionStatus;
(function (SessionStatus) {
    /** JSDoc */
    SessionStatus["Ok"] = "ok";
    /** JSDoc */
    SessionStatus["Exited"] = "exited";
    /** JSDoc */
    SessionStatus["Crashed"] = "crashed";
    /** JSDoc */
    SessionStatus["Abnormal"] = "abnormal";
})(SessionStatus || (SessionStatus = {}));
//# sourceMappingURL=session.js.map
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/object.js + 3 modules
var object = __webpack_require__(107);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/session.js


/**
 * @inheritdoc
 */
var session_Session = /** @class */ (function () {
    function Session(context) {
        this.errors = 0;
        this.sid = Object(misc["j" /* uuid4 */])();
        this.timestamp = Date.now();
        this.started = Date.now();
        this.duration = 0;
        this.status = SessionStatus.Ok;
        if (context) {
            this.update(context);
        }
    }
    /** JSDoc */
    // eslint-disable-next-line complexity
    Session.prototype.update = function (context) {
        if (context === void 0) { context = {}; }
        if (context.user) {
            if (context.user.ip_address) {
                this.ipAddress = context.user.ip_address;
            }
            if (!context.did) {
                this.did = context.user.id || context.user.email || context.user.username;
            }
        }
        this.timestamp = context.timestamp || Date.now();
        if (context.sid) {
            // Good enough uuid validation. — Kamil
            this.sid = context.sid.length === 32 ? context.sid : Object(misc["j" /* uuid4 */])();
        }
        if (context.did) {
            this.did = "" + context.did;
        }
        if (typeof context.started === 'number') {
            this.started = context.started;
        }
        if (typeof context.duration === 'number') {
            this.duration = context.duration;
        }
        else {
            this.duration = this.timestamp - this.started;
        }
        if (context.release) {
            this.release = context.release;
        }
        if (context.environment) {
            this.environment = context.environment;
        }
        if (context.ipAddress) {
            this.ipAddress = context.ipAddress;
        }
        if (context.userAgent) {
            this.userAgent = context.userAgent;
        }
        if (typeof context.errors === 'number') {
            this.errors = context.errors;
        }
        if (context.status) {
            this.status = context.status;
        }
    };
    /** JSDoc */
    Session.prototype.close = function (status) {
        if (status) {
            this.update({ status: status });
        }
        else if (this.status === SessionStatus.Ok) {
            this.update({ status: SessionStatus.Exited });
        }
        else {
            this.update();
        }
    };
    /** JSDoc */
    Session.prototype.toJSON = function () {
        return Object(object["a" /* dropUndefinedKeys */])({
            sid: "" + this.sid,
            init: true,
            started: new Date(this.started).toISOString(),
            timestamp: new Date(this.timestamp).toISOString(),
            status: this.status,
            errors: this.errors,
            did: typeof this.did === 'number' || typeof this.did === 'string' ? "" + this.did : undefined,
            duration: this.duration,
            attrs: Object(object["a" /* dropUndefinedKeys */])({
                release: this.release,
                environment: this.environment,
                ip_address: this.ipAddress,
                user_agent: this.userAgent,
            }),
        });
    };
    return Session;
}());

//# sourceMappingURL=session.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/hub.js




/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be increased when the global interface
 * changes and new methods are introduced.
 *
 * @hidden
 */
var API_VERSION = 3;
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 100;
/**
 * Absolute maximum number of breadcrumbs added to an event. The
 * `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;
/**
 * @inheritDoc
 */
var hub_Hub = /** @class */ (function () {
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    function Hub(client, scope, _version) {
        if (scope === void 0) { scope = new scope_Scope(); }
        if (_version === void 0) { _version = API_VERSION; }
        this._version = _version;
        /** Is a {@link Layer}[] containing the client and scope */
        this._stack = [{}];
        this.getStackTop().scope = scope;
        this.bindClient(client);
    }
    /**
     * @inheritDoc
     */
    Hub.prototype.isOlderThan = function (version) {
        return this._version < version;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.bindClient = function (client) {
        var top = this.getStackTop();
        top.client = client;
        if (client && client.setupIntegrations) {
            client.setupIntegrations();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.pushScope = function () {
        // We want to clone the content of prev scope
        var scope = scope_Scope.clone(this.getScope());
        this.getStack().push({
            client: this.getClient(),
            scope: scope,
        });
        return scope;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.popScope = function () {
        if (this.getStack().length <= 1)
            return false;
        return !!this.getStack().pop();
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.withScope = function (callback) {
        var scope = this.pushScope();
        try {
            callback(scope);
        }
        finally {
            this.popScope();
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getClient = function () {
        return this.getStackTop().client;
    };
    /** Returns the scope of the top stack. */
    Hub.prototype.getScope = function () {
        return this.getStackTop().scope;
    };
    /** Returns the scope stack for domains or the process. */
    Hub.prototype.getStack = function () {
        return this._stack;
    };
    /** Returns the topmost scope layer in the order domain > local > process. */
    Hub.prototype.getStackTop = function () {
        return this._stack[this._stack.length - 1];
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Hub.prototype.captureException = function (exception, hint) {
        var eventId = (this._lastEventId = Object(misc["j" /* uuid4 */])());
        var finalHint = hint;
        // If there's no explicit hint provided, mimick the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error('Sentry syntheticException');
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: exception,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureException', exception, tslib_es6_assign(tslib_es6_assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureMessage = function (message, level, hint) {
        var eventId = (this._lastEventId = Object(misc["j" /* uuid4 */])());
        var finalHint = hint;
        // If there's no explicit hint provided, mimick the same thing that would happen
        // in the minimal itself to create a consistent behavior.
        // We don't do this in the client, as it's the lowest level API, and doing this,
        // would prevent user from having full control over direct calls.
        if (!hint) {
            var syntheticException = void 0;
            try {
                throw new Error(message);
            }
            catch (exception) {
                syntheticException = exception;
            }
            finalHint = {
                originalException: message,
                syntheticException: syntheticException,
            };
        }
        this._invokeClient('captureMessage', message, level, tslib_es6_assign(tslib_es6_assign({}, finalHint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureEvent = function (event, hint) {
        var eventId = (this._lastEventId = Object(misc["j" /* uuid4 */])());
        this._invokeClient('captureEvent', event, tslib_es6_assign(tslib_es6_assign({}, hint), { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.lastEventId = function () {
        return this._lastEventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.addBreadcrumb = function (breadcrumb, hint) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope || !client)
            return;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _b = (client.getOptions && client.getOptions()) || {}, _c = _b.beforeBreadcrumb, beforeBreadcrumb = _c === void 0 ? null : _c, _d = _b.maxBreadcrumbs, maxBreadcrumbs = _d === void 0 ? DEFAULT_BREADCRUMBS : _d;
        if (maxBreadcrumbs <= 0)
            return;
        var timestamp = Object(time["a" /* dateTimestampInSeconds */])();
        var mergedBreadcrumb = tslib_es6_assign({ timestamp: timestamp }, breadcrumb);
        var finalBreadcrumb = beforeBreadcrumb
            ? Object(misc["d" /* consoleSandbox */])(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
            : mergedBreadcrumb;
        if (finalBreadcrumb === null)
            return;
        scope.addBreadcrumb(finalBreadcrumb, Math.min(maxBreadcrumbs, MAX_BREADCRUMBS));
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setUser = function (user) {
        var scope = this.getScope();
        if (scope)
            scope.setUser(user);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTags = function (tags) {
        var scope = this.getScope();
        if (scope)
            scope.setTags(tags);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtras = function (extras) {
        var scope = this.getScope();
        if (scope)
            scope.setExtras(extras);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTag = function (key, value) {
        var scope = this.getScope();
        if (scope)
            scope.setTag(key, value);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtra = function (key, extra) {
        var scope = this.getScope();
        if (scope)
            scope.setExtra(key, extra);
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype.setContext = function (name, context) {
        var scope = this.getScope();
        if (scope)
            scope.setContext(name, context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.configureScope = function (callback) {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (scope && client) {
            callback(scope);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.run = function (callback) {
        var oldHub = makeMain(this);
        try {
            callback(this);
        }
        finally {
            makeMain(oldHub);
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.getIntegration = function (integration) {
        var client = this.getClient();
        if (!client)
            return null;
        try {
            return client.getIntegration(integration);
        }
        catch (_oO) {
            logger.warn("Cannot retrieve integration " + integration.id + " from the current Hub");
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSpan = function (context) {
        return this._callExtensionMethod('startSpan', context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startTransaction = function (context, customSamplingContext) {
        return this._callExtensionMethod('startTransaction', context, customSamplingContext);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.traceHeaders = function () {
        return this._callExtensionMethod('traceHeaders');
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.startSession = function (context) {
        // End existing session if there's one
        this.endSession();
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        var _b = (client && client.getOptions()) || {}, release = _b.release, environment = _b.environment;
        var session = new session_Session(tslib_es6_assign(tslib_es6_assign({ release: release,
            environment: environment }, (scope && { user: scope.getUser() })), context));
        if (scope) {
            scope.setSession(session);
        }
        return session;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.endSession = function () {
        var _a = this.getStackTop(), scope = _a.scope, client = _a.client;
        if (!scope)
            return;
        var session = scope.getSession && scope.getSession();
        if (session) {
            session.close();
            if (client && client.captureSession) {
                client.captureSession(session);
            }
            scope.setSession();
        }
    };
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._invokeClient = function (method) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _b = this.getStackTop(), scope = _b.scope, client = _b.client;
        if (client && client[method]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (_a = client)[method].apply(_a, tslib_es6_spread(args, [scope]));
        }
    };
    /**
     * Calls global extension method and binding current instance to the function call
     */
    // @ts-ignore Function lacks ending return statement and return type does not include 'undefined'. ts(2366)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype._callExtensionMethod = function (method) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var carrier = getMainCarrier();
        var sentry = carrier.__SENTRY__;
        if (sentry && sentry.extensions && typeof sentry.extensions[method] === 'function') {
            return sentry.extensions[method].apply(this, args);
        }
        logger.warn("Extension method " + method + " couldn't be found, doing nothing.");
    };
    return Hub;
}());

/** Returns the global shim registry. */
function getMainCarrier() {
    var carrier = Object(misc["f" /* getGlobalObject */])();
    carrier.__SENTRY__ = carrier.__SENTRY__ || {
        extensions: {},
        hub: undefined,
    };
    return carrier;
}
/**
 * Replaces the current main hub with the passed one on the global object
 *
 * @returns The old replaced hub
 */
function makeMain(hub) {
    var registry = getMainCarrier();
    var oldHub = getHubFromCarrier(registry);
    setHubOnCarrier(registry, hub);
    return oldHub;
}
/**
 * Returns the default hub instance.
 *
 * If a hub is already registered in the global carrier but this module
 * contains a more recent version, it replaces the registered version.
 * Otherwise, the currently registered hub will be returned.
 */
function hub_getCurrentHub() {
    // Get main carrier (global for every environment)
    var registry = getMainCarrier();
    // If there's no hub, or its an old API, assign a new one
    if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
        setHubOnCarrier(registry, new hub_Hub());
    }
    // Prefer domains over global if they are there (applicable only to Node environment)
    if (Object(node["c" /* isNodeEnv */])()) {
        return getHubFromActiveDomain(registry);
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
/**
 * Returns the active domain, if one exists
 *
 * @returns The domain, or undefined if there is no active domain
 */
function getActiveDomain() {
    var sentry = getMainCarrier().__SENTRY__;
    return sentry && sentry.extensions && sentry.extensions.domain && sentry.extensions.domain.active;
}
/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
    try {
        var activeDomain = getActiveDomain();
        // If there's no active domain, just return global hub
        if (!activeDomain) {
            return getHubFromCarrier(registry);
        }
        // If there's no hub on current domain, or it's an old API, assign a new one
        if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
            var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
            setHubOnCarrier(activeDomain, new hub_Hub(registryHubTopStack.client, scope_Scope.clone(registryHubTopStack.scope)));
        }
        // Return hub that lives on a domain
        return getHubFromCarrier(activeDomain);
    }
    catch (_Oo) {
        // Return hub that lives on a global object
        return getHubFromCarrier(registry);
    }
}
/**
 * This will tell whether a carrier has a hub on it or not
 * @param carrier object
 */
function hasHubOnCarrier(carrier) {
    return !!(carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub);
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
    if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub)
        return carrier.__SENTRY__.hub;
    carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    carrier.__SENTRY__.hub = new hub_Hub();
    return carrier.__SENTRY__.hub;
}
/**
 * This will set passed {@link Hub} on the passed object's __SENTRY__.hub attribute
 * @param carrier object
 * @param hub Hub
 */
function setHubOnCarrier(carrier, hub) {
    if (!carrier)
        return false;
    carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    carrier.__SENTRY__.hub = hub;
    return true;
}
//# sourceMappingURL=hub.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/minimal/esm/index.js


/**
 * This calls a function on the current hub.
 * @param method function to call on hub.
 * @param args to pass to function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callOnHub(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var hub = hub_getCurrentHub();
    if (hub && hub[method]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return hub[method].apply(hub, tslib_tslib_es6_spread(args));
    }
    throw new Error("No hub defined or " + method + " was not found on the hub, please open a bug report.");
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function captureException(exception, captureContext) {
    var syntheticException;
    try {
        throw new Error('Sentry syntheticException');
    }
    catch (exception) {
        syntheticException = exception;
    }
    return callOnHub('captureException', exception, {
        captureContext: captureContext,
        originalException: exception,
        syntheticException: syntheticException,
    });
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param level Define the level of the message.
 * @returns The generated eventId.
 */
function captureMessage(message, captureContext) {
    var syntheticException;
    try {
        throw new Error(message);
    }
    catch (exception) {
        syntheticException = exception;
    }
    // This is necessary to provide explicit scopes upgrade, without changing the original
    // arity of the `captureMessage(message, level)` method.
    var level = typeof captureContext === 'string' ? captureContext : undefined;
    var context = typeof captureContext !== 'string' ? { captureContext: captureContext } : undefined;
    return callOnHub('captureMessage', message, level, tslib_tslib_es6_assign({ originalException: message, syntheticException: syntheticException }, context));
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @returns The generated eventId.
 */
function captureEvent(event) {
    return callOnHub('captureEvent', event);
}
/**
 * Callback to set context information onto the scope.
 * @param callback Callback function that receives Scope.
 */
function configureScope(callback) {
    callOnHub('configureScope', callback);
}
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 *
 * @param breadcrumb The breadcrumb to record.
 */
function addBreadcrumb(breadcrumb) {
    callOnHub('addBreadcrumb', breadcrumb);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setContext(name, context) {
    callOnHub('setContext', name, context);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */
function setExtras(extras) {
    callOnHub('setExtras', extras);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */
function setTags(tags) {
    callOnHub('setTags', tags);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */
function setExtra(key, extra) {
    callOnHub('setExtra', key, extra);
}
/**
 * Set key:value that will be sent as tags data with the event.
 * @param key String key of tag
 * @param value String value of tag
 */
function setTag(key, value) {
    callOnHub('setTag', key, value);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */
function setUser(user) {
    callOnHub('setUser', user);
}
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 *
 * This is essentially a convenience function for:
 *
 *     pushScope();
 *     callback();
 *     popScope();
 *
 * @param callback that will be enclosed into push/popScope.
 */
function withScope(callback) {
    callOnHub('withScope', callback);
}
/**
 * Calls a function on the latest client. Use this with caution, it's meant as
 * in "internal" helper so we don't need to expose every possible function in
 * the shim. It is not guaranteed that the client actually implements the
 * function.
 *
 * @param method The method to call on the client/client.
 * @param args Arguments to pass to the client/fontend.
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _callOnClient(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    callOnHub.apply(void 0, tslib_tslib_es6_spread(['_invokeClient', method], args));
}
/**
 * Starts a new `Transaction` and returns it. This is the entry point to manual tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and child spans to other spans. To start a
 * new child span within the transaction or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished, otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at which point the transaction with all its
 * finished child spans will be sent to Sentry.
 *
 * @param context Properties of the new `Transaction`.
 * @param customSamplingContext Information given to the transaction sampling function (along with context-dependent
 * default values). See {@link Options.tracesSampler}.
 *
 * @returns The transaction which was just started
 */
function startTransaction(context, customSamplingContext) {
    return callOnHub('startTransaction', tslib_tslib_es6_assign({}, context), customSamplingContext);
}
//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(23);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/polyfill.js
var setPrototypeOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties);
/**
 * setPrototypeOf polyfill using __proto__
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function setProtoOf(obj, proto) {
    // @ts-ignore __proto__ does not exist on obj
    obj.__proto__ = proto;
    return obj;
}
/**
 * setPrototypeOf polyfill using mixin
 */
// eslint-disable-next-line @typescript-eslint/ban-types
function mixinProperties(obj, proto) {
    for (var prop in proto) {
        // eslint-disable-next-line no-prototype-builtins
        if (!obj.hasOwnProperty(prop)) {
            // @ts-ignore typescript complains about indexing so we remove
            obj[prop] = proto[prop];
        }
    }
    return obj;
}
//# sourceMappingURL=polyfill.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/error.js


/** An error emitted by Sentry SDKs and related utilities. */
var error_SentryError = /** @class */ (function (_super) {
    Object(tslib_es6["a" /* __extends */])(SentryError, _super);
    function SentryError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.name = _newTarget.prototype.constructor.name;
        setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return SentryError;
}(Error));

//# sourceMappingURL=error.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/transports/noop.js


/** Noop transport */
var noop_NoopTransport = /** @class */ (function () {
    function NoopTransport() {
    }
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.sendEvent = function (_) {
        return syncpromise_SyncPromise.resolve({
            reason: "NoopTransport: Event has been skipped because no Dsn is configured.",
            status: Status.Skipped,
        });
    };
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.close = function (_) {
        return syncpromise_SyncPromise.resolve(true);
    };
    return NoopTransport;
}());

//# sourceMappingURL=noop.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/basebackend.js


/**
 * This is the base implemention of a Backend.
 * @hidden
 */
var basebackend_BaseBackend = /** @class */ (function () {
    /** Creates a new backend instance. */
    function BaseBackend(options) {
        this._options = options;
        if (!this._options.dsn) {
            logger.warn('No DSN provided, backend will not do anything.');
        }
        this._transport = this._setupTransport();
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseBackend.prototype.eventFromException = function (_exception, _hint) {
        throw new error_SentryError('Backend has to implement `eventFromException` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromMessage = function (_message, _level, _hint) {
        throw new error_SentryError('Backend has to implement `eventFromMessage` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendEvent = function (event) {
        this._transport.sendEvent(event).then(null, function (reason) {
            logger.error("Error while sending event: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendSession = function (session) {
        if (!this._transport.sendSession) {
            logger.warn("Dropping session because custom transport doesn't implement sendSession");
            return;
        }
        this._transport.sendSession(session).then(null, function (reason) {
            logger.error("Error while sending session: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.getTransport = function () {
        return this._transport;
    };
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    BaseBackend.prototype._setupTransport = function () {
        return new noop_NoopTransport();
    };
    return BaseBackend;
}());

//# sourceMappingURL=basebackend.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/dsn.js


/** Regular expression used to parse a Dsn. */
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w.-]+)(?::(\d+))?\/(.+)/;
/** Error message */
var ERROR_MESSAGE = 'Invalid Dsn';
/** The Sentry Dsn, identifying a Sentry instance and project. */
var dsn_Dsn = /** @class */ (function () {
    /** Creates a new Dsn component */
    function Dsn(from) {
        if (typeof from === 'string') {
            this._fromString(from);
        }
        else {
            this._fromComponents(from);
        }
        this._validate();
    }
    /**
     * Renders the string representation of this Dsn.
     *
     * By default, this will render the public representation without the password
     * component. To get the deprecated private representation, set `withPassword`
     * to true.
     *
     * @param withPassword When set to true, the password will be included.
     */
    Dsn.prototype.toString = function (withPassword) {
        if (withPassword === void 0) { withPassword = false; }
        var _a = this, host = _a.host, path = _a.path, pass = _a.pass, port = _a.port, projectId = _a.projectId, protocol = _a.protocol, user = _a.user;
        return (protocol + "://" + user + (withPassword && pass ? ":" + pass : '') +
            ("@" + host + (port ? ":" + port : '') + "/" + (path ? path + "/" : path) + projectId));
    };
    /** Parses a string into this Dsn. */
    Dsn.prototype._fromString = function (str) {
        var match = DSN_REGEX.exec(str);
        if (!match) {
            throw new error_SentryError(ERROR_MESSAGE);
        }
        var _a = Object(tslib_es6["b" /* __read */])(match.slice(1), 6), protocol = _a[0], user = _a[1], _b = _a[2], pass = _b === void 0 ? '' : _b, host = _a[3], _c = _a[4], port = _c === void 0 ? '' : _c, lastPath = _a[5];
        var path = '';
        var projectId = lastPath;
        var split = projectId.split('/');
        if (split.length > 1) {
            path = split.slice(0, -1).join('/');
            projectId = split.pop();
        }
        if (projectId) {
            var projectMatch = projectId.match(/^\d+/);
            if (projectMatch) {
                projectId = projectMatch[0];
            }
        }
        this._fromComponents({ host: host, pass: pass, path: path, projectId: projectId, port: port, protocol: protocol, user: user });
    };
    /** Maps Dsn components into this instance. */
    Dsn.prototype._fromComponents = function (components) {
        this.protocol = components.protocol;
        this.user = components.user;
        this.pass = components.pass || '';
        this.host = components.host;
        this.port = components.port || '';
        this.path = components.path || '';
        this.projectId = components.projectId;
    };
    /** Validates this Dsn and throws on error. */
    Dsn.prototype._validate = function () {
        var _this = this;
        ['protocol', 'user', 'host', 'projectId'].forEach(function (component) {
            if (!_this[component]) {
                throw new error_SentryError(ERROR_MESSAGE + ": " + component + " missing");
            }
        });
        if (!this.projectId.match(/^\d+$/)) {
            throw new error_SentryError(ERROR_MESSAGE + ": Invalid projectId " + this.projectId);
        }
        if (this.protocol !== 'http' && this.protocol !== 'https') {
            throw new error_SentryError(ERROR_MESSAGE + ": Invalid protocol " + this.protocol);
        }
        if (this.port && isNaN(parseInt(this.port, 10))) {
            throw new error_SentryError(ERROR_MESSAGE + ": Invalid port " + this.port);
        }
    };
    return Dsn;
}());

//# sourceMappingURL=dsn.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/path.js
// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript
// https://raw.githubusercontent.com/calvinmetcalf/rollup-plugin-node-builtins/master/src/es6/path.js
/** JSDoc */
function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
            parts.splice(i, 1);
        }
        else if (last === '..') {
            parts.splice(i, 1);
            // eslint-disable-next-line no-plusplus
            up++;
        }
        else if (up) {
            parts.splice(i, 1);
            // eslint-disable-next-line no-plusplus
            up--;
        }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        // eslint-disable-next-line no-plusplus
        for (; up--; up) {
            parts.unshift('..');
        }
    }
    return parts;
}
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^/]+?|)(\.[^./]*|))(?:[/]*)$/;
/** JSDoc */
function splitPath(filename) {
    var parts = splitPathRe.exec(filename);
    return parts ? parts.slice(1) : [];
}
// path.resolve([from ...], to)
// posix version
/** JSDoc */
function path_resolve() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var resolvedPath = '';
    var resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? args[i] : '/';
        // Skip empty entries
        if (!path) {
            continue;
        }
        resolvedPath = path + "/" + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeArray(resolvedPath.split('/').filter(function (p) { return !!p; }), !resolvedAbsolute).join('/');
    return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
}
/** JSDoc */
function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
        if (arr[start] !== '') {
            break;
        }
    }
    var end = arr.length - 1;
    for (; end >= 0; end--) {
        if (arr[end] !== '') {
            break;
        }
    }
    if (start > end) {
        return [];
    }
    return arr.slice(start, end - start + 1);
}
// path.relative(from, to)
// posix version
/** JSDoc */
function relative(from, to) {
    /* eslint-disable no-param-reassign */
    from = path_resolve(from).substr(1);
    to = path_resolve(to).substr(1);
    /* eslint-enable no-param-reassign */
    var fromParts = trim(from.split('/'));
    var toParts = trim(to.split('/'));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
        }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join('/');
}
// path.normalize(path)
// posix version
/** JSDoc */
function normalizePath(path) {
    var isPathAbsolute = isAbsolute(path);
    var trailingSlash = path.substr(-1) === '/';
    // Normalize the path
    var normalizedPath = normalizeArray(path.split('/').filter(function (p) { return !!p; }), !isPathAbsolute).join('/');
    if (!normalizedPath && !isPathAbsolute) {
        normalizedPath = '.';
    }
    if (normalizedPath && trailingSlash) {
        normalizedPath += '/';
    }
    return (isPathAbsolute ? '/' : '') + normalizedPath;
}
// posix version
/** JSDoc */
function isAbsolute(path) {
    return path.charAt(0) === '/';
}
// posix version
/** JSDoc */
function join() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return normalizePath(args.join('/'));
}
/** JSDoc */
function dirname(path) {
    var result = splitPath(path);
    var root = result[0];
    var dir = result[1];
    if (!root && !dir) {
        // No dirname whatsoever
        return '.';
    }
    if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
}
/** JSDoc */
function basename(path, ext) {
    var f = splitPath(path)[2];
    if (ext && f.substr(ext.length * -1) === ext) {
        f = f.substr(0, f.length - ext.length);
    }
    return f;
}
//# sourceMappingURL=path.js.map
// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(12);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/lru_map/lru.js
var lru = __webpack_require__(106);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/stacktrace.js
/**
 * stack-trace - Parses node.js stack traces
 *
 * This was originally forked to fix this issue:
 * https://github.com/felixge/node-stack-trace/issues/31
 *
 * Mar 19,2019 - #4fd379e
 *
 * https://github.com/felixge/node-stack-trace/
 * @license MIT
 */
/** Extracts StackFrames fron the Error */
function parse(err) {
    if (!err.stack) {
        return [];
    }
    var lines = err.stack.split('\n').slice(1);
    return lines
        .map(function (line) {
        if (line.match(/^\s*[-]{4,}$/)) {
            return {
                columnNumber: null,
                fileName: line,
                functionName: null,
                lineNumber: null,
                methodName: null,
                native: null,
                typeName: null,
            };
        }
        var lineMatch = line.match(/at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
        if (!lineMatch) {
            return undefined;
        }
        var object = null;
        var method = null;
        var functionName = null;
        var typeName = null;
        var methodName = null;
        var isNative = lineMatch[5] === 'native';
        if (lineMatch[1]) {
            functionName = lineMatch[1];
            var methodStart = functionName.lastIndexOf('.');
            if (functionName[methodStart - 1] === '.') {
                // eslint-disable-next-line no-plusplus
                methodStart--;
            }
            if (methodStart > 0) {
                object = functionName.substr(0, methodStart);
                method = functionName.substr(methodStart + 1);
                var objectEnd = object.indexOf('.Module');
                if (objectEnd > 0) {
                    functionName = functionName.substr(objectEnd + 1);
                    object = object.substr(0, objectEnd);
                }
            }
            typeName = null;
        }
        if (method) {
            typeName = object;
            methodName = method;
        }
        if (method === '<anonymous>') {
            methodName = null;
            functionName = null;
        }
        var properties = {
            columnNumber: parseInt(lineMatch[4], 10) || null,
            fileName: lineMatch[2] || null,
            functionName: functionName,
            lineNumber: parseInt(lineMatch[3], 10) || null,
            methodName: methodName,
            native: isNative,
            typeName: typeName,
        };
        return properties;
    })
        .filter(function (callSite) { return !!callSite; });
}
//# sourceMappingURL=stacktrace.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/parsers.js




var DEFAULT_LINES_OF_CONTEXT = 7;
var FILE_CONTENT_CACHE = new lru["LRUMap"](100);
/**
 * Resets the file cache. Exists for testing purposes.
 * @hidden
 */
function resetFileContentCache() {
    FILE_CONTENT_CACHE.clear();
}
/** JSDoc */
function getFunction(frame) {
    try {
        return frame.functionName || frame.typeName + "." + (frame.methodName || '<anonymous>');
    }
    catch (e) {
        // This seems to happen sometimes when using 'use strict',
        // stemming from `getTypeName`.
        // [TypeError: Cannot read property 'constructor' of undefined]
        return '<anonymous>';
    }
}
var mainModule = ((__webpack_require__.c[__webpack_require__.s] && __webpack_require__.c[__webpack_require__.s].filename && dirname(__webpack_require__.c[__webpack_require__.s].filename)) ||
    global.process.cwd()) + "/";
/** JSDoc */
function getModule(filename, base) {
    if (!base) {
        // eslint-disable-next-line no-param-reassign
        base = mainModule;
    }
    // It's specifically a module
    var file = basename(filename, '.js');
    // eslint-disable-next-line no-param-reassign
    filename = dirname(filename);
    var n = filename.lastIndexOf('/node_modules/');
    if (n > -1) {
        // /node_modules/ is 14 chars
        return filename.substr(n + 14).replace(/\//g, '.') + ":" + file;
    }
    // Let's see if it's a part of the main module
    // To be a part of main module, it has to share the same base
    n = (filename + "/").lastIndexOf(base, 0);
    if (n === 0) {
        var moduleName = filename.substr(base.length).replace(/\//g, '.');
        if (moduleName) {
            moduleName += ':';
        }
        moduleName += file;
        return moduleName;
    }
    return file;
}
/**
 * This function reads file contents and caches them in a global LRU cache.
 * Returns a Promise filepath => content array for all files that we were able to read.
 *
 * @param filenames Array of filepaths to read content from.
 */
function readSourceFiles(filenames) {
    // we're relying on filenames being de-duped already
    if (filenames.length === 0) {
        return syncpromise_SyncPromise.resolve({});
    }
    return new syncpromise_SyncPromise(function (resolve) {
        var sourceFiles = {};
        var count = 0;
        var _loop_1 = function (i) {
            var filename = filenames[i];
            var cache = FILE_CONTENT_CACHE.get(filename);
            // We have a cache hit
            if (cache !== undefined) {
                // If it's not null (which means we found a file and have a content)
                // we set the content and return it later.
                if (cache !== null) {
                    sourceFiles[filename] = cache;
                }
                // eslint-disable-next-line no-plusplus
                count++;
                // In any case we want to skip here then since we have a content already or we couldn't
                // read the file and don't want to try again.
                if (count === filenames.length) {
                    resolve(sourceFiles);
                }
                return "continue";
            }
            Object(external_fs_["readFile"])(filename, function (err, data) {
                var content = err ? null : data.toString();
                sourceFiles[filename] = content;
                // We always want to set the cache, even to null which means there was an error reading the file.
                // We do not want to try to read the file again.
                FILE_CONTENT_CACHE.set(filename, content);
                // eslint-disable-next-line no-plusplus
                count++;
                if (count === filenames.length) {
                    resolve(sourceFiles);
                }
            });
        };
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var i = 0; i < filenames.length; i++) {
            _loop_1(i);
        }
    });
}
/**
 * @hidden
 */
function extractStackFromError(error) {
    var stack = parse(error);
    if (!stack) {
        return [];
    }
    return stack;
}
/**
 * @hidden
 */
function parseStack(stack, options) {
    var filesToRead = [];
    var linesOfContext = options && options.frameContextLines !== undefined ? options.frameContextLines : DEFAULT_LINES_OF_CONTEXT;
    var frames = stack.map(function (frame) {
        var parsedFrame = {
            colno: frame.columnNumber,
            filename: frame.fileName || '',
            function: getFunction(frame),
            lineno: frame.lineNumber,
        };
        var isInternal = frame.native ||
            (parsedFrame.filename &&
                !parsedFrame.filename.startsWith('/') &&
                !parsedFrame.filename.startsWith('.') &&
                parsedFrame.filename.indexOf(':\\') !== 1);
        // in_app is all that's not an internal Node function or a module within node_modules
        // note that isNative appears to return true even for node core libraries
        // see https://github.com/getsentry/raven-node/issues/176
        parsedFrame.in_app =
            !isInternal && parsedFrame.filename !== undefined && parsedFrame.filename.indexOf('node_modules/') === -1;
        // Extract a module name based on the filename
        if (parsedFrame.filename) {
            parsedFrame.module = getModule(parsedFrame.filename);
            if (!isInternal && linesOfContext > 0 && filesToRead.indexOf(parsedFrame.filename) === -1) {
                filesToRead.push(parsedFrame.filename);
            }
        }
        return parsedFrame;
    });
    // We do an early return if we do not want to fetch context liens
    if (linesOfContext <= 0) {
        return syncpromise_SyncPromise.resolve(frames);
    }
    try {
        return addPrePostContext(filesToRead, frames, linesOfContext);
    }
    catch (_) {
        // This happens in electron for example where we are not able to read files from asar.
        // So it's fine, we recover be just returning all frames without pre/post context.
        return syncpromise_SyncPromise.resolve(frames);
    }
}
/**
 * This function tries to read the source files + adding pre and post context (source code)
 * to a frame.
 * @param filesToRead string[] of filepaths
 * @param frames StackFrame[] containg all frames
 */
function addPrePostContext(filesToRead, frames, linesOfContext) {
    return new syncpromise_SyncPromise(function (resolve) {
        return readSourceFiles(filesToRead).then(function (sourceFiles) {
            var result = frames.map(function (frame) {
                if (frame.filename && sourceFiles[frame.filename]) {
                    try {
                        var lines = sourceFiles[frame.filename].split('\n');
                        Object(misc["a" /* addContextToFrame */])(lines, frame, linesOfContext);
                    }
                    catch (e) {
                        // anomaly, being defensive in case
                        // unlikely to ever happen in practice but can definitely happen in theory
                    }
                }
                return frame;
            });
            resolve(result);
        });
    });
}
/**
 * @hidden
 */
function getExceptionFromError(error, options) {
    var name = error.name || error.constructor.name;
    var stack = extractStackFromError(error);
    return new syncpromise_SyncPromise(function (resolve) {
        return parseStack(stack, options).then(function (frames) {
            var result = {
                stacktrace: {
                    frames: prepareFramesForEvent(frames),
                },
                type: name,
                value: error.message,
            };
            resolve(result);
        });
    });
}
/**
 * @hidden
 */
function parseError(error, options) {
    return new syncpromise_SyncPromise(function (resolve) {
        return getExceptionFromError(error, options).then(function (exception) {
            resolve({
                exception: {
                    values: [exception],
                },
            });
        });
    });
}
/**
 * @hidden
 */
function prepareFramesForEvent(stack) {
    if (!stack || !stack.length) {
        return [];
    }
    var localStack = stack;
    var firstFrameFunction = localStack[0].function || '';
    if (firstFrameFunction.indexOf('captureMessage') !== -1 || firstFrameFunction.indexOf('captureException') !== -1) {
        localStack = localStack.slice(1);
    }
    // The frame where the crash happened, should be the last entry in the array
    return localStack.reverse();
}
//# sourceMappingURL=parsers.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/api.js

var SENTRY_API_VERSION = '7';
/** Helper class to provide urls to different Sentry endpoints. */
var api_API = /** @class */ (function () {
    /** Create a new instance of API */
    function API(dsn) {
        this.dsn = dsn;
        this._dsnObject = new dsn_Dsn(dsn);
    }
    /** Returns the Dsn object. */
    API.prototype.getDsn = function () {
        return this._dsnObject;
    };
    /** Returns the prefix to construct Sentry ingestion API endpoints. */
    API.prototype.getBaseApiEndpoint = function () {
        var dsn = this._dsnObject;
        var protocol = dsn.protocol ? dsn.protocol + ":" : '';
        var port = dsn.port ? ":" + dsn.port : '';
        return protocol + "//" + dsn.host + port + (dsn.path ? "/" + dsn.path : '') + "/api/";
    };
    /** Returns the store endpoint URL. */
    API.prototype.getStoreEndpoint = function () {
        return this._getIngestEndpoint('store');
    };
    /**
     * Returns the store endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getStoreEndpointWithUrlEncodedAuth = function () {
        return this.getStoreEndpoint() + "?" + this._encodedAuth();
    };
    /**
     * Returns the envelope endpoint URL with auth in the query string.
     *
     * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
     */
    API.prototype.getEnvelopeEndpointWithUrlEncodedAuth = function () {
        return this._getEnvelopeEndpoint() + "?" + this._encodedAuth();
    };
    /** Returns only the path component for the store endpoint. */
    API.prototype.getStoreEndpointPath = function () {
        var dsn = this._dsnObject;
        return (dsn.path ? "/" + dsn.path : '') + "/api/" + dsn.projectId + "/store/";
    };
    /**
     * Returns an object that can be used in request headers.
     * This is needed for node and the old /store endpoint in sentry
     */
    API.prototype.getRequestHeaders = function (clientName, clientVersion) {
        var dsn = this._dsnObject;
        var header = ["Sentry sentry_version=" + SENTRY_API_VERSION];
        header.push("sentry_client=" + clientName + "/" + clientVersion);
        header.push("sentry_key=" + dsn.user);
        if (dsn.pass) {
            header.push("sentry_secret=" + dsn.pass);
        }
        return {
            'Content-Type': 'application/json',
            'X-Sentry-Auth': header.join(', '),
        };
    };
    /** Returns the url to the report dialog endpoint. */
    API.prototype.getReportDialogEndpoint = function (dialogOptions) {
        if (dialogOptions === void 0) { dialogOptions = {}; }
        var dsn = this._dsnObject;
        var endpoint = this.getBaseApiEndpoint() + "embed/error-page/";
        var encodedOptions = [];
        encodedOptions.push("dsn=" + dsn.toString());
        for (var key in dialogOptions) {
            if (key === 'user') {
                if (!dialogOptions.user) {
                    continue;
                }
                if (dialogOptions.user.name) {
                    encodedOptions.push("name=" + encodeURIComponent(dialogOptions.user.name));
                }
                if (dialogOptions.user.email) {
                    encodedOptions.push("email=" + encodeURIComponent(dialogOptions.user.email));
                }
            }
            else {
                encodedOptions.push(encodeURIComponent(key) + "=" + encodeURIComponent(dialogOptions[key]));
            }
        }
        if (encodedOptions.length) {
            return endpoint + "?" + encodedOptions.join('&');
        }
        return endpoint;
    };
    /** Returns the envelope endpoint URL. */
    API.prototype._getEnvelopeEndpoint = function () {
        return this._getIngestEndpoint('envelope');
    };
    /** Returns the ingest API endpoint for target. */
    API.prototype._getIngestEndpoint = function (target) {
        var base = this.getBaseApiEndpoint();
        var dsn = this._dsnObject;
        return "" + base + dsn.projectId + "/" + target + "/";
    };
    /** Returns a URL-encoded string with auth config suitable for a query string. */
    API.prototype._encodedAuth = function () {
        var dsn = this._dsnObject;
        var auth = {
            // We send only the minimum set of required information. See
            // https://github.com/getsentry/sentry-javascript/issues/2572.
            sentry_key: dsn.user,
            sentry_version: SENTRY_API_VERSION,
        };
        return Object(object["f" /* urlEncode */])(auth);
    };
    return API;
}());

//# sourceMappingURL=api.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/request.js
/** Creates a SentryRequest from an event. */
function sessionToSentryRequest(session, api) {
    var envelopeHeaders = JSON.stringify({
        sent_at: new Date().toISOString(),
    });
    var itemHeaders = JSON.stringify({
        type: 'session',
    });
    return {
        body: envelopeHeaders + "\n" + itemHeaders + "\n" + JSON.stringify(session),
        type: 'session',
        url: api.getEnvelopeEndpointWithUrlEncodedAuth(),
    };
}
/** Creates a SentryRequest from an event. */
function eventToSentryRequest(event, api) {
    var useEnvelope = event.type === 'transaction';
    var req = {
        body: JSON.stringify(event),
        type: event.type || 'event',
        url: useEnvelope ? api.getEnvelopeEndpointWithUrlEncodedAuth() : api.getStoreEndpointWithUrlEncodedAuth(),
    };
    // https://develop.sentry.dev/sdk/envelopes/
    // Since we don't need to manipulate envelopes nor store them, there is no
    // exported concept of an Envelope with operations including serialization and
    // deserialization. Instead, we only implement a minimal subset of the spec to
    // serialize events inline here.
    if (useEnvelope) {
        var envelopeHeaders = JSON.stringify({
            event_id: event.event_id,
            // We need to add * 1000 since we divide it by 1000 by default but JS works with ms precision
            // The reason we use timestampWithMs here is that all clocks across the SDK use the same clock
            sent_at: new Date().toISOString(),
        });
        var itemHeaders = JSON.stringify({
            type: event.type,
        });
        // The trailing newline is optional. We intentionally don't send it to avoid
        // sending unnecessary bytes.
        //
        // const envelope = `${envelopeHeaders}\n${itemHeaders}\n${req.body}\n`;
        var envelope = envelopeHeaders + "\n" + itemHeaders + "\n" + req.body;
        req.body = envelope;
    }
    return req;
}
//# sourceMappingURL=request.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/promisebuffer.js


/** A simple queue that holds promises. */
var promisebuffer_PromiseBuffer = /** @class */ (function () {
    function PromiseBuffer(_limit) {
        this._limit = _limit;
        /** Internal set of queued Promises */
        this._buffer = [];
    }
    /**
     * Says if the buffer is ready to take more requests
     */
    PromiseBuffer.prototype.isReady = function () {
        return this._limit === undefined || this.length() < this._limit;
    };
    /**
     * Add a promise to the queue.
     *
     * @param task Can be any PromiseLike<T>
     * @returns The original promise.
     */
    PromiseBuffer.prototype.add = function (task) {
        var _this = this;
        if (!this.isReady()) {
            return syncpromise_SyncPromise.reject(new error_SentryError('Not adding Promise due to buffer limit reached.'));
        }
        if (this._buffer.indexOf(task) === -1) {
            this._buffer.push(task);
        }
        task
            .then(function () { return _this.remove(task); })
            .then(null, function () {
            return _this.remove(task).then(null, function () {
                // We have to add this catch here otherwise we have an unhandledPromiseRejection
                // because it's a new Promise chain.
            });
        });
        return task;
    };
    /**
     * Remove a promise to the queue.
     *
     * @param task Can be any PromiseLike<T>
     * @returns Removed promise.
     */
    PromiseBuffer.prototype.remove = function (task) {
        var removedTask = this._buffer.splice(this._buffer.indexOf(task), 1)[0];
        return removedTask;
    };
    /**
     * This function returns the number of unresolved promises in the queue.
     */
    PromiseBuffer.prototype.length = function () {
        return this._buffer.length;
    };
    /**
     * This will drain the whole queue, returns true if queue is empty or drained.
     * If timeout is provided and the queue takes longer to drain, the promise still resolves but with false.
     *
     * @param timeout Number in ms to wait until it resolves with false.
     */
    PromiseBuffer.prototype.drain = function (timeout) {
        var _this = this;
        return new syncpromise_SyncPromise(function (resolve) {
            var capturedSetTimeout = setTimeout(function () {
                if (timeout && timeout > 0) {
                    resolve(false);
                }
            }, timeout);
            syncpromise_SyncPromise.all(_this._buffer)
                .then(function () {
                clearTimeout(capturedSetTimeout);
                resolve(true);
            })
                .then(null, function () {
                resolve(true);
            });
        });
    };
    return PromiseBuffer;
}());

//# sourceMappingURL=promisebuffer.js.map
// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(16);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/version.js
var SDK_NAME = 'sentry.javascript.node';
var SDK_VERSION = '5.27.6';
//# sourceMappingURL=version.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/base.js







/** Base Transport class implementation */
var base_BaseTransport = /** @class */ (function () {
    /** Create instance and set this.dsn */
    function BaseTransport(options) {
        this.options = options;
        /** A simple buffer holding all requests. */
        this._buffer = new promisebuffer_PromiseBuffer(30);
        /** Locks transport after receiving 429 response */
        this._disabledUntil = new Date(Date.now());
        this._api = new api_API(options.dsn);
    }
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.sendEvent = function (_) {
        throw new error_SentryError('Transport Class has to implement `sendEvent` method.');
    };
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.close = function (timeout) {
        return this._buffer.drain(timeout);
    };
    /** Returns a build request option object used by request */
    BaseTransport.prototype._getRequestOptions = function (uri) {
        var headers = __assign(__assign({}, this._api.getRequestHeaders(SDK_NAME, SDK_VERSION)), this.options.headers);
        var hostname = uri.hostname, pathname = uri.pathname, port = uri.port, protocol = uri.protocol;
        // See https://github.com/nodejs/node/blob/38146e717fed2fabe3aacb6540d839475e0ce1c6/lib/internal/url.js#L1268-L1290
        // We ignore the query string on purpose
        var path = "" + pathname;
        return __assign({ agent: this.client, headers: headers,
            hostname: hostname, method: 'POST', path: path,
            port: port,
            protocol: protocol }, (this.options.caCerts && {
            ca: external_fs_["readFileSync"](this.options.caCerts),
        }));
    };
    /** JSDoc */
    BaseTransport.prototype._sendWithModule = function (httpModule, event) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (new Date(Date.now()) < this._disabledUntil) {
                    return [2 /*return*/, Promise.reject(new error_SentryError("Transport locked till " + this._disabledUntil + " due to too many requests."))];
                }
                if (!this._buffer.isReady()) {
                    return [2 /*return*/, Promise.reject(new error_SentryError('Not adding Promise due to buffer limit reached.'))];
                }
                return [2 /*return*/, this._buffer.add(new Promise(function (resolve, reject) {
                        var sentryReq = eventToSentryRequest(event, _this._api);
                        var options = _this._getRequestOptions(new external_url_["URL"](sentryReq.url));
                        var req = httpModule.request(options, function (res) {
                            var statusCode = res.statusCode || 500;
                            var status = Status.fromHttpCode(statusCode);
                            res.setEncoding('utf8');
                            if (status === Status.Success) {
                                resolve({ status: status });
                            }
                            else {
                                if (status === Status.RateLimit) {
                                    var now = Date.now();
                                    /**
                                     * "Key-value pairs of header names and values. Header names are lower-cased."
                                     * https://nodejs.org/api/http.html#http_message_headers
                                     */
                                    var retryAfterHeader = res.headers ? res.headers['retry-after'] : '';
                                    retryAfterHeader = (Array.isArray(retryAfterHeader) ? retryAfterHeader[0] : retryAfterHeader);
                                    _this._disabledUntil = new Date(now + Object(misc["g" /* parseRetryAfterHeader */])(now, retryAfterHeader));
                                    logger.warn("Too many requests, backing off till: " + _this._disabledUntil);
                                }
                                var rejectionMessage = "HTTP Error (" + statusCode + ")";
                                if (res.headers && res.headers['x-sentry-error']) {
                                    rejectionMessage += ": " + res.headers['x-sentry-error'];
                                }
                                reject(new error_SentryError(rejectionMessage));
                            }
                            // Force the socket to drain
                            res.on('data', function () {
                                // Drain
                            });
                            res.on('end', function () {
                                // Drain
                            });
                        });
                        req.on('error', reject);
                        req.end(sentryReq.body);
                    }))];
            });
        });
    };
    return BaseTransport;
}());

//# sourceMappingURL=base.js.map
// EXTERNAL MODULE: external "http"
var external_http_ = __webpack_require__(30);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/http.js




/** Node http module transport */
var http_HTTPTransport = /** @class */ (function (_super) {
    __extends(HTTPTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        var proxy = options.httpProxy || process.env.http_proxy;
        _this.module = external_http_;
        _this.client = proxy
            ? new (__webpack_require__(89))(proxy)
            : new external_http_["Agent"]({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendEvent = function (event) {
        if (!this.module) {
            throw new error_SentryError('No module available in HTTPTransport');
        }
        return this._sendWithModule(this.module, event);
    };
    return HTTPTransport;
}(base_BaseTransport));

//# sourceMappingURL=http.js.map
// EXTERNAL MODULE: external "https"
var external_https_ = __webpack_require__(41);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/https.js




/** Node https module transport */
var https_HTTPSTransport = /** @class */ (function (_super) {
    __extends(HTTPSTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPSTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        var proxy = options.httpsProxy || options.httpProxy || process.env.https_proxy || process.env.http_proxy;
        _this.module = external_https_;
        _this.client = proxy
            ? new (__webpack_require__(89))(proxy)
            : new external_https_["Agent"]({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendEvent = function (event) {
        if (!this.module) {
            throw new error_SentryError('No module available in HTTPSTransport');
        }
        return this._sendWithModule(this.module, event);
    };
    return HTTPSTransport;
}(base_BaseTransport));

//# sourceMappingURL=https.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/index.js



//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/backend.js






/**
 * The Sentry Node SDK Backend.
 * @hidden
 */
var backend_NodeBackend = /** @class */ (function (_super) {
    __extends(NodeBackend, _super);
    function NodeBackend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    NodeBackend.prototype.eventFromException = function (exception, hint) {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var ex = exception;
        var mechanism = {
            handled: true,
            type: 'generic',
        };
        if (!Object(is["b" /* isError */])(exception)) {
            if (Object(is["e" /* isPlainObject */])(exception)) {
                // This will allow us to group events based on top-level keys
                // which is much better than creating new group when any key/value change
                var message = "Non-Error exception captured with keys: " + Object(object["b" /* extractExceptionKeysForMessage */])(exception);
                hub_getCurrentHub().configureScope(function (scope) {
                    scope.setExtra('__serialized__', Object(object["e" /* normalizeToSize */])(exception));
                });
                ex = (hint && hint.syntheticException) || new Error(message);
                ex.message = message;
            }
            else {
                // This handles when someone does: `throw "something awesome";`
                // We use synthesized Error here so we can extract a (rough) stack trace.
                ex = (hint && hint.syntheticException) || new Error(exception);
                ex.message = exception;
            }
            mechanism.synthetic = true;
        }
        return new syncpromise_SyncPromise(function (resolve, reject) {
            return parseError(ex, _this._options)
                .then(function (event) {
                Object(misc["c" /* addExceptionTypeValue */])(event, undefined, undefined);
                Object(misc["b" /* addExceptionMechanism */])(event, mechanism);
                resolve(__assign(__assign({}, event), { event_id: hint && hint.event_id }));
            })
                .then(null, reject);
        });
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype.eventFromMessage = function (message, level, hint) {
        var _this = this;
        if (level === void 0) { level = Severity.Info; }
        var event = {
            event_id: hint && hint.event_id,
            level: level,
            message: message,
        };
        return new syncpromise_SyncPromise(function (resolve) {
            if (_this._options.attachStacktrace && hint && hint.syntheticException) {
                var stack = hint.syntheticException ? extractStackFromError(hint.syntheticException) : [];
                parseStack(stack, _this._options)
                    .then(function (frames) {
                    event.stacktrace = {
                        frames: prepareFramesForEvent(frames),
                    };
                    resolve(event);
                })
                    .then(null, function () {
                    resolve(event);
                });
            }
            else {
                resolve(event);
            }
        });
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype._setupTransport = function () {
        if (!this._options.dsn) {
            // We return the noop transport here in case there is no Dsn.
            return _super.prototype._setupTransport.call(this);
        }
        var dsn = new dsn_Dsn(this._options.dsn);
        var transportOptions = __assign(__assign(__assign(__assign(__assign({}, this._options.transportOptions), (this._options.httpProxy && { httpProxy: this._options.httpProxy })), (this._options.httpsProxy && { httpsProxy: this._options.httpsProxy })), (this._options.caCerts && { caCerts: this._options.caCerts })), { dsn: this._options.dsn });
        if (this._options.transport) {
            return new this._options.transport(transportOptions);
        }
        if (dsn.protocol === 'http') {
            return new http_HTTPTransport(transportOptions);
        }
        return new https_HTTPSTransport(transportOptions);
    };
    return NodeBackend;
}(basebackend_BaseBackend));

//# sourceMappingURL=backend.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
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
/* global Reflect, Promise */

var node_modules_tslib_tslib_es6_extendStatics = function(d, b) {
    node_modules_tslib_tslib_es6_extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return node_modules_tslib_tslib_es6_extendStatics(d, b);
};

function node_modules_tslib_tslib_es6_extends(d, b) {
    node_modules_tslib_tslib_es6_extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var node_modules_tslib_tslib_es6_assign = function() {
    node_modules_tslib_tslib_es6_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return node_modules_tslib_tslib_es6_assign.apply(this, arguments);
}

function node_modules_tslib_tslib_es6_rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function node_modules_tslib_tslib_es6_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function node_modules_tslib_tslib_es6_param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function node_modules_tslib_tslib_es6_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function node_modules_tslib_tslib_es6_awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function node_modules_tslib_tslib_es6_generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function node_modules_tslib_tslib_es6_createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function node_modules_tslib_tslib_es6_exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function node_modules_tslib_tslib_es6_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function node_modules_tslib_tslib_es6_read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function node_modules_tslib_tslib_es6_spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(node_modules_tslib_tslib_es6_read(arguments[i]));
    return ar;
}

function node_modules_tslib_tslib_es6_spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function node_modules_tslib_tslib_es6_await(v) {
    return this instanceof node_modules_tslib_tslib_es6_await ? (this.v = v, this) : new node_modules_tslib_tslib_es6_await(v);
}

function node_modules_tslib_tslib_es6_asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof node_modules_tslib_tslib_es6_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function node_modules_tslib_tslib_es6_asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: node_modules_tslib_tslib_es6_await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function node_modules_tslib_tslib_es6_asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof node_modules_tslib_tslib_es6_values === "function" ? node_modules_tslib_tslib_es6_values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function node_modules_tslib_tslib_es6_makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function node_modules_tslib_tslib_es6_importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function node_modules_tslib_tslib_es6_importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function node_modules_tslib_tslib_es6_classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function node_modules_tslib_tslib_es6_classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/string.js
var string = __webpack_require__(17);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integration.js



var installedIntegrations = [];
/** Gets integration to install */
function getIntegrationsToSetup(options) {
    var defaultIntegrations = (options.defaultIntegrations && node_modules_tslib_tslib_es6_spread(options.defaultIntegrations)) || [];
    var userIntegrations = options.integrations;
    var integrations = [];
    if (Array.isArray(userIntegrations)) {
        var userIntegrationsNames_1 = userIntegrations.map(function (i) { return i.name; });
        var pickedIntegrationsNames_1 = [];
        // Leave only unique default integrations, that were not overridden with provided user integrations
        defaultIntegrations.forEach(function (defaultIntegration) {
            if (userIntegrationsNames_1.indexOf(defaultIntegration.name) === -1 &&
                pickedIntegrationsNames_1.indexOf(defaultIntegration.name) === -1) {
                integrations.push(defaultIntegration);
                pickedIntegrationsNames_1.push(defaultIntegration.name);
            }
        });
        // Don't add same user integration twice
        userIntegrations.forEach(function (userIntegration) {
            if (pickedIntegrationsNames_1.indexOf(userIntegration.name) === -1) {
                integrations.push(userIntegration);
                pickedIntegrationsNames_1.push(userIntegration.name);
            }
        });
    }
    else if (typeof userIntegrations === 'function') {
        integrations = userIntegrations(defaultIntegrations);
        integrations = Array.isArray(integrations) ? integrations : [integrations];
    }
    else {
        integrations = node_modules_tslib_tslib_es6_spread(defaultIntegrations);
    }
    // Make sure that if present, `Debug` integration will always run last
    var integrationsNames = integrations.map(function (i) { return i.name; });
    var alwaysLastToRun = 'Debug';
    if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
        integrations.push.apply(integrations, node_modules_tslib_tslib_es6_spread(integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1)));
    }
    return integrations;
}
/** Setup given integration */
function setupIntegration(integration) {
    if (installedIntegrations.indexOf(integration.name) !== -1) {
        return;
    }
    integration.setupOnce(scope_addGlobalEventProcessor, hub_getCurrentHub);
    installedIntegrations.push(integration.name);
    logger.log("Integration installed: " + integration.name);
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */
function setupIntegrations(options) {
    var integrations = {};
    getIntegrationsToSetup(options).forEach(function (integration) {
        integrations[integration.name] = integration;
        setupIntegration(integration);
    });
    return integrations;
}
//# sourceMappingURL=integration.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/baseclient.js

/* eslint-disable max-lines */




/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding backend constructor and options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}. Also, the Backend instance is available via
 * {@link Client.getBackend}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event via the backend, it is passed through
 * {@link BaseClient.prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends BaseClient<NodeBackend, NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(NodeBackend, options);
 *   }
 *
 *   // ...
 * }
 */
var baseclient_BaseClient = /** @class */ (function () {
    /**
     * Initializes this client instance.
     *
     * @param backendClass A constructor function to create the backend.
     * @param options Options for the client.
     */
    function BaseClient(backendClass, options) {
        /** Array of used integrations. */
        this._integrations = {};
        /** Number of call being processed */
        this._processing = 0;
        this._backend = new backendClass(options);
        this._options = options;
        if (options.dsn) {
            this._dsn = new dsn_Dsn(options.dsn);
        }
    }
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    BaseClient.prototype.captureException = function (exception, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        this._process(this._getBackend()
            .eventFromException(exception, hint)
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureMessage = function (message, level, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        var promisedEvent = Object(is["f" /* isPrimitive */])(message)
            ? this._getBackend().eventFromMessage("" + message, level, hint)
            : this._getBackend().eventFromException(message, hint);
        this._process(promisedEvent
            .then(function (event) { return _this._captureEvent(event, hint, scope); })
            .then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureEvent = function (event, hint, scope) {
        var eventId = hint && hint.event_id;
        this._process(this._captureEvent(event, hint, scope).then(function (result) {
            eventId = result;
        }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureSession = function (session) {
        if (!session.release) {
            logger.warn('Discarded session because of missing release');
        }
        else {
            this._sendSession(session);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getDsn = function () {
        return this._dsn;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getOptions = function () {
        return this._options;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.flush = function (timeout) {
        var _this = this;
        return this._isClientProcessing(timeout).then(function (ready) {
            return _this._getBackend()
                .getTransport()
                .close(timeout)
                .then(function (transportFlushed) { return ready && transportFlushed; });
        });
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.close = function (timeout) {
        var _this = this;
        return this.flush(timeout).then(function (result) {
            _this.getOptions().enabled = false;
            return result;
        });
    };
    /**
     * Sets up the integrations
     */
    BaseClient.prototype.setupIntegrations = function () {
        if (this._isEnabled()) {
            this._integrations = setupIntegrations(this._options);
        }
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getIntegration = function (integration) {
        try {
            return this._integrations[integration.id] || null;
        }
        catch (_oO) {
            logger.warn("Cannot retrieve integration " + integration.id + " from the current Client");
            return null;
        }
    };
    /** Updates existing session based on the provided event */
    BaseClient.prototype._updateSessionFromEvent = function (session, event) {
        var e_1, _a;
        var crashed = false;
        var errored = false;
        var userAgent;
        var exceptions = event.exception && event.exception.values;
        if (exceptions) {
            errored = true;
            try {
                for (var exceptions_1 = node_modules_tslib_tslib_es6_values(exceptions), exceptions_1_1 = exceptions_1.next(); !exceptions_1_1.done; exceptions_1_1 = exceptions_1.next()) {
                    var ex = exceptions_1_1.value;
                    var mechanism = ex.mechanism;
                    if (mechanism && mechanism.handled === false) {
                        crashed = true;
                        break;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (exceptions_1_1 && !exceptions_1_1.done && (_a = exceptions_1.return)) _a.call(exceptions_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        var user = event.user;
        if (!session.userAgent) {
            var headers = event.request ? event.request.headers : {};
            for (var key in headers) {
                if (key.toLowerCase() === 'user-agent') {
                    userAgent = headers[key];
                    break;
                }
            }
        }
        session.update(node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign({}, (crashed && { status: SessionStatus.Crashed })), { user: user,
            userAgent: userAgent, errors: session.errors + Number(errored || crashed) }));
    };
    /** Deliver captured session to Sentry */
    BaseClient.prototype._sendSession = function (session) {
        this._getBackend().sendSession(session);
    };
    /** Waits for the client to be done with processing. */
    BaseClient.prototype._isClientProcessing = function (timeout) {
        var _this = this;
        return new syncpromise_SyncPromise(function (resolve) {
            var ticked = 0;
            var tick = 1;
            var interval = setInterval(function () {
                if (_this._processing == 0) {
                    clearInterval(interval);
                    resolve(true);
                }
                else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, tick);
        });
    };
    /** Returns the current backend. */
    BaseClient.prototype._getBackend = function () {
        return this._backend;
    };
    /** Determines whether this SDK is enabled and a valid Dsn is present. */
    BaseClient.prototype._isEnabled = function () {
        return this.getOptions().enabled !== false && this._dsn !== undefined;
    };
    /**
     * Adds common information to events.
     *
     * The information includes release and environment from `options`,
     * breadcrumbs and context (extra, tags and user) from the scope.
     *
     * Information that is already present in the event is never overwritten. For
     * nested objects, such as the context, keys are merged.
     *
     * @param event The original event.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    BaseClient.prototype._prepareEvent = function (event, scope, hint) {
        var _this = this;
        var _a = this.getOptions().normalizeDepth, normalizeDepth = _a === void 0 ? 3 : _a;
        var prepared = node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign({}, event), { event_id: event.event_id || (hint && hint.event_id ? hint.event_id : Object(misc["j" /* uuid4 */])()), timestamp: event.timestamp || Object(time["a" /* dateTimestampInSeconds */])() });
        this._applyClientOptions(prepared);
        this._applyIntegrationsMetadata(prepared);
        // If we have scope given to us, use it as the base for further modifications.
        // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
        var finalScope = scope;
        if (hint && hint.captureContext) {
            finalScope = scope_Scope.clone(finalScope).update(hint.captureContext);
        }
        // We prepare the result here with a resolved Event.
        var result = syncpromise_SyncPromise.resolve(prepared);
        // This should be the last thing called, since we want that
        // {@link Hub.addEventProcessor} gets the finished prepared event.
        if (finalScope) {
            // In case we have a hub we reassign it.
            result = finalScope.applyToEvent(prepared, hint);
        }
        return result.then(function (evt) {
            if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
                return _this._normalizeEvent(evt, normalizeDepth);
            }
            return evt;
        });
    };
    /**
     * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
     * Normalized keys:
     * - `breadcrumbs.data`
     * - `user`
     * - `contexts`
     * - `extra`
     * @param event Event
     * @returns Normalized event
     */
    BaseClient.prototype._normalizeEvent = function (event, depth) {
        if (!event) {
            return null;
        }
        var normalized = node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign({}, event), (event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map(function (b) { return (node_modules_tslib_tslib_es6_assign(node_modules_tslib_tslib_es6_assign({}, b), (b.data && {
                data: Object(object["d" /* normalize */])(b.data, depth),
            }))); }),
        })), (event.user && {
            user: Object(object["d" /* normalize */])(event.user, depth),
        })), (event.contexts && {
            contexts: Object(object["d" /* normalize */])(event.contexts, depth),
        })), (event.extra && {
            extra: Object(object["d" /* normalize */])(event.extra, depth),
        }));
        // event.contexts.trace stores information about a Transaction. Similarly,
        // event.spans[] stores information about child Spans. Given that a
        // Transaction is conceptually a Span, normalization should apply to both
        // Transactions and Spans consistently.
        // For now the decision is to skip normalization of Transactions and Spans,
        // so this block overwrites the normalized event to add back the original
        // Transaction information prior to normalization.
        if (event.contexts && event.contexts.trace) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            normalized.contexts.trace = event.contexts.trace;
        }
        return normalized;
    };
    /**
     *  Enhances event using the client configuration.
     *  It takes care of all "static" values like environment, release and `dist`,
     *  as well as truncating overly long values.
     * @param event event instance to be enhanced
     */
    BaseClient.prototype._applyClientOptions = function (event) {
        var options = this.getOptions();
        var environment = options.environment, release = options.release, dist = options.dist, _a = options.maxValueLength, maxValueLength = _a === void 0 ? 250 : _a;
        if (!('environment' in event)) {
            event.environment = 'environment' in options ? environment : 'production';
        }
        if (event.release === undefined && release !== undefined) {
            event.release = release;
        }
        if (event.dist === undefined && dist !== undefined) {
            event.dist = dist;
        }
        if (event.message) {
            event.message = Object(string["c" /* truncate */])(event.message, maxValueLength);
        }
        var exception = event.exception && event.exception.values && event.exception.values[0];
        if (exception && exception.value) {
            exception.value = Object(string["c" /* truncate */])(exception.value, maxValueLength);
        }
        var request = event.request;
        if (request && request.url) {
            request.url = Object(string["c" /* truncate */])(request.url, maxValueLength);
        }
    };
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    BaseClient.prototype._applyIntegrationsMetadata = function (event) {
        var sdkInfo = event.sdk;
        var integrationsArray = Object.keys(this._integrations);
        if (sdkInfo && integrationsArray.length > 0) {
            sdkInfo.integrations = integrationsArray;
        }
    };
    /**
     * Tells the backend to send this event
     * @param event The Sentry event to send
     */
    BaseClient.prototype._sendEvent = function (event) {
        this._getBackend().sendEvent(event);
    };
    /**
     * Processes the event and logs an error in case of rejection
     * @param event
     * @param hint
     * @param scope
     */
    BaseClient.prototype._captureEvent = function (event, hint, scope) {
        return this._processEvent(event, hint, scope).then(function (finalEvent) {
            return finalEvent.event_id;
        }, function (reason) {
            logger.error(reason);
            return undefined;
        });
    };
    /**
     * Processes an event (either error or message) and sends it to Sentry.
     *
     * This also adds breadcrumbs and context information to the event. However,
     * platform specific meta data (such as the User's IP address) must be added
     * by the SDK implementor.
     *
     *
     * @param event The event to send to Sentry.
     * @param hint May contain additional information about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    BaseClient.prototype._processEvent = function (event, hint, scope) {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _a = this.getOptions(), beforeSend = _a.beforeSend, sampleRate = _a.sampleRate;
        if (!this._isEnabled()) {
            return syncpromise_SyncPromise.reject(new error_SentryError('SDK not enabled, will not send event.'));
        }
        var isTransaction = event.type === 'transaction';
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
            return syncpromise_SyncPromise.reject(new error_SentryError('This event has been sampled, will not send event.'));
        }
        return this._prepareEvent(event, scope, hint)
            .then(function (prepared) {
            if (prepared === null) {
                throw new error_SentryError('An event processor returned null, will not send event.');
            }
            var isInternalException = hint && hint.data && hint.data.__sentry__ === true;
            if (isInternalException || isTransaction || !beforeSend) {
                return prepared;
            }
            var beforeSendResult = beforeSend(prepared, hint);
            if (typeof beforeSendResult === 'undefined') {
                throw new error_SentryError('`beforeSend` method has to return `null` or a valid event.');
            }
            else if (Object(is["j" /* isThenable */])(beforeSendResult)) {
                return beforeSendResult.then(function (event) { return event; }, function (e) {
                    throw new error_SentryError("beforeSend rejected with " + e);
                });
            }
            return beforeSendResult;
        })
            .then(function (processedEvent) {
            if (processedEvent === null) {
                throw new error_SentryError('`beforeSend` returned `null`, will not send event.');
            }
            var session = scope && scope.getSession && scope.getSession();
            if (!isTransaction && session) {
                _this._updateSessionFromEvent(session, processedEvent);
            }
            _this._sendEvent(processedEvent);
            return processedEvent;
        })
            .then(null, function (reason) {
            if (reason instanceof error_SentryError) {
                throw reason;
            }
            _this.captureException(reason, {
                data: {
                    __sentry__: true,
                },
                originalException: reason,
            });
            throw new error_SentryError("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " + reason);
        });
    };
    /**
     * Occupies the client with processing and event
     */
    BaseClient.prototype._process = function (promise) {
        var _this = this;
        this._processing += 1;
        promise.then(function (value) {
            _this._processing -= 1;
            return value;
        }, function (reason) {
            _this._processing -= 1;
            return reason;
        });
    };
    return BaseClient;
}());

//# sourceMappingURL=baseclient.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/client.js




/**
 * The Sentry Node SDK Client.
 *
 * @see NodeOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
var client_NodeClient = /** @class */ (function (_super) {
    __extends(NodeClient, _super);
    /**
     * Creates a new Node SDK instance.
     * @param options Configuration options for this SDK.
     */
    function NodeClient(options) {
        return _super.call(this, backend_NodeBackend, options) || this;
    }
    /**
     * @inheritDoc
     */
    NodeClient.prototype._prepareEvent = function (event, scope, hint) {
        event.platform = event.platform || 'node';
        event.sdk = __assign(__assign({}, event.sdk), { name: SDK_NAME, packages: __spread(((event.sdk && event.sdk.packages) || []), [
                {
                    name: 'npm:@sentry/node',
                    version: SDK_VERSION,
                },
            ]), version: SDK_VERSION });
        if (this.getOptions().serverName) {
            event.server_name = this.getOptions().serverName;
        }
        return _super.prototype._prepareEvent.call(this, event, scope, hint);
    };
    return NodeClient;
}(baseclient_BaseClient));

//# sourceMappingURL=client.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/functiontostring.js
var originalFunctionToString;
/** Patch toString calls to return proper name for wrapped functions */
var FunctionToString = /** @class */ (function () {
    function FunctionToString() {
        /**
         * @inheritDoc
         */
        this.name = FunctionToString.id;
    }
    /**
     * @inheritDoc
     */
    FunctionToString.prototype.setupOnce = function () {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        originalFunctionToString = Function.prototype.toString;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Function.prototype.toString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = this.__sentry_original__ || this;
            return originalFunctionToString.apply(context, args);
        };
    };
    /**
     * @inheritDoc
     */
    FunctionToString.id = 'FunctionToString';
    return FunctionToString;
}());

//# sourceMappingURL=functiontostring.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/inboundfilters.js



// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Inbound filters configurable by the user */
var inboundfilters_InboundFilters = /** @class */ (function () {
    function InboundFilters(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = InboundFilters.id;
    }
    /**
     * @inheritDoc
     */
    InboundFilters.prototype.setupOnce = function () {
        scope_addGlobalEventProcessor(function (event) {
            var hub = hub_getCurrentHub();
            if (!hub) {
                return event;
            }
            var self = hub.getIntegration(InboundFilters);
            if (self) {
                var client = hub.getClient();
                var clientOptions = client ? client.getOptions() : {};
                var options = self._mergeOptions(clientOptions);
                if (self._shouldDropEvent(event, options)) {
                    return null;
                }
            }
            return event;
        });
    };
    /** JSDoc */
    InboundFilters.prototype._shouldDropEvent = function (event, options) {
        if (this._isSentryError(event, options)) {
            logger.warn("Event dropped due to being internal Sentry Error.\nEvent: " + Object(misc["e" /* getEventDescription */])(event));
            return true;
        }
        if (this._isIgnoredError(event, options)) {
            logger.warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + Object(misc["e" /* getEventDescription */])(event));
            return true;
        }
        if (this._isDeniedUrl(event, options)) {
            logger.warn("Event dropped due to being matched by `denyUrls` option.\nEvent: " + Object(misc["e" /* getEventDescription */])(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        if (!this._isAllowedUrl(event, options)) {
            logger.warn("Event dropped due to not being matched by `allowUrls` option.\nEvent: " + Object(misc["e" /* getEventDescription */])(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        return false;
    };
    /** JSDoc */
    InboundFilters.prototype._isSentryError = function (event, options) {
        if (!options.ignoreInternal) {
            return false;
        }
        try {
            return ((event &&
                event.exception &&
                event.exception.values &&
                event.exception.values[0] &&
                event.exception.values[0].type === 'SentryError') ||
                false);
        }
        catch (_oO) {
            return false;
        }
    };
    /** JSDoc */
    InboundFilters.prototype._isIgnoredError = function (event, options) {
        if (!options.ignoreErrors || !options.ignoreErrors.length) {
            return false;
        }
        return this._getPossibleEventMessages(event).some(function (message) {
            // Not sure why TypeScript complains here...
            return options.ignoreErrors.some(function (pattern) { return Object(string["a" /* isMatchingPattern */])(message, pattern); });
        });
    };
    /** JSDoc */
    InboundFilters.prototype._isDeniedUrl = function (event, options) {
        // TODO: Use Glob instead?
        if (!options.denyUrls || !options.denyUrls.length) {
            return false;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? false : options.denyUrls.some(function (pattern) { return Object(string["a" /* isMatchingPattern */])(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._isAllowedUrl = function (event, options) {
        // TODO: Use Glob instead?
        if (!options.allowUrls || !options.allowUrls.length) {
            return true;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? true : options.allowUrls.some(function (pattern) { return Object(string["a" /* isMatchingPattern */])(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._mergeOptions = function (clientOptions) {
        if (clientOptions === void 0) { clientOptions = {}; }
        return {
            allowUrls: node_modules_tslib_tslib_es6_spread((this._options.whitelistUrls || []), (this._options.allowUrls || []), (clientOptions.whitelistUrls || []), (clientOptions.allowUrls || [])),
            denyUrls: node_modules_tslib_tslib_es6_spread((this._options.blacklistUrls || []), (this._options.denyUrls || []), (clientOptions.blacklistUrls || []), (clientOptions.denyUrls || [])),
            ignoreErrors: node_modules_tslib_tslib_es6_spread((this._options.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
            ignoreInternal: typeof this._options.ignoreInternal !== 'undefined' ? this._options.ignoreInternal : true,
        };
    };
    /** JSDoc */
    InboundFilters.prototype._getPossibleEventMessages = function (event) {
        if (event.message) {
            return [event.message];
        }
        if (event.exception) {
            try {
                var _a = (event.exception.values && event.exception.values[0]) || {}, _b = _a.type, type = _b === void 0 ? '' : _b, _c = _a.value, value = _c === void 0 ? '' : _c;
                return ["" + value, type + ": " + value];
            }
            catch (oO) {
                logger.error("Cannot extract message for event " + Object(misc["e" /* getEventDescription */])(event));
                return [];
            }
        }
        return [];
    };
    /** JSDoc */
    InboundFilters.prototype._getEventFilterUrl = function (event) {
        try {
            if (event.stacktrace) {
                var frames_1 = event.stacktrace.frames;
                return (frames_1 && frames_1[frames_1.length - 1].filename) || null;
            }
            if (event.exception) {
                var frames_2 = event.exception.values && event.exception.values[0].stacktrace && event.exception.values[0].stacktrace.frames;
                return (frames_2 && frames_2[frames_2.length - 1].filename) || null;
            }
            return null;
        }
        catch (oO) {
            logger.error("Cannot extract url for event " + Object(misc["e" /* getEventDescription */])(event));
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    InboundFilters.id = 'InboundFilters';
    return InboundFilters;
}());

//# sourceMappingURL=inboundfilters.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/index.js


//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/index.js










//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/sdk.js


/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */
function initAndBind(clientClass, options) {
    if (options.debug === true) {
        logger.enable();
    }
    var hub = hub_getCurrentHub();
    var client = new clientClass(options);
    hub.bindClient(client);
}
//# sourceMappingURL=sdk.js.map
// EXTERNAL MODULE: external "domain"
var external_domain_ = __webpack_require__(24);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(6);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/console.js





/** Console module integration */
var console_Console = /** @class */ (function () {
    function Console() {
        /**
         * @inheritDoc
         */
        this.name = Console.id;
    }
    /**
     * @inheritDoc
     */
    Console.prototype.setupOnce = function () {
        var e_1, _a;
        var consoleModule = __webpack_require__(153);
        try {
            for (var _b = __values(['debug', 'info', 'warn', 'error', 'log']), _c = _b.next(); !_c.done; _c = _b.next()) {
                var level = _c.value;
                Object(object["c" /* fill */])(consoleModule, level, createConsoleWrapper(level));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * @inheritDoc
     */
    Console.id = 'Console';
    return Console;
}());

/**
 * Wrapper function that'll be used for every console level
 */
function createConsoleWrapper(level) {
    return function consoleWrapper(originalConsoleMethod) {
        var sentryLevel;
        switch (level) {
            case 'debug':
                sentryLevel = Severity.Debug;
                break;
            case 'error':
                sentryLevel = Severity.Error;
                break;
            case 'info':
                sentryLevel = Severity.Info;
                break;
            case 'warn':
                sentryLevel = Severity.Warning;
                break;
            default:
                sentryLevel = Severity.Log;
        }
        return function () {
            if (hub_getCurrentHub().getIntegration(console_Console)) {
                hub_getCurrentHub().addBreadcrumb({
                    category: 'console',
                    level: sentryLevel,
                    message: external_util_["format"].apply(undefined, arguments),
                }, {
                    input: __spread(arguments),
                    level: level,
                });
            }
            originalConsoleMethod.apply(this, arguments);
        };
    };
}
//# sourceMappingURL=console.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/http.js


var NODE_VERSION = Object(misc["h" /* parseSemver */])(process.versions.node);
/** http module integration */
var http_Http = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function Http(options) {
        if (options === void 0) { options = {}; }
        /**
         * @inheritDoc
         */
        this.name = Http.id;
        this._breadcrumbs = typeof options.breadcrumbs === 'undefined' ? true : options.breadcrumbs;
        this._tracing = typeof options.tracing === 'undefined' ? false : options.tracing;
    }
    /**
     * @inheritDoc
     */
    Http.prototype.setupOnce = function () {
        // No need to instrument if we don't want to track anything
        if (!this._breadcrumbs && !this._tracing) {
            return;
        }
        var wrappedHandlerMaker = _createWrappedHandlerMaker(this._breadcrumbs, this._tracing);
        var httpModule = __webpack_require__(30);
        Object(object["c" /* fill */])(httpModule, 'get', wrappedHandlerMaker);
        Object(object["c" /* fill */])(httpModule, 'request', wrappedHandlerMaker);
        // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
        // If we do, we'd get double breadcrumbs and double spans for `https` calls.
        // It has been changed in Node 9, so for all versions equal and above, we patch `https` separately.
        if (NODE_VERSION.major && NODE_VERSION.major > 8) {
            var httpsModule = __webpack_require__(41);
            Object(object["c" /* fill */])(httpsModule, 'get', wrappedHandlerMaker);
            Object(object["c" /* fill */])(httpsModule, 'request', wrappedHandlerMaker);
        }
    };
    /**
     * @inheritDoc
     */
    Http.id = 'Http';
    return Http;
}());

/**
 * Function which creates a function which creates wrapped versions of internal `request` and `get` calls within `http`
 * and `https` modules. (NB: Not a typo - this is a creator^2!)
 *
 * @param breadcrumbsEnabled Whether or not to record outgoing requests as breadcrumbs
 * @param tracingEnabled Whether or not to record outgoing requests as tracing spans
 *
 * @returns A function which accepts the exiting handler and returns a wrapped handler
 */
function _createWrappedHandlerMaker(breadcrumbsEnabled, tracingEnabled) {
    return function wrappedHandlerMaker(originalHandler) {
        return function wrappedHandler(options) {
            var requestUrl = extractUrl(options);
            // we don't want to record requests to Sentry as either breadcrumbs or spans, so just use the original handler
            if (isSentryRequest(requestUrl)) {
                return originalHandler.apply(this, arguments);
            }
            var span;
            var transaction;
            var scope = hub_getCurrentHub().getScope();
            if (scope && tracingEnabled) {
                transaction = scope.getTransaction();
                if (transaction) {
                    span = transaction.startChild({
                        description: (typeof options === 'string' || !options.method ? 'GET' : options.method) + " " + requestUrl,
                        op: 'request',
                    });
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return originalHandler
                .apply(this, arguments)
                .once('response', function (res) {
                if (breadcrumbsEnabled) {
                    addRequestBreadcrumb('response', requestUrl, this, res);
                }
                if (tracingEnabled && span) {
                    span.setHttpStatus(res.statusCode);
                    cleanDescription(options, this, span);
                    span.finish();
                }
            })
                .once('error', function () {
                if (breadcrumbsEnabled) {
                    addRequestBreadcrumb('error', requestUrl, this);
                }
                if (tracingEnabled && span) {
                    span.setHttpStatus(500);
                    cleanDescription(options, this, span);
                    span.finish();
                }
            });
        };
    };
}
/**
 * Captures Breadcrumb based on provided request/response pair
 */
function addRequestBreadcrumb(event, url, req, res) {
    if (!hub_getCurrentHub().getIntegration(http_Http)) {
        return;
    }
    hub_getCurrentHub().addBreadcrumb({
        category: 'http',
        data: {
            method: req.method,
            status_code: res && res.statusCode,
            url: url,
        },
        type: 'http',
    }, {
        event: event,
        request: req,
        response: res,
    });
}
/**
 * Assemble a URL to be used for breadcrumbs and spans.
 *
 * @param url URL string or object containing the component parts
 * @returns Fully-formed URL
 */
function extractUrl(url) {
    if (typeof url === 'string') {
        return url;
    }
    var protocol = url.protocol || '';
    var hostname = url.hostname || url.host || '';
    // Don't log standard :80 (http) and :443 (https) ports to reduce the noise
    var port = !url.port || url.port === 80 || url.port === 443 ? '' : ":" + url.port;
    var path = url.path ? url.path : '/';
    // internal routes end up with too many slashes
    return (protocol + "//" + hostname + port + path).replace('///', '/');
}
/**
 * Handle an edge case with urls in the span description. Runs just before the span closes because it relies on
 * data from the response object.
 *
 * @param requestOptions Configuration data for the request
 * @param response Response object
 * @param span Span representing the request
 */
function cleanDescription(requestOptions, response, span) {
    // There are some libraries which don't pass the request protocol in the options object, so attempt to retrieve it
    // from the response and run the URL processing again. We only do this in the presence of a (non-empty) host value,
    // because if we're missing both, it's likely we're dealing with an internal route, in which case we don't want to be
    // jamming a random `http:` on the front of it.
    if (typeof requestOptions !== 'string' && !Object.keys(requestOptions).includes('protocol') && requestOptions.host) {
        // Neither http.IncomingMessage nor any of its ancestors have an `agent` property in their type definitions, and
        // http.Agent doesn't have a `protocol` property in its type definition. Nonetheless, at least one request library
        // (superagent) arranges things that way, so might as well give it a shot.
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            requestOptions.protocol = response.agent.protocol;
            span.description = (requestOptions.method || 'GET') + " " + extractUrl(requestOptions);
        }
        catch (error) {
            // well, we tried
        }
    }
}
/**
 * Checks whether given url points to Sentry server
 * @param url url to verify
 */
function isSentryRequest(url) {
    var client = hub_getCurrentHub().getClient();
    if (!url || !client) {
        return false;
    }
    var dsn = client.getDsn();
    if (!dsn) {
        return false;
    }
    return url.indexOf(dsn.host) !== -1;
}
//# sourceMappingURL=http.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/tracing/esm/utils.js

var TRACEPARENT_REGEXP = new RegExp('^[ \\t]*' + // whitespace
    '([0-9a-f]{32})?' + // trace_id
    '-?([0-9a-f]{16})?' + // span_id
    '-?([01])?' + // sampled
    '[ \\t]*$');
/**
 * Determines if tracing is currently enabled.
 *
 * Tracing is enabled when at least one of `tracesSampleRate` and `tracesSampler` is defined in the SDK config.
 */
function hasTracingEnabled(options) {
    return 'tracesSampleRate' in options || 'tracesSampler' in options;
}
/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */
function extractTraceparentData(traceparent) {
    var matches = traceparent.match(TRACEPARENT_REGEXP);
    if (matches) {
        var parentSampled = void 0;
        if (matches[3] === '1') {
            parentSampled = true;
        }
        else if (matches[3] === '0') {
            parentSampled = false;
        }
        return {
            traceId: matches[1],
            parentSampled: parentSampled,
            parentSpanId: matches[2],
        };
    }
    return undefined;
}
/** Grabs active transaction off scope, if any */
function getActiveTransaction(hub) {
    if (hub === void 0) { hub = hub_getCurrentHub(); }
    var _a, _b;
    return (_b = (_a = hub) === null || _a === void 0 ? void 0 : _a.getScope()) === null || _b === void 0 ? void 0 : _b.getTransaction();
}
/**
 * Converts from milliseconds to seconds
 * @param time time in ms
 */
function msToSec(time) {
    return time / 1000;
}
/**
 * Converts from seconds to milliseconds
 * @param time time in seconds
 */
function secToMs(time) {
    return time * 1000;
}
// so it can be used in manual instrumentation without necessitating a hard dependency on @sentry/utils

//# sourceMappingURL=utils.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/async.js
/**
 * Consumes the promise and logs the error when it rejects.
 * @param promise A promise to forget.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function forget(promise) {
    promise.then(null, function (e) {
        // TODO: Use a better logging mechanism
        // eslint-disable-next-line no-console
        console.error(e);
    });
}
//# sourceMappingURL=async.js.map
// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(20);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/handlers.js

/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */







var DEFAULT_SHUTDOWN_TIMEOUT = 2000;
/**
 * Express-compatible tracing handler.
 * @see Exposed as `Handlers.tracingHandler`
 */
function tracingHandler() {
    return function sentryTracingMiddleware(req, res, next) {
        // TODO: At this point `req.route.path` (which we use in `extractTransaction`) is not available
        // but `req.path` or `req.url` should do the job as well. We could unify this here.
        var reqMethod = (req.method || '').toUpperCase();
        var reqUrl = req.url && Object(misc["i" /* stripUrlQueryAndFragment */])(req.url);
        // If there is a trace header set, we extract the data from it (parentSpanId, traceId, and sampling decision)
        var traceparentData;
        if (req.headers && Object(is["h" /* isString */])(req.headers['sentry-trace'])) {
            traceparentData = extractTraceparentData(req.headers['sentry-trace']);
        }
        var transaction = startTransaction(__assign({ name: reqMethod + " " + reqUrl, op: 'http.server' }, traceparentData));
        // We put the transaction on the scope so users can attach children to it
        hub_getCurrentHub().configureScope(function (scope) {
            scope.setSpan(transaction);
        });
        // We also set __sentry_transaction on the response so people can grab the transaction there to add
        // spans to it later.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        res.__sentry_transaction = transaction;
        res.once('finish', function () {
            // We schedule the immediate execution of the `finish` to let all the spans being closed first.
            setImmediate(function () {
                transaction.setHttpStatus(res.statusCode);
                transaction.finish();
            });
        });
        next();
    };
}
/** JSDoc */
function extractTransaction(req, type) {
    try {
        // Express.js shape
        var request = req;
        var routePath = void 0;
        try {
            routePath = external_url_["parse"](request.originalUrl || request.url).pathname;
        }
        catch (_oO) {
            routePath = request.route.path;
        }
        switch (type) {
            case 'path': {
                return routePath;
            }
            case 'handler': {
                return request.route.stack[0].name;
            }
            case 'methodPath':
            default: {
                var method = request.method.toUpperCase();
                return method + " " + routePath;
            }
        }
    }
    catch (_oO) {
        return undefined;
    }
}
/** Default user keys that'll be used to extract data from the request */
var DEFAULT_USER_KEYS = ['id', 'username', 'email'];
/** JSDoc */
function extractUserData(user, keys) {
    var extractedUser = {};
    var attributes = Array.isArray(keys) ? keys : DEFAULT_USER_KEYS;
    attributes.forEach(function (key) {
        if (user && key in user) {
            extractedUser[key] = user[key];
        }
    });
    return extractedUser;
}
/**
 * Enriches passed event with request data.
 *
 * @param event Will be mutated and enriched with req data
 * @param req Request object
 * @param options object containing flags to enable functionality
 * @hidden
 */
function parseRequest(event, req, options) {
    // eslint-disable-next-line no-param-reassign
    options = __assign({ ip: false, request: true, serverName: true, transaction: true, user: true, version: true }, options);
    if (options.version) {
        event.contexts = __assign(__assign({}, event.contexts), { runtime: {
                name: 'node',
                version: global.process.version,
            } });
    }
    if (options.request) {
        // if the option value is `true`, use the default set of keys by not passing anything to `extractNodeRequestData()`
        var extractedRequestData = Array.isArray(options.request)
            ? Object(node["b" /* extractNodeRequestData */])(req, options.request)
            : Object(node["b" /* extractNodeRequestData */])(req);
        event.request = __assign(__assign({}, event.request), extractedRequestData);
    }
    if (options.serverName && !event.server_name) {
        event.server_name = global.process.env.SENTRY_NAME || external_os_["hostname"]();
    }
    if (options.user) {
        var extractedUser = req.user && Object(is["e" /* isPlainObject */])(req.user) ? extractUserData(req.user, options.user) : {};
        if (Object.keys(extractedUser)) {
            event.user = __assign(__assign({}, event.user), extractedUser);
        }
    }
    // client ip:
    //   node: req.connection.remoteAddress
    //   express, koa: req.ip
    if (options.ip) {
        var ip = req.ip || (req.connection && req.connection.remoteAddress);
        if (ip) {
            event.user = __assign(__assign({}, event.user), { ip_address: ip });
        }
    }
    if (options.transaction && !event.transaction) {
        var transaction = extractTransaction(req, options.transaction);
        if (transaction) {
            event.transaction = transaction;
        }
    }
    return event;
}
/**
 * Express compatible request handler.
 * @see Exposed as `Handlers.requestHandler`
 */
function requestHandler(options) {
    return function sentryRequestMiddleware(req, res, next) {
        if (options && options.flushTimeout && options.flushTimeout > 0) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            var _end_1 = res.end;
            res.end = function (chunk, encoding, cb) {
                var _this = this;
                flush(options.flushTimeout)
                    .then(function () {
                    _end_1.call(_this, chunk, encoding, cb);
                })
                    .then(null, function (e) {
                    logger.error(e);
                });
            };
        }
        var local = external_domain_["create"]();
        local.add(req);
        local.add(res);
        local.on('error', next);
        local.run(function () {
            hub_getCurrentHub().configureScope(function (scope) {
                return scope.addEventProcessor(function (event) { return parseRequest(event, req, options); });
            });
            next();
        });
    };
}
/** JSDoc */
function getStatusCodeFromResponse(error) {
    var statusCode = error.status || error.statusCode || error.status_code || (error.output && error.output.statusCode);
    return statusCode ? parseInt(statusCode, 10) : 500;
}
/** Returns true if response code is internal server error */
function defaultShouldHandleError(error) {
    var status = getStatusCodeFromResponse(error);
    return status >= 500;
}
/**
 * Express compatible error handler.
 * @see Exposed as `Handlers.errorHandler`
 */
function errorHandler(options) {
    return function sentryErrorMiddleware(error, _req, res, next) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var shouldHandleError = (options && options.shouldHandleError) || defaultShouldHandleError;
        if (shouldHandleError(error)) {
            withScope(function (_scope) {
                // For some reason we need to set the transaction on the scope again
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                var transaction = res.__sentry_transaction;
                if (transaction && _scope.getSpan() === undefined) {
                    _scope.setSpan(transaction);
                }
                var eventId = captureException(error);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                res.sentry = eventId;
                next(error);
            });
            return;
        }
        next(error);
    };
}
/**
 * @hidden
 */
function logAndExitProcess(error) {
    // eslint-disable-next-line no-console
    console.error(error && error.stack ? error.stack : error);
    var client = hub_getCurrentHub().getClient();
    if (client === undefined) {
        logger.warn('No NodeClient was defined, we are exiting the process now.');
        global.process.exit(1);
        return;
    }
    var options = client.getOptions();
    var timeout = (options && options.shutdownTimeout && options.shutdownTimeout > 0 && options.shutdownTimeout) ||
        DEFAULT_SHUTDOWN_TIMEOUT;
    forget(client.close(timeout).then(function (result) {
        if (!result) {
            logger.warn('We reached the timeout for emptying the request buffer, still exiting now!');
        }
        global.process.exit(1);
    }));
}
//# sourceMappingURL=handlers.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/onuncaughtexception.js




/** Global Promise Rejection handler */
var onuncaughtexception_OnUncaughtException = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function OnUncaughtException(_options) {
        if (_options === void 0) { _options = {}; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = OnUncaughtException.id;
        /**
         * @inheritDoc
         */
        this.handler = this._makeErrorHandler();
    }
    /**
     * @inheritDoc
     */
    OnUncaughtException.prototype.setupOnce = function () {
        global.process.on('uncaughtException', this.handler.bind(this));
    };
    /**
     * @hidden
     */
    OnUncaughtException.prototype._makeErrorHandler = function () {
        var _this = this;
        var timeout = 2000;
        var caughtFirstError = false;
        var caughtSecondError = false;
        var calledFatalError = false;
        var firstError;
        return function (error) {
            var onFatalError = logAndExitProcess;
            var client = hub_getCurrentHub().getClient();
            if (_this._options.onFatalError) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onFatalError = _this._options.onFatalError;
            }
            else if (client && client.getOptions().onFatalError) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                onFatalError = client.getOptions().onFatalError;
            }
            if (!caughtFirstError) {
                var hub_1 = hub_getCurrentHub();
                // this is the first uncaught error and the ultimate reason for shutting down
                // we want to do absolutely everything possible to ensure it gets captured
                // also we want to make sure we don't go recursion crazy if more errors happen after this one
                firstError = error;
                caughtFirstError = true;
                if (hub_1.getIntegration(OnUncaughtException)) {
                    hub_1.withScope(function (scope) {
                        scope.setLevel(Severity.Fatal);
                        hub_1.captureException(error, { originalException: error });
                        if (!calledFatalError) {
                            calledFatalError = true;
                            onFatalError(error);
                        }
                    });
                }
                else {
                    if (!calledFatalError) {
                        calledFatalError = true;
                        onFatalError(error);
                    }
                }
            }
            else if (calledFatalError) {
                // we hit an error *after* calling onFatalError - pretty boned at this point, just shut it down
                logger.warn('uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown');
                logAndExitProcess(error);
            }
            else if (!caughtSecondError) {
                // two cases for how we can hit this branch:
                //   - capturing of first error blew up and we just caught the exception from that
                //     - quit trying to capture, proceed with shutdown
                //   - a second independent error happened while waiting for first error to capture
                //     - want to avoid causing premature shutdown before first error capture finishes
                // it's hard to immediately tell case 1 from case 2 without doing some fancy/questionable domain stuff
                // so let's instead just delay a bit before we proceed with our action here
                // in case 1, we just wait a bit unnecessarily but ultimately do the same thing
                // in case 2, the delay hopefully made us wait long enough for the capture to finish
                // two potential nonideal outcomes:
                //   nonideal case 1: capturing fails fast, we sit around for a few seconds unnecessarily before proceeding correctly by calling onFatalError
                //   nonideal case 2: case 2 happens, 1st error is captured but slowly, timeout completes before capture and we treat second error as the sendErr of (nonexistent) failure from trying to capture first error
                // note that after hitting this branch, we might catch more errors where (caughtSecondError && !calledFatalError)
                //   we ignore them - they don't matter to us, we're just waiting for the second error timeout to finish
                caughtSecondError = true;
                setTimeout(function () {
                    if (!calledFatalError) {
                        // it was probably case 1, let's treat err as the sendErr and call onFatalError
                        calledFatalError = true;
                        onFatalError(firstError, error);
                    }
                    else {
                        // it was probably case 2, our first error finished capturing while we waited, cool, do nothing
                    }
                }, timeout); // capturing could take at least sendTimeout to fail, plus an arbitrary second for how long it takes to collect surrounding source etc
            }
        };
    };
    /**
     * @inheritDoc
     */
    OnUncaughtException.id = 'OnUncaughtException';
    return OnUncaughtException;
}());

//# sourceMappingURL=onuncaughtexception.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/onunhandledrejection.js



/** Global Promise Rejection handler */
var onunhandledrejection_OnUnhandledRejection = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function OnUnhandledRejection(_options) {
        if (_options === void 0) { _options = { mode: 'warn' }; }
        this._options = _options;
        /**
         * @inheritDoc
         */
        this.name = OnUnhandledRejection.id;
    }
    /**
     * @inheritDoc
     */
    OnUnhandledRejection.prototype.setupOnce = function () {
        global.process.on('unhandledRejection', this.sendUnhandledPromise.bind(this));
    };
    /**
     * Send an exception with reason
     * @param reason string
     * @param promise promise
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    OnUnhandledRejection.prototype.sendUnhandledPromise = function (reason, promise) {
        var hub = hub_getCurrentHub();
        if (!hub.getIntegration(OnUnhandledRejection)) {
            this._handleRejection(reason);
            return;
        }
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        var context = (promise.domain && promise.domain.sentryContext) || {};
        hub.withScope(function (scope) {
            scope.setExtra('unhandledPromiseRejection', true);
            // Preserve backwards compatibility with raven-node for now
            if (context.user) {
                scope.setUser(context.user);
            }
            if (context.tags) {
                scope.setTags(context.tags);
            }
            if (context.extra) {
                scope.setExtras(context.extra);
            }
            hub.captureException(reason, { originalException: promise });
        });
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        this._handleRejection(reason);
    };
    /**
     * Handler for `mode` option
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OnUnhandledRejection.prototype._handleRejection = function (reason) {
        // https://github.com/nodejs/node/blob/7cf6f9e964aa00772965391c23acda6d71972a9a/lib/internal/process/promises.js#L234-L240
        var rejectionWarning = 'This error originated either by ' +
            'throwing inside of an async function without a catch block, ' +
            'or by rejecting a promise which was not handled with .catch().' +
            ' The promise rejected with the reason:';
        /* eslint-disable no-console */
        if (this._options.mode === 'warn') {
            Object(misc["d" /* consoleSandbox */])(function () {
                console.warn(rejectionWarning);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                console.error(reason && reason.stack ? reason.stack : reason);
            });
        }
        else if (this._options.mode === 'strict') {
            Object(misc["d" /* consoleSandbox */])(function () {
                console.warn(rejectionWarning);
            });
            logAndExitProcess(reason);
        }
        /* eslint-enable no-console */
    };
    /**
     * @inheritDoc
     */
    OnUnhandledRejection.id = 'OnUnhandledRejection';
    return OnUnhandledRejection;
}());

//# sourceMappingURL=onunhandledrejection.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/linkederrors.js




var DEFAULT_KEY = 'cause';
var DEFAULT_LIMIT = 5;
/** Adds SDK info to an event. */
var linkederrors_LinkedErrors = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function LinkedErrors(options) {
        if (options === void 0) { options = {}; }
        /**
         * @inheritDoc
         */
        this.name = LinkedErrors.id;
        this._key = options.key || DEFAULT_KEY;
        this._limit = options.limit || DEFAULT_LIMIT;
    }
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype.setupOnce = function () {
        scope_addGlobalEventProcessor(function (event, hint) {
            var self = hub_getCurrentHub().getIntegration(LinkedErrors);
            if (self) {
                var handler = self._handler && self._handler.bind(self);
                return typeof handler === 'function' ? handler(event, hint) : event;
            }
            return event;
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype._handler = function (event, hint) {
        var _this = this;
        if (!event.exception || !event.exception.values || !hint || !Object(is["d" /* isInstanceOf */])(hint.originalException, Error)) {
            return syncpromise_SyncPromise.resolve(event);
        }
        return new syncpromise_SyncPromise(function (resolve) {
            _this._walkErrorTree(hint.originalException, _this._key)
                .then(function (linkedErrors) {
                if (event && event.exception && event.exception.values) {
                    event.exception.values = __spread(linkedErrors, event.exception.values);
                }
                resolve(event);
            })
                .then(null, function () {
                resolve(event);
            });
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype._walkErrorTree = function (error, key, stack) {
        var _this = this;
        if (stack === void 0) { stack = []; }
        if (!Object(is["d" /* isInstanceOf */])(error[key], Error) || stack.length + 1 >= this._limit) {
            return syncpromise_SyncPromise.resolve(stack);
        }
        return new syncpromise_SyncPromise(function (resolve, reject) {
            getExceptionFromError(error[key])
                .then(function (exception) {
                _this._walkErrorTree(error[key], key, __spread([exception], stack))
                    .then(resolve)
                    .then(null, function () {
                    reject();
                });
            })
                .then(null, function () {
                reject();
            });
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.id = 'LinkedErrors';
    return LinkedErrors;
}());

//# sourceMappingURL=linkederrors.js.map
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(22);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/modules.js



var moduleCache;
/** Extract information about package.json modules */
function collectModules() {
    var mainPaths = (__webpack_require__.c[__webpack_require__.s] && __webpack_require__.c[__webpack_require__.s].paths) || [];
    var paths = __webpack_require__.c ? Object.keys(__webpack_require__.c) : [];
    var infos = {};
    var seen = {};
    paths.forEach(function (path) {
        var dir = path;
        /** Traverse directories upward in the search of package.json file */
        var updir = function () {
            var orig = dir;
            dir = Object(external_path_["dirname"])(orig);
            if (!dir || orig === dir || seen[orig]) {
                return undefined;
            }
            if (mainPaths.indexOf(dir) < 0) {
                return updir();
            }
            var pkgfile = Object(external_path_["join"])(orig, 'package.json');
            seen[orig] = true;
            if (!Object(external_fs_["existsSync"])(pkgfile)) {
                return updir();
            }
            try {
                var info = JSON.parse(Object(external_fs_["readFileSync"])(pkgfile, 'utf8'));
                infos[info.name] = info.version;
            }
            catch (_oO) {
                // no-empty
            }
        };
        updir();
    });
    return infos;
}
/** Add node modules / packages to the event */
var modules_Modules = /** @class */ (function () {
    function Modules() {
        /**
         * @inheritDoc
         */
        this.name = Modules.id;
    }
    /**
     * @inheritDoc
     */
    Modules.prototype.setupOnce = function (addGlobalEventProcessor, getCurrentHub) {
        var _this = this;
        addGlobalEventProcessor(function (event) {
            if (!getCurrentHub().getIntegration(Modules)) {
                return event;
            }
            return __assign(__assign({}, event), { modules: _this._getModules() });
        });
    };
    /** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */
    Modules.prototype._getModules = function () {
        if (!moduleCache) {
            moduleCache = collectModules();
        }
        return moduleCache;
    };
    /**
     * @inheritDoc
     */
    Modules.id = 'Modules';
    return Modules;
}());

//# sourceMappingURL=modules.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/index.js






//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/sdk.js







var sdk_defaultIntegrations = [
    // Common
    new integrations_namespaceObject.InboundFilters(),
    new integrations_namespaceObject.FunctionToString(),
    // Native Wrappers
    new console_Console(),
    new http_Http(),
    // Global Handlers
    new onuncaughtexception_OnUncaughtException(),
    new onunhandledrejection_OnUnhandledRejection(),
    // Misc
    new linkederrors_LinkedErrors(),
];
/**
 * The Sentry Node SDK Client.
 *
 * To use this SDK, call the {@link init} function as early as possible in the
 * main entry module. To set context information or send manual events, use the
 * provided methods.
 *
 * @example
 * ```
 *
 * const { init } = require('@sentry/node');
 *
 * init({
 *   dsn: '__DSN__',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { configureScope } = require('@sentry/node');
 * configureScope((scope: Scope) => {
 *   scope.setExtra({ battery: 0.7 });
 *   scope.setTag({ user_mode: 'admin' });
 *   scope.setUser({ id: '4711' });
 * });
 * ```
 *
 * @example
 * ```
 *
 * const { addBreadcrumb } = require('@sentry/node');
 * addBreadcrumb({
 *   message: 'My Breadcrumb',
 *   // ...
 * });
 * ```
 *
 * @example
 * ```
 *
 * const Sentry = require('@sentry/node');
 * Sentry.captureMessage('Hello, world!');
 * Sentry.captureException(new Error('Good bye'));
 * Sentry.captureEvent({
 *   message: 'Manual',
 *   stacktrace: [
 *     // ...
 *   ],
 * });
 * ```
 *
 * @see {@link NodeOptions} for documentation on configuration options.
 */
function init(options) {
    if (options === void 0) { options = {}; }
    if (options.defaultIntegrations === undefined) {
        options.defaultIntegrations = sdk_defaultIntegrations;
    }
    if (options.dsn === undefined && process.env.SENTRY_DSN) {
        options.dsn = process.env.SENTRY_DSN;
    }
    if (options.release === undefined) {
        var global_1 = Object(misc["f" /* getGlobalObject */])();
        // Prefer env var over global
        if (process.env.SENTRY_RELEASE) {
            options.release = process.env.SENTRY_RELEASE;
        }
        // This supports the variable that sentry-webpack-plugin injects
        else if (global_1.SENTRY_RELEASE && global_1.SENTRY_RELEASE.id) {
            options.release = global_1.SENTRY_RELEASE.id;
        }
    }
    if (options.environment === undefined && process.env.SENTRY_ENVIRONMENT) {
        options.environment = process.env.SENTRY_ENVIRONMENT;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    if (external_domain_["active"]) {
        setHubOnCarrier(getMainCarrier(), hub_getCurrentHub());
    }
    initAndBind(client_NodeClient, options);
}
/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
function lastEventId() {
    return hub_getCurrentHub().lastEventId();
}
/**
 * A promise that resolves when all current events have been sent.
 * If you provide a timeout and the queue takes longer to drain the promise returns false.
 *
 * @param timeout Maximum time in ms the client should wait.
 */
function flush(timeout) {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            client = hub_getCurrentHub().getClient();
            if (client) {
                return [2 /*return*/, client.flush(timeout)];
            }
            return [2 /*return*/, Promise.reject(false)];
        });
    });
}
/**
 * A promise that resolves when all current events have been sent.
 * If you provide a timeout and the queue takes longer to drain the promise returns false.
 *
 * @param timeout Maximum time in ms the client should wait.
 */
function sdk_close(timeout) {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            client = hub_getCurrentHub().getClient();
            if (client) {
                return [2 /*return*/, client.close(timeout)];
            }
            return [2 /*return*/, Promise.reject(false)];
        });
    });
}
//# sourceMappingURL=sdk.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/index.js













var INTEGRATIONS = __assign(__assign({}, integrations_namespaceObject), esm_integrations_namespaceObject);

// We need to patch domain on the global __SENTRY__ object to make it work for node in cross-platform packages like
// @sentry/hub. If we don't do this, browser bundlers will have troubles resolving `require('domain')`.
var esm_carrier = getMainCarrier();
if (esm_carrier.__SENTRY__) {
    esm_carrier.__SENTRY__.extensions = esm_carrier.__SENTRY__.extensions || {};
    esm_carrier.__SENTRY__.extensions.domain = esm_carrier.__SENTRY__.extensions.domain || external_domain_;
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 184:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.use_middlewares_with_error_safety_net = exports.DEFAULT_RESPONSE_BODY = void 0;

const tslib_1 = __webpack_require__(77);

__webpack_require__(185);

const tiny_invariant_1 = tslib_1.__importDefault(__webpack_require__(1));

const json_stable_stringify_1 = tslib_1.__importDefault(__webpack_require__(79));

const timestamps_1 = __webpack_require__(33);

const soft_execution_context_1 = __webpack_require__(25);

const state_utils_1 = __webpack_require__(27);

const api_interface_1 = __webpack_require__(55);

const async_utils_1 = __webpack_require__(201);

const sentry_1 = __webpack_require__(146);

const channel_1 = __webpack_require__(39);

const utils_1 = __webpack_require__(54); ////////////////////////////////////
// note: deducted from the overall running budget


const MARGIN_AND_SENTRY_BUDGET_MS = channel_1.CHANNEL === 'dev' ? -5000 : -1000;
exports.DEFAULT_RESPONSE_BODY = `[MWRunner] Bad middleware chain: no response set!`;

function _get_body_debug_representation(body) {
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {}
  }

  if (!body) return String(body);

  if (body.v && body.data) {
    if (state_utils_1.is_revisioned(body.data)) {
      body = { ...body,
        data: {
          '[DEBUG]': state_utils_1.get_base_loose(body.data)
        }
      };
    }
  } else if (state_utils_1.is_revisioned(body)) body = {
    '[DEBUG]': state_utils_1.get_base_loose(body)
  };

  if (typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  if (body.length > 120) body = body.slice(0, 120) + '(…)';
  return body;
}

function _get_response_debug_representation(response) {
  return { ...response,
    body: _get_body_debug_representation(response.body)
  };
} ////////////////////////////////////


function use_middlewares_with_error_safety_net(event, badly_typed_context, middlewares, SEC = soft_execution_context_1.getRootSEC()) {
  console.log('\n\n\n\n' + Array.from({
    length: 100
  }, () => '→').join(' '));
  const SESSION_START_TIME_MS = timestamps_1.get_UTC_timestamp_ms();
  return SEC.xTry('MWRunner', ({
    SEC,
    logger
  }) => {
    const context = badly_typed_context; // overwrite to match handling

    SEC.injectDependencies({
      SESSION_START_TIME_MS
    }); ///////////////////// Setup /////////////////////

    return _run_with_safety_net(SEC, event, context, middlewares);
  }).then(response => {
    console.log('FYI MWRunner promise resolved with:', _get_response_debug_representation(response));
    return response;
  }, err => {
    console.warn('FYI MWRunner promise rejected with:', err);
    throw err;
  }).then(response => {
    tiny_invariant_1.default(response.statusCode >= 200, `status code is >= 200! (${response.statusCode})`);
    tiny_invariant_1.default(response.statusCode < 300, `status code is < 300! (${response.statusCode})`);

    try {
      response.body = JSON.parse(response.body);
    } catch {}

    if (!api_interface_1.is_server_response_body(response.body)) response.body = api_interface_1.create_server_response_body__data(response.body);
    return response;
  }).catch(err => {
    const response = {
      statusCode: err.statusCode || 500,
      headers: {},
      body: api_interface_1.create_server_response_body__error(err) // temporarily passing as string

    };
    return response;
  }).then(response => {
    const body = response.body; // add side infos TODO
    //body.side.latest_news = body.side.latest_news || []
    // add meta

    body.meta.processing_time_ms = timestamps_1.get_UTC_timestamp_ms() - SESSION_START_TIME_MS;
    body.meta.request_summary = `${event.httpMethod.toUpperCase()}:${event.path}`; // finally stringify

    response.body = JSON.stringify(body);
    return response;
  }).then(response => {
    console.log('FYI Overall promise resolved with:', _get_response_debug_representation(response));
    return response;
  }, err => {
    console.warn('FYI Overall promise rejected with:', err);
    throw err;
  }).finally(() => {
    console.log(`FYI processed in ${(timestamps_1.get_UTC_timestamp_ms() - SESSION_START_TIME_MS) / 1000.}s`);
  });
}

exports.use_middlewares_with_error_safety_net = use_middlewares_with_error_safety_net;

function _run_with_safety_net(SEC, event, context, middlewares) {
  var _a;

  return SEC.xPromiseTry((((_a = event === null || event === void 0 ? void 0 : event.httpMethod) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || '???') + '/' + (utils_1.loosely_get_clean_path(event) || '???'), ({
    SEC
  }) => SEC.xNewPromise('⓵ ', ({
    SEC,
    logger
  }, resolve, reject) => {
    const PREFIX = 'MR1';
    logger.log(`[${PREFIX}] Starting handling: ${event.httpMethod.toUpperCase()} ${event.path}…`, {
      time: timestamps_1.get_UTC_timestamp_ms(),
      mw_count: middlewares.length
    });
    tiny_invariant_1.default(middlewares.length >= 1, `[${PREFIX}] please provide some middlewares!`);
    let timeout_id = null;
    let is_emitter_waiting = false;

    function clean() {
      if (timeout_id) {
        clearTimeout(timeout_id);
        timeout_id = null;
      }

      if (is_emitter_waiting) {
        SEC.emitter.off('final-error', on_final_error_h);
        is_emitter_waiting = false;
      }
    }

    async function on_final_error(err) {
      clean();
      logger.fatal(`⚰️ [${PREFIX}] Final error:`, err);

      if (channel_1.CHANNEL === 'dev') {
        logger.info(`([${PREFIX}] error not reported to sentry since dev)`);
      } else {
        logger.info(`([${PREFIX}] this error will be reported to sentry)`);

        try {
          await sentry_1.on_error(err);
        } catch (err) {
          console.error(`XXX [${PREFIX}] huge error in the error handler itself! XXX`);
        }
      } // note: once resolved, the code will be frozen by AWS lambda
      // so this must be last


      logger.info(`[${PREFIX}] FYI rejecting with the error.`);
      reject(err);
    }

    async function on_final_error_h({
      err
    }) {
      logger.trace(`[${PREFIX}] on_final_error_h`);
      is_emitter_waiting = false;
      await on_final_error(err);
    }

    SEC.emitter.once('final-error').then(on_final_error_h);
    is_emitter_waiting = true;
    context.callbackWaitsForEmptyEventLoop = false; // cf. https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

    const LSEC = SEC;
    LSEC.injectDependencies({
      local_mutable: {
        last_invoked_mw: '(none yet)'
      }
    });
    const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10000;
    const time_budget_ms = Math.max(remaining_time_ms + MARGIN_AND_SENTRY_BUDGET_MS, 0);
    logger.info(`[${PREFIX}] Setting timeout…`, {
      time_budget_ms
    });
    timeout_id = setTimeout(() => {
      timeout_id = null;
      LSEC.xTryCatch('timeout', ({
        logger
      }) => {
        const {
          local_mutable
        } = LSEC.getInjectedDependencies();
        logger.fatal(`⏰ [${PREFIX}] timeout!`, local_mutable);
        throw new Error(`[${PREFIX}] Timeout handling this request! (mw=${local_mutable.last_invoked_mw})`);
      });
    }, time_budget_ms); ///////////////////// invoke /////////////////////

    logger.trace(`[${PREFIX}] Invoking the middleware chain…`);
    void LSEC.xPromiseTry('⓶ ', async params => _run_mw_chain(params, event, context, middlewares)).then(response => {
      // success!
      clean(); // must be last,

      resolve(response);
    }).catch(on_final_error);
  }));
}

async function _run_mw_chain({
  SEC,
  logger
}, event, context, middlewares) {
  const PREFIX = 'MR2';
  const STATUS_CODE_NOT_SET_DETECTOR = -1;
  const DEFAULT_MW_NAME = 'anonymous';
  logger.trace(`[${PREFIX}] Invoking a chain of ${middlewares.length} middlewares…`);
  const response = {
    statusCode: STATUS_CODE_NOT_SET_DETECTOR,
    headers: {},
    body: exports.DEFAULT_RESPONSE_BODY
  }; ////////////////////////////////////

  let last_manual_error_call_SEC = null;
  let _previous_status_code = response.statusCode;
  let _previous_body = response.body;

  function _check_response(SEC, mw_index, stage) {
    const {
      logger
    } = SEC.getInjectedDependencies();
    tiny_invariant_1.default(mw_index >= 0 && mw_index < middlewares.length, 'mw_index in range');
    let {
      statusCode,
      body
    } = response;
    const current_mw_name = middlewares[mw_index].name || DEFAULT_MW_NAME;
    let mw_debug_id = current_mw_name;
    if (mw_index < middlewares.length) mw_debug_id += '(' + stage + ')'; //console.log('_check_response', {mw_index, mw_debug_id}, '\nfrom SEC:', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())

    if (statusCode !== _previous_status_code) {
      logger.trace(`[${PREFIX}] FYI The middleware "${mw_debug_id}" set the statusCode:`, {
        statusCode
      });
      if (!statusCode || Math.trunc(Number(statusCode)) !== statusCode) throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set an invalid statusCode!`);

      if (statusCode < 200 || statusCode >= 300) {
        logger.error(`[${PREFIX}] FYI The middleware "${mw_debug_id}" set a non-ok statusCode, it should have thrown instead!`, {
          statusCode
        });
        last_manual_error_call_SEC = SEC;
      }

      _previous_status_code = statusCode;
    }

    if (body !== _previous_body) {
      logger.trace(`[${PREFIX}] FYI The middleware "${mw_debug_id}" set the body:`, _get_body_debug_representation(body));
      if (!body) throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set an invalid empty body!`);

      if (statusCode < 400) {
        if (typeof body === 'string') {
          try {
            JSON.parse(body); // check if it's correct json
          } catch (err) {
            throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set an non-json string body!`);
          }
        } else {
          try {
            json_stable_stringify_1.default(body); // TODO deep compare to check for un-stringifiable stufff??
          } catch {
            throw new Error(`[${PREFIX}] The middleware "${mw_debug_id}" set a non-JSON-stringified body that can’t be fixed automatically!`);
          }
        }
      }

      _previous_body = body;
    }
  } ////////////////////////////////////


  let _last_SEC = SEC;
  let _last_reported_err_msg = null;

  async function next(SEC, index) {
    if (index > 0) {
      _check_response(_last_SEC, index - 1, 'in');
    }

    if (index >= middlewares.length) return;
    const current_mw_name = middlewares[index].name || DEFAULT_MW_NAME;
    await SEC.xPromiseTry('mw:' + current_mw_name, async ({
      SEC
    }) => {
      _last_SEC = SEC; //console.log('_last_SEC now =', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())

      logger.trace(`[${PREFIX}] invoking middleware ${index + 1}/${middlewares.length} "${current_mw_name}"…`);
      const {
        local_mutable
      } = SEC.getInjectedDependencies();
      local_mutable.last_invoked_mw = current_mw_name;
      await middlewares[index](SEC, event, context, response, next.bind(null, SEC, index + 1));
      logger.trace(`[${PREFIX}] returned from middleware ${index + 1}/${middlewares.length} "${current_mw_name}"…`);

      _check_response(SEC, index, 'out');
    }).catch(err => {
      if (err.message === _last_reported_err_msg) {
        logger.info(`[${PREFIX}] FYI MW "${current_mw_name}" propagated the error.`);
      } else {
        logger.error(`[${PREFIX}] FYI MW "${current_mw_name}" rejected with:`, err);
        _last_reported_err_msg = err.message;
      }

      throw err;
    });
  } // launch the chain


  await next(SEC, 0); ////////////////////////////////////

  let {
    statusCode,
    headers,
    body
  } = response;
  if (response.body === exports.DEFAULT_RESPONSE_BODY) throw new Error(exports.DEFAULT_RESPONSE_BODY);

  if (response.statusCode === STATUS_CODE_NOT_SET_DETECTOR) {
    throw new Error('Status code not set by any MW!');
  }

  let pseudo_err = null;

  if (statusCode >= 300) {
    tiny_invariant_1.default(last_manual_error_call_SEC, 'non-OK status should have caused a corresponding SEC to be memorized'); // todo enhance non-stringified?

    const is_body_err_message = typeof body === 'string' && body.toLowerCase().includes('error');
    pseudo_err = utils_1.create_error(is_body_err_message ? body : statusCode, {
      statusCode
    }, last_manual_error_call_SEC);
  }

  if (pseudo_err) throw pseudo_err; // so that it get consistently reported
  // as a convenience, stringify the body automatically
  // no need to retest, was validated before

  if (typeof body !== 'string') {
    logger.debug(`[${PREFIX}] stringifying automatically…`);
    body = json_stable_stringify_1.default(body);
  }

  await async_utils_1.end_of_current_event_loop(); // to give time to unhandled rejections to be detected. not 100% reliable, of course.

  return {
    statusCode,
    headers,
    body
  };
}

/***/ }),

/***/ 185:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(77);

const soft_execution_context_1 = __webpack_require__(25); //import { JSONRpcRequest, JSONRpcResponse } from '@offirmo-private/json-rpc-types'


const soft_execution_context_node_1 = __webpack_require__(186);

const consts_1 = __webpack_require__(26);

const channel_1 = __webpack_require__(39);

const logger_1 = tslib_1.__importDefault(__webpack_require__(187)); /////////////////////


const SEC = soft_execution_context_1.getRootSEC().setLogicalStack({
  module: consts_1.APP
}).injectDependencies({
  logger: logger_1.default
});
soft_execution_context_node_1.decorateWithDetectedEnv(SEC);
SEC.injectDependencies({
  CHANNEL: channel_1.CHANNEL
});
SEC.setAnalyticsAndErrorDetails({
  product: consts_1.APP,
  //	VERSION,
  CHANNEL: channel_1.CHANNEL
}); /////////////////////////////////////////////////

SEC.emitter.on('analytics', function onAnalytics({
  SEC,
  eventId,
  details
}) {
  console.groupCollapsed(`⚡  [TODO] Analytics! ⚡  ${eventId}`);
  console.table('details', details);
  console.groupEnd();
}); // remove all the listeners installed by AWS (if any)
// TODO externalize in SEC-node
//console.log('uncaughtException Listeners:', process.listenerCount('uncaughtException'))
//console.log('unhandledRejection Listeners:', process.listenerCount('unhandledRejection'))

process.listeners('uncaughtException').forEach(l => process.off('uncaughtException', l));
process.listeners('unhandledRejection').forEach(l => process.off('unhandledRejection', l));
soft_execution_context_node_1.listenToUncaughtErrors();
soft_execution_context_node_1.listenToUnhandledRejections();
SEC.xTry('SEC/init', ({
  logger
}) => {
  logger.trace('Root Soft Execution Context initialized ✔');
});
const {
  ENV
} = SEC.getInjectedDependencies();

if (ENV !== "production") {
  logger_1.default.error('ENV detection mismatch!', {
    'SEC.ENV': ENV,
    'process.env.NODE_ENV': "production"
  });
}

/***/ }),

/***/ 186:
/***/ (function(module, exports, __webpack_require__) {

const os = __webpack_require__(20);

const {
  getRootSEC
} = __webpack_require__(25); // TODO protect from double install


function listenToUncaughtErrors() {
  const SEC = getRootSEC().createChild().setLogicalStack({
    operation: '(node/uncaught)'
  });
  process.on('uncaughtException', err => {
    SEC._handleError({
      SEC,
      debugId: 'node/uncaught',
      shouldRethrow: false
    }, err);
  });
}

function listenToUnhandledRejections() {
  const SEC = getRootSEC().createChild().setLogicalStack({
    operation: '(node/unhandled rejection)'
  });
  process.on('unhandledRejection', err => {
    SEC._handleError({
      SEC,
      debugId: 'node/unhandled rejection',
      shouldRethrow: false
    }, err);
  });
}

function decorateWithDetectedEnv() {
  const SEC = getRootSEC(); // TODO normalize browser/os detection

  const details = {
    node_version: process.versions.node,
    os_platform: os.platform(),
    os_release: os.release(),
    os_type: os.type()
  };
  SEC.setAnalyticsAndErrorDetails(details);
} // for unit tests only, for convenience


function _force_uda_logger_with_level(suggestedLevel) {
  try {
    try {
      getRootSEC().getInjectedDependencies().logger.setLevel(suggestedLevel);
    } catch {
      const {
        getLogger
      } = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module '@offirmo/universal-debug-api-node'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

      const logger = getLogger({
        suggestedLevel
      });
      getRootSEC().injectDependencies({
        logger
      });
    }
  } catch (err) {
    getRootSEC().getInjectedDependencies().logger.warn('Couldn’t force an UDA logger with given level!');
  }
}

module.exports = { ...__webpack_require__(25),
  listenToUncaughtErrors,
  listenToUnhandledRejections,
  decorateWithDetectedEnv,
  _force_uda_logger_with_level // for convenience, especially unit tests

};

/***/ }),

/***/ 187:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__filename) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

const universal_debug_api_node_1 = __webpack_require__(64);

const consts_1 = __webpack_require__(26);

const channel_1 = __webpack_require__(39); /////////////////////////////////////////////////


const logger = universal_debug_api_node_1.getLogger({
  name: consts_1.APP,
  suggestedLevel: channel_1.CHANNEL === 'dev' ? 'silly' : 'warning'
});
console.log('\n\n');
logger.info(`❄️ Cold start of "${consts_1.APP}"`, {
  logger_level: logger.getLevel(),
  CHANNEL: channel_1.CHANNEL,
  __filename
}); //logger.info('ENV', process.env)

exports.default = logger;
/* WEBPACK VAR INJECTION */}.call(this, "/index.js"))

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

exports.parse = __webpack_require__(189);
exports.stringify = __webpack_require__(190);


/***/ }),

/***/ 189:
/***/ (function(module, exports) {

var at, // The index of the current character
    ch, // The current character
    escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    '\b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'
    },
    text,

    error = function (m) {
        // Call error when something is wrong.
        throw {
            name:    'SyntaxError',
            message: m,
            at:      at,
            text:    text
        };
    },
    
    next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        
        // Get the next character. When there are no more characters,
        // return the empty string.
        
        ch = text.charAt(at);
        at += 1;
        return ch;
    },
    
    number = function () {
        // Parse a number value.
        var number,
            string = '';
        
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while (next() && ch >= '0' && ch <= '9') {
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
    
    string = function () {
        // Parse a string value.
        var hex,
            i,
            string = '',
            uffff;
        
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            while (next()) {
                if (ch === '"') {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },

    white = function () {

// Skip whitespace.

        while (ch && ch <= ' ') {
            next();
        }
    },

    word = function () {

// true, false, or null.

        switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
    },

    value,  // Place holder for the value function.

    array = function () {

// Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array;   // empty array
            }
            while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },

    object = function () {

// Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object;   // empty object
            }
            while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    switch (ch) {
    case '{':
        return object();
    case '[':
        return array();
    case '"':
        return string();
    case '-':
        return number();
    default:
        return ch >= '0' && ch <= '9' ? number() : word();
    }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({'': result}, '')) : result;
};


/***/ }),

/***/ 190:
/***/ (function(module, exports) {

var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}

function str(key, holder) {
    // Produce a string from holder[key].
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    
    // What happens next depends on the value's type.
    switch (typeof value) {
        case 'string':
            return quote(value);
        
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
            
        case 'object':
            if (!value) return 'null';
            gap += indent;
            partial = [];
            
            // Array.isArray
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                
                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            
            // If the replacer is an array, use it to select the members to be
            // stringified.
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            
        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

module.exports = function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    // If the space parameter is a string, it will be used as the indent string.
    else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    rep = replacer;
    if (replacer && typeof replacer !== 'function'
    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {'': value});
};


/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DiffPatcher", function() { return DiffPatcher; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "formatters", function() { return index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "console", function() { return console$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dateReviver", function() { return dateReviver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "diff", function() { return diff; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "patch", function() { return patch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unpatch", function() { return unpatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reverse", function() { return reverse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return clone$1; });
/* harmony import */ var diff_match_patch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56);
/* harmony import */ var diff_match_patch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(diff_match_patch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_1__);



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Processor = function () {
  function Processor(options) {
    classCallCheck(this, Processor);

    this.selfOptions = options || {};
    this.pipes = {};
  }

  createClass(Processor, [{
    key: 'options',
    value: function options(_options) {
      if (_options) {
        this.selfOptions = _options;
      }
      return this.selfOptions;
    }
  }, {
    key: 'pipe',
    value: function pipe(name, pipeArg) {
      var pipe = pipeArg;
      if (typeof name === 'string') {
        if (typeof pipe === 'undefined') {
          return this.pipes[name];
        } else {
          this.pipes[name] = pipe;
        }
      }
      if (name && name.name) {
        pipe = name;
        if (pipe.processor === this) {
          return pipe;
        }
        this.pipes[pipe.name] = pipe;
      }
      pipe.processor = this;
      return pipe;
    }
  }, {
    key: 'process',
    value: function process(input, pipe) {
      var context = input;
      context.options = this.options();
      var nextPipe = pipe || input.pipe || 'default';
      var lastPipe = void 0;
      var lastContext = void 0;
      while (nextPipe) {
        if (typeof context.nextAfterChildren !== 'undefined') {
          // children processed and coming back to parent
          context.next = context.nextAfterChildren;
          context.nextAfterChildren = null;
        }

        if (typeof nextPipe === 'string') {
          nextPipe = this.pipe(nextPipe);
        }
        nextPipe.process(context);
        lastContext = context;
        lastPipe = nextPipe;
        nextPipe = null;
        if (context) {
          if (context.next) {
            context = context.next;
            nextPipe = lastContext.nextPipe || context.pipe || lastPipe;
          }
        }
      }
      return context.hasResult ? context.result : undefined;
    }
  }]);
  return Processor;
}();

var Pipe = function () {
  function Pipe(name) {
    classCallCheck(this, Pipe);

    this.name = name;
    this.filters = [];
  }

  createClass(Pipe, [{
    key: 'process',
    value: function process(input) {
      if (!this.processor) {
        throw new Error('add this pipe to a processor before using it');
      }
      var debug = this.debug;
      var length = this.filters.length;
      var context = input;
      for (var index = 0; index < length; index++) {
        var filter = this.filters[index];
        if (debug) {
          this.log('filter: ' + filter.filterName);
        }
        filter(context);
        if ((typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object' && context.exiting) {
          context.exiting = false;
          break;
        }
      }
      if (!context.next && this.resultCheck) {
        this.resultCheck(context);
      }
    }
  }, {
    key: 'log',
    value: function log(msg) {
      console.log('[jsondiffpatch] ' + this.name + ' pipe, ' + msg);
    }
  }, {
    key: 'append',
    value: function append() {
      var _filters;

      (_filters = this.filters).push.apply(_filters, arguments);
      return this;
    }
  }, {
    key: 'prepend',
    value: function prepend() {
      var _filters2;

      (_filters2 = this.filters).unshift.apply(_filters2, arguments);
      return this;
    }
  }, {
    key: 'indexOf',
    value: function indexOf(filterName) {
      if (!filterName) {
        throw new Error('a filter name is required');
      }
      for (var index = 0; index < this.filters.length; index++) {
        var filter = this.filters[index];
        if (filter.filterName === filterName) {
          return index;
        }
      }
      throw new Error('filter not found: ' + filterName);
    }
  }, {
    key: 'list',
    value: function list() {
      return this.filters.map(function (f) {
        return f.filterName;
      });
    }
  }, {
    key: 'after',
    value: function after(filterName) {
      var index = this.indexOf(filterName);
      var params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error('a filter is required');
      }
      params.unshift(index + 1, 0);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }
  }, {
    key: 'before',
    value: function before(filterName) {
      var index = this.indexOf(filterName);
      var params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error('a filter is required');
      }
      params.unshift(index, 0);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }
  }, {
    key: 'replace',
    value: function replace(filterName) {
      var index = this.indexOf(filterName);
      var params = Array.prototype.slice.call(arguments, 1);
      if (!params.length) {
        throw new Error('a filter is required');
      }
      params.unshift(index, 1);
      Array.prototype.splice.apply(this.filters, params);
      return this;
    }
  }, {
    key: 'remove',
    value: function remove(filterName) {
      var index = this.indexOf(filterName);
      this.filters.splice(index, 1);
      return this;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.filters.length = 0;
      return this;
    }
  }, {
    key: 'shouldHaveResult',
    value: function shouldHaveResult(should) {
      if (should === false) {
        this.resultCheck = null;
        return;
      }
      if (this.resultCheck) {
        return;
      }
      var pipe = this;
      this.resultCheck = function (context) {
        if (!context.hasResult) {
          console.log(context);
          var error = new Error(pipe.name + ' failed');
          error.noResult = true;
          throw error;
        }
      };
      return this;
    }
  }]);
  return Pipe;
}();

var Context = function () {
  function Context() {
    classCallCheck(this, Context);
  }

  createClass(Context, [{
    key: 'setResult',
    value: function setResult(result) {
      this.result = result;
      this.hasResult = true;
      return this;
    }
  }, {
    key: 'exit',
    value: function exit() {
      this.exiting = true;
      return this;
    }
  }, {
    key: 'switchTo',
    value: function switchTo(next, pipe) {
      if (typeof next === 'string' || next instanceof Pipe) {
        this.nextPipe = next;
      } else {
        this.next = next;
        if (pipe) {
          this.nextPipe = pipe;
        }
      }
      return this;
    }
  }, {
    key: 'push',
    value: function push(child, name) {
      child.parent = this;
      if (typeof name !== 'undefined') {
        child.childName = name;
      }
      child.root = this.root || this;
      child.options = child.options || this.options;
      if (!this.children) {
        this.children = [child];
        this.nextAfterChildren = this.next || null;
        this.next = child;
      } else {
        this.children[this.children.length - 1].next = child;
        this.children.push(child);
      }
      child.next = this;
      return this;
    }
  }]);
  return Context;
}();

var isArray = typeof Array.isArray === 'function' ? Array.isArray : function (a) {
  return a instanceof Array;
};

function cloneRegExp(re) {
  var regexMatch = /^\/(.*)\/([gimyu]*)$/.exec(re.toString());
  return new RegExp(regexMatch[1], regexMatch[2]);
}

function clone(arg) {
  if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) !== 'object') {
    return arg;
  }
  if (arg === null) {
    return null;
  }
  if (isArray(arg)) {
    return arg.map(clone);
  }
  if (arg instanceof Date) {
    return new Date(arg.getTime());
  }
  if (arg instanceof RegExp) {
    return cloneRegExp(arg);
  }
  var cloned = {};
  for (var name in arg) {
    if (Object.prototype.hasOwnProperty.call(arg, name)) {
      cloned[name] = clone(arg[name]);
    }
  }
  return cloned;
}

var DiffContext = function (_Context) {
  inherits(DiffContext, _Context);

  function DiffContext(left, right) {
    classCallCheck(this, DiffContext);

    var _this = possibleConstructorReturn(this, (DiffContext.__proto__ || Object.getPrototypeOf(DiffContext)).call(this));

    _this.left = left;
    _this.right = right;
    _this.pipe = 'diff';
    return _this;
  }

  createClass(DiffContext, [{
    key: 'setResult',
    value: function setResult(result) {
      if (this.options.cloneDiffValues && (typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
        var clone$$1 = typeof this.options.cloneDiffValues === 'function' ? this.options.cloneDiffValues : clone;
        if (_typeof(result[0]) === 'object') {
          result[0] = clone$$1(result[0]);
        }
        if (_typeof(result[1]) === 'object') {
          result[1] = clone$$1(result[1]);
        }
      }
      return Context.prototype.setResult.apply(this, arguments);
    }
  }]);
  return DiffContext;
}(Context);

var PatchContext = function (_Context) {
  inherits(PatchContext, _Context);

  function PatchContext(left, delta) {
    classCallCheck(this, PatchContext);

    var _this = possibleConstructorReturn(this, (PatchContext.__proto__ || Object.getPrototypeOf(PatchContext)).call(this));

    _this.left = left;
    _this.delta = delta;
    _this.pipe = 'patch';
    return _this;
  }

  return PatchContext;
}(Context);

var ReverseContext = function (_Context) {
  inherits(ReverseContext, _Context);

  function ReverseContext(delta) {
    classCallCheck(this, ReverseContext);

    var _this = possibleConstructorReturn(this, (ReverseContext.__proto__ || Object.getPrototypeOf(ReverseContext)).call(this));

    _this.delta = delta;
    _this.pipe = 'reverse';
    return _this;
  }

  return ReverseContext;
}(Context);

var isArray$1 = typeof Array.isArray === 'function' ? Array.isArray : function (a) {
  return a instanceof Array;
};

var diffFilter = function trivialMatchesDiffFilter(context) {
  if (context.left === context.right) {
    context.setResult(undefined).exit();
    return;
  }
  if (typeof context.left === 'undefined') {
    if (typeof context.right === 'function') {
      throw new Error('functions are not supported');
    }
    context.setResult([context.right]).exit();
    return;
  }
  if (typeof context.right === 'undefined') {
    context.setResult([context.left, 0, 0]).exit();
    return;
  }
  if (typeof context.left === 'function' || typeof context.right === 'function') {
    throw new Error('functions are not supported');
  }
  context.leftType = context.left === null ? 'null' : _typeof(context.left);
  context.rightType = context.right === null ? 'null' : _typeof(context.right);
  if (context.leftType !== context.rightType) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === 'boolean' || context.leftType === 'number') {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  if (context.leftType === 'object') {
    context.leftIsArray = isArray$1(context.left);
  }
  if (context.rightType === 'object') {
    context.rightIsArray = isArray$1(context.right);
  }
  if (context.leftIsArray !== context.rightIsArray) {
    context.setResult([context.left, context.right]).exit();
    return;
  }

  if (context.left instanceof RegExp) {
    if (context.right instanceof RegExp) {
      context.setResult([context.left.toString(), context.right.toString()]).exit();
    } else {
      context.setResult([context.left, context.right]).exit();
    }
  }
};
diffFilter.filterName = 'trivial';

var patchFilter = function trivialMatchesPatchFilter(context) {
  if (typeof context.delta === 'undefined') {
    context.setResult(context.left).exit();
    return;
  }
  context.nested = !isArray$1(context.delta);
  if (context.nested) {
    return;
  }
  if (context.delta.length === 1) {
    context.setResult(context.delta[0]).exit();
    return;
  }
  if (context.delta.length === 2) {
    if (context.left instanceof RegExp) {
      var regexArgs = /^\/(.*)\/([gimyu]+)$/.exec(context.delta[1]);
      if (regexArgs) {
        context.setResult(new RegExp(regexArgs[1], regexArgs[2])).exit();
        return;
      }
    }
    context.setResult(context.delta[1]).exit();
    return;
  }
  if (context.delta.length === 3 && context.delta[2] === 0) {
    context.setResult(undefined).exit();
  }
};
patchFilter.filterName = 'trivial';

var reverseFilter = function trivialReferseFilter(context) {
  if (typeof context.delta === 'undefined') {
    context.setResult(context.delta).exit();
    return;
  }
  context.nested = !isArray$1(context.delta);
  if (context.nested) {
    return;
  }
  if (context.delta.length === 1) {
    context.setResult([context.delta[0], 0, 0]).exit();
    return;
  }
  if (context.delta.length === 2) {
    context.setResult([context.delta[1], context.delta[0]]).exit();
    return;
  }
  if (context.delta.length === 3 && context.delta[2] === 0) {
    context.setResult([context.delta[0]]).exit();
  }
};
reverseFilter.filterName = 'trivial';

function collectChildrenDiffFilter(context) {
  if (!context || !context.children) {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  var result = context.result;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (typeof child.result === 'undefined') {
      continue;
    }
    result = result || {};
    result[child.childName] = child.result;
  }
  if (result && context.leftIsArray) {
    result._t = 'a';
  }
  context.setResult(result).exit();
}
collectChildrenDiffFilter.filterName = 'collectChildren';

function objectsDiffFilter(context) {
  if (context.leftIsArray || context.leftType !== 'object') {
    return;
  }

  var name = void 0;
  var child = void 0;
  var propertyFilter = context.options.propertyFilter;
  for (name in context.left) {
    if (!Object.prototype.hasOwnProperty.call(context.left, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    child = new DiffContext(context.left[name], context.right[name]);
    context.push(child, name);
  }
  for (name in context.right) {
    if (!Object.prototype.hasOwnProperty.call(context.right, name)) {
      continue;
    }
    if (propertyFilter && !propertyFilter(name, context)) {
      continue;
    }
    if (typeof context.left[name] === 'undefined') {
      child = new DiffContext(undefined, context.right[name]);
      context.push(child, name);
    }
  }

  if (!context.children || context.children.length === 0) {
    context.setResult(undefined).exit();
    return;
  }
  context.exit();
}
objectsDiffFilter.filterName = 'objects';

var patchFilter$1 = function nestedPatchFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var name = void 0;
  var child = void 0;
  for (name in context.delta) {
    child = new PatchContext(context.left[name], context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
patchFilter$1.filterName = 'objects';

var collectChildrenPatchFilter = function collectChildrenPatchFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (Object.prototype.hasOwnProperty.call(context.left, child.childName) && child.result === undefined) {
      delete context.left[child.childName];
    } else if (context.left[child.childName] !== child.result) {
      context.left[child.childName] = child.result;
    }
  }
  context.setResult(context.left).exit();
};
collectChildrenPatchFilter.filterName = 'collectChildren';

var reverseFilter$1 = function nestedReverseFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var name = void 0;
  var child = void 0;
  for (name in context.delta) {
    child = new ReverseContext(context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter$1.filterName = 'objects';

function collectChildrenReverseFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t) {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  var delta = {};
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    if (delta[child.childName] !== child.result) {
      delta[child.childName] = child.result;
    }
  }
  context.setResult(delta).exit();
}
collectChildrenReverseFilter.filterName = 'collectChildren';

/*

LCS implementation that supports arrays or strings

reference: http://en.wikipedia.org/wiki/Longest_common_subsequence_problem

*/

var defaultMatch = function defaultMatch(array1, array2, index1, index2) {
  return array1[index1] === array2[index2];
};

var lengthMatrix = function lengthMatrix(array1, array2, match, context) {
  var len1 = array1.length;
  var len2 = array2.length;
  var x = void 0,
      y = void 0;

  // initialize empty matrix of len1+1 x len2+1
  var matrix = [len1 + 1];
  for (x = 0; x < len1 + 1; x++) {
    matrix[x] = [len2 + 1];
    for (y = 0; y < len2 + 1; y++) {
      matrix[x][y] = 0;
    }
  }
  matrix.match = match;
  // save sequence lengths for each coordinate
  for (x = 1; x < len1 + 1; x++) {
    for (y = 1; y < len2 + 1; y++) {
      if (match(array1, array2, x - 1, y - 1, context)) {
        matrix[x][y] = matrix[x - 1][y - 1] + 1;
      } else {
        matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
      }
    }
  }
  return matrix;
};

var backtrack = function backtrack(matrix, array1, array2, context) {
  var index1 = array1.length;
  var index2 = array2.length;
  var subsequence = {
    sequence: [],
    indices1: [],
    indices2: []
  };

  while (index1 !== 0 && index2 !== 0) {
    var sameLetter = matrix.match(array1, array2, index1 - 1, index2 - 1, context);
    if (sameLetter) {
      subsequence.sequence.unshift(array1[index1 - 1]);
      subsequence.indices1.unshift(index1 - 1);
      subsequence.indices2.unshift(index2 - 1);
      --index1;
      --index2;
    } else {
      var valueAtMatrixAbove = matrix[index1][index2 - 1];
      var valueAtMatrixLeft = matrix[index1 - 1][index2];
      if (valueAtMatrixAbove > valueAtMatrixLeft) {
        --index2;
      } else {
        --index1;
      }
    }
  }
  return subsequence;
};

var get$1 = function get(array1, array2, match, context) {
  var innerContext = context || {};
  var matrix = lengthMatrix(array1, array2, match || defaultMatch, innerContext);
  var result = backtrack(matrix, array1, array2, innerContext);
  if (typeof array1 === 'string' && typeof array2 === 'string') {
    result.sequence = result.sequence.join('');
  }
  return result;
};

var lcs = {
  get: get$1
};

var ARRAY_MOVE = 3;

var isArray$2 = typeof Array.isArray === 'function' ? Array.isArray : function (a) {
  return a instanceof Array;
};

var arrayIndexOf = typeof Array.prototype.indexOf === 'function' ? function (array, item) {
  return array.indexOf(item);
} : function (array, item) {
  var length = array.length;
  for (var i = 0; i < length; i++) {
    if (array[i] === item) {
      return i;
    }
  }
  return -1;
};

function arraysHaveMatchByRef(array1, array2, len1, len2) {
  for (var index1 = 0; index1 < len1; index1++) {
    var val1 = array1[index1];
    for (var index2 = 0; index2 < len2; index2++) {
      var val2 = array2[index2];
      if (index1 !== index2 && val1 === val2) {
        return true;
      }
    }
  }
}

function matchItems(array1, array2, index1, index2, context) {
  var value1 = array1[index1];
  var value2 = array2[index2];
  if (value1 === value2) {
    return true;
  }
  if ((typeof value1 === 'undefined' ? 'undefined' : _typeof(value1)) !== 'object' || (typeof value2 === 'undefined' ? 'undefined' : _typeof(value2)) !== 'object') {
    return false;
  }
  var objectHash = context.objectHash;
  if (!objectHash) {
    // no way to match objects was provided, try match by position
    return context.matchByPosition && index1 === index2;
  }
  var hash1 = void 0;
  var hash2 = void 0;
  if (typeof index1 === 'number') {
    context.hashCache1 = context.hashCache1 || [];
    hash1 = context.hashCache1[index1];
    if (typeof hash1 === 'undefined') {
      context.hashCache1[index1] = hash1 = objectHash(value1, index1);
    }
  } else {
    hash1 = objectHash(value1);
  }
  if (typeof hash1 === 'undefined') {
    return false;
  }
  if (typeof index2 === 'number') {
    context.hashCache2 = context.hashCache2 || [];
    hash2 = context.hashCache2[index2];
    if (typeof hash2 === 'undefined') {
      context.hashCache2[index2] = hash2 = objectHash(value2, index2);
    }
  } else {
    hash2 = objectHash(value2);
  }
  if (typeof hash2 === 'undefined') {
    return false;
  }
  return hash1 === hash2;
}

var diffFilter$1 = function arraysDiffFilter(context) {
  if (!context.leftIsArray) {
    return;
  }

  var matchContext = {
    objectHash: context.options && context.options.objectHash,
    matchByPosition: context.options && context.options.matchByPosition
  };
  var commonHead = 0;
  var commonTail = 0;
  var index = void 0;
  var index1 = void 0;
  var index2 = void 0;
  var array1 = context.left;
  var array2 = context.right;
  var len1 = array1.length;
  var len2 = array2.length;

  var child = void 0;

  if (len1 > 0 && len2 > 0 && !matchContext.objectHash && typeof matchContext.matchByPosition !== 'boolean') {
    matchContext.matchByPosition = !arraysHaveMatchByRef(array1, array2, len1, len2);
  }

  // separate common head
  while (commonHead < len1 && commonHead < len2 && matchItems(array1, array2, commonHead, commonHead, matchContext)) {
    index = commonHead;
    child = new DiffContext(context.left[index], context.right[index]);
    context.push(child, index);
    commonHead++;
  }
  // separate common tail
  while (commonTail + commonHead < len1 && commonTail + commonHead < len2 && matchItems(array1, array2, len1 - 1 - commonTail, len2 - 1 - commonTail, matchContext)) {
    index1 = len1 - 1 - commonTail;
    index2 = len2 - 1 - commonTail;
    child = new DiffContext(context.left[index1], context.right[index2]);
    context.push(child, index2);
    commonTail++;
  }
  var result = void 0;
  if (commonHead + commonTail === len1) {
    if (len1 === len2) {
      // arrays are identical
      context.setResult(undefined).exit();
      return;
    }
    // trivial case, a block (1 or more consecutive items) was added
    result = result || {
      _t: 'a'
    };
    for (index = commonHead; index < len2 - commonTail; index++) {
      result[index] = [array2[index]];
    }
    context.setResult(result).exit();
    return;
  }
  if (commonHead + commonTail === len2) {
    // trivial case, a block (1 or more consecutive items) was removed
    result = result || {
      _t: 'a'
    };
    for (index = commonHead; index < len1 - commonTail; index++) {
      result['_' + index] = [array1[index], 0, 0];
    }
    context.setResult(result).exit();
    return;
  }
  // reset hash cache
  delete matchContext.hashCache1;
  delete matchContext.hashCache2;

  // diff is not trivial, find the LCS (Longest Common Subsequence)
  var trimmed1 = array1.slice(commonHead, len1 - commonTail);
  var trimmed2 = array2.slice(commonHead, len2 - commonTail);
  var seq = lcs.get(trimmed1, trimmed2, matchItems, matchContext);
  var removedItems = [];
  result = result || {
    _t: 'a'
  };
  for (index = commonHead; index < len1 - commonTail; index++) {
    if (arrayIndexOf(seq.indices1, index - commonHead) < 0) {
      // removed
      result['_' + index] = [array1[index], 0, 0];
      removedItems.push(index);
    }
  }

  var detectMove = true;
  if (context.options && context.options.arrays && context.options.arrays.detectMove === false) {
    detectMove = false;
  }
  var includeValueOnMove = false;
  if (context.options && context.options.arrays && context.options.arrays.includeValueOnMove) {
    includeValueOnMove = true;
  }

  var removedItemsLength = removedItems.length;
  for (index = commonHead; index < len2 - commonTail; index++) {
    var indexOnArray2 = arrayIndexOf(seq.indices2, index - commonHead);
    if (indexOnArray2 < 0) {
      // added, try to match with a removed item and register as position move
      var isMove = false;
      if (detectMove && removedItemsLength > 0) {
        for (var removeItemIndex1 = 0; removeItemIndex1 < removedItemsLength; removeItemIndex1++) {
          index1 = removedItems[removeItemIndex1];
          if (matchItems(trimmed1, trimmed2, index1 - commonHead, index - commonHead, matchContext)) {
            // store position move as: [originalValue, newPosition, ARRAY_MOVE]
            result['_' + index1].splice(1, 2, index, ARRAY_MOVE);
            if (!includeValueOnMove) {
              // don't include moved value on diff, to save bytes
              result['_' + index1][0] = '';
            }

            index2 = index;
            child = new DiffContext(context.left[index1], context.right[index2]);
            context.push(child, index2);
            removedItems.splice(removeItemIndex1, 1);
            isMove = true;
            break;
          }
        }
      }
      if (!isMove) {
        // added
        result[index] = [array2[index]];
      }
    } else {
      // match, do inner diff
      index1 = seq.indices1[indexOnArray2] + commonHead;
      index2 = seq.indices2[indexOnArray2] + commonHead;
      child = new DiffContext(context.left[index1], context.right[index2]);
      context.push(child, index2);
    }
  }

  context.setResult(result).exit();
};
diffFilter$1.filterName = 'arrays';

var compare = {
  numerically: function numerically(a, b) {
    return a - b;
  },
  numericallyBy: function numericallyBy(name) {
    return function (a, b) {
      return a[name] - b[name];
    };
  }
};

var patchFilter$2 = function nestedPatchFilter(context) {
  if (!context.nested) {
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var index = void 0;
  var index1 = void 0;

  var delta = context.delta;
  var array = context.left;

  // first, separate removals, insertions and modifications
  var toRemove = [];
  var toInsert = [];
  var toModify = [];
  for (index in delta) {
    if (index !== '_t') {
      if (index[0] === '_') {
        // removed item from original array
        if (delta[index][2] === 0 || delta[index][2] === ARRAY_MOVE) {
          toRemove.push(parseInt(index.slice(1), 10));
        } else {
          throw new Error('only removal or move can be applied at original array indices,' + (' invalid diff type: ' + delta[index][2]));
        }
      } else {
        if (delta[index].length === 1) {
          // added item at new array
          toInsert.push({
            index: parseInt(index, 10),
            value: delta[index][0]
          });
        } else {
          // modified item at new array
          toModify.push({
            index: parseInt(index, 10),
            delta: delta[index]
          });
        }
      }
    }
  }

  // remove items, in reverse order to avoid sawing our own floor
  toRemove = toRemove.sort(compare.numerically);
  for (index = toRemove.length - 1; index >= 0; index--) {
    index1 = toRemove[index];
    var indexDiff = delta['_' + index1];
    var removedValue = array.splice(index1, 1)[0];
    if (indexDiff[2] === ARRAY_MOVE) {
      // reinsert later
      toInsert.push({
        index: indexDiff[1],
        value: removedValue
      });
    }
  }

  // insert items, in reverse order to avoid moving our own floor
  toInsert = toInsert.sort(compare.numericallyBy('index'));
  var toInsertLength = toInsert.length;
  for (index = 0; index < toInsertLength; index++) {
    var insertion = toInsert[index];
    array.splice(insertion.index, 0, insertion.value);
  }

  // apply modifications
  var toModifyLength = toModify.length;
  var child = void 0;
  if (toModifyLength > 0) {
    for (index = 0; index < toModifyLength; index++) {
      var modification = toModify[index];
      child = new PatchContext(context.left[modification.index], modification.delta);
      context.push(child, modification.index);
    }
  }

  if (!context.children) {
    context.setResult(context.left).exit();
    return;
  }
  context.exit();
};
patchFilter$2.filterName = 'arrays';

var collectChildrenPatchFilter$1 = function collectChildrenPatchFilter(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  for (var index = 0; index < length; index++) {
    child = context.children[index];
    context.left[child.childName] = child.result;
  }
  context.setResult(context.left).exit();
};
collectChildrenPatchFilter$1.filterName = 'arraysCollectChildren';

var reverseFilter$2 = function arraysReverseFilter(context) {
  if (!context.nested) {
    if (context.delta[2] === ARRAY_MOVE) {
      context.newName = '_' + context.delta[1];
      context.setResult([context.delta[0], parseInt(context.childName.substr(1), 10), ARRAY_MOVE]).exit();
    }
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var name = void 0;
  var child = void 0;
  for (name in context.delta) {
    if (name === '_t') {
      continue;
    }
    child = new ReverseContext(context.delta[name]);
    context.push(child, name);
  }
  context.exit();
};
reverseFilter$2.filterName = 'arrays';

var reverseArrayDeltaIndex = function reverseArrayDeltaIndex(delta, index, itemDelta) {
  if (typeof index === 'string' && index[0] === '_') {
    return parseInt(index.substr(1), 10);
  } else if (isArray$2(itemDelta) && itemDelta[2] === 0) {
    return '_' + index;
  }

  var reverseIndex = +index;
  for (var deltaIndex in delta) {
    var deltaItem = delta[deltaIndex];
    if (isArray$2(deltaItem)) {
      if (deltaItem[2] === ARRAY_MOVE) {
        var moveFromIndex = parseInt(deltaIndex.substr(1), 10);
        var moveToIndex = deltaItem[1];
        if (moveToIndex === +index) {
          return moveFromIndex;
        }
        if (moveFromIndex <= reverseIndex && moveToIndex > reverseIndex) {
          reverseIndex++;
        } else if (moveFromIndex >= reverseIndex && moveToIndex < reverseIndex) {
          reverseIndex--;
        }
      } else if (deltaItem[2] === 0) {
        var deleteIndex = parseInt(deltaIndex.substr(1), 10);
        if (deleteIndex <= reverseIndex) {
          reverseIndex++;
        }
      } else if (deltaItem.length === 1 && deltaIndex <= reverseIndex) {
        reverseIndex--;
      }
    }
  }

  return reverseIndex;
};

function collectChildrenReverseFilter$1(context) {
  if (!context || !context.children) {
    return;
  }
  if (context.delta._t !== 'a') {
    return;
  }
  var length = context.children.length;
  var child = void 0;
  var delta = {
    _t: 'a'
  };

  for (var index = 0; index < length; index++) {
    child = context.children[index];
    var name = child.newName;
    if (typeof name === 'undefined') {
      name = reverseArrayDeltaIndex(context.delta, child.childName, child.result);
    }
    if (delta[name] !== child.result) {
      delta[name] = child.result;
    }
  }
  context.setResult(delta).exit();
}
collectChildrenReverseFilter$1.filterName = 'arraysCollectChildren';

var diffFilter$2 = function datesDiffFilter(context) {
  if (context.left instanceof Date) {
    if (context.right instanceof Date) {
      if (context.left.getTime() !== context.right.getTime()) {
        context.setResult([context.left, context.right]);
      } else {
        context.setResult(undefined);
      }
    } else {
      context.setResult([context.left, context.right]);
    }
    context.exit();
  } else if (context.right instanceof Date) {
    context.setResult([context.left, context.right]).exit();
  }
};
diffFilter$2.filterName = 'dates';

/* global diff_match_patch */
var TEXT_DIFF = 2;
var DEFAULT_MIN_LENGTH = 60;
var cachedDiffPatch = null;

var getDiffMatchPatch = function getDiffMatchPatch(required) {
  /* jshint camelcase: false */

  if (!cachedDiffPatch) {
    var instance = void 0;
    /* eslint-disable camelcase, new-cap */
    if (typeof diff_match_patch !== 'undefined') {
      // already loaded, probably a browser
      instance = typeof diff_match_patch === 'function' ? new diff_match_patch() : new diff_match_patch.diff_match_patch();
    } else if (diff_match_patch__WEBPACK_IMPORTED_MODULE_0___default.a) {
      try {
        instance = diff_match_patch__WEBPACK_IMPORTED_MODULE_0___default.a && new diff_match_patch__WEBPACK_IMPORTED_MODULE_0___default.a();
      } catch (err) {
        instance = null;
      }
    }
    /* eslint-enable camelcase, new-cap */
    if (!instance) {
      if (!required) {
        return null;
      }
      var error = new Error('text diff_match_patch library not found');
      // eslint-disable-next-line camelcase
      error.diff_match_patch_not_found = true;
      throw error;
    }
    cachedDiffPatch = {
      diff: function diff(txt1, txt2) {
        return instance.patch_toText(instance.patch_make(txt1, txt2));
      },
      patch: function patch(txt1, _patch) {
        var results = instance.patch_apply(instance.patch_fromText(_patch), txt1);
        for (var i = 0; i < results[1].length; i++) {
          if (!results[1][i]) {
            var _error = new Error('text patch failed');
            _error.textPatchFailed = true;
          }
        }
        return results[0];
      }
    };
  }
  return cachedDiffPatch;
};

var diffFilter$3 = function textsDiffFilter(context) {
  if (context.leftType !== 'string') {
    return;
  }
  var minLength = context.options && context.options.textDiff && context.options.textDiff.minLength || DEFAULT_MIN_LENGTH;
  if (context.left.length < minLength || context.right.length < minLength) {
    context.setResult([context.left, context.right]).exit();
    return;
  }
  // large text, try to use a text-diff algorithm
  var diffMatchPatch = getDiffMatchPatch();
  if (!diffMatchPatch) {
    // diff-match-patch library not available,
    // fallback to regular string replace
    context.setResult([context.left, context.right]).exit();
    return;
  }
  var diff = diffMatchPatch.diff;
  context.setResult([diff(context.left, context.right), 0, TEXT_DIFF]).exit();
};
diffFilter$3.filterName = 'texts';

var patchFilter$3 = function textsPatchFilter(context) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }

  // text-diff, use a text-patch algorithm
  var patch = getDiffMatchPatch(true).patch;
  context.setResult(patch(context.left, context.delta[0])).exit();
};
patchFilter$3.filterName = 'texts';

var textDeltaReverse = function textDeltaReverse(delta) {
  var i = void 0;
  var l = void 0;
  var lines = void 0;
  var line = void 0;
  var lineTmp = void 0;
  var header = null;
  var headerRegex = /^@@ +-(\d+),(\d+) +\+(\d+),(\d+) +@@$/;
  var lineHeader = void 0;
  lines = delta.split('\n');
  for (i = 0, l = lines.length; i < l; i++) {
    line = lines[i];
    var lineStart = line.slice(0, 1);
    if (lineStart === '@') {
      header = headerRegex.exec(line);
      lineHeader = i;

      // fix header
      lines[lineHeader] = '@@ -' + header[3] + ',' + header[4] + ' +' + header[1] + ',' + header[2] + ' @@';
    } else if (lineStart === '+') {
      lines[i] = '-' + lines[i].slice(1);
      if (lines[i - 1].slice(0, 1) === '+') {
        // swap lines to keep default order (-+)
        lineTmp = lines[i];
        lines[i] = lines[i - 1];
        lines[i - 1] = lineTmp;
      }
    } else if (lineStart === '-') {
      lines[i] = '+' + lines[i].slice(1);
    }
  }
  return lines.join('\n');
};

var reverseFilter$3 = function textsReverseFilter(context) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }

  // text-diff, use a text-diff algorithm
  context.setResult([textDeltaReverse(context.delta[0]), 0, TEXT_DIFF]).exit();
};
reverseFilter$3.filterName = 'texts';

var DiffPatcher = function () {
  function DiffPatcher(options) {
    classCallCheck(this, DiffPatcher);

    this.processor = new Processor(options);
    this.processor.pipe(new Pipe('diff').append(collectChildrenDiffFilter, diffFilter, diffFilter$2, diffFilter$3, objectsDiffFilter, diffFilter$1).shouldHaveResult());
    this.processor.pipe(new Pipe('patch').append(collectChildrenPatchFilter, collectChildrenPatchFilter$1, patchFilter, patchFilter$3, patchFilter$1, patchFilter$2).shouldHaveResult());
    this.processor.pipe(new Pipe('reverse').append(collectChildrenReverseFilter, collectChildrenReverseFilter$1, reverseFilter, reverseFilter$3, reverseFilter$1, reverseFilter$2).shouldHaveResult());
  }

  createClass(DiffPatcher, [{
    key: 'options',
    value: function options() {
      var _processor;

      return (_processor = this.processor).options.apply(_processor, arguments);
    }
  }, {
    key: 'diff',
    value: function diff(left, right) {
      return this.processor.process(new DiffContext(left, right));
    }
  }, {
    key: 'patch',
    value: function patch(left, delta) {
      return this.processor.process(new PatchContext(left, delta));
    }
  }, {
    key: 'reverse',
    value: function reverse(delta) {
      return this.processor.process(new ReverseContext(delta));
    }
  }, {
    key: 'unpatch',
    value: function unpatch(right, delta) {
      return this.patch(right, this.reverse(delta));
    }
  }, {
    key: 'clone',
    value: function clone$$1(value) {
      return clone(value);
    }
  }]);
  return DiffPatcher;
}();

var isArray$3 = typeof Array.isArray === 'function' ? Array.isArray : function (a) {
  return a instanceof Array;
};

var getObjectKeys = typeof Object.keys === 'function' ? function (obj) {
  return Object.keys(obj);
} : function (obj) {
  var names = [];
  for (var property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      names.push(property);
    }
  }
  return names;
};

var trimUnderscore = function trimUnderscore(str) {
  if (str.substr(0, 1) === '_') {
    return str.slice(1);
  }
  return str;
};

var arrayKeyToSortNumber = function arrayKeyToSortNumber(key) {
  if (key === '_t') {
    return -1;
  } else {
    if (key.substr(0, 1) === '_') {
      return parseInt(key.slice(1), 10);
    } else {
      return parseInt(key, 10) + 0.1;
    }
  }
};

var arrayKeyComparer = function arrayKeyComparer(key1, key2) {
  return arrayKeyToSortNumber(key1) - arrayKeyToSortNumber(key2);
};

var BaseFormatter = function () {
  function BaseFormatter() {
    classCallCheck(this, BaseFormatter);
  }

  createClass(BaseFormatter, [{
    key: 'format',
    value: function format(delta, left) {
      var context = {};
      this.prepareContext(context);
      this.recurse(context, delta, left);
      return this.finalize(context);
    }
  }, {
    key: 'prepareContext',
    value: function prepareContext(context) {
      context.buffer = [];
      context.out = function () {
        var _buffer;

        (_buffer = this.buffer).push.apply(_buffer, arguments);
      };
    }
  }, {
    key: 'typeFormattterNotFound',
    value: function typeFormattterNotFound(context, deltaType) {
      throw new Error('cannot format delta type: ' + deltaType);
    }
  }, {
    key: 'typeFormattterErrorFormatter',
    value: function typeFormattterErrorFormatter(context, err) {
      return err.toString();
    }
  }, {
    key: 'finalize',
    value: function finalize(_ref) {
      var buffer = _ref.buffer;

      if (isArray$3(buffer)) {
        return buffer.join('');
      }
    }
  }, {
    key: 'recurse',
    value: function recurse(context, delta, left, key, leftKey, movedFrom, isLast) {
      var useMoveOriginHere = delta && movedFrom;
      var leftValue = useMoveOriginHere ? movedFrom.value : left;

      if (typeof delta === 'undefined' && typeof key === 'undefined') {
        return undefined;
      }

      var type = this.getDeltaType(delta, movedFrom);
      var nodeType = type === 'node' ? delta._t === 'a' ? 'array' : 'object' : '';

      if (typeof key !== 'undefined') {
        this.nodeBegin(context, key, leftKey, type, nodeType, isLast);
      } else {
        this.rootBegin(context, type, nodeType);
      }

      var typeFormattter = void 0;
      try {
        typeFormattter = this['format_' + type] || this.typeFormattterNotFound(context, type);
        typeFormattter.call(this, context, delta, leftValue, key, leftKey, movedFrom);
      } catch (err) {
        this.typeFormattterErrorFormatter(context, err, delta, leftValue, key, leftKey, movedFrom);
        if (typeof console !== 'undefined' && console.error) {
          console.error(err.stack);
        }
      }

      if (typeof key !== 'undefined') {
        this.nodeEnd(context, key, leftKey, type, nodeType, isLast);
      } else {
        this.rootEnd(context, type, nodeType);
      }
    }
  }, {
    key: 'formatDeltaChildren',
    value: function formatDeltaChildren(context, delta, left) {
      var self = this;
      this.forEachDeltaKey(delta, left, function (key, leftKey, movedFrom, isLast) {
        self.recurse(context, delta[key], left ? left[leftKey] : undefined, key, leftKey, movedFrom, isLast);
      });
    }
  }, {
    key: 'forEachDeltaKey',
    value: function forEachDeltaKey(delta, left, fn) {
      var keys = getObjectKeys(delta);
      var arrayKeys = delta._t === 'a';
      var moveDestinations = {};
      var name = void 0;
      if (typeof left !== 'undefined') {
        for (name in left) {
          if (Object.prototype.hasOwnProperty.call(left, name)) {
            if (typeof delta[name] === 'undefined' && (!arrayKeys || typeof delta['_' + name] === 'undefined')) {
              keys.push(name);
            }
          }
        }
      }
      // look for move destinations
      for (name in delta) {
        if (Object.prototype.hasOwnProperty.call(delta, name)) {
          var value = delta[name];
          if (isArray$3(value) && value[2] === 3) {
            moveDestinations[value[1].toString()] = {
              key: name,
              value: left && left[parseInt(name.substr(1))]
            };
            if (this.includeMoveDestinations !== false) {
              if (typeof left === 'undefined' && typeof delta[value[1]] === 'undefined') {
                keys.push(value[1].toString());
              }
            }
          }
        }
      }
      if (arrayKeys) {
        keys.sort(arrayKeyComparer);
      } else {
        keys.sort();
      }
      for (var index = 0, length = keys.length; index < length; index++) {
        var key = keys[index];
        if (arrayKeys && key === '_t') {
          continue;
        }
        var leftKey = arrayKeys ? typeof key === 'number' ? key : parseInt(trimUnderscore(key), 10) : key;
        var isLast = index === length - 1;
        fn(key, leftKey, moveDestinations[leftKey], isLast);
      }
    }
  }, {
    key: 'getDeltaType',
    value: function getDeltaType(delta, movedFrom) {
      if (typeof delta === 'undefined') {
        if (typeof movedFrom !== 'undefined') {
          return 'movedestination';
        }
        return 'unchanged';
      }
      if (isArray$3(delta)) {
        if (delta.length === 1) {
          return 'added';
        }
        if (delta.length === 2) {
          return 'modified';
        }
        if (delta.length === 3 && delta[2] === 0) {
          return 'deleted';
        }
        if (delta.length === 3 && delta[2] === 2) {
          return 'textdiff';
        }
        if (delta.length === 3 && delta[2] === 3) {
          return 'moved';
        }
      } else if ((typeof delta === 'undefined' ? 'undefined' : _typeof(delta)) === 'object') {
        return 'node';
      }
      return 'unknown';
    }
  }, {
    key: 'parseTextDiff',
    value: function parseTextDiff(value) {
      var output = [];
      var lines = value.split('\n@@ ');
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        var lineOutput = {
          pieces: []
        };
        var location = /^(?:@@ )?[-+]?(\d+),(\d+)/.exec(line).slice(1);
        lineOutput.location = {
          line: location[0],
          chr: location[1]
        };
        var pieces = line.split('\n').slice(1);
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          if (!piece.length) {
            continue;
          }
          var pieceOutput = {
            type: 'context'
          };
          if (piece.substr(0, 1) === '+') {
            pieceOutput.type = 'added';
          } else if (piece.substr(0, 1) === '-') {
            pieceOutput.type = 'deleted';
          }
          pieceOutput.text = piece.slice(1);
          lineOutput.pieces.push(pieceOutput);
        }
        output.push(lineOutput);
      }
      return output;
    }
  }]);
  return BaseFormatter;
}();



var base = Object.freeze({
	default: BaseFormatter
});

var HtmlFormatter = function (_BaseFormatter) {
  inherits(HtmlFormatter, _BaseFormatter);

  function HtmlFormatter() {
    classCallCheck(this, HtmlFormatter);
    return possibleConstructorReturn(this, (HtmlFormatter.__proto__ || Object.getPrototypeOf(HtmlFormatter)).apply(this, arguments));
  }

  createClass(HtmlFormatter, [{
    key: 'typeFormattterErrorFormatter',
    value: function typeFormattterErrorFormatter(context, err) {
      context.out('<pre class="jsondiffpatch-error">' + err + '</pre>');
    }
  }, {
    key: 'formatValue',
    value: function formatValue(context, value) {
      context.out('<pre>' + htmlEscape(JSON.stringify(value, null, 2)) + '</pre>');
    }
  }, {
    key: 'formatTextDiffString',
    value: function formatTextDiffString(context, value) {
      var lines = this.parseTextDiff(value);
      context.out('<ul class="jsondiffpatch-textdiff">');
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        context.out('<li><div class="jsondiffpatch-textdiff-location">' + ('<span class="jsondiffpatch-textdiff-line-number">' + line.location.line + '</span><span class="jsondiffpatch-textdiff-char">' + line.location.chr + '</span></div><div class="jsondiffpatch-textdiff-line">'));
        var pieces = line.pieces;
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          /* global decodeURI */
          var piece = pieces[pieceIndex];
          context.out('<span class="jsondiffpatch-textdiff-' + piece.type + '">' + htmlEscape(decodeURI(piece.text)) + '</span>');
        }
        context.out('</div></li>');
      }
      context.out('</ul>');
    }
  }, {
    key: 'rootBegin',
    value: function rootBegin(context, type, nodeType) {
      var nodeClass = 'jsondiffpatch-' + type + (nodeType ? ' jsondiffpatch-child-node-type-' + nodeType : '');
      context.out('<div class="jsondiffpatch-delta ' + nodeClass + '">');
    }
  }, {
    key: 'rootEnd',
    value: function rootEnd(context) {
      context.out('</div>' + (context.hasArrows ? '<script type="text/javascript">setTimeout(' + (adjustArrows.toString() + ',10);</script>') : ''));
    }
  }, {
    key: 'nodeBegin',
    value: function nodeBegin(context, key, leftKey, type, nodeType) {
      var nodeClass = 'jsondiffpatch-' + type + (nodeType ? ' jsondiffpatch-child-node-type-' + nodeType : '');
      context.out('<li class="' + nodeClass + '" data-key="' + leftKey + '">' + ('<div class="jsondiffpatch-property-name">' + leftKey + '</div>'));
    }
  }, {
    key: 'nodeEnd',
    value: function nodeEnd(context) {
      context.out('</li>');
    }

    /* jshint camelcase: false */
    /* eslint-disable camelcase */

  }, {
    key: 'format_unchanged',
    value: function format_unchanged(context, delta, left) {
      if (typeof left === 'undefined') {
        return;
      }
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, left);
      context.out('</div>');
    }
  }, {
    key: 'format_movedestination',
    value: function format_movedestination(context, delta, left) {
      if (typeof left === 'undefined') {
        return;
      }
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, left);
      context.out('</div>');
    }
  }, {
    key: 'format_node',
    value: function format_node(context, delta, left) {
      // recurse
      var nodeType = delta._t === 'a' ? 'array' : 'object';
      context.out('<ul class="jsondiffpatch-node jsondiffpatch-node-type-' + nodeType + '">');
      this.formatDeltaChildren(context, delta, left);
      context.out('</ul>');
    }
  }, {
    key: 'format_added',
    value: function format_added(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, delta[0]);
      context.out('</div>');
    }
  }, {
    key: 'format_modified',
    value: function format_modified(context, delta) {
      context.out('<div class="jsondiffpatch-value jsondiffpatch-left-value">');
      this.formatValue(context, delta[0]);
      context.out('</div>' + '<div class="jsondiffpatch-value jsondiffpatch-right-value">');
      this.formatValue(context, delta[1]);
      context.out('</div>');
    }
  }, {
    key: 'format_deleted',
    value: function format_deleted(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, delta[0]);
      context.out('</div>');
    }
  }, {
    key: 'format_moved',
    value: function format_moved(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatValue(context, delta[0]);
      context.out('</div><div class="jsondiffpatch-moved-destination">' + delta[1] + '</div>');

      // draw an SVG arrow from here to move destination
      context.out(
      /* jshint multistr: true */
      '<div class="jsondiffpatch-arrow" ' + 'style="position: relative; left: -34px;">\n          <svg width="30" height="60" ' + 'style="position: absolute; display: none;">\n          <defs>\n              <marker id="markerArrow" markerWidth="8" markerHeight="8"\n                 refx="2" refy="4"\n                     orient="auto" markerUnits="userSpaceOnUse">\n                  <path d="M1,1 L1,7 L7,4 L1,1" style="fill: #339;" />\n              </marker>\n          </defs>\n          <path d="M30,0 Q-10,25 26,50"\n            style="stroke: #88f; stroke-width: 2px; fill: none; ' + 'stroke-opacity: 0.5; marker-end: url(#markerArrow);"\n          ></path>\n          </svg>\n      </div>');
      context.hasArrows = true;
    }
  }, {
    key: 'format_textdiff',
    value: function format_textdiff(context, delta) {
      context.out('<div class="jsondiffpatch-value">');
      this.formatTextDiffString(context, delta[0]);
      context.out('</div>');
    }
  }]);
  return HtmlFormatter;
}(BaseFormatter);

function htmlEscape(text) {
  var html = text;
  var replacements = [[/&/g, '&amp;'], [/</g, '&lt;'], [/>/g, '&gt;'], [/'/g, '&apos;'], [/"/g, '&quot;']];
  for (var i = 0; i < replacements.length; i++) {
    html = html.replace(replacements[i][0], replacements[i][1]);
  }
  return html;
}

var adjustArrows = function jsondiffpatchHtmlFormatterAdjustArrows(nodeArg) {
  var node = nodeArg || document;
  var getElementText = function getElementText(_ref) {
    var textContent = _ref.textContent,
        innerText = _ref.innerText;
    return textContent || innerText;
  };
  var eachByQuery = function eachByQuery(el, query, fn) {
    var elems = el.querySelectorAll(query);
    for (var i = 0, l = elems.length; i < l; i++) {
      fn(elems[i]);
    }
  };
  var eachChildren = function eachChildren(_ref2, fn) {
    var children = _ref2.children;

    for (var i = 0, l = children.length; i < l; i++) {
      fn(children[i], i);
    }
  };
  eachByQuery(node, '.jsondiffpatch-arrow', function (_ref3) {
    var parentNode = _ref3.parentNode,
        children = _ref3.children,
        style = _ref3.style;

    var arrowParent = parentNode;
    var svg = children[0];
    var path = svg.children[1];
    svg.style.display = 'none';
    var destination = getElementText(arrowParent.querySelector('.jsondiffpatch-moved-destination'));
    var container = arrowParent.parentNode;
    var destinationElem = void 0;
    eachChildren(container, function (child) {
      if (child.getAttribute('data-key') === destination) {
        destinationElem = child;
      }
    });
    if (!destinationElem) {
      return;
    }
    try {
      var distance = destinationElem.offsetTop - arrowParent.offsetTop;
      svg.setAttribute('height', Math.abs(distance) + 6);
      style.top = -8 + (distance > 0 ? 0 : distance) + 'px';
      var curve = distance > 0 ? 'M30,0 Q-10,' + Math.round(distance / 2) + ' 26,' + (distance - 4) : 'M30,' + -distance + ' Q-10,' + Math.round(-distance / 2) + ' 26,4';
      path.setAttribute('d', curve);
      svg.style.display = '';
    } catch (err) {}
  });
};

/* jshint camelcase: true */
/* eslint-enable camelcase */

var showUnchanged = function showUnchanged(show, node, delay) {
  var el = node || document.body;
  var prefix = 'jsondiffpatch-unchanged-';
  var classes = {
    showing: prefix + 'showing',
    hiding: prefix + 'hiding',
    visible: prefix + 'visible',
    hidden: prefix + 'hidden'
  };
  var list = el.classList;
  if (!list) {
    return;
  }
  if (!delay) {
    list.remove(classes.showing);
    list.remove(classes.hiding);
    list.remove(classes.visible);
    list.remove(classes.hidden);
    if (show === false) {
      list.add(classes.hidden);
    }
    return;
  }
  if (show === false) {
    list.remove(classes.showing);
    list.add(classes.visible);
    setTimeout(function () {
      list.add(classes.hiding);
    }, 10);
  } else {
    list.remove(classes.hiding);
    list.add(classes.showing);
    list.remove(classes.hidden);
  }
  var intervalId = setInterval(function () {
    adjustArrows(el);
  }, 100);
  setTimeout(function () {
    list.remove(classes.showing);
    list.remove(classes.hiding);
    if (show === false) {
      list.add(classes.hidden);
      list.remove(classes.visible);
    } else {
      list.add(classes.visible);
      list.remove(classes.hidden);
    }
    setTimeout(function () {
      list.remove(classes.visible);
      clearInterval(intervalId);
    }, delay + 400);
  }, delay);
};

var hideUnchanged = function hideUnchanged(node, delay) {
  return showUnchanged(false, node, delay);
};

var defaultInstance = void 0;

function format(delta, left) {
  if (!defaultInstance) {
    defaultInstance = new HtmlFormatter();
  }
  return defaultInstance.format(delta, left);
}



var html = Object.freeze({
	showUnchanged: showUnchanged,
	hideUnchanged: hideUnchanged,
	default: HtmlFormatter,
	format: format
});

var AnnotatedFormatter = function (_BaseFormatter) {
  inherits(AnnotatedFormatter, _BaseFormatter);

  function AnnotatedFormatter() {
    classCallCheck(this, AnnotatedFormatter);

    var _this = possibleConstructorReturn(this, (AnnotatedFormatter.__proto__ || Object.getPrototypeOf(AnnotatedFormatter)).call(this));

    _this.includeMoveDestinations = false;
    return _this;
  }

  createClass(AnnotatedFormatter, [{
    key: 'prepareContext',
    value: function prepareContext(context) {
      get(AnnotatedFormatter.prototype.__proto__ || Object.getPrototypeOf(AnnotatedFormatter.prototype), 'prepareContext', this).call(this, context);
      context.indent = function (levels) {
        this.indentLevel = (this.indentLevel || 0) + (typeof levels === 'undefined' ? 1 : levels);
        this.indentPad = new Array(this.indentLevel + 1).join('&nbsp;&nbsp;');
      };
      context.row = function (json, htmlNote) {
        context.out('<tr><td style="white-space: nowrap;">' + '<pre class="jsondiffpatch-annotated-indent"' + ' style="display: inline-block">');
        context.out(context.indentPad);
        context.out('</pre><pre style="display: inline-block">');
        context.out(json);
        context.out('</pre></td><td class="jsondiffpatch-delta-note"><div>');
        context.out(htmlNote);
        context.out('</div></td></tr>');
      };
    }
  }, {
    key: 'typeFormattterErrorFormatter',
    value: function typeFormattterErrorFormatter(context, err) {
      context.row('', '<pre class="jsondiffpatch-error">' + err + '</pre>');
    }
  }, {
    key: 'formatTextDiffString',
    value: function formatTextDiffString(context, value) {
      var lines = this.parseTextDiff(value);
      context.out('<ul class="jsondiffpatch-textdiff">');
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        context.out('<li><div class="jsondiffpatch-textdiff-location">' + ('<span class="jsondiffpatch-textdiff-line-number">' + line.location.line + '</span><span class="jsondiffpatch-textdiff-char">' + line.location.chr + '</span></div><div class="jsondiffpatch-textdiff-line">'));
        var pieces = line.pieces;
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          context.out('<span class="jsondiffpatch-textdiff-' + piece.type + '">' + piece.text + '</span>');
        }
        context.out('</div></li>');
      }
      context.out('</ul>');
    }
  }, {
    key: 'rootBegin',
    value: function rootBegin(context, type, nodeType) {
      context.out('<table class="jsondiffpatch-annotated-delta">');
      if (type === 'node') {
        context.row('{');
        context.indent();
      }
      if (nodeType === 'array') {
        context.row('"_t": "a",', 'Array delta (member names indicate array indices)');
      }
    }
  }, {
    key: 'rootEnd',
    value: function rootEnd(context, type) {
      if (type === 'node') {
        context.indent(-1);
        context.row('}');
      }
      context.out('</table>');
    }
  }, {
    key: 'nodeBegin',
    value: function nodeBegin(context, key, leftKey, type, nodeType) {
      context.row('&quot;' + key + '&quot;: {');
      if (type === 'node') {
        context.indent();
      }
      if (nodeType === 'array') {
        context.row('"_t": "a",', 'Array delta (member names indicate array indices)');
      }
    }
  }, {
    key: 'nodeEnd',
    value: function nodeEnd(context, key, leftKey, type, nodeType, isLast) {
      if (type === 'node') {
        context.indent(-1);
      }
      context.row('}' + (isLast ? '' : ','));
    }

    /* jshint camelcase: false */

    /* eslint-disable camelcase */

  }, {
    key: 'format_unchanged',
    value: function format_unchanged() {}
  }, {
    key: 'format_movedestination',
    value: function format_movedestination() {}
  }, {
    key: 'format_node',
    value: function format_node(context, delta, left) {
      // recurse
      this.formatDeltaChildren(context, delta, left);
    }
  }]);
  return AnnotatedFormatter;
}(BaseFormatter);

/* eslint-enable camelcase */

var wrapPropertyName = function wrapPropertyName(name) {
  return '<pre style="display:inline-block">&quot;' + name + '&quot;</pre>';
};

var deltaAnnotations = {
  added: function added(delta, left, key, leftKey) {
    var formatLegend = ' <pre>([newValue])</pre>';
    if (typeof leftKey === 'undefined') {
      return 'new value' + formatLegend;
    }
    if (typeof leftKey === 'number') {
      return 'insert at index ' + leftKey + formatLegend;
    }
    return 'add property ' + wrapPropertyName(leftKey) + formatLegend;
  },
  modified: function modified(delta, left, key, leftKey) {
    var formatLegend = ' <pre>([previousValue, newValue])</pre>';
    if (typeof leftKey === 'undefined') {
      return 'modify value' + formatLegend;
    }
    if (typeof leftKey === 'number') {
      return 'modify at index ' + leftKey + formatLegend;
    }
    return 'modify property ' + wrapPropertyName(leftKey) + formatLegend;
  },
  deleted: function deleted(delta, left, key, leftKey) {
    var formatLegend = ' <pre>([previousValue, 0, 0])</pre>';
    if (typeof leftKey === 'undefined') {
      return 'delete value' + formatLegend;
    }
    if (typeof leftKey === 'number') {
      return 'remove index ' + leftKey + formatLegend;
    }
    return 'delete property ' + wrapPropertyName(leftKey) + formatLegend;
  },
  moved: function moved(delta, left, key, leftKey) {
    return 'move from <span title="(position to remove at original state)">' + ('index ' + leftKey + '</span> to <span title="(position to insert at final') + (' state)">index ' + delta[1] + '</span>');
  },
  textdiff: function textdiff(delta, left, key, leftKey) {
    var location = typeof leftKey === 'undefined' ? '' : typeof leftKey === 'number' ? ' at index ' + leftKey : ' at property ' + wrapPropertyName(leftKey);
    return 'text diff' + location + ', format is <a href="https://code.google.com/' + 'p/google-diff-match-patch/wiki/Unidiff">a variation of Unidiff</a>';
  }
};

var formatAnyChange = function formatAnyChange(context, delta) {
  var deltaType = this.getDeltaType(delta);
  var annotator = deltaAnnotations[deltaType];
  var htmlNote = annotator && annotator.apply(annotator, Array.prototype.slice.call(arguments, 1));
  var json = JSON.stringify(delta, null, 2);
  if (deltaType === 'textdiff') {
    // split text diffs lines
    json = json.split('\\n').join('\\n"+\n   "');
  }
  context.indent();
  context.row(json, htmlNote);
  context.indent(-1);
};

/* eslint-disable camelcase */
AnnotatedFormatter.prototype.format_added = formatAnyChange;
AnnotatedFormatter.prototype.format_modified = formatAnyChange;
AnnotatedFormatter.prototype.format_deleted = formatAnyChange;
AnnotatedFormatter.prototype.format_moved = formatAnyChange;
AnnotatedFormatter.prototype.format_textdiff = formatAnyChange;
var defaultInstance$1 = void 0;

function format$1(delta, left) {
  if (!defaultInstance$1) {
    defaultInstance$1 = new AnnotatedFormatter();
  }
  return defaultInstance$1.format(delta, left);
}



var annotated = Object.freeze({
	default: AnnotatedFormatter,
	format: format$1
});

var OPERATIONS = {
  add: 'add',
  remove: 'remove',
  replace: 'replace',
  move: 'move'
};

var JSONFormatter = function (_BaseFormatter) {
  inherits(JSONFormatter, _BaseFormatter);

  function JSONFormatter() {
    classCallCheck(this, JSONFormatter);

    var _this = possibleConstructorReturn(this, (JSONFormatter.__proto__ || Object.getPrototypeOf(JSONFormatter)).call(this));

    _this.includeMoveDestinations = true;
    return _this;
  }

  createClass(JSONFormatter, [{
    key: 'prepareContext',
    value: function prepareContext(context) {
      get(JSONFormatter.prototype.__proto__ || Object.getPrototypeOf(JSONFormatter.prototype), 'prepareContext', this).call(this, context);
      context.result = [];
      context.path = [];
      context.pushCurrentOp = function (obj) {
        var op = obj.op,
            value = obj.value;

        var val = {
          op: op,
          path: this.currentPath()
        };
        if (typeof value !== 'undefined') {
          val.value = value;
        }
        this.result.push(val);
      };

      context.pushMoveOp = function (to) {
        var from = this.currentPath();
        this.result.push({
          op: OPERATIONS.move,
          from: from,
          path: this.toPath(to)
        });
      };

      context.currentPath = function () {
        return '/' + this.path.join('/');
      };

      context.toPath = function (toPath) {
        var to = this.path.slice();
        to[to.length - 1] = toPath;
        return '/' + to.join('/');
      };
    }
  }, {
    key: 'typeFormattterErrorFormatter',
    value: function typeFormattterErrorFormatter(context, err) {
      context.out('[ERROR] ' + err);
    }
  }, {
    key: 'rootBegin',
    value: function rootBegin() {}
  }, {
    key: 'rootEnd',
    value: function rootEnd() {}
  }, {
    key: 'nodeBegin',
    value: function nodeBegin(_ref, key, leftKey) {
      var path = _ref.path;

      path.push(leftKey);
    }
  }, {
    key: 'nodeEnd',
    value: function nodeEnd(_ref2) {
      var path = _ref2.path;

      path.pop();
    }

    /* jshint camelcase: false */
    /* eslint-disable camelcase */

  }, {
    key: 'format_unchanged',
    value: function format_unchanged() {}
  }, {
    key: 'format_movedestination',
    value: function format_movedestination() {}
  }, {
    key: 'format_node',
    value: function format_node(context, delta, left) {
      this.formatDeltaChildren(context, delta, left);
    }
  }, {
    key: 'format_added',
    value: function format_added(context, delta) {
      context.pushCurrentOp({ op: OPERATIONS.add, value: delta[0] });
    }
  }, {
    key: 'format_modified',
    value: function format_modified(context, delta) {
      context.pushCurrentOp({ op: OPERATIONS.replace, value: delta[1] });
    }
  }, {
    key: 'format_deleted',
    value: function format_deleted(context) {
      context.pushCurrentOp({ op: OPERATIONS.remove });
    }
  }, {
    key: 'format_moved',
    value: function format_moved(context, delta) {
      var to = delta[1];
      context.pushMoveOp(to);
    }
  }, {
    key: 'format_textdiff',
    value: function format_textdiff() {
      throw new Error('Not implemented');
    }
  }, {
    key: 'format',
    value: function format(delta, left) {
      var context = {};
      this.prepareContext(context);
      this.recurse(context, delta, left);
      return context.result;
    }
  }]);
  return JSONFormatter;
}(BaseFormatter);

var last = function last(arr) {
  return arr[arr.length - 1];
};

var sortBy = function sortBy(arr, pred) {
  arr.sort(pred);
  return arr;
};

var compareByIndexDesc = function compareByIndexDesc(indexA, indexB) {
  var lastA = parseInt(indexA, 10);
  var lastB = parseInt(indexB, 10);
  if (!(isNaN(lastA) || isNaN(lastB))) {
    return lastB - lastA;
  } else {
    return 0;
  }
};

var opsByDescendingOrder = function opsByDescendingOrder(removeOps) {
  return sortBy(removeOps, function (a, b) {
    var splitA = a.path.split('/');
    var splitB = b.path.split('/');
    if (splitA.length !== splitB.length) {
      return splitA.length - splitB.length;
    } else {
      return compareByIndexDesc(last(splitA), last(splitB));
    }
  });
};

var partitionOps = function partitionOps(arr, fns) {
  var initArr = Array(fns.length + 1).fill().map(function () {
    return [];
  });
  return arr.map(function (item) {
    var position = fns.map(function (fn) {
      return fn(item);
    }).indexOf(true);
    if (position < 0) {
      position = fns.length;
    }
    return { item: item, position: position };
  }).reduce(function (acc, item) {
    acc[item.position].push(item.item);
    return acc;
  }, initArr);
};
var isMoveOp = function isMoveOp(_ref3) {
  var op = _ref3.op;
  return op === 'move';
};
var isRemoveOp = function isRemoveOp(_ref4) {
  var op = _ref4.op;
  return op === 'remove';
};

var reorderOps = function reorderOps(diff) {
  var _partitionOps = partitionOps(diff, [isMoveOp, isRemoveOp]),
      _partitionOps2 = slicedToArray(_partitionOps, 3),
      moveOps = _partitionOps2[0],
      removedOps = _partitionOps2[1],
      restOps = _partitionOps2[2];

  var removeOpsReverse = opsByDescendingOrder(removedOps);
  return [].concat(toConsumableArray(removeOpsReverse), toConsumableArray(moveOps), toConsumableArray(restOps));
};

var defaultInstance$2 = void 0;

var format$2 = function format(delta, left) {
  if (!defaultInstance$2) {
    defaultInstance$2 = new JSONFormatter();
  }
  return reorderOps(defaultInstance$2.format(delta, left));
};

var log = function log(delta, left) {
  console.log(format$2(delta, left));
};



var jsonpatch = Object.freeze({
	default: JSONFormatter,
	partitionOps: partitionOps,
	format: format$2,
	log: log
});

function chalkColor(name) {
  return chalk__WEBPACK_IMPORTED_MODULE_1___default.a && chalk__WEBPACK_IMPORTED_MODULE_1___default.a[name] || function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args;
  };
}

var colors = {
  added: chalkColor('green'),
  deleted: chalkColor('red'),
  movedestination: chalkColor('gray'),
  moved: chalkColor('yellow'),
  unchanged: chalkColor('gray'),
  error: chalkColor('white.bgRed'),
  textDiffLine: chalkColor('gray')
};

var ConsoleFormatter = function (_BaseFormatter) {
  inherits(ConsoleFormatter, _BaseFormatter);

  function ConsoleFormatter() {
    classCallCheck(this, ConsoleFormatter);

    var _this = possibleConstructorReturn(this, (ConsoleFormatter.__proto__ || Object.getPrototypeOf(ConsoleFormatter)).call(this));

    _this.includeMoveDestinations = false;
    return _this;
  }

  createClass(ConsoleFormatter, [{
    key: 'prepareContext',
    value: function prepareContext(context) {
      get(ConsoleFormatter.prototype.__proto__ || Object.getPrototypeOf(ConsoleFormatter.prototype), 'prepareContext', this).call(this, context);
      context.indent = function (levels) {
        this.indentLevel = (this.indentLevel || 0) + (typeof levels === 'undefined' ? 1 : levels);
        this.indentPad = new Array(this.indentLevel + 1).join('  ');
        this.outLine();
      };
      context.outLine = function () {
        this.buffer.push('\n' + (this.indentPad || ''));
      };
      context.out = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        for (var i = 0, l = args.length; i < l; i++) {
          var lines = args[i].split('\n');
          var text = lines.join('\n' + (this.indentPad || ''));
          if (this.color && this.color[0]) {
            text = this.color[0](text);
          }
          this.buffer.push(text);
        }
      };
      context.pushColor = function (color) {
        this.color = this.color || [];
        this.color.unshift(color);
      };
      context.popColor = function () {
        this.color = this.color || [];
        this.color.shift();
      };
    }
  }, {
    key: 'typeFormattterErrorFormatter',
    value: function typeFormattterErrorFormatter(context, err) {
      context.pushColor(colors.error);
      context.out('[ERROR]' + err);
      context.popColor();
    }
  }, {
    key: 'formatValue',
    value: function formatValue(context, value) {
      context.out(JSON.stringify(value, null, 2));
    }
  }, {
    key: 'formatTextDiffString',
    value: function formatTextDiffString(context, value) {
      var lines = this.parseTextDiff(value);
      context.indent();
      for (var i = 0, l = lines.length; i < l; i++) {
        var line = lines[i];
        context.pushColor(colors.textDiffLine);
        context.out(line.location.line + ',' + line.location.chr + ' ');
        context.popColor();
        var pieces = line.pieces;
        for (var pieceIndex = 0, piecesLength = pieces.length; pieceIndex < piecesLength; pieceIndex++) {
          var piece = pieces[pieceIndex];
          context.pushColor(colors[piece.type]);
          context.out(piece.text);
          context.popColor();
        }
        if (i < l - 1) {
          context.outLine();
        }
      }
      context.indent(-1);
    }
  }, {
    key: 'rootBegin',
    value: function rootBegin(context, type, nodeType) {
      context.pushColor(colors[type]);
      if (type === 'node') {
        context.out(nodeType === 'array' ? '[' : '{');
        context.indent();
      }
    }
  }, {
    key: 'rootEnd',
    value: function rootEnd(context, type, nodeType) {
      if (type === 'node') {
        context.indent(-1);
        context.out(nodeType === 'array' ? ']' : '}');
      }
      context.popColor();
    }
  }, {
    key: 'nodeBegin',
    value: function nodeBegin(context, key, leftKey, type, nodeType) {
      context.pushColor(colors[type]);
      context.out(leftKey + ': ');
      if (type === 'node') {
        context.out(nodeType === 'array' ? '[' : '{');
        context.indent();
      }
    }
  }, {
    key: 'nodeEnd',
    value: function nodeEnd(context, key, leftKey, type, nodeType, isLast) {
      if (type === 'node') {
        context.indent(-1);
        context.out(nodeType === 'array' ? ']' : '}' + (isLast ? '' : ','));
      }
      if (!isLast) {
        context.outLine();
      }
      context.popColor();
    }

    /* jshint camelcase: false */
    /* eslint-disable camelcase */

  }, {
    key: 'format_unchanged',
    value: function format_unchanged(context, delta, left) {
      if (typeof left === 'undefined') {
        return;
      }
      this.formatValue(context, left);
    }
  }, {
    key: 'format_movedestination',
    value: function format_movedestination(context, delta, left) {
      if (typeof left === 'undefined') {
        return;
      }
      this.formatValue(context, left);
    }
  }, {
    key: 'format_node',
    value: function format_node(context, delta, left) {
      // recurse
      this.formatDeltaChildren(context, delta, left);
    }
  }, {
    key: 'format_added',
    value: function format_added(context, delta) {
      this.formatValue(context, delta[0]);
    }
  }, {
    key: 'format_modified',
    value: function format_modified(context, delta) {
      context.pushColor(colors.deleted);
      this.formatValue(context, delta[0]);
      context.popColor();
      context.out(' => ');
      context.pushColor(colors.added);
      this.formatValue(context, delta[1]);
      context.popColor();
    }
  }, {
    key: 'format_deleted',
    value: function format_deleted(context, delta) {
      this.formatValue(context, delta[0]);
    }
  }, {
    key: 'format_moved',
    value: function format_moved(context, delta) {
      context.out('==> ' + delta[1]);
    }
  }, {
    key: 'format_textdiff',
    value: function format_textdiff(context, delta) {
      this.formatTextDiffString(context, delta[0]);
    }
  }]);
  return ConsoleFormatter;
}(BaseFormatter);

var defaultInstance$3 = void 0;

var format$3 = function format(delta, left) {
  if (!defaultInstance$3) {
    defaultInstance$3 = new ConsoleFormatter();
  }
  return defaultInstance$3.format(delta, left);
};

function log$1(delta, left) {
  console.log(format$3(delta, left));
}



var console$1 = Object.freeze({
	default: ConsoleFormatter,
	format: format$3,
	log: log$1
});



var index = Object.freeze({
	base: base,
	html: html,
	annotated: annotated,
	jsonpatch: jsonpatch,
	console: console$1
});

// use as 2nd parameter for JSON.parse to revive Date instances
function dateReviver(key, value) {
  var parts = void 0;
  if (typeof value === 'string') {
    // eslint-disable-next-line max-len
    parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?(Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
    if (parts) {
      return new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6], +(parts[7] || 0)));
    }
  }
  return value;
}

function create(options) {
  return new DiffPatcher(options);
}

var defaultInstance$4 = void 0;

function diff() {
  if (!defaultInstance$4) {
    defaultInstance$4 = new DiffPatcher();
  }
  return defaultInstance$4.diff.apply(defaultInstance$4, arguments);
}

function patch() {
  if (!defaultInstance$4) {
    defaultInstance$4 = new DiffPatcher();
  }
  return defaultInstance$4.patch.apply(defaultInstance$4, arguments);
}

function unpatch() {
  if (!defaultInstance$4) {
    defaultInstance$4 = new DiffPatcher();
  }
  return defaultInstance$4.unpatch.apply(defaultInstance$4, arguments);
}

function reverse() {
  if (!defaultInstance$4) {
    defaultInstance$4 = new DiffPatcher();
  }
  return defaultInstance$4.reverse.apply(defaultInstance$4, arguments);
}

function clone$1() {
  if (!defaultInstance$4) {
    defaultInstance$4 = new DiffPatcher();
  }
  return defaultInstance$4.clone.apply(defaultInstance$4, arguments);
}


//# sourceMappingURL=jsondiffpatch.esm.js.map


/***/ }),

/***/ 192:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),

/***/ 193:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
const colorConvert = __webpack_require__(194);

const wrapAnsi16 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => function () {
	const rgb = fn.apply(colorConvert, arguments);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39],

			// Bright color
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Fix humans
	styles.color.grey = styles.color.gray;

	for (const groupName of Object.keys(styles)) {
		const group = styles[groupName];

		for (const styleName of Object.keys(group)) {
			const style = group[styleName];

			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});

		Object.defineProperty(styles, 'codes', {
			value: codes,
			enumerable: false
		});
	}

	const ansi2ansi = n => n;
	const rgb2rgb = (r, g, b) => [r, g, b];

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = {
		ansi: wrapAnsi16(ansi2ansi, 0)
	};
	styles.color.ansi256 = {
		ansi256: wrapAnsi256(ansi2ansi, 0)
	};
	styles.color.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 0)
	};

	styles.bgColor.ansi = {
		ansi: wrapAnsi16(ansi2ansi, 10)
	};
	styles.bgColor.ansi256 = {
		ansi256: wrapAnsi256(ansi2ansi, 10)
	};
	styles.bgColor.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 10)
	};

	for (let key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] !== 'object') {
			continue;
		}

		const suite = colorConvert[key];

		if (key === 'ansi16') {
			key = 'ansi';
		}

		if ('ansi16' in suite) {
			styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
			styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
		}

		if ('ansi256' in suite) {
			styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
			styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
		}

		if ('rgb' in suite) {
			styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
			styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
		}
	}

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(38)(module)))

/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(109);
var route = __webpack_require__(196);

var convert = {};

var models = Object.keys(conversions);

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		return fn(args);
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === undefined || args === null) {
			return args;
		}

		if (arguments.length > 1) {
			args = Array.prototype.slice.call(arguments);
		}

		var result = fn(args);

		// we're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (var len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);
	var routeModels = Object.keys(routes);

	routeModels.forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 195:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(109);

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	var graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	var models = Object.keys(conversions);

	for (var len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	var graph = buildGraph();
	var queue = [fromModel]; // unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop();
		var adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i];
			var node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel];
	var fn = conversions[graph[toModel].parent][toModel];

	var cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel);
	var conversion = {};

	var models = Object.keys(graph);
	for (var len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];
		var node = graph[toModel];

		if (node.parent === null) {
			// no possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 197:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(20);
const hasFlag = __webpack_require__(198);

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	if ((c[0] === 'u' && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, args) {
	const results = [];
	const chunks = args.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		if (!isNaN(chunk)) {
			results.push(Number(chunk));
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => escape ? unescape(escape) : chr));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const styleName of Object.keys(enabled)) {
		if (Array.isArray(enabled[styleName])) {
			if (!(styleName in current)) {
				throw new Error(`Unknown Chalk style: ${styleName}`);
			}

			if (enabled[styleName].length > 0) {
				current = current[styleName].apply(current, enabled[styleName]);
			} else {
				current = current[styleName];
			}
		}
	}

	return current;
}

module.exports = (chalk, tmp) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
		if (escapeChar) {
			chunk.push(unescape(escapeChar));
		} else if (style) {
			const str = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(chr);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMsg);
	}

	return chunks.join('');
};


/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return is_WithSchemaVersion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return is_WithRevision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return is_WithTimestamp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return has_versioned_schema; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return is_revisioned; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return is_time_stamped; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return is_BaseState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return is_UState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return is_TState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return is_UTBundle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return is_RootState; });
/////////////////////////////////////////////////
function is_WithSchemaVersion(s) {
  return Number.isInteger(s === null || s === void 0 ? void 0 : s.schema_version);
}
function is_WithRevision(s) {
  return Number.isInteger(s === null || s === void 0 ? void 0 : s.revision);
}
function is_WithTimestamp(s) {
  return Number.isInteger(s === null || s === void 0 ? void 0 : s.timestamp_ms);
} /////////////////////////////////////////////////

function has_versioned_schema(s) {
  return is_WithSchemaVersion(s) || is_UTBundle(s) || is_RootState(s);
}
function is_revisioned(s) {
  return is_WithRevision(s) || is_UTBundle(s) || is_RootState(s);
}
function is_time_stamped(s) {
  return is_WithTimestamp(s) || is_UTBundle(s) || is_RootState(s);
} /////////////////////////////////////////////////

function is_BaseState(s) {
  return is_WithSchemaVersion(s) && is_WithRevision(s);
}
function is_UState(s) {
  return is_BaseState(s) && !is_WithTimestamp(s);
}
function is_TState(s) {
  return is_BaseState(s) && is_WithTimestamp(s);
}
function is_UTBundle(s) {
  return Array.isArray(s) && s.length === 2 && is_UState(s[0]) && is_TState(s[1]);
}
function is_RootState(s) {
  return is_UState(s === null || s === void 0 ? void 0 : s.u_state) && is_TState(s === null || s === void 0 ? void 0 : s.t_state);
}

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ 200:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.require_http_method = exports.HttpMethod = void 0;

const typescript_string_enums_1 = __webpack_require__(7);

const consts_1 = __webpack_require__(26);

const utils_1 = __webpack_require__(54); ////////////////////////////////////


exports.HttpMethod = typescript_string_enums_1.Enum('GET', 'PUT', 'POST', 'PATCH', 'OPTIONS'); ////////////////////////////////////

function require_http_method(allowed_methods) {
  const _require_http_method = async (SEC, event, context, response, next) => {
    await SEC.xPromiseTry('require_http_method()', async ({
      SEC,
      logger
    }) => {
      let http_method = event.httpMethod.toUpperCase();
      let is_preflight = // https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
      http_method === exports.HttpMethod.OPTIONS && event.headers['access-control-request-method'] && event.headers['access-control-request-headers'] && event.headers.origin;

      if (is_preflight) {
        http_method = event.headers['access-control-request-method'].toUpperCase(); //console.log('require_http_method(): handling a preflight…', http_method)
      }

      if (!allowed_methods.includes(http_method)) {
        throw utils_1.create_error(consts_1.HTTP_STATUS_CODE.error.client.method_not_allowed, {
          expected: allowed_methods.join(','),
          received: http_method
        }, SEC);
      }

      if (is_preflight) {
        // not the job of this MW to handle the preflight itself
        // however we help preparing it
        response.headers['Access-Control-Allow-Methods'] = allowed_methods.join(', ');
      }

      await next();
    });
  }; //mw.name = 'require_http_method:' + allowed_methods.join(',')


  return _require_http_method;
}

exports.require_http_method = require_http_method;

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "next_microtask", function() { return /* reexport */ next_microtask; });
__webpack_require__.d(__webpack_exports__, "end_of_current_event_loop", function() { return /* reexport */ end_of_current_event_loop; });
__webpack_require__.d(__webpack_exports__, "elapsed_time_ms", function() { return /* reexport */ elapsed_time_ms; });
__webpack_require__.d(__webpack_exports__, "next_idle", function() { return /* reexport */ next_idle; });
__webpack_require__.d(__webpack_exports__, "all_planned_idle_executed", function() { return /* reexport */ all_planned_idle_executed; });
__webpack_require__.d(__webpack_exports__, "nextTick", function() { return /* reexport */ nextTick; });
__webpack_require__.d(__webpack_exports__, "setImmediate", function() { return /* reexport */ setImmediate; });
__webpack_require__.d(__webpack_exports__, "MIN_IDLE_DELAY_MS", function() { return /* reexport */ MIN_IDLE_DELAY_MS; });
__webpack_require__.d(__webpack_exports__, "MAX_IDLE_DELAY_MS", function() { return /* reexport */ MAX_IDLE_DELAY_MS; });
__webpack_require__.d(__webpack_exports__, "requestIdleCallback", function() { return /* reexport */ requestIdleCallback; });
__webpack_require__.d(__webpack_exports__, "DELAY_UNTIL_NEXT_EVENT_LOOP_MS", function() { return /* reexport */ DELAY_UNTIL_NEXT_EVENT_LOOP_MS; });
__webpack_require__.d(__webpack_exports__, "BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS", function() { return /* reexport */ BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS; });
__webpack_require__.d(__webpack_exports__, "FRAME_DURATION_MS", function() { return /* reexport */ FRAME_DURATION_MS; });
__webpack_require__.d(__webpack_exports__, "HUMAN_PERCEPTION_MS", function() { return /* reexport */ HUMAN_PERCEPTION_MS; });
__webpack_require__.d(__webpack_exports__, "MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS", function() { return /* reexport */ MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS; });
__webpack_require__.d(__webpack_exports__, "schedule_when_idle_but_not_too_far", function() { return /* reexport */ schedule_when_idle_but_not_too_far; });
__webpack_require__.d(__webpack_exports__, "schedule_when_idle_but_within_human_perception", function() { return /* reexport */ schedule_when_idle_but_within_human_perception; });
__webpack_require__.d(__webpack_exports__, "asap_but_not_synchronous", function() { return /* reexport */ asap_but_not_synchronous; });
__webpack_require__.d(__webpack_exports__, "asap_but_out_of_immediate_execution", function() { return /* reexport */ asap_but_out_of_immediate_execution; });
__webpack_require__.d(__webpack_exports__, "asap_but_out_of_current_event_loop", function() { return /* reexport */ asap_but_out_of_current_event_loop; });
__webpack_require__.d(__webpack_exports__, "dezalgo", function() { return /* reexport */ dezalgo; });

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/tiny-invariant/dist/tiny-invariant.esm.js
var tiny_invariant_esm = __webpack_require__(1);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/globalthis-ponyfill/dist/src.es2019/index.js
var src_es2019 = __webpack_require__(8);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/async-utils/dist/src.es2019/ponyfills.js
var _a, _b;


 // XXX DO NOT USE
// XXX queueMicrotask() SHOULD ALWAYS BE PREFERRED
// node only so far, semantic changed in >=0.9.1
// adds callback to the "next tick queue".
// This queue is fully drained after the current operation on the JavaScript stack runs to completion
// and before the event loop is allowed to continue.
// It's possible to create an infinite loop if one were to recursively call process.nextTick()

const nextTick = ((_a = Object(src_es2019["a" /* getGlobalThis */])().process) === null || _a === void 0 ? void 0 : _a.nextTick) || function nextTickPonyFill(callback, ...args) {
  // closest possible effect in browser
  queueMicrotask(() => callback(...args));
};
const setImmediate = Object(src_es2019["a" /* getGlobalThis */])().setImmediate || function setImmediatePonyFill(callback, ...args) {
  // closest possible effect
  setTimeout(callback, 0, ...args);
}; // browser only
// Strange semantic of being clamped to 50ms
// https://developers.google.com/web/updates/2015/08/using-requestidlecallback

const MIN_IDLE_DELAY_MS = 2; // since <=1 is all the same

const MAX_IDLE_DELAY_MS = 50; // according to https://developers.google.com/web/updates/2015/08/using-requestidlecallback

const DEFAULT_IDLE_DELAY_MS = MIN_IDLE_DELAY_MS; // interesting discussion:

const requestIdleCallback = ((_b = Object(src_es2019["a" /* getGlobalThis */])().requestIdleCallback) === null || _b === void 0 ? void 0 : _b.bind(Object(src_es2019["a" /* getGlobalThis */])())) || function requestIdleCallbackPonyFill(callback, {
  timeout = DEFAULT_IDLE_DELAY_MS
} = {}) {
  // inspired from https://developers.google.com/web/updates/2015/08/using-requestidlecallback#checking_for_requestidlecallback
  Object(tiny_invariant_esm["default"])(timeout >= MIN_IDLE_DELAY_MS, 'whats the point in requesting idle with a short timeout??');
  Object(tiny_invariant_esm["default"])(timeout <= MAX_IDLE_DELAY_MS, 'must be an error requesting idle with a timeout of more than 50ms??');
  let startTime = Date.now();

  function timeRemaining() {
    return Math.max(0, Date.now() - startTime);
  } // const fake_possible_idle_delay_for_polyfill_ms = Math.floor(Math.random() * timeout) NO!! or subsequent calls may happen earlier than the previous!
  //const final_delay_ms = Math.max(fake_possible_idle_delay_for_polyfill_ms, MIN_IDLE_DELAY_MS)


  const final_delay_ms = MIN_IDLE_DELAY_MS; // no choice in a polyfill...

  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining
    });
  }, final_delay_ms);
}; // TODO one day cancelIdleCallback (I don't need it)
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/async-utils/dist/src.es2019/awaitable.js

async function next_microtask() {
  await Promise.resolve(); // promise resolution is in microtasks
}
async function end_of_current_event_loop() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}
async function elapsed_time_ms(duration_ms) {
  await new Promise(resolve => {
    setTimeout(resolve, duration_ms);
  });
  await end_of_current_event_loop(); // extra wait for stuff that would fire exactly at the limit
}
async function next_idle() {
  return new Promise(resolve => {
    requestIdleCallback(resolve);
  });
} // useful for tests

async function all_planned_idle_executed() {
  var _a;

  let info;
  let safety = 10; //console.log({ safety, dt: info?.didTimeout ?? true})

  while (--safety && ((_a = info === null || info === void 0 ? void 0 : info.didTimeout) !== null && _a !== void 0 ? _a : true)) {
    info = await next_idle(); //console.log({ safety, dt: info?.didTimeout ?? true})
  }
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/async-utils/dist/src.es2019/semantic.js

const DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 1; // for Chrome/nodejs at least

const BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 2 * DELAY_UNTIL_NEXT_EVENT_LOOP_MS; // to account for outdated code using setTimeout(0)

const FRAME_DURATION_MS = Math.floor(1000 / 60); // 60 fps

const HUMAN_PERCEPTION_MS = 100; // https://developers.google.com/web/updates/2015/08/using-requestidlecallback

const MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS = Math.floor(HUMAN_PERCEPTION_MS / 2.); // https://developers.google.com/web/updates/2015/08/using-requestidlecallback

function schedule_when_idle_but_not_too_far(callback, max_delay_ms = MAX_IDLE_DELAY_MS) {
  requestIdleCallback(callback, {
    timeout: max_delay_ms
  });
}
function schedule_when_idle_but_within_human_perception(callback) {
  // yes, same as above but semantically different
  requestIdleCallback(callback, {
    timeout: MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS
  });
}
function asap_but_not_synchronous(callback) {
  queueMicrotask(callback);
}
function asap_but_out_of_immediate_execution(callback) {
  setTimeout(callback, BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS);
}
function asap_but_out_of_current_event_loop(callback) {
  setTimeout(callback, BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS);
} // https://blog.izs.me/2013/08/designing-apis-for-asynchrony

function dezalgo(callback) {
  return () => queueMicrotask(callback);
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--isomorphic/async-utils/dist/src.es2019/index.js




/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __extends; });
/* unused harmony export __assign */
/* unused harmony export __rest */
/* unused harmony export __decorate */
/* unused harmony export __param */
/* unused harmony export __metadata */
/* unused harmony export __awaiter */
/* unused harmony export __generator */
/* unused harmony export __createBinding */
/* unused harmony export __exportStar */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __read; });
/* unused harmony export __spread */
/* unused harmony export __spreadArrays */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/* unused harmony export __importStar */
/* unused harmony export __importDefault */
/* unused harmony export __classPrivateFieldGet */
/* unused harmony export __classPrivateFieldSet */
/*! *****************************************************************************
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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

module.exports = require("domain");

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "getRootSEC", function() { return /* reexport */ getRootSEC; });
__webpack_require__.d(__webpack_exports__, "LIB", function() { return /* reexport */ LIB; });
__webpack_require__.d(__webpack_exports__, "isSEC", function() { return /* reexport */ isSEC; });
__webpack_require__.d(__webpack_exports__, "createSEC", function() { return /* reexport */ createSEC; });
__webpack_require__.d(__webpack_exports__, "flattenToOwn", function() { return /* reexport */ flattenToOwn; });
__webpack_require__.d(__webpack_exports__, "_getSECStatePath", function() { return /* reexport */ _getSECStatePath; });
__webpack_require__.d(__webpack_exports__, "_flattenSEC", function() { return /* reexport */ _flattenSEC; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/logical-stack/state.js
var logical_stack_state_namespaceObject = {};
__webpack_require__.r(logical_stack_state_namespaceObject);
__webpack_require__.d(logical_stack_state_namespaceObject, "create", function() { return state_create; });
__webpack_require__.d(logical_stack_state_namespaceObject, "set_module", function() { return set_module; });
__webpack_require__.d(logical_stack_state_namespaceObject, "set_operation", function() { return set_operation; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/dependency-injection/state.js
var dependency_injection_state_namespaceObject = {};
__webpack_require__.r(dependency_injection_state_namespaceObject);
__webpack_require__.d(dependency_injection_state_namespaceObject, "create", function() { return dependency_injection_state_create; });
__webpack_require__.d(dependency_injection_state_namespaceObject, "injectDependencies", function() { return state_injectDependencies; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/error-handling/state.js
var error_handling_state_namespaceObject = {};
__webpack_require__.r(error_handling_state_namespaceObject);
__webpack_require__.d(error_handling_state_namespaceObject, "create", function() { return error_handling_state_create; });
__webpack_require__.d(error_handling_state_namespaceObject, "addDetail", function() { return addDetail; });

// NAMESPACE OBJECT: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/analytics/state.js
var analytics_state_namespaceObject = {};
__webpack_require__.r(analytics_state_namespaceObject);
__webpack_require__.d(analytics_state_namespaceObject, "create", function() { return analytics_state_create; });
__webpack_require__.d(analytics_state_namespaceObject, "addDetail", function() { return state_addDetail; });

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/types.js

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/globalthis-ponyfill/dist/src.es2019/index.js
var src_es2019 = __webpack_require__(8);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/consts.js
const LIB = 'soft-execution-context';
const INTERNAL_PROP = '_SEC';

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/emittery/index.js
var emittery = __webpack_require__(142);
var emittery_default = /*#__PURE__*/__webpack_require__.n(emittery);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/root-prototype.js
 /////////////////////

const ROOT_PROTOTYPE = Object.create(null); // global bus shared by all SECs

ROOT_PROTOTYPE.emitter = new emittery_default.a(); // common functions
// because we often set the same details

ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
  const SEC = this;
  return SEC.setAnalyticsDetails(details).setErrorReportDetails(details);
}; /////////////////////



// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/state.js
// Note: let's keep everything immutable
/////////////////////
let instance_count = 0;

function create(parent_state) {
  return {
    sid: instance_count++,
    parent: parent_state || null,
    plugins: {},
    cache: {}
  };
}

function activate_plugin(state, PLUGIN
/*, args*/
) {
  const plugin_parent_state = state.parent ? state.parent.plugins[PLUGIN.id] : null;
  const plugin_state = PLUGIN.state.create(plugin_parent_state);
  return { ...state,
    plugins: { ...state.plugins,
      [PLUGIN.id]: { ...plugin_state,
        sid: state.sid
      }
    }
  };
}

function reduce_plugin(state, PLUGIN_ID, reducer) {
  const initial_plugin_state = state.plugins[PLUGIN_ID];
  const new_plugin_state = reducer(initial_plugin_state);
  if (new_plugin_state === initial_plugin_state) return state; // no change (immutability expected)

  return { ...state,
    plugins: { ...state.plugins,
      [PLUGIN_ID]: new_plugin_state
    }
  };
} /////////////////////



// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/logical-stack/consts.js
const LOGICAL_STACK_BEGIN_MARKER = '';
const LOGICAL_STACK_END_MARKER = '';
const LOGICAL_STACK_SEPARATOR = '›'; // '⋅' '↘' ':' '•' '›'

const LOGICAL_STACK_MODULE_MARKER = '';
const LOGICAL_STACK_OPERATION_MARKER = ''; // '…'

const LOGICAL_STACK_SEPARATOR_NON_ADJACENT = '…';

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/logical-stack/state.js
/////////////////////
function state_create(parent_state) {
  const stack = parent_state ? Object.create(parent_state.stack) : (() => {
    const stack = Object.create(null);
    stack.module = undefined;
    return stack;
  })();
  stack.operation = undefined; // should never inherit this one

  return {
    stack
  };
}

function set_module(state, module) {
  const {
    stack
  } = state;
  if (stack.module === module) return state;
  stack.module = module;
  return { ...state,
    stack
  };
}

function set_operation(state, operation) {
  const {
    stack
  } = state;
  if (stack.operation === operation) return state;
  stack.operation = operation;
  return { ...state,
    stack
  };
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/utils.js


function flattenToOwn(object) {
  if (!object) return object;
  if (Array.isArray(object)) return object;
  if (typeof object !== 'object') return object;
  const res = Object.create(null);

  for (const property in object) {
    res[property] = object[property];
  }

  return res;
} // needed for various tree traversal algorithms


function _getSECStatePath(SEC) {
  if (!SEC[INTERNAL_PROP].cache.statePath) {
    const path = [];
    let state = SEC[INTERNAL_PROP];

    while (state) {
      path.unshift(state);
      state = state.parent;
    }

    SEC[INTERNAL_PROP].cache.statePath = path;
  }

  return SEC[INTERNAL_PROP].cache.statePath;
} // for debug


function _flattenSEC(SEC) {
  const plugins = { ...SEC[INTERNAL_PROP].plugins
  };
  plugins.analytics.details = flattenToOwn(plugins.analytics.details);
  plugins.dependency_injection.context = flattenToOwn(plugins.dependency_injection.context);
  plugins.error_handling.details = flattenToOwn(plugins.error_handling.details);
  plugins.logical_stack.stack = flattenToOwn(plugins.logical_stack.stack);
  return plugins;
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/logical-stack/index.js





const PLUGIN_ID = 'logical_stack';
const BRANCH_JUMP_PSEUDO_STATE = {
  sid: -1,
  plugins: {
    [PLUGIN_ID]: {
      stack: {
        // NO module
        operation: LOGICAL_STACK_SEPARATOR_NON_ADJACENT
      }
    }
  }
};

function _reduceStatePathToLogicalStack(statePath) {
  let current_module = null;
  return statePath.reduce((res, state) => {
    const {
      module,
      operation
    } = state.plugins[PLUGIN_ID].stack;

    if (module // check existence of module due to special case "BRANCH_JUMP_PSEUDO_STATE" above
    && module !== current_module) {
      res = res + (res.length ? LOGICAL_STACK_SEPARATOR : '') + module;
      current_module = module;
    }

    if (operation) res = res + LOGICAL_STACK_SEPARATOR + operation + LOGICAL_STACK_OPERATION_MARKER;
    return res;
  }, '') + LOGICAL_STACK_END_MARKER;
}

const logical_stack_PLUGIN = {
  id: PLUGIN_ID,
  state: logical_stack_state_namespaceObject,
  augment: prototype => {
    prototype.setLogicalStack = function setLogicalStack({
      module,
      operation
    }) {
      const SEC = this;
      let root_state = SEC[INTERNAL_PROP];
      root_state = reduce_plugin(root_state, PLUGIN_ID, state => {
        if (module) state = set_module(state, module);
        if (operation) state = set_operation(state, operation);
        return state;
      });
      SEC[INTERNAL_PROP] = root_state;
      return SEC;
    };

    prototype.getLogicalStack = function getLogicalStack() {
      const SEC = this;
      return _reduceStatePathToLogicalStack(_getSECStatePath(SEC));
    };

    prototype.getShortLogicalStack = function get_stack_end() {
      const {
        stack
      } = this[INTERNAL_PROP].plugins[PLUGIN_ID];
      return LOGICAL_STACK_BEGIN_MARKER + stack.module + LOGICAL_STACK_SEPARATOR_NON_ADJACENT //LOGICAL_STACK_SEPARATOR
      + stack.operation + LOGICAL_STACK_OPERATION_MARKER + LOGICAL_STACK_END_MARKER;
    };

    prototype._decorateErrorWithLogicalStack = function _decorateErrorWithLogicalStack(err) {
      const SEC = this;
      err._temp = err._temp || {};
      err.details = err.details || {};
      const logicalStack = {
        full: SEC.getLogicalStack()
      };

      if (err._temp.SEC) {
        // OK this error is already decorated.
        // Thus the message is also already decorated, don't touch it.
        // BUT we may be able to add more info, can we?
        if (err.details.logicalStack.includes(logicalStack.full)) {// ok, logical stack already chained, nothing to add
        } else {
          // SEC chain has branched, reconcile paths
          // OK maybe overkill...
          const other_path = err._temp.statePath;

          const current_path = _getSECStatePath(SEC); // find common path


          let last_common_index = 0;

          for (let i = 1; i < current_path.length; ++i) {
            if (other_path[i] !== current_path[i]) break;
            last_common_index = i;
          } // reconcile the 2 stack traces


          let improvedStatePath = [].concat(current_path);
          improvedStatePath.push(BRANCH_JUMP_PSEUDO_STATE);
          improvedStatePath = improvedStatePath.concat(other_path.slice(last_common_index + 1));
          err._temp.statePath = improvedStatePath;
          err.details.logicalStack = _reduceStatePathToLogicalStack(improvedStatePath);
        }
      } else {
        err._temp.SEC = SEC;
        err._temp.statePath = _getSECStatePath(SEC);
        logicalStack.short = SEC.getShortLogicalStack();

        if (err.message.startsWith(logicalStack.short)) {
          // can that happen??? It's a bug!

          /* eslint-disable no-console */
          console.warn('UNEXPECTED SEC non-decorated error already prefixed??');
          /* eslint-enable no-console */
        } else {
          err.message = logicalStack.short + ': ' + err.message;
        }

        err.details.logicalStack = logicalStack.full;
      }

      return err;
    };
  }
};

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/dependency-injection/state.js
function dependency_injection_state_create(parent_state) {
  const context = parent_state ? Object.create(parent_state.context) : Object.create(null); // NO auto-injections here, let's keep it simple. See core.

  return {
    context
  };
}

function state_injectDependencies(state, key, value) {
  const {
    context
  } = state;
  context[key] = value;
  return { ...state,
    context
  };
} /////////////////////



// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/dependency-injection/index.js




const dependency_injection_PLUGIN_ID = 'dependency_injection';
const dependency_injection_PLUGIN = {
  id: dependency_injection_PLUGIN_ID,
  state: dependency_injection_state_namespaceObject,
  augment: prototype => {
    prototype.injectDependencies = function injectDependencies(deps) {
      let root_state = this[INTERNAL_PROP];
      root_state = reduce_plugin(root_state, dependency_injection_PLUGIN_ID, state => {
        Object.entries(deps).forEach(([key, value]) => {
          state = state_injectDependencies(state, key, value);
        });
        return state;
      });
      this[INTERNAL_PROP] = root_state;
      return this; // for chaining
    };

    prototype.getInjectedDependencies = function getInjectedDependencies() {
      const plugin_state = this[INTERNAL_PROP].plugins[dependency_injection_PLUGIN_ID];
      return flattenToOwn(plugin_state.context);
    };
  }
};

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/promise-try/dist/src.es2019/index.js
// http://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry(fn) {
  return Promise.resolve().then(fn);
}


// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/timestamps/dist/src.es2019/generate.js
var generate = __webpack_require__(108);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/error-utils/dist/src.es2019/util--normalize.js
var util_normalize = __webpack_require__(66);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/error-utils/dist/src.es2019/util--create.js
var util_create = __webpack_require__(65);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/error-handling/state.js
/////////////////////
function error_handling_state_create(parent_state) {
  const details = parent_state ? Object.create(parent_state.details) : Object.create(null); // NO auto-details here, let's keep it simple + usually shared with analytics. See core or platform specific code.

  return {
    details
  };
}

function addDetail(state, key, value) {
  const {
    details
  } = state;
  details[key] = value;
  return { ...state,
    details
  };
} /////////////////////



// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/error-handling/catch-factory.js
function createCatcher({
  decorators = [],
  onError,
  debugId = '?'
} = {}) {
  return err => {
    //console.info(`[catchFactory from ${debugId}]`)
    err = decorators.reduce((err, decorator) => {
      try {
        err = decorator(err);
        if (!err.message) throw new Error();
      } catch (decoratorErr) {
        /* eslint-disable no-console */
        console.error(`catchFactory exec from ${debugId}: bad decorator!`, {
          err,
          decoratorErr,
          'decorator.name': decorator.name
        });
        /* eslint-enable no-console */
      }

      return err;
    }, err);
    if (onError) return onError(err);
    throw err; // or rethrow since still unhandled
  };
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/error-handling/index.js









const error_handling_PLUGIN_ID = 'error_handling';

function cleanTemp(err) {
  delete err._temp;
  return err;
}

const error_handling_PLUGIN = {
  id: error_handling_PLUGIN_ID,
  state: error_handling_state_namespaceObject,
  augment: prototype => {
    prototype._handleError = function handleError({
      SEC,
      debugId = '?',
      shouldRethrow = true
    }, err) {
      createCatcher({
        debugId,
        decorators: [util_normalize["a" /* normalizeError */], err => SEC._decorateErrorWithLogicalStack(err), err => SEC._decorateErrorWithDetails(err)],
        onError: shouldRethrow ? null : err => SEC.emitter.emit('final-error', {
          SEC,
          err: cleanTemp(err)
        })
      })(err);
    };

    prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err) {
      const SEC = this;
      const state = SEC[INTERNAL_PROP];
      const now = Object(generate["d" /* get_UTC_timestamp_ms */])();
      const autoDetails = {
        ENV: state.plugins[dependency_injection_PLUGIN_ID].context.ENV,
        TIME: now,
        SESSION_DURATION_MS: now - state.plugins[dependency_injection_PLUGIN_ID].context.SESSION_START_TIME_MS
      };
      const userDetails = flattenToOwn(state.plugins[error_handling_PLUGIN_ID].details);
      err.details = { ...autoDetails,
        ...userDetails,
        ...(err.details || {})
      };
      return err;
    };

    prototype.setErrorReportDetails = function setErrorReportDetails(details) {
      const SEC = this;
      let root_state = SEC[INTERNAL_PROP];
      root_state = reduce_plugin(root_state, error_handling_PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = addDetail(plugin_state, key, value);
        });
        return plugin_state;
      });
      this[INTERNAL_PROP] = root_state;
      return SEC; // for chaining
    }; // useful if creating an error later from a saved SEC, ex. from a pipeline


    prototype.createError = function createError(message, details = {}) {
      const SEC = this;

      const err = Object(util_create["a" /* createError */])(message, details);

      err.framesToPop = (err.framesToPop || 0) + 1;
      return SEC._decorateErrorWithLogicalStack(SEC._decorateErrorWithDetails(err));
    }; // for termination promises


    prototype.handleError = function handleError(err) {
      const SEC = this;

      SEC._handleError({
        SEC,
        debugId: 'handleError',
        shouldRethrow: false
      }, err);
    };

    prototype.xTry = function xTry(operation, fn) {
      console.assert(!!operation);
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[INTERNAL_PROP].plugins[dependency_injection_PLUGIN_ID].context;

      try {
        return fn(params);
      } catch (err) {
        SEC._handleError({
          SEC,
          debugId: 'xTry',
          shouldRethrow: true
        }, err);
      }
    };

    prototype.xTryCatch = function xTryCatch(operation, fn) {
      console.assert(!!operation);
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[INTERNAL_PROP].plugins[dependency_injection_PLUGIN_ID].context;

      try {
        return fn(params);
      } catch (err) {
        SEC._handleError({
          SEC,
          debugId: 'xTryCatch',
          shouldRethrow: false
        }, err);
      }
    };

    prototype.xNewPromise = function xPromise(operation, resolver_fn) {
      console.assert(!!operation);
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[INTERNAL_PROP].plugins[dependency_injection_PLUGIN_ID].context;
      return new Promise(resolver_fn.bind(undefined, params)).catch(err => {
        SEC._handleError({
          SEC,
          debugId: 'xPromise',
          shouldRethrow: true
        }, err);
      });
    };

    prototype.xPromiseTry = function xPromiseTry(operation, fn) {
      console.assert(!!operation);
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[INTERNAL_PROP].plugins[dependency_injection_PLUGIN_ID].context;
      return promiseTry(() => fn(params)).catch(err => {
        SEC._handleError({
          SEC,
          debugId: 'xPromiseTry',
          shouldRethrow: true
        }, err);
      });
    };
  }
};

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/analytics/state.js
function analytics_state_create(parent_state) {
  const details = parent_state ? Object.create(parent_state.details) : Object.create(null); // NO auto-details here, let's keep it simple. See core or platform specific code.

  return {
    details
  };
}

function state_addDetail(state, key, value) {
  const {
    details
  } = state;
  details[key] = value;
  return { ...state,
    details
  };
} /////////////////////



// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/analytics/index.js






const analytics_PLUGIN_ID = 'analytics';
const analytics_PLUGIN = {
  id: analytics_PLUGIN_ID,
  state: analytics_state_namespaceObject,
  augment: prototype => {
    prototype.setAnalyticsDetails = function setAnalyticsDetails(details) {
      const SEC = this;
      let root_state = SEC[INTERNAL_PROP];
      root_state = reduce_plugin(root_state, analytics_PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = state_addDetail(plugin_state, key, value);
        });
        return plugin_state;
      });
      this[INTERNAL_PROP] = root_state;
      return SEC; // for chaining
    };

    prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId, details = {}) {
      const SEC = this;
      const now = Object(generate["d" /* get_UTC_timestamp_ms */])();
      const root_state = SEC[INTERNAL_PROP];
      if (!eventId) throw new Error('Incorrect eventId!');
      const {
        ENV
      } = SEC.getInjectedDependencies();
      const autoDetails = {
        ENV,
        TIME: now,
        SESSION_DURATION_MS: now - root_state.plugins[dependency_injection_PLUGIN_ID].context.SESSION_START_TIME_MS
      };
      const userDetails = SEC.getAnalyticsDetails();
      details = { ...autoDetails,
        ...userDetails,
        ...details
      };
      SEC.emitter.emit('analytics', {
        SEC,
        eventId,
        details
      });
      return SEC; // for chaining
    };

    prototype.getAnalyticsDetails = function getAnalyticsDetails() {
      const SEC = this;
      const plugin_state = SEC[INTERNAL_PROP].plugins[analytics_PLUGIN_ID];
      return flattenToOwn(plugin_state.details);
    };
  }
};

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/plugins/index.js




const PLUGINS_BY_ID = {
  [analytics_PLUGIN]: analytics_PLUGIN,
  [logical_stack_PLUGIN.id]: logical_stack_PLUGIN,
  [dependency_injection_PLUGIN.id]: dependency_injection_PLUGIN,
  [error_handling_PLUGIN.id]: error_handling_PLUGIN
};
const PLUGINS = Object.values(PLUGINS_BY_ID);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/common.js
/* global NODE_ENV process */


function decorateWithDetectedEnv(SEC) {
  const ENV = (() => {
    try {
      /*
      if (typeof NODE_ENV === 'string')
          return NODE_ENV
       */
      if (typeof process !== 'undefined' && "string" === 'string') return "production";
    } catch (err) {
      /* swallow */
    }

    return 'development';
  })();

  const IS_DEV_MODE = false;
  const IS_VERBOSE = false;
  const CHANNEL = 'dev';
  const SESSION_START_TIME_MS = Object(generate["d" /* get_UTC_timestamp_ms */])();
  SEC.injectDependencies({
    ENV,
    'NODE_ENV': ENV,
    IS_DEV_MODE,
    IS_VERBOSE,
    CHANNEL,
    SESSION_START_TIME_MS
  });
  SEC.setAnalyticsAndErrorDetails({
    ENV,
    CHANNEL
  });
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/core.js






ROOT_PROTOTYPE.createChild = function createChild(args) {
  return createSEC({ ...args,
    parent: this
  });
};

PLUGINS.forEach(PLUGIN => {
  PLUGIN.augment(ROOT_PROTOTYPE);
});

function isSEC(SEC) {
  return SEC && SEC[INTERNAL_PROP];
}

function createSEC(args = {}) {
  /////// PARAMS ///////
  if (args.parent && !isSEC(args.parent)) throw new Error(`${LIB}›createSEC() argument error: parent must be a valid SEC!`);
  let unhandled_args = Object.keys(args);
  const SEC = Object.create(ROOT_PROTOTYPE); /////// STATE ///////

  const parent_state = args.parent ? args.parent[INTERNAL_PROP] : undefined;
  let state = create(parent_state);
  unhandled_args = unhandled_args.filter(arg => arg !== 'parent');
  PLUGINS.forEach(PLUGIN => {
    state = activate_plugin(state, PLUGIN);
  });
  SEC[INTERNAL_PROP] = state; // auto injections

  if (!args.parent) {
    SEC.injectDependencies({
      logger: console
    });
    decorateWithDetectedEnv(SEC);
  }

  SEC.injectDependencies({
    SEC
  }); //console.log('createSEC', SEC, args.parent)
  // Here we could send an event on the SEC bus. No usage for now.
  // Her we could have lifecycle methods. No usage for now.

  if (unhandled_args.length) throw new Error(`${LIB}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`); /////////////////////

  return SEC;
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/root.js


 /////////////////////

const GLOBAL_VAR_NAME = '__global_root_sec';

function getRootSEC() {
  const global_this = Object(src_es2019["a" /* getGlobalThis */])();

  if (!global_this[GLOBAL_VAR_NAME]) {
    console.log(`[${LIB}] Creating root context…`);
    global_this[GLOBAL_VAR_NAME] = createSEC();
  }

  return global_this[GLOBAL_VAR_NAME];
} /////////////////////



// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/index.js





/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 ////////////////////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTP_STATUS_CODE = exports.APP = void 0;
exports.APP = 'OA∙API'; // 'functions'
////////////////////////////////////

exports.HTTP_STATUS_CODE = {
  success: {
    ok: 200,
    created: 201,
    accepted: 202,
    no_content: 204,
    reset_content: 205
  },
  error: {
    client: {
      bad_request: 400,
      // https://stackoverflow.com/questions/50143518/401-unauthorized-vs-403-forbidden-which-is-the-right-status-code-for-when-the-u
      unauthorized: 401,
      forbidden: 403,
      not_found: 404,
      method_not_allowed: 405,
      unprocessable_entity: 422
    },
    server: {
      internal: 500,
      not_implemented: 501
    }
  }
};

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _comparators__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(141);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SemanticDifference", function() { return _comparators__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "s_max", function() { return _comparators__WEBPACK_IMPORTED_MODULE_0__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_semantic_difference", function() { return _comparators__WEBPACK_IMPORTED_MODULE_0__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "compare", function() { return _comparators__WEBPACK_IMPORTED_MODULE_0__["b"]; });

/* harmony import */ var _migration__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(110);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "generic_migrate_to_latest", function() { return _migration__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_schema_version", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_schema_version_loose", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_revision", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_revision_loose", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_timestamp", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["f"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_timestamp_loose", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["g"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_base_loose", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_WithSchemaVersion", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_WithRevision", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["g"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_WithTimestamp", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["i"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "has_versioned_schema", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_revisioned", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["j"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_time_stamped", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["k"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_BaseState", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_UState", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_TState", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_UTBundle", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["f"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "is_RootState", function() { return _type_guards__WEBPACK_IMPORTED_MODULE_3__["c"]; });

/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(111);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "enforce_immutability", function() { return _utils__WEBPACK_IMPORTED_MODULE_4__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "complete_or_cancel_eager_mutation_propagating_possible_child_mutation", function() { return _utils__WEBPACK_IMPORTED_MODULE_4__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "are_ustate_revision_requirements_met", function() { return _utils__WEBPACK_IMPORTED_MODULE_4__["a"]; });








/***/ }),

/***/ 3:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return get_schema_version; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return get_schema_version_loose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return get_revision; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return get_revision_loose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return get_timestamp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return get_timestamp_loose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return get_base_loose; });
/* harmony import */ var tiny_invariant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _type_guards__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


function get_schema_version(s) {
  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_UTBundle */ "f"])(s)) {
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(get_schema_version(s[0]) === get_schema_version(s[1]), 'get_schema_version() matching U & T versions!');
    return get_schema_version(s[0]);
  }

  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_RootState */ "c"])(s)) {
    Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(get_schema_version(s.u_state) === get_schema_version(s.t_state), 'get_schema_version() matching U & T versions!');
    return get_schema_version(s.u_state);
  }

  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_WithSchemaVersion */ "h"])(s), 'get_schema_version() structure!');
  const {
    schema_version
  } = s;
  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Number.isSafeInteger(schema_version), 'get_schema_version() safeInteger!');
  return schema_version;
}
function get_schema_version_loose(s) {
  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* has_versioned_schema */ "a"])(s)) return get_schema_version(s); // specific fallbacks:
  // loose legacy bundles

  if (Array.isArray(s) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* has_versioned_schema */ "a"])(s[0])) return get_schema_version(s[0]); // final fallback

  return 0;
}
function get_revision(s) {
  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_UTBundle */ "f"])(s)) {
    return get_revision(s[0]) + get_revision(s[1]);
  }

  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_RootState */ "c"])(s)) {
    return get_revision(s.u_state) + get_revision(s.t_state);
  }

  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_WithRevision */ "g"])(s), 'get_revision() structure');
  const {
    revision
  } = s;
  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Number.isSafeInteger(revision), 'get_revision() safeInteger');
  return revision;
}
function get_revision_loose(s) {
  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_revisioned */ "j"])(s)) return get_revision(s); // specific fallbacks:
  // loose legacy bundles

  if (Array.isArray(s) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_revisioned */ "j"])(s[0])) return get_revision(s[0]) + get_revision_loose(s[1]); // final fallback

  return 0;
}
function get_timestamp(s) {
  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_UTBundle */ "f"])(s)) {
    return get_timestamp(s[1]);
  }

  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_RootState */ "c"])(s)) {
    return get_timestamp(s.t_state);
  }

  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_WithTimestamp */ "i"])(s), 'get_timestamp() structure');
  const {
    timestamp_ms
  } = s;
  Object(tiny_invariant__WEBPACK_IMPORTED_MODULE_0__["default"])(Number.isSafeInteger(timestamp_ms), 'get_timestamp() safeInteger');
  return timestamp_ms;
}
function get_timestamp_loose(s) {
  if (Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_time_stamped */ "k"])(s)) return get_timestamp(s); // specific fallbacks:
  // loose bundles

  if (Array.isArray(s) && Object(_type_guards__WEBPACK_IMPORTED_MODULE_1__[/* is_time_stamped */ "k"])(s[1])) return get_timestamp(s[1]); // final fallback

  return 0;
}
function get_base_loose(s) {
  return {
    schema_version: get_schema_version_loose(s),
    revision: get_revision_loose(s)
  };
}

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ getLogger; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ overrideHook; });

// UNUSED EXPORTS: exposeInternal, addDebugCommand, globalThis, createV1

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/globalthis-ponyfill/dist/src.es2019/index.js
var src_es2019 = __webpack_require__(8);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-minimal-noop/dist/src.es2019/index.js
function src_es2019_NOP() {}

const src_es2019_NOP_LOGGER = {
  setLevel: src_es2019_NOP,
  getLevel: () => 'silly',
  addCommonDetails: src_es2019_NOP,
  fatal: src_es2019_NOP,
  emerg: src_es2019_NOP,
  alert: src_es2019_NOP,
  crit: src_es2019_NOP,
  error: src_es2019_NOP,
  warning: src_es2019_NOP,
  warn: src_es2019_NOP,
  notice: src_es2019_NOP,
  info: src_es2019_NOP,
  verbose: src_es2019_NOP,
  log: src_es2019_NOP,
  debug: src_es2019_NOP,
  trace: src_es2019_NOP,
  silly: src_es2019_NOP,
  group: src_es2019_NOP,
  groupCollapsed: src_es2019_NOP,
  groupEnd: src_es2019_NOP
};

function createLogger(_) {
  return src_es2019_NOP_LOGGER;
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-placeholder/dist/src.es2019/v1.js

function create() {
  //console.trace('[UDA--placeholder installing…]')
  function NOP() {}

  const NOP_LOGGER = createLogger();
  return {
    getLogger: () => NOP_LOGGER,
    overrideHook: (k, v) => v,
    exposeInternal: NOP,
    addDebugCommand: NOP
  };
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-placeholder/dist/src.es2019/index.js


const globalThis = Object(src_es2019["a" /* getGlobalThis */])(); // ensure the root is present

globalThis._debug = globalThis._debug || {}; // install globally if no other implementation already present

globalThis._debug.v1 = globalThis._debug.v1 || create(); // expose the installed implementation

const instance = globalThis._debug.v1;
const {
  getLogger,
  exposeInternal,
  overrideHook,
  addDebugCommand
} = instance;
 // types & sub-types, for convenience



/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dateTimestampInSeconds; });
/* unused harmony export timestampInSeconds */
/* unused harmony export timestampWithMs */
/* unused harmony export usingPerformanceAPI */
/* unused harmony export browserPerformanceTimeOrigin */
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _node__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(34);


/**
 * A TimestampSource implementation for environments that do not support the Performance Web API natively.
 *
 * Note that this TimestampSource does not use a monotonic clock. A call to `nowSeconds` may return a timestamp earlier
 * than a previously returned value. We do not try to emulate a monotonic behavior in order to facilitate debugging. It
 * is more obvious to explain "why does my span have negative duration" than "why my spans have zero duration".
 */
var dateTimestampSource = {
    nowSeconds: function () { return Date.now() / 1000; },
};
/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */
function getBrowserPerformance() {
    var performance = Object(_misc__WEBPACK_IMPORTED_MODULE_0__[/* getGlobalObject */ "f"])().performance;
    if (!performance || !performance.now) {
        return undefined;
    }
    // Replace performance.timeOrigin with our own timeOrigin based on Date.now().
    //
    // This is a partial workaround for browsers reporting performance.timeOrigin such that performance.timeOrigin +
    // performance.now() gives a date arbitrarily in the past.
    //
    // Additionally, computing timeOrigin in this way fills the gap for browsers where performance.timeOrigin is
    // undefined.
    //
    // The assumption that performance.timeOrigin + performance.now() ~= Date.now() is flawed, but we depend on it to
    // interact with data coming out of performance entries.
    //
    // Note that despite recommendations against it in the spec, browsers implement the Performance API with a clock that
    // might stop when the computer is asleep (and perhaps under other circumstances). Such behavior causes
    // performance.timeOrigin + performance.now() to have an arbitrary skew over Date.now(). In laptop computers, we have
    // observed skews that can be as long as days, weeks or months.
    //
    // See https://github.com/getsentry/sentry-javascript/issues/2590.
    //
    // BUG: despite our best intentions, this workaround has its limitations. It mostly addresses timings of pageload
    // transactions, but ignores the skew built up over time that can aversely affect timestamps of navigation
    // transactions of long-lived web pages.
    var timeOrigin = Date.now() - performance.now();
    return {
        now: function () { return performance.now(); },
        timeOrigin: timeOrigin,
    };
}
/**
 * Returns the native Performance API implementation from Node.js. Returns undefined in old Node.js versions that don't
 * implement the API.
 */
function getNodePerformance() {
    try {
        var perfHooks = Object(_node__WEBPACK_IMPORTED_MODULE_1__[/* dynamicRequire */ "a"])(module, 'perf_hooks');
        return perfHooks.performance;
    }
    catch (_) {
        return undefined;
    }
}
/**
 * The Performance API implementation for the current platform, if available.
 */
var platformPerformance = Object(_node__WEBPACK_IMPORTED_MODULE_1__[/* isNodeEnv */ "c"])() ? getNodePerformance() : getBrowserPerformance();
var timestampSource = platformPerformance === undefined
    ? dateTimestampSource
    : {
        nowSeconds: function () { return (platformPerformance.timeOrigin + platformPerformance.now()) / 1000; },
    };
/**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */
var dateTimestampInSeconds = dateTimestampSource.nowSeconds.bind(dateTimestampSource);
/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * See `usingPerformanceAPI` to test whether the Performance API is used.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */
var timestampInSeconds = timestampSource.nowSeconds.bind(timestampSource);
// Re-exported with an old name for backwards-compatibility.
var timestampWithMs = timestampInSeconds;
/**
 * A boolean that is true when timestampInSeconds uses the Performance API to produce monotonic timestamps.
 */
var usingPerformanceAPI = platformPerformance !== undefined;
/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */
var browserPerformanceTimeOrigin = (function () {
    var performance = Object(_misc__WEBPACK_IMPORTED_MODULE_0__[/* getGlobalObject */ "f"])().performance;
    if (!performance) {
        return undefined;
    }
    if (performance.timeOrigin) {
        return performance.timeOrigin;
    }
    // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
    // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
    // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
    // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
    // Date API.
    // eslint-disable-next-line deprecation/deprecation
    return (performance.timing && performance.timing.navigationStart) || Date.now();
})();
//# sourceMappingURL=time.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(88)(module)))

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TEST_TIMESTAMP_MS", function() { return TEST_TIMESTAMP_MS; });
/* harmony import */ var _generate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(108);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_UTC_timestamp_ms", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_ms", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["g"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_seconds", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["h"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_minutes", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["f"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_days", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["e"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_ISO8601_extended_ms", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_ISO8601_simplified_minutes", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_ISO8601_simplified_day", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["b"]; });



const TEST_TIMESTAMP_MS = 1234567890; // useful for unit tests

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isNodeEnv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dynamicRequire; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return extractNodeRequestData; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(107);


/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function dynamicRequire(mod, request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return mod.require(request);
}
/** Default request keys that'll be used to extract data from the request */
var DEFAULT_REQUEST_KEYS = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];
/**
 * Normalizes data from the request object, accounting for framework differences.
 *
 * @param req The request object from which to extract data
 * @param keys An optional array of keys to include in the normalized data. Defaults to DEFAULT_REQUEST_KEYS if not
 * provided.
 * @returns An object containing normalized request data
 */
function extractNodeRequestData(req, keys) {
    if (keys === void 0) { keys = DEFAULT_REQUEST_KEYS; }
    // make sure we can safely use dynamicRequire below
    if (!isNodeEnv()) {
        throw new Error("Can't get node request data outside of a node environment");
    }
    var requestData = {};
    // headers:
    //   node, express: req.headers
    //   koa: req.header
    var headers = (req.headers || req.header || {});
    // method:
    //   node, express, koa: req.method
    var method = req.method;
    // host:
    //   express: req.hostname in > 4 and req.host in < 4
    //   koa: req.host
    //   node: req.headers.host
    var host = req.hostname || req.host || headers.host || '<no host>';
    // protocol:
    //   node: <n/a>
    //   express, koa: req.protocol
    var protocol = req.protocol === 'https' || req.secure || (req.socket || {}).encrypted
        ? 'https'
        : 'http';
    // url (including path and query string):
    //   node, express: req.originalUrl
    //   koa: req.url
    var originalUrl = (req.originalUrl || req.url || '');
    // absolute url
    var absoluteUrl = protocol + "://" + host + originalUrl;
    keys.forEach(function (key) {
        switch (key) {
            case 'headers':
                requestData.headers = headers;
                break;
            case 'method':
                requestData.method = method;
                break;
            case 'url':
                requestData.url = absoluteUrl;
                break;
            case 'cookies':
                // cookies:
                //   node, express, koa: req.headers.cookie
                //   vercel, sails.js, express (w/ cookie middleware): req.cookies
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestData.cookies = req.cookies || dynamicRequire(module, 'cookie').parse(headers.cookie || '');
                break;
            case 'query_string':
                // query string:
                //   node: req.url (raw)
                //   express, koa: req.query
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                requestData.query_string = dynamicRequire(module, 'url').parse(originalUrl || '', false).query;
                break;
            case 'data':
                if (method === 'GET' || method === 'HEAD') {
                    break;
                }
                // body data:
                //   node, express, koa: req.body
                if (req.body !== undefined) {
                    requestData.data = Object(_is__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "h"])(req.body) ? req.body : JSON.stringify(Object(_object__WEBPACK_IMPORTED_MODULE_1__[/* normalize */ "d"])(req.body));
                }
                break;
            default:
                if ({}.hasOwnProperty.call(req, key)) {
                    requestData[key] = req[key];
                }
        }
    });
    return requestData;
}
//# sourceMappingURL=node.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(88)(module)))

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

module.exports = function(module) {
	if (!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANNEL = void 0;

const typescript_string_enums_1 = __webpack_require__(7);

const api_interface_1 = __webpack_require__(55); /////////////////////////////////////////////////


exports.CHANNEL = (() => {
  /*console.log('CHANNEL detection', {
      'process.env.CHANNEL': process.env.CHANNEL,
      'process.env.AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY,
      'process.env.NODE_ENV': process.env.NODE_ENV,
  })*/
  if (typescript_string_enums_1.Enum.isType(api_interface_1.ReleaseChannel, process.env.CHANNEL)) return process.env.CHANNEL;
  if (process.env.AWS_SECRET_ACCESS_KEY) return api_interface_1.ReleaseChannel.prod;
  return  false ? undefined : api_interface_1.ReleaseChannel.prod;
})();

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ 41:
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "STRICT_STANDARD_ERROR_FIELDS", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QUASI_STANDARD_ERROR_FIELDS", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS_EXTENDED", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["b"]; });

/* harmony import */ var _util_create__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createError", function() { return _util_create__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _util_normalize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(66);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizeError", function() { return _util_normalize__WEBPACK_IMPORTED_MODULE_2__["a"]; });






/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(83);

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

module.exports = convert;

// Hide .channels and .labels properties
for (const model of Object.keys(convert)) {
	if (!('channels' in convert[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert[model].labels.length !== convert[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert[model];
	delete convert[model].channels;
	delete convert[model].labels;
	Object.defineProperty(convert[model], 'channels', {value: channels});
	Object.defineProperty(convert[model], 'labels', {value: labels});
}

convert.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert.rgb.lab = function (rgb) {
	const xyz = convert.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hsv = convert.gray.hsl;

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};


/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(20);
const tty = __webpack_require__(45);
const hasFlag = __webpack_require__(85);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isError; });
/* unused harmony export isErrorEvent */
/* unused harmony export isDOMError */
/* unused harmony export isDOMException */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isPrimitive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isPlainObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isRegExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return isThenable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return isSyntheticEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isInstanceOf; });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isError(wat) {
    switch (Object.prototype.toString.call(wat)) {
        case '[object Error]':
            return true;
        case '[object Exception]':
            return true;
        case '[object DOMException]':
            return true;
        default:
            return isInstanceOf(wat, Error);
    }
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isErrorEvent(wat) {
    return Object.prototype.toString.call(wat) === '[object ErrorEvent]';
}
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMError(wat) {
    return Object.prototype.toString.call(wat) === '[object DOMError]';
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isDOMException(wat) {
    return Object.prototype.toString.call(wat) === '[object DOMException]';
}
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isString(wat) {
    return Object.prototype.toString.call(wat) === '[object String]';
}
/**
 * Checks whether given value's is a primitive (undefined, null, number, boolean, string)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPrimitive(wat) {
    return wat === null || (typeof wat !== 'object' && typeof wat !== 'function');
}
/**
 * Checks whether given value's type is an object literal
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isPlainObject(wat) {
    return Object.prototype.toString.call(wat) === '[object Object]';
}
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isEvent(wat) {
    return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isElement(wat) {
    return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isRegExp(wat) {
    return Object.prototype.toString.call(wat) === '[object RegExp]';
}
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */
function isThenable(wat) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Boolean(wat && wat.then && typeof wat.then === 'function');
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isSyntheticEvent(wat) {
    return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */
function isInstanceOf(wat, base) {
    try {
        return wat instanceof base;
    }
    catch (_e) {
        return false;
    }
}
//# sourceMappingURL=is.js.map

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_id_from_path = exports.get_key_from_path = exports.loosely_get_clean_path = exports.get_relevant_path_segments = exports.create_error = void 0;

const http_1 = __webpack_require__(30);

const error_utils_1 = __webpack_require__(42);

const consts_1 = __webpack_require__(26); // TODO extern


function create_error(message, details = {}, SEC) {
  console.log(`FYI create_error("${message}"`, details, ') from', SEC === null || SEC === void 0 ? void 0 : SEC.getLogicalStack());

  if (message && http_1.STATUS_CODES[message]) {
    details.statusCode = Number(message);
    message = http_1.STATUS_CODES[details.statusCode];
  } //console.log('CE', SEC.getLogicalStack(), '\n', SEC.getShortLogicalStack())


  const err = SEC ? SEC.createError(String(message), details) : error_utils_1.createError(String(message), details);
  err.framesToPop++;
  return err;
}

exports.create_error = create_error;
const NETLIFY_ROOT = '/.netlify/functions'; // return [function id]/the/rest

function get_relevant_path_segments(event) {
  const original_path = event.path;
  let normalized_path = original_path;
  const has_trailing_slash = normalized_path.endsWith('/');
  if (has_trailing_slash) normalized_path = normalized_path.slice(0, -1);
  const has_useless_root = normalized_path.startsWith(NETLIFY_ROOT);
  if (has_useless_root) normalized_path = normalized_path.slice(NETLIFY_ROOT.length);
  const has_useless_prefix_slash = normalized_path.startsWith('/');
  if (has_useless_prefix_slash) normalized_path = normalized_path.slice(1);
  const segments = normalized_path.split('/');
  console.log('get_relevant_path_segments()', {
    original_path,
    normalized_path,
    segments
  });
  return segments;
}

exports.get_relevant_path_segments = get_relevant_path_segments;

function loosely_get_clean_path(event) {
  try {
    return get_relevant_path_segments(event).join('/');
  } catch {
    return event === null || event === void 0 ? void 0 : event.path;
  }
}

exports.loosely_get_clean_path = loosely_get_clean_path;

function get_key_from_path(event, {
  expected_fn,
  expected_segment_count = 2
} = {}) {
  const segments = get_relevant_path_segments(event);
  const actual_fn = segments.shift();

  if (expected_fn && actual_fn !== expected_fn) {
    throw create_error(`Unexpected fn "${actual_fn}" vs. "${expected_fn}"!`, {
      statusCode: 500
    });
  }

  const key = segments.pop();

  if (expected_segment_count !== null && segments.length !== expected_segment_count - 2) {
    throw create_error(`Too many path segments!`, {
      statusCode: consts_1.HTTP_STATUS_CODE.error.client.bad_request
    });
  }

  if (!key) {
    throw create_error(`Missing key!`, {
      statusCode: consts_1.HTTP_STATUS_CODE.error.client.bad_request
    });
  }

  return key;
}

exports.get_key_from_path = get_key_from_path;

function get_id_from_path(event, params = {}) {
  const key = get_key_from_path(event, params);
  const num = Number(key);

  if (String(num) !== key) {
    throw create_error(`Id is not an integer!`, {
      statusCode: consts_1.HTTP_STATUS_CODE.error.client.bad_request
    });
  }

  if (!Number.isSafeInteger(num)) {
    throw create_error(`Id is not a safe integer!`, {
      statusCode: consts_1.HTTP_STATUS_CODE.error.client.bad_request
    });
  }

  return num;
}

exports.get_id_from_path = get_id_from_path;

/***/ }),

/***/ 547:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
        return false;
    }
    for (var i = 0; i < newInputs.length; i++) {
        if (newInputs[i] !== lastInputs[i]) {
            return false;
        }
    }
    return true;
}

function memoizeOne(resultFn, isEqual) {
    if (isEqual === void 0) { isEqual = areInputsEqual; }
    var lastThis;
    var lastArgs = [];
    var lastResult;
    var calledOnce = false;
    function memoized() {
        var newArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            newArgs[_i] = arguments[_i];
        }
        if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
            return lastResult;
        }
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }
    return memoized;
}

/* harmony default export */ __webpack_exports__["default"] = (memoizeOne);


/***/ }),

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "LIB", function() { return /* reexport */ LIB; });
__webpack_require__.d(__webpack_exports__, "HEADER_IMPERSONATE", function() { return /* reexport */ HEADER_IMPERSONATE; });
__webpack_require__.d(__webpack_exports__, "Endpoint", function() { return /* reexport */ Endpoint; });
__webpack_require__.d(__webpack_exports__, "SERVER_RESPONSE_VERSION", function() { return /* reexport */ SERVER_RESPONSE_VERSION; });
__webpack_require__.d(__webpack_exports__, "ReleaseChannel", function() { return /* reexport */ ReleaseChannel; });
__webpack_require__.d(__webpack_exports__, "get_allowed_origin", function() { return /* reexport */ get_allowed_origin; });
__webpack_require__.d(__webpack_exports__, "get_api_base_url", function() { return /* reexport */ get_api_base_url; });
__webpack_require__.d(__webpack_exports__, "create_server_response_body__blank", function() { return /* reexport */ create_server_response_body__blank; });
__webpack_require__.d(__webpack_exports__, "create_server_response_body__error", function() { return /* reexport */ create_server_response_body__error; });
__webpack_require__.d(__webpack_exports__, "create_server_response_body__data", function() { return /* reexport */ create_server_response_body__data; });
__webpack_require__.d(__webpack_exports__, "is_server_response_body", function() { return /* reexport */ is_server_response_body; });

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/typescript-string-enums/dist/index.js
var dist = __webpack_require__(7);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/api-interface/dist/src.es2019/consts.js
 /////////////////////////////////////////////////

const LIB = '@online-adventur.es/api-interface'; /////////////////////////////////////////////////

const HEADER_IMPERSONATE = "X-OFFIRMO-IMPERSONATE".toLowerCase(); // tslint:disable-next-line: variable-name

const Endpoint = Object(dist["Enum"])('whoami', 'report-error', 'key-value', // dev
'echo', 'hello-world', 'hello-world-advanced', 'test-error-handling', 'temp');
const SERVER_RESPONSE_VERSION = 1;
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/api-interface/dist/src.es2019/types.js
 // tslint:disable-next-line: variable-name

const ReleaseChannel = Object(dist["Enum"])('prod', 'staging', 'dev');
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-placeholder/dist/src.es2019/index.js + 2 modules
var src_es2019 = __webpack_require__(31);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/api-interface/dist/src.es2019/utils.js

 /////////////////////////////////////////////////

function get_allowed_origin(channel) {
  switch (channel) {
    case 'dev':
      return 'http://localhost:8080';

    case 'staging':
      return 'https://offirmo-monorepo.netlify.app';

    case 'prod':
      return 'https://www.online-adventur.es';

    default:
      throw new Error(`[${LIB}] no allowed origin for channel "${channel}"!`);
  }
}

function _get_api_base_url(channel) {
  switch (channel) {
    case 'dev':
      return 'http://localhost:9000';

    case 'staging':
      return 'https://offirmo-monorepo.netlify.app/.netlify/functions';

    case 'prod':
      return 'https://www.online-adventur.es/.netlify/functions';

    default:
      if (channel === 'unknown') return 'http://test.test';
      throw new Error(`[${LIB}] no base URL for channel "${channel}"!`);
  }
}

function get_api_base_url(channel) {
  return Object(src_es2019["b" /* overrideHook */])('api-base-url', _get_api_base_url(channel));
}
function create_server_response_body__blank() {
  return {
    v: SERVER_RESPONSE_VERSION,
    data: undefined,
    error: undefined,
    side: {},
    meta: {}
  };
}
function create_server_response_body__error(error) {
  var _a, _b;

  const body = create_server_response_body__blank();
  body.error = {
    message: error.message,
    code: error.code,
    logical_stack: (_b = (_a = error._temp) === null || _a === void 0 ? void 0 : _a.SEC) === null || _b === void 0 ? void 0 : _b.getLogicalStack()
  };
  return body;
}
function create_server_response_body__data(data) {
  const body = create_server_response_body__blank();
  body.data = data;
  return body;
}
function is_server_response_body(body) {
  return body && body.v && body.side && body.meta && (body.data || body.error);
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/api-interface/dist/src.es2019/index.js




/***/ }),

/***/ 56:
/***/ (function(module, exports) {

/**
 * Diff Match and Patch
 * Copyright 2018 The diff-match-patch Authors.
 * https://github.com/google/diff-match-patch
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Computes the difference between two texts to create a patch.
 * Applies the patch onto another text, allowing for errors.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Class containing the diff, match and patch methods.
 * @constructor
 */
var diff_match_patch = function() {

  // Defaults.
  // Redefine these in your program to override the defaults.

  // Number of seconds to map a diff before giving up (0 for infinity).
  this.Diff_Timeout = 1.0;
  // Cost of an empty edit operation in terms of edit characters.
  this.Diff_EditCost = 4;
  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
  this.Match_Threshold = 0.5;
  // How far to search for a match (0 = exact location, 1000+ = broad match).
  // A match this many characters away from the expected location will add
  // 1.0 to the score (0.0 is a perfect match).
  this.Match_Distance = 1000;
  // When deleting a large block of text (over ~64 characters), how close do
  // the contents have to be to match the expected contents. (0.0 = perfection,
  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
  // end points of a delete need to match.
  this.Patch_DeleteThreshold = 0.5;
  // Chunk size for context length.
  this.Patch_Margin = 4;

  // The number of bits in an int.
  this.Match_MaxBits = 32;
};


//  DIFF FUNCTIONS


/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/**
 * Class representing one diff tuple.
 * ~Attempts to look like a two-element array (which is what this used to be).~
 * Constructor returns an actual two-element array, to allow destructing @JackuB
 * See https://github.com/JackuB/diff-match-patch/issues/14 for details
 * @param {number} op Operation, one of: DIFF_DELETE, DIFF_INSERT, DIFF_EQUAL.
 * @param {string} text Text to be deleted, inserted, or retained.
 * @constructor
 */
diff_match_patch.Diff = function(op, text) {
  return [op, text];
};

/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
 *     then don't run a line-level diff first to identify the changed areas.
 *     Defaults to true, which does a faster, slightly less optimal diff.
 * @param {number=} opt_deadline Optional time when the diff should be complete
 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
 *     instead.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 */
diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
    opt_deadline) {
  // Set a deadline by which time the diff must be complete.
  if (typeof opt_deadline == 'undefined') {
    if (this.Diff_Timeout <= 0) {
      opt_deadline = Number.MAX_VALUE;
    } else {
      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
    }
  }
  var deadline = opt_deadline;

  // Check for null inputs.
  if (text1 == null || text2 == null) {
    throw new Error('Null input. (diff_main)');
  }

  // Check for equality (speedup).
  if (text1 == text2) {
    if (text1) {
      return [new diff_match_patch.Diff(DIFF_EQUAL, text1)];
    }
    return [];
  }

  if (typeof opt_checklines == 'undefined') {
    opt_checklines = true;
  }
  var checklines = opt_checklines;

  // Trim off common prefix (speedup).
  var commonlength = this.diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = this.diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL, commonprefix));
  }
  if (commonsuffix) {
    diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, commonsuffix));
  }
  this.diff_cleanupMerge(diffs);
  return diffs;
};


/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {boolean} checklines Speedup flag.  If false, then don't run a
 *     line-level diff first to identify the changed areas.
 *     If true, then run a faster, slightly less optimal diff.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
    deadline) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [new diff_match_patch.Diff(DIFF_INSERT, text2)];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [new diff_match_patch.Diff(DIFF_DELETE, text1)];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i != -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [new diff_match_patch.Diff(DIFF_INSERT, longtext.substring(0, i)),
             new diff_match_patch.Diff(DIFF_EQUAL, shorttext),
             new diff_match_patch.Diff(DIFF_INSERT,
                 longtext.substring(i + shorttext.length))];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length == 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [new diff_match_patch.Diff(DIFF_DELETE, text1),
            new diff_match_patch.Diff(DIFF_INSERT, text2)];
  }

  // Check to see if the problem can be split in two.
  var hm = this.diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
    // Merge the results.
    return diffs_a.concat([new diff_match_patch.Diff(DIFF_EQUAL, mid_common)],
                          diffs_b);
  }

  if (checklines && text1.length > 100 && text2.length > 100) {
    return this.diff_lineMode_(text1, text2, deadline);
  }

  return this.diff_bisect_(text1, text2, deadline);
};


/**
 * Do a quick line-level diff on both strings, then rediff the parts for
 * greater accuracy.
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time when the diff should be complete by.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
  // Scan the text on a line-by-line basis first.
  var a = this.diff_linesToChars_(text1, text2);
  text1 = a.chars1;
  text2 = a.chars2;
  var linearray = a.lineArray;

  var diffs = this.diff_main(text1, text2, false, deadline);

  // Convert the diff back to original text.
  this.diff_charsToLines_(diffs, linearray);
  // Eliminate freak matches (e.g. blank lines)
  this.diff_cleanupSemantic(diffs);

  // Rediff any replacement blocks, this time character-by-character.
  // Add a dummy entry at the end.
  diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, ''));
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete >= 1 && count_insert >= 1) {
          // Delete the offending records and add the merged ones.
          diffs.splice(pointer - count_delete - count_insert,
                       count_delete + count_insert);
          pointer = pointer - count_delete - count_insert;
          var subDiff =
              this.diff_main(text_delete, text_insert, false, deadline);
          for (var j = subDiff.length - 1; j >= 0; j--) {
            diffs.splice(pointer, 0, subDiff[j]);
          }
          pointer = pointer + subDiff.length;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
    pointer++;
  }
  diffs.pop();  // Remove the dummy entry at the end.

  return diffs;
};


/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = (delta % 2 != 0);
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Bail out if deadline is reached.
    if ((new Date()).getTime() > deadline) {
      break;
    }

    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (x1 < text1_length && y1 < text2_length &&
             text1.charAt(x1) == text2.charAt(y1)) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (x2 < text1_length && y2 < text2_length &&
             text1.charAt(text1_length - x2 - 1) ==
             text2.charAt(text2_length - y2 - 1)) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [new diff_match_patch.Diff(DIFF_DELETE, text1),
          new diff_match_patch.Diff(DIFF_INSERT, text2)];
};


/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @param {number} deadline Time at which to bail if not yet complete.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @private
 */
diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
    deadline) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = this.diff_main(text1a, text2a, false, deadline);
  var diffsb = this.diff_main(text1b, text2b, false, deadline);

  return diffs.concat(diffsb);
};


/**
 * Split two texts into an array of strings.  Reduce the texts to a string of
 * hashes where each Unicode character represents one line.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
 *     An object containing the encoded text1, the encoded text2 and
 *     the array of unique strings.
 *     The zeroth element of the array of unique strings is intentionally blank.
 * @private
 */
diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

  // '\x00' is a valid character, but various debuggers don't like it.
  // So we'll insert a junk entry to avoid generating a null character.
  lineArray[0] = '';

  /**
   * Split a text into an array of strings.  Reduce the texts to a string of
   * hashes where each Unicode character represents one line.
   * Modifies linearray and linehash through being a closure.
   * @param {string} text String to encode.
   * @return {string} Encoded string.
   * @private
   */
  function diff_linesToCharsMunge_(text) {
    var chars = '';
    // Walk the text, pulling out a substring for each line.
    // text.split('\n') would would temporarily double our memory footprint.
    // Modifying text would create many large strings to garbage collect.
    var lineStart = 0;
    var lineEnd = -1;
    // Keeping our own length variable is faster than looking it up.
    var lineArrayLength = lineArray.length;
    while (lineEnd < text.length - 1) {
      lineEnd = text.indexOf('\n', lineStart);
      if (lineEnd == -1) {
        lineEnd = text.length - 1;
      }
      var line = text.substring(lineStart, lineEnd + 1);

      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
          (lineHash[line] !== undefined)) {
        chars += String.fromCharCode(lineHash[line]);
      } else {
        if (lineArrayLength == maxLines) {
          // Bail out at 65535 because
          // String.fromCharCode(65536) == String.fromCharCode(0)
          line = text.substring(lineStart);
          lineEnd = text.length;
        }
        chars += String.fromCharCode(lineArrayLength);
        lineHash[line] = lineArrayLength;
        lineArray[lineArrayLength++] = line;
      }
      lineStart = lineEnd + 1;
    }
    return chars;
  }
  // Allocate 2/3rds of the space for text1, the rest for text2.
  var maxLines = 40000;
  var chars1 = diff_linesToCharsMunge_(text1);
  maxLines = 65535;
  var chars2 = diff_linesToCharsMunge_(text2);
  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
};


/**
 * Rehydrate the text in a diff from a string of line hashes to real lines of
 * text.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {!Array.<string>} lineArray Array of unique strings.
 * @private
 */
diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
  for (var i = 0; i < diffs.length; i++) {
    var chars = diffs[i][1];
    var text = [];
    for (var j = 0; j < chars.length; j++) {
      text[j] = lineArray[chars.charCodeAt(j)];
    }
    diffs[i][1] = text.join('');
  }
};


/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: https://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (text1.substring(pointerstart, pointermid) ==
        text2.substring(pointerstart, pointermid)) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 ||
      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: https://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }
  return pointermid;
};


/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: https://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (found == 0 || text1.substring(text_length - length) ==
        text2.substring(0, length)) {
      best = length;
      length++;
    }
  }
};


/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 * @private
 */
diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
  if (this.Diff_Timeout <= 0) {
    // Don't risk returning a non-optimal diff if we have unlimited time.
    return null;
  }
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null;  // Pointless.
  }
  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = '';
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
                                               shorttext.substring(j));
      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
                                               shorttext.substring(0, j));
      if (best_common.length < suffixLength + prefixLength) {
        best_common = shorttext.substring(j - suffixLength, j) +
            shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [best_longtext_a, best_longtext_b,
              best_shorttext_a, best_shorttext_b, best_common];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 4));
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(longtext, shorttext,
                             Math.ceil(longtext.length / 2));
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
};


/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastEquality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastEquality = diffs[pointer][1];
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (lastEquality && (lastEquality.length <=
          Math.max(length_insertions1, length_deletions1)) &&
          (lastEquality.length <= Math.max(length_insertions2,
                                           length_deletions2))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     new diff_match_patch.Diff(DIFF_DELETE, lastEquality));
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0;  // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastEquality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
  this.diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (diffs[pointer - 1][0] == DIFF_DELETE &&
        diffs[pointer][0] == DIFF_INSERT) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (overlap_length1 >= deletion.length / 2 ||
            overlap_length1 >= insertion.length / 2) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0, new diff_match_patch.Diff(DIFF_EQUAL,
              insertion.substring(0, overlap_length1)));
          diffs[pointer - 1][1] =
              deletion.substring(0, deletion.length - overlap_length1);
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (overlap_length2 >= deletion.length / 2 ||
            overlap_length2 >= insertion.length / 2) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0, new diff_match_patch.Diff(DIFF_EQUAL,
              deletion.substring(0, overlap_length2)));
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] =
              insertion.substring(0, insertion.length - overlap_length2);
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] =
              deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
};


/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 &&
        char1.match(diff_match_patch.whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 &&
        char2.match(diff_match_patch.whitespaceRegex_);
    var lineBreak1 = whitespace1 &&
        char1.match(diff_match_patch.linebreakRegex_);
    var lineBreak2 = whitespace2 &&
        char2.match(diff_match_patch.linebreakRegex_);
    var blankLine1 = lineBreak1 &&
        one.match(diff_match_patch.blanklineEndRegex_);
    var blankLine2 = lineBreak2 &&
        two.match(diff_match_patch.blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = this.diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score = diff_cleanupSemanticScore_(equality1, edit) +
            diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
};

// Define some regex patterns for matching boundaries.
diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
diff_match_patch.whitespaceRegex_ = /\s/;
diff_match_patch.linebreakRegex_ = /[\r\n]/;
diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Reduce the number of edits by eliminating operationally trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
  var changes = false;
  var equalities = [];  // Stack of indices where equalities are found.
  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastEquality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0;  // Index of current position.
  // Is there an insertion operation before the last equality.
  var pre_ins = false;
  // Is there a deletion operation before the last equality.
  var pre_del = false;
  // Is there an insertion operation after the last equality.
  var post_ins = false;
  // Is there a deletion operation after the last equality.
  var post_del = false;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
      if (diffs[pointer][1].length < this.Diff_EditCost &&
          (post_ins || post_del)) {
        // Candidate found.
        equalities[equalitiesLength++] = pointer;
        pre_ins = post_ins;
        pre_del = post_del;
        lastEquality = diffs[pointer][1];
      } else {
        // Not a candidate, and can never become one.
        equalitiesLength = 0;
        lastEquality = null;
      }
      post_ins = post_del = false;
    } else {  // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_DELETE) {
        post_del = true;
      } else {
        post_ins = true;
      }
      /*
       * Five types to be split:
       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
       * <ins>A</ins>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<ins>C</ins>
       * <ins>A</del>X<ins>C</ins><del>D</del>
       * <ins>A</ins><del>B</del>X<del>C</del>
       */
      if (lastEquality && ((pre_ins && pre_del && post_ins && post_del) ||
                           ((lastEquality.length < this.Diff_EditCost / 2) &&
                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0,
                     new diff_match_patch.Diff(DIFF_DELETE, lastEquality));
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        equalitiesLength--;  // Throw away the equality we just deleted;
        lastEquality = null;
        if (pre_ins && pre_del) {
          // No changes made which could affect previous entry, keep going.
          post_ins = post_del = true;
          equalitiesLength = 0;
        } else {
          equalitiesLength--;  // Throw away the previous equality.
          pointer = equalitiesLength > 0 ?
              equalities[equalitiesLength - 1] : -1;
          post_ins = post_del = false;
        }
        changes = true;
      }
    }
    pointer++;
  }

  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
  // Add a dummy entry at the end.
  diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, ''));
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = '';
  var text_insert = '';
  var commonlength;
  while (pointer < diffs.length) {
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        // Upon reaching an equality, check for prior redundancies.
        if (count_delete + count_insert > 1) {
          if (count_delete !== 0 && count_insert !== 0) {
            // Factor out any common prefixies.
            commonlength = this.diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if ((pointer - count_delete - count_insert) > 0 &&
                  diffs[pointer - count_delete - count_insert - 1][0] ==
                  DIFF_EQUAL) {
                diffs[pointer - count_delete - count_insert - 1][1] +=
                    text_insert.substring(0, commonlength);
              } else {
                diffs.splice(0, 0, new diff_match_patch.Diff(DIFF_EQUAL,
                    text_insert.substring(0, commonlength)));
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixies.
            commonlength = this.diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] = text_insert.substring(text_insert.length -
                  commonlength) + diffs[pointer][1];
              text_insert = text_insert.substring(0, text_insert.length -
                  commonlength);
              text_delete = text_delete.substring(0, text_delete.length -
                  commonlength);
            }
          }
          // Delete the offending records and add the merged ones.
          pointer -= count_delete + count_insert;
          diffs.splice(pointer, count_delete + count_insert);
          if (text_delete.length) {
            diffs.splice(pointer, 0,
                new diff_match_patch.Diff(DIFF_DELETE, text_delete));
            pointer++;
          }
          if (text_insert.length) {
            diffs.splice(pointer, 0,
                new diff_match_patch.Diff(DIFF_INSERT, text_insert));
            pointer++;
          }
          pointer++;
        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = '';
        text_insert = '';
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === '') {
    diffs.pop();  // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
        diffs[pointer + 1][0] == DIFF_EQUAL) {
      // This is a single edit surrounded by equalities.
      if (diffs[pointer][1].substring(diffs[pointer][1].length -
          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] = diffs[pointer - 1][1] +
            diffs[pointer][1].substring(0, diffs[pointer][1].length -
                                        diffs[pointer - 1][1].length);
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
          diffs[pointer + 1][1]) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
            diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    this.diff_cleanupMerge(diffs);
  }
};


/**
 * loc is a location in text1, compute and return the equivalent location in
 * text2.
 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @param {number} loc Location within text1.
 * @return {number} Location within text2.
 */
diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
  var chars1 = 0;
  var chars2 = 0;
  var last_chars1 = 0;
  var last_chars2 = 0;
  var x;
  for (x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
      chars1 += diffs[x][1].length;
    }
    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
      chars2 += diffs[x][1].length;
    }
    if (chars1 > loc) {  // Overshot the location.
      break;
    }
    last_chars1 = chars1;
    last_chars2 = chars2;
  }
  // Was the location was deleted?
  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
    return last_chars2;
  }
  // Add the remaining character length.
  return last_chars2 + (loc - last_chars1);
};


/**
 * Convert a diff array into a pretty HTML report.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} HTML representation.
 */
diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
  var html = [];
  var pattern_amp = /&/g;
  var pattern_lt = /</g;
  var pattern_gt = />/g;
  var pattern_para = /\n/g;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];    // Operation (insert, delete, equal)
    var data = diffs[x][1];  // Text of change.
    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
    switch (op) {
      case DIFF_INSERT:
        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
        break;
      case DIFF_DELETE:
        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
        break;
      case DIFF_EQUAL:
        html[x] = '<span>' + text + '</span>';
        break;
    }
  }
  return html.join('');
};


/**
 * Compute and return the source text (all equalities and deletions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Source text.
 */
diff_match_patch.prototype.diff_text1 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_INSERT) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute and return the destination text (all equalities and insertions).
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Destination text.
 */
diff_match_patch.prototype.diff_text2 = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    if (diffs[x][0] !== DIFF_DELETE) {
      text[x] = diffs[x][1];
    }
  }
  return text.join('');
};


/**
 * Compute the Levenshtein distance; the number of inserted, deleted or
 * substituted characters.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {number} Number of changes.
 */
diff_match_patch.prototype.diff_levenshtein = function(diffs) {
  var levenshtein = 0;
  var insertions = 0;
  var deletions = 0;
  for (var x = 0; x < diffs.length; x++) {
    var op = diffs[x][0];
    var data = diffs[x][1];
    switch (op) {
      case DIFF_INSERT:
        insertions += data.length;
        break;
      case DIFF_DELETE:
        deletions += data.length;
        break;
      case DIFF_EQUAL:
        // A deletion and an insertion is one substitution.
        levenshtein += Math.max(insertions, deletions);
        insertions = 0;
        deletions = 0;
        break;
    }
  }
  levenshtein += Math.max(insertions, deletions);
  return levenshtein;
};


/**
 * Crush the diff into an encoded string which describes the operations
 * required to transform text1 into text2.
 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 * @return {string} Delta text.
 */
diff_match_patch.prototype.diff_toDelta = function(diffs) {
  var text = [];
  for (var x = 0; x < diffs.length; x++) {
    switch (diffs[x][0]) {
      case DIFF_INSERT:
        text[x] = '+' + encodeURI(diffs[x][1]);
        break;
      case DIFF_DELETE:
        text[x] = '-' + diffs[x][1].length;
        break;
      case DIFF_EQUAL:
        text[x] = '=' + diffs[x][1].length;
        break;
    }
  }
  return text.join('\t').replace(/%20/g, ' ');
};


/**
 * Given the original text1, and an encoded string which describes the
 * operations required to transform text1 into text2, compute the full diff.
 * @param {string} text1 Source string for the diff.
 * @param {string} delta Delta text.
 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
  var diffs = [];
  var diffsLength = 0;  // Keeping our own length var is faster in JS.
  var pointer = 0;  // Cursor in text1
  var tokens = delta.split(/\t/g);
  for (var x = 0; x < tokens.length; x++) {
    // Each token begins with a one character parameter which specifies the
    // operation of this token (delete, insert, equality).
    var param = tokens[x].substring(1);
    switch (tokens[x].charAt(0)) {
      case '+':
        try {
          diffs[diffsLength++] =
              new diff_match_patch.Diff(DIFF_INSERT, decodeURI(param));
        } catch (ex) {
          // Malformed URI sequence.
          throw new Error('Illegal escape in diff_fromDelta: ' + param);
        }
        break;
      case '-':
        // Fall through.
      case '=':
        var n = parseInt(param, 10);
        if (isNaN(n) || n < 0) {
          throw new Error('Invalid number in diff_fromDelta: ' + param);
        }
        var text = text1.substring(pointer, pointer += n);
        if (tokens[x].charAt(0) == '=') {
          diffs[diffsLength++] = new diff_match_patch.Diff(DIFF_EQUAL, text);
        } else {
          diffs[diffsLength++] = new diff_match_patch.Diff(DIFF_DELETE, text);
        }
        break;
      default:
        // Blank tokens are ok (from a trailing \t).
        // Anything else is an error.
        if (tokens[x]) {
          throw new Error('Invalid diff operation in diff_fromDelta: ' +
                          tokens[x]);
        }
    }
  }
  if (pointer != text1.length) {
    throw new Error('Delta length (' + pointer +
        ') does not equal source text length (' + text1.length + ').');
  }
  return diffs;
};


//  MATCH FUNCTIONS


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc'.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 */
diff_match_patch.prototype.match_main = function(text, pattern, loc) {
  // Check for null inputs.
  if (text == null || pattern == null || loc == null) {
    throw new Error('Null input. (match_main)');
  }

  loc = Math.max(0, Math.min(loc, text.length));
  if (text == pattern) {
    // Shortcut (potentially not guaranteed by the algorithm)
    return 0;
  } else if (!text.length) {
    // Nothing to match.
    return -1;
  } else if (text.substring(loc, loc + pattern.length) == pattern) {
    // Perfect match at the perfect spot!  (Includes case of null pattern)
    return loc;
  } else {
    // Do a fuzzy compare.
    return this.match_bitap_(text, pattern, loc);
  }
};


/**
 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
 * Bitap algorithm.
 * @param {string} text The text to search.
 * @param {string} pattern The pattern to search for.
 * @param {number} loc The location to search around.
 * @return {number} Best match index or -1.
 * @private
 */
diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
  if (pattern.length > this.Match_MaxBits) {
    throw new Error('Pattern too long for this browser.');
  }

  // Initialise the alphabet.
  var s = this.match_alphabet_(pattern);

  var dmp = this;  // 'this' becomes 'window' in a closure.

  /**
   * Compute and return the score for a match with e errors and x location.
   * Accesses loc and pattern through being a closure.
   * @param {number} e Number of errors in match.
   * @param {number} x Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  function match_bitapScore_(e, x) {
    var accuracy = e / pattern.length;
    var proximity = Math.abs(loc - x);
    if (!dmp.Match_Distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy;
    }
    return accuracy + (proximity / dmp.Match_Distance);
  }

  // Highest score beyond which we give up.
  var score_threshold = this.Match_Threshold;
  // Is there a nearby exact match? (speedup)
  var best_loc = text.indexOf(pattern, loc);
  if (best_loc != -1) {
    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
    // What about in the other direction? (speedup)
    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
    if (best_loc != -1) {
      score_threshold =
          Math.min(match_bitapScore_(0, best_loc), score_threshold);
    }
  }

  // Initialise the bit arrays.
  var matchmask = 1 << (pattern.length - 1);
  best_loc = -1;

  var bin_min, bin_mid;
  var bin_max = pattern.length + text.length;
  var last_rd;
  for (var d = 0; d < pattern.length; d++) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from 'loc' we can stray at this
    // error level.
    bin_min = 0;
    bin_mid = bin_max;
    while (bin_min < bin_mid) {
      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
        bin_min = bin_mid;
      } else {
        bin_max = bin_mid;
      }
      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
    }
    // Use the result from this iteration as the maximum for the next.
    bin_max = bin_mid;
    var start = Math.max(1, loc - bin_mid + 1);
    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

    var rd = Array(finish + 2);
    rd[finish + 1] = (1 << d) - 1;
    for (var j = finish; j >= start; j--) {
      // The alphabet (s) is a sparse hash, so the following line generates
      // warnings.
      var charMatch = s[text.charAt(j - 1)];
      if (d === 0) {  // First pass: exact match.
        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
      } else {  // Subsequent passes: fuzzy match.
        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
                last_rd[j + 1];
      }
      if (rd[j] & matchmask) {
        var score = match_bitapScore_(d, j - 1);
        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (score <= score_threshold) {
          // Told you so.
          score_threshold = score;
          best_loc = j - 1;
          if (best_loc > loc) {
            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * loc - best_loc);
          } else {
            // Already passed loc, downhill from here on in.
            break;
          }
        }
      }
    }
    // No hope for a (better) match at greater error levels.
    if (match_bitapScore_(d + 1, loc) > score_threshold) {
      break;
    }
    last_rd = rd;
  }
  return best_loc;
};


/**
 * Initialise the alphabet for the Bitap algorithm.
 * @param {string} pattern The text to encode.
 * @return {!Object} Hash of character locations.
 * @private
 */
diff_match_patch.prototype.match_alphabet_ = function(pattern) {
  var s = {};
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] = 0;
  }
  for (var i = 0; i < pattern.length; i++) {
    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
  }
  return s;
};


//  PATCH FUNCTIONS


/**
 * Increase the context until it is unique,
 * but don't let the pattern expand beyond Match_MaxBits.
 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
 * @param {string} text Source text.
 * @private
 */
diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
  if (text.length == 0) {
    return;
  }
  if (patch.start2 === null) {
    throw Error('patch not initialized');
  }
  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
  var padding = 0;

  // Look for the first and last matches of pattern in text.  If two different
  // matches are found, increase the pattern length.
  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
         pattern.length < this.Match_MaxBits - this.Patch_Margin -
         this.Patch_Margin) {
    padding += this.Patch_Margin;
    pattern = text.substring(patch.start2 - padding,
                             patch.start2 + patch.length1 + padding);
  }
  // Add one chunk for good luck.
  padding += this.Patch_Margin;

  // Add the prefix.
  var prefix = text.substring(patch.start2 - padding, patch.start2);
  if (prefix) {
    patch.diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL, prefix));
  }
  // Add the suffix.
  var suffix = text.substring(patch.start2 + patch.length1,
                              patch.start2 + patch.length1 + padding);
  if (suffix) {
    patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, suffix));
  }

  // Roll back the start points.
  patch.start1 -= prefix.length;
  patch.start2 -= prefix.length;
  // Extend the lengths.
  patch.length1 += prefix.length + suffix.length;
  patch.length2 += prefix.length + suffix.length;
};


/**
 * Compute a list of patches to turn text1 into text2.
 * Use diffs if provided, otherwise compute it ourselves.
 * There are four ways to call this function, depending on what data is
 * available to the caller:
 * Method 1:
 * a = text1, b = text2
 * Method 2:
 * a = diffs
 * Method 3 (optimal):
 * a = text1, b = diffs
 * Method 4 (deprecated, use method 3):
 * a = text1, b = text2, c = diffs
 *
 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
 * Array of diff tuples for text1 to text2 (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>=} opt_b text2 (methods 1,4) or
 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
 * @param {string|!Array.<!diff_match_patch.Diff>=} opt_c Array of diff tuples
 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
  var text1, diffs;
  if (typeof a == 'string' && typeof opt_b == 'string' &&
      typeof opt_c == 'undefined') {
    // Method 1: text1, text2
    // Compute diffs from text1 and text2.
    text1 = /** @type {string} */(a);
    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
    if (diffs.length > 2) {
      this.diff_cleanupSemantic(diffs);
      this.diff_cleanupEfficiency(diffs);
    }
  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
      typeof opt_c == 'undefined') {
    // Method 2: diffs
    // Compute text1 from diffs.
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
    text1 = this.diff_text1(diffs);
  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
      typeof opt_c == 'undefined') {
    // Method 3: text1, diffs
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
      opt_c && typeof opt_c == 'object') {
    // Method 4: text1, text2, diffs
    // text2 is not used.
    text1 = /** @type {string} */(a);
    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
  } else {
    throw new Error('Unknown call format to patch_make.');
  }

  if (diffs.length === 0) {
    return [];  // Get rid of the null case.
  }
  var patches = [];
  var patch = new diff_match_patch.patch_obj();
  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
  var char_count1 = 0;  // Number of characters into the text1 string.
  var char_count2 = 0;  // Number of characters into the text2 string.
  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
  // text2 (postpatch_text).  We recreate the patches one by one to determine
  // context info.
  var prepatch_text = text1;
  var postpatch_text = text1;
  for (var x = 0; x < diffs.length; x++) {
    var diff_type = diffs[x][0];
    var diff_text = diffs[x][1];

    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
      // A new patch starts here.
      patch.start1 = char_count1;
      patch.start2 = char_count2;
    }

    switch (diff_type) {
      case DIFF_INSERT:
        patch.diffs[patchDiffLength++] = diffs[x];
        patch.length2 += diff_text.length;
        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
                         postpatch_text.substring(char_count2);
        break;
      case DIFF_DELETE:
        patch.length1 += diff_text.length;
        patch.diffs[patchDiffLength++] = diffs[x];
        postpatch_text = postpatch_text.substring(0, char_count2) +
                         postpatch_text.substring(char_count2 +
                             diff_text.length);
        break;
      case DIFF_EQUAL:
        if (diff_text.length <= 2 * this.Patch_Margin &&
            patchDiffLength && diffs.length != x + 1) {
          // Small equality inside a patch.
          patch.diffs[patchDiffLength++] = diffs[x];
          patch.length1 += diff_text.length;
          patch.length2 += diff_text.length;
        } else if (diff_text.length >= 2 * this.Patch_Margin) {
          // Time for a new patch.
          if (patchDiffLength) {
            this.patch_addContext_(patch, prepatch_text);
            patches.push(patch);
            patch = new diff_match_patch.patch_obj();
            patchDiffLength = 0;
            // Unlike Unidiff, our patch lists have a rolling context.
            // https://github.com/google/diff-match-patch/wiki/Unidiff
            // Update prepatch text & pos to reflect the application of the
            // just completed patch.
            prepatch_text = postpatch_text;
            char_count1 = char_count2;
          }
        }
        break;
    }

    // Update the current character count.
    if (diff_type !== DIFF_INSERT) {
      char_count1 += diff_text.length;
    }
    if (diff_type !== DIFF_DELETE) {
      char_count2 += diff_text.length;
    }
  }
  // Pick up the leftover patch if not empty.
  if (patchDiffLength) {
    this.patch_addContext_(patch, prepatch_text);
    patches.push(patch);
  }

  return patches;
};


/**
 * Given an array of patches, return another array that is identical.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 */
diff_match_patch.prototype.patch_deepCopy = function(patches) {
  // Making deep copies is hard in JavaScript.
  var patchesCopy = [];
  for (var x = 0; x < patches.length; x++) {
    var patch = patches[x];
    var patchCopy = new diff_match_patch.patch_obj();
    patchCopy.diffs = [];
    for (var y = 0; y < patch.diffs.length; y++) {
      patchCopy.diffs[y] =
          new diff_match_patch.Diff(patch.diffs[y][0], patch.diffs[y][1]);
    }
    patchCopy.start1 = patch.start1;
    patchCopy.start2 = patch.start2;
    patchCopy.length1 = patch.length1;
    patchCopy.length2 = patch.length2;
    patchesCopy[x] = patchCopy;
  }
  return patchesCopy;
};


/**
 * Merge a set of patches onto the text.  Return a patched text, as well
 * as a list of true/false values indicating which patches were applied.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @param {string} text Old text.
 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
 *      new text and an array of boolean values.
 */
diff_match_patch.prototype.patch_apply = function(patches, text) {
  if (patches.length == 0) {
    return [text, []];
  }

  // Deep copy the patches so that no changes are made to originals.
  patches = this.patch_deepCopy(patches);

  var nullPadding = this.patch_addPadding(patches);
  text = nullPadding + text + nullPadding;

  this.patch_splitMax(patches);
  // delta keeps track of the offset between the expected and actual location
  // of the previous patch.  If there are patches expected at positions 10 and
  // 20, but the first patch was found at 12, delta is 2 and the second patch
  // has an effective expected position of 22.
  var delta = 0;
  var results = [];
  for (var x = 0; x < patches.length; x++) {
    var expected_loc = patches[x].start2 + delta;
    var text1 = this.diff_text1(patches[x].diffs);
    var start_loc;
    var end_loc = -1;
    if (text1.length > this.Match_MaxBits) {
      // patch_splitMax will only provide an oversized pattern in the case of
      // a monster delete.
      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
                                  expected_loc);
      if (start_loc != -1) {
        end_loc = this.match_main(text,
            text1.substring(text1.length - this.Match_MaxBits),
            expected_loc + text1.length - this.Match_MaxBits);
        if (end_loc == -1 || start_loc >= end_loc) {
          // Can't find valid trailing context.  Drop this patch.
          start_loc = -1;
        }
      }
    } else {
      start_loc = this.match_main(text, text1, expected_loc);
    }
    if (start_loc == -1) {
      // No match found.  :(
      results[x] = false;
      // Subtract the delta for this failed patch from subsequent patches.
      delta -= patches[x].length2 - patches[x].length1;
    } else {
      // Found a match.  :)
      results[x] = true;
      delta = start_loc - expected_loc;
      var text2;
      if (end_loc == -1) {
        text2 = text.substring(start_loc, start_loc + text1.length);
      } else {
        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
      }
      if (text1 == text2) {
        // Perfect match, just shove the replacement text in.
        text = text.substring(0, start_loc) +
               this.diff_text2(patches[x].diffs) +
               text.substring(start_loc + text1.length);
      } else {
        // Imperfect match.  Run a diff to get a framework of equivalent
        // indices.
        var diffs = this.diff_main(text1, text2, false);
        if (text1.length > this.Match_MaxBits &&
            this.diff_levenshtein(diffs) / text1.length >
            this.Patch_DeleteThreshold) {
          // The end points match, but the content is unacceptably bad.
          results[x] = false;
        } else {
          this.diff_cleanupSemanticLossless(diffs);
          var index1 = 0;
          var index2;
          for (var y = 0; y < patches[x].diffs.length; y++) {
            var mod = patches[x].diffs[y];
            if (mod[0] !== DIFF_EQUAL) {
              index2 = this.diff_xIndex(diffs, index1);
            }
            if (mod[0] === DIFF_INSERT) {  // Insertion
              text = text.substring(0, start_loc + index2) + mod[1] +
                     text.substring(start_loc + index2);
            } else if (mod[0] === DIFF_DELETE) {  // Deletion
              text = text.substring(0, start_loc + index2) +
                     text.substring(start_loc + this.diff_xIndex(diffs,
                         index1 + mod[1].length));
            }
            if (mod[0] !== DIFF_DELETE) {
              index1 += mod[1].length;
            }
          }
        }
      }
    }
  }
  // Strip the padding off.
  text = text.substring(nullPadding.length, text.length - nullPadding.length);
  return [text, results];
};


/**
 * Add some padding on text start and end so that edges can match something.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} The padding string added to each side.
 */
diff_match_patch.prototype.patch_addPadding = function(patches) {
  var paddingLength = this.Patch_Margin;
  var nullPadding = '';
  for (var x = 1; x <= paddingLength; x++) {
    nullPadding += String.fromCharCode(x);
  }

  // Bump all the patches forward.
  for (var x = 0; x < patches.length; x++) {
    patches[x].start1 += paddingLength;
    patches[x].start2 += paddingLength;
  }

  // Add some padding on start of first diff.
  var patch = patches[0];
  var diffs = patch.diffs;
  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.unshift(new diff_match_patch.Diff(DIFF_EQUAL, nullPadding));
    patch.start1 -= paddingLength;  // Should be 0.
    patch.start2 -= paddingLength;  // Should be 0.
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[0][1].length) {
    // Grow first equality.
    var extraLength = paddingLength - diffs[0][1].length;
    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
    patch.start1 -= extraLength;
    patch.start2 -= extraLength;
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  // Add some padding on end of last diff.
  patch = patches[patches.length - 1];
  diffs = patch.diffs;
  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
    // Add nullPadding equality.
    diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, nullPadding));
    patch.length1 += paddingLength;
    patch.length2 += paddingLength;
  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
    // Grow last equality.
    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
    patch.length1 += extraLength;
    patch.length2 += extraLength;
  }

  return nullPadding;
};


/**
 * Look through the patches and break up any which are longer than the maximum
 * limit of the match algorithm.
 * Intended to be called only from within patch_apply.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 */
diff_match_patch.prototype.patch_splitMax = function(patches) {
  var patch_size = this.Match_MaxBits;
  for (var x = 0; x < patches.length; x++) {
    if (patches[x].length1 <= patch_size) {
      continue;
    }
    var bigpatch = patches[x];
    // Remove the big old patch.
    patches.splice(x--, 1);
    var start1 = bigpatch.start1;
    var start2 = bigpatch.start2;
    var precontext = '';
    while (bigpatch.diffs.length !== 0) {
      // Create one of several smaller patches.
      var patch = new diff_match_patch.patch_obj();
      var empty = true;
      patch.start1 = start1 - precontext.length;
      patch.start2 = start2 - precontext.length;
      if (precontext !== '') {
        patch.length1 = patch.length2 = precontext.length;
        patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, precontext));
      }
      while (bigpatch.diffs.length !== 0 &&
             patch.length1 < patch_size - this.Patch_Margin) {
        var diff_type = bigpatch.diffs[0][0];
        var diff_text = bigpatch.diffs[0][1];
        if (diff_type === DIFF_INSERT) {
          // Insertions are harmless.
          patch.length2 += diff_text.length;
          start2 += diff_text.length;
          patch.diffs.push(bigpatch.diffs.shift());
          empty = false;
        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
                   patch.diffs[0][0] == DIFF_EQUAL &&
                   diff_text.length > 2 * patch_size) {
          // This is a large deletion.  Let it pass in one chunk.
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          empty = false;
          patch.diffs.push(new diff_match_patch.Diff(diff_type, diff_text));
          bigpatch.diffs.shift();
        } else {
          // Deletion or equality.  Only take as much as we can stomach.
          diff_text = diff_text.substring(0,
              patch_size - patch.length1 - this.Patch_Margin);
          patch.length1 += diff_text.length;
          start1 += diff_text.length;
          if (diff_type === DIFF_EQUAL) {
            patch.length2 += diff_text.length;
            start2 += diff_text.length;
          } else {
            empty = false;
          }
          patch.diffs.push(new diff_match_patch.Diff(diff_type, diff_text));
          if (diff_text == bigpatch.diffs[0][1]) {
            bigpatch.diffs.shift();
          } else {
            bigpatch.diffs[0][1] =
                bigpatch.diffs[0][1].substring(diff_text.length);
          }
        }
      }
      // Compute the head context for the next patch.
      precontext = this.diff_text2(patch.diffs);
      precontext =
          precontext.substring(precontext.length - this.Patch_Margin);
      // Append the end context for this patch.
      var postcontext = this.diff_text1(bigpatch.diffs)
                            .substring(0, this.Patch_Margin);
      if (postcontext !== '') {
        patch.length1 += postcontext.length;
        patch.length2 += postcontext.length;
        if (patch.diffs.length !== 0 &&
            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
          patch.diffs[patch.diffs.length - 1][1] += postcontext;
        } else {
          patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, postcontext));
        }
      }
      if (!empty) {
        patches.splice(++x, 0, patch);
      }
    }
  }
};


/**
 * Take a list of patches and return a textual representation.
 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
 * @return {string} Text representation of patches.
 */
diff_match_patch.prototype.patch_toText = function(patches) {
  var text = [];
  for (var x = 0; x < patches.length; x++) {
    text[x] = patches[x];
  }
  return text.join('');
};


/**
 * Parse a textual representation of patches and return a list of Patch objects.
 * @param {string} textline Text representation of patches.
 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
 * @throws {!Error} If invalid input.
 */
diff_match_patch.prototype.patch_fromText = function(textline) {
  var patches = [];
  if (!textline) {
    return patches;
  }
  var text = textline.split('\n');
  var textPointer = 0;
  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
  while (textPointer < text.length) {
    var m = text[textPointer].match(patchHeader);
    if (!m) {
      throw new Error('Invalid patch string: ' + text[textPointer]);
    }
    var patch = new diff_match_patch.patch_obj();
    patches.push(patch);
    patch.start1 = parseInt(m[1], 10);
    if (m[2] === '') {
      patch.start1--;
      patch.length1 = 1;
    } else if (m[2] == '0') {
      patch.length1 = 0;
    } else {
      patch.start1--;
      patch.length1 = parseInt(m[2], 10);
    }

    patch.start2 = parseInt(m[3], 10);
    if (m[4] === '') {
      patch.start2--;
      patch.length2 = 1;
    } else if (m[4] == '0') {
      patch.length2 = 0;
    } else {
      patch.start2--;
      patch.length2 = parseInt(m[4], 10);
    }
    textPointer++;

    while (textPointer < text.length) {
      var sign = text[textPointer].charAt(0);
      try {
        var line = decodeURI(text[textPointer].substring(1));
      } catch (ex) {
        // Malformed URI sequence.
        throw new Error('Illegal escape in patch_fromText: ' + line);
      }
      if (sign == '-') {
        // Deletion.
        patch.diffs.push(new diff_match_patch.Diff(DIFF_DELETE, line));
      } else if (sign == '+') {
        // Insertion.
        patch.diffs.push(new diff_match_patch.Diff(DIFF_INSERT, line));
      } else if (sign == ' ') {
        // Minor equality.
        patch.diffs.push(new diff_match_patch.Diff(DIFF_EQUAL, line));
      } else if (sign == '@') {
        // Start of next patch.
        break;
      } else if (sign === '') {
        // Blank line?  Whatever.
      } else {
        // WTF?
        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
      }
      textPointer++;
    }
  }
  return patches;
};


/**
 * Class representing one patch operation.
 * @constructor
 */
diff_match_patch.patch_obj = function() {
  /** @type {!Array.<!diff_match_patch.Diff>} */
  this.diffs = [];
  /** @type {?number} */
  this.start1 = null;
  /** @type {?number} */
  this.start2 = null;
  /** @type {number} */
  this.length1 = 0;
  /** @type {number} */
  this.length2 = 0;
};


/**
 * Emulate GNU diff's format.
 * Header: @@ -382,8 +481,9 @@
 * Indices are printed as 1-based, not 0-based.
 * @return {string} The GNU diff string.
 */
diff_match_patch.patch_obj.prototype.toString = function() {
  var coords1, coords2;
  if (this.length1 === 0) {
    coords1 = this.start1 + ',0';
  } else if (this.length1 == 1) {
    coords1 = this.start1 + 1;
  } else {
    coords1 = (this.start1 + 1) + ',' + this.length1;
  }
  if (this.length2 === 0) {
    coords2 = this.start2 + ',0';
  } else if (this.length2 == 1) {
    coords2 = this.start2 + 1;
  } else {
    coords2 = (this.start2 + 1) + ',' + this.length2;
  }
  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
  var op;
  // Escape the body of the patch with %xx notation.
  for (var x = 0; x < this.diffs.length; x++) {
    switch (this.diffs[x][0]) {
      case DIFF_INSERT:
        op = '+';
        break;
      case DIFF_DELETE:
        op = '-';
        break;
      case DIFF_EQUAL:
        op = ' ';
        break;
    }
    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
  }
  return text.join('').replace(/%20/g, ' ');
};


// The following export code was added by @ForbesLindesay
module.exports = diff_match_patch;
module.exports['diff_match_patch'] = diff_match_patch;
module.exports['DIFF_DELETE'] = DIFF_DELETE;
module.exports['DIFF_INSERT'] = DIFF_INSERT;
module.exports['DIFF_EQUAL'] = DIFF_EQUAL;

/***/ }),

/***/ 566:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;
/*
process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
*/

__webpack_require__(64);

const runner_1 = __webpack_require__(184);

const require_http_method_1 = __webpack_require__(200);

const test_failure_1 = __webpack_require__(567); ////////////////////////////////////


async function _handler(SEC, event, context, response, next) {
  response.statusCode = 200;
  if (response.body === runner_1.DEFAULT_RESPONSE_BODY) response.body = JSON.stringify('Test error handling default response (no error)!');
}

const handler = (event, badly_typed_context) => {
  return runner_1.use_middlewares_with_error_safety_net(event, badly_typed_context, [require_http_method_1.require_http_method([require_http_method_1.HttpMethod.GET]), test_failure_1.test_failure, _handler]);
};

exports.handler = handler;

/***/ }),

/***/ 567:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test_failure = exports.FailureMode = void 0;

const tslib_1 = __webpack_require__(77);

const memoize_one_1 = tslib_1.__importDefault(__webpack_require__(547));

const typescript_string_enums_1 = __webpack_require__(7);

const tiny_invariant_1 = tslib_1.__importDefault(__webpack_require__(1));

const consts_1 = __webpack_require__(26);

const utils_1 = __webpack_require__(54); ////////////////////////////////////


exports.FailureMode = typescript_string_enums_1.Enum('none', 'manual', 'throw-sync', 'throw-sync-non-error', 'throw-async', 'timeout', 'rejection', 'unhandled-rejection', 'bad-status-code', 'non-json-stringified-body', 'non-stringified-body', 'non-stringifiable-body', 'no-response-set'); ////////////////////////////////////

async function test_failure(SEC, event, context, response, next) {
  const mode = event.queryStringParameters && event.queryStringParameters.mode || undefined;
  const {
    logger
  } = SEC.getInjectedDependencies();
  tiny_invariant_1.default(!mode || typescript_string_enums_1.Enum.isType(exports.FailureMode, mode), `Invalid mode, should be one and only one of: ` + typescript_string_enums_1.Enum.values(exports.FailureMode).join(', '));
  logger.info('[MW test_failure] will cause failure:', mode);
  const initial_unset_body = response.body; // starts with a response manually set to a success,
  // to check that an error will overwrite it properly

  response.statusCode = 200;
  response.body = JSON.stringify('XXX You should NOT see that, there should be an error!');
  const get_test_err = memoize_one_1.default(() => utils_1.create_error(`TEST ${mode}!`, {
    statusCode: 555
  }, SEC));

  switch (mode) {
    case undefined:
      response.statusCode = consts_1.HTTP_STATUS_CODE.error.client.bad_request;
      response.body = 'Error: Failure test: Please provide a failure mode: ' + typescript_string_enums_1.Enum.values(exports.FailureMode).join(', ');
      break;

    case exports.FailureMode['none']:
      response.statusCode = 200;
      response.body = JSON.stringify('All good, test of no error');
      await next();
      break;

    case exports.FailureMode['manual']:
      // bad idea (should throw instead) but possible
      response.statusCode = get_test_err().statusCode;
      response.body = get_test_err().message;
      break;

    case exports.FailureMode['throw-sync']:
      throw get_test_err();

    case exports.FailureMode['throw-sync-non-error']:
      throw get_test_err().message;
    // baad! throwing a string!

    case exports.FailureMode['throw-async']:
      return new Promise(() => {
        setTimeout(() => {
          throw get_test_err();
        }, 100);
      });

    case exports.FailureMode['timeout']:
      return new Promise(() => {// no resolution
      });

    case exports.FailureMode['rejection']:
      return Promise.reject(get_test_err());

    case exports.FailureMode['unhandled-rejection']:
      Promise.reject(get_test_err()); // unhandled
      // pretend otherwise OK
      // (already done, see above)

      await next();
      return;

    case exports.FailureMode['bad-status-code']:
      delete response.body;
      response.statusCode = 'foo';
      break;

    case exports.FailureMode['non-stringified-body']:
      response.statusCode = 200; // eventually, decided to support this, too convenient
      // = won't result in an error
      // see also next case

      response.body = {
        foo: 42
      };
      break;

    case exports.FailureMode['non-stringifiable-body']:
      // auto-stringification ust be possible
      const foo = {
        val: 42
      };
      foo.foo = foo;
      response.statusCode = 200;
      response.body = {
        recurse: foo
      };
      break;

    case exports.FailureMode['non-json-stringified-body']:
      response.statusCode = 200; // body should always be JSON.parse()-able

      response.body = "this is bad!";
      break;

    case exports.FailureMode['no-response-set']:
      // pretend we didn't set the body
      response.body = initial_unset_body;
      break;

    default:
      // should have been caught earlier
      throw new Error('Should never happen!');
  }
}

exports.test_failure = test_failure;

/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(148);
} else {
	module.exports = __webpack_require__(149);
}


/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "getLogger", function() { return /* binding */ src_es2019_getLogger; });
__webpack_require__.d(__webpack_exports__, "exposeInternal", function() { return /* binding */ src_es2019_exposeInternal; });
__webpack_require__.d(__webpack_exports__, "overrideHook", function() { return /* binding */ src_es2019_overrideHook; });
__webpack_require__.d(__webpack_exports__, "addDebugCommand", function() { return /* binding */ src_es2019_addDebugCommand; });
__webpack_require__.d(__webpack_exports__, "globalThis", function() { return /* binding */ src_es2019_globalThis; });
__webpack_require__.d(__webpack_exports__, "createV1", function() { return /* reexport */ v1_create; });

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/globalthis-ponyfill/dist/src.es2019/index.js
var src_es2019 = __webpack_require__(8);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/consts.js
const LIB = '@offirmo/practical-logger-core'; // level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)

const LOG_LEVEL_TO_INTEGER = {
  fatal: 1,
  emerg: 2,
  alert: 10,
  crit: 20,
  error: 30,
  warning: 40,
  warn: 40,
  notice: 45,
  info: 50,
  verbose: 70,
  log: 80,
  debug: 81,
  trace: 90,
  silly: 100
};
const ALL_LOG_LEVELS = Object.keys(LOG_LEVEL_TO_INTEGER).map(s => s).sort((a, b) => LOG_LEVEL_TO_INTEGER[a] - LOG_LEVEL_TO_INTEGER[b]); // rationalization to a clear, human understandable string
// generated to shave a few bytes
// not using fromEntries bc not available in node <12

const LOG_LEVEL_TO_HUMAN = ALL_LOG_LEVELS.reduce((acc, ll) => {
  acc[ll] = {
    em: 'emergency',
    wa: 'warn'
  }[ll.slice(0, 1)] || ll;
  return acc;
}, {});

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/consts-base.js
// base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.
const DEFAULT_LOG_LEVEL = 'error';
const DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/normalize-args.js
// TODO externalize?
function looksLikeAnError(x) {
  return !!((x === null || x === void 0 ? void 0 : x.name) && (x === null || x === void 0 ? void 0 : x.message) && (x === null || x === void 0 ? void 0 : x.stack));
} // harmonize
// also try to recover from incorrect invocations

function normalizeArguments(raw_args) {
  var _a;

  const message_parts = [];
  let details = {};
  let err = undefined;
  Array.from(raw_args).forEach(arg => {
    if (!arg) return; // errors are first class, look for them first

    if (looksLikeAnError(arg)) {
      if (!err) err = arg; // extract it

      return;
    }

    if (!err && looksLikeAnError(arg.err)) {
      err = arg.err; // extract it
      // don't return, still stuff to pick
    }

    if (typeof arg === 'object') {
      details = { ...details,
        ...arg
      };
      return;
    }

    message_parts.push(String(arg));
  });

  if (typeof details.message === 'string' && !message_parts.length) {
    message_parts.push(details.message);
    delete details.message;
  }

  const message = message_parts.join(' ') || ((_a = err) === null || _a === void 0 ? void 0 : _a.message) || '(no message)';
  if (err) details.err = err;else delete details.err; // because could be present but not be a correct err type

  return [message, details];
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/core.js


function checkLevel(level) {
  if (!ALL_LOG_LEVELS.includes(level)) throw new Error(`[${LIB}] Not a valid log level: "${level}"!`);
}
function create({
  name = DEFAULT_LOGGER_KEY,
  suggestedLevel = DEFAULT_LOG_LEVEL,
  forcedLevel,
  commonDetails = {}
} = {}, outputFn = console.log) {
  const internalState = {
    name,
    level: forcedLevel || suggestedLevel,
    commonDetails: { ...commonDetails
    },
    outputFn
  };
  let levelAsInt = 100; // so far

  const logger = ALL_LOG_LEVELS.reduce((logger, level) => {
    const primitive = function (rawMessage, rawDetails) {
      if (!isLevelEnabled(level)) return;
      const [message, details] = normalizeArguments(arguments);
      internalState.outputFn(serializer(level, message, details));
    };

    logger[level] = primitive;
    return logger;
  }, {
    setLevel,
    getLevel,
    addCommonDetails,

    group() {},

    groupCollapsed() {},

    groupEnd() {}

  });

  function setLevel(level) {
    checkLevel(level);
    internalState.level = level;
    levelAsInt = LOG_LEVEL_TO_INTEGER[level];
  }

  setLevel(getLevel()); // to check it

  function isLevelEnabled(level) {
    checkLevel(level);
    return LOG_LEVEL_TO_INTEGER[level] <= levelAsInt;
  }

  function getLevel() {
    return internalState.level;
  }

  function addCommonDetails(details) {
    if (details.err) throw new Error(`[${LIB}] Can't set reserved property "err"!`);
    internalState.commonDetails = { ...internalState.commonDetails,
      ...details
    };
  }

  function serializer(level, msg, {
    err,
    ...details
  }) {
    const payload = {
      level,
      name,
      msg,
      time: +new Date(),
      details: { ...internalState.commonDetails,
        ...details
      }
    };
    if (err) payload.err = err;
    return payload;
  }

  return logger;
}
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/chalk/source/index.js
var source = __webpack_require__(0);
var source_default = /*#__PURE__*/__webpack_require__.n(source);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/prettify-any/dist/src.es2019/injectable-lib--chalk.js
// to make this lib isomorphic, we allow dependency injections
////////////////////////////////////////////////////////////////////////////////////
let chalk = null;
function inject_lib__chalk(chalk_lib) {
  chalk = chalk_lib;
}
function get_lib__chalk() {
  return chalk;
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/prettify-any/dist/src.es2019/utils.js
////////////////////////////////////
// https://2ality.com/2012/03/signedzero.html (outdated)
function is_negative_zero(x) {
  return Object.is(x, -0);
} // https://stackoverflow.com/a/51398944/587407

const COMPARABLE_TYPES = ['number', 'string'];
function cmp(a, b) {
  const ta = typeof a;
  const tb = typeof b;
  if (ta !== tb) return cmp(ta, tb);

  if (!COMPARABLE_TYPES.includes(ta)) {
    // Very crude. mainly for symbols.
    return cmp(String(a), String(b));
  }

  return -(a < b) || +(a > b);
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/prettify-any/dist/src.es2019/options--compatible.js
 ////////////////////////////////////////////////////////////////////////////////////

const DEFAULTS_STYLE_OPTIONS = {
  max_width: null,
  outline: false,
  indent: 'tabs',
  max_primitive_str_size: null,
  should_recognize_constants: true,
  should_recognize_globals: true,
  quote: '\'',
  date_serialization_fn: 'toLocaleString'
};
const DEFAULTS_STYLIZE_OPTIONS__NONE = {
  stylize_dim: s => s,
  stylize_suspicious: s => s,
  stylize_error: s => s,
  stylize_global: s => s,
  stylize_primitive: s => s,
  stylize_syntax: s => s,
  stylize_user: s => s
};
const DEBUG = false;
const DEFAULTS_PRETTIFY_OPTIONS = {
  // TODO follow max string size
  // primitives
  prettify_string: (s, st) => {
    const {
      o
    } = st;
    return o.stylize_dim(o.quote) + o.stylize_user(s) + o.stylize_dim(o.quote);
  },
  prettify_number: (n, st) => {
    const {
      o
    } = st;

    if (o.should_recognize_constants) {
      switch (n) {
        case Number.EPSILON:
          return o.stylize_global('Number.EPSILON');

        case Number.MAX_VALUE:
          return o.stylize_global('Number.MAX_VALUE');

        case Number.MIN_VALUE:
          return o.stylize_global('Number.MIN_VALUE');

        case Number.MAX_SAFE_INTEGER:
          return o.stylize_global('Number.MAX_SAFE_INTEGER');

        case Number.MIN_SAFE_INTEGER:
          return o.stylize_global('Number.MIN_SAFE_INTEGER');

        case Math.PI:
          return o.stylize_global('Math.PI');

        case Math.E:
          return o.stylize_global('Math.E');
        // no more Math, seldom used

        default: // fallback

      }
    }

    return isNaN(n) ? o.stylize_error(String(n)) : is_negative_zero(n) ? o.stylize_error('-0') : o.stylize_primitive(String(n));
  },
  prettify_bigint: (b, st) => {
    const {
      o
    } = st;
    return o.stylize_primitive(String(b) + 'n');
  },
  prettify_boolean: (b, st) => {
    const {
      o
    } = st;
    return o.stylize_primitive(String(b));
  },
  prettify_undefined: (u, st) => {
    const {
      o
    } = st;
    return o.stylize_suspicious(String(u));
  },
  prettify_symbol: (s, st) => {
    const {
      o
    } = st;

    try {
      return '' + o.stylize_global('Symbol') + o.stylize_syntax('(') + (s.description ? o.prettify_string(s.description, st) : '') + o.stylize_syntax(')');
    } catch (err) {
      return o.stylize_error(`[error prettifying:${err.message}/ps]`);
    }
  },
  // objects
  prettify_function: (f, st, {
    as_prop = false
  } = {}) => {
    const {
      o
    } = st;

    if (f.name && globalThis[f.name] === f) {
      return o.stylize_user(f.name);
    }

    let result = '';

    if (f.name) {
      if (!as_prop) {
        // class detection may not work with Babel
        result += o.stylize_syntax(f.toString().startsWith('class ') ? 'class ' : 'function ');
      }

      result += o.stylize_user(f.name);
    }

    result += o.stylize_syntax('()');
    result += o.stylize_syntax(f.name ? ' ' : ' => ');
    result += o.stylize_syntax('{');
    result += o.stylize_dim('\/\*…\*\/');
    result += o.stylize_syntax('}');
    return result;
  },
  prettify_array: (a, st) => {
    if (DEBUG) console.log('prettify_array', a);
    st = { ...st,
      circular: new Set([...Array.from(st.circular), a])
    };
    const {
      o
    } = st;
    return o.stylize_syntax('[') + a.map(e => o.prettify_any(e, st)) // NOTE when fully empty, map won't execute (but it looks nice, no pb)
    .join(o.stylize_syntax(',')) + o.stylize_syntax(']');
  },
  prettify_property_name: (p, st) => {
    const {
      o
    } = st;

    try {
      switch (typeof p) {
        case 'number':
          return o.prettify_number(p, st);

        case 'string':
          {
            // does it need to be quoted?
            // https://mathiasbynens.be/notes/javascript-properties
            return o.prettify_string(p, st);
          }

        case 'symbol':
          return o.stylize_syntax('[') + o.prettify_symbol(p, st) + o.stylize_syntax(']');
      }
    } catch (err) {
      return o.stylize_error(`[error prettifying:${err.message}/ppn]`);
    }
  },
  prettify_object: (obj, st, {
    skip_constructor = false
  } = {}) => {
    if (DEBUG) console.log('prettify_object', obj);
    const {
      o
    } = st;

    try {
      if (obj === null) return o.stylize_primitive('null');
      if (Array.isArray(obj)) return o.prettify_array(obj, st);

      if (o.should_recognize_globals) {
        try {
          switch (obj) {
            case globalThis:
              return o.stylize_global('globalThis');

            default: // fallback

          }
        } catch (err) {
          return o.stylize_error(`[error prettifying:${err.message}/po.g]`);
        }
      }

      if (!skip_constructor) {
        try {
          const p = Object.getPrototypeOf(obj);

          if (p && p.constructor && p.constructor.name) {
            // can we do better?
            if (p.constructor !== Object) {
              return o.stylize_syntax('new ') + (globalThis[p.constructor.name] === p.constructor ? o.stylize_global(p.constructor.name) : o.stylize_user(p.constructor.name)) + o.stylize_syntax('(') + (() => {
                switch (p.constructor.name) {
                  // all primitives that can be an Object
                  case 'String':
                    return o.prettify_string(obj, st);

                  case 'Number':
                    return o.prettify_number(obj, st);

                  case 'Boolean':
                    return o.prettify_boolean(obj, st);
                  // recognize some objects

                  case 'Set':
                    return o.prettify_array(Array.from(obj.keys()), st);

                  case 'WeakSet':
                    return o.stylize_dim('/\*not enumerable*\/');

                  case 'Date':
                    return o.stylize_dim(`/*${obj[o.date_serialization_fn]()}*/`);
                  // node

                  case 'Buffer':
                    // too big!
                    return '/*…*/';

                  case 'Gunzip':
                    // seen in fetch_ponyfill response
                    // too big!
                    return '/*…*/';
                  // other

                  default:
                    if (p.constructor.name.endsWith('Error')) {
                      const err = obj; // no need to pretty print it as copy/pastable to code,
                      // 99.9% chance that's not what we want here

                      return o.stylize_error(o.quote + err.message + o.quote);
                    } // Beware! This can turn into a huge thing, ex. a fetch response
                    // REM we MUST have skip_constructor = true to avoid infinite loops


                    return o.prettify_object(obj, st, {
                      skip_constructor: true
                    });
                  //return '/*…*/'
                }
              })() + o.stylize_syntax(')');
            }
          }
        } catch (err) {
          return o.stylize_error(`[error prettifying:${err.message}/po.c]`);
        }
      }

      const keys = Reflect.ownKeys(obj).sort((a, b) => {
        let res = cmp(typeof a, typeof b);

        if (res === 0) {
          res = cmp(a, b);
        }

        return res;
      });

      if (keys.length === 0 && skip_constructor) {
        return o.stylize_dim(`/*${obj.toString()}*/`);
      }

      st = { ...st,
        circular: new Set([...Array.from(st.circular), obj])
      };
      return o.stylize_syntax('{') + keys.map(k => {
        const v = obj[k];
        if (typeof v === 'function' && v.name === k) return o.prettify_function(v, st, {
          as_prop: true
        });
        return o.prettify_property_name(k, st) + o.stylize_syntax(': ') + o.prettify_any(v, st);
      }).join(o.stylize_syntax(',')) + o.stylize_syntax('}');
    } catch (err) {
      return o.stylize_error(`[error prettifying:${err.message}/po]`);
    }
  },

  // root
  prettify_any(any, st) {
    if (DEBUG) console.log('prettify_any', any);
    const {
      o
    } = st;

    try {
      switch (typeof any) {
        /////// primitive type ///////
        case 'string':
          return o.prettify_string(any, st);

        case 'number':
          return o.prettify_number(any, st);

        case 'bigint':
          return o.prettify_bigint(any, st);

        case 'boolean':
          return o.prettify_boolean(any, st);

        case 'undefined':
          return o.prettify_undefined(any, st);

        case 'symbol':
          return o.prettify_symbol(any, st);
        /////// non-primitive type ///////

        case 'function':
          // special sub-type of object
          return o.prettify_function(any, st);

        case 'object':
          {
            if (any !== null) {
              if (st.circular.has(any)) return Array.isArray(any) ? o.stylize_error('[<Circular ref!>]') : o.stylize_error('{<Circular ref!>}');
            }

            return o.prettify_object(any, st);
          }

        default:
          return `[unsupported type:${typeof any}]`;
      }
    } catch (err) {
      return o.stylize_error(`[error prettifying:${err.message}/pa]`);
    }
  }

};
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/prettify-any/dist/src.es2019/options--ansi.js
function get_stylize_options_ansi(chalk) {
  return {
    stylize_dim: s => chalk.dim(s),
    stylize_suspicious: s => chalk.bold(s),
    stylize_error: s => chalk.red.bold(s),
    stylize_global: s => chalk.magenta(s),
    stylize_primitive: s => chalk.green(s),
    stylize_syntax: s => chalk.yellow(s),
    stylize_user: s => chalk.blue(s)
  };
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/prettify-any/dist/src.es2019/options.js


 ////////////////////////////////////////////////////////////////////////////////////

function get_default_options() {
  return { ...DEFAULTS_STYLE_OPTIONS,
    ...DEFAULTS_PRETTIFY_OPTIONS,
    ...DEFAULTS_STYLIZE_OPTIONS__NONE,
    ...(get_lib__chalk() && get_stylize_options_ansi(get_lib__chalk()))
  };
}
function get_options(options = {}) {
  return { ...get_default_options(),
    ...options
  };
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/prettify-any/dist/src.es2019/v2.js
 ////////////////////////////////////

function create_state(options) {
  return {
    o: get_options(options),
    circular: new WeakSet()
  };
}

function prettify_any(js, options = {}) {
  try {
    const st = create_state(get_options(options));
    return st.o.prettify_any(js, st);
  } catch (err) {
    return `[error prettifying:${err.message}]`;
  }
}
function prettify_json(js, options = {}) {
  const st = create_state(get_options(options)); // TODO show not JSON

  return st.o.prettify_any(js, st);
}
function dump_prettified_any(msg, data, options = {}) {
  console.log(msg);
  console.log(prettify_any(data, options));
}
function is_pure_json(js) {
  return false;
}
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/error-utils/dist/src.es2019/fields.js
var fields = __webpack_require__(11);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/print-error-to-ansi/dist/src.es2019/index.js
/* eslint-disable no-console */

 // TODO make it more pro!

function displayErrProp(errLike, prop) {
  if (prop === 'details') {
    const details = errLike.details;
    console.error(source_default.a.red(source_default.a.dim(`🔥  ${prop}:`)));
    Object.entries(details).forEach(([key, value]) => {
      console.error(source_default.a.red(source_default.a.dim(`    ${key}: "`) + value + source_default.a.dim('"')));
    });
  } else if (prop === 'stack') {
    // TODO clean / shorten / relative
    console.error(source_default.a.red(source_default.a.dim(`🔥  ${prop}: "`) + errLike[prop] + source_default.a.dim('"')));
  } else console.error(source_default.a.red(source_default.a.dim(`🔥  ${prop}: "`) + errLike[prop] + source_default.a.dim('"')));
}

function displayError(errLike = {}) {
  console.error(source_default.a.red(`🔥🔥🔥🔥🔥🔥🔥  ${source_default.a.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`)); // TODO use normalize error?

  const displayedProps = new Set();
  displayedProps.add('name');

  if (errLike.message) {
    displayErrProp(errLike, 'message');
    displayedProps.add('message');
  }

  if (errLike.details) {
    displayErrProp(errLike, 'details');
    displayedProps.add('details');
  }

  fields["b" /* COMMON_ERROR_FIELDS_EXTENDED */].forEach(prop => {
    if (prop in errLike && !displayedProps.has(prop)) {
      displayErrProp(errLike, prop);
    }
  });
}


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-node/dist/src.es2019/sinks/common.js


const MIN_WIDTH = 7;

function to_aligned_ascii(level) {
  let lvl = level.toUpperCase();
  /*while (lvl.length <= MIN_WIDTH - 2) {
      lvl = ' ' + lvl + ' '
  }*/

  if (lvl.length < MIN_WIDTH) lvl = (lvl + '         ').slice(0, MIN_WIDTH);
  return lvl;
}

const LEVEL_TO_ASCII = {
  fatal: source_default.a.bgRed.white.bold(to_aligned_ascii(' ' + LOG_LEVEL_TO_HUMAN['fatal'])),
  emerg: source_default.a.bgRed.white.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['emerg'])),
  alert: source_default.a.bgRed.white.bold(to_aligned_ascii(' ' + LOG_LEVEL_TO_HUMAN['alert'])),
  crit: source_default.a.bgRed.white.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['crit'])),
  error: source_default.a.red.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['error'])),
  warning: source_default.a.yellow.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['warning'])),
  warn: source_default.a.yellow.bold(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['warn'])),
  notice: source_default.a.blue(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['notice'])),
  info: source_default.a.blue(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['info'])),
  verbose: to_aligned_ascii(LOG_LEVEL_TO_HUMAN['verbose']),
  log: to_aligned_ascii(LOG_LEVEL_TO_HUMAN['log']),
  debug: to_aligned_ascii(LOG_LEVEL_TO_HUMAN['debug']),
  trace: source_default.a.dim(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['trace'])),
  silly: source_default.a.dim(to_aligned_ascii(LOG_LEVEL_TO_HUMAN['silly']))
};
const LEVEL_TO_STYLIZE = {
  fatal: s => source_default.a.red.bold(s),
  emerg: s => source_default.a.red.bold(s),
  alert: s => source_default.a.red.bold(s),
  crit: s => source_default.a.red.bold(s),
  error: s => source_default.a.red.bold(s),
  warning: s => source_default.a.yellow(s),
  warn: s => source_default.a.yellow(s),
  notice: s => source_default.a.blue(s),
  info: s => source_default.a.blue(s),
  verbose: s => s,
  log: s => s,
  debug: s => s,
  trace: s => source_default.a.dim(s),
  silly: s => source_default.a.dim(s)
};
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-node/dist/src.es2019/sinks/to-console.js
/* eslint-disable no-console */



inject_lib__chalk(source_default.a);

function createSink(options = {}) {
  const displayTime = options.displayTime || false;
  return payload => {
    const {
      level,
      name,
      msg,
      time,
      details,
      err
    } = payload;
    let line = '' + (displayTime ? source_default.a.dim(String(time)) + ' ' : '') + LEVEL_TO_ASCII[level] + '› ' + LEVEL_TO_STYLIZE[level]('' + name + (name ? '›' : '') + (msg ? ' ' : '') + msg) + (Reflect.ownKeys(details).length === 0 ? '' //: (' ' + JSON.stringify(details))
    : ' ' + prettify_any(details, {//line_width:
      //first_line_already_used:
    }));
    console.log(line); // eslint-disable-line no-console

    if (err) displayError(err);
  };
}
/* harmony default export */ var to_console = (createSink);
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-node/dist/src.es2019/index.js


const ORIGINAL_CONSOLE = console;

function createLogger(p = {}) {
  var _a;

  const {
    group,
    groupCollapsed,
    groupEnd
  } = ORIGINAL_CONSOLE;
  return { ...create(p, ((_a = p.sinkOptions) === null || _a === void 0 ? void 0 : _a.sink) || to_console(p.sinkOptions)),
    group,
    groupCollapsed,
    groupEnd
  };
}




// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-node/dist/src.es2019/consts.js
const ENV_ROOT = 'UDA';
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-node/dist/src.es2019/v1/keys.js



function normalizeKey(key) {
  return key.split('-').join('_').split('.').join('_').split('⋄').join('_').split('∙').join('_').split('ꘌ').join('_').split('ꓺ').join('_').split('ː').join('_');
}

function getOverrideKeyForLogger(name) {
  return `logger_${name || 'default'}_logLevel`.toUpperCase();
}
function getEnvKeyForOverride(key) {
  // should we put v1 somewhere? no, most likely overkill.
  return `${ENV_ROOT}_override__${normalizeKey(key)}`.toUpperCase();
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-node/dist/src.es2019/v1/index.js


 ////////////////////////////////////

const OWN_LOGGER_NAME = ENV_ROOT;
const REVISION = 2; ////////////////////////////////////

function v1_create() {
  //console.trace('[UDA--node installing…]')
  ////////////////////////////////////
  const loggers = {}; // to avoid creating duplicates

  const debugCommands = {}; // TODO check

  const exposed = {};
  const overrides = {}; // we'll expose them for clarity
  ////////////////////////////////////
  // TODO override?
  // TODO allow off?

  const _ownLogger = createLogger({
    name: OWN_LOGGER_NAME,
    suggestedLevel: 'fatal'
  });

  function _getOverrideRequestedSJson(ovKey) {
    try {
      const EnvKey = getEnvKeyForOverride(ovKey); //console.log(`- reading EnvKey = "${EnvKey}"`)

      const rawValue = process.env[EnvKey] || null; //console.log(`   ↳ read EnvKey "${EnvKey}", content = "${rawValue}"`)

      return rawValue;
    } catch (err) {
      _ownLogger.warn(`🔴 error reading ENV for override "${ovKey}"!`, {
        err
      });

      return null;
    }
  }

  const forcedLevel = _getOverrideRequestedSJson(getOverrideKeyForLogger('_UDA_internal'));

  try {
    if (forcedLevel) _ownLogger.setLevel(JSON.parse(forcedLevel));
  } catch (err) {
    _ownLogger.fatal(`🔴 error setting internal logger forced level: "${forcedLevel}"!`);
  }

  _ownLogger.debug(`Instantiated. (revision: ${REVISION})`);

  function _getOverride(key) {
    if (!overrides[key]) {
      // we only read the env once for speed reason
      overrides[key] = {
        // so far:
        isOn: false,
        value: undefined
      };

      const rawValue = _getOverrideRequestedSJson(key);

      if (rawValue) {
        overrides[key].isOn = true; // for the node version where escaping is hard, as a convenience, we auto-type common cases

        const value = (() => {
          // we allow the non-JSON "undefined"
          if (rawValue === 'undefined') return undefined;
          if (String(Number(rawValue)) === rawValue) return Number(rawValue);

          try {
            return JSON.parse(rawValue);
          } catch {
            return rawValue; // as a string
          }
        })();

        overrides[key].value = value;

        _ownLogger.log(` 🔵 overriden "${key}"`, {
          override: value
        });
      }
    }

    return overrides[key];
  } ////////////////////////////////////


  const api = {
    getLogger,
    exposeInternal,
    overrideHook,
    addDebugCommand,
    _: {
      exposed,
      overrides,
      minor: REVISION,
      source: 'node-lib',
      create: v1_create
    }
  }; ////////////////////////////////////

  function overrideHook(key, defaultValue) {
    try {
      const status = _getOverride(key);

      if (status.isOn) return status.value;
    } catch (err) {
      // should never happen because _getOverride() already catch
      // TODO check!
      _ownLogger.warn('overrideHook(): error retrieving override!', {
        key,
        err
      });
    }

    return defaultValue;
  }

  function getLogger(p = {}) {
    const name = p.name || DEFAULT_LOGGER_KEY; // we need a name immediately

    if (!loggers[name]) {
      try {
        const ovKey = getOverrideKeyForLogger(name);

        if (!p.forcedLevel && _getOverrideRequestedSJson(ovKey)) {
          p = { ...p,
            forcedLevel: overrideHook(ovKey, p.suggestedLevel || DEFAULT_LOG_LEVEL)
          };
        }
      } catch (err) {
        // this warning should appear only once on creation ✔
        _ownLogger.warn('getLogger(): error overriding the level!', {
          name,
          err
        });
      }

      loggers[name] = createLogger(p);
    }

    return loggers[name];
  }

  function exposeInternal(path, value) {
    _ownLogger.warn(`exposeInternal(): alpha, not documented!`);

    try {
      const pathParts = path.split('.'); // TODO switch to / ?

      const lastIndex = pathParts.length - 1;
      let root = exposed;
      pathParts.forEach((p, index) => {
        root[p] = root[p] || (index === lastIndex ? value : {});
        root = root[p];
      });
    } catch (err) {
      _ownLogger.warn(`exposeInternal(): error exposing!`, {
        path,
        err
      });
    }
  }

  function addDebugCommand(commandName, callback) {
    // TODO
    _ownLogger.warn(`addDebugCommand(): alpha, not documented!`); // TODO try catch


    debugCommands[commandName] = callback;
  }

  return api;
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-node/dist/src.es2019/index.js


const src_es2019_globalThis = Object(src_es2019["a" /* getGlobalThis */])(); // ensure the root is present

src_es2019_globalThis._debug = src_es2019_globalThis._debug || {};
const root = src_es2019_globalThis._debug; //////////// v1 ////////////
// TODO extract this common code!
// install globally if no better implementation already present

root.v1 = (existing => {
  // We CAN'T replace an existing one, even if we are more recent,
  // because the existing one may already have been called
  // and be having a state that can't be carried over.
  // HOWEVER some hints may help the user:
  const candidate = v1_create();
  let ownLogger = candidate.getLogger({
    name: OWN_LOGGER_NAME
  });
  ownLogger.debug('as a candidate, attempting to attach…');

  if (!existing) {
    ownLogger.debug('nominal install ✅');
    return candidate; // nominal case, current = real implementation is first
  } // something is wrong,
  // help the user figure it out


  let isExistingAPlaceholder = !existing._; // we know that the placeholder doesn't define this optional prop

  if (isExistingAPlaceholder) {
    ownLogger.warn('install warning: a placeholder is already present, you may miss some calls! the true implementation should be imported earlier!'); // better than nothing, may still miss some calls

    ownLogger.log('as a candidate, replacing existing ⚠');
    return candidate;
  }

  ownLogger = existing.getLogger({
    name: OWN_LOGGER_NAME
  });
  ownLogger.warn('install warning: several true implementation coexists, only the top module should import it. Check your submodules!');

  try {
    const minVersion = Math.min(existing._.minor, candidate._.minor);
    if (minVersion !== candidate._.minor) ownLogger.warn(`install warning: several true implementation coexists, including an outdated one: "v${minVersion}"!`);
  } catch (err) {
    ownLogger.warn(err);
  }

  ownLogger.log('as a candidate, discarding myself: existing is good enough ✅');
  return existing; // don't replace
})(root.v1); //////////// latest ////////////
// directly expose the latest implementation known to this lib


const instance = root.v1;
const {
  getLogger: src_es2019_getLogger,
  exposeInternal: src_es2019_exposeInternal,
  overrideHook: src_es2019_overrideHook,
  addDebugCommand: src_es2019_addDebugCommand
} = instance;
 // types



/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createError; });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

function createError(message, attributes = {}, ctor = Error) {
  message = String(message || attributes.message || 'Unknown error!');

  if (!message.toLowerCase().includes('error')) {
    message = 'Error: ' + message;
  }

  let err = new ctor(message);
  Object.keys(attributes).forEach(k => {
    const isErrorAttribute = _fields__WEBPACK_IMPORTED_MODULE_0__[/* COMMON_ERROR_FIELDS_EXTENDED */ "b"].has(k);
    const isAutogeneratedErrorAttribute = _fields__WEBPACK_IMPORTED_MODULE_0__[/* QUASI_STANDARD_ERROR_FIELDS */ "c"].has(k);

    if (k === 'details') {
      err.details = { ...err.details,
        ...attributes[k]
      };
    } else if (isAutogeneratedErrorAttribute) {// strange...
      // ignore, don't allow overriding auto-generated props
    } else if (isErrorAttribute) {
      // attach directly
      ;
      err[k] = attributes[k];
    } else {
      err.details = err.details || {};
      err.details[k] = attributes[k];
    }
  });
  err.framesToPop = (err.framesToPop || 0) + 1;
  return err;
}

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeError; });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
 // Anything can be thrown: undefined, string, number...)
// But that's obviously not a good practice.
// Normalize any thrown object into a true, normal error.
// XXX will re-create the

function normalizeError(err_like = {}) {
  // Erro-like objects are sometime fancy!
  // - seen: in browser, sometimes, an error-like, un-writable object is thrown
  // - seen: frozen
  // - seen: non-enumerable props
  // So we want to ensure a true, safe, writable error object.
  var _a, _b; // Yes, we always re-create in case


  const p = Object.getPrototypeOf(err_like); // should we restrict to global standard constructors? TBD

  const constructor = ((_b = (_a = p === null || p === void 0 ? void 0 : p.constructor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.endsWith('Error')) ? p.constructor : Error; // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible

  const true_err = new (Function.prototype.bind.call(constructor, null, err_like.message || `(non-error caught: "${err_like}")`))();
  /*const true_err: XXError = new Error(
      err_like.message || `(non-error caught: "${err_like}")`,
  )*/
  // properly attach fields if they exist

  _fields__WEBPACK_IMPORTED_MODULE_0__[/* COMMON_ERROR_FIELDS_EXTENDED */ "b"].forEach(prop => {
    //if (prop in err_like)
    if (err_like[prop]) true_err[prop] = err_like[prop];
  });
  return true_err;
}

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Enum() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    if (typeof values[0] === "string") {
        var result = {};
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var value = values_1[_a];
            result[value] = value;
        }
        return result;
    }
    else {
        return values[0];
    }
}
exports.Enum = Enum;
(function (Enum) {
    function ofKeys(e) {
        var result = {};
        for (var _i = 0, _a = Object.keys(e); _i < _a.length; _i++) {
            var key = _a[_i];
            result[key] = key;
        }
        return result;
    }
    Enum.ofKeys = ofKeys;
    function keys(e) {
        return Object.keys(e);
    }
    Enum.keys = keys;
    function values(e) {
        var result = [];
        for (var _i = 0, _a = Object.keys(e); _i < _a.length; _i++) {
            var key = _a[_i];
            result.push(e[key]);
        }
        return result;
    }
    Enum.values = values;
    function isType(e, value) {
        return values(e).indexOf(value) !== -1;
    }
    Enum.isType = isType;
})(Enum = exports.Enum || (exports.Enum = {}));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const escapeStringRegexp = __webpack_require__(192);
const ansiStyles = __webpack_require__(193);
const stdoutColor = __webpack_require__(197).stdout;

const template = __webpack_require__(199);

const isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
const skipModels = new Set(['gray']);

const styles = Object.create(null);

function applyOptions(obj, options) {
	options = options || {};

	// Detect level if not set manually
	const scLevel = stdoutColor ? stdoutColor.level : 0;
	obj.level = options.level === undefined ? scLevel : options.level;
	obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
}

function Chalk(options) {
	// We check for this.template here since calling `chalk.constructor()`
	// by itself will have a `this` of a previously constructed chalk object
	if (!this || !(this instanceof Chalk) || this.template) {
		const chalk = {};
		applyOptions(chalk, options);

		chalk.template = function () {
			const args = [].slice.call(arguments);
			return chalkTag.apply(null, [chalk.template].concat(args));
		};

		Object.setPrototypeOf(chalk, Chalk.prototype);
		Object.setPrototypeOf(chalk.template, chalk);

		chalk.template.constructor = Chalk;

		return chalk.template;
	}

	applyOptions(this, options);
}

// Use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001B[94m';
}

for (const key of Object.keys(ansiStyles)) {
	ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

	styles[key] = {
		get() {
			const codes = ansiStyles[key];
			return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
		}
	};
}

styles.visible = {
	get() {
		return build.call(this, this._styles || [], true, 'visible');
	}
};

ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
for (const model of Object.keys(ansiStyles.color.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	styles[model] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.color.close,
					closeRe: ansiStyles.color.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
	if (skipModels.has(model)) {
		continue;
	}

	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const level = this.level;
			return function () {
				const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments);
				const codes = {
					open,
					close: ansiStyles.bgColor.close,
					closeRe: ansiStyles.bgColor.closeRe
				};
				return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, styles);

function build(_styles, _empty, key) {
	const builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder._empty = _empty;

	const self = this;

	Object.defineProperty(builder, 'level', {
		enumerable: true,
		get() {
			return self.level;
		},
		set(level) {
			self.level = level;
		}
	});

	Object.defineProperty(builder, 'enabled', {
		enumerable: true,
		get() {
			return self.enabled;
		},
		set(enabled) {
			self.enabled = enabled;
		}
	});

	// See below for fix regarding invisible grey/dim combination on Windows
	builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';

	// `__proto__` is used because we must return a function, but there is
	// no way to create a function with a different prototype
	builder.__proto__ = proto; // eslint-disable-line no-proto

	return builder;
}

function applyStyle() {
	// Support varags, but simply cast to string in case there's only one arg
	const args = arguments;
	const argsLen = args.length;
	let str = String(arguments[0]);

	if (argsLen === 0) {
		return '';
	}

	if (argsLen > 1) {
		// Don't slice `arguments`, it prevents V8 optimizations
		for (let a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || this.level <= 0 || !str) {
		return this._empty ? '' : str;
	}

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	const originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && this.hasGrey) {
		ansiStyles.dim.open = '';
	}

	for (const code of this._styles.slice().reverse()) {
		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;

		// Close the styling before a linebreak and reopen
		// after next line to fix a bleed issue on macOS
		// https://github.com/chalk/chalk/pull/92
		str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
	}

	// Reset the original `dim` if we changed it to work around the Windows dimmed gray issue
	ansiStyles.dim.open = originalDim;

	return str;
}

function chalkTag(chalk, strings) {
	if (!Array.isArray(strings)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return [].slice.call(arguments, 1).join(' ');
	}

	const args = [].slice.call(arguments, 2);
	const parts = [strings.raw[0]];

	for (let i = 1; i < strings.length; i++) {
		parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
		parts.push(String(strings.raw[i]));
	}

	return template(chalk, parts.join(''));
}

Object.defineProperties(Chalk.prototype, styles);

module.exports = Chalk(); // eslint-disable-line new-cap
module.exports.supportsColor = stdoutColor;
module.exports.default = module.exports; // For TypeScript


/***/ }),

/***/ 79:
/***/ (function(module, exports, __webpack_require__) {

var json = typeof JSON !== 'undefined' ? JSON : __webpack_require__(188);

module.exports = function (obj, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var space = opts.space || '';
    if (typeof space === 'number') space = Array(space+1).join(' ');
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
    var replacer = opts.replacer || function(key, value) { return value; };

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify (parent, key, node, level) {
        var indent = space ? ('\n' + new Array(level + 1).join(space)) : '';
        var colonSeparator = space ? ': ' : ':';

        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        node = replacer.call(parent, key, node);

        if (node === undefined) {
            return;
        }
        if (typeof node !== 'object' || node === null) {
            return json.stringify(node);
        }
        if (isArray(node)) {
            var out = [];
            for (var i = 0; i < node.length; i++) {
                var item = stringify(node, i, node[i], level+1) || json.stringify(null);
                out.push(indent + space + item);
            }
            return '[' + out.join(',') + indent + ']';
        }
        else {
            if (seen.indexOf(node) !== -1) {
                if (cycles) return json.stringify('__cycle__');
                throw new TypeError('Converting circular structure to JSON');
            }
            else seen.push(node);

            var keys = objectKeys(node).sort(cmp && cmp(node));
            var out = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = stringify(node, key, node[key], level+1);

                if(!value) continue;

                var keyValue = json.stringify(key)
                    + colonSeparator
                    + value;
                ;
                out.push(indent + space + keyValue);
            }
            seen.splice(seen.indexOf(node), 1);
            return '{' + out.join(',') + indent + '}';
        }
    })({ '': obj }, '', obj, 0);
};

var isArray = Array.isArray || function (x) {
    return {}.toString.call(x) === '[object Array]';
};

var objectKeys = Object.keys || function (obj) {
    var has = Object.prototype.hasOwnProperty || function () { return true };
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};


/***/ }),

/***/ 8:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getGlobalThis; });
/* global globalThis, self, window, global */
const lastResort = {};
function getGlobalThis() {
  // @ts-ignore
  if (typeof globalThis !== 'undefined') return globalThis; // check node first https://github.com/ljharb/globalThis/issues/2
  // @ts-ignore

  if (typeof global !== 'undefined') return global; // @ts-ignore

  if (typeof self !== 'undefined') return self; // @ts-ignore

  if (typeof window !== 'undefined') return window;
  if (typeof this !== 'undefined') return this;
  return lastResort; // should never happen
}


/***/ }),

/***/ 81:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

const wrapAnsi16 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${code + offset}m`;
};

const wrapAnsi256 = (fn, offset) => (...args) => {
	const code = fn(...args);
	return `\u001B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => (...args) => {
	const rgb = fn(...args);
	return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

const ansi2ansi = n => n;
const rgb2rgb = (r, g, b) => [r, g, b];

const setLazyProperty = (object, property, get) => {
	Object.defineProperty(object, property, {
		get: () => {
			const value = get();

			Object.defineProperty(object, property, {
				value,
				enumerable: true,
				configurable: true
			});

			return value;
		},
		enumerable: true,
		configurable: true
	});
};

/** @type {typeof import('color-convert')} */
let colorConvert;
const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
	if (colorConvert === undefined) {
		colorConvert = __webpack_require__(82);
	}

	const offset = isBackground ? 10 : 0;
	const styles = {};

	for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
		const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
		if (sourceSpace === targetSpace) {
			styles[name] = wrap(identity, offset);
		} else if (typeof suite === 'object') {
			styles[name] = wrap(suite[targetSpace], offset);
		}
	}

	return styles;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			// 21 isn't widely supported and 22 does the same thing
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],

			// Bright color
			blackBright: [90, 39],
			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			// Bright color
			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	// Alias bright black as gray (and grey)
	styles.color.gray = styles.color.blackBright;
	styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
	styles.color.grey = styles.color.blackBright;
	styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

	for (const [groupName, group] of Object.entries(styles)) {
		for (const [styleName, style] of Object.entries(group)) {
			styles[styleName] = {
				open: `\u001B[${style[0]}m`,
				close: `\u001B[${style[1]}m`
			};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	}

	Object.defineProperty(styles, 'codes', {
		value: codes,
		enumerable: false
	});

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
	setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
	setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
	setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

	return styles;
}

// Make the export immutable
Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(38)(module)))

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(43);
const route = __webpack_require__(84);

const convert = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;


/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(43);

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};



/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringReplaceAll = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

module.exports = {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
};


/***/ }),

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

const ESCAPES = new Map([
	['n', '\n'],
	['r', '\r'],
	['t', '\t'],
	['b', '\b'],
	['f', '\f'],
	['v', '\v'],
	['0', '\0'],
	['\\', '\\'],
	['e', '\u001B'],
	['a', '\u0007']
]);

function unescape(c) {
	const u = c[0] === 'u';
	const bracket = c[1] === '{';

	if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
		return String.fromCharCode(parseInt(c.slice(1), 16));
	}

	if (u && bracket) {
		return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
	}

	return ESCAPES.get(c) || c;
}

function parseArguments(name, arguments_) {
	const results = [];
	const chunks = arguments_.trim().split(/\s*,\s*/g);
	let matches;

	for (const chunk of chunks) {
		const number = Number(chunk);
		if (!Number.isNaN(number)) {
			results.push(number);
		} else if ((matches = chunk.match(STRING_REGEX))) {
			results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
		} else {
			throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
		}
	}

	return results;
}

function parseStyle(style) {
	STYLE_REGEX.lastIndex = 0;

	const results = [];
	let matches;

	while ((matches = STYLE_REGEX.exec(style)) !== null) {
		const name = matches[1];

		if (matches[2]) {
			const args = parseArguments(name, matches[2]);
			results.push([name].concat(args));
		} else {
			results.push([name]);
		}
	}

	return results;
}

function buildStyle(chalk, styles) {
	const enabled = {};

	for (const layer of styles) {
		for (const style of layer.styles) {
			enabled[style[0]] = layer.inverse ? null : style.slice(1);
		}
	}

	let current = chalk;
	for (const [styleName, styles] of Object.entries(enabled)) {
		if (!Array.isArray(styles)) {
			continue;
		}

		if (!(styleName in current)) {
			throw new Error(`Unknown Chalk style: ${styleName}`);
		}

		current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
	}

	return current;
}

module.exports = (chalk, temporary) => {
	const styles = [];
	const chunks = [];
	let chunk = [];

	// eslint-disable-next-line max-params
	temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
		if (escapeCharacter) {
			chunk.push(unescape(escapeCharacter));
		} else if (style) {
			const string = chunk.join('');
			chunk = [];
			chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
			styles.push({inverse, styles: parseStyle(style)});
		} else if (close) {
			if (styles.length === 0) {
				throw new Error('Found extraneous } in Chalk template literal');
			}

			chunks.push(buildStyle(chalk, styles)(chunk.join('')));
			chunk = [];
			styles.pop();
		} else {
			chunk.push(character);
		}
	});

	chunks.push(chunk.join(''));

	if (styles.length > 0) {
		const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
		throw new Error(errMessage);
	}

	return chunks.join('');
};


/***/ }),

/***/ 88:
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if (!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if (!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const agent_1 = __importDefault(__webpack_require__(147));
function createHttpsProxyAgent(opts) {
    return new agent_1.default(opts);
}
(function (createHttpsProxyAgent) {
    createHttpsProxyAgent.HttpsProxyAgent = agent_1.default;
    createHttpsProxyAgent.prototype = agent_1.default.prototype;
})(createHttpsProxyAgent || (createHttpsProxyAgent = {}));
module.exports = createHttpsProxyAgent;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 90:
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ 91:
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(112);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ })

/******/ })));
