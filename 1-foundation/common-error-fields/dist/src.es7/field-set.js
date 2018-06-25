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
        'framesToPop',
        // My (Offirmo) extensions
        'details',
        'SEC',
        '_temp',
    ]);
}
const DEFAULT_INSTANCE = create();
const COMMON_ERROR_FIELDS = DEFAULT_INSTANCE;
export { COMMON_ERROR_FIELDS, create, };
//# sourceMappingURL=field-set.js.map