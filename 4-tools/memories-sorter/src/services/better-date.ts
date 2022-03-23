/* Abstraction over a Date API more powerful than JS Date
 * Candidates:
 * - moment-tz
 * - Luxon
 * - Spacetime
 * - TC39 Temporal https://tc39.es/proposal-temporal/docs/cookbook.html
 */

const { deepStrictEqual: assert_deepStrictEqual } = require('assert').strict

import assert from 'tiny-invariant'
import { ExifDateTime } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { TimestampUTCMs } from '@offirmo-private/timestamps'
import { get_json_difference } from '@offirmo-private/state-utils'

///////
// Note: we defaulted on Luxon bc
// 1. it's very good and suitable
// 2. ExifDateTime also uses it internally = easy to convert from
import { DateTime as LuxonDateTime } from 'luxon'
///////

import { SimpleYYYYMMDD, TimeZone } from '../types'
import { get_default_timezone, get_params, Params } from '../params'
import logger from './logger'

////////////////////////////////////

// Note: Where Date is called as a constructor with more than one argument,
// the specified arguments represent local time.
// If UTC is desired, use new Date(Date.UTC(...)) with the same arguments.
export type LegacyDate = Date
export const LegacyDate = Date

export type PhotoSorterTimestampDays = string
export type PhotoSorterTimestampMinutes = string
export type PhotoSorterTimestampSeconds = string
export type PhotoSorterTimestampMillis = string
export type PhotoSorterTimestampAuto = string

export interface BetterDateMembers {
	year?: number,
	month?: number,
	day?: number,
	hour?: number,
	minute?: number,
	second?: number,
	milli?: number,
	tz: TimeZone | 'tz:auto'
}

// opaque type, do not access the internals apart from in this file
export interface BetterDate {
	_debug: any
	_lx: LuxonDateTime // hidden underlying implementation, abstracted to allow replacement
	_has_explicit_timezone: boolean
}

export interface DateRange<DateType = BetterDate> {
	begin: DateType
	end: DateType
}

////////////////////////////////////
// Selectors

export function get_timestamp_utc_ms_from(date: Immutable<BetterDate>): TimestampUTCMs {
	return date._lx.toMillis()
}

// luxon formatting
const DATE_FORMAT_YEARS = 'yyyy'
const DATE_FORMAT_MONTHS = 'LL'
const DATE_FORMAT_DAYS = 'dd'
const DATE_FORMAT_TO_DAYS_COMPACT = [ DATE_FORMAT_YEARS, DATE_FORMAT_MONTHS, DATE_FORMAT_DAYS].join('')
const DATE_FORMAT_TO_DAYS_NATURAL = [ DATE_FORMAT_YEARS, DATE_FORMAT_MONTHS, DATE_FORMAT_DAYS].join('-')
const DATE_FORMAT_TO_MINUTES_NATURAL = DATE_FORMAT_TO_DAYS_NATURAL + `_HH'h'mm`
const DATE_FORMAT_TO_SECONDS_NATURAL = DATE_FORMAT_TO_MINUTES_NATURAL + `'m'ss`
const DATE_FORMAT_TO_MILLIS_NATURAL = DATE_FORMAT_TO_SECONDS_NATURAL + `'s'SSS`
const DATE_FORMAT_TO_MILLIS_DIGITS = DATE_FORMAT_TO_DAYS_COMPACT + `HHmmssSSS`

export function get_compact_date(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): SimpleYYYYMMDD {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)
	/*console.log('get_compact_date', {
		tz,
		embedded_tz: get_embedded_timezone(date),
		compact_embedded_tz: date._lx.toFormat(DATE_FORMAT_TO_DAYS_COMPACT),
		final_compact: _lx.toFormat(DATE_FORMAT_TO_DAYS_COMPACT),
	})*/
	return Number(_lx.toFormat(DATE_FORMAT_TO_DAYS_COMPACT))
}

// ex. 2018-11-21
export function get_human_readable_timestamp_days(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): PhotoSorterTimestampDays {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)

	return _lx.toFormat(DATE_FORMAT_TO_DAYS_NATURAL)
}

// ex. 2018-11-21_06h00
export function get_human_readable_timestamp_minutes(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): PhotoSorterTimestampMinutes {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)

	return _lx.toFormat(DATE_FORMAT_TO_MINUTES_NATURAL)
}

