// TODO

import {
	Logger,
	LogParams,
	OutputFn,
} from './types'


import { createLogger } from './core'


interface ChildCreateParams extends Partial<LogParams> {
	parent: Logger
	outputFn?: OutputFn,
}

function createChildLogger({
	parent,
	name = parent._.name,
	level = parent.getLevel(),
	details = {},
	outputFn = parent._.outputFn,
}: ChildCreateParams): Logger {
	details = {
		...parent._.details,
		...details,
	}

	return createLogger({
		name,
		level,
		details,
		outputFn,
	})
}



export {
	ChildCreateParams,
	createChildLogger,
}
