import { Logger } from '@offirmo/universal-debug-api-minimal-to-void'

import { INELIGIBILITY_REASON_NOT_RESOLVED_YET } from './consts'
import { ResolvedExperiment } from '../types'
import { ExperimentStage, ExperimentInternal } from './types'


export function getKey<T>(state: ExperimentInternal<T>): string {
	return state.spec.key
}

export function getLogger<T>(state: ExperimentInternal<T>): Logger {
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

export function isActive<T>(state: ExperimentInternal<T>): boolean {
	return state.stage === ExperimentStage.resolving || state.stage === ExperimentStage.resolved
}

export function isResolved<T>(state: ExperimentInternal<T>): boolean {
	return state.stage === ExperimentStage.resolved
}

export function getPromisedResult<T>(state: ExperimentInternal<T>): Promise<ResolvedExperiment> {
	return state.deferredResult
}

export function getResultSync<T>(state: ExperimentInternal<T>): ResolvedExperiment {
	if (!isResolved(state)) {
		// TODO warn? log error?
		return {
			...state.publicResult,
			ineligibilityReasons: [
				...state.publicResult.ineligibilityReasons,
				INELIGIBILITY_REASON_NOT_RESOLVED_YET,
			],
		}
	}

	return state.publicResult
}
