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
})({"oh88":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tiny_singleton = void 0;

function tiny_singleton(generator) {
  var instantiated = false;
  var instance;
  return function get() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!instantiated) {
      instance = generator.apply(void 0, args);
      instantiated = true;
    }

    return instance;
  };
}

exports.default = tiny_singleton;
exports.tiny_singleton = tiny_singleton;
},{}],"CWeH":[function(require,module,exports) {
"use strict"; // base to be directly importable from other modules
// without a full lib penalty.
// This a very very specific use case, don't mind.

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_LOGGER_KEY = exports.DEFAULT_LOG_LEVEL = void 0;
exports.DEFAULT_LOG_LEVEL = 'error';
exports.DEFAULT_LOGGER_KEY = ''; // yes, can be used as a key
},{}],"jTYD":[function(require,module,exports) {
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
},{"./consts-base":"CWeH"}],"o8HO":[function(require,module,exports) {
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
  var _a;

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

  var message = message_parts.join(' ') || ((_a = err) === null || _a === void 0 ? void 0 : _a.message) || '(no message)';
  if (err) details.err = err;else delete details.err; // because could be present but not be a correct err type

  return [message, details];
}

exports.normalizeArguments = normalizeArguments;
},{}],"qeBr":[function(require,module,exports) {
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
  if (!consts_1.ALL_LOG_LEVELS.includes(level)) throw new Error("[" + consts_1.LIB + "] Not a valid log level: \"" + level + "\"!");
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

      var _a = normalize_args_1.normalizeArguments(arguments),
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
    if (details.err) throw new Error("[" + consts_1.LIB + "] Can't set reserved property \"err\"!");
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
},{"./consts":"jTYD","./normalize-args":"o8HO"}],"tS9y":[function(require,module,exports) {
"use strict"; //////////// Public interface (for logger usage) ////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"Wlud":[function(require,module,exports) {
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
},{"./core":"qeBr","@offirmo/practical-logger-types":"tS9y","./consts":"jTYD","./normalize-args":"o8HO"}],"sQTc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.to_uniform_level = exports.LEVEL_TO_CONSOLE_METHOD = void 0;

var practical_logger_core_1 = require("@offirmo/practical-logger-core");

exports.LEVEL_TO_CONSOLE_METHOD = {
  fatal: 'error',
  emerg: 'error',
  alert: 'error',
  crit: 'error',
  error: 'error',
  warning: 'warn',
  warn: 'warn',
  notice: 'info',
  info: 'info',
  verbose: 'info',
  log: 'log',
  debug: 'debug',
  trace: 'debug',
  silly: 'debug'
};
var MIN_WIDTH = 5;

function to_uniform_level(level) {
  var str = practical_logger_core_1.LOG_LEVEL_TO_HUMAN[level]; //.slice(0, MIN_WIDTH)
  //if (str.length < MIN_WIDTH)

  str = (str + '         ').slice(0, MIN_WIDTH);
  return str;
}

