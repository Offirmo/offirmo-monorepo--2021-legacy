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
})({"uEKH":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
}); // THIS FILE IS AUTO GENERATED!
// This is a base64 version of a content script to communicate with UWDT webextension
// bundled in a single file through this local file:
// ../src/injected-libs/universal-debug-api-control.ts

var lib = 'cGFyY2VsUmVxdWlyZT1mdW5jdGlvbihlLHIsdCxuKXt2YXIgaSxvPSJmdW5jdGlvbiI9PXR5cGVvZiBwYXJjZWxSZXF1aXJlJiZwYXJjZWxSZXF1aXJlLHU9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7ZnVuY3Rpb24gZih0LG4pe2lmKCFyW3RdKXtpZighZVt0XSl7dmFyIGk9ImZ1bmN0aW9uIj09dHlwZW9mIHBhcmNlbFJlcXVpcmUmJnBhcmNlbFJlcXVpcmU7aWYoIW4mJmkpcmV0dXJuIGkodCwhMCk7aWYobylyZXR1cm4gbyh0LCEwKTtpZih1JiYic3RyaW5nIj09dHlwZW9mIHQpcmV0dXJuIHUodCk7dmFyIGM9bmV3IEVycm9yKCJDYW5ub3QgZmluZCBtb2R1bGUgJyIrdCsiJyIpO3Rocm93IGMuY29kZT0iTU9EVUxFX05PVF9GT1VORCIsY31wLnJlc29sdmU9ZnVuY3Rpb24ocil7cmV0dXJuIGVbdF1bMV1bcl18fHJ9LHAuY2FjaGU9e307dmFyIGw9clt0XT1uZXcgZi5Nb2R1bGUodCk7ZVt0XVswXS5jYWxsKGwuZXhwb3J0cyxwLGwsbC5leHBvcnRzLHRoaXMpfXJldHVybiByW3RdLmV4cG9ydHM7ZnVuY3Rpb24gcChlKXtyZXR1cm4gZihwLnJlc29sdmUoZSkpfX1mLmlzUGFyY2VsUmVxdWlyZT0hMCxmLk1vZHVsZT1mdW5jdGlvbihlKXt0aGlzLmlkPWUsdGhpcy5idW5kbGU9Zix0aGlzLmV4cG9ydHM9e319LGYubW9kdWxlcz1lLGYuY2FjaGU9cixmLnBhcmVudD1vLGYucmVnaXN0ZXI9ZnVuY3Rpb24ocix0KXtlW3JdPVtmdW5jdGlvbihlLHIpe3IuZXhwb3J0cz10fSx7fV19O2Zvcih2YXIgYz0wO2M8dC5sZW5ndGg7YysrKXRyeXtmKHRbY10pfWNhdGNoKGUpe2l8fChpPWUpfWlmKHQubGVuZ3RoKXt2YXIgbD1mKHRbdC5sZW5ndGgtMV0pOyJvYmplY3QiPT10eXBlb2YgZXhwb3J0cyYmInVuZGVmaW5lZCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9bDoiZnVuY3Rpb24iPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShmdW5jdGlvbigpe3JldHVybiBsfSk6biYmKHRoaXNbbl09bCl9aWYocGFyY2VsUmVxdWlyZT1mLGkpdGhyb3cgaTtyZXR1cm4gZn0oeyJubkxBIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pLGV4cG9ydHMuREVGQVVMVF9MT0dfTEVWRUw9ImVycm9yIixleHBvcnRzLkRFRkFVTFRfTE9HR0VSX0tFWT0iIjsKfSx7fV0sIkhyQkYiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSksZXhwb3J0cy5MU19ST09UPSLwn5ugVURBIjsKfSx7fV0sImxoQzAiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSk7dmFyIGU9cmVxdWlyZSgiLi4vY29uc3RzIikscj1yZXF1aXJlKCIuLi9jb25zdHMiKTtmdW5jdGlvbiB0KGUpe3JldHVybiJsb2dnZXIuIisoZXx8ImRlZmF1bHQiKSsiLmxvZ0xldmVsIn1mdW5jdGlvbiBvKHIpe3JldHVybiBlLkxTX1JPT1QrIi5vdmVycmlkZS4iK3J9ZXhwb3J0cy5MU19ST09UPXIuTFNfUk9PVCxleHBvcnRzLmdldE92ZXJyaWRlS2V5Rm9yTG9nZ2VyPXQsZXhwb3J0cy5nZXRMU0tleUZvck92ZXJyaWRlPW87Cn0seyIuLi9jb25zdHMiOiJIckJGIn1dLCJNeDZDIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pLGV4cG9ydHMuTVNHX0VOVFJZPSLwn6epVVdEVC52MCI7Cn0se31dLCJ2TkJ5IjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pO3ZhciBlPXJlcXVpcmUoIi4uL2NvbnN0cy9lbnRyeSIpO2Z1bmN0aW9uIHIocil7dmFyIF87cmV0dXJuKF89e30pW2UuTVNHX0VOVFJZXT17dHlwZTpleHBvcnRzLk1TR19UWVBFX19SRVBPUlRfREVCVUdfQVBJX1VTQUdFLHJlcG9ydHM6cn0sX31leHBvcnRzLk1TR19UWVBFX19SRVBPUlRfREVCVUdfQVBJX1VTQUdFPSJyZXBvcnQtdXNhZ2UiLGV4cG9ydHMuY3JlYXRlX21zZ19yZXBvcnRfZGVidWdfYXBpX3VzYWdlPXI7Cn0seyIuLi9jb25zdHMvZW50cnkiOiJNeDZDIn1dLCJsUHFSIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7ZnVuY3Rpb24gcihyKXtpZihyIT09ZXhwb3J0cy5KU09OX1VOREVGSU5FRClyZXR1cm4gSlNPTi5wYXJzZShyKX1mdW5jdGlvbiBlKHIpe3JldHVybiB2b2lkIDA9PT1yP2V4cG9ydHMuSlNPTl9VTkRFRklORUQ6SlNPTi5zdHJpbmdpZnkocil9ZnVuY3Rpb24gcyhyKXtpZihyPT09ZXhwb3J0cy5KU09OX1VOREVGSU5FRClyZXR1cm4hMDtpZigic3RyaW5nIiE9dHlwZW9mIHIpcmV0dXJuIGNvbnNvbGUuZXJyb3IoImlzX3ZhbGlkX3N0cmluZ2lmaWVkX2pzb24gZmFpbHVyZSAxISIse3Nqc29uOnJ9KSwhMTt0cnl7cmV0dXJuIEpTT04ucGFyc2UociksITB9Y2F0Y2goZSl7cmV0dXJuIGNvbnNvbGUuZXJyb3IoImlzX3ZhbGlkX3N0cmluZ2lmaWVkX2pzb24gZmFpbHVyZSAyISIse3Nqc29uOnJ9KSwhMX19ZnVuY3Rpb24gbihyKXtyZXR1cm4gcj09PWV4cG9ydHMuSlNPTl9VTkRFRklORUQ/InVuZGVmaW5lZCI6cn1PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSksZXhwb3J0cy5KU09OX1VOREVGSU5FRD0idW5kZWZpbmVkIixleHBvcnRzLnNqc29uX3BhcnNlPXIsZXhwb3J0cy5zanNvbl9zdHJpbmdpZnk9ZSxleHBvcnRzLmlzX3ZhbGlkX3N0cmluZ2lmaWVkX2pzb249cyxleHBvcnRzLmNvbnRyb2xfc2pzb249bjsKfSx7fV0sIk9aQUgiOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0Ijt2YXIgZT10aGlzJiZ0aGlzLl9fYXNzaWdufHxmdW5jdGlvbigpe3JldHVybihlPU9iamVjdC5hc3NpZ258fGZ1bmN0aW9uKGUpe2Zvcih2YXIgbyxyPTEsdD1hcmd1bWVudHMubGVuZ3RoO3I8dDtyKyspZm9yKHZhciBuIGluIG89YXJndW1lbnRzW3JdKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLG4pJiYoZVtuXT1vW25dKTtyZXR1cm4gZX0pLmFwcGx5KHRoaXMsYXJndW1lbnRzKX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pO3ZhciBvPXJlcXVpcmUoIkBvZmZpcm1vL3ByYWN0aWNhbC1sb2dnZXItY29yZS9zcmMvY29uc3RzLWJhc2UiKSxyPXJlcXVpcmUoIkBvZmZpcm1vLXByaXZhdGUvdW5pdmVyc2FsLWRlYnVnLWFwaS1icm93c2VyL3NyYy92MS9rZXlzIiksdD1yZXF1aXJlKCIuLi9jb21tb24vbWVzc2FnZXMvcmVwb3J0LXVzYWdlIiksbj1yZXF1aXJlKCIuLi9jb21tb24vdXRpbHMvc3RyaW5naWZpZWQtanNvbiIpLHM9ITE7dHJ5e3M9c3x8ISF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oIvCfp6lVV0RUaS5jb250ZXh0LmRlYnVnIil9Y2F0Y2gocCl7fXZhciBpPXdpbmRvdy5fZGVidWcudjEsYT17fSxnPVtdLHU9ITE7ZnVuY3Rpb24gbCgpe3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IHNjaGVkdWxlX3N5bmMiLHtsYXN0X3F1ZXVlZDpnLnNsaWNlKC0xKVswXSxxdWV1ZV9zaXplOmcubGVuZ3RoLGluX2ZsaWdodDp1fSksdXx8KHU9ITAsc2V0VGltZW91dChmdW5jdGlvbigpe3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IHBvc3RpbmcgY3JlYXRlX21zZ19yZXBvcnRfZGVidWdfYXBpX3VzYWdlLi4uIik7dHJ5e3dpbmRvdy5wb3N0TWVzc2FnZSh0LmNyZWF0ZV9tc2dfcmVwb3J0X2RlYnVnX2FwaV91c2FnZShnKSwiKiIpfWNhdGNoKGUpe3MmJmNvbnNvbGUuZXJyb3IoIvCfp6lVV0RUaTogZXJyb3Igd2hlbiBzeW5jaW5nISIsZSl9Zy5sZW5ndGg9MCx1PSExfSkpfWZ1bmN0aW9uIGMoZSl7dHJ5e3ZhciBvPXIuZ2V0TFNLZXlGb3JPdmVycmlkZShlKTtyZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0obyl9Y2F0Y2godCl7cmV0dXJuIG51bGx9fWZ1bmN0aW9uIGQoZSxvKXtpZighYS5oYXNPd25Qcm9wZXJ0eShlKSl7dmFyIHI9bi5zanNvbl9zdHJpbmdpZnkobyk7cyYmY29uc29sZS5sb2coIvCfp6lVV0RUaTogb3ZlcnJpZGVIb29rKCkiLHtrZXk6ZSxkZWZhdWx0X3ZhbHVlOm8sZGVmYXVsdF92YWx1ZV9zanNvbjpyfSk7dmFyIHQ9YyhlKTtnLnB1c2goe3R5cGU6Im92ZXJyaWRlIixrZXk6ZSxkZWZhdWx0X3ZhbHVlX3Nqc29uOnIsZXhpc3Rpbmdfb3ZlcnJpZGVfc2pzb246dH0pLGwoKSxhW2VdPXR9cmV0dXJuIGkub3ZlcnJpZGVIb29rKGUsbyl9ZnVuY3Rpb24gXyh0KXt2b2lkIDA9PT10JiYodD17fSk7dmFyIG49dC5uYW1lfHxvLkRFRkFVTFRfTE9HR0VSX0tFWSxhPXIuZ2V0T3ZlcnJpZGVLZXlGb3JMb2dnZXIobiksZz10LnN1Z2dlc3RlZExldmVsfHxvLkRFRkFVTFRfTE9HX0xFVkVMO3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IGdldExvZ2dlcigpIix7cGFyYW1zOnQsbmFtZTpuLG92RGVmYXVsdExldmVsOmcsREVGQVVMVF9MT0dfTEVWRUw6by5ERUZBVUxUX0xPR19MRVZFTH0pO3ZhciB1PWQoYSxnKTtyZXR1cm4hdC5mb3JjZWRMZXZlbCYmYyhhKSYmKHQ9ZShlKHt9LHQpLHtmb3JjZWRMZXZlbDp1fSkpLGkuZ2V0TG9nZ2VyKHQpfWZ1bmN0aW9uIHYoZSxvKXtyZXR1cm4gcyYmY29uc29sZS5sb2coIvCfp6lVV0RUaTogZXhwb3NlSW50ZXJuYWwoKSIse3BhdGg6ZX0pLGkuZXhwb3NlSW50ZXJuYWwoZSxvKX1mdW5jdGlvbiBmKGUsbyl7cmV0dXJuIHMmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IGFkZERlYnVnQ29tbWFuZCgpIix7Y29tbWFuZE5hbWU6ZX0pLGkuYWRkRGVidWdDb21tYW5kKGUsbyl9d2luZG93Ll9kZWJ1Zy52MT1lKGUoe30saSkse292ZXJyaWRlSG9vazpkLGdldExvZ2dlcjpfLGV4cG9zZUludGVybmFsOnYsYWRkRGVidWdDb21tYW5kOmZ9KSxzJiZjb25zb2xlLmxvZygi8J+nqVVXRFRpOiBhbGwgc2V0IHVwIOKchSIpOwp9LHsiQG9mZmlybW8vcHJhY3RpY2FsLWxvZ2dlci1jb3JlL3NyYy9jb25zdHMtYmFzZSI6Im5uTEEiLCJAb2ZmaXJtby1wcml2YXRlL3VuaXZlcnNhbC1kZWJ1Zy1hcGktYnJvd3Nlci9zcmMvdjEva2V5cyI6ImxoQzAiLCIuLi9jb21tb24vbWVzc2FnZXMvcmVwb3J0LXVzYWdlIjoidk5CeSIsIi4uL2NvbW1vbi91dGlscy9zdHJpbmdpZmllZC1qc29uIjoibFBxUiJ9XX0se30sWyJPWkFIIl0sIG51bGwp';
exports.default = lib;
},{}]},{},["uEKH"], null)
//# sourceMappingURL=/content-scripts/lib-to-inject-2.js.map