// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"cCMb":[function(require,module,exports) {
var global = arguments[3];
"use strict";
/* global globalThis, self, window, global */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalThis = void 0;
var lastResort = {};

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

exports.default = getGlobalThis;
exports.getGlobalThis = getGlobalThis;
},{}],"f182":[function(require,module,exports) {
"use strict"; //////////// Public interface (for logger usage) ////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"pQ1Y":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogger = exports.LoggerCreationParams = exports.Logger = void 0;

var practical_logger_types_1 = require("@offirmo/practical-logger-types");

Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return practical_logger_types_1.Logger;
  }
});
Object.defineProperty(exports, "LoggerCreationParams", {
  enumerable: true,
  get: function () {
    return practical_logger_types_1.LoggerCreationParams;
  }
});

function NOP() {}

var NOP_LOGGER = {
  setLevel: NOP,
  getLevel: function () {
    return 'silly';
  },
  addCommonDetails: NOP,
  fatal: NOP,
  emerg: NOP,
  alert: NOP,
  crit: NOP,
  error: NOP,
  warning: NOP,
  warn: NOP,
  notice: NOP,
  info: NOP,
  verbose: NOP,
  log: NOP,
  debug: NOP,
  trace: NOP,
  silly: NOP,
  group: NOP,
  groupCollapsed: NOP,
  groupEnd: NOP
};

function createLogger(_) {
  return NOP_LOGGER;
}

exports.createLogger = createLogger;
},{"@offirmo/practical-logger-types":"f182"}],"UGlG":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var practical_logger_minimal_noop_1 = require("@offirmo/practical-logger-minimal-noop");

function create() {
  //console.trace('[UDA--placeholder installing…]')
  function NOP() {}

  var NOP_LOGGER = practical_logger_minimal_noop_1.createLogger();
  return {
    getLogger: function () {
      return NOP_LOGGER;
    },
    overrideHook: function (k, v) {
      return v;
    },
    exposeInternal: NOP,
    addDebugCommand: NOP
  };
}

exports.default = create;
},{"@offirmo/practical-logger-minimal-noop":"pQ1Y"}],"X7g2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerCreationParams = exports.Logger = void 0;

var practical_logger_types_1 = require("@offirmo/practical-logger-types");

Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return practical_logger_types_1.Logger;
  }
});
Object.defineProperty(exports, "LoggerCreationParams", {
  enumerable: true,
  get: function () {
    return practical_logger_types_1.LoggerCreationParams;
  }
});
},{"@offirmo/practical-logger-types":"f182"}],"K621":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DebugApiV1 = void 0;

var v1_1 = require("./v1");

Object.defineProperty(exports, "DebugApiV1", {
  enumerable: true,
  get: function () {
    return v1_1.DebugApi;
  }
}); // for convenience

var practical_logger_types_1 = require("@offirmo/practical-logger-types");

Object.defineProperty(exports, "Logger", {
  enumerable: true,
  get: function () {
    return practical_logger_types_1.Logger;
  }
});
Object.defineProperty(exports, "LoggerCreationParams", {
  enumerable: true,
  get: function () {
    return practical_logger_types_1.LoggerCreationParams;
  }
});
},{"./v1":"X7g2","@offirmo/practical-logger-types":"f182"}],"N08m":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createV1 = exports.globalThis = exports.addDebugCommand = exports.overrideHook = exports.exposeInternal = exports.getLogger = void 0;

var globalthis_ponyfill_1 = require("@offirmo/globalthis-ponyfill");

var v1_1 = __importDefault(require("./v1"));

exports.createV1 = v1_1.default;
var globalThis = globalthis_ponyfill_1.getGlobalThis();
exports.globalThis = globalThis; // ensure the root is present

globalThis._debug = globalThis._debug || {}; // install globally if no other implementation already present

globalThis._debug.v1 = globalThis._debug.v1 || v1_1.default(); // expose the installed implementation

var instance = globalThis._debug.v1;
var getLogger = instance.getLogger,
    exposeInternal = instance.exposeInternal,
    overrideHook = instance.overrideHook,
    addDebugCommand = instance.addDebugCommand;
exports.getLogger = getLogger;
exports.exposeInternal = exposeInternal;
exports.overrideHook = overrideHook;
exports.addDebugCommand = addDebugCommand; // types & sub-types, for convenience

__exportStar(require("@offirmo/universal-debug-api-interface"), exports);
},{"@offirmo/globalthis-ponyfill":"cCMb","./v1":"UGlG","@offirmo/universal-debug-api-interface":"K621"}],"JEbM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_LOGGER_KEY = exports.DEFAULT_LOG_LEVEL = void 0;
// base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.
const DEFAULT_LOG_LEVEL = 'error';
exports.DEFAULT_LOG_LEVEL = DEFAULT_LOG_LEVEL;
const DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key

