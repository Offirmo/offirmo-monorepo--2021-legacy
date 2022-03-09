import assert from 'tiny-invariant'
import { RELATIVE_PATH_NORMALIZATION_VERSION } from '../consts'
import { TimeZone } from '../types'
import { create_better_date, _clean_debug } from '../services/better-date'
import { ParseResult } from '../services/name_parser'

assert(RELATIVE_PATH_NORMALIZATION_VERSION === 1, 'test filenames should contain test cases for all RELATIVE_PATH_NORMALIZATION_VERSION')

/////////////////////

interface NameDetails extends Omit<ParseResult, 'original_name'> {
	_comment?: string
	digit_blocks: string
	human_ts_current_tz_for_tests?: string
	expected_tz?: TimeZone
}

// all taken from my actual files in my library

export const DATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	'PHOTO-2019-12-16-20-38-08 (1).jpg': {
		_comment: '?? macOs / iOs',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 12, 16, 20, 38, 8)),
		date_digits: '20191216203808',
		digits_pattern: 'xxxx-xx-xx-xx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: 1,

		// for test
		digit_blocks: '2019-12-16-20-38-08',
		human_ts_current_tz_for_tests: '2019-12-16_20h38m08',
	},

	'IMG_20130525.JPG': {
		_comment: 'intelligent Android',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2013, 5, 25)),
		date_digits: '20130525',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '20130525',
		human_ts_current_tz_for_tests: '2013-05-25',
	},

	'IMG_20160327_102742 2.jpg': {
		_comment: 'intelligent Android + catalina copy',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2016, 3, 27, 10, 27, 42)),
		date_digits: '20160327102742',
		digits_pattern: 'xxxxxxxx_xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: 2,

		// for test
		digit_blocks: '20160327-102742',
		human_ts_current_tz_for_tests: '2016-03-27_10h27m42',
	},

	'Screen Shot 2018-01-15 at 08.55.38.png': {
		_comment: 'screenshot macOS en',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2018, 1, 15, 8, 55, 38)),
		date_digits: '20180115085538',
		digits_pattern: 'xxxx-xx-xx at xx.xx.xx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2018-01-15-08-55-38',
		human_ts_current_tz_for_tests: '2018-01-15_08h55m38',
	},

	'Capture d\'écran 2017-11-12 19.07.50.png': {
		_comment: 'screenshot old macOs fr',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2017, 11, 12, 19, 7, 50)),
		date_digits: '20171112190750',
		digits_pattern: 'xxxx-xx-xx xx.xx.xx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2017-11-12-19-07-50',
		human_ts_current_tz_for_tests: '2017-11-12_19h07m50',
	},

	'Capture d’écran 2017-03-24 à 11.44.17.png': {
		_comment: 'screenshot macOs fr',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2017, 3, 24, 11, 44, 17)),
		date_digits: '20170324114417',
		digits_pattern: 'xxxx-xx-xx à xx.xx.xx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2017-03-24-11-44-17',
		human_ts_current_tz_for_tests: '2017-03-24_11h44m17',
	},

	'Capture2014-08-14_0137_48001.png': {
		_comment: 'screenshot Windows?',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2014, 8, 14, 1, 37, 48, 1)),
		date_digits: '20140814013748001',
		digits_pattern: 'xxxx-xx-xx_xxxx_xxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2014-08-14-0137-48001',
		human_ts_current_tz_for_tests: '2014-08-14_01h37m48s001',
	},

	'Capture plein écran 29082013 005206.bmp': {
		_comment: 'screenshot Windows fr?',

		// ParseResult
		extension_lc: '.bmp',
		date: _clean_debug(create_better_date('tz:auto', 2013, 8, 29, 0, 52, 6)),
		date_digits: '29082013005206',
		digits_pattern: 'xxxxxxxx xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '29082013-005206',
		human_ts_current_tz_for_tests: '2013-08-29_00h52m06',
	},

	'Capture plein écran 2010-06-26 094952.bmp': {
		_comment: 'alt screenshot Windows fr?',

		// ParseResult
		extension_lc: '.bmp',
		date: _clean_debug(create_better_date('tz:auto', 2010, 6, 26, 9, 49, 52)),
		date_digits: '20100626094952',
		digits_pattern: 'xxxx-xx-xx xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2010-06-26-094952',
		human_ts_current_tz_for_tests: '2010-06-26_09h49m52',
	},

	'Screen 2011-05-17 16h47+54.png': {
		_comment: 'screenshot with a tool (irfan view?)',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2011, 5, 17, 16, 47, 54)),
		date_digits: '20110517164754',
		digits_pattern: 'xxxx-xx-xx xxhxx+xx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2011-05-17-16-47-54',
		human_ts_current_tz_for_tests: '2011-05-17_16h47m54',
	},

	'snapshot_20140121_202914.jpg': {
		_comment: 'screenshot steam?',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2014, 1, 21, 20, 29, 14)),
		date_digits: '20140121202914',
		digits_pattern: 'xxxxxxxx_xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '20140121-202914',
		human_ts_current_tz_for_tests: '2014-01-21_20h29m14',
	},

	'IMG_20150510_175834.jpg': {
		_comment: 'I think WhatsApp or maybe Android at some point',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2015, 5, 10, 17, 58, 34)),
		date_digits: '20150510175834',
		digits_pattern: 'xxxxxxxx_xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '20150510-175834',
		human_ts_current_tz_for_tests: '2015-05-10_17h58m34',
	},

	'IMG-20160202-WA0001.jpeg': {
		_comment: 'WhatsApp at some point',

		// ParseResult
		extension_lc: '.jpeg',
		date: _clean_debug(create_better_date('tz:auto', 2016, 2, 2)),
		date_digits: '20160202',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'IMG-WA0001',
		copy_index: undefined,

		// for test
		digit_blocks: '20160202',
		human_ts_current_tz_for_tests: '2016-02-02',
	},

	'IMG-20170721-WA0000.jpg': {
		_comment: 'also WhatsApp',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2017, 7, 21)),
		date_digits: '20170721',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'IMG-WA0000',
		copy_index: undefined,

		// for test
		digit_blocks: '20170721',
		human_ts_current_tz_for_tests: '2017-07-21',
	},

	'Spore_2008-11-09_20-16-07.png': {
		_comment: 'Spore screenshots',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2008, 11, 9, 20, 16, 7)),
		date_digits: '20081109201607',
		digits_pattern: 'xxxx-xx-xx_xx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: 'Spore',
		copy_index: undefined,

		// for test
		digit_blocks: '2008-11-09-20-16-07',
		human_ts_current_tz_for_tests: '2008-11-09_20h16m07',
	},

	'Screenshot_2015-11-14-09-36-22.png': {
		_comment: 'screenshot Android',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2015, 11, 14, 9, 36, 22)),
		date_digits: '20151114093622',
		digits_pattern: 'xxxx-xx-xx-xx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2015-11-14-09-36-22',
		human_ts_current_tz_for_tests: '2015-11-14_09h36m22',
	},

	'Screenshot_20171024-140849.png': {
		_comment: 'screenshot Android (alt)',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2017, 10, 24, 14, 8, 49)),
		date_digits: '20171024140849',
		digits_pattern: 'xxxxxxxx-xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '20171024-140849',
		human_ts_current_tz_for_tests: '2017-10-24_14h08m49',
	},

	'2012-12-15 15.05.47.png': {
		_comment: 'screenshot old ipad / iOS?',

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2012, 12, 15, 15, 5, 47)),
		date_digits: '20121215150547',
		digits_pattern: 'xxxx-xx-xx xx.xx.xx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '2012-12-15-15-05-47',
		human_ts_current_tz_for_tests: '2012-12-15_15h05m47',
	},

	'PSX_20170825_210632.jpg': {
		_comment: 'photoshop express',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2017, 8, 25, 21, 6, 32)),
		date_digits: '20170825210632',
		digits_pattern: 'xxxxxxxx_xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'PSX',
		copy_index: undefined,

		// for test
		digit_blocks: '20170825-210632',
		human_ts_current_tz_for_tests: '2017-08-25_21h06m32',
	},

	// not sure of the source
	'2017-05-18 (2).jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2017, 5, 18)),
		date_digits: '20170518',
		digits_pattern: 'xxxx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: 2,

		// for test
		digit_blocks: '2017-05-18',
		human_ts_current_tz_for_tests: '2017-05-18',
	},

	'2013-04-14_00008.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2013, 4, 14)),
		date_digits: '20130414',
		digits_pattern: 'xxxx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: '00008',
		copy_index: undefined,

		// for test
		digit_blocks: '2013-04-14',
		human_ts_current_tz_for_tests: '2013-04-14',
	},

	'20061107-1-Irrutilo.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2006, 11, 7)),
		date_digits: '20061107',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: '1-Irrutilo',
		copy_index: undefined,

		// for test
		digit_blocks: '20061107',
		human_ts_current_tz_for_tests: '2006-11-07',
	},

	'Screen_20151015-23h01_22001.png': {

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2015, 10, 15, 23, 1, 22, 1)),
		date_digits: '20151015230122001',
		digits_pattern: 'xxxxxxxx-xxhxx_xxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '20151015-23-01-22001',
		human_ts_current_tz_for_tests: '2015-10-15_23h01m22s001',
},

	'2013-10-17_00001.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2013, 10, 17)),
		date_digits: '20131017',
		digits_pattern: 'xxxx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: '00001',
		copy_index: undefined,

		// for test
		digit_blocks: '2013-10-17',
		human_ts_current_tz_for_tests: '2013-10-17',
	},

	'IMG-20151110-WA0000.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2015, 11, 10)),
		date_digits: '20151110',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'IMG-WA0000',
		copy_index: undefined,

		// for test
		digit_blocks: '20151110',
		human_ts_current_tz_for_tests: '2015-11-10',
	},

	'VID_20150423_190241.mp4': {

		// ParseResult
		extension_lc: '.mp4',
		date: _clean_debug(create_better_date('tz:auto', 2015, 4, 23, 19, 2, 41)),
		date_digits: '20150423190241',
		digits_pattern: 'xxxxxxxx_xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '20150423-190241',
		human_ts_current_tz_for_tests: '2015-04-23_19h02m41',
	},

	'Photo on 25-3-19 at 13.36 #3.jpg': {
		_comment: 'macOs photo booth',

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 3, 25, 13, 36)),
		date_digits: '253191336',
		digits_pattern: 'xx-x-xx at xx.xx',
		is_date_ambiguous: false, // not ambiguous before 2025 but ambiguous after that!!!
		meaningful_part: 'Photo #3',
		copy_index: undefined,

		// for test
		digit_blocks: '25-3-19-13-36',
		human_ts_current_tz_for_tests: '2019-03-25_13h36',
	},

	'2019-03-07.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 3, 7)),
		date_digits: '20190307',
		digits_pattern: 'xxxx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '2019-03-07',
		human_ts_current_tz_for_tests: '2019-03-07',
	},

	'WhatsApp Image 2019-06-23 at 01.30.52(1).jpeg': {
		_comment: 'copy index with no space before ()',

		// ParseResult
		extension_lc: ".jpeg",
		date: _clean_debug(create_better_date('tz:auto', 2019, 6, 23, 1, 30, 52)),
		date_digits: "20190623013052",
		digits_pattern: "xxxx-xx-xx at xx.xx.xx",
		is_date_ambiguous: false,
		meaningful_part: 'WhatsApp Image',
		copy_index: 1,

		// for test
		digit_blocks: '2019-06-23-01-30-52',
		human_ts_current_tz_for_tests: '2019-06-23_01h30m52',
	},

	// seen but maybe manual?
	'20180603_taronga_vivd.gif': {

		// ParseResult
		extension_lc: '.gif',
		date: _clean_debug(create_better_date('tz:auto', 2018, 6, 3)),
		date_digits: '20180603',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'taronga_vivd',
		copy_index: undefined,

		// for test
		digit_blocks: '20180603',
		human_ts_current_tz_for_tests: '2018-06-03',
},
	'20190429_154907_resized.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 4, 29, 15, 49, 7)),
		date_digits: '20190429154907',
		digits_pattern: 'xxxxxxxx_xxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'resized',
		copy_index: undefined,

		// for test
		digit_blocks: '20190429-154907',
		human_ts_current_tz_for_tests: '2019-04-29_15h49m07',
},

	// already formatted by us
	// v1
	'MM2019-07-31_21h00m15s123_screenshot.png': {

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2019, 7, 31, 21, 0, 15, 123)),
		date_digits: '20190731210015123',
		digits_pattern: 'xxxx-xx-xx_xxhxxmxxsxxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2019-07-31-21-00-15-123',
		human_ts_current_tz_for_tests: '2019-07-31_21h00m15s123',
	},
	'MM2019-07-31_21h00m15_screenshot.png': {

		// ParseResult
		extension_lc: '.png',
		date: _clean_debug(create_better_date('tz:auto', 2019, 7, 31, 21, 0, 15)),
		date_digits: '20190731210015',
		digits_pattern: 'xxxx-xx-xx_xxhxxmxx',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
		copy_index: undefined,

		// for test
		digit_blocks: '2019-07-31-21-00-15',
		human_ts_current_tz_for_tests: '2019-07-31_21h00m15',
	},
	// v0
	'20170303_12h00+45.632.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2017, 3, 3, 12, 0, 45, 632)),
		date_digits: '20170303120045632',
		digits_pattern: 'xxxxxxxx_xxhxx+xx.xxx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '20170303-12-00-45-632',
		human_ts_current_tz_for_tests: '2017-03-03_12h00m45s632',
	},
	'20190311_20h24+06-i6-IMG_7794.JPG': {

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 3, 11, 20, 24, 6)),
		date_digits: '20190311202406',
		digits_pattern: 'xxxxxxxx_xxhxx+xx',
		is_date_ambiguous: false,
		meaningful_part: 'i6-IMG_7794',
		copy_index: undefined,

		// for test
		digit_blocks: '20190311-20-24-06',
		human_ts_current_tz_for_tests: '2019-03-11_20h24m06',
	},

	// folders
	'20181026 - weekend special': {

		// ParseResult
		extension_lc: '',
		date: _clean_debug(create_better_date('tz:auto', 2018, 10, 26)),
		date_digits: '20181026',
		digits_pattern: 'xxxxxxxx',
		is_date_ambiguous: false,
		meaningful_part: 'weekend special',
		copy_index: undefined,

		// for test
		digit_blocks: '20181026',
		human_ts_current_tz_for_tests: '2018-10-26',
	},

	// constructed, to show corner cases
	'voyage à Paris 2019-08-15.jpg': { // date at the end

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 8, 15)),
		date_digits: '20190815',
		digits_pattern: 'xxxx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: 'voyage à Paris',
		copy_index: undefined,

		// for test
		digit_blocks: '2019-08-15',
		human_ts_current_tz_for_tests: '2019-08-15',
	},
	'2019-08-15- 00- voyage à Paris .jpg': { // date collated with extra non-date digits (actual bug)

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 8, 15)),
		date_digits: '20190815',
		digits_pattern: 'xxxx-xx-xx',
		is_date_ambiguous: false,
		meaningful_part: '00- voyage à Paris',
		copy_index: undefined,

		// for test
		digit_blocks: '2019-08-15',
		human_ts_current_tz_for_tests: '2019-08-15',
	},
	'2019-12-16T09:38:08.123Z.jpg': { // toISOString / toJSON

		// ParseResult
		extension_lc: '.jpg',
		date: _clean_debug(create_better_date('tz:auto', 2019, 12, 16, 9, 38, 8, 123)),
		date_digits: '20191216093808123',
		digits_pattern: 'xxxx-xx-xxTxx:xx:xx.xxx',
		is_date_ambiguous: false,
		meaningful_part: '',
		copy_index: undefined,

		// for test
		digit_blocks: '2019-12-16-09-38-08-123',
		human_ts_current_tz_for_tests: '2019-12-16_09h38m08s123',
	},

}

