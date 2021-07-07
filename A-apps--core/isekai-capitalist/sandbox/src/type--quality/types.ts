/* Classic RPG quality levels
 */
import { Enum } from 'typescript-string-enums'

export const Quality = Enum(
	'poor', // very low

	'common',
	'uncommon',
	'rare',
	'epic',
	'legendary',

	'artifact', // very special
)
export type Quality = Enum<typeof Quality> // eslint-disable-line no-redeclare
