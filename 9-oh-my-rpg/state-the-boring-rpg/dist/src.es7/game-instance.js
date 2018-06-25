/* A helper for actual games using this model
 * TODO extract
 * TODO force refresh on client state change
 */
const EventEmitter = require('emittery');
const deep_merge = require('deepmerge').default;
import { get_item } from '@oh-my-rpg/state-inventory';
import * as state_fns from './state';
import { migrate_to_latest } from './migrations';
import { ActionCategory } from './serializable_actions';
function overwriteMerge(destination, source) {
    return source;
}
function create_game_instance({ SEC, get_latest_state, persist_state, client_state }) {
    return SEC.xTry('creating tbrpg instance', ({ SEC, logger }) => {
        SEC.xTry('auto creating/migrating', ({ SEC, logger }) => {
            let state = get_latest_state();
            const was_empty_state = !state || Object.keys(state).length === 0;
            state = was_empty_state
                ? state_fns.create(SEC)
                : migrate_to_latest(SEC, state);
            if (was_empty_state) {
                logger.verbose('Clean savegame created from scratch:', { state });
            }
            else {
                logger.trace('migrated state:', { state });
            }
            persist_state(state);
        });
        client_state = client_state || {
            mode: ActionCategory.base,
        };
        const emitter = new EventEmitter();
        // todo .model .view ?
        return {
            play() {
                let state = get_latest_state();
                state = state_fns.play(state);
                persist_state(state);
                emitter.emit('state_change');
            },
            equip_item(uuid) {
                let state = get_latest_state();
                state = state_fns.equip_item(state, uuid);
                persist_state(state);
                emitter.emit('state_change');
            },
            sell_item(uuid) {
                let state = get_latest_state();
                state = state_fns.sell_item(state, uuid);
                persist_state(state);
                emitter.emit('state_change');
            },
            rename_avatar(new_name) {
                let state = get_latest_state();
                state = state_fns.rename_avatar(state, new_name);
                persist_state(state);
                emitter.emit('state_change');
            },
            change_avatar_class(new_class) {
                let state = get_latest_state();
                state = state_fns.change_avatar_class(state, new_class);
                persist_state(state);
                emitter.emit('state_change');
            },
            reset_all() {
                let state = state_fns.create();
                state = state_fns.reseed(state);
                persist_state(state);
                logger.verbose('Savegame reseted:', { state });
                emitter.emit('state_change');
            },
            execute_serialized_action(action) {
                let state = get_latest_state();
                state = state_fns.execute(state, action);
                persist_state(state);
                emitter.emit('state_change');
            },
            get_item(uuid) {
                let state = get_latest_state();
                return get_item(state.inventory, uuid);
            },
            appraise_item(uuid) {
                let state = get_latest_state();
                return state_fns.appraise_item(state, uuid);
            },
            find_element(uuid) {
                let state = get_latest_state();
                return state_fns.find_element(state, uuid);
            },
            get_actions_for_element(uuid) {
                let state = get_latest_state();
                return state_fns.get_actions_for_element(state, uuid);
            },
            get_latest_state,
            subscribe(fn) {
                const unbind = emitter.on('state_change', fn);
                return unbind;
            },
            // allow managing a transient state
            set_client_state(fn) {
                const changed = fn(client_state);
                client_state = Object.assign({}, deep_merge(client_state, changed, {
                    arrayMerge: overwriteMerge,
                }));
                emitter.emit('state_change');
            },
            get_client_state() {
                return client_state;
            }
        };
    });
}
export { create_game_instance, };
//# sourceMappingURL=game-instance.js.map