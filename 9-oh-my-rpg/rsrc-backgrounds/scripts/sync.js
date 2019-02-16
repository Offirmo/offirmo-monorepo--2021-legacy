const path = require('path')

const _ = require('lodash')
const { dump_pretty_json } = require('@offirmo/prettify-json')
const rich_text_to_ansi = require('@offirmo/rich-text-format-to-ansi')
const fs = require('../../../../cli-toolbox/fs/extra')

const { AUTHORS_BY_NAME, ELEMENTS, render_artwork_legend } = require('../dist/src.es7.cjs')

const ROOT_DIR_1 = 'src/rsrc/license-pending'
const ROOT_DIR_2 = 'src/rsrc/licensed'
const author_dirs = [
	...fs.lsDirs(ROOT_DIR_1),
	...fs.lsDirs(ROOT_DIR_2),
]

//const display_mode = 'review'
const display_mode = 'dump'
let artworks = []

//console.log(author_dirs)
const AUTHORS = []
author_dirs.forEach(author_dir => {
	const author_name = path.basename(author_dir).split('_').join(' ')
	const author = {
		display_name: author_name,
		url: `https://www.google.com/search?q=${author_name.split(' ').join('+')}`,
	}


	if (!AUTHORS_BY_NAME[author_name]) {
		dump_pretty_json('\n{', author)
		console.log('},')
		throw new Error('🔥 💣 💥  Missing author!')
	}

	switch (display_mode) {
		case 'review':
			console.log(author_name)
			break
		case 'dump':
			break
		default:
			break
	}
	const artwork_paths = fs.lsFiles(author_dir)
	artwork_paths.forEach(artwork_path => {

		let display_name =
			_.trim(
				_.replace(
					path.basename(artwork_path)
						.slice(0, -4) // remove .jpg
					.split('_').join(' ')
					.split('-').join(' ')
					.split(' ')
						.map(_.trim)
						.map(_.capitalize)
					.join(' '),
					author_name.split('.').join(' ').split(' ').map(_.capitalize).join(' '),
					''
				)
			)

		let background = {
			author: `AUTHORS_BY_NAME['${author_name}'],`,
			source: `'TODO',`,
			display_name: `'${display_name}',`,
			keywords: `[],`,
			css_class: '\'tbrpg⋄bg-image⁚' + [
				author_name.toLowerCase().split(' ').join('_'),
				display_name.toLowerCase().split(' ').join('_'),
			].join('-') + `',`,
			position_pct: `{ x: 50, y: 50 },`,
		}

		// find it in known bg
		const existing_bg = ELEMENTS.find(artwork =>
			artwork.author.display_name === author_name
			&& artwork.display_name === display_name)

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
				console.log('  ' + display_name + ' - ' + (
					existing_bg
					? rich_text_to_ansi(render_artwork_legend(existing_bg))
						: '🆕'
				))
				break
			case 'dump':
				dump_pretty_json('\n{', background)
				console.log('},')
				break
			default:
				break
		}

		if (!existing_bg) {
			//console.error(background)
			//throw new Error('Missing background!')
		}

		artworks.push({
			artwork_path,
			css_class: 'tbrpg⋄bg-image⁚' + [
				author_name.toLowerCase().split(' ').join('_'),
				display_name.toLowerCase().split(' ').join('_'),
			].join('-') + ``,
			position_pct: existing_bg ? existing_bg.position_pct : { x: 50, y: 50 },
			position_pct_alt: existing_bg ? existing_bg.position_pct_alt : undefined,
		})
	})
})

if (display_mode === 'dump') {
	artworks.forEach(({artwork_path, css_class, position_pct}) => {
		console.log(`
.${css_class} {
	background-image: url('${artwork_path.slice(4)}');
	background-position: ${position_pct.x}% ${position_pct.y}%;
}
`
		)
	})
}

console.log(`[${artworks.length} artworks!]`)

ELEMENTS.forEach(e => {
	if (e.found) return

	console.error(`XXX UNMATCHED ARTWORK!`)
	dump_pretty_json('', e)
})
