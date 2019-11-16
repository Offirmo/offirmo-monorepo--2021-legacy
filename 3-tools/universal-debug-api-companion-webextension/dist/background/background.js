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
})({"XpeU":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var isProduction = "production" === 'production';
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

var _default = invariant;
exports.default = _default;
},{}],"UnN1":[function(require,module,exports) {
var define;
var global = arguments[3];
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.browser = mod.exports;
  }
})(this, function (module) {
  /* webextension-polyfill - v0.4.0 - Wed Feb 06 2019 11:58:31 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getBrowserInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.rejection
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(extensionAPIs.runtime.lastError);
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxResolvedArgs
       *        The maximum number of arguments which may be passed to the
       *        callback created by the wrapped async function.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({ resolve, reject }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);

                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;

                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({ resolve, reject }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });

              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });

      // Keep track if the deprecation warning has been logged at least once.
      let loggedSendResponseDeprecationWarning = false;

      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;

          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }
              didCallSendResponse = true;
              resolve(response);
            };
          });

          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });

      const wrappedSendMessageCallback = ({ reject, resolve }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(extensionAPIs.runtime.lastError);
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, { resolve, reject });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", { minArgs: 1, maxArgs: 3 })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", { minArgs: 2, maxArgs: 3 })
        }
      };
      const settingMetadata = {
        clear: { minArgs: 1, maxArgs: 1 },
        get: { minArgs: 1, maxArgs: 1 },
        set: { minArgs: 1, maxArgs: 1 }
      };
      apiMetadata.privacy = {
        network: {
          networkPredictionEnabled: settingMetadata,
          webRTCIPHandlingPolicy: settingMetadata
        },
        services: {
          passwordSavingEnabled: settingMetadata
        },
        websites: {
          hyperlinkAuditingEnabled: settingMetadata,
          referrersEnabled: settingMetadata
        }
      };

      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});


},{}],"c2lp":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getBrowser() {
    // if not in a browser, assume we're in a test, return a dummy
    if (typeof window === 'undefined') {
        //@ts-ignore
        return {};
    }
    //@ts-ignore
    return require('webextension-polyfill');
}
exports.browser = getBrowser();

},{"webextension-polyfill":"UnN1"}],"GhkJ":[function(require,module,exports) {
"use strict"; // 1. copied from https://github.com/Microsoft/TypeScript/issues/15202#issuecomment-318900991
// 2. then improved to match the latest Promise typings

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Deferred =
/** @class */
function () {
  function Deferred() {
    var _this = this;

    this.promise = new Promise(function (resolve, reject) {
      _this._resolve = resolve;
      _this._reject = reject;
    });
  }

  Deferred.prototype.then = function (onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  };

  Deferred.prototype.catch = function (onrejected) {
    return this.promise.catch(onrejected);
  };

  Deferred.prototype.resolve = function (value) {
    return this._resolve(value);
  };

  Deferred.prototype.reject = function (reason) {
    return this._reject(reason);
  };

  Deferred.prototype.finally = function (onfinally) {
    return this.promise.finally(onfinally);
  };

  Object.defineProperty(Deferred.prototype, Symbol.toStringTag, {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
    get: function () {
      return 'Deferred';
    },
    enumerable: true,
    configurable: true
  });
  return Deferred;
}();

exports.default = Deferred;
},{}],"hmGQ":[function(require,module,exports) {
'use strict';

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
        return {
          done: true
        };
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
      return arguments.length > 0 ? {
        done: true,
        value: await value
      } : {
        done: true
      };
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
    return Promise.all([...staticListeners.map(async listener => {
      if (listeners.has(listener)) {
        return listener(eventData);
      }
    }), ...staticAnyListeners.map(async listener => {
      if (anyListeners.has(listener)) {
        return listener(eventName, eventData);
      }
    })]);
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
      return anyMap.get(this).size + getListeners(this, eventName).size + getEventProducers(this, eventName).size + getEventProducers(this).size;
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

const allEmitteryMethods = Object.getOwnPropertyNames(Emittery.prototype).filter(v => v !== 'constructor'); // Subclass used to encourage TS users to type their events.

Emittery.Typed = class extends Emittery {};
Object.defineProperty(Emittery.Typed, 'Typed', {
  enumerable: false,
  value: undefined
});
module.exports = Emittery;
},{}],"Wne5":[function(require,module,exports) {
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

},{}],"vw0P":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"dXjU":[function(require,module,exports) {
"use strict"; /////////////////////

Object.defineProperty(exports, "__esModule", {
  value: true
});

function get_UTC_timestamp_ms(now) {
  if (now === void 0) {
    now = new Date();
  }

  return +now;
}

exports.get_UTC_timestamp_ms = get_UTC_timestamp_ms; /////////////////////

function get_human_readable_UTC_timestamp_days(now) {
  if (now === void 0) {
    now = new Date();
  }

  var YYYY = now.getUTCFullYear();
  var MM = ('0' + (now.getUTCMonth() + 1)).slice(-2);
  var DD = ('0' + now.getUTCDate()).slice(-2);
  return "" + YYYY + MM + DD;
}

exports.get_human_readable_UTC_timestamp_days = get_human_readable_UTC_timestamp_days;

function get_human_readable_UTC_timestamp_minutes(now) {
  if (now === void 0) {
    now = new Date();
  }

  var hh = ('0' + now.getUTCHours()).slice(-2);
  var mm = ('0' + now.getUTCMinutes()).slice(-2);
  return get_human_readable_UTC_timestamp_days(now) + ("_" + hh + "h" + mm);
}

exports.get_human_readable_UTC_timestamp_minutes = get_human_readable_UTC_timestamp_minutes;

function get_human_readable_UTC_timestamp_seconds(now) {
  if (now === void 0) {
    now = new Date();
  }

  var ss = ('0' + now.getUTCSeconds()).slice(-2);
  return get_human_readable_UTC_timestamp_minutes(now) + ("+" + ss);
}

exports.get_human_readable_UTC_timestamp_seconds = get_human_readable_UTC_timestamp_seconds;

function get_human_readable_UTC_timestamp_ms(now) {
  if (now === void 0) {
    now = new Date();
  }

  var mmm = ('00' + now.getUTCMilliseconds()).slice(-3);
  return get_human_readable_UTC_timestamp_seconds(now) + ("." + mmm);
}

exports.get_human_readable_UTC_timestamp_ms = get_human_readable_UTC_timestamp_ms; /////////////////////
},{}],"ah7l":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./types"));

__export(require("./generate"));
},{"./types":"vw0P","./generate":"dXjU"}],"IGJP":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MSG_ENTRY = '🧩UWDT.v0'; // TODO v1 one day!
},{}],"Sx64":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

__export(require("./entry"));

exports.LS_ROOT = '🧩UWDT'; // !== UDA

exports.LS_KEY_ENABLED = exports.LS_ROOT + ".enabled";
},{"./entry":"IGJP"}],"FRId":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNKNOWN_ORIGIN = '???';

__export(require("./entry"));

__export(require("./content--start"));
},{"./entry":"IGJP","./content--start":"Sx64"}],"qun1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSON_UNDEFINED = 'undefined';

