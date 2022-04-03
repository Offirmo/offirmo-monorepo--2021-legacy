console.group('@offirmo-private/browserlist-config')

const fs = require('fs')
const assert = require('assert').strict

const browserslist = require('browserslist')

const BROWSERS_QUERIES = require('.')
const BROWSERS = browserslist(BROWSERS_QUERIES)

console.log({
	BROWSERS_QUERIES,
	BROWSERS,
})

assert.ok(BROWSERS_QUERIES.slice(-1)[0] === 'not dead')

const ROOT_QUERIES_TXT = fs.readFileSync('../../.browserslistrc', 'utf8')
assert.strictEqual(BROWSERS_QUERIES.join('\n'), ROOT_QUERIES_TXT.trim())

console.groupEnd()