exports.to_uniform_level = to_uniform_level;
},{"@offirmo/practical-logger-core":"Wlud"}],"kGOU":[function(require,module,exports) {
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

var __spreadArray = this && this.__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build_args = exports.add_styled_string = exports.LEVEL_TO_COLOR_STYLE = exports.FONT_FAMILY_BETTER_MONOSPACE = exports.FONT_FAMILY_BETTER_PROPORTIONAL = void 0;
var FONT_FAMILY_BETTER_PROPORTIONAL = 'font-family: ' + ['-apple-system', 'BlinkMacSystemFont', 'noto', 'roboto', 'sans-serif' //'unset', // default back to the devtools one
].join(', ');
exports.FONT_FAMILY_BETTER_PROPORTIONAL = FONT_FAMILY_BETTER_PROPORTIONAL;
var FONT_FAMILY_BETTER_MONOSPACE = 'font-family: ' + ['"Fira Code"', 'Menlo', 'Consolas', 'monospace'].join(', ');
exports.FONT_FAMILY_BETTER_MONOSPACE = FONT_FAMILY_BETTER_MONOSPACE;
var LEVEL_TO_COLOR_STYLE = {
  // empty = no need, console method already covers it well
  fatal: '',
  emerg: '',
  alert: '',
  crit: '',
  error: '',
  warning: '',
  warn: '',
  notice: 'color: #659AD2',
  info: 'color: #659AD2',
  verbose: 'color: #659AD2',
  log: '',
  debug: 'color: #9AA2AA',
  trace: 'color: #9AA2AA',
  silly: 'color: #9AA2AA'
};
exports.LEVEL_TO_COLOR_STYLE = LEVEL_TO_COLOR_STYLE;

function add_styled_string(line, chunk) {
  var styles = [];

  for (var _i = 2; _i < arguments.length; _i++) {
    styles[_i - 2] = arguments[_i];
  }

  var existing_chunks = line[0],
      existing_chunks_styles = line.slice(1);
  return __spreadArray(__spreadArray([existing_chunks + '%c' + chunk], existing_chunks_styles), [styles.join(';') + ';']);
}

exports.add_styled_string = add_styled_string;

function build_args(line, payload) {
  var err = payload.err;
  var details = payload.details;
  var args = line;

  if (err) {
    // err will be passed as the LAST arg for reasons (see below)
    // however the "last arg" display doesn't allow examining the optional err properties
    // so we also add the err to the details:
    // (tested on FF/Chrome/Safari)
    details = __assign(__assign({}, details), {
      err: err
    });
  }

  if (Object.keys(details).length) args.push(details); // err *as an arg* triggers a good display of the stacktrace
  // however it should be LAST because it takes a lot of room and "hides" further args
  // (tested on FF/Chrome/Safari)

  if (err) args.push(err);
  return args;
}

exports.build_args = build_args;
},{}],"QOyb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sink = void 0;

var common_1 = require("../common");

var common_2 = require("./common");

function has_details_indicator(console_method_name) {
  return console_method_name === 'error';
}

var HEADER_FONT_SIZE_STYLE = 'font-size: 10px';

