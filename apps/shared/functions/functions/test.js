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
/******/ 	return __webpack_require__(__webpack_require__.s = "./test.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../../../../0-stdlib/globalthis-ponyfill/dist/src.es2019/index.js":
/*!**********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/globalthis-ponyfill/dist/src.es2019/index.js ***!
  \**********************************************************************************************************/
/*! exports provided: getGlobalThis */
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

/***/ "../../../../../0-stdlib/promise-try/dist/src.es2019/index.js":
/*!**************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/promise-try/dist/src.es2019/index.js ***!
  \**************************************************************************************************/
/*! exports provided: promiseTry */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "promiseTry", function() { return promiseTry; });
// http://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry(fn) {
  return Promise.resolve().then(fn);
}



/***/ }),

/***/ "../../../../../0-stdlib/timestamps/dist/src.es2019/generate.js":
/*!****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/timestamps/dist/src.es2019/generate.js ***!
  \****************************************************************************************************/
/*! exports provided: get_UTC_timestamp_ms, get_human_readable_UTC_timestamp_ms, get_human_readable_UTC_timestamp_seconds, get_human_readable_UTC_timestamp_minutes, get_human_readable_UTC_timestamp_days */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_UTC_timestamp_ms", function() { return get_UTC_timestamp_ms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_ms", function() { return get_human_readable_UTC_timestamp_ms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_seconds", function() { return get_human_readable_UTC_timestamp_seconds; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_minutes", function() { return get_human_readable_UTC_timestamp_minutes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_days", function() { return get_human_readable_UTC_timestamp_days; });
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

/***/ }),

/***/ "../../../../../0-stdlib/timestamps/dist/src.es2019/index.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/0-stdlib/timestamps/dist/src.es2019/index.js ***!
  \*************************************************************************************************/
/*! exports provided: get_UTC_timestamp_ms, get_human_readable_UTC_timestamp_ms, get_human_readable_UTC_timestamp_seconds, get_human_readable_UTC_timestamp_minutes, get_human_readable_UTC_timestamp_days */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _generate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generate */ "../../../../../0-stdlib/timestamps/dist/src.es2019/generate.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_UTC_timestamp_ms", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["get_UTC_timestamp_ms"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_ms", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["get_human_readable_UTC_timestamp_ms"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_seconds", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["get_human_readable_UTC_timestamp_seconds"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_minutes", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["get_human_readable_UTC_timestamp_minutes"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "get_human_readable_UTC_timestamp_days", function() { return _generate__WEBPACK_IMPORTED_MODULE_0__["get_human_readable_UTC_timestamp_days"]; });



/***/ }),

/***/ "../../../../../1-foundation/common-error-fields/dist/src.es2019/field-set.js":
/*!******************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/common-error-fields/dist/src.es2019/field-set.js ***!
  \******************************************************************************************************************/
/*! exports provided: COMMON_ERROR_FIELDS, create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS", function() { return COMMON_ERROR_FIELDS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
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

/***/ "../../../../../1-foundation/common-error-fields/dist/src.es2019/index.js":
/*!**************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/common-error-fields/dist/src.es2019/index.js ***!
  \**************************************************************************************************************/
/*! exports provided: COMMON_ERROR_FIELDS, create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _field_set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field-set */ "../../../../../1-foundation/common-error-fields/dist/src.es2019/field-set.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS", function() { return _field_set__WEBPACK_IMPORTED_MODULE_0__["COMMON_ERROR_FIELDS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "create", function() { return _field_set__WEBPACK_IMPORTED_MODULE_0__["create"]; });



/***/ }),

/***/ "../../../../../1-foundation/normalize-error/dist/src.es2019/index.js":
/*!**********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/normalize-error/dist/src.es2019/index.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _offirmo_private_common_error_fields__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo-private/common-error-fields */ "../../../../../1-foundation/common-error-fields/dist/src.es2019/index.js");
 // Anything can be thrown: undefined, string, number...)
// But that's obviously not a good practice.
// Normalize any thrown object into a true, normal error.

function normalizeError(err_like = {}) {
  // Fact: in browser, sometimes, an error-like, un-writable object is thrown
  // create a true, safe, writable error object
  const true_err = new Error(err_like.message || `(non-error caught: "${err_like}")`); // copy fields if they exist

  _offirmo_private_common_error_fields__WEBPACK_IMPORTED_MODULE_0__["COMMON_ERROR_FIELDS"].forEach(prop => {
    //if (prop in err_like)
    if (err_like[prop]) true_err[prop] = err_like[prop];
  });
  return true_err;
}

/* harmony default export */ __webpack_exports__["default"] = (normalizeError);

/***/ }),

/***/ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/consts-base.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-core/dist/src.es2019/consts-base.js ***!
  \**********************************************************************************************************************/
/*! exports provided: DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOG_LEVEL", function() { return DEFAULT_LOG_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOGGER_KEY", function() { return DEFAULT_LOGGER_KEY; });
// base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.
const DEFAULT_LOG_LEVEL = 'error';
const DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key

/***/ }),

/***/ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/consts.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-core/dist/src.es2019/consts.js ***!
  \*****************************************************************************************************************/
/*! exports provided: LIB, LOG_LEVEL_TO_INTEGER, ALL_LOG_LEVELS, LOG_LEVEL_TO_HUMAN, DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LIB", function() { return LIB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL_TO_INTEGER", function() { return LOG_LEVEL_TO_INTEGER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ALL_LOG_LEVELS", function() { return ALL_LOG_LEVELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL_TO_HUMAN", function() { return LOG_LEVEL_TO_HUMAN; });
/* harmony import */ var _consts_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts-base */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/consts-base.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOG_LEVEL", function() { return _consts_base__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_LOG_LEVEL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOGGER_KEY", function() { return _consts_base__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_LOGGER_KEY"]; });

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

const LOG_LEVEL_TO_HUMAN = // generated to shave a few bytes
Object.fromEntries(ALL_LOG_LEVELS.map(ll => {
  return [ll, {
    em: 'emergency',
    wa: 'warn'
  }[ll.slice(0, 1)] || ll];
}));


/***/ }),

/***/ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/core.js":
/*!***************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-core/dist/src.es2019/core.js ***!
  \***************************************************************************************************************/
/*! exports provided: checkLevel, create */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkLevel", function() { return checkLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/consts.js");
/* harmony import */ var _normalize_args__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./normalize-args */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/normalize-args.js");


function checkLevel(level) {
  if (!_consts__WEBPACK_IMPORTED_MODULE_0__["ALL_LOG_LEVELS"].includes(level)) throw new Error(`[${_consts__WEBPACK_IMPORTED_MODULE_0__["LIB"]}] Not a valid log level: "${level}"!`);
}
function create({
  name = _consts__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_LOGGER_KEY"],
  suggestedLevel = _consts__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_LOG_LEVEL"],
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

  const logger = _consts__WEBPACK_IMPORTED_MODULE_0__["ALL_LOG_LEVELS"].reduce((logger, level) => {
    const primitive = function (rawMessage, rawDetails) {
      if (!isLevelEnabled(level)) return;
      const [message, details] = Object(_normalize_args__WEBPACK_IMPORTED_MODULE_1__["normalizeArguments"])(arguments);
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
    levelAsInt = _consts__WEBPACK_IMPORTED_MODULE_0__["LOG_LEVEL_TO_INTEGER"][level];
  }

  setLevel(getLevel()); // to check it

  function isLevelEnabled(level) {
    checkLevel(level);
    return _consts__WEBPACK_IMPORTED_MODULE_0__["LOG_LEVEL_TO_INTEGER"][level] <= levelAsInt;
  }

  function getLevel() {
    return internalState.level;
  }

  function addCommonDetails(details) {
    if (details.err) throw new Error(`[${_consts__WEBPACK_IMPORTED_MODULE_0__["LIB"]}] Can't set reserved property "err"!`);
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

/***/ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/index.js":
/*!****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-core/dist/src.es2019/index.js ***!
  \****************************************************************************************************************/
/*! exports provided: createLogger, ALL_LOG_LEVELS, LOG_LEVEL_TO_INTEGER, LOG_LEVEL_TO_HUMAN, DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY, checkLevel, looksLikeAnError, normalizeArguments */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/core.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createLogger", function() { return _core__WEBPACK_IMPORTED_MODULE_0__["create"]; });

/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/consts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ALL_LOG_LEVELS", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["ALL_LOG_LEVELS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL_TO_INTEGER", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_INTEGER"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOG_LEVEL_TO_HUMAN", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOG_LEVEL", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_LOG_LEVEL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOGGER_KEY", function() { return _consts__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_LOGGER_KEY"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "checkLevel", function() { return _core__WEBPACK_IMPORTED_MODULE_0__["checkLevel"]; });

/* harmony import */ var _normalize_args__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./normalize-args */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/normalize-args.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "looksLikeAnError", function() { return _normalize_args__WEBPACK_IMPORTED_MODULE_2__["looksLikeAnError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizeArguments", function() { return _normalize_args__WEBPACK_IMPORTED_MODULE_2__["normalizeArguments"]; });







/***/ }),

/***/ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/normalize-args.js":
/*!*************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-core/dist/src.es2019/normalize-args.js ***!
  \*************************************************************************************************************************/
/*! exports provided: looksLikeAnError, normalizeArguments */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "looksLikeAnError", function() { return looksLikeAnError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeArguments", function() { return normalizeArguments; });
function looksLikeAnError(x) {
  return !!(x && x.name && x.message && x.stack);
} // harmonize
// also try to recover from incorrect invocations

function normalizeArguments(raw_args) {
  var _a;

  let message_parts = [];
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

/***/ }),

/***/ "../../../../../1-foundation/practical-logger-node/dist/src.es2019/index.js":
/*!****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-node/dist/src.es2019/index.js ***!
  \****************************************************************************************************************/
/*! exports provided: createLogger, DEFAULT_LOG_LEVEL, DEFAULT_LOGGER_KEY */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createLogger", function() { return createLogger; });
/* harmony import */ var _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo/practical-logger-core */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/index.js");
/* harmony import */ var _sinks_to_console__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sinks/to-console */ "../../../../../1-foundation/practical-logger-node/dist/src.es2019/sinks/to-console.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOG_LEVEL", function() { return _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_LOG_LEVEL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DEFAULT_LOGGER_KEY", function() { return _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__["DEFAULT_LOGGER_KEY"]; });



const ORIGINAL_CONSOLE = console;

function createLogger(p = {}) {
  var _a;

  const {
    group,
    groupCollapsed,
    groupEnd
  } = ORIGINAL_CONSOLE;
  return { ...Object(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_0__["createLogger"])(p, ((_a = p.sinkOptions) === null || _a === void 0 ? void 0 : _a.sink) || Object(_sinks_to_console__WEBPACK_IMPORTED_MODULE_1__["default"])(p.sinkOptions)),
    group,
    groupCollapsed,
    groupEnd
  };
}




/***/ }),

/***/ "../../../../../1-foundation/practical-logger-node/dist/src.es2019/sinks/common.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-node/dist/src.es2019/sinks/common.js ***!
  \***********************************************************************************************************************/
/*! exports provided: LEVEL_TO_ASCII, LEVEL_TO_STYLIZE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LEVEL_TO_ASCII", function() { return LEVEL_TO_ASCII; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LEVEL_TO_STYLIZE", function() { return LEVEL_TO_STYLIZE; });
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chalk */ "../../../../../node_modules/chalk/index.js");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @offirmo/practical-logger-core */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/index.js");


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
  fatal: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(' ' + _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['fatal'])),
  emerg: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['emerg'])),
  alert: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(' ' + _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['alert'])),
  crit: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.bgRed.white.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['crit'])),
  error: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.red.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['error'])),
  warning: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.yellow.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['warning'])),
  warn: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.yellow.bold(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['warn'])),
  notice: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.blue(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['notice'])),
  info: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.blue(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['info'])),
  verbose: to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['verbose']),
  log: to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['log']),
  debug: to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['debug']),
  trace: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['trace'])),
  silly: chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(to_aligned_ascii(_offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["LOG_LEVEL_TO_HUMAN"]['silly']))
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

/***/ "../../../../../1-foundation/practical-logger-node/dist/src.es2019/sinks/to-console.js":
/*!***************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/1-foundation/practical-logger-node/dist/src.es2019/sinks/to-console.js ***!
  \***************************************************************************************************************************/
/*! exports provided: createSink, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSink", function() { return createSink; });
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chalk */ "../../../../../node_modules/chalk/index.js");
/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "../../../../../1-foundation/practical-logger-node/dist/src.es2019/sinks/common.js");
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
    const prettified_details = JSON.stringify(details);
    const line = '' // TODO evaluate if time display is needed
    + (displayTime ? chalk__WEBPACK_IMPORTED_MODULE_0___default.a.dim(String(time)) + ' ' : '') + _common__WEBPACK_IMPORTED_MODULE_1__["LEVEL_TO_ASCII"][level] + '› ' + _common__WEBPACK_IMPORTED_MODULE_1__["LEVEL_TO_STYLIZE"][level]('' + name + (name ? '›' : '') + (msg ? ' ' : '') + msg) + (prettified_details !== '{}' ? ' ' + prettified_details : '');
    console.log(line); // eslint-disable-line no-console

    if (err) displayError(err);
  };
}
/* harmony default export */ __webpack_exports__["default"] = (createSink);

/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context-node/src/index.js":
/*!********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context-node/src/index.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const os = __webpack_require__(/*! os */ "os");

const {
  getRootSEC
} = __webpack_require__(/*! @offirmo-private/soft-execution-context */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/index.js"); // TODO protect from double install


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

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/common.js":
/*!****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/common.js ***!
  \****************************************************************************************************************/
/*! exports provided: decorateWithDetectedEnv */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "decorateWithDetectedEnv", function() { return decorateWithDetectedEnv; });
/* harmony import */ var _offirmo_private_timestamps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo-private/timestamps */ "../../../../../0-stdlib/timestamps/dist/src.es2019/index.js");
/* global NODE_ENV process */


function decorateWithDetectedEnv(SEC) {
  let ENV = (() => {
    try {
      /*
      if (typeof NODE_ENV === 'string')
          return NODE_ENV
       */
      if (typeof process !== 'undefined' && "string" === 'string') return "development";
    } catch (err) {
      /* swallow */
    }

    return 'development';
  })();

  const IS_DEV_MODE = false;
  const IS_VERBOSE = false;
  const CHANNEL = 'unknown';
  const SESSION_START_TIME = Object(_offirmo_private_timestamps__WEBPACK_IMPORTED_MODULE_0__["get_UTC_timestamp_ms"])();
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



/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js":
/*!****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/consts.js ***!
  \****************************************************************************************************************/
/*! exports provided: LIB, INTERNAL_PROP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LIB", function() { return LIB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "INTERNAL_PROP", function() { return INTERNAL_PROP; });
const LIB = 'soft-execution-context';
const INTERNAL_PROP = '_SEC';


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/core.js":
/*!**************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/core.js ***!
  \**************************************************************************************************************/
/*! exports provided: LIB, isSEC, createSEC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSEC", function() { return isSEC; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSEC", function() { return createSEC; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LIB", function() { return _consts__WEBPACK_IMPORTED_MODULE_0__["LIB"]; });

/* harmony import */ var _root_prototype__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./root-prototype */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/root-prototype.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/state.js");
/* harmony import */ var _plugins_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins/index */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/index.js");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/common.js");






_root_prototype__WEBPACK_IMPORTED_MODULE_1__["ROOT_PROTOTYPE"].createChild = function createChild(args) {
  return createSEC({ ...args,
    parent: this
  });
};

_plugins_index__WEBPACK_IMPORTED_MODULE_3__["PLUGINS"].forEach(PLUGIN => {
  PLUGIN.augment(_root_prototype__WEBPACK_IMPORTED_MODULE_1__["ROOT_PROTOTYPE"]);
});

function isSEC(SEC) {
  return SEC && SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]];
}

function createSEC(args = {}) {
  /////// PARAMS ///////
  if (args.parent && !isSEC(args.parent)) throw new Error(`${_consts__WEBPACK_IMPORTED_MODULE_0__["LIB"]}›createSEC() argument error: parent must be a valid SEC!`);
  let unhandled_args = Object.keys(args);
  let SEC = Object.create(_root_prototype__WEBPACK_IMPORTED_MODULE_1__["ROOT_PROTOTYPE"]); /////// STATE ///////

  let parent_state = args.parent ? args.parent[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]] : undefined;
  let state = _state__WEBPACK_IMPORTED_MODULE_2__["create"](parent_state);
  unhandled_args = unhandled_args.filter(arg => arg !== 'parent');
  _plugins_index__WEBPACK_IMPORTED_MODULE_3__["PLUGINS"].forEach(PLUGIN => {
    state = _state__WEBPACK_IMPORTED_MODULE_2__["activate_plugin"](state, PLUGIN);
  });
  SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]] = state; // auto injections

  if (!args.parent) {
    SEC.injectDependencies({
      logger: console
    });
    Object(_common__WEBPACK_IMPORTED_MODULE_4__["decorateWithDetectedEnv"])(SEC);
  }

  SEC.injectDependencies({
    SEC
  }); //console.log('createSEC', SEC, args.parent)
  // Here we could send an event on the SEC bus. No usage for now.
  // Her we could have lifecycle methods. No usage for now.

  if (unhandled_args.length) throw new Error(`${_consts__WEBPACK_IMPORTED_MODULE_0__["LIB"]}›createSEC() argument error: unknown args: [${unhandled_args.join(',')}]!`); /////////////////////

  return SEC;
}



/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/index.js":
/*!***************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/index.js ***!
  \***************************************************************************************************************/
/*! exports provided: getRootSEC, LIB, isSEC, createSEC, flattenToOwn, _getSECStatePath, _flattenSEC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _root__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./root */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/root.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getRootSEC", function() { return _root__WEBPACK_IMPORTED_MODULE_0__["getRootSEC"]; });

/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/core.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LIB", function() { return _core__WEBPACK_IMPORTED_MODULE_1__["LIB"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isSEC", function() { return _core__WEBPACK_IMPORTED_MODULE_1__["isSEC"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createSEC", function() { return _core__WEBPACK_IMPORTED_MODULE_1__["createSEC"]; });

/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/utils.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flattenToOwn", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["flattenToOwn"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_getSECStatePath", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["_getSECStatePath"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "_flattenSEC", function() { return _utils__WEBPACK_IMPORTED_MODULE_2__["_flattenSEC"]; });





/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/analytics/index.js":
/*!*********************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/analytics/index.js ***!
  \*********************************************************************************************************************************/
/*! exports provided: PLUGIN_ID, PLUGIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN_ID", function() { return PLUGIN_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN", function() { return PLUGIN; });
/* harmony import */ var _offirmo_private_timestamps__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo-private/timestamps */ "../../../../../0-stdlib/timestamps/dist/src.es2019/index.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/utils.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/analytics/state.js");
/* harmony import */ var _dependency_injection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dependency-injection */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/index.js");






const PLUGIN_ID = 'analytics';
const PLUGIN = {
  id: PLUGIN_ID,
  state: _state__WEBPACK_IMPORTED_MODULE_4__,
  augment: prototype => {
    prototype.setAnalyticsDetails = function setAnalyticsDetails(details) {
      const SEC = this;
      let root_state = SEC[_consts__WEBPACK_IMPORTED_MODULE_1__["INTERNAL_PROP"]];
      root_state = _state__WEBPACK_IMPORTED_MODULE_2__["reduce_plugin"](root_state, PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = _state__WEBPACK_IMPORTED_MODULE_4__["addDetail"](plugin_state, key, value);
        });
        return plugin_state;
      });
      this[_consts__WEBPACK_IMPORTED_MODULE_1__["INTERNAL_PROP"]] = root_state;
      return SEC; // for chaining
    };

    prototype.fireAnalyticsEvent = function fireAnalyticsEvent(eventId, details = {}) {
      const SEC = this;
      const now = Object(_offirmo_private_timestamps__WEBPACK_IMPORTED_MODULE_0__["get_UTC_timestamp_ms"])();
      let root_state = SEC[_consts__WEBPACK_IMPORTED_MODULE_1__["INTERNAL_PROP"]];
      if (!eventId) throw new Error('Incorrect eventId!');
      const {
        ENV
      } = SEC.getInjectedDependencies();
      const autoDetails = {
        ENV,
        TIME: now,
        SESSION_DURATION_MS: now - root_state.plugins[_dependency_injection__WEBPACK_IMPORTED_MODULE_5__["PLUGIN_ID"]].context.SESSION_START_TIME
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
      const plugin_state = SEC[_consts__WEBPACK_IMPORTED_MODULE_1__["INTERNAL_PROP"]].plugins[PLUGIN_ID];
      return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["flattenToOwn"])(plugin_state.details);
    };
  }
};


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/analytics/state.js":
/*!*********************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/analytics/state.js ***!
  \*********************************************************************************************************************************/
/*! exports provided: create, addDetail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDetail", function() { return addDetail; });
function create(parent_state) {
  const details = parent_state ? Object.create(parent_state.details) : Object.create(null); // NO auto-details here, let's keep it simple. See core or platform specific code.

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




/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/index.js":
/*!********************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/index.js ***!
  \********************************************************************************************************************************************/
/*! exports provided: PLUGIN_ID, PLUGIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN_ID", function() { return PLUGIN_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN", function() { return PLUGIN; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/state.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/utils.js");




const PLUGIN_ID = 'dependency_injection';
const PLUGIN = {
  id: PLUGIN_ID,
  state: _state__WEBPACK_IMPORTED_MODULE_2__,
  augment: prototype => {
    prototype.injectDependencies = function injectDependencies(deps) {
      let root_state = this[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]];
      root_state = _state__WEBPACK_IMPORTED_MODULE_1__["reduce_plugin"](root_state, PLUGIN_ID, state => {
        Object.entries(deps).forEach(([key, value]) => {
          state = _state__WEBPACK_IMPORTED_MODULE_2__["injectDependencies"](state, key, value);
        });
        return state;
      });
      this[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]] = root_state;
      return this; // for chaining
    };

    prototype.getInjectedDependencies = function getInjectedDependencies() {
      const plugin_state = this[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]].plugins[PLUGIN_ID];
      return Object(_utils__WEBPACK_IMPORTED_MODULE_3__["flattenToOwn"])(plugin_state.context);
    };
  }
};


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/state.js":
/*!********************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/state.js ***!
  \********************************************************************************************************************************************/
/*! exports provided: create, injectDependencies */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectDependencies", function() { return injectDependencies; });
function create(parent_state) {
  const context = parent_state ? Object.create(parent_state.context) : Object.create(null); // NO auto-injections here, let's keep it simple. See core.

  return {
    context
  };
}

function injectDependencies(state, key, value) {
  const {
    context
  } = state;
  context[key] = value;
  return { ...state,
    context
  };
} /////////////////////




/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/catch-factory.js":
/*!**********************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/catch-factory.js ***!
  \**********************************************************************************************************************************************/
/*! exports provided: createCatcher */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCatcher", function() { return createCatcher; });
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



/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/index.js":
/*!**************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/index.js ***!
  \**************************************************************************************************************************************/
/*! exports provided: PLUGIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN", function() { return PLUGIN; });
/* harmony import */ var _offirmo_private_normalize_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo-private/normalize-error */ "../../../../../1-foundation/normalize-error/dist/src.es2019/index.js");
/* harmony import */ var _offirmo_private_promise_try__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @offirmo-private/promise-try */ "../../../../../0-stdlib/promise-try/dist/src.es2019/index.js");
/* harmony import */ var _offirmo_private_timestamps__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @offirmo-private/timestamps */ "../../../../../0-stdlib/timestamps/dist/src.es2019/index.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/utils.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/state.js");
/* harmony import */ var _catch_factory__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./catch-factory */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/catch-factory.js");
/* harmony import */ var _dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../dependency-injection/index */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/index.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/state.js");









const PLUGIN_ID = 'error_handling';

function cleanTemp(err) {
  delete err._temp;
  return err;
}

const PLUGIN = {
  id: PLUGIN_ID,
  state: _state__WEBPACK_IMPORTED_MODULE_5__,
  augment: prototype => {
    prototype._handleError = function handleError({
      SEC,
      debugId = '?',
      shouldRethrow = true
    }, err) {
      Object(_catch_factory__WEBPACK_IMPORTED_MODULE_6__["createCatcher"])({
        debugId,
        decorators: [_offirmo_private_normalize_error__WEBPACK_IMPORTED_MODULE_0__["default"], err => SEC._decorateErrorWithLogicalStack(err), err => SEC._decorateErrorWithDetails(err)],
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
      const state = SEC[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]];
      const now = Object(_offirmo_private_timestamps__WEBPACK_IMPORTED_MODULE_2__["get_UTC_timestamp_ms"])();
      const autoDetails = {
        ENV: state.plugins[_dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]].context.ENV,
        TIME: now,
        SESSION_DURATION_MS: now - state.plugins[_dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]].context.SESSION_START_TIME
      };
      const userDetails = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["flattenToOwn"])(state.plugins[PLUGIN_ID].details);
      err.details = { ...autoDetails,
        ...userDetails,
        ...(err.details || {})
      };
      return err;
    };

    prototype.setErrorReportDetails = function setErrorReportDetails(details) {
      const SEC = this;
      let root_state = SEC[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]];
      root_state = _state__WEBPACK_IMPORTED_MODULE_8__["reduce_plugin"](root_state, PLUGIN_ID, plugin_state => {
        Object.entries(details).forEach(([key, value]) => {
          plugin_state = _state__WEBPACK_IMPORTED_MODULE_5__["addDetail"](plugin_state, key, value);
        });
        return plugin_state;
      });
      this[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]] = root_state;
      return SEC; // for chaining
    };

    prototype.xTry = function xTry(operation, fn) {
      const SEC = this.createChild().setLogicalStack({
        operation
      });
      const params = SEC[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]].plugins[_dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]].context;

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
      const params = SEC[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]].plugins[_dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]].context;

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
      const params = SEC[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]].plugins[_dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]].context;
      return Object(_offirmo_private_promise_try__WEBPACK_IMPORTED_MODULE_1__["promiseTry"])(() => fn(params)).catch(err => {
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
      const params = SEC[_consts__WEBPACK_IMPORTED_MODULE_3__["INTERNAL_PROP"]].plugins[_dependency_injection_index__WEBPACK_IMPORTED_MODULE_7__["PLUGIN_ID"]].context;
      return Object(_offirmo_private_promise_try__WEBPACK_IMPORTED_MODULE_1__["promiseTry"])(() => fn(params)).catch(err => {
        SEC._handleError({
          SEC,
          debugId: 'xPromiseTryCatch',
          shouldRethrow: false
        }, err);
      });
    };
  }
};


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/state.js":
/*!**************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/state.js ***!
  \**************************************************************************************************************************************/
/*! exports provided: create, addDetail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDetail", function() { return addDetail; });
/////////////////////
function create(parent_state) {
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




/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/index.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/index.js ***!
  \***********************************************************************************************************************/
/*! exports provided: PLUGINS_BY_ID, PLUGINS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGINS_BY_ID", function() { return PLUGINS_BY_ID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGINS", function() { return PLUGINS; });
/* harmony import */ var _logical_stack_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logical-stack/index */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/index.js");
/* harmony import */ var _dependency_injection_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dependency-injection/index */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/dependency-injection/index.js");
/* harmony import */ var _error_handling_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error-handling/index */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/error-handling/index.js");
/* harmony import */ var _analytics_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./analytics/index */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/analytics/index.js");




const PLUGINS_BY_ID = {
  [_analytics_index__WEBPACK_IMPORTED_MODULE_3__["PLUGIN"]]: _analytics_index__WEBPACK_IMPORTED_MODULE_3__["PLUGIN"],
  [_logical_stack_index__WEBPACK_IMPORTED_MODULE_0__["PLUGIN"].id]: _logical_stack_index__WEBPACK_IMPORTED_MODULE_0__["PLUGIN"],
  [_dependency_injection_index__WEBPACK_IMPORTED_MODULE_1__["PLUGIN"].id]: _dependency_injection_index__WEBPACK_IMPORTED_MODULE_1__["PLUGIN"],
  [_error_handling_index__WEBPACK_IMPORTED_MODULE_2__["PLUGIN"].id]: _error_handling_index__WEBPACK_IMPORTED_MODULE_2__["PLUGIN"]
};
const PLUGINS = Object.values(PLUGINS_BY_ID);


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/consts.js":
/*!**************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/consts.js ***!
  \**************************************************************************************************************************************/
/*! exports provided: LOGICAL_STACK_BEGIN_MARKER, LOGICAL_STACK_END_MARKER, LOGICAL_STACK_MODULE_MARKER, LOGICAL_STACK_SEPARATOR, LOGICAL_STACK_OPERATION_MARKER, LOGICAL_STACK_SEPARATOR_NON_ADJACENT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_STACK_BEGIN_MARKER", function() { return LOGICAL_STACK_BEGIN_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_STACK_END_MARKER", function() { return LOGICAL_STACK_END_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_STACK_MODULE_MARKER", function() { return LOGICAL_STACK_MODULE_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_STACK_SEPARATOR", function() { return LOGICAL_STACK_SEPARATOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_STACK_OPERATION_MARKER", function() { return LOGICAL_STACK_OPERATION_MARKER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOGICAL_STACK_SEPARATOR_NON_ADJACENT", function() { return LOGICAL_STACK_SEPARATOR_NON_ADJACENT; });
const LOGICAL_STACK_BEGIN_MARKER = '';
const LOGICAL_STACK_END_MARKER = '';
const LOGICAL_STACK_SEPARATOR = '›'; // '⋅' '↘' ':' '•' '›'

const LOGICAL_STACK_MODULE_MARKER = '';
const LOGICAL_STACK_OPERATION_MARKER = ''; // '…'

const LOGICAL_STACK_SEPARATOR_NON_ADJACENT = '…';


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/index.js":
/*!*************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/index.js ***!
  \*************************************************************************************************************************************/
/*! exports provided: PLUGIN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PLUGIN", function() { return PLUGIN; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/state.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/consts.js");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./state */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/state.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/utils.js");





const PLUGIN_ID = 'logical_stack';
const BRANCH_JUMP_PSEUDO_STATE = {
  sid: -1,
  plugins: {
    [PLUGIN_ID]: {
      stack: {
        // NO module
        operation: _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_SEPARATOR_NON_ADJACENT"]
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
      res = res + (res.length ? _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_SEPARATOR"] : '') + module;
      current_module = module;
    }

    if (operation) res = res + _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_SEPARATOR"] + operation + _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_OPERATION_MARKER"];
    return res;
  }, '') + _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_END_MARKER"];
}

const PLUGIN = {
  id: PLUGIN_ID,
  state: _state__WEBPACK_IMPORTED_MODULE_3__,
  augment: prototype => {
    prototype.setLogicalStack = function setLogicalStack({
      module,
      operation
    }) {
      const SEC = this;
      let root_state = SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]];
      root_state = _state__WEBPACK_IMPORTED_MODULE_1__["reduce_plugin"](root_state, PLUGIN_ID, state => {
        if (module) state = _state__WEBPACK_IMPORTED_MODULE_3__["set_module"](state, module);
        if (operation) state = _state__WEBPACK_IMPORTED_MODULE_3__["set_operation"](state, operation);
        return state;
      });
      SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]] = root_state;
      return SEC;
    };

    prototype.getLogicalStack = function getLogicalStack() {
      const SEC = this;
      return _reduceStatePathToLogicalStack(Object(_utils__WEBPACK_IMPORTED_MODULE_4__["_getSECStatePath"])(SEC));
    };

    prototype.getShortLogicalStack = function get_stack_end() {
      const {
        stack
      } = this[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]].plugins[PLUGIN_ID];
      return _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_BEGIN_MARKER"] + stack.module + _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_SEPARATOR"] + stack.operation + _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_OPERATION_MARKER"] + _consts__WEBPACK_IMPORTED_MODULE_2__["LOGICAL_STACK_END_MARKER"];
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

          const current_path = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["_getSECStatePath"])(SEC); // find common path


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
        err._temp.statePath = Object(_utils__WEBPACK_IMPORTED_MODULE_4__["_getSECStatePath"])(SEC);
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


/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/state.js":
/*!*************************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/plugins/logical-stack/state.js ***!
  \*************************************************************************************************************************************/
/*! exports provided: create, set_module, set_operation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_module", function() { return set_module; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_operation", function() { return set_operation; });
/////////////////////
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



/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/root-prototype.js":
/*!************************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/root-prototype.js ***!
  \************************************************************************************************************************/
/*! exports provided: ROOT_PROTOTYPE */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROOT_PROTOTYPE", function() { return ROOT_PROTOTYPE; });
/* harmony import */ var emittery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! emittery */ "../../../../../node_modules/emittery/index.js");
/* harmony import */ var emittery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(emittery__WEBPACK_IMPORTED_MODULE_0__);
 /////////////////////

const ROOT_PROTOTYPE = Object.create(null); // global bus shared by all SECs

ROOT_PROTOTYPE.emitter = new emittery__WEBPACK_IMPORTED_MODULE_0___default.a(); // common functions
// because we often set the same details

ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
  const SEC = this;
  return SEC.setAnalyticsDetails(details).setErrorReportDetails(details);
}; /////////////////////




/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/root.js":
/*!**************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/root.js ***!
  \**************************************************************************************************************/
/*! exports provided: getRootSEC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRootSEC", function() { return getRootSEC; });
/* harmony import */ var _offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo/globalthis-ponyfill */ "../../../../../0-stdlib/globalthis-ponyfill/dist/src.es2019/index.js");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/core.js");


 /////////////////////

const GLOBAL_VAR_NAME = '__global_root_sec';

function getRootSEC() {
  const global_this = Object(_offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__["getGlobalThis"])();

  if (!global_this[GLOBAL_VAR_NAME]) {
    console.log(`[${_consts__WEBPACK_IMPORTED_MODULE_1__["LIB"]}: Creating root SEC…]`); // XXX

    global_this[GLOBAL_VAR_NAME] = Object(_core__WEBPACK_IMPORTED_MODULE_2__["createSEC"])();
  }

  return global_this[GLOBAL_VAR_NAME];
} /////////////////////




/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/state.js":
/*!***************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/state.js ***!
  \***************************************************************************************************************/
/*! exports provided: create, activate_plugin, reduce_plugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "activate_plugin", function() { return activate_plugin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduce_plugin", function() { return reduce_plugin; });
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
  let plugin_state = PLUGIN.state.create(plugin_parent_state);
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




/***/ }),

/***/ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/utils.js":
/*!***************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/soft-execution-context/dist/src.es2019/utils.js ***!
  \***************************************************************************************************************/
/*! exports provided: flattenToOwn, _getSECStatePath, _flattenSEC */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flattenToOwn", function() { return flattenToOwn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_getSECStatePath", function() { return _getSECStatePath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_flattenSEC", function() { return _flattenSEC; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/consts.js");


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
  if (!SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]].cache.statePath) {
    const path = [];
    let state = SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]];

    while (state) {
      path.unshift(state);
      state = state.parent;
    }

    SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]].cache.statePath = path;
  }

  return SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]].cache.statePath;
} // for debug


function _flattenSEC(SEC) {
  const plugins = { ...SEC[_consts__WEBPACK_IMPORTED_MODULE_0__["INTERNAL_PROP"]].plugins
  };
  plugins.analytics.details = flattenToOwn(plugins.analytics.details);
  plugins.dependency_injection.context = flattenToOwn(plugins.dependency_injection.context);
  plugins.error_handling.details = flattenToOwn(plugins.error_handling.details);
  plugins.logical_stack.stack = flattenToOwn(plugins.logical_stack.stack);
  return plugins;
}



/***/ }),

/***/ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/consts.js":
/*!******************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/universal-debug-api-node/dist/src.es2019/consts.js ***!
  \******************************************************************************************************************/
/*! exports provided: ENV_ROOT */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ENV_ROOT", function() { return ENV_ROOT; });
const ENV_ROOT = 'UDA';

/***/ }),

/***/ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/index.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/universal-debug-api-node/dist/src.es2019/index.js ***!
  \*****************************************************************************************************************/
/*! exports provided: getLogger, exposeInternal, overrideHook, addDebugCommand, globalThis, createV1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLogger", function() { return getLogger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exposeInternal", function() { return exposeInternal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "overrideHook", function() { return overrideHook; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addDebugCommand", function() { return addDebugCommand; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "globalThis", function() { return globalThis; });
/* harmony import */ var _offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo/globalthis-ponyfill */ "../../../../../0-stdlib/globalthis-ponyfill/dist/src.es2019/index.js");
/* harmony import */ var _v1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./v1 */ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/v1/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createV1", function() { return _v1__WEBPACK_IMPORTED_MODULE_1__["default"]; });


 // ensure the root is present

const globalThis = Object(_offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__["getGlobalThis"])();
globalThis._debug = globalThis._debug || {}; // install globally if no other implementation already present
// TODO do a minor version check?
// TODO always override since final?

globalThis._debug.v1 = globalThis._debug.v1 || Object(_v1__WEBPACK_IMPORTED_MODULE_1__["default"])(); // expose the current implementation

const instance = globalThis._debug.v1;
const {
  getLogger,
  exposeInternal,
  overrideHook,
  addDebugCommand
} = instance;


/***/ }),

/***/ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/v1/index.js":
/*!********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/universal-debug-api-node/dist/src.es2019/v1/index.js ***!
  \********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return create; });
/* harmony import */ var _offirmo_practical_logger_node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @offirmo/practical-logger-node */ "../../../../../1-foundation/practical-logger-node/dist/src.es2019/index.js");
/* harmony import */ var _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @offirmo/practical-logger-core */ "../../../../../1-foundation/practical-logger-core/dist/src.es2019/index.js");
/* harmony import */ var _keys__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./keys */ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/v1/keys.js");


 ////////////////////////////////////

const LIB = _keys__WEBPACK_IMPORTED_MODULE_2__["ENV_ROOT"]; ////////////////////////////////////

