const RichText = require('..')

/////// parts ///////

export const SUB_UL_ITEMS = {
	2: {$type: 'span', $content: 'ul #2'},
	1: {$type: 'span', $content: 'ul #1'},
	3: {$type: 'span', $content: 'ul #3'},
}

export const SUB_UL_KEY_VALUE_PAIRS = {
	1: {
		$type: 'inline_fragment',
		$content: `{{key}}: {{value}}`,
		$sub: {
			key: {
				$content: 'level',
			},
			value: {
				$content: '12',
			},
		},
	},
	2: {
		$type: 'inline_fragment',
		$content: `{{key}}: {{value}}`,
		$sub: {
			key: {
				$content: 'health',
			},
			value: {
				$content: '87',
			},
		},
	},
	3: {
		$type: 'inline_fragment',
		$content: `{{key}}: {{value}}`,
		$sub: {
			key: {
				$content: 'mana',
			},
			value: {
				$content: '118',
			},
		},
	},
}

export const DOC_WEAPON_01_NAME = {
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

export const DOC_WEAPON_01 = {
	$type: 'span',
	$classes: ['item', 'item-weapon', 'item--quality--legendary'],
	$content: '{{weapon_name}} {{enhancement}}',
	$sub: {
		weapon_name: DOC_WEAPON_01_NAME,
		enhancement: {
			$type: 'span',
			$classes: ['item--enhancement'],
			$content: '+3',
		},
	},
	$hints: {
		uuid: '1234',
	}
}

export const DOC_PLACE_01 = {
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

export const DOC_NPC_01 = {
	$type: 'span',
	$classes: ['person', 'npc', 'monster--rank--boss'],
	$content: 'John Smith',
}

export const SUB_UL_ACTIONABLE_ITEMS = {
	1: DOC_WEAPON_01,
	2: DOC_WEAPON_01,
	3: DOC_WEAPON_01,
}

/////// COMPLETE DOCS ///////

export const DOC_DEMO_BASE_TYPES = {
	$type: 'inline_fragment',
	$classes: [],
	$content: '{{fragment1}}{{fragment2}}',
	$sub: {
		fragment1: {
			$type: 'inline_fragment',
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
					$sub: SUB_UL_ITEMS,
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
		},
		fragment2: {
			$type: 'block_fragment',
			$classes: [],
			$content: 'Some text in a block fragment',
		},
	},
}

export const DOC_DEMO_ADVANCED_TYPES = {
	$type: 'inline_fragment',
	$classes: [],
	$content: '{{heading}}Key-value pairs:{{kvdefault}}Actionable items:{{uuid_list}}Done.',
	$sub: {
		heading: {
			$type: 'heading',
			$content: 'Advanced types',
		},
		kvdefault: {
			$type: 'ul',
			$sub: SUB_UL_KEY_VALUE_PAIRS,
			$hints: {
				//key_align: left,
			},
		},
		uuid_list: {
			$type: 'ol',
			$sub: SUB_UL_ACTIONABLE_ITEMS,
			$hints: {
				//key_align: left,
			},
		},
	},
}

export const DOC_DEMO_HINTS = {
	$type: 'inline_fragment',
	$classes: [],
	$content: '{{heading}}link: {{link}}{{br}}List with no bullets:{{list}}Done.',
	$sub: {
		heading: {
			$type: 'heading',
			$content: 'Hints',
		},
		link: {
			$type: 'span',
			$content: 'offirmo’s website',
			$hints: {
				href: 'https://www.offirmo.net',
			},
		},
		list: {
			$type: 'ul',
			$sub: SUB_UL_ITEMS,
			$hints: {
				bullets_style: 'none',
			},
		},
	},
}

export const DOC_DEMO_RPG_01 = {
	$v: 1,
	$type: 'block_fragment',
	$content: 'You are in {{place}}. You meet {{npc}}.{{br}}He gives you a {{item}}.{{hr}}',
	$sub: {
		place: DOC_PLACE_01,
		npc: DOC_NPC_01,
		item: DOC_WEAPON_01,
	},
}

export const DOC_DEMO_RPG_02 = {
	$v: 1,
	$type: 'ol',
	$sub: {
		1: DOC_WEAPON_01,
		2: DOC_PLACE_01,
		3: DOC_NPC_01
	},
}

export const DOC_DEMO_RPG_03 = RichText.block_fragment()
	.pushText(''
		+ 'Great sages prophetized your coming,{{br}}'
		+ 'commoners are waiting for their hero{{br}}'
		+ 'and kings are trembling from fear of change...{{br}}'
		+ '…undoubtly, you’ll make a name in this world and fulfill your destiny!{{br}}'
	)
	.pushStrong('A great saga just started.')
	.pushText('{{br}}loot:')
	.pushNode(DOC_DEMO_RPG_02, 'loot')
	.done()
