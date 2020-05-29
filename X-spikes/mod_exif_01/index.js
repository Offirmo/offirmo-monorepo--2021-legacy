
const assert = require('tiny-invariant').default
const { exiftool } = require('exiftool-vendored')
const moment = require('moment')
require('moment-timezone')
const moment_business = require('moment-business')

const { get_creation_date_from_exif, get_time_zone_from_exif } = require('../../5-incubator/active/photos-sorter/dist/src.es2019.cjs/services/exif.js')

// The problem
// https://momentjs.com/guides/#/parsing/local-utc-zone/
// https://github.com/photostructure/exiftool-vendored.js#dates

const ZONE_FR = 'Europe/Paris'
const ZONE_AU = 'Australia/Sydney'
const ZONE_DEFAULT = ZONE_FR

async function test(FILE, expected_hour, expected_tz) {
	console.log('\n\n>>> 🖼 ', FILE)

	const exif_data = await exiftool.read(`X-spikes/mod_exif_01/${FILE}`)
	let { tz, tzSource, DateTimeOriginal } = exif_data
	console.log({ tz, tzSource, DateTimeOriginal })
	//console.log(exif_data)
	const date = get_creation_date_from_exif(exif_data, ZONE_DEFAULT)
	tz = get_time_zone_from_exif(exif_data)
	console.log('from exif:', {date, tz})
	tz = tz || ZONE_DEFAULT

	console.log('Results:')
	const mom = moment(date)
	console.log('default'.padStart(20), mom.format('YYYY-MM-DD HH:mm'))
	console.log(ZONE_FR.padStart(20), mom.tz(ZONE_FR).format('YYYY-MM-DD HH:mm'))
	console.log(ZONE_AU.padStart(20), mom.tz(ZONE_AU).format('YYYY-MM-DD HH:mm'))
	console.log(tz.padStart(20), mom.tz(tz).format('YYYY-MM-DD HH:mm'))
	assert(mom.tz(tz).format('HH:mm') === expected_hour, `hour for ${FILE}`)
	assert(tz === expected_tz, `tz for ${FILE}`)
}

;(async () => {

	await test('exif_date_fr_no_tz_conflicting_fs.jpg', '21:28', ZONE_DEFAULT)
	await test('exif_date_fr_alt_no_tz_conflicting_fs.jpg', '16:05', ZONE_DEFAULT)
	await test('au_no_exif_date_no_tz.jpg', '11:37', ZONE_DEFAULT)
	await test('exif_date_cn_exif_gps.jpg', '20:46', 'Asia/Shanghai')

	await (async () => {})()

})()
.then(() => {
	console.log('done')
})
.finally(() => exiftool.end())