function sjson_parse(s) {
  if (s === exports.JSON_UNDEFINED) return undefined;
  return JSON.parse(s);
}

exports.sjson_parse = sjson_parse;

function sjson_stringify(obj) {
  if (obj === undefined) return exports.JSON_UNDEFINED;
  return JSON.stringify(obj);
}

exports.sjson_stringify = sjson_stringify;

function is_valid_stringified_json(sjson) {
  if (sjson === exports.JSON_UNDEFINED) return true;

  if (typeof sjson !== 'string') {
    console.error("is_valid_stringified_json failure 1!", {
      sjson: sjson
    });
    return false;
  }

  try {
    JSON.parse(sjson);
    return true;
  } catch (_a) {
    console.error("is_valid_stringified_json failure 2!", {
      sjson: sjson
    });
    return false;
  }
}

exports.is_valid_stringified_json = is_valid_stringified_json; // useful only due to enforcing types thanks to a symbol.
// Should do nothing.

function control_sjson(sjson) {
  if (sjson === exports.JSON_UNDEFINED) return 'undefined';
  return sjson;
}

exports.control_sjson = control_sjson;
},{}],"W5qc":[function(require,module,exports) {
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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var typescript_string_enums_1 = require("typescript-string-enums");

var timestamps_1 = require("@offirmo-private/timestamps");

var stringified_json_1 = require("../utils/stringified-json");

var consts_1 = require("../consts");

var tiny_invariant_1 = __importDefault(require("tiny-invariant")); ////////////////////////////////////
// This state represents the "specification" of the debug API config we want
// - NOTE the local storage is the real spec!
//   This is just a temporary copy.
//   Hence some "undefined" = we haven't read the LS yet
// - This is a SPEC so it may not have been applied yet,
//   pending a reload to propagate the changes in the running code
// tslint:disable-next-line: variable-name


exports.OverrideType = typescript_string_enums_1.Enum('LogLevel', 'Cohort', 'boolean', //'string', // TODO useful?
//'URL', ?
// int ?
// more?
'any'); ////////////////////////////////////

function is_origin_eligible(origin) {
  if (origin === consts_1.UNKNOWN_ORIGIN) return false;
  if (origin.startsWith('chrome://')) return false;
  if (origin.startsWith('chrome-extension://')) return false;
  if (origin.startsWith('file://')) return false; // because no access to LS

  if (origin === 'null') // Firefox about:...
    return false;
  return true;
}

exports.is_origin_eligible = is_origin_eligible;

function is_eligible(state) {
  return is_origin_eligible(state.origin);
}

exports.is_eligible = is_eligible;

function is_injection_requested(state) {
  return state.is_injection_enabled;
}

exports.is_injection_requested = is_injection_requested;

function infer_override_type_from_key(key, value_sjson) {
  var key_lc = key.toLowerCase(); //console.log('INF', {key, key_lc})

  var suffix_lc = function () {
    var dot = key_lc.split('.').slice(-1)[0];
    var un = key_lc.split('_').slice(-1)[0];
    if (!dot) return un;
    if (!un) return dot;
    return un.length < dot.length ? un : dot;
  }();

  if (suffix_lc === 'loglevel' || suffix_lc === 'll') return exports.OverrideType.LogLevel;
  if (suffix_lc === 'cohort' || suffix_lc === 'co') return exports.OverrideType.Cohort;
  /* TODO check if string is useful
  if (suffix_lc === 'str')
      return OverrideType.string
   */
  //console.log('INF no suffix match')

  var bool_hint_separator;
  if (key_lc.startsWith('is')) bool_hint_separator = key[2];
  if (key_lc.startsWith('has')) bool_hint_separator = key[3];
  if (key_lc.startsWith('should')) bool_hint_separator = key[6];
  if (key_lc.startsWith('was')) bool_hint_separator = key[3];
  if (key_lc.startsWith('will')) bool_hint_separator = key[4];
  if (bool_hint_separator && (bool_hint_separator === '_' || bool_hint_separator !== bool_hint_separator.toLowerCase())) return exports.OverrideType.boolean; //console.log('INF no prefix match')

  if (!value_sjson) return exports.OverrideType.any;

  try {
    var value = stringified_json_1.sjson_parse(value_sjson); //console.log('INF', {value, value_sjson, type: typeof value})

    if (typeof value === 'boolean') return exports.OverrideType.boolean;
    /* TODO check if string is useful
       if (typeof value === 'string')
           return OverrideType.string
    */

    if (value === 'not-enrolled') return exports.OverrideType.Cohort;
  } catch (_a) {// ignore
  }

  return exports.OverrideType.any;
}

exports.infer_override_type_from_key = infer_override_type_from_key; ////////////////////////////////////

function create(origin) {
  return {
    origin: origin,
    last_visited: timestamps_1.get_UTC_timestamp_ms(),
    last_interacted_with: 0,
    is_injection_enabled: undefined,
    overrides: {}
  };
}

exports.create = create;
exports.DEMO_REPORTS = [{
  type: 'override',
  key: 'fooExperiment.cohort',
  default_value_sjson: stringified_json_1.sjson_stringify('not-enrolled'),
  existing_override_sjson: stringified_json_1.sjson_stringify('variation-1')
}, {
  type: 'override',
  key: 'fooExperiment.isSwitchedOn',
  default_value_sjson: stringified_json_1.sjson_stringify(true),
  existing_override_sjson: stringified_json_1.sjson_stringify(true)
}, {
  type: 'override',
  key: 'fooExperiment.logLevel',
  default_value_sjson: stringified_json_1.sjson_stringify('error'),
  existing_override_sjson: stringified_json_1.sjson_stringify('warning')
}, {
  type: 'override',
  key: 'root.logLevel',
  default_value_sjson: stringified_json_1.sjson_stringify('error'),
  existing_override_sjson: null
}, {
  type: 'override',
  key: 'some_url',
  default_value_sjson: stringified_json_1.sjson_stringify('https://www.online-adventur.es/'),
  //existing_override_sjson: null,
  existing_override_sjson: stringified_json_1.sjson_stringify('https://offirmo-monorepo.netlify.com/')
}, {
  type: 'override',
  key: 'some_url_undef',
  default_value_sjson: 'undefined',
  existing_override_sjson: null
}];

function create_demo(origin) {
  var state = create(origin);
  state = report_lib_injection(state, true);
  exports.DEMO_REPORTS.forEach(function (report) {
    return state = report_debug_api_usage(state, report);
  });
  state = change_override_spec(state, 'fooExperiment.cohort', {
    value_sjson: stringified_json_1.sjson_stringify('variation-1')
  });
  return state;
}

exports.create_demo = create_demo; // the content script reports that it injected the lib

function report_lib_injection(state, is_injected) {
  return __assign(__assign({}, state), {
    last_visited: timestamps_1.get_UTC_timestamp_ms(),
    is_injection_enabled: is_injected
  });
}

exports.report_lib_injection = report_lib_injection;

function report_debug_api_usage(state, report) {
  var _a;

  switch (report.type) {
    case 'override':
      {
        var key = report.key,
            default_value_sjson = report.default_value_sjson,
            existing_override_sjson = report.existing_override_sjson;
        tiny_invariant_1.default(!!key, 'O.report_debug_api_usage override key');
        tiny_invariant_1.default(stringified_json_1.is_valid_stringified_json(default_value_sjson), 'O.report_debug_api_usage default value !sjson');
        tiny_invariant_1.default(existing_override_sjson === null || stringified_json_1.is_valid_stringified_json(existing_override_sjson), 'O.report_debug_api_usage existing value null or string');

        var override = __assign(__assign({}, state.overrides[key]), {
          key: key,
          is_enabled: !!existing_override_sjson,
          type: infer_override_type_from_key(key, default_value_sjson),
          default_value_sjson: default_value_sjson,
          value_sjson: existing_override_sjson,
          last_reported: timestamps_1.get_UTC_timestamp_ms()
        });

        state = __assign(__assign({}, state), {
          overrides: __assign(__assign({}, state.overrides), (_a = {}, _a[key] = override, _a))
        });
        break;
      }

    default:
      console.error("O.report_debug_api_usage() unknown report type \"" + report.type + "\"!");
      break;
  }

  return state;
}

exports.report_debug_api_usage = report_debug_api_usage; // user toggled it, for current tab

function toggle_lib_injection(state) {
  return __assign(__assign({}, state), {
    is_injection_enabled: !state.is_injection_enabled,
    last_interacted_with: timestamps_1.get_UTC_timestamp_ms()
  });
}

exports.toggle_lib_injection = toggle_lib_injection; // user touched an override

function change_override_spec(state, key, partial) {
  var _a;

  var current_override = state.overrides[key];

  var partial2 = __assign({}, partial); // convenience: default value on activation for some fields


  if (partial.is_enabled === true && !partial.hasOwnProperty('value_sjson') && current_override.value_sjson === null) {
    switch (current_override.type) {
      case exports.OverrideType.boolean:
        // if toggled on, it's obvious the user wants to change the value = opposite of the default
        partial2.value_sjson = stringified_json_1.sjson_stringify(!Boolean(stringified_json_1.sjson_parse(current_override.default_value_sjson)));
        break;

      case exports.OverrideType.LogLevel:
        // if toggled on, we usually want more logs
        partial2.value_sjson = stringified_json_1.sjson_stringify('silly');
        break;

      case exports.OverrideType.Cohort:
        // if toggled on, we usually want sth different
        if (current_override.default_value_sjson.startsWith('"variation')) partial2.value_sjson = stringified_json_1.sjson_stringify('not-enrolled');else partial2.value_sjson = stringified_json_1.sjson_stringify('variation');
        break;

      default:
        if (current_override.key.toLowerCase().endsWith('url')) partial2.value_sjson = stringified_json_1.sjson_stringify('https://localhost:8080');
        break;
    }
  }

  return __assign(__assign({}, state), {
    overrides: __assign(__assign({}, state.overrides), (_a = {}, _a[key] = __assign(__assign({}, state.overrides[key]), partial2), _a)),
    last_interacted_with: timestamps_1.get_UTC_timestamp_ms()
  });
}

exports.change_override_spec = change_override_spec; ////////////////////////////////////
},{"typescript-string-enums":"Wne5","@offirmo-private/timestamps":"ah7l","../utils/stringified-json":"qun1","../consts":"FRId","tiny-invariant":"XpeU"}],"VPdt":[function(require,module,exports) {
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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tiny_invariant_1 = __importDefault(require("tiny-invariant"));

var typescript_string_enums_1 = require("typescript-string-enums");

var timestamps_1 = require("@offirmo-private/timestamps");

var consts_1 = require("../consts");

var OriginState = __importStar(require("./origin"));

var stringified_json_1 = require("../utils/stringified-json"); ////////////////////////////////////
// tslint:disable-next-line: variable-name


exports.SpecSyncStatus = typescript_string_enums_1.Enum('active-and-up-to-date', 'changed-needs-reload', 'inactive', 'unknown', // happens when we install the extension or reload it during dev
'unexpected-error'); ////////////////////////////////////

/*
export function is_sync_status_hinting_at_a_reload(status: SpecSyncStatus): boolean {
    switch(status) {
        case 'active-and-up-to-date':
        case 'inactive':
            return false
        default:
            return true
    }
}
*/
// at last (re)load

function was_injection_enabled(state) {
  return state.last_reported_injection_status;
}

exports.was_injection_enabled = was_injection_enabled;

function get_global_switch_sync_status(state, origin_state) {
  if (OriginState.is_injection_requested(origin_state) !== was_injection_enabled(state)) return exports.SpecSyncStatus['changed-needs-reload'];
  if (!origin_state.is_injection_enabled) return exports.SpecSyncStatus.inactive;
  return exports.SpecSyncStatus['active-and-up-to-date'];
}

exports.get_global_switch_sync_status = get_global_switch_sync_status;

function get_override_sync_status(state, override_spec) {
  var key = override_spec.key;
  var override = state.overrides[key];
  if (!override) return exports.SpecSyncStatus['unexpected-error'];
  if (!override.last_reported) return exports.SpecSyncStatus.inactive;

  if (override_spec.is_enabled && override_spec.value_sjson) {
    if (!stringified_json_1.is_valid_stringified_json(override_spec.value_sjson)) return exports.SpecSyncStatus['unexpected-error'];
  }

  var was_enabled = override.last_reported_value_sjson !== null;
  if (override_spec.is_enabled !== was_enabled) return exports.SpecSyncStatus['changed-needs-reload'];
  if (!override_spec.is_enabled) return exports.SpecSyncStatus['active-and-up-to-date']; // we don't care about the value if !enabled

  if (override_spec.value_sjson !== override.last_reported_value_sjson) return exports.SpecSyncStatus['changed-needs-reload'];
  return exports.SpecSyncStatus['active-and-up-to-date'];
}

exports.get_override_sync_status = get_override_sync_status;

function get_sync_status(state, origin_state) {
  if (state.origin === consts_1.UNKNOWN_ORIGIN) return exports.SpecSyncStatus.inactive;

  if (OriginState.is_injection_requested(origin_state) === undefined) {
    // ext freshly installed = we don't know what state is the tab in
    return exports.SpecSyncStatus.unknown;
  }

  if (was_injection_enabled(state) === undefined) {
    // means the magic is not activated
    // This happen on extension install / reinstall
    return exports.SpecSyncStatus.unknown;
  }

  var global_switch_sync_status = get_global_switch_sync_status(state, origin_state);
  if (global_switch_sync_status !== exports.SpecSyncStatus['active-and-up-to-date']) return global_switch_sync_status;
  var non_inactive_count = 0;

  for (var _i = 0, _a = Object.keys(origin_state.overrides); _i < _a.length; _i++) {
    var key = _a[_i];
    var override_spec = origin_state.overrides[key];
    var sync_status = get_override_sync_status(state, override_spec);
    if (sync_status !== exports.SpecSyncStatus['active-and-up-to-date'] && sync_status !== exports.SpecSyncStatus.inactive) return sync_status;
    if (sync_status !== exports.SpecSyncStatus.inactive) non_inactive_count++;
  }

  return non_inactive_count || Object.keys(origin_state.overrides).length === 0 ? exports.SpecSyncStatus['active-and-up-to-date'] : exports.SpecSyncStatus.inactive;
}

exports.get_sync_status = get_sync_status;
/*
export function needs_reload(state: Readonly<State>, origin_state: Readonly<OriginState.State>): boolean {
    return is_sync_status_hinting_at_a_reload(get_sync_status(state, origin_state))
}
*/
////////////////////////////////////

function create(tab_id) {
  return {
    id: tab_id,
    url: consts_1.UNKNOWN_ORIGIN,
    origin: consts_1.UNKNOWN_ORIGIN,
    last_reported_injection_status: undefined,
    overrides: {}
  };
}

exports.create = create; // if a tab gets created, or a navigation happens inside a tab.
// If it's a navigation, the origin may change and the current page state may switch to another origin
// thus we need to clear stuff

function on_load(state) {
  return __assign(__assign({}, state), {
    // a navigation may have happened, invalidate origin
    url: consts_1.UNKNOWN_ORIGIN,
    origin: consts_1.UNKNOWN_ORIGIN,
    // same, reset overrides
    overrides: {}
  });
}

exports.on_load = on_load;

function update_origin(previous_state, url, origin_state) {
  var origin = origin_state.origin; //if (origin === previous_state.origin) return previous_state

  var state = __assign(__assign({}, previous_state), {
    url: url,
    origin: origin,
    overrides: {}
  });

  Object.keys(origin_state.overrides).forEach(function (key) {
    state = ensure_override(state, origin_state.overrides[key]);
  });
  return state;
}

exports.update_origin = update_origin; // the content script reports that it injected the lib

function report_lib_injection(state, is_injected) {
  if (state.last_reported_injection_status === is_injected) return state;
  return __assign(__assign({}, state), {
    last_reported_injection_status: is_injected
  });
}

exports.report_lib_injection = report_lib_injection;

function ensure_override(state, override_spec) {
  var key = override_spec.key;
  state = __assign(__assign({}, state), {
    overrides: __assign({}, state.overrides)
  });
  state.overrides[key] = state.overrides[key] || {
    key: key,
    last_reported: -1,
    last_reported_value_sjson: undefined
  };
  return state;
}

exports.ensure_override = ensure_override;

function report_debug_api_usage(state, report) {
  var _a;

  switch (report.type) {
    case 'override':
      {
        var key = report.key,
            existing_override_sjson = report.existing_override_sjson;
        tiny_invariant_1.default(!!key, 'T.report_debug_api_usage override key');

        var override = __assign(__assign({}, state.overrides[key]), {
          key: key,
          last_reported: timestamps_1.get_UTC_timestamp_ms(),
          last_reported_value_sjson: existing_override_sjson
        });

        state = __assign(__assign({}, state), {
          overrides: __assign(__assign({}, state.overrides), (_a = {}, _a[key] = override, _a))
        });
        break;
      }

    default:
      console.error("T.report_debug_api_usage() unknown report type \"" + report.type + "\"!");
      break;
  }

  return state;
}

exports.report_debug_api_usage = report_debug_api_usage; ////////////////////////////////////
},{"tiny-invariant":"XpeU","typescript-string-enums":"Wne5","@offirmo-private/timestamps":"ah7l","../consts":"FRId","./origin":"W5qc","../utils/stringified-json":"qun1"}],"aO2m":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tiny_invariant_1 = __importDefault(require("tiny-invariant"));

