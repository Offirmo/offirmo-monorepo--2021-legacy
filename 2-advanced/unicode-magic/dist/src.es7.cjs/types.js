"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_string_enums_1 = require("typescript-string-enums");
// tslint:disable-next-line: variable-name
const Gender = typescript_string_enums_1.Enum('unknown', 'male', 'female', 'neutral');
exports.Gender = Gender;
// tslint:disable-next-line: variable-name
const Age = typescript_string_enums_1.Enum('unknown', 'baby', 'child', 'adult', 'elder');
exports.Age = Age;
// tslint:disable-next-line: variable-name
const SkinTone = typescript_string_enums_1.Enum('unknown', 'yellow', 'fp1', 'fp2', 'fp3', 'fp4', 'fp5', 'white', 'cream_white', 'light_brown', 'brown', 'dark_brown');
exports.SkinTone = SkinTone;
// tslint:disable-next-line: variable-name
const HairColor = typescript_string_enums_1.Enum('unknown', 'none', // = bald
'bald', 'white', 'blond', 'red', 'brown', 'black');
exports.HairColor = HairColor;
// tslint:disable-next-line: variable-name
const Feature = typescript_string_enums_1.Enum('none', 'bearded', 'curly_hair', 'prince', 'princess', 'mage');
exports.Feature = Feature;
//# sourceMappingURL=types.js.map