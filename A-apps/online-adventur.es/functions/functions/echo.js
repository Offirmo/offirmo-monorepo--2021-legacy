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
/******/ 	return __webpack_require__(__webpack_require__.s = 556);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiStyles = __webpack_require__(79);
const {stdout: stdoutColor, stderr: stderrColor} = __webpack_require__(83);
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = __webpack_require__(85);

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
		template = __webpack_require__(86);
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

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return STRICT_STANDARD_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return QUASI_STANDARD_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return COMMON_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return COMMON_ERROR_FIELDS_EXTENDED; });
const STRICT_STANDARD_ERROR_FIELDS = new Set([// standard fields
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
'name', 'message']);
const QUASI_STANDARD_ERROR_FIELDS = new Set([// first inherit from previous
// conv to array needed due to a babel bug 😢
...Array.from(STRICT_STANDARD_ERROR_FIELDS), // quasi-standard: followed by all browsers + node
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
'stack']);
const COMMON_ERROR_FIELDS = new Set([// first inherit from previous
// conv to array needed due to a babel bug 😢
...Array.from(QUASI_STANDARD_ERROR_FIELDS), // standard in node only:
'code', // https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes
// non standard but widely used:
'statusCode', 'shouldRedirect', 'framesToPop' // see facebook https://github.com/facebook/flux/blob/2.0.2/src/invariant.js
]);
const COMMON_ERROR_FIELDS_EXTENDED = new Set([// first inherit from previous
// conv to array needed due to a babel bug 😢
...Array.from(COMMON_ERROR_FIELDS), // My (Offirmo) extensions:
'_temp', 'details' // hash to store any other property not defined in this set
// To evaluate if need arises:
// TODO triage field?
// TODO timestamp?
]);

/***/ }),

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_netlify_user_data = exports.DEV_MOCK_NETLIFY_USER = void 0;

const consts_1 = __webpack_require__(26);

const channel_1 = __webpack_require__(39); /////////////////////////////////////////////////


function _ensure_netlify_logged_in(context) {
  if (!context.clientContext) throw new Error('No/bad/outdated token [1]! (not logged in?)');
  if (!context.clientContext.user) throw new Error('No/bad/outdated token [2]! (not logged in?)');
}

exports.DEV_MOCK_NETLIFY_USER = {
  email: 'dev@online-adventur.es',
  sub: 'fake-netlify-id',
  app_metadata: {
    provider: 'test',
    roles: ['test', 'admin']
  },
  user_metadata: {
    avatar_url: undefined,
    full_name: 'Fake User For Dev'
  },
  exp: -1
};

function get_netlify_user_data(context) {
  try {
    _ensure_netlify_logged_in(context);
  } catch (err) {
    err.statusCode = consts_1.HTTP_STATUS_CODE.error.client.unauthorized;

    if (err.message.includes('No/bad/outdated token') && channel_1.CHANNEL === 'dev') {
      // pretend
      context.clientContext.user = exports.DEV_MOCK_NETLIFY_USER;
      context.clientContext.xxx = "WAS FAKED FOR DEV!";
    } else throw err;
  }

  const {
    email,
    sub: netlify_id,
    app_metadata: {
      provider,
      roles
    },
    user_metadata: {
      avatar_url,
      full_name
    }
  } = context.clientContext.user;
  return {
    netlify_id,
    email,
    provider,
    roles: roles || [],
    avatar_url,
    full_name
  };
}

exports.get_netlify_user_data = get_netlify_user_data;

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

/***/ 310:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILD_DATE = exports.NUMERIC_VERSION = exports.VERSION = void 0; // THIS FILE IS AUTO GENERATED!

exports.VERSION = '0.0.1';
exports.NUMERIC_VERSION = 0.0001; // for easy comparisons

exports.BUILD_DATE = '20210225_22h30';

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

const typescript_string_enums_1 = __webpack_require__(6);

const api_interface_1 = __webpack_require__(53); /////////////////////////////////////////////////


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

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "STRICT_STANDARD_ERROR_FIELDS", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "QUASI_STANDARD_ERROR_FIELDS", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS_EXTENDED", function() { return _fields__WEBPACK_IMPORTED_MODULE_0__["b"]; });

/* harmony import */ var _util_create__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createError", function() { return _util_create__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _util_normalize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizeError", function() { return _util_normalize__WEBPACK_IMPORTED_MODULE_2__["a"]; });






/***/ }),

/***/ 43:
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
/* eslint-disable no-mixed-operators */
const cssKeywords = __webpack_require__(81);

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

/***/ 52:
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
  expected_segment_count = 2 // default = fn + key

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

