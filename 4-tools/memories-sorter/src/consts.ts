/////////////////////////////////////////////////

export const LIB = '@offirmo-memories-sorter'

export const RELATIVE_PATH_NORMALIZATION_VERSION = 1 // 'YYYY/YYYYMMDD - xyz/MMxxxx-xx-xx_xxhxx_xyz.ext'

export const EXIF_POWERED_FILE_EXTENSIONS_LC = [
	// https://en.wikipedia.org/wiki/Exif
	'.heic', '.heif', // new standard mainly used by Apple. contains EXIf according to https://www.photoreview.com.au/tips/shooting/heif-what-you-need-to-know/ + seen experimentally
	'.jpg', '.jpeg',
	'.mov',
	'.mp4',
	'.tif', '.tiff',
	'.wav',
].map(s => s.toLowerCase())

export const NOTES_BASENAME_SUFFIX_LC = `.${LIB}_notes.json`.toLowerCase()

// should NOT be a common separator
export const DIGIT_PROTECTION_SEPARATOR = 'x'
