
export interface Panel {
	img_url: string
	text: string
}

export interface Story {
	title: string,
	description: string,
	panels: Panel[]
}
