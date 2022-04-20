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
})({"nBMh":[function(require,module,exports) {
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
},{}],"K18v":[function(require,module,exports) {
"use strict"; //////////// Public interface (for logger usage) ////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"kBMO":[function(require,module,exports) {
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
},{"@offirmo/practical-logger-types":"K18v"}],"AyMR":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var practical_logger_minimal_noop_1 = require("@offirmo/practical-logger-minimal-noop");

function create() {
  //console.trace('[UDA--placeholder installing…]')
  function NOP() {}

  var NOP_LOGGER = (0, practical_logger_minimal_noop_1.createLogger)();
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
},{"@offirmo/practical-logger-minimal-noop":"kBMO"}],"l1Wy":[function(require,module,exports) {
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
},{"@offirmo/practical-logger-types":"K18v"}],"DdPe":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerCreationParams = exports.Logger = exports.DebugApiV1 = void 0;

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
},{"./v1":"l1Wy","@offirmo/practical-logger-types":"K18v"}],"QAR9":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
var globalThis = (0, globalthis_ponyfill_1.getGlobalThis)();
exports.globalThis = globalThis; // ensure the root is present

globalThis._debug = globalThis._debug || {}; // install globally if no other implementation already present

globalThis._debug.v1 = globalThis._debug.v1 || (0, v1_1.default)(); // expose the installed implementation

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
},{"@offirmo/globalthis-ponyfill":"nBMh","./v1":"AyMR","@offirmo/universal-debug-api-interface":"DdPe"}],"yYcW":[function(require,module,exports) {
"use strict"; // base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_LOGGER_KEY = exports.DEFAULT_LOG_LEVEL = void 0;
exports.DEFAULT_LOG_LEVEL = 'error';
exports.DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key
},{}],"uPNs":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOG_LEVEL_TO_HUMAN = exports.ALL_LOG_LEVELS = exports.LOG_LEVEL_TO_INTEGER = exports.LIB = void 0;
exports.LIB = '@offirmo/practical-logger-core'; // level to a numerical value, for ordering and filtering.
// mnemonic:  100 = 100% = you will see 100% of the logs
//              1 =   1% = you will see 1% of the logs (obviously the most important)

exports.LOG_LEVEL_TO_INTEGER = {
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
exports.ALL_LOG_LEVELS = Object.keys(exports.LOG_LEVEL_TO_INTEGER).map(function (s) {
  return s;
}).sort(function (a, b) {
  return exports.LOG_LEVEL_TO_INTEGER[a] - exports.LOG_LEVEL_TO_INTEGER[b];
}); // rationalization to a clear, human understandable string
// generated to shave a few bytes
// not using fromEntries bc not available in node <12

exports.LOG_LEVEL_TO_HUMAN = exports.ALL_LOG_LEVELS.reduce(function (acc, ll) {
  acc[ll] = {
    em: 'emergency',
    wa: 'warn'
  }[ll.slice(0, 1)] || ll;
  return acc;
}, {});

__exportStar(require("./consts-base"), exports);
},{"./consts-base":"yYcW"}],"Myj7":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeArguments = exports.looksLikeAnError = void 0; // TODO externalize?

function looksLikeAnError(x) {
  return !!((x === null || x === void 0 ? void 0 : x.name) && (x === null || x === void 0 ? void 0 : x.message) && (x === null || x === void 0 ? void 0 : x.stack));
}

exports.looksLikeAnError = looksLikeAnError; // harmonize
// also try to recover from incorrect invocations

function normalizeArguments(raw_args) {
  var message_parts = [];
  var details = {};
  var err = undefined;
  Array.from(raw_args).forEach(function (arg) {
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
      details = __assign(__assign({}, details), arg);
      return;
    }

    message_parts.push(String(arg));
  });

  if (typeof details.message === 'string' && !message_parts.length) {
    message_parts.push(details.message);
    delete details.message;
  }

  var message = message_parts.join(' ') || (err === null || err === void 0 ? void 0 : err.message) || '(no message)';
  if (err) details.err = err;else delete details.err; // because could be present but not be a correct err type

  return [message, details];
}

