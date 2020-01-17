import path from 'path'

////////////////////////////////////

import { Basename, SimpleYYYYMMDD } from '../types'
import { get_params } from '../params'

const PARAMS = get_params()

///////////////////// NO Regexp :) /////////////////////

export function is_year(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString() !== s) return false

	return n >= PARAMS.YYYY_lower_bound && n <= PARAMS.YYYY_upper_bound
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

export function is_hour_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 0 && n < 24
}

export function is_minute_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(2, '0') !== s) return false

	return n >= 0 && n < 60
}

export const is_second_fragment = is_minute_fragment

export function is_millisecond_fragment(s: string): boolean {
	const n = Math.trunc(Number(s))
	if (n.toString().padStart(3, '0') !== s) return false

	return true
}

// TODO?
export function is_separator(c: string): boolean {
	return [ '-', '_' ].includes(c)
}

///////////////////// WITH Regexp :( /////////////////////

const YEAR_RE_STR = '((19|20)\\d\\d)'
const YEAR_RE = new RegExp(`^${YEAR_RE_STR}$`)
const MONTH_RE_STR = '(01|02|03|04|05|06|07|08|09|10|11|12)'
const MONTH_RE = new RegExp(`^${MONTH_RE_STR}$`)
const DAY_RE_STR = '(([012]\\d)|30|31)'
const DAY_RE = new RegExp(`^${DAY_RE_STR}$`)
const COMPACT_DATE_RE_STR = YEAR_RE_STR + MONTH_RE_STR + DAY_RE_STR

export function extract_compact_date(s: string): SimpleYYYYMMDD | null {
	const match = s.match(COMPACT_DATE_RE_STR)
	if (!match || match.index === undefined) return null

	return Number(s.slice(match.index, match.index + 8))
}

const HUMAN_TS_MS_DEMO = '20181121_06h00+45.632'
const HUMAN_TS_MS_RE = /\d{8}_\d{2}h\d{2}\+\d{2}\.\d{3}/
export function is_human_timestamp_ms(s: string): boolean {
	if (s.length !== HUMAN_TS_MS_DEMO.length) return false

	return Array.isArray(s.match(HUMAN_TS_MS_RE))
}

////////////////////////////////////

export function starts_with_human_timestamp_ms(basename: Basename): boolean {
	return is_human_timestamp_ms(basename.slice(0, HUMAN_TS_MS_DEMO.length))
}

////////////////////////////////////



export function get_normalized_dirname(base: Basename): string {
	base = base.toLowerCase()

	if (base.startsWith('- ')) return base.slice(2)

	return base
}
