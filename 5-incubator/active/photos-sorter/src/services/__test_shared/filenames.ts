import { ParseResult } from '../name_parser'

interface NameDetails extends Omit<ParseResult, 'original_name'> {
	_comment?: string
	digit_blocks: string
	human_ts?: string
}

// all taken from my actual files in my library

export const DATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	'PHOTO-2019-12-16-20-38-08 (1).jpg': {
		_comment: '?? macOs / iOs',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1576528688000, // ✅
		date_digits: '20191216203808',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '2019-12-16-20-38-08',
		human_ts: '2019-12-16_20h38m08',
	},

	'IMG_20130525.JPG': {
		_comment: 'intelligent Android',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1369440000000, // ✅
		date_digits: '20130525',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '20130525',
		human_ts: '2013-05-25',
	},

	'Screen Shot 2018-01-15 at 08.55.38.png': {
		_comment: 'screenshot macOS en',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1516006538000, // ✅
		date_digits: '20180115085538',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2018-01-15-08-55-38',
		human_ts: '2018-01-15_08h55m38',
	},

	'Capture d\'écran 2017-11-12 19.07.50.png': {
		_comment: ' screenshot old macOs fr',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1510513670000, // ✅
		date_digits: '20171112190750',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2017-11-12-19-07-50',
		human_ts: '2017-11-12_19h07m50',
	},

	'Capture d’écran 2017-03-24 à 11.44.17.png': {
		_comment: 'screenshot macOs fr',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1490355857000, // ✅
		date_digits: '20170324114417',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2017-03-24-11-44-17',
		human_ts: '2017-03-24_11h44m17',
	},

	'Capture2014-08-14_0137_48001.png': {
		_comment: 'screenshot Windows?',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1407980268001, // ✅
		date_digits: '20140814013748001',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2014-08-14-0137-48001',
		human_ts: '2014-08-14_01h37m48s001',
	},

	'Capture plein écran 29082013 005206.bmp': {
		_comment: 'screenshot Windows fr?',

		// ParseResult
		extension_lc: '.bmp',
		timestamp_ms: 1377737526000, // ✅
		date_digits: '29082013005206',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '29082013-005206',
		human_ts: '2013-08-29_00h52m06',
	},

	'Capture plein écran 2010-06-26 094952.bmp': {
		_comment: 'alt screenshot Windows fr?',

		// ParseResult
		extension_lc: '.bmp',
		timestamp_ms: 1277545792000,
		date_digits: '20100626094952',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2010-06-26-094952',
		human_ts: '2010-06-26_09h49m52',
	},

	'Screen 2011-05-17 16h47+54.png': {
		_comment: 'screenshot with a tool (irfan view?)',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1305650874000,
		date_digits: '20110517164754',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2011-05-17-16-47-54',
		human_ts: '2011-05-17_16h47m54',
	},

	'snapshot_20140121_202914.jpg': {
		_comment: 'screenshot steam?',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1390336154000,
		date_digits: '20140121202914',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '20140121-202914',
		human_ts: '2014-01-21_20h29m14',
	},

	'IMG_20150510_175834.jpg': {
		_comment: 'I think WhatsApp or maybe Android at some point',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1431280714000,
		date_digits: '20150510175834',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '20150510-175834',
		human_ts: '2015-05-10_17h58m34',
	},

	'IMG-20160202-WA0001.jpeg': {
		_comment: 'WhatsApp at some point',

		// ParseResult
		extension_lc: '.jpeg',
		timestamp_ms: 1454371200000,
		date_digits: '20160202',
		is_date_ambiguous: false,
		meaningful_part: 'IMG-WA0001',

		// for test
		digit_blocks: '20160202',
		human_ts: '2016-02-02',
	},

	'IMG-20170721-WA0000.jpg': {
		_comment: 'also WhatsApp',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1500595200000,
		date_digits: '20170721',
		is_date_ambiguous: false,
		meaningful_part: 'IMG-WA0000',

		// for test
		digit_blocks: '20170721',
		human_ts: '2017-07-21',
	},

	'Spore_2008-11-09_20-16-07.png': {
		_comment: 'Spore screenshots',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1226261767000, // ✅
		date_digits: '20081109201607',
		is_date_ambiguous: false,
		meaningful_part: 'Spore',

		// for test
		digit_blocks: '2008-11-09-20-16-07',
		human_ts: '2008-11-09_20h16m07',
	},

	'Screenshot_2015-11-14-09-36-22.png': {
		_comment: 'screenshot Android',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1447493782000,
		date_digits: '20151114093622',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2015-11-14-09-36-22',
		human_ts: '2015-11-14_09h36m22',
	},

	'Screenshot_20171024-140849.png': {
		_comment: 'screenshot Android (alt)',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1508854129000,
		date_digits: '20171024140849',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '20171024-140849',
		human_ts: '2017-10-24_14h08m49',
	},

	'2012-12-15 15.05.47.png': {
		_comment: 'screenshot old ipad / iOS?',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1355583947000, // ✅
		date_digits: '20121215150547',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '2012-12-15-15-05-47',
		human_ts: '2012-12-15_15h05m47',
	},

	'PSX_20170825_210632.jpg': {
		_comment: 'photoshop express',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1503695192000,
		date_digits: '20170825210632',
		is_date_ambiguous: false,
		meaningful_part: 'PSX',

		// for test
		digit_blocks: '20170825-210632',
		human_ts: '2017-08-25_21h06m32',
	},

	// not sure of the source
	'2017-05-18 (2).jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1495065600000,
		date_digits: '20170518',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '2017-05-18',
		human_ts: '2017-05-18',
	},

	'2013-04-14_00008.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1365897600000,
		date_digits: '20130414',
		is_date_ambiguous: false,
		meaningful_part: '00008',

		// for test
		digit_blocks: '2013-04-14',
		human_ts: '2013-04-14',
},

	'20061107-1-Irrutilo.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1162857600000,
		date_digits: '20061107',
		is_date_ambiguous: false,
		meaningful_part: '1-Irrutilo',

		// for test
		digit_blocks: '20061107',
		human_ts: '2006-11-07',
	},

	'Screen_20151015-23h01_22001.png': {

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1444950082001,
		date_digits: '20151015230122001',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '20151015-23-01-22001',
		human_ts: '2015-10-15_23h01m22s001',
},

	'2013-10-17_00001.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1381968000000,
		date_digits: '20131017',
		is_date_ambiguous: false,
		meaningful_part: '00001',

		// for test
		digit_blocks: '2013-10-17',
		human_ts: '2013-10-17',
	},

	'IMG-20151110-WA0000.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1447113600000,
		date_digits: '20151110',
		is_date_ambiguous: false,
		meaningful_part: 'IMG-WA0000',

		// for test
		digit_blocks: '20151110',
		human_ts: '2015-11-10',
	},

	'VID_20150423_190241.mp4': {

		// ParseResult
		extension_lc: '.mp4',
		timestamp_ms: 1429815761000,
		date_digits: '20150423190241',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '20150423-190241',
		human_ts: '2015-04-23_19h02m41',
	},

	'Photo on 25-3-19 at 13.36 #3.jpg': {
		_comment: 'macOs photo booth',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1553520960000,
		date_digits: '253191336',
		is_date_ambiguous: false, // not ambiguous before 2025 but ambiguous after that!!!
		meaningful_part: 'Photo #3',

		// for test
		digit_blocks: '25-3-19-13-36',
		human_ts: '2019-03-25_13h36',
	},

	'2019-03-07.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1551916800000,
		date_digits: '20190307',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '2019-03-07',
		human_ts: '2019-03-07',
	},

	// seen but maybe manual?
	'20180603_taronga_vivd.gif': {

		// ParseResult
		extension_lc: '.gif',
		timestamp_ms: 1527984000000,
		date_digits: '20180603',
		is_date_ambiguous: false,
		meaningful_part: 'taronga_vivd',

		// for test
		digit_blocks: '20180603',
		human_ts: '2018-06-03',
},
	'20190429_154907_resized.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1556552947000,
		date_digits: '20190429154907',
		is_date_ambiguous: false,
		meaningful_part: 'resized',

		// for test
		digit_blocks: '20190429-154907',
		human_ts: '2019-04-29_15h49m07',
},

	// already formatted by us, don't touch
	// TODO update with successive versions
	// v0
	'20170303_12h00+45.632.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1488542445632,
		date_digits: '20170303120045632',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '20170303-12-00-45-632',
		human_ts: '2017-03-03_12h00m45s632',
},
	'20190311_20h24+06-i6-IMG_7794.JPG': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1552335846000,
		date_digits: '20190311202406',
		is_date_ambiguous: false,
		meaningful_part: 'i6-IMG_7794',

		// for test
		digit_blocks: '20190311-20-24-06',
		human_ts: '2019-03-11_20h24m06',
	},

	// folders
	'20181026 - weekend special': {

		// ParseResult
		extension_lc: '',
		timestamp_ms: 1540512000000,
		date_digits: '20181026',
		is_date_ambiguous: false,
		meaningful_part: 'weekend special',

		// for test
		digit_blocks: '20181026',
		human_ts: '2018-10-26',
	},

	// constructed, to show corner cases
	'voyage à Paris 2019-08-15.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1565827200000,
		date_digits: '20190815',
		is_date_ambiguous: false,
		meaningful_part: 'voyage à Paris',

		// for test
		digit_blocks: '2019-08-15',
		human_ts: '2019-08-15',
	},
}