/***/ 53:
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
var dist = __webpack_require__(6);

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

/***/ 556:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

const tslib_1 = __webpack_require__(74);
/*
process.env.UDA_OVERRIDE__LOGGER__UDA_INTERNAL_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_UDA_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__LOGGER_OA_API_LOGLEVEL = '"silly"'
process.env.UDA_OVERRIDE__KNEX_DEBUG = 'true'
*/


__webpack_require__(62);

const api_interface_1 = __webpack_require__(53);

const netlify_1 = __webpack_require__(204);

const build = tslib_1.__importStar(__webpack_require__(310));

const utils_1 = __webpack_require__(52); ////////////////////////////////////


const handler = async (event, badly_typed_context) => {
  const context = badly_typed_context;
  let netlify_user_data;

  try {
    netlify_user_data = netlify_1.get_netlify_user_data(context);
  } catch (err) {
    netlify_user_data = {
      err: {
        message: err.message
      }
    };
  }

  const all_the_things = {
    badly_typed_context,
    event,
    derived: {
      get_key_from_path: (() => {
        try {
          return utils_1.get_key_from_path(event, {
            expected_segment_count: null
          });
        } catch (err) {
          return err.message;
        }
      })(),
      get_id_from_path: (() => {
        try {
          return utils_1.get_id_from_path(event, {
            expected_segment_count: null
          });
        } catch (err) {
          return err.message;
        }
      })()
    },
    netlify_user_data,
    build,
    // https://devdocs.io/node/process
    process: {
      //argv: process.argv,
      //execArgv: process.execArgv,
      //execPath: process.execPath,
      arch: process.arch,
      platform: process.platform,
      //config: process.config,
      //'cwd()': process.cwd(),
      //title: process.title,
      version: process.version,
      //release: process.release,
      versions: process.versions,
      env: _filter_out_secrets(process.env)
    }
  };
  console.log('will return:', all_the_things);
  const body = api_interface_1.create_server_response_body__data(all_the_things);
  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body, null, 2)
  };
};

exports.handler = handler;

function _filter_out_secrets(env) {
  return Object.entries(env).map(([k, v]) => {
    const isSecret = k.toLowerCase().includes('secret') || k.toLowerCase().includes('token');
    return [k, isSecret ? '🙈' : v];
  }).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});
}

/***/ }),

/***/ 56:
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ 6:
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

/***/ 62:
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
var fields = __webpack_require__(12);

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
const REVISION = 100.; ////////////////////////////////////

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
    suggestedLevel: 'fatal' // level adjustable, see below

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

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createError; });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);

function createError(message, attributes = {}, ctor = Error) {
  var _a;

  message = String(message || attributes.message || 'Unknown error!');

  if (!message.toLowerCase().includes('error')) {
    if ((_a = ctor.name) === null || _a === void 0 ? void 0 : _a.endsWith('Error')) message = ctor.name + ': ' + message;else message = 'Error: ' + message;
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

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeError; });
/* harmony import */ var _fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
 // Normalize any thrown object into a true, normal error.
// NOTE: will *always* recreate the error. TODO evaluate if possible to improve?
// Anything can be thrown: undefined, string, number...
// But that's obviously not a good practice.
// Even Error-like objects are sometime fancy!
// - seen: in browser, sometimes, an error-like, un-writable object is thrown
// - seen: frozen
// - seen: non-enumerable props
// So we want to ensure a true, safe, writable error object.

function normalizeError(err_like = {}) {
  var _a, _b; // Yes, we always re-create in case


  const p = Object.getPrototypeOf(err_like); // should we restrict to global standard constructors? TBD

  const constructor = ((_b = (_a = p === null || p === void 0 ? void 0 : p.constructor) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.endsWith('Error')) ? p.constructor : Error; // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible

  const true_err = new (Function.prototype.bind.call(constructor, null, err_like.message || `(non-error caught: "${err_like}")`))(); // properly attach fields if they exist

  _fields__WEBPACK_IMPORTED_MODULE_0__[/* COMMON_ERROR_FIELDS_EXTENDED */ "b"].forEach(prop => {
    if (err_like[prop]) true_err[prop] = err_like[prop];
  });
  return true_err;
}

/***/ }),

/***/ 74:
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArray", function() { return __spreadArray; });
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
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
}

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

/***/ 79:
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
		colorConvert = __webpack_require__(80);
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

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

const conversions = __webpack_require__(43);
const route = __webpack_require__(82);

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

/***/ 81:
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

/***/ 82:
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

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(20);
const tty = __webpack_require__(56);
const hasFlag = __webpack_require__(84);

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

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 85:
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

/***/ 86:
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


/***/ })

/******/ })));
