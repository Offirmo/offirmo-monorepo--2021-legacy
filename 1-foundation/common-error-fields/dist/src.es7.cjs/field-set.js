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
        // non standard but widely used
        'statusCode',
        'shouldRedirect',
        // My (Offirmo) extensions
        'details',
        'SEC',
        '_temp',
    ]);
}
exports.create = create;
const DEFAULT_INSTANCE = create();
const COMMON_ERROR_FIELDS = DEFAULT_INSTANCE;
exports.COMMON_ERROR_FIELDS = COMMON_ERROR_FIELDS;
//# sourceMappingURL=field-set.js.map