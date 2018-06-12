/////////////////////
import { generate_uuid } from '@oh-my-rpg/definitions';
import { SCHEMA_VERSION } from './consts';
/////////////////////
const DEFAULT_NAME = 'anonymous';
///////
function create() {
    return {
        schema_version: SCHEMA_VERSION,
        revision: 0,
        uuid: generate_uuid(),
        name: DEFAULT_NAME,
        email: null,
        allow_telemetry: true,
    };
}
/////////////////////
function rename(state, new_name) {
    if (!new_name)
        throw new Error(`Error while renaming to "${new_name}: invalid value!`);
    state.name = new_name;
    return state;
}
function set_email(state, email) {
    if (!email)
        throw new Error(`Error while setting mail to "${email}: invalid value!`);
    state.email = email;
    return state;
}
/////////////////////
export { DEFAULT_NAME, create, rename, set_email, };
/////////////////////
//# sourceMappingURL=state.js.map