function create() {
  ////////////////////////////////////
  const loggers = {}; // to avoid creating duplicates

  const debugCommands = {}; // TODO check

  const exposed = {};
  const overrides = {}; // we'll expose them for clarity
  ////////////////////////////////////
  // TODO override?
  // TODO allow off?

  const _ownLogger = (() => {
    return Object(_offirmo_practical_logger_node__WEBPACK_IMPORTED_MODULE_0__["createLogger"])({
      name: LIB
    });
  })();

  function _getOverrideRequestedSJson(ovKey) {
    try {
      const EnvKey = Object(_keys__WEBPACK_IMPORTED_MODULE_2__["getEnvKeyForOverride"])(ovKey); //console.log(`EnvKey = "${EnvKey}"`)

      const rawValue = process.env[EnvKey] || null; //console.log(`EnvKey "${EnvKey}" content = "${rawValue}"`)

      return rawValue;
    } catch (err) {
      _ownLogger.warn(`🔴 error reading ENV for override "${ovKey}"!`, {
        err
      });

      return null;
    }
  }

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
          value
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
      overrides
    }
  }; ////////////////////////////////////

  function overrideHook(key, defaultValue) {
    try {
      const status = _getOverride(key);

      if (status.isOn) return status.value;
    } catch (err) {
      // should never happen because _getOverride() already catch
      // TODO check!
      _ownLogger.warn(`overrideHook(): error retrieving override!`, {
        key,
        err
      });
    }

    return defaultValue;
  }

  function getLogger(p = {}) {
    const name = p.name || _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_LOGGER_KEY"]; // we need a name immediately

    if (!loggers[name]) {
      try {
        const ovKey = Object(_keys__WEBPACK_IMPORTED_MODULE_2__["getOverrideKeyForLogger"])(name);

        if (!p.forcedLevel && _getOverrideRequestedSJson(ovKey)) {
          p = { ...p,
            forcedLevel: overrideHook(ovKey, p.suggestedLevel || _offirmo_practical_logger_core__WEBPACK_IMPORTED_MODULE_1__["DEFAULT_LOG_LEVEL"])
          };
        }
      } catch (err) {
        // this warning should appear only once on creation ✔
        _ownLogger.warn(`getLogger(): error overriding the level!`, {
          name,
          err
        });
      }

      loggers[name] = Object(_offirmo_practical_logger_node__WEBPACK_IMPORTED_MODULE_0__["createLogger"])(p);
    }

    return loggers[name];
  }

  function exposeInternal(path, value) {
    try {
      const pathParts = path.split('.'); // TODO switch to / ?

      const lastIndex = pathParts.length - 1;
      let root = exposed;
      pathParts.forEach((p, index) => {
        root[p] = root[p] || (index === lastIndex ? value : {});
        root = root[p];
      });
    } catch (err) {
      _ownLogger.warn(`[${LIB}] exposeInternal(): error exposing!`, {
        path,
        err
      });
    }
  }

  function addDebugCommand(commandName, callback) {
    // TODO
    // TODO try catch
    debugCommands[commandName] = callback;
  }

  return api;
}

/***/ }),

/***/ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/v1/keys.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/2-advanced/universal-debug-api-node/dist/src.es2019/v1/keys.js ***!
  \*******************************************************************************************************************/
/*! exports provided: ENV_ROOT, getOverrideKeyForLogger, getEnvKeyForOverride */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOverrideKeyForLogger", function() { return getOverrideKeyForLogger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEnvKeyForOverride", function() { return getEnvKeyForOverride; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../consts */ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/consts.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ENV_ROOT", function() { return _consts__WEBPACK_IMPORTED_MODULE_0__["ENV_ROOT"]; });




function normalizeKey(key) {
  key = key.split('-').join('_');
  key = key.split('.').join('_');
  return key;
}

function getOverrideKeyForLogger(name) {
  return `logger_${name || 'default'}_logLevel`.toUpperCase();
}
function getEnvKeyForOverride(key) {
  // should we put v1 somewhere? no, most likely overkill.
  return `${_consts__WEBPACK_IMPORTED_MODULE_0__["ENV_ROOT"]}_override__${normalizeKey(key)}`.toUpperCase();
}

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/api.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/api.js ***!
  \*****************************************************************************************/
/*! exports provided: API */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API", function() { return API; });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _dsn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dsn */ "../../../../../node_modules/@sentry/core/esm/dsn.js");


var SENTRY_API_VERSION = '7';
/** Helper class to provide urls to different Sentry endpoints. */
var API = /** @class */ (function () {
    /** Create a new instance of API */
    function API(dsn) {
        this.dsn = dsn;
        this._dsnObject = new _dsn__WEBPACK_IMPORTED_MODULE_1__["Dsn"](dsn);
    }
    /** Returns the Dsn object. */
    API.prototype.getDsn = function () {
        return this._dsnObject;
    };
    /** Returns a string with auth headers in the url to the store endpoint. */
    API.prototype.getStoreEndpoint = function () {
        return "" + this._getBaseUrl() + this.getStoreEndpointPath();
    };
    /** Returns the store endpoint with auth added in url encoded. */
    API.prototype.getStoreEndpointWithUrlEncodedAuth = function () {
        var dsn = this._dsnObject;
        var auth = {
            sentry_key: dsn.user,
            sentry_version: SENTRY_API_VERSION,
        };
        // Auth is intentionally sent as part of query string (NOT as custom HTTP header)
        // to avoid preflight CORS requests
        return this.getStoreEndpoint() + "?" + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["urlEncode"])(auth);
    };
    /** Returns the base path of the url including the port. */
    API.prototype._getBaseUrl = function () {
        var dsn = this._dsnObject;
        var protocol = dsn.protocol ? dsn.protocol + ":" : '';
        var port = dsn.port ? ":" + dsn.port : '';
        return protocol + "//" + dsn.host + port;
    };
    /** Returns only the path component for the store endpoint. */
    API.prototype.getStoreEndpointPath = function () {
        var dsn = this._dsnObject;
        return (dsn.path ? "/" + dsn.path : '') + "/api/" + dsn.projectId + "/store/";
    };
    /** Returns an object that can be used in request headers. */
    API.prototype.getRequestHeaders = function (clientName, clientVersion) {
        var dsn = this._dsnObject;
        var header = ["Sentry sentry_version=" + SENTRY_API_VERSION];
        header.push("sentry_timestamp=" + new Date().getTime());
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
        var endpoint = "" + this._getBaseUrl() + (dsn.path ? "/" + dsn.path : '') + "/api/embed/error-page/";
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
    return API;
}());

//# sourceMappingURL=api.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/basebackend.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/basebackend.js ***!
  \*************************************************************************************************/
/*! exports provided: BaseBackend */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseBackend", function() { return BaseBackend; });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _transports_noop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./transports/noop */ "../../../../../node_modules/@sentry/core/esm/transports/noop.js");


/**
 * This is the base implemention of a Backend.
 * @hidden
 */
var BaseBackend = /** @class */ (function () {
    /** Creates a new backend instance. */
    function BaseBackend(options) {
        this._options = options;
        if (!this._options.dsn) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["logger"].warn('No DSN provided, backend will not do anything.');
        }
        this._transport = this._setupTransport();
    }
    /**
     * Sets up the transport so it can be used later to send requests.
     */
    BaseBackend.prototype._setupTransport = function () {
        return new _transports_noop__WEBPACK_IMPORTED_MODULE_1__["NoopTransport"]();
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromException = function (_exception, _hint) {
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SentryError"]('Backend has to implement `eventFromException` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.eventFromMessage = function (_message, _level, _hint) {
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SentryError"]('Backend has to implement `eventFromMessage` method');
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.sendEvent = function (event) {
        this._transport.sendEvent(event).then(null, function (reason) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["logger"].error("Error while sending event: " + reason);
        });
    };
    /**
     * @inheritDoc
     */
    BaseBackend.prototype.getTransport = function () {
        return this._transport;
    };
    return BaseBackend;
}());

//# sourceMappingURL=basebackend.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/baseclient.js":
/*!************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/baseclient.js ***!
  \************************************************************************************************/
/*! exports provided: BaseClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseClient", function() { return BaseClient; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _dsn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dsn */ "../../../../../node_modules/@sentry/core/esm/dsn.js");
/* harmony import */ var _integration__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./integration */ "../../../../../node_modules/@sentry/core/esm/integration.js");




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
var BaseClient = /** @class */ (function () {
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
            this._dsn = new _dsn__WEBPACK_IMPORTED_MODULE_2__["Dsn"](options.dsn);
        }
        if (this._isEnabled()) {
            this._integrations = Object(_integration__WEBPACK_IMPORTED_MODULE_3__["setupIntegrations"])(this._options);
        }
    }
    /**
     * @inheritDoc
     */
    BaseClient.prototype.captureException = function (exception, hint, scope) {
        var _this = this;
        var eventId = hint && hint.event_id;
        this._processing = true;
        this._getBackend()
            .eventFromException(exception, hint)
            .then(function (event) { return _this._processEvent(event, hint, scope); })
            .then(function (finalEvent) {
            // We need to check for finalEvent in case beforeSend returned null
            eventId = finalEvent && finalEvent.event_id;
            _this._processing = false;
        })
            .then(null, function (reason) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].error(reason);
            _this._processing = false;
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
        var promisedEvent = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["isPrimitive"])(message)
            ? this._getBackend().eventFromMessage("" + message, level, hint)
            : this._getBackend().eventFromException(message, hint);
        promisedEvent
            .then(function (event) { return _this._processEvent(event, hint, scope); })
            .then(function (finalEvent) {
            // We need to check for finalEvent in case beforeSend returned null
            eventId = finalEvent && finalEvent.event_id;
            _this._processing = false;
        })
            .then(null, function (reason) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].error(reason);
            _this._processing = false;
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
            _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].error(reason);
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
     * @inheritDoc
     */
    BaseClient.prototype.getIntegrations = function () {
        return this._integrations || {};
    };
    /**
     * @inheritDoc
     */
    BaseClient.prototype.getIntegration = function (integration) {
        try {
            return this._integrations[integration.id] || null;
        }
        catch (_oO) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].warn("Cannot retrieve integration " + integration.id + " from the current Client");
            return null;
        }
    };
    /** Waits for the client to be done with processing. */
    BaseClient.prototype._isClientProcessing = function (timeout) {
        var _this = this;
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"](function (resolve) {
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
     * @param hint May contain additional informartion about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A new event with more information.
     */
    BaseClient.prototype._prepareEvent = function (event, scope, hint) {
        var _a = this.getOptions(), environment = _a.environment, release = _a.release, dist = _a.dist, _b = _a.maxValueLength, maxValueLength = _b === void 0 ? 250 : _b;
        var prepared = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event);
        if (prepared.environment === undefined && environment !== undefined) {
            prepared.environment = environment;
        }
        if (prepared.release === undefined && release !== undefined) {
            prepared.release = release;
        }
        if (prepared.dist === undefined && dist !== undefined) {
            prepared.dist = dist;
        }
        if (prepared.message) {
            prepared.message = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["truncate"])(prepared.message, maxValueLength);
        }
        var exception = prepared.exception && prepared.exception.values && prepared.exception.values[0];
        if (exception && exception.value) {
            exception.value = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["truncate"])(exception.value, maxValueLength);
        }
        var request = prepared.request;
        if (request && request.url) {
            request.url = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["truncate"])(request.url, maxValueLength);
        }
        if (prepared.event_id === undefined) {
            prepared.event_id = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["uuid4"])();
        }
        this._addIntegrations(prepared.sdk);
        // We prepare the result here with a resolved Event.
        var result = _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].resolve(prepared);
        // This should be the last thing called, since we want that
        // {@link Hub.addEventProcessor} gets the finished prepared event.
        if (scope) {
            // In case we have a hub we reassign it.
            result = scope.applyToEvent(prepared, hint);
        }
        return result;
    };
    /**
     * This function adds all used integrations to the SDK info in the event.
     * @param sdkInfo The sdkInfo of the event that will be filled with all integrations.
     */
    BaseClient.prototype._addIntegrations = function (sdkInfo) {
        var integrationsArray = Object.keys(this._integrations);
        if (sdkInfo && integrationsArray.length > 0) {
            sdkInfo.integrations = integrationsArray;
        }
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
     * @param hint May contain additional informartion about the original exception.
     * @param scope A scope containing event metadata.
     * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
     */
    BaseClient.prototype._processEvent = function (event, hint, scope) {
        var _this = this;
        var _a = this.getOptions(), beforeSend = _a.beforeSend, sampleRate = _a.sampleRate;
        if (!this._isEnabled()) {
            return _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].reject('SDK not enabled, will not send event.');
        }
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        if (typeof sampleRate === 'number' && Math.random() > sampleRate) {
            return _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].reject('This event has been sampled, will not send event.');
        }
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"](function (resolve, reject) {
            _this._prepareEvent(event, scope, hint)
                .then(function (prepared) {
                if (prepared === null) {
                    reject('An event processor returned null, will not send event.');
                    return;
                }
                var finalEvent = prepared;
                try {
                    var isInternalException = hint && hint.data && hint.data.__sentry__ === true;
                    if (isInternalException || !beforeSend) {
                        _this._getBackend().sendEvent(finalEvent);
                        resolve(finalEvent);
                        return;
                    }
                    var beforeSendResult = beforeSend(prepared, hint);
                    if (typeof beforeSendResult === 'undefined') {
                        _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].error('`beforeSend` method has to return `null` or a valid event.');
                    }
                    else if (Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["isThenable"])(beforeSendResult)) {
                        _this._handleAsyncBeforeSend(beforeSendResult, resolve, reject);
                    }
                    else {
                        finalEvent = beforeSendResult;
                        if (finalEvent === null) {
                            _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].log('`beforeSend` returned `null`, will not send event.');
                            resolve(null);
                            return;
                        }
                        // From here on we are really async
                        _this._getBackend().sendEvent(finalEvent);
                        resolve(finalEvent);
                    }
                }
                catch (exception) {
                    _this.captureException(exception, {
                        data: {
                            __sentry__: true,
                        },
                        originalException: exception,
                    });
                    reject('`beforeSend` threw an error, will not send event.');
                }
            })
                .then(null, function () {
                reject('`beforeSend` threw an error, will not send event.');
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
            _this._getBackend().sendEvent(processedEvent);
            resolve(processedEvent);
        })
            .then(null, function (e) {
            reject("beforeSend rejected with " + e);
        });
    };
    return BaseClient;
}());

//# sourceMappingURL=baseclient.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/dsn.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/dsn.js ***!
  \*****************************************************************************************/
/*! exports provided: Dsn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dsn", function() { return Dsn; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");


/** Regular expression used to parse a Dsn. */
var DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+))?@)([\w\.-]+)(?::(\d+))?\/(.+)/;
/** Error message */
var ERROR_MESSAGE = 'Invalid Dsn';
/** The Sentry Dsn, identifying a Sentry instance and project. */
var Dsn = /** @class */ (function () {
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
     * component. To get the deprecated private _representation, set `withPassword`
     * to true.
     *
     * @param withPassword When set to true, the password will be included.
     */
    Dsn.prototype.toString = function (withPassword) {
        if (withPassword === void 0) { withPassword = false; }
        // tslint:disable-next-line:no-this-assignment
        var _a = this, host = _a.host, path = _a.path, pass = _a.pass, port = _a.port, projectId = _a.projectId, protocol = _a.protocol, user = _a.user;
        return (protocol + "://" + user + (withPassword && pass ? ":" + pass : '') +
            ("@" + host + (port ? ":" + port : '') + "/" + (path ? path + "/" : path) + projectId));
    };
    /** Parses a string into this Dsn. */
    Dsn.prototype._fromString = function (str) {
        var match = DSN_REGEX.exec(str);
        if (!match) {
            throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SentryError"](ERROR_MESSAGE);
        }
        var _a = tslib__WEBPACK_IMPORTED_MODULE_0__["__read"](match.slice(1), 6), protocol = _a[0], user = _a[1], _b = _a[2], pass = _b === void 0 ? '' : _b, host = _a[3], _c = _a[4], port = _c === void 0 ? '' : _c, lastPath = _a[5];
        var path = '';
        var projectId = lastPath;
        var split = projectId.split('/');
        if (split.length > 1) {
            path = split.slice(0, -1).join('/');
            projectId = split.pop();
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
                throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SentryError"](ERROR_MESSAGE);
            }
        });
        if (this.protocol !== 'http' && this.protocol !== 'https') {
            throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SentryError"](ERROR_MESSAGE);
        }
        if (this.port && isNaN(parseInt(this.port, 10))) {
            throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SentryError"](ERROR_MESSAGE);
        }
    };
    return Dsn;
}());

//# sourceMappingURL=dsn.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/index.js":
/*!*******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/index.js ***!
  \*******************************************************************************************/
/*! exports provided: addBreadcrumb, captureException, captureEvent, captureMessage, configureScope, setContext, setExtra, setExtras, setTag, setTags, setUser, withScope, addGlobalEventProcessor, getCurrentHub, getHubFromCarrier, Hub, Scope, Span, API, BaseClient, BaseBackend, Dsn, initAndBind, NoopTransport, Integrations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/minimal */ "../../../../../node_modules/@sentry/minimal/esm/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addBreadcrumb", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["addBreadcrumb"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "captureException", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["captureException"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "captureEvent", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["captureEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "captureMessage", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["captureMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "configureScope", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["configureScope"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setContext", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["setContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setExtra", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["setExtra"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setExtras", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["setExtras"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTag", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["setTag"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTags", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["setTags"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setUser", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["setUser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withScope", function() { return _sentry_minimal__WEBPACK_IMPORTED_MODULE_0__["withScope"]; });

/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addGlobalEventProcessor", function() { return _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["addGlobalEventProcessor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentHub", function() { return _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHubFromCarrier", function() { return _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["getHubFromCarrier"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Hub", function() { return _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["Hub"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Scope", function() { return _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["Scope"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Span", function() { return _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["Span"]; });

/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./api */ "../../../../../node_modules/@sentry/core/esm/api.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "API", function() { return _api__WEBPACK_IMPORTED_MODULE_2__["API"]; });

/* harmony import */ var _baseclient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./baseclient */ "../../../../../node_modules/@sentry/core/esm/baseclient.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseClient", function() { return _baseclient__WEBPACK_IMPORTED_MODULE_3__["BaseClient"]; });

/* harmony import */ var _basebackend__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./basebackend */ "../../../../../node_modules/@sentry/core/esm/basebackend.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseBackend", function() { return _basebackend__WEBPACK_IMPORTED_MODULE_4__["BaseBackend"]; });

/* harmony import */ var _dsn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dsn */ "../../../../../node_modules/@sentry/core/esm/dsn.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Dsn", function() { return _dsn__WEBPACK_IMPORTED_MODULE_5__["Dsn"]; });

/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sdk */ "../../../../../node_modules/@sentry/core/esm/sdk.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "initAndBind", function() { return _sdk__WEBPACK_IMPORTED_MODULE_6__["initAndBind"]; });

/* harmony import */ var _transports_noop__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./transports/noop */ "../../../../../node_modules/@sentry/core/esm/transports/noop.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NoopTransport", function() { return _transports_noop__WEBPACK_IMPORTED_MODULE_7__["NoopTransport"]; });

/* harmony import */ var _integrations__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./integrations */ "../../../../../node_modules/@sentry/core/esm/integrations/index.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Integrations", function() { return _integrations__WEBPACK_IMPORTED_MODULE_8__; });










//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/integration.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integration.js ***!
  \*************************************************************************************************/
/*! exports provided: installedIntegrations, getIntegrationsToSetup, setupIntegration, setupIntegrations */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "installedIntegrations", function() { return installedIntegrations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getIntegrationsToSetup", function() { return getIntegrationsToSetup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupIntegration", function() { return setupIntegration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setupIntegrations", function() { return setupIntegrations; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");



var installedIntegrations = [];
/** Gets integration to install */
function getIntegrationsToSetup(options) {
    var defaultIntegrations = (options.defaultIntegrations && tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](options.defaultIntegrations)) || [];
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
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](defaultIntegrations);
    }
    return integrations;
}
/** Setup given integration */
function setupIntegration(integration) {
    if (installedIntegrations.indexOf(integration.name) !== -1) {
        return;
    }
    integration.setupOnce(_sentry_hub__WEBPACK_IMPORTED_MODULE_1__["addGlobalEventProcessor"], _sentry_hub__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"]);
    installedIntegrations.push(integration.name);
    _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].log("Integration installed: " + integration.name);
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/integrations/functiontostring.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/functiontostring.js ***!
  \*******************************************************************************************************************/
/*! exports provided: FunctionToString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FunctionToString", function() { return FunctionToString; });
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
        originalFunctionToString = Function.prototype.toString;
        Function.prototype.toString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var context = this.__sentry__ ? this.__sentry_original__ : this;
            // tslint:disable-next-line:no-unsafe-any
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/integrations/inboundfilters.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/inboundfilters.js ***!
  \*****************************************************************************************************************/
/*! exports provided: InboundFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InboundFilters", function() { return InboundFilters; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");



// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
var DEFAULT_IGNORE_ERRORS = [/^Script error\.?$/, /^Javascript error: Script error\.? on line 0$/];
/** Inbound filters configurable by the user */
var InboundFilters = /** @class */ (function () {
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
        Object(_sentry_hub__WEBPACK_IMPORTED_MODULE_1__["addGlobalEventProcessor"])(function (event) {
            var hub = Object(_sentry_hub__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])();
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
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].warn("Event dropped due to being internal Sentry Error.\nEvent: " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["getEventDescription"])(event));
            return true;
        }
        if (this._isIgnoredError(event, options)) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].warn("Event dropped due to being matched by `ignoreErrors` option.\nEvent: " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["getEventDescription"])(event));
            return true;
        }
        if (this._isBlacklistedUrl(event, options)) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].warn("Event dropped due to being matched by `blacklistUrls` option.\nEvent: " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["getEventDescription"])(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        if (!this._isWhitelistedUrl(event, options)) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].warn("Event dropped due to not being matched by `whitelistUrls` option.\nEvent: " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["getEventDescription"])(event) + ".\nUrl: " + this._getEventFilterUrl(event));
            return true;
        }
        return false;
    };
    /** JSDoc */
    InboundFilters.prototype._isSentryError = function (event, options) {
        if (options === void 0) { options = {}; }
        if (!options.ignoreInternal) {
            return false;
        }
        try {
            // tslint:disable-next-line:no-unsafe-any
            return event.exception.values[0].type === 'SentryError';
        }
        catch (_oO) {
            return false;
        }
    };
    /** JSDoc */
    InboundFilters.prototype._isIgnoredError = function (event, options) {
        if (options === void 0) { options = {}; }
        if (!options.ignoreErrors || !options.ignoreErrors.length) {
            return false;
        }
        return this._getPossibleEventMessages(event).some(function (message) {
            // Not sure why TypeScript complains here...
            return options.ignoreErrors.some(function (pattern) { return Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["isMatchingPattern"])(message, pattern); });
        });
    };
    /** JSDoc */
    InboundFilters.prototype._isBlacklistedUrl = function (event, options) {
        if (options === void 0) { options = {}; }
        // TODO: Use Glob instead?
        if (!options.blacklistUrls || !options.blacklistUrls.length) {
            return false;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? false : options.blacklistUrls.some(function (pattern) { return Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["isMatchingPattern"])(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._isWhitelistedUrl = function (event, options) {
        if (options === void 0) { options = {}; }
        // TODO: Use Glob instead?
        if (!options.whitelistUrls || !options.whitelistUrls.length) {
            return true;
        }
        var url = this._getEventFilterUrl(event);
        return !url ? true : options.whitelistUrls.some(function (pattern) { return Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["isMatchingPattern"])(url, pattern); });
    };
    /** JSDoc */
    InboundFilters.prototype._mergeOptions = function (clientOptions) {
        if (clientOptions === void 0) { clientOptions = {}; }
        return {
            blacklistUrls: tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"]((this._options.blacklistUrls || []), (clientOptions.blacklistUrls || [])),
            ignoreErrors: tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"]((this._options.ignoreErrors || []), (clientOptions.ignoreErrors || []), DEFAULT_IGNORE_ERRORS),
            ignoreInternal: typeof this._options.ignoreInternal !== 'undefined' ? this._options.ignoreInternal : true,
            whitelistUrls: tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"]((this._options.whitelistUrls || []), (clientOptions.whitelistUrls || [])),
        };
    };
    /** JSDoc */
    InboundFilters.prototype._getPossibleEventMessages = function (event) {
        if (event.message) {
            return [event.message];
        }
        if (event.exception) {
            try {
                // tslint:disable-next-line:no-unsafe-any
                var _a = event.exception.values[0], type = _a.type, value = _a.value;
                return ["" + value, type + ": " + value];
            }
            catch (oO) {
                _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].error("Cannot extract message for event " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["getEventDescription"])(event));
                return [];
            }
        }
        return [];
    };
    /** JSDoc */
    InboundFilters.prototype._getEventFilterUrl = function (event) {
        try {
            if (event.stacktrace) {
                // tslint:disable:no-unsafe-any
                var frames_1 = event.stacktrace.frames;
                return frames_1[frames_1.length - 1].filename;
            }
            if (event.exception) {
                // tslint:disable:no-unsafe-any
                var frames_2 = event.exception.values[0].stacktrace.frames;
                return frames_2[frames_2.length - 1].filename;
            }
            return null;
        }
        catch (oO) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].error("Cannot extract url for event " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_2__["getEventDescription"])(event));
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/integrations/index.js":
/*!********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/integrations/index.js ***!
  \********************************************************************************************************/
/*! exports provided: FunctionToString, InboundFilters */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _functiontostring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./functiontostring */ "../../../../../node_modules/@sentry/core/esm/integrations/functiontostring.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FunctionToString", function() { return _functiontostring__WEBPACK_IMPORTED_MODULE_0__["FunctionToString"]; });

/* harmony import */ var _inboundfilters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./inboundfilters */ "../../../../../node_modules/@sentry/core/esm/integrations/inboundfilters.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "InboundFilters", function() { return _inboundfilters__WEBPACK_IMPORTED_MODULE_1__["InboundFilters"]; });



//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/sdk.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/sdk.js ***!
  \*****************************************************************************************/
/*! exports provided: initAndBind */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initAndBind", function() { return initAndBind; });
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");


/**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instanciate.
 * @param options Options to pass to the client.
 */
function initAndBind(clientClass, options) {
    if (options.debug === true) {
        _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].enable();
    }
    Object(_sentry_hub__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])().bindClient(new clientClass(options));
}
//# sourceMappingURL=sdk.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/core/esm/transports/noop.js":
/*!*****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/core/esm/transports/noop.js ***!
  \*****************************************************************************************************/
/*! exports provided: NoopTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoopTransport", function() { return NoopTransport; });
/* harmony import */ var _sentry_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/types */ "../../../../../node_modules/@sentry/types/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");


/** Noop transport */
var NoopTransport = /** @class */ (function () {
    function NoopTransport() {
    }
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.sendEvent = function (_) {
        return _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].resolve({
            reason: "NoopTransport: Event has been skipped because no Dsn is configured.",
            status: _sentry_types__WEBPACK_IMPORTED_MODULE_0__["Status"].Skipped,
        });
    };
    /**
     * @inheritDoc
     */
    NoopTransport.prototype.close = function (_) {
        return _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].resolve(true);
    };
    return NoopTransport;
}());

//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/hub/esm/hub.js":
/*!****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/hub.js ***!
  \****************************************************************************************/
/*! exports provided: API_VERSION, Hub, getMainCarrier, makeMain, getCurrentHub, getHubFromCarrier, setHubOnCarrier */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API_VERSION", function() { return API_VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Hub", function() { return Hub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMainCarrier", function() { return getMainCarrier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeMain", function() { return makeMain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentHub", function() { return getCurrentHub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHubFromCarrier", function() { return getHubFromCarrier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setHubOnCarrier", function() { return setHubOnCarrier; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scope */ "../../../../../node_modules/@sentry/hub/esm/scope.js");



/**
 * API compatibility version of this hub.
 *
 * WARNING: This number should only be incresed when the global interface
 * changes a and new methods are introduced.
 *
 * @hidden
 */
var API_VERSION = 3;
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */
var DEFAULT_BREADCRUMBS = 30;
/**
 * Absolute maximum number of breadcrumbs added to an event. The
 * `maxBreadcrumbs` option cannot be higher than this value.
 */
var MAX_BREADCRUMBS = 100;
/**
 * @inheritDoc
 */
var Hub = /** @class */ (function () {
    /**
     * Creates a new instance of the hub, will push one {@link Layer} into the
     * internal stack on creation.
     *
     * @param client bound to the hub.
     * @param scope bound to the hub.
     * @param version number, higher number means higher priority.
     */
    function Hub(client, scope, _version) {
        if (scope === void 0) { scope = new _scope__WEBPACK_IMPORTED_MODULE_2__["Scope"](); }
        if (_version === void 0) { _version = API_VERSION; }
        this._version = _version;
        /** Is a {@link Layer}[] containing the client and scope */
        this._stack = [];
        this._stack.push({ client: client, scope: scope });
    }
    /**
     * Internal helper function to call a method on the top client if it exists.
     *
     * @param method The method to call on the client.
     * @param args Arguments to pass to the client function.
     */
    Hub.prototype._invokeClient = function (method) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var top = this.getStackTop();
        if (top && top.client && top.client[method]) {
            (_a = top.client)[method].apply(_a, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](args, [top.scope]));
        }
    };
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
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.pushScope = function () {
        // We want to clone the content of prev scope
        var stack = this.getStack();
        var parentScope = stack.length > 0 ? stack[stack.length - 1].scope : undefined;
        var scope = _scope__WEBPACK_IMPORTED_MODULE_2__["Scope"].clone(parentScope);
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
    Hub.prototype.captureException = function (exception, hint) {
        var eventId = (this._lastEventId = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["uuid4"])());
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
        this._invokeClient('captureException', exception, tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, finalHint, { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureMessage = function (message, level, hint) {
        var eventId = (this._lastEventId = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["uuid4"])());
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
        this._invokeClient('captureMessage', message, level, tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, finalHint, { event_id: eventId }));
        return eventId;
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.captureEvent = function (event, hint) {
        var eventId = (this._lastEventId = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["uuid4"])());
        this._invokeClient('captureEvent', event, tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, hint, { event_id: eventId }));
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
        var _a = (top.client.getOptions && top.client.getOptions()) || {}, _b = _a.beforeBreadcrumb, beforeBreadcrumb = _b === void 0 ? null : _b, _c = _a.maxBreadcrumbs, maxBreadcrumbs = _c === void 0 ? DEFAULT_BREADCRUMBS : _c;
        if (maxBreadcrumbs <= 0) {
            return;
        }
        var timestamp = new Date().getTime() / 1000;
        var mergedBreadcrumb = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({ timestamp: timestamp }, breadcrumb);
        var finalBreadcrumb = beforeBreadcrumb
            ? Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["consoleSandbox"])(function () { return beforeBreadcrumb(mergedBreadcrumb, hint); })
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
            _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["logger"].warn("Cannot retrieve integration " + integration.id + " from the current Hub");
            return null;
        }
    };
    /**
     * @inheritDoc
     */
    Hub.prototype.traceHeaders = function () {
        var top = this.getStackTop();
        if (top.scope && top.client) {
            var span = top.scope.getSpan();
            if (span) {
                return {
                    'sentry-trace': span.toTraceparent(),
                };
            }
        }
        return {};
    };
    return Hub;
}());

/** Returns the global shim registry. */
function getMainCarrier() {
    var carrier = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["getGlobalObject"])();
    carrier.__SENTRY__ = carrier.__SENTRY__ || {
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
function getCurrentHub() {
    // Get main carrier (global for every environment)
    var registry = getMainCarrier();
    // If there's no hub, or its an old API, assign a new one
    if (!hasHubOnCarrier(registry) || getHubFromCarrier(registry).isOlderThan(API_VERSION)) {
        setHubOnCarrier(registry, new Hub());
    }
    // Prefer domains over global if they are there (applicable only to Node environment)
    if (Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["isNodeEnv"])()) {
        return getHubFromActiveDomain(registry);
    }
    // Return hub that lives on a global object
    return getHubFromCarrier(registry);
}
/**
 * Try to read the hub from an active domain, fallback to the registry if one doesnt exist
 * @returns discovered hub
 */
function getHubFromActiveDomain(registry) {
    try {
        // We need to use `dynamicRequire` because `require` on it's own will be optimized by webpack.
        // We do not want this to happen, we need to try to `require` the domain node module and fail if we are in browser
        // for example so we do not have to shim it and use `getCurrentHub` universally.
        var domain = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["dynamicRequire"])(module, 'domain');
        var activeDomain = domain.active;
        // If there no active domain, just return global hub
        if (!activeDomain) {
            return getHubFromCarrier(registry);
        }
        // If there's no hub on current domain, or its an old API, assign a new one
        if (!hasHubOnCarrier(activeDomain) || getHubFromCarrier(activeDomain).isOlderThan(API_VERSION)) {
            var registryHubTopStack = getHubFromCarrier(registry).getStackTop();
            setHubOnCarrier(activeDomain, new Hub(registryHubTopStack.client, _scope__WEBPACK_IMPORTED_MODULE_2__["Scope"].clone(registryHubTopStack.scope)));
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
    carrier.__SENTRY__.hub = new Hub();
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
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/harmony-module.js */ "../../../../../node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ }),

/***/ "../../../../../node_modules/@sentry/hub/esm/index.js":
/*!******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/index.js ***!
  \******************************************************************************************/
/*! exports provided: addGlobalEventProcessor, Scope, getCurrentHub, getHubFromCarrier, getMainCarrier, Hub, makeMain, setHubOnCarrier, Span, TRACEPARENT_REGEXP */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scope__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scope */ "../../../../../node_modules/@sentry/hub/esm/scope.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addGlobalEventProcessor", function() { return _scope__WEBPACK_IMPORTED_MODULE_0__["addGlobalEventProcessor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Scope", function() { return _scope__WEBPACK_IMPORTED_MODULE_0__["Scope"]; });

/* harmony import */ var _hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hub */ "../../../../../node_modules/@sentry/hub/esm/hub.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentHub", function() { return _hub__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHubFromCarrier", function() { return _hub__WEBPACK_IMPORTED_MODULE_1__["getHubFromCarrier"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getMainCarrier", function() { return _hub__WEBPACK_IMPORTED_MODULE_1__["getMainCarrier"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Hub", function() { return _hub__WEBPACK_IMPORTED_MODULE_1__["Hub"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "makeMain", function() { return _hub__WEBPACK_IMPORTED_MODULE_1__["makeMain"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setHubOnCarrier", function() { return _hub__WEBPACK_IMPORTED_MODULE_1__["setHubOnCarrier"]; });

/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../../../../../node_modules/@sentry/hub/esm/span.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Span", function() { return _span__WEBPACK_IMPORTED_MODULE_2__["Span"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TRACEPARENT_REGEXP", function() { return _span__WEBPACK_IMPORTED_MODULE_2__["TRACEPARENT_REGEXP"]; });




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/hub/esm/scope.js":
/*!******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/scope.js ***!
  \******************************************************************************************/
/*! exports provided: Scope, addGlobalEventProcessor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scope", function() { return Scope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addGlobalEventProcessor", function() { return addGlobalEventProcessor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../../../../../node_modules/@sentry/hub/esm/span.js");



/**
 * Holds additional event information. {@link Scope.applyToEvent} will be
 * called by the client before an event will be sent.
 */
var Scope = /** @class */ (function () {
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
        this._context = {};
    }
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
     * This will be called after {@link applyToEvent} is finished.
     */
    Scope.prototype._notifyEventProcessors = function (processors, event, hint, index) {
        var _this = this;
        if (index === void 0) { index = 0; }
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"](function (resolve, reject) {
            var processor = processors[index];
            // tslint:disable-next-line:strict-type-predicates
            if (event === null || typeof processor !== 'function') {
                resolve(event);
            }
            else {
                var result = processor(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event), hint);
                if (Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["isThenable"])(result)) {
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
     * @inheritDoc
     */
    Scope.prototype.setUser = function (user) {
        this._user = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(user);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTags = function (tags) {
        this._tags = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._tags, Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(tags));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTag = function (key, value) {
        var _a;
        this._tags = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._tags, (_a = {}, _a[key] = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(value), _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtras = function (extra) {
        this._extra = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._extra, Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(extra));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setExtra = function (key, extra) {
        var _a;
        this._extra = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._extra, (_a = {}, _a[key] = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(extra), _a));
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setFingerprint = function (fingerprint) {
        this._fingerprint = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(fingerprint);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setLevel = function (level) {
        this._level = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(level);
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setTransaction = function (transaction) {
        this._transaction = transaction;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.setContext = function (name, context) {
        this._context[name] = context ? Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(context) : undefined;
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
    Scope.prototype.startSpan = function (parentSpan) {
        var span = new _span__WEBPACK_IMPORTED_MODULE_2__["Span"]();
        span.setParent(parentSpan);
        this.setSpan(span);
        return span;
    };
    /**
     * Internal getter for Span, used in Hub.
     * @hidden
     */
    Scope.prototype.getSpan = function () {
        return this._span;
    };
    /**
     * Inherit values from the parent scope.
     * @param scope to clone.
     */
    Scope.clone = function (scope) {
        var newScope = new Scope();
        if (scope) {
            newScope._breadcrumbs = tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](scope._breadcrumbs);
            newScope._tags = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, scope._tags);
            newScope._extra = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, scope._extra);
            newScope._context = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, scope._context);
            newScope._user = scope._user;
            newScope._level = scope._level;
            newScope._span = scope._span;
            newScope._transaction = scope._transaction;
            newScope._fingerprint = scope._fingerprint;
            newScope._eventProcessors = tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](scope._eventProcessors);
        }
        return newScope;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.clear = function () {
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._context = {};
        this._level = undefined;
        this._transaction = undefined;
        this._fingerprint = undefined;
        this._span = undefined;
        this._notifyScopeListeners();
        return this;
    };
    /**
     * @inheritDoc
     */
    Scope.prototype.addBreadcrumb = function (breadcrumb, maxBreadcrumbs) {
        var timestamp = new Date().getTime() / 1000;
        var mergedBreadcrumb = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({ timestamp: timestamp }, breadcrumb);
        this._breadcrumbs =
            maxBreadcrumbs !== undefined && maxBreadcrumbs >= 0
                ? tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](this._breadcrumbs, [Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(mergedBreadcrumb)]).slice(-maxBreadcrumbs)
                : tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](this._breadcrumbs, [Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["normalize"])(mergedBreadcrumb)]);
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
            event.extra = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._extra, event.extra);
        }
        if (this._tags && Object.keys(this._tags).length) {
            event.tags = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._tags, event.tags);
        }
        if (this._user && Object.keys(this._user).length) {
            event.user = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._user, event.user);
        }
        if (this._context && Object.keys(this._context).length) {
            event.contexts = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._context, event.contexts);
        }
        if (this._level) {
            event.level = this._level;
        }
        if (this._transaction) {
            event.transaction = this._transaction;
        }
        if (this._span) {
            event.contexts = event.contexts || {};
            event.contexts.trace = this._span;
        }
        this._applyFingerprint(event);
        event.breadcrumbs = tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"]((event.breadcrumbs || []), this._breadcrumbs);
        event.breadcrumbs = event.breadcrumbs.length > 0 ? event.breadcrumbs : undefined;
        return this._notifyEventProcessors(tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](getGlobalEventProcessors(), this._eventProcessors), event, hint);
    };
    return Scope;
}());

