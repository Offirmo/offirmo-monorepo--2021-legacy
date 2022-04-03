
// instructions: https://support.google.com/googleapi/answer/7394288#ensure-approval
const URL_PRIVACY_POLICY = 'TODO'
const URL_TERMS_OF_SERVICE = 'TODO'

//////////// Me ////////////


const MAKER_OFFIRMO = {
	name: 'Offirmo',
	url: 'https://www.offirmo.net',
	cta: 'visit',
	social_urls: {
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
	repo_url: 'https://github.com/online-adventures/online-adventures.github.io',
}
/*
const THE_NPM_RPG = {
	name: 'The npm RPG',
	maker: MAKER_OFFIRMO,
	url: 'https://www.npmjs.com/package/the-npm-rpg',
	cta: 'play',
	homepage_url: 'https://www.online-adventur.es/the-npm-rpg',
	repo_url: 'https://github.com/Offirmo/offirmo-monorepo/tree/master/A-apps/the-npm-rpg',
	issues_url: 'https://github.com/Offirmo/offirmo-monorepo/issues',
	social_urls: {
		product_hunt: 'https://www.producthunt.com/upcoming/the-npm-rpg',
	},
}*/

const THE_BORING_RPG = {
	name: 'The Boring RPG reborn',
	maker: MAKER_OFFIRMO,
	url: 'https://www.online-adventur.es/apps/the-boring-rpg',
	cta: 'play',
	homepage_url: 'https://www.online-adventur.es/the-boring-rpg',
	changelog: 'https://www.reddit.com/r/boringrpg/',
	repo_url: 'https://github.com/Offirmo/offirmo-monorepo/tree/master/C-apps--clients/the-boring-rpg',
	issues_url: 'https://github.com/Offirmo/offirmo-monorepo/issues',
	aggregated_links_url: 'https://linktr.ee/theboringrpg',
	social_urls: {
		facebook: '',
		instagram: 'https://www.instagram.com/theboringrpg/',
		reddit: 'https://www.reddit.com/r/boringrpg/',
		twitter: 'https://twitter.com/TheBoringRpg',
	},
}

//////////// Others ////////////

const MAKER_ANDZ = {
	name: 'Andz',
	social_urls: {
		reddit: 'https://www.reddit.com/user/andypants',
		twitter: 'https://twitter.com/BoringRPG',
	},
}

const THE_BORING_RPG_ORIGINAL = {
	maker: MAKER_ANDZ,
	url: 'https://www.boringrpg.com/',
	social_urls: {
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
	//'the_npm_rpg': THE_NPM_RPG,
}

////////////////////////////////////

export {
	MAKER_OFFIRMO,

	ONLINE_ADVENTURES,
	//THE_NPM_RPG,
	THE_BORING_RPG,

	MAKERS,
	APPS,
}
