import { ItemQuality } from '@oh-my-rpg/definitions';
interface NumberHash {
    [k: string]: number;
}
declare const QUALITY_STRENGTH_MULTIPLIER: NumberHash;
declare const QUALITY_STRENGTH_SPREAD: NumberHash;
declare const ENHANCEMENT_MULTIPLIER = 0.2;
declare function get_interval(base_strength: number, quality: ItemQuality, enhancement_level: number, coef?: number): [number, number];
export { NumberHash, QUALITY_STRENGTH_MULTIPLIER, QUALITY_STRENGTH_SPREAD, ENHANCEMENT_MULTIPLIER, get_interval };
