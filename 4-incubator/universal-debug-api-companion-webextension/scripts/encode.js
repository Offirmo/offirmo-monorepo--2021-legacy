const path = require('path')
const fs = require('fs-extra')

// https://stackoverflow.com/a/23097961/587407
function btoa(s) {
	return Buffer.from(s).toString('base64')
}

// https://stackoverflow.com/a/30106551/587407
function b64EncodeUnicode(str) {
	// first we use encodeURIComponent to get percent-encoded UTF-8,
	// then we convert the percent encodings into raw bytes which
	// can be fed into btoa.
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
}


const input_path = path.resolve(process.cwd(), '../../2-advanced/universal-debug-api-full-browser/dist/index-bundle.js')
const target_path = path.resolve(process.cwd(), './src/content-scripts/start-incontext.js')

const lib_content = fs.readFileSync(input_path)
console.log('\n', lib_content)
const lib_cleaned = (() => {
	let result = lib_content
	/*
	const TRAILING_PART_TO_REMOVE = ''//# sourceMappingURL=/index-bundle.map'
	if (lib_content.endsWith(TRAILING_PART_TO_REMOVE))
		result = result.slice(0, -TRAILING_PART_TO_REMOVE.length)
	console.log('\n', result)*/
	return result
})()
const lib_encoded = btoa(lib_cleaned)

fs.writeFileSync(target_path, `
// THIS FILE IS AUTO GENERATED!
const lib = '${lib_encoded}'
export default lib
`);
