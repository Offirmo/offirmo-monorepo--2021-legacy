"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const timestamps_1 = require("@offirmo/timestamps");
const consts_1 = require("./consts");
const snapshot_1 = require("./snapshot");
const timestamps_2 = require("@offirmo/timestamps");
/////////////////////
const DEFAULT_NAME = 'anonymous';
///////
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        max_energy: 7,
        base_energy_refilling_rate_per_day: 7,
        last_date: timestamps_1.get_human_readable_UTC_timestamp_ms(new Date(0)),
        last_available_energy_float: 7.,
    };
}
exports.create = create;
/////////////////////
// date can be forced for testing reasons,
function use_energy(state, qty = 1, date = new Date()) {
    if (date < timestamps_2.parse_human_readable_UTC_timestamp_ms(state.last_date))
        throw new Error(`${consts_1.LIB}: time went backward! (cheating attempt?)`);
    const snapshot = snapshot_1.get_snapshot(state, date);
    if (qty > snapshot.available_energy) {
        //console.error({state, qty, snapshot})
        throw new Error(`${consts_1.LIB}: not enough energy left!`);
    }
    state = Object.assign({}, state, { revision: state.revision + 1, last_date: timestamps_1.get_human_readable_UTC_timestamp_ms(date), last_available_energy_float: snapshot.available_energy_float - qty });
    return state;
}
exports.use_energy = use_energy;
/////////////////////
//# sourceMappingURL=state.js.map