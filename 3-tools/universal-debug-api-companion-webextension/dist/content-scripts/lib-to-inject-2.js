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
})({"content-scripts/lib-to-inject-2.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // THIS FILE IS AUTO GENERATED!
// This is a base64 version of a content script to communicate with UWDT webextension
// bundled in a single file through this local file:
// ../src/injected-libs/universal-debug-api-control.ts

var lib = 'cGFyY2VsUmVxdWlyZT1mdW5jdGlvbihlLHIsdCxuKXt2YXIgaSxvPSJmdW5jdGlvbiI9PXR5cGVvZiBwYXJjZWxSZXF1aXJlJiZwYXJjZWxSZXF1aXJlLHU9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7ZnVuY3Rpb24gZih0LG4pe2lmKCFyW3RdKXtpZighZVt0XSl7dmFyIGk9ImZ1bmN0aW9uIj09dHlwZW9mIHBhcmNlbFJlcXVpcmUmJnBhcmNlbFJlcXVpcmU7aWYoIW4mJmkpcmV0dXJuIGkodCwhMCk7aWYobylyZXR1cm4gbyh0LCEwKTtpZih1JiYic3RyaW5nIj09dHlwZW9mIHQpcmV0dXJuIHUodCk7dmFyIGM9bmV3IEVycm9yKCJDYW5ub3QgZmluZCBtb2R1bGUgJyIrdCsiJyIpO3Rocm93IGMuY29kZT0iTU9EVUxFX05PVF9GT1VORCIsY31wLnJlc29sdmU9ZnVuY3Rpb24ocil7cmV0dXJuIGVbdF1bMV1bcl18fHJ9LHAuY2FjaGU9e307dmFyIGw9clt0XT1uZXcgZi5Nb2R1bGUodCk7ZVt0XVswXS5jYWxsKGwuZXhwb3J0cyxwLGwsbC5leHBvcnRzLHRoaXMpfXJldHVybiByW3RdLmV4cG9ydHM7ZnVuY3Rpb24gcChlKXtyZXR1cm4gZihwLnJlc29sdmUoZSkpfX1mLmlzUGFyY2VsUmVxdWlyZT0hMCxmLk1vZHVsZT1mdW5jdGlvbihlKXt0aGlzLmlkPWUsdGhpcy5idW5kbGU9Zix0aGlzLmV4cG9ydHM9e319LGYubW9kdWxlcz1lLGYuY2FjaGU9cixmLnBhcmVudD1vLGYucmVnaXN0ZXI9ZnVuY3Rpb24ocix0KXtlW3JdPVtmdW5jdGlvbihlLHIpe3IuZXhwb3J0cz10fSx7fV19O2Zvcih2YXIgYz0wO2M8dC5sZW5ndGg7YysrKXRyeXtmKHRbY10pfWNhdGNoKGUpe2l8fChpPWUpfWlmKHQubGVuZ3RoKXt2YXIgbD1mKHRbdC5sZW5ndGgtMV0pOyJvYmplY3QiPT10eXBlb2YgZXhwb3J0cyYmInVuZGVmaW5lZCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9bDoiZnVuY3Rpb24iPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShmdW5jdGlvbigpe3JldHVybiBsfSk6biYmKHRoaXNbbl09bCl9aWYocGFyY2VsUmVxdWlyZT1mLGkpdGhyb3cgaTtyZXR1cm4gZn0oeyJubkxBIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pLGV4cG9ydHMuREVGQVVMVF9MT0dfTEVWRUw9ImVycm9yIixleHBvcnRzLkRFRkFVTFRfTE9HR0VSX0tFWT0iIjsKfSx7fV0sIm90ZTciOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSksZXhwb3J0cy5MU19ST09UPSLwn5ugVURBIjsKfSx7fV0sIkx5amgiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSk7dmFyIGU9cmVxdWlyZSgiLi4vY29uc3RzIikscj1yZXF1aXJlKCIuLi9jb25zdHMiKTtmdW5jdGlvbiB0KGUpe3JldHVybiJsb2dnZXIuIisoZXx8ImRlZmF1bHQiKSsiLmxvZ0xldmVsIn1mdW5jdGlvbiBvKHIpe3JldHVybiBlLkxTX1JPT1QrIi5vdmVycmlkZS4iK3J9ZXhwb3J0cy5MU19ST09UPXIuTFNfUk9PVCxleHBvcnRzLmdldE92ZXJyaWRlS2V5Rm9yTG9nZ2VyPXQsZXhwb3J0cy5nZXRMU0tleUZvck92ZXJyaWRlPW87Cn0seyIuLi9jb25zdHMiOiJvdGU3In1dLCJNeDZDIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pLGV4cG9ydHMuTVNHX0VOVFJZPSLwn6epVVdEVC52MCI7Cn0se31dLCJ2TkJ5IjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pO3ZhciBlPXJlcXVpcmUoIi4uL2NvbnN0cy9lbnRyeSIpO2Z1bmN0aW9uIHIocil7dmFyIF87cmV0dXJuKF89e30pW2UuTVNHX0VOVFJZXT17dHlwZTpleHBvcnRzLk1TR19UWVBFX19SRVBPUlRfREVCVUdfQVBJX1VTQUdFLHJlcG9ydHM6cn0sX31leHBvcnRzLk1TR19UWVBFX19SRVBPUlRfREVCVUdfQVBJX1VTQUdFPSJyZXBvcnQtdXNhZ2UiLGV4cG9ydHMuY3JlYXRlX21zZ19yZXBvcnRfZGVidWdfYXBpX3VzYWdlPXI7Cn0seyIuLi9jb25zdHMvZW50cnkiOiJNeDZDIn1dLCJsUHFSIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7ZnVuY3Rpb24gcihyKXtpZihyIT09ZXhwb3J0cy5KU09OX1VOREVGSU5FRClyZXR1cm4gSlNPTi5wYXJzZShyKX1mdW5jdGlvbiBlKHIpe3JldHVybiB2b2lkIDA9PT1yP2V4cG9ydHMuSlNPTl9VTkRFRklORUQ6SlNPTi5zdHJpbmdpZnkocil9ZnVuY3Rpb24gcyhyKXtpZihyPT09ZXhwb3J0cy5KU09OX1VOREVGSU5FRClyZXR1cm4hMDtpZigic3RyaW5nIiE9dHlwZW9mIHIpcmV0dXJuIGNvbnNvbGUuZXJyb3IoImlzX3ZhbGlkX3N0cmluZ2lmaWVkX2pzb24gZmFpbHVyZSAxISIse3Nqc29uOnJ9KSwhMTt0cnl7cmV0dXJuIEpTT04ucGFyc2UociksITB9Y2F0Y2goZSl7cmV0dXJuIGNvbnNvbGUuZXJyb3IoImlzX3ZhbGlkX3N0cmluZ2lmaWVkX2pzb24gZmFpbHVyZSAyISIse3Nqc29uOnJ9KSwhMX19ZnVuY3Rpb24gbihyKXtyZXR1cm4gcj09PWV4cG9ydHMuSlNPTl9VTkRFRklORUQ/InVuZGVmaW5lZCI6cn1PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSksZXhwb3J0cy5KU09OX1VOREVGSU5FRD0idW5kZWZpbmVkIixleHBvcnRzLnNqc29uX3BhcnNlPXIsZXhwb3J0cy5zanNvbl9zdHJpbmdpZnk9ZSxleHBvcnRzLmlzX3ZhbGlkX3N0cmluZ2lmaWVkX2pzb249cyxleHBvcnRzLmNvbnRyb2xfc2pzb249bjsKfSx7fV0sIk9aQUgiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0Ijt2YXIgZT10aGlzJiZ0aGlzLl9fYXNzaWdufHxmdW5jdGlvbigpe3JldHVybihlPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgbyxyPTEsdD1hcmd1bWVudHMubGVuZ3RoO3I8dDtyKyspZm9yKHZhciBuIGluIG89YXJndW1lbnRzW3JdKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLG4pJiYoZVtuXT1vW25dKTtyZXR1cm4gZX0pLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pO3ZhciBvPXJlcXVpcmUoIkBvZmZpcm1vL3ByYWN0aWNhbC1sb2dnZXItY29yZS9zcmMvY29uc3RzLWJhc2UiKSxyPXJlcXVpcmUoIkBvZmZpcm1vL3VuaXZlcnNhbC1kZWJ1Zy1hcGktYnJvd3Nlci9zcmMvdjEva2V5cyIpLHQ9cmVxdWlyZSgiLi4vY29tbW9uL21lc3NhZ2VzL3JlcG9ydC11c2FnZSIpLG49cmVxdWlyZSgiLi4vY29tbW9uL3V0aWxzL3N0cmluZ2lmaWVkLWpzb24iKSxzPSExO3RyeXtzPXN8fCEhd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKCLwn6epVVdEVGkuY29udGV4dC5kZWJ1ZyIpfWNhdGNoKHApe312YXIgaT13aW5kb3cuX2RlYnVnLnYxLGE9e30sZz1bXSx1PSExO2Z1bmN0aW9uIGwoKXtzJiZjb25zb2xlLmxvZygi8J+nqVVXRFRpOiBzY2hlZHVsZV9zeW5jIix7bGFzdF9xdWV1ZWQ6Zy5zbGljZSgtMSlbMF0scXVldWVfc2l6ZTpnLmxlbmd0aCxpbl9mbGlnaHQ6dX0pLHV8fCh1PSEwLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtzJiZjb25zb2xlLmxvZygi8J+nqVVXRFRpOiBwb3N0aW5nIGNyZWF0ZV9tc2dfcmVwb3J0X2RlYnVnX2FwaV91c2FnZS4uLiIpO3RyeXt3aW5kb3cucG9zdE1lc3NhZ2UodC5jcmVhdGVfbXNnX3JlcG9ydF9kZWJ1Z19hcGlfdXNhZ2UoZyksIioiKX1jYXRjaChlKXtzJiZjb25zb2xlLmVycm9yKCLwn6epVVdEVGk6IGVycm9yIHdoZW4gc3luY2luZyEiLGUpfWcubGVuZ3RoPTAsdT0hMX0pKX1mdW5jdGlvbiBjKGUpe3RyeXt2YXIgbz1yLmdldExTS2V5Rm9yT3ZlcnJpZGUoZSk7cmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKG8pfWNhdGNoKHQpe3JldHVybiBudWxsfX1mdW5jdGlvbiBkKGUsbyl7aWYoIWEuaGFzT3duUHJvcGVydHkoZSkpe3ZhciByPW4uc2pzb25fc3RyaW5naWZ5KG8pO3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IG92ZXJyaWRlSG9vaygpIix7a2V5OmUsZGVmYXVsdF92YWx1ZTpvLGRlZmF1bHRfdmFsdWVfc2pzb246cn0pO3ZhciB0PWMoZSk7Zy5wdXNoKHt0eXBlOiJvdmVycmlkZSIsa2V5OmUsZGVmYXVsdF92YWx1ZV9zanNvbjpyLGV4aXN0aW5nX292ZXJyaWRlX3Nqc29uOnR9KSxsKCksYVtlXT10fXJldHVybiBpLm92ZXJyaWRlSG9vayhlLG8pfWZ1bmN0aW9uIF8odCl7dm9pZCAwPT09dCYmKHQ9e30pO3ZhciBuPXQubmFtZXx8by5ERUZBVUxUX0xPR0dFUl9LRVksYT1yLmdldE92ZXJyaWRlS2V5Rm9yTG9nZ2VyKG4pLGc9dC5zdWdnZXN0ZWRMZXZlbHx8by5ERUZBVUxUX0xPR19MRVZFTDtzJiZjb25zb2xlLmxvZygi8J+nqVVXRFRpOiBnZXRMb2dnZXIoKSIse3BhcmFtczp0LG5hbWU6bixvdkRlZmF1bHRMZXZlbDpnLERFRkFVTFRfTE9HX0xFVkVMOm8uREVGQVVMVF9MT0dfTEVWRUx9KTt2YXIgdT1kKGEsZyk7cmV0dXJuIXQuZm9yY2VkTGV2ZWwmJmMoYSkmJih0PWUoZSh7fSx0KSx7Zm9yY2VkTGV2ZWw6dX0pKSxpLmdldExvZ2dlcih0KX1mdW5jdGlvbiB2KGUsbyl7cmV0dXJuIHMmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IGV4cG9zZUludGVybmFsKCkiLHtwYXRoOmV9KSxpLmV4cG9zZUludGVybmFsKGUsbyl9ZnVuY3Rpb24gZihlLG8pe3JldHVybiBzJiZjb25zb2xlLmxvZygi8J+nqVVXRFRpOiBhZGREZWJ1Z0NvbW1hbmQoKSIse2NvbW1hbmROYW1lOmV9KSxpLmFkZERlYnVnQ29tbWFuZChlLG8pfXdpbmRvdy5fZGVidWcudjE9ZShlKHt9LGkpLHtvdmVycmlkZUhvb2s6ZCxnZXRMb2dnZXI6XyxleHBvc2VJbnRlcm5hbDp2LGFkZERlYnVnQ29tbWFuZDpmfSkscyYmY29uc29sZS5sb2coIvCfp6lVV0RUaTogYWxsIHNldCB1cCDinIUiKTsKfSx7IkBvZmZpcm1vL3ByYWN0aWNhbC1sb2dnZXItY29yZS9zcmMvY29uc3RzLWJhc2UiOiJubkxBIiwiQG9mZmlybW8vdW5pdmVyc2FsLWRlYnVnLWFwaS1icm93c2VyL3NyYy92MS9rZXlzIjoiTHlqaCIsIi4uL2NvbW1vbi9tZXNzYWdlcy9yZXBvcnQtdXNhZ2UiOiJ2TkJ5IiwiLi4vY29tbW9uL3V0aWxzL3N0cmluZ2lmaWVkLWpzb24iOiJsUHFSIn1dfSx7fSxbIk9aQUgiXSwgbnVsbCk=';
exports.default = lib;
},{}]},{},["content-scripts/lib-to-inject-2.ts"], null)
//# sourceMappingURL=/content-scripts/lib-to-inject-2.js.map