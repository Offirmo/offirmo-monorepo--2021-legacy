
import { AbsolutePath } from '../../types'
import { Action } from '../actions'

import * as Folder from '../folder'
import * as File from '../file'
import * as Notes from '../notes'
import { FolderId } from '../folder'
import { FileId } from '../file'

import { FileHash } from '../../services/hash'

/////////////////////

export interface State {
	root: AbsolutePath

	extra_notes: Notes.State,
	folders: { [id: FolderId ]: Folder.State }
	files: { [id: FileId ]: File.State }

	encountered_hash_count: {
		[hash: FileHash ]: number
	}

	queue: Action[],
}
