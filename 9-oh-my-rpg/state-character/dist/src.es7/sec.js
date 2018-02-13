import { oh_my_rpg_get_SEC } from '@oh-my-rpg/definitions';
import { LIB } from './consts';
function get_SEC(SEC) {
    return oh_my_rpg_get_SEC({
        module: LIB,
        parent_SEC: SEC,
    });
    // TODO add details: schema version
}
export { get_SEC, };
//# sourceMappingURL=sec.js.map