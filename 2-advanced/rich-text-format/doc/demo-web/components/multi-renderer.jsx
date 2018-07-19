import React, { Component } from 'react';

import ErrorBoundary from '@offirmo/react-error-boundary'

const RichText = require('../../../dist/src.es7.cjs')
import rich_text_to_react from '../services/rich_text_to_react'

const RichTextView = ({doc, mode = 'to_html'}) => {
	switch(mode) {
		case 'to_text':
			return <pre>{RichText.to_text(doc)}</pre>

		case 'to_html':
			return <div className="o⋄rich-text" dangerouslySetInnerHTML={{ __html: RichText.to_html(doc) }} />

		case 'to_react':
			return <div className="o⋄rich-text">{rich_text_to_react(doc)}</div>

		default:
			return `<RichTextView /> unknown mode "${mode}"!`
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

				<div>
					raw txt<br />
					<ErrorBoundary name={'to_text'}>
						<RichTextView doc={doc} mode='to_text' />
					</ErrorBoundary>
				</div>

				<div>
					HTML<br />
					<ErrorBoundary name={'to_html'}>
						<RichTextView doc={doc} mode='to_html' />
					</ErrorBoundary>
				</div>

				<div>
					React<br />
					<ErrorBoundary name={'to_react'}>
						<RichTextView doc={doc} mode='to_react' />
					</ErrorBoundary>
				</div>
			</div>
		)
	}
}
