import React, {Component} from 'react'
import Loadable from 'react-loadable'

import { createExperiment, Cohort } from '../../../../../src'
import Loader from '../loader'

const trivialExperiment = createExperiment('KERBAL-723/trivial')
	//.withKillSwitch(() => true)
	.withCohortPicker(() => Cohort['variation'])


/*
import { isAdmin } from '../../common/experiments/requirements';
import megatronExperiment from '../../common/experiments/groot-777-megatron';
import fundleExperiment from '../../common/experiments/groot-333-fundles';

import './index.css';

const megatronTouchpoint = megatronExperiment.declareTouchpoint({
  touchpointKey: 'component1',
  extraRequirements: {
    admin: isAdmin,
  },
});

const fundleTouchpoint = fundleExperiment.declareTouchpoint({
  touchpointKey: 'component1',
  extraRequirements: {
    admin: isAdmin,
  },
});
*/

export class C1 extends Component {
	render() {
		const { cohort } = trivialExperiment.resolveSync()

		const copy = (cohort === 'variation')
			? 'Some better info'
			: 'Some boring info';

		const extraCta = (cohort === 'variation')
			? <button>New CTA!</button>
			: null;

		return (
			<div className="c1">
				[Component1/{cohort}]
				{copy}
				{extraCta}
			</div>
		);
	}
}

const LC1 = Loadable({
	loader: () => trivialExperiment.resolve().then(() => C1),
	loading: Loader,
});

export default LC1
