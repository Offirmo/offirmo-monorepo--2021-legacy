
import { Enum } from 'typescript-string-enums'

// tslint:disable-next-line: variable-name
const Tag = Enum(
	'',

	// features
	'city',
	'castle',
	'mountain',
	'river',
	'sea',

	// in/outdoor
	'outside',
	'outside--surface',
	'outside--underground',
	'inside',

	//
	'people',
	'people--guard',
	'people--sentinel',
	'people--traveller',
	'people--merchant',

	//
	'monster',
	'monster--dragon',

	//
	'dungeon',
	'dungeon--entrance',

	//
	'activity--fight',

	// mood

	// season

	// biome

)
type Tag = Enum<typeof Tag> // eslint-disable-line no-redeclare


interface Author {
	display_name: string
	url: string
}
type AuthorHash = { [k: string]: Readonly<Author> }

interface Artwork {
	author: Author
	source: string
	display_name: string
	keywords: Tag[]
}

interface Background extends Artwork{
	css_class: string
	position_pct: { x: number, y: number }
	position_pct_alt?: { x: number, y: number }
}


export {
	Author,
	AuthorHash,
	Artwork,
	Background,
}
