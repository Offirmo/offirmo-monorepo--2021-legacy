import { Enum } from 'typescript-string-enums';
declare const TextClass: {
    item: "item";
    person: "person";
    place: "place";
};
declare type TextClass = Enum<typeof TextClass>;
interface RenderItemOptions {
    reference_power?: number;
    display_quality?: boolean;
    display_values?: boolean;
    display_power?: boolean;
    display_sell_value?: boolean;
}
export { TextClass, RenderItemOptions, };
