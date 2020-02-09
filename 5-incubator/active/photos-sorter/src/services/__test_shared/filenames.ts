import { ParseResult } from '../name_parser'

interface NameDetails extends Omit<ParseResult, 'original_name'> {
	_comment?: string
	digit_blocks: string
	human_ts?: string
}

// all taken from my actual files in my library

export const DATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	// 0
	'IMG_20130525.JPG': {
		_comment: 'intelligent Android',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1372118400000,
		digits: '20130525',
		is_date_ambiguous: false,
		meaningful_part: 'IMG',

		// for test
		digit_blocks: '20130525',
		human_ts: '2013-05-25',
	},

	'Screen Shot 2018-01-15 at 08.55.38.png': {
		_comment: 'screenshot macOS en',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1518684938000,
		digits: '20180115085538',
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
		timestamp_ms: 1513105670000,
		digits: '20171112190750',
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
		timestamp_ms: 1493034257000,
		digits: '20170324114417',
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
		timestamp_ms: 1410658668001,
		digits: '20140814013748001',
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
		timestamp_ms: 29654038326000,
		digits: '29082013005206',
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
		timestamp_ms: 0,
		digits: '20100626094952',
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
		digits: '20110517164754',
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
		timestamp_ms: 0,
		digits: '20140121202914',
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
		digits: '20150510175834',
		is_date_ambiguous: false,
		meaningful_part: 'IMG',

		// for test
		digit_blocks: '20150510-175834',
		human_ts: '2015-05-10_17h58m34',
	},

	// 10
	'IMG-20160202-WA0001.jpeg': {
		_comment: 'WhatsApp at some point',

		// ParseResult
		extension_lc: '.jpeg',
		timestamp_ms: 1454371200000,
		digits: '20160202',
		is_date_ambiguous: false,
		meaningful_part: 'WA0001',

		// for test
		digit_blocks: '20160202',
		human_ts: '2016-02-02',
	},

	'IMG-20170721-WA0000.jpg': {
		_comment: 'also WhatsApp',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20170721',
		is_date_ambiguous: false,
		meaningful_part: 'WA0000',

		// for test
		digit_blocks: '20170721',
		human_ts: '2017-07-21',
	},

	'Spore_2008-11-09_20-16-07.png': {
		_comment: 'Spore screenshots',

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 0,
		digits: '20081109201607',
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
		digits: '20151114093622',
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
		digits: '20171024140849',
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
		timestamp_ms: 0,
		digits: '20121215150547',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',

		// for test
		digit_blocks: '2012-12-15-15-05-47',
		human_ts: '2012-12-15_15h05m47',
	},

	'PSX_20170825_210632.jpg': {
		_comment: 'photoshop express',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1503695192000,
		digits: '20170825210632',
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
		timestamp_ms: 1365897680000,
		digits: '20170518',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '2017-05-18',
		human_ts: '2017-05-18',
	},

	// TODO subtle
	'2013-04-14_00008.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 1365897600000,
		digits: '20130414',
		is_date_ambiguous: false,
		meaningful_part: '00008',

		// for test
		digit_blocks: '2013-04-14',
		human_ts: '2013-04-14',
},

	// TODO subtle
	'20061107-1-Irrutilo.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20061107',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',

		// for test
		digit_blocks: '20061107',
		human_ts: '2006-11-07',
	},

	// 20
	'Screen_20151015-23h01_22001.png': {

		// ParseResult
		extension_lc: '.png',
		timestamp_ms: 1444950082001,
		digits: '20151015230122001',
		is_date_ambiguous: false,
		meaningful_part: 'screenshots',

		// for test
		digit_blocks: '20151015-23-01-22001',
		human_ts: '2015-10-15_23h01m22s001',
},

	'2013-10-17_00001.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20131017',
		is_date_ambiguous: false,
		meaningful_part: '00001',

		// for test
		digit_blocks: '2013-10-17',
		human_ts: '2013-10-17',
	},

	'IMG-20151110-WA0000.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20151110',
		is_date_ambiguous: false,
		meaningful_part: 'WA0000',

		// for test
		digit_blocks: '20151110',
		human_ts: '2015-11-10',
	},

	'VID_20150423_190241.mp4': {

		// ParseResult
		extension_lc: '.mp4',
		timestamp_ms: 1429815761000,
		digits: '20150423190241',
		is_date_ambiguous: false,
		meaningful_part: 'VID',

		// for test
		digit_blocks: '20150423-190241',
		human_ts: '2015-04-23_19h02m41',
	},

	'Photo on 25-3-19 at 13.36 #3.jpg': {
		_comment: 'macOs photo booth',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '253191336',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',

		// for test
		digit_blocks: '25-3-19-13-36',
		human_ts: '2019-03-25_13h36',
	},

	'2019-03-07.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20190307',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',

		// for test
		digit_blocks: '2019-03-07',
		human_ts: '2019-03-07',
	},

	// seen but maybe manual?
	'20180603_taronga_vivd.gif': {

		// ParseResult
		extension_lc: '.gif',
		timestamp_ms: 0,
		digits: '20180603',
		is_date_ambiguous: false,
		meaningful_part: 'taronga_vivd',

		// for test
		digit_blocks: '20180603',
		human_ts: '2018-06-03',
},
	'20190429_154907_resized.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20190429154907',
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
		timestamp_ms: 0,
		digits: '20170303120045632',
		is_date_ambiguous: false,
		meaningful_part: '',

		// for test
		digit_blocks: '20170303-12-00-45-632',
		human_ts: '2017-03-03_12h00m45s632',
},
	'20190311_20h24+06-i6-IMG_7794.JPG': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20190311202406',
		is_date_ambiguous: false,
		meaningful_part: 'IMG_7794',

		// for test
		digit_blocks: '20190311-20-24-06',
		human_ts: '2019-03-11_20h24m06',
	},

	// constructed, to show corner cases
	'voyage à Paris 2019-08-15.jpg': {

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20190815',
		is_date_ambiguous: false,
		meaningful_part: 'voyage à Paris',

		// for test
		digit_blocks: '2019-08-15',
		human_ts: '2019-08-15',
	},
}

