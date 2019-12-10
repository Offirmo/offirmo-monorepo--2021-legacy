
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


	const gamer_status = (interaction_count >= 10)
		? GAMER_STATUS[1]
		: GAMER_STATUS[0]

	const xp = state.xp + state.level