exports.DEFAULT_LOGGER_KEY = DEFAULT_LOGGER_KEY;
},{}],"GLOm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LIB: true,
  LOG_LEVEL_TO_INTEGER: true,
  ALL_LOG_LEVELS: true,
  LOG_LEVEL_TO_HUMAN: true
};
exports.LOG_LEVEL_TO_HUMAN = exports.ALL_LOG_LEVELS = exports.LOG_LEVEL_TO_INTEGER = exports.LIB = void 0;

var _constsBase = require("./consts-base");

Object.keys(_constsBase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _constsBase[key];
    }
  });
});
const LIB = '@offirmo/practical-logger-core'; // level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)

exports.LIB = LIB;
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
exports.LOG_LEVEL_TO_INTEGER = LOG_LEVEL_TO_INTEGER;
const ALL_LOG_LEVELS = Object.keys(LOG_LEVEL_TO_INTEGER).map(s => s).sort((a, b) => LOG_LEVEL_TO_INTEGER[a] - LOG_LEVEL_TO_INTEGER[b]); // rationalization to a clear, human understandable string
// generated to shave a few bytes
// not using fromEntries bc not available in node <12

exports.ALL_LOG_LEVELS = ALL_LOG_LEVELS;
const LOG_LEVEL_TO_HUMAN = ALL_LOG_LEVELS.reduce((acc, ll) => {
  acc[ll] = {
    em: 'emergency',
    wa: 'warn'
  }[ll.slice(0, 1)] || ll;
  return acc;
}, {});
exports.LOG_LEVEL_TO_HUMAN = LOG_LEVEL_TO_HUMAN;
},{"./consts-base":"JEbM"}],"lMtQ":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.looksLikeAnError = looksLikeAnError;
exports.normalizeArguments = normalizeArguments;

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
},{}],"guAu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkLevel = checkLevel;
exports.create = create;

var _consts = require("./consts");

var _normalizeArgs = require("./normalize-args");

function checkLevel(level) {
  if (!_consts.ALL_LOG_LEVELS.includes(level)) throw new Error(`[${_consts.LIB}] Not a valid log level: "${level}"!`);
}

function create({
  name = _consts.DEFAULT_LOGGER_KEY,
  suggestedLevel = _consts.DEFAULT_LOG_LEVEL,
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

  const logger = _consts.ALL_LOG_LEVELS.reduce((logger, level) => {
    const primitive = function (rawMessage, rawDetails) {
      if (!isLevelEnabled(level)) return;
      const [message, details] = (0, _normalizeArgs.normalizeArguments)(arguments);
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
    levelAsInt = _consts.LOG_LEVEL_TO_INTEGER[level];
  }

  setLevel(getLevel()); // to check it

  function isLevelEnabled(level) {
    checkLevel(level);
    return _consts.LOG_LEVEL_TO_INTEGER[level] <= levelAsInt;
  }

  function getLevel() {
    return internalState.level;
  }

  function addCommonDetails(details) {
    if (details.err) throw new Error(`[${_consts.LIB}] Can't set reserved property "err"!`);
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
},{"./consts":"GLOm","./normalize-args":"lMtQ"}],"MmiO":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createLogger: true,
  checkLevel: true,
  ALL_LOG_LEVELS: true,
  LOG_LEVEL_TO_INTEGER: true,
  LOG_LEVEL_TO_HUMAN: true,
  DEFAULT_LOG_LEVEL: true,
  DEFAULT_LOGGER_KEY: true
};
Object.defineProperty(exports, "createLogger", {
  enumerable: true,
  get: function () {
    return _core.create;
  }
});
Object.defineProperty(exports, "checkLevel", {
  enumerable: true,
  get: function () {
    return _core.checkLevel;
  }
});
Object.defineProperty(exports, "ALL_LOG_LEVELS", {
  enumerable: true,
  get: function () {
    return _consts.ALL_LOG_LEVELS;
  }
});
Object.defineProperty(exports, "LOG_LEVEL_TO_INTEGER", {
  enumerable: true,
  get: function () {
    return _consts.LOG_LEVEL_TO_INTEGER;
  }
});
Object.defineProperty(exports, "LOG_LEVEL_TO_HUMAN", {
  enumerable: true,
  get: function () {
    return _consts.LOG_LEVEL_TO_HUMAN;
  }
});
Object.defineProperty(exports, "DEFAULT_LOG_LEVEL", {
  enumerable: true,
  get: function () {
    return _consts.DEFAULT_LOG_LEVEL;
  }
});
Object.defineProperty(exports, "DEFAULT_LOGGER_KEY", {
  enumerable: true,
  get: function () {
    return _consts.DEFAULT_LOGGER_KEY;
  }
});

var _core = require("./core");

var _practicalLoggerTypes = require("@offirmo/practical-logger-types");

Object.keys(_practicalLoggerTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _practicalLoggerTypes[key];
    }
  });
});

