import { LIB, SCHEMA_VERSION } from './consts'

import {
	NodeType,
	CheckedNode,
	Node,
} from './types'


function normalize_node($raw_node: Readonly<Node>): CheckedNode {
	const {
		$v = 1,
		$type = NodeType.inline_fragment,
		$classes = [],
		$content = '',
		$sub = {},
		$hints = {},
	} = $raw_node

	// TODO migration
	if ($v !== SCHEMA_VERSION)
		throw new Error(`${LIB}: unknown schema version "${$v}"!`)

	// TODO validation

	const $node: CheckedNode = {
		$v,
		$type,
		$classes,
		$content,
		$sub,
		$hints,
	}

	return $node
}

export {
	normalize_node,
}
