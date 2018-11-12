import { Enum } from 'typescript-string-enums'

///////

const NodeType = Enum(
	// https://stackoverflow.com/questions/9189810/css-display-inline-vs-inline-block

	// display "inline"
	'span', // TODO remove?
	'strong',
	'weak', // opposite of strong ;)
	'em', // TODO semantic difference with strong?

	// display "block"
	'heading',
	'hr',
	'ol',
	'ul',

	// special
	'br',
	'inline_fragment',
	'block_fragment',

	// internally used, don't mind, don't use directly
	'li',
)
type NodeType = Enum<typeof NodeType> // eslint-disable-line no-redeclare


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
