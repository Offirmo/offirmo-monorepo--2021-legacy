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
/******/ 	return __webpack_require__(__webpack_require__.s = 537);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiStyles = __webpack_require__(113);
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(117);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(119);

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
		template = __webpack_require__(120);
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LIB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return INTERNAL_PROP; });
const LIB = 'soft-execution-context';
const INTERNAL_PROP = '_SEC';


/***/ }),

/***/ 108:
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

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var decode = decodeURIComponent;
var encode = encodeURIComponent;
var pairSplitRegExp = /; */;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {}
  var opt = options || {};
  var pairs = str.split(pairSplitRegExp);
  var dec = opt.decode || decode;

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    var eq_idx = pair.indexOf('=');

    // skip things that don't look like key=value
    if (eq_idx < 0) {
      continue;
    }

    var key = pair.substr(0, eq_idx).trim()
    var val = pair.substr(++eq_idx, pair.length).trim();

    // quoted values
    if ('"' == val[0]) {
      val = val.slice(1, -1);
    }

    // only assign once
    if (undefined == obj[key]) {
      obj[key] = tryDecode(val, dec);
    }
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== 'function') {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + opt.expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


/***/ }),

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LIB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return LOG_LEVEL_TO_INTEGER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ALL_LOG_LEVELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return LOG_LEVEL_TO_HUMAN; });
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


/***/ }),

/***/ 111:
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

/***/ 113:
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
		colorConvert = __webpack_require__(114);
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(64)(module)))

/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(67);
const route = __webpack_require__(116);

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

/***/ 115:
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

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(67);

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

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(30);
const tty = __webpack_require__(75);
const hasFlag = __webpack_require__(118);

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

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 119:
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

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 120:
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

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ create; });

// UNUSED EXPORTS: checkLevel

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/consts.js
var consts = __webpack_require__(11);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/consts-base.js
var consts_base = __webpack_require__(33);

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
  if (!consts["a" /* ALL_LOG_LEVELS */].includes(level)) throw new Error(`[${consts["b" /* LIB */]}] Not a valid log level: "${level}"!`);
}
function create({
  name = consts_base["a" /* DEFAULT_LOGGER_KEY */],
  suggestedLevel = consts_base["b" /* DEFAULT_LOG_LEVEL */],
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

  const logger = consts["a" /* ALL_LOG_LEVELS */].reduce((logger, level) => {
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
    levelAsInt = consts["d" /* LOG_LEVEL_TO_INTEGER */][level];
  }

  setLevel(getLevel()); // to check it

  function isLevelEnabled(level) {
    checkLevel(level);
    return consts["d" /* LOG_LEVEL_TO_INTEGER */][level] <= levelAsInt;
  }

  function getLevel() {
    return internalState.level;
  }

  function addCommonDetails(details) {
    if (details.err) throw new Error(`[${consts["b" /* LIB */]}] Can't set reserved property "err"!`);
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

/***/ }),

/***/ 13:
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),

/***/ 149:
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Headers", function() { return Headers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Request", function() { return Request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Response", function() { return Response; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FetchError", function() { return FetchError; });
/* harmony import */ var stream__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(28);
/* harmony import */ var zlib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(13);






// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = stream__WEBPACK_IMPORTED_MODULE_0__.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = require('encoding').convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = stream__WEBPACK_IMPORTED_MODULE_0__.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof stream__WEBPACK_IMPORTED_MODULE_0__)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__ && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof stream__WEBPACK_IMPORTED_MODULE_0__) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http__WEBPACK_IMPORTED_MODULE_1__.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = url__WEBPACK_IMPORTED_MODULE_2__.parse;
const format_url = url__WEBPACK_IMPORTED_MODULE_2__.format;

const streamDestructionSupported = 'destroy' in stream__WEBPACK_IMPORTED_MODULE_0__.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = stream__WEBPACK_IMPORTED_MODULE_0__.PassThrough;
const resolve_url = url__WEBPACK_IMPORTED_MODULE_2__.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https__WEBPACK_IMPORTED_MODULE_3__ : http__WEBPACK_IMPORTED_MODULE_1__).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof stream__WEBPACK_IMPORTED_MODULE_0__.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib__WEBPACK_IMPORTED_MODULE_4__.Z_SYNC_FLUSH,
				finishFlush: zlib__WEBPACK_IMPORTED_MODULE_4__.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createInflate());
					} else {
						body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib__WEBPACK_IMPORTED_MODULE_4__.createBrotliDecompress === 'function') {
				body = body.pipe(zlib__WEBPACK_IMPORTED_MODULE_4__.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

/* harmony default export */ __webpack_exports__["default"] = (fetch);



/***/ }),

