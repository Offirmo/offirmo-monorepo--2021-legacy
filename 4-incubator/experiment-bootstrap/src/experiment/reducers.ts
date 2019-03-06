import { Enum } from 'typescript-string-enums'
import assert from 'tiny-invariant'

import { Deferred } from '../utils/deferred'
import { getProperty } from '../utils/get-property'
import { getUTCTimestampMs } from '../utils/timestamp'
import { create_error } from '../utils/create-error'

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
	INELIGIBILITY_REASON_INTERNAL_ERROR,
	INELIGIBILITY_REASON_KILL_SWITCHED,
	INELIGIBILITY_REASON_COHORTED_OUT,
	ERROR_MSG_MISSING_INFOS,
} from './consts'

import {
	getKey,
	getLogger,
	getErrorCount,
	getWarningCount,
	hasError,
} from './selectors'


//////////// internal reducers ////////////
// those don't increment "step"

const MAX_ERRORS = 10 // to avoid large memory consumption
function _reportError<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.error(`[${LIB}/${getKey(state)}]: Error: "${msg}"`, details)

	if (getErrorCount(state) > MAX_ERRORS) return state

	if (getErrorCount(state) === MAX_ERRORS) {
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


const MAX_WARNINGS = 10 // to avoid large memory consumption
function _reportWarning<T>(state: ExperimentInternal<T>, msg: string, details: Object = {}): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.warn(`[${LIB}/${getKey(state)}]: Warning: "${msg}"`, details)

	if (getWarningCount(state) > MAX_WARNINGS) return state

	if (getWarningCount(state) === MAX_WARNINGS) {
		msg = '[too many warnings, discarding…]'
		details = {}
	}

	state.publicResult.feedback.push({
		type: 'warning',
		msg,
		details: {
			...details,
			step: state.stepCount
		}
	})

	return state
}


//////////// Specification stage ////////////
// we may throw here

export function create<T>(key: string, { logger }: { logger?: ExperimentInternal<T>['meta']['logger']} = {}): ExperimentInternal<T> {
	assert(key.startsWith && key.startsWith('go/'), `[${LIB}] invalid param: key should be a string and start with go/!`)

	const state: ExperimentInternal<T> = {
		stage: ExperimentStage.specifying,
		stepCount: 0,
		meta: {
			logger: logger || console,
		},
		spec: {
			key,
			requirements: {},
		},
		resolution: {
			pendingOnResolutionInitiatedCallbacks: [],
			startDateMs: -1,
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

	if (logger) {
		logger.log(`[${LIB}/${getKey(state)}]: create(…)`, state)
		state.deferredResult
			.then(cohort => {
				const details: any = { cohort }
				if (state.publicResult.ineligibilityReasons.length)
					details.ineligibilityReasons = state.publicResult.ineligibilityReasons

					;((hasError(state) || state.publicResult.ineligibilityReasons.length)? logger.error : logger.info)(
					`[${LIB}/${getKey(state)}]: RESOLVED! to:`, cohort
				)
			})
	}

	return state
}


export function setKillSwitch<T>(state: ExperimentInternal<T>, isOn: ExperimentSpec<T>['isOn']): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: setKillSwitch(…)`, isOn)

	assert(state.stage === ExperimentStage.specifying, `[${LIB}] Spec error: setting kill switch late!`)
	assert(typeof isOn === 'function', `[${LIB}] invalid param: isOn!`)
	assert(!state.spec.isOn, `[${LIB}] Spec error: duplicate kill switch!`)

	state.stepCount++
	state.spec.isOn = isOn

	return state
}


export function setCohortPicker<T>(state: ExperimentInternal<T>, cohortPicker: ExperimentSpec<T>['cohortPicker']): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: setCohortPicker(…)`, cohortPicker)

	assert(state.stage === ExperimentStage.specifying, `[${LIB}] Spec error: setting cohort picker late!`)
	assert(typeof cohortPicker === 'function', `[${LIB}] invalid param: cohortPicker!`)
	assert(!state.spec.cohortPicker, `[${LIB}] Spec error: duplicate cohort picker!`)

	state.stepCount++
	state.spec.cohortPicker = cohortPicker

	return state
}


