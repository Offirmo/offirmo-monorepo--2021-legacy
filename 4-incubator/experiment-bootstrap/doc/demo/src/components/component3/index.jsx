import React, {Component} from 'react'
import Loadable from 'react-loadable'

import {
	createExperiment,
	Cohort,
	ERROR_MSG_MISSING_INFOS,
} from '../../../../../src'

import Loader from '../loader'

const standardExperiment = createExperiment('go/advanced')
	.withKillSwitch(() => true)
	.withCohortPicker(() => Cohort['variation'])
	.withRequirement({
		key: 'browser',
		resolver: () => true,
	})
	.withRequirement({
		key: 'admin',
		resolver: ({isAdmin}) => {
			if (typeof isAdmin !== 'boolean')
				throw new Error(ERROR_MSG_MISSING_INFOS)

			return isAdmin
		},
	})
	.build()

export class C extends Component {
	render() {
		const { cohort } = standardExperiment.getResultSync()

		const copy = (cohort === 'variation')
			? 'Some better info'
			: 'Some boring info'

		const extraCta = (cohort === 'variation')
			? <button>New CTA!</button>
			: null

		return (
			<div className="c3">
				[Component3/{cohort}]
				{copy}
				{extraCta}
			</div>
		)
	}
}

const LC = Loadable({
	loader: () => {
		standardExperiment.setInfos({isAdmin: true})
		return standardExperiment.resolve().then(() => C)
	},
	loading: Loader,
})

export default LC
