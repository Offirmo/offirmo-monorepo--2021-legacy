const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')

module.exports = {
	read: loadJsonFile,
	write: writeJsonFile
}
