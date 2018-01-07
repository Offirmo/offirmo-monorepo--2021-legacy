"use strict";

const opn = require('opn');

const tbrpg = require('@oh-my-rpg/state-the-boring-rpg')
const { iterables_unslotted, get_item_at_coordinates, get_item_in_slot } = require('@oh-my-rpg/state-inventory')
const { create: create_tty_chat_ui } = require('@oh-my-rpg/view-chat-ui-tty')
const { create: create_chat } = require('@oh-my-rpg/view-chat')
const { CHARACTER_CLASSES } = require('@oh-my-rpg/state-character')
const {
	render_item,
	render_character_sheet,
	render_full_inventory,
	render_adventure,
	render_account_info,
} = require('@oh-my-rpg/view-rich-text')

const { rich_text_to_ansi } = require('../utils/rich_text_to_ansi')
const { stylize_string } = require('../libs')
const { render_header } = require('../view')
const { prettify_json_for_debug } = require('../utils/debug')
const {
	play,
	equip_item_at_coordinates,
	sell_item_at_coordinates,
	rename_avatar,
	change_class,
	reset_all,
} = require('../actions')

function get_recap({config}) {
	const state = config.store
	return rich_text_to_ansi(tbrpg.get_recap(state))
}

function get_tip({config}) {
	const state = config.store
	const tip = tbrpg.get_tip(state)
	return tip && rich_text_to_ansi(tip)
}



