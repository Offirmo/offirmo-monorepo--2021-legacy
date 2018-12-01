import { Engagement, PendingEngagement, State } from './types';
import { SoftExecutionContext } from './sec';
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
declare function enqueue(state: Readonly<State>, engagement: Readonly<Engagement>, params?: Readonly<PendingEngagement['params']>): Readonly<State>;
declare function acknowledge_seen(state: Readonly<State>, uid: number): Readonly<State>;
declare function acknowledge_all_seen(state: Readonly<State>): Readonly<State>;
export { create, enqueue, acknowledge_seen, acknowledge_all_seen, };
