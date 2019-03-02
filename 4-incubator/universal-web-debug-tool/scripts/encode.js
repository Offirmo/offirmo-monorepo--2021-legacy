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


const input_path = path.resolve(process.cwd(), './dist/api/full/index.js')
const target_path = path.resolve(process.cwd(), './src/content-scripts/start-incontext.js')

fs.writeFileSync(target_path, `
// THIS FILE IS AUTO GENERATED!
const lib = "${btoa(fs.readFileSync(input_path))}"
export default lib
`);
