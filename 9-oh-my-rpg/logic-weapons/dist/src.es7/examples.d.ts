import { Engine } from '@offirmo/random';
import { Weapon } from './types';
declare const DEMO_WEAPON_1: Readonly<Weapon>;
declare const DEMO_WEAPON_2: Readonly<Weapon>;
declare function generate_random_demo_weapon(rng?: Engine): Weapon;
export { DEMO_WEAPON_1, DEMO_WEAPON_2, generate_random_demo_weapon, };
