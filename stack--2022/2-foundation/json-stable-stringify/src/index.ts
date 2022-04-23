
type Node = Parameters<JSON['stringify']>[0]

interface Options {
	replacer: (key: string, value: any) => any // cf. 2nd param of JSON.stringify
	space: Parameters<JSON['stringify']>[2]
	cycles: boolean
	cmp: never // TODO
}

export default function json_stable_stringify(
	obj: Node,
	{
		replacer = (key: string, value: any) => value,
		space = '',
		cycles = false,
		cmp = null
	}: Options) {
	if (typeof _space === 'number')
		space = Array(_space + 1).join(' ')
	/*
	const cmp = opts.cmp && (function (f) {
		return function (node) {
			return function (a, b) {
				const aobj = { key: a, value: node[a] };
				const bobj = { key: b, value: node[b] };
				return f(aobj, bobj);
			};
		};
	})(opts.cmp);*/

	const seen = [] as Node[];
	function _stringify (parent: Node, key: string, node: Node, level: number) {
		const indent = space ? ('\n' + new Array(level + 1).join(space as string)) : '';
		const colonSeparator = space ? ': ' : ':';

		if (node && node.toJSON && typeof node.toJSON === 'function') {
			node = node.toJSON();
		}

		node = replacer.call(parent, key, node);

		if (node === undefined) {
			return;
		}
		if (typeof node !== 'object' || node === null) {
			return JSON.stringify(node);
		}
		if (Array.isArray(node)) {
			const out = [];
			for (const i = 0; i < node.length; i++) {
				const item = _stringify(node, i, node[i], level+1) || JSON.stringify(null);
				out.push(indent + space + item);
			}
			return '[' + out.join(',') + indent + ']';
		}
		else {
			if (seen.indexOf(node) !== -1) {
				if (cycles) return JSON.stringify('__cycle__');
				throw new TypeError('Converting circular structure to JSON');
			}
			else seen.push(node);

			const keys = Object.keys(node).sort(/*cmp && cmp(node)*/);
			const out = [];
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const value = stringify(node, key, node[key], level+1);

				if(!value) continue;

				const keyValue = JSON.stringify(key)
					+ colonSeparator
					+ value;
				;
				out.push(indent + space + keyValue);
			}
			seen.splice(seen.indexOf(node), 1);
			return '{' + out.join(',') + indent + '}';
		}
	}

	return _stringify({ '': obj }, '', obj, 0);
}