/**
 * Retruns the global event processors.
 */
function getGlobalEventProcessors() {
    var global = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["getGlobalObject"])();
    global.__SENTRY__ = global.__SENTRY__ || {};
    global.__SENTRY__.globalEventProcessors = global.__SENTRY__.globalEventProcessors || [];
    return global.__SENTRY__.globalEventProcessors;
}
/**
 * Add a EventProcessor to be kept globally.
 * @param callback EventProcessor to add
 */
function addGlobalEventProcessor(callback) {
    getGlobalEventProcessors().push(callback);
}
//# sourceMappingURL=scope.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/hub/esm/span.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/hub/esm/span.js ***!
  \*****************************************************************************************/
/*! exports provided: TRACEPARENT_REGEXP, Span */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRACEPARENT_REGEXP", function() { return TRACEPARENT_REGEXP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Span", function() { return Span; });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");

var TRACEPARENT_REGEXP = /^[ \t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \t]*$/;
/**
 * Span containg all data about a span
 */
var Span = /** @class */ (function () {
    function Span(_traceId, _spanId, _sampled, _parent) {
        if (_traceId === void 0) { _traceId = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["uuid4"])(); }
        if (_spanId === void 0) { _spanId = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["uuid4"])().substring(16); }
        this._traceId = _traceId;
        this._spanId = _spanId;
        this._sampled = _sampled;
        this._parent = _parent;
    }
    /**
     * Setter for parent
     */
    Span.prototype.setParent = function (parent) {
        this._parent = parent;
        return this;
    };
    /**
     * Setter for sampled
     */
    Span.prototype.setSampled = function (sampled) {
        this._sampled = sampled;
        return this;
    };
    /**
     * Continues a trace
     * @param traceparent Traceparent string
     */
    Span.fromTraceparent = function (traceparent) {
        var matches = traceparent.match(TRACEPARENT_REGEXP);
        if (matches) {
            var sampled = void 0;
            if (matches[3] === '1') {
                sampled = true;
            }
            else if (matches[3] === '0') {
                sampled = false;
            }
            var parent_1 = new Span(matches[1], matches[2], sampled);
            return new Span(matches[1], undefined, sampled, parent_1);
        }
        return undefined;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.toTraceparent = function () {
        var sampled = '';
        if (this._sampled === true) {
            sampled = '-1';
        }
        else if (this._sampled === false) {
            sampled = '-0';
        }
        return this._traceId + "-" + this._spanId + sampled;
    };
    /**
     * @inheritDoc
     */
    Span.prototype.toJSON = function () {
        return {
            parent: (this._parent && this._parent.toJSON()) || undefined,
            sampled: this._sampled,
            span_id: this._spanId,
            trace_id: this._traceId,
        };
    };
    return Span;
}());

//# sourceMappingURL=span.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/minimal/esm/index.js":
/*!**********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/minimal/esm/index.js ***!
  \**********************************************************************************************/
/*! exports provided: captureException, captureMessage, captureEvent, configureScope, addBreadcrumb, setContext, setExtras, setTags, setExtra, setTag, setUser, withScope, _callOnClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captureException", function() { return captureException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captureMessage", function() { return captureMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "captureEvent", function() { return captureEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "configureScope", function() { return configureScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addBreadcrumb", function() { return addBreadcrumb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setContext", function() { return setContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setExtras", function() { return setExtras; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTags", function() { return setTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setExtra", function() { return setExtra; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTag", function() { return setTag; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUser", function() { return setUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withScope", function() { return withScope; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "_callOnClient", function() { return _callOnClient; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");


/**
 * This calls a function on the current hub.
 * @param method function to call on hub.
 * @param args to pass to function.
 */
function callOnHub(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var hub = Object(_sentry_hub__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])();
    if (hub && hub[method]) {
        // tslint:disable-next-line:no-unsafe-any
        return hub[method].apply(hub, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](args));
    }
    throw new Error("No hub defined or " + method + " was not found on the hub, please open a bug report.");
}
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception An exception-like object.
 * @returns The generated eventId.
 */
function captureException(exception) {
    var syntheticException;
    try {
        throw new Error('Sentry syntheticException');
    }
    catch (exception) {
        syntheticException = exception;
    }
    return callOnHub('captureException', exception, {
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
function captureMessage(message, level) {
    var syntheticException;
    try {
        throw new Error(message);
    }
    catch (exception) {
        syntheticException = exception;
    }
    return callOnHub('captureMessage', message, level, {
        originalException: message,
        syntheticException: syntheticException,
    });
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
 * @param context Any kind of data. This data will be normailzed.
 */
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
 * @param extra Any kind of data. This data will be normailzed.
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
 */
function _callOnClient(method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    callOnHub.apply(void 0, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](['_invokeClient', method], args));
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/backend.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/backend.js ***!
  \*********************************************************************************************/
/*! exports provided: NodeBackend */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeBackend", function() { return NodeBackend; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/types */ "../../../../../node_modules/@sentry/types/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _parsers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./parsers */ "../../../../../node_modules/@sentry/node/esm/parsers.js");
/* harmony import */ var _transports__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./transports */ "../../../../../node_modules/@sentry/node/esm/transports/index.js");






/**
 * The Sentry Node SDK Backend.
 * @hidden
 */
var NodeBackend = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](NodeBackend, _super);
    function NodeBackend() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @inheritDoc
     */
    NodeBackend.prototype._setupTransport = function () {
        if (!this._options.dsn) {
            // We return the noop transport here in case there is no Dsn.
            return _super.prototype._setupTransport.call(this);
        }
        var dsn = new _sentry_core__WEBPACK_IMPORTED_MODULE_1__["Dsn"](this._options.dsn);
        var transportOptions = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._options.transportOptions, (this._options.httpProxy && { httpProxy: this._options.httpProxy }), (this._options.httpsProxy && { httpsProxy: this._options.httpsProxy }), (this._options.caCerts && { caCerts: this._options.caCerts }), { dsn: this._options.dsn });
        if (this._options.transport) {
            return new this._options.transport(transportOptions);
        }
        if (dsn.protocol === 'http') {
            return new _transports__WEBPACK_IMPORTED_MODULE_5__["HTTPTransport"](transportOptions);
        }
        return new _transports__WEBPACK_IMPORTED_MODULE_5__["HTTPSTransport"](transportOptions);
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype.eventFromException = function (exception, hint) {
        var _this = this;
        var ex = exception;
        var mechanism = {
            handled: true,
            type: 'generic',
        };
        if (!Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["isError"])(exception)) {
            if (Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["isPlainObject"])(exception)) {
                // This will allow us to group events based on top-level keys
                // which is much better than creating new group when any key/value change
                var message = "Non-Error exception captured with keys: " + Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["extractExceptionKeysForMessage"])(exception);
                Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().configureScope(function (scope) {
                    scope.setExtra('__serialized__', Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["normalizeToSize"])(exception));
                });
                ex = (hint && hint.syntheticException) || new Error(message);
                ex.message = message;
            }
            else {
                // This handles when someone does: `throw "something awesome";`
                // We use synthesized Error here so we can extract a (rough) stack trace.
                ex = (hint && hint.syntheticException) || new Error(exception);
            }
            mechanism.synthetic = true;
        }
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["SyncPromise"](function (resolve, reject) {
            return Object(_parsers__WEBPACK_IMPORTED_MODULE_4__["parseError"])(ex, _this._options)
                .then(function (event) {
                Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["addExceptionTypeValue"])(event, undefined, undefined);
                Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["addExceptionMechanism"])(event, mechanism);
                resolve(tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event, { event_id: hint && hint.event_id }));
            })
                .then(null, reject);
        });
    };
    /**
     * @inheritDoc
     */
    NodeBackend.prototype.eventFromMessage = function (message, level, hint) {
        var _this = this;
        if (level === void 0) { level = _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Severity"].Info; }
        var event = {
            event_id: hint && hint.event_id,
            level: level,
            message: message,
        };
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["SyncPromise"](function (resolve) {
            if (_this._options.attachStacktrace && hint && hint.syntheticException) {
                var stack = hint.syntheticException ? Object(_parsers__WEBPACK_IMPORTED_MODULE_4__["extractStackFromError"])(hint.syntheticException) : [];
                Object(_parsers__WEBPACK_IMPORTED_MODULE_4__["parseStack"])(stack, _this._options)
                    .then(function (frames) {
                    event.stacktrace = {
                        frames: Object(_parsers__WEBPACK_IMPORTED_MODULE_4__["prepareFramesForEvent"])(frames),
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
    return NodeBackend;
}(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["BaseBackend"]));

//# sourceMappingURL=backend.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/client.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/client.js ***!
  \********************************************************************************************/
/*! exports provided: NodeClient */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NodeClient", function() { return NodeClient; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _backend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./backend */ "../../../../../node_modules/@sentry/node/esm/backend.js");
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./version */ "../../../../../node_modules/@sentry/node/esm/version.js");




/**
 * The Sentry Node SDK Client.
 *
 * @see NodeOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
var NodeClient = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](NodeClient, _super);
    /**
     * Creates a new Node SDK instance.
     * @param options Configuration options for this SDK.
     */
    function NodeClient(options) {
        return _super.call(this, _backend__WEBPACK_IMPORTED_MODULE_2__["NodeBackend"], options) || this;
    }
    /**
     * @inheritDoc
     */
    NodeClient.prototype._prepareEvent = function (event, scope, hint) {
        event.platform = event.platform || 'node';
        event.sdk = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event.sdk, { name: _version__WEBPACK_IMPORTED_MODULE_3__["SDK_NAME"], packages: tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](((event.sdk && event.sdk.packages) || []), [
                {
                    name: 'npm:@sentry/node',
                    version: _version__WEBPACK_IMPORTED_MODULE_3__["SDK_VERSION"],
                },
            ]), version: _version__WEBPACK_IMPORTED_MODULE_3__["SDK_VERSION"] });
        if (this.getOptions().serverName) {
            event.server_name = this.getOptions().serverName;
        }
        return _super.prototype._prepareEvent.call(this, event, scope, hint);
    };
    return NodeClient;
}(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["BaseClient"]));

//# sourceMappingURL=client.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/handlers.js":
/*!**********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/handlers.js ***!
  \**********************************************************************************************/
/*! exports provided: parseRequest, requestHandler, errorHandler, defaultOnFatalError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseRequest", function() { return parseRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestHandler", function() { return requestHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "errorHandler", function() { return errorHandler; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultOnFatalError", function() { return defaultOnFatalError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cookie */ "../../../../../node_modules/cookie/index.js");
/* harmony import */ var cookie__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cookie__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! domain */ "domain");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(domain__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./sdk */ "../../../../../node_modules/@sentry/node/esm/sdk.js");









var DEFAULT_SHUTDOWN_TIMEOUT = 2000;
/** JSDoc */
function extractTransaction(req, type) {
    try {
        // Express.js shape
        var request = req;
        switch (type) {
            case 'path': {
                return request.route.path;
            }
            case 'handler': {
                return request.route.stack[0].name;
            }
            case 'methodPath':
            default: {
                var method = request.method.toUpperCase();
                var path = request.route.path;
                return method + "|" + path;
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
                request.cookies = cookie__WEBPACK_IMPORTED_MODULE_4__["parse"](headers.cookie || '');
                break;
            case 'query_string':
                // query string:
                //   node: req.url (raw)
                //   express, koa: req.query
                request.query_string = url__WEBPACK_IMPORTED_MODULE_7__["parse"](originalUrl || '', false).query;
                break;
            case 'data':
                // body data:
                //   node, express, koa: req.body
                var data = req.body;
                if (method === 'GET' || method === 'HEAD') {
                    if (typeof data === 'undefined') {
                        data = '<unavailable>';
                    }
                }
                if (data && !Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["isString"])(data)) {
                    // Make sure the request body is a string
                    data = JSON.stringify(Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["normalize"])(data));
                }
                request.data = data;
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
function extractUserData(req, keys) {
    var user = {};
    var attributes = Array.isArray(keys) ? keys : DEFAULT_USER_KEYS;
    attributes.forEach(function (key) {
        if (req.user && key in req.user) {
            user[key] = req.user[key];
        }
    });
    // client ip:
    //   node: req.connection.remoteAddress
    //   express, koa: req.ip
    var ip = req.ip || (req.connection && req.connection.remoteAddress);
    if (ip) {
        user.ip_address = ip;
    }
    return user;
}
/**
 * Enriches passed event with request data.
 *
 *
 * @param event Will be mutated and enriched with req data
 * @param req Request object
 * @param options object containing flags to enable functionality
 * @hidden
 */
function parseRequest(event, req, options) {
    // tslint:disable-next-line:no-parameter-reassignment
    options = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({ request: true, serverName: true, transaction: true, user: true, version: true }, options);
    if (options.version) {
        event.extra = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event.extra, { node: global.process.version });
    }
    if (options.request) {
        event.request = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event.request, extractRequestData(req, options.request));
    }
    if (options.serverName) {
        event.server_name = global.process.env.SENTRY_NAME || os__WEBPACK_IMPORTED_MODULE_6__["hostname"]();
    }
    if (options.user && req.user) {
        event.user = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event.user, extractUserData(req, options.user));
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
            // tslint:disable-next-line: no-unbound-method
            var _end_1 = res.end;
            res.end = function (chunk, encoding, cb) {
                var _this = this;
                Object(_sdk__WEBPACK_IMPORTED_MODULE_8__["flush"])(options.flushTimeout)
                    .then(function () {
                    _end_1.call(_this, chunk, encoding, cb);
                })
                    .then(null, function (e) {
                    _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["logger"].error(e);
                });
            };
        }
        var local = domain__WEBPACK_IMPORTED_MODULE_5__["create"]();
        local.add(req);
        local.add(res);
        local.on('error', next);
        local.run(function () {
            Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().configureScope(function (scope) {
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
    return function sentryErrorMiddleware(error, _req, _res, next) {
        var shouldHandleError = (options && options.shouldHandleError) || defaultShouldHandleError;
        if (shouldHandleError(error)) {
            Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["withScope"])(function (scope) {
                if (_req.headers && Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["isString"])(_req.headers['sentry-trace'])) {
                    var span = _sentry_hub__WEBPACK_IMPORTED_MODULE_2__["Span"].fromTraceparent(_req.headers['sentry-trace']);
                    scope.setSpan(span);
                }
                var eventId = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["captureException"])(error);
                _res.sentry = eventId;
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
function defaultOnFatalError(error) {
    console.error(error && error.stack ? error.stack : error);
    var client = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().getClient();
    if (client === undefined) {
        _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["logger"].warn('No NodeClient was defined, we are exiting the process now.');
        global.process.exit(1);
        return;
    }
    var options = client.getOptions();
    var timeout = (options && options.shutdownTimeout && options.shutdownTimeout > 0 && options.shutdownTimeout) ||
        DEFAULT_SHUTDOWN_TIMEOUT;
    Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["forget"])(client.close(timeout).then(function (result) {
        if (!result) {
            _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["logger"].warn('We reached the timeout for emptying the request buffer, still exiting now!');
        }
        global.process.exit(1);
    }));
}
//# sourceMappingURL=handlers.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/index.js":
/*!*******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/index.js ***!
  \*******************************************************************************************/
/*! exports provided: Severity, Status, addGlobalEventProcessor, addBreadcrumb, captureException, captureEvent, captureMessage, configureScope, getCurrentHub, getHubFromCarrier, Hub, Scope, setContext, setExtra, setExtras, setTag, setTags, setUser, Span, withScope, NodeClient, defaultIntegrations, init, lastEventId, flush, close, SDK_NAME, SDK_VERSION, Integrations, Transports, Handlers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Integrations", function() { return INTEGRATIONS; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/types */ "../../../../../node_modules/@sentry/types/esm/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Severity", function() { return _sentry_types__WEBPACK_IMPORTED_MODULE_1__["Severity"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Status", function() { return _sentry_types__WEBPACK_IMPORTED_MODULE_1__["Status"]; });

/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addGlobalEventProcessor", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["addGlobalEventProcessor"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addBreadcrumb", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["addBreadcrumb"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "captureException", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["captureException"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "captureEvent", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["captureEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "captureMessage", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["captureMessage"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "configureScope", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["configureScope"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCurrentHub", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["getCurrentHub"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHubFromCarrier", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["getHubFromCarrier"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Hub", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["Hub"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Scope", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["Scope"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setContext", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["setContext"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setExtra", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["setExtra"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setExtras", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["setExtras"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTag", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["setTag"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setTags", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["setTags"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setUser", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["setUser"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Span", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["Span"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withScope", function() { return _sentry_core__WEBPACK_IMPORTED_MODULE_2__["withScope"]; });

/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./client */ "../../../../../node_modules/@sentry/node/esm/client.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NodeClient", function() { return _client__WEBPACK_IMPORTED_MODULE_3__["NodeClient"]; });

/* harmony import */ var _sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sdk */ "../../../../../node_modules/@sentry/node/esm/sdk.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "defaultIntegrations", function() { return _sdk__WEBPACK_IMPORTED_MODULE_4__["defaultIntegrations"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "init", function() { return _sdk__WEBPACK_IMPORTED_MODULE_4__["init"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "lastEventId", function() { return _sdk__WEBPACK_IMPORTED_MODULE_4__["lastEventId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "flush", function() { return _sdk__WEBPACK_IMPORTED_MODULE_4__["flush"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "close", function() { return _sdk__WEBPACK_IMPORTED_MODULE_4__["close"]; });

/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./version */ "../../../../../node_modules/@sentry/node/esm/version.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SDK_NAME", function() { return _version__WEBPACK_IMPORTED_MODULE_5__["SDK_NAME"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SDK_VERSION", function() { return _version__WEBPACK_IMPORTED_MODULE_5__["SDK_VERSION"]; });

/* harmony import */ var _handlers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./handlers */ "../../../../../node_modules/@sentry/node/esm/handlers.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Handlers", function() { return _handlers__WEBPACK_IMPORTED_MODULE_6__; });
/* harmony import */ var _integrations__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./integrations */ "../../../../../node_modules/@sentry/node/esm/integrations/index.js");
/* harmony import */ var _transports__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./transports */ "../../../../../node_modules/@sentry/node/esm/transports/index.js");
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "Transports", function() { return _transports__WEBPACK_IMPORTED_MODULE_8__; });










var INTEGRATIONS = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, _sentry_core__WEBPACK_IMPORTED_MODULE_2__["Integrations"], _integrations__WEBPACK_IMPORTED_MODULE_7__);

//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/console.js":
/*!**********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/console.js ***!
  \**********************************************************************************************************/
/*! exports provided: Console */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Console", function() { return Console; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/types */ "../../../../../node_modules/@sentry/types/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! util */ "util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_4__);





/** Console module integration */
var Console = /** @class */ (function () {
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
        var nativeModule = __webpack_require__(/*! module */ "module");
        Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["fill"])(nativeModule, '_load', loadWrapper(nativeModule));
        // special case: since console is built-in and app-level code won't require() it, do that here
        __webpack_require__(/*! console */ "console");
    };
    /**
     * @inheritDoc
     */
    Console.id = 'Console';
    return Console;
}());

/**
 * Wrapper function for internal _load calls within `require`
 */
function loadWrapper(nativeModule) {
    // We need to use some functional-style currying to pass values around
    // as we cannot rely on `bind`, because this has to preserve correct
    // context for native calls
    return function (originalLoad) {
        return function (moduleId) {
            var originalModule = originalLoad.apply(nativeModule, arguments);
            if (moduleId !== 'console' || originalModule.__sentry__) {
                return originalModule;
            }
            ['debug', 'info', 'warn', 'error', 'log'].forEach(consoleWrapper(originalModule));
            originalModule.__sentry__ = true;
            return originalModule;
        };
    };
}
/**
 * Wrapper function that'll be used for every console level
 */
function consoleWrapper(originalModule) {
    return function (level) {
        if (!(level in originalModule)) {
            return;
        }
        Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["fill"])(originalModule, level, function (originalConsoleLevel) {
            var sentryLevel;
            switch (level) {
                case 'debug':
                    sentryLevel = _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Severity"].Debug;
                    break;
                case 'error':
                    sentryLevel = _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Severity"].Error;
                    break;
                case 'info':
                    sentryLevel = _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Severity"].Info;
                    break;
                case 'warn':
                    sentryLevel = _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Severity"].Warning;
                    break;
                default:
                    sentryLevel = _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Severity"].Log;
            }
            return function () {
                if (Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().getIntegration(Console)) {
                    Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().addBreadcrumb({
                        category: 'console',
                        level: sentryLevel,
                        message: util__WEBPACK_IMPORTED_MODULE_4__["format"].apply(undefined, arguments),
                    }, {
                        input: tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](arguments),
                        level: level,
                    });
                }
                originalConsoleLevel.apply(originalModule, arguments);
            };
        });
    };
}
//# sourceMappingURL=console.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/http.js":
/*!*******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/http.js ***!
  \*******************************************************************************************************/
/*! exports provided: Http */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Http", function() { return Http; });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! util */ "util");
/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_2__);



var lastResponse;
/** http module integration */
var Http = /** @class */ (function () {
    function Http() {
        /**
         * @inheritDoc
         */
        this.name = Http.id;
    }
    /**
     * @inheritDoc
     */
    Http.prototype.setupOnce = function () {
        var nativeModule = __webpack_require__(/*! module */ "module");
        Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["fill"])(nativeModule, '_load', loadWrapper(nativeModule));
        // observation: when the https module does its own require('http'), it *does not* hit our hooked require to instrument http on the fly
        // but if we've previously instrumented http, https *does* get our already-instrumented version
        // this is because raven's transports are required before this instrumentation takes place, which loads https (and http)
        // so module cache will have uninstrumented http; proactively loading it here ensures instrumented version is in module cache
        // alternatively we could refactor to load our transports later, but this is easier and doesn't have much drawback
        __webpack_require__(/*! http */ "http");
    };
    /**
     * @inheritDoc
     */
    Http.id = 'Http';
    return Http;
}());

/**
 * Function that can combine together a url that'll be used for our breadcrumbs.
 *
 * @param options url that should be returned or an object containing it's parts.
 * @returns constructed url
 */
function createBreadcrumbUrl(options) {
    // We could just always reconstruct this from this.agent, this._headers, this.path, etc
    // but certain other http-instrumenting libraries (like nock, which we use for tests) fail to
    // maintain the guarantee that after calling origClientRequest, those fields will be populated
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
 * Wrapper function for internal _load calls within `require`
 */
function loadWrapper(nativeModule) {
    // We need to use some functional-style currying to pass values around
    // as we cannot rely on `bind`, because this has to preserve correct
    // context for native calls
    return function (originalLoad) {
        return function (moduleId) {
            var originalModule = originalLoad.apply(nativeModule, arguments);
            if (moduleId !== 'http' || originalModule.__sentry__) {
                return originalModule;
            }
            var origClientRequest = originalModule.ClientRequest;
            var clientRequest = function (options, callback) {
                // Note: this won't capture a breadcrumb if a response never comes
                // It would be useful to know if that was the case, though, so
                // TODO: revisit to see if we can capture sth indicating response never came
                // possibility: capture one breadcrumb for "req sent" and one for "res recvd"
                // seems excessive but solves the problem and *is* strictly more information
                // could be useful for weird response sequencing bug scenarios
                origClientRequest.call(this, options, callback);
                this.__ravenBreadcrumbUrl = createBreadcrumbUrl(options);
            };
            util__WEBPACK_IMPORTED_MODULE_2__["inherits"](clientRequest, origClientRequest);
            Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["fill"])(clientRequest.prototype, 'emit', emitWrapper);
            Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["fill"])(originalModule, 'ClientRequest', function () {
                return clientRequest;
            });
            // http.request orig refs module-internal ClientRequest, not exported one, so
            // it still points at orig ClientRequest after our monkeypatch; these reimpls
            // just get that reference updated to use our new ClientRequest
            Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["fill"])(originalModule, 'request', function () {
                return function (options, callback) {
                    return new originalModule.ClientRequest(options, callback);
                };
            });
            Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_1__["fill"])(originalModule, 'get', function () {
                return function (options, callback) {
                    var req = originalModule.request(options, callback);
                    req.end();
                    return req;
                };
            });
            originalModule.__sentry__ = true;
            return originalModule;
        };
    };
}
/**
 * Wrapper function for request's `emit` calls
 */
function emitWrapper(origEmit) {
    return function (event, response) {
        // I'm not sure why but Node.js (at least in v8.X)
        // is emitting all events twice :|
        if (lastResponse === undefined || lastResponse !== response) {
            lastResponse = response;
        }
        else {
            return origEmit.apply(this, arguments);
        }
        var client = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])().getClient();
        if (client) {
            var dsn = client.getDsn();
            var isInterestingEvent = event === 'response' || event === 'error';
            var isNotSentryRequest = dsn && this.__ravenBreadcrumbUrl && this.__ravenBreadcrumbUrl.indexOf(dsn.host) === -1;
            if (isInterestingEvent && isNotSentryRequest && Object(_sentry_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])().getIntegration(Http)) {
                Object(_sentry_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])().addBreadcrumb({
                    category: 'http',
                    data: {
                        method: this.method,
                        status_code: response.statusCode,
                        url: this.__ravenBreadcrumbUrl,
                    },
                    type: 'http',
                }, {
                    event: event,
                    request: this,
                    response: response,
                });
            }
        }
        return origEmit.apply(this, arguments);
    };
}
//# sourceMappingURL=http.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/index.js":
/*!********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/index.js ***!
  \********************************************************************************************************/
/*! exports provided: Console, Http, OnUncaughtException, OnUnhandledRejection, LinkedErrors, Modules */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _console__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./console */ "../../../../../node_modules/@sentry/node/esm/integrations/console.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Console", function() { return _console__WEBPACK_IMPORTED_MODULE_0__["Console"]; });

/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./http */ "../../../../../node_modules/@sentry/node/esm/integrations/http.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Http", function() { return _http__WEBPACK_IMPORTED_MODULE_1__["Http"]; });

/* harmony import */ var _onuncaughtexception__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./onuncaughtexception */ "../../../../../node_modules/@sentry/node/esm/integrations/onuncaughtexception.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OnUncaughtException", function() { return _onuncaughtexception__WEBPACK_IMPORTED_MODULE_2__["OnUncaughtException"]; });

/* harmony import */ var _onunhandledrejection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./onunhandledrejection */ "../../../../../node_modules/@sentry/node/esm/integrations/onunhandledrejection.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "OnUnhandledRejection", function() { return _onunhandledrejection__WEBPACK_IMPORTED_MODULE_3__["OnUnhandledRejection"]; });

/* harmony import */ var _linkederrors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./linkederrors */ "../../../../../node_modules/@sentry/node/esm/integrations/linkederrors.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LinkedErrors", function() { return _linkederrors__WEBPACK_IMPORTED_MODULE_4__["LinkedErrors"]; });

/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modules */ "../../../../../node_modules/@sentry/node/esm/integrations/modules.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Modules", function() { return _modules__WEBPACK_IMPORTED_MODULE_5__["Modules"]; });







//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/linkederrors.js":
/*!***************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/linkederrors.js ***!
  \***************************************************************************************************************/
/*! exports provided: LinkedErrors */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinkedErrors", function() { return LinkedErrors; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _parsers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../parsers */ "../../../../../node_modules/@sentry/node/esm/parsers.js");




var DEFAULT_KEY = 'cause';
var DEFAULT_LIMIT = 5;
/** Adds SDK info to an event. */
var LinkedErrors = /** @class */ (function () {
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
        Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["addGlobalEventProcessor"])(function (event, hint) {
            var self = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().getIntegration(LinkedErrors);
            if (self) {
                return self.handler(event, hint);
            }
            return event;
        });
    };
    /**
     * @inheritDoc
     */
    LinkedErrors.prototype.handler = function (event, hint) {
        var _this = this;
        if (!event.exception || !event.exception.values || !hint || !(hint.originalException instanceof Error)) {
            return _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["SyncPromise"].resolve(event);
        }
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["SyncPromise"](function (resolve) {
            _this.walkErrorTree(hint.originalException, _this._key)
                .then(function (linkedErrors) {
                if (event && event.exception && event.exception.values) {
                    event.exception.values = tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"](linkedErrors, event.exception.values);
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
    LinkedErrors.prototype.walkErrorTree = function (error, key, stack) {
        var _this = this;
        if (stack === void 0) { stack = []; }
        if (!(error[key] instanceof Error) || stack.length + 1 >= this._limit) {
            return _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["SyncPromise"].resolve(stack);
        }
        return new _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["SyncPromise"](function (resolve, reject) {
            Object(_parsers__WEBPACK_IMPORTED_MODULE_3__["getExceptionFromError"])(error[key])
                .then(function (exception) {
                _this.walkErrorTree(error[key], key, tslib__WEBPACK_IMPORTED_MODULE_0__["__spread"]([exception], stack))
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/modules.js":
/*!**********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/modules.js ***!
  \**********************************************************************************************************/
/*! exports provided: Modules */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modules", function() { return Modules; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);



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
            dir = Object(path__WEBPACK_IMPORTED_MODULE_2__["dirname"])(orig);
            if (!dir || orig === dir || seen[orig]) {
                return undefined;
            }
            if (mainPaths.indexOf(dir) < 0) {
                return updir();
            }
            var pkgfile = Object(path__WEBPACK_IMPORTED_MODULE_2__["join"])(orig, 'package.json');
            seen[orig] = true;
            if (!Object(fs__WEBPACK_IMPORTED_MODULE_1__["existsSync"])(pkgfile)) {
                return updir();
            }
            try {
                var info = JSON.parse(Object(fs__WEBPACK_IMPORTED_MODULE_1__["readFileSync"])(pkgfile, 'utf8'));
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
var Modules = /** @class */ (function () {
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
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, event, { modules: _this._getModules() });
        });
    };
    /** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */
    Modules.prototype._getModules = function () {
        if (!moduleCache) {
            // tslint:disable-next-line:no-unsafe-any
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/onuncaughtexception.js":
/*!**********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/onuncaughtexception.js ***!
  \**********************************************************************************************************************/
/*! exports provided: OnUncaughtException */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnUncaughtException", function() { return OnUncaughtException; });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/types */ "../../../../../node_modules/@sentry/types/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var _handlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../handlers */ "../../../../../node_modules/@sentry/node/esm/handlers.js");




/** Global Promise Rejection handler */
var OnUncaughtException = /** @class */ (function () {
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
            var onFatalError = _handlers__WEBPACK_IMPORTED_MODULE_3__["defaultOnFatalError"];
            var client = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])().getClient();
            if (_this._options.onFatalError) {
                onFatalError = _this._options.onFatalError;
            }
            else if (client && client.getOptions().onFatalError) {
                onFatalError = client.getOptions().onFatalError;
            }
            if (!caughtFirstError) {
                var hub_1 = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])();
                // this is the first uncaught error and the ultimate reason for shutting down
                // we want to do absolutely everything possible to ensure it gets captured
                // also we want to make sure we don't go recursion crazy if more errors happen after this one
                firstError = error;
                caughtFirstError = true;
                if (hub_1.getIntegration(OnUncaughtException)) {
                    hub_1.withScope(function (scope) {
                        scope.setLevel(_sentry_types__WEBPACK_IMPORTED_MODULE_1__["Severity"].Fatal);
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
                _sentry_utils__WEBPACK_IMPORTED_MODULE_2__["logger"].warn('uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown');
                Object(_handlers__WEBPACK_IMPORTED_MODULE_3__["defaultOnFatalError"])(error);
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/integrations/onunhandledrejection.js":
/*!***********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/integrations/onunhandledrejection.js ***!
  \***********************************************************************************************************************/
/*! exports provided: OnUnhandledRejection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OnUnhandledRejection", function() { return OnUnhandledRejection; });
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");

/** Global Promise Rejection handler */
var OnUnhandledRejection = /** @class */ (function () {
    function OnUnhandledRejection() {
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
    OnUnhandledRejection.prototype.sendUnhandledPromise = function (reason, promise) {
        var hub = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_0__["getCurrentHub"])();
        if (!hub.getIntegration(OnUnhandledRejection)) {
            return;
        }
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
    };
    /**
     * @inheritDoc
     */
    OnUnhandledRejection.id = 'OnUnhandledRejection';
    return OnUnhandledRejection;
}());

//# sourceMappingURL=onunhandledrejection.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/parsers.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/parsers.js ***!
  \*********************************************************************************************/
/*! exports provided: resetFileContentCache, extractStackFromError, parseStack, getExceptionFromError, parseError, prepareFramesForEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetFileContentCache", function() { return resetFileContentCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractStackFromError", function() { return extractStackFromError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseStack", function() { return parseStack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExceptionFromError", function() { return getExceptionFromError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseError", function() { return parseError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prepareFramesForEvent", function() { return prepareFramesForEvent; });
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lru_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lru_map */ "../../../../../node_modules/lru_map/lru.js");
/* harmony import */ var lru_map__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lru_map__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _stacktrace__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stacktrace */ "../../../../../node_modules/@sentry/node/esm/stacktrace.js");




// tslint:disable-next-line:no-unsafe-any
var DEFAULT_LINES_OF_CONTEXT = 7;
var FILE_CONTENT_CACHE = new lru_map__WEBPACK_IMPORTED_MODULE_2__["LRUMap"](100);
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
var mainModule = ((__webpack_require__.c[__webpack_require__.s] && __webpack_require__.c[__webpack_require__.s].filename && Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["dirname"])(__webpack_require__.c[__webpack_require__.s].filename)) ||
    global.process.cwd()) + "/";
/** JSDoc */
function getModule(filename, base) {
    if (!base) {
        base = mainModule; // tslint:disable-line:no-parameter-reassignment
    }
    // It's specifically a module
    var file = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["basename"])(filename, '.js');
    filename = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["dirname"])(filename); // tslint:disable-line:no-parameter-reassignment
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
        return _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"].resolve({});
    }
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"](function (resolve) {
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
                count++;
                // In any case we want to skip here then since we have a content already or we couldn't
                // read the file and don't want to try again.
                if (count === filenames.length) {
                    resolve(sourceFiles);
                }
                return "continue";
            }
            Object(fs__WEBPACK_IMPORTED_MODULE_1__["readFile"])(filename, function (err, data) {
                var content = err ? null : data.toString();
                sourceFiles[filename] = content;
                // We always want to set the cache, even to null which means there was an error reading the file.
                // We do not want to try to read the file again.
                FILE_CONTENT_CACHE.set(filename, content);
                count++;
                if (count === filenames.length) {
                    resolve(sourceFiles);
                }
            });
        };
        // tslint:disable-next-line:prefer-for-of
        for (var i = 0; i < filenames.length; i++) {
            _loop_1(i);
        }
    });
}
/**
 * @hidden
 */
function extractStackFromError(error) {
    var stack = _stacktrace__WEBPACK_IMPORTED_MODULE_3__["parse"](error);
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
            if (!isInternal && linesOfContext > 0) {
                filesToRead.push(parsedFrame.filename);
            }
        }
        return parsedFrame;
    });
    // We do an early return if we do not want to fetch context liens
    if (linesOfContext <= 0) {
        return _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"].resolve(frames);
    }
    try {
        return addPrePostContext(filesToRead, frames, linesOfContext);
    }
    catch (_) {
        // This happens in electron for example where we are not able to read files from asar.
        // So it's fine, we recover be just returning all frames without pre/post context.
        return _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"].resolve(frames);
    }
}
/**
 * This function tries to read the source files + adding pre and post context (source code)
 * to a frame.
 * @param filesToRead string[] of filepaths
 * @param frames StackFrame[] containg all frames
 */
function addPrePostContext(filesToRead, frames, linesOfContext) {
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"](function (resolve) {
        return readSourceFiles(filesToRead).then(function (sourceFiles) {
            var result = frames.map(function (frame) {
                if (frame.filename && sourceFiles[frame.filename]) {
                    try {
                        var lines = sourceFiles[frame.filename].split('\n');
                        frame.pre_context = lines
                            .slice(Math.max(0, (frame.lineno || 0) - (linesOfContext + 1)), (frame.lineno || 0) - 1)
                            .map(function (line) { return Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["snipLine"])(line, 0); });
                        frame.context_line = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["snipLine"])(lines[(frame.lineno || 0) - 1], frame.colno || 0);
                        frame.post_context = lines
                            .slice(frame.lineno || 0, (frame.lineno || 0) + linesOfContext)
                            .map(function (line) { return Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_0__["snipLine"])(line, 0); });
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
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"](function (resolve) {
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
    return new _sentry_utils__WEBPACK_IMPORTED_MODULE_0__["SyncPromise"](function (resolve) {
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/sdk.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/sdk.js ***!
  \*****************************************************************************************/
/*! exports provided: defaultIntegrations, init, lastEventId, flush, close */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultIntegrations", function() { return defaultIntegrations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lastEventId", function() { return lastEventId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flush", function() { return flush; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "close", function() { return close; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_hub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/hub */ "../../../../../node_modules/@sentry/hub/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! domain */ "domain");
/* harmony import */ var domain__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(domain__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _client__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./client */ "../../../../../node_modules/@sentry/node/esm/client.js");
/* harmony import */ var _integrations__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./integrations */ "../../../../../node_modules/@sentry/node/esm/integrations/index.js");







var defaultIntegrations = [
    // Common
    new _sentry_core__WEBPACK_IMPORTED_MODULE_1__["Integrations"].InboundFilters(),
    new _sentry_core__WEBPACK_IMPORTED_MODULE_1__["Integrations"].FunctionToString(),
    // Native Wrappers
    new _integrations__WEBPACK_IMPORTED_MODULE_6__["Console"](),
    new _integrations__WEBPACK_IMPORTED_MODULE_6__["Http"](),
    // Global Handlers
    new _integrations__WEBPACK_IMPORTED_MODULE_6__["OnUncaughtException"](),
    new _integrations__WEBPACK_IMPORTED_MODULE_6__["OnUnhandledRejection"](),
    // Misc
    new _integrations__WEBPACK_IMPORTED_MODULE_6__["LinkedErrors"](),
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
        options.defaultIntegrations = defaultIntegrations;
    }
    if (options.dsn === undefined && process.env.SENTRY_DSN) {
        options.dsn = process.env.SENTRY_DSN;
    }
    if (options.release === undefined) {
        var global_1 = Object(_sentry_utils__WEBPACK_IMPORTED_MODULE_3__["getGlobalObject"])();
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
    if (domain__WEBPACK_IMPORTED_MODULE_4__["active"]) {
        Object(_sentry_hub__WEBPACK_IMPORTED_MODULE_2__["setHubOnCarrier"])(Object(_sentry_hub__WEBPACK_IMPORTED_MODULE_2__["getMainCarrier"])(), Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])());
    }
    Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["initAndBind"])(_client__WEBPACK_IMPORTED_MODULE_5__["NodeClient"], options);
}
/**
 * This is the getter for lastEventId.
 *
 * @returns The last event id of a captured event.
 */
function lastEventId() {
    return Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().lastEventId();
}
/**
 * A promise that resolves when all current events have been sent.
 * If you provide a timeout and the queue takes longer to drain the promise returns false.
 *
 * @param timeout Maximum time in ms the client should wait.
 */
function flush(timeout) {
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var client;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            client = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().getClient();
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
function close(timeout) {
    return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
        var client;
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
            client = Object(_sentry_core__WEBPACK_IMPORTED_MODULE_1__["getCurrentHub"])().getClient();
            if (client) {
                return [2 /*return*/, client.close(timeout)];
            }
            return [2 /*return*/, Promise.reject(false)];
        });
    });
}
//# sourceMappingURL=sdk.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/stacktrace.js":
/*!************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/stacktrace.js ***!
  \************************************************************************************************/
