import { Immutable } from '@offirmo-private/ts-types'
import { NORMALIZERS, combine_normalizers } from '@offirmo-private/normalize-string'

import { BaseUser, User, PUser } from './types'
import {
	logger,
	deep_equals_stable,
	get_gravatar_url,

	normalize_email_safe,
	normalize_email_reasonable,
	normalize_email_full,
} from '../utils'

////////////////////////////////////

const DEFAULT_ROLES: Immutable<string[]> = []

export function _infer_avatar_url(data: Immutable<BaseUser>): string {
	//return get_gravatar_url(data.usual_email)
	// https://github.com/Kikobeats/unavatar
	return 'https://unavatar.now.sh/' + normalize_email_reasonable(data.raw_email)
}

export function _infer_called(data: Immutable<BaseUser>): string {
	const [ local_part ] = normalize_email_reasonable(data.raw_email).split('@')

	/*console.log({
		1: local_part,
		2: NORMALIZERS.coerce_delimiters_to_space(local_part),
		3: NORMALIZERS.coerce_blanks_to_single_spaces(
			NORMALIZERS.coerce_delimiters_to_space(local_part)
		)
	})*/
	return NORMALIZERS.coerce_blanks_to_single_spaces(
		NORMALIZERS.coerce_delimiters_to_space(local_part)
	).split(' ').map(s => NORMALIZERS.capitalize(s)).join(' ')
}

// separate since can be called on explicit "called"
export const _sanitize_called = combine_normalizers(
	NORMALIZERS.normalize_unicode,
	NORMALIZERS.trim,
	// TODO one day multiple space / exotic spaces to single normal space
)

/////////////////////

export function sanitize_persisted<T extends BaseUser>(
	input: Immutable<T>,
): Immutable<T> {
	const output = {
		...input,
		called: input.called ? _sanitize_called(input.called!) : undefined,
		raw_email: normalize_email_safe(input.raw_email),
		normalized_email: normalize_email_full(input.raw_email),
		avatar_url: input.avatar_url || undefined,
		roles: Array.from(new Set([...input.roles])).sort(),
	}

	if (!deep_equals_stable(input, output)) {
		logger.debug('FYI base was sanitized:', { input, output })
	}

	return output
}

export function infer_defaults_from_persisted(
	data: Immutable<PUser>,
): User {
	const base = extract_base(data)

	return {
		...base,
		called: base.called || _infer_called(base),
		avatar_url: data.avatar_url || _infer_avatar_url(base),
		roles: Array.from(new Set([...data.roles, ...DEFAULT_ROLES])),
	}
}

export function extract_base<T extends BaseUser>(user: Immutable<T>): Immutable<BaseUser> {
	const {
		called,
		raw_email,
		avatar_url,
		roles,
	} = user

	return sanitize_persisted<BaseUser>({
		called,
		raw_email,
		avatar_url,
		roles,
	})
}
