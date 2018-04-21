import React from 'react'

import { with_game_instance } from '../../context/game-instance-provider'


class ExportSavegameBase extends React.Component {

	componentWillMount () {
		console.info('~~ ExportSavegameBase componentWillMount')
	}

	render() {
		const { instance } = this.props
		const state = instance.get_latest_state()


		return (
			<div className='page page--export_savegame'>
				<h2>Your savegame</h2>
				<p>copy-paste it to safety</p>
				<pre className='export_savegame'>
					{JSON.stringify(state, null, 3)}
				</pre>
			</div>
		)
	}
}

const ExportSavegame = with_game_instance(ExportSavegameBase)

export {
	ExportSavegame,
}
