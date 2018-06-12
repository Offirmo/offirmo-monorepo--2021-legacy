"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const definitions_1 = require("@oh-my-rpg/definitions");
const consts_1 = require("./consts");
/////////////////////
const DEFAULT_NAME = 'anonymous';
exports.DEFAULT_NAME = DEFAULT_NAME;
///////
function create() {
    return {
        schema_version: consts_1.SCHEMA_VERSION,
        revision: 0,
        uuid: definitions_1.generate_uuid(),
        name: DEFAULT_NAME,
        email: null,
        allow_telemetry: true,
    };
}
exports.create = create;
/////////////////////
function rename(state, new_name) {
    if (!new_name)
        throw new Error(`Error while renaming to "${new_name}: invalid value!`);
    state.name = new_name;
    return state;
}
exports.rename = rename;
function set_email(state, email) {
    if (!email)
        throw new Error(`Error while setting mail to "${email}: invalid value!`);
    state.email = email;
    return state;
}
exports.set_email = set_email;
/////////////////////
//# sourceMappingURL=state.js.map