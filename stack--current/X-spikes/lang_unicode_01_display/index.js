#!/usr/bin/env node
'use strict';

console.log('The boring RPG')

const stylize = require('chalk')

const dingbats = [
	[parseInt('2700', 16), parseInt('27BF', 16)],
]

// https://jrgraphix.net/r/Unicode/2460-24FF
const enclosed_white_round_set = [
	parseInt('24ea', 16), // 0
	[parseInt('2460', 16), parseInt('2473', 16)], // numbers
	[parseInt('24b6', 16), parseInt('24e9', 16)], // letters
	// alt numbers
	parseInt('1f10b', 16), // ?
	[parseInt('2780', 16), parseInt('2789', 16)], // numbers
]

// https://jrgraphix.net/r/Unicode/2460-24FF
const enclosed_parens_set = [
	[parseInt('2474', 16), parseInt('2487', 16)], // numbers
	[parseInt('249c', 16), parseInt('24b5', 16)], // letters
]

const enclosed_black_round_set = [
	parseInt('1f10c', 16), // 0
	[parseInt('1f150', 16), parseInt('1f169', 16)], // letter
	[parseInt('278a', 16), parseInt('2793', 16)], // numbers
	[parseInt('2776', 16), parseInt('277f', 16)], // alt numbers
	[parseInt('24eb', 16), parseInt('24f4', 16)], // 11 ... 20
	parseInt('24ff', 16), // ?
]

const enclosed_white_square_set = [
	[parseInt('1F100', 16), parseInt('1F290', 16)],
]

const enclosed_black_square_set = [
	parseInt('1f10c', 16), // 0
	[parseInt('1f150', 16), parseInt('1f169', 16)], // letter
	[parseInt('278a', 16), parseInt('2793', 16)], // numbers
	[parseInt('2776', 16), parseInt('277f', 16)], // alt numbers
	[parseInt('24eb', 16), parseInt('24f4', 16)], // 11 ... 20
	parseInt('24ff', 16), // ?
]

const monsters_set = [
	[parseInt('1f400', 16), parseInt('1f43f', 16)], // animals 1
	parseInt('1f5ff', 16),
	parseInt('1f47b', 16),
	parseInt('1f54a', 16),
	parseInt('1f577', 16),
	[parseInt('1f980', 16), parseInt('1f991', 16)], // animals 2
]

const emoji_set = [
	[parseInt('1F300', 16), parseInt('1F9FF', 16)], // Misc Symbols and Pictographs (1)

	// https://stackoverflow.com/questions/30757193/find-out-if-character-in-string-is-emoji
	//[parseInt('02600', 16), parseInt('026FF', 16)], // Misc symbols
	//[parseInt('1F300', 16), parseInt('1F3FA', 16)], // Misc Symbols and Pictographs (1)
	// here we skip the skin tones
	//[parseInt('1F400', 16), parseInt('1F5FF', 16)], // Misc Symbols and Pictographs (2)
	//[parseInt('1F600', 16), parseInt('1F64F', 16)], // Emoticons
	//[parseInt('1F680', 16), parseInt('1F6FF', 16)], // Transport and Map
	//[parseInt('1F910', 16), parseInt('1F9FF', 16)], // Supplemental Symbols and Pictographs
]


const set = enclosed_parens_set
//const set = enclosed_white_round_set
//const set = monsters_set
//const set = emoji_set
//const set = [[parseInt('1d400', 16), parseInt('1d433', 16)]]

function render_set(set) {
	console.log('----')
	set.forEach(e => {
		if (typeof e === 'number')
			render_codepoint(e)
		else {
			const [min, max] = e
			for (let i = min; i <= max; ++i) {
				render_codepoint(i)
			}
		}
	})
	console.log('----')
}

function render_codepoint(codepoint) {

	if (false) {
		// just the codepoint
		console.log(String.fromCodePoint(codepoint))
	}
	else if (true) {
		console.log(`${stylize.dim(codepoint.toString(16).padStart(6, '0') + ' │⋄')}${String.fromCodePoint(codepoint)}${stylize.dim('⋄│  ')}`)
	}
	else if (false) {
		// for inclusion in OMR/data
		console.log(`
'${codepoint.toString(16).padStart(6, '0')}': {
	code_point: ${codepoint},
	char: '${String.fromCodePoint(codepoint)}',
	taxonomy: [ 'animal', 'living', 'monster' ],
	tags: [ 'emoji' ],
	CLDR_short_name: '?',
	gendered: false,
	skin_colorizable: false,
	properties: {
		description: '???',
	},
},`)
	}
}

console.log('123456789012345678901234567890')
render_set(set)
