import { Enum } from 'typescript-string-enums';
declare const TextClass: {
    item: "item";
    person: "person";
    place: "place";
};
declare type TextClass = Enum<typeof TextClass>;
interface RenderItemOptions {
    display_quality?: boolean;
    display_values?: boolean;
}
export { TextClass, RenderItemOptions, };
