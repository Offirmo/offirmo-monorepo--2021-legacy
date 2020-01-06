
export default function tiny_singleton<T extends (...args: any) => any>(generator: T): (...args: Parameters<T>) => ReturnType<T> {
	let instantiated = false
	let instance: undefined | ReturnType<T>

	return function get(...args: any) {
		if (!instantiated) {
			instance = generator(...args)
			instantiated = true
		}

		return instance as ReturnType<T>
	}
}

export { tiny_singleton }
