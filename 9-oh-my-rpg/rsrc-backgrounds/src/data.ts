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
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/zA6ow',
		display_name: 'Ar Nat Village',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-ar_nat_village',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/PmORd1',
		display_name: 'At The Gate',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-at_the_gate',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/B5OVl',
		display_name: 'Blue Valley',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-blue_valley',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/NyAEq',
		display_name: 'City Gates',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-city_gates',
		position_pct: { x: 63, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/0nnkK',
		display_name: 'Dangerous Roads',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-dangerous_roads',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/JNraz',
		display_name: 'The Dark Citadel',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-dark_citadel',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/JQPmA',
		display_name: 'Dark Times',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-dark_times',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/8eWBR',
		display_name: 'Deep In The Woods',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-deep_in_the_forest',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/yOKz9',
		display_name: 'Deep In The Jungle',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-deep_in_the_jungle',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/233v',
		display_name: 'Deep Shadows',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-deep_shadows',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/eve5D',
		display_name: 'Dragons Pass',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-dragons_pass',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/Ly4YP',
		display_name: 'First Rays',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-first_rays',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/Y93oK',
		display_name: 'Foundation',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-foundation',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/Y83lK',
		display_name: 'Hidden Treasures',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-hidden_treasures',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/YK4Bb',
		display_name: 'Homage To Sintra',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-homage_to_sintra',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/dedbw',
		display_name: 'Ice Temple',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-ice_temple',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/oAoQk',
		display_name: 'Ill Tidings',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-ill_tidings',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/0rKZY',
		display_name: 'Magic Hour',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-magic_hour',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/grxge',
		display_name: 'Mountain Pass',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-mountain_pass',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/1bzno',
		display_name: 'Old Forest',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-old_forest',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/AbR9y',
		display_name: 'Peace Of Mind',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-peace_of_mind',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/PvNv4',
		display_name: 'Safe Haven',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-safe_haven',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/5LEmP',
		display_name: 'Spring Is Coming',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-spring_is_coming',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/Y8awY',
		display_name: 'The Citadel Ii',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-the_citadel',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/w8838Z',
		display_name: 'The Fiery Forest',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-the_fiery_forest',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/2dE5B',
		display_name: 'The Gathering',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-the_gathering',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/wZrGZ',
		display_name: 'The Last Fortress',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-the_last_fortress',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/lVVb8z',
		display_name: 'The Message',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-the_message',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/lVaZe',
		display_name: 'Path Of Wisdom',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-the_path_of_wisdom',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/bOnRd',
		display_name: 'Castlerock',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-unnamed_1',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/O3gWk',
		display_name: 'Unnamed 2',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-unnamed_2',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/o69XL',
		display_name: 'Warm Mist',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-warm_mist',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/mOVW1',
		display_name: 'Waterfall Memories',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-waterfall_memories',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/8lm0Kx',
		display_name: 'Wizards Tower',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-wizards_tower',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/4bKz1',
		display_name: 'Cold March',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-cold_march',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/e13G',
		display_name: 'Morning Arrival',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-morning_arrival',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Andreas Rocha'],
		source:       'https://www.artstation.com/artwork/d4zBx',
		display_name: 'Fields Of Gold',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚andreas_rocha-fields_of_gold',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Cyril Labranche'],
		source:       'https://www.artstation.com/artwork/k4EXb0',
		display_name: 'Pikes',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚cyril_labranche-pike',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dan Zhao'],
		source:       'https://www.artstation.com/artwork/gJg3rG',
		display_name: 'Ancient Castle',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dan_zhao-ancient_castle',
		position_pct: { x: 34, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dan Zhao'],
		source:       'https://www.artstation.com/artwork/AZVkq',
		display_name: 'Canyon',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dan_zhao-artwork_1',
		position_pct: { x: 32, y: 50 },
		position_pct_alt: { x: 59, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dan Zhao'],
		source:       'https://www.artstation.com/artwork/Xale0',
		display_name: 'Barbacan',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dan_zhao-artwork_2',
		position_pct: { x: 39, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dan Zhao'],
		source:       'https://www.artstation.com/artwork/6dJvW',
		display_name: 'A Cabin In The Cave',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dan_zhao-cabin_in_the_cave',
		position_pct: { x: 57, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dan Zhao'],
		source:       'https://www.artstation.com/artwork/2WvEe',
		display_name: 'A Practice',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dan_zhao-practice',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dan Zhao'],
		source:       'https://www.artstation.com/artwork/L4dL0',
		display_name: 'Secluded Valley',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dan_zhao-secluded_valley',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Daniel Alekow'],
		source:       'https://www.artstation.com/artwork/BmXlJ6',
		display_name: 'Albion Lymhurst',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚daniel_alekow-albion_lymhurst',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Daniel Alekow'],
		source:       'https://www.artstation.com/artwork/W2dVJv',
		display_name: 'Inside Caerleon',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚daniel_alekow-inside_caerleon',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:       'https://www.artstation.com/artwork/W2XxeE',
		display_name: 'A Secret Place Alps',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dmitry_kremiansky-a_secret_place_alps',
		position_pct: { x: 47, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:       'https://www.artstation.com/artwork/Ra84X',
		display_name: 'Thames',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dmitry_kremiansky-depth_needed',
		position_pct: { x: 74, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:       'https://www.artstation.com/artwork/1KwQL',
		display_name: 'Ships And Seagulls',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dmitry_kremiansky-ship',
		position_pct: { x: 52, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Dmitry Kremiansky'],
		source:       'https://www.artstation.com/artwork/ODzay',
		display_name: 'Victorian Street',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚dmitry_kremiansky-streets',
		position_pct: { x: 79, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jorge Miguel Jacinto'],
		source:       'https://www.deviantart.com/jjcanvas/art/Civilization-127234207',
		display_name: 'Civilization',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jorge_miguel_jacinto-civilization',
		position_pct: { x: 41, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jorge Miguel Jacinto'],
		source:       'https://www.deviantart.com/jjcanvas/art/Half-Remembered-Ruins-351880992',
		display_name: 'Half Remembered Ruins',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚jorge_miguel_jacinto-half_remembered_ruins',
		position_pct: { x: 60, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Julius Camenzind'],
		source:       'https://www.artstation.com/artwork/V84Z4',
		display_name: 'Snowcapped Environment',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚julius_camenzind-snowcapped_environment',
		position_pct: { x: 74, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/wEAV',
		display_name: 'Terry Goodkind French Cover',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-castle_phantom',
		position_pct: { x: 5, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/Kz6G',
		display_name: 'Gnomon',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-gnomon',
		position_pct: { x: 32, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/oJL3q',
		display_name: 'Path To The Gothic Choir',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-gothic_choir',
		position_pct: { x: 30, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/yE0n',
		display_name: 'Journey To The Center Of The Earth',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-journey_to_the_center_of_the_earth',
		position_pct: { x: 55, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/9By4Q',
		display_name: 'Jungle',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-jungle',
		position_pct: { x: 15, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/xORGY',
		display_name: 'Kvaslr Fortress',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-kvasir_fortress',
		position_pct: { x: 84, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/1nrAe',
		display_name: 'Landscape With Hats',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-landscape',
		position_pct: { x: 17, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/dQOW',
		display_name: 'Lost Island',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-lost_island',
		position_pct: { x: 2, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/12ewZ',
		display_name: 'Monoliths',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-monoliths',
		position_pct: { x: 0, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/GmO4',
		display_name: 'Return Of The Knight',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-return_of_the_knight',
		position_pct: { x: 79, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/0EX4',
		display_name: 'Ride At Dusk',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-ride_at_dusk',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/P2m1',
		display_name: 'Santa Lucia Arrival',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-santa_lucia_arrival',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/qJWeD',
		display_name: 'Journey In The Skye Land',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-skye_land',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/8rln',
		display_name: 'The Coast',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-the_coast',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/e0ayvG',
		display_name: 'The Encounter',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-the_encounter',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/ODyy',
		display_name: 'The Journey',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-the_journey',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/bVav',
		display_name: 'The Mangrove',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-the_mangrove',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Raphael Lacoste'],
		source:       'https://www.artstation.com/artwork/nZvA4',
		display_name: 'Viking Ambush',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚raphael_lacoste-viking_ambush',
		position_pct: { x: 25, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Robh Ruppel'],
		source:       'https://www.artstation.com/artwork/xz3LK1',
		display_name: 'Tangled Castle',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚robh_ruppel-tangled_castle',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Thomas Stoop'],
		source:       'https://www.artstation.com/artwork/bagvGE',
		display_name: 'Snow Forest 1',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚thomas_stoop-snow_forest_1',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Thomas Stoop'],
		source:       'https://www.artstation.com/artwork/bagvGE',
		display_name: 'Snow Forest 2',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚thomas_stoop-snow_forest_2',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Thomas Stoop'],
		source:       'https://www.artstation.com/artwork/bagvGE',
		display_name: 'Snow Forest 3',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚thomas_stoop-snow_forest_3',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/dvOJQ',
		display_name: 'Bank',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚Jaecheol Park-bank',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/v1bYa3',
		display_name: 'Castle',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚Jaecheol Park-castle',
		position_pct: { x: 50, y: 50 },
	},

	{
		author:       AUTHORS_BY_NAME['Jaecheol Park'],
		source:       'https://www.artstation.com/artwork/A3gvz',
		display_name: 'Shop',
		keywords:     [],
		css_class:    'tbrpg⋄bg-image⁚Jaecheol Park-shop',
		position_pct: { x: 50, y: 50 },
	},
]


export {
	AUTHORS,
	AUTHORS_BY_NAME,
	ELEMENTS,
}
