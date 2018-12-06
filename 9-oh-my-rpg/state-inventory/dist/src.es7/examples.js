import deepFreeze from 'deep-freeze-strict';
import { InventorySlot } from '@oh-my-rpg/definitions';
import { DEMO_WEAPON_1, DEMO_WEAPON_2 } from '@oh-my-rpg/logic-weapons';
import { DEMO_ARMOR_1, DEMO_ARMOR_2 } from '@oh-my-rpg/logic-armors';
/////////////////////
// needed to test migrations, both here and in composing parents
// a full featured, non-trivial demo state
// needed for demos
const DEMO_STATE = deepFreeze({
    schema_version: 1,
    revision: 42,
    unslotted_capacity: 20,
    slotted: {
        [InventorySlot.armor]: DEMO_ARMOR_2,
        [InventorySlot.weapon]: DEMO_WEAPON_1,
    },
    unslotted: [
        DEMO_WEAPON_2,
        DEMO_ARMOR_1,
    ],
});
/////////////////////
export { DEMO_STATE, };
/////////////////////
//# sourceMappingURL=examples.js.map