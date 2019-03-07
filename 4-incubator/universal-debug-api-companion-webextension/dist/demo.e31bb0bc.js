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
})({"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/node_modules/@offirmo/globalthis-ponyfill/dist/src.es7.cjs/index.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";
/* global globalThis, self, window, global */

Object.defineProperty(exports, "__esModule", {
  value: true
});
var lastResort = {};

function getGlobalThis() {
  // @ts-ignore
  if (typeof globalThis !== 'undefined') return globalThis; // check node first https://github.com/ljharb/globalThis/issues/2
  // @ts-ignore

  if (typeof global !== 'undefined') return global; // @ts-ignore

  if (typeof self !== 'undefined') return self; // @ts-ignore

  if (typeof window !== 'undefined') return window;
  return lastResort; // should never happen
}

exports.getGlobalThis = getGlobalThis;
},{}],"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/node_modules/@offirmo/practical-logger-minimal-to-void/dist/src.es7.cjs/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NO_OP = () => { };
const NO_OP_LOGGER = {
    setLevel: NO_OP,
    getLevel: () => 'silly',
    addCommonDetails: NO_OP,
    fatal: NO_OP,
    emerg: NO_OP,
    alert: NO_OP,
    crit: NO_OP,
    error: NO_OP,
    warning: NO_OP,
    warn: NO_OP,
    notice: NO_OP,
    info: NO_OP,
    verbose: NO_OP,
    log: NO_OP,
    debug: NO_OP,
    trace: NO_OP,
    silly: NO_OP,
};
function createLogger() {
    return NO_OP_LOGGER;
}
exports.createLogger = createLogger;

},{}],"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/dist/src.es7.cjs/create.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const practical_logger_minimal_to_void_1 = require("@offirmo/practical-logger-minimal-to-void");
function create() {
    const NO_OP = () => { };
    const NO_OP_LOGGER = practical_logger_minimal_to_void_1.createLogger();
    return {
        getLogger: () => NO_OP_LOGGER,
        addDebugCommand: NO_OP,
    };
}
exports.create = create;

},{"@offirmo/practical-logger-minimal-to-void":"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/node_modules/@offirmo/practical-logger-minimal-to-void/dist/src.es7.cjs/index.js"}],"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/dist/src.es7.cjs/index.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalthis_ponyfill_1 = require("@offirmo/globalthis-ponyfill");
const create_1 = require("./create");
// install globally if no other implementation already present
const globalThis = globalthis_ponyfill_1.getGlobalThis();
globalThis._debug = globalThis._debug || create_1.create();
// expose the current implementation
const instance = globalThis._debug;
const { getLogger, addDebugCommand, } = instance;
exports.getLogger = getLogger;
exports.addDebugCommand = addDebugCommand;

},{"@offirmo/globalthis-ponyfill":"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/node_modules/@offirmo/globalthis-ponyfill/dist/src.es7.cjs/index.js","./create":"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/dist/src.es7.cjs/create.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _universalDebugApiMinimalToVoid = require("@offirmo/universal-debug-api-minimal-to-void");

console.warn("\uD83D\uDCC4 [page/head-script.".concat(+Date.now(), "] Hello, more standard!"), {
  foo_js: window.foo,
  foo_ls: function () {
    try {
      // local files may not have local storage
      return localStorage.getItem('foo');
    } catch (_unused) {}
  }()
}); // usage

var logger = (0, _universalDebugApiMinimalToVoid.getLogger)();
logger.info('Hello from logger!');

if (true) {
  console.group('Testing log levels...');
  ['fatal', 'emerg', 'alert', 'crit', 'error', 'warning', 'warn', 'notice', 'info', 'verbose', 'log', 'debug', 'trace', 'silly'].forEach(function (level) {
    logger[level]("logger demo with level \"".concat(level, "\""), {
      level: level
    });
  });
  console.groupEnd();
}

_debug.addDebugCommand('pause', function () {
  console.log('paused');
});
},{"@offirmo/universal-debug-api-minimal-to-void":"../../node_modules/@offirmo/universal-debug-api-minimal-to-void/dist/src.es7.cjs/index.js"}],"../../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59408" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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
  overlay.id = OVERLAY_ID; // html encode message and stack trace

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
        parents.push(k);
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
},{}]},{},["../../../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/demo.e31bb0bc.map