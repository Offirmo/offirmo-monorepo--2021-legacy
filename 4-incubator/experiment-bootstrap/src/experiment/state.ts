import { Enum } from 'typescript-string-enums'

import Deferred from '../utils/deferred'
import { TimestampUTCMs, getUTCTimestampMs } from '../utils/timestamp'
import {
	Cohort,
	Requirement,
	Feedback,
	ResolvedExperiment,
} from "../types";
import { LIB, DEBUG } from '../consts'

import {
	ExperimentStage,
	ExperimentSpec,
	ExperimentInternal
} from './types'

import {
	INELIGIBILITY_REASON_INCOMPLETE_SPEC,
	INELIGIBILITY_REASON_INTERNAL_ERROR,
	ERROR_MSG_MISSING_INFOS,
} from './consts'

import {
	getErrorCount, getKey,
	hasError,
	hasFailedRequirement,
} from './selectors'


export function create<T>(key: string): ExperimentInternal<T> {
	const state = {
		stepCount: 0,
		stage: ExperimentStage.specifying,
		spec: {
			key,
			requirements: {},
		},
		resolution: {
			startDateMs: 0,
			isKillSwitchResolved: false,
			isInitialCohortResolved: false,
			isRequirementResolved: {},
			runtimeInfos: {},
		},
		privateResult: {
			isOn: true,
			initialCohort: Cohort['not-enrolled'],
			requirements: {},
		},
		publicResult: {
			shouldRun: false,
			cohort: Cohort['not-enrolled'],
			ineligibilityReasons: new Set(),
			feedback: [],
		},
		deferredResult: new Deferred<ResolvedExperiment>(),
	}

	if (DEBUG) {
		console.log(`[${LIB}/${getKey(state)}]: create(…)`, state)
		state.deferredResult
			.then(cohort => (hasError(state)? console.error : console.info)(`[${LIB}/${getKey(state)}]: RESOLVED! to:`, cohort))
	}

	return state
}

const MAX_ERR = 10 // to avoid infinite loops
function _reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	if (DEBUG) console.error(`[${LIB}/${getKey(state)}]: Error: "${msg}"`, details)

	if (getErrorCount(state) > MAX_ERR) return state

	// no need to turn the experiment off, the presence of error is a good indication already

	if (getErrorCount(state) === MAX_ERR) {
		msg = '[too many errors, discarding…]'
		details = {
			step: state.stepCount
		}
	}

	state.publicResult.feedback.push({
		type: 'error',
		msg,
		details: {
			...details,
			step: state.stepCount
		}
	})

	state.publicResult.ineligibilityReasons.add(INELIGIBILITY_REASON_INTERNAL_ERROR)

	return state
}
export function reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	state.stepCount++

	state = _reportError(state, msg, details)

	return state
}

export function setKillSwitch<T>(state: ExperimentInternal<T>, isOn: ExperimentSpec<T>['isOn']): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: setKillSwitch(…)`, isOn)

	state.stepCount++

	if (state.spec.isOn)
		return reportError(state, 'Spec error: duplicate kill switch!', {step: state.stepCount})
	if (state.stage !== ExperimentStage.specifying)
		return reportError(state, 'Spec error: setting kill switch late!', {step: state.stepCount})

	state.spec.isOn = isOn

	return state
}

export function setCohortPicker<T>(state: ExperimentInternal<T>, cohortPicker: ExperimentSpec<T>['cohortPicker']): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: setCohortPicker(…)`, cohortPicker)

	state.stepCount++

	if (state.spec.cohortPicker)
		return reportError(state, 'Spec error: duplicate cohort picker!', {step: state.stepCount})
	if (state.stage !== ExperimentStage.specifying)
		return reportError(state, 'Spec error: setting cohort picker late!', {step: state.stepCount})

	state.spec.cohortPicker = cohortPicker

	return state
}

