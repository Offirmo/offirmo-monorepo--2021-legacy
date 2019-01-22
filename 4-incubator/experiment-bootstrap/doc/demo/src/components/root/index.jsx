import React, {Component, Fragment} from 'react';

import C1 from '../component1';
import C2 from '../component2';
import C3 from '../component3';

export default class Root extends Component {
	render() {
		return (
			<Fragment>
				Hello, world!
				{<C1/>}
				{<C2/>}
				{<C3/>}
			</Fragment>
		);
	}
}
