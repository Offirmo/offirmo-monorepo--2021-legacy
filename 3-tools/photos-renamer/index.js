#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec `dirname $0`/node_modules/.bin/babel-node "$0" "$@"
'use strict';

//import { execute_and_throw } from './get_command_output';


console.log('Hello world !')


const assert = require('tiny-invariant')
const path = require('path')
const fse = require('../../../cli-toolbox/fs/extra')
const fs = require('fs')
//const _ = require('@offirmo/cli-toolbox/lodash')
//const stylize_string = require('@offirmo/cli-toolbox/string/stylize')
//const log_symbols = require('@offirmo/cli-toolbox/string/log-symbols')
//const meow = require('@offirmo/cli-toolbox/framework/meow')
const tildify = require('../../../cli-toolbox/string/tildify')
const columnify = require('../../../cli-toolbox//string/columnify')
const {
	get_human_readable_UTC_timestamp_seconds,
	get_human_readable_UTC_timestamp_days,
} = require('@offirmo-private/timestamps')
const exif_parser = require('exif-parser')

const DATE_TS_LENGTH = '20xxMMDD'.length
const NOW = +(new Date())

const { prettify_json } = require('@offirmo-private/prettify-json')

//const root = '/Users/yjutard/Documents/- photos/02 - en cours/00000000 - inbox'
const root = '/Users/yjutard/Documents/- photos/xxTESTxx/inbox'

const root_dirname = path.basename(root)
const parent = path.resolve(root, '..')
console.log('* input:\n' + prettify_json({ root, root_dirname, parent }))
//console.log(fs.constants)

const USEFUL_BYTES = 65635

//console.log(fse.readdirSync(path.resolve(root)))

/*console.log({
	d1: get_ideal_directory_name()
})*/

function get_ideal_directory_name(timestamp) {
	let date = new Date(timestamp)

	if (date.getDay() === 0) {
		// sunday is coalesced to sat = start of weekend
		const timestamp_one_day_before = timestamp - (1000 * 3600 * 24)
		date = new Date(timestamp_one_day_before)
	}

	const radix = get_human_readable_UTC_timestamp_days(date)

	return radix + ' - ' + (date.getDay() === 6 ? 'weekend' : 'life')
}

function get_best_creation_timestamp(full_path) {
	return new Promise((resolve, reject) => {
		fs.stat(full_path, (err, stats) => {
			if (err) return reject(err)

			//const { birthtimeMs } = stats
			const birthtime = +(new Date(`${stats.birthtime.toLocaleString()} UTC`))
			let DateTimeOriginal = undefined
			let CreateDate = undefined

			fs.open(
				full_path,
				fs.constants.O_RDONLY,
				(err, fd) => {
					if (err) return reject(err)

					const b = new ArrayBuffer(USEFUL_BYTES)
					fs.read(fd, Buffer.from(b), 0, USEFUL_BYTES, null, (err, bytesRead, buffer) => {
						if (err) return reject(err)

						//console.log({bytesRead})
						const parser = exif_parser.create(buffer)
						try {
							const result = parser.parse()
							//console.log(prettify_json(result))

							const { CreateDate: _CreateDate, DateTimeOriginal: _DateTimeOriginal} = result.tags || {}
							if (_CreateDate)
								CreateDate = _CreateDate * 1000
							else if (_DateTimeOriginal)
								CreateDate = _DateTimeOriginal * 1000

							if (_DateTimeOriginal)
								DateTimeOriginal = _DateTimeOriginal * 1000
							else if (_CreateDate)
								DateTimeOriginal = _CreateDate * 1000
						}
						catch (err) {
							// ignore
						}

						let final_tms = CreateDate || birthtime

						/*
						console.log(prettify_json({
							//path: fp,
							//full_path,
							//parent_path,
							//stats,
							//birthtime: birthtime ? `${birthtime} = ${get_human_readable_UTC_timestamp_seconds(new Date(birthtime))}` : 'n/a',
							//birthtimeMs: birthtimeMs ? `${birthtimeMs} = ${get_human_readable_UTC_timestamp_seconds(new Date(birthtimeMs))}` : 'n/a',
							//DateTimeOriginal: DateTimeOriginal ? `${DateTimeOriginal} = ${get_human_readable_UTC_timestamp_seconds(new Date(DateTimeOriginal))}` : 'n/a',
							//CreateDate: CreateDate ? `${CreateDate} = ${get_human_readable_UTC_timestamp_seconds(new Date(CreateDate))}` : 'n/a',
							final_tms: final_tms ? `${final_tms} = ${get_human_readable_UTC_timestamp_seconds(new Date(final_tms))}` : 'n/a',
						}))
						*/

						assert(CreateDate === DateTimeOriginal, 'exif coherency')
						if (CreateDate) {
							assert(CreateDate <= birthtime, 'exif vs. file creation')
							//assert((CreateDate + 1000 * 3600 * 24) > birthtime, '3')
						}
						assert(final_tms > 946684800000, 'final > 2000/01/01')
						assert(final_tms < NOW, 'final < now')

						resolve(final_tms)
					})
				}
			)
		})
	})
}

function process_file(fp, parent_path) {
	return new Promise((resolve, reject) => {
		const full_path = path.join(parent_path, fp)

		return get_best_creation_timestamp(full_path)
			.then(final_ts => {

				console.log(prettify_json({
					path: fp,
					full_path,
					//parent_path,
					//stats,
					//birthtime: birthtime ? `${birthtime} = ${get_human_readable_UTC_timestamp_seconds(new Date(birthtime))}` : 'n/a',
					//birthtimeMs: birthtimeMs ? `${birthtimeMs} = ${get_human_readable_UTC_timestamp_seconds(new Date(birthtimeMs))}` : 'n/a',
					//DateTimeOriginal: DateTimeOriginal ? `${DateTimeOriginal} = ${get_human_readable_UTC_timestamp_seconds(new Date(DateTimeOriginal))}` : 'n/a',
					//CreateDate: CreateDate ? `${CreateDate} = ${get_human_readable_UTC_timestamp_seconds(new Date(CreateDate))}` : 'n/a',
					final_ts: `${final_ts} = ${get_human_readable_UTC_timestamp_seconds(new Date(final_ts))}`,
					target_dir: get_ideal_directory_name(final_ts),
				}))
			})
	})
	.catch(err => {
		console.error(`While processing "${fp}":`, err)
	})
}

function process_dir(dir, options) {
	console.log(`* processing dir "${dir}"…`)

	const all_files = fse.lsFiles(dir, { full_path: false })
	const interesting_files = all_files
		.filter(f => f[0] !== '.')
		.filter(f => !(f.startsWith('IMG_20') && f.length >= DATE_TS_LENGTH + 4 + 4))
		.filter(f => !(f.startsWith('VID_20') && f.length >= DATE_TS_LENGTH + 4 + 4))
		.filter(f => !(f.startsWith('20') && f.length >= DATE_TS_LENGTH + 4))
		.filter(f => !f.startsWith('Capture'))
		.filter(f => !f.startsWith('Screen'))
		.filter(f => !f.endsWith('.AAE'))
		//.filter(f => f.startsWith('HOBU'))


	const data = {}
	const in_progress = []
	interesting_files.forEach(f => process_file(f, dir))

	const sub_dirs = fse.lsDirs(dir).map(sub_dir => process_dir(sub_dir, options))
}



process_dir(root, {})

console.log('* Processing images...')
