import util from 'util'
import path from 'path'
import fs from 'fs'

import { Immutable } from '@offirmo-private/ts-types'
import { enforce_immutability } from '@offirmo-private/state-utils'
import { expect } from 'chai'
import assert from 'tiny-invariant'
import {  exiftool } from 'exiftool-vendored'
import hasha from 'hasha'

import {
	create,
	on_notes_recovered,
	has_all_infos_for_extracting_the_creation_date,
	is_exif_powered_media_file,
	is_media_file,
	on_info_read__exif,
	on_info_read__fs_stats,
	on_info_read__hash,
	on_info_read__current_neighbors_primary_hints,
	PersistedNotes,
	State as FileState,
} from '../state/file'


export async function load_real_media_file(abs_path: string, state: Immutable<FileState> = create(path.parse(abs_path).base), recovered_notes: null | Immutable<PersistedNotes> = null): Promise<Immutable<FileState>> {
	expect(is_media_file(state)).to.be.true
	expect(is_exif_powered_media_file(state)).to.be.true

	await Promise.all([
		hasha.fromFile(abs_path, {algorithm: 'sha256'})
			.then(hash => {
				expect(has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 1').to.be.false
				assert(hash, 'should have hash')
				state = on_info_read__hash(state, hash)
			}),
		util.promisify(fs.stat)(abs_path)
			.then(stats => {
				expect(has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 2').to.be.false
				state = on_info_read__fs_stats(state, stats)
			}),
		exiftool.read(abs_path)
			.then(exif_data => {
				expect(has_all_infos_for_extracting_the_creation_date(state, { should_log: false }), 'load_real_media_file() has_all_infos_for_extracting_the_creation_date 3').to.be.false
				state = on_info_read__exif(state, exif_data)
			})
	])

	state = on_notes_recovered(state, recovered_notes)
	state = on_info_read__current_neighbors_primary_hints(state, null, 'unknown')

	expect(has_all_infos_for_extracting_the_creation_date(state, {})).to.be.true

	return enforce_immutability(state)
}
