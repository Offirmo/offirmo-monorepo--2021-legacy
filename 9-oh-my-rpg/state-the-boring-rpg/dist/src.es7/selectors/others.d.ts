import { UUID } from '@offirmo/uuid';
import * as RichText from '@offirmo/rich-text-format';
import { Element } from '@oh-my-rpg/definitions';
import { Snapshot } from '@oh-my-rpg/state-energy';
import { PendingEngagement } from "@oh-my-rpg/state-engagement";
import { AchievementSnapshot } from "@oh-my-rpg/state-progress";
import { State } from '../types';
declare function get_energy_snapshot(state: Readonly<State>, now?: Readonly<Date>): Readonly<Snapshot>;
declare function appraise_item_value(state: Readonly<State>, uuid: UUID): number;
declare function appraise_item_power(state: Readonly<State>, uuid: UUID): number;
declare function appraise_player_power(state: Readonly<State>): number;
declare function find_element(state: Readonly<State>, uuid: UUID): Readonly<Element> | Readonly<AchievementSnapshot> | null;
declare function get_oldest_pending_flow_engagement(state: Readonly<State>): {
    uid: number;
    $doc: RichText.Document;
    pe: PendingEngagement;
} | null;
declare function get_oldest_pending_non_flow_engagement(state: Readonly<State>): {
    uid: number;
    $doc: RichText.Document;
    pe: PendingEngagement;
} | null;
export { get_energy_snapshot, appraise_item_value, appraise_item_power, find_element, appraise_player_power, get_oldest_pending_flow_engagement, get_oldest_pending_non_flow_engagement, };
export * from './achievements';
