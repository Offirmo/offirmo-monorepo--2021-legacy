import { I18nMessages } from '@oh-my-rpg/definitions';
declare const i18n_messages: I18nMessages;
interface RawArmorEntry {
    type: 'base' | 'qualifier1' | 'qualifier2';
    hid: string;
}
declare const ENTRIES: RawArmorEntry[];
export { RawArmorEntry, ENTRIES, i18n_messages };
