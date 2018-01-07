import { State } from '@oh-my-rpg/state-meta'

import * as RichText from '@oh-my-rpg/rich-text-format'


function render_meta_infos(metas: {[k: string]: string | number | undefined}): RichText.Document {
	const $doc_list = RichText.unordered_list()

	Object.keys(metas).forEach((prop: string) => {
		$doc_list.pushRawNode(
			RichText.span().pushText(prop + ': ' + metas[prop]).done(),
			prop
		)
	})

	return $doc_list.done()
}


function render_account_info(m: State, extra: {[k: string]: string | number | undefined} = {}): RichText.Document {
	const meta_infos = extra

	meta_infos['internal user id'] = m.uuid
	meta_infos['telemetry allowed'] = String(m.allow_telemetry)
	if (m.email) meta_infos['email'] = m.email

	const $doc = RichText.span()
		.pushText('Account infos:')
		.pushNode(
			render_meta_infos(meta_infos),
			'list'
		)
		.done()

	return $doc
}

export {
	render_account_info,
}
