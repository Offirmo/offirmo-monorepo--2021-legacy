import path from 'path'

const EXIF_POWERED_FILE_EXTENSIONS = [
	'.jpg',
	'.jpeg',
	'.mov',
	'.mp4',
]

export interface Params {
	root: string
	dry_run: boolean
	extensions_to_normalize: { [k: string]: string }
	media_files_extensions: string[]
	extensions_to_delete: string[]
}

export function get_params(): Params {
	// TODO some interface
	return {
		root: path.normalize(`/Users/${process.env.USER}/Documents/- photos sorter/- sorted`),
		dry_run: true,
		extensions_to_normalize: {
			// TODO
			'.jpeg': '.jpg',
		},
		media_files_extensions: [
			'.gif',
			'.png',
			'.psp', // photoshop I believe, screens from Warcraft III are in this format
			'.tga', // WoW
			...EXIF_POWERED_FILE_EXTENSIONS,
		],
		extensions_to_delete: [ '.AAE', '.DS_Store', ].map(s => s.toLowerCase()),
	}
}
