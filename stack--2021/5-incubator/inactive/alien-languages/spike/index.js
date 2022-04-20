
const DEMO_TXT_01 = `Hello world!`

const DEMO_TXT_02 = `
A list of 100 words that occur most frequently in written English is given below, based on an analysis of the Oxford English Corpus (a collection of texts in the English language, comprising over 2 billion words). A part of speech is provided for most of the words, but part-of-speech categories vary between analyses, and not all possibilities are listed. For example, "I" may be a pronoun or a Roman numeral; "to" may be a preposition or an infinitive marker; "time" may be a noun or a verb. Also, a single spelling can represent more than one root word. For example, "singer" may be a form of either "sing" or "singe". Different corpora may treat such difference differently.

The number of distinct senses that are listed in Wiktionary is shown in the Polysemy column. For example, "out" can refer to an escape, a removal from play in baseball, or any of 36 other concepts. On average, each word in the list has 15.38 senses. The sense count does not include the use of terms in phrasal verbs such as "eat out" (chastise) and other multiword expressions such as the interjection "get out!", where the word "out" does not have an individual meaning.[6] As an example, "out" occurs in at least 560 phrasal verbs[7] and appears in nearly 1700 multiword expressions.[1]

The table also includes frequencies from other corpora, note that as well as usage differences, lemmatisation may differ from corpus to corpus - for example splitting the prepositional use of "to" from the use as a particle. Also the COCA list includes dispersion as well as frequency to calculate rank.
`

////////////////////////////////////
const { NORMALIZERS } = require('../../../../3-advanced--isomorphic/normalize-string')
const assert = require('tiny-invariant')

const SPACES = ` \t\n`
const PUNCTUATION = ''
	+ `!"%'()*+,-./:;=?` // basic latin https://jrgraphix.net/r/Unicode/0020-007F

////////////////////////////////////

// languages
// IPA Extensions https://jrgraphix.net/r/Unicode/0250-02AF
// ɑ ɒ c ɔ ɾ ɿ ʌ ʍ ʘ ʟ
// Greek and Coptic https://jrgraphix.net/r/Unicode/0370-03FF
// ͼ ͽ Γ Δ Θ Ι Κ Λ Π Ο Τ Υ Χ ϴ Ϲ Ͻ Ͼ Ͽ
// Cyrillic https://jrgraphix.net/r/Unicode/0400-04FF
// Armenian https://jrgraphix.net/r/Unicode/0530-058F
// ֍ ֎
// Oriya https://jrgraphix.net/r/Unicode/0B00-0B7F
// ୦ ଽ ୮ ୲ ୵
// Telugu https://jrgraphix.net/r/Unicode/0C00-0C7F
// ౦ ౧ ౩
// https://jrgraphix.net/r/Unicode/0D80-0DFF
// ෴
// https://jrgraphix.net/r/Unicode/0E00-0E7F
// ๏
// Tibetan https://jrgraphix.net/r/Unicode/0F00-0FFF
// ࿓ ࿔ ༄ ༅ ༒ ༓ ༚ ༛ ༜ ༝ ༞ ༟ ࿎ ࿏ ༶ ࿊ ࿋ ࿌
// Myanmar https://jrgraphix.net/r/Unicode/1000-109F
// ဂ ပ င ၁ ၀ ၐ ၑ စ ႎ ဓ ၜ
// Georgian https://jrgraphix.net/r/Unicode/10A0-10FF
// Ⴈ Ⴄ Ⴌ Ⴞ Ⴖ Ⴙ
// Hangul Jamo https://jrgraphix.net/r/Unicode/1100-11FF
// ᄀ ᄂ ᄃ ᄅ ᄆ ᄇ ᄏ ᄐ
// Ethiopic https://jrgraphix.net/r/Unicode/1200-137F
// ፟ ፠ ፡ ፧ ። ፨
// Cherokee https://jrgraphix.net/r/Unicode/13A0-13FF
// Ꮀ Ꮁ
// Unified Canadian Aboriginal Syllabics https://jrgraphix.net/r/Unicode/1400-167F
// ᐁ ᐌ ᐍ
// ᐅ ᐆ ᐇ ᐈ ᐉ ᐒ ᐓ ᐔ ᐕ ᐖ
// ᐎ ᐏ ᐐ ᐑ ᐂ ᐃ ᐄ
// ᐊ ᐋ ᐘ ᐙ ᐚ ᐛ ᐗ
// ᐫ ᐬ ᐭ ᐮ
// ᐯ ᐺ ᐻ
// ᐳ ᐴ ᐵ ᐶ ᐷ ᑀ ᑁ ᑂ ᑃ
// ᐸ ᐹ ᑄ ᑅ ᑆ ᑇ ᑈ
// ᐼ ᐽ ᐾ ᐿ ᐰ ᐱ ᐲ
// ᑌ ᑗ ᑘ
// ᑍ ᑎ ᑏ ᑙ ᑚ ᑛ ᑜ
// ᑐ ᑑ ᑒ ᑓ ᑔ ᑝ ᑞ ᑟ ᑠ
// ᑕ ᑖ ᑡ ᑢ ᑣ ᑤ ᑥ
// ᒣ ᒬ ᒭ
// ᒤ ᒥ ᒦ ᒮ ᒯ ᒰ ᒱ
// ᒧ ᒨ ᒩ ᒲ ᒳ ᒴ ᒵ
// ᒪ ᒫ ᒶ ᒷ ᒸ ᒹ ᒺ
// Runic https://jrgraphix.net/r/Unicode/16A0-16FF
// ᚠ ᚡ ᚴ ᚵ ᚶ
// ᚢ ᚣ ᚤ ᚥ ᛷ
// ᚨ ᚩ ᚪ ᚫ
// ᚬ ᚭ ᚮ ᚯ
// ᚱ ᚳ
// ᚸ ᚹ ᚺ ᚻ ᚼ
// ᚽ ᚾ ᚿ ᛀ ᛅ ᛆ ᛐ ᛑ ᛙ ᛚ ᛛ ᛮ
// ᛇ ᛢ ᛈ ᛊ ᛋ
// ᛒ ᛓ ᛖ ᛗ ᛘ ᛉ ᛠ ᛳ
// ᛝ ᛞ ᛟ ᛡ ᛤ ᛥ
// ᛩ ᛪ ᛯ ᛰ ᛱ ᛲ ᛴ ᛵ ᛶ
// ᛸ ᛣ ᛦ
// Mongolian https://jrgraphix.net/r/Unicode/1800-18AF

