import deepFreeze from 'deep-freeze-strict';
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deepFreeze({
    schema_version: 2,
    revision: 108,
    seed: 1234,
    use_count: 107,
    recently_encountered_by_id: {
        'item': ['axe', 'sword'],
        'adventures': ['dragon', 'king'],
        'mistery': [],
    },
});
const MIGRATION_HINTS_FOR_TESTS = {
    'to_v1': {},
    'to_v2': {},
};
export { DEMO_STATE, MIGRATION_HINTS_FOR_TESTS, };
//# sourceMappingURL=examples.js.map