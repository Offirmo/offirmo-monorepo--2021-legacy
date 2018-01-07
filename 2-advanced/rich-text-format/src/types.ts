import { Enum } from 'typescript-string-enums'

///////

const NodeType = Enum(
	'span',
	'br',
	'hr',
	'ol',
	'ul',
	'li',
	'strong',
	'em',
	'section',
	'heading',
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
