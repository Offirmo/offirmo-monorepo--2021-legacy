

interface Author {
	display_name: string
	url: string
}
type AuthorHash = { [k: string]: Readonly<Author> }

interface Artwork {
	author: Author
	source: string
	display_name: string
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
