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
/******/ 	return __webpack_require__(__webpack_require__.s = 95);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const escapeStringRegexp = __webpack_require__(130);
const ansiStyles = __webpack_require__(131);
const stdoutColor = __webpack_require__(39).stdout;

const template = __webpack_require__(135);

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
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LIB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return LOG_LEVEL_TO_INTEGER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return LOG_LEVEL_TO_HUMAN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ALL_LOG_LEVELS; });
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
}; // rationalization to a clear, human understandable string

const LOG_LEVEL_TO_HUMAN = {
  fatal: 'fatal',
  emerg: 'emergency',
  alert: 'alert',
  crit: 'critical',
  error: 'error',
  warning: 'warn',
  warn: 'warn',
  notice: 'notice',
  info: 'info',
  verbose: 'verbose',
  log: 'log',
  debug: 'debug',
  trace: 'trace',
  silly: 'silly'
};
const ALL_LOG_LEVELS = Object.keys(LOG_LEVEL_TO_INTEGER).map(s => s).sort((a, b) => LOG_LEVEL_TO_INTEGER[a] - LOG_LEVEL_TO_INTEGER[b]);


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 6 */
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
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
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
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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


/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const LIB = 'soft-execution-context';
exports.LIB = LIB;
const INTERNAL_PROP = '_SEC';
exports.INTERNAL_PROP = INTERNAL_PROP;

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return COMMON_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return create; });
function create() {
  return new Set([// standard fields
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
  'name', 'message', // quasi-standard
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
  'stack', // standard in node
  'code', // https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes
  // non standard but widely used
  'statusCode', 'shouldRedirect', 'framesToPop', // My (Offirmo) extensions
  'details', 'SEC', '_temp']);
}

const DEFAULT_INSTANCE = create();
const COMMON_ERROR_FIELDS = DEFAULT_INSTANCE;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DEFAULT_LOG_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DEFAULT_LOGGER_KEY; });
// base to be directly importable from other modules
// without a full lib penalty
const DEFAULT_LOG_LEVEL = 'error';
const DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LEVEL_TO_ASCII; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LEVEL_TO_STYLIZE; });
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


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
  fatal: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(' ' + _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['fatal'])),
  emerg: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['emerg'])),
  alert: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(' ' + _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['alert'])),
  crit: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['crit'])),
  error: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['error'])),
  warning: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.yellow.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['warning'])),
  warn: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.yellow.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['warn'])),
  notice: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.blue(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['notice'])),
  info: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.blue(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['info'])),
  verbose: to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['verbose']),
  log: to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['log']),
  debug: to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['debug']),
  trace: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['trace'])),
  silly: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__[/* LOG_LEVEL_TO_HUMAN */ "c"]['silly']))
};
const LEVEL_TO_STYLIZE = {
  fatal: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(s),
  emerg: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(s),
  alert: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(s),
  crit: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(s),
  error: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(s),
  warning: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.yellow(s),
  warn: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.yellow(s),
  notice: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.blue(s),
  info: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.blue(s),
  verbose: s => s,
  log: s => s,
  debug: s => s,
  trace: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(s),
  silly: s => chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(s)
};

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS", function() { return _field_set__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "create", function() { return _field_set__WEBPACK_IMPORTED_MODULE_0__["b"]; });



/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 // Note: let's keep everything immutable

Object.defineProperty(exports, "__esModule", {
  value: true
}); /////////////////////

let instance_count = 0;

function create(parent_state) {
  return {
    sid: instance_count++,
    parent: parent_state || null,
    plugins: {},
    cache: {}
  };
}

exports.create = create;

function activate_plugin(state, PLUGIN
/*, args*/
) {
  const plugin_parent_state = state.parent ? state.parent.plugins[PLUGIN.id] : null;
  let plugin_state = PLUGIN.state.create(plugin_parent_state);
  return { ...state,
    plugins: { ...state.plugins,
      [PLUGIN.id]: { ...plugin_state,
        sid: state.sid
      }
    }
  };
}

exports.activate_plugin = activate_plugin;

function reduce_plugin(state, PLUGIN_ID, reducer) {
  const initial_plugin_state = state.plugins[PLUGIN_ID];
  const new_plugin_state = reducer(initial_plugin_state);
  if (new_plugin_state === initial_plugin_state) return state; // no change (immutability expected)

  return { ...state,
    plugins: { ...state.plugins,
      [PLUGIN_ID]: new_plugin_state
    }
  };
}

exports.reduce_plugin = reduce_plugin;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const consts_1 = __webpack_require__(12);

function flattenToOwn(object) {
  if (!object) return object;
  if (Array.isArray(object)) return object;
  if (typeof object !== 'object') return object;
  const res = Object.create(null);

  for (const property in object) {
    res[property] = object[property];
  }

  return res;
}

exports.flattenToOwn = flattenToOwn; // needed for various tree traversal algorithms

function _getSECStatePath(SEC) {
  if (!SEC[consts_1.INTERNAL_PROP].cache.statePath) {
    const path = [];
    let state = SEC[consts_1.INTERNAL_PROP];

    while (state) {
      path.unshift(state);
      state = state.parent;
    }

    SEC[consts_1.INTERNAL_PROP].cache.statePath = path;
  }

  return SEC[consts_1.INTERNAL_PROP].cache.statePath;
}

exports._getSECStatePath = _getSECStatePath; // for debug

function _flattenSEC(SEC) {
  const plugins = { ...SEC[consts_1.INTERNAL_PROP].plugins
  };
  plugins.analytics.details = flattenToOwn(plugins.analytics.details);
  plugins.dependency_injection.context = flattenToOwn(plugins.dependency_injection.context);
  plugins.error_handling.details = flattenToOwn(plugins.error_handling.details);
  plugins.logical_stack.stack = flattenToOwn(plugins.logical_stack.stack);
  return plugins;
}

exports._flattenSEC = _flattenSEC;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return checkLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return create; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var _normalize_args__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(33);


function checkLevel(level) {
  if (!_consts__WEBPACK_IMPORTED_MODULE_0__[/* ALL_LOG_LEVELS */ "a"].includes(level)) throw new Error(`[${_consts__WEBPACK_IMPORTED_MODULE_0__[/* LIB */ "b"]}] Not a valid log level: "${level}"!`);
}
function create({
  name = _consts__WEBPACK_IMPORTED_MODULE_1__[/* DEFAULT_LOGGER_KEY */ "a"],
  suggestedLevel = _consts__WEBPACK_IMPORTED_MODULE_1__[/* DEFAULT_LOG_LEVEL */ "b"],
  forcedLevel,
  commonDetails = {}
}, outputFn = console.log) {
  const internalState = {
    name,
    level: forcedLevel || suggestedLevel,
    commonDetails: { ...commonDetails
    },
    outputFn
  };
  let levelAsInt = 100; // so far

  const logger = _consts__WEBPACK_IMPORTED_MODULE_0__[/* ALL_LOG_LEVELS */ "a"].reduce((logger, level) => {
    const primitive = function (rawMessage, rawDetails) {
      if (!isLevelEnabled(level)) return;
      const [message, details] = Object(_normalize_args__WEBPACK_IMPORTED_MODULE_2__[/* normalizeArguments */ "b"])(arguments);
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
    levelAsInt = _consts__WEBPACK_IMPORTED_MODULE_0__[/* LOG_LEVEL_TO_INTEGER */ "d"][level];
  }

  setLevel(getLevel()); // to check it

  function isLevelEnabled(level) {
    checkLevel(level);
    return _consts__WEBPACK_IMPORTED_MODULE_0__[/* LOG_LEVEL_TO_INTEGER */ "d"][level] <= levelAsInt;
  }

  function getLevel() {
    return internalState.level;
  }

  function addCommonDetails(details) {
    if (details.err) throw new Error(`[${_consts__WEBPACK_IMPORTED_MODULE_0__[/* LIB */ "b"]}] Can't set reserved property "err"!`);
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
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 ////////////////////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
}); ////////////////////////////////////

const APP = 'functions';
exports.APP = APP; ////////////////////////////////////

const JSONRPC_CODE = {
  parse_error: -32700,
  // An error occurred on the server while parsing the JSON text.
  invalid_request: -32600,
  method_not_found: -32601,
  invalid_params: -32602,
  internal_error: -32603
};
exports.JSONRPC_CODE = JSONRPC_CODE;

function get_default_JsonRpc_error() {
  return {
    code: JSONRPC_CODE.internal_error,
    message: 'Internal error!',
    data: {}
  };
}

exports.get_default_JsonRpc_error = get_default_JsonRpc_error;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const common_error_fields_1 = __webpack_require__(21); // TODO extern


function create_error(message, data = {}) {
  const error = new Error(message);
  Object.keys(data).forEach(k => {
    if (common_error_fields_1.COMMON_ERROR_FIELDS.has(k) && k !== 'name' && k !== 'message' && k !== 'stack') {
      error[k] = data[k];
    } else {
      error.details = error.details || {};
      error.details[k] = data[k];
    }
  });
  error.framesToPop = error.framesToPop || 1;
  return error;
}

exports.create_error = create_error;

/***/ }),
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return looksLikeAnError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return normalizeArguments; });
function looksLikeAnError(x) {
  return !!(x.name && x.message && x.stack);
} // harmonize
// also try to recover from some common errors
// TODO assess whether it's really good to be that permissive (also: hurts perfs)

