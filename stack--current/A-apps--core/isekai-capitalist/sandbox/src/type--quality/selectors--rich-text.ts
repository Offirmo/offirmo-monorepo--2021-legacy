import { Immutable } from '@offirmo-private/ts-types'
import * as RichText from '@offirmo-private/rich-text-format'

import { Quality } from './types'


export function get_class__quality(quality: Immutable<Quality>): string {
	return 'quality--' + quality
}
