import { Enum } from 'typescript-string-enums'

/////////////////////

const CoinsGain = Enum(
	'lossꘌsmall',
	'lossꘌone',

	'none',

	'gainꘌone',
	'gainꘌsmall',
	'gainꘌmedium',
	'gainꘌbig',
	'gainꘌhuge',
)
type CoinsGain = Enum<typeof CoinsGain> // eslint-disable-line no-redeclare


const AdventureType = Enum(
	'story',
	'fight',
)
type AdventureType = Enum<typeof AdventureType> // eslint-disable-line no-redeclare


// TODO rewrite using an array of gains
interface AdventureArchetype {
	hid: string
	type: AdventureType
	good: boolean
	outcome: {
		// field MUST be:
		// - Attributes
		// - Currencies
		// - Item Slots
		// + some variants resolving to one of the above

		// TODO type more strongly?
		level: boolean

		health: boolean
		mana: boolean
		strength: boolean
		agility: boolean
		charisma: boolean
		wisdom: boolean
		luck: boolean
		random_attribute: boolean
		lowest_attribute: boolean
		class_primary_attribute: boolean
		class_secondary_attribute: boolean

		coin: CoinsGain
		token: number

		armor: boolean
		weapon: boolean
		armor_or_weapon: boolean
		item_spec: null, // TODO

		// key radix must match item slots
		improvementⵧweapon: boolean,
		improvementⵧarmor: boolean,
		improvementⵧarmor_or_weapon: boolean,
	}
}

type OutcomeArchetype = AdventureArchetype['outcome']


/////////////////////

export {
	CoinsGain,
	AdventureType,
	AdventureArchetype,
	OutcomeArchetype,
}

/////////////////////
