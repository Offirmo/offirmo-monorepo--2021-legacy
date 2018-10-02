import { State } from './types';
declare function create(): Readonly<State>;
declare function use_energy(state: Readonly<State>, qty?: number, date?: Date): Readonly<State>;
declare function loose_all_energy(state: Readonly<State>, date?: Date): Readonly<State>;
declare function replenish_energy(state: Readonly<State>, date?: Date): Readonly<State>;
export { State, create, use_energy, loose_all_energy, replenish_energy, };