export function addRequirement<T>(state: ExperimentInternal<T>, r: Requirement<T>): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: addRequirement(…)`, r)

	assert(state.stage === ExperimentStage.specifying, `[${LIB}] Spec error: setting a requirement late!`)
	assert(r && typeof r.resolver === 'function', `[${LIB}] invalid param: requirement!`)
	const { key, resolver }: Requirement<T> = r
	assert(!state.spec.requirements[key], `[${LIB}] Spec error: duplicate requirement "${key}"!`)

	state.stepCount++
	state.spec.requirements[key] = resolver

	// add defaults
	state.resolution.isRequirementResolved[key] = false
	state.privateResult.requirements[key] = false

	return state
}


export function markSpecificationDone<T>(state: ExperimentInternal<T>): ExperimentInternal<T> {
	assert(state.stage === ExperimentStage.specifying, `[${LIB}] Spec error: redundant specification end!`)

	state.stepCount++
	state.stage = ExperimentStage.waiting_usage

	return state
}


//////////// later stages ////////////
// TODO big try/catches around all reducers!

export function registerOnResolutionInitiated<T>(state: ExperimentInternal<T>, callback: () => void): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: onResolutionInitiated(…)`)

	state.stepCount++

	switch(state.stage) {
		case ExperimentStage.specifying:
			break
		case ExperimentStage.waiting_usage:
			break
		case ExperimentStage.resolving:
			// too late! Reject immediately to not force waiting for the full timeout.
			return _reportError(state, 'onResolutionInitiated(): late call!', {step: state.stepCount})
		case ExperimentStage.resolved:
			return _reportWarning(state, 'onResolutionInitiated(): late call!', {step: state.stepCount})
		default:
			return _reportError(state, 'onResolutionInitiated(): internal error ORI1!', {step: state.stepCount})
	}

	state.resolution.pendingOnResolutionInitiatedCallbacks.push(callback)

	return state
}


