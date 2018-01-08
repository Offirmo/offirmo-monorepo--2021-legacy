import { Engine } from '@offirmo/random';
import { Item } from '@oh-my-rpg/definitions';
declare function create(rng: Engine): void;
declare function generate_random_demo_shop(): void;
declare function appraise(item: Item): number;
export { generate_random_demo_shop, create, appraise };
