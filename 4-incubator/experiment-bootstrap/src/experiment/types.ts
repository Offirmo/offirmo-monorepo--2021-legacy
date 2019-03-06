import { Enum } from 'typescript-string-enums'

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
}


export interface ExperimentResolution<T> {
	startDateMs: TimestampUTCMs // default at -1 = resolution not started
	runtimeInfos: Partial<T>
	isKillSwitchResolved: boolean
	isInitialCohortResolved: boolean
	isRequirementResolved: { [key: string]: boolean }
}


// TODO improve logger
export interface Logger {
	log: (...p: any[]) => void,
	info: (...p: any[]) => void,
	warn: (...p: any[]) => void,
	error: (...p: any[]) => void,
}


export interface ExperimentInternal<T> {
	stepCount: number // incremented at each change, to help debugging
	meta: {
		// TODO resolution timeout?
		logger?: Logger,
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
