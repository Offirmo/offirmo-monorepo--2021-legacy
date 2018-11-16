import { Enum } from 'typescript-string-enums';
declare const Gender: {
    undef: "undef";
    unknown: "unknown";
    neutral: "neutral";
    male: "male";
    female: "female";
};
declare type Gender = Enum<typeof Gender>;
declare const Age: {
    unknown: "unknown";
    baby: "baby";
    child: "child";
    adult: "adult";
    elder: "elder";
};
declare type Age = Enum<typeof Age>;
declare const SkinTone: {
    unknown: "unknown";
    yellow: "yellow";
    fp1: "fp1";
    fp2: "fp2";
    fp3: "fp3";
    fp4: "fp4";
    fp5: "fp5";
    white: "white";
    cream_white: "cream_white";
    light_brown: "light_brown";
    brown: "brown";
    dark_brown: "dark_brown";
};
declare type SkinTone = Enum<typeof SkinTone>;
declare const HairColor: {
    unknown: "unknown";
    white: "white";
    brown: "brown";
    none: "none";
    bald: "bald";
    blond: "blond";
    red: "red";
    black: "black";
};
declare type HairColor = Enum<typeof HairColor>;
declare const Feature: {
    none: "none";
    bearded: "bearded";
    curly_hair: "curly_hair";
    prince: "prince";
    princess: "princess";
    mage: "mage";
};
declare type Feature = Enum<typeof Feature>;
export { Gender, Age, SkinTone, HairColor, Feature, };
