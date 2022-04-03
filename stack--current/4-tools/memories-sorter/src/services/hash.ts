import assert from 'tiny-invariant'
import hasha from 'hasha'

import { AbsolutePath } from '../types'
import logger from './logger'

export type FileHash = string

export async function get_file_hash(abs_path: AbsolutePath): Promise<FileHash> {
	const hash = await hasha.fromFile(abs_path, {algorithm: 'sha256'})
	assert(hash, 'hasha ok')
	logger.silly(`- got hash for "${abs_path}"…`, { hash })
	return hash
}

export default get_file_hash
