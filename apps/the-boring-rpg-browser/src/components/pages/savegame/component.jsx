import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import fetch_inject from 'fetch-inject'

import './index.css'

const ACE_BASE_PATH = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.1/'
let ace_injected = null

// TODO maybe https://github.com/ajaxorg/ace/wiki/Syntax-validation

export default class Savegame extends Component {
	static propTypes = {
		ls_key: PropTypes.string.isRequired,
		home_url: PropTypes.string.isRequired,
	}

	getCurrentSavegameContent() {
		return JSON.stringify(
			JSON.parse(
				localStorage.getItem(this.props.ls_key)
			),
			null,
			3
		)
	}

	onRefresh = () => {
		if (!this.editor) return

		this.editor.setValue(this.getCurrentSavegameContent())

		// https://stackoverflow.com/questions/12823456/programmatically-fold-code-in-ace-editor#comment17377281_12840753
		setTimeout(() => {
			this.editor.session.foldAll()
			this.editor.session.unfold(1)
		}, 500)

		/* or ?
		https://stackoverflow.com/a/37796568/587407
		editor.renderer.on('afterRender', function() {
    // Your code...
});
		 */
	}

	onSave = () => {
		if (!this.editor) return

		//
		try {
			const data = JSON.parse(this.editor.getValue())
			console.log('Replacing current data =', localStorage.getItem(this.props.ls_key))
			localStorage.setItem(this.props.ls_key, JSON.stringify(data))
		}
		catch (err) {
			window.alert('Invalid JSON, save aborted. ' + err)
		}
	}

	onReset = () => {
		if (!window.confirm('💀 Do you really really want to reset your savegame, loose all progression and start over?'))
			return

		localStorage.removeItem(this.props.ls_key)
		window.location = this.props.home_url
	}

	ensureACE() {
		if (ace_injected)
			return

		console.log('injecting ACE editor…')
		ace_injected = fetch_inject([ `${ACE_BASE_PATH}/ace.js` ])
			.then(() => {
				console.log('ACE injected ✅')
				return window.ace
			})
			.then(ace => {
				// https://github.com/ajaxorg/ace/wiki/Configuring-Ace
				ace.config.set('basePath', ACE_BASE_PATH)


				const editor = window.ace.edit('ace-editor')
				editor.setTheme('ace/theme/monokai')
				editor.session.setMode('ace/mode/json')
				editor.renderer.setOption({
					vScrollBarAlwaysVisible: true,
				})
				editor.setOption({
					tabSize: 3,
				})
				this.editor = editor

				this.onRefresh()

				// for tests
				//window.xxe = editor
			})
	}

	render = () => {
		this.ensureACE()

		return (
			<div className="o⋄top-container o⋄pad⁚0 page--savegame">
				<div className="o⋄flex--row o⋄pad⁚7">
					<h2>Savegame editor</h2>
					<button onClick={() => window.location = this.props.home_url}>Back to game</button>
					<button onClick={this.onRefresh}>Refresh</button>
					<button onClick={this.onSave}>💀 Save changes</button>
					<button onClick={this.onReset}>💀 Reset</button>
				</div>
				<div id="ace-editor" className="o⋄top-container">{this.getCurrentSavegameContent()}</div>
			</div>
		)
	}
}
