parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"GpkR":[function(require,module,exports) {
var global = arguments[3];
var e=arguments[3];Object.defineProperty(exports,"__esModule",{value:!0}),exports.getGlobalThis=void 0;var o={};function t(){return"undefined"!=typeof globalThis?globalThis:void 0!==e?e:"undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==this?this:o}exports.default=t,exports.getGlobalThis=t;
},{}],"VUE0":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});
},{}],"pkHs":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createLogger=exports.LoggerCreationParams=exports.Logger=void 0;var e=require("@offirmo/practical-logger-types");function r(){}Object.defineProperty(exports,"Logger",{enumerable:!0,get:function(){return e.Logger}}),Object.defineProperty(exports,"LoggerCreationParams",{enumerable:!0,get:function(){return e.LoggerCreationParams}});var o={setLevel:r,getLevel:function(){return"silly"},addCommonDetails:r,fatal:r,emerg:r,alert:r,crit:r,error:r,warning:r,warn:r,notice:r,info:r,verbose:r,log:r,debug:r,trace:r,silly:r,group:r,groupCollapsed:r,groupEnd:r};function t(e){return o}exports.createLogger=t;
},{"@offirmo/practical-logger-types":"VUE0"}],"WXI1":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@offirmo/practical-logger-minimal-noop");function r(){function r(){}var o=e.createLogger();return{getLogger:function(){return o},overrideHook:function(e,r){return r},exposeInternal:r,addDebugCommand:r}}exports.default=r;
},{"@offirmo/practical-logger-minimal-noop":"pkHs"}],"CMiH":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LoggerCreationParams=exports.Logger=void 0;var e=require("@offirmo/practical-logger-types");Object.defineProperty(exports,"Logger",{enumerable:!0,get:function(){return e.Logger}}),Object.defineProperty(exports,"LoggerCreationParams",{enumerable:!0,get:function(){return e.LoggerCreationParams}});
},{"@offirmo/practical-logger-types":"VUE0"}],"aTIG":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DebugApiV1=void 0;var e=require("./v1");Object.defineProperty(exports,"DebugApiV1",{enumerable:!0,get:function(){return e.DebugApi}});var r=require("@offirmo/practical-logger-types");Object.defineProperty(exports,"Logger",{enumerable:!0,get:function(){return r.Logger}}),Object.defineProperty(exports,"LoggerCreationParams",{enumerable:!0,get:function(){return r.LoggerCreationParams}});
},{"./v1":"CMiH","@offirmo/practical-logger-types":"VUE0"}],"QCba":[function(require,module,exports) {
"use strict";var e=this&&this.__createBinding||(Object.create?function(e,r,o,t){void 0===t&&(t=o),Object.defineProperty(e,t,{enumerable:!0,get:function(){return r[o]}})}:function(e,r,o,t){void 0===t&&(t=o),e[t]=r[o]}),r=this&&this.__exportStar||function(r,o){for(var t in r)"default"===t||o.hasOwnProperty(t)||e(o,r,t)},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createV1=exports.globalThis=exports.addDebugCommand=exports.overrideHook=exports.exposeInternal=exports.getLogger=void 0;var t=require("@offirmo/globalthis-ponyfill"),i=o(require("./v1"));exports.createV1=i.default;var a=t.getGlobalThis();exports.globalThis=a,a._debug=a._debug||{},a._debug.v1=a._debug.v1||i.default();var s=a._debug.v1,n=s.getLogger,d=s.exposeInternal,u=s.overrideHook,g=s.addDebugCommand;exports.getLogger=n,exports.exposeInternal=d,exports.overrideHook=u,exports.addDebugCommand=g,r(require("@offirmo/universal-debug-api-interface"),exports);
},{"@offirmo/globalthis-ponyfill":"GpkR","./v1":"WXI1","@offirmo/universal-debug-api-interface":"aTIG"}]},{},["QCba"], null)