import { Immutable } from '@offirmo-private/ts-types'
import {
	AchievementStatus,
	AchievementSnapshot,
} from '@tbrpg/state--progress'

import * as RichText from '@offirmo-private/rich-text-format'


function render_achievement_snapshot_short(achievement_snapshot: Immutable<AchievementSnapshot>): RichText.Document {
	const { uuid, icon, name, status, completion_rate } = achievement_snapshot

	const builder = RichText.inline_fragment()
		.addClass('achievement', `achievement--${status}`)

	let icon_text = ''
	let legend = '???'

	switch(status) {
		case AchievementStatus.secret:
			throw new Error('Secret achievements should never make it there!')

		case AchievementStatus.hidden:
			break

		case AchievementStatus.revealed:
			//icon_text = '✖' //'❔'
			legend = name
			break

		case AchievementStatus.unlocked:
			icon_text = icon
			legend = name + ' ✔' //' ★' // ✔
			break

		default:
			throw new Error(`Unknown achievement status for "${name}"!`)
	}

	if (icon_text) {
		builder
			.pushText(icon_text)
			.pushText('  ')
	}

	if(status === AchievementStatus.unlocked)
		builder.pushStrong(legend)
	else
		builder.pushWeak(legend)

	// no, too much info
	/*if (completion_rate && status === AchievementStatus.revealed) {
		const percentage = 100. * completion_rate[0] / completion_rate[1]
		if (percentage > 100)
			throw new Error(`Invalid achievement completion rate for "${name}"!`)
		builder.pushWeak(` - ${Math.round(percentage)}%`)
	}*/

	builder.addHints({ uuid})


	return builder.done()
}

function render_achievement_snapshot_detailed(achievement_snapshot: Immutable<AchievementSnapshot>): RichText.Document {
	const { uuid, icon, name, description, lore, status, completion_rate } = achievement_snapshot
	const element_tags = [ 'achievement' ]

	const builder = RichText.block_fragment()
		.addClass('achievement')

	let icon_text = null
	let name_text = '???'
	let description_text = '???'
	let lore_text = null

	switch(status) {
		case AchievementStatus.secret:
			throw new Error('Secret achievements should never make it there!')

		case AchievementStatus.hidden:
			description_text = '(this achievement is hidden at the moment. Try playing more!)'
			element_tags.push('hidden')
			break

		case AchievementStatus.revealed:
			element_tags.push('locked')
			icon_text = '❔'
			name_text = name
			description_text = description
			lore_text = lore
			break

		case AchievementStatus.unlocked:
			element_tags.push('unlocked')
			icon_text = icon
			name_text = name
			description_text = description
			lore_text = lore
			break

		default:
			throw new Error('Unknown achievement status!')
	}

	if (icon_text) {
		builder
			.pushText(icon_text)
			.pushText(' ')
	}

	builder
		.pushStrong(name_text, { classes: [ 'achievement__title' ]})
		.pushHorizontalRule()

	/* TODO
		.pushWeak(element_tags.join(', '))
		.()*/

	if (completion_rate && status === AchievementStatus.revealed) {
		const [done, to_do] = completion_rate
		const percentage = 100. * done / to_do
		if (percentage > 100)
			throw new Error(`Invalid achievement completion rate for "${name}"!`)
		builder
			.pushWeak(`Progress: ${Math.floor(percentage)}% (${done}/${to_do})`)
			.pushLineBreak()
	}

	builder
		.pushText(description_text)
		.pushLineBreak()

	if (lore_text) {
		builder
			.pushWeak(`“${lore_text}“`, { classes: [ 'achievement__lore' ]})
			.pushLineBreak()
	}

	builder.addHints({ uuid })

	return builder.done()
}

function render_achievements_snapshot(ordered_achievement_snapshots: Immutable<AchievementSnapshot>[]): RichText.Document {
	const builder = RichText.unordered_list()
		.addClass('achievements-snapshot')

	ordered_achievement_snapshots.forEach((achievement_snapshot) => {
		const { uuid } = achievement_snapshot
		//console.log(uuid)
		builder.pushRawNode(render_achievement_snapshot_short(achievement_snapshot), {id: uuid})
	})

	const $doc_list = builder.done()

	const stats = ordered_achievement_snapshots.reduce((acc, {status}) => {
		switch(status) {
			case AchievementStatus.secret:
				break

			case AchievementStatus.hidden:
			case AchievementStatus.revealed:
				acc.visible_count++
				break

			case AchievementStatus.unlocked:
				acc.visible_count++
				acc.unlocked_count++
				break

			default:
				throw new Error('Unknown achievement status!')
		}

		return acc
	},
	{
		visible_count: 0,
		unlocked_count: 0,
	})

	const $doc = RichText.block_fragment()
		.pushNode(RichText.heading().pushText(`Achievements (${stats.unlocked_count}/${stats.visible_count})`).done(), {id: 'header'})
		.pushNode($doc_list, {id: 'list'})
		.done()

	//console.log('render_achievements_snapshot', ordered_achievement_snapshots, $doc)

	return $doc
}


export {
	render_achievement_snapshot_short,
	render_achievement_snapshot_detailed,
	render_achievements_snapshot,
}
