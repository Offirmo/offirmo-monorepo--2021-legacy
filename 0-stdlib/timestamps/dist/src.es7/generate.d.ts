import { TimestampUTCMs, HumanReadableTimestampUTCMinutes, HumanReadableTimestampUTCMs } from './types';
declare function get_UTC_timestamp_ms(): TimestampUTCMs;
declare function get_human_readable_UTC_timestamp_minutes(now?: Date): HumanReadableTimestampUTCMinutes;
declare function get_human_readable_UTC_timestamp_ms_v1(now?: Date): HumanReadableTimestampUTCMs;
declare function get_human_readable_UTC_timestamp_ms(now?: Date): HumanReadableTimestampUTCMs;
export { TimestampUTCMs, HumanReadableTimestampUTCMinutes, HumanReadableTimestampUTCMs, get_human_readable_UTC_timestamp_ms_v1, get_UTC_timestamp_ms, get_human_readable_UTC_timestamp_ms, get_human_readable_UTC_timestamp_minutes };
