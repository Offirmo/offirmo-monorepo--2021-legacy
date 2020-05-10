export type CSSColor = string

export interface LoaderConfig {
	legend: string
	expected_rsrc_count: number
	bg_color: CSSColor
	fg_color: CSSColor
}

export interface Loader {
	configure(config: Readonly<Partial<LoaderConfig>>): void
	on_rsrc_loaded(id?: string): void
}
