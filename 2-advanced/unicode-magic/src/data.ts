import { Enum } from 'typescript-string-enums'

import {
	GENDER_MALE,
	GENDER_FEMALE,
} from './consts'

import {
	Gender,
	SkinTone,
} from './types'


const GENDER_TO_UNICODE = {
	[Gender.unknown]: '',
	[Gender.male]: GENDER_MALE,
	[Gender.female]: GENDER_FEMALE,
	[Gender.neutral]: '',
}
if (Object.keys(GENDER_TO_UNICODE).length !== Enum.keys(Gender).length)
	throw new Error('GENDER_TO_UNICODE is not up to date!')

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
if (Object.keys(SKIN_TONE_TO_UNICODE).length !== Enum.keys(SkinTone).length)
	throw new Error('SKIN_TONE_TO_UNICODE is not up to date!')

export {
	GENDER_TO_UNICODE,
	SKIN_TONE_TO_UNICODE,
}
