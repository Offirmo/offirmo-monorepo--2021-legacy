import deepFreeze from 'deep-freeze-strict';
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 5,
    uuid: 'uu1dgqu3h0FydqWyQ~6cYv3g',
    name: 'Offirmo',
    email: 'offirmo.net@gmail.com',
    allow_telemetry: false,
});
/////////////////////
export { DEMO_STATE, };
//# sourceMappingURL=examples.js.map