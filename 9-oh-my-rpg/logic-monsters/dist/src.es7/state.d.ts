import { Engine } from '@offirmo/random';
import { Monster } from './types';
declare function create(rng: Engine, hints?: Readonly<Partial<Monster>>): Monster;
export { create, };