var webextension_polyfill_ts_1 = require("webextension-polyfill-ts");

var consts_1 = require("../common/consts");

var origin_1 = require("../common/state/origin");

function query_active_tab() {
  return webextension_polyfill_ts_1.browser.tabs.query({
    active: true,
    currentWindow: true
  }).then(function (_a) {
    var active_tab = _a[0],
        other_tabs = _a.slice(1);

    if (!active_tab) {
      console.error("\nPlease do not manually refresh the extension background tab!\nPlease use the refresh button in the extension UI instead!\n");
      tiny_invariant_1.default(active_tab, 'query_active_tab()');
    }

    tiny_invariant_1.default(active_tab.id, 'query_active_tab(): tab id'); // typings seems to imply it could be undef

    return active_tab;
  });
}

exports.query_active_tab = query_active_tab;

function get_origin(url) {
  if (url === consts_1.UNKNOWN_ORIGIN) return consts_1.UNKNOWN_ORIGIN;

  try {
    var origin = new URL(url).origin || consts_1.UNKNOWN_ORIGIN;
    if (!origin_1.is_origin_eligible(origin)) return consts_1.UNKNOWN_ORIGIN;
    return origin;
  } catch (_a) {
    return consts_1.UNKNOWN_ORIGIN;
  }
}

