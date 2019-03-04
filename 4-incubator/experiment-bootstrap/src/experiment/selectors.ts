import assert from 'tiny-invariant'

import { LIB } from '../consts'
import { ResolvedExperiment } from '../types'
import { ExperimentStage, ExperimentInternal, Logger } from './types'


export function getKey<T>(state: ExperimentInternal<T>): string {
	return state.spec.key
}

export function getLogger<T>(state: ExperimentInternal<T>): Logger | undefined {
	return state.meta.logger
}

export function getErrorCount<T>(state: ExperimentInternal<T>): number {
	return state.publicResult.feedback.filter(f => f.type === 'error').length
}

export function getWarningCount<T>(state: ExperimentInternal<T>): number {
	return state.publicResult.feedback.filter(f => f.type === 'warning').length
}

export function hasError<T>(state: ExperimentInternal<T>): boolean {
	return getErrorCount(state) > 0
}

export function getPromisedResult<T>(state: ExperimentInternal<T>): Promise<ResolvedExperiment> {
	return state.deferredResult
}

export function getResultSync<T>(state: ExperimentInternal<T>): ResolvedExperiment {
	// Yes, we may throw for this one. This is part of the API.
	assert(state.stage === ExperimentStage.resolved, `[${LIB}/${getKey(state)}] getResultSync(): not resolved yet!`)

	return state.publicResult
}
