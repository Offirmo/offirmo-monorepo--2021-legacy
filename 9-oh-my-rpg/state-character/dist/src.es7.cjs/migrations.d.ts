import { State } from './types';
import { SoftExecutionContext } from './sec';
declare function migrate_to_latest(SEC: SoftExecutionContext, legacy_state: any, hints?: any): State;
export { migrate_to_latest };