exports.get_origin = get_origin;
},{"tiny-invariant":"XpeU","webextension-polyfill-ts":"c2lp","../common/consts":"FRId","../common/state/origin":"W5qc"}],"a6N1":[function(require,module,exports) {
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

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tiny_invariant_1 = __importDefault(require("tiny-invariant"));

var consts_1 = require("../common/consts");

var OriginState = __importStar(require("../common/state/origin"));

var TabState = __importStar(require("../common/state/tab"));

var utils_1 = require("./utils"); ////////////////////////////////////


function get_active_tab_id(state, from) {
  var active_tab_id = state.active_tab_id;
  tiny_invariant_1.default(active_tab_id !== undefined, "get_active_tab_id() from \"" + from + "\"");
  return active_tab_id;
}

exports.get_active_tab_id = get_active_tab_id;

function get_tab_origin(state, tab_id) {
  var tab_state = state.tabs[tab_id];
  tiny_invariant_1.default(!!tab_state, 'get_tab_origin tab state');
  return tab_state.origin;
}

exports.get_tab_origin = get_tab_origin;

function get_active_origin_state(state, _a) {
  var _b = (_a === void 0 ? {} : _a).should_assert,
      should_assert = _b === void 0 ? true : _b;
  var active_tab_id = get_active_tab_id(state, 'get_active_origin_state()');
  var current_tab_origin = get_tab_origin(state, active_tab_id);
  tiny_invariant_1.default(!!current_tab_origin, 'get_active_origin_state(): current_tab_origin');
  return state.origins[current_tab_origin];
}

exports.get_active_origin_state = get_active_origin_state;

function get_active_tab_state(state) {
  var active_tab_id = get_active_tab_id(state, 'get_active_tab_state()');
  return state.tabs[active_tab_id];
}

exports.get_active_tab_state = get_active_tab_state;

function get_port(state, channel_id) {
  return state.ports[channel_id];
}

exports.get_port = get_port; ////////////////////////////////////

function create() {
  var _a;

  return {
    ports: {},
    active_tab_id: undefined,
    active_tab: new Promise(function () {}),
    origins: (_a = {}, _a[consts_1.UNKNOWN_ORIGIN] = OriginState.create(consts_1.UNKNOWN_ORIGIN), _a),
    tabs: {}
  };
}

exports.create = create; // we need to store and share ports for sharing across files

function update_port(state, channel_id, port) {
  if (port) state.ports[channel_id] = port;else delete state.ports[channel_id];
  return state;
}

exports.update_port = update_port; // tab lifecycle events happen in any order

function ensure_tab(state, source, id) {
  var _a;

  if (state.tabs[id]) return state;
  console.log("\u2705 Tab #" + id + " discovered through " + source);
  return __assign(__assign({}, state), {
    tabs: __assign(__assign({}, state.tabs), (_a = {}, _a[id] = TabState.create(id), _a))
  });
}

exports.ensure_tab = ensure_tab; // we need to track the currently active tab,
// mainly to update the extension icon

function on_tab_activated(state, id, tab_hint) {
  var _a;

  return __assign(__assign({}, state), {
    active_tab_id: id,
    active_tab: tab_hint ? Promise.resolve(tab_hint) : utils_1.query_active_tab(),
    tabs: __assign(__assign({}, state.tabs), (_a = {}, _a[id] = state.tabs[id] || TabState.create(id), _a))
  });
}

exports.on_tab_activated = on_tab_activated; // we need to track tab origins
// to properly apply the settings for this origin
// UNKNOWN_ORIGIN is for non-browsing tabs, ex. browser settings, which have no URL

function update_tab_origin(state, tab_id, url) {
  var _a, _b;

  if (url === void 0) {
    url = consts_1.UNKNOWN_ORIGIN;
  }

  if (state.tabs[tab_id].url === url) return state; // up to date

  var origin = utils_1.get_origin(url);
  state = __assign(__assign({}, state), {
    origins: __assign(__assign({}, state.origins), (_a = {}, _a[origin] = state.origins[origin] || OriginState.create(origin), _a))
  });
  state = __assign(__assign({}, state), {
    tabs: __assign(__assign({}, state.tabs), (_b = {}, _b[tab_id] = TabState.update_origin(state.tabs[tab_id], url, state.origins[origin]), _b))
  });
  return state;
}

exports.update_tab_origin = update_tab_origin;

function on_tab_loading(state, tab_id) {
  var _a;

  return __assign(__assign({}, state), {
    tabs: __assign(__assign({}, state.tabs), (_a = {}, _a[tab_id] = TabState.on_load(state.tabs[tab_id]), _a))
  });
}

exports.on_tab_loading = on_tab_loading;

function report_lib_injection(state, tab_id, is_injected) {
  var _a, _b;

  var origin = state.tabs[tab_id].origin;
  return __assign(__assign({}, state), {
    origins: __assign(__assign({}, state.origins), (_a = {}, _a[origin] = OriginState.report_lib_injection(state.origins[origin], is_injected), _a)),
    tabs: __assign(__assign({}, state.tabs), (_b = {}, _b[tab_id] = TabState.report_lib_injection(state.tabs[tab_id], is_injected), _b))
  });
}

exports.report_lib_injection = report_lib_injection;

function toggle_lib_injection(state, tab_id) {
  var _a;

  tiny_invariant_1.default(tab_id >= 0, 'toggle_lib_injection: tab_id');
  var tab_origin = state.tabs[tab_id].origin;
  tiny_invariant_1.default(!!tab_origin, 'toggle_lib_injection: tab_origin');
  return __assign(__assign({}, state), {
    origins: __assign(__assign({}, state.origins), (_a = {}, _a[tab_origin] = OriginState.toggle_lib_injection(state.origins[tab_origin]), _a))
  });
}

exports.toggle_lib_injection = toggle_lib_injection;

function report_debug_api_usage(state, tab_id, reports) {
  var _a, _b;

  var tab_state = state.tabs[tab_id];
  tiny_invariant_1.default(!!tab_state, 'report_debug_api_usage: tab_state');
  var origin_state = state.origins[tab_state.origin];
  tiny_invariant_1.default(!!origin_state, 'report_debug_api_usage: origin_state');
  reports.forEach(function (report) {
    origin_state = OriginState.report_debug_api_usage(origin_state, report);
    tab_state = TabState.report_debug_api_usage(tab_state, report);
  });
  return __assign(__assign({}, state), {
    origins: __assign(__assign({}, state.origins), (_a = {}, _a[tab_state.origin] = origin_state, _a)),
    tabs: __assign(__assign({}, state.tabs), (_b = {}, _b[tab_id] = tab_state, _b))
  });
}

exports.report_debug_api_usage = report_debug_api_usage;

function change_override_spec(state, tab_id, key, partial) {
  var _a;

  tiny_invariant_1.default(tab_id >= 0, 'change_override_spec: tab_id');
  var tab_origin = state.tabs[tab_id].origin;
  tiny_invariant_1.default(!!tab_origin, 'change_override_spec: tab_origin');
  return __assign(__assign({}, state), {
    origins: __assign(__assign({}, state.origins), (_a = {}, _a[tab_origin] = OriginState.change_override_spec(state.origins[tab_origin], key, partial), _a))
  });
}

exports.change_override_spec = change_override_spec; ////////////////////////////////////
},{"tiny-invariant":"XpeU","../common/consts":"FRId","../common/state/origin":"W5qc","../common/state/tab":"VPdt","./utils":"aO2m"}],"lK5q":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var emittery_1 = __importDefault(require("emittery"));

