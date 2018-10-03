import { Engine } from '@offirmo/random';
import { Armor } from './types';
import { i18n_messages, ENTRIES as static_armor_data } from './data';
declare function create(rng: Engine, hints?: Readonly<Partial<Armor>>): Armor;
declare function generate_random_demo_armor(): Armor;
export { create, generate_random_demo_armor, i18n_messages, static_armor_data, };
