
// 1. copied from https://github.com/Microsoft/TypeScript/issues/15202#issuecomment-318900991
// 2. then improved to match the latest Promise typings

export default class Deferred<T> {
	private _resolve!: (value: T | PromiseLike<T>) => void
	private _reject!: (reason?: any) => void
	private readonly promise: Promise<T>

	constructor({ uncatch = true }: { uncatch?: boolean } = {}) {
		this.promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve
			this._reject = reject
		})
		if (uncatch) {
			this.promise.catch(() => {
				// swallow to disable uncaught promise rejection messages.
				// The whole point of this lib is to attach stuff later.
			})
		}
	}

	then<TResult1 = T, TResult2 = never>(
		onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
	): Promise<TResult1 | TResult2> {
		return this.promise.then(onfulfilled, onrejected)
	}

	catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
		return this.promise.catch(onrejected)
	}

	resolve(value: T | PromiseLike<T>): void {
		return this._resolve(value)
	}

	reject(reason?: any): void {
		return this._reject(reason)
	}

	finally(onfinally?: (() => void) | undefined | null): Promise<T> {
		return this.promise.finally(onfinally)
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
	get [Symbol.toStringTag](): string {
		return 'Deferred'
	}
}
