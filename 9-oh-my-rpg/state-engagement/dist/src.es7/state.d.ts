import { Engagement, PendingEngagement, State } from './types';
import { SoftExecutionContext } from './sec';
declare function create(SEC?: SoftExecutionContext): Readonly<State>;
declare function enqueue(state: Readonly<State>, engagement: Engagement, params?: PendingEngagement['params']): Readonly<State>;
declare function acknowledge_seen(state: Readonly<State>, uid: number): Readonly<State>;
export { create, enqueue, acknowledge_seen, };
