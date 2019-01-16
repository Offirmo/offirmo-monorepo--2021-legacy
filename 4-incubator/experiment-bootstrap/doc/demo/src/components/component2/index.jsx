import React, {Component} from 'react'
import Loadable from 'react-loadable'

import {
	createExperiment,
	Cohort,
	ERROR_MSG_MISSING_INFOS,
} from '../../../../../src'

import Loader from '../loader'

const standardExperiment = createExperiment('KERBAL-723/standard')
	.withKillSwitch(() => true)
	.withCohortPicker(() => Cohort['variation'])
	.withRequirement({
		key: 'browser',
		resolver: () => false,
	})
	.withRequirement({
		key: 'admin',
		resolver: () => false,
		/*resolver: ({isAdmin}) => {
			if (typeof isAdmin !== boolean)
				throw new Error(ERROR_MSG_MISSING_INFOS)

			return isAdmin
		},*/
	})

export class C2 extends Component {
	render() {
		const { shouldRun, cohort } = standardExperiment.resolveSync()

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
