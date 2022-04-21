
//////////// Public interface (for logger usage) ////////////

// List of all known logging primitives, in order of criticity
// https://docs.google.com/spreadsheets/d/1Bc32plQTswNdCqXS99deB0n7Te7FfD7uepGAOOlPbvY/edit?usp=sharing
export type LogLevel =
	// TODO an extra "never" level?
	  'fatal'
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

export interface LogDetails { [k: string]: any }

// We INTENTIONALLY restrict to a structured primitive with no overloading.
// - we do NOT follow bunyan with its multiple overloads (https://github.com/trentm/node-bunyan#log-method-api)
//   Rationale: multiple overloads prove hard to type and force to use complex normalization code.
// - we do not attempt to mirror console.x() API:
//   it's not relevant since the introduction of string templates literals.
// Still, we MAY tolerate a few simplifying cases:
// - omitting the message: it will be extracted from details.message
// - passing an error directly, either as the only arg or as details
//   (to allow the simple logging of an error)
// Those "tolerances" are non standard and may not be handled!
export type LogPrimitive = (message?: string, details?: Readonly<LogDetails>) => void

// The top-level interface
export interface Logger {
	setLevel: (level: LogLevel) => void
	getLevel: () => LogLevel
	addCommonDetails: (hash: Readonly<LogDetails>) => void

	fatal: LogPrimitive
	emerg: LogPrimitive
	alert: LogPrimitive
	crit: LogPrimitive
	error: LogPrimitive
	warning: LogPrimitive
	warn: LogPrimitive
	notice: LogPrimitive
	info: LogPrimitive
	verbose: LogPrimitive
	log: LogPrimitive
	debug: LogPrimitive
	trace: LogPrimitive
	silly: LogPrimitive

	// for convenience. Not guaranteed to do anything.
	group(groupTitle?: string): void
	groupCollapsed(groupTitle?: string): void
	groupEnd(): void
}

//////////// Private interface (for logger implementations) ////////////

// internal representation of a log line
// inspired by:
// https://github.com/trentm/node-bunyan#core-fields
export interface LogPayload {
	name: string // logger name

	time: number // UTC timestamp
	level: LogLevel
	msg: string
	err?: Error
	details: LogDetails
}

// a fn responsible to display a log line (or whatever)
export type LogSink = (payload: LogPayload) => void

// a suggested base logger state
export interface BaseInternalLoggerState {
	name: string
	level: LogLevel // inclusive lower bound
	commonDetails: LogDetails
	outputFn: LogSink
}

// suggested creation params
export interface BaseSinkOptions {
	sink?: LogSink
}
export interface LoggerCreationParams<SinkOptions extends BaseSinkOptions = {}> {
	name?: string
	suggestedLevel?: LogLevel // the code is free to suggest a default level, but can expect it to be dynamically overriden (see Universal Debug API)
	forcedLevel?: LogLevel // use only if you provide your own mechanism for dynamically setting the level
	commonDetails?: Readonly<LogDetails>
	sinkOptions?: SinkOptions // options specifically targeted at the sink, usually platform dependent
}
