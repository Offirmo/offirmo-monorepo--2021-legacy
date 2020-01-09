import { ParseResult } from '../name_parser'

interface NameDetails extends Omit<ParseResult, 'original_name'> {
	_comment?: string
}

// all taken from my actual files in my library

export const DATED_NAMES_SAMPLES: { [k: string]: NameDetails } = {

	'IMG_20130525.JPG': {
		_comment: 'intelligent Android',
		extension_lc: '.jpg',
		date: '20130525_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'IMG',
	},

	'Screen Shot 2018-01-15 at 08.55.38.png': {
		_comment: 'screenshot macOS en',
		extension_lc: '.jpg',
		date: '20180115_08h55+38.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Capture d\'écran 2017-11-12 19.07.50.png': {
		_comment: ' screenshot old macOs fr',
		extension_lc: '.png',
		date: '20171112_19h07+50.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Capture d’écran 2017-03-24 à 11.44.17.png': {
		_comment: 'screenshot macOs fr',
		extension_lc: '.png',
		date: '20170324_11h44+17.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Capture2014-08-14_0137_48001.png': {
		_comment: 'screenshot Windows?',
		extension_lc: '.png',
		date: '20140814_01h37+48.001',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Capture plein écran 29082013 005206.bmp': {
		_comment: 'screenshot Windows fr?',
		extension_lc: '.bmp',
		date: '20130829_00h52+06.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Capture plein écran 2010-06-26 094952.bmp': {
		_comment: 'alt screenshot Windows fr?',
		extension_lc: '.bmp',
		date: '20100626_09h49+52.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Screen 2011-05-17 16h47+54.png': {
		_comment: 'screenshot with a tool (irfan view?)',
		extension_lc: '.png',
		date: '20110517_16h47+54.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'snapshot_20140121_202914.jpg': {
		_comment: 'screenshot steam?',
		extension_lc: '.jpg',
		date: '20140121_20h29+14.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'IMG_20150510_175834.jpg': {
		_comment: 'I think WhatsApp or maybe Android at some point',
		extension_lc: '.jpg',
		date: '20150510_17h58+34.000',
		is_date_ambiguous: false,
		meaningful_part: 'IMG',
	},

	'IMG-20160202-WA0001.jpeg': {
		_comment: 'WhatsApp at some point',
		extension_lc: '.jpg',
		date: '20160202_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'WA0001',
	},

	'IMG-20170721-WA0000.jpg': {
		_comment: 'also WhatsApp',
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'WA0000',
	},

	'Spore_2008-11-09_20-16-07.png': {
		_comment: 'Spore screenshots',
		extension_lc: '.png',
		date: '20081109_20h16+07.000',
		is_date_ambiguous: false,
		meaningful_part: 'Spore',
	},

	'Screenshot_2015-11-14-09-36-22.png': {
		_comment: 'screenshot Android',
		extension_lc: '.png',
		date: '20151114_09h36+22.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'Screenshot_20171024-140849.png': {
		_comment: 'screenshot Android (alt)',
		extension_lc: '.png',
		date: '20171024_14h08+49.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'2012-12-15 15.05.47.png': {
		_comment: 'screenshot old ipad / iOS?',
		extension_lc: '.png',
		date: '20121215_15h05+47.000',
		is_date_ambiguous: false,
		meaningful_part: 'screenshot',
	},

	'PSX_20170825_210632.jpg': {
		_comment: 'photoshop express',
		extension_lc: '.jpg',
		date: '20170825_21h06+32.000',
		is_date_ambiguous: false,
		meaningful_part: 'PSX',
	},

	// ambiguous but may be a date
	'img071009-131340.jpg': {
		_comment: 'palm img',
		extension_lc: '.jpg',
		date: '20071009_13h13+40.000',
		is_date_ambiguous: true,
		meaningful_part: 'img',
	},

	// not sure of the source
	'2017-05-18 (2).jpg': {
		extension_lc: '.jpg',
		date: '20170518_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: '',
	},
	'2013-04-14_00008.jpg': {
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',
},
	'20061107-1-Irrutilo.jpg': {
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',
},
	'Screen_20151015-23h01_22001.png': {
		extension_lc: '.png',
		date: '20151015_23h01+22.001',
		is_date_ambiguous: false,
		meaningful_part: 'screenshots',
},
	'2013-10-17_00001.jpg': {
		extension_lc: '.jpg',
		date: '20131017_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: '00001',
},
	'IMG-20151110-WA0000.jpg': {
		extension_lc: '.jpg',
		date: '20151110_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'WA0000',
},
	'VID_20150423_190241.mp4': {
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',
},
	'Photo on 25-3-19 at 13.36 #3.jpg': {
		extension_lc: '.jpg',
		date: '20190325_13h36+03.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',
},
	'2019-03-07.jpg': {
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',
},
	'170455_10150886974822066_2009091174_o.jpg': {
		_comment: 'maybe facebook',
		extension_lc: '.jpg',
		date: '20170721_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'xxx',
},

	// seen but maybe manual?
	'20180603_taronga_vivd.gif': {
		extension_lc: '.gif',
		date: '20180603_00h00+00.000',
		is_date_ambiguous: false,
		meaningful_part: 'taronga_vivd',
},
	'20190429_154907_resized.jpg': {
		extension_lc: '.jpg',
		date: '20190429_15h49+07.000',
		is_date_ambiguous: false,
		meaningful_part: 'resized',
},

	// already formatted by us, don't touch
	// TODO update with successive versions
	// v0
	'20170303_12h00+45.632.jpg': {
		extension_lc: '.jpg',
		date: '20170303_12h00+45.632',
		is_date_ambiguous: false,
		meaningful_part: '',
},
	'20190311_20h24+06-i6-IMG_7794.JPG': {
		extension_lc: '.jpg',
		date: '20190311_20h24+06.000',
		is_date_ambiguous: false,
		meaningful_part: 'IMG_7794',
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
