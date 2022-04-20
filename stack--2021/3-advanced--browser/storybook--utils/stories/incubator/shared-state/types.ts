import { WithRevision } from '@offirmo-private/state-utils'

////////////////////////////////////

export interface LogEntry {
	date: number
	text: string // simple since it's a debug tool
}

export interface State extends WithRevision {
	cloud_sync_state: {
		[k: string]: boolean
	}

	log: LogEntry[]
}

////////////////////////////////////