export function setInfos<T>(state: ExperimentInternal<T>, infos: Partial<T>): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: setInfos(…)`, infos)

	state.stepCount++

	switch(state.stage) {
		case ExperimentStage.specifying:
			// user has forgotten to mark specifications as done.
			state = _reportError(state, `Incorrect stage for calling setInfos()!`, {
				stage: state.stage,
			})
			break
		case ExperimentStage.waiting_usage:
			break
		case ExperimentStage.resolving:
			break
		case ExperimentStage.resolved:
			// let it slide...
			return _reportWarning(state, 'setInfos(): late re-attempt!', {step: state.stepCount})
		default:
			state = _reportError(state, 'setInfos(): internal error SI1!', {step: state.stepCount})
	}

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

	const isWaitingForReInitiate =
		state.stage === ExperimentStage.resolving
		&& state.resolution.pendingOnResolutionInitiatedCallbacks.length === 0 // special case: we know initiate is pending.
	if (isWaitingForReInitiate) {
		// those new infos may be expected, re-attempt to resolve
		state = initiateResolution(state)
	}

	return state
}


// Evaluate all the infos in the state and attempt to come up with a resolution.
// Will just return if not enough info yet.
// This function may be called many times, each time some new info arrives.
function _attemptResolution<T>(state: ExperimentInternal<T>, srcDebug: string): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: _attemptResolution(…) - due to: ${srcDebug}`)

	switch(state.stage) {
		case ExperimentStage.specifying:
		case ExperimentStage.waiting_usage:
			state = _reportError(state, '_attemptResolution(): AR1!', {step: state.stepCount})
			state.stage = ExperimentStage.resolving // initiate early resolution to not-enrolled
			break
		case ExperimentStage.resolving:
			break
		case ExperimentStage.resolved:
			// happens on late/duplicated requirements resolution
			return state
		default:
			state = _reportError(state, '_attemptResolution(): AR2!', {step: state.stepCount})
			state.stage = ExperimentStage.resolving // initiate early resolution to not-enrolled
			break
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

	// note: we don't stop if some info are still missing,
	// because existing infos may be enough to resolve the experiment: to not-enrolled

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


// trigger resolutions calls for all specification callbacks that are not resolved yet.
// This function may be called many times, each time some new info arrives.
const RESOLUTION_TIMEOUT_MS = 5_000
export function initiateResolution<T>(state: ExperimentInternal<T>): ExperimentInternal<T> {
	if (getLogger(state)) getLogger(state)!.log(`[${LIB}/${getKey(state)}]: initiateResolution(…)`)

	state.stepCount++

	switch(state.stage) {
		case ExperimentStage.specifying:
			state = _reportError(state, 'initiateResolution(): specification not complete!', {step: state.stepCount})
			break
		case ExperimentStage.waiting_usage:
			break
		case ExperimentStage.resolving:
			break
		case ExperimentStage.resolved:
			return _reportError(state, 'initiateResolution(): late re-attempt!', {step: state.stepCount})
		default:
			state = _reportError(state, 'initiateResolution(): internal error IR1!', {step: state.stepCount})
			// keep executing to initiate early resolution to not-enrolled
			break
	}

	if (state.stage !== ExperimentStage.resolving) {
		if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiating resolution…`)
		state.stage = ExperimentStage.resolving

		if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiating timeout…`)
		state.resolution.startDateMs = getUTCTimestampMs()
		setTimeout(() => {
			if (state.stage === ExperimentStage.resolved) return // ok

			state = _reportError(state, 'timeout')
			state = _attemptResolution(state, 'timeout')
		}, RESOLUTION_TIMEOUT_MS)

		state.resolution.pendingOnResolutionInitiatedCallbacks.forEach(cb => cb())
		state.resolution.pendingOnResolutionInitiatedCallbacks = []
	}

	// shortcut if we already have errors
	if (hasError(state)) {
		return _attemptResolution(state, 'initiate_spite')
	}

	// iterate on each resolution requirement:

	if (!state.resolution.isKillSwitchResolved) (() => {
		if (!state.spec.isOn) {
			// nothing to do, default to true
			state.resolution.isKillSwitchResolved = true
			return
		}

		function onIsOnError(err: Error) {
			if (err.message === ERROR_MSG_MISSING_INFOS) {
				// no problem. Will be re-triggered when setInfo() is called again.
				if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: kill switch reported it needs more infos.`)
				return
			}

			state = _reportError(state, '[isOn] ' + err.message, (err as any).details)
		}

		try {
			if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiating resolution of isOn…`)
			Promise.resolve(state.spec.isOn(state.resolution.runtimeInfos))
				.then(isOn => {
					if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: kill switch resolved to:`, isOn)
					if (state.resolution.isKillSwitchResolved) return // duplicate resolution, possible on repeated setInfos() calls
					if (state.stage !== ExperimentStage.resolving) return // too late, experiment already resolved to not-enrolled

					if (typeof isOn !== 'boolean') throw create_error(`Incorrect value!`, {value: isOn})

					state.privateResult.isOn = isOn
					state.resolution.isKillSwitchResolved = true
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
			if (err.message === ERROR_MSG_MISSING_INFOS) {
				// no problem. Will be re-triggered when setInfo() is called again.
				if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: cohort picker reported it need more infos.`)
				return
			}

			state = _reportError(state, '[cohort picker] ' + err.message, (err as any).details)
		}

		try {
			if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiating resolution of cohort…`)
			Promise.resolve(state.spec.cohortPicker(state.resolution.runtimeInfos))
				.then(initialCohort => {
					if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: cohort resolved to:`, initialCohort)
					if (state.resolution.isInitialCohortResolved) return // duplicate resolution, possible on repeated setInfos() calls
					if (state.stage !== ExperimentStage.resolving) return // too late, experiment already resolved to not-enrolled

					if (!Enum.isType(Cohort, initialCohort)) throw create_error(`Incorrect value!`, {value: initialCohort})

					state.privateResult.initialCohort = initialCohort
					state.resolution.isInitialCohortResolved = true
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
				if (err.message === ERROR_MSG_MISSING_INFOS) {
					// no problem. Will be re-triggered when setInfo() is called again.
					if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: requirement "${key}" reported it need more infos`)
					return
				}

				state = _reportError(state, `[req:${key}] ` + err.message, (err as any).details)
			}

			try {
				if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: initiating resolution of requirement "${key}"…`)
				Promise.resolve(resolver(state.resolution.runtimeInfos))
					.then(isReqOk => {
						if (DEBUG) console.log(`[${LIB}/${getKey(state)}]: requirement "${key}" resolved to:`, isReqOk)
						if (state.resolution.isRequirementResolved[key]) return // duplicate resolution, possible on repeated setInfos() calls
						if (state.stage !== ExperimentStage.resolving) return // too late, experiment already resolved to not-enrolled

						if (typeof isReqOk !== 'boolean') throw create_error(`Incorrect value!`, {value: isReqOk})

						state.privateResult.requirements[key] = isReqOk
						state.resolution.isRequirementResolved[key] = true
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