// magic (runes)
//
// imaginary language: roundy
// ʘ၀ၐၑစႎဓ◴◵◶◷ၜ⊚⌾⊝⌀∅⊘ᛰ⊕⊖⊗⊙⊛⊜⌽⍉⍜⍟⎉⎊⏀⏼☉⚆⚇⚯
//
// triangly
// ⋈ ⋉ ⋊ ⋋ ⋌ ⋖ ⋗ ⟨ ⟩
// squary
// crossy
// ※ ⁜ ⁕ ⊹ ⋇ ☸ ⎈ ⌖
// futuristic
// ⌬ ⎊ ⎔ ⏣ ⑀ ⑁ ⑂ ⑃ ⑄ ⟐ ⟓ ⟔ ⟠ ⟡ ⟁ Ⴈ Ⴄ Ⴌ Ⴞ Ⴖ Ⴙ ୦ ଽ ୮ ୲ ୵ ᄀ ᄂ ᄃ ᄅ ᄆ ᄇ ᄏ ᄐᎰ Ꮁ
// boxy https://jrgraphix.net/r/Unicode/2500-257F
// dotsy https://jrgraphix.net/r/Unicode/2800-28FF

////////////////////////////////////

function get_lexical_tokens(normalized_text) {
	//return NORMALIZERS.coerce_blanks_to_single_spaces(normalized_text).split(' ')

	const result = []
	let acc = ''

	normalized_text.split('').forEach((c, i) => {
		//console.log(c)
		if (PUNCTUATION.includes(c) || SPACES.includes(c)) {
			if (acc)
				result.push({
					org: acc,
					pos: i - acc.length,
				})
			acc = ''
			result.push({
				org: c,
				pos: i,
			})
		}
		else
			acc += c
	})

	if (acc)
		result.push({
			org: acc,
			pos: normalized_text.length - acc.length,
		})

	return result
}

function get_token_complexity(token) {
	return Math.min(token.org.length * 10, 100)
}

function get_token_translation(token, language_spec) {
	/*if (SPACES.includes(token))
		return token*/

	return '????????????'.slice(0, token.org.length)
}


function get_alien_version(raw_text, language_spec, { understanding_pct = 0}) {
	let text = NORMALIZERS.normalize_unicode(raw_text)
	assert(text === raw_text, 'get_alien_version() should be unicode normalized')
	text = NORMALIZERS.trim(text)

	const tokens = get_lexical_tokens(text)
	//console.log(tokens)

	return tokens.reduce((acc, token) => {
		const complexity = get_token_complexity(token)
		const result = complexity > understanding_pct
			? get_token_translation(token, language_spec)
			: token.org
		//console.log({token, complexity, result})
		return acc + result
	}, '')
}

////////////////////////////////////

function demo(raw) {
	const demo_id = Object.keys(raw)[0]
	const demo_text = raw[demo_id]
	console.log(`------------`)
	console.log(`demo text "${demo_id}"...`)


	for (let i = 0; i<= 100; i+=10) {
		console.log(`\n------- alien version with ${i}% of understanding:`)
		console.log(get_alien_version(demo_text, null, { understanding_pct: i}))
	}
}


////////////////////////////////////

//demo({DEMO_TXT_01})
demo({DEMO_TXT_02})
