import { LIB, SCHEMA_VERSION } from '../consts'

import {
	NodeType,
	CheckedNode,
	Node,
	Document,
} from '../types'

interface CommonOptions {
	id?: string
	classes?: string[]
}

interface Builder {
	addClass(...classes: string[]): Builder
	addHints(hints: { [k: string]: any }): Builder

	pushText(str: string): Builder
	pushRawNode(node: Node, options?: CommonOptions): Builder
	pushNode(node: Node, options?: CommonOptions): Builder

	pushInlineFragment(str: string, options?: CommonOptions): Builder
	pushBlockFragment(str: string, options?: CommonOptions): Builder
	pushStrong(str: string, options?: CommonOptions): Builder
	pushWeak(str: string, options?: CommonOptions): Builder
	pushHeading(str: string, options?: CommonOptions): Builder
	pushHorizontalRule(): Builder
	pushLineBreak(): Builder

	pushKeyValue(key: Node | string, value: Node | string, options?: CommonOptions): Builder

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
		addHints,

		pushText,
		pushRawNode,
		pushNode,

		pushInlineFragment,
		pushBlockFragment,
		pushStrong,
		pushWeak,
		pushHeading,
		pushHorizontalRule,
		pushLineBreak,

		pushKeyValue,

		done,
	}

	let sub_id = 0

	function addClass(...classes: string[]): Builder {
		$node.$classes.push(...classes)
		return builder
	}

	function addHints(hints: { [k: string]: any }): Builder {
		$node.$hints = {
			...$node.$hints,
			...hints,
		}
		return builder
	}

	function pushText(str: string): Builder {
		$node.$content += str
		return builder
	}


	function _buildAndPush(builder: Builder, str: string, options: CommonOptions = {}) {
		options = {
			classes: [],
			...options,
		}
		const node = builder
			.pushText(str)
			.addClass(...options.classes!)
			.done()
		delete options.classes

		return pushNode(node, options)
	}

	// nothing is added in content
	// useful for
	// 1. lists
	// 2. manual stuff
	function pushRawNode(node: Node, options: CommonOptions = {}): Builder {
		const id = options.id || ('000' + ++sub_id).slice(-4)
		$node.$sub[id] = node
		if (options.classes)
			$node.$classes.push(...options.classes)
		return builder
	}

	// node ref is auto added into content
	function pushNode(node: Node, options: CommonOptions = {}): Builder {
		const id = options.id || ('000' + ++sub_id).slice(-4)
		$node.$content += `{{${id}}}`
		return pushRawNode(node, { ...options, id })
	}

	function pushInlineFragment(str: string, options?: CommonOptions): Builder {
		return _buildAndPush(inline_fragment(), str, options)
	}

	function pushBlockFragment(str: string, options?: CommonOptions): Builder {
		return _buildAndPush(block_fragment(), str, options)
	}

	function pushStrong(str: string, options?: CommonOptions): Builder {
		return _buildAndPush(strong(), str, options)
	}

	function pushWeak(str: string, options?: CommonOptions): Builder {
		return _buildAndPush(weak(), str, options)
	}

	function pushHeading(str: string, options?: CommonOptions): Builder {
		return _buildAndPush(heading(), str, options)
	}

	function pushHorizontalRule(): Builder {
		$node.$content += '{{hr}}'
		return builder
	}

	function pushLineBreak(): Builder {
		$node.$content += '{{br}}'
		return builder
	}

	function pushKeyValue(key: Node | string, value: Node | string, options: CommonOptions = {}): Builder {
		if ($node.$type !== NodeType.ol && $node.$type !== NodeType.ul)
			throw new Error(`${LIB}: Key/value is intended to be used in a ol/ul only!`)

		options = {
			classes: [],
			...options,
		}
		const kv_node: Node = key_value(key, value)
			.addClass(...options.classes!)
			.done()
		delete options.classes

		return pushRawNode(kv_node, options)
	}

	function done(): CheckedNode {
		return $node
	}

	return builder
}

function inline_fragment(): Builder {
	return create(NodeType.inline_fragment)
}
function block_fragment(): Builder {
	return create(NodeType.block_fragment)
}

function heading(): Builder {
	return create(NodeType.heading)
}

function strong(): Builder {
	return create(NodeType.strong)
}

function weak(): Builder {
	return create(NodeType.weak)
}

function ordered_list(): Builder {
	return create(NodeType.ol)
}

function unordered_list(): Builder {
	return create(NodeType.ul)
}

function key_value(key: Node | string, value: Node | string): Builder {
	const key_node: Node = typeof key === 'string'
		? inline_fragment().pushText(key).done()
		: key

	const value_node: Node = typeof value === 'string'
		? inline_fragment().pushText(value).done()
		: value

	return inline_fragment()
		.pushNode(key_node, { id: 'key' })
		.pushText(': ')
		.pushNode(value_node, { id: 'value' })
}

export {
	NodeType,
	Document,
	Builder,

	create,

	inline_fragment,
	block_fragment,
	heading,
	strong,
	weak,
	ordered_list,
	unordered_list,
	key_value,
}
