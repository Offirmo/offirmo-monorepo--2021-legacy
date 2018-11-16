import {
	GENDER_MALE,
	GENDER_FEMALE,
} from './consts'

import {
	Gender,
	SkinTone,
} from './types'


const GENDER_TO_UNICODE = {
	[Gender.undef]: '',
	[Gender.unknown]: '',
	[Gender.neutral]: '',
	[Gender.male]: GENDER_MALE,
	[Gender.female]: GENDER_FEMALE,
}

const SKIN_TONE_TO_UNICODE = {
	[SkinTone.unknown]: '',
	[SkinTone.yellow]: '',
	[SkinTone.fp1]: '🏻', // U+1F3FB
	[SkinTone.fp2]: '🏼',
	[SkinTone.fp3]: '🏽',
	[SkinTone.fp4]: '🏾',
	[SkinTone.fp5]: '🏿',
	[SkinTone.white]: '🏻', // U+1F3FB
	[SkinTone.cream_white]: '🏼',
	[SkinTone.light_brown]: '🏽',
	[SkinTone.brown]: '🏾',
	[SkinTone.dark_brown]: '🏿',
}

export {
	GENDER_TO_UNICODE,
	SKIN_TONE_TO_UNICODE,
}
