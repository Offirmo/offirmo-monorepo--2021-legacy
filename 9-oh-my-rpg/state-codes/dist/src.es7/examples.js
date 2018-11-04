import deepFreeze from 'deep-freeze-strict';
/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 3,
    redeemed_codes: {
        BORED: {
            "redeem_count": 1,
            "last_redeem_date_minutes": "20181030_21h23"
        }
    },
});
/////////////////////
export { DEMO_STATE, };
//# sourceMappingURL=examples.js.map