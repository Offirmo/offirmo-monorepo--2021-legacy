const moment = require('moment')
const moment_business = require('moment-business')

// The problem
// https://momentjs.com/guides/#/parsing/local-utc-zone/
// https://github.com/photostructure/exiftool-vendored.js#dates


function get_trivial_timestamp_auto_no_tz(date) {
	const YYYY = date.getFullYear()
	const MM = String(date.getMonth() + 1).padStart(2, '0')
	const DD = String(date.getDate()).padStart(2, '0')
	const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')
	const ss = String(date.getSeconds()).padStart(2, '0')
	const mmm = String(date.getMilliseconds()).padStart(3, '0')

	return [ YYYY, MM, DD, hh, mm, ss, mmm ].join('-')
}


function display_date_in_all_ways(date) {
	const mom = moment(date)
	console.log({
		date,
		toInteger: +date,
		toDateString: date.toDateString(),
		toISOString: date.toISOString(),
		toJSON: date.toJSON(),
		toLocaleDateString: date.toLocaleDateString(),
		toLocaleString: date.toLocaleString(),
		toLocaleTimeString: date.toLocaleTimeString(),
		toString: date.toString(),
		toTimeString: date.toTimeString(),
		toUTCString: date.toUTCString(),
		getTimezoneOffset: date.getTimezoneOffset(),
		'moment.utcOffset': mom.utcOffset(),
		getHours: date.getHours(),
		get_trivial_timestamp_auto_no_tz: get_trivial_timestamp_auto_no_tz(date),
		'moment_business.isWeekDay': moment_business.isWeekDay(mom),
	})
}


console.log('******* system check *******')
;(() => {
	const date = new Date()
	console.log('- current tz offset:', date.getTimezoneOffset())
})()

console.log('******* Vanilla date by fragments *******')
;(() => {
	const params = [ 2019,11,16,20,38,8,123 ]
	console.log({ params })
	const date = new Date(...params)
	display_date_in_all_ways(date)
	console.log(`- ${(moment(date).utcOffset() !== 0) ? 'HAS' : 'HAS NO'} timezone offset [${moment(date).utcOffset()}]`)
	const iso = date.toISOString()
	console.log(`- ISO is ${(iso === '2019-12-16T20:38:08.123Z') ? '✅' : '❌ NOT'} matching the fragments [${iso}]`)
	const notz = get_trivial_timestamp_auto_no_tz(date)
	console.log(`- NOTZ is ${(notz === '2019-12-16-20-38-08-123') ? '✅' : '❌ NOT'} matching the fragments [${notz}]`)
})()


console.log('******* Vanilla date by string *******')
;(() => {
	const params = [ '2019-12-16T20:38:08.123Z' ]
	console.log({ params })
	const date = new Date(...params)
	display_date_in_all_ways(date)
	console.log(`- ${(moment(date).utcOffset() !== 0) ? 'HAS' : 'HASN’T '} non-zero timezone [${moment(date).utcOffset()}]`)
	const iso = date.toISOString()
	console.log(`- ISO is ${(iso === '2019-12-16T20:38:08.123Z') ? '✅' : '❌NOT'} matching the fragments [${iso}]`)
	const notz = get_trivial_timestamp_auto_no_tz(date)
	console.log(`- NOTZ is ${(notz === '2019-12-16-20-38-08-123') ? '✅' : '❌NOT'} matching the fragments [${notz}]`)
})()


/*
console.log('******* Vanilla date by timestamp *******')
;(() => {
	// https://www.epochconverter.com/
	const date = new Date(1542780045627)
	display_date_in_all_ways(date)
	console.log(`- ${(moment(date).utcOffset() !== 0) ? 'HAS' : 'HASN’T '} non-zero timezone [${moment(date).utcOffset()}]`)
	const iso = date.toISOString()
	console.log(`- ISO is ${(iso === '2019-12-16T20:38:08.123Z') ? '' : 'NOT '}matching the fragments [${iso}]`)
	const notz = get_trivial_timestamp_auto_no_tz(date)
	console.log(`- NOTZ is ${(notz === '2019-12-16-20-38-08-123') ? '' : 'NOT '}matching the fragments [${notz}]`)
})()
*/
