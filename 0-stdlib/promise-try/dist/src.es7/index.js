// http://2ality.com/2017/08/promise-try.html#work-arounds
function promiseTry(fn) {
    return Promise.resolve().then(fn);
}
export { promiseTry, };
//# sourceMappingURL=index.js.map