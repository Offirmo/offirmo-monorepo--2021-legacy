import {Cohort, Feedback, Requirement, ResolvedExperiment} from '../types';
import { Experiment } from './types';
import {
	ExperimentSpec,

	create,
	setKillSwitch,
	setCohortPicker,

	getPromisedResult,
} from './state'


//import EventEmitter from 'emittery'

/////////////////////


export function createExperiment<T>(key: string): Experiment {
	console.log('creating experiment', key)

	let state = create<T>(key)

	let experiment: Experiment = {

		withKillSwitch(isOn: ExperimentSpec<T>['isOn']): Experiment {
			state = setKillSwitch(state, isOn)

			return experiment
		},

		withCohortPicker(cohortPicker: ExperimentSpec<T>['cohortPicker']): Experiment {
			state = setCohortPicker(state, cohortPicker)

			return experiment
		},

		withRequirement(f: ExperimentSpec<T>['isOn']): Experiment {
			throw new Error('NIMP')
			//return experiment
		},

		createTouchpoint(key: string): any {
			throw new Error('NIMP')
		},

		resolve(): Promise<ResolvedExperiment> {
			return getPromisedResult(state)
		},

		resolveSync(): ResolvedExperiment | undefined {
			return state.result
		},
	}

	return experiment
}
