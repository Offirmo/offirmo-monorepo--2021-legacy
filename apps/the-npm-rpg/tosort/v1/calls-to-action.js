const { stylizeString } = require('./deps')

/////////////////////////////////////////////////

//console.log('You can play again in...') TODO

function render_cta_relaunch_game() {
	console.log('\n')
	//console.log(stylizeString.bold(`       That was your adventure #${state.good_click_count}!`))
	console.log(stylizeString.bold('👉 👉 👉  Relaunch the-npm-rpg to continue your adventures! ⚔ 💰 🎁  👈 👈 👈 '))
	console.log(stylizeString.bold('       You will get stronger and stronger!'))
	console.log('\n')
}


function render_cta({is_interactive, config}) {
	let state = config.store

	// just restart ?

	// better weapon ?


	// TODO print advices (equip, sell...)

	if (!is_interactive)
		render_cta_relaunch_game()
}


/////////////////////////////////////////////////

module.exports = {
	render_cta_relaunch_game,
	render_cta,
}