function normalizeArguments(args) {
  //console.log('>>> NA', Array.from(args))
  let message = '';
  let details = {};
  let err = undefined;

  if (args.length > 2) {
    //console.warn('NA 1', args)
    // wrong invocation,
    // most likely a "console.log" style invocation from an untyped codebase.
    // "best effort" fallback:
    message = Array.prototype.join.call(args, ' ');
    details = {};
  } else {
    //console.log('NA 2')
    message = args[0] || '';
    details = args[1] || {}; // optimization

    if (!message || typeof args[0] !== 'string' || typeof details !== 'object') {
      // non-nominal call
      //console.warn('NA 2.1')
      // try to fix message (attempt 1)
      if (typeof message !== 'string') {
        //console.warn('NA 2.1.1', { message, details })
        if (looksLikeAnError(message)) {
          //console.warn('NA 2.1.1.1')
          // Another bad invocation
          // "best effort" fallback:
          err = message;
          message = err.message;
        } else if (typeof message === 'object' && !args[1]) {
          // no message, direct details
          //console.warn('NA 2.1.1.2')
          details = message;
          message = '';
        } else {
          //console.warn('NA 2.1.1.3')
          message = String(message);
        }
      } // try to fix details


      if (typeof details !== 'object') {
        //console.warn('NA 2.1.2', { details })
        // Another bad invocation
        // "best effort" fallback:
        message = [message, String(details)].join(' ');
        details = {};
      } // ensure we picked up err


      err = err || details.err; // attempt to fix message (attempt 2, after uniformizing details)

      if (!message && details.message) {
        //console.warn('NA 2.1.3', { details })
        const {
          message: m2,
          ...d2
        } = details;
        message = m2;
        details = d2;
      }

      message = message || err && err.message || '(no message)';
    }

    if (!err && looksLikeAnError(details)) {
      //console.warn('NA 2.2', { details })
      // details is in fact an error, extract it
      err = details;
      details = {
        err
      };
    } else if (err) details = {
      err,
      ...details
    };else details = { ...details
    };
  }

  return [message, details];
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (string, count = 1, options) => {
	options = {
		indent: ' ',
		includeEmptyLines: false,
		...options
	};

	if (typeof string !== 'string') {
		throw new TypeError(
			`Expected \`input\` to be a \`string\`, got \`${typeof string}\``
		);
	}

	if (typeof count !== 'number') {
		throw new TypeError(
			`Expected \`count\` to be a \`number\`, got \`${typeof count}\``
		);
	}

	if (typeof options.indent !== 'string') {
		throw new TypeError(
			`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``
		);
	}

	if (count === 0) {
		return string;
	}

	const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;

	return string.replace(regex, options.indent.repeat(count));
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const consts_1 = __webpack_require__(12);

const TopState = tslib_1.__importStar(__webpack_require__(22));

const State = tslib_1.__importStar(__webpack_require__(105));

const utils_1 = __webpack_require__(23);

const PLUGIN_ID = 'dependency_injection';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN = {
  id: PLUGIN_ID,
  state: State,
  augment: prototype => {
    prototype.injectDependencies = function injectDependencies(deps) {
      let root_state = this[consts_1.INTERNAL_PROP];
      root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, state => {
        Object.entries(deps).forEach(([key, value]) => {
          state = State.injectDependencies(state, key, value);
        });
        return state;
      });
      this[consts_1.INTERNAL_PROP] = root_state;
      return this; // for chaining
    };

    prototype.getInjectedDependencies = function getInjectedDependencies() {
      const plugin_state = this[consts_1.INTERNAL_PROP].plugins[PLUGIN_ID];
      return utils_1.flattenToOwn(plugin_state.context);
    };
  }
};
exports.PLUGIN = PLUGIN;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.CHANNEL = process.env.CHANNEL || (() => {
  if (process.env.AWS_SECRET_ACCESS_KEY) return 'prod';
  return  false ? undefined : 'prod';
})();

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createLogger", function() { return _core__WEBPACK_IMPORTED_MODULE_0__["b"]; });

/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ALL_LOG_LEVELS", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL_TO_INTEGER", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL_TO_HUMAN", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["c"]; });

/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOG_LEVEL", function() { return _consts__WEBPACK_IMPORTED_MODULE_2__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOGGER_KEY", function() { return _consts__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "checkLevel", function() { return _core__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony import */ var _normalize_args__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(33);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "looksLikeAnError", function() { return _normalize_args__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizeArguments", function() { return _normalize_args__WEBPACK_IMPORTED_MODULE_3__["b"]; });







/***/ }),
/* 38 */
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
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(24);
const hasFlag = __webpack_require__(40);

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
/* 40 */
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
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/timestamps/dist/src.es2019/generate.js
/////////////////////
function get_UTC_timestamp_ms(now = new Date()) {
  return +now;
} /////////////////////


function get_human_readable_UTC_timestamp_days(now = new Date()) {
  const YYYY = now.getUTCFullYear();
  const MM = ('0' + (now.getUTCMonth() + 1)).slice(-2);
  const DD = ('0' + now.getUTCDate()).slice(-2);
  return `${YYYY}${MM}${DD}`;
}

function get_human_readable_UTC_timestamp_minutes(now = new Date()) {
  const hh = ('0' + now.getUTCHours()).slice(-2);
  const mm = ('0' + now.getUTCMinutes()).slice(-2);
  return get_human_readable_UTC_timestamp_days(now) + `_${hh}h${mm}`;
}

function get_human_readable_UTC_timestamp_seconds(now = new Date()) {
  const ss = ('0' + now.getUTCSeconds()).slice(-2);
  return get_human_readable_UTC_timestamp_minutes(now) + `+${ss}`;
}

function get_human_readable_UTC_timestamp_ms(now = new Date()) {
  const mmm = ('00' + now.getUTCMilliseconds()).slice(-3);
  return get_human_readable_UTC_timestamp_seconds(now) + `.${mmm}`;
} /////////////////////
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
// CONCATENATED MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/timestamps/dist/src.es2019/index.js
/* concated harmony reexport get_UTC_timestamp_ms */__webpack_require__.d(__webpack_exports__, "get_UTC_timestamp_ms", function() { return get_UTC_timestamp_ms; });
/* concated harmony reexport get_human_readable_UTC_timestamp_ms */__webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_ms", function() { return get_human_readable_UTC_timestamp_ms; });
/* concated harmony reexport get_human_readable_UTC_timestamp_seconds */__webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_seconds", function() { return get_human_readable_UTC_timestamp_seconds; });
/* concated harmony reexport get_human_readable_UTC_timestamp_minutes */__webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_minutes", function() { return get_human_readable_UTC_timestamp_minutes; });
/* concated harmony reexport get_human_readable_UTC_timestamp_days */__webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_days", function() { return get_human_readable_UTC_timestamp_days; });


/***/ }),
/* 51 */,
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

tslib_1.__exportStar(__webpack_require__(97), exports);

tslib_1.__exportStar(__webpack_require__(53), exports);

tslib_1.__exportStar(__webpack_require__(23), exports);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const consts_1 = __webpack_require__(12);

exports.LIB = consts_1.LIB;

const root_prototype_1 = __webpack_require__(99);

const State = tslib_1.__importStar(__webpack_require__(22));

const index_1 = __webpack_require__(101);

const common_1 = __webpack_require__(113);

root_prototype_1.ROOT_PROTOTYPE.createChild = function createChild(args) {
  return createSEC({ ...args,
    parent: this
  });
};

index_1.PLUGINS.forEach(PLUGIN => {
  PLUGIN.augment(root_prototype_1.ROOT_PROTOTYPE);
});

function isSEC(SEC) {
  return SEC && SEC[consts_1.INTERNAL_PROP];
}

exports.isSEC = isSEC;

function createSEC(args = {}) {
  /////// PARAMS ///////
  if (args.parent && !isSEC(args.parent)) throw new Error(`${consts_1.LIB}›createSEC() argument error: parent must be a valid SEC!`);
  let unhandled_args = Object.keys(args);
  let SEC = Object.create(root_prototype_1.ROOT_PROTOTYPE); /////// STATE ///////

  let parent_state = args.parent ? args.parent[consts_1.INTERNAL_PROP] : undefined;
  let state = State.create(parent_state);
  unhandled_args = unhandled_args.filter(arg => arg !== 'parent');
  index_1.PLUGINS.forEach(PLUGIN => {
    state = State.activate_plugin(state, PLUGIN);
  });
  SEC[consts_1.INTERNAL_PROP] = state; // auto injections

  if (!args.parent) {
    SEC.injectDependencies({
      logger: console
    });
    common_1.decorateWithDetectedEnv(SEC);
  }

  SEC.injectDependencies({
    SEC
  }); //console.log('createSEC', SEC, args.parent)
  // Here we could send an event on the SEC bus. No usage for now.
  // Her we could have lifecycle methods. No usage for now.

  if (unhandled_args.length) throw new Error(`${consts_1.LIB}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`); /////////////////////

  return SEC;
}

exports.createSEC = createSEC;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(133);

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
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ### Module dependencies
var colors = __webpack_require__(117);
var Utils = __webpack_require__(128);

exports.version = __webpack_require__(129).version;

// Helper function to detect if an object can be directly serializable
var isSerializable = function(input, onlyPrimitives, options) {
  if (
    typeof input === 'boolean' ||
    typeof input === 'number' ||
    typeof input === 'function' ||
    input === null ||
    input instanceof Date
  ) {
    return true;
  }
  if (typeof input === 'string' && input.indexOf('\n') === -1) {
    return true;
  }

  if (options.inlineArrays && !onlyPrimitives) {
    if (Array.isArray(input) && isSerializable(input[0], true, options)) {
      return true;
    }
  }

  return false;
};

var addColorToData = function(input, options) {
  if (options.noColor) {
    return input;
  }

  if (typeof input === 'string') {
    // Print strings in regular terminal color
    return options.stringColor ? colors[options.stringColor](input) : input;
  }

  var sInput = input + '';

  if (input === true) {
    return colors.green(sInput);
  }
  if (input === false) {
    return colors.red(sInput);
  }
  if (input === null) {
    return colors.grey(sInput);
  }
  if (typeof input === 'number') {
    return colors[options.numberColor](sInput);
  }
  if (typeof input === 'function') {
    return 'function() {}';
  }

  if (Array.isArray(input)) {
    return input.join(', ');
  }

  return sInput;
};

var indentLines = function(string, spaces){
  var lines = string.split('\n');
  lines = lines.map(function(line){
    return Utils.indent(spaces) + line;
  });
  return lines.join('\n');
};

var renderToArray = function(data, options, indentation) {
  if (isSerializable(data, false, options)) {
    return [Utils.indent(indentation) + addColorToData(data, options)];
  }

  // Unserializable string means it's multiline
  if (typeof data === 'string') {
    return [
      Utils.indent(indentation) + '"""',
      indentLines(data, indentation + options.defaultIndentation),
      Utils.indent(indentation) + '"""'
    ];
  }


  if (Array.isArray(data)) {
    // If the array is empty, render the `emptyArrayMsg`
    if (data.length === 0) {
      return [Utils.indent(indentation) + options.emptyArrayMsg];
    }

    var outputArray = [];

    data.forEach(function(element) {
      // Prepend the dash at the begining of each array's element line
      var line = '- ';
      if (!options.noColor) {
        line = colors[options.dashColor](line);
      }
      line = Utils.indent(indentation) + line;

      // If the element of the array is a string, bool, number, or null
      // render it in the same line
      if (isSerializable(element, false, options)) {
        line += renderToArray(element, options, 0)[0];
        outputArray.push(line);

      // If the element is an array or object, render it in next line
      } else {
        outputArray.push(line);
        outputArray.push.apply(
          outputArray,
          renderToArray(
            element, options, indentation + options.defaultIndentation
          )
        );
      }
    });

    return outputArray;
  }

  if (data instanceof Error) {
    return renderToArray(
      {
        message: data.message,
        stack: data.stack.split('\n')
      },
      options,
      indentation
    );
  }

  // If values alignment is enabled, get the size of the longest index
  // to align all the values
  var maxIndexLength = options.noAlign ? 0 : Utils.getMaxIndexLength(data);
  var key;
  var output = [];

  Object.getOwnPropertyNames(data).forEach(function(i) {
    // Prepend the index at the beginning of the line
    key = (i + ': ');
    if (!options.noColor) {
      key = colors[options.keysColor](key);
    }
    key = Utils.indent(indentation) + key;

    // Skip `undefined`, it's not a valid JSON value.
    if (data[i] === undefined) {
      return;
    }

    // If the value is serializable, render it in the same line
    if (isSerializable(data[i], false, options)) {
      var nextIndentation = options.noAlign ? 0 : maxIndexLength - i.length;
      key += renderToArray(data[i], options, nextIndentation)[0];
      output.push(key);

      // If the index is an array or object, render it in next line
    } else {
      output.push(key);
      output.push.apply(
        output,
        renderToArray(
          data[i],
          options,
          indentation + options.defaultIndentation
        )
      );
    }
  });
  return output;
};

// ### Render function
// *Parameters:*
//
// * **`data`**: Data to render
// * **`options`**: Hash with different options to configure the parser
// * **`indentation`**: Base indentation of the parsed output
//
// *Example of options hash:*
//
//     {
//       emptyArrayMsg: '(empty)', // Rendered message on empty strings
//       keysColor: 'blue',        // Color for keys in hashes
//       dashColor: 'red',         // Color for the dashes in arrays
//       stringColor: 'grey',      // Color for strings
//       defaultIndentation: 2     // Indentation on nested objects
//     }
exports.render = function render(data, options, indentation) {
  // Default values
  indentation = indentation || 0;
  options = options || {};
  options.emptyArrayMsg = options.emptyArrayMsg || '(empty array)';
  options.keysColor = options.keysColor || 'green';
  options.dashColor = options.dashColor || 'green';
  options.numberColor = options.numberColor || 'blue';
  options.defaultIndentation = options.defaultIndentation || 2;
  options.noColor = !!options.noColor;
  options.noAlign = !!options.noAlign;

  options.stringColor = options.stringColor || null;

  return renderToArray(data, options, indentation).join('\n');
};

// ### Render from string function
// *Parameters:*
//
// * **`data`**: Data to render as a string
// * **`options`**: Hash with different options to configure the parser
// * **`indentation`**: Base indentation of the parsed output
//
// *Example of options hash:*
//
//     {
//       emptyArrayMsg: '(empty)', // Rendered message on empty strings
//       keysColor: 'blue',        // Color for keys in hashes
//       dashColor: 'red',         // Color for the dashes in arrays
//       defaultIndentation: 2     // Indentation on nested objects
//     }
exports.renderString = function renderString(data, options, indentation) {

  var output = '';
  var parsedData;
  // If the input is not a string or if it's empty, just return an empty string
  if (typeof data !== 'string' || data === '') {
    return '';
  }

  // Remove non-JSON characters from the beginning string
  if (data[0] !== '{' && data[0] !== '[') {
    var beginingOfJson;
    if (data.indexOf('{') === -1) {
      beginingOfJson = data.indexOf('[');
    } else if (data.indexOf('[') === -1) {
      beginingOfJson = data.indexOf('{');
    } else if (data.indexOf('{') < data.indexOf('[')) {
      beginingOfJson = data.indexOf('{');
    } else {
      beginingOfJson = data.indexOf('[');
    }
    output += data.substr(0, beginingOfJson) + '\n';
    data = data.substr(beginingOfJson);
  }

  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    // Return an error in case of an invalid JSON
    return colors.red('Error:') + ' Not valid JSON!';
  }

  // Call the real render() method
  output += exports.render(parsedData, options, indentation);
  return output;
};


/***/ }),
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const sec_1 = __webpack_require__(96);

const utils_1 = __webpack_require__(27);

const channel_1 = __webpack_require__(36);

function err_to_response(err) {
  const statusCode = err.statusCode || 500;
  const res = err.res || `[Error] ${err.message || 'Unknown error!'}`;
  return {
    statusCode,
    body: JSON.stringify(res)
  };
}

async function _handler(SEC, event, context) {
  try {
    throw new Error('TEST caught!');
  } catch (err) {} // ignore
  //return { statusCode: 200, body: 'nominal.' }
  //throw new Error('Test sync!')
  //throw create_error('TEST sync!', { statusCode: 555 })
  //new Promise(() => { throw create_error('TEST in uncaught promise!', { statusCode: 555 }) })


  return new Promise(resolve => {
    setTimeout(() => {
      throw utils_1.create_error('TEST in uncaught async!', {
        statusCode: 555
      });
    }, 100);
  });
}

const handler = (event, badly_typed_context) => {
  return new Promise((resolve, reject) => {
    const context = badly_typed_context; ///////////////////// Setup /////////////////////

    sec_1.SEC.xTry('SEC-MW-1', ({
      SEC,
      logger
    }) => {
      logger.trace('Starting handling…', {
        path: event.path
      });
      let timeout_id = null;

      async function on_error({
        SEC,
        err
      }) {
        //console.error('on SEC final-error in MW', err.message)
        logger.error('Final error!', err);

        if (channel_1.CHANNEL === 'dev') {
          logger.fatal('↑ error! (no report since dev)');
        } else {
          logger.fatal('↑ this error will be reported');
          /*try {
              await on_error(err)
          }
          catch(err) {
              console.error('XXX huge error in the error handler itself! XXX')
          }*/
        }

        resolve(err_to_response(err));

        if (timeout_id) {
          clearTimeout(timeout_id);
          timeout_id = null;
        }
      }

      logger.trace('Listening to errors…');
      SEC.emitter.once('final-error').then(on_error); //context.callbackWaitsForEmptyEventLoop = false

      const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10000;
      logger.trace('Setting timeout...', {
        remaining_time_ms
      });
      timeout_id = setTimeout(() => {
        const err = new Error('Timeout handling this request!');
        logger.fatal('timeout', {
          err,
          remaining_time_ms
        });
        timeout_id = null;
        throw err;
      }, Math.max(remaining_time_ms - 500, 0)); ///////////////////// invoke /////////////////////

      SEC.xPromiseTryCatch('SEC-MW-2', ({
        SEC,
        logger
      }) => {
        return SEC.xPromiseTry('SEC-MW-handler', () => {
          logger.trace('Invoking_');
          return _handler(SEC, event, context);
        }).then(response => {
          logger.trace('FYI _handler resolved with:', {
            status: response.statusCode
          });
          return response;
        }).catch(err => {
          logger.error('FYI _handler rejected! with:', err);
          throw err;
        }).then(response => {
          if (!response || !response.statusCode || !response.body) throw new Error('Incorrect response returned by the handler!!');
          logger.info('FYI resolving with:', {
            status: response.statusCode
          });
          resolve(response);

          if (timeout_id) {
            clearTimeout(timeout_id);
            timeout_id = null;
          }

          SEC.emitter.off('final-error', on_error);
        });
      }).then(response => {
        logger.trace('FYI MW resolved', response);
        return response;
      }).catch(err => {
        logger.error('FYI MW rejected! with:', err);
        throw err;
      });
    });
  }).then(response => {
    console.error('FYI Overall promise resolved with:', response);
    return response;
  }).catch(err => {
    console.error('FYI Overall promise rejected with:', err);
    throw err;
  });
};

exports.handler = handler;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const soft_execution_context_1 = __webpack_require__(52);

const soft_execution_context_node_1 = __webpack_require__(114);

const consts_1 = __webpack_require__(26);

const channel_1 = __webpack_require__(36);

const logger_1 = tslib_1.__importDefault(__webpack_require__(115)); /////////////////////


const SEC = soft_execution_context_1.getRootSEC().setLogicalStack({
  module: consts_1.APP
}).injectDependencies({
  logger: logger_1.default
});
exports.SEC = SEC;
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
}); // inspect AWS setup

console.log('uncaughtException Listeners:', process.listenerCount('uncaughtException'));
console.log('unhandledRejection Listeners:', process.listenerCount('unhandledRejection'));
process.listeners('uncaughtException').forEach(l => process.off('uncaughtException', l));
process.listeners('unhandledRejection').forEach(l => process.off('unhandledRejection', l));
soft_execution_context_node_1.listenToUncaughtErrors();
soft_execution_context_node_1.listenToUnhandledRejections();
SEC.xTry('SEC/init', ({
  logger
}) => {
  logger.trace('Soft Execution Context initialized.');
});
const {
  ENV
} = SEC.getInjectedDependencies();

if (ENV !== "production") {
  logger_1.default.error('ENV detection mismatch!', {
    'SEC.ENV': ENV,
    'process.env.NODE_ENV': "production"
  });
} /////////////////////////////////////////////////


exports.default = SEC;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const globalthis_ponyfill_1 = __webpack_require__(98);

const consts_1 = __webpack_require__(12);

const core_1 = __webpack_require__(53); /////////////////////


const GLOBAL_VAR_NAME = '__global_root_sec';

function getRootSEC() {
  const global_this = globalthis_ponyfill_1.getGlobalThis();

  if (!global_this[GLOBAL_VAR_NAME]) {
    console.log(`[${consts_1.LIB}: Creating root SEC…]`); // XXX

    global_this[GLOBAL_VAR_NAME] = core_1.createSEC();
  }

  return global_this[GLOBAL_VAR_NAME];
}

exports.getRootSEC = getRootSEC;

/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGlobalThis", function() { return getGlobalThis; });
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
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const emittery_1 = tslib_1.__importDefault(__webpack_require__(100)); /////////////////////


const ROOT_PROTOTYPE = Object.create(null);
exports.ROOT_PROTOTYPE = ROOT_PROTOTYPE; // global bus shared by all SECs

ROOT_PROTOTYPE.emitter = new emittery_1.default(); // common functions
// because we often set the same details

ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
  const SEC = this;
  return SEC.setAnalyticsDetails(details).setErrorReportDetails(details);
};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const anyMap = new WeakMap();
const eventsMap = new WeakMap();
const producersMap = new WeakMap();
const anyProducer = Symbol('anyProducer');
const resolvedPromise = Promise.resolve();

function assertEventName(eventName) {
	if (typeof eventName !== 'string') {
		throw new TypeError('eventName must be a string');
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
	const key = typeof eventName === 'string' ? eventName : anyProducer;
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

function iterator(instance, eventName) {
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

	getEventProducers(instance, eventName).add(producer);

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
			getEventProducers(instance, eventName).delete(producer);
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

	on(eventName, listener) {
		assertEventName(eventName);
		assertListener(listener);
		getListeners(this, eventName).add(listener);
		return this.off.bind(this, eventName, listener);
	}

	off(eventName, listener) {
		assertEventName(eventName);
		assertListener(listener);
		getListeners(this, eventName).delete(listener);
	}

	once(eventName) {
		return new Promise(resolve => {
			assertEventName(eventName);
			const off = this.on(eventName, data => {
				off();
				resolve(data);
			});
		});
	}

	events(eventName) {
		assertEventName(eventName);
		return iterator(this, eventName);
	}

	async emit(eventName, eventData) {
		assertEventName(eventName);

		enqueueProducers(this, eventName, eventData);

		const listeners = getListeners(this, eventName);
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = [...anyListeners];

		await resolvedPromise;
		return Promise.all([
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
		return this.offAny.bind(this, listener);
	}

	anyEvent() {
		return iterator(this);
	}

	offAny(listener) {
		assertListener(listener);
		anyMap.get(this).delete(listener);
	}

	clearListeners(eventName) {
		if (typeof eventName === 'string') {
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

	listenerCount(eventName) {
		if (typeof eventName === 'string') {
			return anyMap.get(this).size + getListeners(this, eventName).size +
				getEventProducers(this, eventName).size + getEventProducers(this).size;
		}

		if (typeof eventName !== 'undefined') {
			assertEventName(eventName);
		}

		let count = anyMap.get(this).size;

		for (const value of eventsMap.get(this).values()) {
			count += value.size;
		}

		for (const value of producersMap.get(this).values()) {
			count += value.size;
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

module.exports = Emittery;


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const index_1 = __webpack_require__(102);

const index_2 = __webpack_require__(35);

const index_3 = __webpack_require__(106);

const index_4 = __webpack_require__(111);

const PLUGINS_BY_ID = {
  [index_4.PLUGIN]: index_4.PLUGIN,
  [index_1.PLUGIN.id]: index_1.PLUGIN,
  [index_2.PLUGIN.id]: index_2.PLUGIN,
  [index_3.PLUGIN.id]: index_3.PLUGIN
};
exports.PLUGINS_BY_ID = PLUGINS_BY_ID;
const PLUGINS = Object.values(PLUGINS_BY_ID);
exports.PLUGINS = PLUGINS;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const consts_1 = __webpack_require__(12);

const TopState = tslib_1.__importStar(__webpack_require__(22));

const consts_2 = __webpack_require__(103);

const State = tslib_1.__importStar(__webpack_require__(104));

const utils_1 = __webpack_require__(23);

const PLUGIN_ID = 'logical_stack';
const BRANCH_JUMP_PSEUDO_STATE = {
  sid: -1,
  plugins: {
    [PLUGIN_ID]: {
      stack: {
        // NO module
        operation: consts_2.LOGICAL_STACK_SEPARATOR_NON_ADJACENT
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
      res = res + (res.length ? consts_2.LOGICAL_STACK_SEPARATOR : '') + module;
      current_module = module;
    }

    if (operation) res = res + consts_2.LOGICAL_STACK_SEPARATOR + operation + consts_2.LOGICAL_STACK_OPERATION_MARKER;
    return res;
  }, '') + consts_2.LOGICAL_STACK_END_MARKER;
}

const PLUGIN = {
  id: PLUGIN_ID,
  state: State,
  augment: prototype => {
    prototype.setLogicalStack = function setLogicalStack({
      module,
      operation
    }) {
      const SEC = this;
      let root_state = SEC[consts_1.INTERNAL_PROP];
      root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, state => {
        if (module) state = State.set_module(state, module);
        if (operation) state = State.set_operation(state, operation);
        return state;
      });
      SEC[consts_1.INTERNAL_PROP] = root_state;
      return SEC;
    };

    prototype.getLogicalStack = function getLogicalStack() {
      const SEC = this;
      return _reduceStatePathToLogicalStack(utils_1._getSECStatePath(SEC));
    };

    prototype.getShortLogicalStack = function get_stack_end() {
      const {
        stack
      } = this[consts_1.INTERNAL_PROP].plugins[PLUGIN_ID];
      return consts_2.LOGICAL_STACK_BEGIN_MARKER + stack.module + consts_2.LOGICAL_STACK_SEPARATOR + stack.operation + consts_2.LOGICAL_STACK_OPERATION_MARKER + consts_2.LOGICAL_STACK_END_MARKER;
    };

    prototype._decorateErrorWithLogicalStack = function _decorateErrorWithLogicalStack(err) {
      const SEC = this;
      err._temp = err._temp || {};
      const logicalStack = {
        full: SEC.getLogicalStack()
      };
      const details = {};

      if (err._temp.SEC) {
        // OK this error is already decorated.
        // Thus the message is also already decorated, don't touch it.
        // BUT we may be able to add more info, can we?
        if (err.details.logicalStack.includes(logicalStack.full)) {// ok, logical stack already chained, nothing to add
        } else {
          // SEC chain has branched, reconcile paths
          // OK maybe overkill...
          const other_path = err._temp.statePath;

          const current_path = utils_1._getSECStatePath(SEC); // find common path


          let last_common_index = 0;

          for (let i = 1; i < current_path.length; ++i) {
            if (other_path[i] !== current_path[i]) break;
            last_common_index = i;
          } // reconcile the 2 stack traces


          let improvedStatePath = [].concat(current_path);
          improvedStatePath.push(BRANCH_JUMP_PSEUDO_STATE);
          improvedStatePath = improvedStatePath.concat(other_path.slice(last_common_index + 1));
          err._temp.statePath = improvedStatePath;
          details.logicalStack = _reduceStatePathToLogicalStack(improvedStatePath);
        }
      } else {
        err._temp.SEC = SEC;
        err._temp.statePath = utils_1._getSECStatePath(SEC);
        logicalStack.short = SEC.getShortLogicalStack();

        if (err.message.startsWith(logicalStack.short)) {
          // can that happen??? It's a bug!

          /* eslint-disable no-console */
          console.warn('UNEXPECTED SEC non-decorated error already prefixed??');
          /* eslint-enable no-console */
        } else {
          err.message = logicalStack.short + ': ' + err.message;
        }

        details.logicalStack = logicalStack.full;
      }

      err.details = { ...(err.details || {}),
        ...details
      };
      return err;
    };
  }
};
exports.PLUGIN = PLUGIN;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const LOGICAL_STACK_BEGIN_MARKER = '';
exports.LOGICAL_STACK_BEGIN_MARKER = LOGICAL_STACK_BEGIN_MARKER;
const LOGICAL_STACK_END_MARKER = '';
exports.LOGICAL_STACK_END_MARKER = LOGICAL_STACK_END_MARKER;
const LOGICAL_STACK_SEPARATOR = '›';
exports.LOGICAL_STACK_SEPARATOR = LOGICAL_STACK_SEPARATOR; // '⋅' '↘' ':' '•' '›'

const LOGICAL_STACK_MODULE_MARKER = '';
exports.LOGICAL_STACK_MODULE_MARKER = LOGICAL_STACK_MODULE_MARKER;
const LOGICAL_STACK_OPERATION_MARKER = '';
exports.LOGICAL_STACK_OPERATION_MARKER = LOGICAL_STACK_OPERATION_MARKER; // '…'

const LOGICAL_STACK_SEPARATOR_NON_ADJACENT = '…';
exports.LOGICAL_STACK_SEPARATOR_NON_ADJACENT = LOGICAL_STACK_SEPARATOR_NON_ADJACENT;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});

function create(parent_state) {
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

exports.create = create;

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

exports.set_module = set_module;

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

exports.set_operation = set_operation;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function create(parent_state) {
  const context = parent_state ? Object.create(parent_state.context) : Object.create(null); // NO auto-injections here, let's keep it simple. See core.

  return {
    context
  };
}

exports.create = create;

function injectDependencies(state, key, value) {
  const {
    context
  } = state;
  context[key] = value;
  return { ...state,
    context
  };
}

exports.injectDependencies = injectDependencies;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const normalize_error_1 = tslib_1.__importDefault(__webpack_require__(107));

const promise_try_1 = __webpack_require__(108);

const timestamps_1 = __webpack_require__(50);

const consts_1 = __webpack_require__(12);

const utils_1 = __webpack_require__(23);

const State = tslib_1.__importStar(__webpack_require__(109));

const catch_factory_1 = __webpack_require__(110);

const index_1 = __webpack_require__(35);

const TopState = tslib_1.__importStar(__webpack_require__(22));

const PLUGIN_ID = 'error_handling';

function cleanTemp(err) {
  delete err._temp;
  return err;
}

const PLUGIN = {
  id: PLUGIN_ID,
  state: State,
  augment: prototype => {
    prototype._handleError = function handleError({
      SEC,
      debugId = '?',
      shouldRethrow = true
    }, err) {
      catch_factory_1.createCatcher({
        debugId,
        decorators: [normalize_error_1.default, err => SEC._decorateErrorWithLogicalStack(err), err => SEC._decorateErrorWithDetails(err)],
        onError: shouldRethrow ? null : err => SEC.emitter.emit('final-error', {
          SEC,
          err: cleanTemp(err)
        })
      })(err);
    };

    prototype.throwNewError = function throwNewError(message, details) {
      const SEC = this;
      const err = new Error(message);
      err.details = details;

      SEC._handleError({
        SEC,
        shouldRethrow: true
      });
    };

    prototype._decorateErrorWithDetails = function _decorateErrorWithDetails(err) {
      const SEC = this;
      const state = SEC[consts_1.INTERNAL_PROP];
      const now = timestamps_1.get_UTC_timestamp_ms();
      const autoDetails = {
        ENV: state.plugins[index_1.PLUGIN_ID].context.ENV,
        TIME: now,
        SESSION_DURATION_MS: now - state.plugins[index_1.PLUGIN_ID].context.SESSION_START_TIME
      };
      const userDetails = utils_1.flattenToOwn(state.plugins[PLUGIN_ID].details);
      err.details = { ...autoDetails,
        ...userDetails,
        ...(err.details || {})
      };
      return err;
    };

    prototype.setErrorReportDetails = function setErrorReportDetails(details) {
      const SEC = this;
      let root_state = SEC[consts_1.INTERNAL_PROP];
      root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = State.addDetail(plugin_state, key, value);
        });
        return plugin_state;
      });
      this[consts_1.INTERNAL_PROP] = root_state;
      return SEC; // for chaining
    };

    prototype.xTry = function xTry(operation, fn) {
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[consts_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;

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
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[consts_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;

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

    prototype.xPromiseCatch = function xPromiseCatch(operation, promise) {
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      return promise.catch(err => {
        SEC._handleError({
          SEC,
          debugId: 'xPromiseCatch',
          shouldRethrow: false
        }, err);
      });
    };

    prototype.xPromiseTry = function xPromiseTry(operation, fn) {
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[consts_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;
      return promise_try_1.promiseTry(() => fn(params)).catch(err => {
        SEC._handleError({
          SEC,
          debugId: 'xPromiseTry',
          shouldRethrow: true
        }, err);
      });
    };

    prototype.xPromiseTryCatch = function xPromiseTryCatch(operation, fn) {
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[consts_1.INTERNAL_PROP].plugins[index_1.PLUGIN_ID].context;
      return promise_try_1.promiseTry(() => fn(params)).catch(err => {
        SEC._handleError({
          SEC,
          debugId: 'xPromiseTryCatch',
          shouldRethrow: false
        }, err);
      });
    };
  }
};
exports.PLUGIN = PLUGIN;

/***/ }),
/* 107 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _offirmo_private_common_error_fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
 // Anything can be thrown: undefined, string, number...)
// But that's obviously not a good practice.
// Normalize any thrown object into a true, normal error.

function normalizeError(err_like = {}) {
  // Fact: in browser, sometimes, an error-like, un-writable object is thrown
  // create a true, safe, writable error object
  const true_err = new Error(err_like.message || `(non-error caught: "${err_like}")`); // copy fields if they exist

  _offirmo_private_common_error_fields__WEBPACK_IMPORTED_MODULE_0__[/* COMMON_ERROR_FIELDS */ "a"].forEach(prop => {
    //if (prop in err_like)
    if (err_like[prop]) true_err[prop] = err_like[prop];
  });
  return true_err;
}

/* harmony default export */ __webpack_exports__["default"] = (normalizeError);

/***/ }),
/* 108 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "promiseTry", function() { return promiseTry; });
// http://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry(fn) {
  return Promise.resolve().then(fn);
}



/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});

function create(parent_state) {
  const details = parent_state ? Object.create(parent_state.details) : Object.create(null); // NO auto-details here, let's keep it simple + usually shared with analytics. See core or platform specific code.

  return {
    details
  };
}

exports.create = create;

function addDetail(state, key, value) {
  const {
    details
  } = state;
  details[key] = value;
  return { ...state,
    details
  };
}

exports.addDetail = addDetail;

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

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

exports.createCatcher = createCatcher;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(6);

const timestamps_1 = __webpack_require__(50);

const consts_1 = __webpack_require__(12);

const TopState = tslib_1.__importStar(__webpack_require__(22));

const utils_1 = __webpack_require__(23);

const State = tslib_1.__importStar(__webpack_require__(112));

const dependency_injection_1 = __webpack_require__(35);

const PLUGIN_ID = 'analytics';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN = {
  id: PLUGIN_ID,
  state: State,
  augment: prototype => {
    prototype.setAnalyticsDetails = function setAnalyticsDetails(details) {
      const SEC = this;
      let root_state = SEC[consts_1.INTERNAL_PROP];
      root_state = TopState.reduce_plugin(root_state, PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = State.addDetail(plugin_state, key, value);
        });
        return plugin_state;
      });
      this[consts_1.INTERNAL_PROP] = root_state;
      return SEC; // for chaining
    };

    prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId, details = {}) {
      const SEC = this;
      const now = timestamps_1.get_UTC_timestamp_ms();
      let root_state = SEC[consts_1.INTERNAL_PROP];
      if (!eventId) throw new Error('Incorrect eventId!');
      const {
        ENV
      } = SEC.getInjectedDependencies();
      const autoDetails = {
        ENV,
        TIME: now,
        SESSION_DURATION_MS: now - root_state.plugins[dependency_injection_1.PLUGIN_ID].context.SESSION_START_TIME
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
      const plugin_state = SEC[consts_1.INTERNAL_PROP].plugins[PLUGIN_ID];
      return utils_1.flattenToOwn(plugin_state.details);
    };
  }
};
exports.PLUGIN = PLUGIN;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function create(parent_state) {
  const details = parent_state ? Object.create(parent_state.details) : Object.create(null); // NO auto-details here, let's keep it simple. See core or platform specific code.

  return {
    details
  };
}

exports.create = create;

function addDetail(state, key, value) {
  const {
    details
  } = state;
  details[key] = value;
  return { ...state,
    details
  };
}

exports.addDetail = addDetail;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global NODE_ENV process */

const timestamps_1 = __webpack_require__(50);

function decorateWithDetectedEnv(SEC) {
  let ENV = (() => {
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
  const CHANNEL = 'unknown';
  const SESSION_START_TIME = timestamps_1.get_UTC_timestamp_ms();
  SEC.injectDependencies({
    ENV,
    'NODE_ENV': ENV,
    IS_DEV_MODE,
    IS_VERBOSE,
    CHANNEL,
    SESSION_START_TIME
  });
  SEC.setAnalyticsAndErrorDetails({
    ENV,
    CHANNEL
  });
}

exports.decorateWithDetectedEnv = decorateWithDetectedEnv;

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

const os = __webpack_require__(24);

const {
  getRootSEC
} = __webpack_require__(52); // TODO protect from double install


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
}

module.exports = {
  listenToUncaughtErrors,
  listenToUnhandledRejections,
  decorateWithDetectedEnv
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const practical_logger_core_1 = __webpack_require__(37);

const practical_logger_node_1 = __webpack_require__(116);

const consts_1 = __webpack_require__(26);

const channel_1 = __webpack_require__(36); /////////////////////////////////////////////////


const logger = (channel_1.CHANNEL === 'dev' ? practical_logger_node_1.createLogger : practical_logger_core_1.createLogger)({
  name: consts_1.APP,
  suggestedLevel: 'silly'
});
logger.notice(`Hello from "${consts_1.APP}", Logger up with level = ${logger.getLevel()}.`);
exports.default = logger;

/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLogger", function() { return createLogger; });
/* harmony import */ var _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


const sink = (() => {
  try {
    // this version is for the author's own usage
    // as it uses unpublished modules.
    return __webpack_require__(243).default;
  } catch {
    return __webpack_require__(136).default;
  }
})();

const ORIGINAL_CONSOLE = console;

function createLogger(p) {
  return { ...Object(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__[/* create */ "b"])(p, sink),

    group(groupTitle) {
      ORIGINAL_CONSOLE.group(groupTitle);
    },

    groupCollapsed(groupTitle) {
      ORIGINAL_CONSOLE.groupCollapsed(groupTitle);
    },

    groupEnd() {
      ORIGINAL_CONSOLE.groupEnd();
    }

  };
}



/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

//
// Remark: Requiring this file will use the "safe" colors API,
// which will not touch String.prototype.
//
//   var colors = require('colors/safe');
//   colors.red("foo")
//
//
var colors = __webpack_require__(118);
module['exports'] = colors;


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var util = __webpack_require__(5);
var ansiStyles = colors.styles = __webpack_require__(119);
var defineProps = Object.defineProperties;
var newLineRegex = new RegExp(/[\r\n]+/g);

colors.supportsColor = __webpack_require__(120).supportsColor;

if (typeof colors.enabled === 'undefined') {
  colors.enabled = colors.supportsColor() !== false;
}

colors.enable = function() {
  colors.enabled = true;
};

colors.disable = function() {
  colors.enabled = false;
};

colors.stripColors = colors.strip = function(str) {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
};

// eslint-disable-next-line no-unused-vars
var stylize = colors.stylize = function stylize(str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  var styleMap = ansiStyles[style];

  // Stylize should work for non-ANSI styles, too
  if(!styleMap && style in colors){
    // Style maps like trap operate as functions on strings;
    // they don't have properties like open or close.
    return colors[style](str);
  }

  return styleMap.open + str + styleMap.close;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe, '\\$&');
};

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function() {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function(key) {
    ansiStyles[key].closeRe =
      new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function() {
        return build(this._styles.concat(key));
      },
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = Array.prototype.slice.call(arguments);

  var str = args.map(function(arg) {
    // Use weak equality check so we can colorize null/undefined in safe mode
    if (arg != null && arg.constructor === String) {
      return arg;
    } else {
      return util.inspect(arg);
    }
  }).join(' ');

  if (!colors.enabled || !str) {
    return str;
  }

  var newLinesPresent = str.indexOf('\n') != -1;

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
    if (newLinesPresent) {
      str = str.replace(newLineRegex, function(match) {
        return code.close + match + code.open;
      });
    }
  }

  return str;
}

colors.setTheme = function(theme) {
  if (typeof theme === 'string') {
    console.log('colors.setTheme now only accepts an object, not a string.  ' +
      'If you are trying to set a theme from a file, it is now your (the ' +
      'caller\'s) responsibility to require the file.  The old syntax ' +
      'looked like colors.setTheme(__dirname + ' +
      '\'/../themes/generic-logging.js\'); The new syntax looks like '+
      'colors.setTheme(require(__dirname + ' +
      '\'/../themes/generic-logging.js\'));');
    return;
  }
  for (var style in theme) {
    (function(style) {
      colors[style] = function(str) {
        if (typeof theme[style] === 'object') {
          var out = str;
          for (var i in theme[style]) {
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function(name) {
    ret[name] = {
      get: function() {
        return build([name]);
      },
    };
  });
  return ret;
}

var sequencer = function sequencer(map, str) {
  var exploded = str.split('');
  exploded = exploded.map(map);
  return exploded.join('');
};

// custom formatter methods
colors.trap = __webpack_require__(122);
colors.zalgo = __webpack_require__(123);

// maps
colors.maps = {};
colors.maps.america = __webpack_require__(124)(colors);
colors.maps.zebra = __webpack_require__(125)(colors);
colors.maps.rainbow = __webpack_require__(126)(colors);
colors.maps.random = __webpack_require__(127)(colors);

for (var map in colors.maps) {
  (function(map) {
    colors[map] = function(str) {
      return sequencer(colors.maps[map], str);
    };
  })(map);
}

defineProps(colors, init());


/***/ }),
/* 119 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],

  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49],

};

Object.keys(codes).forEach(function(key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/



var os = __webpack_require__(24);
var hasFlag = __webpack_require__(121);

var env = process.env;

var forceColor = void 0;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true')
           || hasFlag('color=always')) {
  forceColor = true;
}
if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0
    || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level: level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full')
      || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  var min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first
    // Windows release that supports 256 colors. Windows 10 build 14931 is the
    // first release that supports 16m/TrueColor.
    var osRelease = os.release().split('.');
    if (Number(process.versions.node.split('.')[0]) >= 8
        && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function(sign) {
      return sign in env;
    }) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return (/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    );
  }

  if ('TERM_PROGRAM' in env) {
    var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;
      case 'Hyper':
        return 3;
      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
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
  var level = supportsColor(stream);
  return translateLevel(level);
}

module.exports = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr),
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



module.exports = function(flag, argv) {
  argv = argv || process.argv;

  var terminatorPos = argv.indexOf('--');
  var prefix = /^-{1,2}/.test(flag) ? '' : '--';
  var pos = argv.indexOf(prefix + flag);

  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),
/* 122 */
/***/ (function(module, exports) {

module['exports'] = function runTheTrap(text, options) {
  var result = '';
  text = text || 'Run the trap, drop the bass';
  text = text.split('');
  var trap = {
    a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
    b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
    c: ['\u00a9', '\u023b', '\u03fe'],
    d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
    e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc',
      '\u0a6c'],
    f: ['\u04fa'],
    g: ['\u0262'],
    h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
    i: ['\u0f0f'],
    j: ['\u0134'],
    k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
    l: ['\u0139'],
    m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
    n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
    o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd',
      '\u06dd', '\u0e4f'],
    p: ['\u01f7', '\u048e'],
    q: ['\u09cd'],
    r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
    s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
    t: ['\u0141', '\u0166', '\u0373'],
    u: ['\u01b1', '\u054d'],
    v: ['\u05d8'],
    w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
    x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
    y: ['\u00a5', '\u04b0', '\u04cb'],
    z: ['\u01b5', '\u0240'],
  };
  text.forEach(function(c) {
    c = c.toLowerCase();
    var chars = trap[c] || [' '];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== 'undefined') {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;
};


/***/ }),
/* 123 */
/***/ (function(module, exports) {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚',
    ],
    'down': [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣',
    ],
    'mid': [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉',
    ],
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function(i) {
      bool = (i === character);
    });
    return bool;
  }


  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] =
      typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] =
      typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] =
      typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] =
      typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');
    for (l in text) {
      if (isChar(l)) {
        continue;
      }
      result = result + text[l];
      counts = {'up': 0, 'down': 0, 'mid': 0};
      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(8);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(8);
          break;
        case 'maxi':
          counts.up = randomNumber(16) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(64) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
};



/***/ }),
/* 124 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    if (letter === ' ') return letter;
    switch (i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter);
      case 2: return colors.blue(letter);
    }
  };
};


/***/ }),
/* 125 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    return i % 2 === 0 ? letter : colors.inverse(letter);
  };
};


/***/ }),
/* 126 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  // RoY G BiV
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
  return function(letter, i, exploded) {
    if (letter === ' ') {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
};



/***/ }),
/* 127 */
/***/ (function(module, exports) {

module['exports'] = function(colors) {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green',
    'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed',
    'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
  return function(letter, i, exploded) {
    return letter === ' ' ? letter :
      colors[
          available[Math.round(Math.random() * (available.length - 2))]
      ](letter);
  };
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a string with the same length as `numSpaces` parameter
 **/
exports.indent = function indent(numSpaces) {
  return new Array(numSpaces+1).join(' ');
};

/**
 * Gets the string length of the longer index in a hash
 **/
exports.getMaxIndexLength = function(input) {
  var maxWidth = 0;

  Object.getOwnPropertyNames(input).forEach(function(key) {
    // Skip undefined values.
    if (input[key] === undefined) {
      return;
    }

    maxWidth = Math.max(maxWidth, key.length);
  });
  return maxWidth;
};


/***/ }),
/* 129 */
/***/ (function(module) {

module.exports = JSON.parse("{\"author\":\"Rafael de Oleza <rafeca@gmail.com> (https://github.com/rafeca)\",\"name\":\"prettyjson\",\"description\":\"Package for formatting JSON data in a coloured YAML-style, perfect for CLI output\",\"version\":\"1.2.1\",\"homepage\":\"http://rafeca.com/prettyjson\",\"keywords\":[\"json\",\"cli\",\"formatting\",\"colors\"],\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/rafeca/prettyjson.git\"},\"bugs\":{\"url\":\"https://github.com/rafeca/prettyjson/issues\"},\"main\":\"./lib/prettyjson\",\"license\":\"MIT\",\"scripts\":{\"test\":\"npm run jshint && mocha --reporter spec\",\"testwin\":\"node ./node_modules/mocha/bin/mocha --reporter spec\",\"jshint\":\"jshint lib/*.js test/*.js\",\"coverage\":\"istanbul cover _mocha --report lcovonly -- -R spec\",\"coveralls\":\"npm run coverage && cat ./coverage/lcov.info | coveralls && rm -rf ./coverage\",\"changelog\":\"git log $(git describe --tags --abbrev=0)..HEAD --pretty='* %s' --first-parent\"},\"bin\":{\"prettyjson\":\"./bin/prettyjson\"},\"dependencies\":{\"colors\":\"^1.1.2\",\"minimist\":\"^1.2.0\"},\"devDependencies\":{\"coveralls\":\"^2.11.15\",\"istanbul\":\"^0.4.5\",\"jshint\":\"^2.9.4\",\"mocha\":\"^3.1.2\",\"mocha-lcov-reporter\":\"^1.2.0\",\"should\":\"^11.1.1\"}}");

/***/ }),
/* 130 */
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
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
const colorConvert = __webpack_require__(132);

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
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(54);
var route = __webpack_require__(134);

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
/* 133 */
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
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(54);

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
/* 135 */
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
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sink", function() { return sink; });
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);
/* eslint-disable no-console */


const COMMON_ERROR_FIELDS = [// standard fields
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
'name', 'message', // quasi-standard
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
'stack', // standard in node
'code', // https://nodejs.org/dist/latest/docs/api/errors.html#errors_node_js_error_codes
// non standard but widely used
'statusCode', 'shouldRedirect', 'framesToPop', // My (Offirmo) extensions
'details', 'SEC', '_temp'];

function displayErrProp(errLike, prop) {
  if (prop === 'details') {
    const details = errLike.details;
    console.error(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(`🔥  ${prop}:`)));
    Object.entries(details).forEach(([key, value]) => {
      console.error(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(`    ${key}: "`) + value + chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim('"')));
    });
  } else console.error(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim('"')));
}

