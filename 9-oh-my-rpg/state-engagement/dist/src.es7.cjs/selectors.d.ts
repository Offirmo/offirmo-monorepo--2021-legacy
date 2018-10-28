import { State, PendingEngagement } from './types';
declare function is_in_queue(state: Readonly<State>, key: string): boolean;
declare function get_oldest_queued_flow(state: Readonly<State>): PendingEngagement | undefined;
declare function get_oldest_queued_non_flow(state: Readonly<State>): PendingEngagement | undefined;
export { is_in_queue, get_oldest_queued_flow, get_oldest_queued_non_flow, };
