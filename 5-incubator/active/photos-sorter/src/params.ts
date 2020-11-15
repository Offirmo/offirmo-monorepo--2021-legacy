import path from 'path'

import assert from 'tiny-invariant'

import { EXIF_POWERED_FILE_EXTENSIONS } from './consts'
import { SimpleYYYYMMDD, AbsolutePath } from './types'


const TZONE_FR = 'Europe/Paris'
const TZONE_AU = 'Australia/Sydney'

export interface DefaultTzChange {
	date_utc_ms: number,
	new_default: string
}

export interface Params {
	root: AbsolutePath
	dry_run: boolean
	YYYY_lower_bound: number
	YYYY_upper_bound: number
	date_lower_bound: SimpleYYYYMMDD
	date_upper_bound: SimpleYYYYMMDD
	extensions_to_normalize: { [k: string]: string } // todo runtime check LCase
	media_files_extensions: string[] // todo runtime check normalized
	extensions_to_delete: string[] // todo runtime check normalized
	worthless_files: string[]
	default_timezones: DefaultTzChange[]
}

// the earliest known photo was taken in 1826
// https://en.wikipedia.org/wiki/View_from_the_Window_at_Le_Gras
const YYYY_LOWER_BOUND = 1826
assert(YYYY_LOWER_BOUND >= 1826, 'earliest known')

const YYYY_UPPER_BOUND = (new Date()).getFullYear() + 1 // +1 to handle taking pictures during new year eve
assert(YYYY_UPPER_BOUND >= YYYY_LOWER_BOUND, 'higher > lower')

const DATE_LOWER_BOUND: SimpleYYYYMMDD = (YYYY_LOWER_BOUND * 10000) + 101
const DATE_UPPER_BOUND: SimpleYYYYMMDD = (YYYY_UPPER_BOUND * 10000) + 102 // photos taken "next" year can only happen during new year eve


export function get_params(): Params {
	return {
		YYYY_lower_bound: YYYY_LOWER_BOUND,
		YYYY_upper_bound: YYYY_UPPER_BOUND,
		date_lower_bound: DATE_LOWER_BOUND,
		date_upper_bound: DATE_UPPER_BOUND,

		root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted`),
		//root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted/- inbox/some posh event with no date in inbox`),

		dry_run: true, // XXX
		//dry_run: false,

		extensions_to_normalize: {
			'.jpeg': '.jpg',
			'.tiff': '.tif',
		},

		media_files_extensions: [
			...EXIF_POWERED_FILE_EXTENSIONS,
			'.gif',
			'.png',
			'.psp', // photoshop I believe, screens from Warcraft III are in this format
			'.tga', // WoW
			'.avi', // old videos
			'.mp4',
			'.pdf',
		].map(s => s.toLowerCase()),

		extensions_to_delete: [
			'.AAE',
		].map(s => s.toLowerCase()),

		worthless_files: [
			'.DS_Store',
			'.picasa.ini',
		].map(s => s.toLowerCase()),

		default_timezones: [
			// if no time zone, infer it according to this timetable
			// Expected to be in order
			{
				date_utc_ms: Number(new Date(YYYY_LOWER_BOUND, 0)),
				new_default: TZONE_FR,
			},
			{
				date_utc_ms: Number(new Date(2009, 7, 10)),
				new_default: 'Asia/Bangkok',
			},
			{
				date_utc_ms: Number(new Date(2010, 6, 8)),
				new_default: TZONE_FR,
			},
			{
				date_utc_ms: Number(new Date(2017, 6, 14)),
				new_default: TZONE_AU,
			},
		].sort((a, b) => a.date_utc_ms - b.date_utc_ms)
	}
}

/*
const DIGITS = '01234567890123456789'
export function get_allowed_digits_by_position() {
	const y0 = DIGITS.slice(
		Math.round(YYYY_LOWER_BOUND/1000),
		Math.round(YYYY_UPPER_BOUND/1000)
	)
	const y1 = DIGITS.slice(
		Math.round((YYYY_LOWER_BOUND % 1000)/100),
		Math.round((YYYY_UPPER_BOUND % 1000)/100) + Math.min(1, y0.length - 1) * 10,
	)
	const y2 = DIGITS.slice(
		Math.round((YYYY_LOWER_BOUND % 100)/10),
		Math.round((YYYY_UPPER_BOUND % 100)/10) + Math.min(1, y1.length - 1) * 10,
	)
	const y3 = DIGITS.slice(
		Math.round(YYYY_LOWER_BOUND % 10),
		Math.round(YYYY_UPPER_BOUND % 10) + Math.min(1, y2.length - 1) * 10,
	)
	return [
		// YYYY
		y0,
		y1,
		y2,
		y3,
		// MM
		'01',
		'0123456789',
	]
}
*/
