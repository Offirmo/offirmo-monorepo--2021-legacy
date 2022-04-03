const LIB = 'game-frame'

const game_frame = (window as any).game_frame as {
	options: {

		chat_channel_id: string
		chat_nickname: string

		savegame_main_LS_key: string
		savegame_secondary_LS_keys: string[]
		rsrc_to_preload: string[],
		bug_report_url: string | null,
		social_urls: Array<{
			icon: string
			url: string
		}>
	}
}

export {
	LIB,
	game_frame,
}
