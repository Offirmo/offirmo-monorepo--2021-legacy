
import { Requirement, ResolvedExperiment } from '../types'
import { ExperimentSpec } from '../experiment'

interface Experiment<T> {
	// callable only during spec phase
	withKillSwitch: (isOn: ExperimentSpec<T>['isOn']) => Experiment<T>
	withCohortPicker: (cohortPicker: ExperimentSpec<T>['cohortPicker']) => Experiment<T>
	withRequirement: (r: Requirement<T>) => Experiment<T>
	build: () => Experiment<T> // TODO rename? endSpec()?

	// callable only after spec phase
	setInfos: (infos: Partial<T>) => Experiment<T>

	createTouchpoint: (key: string) => Experiment<T>

	resolve: () => Promise<ResolvedExperiment>
	resolveSync: () => ResolvedExperiment // TODO rename? getResolvedSync()?
}

export {
	Experiment
}
