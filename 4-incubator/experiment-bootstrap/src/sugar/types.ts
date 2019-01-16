
import { ResolvedExperiment } from '../types'

interface Experiment {
	withKillSwitch: Function,
	withCohortPicker: Function,
	withRequirement: Function,

	createTouchpoint: Function,

	resolve: () => Promise<ResolvedExperiment>

	resolveSync: () => ResolvedExperiment
}

export {
	Experiment
}
