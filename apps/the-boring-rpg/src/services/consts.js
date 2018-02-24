"use strict";

/////// autogen ///////
// do not edit this area, it is auto-generated
const VERSION='0.50.18'
const BUILD_DATE='20180224_08h33'
// TODO commit
/////// autogen ///////

const LIB = 'the-boring-rpg'

const SCHEMA_VERSION = 1

const LS_KEYS = {
	savegame: `${LIB}.savegame`,
}

const CHANNEL = window.location.hostname === 'www.online-adventur.es'
	? 'stable'
	: window.location.hostname === 'offirmo.netlify.com'
		? 'beta'
		: 'dev'

export {
	LIB,
	VERSION,
	BUILD_DATE,
	SCHEMA_VERSION,
	LS_KEYS,
	CHANNEL,
}
