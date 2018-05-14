
// instructions: https://support.google.com/googleapi/answer/7394288#ensure-approval
const URL_PRIVACY_POLICY = 'todo'
const URL_TERMS_OF_SERVICE = 'todo'

//////////// Me ////////////

const MAKER_OFFIRMO = {
	name: 'Offirmo',
	url: 'https://www.offirmo.net',
	cta: 'visit',
	social: {
		twitter: 'https://twitter.com/Offirmo',
		reddit: 'https://www.reddit.com/user/Offirmo',
		product_hunt: 'https://www.producthunt.com/@offirmo',
		github: 'https://github.com/Offirmo',
	},
}

const ONLINE_ADVENTURES = {
	name: 'Offirmo’s Online Adventures',
	maker: MAKER_OFFIRMO,
	url: 'https://www.online-adventur.es/the-boring-rpg',
	cta: 'explore',
	repo: 'https://github.com/online-adventures/online-adventures.github.io',
}

const THE_NPM_RPG = {
	name: 'The npm RPG',
	maker: MAKER_OFFIRMO,
	url: 'https://www.npmjs.com/package/the-npm-rpg',
	cta: 'play',
	homepage: 'https://www.online-adventur.es/the-npm-rpg',
	repo: 'https://github.com/Offirmo/offirmo-monorepo/tree/master/apps/the-npm-rpg',
	issues: 'https://github.com/Offirmo/offirmo-monorepo/issues',
	social: {
		product_hunt: 'https://www.producthunt.com/upcoming/the-npm-rpg',
	},
}

// metashort: https://metashort.co/pageEditor.php?shortURL=soe0b
const THE_BORING_RPG = {
	name: 'The Boring RPG reloaded',
	maker: MAKER_OFFIRMO,
	url: 'https://www.online-adventur.es/apps/the-boring-rpg',
	cta: 'play',
	homepage: 'https://www.online-adventur.es/the-boring-rpg',
	repo: 'https://github.com/Offirmo/offirmo-monorepo/tree/master/apps/the-boring-rpg',
	issues: 'https://github.com/Offirmo/offirmo-monorepo/issues',
	social: {
		shareable_url: 'https://metashort.co/soe0b',
		instagram: 'https://www.instagram.com/theboringrpg/',
		reddit: 'https://www.reddit.com/r/boringrpg/',
		twitter: 'https://twitter.com/TheBoringRpg',
	},
}

//////////// Others ////////////

const MAKER_ANDZ = {
	name: 'Andz',
	social: {
		reddit: 'https://www.reddit.com/user/andypants',
		twitter: 'https://twitter.com/BoringRPG',
	},
}

const THE_BORING_RPG_ORIGINAL = {
	maker: MAKER_ANDZ,
	url: 'http://http://www.boringrpg.com/',
	social: {
		reddit: 'https://www.reddit.com/r/boringrpg/',
		twitter: 'https://twitter.com/BoringRPG',
	},
}

////////////////////////////////////

const MAKERS = {
	'andz': MAKER_ANDZ,
	'offirmo': MAKER_OFFIRMO,
}

const APPS = {
	'the_boring_rpg': THE_BORING_RPG,
	'the_npm_rpg': THE_NPM_RPG,
}

////////////////////////////////////

export {
	MAKER_OFFIRMO,

	ONLINE_ADVENTURES,
	THE_NPM_RPG,
	THE_BORING_RPG,

	MAKERS,
	APPS,
}
