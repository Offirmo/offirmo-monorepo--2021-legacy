import {Cohort, Feedback, Requirement, ResolvedExperiment} from '../types';
import { Experiment } from './types';


//import EventEmitter from 'emittery'

/////////////////////

interface ExperimentSpec<T extends Object> {
	key: string

	isOn?: (params: T) => Promise<boolean>,
	cohortPicker?: (params: T) => Promise<Cohort>,
	requirements: Requirement<T>[]

	params: Partial<T>
}

/////////////////////

export function createExperiment<T>(key: string): Experiment {
	console.log('creating experiment', key)

	const feedback: Feedback[] = []

	const spec: ExperimentSpec<T> = {
		key,
		requirements: [],
		params: {},
	}

	let experiment: Experiment = {

		withKillSwitch(isOn: ExperimentSpec<T>['isOn']): Experiment {
			if (spec.isOn)
				throw new Error('TODO')

			spec.isOn = isOn

			return experiment
		},

		withCohortPicker(f: ExperimentSpec<T>['cohortPicker']): Experiment {
			throw new Error('NIMP')
			//return experiment
		},

		withRequirement(f: ExperimentSpec<T>['isOn']): Experiment {
			throw new Error('NIMP')
			//return experiment
		},

		createTouchpoint(key: string): any {
			throw new Error('NIMP')
		},

		resolve(): Promise<ResolvedExperiment> {
			throw new Error('NIMP')
		},
	}

	return experiment
}
