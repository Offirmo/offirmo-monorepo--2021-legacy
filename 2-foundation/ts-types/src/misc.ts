/////////////////////

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types
// TODO Symbol?
export type JSPrimitiveType = boolean | null | undefined | number | string

/////////////////////

export interface NumberMap {
	[k: string]: number
}

/////////////////////

export interface I18nMessages {
	[k: string]: string | I18nMessages
}

/////////////////////

// TODO review Record!
export interface HashOf<T> {
	[k: string]: T
}

/////////////////////