export const UNDATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	// looks like a date but numbers don't match
	'WoWScrnShot_032407_100101.tga': {
		_comment: 'World of Warcraft screenshots',

		// ParseResult
		extension_lc: '.tga',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'WoWScrnShot_032407_100101',

		// for test
		digit_blocks: '032407-100101',
	},

	'P1000010.JPG': {
		_comment: 'stupid prehistoric phone',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'P1000010',

		// for test
		digit_blocks: '1000010',
	},

	'IMG_3211.JPG': {
		_comment: 'stupid Apple',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'IMG_3211',

		// for test
		digit_blocks: '3211',
	},

	// too ambiguous
	'Photo_021309_006.jpg': {
		_comment: 'palm',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'Photo_021309_006',

		// for test
		digit_blocks: '021309-006',
	},

	// too ambiguous
	'img071009-131340.jpg': {
		_comment: 'palm img',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'img071009-131340',

		// for test
		digit_blocks: '071009-131340',
	},

	// no block is a correct date
	'170455_10150886974822066_2009091174_o.jpg': {
		_comment: 'maybe facebook',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '170455_10150886974822066_2009091174_o',

		// for test
		digit_blocks: '170455-10150886974822066-2009091174',
	},

	// others
	'TR81801414546EGJ.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'TR81801414546EGJ',

		// for test
		digit_blocks: '81801414546',
	},

	'ANWP7390.JPG': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'ANWP7390',

		// for test
		digit_blocks: '7390',
	},

	'DSC_0085.JPG': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'DSC_0085',

		// for test
		digit_blocks: '0085',
	},

	'Image from iOS (17).jpg': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'Image from iOS',

		// for test
		digit_blocks: '',
	},

	'USER_SCOPED_TEMP_DATA_orca-image--1274802997.jpeg': {
		// ParseResult
		extension_lc: '.jpeg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'USER_SCOPED_TEMP_DATA_orca-image--1274802997',

		// for test
		digit_blocks: '1274802997',
	},

	'IMAG0556.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'IMAG0556',

		// for test
		digit_blocks: '0556',
	},

	'181026_195329_Halloween_0388.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '181026_195329_Halloween_0388',

		// for test
		digit_blocks: '181026-195329',
	},

	'377b892d-ab1c-4e55-a3f0-7eaf2373c10a.jpg': {
		_comment: 'maybe facebook',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: '377b892d-ab1c-4e55-a3f0-7eaf2373c10a',

		// for test
		digit_blocks: '377',
	},

	'T2 (17-22 weeks) 0052.jpg': {
		_comment: 'baby ultrasound',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'T2 (17-22 weeks) 0052',

		// for test
		digit_blocks: '2-17-22',
	},

	'avocado_media_1425910682493.jpg': {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'avocado_media_1425910682493',

		// for test
		digit_blocks: '1425910682493',
	},

	'N1z9_Q79SSj9HUv9d_1yBv0U_Uf9AELBGX4N_TtcEf39RHQa_UP9_f39imAP-thumb.jpeg': {
		// ParseResult
		extension_lc: '.jpeg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'N1z9_Q79SSj9HUv9d_1yBv0U_Uf9AELBGX4N_TtcEf39RHQa_UP9_f39imAP-thumb',

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
].reduce((acc, val) => {
	acc[val] = {
		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: undefined,
		date_digits: undefined,
		is_date_ambiguous: undefined,
		meaningful_part: 'foo',
		digit_blocks: '',
	}
	return acc
}, {} as { [k: string]: NameDetails })


export const ALL_SAMPLES: { [k: string]: NameDetails } = {
	...DATED_NAMES_SAMPLES,
	...UNDATED_NAMES_SAMPLES,
	...NON_MEANINGFUL_NAMES_SAMPLES,
}
