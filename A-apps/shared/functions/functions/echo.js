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
/******/ 	return __webpack_require__(__webpack_require__.s = 516);
/******/ })
/************************************************************************/
/******/ ({

/***/ 17:
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

/***/ 182:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get_netlify_user_data = exports.TEST_CLIENT_CONTEXT_USER = exports.ensure_netlify_logged_in = void 0;

const channel_1 = __webpack_require__(25);

const utils_1 = __webpack_require__(35);

function ensure_netlify_logged_in(context) {
  if (!context.clientContext) throw utils_1.create_error('No/bad/outdated token [1]! (not logged in?)', {
    statusCode: 401
  });
  if (!context.clientContext.user) throw utils_1.create_error('No/bad/outdated token [2]! (not logged in?)', {
    statusCode: 401
  });
}

exports.ensure_netlify_logged_in = ensure_netlify_logged_in;
exports.TEST_CLIENT_CONTEXT_USER = {
  email: 'dev@online-adventur.es',
  sub: 'fake-netlify-id',
  app_metadata: {
    provider: 'test',
    roles: ['test']
  },
  user_metadata: {
    avatar_url: undefined,
    full_name: 'Fake User For Dev'
  },
  exp: -1
};

function get_netlify_user_data(context) {
  try {
    ensure_netlify_logged_in(context);
  } catch (err) {
    if (err.message.includes('No/bad/outdated token') && channel_1.CHANNEL === 'dev') {
      // pretend
      context.clientContext.user = exports.TEST_CLIENT_CONTEXT_USER;
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

/***/ 20:
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CHANNEL = void 0;

const typescript_string_enums_1 = __webpack_require__(8);

const functions_interface_1 = __webpack_require__(80);

exports.CHANNEL = (() => {
  if (typescript_string_enums_1.Enum.isType(functions_interface_1.ReleaseChannel, process.env.CHANNEL)) return process.env.CHANNEL;
  if (process.env.AWS_SECRET_ACCESS_KEY) return functions_interface_1.ReleaseChannel.prod;
  return  false ? undefined : functions_interface_1.ReleaseChannel.prod;
})();

/***/ }),

/***/ 27:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLogger", function() { return getLogger; });
/* unused harmony export exposeInternal */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "overrideHook", function() { return overrideHook; });
/* unused harmony export addDebugCommand */
/* unused harmony export globalThis */
/* harmony import */ var _offirmo_globalthis_ponyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _v1__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(30);


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

/***/ 30:
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


// CONCATENATED MODULE: /Users/offirmo/work/src/off/offirmo-monorepo/3-advanced/universal-debug-api-placeholder/dist/src.es2019/v1.js

function create() {
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

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create_error = void 0;

const http_1 = __webpack_require__(20);

const common_error_fields_1 = __webpack_require__(71); // TODO extern


function create_error(message, details = {}) {
  console.log('create_error', message, details);

  if (message && http_1.STATUS_CODES[message]) {
    details.statusCode = Number(message);
    message = http_1.STATUS_CODES[details.statusCode];
  }

  message = String(message || 'Unknown error!');

  if (!message.toLowerCase().includes('error')) {
    message = 'Error: ' + message;
  }

  const error = new Error(message);
  Object.keys(details).forEach(k => {
    console.log(k);

    if (common_error_fields_1.COMMON_ERROR_FIELDS.has(k) && k !== 'name' && k !== 'message' && k !== 'stack') {
      error[k] = details[k];
    } else {
      error.details = error.details || {};
      error.details[k] = details[k];
    }
  });
  error.framesToPop = error.framesToPop || 1;
  return error;
}

exports.create_error = create_error;

/***/ }),

/***/ 516:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = void 0;

const netlify_1 = __webpack_require__(182);

exports.handler = async (event, badly_typed_context) => {
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

  const all_the_things = JSON.stringify({
    badly_typed_context,
    event,
    netlify_user_data,
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
      env: filter_out_secrets(process.env)
    }
  }, null, 2);
  console.log(all_the_things);
  return {
    statusCode: 200,
    headers: {},
    body: all_the_things
  };
};

function filter_out_secrets(env) {
  return Object.entries(env).map(([k, v]) => {
    const isSecret = k.toLowerCase().includes('secret') || k.toLowerCase().includes('token');
    return [k, isSecret ? '🙈' : v];
  }).reduce((acc, [k, v]) => {
    acc[k] = v;
    return acc;
  }, {});
}

/***/ }),

/***/ 64:
/***/ (function(module, exports) {



/***/ }),

/***/ 65:
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

/***/ 71:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _types__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _types__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _field_set__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "COMMON_ERROR_FIELDS", function() { return _field_set__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "create", function() { return _field_set__WEBPACK_IMPORTED_MODULE_1__["b"]; });




/***/ }),

/***/ 8:
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

/***/ 80:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReleaseChannel", function() { return ReleaseChannel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Endpoint", function() { return Endpoint; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_allowed_origin", function() { return get_allowed_origin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "get_base_url", function() { return get_base_url; });
/* harmony import */ var typescript_string_enums__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var typescript_string_enums__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(typescript_string_enums__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _offirmo_universal_debug_api_placeholder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27);


const LIB = 'functions interface'; // tslint:disable-next-line: variable-name

const ReleaseChannel = Object(typescript_string_enums__WEBPACK_IMPORTED_MODULE_0__["Enum"])('prod', 'staging', 'dev'); // tslint:disable-next-line: variable-name

const Endpoint = Object(typescript_string_enums__WEBPACK_IMPORTED_MODULE_0__["Enum"])('echo', 'error', 'hello', 'report-error', 'tbrpg-rpc', 'test', 'whoami');
function get_allowed_origin(channel) {
  switch (channel) {
    case 'dev':
      return 'http://localhost:8080';

    case 'staging':
      return 'https://offirmo-monorepo.netlify.com';

    case 'prod':
      return 'https://www.online-adventur.es';

    default:
      throw new Error(`[${LIB}] no allowed origin for channel "${channel}"!`);
  }
}

function _get_base_url(channel) {
  switch (channel) {
    case 'dev':
      return 'http://localhost:9000';

    case 'staging':
      return 'https://offirmo-monorepo.netlify.com/.netlify/functions';

    case 'prod':
      return 'https://www.online-adventur.es/.netlify/functions';

    default:
      if (channel === 'unknown') return 'http://test.test';
      throw new Error(`[${LIB}] no base URL for channel "${channel}"!`);
  }
}

function get_base_url(channel) {
  return Object(_offirmo_universal_debug_api_placeholder__WEBPACK_IMPORTED_MODULE_1__["overrideHook"])('fn-base-url', _get_base_url(channel));
}

/***/ })

/******/ })));
