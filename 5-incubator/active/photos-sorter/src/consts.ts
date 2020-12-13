export const LIB = '@offirmo-photos-sorter'

export const EXIF_POWERED_FILE_EXTENSIONS = [
	// https://en.wikipedia.org/wiki/Exif
	'.heif', // new standard mainly used by Apple. Should contain EXIf according to https://www.photoreview.com.au/tips/shooting/heif-what-you-need-to-know/
	'.jpg', '.jpeg',
	'.mov',
	'.mp4',
	'.tif', '.tiff',
	'.wav',
]

export const NOTES_BASENAME = `.${LIB}_notes.json`