function start_loop(SEC, options) {
	return SEC.xPromiseTry('starting interactive loop', ({SEC, logger}) => {
		logger.trace('all options:', prettify_json_for_debug(options))

		render_header(options)

		const {config} = options
		//const state = config.store

		function* gen_next_step() {
			const chat_state = {
				count: 0,
				mode: 'main',
				sub: {
					main: {
						last_displayed_adventure_uuid: (() => {
							const { last_adventure } = config.store
							return last_adventure && last_adventure.uuid
						})()
					},
					inventory: {},
					character: {},
					meta: {},
				}
			}

			let yielded

			// how to quit
			chat_state.count++
			yielded = yield {
				type: 'simple_message',
				msg_main: `Note: Press ${stylize_string.inverse(' Ctrl+C ')} anytime to ${stylize_string.red('quit')}, your game is auto-saved.`,
			}

			function get_MODE_MAIN() {
				const steps = []
				const state = config.store
				//console.log(state)
				const { last_adventure } = state

				if (last_adventure && chat_state.sub.main.last_displayed_adventure_uuid !== last_adventure.uuid) {
					const { good_click_count } = state
					//console.log({ good_click_count, last_adventure })
					let msg_main = `Episode #${good_click_count}:\n`
					const $doc = render_adventure(last_adventure)
					msg_main += rich_text_to_ansi($doc)
					chat_state.sub.main.last_adventure = state.last_adventure
					steps.push({
						type: 'progress',
						duration_ms: 600,
						msg_main: `Preparations: repairing equipment`,
						msgg_acknowledge: () => 'Equipment repaired',
					})
					steps.push({
						type: 'progress',
						duration_ms: 700,
						msg_main: `Preparations: buying rations`,
						msgg_acknowledge: () => 'Rations resupplied',
					})
					steps.push({
						type: 'progress',
						duration_ms: 800,
						msg_main: `Preparations: reviewing quests`,
						msgg_acknowledge: () => 'Quests reviewed',
					})
					steps.push({
						type: 'progress',
						duration_ms: 900, // or provide a progress_promise
						msg_main: `Farming XP`,
						msgg_acknowledge: () => 'XP farmed',
					})
					steps.push({
						type: 'progress',
						duration_ms: 1000,
						msg_main: `Exploring`,
						msgg_acknowledge: () => 'exploring... Encountered something!\n',
					})
					steps.push({
						type: 'simple_message',
						msg_main,
					})
					chat_state.sub.main.last_displayed_adventure_uuid = last_adventure.uuid
				}
				else {
					// recap
					steps.push({
						type: 'simple_message',
						msg_main: get_recap(options),
					})
				}

				// tip
				let tip_msg = get_tip(options)
				if (tip_msg) {
					steps.push({
						type: 'simple_message',
						msg_main: tip_msg,
					})
				}

				steps.push({
					msg_main: `What do you want to do?`,
					callback: value => { chat_state.mode = value },
					choices: [
						{
							msg_cta: 'Play!',
							value: 'play',
							msgg_as_user: () => 'Let’s go adventuring!',
							callback: () => {
								play(options)
							},
						},
						{
							msg_cta: 'Manage Inventory (equip, sell…)',
							value: 'inventory',
							msgg_as_user: () => 'Let’s sort out my stuff.',
							msgg_acknowledge: () => `Sure.`,
						},
						{
							msg_cta: 'Manage Character (rename, change class…)',
							value: 'character',
							msgg_as_user: () => 'Let’s see how I’m doing!',
						},
						{
							msg_cta: 'Manage other stuff…',
							value: 'meta',
							msgg_as_user: () => 'Let’s see how I’m doing!',
						},
					],
				})

				return steps
			}

			function get_MODE_INVENTORY() {
				const steps = []
				let msg_main = `What do you want to do?`
				const choices = []

				const state = config.store

				if (chat_state.sub.inventory.selected) {
					const coords = chat_state.sub.inventory.selected - 1
					const selected_item = get_item_at_coordinates(state.inventory, coords)
					const sell_price = tbrpg.appraise_item_at_coordinates(state, coords)
					const item_ascii_full = rich_text_to_ansi(render_item(selected_item))

					steps.push({
						type: 'simple_message',
						msg_main: 'You inspect the ' + item_ascii_full + ' in your backpack.'
					})

					const slot = selected_item.slot
					const equipped_item_in_same_slot = get_item_in_slot(state.inventory, slot)
					if (!equipped_item_in_same_slot) {
						steps.push({
							type: 'simple_message',
							msg_main: `You currently have no item equipped for this category (${slot}).`
						})
					}
					else {
						steps.push({
							type: 'simple_message',
							msg_main: `You compare it to your currently equipped ${slot}: ` + rich_text_to_ansi(render_item(equipped_item_in_same_slot))
						})
					}

					choices.push({
						msg_cta: 'Equip it.',
						value: 'equip',
						msgg_as_user: () => 'I want to equip it.',
						msgg_acknowledge: () => 'Done!',
						callback: () => {
							equip_item_at_coordinates(options, coords)
							chat_state.sub.inventory = {}
						}
					})
					choices.push({
						msg_cta: `Sell it for ${sell_price} coins.`,
						value: 'sell',
						msgg_as_user: () => `Deal for ${sell_price} coins.`,
						msgg_acknowledge: () => `Here are you ${sell_price} coins. Pleased to do business with you!`,
						callback: () => {
							sell_item_at_coordinates(options, coords)
							chat_state.sub.inventory = {}
						}
					})

					choices.push({
						msg_cta: 'Go back to inventory.',
						key_hint: { name: 'x' },
						value: 'exit',
						msgg_as_user: () => 'I’m done with it.',
						msgg_acknowledge: () => 'OK. Here is your inventory:',
						callback: () => {
							chat_state.sub.inventory = {}
						}
					})
				}
				else {
					const $doc = render_full_inventory(state.inventory, state.wallet)
					steps.push({
						type: 'simple_message',
						msg_main: 'Here is your full inventory:\n' + rich_text_to_ansi($doc)
					})

					const misc_items = Array.from(iterables_unslotted(state.inventory))
					misc_items.forEach((item, index) => {
						if (!item) return

						const item_ascii = rich_text_to_ansi(render_item(item, {
							display_quality: true,
							display_values: false,
						}))
						choices.push({
							msg_cta: 'Select ' + item_ascii,
							value: index,
							key_hint: {
								name: String.fromCharCode(97 + index),
							},
							msgg_as_user: () => 'I inspect ' + item_ascii,
							callback: value => {
								chat_state.sub.inventory.selected = value + 1 // to avoid 0
							},
						})
					})

					choices.push({
						msg_cta: 'Go back to adventuring.',
						key_hint: { name: 'x' },
						value: 'x',
						msgg_as_user: () => 'Let’s do something else.',
						callback: () => {
							chat_state.sub.inventory = {}
							chat_state.mode = 'main'
						}
					})
				}

				steps.push({
					msg_main,
					choices,
				})

				return steps
			}

			function get_MODE_CHARACTER() {
				const steps = []
				const state = config.store

				let msg_main = 'TODO char step'
				const choices = []

				if (chat_state.sub.character.changeClass) {
					msg_main = 'Choose your path wisely:'

					CHARACTER_CLASSES.forEach(klass => {
						if (klass === 'novice') return

						choices.push({
							msg_cta: `Switch class to ${klass}`,
							value: klass,
							msgg_as_user: () => `I want to follow the path of the ${klass}!`,
							msgg_acknowledge: name => `You’ll make an amazing ${klass}.`,
							callback: value => {
								change_class(options, value)
								chat_state.sub.character = {}
							}
						})
					})
				}
				else if (chat_state.sub.character.rename) {
					return [{
						type: 'ask_for_string',
						msg_main: `What’s your name?`,
						msgg_as_user: value => `My name is "${value}".`,
						msgg_acknowledge: name => `You are now known as ${name}!`,
						callback: value => {
							rename_avatar(options, value)
							chat_state.sub.character = {}
						},
					}]
				}
				else {
					const $doc = render_character_sheet(state.avatar)
					steps.push({
						type: 'simple_message',
						msg_main: 'Here is your character sheet:\n\n' + rich_text_to_ansi($doc)
					})

					msg_main = `What do you want to do?`

					choices.push(
						{
							msg_cta: 'Change class',
							value: 'c',
							msgg_as_user: () => 'I want to follow the path of…',
							callback: () => {
								chat_state.sub.character.changeClass = true
							}
						},
						{
							msg_cta: 'Rename hero',
							value: 'r',
							msgg_as_user: () => 'Let’s fix my name…',
							callback: () => {
								chat_state.sub.character.rename = true
							}
						},
						{
							msg_cta: 'Go back to adventuring.',
							key_hint: { name: 'x' },
							value: 'x',
							msgg_as_user: () => 'Let’s do something else.',
							callback: () => {
								chat_state.sub.character = {}
								chat_state.mode = 'main'
							}
						},
					)
				}

				steps.push({
					msg_main,
					choices,
				})

				return steps
			}

			function get_MODE_META() {
				const steps = []
				const state = config.store

				if (chat_state.sub.meta.reseting) {
					steps.push({
						msg_main: 'Reset your game and start over, are you really really sure?',
						choices: [
							{
								msg_cta: 'Really reset your savegame, loose all your progression and start over 💀',
								value: 'reset',
								msgg_as_user: () => 'Definitely.',
								msgg_acknowledge: () => 'So be it...',
								callback: () => {
									reset_all(options)
									chat_state.sub.meta = {}
								}
							},
							{
								msg_cta: 'Don’t reset and go back to game.',
								value: 'hold',
								msgg_as_user: () => 'Hold on, I changed my mind!',
								msgg_acknowledge: () => 'A wise choice. The world needs you, hero!',
								callback: () => {
									chat_state.sub.meta = {}
								}
							},
						],
					})
				}
				else {
					steps.push({
						type: 'simple_message',
						msg_main: rich_text_to_ansi(render_account_info(
							state.meta,
							{
								'game version': options.version,
								'Your savegame path': config.path,
							}))
					})

					let msg_main = `What do you want to do?`
					const choices = []

					const URL_OF_WEBSITE = 'https://www.online-adventur.es/the-npm-rpg.html'
					const URL_OF_NPM_PAGE = 'https://www.npmjs.com/package/the-npm-rpg'
					const URL_OF_REPO = 'https://github.com/online-adventures/oh-my-rpg'
					const URL_OF_PRODUCT_HUNT_PAGE = 'https://www.producthunt.com/upcoming/the-npm-rpg'
					const URL_OF_FORK = 'https://github.com/online-adventures/oh-my-rpg/#fork'
					const URL_OF_ISSUES = 'https://github.com/online-adventures/oh-my-rpg/issues'
					//const URL_OF_REDDIT_PAGE = 'TODO RED'

					choices.push(
						{
							msg_cta: 'Visit game official website',
							value: URL_OF_WEBSITE,
							msgg_as_user: () => 'Let’s have a look…',
						},
						{
							msg_cta: `💰 Reward the game author with a ${stylize_string.bgRed(
								stylize_string.white(' npm ')
							)} star ★`,
							value: URL_OF_NPM_PAGE,
							msgg_as_user: () => 'You’re awesome…',
						},
						{
							msg_cta: `💰 Reward the game author with a ${stylize_string.bgWhite(
								stylize_string.black(' GitHub ')
							)} star ★`,
							value: URL_OF_REPO,
							msgg_as_user: () => 'You’re awesome…',
						},
						/*{
                          msg_cta: 'Reward the game author with a reddit like 👍',
                          value: URL_OF_REDDIT_PAGE,
                          msgg_as_user: () => 'You’re awesome…',
                      },*/
						{
							msg_cta: `💰 Reward the game author with a ${stylize_string.bgRed(
								stylize_string.white(' Product Hunt ')
							)} upvote ⇧`,
							value: URL_OF_PRODUCT_HUNT_PAGE,
							msgg_as_user: () => 'You’re awesome…',
						},
						{
							msg_cta: 'Fork on GitHub 🐙 😹',
							value: URL_OF_FORK,
							msgg_as_user: () => 'I’d like to contribute!',
						},
						{
							msg_cta: 'Report a bug 🐞',
							value: URL_OF_ISSUES,
							msgg_as_user: () => 'There is this annoying bug…',
						},
						{
							msg_cta: 'Reset your savegame 💀',
							value: 'reset',
							msgg_as_user: () => 'I want to start over…',
							msgg_acknowledge: url => `You can't be serious?`,
							callback: () => {
								chat_state.sub.meta.reseting = true
							}
						},
						{
							msg_cta: 'Go back to adventuring.',
							key_hint: { name: 'x' },
							value: 'x',
							msgg_as_user: () => 'Let’s do something else.',
							msgg_acknowledge: url => `Yay, for loot and glory!`,
							callback: () => {
								chat_state.sub.character = {}
								chat_state.mode = 'main'
							}
						},
					)

					steps.push({
						msg_main,
						choices,
						msgg_acknowledge: url => `Now opening ` + url,
						callback: url => {
							opn(url)
						}
					})
				}

				return steps
			}

			logger.trace({chat_state})
			let shouldExit = false
			let loopDetector = 0
			do {
				switch(chat_state.mode) {
					case 'main':
						chat_state.count++
						yielded = yield* get_MODE_MAIN()
						break
					case 'inventory':
						chat_state.count++
						yielded = yield* get_MODE_INVENTORY()
						break
					case 'character':
						chat_state.count++
						yielded = yield* get_MODE_CHARACTER()
						break
					case 'meta':
						chat_state.count++
						yielded = yield* get_MODE_META()
						break
					default:
						console.error(`Unknown mode: "${chat_state.mode}"`)
						process.exit(1)
				}

				if (chat_state.count % 10 === 0) {
					const now = Date.now()
					if ((now - loopDetector) < 1000) {
						// loop detected: it's a bug
						throw new Error('Loop detected in chat interface')
					}
					loopDetector = now
				}
			} while(!shouldExit)
		}

		const chat = create_chat({
			DEBUG: false,
			gen_next_step: gen_next_step(),
			ui: create_tty_chat_ui({DEBUG: false}),
		})

		return chat
			.start()
			.then(() => console.log('Bye!'))
	})
}


module.exports = {
	start_loop,
}