var sink = function (payload) {
  var level = payload.level,
      name = payload.name,
      msg = payload.msg,
      err = payload.err,
      details = payload.details;
  var console_method_name = common_1.LEVEL_TO_CONSOLE_METHOD[level];
  var console_method = console[console_method_name];
  var line = [''];

  if (!has_details_indicator(console_method_name)) {
    line = common_2.add_styled_string(line, '▷', common_2.LEVEL_TO_COLOR_STYLE[level], 'font-size: 8px', common_2.FONT_FAMILY_BETTER_PROPORTIONAL, 'margin-left: .35em', 'margin-right: .5em');
  }

  line = common_2.add_styled_string(line, '[', common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  line = common_2.add_styled_string(line, common_1.to_uniform_level(level), common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_MONOSPACE);
  line = common_2.add_styled_string(line, '] ', common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  line = common_2.add_styled_string(line, '', 'font-size: unset');

  if (name) {
    line = common_2.add_styled_string(line, name + " \u203A ", common_2.LEVEL_TO_COLOR_STYLE[level], common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  }

  line = common_2.add_styled_string(line, msg, common_2.LEVEL_TO_COLOR_STYLE[level], common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  console_method.apply(void 0, common_2.build_args(line, payload));
};

exports.sink = sink;
exports.default = exports.sink;
},{"../common":"sQTc","./common":"kGOU"}],"cRv0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sink = void 0;

var common_1 = require("../common");

var common_2 = require("./common");

function has_details_indicator(console_method_name) {
  return console_method_name === 'error' || console_method_name === 'warn';
}

var HEADER_FONT_SIZE_STYLE = 'font-size: 8px';
var MESSAGE_FONT_SIZE_STYLE = 'font-size: 11px';

var sink = function (payload) {
  var level = payload.level,
      name = payload.name,
      msg = payload.msg,
      err = payload.err,
      details_orginal = payload.details;
  var console_method_name = common_1.LEVEL_TO_CONSOLE_METHOD[level];
  var console_method = console[console_method_name];
  var line = [''];

  if (!has_details_indicator(console_method_name)) {
    line = common_2.add_styled_string(line, '▷', common_2.LEVEL_TO_COLOR_STYLE[level], 'font-size: 8px', common_2.FONT_FAMILY_BETTER_PROPORTIONAL, 'margin-left: .1em', 'margin-right: .2em');
  }

  line = common_2.add_styled_string(line, '[', common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  line = common_2.add_styled_string(line, common_1.to_uniform_level(level), common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_MONOSPACE);
  line = common_2.add_styled_string(line, '] ', common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  line = common_2.add_styled_string(line, '', 'font-size: unset');

  if (name) {
    line = common_2.add_styled_string(line, name + " \u203A ", common_2.LEVEL_TO_COLOR_STYLE[level], common_2.FONT_FAMILY_BETTER_PROPORTIONAL, MESSAGE_FONT_SIZE_STYLE);
  }

  line = common_2.add_styled_string(line, msg, common_2.LEVEL_TO_COLOR_STYLE[level], common_2.FONT_FAMILY_BETTER_PROPORTIONAL, MESSAGE_FONT_SIZE_STYLE);
  console_method.apply(void 0, common_2.build_args(line, payload));
};

exports.sink = sink;
exports.default = exports.sink;
},{"../common":"sQTc","./common":"kGOU"}],"ajim":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sink = void 0;

var common_1 = require("../common");

var common_2 = require("./common");

function has_details_indicator(console_method_name, details) {
  return details || console_method_name === 'error';
}

var HEADER_FONT_SIZE_STYLE = 'font-size: 9px';

var sink = function (payload) {
  var level = payload.level,
      name = payload.name,
      msg = payload.msg,
      err = payload.err,
      details = payload.details;
  var console_method_name = common_1.LEVEL_TO_CONSOLE_METHOD[level];
  var console_method = console[console_method_name];
  var line = [''];

  if (!has_details_indicator(console_method_name, details)) {
    line = common_2.add_styled_string(line, '▷', common_2.LEVEL_TO_COLOR_STYLE[level], 'font-size: 10px', common_2.FONT_FAMILY_BETTER_PROPORTIONAL, 'margin-left: .15em', 'margin-right: .4em');
  }

  line = common_2.add_styled_string(line, '[', common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  line = common_2.add_styled_string(line, common_1.to_uniform_level(level), common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_MONOSPACE);
  line = common_2.add_styled_string(line, '] ', common_2.LEVEL_TO_COLOR_STYLE[level], HEADER_FONT_SIZE_STYLE, common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  line = common_2.add_styled_string(line, '', 'font-size: unset');

  if (name) {
    line = common_2.add_styled_string(line, name + " \u203A ", common_2.LEVEL_TO_COLOR_STYLE[level], common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  }

  line = common_2.add_styled_string(line, msg, common_2.LEVEL_TO_COLOR_STYLE[level], common_2.FONT_FAMILY_BETTER_PROPORTIONAL);
  console_method.apply(void 0, common_2.build_args(line, payload));
};

exports.sink = sink;
exports.default = exports.sink;
},{"../common":"sQTc","./common":"kGOU"}],"WNtI":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var common_1 = require("./common");

function create(options) {
  if (options === void 0) {
    options = {};
  }

  return function (payload) {
    var level = payload.level,
        name = payload.name,
        msg = payload.msg,
        err = payload.err,
        details = payload.details;
    var console_method_name = common_1.LEVEL_TO_CONSOLE_METHOD[level];
    var console_method = console[console_method_name];
    var line = ['[', common_1.to_uniform_level(level), '] '];

    if (name) {
      line.push(name + " \u203A ");
    }

    line.push(msg);
    var args = line;
    if (Object.keys(details).length) args.push(details); // err should be last because it takes a lot of room and "hides" further args

    if (err) args.push(err);
    console_method.apply(void 0, args);
  };
}

exports.default = create;
},{"./common":"sQTc"}],"j3gO":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = void 0;

var firefox_1 = __importDefault(require("./advanced/firefox"));

var chromium_1 = __importDefault(require("./advanced/chromium"));

var safari_1 = __importDefault(require("./advanced/safari"));

var no_css_1 = __importDefault(require("./no-css")); // TODO export that?


function quick_detect_browser() {
  // https://stackoverflow.com/a/9851769/587407
  // https://dev.to/_elmahdim/safe-reliable-browser-sniffing-39bp
  try {
    if (window.InstallTrigger) return 'firefox';
    if (window.ApplePaySession) return 'safari';
    if (window.chrome) return 'chromium';
  } catch (_a) {
    /* ignore */
  }

  return 'other';
}

function create(options) {
  if (options === void 0) {
    options = {};
  }

  if (options.useCss === false) return no_css_1.default(options);

  switch (options.explicitBrowser || quick_detect_browser()) {
    case 'firefox':
      return firefox_1.default;

    case 'safari':
      return safari_1.default;

    case 'chromium':
      return chromium_1.default;

    default:
      return no_css_1.default(options);
  }
}

exports.create = create;
},{"./advanced/firefox":"QOyb","./advanced/chromium":"cRv0","./advanced/safari":"ajim","./no-css":"WNtI"}],"SkkL":[function(require,module,exports) {
"use strict"; // Note: the name of this file is because it appears in the dev tools!

var __spreadArray = this && this.__spreadArray || function (to, from) {
  for (var i = 0, il = from.length, j = to.length; i < il; i++, j++) to[j] = from[i];

  return to;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.improve_console_groups = void 0;
var PATCHED_METHODS = ['debug', 'log', 'info', 'warn', 'error', 'group', 'groupCollapsed', 'groupEnd', 'table', 'trace', 'dir', 'dirxml', 'count', 'assert'];
var DEBUG = false;

function install(_a) {
  var _b = _a === void 0 ? {} : _a,
      _c = _b.uncollapse_level,
      uncollapse_level = _c === void 0 ? 'warn' : _c,
      _d = _b.lazy,
      lazy = _d === void 0 ? true : _d,
      _e = _b.original_console,
      original_console = _e === void 0 ? console : _e;

  if (DEBUG) console.log('install', {
    uncollapse_level: uncollapse_level,
    lazy: lazy
  });
  var group_invocations = []; // in node, group() calls console.log()
  // to prevent infinite loops

  var in_original_call = false;
  var ORIGINAL_METHODS = {};
  PATCHED_METHODS.forEach(function (k) {
    ORIGINAL_METHODS[k] = original_console[k];
  });

  function better_group() {
    var p = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      p[_i] = arguments[_i];
    }

    if (DEBUG) ORIGINAL_METHODS.log('>>> before group', {
      lazy: lazy,
      depth: group_invocations.length
    }, "\"" + p[0] + "\"");
    group_invocations.push({
      params: p,
      is_deployed: true,
      is_effective: !lazy
    });

    if (!lazy) {
      in_original_call = true;
      ORIGINAL_METHODS.group.apply(ORIGINAL_METHODS, p);
      in_original_call = false;
    }

    if (DEBUG) ORIGINAL_METHODS.log('<<< after group', {
      depth: group_invocations.length
    });
  }

  function better_groupCollapsed() {
    var p = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      p[_i] = arguments[_i];
    }

    if (DEBUG) ORIGINAL_METHODS.log('>>> before groupCollapsed', {
      lazy: lazy,
      depth: group_invocations.length
    }, "\"" + p[0] + "\"");
    group_invocations.push({
      params: p,
      is_deployed: false,
      is_effective: !lazy
    });

    if (!lazy) {
      in_original_call = true;
      ORIGINAL_METHODS.groupCollapsed.apply(ORIGINAL_METHODS, p);
      in_original_call = false;
    }

    if (DEBUG) ORIGINAL_METHODS.log('after groupCollapsed', {
      depth: group_invocations.length
    });
  }

  function better_groupEnd() {
    var p = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      p[_i] = arguments[_i];
    }

    if (DEBUG) ORIGINAL_METHODS.log('>>> before groupEnd', {
      lazy: lazy,
      depth: group_invocations.length
    }, "\"" + p[0] + "\"");
    var last_invocation = group_invocations.pop();

    if (last_invocation && last_invocation.is_effective) {
      in_original_call = true;
      ORIGINAL_METHODS.groupEnd.apply(ORIGINAL_METHODS, p);
      in_original_call = false;
    }

    if (DEBUG) ORIGINAL_METHODS.log('<<< after groupEnd', {
      lazy: lazy,
      depth: group_invocations.length
    });
  }

  function better_output(original_method, uncollapse) {
    var p = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      p[_i - 2] = arguments[_i];
    }

    if (in_original_call) {
      return original_method.apply(void 0, p);
    }

    if (DEBUG) original_method('>>> before output', {
      depth: group_invocations.length
    }, "\"" + p[0] + "\""); // lazily create groups
    // cancel collapsed if needed

    group_invocations.forEach(function (invocation) {
      var is_effective = invocation.is_effective,
          is_deployed = invocation.is_deployed,
          params = invocation.params;
      if (is_effective) return;
      if (DEBUG) original_method('--- lazy call');

      if (uncollapse || is_deployed) {
        in_original_call = true;
        ORIGINAL_METHODS.group.apply(ORIGINAL_METHODS, params);
        in_original_call = false;
        invocation.is_deployed = true;
      } else {
        in_original_call = true;
        ORIGINAL_METHODS.groupCollapsed.apply(ORIGINAL_METHODS, params);
        in_original_call = false;
        invocation.is_deployed = false;
      }

      invocation.is_effective = true;
    });
    if (DEBUG) original_method('--- output'); // uncollapse parents if needed

    if (uncollapse) {
      var lowest_uncollapsed_index = group_invocations.findIndex(function (_a) {
        var is_deployed = _a.is_deployed;
        return !is_deployed;
      });

      while (lowest_uncollapsed_index >= 0 && group_invocations.length && group_invocations.length > lowest_uncollapsed_index) {
        better_groupEnd();
        ORIGINAL_METHODS.debug('(forced break out of collapsed group ↑ due to critical log ↓)');
      }
    }

    if (DEBUG) original_method('--- output');
    original_method.apply(void 0, p);
    if (DEBUG) original_method('<<<after output', {
      depth: group_invocations.length
    });
  }

  var patched = new Set();
  console.group = better_group;
  patched.add('group');
  console.groupCollapsed = better_groupCollapsed;
  patched.add('groupCollapsed');
  console.groupEnd = better_groupEnd;
  patched.add('groupEnd');
  console.warn = better_output.bind(null, ORIGINAL_METHODS.warn, uncollapse_level === 'warn');
  patched.add('warn');
  console.error = better_output.bind(null, ORIGINAL_METHODS.error, true);
  patched.add('error');

  console.assert = function (assertion) {
    var args = [];

    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }

    if (assertion) {// do nothing
    } else {
      better_output.apply(void 0, __spreadArray([ORIGINAL_METHODS.assert, true, assertion], args));
    }
  };

  patched.add('assert');
  PATCHED_METHODS.forEach(function (method) {
    if (patched.has(method)) return;
    console[method] = better_output.bind(null, ORIGINAL_METHODS[method], false);
    patched.add(method);
  });
}

