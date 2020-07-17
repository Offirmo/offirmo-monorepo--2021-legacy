import Emittery from 'emittery'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { XError } from '@offirmo-private/common-error-fields'


export interface BaseInjections {
	//SEC: -> see WithSEC below
	logger: any

	// detected env
	ENV: string
	NODE_ENV: string
	IS_DEV_MODE: boolean
	IS_VERBOSE: boolean
	CHANNEL: string
	SESSION_START_TIME: TimestampUTCMs
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
		& { err: XError }
}

export interface SoftExecutionContext<Injections = {}, AnalyticsDetails = {}, ErrorDetails = {}> {

	// core
	createChild: ()
		=> SoftExecutionContext<Injections, AnalyticsDetails, ErrorDetails>
	emitter: Emittery.Typed<EventDataMap>

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
	xTry: <T>(operation: string, fn: (p: Injections
													& BaseInjections
													& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
													) => T) => T
	xTryCatch: <T>(operation: string, fn: (p: Injections
															& BaseInjections
															& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
															) => T) => T | undefined

	xPromiseCatch: <T>(operation: string, fn: (p: Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
	) => Promise<T>) => Promise<T | undefined>
	xPromiseTry: <T>(operation: string, fn: (p: Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
	) => Promise<T>) => Promise<T>
	xPromiseTryCatch: <T>(operation: string, fn: (p: Injections
		& BaseInjections
		& WithSEC<Injections, AnalyticsDetails, ErrorDetails>
	) => Promise<T>) => Promise<T | undefined>
}
