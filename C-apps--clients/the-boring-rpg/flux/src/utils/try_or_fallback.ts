import { normalizeError } from '@offirmo/error-utils'

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
	catch (_err) {
		on_error(normalizeError(_err))
		return fallback
	}
}
