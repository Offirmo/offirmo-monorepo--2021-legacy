import { Enum } from 'typescript-string-enums'

/////////////////////

const CoinsGain = Enum(
	'none',
	'small',
	'medium',
	'big',
	'huge',
)
type CoinsGain = Enum<typeof CoinsGain> // eslint-disable-line no-redeclare


const AdventureType = Enum(
	'story',
	'fight',
)
type AdventureType = Enum<typeof AdventureType> // eslint-disable-line no-redeclare


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

		// key radix must match item slots
		armor_improvement: boolean
		weapon_improvement: boolean
		armor_or_weapon_improvement: boolean
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
