
const DEMO_TXT_01 = `Hello world!`

const DEMO_TXT_02 = `
A list of 100 words that occur most frequently in written English is given below, based on an analysis of the Oxford English Corpus (a collection of texts in the English language, comprising over 2 billion words). A part of speech is provided for most of the words, but part-of-speech categories vary between analyses, and not all possibilities are listed. For example, "I" may be a pronoun or a Roman numeral; "to" may be a preposition or an infinitive marker; "time" may be a noun or a verb. Also, a single spelling can represent more than one root word. For example, "singer" may be a form of either "sing" or "singe". Different corpora may treat such difference differently.

The number of distinct senses that are listed in Wiktionary is shown in the Polysemy column. For example, "out" can refer to an escape, a removal from play in baseball, or any of 36 other concepts. On average, each word in the list has 15.38 senses. The sense count does not include the use of terms in phrasal verbs such as "eat out" (chastise) and other multiword expressions such as the interjection "get out!", where the word "out" does not have an individual meaning.[6] As an example, "out" occurs in at least 560 phrasal verbs[7] and appears in nearly 1700 multiword expressions.[1]

The table also includes frequencies from other corpora, note that as well as usage differences, lemmatisation may differ from corpus to corpus - for example splitting the prepositional use of "to" from the use as a particle. Also the COCA list includes dispersion as well as frequency to calculate rank.
`

////////////////////////////////////
const { NORMALIZERS } = require('../../../../3-advanced--isomorphic/normalize-string')
const assert = require('tiny-invariant').default

const SPACES = ` \t\n`
const PUNCTUATION = `.,!:;?'"-()`

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
