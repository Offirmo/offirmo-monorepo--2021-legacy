import { expect } from 'chai'
import { exiftool, ExifDateTime } from 'exiftool-vendored'
import path from 'path'

import { LIB } from '../consts'
import {
	get_creation_date_from_exif,
	get_creation_timezone_from_exif,
} from './exif'
import {
	get_human_readable_timestamp_auto,
	create_better_date_from_ExifDateTime,
} from './better-date'

import {
	MEDIA_DEMO_01_basename,
	MEDIA_DEMO_01_abs_path,
	MEDIA_DEMO_02_basename,
	MEDIA_DEMO_02_abs_path,
	MEDIA_DEMO_03_basename,
	MEDIA_DEMO_03_abs_path,
} from '../__test_shared/real_files'


/////////////////////

describe(`${LIB} - exif service`, function() {

	describe('ExifDatetime', function () {

		it('should have the expected API', () => {
			const out = new ExifDateTime(
				2000,
				1, // 1 = Jan
				13,
				14,
				15,
				16,
				123,
			)

			expect(out.toISOString()).to.equal('2000-01-13T14:15:16.123')
		})
	})

	describe('integration', function() {
		this.timeout(5000) // in parallel, seen bigger delays

		describe('real files', function() {

			it('should work - ' + MEDIA_DEMO_01_basename, async () => {
				const abs_path = MEDIA_DEMO_01_abs_path
				const EXPECTED_TZ = 'Asia/Shanghai'
				const EXPECTED_DATE__ISO_STRING = '2018-09-03T20:46:14.506+08:00'
				const EXPECTED_DATE__HUMAN_AUTO = '2018-09-03_20h46m14s506'

				const exif_data = await exiftool.read(abs_path)
				//console.log('exif data', exif_data)

				expect(exif_data.tz).to.equal(EXPECTED_TZ)
				expect(get_creation_timezone_from_exif(exif_data)).to.equal(EXPECTED_TZ)
				expect(get_creation_date_from_exif(exif_data)!.toISOString()).to.equal(EXPECTED_DATE__ISO_STRING)
				expect(
					get_human_readable_timestamp_auto(
						create_better_date_from_ExifDateTime(
							get_creation_date_from_exif(exif_data)!,
						),
						'tz:embedded',
					)
				).to.equal(EXPECTED_DATE__HUMAN_AUTO)
			})

			it('should work - ' + MEDIA_DEMO_02_basename, async () => {
				const abs_path = MEDIA_DEMO_02_abs_path

				const exif_data = await exiftool.read(abs_path)
				//console.log('exif data', exif_data)

				expect(exif_data.tz).to.equal(undefined)
				expect(get_creation_timezone_from_exif(exif_data)).to.equal(undefined)
				expect(get_creation_date_from_exif(exif_data)!.toISOString()).to.equal('2002-01-26T16:05:50.000')
				expect(
					get_human_readable_timestamp_auto(
						create_better_date_from_ExifDateTime(
							get_creation_date_from_exif(exif_data)!,
						),
						'tz:embedded',
					)
				).to.equal('2002-01-26_16h05m50')
			})

			it('should work - ' + MEDIA_DEMO_03_basename, async () => {
				const abs_path = MEDIA_DEMO_03_abs_path
				const EXPECTED_TZ = 'Asia/Bangkok'
				const EXPECTED_DATE__ISO_STRING = '2017-01-24T12:55:17.000+07:00'
				const EXPECTED_DATE__HUMAN_AUTO = '2017-01-24_12h55m17'

				const exif_data = await exiftool.read(abs_path)
				//console.log('exif data', exif_data)

				expect(exif_data.tz).to.equal(EXPECTED_TZ)
				expect(get_creation_timezone_from_exif(exif_data)).to.equal(EXPECTED_TZ)
				expect(get_creation_date_from_exif(exif_data)!.toISOString()).to.equal(EXPECTED_DATE__ISO_STRING)
				expect(
					get_human_readable_timestamp_auto(
						create_better_date_from_ExifDateTime(
							get_creation_date_from_exif(exif_data)!,
						),
						'tz:embedded',
					)
				).to.equal(EXPECTED_DATE__HUMAN_AUTO)
			})

			// TODO test the horrible whatsapp video


		})
	})
})
