'use strict'

import get_game_instance from '../../../client-browser/src/services/game-instance-browser'

const opn = require('opn')
const prettify_json = require("@offirmo/prettify-json")

const tbrpg = require('@tbrpg/state')
const {URL_OF_REPO, URL_OF_FORK, URL_OF_ISSUES, URL_OF_PRODUCT_HUNT_PAGE} = require('@tbrpg/state')

const { iterables_unslotted, get_item_in_slot } = require('@oh-my-rpg/state-inventory')
const { create: create_tty_chat_ui } = require('@offirmo/view-chat-ui-tty')
const { create: create_chat } = require('@offirmo/view-chat')
const { CHARACTER_CLASSES } = require('@oh-my-rpg/state-character')
const {
	render_item_short,
	render_item_detailed,
	render_character_sheet,
	render_full_inventory,
	render_adventure,
	render_account_info,
} = require('@oh-my-rpg/view-rich-text')

const { rich_text_to_ansi } = require('../services/rich_text_to_ansi')
const { stylize_string } = require('../utils/libs')
const { render_header } = require('../view')

const RENDER_ITEM_OPTIONS = {
	display_quality: true,
	display_values: true,
}

function get_recap(state) {
	return rich_text_to_ansi(tbrpg.get_recap(state))
}

function get_tip(state) {
	const tip = tbrpg.get_tip(state)
	return tip && rich_text_to_ansi(tip)
}


