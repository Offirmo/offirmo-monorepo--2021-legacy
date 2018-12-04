import { Item } from '@oh-my-rpg/definitions';
declare function appraise_power_normalized(item: Readonly<Item>, potential?: boolean): number;
declare function appraise_power(item: Readonly<Item>, potential?: boolean): number;
declare function appraise_value(item: Readonly<Item>): number;
export { appraise_power_normalized, appraise_power, appraise_value, };
