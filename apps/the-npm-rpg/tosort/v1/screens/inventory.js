const { stylizeString } = require('../deps')

const {
	render_equipment,
	render_wallet,
	render_inventory
} = require('@oh-my-rpg/view-text')

/////////////////////////////////////////////////



function render({config, rendering_options}) {
	const state = config.store

	console.log(''
		//stylizeString.bold('⚔  ACTIVE EQUIPMENT 🛡 \n')
		+ stylizeString.bold('ACTIVE EQUIPMENT:\n')
		+ render_equipment(state.inventory, rendering_options)
		+ '\n\n'
		+ stylizeString.bold('WALLET:\n')
		+ render_wallet(state.wallet, rendering_options)
		+ '\n\n'
		+ stylizeString.bold('INVENTORY:\n')
		+ render_inventory(state.inventory, rendering_options)
	)
}

function render_selected_item({config, rendering_options, selected_item_coordinates}) {
	console.log('TODO render_selected_item')
}
/////////////////////////////////////////////////

module.exports = {
	render,
	render_selected_item,
}
