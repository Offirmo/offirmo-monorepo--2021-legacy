import { get_item } from '@oh-my-rpg/state-inventory';
import * as state_fns from './state';
import { migrate_to_latest } from './migrations';
function create_game_instance({ SEC, get_latest_state, update_state }) {
    return SEC.xTry('creating tbrpg instance', ({ SEC, logger }) => {
        (function migrate() {
            SEC.xTry('auto migrating', ({ logger }) => {
                let state = get_latest_state();
                const was_empty_state = !state || Object.keys(state).length === 0;
                state = migrate_to_latest(SEC, state);
                if (was_empty_state) {
                    logger.verbose('Clean savegame created from scratch:', { state });
                }
                else {
                    logger.trace('migrated state:', { state });
                }
                update_state(state);
            });
        })();
        return {
            play() {
                let state = get_latest_state();
                state = state_fns.play(state);
                update_state(state);
            },
            equip_item(uuid) {
                let state = get_latest_state();
                state = state_fns.equip_item(state, uuid);
                update_state(state);
            },
            sell_item(uuid) {
                let state = get_latest_state();
                state = state_fns.sell_item(state, uuid);
                update_state(state);
            },
            rename_avatar(new_name) {
                let state = get_latest_state();
                state = state_fns.rename_avatar(state, new_name);
                update_state(state);
            },
            change_avatar_class(new_class) {
                let state = get_latest_state();
                state = state_fns.change_avatar_class(state, new_class);
                update_state(state);
            },
            get_item(uuid) {
                let state = get_latest_state();
                return get_item(state.inventory, uuid);
            },
            appraise_item(uuid) {
                let state = get_latest_state();
                return state_fns.appraise_item(state, uuid);
            },
            reset_all() {
                let state = state_fns.create();
                state = state_fns.reseed(state);
                update_state(state);
                logger.verbose('Savegame reseted:', { state });
            },
            get_latest_state,
        };
    });
}
export { create_game_instance, };
//# sourceMappingURL=game-instance.js.map