import { Enum } from 'typescript-string-enums'

/////////////////////

const MonsterRank = Enum(
	'common',
	'elite',
	'boss',
)
type MonsterRank = Enum<typeof MonsterRank> // eslint-disable-line no-redeclare

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
