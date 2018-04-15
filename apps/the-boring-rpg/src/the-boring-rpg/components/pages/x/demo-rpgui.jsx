import React from 'react'

class RPGUIDemo extends React.Component {

	constructor (props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<div className="rpgui-content rpgui-cursor-default">

				<div className="rpgui-container framed">
					<h1>Inputs</h1>
					<hr />

					<label>Your hero name:</label>
					<input type="text" name="FirstName" value="Bob" placeholder="Hero name" />
					<br/><br/>

					<label>Your hero last name:</label>
					<input type="text" name="FirstName" value="The Destroyer" placeholder="Hero last name" />
					<br /><br />

					<label>Your hero bio:</label>
					<textarea rows="3" cols="50">Bob The Destroyer likes to destroy stuff.</textarea>

					<p>Here is a paragraph.</p>

					<div className="rpgui-container framed-golden">
						<p>This is a golden frame inside.</p>
					</div>
					<label>Golden hr:</label>
					<hr className="golden" />
					<a href="/x"> And this is a link.</a>
				</div>

				<div className="rpgui-container framed-golden">
					<p>This is a golden frame.</p>
					<div className="rpgui-container framed-golden-2">
						<p>This is a golden 2 frame inside.
							<button className="rpgui-button">Hello</button>
							<button className="rpgui-button" disabled>Foo</button>
						</p>
					</div>
				</div>
			</div>
		)
	}
}

export {
	RPGUIDemo,
}
