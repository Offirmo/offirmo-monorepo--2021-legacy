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
        human_time_to_next: '',
        total_energy_refilling_ratio: 1,
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
    snapshot.available_energy = Math.floor(energy_float);
    // restrict resolution for simplicity and testability
    snapshot.available_energy_float = utils_1.round_float(energy_float, ENERGY_ROUNDING);
    snapshot.total_energy_refilling_ratio = utils_1.round_float(energy_float / MAX_ENERGY_FLOAT);
    return snapshot;
}
exports.get_snapshot = get_snapshot;
//# sourceMappingURL=snapshot.js.map