#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec `dirname $0`/node_modules/.bin/babel-node "$0" "$@"
'use strict';

//import { execute_and_throw } from './get_command_output';


console.log('Hello world !')

const util = require('util');
const path = require('path')
const fs = require('../../../cli-toolbox/fs/extra')

const assert = require('tiny-invariant')
//const _ = require('@offirmo/cli-toolbox/lodash')
const stylize_string = require('../../../cli-toolbox/string/stylize')
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

const { prettify_json, dump_pretty_json } = require('@offirmo-private/prettify-json')

const root = `/Users/${process.env.USER}/Documents/- photos/02 - en cours/00000000 - inbox`
//const root = `/Users/${process.env.USER}/Documents/- photos/xxTESTxx/inbox`

const root_dirname = path.basename(root)
const parent = path.resolve(root, '..')
const existing_siblings = fs.lsDirsSync(parent, {full_path: false})
const existing_dated_dirs = {}
existing_siblings
	.filter(s => s.startsWith('20'))
	.forEach(sib => existing_dated_dirs[sib.slice(0, 8)] = sib
)
//console.log(fs.constants)

const USEFUL_BYTES = 65635
const dry_run = false

dump_pretty_json('* input:', {
	user: process.env.USER,
	root,
	root_dirname,
	parent,
	dry_run,
	//existing_dated_dirs,
}, { indent: 2 })

//console.log(fs.readdirSync(path.resolve(root)))

/*console.log({
	d1: get_ideal_directory_name()
})*/

async function ensure_dir(full_dir_path) {
	const base = path.basename(full_dir_path)
	const radix = base.slice(0, 8)
	const is_existing = !!existing_dated_dirs[radix]

	/*dump_pretty_json('  * ensuring new dir:',{
		full_dir_path,
		//base,
		//radix,
		//existing_dated_dirs,
		//is_existing,
		//obj: existing_dated_dirs[radix],
	}, { indent: 6 })*/

	if (is_existing) return

	await util.promisify(fs.mkdirp)(full_dir_path)
	existing_dated_dirs[radix] = base
}

function get_ideal_directory_name(timestamp) {
	let date = new Date(timestamp)

	if (date.getUTCDay() === 0) {
		// sunday is coalesced to sat = start of weekend
		const timestamp_one_day_before = timestamp - (1000 * 3600 * 24)
		date = new Date(timestamp_one_day_before)
	}

	const radix = get_human_readable_UTC_timestamp_days(date)

	return existing_dated_dirs[radix] || (radix + ' - ' + (date.getUTCDay() === 6 ? 'weekend' : 'life'))
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

						let extra = ''
						//console.log({bytesRead})
						const parser = exif_parser.create(buffer)
						try {
							const result = parser.parse()
							//console.log(prettify_json(result))

							const { CreateDate: _CreateDate, DateTimeOriginal: _DateTimeOriginal, Model} = result.tags || {}
							if (_CreateDate)
								CreateDate = _CreateDate * 1000
							else if (_DateTimeOriginal)
								CreateDate = _DateTimeOriginal * 1000

							if (_DateTimeOriginal)
								DateTimeOriginal = _DateTimeOriginal * 1000
							else if (_CreateDate)
								DateTimeOriginal = _CreateDate * 1000

							if (Model.toLowerCase() === 'iphone 6')
								extra = 'i6'
							else if (Model.toLowerCase() === 'iphone 7')
								extra = 'i7'
						}
						catch (err) {
							// ignore
						}

						let final_ts = CreateDate || birthtime

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
							final_ts: final_ts ? `${final_ts} = ${get_human_readable_UTC_timestamp_seconds(new Date(final_ts))}` : 'n/a',
						}))
						*/

						assert(CreateDate === DateTimeOriginal, 'exif coherency')
						if (CreateDate) {
							assert(CreateDate <= birthtime, 'exif vs. file creation')
							//assert((CreateDate + 1000 * 3600 * 24) > birthtime, '3')
						}
						assert(final_ts > 946684800000, 'final > 2000/01/01')
						assert(final_ts < NOW, 'final < now')

						resolve({
							final_ts,
							extra,
						})
					})
				}
			)
		})
	})
}

async function process_file(file_name, parent_path) {
	try {
		const full_path = path.join(parent_path, file_name)
		const {final_ts, extra} = await get_best_creation_timestamp(full_path)
		const date = new Date(final_ts)
		const new_name = get_human_readable_UTC_timestamp_seconds(date) + (extra ? `-${extra}` : '') + '-' + file_name
		const new_dir = path.resolve(parent, get_ideal_directory_name(final_ts))
		const to_file = path.resolve(new_dir, new_name)
		dump_pretty_json(`  * handling ${file_name} = "${full_path}"`,{

			//parent_path,
			//stats,
			//birthtime: birthtime ? `${birthtime} = ${get_human_readable_UTC_timestamp_seconds(new Date(birthtime))}` : 'n/a',
			//birthtimeMs: birthtimeMs ? `${birthtimeMs} = ${get_human_readable_UTC_timestamp_seconds(new Date(birthtimeMs))}` : 'n/a',
			//DateTimeOriginal: DateTimeOriginal ? `${DateTimeOriginal} = ${get_human_readable_UTC_timestamp_seconds(new Date(DateTimeOriginal))}` : 'n/a',
			//CreateDate: CreateDate ? `${CreateDate} = ${get_human_readable_UTC_timestamp_seconds(new Date(CreateDate))}` : 'n/a',
			final_ts: `${final_ts} = ${get_human_readable_UTC_timestamp_seconds(date)} = ${['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'][date.getUTCDay()] + 'day'}`,
			new_name,
			new_dir,
		}, { indent: 4 })

		dump_pretty_json('    * will now rename:',{
			from: full_path,
			to: to_file,
		}, { indent: 6 })

		await ensure_dir(new_dir)

		if (dry_run) return

		await util.promisify(fs.rename)(full_path, to_file)
	} catch (err) {
		console.error(stylize_string.red(`\n\nXXXXXXXX\nWhile processing "${file_name}":`), err)
	}
}

function process_dir(dir, options) {
	console.log(`* processing dir "${dir}"…`)

	const all_files = fs.lsFilesSync(dir, { full_path: false })
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

	const sub_dirs = fs.lsDirsSync(dir).map(sub_dir => process_dir(sub_dir, options))
}



process_dir(root, {})

console.log('* Processing images...')
