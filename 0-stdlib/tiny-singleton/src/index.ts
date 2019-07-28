
function tiny_singleton<T extends (...args: any) => any>(generator: T): () => ReturnType<T> {
	let instantiated = false
	let instance: undefined | ReturnType<T>

	return function get() {
			if (!instantiated) {
				instance = generator()
				instantiated = true
			}

			return instance as ReturnType<T>
		}
}

export default tiny_singleton
export { tiny_singleton }
