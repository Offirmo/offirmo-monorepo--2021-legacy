"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function create() {
    return new Set([
        // standard fields
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
        'name',
        'message',
        // quasi-standard
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
        'stack',
    ]);
}
exports.create = create;
const default_instance = create();
const ERROR_FIELDS = default_instance;
exports.ERROR_FIELDS = ERROR_FIELDS;
//# sourceMappingURL=index.js.map