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
})({"ehj8":[function(require,module,exports) {
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
},{}],"Qoo0":[function(require,module,exports) {
"use strict"; //////////// Public interface (for logger usage) ////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"wv3c":[function(require,module,exports) {
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
},{"@offirmo/practical-logger-types":"Qoo0"}],"YaPT":[function(require,module,exports) {
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
},{"@offirmo/practical-logger-minimal-noop":"wv3c"}],"FUq7":[function(require,module,exports) {
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
},{"@offirmo/practical-logger-types":"Qoo0"}],"ftHY":[function(require,module,exports) {
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
},{"./v1":"FUq7","@offirmo/practical-logger-types":"Qoo0"}],"sw2i":[function(require,module,exports) {
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
},{"@offirmo/globalthis-ponyfill":"ehj8","./v1":"YaPT","@offirmo/universal-debug-api-interface":"ftHY"}],"VYmh":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = invariant;
var isProduction = "production" === 'production';
var prefix = 'Invariant failed';

function invariant(condition, message) {
  if (condition) {
    return;
  }

  if (isProduction) {
    throw new Error(prefix);
  }

  var provided = typeof message === 'function' ? message() : message;
  var value = provided ? prefix + ": " + provided : prefix;
  throw new Error(value);
}
},{}],"uoWx":[function(require,module,exports) {
"use strict";

var __spreadArray = this && this.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var _a, _b;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestIdleCallback = exports.MAX_IDLE_DELAY_MS = exports.MIN_IDLE_DELAY_MS = exports.setImmediate = exports.nextTick = void 0;

var tiny_invariant_1 = __importDefault(require("tiny-invariant"));

var globalthis_ponyfill_1 = require("@offirmo/globalthis-ponyfill"); // XXX DO NOT USE
// XXX queueMicrotask() SHOULD ALWAYS BE PREFERRED
// node only so far, semantic changed in >=0.9.1
// adds callback to the "next tick queue".
// This queue is fully drained after the current operation on the JavaScript stack runs to completion
// and before the event loop is allowed to continue.
// It's possible to create an infinite loop if one were to recursively call process.nextTick()


exports.nextTick = ((_a = (0, globalthis_ponyfill_1.getGlobalThis)().process) === null || _a === void 0 ? void 0 : _a.nextTick) || function nextTickPonyFill(callback) {
  var args = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  } // closest possible effect in browser


  queueMicrotask(function () {
    return callback.apply(void 0, args);
  });
};

exports.setImmediate = (0, globalthis_ponyfill_1.getGlobalThis)().setImmediate || function setImmediatePonyFill(callback) {
  var args = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  } // closest possible effect


  setTimeout.apply(void 0, __spreadArray([callback, 0], args, false));
}; // browser only
// Strange semantic of being clamped to 50ms
// https://developers.google.com/web/updates/2015/08/using-requestidlecallback


exports.MIN_IDLE_DELAY_MS = 2; // since <=1 is all the same

exports.MAX_IDLE_DELAY_MS = 50; // according to https://developers.google.com/web/updates/2015/08/using-requestidlecallback

var DEFAULT_IDLE_DELAY_MS = exports.MIN_IDLE_DELAY_MS; // interesting discussion:

exports.requestIdleCallback = ((_b = (0, globalthis_ponyfill_1.getGlobalThis)().requestIdleCallback) === null || _b === void 0 ? void 0 : _b.bind((0, globalthis_ponyfill_1.getGlobalThis)()) // yes, the bind is needed
) || function requestIdleCallbackPonyFill(callback, _a) {
  // inspired from https://developers.google.com/web/updates/2015/08/using-requestidlecallback#checking_for_requestidlecallback
  var _b = _a === void 0 ? {} : _a,
      _c = _b.timeout,
      timeout = _c === void 0 ? DEFAULT_IDLE_DELAY_MS : _c;

  (0, tiny_invariant_1.default)(timeout >= exports.MIN_IDLE_DELAY_MS, 'whats the point in requesting idle with a short timeout??');
  (0, tiny_invariant_1.default)(timeout <= exports.MAX_IDLE_DELAY_MS, 'must be an error requesting idle with a timeout of more than 50ms??');
  var startTime = Date.now();

  function timeRemaining() {
    return Math.max(0, Date.now() - startTime);
  } // const fake_possible_idle_delay_for_polyfill_ms = Math.floor(Math.random() * timeout) NO!! or subsequent calls may happen earlier than the previous!
  //const final_delay_ms = Math.max(fake_possible_idle_delay_for_polyfill_ms, MIN_IDLE_DELAY_MS)


  var final_delay_ms = exports.MIN_IDLE_DELAY_MS; // no choice in a polyfill...

  return setTimeout(function () {
    callback({
      didTimeout: false,
      timeRemaining: timeRemaining
    });
  }, final_delay_ms);
}; // TODO one day cancelIdleCallback (I don't need it)
},{"tiny-invariant":"VYmh","@offirmo/globalthis-ponyfill":"ehj8"}],"aA5C":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all_planned_idle_executed = exports.next_idle = exports.elapsed_time_ms = exports.end_of_current_event_loop = exports.next_microtask = void 0;

