import { Requirement, ResolvedExperiment } from '../types'
import { LIB } from '../consts'
import { Experiment } from './types'
import {
	ExperimentSpec,

	create,
	setKillSwitch,
	setCohortPicker,
	markSpecificationDone,
	addRequirement,
	setInfos,
	initiateResolution,

	getPromisedResult,
	getResultSync,
	getKey,
} from '../experiment'


export function createExperiment<T>(key: string): Experiment<T> {
	let state = create<T>(key)

	let experiment: Experiment<T> = {

		withKillSwitch(isOn: ExperimentSpec<T>['isOn']): Experiment<T> {
			state = setKillSwitch(state, isOn)

			return experiment
		},

		withCohortPicker(cohortPicker: ExperimentSpec<T>['cohortPicker']): Experiment<T> {
			state = setCohortPicker(state, cohortPicker)

			return experiment
		},

		withRequirement(r: Requirement<T>): Experiment<T> {
			state = addRequirement(state, r)

			return experiment
		},

		build(): Experiment<T> {
			state = markSpecificationDone(state)

			return experiment
		},

		setInfos(infos: Partial<T>): Experiment<T> {
			state = setInfos(state, infos)

			return experiment
		},

		createTouchpoint(key: string): Experiment<T> {
			throw new Error(`[${LIB}/${getKey(state)}] NIMP!`) // TODO
		},

		resolve(): Promise<ResolvedExperiment> {
			state = initiateResolution(state)
			return getPromisedResult(state)
		},

		resolveSync(): ResolvedExperiment {
			return getResultSync(state)
		},
	}

	return experiment
}

export {
	ERROR_MSG_MISSING_INFOS
} from '../experiment'