/*! exports provided: parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return parse; });
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/transports/base.js":
/*!*****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/base.js ***!
  \*****************************************************************************************************/
/*! exports provided: BaseTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BaseTransport", function() { return BaseTransport; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/core */ "../../../../../node_modules/@sentry/core/esm/index.js");
/* harmony import */ var _sentry_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @sentry/types */ "../../../../../node_modules/@sentry/types/esm/index.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _version__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../version */ "../../../../../node_modules/@sentry/node/esm/version.js");






/** Base Transport class implementation */
var BaseTransport = /** @class */ (function () {
    /** Create instance and set this.dsn */
    function BaseTransport(options) {
        this.options = options;
        /** A simple buffer holding all requests. */
        this._buffer = new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["PromiseBuffer"](30);
        this._api = new _sentry_core__WEBPACK_IMPORTED_MODULE_1__["API"](options.dsn);
    }
    /** Returns a build request option object used by request */
    BaseTransport.prototype._getRequestOptions = function () {
        var headers = tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, this._api.getRequestHeaders(_version__WEBPACK_IMPORTED_MODULE_5__["SDK_NAME"], _version__WEBPACK_IMPORTED_MODULE_5__["SDK_VERSION"]), this.options.headers);
        var dsn = this._api.getDsn();
        var options = {
            agent: this.client,
            headers: headers,
            hostname: dsn.host,
            method: 'POST',
            path: this._api.getStoreEndpointPath(),
            port: dsn.port,
            protocol: dsn.protocol + ":",
        };
        if (this.options.caCerts) {
            options.ca = fs__WEBPACK_IMPORTED_MODULE_4__["readFileSync"](this.options.caCerts);
        }
        return options;
    };
    /** JSDoc */
    BaseTransport.prototype._sendWithModule = function (httpModule, event) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                if (!this._buffer.isReady()) {
                    return [2 /*return*/, Promise.reject(new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["SentryError"]('Not adding Promise due to buffer limit reached.'))];
                }
                return [2 /*return*/, this._buffer.add(new Promise(function (resolve, reject) {
                        var req = httpModule.request(_this._getRequestOptions(), function (res) {
                            res.setEncoding('utf8');
                            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                                resolve({
                                    status: _sentry_types__WEBPACK_IMPORTED_MODULE_2__["Status"].fromHttpCode(res.statusCode),
                                });
                            }
                            else {
                                if (res.headers && res.headers['x-sentry-error']) {
                                    var reason = res.headers['x-sentry-error'];
                                    reject(new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["SentryError"]("HTTP Error (" + res.statusCode + "): " + reason));
                                }
                                else {
                                    reject(new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["SentryError"]("HTTP Error (" + res.statusCode + ")"));
                                }
                            }
                            // force the socket to drain
                            res.on('data', function () {
                                // Drain
                            });
                            res.on('end', function () {
                                // Drain
                            });
                        });
                        req.on('error', reject);
                        req.end(JSON.stringify(event));
                    }))];
            });
        });
    };
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.sendEvent = function (_) {
        throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_3__["SentryError"]('Transport Class has to implement `sendEvent` method.');
    };
    /**
     * @inheritDoc
     */
    BaseTransport.prototype.close = function (timeout) {
        return this._buffer.drain(timeout);
    };
    return BaseTransport;
}());

//# sourceMappingURL=base.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/transports/http.js":
/*!*****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/http.js ***!
  \*****************************************************************************************************/
/*! exports provided: HTTPTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HTTPTransport", function() { return HTTPTransport; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var https_proxy_agent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! https-proxy-agent */ "../../../../../node_modules/https-proxy-agent/index.js");
/* harmony import */ var https_proxy_agent__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(https_proxy_agent__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./base */ "../../../../../node_modules/@sentry/node/esm/transports/base.js");





/** Node http module transport */
var HTTPTransport = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](HTTPTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.module = http__WEBPACK_IMPORTED_MODULE_2__;
        var proxy = options.httpProxy || process.env.http_proxy;
        _this.client = proxy
            ? // tslint:disable-next-line:no-unsafe-any
                new https_proxy_agent__WEBPACK_IMPORTED_MODULE_3__(proxy)
            : new http__WEBPACK_IMPORTED_MODULE_2__["Agent"]({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPTransport.prototype.sendEvent = function (event) {
        if (!this.module) {
            throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SentryError"]('No module available in HTTPTransport');
        }
        return this._sendWithModule(this.module, event);
    };
    return HTTPTransport;
}(_base__WEBPACK_IMPORTED_MODULE_4__["BaseTransport"]));

//# sourceMappingURL=http.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/transports/https.js":
/*!******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/https.js ***!
  \******************************************************************************************************/
/*! exports provided: HTTPSTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HTTPSTransport", function() { return HTTPSTransport; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _sentry_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @sentry/utils */ "../../../../../node_modules/@sentry/utils/esm/index.js");
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! https */ "https");
/* harmony import */ var https__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(https__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var https_proxy_agent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! https-proxy-agent */ "../../../../../node_modules/https-proxy-agent/index.js");
/* harmony import */ var https_proxy_agent__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(https_proxy_agent__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./base */ "../../../../../node_modules/@sentry/node/esm/transports/base.js");





/** Node https module transport */
var HTTPSTransport = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](HTTPSTransport, _super);
    /** Create a new instance and set this.agent */
    function HTTPSTransport(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.module = https__WEBPACK_IMPORTED_MODULE_2__;
        var proxy = options.httpsProxy || options.httpProxy || process.env.https_proxy || process.env.http_proxy;
        _this.client = proxy
            ? // tslint:disable-next-line:no-unsafe-any
                new https_proxy_agent__WEBPACK_IMPORTED_MODULE_3__(proxy)
            : new https__WEBPACK_IMPORTED_MODULE_2__["Agent"]({ keepAlive: false, maxSockets: 30, timeout: 2000 });
        return _this;
    }
    /**
     * @inheritDoc
     */
    HTTPSTransport.prototype.sendEvent = function (event) {
        if (!this.module) {
            throw new _sentry_utils__WEBPACK_IMPORTED_MODULE_1__["SentryError"]('No module available in HTTPSTransport');
        }
        return this._sendWithModule(this.module, event);
    };
    return HTTPSTransport;
}(_base__WEBPACK_IMPORTED_MODULE_4__["BaseTransport"]));

//# sourceMappingURL=https.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/transports/index.js":
/*!******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/transports/index.js ***!
  \******************************************************************************************************/
/*! exports provided: BaseTransport, HTTPTransport, HTTPSTransport */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "../../../../../node_modules/@sentry/node/esm/transports/base.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BaseTransport", function() { return _base__WEBPACK_IMPORTED_MODULE_0__["BaseTransport"]; });

/* harmony import */ var _http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./http */ "../../../../../node_modules/@sentry/node/esm/transports/http.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HTTPTransport", function() { return _http__WEBPACK_IMPORTED_MODULE_1__["HTTPTransport"]; });

/* harmony import */ var _https__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./https */ "../../../../../node_modules/@sentry/node/esm/transports/https.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HTTPSTransport", function() { return _https__WEBPACK_IMPORTED_MODULE_2__["HTTPSTransport"]; });




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/node/esm/version.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/node/esm/version.js ***!
  \*********************************************************************************************/
/*! exports provided: SDK_NAME, SDK_VERSION */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SDK_NAME", function() { return SDK_NAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SDK_VERSION", function() { return SDK_VERSION; });
var SDK_NAME = 'sentry.javascript.node';
var SDK_VERSION = '5.7.1';
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/types/esm/index.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/index.js ***!
  \********************************************************************************************/
/*! exports provided: LogLevel, Severity, Status */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _loglevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loglevel */ "../../../../../node_modules/@sentry/types/esm/loglevel.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return _loglevel__WEBPACK_IMPORTED_MODULE_0__["LogLevel"]; });

/* harmony import */ var _severity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./severity */ "../../../../../node_modules/@sentry/types/esm/severity.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Severity", function() { return _severity__WEBPACK_IMPORTED_MODULE_1__["Severity"]; });

/* harmony import */ var _status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./status */ "../../../../../node_modules/@sentry/types/esm/status.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Status", function() { return _status__WEBPACK_IMPORTED_MODULE_2__["Status"]; });




//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/types/esm/loglevel.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/loglevel.js ***!
  \***********************************************************************************************/
/*! exports provided: LogLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/** Console logging verbosity for the SDK. */
var LogLevel;
(function (LogLevel) {
    /** No logs will be generated. */
    LogLevel[LogLevel["None"] = 0] = "None";
    /** Only SDK internal errors will be logged. */
    LogLevel[LogLevel["Error"] = 1] = "Error";
    /** Information useful for debugging the SDK will be logged. */
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    /** All SDK actions will be logged. */
    LogLevel[LogLevel["Verbose"] = 3] = "Verbose";
})(LogLevel || (LogLevel = {}));
//# sourceMappingURL=loglevel.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/types/esm/severity.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/severity.js ***!
  \***********************************************************************************************/
/*! exports provided: Severity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Severity", function() { return Severity; });
/** JSDoc */
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
// tslint:disable:completed-docs
// tslint:disable:no-unnecessary-qualifier no-namespace
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/types/esm/status.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/types/esm/status.js ***!
  \*********************************************************************************************/
/*! exports provided: Status */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Status", function() { return Status; });
/** The status of an event. */
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
// tslint:disable:completed-docs
// tslint:disable:no-unnecessary-qualifier no-namespace
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/async.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/async.js ***!
  \********************************************************************************************/
/*! exports provided: forget */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forget", function() { return forget; });
/**
 * Consumes the promise and logs the error when it rejects.
 * @param promise A promise to forget.
 */
function forget(promise) {
    promise.then(null, function (e) {
        // TODO: Use a better logging mechanism
        console.error(e);
    });
}
//# sourceMappingURL=async.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/error.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/error.js ***!
  \********************************************************************************************/
/*! exports provided: SentryError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SentryError", function() { return SentryError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/@sentry/utils/esm/polyfill.js");


/** An error emitted by Sentry SDKs and related utilities. */
var SentryError = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](SentryError, _super);
    function SentryError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.message = message;
        // tslint:disable:no-unsafe-any
        _this.name = _newTarget.prototype.constructor.name;
        Object(_polyfill__WEBPACK_IMPORTED_MODULE_1__["setPrototypeOf"])(_this, _newTarget.prototype);
        return _this;
    }
    return SentryError;
}(Error));

//# sourceMappingURL=error.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/index.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/index.js ***!
  \********************************************************************************************/
/*! exports provided: forget, SentryError, isError, isErrorEvent, isDOMError, isDOMException, isString, isPrimitive, isPlainObject, isEvent, isElement, isRegExp, isThenable, isSyntheticEvent, logger, Memo, dynamicRequire, isNodeEnv, getGlobalObject, uuid4, parseUrl, getEventDescription, consoleSandbox, addExceptionTypeValue, addExceptionMechanism, getLocationHref, htmlTreeAsString, fill, urlEncode, normalizeToSize, walk, normalize, extractExceptionKeysForMessage, resolve, relative, normalizePath, isAbsolute, join, dirname, basename, PromiseBuffer, truncate, snipLine, safeJoin, isMatchingPattern, supportsErrorEvent, supportsDOMError, supportsDOMException, supportsFetch, supportsNativeFetch, supportsReportingObserver, supportsReferrerPolicy, supportsHistory, SyncPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./async */ "../../../../../node_modules/@sentry/utils/esm/async.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "forget", function() { return _async__WEBPACK_IMPORTED_MODULE_0__["forget"]; });

/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error */ "../../../../../node_modules/@sentry/utils/esm/error.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SentryError", function() { return _error__WEBPACK_IMPORTED_MODULE_1__["SentryError"]; });

/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./is */ "../../../../../node_modules/@sentry/utils/esm/is.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isError", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isErrorEvent", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isErrorEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isDOMError", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isDOMError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isDOMException", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isDOMException"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isString"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isPrimitive", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isPrimitive"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isPlainObject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isEvent", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isElement", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isElement"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isRegExp", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isRegExp"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isThenable", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isThenable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isSyntheticEvent", function() { return _is__WEBPACK_IMPORTED_MODULE_2__["isSyntheticEvent"]; });

/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger */ "../../../../../node_modules/@sentry/utils/esm/logger.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "logger", function() { return _logger__WEBPACK_IMPORTED_MODULE_3__["logger"]; });

/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./memo */ "../../../../../node_modules/@sentry/utils/esm/memo.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Memo", function() { return _memo__WEBPACK_IMPORTED_MODULE_4__["Memo"]; });

