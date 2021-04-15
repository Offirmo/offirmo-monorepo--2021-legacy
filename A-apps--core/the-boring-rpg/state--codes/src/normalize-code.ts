import { NORMALIZERS } from '@offirmo-private/normalize-string'

// useless function to circumvent a strange TS bug
function normalize_code(s: string): string {
	return NORMALIZERS.coerce_to_redeemable_code(s)
}

export default normalize_code
