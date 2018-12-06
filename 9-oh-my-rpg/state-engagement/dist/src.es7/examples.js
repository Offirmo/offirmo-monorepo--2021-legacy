import deepFreeze from 'deep-freeze-strict';
import { EngagementType, } from './types';
/////////////////////
// a full featured, non-trivial demo state
// useful for demos and unit tests
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    queue: [
        {
            uid: 42,
            engagement: {
                key: 'hello_world--flow',
                type: EngagementType.flow,
            },
            queue_time_root_revision: 0,
            params: {},
        }
    ],
});
/////////////////////
export { DEMO_STATE, };
//# sourceMappingURL=examples.js.map