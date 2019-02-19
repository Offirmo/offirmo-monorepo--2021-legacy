import {
	Author,
	AuthorHash,
	Background,
} from './types'

const AUTHORS: Readonly<Author>[] = [
	{
		display_name: 'Andreas Rocha',
		url: 'https://www.artstation.com/andreasrocha',
	},
	{
		display_name: 'Cyril Labranche',
		url: 'https://www.artstation.com/hazdesign',
	},
	{
		display_name: 'Dan Zhao',
		url: 'https://www.artstation.com/danzhao',
	},
	{
		display_name: 'Daniel Alekow',
		url: 'https://www.artstation.com/memod',
	},
	{
		display_name: 'Dmitry Kremiansky',
		url: 'https://www.artstation.com/dmitrykremiansky',
	},
	{
		display_name: 'Jorge Miguel Jacinto',
		url:          'http://www.jorgejacinto.com/',
	},
	{
		display_name: 'Julius Camenzind',
		url: 'https://www.artstation.com/juliuscamenzind',
	},
	{
		display_name: 'Raphael Lacoste',
		url: 'https://www.artstation.com/raphael-lacoste',
	},
	{
		display_name: 'Robh Ruppel',
		url: 'https://www.artstation.com/robh_ruppel_design',
	},
	{
		display_name: 'Thomas Stoop',
		url: 'https://www.artstation.com/thomasstoop',
	},
	{
		display_name: 'Jaecheol Park',
		url: 'https://www.artstation.com/paperblue'
	},
	/*
	{
		display_name: "",
		url: "",
	},
	*/
]
const AUTHORS_BY_NAME: AuthorHash = AUTHORS.reduce(
	(acc: AuthorHash, val: Author) => {
		acc[val.display_name] = val
		return acc
	},
	{}
)


