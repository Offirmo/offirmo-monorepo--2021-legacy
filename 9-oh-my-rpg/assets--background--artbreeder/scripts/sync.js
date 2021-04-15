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
	suggestedLevel: 'silly',
})

////////////////////////////////////

const LAST_KNOWN_BG_COUNT = 114 - 16
const ROOT_DIR = 'src/assets'
const DIRS__FIRST_LEVEL = fs.lsDirsSync(ROOT_DIR, { full_path: false })
logger.debug('fs read:', { ROOT_DIR, DIRS__FIRST_LEVEL })

////////////////////////////////////
// OUTPUT

const biome_ids = []
const backgrounds = [
	// {
	// biome_id
	// basename
	// transition_to
	// }
]


// extract biomes
DIRS__FIRST_LEVEL.forEach(basename__first_level => {
	const splitted = basename__first_level.split('--')
	/*console.log({
		basename__first_level,
		splitted,
	})*/

	if (splitted[0] !== 'biome') {
		if (!basename__first_level.startsWith('tosort'))
			logger.warn(`ignoring root folder "${basename__first_level}". Please check.`)
		return
	}

	const biome_id = splitted.slice(1).join('--')
	if (biome_id.toLowerCase() !== biome_id) {
		throw new Error(`Error: biome "${biome_id}" should be LC!`)
	}
	logger.info(`found biome "${biome_id}"`)
	biome_ids.push(biome_id)
})

biome_ids.forEach(biome_id => {
	const biome_path = path.join(ROOT_DIR, 'biome--' + biome_id)
	logger.debug('looking into a biome:', { id: biome_id, path: biome_path })

	// backgrounds
	const sub_files = fs.lsFilesSync(biome_path, { full_path: false })
		.filter(basename => !basename.startsWith('.'))
	console.log({ sub_files })
	sub_files.forEach(basename => {
		const background = {
			biome_id,
			basename,
			transition_to: null,
		}
		backgrounds.push(background)
	})

	// transitions
	const sub_folders = fs.lsDirsSync(biome_path, { full_path: false })
		.filter(basename => !basename.startsWith('.'))
	console.log({ sub_folders })

})

	/*
	const author_name = humanize(path.basename(author_dir))

	const author = {
		display_name: author_name,
		url: `https://www.google.com/search?q=${author_name.split(' ').join('+')}`,
	}
	authors_by_dir[author_dir] = author

	if (display_mode !== 'dump') {
		console.log('\n-------')
		console.log('discovered author dir:', { dir: path.basename(author_dir)})
	}

	if (!AUTHORS_BY_NAME[author_name]) {
		dump_prettified_any('\n{', author)
		console.log('},')
		throw new Error('🔥 💣 💥  Missing author!')
	}

	switch (display_mode) {
		case 'review':
			//console.log({author_name})
			break
		case 'dump':
			break
		default:
			break
	}*/

// extract artworks
/*author_dirs.forEach(author_dir => {
	const author = authors_by_dir[author_dir]

	const artwork_paths = fs.lsFilesSync(author_dir)
		.filter(d => !d.endsWith('/.DS_Store'))

	artwork_paths.forEach(artwork_path => {
		if (display_mode !== 'dump') {
			console.log('\n-------')
			console.log('discovered artwork:', {path: artwork_path})
		}

		let display_name = humanize(
				path.basename(artwork_path)
					.slice(0, -4) // remove .jpg
			)
			.replace(author.display_name, '')
			.trim()

		let background = {
			author: `AUTHORS_BY_NAME['${author.display_name}'],`,
			source: `'TODO',`,
			display_name: `'${display_name}',`,
			keywords: `[],`,
			css_class: '\'tbrpg⋄bg-image⁚' + [
				author.display_name.toLowerCase().split(' ').join('_'),
				display_name.toLowerCase().split(' ').join('_'),
			].join('-') + `',`,
			position_pct: `{ x: 50, y: 50 },`,
		}

		// find it in known bg
		const existing_bg = ELEMENTS.find(artwork =>
			artwork.author.display_name === author.display_name
			&& canonize(artwork.display_name) === canonize(display_name))

		if (existing_bg) {
			existing_bg.found = true
			background = {
				...background,
				source: `'${existing_bg.source}',`,
				keywords: `[ '` + existing_bg.keywords.join(`', '`) + `' ],`,
				position_pct: `${JSON.stringify(existing_bg.position_pct)},`,
				position_pct_alt: `${JSON.stringify(existing_bg.position_pct_alt)},`,
			}
		}

		switch (display_mode) {
			case 'review':
				console.log(
					existing_bg
						? ' Previously known as: ' + rich_text_to_ansi(render_artwork_legend(existing_bg))
						: '🆕'
				)
				/* fallthrough *//*
			case 'dump':
				dump_prettified_any('\n{', background)
				console.log('},')
				break
			default:
				break
		}

		if (!existing_bg) {
			console.error(canonize(display_name))
			throw new Error('Missing background!')
		}

		artworks.push({
			artwork_path,
			css_class: 'tbrpg⋄bg-image⁚' + [
				author.display_name.toLowerCase().split(' ').join('_'),
				display_name.toLowerCase().split(' ').join('_'),
			].join('-') + ``,
			position_pct: existing_bg ? existing_bg.position_pct : { x: 50, y: 50 },
			position_pct_alt: existing_bg ? existing_bg.position_pct_alt : undefined,
		})
	})
})

if (display_mode === 'dump') {
	console.log('/* XXX AUTO-GENERATED from ad hoc command line tool *//*')
	artworks
		.sort(({css_class: a}, {css_class: b}) => -(a < b) || +(a > b))
		.forEach(({artwork_path, css_class, position_pct}) => {
		console.log(`
.${css_class} {
	background-image: url('${artwork_path.slice(4)}');
	background-position: ${position_pct.x}% ${position_pct.y}%;
}
`
		)
	})
}

console.log(`
---------
[${artworks.length} artworks!]`)
if (artworks.length > LAST_KNOWN_BG_COUNT) {
	console.log(`- 😍 feature: ${artworks.length - LAST_KNOWN_BG_COUNT} new backgrounds (now totalling ${artworks.length}!)`)
}

ELEMENTS.forEach(e => {
	if (e.found) return

	console.error(`XXX UNMATCHED ARTWORK!`)
	dump_prettified_any('', e)
})
*/

console.log(backgrounds)
