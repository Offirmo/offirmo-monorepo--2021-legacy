console.group('@offirmo/browserlist-config')

const fs = require('fs')
const assert = require('assert').strict

const browserslist = require('browserslist')


const BROWSERS_QUERIES = require('.')

console.log({
	BROWSERS_QUERIES,
	browserslist: browserslist(BROWSERS_QUERIES)
})

const ROOT_QUERIES_TXT = fs.readFileSync('../../.browserslistrc', 'utf8')
assert.strictEqual(BROWSERS_QUERIES.join('\n'), ROOT_QUERIES_TXT.trim())

console.groupEnd()
