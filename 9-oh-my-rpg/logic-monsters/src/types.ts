import { Enum } from 'typescript-string-enums'

//import { Item, InventorySlot, ItemQuality } from '@oh-my-rpg/definitions'

/////////////////////

const MonsterRank = Enum(
	'common',
	'elite',
	'boss',
)
type MonsterRank = Enum<typeof MonsterRank>

// TODO property, etc...

///////

interface Monster {
	name: string
	level: number
	rank: MonsterRank
	possible_emoji: string
}


/////////////////////

export {
	MonsterRank,
	Monster,
}

/////////////////////
