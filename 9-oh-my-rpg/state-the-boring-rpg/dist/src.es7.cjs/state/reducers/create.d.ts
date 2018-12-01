import { Weapon } from '@oh-my-rpg/logic-weapons';
import { Armor } from '@oh-my-rpg/logic-armors';
import { SoftExecutionContext } from '../../sec';
import { State } from '../../types';
declare const STARTING_WEAPON_SPEC: Readonly<Partial<Weapon>>;
declare const STARTING_ARMOR_SPEC: Readonly<Partial<Armor>>;
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
declare function reseed(state: Readonly<State>, seed?: number): Readonly<State>;
export { STARTING_WEAPON_SPEC, STARTING_ARMOR_SPEC, create, reseed, };
