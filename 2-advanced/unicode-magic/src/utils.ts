
import {
	Gender,
	Age,
	SkinTone,
	HairColor,
	Feature,
} from './types'

import {
	ZERO_WIDTH_JOINER,
	BASES,
} from './consts'

import {
	GENDER_TO_UNICODE,
	SKIN_TONE_TO_UNICODE,
} from './data'

interface AvatarSpec {
	gender: Gender
	age: Age
	skin_tone: SkinTone
	hair: HairColor
}
interface Message {
	type: 'warning' | 'error'
	msg: string
}
function render(spec: Readonly<AvatarSpec>): [ string, Message[] ] {
	let {gender, age, skin_tone, hair} = spec

	//console.log(Object.values(spec))

	let result: string = ''
	let is_gender_applied: boolean = false
	const is_age_applied: boolean = false
	let is_skin_tone_applied: boolean = false
	let is_hair_applied: boolean = false
	const notes: Message[] = []

	const base: string = (() => {
		switch (age) {
			case Age.baby:
				is_gender_applied = true // can't show it with this base
				// TODO warning
				return BASES.baby
			case Age.child:
				is_gender_applied = true
				return gender === Gender.female
					? BASES.girl
					: gender === Gender.male
						? BASES.boy
						: BASES.child
			case Age.elder:
				is_gender_applied = true
				return gender === Gender.female
					? BASES.elder_woman
					: gender === Gender.male
						? BASES.elder_man
						: BASES.elder
			case Age.adult:
			default:
				if (hair === HairColor.blond) {
					is_hair_applied = true
					return BASES.person_with_blond_hair
				}
				is_gender_applied = true
				return gender === Gender.female
					? BASES.woman
					: gender === Gender.male
						? BASES.man
						: BASES.adult
		}
	})()

	result += base

	// coercions
	if (hair === HairColor.black && skin_tone === SkinTone.fp2) {
		// coerce FP2 to FP1 to have black hair
		skin_tone = SkinTone.fp1
	}
	if (hair === HairColor.brown && skin_tone === SkinTone.fp2) {
		// coerce FP2 to FP3 to have brown hair
		skin_tone = SkinTone.fp3
	}

	if (!is_skin_tone_applied) {
		result = add_skin_tone(result, skin_tone)
		is_skin_tone_applied = true
	}

	if (!is_gender_applied) {
		result = add_gender(result, gender)
		is_gender_applied = true
	}

	//console.log(options)
	return [ result, notes ]
}


function add_skin_tone(base: string, skin_tone: SkinTone): string {
	if (SKIN_TONE_TO_UNICODE[skin_tone])
		return base + SKIN_TONE_TO_UNICODE[skin_tone]
	return base
}

function add_gender(base: string, gender: Gender): string {
	if (GENDER_TO_UNICODE[gender])
		return base + ZERO_WIDTH_JOINER + GENDER_TO_UNICODE[gender]
	return base
}

export {
	AvatarSpec,
	Message,

	add_skin_tone,
	add_gender,

	render,
}
