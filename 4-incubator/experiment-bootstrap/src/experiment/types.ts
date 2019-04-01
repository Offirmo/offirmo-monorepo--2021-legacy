import { Enum } from 'typescript-string-enums'
import { Logger } from '@offirmo-private/universal-debug-api-minimal-to-void'

import { Deferred } from '../utils/deferred'
import { TimestampUTCMs } from '../utils/timestamp'

import {
	Cohort,
	Requirement,
	ResolvedExperiment,
} from '../types'


export const ExperimentStage = Enum(
	'specifying',
	'waiting_usage',
	'resolving',
	'resolved',
)
export type ExperimentStage = Enum<typeof ExperimentStage> // eslint-disable-line no-redeclare


export interface ExperimentSpec<T> {
	key: string

	isOn?: (params: Partial<T>) => boolean | Promise<boolean>
	cohortPicker?: (params: Partial<T>) => Cohort | Promise<Cohort>
	requirements: { [key: string]: Requirement<T>['resolver'] }

	__overrideCohortForTest: Cohort | null
}


export interface ExperimentResolution<T> {
	pendingOnResolutionInitiatedCallbacks: (() => void)[], // by contract, those callbacks will be executed BEFORE any spec callback is called
	startDateMs: TimestampUTCMs // default at -1 = resolution not started
	runtimeInfos: Partial<T>
	isKillSwitchResolved: boolean
	isInitialCohortResolved: boolean
	isRequirementResolved: { [key: string]: boolean }
}


export interface ExperimentInternal<T> {
	stepCount: number // incremented at each change, to help debugging
	meta: {
		// TODO configurable resolution timeout?
		logger: Logger,
	}

	stage: ExperimentStage

	spec: ExperimentSpec<T>

	resolution: ExperimentResolution<T>

	privateResult: {
		isOn: boolean
		initialCohort: Cohort
		requirements: { [key: string]: boolean }
	}
	publicResult: ResolvedExperiment
	deferredResult: Deferred<ResolvedExperiment>
}
