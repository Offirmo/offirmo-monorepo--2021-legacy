import { Enum } from 'typescript-string-enums';
// tslint:disable-next-line: variable-name
const Gender = Enum('unknown', 'male', 'female', 'neutral');
// tslint:disable-next-line: variable-name
const Age = Enum('unknown', 'baby', 'child', 'adult', 'elder');
// tslint:disable-next-line: variable-name
const SkinTone = Enum('unknown', 'yellow', 'fp1', 'fp2', 'fp3', 'fp4', 'fp5', 'white', 'cream_white', 'light_brown', 'brown', 'dark_brown');
// tslint:disable-next-line: variable-name
const HairColor = Enum('unknown', 'none', // = bald
'bald', 'white', 'blond', 'red', 'brown', 'black');
// tslint:disable-next-line: variable-name
const Feature = Enum('none', 'bearded', 'curly_hair', 'prince', 'princess', 'mage');
export { Gender, Age, SkinTone, HairColor, Feature, };
//# sourceMappingURL=types.js.map