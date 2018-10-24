import deepFreeze from 'deep-freeze-strict';
/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    redeemed_codes: [
    // TODO
    ],
});
/////////////////////
export { DEMO_STATE, };
//# sourceMappingURL=examples.js.map