// ex. 2018-11-21_04h23m15
export function get_human_readable_timestamp_seconds(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): PhotoSorterTimestampSeconds {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)

	return _lx.toFormat(DATE_FORMAT_TO_SECONDS_NATURAL)
}

// ex. 2018-11-21_06h00m45s632
export function get_human_readable_timestamp_millis(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): PhotoSorterTimestampMillis {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)

	return _lx.toFormat(DATE_FORMAT_TO_MILLIS_NATURAL)
}

// same as the above without trailing 0s
export function get_human_readable_timestamp_auto(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): PhotoSorterTimestampAuto {
	assert(date && date._lx, 'get_human_readable_timestamp_auto() bad date')

	const digits = date._lx.toFormat(DATE_FORMAT_TO_MILLIS_DIGITS) // tz is irrelevant for this counting
	//logger.log('get_human_readable_timestamp_auto()', { digits, date })
	assert(digits.length === 17, 'get_human_readable_timestamp_auto() digits length')

	if (digits.endsWith('000000000'))
		return get_human_readable_timestamp_days(date, tz)

	if (digits.endsWith('00000'))
		return get_human_readable_timestamp_minutes(date, tz)

	if (digits.endsWith('000'))
		return get_human_readable_timestamp_seconds(date, tz)

	return get_human_readable_timestamp_millis(date, tz)
}

export function get_embedded_timezone(date: Immutable<BetterDate>): TimeZone {
	return date._lx.zone.name
}

// sunday = 0
export function get_day_of_week_index(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): number {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)

	return _lx.weekday % 7
}

export function get_year(date: Immutable<BetterDate>, tz: TimeZone | 'tz:embedded'): number {
	const _lx = tz === 'tz:embedded' ? date._lx : date._lx.setZone(tz)

	return _lx.year
}

// serializable version
export function get_members_for_serialization(date: Immutable<BetterDate>): BetterDateMembers {
	return {
		year: date._lx.year,
		month: date._lx.month,
		day: date._lx.day,
		hour: date._lx.hour,
		minute: date._lx.minute,
		second: date._lx.second,
		milli: date._lx.millisecond,
		tz: date._has_explicit_timezone ? date._lx.zone.name : 'tz:auto',
	}
}

// used in unit tests only
export function _get_exif_datetime(date: Immutable<BetterDate>): ExifDateTime {
	//constructor(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond?: number | undefined, tzoffsetMinutes?: number | undefined, rawValue?: string | undefined, zoneName?: string | undefined);
	const edt = new ExifDateTime(
		date._lx.year,
		date._lx.month,
		date._lx.day,
		date._lx.hour,
		date._lx.minute,
		date._lx.second,
		date._lx.millisecond,
		undefined, //tzoffsetMinutes?: number | undefined
		undefined, //rawValue?: string | undefined
		date._lx.zone.name,
	)
	// hack
	;(edt as any)._has_explicit_timezone = date._has_explicit_timezone
	return edt
}

export function get_debug_representation(date: Immutable<BetterDate> | TimestampUTCMs | undefined | null): string {
	if (date === undefined)
		return '[undefined date]'

	if (date === null)
		return '[null date]'

	let timestamp_utc_ms = 0 // so far
	let better_date = null // so far

	if (typeof date === 'number') {
		better_date = create_better_date_from_utc_tms(date, 'tz:auto')
		timestamp_utc_ms = date
	}
	else {
		better_date = date
		timestamp_utc_ms = get_timestamp_utc_ms_from(date)
	}

	return `<BetterDate>(${get_human_readable_timestamp_auto(better_date, 'tz:embedded')}/${get_embedded_timezone(better_date)}/${timestamp_utc_ms})`
}

export function get_range_debug_representation(range: undefined | null | DateRange<TimestampUTCMs> | DateRange): string {
	return `${get_debug_representation(range?.begin)} → ${get_debug_representation(range?.end)}`
}

/////////// Comparisons / operators

// standard comparison operator
// > 0 	sort b before a
// < 0 	sort a before b
// === 0 	keep original order of a and b
export function compare_utc(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): number {
	const tms_a = get_timestamp_utc_ms_from(date_a)
	const tms_b = get_timestamp_utc_ms_from(date_b)

	return tms_a - tms_b
}