var tiny_invariant_1 = __importDefault(require("tiny-invariant"));

var TabState = __importStar(require("../common/state/tab"));

var utils_1 = require("./utils");

var State = __importStar(require("./state")); ////////////////////////////////////


var state = State.create();
console.log('🌀 initial state', state);
exports.icon_emitter = new emittery_1.default();
exports.ui_emitter = new emittery_1.default();
exports.cscript_emitter = new emittery_1.default(); ////////////////////////////////////

function get_active_tab_id(from) {
  return State.get_active_tab_id(state, from);
}

exports.get_active_tab_id = get_active_tab_id;

function get_port(channel_id) {
  return State.get_port(state, channel_id);
}

exports.get_port = get_port;

function get_tab_origin(tab_id) {
  return state.tabs[tab_id].origin;
}

exports.get_tab_origin = get_tab_origin;

function get_active_tab_sync_status() {
  tiny_invariant_1.default(get_active_tab_id('get_active_tab_sync_status()') !== undefined);
  var t = State.get_active_tab_state(state);
  var o = State.get_active_origin_state(state);
  return TabState.get_sync_status(t, o);
}

exports.get_active_tab_sync_status = get_active_tab_sync_status;

function get_active_origin_state() {
  var current_tab_id = get_active_tab_id('get_active_origin_state()');
  var current_tab_origin = get_tab_origin(current_tab_id);
  tiny_invariant_1.default(current_tab_origin, 'get_active_origin_state: current_tab_origin');
  return state.origins[current_tab_origin];
}

exports.get_active_origin_state = get_active_origin_state;

