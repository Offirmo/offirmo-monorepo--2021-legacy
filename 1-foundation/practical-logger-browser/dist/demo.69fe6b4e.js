// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
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
  return newRequire;
})({15:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__extends = __extends;
exports.__rest = __rest;
exports.__decorate = __decorate;
exports.__param = __param;
exports.__metadata = __metadata;
exports.__awaiter = __awaiter;
exports.__generator = __generator;
exports.__exportStar = __exportStar;
exports.__values = __values;
exports.__read = __read;
exports.__spread = __spread;
exports.__await = __await;
exports.__asyncGenerator = __asyncGenerator;
exports.__asyncDelegator = __asyncDelegator;
exports.__asyncValues = __asyncValues;
exports.__makeTemplateObject = __makeTemplateObject;
exports.__importStar = __importStar;
exports.__importDefault = __importDefault;
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

var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
    d.__proto__ = b;
} || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() {
        this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = exports.__assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
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
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator],
        i = 0;
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
    var i = m.call(o),
        r,
        ar = [],
        e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
        e = { error: error };
    } finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
            if (e) throw e.error;
        }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []),
        i,
        q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
    }, i;
    function verb(n) {
        if (g[n]) i[n] = function (v) {
            return new Promise(function (a, b) {
                q.push([n, v, a, b]) > 1 || resume(n, v);
            });
        };
    }
    function resume(n, v) {
        try {
            step(g[n](v));
        } catch (e) {
            settle(q[0][3], e);
        }
    }
    function step(r) {
        r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
        resume("next", value);
    }
    function reject(value) {
        resume("throw", value);
    }
    function settle(f, v) {
        if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) {
        throw e;
    }), verb("return"), i[Symbol.iterator] = function () {
        return this;
    }, i;
    function verb(n, f) {
        i[n] = o[n] ? function (v) {
            return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v;
        } : f;
    }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
        i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
        return this;
    }, i);
    function verb(n) {
        i[n] = o[n] && function (v) {
            return new Promise(function (resolve, reject) {
                v = o[n](v), settle(resolve, reject, v.done, v.value);
            });
        };
    }
    function settle(resolve, reject, d, v) {
        Promise.resolve(v).then(function (v) {
            resolve({ value: v, done: d });
        }, reject);
    }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) {
        Object.defineProperty(cooked, "raw", { value: raw });
    } else {
        cooked.raw = raw;
    }
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
    return mod && mod.__esModule ? mod : { default: mod };
}
},{}],16:[function(require,module,exports) {
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
},{}],11:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
///////
const LogLevel = typescript_string_enums_1.Enum('fatal', 'emerg', 'alert', 'crit', 'error', 'warning', 'warn', 'notice', 'info', 'verbose', 'log', 'debug', 'trace', 'silly');
exports.LogLevel = LogLevel;
//# sourceMappingURL=types.js.map
},{"typescript-string-enums":16}],12:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const types_1 = require("./types");
const ALL_LOG_LEVELS = typescript_string_enums_1.Enum.keys(types_1.LogLevel);
exports.ALL_LOG_LEVELS = ALL_LOG_LEVELS;
// level to a numerical value, for ordering and filtering
const LEVEL_TO_INTEGER = {
    [types_1.LogLevel.fatal]: 60,
    [types_1.LogLevel.emerg]: 59,
    [types_1.LogLevel.alert]: 52,
    [types_1.LogLevel.crit]: 51,
    [types_1.LogLevel.error]: 50,
    [types_1.LogLevel.warning]: 40,
    [types_1.LogLevel.warn]: 40,
    [types_1.LogLevel.notice]: 35,
    [types_1.LogLevel.info]: 30,
    [types_1.LogLevel.verbose]: 22,
    [types_1.LogLevel.log]: 21,
    [types_1.LogLevel.debug]: 20,
    [types_1.LogLevel.trace]: 10,
    [types_1.LogLevel.silly]: 1,
};
exports.LEVEL_TO_INTEGER = LEVEL_TO_INTEGER;
if (ALL_LOG_LEVELS.length !== Object.keys(LEVEL_TO_INTEGER).length)
    throw new Error(`universal-logger-core: LEVEL_TO_INTEGER needs an update`);