export function is_equal_moment(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): boolean {
	return compare_utc(date_a, date_b) === 0
}

// undefined handled for convenience
export function is_deep_equal(date_a: Immutable<BetterDate> | undefined, date_b: Immutable<BetterDate> | undefined): boolean {
	const is_a_undefined = date_a === undefined
	const is_b_undefined = date_b === undefined

	if (is_a_undefined && is_b_undefined)
		return true

	if (is_a_undefined !== is_b_undefined)
		return false

	if (!is_equal_moment(date_a!, date_b!))
		return false

	if (date_a!._has_explicit_timezone !== date_b!._has_explicit_timezone)
		return false

	return get_embedded_timezone(date_a!) === get_embedded_timezone(date_b!)
}

export function min(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): Immutable<BetterDate> {
	const cmp = compare_utc(date_a, date_b)

	return cmp <= 0 ? date_a : date_b
}

export function max(date_a: Immutable<BetterDate>, date_b: Immutable<BetterDate>): Immutable<BetterDate> {
	const cmp = compare_utc(date_a, date_b)

	return cmp <= 0 ? date_b : date_a
}


export const HOUR_IN_MILLIS = 60 * 60 * 1000
export const DAY_IN_MILLIS = 24 * HOUR_IN_MILLIS
export function are_tms_within_24h_of_each_other(tms1: TimestampUTCMs, tms2: TimestampUTCMs): boolean {
	return Math.abs(tms1 - tms2) < DAY_IN_MILLIS
}
export function are_same_tms_date_with_potential_tz_difference(tms1: TimestampUTCMs, tms2: TimestampUTCMs): boolean {
	if (!are_tms_within_24h_of_each_other(tms1, tms2))
		return false

	const sub_hour_1 = tms1 % HOUR_IN_MILLIS
	const sub_hour_2 = tms2 % HOUR_IN_MILLIS
	if (sub_hour_1 === sub_hour_2)
		return true

	// allow a little bit of lag (seen 5s FRWF9408.MP4 and 7s on IMAG0430.jpg)
	if (Math.abs(sub_hour_1 - sub_hour_2) <= 10 * 1000)
		return true

	/*console.warn(`are_same_tms_date_with_potential_tz_difference() yielding close FALSE`, {
		tms1,
		tms2,
		sub_hour_1,
		sub_hour_2,
		diff: Math.abs(sub_hour_1 - sub_hour_2),
	})*/

	return false
}

export function are_dates_matching_while_disregarding_tz_and_precision(d1: Immutable<BetterDate>, d2: Immutable<BetterDate>, debug_id?: string): boolean {
	const tms1 = get_timestamp_utc_ms_from(d1)
	const tms2 = get_timestamp_utc_ms_from(d2)

	const auto1 = get_human_readable_timestamp_auto(d1, 'tz:embedded')
	const auto2 = get_human_readable_timestamp_auto(d2, 'tz:embedded')

	const is_tms_matching = are_same_tms_date_with_potential_tz_difference(tms1, tms2)

	const [ longest, shortest ] = auto1.length >= auto2.length
		? [ auto1, auto2 ]
		: [ auto2, auto1 ]
	const is_matching_with_different_precisions = longest.startsWith(shortest)

	if (!is_tms_matching && !is_matching_with_different_precisions) {
		if (debug_id) {
			/* TODO review
			logger.warn(`are_dates_matching_while_disregarding_tz_and_precision() yielded FALSE`, {
				id: debug_id,
				auto1,
				auto2,
				tms1,
				tms2,
				is_tms_matching,
				is_matching_with_different_precisions,
				diff_s: Math.abs(tms2 - tms1) / 1000.,
			})
			 */
		}
		return false
	}

	return true
}

////////////////////////////////////

