#!/usr/bin/env node
'use strict';

console.log('Mixing emojis')

const stylize = require('chalk')

const ZERO_WIDTH_JOINER = '\u200D'

const GENDER = {
	undef: '',
	neutral: '',
	male: '♂️',
	female: '\u2640\uFE0F️',
}

const AGE = {
	baby: 'baby',
	child: 'child',
	adult: 'adult',
	older: 'older',
}

const SKIN_TONE = {
	none: '',
	t1: '🏻', // U+1F3FB
	t2: '🏼',
	t3: '🏽',
	t4: '🏾',
	t5: '🏿',
	white: '🏻',
	cream_white: '🏼',
	light_brown: '🏽',
	brown: '🏾',
	dark_brown: '🏿',
}

const BASES = {
	baby: '👶',
	child: '🧒',
	boy: '👦',
	girl: '👧', // U+1F467
	adult: '🧑',
	man: '👱',
	man_bearded: '🧔',
	woman: '👩',
	old_man: '👴',
	old_woman: '👵',
	person_with_blond_hair: '👱', // U+1F471
}

const FEATURES = {
	bearded: 'bearded',
}
const HAIR = {
	'default': '',
	brown: '',
	blond: 'blond', // new base
	red: '🦰',
	curly: '🦱',
	white: '🦳',
	bald: '🦲',
}

function render(options) {
	const {gender, age, skin, hair} = options

	let is_gender_applied = !gender
	let is_age_applied = !age
	let is_skin_tone_applied = !skin
	let is_hair_applied = false

	const notes = []

	let base = (() => {
		switch(age) {
			case AGE.baby:
				is_gender_applied = true // can't show it
				return BASES.baby
			case AGE.child:
				is_gender_applied = true
				return gender === GENDER.female ? BASES.girl : BASES.boy
			case AGE.older:
				is_gender_applied = true
				return gender === GENDER.female ? BASES.old_woman : BASES.old_man
			case AGE.adult:
				if (hair === HAIR.blond)
					return BASES.person_with_blond_hair
				is_gender_applied = true
			default:
				return gender === GENDER.female
					? BASES.woman
					: gender === GENDER.man
						? BASES.man
						: BASES.adult
		}
	})()

	let result = base

	// coercions
	//if (hair === HAIR.brown && )
	if (!is_skin_tone_applied) {
		is_skin_tone_applied = true
		result = result + skin
	}

	if (!is_gender_applied) {
		is_gender_applied = true
		result = result + ZERO_WIDTH_JOINER + gender
	}

	//console.log(options)
	return result
}

Object.values(SKIN_TONE).slice(1, 6).forEach(skin => {
	let acc = ''
	Object.values(AGE).forEach(age => {
		Object.values(GENDER).slice(2).forEach(gender => {
			acc += render({
				gender,
				age,
				skin,
				hair: HAIR.brown,
			}) + '  '
		})
	})
	console.log(acc)
})

// tests
console.log(BASES.person_with_blond_hair + ZERO_WIDTH_JOINER + GENDER.female)
/*
console.log(BASES.baby + SKIN_TONE['4'])
console.log(BASES.man + SKIN_TONE['2'] + ZERO_WIDTH_JOINER + HAIR.red)
console.log(BASES.) + SKIN_TONE['3'])
*/