const ELEMENTS: Readonly<Background>[] = [

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/zA6ow',
		display_name:     'Ar Nat Village',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-ar_nat_village',
		position_pct:     {"x":79,"y":20},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/PmORd1',
		display_name:     'At The Gate',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-at_the_gate',
		position_pct:     {"x":85,"y":62},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/B5OVl',
		display_name:     'Blue Valley',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-blue_valley',
		position_pct:     {"x":74,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/bOnRd',
		display_name:     'Castlerock',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-castlerock',
		position_pct:     {"x":32,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/NyAEq',
		display_name:     'City Gates',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-city_gates',
		position_pct:     {"x":63,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/0nnkK',
		display_name:     'Dangerous Roads',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-dangerous_roads',
		position_pct:     {"x":64,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/JQPmA',
		display_name:     'Dark Times',
		keywords:         [ 'dungeon' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-dark_times',
		position_pct:     {"x":78,"y":60},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/yOKz9',
		display_name:     'Deep In The Jungle',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-deep_in_the_jungle',
		position_pct:     {"x":65,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/8eWBR',
		display_name:     'Deep In The Woods',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-deep_in_the_woods',
		position_pct:     {"x":30,"y":80},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/233v',
		display_name:     'Deep Shadows',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-deep_shadows',
		position_pct:     {"x":23,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/PQobn',
		display_name:     'Dome City',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-dome_city',
		position_pct:     {"x":19,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/eve5D',
		display_name:     'Dragons Pass',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-dragons_pass',
		position_pct:     {"x":0,"y":27},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/LObk5',
		display_name:     'Enchanted Forest Ii',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-enchanted_forest_ii',
		position_pct:     {"x":66,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/xNxbr',
		display_name:     'Fiery Path',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-fiery_path',
		position_pct:     {"x":78,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/Ly4YP',
		display_name:     'First Rays',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-first_rays',
		position_pct:     {"x":41,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/PQ064',
		display_name:     'Forbidden Kingdom',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-forbidden_kingdom',
		position_pct:     {"x":26,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/Y93oK',
		display_name:     'Foundation',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-foundation',
		position_pct:     {"x":50,"y":46},
		position_pct_alt: {"x":50,"y":0},
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/Y83lK',
		display_name:     'Hidden Treasures',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-hidden_treasures',
		position_pct:     {"x":73,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/YK4Bb',
		display_name:     'Homage To Sintra',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-homage_to_sintra',
		position_pct:     {"x":75,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.instagram.com/p/Bco4R3jgJhR/?utm_source=ig_web_button_share_sheet',
		display_name:     'Humble Abode',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-humble_abode',
		position_pct:     {"x":50,"y":72},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/dedbw',
		display_name:     'Ice Temple',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-ice_temple',
		position_pct:     {"x":78,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/dWOKw',
		display_name:     'Light Forest',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-light_forest',
		position_pct:     {"x":72,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/0rKZY',
		display_name:     'Magic Hour',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-magic_hour',
		position_pct:     {"x":81,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/grxge',
		display_name:     'Mountain Pass',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-mountain_pass',
		position_pct:     {"x":96,"y":80},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/1bzno',
		display_name:     'Old Forest',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-old_forest',
		position_pct:     {"x":61,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/lVaZe',
		display_name:     'Path Of Wisdom',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-path_of_wisdom',
		position_pct:     {"x":65,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/AbR9y',
		display_name:     'Peace Of Mind',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-peace_of_mind',
		position_pct:     {"x":45,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/PvNv4',
		display_name:     'Safe Haven',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-safe_haven',
		position_pct:     {"x":80,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/zwlqw',
		display_name:     'Soul Searching',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-soul_searching',
		position_pct:     {"x":57,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/5LEmP',
		display_name:     'Spring Is Coming',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-spring_is_coming',
		position_pct:     {"x":68,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/D48PR',
		display_name:     'Student Vs Teacher',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-student_vs_teacher',
		position_pct:     {"x":45,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/Y8awY',
		display_name:     'The Citadel Ii',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_citadel_ii',
		position_pct:     {"x":98,"y":25},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/JNraz',
		display_name:     'The Dark Citadel',
		keywords:         [ 'dungeon' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_dark_citadel',
		position_pct:     {"x":60,"y":51},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.instagram.com/p/BcmGYYkAeD9/?utm_source=ig_web_button_share_sheet',
		display_name:     'The Emissary',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_emissary',
		position_pct:     {"x":31,"y":65},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/w8838Z',
		display_name:     'The Fiery Forest',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_fiery_forest',
		position_pct:     {"x":84,"y":1},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/2dE5B',
		display_name:     'The Gathering',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_gathering',
		position_pct:     {"x":51,"y":99},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/kalr6',
		display_name:     'The Hidden Village Ii',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_hidden_village_ii',
		position_pct:     {"x":67,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/wZrGZ',
		display_name:     'The Last Fortress',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_last_fortress',
		position_pct:     {"x":66,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/lVVb8z',
		display_name:     'The Message',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_message',
		position_pct:     {"x":91,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/ZQlb1',
		display_name:     'The Treehouse',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-the_treehouse',
		position_pct:     {"x":75,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/O3gWk',
		display_name:     'Unnamed 2',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-unnamed_2',
		position_pct:     {"x":63,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/o69XL',
		display_name:     'Warm Mist',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-warm_mist',
		position_pct:     {"x":24,"y":71},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/mOVW1',
		display_name:     'Waterfall Memories',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-waterfall_memories',
		position_pct:     {"x":64,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/k9eaA',
		display_name:     'We Found This Amazing Place',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-we_found_this_amazing_place',
		position_pct:     {"x":60,"y":90},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/g3X5G',
		display_name:     'Winter Lights',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-winter_lights',
		position_pct:     {"x":74,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/0g2J5',
		display_name:     'Winter Travellers',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-winter_travellers',
		position_pct:     {"x":55,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/8lm0Kx',
		display_name:     'Wizards Tower',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-wizards_tower',
		position_pct:     {"x":18,"y":1},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/4bKz1',
		display_name:     'Cold March',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-cold_march',
		position_pct:     {"x":26,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/e13G',
		display_name:     'Morning Arrival',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-morning_arrival',
		position_pct:     {"x":49,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Andreas Rocha'],
		source:           'https://www.artstation.com/artwork/d4zBx',
		display_name:     'Fields Of Gold',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚andreas_rocha-fields_of_gold',
		position_pct:     {"x":63,"y":70},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Cyril Labranche'],
		source:           'https://www.artstation.com/artwork/k4EXb0',
		display_name:     'Pikes',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚cyril_labranche-pikes',
		position_pct:     {"x":80,"y":60},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dan Zhao'],
		source:           'https://www.artstation.com/artwork/6dJvW',
		display_name:     'A Cabin In The Cave',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dan_zhao-a_cabin_in_the_cave',
		position_pct:     {"x":57,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dan Zhao'],
		source:           'https://www.artstation.com/artwork/2WvEe',
		display_name:     'A Practice',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dan_zhao-a_practice',
		position_pct:     {"x":66,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dan Zhao'],
		source:           'https://www.artstation.com/artwork/gJg3rG',
		display_name:     'Ancient Castle',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dan_zhao-ancient_castle',
		position_pct:     {"x":34,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dan Zhao'],
		source:           'https://www.artstation.com/artwork/Xale0',
		display_name:     'Barbacan',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dan_zhao-barbacan',
		position_pct:     {"x":39,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dan Zhao'],
		source:           'https://www.artstation.com/artwork/AZVkq',
		display_name:     'Canyon',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dan_zhao-canyon',
		position_pct:     {"x":26,"y":50},
		position_pct_alt: {"x":59,"y":50},
	},

	{
		author:           AUTHORS_BY_NAME['Dan Zhao'],
		source:           'https://www.artstation.com/artwork/L4dL0',
		display_name:     'Secluded Valley',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dan_zhao-secluded_valley',
		position_pct:     {"x":75,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Daniel Alekow'],
		source:           'https://www.artstation.com/artwork/BmXlJ6',
		display_name:     'Albion Lymhurst',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚daniel_alekow-albion_lymhurst',
		position_pct:     {"x":37,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Daniel Alekow'],
		source:           'https://www.artstation.com/artwork/W2dVJv',
		display_name:     'Inside Caerleon',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚daniel_alekow-inside_caerleon',
		position_pct:     {"x":48,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:           'https://www.artstation.com/artwork/W2XxeE',
		display_name:     'A Secret Place Alps',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dmitry_kremiansky-a_secret_place_alps',
		position_pct:     {"x":47,"y":30},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:           'https://www.artstation.com/artwork/1KwQL',
		display_name:     'Ships And Seagulls',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dmitry_kremiansky-ships_and_seagulls',
		position_pct:     {"x":52,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:           'https://www.artstation.com/artwork/Ra84X',
		display_name:     'Thames',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dmitry_kremiansky-thames',
		position_pct:     {"x":74,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:           'https://www.artstation.com/artwork/ODzay',
		display_name:     'Victorian Street',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚dmitry_kremiansky-victorian_street',
		position_pct:     {"x":79,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Jaecheol Park'],
		source:           'https://www.artstation.com/artwork/dvOJQ',
		display_name:     'Bank',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jaecheol_park-bank',
		position_pct:     {"x":70,"y":70},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Jaecheol Park'],
		source:           'https://www.artstation.com/artwork/YaBABw',
		display_name:     'Bl F',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jaecheol_park-bl_f',
		position_pct:     {"x":90,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Jaecheol Park'],
		source:           'https://www.artstation.com/artwork/v1bYa3',
		display_name:     'Castle',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jaecheol_park-castle',
		position_pct:     {"x":31,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/nrm0E',
		display_name: 'Cave Waterfall',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jaecheol_park-cave_waterfall',
		position_pct: { x: 20, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/4mQ5W',
		display_name: 'City Sea',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jaecheol_park-city_sea',
		position_pct: { x: 40, y: 29 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/Kaeq9B',
		display_name: 'Forest B R',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jaecheol_park-forest_b_r',
		position_pct: { x: 31, y: 50 },
	},

	{
		author:           AUTHORS_BY_NAME['Jaecheol Park'],
		source:           'https://www.artstation.com/artwork/Jl94qD',
		display_name:     'Forest Gr Up',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jaecheol_park-forest_gr_up',
		position_pct:     {"x":37,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/GbWP3',
		display_name: 'Forest M T',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jaecheol_park-forest_m_t',
		position_pct: { x: 57, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/rbBBe',
		display_name: 'Forest Night Waterfall',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jaecheol_park-forest_night_waterfall',
		position_pct: { x: 45, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/GXaEJW',
		display_name: 'Forest Waterfall',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jaecheol_park-forest_waterfall',
		position_pct: { x: 39, y: 1 },
	},

	{
		author:           AUTHORS_BY_NAME['Jaecheol Park'],
		source:           'https://www.artstation.com/artwork/6aNlX5',
		display_name:     'Sea R W',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jaecheol_park-sea_r_w',
		position_pct:     {"x":19,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Jaecheol Park'],
		source:           'https://www.artstation.com/artwork/A3gvz',
		display_name:     'Shop',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jaecheol_park-shop',
		position_pct:     {"x":10,"y":28},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Jorge Miguel Jacinto'],
		source:           'https://www.deviantart.com/jjcanvas/art/Civilization-127234207',
		display_name:     'Civilization',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jorge_miguel_jacinto-civilization',
		position_pct:     {"x":41,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Jorge Miguel Jacinto'],
		source:           'https://www.deviantart.com/jjcanvas/art/Half-Remembered-Ruins-351880992',
		display_name:     'Half Remembered Ruins',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚jorge_miguel_jacinto-half_remembered_ruins',
		position_pct:     {"x":60,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Julius Camenzind'],
		source:           'https://www.artstation.com/artwork/V84Z4',
		display_name:     'Snowcapped Environment',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚julius_camenzind-snowcapped_environment',
		position_pct:     {"x":74,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/wEAV',
		display_name:     'Terry Goodkind French Cover',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-terry_goodkind_french_cover',
		position_pct:     {"x":5,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/Kz6G',
		display_name:     'Gnomon',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-gnomon',
		position_pct:     {"x":32,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/yE0n',
		display_name:     'Journey To The Center Of The Earth',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-journey_to_the_center_of_the_earth',
		position_pct:     {"x":55,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/9By4Q',
		display_name:     'Jungle',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-jungle',
		position_pct:     {"x":15,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/xORGY',
		display_name:     'Kvaslr Fortress',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-kvaslr_fortress',
		position_pct:     {"x":84,"y":1},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/dQOW',
		display_name:     'Lost Island',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-lost_island',
		position_pct:     {"x":2,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/oJL3q',
		display_name:     'Path To The Gothic Choir',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-path_to_the_gothic_choir',
		position_pct:     {"x":30,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/6aNvWx',
		display_name:     'Sentinels',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-sentinels',
		position_pct:     {"x":90,"y":10},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/GmO4',
		display_name:     'Return Of The Knight',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-return_of_the_knight',
		position_pct:     {"x":79,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/0EX4',
		display_name:     'Ride At Dusk',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-ride_at_dusk',
		position_pct:     {"x":60,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/P2m1',
		display_name:     'Santa Lucia Arrival',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-santa_lucia_arrival',
		position_pct:     {"x":20,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/8rln',
		display_name:     'The Coast',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-the_coast',
		position_pct:     {"x":100,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/e0ayvG',
		display_name:     'The Encounter',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-the_encounter',
		position_pct:     {"x":1,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/ODyy',
		display_name:     'The Journey',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-the_journey',
		position_pct:     {"x":70,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/bVav',
		display_name:     'The Mangrove',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-the_mangrove',
		position_pct:     {"x":95,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Raphael Lacoste'],
		source:           'https://www.artstation.com/artwork/nZvA4',
		display_name:     'Viking Ambush',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚raphael_lacoste-viking_ambush',
		position_pct:     {"x":25,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Robh Ruppel'],
		source:           'https://www.artstation.com/artwork/xz3LK1',
		display_name:     'Tangled Castle',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚robh_ruppel-tangled_castle',
		position_pct:     {"x":45,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Thomas Stoop'],
		source:           'https://www.artstation.com/artwork/bagvGE',
		display_name:     'Snow Forest 1',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚thomas_stoop-snow_forest_1',
		position_pct:     {"x":70,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Thomas Stoop'],
		source:           'https://www.artstation.com/artwork/bagvGE',
		display_name:     'Snow Forest 2',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚thomas_stoop-snow_forest_2',
		position_pct:     {"x":69,"y":50},
		position_pct_alt: undefined,
	},

	{
		author:           AUTHORS_BY_NAME['Thomas Stoop'],
		source:           'https://www.artstation.com/artwork/bagvGE',
		display_name:     'Snow Forest 3',
		keywords:         [ '' ],
		css_class:        'tbrpg⋄bg-image⁚thomas_stoop-snow_forest_3',
		position_pct:     {"x":57,"y":1},
		position_pct_alt: undefined,
	},

]


export {
	AUTHORS,
	AUTHORS_BY_NAME,
	ELEMENTS,
}
