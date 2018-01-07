import {
	UnicodeCharDetails,
	UNICODE_CHARS,
} from '@oh-my-rpg/data'

interface RawMonsterEntry {
	name: string
	emoji: string
}

const EMOJI_ENTRIES: RawMonsterEntry[] = Object.keys(UNICODE_CHARS)
	.map(key => UNICODE_CHARS[key])
	.filter(charDetails => charDetails.taxonomy.includes('monster'))
	.map((charDetails: UnicodeCharDetails) => ({
		name: charDetails.properties.description,
		emoji: charDetails.char,
	}))

const EXTRA_ENTRIES: RawMonsterEntry[] = [
	{
		name: 'drop bear',
		emoji: '🐨',
	},
	{
		name: 'dahu',
		emoji: '🐏',
	},
]


const ENTRIES = ([] as RawMonsterEntry[]).concat(...EMOJI_ENTRIES, ...EXTRA_ENTRIES)

export {
	RawMonsterEntry,
	ENTRIES,
}
