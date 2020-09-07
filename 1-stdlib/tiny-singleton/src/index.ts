
export default function tiny_singleton<
	CreateFn extends (...args: any[]) => ReturnType<CreateFn>
>(generator: CreateFn): (...args: Parameters<CreateFn>) => ReturnType<CreateFn> {
	let instantiated = false
	let instance: undefined | ReturnType<CreateFn>

	return function get(...args: any) {
		if (!instantiated) {
			instance = generator(...args)
			instantiated = true
		}

		return instance as ReturnType<CreateFn>
	}
}

export { tiny_singleton }
