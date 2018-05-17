"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timestamps_1 = require("@offirmo/timestamps");
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const ENERGY_ROUNDING = 1000000;
exports.ENERGY_ROUNDING = ENERGY_ROUNDING;
const DEBUG = false;
function get_snapshot(state, now = new Date()) {
    if (DEBUG)
        console.log('\nstarting snapshot computation', state, { now });
    // base = all max
    const MAX_ENERGY_FLOAT = parseFloat(state.max_energy);
    const snapshot = {
        available_energy: state.max_energy,
        available_energy_float: MAX_ENERGY_FLOAT,
        total_energy_refilling_ratio: 1,
        next_energy_refilling_ratio: 1,
        human_time_to_next: '',
    };
    const t1 = timestamps_1.parse_human_readable_UTC_timestamp_ms(state.last_date);
    let energy_float = state.last_available_energy_float;
    const ENERGY_REFILLING_RATE_PER_S = state.base_energy_refilling_rate_per_day / (24 * 3600);
    const t2 = now;
    if (DEBUG)
        console.log('⚡️ advancing energy consumption:\n', { date: t2 });
    // restore energy consumed since last time
    const elapsed_time_s = (t2 - t1) / 1000.;
    if (elapsed_time_s < 0)
        throw new Error(`${consts_1.LIB}: internal error, past usages in incorrect order!`);
    const restored_energy_float = elapsed_time_s * ENERGY_REFILLING_RATE_PER_S;
    energy_float = Math.min(energy_float + restored_energy_float, MAX_ENERGY_FLOAT);
    if (DEBUG)
        console.log('restored energy at this date:', { elapsed_time_s, restored_energy_float, energy_float });
    snapshot.available_energy = Math.trunc(energy_float);
    // restrict resolution for simplicity and testability
    snapshot.available_energy_float = utils_1.round_float(energy_float, ENERGY_ROUNDING);
    snapshot.total_energy_refilling_ratio = utils_1.round_float(energy_float / MAX_ENERGY_FLOAT);
    // compute time-to-next energy if applicable
    let human_time_to_next = '';
    if (snapshot.available_energy < state.max_energy) {
        const dec = energy_float - Math.trunc(energy_float);
        const sec_until_next = Math.trunc((1 - dec) / ENERGY_REFILLING_RATE_PER_S);
        const s = sec_until_next % 60;
        const m = ((sec_until_next - s) / 60) % 60;
        const h = (sec_until_next - s - m * 60) / 3600;
        if (h)
            human_time_to_next += `${h}h`;
        if (m)
            human_time_to_next += `${m}m`;
        if (s)
            human_time_to_next += `${s}s`;
        snapshot.human_time_to_next = human_time_to_next;
        snapshot.next_energy_refilling_ratio = utils_1.round_float(dec, ENERGY_ROUNDING);
    }
    return snapshot;
}
exports.get_snapshot = get_snapshot;
//# sourceMappingURL=snapshot.js.map