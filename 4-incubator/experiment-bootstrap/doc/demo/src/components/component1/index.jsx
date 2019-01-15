// @flow

import React, {Component} from 'react';

import { createExperiment } from '../../../../../src'

const trivialExperiment = createExperiment('KERBAL-723_trivial')

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

export default class C1 extends Component {
	render() {

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
		const copy = 'Some boring info';

		const className = 'c1';

		const extraCta = null;

		return (
			<div className={className}>
				Component1: {copy}
				{extraCta}
			</div>
		);
	}
}
