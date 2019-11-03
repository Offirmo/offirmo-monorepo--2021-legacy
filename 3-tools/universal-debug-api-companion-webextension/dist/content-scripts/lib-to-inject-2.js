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

var lib = 'cGFyY2VsUmVxdWlyZT1mdW5jdGlvbihlLHIsdCxuKXt2YXIgaSxvPSJmdW5jdGlvbiI9PXR5cGVvZiBwYXJjZWxSZXF1aXJlJiZwYXJjZWxSZXF1aXJlLHU9ImZ1bmN0aW9uIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7ZnVuY3Rpb24gZih0LG4pe2lmKCFyW3RdKXtpZighZVt0XSl7dmFyIGk9ImZ1bmN0aW9uIj09dHlwZW9mIHBhcmNlbFJlcXVpcmUmJnBhcmNlbFJlcXVpcmU7aWYoIW4mJmkpcmV0dXJuIGkodCwhMCk7aWYobylyZXR1cm4gbyh0LCEwKTtpZih1JiYic3RyaW5nIj09dHlwZW9mIHQpcmV0dXJuIHUodCk7dmFyIGM9bmV3IEVycm9yKCJDYW5ub3QgZmluZCBtb2R1bGUgJyIrdCsiJyIpO3Rocm93IGMuY29kZT0iTU9EVUxFX05PVF9GT1VORCIsY31wLnJlc29sdmU9ZnVuY3Rpb24ocil7cmV0dXJuIGVbdF1bMV1bcl18fHJ9LHAuY2FjaGU9e307dmFyIGw9clt0XT1uZXcgZi5Nb2R1bGUodCk7ZVt0XVswXS5jYWxsKGwuZXhwb3J0cyxwLGwsbC5leHBvcnRzLHRoaXMpfXJldHVybiByW3RdLmV4cG9ydHM7ZnVuY3Rpb24gcChlKXtyZXR1cm4gZihwLnJlc29sdmUoZSkpfX1mLmlzUGFyY2VsUmVxdWlyZT0hMCxmLk1vZHVsZT1mdW5jdGlvbihlKXt0aGlzLmlkPWUsdGhpcy5idW5kbGU9Zix0aGlzLmV4cG9ydHM9e319LGYubW9kdWxlcz1lLGYuY2FjaGU9cixmLnBhcmVudD1vLGYucmVnaXN0ZXI9ZnVuY3Rpb24ocix0KXtlW3JdPVtmdW5jdGlvbihlLHIpe3IuZXhwb3J0cz10fSx7fV19O2Zvcih2YXIgYz0wO2M8dC5sZW5ndGg7YysrKXRyeXtmKHRbY10pfWNhdGNoKGUpe2l8fChpPWUpfWlmKHQubGVuZ3RoKXt2YXIgbD1mKHRbdC5sZW5ndGgtMV0pOyJvYmplY3QiPT10eXBlb2YgZXhwb3J0cyYmInVuZGVmaW5lZCIhPXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9bDoiZnVuY3Rpb24iPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShmdW5jdGlvbigpe3JldHVybiBsfSk6biYmKHRoaXNbbl09bCl9aWYocGFyY2VsUmVxdWlyZT1mLGkpdGhyb3cgaTtyZXR1cm4gZn0oeyJubkxBIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pLGV4cG9ydHMuREVGQVVMVF9MT0dfTEVWRUw9ImVycm9yIixleHBvcnRzLkRFRkFVTFRfTE9HR0VSX0tFWT0iIjsKfSx7fV0sInRIc08iOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKSB7CiJ1c2Ugc3RyaWN0IjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywiX19lc01vZHVsZSIse3ZhbHVlOiEwfSksZXhwb3J0cy5MU19ST09UPSLwn5ugVVdEQSI7Cn0se31dLCJIeEhqIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pO3ZhciBlPXJlcXVpcmUoIi4uL2NvbnN0cyIpLHI9cmVxdWlyZSgiLi4vY29uc3RzIik7ZnVuY3Rpb24gdChlKXtyZXR1cm4ibG9nZ2VyLiIrKGV8fCJkZWZhdWx0IikrIi5sb2dMZXZlbCJ9ZnVuY3Rpb24gbyhyKXtyZXR1cm4gZS5MU19ST09UKyIub3ZlcnJpZGUuIityfWV4cG9ydHMuTFNfUk9PVD1yLkxTX1JPT1QsZXhwb3J0cy5nZXRPdmVycmlkZUtleUZvckxvZ2dlcj10LGV4cG9ydHMuZ2V0TFNLZXlGb3JPdmVycmlkZT1vOwp9LHsiLi4vY29uc3RzIjoidEhzTyJ9XSwiTXg2QyI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpIHsKInVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KSxleHBvcnRzLk1TR19FTlRSWT0i8J+nqVVXRFQudjAiOwp9LHt9XSwidk5CeSI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpIHsKInVzZSBzdHJpY3QiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KTt2YXIgZT1yZXF1aXJlKCIuLi9jb25zdHMvZW50cnkiKTtmdW5jdGlvbiByKHIpe3ZhciBfO3JldHVybihfPXt9KVtlLk1TR19FTlRSWV09e3R5cGU6ZXhwb3J0cy5NU0dfVFlQRV9fUkVQT1JUX0RFQlVHX0FQSV9VU0FHRSxyZXBvcnRzOnJ9LF99ZXhwb3J0cy5NU0dfVFlQRV9fUkVQT1JUX0RFQlVHX0FQSV9VU0FHRT0icmVwb3J0LXVzYWdlIixleHBvcnRzLmNyZWF0ZV9tc2dfcmVwb3J0X2RlYnVnX2FwaV91c2FnZT1yOwp9LHsiLi4vY29uc3RzL2VudHJ5IjoiTXg2QyJ9XSwibFBxUiI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpIHsKInVzZSBzdHJpY3QiO2Z1bmN0aW9uIHIocil7aWYociE9PWV4cG9ydHMuSlNPTl9VTkRFRklORUQpcmV0dXJuIEpTT04ucGFyc2Uocil9ZnVuY3Rpb24gZShyKXtyZXR1cm4gdm9pZCAwPT09cj9leHBvcnRzLkpTT05fVU5ERUZJTkVEOkpTT04uc3RyaW5naWZ5KHIpfWZ1bmN0aW9uIHMocil7aWYocj09PWV4cG9ydHMuSlNPTl9VTkRFRklORUQpcmV0dXJuITA7aWYoInN0cmluZyIhPXR5cGVvZiByKXJldHVybiBjb25zb2xlLmVycm9yKCJpc192YWxpZF9zdHJpbmdpZmllZF9qc29uIGZhaWx1cmUgMSEiLHtzanNvbjpyfSksITE7dHJ5e3JldHVybiBKU09OLnBhcnNlKHIpLCEwfWNhdGNoKGUpe3JldHVybiBjb25zb2xlLmVycm9yKCJpc192YWxpZF9zdHJpbmdpZmllZF9qc29uIGZhaWx1cmUgMiEiLHtzanNvbjpyfSksITF9fWZ1bmN0aW9uIG4ocil7cmV0dXJuIHI9PT1leHBvcnRzLkpTT05fVU5ERUZJTkVEPyJ1bmRlZmluZWQiOnJ9T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIl9fZXNNb2R1bGUiLHt2YWx1ZTohMH0pLGV4cG9ydHMuSlNPTl9VTkRFRklORUQ9InVuZGVmaW5lZCIsZXhwb3J0cy5zanNvbl9wYXJzZT1yLGV4cG9ydHMuc2pzb25fc3RyaW5naWZ5PWUsZXhwb3J0cy5pc192YWxpZF9zdHJpbmdpZmllZF9qc29uPXMsZXhwb3J0cy5jb250cm9sX3Nqc29uPW47Cn0se31dLCJPWkFIIjpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cykgewoidXNlIHN0cmljdCI7dmFyIGU9dGhpcyYmdGhpcy5fX2Fzc2lnbnx8ZnVuY3Rpb24oKXtyZXR1cm4oZT1PYmplY3QuYXNzaWdufHxmdW5jdGlvbihlKXtmb3IodmFyIG8scj0xLHQ9YXJndW1lbnRzLmxlbmd0aDtyPHQ7cisrKWZvcih2YXIgbiBpbiBvPWFyZ3VtZW50c1tyXSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobyxuKSYmKGVbbl09b1tuXSk7cmV0dXJuIGV9KS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCJfX2VzTW9kdWxlIix7dmFsdWU6ITB9KTt2YXIgbz1yZXF1aXJlKCJAb2ZmaXJtby9wcmFjdGljYWwtbG9nZ2VyLWNvcmUvc3JjL2NvbnN0cy1iYXNlIikscj1yZXF1aXJlKCJAb2ZmaXJtby1wcml2YXRlL3VuaXZlcnNhbC1kZWJ1Zy1hcGktZnVsbC1icm93c2VyL3NyYy92MS9rZXlzIiksdD1yZXF1aXJlKCIuLi9jb21tb24vbWVzc2FnZXMvcmVwb3J0LXVzYWdlIiksbj1yZXF1aXJlKCIuLi9jb21tb24vdXRpbHMvc3RyaW5naWZpZWQtanNvbiIpLHM9ITE7dHJ5e3M9c3x8ISF3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oIvCfp6lVV0RUaS5jb250ZXh0LmRlYnVnIil9Y2F0Y2gocCl7fXZhciBpPXdpbmRvdy5fZGVidWcudjEsYT17fSx1PVtdLGc9ITE7ZnVuY3Rpb24gbCgpe3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IHNjaGVkdWxlX3N5bmMiLHtsYXN0X3F1ZXVlZDp1LnNsaWNlKC0xKVswXSxxdWV1ZV9zaXplOnUubGVuZ3RoLGluX2ZsaWdodDpnfSksZ3x8KGc9ITAsc2V0VGltZW91dChmdW5jdGlvbigpe3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IHBvc3RpbmcgY3JlYXRlX21zZ19yZXBvcnRfZGVidWdfYXBpX3VzYWdlLi4uIik7dHJ5e3dpbmRvdy5wb3N0TWVzc2FnZSh0LmNyZWF0ZV9tc2dfcmVwb3J0X2RlYnVnX2FwaV91c2FnZSh1KSwiKiIpfWNhdGNoKGUpe3MmJmNvbnNvbGUuZXJyb3IoIvCfp6lVV0RUaTogZXJyb3Igd2hlbiBzeW5jaW5nISIsZSl9dS5sZW5ndGg9MCxnPSExfSkpfWZ1bmN0aW9uIGMoZSl7dHJ5e3ZhciBvPXIuZ2V0TFNLZXlGb3JPdmVycmlkZShlKTtyZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0obyl9Y2F0Y2godCl7cmV0dXJuIG51bGx9fWZ1bmN0aW9uIGQoZSxvKXtpZighYS5oYXNPd25Qcm9wZXJ0eShlKSl7dmFyIHI9bi5zanNvbl9zdHJpbmdpZnkobyk7cyYmY29uc29sZS5sb2coIvCfp6lVV0RUaTogb3ZlcnJpZGVIb29rKCkiLHtrZXk6ZSxkZWZhdWx0X3ZhbHVlOm8sZGVmYXVsdF92YWx1ZV9zanNvbjpyfSk7dmFyIHQ9YyhlKTt1LnB1c2goe3R5cGU6Im92ZXJyaWRlIixrZXk6ZSxkZWZhdWx0X3ZhbHVlX3Nqc29uOnIsZXhpc3Rpbmdfb3ZlcnJpZGVfc2pzb246dH0pLGwoKSxhW2VdPXR9cmV0dXJuIGkub3ZlcnJpZGVIb29rKGUsbyl9ZnVuY3Rpb24gXyh0KXt2b2lkIDA9PT10JiYodD17fSk7dmFyIG49dC5uYW1lfHxvLkRFRkFVTFRfTE9HR0VSX0tFWSxhPXIuZ2V0T3ZlcnJpZGVLZXlGb3JMb2dnZXIobiksdT10LnN1Z2dlc3RlZExldmVsfHxvLkRFRkFVTFRfTE9HX0xFVkVMO3MmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IGdldExvZ2dlcigpIix7cGFyYW1zOnQsbmFtZTpuLG92RGVmYXVsdExldmVsOnUsREVGQVVMVF9MT0dfTEVWRUw6by5ERUZBVUxUX0xPR19MRVZFTH0pO3ZhciBnPWQoYSx1KTtyZXR1cm4hdC5mb3JjZWRMZXZlbCYmYyhhKSYmKHQ9ZShlKHt9LHQpLHtmb3JjZWRMZXZlbDpnfSkpLGkuZ2V0TG9nZ2VyKHQpfWZ1bmN0aW9uIHYoZSxvKXtyZXR1cm4gcyYmY29uc29sZS5sb2coIvCfp6lVV0RUaTogZXhwb3NlSW50ZXJuYWwoKSIse3BhdGg6ZX0pLGkuZXhwb3NlSW50ZXJuYWwoZSxvKX1mdW5jdGlvbiBmKGUsbyl7cmV0dXJuIHMmJmNvbnNvbGUubG9nKCLwn6epVVdEVGk6IGFkZERlYnVnQ29tbWFuZCgpIix7Y29tbWFuZE5hbWU6ZX0pLGkuYWRkRGVidWdDb21tYW5kKGUsbyl9d2luZG93Ll9kZWJ1Zy52MT1lKGUoe30saSkse292ZXJyaWRlSG9vazpkLGdldExvZ2dlcjpfLGV4cG9zZUludGVybmFsOnYsYWRkRGVidWdDb21tYW5kOmZ9KSxzJiZjb25zb2xlLmxvZygi8J+nqVVXRFRpOiBhbGwgc2V0IHVwIOKchSIpOwp9LHsiQG9mZmlybW8vcHJhY3RpY2FsLWxvZ2dlci1jb3JlL3NyYy9jb25zdHMtYmFzZSI6Im5uTEEiLCJAb2ZmaXJtby1wcml2YXRlL3VuaXZlcnNhbC1kZWJ1Zy1hcGktZnVsbC1icm93c2VyL3NyYy92MS9rZXlzIjoiSHhIaiIsIi4uL2NvbW1vbi9tZXNzYWdlcy9yZXBvcnQtdXNhZ2UiOiJ2TkJ5IiwiLi4vY29tbW9uL3V0aWxzL3N0cmluZ2lmaWVkLWpzb24iOiJsUHFSIn1dfSx7fSxbIk9aQUgiXSwgbnVsbCk=';
exports.default = lib;
},{}]},{},["content-scripts/lib-to-inject-2.ts"], null)
//# sourceMappingURL=/content-scripts/lib-to-inject-2.js.map