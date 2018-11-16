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
declare function render(spec: AvatarSpec): [string, Message[]];
export { AvatarSpec, Message, render, };
