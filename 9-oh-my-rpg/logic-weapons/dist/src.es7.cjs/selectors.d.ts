import { Weapon } from './types';
declare function get_damage_interval(weapon: Readonly<Weapon>): [number, number];
declare function get_medium_damage(weapon: Readonly<Weapon>): number;
declare function matches(weapon: Readonly<Weapon>, elements: Readonly<Partial<Weapon>>): boolean;
export { get_damage_interval, get_medium_damage, matches, };