export const UNDATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	'PICT0012.JPG': {
		_comment: 'old camera',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'PICT0012',
		copy_index: undefined,

		// for test
		digit_blocks: '0012',
	},

	// looks like a date but numbers don't match
	'WoWScrnShot_032407_100101.tga': {
		_comment: 'World of Warcraft screenshots',

		// ParseResult
		extension_lc: '.tga',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'WoWScrnShot_032407_100101',
		copy_index: undefined,

		// for test
		digit_blocks: '032407-100101',
	},

	'P1000010.JPG': {
		_comment: 'stupid prehistoric phone',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'P1000010',
		copy_index: undefined,

		// for test
		digit_blocks: '1000010',
	},

	'IMG_3211.JPG': {
		_comment: 'stupid Apple',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'IMG_3211',
		copy_index: undefined,

		// for test
		digit_blocks: '3211',
	},

	// too ambiguous
	'Photo_021309_006.jpg': {
		_comment: 'palm',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'Photo_021309_006',
		copy_index: undefined,

		// for test
		digit_blocks: '021309-006',
	},

	// too ambiguous
	'img071009-131340.jpg': {
		_comment: 'palm img',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'img071009-131340',
		copy_index: undefined,

		// for test
		digit_blocks: '071009-131340',
	},

	// no block is a correct date
	'170455_10150886974822066_2009091174_o.jpg': {
		_comment: 'maybe facebook',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '170455_10150886974822066_2009091174_o',
		copy_index: undefined,

		// for test
		digit_blocks: '170455-10150886974822066-2009091174',
	},

	// others
	'TR81801414546EGJ.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'TR81801414546EGJ',
		copy_index: undefined,

		// for test
		digit_blocks: '81801414546',
	},

	'ANWP7390.JPG': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'ANWP7390',
		copy_index: undefined,

		// for test
		digit_blocks: '7390',
	},

	'DSC_0085.JPG': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'DSC_0085',
		copy_index: undefined,

		// for test
		digit_blocks: '0085',
	},

	'Image from iOS (17).jpg': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'Image from iOS',
		copy_index: 17,

		// for test
		digit_blocks: '',
	},

	'USER_SCOPED_TEMP_DATA_orca-image--1274802997.jpeg': {
		// ParseResult
		extension_lc: '.jpeg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'USER_SCOPED_TEMP_DATA_orca-image--1274802997',
		copy_index: undefined,

		// for test
		digit_blocks: '1274802997',
	},

	'IMAG0556.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'IMAG0556',
		copy_index: undefined,

		// for test
		digit_blocks: '0556',
	},

	'181026_195329_Halloween_0388.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '181026_195329_Halloween_0388',
		copy_index: undefined,

		// for test
		digit_blocks: '181026-195329',
	},

	'377b892d-ab1c-4e55-a3f0-7eaf2373c10a.jpg': {
		_comment: 'maybe facebook',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '377b892d-ab1c-4e55-a3f0-7eaf2373c10a',
		copy_index: undefined,

		// for test
		digit_blocks: '377',
	},

	'T2 (17-22 weeks) 0052.jpg': {
		_comment: 'baby ultrasound',

		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'T2 (17-22 weeks) 0052',
		copy_index: undefined,

		// for test
		digit_blocks: '2-17-22',
	},

	'avocado_media_1425910682493.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'avocado_media_1425910682493',
		copy_index: undefined,

		// for test
		digit_blocks: '1425910682493',
	},

	'N1z9_Q79SSj9HUv9d_1yBv0U_Uf9AELBGX4N_TtcEf39RHQa_UP9_f39imAP-thumb.jpeg': {
		// ParseResult
		extension_lc: '.jpeg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'N1z9_Q79SSj9HUv9d_1yBv0U_Uf9AELBGX4N_TtcEf39RHQa_UP9_f39imAP-thumb',
		copy_index: undefined,

		// for test
		digit_blocks: '39',
	},
}

