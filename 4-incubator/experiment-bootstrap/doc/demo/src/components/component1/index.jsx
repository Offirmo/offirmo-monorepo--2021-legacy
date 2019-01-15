import React, {Component} from 'react'
import Loadable from 'react-loadable'

import { createExperiment, Cohort } from '../../../../../src'
import Loader from '../loader'

const trivialExperiment = createExperiment('KERBAL-723_trivial')
	.withCohortPicker(() => Cohort['control'])


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
		const { shouldRun, cohort } = trivialExperiment.resolveSync()

		/*const { shouldRun: fundleShouldRun } = fundleTouchpoint.resolve();
     const { shouldRun: megatronShouldRun } = megatronTouchpoint.resolve();

     const copy = fundleShouldRun
       ? 'Some better written critical info'
       : 'Some boring info';

     const className = fundleShouldRun ? 'c1b' : 'c1';

     const extraCta = megatronShouldRun ? (
       <button>Try Confluence!</button>
     ) : null;
 */
		const copy = shouldRun
			? 'Some better info'
			: 'Some boring info';

		const extraCta = shouldRun
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