function get_active_tab_ui_state() {
  tiny_invariant_1.default(get_active_tab_id('get_active_tab_ui_state()') !== undefined);
  var tab = State.get_active_tab_state(state);
  var origin = State.get_active_origin_state(state);
  return {
    tab: tab,
    origin: origin
  };
}

exports.get_active_tab_ui_state = get_active_tab_ui_state; ////////////////////////////////////

function on_init() {
  console.group('🌀 on_init');
  console.log('before', state); // Convenience for extension install and dev reload,
  // manual query to properly get info for the current tab
  // for whom we missed the creation events.
  // Subsequent new tabs / tab change
  // will be detected and handled normally.

  utils_1.query_active_tab().then(function (tab) {
    console.group('🌀 on_init (2)', tab);
    on_tab_activated(tab.id, tab);
    console.groupEnd();
  });
  console.log('after', state);
  console.groupEnd();
}

exports.on_init = on_init;

function ensure_tab(source, id, tab_hint) {
  console.group('🌀 ensure_tab', {
    id: id,
    tab_hint: tab_hint
  });
  console.log('before', state);
  state = State.ensure_tab(state, source, id); // no react, we should get tab events soon

  console.log('after', state);
  console.groupEnd();
}

exports.ensure_tab = ensure_tab;

function on_tab_activated(id, tab_hint) {
  console.group('🌀 on_tab_activated', {
    id: id,
    tab_hint: tab_hint
  });
  console.log('before', state);
  state = State.on_tab_activated(state, id, tab_hint); // get the origin as soon as possible

  state.active_tab.then(function (tab) {
    var active_tab_id = tab.id,
        url = tab.url;

    if (active_tab_id !== id) {
      // outdated
      console.groupCollapsed('🌀 on_tab_activated (2a): outdated tab info received, ignoring.', {
        active_tab_id: active_tab_id,
        id: id
      });
      return;
    }

    console.group('🌀 on_tab_activated (2b): updating origin', {
      active_tab_id: active_tab_id,
      url: url
    });
    if (url) update_tab_origin(id, url);
    console.groupEnd();
  });
  exports.icon_emitter.emit('change', state);
  console.log('after', state);
  console.groupEnd();
}

exports.on_tab_activated = on_tab_activated;

function update_tab_origin(tab_id, url) {
  console.group('🌀 update_tab_origin', {
    tabId: tab_id,
    url: url
  });
  console.log('before', state);
  var old_state = state;
  state = State.update_tab_origin(state, tab_id, url);

  if (old_state !== state && state.active_tab_id !== undefined) {
    exports.icon_emitter.emit('change', state);
    exports.ui_emitter.emit('change', state);
  }

  console.log('after', state);
  console.groupEnd();
}

exports.update_tab_origin = update_tab_origin;

function update_port(channel_id, port) {
  console.group('🌀 update_port', {
    channel_id: channel_id,
    port: port
  });
  console.log('before', state);
  state = State.update_port(state, channel_id, port);

  if (port) {
    port.onDisconnect.addListener(function () {
      return update_port(channel_id, null);
    });
    if (channel_id === 'popup' || channel_id === 'devtools') exports.ui_emitter.emit('change', state);
  }

  console.log('after', state);
  console.groupEnd();
}

exports.update_port = update_port;

function on_tab_loading(tab_id) {
  console.group('🌀 on_tab_loading', {
    tab_id: tab_id
  });
  console.log('before', state);
  state = State.on_tab_loading(state, tab_id);
  if (state.active_tab_id === tab_id) exports.icon_emitter.emit('change', state);
  console.log('after', state);
  console.groupEnd();
}

exports.on_tab_loading = on_tab_loading;

function report_lib_injection(tab_id, is_injected) {
  console.group('🌀 report_lib_injection', {
    tab_id: tab_id,
    is_injected: is_injected,
    known_active_tab: state.active_tab_id
  });
  console.log('before', state);
  state = State.report_lib_injection(state, tab_id, is_injected);

  if (state.active_tab_id === tab_id) {
    exports.icon_emitter.emit('change', state);
    exports.ui_emitter.emit('change', state);
  }

  console.log('after', state);
  console.groupEnd();
}

exports.report_lib_injection = report_lib_injection;

function toggle_lib_injection(tab_id) {
  console.group('🌀 toggle_lib_injection');
  console.log('before', state);
  state = State.toggle_lib_injection(state, tab_id);
  exports.icon_emitter.emit('change', state);
  exports.ui_emitter.emit('change', state);
  exports.cscript_emitter.emit('change', state);
  console.log('after', state);
  console.groupEnd();
}

exports.toggle_lib_injection = toggle_lib_injection;

function report_debug_api_usage(tab_id, reports) {
  console.group('🌀 report_debug_api_usage', {
    reports: reports
  });
  console.log('before', state);
  state = State.report_debug_api_usage(state, tab_id, reports);

  if (state.active_tab_id === tab_id) {
    exports.icon_emitter.emit('change', state);
    exports.ui_emitter.emit('change', state);
  }

  console.log('after', state);
  console.groupEnd();
}

exports.report_debug_api_usage = report_debug_api_usage;

function change_override_spec(tab_id, key, partial) {
  console.group('🌀 change_override_spec', {
    tab_id: tab_id,
    key: key,
    partial: partial
  });
  console.log('before', state);
  state = State.change_override_spec(state, tab_id, key, partial);
  exports.icon_emitter.emit('change', state);
  exports.ui_emitter.emit('change', state);
  exports.cscript_emitter.emit('change', state);
  console.log('after', state);
  console.groupEnd();
}

exports.change_override_spec = change_override_spec; ////////////////////////////////////
// convenience

var state_1 = require("./state");

exports.State = state_1.State;
},{"emittery":"hmGQ","tiny-invariant":"XpeU","../common/state/tab":"VPdt","./utils":"aO2m","./state":"a6N1"}],"xHCB":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function areInputsEqual(newInputs, lastInputs) {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }

  for (var i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }

  return true;
}

function memoizeOne(resultFn, isEqual) {
  if (isEqual === void 0) {
    isEqual = areInputsEqual;
  }

  var lastThis;
  var lastArgs = [];
  var lastResult;
  var calledOnce = false;

  function memoized() {
    var newArgs = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      newArgs[_i] = arguments[_i];
    }

    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult;
    }

    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  }

  return memoized;
}

var _default = memoizeOne;
exports.default = _default;
},{}],"dBNx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var entry_1 = require("../consts/entry"); ////////////////////////////////////


exports.MSG_TYPE__REPORT_DEBUG_API_USAGE = 'report-usage';

function create_msg_report_debug_api_usage(reports) {
  var _a;

  return _a = {}, _a[entry_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__REPORT_DEBUG_API_USAGE,
    reports: reports
  }, _a;
}

exports.create_msg_report_debug_api_usage = create_msg_report_debug_api_usage;
},{"../consts/entry":"IGJP"}],"sEPV":[function(require,module,exports) {
"use strict";

function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});

var consts_1 = require("../consts");

exports.MSG_TYPE__TOGGLE_LIB_INJECTION = 'toggle-lib-injection';

function create_msg_toggle_lib_injection() {
  var _a;

  return _a = {}, _a[consts_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__TOGGLE_LIB_INJECTION
  }, _a;
}

