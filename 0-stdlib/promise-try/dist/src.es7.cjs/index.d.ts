declare function promiseTry<T>(fn: () => T | PromiseLike<T>): Promise<T>;
export { promiseTry };
