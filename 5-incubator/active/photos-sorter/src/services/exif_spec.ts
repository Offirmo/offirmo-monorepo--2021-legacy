import { expect } from 'chai'
import { exiftool } from 'exiftool-vendored'
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


/////////////////////

describe(`${LIB} - exif service`, function() {

	describe('ExifDatetime', function () {

		it('should behave as expected')
	})

	describe('integration', function() {

		describe('real files', function() {
			const TEST_FILES_DIR = '../../../src/__test_shared'

			const BN01 = 'exif_date_cn_exif_gps.jpg'
			it('should work - ' + BN01, async () => {
				const basename = BN01
				const abs_path = path.join(__dirname, TEST_FILES_DIR, basename)

				const exif_data = await exiftool.read(abs_path)
				//console.log('exif data', { exif_data })

				expect(exif_data.tz).to.equal('Asia/Shanghai')
				expect(get_creation_timezone_from_exif(exif_data)).to.equal('Asia/Shanghai')
				expect(get_creation_date_from_exif(basename, exif_data)!.toISOString()).to.equal('2018-09-03T20:46:14.506+08:00')
				expect(
					//get_human_readable_timestamp_millis(
					get_human_readable_timestamp_auto(
						create_better_date_from_ExifDateTime(
							get_creation_date_from_exif(basename, exif_data)!,
						),
						'tz:embedded',
					)
				).to.equal('2018-09-03_20h46m14s506')
			})

			const BN02 = 'exif_date_fr_alt_no_tz_conflicting_fs.jpg'
			it('should work - ' + BN02, async () => {
				const basename = BN02
				const abs_path = path.join(__dirname, TEST_FILES_DIR, basename)

				const exif_data = await exiftool.read(abs_path)
				//console.log('exif data', { exif_data })

				expect(exif_data.tz).to.equal(undefined)
				expect(get_creation_timezone_from_exif(exif_data)).to.equal(undefined)
				expect(get_creation_date_from_exif(basename, exif_data)!.toISOString()).to.equal('2002-01-26T16:05:50.000')
				expect(
					//get_human_readable_timestamp_millis(
					get_human_readable_timestamp_auto(
						create_better_date_from_ExifDateTime(
							get_creation_date_from_exif(basename, exif_data)!,
						),
						'tz:embedded',
					)
				).to.equal('2002-01-26_16h05m50')
			})
		})
	})
})
