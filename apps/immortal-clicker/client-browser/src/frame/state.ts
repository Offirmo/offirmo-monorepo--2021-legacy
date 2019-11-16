
export interface State {
	chat: {
		channel_id: string
		nickname: string
	}

	savegame: {
		main_LS_key: string
		secondary_LS_keys: string[]
	}

	urls: {
		bug_report: string | null,
		social: Array<{
			icon: string
			url: string
		}>
	}

	rsrc_to_preload: string[],
}