/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./misc */ "../../../../../node_modules/@sentry/utils/esm/misc.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dynamicRequire", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["dynamicRequire"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isNodeEnv", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["isNodeEnv"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getGlobalObject", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["getGlobalObject"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "uuid4", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["uuid4"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "parseUrl", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["parseUrl"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getEventDescription", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["getEventDescription"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "consoleSandbox", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["consoleSandbox"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addExceptionTypeValue", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["addExceptionTypeValue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addExceptionMechanism", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["addExceptionMechanism"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getLocationHref", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["getLocationHref"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "htmlTreeAsString", function() { return _misc__WEBPACK_IMPORTED_MODULE_5__["htmlTreeAsString"]; });

/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./object */ "../../../../../node_modules/@sentry/utils/esm/object.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "fill", function() { return _object__WEBPACK_IMPORTED_MODULE_6__["fill"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "urlEncode", function() { return _object__WEBPACK_IMPORTED_MODULE_6__["urlEncode"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizeToSize", function() { return _object__WEBPACK_IMPORTED_MODULE_6__["normalizeToSize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "walk", function() { return _object__WEBPACK_IMPORTED_MODULE_6__["walk"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return _object__WEBPACK_IMPORTED_MODULE_6__["normalize"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "extractExceptionKeysForMessage", function() { return _object__WEBPACK_IMPORTED_MODULE_6__["extractExceptionKeysForMessage"]; });

/* harmony import */ var _path__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./path */ "../../../../../node_modules/@sentry/utils/esm/path.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "resolve", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["resolve"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "relative", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["relative"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "normalizePath", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["normalizePath"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isAbsolute", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["isAbsolute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "join", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["join"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "dirname", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["dirname"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "basename", function() { return _path__WEBPACK_IMPORTED_MODULE_7__["basename"]; });

/* harmony import */ var _promisebuffer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./promisebuffer */ "../../../../../node_modules/@sentry/utils/esm/promisebuffer.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PromiseBuffer", function() { return _promisebuffer__WEBPACK_IMPORTED_MODULE_8__["PromiseBuffer"]; });

/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./string */ "../../../../../node_modules/@sentry/utils/esm/string.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "truncate", function() { return _string__WEBPACK_IMPORTED_MODULE_9__["truncate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "snipLine", function() { return _string__WEBPACK_IMPORTED_MODULE_9__["snipLine"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "safeJoin", function() { return _string__WEBPACK_IMPORTED_MODULE_9__["safeJoin"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isMatchingPattern", function() { return _string__WEBPACK_IMPORTED_MODULE_9__["isMatchingPattern"]; });

/* harmony import */ var _supports__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./supports */ "../../../../../node_modules/@sentry/utils/esm/supports.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsErrorEvent", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsErrorEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsDOMError", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsDOMError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsDOMException", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsDOMException"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsFetch", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsFetch"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsNativeFetch", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsNativeFetch"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsReportingObserver", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsReportingObserver"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsReferrerPolicy", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsReferrerPolicy"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "supportsHistory", function() { return _supports__WEBPACK_IMPORTED_MODULE_10__["supportsHistory"]; });

/* harmony import */ var _syncpromise__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./syncpromise */ "../../../../../node_modules/@sentry/utils/esm/syncpromise.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SyncPromise", function() { return _syncpromise__WEBPACK_IMPORTED_MODULE_11__["SyncPromise"]; });













//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/is.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/is.js ***!
  \*****************************************************************************************/
/*! exports provided: isError, isErrorEvent, isDOMError, isDOMException, isString, isPrimitive, isPlainObject, isEvent, isElement, isRegExp, isThenable, isSyntheticEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isError", function() { return isError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isErrorEvent", function() { return isErrorEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDOMError", function() { return isDOMError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDOMException", function() { return isDOMException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPrimitive", function() { return isPrimitive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isPlainObject", function() { return isPlainObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isEvent", function() { return isEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isElement", function() { return isElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isRegExp", function() { return isRegExp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isThenable", function() { return isThenable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isSyntheticEvent", function() { return isSyntheticEvent; });
/// <reference lib="dom" />
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
            return wat instanceof Error;
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
    // tslint:disable-next-line:strict-type-predicates
    return typeof Event !== 'undefined' && wat instanceof Event;
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isElement(wat) {
    // tslint:disable-next-line:strict-type-predicates
    return typeof Element !== 'undefined' && wat instanceof Element;
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
    // tslint:disable:no-unsafe-any
    return Boolean(wat && wat.then && typeof wat.then === 'function');
    // tslint:enable:no-unsafe-any
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
function isSyntheticEvent(wat) {
    // tslint:disable-next-line:no-unsafe-any
    return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}
//# sourceMappingURL=is.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/logger.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/logger.js ***!
  \*********************************************************************************************/
/*! exports provided: logger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logger", function() { return logger; });
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./misc */ "../../../../../node_modules/@sentry/utils/esm/misc.js");

// TODO: Implement different loggers for different environments
var global = Object(_misc__WEBPACK_IMPORTED_MODULE_0__["getGlobalObject"])();
/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';
/** JSDoc */
var Logger = /** @class */ (function () {
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
        Object(_misc__WEBPACK_IMPORTED_MODULE_0__["consoleSandbox"])(function () {
            global.console.log(PREFIX + "[Log]: " + args.join(' ')); // tslint:disable-line:no-console
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
        Object(_misc__WEBPACK_IMPORTED_MODULE_0__["consoleSandbox"])(function () {
            global.console.warn(PREFIX + "[Warn]: " + args.join(' ')); // tslint:disable-line:no-console
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
        Object(_misc__WEBPACK_IMPORTED_MODULE_0__["consoleSandbox"])(function () {
            global.console.error(PREFIX + "[Error]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    return Logger;
}());
// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
global.__SENTRY__ = global.__SENTRY__ || {};
var logger = global.__SENTRY__.logger || (global.__SENTRY__.logger = new Logger());

//# sourceMappingURL=logger.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/memo.js":
/*!*******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/memo.js ***!
  \*******************************************************************************************/
/*! exports provided: Memo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Memo", function() { return Memo; });
// tslint:disable:no-unsafe-any
/**
 * Memo class used for decycle json objects. Uses WeakSet if available otherwise array.
 */
var Memo = /** @class */ (function () {
    function Memo() {
        // tslint:disable-next-line
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
        // tslint:disable-next-line:prefer-for-of
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/misc.js":
/*!*******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/misc.js ***!
  \*******************************************************************************************/
/*! exports provided: dynamicRequire, isNodeEnv, getGlobalObject, uuid4, parseUrl, getEventDescription, consoleSandbox, addExceptionTypeValue, addExceptionMechanism, getLocationHref, htmlTreeAsString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dynamicRequire", function() { return dynamicRequire; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNodeEnv", function() { return isNodeEnv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGlobalObject", function() { return getGlobalObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuid4", function() { return uuid4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseUrl", function() { return parseUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEventDescription", function() { return getEventDescription; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "consoleSandbox", function() { return consoleSandbox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addExceptionTypeValue", function() { return addExceptionTypeValue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addExceptionMechanism", function() { return addExceptionMechanism; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLocationHref", function() { return getLocationHref; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "htmlTreeAsString", function() { return htmlTreeAsString; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../../../../../node_modules/@sentry/utils/esm/is.js");
/// <reference lib="dom" />

/**
 * Requires a module which is protected _against bundler minification.
 *
 * @param request The module path to resolve
 */
function dynamicRequire(mod, request) {
    // tslint:disable-next-line: no-unsafe-any
    return mod.require(request);
}
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    // tslint:disable:strict-type-predicates
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
        // tslint:disable-next-line:no-bitwise
        arr[3] = (arr[3] & 0xfff) | 0x4000;
        // set 2 most significant bits of byte 9 to '10'
        // tslint:disable-next-line:no-bitwise
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
        // tslint:disable-next-line:no-bitwise
        var r = (Math.random() * 16) | 0;
        // tslint:disable-next-line:no-bitwise
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
    var match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
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
        if (level in global.console && originalConsole[level].__sentry__) {
            wrappedLevels[level] = originalConsole[level].__sentry_wrapped__;
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
        // @ts-ignore
        // tslint:disable:no-non-null-assertion
        event.exception.values[0].mechanism = event.exception.values[0].mechanism || {};
        Object.keys(mechanism).forEach(function (key) {
            // @ts-ignore
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
function _htmlElementAsString(elem) {
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
    className = elem.className;
    if (className && Object(_is__WEBPACK_IMPORTED_MODULE_0__["isString"])(className)) {
        classes = className.split(/\s+/);
        for (i = 0; i < classes.length; i++) {
            out.push("." + classes[i]);
        }
    }
    var attrWhitelist = ['type', 'name', 'title', 'alt'];
    for (i = 0; i < attrWhitelist.length; i++) {
        key = attrWhitelist[i];
        attr = elem.getAttribute(key);
        if (attr) {
            out.push("[" + key + "=\"" + attr + "\"]");
        }
    }
    return out.join('');
}
//# sourceMappingURL=misc.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/object.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/object.js ***!
  \*********************************************************************************************/
/*! exports provided: fill, urlEncode, normalizeToSize, walk, normalize, extractExceptionKeysForMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fill", function() { return fill; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "urlEncode", function() { return urlEncode; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeToSize", function() { return normalizeToSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "walk", function() { return walk; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalize", function() { return normalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractExceptionKeysForMessage", function() { return extractExceptionKeysForMessage; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../../../../../node_modules/@sentry/utils/esm/is.js");
/* harmony import */ var _memo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./memo */ "../../../../../node_modules/@sentry/utils/esm/memo.js");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./misc */ "../../../../../node_modules/@sentry/utils/esm/misc.js");
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./string */ "../../../../../node_modules/@sentry/utils/esm/string.js");




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
    // tslint:disable-next-line:strict-type-predicates
    if (typeof wrapped === 'function') {
        try {
            wrapped.prototype = wrapped.prototype || {};
            Object.defineProperties(wrapped, {
                __sentry__: {
                    enumerable: false,
                    value: true,
                },
                __sentry_original__: {
                    enumerable: false,
                    value: original,
                },
                __sentry_wrapped__: {
                    enumerable: false,
                    value: wrapped,
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
        .map(
    // tslint:disable-next-line:no-unsafe-any
    function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]); })
        .join('&');
}
/**
 * Transforms any object into an object literal with all it's attributes
 * attached to it.
 *
 * @param value Initial source that we have to transform in order to be usable by the serializer
 */
function getWalkSource(value) {
    if (Object(_is__WEBPACK_IMPORTED_MODULE_0__["isError"])(value)) {
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
    if (Object(_is__WEBPACK_IMPORTED_MODULE_0__["isEvent"])(value)) {
        var source = {};
        source.type = value.type;
        // Accessing event.target can throw (see getsentry/raven-js#838, #768)
        try {
            source.target = Object(_is__WEBPACK_IMPORTED_MODULE_0__["isElement"])(value.target)
                ? Object(_misc__WEBPACK_IMPORTED_MODULE_2__["htmlTreeAsString"])(value.target)
                : Object.prototype.toString.call(value.target);
        }
        catch (_oO) {
            source.target = '<unknown>';
        }
        try {
            source.currentTarget = Object(_is__WEBPACK_IMPORTED_MODULE_0__["isElement"])(value.currentTarget)
                ? Object(_misc__WEBPACK_IMPORTED_MODULE_2__["htmlTreeAsString"])(value.currentTarget)
                : Object.prototype.toString.call(value.currentTarget);
        }
        catch (_oO) {
            source.currentTarget = '<unknown>';
        }
        // tslint:disable-next-line:strict-type-predicates
        if (typeof CustomEvent !== 'undefined' && value instanceof CustomEvent) {
            source.detail = value.detail;
        }
        for (var i in value) {
            if (Object.prototype.hasOwnProperty.call(value, i)) {
                source[i] = value[i];
            }
        }
        return source;
    }
    return value;
}
/** Calculates bytes size of input string */
function utf8Length(value) {
    // tslint:disable-next-line:no-bitwise
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
    return Object(_is__WEBPACK_IMPORTED_MODULE_0__["isPrimitive"])(normalized) ? normalized : type;
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
// tslint:disable-next-line:cyclomatic-complexity
function normalizeValue(value, key) {
    if (key === 'domain' && typeof value === 'object' && value._events) {
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
    if (Object(_is__WEBPACK_IMPORTED_MODULE_0__["isSyntheticEvent"])(value)) {
        return '[SyntheticEvent]';
    }
    // tslint:disable-next-line:no-tautology-expression
    if (typeof value === 'number' && value !== value) {
        return '[NaN]';
    }
    if (value === void 0) {
        return '[undefined]';
    }
    if (typeof value === 'function') {
        return "[Function: " + (value.name || '<unknown-function-name>') + "]";
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
function walk(key, value, depth, memo) {
    if (depth === void 0) { depth = +Infinity; }
    if (memo === void 0) { memo = new _memo__WEBPACK_IMPORTED_MODULE_1__["Memo"](); }
    // If we reach the maximum depth, serialize whatever has left
    if (depth === 0) {
        return serializeValue(value);
    }
    // If value implements `toJSON` method, call it and return early
    // tslint:disable:no-unsafe-any
    if (value !== null && value !== undefined && typeof value.toJSON === 'function') {
        return value.toJSON();
    }
    // tslint:enable:no-unsafe-any
    // If normalized value is a primitive, there are no branches left to walk, so we can just bail out, as theres no point in going down that branch any further
    var normalized = normalizeValue(value, key);
    if (Object(_is__WEBPACK_IMPORTED_MODULE_0__["isPrimitive"])(normalized)) {
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
function normalize(input, depth) {
    try {
        // tslint:disable-next-line:no-unsafe-any
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
function extractExceptionKeysForMessage(exception, maxLength) {
    if (maxLength === void 0) { maxLength = 40; }
    // tslint:disable:strict-type-predicates
    var keys = Object.keys(getWalkSource(exception));
    keys.sort();
    if (!keys.length) {
        return '[object has no keys]';
    }
    if (keys[0].length >= maxLength) {
        return Object(_string__WEBPACK_IMPORTED_MODULE_3__["truncate"])(keys[0], maxLength);
    }
    for (var includedKeys = keys.length; includedKeys > 0; includedKeys--) {
        var serialized = keys.slice(0, includedKeys).join(', ');
        if (serialized.length > maxLength) {
            continue;
        }
        if (includedKeys === keys.length) {
            return serialized;
        }
        return Object(_string__WEBPACK_IMPORTED_MODULE_3__["truncate"])(serialized, maxLength);
    }
    return '';
}
//# sourceMappingURL=object.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/path.js":
/*!*******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/path.js ***!
  \*******************************************************************************************/
/*! exports provided: resolve, relative, normalizePath, isAbsolute, join, dirname, basename */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolve", function() { return resolve; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "relative", function() { return relative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizePath", function() { return normalizePath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isAbsolute", function() { return isAbsolute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "join", function() { return join; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dirname", function() { return dirname; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "basename", function() { return basename; });
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
            up++;
        }
        else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        for (; up--; up) {
            parts.unshift('..');
        }
    }
    return parts;
}
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
/** JSDoc */
function splitPath(filename) {
    var parts = splitPathRe.exec(filename);
    return parts ? parts.slice(1) : [];
}
// path.resolve([from ...], to)
// posix version
/** JSDoc */
function resolve() {
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
    // tslint:disable:no-parameter-reassignment
    from = resolve(from).substr(1);
    to = resolve(to).substr(1);
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/polyfill.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/polyfill.js ***!
  \***********************************************************************************************/
/*! exports provided: setPrototypeOf */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setPrototypeOf", function() { return setPrototypeOf; });
var setPrototypeOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties); // tslint:disable-line:no-unbound-method
/**
 * setPrototypeOf polyfill using __proto__
 */
function setProtoOf(obj, proto) {
    // @ts-ignore
    obj.__proto__ = proto;
    return obj;
}
/**
 * setPrototypeOf polyfill using mixin
 */
function mixinProperties(obj, proto) {
    for (var prop in proto) {
        if (!obj.hasOwnProperty(prop)) {
            // @ts-ignore
            obj[prop] = proto[prop];
        }
    }
    return obj;
}
//# sourceMappingURL=polyfill.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/promisebuffer.js":
/*!****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/promisebuffer.js ***!
  \****************************************************************************************************/
/*! exports provided: PromiseBuffer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PromiseBuffer", function() { return PromiseBuffer; });
/* harmony import */ var _error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error */ "../../../../../node_modules/@sentry/utils/esm/error.js");
/* harmony import */ var _syncpromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./syncpromise */ "../../../../../node_modules/@sentry/utils/esm/syncpromise.js");


/** A simple queue that holds promises. */
var PromiseBuffer = /** @class */ (function () {
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
            return _syncpromise__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].reject(new _error__WEBPACK_IMPORTED_MODULE_0__["SentryError"]('Not adding Promise due to buffer limit reached.'));
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
        return new _syncpromise__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"](function (resolve) {
            var capturedSetTimeout = setTimeout(function () {
                if (timeout && timeout > 0) {
                    resolve(false);
                }
            }, timeout);
            _syncpromise__WEBPACK_IMPORTED_MODULE_1__["SyncPromise"].all(_this._buffer)
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

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/string.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/string.js ***!
  \*********************************************************************************************/
/*! exports provided: truncate, snipLine, safeJoin, isMatchingPattern */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "truncate", function() { return truncate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "snipLine", function() { return snipLine; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "safeJoin", function() { return safeJoin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMatchingPattern", function() { return isMatchingPattern; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../../../../../node_modules/@sentry/utils/esm/is.js");

/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function truncate(str, max) {
    if (max === void 0) { max = 0; }
    // tslint:disable-next-line:strict-type-predicates
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
        colno = ll; // tslint:disable-line:no-parameter-reassignment
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
function safeJoin(input, delimiter) {
    if (!Array.isArray(input)) {
        return '';
    }
    var output = [];
    // tslint:disable-next-line:prefer-for-of
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
    if (Object(_is__WEBPACK_IMPORTED_MODULE_0__["isRegExp"])(pattern)) {
        return pattern.test(value);
    }
    if (typeof pattern === 'string') {
        return value.indexOf(pattern) !== -1;
    }
    return false;
}
//# sourceMappingURL=string.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/supports.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/supports.js ***!
  \***********************************************************************************************/
/*! exports provided: supportsErrorEvent, supportsDOMError, supportsDOMException, supportsFetch, supportsNativeFetch, supportsReportingObserver, supportsReferrerPolicy, supportsHistory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsErrorEvent", function() { return supportsErrorEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsDOMError", function() { return supportsDOMError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsDOMException", function() { return supportsDOMException; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsFetch", function() { return supportsFetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsNativeFetch", function() { return supportsNativeFetch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsReportingObserver", function() { return supportsReportingObserver; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsReferrerPolicy", function() { return supportsReferrerPolicy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "supportsHistory", function() { return supportsHistory; });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ "../../../../../node_modules/@sentry/utils/esm/logger.js");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc */ "../../../../../node_modules/@sentry/utils/esm/misc.js");


/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */
function supportsErrorEvent() {
    try {
        // tslint:disable:no-unused-expression
        new ErrorEvent('');
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */
function supportsDOMError() {
    try {
        // It really needs 1 argument, not 0.
        // Chrome: VM89:1 Uncaught TypeError: Failed to construct 'DOMError':
        // 1 argument required, but only 0 present.
        // @ts-ignore
        // tslint:disable:no-unused-expression
        new DOMError('');
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */
function supportsDOMException() {
    try {
        // tslint:disable:no-unused-expression
        new DOMException('');
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 */
function supportsFetch() {
    if (!('fetch' in Object(_misc__WEBPACK_IMPORTED_MODULE_1__["getGlobalObject"])())) {
        return false;
    }
    try {
        // tslint:disable-next-line:no-unused-expression
        new Headers();
        // tslint:disable-next-line:no-unused-expression
        new Request('');
        // tslint:disable-next-line:no-unused-expression
        new Response();
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */
function supportsNativeFetch() {
    if (!supportsFetch()) {
        return false;
    }
    var isNativeFunc = function (func) { return func.toString().indexOf('native') !== -1; };
    var global = Object(_misc__WEBPACK_IMPORTED_MODULE_1__["getGlobalObject"])();
    var result = null;
    var doc = global.document;
    if (doc) {
        var sandbox = doc.createElement('iframe');
        sandbox.hidden = true;
        try {
            doc.head.appendChild(sandbox);
            if (sandbox.contentWindow && sandbox.contentWindow.fetch) {
                // tslint:disable-next-line no-unbound-method
                result = isNativeFunc(sandbox.contentWindow.fetch);
            }
            doc.head.removeChild(sandbox);
        }
        catch (err) {
            _logger__WEBPACK_IMPORTED_MODULE_0__["logger"].warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', err);
        }
    }
    if (result === null) {
        // tslint:disable-next-line no-unbound-method
        result = isNativeFunc(global.fetch);
    }
    return result;
}
/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */
function supportsReportingObserver() {
    // tslint:disable-next-line: no-unsafe-any
    return 'ReportingObserver' in Object(_misc__WEBPACK_IMPORTED_MODULE_1__["getGlobalObject"])();
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 */
function supportsReferrerPolicy() {
    // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default
    // https://caniuse.com/#feat=referrer-policy
    // It doesn't. And it throw exception instead of ignoring this parameter...
    // REF: https://github.com/getsentry/raven-js/issues/1233
    if (!supportsFetch()) {
        return false;
    }
    try {
        // tslint:disable:no-unused-expression
        new Request('_', {
            referrerPolicy: 'origin',
        });
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */
function supportsHistory() {
    // NOTE: in Chrome App environment, touching history.pushState, *even inside
    //       a try/catch block*, will cause Chrome to output an error to console.error
    // borrowed from: https://github.com/angular/angular.js/pull/13945/files
    var global = Object(_misc__WEBPACK_IMPORTED_MODULE_1__["getGlobalObject"])();
    var chrome = global.chrome;
    // tslint:disable-next-line:no-unsafe-any
    var isChromePackagedApp = chrome && chrome.app && chrome.app.runtime;
    var hasHistoryApi = 'history' in global && !!global.history.pushState && !!global.history.replaceState;
    return !isChromePackagedApp && hasHistoryApi;
}
//# sourceMappingURL=supports.js.map

/***/ }),

/***/ "../../../../../node_modules/@sentry/utils/esm/syncpromise.js":
/*!**************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/@sentry/utils/esm/syncpromise.js ***!
  \**************************************************************************************************/
/*! exports provided: SyncPromise */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SyncPromise", function() { return SyncPromise; });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../../../../../node_modules/@sentry/utils/esm/is.js");

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
var SyncPromise = /** @class */ (function () {
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
            if (Object(_is__WEBPACK_IMPORTED_MODULE_0__["isThenable"])(value)) {
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
            if (_this._state === States.REJECTED) {
                _this._handlers.forEach(function (handler) {
                    if (handler.onrejected) {
                        handler.onrejected(_this._value);
                    }
                });
            }
            else {
                _this._handlers.forEach(function (handler) {
                    if (handler.onfulfilled) {
                        // tslint:disable-next-line:no-unsafe-any
                        handler.onfulfilled(_this._value);
                    }
                });
            }
            _this._handlers = [];
        };
        try {
            executor(this._resolve, this._reject);
        }
        catch (e) {
            this._reject(e);
        }
    }
    /** JSDoc */
    SyncPromise.prototype.toString = function () {
        return '[object SyncPromise]';
    };
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
                // tslint:disable-next-line:no-unsafe-any
                resolve(val);
            });
        });
    };
    return SyncPromise;
}());

//# sourceMappingURL=syncpromise.js.map

/***/ }),

/***/ "../../../../../node_modules/agent-base/index.js":
/*!*************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/agent-base/index.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ./patch-core */ "../../../../../node_modules/agent-base/patch-core.js");
const inherits = __webpack_require__(/*! util */ "util").inherits;
const promisify = __webpack_require__(/*! es6-promisify */ "../../../../../node_modules/es6-promisify/dist/promisify.js");
const EventEmitter = __webpack_require__(/*! events */ "events").EventEmitter;

module.exports = Agent;

function isAgent(v) {
  return v && typeof v.addRequest === 'function';
}

/**
 * Base `http.Agent` implementation.
 * No pooling/keep-alive is implemented by default.
 *
 * @param {Function} callback
 * @api public
 */
function Agent(callback, _opts) {
  if (!(this instanceof Agent)) {
    return new Agent(callback, _opts);
  }

  EventEmitter.call(this);

  // The callback gets promisified if it has 3 parameters
  // (i.e. it has a callback function) lazily
  this._promisifiedCallback = false;

  let opts = _opts;
  if ('function' === typeof callback) {
    this.callback = callback;
  } else if (callback) {
    opts = callback;
  }

  // timeout for the socket to be returned from the callback
  this.timeout = (opts && opts.timeout) || null;

  this.options = opts;
}
inherits(Agent, EventEmitter);

/**
 * Override this function in your subclass!
 */
Agent.prototype.callback = function callback(req, opts) {
  throw new Error(
    '"agent-base" has no default implementation, you must subclass and override `callback()`'
  );
};

/**
 * Called by node-core's "_http_client.js" module when creating
 * a new HTTP request with this Agent instance.
 *
 * @api public
 */
Agent.prototype.addRequest = function addRequest(req, _opts) {
  const ownOpts = Object.assign({}, _opts);

  // Set default `host` for HTTP to localhost
  if (null == ownOpts.host) {
    ownOpts.host = 'localhost';
  }

  // Set default `port` for HTTP if none was explicitly specified
  if (null == ownOpts.port) {
    ownOpts.port = ownOpts.secureEndpoint ? 443 : 80;
  }

  const opts = Object.assign({}, this.options, ownOpts);

  if (opts.host && opts.path) {
    // If both a `host` and `path` are specified then it's most likely the
    // result of a `url.parse()` call... we need to remove the `path` portion so
    // that `net.connect()` doesn't attempt to open that as a unix socket file.
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

  // Create the `stream.Duplex` instance
  let timeout;
  let timedOut = false;
  const timeoutMs = this.timeout;
  const freeSocket = this.freeSocket;

  function onerror(err) {
    if (req._hadError) return;
    req.emit('error', err);
    // For Safety. Some additional errors might fire later on
    // and we need to make sure we don't double-fire the error event.
    req._hadError = true;
  }

  function ontimeout() {
    timeout = null;
    timedOut = true;
    const err = new Error(
      'A "socket" was not created for HTTP request before ' + timeoutMs + 'ms'
    );
    err.code = 'ETIMEOUT';
    onerror(err);
  }

  function callbackError(err) {
    if (timedOut) return;
    if (timeout != null) {
      clearTimeout(timeout);
      timeout = null;
    }
    onerror(err);
  }

  function onsocket(socket) {
    if (timedOut) return;
    if (timeout != null) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (isAgent(socket)) {
      // `socket` is actually an http.Agent instance, so relinquish
      // responsibility for this `req` to the Agent from here on
      socket.addRequest(req, opts);
    } else if (socket) {
      function onfree() {
        freeSocket(socket, opts);
      }
      socket.on('free', onfree);
      req.onSocket(socket);
    } else {
      const err = new Error(
        'no Duplex stream was returned to agent-base for `' + req.method + ' ' + req.path + '`'
      );
      onerror(err);
    }
  }

  if (!this._promisifiedCallback && this.callback.length >= 3) {
    // Legacy callback function - convert to a Promise
    this.callback = promisify(this.callback, this);
    this._promisifiedCallback = true;
  }

  if (timeoutMs > 0) {
    timeout = setTimeout(ontimeout, timeoutMs);
  }

  try {
    Promise.resolve(this.callback(req, opts)).then(onsocket, callbackError);
  } catch (err) {
    Promise.reject(err).catch(callbackError);
  }
};

Agent.prototype.freeSocket = function freeSocket(socket, opts) {
  // TODO reuse sockets
  socket.destroy();
};


/***/ }),

/***/ "../../../../../node_modules/agent-base/patch-core.js":
/*!******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/agent-base/patch-core.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const url = __webpack_require__(/*! url */ "url");
const https = __webpack_require__(/*! https */ "https");

/**
 * This currently needs to be applied to all Node.js versions
 * in order to determine if the `req` is an HTTP or HTTPS request.
 *
 * There is currently no PR attempting to move this property upstream.
 */
const patchMarker = "__agent_base_https_request_patched__";
if (!https.request[patchMarker]) {
  https.request = (function(request) {
    return function(_options, cb) {
      let options;
      if (typeof _options === 'string') {
        options = url.parse(_options);
      } else {
        options = Object.assign({}, _options);
      }
      if (null == options.port) {
        options.port = 443;
      }
      options.secureEndpoint = true;
      return request.call(https, options, cb);
    };
  })(https.request);
  https.request[patchMarker] = true;
}

/**
 * This is needed for Node.js >= 9.0.0 to make sure `https.get()` uses the
 * patched `https.request()`.
 *
 * Ref: https://github.com/nodejs/node/commit/5118f31
 */
https.get = function (_url, _options, cb) {
    let options;
    if (typeof _url === 'string' && _options && typeof _options !== 'function') {
      options = Object.assign({}, url.parse(_url), _options);
    } else if (!_options && !cb) {
      options = _url;
    } else if (!cb) {
      options = _url;
      cb = _options;
    }

  const req = https.request(options, cb);
  req.end();
  return req;
};


/***/ }),

/***/ "../../../../../node_modules/ansi-styles/index.js":
/*!**************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/ansi-styles/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
const colorConvert = __webpack_require__(/*! color-convert */ "../../../../../node_modules/color-convert/index.js");

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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/module.js */ "../../../../../node_modules/webpack/buildin/module.js")(module)))

/***/ }),

/***/ "../../../../../node_modules/chalk/index.js":
/*!********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/chalk/index.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const escapeStringRegexp = __webpack_require__(/*! escape-string-regexp */ "../../../../../node_modules/escape-string-regexp/index.js");
const ansiStyles = __webpack_require__(/*! ansi-styles */ "../../../../../node_modules/ansi-styles/index.js");
const stdoutColor = __webpack_require__(/*! supports-color */ "../../../../../node_modules/supports-color/index.js").stdout;

const template = __webpack_require__(/*! ./templates.js */ "../../../../../node_modules/chalk/templates.js");

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

/***/ "../../../../../node_modules/chalk/templates.js":
/*!************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/chalk/templates.js ***!
  \************************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/color-convert/conversions.js":
/*!**********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/color-convert/conversions.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(/*! color-name */ "../../../../../node_modules/color-name/index.js");

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

/***/ "../../../../../node_modules/color-convert/index.js":
/*!****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/color-convert/index.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(/*! ./conversions */ "../../../../../node_modules/color-convert/conversions.js");
var route = __webpack_require__(/*! ./route */ "../../../../../node_modules/color-convert/route.js");

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

/***/ "../../../../../node_modules/color-convert/route.js":
/*!****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/color-convert/route.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(/*! ./conversions */ "../../../../../node_modules/color-convert/conversions.js");

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

/***/ "../../../../../node_modules/color-name/index.js":
/*!*************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/color-name/index.js ***!
  \*************************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/cookie/index.js":
/*!*********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/cookie/index.js ***!
  \*********************************************************************************/
/*! no static exports found */
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
    if (isNaN(maxAge)) throw new Error('maxAge should be a Number');
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

/***/ "../../../../../node_modules/define-properties/index.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/define-properties/index.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = __webpack_require__(/*! object-keys */ "../../../../../node_modules/object-keys/index.js");
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;


/***/ }),

/***/ "../../../../../node_modules/emittery/index.js":
/*!***********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/emittery/index.js ***!
  \***********************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/es-abstract/GetIntrinsic.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/GetIntrinsic.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* globals
	Atomics,
	SharedArrayBuffer,
*/

var undefined; // eslint-disable-line no-shadow-restricted-names

var $TypeError = TypeError;

var ThrowTypeError = Object.getOwnPropertyDescriptor
	? (function () { return Object.getOwnPropertyDescriptor(arguments, 'callee').get; }())
	: function () { throw new $TypeError(); };

var hasSymbols = __webpack_require__(/*! has-symbols */ "../../../../../node_modules/has-symbols/index.js")();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var generator; // = function * () {};
var generatorFunction = generator ? getProto(generator) : undefined;
var asyncFn; // async function() {};
var asyncFunction = asyncFn ? asyncFn.constructor : undefined;
var asyncGen; // async function * () {};
var asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;
var asyncGenIterator = asyncGen ? asyncGen() : undefined;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'$ %Array%': Array,
	'$ %ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'$ %ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,
	'$ %ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'$ %ArrayPrototype%': Array.prototype,
	'$ %ArrayProto_entries%': Array.prototype.entries,
	'$ %ArrayProto_forEach%': Array.prototype.forEach,
	'$ %ArrayProto_keys%': Array.prototype.keys,
	'$ %ArrayProto_values%': Array.prototype.values,
	'$ %AsyncFromSyncIteratorPrototype%': undefined,
	'$ %AsyncFunction%': asyncFunction,
	'$ %AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,
	'$ %AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,
	'$ %AsyncGeneratorFunction%': asyncGenFunction,
	'$ %AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,
	'$ %AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,
	'$ %Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'$ %Boolean%': Boolean,
	'$ %BooleanPrototype%': Boolean.prototype,
	'$ %DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'$ %DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,
	'$ %Date%': Date,
	'$ %DatePrototype%': Date.prototype,
	'$ %decodeURI%': decodeURI,
	'$ %decodeURIComponent%': decodeURIComponent,
	'$ %encodeURI%': encodeURI,
	'$ %encodeURIComponent%': encodeURIComponent,
	'$ %Error%': Error,
	'$ %ErrorPrototype%': Error.prototype,
	'$ %eval%': eval, // eslint-disable-line no-eval
	'$ %EvalError%': EvalError,
	'$ %EvalErrorPrototype%': EvalError.prototype,
	'$ %Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'$ %Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,
	'$ %Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'$ %Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,
	'$ %Function%': Function,
	'$ %FunctionPrototype%': Function.prototype,
	'$ %Generator%': generator ? getProto(generator()) : undefined,
	'$ %GeneratorFunction%': generatorFunction,
	'$ %GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,
	'$ %Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'$ %Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,
	'$ %Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'$ %Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,
	'$ %Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'$ %Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,
	'$ %isFinite%': isFinite,
	'$ %isNaN%': isNaN,
	'$ %IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'$ %JSON%': JSON,
	'$ %JSONParse%': JSON.parse,
	'$ %Map%': typeof Map === 'undefined' ? undefined : Map,
	'$ %MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'$ %MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,
	'$ %Math%': Math,
	'$ %Number%': Number,
	'$ %NumberPrototype%': Number.prototype,
	'$ %Object%': Object,
	'$ %ObjectPrototype%': Object.prototype,
	'$ %ObjProto_toString%': Object.prototype.toString,
	'$ %ObjProto_valueOf%': Object.prototype.valueOf,
	'$ %parseFloat%': parseFloat,
	'$ %parseInt%': parseInt,
	'$ %Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'$ %PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,
	'$ %PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,
	'$ %Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,
	'$ %Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,
	'$ %Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,
	'$ %Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'$ %RangeError%': RangeError,
	'$ %RangeErrorPrototype%': RangeError.prototype,
	'$ %ReferenceError%': ReferenceError,
	'$ %ReferenceErrorPrototype%': ReferenceError.prototype,
	'$ %Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'$ %RegExp%': RegExp,
	'$ %RegExpPrototype%': RegExp.prototype,
	'$ %Set%': typeof Set === 'undefined' ? undefined : Set,
	'$ %SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'$ %SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,
	'$ %SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'$ %SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,
	'$ %String%': String,
	'$ %StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'$ %StringPrototype%': String.prototype,
	'$ %Symbol%': hasSymbols ? Symbol : undefined,
	'$ %SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,
	'$ %SyntaxError%': SyntaxError,
	'$ %SyntaxErrorPrototype%': SyntaxError.prototype,
	'$ %ThrowTypeError%': ThrowTypeError,
	'$ %TypedArray%': TypedArray,
	'$ %TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,
	'$ %TypeError%': $TypeError,
	'$ %TypeErrorPrototype%': $TypeError.prototype,
	'$ %Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'$ %Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,
	'$ %Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'$ %Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,
	'$ %Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'$ %Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,
	'$ %Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'$ %Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,
	'$ %URIError%': URIError,
	'$ %URIErrorPrototype%': URIError.prototype,
	'$ %WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'$ %WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,
	'$ %WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
	'$ %WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype
};

var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");
var $replace = bind.call(Function.call, String.prototype.replace);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : (number || match);
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	var key = '$ ' + name;
	if (!(key in INTRINSICS)) {
		throw new SyntaxError('intrinsic ' + name + ' does not exist!');
	}

	// istanbul ignore if // hopefully this is impossible to test :-)
	if (typeof INTRINSICS[key] === 'undefined' && !allowMissing) {
		throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
	}

	return INTRINSICS[key];
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);

	if (parts.length === 0) {
		return getBaseIntrinsic(name, allowMissing);
	}

	var value = getBaseIntrinsic('%' + parts[0] + '%', allowMissing);
	for (var i = 1; i < parts.length; i += 1) {
		if (value != null) {
			value = value[parts[i]];
		}
	}
	return value;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/es2015.js":
/*!***************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/es2015.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = __webpack_require__(/*! has */ "../../../../../node_modules/has/src/index.js");
var toPrimitive = __webpack_require__(/*! es-to-primitive/es6 */ "../../../../../node_modules/es-to-primitive/es6.js");
var keys = __webpack_require__(/*! object-keys */ "../../../../../node_modules/object-keys/index.js");
var inspect = __webpack_require__(/*! object-inspect */ "../../../../../node_modules/object-inspect/index.js");

var GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $TypeError = GetIntrinsic('%TypeError%');
var $RangeError = GetIntrinsic('%RangeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');
var $Array = GetIntrinsic('%Array%');
var $ArrayPrototype = $Array.prototype;
var $String = GetIntrinsic('%String%');
var $Object = GetIntrinsic('%Object%');
var $Number = GetIntrinsic('%Number%');
var $Symbol = GetIntrinsic('%Symbol%', true);
var $RegExp = GetIntrinsic('%RegExp%');
var $Date = GetIntrinsic('%Date%');
var $Function = GetIntrinsic('%Function%');
var $preventExtensions = $Object.preventExtensions;

var hasSymbols = __webpack_require__(/*! has-symbols */ "../../../../../node_modules/has-symbols/index.js")();

var assertRecord = __webpack_require__(/*! ./helpers/assertRecord */ "../../../../../node_modules/es-abstract/helpers/assertRecord.js");
var $isNaN = __webpack_require__(/*! ./helpers/isNaN */ "../../../../../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__(/*! ./helpers/isFinite */ "../../../../../node_modules/es-abstract/helpers/isFinite.js");
var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;
var MAX_SAFE_INTEGER = __webpack_require__(/*! ./helpers/maxSafeInteger */ "../../../../../node_modules/es-abstract/helpers/maxSafeInteger.js");

var assign = __webpack_require__(/*! ./helpers/assign */ "../../../../../node_modules/es-abstract/helpers/assign.js");
var sign = __webpack_require__(/*! ./helpers/sign */ "../../../../../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__(/*! ./helpers/mod */ "../../../../../node_modules/es-abstract/helpers/mod.js");
var isPrimitive = __webpack_require__(/*! ./helpers/isPrimitive */ "../../../../../node_modules/es-abstract/helpers/isPrimitive.js");
var forEach = __webpack_require__(/*! ./helpers/forEach */ "../../../../../node_modules/es-abstract/helpers/forEach.js");
var every = __webpack_require__(/*! ./helpers/every */ "../../../../../node_modules/es-abstract/helpers/every.js");
var isSamePropertyDescriptor = __webpack_require__(/*! ./helpers/isSamePropertyDescriptor */ "../../../../../node_modules/es-abstract/helpers/isSamePropertyDescriptor.js");
var isPropertyDescriptor = __webpack_require__(/*! ./helpers/isPropertyDescriptor */ "../../../../../node_modules/es-abstract/helpers/isPropertyDescriptor.js");
var parseInteger = parseInt;
var callBound = __webpack_require__(/*! ./helpers/callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");
var regexTester = __webpack_require__(/*! ./helpers/regexTester */ "../../../../../node_modules/es-abstract/helpers/regexTester.js");
var getIteratorMethod = __webpack_require__(/*! ./helpers/getIteratorMethod */ "../../../../../node_modules/es-abstract/helpers/getIteratorMethod.js");
var getSymbolDescription = __webpack_require__(/*! ./helpers/getSymbolDescription */ "../../../../../node_modules/es-abstract/helpers/getSymbolDescription.js");

var $PromiseThen = callBound('Promise.prototype.then', true);
var arraySlice = callBound('Array.prototype.slice');
var strSlice = callBound('String.prototype.slice');
var $indexOf = callBound('Array.prototype.indexOf');
var $push = callBound('Array.prototype.push');

var isBinary = regexTester(/^0b[01]+$/i);
var isOctal = regexTester(/^0o[0-7]+$/i);
var isDigit = regexTester(/^[0-9]$/);
var regexExec = callBound('RegExp.prototype.exec');
var nonWS = ['\u0085', '\u200b', '\ufffe'].join('');
var nonWSregex = new $RegExp('[' + nonWS + ']', 'g');
var hasNonWS = regexTester(nonWSregex);
var isInvalidHexLiteral = regexTester(/^[-+]0x[0-9a-f]+$/i);
var $charCodeAt = callBound('String.prototype.charCodeAt');
var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

var toStr = callBound('Object.prototype.toString');

var $NumberValueOf = callBound('Number.prototype.valueOf');
var $BooleanValueOf = callBound('Boolean.prototype.valueOf');
var $StringValueOf = callBound('String.prototype.valueOf');
var $DateValueOf = callBound('Date.prototype.valueOf');
var $SymbolToString = callBound('Symbol.prototype.toString', true);

var $floor = Math.floor;
var $abs = Math.abs;

var $ObjectCreate = $Object.create;
var $gOPD = $Object.getOwnPropertyDescriptor;
var $gOPN = $Object.getOwnPropertyNames;
var $gOPS = $Object.getOwnPropertySymbols;
var $isExtensible = $Object.isExtensible;
var $defineProperty = $Object.defineProperty;
var $setProto = __webpack_require__(/*! ./helpers/setProto */ "../../../../../node_modules/es-abstract/helpers/setProto.js");

var DefineOwnProperty = function DefineOwnProperty(ES, O, P, desc) {
	if (!$defineProperty) {
		if (!ES.IsDataDescriptor(desc)) {
			// ES3 does not support getters/setters
			return false;
		}
		if (!desc['[[Configurable]]'] || !desc['[[Writable]]']) {
			return false;
		}

		// fallback for ES3
		if (P in O && $isEnumerable(O, P) !== !!desc['[[Enumerable]]']) {
			// a non-enumerable existing property
			return false;
		}

		// property does not exist at all, or exists but is enumerable
		var V = desc['[[Value]]'];
		O[P] = V; // will use [[Define]]
		return ES.SameValue(O[P], V);
	}
	$defineProperty(O, P, ES.FromPropertyDescriptor(desc));
	return true;
};

// whitespace from: https://es5.github.io/#x15.5.4.20
// implementation from https://github.com/es-shims/es5-shim/blob/v3.4.0/es5-shim.js#L1304-L1324
var ws = [
	'\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003',
	'\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028',
	'\u2029\uFEFF'
].join('');
var trimRegex = new RegExp('(^[' + ws + ']+)|([' + ws + ']+$)', 'g');
var $replace = callBound('String.prototype.replace');
var trim = function (value) {
	return $replace(value, trimRegex, '');
};

var ES5 = __webpack_require__(/*! ./es5 */ "../../../../../node_modules/es-abstract/es5.js");

var hasRegExpMatcher = __webpack_require__(/*! is-regex */ "../../../../../node_modules/is-regex/index.js");

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
var ES6 = assign(assign({}, ES5), {

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-call-f-v-args
	Call: function Call(F, V) {
		var args = arguments.length > 2 ? arguments[2] : [];
		if (!this.IsCallable(F)) {
			throw new $TypeError(inspect(F) + ' is not a function');
		}
		return F.apply(V, args);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toprimitive
	ToPrimitive: toPrimitive,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toboolean
	// ToBoolean: ES5.ToBoolean,

	// https://ecma-international.org/ecma-262/6.0/#sec-tonumber
	ToNumber: function ToNumber(argument) {
		var value = isPrimitive(argument) ? argument : toPrimitive(argument, $Number);
		if (typeof value === 'symbol') {
			throw new $TypeError('Cannot convert a Symbol value to a number');
		}
		if (typeof value === 'string') {
			if (isBinary(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 2));
			} else if (isOctal(value)) {
				return this.ToNumber(parseInteger(strSlice(value, 2), 8));
			} else if (hasNonWS(value) || isInvalidHexLiteral(value)) {
				return NaN;
			} else {
				var trimmed = trim(value);
				if (trimmed !== value) {
					return this.ToNumber(trimmed);
				}
			}
		}
		return $Number(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tointeger
	// ToInteger: ES5.ToNumber,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint32
	// ToInt32: ES5.ToInt32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint32
	// ToUint32: ES5.ToUint32,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint16
	ToInt16: function ToInt16(argument) {
		var int16bit = this.ToUint16(argument);
		return int16bit >= 0x8000 ? int16bit - 0x10000 : int16bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint16
	// ToUint16: ES5.ToUint16,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toint8
	ToInt8: function ToInt8(argument) {
		var int8bit = this.ToUint8(argument);
		return int8bit >= 0x80 ? int8bit - 0x100 : int8bit;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8
	ToUint8: function ToUint8(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * $floor($abs(number));
		return mod(posInt, 0x100);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-touint8clamp
	ToUint8Clamp: function ToUint8Clamp(argument) {
		var number = this.ToNumber(argument);
		if ($isNaN(number) || number <= 0) { return 0; }
		if (number >= 0xFF) { return 0xFF; }
		var f = $floor(argument);
		if (f + 0.5 < number) { return f + 1; }
		if (number < f + 0.5) { return f; }
		if (f % 2 !== 0) { return f + 1; }
		return f;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
	ToString: function ToString(argument) {
		if (typeof argument === 'symbol') {
			throw new $TypeError('Cannot convert a Symbol value to a string');
		}
		return $String(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-toobject
	ToObject: function ToObject(value) {
		this.RequireObjectCoercible(value);
		return $Object(value);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-topropertykey
	ToPropertyKey: function ToPropertyKey(argument) {
		var key = this.ToPrimitive(argument, $String);
		return typeof key === 'symbol' ? key : this.ToString(key);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	ToLength: function ToLength(argument) {
		var len = this.ToInteger(argument);
		if (len <= 0) { return 0; } // includes converting -0 to +0
		if (len > MAX_SAFE_INTEGER) { return MAX_SAFE_INTEGER; }
		return len;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-canonicalnumericindexstring
	CanonicalNumericIndexString: function CanonicalNumericIndexString(argument) {
		if (toStr(argument) !== '[object String]') {
			throw new $TypeError('must be a string');
		}
		if (argument === '-0') { return -0; }
		var n = this.ToNumber(argument);
		if (this.SameValue(this.ToString(n), argument)) { return n; }
		return void 0;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-requireobjectcoercible
	RequireObjectCoercible: ES5.CheckObjectCoercible,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isarray
	IsArray: $Array.isArray || function IsArray(argument) {
		return toStr(argument) === '[object Array]';
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-iscallable
	// IsCallable: ES5.IsCallable,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isconstructor
	IsConstructor: function IsConstructor(argument) {
		return typeof argument === 'function' && !!argument.prototype; // unfortunately there's no way to truly check this without try/catch `new argument` or Proxy
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isextensible-o
	IsExtensible: $preventExtensions
		? function IsExtensible(obj) {
			if (isPrimitive(obj)) {
				return false;
			}
			return $isExtensible(obj);
		}
		: function isExtensible(obj) { return true; }, // eslint-disable-line no-unused-vars

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-isinteger
	IsInteger: function IsInteger(argument) {
		if (typeof argument !== 'number' || $isNaN(argument) || !$isFinite(argument)) {
			return false;
		}
		var abs = $abs(argument);
		return $floor(abs) === abs;
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-ispropertykey
	IsPropertyKey: function IsPropertyKey(argument) {
		return typeof argument === 'string' || typeof argument === 'symbol';
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-isregexp
	IsRegExp: function IsRegExp(argument) {
		if (!argument || typeof argument !== 'object') {
			return false;
		}
		if (hasSymbols) {
			var isRegExp = argument[$Symbol.match];
			if (typeof isRegExp !== 'undefined') {
				return ES5.ToBoolean(isRegExp);
			}
		}
		return hasRegExpMatcher(argument);
	},

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevalue
	// SameValue: ES5.SameValue,

	// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero
	SameValueZero: function SameValueZero(x, y) {
		return (x === y) || ($isNaN(x) && $isNaN(y));
	},

	/**
	 * 7.3.2 GetV (V, P)
	 * 1. Assert: IsPropertyKey(P) is true.
	 * 2. Let O be ToObject(V).
	 * 3. ReturnIfAbrupt(O).
	 * 4. Return O.[[Get]](P, V).
	 */
	GetV: function GetV(V, P) {
		// 7.3.2.1
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.2.2-3
		var O = this.ToObject(V);

		// 7.3.2.4
		return O[P];
	},

	/**
	 * 7.3.9 - https://ecma-international.org/ecma-262/6.0/#sec-getmethod
	 * 1. Assert: IsPropertyKey(P) is true.
	 * 2. Let func be GetV(O, P).
	 * 3. ReturnIfAbrupt(func).
	 * 4. If func is either undefined or null, return undefined.
	 * 5. If IsCallable(func) is false, throw a TypeError exception.
	 * 6. Return func.
	 */
	GetMethod: function GetMethod(O, P) {
		// 7.3.9.1
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		// 7.3.9.2
		var func = this.GetV(O, P);

		// 7.3.9.4
		if (func == null) {
			return void 0;
		}

		// 7.3.9.5
		if (!this.IsCallable(func)) {
			throw new $TypeError(P + 'is not a function');
		}

		// 7.3.9.6
		return func;
	},

	/**
	 * 7.3.1 Get (O, P) - https://ecma-international.org/ecma-262/6.0/#sec-get-o-p
	 * 1. Assert: Type(O) is Object.
	 * 2. Assert: IsPropertyKey(P) is true.
	 * 3. Return O.[[Get]](P, O).
	 */
	Get: function Get(O, P) {
		// 7.3.1.1
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		// 7.3.1.2
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true, got ' + inspect(P));
		}
		// 7.3.1.3
		return O[P];
	},

	Type: function Type(x) {
		if (typeof x === 'symbol') {
			return 'Symbol';
		}
		return ES5.Type(x);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-speciesconstructor
	SpeciesConstructor: function SpeciesConstructor(O, defaultConstructor) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		var C = O.constructor;
		if (typeof C === 'undefined') {
			return defaultConstructor;
		}
		if (this.Type(C) !== 'Object') {
			throw new $TypeError('O.constructor is not an Object');
		}
		var S = hasSymbols && $Symbol.species ? C[$Symbol.species] : void 0;
		if (S == null) {
			return defaultConstructor;
		}
		if (this.IsConstructor(S)) {
			return S;
		}
		throw new $TypeError('no constructor found');
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-frompropertydescriptor
	FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return Desc;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		var obj = {};
		if ('[[Value]]' in Desc) {
			obj.value = Desc['[[Value]]'];
		}
		if ('[[Writable]]' in Desc) {
			obj.writable = Desc['[[Writable]]'];
		}
		if ('[[Get]]' in Desc) {
			obj.get = Desc['[[Get]]'];
		}
		if ('[[Set]]' in Desc) {
			obj.set = Desc['[[Set]]'];
		}
		if ('[[Enumerable]]' in Desc) {
			obj.enumerable = Desc['[[Enumerable]]'];
		}
		if ('[[Configurable]]' in Desc) {
			obj.configurable = Desc['[[Configurable]]'];
		}
		return obj;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-completepropertydescriptor
	CompletePropertyDescriptor: function CompletePropertyDescriptor(Desc) {
		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
			if (!has(Desc, '[[Value]]')) {
				Desc['[[Value]]'] = void 0;
			}
			if (!has(Desc, '[[Writable]]')) {
				Desc['[[Writable]]'] = false;
			}
		} else {
			if (!has(Desc, '[[Get]]')) {
				Desc['[[Get]]'] = void 0;
			}
			if (!has(Desc, '[[Set]]')) {
				Desc['[[Set]]'] = void 0;
			}
		}
		if (!has(Desc, '[[Enumerable]]')) {
			Desc['[[Enumerable]]'] = false;
		}
		if (!has(Desc, '[[Configurable]]')) {
			Desc['[[Configurable]]'] = false;
		}
		return Desc;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-set-o-p-v-throw
	Set: function Set(O, P, V, Throw) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('P must be a Property Key');
		}
		if (this.Type(Throw) !== 'Boolean') {
			throw new $TypeError('Throw must be a Boolean');
		}
		if (Throw) {
			O[P] = V;
			return true;
		} else {
			try {
				O[P] = V;
			} catch (e) {
				return false;
			}
		}
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-hasownproperty
	HasOwnProperty: function HasOwnProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('P must be a Property Key');
		}
		return has(O, P);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-hasproperty
	HasProperty: function HasProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('P must be a Property Key');
		}
		return P in O;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-isconcatspreadable
	IsConcatSpreadable: function IsConcatSpreadable(O) {
		if (this.Type(O) !== 'Object') {
			return false;
		}
		if (hasSymbols && typeof $Symbol.isConcatSpreadable === 'symbol') {
			var spreadable = this.Get(O, Symbol.isConcatSpreadable);
			if (typeof spreadable !== 'undefined') {
				return this.ToBoolean(spreadable);
			}
		}
		return this.IsArray(O);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-invoke
	Invoke: function Invoke(O, P) {
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('P must be a Property Key');
		}
		var argumentsList = arraySlice(arguments, 2);
		var func = this.GetV(O, P);
		return this.Call(func, O, argumentsList);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-getiterator
	GetIterator: function GetIterator(obj, method) {
		var actualMethod = method;
		if (arguments.length < 2) {
			actualMethod = getIteratorMethod(this, obj);
		}
		var iterator = this.Call(actualMethod, obj);
		if (this.Type(iterator) !== 'Object') {
			throw new $TypeError('iterator must return an object');
		}

		return iterator;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-iteratornext
	IteratorNext: function IteratorNext(iterator, value) {
		var result = this.Invoke(iterator, 'next', arguments.length < 2 ? [] : [value]);
		if (this.Type(result) !== 'Object') {
			throw new $TypeError('iterator next must return an object');
		}
		return result;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-iteratorcomplete
	IteratorComplete: function IteratorComplete(iterResult) {
		if (this.Type(iterResult) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
		}
		return this.ToBoolean(this.Get(iterResult, 'done'));
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-iteratorvalue
	IteratorValue: function IteratorValue(iterResult) {
		if (this.Type(iterResult) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(iterResult) is not Object');
		}
		return this.Get(iterResult, 'value');
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-iteratorstep
	IteratorStep: function IteratorStep(iterator) {
		var result = this.IteratorNext(iterator);
		var done = this.IteratorComplete(result);
		return done === true ? false : result;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-iteratorclose
	IteratorClose: function IteratorClose(iterator, completion) {
		if (this.Type(iterator) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(iterator) is not Object');
		}
		if (!this.IsCallable(completion)) {
			throw new $TypeError('Assertion failed: completion is not a thunk for a Completion Record');
		}
		var completionThunk = completion;

		var iteratorReturn = this.GetMethod(iterator, 'return');

		if (typeof iteratorReturn === 'undefined') {
			return completionThunk();
		}

		var completionRecord;
		try {
			var innerResult = this.Call(iteratorReturn, iterator, []);
		} catch (e) {
			// if we hit here, then "e" is the innerResult completion that needs re-throwing

			// if the completion is of type "throw", this will throw.
			completionRecord = completionThunk();
			completionThunk = null; // ensure it's not called twice.

			// if not, then return the innerResult completion
			throw e;
		}
		completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
		completionThunk = null; // ensure it's not called twice.

		if (this.Type(innerResult) !== 'Object') {
			throw new $TypeError('iterator .return must return an object');
		}

		return completionRecord;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-createiterresultobject
	CreateIterResultObject: function CreateIterResultObject(value, done) {
		if (this.Type(done) !== 'Boolean') {
			throw new $TypeError('Assertion failed: Type(done) is not Boolean');
		}
		return {
			value: value,
			done: done
		};
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-regexpexec
	RegExpExec: function RegExpExec(R, S) {
		if (this.Type(R) !== 'Object') {
			throw new $TypeError('R must be an Object');
		}
		if (this.Type(S) !== 'String') {
			throw new $TypeError('S must be a String');
		}
		var exec = this.Get(R, 'exec');
		if (this.IsCallable(exec)) {
			var result = this.Call(exec, R, [S]);
			if (result === null || this.Type(result) === 'Object') {
				return result;
			}
			throw new $TypeError('"exec" method must return `null` or an Object');
		}
		return regexExec(R, S);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-arrayspeciescreate
	ArraySpeciesCreate: function ArraySpeciesCreate(originalArray, length) {
		if (!this.IsInteger(length) || length < 0) {
			throw new $TypeError('Assertion failed: length must be an integer >= 0');
		}
		var len = length === 0 ? 0 : length;
		var C;
		var isArray = this.IsArray(originalArray);
		if (isArray) {
			C = this.Get(originalArray, 'constructor');
			// TODO: figure out how to make a cross-realm normal Array, a same-realm Array
			// if (this.IsConstructor(C)) {
			// 	if C is another realm's Array, C = undefined
			// 	Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(Array))) === null ?
			// }
			if (this.Type(C) === 'Object' && hasSymbols && $Symbol.species) {
				C = this.Get(C, $Symbol.species);
				if (C === null) {
					C = void 0;
				}
			}
		}
		if (typeof C === 'undefined') {
			return $Array(len);
		}
		if (!this.IsConstructor(C)) {
			throw new $TypeError('C must be a constructor');
		}
		return new C(len); // this.Construct(C, len);
	},

	CreateDataProperty: function CreateDataProperty(O, P, V) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		var oldDesc = $gOPD(O, P);
		var extensible = oldDesc || this.IsExtensible(O);
		var immutable = oldDesc && (!oldDesc.writable || !oldDesc.configurable);
		if (immutable || !extensible) {
			return false;
		}
		return DefineOwnProperty(this, O, P, {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Value]]': V,
			'[[Writable]]': true
		});
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-createdatapropertyorthrow
	CreateDataPropertyOrThrow: function CreateDataPropertyOrThrow(O, P, V) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}
		var success = this.CreateDataProperty(O, P, V);
		if (!success) {
			throw new $TypeError('unable to create data property');
		}
		return success;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-objectcreate
	ObjectCreate: function ObjectCreate(proto, internalSlotsList) {
		if (proto !== null && this.Type(proto) !== 'Object') {
			throw new $TypeError('Assertion failed: proto must be null or an object');
		}
		var slots = arguments.length < 2 ? [] : internalSlotsList;
		if (slots.length > 0) {
			throw new $SyntaxError('es-abstract does not yet support internal slots');
		}

		if (proto === null && !$ObjectCreate) {
			throw new $SyntaxError('native Object.create support is required to create null objects');
		}

		return $ObjectCreate(proto);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-advancestringindex
	AdvanceStringIndex: function AdvanceStringIndex(S, index, unicode) {
		if (this.Type(S) !== 'String') {
			throw new $TypeError('S must be a String');
		}
		if (!this.IsInteger(index) || index < 0 || index > MAX_SAFE_INTEGER) {
			throw new $TypeError('Assertion failed: length must be an integer >= 0 and <= 2**53');
		}
		if (this.Type(unicode) !== 'Boolean') {
			throw new $TypeError('Assertion failed: unicode must be a Boolean');
		}
		if (!unicode) {
			return index + 1;
		}
		var length = S.length;
		if ((index + 1) >= length) {
			return index + 1;
		}

		var first = $charCodeAt(S, index);
		if (first < 0xD800 || first > 0xDBFF) {
			return index + 1;
		}

		var second = $charCodeAt(S, index + 1);
		if (second < 0xDC00 || second > 0xDFFF) {
			return index + 1;
		}

		return index + 2;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-createmethodproperty
	CreateMethodProperty: function CreateMethodProperty(O, P, V) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}

		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		var newDesc = {
			'[[Configurable]]': true,
			'[[Enumerable]]': false,
			'[[Value]]': V,
			'[[Writable]]': true
		};
		return DefineOwnProperty(this, O, P, newDesc);
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-definepropertyorthrow
	DefinePropertyOrThrow: function DefinePropertyOrThrow(O, P, desc) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}

		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		var Desc = isPropertyDescriptor(this, desc) ? desc : this.ToPropertyDescriptor(desc);
		if (!isPropertyDescriptor(this, Desc)) {
			throw new $TypeError('Assertion failed: Desc is not a valid Property Descriptor');
		}

		return DefineOwnProperty(this, O, P, Desc);
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-deletepropertyorthrow
	DeletePropertyOrThrow: function DeletePropertyOrThrow(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}

		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: IsPropertyKey(P) is not true');
		}

		var success = delete O[P];
		if (!success) {
			throw new TypeError('Attempt to delete property failed.');
		}
		return success;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-enumerableownnames
	EnumerableOwnNames: function EnumerableOwnNames(O) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}

		return keys(O);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-number-prototype-object
	thisNumberValue: function thisNumberValue(value) {
		if (this.Type(value) === 'Number') {
			return value;
		}

		return $NumberValueOf(value);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-boolean-prototype-object
	thisBooleanValue: function thisBooleanValue(value) {
		if (this.Type(value) === 'Boolean') {
			return value;
		}

		return $BooleanValueOf(value);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-string-prototype-object
	thisStringValue: function thisStringValue(value) {
		if (this.Type(value) === 'String') {
			return value;
		}

		return $StringValueOf(value);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-date-prototype-object
	thisTimeValue: function thisTimeValue(value) {
		return $DateValueOf(value);
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-setintegritylevel
	SetIntegrityLevel: function SetIntegrityLevel(O, level) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		if (level !== 'sealed' && level !== 'frozen') {
			throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
		}
		if (!$preventExtensions) {
			throw new $SyntaxError('SetIntegrityLevel requires native `Object.preventExtensions` support');
		}
		var status = $preventExtensions(O);
		if (!status) {
			return false;
		}
		if (!$gOPN) {
			throw new $SyntaxError('SetIntegrityLevel requires native `Object.getOwnPropertyNames` support');
		}
		var theKeys = $gOPN(O);
		var ES = this;
		if (level === 'sealed') {
			forEach(theKeys, function (k) {
				ES.DefinePropertyOrThrow(O, k, { configurable: false });
			});
		} else if (level === 'frozen') {
			forEach(theKeys, function (k) {
				var currentDesc = $gOPD(O, k);
				if (typeof currentDesc !== 'undefined') {
					var desc;
					if (ES.IsAccessorDescriptor(ES.ToPropertyDescriptor(currentDesc))) {
						desc = { configurable: false };
					} else {
						desc = { configurable: false, writable: false };
					}
					ES.DefinePropertyOrThrow(O, k, desc);
				}
			});
		}
		return true;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-testintegritylevel
	TestIntegrityLevel: function TestIntegrityLevel(O, level) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		if (level !== 'sealed' && level !== 'frozen') {
			throw new $TypeError('Assertion failed: `level` must be `"sealed"` or `"frozen"`');
		}
		var status = this.IsExtensible(O);
		if (status) {
			return false;
		}
		var theKeys = $gOPN(O);
		var ES = this;
		return theKeys.length === 0 || every(theKeys, function (k) {
			var currentDesc = $gOPD(O, k);
			if (typeof currentDesc !== 'undefined') {
				if (currentDesc.configurable) {
					return false;
				}
				if (level === 'frozen' && ES.IsDataDescriptor(ES.ToPropertyDescriptor(currentDesc)) && currentDesc.writable) {
					return false;
				}
			}
			return true;
		});
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasinstance
	OrdinaryHasInstance: function OrdinaryHasInstance(C, O) {
		if (this.IsCallable(C) === false) {
			return false;
		}
		if (this.Type(O) !== 'Object') {
			return false;
		}
		var P = this.Get(C, 'prototype');
		if (this.Type(P) !== 'Object') {
			throw new $TypeError('OrdinaryHasInstance called on an object with an invalid prototype property.');
		}
		return O instanceof C;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinaryhasproperty
	OrdinaryHasProperty: function OrdinaryHasProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: P must be a Property Key');
		}
		return P in O;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-instanceofoperator
	InstanceofOperator: function InstanceofOperator(O, C) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		var instOfHandler = hasSymbols && $Symbol.hasInstance ? this.GetMethod(C, $Symbol.hasInstance) : void 0;
		if (typeof instOfHandler !== 'undefined') {
			return this.ToBoolean(this.Call(instOfHandler, C, [O]));
		}
		if (!this.IsCallable(C)) {
			throw new $TypeError('`C` is not Callable');
		}
		return this.OrdinaryHasInstance(C, O);
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-ispromise
	IsPromise: function IsPromise(x) {
		if (this.Type(x) !== 'Object') {
			return false;
		}
		if (!$PromiseThen) { // Promises are not supported
			return false;
		}
		try {
			$PromiseThen(x); // throws if not a promise
		} catch (e) {
			return false;
		}
		return true;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-abstract-equality-comparison
	'Abstract Equality Comparison': function AbstractEqualityComparison(x, y) {
		var xType = this.Type(x);
		var yType = this.Type(y);
		if (xType === yType) {
			return x === y; // ES6+ specified this shortcut anyways.
		}
		if (x == null && y == null) {
			return true;
		}
		if (xType === 'Number' && yType === 'String') {
			return this['Abstract Equality Comparison'](x, this.ToNumber(y));
		}
		if (xType === 'String' && yType === 'Number') {
			return this['Abstract Equality Comparison'](this.ToNumber(x), y);
		}
		if (xType === 'Boolean') {
			return this['Abstract Equality Comparison'](this.ToNumber(x), y);
		}
		if (yType === 'Boolean') {
			return this['Abstract Equality Comparison'](x, this.ToNumber(y));
		}
		if ((xType === 'String' || xType === 'Number' || xType === 'Symbol') && yType === 'Object') {
			return this['Abstract Equality Comparison'](x, this.ToPrimitive(y));
		}
		if (xType === 'Object' && (yType === 'String' || yType === 'Number' || yType === 'Symbol')) {
			return this['Abstract Equality Comparison'](this.ToPrimitive(x), y);
		}
		return false;
	},

	// eslint-disable-next-line max-lines-per-function, max-statements, id-length, max-params
	ValidateAndApplyPropertyDescriptor: function ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current) {
		// this uses the ES2017+ logic, since it fixes a number of bugs in the ES2015 logic.
		var oType = this.Type(O);
		if (oType !== 'Undefined' && oType !== 'Object') {
			throw new $TypeError('Assertion failed: O must be undefined or an Object');
		}
		if (this.Type(extensible) !== 'Boolean') {
			throw new $TypeError('Assertion failed: extensible must be a Boolean');
		}
		if (!isPropertyDescriptor(this, Desc)) {
			throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
		}
		if (this.Type(current) !== 'Undefined' && !isPropertyDescriptor(this, current)) {
			throw new $TypeError('Assertion failed: current must be a Property Descriptor, or undefined');
		}
		if (oType !== 'Undefined' && !this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: if O is not undefined, P must be a Property Key');
		}
		if (this.Type(current) === 'Undefined') {
			if (!extensible) {
				return false;
			}
			if (this.IsGenericDescriptor(Desc) || this.IsDataDescriptor(Desc)) {
				if (oType !== 'Undefined') {
					DefineOwnProperty(this, O, P, {
						'[[Configurable]]': Desc['[[Configurable]]'],
						'[[Enumerable]]': Desc['[[Enumerable]]'],
						'[[Value]]': Desc['[[Value]]'],
						'[[Writable]]': Desc['[[Writable]]']
					});
				}
			} else {
				if (!this.IsAccessorDescriptor(Desc)) {
					throw new $TypeError('Assertion failed: Desc is not an accessor descriptor');
				}
				if (oType !== 'Undefined') {
					return DefineOwnProperty(this, O, P, Desc);
				}
			}
			return true;
		}
		if (this.IsGenericDescriptor(Desc) && !('[[Configurable]]' in Desc) && !('[[Enumerable]]' in Desc)) {
			return true;
		}
		if (isSamePropertyDescriptor(this, Desc, current)) {
			return true; // removed by ES2017, but should still be correct
		}
		// "if every field in Desc is absent, return true" can't really match the assertion that it's a Property Descriptor
		if (!current['[[Configurable]]']) {
			if (Desc['[[Configurable]]']) {
				return false;
			}
			if ('[[Enumerable]]' in Desc && !Desc['[[Enumerable]]'] === !!current['[[Enumerable]]']) {
				return false;
			}
		}
		if (this.IsGenericDescriptor(Desc)) {
			// no further validation is required.
		} else if (this.IsDataDescriptor(current) !== this.IsDataDescriptor(Desc)) {
			if (!current['[[Configurable]]']) {
				return false;
			}
			if (this.IsDataDescriptor(current)) {
				if (oType !== 'Undefined') {
					DefineOwnProperty(this, O, P, {
						'[[Configurable]]': current['[[Configurable]]'],
						'[[Enumerable]]': current['[[Enumerable]]'],
						'[[Get]]': undefined
					});
				}
			} else if (oType !== 'Undefined') {
				DefineOwnProperty(this, O, P, {
					'[[Configurable]]': current['[[Configurable]]'],
					'[[Enumerable]]': current['[[Enumerable]]'],
					'[[Value]]': undefined
				});
			}
		} else if (this.IsDataDescriptor(current) && this.IsDataDescriptor(Desc)) {
			if (!current['[[Configurable]]'] && !current['[[Writable]]']) {
				if ('[[Writable]]' in Desc && Desc['[[Writable]]']) {
					return false;
				}
				if ('[[Value]]' in Desc && !this.SameValue(Desc['[[Value]]'], current['[[Value]]'])) {
					return false;
				}
				return true;
			}
		} else if (this.IsAccessorDescriptor(current) && this.IsAccessorDescriptor(Desc)) {
			if (!current['[[Configurable]]']) {
				if ('[[Set]]' in Desc && !this.SameValue(Desc['[[Set]]'], current['[[Set]]'])) {
					return false;
				}
				if ('[[Get]]' in Desc && !this.SameValue(Desc['[[Get]]'], current['[[Get]]'])) {
					return false;
				}
				return true;
			}
		} else {
			throw new $TypeError('Assertion failed: current and Desc are not both data, both accessors, or one accessor and one data.');
		}
		if (oType !== 'Undefined') {
			return DefineOwnProperty(this, O, P, Desc);
		}
		return true;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarydefineownproperty
	OrdinaryDefineOwnProperty: function OrdinaryDefineOwnProperty(O, P, Desc) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: P must be a Property Key');
		}
		if (!isPropertyDescriptor(this, Desc)) {
			throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
		}
		var desc = $gOPD(O, P);
		var current = desc && this.ToPropertyDescriptor(desc);
		var extensible = this.IsExtensible(O);
		return this.ValidateAndApplyPropertyDescriptor(O, P, extensible, Desc, current);
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-ordinarygetownproperty
	OrdinaryGetOwnProperty: function OrdinaryGetOwnProperty(O, P) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: O must be an Object');
		}
		if (!this.IsPropertyKey(P)) {
			throw new $TypeError('Assertion failed: P must be a Property Key');
		}
		if (!has(O, P)) {
			return void 0;
		}
		if (!$gOPD) {
			// ES3 fallback
			var arrayLength = this.IsArray(O) && P === 'length';
			var regexLastIndex = this.IsRegExp(O) && P === 'lastIndex';
			return {
				'[[Configurable]]': !(arrayLength || regexLastIndex),
				'[[Enumerable]]': $isEnumerable(O, P),
				'[[Value]]': O[P],
				'[[Writable]]': true
			};
		}
		return this.ToPropertyDescriptor($gOPD(O, P));
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-arraycreate
	ArrayCreate: function ArrayCreate(length) {
		if (!this.IsInteger(length) || length < 0) {
			throw new $TypeError('Assertion failed: `length` must be an integer Number >= 0');
		}
		if (length > MAX_ARRAY_LENGTH) {
			throw new $RangeError('length is greater than (2**32 - 1)');
		}
		var proto = arguments.length > 1 ? arguments[1] : $ArrayPrototype;
		var A = []; // steps 5 - 7, and 9
		if (proto !== $ArrayPrototype) { // step 8
			if (!$setProto) {
				throw new $SyntaxError('ArrayCreate: a `proto` argument that is not `Array.prototype` is not supported in an environment that does not support setting the [[Prototype]]');
			}
			$setProto(A, proto);
		}
		if (length !== 0) { // bypasses the need for step 2
			A.length = length;
		}
		/* step 10, the above as a shortcut for the below
		this.OrdinaryDefineOwnProperty(A, 'length', {
			'[[Configurable]]': false,
			'[[Enumerable]]': false,
			'[[Value]]': length,
			'[[Writable]]': true
		});
		*/
		return A;
	},

	// eslint-disable-next-line max-statements, max-lines-per-function
	ArraySetLength: function ArraySetLength(A, Desc) {
		if (!this.IsArray(A)) {
			throw new $TypeError('Assertion failed: A must be an Array');
		}
		if (!isPropertyDescriptor(this, Desc)) {
			throw new $TypeError('Assertion failed: Desc must be a Property Descriptor');
		}
		if (!('[[Value]]' in Desc)) {
			return this.OrdinaryDefineOwnProperty(A, 'length', Desc);
		}
		var newLenDesc = assign({}, Desc);
		var newLen = this.ToUint32(Desc['[[Value]]']);
		var numberLen = this.ToNumber(Desc['[[Value]]']);
		if (newLen !== numberLen) {
			throw new $RangeError('Invalid array length');
		}
		newLenDesc['[[Value]]'] = newLen;
		var oldLenDesc = this.OrdinaryGetOwnProperty(A, 'length');
		if (!this.IsDataDescriptor(oldLenDesc)) {
			throw new $TypeError('Assertion failed: an array had a non-data descriptor on `length`');
		}
		var oldLen = oldLenDesc['[[Value]]'];
		if (newLen >= oldLen) {
			return this.OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
		}
		if (!oldLenDesc['[[Writable]]']) {
			return false;
		}
		var newWritable;
		if (!('[[Writable]]' in newLenDesc) || newLenDesc['[[Writable]]']) {
			newWritable = true;
		} else {
			newWritable = false;
			newLenDesc['[[Writable]]'] = true;
		}
		var succeeded = this.OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
		if (!succeeded) {
			return false;
		}
		while (newLen < oldLen) {
			oldLen -= 1;
			var deleteSucceeded = delete A[this.ToString(oldLen)];
			if (!deleteSucceeded) {
				newLenDesc['[[Value]]'] = oldLen + 1;
				if (!newWritable) {
					newLenDesc['[[Writable]]'] = false;
					this.OrdinaryDefineOwnProperty(A, 'length', newLenDesc);
					return false;
				}
			}
		}
		if (!newWritable) {
			return this.OrdinaryDefineOwnProperty(A, 'length', { '[[Writable]]': false });
		}
		return true;
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-createhtml
	CreateHTML: function CreateHTML(string, tag, attribute, value) {
		if (this.Type(tag) !== 'String' || this.Type(attribute) !== 'String') {
			throw new $TypeError('Assertion failed: `tag` and `attribute` must be strings');
		}
		var str = this.RequireObjectCoercible(string);
		var S = this.ToString(str);
		var p1 = '<' + tag;
		if (attribute !== '') {
			var V = this.ToString(value);
			var escapedV = $replace(V, /\x22/g, '&quot;');
			p1 += '\x20' + attribute + '\x3D\x22' + escapedV + '\x22';
		}
		return p1 + '>' + S + '</' + tag + '>';
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-getownpropertykeys
	GetOwnPropertyKeys: function GetOwnPropertyKeys(O, Type) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: Type(O) is not Object');
		}
		if (Type === 'Symbol') {
			return hasSymbols && $gOPS ? $gOPS(O) : [];
		}
		if (Type === 'String') {
			if (!$gOPN) {
				return keys(O);
			}
			return $gOPN(O);
		}
		throw new $TypeError('Assertion failed: `Type` must be `"String"` or `"Symbol"`');
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-symboldescriptivestring
	SymbolDescriptiveString: function SymbolDescriptiveString(sym) {
		if (this.Type(sym) !== 'Symbol') {
			throw new $TypeError('Assertion failed: `sym` must be a Symbol');
		}
		return $SymbolToString(sym);
	},

	// https://www.ecma-international.org/ecma-262/6.0/#sec-getsubstitution
	// eslint-disable-next-line max-statements, max-params, max-lines-per-function
	GetSubstitution: function GetSubstitution(matched, str, position, captures, replacement) {
		if (this.Type(matched) !== 'String') {
			throw new $TypeError('Assertion failed: `matched` must be a String');
		}
		var matchLength = matched.length;

		if (this.Type(str) !== 'String') {
			throw new $TypeError('Assertion failed: `str` must be a String');
		}
		var stringLength = str.length;

		if (!this.IsInteger(position) || position < 0 || position > stringLength) {
			throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
		}

		var ES = this;
		var isStringOrHole = function (capture, index, arr) { return ES.Type(capture) === 'String' || !(index in arr); };
		if (!this.IsArray(captures) || !every(captures, isStringOrHole)) {
			throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
		}

		if (this.Type(replacement) !== 'String') {
			throw new $TypeError('Assertion failed: `replacement` must be a String');
		}

		var tailPos = position + matchLength;
		var m = captures.length;

		var result = '';
		for (var i = 0; i < replacement.length; i += 1) {
			// if this is a $, and it's not the end of the replacement
			var current = replacement[i];
			var isLast = (i + 1) >= replacement.length;
			var nextIsLast = (i + 2) >= replacement.length;
			if (current === '$' && !isLast) {
				var next = replacement[i + 1];
				if (next === '$') {
					result += '$';
					i += 1;
				} else if (next === '&') {
					result += matched;
					i += 1;
				} else if (next === '`') {
					result += position === 0 ? '' : strSlice(str, 0, position - 1);
					i += 1;
				} else if (next === "'") {
					result += tailPos >= stringLength ? '' : strSlice(str, tailPos);
					i += 1;
				} else {
					var nextNext = nextIsLast ? null : replacement[i + 2];
					if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
						// $1 through $9, and not followed by a digit
						var n = parseInteger(next, 10);
						// if (n > m, impl-defined)
						result += (n <= m && this.Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
						i += 1;
					} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
						// $00 through $99
						var nn = next + nextNext;
						var nnI = parseInteger(nn, 10) - 1;
						// if nn === '00' or nn > m, impl-defined
						result += (nn <= m && this.Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
						i += 2;
					} else {
						result += '$';
					}
				}
			} else {
				// the final $, or else not a $
				result += replacement[i];
			}
		}
		return result;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-todatestring
	ToDateString: function ToDateString(tv) {
		if (this.Type(tv) !== 'Number') {
			throw new $TypeError('Assertion failed: `tv` must be a Number');
		}
		if ($isNaN(tv)) {
			return 'Invalid Date';
		}
		return $Date(tv);
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-createlistfromarraylike
	CreateListFromArrayLike: function CreateListFromArrayLike(obj) {
		var elementTypes = arguments.length > 1
			? arguments[1]
			: ['Undefined', 'Null', 'Boolean', 'String', 'Symbol', 'Number', 'Object'];

		if (this.Type(obj) !== 'Object') {
			throw new $TypeError('Assertion failed: `obj` must be an Object');
		}
		if (!this.IsArray(elementTypes)) {
			throw new $TypeError('Assertion failed: `elementTypes`, if provided, must be an array');
		}
		var len = this.ToLength(this.Get(obj, 'length'));
		var list = [];
		var index = 0;
		while (index < len) {
			var indexName = this.ToString(index);
			var next = this.Get(obj, indexName);
			var nextType = this.Type(next);
			if ($indexOf(elementTypes, nextType) < 0) {
				throw new $TypeError('item type ' + nextType + ' is not a valid elementType');
			}
			$push(list, next);
			index += 1;
		}
		return list;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-getprototypefromconstructor
	GetPrototypeFromConstructor: function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
		var intrinsic = GetIntrinsic(intrinsicDefaultProto); // throws if not a valid intrinsic
		if (!this.IsConstructor(constructor)) {
			throw new $TypeError('Assertion failed: `constructor` must be a constructor');
		}
		var proto = this.Get(constructor, 'prototype');
		if (this.Type(proto) !== 'Object') {
			if (!(constructor instanceof $Function)) {
				// ignore other realms, for now
				throw new $TypeError('cross-realm constructors not currently supported');
			}
			proto = intrinsic;
		}
		return proto;
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-setfunctionname
	SetFunctionName: function SetFunctionName(F, name) {
		if (typeof F !== 'function') {
			throw new $TypeError('Assertion failed: `F` must be a function');
		}
		if (!this.IsExtensible(F) || has(F, 'name')) {
			throw new $TypeError('Assertion failed: `F` must be extensible, and must not have a `name` own property');
		}
		var nameType = this.Type(name);
		if (nameType !== 'Symbol' && nameType !== 'String') {
			throw new $TypeError('Assertion failed: `name` must be a Symbol or a String');
		}
		if (nameType === 'Symbol') {
			var description = getSymbolDescription(name);
			// eslint-disable-next-line no-param-reassign
			name = typeof description === 'undefined' ? '' : '[' + description + ']';
		}
		if (arguments.length > 2) {
			var prefix = arguments[2];
			// eslint-disable-next-line no-param-reassign
			name = prefix + ' ' + name;
		}
		return this.DefinePropertyOrThrow(F, 'name', {
			'[[Value]]': name,
			'[[Writable]]': false,
			'[[Enumerable]]': false,
			'[[Configurable]]': true
		});
	}
});

delete ES6.CheckObjectCoercible; // renamed in ES6 to RequireObjectCoercible

module.exports = ES6;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/es2016.js":
/*!***************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/es2016.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES2015 = __webpack_require__(/*! ./es2015 */ "../../../../../node_modules/es-abstract/es2015.js");
var GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");
var assign = __webpack_require__(/*! ./helpers/assign */ "../../../../../node_modules/es-abstract/helpers/assign.js");
var $setProto = __webpack_require__(/*! ./helpers/setProto */ "../../../../../node_modules/es-abstract/helpers/setProto.js");

var callBound = __webpack_require__(/*! ./helpers/callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");
var getIteratorMethod = __webpack_require__(/*! ./helpers/getIteratorMethod */ "../../../../../node_modules/es-abstract/helpers/getIteratorMethod.js");

var $TypeError = GetIntrinsic('%TypeError%');
var $arrayPush = callBound('Array.prototype.push');
var $getProto = __webpack_require__(/*! ./helpers/getProto */ "../../../../../node_modules/es-abstract/helpers/getProto.js");

var ES2016 = assign(assign({}, ES2015), {
	// https://www.ecma-international.org/ecma-262/7.0/#sec-samevaluenonnumber
	SameValueNonNumber: function SameValueNonNumber(x, y) {
		if (typeof x === 'number' || typeof x !== typeof y) {
			throw new TypeError('SameValueNonNumber requires two non-number values of the same type.');
		}
		return this.SameValue(x, y);
	},

	// https://www.ecma-international.org/ecma-262/7.0/#sec-iterabletoarraylike
	IterableToArrayLike: function IterableToArrayLike(items) {
		var usingIterator = getIteratorMethod(this, items);
		if (typeof usingIterator !== 'undefined') {
			var iterator = this.GetIterator(items, usingIterator);
			var values = [];
			var next = true;
			while (next) {
				next = this.IteratorStep(iterator);
				if (next) {
					var nextValue = this.IteratorValue(next);
					$arrayPush(values, nextValue);
				}
			}
			return values;
		}

		return this.ToObject(items);
	},

	// https://ecma-international.org/ecma-262/7.0/#sec-ordinarygetprototypeof
	OrdinaryGetPrototypeOf: function (O) {
		if (this.Type(O) !== 'Object') {
			throw new $TypeError('Assertion failed: O must be an Object');
		}
		if (!$getProto) {
			throw new $TypeError('This environment does not support fetching prototypes.');
		}
		return $getProto(O);
	},

	// https://ecma-international.org/ecma-262/7.0/#sec-ordinarysetprototypeof
	OrdinarySetPrototypeOf: function (O, V) {
		if (this.Type(V) !== 'Object' && this.Type(V) !== 'Null') {
			throw new $TypeError('Assertion failed: V must be Object or Null');
		}
		/*
		var extensible = this.IsExtensible(O);
		var current = this.OrdinaryGetPrototypeOf(O);
		if (this.SameValue(V, current)) {
			return true;
		}
		if (!extensible) {
			return false;
		}
		*/
		try {
			$setProto(O, V);
		} catch (e) {
			return false;
		}
		return this.OrdinaryGetPrototypeOf(O) === V;
		/*
		var p = V;
		var done = false;
		while (!done) {
			if (p === null) {
				done = true;
			} else if (this.SameValue(p, O)) {
				return false;
			} else {
				if (wat) {
					done = true;
				} else {
					p = p.[[Prototype]];
				}
			}
		 }
		 O.[[Prototype]] = V;
		 return true;
		 */
	}
});

module.exports = ES2016;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/es2017.js":
/*!***************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/es2017.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var ES2016 = __webpack_require__(/*! ./es2016 */ "../../../../../node_modules/es-abstract/es2016.js");
var assign = __webpack_require__(/*! ./helpers/assign */ "../../../../../node_modules/es-abstract/helpers/assign.js");
var forEach = __webpack_require__(/*! ./helpers/forEach */ "../../../../../node_modules/es-abstract/helpers/forEach.js");
var callBind = __webpack_require__(/*! ./helpers/callBind */ "../../../../../node_modules/es-abstract/helpers/callBind.js");

var $TypeError = GetIntrinsic('%TypeError%');
var callBound = __webpack_require__(/*! ./helpers/callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");
var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var $pushApply = callBind.apply(GetIntrinsic('%Array.prototype.push%'));
var $arrayPush = callBound('Array.prototype.push');

var ES2017 = assign(assign({}, ES2016), {
	ToIndex: function ToIndex(value) {
		if (typeof value === 'undefined') {
			return 0;
		}
		var integerIndex = this.ToInteger(value);
		if (integerIndex < 0) {
			throw new RangeError('index must be >= 0');
		}
		var index = this.ToLength(integerIndex);
		if (!this.SameValueZero(integerIndex, index)) {
			throw new RangeError('index must be >= 0 and < 2 ** 53 - 1');
		}
		return index;
	},

	// https://www.ecma-international.org/ecma-262/8.0/#sec-enumerableownproperties
	EnumerableOwnProperties: function EnumerableOwnProperties(O, kind) {
		var keys = ES2016.EnumerableOwnNames(O);
		if (kind === 'key') {
			return keys;
		}
		if (kind === 'value' || kind === 'key+value') {
			var results = [];
			forEach(keys, function (key) {
				if ($isEnumerable(O, key)) {
					$pushApply(results, [
						kind === 'value' ? O[key] : [key, O[key]]
					]);
				}
			});
			return results;
		}
		throw new $TypeError('Assertion failed: "kind" is not "key", "value", or "key+value": ' + kind);
	},

	// https://www.ecma-international.org/ecma-262/8.0/#sec-iterabletolist
	IterableToList: function IterableToList(items, method) {
		var iterator = this.GetIterator(items, method);
		var values = [];
		var next = true;
		while (next) {
			next = this.IteratorStep(iterator);
			if (next) {
				var nextValue = this.IteratorValue(next);
				$arrayPush(values, nextValue);
			}
		}
		return values;
	}
});

delete ES2017.EnumerableOwnNames; // replaced with EnumerableOwnProperties
delete ES2017.IterableToArrayLike; // replaced with IterableToList

module.exports = ES2017;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/es2018.js":
/*!***************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/es2018.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var keys = __webpack_require__(/*! object-keys */ "../../../../../node_modules/object-keys/index.js");
var inspect = __webpack_require__(/*! object-inspect */ "../../../../../node_modules/object-inspect/index.js");

var ES2017 = __webpack_require__(/*! ./es2017 */ "../../../../../node_modules/es-abstract/es2017.js");
var assign = __webpack_require__(/*! ./helpers/assign */ "../../../../../node_modules/es-abstract/helpers/assign.js");
var forEach = __webpack_require__(/*! ./helpers/forEach */ "../../../../../node_modules/es-abstract/helpers/forEach.js");
var callBind = __webpack_require__(/*! ./helpers/callBind */ "../../../../../node_modules/es-abstract/helpers/callBind.js");
var every = __webpack_require__(/*! ./helpers/every */ "../../../../../node_modules/es-abstract/helpers/every.js");
var isPrefixOf = __webpack_require__(/*! ./helpers/isPrefixOf */ "../../../../../node_modules/es-abstract/helpers/isPrefixOf.js");

var $String = GetIntrinsic('%String%');
var $TypeError = GetIntrinsic('%TypeError%');

var callBound = __webpack_require__(/*! ./helpers/callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");
var regexTester = __webpack_require__(/*! ./helpers/regexTester */ "../../../../../node_modules/es-abstract/helpers/regexTester.js");
var $isNaN = __webpack_require__(/*! ./helpers/isNaN */ "../../../../../node_modules/es-abstract/helpers/isNaN.js");

var $SymbolValueOf = callBound('Symbol.prototype.valueOf', true);
// var $charAt = callBound('String.prototype.charAt');
var $strSlice = callBound('String.prototype.slice');
var $indexOf = callBound('String.prototype.indexOf');
var $parseInt = parseInt;

var isDigit = regexTester(/^[0-9]$/);

var $PromiseResolve = callBound('Promise.resolve', true);

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var $pushApply = callBind.apply(GetIntrinsic('%Array.prototype.push%'));
var $gOPS = $SymbolValueOf ? GetIntrinsic('%Object.getOwnPropertySymbols%') : null;

var padTimeComponent = function padTimeComponent(c, count) {
	return $strSlice('00' + c, -(count || 2));
};

var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var OwnPropertyKeys = function OwnPropertyKeys(ES, source) {
	var ownKeys = keys(source);
	if ($gOPS) {
		$pushApply(ownKeys, $gOPS(source));
	}
	return ownKeys;
};

var ES2018 = assign(assign({}, ES2017), {
	EnumerableOwnPropertyNames: ES2017.EnumerableOwnProperties,

	// https://ecma-international.org/ecma-262/9.0/#sec-thissymbolvalue
	thisSymbolValue: function thisSymbolValue(value) {
		if (!$SymbolValueOf) {
			throw new SyntaxError('Symbols are not supported; thisSymbolValue requires that `value` be a Symbol or a Symbol object');
		}
		if (this.Type(value) === 'Symbol') {
			return value;
		}
		return $SymbolValueOf(value);
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-isstringprefix
	IsStringPrefix: function IsStringPrefix(p, q) {
		if (this.Type(p) !== 'String') {
			throw new TypeError('Assertion failed: "p" must be a String');
		}

		if (this.Type(q) !== 'String') {
			throw new TypeError('Assertion failed: "q" must be a String');
		}

		return isPrefixOf(p, q);
		/*
		if (p === q || p === '') {
			return true;
		}

		var pLength = p.length;
		var qLength = q.length;
		if (pLength >= qLength) {
			return false;
		}

		// assert: pLength < qLength

		for (var i = 0; i < pLength; i += 1) {
			if ($charAt(p, i) !== $charAt(q, i)) {
				return false;
			}
		}
		return true;
		*/
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-tostring-applied-to-the-number-type
	NumberToString: function NumberToString(m) {
		if (this.Type(m) !== 'Number') {
			throw new TypeError('Assertion failed: "m" must be a String');
		}

		return $String(m);
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-copydataproperties
	CopyDataProperties: function CopyDataProperties(target, source, excludedItems) {
		if (this.Type(target) !== 'Object') {
			throw new TypeError('Assertion failed: "target" must be an Object');
		}

		if (!this.IsArray(excludedItems)) {
			throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
		}
		for (var i = 0; i < excludedItems.length; i += 1) {
			if (!this.IsPropertyKey(excludedItems[i])) {
				throw new TypeError('Assertion failed: "excludedItems" must be a List of Property Keys');
			}
		}

		if (typeof source === 'undefined' || source === null) {
			return target;
		}

		var ES = this;

		var fromObj = ES.ToObject(source);

		var sourceKeys = OwnPropertyKeys(ES, fromObj);
		forEach(sourceKeys, function (nextKey) {
			var excluded = false;

			forEach(excludedItems, function (e) {
				if (ES.SameValue(e, nextKey) === true) {
					excluded = true;
				}
			});

			var enumerable = $isEnumerable(fromObj, nextKey) || (
				// this is to handle string keys being non-enumerable in older engines
				typeof source === 'string'
				&& nextKey >= 0
				&& ES.IsInteger(ES.ToNumber(nextKey))
			);
			if (excluded === false && enumerable) {
				var propValue = ES.Get(fromObj, nextKey);
				ES.CreateDataProperty(target, nextKey, propValue);
			}
		});

		return target;
	},

	// https://ecma-international.org/ecma-262/9.0/#sec-promise-resolve
	PromiseResolve: function PromiseResolve(C, x) {
		if (!$PromiseResolve) {
			throw new SyntaxError('This environment does not support Promises.');
		}
		return $PromiseResolve(C, x);
	},

	// http://www.ecma-international.org/ecma-262/9.0/#sec-getsubstitution
	// eslint-disable-next-line max-statements, max-params, max-lines-per-function
	GetSubstitution: function GetSubstitution(matched, str, position, captures, namedCaptures, replacement) {
		if (this.Type(matched) !== 'String') {
			throw new $TypeError('Assertion failed: `matched` must be a String');
		}
		var matchLength = matched.length;

		if (this.Type(str) !== 'String') {
			throw new $TypeError('Assertion failed: `str` must be a String');
		}
		var stringLength = str.length;

		if (!this.IsInteger(position) || position < 0 || position > stringLength) {
			throw new $TypeError('Assertion failed: `position` must be a nonnegative integer, and less than or equal to the length of `string`, got ' + inspect(position));
		}

		var ES = this;
		var isStringOrHole = function (capture, index, arr) { return ES.Type(capture) === 'String' || !(index in arr); };
		if (!this.IsArray(captures) || !every(captures, isStringOrHole)) {
			throw new $TypeError('Assertion failed: `captures` must be a List of Strings, got ' + inspect(captures));
		}

		if (this.Type(replacement) !== 'String') {
			throw new $TypeError('Assertion failed: `replacement` must be a String');
		}

		var tailPos = position + matchLength;
		var m = captures.length;
		if (this.Type(namedCaptures) !== 'Undefined') {
			namedCaptures = this.ToObject(namedCaptures); // eslint-disable-line no-param-reassign
		}

		var result = '';
		for (var i = 0; i < replacement.length; i += 1) {
			// if this is a $, and it's not the end of the replacement
			var current = replacement[i];
			var isLast = (i + 1) >= replacement.length;
			var nextIsLast = (i + 2) >= replacement.length;
			if (current === '$' && !isLast) {
				var next = replacement[i + 1];
				if (next === '$') {
					result += '$';
					i += 1;
				} else if (next === '&') {
					result += matched;
					i += 1;
				} else if (next === '`') {
					result += position === 0 ? '' : $strSlice(str, 0, position - 1);
					i += 1;
				} else if (next === "'") {
					result += tailPos >= stringLength ? '' : $strSlice(str, tailPos);
					i += 1;
				} else {
					var nextNext = nextIsLast ? null : replacement[i + 2];
					if (isDigit(next) && next !== '0' && (nextIsLast || !isDigit(nextNext))) {
						// $1 through $9, and not followed by a digit
						var n = $parseInt(next, 10);
						// if (n > m, impl-defined)
						result += (n <= m && this.Type(captures[n - 1]) === 'Undefined') ? '' : captures[n - 1];
						i += 1;
					} else if (isDigit(next) && (nextIsLast || isDigit(nextNext))) {
						// $00 through $99
						var nn = next + nextNext;
						var nnI = $parseInt(nn, 10) - 1;
						// if nn === '00' or nn > m, impl-defined
						result += (nn <= m && this.Type(captures[nnI]) === 'Undefined') ? '' : captures[nnI];
						i += 2;
					} else if (next === '<') {
						// eslint-disable-next-line max-depth
						if (this.Type(namedCaptures) === 'Undefined') {
							result += '$<';
							i += 2;
						} else {
							var endIndex = $indexOf(replacement, '>', i);
							// eslint-disable-next-line max-depth
							if (endIndex > -1) {
								var groupName = $strSlice(replacement, i, endIndex);
								var capture = this.Get(namedCaptures, groupName);
								// eslint-disable-next-line max-depth
								if (this.Type(capture) !== 'Undefined') {
									result += this.ToString(capture);
								}
								i += '$<' + groupName + '>'.length;
							}
						}
					} else {
						result += '$';
					}
				}
			} else {
				// the final $, or else not a $
				result += replacement[i];
			}
		}
		return result;
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-datestring
	DateString: function DateString(tv) {
		if (this.Type(tv) !== 'Number' || $isNaN(tv)) {
			throw new $TypeError('Assertion failed: `tv` must be a non-NaN Number');
		}
		var weekday = weekdays[this.WeekDay(tv)];
		var month = months[this.MonthFromTime(tv)];
		var day = padTimeComponent(this.DateFromTime(tv));
		var year = padTimeComponent(this.YearFromTime(tv), 4);
		return weekday + '\x20' + month + '\x20' + day + '\x20' + year;
	},

	// https://www.ecma-international.org/ecma-262/9.0/#sec-timestring
	TimeString: function TimeString(tv) {
		if (this.Type(tv) !== 'Number' || $isNaN(tv)) {
			throw new $TypeError('Assertion failed: `tv` must be a non-NaN Number');
		}
		var hour = this.HourFromTime(tv);
		var minute = this.MinFromTime(tv);
		var second = this.SecFromTime(tv);
		return padTimeComponent(hour) + ':' + padTimeComponent(minute) + ':' + padTimeComponent(second) + '\x20GMT';
	}
});

delete ES2018.EnumerableOwnProperties; // replaced with EnumerableOwnPropertyNames

delete ES2018.IsPropertyDescriptor; // not an actual abstract operation

module.exports = ES2018;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/es2019.js":
/*!***************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/es2019.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var trimStart = __webpack_require__(/*! string.prototype.trimleft */ "../../../../../node_modules/string.prototype.trimleft/index.js");
var trimEnd = __webpack_require__(/*! string.prototype.trimright */ "../../../../../node_modules/string.prototype.trimright/index.js");
var inspect = __webpack_require__(/*! object-inspect */ "../../../../../node_modules/object-inspect/index.js");

var ES2018 = __webpack_require__(/*! ./es2018 */ "../../../../../node_modules/es-abstract/es2018.js");
var assign = __webpack_require__(/*! ./helpers/assign */ "../../../../../node_modules/es-abstract/helpers/assign.js");
var MAX_SAFE_INTEGER = __webpack_require__(/*! ./helpers/maxSafeInteger */ "../../../../../node_modules/es-abstract/helpers/maxSafeInteger.js");

var GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $TypeError = GetIntrinsic('%TypeError%');

var ES2019 = assign(assign({}, ES2018), {
	// https://tc39.es/ecma262/#sec-add-entries-from-iterable
	AddEntriesFromIterable: function AddEntriesFromIterable(target, iterable, adder) {
		if (!this.IsCallable(adder)) {
			throw new $TypeError('Assertion failed: `adder` is not callable');
		}
		if (iterable == null) {
			throw new $TypeError('Assertion failed: `iterable` is present, and not nullish');
		}
		var iteratorRecord = this.GetIterator(iterable);
		while (true) { // eslint-disable-line no-constant-condition
			var next = this.IteratorStep(iteratorRecord);
			if (!next) {
				return target;
			}
			var nextItem = this.IteratorValue(next);
			if (this.Type(nextItem) !== 'Object') {
				var error = new $TypeError('iterator next must return an Object, got ' + inspect(nextItem));
				return this.IteratorClose(
					iteratorRecord,
					function () { throw error; } // eslint-disable-line no-loop-func
				);
			}
			try {
				var k = this.Get(nextItem, '0');
				var v = this.Get(nextItem, '1');
				this.Call(adder, target, [k, v]);
			} catch (e) {
				return this.IteratorClose(
					iteratorRecord,
					function () { throw e; } // eslint-disable-line no-loop-func
				);
			}
		}
	},

	// https://ecma-international.org/ecma-262/10.0/#sec-flattenintoarray
	// eslint-disable-next-line max-params, max-statements
	FlattenIntoArray: function FlattenIntoArray(target, source, sourceLen, start, depth) {
		var mapperFunction;
		if (arguments.length > 5) {
			mapperFunction = arguments[5];
		}

		var targetIndex = start;
		var sourceIndex = 0;
		while (sourceIndex < sourceLen) {
			var P = this.ToString(sourceIndex);
			var exists = this.HasProperty(source, P);
			if (exists === true) {
				var element = this.Get(source, P);
				if (typeof mapperFunction !== 'undefined') {
					if (arguments.length <= 6) {
						throw new $TypeError('Assertion failed: thisArg is required when mapperFunction is provided');
					}
					element = this.Call(mapperFunction, arguments[6], [element, sourceIndex, source]);
				}
				var shouldFlatten = false;
				if (depth > 0) {
					shouldFlatten = this.IsArray(element);
				}
				if (shouldFlatten) {
					var elementLen = this.ToLength(this.Get(element, 'length'));
					targetIndex = this.FlattenIntoArray(target, element, elementLen, targetIndex, depth - 1);
				} else {
					if (targetIndex >= MAX_SAFE_INTEGER) {
						throw new $TypeError('index too large');
					}
					this.CreateDataPropertyOrThrow(target, this.ToString(targetIndex), element);
					targetIndex += 1;
				}
			}
			sourceIndex += 1;
		}

		return targetIndex;
	},

	// https://ecma-international.org/ecma-262/10.0/#sec-trimstring
	TrimString: function TrimString(string, where) {
		var str = this.RequireObjectCoercible(string);
		var S = this.ToString(str);
		var T;
		if (where === 'start') {
			T = trimStart(S);
		} else if (where === 'end') {
			T = trimEnd(S);
		} else if (where === 'start+end') {
			T = trimStart(trimEnd(S));
		} else {
			throw new $TypeError('Assertion failed: invalid `where` value; must be "start", "end", or "start+end"');
		}
		return T;
	}
});

module.exports = ES2019;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/es5.js":
/*!************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/es5.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ./GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $Object = GetIntrinsic('%Object%');
var $EvalError = GetIntrinsic('%EvalError%');
var $TypeError = GetIntrinsic('%TypeError%');
var $String = GetIntrinsic('%String%');
var $Date = GetIntrinsic('%Date%');
var $Number = GetIntrinsic('%Number%');
var $floor = GetIntrinsic('%Math.floor%');
var $DateUTC = GetIntrinsic('%Date.UTC%');
var $abs = GetIntrinsic('%Math.abs%');

var assertRecord = __webpack_require__(/*! ./helpers/assertRecord */ "../../../../../node_modules/es-abstract/helpers/assertRecord.js");
var isPropertyDescriptor = __webpack_require__(/*! ./helpers/isPropertyDescriptor */ "../../../../../node_modules/es-abstract/helpers/isPropertyDescriptor.js");
var $isNaN = __webpack_require__(/*! ./helpers/isNaN */ "../../../../../node_modules/es-abstract/helpers/isNaN.js");
var $isFinite = __webpack_require__(/*! ./helpers/isFinite */ "../../../../../node_modules/es-abstract/helpers/isFinite.js");
var sign = __webpack_require__(/*! ./helpers/sign */ "../../../../../node_modules/es-abstract/helpers/sign.js");
var mod = __webpack_require__(/*! ./helpers/mod */ "../../../../../node_modules/es-abstract/helpers/mod.js");
var isPrefixOf = __webpack_require__(/*! ./helpers/isPrefixOf */ "../../../../../node_modules/es-abstract/helpers/isPrefixOf.js");
var callBound = __webpack_require__(/*! ./helpers/callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");

var IsCallable = __webpack_require__(/*! is-callable */ "../../../../../node_modules/is-callable/index.js");
var toPrimitive = __webpack_require__(/*! es-to-primitive/es5 */ "../../../../../node_modules/es-to-primitive/es5.js");

var has = __webpack_require__(/*! has */ "../../../../../node_modules/has/src/index.js");

var $getUTCFullYear = callBound('Date.prototype.getUTCFullYear');

var HoursPerDay = 24;
var MinutesPerHour = 60;
var SecondsPerMinute = 60;
var msPerSecond = 1e3;
var msPerMinute = msPerSecond * SecondsPerMinute;
var msPerHour = msPerMinute * MinutesPerHour;
var msPerDay = 86400000;

// https://es5.github.io/#x9
var ES5 = {
	ToPrimitive: toPrimitive,

	ToBoolean: function ToBoolean(value) {
		return !!value;
	},
	ToNumber: function ToNumber(value) {
		return +value; // eslint-disable-line no-implicit-coercion
	},
	ToInteger: function ToInteger(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number)) { return 0; }
		if (number === 0 || !$isFinite(number)) { return number; }
		return sign(number) * Math.floor(Math.abs(number));
	},
	ToInt32: function ToInt32(x) {
		return this.ToNumber(x) >> 0;
	},
	ToUint32: function ToUint32(x) {
		return this.ToNumber(x) >>> 0;
	},
	ToUint16: function ToUint16(value) {
		var number = this.ToNumber(value);
		if ($isNaN(number) || number === 0 || !$isFinite(number)) { return 0; }
		var posInt = sign(number) * Math.floor(Math.abs(number));
		return mod(posInt, 0x10000);
	},
	ToString: function ToString(value) {
		return $String(value);
	},
	ToObject: function ToObject(value) {
		this.CheckObjectCoercible(value);
		return $Object(value);
	},
	CheckObjectCoercible: function CheckObjectCoercible(value, optMessage) {
		/* jshint eqnull:true */
		if (value == null) {
			throw new $TypeError(optMessage || 'Cannot call method on ' + value);
		}
		return value;
	},
	IsCallable: IsCallable,
	SameValue: function SameValue(x, y) {
		if (x === y) { // 0 === -0, but they are not identical.
			if (x === 0) { return 1 / x === 1 / y; }
			return true;
		}
		return $isNaN(x) && $isNaN(y);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8
	Type: function Type(x) {
		if (x === null) {
			return 'Null';
		}
		if (typeof x === 'undefined') {
			return 'Undefined';
		}
		if (typeof x === 'function' || typeof x === 'object') {
			return 'Object';
		}
		if (typeof x === 'number') {
			return 'Number';
		}
		if (typeof x === 'boolean') {
			return 'Boolean';
		}
		if (typeof x === 'string') {
			return 'String';
		}
	},

	// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	IsPropertyDescriptor: function IsPropertyDescriptor(Desc) {
		return isPropertyDescriptor(this, Desc);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.1
	IsAccessorDescriptor: function IsAccessorDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (!has(Desc, '[[Get]]') && !has(Desc, '[[Set]]')) {
			return false;
		}

		return true;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.2
	IsDataDescriptor: function IsDataDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (!has(Desc, '[[Value]]') && !has(Desc, '[[Writable]]')) {
			return false;
		}

		return true;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.3
	IsGenericDescriptor: function IsGenericDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return false;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (!this.IsAccessorDescriptor(Desc) && !this.IsDataDescriptor(Desc)) {
			return true;
		}

		return false;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.4
	FromPropertyDescriptor: function FromPropertyDescriptor(Desc) {
		if (typeof Desc === 'undefined') {
			return Desc;
		}

		assertRecord(this, 'Property Descriptor', 'Desc', Desc);

		if (this.IsDataDescriptor(Desc)) {
			return {
				value: Desc['[[Value]]'],
				writable: !!Desc['[[Writable]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else if (this.IsAccessorDescriptor(Desc)) {
			return {
				get: Desc['[[Get]]'],
				set: Desc['[[Set]]'],
				enumerable: !!Desc['[[Enumerable]]'],
				configurable: !!Desc['[[Configurable]]']
			};
		} else {
			throw new $TypeError('FromPropertyDescriptor must be called with a fully populated Property Descriptor');
		}
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-8.10.5
	ToPropertyDescriptor: function ToPropertyDescriptor(Obj) {
		if (this.Type(Obj) !== 'Object') {
			throw new $TypeError('ToPropertyDescriptor requires an object');
		}

		var desc = {};
		if (has(Obj, 'enumerable')) {
			desc['[[Enumerable]]'] = this.ToBoolean(Obj.enumerable);
		}
		if (has(Obj, 'configurable')) {
			desc['[[Configurable]]'] = this.ToBoolean(Obj.configurable);
		}
		if (has(Obj, 'value')) {
			desc['[[Value]]'] = Obj.value;
		}
		if (has(Obj, 'writable')) {
			desc['[[Writable]]'] = this.ToBoolean(Obj.writable);
		}
		if (has(Obj, 'get')) {
			var getter = Obj.get;
			if (typeof getter !== 'undefined' && !this.IsCallable(getter)) {
				throw new TypeError('getter must be a function');
			}
			desc['[[Get]]'] = getter;
		}
		if (has(Obj, 'set')) {
			var setter = Obj.set;
			if (typeof setter !== 'undefined' && !this.IsCallable(setter)) {
				throw new $TypeError('setter must be a function');
			}
			desc['[[Set]]'] = setter;
		}

		if ((has(desc, '[[Get]]') || has(desc, '[[Set]]')) && (has(desc, '[[Value]]') || has(desc, '[[Writable]]'))) {
			throw new $TypeError('Invalid property descriptor. Cannot both specify accessors and a value or writable attribute');
		}
		return desc;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-11.9.3
	'Abstract Equality Comparison': function AbstractEqualityComparison(x, y) {
		var xType = this.Type(x);
		var yType = this.Type(y);
		if (xType === yType) {
			return x === y; // ES6+ specified this shortcut anyways.
		}
		if (x == null && y == null) {
			return true;
		}
		if (xType === 'Number' && yType === 'String') {
			return this['Abstract Equality Comparison'](x, this.ToNumber(y));
		}
		if (xType === 'String' && yType === 'Number') {
			return this['Abstract Equality Comparison'](this.ToNumber(x), y);
		}
		if (xType === 'Boolean') {
			return this['Abstract Equality Comparison'](this.ToNumber(x), y);
		}
		if (yType === 'Boolean') {
			return this['Abstract Equality Comparison'](x, this.ToNumber(y));
		}
		if ((xType === 'String' || xType === 'Number') && yType === 'Object') {
			return this['Abstract Equality Comparison'](x, this.ToPrimitive(y));
		}
		if (xType === 'Object' && (yType === 'String' || yType === 'Number')) {
			return this['Abstract Equality Comparison'](this.ToPrimitive(x), y);
		}
		return false;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-11.9.6
	'Strict Equality Comparison': function StrictEqualityComparison(x, y) {
		var xType = this.Type(x);
		var yType = this.Type(y);
		if (xType !== yType) {
			return false;
		}
		if (xType === 'Undefined' || xType === 'Null') {
			return true;
		}
		return x === y; // shortcut for steps 4-7
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-11.8.5
	// eslint-disable-next-line max-statements
	'Abstract Relational Comparison': function AbstractRelationalComparison(x, y, LeftFirst) {
		if (this.Type(LeftFirst) !== 'Boolean') {
			throw new $TypeError('Assertion failed: LeftFirst argument must be a Boolean');
		}
		var px;
		var py;
		if (LeftFirst) {
			px = this.ToPrimitive(x, $Number);
			py = this.ToPrimitive(y, $Number);
		} else {
			py = this.ToPrimitive(y, $Number);
			px = this.ToPrimitive(x, $Number);
		}
		var bothStrings = this.Type(px) === 'String' && this.Type(py) === 'String';
		if (!bothStrings) {
			var nx = this.ToNumber(px);
			var ny = this.ToNumber(py);
			if ($isNaN(nx) || $isNaN(ny)) {
				return undefined;
			}
			if ($isFinite(nx) && $isFinite(ny) && nx === ny) {
				return false;
			}
			if (nx === 0 && ny === 0) {
				return false;
			}
			if (nx === Infinity) {
				return false;
			}
			if (ny === Infinity) {
				return true;
			}
			if (ny === -Infinity) {
				return false;
			}
			if (nx === -Infinity) {
				return true;
			}
			return nx < ny; // by now, these are both nonzero, finite, and not equal
		}
		if (isPrefixOf(py, px)) {
			return false;
		}
		if (isPrefixOf(px, py)) {
			return true;
		}
		return px < py; // both strings, neither a prefix of the other. shortcut for steps c-f
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10
	msFromTime: function msFromTime(t) {
		return mod(t, msPerSecond);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10
	SecFromTime: function SecFromTime(t) {
		return mod($floor(t / msPerSecond), SecondsPerMinute);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10
	MinFromTime: function MinFromTime(t) {
		return mod($floor(t / msPerMinute), MinutesPerHour);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.10
	HourFromTime: function HourFromTime(t) {
		return mod($floor(t / msPerHour), HoursPerDay);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2
	Day: function Day(t) {
		return $floor(t / msPerDay);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.2
	TimeWithinDay: function TimeWithinDay(t) {
		return mod(t, msPerDay);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3
	DayFromYear: function DayFromYear(y) {
		return (365 * (y - 1970)) + $floor((y - 1969) / 4) - $floor((y - 1901) / 100) + $floor((y - 1601) / 400);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3
	TimeFromYear: function TimeFromYear(y) {
		return msPerDay * this.DayFromYear(y);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3
	YearFromTime: function YearFromTime(t) {
		// largest y such that this.TimeFromYear(y) <= t
		return $getUTCFullYear(new $Date(t));
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.6
	WeekDay: function WeekDay(t) {
		return mod(this.Day(t) + 4, 7);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3
	DaysInYear: function DaysInYear(y) {
		if (mod(y, 4) !== 0) {
			return 365;
		}
		if (mod(y, 100) !== 0) {
			return 366;
		}
		if (mod(y, 400) !== 0) {
			return 365;
		}
		return 366;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.3
	InLeapYear: function InLeapYear(t) {
		var days = this.DaysInYear(this.YearFromTime(t));
		if (days === 365) {
			return 0;
		}
		if (days === 366) {
			return 1;
		}
		throw new $EvalError('Assertion failed: there are not 365 or 366 days in a year, got: ' + days);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4
	DayWithinYear: function DayWithinYear(t) {
		return this.Day(t) - this.DayFromYear(this.YearFromTime(t));
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.4
	MonthFromTime: function MonthFromTime(t) {
		var day = this.DayWithinYear(t);
		if (0 <= day && day < 31) {
			return 0;
		}
		var leap = this.InLeapYear(t);
		if (31 <= day && day < (59 + leap)) {
			return 1;
		}
		if ((59 + leap) <= day && day < (90 + leap)) {
			return 2;
		}
		if ((90 + leap) <= day && day < (120 + leap)) {
			return 3;
		}
		if ((120 + leap) <= day && day < (151 + leap)) {
			return 4;
		}
		if ((151 + leap) <= day && day < (181 + leap)) {
			return 5;
		}
		if ((181 + leap) <= day && day < (212 + leap)) {
			return 6;
		}
		if ((212 + leap) <= day && day < (243 + leap)) {
			return 7;
		}
		if ((243 + leap) <= day && day < (273 + leap)) {
			return 8;
		}
		if ((273 + leap) <= day && day < (304 + leap)) {
			return 9;
		}
		if ((304 + leap) <= day && day < (334 + leap)) {
			return 10;
		}
		if ((334 + leap) <= day && day < (365 + leap)) {
			return 11;
		}
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.5
	DateFromTime: function DateFromTime(t) {
		var m = this.MonthFromTime(t);
		var d = this.DayWithinYear(t);
		if (m === 0) {
			return d + 1;
		}
		if (m === 1) {
			return d - 30;
		}
		var leap = this.InLeapYear(t);
		if (m === 2) {
			return d - 58 - leap;
		}
		if (m === 3) {
			return d - 89 - leap;
		}
		if (m === 4) {
			return d - 119 - leap;
		}
		if (m === 5) {
			return d - 150 - leap;
		}
		if (m === 6) {
			return d - 180 - leap;
		}
		if (m === 7) {
			return d - 211 - leap;
		}
		if (m === 8) {
			return d - 242 - leap;
		}
		if (m === 9) {
			return d - 272 - leap;
		}
		if (m === 10) {
			return d - 303 - leap;
		}
		if (m === 11) {
			return d - 333 - leap;
		}
		throw new $EvalError('Assertion failed: MonthFromTime returned an impossible value: ' + m);
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.12
	MakeDay: function MakeDay(year, month, date) {
		if (!$isFinite(year) || !$isFinite(month) || !$isFinite(date)) {
			return NaN;
		}
		var y = this.ToInteger(year);
		var m = this.ToInteger(month);
		var dt = this.ToInteger(date);
		var ym = y + $floor(m / 12);
		var mn = mod(m, 12);
		var t = $DateUTC(ym, mn, 1);
		if (this.YearFromTime(t) !== ym || this.MonthFromTime(t) !== mn || this.DateFromTime(t) !== 1) {
			return NaN;
		}
		return this.Day(t) + dt - 1;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.13
	MakeDate: function MakeDate(day, time) {
		if (!$isFinite(day) || !$isFinite(time)) {
			return NaN;
		}
		return (day * msPerDay) + time;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.11
	MakeTime: function MakeTime(hour, min, sec, ms) {
		if (!$isFinite(hour) || !$isFinite(min) || !$isFinite(sec) || !$isFinite(ms)) {
			return NaN;
		}
		var h = this.ToInteger(hour);
		var m = this.ToInteger(min);
		var s = this.ToInteger(sec);
		var milli = this.ToInteger(ms);
		var t = (h * msPerHour) + (m * msPerMinute) + (s * msPerSecond) + milli;
		return t;
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-15.9.1.14
	TimeClip: function TimeClip(time) {
		if (!$isFinite(time) || $abs(time) > 8.64e15) {
			return NaN;
		}
		return $Number(new $Date(this.ToNumber(time)));
	},

	// https://ecma-international.org/ecma-262/5.1/#sec-5.2
	modulo: function modulo(x, y) {
		return mod(x, y);
	}
};

module.exports = ES5;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/assertRecord.js":
/*!*****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/assertRecord.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $TypeError = GetIntrinsic('%TypeError%');
var $SyntaxError = GetIntrinsic('%SyntaxError%');

var has = __webpack_require__(/*! has */ "../../../../../node_modules/has/src/index.js");

var predicates = {
	// https://ecma-international.org/ecma-262/6.0/#sec-property-descriptor-specification-type
	'Property Descriptor': function isPropertyDescriptor(ES, Desc) {
		if (ES.Type(Desc) !== 'Object') {
			return false;
		}
		var allowed = {
			'[[Configurable]]': true,
			'[[Enumerable]]': true,
			'[[Get]]': true,
			'[[Set]]': true,
			'[[Value]]': true,
			'[[Writable]]': true
		};

		for (var key in Desc) { // eslint-disable-line
			if (has(Desc, key) && !allowed[key]) {
				return false;
			}
		}

		var isData = has(Desc, '[[Value]]');
		var IsAccessor = has(Desc, '[[Get]]') || has(Desc, '[[Set]]');
		if (isData && IsAccessor) {
			throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
		}
		return true;
	}
};

module.exports = function assertRecord(ES, recordType, argumentName, value) {
	var predicate = predicates[recordType];
	if (typeof predicate !== 'function') {
		throw new $SyntaxError('unknown record type: ' + recordType);
	}
	if (!predicate(ES, value)) {
		throw new $TypeError(argumentName + ' must be a ' + recordType);
	}
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/assign.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/assign.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var has = __webpack_require__(/*! has */ "../../../../../node_modules/has/src/index.js");

var $assign = GetIntrinsic('%Object%').assign;

module.exports = function assign(target, source) {
	if ($assign) {
		return $assign(target, source);
	}

	// eslint-disable-next-line no-restricted-syntax
	for (var key in source) {
		if (has(source, key)) {
			target[key] = source[key];
		}
	}
	return target;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/callBind.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/callBind.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");

var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $Function = GetIntrinsic('%Function%');
var $apply = $Function.apply;
var $call = $Function.call;

module.exports = function callBind() {
	return bind.apply($call, arguments);
};

module.exports.apply = function applyBind() {
	return bind.apply($apply, arguments);
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/callBound.js":
/*!**************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/callBound.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var callBind = __webpack_require__(/*! ./callBind */ "../../../../../node_modules/es-abstract/helpers/callBind.js");

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
		return callBind(intrinsic);
	}
	return intrinsic;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/every.js":
/*!**********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/every.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function every(array, predicate) {
	for (var i = 0; i < array.length; i += 1) {
		if (!predicate(array[i], i, array)) {
			return false;
		}
	}
	return true;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/forEach.js":
/*!************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/forEach.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function forEach(array, callback) {
	for (var i = 0; i < array.length; i += 1) {
		callback(array[i], i, array); // eslint-disable-line callback-return
	}
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/getInferredName.js":
/*!********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/getInferredName.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getInferredName;
try {
	// eslint-disable-next-line no-new-func
	getInferredName = Function('s', 'return { [s]() {} }[s].name;');
} catch (e) {}

var inferred = function () {};
module.exports = getInferredName && inferred.name === 'inferred' ? getInferredName : null;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/getIteratorMethod.js":
/*!**********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/getIteratorMethod.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasSymbols = __webpack_require__(/*! has-symbols */ "../../../../../node_modules/has-symbols/index.js")();
var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");
var callBound = __webpack_require__(/*! ./callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");

var $iterator = GetIntrinsic('%Symbol.iterator%', true);
var $arraySlice = callBound('Array.prototype.slice');
var $arrayJoin = callBound('Array.prototype.join');

module.exports = function getIteratorMethod(ES, iterable) {
	var usingIterator;
	if (hasSymbols) {
		usingIterator = ES.GetMethod(iterable, $iterator);
	} else if (ES.IsArray(iterable)) {
		usingIterator = function () {
			var i = -1;
			var arr = this; // eslint-disable-line no-invalid-this
			return {
				next: function () {
					i += 1;
					return {
						done: i >= arr.length,
						value: arr[i]
					};
				}
			};
		};
	} else if (ES.Type(iterable) === 'String') {
		usingIterator = function () {
			var i = 0;
			return {
				next: function () {
					var nextIndex = ES.AdvanceStringIndex(iterable, i, true);
					var value = $arrayJoin($arraySlice(iterable, i, nextIndex), '');
					i = nextIndex;
					return {
						done: nextIndex > iterable.length,
						value: value
					};
				}
			};
		};
	}
	return usingIterator;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/getProto.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/getProto.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var originalGetProto = GetIntrinsic('%Object.getPrototypeOf%', true);
var $ArrayProto = GetIntrinsic('%Array.prototype%');

module.exports = originalGetProto || (
	// eslint-disable-next-line no-proto
	[].__proto__ === $ArrayProto
		? function (O) {
			return O.__proto__; // eslint-disable-line no-proto
		}
		: null
);


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/getSymbolDescription.js":
/*!*************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/getSymbolDescription.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var callBound = __webpack_require__(/*! ./callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js");

var $SyntaxError = GetIntrinsic('%SyntaxError%');
var symToStr = callBound('Symbol.prototype.toString', true);

var getInferredName = __webpack_require__(/*! ./getInferredName */ "../../../../../node_modules/es-abstract/helpers/getInferredName.js");

module.exports = function getSymbolDescription(symbol) {
	if (!symToStr) {
		throw new $SyntaxError('Symbols are not supported in this environment');
	}
	var str = symToStr(symbol); // will throw if not a symbol

	if (getInferredName) {
		var name = getInferredName(symbol);
		if (name === '') { return; }
		// eslint-disable-next-line consistent-return
		return name.slice(1, -1); // name.slice('['.length, -']'.length);
	}

	var desc = str.slice(7, -1); // str.slice('Symbol('.length, -')'.length);
	if (desc) {
		// eslint-disable-next-line consistent-return
		return desc;
	}
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/isFinite.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/isFinite.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $isNaN = Number.isNaN || function (a) { return a !== a; };

module.exports = Number.isFinite || function (x) { return typeof x === 'number' && !$isNaN(x) && x !== Infinity && x !== -Infinity; };


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/isNaN.js":
/*!**********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/isNaN.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Number.isNaN || function isNaN(a) {
	return a !== a;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/isPrefixOf.js":
/*!***************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/isPrefixOf.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $strSlice = __webpack_require__(/*! ../helpers/callBound */ "../../../../../node_modules/es-abstract/helpers/callBound.js")('String.prototype.slice');

module.exports = function isPrefixOf(prefix, string) {
	if (prefix === string) {
		return true;
	}
	if (prefix.length > string.length) {
		return false;
	}
	return $strSlice(string, 0, prefix.length) === prefix;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/isPrimitive.js":
/*!****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/isPrimitive.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/isPropertyDescriptor.js":
/*!*************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/isPropertyDescriptor.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var has = __webpack_require__(/*! has */ "../../../../../node_modules/has/src/index.js");
var $TypeError = GetIntrinsic('%TypeError%');

module.exports = function IsPropertyDescriptor(ES, Desc) {
	if (ES.Type(Desc) !== 'Object') {
		return false;
	}
	var allowed = {
		'[[Configurable]]': true,
		'[[Enumerable]]': true,
		'[[Get]]': true,
		'[[Set]]': true,
		'[[Value]]': true,
		'[[Writable]]': true
	};

    for (var key in Desc) { // eslint-disable-line
		if (has(Desc, key) && !allowed[key]) {
			return false;
		}
	}

	if (ES.IsDataDescriptor(Desc) && ES.IsAccessorDescriptor(Desc)) {
		throw new $TypeError('Property Descriptors may not be both accessor and data descriptors');
	}
	return true;
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/isSamePropertyDescriptor.js":
/*!*****************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/isSamePropertyDescriptor.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var every = __webpack_require__(/*! ./every */ "../../../../../node_modules/es-abstract/helpers/every.js");

module.exports = function isSamePropertyDescriptor(ES, D1, D2) {
	var fields = [
		'[[Configurable]]',
		'[[Enumerable]]',
		'[[Get]]',
		'[[Set]]',
		'[[Value]]',
		'[[Writable]]'
	];
	return every(fields, function (field) {
		if ((field in D1) !== (field in D2)) {
			return false;
		}
		return ES.SameValue(D1[field], D2[field]);
	});
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/maxSafeInteger.js":
/*!*******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/maxSafeInteger.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $Math = GetIntrinsic('%Math%');
var $Number = GetIntrinsic('%Number%');

module.exports = $Number.MAX_SAFE_INTEGER || $Math.pow(2, 53) - 1;


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/mod.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/mod.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function mod(number, modulo) {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/regexTester.js":
/*!****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/regexTester.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var $test = GetIntrinsic('RegExp.prototype.test');

var callBind = __webpack_require__(/*! ./callBind */ "../../../../../node_modules/es-abstract/helpers/callBind.js");

module.exports = function regexTester(regex) {
	return callBind($test, regex);
};


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/setProto.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/setProto.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(/*! ../GetIntrinsic */ "../../../../../node_modules/es-abstract/GetIntrinsic.js");

var originalSetProto = GetIntrinsic('%Object.setPrototypeOf%', true);
var $ArrayProto = GetIntrinsic('%Array.prototype%');

module.exports = originalSetProto || (
	// eslint-disable-next-line no-proto, no-negated-condition
	[].__proto__ !== $ArrayProto
		? null
		: function (O, proto) {
			O.__proto__ = proto; // eslint-disable-line no-proto
			return O;
		}
);


/***/ }),

/***/ "../../../../../node_modules/es-abstract/helpers/sign.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-abstract/helpers/sign.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function sign(number) {
	return number >= 0 ? 1 : -1;
};


/***/ }),

/***/ "../../../../../node_modules/es-to-primitive/es2015.js":
/*!*******************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-to-primitive/es2015.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var hasSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol';

var isPrimitive = __webpack_require__(/*! ./helpers/isPrimitive */ "../../../../../node_modules/es-to-primitive/helpers/isPrimitive.js");
var isCallable = __webpack_require__(/*! is-callable */ "../../../../../node_modules/is-callable/index.js");
var isDate = __webpack_require__(/*! is-date-object */ "../../../../../node_modules/is-date-object/index.js");
var isSymbol = __webpack_require__(/*! is-symbol */ "../../../../../node_modules/is-symbol/index.js");

var ordinaryToPrimitive = function OrdinaryToPrimitive(O, hint) {
	if (typeof O === 'undefined' || O === null) {
		throw new TypeError('Cannot call method on ' + O);
	}
	if (typeof hint !== 'string' || (hint !== 'number' && hint !== 'string')) {
		throw new TypeError('hint must be "string" or "number"');
	}
	var methodNames = hint === 'string' ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
	var method, result, i;
	for (i = 0; i < methodNames.length; ++i) {
		method = O[methodNames[i]];
		if (isCallable(method)) {
			result = method.call(O);
			if (isPrimitive(result)) {
				return result;
			}
		}
	}
	throw new TypeError('No default value');
};

var GetMethod = function GetMethod(O, P) {
	var func = O[P];
	if (func !== null && typeof func !== 'undefined') {
		if (!isCallable(func)) {
			throw new TypeError(func + ' returned for property ' + P + ' of object ' + O + ' is not a function');
		}
		return func;
	}
	return void 0;
};

// http://www.ecma-international.org/ecma-262/6.0/#sec-toprimitive
module.exports = function ToPrimitive(input) {
	if (isPrimitive(input)) {
		return input;
	}
	var hint = 'default';
	if (arguments.length > 1) {
		if (arguments[1] === String) {
			hint = 'string';
		} else if (arguments[1] === Number) {
			hint = 'number';
		}
	}

	var exoticToPrim;
	if (hasSymbols) {
		if (Symbol.toPrimitive) {
			exoticToPrim = GetMethod(input, Symbol.toPrimitive);
		} else if (isSymbol(input)) {
			exoticToPrim = Symbol.prototype.valueOf;
		}
	}
	if (typeof exoticToPrim !== 'undefined') {
		var result = exoticToPrim.call(input, hint);
		if (isPrimitive(result)) {
			return result;
		}
		throw new TypeError('unable to convert exotic object to primitive');
	}
	if (hint === 'default' && (isDate(input) || isSymbol(input))) {
		hint = 'string';
	}
	return ordinaryToPrimitive(input, hint === 'default' ? 'number' : hint);
};


/***/ }),

/***/ "../../../../../node_modules/es-to-primitive/es5.js":
/*!****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-to-primitive/es5.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

var isPrimitive = __webpack_require__(/*! ./helpers/isPrimitive */ "../../../../../node_modules/es-to-primitive/helpers/isPrimitive.js");

var isCallable = __webpack_require__(/*! is-callable */ "../../../../../node_modules/is-callable/index.js");

// http://ecma-international.org/ecma-262/5.1/#sec-8.12.8
var ES5internalSlots = {
	'[[DefaultValue]]': function (O) {
		var actualHint;
		if (arguments.length > 1) {
			actualHint = arguments[1];
		} else {
			actualHint = toStr.call(O) === '[object Date]' ? String : Number;
		}

		if (actualHint === String || actualHint === Number) {
			var methods = actualHint === String ? ['toString', 'valueOf'] : ['valueOf', 'toString'];
			var value, i;
			for (i = 0; i < methods.length; ++i) {
				if (isCallable(O[methods[i]])) {
					value = O[methods[i]]();
					if (isPrimitive(value)) {
						return value;
					}
				}
			}
			throw new TypeError('No default value');
		}
		throw new TypeError('invalid [[DefaultValue]] hint supplied');
	}
};

// http://ecma-international.org/ecma-262/5.1/#sec-9.1
module.exports = function ToPrimitive(input) {
	if (isPrimitive(input)) {
		return input;
	}
	if (arguments.length > 1) {
		return ES5internalSlots['[[DefaultValue]]'](input, arguments[1]);
	}
	return ES5internalSlots['[[DefaultValue]]'](input);
};


/***/ }),

/***/ "../../../../../node_modules/es-to-primitive/es6.js":
/*!****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-to-primitive/es6.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(/*! ./es2015 */ "../../../../../node_modules/es-to-primitive/es2015.js");


/***/ }),

/***/ "../../../../../node_modules/es-to-primitive/helpers/isPrimitive.js":
/*!********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es-to-primitive/helpers/isPrimitive.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function isPrimitive(value) {
	return value === null || (typeof value !== 'function' && typeof value !== 'object');
};


/***/ }),

/***/ "../../../../../node_modules/es6-promise/dist/es6-promise.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es6-promise/dist/es6-promise.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map


/***/ }),

/***/ "../../../../../node_modules/es6-promisify/dist/promise.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es6-promisify/dist/promise.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global self, window, module, global, require */
module.exports = function () {

    "use strict";

    var globalObject = void 0;

    function isFunction(x) {
        return typeof x === "function";
    }

    // Seek the global object
    if (global !== undefined) {
        globalObject = global;
    } else if (window !== undefined && window.document) {
        globalObject = window;
    } else {
        globalObject = self;
    }

    // Test for any native promise implementation, and if that
    // implementation appears to conform to the specificaton.
    // This code mostly nicked from the es6-promise module polyfill
    // and then fooled with.
    var hasPromiseSupport = function () {

        // No promise object at all, and it's a non-starter
        if (!globalObject.hasOwnProperty("Promise")) {
            return false;
        }

        // There is a Promise object. Does it conform to the spec?
        var P = globalObject.Promise;

        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        if (!P.hasOwnProperty("resolve") || !P.hasOwnProperty("reject")) {
            return false;
        }

        if (!P.hasOwnProperty("all") || !P.hasOwnProperty("race")) {
            return false;
        }

        // Older version of the spec had a resolver object
        // as the arg rather than a function
        return function () {

            var resolve = void 0;

            var p = new globalObject.Promise(function (r) {
                resolve = r;
            });

            if (p) {
                return isFunction(resolve);
            }

            return false;
        }();
    }();

    // Export the native Promise implementation if it
    // looks like it matches the spec
    if (hasPromiseSupport) {
        return globalObject.Promise;
    }

    //  Otherwise, return the es6-promise polyfill by @jaffathecake.
    return __webpack_require__(/*! es6-promise */ "../../../../../node_modules/es6-promise/dist/es6-promise.js").Promise;
}();

/***/ }),

/***/ "../../../../../node_modules/es6-promisify/dist/promisify.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/es6-promisify/dist/promisify.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global module, require */
module.exports = function () {

    "use strict";

    // Get a promise object. This may be native, or it may be polyfilled

    var ES6Promise = __webpack_require__(/*! ./promise.js */ "../../../../../node_modules/es6-promisify/dist/promise.js");

    /**
     * thatLooksLikeAPromiseToMe()
     *
     * Duck-types a promise.
     *
     * @param {object} o
     * @return {bool} True if this resembles a promise
     */
    function thatLooksLikeAPromiseToMe(o) {
        return o && typeof o.then === "function" && typeof o.catch === "function";
    }

    /**
     * promisify()
     *
     * Transforms callback-based function -- func(arg1, arg2 .. argN, callback) -- into
     * an ES6-compatible Promise. Promisify provides a default callback of the form (error, result)
     * and rejects when `error` is truthy. You can also supply settings object as the second argument.
     *
     * @param {function} original - The function to promisify
     * @param {object} settings - Settings object
     * @param {object} settings.thisArg - A `this` context to use. If not set, assume `settings` _is_ `thisArg`
     * @param {bool} settings.multiArgs - Should multiple arguments be returned as an array?
     * @return {function} A promisified version of `original`
     */
    return function promisify(original, settings) {

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var returnMultipleArguments = settings && settings.multiArgs;

            var target = void 0;
            if (settings && settings.thisArg) {
                target = settings.thisArg;
            } else if (settings) {
                target = settings;
            }

            // Return the promisified function
            return new ES6Promise(function (resolve, reject) {

                // Append the callback bound to the context
                args.push(function callback(err) {

                    if (err) {
                        return reject(err);
                    }

                    for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                        values[_key2 - 1] = arguments[_key2];
                    }

                    if (false === !!returnMultipleArguments) {
                        return resolve(values[0]);
                    }

                    resolve(values);
                });

                // Call the function
                var response = original.apply(target, args);

                // If it looks like original already returns a promise,
                // then just resolve with that promise. Hopefully, the callback function we added will just be ignored.
                if (thatLooksLikeAPromiseToMe(response)) {
                    resolve(response);
                }
            });
        };
    };
}();

/***/ }),

/***/ "../../../../../node_modules/escape-string-regexp/index.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/escape-string-regexp/index.js ***!
  \***********************************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/function-bind/implementation.js":
/*!*************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/function-bind/implementation.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


/***/ }),

/***/ "../../../../../node_modules/function-bind/index.js":
/*!****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/function-bind/index.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/function-bind/implementation.js");

module.exports = Function.prototype.bind || implementation;


/***/ }),

/***/ "../../../../../node_modules/has-flag/index.js":
/*!***********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/has-flag/index.js ***!
  \***********************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/has-symbols/index.js":
/*!**************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/has-symbols/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var origSymbol = global.Symbol;
var hasSymbolSham = __webpack_require__(/*! ./shams */ "../../../../../node_modules/has-symbols/shams.js");

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};


/***/ }),

/***/ "../../../../../node_modules/has-symbols/shams.js":
/*!**************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/has-symbols/shams.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint complexity: [2, 17], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};


/***/ }),

/***/ "../../../../../node_modules/has/src/index.js":
/*!**********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/has/src/index.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ }),

/***/ "../../../../../node_modules/https-proxy-agent/index.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/https-proxy-agent/index.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var net = __webpack_require__(/*! net */ "net");
var tls = __webpack_require__(/*! tls */ "tls");
var url = __webpack_require__(/*! url */ "url");
var assert = __webpack_require__(/*! assert */ "assert");
var Agent = __webpack_require__(/*! agent-base */ "../../../../../node_modules/agent-base/index.js");
var inherits = __webpack_require__(/*! util */ "util").inherits;
var debug = __webpack_require__(/*! debug */ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/index.js")('https-proxy-agent');

/**
 * Module exports.
 */

module.exports = HttpsProxyAgent;

/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to the
 * specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * @api public
 */

function HttpsProxyAgent(opts) {
	if (!(this instanceof HttpsProxyAgent)) return new HttpsProxyAgent(opts);
	if ('string' == typeof opts) opts = url.parse(opts);
	if (!opts)
		throw new Error(
			'an HTTP(S) proxy server `host` and `port` must be specified!'
		);
	debug('creating new HttpsProxyAgent instance: %o', opts);
	Agent.call(this, opts);

	var proxy = Object.assign({}, opts);

	// if `true`, then connect to the proxy server over TLS. defaults to `false`.
	this.secureProxy = proxy.protocol
		? /^https:?$/i.test(proxy.protocol)
		: false;

	// prefer `hostname` over `host`, and set the `port` if needed
	proxy.host = proxy.hostname || proxy.host;
	proxy.port = +proxy.port || (this.secureProxy ? 443 : 80);

	// ALPN is supported by Node.js >= v5.
	// attempt to negotiate http/1.1 for proxy servers that support http/2
	if (this.secureProxy && !('ALPNProtocols' in proxy)) {
		proxy.ALPNProtocols = ['http 1.1'];
	}

	if (proxy.host && proxy.path) {
		// if both a `host` and `path` are specified then it's most likely the
		// result of a `url.parse()` call... we need to remove the `path` portion so
		// that `net.connect()` doesn't attempt to open that as a unix socket file.
		delete proxy.path;
		delete proxy.pathname;
	}

	this.proxy = proxy;
	this.defaultPort = 443;
}
inherits(HttpsProxyAgent, Agent);

/**
 * Called when the node-core HTTP client library is creating a new HTTP request.
 *
 * @api public
 */

HttpsProxyAgent.prototype.callback = function connect(req, opts, fn) {
	var proxy = this.proxy;

	// create a socket connection to the proxy server
	var socket;
	if (this.secureProxy) {
		socket = tls.connect(proxy);
	} else {
		socket = net.connect(proxy);
	}

	// we need to buffer any HTTP traffic that happens with the proxy before we get
	// the CONNECT response, so that if the response is anything other than an "200"
	// response code, then we can re-play the "data" events on the socket once the
	// HTTP parser is hooked up...
	var buffers = [];
	var buffersLength = 0;

	function read() {
		var b = socket.read();
		if (b) ondata(b);
		else socket.once('readable', read);
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
		fn(err);
	}

	function ondata(b) {
		buffers.push(b);
		buffersLength += b.length;
		var buffered = Buffer.concat(buffers, buffersLength);
		var str = buffered.toString('ascii');

		if (!~str.indexOf('\r\n\r\n')) {
			// keep buffering
			debug('have not received end of HTTP headers yet...');
			read();
			return;
		}

		var firstLine = str.substring(0, str.indexOf('\r\n'));
		var statusCode = +firstLine.split(' ')[1];
		debug('got proxy server response: %o', firstLine);

		if (200 == statusCode) {
			// 200 Connected status code!
			var sock = socket;

			// nullify the buffered data since we won't be needing it
			buffers = buffered = null;

			if (opts.secureEndpoint) {
				// since the proxy is connecting to an SSL server, we have
				// to upgrade this socket connection to an SSL connection
				debug(
					'upgrading proxy-connected socket to TLS connection: %o',
					opts.host
				);
				opts.socket = socket;
				opts.servername = opts.servername || opts.host;
				opts.host = null;
				opts.hostname = null;
				opts.port = null;
				sock = tls.connect(opts);
			}

			cleanup();
			req.once('socket', resume);
			fn(null, sock);
		} else {
			// some other status code that's not 200... need to re-play the HTTP header
			// "data" events onto the socket once the HTTP machinery is attached so
			// that the node core `http` can parse and handle the error status code
			cleanup();

			// the original socket is closed, and a new closed socket is
			// returned instead, so that the proxy doesn't get the HTTP request
			// written to it (which may contain `Authorization` headers or other
			// sensitive data).
			//
			// See: https://hackerone.com/reports/541502
			socket.destroy();
			socket = new net.Socket();
			socket.readable = true;


			// save a reference to the concat'd Buffer for the `onsocket` callback
			buffers = buffered;

			// need to wait for the "socket" event to re-play the "data" events
			req.once('socket', onsocket);

			fn(null, socket);
		}
	}

	function onsocket(socket) {
		debug('replaying proxy buffer for failed request');
		assert(socket.listenerCount('data') > 0);

		// replay the "buffers" Buffer onto the `socket`, since at this point
		// the HTTP module machinery has been hooked up for the user
		socket.push(buffers);

		// nullify the cached Buffer instance
		buffers = null;
	}

	socket.on('error', onerror);
	socket.on('close', onclose);
	socket.on('end', onend);

	read();

	var hostname = opts.host + ':' + opts.port;
	var msg = 'CONNECT ' + hostname + ' HTTP/1.1\r\n';

	var headers = Object.assign({}, proxy.headers);
	if (proxy.auth) {
		headers['Proxy-Authorization'] =
			'Basic ' + Buffer.from(proxy.auth).toString('base64');
	}

	// the Host header should only include the port
	// number when it is a non-standard port
	var host = opts.host;
	if (!isDefaultPort(opts.port, opts.secureEndpoint)) {
		host += ':' + opts.port;
	}
	headers['Host'] = host;

	headers['Connection'] = 'close';
	Object.keys(headers).forEach(function(name) {
		msg += name + ': ' + headers[name] + '\r\n';
	});

	socket.write(msg + '\r\n');
};

/**
 * Resumes a socket.
 *
 * @param {(net.Socket|tls.Socket)} socket The socket to resume
 * @api public
 */

function resume(socket) {
	socket.resume();
}

function isDefaultPort(port, secure) {
	return Boolean((!secure && port === 80) || (secure && port === 443));
}


/***/ }),

/***/ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/browser.js":
/*!*********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/https-proxy-agent/node_modules/debug/src/browser.js ***!
  \*********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];
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
  } // Internet Explorer and Edge do not support colors.


  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  } // Is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632


  return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
  typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
  // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
  typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

  if (!this.useColors) {
    return;
  }

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit'); // The final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into

  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function (match) {
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


function log() {
  var _console;

  // This hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return (typeof console === "undefined" ? "undefined" : _typeof(console)) === 'object' && console.log && (_console = console).log.apply(_console, arguments);
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
  } catch (error) {// Swallow
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
  var r;

  try {
    r = exports.storage.getItem('debug');
  } catch (error) {} // Swallow
  // XXX (@Qix-) should we be logging these?
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
  } catch (error) {// Swallow
    // XXX (@Qix-) should we be logging these?
  }
}

module.exports = __webpack_require__(/*! ./common */ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/common.js")(exports);
var formatters = module.exports.formatters;
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

/***/ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/common.js":
/*!********************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/https-proxy-agent/node_modules/debug/src/common.js ***!
  \********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
  createDebug.humanize = __webpack_require__(/*! ms */ "../../../../../node_modules/https-proxy-agent/node_modules/ms/index.js");
  Object.keys(env).forEach(function (key) {
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
    var hash = 0;

    for (var i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
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
    var prevTime;

    function debug() {
      // Disabled?
      if (!debug.enabled) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var self = debug; // Set `diff` timestamp

      var curr = Number(new Date());
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);

      if (typeof args[0] !== 'string') {
        // Anything else let's inspect with %O
        args.unshift('%O');
      } // Apply any `formatters` transformations


      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
        // If we encounter an escaped % then don't increase the array index
        if (match === '%%') {
          return match;
        }

        index++;
        var formatter = createDebug.formatters[format];

        if (typeof formatter === 'function') {
          var val = args[index];
          match = formatter.call(self, val); // Now we need to remove `args[index]` since it's inlined in the `format`

          args.splice(index, 1);
          index--;
        }

        return match;
      }); // Apply env-specific formatting (colors, etc.)

      createDebug.formatArgs.call(self, args);
      var logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }

    debug.namespace = namespace;
    debug.enabled = createDebug.enabled(namespace);
    debug.useColors = createDebug.useColors();
    debug.color = selectColor(namespace);
    debug.destroy = destroy;
    debug.extend = extend; // Debug.formatArgs = formatArgs;
    // debug.rawLog = rawLog;
    // env-specific initialization logic for debug instances

    if (typeof createDebug.init === 'function') {
      createDebug.init(debug);
    }

    createDebug.instances.push(debug);
    return debug;
  }

  function destroy() {
    var index = createDebug.instances.indexOf(this);

    if (index !== -1) {
      createDebug.instances.splice(index, 1);
      return true;
    }

    return false;
  }

  function extend(namespace, delimiter) {
    return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
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
    var i;
    var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
    var len = split.length;

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
      var instance = createDebug.instances[i];
      instance.enabled = createDebug.enabled(instance.namespace);
    }
  }
  /**
  * Disable debug output.
  *
  * @api public
  */


  function disable() {
    createDebug.enable('');
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

    var i;
    var len;

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



/***/ }),

/***/ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/index.js":
/*!*******************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/https-proxy-agent/node_modules/debug/src/index.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */
if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
  module.exports = __webpack_require__(/*! ./browser.js */ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/browser.js");
} else {
  module.exports = __webpack_require__(/*! ./node.js */ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/node.js");
}



/***/ }),

/***/ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/node.js":
/*!******************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/https-proxy-agent/node_modules/debug/src/node.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Module dependencies.
 */
var tty = __webpack_require__(/*! tty */ "tty");

var util = __webpack_require__(/*! util */ "util");
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
  var supportsColor = __webpack_require__(/*! supports-color */ "../../../../../node_modules/supports-color/index.js");

  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    exports.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221];
  }
} catch (error) {} // Swallow - we only care if `supports-color` is available; it doesn't have to be.

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */


exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // Camel-case
  var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function (_, k) {
    return k.toUpperCase();
  }); // Coerce string value into JS value

  var val = process.env[key];

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
  return 'colors' in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */


function formatArgs(args) {
  var name = this.namespace,
      useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = "\x1B[3" + (c < 8 ? c : '8;5;' + c);
    var prefix = "  ".concat(colorCode, ";1m").concat(name, " \x1B[0m");
    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + "\x1B[0m");
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


function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
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
  var keys = Object.keys(exports.inspectOpts);

  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

module.exports = __webpack_require__(/*! ./common */ "../../../../../node_modules/https-proxy-agent/node_modules/debug/src/common.js")(exports);
var formatters = module.exports.formatters;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts).replace(/\s*\n\s*/g, ' ');
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */


formatters.O = function (v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};



/***/ }),

/***/ "../../../../../node_modules/https-proxy-agent/node_modules/ms/index.js":
/*!************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/https-proxy-agent/node_modules/ms/index.js ***!
  \************************************************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/is-callable/index.js":
/*!**************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/is-callable/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fnToStr = Function.prototype.toString;

var constructorRegex = /^\s*class\b/;
var isES6ClassFn = function isES6ClassFunction(value) {
	try {
		var fnStr = fnToStr.call(value);
		return constructorRegex.test(fnStr);
	} catch (e) {
		return false; // not a function
	}
};

var tryFunctionObject = function tryFunctionToStr(value) {
	try {
		if (isES6ClassFn(value)) { return false; }
		fnToStr.call(value);
		return true;
	} catch (e) {
		return false;
	}
};
var toStr = Object.prototype.toString;
var fnClass = '[object Function]';
var genClass = '[object GeneratorFunction]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isCallable(value) {
	if (!value) { return false; }
	if (typeof value !== 'function' && typeof value !== 'object') { return false; }
	if (typeof value === 'function' && !value.prototype) { return true; }
	if (hasToStringTag) { return tryFunctionObject(value); }
	if (isES6ClassFn(value)) { return false; }
	var strClass = toStr.call(value);
	return strClass === fnClass || strClass === genClass;
};


/***/ }),

/***/ "../../../../../node_modules/is-date-object/index.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/is-date-object/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateObject(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) { return false; }
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};


/***/ }),

/***/ "../../../../../node_modules/is-regex/index.js":
/*!***********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/is-regex/index.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = __webpack_require__(/*! has */ "../../../../../node_modules/has/src/index.js");
var regexExec = RegExp.prototype.exec;
var gOPD = Object.getOwnPropertyDescriptor;

var tryRegexExecCall = function tryRegexExec(value) {
	try {
		var lastIndex = value.lastIndex;
		value.lastIndex = 0;

		regexExec.call(value);
		return true;
	} catch (e) {
		return false;
	} finally {
		value.lastIndex = lastIndex;
	}
};
var toStr = Object.prototype.toString;
var regexClass = '[object RegExp]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isRegex(value) {
	if (!value || typeof value !== 'object') {
		return false;
	}
	if (!hasToStringTag) {
		return toStr.call(value) === regexClass;
	}

	var descriptor = gOPD(value, 'lastIndex');
	var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
	if (!hasLastIndexDataProperty) {
		return false;
	}

	return tryRegexExecCall(value);
};


/***/ }),

/***/ "../../../../../node_modules/is-symbol/index.js":
/*!************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/is-symbol/index.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;
var hasSymbols = __webpack_require__(/*! has-symbols */ "../../../../../node_modules/has-symbols/index.js")();

if (hasSymbols) {
	var symToStr = Symbol.prototype.toString;
	var symStringRegex = /^Symbol\(.*\)$/;
	var isSymbolObject = function isRealSymbolObject(value) {
		if (typeof value.valueOf() !== 'symbol') {
			return false;
		}
		return symStringRegex.test(symToStr.call(value));
	};

	module.exports = function isSymbol(value) {
		if (typeof value === 'symbol') {
			return true;
		}
		if (toStr.call(value) !== '[object Symbol]') {
			return false;
		}
		try {
			return isSymbolObject(value);
		} catch (e) {
			return false;
		}
	};
} else {

	module.exports = function isSymbol(value) {
		// this environment does not support Symbols.
		return  false && false;
	};
}


/***/ }),

