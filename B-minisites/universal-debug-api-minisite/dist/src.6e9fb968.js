parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"FKRf":[function(require,module,exports) {
var global = arguments[3];
var e=arguments[3];Object.defineProperty(exports,"__esModule",{value:!0}),exports.getGlobalThis=void 0;var o={};function t(){return"undefined"!=typeof globalThis?globalThis:void 0!==e?e:"undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==this?this:o}exports.default=t,exports.getGlobalThis=t;
},{}],"SeiJ":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});
},{}],"oevE":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createLogger=exports.LoggerCreationParams=exports.Logger=void 0;var e=require("@offirmo/practical-logger-types");function r(){}Object.defineProperty(exports,"Logger",{enumerable:!0,get:function(){return e.Logger}}),Object.defineProperty(exports,"LoggerCreationParams",{enumerable:!0,get:function(){return e.LoggerCreationParams}});var o={setLevel:r,getLevel:function(){return"silly"},addCommonDetails:r,fatal:r,emerg:r,alert:r,crit:r,error:r,warning:r,warn:r,notice:r,info:r,verbose:r,log:r,debug:r,trace:r,silly:r,group:r,groupCollapsed:r,groupEnd:r};function t(e){return o}exports.createLogger=t;
},{"@offirmo/practical-logger-types":"SeiJ"}],"Dauu":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@offirmo/practical-logger-minimal-noop");function r(){function r(){}var o=e.createLogger();return{getLogger:function(){return o},overrideHook:function(e,r){return r},exposeInternal:r,addDebugCommand:r}}exports.default=r;
},{"@offirmo/practical-logger-minimal-noop":"oevE"}],"B87G":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LoggerCreationParams=exports.Logger=void 0;var e=require("@offirmo/practical-logger-types");Object.defineProperty(exports,"Logger",{enumerable:!0,get:function(){return e.Logger}}),Object.defineProperty(exports,"LoggerCreationParams",{enumerable:!0,get:function(){return e.LoggerCreationParams}});
},{"@offirmo/practical-logger-types":"SeiJ"}],"tTvU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LoggerCreationParams=exports.Logger=exports.DebugApiV1=void 0;var e=require("./v1");Object.defineProperty(exports,"DebugApiV1",{enumerable:!0,get:function(){return e.DebugApi}});var r=require("@offirmo/practical-logger-types");Object.defineProperty(exports,"Logger",{enumerable:!0,get:function(){return r.Logger}}),Object.defineProperty(exports,"LoggerCreationParams",{enumerable:!0,get:function(){return r.LoggerCreationParams}});
},{"./v1":"B87G","@offirmo/practical-logger-types":"SeiJ"}],"TWls":[function(require,module,exports) {
"use strict";var e=this&&this.__createBinding||(Object.create?function(e,r,t,o){void 0===o&&(o=t),Object.defineProperty(e,o,{enumerable:!0,get:function(){return r[t]}})}:function(e,r,t,o){void 0===o&&(o=t),e[o]=r[t]}),r=this&&this.__exportStar||function(r,t){for(var o in r)"default"===o||Object.prototype.hasOwnProperty.call(t,o)||e(t,r,o)},t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createV1=exports.globalThis=exports.addDebugCommand=exports.overrideHook=exports.exposeInternal=exports.getLogger=void 0;var o=require("@offirmo/globalthis-ponyfill"),i=t(require("./v1"));exports.createV1=i.default;var a=o.getGlobalThis();exports.globalThis=a,a._debug=a._debug||{},a._debug.v1=a._debug.v1||i.default();var s=a._debug.v1,n=s.getLogger,d=s.exposeInternal,u=s.overrideHook,p=s.addDebugCommand;exports.getLogger=n,exports.exposeInternal=d,exports.overrideHook=u,exports.addDebugCommand=p,r(require("@offirmo/universal-debug-api-interface"),exports);
},{"@offirmo/globalthis-ponyfill":"FKRf","./v1":"Dauu","@offirmo/universal-debug-api-interface":"tTvU"}],"ip4i":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DEFAULT_LOGGER_KEY=exports.DEFAULT_LOG_LEVEL=void 0,exports.DEFAULT_LOG_LEVEL="error",exports.DEFAULT_LOGGER_KEY="";
},{}],"eWlX":[function(require,module,exports) {
"use strict";var e=this&&this.__createBinding||(Object.create?function(e,r,t,o){void 0===o&&(o=t),Object.defineProperty(e,o,{enumerable:!0,get:function(){return r[t]}})}:function(e,r,t,o){void 0===o&&(o=t),e[o]=r[t]}),r=this&&this.__exportStar||function(r,t){for(var o in r)"default"===o||Object.prototype.hasOwnProperty.call(t,o)||e(t,r,o)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.LOG_LEVEL_TO_HUMAN=exports.ALL_LOG_LEVELS=exports.LOG_LEVEL_TO_INTEGER=exports.LIB=void 0,exports.LIB="@offirmo/practical-logger-core",exports.LOG_LEVEL_TO_INTEGER={fatal:1,emerg:2,alert:10,crit:20,error:30,warning:40,warn:40,notice:45,info:50,verbose:70,log:80,debug:81,trace:90,silly:100},exports.ALL_LOG_LEVELS=Object.keys(exports.LOG_LEVEL_TO_INTEGER).map(function(e){return e}).sort(function(e,r){return exports.LOG_LEVEL_TO_INTEGER[e]-exports.LOG_LEVEL_TO_INTEGER[r]}),exports.LOG_LEVEL_TO_HUMAN=exports.ALL_LOG_LEVELS.reduce(function(e,r){return e[r]={em:"emergency",wa:"warn"}[r.slice(0,1)]||r,e},{}),r(require("./consts-base"),exports);
},{"./consts-base":"ip4i"}],"gd2M":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var r,o=1,t=arguments.length;o<t;o++)for(var n in r=arguments[o])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e}).apply(this,arguments)};function r(e){return!!((null==e?void 0:e.name)&&(null==e?void 0:e.message)&&(null==e?void 0:e.stack))}function o(o){var t,n=[],s={},i=void 0;Array.from(o).forEach(function(o){o&&(r(o)?i||(i=o):(!i&&r(o.err)&&(i=o.err),"object"!=typeof o?n.push(String(o)):s=e(e({},s),o)))}),"string"!=typeof s.message||n.length||(n.push(s.message),delete s.message);var a=n.join(" ")||(null===(t=i)||void 0===t?void 0:t.message)||"(no message)";return i?s.err=i:delete s.err,[a,s]}Object.defineProperty(exports,"__esModule",{value:!0}),exports.normalizeArguments=exports.looksLikeAnError=void 0,exports.looksLikeAnError=r,exports.normalizeArguments=o;
},{}],"bcIh":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var r,t=1,o=arguments.length;t<o;t++)for(var n in r=arguments[t])Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n]);return e}).apply(this,arguments)},r=this&&this.__rest||function(e,r){var t={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&r.indexOf(o)<0&&(t[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(o=Object.getOwnPropertySymbols(e);n<o.length;n++)r.indexOf(o[n])<0&&Object.prototype.propertyIsEnumerable.call(e,o[n])&&(t[o[n]]=e[o[n]])}return t};Object.defineProperty(exports,"__esModule",{value:!0}),exports.create=exports.checkLevel=void 0;var t=require("./consts"),o=require("./normalize-args");function n(e){if(!t.ALL_LOG_LEVELS.includes(e))throw new Error("["+t.LIB+'] Not a valid log level: "'+e+'"!')}function i(i,l){var c=void 0===i?{}:i,s=c.name,a=void 0===s?t.DEFAULT_LOGGER_KEY:s,u=c.suggestedLevel,v=void 0===u?t.DEFAULT_LOG_LEVEL:u,L=c.forcedLevel,f=c.commonDetails,p=void 0===f?{}:f;void 0===l&&(l=console.log);var m={name:a,level:L||v,commonDetails:e({},p),outputFn:l},E=100,d=t.ALL_LOG_LEVELS.reduce(function(i,l){return i[l]=function(i,c){if(function(e){return n(e),t.LOG_LEVEL_TO_INTEGER[e]<=E}(l)){var s=o.normalizeArguments(arguments),u=s[0],v=s[1];m.outputFn(function(t,o,n){var i=n.err,l=r(n,["err"]),c={level:t,name:a,msg:o,time:+new Date,details:e(e({},m.commonDetails),l)};return i&&(c.err=i),c}(l,u,v))}},i},{setLevel:O,getLevel:_,addCommonDetails:function(r){if(r.err)throw new Error("["+t.LIB+'] Can\'t set reserved property "err"!');m.commonDetails=e(e({},m.commonDetails),r)},group:function(){},groupCollapsed:function(){},groupEnd:function(){}});function O(e){n(e),m.level=e,E=t.LOG_LEVEL_TO_INTEGER[e]}function _(){return m.level}return O(_()),d}exports.checkLevel=n,exports.create=i;
},{"./consts":"eWlX","./normalize-args":"gd2M"}],"y67r":[function(require,module,exports) {
"use strict";var e=this&&this.__createBinding||(Object.create?function(e,r,t,L){void 0===L&&(L=t),Object.defineProperty(e,L,{enumerable:!0,get:function(){return r[t]}})}:function(e,r,t,L){void 0===L&&(L=t),e[L]=r[t]}),r=this&&this.__exportStar||function(r,t){for(var L in r)"default"===L||Object.prototype.hasOwnProperty.call(t,L)||e(t,r,L)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.checkLevel=exports.DEFAULT_LOGGER_KEY=exports.DEFAULT_LOG_LEVEL=exports.LOG_LEVEL_TO_HUMAN=exports.LOG_LEVEL_TO_INTEGER=exports.ALL_LOG_LEVELS=exports.createLogger=void 0;var t=require("./core");Object.defineProperty(exports,"createLogger",{enumerable:!0,get:function(){return t.create}}),r(require("@offirmo/practical-logger-types"),exports);var L=require("./consts");Object.defineProperty(exports,"ALL_LOG_LEVELS",{enumerable:!0,get:function(){return L.ALL_LOG_LEVELS}}),Object.defineProperty(exports,"LOG_LEVEL_TO_INTEGER",{enumerable:!0,get:function(){return L.LOG_LEVEL_TO_INTEGER}}),Object.defineProperty(exports,"LOG_LEVEL_TO_HUMAN",{enumerable:!0,get:function(){return L.LOG_LEVEL_TO_HUMAN}}),Object.defineProperty(exports,"DEFAULT_LOG_LEVEL",{enumerable:!0,get:function(){return L.DEFAULT_LOG_LEVEL}}),Object.defineProperty(exports,"DEFAULT_LOGGER_KEY",{enumerable:!0,get:function(){return L.DEFAULT_LOGGER_KEY}});var o=require("./core");Object.defineProperty(exports,"checkLevel",{enumerable:!0,get:function(){return o.checkLevel}}),r(require("./normalize-args"),exports);
},{"./core":"bcIh","@offirmo/practical-logger-types":"SeiJ","./consts":"eWlX","./normalize-args":"gd2M"}],"UPs5":[function(require,module,exports) {
const{ALL_LOG_LEVELS:e}=require("..");function o(){console.log("------------↓ For comparison: Legacy console: levels, in order ↓-----------"),console.debug('Legacy console > message with level "debug"',{level:"debug",foo:42}),console.log('Legacy console > message with level "log"',{level:"log",foo:42}),console.info('Legacy console > message with level "info"',{level:"info",foo:42}),console.warn('Legacy console > message with level "warn"',{level:"warn",foo:42}),console.error('Legacy console > message with level "error"',{level:"error",foo:42})}function l(e,o=!0){console[o?"group":"log"]("------------↓ Practical logger demo: example real usage ↓------------"),e.silly("Hi!"),e.trace("App starting...",{version:"1.2.3"});e.verbose("Current user already logged in",{user:{firstName:"Bob",lastName:"Dupont",age:42}}),e.verbose("Restoring state from cloud…"),e.warn("Restoration of state is taking more time than expected",{elapsedMs:3e3});const l=new Error("Timeout loading state!");l.httpStatus=418,e.error(void 0,l),e.info("Reverting to last known local state"),o&&console.groupEnd()}function r(o){console.log("------------↓ Practical logger demo: all levels, in order ↓------------"),[...e].reverse().forEach(e=>o[e](`message with level "${e}"`,{level:e,foo:42}))}function s(e){console.log("------------↓ logger demo: group ↓------------"),e.group("level 1 (NOT collapsed)"),e.log("in level 1"),e.groupCollapsed("level 2a (collapsed)"),e.log("in level 2a"),e.groupEnd(),e.groupCollapsed("level 2b (collapsed)"),e.group("level 3a (NOT collapsed)"),console.assert(!0),e.groupEnd(),e.groupEnd(),e.groupCollapsed("level 2c (collapsed)"),e.warn("warn from level 2c!"),e.error(new Error("error from level 2c!")),e.groupEnd(),e.groupCollapsed("level 2d (collapsed)"),e.log("in level 2d"),e.group("level 3b (NOT collapsed)"),e.warn("warn from level 3b!"),e.error(new Error("error from level 3b!")),e.log("in level 3b"),e.groupEnd(),e.log("in level 2d"),e.groupEnd(),e.groupCollapsed("level 2e (collapsed)"),e.log("in level 2e"),console.assert(!1,"foo"),e.groupEnd(),e.log("where am I? (should be in level 1)"),e.groupEnd(),e.groupEnd(),e.groupEnd()}function n(e){const o=new Error("Timeout loading state!");o.httpStatus=418,console.group("------------↓ logger demo: incorrect invocation (bunyan style) ↓------------"),e.info(),e.info("hi"),e.info("hi %s",{firstName:"Bob",lastName:"Dupont",age:42},"some stuff"),e.info({foo:"bar"},"hi"),e.info(o),e.info(o,"more on this: %s","some stuff"),e.info({foo:"bar",err:o},"some msg about this error"),e.warn("foo","bar",42),console.groupEnd()}function a(e){console.log("------------↓ logger creation and basic usage ↓------------"),e({suggestedLevel:"silly"}).log("Starting up");const o=e({name:"Persistence",suggestedLevel:"silly"});l(o),r(o),s(o),n(o)}function g(e,o=!0){console[o?"group":"log"]("------------↓ logger demo: error display ↓------------");try{!function(){const e=new Error("Test error!");throw e.statusCode=1234,e.details={hello:42},e}()}catch(l){e.log(l),e.log("message",l),e.log("message",{some:"stuff",err:l}),e.error(l),e.error("message",l),e.error("message",{some:"stuff",err:l}),e.error("message",{some:"stuff"})}o&&console.groupEnd()}function t(){console.group("------------↓ available font styles ↓------------"),console.log("default: ABCdef012"),["-apple-system","BlinkMacSystemFont",'"avenir next"',"avenir",'"Segoe UI"','"lucida grande"','"helvetica neue"',"helvetica",'"Fira Sans"',"roboto",'"Liberation Sans"',"sans-serif",'"dejavu sans mono"','"Fira Code"',"Menlo","Consolas",'"Lucida Console"','"Courier New"',"monospace"].forEach(e=>console.log(`%c${e}: ABCdefi012 %cABCdefi012`,`font-family: ${e};`,"font-family: unset;")),console.groupEnd()}module.exports={demo_legacy_console:o,demo_logger_basic_usage:l,demo_logger_levels:r,demo_error:g,demo_group:s,demo_incorrect_logger_invocations:n,demo_logger_api:a,demo_devtools_fonts:t};
},{"..":"y67r"}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@offirmo/universal-debug-api-placeholder"),o=require("@offirmo/practical-logger-core/doc/shared-demo"),r=e.getLogger({suggestedLevel:"warn"});r.log("hello from logger!");var t=e.getLogger({name:"Demo",suggestedLevel:"silly"});t.log("hello from demoLogger!",{bar:42,baz:33});var n={target:void 0,last_demo_launched:null},l=["browser","node","module"],c={"all-levels":function(e){o.demo_legacy_console(),o.demo_logger_levels(e)},basic:function(e){return o.demo_logger_basic_usage(e,!1)},error:function(e){return o.demo_error(e,!1)},groups:o.demo_group};function a(e){c[e](t),n.last_demo_launched=e}function d(){Object.keys(c).forEach(function(e){document.getElementById("demo-"+e).removeAttribute("open")}),n.last_demo_launched&&document.getElementById("demo-"+n.last_demo_launched).setAttribute("open","true"),l.forEach(function(e){})}d(),document.addEventListener("click",function(e){e:try{var o=e.target;if(!o)throw new Error("click event has no target!");var t=Object.keys(c).find(function(e){return o.matches("#btn-demo-"+e)});if(t){a(t);break e}r.trace("Event delegation: unknown click target:",{clickedElement:o})}catch(n){r.error("processingClick",{err:n})}d()});
},{"@offirmo/universal-debug-api-placeholder":"TWls","@offirmo/practical-logger-core/doc/shared-demo":"UPs5"}]},{},["QCba"], null)
//# sourceMappingURL=src.6e9fb968.js.map