function displayError(errLike = {}) {
  console.error(chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`));
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

  if (errLike.logicalStack) {
    displayErrProp(errLike, 'logicalStack');
    displayedProps.add('logicalStack');
  }

  COMMON_ERROR_FIELDS.forEach(prop => {
    if (prop in errLike && !displayedProps.has(prop)) {
      displayErrProp(errLike, prop);
    }
  });
}

console.log('public sink!');
const sink = payload => {
  const {
    level,
    name,
    msg,
    time,
    details,
    err
  } = payload;
  const prettified_details = JSON.stringify(details);
  const line = '' // TODO evaluate if time display is needed
  //+ chalk.dim(String(time))
  //+ ' '
  + _common__WEBPACK_IMPORTED_MODULE_1__[/* LEVEL_TO_ASCII */ "a"][level] + '› ' + _common__WEBPACK_IMPORTED_MODULE_1__[/* LEVEL_TO_STYLIZE */ "b"][level]('' + name + (name ? '›' : '') + (msg ? ' ' : '') + msg) + (prettified_details !== '{}' ? ' ' + prettified_details : '');
  console.log(line); // eslint-disable-line no-console

  if (err) displayError(err);
};
/* harmony default export */ __webpack_exports__["default"] = (sink);

/***/ }),
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/indent-string/index.js
var indent_string = __webpack_require__(34);
var indent_string_default = /*#__PURE__*/__webpack_require__.n(indent_string);

// EXTERNAL MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/chalk/index.js
var chalk = __webpack_require__(0);
var chalk_default = /*#__PURE__*/__webpack_require__.n(chalk);

// EXTERNAL MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/common-error-fields/dist/src.es2019/field-set.js
var field_set = __webpack_require__(18);

// CONCATENATED MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/print-error-to-ansi/dist/src.es2019/index.js
/* eslint-disable no-console */

 // TODO make it more pro!

function displayErrProp(errLike, prop) {
  if (prop === 'details') {
    const details = errLike.details;
    console.error(chalk_default.a.red(chalk_default.a.dim(`🔥  ${prop}:`)));
    Object.entries(details).forEach(([key, value]) => {
      console.error(chalk_default.a.red(chalk_default.a.dim(`    ${key}: "`) + value + chalk_default.a.dim('"')));
    });
  } else console.error(chalk_default.a.red(chalk_default.a.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk_default.a.dim('"')));
}

