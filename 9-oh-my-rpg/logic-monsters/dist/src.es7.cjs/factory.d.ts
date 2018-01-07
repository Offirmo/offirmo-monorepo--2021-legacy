import { Engine } from '@offirmo/random';
import { Monster } from './types';
declare function create(rng: Engine, hints?: Partial<Monster>): Monster;
declare function generate_random_demo_monster(): Monster;
declare const DEMO_MONSTER_01: Monster;
export { create, generate_random_demo_monster, DEMO_MONSTER_01 };
