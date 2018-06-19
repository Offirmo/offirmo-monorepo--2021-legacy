
const GAMER_STATUS = [
	{
		rank: 0,
		name: 'n00b',
		auto_period_ms: null,
	},
	{
		rank: 1,
		name: 'casual',
		auto_period_ms: null,
	},
	{
		rank: 2,
		name: 'regular',
		auto_period_ms: 2000,
	},
	{
		rank: 3,
		name: 'core',
		auto_period_s: 1000,
	},
	{
		rank: 4,
		name: 'hardcore',
		auto_period_s: 500,
	},
	{
		rank: 5,
		name: 'no life',
		auto_period_ms: 250,
	},
]

const GAMING_AIDS = [
	// gaming mouse
	// gaming keyboard
	// bot
	// second account
	//
]

// http://www.wowhead.com/zones
// https://twitter.com/i/web/status/936413338313084928
// https://wiki.guildwars2.com/wiki/Zone
/*
mountains
forest
pass
shire
fields
wildlands
hills
plateau
steppes
wetlands
plaguelands
marsh
peak
highlands
riverlands
isles
crater
glades
barrens
needles
 */
const LOCATIONS = [
	{
		name: 'Training grounds',
	},
	{
		name: 'Magical forest',
	},
	{
		name: 'Pirate island',
	},
	{
		name: 'The Kingdom\'s Capital',
	},
	{
		name: 'Demon\'s plane',
	},

]


let state = {
	interaction_count: 0,
	click_count: 0, // click as in clicker

	clicker_enhancers: [
		{
			name: 'herbal tea',
			price: 10,
			prod_added: 1,
			owned: false,
		},
	],
	auto_clickers: [
		{
			name: 'magic 8 ball',
			price: 10,
			click_per_s_added: 1,
			owned: false,
		},
	],

	gamer_status: GAMER_STATUS[0],
	xp: 0,
	level: 1,
	tick_count: 0,
}

function get_state() {
	return state
}



function play() {
	console.log('play')
	const interaction_count = state.interaction_count + 1
	const click_count = state.click_count + 1

	const gamer_status = (interaction_count >= 10)
		? GAMER_STATUS[1]
		: GAMER_STATUS[0]

	const xp = state.xp + state.level

	state = {
		...state,
		interaction_count,
		click_count,
		gamer_status,
		xp,
	}
}

function tick() {
	console.log('tick')
	const tick_count = state.tick_count + 1

	const xp = state.xp + state.level

	state = {
		...state,
		tick_count,
		xp,
	}
}

function change_location(xxx) {
	console.log('play')
	const interaction_count = state.interaction_count + 1


}


export {
	get_state,
	play,
	tick,
}
