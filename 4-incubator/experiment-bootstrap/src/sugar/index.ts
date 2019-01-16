import {Cohort, Feedback, Requirement, ResolvedExperiment} from '../types';
import { Experiment } from './types';
import {
	ExperimentSpec,

	create,
	setKillSwitch,
	setCohortPicker,
	addRequirement,
	initiateResolution,

	getPromisedResult,
	getResultSync,
} from '../experiment'



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

		withRequirement(r: Requirement<T>): Experiment {
			state = addRequirement(state, r)

			return experiment
		},

		createTouchpoint(key: string): any {
			throw new Error('NIMP')
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