/***/ "../../../../../node_modules/lru_map/lru.js":
/*!********************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/lru_map/lru.js ***!
  \********************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/object-inspect/index.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object-inspect/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;

var inspectCustom = __webpack_require__(/*! ./util.inspect */ "../../../../../node_modules/object-inspect/util.inspect.js").custom;
var inspectSymbol = (inspectCustom && isSymbol(inspectCustom)) ? inspectCustom : null;

module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
      if (obj === 0) {
        return Infinity / obj > 0 ? '0' : '-0';
      }
      return String(obj);
    }
    if (typeof obj === 'bigint') {
      return String(obj) + 'n';
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') depth = 0;
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return '[Object]';
    }

    if (typeof seen === 'undefined') seen = [];
    else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect (value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    if (isSymbol(obj)) {
        var symString = Symbol.prototype.toString.call(obj);
        return typeof obj === 'object' ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.nodeName).toLowerCase() + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        return '[ ' + arrObjKeys(obj, inspect).join(', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (parts.length === 0) return '[' + String(obj) + ']';
        return '{ [' + String(obj) + '] ' + parts.join(', ') + ' }';
    }
    if (typeof obj === 'object') {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function') {
            return obj[inspectSymbol]();
        } else if (typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var parts = [];
        mapForEach.call(obj, function (value, key) {
            parts.push(inspect(key, obj) + ' => ' + inspect(value, obj));
        });
        return collectionOf('Map', mapSize.call(obj), parts);
    }
    if (isSet(obj)) {
        var parts = [];
        setForEach.call(obj, function (value ) {
            parts.push(inspect(value, obj));
        });
        return collectionOf('Set', setSize.call(obj), parts);
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var xs = arrObjKeys(obj, inspect);
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes (s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) { return toStr(obj) === '[object Array]'; }
function isDate (obj) { return toStr(obj) === '[object Date]'; }
function isRegExp (obj) { return toStr(obj) === '[object RegExp]'; }
function isError (obj) { return toStr(obj) === '[object Error]'; }
function isSymbol (obj) { return toStr(obj) === '[object Symbol]'; }
function isString (obj) { return toStr(obj) === '[object String]'; }
function isNumber (obj) { return toStr(obj) === '[object Number]'; }
function isBigInt (obj) { return toStr(obj) === '[object BigInt]'; }
function isBoolean (obj) { return toStr(obj) === '[object Boolean]'; }

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has (obj, key) {
    return hasOwn.call(obj, key);
}

function toStr (obj) {
    return objectToString.call(obj);
}

function nameOf (f) {
    if (f.name) return f.name;
    var m = String(f).match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isMap (x) {
    if (!mapSize) {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isSet (x) {
    if (!setSize) {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set; // core-js workaround, pre-v2.5.0
    } catch (e) {}
    return false;
}

function isElement (x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string'
        && typeof x.getAttribute === 'function'
    ;
}

function inspectString (str, opts) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte (c) {
    var n = c.charCodeAt(0);
    var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
    if (x) return '\\' + x;
    return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
}

function markBoxed (str) {
    return 'Object(' + str + ')';
}

function collectionOf (type, size, entries) {
    return type + ' (' + size + ') {' + entries.join(', ') + '}';
}

function arrObjKeys (obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    for (var key in obj) {
        if (!has(obj, key)) continue;
        if (isArr && String(Number(key)) === key && key < obj.length) continue;
        if (/[^\w$]/.test(key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    return xs;
}


/***/ }),

/***/ "../../../../../node_modules/object-inspect/util.inspect.js":
/*!************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object-inspect/util.inspect.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! util */ "util").inspect;


/***/ }),

/***/ "../../../../../node_modules/object-keys/implementation.js":
/*!***********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object-keys/implementation.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = __webpack_require__(/*! ./isArguments */ "../../../../../node_modules/object-keys/isArguments.js"); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;


/***/ }),