exports.create_msg_toggle_lib_injection = create_msg_toggle_lib_injection;
exports.MSG_TYPE__REPORT_IS_LIB_INJECTED = 'report-is-lib-injected';

function create_msg_report_is_lib_injected(url, is_injected) {
  var _a;

  return _a = {}, _a[consts_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__REPORT_IS_LIB_INJECTED,
    url: url,
    is_injected: is_injected
  }, _a;
}

exports.create_msg_report_is_lib_injected = create_msg_report_is_lib_injected;
exports.MSG_TYPE__OVERRIDE_SPEC_CHANGED = 'change-override-spec';

function create_msg_change_override_spec(key, partial) {
  var _a;

  return _a = {}, _a[consts_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__OVERRIDE_SPEC_CHANGED,
    key: key,
    partial: partial
  }, _a;
}

exports.create_msg_change_override_spec = create_msg_change_override_spec;
exports.MSG_TYPE__UPDATE_UI_STATE = 'update-ui-state';

function create_msg_update_ui_state(state) {
  var _a;

  return _a = {}, _a[consts_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__UPDATE_UI_STATE,
    state: state
  }, _a;
}

exports.create_msg_update_ui_state = create_msg_update_ui_state;
exports.MSG_TYPE__UPDATE_LS_STATE = 'update-ls-state';

function create_msg_update_ls_state(kv) {
  var _a;

  return _a = {}, _a[consts_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__UPDATE_LS_STATE,
    kv: kv
  }, _a;
}

exports.create_msg_update_ls_state = create_msg_update_ls_state;
exports.MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD = 'request-current-page-reload';

function create_msg_request_reload() {
  var _a;

  return _a = {}, _a[consts_1.MSG_ENTRY] = {
    type: exports.MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD
  }, _a;
}

exports.create_msg_request_reload = create_msg_request_reload;

__export(require("./report-usage"));
},{"../consts":"FRId","./report-usage":"dBNx"}],"fewX":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LS_ROOT = '🛠UDA';
},{}],"Hb3e":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var consts_1 = require("../consts");

var consts_2 = require("../consts");

exports.LS_ROOT = consts_2.LS_ROOT;

function getOverrideKeyForLogger(name) {
  return "logger." + (name || 'default') + ".logLevel";
}

exports.getOverrideKeyForLogger = getOverrideKeyForLogger;

function getLSKeyForOverride(key) {
  // should we put v1 somewhere? no, most likely overkill.
  return consts_1.LS_ROOT + ".override." + key;
}

exports.getLSKeyForOverride = getLSKeyForOverride;
},{"../consts":"fewX"}],"h2o3":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var webextension_polyfill_ts_1 = require("webextension-polyfill-ts");

var memoize_one_1 = __importDefault(require("memoize-one"));

var Flux = __importStar(require("./flux"));

var stringified_json_1 = require("../common/utils/stringified-json");

var consts_1 = require("../common/consts");

var messages_1 = require("../common/messages");

var tab_1 = require("../common/state/tab");

var keys_1 = require("@offirmo/universal-debug-api-browser/src/v1/keys"); ////////////////////////////////////


var render_webext_icon = memoize_one_1.default(function render_webext_icon(sync_status) {
  console.log('🔄 render_webext_icon', {
    sync_status: sync_status
  });
  var text = '✗';
  var color = "#ff0000";

  switch (sync_status) {
    case tab_1.SpecSyncStatus["unexpected-error"]:
      break;

    case tab_1.SpecSyncStatus.inactive:
    case tab_1.SpecSyncStatus.unknown:
      // because happen when the ext is freshly installed or reloaded in dev = most likely inactive
      text = '';
      break;

    case tab_1.SpecSyncStatus["changed-needs-reload"]:
      text = '↻';
      color = '#f3b200';
      break;

    case tab_1.SpecSyncStatus["active-and-up-to-date"]:
      text = '✔';
      color = "#00AA00";
      break;

    default:
      console.error('Unknown sync_status!', {
        sync_status: sync_status
      });
      break;
  } // Note: it sets it for ALL tabs


  webextension_polyfill_ts_1.browser.browserAction.setBadgeText({
    text: text
  });
  webextension_polyfill_ts_1.browser.browserAction.setBadgeBackgroundColor({
    color: color
  });
});
Flux.icon_emitter.on('change', function () {
  var tab_sync_status = Flux.get_active_tab_sync_status();
  console.log('🔄 icon_emitter.onChange', {
    tab_sync_status: tab_sync_status,
    tab_id: Flux.get_active_tab_id('Flux.icon_emitter')
  });
  render_webext_icon(tab_sync_status);
}); ////////////////////////////////////

function update_ui_state() {
  var port = Flux.get_port('popup');

  if (!port) {
    // popup is closed
    console.log('🔄 update_ui_state: no UI');
    return;
  }

  console.group('🔄 update_ui_state…');
  var ui_state = Flux.get_active_tab_ui_state();
  console.log('📤 dispatching state to UI:', ui_state);
  port.postMessage(messages_1.create_msg_update_ui_state(ui_state));
  console.groupEnd();
}

Flux.ui_emitter.on('change', function () {
  update_ui_state();
}); // TODO persist settings
//    browser.storage.local.set({'address': req.address})
////////////////////////////////////

function propagate_lib_config() {
  var current_tab_id = Flux.get_active_tab_id('from propagate_lib_config()');
  var origin_state = Flux.get_active_origin_state();
  console.group('🔄 propagate_lib_config', {
    current_tab_id: current_tab_id,
    origin_state: origin_state
  });
  var kv = {};
  kv[consts_1.LS_KEY_ENABLED] = origin_state.is_injection_enabled ? 'true' : null;
  Object.values(origin_state.overrides).forEach(function (spec) {
    var key = spec.key,
        is_enabled = spec.is_enabled,
        value_sjson = spec.value_sjson;
    var LSKey = keys_1.getLSKeyForOverride(key);
    kv[LSKey] = is_enabled ? value_sjson ? stringified_json_1.control_sjson(value_sjson) : null : null;
  });
  console.log("\uD83D\uDCE4 dispatching origin config to content-script of tab#" + current_tab_id, kv);
  webextension_polyfill_ts_1.browser.tabs.sendMessage(current_tab_id, messages_1.create_msg_update_ls_state(kv)).catch(function (err) {
    var message = err.message;

    if (message.includes('Receiving end does not exist')) {// the content script wasn't executed
      // most likely the extension just kot installed
      // or reloaded (dev)
      // ignore.
    } else {
      console.error("propagate_lib_config when dispatching to tab#" + current_tab_id, err);
    }
  });
  console.groupEnd();
}

Flux.cscript_emitter.on('change', function () {
  propagate_lib_config();
}); ////////////////////////////////////
},{"webextension-polyfill-ts":"c2lp","memoize-one":"xHCB","./flux":"lK5q","../common/utils/stringified-json":"qun1","../common/consts":"FRId","../common/messages":"sEPV","../common/state/tab":"VPdt","@offirmo/universal-debug-api-browser/src/v1/keys":"Hb3e"}],"shBX":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tiny_invariant_1 = __importDefault(require("tiny-invariant"));

