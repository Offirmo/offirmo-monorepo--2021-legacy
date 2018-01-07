import { COMMON_ERROR_FIELDS } from '@offirmo/common-error-fields';
// Anything can be thrown: undefined, string, number...)
// But that's not obviously not a good practice.
// Normalize any thrown object into a true, normal error.
function normalizeError(err_like = {}) {
    // Fact: in browser, sometime an error-like, un-writable object is thrown
    // create a true, safe, writable error object
    const true_err = new Error(err_like.message || `(non-error caught: "${err_like}")`);
    // copy fields if exist
    COMMON_ERROR_FIELDS.forEach(prop => {
        if (prop in err_like)
            true_err[prop] = err_like[prop];
    });
    return true_err;
}
export { normalizeError, };
//# sourceMappingURL=index.js.map