function displayError(errLike = {}) {
  console.error(chalk_default.a.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk_default.a.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`)); // TODO use normalize error?

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

  if (errLike.logicalStack) {
    displayErrProp(errLike, 'logicalStack');
    displayedProps.add('logicalStack');
  }

  field_set["a" /* COMMON_ERROR_FIELDS */].forEach(prop => {
    if (prop in errLike && !displayedProps.has(prop)) {
      displayErrProp(errLike, prop);
    }
  });
}


// EXTERNAL MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/prettyjson/lib/prettyjson.js
var prettyjson = __webpack_require__(86);
var prettyjson_default = /*#__PURE__*/__webpack_require__.n(prettyjson);

// CONCATENATED MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/prettify-json/dist/src.es2019/indent-string.js
// https://github.com/sindresorhus/indent-string
 // improved version but don't remember what was improved :-}

function indent_string_indent_string(msg, indentation, options = {}) {
  let result = indent_string_default()(msg, indentation, options);
  if (!options || !options.indent || options.indent === ' ') return result;
  const indent_str = Array(indentation).fill(options.indent).join('');
  const lines = result.split('\n');
  return lines.map(line => line.startsWith(indent_str) ? line : indent_str + line).join('\n');
} ////////////


/* harmony default export */ var src_es2019_indent_string = (indent_string_indent_string);
// CONCATENATED MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/prettify-json/dist/src.es2019/index.js



function prettify_json(data, options = {}) {
  if (!data) return String(data);
  let {
    outline,
    indent,
    ...prettyjson_options
  } = options;
  prettyjson_options = { //keysColor: 'dim',
    ...prettyjson_options
  };
  let result = prettyjson_default.a.render(data, prettyjson_options);

  if (outline) {
    result = '\n{{{{{{{' + src_es2019_indent_string('\n' + result, 1, {
      indent: '	'
    }) + '\n}}}}}}}';
  }

  if (indent) {
    result = src_es2019_indent_string(result, indent);
  }

  return result;
}

function dump_pretty_json(msg, data, options) {
  console.log(msg);
  console.log(prettify_json(data, options));
}

/* harmony default export */ var src_es2019 = (prettify_json);

// EXTERNAL MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-node/dist/src.es2019/sinks/common.js
var common = __webpack_require__(20);

// CONCATENATED MODULE: /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-node/dist/src.es2019/sinks/private.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sink", function() { return sink; });




const sink = payload => {
  const {
    level,
    name,
    msg,
    time,
    details,
    err
  } = payload;
  const prettified_details = src_es2019(details);
  const is_prettified_details_multiline = prettified_details.includes('\n');
  const line = '' // TODO evaluate if time display is needed
  //+ chalk.dim(String(time))
  //+ ' '
  + common["a" /* LEVEL_TO_ASCII */][level] + '› ' + common["b" /* LEVEL_TO_STYLIZE */][level]('' + name + (name ? '›' : '') + (msg ? ' ' : '') + msg) + (prettified_details ? is_prettified_details_multiline ? ' {\n' + indent_string_default()(prettified_details, 2) + '\n}' : ' { ' + prettified_details + ' }' : '');
  console.log(line); // eslint-disable-line no-console

  if (err) displayError(err);
};
/* harmony default export */ var sinks_private = __webpack_exports__["default"] = (sink);

/***/ })
/******/ ])));