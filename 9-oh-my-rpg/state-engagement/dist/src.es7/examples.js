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
            engagement: {
                key: 'new-game-welcome',
                type: EngagementType.flow,
            },
            queue_time_root_revision: 0,
        }
    ],
});
/////////////////////
export { DEMO_STATE, };
//# sourceMappingURL=examples.js.map