import { State, PendingEngagement } from './types';
declare function get_oldest_queued_flow(state: Readonly<State>): PendingEngagement | undefined;
declare function get_oldest_queued_non_flow(state: Readonly<State>): PendingEngagement | undefined;
export { get_oldest_queued_flow, get_oldest_queued_non_flow, };
