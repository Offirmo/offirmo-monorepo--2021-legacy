parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"+CYW":[function(require,module,exports) {
var global = arguments[3];
var e=arguments[3];Object.defineProperty(exports,"__esModule",{value:!0});var o={};function n(){return"undefined"!=typeof globalThis?globalThis:void 0!==e?e:"undefined"!=typeof self?self:"undefined"!=typeof window?window:o}exports.getGlobalThis=n;
},{}],"sLmB":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});
},{}],"WwQD":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const r="@offirmo/practical-logger-core";exports.LIB=r;const e={fatal:1,emerg:2,alert:10,crit:20,error:30,warning:40,warn:40,notice:45,info:50,verbose:70,log:80,debug:81,trace:90,silly:100};exports.LEVEL_TO_INTEGER=e;const o={fatal:"fatal",emerg:"emergency",alert:"alert",crit:"critical",error:"error",warning:"warn",warn:"warn",notice:"note",info:"info",verbose:"verbose",log:"log",debug:"debug",trace:"trace",silly:"silly"};if(exports.LEVEL_TO_HUMAN=o,Object.keys(o).sort().join(",")!==Object.keys(e).sort().join(","))throw new Error("practical-logger-core: needs an update!");const t=Object.keys(e).map(r=>r).sort((r,o)=>e[r]-e[o]);exports.ALL_LOG_LEVELS=t;const s="error";exports.DEFAULT_LOG_LEVEL="error";const a="";exports.DEFAULT_LOGGER_KEY="";
},{}],"4p/C":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.__extends=e,exports.__rest=n,exports.__decorate=o,exports.__param=a,exports.__metadata=u,exports.__awaiter=i,exports.__generator=c,exports.__exportStar=f,exports.__values=l,exports.__read=s,exports.__spread=p,exports.__await=y,exports.__asyncGenerator=_,exports.__asyncDelegator=h,exports.__asyncValues=b,exports.__makeTemplateObject=v,exports.__importStar=d,exports.__importDefault=x,exports.__assign=void 0;var t=function(e,r){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(e,r)};function e(e,r){function n(){this.constructor=e}t(e,r),e.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}var r=function(){return exports.__assign=r=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var o in e=arguments[r])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t},r.apply(this,arguments)};function n(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(t);o<n.length;o++)e.indexOf(n[o])<0&&(r[n[o]]=t[n[o]])}return r}function o(t,e,r,n){var o,a=arguments.length,u=a<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(t,e,r,n);else for(var i=t.length-1;i>=0;i--)(o=t[i])&&(u=(a<3?o(u):a>3?o(e,r,u):o(e,r))||u);return a>3&&u&&Object.defineProperty(e,r,u),u}function a(t,e){return function(r,n){e(r,n,t)}}function u(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function i(t,e,r,n){return new(r||(r=Promise))(function(o,a){function u(t){try{c(n.next(t))}catch(e){a(e)}}function i(t){try{c(n.throw(t))}catch(e){a(e)}}function c(t){t.done?o(t.value):new r(function(e){e(t.value)}).then(u,i)}c((n=n.apply(t,e||[])).next())})}function c(t,e){var r,n,o,a,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function i(a){return function(i){return function(a){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return u.label++,{value:a[1],done:!1};case 5:u.label++,n=a[1],a=[0];continue;case 7:a=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){u=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){u.label=a[1];break}if(6===a[0]&&u.label<o[1]){u.label=o[1],o=a;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(a);break}o[2]&&u.ops.pop(),u.trys.pop();continue}a=e.call(t,u)}catch(i){a=[6,i],n=0}finally{r=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,i])}}}function f(t,e){for(var r in t)e.hasOwnProperty(r)||(e[r]=t[r])}function l(t){var e="function"==typeof Symbol&&t[Symbol.iterator],r=0;return e?e.call(t):{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}}}function s(t,e){var r="function"==typeof Symbol&&t[Symbol.iterator];if(!r)return t;var n,o,a=r.call(t),u=[];try{for(;(void 0===e||e-- >0)&&!(n=a.next()).done;)u.push(n.value)}catch(i){o={error:i}}finally{try{n&&!n.done&&(r=a.return)&&r.call(a)}finally{if(o)throw o.error}}return u}function p(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(s(arguments[e]));return t}function y(t){return this instanceof y?(this.v=t,this):new y(t)}function _(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n,o=r.apply(t,e||[]),a=[];return n={},u("next"),u("throw"),u("return"),n[Symbol.asyncIterator]=function(){return this},n;function u(t){o[t]&&(n[t]=function(e){return new Promise(function(r,n){a.push([t,e,r,n])>1||i(t,e)})})}function i(t,e){try{(r=o[t](e)).value instanceof y?Promise.resolve(r.value.v).then(c,f):l(a[0][2],r)}catch(n){l(a[0][3],n)}var r}function c(t){i("next",t)}function f(t){i("throw",t)}function l(t,e){t(e),a.shift(),a.length&&i(a[0][0],a[0][1])}}function h(t){var e,r;return e={},n("next"),n("throw",function(t){throw t}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(n,o){e[n]=t[n]?function(e){return(r=!r)?{value:y(t[n](e)),done:"return"===n}:o?o(e):e}:o}}function b(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e,r=t[Symbol.asyncIterator];return r?r.call(t):(t="function"==typeof l?l(t):t[Symbol.iterator](),e={},n("next"),n("throw"),n("return"),e[Symbol.asyncIterator]=function(){return this},e);function n(r){e[r]=t[r]&&function(e){return new Promise(function(n,o){(function(t,e,r,n){Promise.resolve(n).then(function(e){t({value:e,done:r})},e)})(n,o,(e=t[r](e)).done,e.value)})}}}function v(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function d(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}function x(t){return t&&t.__esModule?t:{default:t}}exports.__assign=r;
},{}],"VqKC":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("tslib"),t=require("./consts");function r(e){if(!t.ALL_LOG_LEVELS.includes(e))throw new Error(`[${t.LIB}] Not a valid log level: "${e}"!`)}function n(e){return!!(e.name&&e.message&&e.stack)}function o(e){let t="",r={},o=void 0;return e.length>2?(t=Array.prototype.join.call(e," "),r={}):(t=e[0]||"",r=e[1]||{},"string"!=typeof t&&(n(t)?t=(o=t).message:"object"!=typeof t||r?t=String(t):(r=t,t="")),"object"!=typeof r&&(t=[t,String(r)].join(" "),r={}),!(o=o||r.err)&&n(r)&&(r={err:o=r}),o&&(o=Object.assign({},o,{name:o.name,message:o.message})),r=Object.assign({},r,{err:o}),t=t||r.message||r.err&&r.err.message||""),[t,r]}function s({name:n=t.DEFAULT_LOGGER_KEY,suggestedLevel:s=t.DEFAULT_LOG_LEVEL,commonDetails:i={}},c=console.log){const a={name:n,level:s,commonDetails:Object.assign({},i),outputFn:c};let l=100;const u=t.ALL_LOG_LEVELS.reduce((s,i)=>{return s[i]=function(s,c){if(!function(e){return r(e),t.LEVEL_TO_INTEGER[e]<=l}(i))return;const[u,m]=o(arguments);a.outputFn(function(t,r,o){var{err:s}=o,i=e.__rest(o,["err"]);const c={level:t,name:n,msg:r,time:+new Date,details:Object.assign({},a.commonDetails,i)};return s&&(c.err=s),c}(i,u,m))},s},{setLevel:m,getLevel:function(){return a.level},addCommonDetails:function(e){if(e.err)throw new Error(`[${t.LIB}] Can't set reserved property "err"!`);a.commonDetails=Object.assign({},a.commonDetails,e)}});function m(e){r(e),a.level=e,l=t.LEVEL_TO_INTEGER[e]}return m(s),u}exports.checkLevel=r,exports.looksLikeAnError=n,exports.normalizePrimitiveArguments=o,exports.create=s;
},{"tslib":"4p/C","./consts":"WwQD"}],"w1Yg":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./consts");exports.ALL_LOG_LEVELS=e.ALL_LOG_LEVELS,exports.LOG_LEVEL_TO_INTEGER=e.LEVEL_TO_INTEGER,exports.LOG_LEVEL_TO_HUMAN=e.LEVEL_TO_HUMAN,exports.DEFAULT_LOG_LEVEL=e.DEFAULT_LOG_LEVEL,exports.DEFAULT_LOGGER_KEY=e.DEFAULT_LOGGER_KEY;var L=require("./core");exports.checkLevel=L.checkLevel;const E=require("./core");exports.createLogger=E.create;
},{"./consts":"WwQD","./core":"VqKC"}],"UepU":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const o=require("@offirmo/practical-logger-core"),e={fatal:"error",emerg:"error",alert:"error",crit:"error",error:"error",warning:"warn",warn:"warn",notice:"info",info:"info",verbose:"info",log:"log",debug:"log",trace:"log",silly:"log"};if(Object.keys(e).sort().join(",")!==[...o.ALL_LOG_LEVELS].sort().join(","))throw new Error("practical-logger-browser: needs an update!");const r={fatal:"",emerg:"",alert:"",crit:"",error:"",warning:"",warn:"",notice:"color: #659AD2;",info:"color: #659AD2;",verbose:"color: #659AD2;",log:"",debug:"color: #9AA2AA;",trace:"color: #9AA2AA;",silly:"color: #9AA2AA;"};if(Object.keys(r).sort().join(",")!==[...o.ALL_LOG_LEVELS].sort().join(","))throw new Error("practical-logger-browser: needs an update!");function n(e){return o.LOG_LEVEL_TO_HUMAN[e]}exports.to_aligned_ascii=n;const t='-apple-system, BlinkMacSystemFont, "avenir next", avenir, "Segoe UI", "lucida grande", "helvetica neue", helvetica, "Fira Sans", roboto, noto, "Droid Sans", cantarell, oxygen, ubuntu, "franklin gothic medium", "century gothic", "Liberation Sans", sans-serif',a='"dejavu sans mono", "Menlo", "Consolas", "Lucida Console", "Courier New", monospace',i=[`font-family: ${t}; `,`font-family: ${a}; `,`font-family: ${t}; `];exports.sink=(o=>{const{level:t,name:a,msg:l,time:s,details:c}=o;let g=""+`%c[%c${n(t)}%c]`+a+"›"+l;const f=i.map(o=>r[t]+o);Object.keys(c).length?console[e[t]](g,...f,c):console[e[t]](g,...f)});
},{"@offirmo/practical-logger-core":"w1Yg"}],"3HBi":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const e=require("@offirmo/practical-logger-core"),t=require("./sink");function r(e){return`_debug.logger.${e}.level`}function c(t){let c=null;try{const n=r(t);c=localStorage.getItem(n);try{c?e.checkLevel(c):c=null}catch(o){c=e.DEFAULT_LOG_LEVEL,localStorage.setItem(n,c)}}catch(l){}return c}function o(r){const{name:o=e.DEFAULT_LOGGER_KEY}=r,l=e.createLogger(r,t.sink),n=c(o);return n&&l.setLevel(n),l}exports.createLogger=o;
},{"@offirmo/practical-logger-core":"w1Yg","./sink":"UepU"}],"RtbE":[function(require,module,exports) {
"use strict";exports.__esModule=!0;var e="_dc";function o(o){console.log("DEBUG attaching...");var n=new Proxy({},{get:function(e,n){return console.log("DEBUG access",{debugCommands:o,target:e,propKey:n}),n in o?o[n]():console.log(n),"done."}});Object.defineProperty(window,e,{enumerable:!1,value:n})}exports.attach=o;
},{}],"W7Tb":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var r,t=1,n=arguments.length;t<n;t++)for(var a in r=arguments[t])Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a]);return e}).apply(this,arguments)};exports.__esModule=!0;var r=require("@offirmo/practical-logger-browser"),t=require("./attach-listeners-to-debug-command");function n(){var n={},a={};t.attach(a);var o={getLogger:function(t){return t=e({name:""},t),n[t.name]=n[t.name]||r.createLogger(t),n[t.name]},addDebugCommand:function(e,r){a[e]=r}};return o.addDebugCommand("list",function(){console.log(window._experiments)}),o}exports.create=n;
},{"@offirmo/practical-logger-browser":"3HBi","./attach-listeners-to-debug-command":"RtbE"}],"7QCb":[function(require,module,exports) {
"use strict";exports.__esModule=!0;var e=require("@offirmo/globalthis-ponyfill"),r=require("@offirmo/universal-debug-api-interface");exports.WebDebugApi=r.WebDebugApi,exports.Logger=r.Logger;var g=require("./create"),o=e.getGlobalThis();o._debug=o._debug||g.create();var a=o._debug,i=a.getLogger,t=a.addDebugCommand;exports.getLogger=i,exports.addDebugCommand=t;
},{"@offirmo/globalthis-ponyfill":"+CYW","@offirmo/universal-debug-api-interface":"sLmB","./create":"W7Tb"}]},{},["7QCb"], null)