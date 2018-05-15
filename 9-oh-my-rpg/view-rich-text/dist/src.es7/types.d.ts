import { Enum } from 'typescript-string-enums';
declare const TextClass: {
    item: "item";
    person: "person";
    place: "place";
};
declare type TextClass = Enum<typeof TextClass>;
export { TextClass };
