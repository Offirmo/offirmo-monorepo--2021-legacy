import { Enum } from 'typescript-string-enums'

///////

const LogLevel = Enum(
	'fatal',
	'emerg',
	'alert',
	'crit',
	'error',
	'warning',
	'warn',
	'notice',
	'info',
	'verbose',
	'log',
	'debug',
	'trace',
	'silly',
)
type LogLevel = Enum<typeof LogLevel> // eslint-disable-line no-redeclare

///////

type Details = { [k: string]: any }

type LogFn = (message?: string, details?: Readonly<Details>) => void

// inspired by:
// https://github.com/trentm/node-bunyan#core-fields
interface Payload {
	level: LogLevel
	name: string
	msg: string
	time: string
	err?: Error
	details: Details
}

type OutputFn = (payload: Payload) => void

interface LogParams {
	name: string
	level?: Readonly<LogLevel>
	details?: Readonly<Details>
}

interface InternalLoggerState {
	name: string
	level: LogLevel // lower bound, included
	details: Details
	outputFn: OutputFn
}

interface Logger {
	_: InternalLoggerState

	//child: (p: Partial<LogParams>) => Logger
	isLevelEnabled: (level: LogLevel) => boolean
	setLevel: (level: LogLevel) => void
	getLevel: () => LogLevel

	addDetails: (hash: Details) => void

	alert: LogFn,
	crit: LogFn,
	debug: LogFn,
	emerg: LogFn,
	error: LogFn,
	fatal: LogFn,
	info: LogFn,
	log: LogFn,
	notice: LogFn,
	silly: LogFn,
	trace: LogFn,
	verbose: LogFn,
	warn: LogFn,
	warning: LogFn,
}



export {
	Details,
	LogLevel,
	LogFn,
	OutputFn,
	InternalLoggerState,
	Logger,
	LogParams,
	Payload,
}
