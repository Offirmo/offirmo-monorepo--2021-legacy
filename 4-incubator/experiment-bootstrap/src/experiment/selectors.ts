import { LIB } from '../consts'

import {
	ExperimentStage,
	ExperimentInternal
} from './types'

import {ResolvedExperiment} from "../types";


export function getKey<T>(state: ExperimentInternal<T>): string {
	return state.spec.key
}

export function getErrorCount<T>(state: ExperimentInternal<T>): number {
	return state.publicResult.feedback.filter(f => f.type === 'error').length
}

export function hasError<T>(state: ExperimentInternal<T>): boolean {
	return getErrorCount(state) > 0
}

export function getPromisedResult<T>(state: ExperimentInternal<T>): Promise<ResolvedExperiment> {
	return state.deferredResult
}

export function getResultSync<T>(state: ExperimentInternal<T>): ResolvedExperiment {
	if (state.stage !== ExperimentStage.resolved)
		throw new Error(`[${LIB}/${getKey(state)}] getResultSync(): not resolved yet!`)

	return state.publicResult
}

