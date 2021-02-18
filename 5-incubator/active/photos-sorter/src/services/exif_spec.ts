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

import { ALL_MEDIA_DEMOS } from '../__test_shared/real_files'


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

			ALL_MEDIA_DEMOS.forEach(({ data: MEDIA_DEMO }, index) => {
				it(`should work - #${index}: "${MEDIA_DEMO.BASENAME}"`, async () => {

					const exif_data = await exiftool.read(MEDIA_DEMO.ABS_PATH)
					//console.log('exif data', exif_data)

					expect(exif_data.tz).to.equal(MEDIA_DEMO.EMBEDDED_TZ)
					expect(get_creation_timezone_from_exif(exif_data)).to.equal(MEDIA_DEMO.EMBEDDED_TZ)
					expect(get_creation_date_from_exif(exif_data)!.toISOString()).to.equal(MEDIA_DEMO.DATE__ISO_STRING)
					expect(
						get_human_readable_timestamp_auto(
							create_better_date_from_ExifDateTime(
								get_creation_date_from_exif(exif_data)!,
							),
							'tz:embedded',
						)
					).to.equal(MEDIA_DEMO.DATE__HUMAN_AUTO)
				})
			})
		})
	})
})
