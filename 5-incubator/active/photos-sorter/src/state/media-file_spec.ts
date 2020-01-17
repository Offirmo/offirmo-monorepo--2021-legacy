import { expect } from 'chai'

import { LIB } from '../consts'
import {
	create,
	get_ideal_basename,
} from './media-file'
import {starts_with_human_timestamp_ms} from '../services/matchers'

/////////////////////

type TCIdeal = { [k: string]: string }

const DATED_NAMES_SAMPLES: TCIdeal = {
	// all taken from my actual files in my library

	'P1000010.JPG': '20181121_06h00+45', // stupid prehistoric phone
	'IMG_3211.JPG': '20181121_06h00+45', // stupid Apple
	'IMG_20130525.JPG': '20130525_00h00+00', // intelligent Android
	'Screen Shot 2018-01-15 at 08.55.38.png': 'xx', // screenshot macOS en
	'Capture d\'écran 2017-11-12 19.07.50.png': 'xx', // screenshot old macOs fr
	'Capture d’écran 2017-03-24 à 11.44.17.png': 'xx', // screenshot macOs fr
	'Capture2014-08-14_0137_48001.png': 'xx', // screenshot Windows?
	'Capture plein écran 29082013 005206.bmp': 'xx', // screenshot Windows fr?
	'Capture plein écran 2010-06-26 094952.bmp': 'xx', // alt?
	'Screen 2011-05-17 16h47+54.png': 'xx', // screenshot with a tool (irfan view?)
	'snapshot_20140121_202914.jpg': 'xx', // screenshot steam?
	'IMG_20150510_175834.jpg': 'xx', // I think WhatsApp or maybe Android at some point
	'IMG-20160202-WA0001.jpeg': 'xx', // WhatsApp at some point
	'IMG-20170721-WA0000.jpg': 'xx', // also WhatsApp
	'Spore_2008-11-09_20-16-07.png': 'xx', // Spore screenshots
	'WoWScrnShot_032407_100101.tga': 'xx', // World of Warcraft screenshots
	'Screenshot_2015-11-14-09-36-22.png': 'xx', // screenshot Android
	'Screenshot_20171024-140849.png': 'xx', // screenshot Android
	'2012-12-15 15.05.47.png': 'xx', // screenshot old ipad / iOS?
	'PSX_20170825_210632.jpg': 'xx', // photoshop express
	'Photo_021309_006.jpg': 'xx', // palm
	'img071009-131340.jpg': 'xx', // palm

	// seen, not sure of the source
	'2017-05-18 (2).jpg': 'xx',
	'2013-04-14_00008.jpg': 'xx',
	'20061107-1-Irrutilo.jpg': 'xx',
	'Screen_20151015-23h01_22001.png': 'xx',
	'2013-10-17_00001.jpg': 'xx',
	'IMG-20151110-WA0000.jpg': 'xx', // ?
	'VID_20150423_190241.mp4': 'xx',
	'Photo on 25-3-19 at 13.36 #3.jpg': 'xx',
	'2019-03-07.jpg': 'xx',
	'170455_10150886974822066_2009091174_o.jpg': 'xx', // maybe facebook

	// seen but maybe manual?
	'20180603_taronga_vivd.gif': '20180603_taronga_vivd.gif',
	'20190429_154907_resized.jpg': 'xx',

	// already formatted by us, don't touch
	// TODO update with successive versions
	// v0
	'20170303_12h00+45.632.jpg': '20170303_12h00+45.632.jpg',
	'20190311_20h24+06-i6-IMG_7794.JPG': '20190311_20h24+06',
}

const UNDATED_NAMES_SAMPLES: string[] = [
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
]

describe(`${LIB} - media file state`, function() {

	describe('get_ideal_basename', function () {

		it('should work', () => {
			// TODO update
			const TEST_CASES: TCIdeal = {
				'P1000010.JPG': '20181121_06h00+45-P1000010.jpg', // stupid prehistoric phone
				'IMG_3211.JPG': '20181121_06h00+45-IMG_3211.jpg', // typical Apple
				'TR81801414546EGJ.jpg': '20181121_06h00+45-TR81801414546EGJ.jpg', // lot of digits but not a date
				'IMG_20130525.JPG': 'IMG_20130525.jpg', // TODO typical Android
				'20180603_taronga_vivd.gif': '20180603_taronga_vivd.gif', // already has a date, don't touch
				'20170303_12h00+45.632.jpg': '20170303_12h00+45.632.jpg', // already formatted by us, don't touch
			}
			Object.keys(TEST_CASES).forEach(tc => {
				//console.log( { tc, x: TEST_CASES[tc], m: tc.match(YEAR_RE) } )
				const state = create(tc)
				state.cached.best_creation_date_ms = 1542780045627
				expect(get_ideal_basename(state), tc).to.equal(TEST_CASES[tc])
			})
		})
	})
})
