const stylizeString = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

const {
	get_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_ms,
	get_human_readable_UTC_timestamp_seconds,
	get_human_readable_UTC_timestamp_minutes,
	get_human_readable_UTC_timestamp_days,
} = require('..')

console.log(boxify(`
import {  } from '${stylizeString.bold(PKG_JSON.name)}'

get_UTC_timestamp_ms()                     "${get_UTC_timestamp_ms()}"
get_human_readable_UTC_timestamp_ms()      "${get_human_readable_UTC_timestamp_ms()}"
get_human_readable_UTC_timestamp_seconds() "${get_human_readable_UTC_timestamp_seconds()}"
get_human_readable_UTC_timestamp_minutes() "${get_human_readable_UTC_timestamp_minutes()}"
get_human_readable_UTC_timestamp_days()    "${get_human_readable_UTC_timestamp_days()}"
`.trim()))
