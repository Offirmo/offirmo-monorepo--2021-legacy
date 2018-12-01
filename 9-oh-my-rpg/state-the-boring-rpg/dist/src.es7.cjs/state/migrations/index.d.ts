import { State } from '../../types';
import { SoftExecutionContext } from '../../sec';
declare const SUB_REDUCERS_COUNT = 8;
declare function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: Readonly<any>, hints?: Readonly<any>): State;
export { SUB_REDUCERS_COUNT, migrate_to_latest, };