export const NON_MEANINGFUL_NAMES_SAMPLES: { [k: string]: NameDetails } = [

	// trimming
	'foo .jpg',
	' foo.jpg',
	' foo .jpg',

	/////// copy markers
	'foo (3).jpg',

	// en
	'foo - copy.jpg',
	'foo copy.jpg',
	'foo copy 4.jpg',

	'Copy of foo.jpg',
	'copy of foo.jpg',
	'Copy (3) of foo.jpg',

	// fr
	'copie de secours de foo.jpg',
	'Copie de foo.jpg',
	'copie de foo.jpg',
	'copie (3) de foo.jpg',

	'foo - copie.jpg',
	'foo - Copie.jpg',
	'foo - copie 7.jpg',
	'foo copie.jpg',

	// multiple copy markers
	'foo (3)(1).jpg', // seen
	'Copy of foo (2) - copy.jpg',
].reduce((acc, val, index) => {
	acc[val] = {
		// ParseResult
		extension_lc: '.jpg',
		date: undefined,
		date_digits: undefined,
		digits_pattern: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'foo',
		digit_blocks: '',
		copy_index: [,,, 3, 0,0,4, 0,0,3, 0,0,0,3, 0,0,7,0, 3,2][index],
	}
	return acc
}, {} as { [k: string]: NameDetails })

/////////////////////

export const ALL_SAMPLES: { [k: string]: NameDetails } = {
	...DATED_NAMES_SAMPLES,
	...UNDATED_NAMES_SAMPLES,
	...NON_MEANINGFUL_NAMES_SAMPLES,
}

/////////////////////
