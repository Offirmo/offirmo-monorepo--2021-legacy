const fs = require('fs-extra')
const path = require('path')

const json = require('./json')

// hat tip to https://stackoverflow.com/a/24594123/587407
function lsDirsSync(srcpath, options = {}) {
	options = {
		full_path: true, // because it's what we usually want
		...options,
	}

	let result = fs
		.readdirSync(srcpath)
		.filter(file => fs.statSync(
			path.join(srcpath, file)
		).isDirectory())

	if (options.full_path)
		result = result.map(file => path.join(srcpath, file))

	return result.sort()
}

function lsFilesSync(srcpath, options = {}) {
	options = {
		full_path: true, // because it's what we usually want
		...options,
	}

	let result = fs
		.readdirSync(srcpath)
		.filter(file => !fs.statSync(
			path.join(srcpath, file)
		).isDirectory())

	if (options.full_path)
		result = result.map(file => path.join(srcpath, file))

	return result.sort()
}

module.exports = {
	...fs,
	json,
	lsDirsSync,
	lsFilesSync
}
