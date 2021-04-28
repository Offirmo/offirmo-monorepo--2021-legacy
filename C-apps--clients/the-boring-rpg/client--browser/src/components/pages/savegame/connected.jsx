import { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

import View from './component'
import { LS_KEYS } from '../../../services/consts'
import { ROUTES } from '../../../services/routes'


class PageSavegameEditorC1 extends Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
	}
	initial_data = JSON.parse(localStorage.getItem(LS_KEYS.savegame))

	constructor (props) {
		console.info('~~ PageSavegameEditorC1 constructor')
		super(props)

		console.log({
			key: LS_KEYS.savegame,
			data: this.initial_data,
			type: typeof this.initial_data,
		})
	}

	navigate_home = () => {
		this.props.history.push(ROUTES.home)
	}

	componentDidMount() {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 PageSavegameEditorC1 componentDidMount', LS_KEYS.savegame)
		if (this.initial_data.u_state.meta.persistence_id) {
			if (!window.confirm(''
+ '💀 Editing your game will turn off all social features, '
+ 'and your game will no longer be saved in the cloud. '
+ 'You’ll be responsible for backupping your game. '
+ 'Are you sure?',
			))
				return this.navigate_home()
		}

		// TODO mark the game as edited in some safe way
		//this.initial_data.u_state.meta.persistence_id = null // no longer sync with cloud
	}

	render() {
		return (
			<View
				initial_data={this.initial_data}
				navigate_home={this.navigate_home}
			/>
		)
	}
}

const PageSavegameEditorC2 = withRouter(PageSavegameEditorC1)

export default PageSavegameEditorC2