var ponyfills_1 = require("./ponyfills");

function next_microtask() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , Promise.resolve()];
        // promise resolution is in microtasks

        case 1:
          _a.sent(); // promise resolution is in microtasks


          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.next_microtask = next_microtask;

function end_of_current_event_loop() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (_a) {
      return [2
      /*return*/
      , new Promise(function (resolve) {
        setTimeout(resolve, 0);
      })];
    });
  });
}

exports.end_of_current_event_loop = end_of_current_event_loop;

function elapsed_time_ms(duration_ms) {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4
          /*yield*/
          , new Promise(function (resolve) {
            setTimeout(resolve, duration_ms);
          })];

        case 1:
          _a.sent();

          return [4
          /*yield*/
          , end_of_current_event_loop()];
        // extra wait for stuff that would fire exactly at the limit

        case 2:
          _a.sent(); // extra wait for stuff that would fire exactly at the limit


          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.elapsed_time_ms = elapsed_time_ms;

function next_idle() {
  return __awaiter(this, void 0, Promise, function () {
    return __generator(this, function (_a) {
      return [2
      /*return*/
      , new Promise(function (resolve) {
        (0, ponyfills_1.requestIdleCallback)(resolve);
      })];
    });
  });
}

exports.next_idle = next_idle; // useful for tests

function all_planned_idle_executed() {
  var _a;

  return __awaiter(this, void 0, Promise, function () {
    var info, safety;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          safety = 10;
          _b.label = 1;

        case 1:
          if (!(--safety && ((_a = info === null || info === void 0 ? void 0 : info.didTimeout) !== null && _a !== void 0 ? _a : true))) return [3
          /*break*/
          , 3];
          return [4
          /*yield*/
          , next_idle() //console.log({ safety, dt: info?.didTimeout ?? true})
          ];

        case 2:
          info = _b.sent();
          return [3
          /*break*/
          , 1];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.all_planned_idle_executed = all_planned_idle_executed;
},{"./ponyfills":"uoWx"}],"l9Jw":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dezalgo = exports.asap_but_out_of_current_event_loop = exports.asap_but_out_of_immediate_execution = exports.asap_but_not_synchronous = exports.schedule_when_idle_but_within_human_perception = exports.schedule_when_idle_but_not_too_far = exports.MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS = exports.HUMAN_PERCEPTION_MS = exports.FRAME_DURATION_MS = exports.BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS = exports.DELAY_UNTIL_NEXT_EVENT_LOOP_MS = void 0;

var ponyfills_1 = require("./ponyfills");

exports.DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 1; // for Chrome/nodejs at least

exports.BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS = 2 * exports.DELAY_UNTIL_NEXT_EVENT_LOOP_MS; // to account for outdated code using setTimeout(0)

exports.FRAME_DURATION_MS = Math.floor(1000 / 60); // 60 fps

exports.HUMAN_PERCEPTION_MS = 100; // https://developers.google.com/web/updates/2015/08/using-requestidlecallback

exports.MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS = Math.floor(exports.HUMAN_PERCEPTION_MS / 2.); // https://developers.google.com/web/updates/2015/08/using-requestidlecallback

function schedule_when_idle_but_not_too_far(callback, max_delay_ms) {
  if (max_delay_ms === void 0) {
    max_delay_ms = ponyfills_1.MAX_IDLE_DELAY_MS;
  }

  (0, ponyfills_1.requestIdleCallback)(callback, {
    timeout: max_delay_ms
  });
}

exports.schedule_when_idle_but_not_too_far = schedule_when_idle_but_not_too_far;

function schedule_when_idle_but_within_human_perception(callback) {
  // yes, same as above but semantically different
  (0, ponyfills_1.requestIdleCallback)(callback, {
    timeout: exports.MAX_IDLE_DELAY_SAFE_FOR_HUMAN_PERCEPTION_MS
  });
}

exports.schedule_when_idle_but_within_human_perception = schedule_when_idle_but_within_human_perception;

function asap_but_not_synchronous(callback) {
  queueMicrotask(callback);
}

exports.asap_but_not_synchronous = asap_but_not_synchronous;

function asap_but_out_of_immediate_execution(callback) {
  setTimeout(callback, exports.BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS);
}

exports.asap_but_out_of_immediate_execution = asap_but_out_of_immediate_execution;

function asap_but_out_of_current_event_loop(callback) {
  setTimeout(callback, exports.BETTER_DELAY_UNTIL_NEXT_EVENT_LOOP_MS);
}

exports.asap_but_out_of_current_event_loop = asap_but_out_of_current_event_loop; // https://blog.izs.me/2013/08/designing-apis-for-asynchrony

function dezalgo(callback) {
  return function () {
    return asap_but_not_synchronous(callback);
  };
}

exports.dezalgo = dezalgo;
},{"./ponyfills":"uoWx"}],"i8Ln":[function(require,module,exports) {
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

__exportStar(require("./awaitable"), exports);

__exportStar(require("./ponyfills"), exports);

__exportStar(require("./semantic"), exports);
},{"./awaitable":"aA5C","./ponyfills":"uoWx","./semantic":"l9Jw"}],"JEbM":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_LOG_LEVEL = exports.DEFAULT_LOGGER_KEY = void 0;
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
exports.LOG_LEVEL_TO_INTEGER = exports.LOG_LEVEL_TO_HUMAN = exports.LIB = exports.ALL_LOG_LEVELS = void 0;

