import { LIB_ID as LIB, SCHEMA_VERSION } from './consts'

import {
	NodeType,
	CheckedNode,
	Node,
	Document,
} from './types'


interface Builder {
	addClass(...classes: string[]): Builder
	pushText(str: string): Builder
	pushStrong(str: string, id?: string): Builder
	pushEmphasized(str: string, id?: string): Builder
	pushRawNode(node: Node, id?: string): Builder
	pushNode(node: Node, id?: string): Builder
	pushLineBreak(): Builder
	pushHorizontalRule(): Builder
	done(): CheckedNode
}


function create($type: NodeType): Builder {

	const $node: CheckedNode = {
		$v: SCHEMA_VERSION,
		$type,
		$classes: [],
		$content: '',
		$sub: {},
		$hints: {},
	}

	const builder: Builder = {
		addClass,
		pushText,
		pushStrong,
		pushEmphasized,
		pushRawNode,
		pushNode,
		pushLineBreak,
		pushHorizontalRule,
		done,
	}

	let sub_id = 0

	function addClass(...classes: string[]): Builder {
		$node.$classes.push(...classes)
		return builder
	}

	function pushText(str: string): Builder {
		$node.$content += str
		return builder
	}

	function pushRawNode(node: Node, id: string): Builder {
		$node.$sub[id] = node
		return builder
	}

	function pushNode(node: Node, id?: string): Builder {
		id = id || ('s' + ++sub_id)
		$node.$content += `{{${id}}}`
		return pushRawNode(node, id)
	}

	function pushStrong(str: string, id?: string): Builder {
		const node = strong()
			.pushText(str)
			.done()

		return pushNode(node, id)
	}

	function pushEmphasized(str: string, id?: string): Builder {
		const node = emphasized()
			.pushText(str)
			.done()

		return pushNode(node, id)
	}

	function pushLineBreak(): Builder {
		$node.$content += '{{br}}'
		return builder
	}

	function pushHorizontalRule(): Builder {
		$node.$content += '{{hr}}'
		return builder
	}

	function done(): CheckedNode {
		return $node
	}

	return builder
}

function section(): Builder {
	return create(NodeType.section)
}

function heading(): Builder {
	return create(NodeType.heading)
}

function strong(): Builder {
	return create(NodeType.strong)
}

function emphasized(): Builder {
	return create(NodeType.em)
}

function span(): Builder {
	return create(NodeType.span)
}

function ordered_list(): Builder {
	return create(NodeType.ol)
}

function unordered_list(): Builder {
	return create(NodeType.ul)
}

export {
	NodeType,
	Document,
	Builder,

	create,

	section,
	heading,
	span,
	ordered_list,
	unordered_list,
}
