#!/usr/bin/env node
'use strict';

const { capitalize } = require('lodash')
const Globalize = require('globalize')
Globalize.load(require('cldr-data').entireSupplemental())
Globalize.load(require('cldr-data').entireMainFor('en', 'fr'))
Globalize.loadTimeZone(require( 'iana-tz-data'))

Globalize.loadMessages({
	fr: {
		title: 'super appli',
		timer_text: '{delay_s, plural, =0 {Vous pouvez cliquer !} other {Encore {humanized_delay}…}}',
		weapon: {
			base: {
				axe: 'hache',
				axe_gender: 'female',
				bow: 'arc',
				bow_gender: 'male',
			},
			qualifier1: {
				used: '{gender, select, male {usé} other {usée}}',
			},
		},
		clickmsg_dying_man:
			'Un mourant dans la rue vous lègue tout ce qu’il possède.<br/>' +
			'Vous gagnez {formattedCoins} écus !',
	},
	en: {
		title: 'amazing app',
		timer_text: '{delay_s, plural, =0 {You can click now!} other {{humanized_delay} left.}}',
		weapon: {
			base: {
				axe: 'axe',
				axe_gender: '-',
				bow: 'bow',
				bow_gender: '-',
			},
			qualifier1: {
				used: 'used',
			},
		},
		clickmsg_dying_man:
			'A dying man on the street left you everything he had.<br/>' +
			'You gained {formattedCoins} coins!',
	}
})

function format_weapon(g, w) {
	const fmt_base = g.messageFormatter(`weapon/base/${w.base}`)
	const base = fmt_base()

	const fmt_base_gender = g.messageFormatter(`weapon/base/${w.base}_gender`)
	const gender = fmt_base_gender()

	const fmt_qualifier1 = g.messageFormatter(`weapon/qualifier1/${w.qualifier1}`)
	const qual1 = fmt_qualifier1({gender})

	if (g.cldr.locale === 'fr') {
		const parts = [base, qual1]
		return parts.join(' ')
	}

	const parts = [qual1, base].map(capitalize)

	/*
	 if (libs._s.startsWith(parts[0], 'of')) {
	 var q2 = parts.shift()
	 parts.push(q2)
	 }

	 return libs._s.words(parts.join(' ')).map(libs._s.capitalize).join(' ')
	 */
	return parts.join(' ')
}

function demo(locale) {
	console.log('\n------- ' + locale)
	const g = Globalize(locale)
	console.log(g.cldr.locale)
	console.log('Title:', g.formatMessage('title'))
	console.log(g.formatMessage('clickmsg_dying_man', {formattedCoins: g.formatNumber(1234)}))
	console.log(format_weapon(g, {
		base: 'axe',
		qualifier1: 'used',
	}))
}

demo('en')
demo('fr')
console.log('\n-------')
