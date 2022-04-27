import { Immutable } from '@offirmo-private/ts-types'

type Key = string | number
type Node = Parameters<JSON['stringify']>[0]

interface Options {
	replacer: (this: Immutable<Node>, key: Key, value: Immutable<Node>) => Immutable<Node> // cf. 2nd param of JSON.stringify
	indent: Parameters<JSON['stringify']>[2]
	cmp: Function // comparison function generator for sorting object's keys

	// DEBUG
	cycles: boolean // if true, don't throw on circular refs but stringify them as "__cycle__"
}

export default function json_stable_stringify(
	obj: Immutable<Node>,
	{
		replacer = (key, value) => value,
		indent = '',
		cycles = false,
		cmp = () => {},
	}: Immutable<Partial<Options>> = {},
): ReturnType<typeof JSON['stringify']> | undefined {
	if (typeof indent === 'number')
		indent = Array(indent + 1).join(' ')

	/*
	const cmp = opts.cmp && (function (f) {
		return function (node) {
			return function (a, b) {
				const aobj = { key: a, value: node[a] }
				const bobj = { key: b, value: node[b] }
				return f(aobj, bobj)
			}
		}
	})(opts.cmp)*/

	function _stringify (parent: Node, key: Key, node: Node, depth: number, encountered_nodes: Immutable<Set<Node>>): ReturnType<typeof JSON['stringify']> | undefined {
		const current_indent = indent ? ('\n' + new Array(depth + 1).join(indent as string)) : ''
		const colonSeparator = indent ? ': ' : ':'

		if (node && node.toJSON && typeof node.toJSON === 'function') {
			node = node.toJSON()
		}

		node = replacer.call(parent, key, node)

		const is_primitive_type = typeof node !== 'object' && typeof node !== 'function'
		if (is_primitive_type || node === null || typeof node === 'function') {
			return JSON.stringify(node)
		}

		if (encountered_nodes.has(node)) {
			if (cycles)
				return JSON.stringify('__cycle__')

			throw new TypeError('Converting circular structure to JSON')
		}
		encountered_nodes = new Set([...Array.from(encountered_nodes as any), node])

		if (Array.isArray(node)) {
			const out: string[] = []
			for (let i = 0; i < node.length; i++) {
				const item = _stringify(node, i, node[i], depth+1, encountered_nodes) || JSON.stringify(null)
				out.push(current_indent + indent + item)
			}
			return '[' + out.join(',') + current_indent + ']'
		}

		const proto = Object.getPrototypeOf(obj)
		switch (proto?.constructor?.name) {
			// all primitives that can be an Object
			case 'String':
			case 'Number':
			case 'Boolean':
				return JSON.stringify(node)
			default:
				break
		}

		// TODO test numeric keys
		const keys: Key[] = Object.keys(node).sort(/*cmp && cmp(node)*/)
		const out: string[] = []
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i]!
			const value = _stringify(node, key, node[key], depth+1, encountered_nodes)

			if(!value) continue

			const keyValue = JSON.stringify(key)
				+ colonSeparator
				+ value

			out.push(current_indent + indent + keyValue)
		}
		return '{' + out.join(',') + current_indent + '}'
	}

	return _stringify({ '': obj }, '', obj, 0, new Set())
}
