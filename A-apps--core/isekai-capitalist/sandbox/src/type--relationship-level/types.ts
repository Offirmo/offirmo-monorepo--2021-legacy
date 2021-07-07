/* Classic RPG RelationshipLevel levels
 */
import { Enum } from 'typescript-string-enums'

export const RelationshipLevel = Enum(
	'strangers',

	'introduced',
	'acquaintances',
	'friends',
	'friendsⵧgood',

	'friendsⵧbest',
	'romantic',
	'baseⵧ1',
	'baseⵧ2',
	'baseⵧ3',
)
export type RelationshipLevel = Enum<typeof RelationshipLevel> // eslint-disable-line no-redeclare
