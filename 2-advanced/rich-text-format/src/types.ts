import { Enum } from 'typescript-string-enums'

///////

const NodeType = Enum(
	// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block
	// display: inline
	'span',
	'strong',
	'em',

	// "block"
	'heading',
	'hr',
	'ol',
	'ul',

	// internally used, don't bother
	'li',

	// special
	'br',
	'fragment',
)
type NodeType = Enum<typeof NodeType>


interface CheckedNode {
	$v: number // schema version
	$type: NodeType
	$classes: string[]
	$content: string
	// sub-nodes referenced in she content
	$sub: {
		[id: string]: Partial<CheckedNode>
	}
	// hints for renderers. May or may not be used.
	$hints: {
		[k: string]: any
	}
}

type Node = Partial<CheckedNode>

///////

// aliases
type Document = Node

////////////

export {
	NodeType,
	CheckedNode,
	Node,

	Document,
}
