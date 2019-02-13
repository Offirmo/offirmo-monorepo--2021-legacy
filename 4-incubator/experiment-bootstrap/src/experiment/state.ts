import { Enum } from 'typescript-string-enums'

import { Deferred } from '../utils/deferred'
import { getProperty } from '../utils/get-property'
import { getUTCTimestampMs } from '../utils/timestamp'
import {
	Cohort,
	Requirement,
	ResolvedExperiment,
} from "../types";
import { LIB, DEBUG } from '../consts'

import {
	ExperimentStage,
	ExperimentSpec,
	ExperimentInternal
} from './types'

import {
	INELIGIBILITY_REASON_INCOMPLETE_SPEC, // TODO review
	INELIGIBILITY_REASON_INTERNAL_ERROR,
	INELIGIBILITY_REASON_KILL_SWITCHED,
	INELIGIBILITY_REASON_COHORTED_OUT,
	ERROR_MSG_MISSING_INFOS,
} from './consts'

import {
	getErrorCount, getKey,
	hasError,
} from './selectors'


export function create<T>(key: string): ExperimentInternal<T> {
	// TODO per-exp. DEBUG

	// TODO validate params

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
			isEligible: false,
			cohort: Cohort['not-enrolled'],
			ineligibilityReasons: [],

			shouldRun: false,
			feedback: [],
		},
		deferredResult: new Deferred<ResolvedExperiment>(),
	}

	if (DEBUG) {
		console.log(`[${LIB}/${getKey(state)}]: create(…)`, state)
		state.deferredResult
			.then(cohort => {
				const details: any = { cohort }
				if (state.publicResult.ineligibilityReasons.length)
					details.ineligibilityReasons = state.publicResult.ineligibilityReasons

				;((hasError(state) || state.publicResult.ineligibilityReasons.length) ? console.error : console.info)(`[${LIB}/${getKey(state)}]: RESOLVED! to:`, cohort)
			})
	}

	return state
}

const MAX_ERR = 10 // to avoid infinite loops
function _reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	if (DEBUG) console.error(`[${LIB}/${getKey(state)}]: Error: "${msg}"`, details)

	if (getErrorCount(state) > MAX_ERR) return state

	if (getErrorCount(state) === MAX_ERR) {
		msg = '[too many errors, discarding…]'
		details = {}
	}

	state.publicResult.feedback.push({
		type: 'error',
		msg,
		details: {
			...details,
			step: state.stepCount
		}
	})

	return state
}
/*export function reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	state.stepCount++

	state = _reportError(state, msg, details)

	return state
}*/

// TODO warnings (if needed?)


export function setKillSwitch<T>(state: ExperimentInternal<T>, isOn: ExperimentSpec<T>['isOn']): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: setKillSwitch(…)`, isOn)

	state.stepCount++

	if (state.spec.isOn)
		return _reportError(state, 'Spec error: duplicate kill switch!')
	if (state.stage !== ExperimentStage.specifying)
		return _reportError(state, 'Spec error: setting kill switch late!')

	state.spec.isOn = isOn

	return state
}


export function setCohortPicker<T>(state: ExperimentInternal<T>, cohortPicker: ExperimentSpec<T>['cohortPicker']): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: setCohortPicker(…)`, cohortPicker)

	state.stepCount++

	if (state.spec.cohortPicker)
		return _reportError(state, 'Spec error: duplicate cohort picker!')
	if (state.stage !== ExperimentStage.specifying)
		return _reportError(state, 'Spec error: setting cohort picker late!')

	state.spec.cohortPicker = cohortPicker

	return state
}


export function addRequirement<T>(state: ExperimentInternal<T>, r: Requirement<T>): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: addRequirement(…)`, r)

	state.stepCount++

	const { key, resolver }: Requirement<T> = r

	if (state.spec.requirements[key])
		return _reportError(state, `Spec error: duplicate requirement "${key}"!`)
	if (state.stage !== ExperimentStage.specifying)
		return _reportError(state, 'Spec error: setting requirement late!')

	state.spec.requirements[key] = resolver
	// add defaults
	state.resolution.isRequirementResolved[key] = false
	state.privateResult.requirements[key] = false

	return state
}


export function setInfos<T>(state: ExperimentInternal<T>, infos: Partial<T>): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: setInfos(…)`, infos)
	state.stepCount++

	if (state.stage === ExperimentStage.resolved)
		return _reportError(state, 'Spec error: setting requirement late!')

	Object.keys(infos).forEach(untypedKey => {
		const key: keyof T = untypedKey as any as keyof T
		const value = getProperty(infos, key)

		if (state.resolution.runtimeInfos.hasOwnProperty(key) && state.resolution.runtimeInfos[key] !== value) {
			state = _reportError(state, `Overwrite of runtime value "${key}"!`, {
				previous: state.resolution.runtimeInfos[key],
				'new': value,
			})
			return
		}

		state.resolution.runtimeInfos[key] = value
	})

	state = initiateResolution(state)

	return state
}


