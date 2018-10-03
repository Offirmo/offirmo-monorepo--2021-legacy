import { ItemQuality } from '@oh-my-rpg/definitions';
import { Armor } from './types';
declare function get_interval(base_strength: number, quality: ItemQuality, enhancement_level: number, coef?: number): [number, number];
declare function get_damage_reduction_interval(armor: Readonly<Armor>): [number, number];
declare function get_medium_damage_reduction(armor: Readonly<Armor>): number;
declare function enhance(armor: Armor): Armor;
export { get_interval, get_damage_reduction_interval, get_medium_damage_reduction, enhance, };