// level to short, meaningful string to maybe be displayed on screen
const LEVEL_TO_HUMAN = {
    [types_1.LogLevel.fatal]: 'fatal',
    [types_1.LogLevel.emerg]: 'emergency',
    [types_1.LogLevel.alert]: 'alert',
    [types_1.LogLevel.crit]: 'critical',
    [types_1.LogLevel.error]: 'error',
    [types_1.LogLevel.warning]: 'warn',
    [types_1.LogLevel.warn]: 'warn',
    [types_1.LogLevel.notice]: 'note',
    [types_1.LogLevel.info]: 'info',
    [types_1.LogLevel.verbose]: 'verbose',
    [types_1.LogLevel.log]: 'log',
    [types_1.LogLevel.debug]: 'debug',
    [types_1.LogLevel.trace]: 'trace',
    [types_1.LogLevel.silly]: 'silly',
};
exports.LEVEL_TO_HUMAN = LEVEL_TO_HUMAN;
if (ALL_LOG_LEVELS.length !== Object.keys(LEVEL_TO_HUMAN).length)
    throw new Error(`universal-logger-core: LEVEL_TO_HUMAN needs an update`);
//# sourceMappingURL=const.js.map
},{"typescript-string-enums":16,"./types":11}],18:[function(require,module,exports) {
"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
function get_UTC_timestamp_ms() {
    return (+Date.now());
}
exports.get_UTC_timestamp_ms = get_UTC_timestamp_ms;
/////////////////////
function get_human_readable_UTC_timestamp_minutes(now = new Date()) {
    const YYYY = now.getUTCFullYear();
    const MM = ('0' + (now.getUTCMonth() + 1)).slice(-2);
    const DD = ('0' + now.getUTCDate()).slice(-2);
    const hh = ('0' + now.getUTCHours()).slice(-2);
    const mm = ('0' + now.getUTCMinutes()).slice(-2);
    return `${YYYY}${MM}${DD}_${hh}h${mm}`;
}
exports.get_human_readable_UTC_timestamp_minutes = get_human_readable_UTC_timestamp_minutes;
function get_human_readable_UTC_timestamp_ms_v1(now = new Date()) {
    const YYYY = now.getUTCFullYear();
    const MM = ('0' + (now.getUTCMonth() + 1)).slice(-2);
    const DD = ('0' + now.getUTCDate()).slice(-2);
    const hh = ('0' + now.getUTCHours()).slice(-2);
    const mm = ('0' + now.getUTCMinutes()).slice(-2);
    const ss = ('0' + now.getUTCSeconds()).slice(-2);
    const mmm = ('00' + now.getUTCMilliseconds()).slice(-3);
    // TODO remove the ':' ?
    return `${YYYY}${MM}${DD}_${hh}h${mm}:${ss}.${mmm}`;
}
exports.get_human_readable_UTC_timestamp_ms_v1 = get_human_readable_UTC_timestamp_ms_v1;
function get_human_readable_UTC_timestamp_ms(now = new Date()) {
    return 'ts1_' + get_human_readable_UTC_timestamp_ms_v1(now);
}
exports.get_human_readable_UTC_timestamp_ms = get_human_readable_UTC_timestamp_ms;
/////////////////////
//# sourceMappingURL=generate.js.map
},{}],19:[function(require,module,exports) {
"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
/////////////////////
function parse_human_readable_UTC_timestamp_ms_v1(tstamp) {
    //console.log({tstamp})
    // format: ${YYYY}${MM}${DD}_${hh}h${mm}:${ss}.${mmm}
    if (tstamp.length !== 21)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [wrong length]');
    const [date_part, time_part] = tstamp.split('_');
    //console.log({date_part, time_part})
    if (date_part.length !== 8)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [wrong date length]');
    const YYYY_part = date_part.slice(0, 4);
    const MM_part = date_part.slice(4, 6);
    const DD_part = date_part.slice(6, 8);
    const YYYY = Number(YYYY_part);
    if (YYYY < 1970)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [YYYY]');
    const MM = Number(MM_part) - 1; // stupid spec
    if (MM > 11)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [MM]');
    const DD = Number(DD_part);
    if (DD > 31)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [DD]');
    if (time_part.length !== 12)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [wrong time length]');
    const hh_part = time_part.slice(0, 2);
    const mm_part = time_part.slice(3, 5);
    const ss_part = time_part.slice(6, 8);
    const mmm_part = time_part.slice(9, 12);
    //console.log({YYYY_part, MM_part, DD_part, hh_part, mm_part, ss_part, mmm_part})
    const hh = Number(hh_part);
    if (hh > 23)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [hh]');
    const mm = Number(mm_part);
    if (mm > 59)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [mm]');
    const ss = Number(ss_part);
    if (ss > 59)
        throw new Error('Human-readable timestamp UTC/ms: cant parse! [ss]');
    const mmm = Number(mmm_part);
    //console.log({YYYY, MM, DD, hh, mm, ss, mmm})
    return new Date(Date.UTC(YYYY, MM, DD, hh, mm, ss, mmm));
}
exports.parse_human_readable_UTC_timestamp_ms_v1 = parse_human_readable_UTC_timestamp_ms_v1;
function parse_human_readable_UTC_timestamp_ms(tstamp) {
    if (tstamp.startsWith('ts1_'))
        return parse_human_readable_UTC_timestamp_ms_v1(tstamp.slice(4));
    throw new Error('wrong timestamp, cant parse!');
}
exports.parse_human_readable_UTC_timestamp_ms = parse_human_readable_UTC_timestamp_ms;
/////////////////////
//# sourceMappingURL=parse.js.map
},{}],17:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./generate"), exports);
tslib_1.__exportStar(require("./parse"), exports);
//# sourceMappingURL=index.js.map
},{"tslib":15,"./generate":18,"./parse":19}],13:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
const timestamps_1 = require("@offirmo/timestamps");
const types_1 = require("./types");
const const_1 = require("./const");
function checkLevel(level) {
    if (!typescript_string_enums_1.Enum.isType(types_1.LogLevel, level))
        throw new Error(`Not a valid log level: "${level}"!`);
}
function createLogger({ name, level = types_1.LogLevel.info, details = {}, outputFn = console.log, }) {
    if (!name)
        throw new Error('universal-logger-core›create(): you must provide a name!');
    const internalState = {
        name,
        level,
        details: Object.assign({}, details),
        outputFn: outputFn,
    };
    let level_int = 0;
    const logger = const_1.ALL_LOG_LEVELS.reduce((logger, level) => {
        logger[level] = (message, details) => {
            if (!isLevelEnabled(level))
                return;
            if (!details && typeof message === 'object') {
                details = message;
                message = details.err
                    ? details.err.message
                    : '';
            }
            message = message || '';
            outputFn(serializer(level, message, details));
        };
        return logger;
    }, {
        _: internalState,
        isLevelEnabled,
        setLevel,
        getLevel,
        addDetails,
    });
    function setLevel(level) {
        checkLevel(level);
        internalState.level = level;
        level_int = const_1.LEVEL_TO_INTEGER[level];
    }
    setLevel(level);
    function isLevelEnabled(level) {
        checkLevel(level);
        return const_1.LEVEL_TO_INTEGER[level] >= level_int;
    }
    function getLevel() {
        return internalState.level;
    }
    function addDetails(details) {
        internalState.details = Object.assign({}, internalState.details, details);
    }
    // TODO check
    /*
    function child({name, level, details}: Partial<LogParams>): Logger {
        return createChildLogger({
            parent: logger,
            name,
            level,
            details,
        })
    }
    */
    function serializer(level, msg, details) {
        const payload = {
            details: Object.assign({}, internalState.details, details),
            level,
            name,
            time: timestamps_1.get_human_readable_UTC_timestamp_ms_v1(),
            //time: (new Date()).toISOString(),
            msg,
        };
        return payload;
    }
    return logger;
}
exports.createLogger = createLogger;
//# sourceMappingURL=core.js.map
},{"typescript-string-enums":16,"@offirmo/timestamps":17,"./types":11,"./const":12}],14:[function(require,module,exports) {
"use strict";
// TODO
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
function createChildLogger({ parent, name = parent._.name, level = parent.getLevel(), details = {}, outputFn = parent._.outputFn, }) {
    details = Object.assign({}, parent._.details, details);
    return core_1.createLogger({
        name,
        level,
        details,
        outputFn,
    });
}
exports.createChildLogger = createChildLogger;
//# sourceMappingURL=child.js.map
},{"./core":13}],9:[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./types"), exports);
tslib_1.__exportStar(require("./const"), exports);
tslib_1.__exportStar(require("./core"), exports);
tslib_1.__exportStar(require("./child"), exports);
//# sourceMappingURL=index.js.map
},{"tslib":15,"./types":11,"./const":12,"./core":13,"./child":14}],7:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createChildLogger = exports.createLogger = undefined;

