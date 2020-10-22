const load_json_file = require('load-json-file')
const write_json_file = require('write-json-file')

module.exports = {
	read: load_json_file,
	readSync: load_json_file.sync,
	write: write_json_file,
	writeSync: write_json_file.sync,
}
