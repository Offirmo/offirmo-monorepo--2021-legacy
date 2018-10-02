/////////////////////
import { generate_uuid } from '@offirmo/uuid';
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
function rename(state, name) {
    if (!name)
        throw new Error(`Error while renaming to "${name}: invalid value!`);
    // TODO normalize
    return Object.assign({}, state, { name, revision: state.revision + 1 });
}
function set_email(state, email) {
    if (!email)
        throw new Error(`Error while setting mail to "${email}: invalid value!`);
    // TODO normalize
    return Object.assign({}, state, { email, revision: state.revision + 1 });
}
/////////////////////
export { DEFAULT_NAME, create, rename, set_email, };
/////////////////////
//# sourceMappingURL=state.js.map