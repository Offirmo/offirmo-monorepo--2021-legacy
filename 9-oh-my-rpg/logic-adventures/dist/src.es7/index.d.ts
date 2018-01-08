import { Engine } from '@offirmo/random';
import { CoinsGain, AdventureType, OutcomeArchetype, AdventureArchetype } from './types';
import { i18n_messages } from './data';
declare const ALL_ADVENTURE_ARCHETYPES: AdventureArchetype[];
declare const ALL_BAD_ADVENTURE_ARCHETYPES: AdventureArchetype[];
declare const ALL_GOOD_ADVENTURE_ARCHETYPES: AdventureArchetype[];
declare const GOOD_ADVENTURE_ARCHETYPES_BY_TYPE: {
    [k: string]: AdventureArchetype[];
};
declare function get_archetype(hid: string): AdventureArchetype;
declare function pick_random_good_archetype(rng: Engine): AdventureArchetype;
declare function pick_random_bad_archetype(rng: Engine): AdventureArchetype;
declare function generate_random_coin_gain(rng: Engine, range: CoinsGain, player_level: number): number;
export { i18n_messages, ALL_ADVENTURE_ARCHETYPES, ALL_BAD_ADVENTURE_ARCHETYPES, ALL_GOOD_ADVENTURE_ARCHETYPES, GOOD_ADVENTURE_ARCHETYPES_BY_TYPE, CoinsGain, AdventureType, OutcomeArchetype, AdventureArchetype, pick_random_good_archetype, pick_random_bad_archetype, generate_random_coin_gain, get_archetype };