exports.normalizeArguments = normalizeArguments;
},{}],"bulS":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.checkLevel = void 0;

var consts_1 = require("./consts");

var normalize_args_1 = require("./normalize-args");

function checkLevel(level) {
  if (!consts_1.ALL_LOG_LEVELS.includes(level)) throw new Error("[".concat(consts_1.LIB, "] Not a valid log level: \"").concat(level, "\"!"));
}

exports.checkLevel = checkLevel;

function create(_a, outputFn) {
  var _b = _a === void 0 ? {} : _a,
      _c = _b.name,
      name = _c === void 0 ? consts_1.DEFAULT_LOGGER_KEY : _c,
      _d = _b.suggestedLevel,
      suggestedLevel = _d === void 0 ? consts_1.DEFAULT_LOG_LEVEL : _d,
      forcedLevel = _b.forcedLevel,
      _e = _b.commonDetails,
      commonDetails = _e === void 0 ? {} : _e;

  if (outputFn === void 0) {
    outputFn = console.log;
  }

  var internalState = {
    name: name,
    level: forcedLevel || suggestedLevel,
    commonDetails: __assign({}, commonDetails),
    outputFn: outputFn
  };
  var levelAsInt = 100; // so far

  var logger = consts_1.ALL_LOG_LEVELS.reduce(function (logger, level) {
    var primitive = function (rawMessage, rawDetails) {
      if (!isLevelEnabled(level)) return;

      var _a = (0, normalize_args_1.normalizeArguments)(arguments),
          message = _a[0],
          details = _a[1];

      internalState.outputFn(serializer(level, message, details));
    };

    logger[level] = primitive;
    return logger;
  }, {
    setLevel: setLevel,
    getLevel: getLevel,
    addCommonDetails: addCommonDetails,
    group: function () {},
    groupCollapsed: function () {},
    groupEnd: function () {}
  });

  function setLevel(level) {
    checkLevel(level);
    internalState.level = level;
    levelAsInt = consts_1.LOG_LEVEL_TO_INTEGER[level];
  }

  setLevel(getLevel()); // to check it

  function isLevelEnabled(level) {
    checkLevel(level);
    return consts_1.LOG_LEVEL_TO_INTEGER[level] <= levelAsInt;
  }

  function getLevel() {
    return internalState.level;
  }

  function addCommonDetails(details) {
    if (details.err) throw new Error("[".concat(consts_1.LIB, "] Can't set reserved property \"err\"!"));
    internalState.commonDetails = __assign(__assign({}, internalState.commonDetails), details);
  }

  function serializer(level, msg, _a) {
    var err = _a.err,
        details = __rest(_a, ["err"]);

    var payload = {
      level: level,
      name: name,
      msg: msg,
      time: +new Date(),
      details: __assign(__assign({}, internalState.commonDetails), details)
    };
    if (err) payload.err = err;
    return payload;
  }

  return logger;
}

exports.create = create;
},{"./consts":"uPNs","./normalize-args":"Myj7"}],"M14Q":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);

  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }

  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkLevel = exports.DEFAULT_LOGGER_KEY = exports.DEFAULT_LOG_LEVEL = exports.LOG_LEVEL_TO_HUMAN = exports.LOG_LEVEL_TO_INTEGER = exports.ALL_LOG_LEVELS = exports.createLogger = void 0;

var core_1 = require("./core");

Object.defineProperty(exports, "createLogger", {
  enumerable: true,
  get: function () {
    return core_1.create;
  }
});

__exportStar(require("@offirmo/practical-logger-types"), exports);

var consts_1 = require("./consts");

Object.defineProperty(exports, "ALL_LOG_LEVELS", {
  enumerable: true,
  get: function () {
    return consts_1.ALL_LOG_LEVELS;
  }
});
Object.defineProperty(exports, "LOG_LEVEL_TO_INTEGER", {
  enumerable: true,
  get: function () {
    return consts_1.LOG_LEVEL_TO_INTEGER;
  }
});
Object.defineProperty(exports, "LOG_LEVEL_TO_HUMAN", {
  enumerable: true,
  get: function () {
    return consts_1.LOG_LEVEL_TO_HUMAN;
  }
});
Object.defineProperty(exports, "DEFAULT_LOG_LEVEL", {
  enumerable: true,
  get: function () {
    return consts_1.DEFAULT_LOG_LEVEL;
  }
});
Object.defineProperty(exports, "DEFAULT_LOGGER_KEY", {
  enumerable: true,
  get: function () {
    return consts_1.DEFAULT_LOGGER_KEY;
  }
});

