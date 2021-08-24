import path from 'path'

import assert from 'tiny-invariant'
import stylize_string from 'chalk'
import { Tags } from 'exiftool-vendored'
import { Immutable } from '@offirmo-private/ts-types'
import { prettify_json } from '@offirmo-private/prettify-any'
import { get_base_loose, enforce_immutability } from '@offirmo-private/state-utils'

import { LIB as APP } from '../../consts'
import { AbsolutePath, RelativePath, SimpleYYYYMMDD } from '../../types'
import { Action, ActionType } from '../actions'
import * as Actions from '../actions'
import { FileHash } from '../../services/hash'
import { FsStatsSubset } from '../../services/fs_stats'
import { get_file_basename_without_copy_index } from '../../services/name_parser'
import {
	get_compact_date,
	get_day_of_week_index,
	add_days,
	get_debug_representation,
} from '../../services/better-date'
import logger from '../../services/logger'

import * as Folder from '../folder'
import * as File from '../file'
import * as Notes from '../notes'
import { FolderId } from '../folder'
import { FileId, PersistedNotes } from '../file'
import { get_params } from '../../params'

/////////////////////

export interface State {
	root: AbsolutePath

	extra_notes: Notes.State,
	folders: { [id: string /* FolderId */]: Folder.State }
	files: { [id: string /* FileId */]: File.State }

	encountered_hash_count: {
		[hash: string /* FileHash */]: number
	}

	queue: Action[],
	notes_save_required: boolean // TODO finish implementation

	_optim: {
	}
}