/***/ "../../../../../node_modules/object-keys/index.js":
/*!**************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object-keys/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var slice = Array.prototype.slice;
var isArgs = __webpack_require__(/*! ./isArguments */ "../../../../../node_modules/object-keys/isArguments.js");

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : __webpack_require__(/*! ./implementation */ "../../../../../node_modules/object-keys/implementation.js");

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),

/***/ "../../../../../node_modules/object-keys/isArguments.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object-keys/isArguments.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),

/***/ "../../../../../node_modules/object.fromentries/implementation.js":
/*!******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object.fromentries/implementation.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ES = __webpack_require__(/*! es-abstract/es2019 */ "../../../../../node_modules/es-abstract/es2019.js");

var adder = function addDataProperty(key, value) {
	var O = this; // eslint-disable-line no-invalid-this
	var propertyKey = ES.ToPropertyKey(key);
	ES.CreateDataPropertyOrThrow(O, propertyKey, value);
};

var legacyAssign = function assign(obj, entries) {
	for (var i = 0; i < entries.length; ++i) {
		var entry = entries[i];
		if (ES.Type(entry) !== 'Object') {
			throw new TypeError('iterator returned a non-object; entry expected');
		}

		var key = ES.Get(entry, '0');
		var value = ES.Get(entry, '1');
		var propertyKey = ES.ToPropertyKey(key);
		ES.CreateDataPropertyOrThrow(obj, propertyKey, value);
	}
};

