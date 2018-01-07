let fs = require('fs-extra')

const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')


// hat tip to http://stackoverflow.com/a/24594123/587407
const path = require('path')
function lsDirs(srcpath) {
	return fs
		.readdirSync(srcpath)
		.filter(file => fs.statSync(
			path.join(srcpath, file)
		).isDirectory())
}

function lsFiles(srcpath) {
	return fs
		.readdirSync(srcpath)
		.filter(file => !fs.statSync(
			path.join(srcpath, file)
		).isDirectory())
}

fs = {
	...fs,
	lsDirs,
	lsFiles,
	json: {
		read: loadJsonFile,
      readSync: loadJsonFile.sync,
		write: writeJsonFile,
      writeSync: writeJsonFile.sync,
	}
}

module.exports = fs