var _LEVEL_TO_CONSOLE_MET, _LEVEL_TO_STYLE;

var _practicalLoggerCore = require('@offirmo/practical-logger-core');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LEVEL_TO_CONSOLE_METHOD = (_LEVEL_TO_CONSOLE_MET = {}, _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.fatal, 'error'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.emerg, 'error'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.alert, 'error'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.crit, 'error'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.error, 'error'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.warning, 'warn'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.warn, 'warn'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.notice, 'info'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.info, 'info'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.verbose, 'info'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.log, 'log'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.debug, 'log'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.trace, 'log'), _defineProperty(_LEVEL_TO_CONSOLE_MET, _practicalLoggerCore.LogLevel.silly, 'log'), _LEVEL_TO_CONSOLE_MET);
var LEVEL_TO_STYLE = (_LEVEL_TO_STYLE = {}, _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.fatal, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.emerg, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.alert, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.crit, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.error, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.warning, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.warn, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.notice, 'color: #659AD2'), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.info, 'color: #659AD2'), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.verbose, 'color: #659AD2'), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.log, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.debug, ''), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.trace, 'color: #9AA2AA'), _defineProperty(_LEVEL_TO_STYLE, _practicalLoggerCore.LogLevel.silly, 'color: #9AA2AA'), _LEVEL_TO_STYLE);
function createLogger(p) {
    function outputFn(payload) {
        var level = payload.level,
            name = payload.name,
            msg = payload.msg,
            time = payload.time,
            details = payload.details;
        //const { err, ...detailsNoErr } = details

        var line = ''
        //+ time
        //+ ' '
        + ('%c[' + level + ']') + '›' + name + ': '
        //+ (msg ? ' ' : '')
        + msg;
        if (Object.keys(details).length) console[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level], details);else console[LEVEL_TO_CONSOLE_METHOD[level]](line, LEVEL_TO_STYLE[level]);
    }
    return (0, _practicalLoggerCore.createLogger)(Object.assign({}, p, { outputFn: outputFn }));
}
exports.createLogger = createLogger;
exports.createChildLogger = _practicalLoggerCore.createChildLogger;
//# sourceMappingURL=index.js.map
},{"@offirmo/practical-logger-core":9}],5:[function(require,module,exports) {
'use strict';

var _index = require('../dist/src.es7/index.js');

var logger = (0, _index.createLogger)({
	name: 'FOO',
	level: 'silly'
});

logger.log('hello');['fatal', 'emerg', 'alert', 'crit', 'error', 'warning', 'warn', 'notice', 'info', 'verbose', 'log', 'debug', 'trace', 'silly'].forEach(function (level) {
	return logger[level]({ level: level });
});
},{"../dist/src.es7/index.js":7}],20:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '59367' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[20,5], null)
//# sourceMappingURL=/demo.69fe6b4e.map