// needed to create from file times
export function create_better_date_from_utc_tms(tms: TimestampUTCMs, tz: TimeZone | 'tz:auto', PARAMS: Immutable<Params> = get_params()): BetterDate {
	assert(!!tms, 'create_better_date_from_utc_tms should have a correct input: truthy!')
	assert(Number.isSafeInteger(tms), `create_better_date_from_utc_tms correct input: isSafeInteger(${tms})`)

	const _tz = tz === 'tz:auto' ? get_default_timezone(tms, PARAMS) : tz

	const _ld = new LegacyDate(tms)

	//const zone = new IANAZone(_tz)
	const _lx = LuxonDateTime.fromJSDate(_ld, { zone: _tz })
	if (_lx.invalidReason || _lx.invalidExplanation) {
		logger.error('', {
			tms,
			_ld,
			_tz,
			_lx,
		})
	}
	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_from_utc_tms() invalid LuxonDateTime: ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)

	// const _m = moment(_ld)
	return {
		_lx,
		_debug: {
			'create_better_date_from_utc_tms': {
				tms,
			}
		},
		_has_explicit_timezone: tz !== 'tz:auto',
	}
}

// better tz because the ExifDateTime created from exiftool
// may have the tz as a numeric shift
// while an explicit locale may be in the other TZ field, cf. unit test
// if better_tz supplied, expecting a similar shift
// https://photostructure.github.io/exiftool-vendored.js/classes/ExifDateTime.html
export function create_better_date_from_ExifDateTime(exif_date: ExifDateTime, better_tz?: TimeZone, PARAMS: Immutable<Params> = get_params()): BetterDate {
	let _lx: LuxonDateTime = exif_date.toDateTime()
	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_from_ExifDateTime()--01: ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)

	if (!exif_date.hasZone) {
		assert(!better_tz, 'create_better_date_from_ExifDateTime() tz suggested with no tz embedded = ???')
		let tz: TimeZone = get_default_timezone(_lx.toMillis(), PARAMS)
		_lx = LuxonDateTime.fromObject({
			year: exif_date.year,
			month: exif_date.month,
			day: exif_date.day,
			hour: exif_date.hour,
			minute: exif_date.minute,
			second: exif_date.second,
			millisecond: exif_date.millis,
		}, {
			zone: tz,
		})
	}
	else {
		//assert(!_lx.zone?.name?.startsWith('UTC+'), `create_better_date_from_ExifDateTime() zone is an offset! "${_lx.zone.name}"`)
		if (better_tz) {
			// TODO assert same tz shift
			_lx = LuxonDateTime.fromObject({
				year: exif_date.year,
				month: exif_date.month,
				day: exif_date.day,
				hour: exif_date.hour,
				minute: exif_date.minute,
				second: exif_date.second,
				millisecond: exif_date.millis,
			},
			{
				zone: better_tz,
			})
		}
	}
	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_from_ExifDateTime()--02: ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)

	const date: BetterDate = {
		_lx,
		_debug: {
			'create_better_date_from_ExifDateTime': {
				raw: exif_date.rawValue,
			}
		},
		_has_explicit_timezone: (() => {
			// this is slightly hard to know
			if (better_tz)
				return true
			if (typeof (exif_date as any)._has_explicit_timezone === 'boolean') // hack
				return (exif_date as any)._has_explicit_timezone
			return exif_date.hasZone
		})()
	}
	//logger.trace(`create_better_date_from_ExifDateTime(${exif_date.rawValue}) -> ${get_debug_representation(date)}`)
	return date
}

export function create_better_date_from_symd(simple_date: SimpleYYYYMMDD, tz: TimeZone | 'tz:auto', PARAMS: Immutable<Params> = get_params()): BetterDate {
	let day = simple_date % 100
	let month = Math.trunc(simple_date / 100) % 100
	let year = Math.trunc(simple_date / 10000)

	const date = create_better_date_obj({
		year,
		month,
		day,
		tz,
	}, PARAMS)
	date._debug = {
		'create_better_date_from_simple': {
			simple_date,
			year,
			month,
			day,
			tz,
		}
	}
	return date
}

export function create_better_date(
	tz: TimeZone | 'tz:auto',
	year?: number,
	month?: number,
	day?: number,
	hour?: number,
	minute?: number,
	second?: number,
	milli?: number,
	PARAMS: Immutable<Params> = get_params(),
): BetterDate {
	const members = {
		year,
		month,
		day,
		hour,
		minute,
		second,
		milli,
		tz,
	}
	assert(Object.values(members).filter(v => !!v).length >= 2, `create_better_date() not enough defined params, this is not what you want!`)

	const date = create_better_date_obj(members, PARAMS)
	date._debug = {
		'create_better_date': {
			year,
			month,
			day,
			hour,
			minute,
			second,
			milli,
			tz,
		}
	}
	return date
}

