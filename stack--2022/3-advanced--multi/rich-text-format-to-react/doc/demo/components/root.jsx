import { Component, Fragment } from 'react'

import MultiRenderer from './multi-renderer'

import { DOC_DEMO_BASE_TYPES, DOC_DEMO_ADVANCED_TYPES, DOC_DEMO_HINTS, DOC_DEMO_RPG_01, DOC_DEMO_RPG_03 } from '../../../../rich-text-format/doc/examples'

const DATA = [
	DOC_DEMO_BASE_TYPES,
	DOC_DEMO_ADVANCED_TYPES,
	DOC_DEMO_HINTS,
	DOC_DEMO_RPG_01,
	DOC_DEMO_RPG_03,
]


export default class Root extends Component {
	state = {
		selected: localStorage.getItem('XOF.richtext.demo.select') || 0,
	}

	select = (n) => {
		this.setState({selected: n})
		localStorage.setItem('XOF.richtext.demo.select', n)
	}

	render() {
		const { selected } = this.state
		const doc = DATA[selected]
		return (
			<Fragment>
				<form action="">
					<fieldset>
						<legend>Select sample data</legend>
						<label>
							<input type="radio" name="sample-data-select"
									 value="0"
									 defaultChecked={selected == 0}
									 onChange={() => this.select(0)}
							/>
							Base types
						</label>
						<label>
							<input type="radio" name="sample-data-select"
									 value="1" defaultChecked={selected == 1}
									 onChange={() => this.select(1)}
									 />
							Advanced types
						</label>
						<label>
							<input type="radio" name="sample-data-select"
										 value="2" defaultChecked={selected == 2}
										 onChange={() => this.select(2)}
							/>
							Hints
						</label>
						<label>
							<input type="radio" name="sample-data-select"
											 value="3" defaultChecked={selected == 3}
											 onChange={() => this.select(3)}
							/>
							RPG1
						</label>
						<label>
							<input type="radio" name="sample-data-select"
									 value="4" defaultChecked={selected == 4}
									 onChange={() => this.select(4)}
							/>
							RPG2
						</label>
					</fieldset>
				</form>

				<MultiRenderer doc={doc} />
			</Fragment>
		)
	}
}