export function addRequirement<T>(state: ExperimentInternal<T>, r: Requirement<T>): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: addRequirement(…)`, r)

	state.stepCount++

	const { key, resolver }: Requirement<T> = r

	if (state.spec.requirements[key])
		return reportError(state, `Spec error: duplicate requirement "${key}"!`, {step: state.stepCount})
	if (state.stage !== ExperimentStage.specifying)
		return reportError(state, 'Spec error: setting requirement late!', {step: state.stepCount})

	state.spec.requirements[key] = resolver

	return state
}

function _attemptResolution<T>(state: ExperimentInternal<T>): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: _attemptResolution(…)`)

	if (state.stage === ExperimentStage.specifying)
		throw new Error(`${LIB}: internal error: BPR1!`) // TODO review
	if (state.stage === ExperimentStage.resolved) {
		// ignore. May arrive when promises resolve late.
		return state
	}

	let isInfoMissing =
		!state.resolution.isKillSwitchResolved
		|| !state.resolution.isInitialCohortResolved
		|| !Object.values(state.resolution.isRequirementResolved).every(r => r)

	if (!hasError(state) && isInfoMissing) return state

	state.stage = ExperimentStage.resolved

	const hasProblem =
		!state.privateResult.isOn || hasError(state) || hasFailedRequirement(state);

	state.publicResult.cohort =
		hasProblem ? Cohort['not-enrolled'] : state.privateResult.initialCohort

	state.publicResult.shouldRun = state.publicResult.cohort !== Cohort['not-enrolled']

	state.deferredResult.resolve(state.publicResult)

	return state
}

export function initiateResolution<T>(state: ExperimentInternal<T>): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiateResolution(…)`)

	state.stepCount++

	if (state.stage !== ExperimentStage.specifying)
		return reportError(state, 'initiateResolution(): unexpected attempt!', {step: state.stepCount})

	state.stage = ExperimentStage.resolving

	// iterate on each resolution requirement
	if (!state.resolution.startDateMs) {
		state.resolution.startDateMs = getUTCTimestampMs()
		// TODO start a timer
	}

	if (!state.resolution.isKillSwitchResolved) (() => {
		if (!state.spec.isOn) {
			// nothing to do
			state.resolution.isKillSwitchResolved = true
			return
		}

		function onIsOnError(err: Error) {
			if (err.message === ERROR_MSG_MISSING_INFOS) { // TODO improve detection?
				// no problem.
				// TODO log?
				return
			}

			state = reportError(state, '[isOn] ' + err.message, (err as any).details)
		}

		try {
			Promise.resolve(state.spec.isOn(state.resolution.runtimeInfos))
				.then(isOn => {
					if (state.stage !== ExperimentStage.resolving) return // too late
					if (state.resolution.isKillSwitchResolved) return // duplicate call

					if (typeof isOn !== 'boolean') throw new Error(`Incorrect value!`) // TODO pass as details

					state.privateResult.isOn = isOn
					state.resolution.isKillSwitchResolved = true
					if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: kill switch resolved to:`, isOn)
				})
				.catch(onIsOnError)
				.finally(() => state = _attemptResolution(state))
		}
		catch(err) {
			onIsOnError(err)
		}
	})()

	if (!state.resolution.isInitialCohortResolved) (() => {
		if (!state.spec.cohortPicker) {
			state = reportError(state, 'Missing cohort picker!')
			return
		}

		function onCohortPickerError(err: Error) {
			if (err.message === ERROR_MSG_MISSING_INFOS) { // TODO improve detection?
				// no problem.
				// TODO log?
				return
			}

			state = reportError(state, '[cohort picker] ' + err.message, (err as any).details)
		}

		try {
			Promise.resolve(state.spec.cohortPicker(state.resolution.runtimeInfos))
				.then(initialCohort => {
					if (state.stage !== ExperimentStage.resolving) return // too late
					if (state.resolution.isInitialCohortResolved) return // duplicate call

					if (!Enum.isType(Cohort, initialCohort)) throw new Error(`Incorrect value!`) // TODO pass as details

					state.privateResult.initialCohort = initialCohort
					state.resolution.isInitialCohortResolved = true
					if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: cohort resolved to:`, initialCohort)
				})
				.catch(onCohortPickerError)
				.finally(() => state = _attemptResolution(state))
		}
		catch(err) {
			onCohortPickerError(err)
		}
	})()

	// TODO check requirements

	state = _attemptResolution(state)

	return state
}
