import { I18nMessages } from '@oh-my-rpg/definitions';
declare const i18n_messages: I18nMessages;
interface RawArmorEntry {
    type: 'base' | 'qualifier1' | 'qualifier2';
    hid: string;
}
declare const ENTRIES: Readonly<RawArmorEntry>[];
declare const ARMOR_BASES: Readonly<{
    type: "base";
    hid: string;
}>[];
declare const ARMOR_QUALIFIERS1: Readonly<{
    type: "qualifier1";
    hid: string;
}>[];
declare const ARMOR_QUALIFIERS2: Readonly<{
    type: "qualifier2";
    hid: string;
}>[];
export { RawArmorEntry, I18nMessages, i18n_messages, ENTRIES, ARMOR_BASES, ARMOR_QUALIFIERS1, ARMOR_QUALIFIERS2, };
