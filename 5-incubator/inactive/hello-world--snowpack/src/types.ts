
export type Url = string
export type TipUid = string

export interface Tip {
	content: string
	cta?: {
		target: Url
		text?: string // optional, default would be 'Check it out'
	}
}

export type TipsMapping = Record<TipUid, Tip>
