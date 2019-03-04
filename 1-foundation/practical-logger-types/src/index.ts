
// List of all known logging primitives, in order of criticity.
// https://docs.google.com/spreadsheets/d/1Bc32plQTswNdCqXS99deB0n7Te7FfD7uepGAOOlPbvY/edit?usp=sharing
export type LogLevel = 'fatal'
	| 'emerg'
	| 'alert'
	| 'crit'
	| 'error'
	| 'warning'
	| 'warn'
	| 'notice'
	| 'info'
	| 'verbose'
	| 'log'
	| 'debug'
	| 'trace'
	| 'silly'


export type LogDetails = { [k: string]: any }

// We INTENTIONALLY restrict to a structured primitive with no overloading.
// for ex. we do NOT follow bunyan with its multiple overloads (https://github.com/trentm/node-bunyan#log-method-api)
// Rationale: they prove hard to type and force to use complex normalization code.
// Still, we allow omitting the message: it will be extracted from details.message.
// This is to allow the simple logging of an error.
export type LogPrimitive = (message?: string, details?: Readonly<LogDetails>) => void

// internal representation of a log line
// inspired by:
// https://github.com/trentm/node-bunyan#core-fields
export interface LogPayload {
	level: LogLevel
	name: string
	msg: string
	time: number // UTC timestamp
	err?: Error
	details: LogDetails
}

export type LogSink = (payload: LogPayload) => void

export interface BaseInternalLoggerState {
	name: string
	level: LogLevel // inclusive lower bound
	commonDetails: LogDetails
	outputFn: LogSink
}

export interface Logger {
	setLevel: (level: LogLevel) => void
	getLevel: () => LogLevel

	addCommonDetails: (hash: Readonly<LogDetails>) => void

	fatal: LogPrimitive,
	emerg: LogPrimitive,
	alert: LogPrimitive,
	crit: LogPrimitive,
	error: LogPrimitive,
	warning: LogPrimitive,
	warn: LogPrimitive,
	notice: LogPrimitive,
	info: LogPrimitive,
	verbose: LogPrimitive,
	log: LogPrimitive,
	debug: LogPrimitive,
	trace: LogPrimitive,
	silly: LogPrimitive,
}

export interface LoggerCreationParams {
	name: string
	suggestedLevel?: LogLevel // suggested because can be overriden during a debug session
	commonDetails?: Readonly<LogDetails>
}
