import Emittery from 'emittery'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { XXError } from '@offirmo/error-utils'


export interface BaseInjections {
	//SEC: -> see WithSEC below
	logger: any

	// detected env
	ENV: string
	NODE_ENV: string
	IS_DEV_MODE: boolean
	IS_VERBOSE: boolean
	CHANNEL: string
	SESSION_START_TIME_MS: TimestampUTCMs
}

export interface BaseAnalyticsDetails {
	ENV: string
	CHANNEL: string
}

export interface BaseErrorDetails {
	ENV: string
	CHANNEL: string
}

export interface WithSEC<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> {
	SEC: SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
}

export interface EventDataMap<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> {
	'analytics':
		Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
		& { eventId: string, details: any }
	'final-error':
		Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
		& { err: XXError }
}

export type OperationParams<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> =
	Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>

export type Operation<T, Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> =
	(params: OperationParams<Injections, AnalyticsDetails, ErrorDetails>) => T

export interface SoftExecutionContext<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> {

	// core
	createChild: ()
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>

	emitter: Emittery<EventDataMap>

	// plugin: logical stack
	setLogicalStack: (p: { module?: string, operation?: string})
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getLogicalStack: () => string
	getShortLogicalStack: () => string

	// convenience
	setAnalyticsAndErrorDetails: (p: Partial<AnalyticsDetails & ErrorDetails>)
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>

	// plugin: analytics
	setAnalyticsDetails: (p: Partial<AnalyticsDetails>)
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getAnalyticsDetails: () => AnalyticsDetails & BaseAnalyticsDetails
	fireAnalyticsEvent: (id: string, extraDetails?: any)
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>

	// plugin: dependency injection
	injectDependencies: (p: Partial<
		Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
	>)
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	getInjectedDependencies: () =>
		Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>

	// plugin: error handling
	setErrorReportDetails: (p: Partial<ErrorDetails>)
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>

	createError: (message: string, details: XXError['details']) => XXError
	handleError: (err: XXError) => void

	xTry: <T>(operation: string, fn: Operation<T, Injections, AnalyticsDetails, ErrorDetails>) => T
	xTryCatch: <T>(operation: string, fn: Operation<T, Injections, AnalyticsDetails, ErrorDetails>) => T | undefined

	xPromiseTry: <T>(operation: string, fn: Operation<Promise<T>, Injections, AnalyticsDetails, ErrorDetails>) => Promise<T>
	xNewPromise: <T>(operation: string, fn: (
		p: Injections
			& BaseInjections
			& WithSEC<Injections, AnalyticsDetails, ErrorDetails>,
		_resolve: (value?: T | PromiseLike<T>) => void,
		_reject: (reason?: any) => void,
	) => void) => Promise<T>
}
