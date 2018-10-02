import { Engine } from '@offirmo/random';
import { i18n_messages, ENTRIES as static_weapon_data } from './data';
import { WeaponPartType, Weapon } from './types';
declare const MIN_ENHANCEMENT_LEVEL = 0;
declare const MAX_ENHANCEMENT_LEVEL = 8;
declare const MIN_STRENGTH = 1;
declare const MAX_STRENGTH = 20;
declare function create(rng: Engine, hints?: Readonly<Partial<Weapon>>): Weapon;
declare function generate_random_demo_weapon(): Weapon;
declare function compare_weapons_by_strength(a: Readonly<Weapon>, b: Readonly<Weapon>): number;
declare function enhance(weapon: Weapon): Weapon;
declare function get_damage_interval(weapon: Readonly<Weapon>): [number, number];
declare function get_medium_damage(weapon: Readonly<Weapon>): number;
declare const DEMO_WEAPON_1: Readonly<Weapon>;
declare const DEMO_WEAPON_2: Readonly<Weapon>;
export { WeaponPartType, Weapon, MIN_ENHANCEMENT_LEVEL, MAX_ENHANCEMENT_LEVEL, MIN_STRENGTH, MAX_STRENGTH, create, generate_random_demo_weapon, compare_weapons_by_strength, enhance, get_damage_interval, get_medium_damage, i18n_messages, static_weapon_data, DEMO_WEAPON_1, DEMO_WEAPON_2, };