exports.improve_console_groups = install;
exports.default = install;
},{}],"Dvhf":[function(require,module,exports) {
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
exports.DEFAULT_LOGGER_KEY = exports.DEFAULT_LOG_LEVEL = exports.createLogger = void 0;

var tiny_singleton_1 = __importDefault(require("@offirmo/tiny-singleton"));

var practical_logger_core_1 = require("@offirmo/practical-logger-core");

var sinks_1 = require("./sinks");

var practical_logger_1 = __importDefault(require("./better-console-groups/practical-logger"));

var ORIGINAL_CONSOLE = console;
var install_groups_or_not_once_for_all = tiny_singleton_1.default(function (active) {
  if (active) practical_logger_1.default();
});

function createLogger(p) {
  var _a, _b;

  if (p === void 0) {
    p = {};
  }

  install_groups_or_not_once_for_all(((_a = p.sinkOptions) === null || _a === void 0 ? void 0 : _a.betterGroups) !== false);
  var sink = ((_b = p.sinkOptions) === null || _b === void 0 ? void 0 : _b.sink) || sinks_1.create(p.sinkOptions);
  var group = ORIGINAL_CONSOLE.group,
      groupCollapsed = ORIGINAL_CONSOLE.groupCollapsed,
      groupEnd = ORIGINAL_CONSOLE.groupEnd;
  return __assign(__assign({}, practical_logger_core_1.createLogger(p, sink)), {
    group: group,
    groupCollapsed: groupCollapsed,
    groupEnd: groupEnd
  });
}

exports.createLogger = createLogger;

__exportStar(require("@offirmo/practical-logger-types"), exports);

var practical_logger_core_2 = require("@offirmo/practical-logger-core");

Object.defineProperty(exports, "DEFAULT_LOG_LEVEL", {
  enumerable: true,
  get: function () {
    return practical_logger_core_2.DEFAULT_LOG_LEVEL;
  }
});
Object.defineProperty(exports, "DEFAULT_LOGGER_KEY", {
  enumerable: true,
  get: function () {
    return practical_logger_core_2.DEFAULT_LOGGER_KEY;
  }
});
},{"@offirmo/tiny-singleton":"oh88","@offirmo/practical-logger-core":"Wlud","./sinks":"j3gO","./better-console-groups/practical-logger":"SkkL","@offirmo/practical-logger-types":"tS9y"}],"eWlX":[function(require,module,exports) {
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
},{"./consts-base":"CWeH"}],"bcIh":[function(require,module,exports) {
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
  if (!consts_1.ALL_LOG_LEVELS.includes(level)) throw new Error("[" + consts_1.LIB + "] Not a valid log level: \"" + level + "\"!");
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

      var _a = normalize_args_1.normalizeArguments(arguments),
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
    if (details.err) throw new Error("[" + consts_1.LIB + "] Can't set reserved property \"err\"!");
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
},{"./consts":"eWlX","./normalize-args":"o8HO"}],"y67r":[function(require,module,exports) {
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
},{"./core":"bcIh","@offirmo/practical-logger-types":"tS9y","./consts":"eWlX","./normalize-args":"o8HO"}],"UPs5":[function(require,module,exports) {
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
},{"..":"y67r"}],"QCba":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var practical_logger_browser_1 = require("@offirmo/practical-logger-browser");

