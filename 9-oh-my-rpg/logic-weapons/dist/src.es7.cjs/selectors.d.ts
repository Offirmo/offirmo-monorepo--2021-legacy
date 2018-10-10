import { Weapon } from './types';
declare function get_damage_interval(weapon: Readonly<Weapon>): [number, number];
declare function get_medium_damage(weapon: Readonly<Weapon>): number;
export { get_damage_interval, get_medium_damage, };
