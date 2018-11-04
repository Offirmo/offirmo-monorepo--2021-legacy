import { Engine } from '@offirmo/random';
import { Armor } from './types';
declare const DEMO_ARMOR_1: Readonly<Armor>;
declare const DEMO_ARMOR_2: Readonly<Armor>;
declare function generate_random_demo_armor(rng?: Engine): Armor;
export { DEMO_ARMOR_1, DEMO_ARMOR_2, generate_random_demo_armor, };
