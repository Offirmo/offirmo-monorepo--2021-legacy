const path = require('path')
const fs = require('fs-extra')

// https://stackoverflow.com/a/23097961/587407
function btoa(s) {
	return Buffer.from(s).toString('base64')
}

// https://stackoverflow.com/a/30106551/587407
/*function b64EncodeUnicode(str) {
	// first we use encodeURIComponent to get percent-encoded UTF-8,
	// then we convert the percent encodings into raw bytes which
	// can be fed into btoa.
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1)
		}))
}*/

/////////////////////
const MAX_INLINE_LIB_SIZE = 40000 // I don't know the actual limit, just know this one works so far: 39540

const lib1_input_path = path.resolve(process.cwd(), './dist/injected-api-bundle-1.js')
const lib1_target_path = path.resolve(process.cwd(), './src/content-scripts/lib-to-inject-1.ts')

const lib1_content = fs.readFileSync(lib1_input_path)
console.log('* lib1 content length =', lib1_content.length)

const lib1_encoded = btoa(lib1_content)
console.log('* encoded lib1 content length =', lib1_encoded.length)
console.assert(lib1_encoded.length <= MAX_INLINE_LIB_SIZE, '❌❌ lib1 is too big and won’t get injected!')

fs.writeFileSync(lib1_target_path, `
// THIS FILE IS AUTO GENERATED!
// This is a base64 version of the Universal Web Debug API:
// https://github.com/Offirmo/offirmo-monorepo/tree/master/3-advanced--multi/universal-debug-api-browser
// bundled in a single file through this local file:
// ../src/injected-libs/universal-debug-api-from-webext.ts
const lib = '${lib1_encoded}'
export default lib
`)

/////////////////////

const lib2_input_path = path.resolve(process.cwd(), './dist/injected-api-bundle-2.js')
const lib2_target_path = path.resolve(process.cwd(), './src/content-scripts/lib-to-inject-2.ts')

const lib2_content = fs.readFileSync(lib2_input_path)
console.log('* lib2 content length =', lib2_content.length)

const lib2_encoded = btoa(lib2_content)
console.log('* encoded lib2 content length =', lib2_encoded.length)
console.assert(lib2_encoded.length <= MAX_INLINE_LIB_SIZE, '❌❌ lib2 is too big and won’t get injected!')

fs.writeFileSync(lib2_target_path, `
// THIS FILE IS AUTO GENERATED!
// This is a base64 version of a content script to communicate with UWDT webextension
// bundled in a single file through this local file:
// ../src/injected-libs/universal-debug-api-control.ts
const lib = '${lib2_encoded}'
export default lib
`)

/////////////////////
