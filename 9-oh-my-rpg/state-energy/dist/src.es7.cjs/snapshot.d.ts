import { State, Snapshot } from './types';
declare const ENERGY_ROUNDING = 1000000;
declare function get_snapshot(state: Readonly<State>, now?: Readonly<Date>): Readonly<Snapshot>;
export { ENERGY_ROUNDING, get_snapshot, };