function start_loop(SEC, options, instance) {
	return SEC.xPromiseTry('starting interactive loop', ({SEC, logger, VERSION}) => {
		logger.trace('start_loop options:' + prettify_json(options, { outline: true }))

		render_header(SEC, options)

		function* gen_next_step() {
			const chat_state = {
				count: 0,
				mode: 'main',
				sub: {
					main: {
						last_displayed_adventure_uuid: (() => {
							const { last_adventure } = instance.get_latest_state()
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
				const state = instance.get_latest_state()
				//console.log(state)
				const { last_adventure } = state

				if (last_adventure && chat_state.sub.main.last_displayed_adventure_uuid !== last_adventure.uuid) {
					const { good_play_count } = state.progress.statistics
					//console.log({ good_play_count, last_adventure })
					let msg_main = `Episode #${good_play_count}:\n`
					const $doc = render_adventure(last_adventure, RENDER_ITEM_OPTIONS)
					msg_main += rich_text_to_ansi($doc)
					chat_state.sub.main.last_adventure = state.last_adventure
					/*steps.push({
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
					})*/
					steps.push({
						type: 'progress',
						duration_ms: 1000,
						msg_main: 'Exploring...',
						msgg_acknowledge: () => 'Exploring... Encountered something!\n',
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
						msg_main: get_recap(state),
					})
				}

				// tip
				let tip_msg = get_tip(state)
				if (tip_msg) {
					steps.push({
						type: 'simple_message',
						msg_main: tip_msg,
					})
				}

				const energy_snapshot = get_energy_snapshot(state.energy)
				let energy = `⚡ energy ${energy_snapshot.available_energy}/${state.energy.max_energy}`
				if (energy_snapshot.human_time_to_next) {
					energy += `, next in ${energy_snapshot.human_time_to_next}`
				}

				steps.push({
					msg_main: `What do you want to do? (${energy})`,
					callback: value => { chat_state.mode = value },
					choices: [
						{
							msg_cta: 'Play!',
							value: 'play',
							msgg_as_user: () => 'Let’s go adventuring!',
							callback: () => {
								instance.play()
							},
						},
						{
							msg_cta: 'Manage Inventory (equip, sell…)',
							value: 'inventory',
							msgg_as_user: () => 'Let’s sort out my stuff.',
							msgg_acknowledge: () => 'Sure.',
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
				let msg_main = 'What do you want to do?'
				const choices = []

				const state = instance.get_latest_state()

				if (chat_state.sub.inventory.selected) {
					const uuid = chat_state.sub.inventory.selected
					const selected_item = instance.get_item(uuid)
					const item_ascii_full = rich_text_to_ansi(render_item_detailed(selected_item))
					const sell_price = instance.appraise_item_value(uuid)

					steps.push({
						type: 'simple_message',
						msg_main: 'You inspect the ' + item_ascii_full + '\nthat is in your backpack.'
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
							msg_main: `You compare it to your currently equipped ${slot}: ` + rich_text_to_ansi(render_item_detailed(equipped_item_in_same_slot))
						})
					}

					choices.push({
						msg_cta: 'Equip it.',
						value: 'equip',
						msgg_as_user: () => 'I want to equip it.',
						msgg_acknowledge: () => 'Done!',
						callback: () => {
							instance.equip_item(uuid)
							chat_state.sub.inventory = {}
						}
					})
					choices.push({
						msg_cta: `Sell it for ${sell_price} coins.`,
						value: 'sell',
						msgg_as_user: () => `Deal for ${sell_price} coins.`,
						msgg_acknowledge: () => `Here are you ${sell_price} coins. Pleased to do business with you!`,
						callback: () => {
							instance.sell_item(uuid)
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
					const $doc = render_full_inventory(state.inventory, state.wallet, RENDER_ITEM_OPTIONS)
					steps.push({
						type: 'simple_message',
						msg_main: 'Here is your full inventory:\n\n' + rich_text_to_ansi($doc)
					})

					const misc_items = Array.from(iterables_unslotted(state.inventory))
					misc_items.forEach((item, index) => {
						if (!item) return

						const item_ascii = rich_text_to_ansi(render_item_short(item, RENDER_ITEM_OPTIONS))
						choices.push({
							msg_cta: 'Select ' + item_ascii,
							value: item.uuid,
							key_hint: {
								name: String.fromCharCode(97 + index),
							},
							msgg_as_user: () => 'I inspect ' + item_ascii,
							callback: value => {
								chat_state.sub.inventory.selected = value
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
				const state = instance.get_latest_state()

				let msg_main = 'TODO char step'
				const choices = []

				if (chat_state.sub.character.changeClass) {
					msg_main = 'Choose your path wisely:'

					get_game_instance().selectors.get_available_classes().forEach(klass => {
						choices.push({
							msg_cta: `Switch class to ${klass}`,
							value: klass,
							msgg_as_user: () => `I want to follow the path of the ${klass}!`,
							msgg_acknowledge: name => `You’ll make an amazing ${klass}.`,
							callback: value => {
								instance.change_avatar_class(value)
								chat_state.sub.character = {}
							}
						})
					})
				}
				else if (chat_state.sub.character.rename) {
					return [{
						type: 'ask_for_string',
						msg_main: 'What’s your name?',
						msgg_as_user: value => `My name is "${value}".`,
						msgg_acknowledge: name => `You are now known as ${name}!`,
						callback: value => {
							instance.rename_avatar(value)
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

					msg_main = 'What do you want to do?'

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
				const state = instance.get_latest_state()

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
									instance.reset_all()
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
								'game version': VERSION,
								'Your savegame path': options.config.path,
							}))
					})

					let msg_main = 'What do you want to do?'
					const choices = []

					const URL_OF_WEBSITE = 'https://www.online-adventur.es/the-npm-rpg.html'
					const URL_OF_NPM_PAGE = 'https://www.npmjs.com/package/the-npm-rpg'

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
						{
							msg_cta: '💰 Reward the game author with a reddit like 👍',
							value: URL_OF_REDDIT_PAGE,
							msgg_as_user: () => 'You’re awesome…',
						},
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
							msgg_acknowledge: url => 'You can’t be serious?',
							callback: () => {
								chat_state.sub.meta.reseting = true
							}
						},
						{
							msg_cta: 'Go back to adventuring.',
							key_hint: { name: 'x' },
							value: 'x',
							msgg_as_user: () => 'Let’s do something else.',
							msgg_acknowledge: url => 'Yay, for loot and glory!',
							callback: () => {
								chat_state.sub.character = {}
								chat_state.mode = 'main'
							}
						},
					)

					steps.push({
						msg_main,
						choices,
						msgg_acknowledge: url => 'Now opening ' + url,
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
