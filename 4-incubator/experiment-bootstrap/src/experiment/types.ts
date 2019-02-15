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
	// TODO extra state to force one spec time?
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


export interface ExperimentInternal<T> {
	stepCount: number // to help debugging
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
