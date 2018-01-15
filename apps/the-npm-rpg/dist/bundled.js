/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 97);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(47), exports);
tslib_1.__exportStar(__webpack_require__(48), exports);
tslib_1.__exportStar(__webpack_require__(49), exports);
tslib_1.__exportStar(__webpack_require__(114), exports);
tslib_1.__exportStar(__webpack_require__(115), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["__extends"] = __extends;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (immutable) */ __webpack_exports__["__rest"] = __rest;
/* harmony export (immutable) */ __webpack_exports__["__decorate"] = __decorate;
/* harmony export (immutable) */ __webpack_exports__["__param"] = __param;
/* harmony export (immutable) */ __webpack_exports__["__metadata"] = __metadata;
/* harmony export (immutable) */ __webpack_exports__["__awaiter"] = __awaiter;
/* harmony export (immutable) */ __webpack_exports__["__generator"] = __generator;
/* harmony export (immutable) */ __webpack_exports__["__exportStar"] = __exportStar;
/* harmony export (immutable) */ __webpack_exports__["__values"] = __values;
/* harmony export (immutable) */ __webpack_exports__["__read"] = __read;
/* harmony export (immutable) */ __webpack_exports__["__spread"] = __spread;
/* harmony export (immutable) */ __webpack_exports__["__await"] = __await;
/* harmony export (immutable) */ __webpack_exports__["__asyncGenerator"] = __asyncGenerator;
/* harmony export (immutable) */ __webpack_exports__["__asyncDelegator"] = __asyncDelegator;
/* harmony export (immutable) */ __webpack_exports__["__asyncValues"] = __asyncValues;
/* harmony export (immutable) */ __webpack_exports__["__makeTemplateObject"] = __makeTemplateObject;
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

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
const walk_1 = __webpack_require__(69);
const to_debug_1 = __webpack_require__(150);
function to_debug($doc) {
    return walk_1.walk($doc, to_debug_1.callbacks);
}
exports.to_debug = to_debug;
const to_text_1 = __webpack_require__(151);
function to_text($doc) {
    return walk_1.walk($doc, to_text_1.callbacks);
}
exports.to_text = to_text;
const to_html_1 = __webpack_require__(152);
function to_html($doc) {
    return walk_1.walk($doc, to_html_1.callbacks);
}
exports.to_html = to_html;
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(69), exports);
tslib_1.__exportStar(__webpack_require__(153), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*jshint eqnull:true*/
(function (root) {
  "use strict";

  var GLOBAL_KEY = "Random";

  var imul = (typeof Math.imul !== "function" || Math.imul(0xffffffff, 5) !== -5 ?
    function (a, b) {
      var ah = (a >>> 16) & 0xffff;
      var al = a & 0xffff;
      var bh = (b >>> 16) & 0xffff;
      var bl = b & 0xffff;
      // the shift by 0 fixes the sign on the high part
      // the final |0 converts the unsigned value into a signed value
      return (al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0;
    } :
    Math.imul);

  var stringRepeat = (typeof String.prototype.repeat === "function" && "x".repeat(3) === "xxx" ?
    function (x, y) {
      return x.repeat(y);
    } : function (pattern, count) {
      var result = "";
      while (count > 0) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result;
    });

  function Random(engine) {
    if (!(this instanceof Random)) {
      return new Random(engine);
    }

    if (engine == null) {
      engine = Random.engines.nativeMath;
    } else if (typeof engine !== "function") {
      throw new TypeError("Expected engine to be a function, got " + typeof engine);
    }
    this.engine = engine;
  }
  var proto = Random.prototype;

  Random.engines = {
    nativeMath: function () {
      return (Math.random() * 0x100000000) | 0;
    },
    mt19937: (function (Int32Array) {
      // http://en.wikipedia.org/wiki/Mersenne_twister
      function refreshData(data) {
        var k = 0;
        var tmp = 0;
        for (;
          (k | 0) < 227; k = (k + 1) | 0) {
          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
          data[k] = data[(k + 397) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
        }

        for (;
          (k | 0) < 623; k = (k + 1) | 0) {
          tmp = (data[k] & 0x80000000) | (data[(k + 1) | 0] & 0x7fffffff);
          data[k] = data[(k - 227) | 0] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
        }

        tmp = (data[623] & 0x80000000) | (data[0] & 0x7fffffff);
        data[623] = data[396] ^ (tmp >>> 1) ^ ((tmp & 0x1) ? 0x9908b0df : 0);
      }

      function temper(value) {
        value ^= value >>> 11;
        value ^= (value << 7) & 0x9d2c5680;
        value ^= (value << 15) & 0xefc60000;
        return value ^ (value >>> 18);
      }

      function seedWithArray(data, source) {
        var i = 1;
        var j = 0;
        var sourceLength = source.length;
        var k = Math.max(sourceLength, 624) | 0;
        var previous = data[0] | 0;
        for (;
          (k | 0) > 0; --k) {
          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x0019660d)) + (source[j] | 0) + (j | 0)) | 0;
          i = (i + 1) | 0;
          ++j;
          if ((i | 0) > 623) {
            data[0] = data[623];
            i = 1;
          }
          if (j >= sourceLength) {
            j = 0;
          }
        }
        for (k = 623;
          (k | 0) > 0; --k) {
          data[i] = previous = ((data[i] ^ imul((previous ^ (previous >>> 30)), 0x5d588b65)) - i) | 0;
          i = (i + 1) | 0;
          if ((i | 0) > 623) {
            data[0] = data[623];
            i = 1;
          }
        }
        data[0] = 0x80000000;
      }

      function mt19937() {
        var data = new Int32Array(624);
        var index = 0;
        var uses = 0;

        function next() {
          if ((index | 0) >= 624) {
            refreshData(data);
            index = 0;
          }

          var value = data[index];
          index = (index + 1) | 0;
          uses += 1;
          return temper(value) | 0;
        }
        next.getUseCount = function() {
          return uses;
        };
        next.discard = function (count) {
          uses += count;
          if ((index | 0) >= 624) {
            refreshData(data);
            index = 0;
          }
          while ((count - index) > 624) {
            count -= 624 - index;
            refreshData(data);
            index = 0;
          }
          index = (index + count) | 0;
          return next;
        };
        next.seed = function (initial) {
          var previous = 0;
          data[0] = previous = initial | 0;

          for (var i = 1; i < 624; i = (i + 1) | 0) {
            data[i] = previous = (imul((previous ^ (previous >>> 30)), 0x6c078965) + i) | 0;
          }
          index = 624;
          uses = 0;
          return next;
        };
        next.seedWithArray = function (source) {
          next.seed(0x012bd6aa);
          seedWithArray(data, source);
          return next;
        };
        next.autoSeed = function () {
          return next.seedWithArray(Random.generateEntropyArray());
        };
        return next;
      }

      return mt19937;
    }(typeof Int32Array === "function" ? Int32Array : Array)),
    browserCrypto: (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function" && (typeof Int32Array === "function" || typeof Int32Array === "object")) ? (function () {
      var data = null;
      var index = 128;

      return function () {
        if (index >= 128) {
          if (data === null) {
            data = new Int32Array(128);
          }
          crypto.getRandomValues(data);
          index = 0;
        }

        return data[index++] | 0;
      };
    }()) : ("function" === "function" && typeof __webpack_require__(25).randomBytes === "function") ? function () {
        var crypto = __webpack_require__(25);
        var bytes = crypto.randomBytes(4);
        return bytes.readInt32BE(0);
      } : null
  };
  Random.generateEntropyArray = function () {
    var array = [];
    var engine = Random.engines.nativeMath;
    for (var i = 0; i < 16; ++i) {
      array[i] = engine() | 0;
    }
    array.push(new Date().getTime() | 0);
    return array;
  };

  function returnValue(value) {
    return function () {
      return value;
    };
  }

  // [-0x80000000, 0x7fffffff]
  Random.int32 = function (engine) {
    return engine() | 0;
  };
  proto.int32 = function () {
    return Random.int32(this.engine);
  };

  // [0, 0xffffffff]
  Random.uint32 = function (engine) {
    return engine() >>> 0;
  };
  proto.uint32 = function () {
    return Random.uint32(this.engine);
  };

  // [0, 0x1fffffffffffff]
  Random.uint53 = function (engine) {
    var high = engine() & 0x1fffff;
    var low = engine() >>> 0;
    return (high * 0x100000000) + low;
  };
  proto.uint53 = function () {
    return Random.uint53(this.engine);
  };

  // [0, 0x20000000000000]
  Random.uint53Full = function (engine) {
    while (true) {
      var high = engine() | 0;
      if (high & 0x200000) {
        if ((high & 0x3fffff) === 0x200000 && (engine() | 0) === 0) {
          return 0x20000000000000;
        }
      } else {
        var low = engine() >>> 0;
        return ((high & 0x1fffff) * 0x100000000) + low;
      }
    }
  };
  proto.uint53Full = function () {
    return Random.uint53Full(this.engine);
  };

  // [-0x20000000000000, 0x1fffffffffffff]
  Random.int53 = function (engine) {
    var high = engine() | 0;
    var low = engine() >>> 0;
    return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
  };
  proto.int53 = function () {
    return Random.int53(this.engine);
  };

  // [-0x20000000000000, 0x20000000000000]
  Random.int53Full = function (engine) {
    while (true) {
      var high = engine() | 0;
      if (high & 0x400000) {
        if ((high & 0x7fffff) === 0x400000 && (engine() | 0) === 0) {
          return 0x20000000000000;
        }
      } else {
        var low = engine() >>> 0;
        return ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
      }
    }
  };
  proto.int53Full = function () {
    return Random.int53Full(this.engine);
  };

  function add(generate, addend) {
    if (addend === 0) {
      return generate;
    } else {
      return function (engine) {
        return generate(engine) + addend;
      };
    }
  }

  Random.integer = (function () {
    function isPowerOfTwoMinusOne(value) {
      return ((value + 1) & value) === 0;
    }

    function bitmask(masking) {
      return function (engine) {
        return engine() & masking;
      };
    }

    function downscaleToLoopCheckedRange(range) {
      var extendedRange = range + 1;
      var maximum = extendedRange * Math.floor(0x100000000 / extendedRange);
      return function (engine) {
        var value = 0;
        do {
          value = engine() >>> 0;
        } while (value >= maximum);
        return value % extendedRange;
      };
    }

    function downscaleToRange(range) {
      if (isPowerOfTwoMinusOne(range)) {
        return bitmask(range);
      } else {
        return downscaleToLoopCheckedRange(range);
      }
    }

    function isEvenlyDivisibleByMaxInt32(value) {
      return (value | 0) === 0;
    }

    function upscaleWithHighMasking(masking) {
      return function (engine) {
        var high = engine() & masking;
        var low = engine() >>> 0;
        return (high * 0x100000000) + low;
      };
    }

    function upscaleToLoopCheckedRange(extendedRange) {
      var maximum = extendedRange * Math.floor(0x20000000000000 / extendedRange);
      return function (engine) {
        var ret = 0;
        do {
          var high = engine() & 0x1fffff;
          var low = engine() >>> 0;
          ret = (high * 0x100000000) + low;
        } while (ret >= maximum);
        return ret % extendedRange;
      };
    }

    function upscaleWithinU53(range) {
      var extendedRange = range + 1;
      if (isEvenlyDivisibleByMaxInt32(extendedRange)) {
        var highRange = ((extendedRange / 0x100000000) | 0) - 1;
        if (isPowerOfTwoMinusOne(highRange)) {
          return upscaleWithHighMasking(highRange);
        }
      }
      return upscaleToLoopCheckedRange(extendedRange);
    }

    function upscaleWithinI53AndLoopCheck(min, max) {
      return function (engine) {
        var ret = 0;
        do {
          var high = engine() | 0;
          var low = engine() >>> 0;
          ret = ((high & 0x1fffff) * 0x100000000) + low + (high & 0x200000 ? -0x20000000000000 : 0);
        } while (ret < min || ret > max);
        return ret;
      };
    }

    return function (min, max) {
      min = Math.floor(min);
      max = Math.floor(max);
      if (min < -0x20000000000000 || !isFinite(min)) {
        throw new RangeError("Expected min to be at least " + (-0x20000000000000));
      } else if (max > 0x20000000000000 || !isFinite(max)) {
        throw new RangeError("Expected max to be at most " + 0x20000000000000);
      }

      var range = max - min;
      if (range <= 0 || !isFinite(range)) {
        return returnValue(min);
      } else if (range === 0xffffffff) {
        if (min === 0) {
          return Random.uint32;
        } else {
          return add(Random.int32, min + 0x80000000);
        }
      } else if (range < 0xffffffff) {
        return add(downscaleToRange(range), min);
      } else if (range === 0x1fffffffffffff) {
        return add(Random.uint53, min);
      } else if (range < 0x1fffffffffffff) {
        return add(upscaleWithinU53(range), min);
      } else if (max - 1 - min === 0x1fffffffffffff) {
        return add(Random.uint53Full, min);
      } else if (min === -0x20000000000000 && max === 0x20000000000000) {
        return Random.int53Full;
      } else if (min === -0x20000000000000 && max === 0x1fffffffffffff) {
        return Random.int53;
      } else if (min === -0x1fffffffffffff && max === 0x20000000000000) {
        return add(Random.int53, 1);
      } else if (max === 0x20000000000000) {
        return add(upscaleWithinI53AndLoopCheck(min - 1, max - 1), 1);
      } else {
        return upscaleWithinI53AndLoopCheck(min, max);
      }
    };
  }());
  proto.integer = function (min, max) {
    return Random.integer(min, max)(this.engine);
  };

  // [0, 1] (floating point)
  Random.realZeroToOneInclusive = function (engine) {
    return Random.uint53Full(engine) / 0x20000000000000;
  };
  proto.realZeroToOneInclusive = function () {
    return Random.realZeroToOneInclusive(this.engine);
  };

  // [0, 1) (floating point)
  Random.realZeroToOneExclusive = function (engine) {
    return Random.uint53(engine) / 0x20000000000000;
  };
  proto.realZeroToOneExclusive = function () {
    return Random.realZeroToOneExclusive(this.engine);
  };

  Random.real = (function () {
    function multiply(generate, multiplier) {
      if (multiplier === 1) {
        return generate;
      } else if (multiplier === 0) {
        return function () {
          return 0;
        };
      } else {
        return function (engine) {
          return generate(engine) * multiplier;
        };
      }
    }

    return function (left, right, inclusive) {
      if (!isFinite(left)) {
        throw new RangeError("Expected left to be a finite number");
      } else if (!isFinite(right)) {
        throw new RangeError("Expected right to be a finite number");
      }
      return add(
        multiply(
          inclusive ? Random.realZeroToOneInclusive : Random.realZeroToOneExclusive,
          right - left),
        left);
    };
  }());
  proto.real = function (min, max, inclusive) {
    return Random.real(min, max, inclusive)(this.engine);
  };

  Random.bool = (function () {
    function isLeastBitTrue(engine) {
      return (engine() & 1) === 1;
    }

    function lessThan(generate, value) {
      return function (engine) {
        return generate(engine) < value;
      };
    }

    function probability(percentage) {
      if (percentage <= 0) {
        return returnValue(false);
      } else if (percentage >= 1) {
        return returnValue(true);
      } else {
        var scaled = percentage * 0x100000000;
        if (scaled % 1 === 0) {
          return lessThan(Random.int32, (scaled - 0x80000000) | 0);
        } else {
          return lessThan(Random.uint53, Math.round(percentage * 0x20000000000000));
        }
      }
    }

    return function (numerator, denominator) {
      if (denominator == null) {
        if (numerator == null) {
          return isLeastBitTrue;
        }
        return probability(numerator);
      } else {
        if (numerator <= 0) {
          return returnValue(false);
        } else if (numerator >= denominator) {
          return returnValue(true);
        }
        return lessThan(Random.integer(0, denominator - 1), numerator);
      }
    };
  }());
  proto.bool = function (numerator, denominator) {
    return Random.bool(numerator, denominator)(this.engine);
  };

  function toInteger(value) {
    var number = +value;
    if (number < 0) {
      return Math.ceil(number);
    } else {
      return Math.floor(number);
    }
  }

  function convertSliceArgument(value, length) {
    if (value < 0) {
      return Math.max(value + length, 0);
    } else {
      return Math.min(value, length);
    }
  }
  Random.pick = function (engine, array, begin, end) {
    var length = array.length;
    var start = begin == null ? 0 : convertSliceArgument(toInteger(begin), length);
    var finish = end === void 0 ? length : convertSliceArgument(toInteger(end), length);
    if (start >= finish) {
      return void 0;
    }
    var distribution = Random.integer(start, finish - 1);
    return array[distribution(engine)];
  };
  proto.pick = function (array, begin, end) {
    return Random.pick(this.engine, array, begin, end);
  };

  function returnUndefined() {
    return void 0;
  }
  var slice = Array.prototype.slice;
  Random.picker = function (array, begin, end) {
    var clone = slice.call(array, begin, end);
    if (!clone.length) {
      return returnUndefined;
    }
    var distribution = Random.integer(0, clone.length - 1);
    return function (engine) {
      return clone[distribution(engine)];
    };
  };

  Random.shuffle = function (engine, array, downTo) {
    var length = array.length;
    if (length) {
      if (downTo == null) {
        downTo = 0;
      }
      for (var i = (length - 1) >>> 0; i > downTo; --i) {
        var distribution = Random.integer(0, i);
        var j = distribution(engine);
        if (i !== j) {
          var tmp = array[i];
          array[i] = array[j];
          array[j] = tmp;
        }
      }
    }
    return array;
  };
  proto.shuffle = function (array) {
    return Random.shuffle(this.engine, array);
  };

  Random.sample = function (engine, population, sampleSize) {
    if (sampleSize < 0 || sampleSize > population.length || !isFinite(sampleSize)) {
      throw new RangeError("Expected sampleSize to be within 0 and the length of the population");
    }

    if (sampleSize === 0) {
      return [];
    }

    var clone = slice.call(population);
    var length = clone.length;
    if (length === sampleSize) {
      return Random.shuffle(engine, clone, 0);
    }
    var tailLength = length - sampleSize;
    return Random.shuffle(engine, clone, tailLength - 1).slice(tailLength);
  };
  proto.sample = function (population, sampleSize) {
    return Random.sample(this.engine, population, sampleSize);
  };

  Random.die = function (sideCount) {
    return Random.integer(1, sideCount);
  };
  proto.die = function (sideCount) {
    return Random.die(sideCount)(this.engine);
  };

  Random.dice = function (sideCount, dieCount) {
    var distribution = Random.die(sideCount);
    return function (engine) {
      var result = [];
      result.length = dieCount;
      for (var i = 0; i < dieCount; ++i) {
        result[i] = distribution(engine);
      }
      return result;
    };
  };
  proto.dice = function (sideCount, dieCount) {
    return Random.dice(sideCount, dieCount)(this.engine);
  };

  // http://en.wikipedia.org/wiki/Universally_unique_identifier
  Random.uuid4 = (function () {
    function zeroPad(string, zeroCount) {
      return stringRepeat("0", zeroCount - string.length) + string;
    }

    return function (engine) {
      var a = engine() >>> 0;
      var b = engine() | 0;
      var c = engine() | 0;
      var d = engine() >>> 0;

      return (
        zeroPad(a.toString(16), 8) +
        "-" +
        zeroPad((b & 0xffff).toString(16), 4) +
        "-" +
        zeroPad((((b >> 4) & 0x0fff) | 0x4000).toString(16), 4) +
        "-" +
        zeroPad(((c & 0x3fff) | 0x8000).toString(16), 4) +
        "-" +
        zeroPad(((c >> 4) & 0xffff).toString(16), 4) +
        zeroPad(d.toString(16), 8));
    };
  }());
  proto.uuid4 = function () {
    return Random.uuid4(this.engine);
  };

  Random.string = (function () {
    // has 2**x chars, for faster uniform distribution
    var DEFAULT_STRING_POOL = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";

    return function (pool) {
      if (pool == null) {
        pool = DEFAULT_STRING_POOL;
      }

      var length = pool.length;
      if (!length) {
        throw new Error("Expected pool not to be an empty string");
      }

      var distribution = Random.integer(0, length - 1);
      return function (engine, length) {
        var result = "";
        for (var i = 0; i < length; ++i) {
          var j = distribution(engine);
          result += pool.charAt(j);
        }
        return result;
      };
    };
  }());
  proto.string = function (length, pool) {
    return Random.string(pool)(this.engine, length);
  };

  Random.hex = (function () {
    var LOWER_HEX_POOL = "0123456789abcdef";
    var lowerHex = Random.string(LOWER_HEX_POOL);
    var upperHex = Random.string(LOWER_HEX_POOL.toUpperCase());

    return function (upper) {
      if (upper) {
        return upperHex;
      } else {
        return lowerHex;
      }
    };
  }());
  proto.hex = function (length, upper) {
    return Random.hex(upper)(this.engine, length);
  };

  Random.date = function (start, end) {
    if (!(start instanceof Date)) {
      throw new TypeError("Expected start to be a Date, got " + typeof start);
    } else if (!(end instanceof Date)) {
      throw new TypeError("Expected end to be a Date, got " + typeof end);
    }
    var distribution = Random.integer(start.getTime(), end.getTime());
    return function (engine) {
      return new Date(distribution(engine));
    };
  };
  proto.date = function (start, end) {
    return Random.date(start, end)(this.engine);
  };

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return {
        Random: Random
      };
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof module !== "undefined" && typeof require === "function") {
    module.exports = {
      Random: Random
    };
  } else {
    (function () {
      var oldGlobal = root[GLOBAL_KEY];
      Random.noConflict = function () {
        root[GLOBAL_KEY] = oldGlobal;
        return this;
      };
    }());
    root[GLOBAL_KEY] = Random;
  }
}(this));


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(56), exports);
tslib_1.__exportStar(__webpack_require__(126), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(58), exports);
tslib_1.__exportStar(__webpack_require__(128), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const random_1 = __webpack_require__(4);
const data_1 = __webpack_require__(129);
exports.i18n_messages = data_1.i18n_messages;
exports.static_armor_data = data_1.ENTRIES;
const types_1 = __webpack_require__(131);
exports.ArmorPartType = types_1.ArmorPartType;
const consts_1 = __webpack_require__(132);
const ARMOR_BASES = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.base);
const ARMOR_QUALIFIERS1 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.qualifier1);
const ARMOR_QUALIFIERS2 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.ArmorPartType.qualifier2);
const MIN_ENHANCEMENT_LEVEL = 0;
exports.MIN_ENHANCEMENT_LEVEL = MIN_ENHANCEMENT_LEVEL;
const MAX_ENHANCEMENT_LEVEL = 8;
exports.MAX_ENHANCEMENT_LEVEL = MAX_ENHANCEMENT_LEVEL;
const MIN_STRENGTH = 1;
exports.MIN_STRENGTH = MIN_STRENGTH;
const MAX_STRENGTH = 20;
exports.MAX_STRENGTH = MAX_STRENGTH;
/////////////////////
function pick_random_quality(rng) {
    // legendary =    1/1000
    // epic:     =   10/1000
    // rare:     =  200/1000
    // uncommon  =  389/1000
    // common    =  400/1000
    return random_1.Random.bool(400, 1000)(rng)
        ? definitions_1.ItemQuality.common
        : random_1.Random.bool(389, 600)(rng)
            ? definitions_1.ItemQuality.uncommon
            : random_1.Random.bool(200, 211)(rng)
                ? definitions_1.ItemQuality.rare
                : random_1.Random.bool(10, 11)(rng)
                    ? definitions_1.ItemQuality.epic
                    : definitions_1.ItemQuality.legendary;
}
function pick_random_base(rng) {
    return random_1.Random.pick(rng, ARMOR_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return random_1.Random.pick(rng, ARMOR_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return random_1.Random.pick(rng, ARMOR_QUALIFIERS2).hid;
}
const pick_random_base_strength = random_1.Random.integer(MIN_STRENGTH, MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    return Object.assign({ base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng) }, definitions_1.create_item_base(definitions_1.InventorySlot.armor, hints.quality || pick_random_quality(rng)), { base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || 0 });
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_armor() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng, {
        enhancement_level: random_1.Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
exports.generate_random_demo_armor = generate_random_demo_armor;
/////////////////////
// for sorting
function compare_armors_by_strength(a, b) {
    const a_dmg = get_medium_damage_reduction(a);
    const b_dmg = get_medium_damage_reduction(b);
    if (a_dmg !== b_dmg)
        return b_dmg - a_dmg;
    // with equal damage, the least enhanced has more potential
    if (a.enhancement_level !== b.enhancement_level)
        return a.enhancement_level - b.enhancement_level;
    // fallback to other attributes
    return definitions_1.compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid);
}
exports.compare_armors_by_strength = compare_armors_by_strength;
function enhance(armor) {
    if (armor.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error(`can't enhance an armor above the maximal enhancement level!`);
    armor.enhancement_level++;
    return armor;
}
exports.enhance = enhance;
function get_damage_reduction_interval(armor) {
    const ATTACK_VS_DEFENSE_RATIO = 0.5;
    return consts_1.get_interval(armor.base_strength, armor.quality, armor.enhancement_level, ATTACK_VS_DEFENSE_RATIO);
}
exports.get_damage_reduction_interval = get_damage_reduction_interval;
function get_medium_damage_reduction(armor) {
    const reduction_range = get_damage_reduction_interval(armor);
    return Math.round((reduction_range[0] + reduction_range[1]) / 2);
}
exports.get_medium_damage_reduction = get_medium_damage_reduction;
/////////////////////
const DEMO_ARMOR_1 = {
    uuid: 'uu1~test~demo~armor~0001',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.armor,
    base_hid: ARMOR_BASES[0].hid,
    qualifier1_hid: ARMOR_QUALIFIERS1[0].hid,
    qualifier2_hid: ARMOR_QUALIFIERS2[0].hid,
    quality: definitions_1.ItemQuality.uncommon,
    base_strength: MIN_STRENGTH + 1,
    enhancement_level: MIN_ENHANCEMENT_LEVEL,
};
exports.DEMO_ARMOR_1 = DEMO_ARMOR_1;
const DEMO_ARMOR_2 = {
    uuid: 'uu1~test~demo~armor~0002',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.armor,
    base_hid: ARMOR_BASES[1].hid,
    qualifier1_hid: ARMOR_QUALIFIERS1[1].hid,
    qualifier2_hid: ARMOR_QUALIFIERS2[1].hid,
    quality: definitions_1.ItemQuality.legendary,
    base_strength: MAX_STRENGTH - 1,
    enhancement_level: MAX_ENHANCEMENT_LEVEL,
};
exports.DEMO_ARMOR_2 = DEMO_ARMOR_2;
/////////////////////
//# sourceMappingURL=index.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const random_1 = __webpack_require__(4);
const data_1 = __webpack_require__(133);
exports.i18n_messages = data_1.i18n_messages;
exports.static_weapon_data = data_1.ENTRIES;
const types_1 = __webpack_require__(135);
exports.WeaponPartType = types_1.WeaponPartType;
const consts_1 = __webpack_require__(136);
const WEAPON_BASES = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.base);
const WEAPON_QUALIFIERS1 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.qualifier1);
const WEAPON_QUALIFIERS2 = data_1.ENTRIES.filter((armor_component) => armor_component.type === types_1.WeaponPartType.qualifier2);
const MIN_ENHANCEMENT_LEVEL = 0;
exports.MIN_ENHANCEMENT_LEVEL = MIN_ENHANCEMENT_LEVEL;
const MAX_ENHANCEMENT_LEVEL = 8;
exports.MAX_ENHANCEMENT_LEVEL = MAX_ENHANCEMENT_LEVEL;
const MIN_STRENGTH = 1;
exports.MIN_STRENGTH = MIN_STRENGTH;
const MAX_STRENGTH = 20;
exports.MAX_STRENGTH = MAX_STRENGTH;
/////////////////////
function pick_random_quality(rng) {
    // legendary =    1/1000
    // epic:     =   10/1000
    // rare:     =  200/1000
    // uncommon  =  389/1000
    // common    =  400/1000
    return random_1.Random.bool(400, 1000)(rng)
        ? definitions_1.ItemQuality.common
        : random_1.Random.bool(389, 600)(rng)
            ? definitions_1.ItemQuality.uncommon
            : random_1.Random.bool(200, 211)(rng)
                ? definitions_1.ItemQuality.rare
                : random_1.Random.bool(10, 11)(rng)
                    ? definitions_1.ItemQuality.epic
                    : definitions_1.ItemQuality.legendary;
}
function pick_random_base(rng) {
    return random_1.Random.pick(rng, WEAPON_BASES).hid;
}
function pick_random_qualifier1(rng) {
    return random_1.Random.pick(rng, WEAPON_QUALIFIERS1).hid;
}
function pick_random_qualifier2(rng) {
    return random_1.Random.pick(rng, WEAPON_QUALIFIERS2).hid;
}
const pick_random_base_strength = random_1.Random.integer(MIN_STRENGTH, MAX_STRENGTH);
/////////////////////
function create(rng, hints = {}) {
    // TODO add a check for hints to be in existing components
    return Object.assign({ slot: definitions_1.InventorySlot.weapon, base_hid: hints.base_hid || pick_random_base(rng), qualifier1_hid: hints.qualifier1_hid || pick_random_qualifier1(rng), qualifier2_hid: hints.qualifier2_hid || pick_random_qualifier2(rng) }, definitions_1.create_item_base(definitions_1.InventorySlot.weapon, hints.quality || pick_random_quality(rng)), { base_strength: hints.base_strength || pick_random_base_strength(rng), enhancement_level: hints.enhancement_level || 0 });
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_weapon() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng, {
        enhancement_level: random_1.Random.integer(0, MAX_ENHANCEMENT_LEVEL)(rng)
    });
}
exports.generate_random_demo_weapon = generate_random_demo_weapon;
/////////////////////
// for sorting
function compare_weapons_by_strength(a, b) {
    const a_dmg = get_medium_damage(a);
    const b_dmg = get_medium_damage(b);
    if (a_dmg !== b_dmg)
        return b_dmg - a_dmg;
    // with equal damage, the least enhanced has more potential
    if (a.enhancement_level !== b.enhancement_level)
        return a.enhancement_level - b.enhancement_level;
    // fallback to other attributes
    return definitions_1.compare_items_by_quality(a, b) || a.uuid.localeCompare(b.uuid);
}
exports.compare_weapons_by_strength = compare_weapons_by_strength;
function enhance(weapon) {
    if (weapon.enhancement_level >= MAX_ENHANCEMENT_LEVEL)
        throw new Error(`can't enhance a weapon above the maximal enhancement level!`);
    weapon.enhancement_level++;
    return weapon;
}
exports.enhance = enhance;
///////
function get_damage_interval(weapon) {
    return consts_1.get_interval(weapon.base_strength, weapon.quality, weapon.enhancement_level);
}
exports.get_damage_interval = get_damage_interval;
function get_medium_damage(weapon) {
    const damage_range = get_damage_interval(weapon);
    return Math.round((damage_range[0] + damage_range[1]) / 2);
}
exports.get_medium_damage = get_medium_damage;
/////////////////////
const DEMO_WEAPON_1 = {
    uuid: 'uu1~test~demo~weapon~001',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.weapon,
    base_hid: WEAPON_BASES[0].hid,
    qualifier1_hid: WEAPON_QUALIFIERS1[0].hid,
    qualifier2_hid: WEAPON_QUALIFIERS2[0].hid,
    quality: definitions_1.ItemQuality.uncommon,
    base_strength: MIN_STRENGTH + 1,
    enhancement_level: MIN_ENHANCEMENT_LEVEL,
};
exports.DEMO_WEAPON_1 = DEMO_WEAPON_1;
const DEMO_WEAPON_2 = {
    uuid: 'uu1~test~demo~weapon~002',
    element_type: definitions_1.ElementType.item,
    slot: definitions_1.InventorySlot.weapon,
    base_hid: WEAPON_BASES[1].hid,
    qualifier1_hid: WEAPON_QUALIFIERS1[1].hid,
    qualifier2_hid: WEAPON_QUALIFIERS2[1].hid,
    quality: definitions_1.ItemQuality.legendary,
    base_strength: MAX_STRENGTH - 1,
    enhancement_level: MAX_ENHANCEMENT_LEVEL,
};
exports.DEMO_WEAPON_2 = DEMO_WEAPON_2;
/////////////////////
//# sourceMappingURL=index.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function deepFreeze (o) {
  Object.freeze(o);

  var oIsFunction = typeof o === "function";
  var hasOwnProp = Object.prototype.hasOwnProperty;

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (hasOwnProp.call(o, prop)
    && (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true )
    && o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  
  return o;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(60), exports);
tslib_1.__exportStar(__webpack_require__(61), exports);
tslib_1.__exportStar(__webpack_require__(137), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(62), exports);
tslib_1.__exportStar(__webpack_require__(138), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const escapeStringRegexp = __webpack_require__(33);
const ansiStyles = __webpack_require__(161);
const supportsColor = __webpack_require__(165);

const template = __webpack_require__(167);

const isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm');

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'];

// `color-convert` models to exclude from the Chalk API due to conflicts and such
const skipModels = new Set(['gray']);

const styles = Object.create(null);

function applyOptions(obj, options) {
	options = options || {};

	// Detect level if not set manually
	const scLevel = supportsColor ? supportsColor.level : 0;
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
module.exports.supportsColor = supportsColor;
module.exports.default = module.exports; // For TypeScript


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 17 */
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

var ansiStyles = colors.styles = __webpack_require__(169);
var defineProps = Object.defineProperties;

colors.supportsColor = __webpack_require__(170);

if (typeof colors.enabled === "undefined") {
  colors.enabled = colors.supportsColor;
}

colors.stripColors = colors.strip = function(str){
  return ("" + str).replace(/\x1B\[\d+m/g, '');
};


var stylize = colors.stylize = function stylize (str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  return ansiStyles[style].open + str + ansiStyles[style].close;
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe,  '\\$&');
}

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

var styles = (function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);
  if (argsLen > 1) {
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!colors.enabled || !str) {
    return str;
  }

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
  }

  return str;
}

function applyTheme (theme) {
  for (var style in theme) {
    (function(style){
      colors[style] = function(str){
        if (typeof theme[style] === 'object'){
          var out = str;
          for (var i in theme[style]){
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style)
  }
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      colors.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      applyTheme(colors.themes[theme]);
      return colors.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer (map, str) {
  var exploded = str.split(""), i = 0;
  exploded = exploded.map(map);
  return exploded.join("");
};

// custom formatter methods
colors.trap = __webpack_require__(172);
colors.zalgo = __webpack_require__(173);

// maps
colors.maps = {};
colors.maps.america = __webpack_require__(174);
colors.maps.zebra = __webpack_require__(175);
colors.maps.rainbow = __webpack_require__(176);
colors.maps.random = __webpack_require__(177)

for (var map in colors.maps) {
  (function(map){
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    }
  })(map)
}

defineProps(colors, init());

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB = 'soft-execution-context';
exports.LIB = LIB;
const INTERNAL_PROP = '_';
exports.INTERNAL_PROP = INTERNAL_PROP;
//# sourceMappingURL=constants.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
///////
const NodeType = typescript_string_enums_1.Enum('span', 'br', 'hr', 'ol', 'ul', 'li', 'strong', 'em', 'section', 'heading');
exports.NodeType = NodeType;
//# sourceMappingURL=types.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// ### Module dependencies
var colors = __webpack_require__(168);
var Utils = __webpack_require__(178);

exports.version = __webpack_require__(179).version;

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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// simply rename / clean the APIs

/////////////////////////////////////////////////

const enclose_in_box = __webpack_require__(76)

const stylize_string = __webpack_require__(14)

const prettyjson = __webpack_require__(20)
function prettify_json(data, options) {
	return prettyjson.render(data, options)
}

// https://github.com/sindresorhus/indent-string
const indent_string = __webpack_require__(38)

// https://github.com/AnAppAMonth/linewrap
const linewrap = __webpack_require__(83)
function wrap_lines(s, size) {
	return linewrap(size, {skipScheme: 'ansi-color'})(s)
}


// code taken from https://github.com/sindresorhus/clear-cli
// The MIT License (MIT)
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
const ansiEscapes = __webpack_require__(213)
function clear_terminal() {
	process.stdout.write(ansiEscapes.clearScreen)
}

// https://github.com/nexdrew/ansi-align

/////////////////////////////////////////////////

module.exports = {
	enclose_in_box,
	stylize_string,
	indent_string,
	wrap_lines,
	prettify_json,
	clear_terminal,
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(68), exports);
tslib_1.__exportStar(__webpack_require__(148), exports);
tslib_1.__exportStar(__webpack_require__(154), exports);
// TODO add shared version check here
//# sourceMappingURL=index.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = __webpack_require__(11);
/////////////////////
const definitions_1 = __webpack_require__(1);
const MetaState = __webpack_require__(53);
const CharacterState = __webpack_require__(7);
const state_character_1 = __webpack_require__(7);
const WalletState = __webpack_require__(8);
const state_wallet_1 = __webpack_require__(8);
const InventoryState = __webpack_require__(12);
const PRNGState = __webpack_require__(13);
const state_prng_1 = __webpack_require__(13);
const logic_weapons_1 = __webpack_require__(10);
const logic_armors_1 = __webpack_require__(9);
const logic_monsters_1 = __webpack_require__(64);
const logic_shop_1 = __webpack_require__(143);
const consts_1 = __webpack_require__(29);
const types_1 = __webpack_require__(144);
exports.GainType = types_1.GainType;
const play_1 = __webpack_require__(145);
const sec_1 = __webpack_require__(30);
/////////////////////
function appraise_item(state, uuid) {
    const item_to_sell = InventoryState.get_item(state.inventory, uuid);
    if (!item_to_sell)
        throw new Error('Sell: No item!');
    return logic_shop_1.appraise(item_to_sell);
}
exports.appraise_item = appraise_item;
///////
function create() {
    let state = {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        meta: MetaState.create(),
        avatar: CharacterState.create(sec_1.get_SEC()),
        inventory: InventoryState.create(),
        wallet: WalletState.create(),
        prng: PRNGState.create(),
        last_adventure: null,
        click_count: 0,
        good_click_count: 0,
        meaningful_interaction_count: 0,
    };
    let rng = state_prng_1.get_prng(state.prng);
    const starting_weapon = logic_weapons_1.create(rng, {
        base_hid: 'spoon',
        qualifier1_hid: 'used',
        qualifier2_hid: 'noob',
        quality: definitions_1.ItemQuality.common,
        base_strength: 1,
    });
    state = play_1.receive_item(state, starting_weapon);
    state = equip_item(state, starting_weapon.uuid);
    const starting_armor = logic_armors_1.create(rng, {
        base_hid: 'socks',
        qualifier1_hid: 'used',
        qualifier2_hid: 'noob',
        quality: 'common',
        base_strength: 1,
    });
    state = play_1.receive_item(state, starting_armor);
    state = equip_item(state, starting_armor.uuid);
    //state.prng = PRNGState.update_use_count(state.prng, rng)
    state.meaningful_interaction_count = 0; // to compensate sub-functions use
    state.revision = 0; // could have been inc by internally calling actions
    return state;
}
exports.create = create;
function reseed(state, seed) {
    seed = seed || state_prng_1.generate_random_seed();
    state.prng = PRNGState.set_seed(state.prng, seed);
    return state;
}
exports.reseed = reseed;
// note: allows passing an explicit adventure archetype for testing
function play(state, explicit_adventure_archetype_hid) {
    state.click_count++;
    // TODO good / bad
    state = play_1.play_good(state, explicit_adventure_archetype_hid);
    state.revision++;
    return state;
}
exports.play = play;
function equip_item(state, uuid) {
    state.inventory = InventoryState.equip_item(state.inventory, uuid);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.equip_item = equip_item;
function sell_item(state, uuid) {
    const price = appraise_item(state, uuid);
    state.inventory = InventoryState.remove_item_from_unslotted(state.inventory, uuid);
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, price);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.sell_item = sell_item;
function rename_avatar(state, new_name) {
    state.avatar = state_character_1.rename(sec_1.get_SEC(), state.avatar, new_name);
    // TODO count it as a meaningful interaction once
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.rename_avatar = rename_avatar;
function change_avatar_class(state, klass) {
    // TODO make this have an effect (in v2 ?)
    state.avatar = state_character_1.switch_class(sec_1.get_SEC(), state.avatar, klass);
    // TODO count it as a meaningful interaction only if positive (or with a limit)
    state.meaningful_interaction_count++;
    state.revision++;
    return state;
}
exports.change_avatar_class = change_avatar_class;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// with dev gain
const DEMO_ADVENTURE_01 = deepFreeze({
    hid: 'fight_lost_any',
    uuid: 'uu1de1~EVAdXlW5_p23Ro4OH',
    good: true,
    encounter: logic_monsters_1.DEMO_MONSTER_01,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 1,
        coin: 0,
        token: 0,
        armor: null,
        weapon: null,
        armor_improvement: false,
        weapon_improvement: false,
    },
});
exports.DEMO_ADVENTURE_01 = DEMO_ADVENTURE_01;
// with coin gain
const DEMO_ADVENTURE_02 = deepFreeze({
    hid: 'dying_man',
    uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
    good: true,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 0,
        coin: 1234,
        token: 0,
        weapon: null,
        armor: null,
        weapon_improvement: false,
        armor_improvement: false,
    }
});
exports.DEMO_ADVENTURE_02 = DEMO_ADVENTURE_02;
// with loot gain
const DEMO_ADVENTURE_03 = deepFreeze({
    hid: 'rare_goods_seller',
    uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
    good: true,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 0,
        coin: 0,
        token: 0,
        weapon: logic_weapons_1.DEMO_WEAPON_1,
        armor: null,
        weapon_improvement: false,
        armor_improvement: false,
    }
});
exports.DEMO_ADVENTURE_03 = DEMO_ADVENTURE_03;
// with weapon enhancement gain
const DEMO_ADVENTURE_04 = deepFreeze({
    hid: 'princess',
    uuid: 'uu1de2~p23Ro4OH_EVAdXlW5',
    good: true,
    gains: {
        level: 0,
        health: 0,
        mana: 0,
        strength: 0,
        agility: 0,
        charisma: 0,
        wisdom: 0,
        luck: 0,
        coin: 123,
        token: 0,
        weapon: null,
        armor: null,
        weapon_improvement: false,
        armor_improvement: true,
    }
});
exports.DEMO_ADVENTURE_04 = DEMO_ADVENTURE_04;
const DEMO_STATE = deepFreeze({
    schema_version: 4,
    revision: 203,
    meta: MetaState.DEMO_STATE,
    avatar: CharacterState.DEMO_STATE,
    inventory: InventoryState.DEMO_STATE,
    wallet: WalletState.DEMO_STATE,
    prng: PRNGState.DEMO_STATE,
    last_adventure: DEMO_ADVENTURE_01,
    click_count: 86,
    good_click_count: 86,
    meaningful_interaction_count: 86,
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    "schema_version": 4,
    "revision": 203,
    "meta": {
        "schema_version": 1,
        "revision": 5,
        "uuid": "uu1dgqu3h0FydqWyQ~6cYv3g",
        "name": "Offirmo",
        "email": "offirmo.net@gmail.com",
        "allow_telemetry": false
    },
    "avatar": {
        "schema_version": 2,
        "revision": 42,
        "name": "Perte",
        "klass": "paladin",
        "attributes": {
            "level": 13,
            "health": 12,
            "mana": 23,
            "strength": 4,
            "agility": 5,
            "charisma": 6,
            "wisdom": 7,
            "luck": 8
        }
    },
    "inventory": {
        "schema_version": 1,
        "revision": 42,
        "unslotted_capacity": 20,
        "slotted": {
            "armor": {
                "uuid": "uu1~test~demo~armor~0002",
                "element_type": "item",
                "slot": "armor",
                "base_hid": "belt",
                "qualifier1_hid": "brass",
                "qualifier2_hid": "apprentice",
                "quality": "legendary",
                "base_strength": 19,
                "enhancement_level": 8
            },
            "weapon": {
                "uuid": "uu1~test~demo~weapon~001",
                "element_type": "item",
                "slot": "weapon",
                "base_hid": "axe",
                "qualifier1_hid": "admirable",
                "qualifier2_hid": "adjudicator",
                "quality": "uncommon",
                "base_strength": 2,
                "enhancement_level": 0
            }
        },
        "unslotted": [
            {
                "uuid": "uu1~test~demo~weapon~002",
                "element_type": "item",
                "slot": "weapon",
                "base_hid": "bow",
                "qualifier1_hid": "arcanic",
                "qualifier2_hid": "ambassador",
                "quality": "legendary",
                "base_strength": 19,
                "enhancement_level": 8
            },
            {
                "uuid": "uu1~test~demo~armor~0001",
                "element_type": "item",
                "slot": "armor",
                "base_hid": "armguards",
                "qualifier1_hid": "bone",
                "qualifier2_hid": "ancients",
                "quality": "uncommon",
                "base_strength": 2,
                "enhancement_level": 0
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ]
    },
    "wallet": {
        "schema_version": 1,
        "revision": 42,
        "coin_count": 23456,
        "token_count": 89
    },
    "prng": {
        "schema_version": 1,
        "revision": 108,
        "seed": 1234,
        "use_count": 107
    },
    "last_adventure": {
        "hid": "fight_lost_any",
        "uuid": "uu1de1~EVAdXlW5_p23Ro4OH",
        "good": true,
        "encounter": {
            "name": "chicken",
            "level": 7,
            "rank": "elite",
            "possible_emoji": "🐓"
        },
        "gains": {
            "level": 0,
            "health": 0,
            "mana": 0,
            "strength": 0,
            "agility": 0,
            "charisma": 0,
            "wisdom": 0,
            "luck": 1,
            "coin": 0,
            "token": 0,
            "armor": null,
            "weapon": null,
            "armor_improvement": false,
            "weapon_improvement": false
        }
    },
    "click_count": 86,
    "good_click_count": 86,
    "meaningful_interaction_count": 86
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v5: {},
    meta: MetaState.MIGRATION_HINTS_FOR_TESTS,
    avatar: CharacterState.MIGRATION_HINTS_FOR_TESTS,
    inventory: InventoryState.MIGRATION_HINTS_FOR_TESTS,
    wallet: WalletState.MIGRATION_HINTS_FOR_TESTS,
    prng: PRNGState.MIGRATION_HINTS_FOR_TESTS,
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const ElementType = typescript_string_enums_1.Enum('item', 
// TODO expand
'location', 'lore');
exports.ElementType = ElementType;
/////////////////////
const ItemQuality = typescript_string_enums_1.Enum('common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact');
exports.ItemQuality = ItemQuality;
const InventorySlot = typescript_string_enums_1.Enum('weapon', 'armor');
exports.InventorySlot = InventorySlot;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function create() {
    return new Set([
        // standard fields
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
        'name',
        'message',
        // quasi-standard
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
        'stack',
        // non standard but widely used
        // ?
        // Offirmo extensions
        'logicalStack',
    ]);
}
exports.create = create;
const default_instance = create();
const COMMON_ERROR_FIELDS = default_instance;
exports.COMMON_ERROR_FIELDS = COMMON_ERROR_FIELDS;
//# sourceMappingURL=index.js.map

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@oh-my-rpg/state-character';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 2;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@oh-my-rpg/state-inventory';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@oh-my-rpg/state-the-boring-rpg';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 4;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const consts_1 = __webpack_require__(29);
function get_SEC(SEC) {
    return definitions_1.oh_my_rpg_get_SEC({
        module: consts_1.LIB_ID,
        parent_SEC: SEC,
    });
    // TODO add details: schema version
}
exports.get_SEC = get_SEC;
//# sourceMappingURL=sec.js.map

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@offirmo/rich-text-format';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
///////
const LogLevel = typescript_string_enums_1.Enum('fatal', 'emerg', 'alert', 'crit', 'error', 'warning', 'warn', 'notice', 'info', 'verbose', 'log', 'debug', 'trace', 'silly');
exports.LogLevel = LogLevel;
//# sourceMappingURL=types.js.map

/***/ }),
/* 33 */
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
/* 34 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const stripAnsi = __webpack_require__(77);
const isFullwidthCodePoint = __webpack_require__(181);

module.exports = str => {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	str = stripAnsi(str);

	let width = 0;

	for (let i = 0; i < str.length; i++) {
		const code = str.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(45)
var signals = __webpack_require__(209)

var EE = __webpack_require__(210)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (str, count, opts) => {
	// Support older versions: use the third parameter as options.indent
	// TODO: Remove the workaround in the next major version
	const options = typeof opts === 'object' ? Object.assign({indent: ' '}, opts) : {indent: opts || ' '};
	count = count === undefined ? 1 : count;

	if (typeof str !== 'string') {
		throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof str}\``);
	}

	if (typeof count !== 'number') {
		throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof count}\``);
	}

	if (typeof options.indent !== 'string') {
		throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``);
	}

	if (count === 0) {
		return str;
	}

	const regex = options.includeEmptyLines ? /^/mg : /^(?!\s*$)/mg;
	return str.replace(regex, options.indent.repeat(count));
}
;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function isArguments (thingy) {
  return thingy != null && typeof thingy === 'object' && thingy.hasOwnProperty('callee')
}

var types = {
  '*': {label: 'any', check: function () { return true }},
  A: {label: 'array', check: function (thingy) { return Array.isArray(thingy) || isArguments(thingy) }},
  S: {label: 'string', check: function (thingy) { return typeof thingy === 'string' }},
  N: {label: 'number', check: function (thingy) { return typeof thingy === 'number' }},
  F: {label: 'function', check: function (thingy) { return typeof thingy === 'function' }},
  O: {label: 'object', check: function (thingy) { return typeof thingy === 'object' && thingy != null && !types.A.check(thingy) && !types.E.check(thingy) }},
  B: {label: 'boolean', check: function (thingy) { return typeof thingy === 'boolean' }},
  E: {label: 'error', check: function (thingy) { return thingy instanceof Error }},
  Z: {label: 'null', check: function (thingy) { return thingy == null }}
}

function addSchema (schema, arity) {
  var group = arity[schema.length] = arity[schema.length] || []
  if (group.indexOf(schema) === -1) group.push(schema)
}

var validate = module.exports = function (rawSchemas, args) {
  if (arguments.length !== 2) throw wrongNumberOfArgs(['SA'], arguments.length)
  if (!rawSchemas) throw missingRequiredArg(0, 'rawSchemas')
  if (!args) throw missingRequiredArg(1, 'args')
  if (!types.S.check(rawSchemas)) throw invalidType(0, ['string'], rawSchemas)
  if (!types.A.check(args)) throw invalidType(1, ['array'], args)
  var schemas = rawSchemas.split('|')
  var arity = {}

  schemas.forEach(function (schema) {
    for (var ii = 0; ii < schema.length; ++ii) {
      var type = schema[ii]
      if (!types[type]) throw unknownType(ii, type)
    }
    if (/E.*E/.test(schema)) throw moreThanOneError(schema)
    addSchema(schema, arity)
    if (/E/.test(schema)) {
      addSchema(schema.replace(/E.*$/, 'E'), arity)
      addSchema(schema.replace(/E/, 'Z'), arity)
      if (schema.length === 1) addSchema('', arity)
    }
  })
  var matching = arity[args.length]
  if (!matching) {
    throw wrongNumberOfArgs(Object.keys(arity), args.length)
  }
  for (var ii = 0; ii < args.length; ++ii) {
    var newMatching = matching.filter(function (schema) {
      var type = schema[ii]
      var typeCheck = types[type].check
      return typeCheck(args[ii])
    })
    if (!newMatching.length) {
      var labels = matching.map(function (schema) {
        return types[schema[ii]].label
      }).filter(function (schema) { return schema != null })
      throw invalidType(ii, labels, args[ii])
    }
    matching = newMatching
  }
}

function missingRequiredArg (num) {
  return newException('EMISSINGARG', 'Missing required argument #' + (num + 1))
}

function unknownType (num, type) {
  return newException('EUNKNOWNTYPE', 'Unknown type ' + type + ' in argument #' + (num + 1))
}

function invalidType (num, expectedTypes, value) {
  var valueType
  Object.keys(types).forEach(function (typeCode) {
    if (types[typeCode].check(value)) valueType = types[typeCode].label
  })
  return newException('EINVALIDTYPE', 'Argument #' + (num + 1) + ': Expected ' +
    englishList(expectedTypes) + ' but got ' + valueType)
}

function englishList (list) {
  return list.join(', ').replace(/, ([^,]+)$/, ' or $1')
}

function wrongNumberOfArgs (expected, got) {
  var english = englishList(expected)
  var args = expected.every(function (ex) { return ex.length === 1 })
    ? 'argument'
    : 'arguments'
  return newException('EWRONGARGCOUNT', 'Expected ' + english + ' ' + args + ' but got ' + got)
}

function moreThanOneError (schema) {
  return newException('ETOOMANYERRORTYPES',
    'Only one error type per argument signature is allowed, more than one found in "' + schema + '"')
}

function newException (code, msg) {
  var e = new Error(msg)
  e.code = code
  if (Error.captureStackTrace) Error.captureStackTrace(e, validate)
  return e
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stripAnsi = __webpack_require__(91);
var codePointAt = __webpack_require__(87);
var isFullwidthCodePoint = __webpack_require__(88);

// https://github.com/nodejs/io.js/blob/cff7300a578be1b10001f2d967aaedc88aee6402/lib/readline.js#L1345
module.exports = function (str) {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	var width = 0;

	str = stripAnsi(str);

	for (var i = 0; i < str.length; i++) {
		var code = codePointAt(str, i);

		// ignore control characters
		if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
			continue;
		}

		// surrogates
		if (code >= 0x10000) {
			i++;
		}

		if (isFullwidthCodePoint(code)) {
			width += 2;
		} else {
			width++;
		}
	}

	return width;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const logic_armors_1 = __webpack_require__(9);
const logic_weapons_1 = __webpack_require__(10);
const RichText = __webpack_require__(3);
const logic_armors_2 = __webpack_require__(9);
const logic_weapons_2 = __webpack_require__(10);
function render_armor_name(i) {
    if (i.slot !== definitions_1.InventorySlot.armor)
        throw new Error(`render_armor(): can't render a ${i.slot}!`);
    const _ = logic_armors_2.i18n_messages.en;
    const b = _.armor.base[i.base_hid];
    const q1 = _.armor.qualifier1[i.qualifier1_hid];
    const q2 = _.armor.qualifier2[i.qualifier2_hid];
    const builder = RichText.span()
        .addClass('item__name')
        .pushText(q2.startsWith('of')
        ? '{{q1|Capitalize}} {{base|Capitalize}} {{q2|Capitalize}}'
        : '{{q2|Capitalize}} {{q1|Capitalize}} {{base|Capitalize}}');
    if (i.enhancement_level) {
        const $node_enhancement = RichText.span()
            .addClass('item--enhancement')
            .pushText(`+${i.enhancement_level}`)
            .done();
        builder.pushText(' ').pushNode($node_enhancement, 'enhancement');
    }
    const $doc = builder.done();
    $doc.$sub.base = RichText.span().pushText(b).done();
    $doc.$sub.q1 = RichText.span().pushText(q1).done();
    $doc.$sub.q2 = RichText.span().pushText(q2).done();
    return $doc;
}
exports.render_armor_name = render_armor_name;
function render_weapon_name(i) {
    if (i.slot !== definitions_1.InventorySlot.weapon)
        throw new Error(`render_weapon(): can't render a ${i.slot}!`);
    const _ = logic_weapons_2.i18n_messages.en;
    const b = _.weapon.base[i.base_hid];
    const q1 = _.weapon.qualifier1[i.qualifier1_hid];
    const q2 = _.weapon.qualifier2[i.qualifier2_hid];
    const builder = RichText.span()
        .addClass('item__name')
        .pushText(q2.startsWith('of')
        ? '{{q1|Capitalize}} {{base|Capitalize}} {{q2|Capitalize}}'
        : '{{q2|Capitalize}} {{q1|Capitalize}} {{base|Capitalize}}');
    if (i.enhancement_level) {
        const $node_enhancement = RichText.span()
            .addClass('item--enhancement')
            .pushText(`+${i.enhancement_level}`)
            .done();
        builder.pushText(' ').pushNode($node_enhancement, 'enhancement');
    }
    const $doc = builder.done();
    $doc.$sub.base = RichText.span().pushText(b).done();
    $doc.$sub.q1 = RichText.span().pushText(q1).done();
    $doc.$sub.q2 = RichText.span().pushText(q2).done();
    return $doc;
}
exports.render_weapon_name = render_weapon_name;
const DEFAULT_RENDER_ITEM_OPTIONS = {
    display_quality: true,
    display_values: true,
};
function render_armor(i, options = DEFAULT_RENDER_ITEM_OPTIONS) {
    if (i.slot !== definitions_1.InventorySlot.armor)
        throw new Error(`render_armor(): can't render a ${i.slot}!`);
    const $node_quality = RichText.span().pushText(i.quality).done();
    const [min, max] = logic_armors_1.get_damage_reduction_interval(i);
    const $node_values = RichText.span()
        .addClass('armor--values')
        .pushText(`[${min} ↔ ${max}]`)
        .done();
    const builder = RichText.span()
        .addClass('item', 'item--armor', 'item--quality--' + i.quality)
        .pushRawNode($node_quality, 'quality')
        .pushRawNode(render_armor_name(i), 'name')
        .pushRawNode($node_values, 'values');
    if (options.display_quality)
        builder.pushText('{{quality}} ');
    builder.pushText('{{name}}');
    if (options.display_values)
        builder.pushText(' {{values}}');
    return builder.done();
}
exports.render_armor = render_armor;
function render_weapon(i, options = DEFAULT_RENDER_ITEM_OPTIONS) {
    if (i.slot !== definitions_1.InventorySlot.weapon)
        throw new Error(`render_weapon(): can't render a ${i.slot}!`);
    const $node_quality = RichText.span().pushText(i.quality).done();
    const [min, max] = logic_weapons_1.get_damage_interval(i);
    const $node_values = RichText.span()
        .addClass('weapon--values')
        .pushText(`[${min} ↔ ${max}]`)
        .done();
    const builder = RichText.span()
        .addClass('item', 'item--weapon', 'item--quality--' + i.quality)
        .pushRawNode($node_quality, 'quality')
        .pushRawNode(render_weapon_name(i), 'name')
        .pushRawNode($node_values, 'values');
    if (options.display_quality)
        builder.pushText('{{quality}} ');
    builder.pushText('{{name}}');
    if (options.display_values)
        builder.pushText(' {{values}}');
    return builder.done();
}
exports.render_weapon = render_weapon;
function render_item(i, options = DEFAULT_RENDER_ITEM_OPTIONS) {
    if (!i)
        return RichText.span().pushText('').done();
    switch (i.slot) {
        case definitions_1.InventorySlot.armor:
            return render_armor(i, options);
        case definitions_1.InventorySlot.weapon:
            return render_weapon(i, options);
        default:
            throw new Error(`render_item(): don't know how to render a "${i.slot}" !`);
    }
}
exports.render_item = render_item;
//# sourceMappingURL=items.js.map

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_wallet_1 = __webpack_require__(8);
const RichText = __webpack_require__(3);
function render_currency_amount(currency, amount) {
    return RichText.span()
        .addClass('currency--' + currency)
        .pushNode(RichText.span().pushText('' + amount).done(), // TODO format according to locale?
    'amount')
        .pushText(' ' + currency + (amount === 1 ? '' : 's')) // TODO localize properly ;)
        .done();
}
exports.render_currency_amount = render_currency_amount;
function render_wallet(wallet) {
    const $doc_list = RichText.unordered_list()
        .addClass('inventory--wallet')
        .done();
    state_wallet_1.ALL_CURRENCIES.forEach((currency) => {
        const amount = state_wallet_1.get_currency_amount(wallet, currency);
        $doc_list.$sub[currency] = render_currency_amount(currency, amount);
    });
    const $doc = RichText.section()
        .pushNode(RichText.heading().pushText('Wallet:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_wallet = render_wallet;
//# sourceMappingURL=wallet.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(6)

module.exports = clone(fs)

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: obj.__proto__ }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("conf");

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
const types_1 = __webpack_require__(24);
///////
const ITEM_QUALITIES = typescript_string_enums_1.Enum.keys(types_1.ItemQuality);
exports.ITEM_QUALITIES = ITEM_QUALITIES;
// useful for ex. for sorting
const ITEM_QUALITIES_TO_INT = {
    [types_1.ItemQuality.common]: 6,
    [types_1.ItemQuality.uncommon]: 5,
    [types_1.ItemQuality.rare]: 4,
    [types_1.ItemQuality.epic]: 3,
    [types_1.ItemQuality.legendary]: 2,
    [types_1.ItemQuality.artifact]: 1,
};
exports.ITEM_QUALITIES_TO_INT = ITEM_QUALITIES_TO_INT;
///////
const ITEM_SLOTS = typescript_string_enums_1.Enum.keys(types_1.InventorySlot);
exports.ITEM_SLOTS = ITEM_SLOTS;
// useful for ex. for sorting
const ITEM_SLOTS_TO_INT = {
    [types_1.InventorySlot.armor]: 2,
    [types_1.InventorySlot.weapon]: 1,
};
exports.ITEM_SLOTS_TO_INT = ITEM_SLOTS_TO_INT;
///////
const MIN_LEVEL = 1;
exports.MIN_LEVEL = MIN_LEVEL;
const MAX_LEVEL = 9999;
exports.MAX_LEVEL = MAX_LEVEL;
/////////////////////
//# sourceMappingURL=consts.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid = __webpack_require__(110);
const format = __webpack_require__(112);
const url = __webpack_require__(113);
const random_1 = __webpack_require__(4);
///////
const UUID_RADIX = 'uu1';
const NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES = 21; // according to the doc
const UUID_LENGTH = UUID_RADIX.length + NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES;
exports.UUID_LENGTH = UUID_LENGTH;
// TODO externalize!
function generate_uuid({ length = NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES, rng } = {}) {
    return UUID_RADIX + (rng
        ? format((size) => {
            let result = [];
            const gen = random_1.Random.integer(0, 255);
            for (let i = 0; i < size; i++)
                result.push(gen(rng));
            return result;
        }, url, length)
        : nanoid(length));
}
exports.generate_uuid = generate_uuid;
/////////////////////
//# sourceMappingURL=generate_uuid.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const generate_uuid_1 = __webpack_require__(48);
function create_element_base(element_type, hints = {}) {
    const uuid = hints.uuid || generate_uuid_1.generate_uuid();
    return {
        element_type,
        uuid,
    };
}
exports.create_element_base = create_element_base;
function xxx_test_unrandomize_element(e, hint) {
    return Object.assign({}, e, { uuid: hint || 'uu1~test~test~test~test~' });
}
exports.xxx_test_unrandomize_element = xxx_test_unrandomize_element;
//# sourceMappingURL=element.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(18);
exports.LIB = constants_1.LIB;
exports.INTERNAL_PROP = constants_1.INTERNAL_PROP;
const catch_factory_1 = __webpack_require__(51);
exports.createCatcher = catch_factory_1.createCatcher;
const core_1 = __webpack_require__(116);
exports.isSEC = core_1.isSEC;
exports.setRoot = core_1.setRoot;
exports.getContext = core_1.getContext;
function create(...args) {
    const SEC = core_1.create(...args);
    // TODO offer to hook setTimeout etc.
    //core.
    return SEC;
}
const isomorphic = {
    create,
};
exports.isomorphic = isomorphic;
//# sourceMappingURL=index.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function createCatcher({ decorators = [], onError, debugId = '?' } = {}) {
    return (err) => {
        //console.info(`[catchFactory from ${debugId}]`)
        err = decorators.reduce((err, decorator) => {
            try {
                err = decorator(err);
                if (!err.message)
                    throw new Error();
            }
            catch (e) {
                console.error(`catchFactory exec from ${debugId}: bad decorator!`, err, e);
            }
            return err;
        }, err);
        if (onError)
            return onError(err);
        throw err; // or rethrow since still unhandled
    };
}
exports.createCatcher = createCatcher;
//# sourceMappingURL=catch-factory.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(122), exports);
tslib_1.__exportStar(__webpack_require__(123), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(54), exports);
tslib_1.__exportStar(__webpack_require__(124), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const deepFreeze = __webpack_require__(11);
const consts_1 = __webpack_require__(55);
/////////////////////
const DEFAULT_NAME = 'anonymous';
exports.DEFAULT_NAME = DEFAULT_NAME;
///////
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        uuid: definitions_1.generate_uuid(),
        name: DEFAULT_NAME,
        email: null,
        allow_telemetry: true,
    };
}
exports.create = create;
/////////////////////
function rename(state, new_name) {
    if (!new_name)
        throw new Error(`Error while renaming to "${new_name}: invalid value!`);
    state.name = new_name;
    return state;
}
exports.rename = rename;
function set_email(state, email) {
    if (!email)
        throw new Error(`Error while setting mail to "${email}: invalid value!`);
    state.email = email;
    return state;
}
exports.set_email = set_email;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 5,
    uuid: 'uu1dgqu3h0FydqWyQ~6cYv3g',
    name: 'Offirmo',
    email: 'offirmo.net@gmail.com',
    allow_telemetry: false,
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    uuid: 'uu1dgqu3h0FydqWyQ~6cYv3g',
    name: 'Offirmo',
    email: 'offirmo.net@gmail.com',
    allow_telemetry: false,
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v1: {
        revision: 5,
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@oh-my-rpg/state-meta';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
const deepFreeze = __webpack_require__(11);
const consts_1 = __webpack_require__(27);
const types_1 = __webpack_require__(125);
exports.CharacterAttribute = types_1.CharacterAttribute;
exports.CharacterClass = types_1.CharacterClass;
const sec_1 = __webpack_require__(57);
/////////////////////
const CHARACTER_ATTRIBUTES = typescript_string_enums_1.Enum.keys(types_1.CharacterAttribute);
exports.CHARACTER_ATTRIBUTES = CHARACTER_ATTRIBUTES;
const CHARACTER_ATTRIBUTES_SORTED = [
    'level',
    'health',
    'mana',
    'strength',
    'agility',
    'charisma',
    'wisdom',
    'luck',
];
exports.CHARACTER_ATTRIBUTES_SORTED = CHARACTER_ATTRIBUTES_SORTED;
sec_1.get_SEC().xTry('boot checks', () => {
    if (CHARACTER_ATTRIBUTES.length !== CHARACTER_ATTRIBUTES_SORTED.length)
        throw new Error(`CHARACTER_ATTRIBUTES to update!`);
});
const CHARACTER_CLASSES = typescript_string_enums_1.Enum.keys(types_1.CharacterClass);
exports.CHARACTER_CLASSES = CHARACTER_CLASSES;
///////
function create(SEC) {
    return sec_1.get_SEC(SEC).xTry('create', ({ enforce_immutability }) => {
        return enforce_immutability({
            schema_version: consts_1.SCHEMA_VERSION,
            revision: 0,
            name: '[anonymous]',
            klass: types_1.CharacterClass.novice,
            attributes: {
                level: 1,
                // TODO improve this
                health: 1,
                mana: 0,
                strength: 1,
                agility: 1,
                charisma: 1,
                wisdom: 1,
                luck: 1
            },
        });
    });
}
exports.create = create;
/////////////////////
function rename(SEC, state, new_name) {
    return sec_1.get_SEC(SEC).xTry('rename', ({ enforce_immutability }) => {
        if (!new_name)
            throw new Error(`Error while renaming to "${new_name}: invalid target value!`); // TODO details
        if (new_name === state.name)
            return state;
        return enforce_immutability(Object.assign({}, state, { name: new_name, revision: state.revision + 1 }));
    });
}
exports.rename = rename;
function switch_class(SEC, state, klass) {
    return sec_1.get_SEC(SEC).xTry('switch_class', ({ enforce_immutability }) => {
        if (klass === state.klass)
            return state;
        return enforce_immutability(Object.assign({}, state, { klass, revision: state.revision + 1 }));
    });
}
exports.switch_class = switch_class;
function increase_stat(SEC, state, stat, amount = 1) {
    return sec_1.get_SEC(SEC).xTry('increase_stat', ({ enforce_immutability }) => {
        if (amount <= 0)
            throw new Error(`Error while increasing stat "${stat}": invalid amount!`); // TODO details
        // TODO stats caps
        return enforce_immutability(Object.assign({}, state, { attributes: Object.assign({}, state.attributes, { [stat]: state.attributes[stat] + amount }), revision: state.revision + 1 }));
    });
}
exports.increase_stat = increase_stat;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 2,
    revision: 42,
    name: 'Perte',
    klass: types_1.CharacterClass.paladin,
    attributes: {
        level: 13,
        health: 12,
        mana: 23,
        strength: 4,
        agility: 5,
        charisma: 6,
        wisdom: 7,
        luck: 8,
    },
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    name: 'Perte',
    klass: 'paladin',
    characteristics: {
        level: 13,
        health: 12,
        mana: 23,
        strength: 4,
        agility: 5,
        charisma: 6,
        wisdom: 7,
        luck: 8,
    },
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v2: {
        revision: 42
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const consts_1 = __webpack_require__(27);
function get_SEC(SEC) {
    return definitions_1.oh_my_rpg_get_SEC({
        module: consts_1.LIB_ID,
        parent_SEC: SEC,
    });
    // TODO add details: schema version
}
exports.get_SEC = get_SEC;
//# sourceMappingURL=sec.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = __webpack_require__(11);
const consts_1 = __webpack_require__(59);
const types_1 = __webpack_require__(127);
exports.Currency = types_1.Currency;
/////////////////////
const ALL_CURRENCIES = [
    types_1.Currency.coin,
    types_1.Currency.token,
];
exports.ALL_CURRENCIES = ALL_CURRENCIES;
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        coin_count: 0,
        token_count: 0,
    };
}
exports.create = create;
/////////////////////
function currency_to_state_entry(currency) {
    return `${currency}_count`;
}
function change_amount_by(state, currency, amount) {
    switch (currency) {
        case types_1.Currency.coin:
            state.coin_count += amount;
            break;
        case types_1.Currency.token:
            state.token_count += amount;
            break;
        default:
            throw new Error(`state-wallet: unrecognized currency: "${currency}`);
    }
    return state;
}
/////////////////////
function add_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error(`state-wallet: can't add a <= 0 amount`);
    return change_amount_by(state, currency, amount);
}
exports.add_amount = add_amount;
function remove_amount(state, currency, amount) {
    if (amount <= 0)
        throw new Error(`state-wallet: can't remove a <= 0 amount`);
    if (amount > get_currency_amount(state, currency))
        throw new Error(`state-wallet: can't remove more than available, no credit !`);
    return change_amount_by(state, currency, -amount);
}
exports.remove_amount = remove_amount;
/////////////////////
function get_currency_amount(state, currency) {
    return state[currency_to_state_entry(currency)];
}
exports.get_currency_amount = get_currency_amount;
function* iterables_currency(state) {
    yield* ALL_CURRENCIES;
}
exports.iterables_currency = iterables_currency;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    coin_count: 23456,
    token_count: 89,
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    coin_count: 23456,
    token_count: 89,
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v1: {
        revision: 42
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@oh-my-rpg/state-wallet';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const logic_armors_1 = __webpack_require__(9);
const logic_weapons_1 = __webpack_require__(10);
const consts_1 = __webpack_require__(28);
/////////////////////
function compare_items(a, b) {
    if (a.slot !== b.slot)
        return definitions_1.compare_items_by_slot(a, b);
    switch (a.slot) {
        case definitions_1.InventorySlot.armor:
            return logic_armors_1.compare_armors_by_strength(a, b);
        case definitions_1.InventorySlot.weapon:
            return logic_weapons_1.compare_weapons_by_strength(a, b);
        default:
            throw new Error(`${consts_1.LIB_ID}: compare(): unhandled item slot "${a.slot}"!`);
    }
}
exports.compare_items = compare_items;
/////////////////////
//# sourceMappingURL=compare.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const deepFreeze = __webpack_require__(11);
const definitions_1 = __webpack_require__(1);
exports.InventorySlot = definitions_1.InventorySlot;
const logic_weapons_1 = __webpack_require__(10);
const logic_armors_1 = __webpack_require__(9);
const consts_1 = __webpack_require__(28);
const compare_1 = __webpack_require__(60);
/////////////////////
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        // todo rename equipped / backpack
        unslotted_capacity: 20,
        slotted: {},
        unslotted: [],
    };
}
exports.create = create;
/////////////////////
function auto_sort(state) {
    state.unslotted.sort(compare_1.compare_items);
    return state;
}
/////////////////////
function add_item(state, item) {
    if (state.unslotted.length >= state.unslotted_capacity)
        throw new Error(`state-inventory: can't add item, inventory is full!`);
    state.unslotted.push(item);
    return auto_sort(state);
}
exports.add_item = add_item;
function remove_item_from_unslotted(state, uuid) {
    const new_unslotted = state.unslotted.filter(i => i.uuid !== uuid);
    if (new_unslotted.length === state.unslotted.length)
        throw new Error(`state-inventory: can't remove item #${uuid}, not found!`);
    state.unslotted = new_unslotted;
    return state;
}
exports.remove_item_from_unslotted = remove_item_from_unslotted;
function equip_item(state, uuid) {
    const item_to_equip = state.unslotted.find(i => i.uuid === uuid);
    if (!item_to_equip)
        throw new Error(`state-inventory: can't equip item #${uuid}, not found!`);
    const target_slot = item_to_equip.slot;
    const item_previously_in_slot = get_item_in_slot(state, target_slot); // may be null
    // swap them
    state.slotted[target_slot] = item_to_equip;
    state = remove_item_from_unslotted(state, item_to_equip.uuid);
    if (item_previously_in_slot)
        state.unslotted.push(item_previously_in_slot);
    return auto_sort(state);
}
exports.equip_item = equip_item;
/////////////////////
function get_equiped_item_count(state) {
    return Object.keys(state.slotted).length;
}
exports.get_equiped_item_count = get_equiped_item_count;
function get_unequiped_item_count(state) {
    return state.unslotted.filter(i => !!i).length;
}
exports.get_unequiped_item_count = get_unequiped_item_count;
function get_item_count(state) {
    return get_equiped_item_count(state) + get_unequiped_item_count(state);
}
exports.get_item_count = get_item_count;
function get_item(state, uuid) {
    let item = state.unslotted.find(i => i.uuid === uuid);
    return item ? item : null;
}
exports.get_item = get_item;
function get_item_in_slot(state, slot) {
    return state.slotted[slot] || null;
}
exports.get_item_in_slot = get_item_in_slot;
function* iterables_unslotted(state) {
    yield* state.unslotted;
}
exports.iterables_unslotted = iterables_unslotted;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    unslotted_capacity: 20,
    slotted: {
        armor: logic_armors_1.DEMO_ARMOR_2,
        weapon: logic_weapons_1.DEMO_WEAPON_1,
    },
    unslotted: [
        logic_weapons_1.DEMO_WEAPON_2,
        logic_armors_1.DEMO_ARMOR_1,
    ],
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    unslotted_capacity: 20,
    slotted: {
        armor: logic_armors_1.DEMO_ARMOR_2,
        weapon: logic_weapons_1.DEMO_WEAPON_1,
    },
    unslotted: [
        logic_weapons_1.DEMO_WEAPON_2,
        logic_armors_1.DEMO_ARMOR_1,
    ],
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v1: {
        revision: 42
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = __webpack_require__(4);
const deepFreeze = __webpack_require__(11);
const consts_1 = __webpack_require__(63);
/////////////////////
const DEFAULT_SEED = 987;
exports.DEFAULT_SEED = DEFAULT_SEED;
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        seed: DEFAULT_SEED,
        use_count: 0,
    };
}
exports.create = create;
/////////////////////
function set_seed(state, seed) {
    state.seed = seed;
    state.use_count = 0;
    return state;
}
exports.set_seed = set_seed;
function update_use_count(state, prng, options = {}) {
    const new_use_count = prng.getUseCount();
    if (new_use_count < state.use_count)
        throw new Error(`update PRNG state: count is lower than previous count, this is unexpected! Check your code!`);
    if (!options.I_swear_I_really_cant_know_whether_the_rng_was_used && new_use_count === state.use_count)
        console.warn(`update PRNG state: count hasn't changed = no random was generated! This is most likely a bug, check your code!`);
    if (prng !== cached_prng)
        throw new Error(`update PRNG state: passed prng is not the cached one, this is unexpected!`);
    state.use_count = new_use_count;
    return state;
}
exports.update_use_count = update_use_count;
// since
// - we MUST use only one, repeatable PRNG
// - we can't store the prng in the state
// - we must configure it once at start
// we use a global cache to not recreate the prng each time.
// Still, we control that the usage conforms to those expectations.
let cached_prng = 'foo';
let cached_prng_was_updated_once = false;
xxx_internal_reset_prng_cache();
// WARNING this method has expectations ! (see above)
function get_prng(state) {
    /*console.log('get PRNG', {
        expected_seed: state.seed,
        expected_use_count: state.use_count,
        seed: cached_prng._seed,
        use_count: cached_prng.getUseCount(),
    })*/
    let cached_prng_updated = false;
    if (cached_prng._seed !== state.seed) {
        cached_prng.seed(state.seed);
        cached_prng._seed = state.seed; // maintain this extra property TODO improve the lib instead
        cached_prng_updated = true;
    }
    if (cached_prng.getUseCount() !== state.use_count) {
        // should never happen
        if (cached_prng.getUseCount() !== 0)
            throw new Error(`state-prng get_prng() unexpected case: cached implementation need to be fast forwarded!`);
        cached_prng.discard(state.use_count);
        cached_prng_updated = true;
    }
    if (cached_prng_updated) {
        // should never happen if we correctly update the prng state after each use
        if (cached_prng_was_updated_once)
            throw new Error(`state-prng unexpected case: need to update again the prng!`);
        // we allow a unique update at start
        // TODO filter default case?
        /*console.log('updated PRNG from init situation', {
            seed: cached_prng._seed,
            use_count: cached_prng.getUseCount(),
        })*/
        cached_prng_was_updated_once = true;
    }
    return cached_prng;
}
exports.get_prng = get_prng;
// useful for re-seeding
function generate_random_seed() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return random_1.Random.integer(-2147483646, 2147483647)(rng); // doc is unclear about allowed bounds...
}
exports.generate_random_seed = generate_random_seed;
function xxx_internal_reset_prng_cache() {
    cached_prng = random_1.Random.engines.mt19937().seed(DEFAULT_SEED);
    cached_prng._seed = DEFAULT_SEED;
    cached_prng_was_updated_once = false;
}
exports.xxx_internal_reset_prng_cache = xxx_internal_reset_prng_cache;
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 108,
    seed: 1234,
    use_count: 107,
});
exports.DEMO_STATE = DEMO_STATE;
// the oldest format we can migrate from
// must correspond to state above
const OLDEST_LEGACY_STATE_FOR_TESTS = deepFreeze({
    // no schema_version = 0
    seed: 1234,
    use_count: 107,
});
exports.OLDEST_LEGACY_STATE_FOR_TESTS = OLDEST_LEGACY_STATE_FOR_TESTS;
// some hints may be needed to migrate to demo state
const MIGRATION_HINTS_FOR_TESTS = deepFreeze({
    to_v1: {
        revision: 108,
    },
});
exports.MIGRATION_HINTS_FOR_TESTS = MIGRATION_HINTS_FOR_TESTS;
/////////////////////
//# sourceMappingURL=state.js.map

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const LIB_ID = '@oh-my-rpg/state-prng';
exports.LIB_ID = LIB_ID;
const SCHEMA_VERSION = 1;
exports.SCHEMA_VERSION = SCHEMA_VERSION;
//# sourceMappingURL=consts.js.map

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(65), exports);
tslib_1.__exportStar(__webpack_require__(139), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
//import { Item, InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'
/////////////////////
const MonsterRank = typescript_string_enums_1.Enum('common', 'elite', 'boss');
exports.MonsterRank = MonsterRank;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = __webpack_require__(4);
const types_1 = __webpack_require__(67);
exports.CoinsGain = types_1.CoinsGain;
exports.AdventureType = types_1.AdventureType;
const data_1 = __webpack_require__(146);
exports.i18n_messages = data_1.i18n_messages;
/////////////////////
const ALL_ADVENTURE_ARCHETYPES = data_1.ENTRIES
    .filter(paa => (paa.isPublished !== false))
    .map(paa => {
    const raw_outcome = paa.outcome || {};
    const outcome = {
        level: !!raw_outcome.level,
        agility: !!raw_outcome.agility,
        health: !!raw_outcome.health,
        luck: !!raw_outcome.luck,
        mana: !!raw_outcome.mana,
        strength: !!raw_outcome.strength,
        charisma: !!raw_outcome.charisma,
        wisdom: !!raw_outcome.wisdom,
        random_charac: !!raw_outcome.random_charac,
        lowest_charac: !!raw_outcome.lowest_charac,
        class_main_charac: !!raw_outcome.class_main_charac,
        class_secondary_charac: !!raw_outcome.class_secondary_charac,
        coin: raw_outcome.coin || types_1.CoinsGain.none,
        token: raw_outcome.token || 0,
        armor: !!raw_outcome.armor,
        weapon: !!raw_outcome.weapon,
        armor_or_weapon: !!raw_outcome.armor_or_weapon,
        armor_improvement: !!raw_outcome.armor_improvement,
        weapon_improvement: !!raw_outcome.weapon_improvement,
        armor_or_weapon_improvement: !!raw_outcome.armor_or_weapon_improvement,
    };
    const aa = {
        hid: paa.hid,
        good: paa.good,
        type: paa.type,
        outcome,
    };
    return aa;
});
exports.ALL_ADVENTURE_ARCHETYPES = ALL_ADVENTURE_ARCHETYPES;
const ALL_BAD_ADVENTURE_ARCHETYPES = ALL_ADVENTURE_ARCHETYPES.filter(aa => !aa.good);
exports.ALL_BAD_ADVENTURE_ARCHETYPES = ALL_BAD_ADVENTURE_ARCHETYPES;
const ALL_GOOD_ADVENTURE_ARCHETYPES = ALL_ADVENTURE_ARCHETYPES.filter(aa => aa.good);
exports.ALL_GOOD_ADVENTURE_ARCHETYPES = ALL_GOOD_ADVENTURE_ARCHETYPES;
const GOOD_ADVENTURE_ARCHETYPES_BY_TYPE = {
    story: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === types_1.AdventureType.story),
    fight: ALL_GOOD_ADVENTURE_ARCHETYPES.filter(aa => aa.type === types_1.AdventureType.fight),
};
exports.GOOD_ADVENTURE_ARCHETYPES_BY_TYPE = GOOD_ADVENTURE_ARCHETYPES_BY_TYPE;
const COINS_GAIN_MULTIPLIER_PER_LEVEL = 1.1;
const COINS_GAIN_RANGES = {
    none: [0, 0],
    small: [1, 20],
    medium: [50, 100],
    big: [500, 700],
    huge: [900, 2000],
};
(function checkDataSanity() {
    if (ALL_ADVENTURE_ARCHETYPES.length < 20) {
        console.error(ALL_ADVENTURE_ARCHETYPES);
        throw new Error(`Data sanity failure: ALL_ADVENTURE_ARCHETYPES`);
    }
    if (ALL_BAD_ADVENTURE_ARCHETYPES.length !== 1)
        throw new Error(`Data sanity failure: ALL_BAD_ADVENTURE_ARCHETYPES`);
    if (ALL_GOOD_ADVENTURE_ARCHETYPES.length < 20)
        throw new Error(`Data sanity failure: ALL_GOOD_ADVENTURE_ARCHETYPES`);
    if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight.length !== 5) {
        console.error(GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight);
        throw new Error(`Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight`);
    }
    if (GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story.length < 20)
        throw new Error(`Data sanity failure: GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story`);
})();
/////////////////////
// useful for picking an exact archetype (ex. tests)
function get_archetype(hid) {
    const aa = ALL_ADVENTURE_ARCHETYPES.find(aa => aa.hid === hid);
    if (!aa)
        throw new Error(`logic-adventures, get_archetype(): couldn't find archetype "${hid}" !`);
    return aa;
}
exports.get_archetype = get_archetype;
const FIGHT_ENCOUNTER_RATIO = 0.33;
function pick_random_good_archetype(rng) {
    return random_1.Random.bool(FIGHT_ENCOUNTER_RATIO)(rng)
        ? random_1.Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.fight)
        : random_1.Random.pick(rng, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE.story);
}
exports.pick_random_good_archetype = pick_random_good_archetype;
function pick_random_bad_archetype(rng) {
    return random_1.Random.pick(rng, ALL_BAD_ADVENTURE_ARCHETYPES);
}
exports.pick_random_bad_archetype = pick_random_bad_archetype;
function generate_random_coin_gain(rng, range, player_level) {
    if (range === types_1.CoinsGain.none)
        return 0;
    const level_multiplier = player_level * COINS_GAIN_MULTIPLIER_PER_LEVEL;
    const interval = COINS_GAIN_RANGES[range];
    return random_1.Random.integer(interval[0] * level_multiplier, interval[1] * level_multiplier)(rng);
}
exports.generate_random_coin_gain = generate_random_coin_gain;
/////////////////////
//# sourceMappingURL=index.js.map

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const CoinsGain = typescript_string_enums_1.Enum('none', 'small', 'medium', 'big', 'huge');
exports.CoinsGain = CoinsGain;
const AdventureType = typescript_string_enums_1.Enum('story', 'fight');
exports.AdventureType = AdventureType;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const MetaState = __webpack_require__(53);
const CharacterState = __webpack_require__(7);
const WalletState = __webpack_require__(8);
const InventoryState = __webpack_require__(12);
const PRNGState = __webpack_require__(13);
const consts_1 = __webpack_require__(29);
const state_1 = __webpack_require__(23);
const sec_1 = __webpack_require__(30);
/////////////////////
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    return sec_1.get_SEC(SEC).xTry('migrate_to_latest', ({ SEC, logger }) => {
        const src_version = (legacy_state && legacy_state.schema_version) || 0;
        let state = state_1.create();
        if (!legacy_state || Object.keys(legacy_state).length === 0) {
            // = empty or empty object (happen, with some deserialization techniques)
            // It's a new state, keep the freshly created one.
        }
        else if (src_version === consts_1.SCHEMA_VERSION)
            state = legacy_state;
        else if (src_version > consts_1.SCHEMA_VERSION)
            throw new Error(`Your data is from a more recent version of this lib. Please update!`);
        else {
            try {
                // TODO logger
                console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
                state = migrate_to_4(SEC, legacy_state, hints);
                console.info(`${consts_1.LIB_ID}: schema migration successful.`);
            }
            catch (err) {
                // failed, reset all
                // TODO send event upwards
                console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`, err);
                state = state_1.create();
            }
        }
        if (state.prng.seed === PRNGState.DEFAULT_SEED) {
            state = state_1.reseed(state);
        }
        // migrate sub-reducers if any...
        state.meta = MetaState.migrate_to_latest(state.meta, hints.meta);
        state.avatar = CharacterState.migrate_to_latest(SEC, state.avatar, hints.avatar);
        state.inventory = InventoryState.migrate_to_latest(state.inventory, hints.inventory);
        state.wallet = WalletState.migrate_to_latest(state.wallet, hints.wallet);
        state.prng = PRNGState.migrate_to_latest(state.prng, hints.prng);
        return state;
    });
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_4(SEC, legacy_state, hints) {
    return SEC.xTry('migrate_to_4', ({ logger }) => {
        throw new Error(`Alpha release schema, won't migrate, would take too much time and schema is still unstable!`);
    });
}
//# sourceMappingURL=migrations.js.map

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(31);
const types_1 = __webpack_require__(19);
exports.NodeType = types_1.NodeType;
const utils_1 = __webpack_require__(149);
function get_default_callbacks() {
    function nothing() { }
    function identity({ state }) {
        return state;
    }
    return {
        on_root_enter: nothing,
        on_root_exit: identity,
        on_node_enter: identity,
        on_node_exit: identity,
        on_concatenate_str: identity,
        on_concatenate_sub_node: identity,
        on_sub_node_id: identity,
        on_filter: identity,
        on_filter_Capitalize: ({ state }) => {
            if (typeof state === 'string' && state) {
                //console.log(`${LIB} auto capitalizing...`, state)
                const str = '' + state;
                return str[0].toUpperCase() + str.slice(1);
            }
            return state;
        },
        on_class_before: identity,
        on_class_after: identity,
        on_type: identity,
    };
}
const SUB_NODE_BR = {
    $type: 'br',
};
const SUB_NODE_HR = {
    $type: 'hr',
};
function walk_content($node, callbacks, state, depth) {
    const { $content, $sub: $sub_nodes } = $node;
    const split1 = $content.split('{{');
    state = callbacks.on_concatenate_str({
        str: split1.shift(),
        state,
        $node,
        depth,
    });
    state = split1.reduce((state, paramAndText) => {
        const split2 = paramAndText.split('}}');
        if (split2.length !== 2)
            throw new Error(`${consts_1.LIB_ID}: syntax error in content "${$content}"!`);
        const [sub_node_id, ...$filters] = split2.shift().split('|');
        /*
        state = callbacks.on_sub_node_id({
            $id: sub_node_id,
            state,
            $node,
            depth,
        })
        */
        let $sub_node = $sub_nodes[sub_node_id];
        if (!$sub_node && sub_node_id === 'br')
            $sub_node = SUB_NODE_BR;
        if (!$sub_node && sub_node_id === 'hr')
            $sub_node = SUB_NODE_HR;
        if (!$sub_node)
            throw new Error(`${consts_1.LIB_ID}: syntax error in content "${$content}", it's referring to an unknown sub-node "${sub_node_id}"!`);
        let sub_state = walk($sub_node, callbacks, {
            $parent_node: $node,
            $id: sub_node_id,
            depth: depth + 1,
        });
        sub_state = $filters.reduce((state, $filter) => {
            const fine_filter_cb = `on_filter_${$filter}`;
            if (callbacks[fine_filter_cb])
                return callbacks[fine_filter_cb]({
                    $filter,
                    $filters,
                    state,
                    $node,
                    depth
                });
            return callbacks.on_filter({
                $filter,
                $filters,
                state,
                $node,
                depth,
            });
        }, sub_state);
        // TODO detect unused $subnodes?
        state = callbacks.on_concatenate_sub_node({
            sub_state,
            $id: sub_node_id,
            $parent_node: $node,
            state,
            $node: utils_1.normalize_node($sub_node),
            depth,
        });
        state = callbacks.on_concatenate_str({
            str: split2[0],
            state,
            $node,
            depth,
        });
        return state;
    }, state);
    return state;
}
function walk($raw_node, raw_callbacks, 
    // internal opts when recursing:
    { $parent_node, $id = 'root', depth = 0, } = {}) {
    const $node = utils_1.normalize_node($raw_node);
    const { $type, $classes, $sub: $sub_nodes, } = $node;
    let callbacks = raw_callbacks;
    const isRoot = !$parent_node;
    if (isRoot) {
        callbacks = Object.assign({}, get_default_callbacks(), callbacks);
        callbacks.on_root_enter();
    }
    let state = callbacks.on_node_enter({ $node, $id, depth });
    // TODO class begin / start ?
    state = $classes.reduce((state, $class) => callbacks.on_class_before({
        $class,
        state,
        $node,
        depth
    }), state);
    if ($type === 'ul' || $type === 'ol') {
        const sorted_keys = Object.keys($sub_nodes).sort();
        sorted_keys.forEach(key => {
            const $sub_node = {
                $type: types_1.NodeType.li,
                $content: `{{${key}}}`,
                $sub: {
                    [key]: $sub_nodes[key]
                }
            };
            let sub_state = walk($sub_node, callbacks, {
                $parent_node: $node,
                depth: depth + 1,
                $id: key,
            });
            state = callbacks.on_concatenate_sub_node({
                state,
                sub_state,
                $id: key,
                $node: utils_1.normalize_node($sub_node),
                $parent_node: $node,
                depth,
            });
        });
    }
    else
        state = walk_content($node, callbacks, state, depth);
    state = $classes.reduce((state, $class) => callbacks.on_class_after({ $class, state, $node, depth }), state);
    const fine_type_cb = `on_type_${$type}`;
    if (callbacks[fine_type_cb])
        state = callbacks[fine_type_cb]({ $type, state, $node, depth });
    else
        state = callbacks.on_type({ $type, state, $node, depth });
    state = callbacks.on_node_exit({ $node, $id, state, depth });
    if (!$parent_node)
        state = callbacks.on_root_exit({ state, $node, depth: 0 });
    return state;
}
exports.walk = walk;
//# sourceMappingURL=walk.js.map

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
const practical_logger_core_1 = __webpack_require__(157);
exports.createChildLogger = practical_logger_core_1.createChildLogger;
const print_error_to_ansi_1 = __webpack_require__(160);
const chalk_1 = __webpack_require__(14);
const prettyjson = __webpack_require__(20);
function prettifyJson(data) {
    return prettyjson.render(data, {
        keysColor: 'dim',
    });
}
const MIN_WIDTH = 7;
function to_aligned_ascii(level) {
    let lvl = level.toUpperCase();
    /*while (lvl.length <= MIN_WIDTH - 2) {
        lvl = ' ' + lvl + ' '
    }*/
    if (lvl.length < MIN_WIDTH)
        lvl = (lvl + '         ').slice(0, MIN_WIDTH);
    return lvl;
}
const LEVEL_TO_ASCII = {
    [practical_logger_core_1.LogLevel.fatal]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(' ' + practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.fatal])),
    [practical_logger_core_1.LogLevel.emerg]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.emerg])),
    [practical_logger_core_1.LogLevel.alert]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(' ' + practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.alert])),
    [practical_logger_core_1.LogLevel.crit]: chalk_1.default.bgRed.white.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.crit])),
    [practical_logger_core_1.LogLevel.error]: chalk_1.default.red.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.error])),
    [practical_logger_core_1.LogLevel.warning]: chalk_1.default.yellow.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.warning])),
    [practical_logger_core_1.LogLevel.warn]: chalk_1.default.yellow.bold(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.warn])),
    [practical_logger_core_1.LogLevel.notice]: chalk_1.default.blue(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.notice])),
    [practical_logger_core_1.LogLevel.info]: chalk_1.default.blue(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.info])),
    [practical_logger_core_1.LogLevel.verbose]: to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.verbose]),
    [practical_logger_core_1.LogLevel.log]: to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.log]),
    [practical_logger_core_1.LogLevel.debug]: to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.debug]),
    [practical_logger_core_1.LogLevel.trace]: chalk_1.default.dim(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.trace])),
    [practical_logger_core_1.LogLevel.silly]: chalk_1.default.dim(to_aligned_ascii(practical_logger_core_1.LEVEL_TO_HUMAN[practical_logger_core_1.LogLevel.silly])),
};
const LEVEL_TO_STYLIZE = {
    [practical_logger_core_1.LogLevel.fatal]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.emerg]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.alert]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.crit]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.error]: s => chalk_1.default.red.bold(s),
    [practical_logger_core_1.LogLevel.warning]: s => chalk_1.default.yellow(s),
    [practical_logger_core_1.LogLevel.warn]: s => chalk_1.default.yellow(s),
    [practical_logger_core_1.LogLevel.notice]: s => chalk_1.default.blue(s),
    [practical_logger_core_1.LogLevel.info]: s => chalk_1.default.blue(s),
    [practical_logger_core_1.LogLevel.verbose]: s => s,
    [practical_logger_core_1.LogLevel.log]: s => s,
    [practical_logger_core_1.LogLevel.debug]: s => s,
    [practical_logger_core_1.LogLevel.trace]: s => chalk_1.default.dim(s),
    [practical_logger_core_1.LogLevel.silly]: s => chalk_1.default.dim(s),
};
exports.LEVEL_TO_STYLIZE = LEVEL_TO_STYLIZE;
function createLogger(p) {
    function outputFn(payload) {
        const { level, name, msg, time, details } = payload;
        const { err } = details, detailsNoErr = tslib_1.__rest(details, ["err"]);
        let line = ''
            + chalk_1.default.dim(time)
            + ' '
            + LEVEL_TO_ASCII[level]
            + '› '
            + LEVEL_TO_STYLIZE[level](''
                + name
                + '›'
                + (msg ? ' ' : '')
                + msg
                + ' '
                + prettifyJson(detailsNoErr));
        console.log(line);
        if (err)
            print_error_to_ansi_1.displayError(err);
    }
    return practical_logger_core_1.createLogger(Object.assign({}, p, { outputFn }));
}
exports.createLogger = createLogger;
//# sourceMappingURL=index.js.map

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
const types_1 = __webpack_require__(32);
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

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
const timestamps_1 = __webpack_require__(158);
const types_1 = __webpack_require__(32);
const const_1 = __webpack_require__(71);
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

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
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
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var cssKeywords = __webpack_require__(163);

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
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var delta = max - min;
	var h;
	var s;
	var v;

	if (max === 0) {
		s = 0;
	} else {
		s = (delta / max * 1000) / 10;
	}

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

	v = ((max / 255) * 1000) / 10;

	return [h, s, v];
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
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
	prettify_json,
	indent_string,
} = __webpack_require__(21)


function prettify_json_for_debug() {
	return '\n{{{{{{{'
		+ indent_string(
			'\n' + prettify_json.apply(null, arguments),
			1,
			{indent: '	'}
		)
		+ '\n}}}}}}}'
}


module.exports = {
	prettify_json_for_debug,
}


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const stringWidth = __webpack_require__(35);
const chalk = __webpack_require__(14);
const widestLine = __webpack_require__(182);
const cliBoxes = __webpack_require__(183);
const camelCase = __webpack_require__(185);
const ansiAlign = __webpack_require__(186);
const termSize = __webpack_require__(78);

const getObject = detail => {
	let obj;

	if (typeof detail === 'number') {
		obj = {
			top: detail,
			right: detail * 3,
			bottom: detail,
			left: detail * 3
		};
	} else {
		obj = Object.assign({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}, detail);
	}

	return obj;
};

const getBorderChars = borderStyle => {
	const sides = [
		'topLeft',
		'topRight',
		'bottomRight',
		'bottomLeft',
		'vertical',
		'horizontal'
	];

	let chars;

	if (typeof borderStyle === 'string') {
		chars = cliBoxes[borderStyle];

		if (!chars) {
			throw new TypeError(`Invalid border style: ${borderStyle}`);
		}
	} else {
		sides.forEach(key => {
			if (!borderStyle[key] || typeof borderStyle[key] !== 'string') {
				throw new TypeError(`Invalid border style: ${key}`);
			}
		});

		chars = borderStyle;
	}

	return chars;
};

const getBackgroundColorName = x => camelCase('bg', x);

module.exports = (text, opts) => {
	opts = Object.assign({
		padding: 0,
		borderStyle: 'single',
		dimBorder: false,
		align: 'left',
		float: 'left'
	}, opts);

	if (opts.backgroundColor) {
		opts.backgroundColor = getBackgroundColorName(opts.backgroundColor);
	}

	if (opts.borderColor && !chalk[opts.borderColor]) {
		throw new Error(`${opts.borderColor} is not a valid borderColor`);
	}

	if (opts.backgroundColor && !chalk[opts.backgroundColor]) {
		throw new Error(`${opts.backgroundColor} is not a valid backgroundColor`);
	}

	const chars = getBorderChars(opts.borderStyle);
	const padding = getObject(opts.padding);
	const margin = getObject(opts.margin);

	const colorizeBorder = x => {
		const ret = opts.borderColor ? chalk[opts.borderColor](x) : x;
		return opts.dimBorder ? chalk.dim(ret) : ret;
	};

	const colorizeContent = x => opts.backgroundColor ? chalk[opts.backgroundColor](x) : x;

	text = ansiAlign(text, {align: opts.align});

	const NL = '\n';
	const PAD = ' ';

	let lines = text.split(NL);

	if (padding.top > 0) {
		lines = Array(padding.top).fill('').concat(lines);
	}

	if (padding.bottom > 0) {
		lines = lines.concat(Array(padding.bottom).fill(''));
	}

	const contentWidth = widestLine(text) + padding.left + padding.right;
	const paddingLeft = PAD.repeat(padding.left);
	const columns = termSize().columns;
	let marginLeft = PAD.repeat(margin.left);

	if (opts.float === 'center') {
		const padWidth = Math.max((columns - contentWidth) / 2, 0);
		marginLeft = PAD.repeat(padWidth);
	} else if (opts.float === 'right') {
		const padWidth = Math.max(columns - contentWidth - margin.right - 2, 0);
		marginLeft = PAD.repeat(padWidth);
	}

	const horizontal = chars.horizontal.repeat(contentWidth);
	const top = colorizeBorder(NL.repeat(margin.top) + marginLeft + chars.topLeft + horizontal + chars.topRight);
	const bottom = colorizeBorder(marginLeft + chars.bottomLeft + horizontal + chars.bottomRight + NL.repeat(margin.bottom));
	const side = colorizeBorder(chars.vertical);

	const middle = lines.map(line => {
		const paddingRight = PAD.repeat(contentWidth - stringWidth(line) - padding.left);
		return marginLeft + side + colorizeContent(paddingLeft + line + paddingRight) + side;
	}).join(NL);

	return top + NL + middle + NL + bottom;
};

module.exports._borderStyles = cliBoxes;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiRegex = __webpack_require__(180);

module.exports = input => typeof input === 'string' ? input.replace(ansiRegex(), '') : input;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
const path = __webpack_require__(5);
const execa = __webpack_require__(187);

const create = (columns, rows) => ({
	columns: parseInt(columns, 10),
	rows: parseInt(rows, 10)
});

module.exports = () => {
	const env = process.env;
	const stdout = process.stdout;
	const stderr = process.stderr;

	if (stdout && stdout.columns && stdout.rows) {
		return create(stdout.columns, stdout.rows);
	}

	if (stderr && stderr.columns && stderr.rows) {
		return create(stderr.columns, stderr.rows);
	}

	// These values are static, so not the first choice
	if (env.COLUMNS && env.LINES) {
		return create(env.COLUMNS, env.LINES);
	}

	if (process.platform === 'win32') {
		try {
			// Binary: https://github.com/sindresorhus/win-term-size
			const size = execa.sync(path.join(__dirname, 'vendor/windows/term-size.exe')).stdout.split(/\r?\n/);

			if (size.length === 2) {
				return create(size[0], size[1]);
			}
		} catch (err) {}
	} else {
		if (process.platform === 'darwin') {
			try {
				// Binary: https://github.com/sindresorhus/macos-term-size
				const size = execa.shellSync(path.join(__dirname, 'vendor/macos/term-size')).stdout.split(/\r?\n/);

				if (size.length === 2) {
					return create(size[0], size[1]);
				}
			} catch (err) {}
		}

		// `resize` is preferred as it works even when all file descriptors are redirected
		// https://linux.die.net/man/1/resize
		try {
			const size = execa.sync('resize', ['-u']).stdout.match(/\d+/g);

			if (size.length === 2) {
				return create(size[0], size[1]);
			}
		} catch (err) {}

		try {
			const columns = execa.sync('tput', ['cols']).stdout;
			const rows = execa.sync('tput', ['lines']).stdout;

			if (columns && rows) {
				return create(columns, rows);
			}
		} catch (err) {}
	}

	return create(80, 24);
};

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var path = __webpack_require__(5);
var which = __webpack_require__(190);
var LRU = __webpack_require__(80);

var commandCache = new LRU({ max: 50, maxAge: 30 * 1000 });  // Cache just for 30sec

function resolveCommand(command, noExtension) {
    var resolved;

    noExtension = !!noExtension;
    resolved = commandCache.get(command + '!' + noExtension);

    // Check if its resolved in the cache
    if (commandCache.has(command)) {
        return commandCache.get(command);
    }

    try {
        resolved = !noExtension ?
            which.sync(command) :
            which.sync(command, { pathExt: path.delimiter + (process.env.PATHEXT || '') });
    } catch (e) { /* empty */ }

    commandCache.set(command + '!' + noExtension, resolved);

    return resolved;
}

module.exports = resolveCommand;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = LRUCache

// This will be a proper iterable 'Map' in engines that support it,
// or a fakey-fake PseudoMap in older versions.
var Map = __webpack_require__(194)
var util = __webpack_require__(16)

// A linked list to keep track of recently-used-ness
var Yallist = __webpack_require__(196)

// use symbols if possible, otherwise just _props
var hasSymbol = typeof Symbol === 'function'
var makeSymbol
if (hasSymbol) {
  makeSymbol = function (key) {
    return Symbol.for(key)
  }
} else {
  makeSymbol = function (key) {
    return '_' + key
  }
}

var MAX = makeSymbol('max')
var LENGTH = makeSymbol('length')
var LENGTH_CALCULATOR = makeSymbol('lengthCalculator')
var ALLOW_STALE = makeSymbol('allowStale')
var MAX_AGE = makeSymbol('maxAge')
var DISPOSE = makeSymbol('dispose')
var NO_DISPOSE_ON_SET = makeSymbol('noDisposeOnSet')
var LRU_LIST = makeSymbol('lruList')
var CACHE = makeSymbol('cache')

function naiveLength () { return 1 }

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  if (typeof options === 'number') {
    options = { max: options }
  }

  if (!options) {
    options = {}
  }

  var max = this[MAX] = options.max
  // Kind of weird to have a default max of Infinity, but oh well.
  if (!max ||
      !(typeof max === 'number') ||
      max <= 0) {
    this[MAX] = Infinity
  }

  var lc = options.length || naiveLength
  if (typeof lc !== 'function') {
    lc = naiveLength
  }
  this[LENGTH_CALCULATOR] = lc

  this[ALLOW_STALE] = options.stale || false
  this[MAX_AGE] = options.maxAge || 0
  this[DISPOSE] = options.dispose
  this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
  this.reset()
}

// resize the cache when the max changes.
Object.defineProperty(LRUCache.prototype, 'max', {
  set: function (mL) {
    if (!mL || !(typeof mL === 'number') || mL <= 0) {
      mL = Infinity
    }
    this[MAX] = mL
    trim(this)
  },
  get: function () {
    return this[MAX]
  },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'allowStale', {
  set: function (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  },
  get: function () {
    return this[ALLOW_STALE]
  },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'maxAge', {
  set: function (mA) {
    if (!mA || !(typeof mA === 'number') || mA < 0) {
      mA = 0
    }
    this[MAX_AGE] = mA
    trim(this)
  },
  get: function () {
    return this[MAX_AGE]
  },
  enumerable: true
})

// resize the cache when the lengthCalculator changes.
Object.defineProperty(LRUCache.prototype, 'lengthCalculator', {
  set: function (lC) {
    if (typeof lC !== 'function') {
      lC = naiveLength
    }
    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(function (hit) {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      }, this)
    }
    trim(this)
  },
  get: function () { return this[LENGTH_CALCULATOR] },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'length', {
  get: function () { return this[LENGTH] },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'itemCount', {
  get: function () { return this[LRU_LIST].length },
  enumerable: true
})

LRUCache.prototype.rforEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this[LRU_LIST].tail; walker !== null;) {
    var prev = walker.prev
    forEachStep(this, fn, walker, thisp)
    walker = prev
  }
}

function forEachStep (self, fn, node, thisp) {
  var hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE]) {
      hit = undefined
    }
  }
  if (hit) {
    fn.call(thisp, hit.value, hit.key, self)
  }
}

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this[LRU_LIST].head; walker !== null;) {
    var next = walker.next
    forEachStep(this, fn, walker, thisp)
    walker = next
  }
}

LRUCache.prototype.keys = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.key
  }, this)
}

LRUCache.prototype.values = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.value
  }, this)
}

LRUCache.prototype.reset = function () {
  if (this[DISPOSE] &&
      this[LRU_LIST] &&
      this[LRU_LIST].length) {
    this[LRU_LIST].forEach(function (hit) {
      this[DISPOSE](hit.key, hit.value)
    }, this)
  }

  this[CACHE] = new Map() // hash of items by key
  this[LRU_LIST] = new Yallist() // list of items in order of use recency
  this[LENGTH] = 0 // length of items in the list
}

LRUCache.prototype.dump = function () {
  return this[LRU_LIST].map(function (hit) {
    if (!isStale(this, hit)) {
      return {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }
    }
  }, this).toArray().filter(function (h) {
    return h
  })
}

LRUCache.prototype.dumpLru = function () {
  return this[LRU_LIST]
}

LRUCache.prototype.inspect = function (n, opts) {
  var str = 'LRUCache {'
  var extras = false

  var as = this[ALLOW_STALE]
  if (as) {
    str += '\n  allowStale: true'
    extras = true
  }

  var max = this[MAX]
  if (max && max !== Infinity) {
    if (extras) {
      str += ','
    }
    str += '\n  max: ' + util.inspect(max, opts)
    extras = true
  }

  var maxAge = this[MAX_AGE]
  if (maxAge) {
    if (extras) {
      str += ','
    }
    str += '\n  maxAge: ' + util.inspect(maxAge, opts)
    extras = true
  }

  var lc = this[LENGTH_CALCULATOR]
  if (lc && lc !== naiveLength) {
    if (extras) {
      str += ','
    }
    str += '\n  length: ' + util.inspect(this[LENGTH], opts)
    extras = true
  }

  var didFirst = false
  this[LRU_LIST].forEach(function (item) {
    if (didFirst) {
      str += ',\n  '
    } else {
      if (extras) {
        str += ',\n'
      }
      didFirst = true
      str += '\n  '
    }
    var key = util.inspect(item.key).split('\n').join('\n  ')
    var val = { value: item.value }
    if (item.maxAge !== maxAge) {
      val.maxAge = item.maxAge
    }
    if (lc !== naiveLength) {
      val.length = item.length
    }
    if (isStale(this, item)) {
      val.stale = true
    }

    val = util.inspect(val, opts).split('\n').join('\n  ')
    str += key + ' => ' + val
  })

  if (didFirst || extras) {
    str += '\n'
  }
  str += '}'

  return str
}

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this[MAX_AGE]

  var now = maxAge ? Date.now() : 0
  var len = this[LENGTH_CALCULATOR](value, key)

  if (this[CACHE].has(key)) {
    if (len > this[MAX]) {
      del(this, this[CACHE].get(key))
      return false
    }

    var node = this[CACHE].get(key)
    var item = node.value

    // dispose of the old one before overwriting
    // split out into 2 ifs for better coverage tracking
    if (this[DISPOSE]) {
      if (!this[NO_DISPOSE_ON_SET]) {
        this[DISPOSE](key, item.value)
      }
    }

    item.now = now
    item.maxAge = maxAge
    item.value = value
    this[LENGTH] += len - item.length
    item.length = len
    this.get(key)
    trim(this)
    return true
  }

  var hit = new Entry(key, value, len, now, maxAge)

  // oversized objects fall out of cache automatically.
  if (hit.length > this[MAX]) {
    if (this[DISPOSE]) {
      this[DISPOSE](key, value)
    }
    return false
  }

  this[LENGTH] += hit.length
  this[LRU_LIST].unshift(hit)
  this[CACHE].set(key, this[LRU_LIST].head)
  trim(this)
  return true
}

LRUCache.prototype.has = function (key) {
  if (!this[CACHE].has(key)) return false
  var hit = this[CACHE].get(key).value
  if (isStale(this, hit)) {
    return false
  }
  return true
}

LRUCache.prototype.get = function (key) {
  return get(this, key, true)
}

LRUCache.prototype.peek = function (key) {
  return get(this, key, false)
}

LRUCache.prototype.pop = function () {
  var node = this[LRU_LIST].tail
  if (!node) return null
  del(this, node)
  return node.value
}

LRUCache.prototype.del = function (key) {
  del(this, this[CACHE].get(key))
}

LRUCache.prototype.load = function (arr) {
  // reset the cache
  this.reset()

  var now = Date.now()
  // A previous serialized cache has the most recent items first
  for (var l = arr.length - 1; l >= 0; l--) {
    var hit = arr[l]
    var expiresAt = hit.e || 0
    if (expiresAt === 0) {
      // the item was created without expiration in a non aged cache
      this.set(hit.k, hit.v)
    } else {
      var maxAge = expiresAt - now
      // dont add already expired items
      if (maxAge > 0) {
        this.set(hit.k, hit.v, maxAge)
      }
    }
  }
}

LRUCache.prototype.prune = function () {
  var self = this
  this[CACHE].forEach(function (value, key) {
    get(self, key, false)
  })
}

function get (self, key, doUse) {
  var node = self[CACHE].get(key)
  if (node) {
    var hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE]) hit = undefined
    } else {
      if (doUse) {
        self[LRU_LIST].unshiftNode(node)
      }
    }
    if (hit) hit = hit.value
  }
  return hit
}

function isStale (self, hit) {
  if (!hit || (!hit.maxAge && !self[MAX_AGE])) {
    return false
  }
  var stale = false
  var diff = Date.now() - hit.now
  if (hit.maxAge) {
    stale = diff > hit.maxAge
  } else {
    stale = self[MAX_AGE] && (diff > self[MAX_AGE])
  }
  return stale
}

function trim (self) {
  if (self[LENGTH] > self[MAX]) {
    for (var walker = self[LRU_LIST].tail;
         self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      var prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

function del (self, node) {
  if (node) {
    var hit = node.value
    if (self[DISPOSE]) {
      self[DISPOSE](hit.key, hit.value)
    }
    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, length, now, maxAge) {
  this.key = key
  this.value = value
  this.length = length
  this.now = now
  this.maxAge = maxAge || 0
}


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function escapeArgument(arg, quote) {
    // Convert to string
    arg = '' + arg;

    // If we are not going to quote the argument,
    // escape shell metacharacters, including double and single quotes:
    if (!quote) {
        arg = arg.replace(/([()%!^<>&|;,"'\s])/g, '^$1');
    } else {
        // Sequence of backslashes followed by a double quote:
        // double up all the backslashes and escape the double quote
        arg = arg.replace(/(\\*)"/g, '$1$1\\"');

        // Sequence of backslashes followed by the end of the string
        // (which will become a double quote later):
        // double up all the backslashes
        arg = arg.replace(/(\\*)$/, '$1$1');

        // All other backslashes occur literally

        // Quote the whole thing:
        arg = '"' + arg + '"';
    }

    return arg;
}

module.exports = escapeArgument;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),
/* 83 */
/***/ (function(module, exports) {


// Presets
var presetMap = {
    'html': {
        skipScheme: 'html',
        lineBreakScheme: 'html',
        whitespace: 'collapse'
    }
};

// lineBreak Schemes
var brPat = /<\s*br(?:[\s/]*|\s[^>]*)>/gi;
var lineBreakSchemeMap = {
    'unix': [/\n/g, '\n'],
    'dos': [/\r\n/g, '\r\n'],
    'mac': [/\r/g, '\r'],
    'html': [brPat, '<br>'],
    'xhtml': [brPat, '<br/>']
};

// skip Schemes
var skipSchemeMap = {
    'ansi-color': /\x1B\[[^m]*m/g,
    'html': /<[^>]*>/g,
    'bbcode': /\[[^]]*\]/g
};

var modeMap = {
    'soft': 1,
    'hard': 1
};

var wsMap = {
    'collapse': 1,
    'default': 1,
    'line': 1,
    'all': 1
};

var rlbMap = {
    'all': 1,
    'multi': 1,
    'none': 1
};
var rlbSMPat = /([sm])(\d+)/;

var escapePat = /[-/\\^$*+?.()|[\]{}]/g;
function escapeRegExp(s) {
    return s.replace(escapePat, '\\$&');
}

var linewrap = module.exports = function (start, stop, params) {
    if (typeof start === 'object') {
        params = start;
        start = params.start;
        stop = params.stop;
    }

    if (typeof stop === 'object') {
        params = stop;
        start = start || params.start;
        stop = undefined;
    }

    if (!stop) {
        stop = start;
        start = 0;
    }

    if (!params) { params = {}; }
    // Supported options and default values.
    var preset,
        mode = 'soft',
        whitespace = 'default',
        tabWidth = 4,
        skip, skipScheme, lineBreak, lineBreakScheme,
        respectLineBreaks = 'all',
        respectNum,
        preservedLineIndent,
        wrapLineIndent, wrapLineIndentBase;

    var skipPat;
    var lineBreakPat, lineBreakStr;
    var multiLineBreakPat;
    var preservedLinePrefix = '';
    var wrapLineIndentPat, wrapLineInitPrefix = '';
    var tabRepl;
    var item, flags;
    var i;

    // First process presets, because these settings can be overwritten later.
    preset = params.preset;
    if (preset) {
        if (!(preset instanceof Array)) {
            preset = [preset];
        }
        for (i = 0; i < preset.length; i++) {
            item = presetMap[preset[i]];
            if (item) {
                if (item.mode) {
                    mode = item.mode;
                }
                if (item.whitespace) {
                    whitespace = item.whitespace;
                }
                if (item.tabWidth !== undefined) {
                    tabWidth = item.tabWidth;
                }
                if (item.skip) {
                    skip = item.skip;
                }
                if (item.skipScheme) {
                    skipScheme = item.skipScheme;
                }
                if (item.lineBreak) {
                    lineBreak = item.lineBreak;
                }
                if (item.lineBreakScheme) {
                    lineBreakScheme = item.lineBreakScheme;
                }
                if (item.respectLineBreaks) {
                    respectLineBreaks = item.respectLineBreaks;
                }
                if (item.preservedLineIndent !== undefined) {
                    preservedLineIndent = item.preservedLineIndent;
                }
                if (item.wrapLineIndent !== undefined) {
                    wrapLineIndent = item.wrapLineIndent;
                }
                if (item.wrapLineIndentBase) {
                    wrapLineIndentBase = item.wrapLineIndentBase;
                }
            } else {
                throw new TypeError('preset must be one of "' + Object.keys(presetMap).join('", "') + '"');
            }
        }
    }

    if (params.mode) {
        if (modeMap[params.mode]) {
            mode = params.mode;
        } else {
            throw new TypeError('mode must be one of "' + Object.keys(modeMap).join('", "') + '"');
        }
    }
    // Available options: 'collapse', 'default', 'line', and 'all'
    if (params.whitespace) {
        if (wsMap[params.whitespace]) {
            whitespace = params.whitespace;
        } else {
            throw new TypeError('whitespace must be one of "' + Object.keys(wsMap).join('", "') + '"');
        }
    }

    if (params.tabWidth !== undefined) {
        if (parseInt(params.tabWidth, 10) >= 0) {
            tabWidth = parseInt(params.tabWidth, 10);
        } else {
            throw new TypeError('tabWidth must be a non-negative integer');
        }
    }
    tabRepl = new Array(tabWidth + 1).join(' ');

    // Available options: 'all', 'multi', 'm\d+', 's\d+', 'none'
    if (params.respectLineBreaks) {
        if (rlbMap[params.respectLineBreaks] || rlbSMPat.test(params.respectLineBreaks)) {
            respectLineBreaks = params.respectLineBreaks;
        } else {
            throw new TypeError('respectLineBreaks must be one of "' + Object.keys(rlbMap).join('", "') +
                                '", "m<num>", "s<num>"');
        }
    }
    // After these conversions, now we have 4 options in `respectLineBreaks`:
    // 'all', 'none', 'm' and 's'.
    // `respectNum` is applicable iff `respectLineBreaks` is either 'm' or 's'.
    if (respectLineBreaks === 'multi') {
        respectLineBreaks = 'm';
        respectNum = 2;
    } else if (!rlbMap[respectLineBreaks]) {
        var match = rlbSMPat.exec(respectLineBreaks);
        respectLineBreaks = match[1];
        respectNum = parseInt(match[2], 10);
    }

    if (params.preservedLineIndent !== undefined) {
        if (parseInt(params.preservedLineIndent, 10) >= 0) {
            preservedLineIndent = parseInt(params.preservedLineIndent, 10);
        } else {
            throw new TypeError('preservedLineIndent must be a non-negative integer');
        }
    }

    if (preservedLineIndent > 0) {
        preservedLinePrefix = new Array(preservedLineIndent + 1).join(' ');
    }

    if (params.wrapLineIndent !== undefined) {
        if (!isNaN(parseInt(params.wrapLineIndent, 10))) {
            wrapLineIndent = parseInt(params.wrapLineIndent, 10);
        } else {
            throw new TypeError('wrapLineIndent must be an integer');
        }
    }
    if (params.wrapLineIndentBase) {
        wrapLineIndentBase = params.wrapLineIndentBase;
    }

    if (wrapLineIndentBase) {
        if (wrapLineIndent === undefined) {
            throw new TypeError('wrapLineIndent must be specified when wrapLineIndentBase is specified');
        }
        if (wrapLineIndentBase instanceof RegExp) {
            wrapLineIndentPat = wrapLineIndentBase;
        } else if (typeof wrapLineIndentBase === 'string') {
            wrapLineIndentPat = new RegExp(escapeRegExp(wrapLineIndentBase));
        } else {
            throw new TypeError('wrapLineIndentBase must be either a RegExp object or a string');
        }
    } else if (wrapLineIndent > 0) {
        wrapLineInitPrefix = new Array(wrapLineIndent + 1).join(' ');
    } else if (wrapLineIndent < 0) {
        throw new TypeError('wrapLineIndent must be non-negative when a base is not specified');
    }

    // NOTE: For the two RegExps `skipPat` and `lineBreakPat` that can be specified
    //       by the user:
    //       1. We require them to be "global", so we have to convert them to global
    //          if the user specifies a non-global regex.
    //       2. We cannot call `split()` on them, because they may or may not contain
    //          capturing parentheses which affect the output of `split()`.

    // Precedence: Regex = Str > Scheme
    if (params.skipScheme) {
        if (skipSchemeMap[params.skipScheme]) {
            skipScheme = params.skipScheme;
        } else {
            throw new TypeError('skipScheme must be one of "' + Object.keys(skipSchemeMap).join('", "') + '"');
        }
    }
    if (params.skip) {
        skip = params.skip;
    }

    if (skip) {
        if (skip instanceof RegExp) {
            skipPat = skip;
            if (!skipPat.global) {
                flags = 'g';
                if (skipPat.ignoreCase) { flags += 'i'; }
                if (skipPat.multiline) { flags += 'm'; }
                skipPat = new RegExp(skipPat.source, flags);
            }
        } else if (typeof skip === 'string') {
            skipPat = new RegExp(escapeRegExp(skip), 'g');
        } else {
            throw new TypeError('skip must be either a RegExp object or a string');
        }
    }
    if (!skipPat && skipScheme) {
        skipPat = skipSchemeMap[skipScheme];
    }

    // Precedence:
    // - for lineBreakPat: Regex > Scheme > Str
    // - for lineBreakStr: Str > Scheme > Regex
    if (params.lineBreakScheme) {
        if (lineBreakSchemeMap[params.lineBreakScheme]) {
            lineBreakScheme = params.lineBreakScheme;
        } else {
            throw new TypeError('lineBreakScheme must be one of "' + Object.keys(lineBreakSchemeMap).join('", "') + '"');
        }
    }
    if (params.lineBreak) {
        lineBreak = params.lineBreak;
    }

    if (lineBreakScheme) {
        // Supported schemes: 'unix', 'dos', 'mac', 'html', 'xhtml'
        item = lineBreakSchemeMap[lineBreakScheme];
        if (item) {
            lineBreakPat = item[0];
            lineBreakStr = item[1];
        }
    }
    if (lineBreak) {
        if (lineBreak instanceof Array) {
            if (lineBreak.length === 1) {
                lineBreak = lineBreak[0];
            } else if (lineBreak.length >= 2) {
                if (lineBreak[0] instanceof RegExp) {
                    lineBreakPat = lineBreak[0];
                    if (typeof lineBreak[1] === 'string') {
                        lineBreakStr = lineBreak[1];
                    }
                } else if (lineBreak[1] instanceof RegExp) {
                    lineBreakPat = lineBreak[1];
                    if (typeof lineBreak[0] === 'string') {
                        lineBreakStr = lineBreak[0];
                    }
                } else if (typeof lineBreak[0] === 'string' && typeof lineBreak[1] === 'string') {
                    lineBreakPat = new RegExp(escapeRegExp(lineBreak[0]), 'g');
                    lineBreakStr = lineBreak[1];
                } else {
                    lineBreak = lineBreak[0];
                }
            }
        }
        if (typeof lineBreak === 'string') {
            lineBreakStr = lineBreak;
            if (!lineBreakPat) {
                lineBreakPat = new RegExp(escapeRegExp(lineBreak), 'g');
            }
        } else if (lineBreak instanceof RegExp) {
            lineBreakPat = lineBreak;
        } else if (!(lineBreak instanceof Array)) {
            throw new TypeError('lineBreak must be a RegExp object, a string, or an array consisted of a RegExp object and a string');
        }
    }
    // Only assign defaults when `lineBreakPat` is not assigned.
    // So if `params.lineBreak` is a RegExp, we don't have a value in `lineBreakStr`
    // yet. We will try to get the value from the input string, and if failed, we
    // will throw an exception.
    if (!lineBreakPat) {
        lineBreakPat = /\n/g;
        lineBreakStr = '\n';
    }

    // Create `multiLineBreakPat` based on `lineBreakPat`, that matches strings
    // consisted of one or more line breaks and zero or more whitespaces.
    // Also convert `lineBreakPat` to global if not already so.
    flags = 'g';
    if (lineBreakPat.ignoreCase) { flags += 'i'; }
    if (lineBreakPat.multiline) { flags += 'm'; }
    multiLineBreakPat = new RegExp('\\s*(?:' + lineBreakPat.source + ')(?:' +
                                   lineBreakPat.source + '|\\s)*', flags);
    if (!lineBreakPat.global) {
        lineBreakPat = new RegExp(lineBreakPat.source, flags);
    }

    // Initialize other useful variables.
    var re = mode === 'hard' ? /\b/ : /(\S+\s+)/;
    var prefix = new Array(start + 1).join(' ');
    var wsStrip = (whitespace === 'default' || whitespace === 'collapse'),
        wsCollapse = (whitespace === 'collapse'),
        wsLine = (whitespace === 'line'),
        wsAll = (whitespace === 'all');
    var tabPat = /\t/g,
        collapsePat = /  +/g,
        pPat = /^\s+/,
        tPat = /\s+$/,
        nonWsPat = /\S/,
        wsPat = /\s/;
    var wrapLen = stop - start;

    return function (text) {
        text = text.toString().replace(tabPat, tabRepl);

        var match;
        if (!lineBreakStr) {
            // Try to get lineBreakStr from `text`
            lineBreakPat.lastIndex = 0;
            match = lineBreakPat.exec(text);
            if (match) {
                lineBreakStr = match[0];
            } else {
                throw new TypeError('Line break string for the output not specified');
            }
        }

        // text -> blocks; each bloc -> segments; each segment -> chunks
        var blocks, base = 0;
        var mo, arr, b, res;
        // Split `text` by line breaks.
        blocks = [];
        multiLineBreakPat.lastIndex = 0;
        match = multiLineBreakPat.exec(text);
        while(match) {
            blocks.push(text.substring(base, match.index));

            if (respectLineBreaks !== 'none') {
                arr = [];
                b = 0;
                lineBreakPat.lastIndex = 0;
                mo = lineBreakPat.exec(match[0]);
                while(mo) {
                    arr.push(match[0].substring(b, mo.index));
                    b = mo.index + mo[0].length;
                    mo = lineBreakPat.exec(match[0]);
                }
                arr.push(match[0].substring(b));
                blocks.push({type: 'break', breaks: arr});
            } else {
                // Strip line breaks and insert spaces when necessary.
                if (wsCollapse) {
                    res = ' ';
                } else {
                    res = match[0].replace(lineBreakPat, '');
                }
                blocks.push({type: 'break', remaining: res});
            }

            base = match.index + match[0].length;
            match = multiLineBreakPat.exec(text);
        }
        blocks.push(text.substring(base));

        var i, j, k;
        var segments;
        if (skipPat) {
            segments = [];
            for (i = 0; i < blocks.length; i++) {
                var bloc = blocks[i];
                if (typeof bloc !== 'string') {
                    // This is an object.
                    segments.push(bloc);
                } else {
                    base = 0;
                    skipPat.lastIndex = 0;
                    match = skipPat.exec(bloc);
                    while(match) {
                        segments.push(bloc.substring(base, match.index));
                        segments.push({type: 'skip', value: match[0]});
                        base = match.index + match[0].length;
                        match = skipPat.exec(bloc);
                    }
                    segments.push(bloc.substring(base));
                }
            }
        } else {
            segments = blocks;
        }

        var chunks = [];
        for (i = 0; i < segments.length; i++) {
            var segment = segments[i];
            if (typeof segment !== 'string') {
                // This is an object.
                chunks.push(segment);
            } else {
                if (wsCollapse) {
                    segment = segment.replace(collapsePat, ' ');
                }

                var parts = segment.split(re),
                    acc = [];

                for (j = 0; j < parts.length; j++) {
                    var x = parts[j];
                    if (mode === 'hard') {
                        for (k = 0; k < x.length; k += wrapLen) {
                            acc.push(x.slice(k, k + wrapLen));
                        }
                    }
                    else { acc.push(x); }
                }
                chunks = chunks.concat(acc);
            }
        }

        var curLine = 0,
            curLineLength = start + preservedLinePrefix.length,
            lines = [ prefix + preservedLinePrefix ],
            // Holds the "real length" (excluding trailing whitespaces) of the
            // current line if it exceeds `stop`, otherwise 0.
            // ONLY USED when `wsAll` is true, in `finishOffCurLine()`.
            bulge = 0,
            // `cleanLine` is true iff we are at the beginning of an output line. By
            // "beginning" we mean it doesn't contain any non-whitespace char yet.
            // But its `curLineLength` can be greater than `start`, or even possibly
            // be greater than `stop`, if `wsStrip` is false.
            //
            // Note that a "clean" line can still contain skip strings, in addition
            // to whitespaces.
            //
            // This variable is used to allow us strip preceding whitespaces when
            // `wsStrip` is true, or `wsLine` is true and `preservedLine` is false.
            cleanLine = true,
            // `preservedLine` is true iff we are in a preserved input line.
            //
            // It's used when `wsLine` is true to (combined with `cleanLine`) decide
            // whether a whitespace is at the beginning of a preserved input line and
            // should not be stripped.
            preservedLine = true,
            // The current indent prefix for wrapped lines.
            wrapLinePrefix = wrapLineInitPrefix,
            remnant;

        // Always returns '' if `beforeHardBreak` is true.
        //
        // Assumption: Each call of this function is always followed by a `lines.push()` call.
        //
        // This function can change the status of `cleanLine`, but we don't modify the value of
        // `cleanLine` in this function. It's fine because `cleanLine` will be set to the correct
        // value after the `lines.push()` call following this function call. We also don't update
        // `curLineLength` when pushing a new line and it's safe for the same reason.
        function finishOffCurLine(beforeHardBreak) {
            var str = lines[curLine],
                idx, ln, rBase;

            if (!wsAll) {
                // Strip all trailing whitespaces past `start`.
                idx = str.length - 1;
                while (idx >= start && str[idx] === ' ') { idx--; }
                while (idx >= start && wsPat.test(str[idx])) { idx--; }
                idx++;

                if (idx !== str.length) {
                    lines[curLine] = str.substring(0, idx);
                }

                if (preservedLine && cleanLine && wsLine && curLineLength > stop) {
                    // Add the remnants to the next line, just like when `wsAll` is true.
                    rBase = str.length - (curLineLength - stop);
                    if (rBase < idx) {
                        // We didn't reach `stop` when stripping due to a bulge.
                        rBase = idx;
                    }
                }
            } else {
                // Strip trailing whitespaces exceeding stop.
                if (curLineLength > stop) {
                    bulge = bulge || stop;
                    rBase = str.length - (curLineLength - bulge);
                    lines[curLine] = str.substring(0,  rBase);
                }
                bulge = 0;
            }

            // Bug: the current implementation of `wrapLineIndent` is buggy: we are not
            // taking the extra space occupied by the additional indentation into account
            // when wrapping the line. For example, in "hard" mode, we should hard-wrap
            // long words at `wrapLen - wrapLinePrefix.length` instead of `wrapLen`;
            // and remnants should also be wrapped at `wrapLen - wrapLinePrefix.length`.
            if (preservedLine) {
                // This is a preserved line, and the next output line isn't a
                // preserved line.
                preservedLine = false;
                if (wrapLineIndentPat) {
                    idx = lines[curLine].substring(start).search(wrapLineIndentPat);
                    if (idx >= 0 && idx + wrapLineIndent > 0) {
                        wrapLinePrefix = new Array(idx + wrapLineIndent + 1).join(' ');
                    } else {
                        wrapLinePrefix = '';
                    }
                }
            }

            // Some remnants are left to the next line.
            if (rBase) {
                while (rBase + wrapLen < str.length) {
                    if (wsAll) {
                        ln = str.substring(rBase, rBase + wrapLen);
                        lines.push(prefix + wrapLinePrefix + ln);
                    } else {
                        lines.push(prefix + wrapLinePrefix);
                    }
                    rBase += wrapLen;
                    curLine++;
                }
                if (beforeHardBreak) {
                    if (wsAll) {
                        ln = str.substring(rBase);
                        lines.push(prefix + wrapLinePrefix + ln);
                    } else {
                        lines.push(prefix + wrapLinePrefix);
                    }
                    curLine++;
                } else {
                    ln = str.substring(rBase);
                    return wrapLinePrefix + ln;
                }
            }

            return '';
        }

        for (i = 0; i < chunks.length; i++) {
            var chunk = chunks[i];

            if (chunk === '') { continue; }

            if (typeof chunk !== 'string') {
                if (chunk.type === 'break') {
                    // This is one or more line breaks.
                    // Each entry in `breaks` is just zero or more whitespaces.
                    if (respectLineBreaks !== 'none') {
                        // Note that if `whitespace` is "collapse", we still need
                        // to collapse whitespaces in entries of `breaks`.
                        var breaks = chunk.breaks;
                        var num = breaks.length - 1;

                        if (respectLineBreaks === 's') {
                            // This is the most complex scenario. We have to check
                            // the line breaks one by one.
                            for (j = 0; j < num; j++) {
                                if (breaks[j+1].length < respectNum) {
                                    // This line break should be stripped.
                                    if (wsCollapse) {
                                        breaks[j+1] = ' ';
                                    } else {
                                        breaks[j+1] = breaks[j] + breaks[j+1];
                                    }
                                } else {
                                    // This line break should be preserved.
                                    // First finish off the current line.
                                    if (wsAll) {
                                        lines[curLine] += breaks[j];
                                        curLineLength += breaks[j].length;
                                    }
                                    finishOffCurLine(true);

                                    lines.push(prefix + preservedLinePrefix);
                                    curLine++;
                                    curLineLength = start + preservedLinePrefix.length;

                                    preservedLine = cleanLine = true;
                                }
                            }
                            // We are adding to either the existing line (if no line break
                            // is qualified for preservance) or a "new" line.
                            if (!cleanLine || wsAll || (wsLine && preservedLine)) {
                                if (wsCollapse || (!cleanLine && breaks[num] === '')) {
                                    breaks[num] = ' ';
                                }
                                lines[curLine] += breaks[num];
                                curLineLength += breaks[num].length;
                            }
                        } else if (respectLineBreaks === 'm' && num < respectNum) {
                            // These line breaks should be stripped.
                            if (!cleanLine || wsAll || (wsLine && preservedLine)) {
                                if (wsCollapse) {
                                    chunk = ' ';
                                } else {
                                    chunk = breaks.join('');
                                    if (!cleanLine && chunk === '') {
                                        chunk = ' ';
                                    }
                                }
                                lines[curLine] += chunk;
                                curLineLength += chunk.length;
                            }
                        } else {    // 'all' || ('m' && num >= respectNum)
                            // These line breaks should be preserved.
                            if (wsStrip) {
                                // Finish off the current line.
                                finishOffCurLine(true);

                                for (j = 0; j < num; j++) {
                                    lines.push(prefix + preservedLinePrefix);
                                    curLine++;
                                }

                                curLineLength = start + preservedLinePrefix.length;
                                preservedLine = cleanLine = true;

                            } else {
                                if (wsAll || (preservedLine && cleanLine)) {
                                    lines[curLine] += breaks[0];
                                    curLineLength += breaks[0].length;
                                }

                                for (j = 0; j < num; j++) {
                                    // Finish off the current line.
                                    finishOffCurLine(true);

                                    lines.push(prefix + preservedLinePrefix + breaks[j+1]);
                                    curLine++;
                                    curLineLength = start + preservedLinePrefix.length + breaks[j+1].length;

                                    preservedLine = cleanLine = true;
                                }
                            }
                        }
                    } else {
                        // These line breaks should be stripped.
                        if (!cleanLine || wsAll || (wsLine && preservedLine)) {
                            chunk = chunk.remaining;

                            // Bug: If `wsAll` is true, `cleanLine` is false, and `chunk`
                            // is '', we insert a space to replace the line break. This
                            // space will be preserved even if we are at the end of an
                            // output line, which is wrong behavior. However, I'm not
                            // sure it's worth it to fix this edge case.
                            if (wsCollapse || (!cleanLine && chunk === '')) {
                                chunk = ' ';
                            }
                            lines[curLine] += chunk;
                            curLineLength += chunk.length;
                        }
                    }
                } else if (chunk.type === 'skip') {
                    // This is a skip string.
                    // Assumption: skip strings don't end with whitespaces.
                    if (curLineLength > stop) {
                        remnant = finishOffCurLine(false);

                        lines.push(prefix + wrapLinePrefix);
                        curLine++;
                        curLineLength = start + wrapLinePrefix.length;

                        if (remnant) {
                            lines[curLine] += remnant;
                            curLineLength += remnant.length;
                        }

                        cleanLine = true;
                    }
                    lines[curLine] += chunk.value;
                }
                continue;
            }

            var chunk2;
            while (1) {
                chunk2 = undefined;
                if (curLineLength + chunk.length > stop &&
                        curLineLength + (chunk2 = chunk.replace(tPat, '')).length > stop &&
                        chunk2 !== '' &&
                        curLineLength > start) {
                    // This line is full, add `chunk` to the next line
                    remnant = finishOffCurLine(false);

                    lines.push(prefix + wrapLinePrefix);
                    curLine++;
                    curLineLength = start + wrapLinePrefix.length;

                    if (remnant) {
                        lines[curLine] += remnant;
                        curLineLength += remnant.length;
                        cleanLine = true;
                        continue;
                    }

                    if (wsStrip || (wsLine && !(preservedLine && cleanLine))) {
                        chunk = chunk.replace(pPat, '');
                    }
                    cleanLine = false;

                } else {
                    // Add `chunk` to this line
                    if (cleanLine) {
                        if (wsStrip || (wsLine && !(preservedLine && cleanLine))) {
                            chunk = chunk.replace(pPat, '');
                            if (chunk !== '') {
                                cleanLine = false;
                            }
                        } else {
                            if (nonWsPat.test(chunk)) {
                                cleanLine = false;
                            }
                        }
                    }
                }
                break;
            }
            if (wsAll && chunk2 && curLineLength + chunk2.length > stop) {
                bulge = curLineLength + chunk2.length;
            }
            lines[curLine] += chunk;
            curLineLength += chunk.length;
        }
        // Finally, finish off the last line.
        finishOffCurLine(true);
        return lines.join(lineBreakStr);
    };
};

linewrap.soft = linewrap;

linewrap.hard = function (/*start, stop, params*/) {
    var args = [].slice.call(arguments);
    var last = args.length - 1;
    if (typeof args[last] === 'object') {
        args[last].mode = 'hard';
    } else {
        args.push({ mode : 'hard' });
    }
    return linewrap.apply(null, args);
};

linewrap.wrap = function(text/*, start, stop, params*/) {
    var args = [].slice.call(arguments);
    args.shift();
    return linewrap.apply(null, args)(text);
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {

function assembleStyles () {
	var styles = {
		modifiers: {
			reset: [0, 0],
			bold: [1, 22], // 21 isn't widely supported and 22 does the same thing
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	// fix humans
	styles.colors.grey = styles.colors.gray;

	Object.keys(styles).forEach(function (groupName) {
		var group = styles[groupName];

		Object.keys(group).forEach(function (styleName) {
			var style = group[styleName];

			styles[styleName] = group[styleName] = {
				open: '\u001b[' + style[0] + 'm',
				close: '\u001b[' + style[1] + 'm'
			};
		});

		Object.defineProperty(styles, groupName, {
			value: group,
			enumerable: false
		});
	});

	return styles;
}

Object.defineProperty(module, 'exports', {
	enumerable: true,
	get: assembleStyles
});

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(73)(module)))

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// These tables borrowed from `ansi`

var prefix = '\x1b['

exports.up = function up (num) {
  return prefix + (num || '') + 'A'
}

exports.down = function down (num) {
  return prefix + (num || '') + 'B'
}

exports.forward = function forward (num) {
  return prefix + (num || '') + 'C'
}

exports.back = function back (num) {
  return prefix + (num || '') + 'D'
}

exports.nextLine = function nextLine (num) {
  return prefix + (num || '') + 'E'
}

exports.previousLine = function previousLine (num) {
  return prefix + (num || '') + 'F'
}

exports.horizontalAbsolute = function horizontalAbsolute (num) {
  if (num == null) throw new Error('horizontalAboslute requires a column to position to')
  return prefix + num + 'G'
}

exports.eraseData = function eraseData () {
  return prefix + 'J'
}

exports.eraseLine = function eraseLine () {
  return prefix + 'K'
}

exports.goto = function (x, y) {
  return prefix + y + ';' + x + 'H'
}

exports.gotoSOL = function () {
  return '\r'
}

exports.beep = function () {
  return '\x07'
}

exports.hideCursor = function hideCursor () {
  return prefix + '?25l'
}

exports.showCursor = function showCursor () {
  return prefix + '?25h'
}

var colors = {
  reset: 0,
// styles
  bold: 1,
  italic: 3,
  underline: 4,
  inverse: 7,
// resets
  stopBold: 22,
  stopItalic: 23,
  stopUnderline: 24,
  stopInverse: 27,
// colors
  white: 37,
  black: 30,
  blue: 34,
  cyan: 36,
  green: 32,
  magenta: 35,
  red: 31,
  yellow: 33,
  bgWhite: 47,
  bgBlack: 40,
  bgBlue: 44,
  bgCyan: 46,
  bgGreen: 42,
  bgMagenta: 45,
  bgRed: 41,
  bgYellow: 43,

  grey: 90,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,

  bgGrey: 100,
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107
}

exports.color = function color (colorWith) {
  if (arguments.length !== 1 || !Array.isArray(colorWith)) {
    colorWith = Array.prototype.slice.call(arguments)
  }
  return prefix + colorWith.map(colorNameToCode).join(';') + 'm'
}

function colorNameToCode (color) {
  if (colors[color] != null) return colors[color]
  throw new Error('Unknown color or style name: ' + color)
}


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var align = __webpack_require__(237)
var validate = __webpack_require__(39)
var objectAssign = __webpack_require__(89)
var wideTruncate = __webpack_require__(90)
var error = __webpack_require__(241)
var TemplateItem = __webpack_require__(242)

function renderValueWithValues (values) {
  return function (item) {
    return renderValue(item, values)
  }
}

var renderTemplate = module.exports = function (width, template, values) {
  var items = prepareItems(width, template, values)
  var rendered = items.map(renderValueWithValues(values)).join('')
  return align.left(wideTruncate(rendered, width), width)
}

function preType (item) {
  var cappedTypeName = item.type[0].toUpperCase() + item.type.slice(1)
  return 'pre' + cappedTypeName
}

function postType (item) {
  var cappedTypeName = item.type[0].toUpperCase() + item.type.slice(1)
  return 'post' + cappedTypeName
}

function hasPreOrPost (item, values) {
  if (!item.type) return
  return values[preType(item)] || values[postType(item)]
}

function generatePreAndPost (baseItem, parentValues) {
  var item = objectAssign({}, baseItem)
  var values = Object.create(parentValues)
  var template = []
  var pre = preType(item)
  var post = postType(item)
  if (values[pre]) {
    template.push({value: values[pre]})
    values[pre] = null
  }
  item.minLength = null
  item.length = null
  item.maxLength = null
  template.push(item)
  values[item.type] = values[item.type]
  if (values[post]) {
    template.push({value: values[post]})
    values[post] = null
  }
  return function ($1, $2, length) {
    return renderTemplate(length, template, values)
  }
}

function prepareItems (width, template, values) {
  function cloneAndObjectify (item, index, arr) {
    var cloned = new TemplateItem(item, width)
    var type = cloned.type
    if (cloned.value == null) {
      if (!(type in values)) {
        if (cloned.default == null) {
          throw new error.MissingTemplateValue(cloned, values)
        } else {
          cloned.value = cloned.default
        }
      } else {
        cloned.value = values[type]
      }
    }
    if (cloned.value == null || cloned.value === '') return null
    cloned.index = index
    cloned.first = index === 0
    cloned.last = index === arr.length - 1
    if (hasPreOrPost(cloned, values)) cloned.value = generatePreAndPost(cloned, values)
    return cloned
  }

  var output = template.map(cloneAndObjectify).filter(function (item) { return item != null })

  var outputLength = 0
  var remainingSpace = width
  var variableCount = output.length

  function consumeSpace (length) {
    if (length > remainingSpace) length = remainingSpace
    outputLength += length
    remainingSpace -= length
  }

  function finishSizing (item, length) {
    if (item.finished) throw new error.Internal('Tried to finish template item that was already finished')
    if (length === Infinity) throw new error.Internal('Length of template item cannot be infinity')
    if (length != null) item.length = length
    item.minLength = null
    item.maxLength = null
    --variableCount
    item.finished = true
    if (item.length == null) item.length = item.getBaseLength()
    if (item.length == null) throw new error.Internal('Finished template items must have a length')
    consumeSpace(item.getLength())
  }

  output.forEach(function (item) {
    if (!item.kerning) return
    var prevPadRight = item.first ? 0 : output[item.index - 1].padRight
    if (!item.first && prevPadRight < item.kerning) item.padLeft = item.kerning - prevPadRight
    if (!item.last) item.padRight = item.kerning
  })

  // Finish any that have a fixed (literal or intuited) length
  output.forEach(function (item) {
    if (item.getBaseLength() == null) return
    finishSizing(item)
  })

  var resized = 0
  var resizing
  var hunkSize
  do {
    resizing = false
    hunkSize = Math.round(remainingSpace / variableCount)
    output.forEach(function (item) {
      if (item.finished) return
      if (!item.maxLength) return
      if (item.getMaxLength() < hunkSize) {
        finishSizing(item, item.maxLength)
        resizing = true
      }
    })
  } while (resizing && resized++ < output.length)
  if (resizing) throw new error.Internal('Resize loop iterated too many times while determining maxLength')

  resized = 0
  do {
    resizing = false
    hunkSize = Math.round(remainingSpace / variableCount)
    output.forEach(function (item) {
      if (item.finished) return
      if (!item.minLength) return
      if (item.getMinLength() >= hunkSize) {
        finishSizing(item, item.minLength)
        resizing = true
      }
    })
  } while (resizing && resized++ < output.length)
  if (resizing) throw new error.Internal('Resize loop iterated too many times while determining minLength')

  hunkSize = Math.round(remainingSpace / variableCount)
  output.forEach(function (item) {
    if (item.finished) return
    finishSizing(item, hunkSize)
  })

  return output
}

function renderFunction (item, values, length) {
  validate('OON', arguments)
  if (item.type) {
    return item.value(values, values[item.type + 'Theme'] || {}, length)
  } else {
    return item.value(values, {}, length)
  }
}

function renderValue (item, values) {
  var length = item.getBaseLength()
  var value = typeof item.value === 'function' ? renderFunction(item, values, length) : item.value
  if (value == null || value === '') return ''
  var alignWith = align[item.align] || align.left
  var leftPadding = item.padLeft ? align.left('', item.padLeft) : ''
  var rightPadding = item.padRight ? align.right('', item.padRight) : ''
  var truncated = wideTruncate(String(value), length)
  var aligned = alignWith(truncated, length)
  return leftPadding + aligned + rightPadding
}


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable babel/new-cap, xo/throw-new-error */

module.exports = function (str, pos) {
	if (str === null || str === undefined) {
		throw TypeError();
	}

	str = String(str);

	var size = str.length;
	var i = pos ? Number(pos) : 0;

	if (Number.isNaN(i)) {
		i = 0;
	}

	if (i < 0 || i >= size) {
		return undefined;
	}

	var first = str.charCodeAt(i);

	if (first >= 0xD800 && first <= 0xDBFF && size > i + 1) {
		var second = str.charCodeAt(i + 1);

		if (second >= 0xDC00 && second <= 0xDFFF) {
			return ((first - 0xD800) * 0x400) + second - 0xDC00 + 0x10000;
		}
	}

	return first;
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var numberIsNan = __webpack_require__(240);

module.exports = function (x) {
	if (numberIsNan(x)) {
		return false;
	}

	// https://github.com/nodejs/io.js/blob/cff7300a578be1b10001f2d967aaedc88aee6402/lib/readline.js#L1369

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (x >= 0x1100 && (
		x <= 0x115f ||  // Hangul Jamo
		0x2329 === x || // LEFT-POINTING ANGLE BRACKET
		0x232a === x || // RIGHT-POINTING ANGLE BRACKET
		// CJK Radicals Supplement .. Enclosed CJK Letters and Months
		(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
		// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
		0x3250 <= x && x <= 0x4dbf ||
		// CJK Unified Ideographs .. Yi Radicals
		0x4e00 <= x && x <= 0xa4c6 ||
		// Hangul Jamo Extended-A
		0xa960 <= x && x <= 0xa97c ||
		// Hangul Syllables
		0xac00 <= x && x <= 0xd7a3 ||
		// CJK Compatibility Ideographs
		0xf900 <= x && x <= 0xfaff ||
		// Vertical Forms
		0xfe10 <= x && x <= 0xfe19 ||
		// CJK Compatibility Forms .. Small Form Variants
		0xfe30 <= x && x <= 0xfe6b ||
		// Halfwidth and Fullwidth Forms
		0xff01 <= x && x <= 0xff60 ||
		0xffe0 <= x && x <= 0xffe6 ||
		// Kana Supplement
		0x1b000 <= x && x <= 0x1b001 ||
		// Enclosed Ideographic Supplement
		0x1f200 <= x && x <= 0x1f251 ||
		// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
		0x20000 <= x && x <= 0x3fffd)) {
		return true;
	}

	return false;
}


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stringWidth = __webpack_require__(40)
var stripAnsi = __webpack_require__(91)

module.exports = wideTruncate

function wideTruncate (str, target) {
  if (stringWidth(str) === 0) return str
  if (target <= 0) return ''
  if (stringWidth(str) <= target) return str

  // We compute the number of bytes of ansi sequences here and add
  // that to our initial truncation to ensure that we don't slice one
  // that we want to keep in half.
  var noAnsi = stripAnsi(str)
  var ansiSize = str.length + noAnsi.length
  var truncated = str.slice(0, target + ansiSize)

  // we have to shrink the result to account for our ansi sequence buffer
  // (if an ansi sequence was truncated) and double width characters.
  while (stringWidth(truncated) > target) {
    truncated = truncated.slice(0, -1)
  }
  return truncated
}


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(15)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// this exists so we can replace it during testing
module.exports = process


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const PromiseWithProgress = __webpack_require__(94)

const stylize_string = __webpack_require__(14)

const prettyjson = __webpack_require__(20)
function prettify_json(data, options) {
	return prettyjson.render(data, options)
}

// https://github.com/sindresorhus/indent-string
const indent_string_bad = __webpack_require__(38);
function indent_string(msg, indentation, options = {}) {
	let result = indent_string_bad(msg, indentation, options)

	if (!options || !options.indent || options.indent === ' ')
		return result

	const indent_str = Array(indentation).fill(options.indent).join('')
	const lines = result.split('\n')
	return lines
		.map(line => line.startsWith(indent_str) ? line : indent_str + line)
		.join('\n')
}

// https://github.com/AnAppAMonth/linewrap
const linewrap = __webpack_require__(83)
function wrap_string(s, size) {
	return linewrap(size, {skipScheme: 'ansi-color'})(s)
}


// https://github.com/sindresorhus/boxen
const boxen = __webpack_require__(76)
const enclose_in_box = boxen



// https://github.com/nexdrew/ansi-align


////////////

module.exports = {
	PromiseWithProgress,
	stylize_string,
	prettify_json,
	indent_string,
	wrap_string,
	enclose_in_box,
}


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const pMap = __webpack_require__(252);

const sum = iterable => {
	let total = 0;

	for (const value of iterable.values()) {
		total += value;
	}

	return total;
};

class PProgress extends Promise {
	static fn(input) {
		return (...args) => {
			return new PProgress((resolve, reject, progress) => {
				args.push(progress);
				input(...args).then(resolve, reject);
			});
		};
	}

	static all(promises, options) {
		return PProgress.fn(progress => {
			const progressMap = new Map();
			const iterator = promises[Symbol.iterator]();

			const reportProgress = () => {
				progress(sum(progressMap) / promises.length);
			};

			const mapper = async () => {
				const promise = iterator.next().value;
				progressMap.set(promise, 0);

				if (promise instanceof PProgress) {
					promise.onProgress(percentage => {
						progressMap.set(promise, percentage);
						reportProgress();
					});
				}

				const value = await promise;
				progressMap.set(promise, 1);
				reportProgress();
				return value;
			};

			// TODO: This is kinda ugly. Find a better way to do this.
			// Maybe `p-map` could accept a number as the first argument?
			return pMap(new Array(promises.length), mapper, options);
		})();
	}

	constructor(executor) {
		const progressFn = progress => {
			if (progress > 1 || progress < 0) {
				throw new TypeError('The progress percentage should be a number between 0 and 1');
			}

			// We run this in the next microtask tick so `super` is called before we use `this`
			Promise.resolve().then(() => {
				if (progress === this._progress) {
					return;
				} else if (progress < this._progress) {
					throw new Error('The progress percentage can\'t be lower than the last progress event');
				}

				this._progress = progress;

				for (const listener of this._listeners) {
					listener(progress);
				}
			});
		};

		super((resolve, reject) => {
			executor(
				value => {
					progressFn(1);
					resolve(value);
				},
				reject,
				progress => {
					if (progress !== 1) {
						progressFn(progress);
					}
				}
			);
		});

		this._listeners = new Set();
		this._progressFn = progressFn;
		this._progress = 0;
	}

	get progress() {
		return this._progress;
	}

	onProgress(cb) {
		if (typeof cb !== 'function') {
			throw new TypeError(`Expected a \`Function\`, got \`${typeof cb}\``);
		}

		this._listeners.add(cb);
		return this;
	}
}

module.exports = PProgress;


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const PromiseWithProgress = __webpack_require__(94)

const stylize_string = __webpack_require__(14)

const prettyjson = __webpack_require__(20)
function prettify_json(data, options) {
	return prettyjson.render(data, options)
}

// https://github.com/sindresorhus/indent-string
const indent_string_bad = __webpack_require__(38);
function indent_string(msg, indentation, options = {}) {
	let result = indent_string_bad(msg, indentation, options)

	if (!options || !options.indent || options.indent === ' ')
		return result

	const indent_str = Array(indentation).fill(options.indent).join('')
	const lines = result.split('\n')
	return lines
		.map(line => line.startsWith(indent_str) ? line : indent_str + line)
		.join('\n')
}

////////////

module.exports = {
	PromiseWithProgress,
	stylize_string,
	prettify_json,
	indent_string,
}


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RichText = __webpack_require__(3);
function render_monster(m) {
    const $doc = RichText.span()
        .addClass('monster', 'monster--rank--' + m.rank)
        .pushText('{{level}} {{rank}} {{name||Capitalize}}')
        .pushRawNode(RichText.span().pushText('L').pushText('' + m.level).done(), 'level')
        .pushRawNode(RichText.span().addClass('rank--' + m.rank).pushText(m.rank).done(), 'rank')
        .pushRawNode(RichText.span().addClass('monster__name').pushText(m.name).done(), 'name')
        .done();
    $doc.$hints.possible_emoji = m.possible_emoji;
    return $doc;
}
exports.render_monster = render_monster;
//# sourceMappingURL=monster.js.map

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/////////////////////////////////////////////////
// node <8 zone
var loadJsonFile = __webpack_require__(98)
var PACKAGE_JSON_PATH = __webpack_require__(5).join('.', 'package.json')
var package_json = loadJsonFile.sync(PACKAGE_JSON_PATH)
var semver = __webpack_require__(109)
if (!semver.satisfies(process.version, package_json.engines.node)) {
	console.error('ERROR: Invalid node, must be: ' + package_json.engines.node + '!\n')
	process.exit(3)
}

/////////////////////////////////////////////////

const Conf = __webpack_require__(46)
const { create_game_instance } = __webpack_require__(22)

const { SEC, init_savegame } = __webpack_require__(155)
const { start_loop } = __webpack_require__(214)

/////////////////////////////////////////////////

SEC.xPromiseTryCatch('starting', async ({ SEC, logger }) => {
	const MINIMAL_TERMINAL_WIDTH = 80

	const verbose = false // XXX
	if (verbose) {
		logger.setLevel('verbose')
		logger.verbose('verbose mode activated')
	}

	const { version } = package_json
	const options = {
		version,
		verbose,
		is_interactive: true,
		may_clear_screen: true,
		term_width: MINIMAL_TERMINAL_WIDTH,
	}
	options.is_interactive = !!process.stdout.isTTY // TODO read params also
	//options.is_interactive = false
	options.may_clear_screen = options.is_interactive
	options.config = new Conf({
		configName: 'state',
		defaults: {},
	})
	logger.verbose(`config path: "${options.config.path}"`)
	logger.trace('loaded state:', {state: options.config.store})

	/////////////////////////////////////////////////

	const instance = create_game_instance({
		SEC,
		get_latest_state: () => options.config.store,
		update_state: state => options.config.set(state),
	})

	/////////////////////////////////////////////////

	if (options.is_interactive) {
		return start_loop(SEC, options, instance)
			.then(() => console.log('Quitting...'))
	}

	/////////////////////////////////////////////////

	if (!options.is_interactive) {
		throw new Error('Non-interactive mode or non-tty terminals are not supported at this time, sorry!')
		//instance.play()
	}

//console.log('\n---------------------------------------------------------------\n')

})


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(5);
const fs = __webpack_require__(99);
const stripBom = __webpack_require__(103);
const parseJson = __webpack_require__(104);
const pify = __webpack_require__(108);

const parse = (data, fp) => parseJson(stripBom(data), path.relative('.', fp));

module.exports = fp => pify(fs.readFile)(fp, 'utf8').then(data => parse(data, fp));
module.exports.sync = fp => parse(fs.readFileSync(fp, 'utf8'), fp);


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(6)
var polyfills = __webpack_require__(100)
var legacy = __webpack_require__(102)
var queue = []

var util = __webpack_require__(16)

function noop () {}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
  process.on('exit', function() {
    debug(queue)
    __webpack_require__(45).equal(queue.length, 0)
  })
}

module.exports = patch(__webpack_require__(43))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {
  module.exports = patch(fs)
}

// Always patch fs.close/closeSync, because we want to
// retry() whenever a close happens *anywhere* in the program.
// This is essential when multiple graceful-fs instances are
// in play at the same time.
module.exports.close =
fs.close = (function (fs$close) { return function (fd, cb) {
  return fs$close.call(fs, fd, function (err) {
    if (!err)
      retry()

    if (typeof cb === 'function')
      cb.apply(this, arguments)
  })
}})(fs.close)

module.exports.closeSync =
fs.closeSync = (function (fs$closeSync) { return function (fd) {
  // Note that graceful-fs also retries when fs.closeSync() fails.
  // Looks like a bug to me, although it's probably a harmless one.
  var rval = fs$closeSync.apply(fs, arguments)
  retry()
  return rval
}})(fs.closeSync)

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch
  fs.FileReadStream = ReadStream;  // Legacy name.
  fs.FileWriteStream = WriteStream;  // Legacy name.
  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  ReadStream.prototype = Object.create(fs$ReadStream.prototype)
  ReadStream.prototype.open = ReadStream$open

  var fs$WriteStream = fs.WriteStream
  WriteStream.prototype = Object.create(fs$WriteStream.prototype)
  WriteStream.prototype.open = WriteStream$open

  fs.ReadStream = ReadStream
  fs.WriteStream = WriteStream

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  queue.push(elem)
}

function retry () {
  var elem = queue.shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(43)
var constants = __webpack_require__(101)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

var chdir = process.chdir
process.chdir = function(d) {
  cwd = null
  chdir.call(process, d)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {
    var callback
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0
      callback = function (er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          return fs$read.call(fs, fd, buffer, offset, length, position, callback)
        }
        callback_.apply(this, arguments)
      }
    }
    return fs$read.call(fs, fd, buffer, offset, length, position, callback)
  }})(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)
}

function patchLchmod (fs) {
  fs.lchmod = function (path, mode, callback) {
    fs.open( path
           , constants.O_WRONLY | constants.O_SYMLINK
           , mode
           , function (err, fd) {
      if (err) {
        if (callback) callback(err)
        return
      }
      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      fs.fchmod(fd, mode, function (err) {
        fs.close(fd, function(err2) {
          if (callback) callback(err || err2)
        })
      })
    })
  }

  fs.lchmodSync = function (path, mode) {
    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

    // prefer to return the chmod error, if one occurs,
    // but still try to close, and report closing errors if they occur.
    var threw = true
    var ret
    try {
      ret = fs.fchmodSync(fd, mode)
      threw = false
    } finally {
      if (threw) {
        try {
          fs.closeSync(fd)
        } catch (er) {}
      } else {
        fs.closeSync(fd)
      }
    }
    return ret
  }
}

function patchLutimes (fs) {
  if (constants.hasOwnProperty("O_SYMLINK")) {
    fs.lutimes = function (path, at, mt, cb) {
      fs.open(path, constants.O_SYMLINK, function (er, fd) {
        if (er) {
          if (cb) cb(er)
          return
        }
        fs.futimes(fd, at, mt, function (er) {
          fs.close(fd, function (er2) {
            if (cb) cb(er || er2)
          })
        })
      })
    }

    fs.lutimesSync = function (path, at, mt) {
      var fd = fs.openSync(path, constants.O_SYMLINK)
      var ret
      var threw = true
      try {
        ret = fs.futimesSync(fd, at, mt)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }

  } else {
    fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
    fs.lutimesSync = function () {}
  }
}

function chmodFix (orig) {
  if (!orig) return orig
  return function (target, mode, cb) {
    return orig.call(fs, target, mode, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chmodFixSync (orig) {
  if (!orig) return orig
  return function (target, mode) {
    try {
      return orig.call(fs, target, mode)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function chownFix (orig) {
  if (!orig) return orig
  return function (target, uid, gid, cb) {
    return orig.call(fs, target, uid, gid, function (er) {
      if (chownErOk(er)) er = null
      if (cb) cb.apply(this, arguments)
    })
  }
}

function chownFixSync (orig) {
  if (!orig) return orig
  return function (target, uid, gid) {
    try {
      return orig.call(fs, target, uid, gid)
    } catch (er) {
      if (!chownErOk(er)) throw er
    }
  }
}


function statFix (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target, cb) {
    return orig.call(fs, target, function (er, stats) {
      if (!stats) return cb.apply(this, arguments)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      if (cb) cb.apply(this, arguments)
    })
  }
}

function statFixSync (orig) {
  if (!orig) return orig
  // Older versions of Node erroneously returned signed integers for
  // uid + gid.
  return function (target) {
    var stats = orig.call(fs, target)
    if (stats.uid < 0) stats.uid += 0x100000000
    if (stats.gid < 0) stats.gid += 0x100000000
    return stats;
  }
}

// ENOSYS means that the fs doesn't support the op. Just ignore
// that, because it doesn't matter.
//
// if there's no getuid, or if getuid() is something other
// than 0, and the error is EINVAL or EPERM, then just ignore
// it.
//
// This specific case is a silent failure in cp, install, tar,
// and most other unix tools that manage permissions.
//
// When running as root, or if other types of errors are
// encountered, then it's strict.
function chownErOk (er) {
  if (!er)
    return true

  if (er.code === "ENOSYS")
    return true

  var nonroot = !process.getuid || process.getuid() !== 0
  if (nonroot) {
    if (er.code === "EINVAL" || er.code === "EPERM")
      return true
  }

  return false
}


/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = require("constants");

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(44).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = x => {
	if (typeof x !== 'string') {
		throw new TypeError('Expected a string, got ' + typeof x);
	}

	// Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
	// conversion translates it to FEFF (UTF-16 BOM)
	if (x.charCodeAt(0) === 0xFEFF) {
		return x.slice(1);
	}

	return x;
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const errorEx = __webpack_require__(105);
const fallback = __webpack_require__(107);

const JSONError = errorEx('JSONError', {
	fileName: errorEx.append('in %s')
});

module.exports = (input, reviver, filename) => {
	if (typeof reviver === 'string') {
		filename = reviver;
		reviver = null;
	}

	try {
		try {
			return JSON.parse(input, reviver);
		} catch (err) {
			fallback(input, reviver);

			throw err;
		}
	} catch (err) {
		err.message = err.message.replace(/\n/g, '');

		const jsonErr = new JSONError(err);
		if (filename) {
			jsonErr.fileName = filename;
		}

		throw jsonErr;
	}
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(16);
var isArrayish = __webpack_require__(106);

var errorEx = function errorEx(name, properties) {
	if (!name || name.constructor !== String) {
		properties = name || {};
		name = Error.name;
	}

	var errorExError = function ErrorEXError(message) {
		if (!this) {
			return new ErrorEXError(message);
		}

		message = message instanceof Error
			? message.message
			: (message || this.message);

		Error.call(this, message);
		Error.captureStackTrace(this, errorExError);

		this.name = name;

		Object.defineProperty(this, 'message', {
			configurable: true,
			enumerable: false,
			get: function () {
				var newMessage = message.split(/\r?\n/g);

				for (var key in properties) {
					if (!properties.hasOwnProperty(key)) {
						continue;
					}

					var modifier = properties[key];

					if ('message' in modifier) {
						newMessage = modifier.message(this[key], newMessage) || newMessage;
						if (!isArrayish(newMessage)) {
							newMessage = [newMessage];
						}
					}
				}

				return newMessage.join('\n');
			},
			set: function (v) {
				message = v;
			}
		});

		var stackDescriptor = Object.getOwnPropertyDescriptor(this, 'stack');
		var stackGetter = stackDescriptor.get;
		var stackValue = stackDescriptor.value;
		delete stackDescriptor.value;
		delete stackDescriptor.writable;

		stackDescriptor.get = function () {
			var stack = (stackGetter)
				? stackGetter.call(this).split(/\r?\n+/g)
				: stackValue.split(/\r?\n+/g);

			// starting in Node 7, the stack builder caches the message.
			// just replace it.
			stack[0] = this.name + ': ' + this.message;

			var lineCount = 1;
			for (var key in properties) {
				if (!properties.hasOwnProperty(key)) {
					continue;
				}

				var modifier = properties[key];

				if ('line' in modifier) {
					var line = modifier.line(this[key]);
					if (line) {
						stack.splice(lineCount++, 0, '    ' + line);
					}
				}

				if ('stack' in modifier) {
					modifier.stack(this[key], stack);
				}
			}

			return stack.join('\n');
		};

		Object.defineProperty(this, 'stack', stackDescriptor);
	};

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(errorExError.prototype, Error.prototype);
		Object.setPrototypeOf(errorExError, Error);
	} else {
		util.inherits(errorExError, Error);
	}

	return errorExError;
};

errorEx.append = function (str, def) {
	return {
		message: function (v, message) {
			v = v || def;

			if (v) {
				message[0] += ' ' + str.replace('%s', v.toString());
			}

			return message;
		}
	};
};

errorEx.line = function (str, def) {
	return {
		line: function (v) {
			v = v || def;

			if (v) {
				return str.replace('%s', v.toString());
			}

			return null;
		}
	};
};

module.exports = errorEx;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isArrayish(obj) {
	if (!obj) {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && obj.splice instanceof Function);
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = parseJson
function parseJson (txt, reviver, context) {
  context = context || 20
  try {
    return JSON.parse(txt, reviver)
  } catch (e) {
    const syntaxErr = e.message.match(/^Unexpected token.*position\s+(\d+)/i)
    const errIdx = syntaxErr
    ? +syntaxErr[1]
    : e.message.match(/^Unexpected end of JSON.*/i)
    ? txt.length - 1
    : null
    if (errIdx != null) {
      const start = errIdx <= context
      ? 0
      : errIdx - context
      const end = errIdx + context >= txt.length
      ? txt.length
      : errIdx + context
      e.message += ` while parsing near '${
        start === 0 ? '' : '...'
      }${txt.slice(start, end)}${
        end === txt.length ? '' : '...'
      }'`
    } else {
      e.message += ` while parsing '${txt.slice(0, context * 2)}'`
    }
    throw e
  }
}


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const processFn = (fn, opts) => function () {
	const P = opts.promiseModule;
	const args = new Array(arguments.length);

	for (let i = 0; i < arguments.length; i++) {
		args[i] = arguments[i];
	}

	return new P((resolve, reject) => {
		if (opts.errorFirst) {
			args.push(function (err, result) {
				if (opts.multiArgs) {
					const results = new Array(arguments.length - 1);

					for (let i = 1; i < arguments.length; i++) {
						results[i - 1] = arguments[i];
					}

					if (err) {
						results.unshift(err);
						reject(results);
					} else {
						resolve(results);
					}
				} else if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		} else {
			args.push(function (result) {
				if (opts.multiArgs) {
					const results = new Array(arguments.length - 1);

					for (let i = 0; i < arguments.length; i++) {
						results[i] = arguments[i];
					}

					resolve(results);
				} else {
					resolve(result);
				}
			});
		}

		fn.apply(this, args);
	});
};

module.exports = (obj, opts) => {
	opts = Object.assign({
		exclude: [/.+(Sync|Stream)$/],
		errorFirst: true,
		promiseModule: Promise
	}, opts);

	const filter = key => {
		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);
		return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
	};

	let ret;
	if (typeof obj === 'function') {
		ret = function () {
			if (opts.excludeMain) {
				return obj.apply(this, arguments);
			}

			return processFn(obj, opts).apply(this, arguments);
		};
	} else {
		ret = Object.create(Object.getPrototypeOf(obj));
	}

	for (const key in obj) { // eslint-disable-line guard-for-in
		const x = obj[key];
		ret[key] = typeof x === 'function' && filter(key) ? processFn(x, opts) : x;
	}

	return ret;
};


/***/ }),
/* 109 */
/***/ (function(module, exports) {

exports = module.exports = SemVer;

// The debug function is excluded entirely from the minified version.
/* nomin */ var debug;
/* nomin */ if (typeof process === 'object' &&
    /* nomin */ process.env &&
    /* nomin */ process.env.NODE_DEBUG &&
    /* nomin */ /\bsemver\b/i.test(process.env.NODE_DEBUG))
  /* nomin */ debug = function() {
    /* nomin */ var args = Array.prototype.slice.call(arguments, 0);
    /* nomin */ args.unshift('SEMVER');
    /* nomin */ console.log.apply(console, args);
    /* nomin */ };
/* nomin */ else
  /* nomin */ debug = function() {};

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0';

var MAX_LENGTH = 256;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

// The actual regexps go on exports.re
var re = exports.re = [];
var src = exports.src = [];
var R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
var NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';


// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

var MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

var PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

var PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++;
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

var LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

var GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
var XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';

var XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

var XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

var XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
var XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

var TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
var tildeTrimReplace = '$1~';

var TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
var TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++;
src[LONECARET] = '(?:\\^)';

var CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
var caretTrimReplace = '$1^';

var CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
var CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
var COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
var comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

var HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
var STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}

exports.parse = parse;
function parse(version, loose) {
  if (version instanceof SemVer)
    return version;

  if (typeof version !== 'string')
    return null;

  if (version.length > MAX_LENGTH)
    return null;

  var r = loose ? re[LOOSE] : re[FULL];
  if (!r.test(version))
    return null;

  try {
    return new SemVer(version, loose);
  } catch (er) {
    return null;
  }
}

exports.valid = valid;
function valid(version, loose) {
  var v = parse(version, loose);
  return v ? v.version : null;
}


exports.clean = clean;
function clean(version, loose) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), loose);
  return s ? s.version : null;
}

exports.SemVer = SemVer;

function SemVer(version, loose) {
  if (version instanceof SemVer) {
    if (version.loose === loose)
      return version;
    else
      version = version.version;
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version);
  }

  if (version.length > MAX_LENGTH)
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')

  if (!(this instanceof SemVer))
    return new SemVer(version, loose);

  debug('SemVer', version, loose);
  this.loose = loose;
  var m = version.trim().match(loose ? re[LOOSE] : re[FULL]);

  if (!m)
    throw new TypeError('Invalid Version: ' + version);

  this.raw = version;

  // these are actually numbers
  this.major = +m[1];
  this.minor = +m[2];
  this.patch = +m[3];

  if (this.major > MAX_SAFE_INTEGER || this.major < 0)
    throw new TypeError('Invalid major version')

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0)
    throw new TypeError('Invalid minor version')

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0)
    throw new TypeError('Invalid patch version')

  // numberify any prerelease numeric ids
  if (!m[4])
    this.prerelease = [];
  else
    this.prerelease = m[4].split('.').map(function(id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id;
        if (num >= 0 && num < MAX_SAFE_INTEGER)
          return num;
      }
      return id;
    });

  this.build = m[5] ? m[5].split('.') : [];
  this.format();
}

SemVer.prototype.format = function() {
  this.version = this.major + '.' + this.minor + '.' + this.patch;
  if (this.prerelease.length)
    this.version += '-' + this.prerelease.join('.');
  return this.version;
};

SemVer.prototype.toString = function() {
  return this.version;
};

SemVer.prototype.compare = function(other) {
  debug('SemVer.compare', this.version, this.loose, other);
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return this.compareMain(other) || this.comparePre(other);
};

SemVer.prototype.compareMain = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch);
};

SemVer.prototype.comparePre = function(other) {
  if (!(other instanceof SemVer))
    other = new SemVer(other, this.loose);

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length)
    return -1;
  else if (!this.prerelease.length && other.prerelease.length)
    return 1;
  else if (!this.prerelease.length && !other.prerelease.length)
    return 0;

  var i = 0;
  do {
    var a = this.prerelease[i];
    var b = other.prerelease[i];
    debug('prerelease compare', i, a, b);
    if (a === undefined && b === undefined)
      return 0;
    else if (b === undefined)
      return 1;
    else if (a === undefined)
      return -1;
    else if (a === b)
      continue;
    else
      return compareIdentifiers(a, b);
  } while (++i);
};

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function(release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc('pre', identifier);
      break;
    case 'preminor':
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc('pre', identifier);
      break;
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0;
      this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0)
        this.inc('patch', identifier);
      this.inc('pre', identifier);
      break;

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0)
        this.major++;
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0)
        this.minor++;
      this.patch = 0;
      this.prerelease = [];
      break;
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0)
        this.patch++;
      this.prerelease = [];
      break;
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0)
        this.prerelease = [0];
      else {
        var i = this.prerelease.length;
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++;
            i = -2;
          }
        }
        if (i === -1) // didn't increment anything
          this.prerelease.push(0);
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1]))
            this.prerelease = [identifier, 0];
        } else
          this.prerelease = [identifier, 0];
      }
      break;

    default:
      throw new Error('invalid increment argument: ' + release);
  }
  this.format();
  this.raw = this.version;
  return this;
};

exports.inc = inc;
function inc(version, release, loose, identifier) {
  if (typeof(loose) === 'string') {
    identifier = loose;
    loose = undefined;
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version;
  } catch (er) {
    return null;
  }
}

exports.diff = diff;
function diff(version1, version2) {
  if (eq(version1, version2)) {
    return null;
  } else {
    var v1 = parse(version1);
    var v2 = parse(version2);
    if (v1.prerelease.length || v2.prerelease.length) {
      for (var key in v1) {
        if (key === 'major' || key === 'minor' || key === 'patch') {
          if (v1[key] !== v2[key]) {
            return 'pre'+key;
          }
        }
      }
      return 'prerelease';
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return key;
        }
      }
    }
  }
}

exports.compareIdentifiers = compareIdentifiers;

var numeric = /^[0-9]+$/;
function compareIdentifiers(a, b) {
  var anum = numeric.test(a);
  var bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;
}

exports.rcompareIdentifiers = rcompareIdentifiers;
function rcompareIdentifiers(a, b) {
  return compareIdentifiers(b, a);
}

exports.major = major;
function major(a, loose) {
  return new SemVer(a, loose).major;
}

exports.minor = minor;
function minor(a, loose) {
  return new SemVer(a, loose).minor;
}

exports.patch = patch;
function patch(a, loose) {
  return new SemVer(a, loose).patch;
}

exports.compare = compare;
function compare(a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose));
}

exports.compareLoose = compareLoose;
function compareLoose(a, b) {
  return compare(a, b, true);
}

exports.rcompare = rcompare;
function rcompare(a, b, loose) {
  return compare(b, a, loose);
}

exports.sort = sort;
function sort(list, loose) {
  return list.sort(function(a, b) {
    return exports.compare(a, b, loose);
  });
}

exports.rsort = rsort;
function rsort(list, loose) {
  return list.sort(function(a, b) {
    return exports.rcompare(a, b, loose);
  });
}

exports.gt = gt;
function gt(a, b, loose) {
  return compare(a, b, loose) > 0;
}

exports.lt = lt;
function lt(a, b, loose) {
  return compare(a, b, loose) < 0;
}

exports.eq = eq;
function eq(a, b, loose) {
  return compare(a, b, loose) === 0;
}

exports.neq = neq;
function neq(a, b, loose) {
  return compare(a, b, loose) !== 0;
}

exports.gte = gte;
function gte(a, b, loose) {
  return compare(a, b, loose) >= 0;
}

exports.lte = lte;
function lte(a, b, loose) {
  return compare(a, b, loose) <= 0;
}

exports.cmp = cmp;
function cmp(a, op, b, loose) {
  var ret;
  switch (op) {
    case '===':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a === b;
      break;
    case '!==':
      if (typeof a === 'object') a = a.version;
      if (typeof b === 'object') b = b.version;
      ret = a !== b;
      break;
    case '': case '=': case '==': ret = eq(a, b, loose); break;
    case '!=': ret = neq(a, b, loose); break;
    case '>': ret = gt(a, b, loose); break;
    case '>=': ret = gte(a, b, loose); break;
    case '<': ret = lt(a, b, loose); break;
    case '<=': ret = lte(a, b, loose); break;
    default: throw new TypeError('Invalid operator: ' + op);
  }
  return ret;
}

exports.Comparator = Comparator;
function Comparator(comp, loose) {
  if (comp instanceof Comparator) {
    if (comp.loose === loose)
      return comp;
    else
      comp = comp.value;
  }

  if (!(this instanceof Comparator))
    return new Comparator(comp, loose);

  debug('comparator', comp, loose);
  this.loose = loose;
  this.parse(comp);

  if (this.semver === ANY)
    this.value = '';
  else
    this.value = this.operator + this.semver.version;

  debug('comp', this);
}

var ANY = {};
Comparator.prototype.parse = function(comp) {
  var r = this.loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var m = comp.match(r);

  if (!m)
    throw new TypeError('Invalid comparator: ' + comp);

  this.operator = m[1];
  if (this.operator === '=')
    this.operator = '';

  // if it literally is just '>' or '' then allow anything.
  if (!m[2])
    this.semver = ANY;
  else
    this.semver = new SemVer(m[2], this.loose);
};

Comparator.prototype.toString = function() {
  return this.value;
};

Comparator.prototype.test = function(version) {
  debug('Comparator.test', version, this.loose);

  if (this.semver === ANY)
    return true;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  return cmp(version, this.operator, this.semver, this.loose);
};

Comparator.prototype.intersects = function(comp, loose) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required');
  }

  var rangeTmp;

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, loose);
    return satisfies(this.value, rangeTmp, loose);
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, loose);
    return satisfies(comp.semver, rangeTmp, loose);
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>');
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<');
  var sameSemVer = this.semver.version === comp.semver.version;
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=');
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, loose) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'));
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, loose) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'));

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
};


exports.Range = Range;
function Range(range, loose) {
  if (range instanceof Range) {
    if (range.loose === loose) {
      return range;
    } else {
      return new Range(range.raw, loose);
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, loose);
  }

  if (!(this instanceof Range))
    return new Range(range, loose);

  this.loose = loose;

  // First, split based on boolean or ||
  this.raw = range;
  this.set = range.split(/\s*\|\|\s*/).map(function(range) {
    return this.parseRange(range.trim());
  }, this).filter(function(c) {
    // throw out any that are not relevant for whatever reason
    return c.length;
  });

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range);
  }

  this.format();
}

Range.prototype.format = function() {
  this.range = this.set.map(function(comps) {
    return comps.join(' ').trim();
  }).join('||').trim();
  return this.range;
};

Range.prototype.toString = function() {
  return this.range;
};

Range.prototype.parseRange = function(range) {
  var loose = this.loose;
  range = range.trim();
  debug('range', range, loose);
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE];
  range = range.replace(hr, hyphenReplace);
  debug('hyphen replace', range);
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace);
  debug('comparator trim', range, re[COMPARATORTRIM]);

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace);

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace);

  // normalize spaces
  range = range.split(/\s+/).join(' ');

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR];
  var set = range.split(' ').map(function(comp) {
    return parseComparator(comp, loose);
  }).join(' ').split(/\s+/);
  if (this.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function(comp) {
      return !!comp.match(compRe);
    });
  }
  set = set.map(function(comp) {
    return new Comparator(comp, loose);
  });

  return set;
};

Range.prototype.intersects = function(range, loose) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required');
  }

  return this.set.some(function(thisComparators) {
    return thisComparators.every(function(thisComparator) {
      return range.set.some(function(rangeComparators) {
        return rangeComparators.every(function(rangeComparator) {
          return thisComparator.intersects(rangeComparator, loose);
        });
      });
    });
  });
};

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators;
function toComparators(range, loose) {
  return new Range(range, loose).set.map(function(comp) {
    return comp.map(function(c) {
      return c.value;
    }).join(' ').trim().split(' ');
  });
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator(comp, loose) {
  debug('comp', comp);
  comp = replaceCarets(comp, loose);
  debug('caret', comp);
  comp = replaceTildes(comp, loose);
  debug('tildes', comp);
  comp = replaceXRanges(comp, loose);
  debug('xrange', comp);
  comp = replaceStars(comp, loose);
  debug('stars', comp);
  return comp;
}

function isX(id) {
  return !id || id.toLowerCase() === 'x' || id === '*';
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceTilde(comp, loose);
  }).join(' ');
}

function replaceTilde(comp, loose) {
  var r = loose ? re[TILDELOOSE] : re[TILDE];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p))
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    else if (pr) {
      debug('replaceTilde pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      ret = '>=' + M + '.' + m + '.' + p + pr +
            ' <' + M + '.' + (+m + 1) + '.0';
    } else
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0';

    debug('tilde return', ret);
    return ret;
  });
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets(comp, loose) {
  return comp.trim().split(/\s+/).map(function(comp) {
    return replaceCaret(comp, loose);
  }).join(' ');
}

function replaceCaret(comp, loose) {
  debug('caret', comp, loose);
  var r = loose ? re[CARETLOOSE] : re[CARET];
  return comp.replace(r, function(_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr);
    var ret;

    if (isX(M))
      ret = '';
    else if (isX(m))
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    else if (isX(p)) {
      if (M === '0')
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
      else
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0';
    } else if (pr) {
      debug('replaceCaret pr', pr);
      if (pr.charAt(0) !== '-')
        pr = '-' + pr;
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p + pr +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p + pr +
              ' <' + (+M + 1) + '.0.0';
    } else {
      debug('no pr');
      if (M === '0') {
        if (m === '0')
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1);
        else
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0';
      } else
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0';
    }

    debug('caret return', ret);
    return ret;
  });
}

function replaceXRanges(comp, loose) {
  debug('replaceXRanges', comp, loose);
  return comp.split(/\s+/).map(function(comp) {
    return replaceXRange(comp, loose);
  }).join(' ');
}

function replaceXRange(comp, loose) {
  comp = comp.trim();
  var r = loose ? re[XRANGELOOSE] : re[XRANGE];
  return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr);
    var xM = isX(M);
    var xm = xM || isX(m);
    var xp = xm || isX(p);
    var anyX = xp;

    if (gtlt === '=' && anyX)
      gtlt = '';

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0';
      } else {
        // nothing is forbidden
        ret = '*';
      }
    } else if (gtlt && anyX) {
      // replace X with 0
      if (xm)
        m = 0;
      if (xp)
        p = 0;

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>=';
        if (xm) {
          M = +M + 1;
          m = 0;
          p = 0;
        } else if (xp) {
          m = +m + 1;
          p = 0;
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<';
        if (xm)
          M = +M + 1;
        else
          m = +m + 1;
      }

      ret = gtlt + M + '.' + m + '.' + p;
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0';
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0';
    }

    debug('xRange return', ret);

    return ret;
  });
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars(comp, loose) {
  debug('replaceStars', comp, loose);
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '');
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace($0,
                       from, fM, fm, fp, fpr, fb,
                       to, tM, tm, tp, tpr, tb) {

  if (isX(fM))
    from = '';
  else if (isX(fm))
    from = '>=' + fM + '.0.0';
  else if (isX(fp))
    from = '>=' + fM + '.' + fm + '.0';
  else
    from = '>=' + from;

  if (isX(tM))
    to = '';
  else if (isX(tm))
    to = '<' + (+tM + 1) + '.0.0';
  else if (isX(tp))
    to = '<' + tM + '.' + (+tm + 1) + '.0';
  else if (tpr)
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr;
  else
    to = '<=' + to;

  return (from + ' ' + to).trim();
}


// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function(version) {
  if (!version)
    return false;

  if (typeof version === 'string')
    version = new SemVer(version, this.loose);

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version))
      return true;
  }
  return false;
};

function testSet(set, version) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version))
      return false;
  }

  if (version.prerelease.length) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (var i = 0; i < set.length; i++) {
      debug(set[i].semver);
      if (set[i].semver === ANY)
        continue;

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver;
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch)
          return true;
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false;
  }

  return true;
}

exports.satisfies = satisfies;
function satisfies(version, range, loose) {
  try {
    range = new Range(range, loose);
  } catch (er) {
    return false;
  }
  return range.test(version);
}

exports.maxSatisfying = maxSatisfying;
function maxSatisfying(versions, range, loose) {
  var max = null;
  var maxSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!max || maxSV.compare(v) === -1) { // compare(max, v, true)
        max = v;
        maxSV = new SemVer(max, loose);
      }
    }
  })
  return max;
}

exports.minSatisfying = minSatisfying;
function minSatisfying(versions, range, loose) {
  var min = null;
  var minSV = null;
  try {
    var rangeObj = new Range(range, loose);
  } catch (er) {
    return null;
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) { // satisfies(v, range, loose)
      if (!min || minSV.compare(v) === 1) { // compare(min, v, true)
        min = v;
        minSV = new SemVer(min, loose);
      }
    }
  })
  return min;
}

exports.validRange = validRange;
function validRange(range, loose) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, loose).range || '*';
  } catch (er) {
    return null;
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr;
function ltr(version, range, loose) {
  return outside(version, range, '<', loose);
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr;
function gtr(version, range, loose) {
  return outside(version, range, '>', loose);
}

exports.outside = outside;
function outside(version, range, hilo, loose) {
  version = new SemVer(version, loose);
  range = new Range(range, loose);

  var gtfn, ltefn, ltfn, comp, ecomp;
  switch (hilo) {
    case '>':
      gtfn = gt;
      ltefn = lte;
      ltfn = lt;
      comp = '>';
      ecomp = '>=';
      break;
    case '<':
      gtfn = lt;
      ltefn = gte;
      ltfn = gt;
      comp = '<';
      ecomp = '<=';
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, loose)) {
    return false;
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i];

    var high = null;
    var low = null;

    comparators.forEach(function(comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator;
      low = low || comparator;
      if (gtfn(comparator.semver, high.semver, loose)) {
        high = comparator;
      } else if (ltfn(comparator.semver, low.semver, loose)) {
        low = comparator;
      }
    });

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false;
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false;
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false;
    }
  }
  return true;
}

exports.prerelease = prerelease;
function prerelease(version, loose) {
  var parsed = parse(version, loose);
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null;
}

exports.intersects = intersects;
function intersects(r1, r2, loose) {
  r1 = new Range(r1, loose)
  r2 = new Range(r2, loose)
  return r1.intersects(r2)
}


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var random = __webpack_require__(111)

var url = '_~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * var nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqL"
 *
 * @name nanoid
 */
module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = random(size)
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(25).randomBytes


/***/ }),
/* 112 */
/***/ (function(module, exports) {

/**
 * Secure random string generator with custom alphabet.
 *
 * Alphabet must contain 256 symbols or less. Otherwise, the generator
 * will not be secure.
 *
 * @param {random} random The random bytess generator.
 * @param {string} alphabet Symbols to be used in new random string.
 * @param {size} size The number of symbols in new random string.
 *
 * @return {string} Random string.
 *
 * @example
 * var format = require('nanoid/format')
 *
 * function random (size) {
 *   var result = []
 *   for (var i = 0; i < size; i++) result.push(randomByte())
 *   return result
 * }
 *
 * format(random, "abcdef", 5) //=> "fbaef"
 *
 * @name format
 */
module.exports = function (random, alphabet, size) {
  var mask = (2 << Math.log(alphabet.length - 1) / Math.LN2) - 1
  var step = Math.ceil(1.6 * mask * size / alphabet.length)

  var id = ''
  while (true) {
    var bytes = random(step)
    for (var i = 0; i < step; i++) {
      var byte = bytes[i] & mask
      if (alphabet[byte]) {
        id += alphabet[byte]
        if (id.length === size) return id
      }
    }
  }
}

/**
 * @callback generator
 * @param {number} bytes The number of bytes to generate.
 * @return {number[]} Random bytes.
 */


/***/ }),
/* 113 */
/***/ (function(module, exports) {

/**
 * URL safe symbols.
 *
 * @name url
 * @type {string}
 *
 * @example
 * var url = require('nanoid/url')
 * generate(url, 10) //=> "Uakgb_J5m9"
 */
module.exports =
  '_~0123456789' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __webpack_require__(24);
const consts_1 = __webpack_require__(47);
const element_1 = __webpack_require__(49);
function create_item_base(slot, quality = types_1.ItemQuality.common) {
    return Object.assign({}, element_1.create_element_base(types_1.ElementType.item), { slot,
        quality });
}
exports.create_item_base = create_item_base;
function compare_items_by_slot(a, b) {
    return consts_1.ITEM_SLOTS_TO_INT[a.slot] - consts_1.ITEM_SLOTS_TO_INT[b.slot];
}
exports.compare_items_by_slot = compare_items_by_slot;
function compare_items_by_quality(a, b) {
    return consts_1.ITEM_QUALITIES_TO_INT[a.quality] - consts_1.ITEM_QUALITIES_TO_INT[b.quality];
}
exports.compare_items_by_quality = compare_items_by_quality;
//# sourceMappingURL=item.js.map

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const soft_execution_context = __webpack_require__(50);
const enforce_immutability = (v) => v;
//const enforce_immutability = (state: State) => deepFreeze(state)
function get_default_SEC_context() {
    return {
        enforce_immutability,
    };
}
exports.get_default_SEC_context = get_default_SEC_context;
function oh_my_rpg_get_SEC({ module, parent_SEC }) {
    if (parent_SEC && !soft_execution_context.isSEC(parent_SEC)) {
        // better error
        throw new Error(`@oh-my-rpg: missing sec when creating module "${module}"!`);
    }
    return soft_execution_context.isomorphic.create({
        parent: parent_SEC,
        module,
        context: Object.assign({}, get_default_SEC_context()),
    });
}
exports.oh_my_rpg_get_SEC = oh_my_rpg_get_SEC;
//# sourceMappingURL=root_sec.js.map

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

//import NanoEvents from 'nanoevents'  TODO ?
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(18);
const promise_try_1 = __webpack_require__(117);
const normalize_error_1 = __webpack_require__(118);
const catch_factory_1 = __webpack_require__(51);
const logical_stack_1 = __webpack_require__(119);
const dependency_injection_1 = __webpack_require__(121);
exports.getContext = dependency_injection_1.getContext;
function isSEC(SEC) {
    return (SEC && SEC[constants_1.INTERNAL_PROP]);
}
exports.isSEC = isSEC;
let rootSEC = null;
function setRoot(SEC) {
    if (!isSEC(SEC))
        throw new Error(`${constants_1.LIB}›setRoot() argument error: must be a valid SEC!`);
    if (rootSEC)
        throw new Error(`${constants_1.LIB}›setRoot() conflict, root already set!`);
    rootSEC = SEC;
}
exports.setRoot = setRoot;
function create(args = {}) {
    if (args.parent && !isSEC(args.parent))
        throw new Error(`${constants_1.LIB}›create() argument error: parent must be a valid SEC!`);
    const hasNonRootParent = !!args.parent;
    args.parent = args.parent || rootSEC;
    const onError = args.onError || (args.parent && args.parent.onError); // XXX inherit, really?
    let SEC = {
        [constants_1.INTERNAL_PROP]: {
            hasNonRootParent,
            //parent,
            //onError,
            errDecorators: [normalize_error_1.normalizeError],
            state: {},
            DI: {
                context: {}
            },
        },
        child,
        xTry,
        xTryCatch,
        xPromiseTry,
        xPromiseCatch,
        xPromiseTryCatch,
    };
    // TODO rationalize
    // TODO event?
    // TODO lifecycle ?
    //if (SEC.verbose) console.log(`${LIB}: new SEC:`, args)
    SEC = logical_stack_1.installPluginLogicalStack(SEC, args);
    SEC = dependency_injection_1.installPluginDependencyInjection(SEC, args);
    // TODO check all params were handled!
    /////////////////////
    function child(args) {
        // optim for libs which may call themselves
        // XXX TOCheck
        /*if (isSEC(args) && args[INTERNAL_PROP].module && args[INTERNAL_PROP].module === SEC[INTERNAL_PROP].module) {
            // no need to create a child of oneself
            return SEC
        }*/
        return create(Object.assign({}, args, { parent: SEC }));
    }
    /////////////////////
    function xTry(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        try {
            return fn(params);
        }
        catch (err) {
            catch_factory_1.createCatcher({
                debugId: 'xTry',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError: null,
            })(err);
        }
    }
    function xTryCatch(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        try {
            return fn(params);
        }
        catch (err) {
            catch_factory_1.createCatcher({
                debugId: 'xTryCatch',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError,
            })(err);
        }
    }
    function xPromiseCatch(operation, promise) {
        const sub_SEC = SEC.child({ operation });
        return promise
            .catch(err => {
            catch_factory_1.createCatcher({
                debugId: 'xPromiseCatch',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError,
            })(err);
        });
    }
    function xPromiseTry(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        return promise_try_1.promiseTry(() => fn(params))
            .catch(err => {
            catch_factory_1.createCatcher({
                debugId: 'xPromiseTry',
                decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
                onError: null,
            })(err);
        });
    }
    function xPromiseTryCatch(operation, fn) {
        const sub_SEC = SEC.child({ operation });
        const params = Object.assign({}, sub_SEC[constants_1.INTERNAL_PROP].DI.context, { SEC: sub_SEC });
        return promise_try_1.promiseTry(() => fn(params))
            .catch(catch_factory_1.createCatcher({
            debugId: 'xPromiseTryCatch',
            decorators: sub_SEC[constants_1.INTERNAL_PROP].errDecorators,
            onError,
        }));
    }
    return SEC;
}
exports.create = create;
//# sourceMappingURL=core.js.map

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// http://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry(fn) {
    return Promise.resolve().then(fn);
}
exports.promiseTry = promiseTry;
//# sourceMappingURL=index.js.map

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_error_fields_1 = __webpack_require__(26);
// Anything can be thrown: undefined, string, number...)
// But that's not obviously not a good practice.
// Normalize any thrown object into a true, normal error.
function normalizeError(err_like = {}) {
    // Fact: in browser, sometime an error-like, un-writable object is thrown
    // create a true, safe, writable error object
    const true_err = new Error(err_like.message || `(non-error caught: "${err_like}")`);
    // copy fields if exist
    common_error_fields_1.COMMON_ERROR_FIELDS.forEach(prop => {
        if (prop in err_like)
            true_err[prop] = err_like[prop];
    });
    return true_err;
}
exports.normalizeError = normalizeError;
//# sourceMappingURL=index.js.map

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = __webpack_require__(18);
const constants_2 = __webpack_require__(120);
const common_error_fields_1 = __webpack_require__(26);
common_error_fields_1.COMMON_ERROR_FIELDS.add('logicalStack');
// TODO add non-inheritable instance
function getLogicalStack(module, operation, parentModule, parentFullLStack = '') {
    module = module || parentModule;
    if (!module)
        throw new Error(`${constants_1.LIB}/${constants_2.SUB_LIB}: you must provide 'module' to start building a logical stack!`);
    if (parentModule && !parentFullLStack)
        throw new Error(`${constants_1.LIB}/${constants_2.SUB_LIB}: you must provide the parent full LStack!`);
    if (parentFullLStack && !parentModule)
        throw new Error(`${constants_1.LIB}/${constants_2.SUB_LIB}: incoherency parentModule / parent LStack!`);
    /// SHORT ///
    let shortLStack = ''
        + constants_2.LOGICAL_STACK_BEGIN_MARKER
        + constants_2.LOGICAL_STACK_MODULE_MARKER
        + module;
    if (operation) {
        shortLStack += ''
            + constants_2.LOGICAL_STACK_SEPARATOR
            + operation
            + constants_2.LOGICAL_STACK_OPERATION_MARKER;
    }
    /// FULL ///
    let fullLStack = parentFullLStack || constants_2.LOGICAL_STACK_BEGIN_MARKER;
    if (module !== parentModule)
        fullLStack += ''
            + (parentModule ? constants_2.LOGICAL_STACK_SEPARATOR : '')
            + constants_2.LOGICAL_STACK_MODULE_MARKER
            + module;
    if (operation) {
        fullLStack += ''
            + constants_2.LOGICAL_STACK_SEPARATOR
            + operation
            + constants_2.LOGICAL_STACK_OPERATION_MARKER;
    }
    return {
        short: shortLStack,
        full: fullLStack,
    };
}
function installPluginLogicalStack(SEC, { module, operation, parent }) {
    // TODO check params
    // inherit some stuff from our parent
    if (parent) {
        module = module || parent[constants_1.INTERNAL_PROP].LS.module;
    }
    const SECInternal = SEC[constants_1.INTERNAL_PROP];
    const logicalStack = getLogicalStack(module, operation, SECInternal.hasNonRootParent
        ? parent[constants_1.INTERNAL_PROP].LS.module
        : undefined, SECInternal.hasNonRootParent
        ? parent[constants_1.INTERNAL_PROP].LS.logicalStack.full
        : undefined);
    SECInternal.errDecorators.push(function attachLogicalStackToError(err) {
        if (err.logicalStack) {
            // OK this error is already decorated.
            // Thus the message is also already decorated, don't touch it.
            // can we add more info?
            if (err.logicalStack.includes(logicalStack.full)) {
                // ok, logical stack already chained
            }
            else {
                // SEC chain was interrupted
                err.logicalStack = logicalStack.full + constants_2.LOGICAL_STACK_SEPARATOR_NON_ADJACENT + err.logicalStack;
            }
        }
        else {
            if (!err.message.startsWith(logicalStack.short))
                err.message = logicalStack.short + constants_2.LOGICAL_STACK_END_MARKER + ' ' + err.message;
            err.logicalStack = logicalStack.full;
        }
        return err;
    });
    SECInternal.LS = {
        module,
        operation,
        logicalStack,
    };
    return SEC;
}
exports.installPluginLogicalStack = installPluginLogicalStack;
//# sourceMappingURL=index.js.map

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const SUB_LIB = 'plugin/logical-stack';
exports.SUB_LIB = SUB_LIB;
const LOGICAL_STACK_BEGIN_MARKER = '';
exports.LOGICAL_STACK_BEGIN_MARKER = LOGICAL_STACK_BEGIN_MARKER;
const LOGICAL_STACK_END_MARKER = ':';
exports.LOGICAL_STACK_END_MARKER = LOGICAL_STACK_END_MARKER;
const LOGICAL_STACK_MODULE_MARKER = '';
exports.LOGICAL_STACK_MODULE_MARKER = LOGICAL_STACK_MODULE_MARKER;
const LOGICAL_STACK_SEPARATOR = '›';
exports.LOGICAL_STACK_SEPARATOR = LOGICAL_STACK_SEPARATOR;
//const LOGICAL_STACK_SEPARATOR = '↘'
//const LOGICAL_STACK_SEPARATOR = ':'
const LOGICAL_STACK_OPERATION_MARKER = '';
exports.LOGICAL_STACK_OPERATION_MARKER = LOGICAL_STACK_OPERATION_MARKER;
//const LOGICAL_STACK_OPERATION_MARKER = '…'
const LOGICAL_STACK_SEPARATOR_NON_ADJACENT = '›…›';
exports.LOGICAL_STACK_SEPARATOR_NON_ADJACENT = LOGICAL_STACK_SEPARATOR_NON_ADJACENT;
//# sourceMappingURL=constants.js.map

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const loggers_types_and_stubs_1 = __webpack_require__(52);
const constants_1 = __webpack_require__(18);
//import { createLogger, createChildLogger } from '../../../universal-logger-core' // TODO ?
function getContext(SEC) {
    return SEC[constants_1.INTERNAL_PROP].DI.context;
}
exports.getContext = getContext;
function installPluginDependencyInjection(SEC, args) {
    const { parent } = args;
    const { defaultContext: defaultChildContext = {}, context: childContext = {}, } = args;
    const SECInternal = SEC[constants_1.INTERNAL_PROP];
    // TODO check params
    // TODO report handled params
    // TODO check conflicts?
    const defaultContext = {
        env: 'development',
        logger: loggers_types_and_stubs_1.compatibleLoggerToConsole,
    };
    const parentContext = parent ? parent[constants_1.INTERNAL_PROP].DI.context : {};
    const forcedContext = {
        logicalStack: SECInternal.LS.logicalStack,
        tracePrefix: SECInternal.LS.logicalStack.short,
    };
    let context = Object.assign({}, defaultContext, defaultChildContext, parentContext, childContext, forcedContext);
    // TODO deep freeze ?
    SECInternal.DI = {
        context,
    };
    return SEC;
}
exports.installPluginDependencyInjection = installPluginDependencyInjection;
//# sourceMappingURL=index.js.map

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const log = console.log.bind(console);
const info = console.info.bind(console);
const warn = console.warn.bind(console);
const error = console.error.bind(console);
const alert = error;
const crit = error;
const debug = log;
const emerg = error;
const fatal = error;
const notice = info;
const silly = log;
const trace = log;
const verbose = log;
const warning = warn;
const simpleLoggerToConsole = {
    log,
    info,
    warn,
    error,
};
exports.simpleLoggerToConsole = simpleLoggerToConsole;
const consoleLoggerToConsole = console;
exports.consoleLoggerToConsole = consoleLoggerToConsole;
const syslogLoggerToConsole = {
    emerg,
    alert,
    crit,
    error,
    warning,
    notice,
    info,
    debug,
};
exports.syslogLoggerToConsole = syslogLoggerToConsole;
const log4jLoggerToConsole = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
exports.log4jLoggerToConsole = log4jLoggerToConsole;
const serverLoggerToConsole = log4jLoggerToConsole; // alias
exports.serverLoggerToConsole = serverLoggerToConsole;
const npmLoggerToConsole = {
    error,
    warn,
    info,
    debug,
    verbose,
    silly,
};
exports.npmLoggerToConsole = npmLoggerToConsole;
const angularJSLoggerToConsole = {
    error,
    warn,
    info,
    debug,
};
exports.angularJSLoggerToConsole = angularJSLoggerToConsole;
const bunyanLoggerToConsole = {
    fatal: (x, ...args) => fatal(...bunyan_args_harmonizer(x, ...args)),
    error: (x, ...args) => error(...bunyan_args_harmonizer(x, ...args)),
    warn: (x, ...args) => warn(...bunyan_args_harmonizer(x, ...args)),
    info: (x, ...args) => info(...bunyan_args_harmonizer(x, ...args)),
    debug: (x, ...args) => debug(...bunyan_args_harmonizer(x, ...args)),
    trace: (x, ...args) => trace(...bunyan_args_harmonizer(x, ...args)),
};
exports.bunyanLoggerToConsole = bunyanLoggerToConsole;
function bunyan_args_harmonizer(arg1, ...other_args) {
    if (arg1 instanceof Error) {
        const err = arg1;
        return other_args.concat({ err });
    }
    if (typeof arg1 !== 'string') {
        const details = arg1;
        return other_args.concat(details);
    }
    // no change
    return [arg1].concat(...other_args);
}
const compatibleLoggerToConsole = {
    alert,
    crit,
    debug,
    emerg,
    error,
    fatal,
    info,
    log,
    notice,
    silly,
    trace,
    verbose,
    warn,
    warning,
};
exports.compatibleLoggerToConsole = compatibleLoggerToConsole;
//# sourceMappingURL=to-console.js.map

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const stub = () => { };
const alert = stub;
const crit = stub;
const debug = stub;
const emerg = stub;
const error = stub;
const fatal = stub;
const info = stub;
const log = stub;
const notice = stub;
const silly = stub;
const trace = stub;
const verbose = stub;
const warn = stub;
const warning = stub;
const simpleLoggerToVoid = {
    log,
    info,
    warn,
    error,
};
exports.simpleLoggerToVoid = simpleLoggerToVoid;
const consoleLoggerToVoid = Object.assign({}, console, {
    debug,
    log,
    info,
    warn,
    error,
    trace,
});
exports.consoleLoggerToVoid = consoleLoggerToVoid;
const syslogLoggerToVoid = {
    emerg,
    alert,
    crit,
    error,
    warning,
    notice,
    info,
    debug,
};
exports.syslogLoggerToVoid = syslogLoggerToVoid;
const log4jLoggerToVoid = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
exports.log4jLoggerToVoid = log4jLoggerToVoid;
const serverLoggerToVoid = log4jLoggerToVoid;
exports.serverLoggerToVoid = serverLoggerToVoid;
const npmLoggerToVoid = {
    error,
    warn,
    info,
    debug,
    verbose,
    silly,
};
exports.npmLoggerToVoid = npmLoggerToVoid;
const angularJSLoggerToVoid = {
    error,
    warn,
    info,
    debug,
};
exports.angularJSLoggerToVoid = angularJSLoggerToVoid;
const bunyanLoggerToVoid = {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
};
exports.bunyanLoggerToVoid = bunyanLoggerToVoid;
const compatibleLoggerToVoid = {
    alert,
    crit,
    debug,
    emerg,
    error,
    fatal,
    info,
    log,
    notice,
    silly,
    trace,
    verbose,
    warn,
    warning,
};
exports.compatibleLoggerToVoid = compatibleLoggerToVoid;
//# sourceMappingURL=to-void.js.map

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(55);
const state_1 = __webpack_require__(54);
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const src_version = (legacy_state && legacy_state.schema_version) || 0;
    let state = state_1.create();
    if (Object.keys(legacy_state).length === 0) {
        // = empty object
        // It happen with some deserialization techniques.
        // It's a new state, keep freshly created one.
    }
    else if (src_version === consts_1.SCHEMA_VERSION)
        state = legacy_state;
    else if (src_version > consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB_ID}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${consts_1.LIB_ID}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`);
            state = state_1.create();
        }
    }
    // migrate sub-reducers if any...
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${consts_1.LIB_ID}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
}
//# sourceMappingURL=migrations.js.map

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const CharacterAttribute = typescript_string_enums_1.Enum('agility', 'health', 'level', 'luck', 'mana', 'strength', 'charisma', 'wisdom');
exports.CharacterAttribute = CharacterAttribute;
const CharacterClass = typescript_string_enums_1.Enum('novice', 'warrior', 'barbarian', 'paladin', 'sculptor', 'pirate', 'ninja', 'rogue', 'wizard', 'hunter', 'druid', 'priest');
exports.CharacterClass = CharacterClass;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(27);
const state_1 = __webpack_require__(56);
const sec_1 = __webpack_require__(57);
/////////////////////
function migrate_to_latest(SEC, legacy_state, hints = {}) {
    return sec_1.get_SEC(SEC).xTry('migrate_to_latest', ({ SEC, logger }) => {
        const src_version = (legacy_state && legacy_state.schema_version) || 0;
        let state = state_1.create(SEC);
        if (Object.keys(legacy_state).length === 0) {
            // = empty object
            // It happen with some deserialization techniques.
            // It's a new state, keep freshly created one.
        }
        else if (src_version === consts_1.SCHEMA_VERSION)
            state = legacy_state;
        else if (src_version > consts_1.SCHEMA_VERSION)
            throw new Error(`Your data is from a more recent version of this lib. Please update!`);
        else {
            try {
                // TODO report upwards
                logger.warn(`attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
                state = migrate_to_2(SEC, legacy_state, hints);
                logger.info(`schema migration successful.`);
            }
            catch (err) {
                // failed, reset all
                // TODO send event upwards
                logger.error(`failed migrating schema, performing full reset !`, err);
                state = state_1.create(SEC);
            }
        }
        // migrate sub-reducers if any...
        return state;
    });
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_2(SEC, legacy_state, hints) {
    return SEC.xTry('migrate_to_2', ({ SEC, logger }) => {
        if (legacy_state.schema_version !== 1)
            legacy_state = migrate_to_1(SEC, legacy_state, hints);
        logger.info(`migrating schema from v1 to v2...`);
        return Object.assign({}, legacy_state, { schema_version: 2, revision: (hints && hints.to_v2 && hints.to_v2.revision) || 0 });
    });
}
/////////////////////
function migrate_to_1(SEC, legacy_state, hints) {
    return SEC.xTry('migrate_to_1', ({ logger }) => {
        if (Object.keys(legacy_state).length !== Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length
            || !legacy_state.hasOwnProperty('characteristics'))
            throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
        logger.info(`migrating schema from v0/non-versioned to v1...`);
        const { name, klass, characteristics } = legacy_state;
        return {
            name,
            klass,
            attributes: characteristics,
            schema_version: 1,
        };
    });
}
//# sourceMappingURL=migrations.js.map

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const Currency = typescript_string_enums_1.Enum('coin', 'token');
exports.Currency = Currency;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(59);
const state_1 = __webpack_require__(58);
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const src_version = (legacy_state && legacy_state.schema_version) || 0;
    let state = state_1.create();
    if (Object.keys(legacy_state).length === 0) {
        // = empty object
        // It happen with some deserialization techniques.
        // It's a new state, keep freshly created one.
    }
    else if (src_version === consts_1.SCHEMA_VERSION)
        state = legacy_state;
    else if (src_version > consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB_ID}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${consts_1.LIB_ID}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`);
            state = state_1.create();
        }
    }
    // migrate sub-reducers if any...
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${consts_1.LIB_ID}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
}
//# sourceMappingURL=migrations.js.map

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const i18n_en_1 = __webpack_require__(130);
const i18n_messages = {
    en: i18n_en_1.messages,
};
exports.i18n_messages = i18n_messages;
const ENTRIES = [
    { type: 'base', hid: 'armguards' },
    { type: 'base', hid: 'belt' },
    { type: 'base', hid: 'boots' },
    { type: 'base', hid: 'bracers' },
    { type: 'base', hid: 'breatplate' },
    { type: 'base', hid: 'cloak' },
    { type: 'base', hid: 'crown' },
    { type: 'base', hid: 'gauntlets' },
    { type: 'base', hid: 'gloves' },
    { type: 'base', hid: 'greaves' },
    { type: 'base', hid: 'hat' },
    { type: 'base', hid: 'helmet' },
    { type: 'base', hid: 'leggings' },
    { type: 'base', hid: 'mantle' },
    { type: 'base', hid: 'pants' },
    { type: 'base', hid: 'robe' },
    { type: 'base', hid: 'shield' },
    { type: 'base', hid: 'shoes' },
    { type: 'base', hid: 'shoulders' },
    { type: 'base', hid: 'socks' },
    { type: 'qualifier1', hid: 'bone' },
    { type: 'qualifier1', hid: 'brass' },
    { type: 'qualifier1', hid: 'embroidered' },
    { type: 'qualifier1', hid: 'cardboard' },
    { type: 'qualifier1', hid: 'composite' },
    { type: 'qualifier1', hid: 'consecrated' },
    { type: 'qualifier1', hid: 'crafted' },
    { type: 'qualifier1', hid: 'cursed' },
    { type: 'qualifier1', hid: 'emerald' },
    { type: 'qualifier1', hid: 'engraved' },
    { type: 'qualifier1', hid: 'golden' },
    { type: 'qualifier1', hid: 'heavy' },
    { type: 'qualifier1', hid: 'holy' },
    { type: 'qualifier1', hid: 'invincible' },
    { type: 'qualifier1', hid: 'iron' },
    { type: 'qualifier1', hid: 'jade' },
    { type: 'qualifier1', hid: 'light' },
    { type: 'qualifier1', hid: 'mechanical' },
    { type: 'qualifier1', hid: 'mysterious' },
    { type: 'qualifier1', hid: 'old' },
    { type: 'qualifier1', hid: 'onyx' },
    { type: 'qualifier1', hid: 'powerful' },
    { type: 'qualifier1', hid: 'practical' },
    { type: 'qualifier1', hid: 'proven' },
    { type: 'qualifier1', hid: 'robust' },
    { type: 'qualifier1', hid: 'sapphire' },
    { type: 'qualifier1', hid: 'scale' },
    { type: 'qualifier1', hid: 'silver' },
    { type: 'qualifier1', hid: 'simple' },
    { type: 'qualifier1', hid: 'skeleton' },
    { type: 'qualifier1', hid: 'solid' },
    { type: 'qualifier1', hid: 'steel' },
    { type: 'qualifier1', hid: 'strange' },
    { type: 'qualifier1', hid: 'subtile' },
    { type: 'qualifier1', hid: 'swift' },
    { type: 'qualifier1', hid: 'unwavering' },
    { type: 'qualifier1', hid: 'used' },
    { type: 'qualifier1', hid: 'wooden' },
    { type: 'qualifier2', hid: 'ancients' },
    { type: 'qualifier2', hid: 'apprentice' },
    { type: 'qualifier2', hid: 'beginner' },
    { type: 'qualifier2', hid: 'brave' },
    { type: 'qualifier2', hid: 'conqueror' },
    { type: 'qualifier2', hid: 'cruel_tyrant' },
    { type: 'qualifier2', hid: 'defender' },
    { type: 'qualifier2', hid: 'destructor' },
    { type: 'qualifier2', hid: 'dwarven' },
    { type: 'qualifier2', hid: 'elite' },
    { type: 'qualifier2', hid: 'elven' },
    { type: 'qualifier2', hid: 'expert' },
    { type: 'qualifier2', hid: 'explorer' },
    { type: 'qualifier2', hid: 'gladiator' },
    { type: 'qualifier2', hid: 'goddess' },
    { type: 'qualifier2', hid: 'guard' },
    { type: 'qualifier2', hid: 'judgement' },
    { type: 'qualifier2', hid: 'king' },
    { type: 'qualifier2', hid: 'mediator' },
    { type: 'qualifier2', hid: 'mercenary' },
    { type: 'qualifier2', hid: 'militia' },
    { type: 'qualifier2', hid: 'nightmare' },
    { type: 'qualifier2', hid: 'noble' },
    { type: 'qualifier2', hid: 'noob' },
    { type: 'qualifier2', hid: 'pilgrim' },
    { type: 'qualifier2', hid: 'pioneer' },
    { type: 'qualifier2', hid: 'profane' },
    { type: 'qualifier2', hid: 'sorcerer' },
    { type: 'qualifier2', hid: 'tormentor' },
    { type: 'qualifier2', hid: 'training' },
    { type: 'qualifier2', hid: 'twink' },
    { type: 'qualifier2', hid: 'tyrant' },
    { type: 'qualifier2', hid: 'upholder' },
    { type: 'qualifier2', hid: 'warfield_king' },
    { type: 'qualifier2', hid: 'warfield' },
    { type: 'qualifier2', hid: 'warrior' },
    { type: 'qualifier2', hid: 'wise' },
];
exports.ENTRIES = ENTRIES;
//# sourceMappingURL=index.js.map

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const messages = {
    armor: {
        base: {
            'armguards': 'armguards',
            'belt': 'belt',
            'boots': 'boots',
            'bracers': 'bracers',
            'breatplate': 'breatplate',
            'cape': 'cape',
            'cloak': 'cloak',
            'crown': 'crown',
            'gauntlets': 'gauntlets',
            'gloves': 'gloves',
            'greaves': 'greaves',
            'hat': 'hat',
            'helmet': 'helmet',
            'leggings': 'leggings',
            'mantle': 'mantle',
            'pants': 'pants',
            'robe': 'robe',
            'shield': 'shield',
            'shoes': 'shoes',
            'shoulders': 'shoulders',
            'socks': 'socks',
        },
        qualifier1: {
            'admirable': 'admirable',
            'arcanic': 'arcanic',
            'bestial': 'bestial',
            'bone': 'bone',
            'brass': 'brass',
            'cardboard': 'cardboard',
            'complex': 'complex',
            'composite': 'composite',
            'consecrated': 'consecrated',
            'crafted': 'crafted',
            'cruel': 'cruel',
            'cunning': 'cunning',
            'cursed': 'cursed',
            'embroidered': 'embroidered',
            'emerald': 'emerald',
            'engraved': 'engraved',
            'forbidden': 'forbidden',
            'forgotten': 'forgotten',
            'ghost': 'ghost',
            'golden': 'golden',
            'heavy': 'heavy',
            'heroic': 'heroic',
            'holy': 'holy',
            'inflexible': 'inflexible',
            'invincible': 'invincible',
            'iron': 'iron',
            'jade': 'jade',
            'light': 'light',
            'living': 'living',
            'lost': 'lost',
            'mechanical': 'mechanical',
            'mysterious': 'mysterious',
            'old': 'old',
            'onyx': 'onyx',
            'overrated': 'overrated',
            'powerful': 'powerful',
            'practical': 'practical',
            'proven': 'proven',
            'raging': 'raging',
            'robust': 'robust',
            'sapphire': 'sapphire',
            'savage': 'savage',
            'scale': 'scale',
            'silver': 'silver',
            'simple': 'simple',
            'sinister': 'sinister',
            'skeleton': 'skeleton',
            'solid': 'solid',
            'steel': 'steel',
            'strange': 'strange',
            'subtile': 'subtile',
            'swift': 'swift',
            'unwavering': 'unwavering',
            'used': 'used',
            'whirling': 'whirling',
            'wooden': 'wooden',
            'adjudicator': 'adjudicator’s',
        },
        qualifier2: {
            'ambassador': 'ambassador’s',
            'ancients': 'of the ancients',
            'apprentice': 'apprentice’s',
            'assaulting': 'assaulting',
            'beginner': 'beginner’s',
            'brave': 'of the brave',
            'conqueror': 'conqueror’s',
            'cruel_tyrant': 'cruel tyrant’s',
            'defender': 'defender’s',
            'destructor': 'destructor’s',
            'dwarven': 'dwarven',
            'elite': 'elite',
            'elven': 'elven',
            'executioner': 'executioner’s',
            'expert': 'expert',
            'explorer': 'explorer’s',
            'gladiator': 'gladiator’s',
            'goddess': 'of the goddess',
            'guard': 'guard’s',
            'hunter': 'hunter’s',
            'judgement': 'of judgement',
            'king': 'king’s',
            'mediator': 'mediator’s',
            'mercenary': 'mercenary’s',
            'militia': 'militia’s',
            'nightmare': 'nightmare’s',
            'noble': 'noble’s',
            'noob': 'of the noob',
            'pilgrim': 'pilgrim’s',
            'pioneer': 'pioneer’s',
            'pirate': 'pirate’s',
            'profane': 'profane’s',
            'ranger': 'ranger’s',
            'sorcerer': 'sorcerer’s',
            'tormentor': 'tormentor’s',
            'training': 'training',
            'traveler': 'traveler’s',
            'twink': 'of the twink',
            'tyrant': 'tyrant’s',
            'upholder': 'upholder’s',
            'warfield_king': 'warfield king’s',
            'warfield': 'warfield’s',
            'warrior': 'warrior’s',
            'wise': 'of the wise',
            'woodsman': 'woodsman’s',
        }
    },
};
exports.messages = messages;
//# sourceMappingURL=i18n_en.js.map

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const ArmorPartType = typescript_string_enums_1.Enum('base', 'qualifier1', 'qualifier2');
exports.ArmorPartType = ArmorPartType;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
////////////
// actualized strength
// quality multipliers (see spreadsheet for calculation)
const QUALITY_STRENGTH_MULTIPLIER = {
    common: 1,
    uncommon: 19,
    rare: 46,
    epic: 91,
    legendary: 182,
    artifact: 333,
};
exports.QUALITY_STRENGTH_MULTIPLIER = QUALITY_STRENGTH_MULTIPLIER;
const QUALITY_STRENGTH_SPREAD = {
    common: 6,
    uncommon: 5,
    rare: 4,
    epic: 3,
    legendary: 2,
    artifact: 1,
};
exports.QUALITY_STRENGTH_SPREAD = QUALITY_STRENGTH_SPREAD;
const ENHANCEMENT_MULTIPLIER = 0.2;
exports.ENHANCEMENT_MULTIPLIER = ENHANCEMENT_MULTIPLIER;
function get_interval(base_strength, quality, enhancement_level, coef = 1) {
    const spread = QUALITY_STRENGTH_SPREAD[quality];
    const strength_multiplier = QUALITY_STRENGTH_MULTIPLIER[quality];
    const enhancement_multiplier = (1 + ENHANCEMENT_MULTIPLIER * enhancement_level);
    // constrain interval
    const min_strength = Math.max(base_strength - spread, 1);
    const max_strength = Math.min(base_strength + spread, 20);
    return [
        Math.round(min_strength * strength_multiplier * enhancement_multiplier * coef),
        Math.round(max_strength * strength_multiplier * enhancement_multiplier * coef)
    ];
}
exports.get_interval = get_interval;
////////////////////////////////////
//# sourceMappingURL=consts.js.map

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const i18n_en_1 = __webpack_require__(134);
const i18n_messages = {
    en: i18n_en_1.messages,
};
exports.i18n_messages = i18n_messages;
// TODO tests!!
const ENTRIES = [
    { type: 'base', hid: 'axe' },
    { type: 'base', hid: 'bow' },
    { type: 'base', hid: 'claw' },
    { type: 'base', hid: 'dagger' },
    { type: 'base', hid: 'grimoire' },
    { type: 'base', hid: 'harp' },
    { type: 'base', hid: 'knife' },
    { type: 'base', hid: 'longbow' },
    { type: 'base', hid: 'longsword' },
    { type: 'base', hid: 'luth' },
    { type: 'base', hid: 'mace' },
    { type: 'base', hid: 'scythe' },
    { type: 'base', hid: 'spear' },
    { type: 'base', hid: 'spoon' },
    { type: 'base', hid: 'staff' },
    { type: 'base', hid: 'sword' },
    { type: 'base', hid: 'wand' },
    { type: 'qualifier1', hid: 'admirable' },
    { type: 'qualifier1', hid: 'arcanic' },
    { type: 'qualifier1', hid: 'bestial' },
    { type: 'qualifier1', hid: 'bone' },
    { type: 'qualifier1', hid: 'brass' },
    { type: 'qualifier1', hid: 'cardboard' },
    { type: 'qualifier1', hid: 'complex' },
    { type: 'qualifier1', hid: 'composite' },
    { type: 'qualifier1', hid: 'consecrated' },
    { type: 'qualifier1', hid: 'crafted' },
    { type: 'qualifier1', hid: 'cruel' },
    { type: 'qualifier1', hid: 'cunning' },
    { type: 'qualifier1', hid: 'cursed' },
    { type: 'qualifier1', hid: 'emerald' },
    { type: 'qualifier1', hid: 'engraved' },
    { type: 'qualifier1', hid: 'forbidden' },
    { type: 'qualifier1', hid: 'forgotten' },
    { type: 'qualifier1', hid: 'ghost' },
    { type: 'qualifier1', hid: 'golden' },
    { type: 'qualifier1', hid: 'heavy' },
    { type: 'qualifier1', hid: 'heroic' },
    { type: 'qualifier1', hid: 'holy' },
    { type: 'qualifier1', hid: 'inflexible' },
    { type: 'qualifier1', hid: 'invincible' },
    { type: 'qualifier1', hid: 'iron' },
    { type: 'qualifier1', hid: 'jade' },
    { type: 'qualifier1', hid: 'light' },
    { type: 'qualifier1', hid: 'living' },
    { type: 'qualifier1', hid: 'lost' },
    { type: 'qualifier1', hid: 'mechanical' },
    { type: 'qualifier1', hid: 'mysterious' },
    { type: 'qualifier1', hid: 'old' },
    { type: 'qualifier1', hid: 'onyx' },
    { type: 'qualifier1', hid: 'overrated' },
    { type: 'qualifier1', hid: 'powerful' },
    { type: 'qualifier1', hid: 'practical' },
    { type: 'qualifier1', hid: 'proven' },
    { type: 'qualifier1', hid: 'raging' },
    { type: 'qualifier1', hid: 'robust' },
    { type: 'qualifier1', hid: 'sapphire' },
    { type: 'qualifier1', hid: 'savage' },
    { type: 'qualifier1', hid: 'silver' },
    { type: 'qualifier1', hid: 'simple' },
    { type: 'qualifier1', hid: 'sinister' },
    { type: 'qualifier1', hid: 'skeleton' },
    { type: 'qualifier1', hid: 'solid' },
    { type: 'qualifier1', hid: 'steel' },
    { type: 'qualifier1', hid: 'strange' },
    { type: 'qualifier1', hid: 'subtile' },
    { type: 'qualifier1', hid: 'swift' },
    { type: 'qualifier1', hid: 'unwavering' },
    { type: 'qualifier1', hid: 'used' },
    { type: 'qualifier1', hid: 'whirling' },
    { type: 'qualifier1', hid: 'wooden' },
    { type: 'qualifier2', hid: 'adjudicator' },
    { type: 'qualifier2', hid: 'ambassador' },
    { type: 'qualifier2', hid: 'ancients' },
    { type: 'qualifier2', hid: 'apprentice' },
    { type: 'qualifier2', hid: 'assaulting' },
    { type: 'qualifier2', hid: 'beginner' },
    { type: 'qualifier2', hid: 'brave' },
    { type: 'qualifier2', hid: 'conqueror' },
    { type: 'qualifier2', hid: 'cruel_tyrant' },
    { type: 'qualifier2', hid: 'defender' },
    { type: 'qualifier2', hid: 'destructor' },
    { type: 'qualifier2', hid: 'dwarven' },
    { type: 'qualifier2', hid: 'elite' },
    { type: 'qualifier2', hid: 'elven' },
    { type: 'qualifier2', hid: 'executioner' },
    { type: 'qualifier2', hid: 'expert' },
    { type: 'qualifier2', hid: 'explorer' },
    { type: 'qualifier2', hid: 'gladiator' },
    { type: 'qualifier2', hid: 'goddess' },
    { type: 'qualifier2', hid: 'guard' },
    { type: 'qualifier2', hid: 'hunter' },
    { type: 'qualifier2', hid: 'judgement' },
    { type: 'qualifier2', hid: 'king' },
    { type: 'qualifier2', hid: 'mediator' },
    { type: 'qualifier2', hid: 'mercenary' },
    { type: 'qualifier2', hid: 'militia' },
    { type: 'qualifier2', hid: 'nightmare' },
    { type: 'qualifier2', hid: 'noble' },
    { type: 'qualifier2', hid: 'noob' },
    { type: 'qualifier2', hid: 'pilgrim' },
    { type: 'qualifier2', hid: 'pioneer' },
    { type: 'qualifier2', hid: 'pirate' },
    { type: 'qualifier2', hid: 'profane' },
    { type: 'qualifier2', hid: 'ranger' },
    { type: 'qualifier2', hid: 'sorcerer' },
    { type: 'qualifier2', hid: 'tormentor' },
    { type: 'qualifier2', hid: 'training' },
    { type: 'qualifier2', hid: 'traveler' },
    { type: 'qualifier2', hid: 'twink' },
    { type: 'qualifier2', hid: 'tyrant' },
    { type: 'qualifier2', hid: 'upholder' },
    { type: 'qualifier2', hid: 'warfield_king' },
    { type: 'qualifier2', hid: 'warfield' },
    { type: 'qualifier2', hid: 'warrior' },
    { type: 'qualifier2', hid: 'wise' },
    { type: 'qualifier2', hid: 'woodsman' }
];
exports.ENTRIES = ENTRIES;
//# sourceMappingURL=index.js.map

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = {
    weapon: {
        base: {
            axe: 'axe',
            bow: 'bow',
            claw: 'claw',
            dagger: 'dagger',
            grimoire: 'grimoire',
            harp: 'harp',
            knife: 'knife',
            longbow: 'long bow',
            longsword: 'long sword',
            luth: 'luth',
            mace: 'scythe',
            scythe: 'spear',
            spear: 'spear',
            spoon: 'spoon',
            staff: 'staff',
            sword: 'sword',
            wand: 'wand',
        },
        qualifier1: {
            admirable: 'admirable',
            arcanic: 'arcanic',
            bestial: 'bestial',
            bone: 'bone',
            brass: 'brass',
            cardboard: 'cardboard',
            complex: 'complex',
            composite: 'composite',
            consecrated: 'consecrated',
            crafted: 'crafted',
            cruel: 'cruel',
            cunning: 'cunning',
            cursed: 'cursed',
            emerald: 'emerald',
            engraved: 'engraved',
            forbidden: 'forbidden',
            forgotten: 'forgotten',
            ghost: 'ghost',
            golden: 'golden',
            heavy: 'heavy',
            heroic: 'heroic',
            holy: 'holy',
            inflexible: 'inflexible',
            invincible: 'invincible',
            iron: 'iron',
            jade: 'jade',
            light: 'light',
            living: 'living',
            lost: 'lost',
            mechanical: 'mechanical',
            mysterious: 'mysterious',
            old: 'old',
            onyx: 'onyx',
            overrated: 'overrated',
            powerful: 'powerful',
            practical: 'practical',
            proven: 'proven',
            raging: 'raging',
            robust: 'robust',
            sapphire: 'sapphire',
            savage: 'savage',
            silver: 'silver',
            simple: 'simple',
            sinister: 'sinister',
            skeleton: 'skeleton',
            solid: 'solid',
            steel: 'steel',
            strange: 'strange',
            subtile: 'subtile',
            swift: 'swift',
            unwavering: 'unwavering',
            used: 'used',
            whirling: 'whirling',
            wooden: 'wooden',
        },
        qualifier2: {
            adjudicator: 'adjudicator’s',
            ambassador: 'ambassador’s',
            ancients: 'of the ancients',
            apprentice: 'apprentice’s',
            assaulting: 'assaulting',
            beginner: 'beginner’s',
            brave: 'of the brave',
            conqueror: 'conqueror’s',
            cruel_tyrant: 'cruel tyrant’s',
            defender: 'defender’s',
            destructor: 'destructor’s',
            dwarven: 'dwarven',
            elite: 'elite',
            elven: 'elven',
            executioner: 'executioner’s',
            expert: 'expert',
            explorer: 'explorer’s',
            gladiator: 'gladiator’s',
            goddess: 'of the goddess',
            guard: 'guard’s',
            hunter: 'hunter’s',
            judgement: 'of judgement',
            king: 'king’s',
            mediator: 'mediator’s',
            mercenary: 'mercenary’s',
            militia: 'militia’s',
            nightmare: 'nightmare’s',
            noble: 'noble’s',
            noob: 'of the noob',
            pilgrim: 'pilgrim’s',
            pioneer: 'pioneer’s',
            pirate: 'pirate’s',
            profane: 'profane’s',
            ranger: 'ranger’s',
            sorcerer: 'sorcerer’s',
            tormentor: 'tormentor’s',
            training: 'training',
            traveler: 'traveler’s',
            twink: 'of the twink',
            tyrant: 'tyrant’s',
            upholder: 'upholder’s',
            warfield: 'warfield’s',
            warfield_king: 'warfield king’s',
            warrior: 'warrior’s',
            wise: 'of the wise',
            woodsman: 'woodsman’s',
        },
    },
};
//# sourceMappingURL=i18n_en.js.map

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const WeaponPartType = typescript_string_enums_1.Enum('base', 'qualifier1', 'qualifier2');
exports.WeaponPartType = WeaponPartType;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
////////////
// actualized strength
// quality multipliers (see spreadsheet for calculation)
const QUALITY_STRENGTH_MULTIPLIER = {
    common: 1,
    uncommon: 19,
    rare: 46,
    epic: 91,
    legendary: 182,
    artifact: 333,
};
exports.QUALITY_STRENGTH_MULTIPLIER = QUALITY_STRENGTH_MULTIPLIER;
const QUALITY_STRENGTH_SPREAD = {
    common: 6,
    uncommon: 5,
    rare: 4,
    epic: 3,
    legendary: 2,
    artifact: 1,
};
exports.QUALITY_STRENGTH_SPREAD = QUALITY_STRENGTH_SPREAD;
const ENHANCEMENT_MULTIPLIER = 0.2;
exports.ENHANCEMENT_MULTIPLIER = ENHANCEMENT_MULTIPLIER;
function get_interval(base_strength, quality, enhancement_level, coef = 1) {
    const spread = QUALITY_STRENGTH_SPREAD[quality];
    const strength_multiplier = QUALITY_STRENGTH_MULTIPLIER[quality];
    const enhancement_multiplier = (1 + ENHANCEMENT_MULTIPLIER * enhancement_level);
    // constrain interval
    const min_strength = Math.max(base_strength - spread, 1);
    const max_strength = Math.min(base_strength + spread, 20);
    return [
        Math.round(min_strength * strength_multiplier * enhancement_multiplier * coef),
        Math.round(max_strength * strength_multiplier * enhancement_multiplier * coef)
    ];
}
exports.get_interval = get_interval;
////////////////////////////////////
//# sourceMappingURL=consts.js.map

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(28);
const state_1 = __webpack_require__(61);
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const src_version = (legacy_state && legacy_state.schema_version) || 0;
    let state = state_1.create();
    if (Object.keys(legacy_state).length === 0) {
        // = empty object
        // It happen with some deserialization techniques.
        // It's a new state, keep freshly created one.
    }
    else if (src_version === consts_1.SCHEMA_VERSION)
        state = legacy_state;
    else if (src_version > consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB_ID}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${consts_1.LIB_ID}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`);
            state = state_1.create();
        }
    }
    // migrate sub-reducers if any...
    // TODO migrate items
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${consts_1.LIB_ID}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
}
//# sourceMappingURL=migrations.js.map

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(63);
const state_1 = __webpack_require__(62);
/////////////////////
function migrate_to_latest(legacy_state, hints = {}) {
    const src_version = (legacy_state && legacy_state.schema_version) || 0;
    let state = state_1.create();
    if (Object.keys(legacy_state).length === 0) {
        // = empty object
        // It happen with some deserialization techniques.
        // It's a new state, keep freshly created one.
    }
    else if (src_version === consts_1.SCHEMA_VERSION)
        state = legacy_state;
    else if (src_version > consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB_ID}: Your data is from a more recent version of this lib. Please update!`);
    else {
        try {
            // TODO logger
            console.warn(`${consts_1.LIB_ID}: attempting to migrate schema from v${src_version} to v${consts_1.SCHEMA_VERSION}:`);
            state = migrate_to_1(legacy_state, hints);
            console.info(`${consts_1.LIB_ID}: schema migration successful.`);
        }
        catch (e) {
            // failed, reset all
            // TODO send event upwards
            console.error(`${consts_1.LIB_ID}: failed migrating schema, performing full reset !`);
            state = state_1.create();
        }
    }
    // migrate sub-reducers if any...
    return state;
}
exports.migrate_to_latest = migrate_to_latest;
/////////////////////
function migrate_to_1(legacy_state, hints) {
    if (Object.keys(legacy_state).length === Object.keys(state_1.OLDEST_LEGACY_STATE_FOR_TESTS).length) {
        console.info(`${consts_1.LIB_ID}: migrating schema from v0/non-versioned to v1...`);
        return Object.assign({}, legacy_state, { schema_version: 1, revision: (hints && hints.to_v1 && hints.to_v1.revision) || 0 });
    }
    throw new Error(`Unrecognized schema, most likely too old, can't migrate!`);
}
//# sourceMappingURL=migrations.js.map

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = __webpack_require__(4);
const definitions_1 = __webpack_require__(1);
const types_1 = __webpack_require__(65);
const data_1 = __webpack_require__(140);
/////////////////////
function pick_random_rank(rng) {
    // on 10 times, 1 boss, 2 elites, 7 common
    return random_1.Random.bool(0.7)(rng)
        ? types_1.MonsterRank.common
        : random_1.Random.bool(2 / 3.)(rng)
            ? types_1.MonsterRank.elite
            : types_1.MonsterRank.boss;
}
/////////////////////
const MONSTER_RELATIVE_LEVEL_SPREAD = 0.1;
function create(rng, hints = {}) {
    const raw = hints.name
        ? data_1.ENTRIES.find(raw_monster => raw_monster.name === hints.name)
        : random_1.Random.pick(rng, data_1.ENTRIES);
    if (!raw)
        throw new Error(`OMR Monster create: can't find a monster corresponding to hint "${hints.name}"!`);
    let level = -1;
    if (!hints.level)
        level = random_1.Random.integer(1, definitions_1.MAX_LEVEL)(rng);
    else {
        // stay close to the given level
        const reference_level = hints.level;
        const variation = Math.round(Math.max(1, reference_level * MONSTER_RELATIVE_LEVEL_SPREAD));
        level = Math.max(1, Math.min(definitions_1.MAX_LEVEL, reference_level + random_1.Random.integer(-variation, variation)(rng)));
    }
    return {
        name: raw.name,
        level,
        rank: hints.rank || pick_random_rank(rng),
        possible_emoji: hints.possible_emoji || raw.emoji,
    };
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_monster() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng);
}
exports.generate_random_demo_monster = generate_random_demo_monster;
const DEMO_MONSTER_01 = {
    name: 'chicken',
    level: 7,
    rank: types_1.MonsterRank.elite,
    possible_emoji: '🐓',
};
exports.DEMO_MONSTER_01 = DEMO_MONSTER_01;
/////////////////////
//# sourceMappingURL=factory.js.map

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const unicode_data_1 = __webpack_require__(141);
const EMOJI_ENTRIES = Object.keys(unicode_data_1.UNICODE_CHARS)
    .map(key => unicode_data_1.UNICODE_CHARS[key])
    .filter(charDetails => charDetails.taxonomy.includes('monster'))
    .map((charDetails) => ({
    name: charDetails.properties.description,
    emoji: charDetails.char,
}));
const EXTRA_ENTRIES = [
    {
        name: 'drop bear',
        emoji: '🐨',
    },
    {
        name: 'dahu',
        emoji: '🐏',
    },
];
const ENTRIES = [].concat(...EMOJI_ENTRIES, ...EXTRA_ENTRIES);
exports.ENTRIES = ENTRIES;
//# sourceMappingURL=index.js.map

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var unicode_1 = __webpack_require__(142);
exports.UNICODE_CHARS = unicode_1.CHARACTERS;
//# sourceMappingURL=index.js.map

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CHARACTERS = {
    '01f400': {
        code_point: 128000,
        char: '🐀',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'rat',
        },
    },
    '01f401': {
        code_point: 128001,
        char: '🐁',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'mouse',
        },
    },
    '01f402': {
        code_point: 128002,
        char: '🐂',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ox',
        },
    },
    '01f403': {
        code_point: 128003,
        char: '🐃',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'water buffalo',
        },
    },
    '01f404': {
        code_point: 128004,
        char: '🐄',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'cow',
        },
    },
    '01f405': {
        code_point: 128005,
        char: '🐅',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'tiger',
        },
    },
    '01f406': {
        code_point: 128006,
        char: '🐆',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'leopard',
        },
    },
    '01f407': {
        code_point: 128007,
        char: '🐇',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'rabbit',
        },
    },
    '01f408': {
        code_point: 128008,
        char: '🐈',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'cat',
        },
    },
    '01f409': {
        code_point: 128009,
        char: '🐉',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dragon',
        },
    },
    '01f40a': {
        code_point: 128010,
        char: '🐊',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'crocodile',
        },
    },
    '01f40b': {
        code_point: 128011,
        char: '🐋',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'whale',
        },
    },
    '01f40c': {
        code_point: 128012,
        char: '🐌',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'snail',
        },
    },
    '01f40d': {
        code_point: 128013,
        char: '🐍',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'snake',
        },
    },
    '01f40e': {
        code_point: 128014,
        char: '🐎',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'horse',
        },
    },
    '01f40f': {
        code_point: 128015,
        char: '🐏',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ram',
        },
    },
    '01f410': {
        code_point: 128016,
        char: '🐐',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'goat',
        },
    },
    '01f411': {
        code_point: 128017,
        char: '🐑',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ewe',
        },
    },
    '01f412': {
        code_point: 128018,
        char: '🐒',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'monkey',
        },
    },
    '01f413': {
        code_point: 128019,
        char: '🐓',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'chicken',
        },
    },
    '01f414': {
        code_point: 128020,
        char: '🐔',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'chicken head',
        },
    },
    '01f415': {
        code_point: 128021,
        char: '🐕',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dog',
        },
    },
    '01f416': {
        code_point: 128022,
        char: '🐖',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'pig',
        },
    },
    '01f417': {
        code_point: 128023,
        char: '🐗',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'boar',
        },
    },
    '01f418': {
        code_point: 128024,
        char: '🐘',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'elephant',
        },
    },
    '01f419': {
        code_point: 128025,
        char: '🐙',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'octopus',
        },
    },
    '01f41a': {
        code_point: 128026,
        char: '🐚',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'spiral shell',
        },
    },
    '01f41b': {
        code_point: 128027,
        char: '🐛',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'caterpillar',
        },
    },
    '01f41c': {
        code_point: 128028,
        char: '🐜',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ant',
        },
    },
    '01f41d': {
        code_point: 128029,
        char: '🐝',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'bee',
        },
    },
    '01f41e': {
        code_point: 128030,
        char: '🐞',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'lady beetle',
        },
    },
    '01f41f': {
        code_point: 128031,
        char: '🐟',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'fish',
        },
    },
    '01f420': {
        code_point: 128032,
        char: '🐠',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'tropical fish',
        },
    },
    '01f421': {
        code_point: 128033,
        char: '🐡',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'blowfish',
        },
    },
    '01f422': {
        code_point: 128034,
        char: '🐢',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'turtle',
        },
    },
    '01f423': {
        code_point: 128035,
        char: '🐣',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'hatching chick',
        },
    },
    '01f424': {
        code_point: 128036,
        char: '🐤',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'baby chick',
        },
    },
    '01f425': {
        code_point: 128037,
        char: '🐥',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'baby chick',
        },
    },
    '01f426': {
        code_point: 128038,
        char: '🐦',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'pigeon',
        },
    },
    '01f427': {
        code_point: 128039,
        char: '🐧',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'penguin',
        },
    },
    '01f428': {
        code_point: 128040,
        char: '🐨',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'koala',
        },
    },
    '01f429': {
        code_point: 128041,
        char: '🐩',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'poodle',
        },
    },
    '01f42a': {
        code_point: 128042,
        char: '🐪',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dromedary',
        },
    },
    '01f42b': {
        code_point: 128043,
        char: '🐫',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'camel',
        },
    },
    '01f42c': {
        code_point: 128044,
        char: '🐬',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dolphin',
        },
    },
    '01f42d': {
        code_point: 128045,
        char: '🐭',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'mouse',
        },
    },
    '01f42e': {
        code_point: 128046,
        char: '🐮',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'cow',
        },
    },
    '01f42f': {
        code_point: 128047,
        char: '🐯',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'tiger',
        },
    },
    '01f430': {
        code_point: 128048,
        char: '🐰',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'rabbit',
        },
    },
    '01f431': {
        code_point: 128049,
        char: '🐱',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'cat',
        },
    },
    '01f432': {
        code_point: 128050,
        char: '🐲',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'dragon',
        },
    },
    '01f433': {
        code_point: 128051,
        char: '🐳',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'spouting whale',
        },
    },
    '01f434': {
        code_point: 128052,
        char: '🐴',
        taxonomy: ['animal', 'living'],
        tags: ['emoji'],
        properties: {
            description: 'horse',
        },
    },
    '01f435': {
        code_point: 128053,
        char: '🐵',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'monkey',
        },
    },
    '01f436': {
        code_point: 128054,
        char: '🐶',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'dog',
        },
    },
    '01f437': {
        code_point: 128055,
        char: '🐷',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'pig',
        },
    },
    '01f438': {
        code_point: 128056,
        char: '🐸',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'frog',
        },
    },
    '01f439': {
        code_point: 128057,
        char: '🐹',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'hamster',
        },
    },
    '01f43a': {
        code_point: 128058,
        char: '🐺',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji'],
        properties: {
            description: 'wolf',
        },
    },
    '01f43b': {
        code_point: 128059,
        char: '🐻',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'bear',
        },
    },
    '01f43c': {
        code_point: 128060,
        char: '🐼',
        taxonomy: ['animal', 'living', 'monster', 'face'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'panda',
        },
    },
    '01f43d': {
        code_point: 128061,
        char: '🐽',
        taxonomy: [],
        tags: ['emoji'],
        properties: {
            description: '???',
        },
    },
    '01f43e': {
        code_point: 128062,
        char: '🐾',
        taxonomy: [],
        tags: ['emoji'],
        properties: {
            description: '???',
        },
    },
    '01f43f': {
        code_point: 128063,
        char: '🐿',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'chipmunk',
        },
    },
    '01f5ff': {
        code_point: 128511,
        char: '🗿',
        taxonomy: ['monster'],
        tags: ['emoji'],
        properties: {
            description: 'golem',
        },
    },
    '01f47b': {
        code_point: 128123,
        char: '👻',
        taxonomy: ['monster'],
        tags: ['emoji'],
        properties: {
            description: 'ghost',
        },
    },
    '01f54a': {
        code_point: 128330,
        char: '🕊',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dove',
        },
    },
    '01f577': {
        code_point: 128375,
        char: '🕷',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'spider',
        },
    },
    '01f980': {
        code_point: 129408,
        char: '🦀',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'crab',
        },
    },
    '01f981': {
        code_point: 129409,
        char: '🦁',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'lion',
        },
    },
    '01f982': {
        code_point: 129410,
        char: '🦂',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'scorpion',
        },
    },
    '01f983': {
        code_point: 129411,
        char: '🦃',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'turkey',
        },
    },
    '01f984': {
        code_point: 129412,
        char: '🦄',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji'],
        properties: {
            description: 'unicorn',
        },
    },
    '01f985': {
        code_point: 129413,
        char: '🦅',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'eagle',
        },
    },
    '01f986': {
        code_point: 129414,
        char: '🦆',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'duck',
        },
    },
    '01f987': {
        code_point: 129415,
        char: '🦇',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'bat',
        },
    },
    '01f988': {
        code_point: 129416,
        char: '🦈',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'shark',
        },
    },
    '01f989': {
        code_point: 129417,
        char: '🦉',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'owl',
        },
    },
    '01f98a': {
        code_point: 129418,
        char: '🦊',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'fox',
        },
    },
    '01f98b': {
        code_point: 129419,
        char: '🦋',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'butterfly',
        },
    },
    '01f98c': {
        code_point: 129420,
        char: '🦌',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'deer',
        },
    },
    '01f98d': {
        code_point: 129421,
        char: '🦍',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'gorilla',
        },
    },
    '01f98e': {
        code_point: 129422,
        char: '🦎',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'lizard',
        },
    },
    '01f98f': {
        code_point: 129423,
        char: '🦏',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'rhinoceros',
        },
    },
    '01f990': {
        code_point: 129424,
        char: '🦐',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'shrimp',
        },
    },
    '01f991': {
        code_point: 129425,
        char: '🦑',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'squid',
        },
    },
};
exports.CHARACTERS = CHARACTERS;
//# sourceMappingURL=index.js.map

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = __webpack_require__(4);
const definitions_1 = __webpack_require__(1);
const logic_weapons_1 = __webpack_require__(10);
const logic_armors_1 = __webpack_require__(9);
/////////////////////
function create(rng) {
    // TODO one day
}
exports.create = create;
/////////////////////
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_shop() {
    const rng = random_1.Random.engines.mt19937().autoSeed();
    return create(rng);
}
exports.generate_random_demo_shop = generate_random_demo_shop;
/////////////////////
const ARMOR_DMG_REDUCTION_TO_COINS_RATIO = 1.8;
function appraise_armor(armor) {
    return Math.round(logic_armors_1.get_medium_damage_reduction(armor) * ARMOR_DMG_REDUCTION_TO_COINS_RATIO);
}
const WEAPON_DMG_TO_COINS_RATIO = 0.8;
function appraise_weapon(weapon) {
    return Math.round(logic_weapons_1.get_medium_damage(weapon) * WEAPON_DMG_TO_COINS_RATIO);
}
///////
function appraise(item) {
    switch (item.slot) {
        case definitions_1.InventorySlot.armor:
            return appraise_armor(item);
        case definitions_1.InventorySlot.weapon:
            return appraise_weapon(item);
        default:
            throw new Error(`appraise(): no appraisal scheme for slot "${item.slot}" !`);
    }
}
exports.appraise = appraise;
/////////////////////
//# sourceMappingURL=index.js.map

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const GainType = typescript_string_enums_1.Enum(
// Note: must match properties in Adventure['gains']
'level', 'health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck', 'coin', 'token', 'weapon', 'armor', 'weapon_improvement', 'armor_improvement');
exports.GainType = GainType;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const random_1 = __webpack_require__(4);
/////////////////////
const definitions_1 = __webpack_require__(1);
const state_character_1 = __webpack_require__(7);
const WalletState = __webpack_require__(8);
const state_wallet_1 = __webpack_require__(8);
const InventoryState = __webpack_require__(12);
const PRNGState = __webpack_require__(13);
const state_prng_1 = __webpack_require__(13);
const logic_weapons_1 = __webpack_require__(10);
const logic_armors_1 = __webpack_require__(9);
const logic_monsters_1 = __webpack_require__(64);
const logic_adventures_1 = __webpack_require__(66);
const sec_1 = __webpack_require__(30);
/////////////////////
const STATS = ['health', 'mana', 'strength', 'agility', 'charisma', 'wisdom', 'luck'];
function instantiate_adventure_archetype(rng, aa, character, inventory) {
    let { hid, good, type, outcome: should_gain } = aa;
    should_gain = Object.assign({}, should_gain);
    // instantiate the special gains
    if (should_gain.random_charac) {
        const stat = random_1.Random.pick(rng, STATS);
        should_gain[stat] = true;
    }
    if (should_gain.lowest_charac) {
        const lowest_stat = STATS.reduce((acc, val) => {
            return character[acc] < character[val] ? acc : val;
        }, 'health');
        should_gain[lowest_stat] = true;
    }
    if (should_gain.armor_or_weapon) {
        // TODO take into account the existing inventory
        if (random_1.Random.bool()(rng))
            should_gain.armor = true;
        else
            should_gain.weapon = true;
    }
    if (should_gain.armor_or_weapon_improvement) {
        if (random_1.Random.bool()(rng))
            should_gain.armor_improvement = true;
        else
            should_gain.weapon_improvement = true;
    }
    // intermediate data
    const new_player_level = character.level + (should_gain.level ? 1 : 0);
    // TODO check multiple charac gain (should not happen)
    return {
        uuid: definitions_1.generate_uuid(),
        hid,
        good,
        encounter: type === logic_adventures_1.AdventureType.fight ? logic_monsters_1.create(rng, { level: character.level }) : undefined,
        gains: {
            level: should_gain.level ? 1 : 0,
            health: should_gain.health ? 1 : 0,
            mana: should_gain.mana ? 1 : 0,
            strength: should_gain.strength ? 1 : 0,
            agility: should_gain.agility ? 1 : 0,
            charisma: should_gain.charisma ? 1 : 0,
            wisdom: should_gain.wisdom ? 1 : 0,
            luck: should_gain.luck ? 1 : 0,
            coin: logic_adventures_1.generate_random_coin_gain(rng, should_gain.coin, new_player_level),
            token: should_gain.token ? 1 : 0,
            armor: should_gain.armor ? logic_armors_1.create(rng) : null,
            weapon: should_gain.weapon ? logic_weapons_1.create(rng) : null,
            armor_improvement: should_gain.armor_improvement,
            weapon_improvement: should_gain.weapon_improvement,
        }
    };
}
function receive_stat_increase(state, stat, amount = 1) {
    state.avatar = state_character_1.increase_stat(sec_1.get_SEC(), state.avatar, stat, amount);
    return state;
}
function receive_item(state, item) {
    // TODO handle inventory full
    state.inventory = InventoryState.add_item(state.inventory, item);
    return state;
}
exports.receive_item = receive_item;
function receive_coins(state, amount) {
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.coin, amount);
    return state;
}
function receive_tokens(state, amount) {
    state.wallet = WalletState.add_amount(state.wallet, state_wallet_1.Currency.token, amount);
    return state;
}
/////////////////////
function play_good(state, explicit_adventure_archetype_hid) {
    state.good_click_count++;
    state.meaningful_interaction_count++;
    let rng = state_prng_1.get_prng(state.prng);
    const aa = explicit_adventure_archetype_hid
        ? logic_adventures_1.get_archetype(explicit_adventure_archetype_hid)
        : logic_adventures_1.pick_random_good_archetype(rng);
    if (!aa)
        throw new Error(`play_good(): hinted adventure archetype "${explicit_adventure_archetype_hid}" could not be found!`);
    const adventure = instantiate_adventure_archetype(rng, aa, state.avatar.attributes, state.inventory);
    state.last_adventure = adventure;
    const { gains: gained } = adventure;
    // TODO store hid for no repetition
    let gain_count = 0;
    if (gained.level) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.level);
    }
    if (gained.health) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.health, gained.health);
    }
    if (gained.mana) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.mana, gained.mana);
    }
    if (gained.strength) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.strength, gained.strength);
    }
    if (gained.agility) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.agility, gained.agility);
    }
    if (gained.charisma) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.charisma, gained.charisma);
    }
    if (gained.wisdom) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.wisdom, gained.wisdom);
    }
    if (gained.luck) {
        gain_count++;
        state = receive_stat_increase(state, state_character_1.CharacterAttribute.luck, gained.luck);
    }
    if (gained.coin) {
        gain_count++;
        state = receive_coins(state, gained.coin);
    }
    if (gained.token) {
        gain_count++;
        state = receive_tokens(state, gained.token);
    }
    if (gained.weapon) {
        gain_count++;
        state = receive_item(state, gained.weapon);
    }
    if (gained.armor) {
        gain_count++;
        state = receive_item(state, gained.armor);
    }
    if (gained.weapon_improvement) {
        gain_count++;
        let weapon_to_enhance = InventoryState.get_item_in_slot(state.inventory, definitions_1.InventorySlot.weapon);
        if (weapon_to_enhance && weapon_to_enhance.enhancement_level < logic_weapons_1.MAX_ENHANCEMENT_LEVEL)
            logic_weapons_1.enhance(weapon_to_enhance);
        // TODO enhance another weapon as fallback
    }
    if (gained.armor_improvement) {
        gain_count++;
        const armor_to_enhance = InventoryState.get_item_in_slot(state.inventory, definitions_1.InventorySlot.armor);
        if (armor_to_enhance && armor_to_enhance.enhancement_level < logic_armors_1.MAX_ENHANCEMENT_LEVEL)
            logic_armors_1.enhance(armor_to_enhance);
        // TODO enhance another armor as fallback
    }
    if (!gain_count)
        throw new Error(`play_good() for hid "${aa.hid}" unexpectedly resulted in NO gains!`);
    state.prng = PRNGState.update_use_count(state.prng, rng, {
        I_swear_I_really_cant_know_whether_the_rng_was_used: !!explicit_adventure_archetype_hid
    });
    return state;
}
exports.play_good = play_good;
/////////////////////
//# sourceMappingURL=play.js.map

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const i18n_en_1 = __webpack_require__(147);
const types_1 = __webpack_require__(67);
const story = types_1.AdventureType.story;
const fight = types_1.AdventureType.fight;
const ENTRIES = [
    { good: false, type: story, hid: 'bad_default', outcome: {} },
    { good: true, type: fight, hid: 'fight_won_coins', outcome: { coin: 'small' } },
    { good: true, type: fight, hid: 'fight_won_loot', outcome: { armor_or_weapon: true } },
    { good: true, type: fight, hid: 'fight_won_any', outcome: { random_charac: true } },
    { good: true, type: fight, hid: 'fight_lost_any', outcome: { random_charac: true } },
    { good: true, type: fight, hid: 'fight_lost_shortcoming', outcome: { lowest_charac: true } },
    { good: true, type: story, hid: 'bored_log', outcome: { strength: true } },
    { good: true, type: story, hid: 'caravan', outcome: { coin: 'small' } },
    { good: true, type: story, hid: 'dying_man', outcome: { coin: 'medium' } },
    { good: true, type: story, hid: 'ate_bacon', outcome: { level: true } },
    { good: true, type: story, hid: 'ate_zombie', outcome: { mana: true } },
    { good: true, type: story, hid: 'refreshing_nap', outcome: { health: true } },
    { good: true, type: story, hid: 'older', outcome: { level: true } },
    { good: true, type: story, hid: 'stare_cup', outcome: { mana: true } },
    { good: true, type: story, hid: 'nuclear_fusion_paper', outcome: { wisdom: true } },
    { good: true, type: story, hid: 'found_green_mushroom', outcome: { level: true } },
    { good: true, type: story, hid: 'found_red_mushroom', outcome: { health: true } },
    { good: true, type: story, hid: 'found_blue_mushroom', outcome: { mana: true } },
    { good: true, type: story, hid: 'found_white_mushroom', outcome: { strength: true } },
    { good: true, type: story, hid: 'found_yellow_mushroom', outcome: { agility: true } },
    { good: true, type: story, hid: 'found_orange_mushroom', outcome: { charisma: true } },
    { good: true, type: story, hid: 'found_black_mushroom', outcome: { wisdom: true } },
    { good: true, type: story, hid: 'found_rainbow_mushroom', outcome: { luck: true } },
    { good: true, type: story, hid: 'found_random_mushroom', outcome: { random_charac: true } },
    { good: true, type: story, hid: 'meet_old_wizard', outcome: { wisdom: true } },
    { good: true, type: story, hid: 'good_necromancer', outcome: { agility: true } },
    { good: true, type: story, hid: 'talk_to_all_villagers', outcome: { charisma: true } },
    { good: true, type: story, hid: 'always_keep_potions', outcome: { health: true } },
    { good: true, type: story, hid: 'lost', outcome: { health: true } },
    { good: true, type: story, hid: 'fate_sword', outcome: { coin: 'small' } },
    { good: true, type: story, hid: 'grinding', outcome: { level: true } },
    { good: true, type: story, hid: 'so_many_potions', outcome: { strength: true } },
    { good: true, type: story, hid: 'rematch', outcome: { level: true } },
    { good: true, type: story, hid: 'useless', outcome: { wisdom: true } },
    { good: true, type: story, hid: 'escort', outcome: { health: true } },
    { good: true, type: story, hid: 'rare_goods_seller', outcome: { armor_or_weapon: true } },
    { good: true, type: story, hid: 'progress_loop', outcome: { armor_or_weapon: true } },
    { good: true, type: story, hid: 'idiot_bandits', outcome: { coin: 'medium' } },
    { good: true, type: story, hid: 'princess', outcome: { coin: 'medium', armor_or_weapon_improvement: true } },
    { good: true, type: story, hid: 'bad_village', outcome: { mana: true } },
    { good: true, type: story, hid: 'mana_mana', outcome: { mana: true } },
    { good: true, type: story, hid: 'treasure_in_pots', outcome: { coin: 'small' } },
    { good: true, type: story, hid: 'chicken_slayer', outcome: { strength: true } },
];
exports.ENTRIES = ENTRIES;
const i18n_messages = {
    en: i18n_en_1.messages,
};
exports.i18n_messages = i18n_messages;
//# sourceMappingURL=index.js.map

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// NOTE: we allow line returns for ease of writing
// but they'll be automatically removed, see bottom of this file.
// use {{br}} for actual line returns.
const raw_messages = {
    adventures: {
        bad_default: `You clicked too early!
+{{penalty_s}}s !`,
        fight_won_coins: `
You have defeated a {{encounter}}!{{br}}
You looted {{coin}} from its corpse.`,
        fight_won_loot: `
You have defeated a {{encounter}}!{{br}}
You looted a {{item}} from its corpse.`,
        fight_won_any: `
You have defeated a {{encounter}}!{{br}}
You perfected your {{attr_name}} during the fight: +{{attr}} {{attr_name}}!`,
        fight_lost_any: `
You were attacked and nearly killed by a {{encounter}} but you got away just before it was too late.{{br}}
You figured out techniques to flee more efficiently: +{{attr}} {{attr_name}}!`,
        fight_lost_shortcoming: `
You were attacked by a {{encounter}} and it didn't end well... but you got away just before it was about to kill you.{{br}}
You reflect on your lack of {{attr_name}} in the fight and train hard: +{{attr}} {{attr_name}}!`,
        // scavenged from screens of the original game
        bored_log: `
You were so bored, you punched a log for hours!
You gained +{{strength}} strength!`,
        caravan: `
You were hired to protect a caravan of merchants.
You gained {{coin}}!`,
        dying_man: `
A dying man on the street left you everything he had.
You gained {{coin}}!`,
        ate_bacon: `
You ate some bacon.
You gained +{{level}} level!`,
        /* too bland, please!
        ate_mushroom: `
You ate a mushroom.
You gained +{{level}} level!`,*/
        ate_zombie: `
You ate a zombie.
You gained +{{mana}} mana!`,
        refreshing_nap: `
You took a nap and feel refreshed.
You gained +{{health}} health!`,
        older: `
You feel a little older.
You gained +{{level}} level!`,
        stare_cup: `
You stare really hard at a cup, and it almost moves!
You gained +{{mana}} mana!`,
        nuclear_fusion_paper: `
You wrote a paper on nuclear fusion.
You gained +{{wisdom}} wisdom!`,
        found_green_mushroom: `
You found a green mushroom.
You gained +{{level}} level!`,
        // from me, inferred and extended
        found_red_mushroom: `
You found a red mushroom.
You gained +{{health}} health!`,
        found_blue_mushroom: `
You found a blue mushroom.
You gained +{{mana}} mana!`,
        found_white_mushroom: `
You found a white mushroom.
You gained +{{strength}} strength!`,
        found_yellow_mushroom: `
You found a yellow mushroom.
You gained +{{agility}} agility!`,
        found_orange_mushroom: `
You found an orange mushroom.
You gained +{{charisma}} charisma!`,
        found_black_mushroom: `
You found a black mushroom.
You gained +{{wisdom}} wisdom!`,
        found_rainbow_mushroom: `
You found a glowing rainbow mushroom.
You gained +{{luck}} luck!`,
        found_random_mushroom: `
You found a golden mushroom.
You gained +{{attr}} {{attr_name}}!`,
        // TODO potions
        // vermillon
        // argentée
        // TODO steal morrowind's level up message
        // from me
        meet_old_wizard: `
You meet a mysterious old wizard…
Before giving you the quest, he tells you his loooong story: You gain +{{wisdom}} wisdom!`,
        // electricbunnycomics.com
        good_necromancer: `
You meet a child weeping over his dead hamster… Thanks to necromancy, you reanimate it as a hamster-zombie!
Oddly, the child cries even more while running away.{{br}}
Fortunately, you gain +{{agility}} agility while avoiding the stones thrown by the villagers.`,
        // dorkly
        talk_to_all_villagers: `
You spoke to everyone in the village leaving no quest unanswered!{{br}}
Although your head aches from discussing so much.
+{{charisma}} charisma having met so many people!`,
        always_keep_potions: `
Being a seasoned adventurer, you kept a health potion "just in case":
Well done, your health is top-notch!`,
        lost: `
With all those quests, you forgot where you had to go…{{br}}
But circling around the map is good for your health: +{{health}} health!`,
        grinding: `
For lack of a better thing to do, you grind for hours and hours…
So what? It's an RPG, what did you expect?
But it pays off: +{{level}} level!`,
        // DK
        fate_sword: `
To thank you for saving his wife and his children, a farmer offers you "Destiny",
the heirloom sword passed down in his family for generations.{{br}}
30 minutes later, the merchant buys it off you for only {{coin}}… some heirloom!`,
        // ?
        so_many_potions: `
The fight against the final boss was hard, very hard…
Most importantly, +{{strength}} strength for managing to control a pressing urge during the encounter after drinking 25 health potions !`,
        // cad-comic.com
        rematch: `
You got beaten by a goblin!
In shame, you roam around the country, accepting quest after quest to train yourself before facing him again.{{br}}
Alas, he also trained and beat you again!
Well, the +{{level}} level is still useful…`,
        // paintraincomic.com
        // http://paintraincomic.com/comic/cemetery/
        useless: `
Arriving at the village, the mayor announces that the neighborhood is no longer dangerous.
The sorceress fell in love and no longer curses people.
The haunted cemetery was a pet cemetery, villagers are happy to have their companions back.
The giant is helping the farmers with their harvest.{{br}}
You feel useless and reflect on your place in the world. +{{wisdom}} wisdom!`,
        // memecenter.com
        escort: `
You are escorting an important NPC.
Frustratingly, if you walk, he's faster than you.
However, if you run, you're faster than him!
By strafing and running in circles, you manage
to stay close to him.{{br}}
+{{health}} health thanks to your efforts!`,
        // memecenter.com
        rare_goods_seller: `
You come across an old man with eccentric apparel.
Score! It's a rare item seller!
He gives you a good price for a {{item}}.`,
        // memecenter.com
        progress_loop: `
You would need better gear to level up.
But you'd need to level up to get better gear.
Cruel dilemma!{{br}}
Fortunately, you find a {{item}} at the bottom of a well!`,
        // memecenter.com/motohorse
        idiot_bandits: `
Your name is whispered across the land since you slayed the dragon and defeated the sorceress.
Bandits ambush you, aiming for your wealth. For their folly!
They realize their mistake one moment
before your fireball incinerates them.
Fortunately, gold doesn't burn: +{{coin}}!`,
        // don't remember the source for this one
        princess: `
"You won't take back the princess!" yells the fearsome black mage,
as you reach his throne room.
You reassure him: you are only here for loot.{{br}}
He lets you help yourself to {{coin}}
and even enchants your weapon too!`,
        // DM of the ring
        bad_village: `
You reach a new village. There is no weapon shop.
No potion shop either! And no quests at the inn!!
What a useless village. At your call, lightning and meteors wipe out this place.
A good opportunity to practice your magic: +{{mana}} mana.`,
        // muppets
        mana_mana: `
"Mah na mah na" "To to to do do"{{br}}
+{{mana}} mana!`,
        // Zelda reference
        treasure_in_pots: `
You enter a pottery shop and destroy every jug, vase and item in the store.
You collect +{{coin}} in coin, precious stones and other treasures found!`,
        // Oblivion dangerous chicken
        chicken_slayer: `
You enter a village and see a chicken roaming in a garden peacefully. 
You slay the chicken mercilessly.
The entire cohort of guards for the town come after you and you are forced to slay them too.
After hours of fighting you gain +{{strength}} strength!`,
    }
};
const messages = {
    adventures: {}
};
exports.messages = messages;
Object.keys(raw_messages.adventures).forEach((entry) => {
    messages.adventures[entry] = clean_multiline_string(raw_messages.adventures[entry]);
});
function clean_multiline_string(str) {
    return str
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => !!s)
        .join(' ');
}
//# sourceMappingURL=i18n_en.js.map

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RichText = __webpack_require__(3);
function get_recap(state) {
    const isNewGame = (state.meaningful_interaction_count === 0);
    if (isNewGame) {
        return RichText.section()
            .pushStrong('You are an otherworlder.{{br}}')
            .pushText('Congratulations, adventurer from another world!{{br}}')
            .pushText('You were chosen to enter the unknown realm of ')
            .pushStrong('Jaema')
            .pushText('.{{br}}')
            .pushText('Maybe were you just more courageous, cunning and curious than your peers?{{br}}')
            .pushText('But for now, let’s go on an adventure, for glory ⚔ and loot 📦 💰 !')
            .done();
    }
    return RichText.section()
        .pushText('You are ')
        .pushNode(RichText.span().addClass('avatar__name').pushText(state.avatar.name).done(), 'name')
        .pushText(', the ')
        .pushNode(RichText.span().addClass('avatar__class').pushText(state.avatar.klass).done(), 'class')
        .pushText(' from another world.{{br}}')
        .pushText('You are adventuring in the mysterious world of ')
        .pushStrong('Jaema')
        .pushText('…{{br}}')
        .pushStrong('For glory ⚔  and loot 📦 💰 !')
        .done();
}
exports.get_recap = get_recap;
function get_tip(state) {
    const hasEverPlayed = !!state.click_count;
    if (!hasEverPlayed)
        return RichText.section()
            .pushStrong('Tip: ')
            .pushText('Select ')
            .pushStrong('play')
            .pushText(' to start adventuring!')
            .done();
    // TODO suggest changing name
    // TODO suggest changing class
    return null;
}
exports.get_tip = get_tip;
//# sourceMappingURL=messages.js.map

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(31);
const types_1 = __webpack_require__(19);
function normalize_node($raw_node) {
    const { $v = 1, $type = types_1.NodeType.span, $classes = [], $content = '', $sub = {}, $hints = {}, } = $raw_node;
    // TODO migration
    if ($v !== consts_1.SCHEMA_VERSION)
        throw new Error(`${consts_1.LIB_ID}: unknown schema version "${$v}"!`);
    // TODO validation
    const $node = {
        $v,
        $type,
        $classes,
        $content,
        $sub,
        $hints,
    };
    return $node;
}
exports.normalize_node = normalize_node;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const MANY_SPACES = '                                                                                                ';
function indent(n) {
    return MANY_SPACES.slice(0, n * 2);
}
////////////////////////////////////
function debug_node_short($node) {
    const { $type, $content } = $node;
    return `${$type}."${$content}"`;
}
////////////////////////////////////
const on_root_enter = () => {
    console.log('⟩ [on_root_enter]');
};
const on_root_exit = ({ state }) => {
    console.log('⟨ [on_root_exit]');
    console.log(`  [state="${state}"]`);
    return state;
};
const on_node_enter = ({ $node, $id, depth }) => {
    console.log(indent(depth) + `⟩ [on_node_enter] #${$id} ` + debug_node_short($node));
    const state = '';
    console.log(indent(depth) + `  [state="${state}"] (init)`);
    return state;
};
const on_node_exit = ({ $node, $id, state, depth }) => {
    console.log(indent(depth) + `⟨ [on_node_exit] #${$id}`);
    console.log(indent(depth) + `  [state="${state}"]`);
    return state;
};
// when walking inside the content
const on_concatenate_str = ({ str, state, $node, depth, }) => {
    console.log(indent(depth) + `+ [on_concatenate_str] "${str}"`);
    state = state + str;
    console.log(indent(depth) + `  [state="${state}"]`);
    return state;
};
const on_concatenate_sub_node = ({ state, sub_state, depth, $id, $parent_node }) => {
    console.log(indent(depth) + `+ [on_concatenate_sub_node] "${sub_state}"`);
    state = state + sub_state;
    console.log(indent(depth) + `  [state="${state}"]`);
    return state;
};
const on_filter = ({ $filter, $filters, state, $node, depth }) => {
    console.log(indent(depth) + `  [on_filter] "${$filter}`);
    return state;
};
const on_class_before = ({ $class, state, $node, depth }) => {
    console.log(indent(depth) + `  [⟩on_class_before] .${$class}`);
    return state;
};
const on_class_after = ({ $class, state, $node, depth }) => {
    console.log(indent(depth) + `  [⟨on_class_after] .${$class}`);
    return state;
};
const on_type = ({ $type, state, $node, depth }) => {
    console.log(indent(depth) + `  [on_type] "${$type}" ${$node.$classes}`);
    return state;
};
////////////////////////////////////
const callbacks = {
    on_root_enter,
    on_root_exit,
    on_node_enter,
    on_node_exit,
    on_concatenate_str,
    on_concatenate_sub_node,
    /*
    on_sub_node_id: ({$id, state, $node, depth}) => {
        console.log(indent(depth) + `  [sub-node] #${$id}`)
        console.log(indent(depth) + `  [state="${state}"]`)
        return state
    },
    */
    on_filter,
    on_class_before,
    on_class_after,
    on_type,
    on_type_br: ({ state }) => {
        if (typeof state === 'string')
            return state + '{{br}}';
        return state;
    },
    on_type_hr: ({ state }) => {
        if (typeof state === 'string')
            return state + '{{hr}}';
        return state;
    },
};
exports.callbacks = callbacks;
//# sourceMappingURL=to_debug.js.map

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const on_concatenate_sub_node = ({ state, sub_state, $id, $parent_node }) => {
    if ($parent_node.$type === 'ul')
        return state + '\n - ' + sub_state;
    if ($parent_node.$type === 'ol')
        return state + `\n ${(' ' + $id).slice(-2)}. ` + sub_state;
    return state + sub_state;
};
const callbacks = {
    on_node_enter: () => '',
    on_concatenate_str: ({ state, str }) => state + str,
    on_concatenate_sub_node,
    on_type_br: ({ state }) => state + '\n',
    on_type_hr: ({ state }) => state + '\n------------------------------------------------------------\n',
};
exports.callbacks = callbacks;
//# sourceMappingURL=to_text.js.map

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const MANY_TABS = '																																							';
function indent(n) {
    return MANY_TABS.slice(0, n);
}
function apply_type($type, str, $classes, $sub_node_count, depth) {
    if ($type === 'br')
        return '<br/>\n';
    if ($type === 'hr')
        return '\n<hr/>\n';
    let is_inline = false;
    switch ($type) {
        case 'strong':
        case 'em':
        case 'span':
            is_inline = true;
            break;
        default:
            break;
    }
    let result = '';
    if (!is_inline)
        result += '\n' + indent(depth);
    result += `<${$type}`;
    if ($classes.length)
        result += ` class="${$classes.join(' ')}"`;
    result += '>' + str + ($sub_node_count ? '\n' + indent(depth) : '') + `</${$type}>`;
    return result;
}
const on_concatenate_sub_node = ({ state, sub_state }) => {
    return state + sub_state;
};
const callbacks = {
    on_node_enter: () => '',
    on_concatenate_str: ({ state, str }) => state + str,
    on_concatenate_sub_node,
    on_type: ({ state: str, $type, $node: { $classes, $sub }, depth }) => apply_type($type, str, $classes, Object.keys($sub).length, depth),
};
exports.callbacks = callbacks;
//# sourceMappingURL=to_html.js.map

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = __webpack_require__(31);
const types_1 = __webpack_require__(19);
exports.NodeType = types_1.NodeType;
function create($type) {
    const $node = {
        $v: consts_1.SCHEMA_VERSION,
        $type,
        $classes: [],
        $content: '',
        $sub: {},
        $hints: {},
    };
    const builder = {
        addClass,
        pushText,
        pushStrong,
        pushEmphasized,
        pushRawNode,
        pushNode,
        pushLineBreak,
        pushHorizontalRule,
        done,
    };
    let sub_id = 0;
    function addClass(...classes) {
        $node.$classes.push(...classes);
        return builder;
    }
    function pushText(str) {
        $node.$content += str;
        return builder;
    }
    function pushRawNode(node, id) {
        $node.$sub[id] = node;
        return builder;
    }
    function pushNode(node, id) {
        id = id || ('s' + ++sub_id);
        $node.$content += `{{${id}}}`;
        return pushRawNode(node, id);
    }
    function pushStrong(str, id) {
        const node = strong()
            .pushText(str)
            .done();
        return pushNode(node, id);
    }
    function pushEmphasized(str, id) {
        const node = emphasized()
            .pushText(str)
            .done();
        return pushNode(node, id);
    }
    function pushLineBreak() {
        $node.$content += '{{br}}';
        return builder;
    }
    function pushHorizontalRule() {
        $node.$content += '{{hr}}';
        return builder;
    }
    function done() {
        return $node;
    }
    return builder;
}
exports.create = create;
function section() {
    return create(types_1.NodeType.section);
}
exports.section = section;
function heading() {
    return create(types_1.NodeType.heading);
}
exports.heading = heading;
function strong() {
    return create(types_1.NodeType.strong);
}
function emphasized() {
    return create(types_1.NodeType.em);
}
function span() {
    return create(types_1.NodeType.span);
}
exports.span = span;
function ordered_list() {
    return create(types_1.NodeType.ol);
}
exports.ordered_list = ordered_list;
function unordered_list() {
    return create(types_1.NodeType.ul);
}
exports.unordered_list = unordered_list;
//# sourceMappingURL=builder.js.map

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_inventory_1 = __webpack_require__(12);
const state_fns = __webpack_require__(23);
const migrations_1 = __webpack_require__(68);
function create_game_instance({ SEC, get_latest_state, update_state }) {
    return SEC.xTry('creating tbrpg instance', ({ SEC, logger }) => {
        (function migrate() {
            SEC.xTry('auto migrating', ({ logger }) => {
                let state = get_latest_state();
                const was_empty_state = !state || Object.keys(state).length === 0;
                state = migrations_1.migrate_to_latest(SEC, state);
                if (was_empty_state) {
                    logger.verbose('Clean savegame created from scratch:', { state });
                }
                else {
                    logger.trace('migrated state:', { state });
                }
                update_state(state);
            });
        })();
        return {
            play() {
                let state = get_latest_state();
                state = state_fns.play(state);
                update_state(state);
            },
            equip_item(uuid) {
                let state = get_latest_state();
                state = state_fns.equip_item(state, uuid);
                update_state(state);
            },
            sell_item(uuid) {
                let state = get_latest_state();
                state = state_fns.sell_item(state, uuid);
                update_state(state);
            },
            rename_avatar(new_name) {
                let state = get_latest_state();
                state = state_fns.rename_avatar(state, new_name);
                update_state(state);
            },
            change_avatar_class(new_class) {
                let state = get_latest_state();
                state = state_fns.change_avatar_class(state, new_class);
                update_state(state);
            },
            get_item(uuid) {
                let state = get_latest_state();
                return state_inventory_1.get_item(state.inventory, uuid);
            },
            appraise_item(uuid) {
                let state = get_latest_state();
                return state_fns.appraise_item(state, uuid);
            },
            reset_all() {
                let state = state_fns.create();
                state = state_fns.reseed(state);
                update_state(state);
                logger.verbose('Savegame reseted:', { state });
            },
            get_latest_state,
        };
    });
}
exports.create_game_instance = create_game_instance;
//# sourceMappingURL=game-instance.js.map

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Conf = __webpack_require__(46)

const soft_execution_context = __webpack_require__(156)
const { compatibleLoggerToConsole } = __webpack_require__(52)
const { migrate_to_latest, reseed } = __webpack_require__(22)
const { createLogger } = __webpack_require__(70)
const { DEFAULT_SEED } = __webpack_require__( 13)

//const { displayError } = require('@offirmo/soft-execution-context/dist/src.es7.cjs/display-ansi')

const { prettify_json_for_debug } = __webpack_require__(75)

/////////////////////////////////////////////////

const logger = createLogger({
	name: 'the-npm-rpg',
	level: 'warn',
})

// test
/*
;[
	'fatal',
	'emerg',
	'alert',
	'crit',
	'error',
	'warning',
	'warn',
	'notice',
	'info',
	'verbose',
	'log',
	'debug',
	'trace',
	'silly',
].forEach(level => logger[level]({level}))
*/

function onError(err) {
	logger.fatal('error!', {err})
}

// TODO report sentry
const SEC = soft_execution_context.node.create({
	module: 'the-npm-rpg',
	onError,
	context: {
		logger,
	}
})
soft_execution_context.setRoot(SEC)

SEC.listenToUncaughtErrors()
SEC.listenToUnhandledRejections()
logger.trace('Soft Execution Context initialized.')

/////////////////////////////////////////////////

module.exports = {
	SEC,
}


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
	LIB,
	INTERNAL_PROP,
	createCatcher,
	isSEC,
	setRoot,
	getContext,
	isomorphic,
} = __webpack_require__(50)

const { createLogger } = __webpack_require__(70)

function create(...args) {
	const SEC = isomorphic.create(...args)

	// TODO protect from double install

	function listenToUncaughtErrors() {
		if (!SEC[INTERNAL_PROP].LS.module)
			throw new Error(`${LIB}›listenToUncaughtErrors() must only be called in the context of an app! (who are you to mess with globals, lib author??)`)
		const sub_SEC = SEC.child({operation: '(uncaught error)'})
		process.on('uncaughtException', createCatcher({
			decorators: sub_SEC[INTERNAL_PROP].errDecorators,
			onError: sub_SEC[INTERNAL_PROP].onError,
			debugId: 'node/uncaughtException',
		}))
	}

	function listenToUnhandledRejections() {
		if (!SEC[INTERNAL_PROP].LS.module)
			throw new Error(`${LIB}›listenToUncaughtErrors() must only be called in the context of an app! (who are you to mess with globals, lib author??)`)
		const sub_SEC = SEC.child({operation: '(unhandled promise rejection)'})
		process.on('unhandledRejection', createCatcher({
			decorators: sub_SEC[INTERNAL_PROP].errDecorators,
			onError: sub_SEC[INTERNAL_PROP].onError,
			debugId: 'node/unhandledRejection',
		}))
	}

	// TODO inject NODE_ENV + overwrite ENV

	// TODO expose a node logger

	return Object.assign({}, SEC, {
		listenToUncaughtErrors,
		listenToUnhandledRejections,
	})
}


const node = {
	create,
}

module.exports = {
	LIB,
	INTERNAL_PROP,
	createCatcher,
	isSEC,
	setRoot,
	getContext,

	isomorphic,

	node,
}


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(71), exports);
tslib_1.__exportStar(__webpack_require__(72), exports);
tslib_1.__exportStar(__webpack_require__(159), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
// - human readable timestamps
// - valid in URLs ?
// - valid in files ?
function get_UTC_timestamp_ms() {
    return (+Date.now());
}
exports.get_UTC_timestamp_ms = get_UTC_timestamp_ms;
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
//# sourceMappingURL=index.js.map

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(72);
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

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __webpack_require__(14);
const common_error_fields_1 = __webpack_require__(26);
function displayErrProp(errLike, prop) {
    console.error(chalk_1.default.red(chalk_1.default.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk_1.default.dim('"')));
}
function displayError(errLike = {}) {
    console.error(chalk_1.default.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk_1.default.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`));
    const displayedProps = new Set();
    displayedProps.add('name');
    if (errLike.message) {
        displayErrProp(errLike, 'message');
        displayedProps.add('message');
    }
    if (errLike.logicalStack) {
        displayErrProp(errLike, 'logicalStack');
        displayedProps.add('logicalStack');
    }
    common_error_fields_1.COMMON_ERROR_FIELDS.forEach(prop => {
        if (prop in errLike && !displayedProps.has(prop))
            displayErrProp(errLike, prop);
    });
}
exports.displayError = displayError;
//# sourceMappingURL=index.js.map

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {
const colorConvert = __webpack_require__(162);

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

	const rgb2rgb = (r, g, b) => [r, g, b];

	styles.color.close = '\u001B[39m';
	styles.bgColor.close = '\u001B[49m';

	styles.color.ansi = {};
	styles.color.ansi256 = {};
	styles.color.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 0)
	};

	styles.bgColor.ansi = {};
	styles.bgColor.ansi256 = {};
	styles.bgColor.ansi16m = {
		rgb: wrapAnsi16m(rgb2rgb, 10)
	};

	for (const key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] !== 'object') {
			continue;
		}

		const suite = colorConvert[key];

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(73)(module)))

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(74);
var route = __webpack_require__(164);

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
/* 163 */
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
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(74);

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
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(34);
const hasFlag = __webpack_require__(166);

const env = process.env;

const support = level => {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
};

let supportLevel = (() => {
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
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

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return 1;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return 0;
	}

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return 0;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

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
		return 0;
	}

	return 0;
})();

if ('FORCE_COLOR' in env) {
	supportLevel = parseInt(env.FORCE_COLOR, 10) === 0 ? 0 : (supportLevel || 1);
}

module.exports = process && support(supportLevel);


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (flag, argv) {
	argv = argv || process.argv;

	var terminatorPos = argv.indexOf('--');
	var prefix = /^-{1,2}/.test(flag) ? '' : '--';
	var pos = argv.indexOf(prefix + flag);

	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),
/* 167 */
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
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

//
// Remark: Requiring this file will use the "safe" colors API which will not touch String.prototype
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
var colors = __webpack_require__(17);
module['exports'] = colors;

/***/ }),
/* 169 */
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

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]

};

Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});

/***/ }),
/* 170 */
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

var argv = process.argv;

module.exports = (function () {
  if (argv.indexOf('--no-color') !== -1 ||
    argv.indexOf('--color=false') !== -1) {
    return false;
  }

  if (argv.indexOf('--color') !== -1 ||
    argv.indexOf('--color=true') !== -1 ||
    argv.indexOf('--color=always') !== -1) {
    return true;
  }

  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();

/***/ }),
/* 171 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 171;

/***/ }),
/* 172 */
/***/ (function(module, exports) {

module['exports'] = function runTheTrap (text, options) {
  var result = "";
  text = text || "Run the trap, drop the bass";
  text = text.split('');
  var trap = {
    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
    c: ["\u00a9", "\u023b", "\u03fe"],
    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
    f: ["\u04fa"],
    g: ["\u0262"],
    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
    i: ["\u0f0f"],
    j: ["\u0134"],
    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
    l: ["\u0139"],
    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
    p: ["\u01f7", "\u048e"],
    q: ["\u09cd"],
    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
    t: ["\u0141", "\u0166", "\u0373"],
    u: ["\u01b1", "\u054d"],
    v: ["\u05d8"],
    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
    y: ["\u00a5", "\u04b0", "\u04cb"],
    z: ["\u01b5", "\u0240"]
  }
  text.forEach(function(c){
    c = c.toLowerCase();
    var chars = trap[c] || [" "];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== "undefined") {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;

}


/***/ }),
/* 173 */
/***/ (function(module, exports) {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || "   he is here   ";
  var soul = {
    "up" : [
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
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }
  

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
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

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
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
}


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(17);

module['exports'] = (function() {
  return function (letter, i, exploded) {
    if(letter === " ") return letter;
    switch(i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter)
      case 2: return colors.blue(letter)
    }
  }
})();

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(17);

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(17);

module['exports'] = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
})();



/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(17);

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();

/***/ }),
/* 178 */
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
/* 179 */
/***/ (function(module, exports) {

module.exports = {"author":"Rafael de Oleza <rafeca@gmail.com> (https://github.com/rafeca)","name":"prettyjson","description":"Package for formatting JSON data in a coloured YAML-style, perfect for CLI output","version":"1.2.1","homepage":"http://rafeca.com/prettyjson","keywords":["json","cli","formatting","colors"],"repository":{"type":"git","url":"https://github.com/rafeca/prettyjson.git"},"bugs":{"url":"https://github.com/rafeca/prettyjson/issues"},"main":"./lib/prettyjson","license":"MIT","scripts":{"test":"npm run jshint && mocha --reporter spec","testwin":"node ./node_modules/mocha/bin/mocha --reporter spec","jshint":"jshint lib/*.js test/*.js","coverage":"istanbul cover _mocha --report lcovonly -- -R spec","coveralls":"npm run coverage && cat ./coverage/lcov.info | coveralls && rm -rf ./coverage","changelog":"git log $(git describe --tags --abbrev=0)..HEAD --pretty='* %s' --first-parent"},"bin":{"prettyjson":"./bin/prettyjson"},"dependencies":{"colors":"^1.1.2","minimist":"^1.2.0"},"devDependencies":{"coveralls":"^2.11.15","istanbul":"^0.4.5","jshint":"^2.9.4","mocha":"^3.1.2","mocha-lcov-reporter":"^1.2.0","should":"^11.1.1"}}

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = () => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, 'g');
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable yoda */
module.exports = x => {
	if (Number.isNaN(x)) {
		return false;
	}

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		x >= 0x1100 && (
			x <= 0x115f ||  // Hangul Jamo
			x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= x && x <= 0x4dbf) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4e00 <= x && x <= 0xa4c6) ||
			// Hangul Jamo Extended-A
			(0xa960 <= x && x <= 0xa97c) ||
			// Hangul Syllables
			(0xac00 <= x && x <= 0xd7a3) ||
			// CJK Compatibility Ideographs
			(0xf900 <= x && x <= 0xfaff) ||
			// Vertical Forms
			(0xfe10 <= x && x <= 0xfe19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xfe30 <= x && x <= 0xfe6b) ||
			// Halfwidth and Fullwidth Forms
			(0xff01 <= x && x <= 0xff60) ||
			(0xffe0 <= x && x <= 0xffe6) ||
			// Kana Supplement
			(0x1b000 <= x && x <= 0x1b001) ||
			// Enclosed Ideographic Supplement
			(0x1f200 <= x && x <= 0x1f251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= x && x <= 0x3fffd)
		)
	) {
		return true;
	}

	return false;
};


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const stringWidth = __webpack_require__(35);

module.exports = input => Math.max.apply(null, input.split('\n').map(x => stringWidth(x)));



/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(184);


/***/ }),
/* 184 */
/***/ (function(module, exports) {

module.exports = {"single":{"topLeft":"┌","topRight":"┐","bottomRight":"┘","bottomLeft":"└","vertical":"│","horizontal":"─"},"double":{"topLeft":"╔","topRight":"╗","bottomRight":"╝","bottomLeft":"╚","vertical":"║","horizontal":"═"},"round":{"topLeft":"╭","topRight":"╮","bottomRight":"╯","bottomLeft":"╰","vertical":"│","horizontal":"─"},"single-double":{"topLeft":"╓","topRight":"╖","bottomRight":"╜","bottomLeft":"╙","vertical":"║","horizontal":"─"},"double-single":{"topLeft":"╒","topRight":"╕","bottomRight":"╛","bottomLeft":"╘","vertical":"│","horizontal":"═"},"classic":{"topLeft":"+","topRight":"+","bottomRight":"+","bottomLeft":"+","vertical":"|","horizontal":"-"}}

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function preserveCamelCase(str) {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < str.length; i++) {
		const c = str[i];

		if (isLastCharLower && /[a-zA-Z]/.test(c) && c.toUpperCase() === c) {
			str = str.substr(0, i) + '-' + str.substr(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(c) && c.toLowerCase() === c) {
			str = str.substr(0, i - 1) + '-' + str.substr(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = c.toLowerCase() === c;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = c.toUpperCase() === c;
		}
	}

	return str;
}

module.exports = function (str) {
	if (arguments.length > 1) {
		str = Array.from(arguments)
			.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		str = str.trim();
	}

	if (str.length === 0) {
		return '';
	}

	if (str.length === 1) {
		return str.toLowerCase();
	}

	if (/^[a-z0-9]+$/.test(str)) {
		return str;
	}

	const hasUpperCase = str !== str.toLowerCase();

	if (hasUpperCase) {
		str = preserveCamelCase(str);
	}

	return str
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (m, p1) => p1.toUpperCase());
};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stringWidth = __webpack_require__(35)

function ansiAlign (text, opts) {
  if (!text) return text

  opts = opts || {}
  const align = opts.align || 'center'

  // short-circuit `align: 'left'` as no-op
  if (align === 'left') return text

  const split = opts.split || '\n'
  const pad = opts.pad || ' '
  const widthDiffFn = align !== 'right' ? halfDiff : fullDiff

  let returnString = false
  if (!Array.isArray(text)) {
    returnString = true
    text = String(text).split(split)
  }

  let width
  let maxWidth = 0
  text = text.map(function (str) {
    str = String(str)
    width = stringWidth(str)
    maxWidth = Math.max(width, maxWidth)
    return {
      str,
      width
    }
  }).map(function (obj) {
    return new Array(widthDiffFn(maxWidth, obj.width) + 1).join(pad) + obj.str
  })

  return returnString ? text.join(split) : text
}

ansiAlign.left = function left (text) {
  return ansiAlign(text, { align: 'left' })
}

ansiAlign.center = function center (text) {
  return ansiAlign(text, { align: 'center' })
}

ansiAlign.right = function right (text) {
  return ansiAlign(text, { align: 'right' })
}

module.exports = ansiAlign

function halfDiff (maxWidth, curWidth) {
  return Math.floor((maxWidth - curWidth) / 2)
}

function fullDiff (maxWidth, curWidth) {
  return maxWidth - curWidth
}


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const childProcess = __webpack_require__(36);
const util = __webpack_require__(16);
const crossSpawn = __webpack_require__(188);
const stripEof = __webpack_require__(203);
const npmRunPath = __webpack_require__(204);
const isStream = __webpack_require__(206);
const _getStream = __webpack_require__(207);
const pFinally = __webpack_require__(82);
const onExit = __webpack_require__(37);
const errname = __webpack_require__(211);
const stdio = __webpack_require__(212);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	if (opts && opts.env && opts.extendEnv !== false) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts && opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: cmd
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, opts) {
	const input = opts.input;

	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, encoding, maxBuffer) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

module.exports = (cmd, args, opts) => {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	const parsed = handleArgs(cmd, args, opts);
	const encoding = parsed.opts.encoding;
	const maxBuffer = parsed.opts.maxBuffer;

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanupTimeout = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanupTimeout();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanupTimeout();
			resolve({err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanupTimeout();
				resolve({err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const promise = pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', encoding, maxBuffer),
		getStream(spawned, 'stderr', encoding, maxBuffer)
	]).then(arr => {
		const result = arr[0];
		const stdout = arr[1];
		const stderr = arr[2];

		let err = result.err;
		const code = result.code;
		const signal = result.signal;

		if (removeExitHandler) {
			removeExitHandler();
		}

		if (err || code !== 0 || signal !== null) {
			if (!err) {
				let output = '';

				if (Array.isArray(parsed.opts.stdio)) {
					if (parsed.opts.stdio[2] !== 'inherit') {
						output += output.length > 0 ? stderr : `\n${stderr}`;
					}

					if (parsed.opts.stdio[1] !== 'inherit') {
						output += `\n${stdout}`;
					}
				} else if (parsed.opts.stdio !== 'inherit') {
					output = `\n${stderr}${stdout}`;
				}

				err = new Error(`Command failed: ${joinedCmd}${output}`);
				err.code = code < 0 ? errname(code) : code;
			}

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			err.stdout = stdout;
			err.stderr = stderr;
			err.failed = true;
			err.signal = signal || null;
			err.cmd = joinedCmd;
			err.timedOut = timedOut;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, stdout),
			stderr: handleOutput(parsed.opts, stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts);

	spawned.then = promise.then.bind(promise);
	spawned.catch = promise.catch.bind(promise);

	return spawned;
};

module.exports.stdout = function () {
	// TODO: set `stderr: 'ignore'` when that option is implemented
	return module.exports.apply(null, arguments).then(x => x.stdout);
};

module.exports.stderr = function () {
	// TODO: set `stdout: 'ignore'` when that option is implemented
	return module.exports.apply(null, arguments).then(x => x.stderr);
};

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);

	if (result.error || result.status !== 0) {
		throw (result.error || new Error(result.stderr === '' ? result.stdout : result.stderr));
	}

	result.stdout = handleOutput(parsed.opts, result.stdout);
	result.stderr = handleOutput(parsed.opts, result.stderr);

	return result;
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);

module.exports.spawn = util.deprecate(module.exports, 'execa.spawn() is deprecated. Use execa() instead.');


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var cp = __webpack_require__(36);
var parse = __webpack_require__(189);
var enoent = __webpack_require__(202);

var cpSpawnSync = cp.spawnSync;

function spawn(command, args, options) {
    var parsed;
    var spawned;

    // Parse the arguments
    parsed = parse(command, args, options);

    // Spawn the child process
    spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    var parsed;
    var result;

    if (!cpSpawnSync) {
        try {
            cpSpawnSync = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"spawn-sync\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));  // eslint-disable-line global-require
        } catch (ex) {
            throw new Error(
                'In order to use spawnSync on node 0.10 or older, you must ' +
                'install spawn-sync:\n\n' +
                '  npm install spawn-sync --save'
            );
        }
    }

    // Parse the arguments
    parsed = parse(command, args, options);

    // Spawn the child process
    result = cpSpawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var resolveCommand = __webpack_require__(79);
var hasEmptyArgumentBug = __webpack_require__(197);
var escapeArgument = __webpack_require__(81);
var escapeCommand = __webpack_require__(198);
var readShebang = __webpack_require__(199);

var isWin = process.platform === 'win32';
var skipShellRegExp = /\.(?:com|exe)$/i;

// Supported in Node >= 6 and >= 4.8
var supportsShellOption = parseInt(process.version.substr(1).split('.')[0], 10) >= 6 ||
 parseInt(process.version.substr(1).split('.')[0], 10) === 4 && parseInt(process.version.substr(1).split('.')[1], 10) >= 8;

function parseNonShell(parsed) {
    var shebang;
    var needsShell;
    var applyQuotes;

    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    parsed.file = resolveCommand(parsed.command);
    parsed.file = parsed.file || resolveCommand(parsed.command, true);
    shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;
        needsShell = hasEmptyArgumentBug || !skipShellRegExp.test(resolveCommand(shebang) || resolveCommand(shebang, true));
    } else {
        needsShell = hasEmptyArgumentBug || !skipShellRegExp.test(parsed.file);
    }

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    if (needsShell) {
        // Escape command & arguments
        applyQuotes = (parsed.command !== 'echo');  // Do not quote arguments for the special "echo" command
        parsed.command = escapeCommand(parsed.command);
        parsed.args = parsed.args.map(function (arg) {
            return escapeArgument(arg, applyQuotes);
        });

        // Make use of cmd.exe
        parsed.args = ['/d', '/s', '/c', '"' + parsed.command + (parsed.args.length ? ' ' + parsed.args.join(' ') : '') + '"'];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true;  // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    var shellCommand;

    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option, see: https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', '"' + shellCommand + '"'];
        parsed.options.windowsVerbatimArguments = true;  // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

// ------------------------------------------------

function parse(command, args, options) {
    var parsed;

    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : [];  // Clone array to avoid changing the original
    options = options || {};

    // Build our parsed object
    parsed = {
        command: command,
        args: args,
        options: options,
        file: undefined,
        original: command,
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(5)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(191)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(6)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(192)
} else {
  core = __webpack_require__(193)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(6)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(6)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

if (process.env.npm_package_name === 'pseudomap' &&
    process.env.npm_lifecycle_script === 'test')
  process.env.TEST_PSEUDOMAP = 'true'

if (typeof Map === 'function' && !process.env.TEST_PSEUDOMAP) {
  module.exports = Map
} else {
  module.exports = __webpack_require__(195)
}


/***/ }),
/* 195 */
/***/ (function(module, exports) {

var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = PseudoMap

function PseudoMap (set) {
  if (!(this instanceof PseudoMap)) // whyyyyyyy
    throw new TypeError("Constructor PseudoMap requires 'new'")

  this.clear()

  if (set) {
    if ((set instanceof PseudoMap) ||
        (typeof Map === 'function' && set instanceof Map))
      set.forEach(function (value, key) {
        this.set(key, value)
      }, this)
    else if (Array.isArray(set))
      set.forEach(function (kv) {
        this.set(kv[0], kv[1])
      }, this)
    else
      throw new TypeError('invalid argument')
  }
}

PseudoMap.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  Object.keys(this._data).forEach(function (k) {
    if (k !== 'size')
      fn.call(thisp, this._data[k].value, this._data[k].key)
  }, this)
}

PseudoMap.prototype.has = function (k) {
  return !!find(this._data, k)
}

PseudoMap.prototype.get = function (k) {
  var res = find(this._data, k)
  return res && res.value
}

PseudoMap.prototype.set = function (k, v) {
  set(this._data, k, v)
}

PseudoMap.prototype.delete = function (k) {
  var res = find(this._data, k)
  if (res) {
    delete this._data[res._index]
    this._data.size--
  }
}

PseudoMap.prototype.clear = function () {
  var data = Object.create(null)
  data.size = 0

  Object.defineProperty(this, '_data', {
    value: data,
    enumerable: false,
    configurable: true,
    writable: false
  })
}

Object.defineProperty(PseudoMap.prototype, 'size', {
  get: function () {
    return this._data.size
  },
  set: function (n) {},
  enumerable: true,
  configurable: true
})

PseudoMap.prototype.values =
PseudoMap.prototype.keys =
PseudoMap.prototype.entries = function () {
  throw new Error('iterators are not implemented in this version')
}

// Either identical, or both NaN
function same (a, b) {
  return a === b || a !== a && b !== b
}

function Entry (k, v, i) {
  this.key = k
  this.value = v
  this._index = i
}

function find (data, k) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k))
      return data[key]
  }
}

function set (data, k, v) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k)) {
      data[key].value = v
      return
    }
  }
  data.size++
  data[key] = new Entry(k, v, key)
}


/***/ }),
/* 196 */
/***/ (function(module, exports) {

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// See: https://github.com/IndigoUnited/node-cross-spawn/pull/34#issuecomment-221623455
function hasEmptyArgumentBug() {
    var nodeVer;

    if (process.platform !== 'win32') {
        return false;
    }

    nodeVer = process.version.substr(1).split('.').map(function (num) {
        return parseInt(num, 10);
    });

    return (nodeVer[0] === 0 && nodeVer[1] < 12);
}

module.exports = hasEmptyArgumentBug();


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var escapeArgument = __webpack_require__(81);

function escapeCommand(command) {
    // Do not escape if this command is not dangerous..
    // We do this so that commands like "echo" or "ifconfig" work
    // Quoting them, will make them unaccessible
    return /^[a-z0-9_-]+$/i.test(command) ? command : escapeArgument(command, true);
}

module.exports = escapeCommand;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(6);
var LRU = __webpack_require__(80);
var shebangCommand = __webpack_require__(200);

var shebangCache = new LRU({ max: 50, maxAge: 30 * 1000 });  // Cache just for 30sec

function readShebang(command) {
    var buffer;
    var fd;
    var shebang;

    // Check if it is in the cache first
    if (shebangCache.has(command)) {
        return shebangCache.get(command);
    }

    // Read the first 150 bytes from the file
    buffer = new Buffer(150);

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, 150, 0);
        fs.closeSync(fd);
    } catch (e) { /* empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    shebang = shebangCommand(buffer.toString());

    // Store the shebang in the cache
    shebangCache.set(command, shebang);

    return shebang;
}

module.exports = readShebang;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(201);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = /^#!.*/;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isWin = process.platform === 'win32';
var resolveCommand = __webpack_require__(79);

var isNode10 = process.version.indexOf('v0.10.') === 0;

function notFoundError(command, syscall) {
    var err;

    err = new Error(syscall + ' ' + command + ' ENOENT');
    err.code = err.errno = 'ENOENT';
    err.syscall = syscall + ' ' + command;

    return err;
}

function hookChildProcess(cp, parsed) {
    var originalEmit;

    if (!isWin) {
        return;
    }

    originalEmit = cp.emit;
    cp.emit = function (name, arg1) {
        var err;

        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See: https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments);
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    // If we are in node 10, then we are using spawn-sync; if it exited
    // with -1 it probably means that the command does not exist
    if (isNode10 && status === -1) {
        parsed.file = isWin ? parsed.file : resolveCommand(parsed.original);

        if (!parsed.file) {
            return notFoundError(parsed.original, 'spawnSync');
        }
    }

    return null;
}

module.exports.hookChildProcess = hookChildProcess;
module.exports.verifyENOENT = verifyENOENT;
module.exports.verifyENOENTSync = verifyENOENTSync;
module.exports.notFoundError = notFoundError;


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const path = __webpack_require__(5);
const pathKey = __webpack_require__(205);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const bufferStream = __webpack_require__(208);

function getStream(inputStream, opts) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	opts = Object.assign({maxBuffer: Infinity}, opts);

	const maxBuffer = opts.maxBuffer;
	let stream;
	let clean;

	const p = new Promise((resolve, reject) => {
		const error = err => {
			if (err) { // null check
				err.bufferedData = stream.getBufferedValue();
			}

			reject(err);
		};

		stream = bufferStream(opts);
		inputStream.once('error', error);
		inputStream.pipe(stream);

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				reject(new Error('maxBuffer exceeded'));
			}
		});
		stream.once('error', error);
		stream.on('end', resolve);

		clean = () => {
			// some streams doesn't implement the `stream.Readable` interface correctly
			if (inputStream.unpipe) {
				inputStream.unpipe(stream);
			}
		};
	});

	p.then(clean, clean);

	return p.then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, opts) => getStream(stream, Object.assign({}, opts, {encoding: 'buffer'}));
module.exports.array = (stream, opts) => getStream(stream, Object.assign({}, opts, {array: true}));


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const PassThrough = __webpack_require__(44).PassThrough;

module.exports = opts => {
	opts = Object.assign({}, opts);

	const array = opts.array;
	let encoding = opts.encoding;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),
/* 209 */
/***/ (function(module, exports) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),
/* 210 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// The Node team wants to deprecate `process.bind(...)`.
//   https://github.com/nodejs/node/pull/2768
//
// However, we need the 'uv' binding for errname support.
// This is a defensive wrapper around it so `execa` will not fail entirely if it stops working someday.
//
// If this ever stops working. See: https://github.com/sindresorhus/execa/issues/31#issuecomment-215939939 for another possible solution.
let uv;

try {
	uv = process.binding('uv');

	if (typeof uv.errname !== 'function') {
		throw new TypeError('uv.errname is not a function');
	}
} catch (err) {
	console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
	uv = null;
}

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}

module.exports = code => errname(uv, code);

// Used for testing the fallback behavior
module.exports.__test__ = errname;


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const x = module.exports;
const ESC = '\u001B[';
const isTerminalApp = process.env.TERM_PROGRAM === 'Apple_Terminal';

x.cursorTo = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	if (typeof y !== 'number') {
		return ESC + (x + 1) + 'G';
	}

	return ESC + (y + 1) + ';' + (x + 1) + 'H';
};

x.cursorMove = (x, y) => {
	if (typeof x !== 'number') {
		throw new TypeError('The `x` argument is required');
	}

	let ret = '';

	if (x < 0) {
		ret += ESC + (-x) + 'D';
	} else if (x > 0) {
		ret += ESC + x + 'C';
	}

	if (y < 0) {
		ret += ESC + (-y) + 'A';
	} else if (y > 0) {
		ret += ESC + y + 'B';
	}

	return ret;
};

x.cursorUp = count => ESC + (typeof count === 'number' ? count : 1) + 'A';
x.cursorDown = count => ESC + (typeof count === 'number' ? count : 1) + 'B';
x.cursorForward = count => ESC + (typeof count === 'number' ? count : 1) + 'C';
x.cursorBackward = count => ESC + (typeof count === 'number' ? count : 1) + 'D';

x.cursorLeft = ESC + 'G';
x.cursorSavePosition = ESC + (isTerminalApp ? '7' : 's');
x.cursorRestorePosition = ESC + (isTerminalApp ? '8' : 'u');
x.cursorGetPosition = ESC + '6n';
x.cursorNextLine = ESC + 'E';
x.cursorPrevLine = ESC + 'F';
x.cursorHide = ESC + '?25l';
x.cursorShow = ESC + '?25h';

x.eraseLines = count => {
	let clear = '';

	for (let i = 0; i < count; i++) {
		clear += x.eraseLine + (i < count - 1 ? x.cursorUp() : '');
	}

	if (count) {
		clear += x.cursorLeft;
	}

	return clear;
};

x.eraseEndLine = ESC + 'K';
x.eraseStartLine = ESC + '1K';
x.eraseLine = ESC + '2K';
x.eraseDown = ESC + 'J';
x.eraseUp = ESC + '1J';
x.eraseScreen = ESC + '2J';
x.scrollUp = ESC + 'S';
x.scrollDown = ESC + 'T';

x.clearScreen = '\u001Bc';
x.beep = '\u0007';

x.image = (buf, opts) => {
	opts = opts || {};

	let ret = '\u001B]1337;File=inline=1';

	if (opts.width) {
		ret += `;width=${opts.width}`;
	}

	if (opts.height) {
		ret += `;height=${opts.height}`;
	}

	if (opts.preserveAspectRatio === false) {
		ret += ';preserveAspectRatio=0';
	}

	return ret + ':' + buf.toString('base64') + '\u0007';
};

x.iTerm = {};

x.iTerm.setCwd = cwd => '\u001B]50;CurrentDir=' + (cwd || process.cwd()) + '\u0007';


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const opn = __webpack_require__(215);

const tbrpg = __webpack_require__(22)
const { iterables_unslotted, get_item_at_coordinates, get_item_in_slot } = __webpack_require__(12)
const { create: create_tty_chat_ui } = __webpack_require__(217)
const { create: create_chat } = __webpack_require__(254)
const { CHARACTER_CLASSES } = __webpack_require__(7)
const {
	render_item,
	render_character_sheet,
	render_full_inventory,
	render_adventure,
	render_account_info,
} = __webpack_require__(256)

const { rich_text_to_ansi } = __webpack_require__(262)
const { stylize_string } = __webpack_require__(21)
const { render_header } = __webpack_require__(264)
const { prettify_json_for_debug } = __webpack_require__(75)

function get_recap(state) {
	return rich_text_to_ansi(tbrpg.get_recap(state))
}

function get_tip(state) {
	const tip = tbrpg.get_tip(state)
	return tip && rich_text_to_ansi(tip)
}



function start_loop(SEC, options, instance) {
	return SEC.xPromiseTry('starting interactive loop', ({SEC, logger}) => {
		logger.trace('all options:', prettify_json_for_debug(options))

		render_header(options)

		function* gen_next_step() {
			const chat_state = {
				count: 0,
				mode: 'main',
				sub: {
					main: {
						last_displayed_adventure_uuid: (() => {
							const { last_adventure } = instance.get_latest_state()
							return last_adventure && last_adventure.uuid
						})()
					},
					inventory: {},
					character: {},
					meta: {},
				}
			}

			let yielded

			// how to quit
			chat_state.count++
			yielded = yield {
				type: 'simple_message',
				msg_main: `Note: Press ${stylize_string.inverse(' Ctrl+C ')} anytime to ${stylize_string.red('quit')}, your game is auto-saved.`,
			}

			function get_MODE_MAIN() {
				const steps = []
				const state = instance.get_latest_state()
				//console.log(state)
				const { last_adventure } = state

				if (last_adventure && chat_state.sub.main.last_displayed_adventure_uuid !== last_adventure.uuid) {
					const { good_click_count } = state
					//console.log({ good_click_count, last_adventure })
					let msg_main = `Episode #${good_click_count}:\n`
					const $doc = render_adventure(last_adventure)
					msg_main += rich_text_to_ansi($doc)
					chat_state.sub.main.last_adventure = state.last_adventure
					steps.push({
						type: 'progress',
						duration_ms: 600,
						msg_main: `Preparations: repairing equipment`,
						msgg_acknowledge: () => 'Equipment repaired',
					})
					steps.push({
						type: 'progress',
						duration_ms: 700,
						msg_main: `Preparations: buying rations`,
						msgg_acknowledge: () => 'Rations resupplied',
					})
					steps.push({
						type: 'progress',
						duration_ms: 800,
						msg_main: `Preparations: reviewing quests`,
						msgg_acknowledge: () => 'Quests reviewed',
					})
					steps.push({
						type: 'progress',
						duration_ms: 900, // or provide a progress_promise
						msg_main: `Farming XP`,
						msgg_acknowledge: () => 'XP farmed',
					})
					steps.push({
						type: 'progress',
						duration_ms: 1000,
						msg_main: `Exploring`,
						msgg_acknowledge: () => 'exploring... Encountered something!\n',
					})
					steps.push({
						type: 'simple_message',
						msg_main,
					})
					chat_state.sub.main.last_displayed_adventure_uuid = last_adventure.uuid
				}
				else {
					// recap
					steps.push({
						type: 'simple_message',
						msg_main: get_recap(state),
					})
				}

				// tip
				let tip_msg = get_tip(state)
				if (tip_msg) {
					steps.push({
						type: 'simple_message',
						msg_main: tip_msg,
					})
				}

				steps.push({
					msg_main: `What do you want to do?`,
					callback: value => { chat_state.mode = value },
					choices: [
						{
							msg_cta: 'Play!',
							value: 'play',
							msgg_as_user: () => 'Let’s go adventuring!',
							callback: () => {
								instance.play()
							},
						},
						{
							msg_cta: 'Manage Inventory (equip, sell…)',
							value: 'inventory',
							msgg_as_user: () => 'Let’s sort out my stuff.',
							msgg_acknowledge: () => `Sure.`,
						},
						{
							msg_cta: 'Manage Character (rename, change class…)',
							value: 'character',
							msgg_as_user: () => 'Let’s see how I’m doing!',
						},
						{
							msg_cta: 'Manage other stuff…',
							value: 'meta',
							msgg_as_user: () => 'Let’s see how I’m doing!',
						},
					],
				})

				return steps
			}

			function get_MODE_INVENTORY() {
				const steps = []
				let msg_main = `What do you want to do?`
				const choices = []

				const state = instance.get_latest_state()

				if (chat_state.sub.inventory.selected) {
					const uuid = chat_state.sub.inventory.selected
					const selected_item = instance.get_item(uuid)
					const item_ascii_full = rich_text_to_ansi(render_item(selected_item))
					const sell_price = instance.appraise_item(uuid)

					steps.push({
						type: 'simple_message',
						msg_main: 'You inspect the ' + item_ascii_full + ' in your backpack.'
					})

					const slot = selected_item.slot
					const equipped_item_in_same_slot = get_item_in_slot(state.inventory, slot)
					if (!equipped_item_in_same_slot) {
						steps.push({
							type: 'simple_message',
							msg_main: `You currently have no item equipped for this category (${slot}).`
						})
					}
					else {
						steps.push({
							type: 'simple_message',
							msg_main: `You compare it to your currently equipped ${slot}: ` + rich_text_to_ansi(render_item(equipped_item_in_same_slot))
						})
					}

					choices.push({
						msg_cta: 'Equip it.',
						value: 'equip',
						msgg_as_user: () => 'I want to equip it.',
						msgg_acknowledge: () => 'Done!',
						callback: () => {
							instance.equip_item(uuid)
							chat_state.sub.inventory = {}
						}
					})
					choices.push({
						msg_cta: `Sell it for ${sell_price} coins.`,
						value: 'sell',
						msgg_as_user: () => `Deal for ${sell_price} coins.`,
						msgg_acknowledge: () => `Here are you ${sell_price} coins. Pleased to do business with you!`,
						callback: () => {
							instance.sell_item(uuid)
							chat_state.sub.inventory = {}
						}
					})

					choices.push({
						msg_cta: 'Go back to inventory.',
						key_hint: { name: 'x' },
						value: 'exit',
						msgg_as_user: () => 'I’m done with it.',
						msgg_acknowledge: () => 'OK. Here is your inventory:',
						callback: () => {
							chat_state.sub.inventory = {}
						}
					})
				}
				else {
					const $doc = render_full_inventory(state.inventory, state.wallet)
					steps.push({
						type: 'simple_message',
						msg_main: 'Here is your full inventory:\n' + rich_text_to_ansi($doc)
					})

					const misc_items = Array.from(iterables_unslotted(state.inventory))
					misc_items.forEach((item, index) => {
						if (!item) return

						const item_ascii = rich_text_to_ansi(render_item(item, {
							display_quality: true,
							display_values: false,
						}))
						choices.push({
							msg_cta: 'Select ' + item_ascii,
							value: item.uuid,
							key_hint: {
								name: String.fromCharCode(97 + index),
							},
							msgg_as_user: () => 'I inspect ' + item_ascii,
							callback: value => {
								chat_state.sub.inventory.selected = value
							},
						})
					})

					choices.push({
						msg_cta: 'Go back to adventuring.',
						key_hint: { name: 'x' },
						value: 'x',
						msgg_as_user: () => 'Let’s do something else.',
						callback: () => {
							chat_state.sub.inventory = {}
							chat_state.mode = 'main'
						}
					})
				}

				steps.push({
					msg_main,
					choices,
				})

				return steps
			}

			function get_MODE_CHARACTER() {
				const steps = []
				const state = instance.get_latest_state()

				let msg_main = 'TODO char step'
				const choices = []

				if (chat_state.sub.character.changeClass) {
					msg_main = 'Choose your path wisely:'

					CHARACTER_CLASSES.forEach(klass => {
						if (klass === 'novice') return

						choices.push({
							msg_cta: `Switch class to ${klass}`,
							value: klass,
							msgg_as_user: () => `I want to follow the path of the ${klass}!`,
							msgg_acknowledge: name => `You’ll make an amazing ${klass}.`,
							callback: value => {
								instance.change_avatar_class(value)
								chat_state.sub.character = {}
							}
						})
					})
				}
				else if (chat_state.sub.character.rename) {
					return [{
						type: 'ask_for_string',
						msg_main: `What’s your name?`,
						msgg_as_user: value => `My name is "${value}".`,
						msgg_acknowledge: name => `You are now known as ${name}!`,
						callback: value => {
							instance.rename_avatar(value)
							chat_state.sub.character = {}
						},
					}]
				}
				else {
					const $doc = render_character_sheet(state.avatar)
					steps.push({
						type: 'simple_message',
						msg_main: 'Here is your character sheet:\n\n' + rich_text_to_ansi($doc)
					})

					msg_main = `What do you want to do?`

					choices.push(
						{
							msg_cta: 'Change class',
							value: 'c',
							msgg_as_user: () => 'I want to follow the path of…',
							callback: () => {
								chat_state.sub.character.changeClass = true
							}
						},
						{
							msg_cta: 'Rename hero',
							value: 'r',
							msgg_as_user: () => 'Let’s fix my name…',
							callback: () => {
								chat_state.sub.character.rename = true
							}
						},
						{
							msg_cta: 'Go back to adventuring.',
							key_hint: { name: 'x' },
							value: 'x',
							msgg_as_user: () => 'Let’s do something else.',
							callback: () => {
								chat_state.sub.character = {}
								chat_state.mode = 'main'
							}
						},
					)
				}

				steps.push({
					msg_main,
					choices,
				})

				return steps
			}

			function get_MODE_META() {
				const steps = []
				const state = instance.get_latest_state()

				if (chat_state.sub.meta.reseting) {
					steps.push({
						msg_main: 'Reset your game and start over, are you really really sure?',
						choices: [
							{
								msg_cta: 'Really reset your savegame, loose all your progression and start over 💀',
								value: 'reset',
								msgg_as_user: () => 'Definitely.',
								msgg_acknowledge: () => 'So be it...',
								callback: () => {
									instance.reset_all()
									chat_state.sub.meta = {}
								}
							},
							{
								msg_cta: 'Don’t reset and go back to game.',
								value: 'hold',
								msgg_as_user: () => 'Hold on, I changed my mind!',
								msgg_acknowledge: () => 'A wise choice. The world needs you, hero!',
								callback: () => {
									chat_state.sub.meta = {}
								}
							},
						],
					})
				}
				else {
					steps.push({
						type: 'simple_message',
						msg_main: rich_text_to_ansi(render_account_info(
							state.meta,
							{
								'game version': options.version,
								'Your savegame path': options.config.path,
							}))
					})

					let msg_main = `What do you want to do?`
					const choices = []

					const URL_OF_WEBSITE = 'https://www.online-adventur.es/the-npm-rpg.html'
					const URL_OF_NPM_PAGE = 'https://www.npmjs.com/package/the-npm-rpg'
					const URL_OF_REPO = 'https://github.com/online-adventures/oh-my-rpg'
					const URL_OF_PRODUCT_HUNT_PAGE = 'https://www.producthunt.com/upcoming/the-npm-rpg'
					const URL_OF_FORK = 'https://github.com/online-adventures/oh-my-rpg/#fork'
					const URL_OF_ISSUES = 'https://github.com/online-adventures/oh-my-rpg/issues'
					//const URL_OF_REDDIT_PAGE = 'TODO RED'

					choices.push(
						{
							msg_cta: 'Visit game official website',
							value: URL_OF_WEBSITE,
							msgg_as_user: () => 'Let’s have a look…',
						},
						{
							msg_cta: `💰 Reward the game author with a ${stylize_string.bgRed(
								stylize_string.white(' npm ')
							)} star ★`,
							value: URL_OF_NPM_PAGE,
							msgg_as_user: () => 'You’re awesome…',
						},
						{
							msg_cta: `💰 Reward the game author with a ${stylize_string.bgWhite(
								stylize_string.black(' GitHub ')
							)} star ★`,
							value: URL_OF_REPO,
							msgg_as_user: () => 'You’re awesome…',
						},
						/*{
                          msg_cta: 'Reward the game author with a reddit like 👍',
                          value: URL_OF_REDDIT_PAGE,
                          msgg_as_user: () => 'You’re awesome…',
                      },*/
						{
							msg_cta: `💰 Reward the game author with a ${stylize_string.bgRed(
								stylize_string.white(' Product Hunt ')
							)} upvote ⇧`,
							value: URL_OF_PRODUCT_HUNT_PAGE,
							msgg_as_user: () => 'You’re awesome…',
						},
						{
							msg_cta: 'Fork on GitHub 🐙 😹',
							value: URL_OF_FORK,
							msgg_as_user: () => 'I’d like to contribute!',
						},
						{
							msg_cta: 'Report a bug 🐞',
							value: URL_OF_ISSUES,
							msgg_as_user: () => 'There is this annoying bug…',
						},
						{
							msg_cta: 'Reset your savegame 💀',
							value: 'reset',
							msgg_as_user: () => 'I want to start over…',
							msgg_acknowledge: url => `You can't be serious?`,
							callback: () => {
								chat_state.sub.meta.reseting = true
							}
						},
						{
							msg_cta: 'Go back to adventuring.',
							key_hint: { name: 'x' },
							value: 'x',
							msgg_as_user: () => 'Let’s do something else.',
							msgg_acknowledge: url => `Yay, for loot and glory!`,
							callback: () => {
								chat_state.sub.character = {}
								chat_state.mode = 'main'
							}
						},
					)

					steps.push({
						msg_main,
						choices,
						msgg_acknowledge: url => `Now opening ` + url,
						callback: url => {
							opn(url)
						}
					})
				}

				return steps
			}

			logger.trace({chat_state})
			let shouldExit = false
			let loopDetector = 0
			do {
				switch(chat_state.mode) {
					case 'main':
						chat_state.count++
						yielded = yield* get_MODE_MAIN()
						break
					case 'inventory':
						chat_state.count++
						yielded = yield* get_MODE_INVENTORY()
						break
					case 'character':
						chat_state.count++
						yielded = yield* get_MODE_CHARACTER()
						break
					case 'meta':
						chat_state.count++
						yielded = yield* get_MODE_META()
						break
					default:
						console.error(`Unknown mode: "${chat_state.mode}"`)
						process.exit(1)
				}

				if (chat_state.count % 10 === 0) {
					const now = Date.now()
					if ((now - loopDetector) < 1000) {
						// loop detected: it's a bug
						throw new Error('Loop detected in chat interface')
					}
					loopDetector = now
				}
			} while(!shouldExit)
		}

		const chat = create_chat({
			DEBUG: false,
			gen_next_step: gen_next_step(),
			ui: create_tty_chat_ui({DEBUG: false}),
		})

		return chat
			.start()
			.then(() => console.log('Bye!'))
	})
}


module.exports = {
	start_loop,
}


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
const path = __webpack_require__(5);
const childProcess = __webpack_require__(36);
const isWsl = __webpack_require__(216);

module.exports = (target, opts) => {
	if (typeof target !== 'string') {
		return Promise.reject(new Error('Expected a `target`'));
	}

	opts = Object.assign({wait: true}, opts);

	let cmd;
	let appArgs = [];
	let args = [];
	const cpOpts = {};

	if (Array.isArray(opts.app)) {
		appArgs = opts.app.slice(1);
		opts.app = opts.app[0];
	}

	if (process.platform === 'darwin') {
		cmd = 'open';

		if (opts.wait) {
			args.push('-W');
		}

		if (opts.app) {
			args.push('-a', opts.app);
		}
	} else if (process.platform === 'win32' || isWsl) {
		cmd = 'cmd' + (isWsl ? '.exe' : '');
		args.push('/c', 'start', '""', '/b');
		target = target.replace(/&/g, '^&');

		if (opts.wait) {
			args.push('/wait');
		}

		if (opts.app) {
			args.push(opts.app);
		}

		if (appArgs.length > 0) {
			args = args.concat(appArgs);
		}
	} else {
		if (opts.app) {
			cmd = opts.app;
		} else {
			cmd = path.join(__dirname, 'xdg-open');
		}

		if (appArgs.length > 0) {
			args = args.concat(appArgs);
		}

		if (!opts.wait) {
			// `xdg-open` will block the process unless
			// stdio is ignored and it's detached from the parent
			// even if it's unref'd
			cpOpts.stdio = 'ignore';
			cpOpts.detached = true;
		}
	}

	args.push(target);

	if (process.platform === 'darwin' && appArgs.length > 0) {
		args.push('--args');
		args = args.concat(appArgs);
	}

	const cp = childProcess.spawn(cmd, args, cpOpts);

	if (opts.wait) {
		return new Promise((resolve, reject) => {
			cp.once('error', reject);

			cp.once('close', code => {
				if (code > 0) {
					reject(new Error('Exited with code ' + code));
					return;
				}

				resolve(cp);
			});
		});
	}

	cp.unref();

	return Promise.resolve(cp);
};

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(34);
const fs = __webpack_require__(6);

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().includes('Microsoft')) {
		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
	} catch (err) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const readline = __webpack_require__(218)
const term_size = __webpack_require__(78)
const strip_ansi = __webpack_require__(77)
const create_ora_spinner = __webpack_require__(219)
const Gauge = __webpack_require__(235)
const promiseFinally = __webpack_require__(82)
const { stylize_string, indent_string, wrap_string, prettify_json } = __webpack_require__(93)
const { prettify_params_for_debug, get_shared_start } = __webpack_require__(253)


const MANY_BOX_HORIZ = '────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────'
const MANY_SPACES = '                                                                                                                                                                  '
const LIB = 'view-chat/tty'

function alpha_to_nice_unicode(char) {
	// return ' ' + char + '\u20e3'
	return '╴' + stylize_string.inverse(' ' + char.toUpperCase() + ' ') + ' ' + stylize_string.blue('→')
}

function key_to_string(key) {
	return key.name
}


function create({DEBUG, shouldCenter}) {
	if (DEBUG) console.log('↘ tty_chat_ui.create()')
	const state = {
		is_closing: false,
		keypress_callback: null,
	}

	if (!process.stdout.isTTY)
		throw new Error('start_loop: current term is not a tty !')

	function compute_display_base_elements() {
		const TERMINAL_WIDTH = term_size().columns
		if (DEBUG) console.log({terminal_width: TERMINAL_WIDTH})

		if (TERMINAL_WIDTH < 80)
			throw new Error('Your terminal is too narrow!')

		// too wide doesn't look that good, cap it
		const USED_WIDTH = Math.min(TERMINAL_WIDTH, 120)

		// a msg is not taking the fill width, to clearly see left/right
		const MSG_MAX_WIDTH = Math.round(USED_WIDTH * .8)

		if (DEBUG) console.log({terminal_width: TERMINAL_WIDTH, USED_WIDTH, MSG_WIDTH: MSG_MAX_WIDTH})

		const MSG_BASELINE = MANY_BOX_HORIZ.slice(0, MSG_MAX_WIDTH - 2)
		const MSG_L_INDENT = shouldCenter
			? Math.round((TERMINAL_WIDTH - USED_WIDTH) / 2)
			: 0
		const MSG_R_INDENT = MSG_L_INDENT + USED_WIDTH - MSG_MAX_WIDTH

		return {
			MSG_MAX_WIDTH,
			MSG_BASELINE,
			MSG_L_INDENT,
			MSG_R_INDENT,
		}
	}

	process.stdin.setRawMode(true)
	readline.emitKeypressEvents(process.stdin)

	const rli = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: '   ',
	})

	rli.on('line', (input) => {
		if (DEBUG) console.log(`[Received line: ${input}]`)
	})

	rli.on('close', () => {
		if (DEBUG) console.log(`[Received close]`)
		state.is_closing = true
	})

	process.stdin.on('keypress', (str, key_pressed) => {
		if (DEBUG) console.log(`[keypress]`)
		if (!state.keypress_callback)
			return
		if (state.is_closing)
			return

		if (DEBUG) console.log(`[key pressed:\n${prettify_json(key_pressed)}\n]`)
		if (!key_pressed) {
			if (DEBUG) console.error('keypress: Y U no key?!')
			return
		}

		key_pressed.name = key_pressed.name || key_pressed.sequence
		state.keypress_callback(key_pressed)
	})
	rli.prompt()
	// TODO
	// global exit key


	function decorate_choices_with_key(step) {
		// init
		step.choices.forEach(choice => {
			choice._ui_tty = choice._ui_tty || {}
			choice._ui_tty.clean_cta = strip_ansi(choice.msg_cta).toLowerCase().split(/\s/).join('')
		})

		const affected_keys = new Set()
		const unhinted_choices = []

		// 1st follow hints, provided they don't collide
		const seen_key_hints = new Set()
		step.choices.forEach(choice => {
			if (!choice.key_hint) {
				unhinted_choices.push(choice)
				return
			}

			const key_hash = key_to_string(choice.key_hint)
			if (seen_key_hints.has(key_hash)) {
				// collision between hints
				if (DEBUG) console.log(`collision between key hints for key "${key_hash}"!`)
				// ignore hint for this choice
				unhinted_choices.push(choice)
				return
			}

			seen_key_hints.add(key_hash)
			affected_keys.add(key_hash)

			choice.key = choice.key_hint
			choice._ui_tty.key = choice.key_hint
		})

		// naive affectation for unhinted ones (may collide)
		unhinted_choices.forEach(choice => {
			choice._ui_tty.key = {
					name: choice._ui_tty.clean_cta[0]
				}
		})

		// find colliding choices with same key
		function find_unaffected_key(hintstr) {
			// clean hintstr from white chars
			hintstr = hintstr.split(' ').join('')
			hintstr = (hintstr + 'abcdefghijklmnopqrstuvwxyz1234567890').toLowerCase()
			for (let i=0; i < hintstr.length; i++) {
				let candidate_key = {
					name: hintstr.charAt(i)
				}

				// https://stackoverflow.com/a/25352300/587407
				const code = hintstr.charCodeAt(i)
				if (!(code > 47 && code < 58) && // numeric (0-9)
					!(code > 96 && code < 123)) { // lower alpha (a-z)
					continue
				}

				let candidate_keystr = key_to_string(candidate_key)
				if (!affected_keys.has(candidate_keystr))
					return candidate_key
			}
			throw new Error(`${LIB}: couldn't find any keystroke, no letter left...`)
		}

		let have_collisions = false
		let potentially_colliding_choices = unhinted_choices
		do {
			have_collisions = false

			const groups = {}
			potentially_colliding_choices.forEach(choice => {
				const key_hash = key_to_string(choice._ui_tty.key)
				groups[key_hash] = groups[key_hash] || []
				groups[key_hash].push(choice)
				if (groups[key_hash].length > 1)
					have_collisions = true
			})

			if (!have_collisions)
				break

			potentially_colliding_choices = []

			Object.keys(groups).forEach(key_hash => {
				if (groups[key_hash].length === 1) {
					// perfect, no collision
					affected_keys.add(key_hash)
					return
				}

				// collision
				const colliding_choices = groups[key_hash]
				const common_value_part = get_shared_start(colliding_choices.map(choice => choice._ui_tty.clean_cta))
				colliding_choices.forEach(choice => {
					let candidate_key = {
						name: choice._ui_tty.clean_cta.slice(common_value_part.length)[0]
					}
					let candidate_key_hash = key_to_string(candidate_key)

					if (!candidate_key.name || affected_keys.has(candidate_key_hash)) {
						// find another one
						candidate_key = find_unaffected_key(choice._ui_tty.clean_cta)
						candidate_key_hash = key_to_string(candidate_key)
					}
					choice._ui_tty.key = candidate_key
					affected_keys.add(candidate_key_hash)
				})
			})
		} while(have_collisions)

		const allowed_keys = step.choices.map(choice => '[' + choice._ui_tty.key.name + ']').join(',')
		if (DEBUG) console.log('  available choices: ' + allowed_keys)
	}

	function spin_until_resolution(anything) {
		const spinner = create_ora_spinner({
			interval: 100,
			//spinner: 'simpleDots',
			spinner: 'simpleDotsScrolling',
			stream: process.stdout,
		}).start()

		return promiseFinally(
			Promise.resolve(anything),
			() => spinner.stop(),
		)
	}

	function pretend_to_think(duration_ms) {
		return spin_until_resolution(new Promise(resolve => {
			setTimeout(resolve, duration_ms)
		}))
	}

	const gauge = new Gauge({
		template: [
			{type: 'activityIndicator', kerning: 1, length: 1},
			{type: 'section', kerning: 1, default: ''},
			{type: 'subsection', kerning: 1, default: ''},
			{type: 'progressbar', length: 33},
		],
	})
	function display_progress({progress_promise, msg = 'loading', msgg_acknowledge} = {}) {
		const progress_msg = msg + '...'
		gauge.show(progress_msg, 0)
		const auto_pulse = setInterval(() => gauge.pulse(), 100)

		if (progress_promise.onProgress) {
			progress_promise.onProgress(progress => {
				gauge.show(progress_msg, progress)
			})
		}

		progress_promise
			.then(() => true, () => false)
			.then(success => {
				clearInterval(auto_pulse)
				gauge.hide()

				let final_msg = success ? stylize_string.green('✔') : stylize_string.red('❌')
				final_msg += ' '
				final_msg += msgg_acknowledge
					? msgg_acknowledge(success)
					: msg
				console.log(final_msg)
			})
			.catch(err => {
				console.error('unexpected', err)
				return false
			})

		return progress_promise
	}

	function render_choice(choice) {
		const {msg_cta} = choice
		const {key} = choice._ui_tty
		const nice_key = alpha_to_nice_unicode(key.name)
		return `${nice_key} ${msg_cta}`
	}

	async function display_message({msg, choices = [], side = '→'}) {
		if (DEBUG) console.log(`↘ display_message(\n${prettify_params_for_debug({msg, choices, side})}\n)`)
		if (typeof arguments[0] !== 'object')
			throw new Error(`display_message(): incorrect invocation!`)
		if (!msg)
			throw new Error(`display_message(): no msg!`)

		const {
			MSG_MAX_WIDTH,
			MSG_BASELINE,
			MSG_L_INDENT,
			MSG_R_INDENT,
		} = compute_display_base_elements()

		msg = wrap_string(msg, MSG_MAX_WIDTH - 1)
		msg = indent_string(msg, 1, {indent: '│'})

		const has_choices = choices && choices.length > 0
		if (!has_choices) {
			msg += '\n└─' + MSG_BASELINE
		}
		else {
			msg += '\n└┬' + MSG_BASELINE
			decorate_choices_with_key({choices})
			choices.forEach((choice, index) => {
				if (index === choices.length - 1)
					msg += '\n └' + render_choice(choice)
				else
					msg += '\n ├' + render_choice(choice)
			})
		}

		let indent_col_count = 0
		switch(side) {
			case '→':
				indent_col_count = MSG_L_INDENT
				break
			case '←':
				indent_col_count = MSG_R_INDENT
				break
			case '↔':
			default:
				throw new Error(`display_message(): incorrect side!`)
				break
		}
		msg = indent_string(
			msg,
			indent_col_count,
			{indent: ' '}
		)

		console.log(msg)
	}

	function read_string(step) {
		if (DEBUG) console.log(`↘ read_string(\n${prettify_params_for_debug(step)}\n)`)
		return new Promise(resolve => {
				//rli.clearLine(process.stdout, 0)
				rli.prompt()

				rli.question('', answer => {
					rli.clearLine(process.stdout, 0)
					answer = String(answer).trim()
					if (DEBUG) console.log(`[You entered: "${answer}"]`)
					resolve(answer)
				})
			})
			.then(answer => {
				if (step.msgg_as_user)
					return display_message({
							msg: step.msgg_as_user(answer),
							side: '←'
						})
						.then(() => answer)

				return answer
			})
	}

	function read_key_sequence() {
		if (DEBUG) console.log('↘ read_key_sequence()')
		return new Promise(resolve => {
			//process.stdin.setRawMode(true)
			rli.prompt()
			state.keypress_callback = key => {
				//process.stdin.setRawMode(false)
				state.keypress_callback = null
				rli.clearLine(process.stdout, 0)
				resolve(key)
			}
		})
			.catch(() => process.stdin.setRawMode(false))
	}

	async function read_choice(step) {
		if (DEBUG) console.log('↘ read_choice()')
		const allowed_keys = step.choices.map(choice => choice._ui_tty.key.name).join(',')
		if (DEBUG) console.log('  available choices: ' + allowed_keys)
		let answer = undefined
		while (typeof answer === 'undefined') {
			const key = await read_key_sequence()
			const choice = step.choices.find(choice => choice._ui_tty.key.name === key.name)
			if(!choice) {
				console.log(`[please select a correct choice: ${allowed_keys}]`)
			}
			else {
				answer = choice.value
				// TODO display here ?
				await display_message({
					msg: (choice.msgg_as_user || step.msgg_as_user || (() => choice.msg_cta))(answer),
					// () => choice.msg_cta
					// x => String(x)
					side: '←'
				})
			}
		}
		return answer
	}

	async function read_answer(step) {
		if (DEBUG) console.log('↘ read_answer()')
		switch (step.type) {
			case 'ask_for_string':
				return read_string(step)
			case 'ask_for_choice':
				return read_choice(step)
			/*
			case 'confirm':

			if (step.msgg_confirm) {
				ok = await ask_user_for_confirmation(step.msgg_confirm(answer))
				if (DEBUG) console.log(`↖ ask_user(…) confirmation = "${ok}"`)
			}
			 */
			default:
				throw new Error(`Unsupported step type: "${step.type}"!`)
		}
	}

	async function teardown() {
		if (DEBUG) console.log('↘ teardown()')
		rli.close()
	}

	return {
		setup: () => {console.log('')},
		display_message,
		read_answer,
		spin_until_resolution,
		pretend_to_think,
		display_progress,
		teardown,
	}
}


module.exports = {
	create,
}


/***/ }),
/* 218 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const chalk = __webpack_require__(220);
const cliCursor = __webpack_require__(224);
const cliSpinners = __webpack_require__(228);
const logSymbols = __webpack_require__(230);

class Ora {
	constructor(options) {
		if (typeof options === 'string') {
			options = {
				text: options
			};
		}

		this.options = Object.assign({
			text: '',
			color: 'cyan',
			stream: process.stderr
		}, options);

		const sp = this.options.spinner;
		this.spinner = typeof sp === 'object' ? sp : (process.platform === 'win32' ? cliSpinners.line : (cliSpinners[sp] || cliSpinners.dots)); // eslint-disable-line no-nested-ternary

		if (this.spinner.frames === undefined) {
			throw new Error('Spinner must define `frames`');
		}

		this.text = this.options.text;
		this.color = this.options.color;
		this.interval = this.options.interval || this.spinner.interval || 100;
		this.stream = this.options.stream;
		this.id = null;
		this.frameIndex = 0;
		this.enabled = typeof this.options.enabled === 'boolean' ? this.options.enabled : ((this.stream && this.stream.isTTY) && !process.env.CI);
	}
	frame() {
		const frames = this.spinner.frames;
		let frame = frames[this.frameIndex];

		if (this.color) {
			frame = chalk[this.color](frame);
		}

		this.frameIndex = ++this.frameIndex % frames.length;

		return frame + ' ' + this.text;
	}
	clear() {
		if (!this.enabled) {
			return this;
		}

		this.stream.clearLine();
		this.stream.cursorTo(0);

		return this;
	}
	render() {
		this.clear();
		this.stream.write(this.frame());

		return this;
	}
	start(text) {
		if (text) {
			this.text = text;
		}

		if (!this.enabled || this.id) {
			return this;
		}

		cliCursor.hide(this.stream);
		this.render();
		this.id = setInterval(this.render.bind(this), this.interval);

		return this;
	}
	stop() {
		if (!this.enabled) {
			return this;
		}

		clearInterval(this.id);
		this.id = null;
		this.frameIndex = 0;
		this.clear();
		cliCursor.show(this.stream);

		return this;
	}
	succeed(text) {
		return this.stopAndPersist({symbol: logSymbols.success, text});
	}
	fail(text) {
		return this.stopAndPersist({symbol: logSymbols.error, text});
	}
	warn(text) {
		return this.stopAndPersist({symbol: logSymbols.warning, text});
	}
	info(text) {
		return this.stopAndPersist({symbol: logSymbols.info, text});
	}
	stopAndPersist(options) {
		// Legacy argument
		// TODO: Deprecate sometime in the future
		if (typeof options === 'string') {
			options = {
				symbol: options
			};
		}

		options = options || {};

		this.stop();
		this.stream.write(`${options.symbol || ' '} ${options.text || this.text}\n`);

		return this;
	}
}

module.exports = function (opts) {
	return new Ora(opts);
};

module.exports.promise = (action, options) => {
	if (typeof action.then !== 'function') {
		throw new TypeError('Parameter `action` must be a Promise');
	}

	const spinner = new Ora(options);
	spinner.start();

	action.then(
		() => {
			spinner.succeed();
		},
		() => {
			spinner.fail();
		}
	);

	return spinner;
};


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var escapeStringRegexp = __webpack_require__(33);
var ansiStyles = __webpack_require__(84);
var stripAnsi = __webpack_require__(221);
var hasAnsi = __webpack_require__(222);
var supportsColor = __webpack_require__(223);
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;


/***/ }),
/* 221 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(15)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(15);
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const restoreCursor = __webpack_require__(225);

let hidden = false;

exports.show = stream => {
	const s = stream || process.stderr;

	if (!s.isTTY) {
		return;
	}

	hidden = false;
	s.write('\u001b[?25h');
};

exports.hide = stream => {
	const s = stream || process.stderr;

	if (!s.isTTY) {
		return;
	}

	restoreCursor();
	hidden = true;
	s.write('\u001b[?25l');
};

exports.toggle = (force, stream) => {
	if (force !== undefined) {
		hidden = force;
	}

	if (hidden) {
		exports.show(stream);
	} else {
		exports.hide(stream);
	}
};


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const onetime = __webpack_require__(226);
const signalExit = __webpack_require__(37);

module.exports = onetime(() => {
	signalExit(() => {
		process.stderr.write('\u001b[?25h');
	}, {alwaysLast: true});
});


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const mimicFn = __webpack_require__(227);

module.exports = (fn, opts) => {
	// TODO: Remove this in v3
	if (opts === true) {
		throw new TypeError('The second argument is now an options object');
	}

	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	opts = opts || {};

	let ret;
	let called = false;
	const fnName = fn.displayName || fn.name || '<anonymous>';

	const onetime = function () {
		if (called) {
			if (opts.throw === true) {
				throw new Error(`Function \`${fnName}\` can only be called once`);
			}

			return ret;
		}

		called = true;
		ret = fn.apply(this, arguments);
		fn = null;

		return ret;
	};

	mimicFn(onetime, fn);

	return onetime;
};


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (to, from) => {
	// TODO: use `Reflect.ownKeys()` when targeting Node.js 6
	for (const prop of Object.getOwnPropertyNames(from).concat(Object.getOwnPropertySymbols(from))) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}
};


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = __webpack_require__(229);


/***/ }),
/* 229 */
/***/ (function(module, exports) {

module.exports = {"dots":{"interval":80,"frames":["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]},"dots2":{"interval":80,"frames":["⣾","⣽","⣻","⢿","⡿","⣟","⣯","⣷"]},"dots3":{"interval":80,"frames":["⠋","⠙","⠚","⠞","⠖","⠦","⠴","⠲","⠳","⠓"]},"dots4":{"interval":80,"frames":["⠄","⠆","⠇","⠋","⠙","⠸","⠰","⠠","⠰","⠸","⠙","⠋","⠇","⠆"]},"dots5":{"interval":80,"frames":["⠋","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋"]},"dots6":{"interval":80,"frames":["⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠴","⠲","⠒","⠂","⠂","⠒","⠚","⠙","⠉","⠁"]},"dots7":{"interval":80,"frames":["⠈","⠉","⠋","⠓","⠒","⠐","⠐","⠒","⠖","⠦","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈"]},"dots8":{"interval":80,"frames":["⠁","⠁","⠉","⠙","⠚","⠒","⠂","⠂","⠒","⠲","⠴","⠤","⠄","⠄","⠤","⠠","⠠","⠤","⠦","⠖","⠒","⠐","⠐","⠒","⠓","⠋","⠉","⠈","⠈"]},"dots9":{"interval":80,"frames":["⢹","⢺","⢼","⣸","⣇","⡧","⡗","⡏"]},"dots10":{"interval":80,"frames":["⢄","⢂","⢁","⡁","⡈","⡐","⡠"]},"dots11":{"interval":100,"frames":["⠁","⠂","⠄","⡀","⢀","⠠","⠐","⠈"]},"dots12":{"interval":80,"frames":["⢀⠀","⡀⠀","⠄⠀","⢂⠀","⡂⠀","⠅⠀","⢃⠀","⡃⠀","⠍⠀","⢋⠀","⡋⠀","⠍⠁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⢈⠩","⡀⢙","⠄⡙","⢂⠩","⡂⢘","⠅⡘","⢃⠨","⡃⢐","⠍⡐","⢋⠠","⡋⢀","⠍⡁","⢋⠁","⡋⠁","⠍⠉","⠋⠉","⠋⠉","⠉⠙","⠉⠙","⠉⠩","⠈⢙","⠈⡙","⠈⠩","⠀⢙","⠀⡙","⠀⠩","⠀⢘","⠀⡘","⠀⠨","⠀⢐","⠀⡐","⠀⠠","⠀⢀","⠀⡀"]},"line":{"interval":130,"frames":["-","\\","|","/"]},"line2":{"interval":100,"frames":["⠂","-","–","—","–","-"]},"pipe":{"interval":100,"frames":["┤","┘","┴","└","├","┌","┬","┐"]},"simpleDots":{"interval":400,"frames":[".  ",".. ","...","   "]},"simpleDotsScrolling":{"interval":200,"frames":[".  ",".. ","..."," ..","  .","   "]},"star":{"interval":70,"frames":["✶","✸","✹","✺","✹","✷"]},"star2":{"interval":80,"frames":["+","x","*"]},"flip":{"interval":70,"frames":["_","_","_","-","`","`","'","´","-","_","_","_"]},"hamburger":{"interval":100,"frames":["☱","☲","☴"]},"growVertical":{"interval":120,"frames":["▁","▃","▄","▅","▆","▇","▆","▅","▄","▃"]},"growHorizontal":{"interval":120,"frames":["▏","▎","▍","▌","▋","▊","▉","▊","▋","▌","▍","▎"]},"balloon":{"interval":140,"frames":[" ",".","o","O","@","*"," "]},"balloon2":{"interval":120,"frames":[".","o","O","°","O","o","."]},"noise":{"interval":100,"frames":["▓","▒","░"]},"bounce":{"interval":120,"frames":["⠁","⠂","⠄","⠂"]},"boxBounce":{"interval":120,"frames":["▖","▘","▝","▗"]},"boxBounce2":{"interval":100,"frames":["▌","▀","▐","▄"]},"triangle":{"interval":50,"frames":["◢","◣","◤","◥"]},"arc":{"interval":100,"frames":["◜","◠","◝","◞","◡","◟"]},"circle":{"interval":120,"frames":["◡","⊙","◠"]},"squareCorners":{"interval":180,"frames":["◰","◳","◲","◱"]},"circleQuarters":{"interval":120,"frames":["◴","◷","◶","◵"]},"circleHalves":{"interval":50,"frames":["◐","◓","◑","◒"]},"squish":{"interval":100,"frames":["╫","╪"]},"toggle":{"interval":250,"frames":["⊶","⊷"]},"toggle2":{"interval":80,"frames":["▫","▪"]},"toggle3":{"interval":120,"frames":["□","■"]},"toggle4":{"interval":100,"frames":["■","□","▪","▫"]},"toggle5":{"interval":100,"frames":["▮","▯"]},"toggle6":{"interval":300,"frames":["ဝ","၀"]},"toggle7":{"interval":80,"frames":["⦾","⦿"]},"toggle8":{"interval":100,"frames":["◍","◌"]},"toggle9":{"interval":100,"frames":["◉","◎"]},"toggle10":{"interval":100,"frames":["㊂","㊀","㊁"]},"toggle11":{"interval":50,"frames":["⧇","⧆"]},"toggle12":{"interval":120,"frames":["☗","☖"]},"toggle13":{"interval":80,"frames":["=","*","-"]},"arrow":{"interval":100,"frames":["←","↖","↑","↗","→","↘","↓","↙"]},"arrow2":{"interval":80,"frames":["⬆️ ","↗️ ","➡️ ","↘️ ","⬇️ ","↙️ ","⬅️ ","↖️ "]},"arrow3":{"interval":120,"frames":["▹▹▹▹▹","▸▹▹▹▹","▹▸▹▹▹","▹▹▸▹▹","▹▹▹▸▹","▹▹▹▹▸"]},"bouncingBar":{"interval":80,"frames":["[    ]","[=   ]","[==  ]","[=== ]","[ ===]","[  ==]","[   =]","[    ]","[   =]","[  ==]","[ ===]","[====]","[=== ]","[==  ]","[=   ]"]},"bouncingBall":{"interval":80,"frames":["( ●    )","(  ●   )","(   ●  )","(    ● )","(     ●)","(    ● )","(   ●  )","(  ●   )","( ●    )","(●     )"]},"smiley":{"interval":200,"frames":["😄 ","😝 "]},"monkey":{"interval":300,"frames":["🙈 ","🙈 ","🙉 ","🙊 "]},"hearts":{"interval":100,"frames":["💛 ","💙 ","💜 ","💚 ","❤️ "]},"clock":{"interval":100,"frames":["🕐 ","🕑 ","🕒 ","🕓 ","🕔 ","🕕 ","🕖 ","🕗 ","🕘 ","🕙 ","🕚 "]},"earth":{"interval":180,"frames":["🌍 ","🌎 ","🌏 "]},"moon":{"interval":80,"frames":["🌑 ","🌒 ","🌓 ","🌔 ","🌕 ","🌖 ","🌗 ","🌘 "]},"runner":{"interval":140,"frames":["🚶 ","🏃 "]},"pong":{"interval":80,"frames":["▐⠂       ▌","▐⠈       ▌","▐ ⠂      ▌","▐ ⠠      ▌","▐  ⡀     ▌","▐  ⠠     ▌","▐   ⠂    ▌","▐   ⠈    ▌","▐    ⠂   ▌","▐    ⠠   ▌","▐     ⡀  ▌","▐     ⠠  ▌","▐      ⠂ ▌","▐      ⠈ ▌","▐       ⠂▌","▐       ⠠▌","▐       ⡀▌","▐      ⠠ ▌","▐      ⠂ ▌","▐     ⠈  ▌","▐     ⠂  ▌","▐    ⠠   ▌","▐    ⡀   ▌","▐   ⠠    ▌","▐   ⠂    ▌","▐  ⠈     ▌","▐  ⠂     ▌","▐ ⠠      ▌","▐ ⡀      ▌","▐⠠       ▌"]},"shark":{"interval":120,"frames":["▐|\\____________▌","▐_|\\___________▌","▐__|\\__________▌","▐___|\\_________▌","▐____|\\________▌","▐_____|\\_______▌","▐______|\\______▌","▐_______|\\_____▌","▐________|\\____▌","▐_________|\\___▌","▐__________|\\__▌","▐___________|\\_▌","▐____________|\\▌","▐____________/|▌","▐___________/|_▌","▐__________/|__▌","▐_________/|___▌","▐________/|____▌","▐_______/|_____▌","▐______/|______▌","▐_____/|_______▌","▐____/|________▌","▐___/|_________▌","▐__/|__________▌","▐_/|___________▌","▐/|____________▌"]},"dqpb":{"interval":100,"frames":["d","q","p","b"]},"weather":{"interval":100,"frames":["☀️ ","☀️ ","☀️ ","🌤 ","⛅️ ","🌥 ","☁️ ","🌧 ","🌨 ","🌧 ","🌨 ","🌧 ","🌨 ","⛈ ","🌨 ","🌧 ","🌨 ","☁️ ","🌥 ","⛅️ ","🌤 ","☀️ ","☀️ "]},"christmas":{"interval":400,"frames":["🌲","🎄"]}}

/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var chalk = __webpack_require__(231);

var main = {
	info: chalk.blue('ℹ'),
	success: chalk.green('✔'),
	warning: chalk.yellow('⚠'),
	error: chalk.red('✖')
};

var win = {
	info: chalk.blue('i'),
	success: chalk.green('√'),
	warning: chalk.yellow('‼'),
	error: chalk.red('×')
};

module.exports = process.platform === 'win32' ? win : main;


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var escapeStringRegexp = __webpack_require__(33);
var ansiStyles = __webpack_require__(84);
var stripAnsi = __webpack_require__(232);
var hasAnsi = __webpack_require__(233);
var supportsColor = __webpack_require__(234);
var defineProps = Object.defineProperties;
var isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

function Chalk(options) {
	// detect mode if not set manually
	this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;
}

// use bright blue on Windows as the normal blue color is illegible
if (isSimpleWindowsTerm) {
	ansiStyles.blue.open = '\u001b[94m';
}

var styles = (function () {
	var ret = {};

	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');

		ret[key] = {
			get: function () {
				return build.call(this, this._styles.concat(key));
			}
		};
	});

	return ret;
})();

var proto = defineProps(function chalk() {}, styles);

function build(_styles) {
	var builder = function () {
		return applyStyle.apply(builder, arguments);
	};

	builder._styles = _styles;
	builder.enabled = this.enabled;
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	/* eslint-disable no-proto */
	builder.__proto__ = proto;

	return builder;
}

function applyStyle() {
	// support varags, but simply cast to string in case there's only one arg
	var args = arguments;
	var argsLen = args.length;
	var str = argsLen !== 0 && String(arguments[0]);

	if (argsLen > 1) {
		// don't slice `arguments`, it prevents v8 optimizations
		for (var a = 1; a < argsLen; a++) {
			str += ' ' + args[a];
		}
	}

	if (!this.enabled || !str) {
		return str;
	}

	var nestedStyles = this._styles;
	var i = nestedStyles.length;

	// Turns out that on Windows dimmed gray text becomes invisible in cmd.exe,
	// see https://github.com/chalk/chalk/issues/58
	// If we're on Windows and we're dealing with a gray color, temporarily make 'dim' a noop.
	var originalDim = ansiStyles.dim.open;
	if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1)) {
		ansiStyles.dim.open = '';
	}

	while (i--) {
		var code = ansiStyles[nestedStyles[i]];

		// Replace any instances already present with a re-opening code
		// otherwise only the part of the string until said closing code
		// will be colored, and the rest will simply be 'plain'.
		str = code.open + str.replace(code.closeRe, code.open) + code.close;
	}

	// Reset the original 'dim' if we changed it to work around the Windows dimmed gray issue.
	ansiStyles.dim.open = originalDim;

	return str;
}

function init() {
	var ret = {};

	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build.call(this, [name]);
			}
		};
	});

	return ret;
}

defineProps(Chalk.prototype, init());

module.exports = new Chalk();
module.exports.styles = ansiStyles;
module.exports.hasColor = hasAnsi;
module.exports.stripColor = stripAnsi;
module.exports.supportsColor = supportsColor;


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(15)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(15);
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var argv = process.argv;

var terminator = argv.indexOf('--');
var hasFlag = function (flag) {
	flag = '--' + flag;
	var pos = argv.indexOf(flag);
	return pos !== -1 && (terminator !== -1 ? pos < terminator : true);
};

module.exports = (function () {
	if ('FORCE_COLOR' in process.env) {
		return true;
	}

	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false')) {
		return false;
	}

	if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		return true;
	}

	if (process.stdout && !process.stdout.isTTY) {
		return false;
	}

	if (process.platform === 'win32') {
		return true;
	}

	if ('COLORTERM' in process.env) {
		return true;
	}

	if (process.env.TERM === 'dumb') {
		return false;
	}

	if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
		return true;
	}

	return false;
})();


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Plumbing = __webpack_require__(236)
var hasUnicode = __webpack_require__(243)
var hasColor = __webpack_require__(244)
var onExit = __webpack_require__(37)
var defaultThemes = __webpack_require__(245)
var setInterval = __webpack_require__(250)
var process = __webpack_require__(92)
var setImmediate = __webpack_require__(251)

module.exports = Gauge

function callWith (obj, method) {
  return function () {
    return method.call(obj)
  }
}

function Gauge (arg1, arg2) {
  var options, writeTo
  if (arg1 && arg1.write) {
    writeTo = arg1
    options = arg2 || {}
  } else if (arg2 && arg2.write) {
    writeTo = arg2
    options = arg1 || {}
  } else {
    writeTo = process.stderr
    options = arg1 || arg2 || {}
  }

  this._status = {
    spun: 0,
    section: '',
    subsection: ''
  }
  this._paused = false // are we paused for back pressure?
  this._disabled = true // are all progress bar updates disabled?
  this._showing = false // do we WANT the progress bar on screen
  this._onScreen = false // IS the progress bar on screen
  this._needsRedraw = false // should we print something at next tick?
  this._hideCursor = options.hideCursor == null ? true : options.hideCursor
  this._fixedFramerate = options.fixedFramerate == null
    ? !(/^v0\.8\./.test(process.version))
    : options.fixedFramerate
  this._lastUpdateAt = null
  this._updateInterval = options.updateInterval == null ? 50 : options.updateInterval

  this._themes = options.themes || defaultThemes
  this._theme = options.theme
  var theme = this._computeTheme(options.theme)
  var template = options.template || [
    {type: 'progressbar', length: 20},
    {type: 'activityIndicator', kerning: 1, length: 1},
    {type: 'section', kerning: 1, default: ''},
    {type: 'subsection', kerning: 1, default: ''}
  ]
  this.setWriteTo(writeTo, options.tty)
  var PlumbingClass = options.Plumbing || Plumbing
  this._gauge = new PlumbingClass(theme, template, this.getWidth())

  this._$$doRedraw = callWith(this, this._doRedraw)
  this._$$handleSizeChange = callWith(this, this._handleSizeChange)

  this._cleanupOnExit = options.cleanupOnExit == null || options.cleanupOnExit
  this._removeOnExit = null

  if (options.enabled || (options.enabled == null && this._tty && this._tty.isTTY)) {
    this.enable()
  } else {
    this.disable()
  }
}
Gauge.prototype = {}

Gauge.prototype.isEnabled = function () {
  return !this._disabled
}

Gauge.prototype.setTemplate = function (template) {
  this._gauge.setTemplate(template)
  if (this._showing) this._requestRedraw()
}

Gauge.prototype._computeTheme = function (theme) {
  if (!theme) theme = {}
  if (typeof theme === 'string') {
    theme = this._themes.getTheme(theme)
  } else if (theme && (Object.keys(theme).length === 0 || theme.hasUnicode != null || theme.hasColor != null)) {
    var useUnicode = theme.hasUnicode == null ? hasUnicode() : theme.hasUnicode
    var useColor = theme.hasColor == null ? hasColor : theme.hasColor
    theme = this._themes.getDefault({hasUnicode: useUnicode, hasColor: useColor, platform: theme.platform})
  }
  return theme
}

Gauge.prototype.setThemeset = function (themes) {
  this._themes = themes
  this.setTheme(this._theme)
}

Gauge.prototype.setTheme = function (theme) {
  this._gauge.setTheme(this._computeTheme(theme))
  if (this._showing) this._requestRedraw()
  this._theme = theme
}

Gauge.prototype._requestRedraw = function () {
  this._needsRedraw = true
  if (!this._fixedFramerate) this._doRedraw()
}

Gauge.prototype.getWidth = function () {
  return ((this._tty && this._tty.columns) || 80) - 1
}

Gauge.prototype.setWriteTo = function (writeTo, tty) {
  var enabled = !this._disabled
  if (enabled) this.disable()
  this._writeTo = writeTo
  this._tty = tty ||
    (writeTo === process.stderr && process.stdout.isTTY && process.stdout) ||
    (writeTo.isTTY && writeTo) ||
    this._tty
  if (this._gauge) this._gauge.setWidth(this.getWidth())
  if (enabled) this.enable()
}

Gauge.prototype.enable = function () {
  if (!this._disabled) return
  this._disabled = false
  if (this._tty) this._enableEvents()
  if (this._showing) this.show()
}

Gauge.prototype.disable = function () {
  if (this._disabled) return
  if (this._showing) {
    this._lastUpdateAt = null
    this._showing = false
    this._doRedraw()
    this._showing = true
  }
  this._disabled = true
  if (this._tty) this._disableEvents()
}

Gauge.prototype._enableEvents = function () {
  if (this._cleanupOnExit) {
    this._removeOnExit = onExit(callWith(this, this.disable))
  }
  this._tty.on('resize', this._$$handleSizeChange)
  if (this._fixedFramerate) {
    this.redrawTracker = setInterval(this._$$doRedraw, this._updateInterval)
    if (this.redrawTracker.unref) this.redrawTracker.unref()
  }
}

Gauge.prototype._disableEvents = function () {
  this._tty.removeListener('resize', this._$$handleSizeChange)
  if (this._fixedFramerate) clearInterval(this.redrawTracker)
  if (this._removeOnExit) this._removeOnExit()
}

Gauge.prototype.hide = function (cb) {
  if (this._disabled) return cb && process.nextTick(cb)
  if (!this._showing) return cb && process.nextTick(cb)
  this._showing = false
  this._doRedraw()
  cb && setImmediate(cb)
}

Gauge.prototype.show = function (section, completed) {
  this._showing = true
  if (typeof section === 'string') {
    this._status.section = section
  } else if (typeof section === 'object') {
    var sectionKeys = Object.keys(section)
    for (var ii = 0; ii < sectionKeys.length; ++ii) {
      var key = sectionKeys[ii]
      this._status[key] = section[key]
    }
  }
  if (completed != null) this._status.completed = completed
  if (this._disabled) return
  this._requestRedraw()
}

Gauge.prototype.pulse = function (subsection) {
  this._status.subsection = subsection || ''
  this._status.spun ++
  if (this._disabled) return
  if (!this._showing) return
  this._requestRedraw()
}

Gauge.prototype._handleSizeChange = function () {
  this._gauge.setWidth(this._tty.columns - 1)
  this._requestRedraw()
}

Gauge.prototype._doRedraw = function () {
  if (this._disabled || this._paused) return
  if (!this._fixedFramerate) {
    var now = Date.now()
    if (this._lastUpdateAt && now - this._lastUpdateAt < this._updateInterval) return
    this._lastUpdateAt = now
  }
  if (!this._showing && this._onScreen) {
    this._onScreen = false
    var result = this._gauge.hide()
    if (this._hideCursor) {
      result += this._gauge.showCursor()
    }
    return this._writeTo.write(result)
  }
  if (!this._showing && !this._onScreen) return
  if (this._showing && !this._onScreen) {
    this._onScreen = true
    this._needsRedraw = true
    if (this._hideCursor) {
      this._writeTo.write(this._gauge.hideCursor())
    }
  }
  if (!this._needsRedraw) return
  if (!this._writeTo.write(this._gauge.show(this._status))) {
    this._paused = true
    this._writeTo.on('drain', callWith(this, function () {
      this._paused = false
      this._doRedraw()
    }))
  }
}


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var consoleControl = __webpack_require__(85)
var renderTemplate = __webpack_require__(86)
var validate = __webpack_require__(39)

var Plumbing = module.exports = function (theme, template, width) {
  if (!width) width = 80
  validate('OAN', [theme, template, width])
  this.showing = false
  this.theme = theme
  this.width = width
  this.template = template
}
Plumbing.prototype = {}

Plumbing.prototype.setTheme = function (theme) {
  validate('O', [theme])
  this.theme = theme
}

Plumbing.prototype.setTemplate = function (template) {
  validate('A', [template])
  this.template = template
}

Plumbing.prototype.setWidth = function (width) {
  validate('N', [width])
  this.width = width
}

Plumbing.prototype.hide = function () {
  return consoleControl.gotoSOL() + consoleControl.eraseLine()
}

Plumbing.prototype.hideCursor = consoleControl.hideCursor

Plumbing.prototype.showCursor = consoleControl.showCursor

Plumbing.prototype.show = function (status) {
  var values = Object.create(this.theme)
  for (var key in status) {
    values[key] = status[key]
  }

  return renderTemplate(this.width, this.template, values).trim() +
         consoleControl.color('reset') +
         consoleControl.eraseLine() + consoleControl.gotoSOL()
}


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stringWidth = __webpack_require__(238)

exports.center = alignCenter
exports.left = alignLeft
exports.right = alignRight

// lodash's way of generating pad characters.

function createPadding (width) {
  var result = ''
  var string = ' '
  var n = width
  do {
    if (n % 2) {
      result += string;
    }
    n = Math.floor(n / 2);
    string += string;
  } while (n);

  return result;
}

function alignLeft (str, width) {
  var trimmed = str.trimRight()
  if (trimmed.length === 0 && str.length >= width) return str
  var padding = ''
  var strWidth = stringWidth(trimmed)

  if (strWidth < width) {
    padding = createPadding(width - strWidth)
  }

  return trimmed + padding
}

function alignRight (str, width) {
  var trimmed = str.trimLeft()
  if (trimmed.length === 0 && str.length >= width) return str
  var padding = ''
  var strWidth = stringWidth(trimmed)

  if (strWidth < width) {
    padding = createPadding(width - strWidth)
  }

  return padding + trimmed
}

function alignCenter (str, width) {
  var trimmed = str.trim()
  if (trimmed.length === 0 && str.length >= width) return str
  var padLeft = ''
  var padRight = ''
  var strWidth = stringWidth(trimmed)

  if (strWidth < width) {
    var padLeftBy = parseInt((width - strWidth) / 2, 10) 
    padLeft = createPadding(padLeftBy)
    padRight = createPadding(width - (strWidth + padLeftBy))
  }

  return padLeft + trimmed + padRight
}


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stripAnsi = __webpack_require__(239);
var codePointAt = __webpack_require__(87);
var isFullwidthCodePoint = __webpack_require__(88);

// https://github.com/nodejs/io.js/blob/cff7300a578be1b10001f2d967aaedc88aee6402/lib/readline.js#L1345
module.exports = function (str) {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	var width = 0;

	str = stripAnsi(str);

	for (var i = 0; i < str.length; i++) {
		var code = codePointAt(str, i);

		// ignore control characters
		if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
			continue;
		}

		// surrogates
		if (code >= 0x10000) {
			i++;
		}

		if (isFullwidthCodePoint(code)) {
			width += 2;
		} else {
			width++;
		}
	}

	return width;
};


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(15)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Number.isNaN || function (x) {
	return x !== x;
};


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var util = __webpack_require__(16)

var User = exports.User = function User (msg) {
  var err = new Error(msg)
  Error.captureStackTrace(err, User)
  err.code = 'EGAUGE'
  return err
}

exports.MissingTemplateValue = function MissingTemplateValue (item, values) {
  var err = new User(util.format('Missing template value "%s"', item.type))
  Error.captureStackTrace(err, MissingTemplateValue)
  err.template = item
  err.values = values
  return err
}

exports.Internal = function Internal (msg) {
  var err = new Error(msg)
  Error.captureStackTrace(err, Internal)
  err.code = 'EGAUGEINTERNAL'
  return err
}


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stringWidth = __webpack_require__(40)

module.exports = TemplateItem

function isPercent (num) {
  if (typeof num !== 'string') return false
  return num.slice(-1) === '%'
}

function percent (num) {
  return Number(num.slice(0, -1)) / 100
}

function TemplateItem (values, outputLength) {
  this.overallOutputLength = outputLength
  this.finished = false
  this.type = null
  this.value = null
  this.length = null
  this.maxLength = null
  this.minLength = null
  this.kerning = null
  this.align = 'left'
  this.padLeft = 0
  this.padRight = 0
  this.index = null
  this.first = null
  this.last = null
  if (typeof values === 'string') {
    this.value = values
  } else {
    for (var prop in values) this[prop] = values[prop]
  }
  // Realize percents
  if (isPercent(this.length)) {
    this.length = Math.round(this.overallOutputLength * percent(this.length))
  }
  if (isPercent(this.minLength)) {
    this.minLength = Math.round(this.overallOutputLength * percent(this.minLength))
  }
  if (isPercent(this.maxLength)) {
    this.maxLength = Math.round(this.overallOutputLength * percent(this.maxLength))
  }
  return this
}

TemplateItem.prototype = {}

TemplateItem.prototype.getBaseLength = function () {
  var length = this.length
  if (length == null && typeof this.value === 'string' && this.maxLength == null && this.minLength == null) {
    length = stringWidth(this.value)
  }
  return length
}

TemplateItem.prototype.getLength = function () {
  var length = this.getBaseLength()
  if (length == null) return null
  return length + this.padLeft + this.padRight
}

TemplateItem.prototype.getMaxLength = function () {
  if (this.maxLength == null) return null
  return this.maxLength + this.padLeft + this.padRight
}

TemplateItem.prototype.getMinLength = function () {
  if (this.minLength == null) return null
  return this.minLength + this.padLeft + this.padRight
}



/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var os = __webpack_require__(34)

var hasUnicode = module.exports = function () {
  // Recent Win32 platforms (>XP) CAN support unicode in the console but
  // don't have to, and in non-english locales often use traditional local
  // code pages. There's no way, short of windows system calls or execing
  // the chcp command line program to figure this out. As such, we default
  // this to false and encourage your users to override it via config if
  // appropriate.
  if (os.type() == "Windows_NT") { return false }

  var isUTF8 = /UTF-?8$/i
  var ctype = process.env.LC_ALL || process.env.LC_CTYPE || process.env.LANG
  return isUTF8.test(ctype)
}


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = isWin32() || isColorTerm()

function isWin32 () {
  return process.platform === 'win32'
}

function isColorTerm () {
  var termHasColor = /^screen|^xterm|^vt100|color|ansi|cygwin|linux/i
  return !!process.env.COLORTERM || termHasColor.test(process.env.TERM)
}


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var consoleControl = __webpack_require__(85)
var ThemeSet = __webpack_require__(246)

var themes = module.exports = new ThemeSet()

themes.addTheme('ASCII', {
  preProgressbar: '[',
  postProgressbar: ']',
  progressbarTheme: {
    complete: '#',
    remaining: '.'
  },
  activityIndicatorTheme: '-\\|/',
  preSubsection: '>'
})

themes.addTheme('colorASCII', themes.getTheme('ASCII'), {
  progressbarTheme: {
    preComplete: consoleControl.color('inverse'),
    complete: ' ',
    postComplete: consoleControl.color('stopInverse'),
    preRemaining: consoleControl.color('brightBlack'),
    remaining: '.',
    postRemaining: consoleControl.color('reset')
  }
})

themes.addTheme('brailleSpinner', {
  preProgressbar: '⸨',
  postProgressbar: '⸩',
  progressbarTheme: {
    complete: '░',
    remaining: '⠂'
  },
  activityIndicatorTheme: '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
  preSubsection: '>'
})

themes.addTheme('colorBrailleSpinner', themes.getTheme('brailleSpinner'), {
  progressbarTheme: {
    preComplete: consoleControl.color('inverse'),
    complete: ' ',
    postComplete: consoleControl.color('stopInverse'),
    preRemaining: consoleControl.color('brightBlack'),
    remaining: '░',
    postRemaining: consoleControl.color('reset')
  }
})

themes.setDefault({}, 'ASCII')
themes.setDefault({hasColor: true}, 'colorASCII')
themes.setDefault({platform: 'darwin', hasUnicode: true}, 'brailleSpinner')
themes.setDefault({platform: 'darwin', hasUnicode: true, hasColor: true}, 'colorBrailleSpinner')


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var objectAssign = __webpack_require__(89)

module.exports = function () {
  return ThemeSetProto.newThemeSet()
}

var ThemeSetProto = {}

ThemeSetProto.baseTheme = __webpack_require__(247)

ThemeSetProto.newTheme = function (parent, theme) {
  if (!theme) {
    theme = parent
    parent = this.baseTheme
  }
  return objectAssign({}, parent, theme)
}

ThemeSetProto.getThemeNames = function () {
  return Object.keys(this.themes)
}

ThemeSetProto.addTheme = function (name, parent, theme) {
  this.themes[name] = this.newTheme(parent, theme)
}

ThemeSetProto.addToAllThemes = function (theme) {
  var themes = this.themes
  Object.keys(themes).forEach(function (name) {
    objectAssign(themes[name], theme)
  })
  objectAssign(this.baseTheme, theme)
}

ThemeSetProto.getTheme = function (name) {
  if (!this.themes[name]) throw this.newMissingThemeError(name)
  return this.themes[name]
}

ThemeSetProto.setDefault = function (opts, name) {
  if (name == null) {
    name = opts
    opts = {}
  }
  var platform = opts.platform == null ? 'fallback' : opts.platform
  var hasUnicode = !!opts.hasUnicode
  var hasColor = !!opts.hasColor
  if (!this.defaults[platform]) this.defaults[platform] = {true: {}, false: {}}
  this.defaults[platform][hasUnicode][hasColor] = name
}

ThemeSetProto.getDefault = function (opts) {
  if (!opts) opts = {}
  var platformName = opts.platform || process.platform
  var platform = this.defaults[platformName] || this.defaults.fallback
  var hasUnicode = !!opts.hasUnicode
  var hasColor = !!opts.hasColor
  if (!platform) throw this.newMissingDefaultThemeError(platformName, hasUnicode, hasColor)
  if (!platform[hasUnicode][hasColor]) {
    if (hasUnicode && hasColor && platform[!hasUnicode][hasColor]) {
      hasUnicode = false
    } else if (hasUnicode && hasColor && platform[hasUnicode][!hasColor]) {
      hasColor = false
    } else if (hasUnicode && hasColor && platform[!hasUnicode][!hasColor]) {
      hasUnicode = false
      hasColor = false
    } else if (hasUnicode && !hasColor && platform[!hasUnicode][hasColor]) {
      hasUnicode = false
    } else if (!hasUnicode && hasColor && platform[hasUnicode][!hasColor]) {
      hasColor = false
    } else if (platform === this.defaults.fallback) {
      throw this.newMissingDefaultThemeError(platformName, hasUnicode, hasColor)
    }
  }
  if (platform[hasUnicode][hasColor]) {
    return this.getTheme(platform[hasUnicode][hasColor])
  } else {
    return this.getDefault(objectAssign({}, opts, {platform: 'fallback'}))
  }
}

ThemeSetProto.newMissingThemeError = function newMissingThemeError (name) {
  var err = new Error('Could not find a gauge theme named "' + name + '"')
  Error.captureStackTrace.call(err, newMissingThemeError)
  err.theme = name
  err.code = 'EMISSINGTHEME'
  return err
}

ThemeSetProto.newMissingDefaultThemeError = function newMissingDefaultThemeError (platformName, hasUnicode, hasColor) {
  var err = new Error(
    'Could not find a gauge theme for your platform/unicode/color use combo:\n' +
    '    platform = ' + platformName + '\n' +
    '    hasUnicode = ' + hasUnicode + '\n' +
    '    hasColor = ' + hasColor)
  Error.captureStackTrace.call(err, newMissingDefaultThemeError)
  err.platform = platformName
  err.hasUnicode = hasUnicode
  err.hasColor = hasColor
  err.code = 'EMISSINGTHEME'
  return err
}

ThemeSetProto.newThemeSet = function () {
  var themeset = function (opts) {
    return themeset.getDefault(opts)
  }
  return objectAssign(themeset, ThemeSetProto, {
    themes: objectAssign({}, this.themes),
    baseTheme: objectAssign({}, this.baseTheme),
    defaults: JSON.parse(JSON.stringify(this.defaults || {}))
  })
}



/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var spin = __webpack_require__(248)
var progressBar = __webpack_require__(249)

module.exports = {
  activityIndicator: function (values, theme, width) {
    if (values.spun == null) return
    return spin(theme, values.spun)
  },
  progressbar: function (values, theme, width) {
    if (values.completed == null) return
    return progressBar(theme, width, values.completed)
  }
}


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function spin (spinstr, spun) {
  return spinstr[spun % spinstr.length]
}


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var validate = __webpack_require__(39)
var renderTemplate = __webpack_require__(86)
var wideTruncate = __webpack_require__(90)
var stringWidth = __webpack_require__(40)

module.exports = function (theme, width, completed) {
  validate('ONN', [theme, width, completed])
  if (completed < 0) completed = 0
  if (completed > 1) completed = 1
  if (width <= 0) return ''
  var sofar = Math.round(width * completed)
  var rest = width - sofar
  var template = [
    {type: 'complete', value: repeat(theme.complete, sofar), length: sofar},
    {type: 'remaining', value: repeat(theme.remaining, rest), length: rest}
  ]
  return renderTemplate(width, template, theme)
}

// lodash's way of repeating
function repeat (string, width) {
  var result = ''
  var n = width
  do {
    if (n % 2) {
      result += string
    }
    n = Math.floor(n / 2)
    /*eslint no-self-assign: 0*/
    string += string
  } while (n && stringWidth(result) < width)

  return wideTruncate(result, width)
}


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// this exists so we can replace it during testing
module.exports = setInterval


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var process = __webpack_require__(92)
try {
  module.exports = setImmediate
} catch (ex) {
  module.exports = process.nextTick
}


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = (iterable, mapper, opts) => new Promise((resolve, reject) => {
	opts = Object.assign({
		concurrency: Infinity
	}, opts);

	if (typeof mapper !== 'function') {
		throw new TypeError('Mapper function is required');
	}

	const concurrency = opts.concurrency;

	if (!(typeof concurrency === 'number' && concurrency >= 1)) {
		throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${concurrency}\` (${typeof concurrency})`);
	}

	const ret = [];
	const iterator = iterable[Symbol.iterator]();
	let isRejected = false;
	let iterableDone = false;
	let resolvingCount = 0;
	let currentIdx = 0;

	const next = () => {
		if (isRejected) {
			return;
		}

		const nextItem = iterator.next();
		const i = currentIdx;
		currentIdx++;

		if (nextItem.done) {
			iterableDone = true;

			if (resolvingCount === 0) {
				resolve(ret);
			}

			return;
		}

		resolvingCount++;

		Promise.resolve(nextItem.value)
			.then(el => mapper(el, i))
			.then(
				val => {
					ret[i] = val;
					resolvingCount--;
					next();
				},
				err => {
					isRejected = true;
					reject(err);
				}
			);
	};

	for (let i = 0; i < concurrency; i++) {
		next();

		if (iterableDone) {
			break;
		}
	}
});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
	prettify_json,
	indent_string,
} = __webpack_require__(93)


function prettify_params_for_debug() {
	return indent_string(
		prettify_json.apply(null, arguments),
		1,
		{indent: '	'}
	)
}

// http://stackoverflow.com/a/1917041/587407
function get_shared_start(strs) {
	if (strs.length <= 1) return ''

	const A = strs.concat().sort()
	const a1 = A[0]
	const a2 = A[A.length - 1]
	const L = a1.length

	let i = 0
	while (i < L && a1.charAt(i) === a2.charAt(i)) { i++ }

	return a1.substring(0, i)
}


module.exports = {
	prettify_params_for_debug,
	get_shared_start,
}


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// TODO remove prettify_json dependency
const { PromiseWithProgress, prettify_json } = __webpack_require__(95)
const { prettify_params_for_debug } = __webpack_require__(255)

const LIB = '@oh-my-rpg/view-chat'

function is_step_input(step) {
	return step && step.type.startsWith('ask_')
}

function create({
						 DEBUG,
						 gen_next_step,
						 ui,
						 inter_msg_delay_ms = 0,
						 after_input_delay_ms = 0,
					 }) {
	if (DEBUG) console.log('↘ create()')

	function create_dummy_progress_promise({DURATION_MS = 2000, PERIOD_MS = 100} = {}) {
		return new PromiseWithProgress((resolve, reject, progress) => {
			let count = 0
			const auto_pulse = setInterval(() => {
				count++
				const completion_rate = 1. * (count * PERIOD_MS) / DURATION_MS
				progress(completion_rate)

				if (completion_rate >= 1) {
					clearInterval(auto_pulse)
					resolve()
				}
			}, PERIOD_MS)
		})
	}

	function normalize_step(step) {
		try {
			if (step.type === 'ask_for_confirmation' && step !== STEP_CONFIRM)
				step = Object.assign(
					{},
					STEP_CONFIRM,
					step,
				)

			if (!step.msg_main)
				throw new Error(`${LIB}: Step is missing main message!`)

			if (!step.type) {
				if (!step.choices)
					throw new Error(`${LIB}: Step type is unknown and not inferrable!`)

				step.type = 'ask_for_choice'
			}

			step = Object.assign(
				{
					validator: null,
					choices: [],
				},
				step,
			)

			step.choices = step.choices.map(normalize_choice)

			if (step.choices.length) {
				const known_values = new Set()
				step.choices.forEach((choice, index) => {
					if (known_values.has(choice.value)) {
						const err = new Error(`${LIB}: colliding choices with the same value!`)
						err.details = {
							choice,
							value: choice.value,
							index,
						}
						throw err
					}
					known_values.add(choice.value)
				})
			}


			return step
		}
		catch (e) {
			console.error(prettify_json(step))
			throw e
		}
	}

	function normalize_choice(choice) {
		// TODO auto-id
		try {
			if (!choice.hasOwnProperty('value') || typeof choice.value === 'undefined')
				throw new Error('Choice has no value!')
			choice.msg_cta = choice.msg_cta || String(choice.value)
			return choice
		}
		catch (e) {
			console.error(prettify_json(choice))
			throw e
		}
	}

	async function ask_user(step) {
		if (DEBUG) console.log(`↘ ask_user(\n${prettify_params_for_debug(step)}\n)`)

		let answer = ''
		let ok = true // TODO used for confirmation
		do {
			await ui.display_message({msg: step.msg_main, choices: step.choices})
			answer = await ui.read_answer(step)
			if (DEBUG) console.log(`↖ ask_user(…) answer = "${answer}"`)
		} while (!ok)
		await ui.pretend_to_think(after_input_delay_ms)

		let acknowledged = false
		if (step.choices.length) {
			const selected_choice = step.choices.find(choice => choice.value === answer)
			if (selected_choice.msgg_acknowledge) {
				await ui.display_message({msg: selected_choice.msgg_acknowledge(answer)})
				acknowledged = true
			}
		}
		if (!acknowledged && step.msgg_acknowledge) {
			await ui.display_message({msg: step.msgg_acknowledge(answer)})
			acknowledged = true
		}
		if (!acknowledged) {
			// Fine! It's optional.
			if (DEBUG) console.warn('You may want to add an acknowledge message to this step.')
		}

		return answer
	}

	async function execute_step(step) {
		if (DEBUG) console.log(`↘ execute_step(\n${prettify_params_for_debug(step)}\n)`)

		switch (step.type) {
			case 'simple_message':
				await ui.pretend_to_think(inter_msg_delay_ms)
				await ui.display_message({ msg: step.msg_main })
				break

			case 'progress':
				await ui.display_progress({
						progress_promise: step.progress_promise
							|| create_dummy_progress_promise({ DURATION_MS: step.duration_ms }),
						msg: step.msg_main,
						msgg_acknowledge: step.msgg_acknowledge
					})
					.then(() => true, () => false)
					.then(success => {
						if (step.callback)
							step.callback(success)
					})
				break

			case 'ask_for_confirmation':
			case 'ask_for_string':
			case 'ask_for_choice': {
				await ui.pretend_to_think(inter_msg_delay_ms)
				const answer = await ask_user(step)

				let reported = false
				if (step.choices.length) {
					const selected_choice = step.choices.find(choice => choice.value === answer)
					if (selected_choice.callback) {
						await selected_choice.callback(answer)
						reported = true
					}
				}
				if (!reported && step.callback) {
					await step.callback(answer)
					reported = true
				}
				if (!reported) {
					const err = new Error('CNF reporting callback in ask for result!')
					err.step = step
					throw err
				}
				return answer
			}
			default:
				throw new Error(`Unsupported step type: "${step.type}"!`)
		}
	}

	async function start() {
		if (DEBUG) console.log('↘ start()')
		try {
			await ui.setup()
			let should_exit = false
			let last_step = undefined // just in case
			let last_answer = undefined // just in case
			do {
				const step_start_timestamp_ms = +new Date()
				const yielded_step = gen_next_step.next({last_step, last_answer})
				const {value: raw_step, done} = await ui.spin_until_resolution(yielded_step)
				if (done) {
					should_exit = true
					continue
				}
				const step = normalize_step(raw_step)
				const elapsed_time_ms = (+new Date()) - step_start_timestamp_ms
				if (is_step_input(last_step)) {
					// pretend to have processed the user answer
					await ui.pretend_to_think(Math.max(0, after_input_delay_ms - elapsed_time_ms))
				}

				last_answer = await execute_step(step)
				last_step = step
			} while(!should_exit)
			await ui.teardown()
		}
		catch (e) {
			await ui.teardown()
			throw e
		}
	}

	return {
		start,
	}
}



module.exports = {
	PromiseWithProgress,
	create,
}


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const {
	prettify_json,
	indent_string,
} = __webpack_require__(95)


function prettify_params_for_debug() {
	return indent_string(
		prettify_json.apply(null, arguments),
		1,
		{indent: '	'}
	)
}

// http://stackoverflow.com/a/1917041/587407
function get_shared_start(strs) {
	if (strs.length <= 1) return ''

	const A = strs.concat().sort()
	const a1 = A[0]
	const a2 = A[A.length - 1]
	const L = a1.length

	let i = 0
	while (i < L && a1.charAt(i) === a2.charAt(i)) { i++ }

	return a1.substring(0, i)
}


module.exports = {
	prettify_params_for_debug,
	get_shared_start,
}


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(2);
tslib_1.__exportStar(__webpack_require__(257), exports);
tslib_1.__exportStar(__webpack_require__(258), exports);
tslib_1.__exportStar(__webpack_require__(259), exports);
tslib_1.__exportStar(__webpack_require__(260), exports);
tslib_1.__exportStar(__webpack_require__(41), exports);
tslib_1.__exportStar(__webpack_require__(261), exports);
tslib_1.__exportStar(__webpack_require__(96), exports);
tslib_1.__exportStar(__webpack_require__(42), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = __webpack_require__(0);
/////////////////////
const TextClass = typescript_string_enums_1.Enum('person', 'item', 'place');
exports.TextClass = TextClass;
/////////////////////
//# sourceMappingURL=types.js.map

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const state_character_1 = __webpack_require__(7);
const logic_adventures_1 = __webpack_require__(66);
const state_wallet_1 = __webpack_require__(8);
const RichText = __webpack_require__(3);
const items_1 = __webpack_require__(41);
const wallet_1 = __webpack_require__(42);
const monster_1 = __webpack_require__(96);
// TODO render attribute
function render_adventure(a) {
    const gains = a.gains; // alias for typing
    // in this special function, we'll be:
    // 1. generically filling a RichText.Document with any possible sub-elements,
    //    since we don't know whether the adventure messages use them or not.
    const $story_sub_elements = {};
    // encounter
    // item
    // attr, attr_name,
    // level, health, mana, strength, agility, charisma, wisdom, luck
    // coin
    // improved_item
    // 2. also generate some "summaries" for some gains
    let $listing_of_loot = RichText.span().done();
    let $listing_of_character_improvement = RichText.span().done();
    let $listing_of_item_improvement = RichText.span().done();
    // make sure that we handled every possible outcomes
    const handled_adventure_outcomes_so_far = new Set();
    (function render_loot() {
        const $loot_list = RichText.unordered_list().done();
        definitions_1.ITEM_SLOTS.forEach((slot) => {
            //console.info('handling adventure outcome [l1]: ' + slot)
            if (!gains[slot])
                return;
            const $doc = items_1.render_item(gains[slot]);
            $story_sub_elements.item = $doc;
            $story_sub_elements.item_slot = RichText.span().pushText(slot).done();
            $story_sub_elements[slot] = $doc;
            $loot_list.$sub[slot] = $doc;
            handled_adventure_outcomes_so_far.add(slot);
        });
        state_wallet_1.ALL_CURRENCIES.forEach((currency) => {
            //console.info('handling adventure outcome [l2]: ' + currency)
            if (!gains[currency])
                return;
            const $doc = wallet_1.render_currency_amount(currency, gains[currency]);
            $loot_list.$sub[currency] = $story_sub_elements[currency] = $doc;
            handled_adventure_outcomes_so_far.add(currency);
        });
        const hasLoot = !!Object.keys($loot_list.$sub).length;
        if (hasLoot)
            $listing_of_loot = RichText.section()
                .pushLineBreak()
                .pushText('Loot:')
                .pushNode($loot_list, 'list')
                .done();
    })();
    (function render_character_improvement() {
        const $improvement_list = RichText.unordered_list().done();
        state_character_1.CHARACTER_ATTRIBUTES.forEach((attr) => {
            //console.info('handling adventure outcome [c1]: ' + attr)
            if (!gains[attr])
                return;
            $story_sub_elements.attr_name = RichText.span().pushText(attr).done();
            const $doc_attr_gain_value = RichText.span().pushText('' + gains[attr]).done();
            $story_sub_elements.attr = $doc_attr_gain_value; // generic
            $story_sub_elements[attr] = $doc_attr_gain_value; // precise
            $improvement_list.$sub[attr] = attr === 'level'
                ? RichText.span().pushText('🆙 You leveled up!').done()
                : RichText.span().pushText(`You improved your ${attr} by ${gains[attr]}!`).done(); // TODO improve
            handled_adventure_outcomes_so_far.add(attr);
        });
        // TODO one day spells / skills
        const has_improvement = !!Object.keys($improvement_list.$sub).length;
        if (has_improvement)
            $listing_of_character_improvement = RichText.section()
                .pushLineBreak()
                .pushText('Character improvement:')
                .pushNode($improvement_list, 'list')
                .done();
    })();
    (function render_item_improvement() {
        const has_improvement = gains.armor_improvement || gains.weapon_improvement;
        const $improvement_list = RichText.unordered_list().done();
        // TODO
        if (gains.armor_improvement)
            handled_adventure_outcomes_so_far.add('armor_improvement');
        if (gains.weapon_improvement)
            handled_adventure_outcomes_so_far.add('weapon_improvement');
        if (has_improvement)
            $listing_of_item_improvement = RichText.section()
                .pushLineBreak()
                .pushText('Item improvement:')
                .pushNode($improvement_list, 'list')
                .done();
    })();
    /////// Encounter ///////
    if (a.encounter)
        $story_sub_elements.encounter = monster_1.render_monster(a.encounter);
    /////// checks ///////
    const active_adventure_outcomes = Object.keys(gains).filter(prop => !!gains[prop]);
    const unhandled_adventure_outcomes = active_adventure_outcomes.filter(prop => !handled_adventure_outcomes_so_far.has(prop));
    if (unhandled_adventure_outcomes.length) {
        console.error(`render_adventure(): *UN*handled outcome properties: "${unhandled_adventure_outcomes}"!`);
        console.info(`render_adventure(): handled outcome properties: "${Array.from(handled_adventure_outcomes_so_far.values())}"`);
        throw new Error(`render_adventure(): unhandled outcome properties!`);
    }
    /////// Final wrap-up //////
    const _ = logic_adventures_1.i18n_messages.en;
    const story = _.adventures[a.hid];
    const $doc = RichText.section()
        .pushText(story)
        .pushLineBreak()
        .pushNode($listing_of_loot, 'loot')
        .pushNode($listing_of_item_improvement, 'item_improv')
        .pushNode($listing_of_character_improvement, 'char_improv')
        .done();
    $doc.$sub = Object.assign({}, $doc.$sub, $story_sub_elements);
    return $doc;
}
exports.render_adventure = render_adventure;
//# sourceMappingURL=adventure.js.map

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RichText = __webpack_require__(3);
const state_character_1 = __webpack_require__(7);
function render_avatar(state) {
    // TODO refactor
    const $doc = RichText.section()
        .pushText('name:  {{name}}{{br}}')
        .pushText('class: {{class}}')
        .pushRawNode(RichText.span().addClass('avatar__name').pushText(state.name).done(), 'name')
        .pushRawNode(RichText.span().addClass('avatar__class').pushText(state.klass).done(), 'class')
        .done();
    return $doc;
}
exports.render_avatar = render_avatar;
function render_attributes(state) {
    const $doc_list = RichText.unordered_list()
        .addClass('attributes')
        .done();
    // TODO better sort
    state_character_1.CHARACTER_ATTRIBUTES_SORTED.forEach((stat, index) => {
        const label = stat;
        const value = state.attributes[stat];
        const padded_label = `${label}............`.slice(0, 11);
        const padded_human_value = `.......${value}`.slice(-4);
        const $doc_item = RichText.span()
            .addClass('attribute--' + stat)
            .pushText(padded_label + padded_human_value)
            .done();
        $doc_list.$sub['' + index] = $doc_item;
    });
    const $doc = RichText.section()
        .pushNode(RichText.heading().pushText('Attributes:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_attributes = render_attributes;
function render_character_sheet(state) {
    const $doc = RichText.section()
        .pushNode(render_avatar(state), 'avatar')
        .pushLineBreak()
        .pushNode(render_attributes(state), 'attributes')
        .done();
    return $doc;
}
exports.render_character_sheet = render_character_sheet;
//# sourceMappingURL=attributes.js.map

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = __webpack_require__(1);
const state_inventory_1 = __webpack_require__(12);
const RichText = __webpack_require__(3);
const items_1 = __webpack_require__(41);
const wallet_1 = __webpack_require__(42);
function inventory_coordinate_to_sortable_alpha_index(coord) {
    //return (' ' + (coord + 1)).slice(-2)
    return String.fromCharCode(97 + coord);
}
function render_equipment(inventory) {
    const $doc_list = RichText.unordered_list()
        .addClass('inventory--equipment')
        .done();
    definitions_1.ITEM_SLOTS.forEach((slot) => {
        const item = state_inventory_1.get_item_in_slot(inventory, slot);
        const $doc_item = RichText.span()
            .pushText((slot + '   ').slice(0, 6))
            .pushText(': ')
            .pushNode(item
            ? items_1.render_item(item)
            : RichText.span().pushText('-').done())
            .done();
        $doc_list.$sub[slot] = $doc_item;
    });
    const $doc = RichText.section()
        .pushNode(RichText.heading().pushText('Active equipment:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_equipment = render_equipment;
function render_backpack(inventory) {
    let $doc_list = RichText.ordered_list()
        .addClass('inventory--backpack')
        .done();
    const misc_items = Array.from(state_inventory_1.iterables_unslotted(inventory)).filter(i => !!i);
    misc_items.forEach((i, index) => {
        if (!i)
            return;
        $doc_list.$sub[inventory_coordinate_to_sortable_alpha_index(index)] = items_1.render_item(i);
        // TODO add coordinates
    });
    if (Object.keys($doc_list.$sub).length === 0) {
        // completely empty
        $doc_list.$type = RichText.NodeType.ul;
        $doc_list.$sub['-'] = RichText.span().pushText('(empty)').done();
    }
    const $doc = RichText.section()
        .pushNode(RichText.heading().pushText('backpack:').done(), 'header')
        .pushNode($doc_list, 'list')
        .done();
    return $doc;
}
exports.render_backpack = render_backpack;
function render_full_inventory(inventory, wallet) {
    const $doc = RichText.section()
        .pushNode(render_equipment(inventory), 'equipped')
        .pushLineBreak()
        .pushNode(wallet_1.render_wallet(wallet), 'wallet')
        .pushLineBreak()
        .pushNode(render_backpack(inventory), 'backpack')
        .done();
    return $doc;
}
exports.render_full_inventory = render_full_inventory;
//# sourceMappingURL=inventory.js.map

/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const RichText = __webpack_require__(3);
function render_meta_infos(metas) {
    const $doc_list = RichText.unordered_list();
    Object.keys(metas).forEach((prop) => {
        $doc_list.pushRawNode(RichText.span().pushText(prop + ': ' + metas[prop]).done(), prop);
    });
    return $doc_list.done();
}
function render_account_info(m, extra = {}) {
    const meta_infos = extra;
    meta_infos['internal user id'] = m.uuid;
    meta_infos['telemetry allowed'] = String(m.allow_telemetry);
    if (m.email)
        meta_infos['email'] = m.email;
    const $doc = RichText.span()
        .pushText('Account infos:')
        .pushNode(render_meta_infos(meta_infos), 'list')
        .done();
    return $doc;
}
exports.render_account_info = render_account_info;
//# sourceMappingURL=meta.js.map

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const RichText = __webpack_require__(3)

const callbacks = __webpack_require__(263)

function rich_text_to_ansi(doc) {
	return RichText.walk(doc, callbacks)
}

module.exports = {
	rich_text_to_ansi,
}


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { stylize_string } = __webpack_require__(21)

const LIB = 'rich_text_to_ansi'

const WIDTH_COMPENSATION = ' '

// TODO handle fixed width?
// TODO handle boxification

function apply_type($type, str) {
	switch($type) {
		case 'li':
		case 'span':
		case 'section':
			// nothing to do for those one
			return str
		case 'ol':
		case 'ul':
			//return '\n' + str
			return str
		case 'strong':
			return stylize_string.bold(str)
		case 'heading':
			return '\n' + stylize_string.bold(str)
		case 'em':
			return stylize_string.italic(str)
		default:
			console.warn(`${LIB}: unknown type "${$type}", ignored.`) // todo avoid repetition ?
			return str
	}
}

function apply_class($class, str, hints = {}) {
	switch($class) {
		case 'item__name':
		case 'avatar__name':
		case 'avatar__class':
		case 'monster__name':
			return stylize_string.bold(str)

		case 'item--quality--common':
			//return stylize_string.gray(str)
			// no color cause we can't know if the user has a dark or light background = keep default
			return str
		case 'item--quality--uncommon':
			return stylize_string.green(str)
		case 'item--quality--rare':
			return stylize_string.blue(str)
		case 'item--quality--epic':
			return stylize_string.magenta(str)
		case 'item--quality--legendary':
			return stylize_string.red(str)
		case 'item--quality--artifact':
			return stylize_string.yellow(str)

		case 'item--armor':
			return '🛡 ' + WIDTH_COMPENSATION + str
		case 'item--weapon':
			return '⚔ ' + WIDTH_COMPENSATION + str
		case 'currency--coin':
			return '💰 ' + WIDTH_COMPENSATION + str
		case 'currency--token':
			return '💠 ' + WIDTH_COMPENSATION + str

		case 'attribute--level':
			return '👶 ' + WIDTH_COMPENSATION + str
		case 'attribute--health':
			return '💗 ' + WIDTH_COMPENSATION + str
		case 'attribute--mana':
			return '💙 ' + WIDTH_COMPENSATION + str
		case 'attribute--agility':
			return '🤸 ' + WIDTH_COMPENSATION + str
		case 'attribute--luck':
			return '🤹 ' + WIDTH_COMPENSATION + str
		case 'attribute--strength':
			return '🏋 ' + WIDTH_COMPENSATION + str
		case 'attribute--charisma':
			return '👨‍🎤 ' + WIDTH_COMPENSATION + str
		case 'attribute--wisdom':
			return '👵 ' + WIDTH_COMPENSATION + str

		case 'monster':
			return str + ' ' + hints.possible_emoji + WIDTH_COMPENSATION
		case 'monster--rank--common':
			return str
		case 'monster--rank--elite':
			return stylize_string.yellow(str)
		case 'monster--rank--boss':
			return stylize_string.red(str)
		case 'rank--common':
			return str
		case 'rank--elite':
			return stylize_string.bold(str + '★')
		case 'rank--boss':
			return stylize_string.bold(str + ' 👑' + WIDTH_COMPENSATION)

		case 'item--enhancement':
		case 'armor--values':
		case 'weapon--values':
		case 'item':
		case 'attributes':
		case 'inventory--equipment':
		case 'inventory--wallet':
		case 'inventory--backpack':
		case '':
			// no style
			return str

		default:
			console.warn(`${LIB}: unknown class "${$class}", ignored.`) // todo avoid repetition
			return str
	}
}

function on_concatenate_sub_node({state, sub_state, $id, $parent_node}) {
	if ($parent_node.$type === 'ul')
		return state + '\n - ' + sub_state

	if ($parent_node.$type === 'ol')
		return state + `\n ${(' ' + $id).slice(-2)}. ` + sub_state

	if ($parent_node.$type === 'strong')
		return state + stylize_string.bold(sub_state)

	return state + sub_state
}

function clean(state) {
	// TODO remove trailing and early \n ?
	return state
}

const callbacks = {
	on_node_enter: () => '',
	on_concatenate_str: ({state, str}) => state + str,
	on_concatenate_sub_node,
	on_class_after: ({state, $class, $node}) => apply_class($class, state, $node.$hints),
	on_type: ({state, $type}) => apply_type($type, state),
	on_root_exit: ({state}) => clean(state),

	on_type_br: ({state}) => state + '\n',
	on_type_hr: ({state}) => state + '\n------------------------------------------------------------\n',
}

module.exports = callbacks


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { stylize_string } = __webpack_require__(21)

/////////////////////////////////////////////////

function divide() {
	console.log('--------------------------------------------------------------------------------')
}

function render_header({may_clear_screen, version}) {
	divide()

	console.log(stylize_string.dim(
		stylize_string.bold('The npm RPG')
		+ ` - v${version} - `
		+ stylize_string.underline('http://www.online-adventur.es/the-npm-rpg')
		+ '\n'
	))
}

/////////////////////////////////////////////////

module.exports = {
	render_header,
}


/***/ })
/******/ ]);