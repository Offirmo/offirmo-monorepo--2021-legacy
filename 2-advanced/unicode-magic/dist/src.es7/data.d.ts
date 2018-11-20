import { Gender, SkinTone } from './types';
declare const GENDER_TO_UNICODE: {
    [Gender.unknown]: string;
    [Gender.male]: string;
    [Gender.female]: string;
    [Gender.neutral]: string;
};
declare const SKIN_TONE_TO_UNICODE: {
    [SkinTone.unknown]: string;
    [SkinTone.yellow]: string;
    [SkinTone.fp1]: string;
    [SkinTone.fp2]: string;
    [SkinTone.fp3]: string;
    [SkinTone.fp4]: string;
    [SkinTone.fp5]: string;
    [SkinTone.white]: string;
    [SkinTone.cream_white]: string;
    [SkinTone.light_brown]: string;
    [SkinTone.brown]: string;
    [SkinTone.dark_brown]: string;
};
export { GENDER_TO_UNICODE, SKIN_TONE_TO_UNICODE, };