/*
export const UNDATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	// looks like a date but numbers don't match
	'WoWScrnShot_032407_100101.tga': {
		_comment: 'World of Warcraft screenshots',
		extension_lc: '.tga',
		date: 'xxx',
		meaningful_part: 'WoWScrnShot',
	},

	'P1000010.JPG': {
		_comment: 'stupid prehistoric phone',
		extension_lc: '.jpg',
		date: null,
		meaningful_part: 'P1000010',
	},

	'IMG_3211.JPG': {
		_comment: 'stupid Apple',
		extension_lc: '.jpg',
		date: '20181121_06h00+45',
		meaningful_part: 'xxx',
	},

	// too ambiguous
	'Photo_021309_006.jpg': {
		_comment: 'palm',
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		meaningful_part: 'xxx',
	},

	// ambiguous but may be a date
	'img071009-131340.jpg': {
		_comment: 'palm img',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20071009_13h13+40.000',
		human_ts: '',
		is_date_ambiguous: true,
		meaningful_part: 'img',
	},


	'170455_10150886974822066_2009091174_o.jpg': {
		_comment: 'maybe facebook',

		// ParseResult
		extension_lc: '.jpg',
		timestamp_ms: 0,
		digits: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',

		// for test
		digit_blocks: '',
		human_ts: '',
},

	// others
	'TR81801414546EGJ.jpg', // lot of digits but not a date
	'ANWP7390.JPG', // seen
	'DSC_0085.JPG', // seen
	'Image from iOS (17).jpg',
	'USER_SCOPED_TEMP_DATA_orca-image--1274802997', // seen
	'IMAG0556.jpg',
	'181026_195329_Halloween_0388.jpg', // ? scanner from printer?
	'377b892d-ab1c-4e55-a3f0-7eaf2373c10a.jpg', // maybe facebook
	'T2 (17-22 weeks) 0052.jpg', // baby ultrasound
	'avocado_media_1425910682493.jpg',
	'N1z9_Q79SSj9HUv9d_1yBv0U_Uf9AELBGX4N_TtcEf39RHQa_UP9_f39imAP-thumb.jpeg',
*/
