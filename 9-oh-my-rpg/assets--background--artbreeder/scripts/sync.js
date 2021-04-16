const path = require('path')

//const { dump_prettified_any } = require('@offirmo-private/prettify-any')
//const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')
const fs = require('@offirmo/cli-toolbox/fs/extra')
const { getLogger } = require('@offirmo/universal-debug-api-node')

////////////////////////////////////

//const display_mode = 'review'
const display_mode = 'dump'
const logger = getLogger({
	//name: 'foo',
	suggestedLevel: 'warn',
})

////////////////////////////////////

const LAST_KNOWN_BG_COUNT = 114 - 16
// path relative to package's root
const SRC_DIR = 'src'
const ASSETS_ROOT_DIR = path.join(SRC_DIR, 'assets')
const ASSETS_SUBDIR_BASENAMES__FIRST_LEVEL = fs.lsDirsSync(ASSETS_ROOT_DIR, { full_path: false })
logger.debug('fs read:', {
	ASSETS_ROOT_DIR,
	ASSETS_SUBDIR_BASENAMES__FIRST_LEVEL,
})
const DATA_SOURCEFILE_PATH = path.join(SRC_DIR, 'data.ts')

////////////////////////////////////
// OUTPUT

const raw_biome_ids = []
const raw_backgrounds = [
	// {
	// biome_id
	// basename
	// transitions_to
	// }
]

////////////////////////////////////
// Data extraction

function autocomplete_raw_biome_id(raw_biome_id) {
	if (!raw_biome_id.startsWith('terrestrial'))
		raw_biome_id = 'terrestrial--' + raw_biome_id

	return raw_biome_id
}

function get_code_biome_id(raw_biome_id) {
	return raw_biome_id.split('--').join('ⵧ')
}

function get_uuid(image_basename) {
	let uuid = image_basename.split('.')[0]
	uuid = uuid.split('_')[0]
	return uuid
}

const unknown_raw_biome_ids = new Set()
function report_unknown_raw_biome(raw_unknown_biome_id) {
	if (unknown_raw_biome_ids.has(raw_unknown_biome_id)) return

	unknown_raw_biome_ids.add(raw_unknown_biome_id)
	logger.warn(`Found reference to an unknown biome: ${raw_unknown_biome_id}`)
}

function compare_backgrounds(b1, b2) {
	if (b1.biome_id !== b2.biome_id) {
		return b1.biome_id.localeCompare(b2.biome_id)
	}

	if (b1.subfolder !== b2.subfolder) {
		if (!b1.subfolder) return -1
		if (!b2.subfolder) return 1
		return b1.subfolder.localeCompare(b2.subfolder)
	}

	if (b1.transitions_to !== b2.transitions_to) {
		return (b1.transitions_to ?? '').localeCompare(b2.transitions_to ?? '')
	}

	return b1.basename.localeCompare(b2.basename)
}

function register_raw_background(raw_bg) {
	// TODO add assertions
	if (raw_bg.basename.includes('small')) {
		logger.warn('Small artbreeder picture need a bigger format!', {...raw_bg, url: 'https://www.artbreeder.com/i?k=' + get_uuid(raw_bg.basename)})
	}
	if (raw_bg.transitions_to && !raw_biome_ids.includes(raw_bg.transitions_to)) {
		report_unknown_raw_biome(raw_bg.transitions_to)
		raw_bg.transitions_to = null
	}
	raw_backgrounds.push(raw_bg)
}

// extract biome ids
const BIOME_SUBFOLDERS = ASSETS_SUBDIR_BASENAMES__FIRST_LEVEL
	.filter(basename => {
		if (!basename.startsWith('biome--')) {
			if (!basename.startsWith('tosort'))
				logger.warn(`ignoring root folder "${basename}". Please check.`)
			return false
		}
		return true
	})

