
import { Requirement, ResolvedExperiment } from '../types'
import { ExperimentSpec } from '../experiment'

interface Experiment<T> {
	// callable any time
	onResolved: (callback: (result: ResolvedExperiment) => void) => Experiment<T>,

	// callable only during spec phase
	// TODO Don't throw if later than spec phase!!
	withKillSwitch: (isOn: ExperimentSpec<T>['isOn']) => Experiment<T>
	withCohortPicker: (cohortPicker: ExperimentSpec<T>['cohortPicker']) => Experiment<T>
	withRequirement: (r: Requirement<T>) => Experiment<T>
	build: () => Experiment<T> // TODO rename? endSpec()?

	// callable only before resolution is initiated
	onResolutionInitiated: (callback: (experiment: Experiment<T>) => void) => Experiment<T>,

	// callable only after spec phase
	setInfos: (infos: Partial<T>) => Experiment<T>

	createTouchpoint: (key: string) => Experiment<T>

	resolve: () => Promise<ResolvedExperiment>
	getResultSync: () => ResolvedExperiment
}

export {
	Experiment
}
