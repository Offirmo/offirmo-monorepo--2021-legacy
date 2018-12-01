import { Armor } from './types';
declare function get_damage_reduction_interval(armor: Readonly<Armor>): [number, number];
declare function get_medium_damage_reduction(armor: Readonly<Armor>): number;
declare function matches(armor: Readonly<Armor>, elements: Readonly<Partial<Armor>>): boolean;
export { get_damage_reduction_interval, get_medium_damage_reduction, matches, };