function _attemptResolution<T>(state: ExperimentInternal<T>, srcDebug: string): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: _attemptResolution(…) - due to: ${srcDebug}`)

	if (state.stage === ExperimentStage.specifying)
		throw new Error(`[${LIB}/${getKey(state)}] internal error: BPR1!`) // TODO review
	if (state.stage === ExperimentStage.resolved) {
		// ignore. May arrive when promises resolve late.
		return state
	}

	let missingInfos = []
	if (!state.resolution.isKillSwitchResolved)
		missingInfos.push('kill switch')
	if (!state.resolution.isInitialCohortResolved)
		missingInfos.push('cohort')
	Object.entries(state.resolution.isRequirementResolved).forEach(([key, isResolved]) => {
		if (!isResolved)
			missingInfos.push(`requirement:${key}`)
	})

	let isInfoMissing = missingInfos.length > 0

	let ineligibilityReasons = []

	if (hasError(state)) {
		ineligibilityReasons.push(INELIGIBILITY_REASON_INTERNAL_ERROR)
	}

	if (state.resolution.isKillSwitchResolved && !state.privateResult.isOn) {
		ineligibilityReasons.push(INELIGIBILITY_REASON_KILL_SWITCHED)
	}

	if (state.resolution.isInitialCohortResolved && state.privateResult.initialCohort === Cohort['not-enrolled']) {
		ineligibilityReasons.push(INELIGIBILITY_REASON_COHORTED_OUT)
	}

	Object.entries(state.privateResult.requirements).forEach(([key, result]) => {
		if (result) return
		if (!state.resolution.isRequirementResolved[key]) return

		ineligibilityReasons.push(`requirement:${key}`)
	})

	if (!ineligibilityReasons.length && isInfoMissing) {
		// not enough infos yet
		if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: _attemptResolution(…): still waiting for:`, missingInfos)
		return state
	}

	state.stage = ExperimentStage.resolved

	const isEligible = ineligibilityReasons.length === 0
	state.publicResult.cohort = isEligible ? state.privateResult.initialCohort : Cohort['not-enrolled']
	state.publicResult.isEligible = isEligible
	state.publicResult.ineligibilityReasons.push(...ineligibilityReasons)

	state.publicResult.shouldRun = isEligible

	state.deferredResult.resolve(state.publicResult)

	return state
}


const RESOLUTION_TIMEOUT_MS = 5_000
export function initiateResolution<T>(state: ExperimentInternal<T>): ExperimentInternal<T> {
	if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiateResolution(…)`)

	state.stepCount++

	if (state.stage === ExperimentStage.resolved)
		return _reportError(state, 'initiateResolution(): late re-attempt!', {step: state.stepCount})

	state.stage = ExperimentStage.resolving

	// iterate on each resolution requirement
	if (!state.resolution.startDateMs) {
		state.resolution.startDateMs = getUTCTimestampMs()
		setTimeout(() => {
			if (state.stage === ExperimentStage.resolved) return // ok

			state = _reportError(state, 'timeout')
			state = _attemptResolution(state, 'timeout')
		}, RESOLUTION_TIMEOUT_MS)
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
				if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: kill switch reported it need more infos.`)
				return
			}

			state = _reportError(state, '[isOn] ' + err.message, (err as any).details)
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
				.finally(() => state = _attemptResolution(state, 'kill switch resolved'))
		}
		catch(err) {
			onIsOnError(err)
		}
	})()

	if (!state.resolution.isInitialCohortResolved) (() => {
		if (!state.spec.cohortPicker) {
			state = _reportError(state, 'Missing cohort picker!')
			return
		}

		function onCohortPickerError(err: Error) {
			if (err.message === ERROR_MSG_MISSING_INFOS) { // TODO improve detection?
				// no problem.
				if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: cohort picker reported it need more infos.`)
				return
			}

			state = _reportError(state, '[cohort picker] ' + err.message, (err as any).details)
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
				.finally(() => state = _attemptResolution(state, 'cohort resolved'))
		}
		catch(err) {
			onCohortPickerError(err)
		}
	})()

	Object.entries(state.spec.requirements).forEach(([key, resolver]) => {
		if (!state.resolution.isRequirementResolved[key]) (() => {
			function onRequirementError(err: Error) {
				if (err.message === ERROR_MSG_MISSING_INFOS) { // TODO improve detection?
					// no problem.
					if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: requirement "${key}" reported it need more infos`)
					return
				}

				state = _reportError(state, `[req:${key}] ` + err.message, (err as any).details)
			}

			try {
				Promise.resolve(resolver(state.resolution.runtimeInfos))
					.then(isReqOk => {
						if (state.stage !== ExperimentStage.resolving) return // too late
						if (state.resolution.isRequirementResolved[key]) return // duplicate call

						if (typeof isReqOk !== 'boolean') throw new Error(`Incorrect value!`) // TODO pass as details

						state.privateResult.requirements[key] = isReqOk
						state.resolution.isRequirementResolved[key] = true
						if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: requirement "${key}" resolved to:`, isReqOk)
					})
					.catch(onRequirementError)
					.finally(() => state = _attemptResolution(state, `requirement "${key}" resolved`))
			}
			catch(err) {
				onRequirementError(err)
			}
		})()
	})

	state = _attemptResolution(state, 'initiate')

	return state
}