var _constsBase = require("./consts-base");

Object.keys(_constsBase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _constsBase[key]) return;
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

// TODO externalize?
function looksLikeAnError(x) {
  return !!((x === null || x === void 0 ? void 0 : x.name) && (x === null || x === void 0 ? void 0 : x.message) && (x === null || x === void 0 ? void 0 : x.stack));
} // harmonize
// also try to recover from incorrect invocations


function normalizeArguments(raw_args) {
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

  const message = message_parts.join(' ') || (err === null || err === void 0 ? void 0 : err.message) || '(no message)';
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

function create() {
  let {
    name = _consts.DEFAULT_LOGGER_KEY,
    suggestedLevel = _consts.DEFAULT_LOG_LEVEL,
    forcedLevel,
    commonDetails = {}
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let outputFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : console.log;
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

  function serializer(level, msg, _ref) {
    let {
      err,
      ...details
    } = _ref;
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
Object.defineProperty(exports, "ALL_LOG_LEVELS", {
  enumerable: true,
  get: function () {
    return _consts.ALL_LOG_LEVELS;
  }
});
Object.defineProperty(exports, "DEFAULT_LOGGER_KEY", {
  enumerable: true,
  get: function () {
    return _consts.DEFAULT_LOGGER_KEY;
  }
});
Object.defineProperty(exports, "DEFAULT_LOG_LEVEL", {
  enumerable: true,
  get: function () {
    return _consts.DEFAULT_LOG_LEVEL;
  }
});
Object.defineProperty(exports, "LOG_LEVEL_TO_HUMAN", {
  enumerable: true,
  get: function () {
    return _consts.LOG_LEVEL_TO_HUMAN;
  }
});
Object.defineProperty(exports, "LOG_LEVEL_TO_INTEGER", {
  enumerable: true,
  get: function () {
    return _consts.LOG_LEVEL_TO_INTEGER;
  }
});
Object.defineProperty(exports, "checkLevel", {
  enumerable: true,
  get: function () {
    return _core.checkLevel;
  }
});
Object.defineProperty(exports, "createLogger", {
  enumerable: true,
  get: function () {
    return _core.create;
  }
});

var _core = require("./core");

var _practicalLoggerTypes = require("@offirmo/practical-logger-types");

Object.keys(_practicalLoggerTypes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _practicalLoggerTypes[key]) return;
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
  if (key in exports && exports[key] === _normalizeArgs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _normalizeArgs[key];
    }
  });
});
},{"./core":"guAu","@offirmo/practical-logger-types":"Qoo0","./consts":"GLOm","./normalize-args":"lMtQ"}],"NeXk":[function(require,module,exports) {
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
},{"..":"MmiO"}],"Focm":[function(require,module,exports) {
"use strict";

var _universalDebugApiPlaceholder = require("@offirmo/universal-debug-api-placeholder");

var _asyncUtils = require("@offirmo-private/async-utils");

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
(0, _asyncUtils.asap_but_out_of_immediate_execution)(render); //////////// communication ////////////

/*
function onMessage(event) {
	console.log(`[${LIB}.${+Date.now()}] seen postMessage:`, event.data)
}
const listenerOptions = {
	capture: false, // https://devdocs.io/dom/window/postmessage
}
window.addEventListener('message', onMessage, listenerOptions)
*/

/*
console.log(`[${LIB}.${+Date.now()}] sending a test postMessage...`)
window.postMessage({msg: `Test message from ${LIB}`}, '*')
*/
},{"@offirmo/universal-debug-api-placeholder":"sw2i","@offirmo-private/async-utils":"i8Ln","../../../../2-foundation/practical-logger-core/doc/shared-demo":"NeXk"}]},{},["Focm"], null)
//# sourceMappingURL=demo.c1d979c5.js.map