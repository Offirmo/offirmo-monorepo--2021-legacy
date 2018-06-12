import { State, Snapshot } from './types';
declare const ENERGY_ROUNDING = 1000000;
declare function get_snapshot(state: State, now?: Date): Snapshot;
export { ENERGY_ROUNDING, get_snapshot, };
