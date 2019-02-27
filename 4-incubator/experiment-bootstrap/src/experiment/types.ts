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
	'specified',
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
	startDateMs: TimestampUTCMs
	runtimeInfos: Partial<T>
	isKillSwitchResolved: boolean
	isInitialCohortResolved: boolean
	isRequirementResolved: { [key: string]: boolean }
}


export interface Logger {
	log: (...p: any[]) => void,
	info: (...p: any[]) => void,
	warn: (...p: any[]) => void,
	error: (...p: any[]) => void,
}

export interface ExperimentInternal<T> {
	stepCount: number // to help debugging
	stage: ExperimentStage

	meta: {
		logger?: Logger,
	}
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
