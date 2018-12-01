import { I18nMessages } from '@offirmo/ts-types';
import { OutcomeArchetype, AdventureType } from '../types';
interface RawAdventureArchetypeEntry {
    good: boolean;
    hid: string;
    type: AdventureType;
    outcome: Partial<OutcomeArchetype>;
    isBeta?: boolean;
}
declare const ENTRIES: Readonly<RawAdventureArchetypeEntry>[];
declare const i18n_messages: Readonly<I18nMessages>;
export { RawAdventureArchetypeEntry, ENTRIES, i18n_messages, };
