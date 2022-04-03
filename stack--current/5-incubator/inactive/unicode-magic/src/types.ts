
import { Enum } from 'typescript-string-enums'

// tslint:disable-next-line: variable-name
const Gender = Enum(
	'unknown',
	'male',
	'female',
	'neutral',
)
type Gender = Enum<typeof Gender> // eslint-disable-line no-redeclare

// tslint:disable-next-line: variable-name
const Age = Enum(
	'unknown',
	'baby',
	'child',
	'adult',
	'elder',
)
type Age = Enum<typeof Age> // eslint-disable-line no-redeclare

// tslint:disable-next-line: variable-name
const SkinTone = Enum(
	'unknown',
	'yellow',
	'fp1',
	'fp2',
	'fp3',
	'fp4',
	'fp5',
	'white',
	'cream_white',
	'light_brown',
	'brown',
	'dark_brown',
)
type SkinTone = Enum<typeof SkinTone> // eslint-disable-line no-redeclare

// tslint:disable-next-line: variable-name
const HairColor = Enum(
	'unknown',
	'none', // = bald
	'bald',
	'white',
	'blond',
	'red',
	'brown',
	'black',
)
type HairColor = Enum<typeof HairColor> // eslint-disable-line no-redeclare

// tslint:disable-next-line: variable-name
const Feature = Enum(
	'none',
	'bearded',
	'curly_hair',
	'prince',
	'princess',
	'mage',
	// TODO more
)
type Feature = Enum<typeof Feature> // eslint-disable-line no-redeclare

export {
	Gender,
	Age,
	SkinTone,
	HairColor,
	Feature,
}
