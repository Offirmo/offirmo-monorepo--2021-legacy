/* Classic RPG RelationshipLevel levels
 */
import { Enum } from 'typescript-string-enums'

export const RelationshipLevel = Enum(
	'strangers',

	// indifferent
	'introduced',
	'acquaintances',

	// positive
	'friends',
	'friendsⵧgood',
	'friendsⵧbest',
	'dating',
	'baseⵧ1',
	'baseⵧ2',
	'baseⵧ3',

	// negative?
)
export type RelationshipLevel = Enum<typeof RelationshipLevel> // eslint-disable-line no-redeclare