var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

module.exports = function fromEntries(iterable) {
	ES.RequireObjectCoercible(iterable);

	var obj = {};

	// this part isn't in the spec, it's for a reasonable fallback for pre-ES6 environments
	if (!hasSymbols) {
		if (!ES.IsArray(iterable)) {
			throw new TypeError('this environment lacks native Symbols, and can not support non-Array iterables');
		}
		legacyAssign(obj, iterable);
		return obj;
	}

	return ES.AddEntriesFromIterable(obj, iterable, adder);
};


/***/ }),

/***/ "../../../../../node_modules/object.fromentries/index.js":
/*!*********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object.fromentries/index.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__(/*! define-properties */ "../../../../../node_modules/define-properties/index.js");
var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");

var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/object.fromentries/implementation.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/object.fromentries/polyfill.js");
var shim = __webpack_require__(/*! ./shim */ "../../../../../node_modules/object.fromentries/shim.js");

var polyfill = bind.call(getPolyfill());

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;


/***/ }),

/***/ "../../../../../node_modules/object.fromentries/polyfill.js":
/*!************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object.fromentries/polyfill.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/object.fromentries/implementation.js");

module.exports = function getPolyfill() {
	return typeof Object.fromEntries === 'function' ? Object.fromEntries : implementation;
};


/***/ }),

/***/ "../../../../../node_modules/object.fromentries/shim.js":
/*!********************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/object.fromentries/shim.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getPolyfill = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/object.fromentries/polyfill.js");
var define = __webpack_require__(/*! define-properties */ "../../../../../node_modules/define-properties/index.js");

module.exports = function shimEntries() {
	var polyfill = getPolyfill();
	define(Object, { fromEntries: polyfill }, {
		fromEntries: function testEntries() {
			return Object.fromEntries !== polyfill;
		}
	});
	return polyfill;
};


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimleft/implementation.js":
/*!*************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimleft/implementation.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");
var replace = bind.call(Function.call, String.prototype.replace);

/* eslint-disable no-control-regex */
var leftWhitespace = /^[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*/;
/* eslint-enable no-control-regex */

module.exports = function trimLeft() {
	return replace(this, leftWhitespace, '');
};


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimleft/index.js":
/*!****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimleft/index.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");
var define = __webpack_require__(/*! define-properties */ "../../../../../node_modules/define-properties/index.js");

var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/string.prototype.trimleft/implementation.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/string.prototype.trimleft/polyfill.js");
var shim = __webpack_require__(/*! ./shim */ "../../../../../node_modules/string.prototype.trimleft/shim.js");

var bound = bind.call(Function.call, getPolyfill());

define(bound, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = bound;


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimleft/polyfill.js":
/*!*******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimleft/polyfill.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/string.prototype.trimleft/implementation.js");

module.exports = function getPolyfill() {
	if (!String.prototype.trimLeft) {
		return implementation;
	}
	var zeroWidthSpace = '\u200b';
	if (zeroWidthSpace.trimLeft() !== zeroWidthSpace) {
		return implementation;
	}
	return String.prototype.trimLeft;
};


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimleft/shim.js":
/*!***************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimleft/shim.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__(/*! define-properties */ "../../../../../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/string.prototype.trimleft/polyfill.js");

module.exports = function shimTrimLeft() {
	var polyfill = getPolyfill();
	define(
		String.prototype,
		{ trimLeft: polyfill },
		{ trimLeft: function () { return String.prototype.trimLeft !== polyfill; } }
	);
	return polyfill;
};


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimright/implementation.js":
/*!**************************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimright/implementation.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");
var replace = bind.call(Function.call, String.prototype.replace);

/* eslint-disable no-control-regex */
var rightWhitespace = /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]*$/;
/* eslint-enable no-control-regex */

module.exports = function trimRight() {
	return replace(this, rightWhitespace, '');
};


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimright/index.js":
/*!*****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimright/index.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! function-bind */ "../../../../../node_modules/function-bind/index.js");
var define = __webpack_require__(/*! define-properties */ "../../../../../node_modules/define-properties/index.js");

var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/string.prototype.trimright/implementation.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/string.prototype.trimright/polyfill.js");
var shim = __webpack_require__(/*! ./shim */ "../../../../../node_modules/string.prototype.trimright/shim.js");

var bound = bind.call(Function.call, getPolyfill());

define(bound, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = bound;


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimright/polyfill.js":
/*!********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimright/polyfill.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(/*! ./implementation */ "../../../../../node_modules/string.prototype.trimright/implementation.js");

module.exports = function getPolyfill() {
	if (!String.prototype.trimRight) {
		return implementation;
	}
	var zeroWidthSpace = '\u200b';
	if (zeroWidthSpace.trimRight() !== zeroWidthSpace) {
		return implementation;
	}
	return String.prototype.trimRight;
};


/***/ }),

/***/ "../../../../../node_modules/string.prototype.trimright/shim.js":
/*!****************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/string.prototype.trimright/shim.js ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var define = __webpack_require__(/*! define-properties */ "../../../../../node_modules/define-properties/index.js");
var getPolyfill = __webpack_require__(/*! ./polyfill */ "../../../../../node_modules/string.prototype.trimright/polyfill.js");

module.exports = function shimTrimRight() {
	var polyfill = getPolyfill();
	define(
		String.prototype,
		{ trimRight: polyfill },
		{ trimRight: function () { return String.prototype.trimRight !== polyfill; } }
	);
	return polyfill;
};


/***/ }),

/***/ "../../../../../node_modules/supports-color/index.js":
/*!*****************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/supports-color/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const hasFlag = __webpack_require__(/*! has-flag */ "../../../../../node_modules/has-flag/index.js");

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

/***/ "../../../../../node_modules/tiny-invariant/dist/tiny-invariant.esm.js":
/*!***********************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/tiny-invariant/dist/tiny-invariant.esm.js ***!
  \***********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var isProduction = "development" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
  if (condition) {
    return;
  }

  if (isProduction) {
    throw new Error(prefix);
  } else {
    throw new Error(prefix + ": " + (message || ''));
  }
}

/* harmony default export */ __webpack_exports__["default"] = (invariant);


/***/ }),

/***/ "../../../../../node_modules/tslib/tslib.es6.js":
/*!************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/tslib/tslib.es6.js ***!
  \************************************************************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
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

/***/ "../../../../../node_modules/typescript-string-enums/dist/index.js":
/*!*******************************************************************************************************!*\
  !*** /Users/yjutard/work/src/off/offirmo-monorepo/node_modules/typescript-string-enums/dist/index.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
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

/***/ "../../../../../node_modules/webpack/buildin/module.js":
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! no static exports found */
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

/***/ "./sub/consts.js":
/*!***********************!*\
  !*** ./sub/consts.js ***!
  \***********************/
/*! no static exports found */
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

/***/ "./sub/middlewares/require-http-method.js":
/*!************************************************!*\
  !*** ./sub/middlewares/require-http-method.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const typescript_string_enums_1 = __webpack_require__(/*! typescript-string-enums */ "../../../../../node_modules/typescript-string-enums/dist/index.js");

const utils_1 = __webpack_require__(/*! ../utils */ "./sub/utils/index.js");

exports.HttpMethod = typescript_string_enums_1.Enum('GET', 'PUT');

function require_http_method(required_method) {
  return async (SEC, event, context, response, next) => {
    if (event.httpMethod.toUpperCase() !== required_method) throw utils_1.create_error(405);
    await next();
  };
}

exports.require_http_method = require_http_method;

/***/ }),

/***/ "./sub/middlewares/runner.js":
/*!***********************************!*\
  !*** ./sub/middlewares/runner.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");

const tiny_invariant_1 = tslib_1.__importDefault(__webpack_require__(/*! tiny-invariant */ "../../../../../node_modules/tiny-invariant/dist/tiny-invariant.esm.js"));

const timestamps_1 = __webpack_require__(/*! @offirmo-private/timestamps */ "../../../../../0-stdlib/timestamps/dist/src.es2019/index.js");

const sec_1 = __webpack_require__(/*! ../services/sec */ "./sub/services/sec.js");

const sentry_1 = __webpack_require__(/*! ../services/sentry */ "./sub/services/sentry.js");

const channel_1 = __webpack_require__(/*! ../services/channel */ "./sub/services/channel.js");

const utils_1 = __webpack_require__(/*! ../utils */ "./sub/utils/index.js");

const MARGIN_AND_SENTRY_BUDGET_MS = channel_1.CHANNEL === 'dev' ? 5000 : 1000;

function err_to_response(err) {
  const statusCode = err.statusCode || 500;
  const body = err.res || `[Error] ${err.message || 'Unknown error!'}`;
  return {
    statusCode,
    body
  };
}

function use_middlewares_with_error_safety_net(event, badly_typed_context, middlewares) {
  console.log('\n\n → → → → → → → → → → → → → → → → → → → → →');
  const SESSION_START_TIME = timestamps_1.get_UTC_timestamp_ms();
  return new Promise(resolve => {
    const context = badly_typed_context; // overwrite to match handling

    sec_1.SEC.injectDependencies({
      SESSION_START_TIME
    }); ///////////////////// Setup /////////////////////

    sec_1.SEC.xTry('MW1', ({
      SEC,
      logger
    }) => {
      logger.log('Starting handling: ' + event.path + '…', {
        time: timestamps_1.get_UTC_timestamp_ms()
      }); // TODO breadcrumb

      tiny_invariant_1.default(middlewares.length >= 1, 'please provide some middlewares!');
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
        logger.fatal('⚰️ Final error:', err);

        if (channel_1.CHANNEL === 'dev') {
          logger.info('(not reported since dev)');
        } else {
          logger.info('(this error will be reported)');

          try {
            await sentry_1.on_error(err);
          } catch (err) {
            console.error('XXX huge error in the error handler itself! XXX');
          }
        } // note: once resolved, the code will be frozen by AWS lambda
        // so this must be last


        const response = err_to_response(err);
        logger.info('FYI resolving with:', {
          status: response.statusCode
        });
        resolve(response);
      }

      async function on_final_error_h({
        err
      }) {
        logger.trace('on_final_error_h');
        is_emitter_waiting = false;
        await on_final_error(err);
      }

      SEC.emitter.once('final-error').then(on_final_error_h);
      is_emitter_waiting = true;
      context.callbackWaitsForEmptyEventLoop = false; // cf. https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

      const remaining_time_ms = context.getRemainingTimeInMillis ? context.getRemainingTimeInMillis() : 10000;
      const time_budget_ms = Math.max(remaining_time_ms - MARGIN_AND_SENTRY_BUDGET_MS, 0);
      logger.info('Setting timeout...', {
        time_budget_ms
      });
      timeout_id = setTimeout(() => {
        timeout_id = null;
        SEC.xTryCatch('timeout', ({
          logger
        }) => {
          logger.fatal('⏰ timeout!');
          throw new Error('Timeout handling this request!');
        });
      }, time_budget_ms); ///////////////////// invoke /////////////////////

      SEC.xPromiseTry('MW2', async ({
        SEC,
        logger
      }) => {
        logger.trace('Invoking MW(s)_');
        const response = {
          statusCode: 500,
          body: 'Bad handler: response unmodified!'
        };

        async function next(index) {
          if (index >= middlewares.length) return;
          return middlewares[index](SEC, event, context, response, next.bind(null, index + 1));
        }

        try {
          await next(0);
        } catch (err) {
          logger.error('FYI MW rejected with:', err);
          throw err;
        }

        let {
          statusCode,
          body
        } = response;
        if (!statusCode || Math.trunc(Number(statusCode)) !== statusCode) throw new Error('The middleware(s) returned an invalid response (statusCode)!');
        if (!body) throw new Error('The middleware(s) returned an invalid response (body)!');
        logger.trace('FYI MW resolved with:', {
          status: statusCode,
          body_type: typeof body
        });
        let pseudo_err = null;

        if (statusCode >= 400) {
          const is_body_err_message = typeof body === 'string' && body.toLowerCase().includes('error');
          pseudo_err = utils_1.create_error(is_body_err_message ? body : statusCode, {
            statusCode
          });
        } // as a convenience, stringify the body automatically


        try {
          try {
            if (typeof body !== 'string') throw new Error('Internal');else JSON.parse(body);
          } catch (_a) {
            body = JSON.stringify(body); // TODO stable
          }
        } catch (_b) {
          throw new Error('The middleware(s) returned a non-JSON-stringified body and it couldn’t be fixed automatically!');
        }

        if (pseudo_err) throw pseudo_err; // so that it get consistently reported

        return {
          statusCode,
          body
        };
      }).then(response => {
        // success!
        clean(); // must be last,

        resolve(response);
      }).catch(on_final_error);
    });
  }).then(response => {
    console.log('FYI Overall promise resolved with:', response);
    return response;
  }).catch(err => {
    console.error('FYI Overall promise rejected with:', err);
    throw err;
  }).finally(() => {
    console.log(`FYI processed in ${(timestamps_1.get_UTC_timestamp_ms() - SESSION_START_TIME) / 1000.}s`);
  });
}

exports.use_middlewares_with_error_safety_net = use_middlewares_with_error_safety_net;

/***/ }),

/***/ "./sub/middlewares/test-failure.js":
/*!*****************************************!*\
  !*** ./sub/middlewares/test-failure.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");

const typescript_string_enums_1 = __webpack_require__(/*! typescript-string-enums */ "../../../../../node_modules/typescript-string-enums/dist/index.js");

const tiny_invariant_1 = tslib_1.__importDefault(__webpack_require__(/*! tiny-invariant */ "../../../../../node_modules/tiny-invariant/dist/tiny-invariant.esm.js"));

const utils_1 = __webpack_require__(/*! ../utils */ "./sub/utils/index.js");

exports.FailureMode = typescript_string_enums_1.Enum('none', 'manual', 'uncaught-sync', 'uncaught-async', 'timeout', 'unhandled-rejection', 'mess-with-response', 'non-stringified-body');

async function test_failure(SEC, event, context, response, next) {
  const mode = event.queryStringParameters && event.queryStringParameters.mode || undefined;
  tiny_invariant_1.default(!mode || typescript_string_enums_1.Enum.isType(exports.FailureMode, mode), `Invalid mode, should be one of: ` + typescript_string_enums_1.Enum.values(exports.FailureMode).join(', '));
  console.log('Failure test:', mode);
  const test_err = utils_1.create_error(`TEST ${mode}!`, {
    statusCode: 555
  });

  switch (mode) {
    case undefined:
      response.statusCode = 400;
      response.body = 'Error: Failure test: Please provide a failure mode: ' + typescript_string_enums_1.Enum.values(exports.FailureMode).join(', ');
      break;

    case exports.FailureMode['none']:
      response.statusCode = 200;
      response.body = 'All good.';
      await next();
      break;

    case exports.FailureMode['manual']:
      response.statusCode = test_err.statusCode;
      response.body = test_err.message;
      break;

    case exports.FailureMode['uncaught-sync']:
      throw test_err;

    case exports.FailureMode['uncaught-async']:
      return new Promise(() => {
        setTimeout(() => {
          throw test_err;
        }, 100);
      });

    case exports.FailureMode['timeout']:
      return new Promise(() => {// nothing
      });

    case exports.FailureMode['unhandled-rejection']:
      return new Promise(() => {
        new Promise((resolve, reject) => {
          reject(test_err);
        });
      });

    case exports.FailureMode['mess-with-response']:
      delete response.statusCode;
      delete response.body;
      response.statusCode = 'foo';
      break;

    case exports.FailureMode['non-stringified-body']:
      response.body = {
        test: 'ok'
      };
      break;

    default:
      response.statusCode = 501;
      response.body = `Failure test: mode "${mode}" not implemented!`;
      break;
  }
}

exports.test_failure = test_failure;

/***/ }),

/***/ "./sub/services/channel.js":
/*!*********************************!*\
  !*** ./sub/services/channel.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.CHANNEL = process.env.CHANNEL || (() => {
  if (process.env.AWS_SECRET_ACCESS_KEY) return 'prod';
  return  true ? 'dev' : undefined;
})();

/***/ }),

/***/ "./sub/services/logger.js":
/*!********************************!*\
  !*** ./sub/services/logger.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const {
  shim
} = __webpack_require__(/*! object.fromentries */ "../../../../../node_modules/object.fromentries/index.js");

shim();

const universal_debug_api_node_1 = __webpack_require__(/*! @offirmo-private/universal-debug-api-node */ "../../../../../2-advanced/universal-debug-api-node/dist/src.es2019/index.js");

const consts_1 = __webpack_require__(/*! ../consts */ "./sub/consts.js");

const channel_1 = __webpack_require__(/*! ./channel */ "./sub/services/channel.js"); /////////////////////////////////////////////////
//const logger = (CHANNEL === 'dev' ? create_node : create_core)({


const logger = universal_debug_api_node_1.getLogger({
  name: consts_1.APP,
  suggestedLevel: channel_1.CHANNEL === 'dev' ? 'silly' : 'warning'
});
console.log('\n\n');
logger.info(`❄️ Cold start of "${consts_1.APP}", logger level = ${logger.getLevel()}.`);
logger.info(`❄️ Cold start of "${consts_1.APP}", channel = ${channel_1.CHANNEL}.`);
exports.default = logger;

/***/ }),

/***/ "./sub/services/sec.js":
/*!*****************************!*\
  !*** ./sub/services/sec.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const tslib_1 = __webpack_require__(/*! tslib */ "../../../../../node_modules/tslib/tslib.es6.js");

const soft_execution_context_1 = __webpack_require__(/*! @offirmo-private/soft-execution-context */ "../../../../../2-advanced/soft-execution-context/dist/src.es2019/index.js");

const soft_execution_context_node_1 = __webpack_require__(/*! @offirmo-private/soft-execution-context-node */ "../../../../../2-advanced/soft-execution-context-node/src/index.js");

const consts_1 = __webpack_require__(/*! ../consts */ "./sub/consts.js");

const channel_1 = __webpack_require__(/*! ./channel */ "./sub/services/channel.js");

const logger_1 = tslib_1.__importDefault(__webpack_require__(/*! ./logger */ "./sub/services/logger.js")); /////////////////////


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
}); // TODO externalize in SEC-node
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

if (ENV !== "development") {
  logger_1.default.error('ENV detection mismatch!', {
    'SEC.ENV': ENV,
    'process.env.NODE_ENV': "development"
  });
} /////////////////////////////////////////////////


exports.default = SEC;

/***/ }),

/***/ "./sub/services/sentry.js":
/*!********************************!*\
  !*** ./sub/services/sentry.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // https://docs.sentry.io/error-reporting/quickstart/?platform=node
// https://httptoolkit.tech/blog/netlify-function-error-reporting-with-sentry/

const Sentry = __webpack_require__(/*! @sentry/node */ "../../../../../node_modules/@sentry/node/esm/index.js");

const channel_1 = __webpack_require__(/*! ./channel */ "./sub/services/channel.js");

Sentry.init({
  // http://getsentry.github.io/sentry-javascript/interfaces/node.nodeoptions.html
  dsn: 'https://a86696dcd573448a8fcc3bd7151349b4@sentry.io/1772719',
  debug: "development" === 'development',
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

/***/ "./sub/utils/index.js":
/*!****************************!*\
  !*** ./sub/utils/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const http_1 = __webpack_require__(/*! http */ "http");

const common_error_fields_1 = __webpack_require__(/*! @offirmo-private/common-error-fields */ "../../../../../1-foundation/common-error-fields/dist/src.es2019/index.js"); // TODO extern


function create_error(message, data = {}) {
  if (message && http_1.STATUS_CODES[message]) {
    message = '(auto) ' + http_1.STATUS_CODES[message];
    data.statusCode = Number(message);
  }

  message = String(message || 'Unknown error!');

  if (!message.toLowerCase().includes('error')) {
    message = 'Error: ' + message;
  }

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

/***/ "./test.js":
/*!*****************!*\
  !*** ./test.js ***!
  \*****************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

const runner_1 = __webpack_require__(/*! ./sub/middlewares/runner */ "./sub/middlewares/runner.js");

const require_http_method_1 = __webpack_require__(/*! ./sub/middlewares/require-http-method */ "./sub/middlewares/require-http-method.js");

const test_failure_1 = __webpack_require__(/*! ./sub/middlewares/test-failure */ "./sub/middlewares/test-failure.js");

async function _handler(SEC, event, context, response, next) {
  response.statusCode = 200;
  response.body = 'Test ok!';
}

const handler = (event, badly_typed_context) => {
  return runner_1.use_middlewares_with_error_safety_net(event, badly_typed_context, [require_http_method_1.require_http_method(require_http_method_1.HttpMethod.GET), test_failure_1.test_failure, _handler]);
};

exports.handler = handler;

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "console":
/*!**************************!*\
  !*** external "console" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("console");

/***/ }),

/***/ "domain":
/*!*************************!*\
  !*** external "domain" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("domain");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ })));