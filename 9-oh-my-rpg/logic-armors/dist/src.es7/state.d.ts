import { Engine } from '@offirmo/random';
import { Armor } from './types';
import { i18n_messages } from './data';
declare function create(rng: Engine, hints?: Readonly<Partial<Armor>>): Armor;
declare function enhance(armor: Armor): Armor;
export { create, enhance, i18n_messages, };
