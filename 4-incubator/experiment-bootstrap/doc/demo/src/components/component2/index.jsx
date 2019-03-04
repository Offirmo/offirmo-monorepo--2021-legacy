import React, {Component} from 'react'
import Loadable from 'react-loadable'

import {
	createExperiment,
	Cohort,
	ERROR_MSG_MISSING_INFOS,
} from '../../../../../src'

import Loader from '../loader'

const standardExperiment = createExperiment('go/standard')
	.withKillSwitch(() => true)
	.withCohortPicker(() => Cohort['variation'])
	.withRequirement({
		key: 'browser',
		resolver: () => false,
	})
	.withRequirement({
		key: 'test',
		resolver: () => (new Promise((resolve) => { setTimeout(() => resolve(true), 4000)})),
		//resolver: () => (new Promise(() => {})), // XXX will never resolve
	})

export class C2 extends Component {
	render() {
		const { cohort } = standardExperiment.resolveSync()
		console.log('C2 render', cohort)

		const copy = (cohort === 'variation')
			? 'Some better info'
			: 'Some boring info';

		const extraCta = (cohort === 'variation')
			? <button>New CTA!</button>
			: null;

		return (
			<div className="c2">
				[Component2/{cohort}]
				{copy}
				{extraCta}
			</div>
		);
	}
}

const LC2 = Loadable({
	loader: () => standardExperiment.resolve().then(() => C2),
	loading: Loader,
});

export default LC2
