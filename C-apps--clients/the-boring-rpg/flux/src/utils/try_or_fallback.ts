
export default function try_getter_or_fallback<
	Fn extends () => ReturnType<Fn>,
	T,
>({
	code,
	fallback,
	on_error = () => {},
}: {
	code: Fn,
	fallback: T,
	on_error: (err: Error) => void,
}): ReturnType<Fn> | T {
	try {
		return code()
	}
	catch (err) {
		on_error(err)
		return fallback
	}
}
