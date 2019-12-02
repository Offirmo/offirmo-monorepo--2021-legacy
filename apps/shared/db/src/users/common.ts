import { NORMALIZERS, combine_normalizers } from '@offirmo-private/normalize-string'

import { BaseUser, User, PUser } from './types'
import {
	logger,
	deep_equals,
	get_gravatar_url,
	normalize_email_full,
	normalize_email_reasonable,
} from '../utils'

////////////////////////////////////

const DEFAULT_ROLES: Readonly<string[]> = []

function infer_avatar_url(data: Readonly<BaseUser>): string {
	return get_gravatar_url(data.usual_email)
}

function infer_called(data: Readonly<BaseUser>): string {
	const [ local_part ] = data.usual_email.split('@')

	return NORMALIZERS.coerce_blanks_to_single_spaces(
		NORMALIZERS.coerce_delimiters_to_space(local_part)
	)
}

const sanitize_called = combine_normalizers(
	NORMALIZERS.normalize_unicode,
	NORMALIZERS.trim,
	// TODO one day multiple space / exotic spaces to single normal space
)

/////////////////////

export function sanitize_persisted<T extends BaseUser>(
	input: Readonly<T>,
): T {
	const output = {
		...input,
		called: input.called ? sanitize_called(input.called!) : undefined,
		usual_email: normalize_email_reasonable(input.usual_email),
		normalized_email: normalize_email_full(input.usual_email),
		avatar_url: input.avatar_url || undefined,
		roles: Array.from(new Set([...input.roles])).sort(),
	}

	if (!deep_equals(input, output)) {
		logger.log('Sanitized:', { input, output })
	}

	return output
}

export function infer_defaults_from_persisted(
	data: Readonly<PUser>,
): User {
	const { id, created_at, updated_at, ...base } = sanitize_persisted(data)

	return {
		...base,
		called: base.called || infer_called(base),
		avatar_url: data.avatar_url || infer_avatar_url(base),
		roles: Array.from(new Set([...data.roles, ...DEFAULT_ROLES])),
	}
}

export function extract_base<T extends BaseUser>(user: Readonly<T>): BaseUser {
	const {
		called,
		usual_email,
		avatar_url,
		roles,
	} = user

	return sanitize_persisted<BaseUser>({
		called,
		usual_email,
		avatar_url,
		roles,
	})
}
