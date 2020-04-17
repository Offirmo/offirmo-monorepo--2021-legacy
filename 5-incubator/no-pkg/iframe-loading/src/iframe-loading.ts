
export type CSSColor = string

export interface LoaderConfig {
	legend: string
	expected_rsrc_count: number
	bg_color: CSSColor
	fg_color: CSSColor
}

export interface Loader {
	configure_loader(config: Partial<LoaderConfig>): void
	on_rsrc_loaded(id?: string): void
}

export const loader_noop: Loader = {
	configure_loader(config: Partial<LoaderConfig>) {},
	on_rsrc_loaded(id?: string) {},
}

export const XOFF: {
	loader?: Loader
} = (window as any).XOFF || {}
;(window as any).XOFF = XOFF

export const loader = XOFF.loader || loader_noop
