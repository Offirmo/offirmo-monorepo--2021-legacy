import { HumanReadableTimestampUTCMs } from '@offirmo/timestamps';
interface EnergyUsage {
    date: HumanReadableTimestampUTCMs;
    energy_consumed: number;
}
interface State {
    schema_version: number;
    revision: number;
    max_energy: number;
    base_energy_refilling_rate_per_day: number;
    last_date: HumanReadableTimestampUTCMs;
    last_available_energy_float: number;
}
interface Snapshot {
    available_energy: number;
    available_energy_float: number;
    total_energy_refilling_ratio: number;
    next_energy_refilling_ratio: number;
    human_time_to_next: string;
}
export { EnergyUsage, State, Snapshot, };
