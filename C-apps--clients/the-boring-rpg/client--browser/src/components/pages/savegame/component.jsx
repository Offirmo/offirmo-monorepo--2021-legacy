import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import fetch_inject from 'fetch-inject'

import get_game_instance from '../../../services/game-instance-browser'
import './index.css'

const ACE_BASE_PATH = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.1/'
let ↆace = null
function ↆensureACE() {
	if (!ↆace) {
		console.log('injecting ACE editor…')
		ↆace = fetch_inject([`${ACE_BASE_PATH}/ace.js`])
			.then(() => {
				console.log('ACE injected ✅')
				return window.ace
			})
			.then(ace => {
				// https://github.com/ajaxorg/ace/wiki/Configuring-Ace
				ace.config.set('basePath', ACE_BASE_PATH)

				// TODO maybe https://github.com/ajaxorg/ace/wiki/Syntax-validation
				return ace
			})
	}

	return ↆace
}


export default class PageSavegameEditorView extends Component {
	static propTypes = {
		initial_data: PropTypes.object.isRequired,
		navigate_home: PropTypes.func.isRequired,
	}
	editor = null
	initial_revision = null

	get_formatted_ace_data = () => {
		const { initial_data } = this.props
		this.initial_revision = initial_data.u_state.revision

		return JSON.stringify(
			initial_data,
			null,
			3,
		)
	}

	on_save = () => {
		if (!this.editor) return

		try {
			const data = JSON.parse(this.editor.getValue())
			const { initial_data } = this.props
			console.log('Replacing current data =', initial_data)
			if (data.u_state.revision === initial_data.u_state.revision)
				data.u_state.revision = initial_data.u_state.revision + 1
			get_game_instance().commands.set(data)
		}
		catch (err) {
			window.alert('Save failed (invalid JSON?): ' + err)
		}
	}

	on_reset = () => {
		if (!window.confirm(''
+ '💀 Do you really really want to reset your savegame, '
+ 'loose all progression and start over? '
+ 'This will also reset your cloud game if you have one.',
		))
			return

		get_game_instance().model.reset()

		this.props.navigate_home()
	}

	componentDidMount() {
		//console.log('Savegame did mount')
		ↆensureACE()
			.then(ace => {
				const editor = ace.edit('ace-editor')
				if (!editor) return // TODO report?
				this.editor = editor

				editor.setTheme('ace/theme/monokai')
				editor.session.setMode('ace/mode/json')
				editor.renderer.setOption({
					vScrollBarAlwaysVisible: true,
				})
				editor.setOption({
					tabSize: 3,
				})
				editor.setValue(this.get_formatted_ace_data())

				// https://stackoverflow.com/questions/12823456/programmatically-fold-code-in-ace-editor#comment17377281_12840753
				setTimeout(/*XXX*/() => {
					editor.session.foldAll()
					editor.session.unfold(1)
				}, 500)
				// or ?
				// https://stackoverflow.com/a/37796568/587407
				// editor.renderer.on('afterRender', function() { ... })
			})
	}

	componentWillUnmount() {
		if (!this.editor) return

		//console.log('cleaning ACE editor')
		this.editor.destroy()
		this.editor = null
	}

	render = () => {
		if (window.oᐧextra.flagꓽdebug_render) console.log('🔄 PageSavegameEditorView')

		return (
			<div className="o⋄top-container o⋄paddingꘌnone page--savegame">
				<div className="o⋄flex--directionꘌrow o⋄paddingꘌmedium">
					<h2>Savegame editor</h2>
					<button onClick={this.props.navigate_home}>Back to game</button>
					{ /* <button onClick={this.onRefresh}>Refresh</button> */ }
					<button onClick={this.on_save}>💀 Save changes</button>
					<button onClick={this.on_reset}>💀 Reset</button>
				</div>
				<div id="ace-editor" className="o⋄top-container">{this.get_formatted_ace_data()}</div>
			</div>
		)
	}
}