export function create_better_date_obj({
	year,
	month,
	day,
	hour,
	minute,
	second,
	milli,
	tz = 'tz:auto',
	...unhandled
}: Immutable<BetterDateMembers>, PARAMS: Immutable<Params> = get_params()): BetterDate {
	//console.log(PARAMS)
	assert(Object.keys(unhandled).length === 0, `create_better_date_obj() unhandled params:"${Object.keys(unhandled).join(',')}"!`)
	const members_for_luxon = {
		year,
		month,
		day,
		hour,
		minute,
		second,
		millisecond: milli,
	}
	assert(Object.values(members_for_luxon).filter(v => !!v).length >= 1, `create_better_date_obj() not enough defined params, this is not what you want!`)

	let _lx = LuxonDateTime.fromObject({
		...members_for_luxon,
	}, {
		...(tz !== 'tz:auto' && { zone: tz }),
	})
	assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_obj()--1: ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)
	//console.log('initial _lx', _lx)

	if (tz === 'tz:auto') {
		// rely on the 1st creation to get the millis
		const zone = get_default_timezone(_lx.toMillis(), PARAMS)
		//console.log('tz:auto defaulting to', zone)
		_lx = LuxonDateTime.fromObject({
			...members_for_luxon,
		},
		{
			zone,
		})
		assert(!_lx.invalidReason && !_lx.invalidExplanation, 'create_better_date_obj()--2: ' + _lx.invalidReason + '; ' + _lx.invalidExplanation)
	}

	return {
		_lx,
		_debug: {
			'create_better_date_obj': {
				year,
				month,
				day,
				hour,
				minute,
				second,
				milli,
				tz,
			}
		},
		_has_explicit_timezone: tz !== 'tz:auto',
	}
}

////////////////////////////////////

export function reinterpret_with_different_tz(previous: Immutable<BetterDate>, tz: TimeZone): BetterDate {
	if (tz === get_embedded_timezone(previous))
		return previous

	const members = get_members_for_serialization(previous)
	members.tz = tz

	return create_better_date_obj(members)
}

// negative supported
export function add_days(previous: Immutable<BetterDate>, days: number): Immutable<BetterDate> {
	const _lx = previous._lx.plus({ days })

	return {
		_lx,
		_debug: {
			'add_days': {
				days
			}
		},
		_has_explicit_timezone: previous._has_explicit_timezone,
	}
}

export function add_days_to_simple_date(date: SimpleYYYYMMDD, inc_days: number): SimpleYYYYMMDD {
	const days = date % 100 + inc_days
	const months = Math.trunc(date / 100) % 100
	const years = Math.trunc(date / 10000)
	const _ld = new LegacyDate(years, months - 1, days)

	return _ld.getDate() + (_ld.getMonth() + 1) * 100 + _ld.getFullYear() * 10000
}

function _get_legacy_from_simple_date(date: SimpleYYYYMMDD): LegacyDate {
	const days = date % 100
	const months = Math.trunc(date / 100) % 100
	const years = Math.trunc(date / 10000)
	return new LegacyDate(years, months - 1, days)
}

export function get_elapsed_days_between_ordered_simple_dates(d1: SimpleYYYYMMDD, d2: SimpleYYYYMMDD): number {
	assert(d2 >= d1, `get_elapsed_days_between_ordered_simple_dates() d1 must be <= d2! "${d1}", "${d2}"`)

	const _ld1 = _get_legacy_from_simple_date(d1)
	const _ld2 = _get_legacy_from_simple_date(d2)

	const diff_ms = _ld2.getTime() - _ld1.getTime()
	return Math.floor(diff_ms / 1000 / 3600 / 24)
}

export function assertㆍBetterDateㆍdeepㆍequal(s1: Immutable<BetterDate>, s2: Immutable<BetterDate>, should_log = true): void {
	const s1_alt = _clean_debug(s1)
	const s2_alt = _clean_debug(s2)

	try {
		assert_deepStrictEqual(s1_alt, s2_alt)
	}
	catch (err) {
		if (should_log)
			console.error('assertㆍBetterDateㆍdeepㆍequal() FALSE', get_json_difference(s1_alt, s2_alt))
		throw err
	}
}

export function _clean_debug(date: Immutable<BetterDate>): Immutable<BetterDate> {
	return {
		...date,
		_debug: null,
	}
}