var _consts = require("./consts");

var _normalizeArgs = require("./normalize-args");

Object.keys(_normalizeArgs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _normalizeArgs[key];
    }
  });
});
},{"./core":"guAu","@offirmo/practical-logger-types":"f182","./consts":"GLOm","./normalize-args":"lMtQ"}],"NeXk":[function(require,module,exports) {
const {
  ALL_LOG_LEVELS
} = require('..');

function demo_legacy_console() {
  console.log('------------↓ For comparison: Legacy console: levels, in order ↓-----------');
  console.debug('Legacy console > message with level "debug"', {
    level: 'debug',
    foo: 42
  });
  console.log('Legacy console > message with level "log"', {
    level: 'log',
    foo: 42
  });
  console.info('Legacy console > message with level "info"', {
    level: 'info',
    foo: 42
  });
  console.warn('Legacy console > message with level "warn"', {
    level: 'warn',
    foo: 42
  });
  console.error('Legacy console > message with level "error"', {
    level: 'error',
    foo: 42
  });
}

function demo_logger_basic_usage(logger, in_group = true) {
  console[in_group ? 'group' : 'log']('------------↓ Practical logger demo: example real usage ↓------------');
  logger.silly('Hi!');
  logger.trace('App starting...', {
    version: '1.2.3'
  });
  const bob = {
    firstName: 'Bob',
    lastName: 'Dupont',
    age: 42
  };
  logger.verbose('Current user already logged in', {
    user: bob
  });
  logger.verbose('Restoring state from cloud…');
  logger.warn('Restoration of state is taking more time than expected', {
    elapsedMs: 3000
  });
  const err = new Error('Timeout loading state!');
  err.httpStatus = 418; // to check that custom props are preserved

  logger.error(undefined, err);
  logger.info('Reverting to last known local state');
  if (in_group) console.groupEnd();
}

function demo_logger_levels(logger) {
  console.log('------------↓ Practical logger demo: all levels, in order ↓------------');
  [...ALL_LOG_LEVELS].reverse().forEach(level => logger[level](`message with level "${level}"`, {
    level,
    foo: 42
  }));
  /*
  console.groupCollapsed('in group')
  ALL_LOG_LEVELS.forEach(level =>
     logger[level](`msg with level "${level}"`)
  )
  console.groupEnd()
  */
}

function demo_group(logger) {
  console.log('------------↓ logger demo: group ↓------------');
  logger.group('level 1 (NOT collapsed)');
  logger.log('in level 1');
  logger.groupCollapsed('level 2a (collapsed)');
  logger.log('in level 2a');
  logger.groupEnd();
  logger.groupCollapsed('level 2b (collapsed)'); // no output

  logger.group('level 3a (NOT collapsed)'); // no output

  logger.groupEnd();
  logger.groupEnd();
  logger.groupCollapsed('level 2c (collapsed)'); // no output

  logger.warn('warn from level 2c!');
  logger.error(new Error('error from level 2c!'));
  logger.groupEnd();
  logger.groupCollapsed('level 2d (collapsed)');
  logger.log('in level 2d');
  logger.group('level 3b (NOT collapsed)');
  logger.warn('warn from level 3b!');
  logger.error(new Error('error from level 3b!'));
  logger.log('in level 3b');
  logger.groupEnd();
  logger.log('in level 2d');
  logger.groupEnd();
  logger.log('where am I? (should be in level 1)');
  logger.groupEnd();
  logger.groupEnd();
  logger.groupEnd();
}

function demo_incorrect_logger_invocations(logger) {
  const bob = {
    firstName: 'Bob',
    lastName: 'Dupont',
    age: 42
  };
  const more = 'some stuff';
  const err = new Error('Timeout loading state!');
  err.httpStatus = 418; // to check that custom props are preserved

  console.group('------------↓ logger demo: incorrect invocation (bunyan style) ↓------------');
  logger.info();
  logger.info('hi');
  logger.info('hi %s', bob, more);
  logger.info({
    foo: 'bar'
  }, 'hi');
  logger.info(err);
  logger.info(err, 'more on this: %s', more);
  logger.info({
    foo: 'bar',
    err: err
  }, 'some msg about this error');
  logger.warn('foo', 'bar', 42);
  console.groupEnd();
}

function demo_logger_api(getLogger) {
  console.log('------------↓ logger creation and basic usage ↓------------');
  const root_logger = getLogger({
    suggestedLevel: 'silly'
  });
  root_logger.log('Starting up');
  const logger = getLogger({
    name: 'Persistence',
    suggestedLevel: 'silly'
  });
  demo_logger_basic_usage(logger);
  demo_logger_levels(logger);
  demo_group(logger);
  demo_incorrect_logger_invocations(logger);
}

function demo_error(logger, in_group = true) {
  console[in_group ? 'group' : 'log']('------------↓ logger demo: error display ↓------------');

  function foo() {
    function bar() {
      const err = new Error('Test error!');
      err.statusCode = 1234;
      err.details = {
        hello: 42
      };
      throw err;
    }

    bar();
  }

  try {
    foo();
  } catch (err) {
    logger.log(err);
    logger.log('message', err);
    logger.log('message', {
      some: 'stuff',
      err
    });
    logger.error(err);
    logger.error('message', err);
    logger.error('message', {
      some: 'stuff',
      err
    }); //logger.error('message', { some: 'stuff' }, err)
    //logger.error('message', err, { some: 'stuff' })

    logger.error('message', {
      some: 'stuff'
    });
  }

  if (in_group) console.groupEnd();
}

function demo_devtools_fonts() {
  console.group('------------↓ available font styles ↓------------');
  console.log('default: ABCdef012');
  ['-apple-system', 'BlinkMacSystemFont', '"avenir next"', 'avenir', '"Segoe UI"', '"lucida grande"', '"helvetica neue"', 'helvetica', '"Fira Sans"', 'roboto', //'noto',
  //'"Droid Sans"',
  //'cantarell',
  //'oxygen',
  //'ubuntu',
  //'"franklin gothic medium"',
  //'"century gothic"',
  '"Liberation Sans"', 'sans-serif', '"dejavu sans mono"', '"Fira Code"', 'Menlo', 'Consolas', '"Lucida Console"', '"Courier New"', 'monospace'].forEach(font => console.log(`%c${font}: ABCdefi012 %cABCdefi012`, `font-family: ${font};`, 'font-family: unset;'));
  console.groupEnd();
}

module.exports = {
  demo_legacy_console,
  demo_logger_basic_usage,
  demo_logger_levels,
  demo_error,
  demo_group,
  demo_incorrect_logger_invocations,
  demo_logger_api,
  demo_devtools_fonts
};
},{"..":"MmiO"}],"Focm":[function(require,module,exports) {
"use strict";

var _universalDebugApiPlaceholder = require("@offirmo/universal-debug-api-placeholder");

var _sharedDemo = require("../../../../2-foundation/practical-logger-core/doc/shared-demo");

/* global: _debug */
//import '../../src/injected-libs/universal-debug-api-control'
const LIB = '📄 demo/head-script';
console.warn(`[${LIB}.${+Date.now()}] Hello, more standard!`, {
  foo_js: window.foo,
  foo_ls: (() => {
    try {
      // local files may not have local storage
      return localStorage.getItem('foo');
    } catch {
      /* ignore */
    }
  })(),
  _debug
}); //////////// usage

const logger = (0, _universalDebugApiPlaceholder.getLogger)();
logger.info('Hello from root logger!');

if (false) {
  (0, _sharedDemo.demo_logger_levels)(logger);
}

_debug.v1.addDebugCommand('pause', () => {
  console.log('paused');
});

function render() {
  const is_feature_x_on = (0, _universalDebugApiPlaceholder.overrideHook)('is_feature_on', false);
  const span_f = document.getElementById('feature-x');
  span_f.innerText = is_feature_x_on ? '✅' : '❌';
  const server = (0, _universalDebugApiPlaceholder.overrideHook)('SERVER_URL', 'https://www.online-adventur.es/');
  const link = document.getElementById('server-url');
  link.href = link.innerText = server;
  const forced_variation = (0, _universalDebugApiPlaceholder.overrideHook)('experiment_cohort', undefined);
  const variation = forced_variation || localStorage.getItem('variation') || 'not-enrolled';
  const span_x = document.getElementById('experiment');
  span_x.innerText = variation;
  const custom = (0, _universalDebugApiPlaceholder.overrideHook)('custom', undefined);
  const span_c = document.getElementById('custom');
  span_c.innerText = String(custom);
}

setInterval(render, 1000);
setTimeout(render, 1); // just for it not to be sync
//////////// communication ////////////

/*
function onMessage(event) {
	console.log(`[${LIB}.${+Date.now()}] seen postMessage:`, event.data)
}
const listenerOptions = {
	capture: false, // http://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)
*/

/*
console.log(`[${LIB}.${+Date.now()}] sending a test postMessage...`)
window.postMessage({msg: `Test message from ${LIB}`}, '*')
*/
},{"@offirmo/universal-debug-api-placeholder":"N08m","../../../../2-foundation/practical-logger-core/doc/shared-demo":"NeXk"}]},{},["Focm"], null)
//# sourceMappingURL=demo.c72e6165.js.map