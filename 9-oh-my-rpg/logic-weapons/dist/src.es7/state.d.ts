import { Engine } from '@offirmo/random';
import { Weapon } from './types';
import { i18n_messages } from './data';
declare function create(rng: Engine, hints?: Readonly<Partial<Weapon>>): Weapon;
declare function enhance(weapon: Weapon): Weapon;
export { create, enhance, i18n_messages, };
