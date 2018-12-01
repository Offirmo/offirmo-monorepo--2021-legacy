import { TimestampUTCMs, HumanReadableTimestampUTCDays, HumanReadableTimestampUTCMinutes, HumanReadableTimestampUTCMs } from './types';
declare function get_UTC_timestamp_ms(): TimestampUTCMs;
declare function get_human_readable_UTC_timestamp_days(now?: Readonly<Date>): HumanReadableTimestampUTCDays;
declare function get_human_readable_UTC_timestamp_minutes(now?: Readonly<Date>): HumanReadableTimestampUTCMinutes;
declare function get_human_readable_UTC_timestamp_ms_v1(now?: Readonly<Date>): HumanReadableTimestampUTCMs;
declare function get_human_readable_UTC_timestamp_ms(now?: Readonly<Date>): HumanReadableTimestampUTCMs;
export { get_human_readable_UTC_timestamp_ms_v1, get_UTC_timestamp_ms, get_human_readable_UTC_timestamp_ms, get_human_readable_UTC_timestamp_minutes, get_human_readable_UTC_timestamp_days, };
