import { Component } from 'react'

import ErrorBoundary from '@offirmo-private/react-error-boundary'

const RichText = require('../../../../rich-text-format')
import rich_text_to_react from '../services/rich-text-to-react'

const RichTextView = ({doc, mode = 'to_html'}) => {
	switch(mode) {
		case 'to_text':
			return <pre>{RichText.to_text(doc)}</pre>

		case 'to_html':
			return <div dangerouslySetInnerHTML={{ __html: RichText.to_html(doc) }} />

		case 'to_react':
			return rich_text_to_react(doc)

		default:
			return <div>Unknown mode "{mode}"!</div>
	}
}


export default class MultiRenderer extends Component {

	render() {
		const { doc } = this.props
		console.log({doc})
		try {
			RichText.to_debug(doc)
			console.log('to_debug done.')
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
		}
		catch (err) {
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.groupEnd()
			console.warn('XXX doc probably invalid:', err)
		}

		return (
			<div className="multi-renderer">

				<div key="to_text">
					raw txt<br />
					<ErrorBoundary name={'to_text'}>
						<RichTextView doc={doc} mode="to_text" />
					</ErrorBoundary>
				</div>

				<div key="to_html">
					HTML<br />
					<ErrorBoundary name={'to_html'}>
						<RichTextView doc={doc} mode="to_html" />
					</ErrorBoundary>
				</div>

				<div key="to_ract">
					React<br />
					<ErrorBoundary name={'to_react'}>
						<RichTextView key="RTV_to_react" doc={doc} mode="to_react" />
					</ErrorBoundary>
				</div>
			</div>
		)
	}
}
