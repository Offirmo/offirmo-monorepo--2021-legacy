const path = require('path')

const { /*trim, replace,*/ capitalize } = require('lodash')
const { dump_prettified_any, prettify_json } = require('@offirmo-private/prettify-any')
const rich_text_to_ansi = require('@offirmo-private/rich-text-format-to-ansi')
const fs = require('@offirmo/cli-toolbox/fs/extra')

const { AUTHORS_BY_NAME, ELEMENTS, render_artwork_legend } = require('../dist/src.es2019.cjs')

////////////////////////////////////

function humanize(s) {
	return s
		.toLowerCase()
		.split('_').join(' ')
		.split('-').join(' ')
		.split('.').join(' ')
		.split(' ')
		.map(s => s.trim())
		.filter(s => !!s)
		.map(capitalize)
		.join(' ')
}

function canonize(s) {
	return s
		.toLowerCase()
		.split('_').join(' ')
		.split('-').join(' ')
		.split('.').join(' ')

		// remove punctuation
		.replace('’', '')
		.replace('#', '')
		.replace('(', '')
		.replace(')', '')

		.split(' ')
		.map(s => s.trim())
		.filter(s => !!s)
		.join('-')
}

console.error( canonize('Dragon’s Lair #1') )

////////////////////////////////////

//const display_mode = 'review'
const display_mode = 'dump'

const artworks = []
const authors_by_dir = {}

////////////////////////////////////

const LAST_KNOWN_BG_COUNT = 137
const ROOT_DIR_1 = 'src/rsrc/license-pending'
const ROOT_DIR_2 = 'src/rsrc/licensed'
const author_dirs = [
	...fs.lsDirsSync(ROOT_DIR_1),
	...fs.lsDirsSync(ROOT_DIR_2),
]
//console.log(author_dirs)


// extract authors
author_dirs.forEach(author_dir => {
	const author_name = humanize(path.basename(author_dir))

	const author = {
		display_name: author_name,
		url: `https://www.google.com/search?q=${author_name.split(' ').join('+')}`,
	}
	authors_by_dir[author_dir] = author

	if (display_mode !== 'dump') {
		console.log('\n-------')
		console.log('discovered author dir:', {
			dir: path.basename(author_dir),
			humanized: author_name,
		})
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
	}
})

// extract artworks
author_dirs.forEach(author_dir => {
	const author = authors_by_dir[author_dir]

	const artwork_paths = fs.lsFilesSync(author_dir)
		.filter(d => !d.toLowerCase().includes('/readme.'))
		.filter(d => !d.toLowerCase().includes('/licence.'))
		.filter(d => !d.endsWith('/.DS_Store'))

	artwork_paths.forEach(artwork_path => {
		if (display_mode !== 'dump') {
			console.log('\n-------')
			console.log('discovered artwork:', { path: artwork_path })
		}

		let display_name = humanize(
				path.basename(artwork_path)
					.slice(0, -4) // remove .jpg
			)
			.replace(author.display_name, '')
			.trim()

		let background = {
			author: `AUTHORS_BY_NAME['${author.display_name}']`,
			source: `TODO`,
			display_name: display_name,
			keywords: [],
			css_class: 'tbrpg⋄bg-image⁚' + [
				author.display_name.toLowerCase().split(' ').join('_'),
				display_name.toLowerCase().split(' ').join('_'),
			].join('-'),
			position_pct: { x: 50, y: 50 },
		}

		// find it in known bg
		const existing_bg = ELEMENTS.find(artwork =>
			artwork.author.display_name === author.display_name
			&& canonize(artwork.display_name) === canonize(display_name))

		if (existing_bg) {
			existing_bg.found = true
			background = {
				...background,
				source: existing_bg.source,
				keywords: [ ...existing_bg.keywords ],
				position_pct: existing_bg.position_pct,
				position_pct_alt: existing_bg.position_pct_alt,
			}
		}

		switch (display_mode) {
			case 'review':
				console.log(
					existing_bg
						? ' Previously known as: ' + rich_text_to_ansi(render_artwork_legend(existing_bg))
						: '🆕'
				)
				/* fallthrough */
			case 'dump':
				//console.log('{')
				//console.log(prettify_json(background))
				console.log(background)
				//console.log('},')
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
	console.log('/* XXX AUTO-GENERATED from ad hoc command line tool */')
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
