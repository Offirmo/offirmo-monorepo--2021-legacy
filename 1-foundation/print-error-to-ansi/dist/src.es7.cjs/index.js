"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable no-console */
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const common_error_fields_1 = require("@offirmo/common-error-fields");
function displayErrProp(errLike, prop) {
    if (prop === 'details') {
        const details = errLike.details;
        console.error(chalk_1.default.red(chalk_1.default.dim(`🔥  ${prop}:`)));
        Object.entries(details).forEach(([key, value]) => {
            console.error(chalk_1.default.red(chalk_1.default.dim(`    ${key}: "`) + value + chalk_1.default.dim('"')));
        });
    }
    else
        console.error(chalk_1.default.red(chalk_1.default.dim(`🔥  ${prop}: "`) + errLike[prop] + chalk_1.default.dim('"')));
}
function displayError(errLike = {}) {
    console.error(chalk_1.default.red(`🔥🔥🔥🔥🔥🔥🔥  ${chalk_1.default.bold(errLike.name || 'Error')} 🔥🔥🔥🔥🔥🔥🔥`));
    const displayedProps = new Set();
    displayedProps.add('name');
    if (errLike.message) {
        displayErrProp(errLike, 'message');
        displayedProps.add('message');
    }
    if (errLike.details) {
        displayErrProp(errLike, 'details');
        displayedProps.add('details');
    }
    if (errLike.logicalStack) {
        displayErrProp(errLike, 'logicalStack');
        displayedProps.add('logicalStack');
    }
    common_error_fields_1.COMMON_ERROR_FIELDS.forEach(prop => {
        if (prop in errLike && !displayedProps.has(prop)) {
            displayErrProp(errLike, prop);
        }
    });
}
exports.displayError = displayError;
//# sourceMappingURL=index.js.map