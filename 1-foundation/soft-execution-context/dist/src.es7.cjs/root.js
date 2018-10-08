"use strict";
/* global window, global */
Object.defineProperty(exports, "__esModule", { value: true });
/* Complicated setup to have a truly unique global var
 * even with module duplication due to bad transpilation (parcel but maybe otherbundler. Or is it only HMR?)
 */
const core_1 = require("./core");
const GLOBAL_VAR_NAME = '__global_root sec';
/////////////////////
let root_SEC = null;
if (typeof window !== 'undefined') {
    if (window.hasOwnProperty(GLOBAL_VAR_NAME)) {
        console.log('root SEC: duplicate module?');
    }
    else {
        Object.defineProperty(window, GLOBAL_VAR_NAME, {
            enumerable: true,
            set: function () {
                throw new Error(`You can’t assign window.${GLOBAL_VAR_NAME}!`);
            },
            get: function () {
                if (!root_SEC) {
                    console.info('Creating root SEC… [window path]');
                    root_SEC = core_1.createSEC();
                }
                return root_SEC;
            },
        });
    }
}
if (typeof global !== 'undefined') {
    if (global.hasOwnProperty(GLOBAL_VAR_NAME)) {
        console.log('root SEC: duplicate module?');
    }
    else {
        Object.defineProperty(global, GLOBAL_VAR_NAME, {
            enumerable: true,
            set: function () {
                throw new Error(`You can’t assign global.${GLOBAL_VAR_NAME}!`);
            },
            get: function () {
                if (!root_SEC) {
                    console.info('Creating root SEC… [global path]');
                    root_SEC = core_1.createSEC();
                }
                return root_SEC;
            },
        });
    }
}
function getRootSEC() {
    if (typeof window !== 'undefined') {
        return window[GLOBAL_VAR_NAME];
    }
    if (typeof global !== 'undefined') {
        return global[GLOBAL_VAR_NAME];
    }
    if (!root_SEC) {
        console.info('Creating root SEC… [unknown env path]');
        root_SEC = core_1.createSEC();
    }
    return root_SEC;
}
exports.getRootSEC = getRootSEC;
//# sourceMappingURL=root.js.map