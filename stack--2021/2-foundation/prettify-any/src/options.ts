
import { Immutable } from '@offirmo-private/ts-types'

import { Options } from './types'
import {
	DEFAULTS_PRETTIFY_OPTIONS,
	DEFAULTS_STYLE_OPTIONS,
	DEFAULTS_STYLIZE_OPTIONS__NONE,
} from './options--compatible'
import {
	get_stylize_options_ansi
} from './options--ansi'
import {
	get_lib__chalk,
} from './injectable-lib--chalk'



////////////////////////////////////////////////////////////////////////////////////

export function get_default_options(): Options {
	return {
		...DEFAULTS_STYLE_OPTIONS,
		...DEFAULTS_PRETTIFY_OPTIONS,
		...DEFAULTS_STYLIZE_OPTIONS__NONE,
		...(get_lib__chalk() && get_stylize_options_ansi(get_lib__chalk())),
	}
}

export function get_options(options: Immutable<Partial<Options>> = {}): Options {
	return {
		...get_default_options(),
		...options,
	}
}
