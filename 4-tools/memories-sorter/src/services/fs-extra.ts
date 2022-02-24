import assert from 'tiny-invariant'

let fs: any // TODO fix untyping

fs = require('@offirmo/cli-toolbox/fs/extra')

export default fs

import { AbsolutePath } from '../types'

export function _is_same_inode(abs_path_a: AbsolutePath, abs_path_b: AbsolutePath): boolean {
	const stats_a = fs.statSync(abs_path_a)
	const stats_b = fs.statSync(abs_path_b)

	assert(stats_a !== undefined && stats_b !== undefined, `_is_same_inode at least 1 param should exist!`)

	return stats_a?.ino === stats_b?.ino
}
