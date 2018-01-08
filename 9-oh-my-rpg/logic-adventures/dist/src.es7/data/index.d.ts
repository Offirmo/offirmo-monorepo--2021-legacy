import { I18nMessages } from '@oh-my-rpg/definitions';
import { OutcomeArchetype, AdventureType } from '../types';
interface RawAdventureArchetypeEntry {
    good: boolean;
    hid: string;
    type: AdventureType;
    outcome: Partial<OutcomeArchetype>;
    isPublished?: boolean;
}
declare const ENTRIES: RawAdventureArchetypeEntry[];
declare const i18n_messages: I18nMessages;
export { RawAdventureArchetypeEntry, ENTRIES, i18n_messages };
