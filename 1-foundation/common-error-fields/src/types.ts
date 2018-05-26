
interface XError {
	name: string;
	message: string;

	stack?: string;

	logicalStack?: string
}

export {
	XError,
}
