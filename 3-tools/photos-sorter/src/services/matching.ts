import path from 'path'

////////////////////////////////////

import logger from '../services/logger'
import {Basename, RelativePath} from "../types";

export const YEAR_STR = '[12]\d\d\d'
export const YEAR = new RegExp(YEAR_STR)

export function is_year(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString() !== s) return false

	return n >= 1950 && n <= 2100
}

export function is_month_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 1 && n <= 12
}

export function is_day_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 1 && n <= 31
}

export function is_compact_date(s: string): boolean {
	if (s.length !== 8) return false

	if (!is_year(s.slice(0, 4))) return false
	if (!is_month_fragment(s.slice(4, 6))) return false
	if (!is_day_fragment(s.slice(6, 8))) return false

	return true
}

////////////////////////////////////


////////////////////////////////////

export function get_normalized_dirname(base: Basename): string {
	base = base.toLowerCase()

	if (base.startsWith('- ')) return base.slice(2)

	return base
}
