
export default function try_getter_or_fallback<
	Fn extends () => ReturnType<Fn>,
	T,
>({
	getter,
	fallback_result,
	on_error = () => {},
}: {
	getter: Fn,
	fallback_result: T,
	on_error: (err: Error) => void,
}): ReturnType<Fn> | T {
	try {
		return getter()
	}
	catch (err) {
		on_error(err)
		return fallback_result
	}
}
