import { Armor } from './types';
export declare const ATTACK_VS_DEFENSE_RATIO = 0.5;
declare function get_damage_reduction_interval(armor: Readonly<Armor>): [number, number];
declare function get_medium_damage_reduction(armor: Readonly<Armor>): number;
declare function matches(armor: Readonly<Armor>, elements: Readonly<Partial<Armor>>): boolean;
export { get_damage_reduction_interval, get_medium_damage_reduction, matches, };