var shared_demo_1 = require("@offirmo/practical-logger-core/doc/shared-demo"); //demo_legacy_console()


var logger = practical_logger_browser_1.createLogger({
  suggestedLevel: 'warn'
});
logger.log('hello from logger!');
var demoLogger = practical_logger_browser_1.createLogger({
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
    shared_demo_1.demo_legacy_console();
    shared_demo_1.demo_logger_levels(l);
  },
  'basic': function (l) {
    return shared_demo_1.demo_logger_basic_usage(l, false);
  },
  'error': function (l) {
    return shared_demo_1.demo_error(l, false);
  },
  'groups': shared_demo_1.demo_group
};

function run_demo(demo_id) {
  demos[demo_id](demoLogger);
  state.last_demo_launched = demo_id;
}

function render() {
  Object.keys(demos).forEach(function (demo_id) {
    document.getElementById("demo-" + demo_id).removeAttribute('open');
  });

  if (state.last_demo_launched) {
    document.getElementById("demo-" + state.last_demo_launched).setAttribute('open', 'true');
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
        return clickedElement_1.matches("#btn-demo-" + id);
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
},{"@offirmo/practical-logger-browser":"Dvhf","@offirmo/practical-logger-core/doc/shared-demo":"UPs5"}]},{},["QCba"], null)
//# sourceMappingURL=src.ffd5efea.js.map