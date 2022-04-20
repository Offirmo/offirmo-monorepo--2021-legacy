const Conf = require('conf')
const Globalize = require('globalize')
const CLDRData = require('cldr-data')

const { migrate_to_latest } = require('@oh-my-rpg/state-the-boring-rpg')
const { prettifyJson } = require('./deps')

/////////////////////////////////////////////////

function init_globalize() {
	const en = Object.assign({},
		require('@oh-my-rpg/logic-adventures').i18n_messages.en,
		require('@oh-my-rpg/data/src/weapon_component/i18n').en,
		require('@oh-my-rpg/logic-armors').i18n_messages.en,
	)

	Globalize.load(CLDRData.entireSupplemental())
	Globalize.load(CLDRData.entireMainFor('en'))
	//Globalize.loadTimeZone(require('iana-tz-data'))
	Globalize.loadMessages({en})

	return Globalize('en')
}


function init_savegame({verbose}) {
	const config = new Conf({
		configName: 'state',
		defaults: {},
	})

	if (verbose) console.log('config path:', config.path)
	if (verbose) console.log('loaded state:\n-------\n', prettifyJson(config.store), '\n-------\n')

	const state = migrate_to_latest(config.store)
	if (verbose) console.log('migrated state:\n-------\n', prettifyJson(state), '\n-------\n')

	config.clear()
	config.set(state)

	return config
}

/////////////////////////////////////////////////

module.exports = {
	init_globalize,
	init_savegame,
}