var webextension_polyfill_ts_1 = require("webextension-polyfill-ts");

var deferred_1 = __importDefault(require("@offirmo/deferred"));

var Flux = __importStar(require("./flux"));

require("./react");

var consts_1 = require("../common/consts");

var messages_1 = require("../common/messages");

var utils_1 = require("./utils");

var LIB = '🧩 UWDT/bg'; // TODO clean logs!

console.log("[" + LIB + "." + +Date.now() + "] Hello from background!", webextension_polyfill_ts_1.browser);
var extension_inited = new deferred_1.default();
var is_extension_inited = false;
extension_inited.then(function (from) {
  is_extension_inited = true;
  console.log("\uD83D\uDE48\uD83D\uDE49 extension inited!", {
    from: from
  });
});
setTimeout(function () {
  if (is_extension_inited) return; // should never happen

  console.error('🙊 Timeout (2) waiting for extension init!');
  extension_inited.resolve('gave up');
}, 120 * 1000);
setTimeout(function () {
  if (is_extension_inited) return; // should never happen

  console.error('🙊 Timeout (1) waiting for extension init!');
  extension_inited.resolve(utils_1.query_active_tab().then(function () {
    return 'attempt 2';
  }));
}, 30 * 1000);

function once_extension_init_done(cb) {
  // we want sync as much as possible
  if (is_extension_inited) return Promise.resolve(cb());
  return extension_inited.then(cb);
}

Flux.on_init();
extension_inited.resolve(utils_1.query_active_tab().then(function () {
  return 'attempt 1';
})); ////////////////////////////////////
// listen to some events
// https://developer.browser.com/extensions/tabs

webextension_polyfill_ts_1.browser.runtime.onInstalled.addListener(function () {
  console.group('⚡️ on extension installed'); // we used to have some stuff here
  // but this event is unreliable: not seen on browser (re)start

  console.groupEnd();
});
webextension_polyfill_ts_1.browser.tabs.onCreated.addListener(function (tab) {
  console.group('⚡️ on tab created', {
    tab: tab
  });
  if (!tab.id) console.warn('tab without id???');else Flux.ensure_tab('onCreated event', tab.id, tab);
  console.groupEnd();
}); // note that we can totally receive this event
// without having received any create() or activated()
// for ex. the extension just got installed
// and then anon-active tab updates its favicon = we receive this event

webextension_polyfill_ts_1.browser.tabs.onUpdated.addListener(function (tab_id, change_info, tab) {
  console.group('⚡️ on tab updated', {
    tab_id: tab_id,
    change_info: change_info,
    tab: tab
  });
  Flux.ensure_tab('onUpdated event', tab_id, tab);
  if (tab.url) Flux.update_tab_origin(tab_id, tab.url);
  if (change_info.status === 'loading') Flux.on_tab_loading(tab_id);
  console.groupEnd();
});
webextension_polyfill_ts_1.browser.tabs.onActivated.addListener(function (_a) {
  var tabId = _a.tabId,
      windowId = _a.windowId;
  console.group('⚡️ on tab activated', {
    tabId: tabId,
    windowId: windowId
  });
  Flux.on_tab_activated(tabId);
  console.groupEnd();
}); ////////////////////////////////////
// listen to simple messages from other parts of this extension
// https://developer.browser.com/extensions/messaging#simple

webextension_polyfill_ts_1.browser.runtime.onMessage.addListener(function (request, sender) {
  // FF refreshes content script before the background script starts to receive events
  return once_extension_init_done(function () {
    console.group("\uD83D\uDCE5 bg received a simple message");
    var response = null;

    try {
      console.log(sender.tab ? 'from a content script: ' + sender.tab.url : 'from an extension part', {
        sender: sender
      });
      tiny_invariant_1.default(request[consts_1.MSG_ENTRY], 'MSG_ENTRY');
      var payload = request[consts_1.MSG_ENTRY];
      var type = payload.type;
      console.log({
        type: type,
        payload: payload
      });

      switch (type) {
        /////// from content script ///////
        case messages_1.MSG_TYPE__REPORT_IS_LIB_INJECTED:
          {
            tiny_invariant_1.default(sender.tab, type + ": is from a tab");
            tiny_invariant_1.default(sender.tab.id, type + ": is from a tab (2)");
            var tab_id = sender.tab.id;
            var is_injected = payload.is_injected,
                url = payload.url;
            Flux.ensure_tab("" + type, tab_id, sender.tab);
            Flux.update_tab_origin(tab_id, url);
            Flux.report_lib_injection(tab_id, is_injected);
            break;
          }

        case messages_1.MSG_TYPE__REPORT_DEBUG_API_USAGE:
          {
            tiny_invariant_1.default(sender.tab, type + ": is from a tab");
            tiny_invariant_1.default(sender.tab.id, type + ": is from a tab (2)");
            var tab_id = sender.tab.id;
            Flux.ensure_tab("" + type, tab_id, sender.tab);
            Flux.report_debug_api_usage(tab_id, payload.reports);
            break;
          }
        /////// from UI = popup ///////
        // no tab infos available from popup

        case messages_1.MSG_TYPE__REQUEST_CURRENT_PAGE_RELOAD:
          {
            var tab_id = Flux.get_active_tab_id("from " + type);
            webextension_polyfill_ts_1.browser.tabs.reload(tab_id);
            break;
          }

        case messages_1.MSG_TYPE__TOGGLE_LIB_INJECTION:
          {
            var tab_id = Flux.get_active_tab_id("from " + type);
            Flux.toggle_lib_injection(tab_id);
            break;
          }

        case messages_1.MSG_TYPE__OVERRIDE_SPEC_CHANGED:
          {
            var tab_id = Flux.get_active_tab_id("from " + type);
            var key = payload.key,
                partial = payload.partial;
            Flux.change_override_spec(tab_id, key, partial);
            break;
          }
        /////////////////////

        default:
          console.error("Unhandled msg type \"" + type + "\"!");
          break;
      }
    } catch (err) {
      console.error(err);
    }

    console.groupEnd();
    if (response) return Promise.resolve(response);
    return null;
  });
}); ////////////////////////////////////
// listen to "port" messages from other parts of the extension

webextension_polyfill_ts_1.browser.runtime.onConnect.addListener(function (port) {
  var name = port.name;
  console.log("\u26A1\uFE0F received connection \"" + name + "\"", {
    port: port
  });
  Flux.update_port(name, port);

  switch (name) {
    case 'devtools':
    case 'popup':
      break;

    default:
      console.error("Unrecognized port name: \"" + name + "\"!");
      break;
  }
}); ////////////////////////////////////
},{"tiny-invariant":"XpeU","webextension-polyfill-ts":"c2lp","@offirmo/deferred":"GhkJ","./flux":"lK5q","./react":"h2o3","../common/consts":"FRId","../common/messages":"sEPV","./utils":"aO2m"}]},{},["shBX"], null)
//# sourceMappingURL=/background/background.js.map