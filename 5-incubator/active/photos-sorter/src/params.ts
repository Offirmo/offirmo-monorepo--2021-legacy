import path from 'path'

import assert from 'tiny-invariant'

import { EXIF_POWERED_FILE_EXTENSIONS } from './consts'
import { SimpleYYYYMMDD, AbsolutePath } from './types'


export interface Params {
	YYYY_lower_bound: number
	YYYY_upper_bound: number
	date_lower_bound: SimpleYYYYMMDD
	date_upper_bound: SimpleYYYYMMDD
	root: AbsolutePath
	dry_run: boolean
	extensions_to_normalize: { [k: string]: string } // todo runtime check LCase
	media_files_extensions: string[] // todo runtime check normalized
	extensions_to_delete: string[] // todo runtime check normalized
	worthless_files: string[]
}

// the earliest known photo was taken in 1826
// https://en.wikipedia.org/wiki/View_from_the_Window_at_Le_Gras
const YYYY_LOWER_BOUND = 1826
const YYYY_UPPER_BOUND = (new Date()).getUTCFullYear() + 1
assert(YYYY_LOWER_BOUND >= 1826, 'earliest known')
assert(YYYY_UPPER_BOUND >= YYYY_LOWER_BOUND, 'higher > lower')

const DATE_LOWER_BOUND: SimpleYYYYMMDD = YYYY_LOWER_BOUND * 10000 +  101
const DATE_UPPER_BOUND: SimpleYYYYMMDD = YYYY_UPPER_BOUND * 10000 + 1231


export function get_params(): Params {
	return {
		YYYY_lower_bound: YYYY_LOWER_BOUND,
		YYYY_upper_bound: YYYY_UPPER_BOUND,
		date_lower_bound: DATE_LOWER_BOUND,
		date_upper_bound: DATE_UPPER_BOUND,

		//root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted`),
		root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted/- inbox/some posh event with no date in inbox`),

		dry_run: true, // XXX

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
		],

		extensions_to_delete: [
			'.AAE',
		].map(s => s.toLowerCase()),

		worthless_files: [
			'.DS_Store',
			'.picasa.ini',
		],

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
