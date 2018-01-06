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
const default_instance = create();
const ERROR_FIELDS = default_instance;
export { ERROR_FIELDS, create, };
//# sourceMappingURL=index.js.map