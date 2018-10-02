import deepFreeze from 'deep-freeze-strict';
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    coin_count: 23456,
    token_count: 89,
});
export { DEMO_STATE, };
//# sourceMappingURL=examples.js.map