import React from 'react'
import PropTypes from 'prop-types'


import './index.css'


export default class SocialPanelView extends React.Component {
	static propTypes = {
	}

	render() {
		console.log('🔄 SocialPanelView')

		return (
			<div className={'tbrpg-panel tbrpg-panel--achievements o⋄flex--column'}>
				<div className='panel-top-content o⋄flex-element--nogrow o⋄text-align⁚center'>
					Social features will be here one day.<br />
					<a href="https://linktr.ee/theboringrpg" target="_blank" rel="noopener noreferrer">Please encourage the author if you want to see them faster!</a>
				</div>
			</div>
		)
	}
}
