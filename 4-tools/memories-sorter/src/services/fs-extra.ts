import { checkPathsSync as throw_if_identical_sync } from 'fs-extra/lib/util/stat.js'

let fs: any // TODO fix untyping

fs = require('@offirmo/cli-toolbox/fs/extra')

export default fs

import { AbsolutePath } from '../types'

export function _is_same_inode(abs_path_a: AbsolutePath, abs_path_b: AbsolutePath): boolean {
	// abusing an internal non-documented function of fs-extra
	// TODO re-code properly using fs.stat
	try {
		throw_if_identical_sync(abs_path_a, abs_path_b)
		return false
	}
	catch (err) {
		if (err.message.includes('Source and destination must not be the same'))
			return true
	}
	return false
}
