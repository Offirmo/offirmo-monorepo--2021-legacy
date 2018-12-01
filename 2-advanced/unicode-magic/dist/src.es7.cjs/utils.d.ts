import { Gender, Age, SkinTone, HairColor } from './types';
interface AvatarSpec {
    gender: Gender;
    age: Age;
    skin_tone: SkinTone;
    hair: HairColor;
}
interface Message {
    type: 'warning' | 'error';
    msg: string;
}
declare function render(spec: Readonly<AvatarSpec>): [string, Message[]];
declare function add_skin_tone(base: string, skin_tone: SkinTone): string;
declare function add_gender(base: string, gender: Gender): string;
export { AvatarSpec, Message, add_skin_tone, add_gender, render, };