function explore_subfolder(parent_path, subfolder_basename, raw_biome_id) {
	const sub_path = path.join(parent_path, subfolder_basename)
	logger.debug('looking into a subfolder:', { id: raw_biome_id, path: sub_path })

	// backgrounds
	const sub_files = fs.lsFilesSync(sub_path, { full_path: false })
		.filter(basename => !basename.startsWith('.'))
	//console.log({ sub_files })

	sub_files.forEach(basename => {
		register_raw_background({
			biome_id: raw_biome_id,
			basename,
			subfolder: sub_folder_basename,
			features_settlement: sub_folder_basename === 'settlements',
			transitions_to: sub_folder_basename.startsWith('to--') ? autocomplete_raw_biome_id(sub_folder_basename.split('--').slice(1).join('--')) : null,
		})
	})
}


BIOME_SUBFOLDERS.forEach(basename__first_level => {
	const splitted = basename__first_level.split('--')
	/*console.log({
		basename__first_level,
		splitted,
	})*/

	const raw_biome_id = autocomplete_raw_biome_id(splitted.slice(1).join('--'))
	if (raw_biome_id.toLowerCase() !== raw_biome_id) {
		throw new Error(`Error: biome "${raw_biome_id}" should be LC!`)
	}
	logger.info(`found biome "${raw_biome_id}"`)
	raw_biome_ids.push(raw_biome_id)
})

// extract backgrounds
raw_biome_ids.forEach(raw_biome_id => {
	const biome_path = path.join(ASSETS_ROOT_DIR, 'biome--' + raw_biome_id)
	logger.debug('looking into a biome:', { id: raw_biome_id, path: biome_path })

	// backgrounds
	const sub_files = fs.lsFilesSync(biome_path, { full_path: false })
		.filter(basename => !basename.startsWith('.'))
	//console.log({ sub_files })
	sub_files.forEach(basename => {
		register_raw_background({
			biome_id: raw_biome_id,
			basename,
			features_settlement: false,
			transitions_to: null,
		})
	})

	// transitions
	const sub_folders = fs.lsDirsSync(biome_path, { full_path: false })
		.filter(basename => !basename.startsWith('.'))
	//console.log({ sub_folders })
	sub_folders.forEach(sub_folder_basename => {
		const sub_path = path.join(ASSETS_ROOT_DIR, 'biome--' + raw_biome_id, sub_folder_basename)
		logger.debug('looking into a subfolder:', { id: raw_biome_id, path: sub_path })

		// backgrounds
		const sub_files = fs.lsFilesSync(sub_path, { full_path: false })
			.filter(basename => !basename.startsWith('.'))
		//console.log({ sub_files })
		sub_files.forEach(basename => {
			register_raw_background({
				biome_id: raw_biome_id,
				basename,
				subfolder: sub_folder_basename,
				features_settlement: sub_folder_basename === 'settlements',
				transitions_to: sub_folder_basename.startsWith('to--') ? autocomplete_raw_biome_id(sub_folder_basename.split('--').slice(1).join('--')) : null,
			})
		})
	})
})

////////////////////////////////////
// DATA write
raw_backgrounds.sort(compare_backgrounds)

const target_path = path.resolve(process.cwd(), DATA_SOURCEFILE_PATH)
let data = `// THIS FILE IS AUTO GENERATED!
// ${(new Date()).toISOString()}

import { Immutable } from '@offirmo-private/ts-types'

import { Background, BiomeId } from './types'

export const BACKGROUNDS: Immutable<Background[]> = [` + raw_backgrounds.map(bg => {
	return `
	{
		biome_id: BiomeId.${get_code_biome_id(bg.biome_id)},
		basename: '${bg.basename}',${bg.subfolder ? ` subfolder: '${bg.subfolder}',` : ''}
		features_settlement: ${bg.features_settlement},
		transitions_to: ${bg.transitions_to ? `BiomeId.${get_code_biome_id(bg.transitions_to)}` : 'null'},
	},`
}) .join('')
+ `
]

export default BACKGROUNDS
`

fs.writeFileSync(target_path, data)