var core_2 = require("./core");

Object.defineProperty(exports, "checkLevel", {
  enumerable: true,
  get: function () {
    return core_2.checkLevel;
  }
});

__exportStar(require("./normalize-args"), exports);
},{"./core":"bulS","@offirmo/practical-logger-types":"K18v","./consts":"uPNs","./normalize-args":"Myj7"}],"plv1":[function(require,module,exports) {
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

function demo_logger_basic_usage(logger) {
  let in_group = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
  logger.log('Test of a very very long message: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available."');
  logger.trace('Test of a very very long data:', {
    'What is Lorem Ipsum?': `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    'Why do we use it?': `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
    'Where does it come from?': `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`
  });
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

  console.assert(true);
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
  logger.groupCollapsed('level 2e (collapsed)');
  logger.log('in level 2e');
  console.assert(false, 'foo');
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
    name: 'LibSharedDemo',
    suggestedLevel: 'silly'
  });
  demo_logger_basic_usage(logger);
  demo_logger_levels(logger);
  demo_group(logger);
  demo_incorrect_logger_invocations(logger);
}

function demo_error(logger) {
  let in_group = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
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
},{"..":"M14Q"}],"QCba":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var universal_debug_api_placeholder_1 = require("@offirmo/universal-debug-api-placeholder");

var shared_demo_1 = require("@offirmo/practical-logger-core/doc/shared-demo"); //demo_legacy_console()


var logger = (0, universal_debug_api_placeholder_1.getLogger)({
  suggestedLevel: 'warn'
});
logger.log('hello from logger!');
var demoLogger = (0, universal_debug_api_placeholder_1.getLogger)({
  name: 'Demo',
  suggestedLevel: 'silly'
});
demoLogger.log('hello from demoLogger!', {
  bar: 42,
  baz: 33
});
var state = {
  target: undefined,
  last_demo_launched: null
};
var target_envs = ['browser', 'node', 'module'];
var demos = {
  'all-levels': function (l) {
    (0, shared_demo_1.demo_legacy_console)();
    (0, shared_demo_1.demo_logger_levels)(l);
  },
  'basic': function (l) {
    return (0, shared_demo_1.demo_logger_basic_usage)(l, false);
  },
  'error': function (l) {
    return (0, shared_demo_1.demo_error)(l, false);
  },
  'groups': shared_demo_1.demo_group
};

function run_demo(demo_id) {
  demos[demo_id](demoLogger);
  state.last_demo_launched = demo_id;
}

function render() {
  Object.keys(demos).forEach(function (demo_id) {
    document.getElementById("demo-".concat(demo_id)).removeAttribute('open');
  });

  if (state.last_demo_launched) {
    document.getElementById("demo-".concat(state.last_demo_launched)).setAttribute("open", "true");
  }

  target_envs.forEach(function (demo_id) {});
}

render(); /// event delegation

document.addEventListener('click', function (event) {
  resolution: {
    try {
      var clickedElement_1 = event.target;
      if (!clickedElement_1) throw new Error('click event has no target!');
      var demo_id = Object.keys(demos).find(function (id) {
        return clickedElement_1.matches("#btn-demo-".concat(id));
      });

      if (demo_id) {
        run_demo(demo_id);
        break resolution;
      }

      logger.trace('Event delegation: unknown click target:', {
        clickedElement: clickedElement_1
      });
    } catch (err) {
      logger.error('processingClick', {
        err: err
      });
    }
  }

  render();
});
},{"@offirmo/universal-debug-api-placeholder":"QAR9","@offirmo/practical-logger-core/doc/shared-demo":"plv1"}]},{},["QCba"], null)
//# sourceMappingURL=src.e1593e66.js.map