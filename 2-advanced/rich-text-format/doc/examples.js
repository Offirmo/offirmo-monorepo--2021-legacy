const RichText = require('..')

export const DEMO_TYPES = {
	$type: 'fragment',
	$classes: [],
	$content: 'horizontal rule:{{hr}}Heading:{{heading}}Some text:{{br}}{{text}}{{br}}{{strong}}{{br}}{{em}}{{br}}Unordered list:{{ul}}Ordered list:{{ol}}More text.',
	$sub: {
		heading: {
			$type: 'heading',
			$content: 'heading',
		},
		text: {
			$type: 'span',
			$content: 'normal',
		},
		strong: {
			$type: 'strong',
			$content: 'strong',
		},
		em: {
			$type: 'em',
			$content: 'em(phasis)',
		},
		ul: {
			$type: 'ul',
			$sub: {
				2: {$type: 'span', $content: 'ul #2'},
				1: {$type: 'span', $content: 'ul #1'},
				3: {$type: 'span', $content: 'ul #3'},
			},
		},
		ol: {
			$type: 'ol',
			$sub: {
				2: {$type: 'span', $content: 'ol #2'},
				1: {$type: 'span', $content: 'ol #1'},
				3: {$type: 'span', $content: 'ol #3'},
			},
		},
	},
}

export const WEAPON_01_NAME = {
	$classes: ['item__name', 'item-weapon-name'],
	$content: '{{qualifier2|Capitalize}} {{qualifier1|Capitalize}} {{base|Capitalize}}',
	$sub: {
		qualifier2: {
			$type: 'span',
			$content: 'warfield king’s',
		},
		qualifier1: {
			$type: 'span',
			$content: 'onyx',
		},
		base: {
			$type: 'span',
			$content: 'longsword',
		},
	},
}

export const WEAPON_01 = {
	$type: 'span',
	$classes: ['item', 'item-weapon', 'item--quality--legendary'],
	$content: '{{weapon_name}} {{enhancement}}',
	$sub: {
		weapon_name: WEAPON_01_NAME,
		enhancement: {
			$type: 'span',
			$classes: ['item--enhancement'],
			$content: '+3',
		},
	},
}

export const PLACE_01 = {
	$type: 'span',
	$classes: ['place'],
	$content: 'the country of {{name}}',
	$sub: {
		name: {
			$classes: ['place-name'],
			$content: 'Foo',
		}
	},
}

export const NPC_01 = {
	$type: 'span',
	$classes: ['person', 'npc', 'monster--rank--boss'],
	$content: 'John Smith',
}

export const MSG_01 = {
	$v: 1,
	$type: 'fragment',
	$content: 'You are in {{place}}. You meet {{npc}}.{{br}}He gives you a {{item}}.{{hr}}',
	$sub: {
		place: PLACE_01,
		npc: NPC_01,
		item: WEAPON_01,
	},
}

export const MSG_02 = {
	$v: 1,
	$type: 'ol',
	$sub: {
		1: WEAPON_01,
		2: PLACE_01,
		3: NPC_01
	},
}

export const MSG_03 = RichText.fragment()
	.pushText(''
		+ 'Great sages prophetized your coming,{{br}}'
		+ 'commoners are waiting for their hero{{br}}'
		+ 'and kings are trembling from fear of change...{{br}}'
		+ '…undoubtly, you’ll make a name in this world and fulfill your destiny!{{br}}'
	)
	.pushStrong('A great saga just started.')
	.pushText('{{br}}loot:')
	.pushNode(MSG_02, 'loot')
	.done()