/***/ 15:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {/* unused harmony export dynamicRequire */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return isNodeEnv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return getGlobalObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return uuid4; });
/* unused harmony export parseUrl */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getEventDescription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return consoleSandbox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return addExceptionTypeValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return addExceptionMechanism; });
/* unused harmony export getLocationHref */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return htmlTreeAsString; });
/* unused harmony export crossPlatformPerformance */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return timestampWithMs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return parseSemver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return parseRetryAfterHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return getFunctionName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return addContextToFrame; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(25);


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
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}
var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
    return (isNodeEnv()
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
    var originalConsole = global.console;
    var wrappedLevels = {};
    // Restore all wrapped console methods
    levels.forEach(function (level) {
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
    if (className && Object(_is__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "h"])(className)) {
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
var INITIAL_TIME = Date.now();
var prevNow = 0;
var performanceFallback = {
    now: function () {
        var now = Date.now() - INITIAL_TIME;
        if (now < prevNow) {
            now = prevNow;
        }
        prevNow = now;
        return now;
    },
    timeOrigin: INITIAL_TIME,
};
var crossPlatformPerformance = (function () {
    if (isNodeEnv()) {
        try {
            var perfHooks = dynamicRequire(module, 'perf_hooks');
            return perfHooks.performance;
        }
        catch (_) {
            return performanceFallback;
        }
    }
    var performance = getGlobalObject().performance;
    if (!performance || !performance.now) {
        return performanceFallback;
    }
    // Polyfill for performance.timeOrigin.
    //
    // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
    // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
    if (performance.timeOrigin === undefined) {
        // As of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always a
        // valid fallback. In the absence of a initial time provided by the browser, fallback to INITIAL_TIME.
        // @ts-ignore ignored because timeOrigin is a readonly property but we want to override
        // eslint-disable-next-line deprecation/deprecation
        performance.timeOrigin = (performance.timing && performance.timing.navigationStart) || INITIAL_TIME;
    }
    return performance;
})();
/**
 * Returns a timestamp in seconds with milliseconds precision since the UNIX epoch calculated with the monotonic clock.
 */
function timestampWithMs() {
    return (crossPlatformPerformance.timeOrigin + crossPlatformPerformance.now()) / 1000;
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
//# sourceMappingURL=misc.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(151)(module)))

/***/ }),

/***/ 150:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on_user_recognized = exports.on_error = void 0; // https://docs.sentry.io/error-reporting/quickstart/?platform=node
// https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

const Sentry = __webpack_require__(188);

const channel_1 = __webpack_require__(45); /////////////////////////////////////////////////


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

/***/ 151:
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

/***/ 152:
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
const net_1 = __importDefault(__webpack_require__(93));
const tls_1 = __importDefault(__webpack_require__(94));
const url_1 = __importDefault(__webpack_require__(7));
const assert_1 = __importDefault(__webpack_require__(48));
const debug_1 = __importDefault(__webpack_require__(29));
const agent_base_1 = __webpack_require__(158);
const parse_proxy_response_1 = __importDefault(__webpack_require__(160));
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

/***/ 153:
/***/ (function(module, exports, __webpack_require__) {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();

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
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */
function log(...args) {
	// This hackery is required for IE8/9, where
	// the `console.log` function doesn't have 'apply'
	return typeof console === 'object' &&
		console.log &&
		console.log(...args);
}

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

module.exports = __webpack_require__(95)(exports);

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

/***/ 154:
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

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(75);
const util = __webpack_require__(8);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(156);

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

module.exports = __webpack_require__(95)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 156:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(30);
const hasFlag = __webpack_require__(157);

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

/***/ 157:
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

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = __webpack_require__(17);
const debug_1 = __importDefault(__webpack_require__(29));
const promisify_1 = __importDefault(__webpack_require__(159));
const debug = debug_1.default('agent-base');
function isAgent(v) {
    return Boolean(v) && typeof v.addRequest === 'function';
}
function isSecureEndpoint() {
    const { stack } = new Error();
    if (typeof stack !== 'string')
        return false;
    return stack.split('\n').some(l => l.indexOf('(https.js:') !== -1);
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
            this.sockets = {};
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

/***/ 159:
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

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(__webpack_require__(29));
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

/***/ 161:
/***/ (function(module, exports) {

module.exports = require("console");

/***/ }),

/***/ 17:
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ 18:
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

/***/ 188:
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
var is = __webpack_require__(3);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/misc.js
var misc = __webpack_require__(15);

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._extra = {};
        /** Contexts */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        this._notifyScopeListeners();
        return this;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Scope.prototype.setContext = function (key, context) {
        var _a;
        this._contexts = tslib_es6_assign(tslib_es6_assign({}, this._contexts), (_a = {}, _a[key] = context, _a));
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
        var span = this.getSpan();
        if (span && span.spanRecorder && span.spanRecorder.spans[0]) {
            return span.spanRecorder.spans[0];
        }
        return undefined;
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
            if (captureContext._user) {
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
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        var mergedBreadcrumb = tslib_es6_assign({ timestamp: Object(misc["l" /* timestampWithMs */])() }, breadcrumb);
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
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            setTimeout(function () {
                _this._scopeListeners.forEach(function (callback) {
                    callback(_this);
                });
                _this._notifyingListeners = false;
            });
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
    var global = Object(misc["g" /* getGlobalObject */])();
    global.__SENTRY__ = global.__SENTRY__ || {};
    global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
    return global.__SENTRY__.globalEventProcessors;
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
var logger_global = Object(misc["g" /* getGlobalObject */])();
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
        this._stack = [];
        this._stack.push({ client: client, scope: scope });
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
        var stack = this.getStack();
        var parentScope = stack.length > 0 ? stack[stack.length - 1].scope : undefined;
        var scope = scope_Scope.clone(parentScope);
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
        return this.getStack().pop() !== undefined;
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
        var eventId = (this._lastEventId = Object(misc["m" /* uuid4 */])());
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
        var eventId = (this._lastEventId = Object(misc["m" /* uuid4 */])());
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
        var eventId = (this._lastEventId = Object(misc["m" /* uuid4 */])());
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
        var top = this.getStackTop();
        if (!top.scope || !top.client) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        var _a = (top.client.getOptions && top.client.getOptions()) || {}, _b = _a.beforeBreadcrumb, beforeBreadcrumb = _b === void 0 ? null : _b, _c = _a.maxBreadcrumbs, maxBreadcrumbs = _c === void 0 ? DEFAULT_BREADCRUMBS : _c;
        if (maxBreadcrumbs <= 0) {
            return;
        }
        var timestamp = Object(misc["l" /* timestampWithMs */])();
        var mergedBreadcrumb = tslib_es6_assign({ timestamp: timestamp }, breadcrumb);
        var finalBreadcrumb = beforeBreadcrumb
            ? Object(misc["d" /* consoleSandbox */])(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
            : mergedBreadcrumb;
        if (finalBreadcrumb === null) {
            return;
        }
        top.scope.addBreadcrumb(finalBreadcrumb, Math.min(maxBreadcrumbs, MAX_BREADCRUMBS));
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setUser = function (user) {
        var top = this.getStackTop();
        if (!top.scope) {
            return;
        }
        top.scope.setUser(user);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTags = function (tags) {
        var top = this.getStackTop();
        if (!top.scope) {
            return;
        }
        top.scope.setTags(tags);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtras = function (extras) {
        var top = this.getStackTop();
        if (!top.scope) {
            return;
        }
        top.scope.setExtras(extras);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setTag = function (key, value) {
        var top = this.getStackTop();
        if (!top.scope) {
            return;
        }
        top.scope.setTag(key, value);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.setExtra = function (key, extra) {
        var top = this.getStackTop();
        if (!top.scope) {
            return;
        }
        top.scope.setExtra(key, extra);
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hub.prototype.setContext = function (name, context) {
        var top = this.getStackTop();
        if (!top.scope) {
            return;
        }
        top.scope.setContext(name, context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.configureScope = function (callback) {
        var top = this.getStackTop();
        if (top.scope && top.client) {
            callback(top.scope);
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
        if (!client) {
            return null;
        }
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
    Hub.prototype.startTransaction = function (context) {
        return this._callExtensionMethod('startTransaction', context);
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.traceHeaders = function () {
        return this._callExtensionMethod('traceHeaders');
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
        var top = this.getStackTop();
        if (top && top.client && top.client[method]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            (_a = top.client)[method].apply(_a, tslib_es6_spread(args, [top.scope]));
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
    var carrier = Object(misc["g" /* getGlobalObject */])();
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
    if (Object(misc["i" /* isNodeEnv */])()) {
        return getHubFromActiveDomain(registry);
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
/**
 * Try to read the hub from an active domain, and fallback to the registry if one doesn't exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
    try {
        var property = 'domain';
        var carrier = getMainCarrier();
        var sentry = carrier.__SENTRY__;
        if (!sentry || !sentry.extensions || !sentry.extensions[property]) {
            return getHubFromCarrier(registry);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var domain = sentry.extensions[property];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        var activeDomain = domain.active;
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
    if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub) {
        return true;
    }
    return false;
}
/**
 * This will create a new {@link Hub} and add to the passed object on
 * __SENTRY__.hub.
 * @param carrier object
 * @hidden
 */
function getHubFromCarrier(carrier) {
    if (carrier && carrier.__SENTRY__ && carrier.__SENTRY__.hub) {
        return carrier.__SENTRY__.hub;
    }
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
    if (!carrier) {
        return false;
    }
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
    // arrity of the `captureMessage(message, level)` method.
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
 * Starts a new `Transaction` and returns it. This is the entry point to manual
 * tracing instrumentation.
 *
 * A tree structure can be built by adding child spans to the transaction, and
 * child spans to other spans. To start a new child span within the transaction
 * or any span, call the respective `.startChild()` method.
 *
 * Every child span must be finished before the transaction is finished,
 * otherwise the unfinished spans are discarded.
 *
 * The transaction must be finished with a call to its `.finish()` method, at
 * which point the transaction with all its finished child spans will be sent to
 * Sentry.
 *
 * @param context Properties of the new `Transaction`.
 */
function startTransaction(context) {
    return callOnHub('startTransaction', tslib_tslib_es6_assign({}, context));
}
//# sourceMappingURL=index.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/node_modules/tslib/tslib.es6.js
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
    node_modules_tslib_tslib_es6_extends(SentryError, _super);
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
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/string.js
var string = __webpack_require__(25);

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
                ? Object(misc["h" /* htmlTreeAsString */])(event_1.target)
                : Object.prototype.toString.call(event_1.target);
        }
        catch (_oO) {
            source.target = '<unknown>';
        }
        try {
            source.currentTarget = Object(is["a" /* isElement */])(event_1.currentTarget)
                ? Object(misc["h" /* htmlTreeAsString */])(event_1.currentTarget)
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
        return "[Function: " + Object(misc["f" /* getFunctionName */])(value) + "]";
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
            for (var _b = node_modules_tslib_tslib_es6_values(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
        var _a = node_modules_tslib_tslib_es6_read(match.slice(1), 6), protocol = _a[0], user = _a[1], _b = _a[2], pass = _b === void 0 ? '' : _b, host = _a[3], _c = _a[4], port = _c === void 0 ? '' : _c, lastPath = _a[5];
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
var lru = __webpack_require__(108);

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
        return urlEncode(auth);
    };
    return API;
}());

//# sourceMappingURL=api.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/request.js

/** Creates a SentryRequest from an event. */
function eventToSentryRequest(event, api) {
    var useEnvelope = event.type === 'transaction';
    var req = {
        body: JSON.stringify(event),
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
            sent_at: new Date(Object(misc["l" /* timestampWithMs */])() * 1000).toISOString(),
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
var external_url_ = __webpack_require__(7);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/version.js
var SDK_NAME = 'sentry.javascript.node';
var SDK_VERSION = '5.22.3';
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
                                    _this._disabledUntil = new Date(now + Object(misc["j" /* parseRetryAfterHeader */])(now, retryAfterHeader));
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
var external_http_ = __webpack_require__(16);

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
            ? new (__webpack_require__(92))(proxy)
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
var external_https_ = __webpack_require__(28);

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
            ? new (__webpack_require__(92))(proxy)
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
                var message = "Non-Error exception captured with keys: " + extractExceptionKeysForMessage(exception);
                hub_getCurrentHub().configureScope(function (scope) {
                    scope.setExtra('__serialized__', normalizeToSize(exception));
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

var core_node_modules_tslib_tslib_es6_extendStatics = function(d, b) {
    core_node_modules_tslib_tslib_es6_extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return core_node_modules_tslib_tslib_es6_extendStatics(d, b);
};

function core_node_modules_tslib_tslib_es6_extends(d, b) {
    core_node_modules_tslib_tslib_es6_extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var core_node_modules_tslib_tslib_es6_assign = function() {
    core_node_modules_tslib_tslib_es6_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return core_node_modules_tslib_tslib_es6_assign.apply(this, arguments);
}

function core_node_modules_tslib_tslib_es6_rest(s, e) {
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

function core_node_modules_tslib_tslib_es6_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function core_node_modules_tslib_tslib_es6_param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function core_node_modules_tslib_tslib_es6_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function core_node_modules_tslib_tslib_es6_awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function core_node_modules_tslib_tslib_es6_generator(thisArg, body) {
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

function core_node_modules_tslib_tslib_es6_createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function core_node_modules_tslib_tslib_es6_exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function core_node_modules_tslib_tslib_es6_values(o) {
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

function core_node_modules_tslib_tslib_es6_read(o, n) {
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

function core_node_modules_tslib_tslib_es6_spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(core_node_modules_tslib_tslib_es6_read(arguments[i]));
    return ar;
}

function core_node_modules_tslib_tslib_es6_spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function core_node_modules_tslib_tslib_es6_await(v) {
    return this instanceof core_node_modules_tslib_tslib_es6_await ? (this.v = v, this) : new core_node_modules_tslib_tslib_es6_await(v);
}

function core_node_modules_tslib_tslib_es6_asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof core_node_modules_tslib_tslib_es6_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function core_node_modules_tslib_tslib_es6_asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: core_node_modules_tslib_tslib_es6_await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function core_node_modules_tslib_tslib_es6_asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof core_node_modules_tslib_tslib_es6_values === "function" ? core_node_modules_tslib_tslib_es6_values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function core_node_modules_tslib_tslib_es6_makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function core_node_modules_tslib_tslib_es6_importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function core_node_modules_tslib_tslib_es6_importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function core_node_modules_tslib_tslib_es6_classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function core_node_modules_tslib_tslib_es6_classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integration.js



var installedIntegrations = [];
/** Gets integration to install */
function getIntegrationsToSetup(options) {
    var defaultIntegrations = (options.defaultIntegrations && core_node_modules_tslib_tslib_es6_spread(options.defaultIntegrations)) || [];
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
        integrations = core_node_modules_tslib_tslib_es6_spread(defaultIntegrations);
    }
    // Make sure that if present, `Debug` integration will always run last
    var integrationsNames = integrations.map(function (i) { return i.name; });
    var alwaysLastToRun = 'Debug';
    if (integrationsNames.indexOf(alwaysLastToRun) !== -1) {
        integrations.push.apply(integrations, core_node_modules_tslib_tslib_es6_spread(integrations.splice(integrationsNames.indexOf(alwaysLastToRun), 1)));
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
        /** Is the client still processing a call? */
        this._processing = false;
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
        this._processing = true;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this._getBackend()
            .eventFromException(exception, hint)
            .then(function (event) {
            eventId = _this.captureEvent(event, hint, scope);
        });
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureMessage = function (message, level, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        this._processing = true;
        var promisedEvent = Object(is["f" /* isPrimitive */])(message)
            ? this._getBackend().eventFromMessage("" + message, level, hint)
            : this._getBackend().eventFromException(message, hint);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promisedEvent.then(function (event) {
            eventId = _this.captureEvent(event, hint, scope);
        });
        return eventId;
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureEvent = function (event, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        this._processing = true;
        this._processEvent(event, hint, scope)
            .then(function (finalEvent) {
            // We need to check for finalEvent in case beforeSend returned null
            eventId = finalEvent && finalEvent.event_id;
            _this._processing = false;
        })
            .then(null, function (reason) {
            logger.error(reason);
            _this._processing = false;
        });
        return eventId;
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
        return this._isClientProcessing(timeout).then(function (status) {
            clearInterval(status.interval);
            return _this._getBackend()
                .getTransport()
                .close(timeout)
                .then(function (transportFlushed) { return status.ready && transportFlushed; });
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
    /** Waits for the client to be done with processing. */
    BaseClient.prototype._isClientProcessing = function (timeout) {
        var _this = this;
        return new syncpromise_SyncPromise(function (resolve) {
            var ticked = 0;
            var tick = 1;
            var interval = 0;
            clearInterval(interval);
            interval = setInterval(function () {
                if (!_this._processing) {
                    resolve({
                        interval: interval,
                        ready: true,
                    });
                }
                else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        resolve({
                            interval: interval,
                            ready: false,
                        });
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
        var prepared = core_node_modules_tslib_tslib_es6_assign(core_node_modules_tslib_tslib_es6_assign({}, event), { event_id: event.event_id || (hint && hint.event_id ? hint.event_id : Object(misc["m" /* uuid4 */])()), timestamp: event.timestamp || Object(misc["l" /* timestampWithMs */])() });
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
        var normalized = core_node_modules_tslib_tslib_es6_assign(core_node_modules_tslib_tslib_es6_assign(core_node_modules_tslib_tslib_es6_assign(core_node_modules_tslib_tslib_es6_assign(core_node_modules_tslib_tslib_es6_assign({}, event), (event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map(function (b) { return (core_node_modules_tslib_tslib_es6_assign(core_node_modules_tslib_tslib_es6_assign({}, b), (b.data && {
                data: normalize(b.data, depth),
            }))); }),
        })), (event.user && {
            user: normalize(event.user, depth),
        })), (event.contexts && {
            contexts: normalize(event.contexts, depth),
        })), (event.extra && {
            extra: normalize(event.extra, depth),
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
        var _a = this.getOptions(), environment = _a.environment, release = _a.release, dist = _a.dist, _b = _a.maxValueLength, maxValueLength = _b === void 0 ? 250 : _b;
        if (event.environment === undefined && environment !== undefined) {
            event.environment = environment;
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
            return syncpromise_SyncPromise.reject('SDK not enabled, will not send event.');
        }
        var isTransaction = event.type === 'transaction';
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        if (!isTransaction && typeof sampleRate === 'number' && Math.random() > sampleRate) {
            return syncpromise_SyncPromise.reject('This event has been sampled, will not send event.');
        }
        return new syncpromise_SyncPromise(function (resolve, reject) {
            _this._prepareEvent(event, scope, hint)
                .then(function (prepared) {
                if (prepared === null) {
                    reject('An event processor returned null, will not send event.');
                    return;
                }
                var finalEvent = prepared;
                var isInternalException = hint && hint.data && hint.data.__sentry__ === true;
                // We skip beforeSend in case of transactions
                if (isInternalException || !beforeSend || isTransaction) {
                    _this._sendEvent(finalEvent);
                    resolve(finalEvent);
                    return;
                }
                var beforeSendResult = beforeSend(prepared, hint);
                if (typeof beforeSendResult === 'undefined') {
                    logger.error('`beforeSend` method has to return `null` or a valid event.');
                }
                else if (Object(is["j" /* isThenable */])(beforeSendResult)) {
                    _this._handleAsyncBeforeSend(beforeSendResult, resolve, reject);
                }
                else {
                    finalEvent = beforeSendResult;
                    if (finalEvent === null) {
                        logger.log('`beforeSend` returned `null`, will not send event.');
                        resolve(null);
                        return;
                    }
                    // From here on we are really async
                    _this._sendEvent(finalEvent);
                    resolve(finalEvent);
                }
            })
                .then(null, function (reason) {
                _this.captureException(reason, {
                    data: {
                        __sentry__: true,
                    },
                    originalException: reason,
                });
                reject("Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: " + reason);
            });
        });
    };
    /**
     * Resolves before send Promise and calls resolve/reject on parent SyncPromise.
     */
    BaseClient.prototype._handleAsyncBeforeSend = function (beforeSend, resolve, reject) {
        var _this = this;
        beforeSend
            .then(function (processedEvent) {
            if (processedEvent === null) {
                reject('`beforeSend` returned `null`, will not send event.');
                return;
            }
            // From here on we are really async
            _this._sendEvent(processedEvent);
            resolve(processedEvent);
        })
            .then(null, function (e) {
            reject("beforeSend rejected with " + e);
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
            allowUrls: core_node_modules_tslib_tslib_es6_spread((this._options.whitelistUrls || []), (this._options.allowUrls || []), (clientOptions.whitelistUrls || []), (clientOptions.allowUrls || [])),
            denyUrls: core_node_modules_tslib_tslib_es6_spread((this._options.blacklistUrls || []), (this._options.denyUrls || []), (clientOptions.blacklistUrls || []), (clientOptions.denyUrls || [])),
            ignoreErrors: core_node_modules_tslib_tslib_es6_spread((this._options.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
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
 * @param clientClass The client class to instanciate.
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
var external_domain_ = __webpack_require__(31);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(8);

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
        var consoleModule = __webpack_require__(161);
        try {
            for (var _b = __values(['debug', 'info', 'warn', 'error', 'log']), _c = _b.next(); !_c.done; _c = _b.next()) {
                var level = _c.value;
                fill(consoleModule, level, createConsoleWrapper(level));
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


var NODE_VERSION = Object(misc["k" /* parseSemver */])(process.versions.node);
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
        var handlerWrapper = createHandlerWrapper(this._breadcrumbs, this._tracing);
        var httpModule = __webpack_require__(16);
        fill(httpModule, 'get', handlerWrapper);
        fill(httpModule, 'request', handlerWrapper);
        // NOTE: Prior to Node 9, `https` used internals of `http` module, thus we don't patch it.
        // If we do, we'd get double breadcrumbs and double spans for `https` calls.
        // It has been changed in Node 9, so for all versions equal and above, we patch `https` separately.
        if (NODE_VERSION.major && NODE_VERSION.major > 8) {
            var httpsModule = __webpack_require__(28);
            fill(httpsModule, 'get', handlerWrapper);
            fill(httpsModule, 'request', handlerWrapper);
        }
    };
    /**
     * @inheritDoc
     */
    Http.id = 'Http';
    return Http;
}());

/**
 * Wrapper function for internal `request` and `get` calls within `http` and `https` modules
 */
function createHandlerWrapper(breadcrumbsEnabled, tracingEnabled) {
    return function handlerWrapper(originalHandler) {
        return function (options) {
            var requestUrl = extractUrl(options);
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
                    span.finish();
                }
            })
                .once('error', function () {
                if (breadcrumbsEnabled) {
                    addRequestBreadcrumb('error', requestUrl, this);
                }
                if (tracingEnabled && span) {
                    span.setHttpStatus(500);
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
 * Function that can combine together a url that'll be used for our breadcrumbs.
 *
 * @param options url that should be returned or an object containing it's parts.
 * @returns constructed url
 */
function extractUrl(options) {
    if (typeof options === 'string') {
        return options;
    }
    var protocol = options.protocol || '';
    var hostname = options.hostname || options.host || '';
    // Don't log standard :80 (http) and :443 (https) ports to reduce the noise
    var port = !options.port || options.port === 80 || options.port === 443 ? '' : ":" + options.port;
    var path = options.path || '/';
    return protocol + "//" + hostname + port + path;
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
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/tracing/node_modules/tslib/tslib.es6.js
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

var tracing_node_modules_tslib_tslib_es6_extendStatics = function(d, b) {
    tracing_node_modules_tslib_tslib_es6_extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return tracing_node_modules_tslib_tslib_es6_extendStatics(d, b);
};

function tracing_node_modules_tslib_tslib_es6_extends(d, b) {
    tracing_node_modules_tslib_tslib_es6_extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var tracing_node_modules_tslib_tslib_es6_assign = function() {
    tracing_node_modules_tslib_tslib_es6_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return tracing_node_modules_tslib_tslib_es6_assign.apply(this, arguments);
}

function tracing_node_modules_tslib_tslib_es6_rest(s, e) {
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

function tracing_node_modules_tslib_tslib_es6_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function tracing_node_modules_tslib_tslib_es6_param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function tracing_node_modules_tslib_tslib_es6_metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function tracing_node_modules_tslib_tslib_es6_awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function tracing_node_modules_tslib_tslib_es6_generator(thisArg, body) {
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

function tracing_node_modules_tslib_tslib_es6_createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function tracing_node_modules_tslib_tslib_es6_exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function tracing_node_modules_tslib_tslib_es6_values(o) {
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

function tracing_node_modules_tslib_tslib_es6_read(o, n) {
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

function tracing_node_modules_tslib_tslib_es6_spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(tracing_node_modules_tslib_tslib_es6_read(arguments[i]));
    return ar;
}

function tracing_node_modules_tslib_tslib_es6_spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function tracing_node_modules_tslib_tslib_es6_await(v) {
    return this instanceof tracing_node_modules_tslib_tslib_es6_await ? (this.v = v, this) : new tracing_node_modules_tslib_tslib_es6_await(v);
}

function tracing_node_modules_tslib_tslib_es6_asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof tracing_node_modules_tslib_tslib_es6_await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function tracing_node_modules_tslib_tslib_es6_asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: tracing_node_modules_tslib_tslib_es6_await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function tracing_node_modules_tslib_tslib_es6_asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof tracing_node_modules_tslib_tslib_es6_values === "function" ? tracing_node_modules_tslib_tslib_es6_values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function tracing_node_modules_tslib_tslib_es6_makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function tracing_node_modules_tslib_tslib_es6_importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function tracing_node_modules_tslib_tslib_es6_importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function tracing_node_modules_tslib_tslib_es6_classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function tracing_node_modules_tslib_tslib_es6_classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/tracing/esm/spanstatus.js
/** The status of an Span. */
// eslint-disable-next-line import/export
var SpanStatus;
(function (SpanStatus) {
    /** The operation completed successfully. */
    SpanStatus["Ok"] = "ok";
    /** Deadline expired before operation could complete. */
    SpanStatus["DeadlineExceeded"] = "deadline_exceeded";
    /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */
    SpanStatus["Unauthenticated"] = "unauthenticated";
    /** 403 Forbidden */
    SpanStatus["PermissionDenied"] = "permission_denied";
    /** 404 Not Found. Some requested entity (file or directory) was not found. */
    SpanStatus["NotFound"] = "not_found";
    /** 429 Too Many Requests */
    SpanStatus["ResourceExhausted"] = "resource_exhausted";
    /** Client specified an invalid argument. 4xx. */
    SpanStatus["InvalidArgument"] = "invalid_argument";
    /** 501 Not Implemented */
    SpanStatus["Unimplemented"] = "unimplemented";
    /** 503 Service Unavailable */
    SpanStatus["Unavailable"] = "unavailable";
    /** Other/generic 5xx. */
    SpanStatus["InternalError"] = "internal_error";
    /** Unknown. Any non-standard HTTP status code. */
    SpanStatus["UnknownError"] = "unknown_error";
    /** The operation was cancelled (typically by the user). */
    SpanStatus["Cancelled"] = "cancelled";
    /** Already exists (409) */
    SpanStatus["AlreadyExists"] = "already_exists";
    /** Operation was rejected because the system is not in a state required for the operation's */
    SpanStatus["FailedPrecondition"] = "failed_precondition";
    /** The operation was aborted, typically due to a concurrency issue. */
    SpanStatus["Aborted"] = "aborted";
    /** Operation was attempted past the valid range. */
    SpanStatus["OutOfRange"] = "out_of_range";
    /** Unrecoverable data loss or corruption */
    SpanStatus["DataLoss"] = "data_loss";
})(SpanStatus || (SpanStatus = {}));
// eslint-disable-next-line @typescript-eslint/no-namespace, import/export
(function (SpanStatus) {
    /**
     * Converts a HTTP status code into a {@link SpanStatus}.
     *
     * @param httpStatus The HTTP response status code.
     * @returns The span status or {@link SpanStatus.UnknownError}.
     */
    function fromHttpCode(httpStatus) {
        if (httpStatus < 400) {
            return SpanStatus.Ok;
        }
        if (httpStatus >= 400 && httpStatus < 500) {
            switch (httpStatus) {
                case 401:
                    return SpanStatus.Unauthenticated;
                case 403:
                    return SpanStatus.PermissionDenied;
                case 404:
                    return SpanStatus.NotFound;
                case 409:
                    return SpanStatus.AlreadyExists;
                case 413:
                    return SpanStatus.FailedPrecondition;
                case 429:
                    return SpanStatus.ResourceExhausted;
                default:
                    return SpanStatus.InvalidArgument;
            }
        }
        if (httpStatus >= 500 && httpStatus < 600) {
            switch (httpStatus) {
                case 501:
                    return SpanStatus.Unimplemented;
                case 503:
                    return SpanStatus.Unavailable;
                case 504:
                    return SpanStatus.DeadlineExceeded;
                default:
                    return SpanStatus.InternalError;
            }
        }
        return SpanStatus.UnknownError;
    }
    SpanStatus.fromHttpCode = fromHttpCode;
})(SpanStatus || (SpanStatus = {}));
//# sourceMappingURL=spanstatus.js.map
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/tracing/esm/span.js



var TRACEPARENT_REGEXP = new RegExp('^[ \\t]*' + // whitespace
    '([0-9a-f]{32})?' + // trace_id
    '-?([0-9a-f]{16})?' + // span_id
    '-?([01])?' + // sampled
    '[ \\t]*$');
/**
 * Keeps track of finished spans for a given transaction
 * @internal
 * @hideconstructor
 * @hidden
 */
var SpanRecorder = /** @class */ (function () {
    function SpanRecorder(maxlen) {
        if (maxlen === void 0) { maxlen = 1000; }
        this.spans = [];
        this._maxlen = maxlen;
    }
    /**
     * This is just so that we don't run out of memory while recording a lot
     * of spans. At some point we just stop and flush out the start of the
     * trace tree (i.e.the first n spans with the smallest
     * start_timestamp).
     */
    SpanRecorder.prototype.add = function (span) {
        if (this.spans.length > this._maxlen) {
            span.spanRecorder = undefined;
        }
        else {
            this.spans.push(span);
        }
    };
    return SpanRecorder;
}());

/**
 * Span contains all data about a span
 */
var span_Span = /** @class */ (function () {
    /**
     * You should never call the constructor manually, always use `hub.startSpan()`.
     * @internal
     * @hideconstructor
     * @hidden
     */
    function Span(spanContext) {
        /**
         * @inheritDoc
         */
        this.traceId = Object(misc["m" /* uuid4 */])();
        /**
         * @inheritDoc
         */
        this.spanId = Object(misc["m" /* uuid4 */])().substring(16);
        /**
         * Timestamp in seconds when the span was created.
         */
        this.startTimestamp = Object(misc["l" /* timestampWithMs */])();
        /**
         * @inheritDoc
         */
        this.tags = {};
        /**
         * @inheritDoc
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.data = {};
        if (!spanContext) {
            return this;
        }
        if (spanContext.traceId) {
            this.traceId = spanContext.traceId;
        }
        if (spanContext.spanId) {
            this.spanId = spanContext.spanId;
        }
        if (spanContext.parentSpanId) {
            this.parentSpanId = spanContext.parentSpanId;
        }
        // We want to include booleans as well here
        if ('sampled' in spanContext) {
            this.sampled = spanContext.sampled;
        }
        if (spanContext.op) {
            this.op = spanContext.op;
        }
        if (spanContext.description) {
            this.description = spanContext.description;
        }
        if (spanContext.data) {
            this.data = spanContext.data;
        }
        if (spanContext.tags) {
            this.tags = spanContext.tags;
        }
        if (spanContext.status) {
            this.status = spanContext.status;
        }
        if (spanContext.startTimestamp) {
            this.startTimestamp = spanContext.startTimestamp;
        }
        if (spanContext.endTimestamp) {
            this.endTimestamp = spanContext.endTimestamp;
        }
    }
    /**
     * Continues a trace from a string (usually the header).
     * @param traceparent Traceparent string
     */
    Span.fromTraceparent = function (traceparent, spanContext) {
        var matches = traceparent.match(TRACEPARENT_REGEXP);
        if (matches) {
            var sampled = void 0;
            if (matches[3] === '1') {
                sampled = true;
            }
            else if (matches[3] === '0') {
                sampled = false;
            }
            return new Span(tracing_node_modules_tslib_tslib_es6_assign(tracing_node_modules_tslib_tslib_es6_assign({}, spanContext), { parentSpanId: matches[2], sampled: sampled, traceId: matches[1] }));
        }
        return undefined;
    };
    /**
     * @inheritDoc
     * @deprecated
     */
    Span.prototype.child = function (spanContext) {
        return this.startChild(spanContext);
    };
    /**
     * @inheritDoc
     */
    Span.prototype.startChild = function (spanContext) {
        var span = new Span(tracing_node_modules_tslib_tslib_es6_assign(tracing_node_modules_tslib_tslib_es6_assign({}, spanContext), { parentSpanId: this.spanId, sampled: this.sampled, traceId: this.traceId }));
        span.spanRecorder = this.spanRecorder;
        if (span.spanRecorder) {
            span.spanRecorder.add(span);
        }
        return span;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.setTag = function (key, value) {
        var _a;
        this.tags = tracing_node_modules_tslib_tslib_es6_assign(tracing_node_modules_tslib_tslib_es6_assign({}, this.tags), (_a = {}, _a[key] = value, _a));
        return this;
    };
    /**
     * @inheritDoc
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    Span.prototype.setData = function (key, value) {
        var _a;
        this.data = tracing_node_modules_tslib_tslib_es6_assign(tracing_node_modules_tslib_tslib_es6_assign({}, this.data), (_a = {}, _a[key] = value, _a));
        return this;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.setStatus = function (value) {
        this.status = value;
        return this;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.setHttpStatus = function (httpStatus) {
        this.setTag('http.status_code', String(httpStatus));
        var spanStatus = SpanStatus.fromHttpCode(httpStatus);
        if (spanStatus !== SpanStatus.UnknownError) {
            this.setStatus(spanStatus);
        }
        return this;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.isSuccess = function () {
        return this.status === SpanStatus.Ok;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.finish = function (endTimestamp) {
        this.endTimestamp = typeof endTimestamp === 'number' ? endTimestamp : Object(misc["l" /* timestampWithMs */])();
    };
    /**
     * @inheritDoc
     */
    Span.prototype.toTraceparent = function () {
        var sampledString = '';
        if (this.sampled !== undefined) {
            sampledString = this.sampled ? '-1' : '-0';
        }
        return this.traceId + "-" + this.spanId + sampledString;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.getTraceContext = function () {
        return dropUndefinedKeys({
            data: Object.keys(this.data).length > 0 ? this.data : undefined,
            description: this.description,
            op: this.op,
            parent_span_id: this.parentSpanId,
            span_id: this.spanId,
            status: this.status,
            tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
            trace_id: this.traceId,
        });
    };
    /**
     * @inheritDoc
     */
    Span.prototype.toJSON = function () {
        return dropUndefinedKeys({
            data: Object.keys(this.data).length > 0 ? this.data : undefined,
            description: this.description,
            op: this.op,
            parent_span_id: this.parentSpanId,
            span_id: this.spanId,
            start_timestamp: this.startTimestamp,
            status: this.status,
            tags: Object.keys(this.tags).length > 0 ? this.tags : undefined,
            timestamp: this.endTimestamp,
            trace_id: this.traceId,
        });
    };
    return Span;
}());

//# sourceMappingURL=span.js.map
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
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/@sentry/node/node_modules/cookie/index.js
var cookie = __webpack_require__(109);

// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(30);

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
        var reqUrl = req.url;
        var traceId;
        var parentSpanId;
        var sampled;
        // If there is a trace header set, we extract the data from it (parentSpanId, traceId, and sampling decision)
        if (req.headers && Object(is["h" /* isString */])(req.headers['sentry-trace'])) {
            var span = span_Span.fromTraceparent(req.headers['sentry-trace']);
            if (span) {
                traceId = span.traceId;
                parentSpanId = span.parentSpanId;
                sampled = span.sampled;
            }
        }
        var transaction = startTransaction({
            name: reqMethod + " " + reqUrl,
            op: 'http.server',
            parentSpanId: parentSpanId,
            sampled: sampled,
            traceId: traceId,
        });
        // We put the transaction on the scope so users can attach children to it
        hub_getCurrentHub().configureScope(function (scope) {
            scope.setSpan(transaction);
        });
        // We also set __sentry_transaction on the response so people can grab the transaction there to add
        // spans to it later.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        res.__sentry_transaction = transaction;
        res.once('finish', function () {
            transaction.setHttpStatus(res.statusCode);
            transaction.finish();
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
/** Default request keys that'll be used to extract data from the request */
var DEFAULT_REQUEST_KEYS = ['cookies', 'data', 'headers', 'method', 'query_string', 'url'];
/** JSDoc */
function extractRequestData(req, keys) {
    var request = {};
    var attributes = Array.isArray(keys) ? keys : DEFAULT_REQUEST_KEYS;
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
    var originalUrl = (req.originalUrl || req.url);
    // absolute url
    var absoluteUrl = protocol + "://" + host + originalUrl;
    attributes.forEach(function (key) {
        switch (key) {
            case 'headers':
                request.headers = headers;
                break;
            case 'method':
                request.method = method;
                break;
            case 'url':
                request.url = absoluteUrl;
                break;
            case 'cookies':
                // cookies:
                //   node, express, koa: req.headers.cookie
                request.cookies = cookie["parse"](headers.cookie || '');
                break;
            case 'query_string':
                // query string:
                //   node: req.url (raw)
                //   express, koa: req.query
                request.query_string = external_url_["parse"](originalUrl || '', false).query;
                break;
            case 'data':
                if (method === 'GET' || method === 'HEAD') {
                    break;
                }
                // body data:
                //   node, express, koa: req.body
                if (req.body !== undefined) {
                    request.data = Object(is["h" /* isString */])(req.body) ? req.body : JSON.stringify(normalize(req.body));
                }
                break;
            default:
                if ({}.hasOwnProperty.call(req, key)) {
                    request[key] = req[key];
                }
        }
    });
    return request;
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
        event.request = __assign(__assign({}, event.request), extractRequestData(req, options.request));
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
var external_path_ = __webpack_require__(20);

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
        var global_1 = Object(misc["g" /* getGlobalObject */])();
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

// We need to patch domain on the global __SENTRY__ object to make it work for node
// if we don't do this, browser bundlers will have troubles resolving require('domain')
var esm_carrier = getMainCarrier();
if (esm_carrier.__SENTRY__) {
    esm_carrier.__SENTRY__.extensions = esm_carrier.__SENTRY__.extensions || {};
    if (!esm_carrier.__SENTRY__.extensions.domain) {
        // @ts-ignore domain is missing from extensions Type
        esm_carrier.__SENTRY__.extensions.domain = external_domain_;
    }
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 21:
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

/***/ 22:
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

/***/ 24:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ OWN_LOGGER_NAME; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ create; });

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-node/dist/src.es2019/index.js
var src_es2019 = __webpack_require__(46);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/consts-base.js
var consts_base = __webpack_require__(33);

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

function create() {
  //console.trace('[UDA--node installing…]')
  ////////////////////////////////////
  const loggers = {}; // to avoid creating duplicates

  const debugCommands = {}; // TODO check

  const exposed = {};
  const overrides = {}; // we'll expose them for clarity
  ////////////////////////////////////
  // TODO override?
  // TODO allow off?

  const _ownLogger = Object(src_es2019["createLogger"])({
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

  _ownLogger.log(`Instantiated. (revision: ${REVISION})`);

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
      create
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
    const name = p.name || consts_base["a" /* DEFAULT_LOGGER_KEY */]; // we need a name immediately

    if (!loggers[name]) {
      try {
        const ovKey = getOverrideKeyForLogger(name);

        if (!p.forcedLevel && _getOverrideRequestedSJson(ovKey)) {
          p = { ...p,
            forcedLevel: overrideHook(ovKey, p.suggestedLevel || consts_base["b" /* DEFAULT_LOG_LEVEL */])
          };
        }
      } catch (err) {
        // this warning should appear only once on creation ✔
        _ownLogger.warn('getLogger(): error overriding the level!', {
          name,
          err
        });
      }

      loggers[name] = Object(src_es2019["createLogger"])(p);
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

/***/ }),

/***/ 25:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return truncate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return snipLine; });
/* unused harmony export safeJoin */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isMatchingPattern; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

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

/***/ 28:
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ 29:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(153);
} else {
	module.exports = __webpack_require__(155);
}


/***/ }),

/***/ 3:
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

/***/ 30:
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ 31:
/***/ (function(module, exports) {

module.exports = require("domain");

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(77);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types__WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _root__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRootSEC", function() { return _root__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(39);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LIB", function() { return _core__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isSEC", function() { return _core__WEBPACK_IMPORTED_MODULE_2__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createSEC", function() { return _core__WEBPACK_IMPORTED_MODULE_2__["b"]; });

/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flattenToOwn", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_getSECStatePath", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_flattenSEC", function() { return _utils__WEBPACK_IMPORTED_MODULE_3__["a"]; });






/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DEFAULT_LOG_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_LOGGER_KEY; });
// base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.
const DEFAULT_LOG_LEVEL = 'error';
const DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key

/***/ }),

/***/ 35:
/***/ (function(module, exports) {



/***/ }),

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ consts["b" /* LIB */]; });
__webpack_require__.d(__webpack_exports__, "c", function() { return /* binding */ isSEC; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* binding */ createSEC; });

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

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/consts.js
var consts = __webpack_require__(1);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/emittery/index.js
var emittery = __webpack_require__(86);
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


// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/utils.js
var utils = __webpack_require__(5);

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
      let root_state = SEC[consts["a" /* INTERNAL_PROP */]];
      root_state = reduce_plugin(root_state, PLUGIN_ID, state => {
        if (module) state = set_module(state, module);
        if (operation) state = set_operation(state, operation);
        return state;
      });
      SEC[consts["a" /* INTERNAL_PROP */]] = root_state;
      return SEC;
    };

    prototype.getLogicalStack = function getLogicalStack() {
      const SEC = this;
      return _reduceStatePathToLogicalStack(Object(utils["b" /* _getSECStatePath */])(SEC));
    };

    prototype.getShortLogicalStack = function get_stack_end() {
      const {
        stack
      } = this[consts["a" /* INTERNAL_PROP */]].plugins[PLUGIN_ID];
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

          const current_path = Object(utils["b" /* _getSECStatePath */])(SEC); // find common path


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
        err._temp.statePath = Object(utils["b" /* _getSECStatePath */])(SEC);
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
      let root_state = this[consts["a" /* INTERNAL_PROP */]];
      root_state = reduce_plugin(root_state, dependency_injection_PLUGIN_ID, state => {
        Object.entries(deps).forEach(([key, value]) => {
          state = state_injectDependencies(state, key, value);
        });
        return state;
      });
      this[consts["a" /* INTERNAL_PROP */]] = root_state;
      return this; // for chaining
    };

    prototype.getInjectedDependencies = function getInjectedDependencies() {
      const plugin_state = this[consts["a" /* INTERNAL_PROP */]].plugins[dependency_injection_PLUGIN_ID];
      return Object(utils["c" /* flattenToOwn */])(plugin_state.context);
    };
  }
};

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/promise-try/dist/src.es2019/index.js
// http://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry(fn) {
  return Promise.resolve().then(fn);
}


// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/1-stdlib/timestamps/dist/src.es2019/generate.js
var generate = __webpack_require__(111);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/error-utils/dist/src.es2019/util--normalize.js
var util_normalize = __webpack_require__(88);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/error-utils/dist/src.es2019/util--create.js
var util_create = __webpack_require__(89);

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
      const state = SEC[consts["a" /* INTERNAL_PROP */]];
      const now = Object(generate["d" /* get_UTC_timestamp_ms */])();
      const autoDetails = {
        ENV: state.plugins[dependency_injection_PLUGIN_ID].context.ENV,
        TIME: now,
        SESSION_DURATION_MS: now - state.plugins[dependency_injection_PLUGIN_ID].context.SESSION_START_TIME_MS
      };
      const userDetails = Object(utils["c" /* flattenToOwn */])(state.plugins[error_handling_PLUGIN_ID].details);
      err.details = { ...autoDetails,
        ...userDetails,
        ...(err.details || {})
      };
      return err;
    };

    prototype.setErrorReportDetails = function setErrorReportDetails(details) {
      const SEC = this;
      let root_state = SEC[consts["a" /* INTERNAL_PROP */]];
      root_state = reduce_plugin(root_state, error_handling_PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = addDetail(plugin_state, key, value);
        });
        return plugin_state;
      });
      this[consts["a" /* INTERNAL_PROP */]] = root_state;
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
      const params = SEC[consts["a" /* INTERNAL_PROP */]].plugins[dependency_injection_PLUGIN_ID].context;

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
      const params = SEC[consts["a" /* INTERNAL_PROP */]].plugins[dependency_injection_PLUGIN_ID].context;

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
      const params = SEC[consts["a" /* INTERNAL_PROP */]].plugins[dependency_injection_PLUGIN_ID].context;
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
      const params = SEC[consts["a" /* INTERNAL_PROP */]].plugins[dependency_injection_PLUGIN_ID].context;
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
      let root_state = SEC[consts["a" /* INTERNAL_PROP */]];
      root_state = reduce_plugin(root_state, analytics_PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = state_addDetail(plugin_state, key, value);
        });
        return plugin_state;
      });
      this[consts["a" /* INTERNAL_PROP */]] = root_state;
      return SEC; // for chaining
    };

    prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId, details = {}) {
      const SEC = this;
      const now = Object(generate["d" /* get_UTC_timestamp_ms */])();
      const root_state = SEC[consts["a" /* INTERNAL_PROP */]];
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
      const plugin_state = SEC[consts["a" /* INTERNAL_PROP */]].plugins[analytics_PLUGIN_ID];
      return Object(utils["c" /* flattenToOwn */])(plugin_state.details);
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
  return SEC && SEC[consts["a" /* INTERNAL_PROP */]];
}

function createSEC(args = {}) {
  /////// PARAMS ///////
  if (args.parent && !isSEC(args.parent)) throw new Error(`${consts["b" /* LIB */]}›createSEC() argument error: parent must be a valid SEC!`);
  let unhandled_args = Object.keys(args);
  const SEC = Object.create(ROOT_PROTOTYPE); /////// STATE ///////

  const parent_state = args.parent ? args.parent[consts["a" /* INTERNAL_PROP */]] : undefined;
  let state = create(parent_state);
  unhandled_args = unhandled_args.filter(arg => arg !== 'parent');
  PLUGINS.forEach(PLUGIN => {
    state = activate_plugin(state, PLUGIN);
  });
  SEC[consts["a" /* INTERNAL_PROP */]] = state; // auto injections

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

  if (unhandled_args.length) throw new Error(`${consts["b" /* LIB */]}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`); /////////////////////

  return SEC;
}



/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),

/***/ 43:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLogger", function() { return getLogger; });
/* unused harmony export exposeInternal */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "overrideHook", function() { return overrideHook; });
/* unused harmony export addDebugCommand */
/* unused harmony export globalThis */
/* harmony import */ var _offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _v1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54);


const globalThis = Object(_offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__[/* getGlobalThis */ "a"])(); // ensure the root is present

globalThis._debug = globalThis._debug || {}; // install globally if no other implementation already present

globalThis._debug.v1 = globalThis._debug.v1 || Object(_v1__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(); // expose the installed implementation

const instance = globalThis._debug.v1;
const {
  getLogger,
  exposeInternal,
  overrideHook,
  addDebugCommand
} = instance;
 // types & sub-types, for convenience



/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANNEL = void 0;

const typescript_string_enums_1 = __webpack_require__(21);

const functions_interface_1 = __webpack_require__(65); /////////////////////////////////////////////////


exports.CHANNEL = (() => {
  /*console.log('CHANNEL detection', {
      'process.env.CHANNEL': process.env.CHANNEL,
      'process.env.AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY,
      'process.env.NODE_ENV': process.env.NODE_ENV,
  })*/
  if (typescript_string_enums_1.Enum.isType(functions_interface_1.ReleaseChannel, process.env.CHANNEL)) return process.env.CHANNEL;
  if (process.env.AWS_SECRET_ACCESS_KEY) return functions_interface_1.ReleaseChannel.prod;
  return  false ? undefined : functions_interface_1.ReleaseChannel.prod;
})();

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLogger", function() { return createLogger; });
/* harmony import */ var _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(121);
/* harmony import */ var _sinks_to_console__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73);


const ORIGINAL_CONSOLE = console;

function createLogger(p = {}) {
  var _a;

  const {
    group,
    groupCollapsed,
    groupEnd
  } = ORIGINAL_CONSOLE;
  return { ...Object(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__[/* create */ "a"])(p, ((_a = p.sinkOptions) === null || _a === void 0 ? void 0 : _a.sink) || Object(_sinks_to_console__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"])(p.sinkOptions)),
    group,
    groupCollapsed,
    groupEnd
  };
}





/***/ }),

/***/ 48:
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ 5:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return flattenToOwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return _getSECStatePath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _flattenSEC; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


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
  if (!SEC[_consts__WEBPACK_IMPORTED_MODULE_0__[/* INTERNAL_PROP */ "a"]].cache.statePath) {
    const path = [];
    let state = SEC[_consts__WEBPACK_IMPORTED_MODULE_0__[/* INTERNAL_PROP */ "a"]];

    while (state) {
      path.unshift(state);
      state = state.parent;
    }

    SEC[_consts__WEBPACK_IMPORTED_MODULE_0__[/* INTERNAL_PROP */ "a"]].cache.statePath = path;
  }

  return SEC[_consts__WEBPACK_IMPORTED_MODULE_0__[/* INTERNAL_PROP */ "a"]].cache.statePath;
} // for debug


function _flattenSEC(SEC) {
  const plugins = { ...SEC[_consts__WEBPACK_IMPORTED_MODULE_0__[/* INTERNAL_PROP */ "a"]].plugins
  };
  plugins.analytics.details = flattenToOwn(plugins.analytics.details);
  plugins.dependency_injection.context = flattenToOwn(plugins.dependency_injection.context);
  plugins.error_handling.details = flattenToOwn(plugins.error_handling.details);
  plugins.logical_stack.stack = flattenToOwn(plugins.logical_stack.stack);
  return plugins;
}



/***/ }),

/***/ 537:
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

__webpack_require__(76);

const sentry_1 = __webpack_require__(150); ////////////////////////////////////


const handler = async (event, badly_typed_context) => {
  var _a;

  let message = ((_a = event === null || event === void 0 ? void 0 : event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error!';
  if (!message.endsWith('!')) message = message + '!';
  const err = new Error(message);
  await sentry_1.on_error(err);
  return {
    statusCode: 200,
    headers: {},
    body: 'Error reported✔'
  };
};

exports.handler = handler;

/***/ }),

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ create; });

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

/***/ }),

/***/ 64:
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

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "LIB", function() { return /* reexport */ LIB; });
__webpack_require__.d(__webpack_exports__, "HEADER_IMPERSONATE", function() { return /* reexport */ HEADER_IMPERSONATE; });
__webpack_require__.d(__webpack_exports__, "Endpoint", function() { return /* reexport */ Endpoint; });
__webpack_require__.d(__webpack_exports__, "SERVER_RESPONSE_VERSION", function() { return /* reexport */ SERVER_RESPONSE_VERSION; });
__webpack_require__.d(__webpack_exports__, "HeadersV", function() { return /* reexport */ HeadersV; });
__webpack_require__.d(__webpack_exports__, "fetch_oa", function() { return /* reexport */ fetch_oa; });
__webpack_require__.d(__webpack_exports__, "ReleaseChannel", function() { return /* reexport */ ReleaseChannel; });
__webpack_require__.d(__webpack_exports__, "get_allowed_origin", function() { return /* reexport */ get_allowed_origin; });
__webpack_require__.d(__webpack_exports__, "get_api_base_url", function() { return /* reexport */ get_api_base_url; });
__webpack_require__.d(__webpack_exports__, "create_server_response_body__blank", function() { return /* reexport */ create_server_response_body__blank; });
__webpack_require__.d(__webpack_exports__, "create_server_response_body__error", function() { return /* reexport */ create_server_response_body__error; });
__webpack_require__.d(__webpack_exports__, "create_server_response_body__data", function() { return /* reexport */ create_server_response_body__data; });

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/typescript-string-enums/dist/index.js
var dist = __webpack_require__(21);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/functions-interface/dist/src.es2019/consts.js
 /////////////////////////////////////////////////

const LIB = '@online-adventur.es/functions-interface'; /////////////////////////////////////////////////

const HEADER_IMPERSONATE = "X-OFFIRMO-IMPERSONATE".toLowerCase(); // tslint:disable-next-line: variable-name

const Endpoint = Object(dist["Enum"])('whoami', 'report-error', 'key-value', // dev
'echo', 'hello-world', 'hello-world-advanced', 'test-error-handling', 'temp');
const SERVER_RESPONSE_VERSION = 1;
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/node_modules/fetch-ponyfill/fetch-node.js
var fetch_node = __webpack_require__(85);
var fetch_node_default = /*#__PURE__*/__webpack_require__.n(fetch_node);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/soft-execution-context/dist/src.es2019/index.js
var src_es2019 = __webpack_require__(32);

// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced--multi/universal-debug-api-placeholder/dist/src.es2019/index.js
var dist_src_es2019 = __webpack_require__(43);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/functions-interface/dist/src.es2019/utils.js

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
  return Object(dist_src_es2019["overrideHook"])('api-base-url', _get_api_base_url(channel));
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
// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/error-utils/dist/src.es2019/util--create.js
var util_create = __webpack_require__(89);

// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/functions-interface/dist/src.es2019/fetch.js




const {
  fetch,
  Response: ResponseV,
  Headers: HeadersV
} = fetch_node_default()();

/*export {
    fetch,
    Request,
    OAResponse,
    Headers,
}*/

let request_count = 0; // for logging

async function fetch_oa({
  SEC = Object(src_es2019["getRootSEC"])(),
  url,
  method = 'GET',
  headers = {},
  body,
  timeout_ms = 10000
} = {}) {
  return SEC.xPromiseTry('foo', async ({
    SEC,
    logger,
    CHANNEL
  }) => {
    const request_id = ++request_count;
    const channel = CHANNEL;
    logger.trace(`fetch_it() #${request_id}…`, {
      method,
      url,
      body,
      headers
    });
    url = [get_api_base_url(channel), url].join('/');
    headers = { ...headers,
      'Content-Type': 'application/json'
    };
    let fetch_response = undefined;
    let response_for_logging;
    let candidate_error = null;
    return Promise.race([new Promise((resolve, reject) => setTimeout(() => {
      reject(new Error('Timeout!'));
    }, timeout_ms)), fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    })]).then(response => {
      logger.trace(`fetch_it() #${request_id}: got fetch response`, {
        method,
        url,
        response
      });
      response_for_logging = fetch_response = response.clone(); // reminder: we can't destructure response because .json() needs a binding to response

      if (!response.ok) {
        candidate_error = Object(util_create["a" /* createError */])(`HTTP error ${response.status} "${response.statusText}"!`, {
          statusCode: response.status
        });
      } // even if the response has an error status, we still need to attempt decoding the json
      // since it can hold error data


      return response.json();
    }).then(response => {
      logger.trace(`fetch_it() #${request_id}: got json body`, {
        method,
        url,
        response
      });
      response_for_logging = response;
      if (!response) throw candidate_error || new Error('No response data!');
      const {
        v,
        error,
        data,
        side = {},
        meta = {}
      } = response;
      if (!v) throw new Error('body doesnt have the expected OA response format!');
      if (v !== 1) throw new Error('Invalid OA response format version!');

      if (error) {
        throw Object(util_create["a" /* createError */])('', error);
      } // now that we handled the possible error in body, we can fall back to the auto one


      if (!fetch_response.ok) {
        throw candidate_error;
      }

      logger.trace(`fetch_it() #${request_id}: got OA response body`, {
        method,
        url,
        v,
        error,
        data,
        side,
        meta
      });

      if (!data) {
        throw new Error('No response data!');
      }

      return {
        data,
        side
      };
    }).catch(err => {
      logger.warn(`fetch_it #${request_id} ended with an error!`, {
        method,
        url,
        response: response_for_logging,
        err,
        err_message: err.message
      });
      throw err;
    });
  });
}
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/functions-interface/dist/src.es2019/types.js
 // tslint:disable-next-line: variable-name

const ReleaseChannel = Object(dist["Enum"])('prod', 'staging', 'dev');
// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/A-apps/online-adventur.es/functions-interface/dist/src.es2019/index.js





/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(115);

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

/***/ 7:
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ 73:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// UNUSED EXPORTS: createSink

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

                  case 'Buffer':
                    // too big!
                    return '/*…*/';
                  // other

                  default:
                    if (p.constructor.name.endsWith('Error')) {
                      const err = obj; // no need to pretty print it as copy/pastable to code,
                      // 99.9% chance that's not what we want here

                      return o.stylize_error(o.quote + err.message + o.quote);
                    } // NO! This can turn into a huge thing, ex. a fetch response


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
var fields = __webpack_require__(18);

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


// EXTERNAL MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/2-foundation/practical-logger-core/dist/src.es2019/consts.js
var consts = __webpack_require__(11);

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
  fatal: source_default.a.bgRed.white.bold(to_aligned_ascii(' ' + consts["c" /* LOG_LEVEL_TO_HUMAN */]['fatal'])),
  emerg: source_default.a.bgRed.white.bold(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['emerg'])),
  alert: source_default.a.bgRed.white.bold(to_aligned_ascii(' ' + consts["c" /* LOG_LEVEL_TO_HUMAN */]['alert'])),
  crit: source_default.a.bgRed.white.bold(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['crit'])),
  error: source_default.a.red.bold(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['error'])),
  warning: source_default.a.yellow.bold(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['warning'])),
  warn: source_default.a.yellow.bold(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['warn'])),
  notice: source_default.a.blue(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['notice'])),
  info: source_default.a.blue(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['info'])),
  verbose: to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['verbose']),
  log: to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['log']),
  debug: to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['debug']),
  trace: source_default.a.dim(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['trace'])),
  silly: source_default.a.dim(to_aligned_ascii(consts["c" /* LOG_LEVEL_TO_HUMAN */]['silly']))
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
/* harmony default export */ var to_console = __webpack_exports__["a"] = (createSink);

/***/ }),

/***/ 75:
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLogger", function() { return getLogger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exposeInternal", function() { return exposeInternal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "overrideHook", function() { return overrideHook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDebugCommand", function() { return addDebugCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "globalThis", function() { return globalThis; });
/* harmony import */ var _offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _v1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createV1", function() { return _v1__WEBPACK_IMPORTED_MODULE_1__["b"]; });

/* harmony import */ var _offirmo_universal_debug_api_interface__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35);
/* harmony import */ var _offirmo_universal_debug_api_interface__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_offirmo_universal_debug_api_interface__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _offirmo_universal_debug_api_interface__WEBPACK_IMPORTED_MODULE_2__) if(["default","getLogger","exposeInternal","overrideHook","addDebugCommand","globalThis","createV1"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _offirmo_universal_debug_api_interface__WEBPACK_IMPORTED_MODULE_2__[key]; }) }(__WEBPACK_IMPORT_KEY__));


const globalThis = Object(_offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__[/* getGlobalThis */ "a"])(); // ensure the root is present

globalThis._debug = globalThis._debug || {};
const root = globalThis._debug; //////////// v1 ////////////
// TODO extract this common code!
// install globally if no better implementation already present

root.v1 = (existing => {
  // We CAN'T replace an existing one, even if we are more recent,
  // because the existing one may already have been called
  // and be having a state that can't be carried over.
  // HOWEVER some hints may help the user:
  const candidate = Object(_v1__WEBPACK_IMPORTED_MODULE_1__[/* default */ "b"])();
  let ownLogger = candidate.getLogger({
    name: _v1__WEBPACK_IMPORTED_MODULE_1__[/* OWN_LOGGER_NAME */ "a"]
  });
  ownLogger.log('as a candidate, attempting to attach…');

  if (!existing) {
    ownLogger.log('nominal install ✅');
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
    name: _v1__WEBPACK_IMPORTED_MODULE_1__[/* OWN_LOGGER_NAME */ "a"]
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
  getLogger,
  exposeInternal,
  overrideHook,
  addDebugCommand
} = instance;
 // types



/***/ }),

/***/ 77:
/***/ (function(module, exports) {



/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getRootSEC; });
/* harmony import */ var _offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(39);


 /////////////////////

const GLOBAL_VAR_NAME = '__global_root_sec';

function getRootSEC() {
  const global_this = Object(_offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__[/* getGlobalThis */ "a"])();

  if (!global_this[GLOBAL_VAR_NAME]) {
    console.log(`[${_consts__WEBPACK_IMPORTED_MODULE_1__[/* LIB */ "b"]}: Creating root SEC…]`); // XXX

    global_this[GLOBAL_VAR_NAME] = Object(_core__WEBPACK_IMPORTED_MODULE_2__[/* createSEC */ "b"])();
  }

  return global_this[GLOBAL_VAR_NAME];
} /////////////////////




/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fetch = __webpack_require__(149);

function wrapFetchForNode(fetch) {
  // Support schemaless URIs on the server for parity with the browser.
  // https://github.com/matthew-andrews/isomorphic-fetch/pull/10
  return function (u, options) {
    if (typeof u === 'string' && u.slice(0, 2) === '//') {
      return fetch('https:' + u, options);
    }

    return fetch(u, options);
  };
}

module.exports = function (context) {
  // Support webpack module import weirdness.
  var fetchFn = fetch.default ? fetch.default : fetch;

  // This modifies the global `node-fetch` object, which isn't great, since
  // different callers to `fetch-ponyfill` which pass a different Promise
  // implementation would each expect to have their implementation used. But,
  // given the way `node-fetch` is implemented, this is the only way to make
  // it work at all.
  if (context && context.Promise) {
    fetchFn.Promise = context.Promise;
  }

  return {
    fetch: wrapFetchForNode(fetchFn),
    Headers: fetch.Headers,
    Request: fetch.Request,
    Response: fetch.Response
  };
};


/***/ }),

/***/ 86:
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

/***/ 88:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeError; });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
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

/***/ 89:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createError; });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);

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

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const agent_1 = __importDefault(__webpack_require__(152));
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

/***/ 93:
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ 94:
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),

/***/ 95:
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
	createDebug.humanize = __webpack_require__(154);

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* Active `debug` instances.
	*/
	createDebug.instances = [];

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
					return match;
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
		debug.enabled = createDebug.enabled(namespace);
		debug.useColors = createDebug.useColors();
		debug.color = selectColor(namespace);
		debug.destroy = destroy;
		debug.extend = extend;
		// Debug.formatArgs = formatArgs;
		// debug.rawLog = rawLog;

		// env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		createDebug.instances.push(debug);

		return debug;
	}

	function destroy() {
		const index = createDebug.instances.indexOf(this);
		if (index !== -1) {
			createDebug.instances.splice(index, 1);
			return true;
		}
		return false;
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

		for (i = 0; i < createDebug.instances.length; i++) {
			const instance = createDebug.instances[i];
			instance.enabled = createDebug.enabled(instance.namespace);
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

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ })

/******/ })));
