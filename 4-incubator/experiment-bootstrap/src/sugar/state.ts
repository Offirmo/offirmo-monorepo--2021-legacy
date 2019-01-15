import Deferred from '../utils/deferred'
import { TimestampUTCMs, getUTCTimestampMs } from '../utils/timestamp'


import {
	Cohort,
	Requirement,
	Feedback,
	ResolvedExperiment,
} from "../types";


export interface ExperimentSpec<T extends Object> {
	key: string

	isOn?: (params: Partial<T>) => Promise<boolean>,
	cohortPicker?: (params: Partial<T>) => Promise<Cohort>,
	requirements: Requirement<T>[]

	params: Partial<T>
}

interface ExperimentInternal<T> {
	stepCount: number

	spec: ExperimentSpec<T>

	stage: 'spec' | 'resolving' | 'resolved'
	resolutionStartDateMs: TimestampUTCMs
	runtimeInfos: Partial<T>

	result: ResolvedExperiment
	deferredResult: Deferred<ResolvedExperiment>
}

const INELIGIBILITY_REASON_INCOMPLETE_SPEC = 'incomplete-spec'

export function create<T>(key: string): ExperimentInternal<T> {
	return {
		stepCount: 0,
		stage: 'spec',
		resolutionStartDateMs: 0,
		runtimeInfos: {},
		spec: {
			key,
			requirements: [],
			params: {},
		},
		result: {
			isOn: true,
			initialCohort: undefined,
			shouldRun: false,
			cohort: Cohort['not-enrolled'],
			ineligibilityReasons: [
				INELIGIBILITY_REASON_INCOMPLETE_SPEC
			],
			feedback: [],
		},
		deferredResult: new Deferred<ResolvedExperiment>(),
	}
}

////////////////////////////////////

function getErrorCount<T>(state: ExperimentInternal<T>): number {
	return state.result.feedback.filter(f => f.type === 'error').length
}

export function getPromisedResult<T>(state: ExperimentInternal<T>): Promise<ResolvedExperiment> {
	return state.deferredResult
}

////////////////////////////////////

const MAX_ERR = 10
function _reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	if (getErrorCount(state) > MAX_ERR) return state

	if (getErrorCount(state) === MAX_ERR) {
		msg = '[too many errors, discarding…]'
		details = {}
	}

	state.result.feedback.push({
		type: 'error',
		msg,
		details
	})

	return state
}
export function reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	state = _reportError(state, msg, details)
	state.stepCount++

	return state
}

export function setKillSwitch<T>(state: ExperimentInternal<T>, isOn: ExperimentSpec<T>['isOn']): ExperimentInternal<T> {
	if (state.spec.isOn)
		return reportError(state, 'Spec error: duplicate kill switch!', {step: state.stepCount})
	if (state.stage !== 'spec')
		return reportError(state, 'Spec error: setting kill switch late!', {step: state.stepCount})

	state.spec.isOn = isOn
	state.stepCount++

	return state
}

export function setCohortPicker<T>(state: ExperimentInternal<T>, cohortPicker: ExperimentSpec<T>['cohortPicker']): ExperimentInternal<T> {
	if (state.spec.cohortPicker)
		return reportError(state, 'Spec error: duplicate cohort picker!', {step: state.stepCount})
	if (state.stage !== 'spec')
		return reportError(state, 'Spec error: setting cohort picker late!', {step: state.stepCount})

	state.spec.cohortPicker = cohortPicker
	state.stepCount++

	return state
}

function _initiateResolution<T>(state: ExperimentInternal<T>): ExperimentInternal<T> {
	if (state.stage !== 'spec')
		return reportError(state, 'Resolution error: duplicate attempt!', {step: state.stepCount})

	state.stage = 'resolving'
	state.resolutionStartDateMs = getUTCTimestampMs()

	if (state.spec.isOn) {
		try {
			const isOn = state.spec.isOn(state.runtimeInfos)
		}
		catch(err) {

		}
	}

	return state
}
