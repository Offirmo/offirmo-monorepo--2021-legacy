import { Enum } from 'typescript-string-enums'

///////

const NodeType = Enum(
	// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block

	// display "inline"
	'span',
	'strong',
	'em',

	// display "block"
	'heading',
	'hr',
	'ol',
	'ul',

	// internally used, don't mind
	'li',

	// special
	'br',
	'inline_fragment',
	'block_fragment',
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
