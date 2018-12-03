/* A helper for actual games using this model
 * TODO extract
 * TODO force refresh on client state change
 */
import EventEmitter from 'emittery';
import deep_merge from 'deepmerge';
import { get_item } from '@oh-my-rpg/state-inventory';
import * as PRNGState from '@oh-my-rpg/state-prng';
import * as state_fns from './state';
import * as selectors from './selectors';
import { migrate_to_latest } from './state/migrations';
import { reduce_action, get_actions_for_element } from './serialization';
function overwriteMerge(destination, source) {
    return source;
}
function create_game_instance({ SEC, get_latest_state, persist_state, view_state }) {
    return SEC.xTry('creating tbrpg instance', ({ SEC, logger }) => {
        SEC.xTry('auto creating/migrating', ({ SEC, logger }) => {
            let state = get_latest_state();
            // need this check due to some serializations returning {} for empty
            const was_empty_state = !state || Object.keys(state).length === 0;
            state = was_empty_state
                ? state_fns.reseed(state_fns.create(SEC))
                : migrate_to_latest(SEC, state);
            // TODO enqueue in engagement?
            if (was_empty_state) {
                logger.verbose('Clean savegame created from scratch:', { state });
            }
            else {
                logger.trace('migrated state:', { state });
            }
            // re-seed outside of the unit test path
            if (state.prng.seed === PRNGState.DEFAULT_SEED) {
                // TODO still needed ? Report as error to check.
                state = state_fns.reseed(state);
                logger.warn('re-seeding that shouldn’t be needed!');
            }
            persist_state(state);
        });
        view_state = view_state || {
            model: get_latest_state(),
        };
        const emitter = new EventEmitter();
        const gi = {
            reducers: {
                play() {
                    let state = get_latest_state();
                    state = state_fns.play(state);
                    persist_state(state);
                    emitter.emit('model_change', 'play()');
                },
                on_start_session() {
                    let state = get_latest_state();
                    state = state_fns.on_start_session(state);
                    persist_state(state);
                    emitter.emit('model_change', 'on_start_session()');
                },
                equip_item(uuid) {
                    let state = get_latest_state();
                    state = state_fns.equip_item(state, uuid);
                    persist_state(state);
                    emitter.emit('model_change', 'equip_item()');
                },
                sell_item(uuid) {
                    let state = get_latest_state();
                    state = state_fns.sell_item(state, uuid);
                    persist_state(state);
                    emitter.emit('model_change', 'sell_item()');
                },
                rename_avatar(new_name) {
                    let state = get_latest_state();
                    state = state_fns.rename_avatar(state, new_name);
                    persist_state(state);
                    emitter.emit('model_change', 'rename_avatar()');
                },
                change_avatar_class(new_class) {
                    let state = get_latest_state();
                    state = state_fns.change_avatar_class(state, new_class);
                    persist_state(state);
                    emitter.emit('model_change', 'change_avatar_class()');
                },
                attempt_to_redeem_code(code) {
                    let state = get_latest_state();
                    state = state_fns.attempt_to_redeem_code(state, code);
                    persist_state(state);
                    emitter.emit('model_change', 'attempt_to_redeem_code()');
                },
                acknowledge_engagement_msg_seen(uid) {
                    let state = get_latest_state();
                    state = state_fns.acknowledge_engagement_msg_seen(state, uid);
                    persist_state(state);
                    emitter.emit('model_change', 'acknowledge_engagement_msg_seen()');
                },
                execute_serialized_action(action) {
                    let state = get_latest_state();
                    state = reduce_action(state, action);
                    persist_state(state);
                    emitter.emit('model_change', `execute_serialized_action(${action.type})`);
                },
            },
            selectors: {
                get_item(uuid) {
                    let state = get_latest_state();
                    return get_item(state.inventory, uuid);
                },
                appraise_item_value(uuid) {
                    let state = get_latest_state();
                    return selectors.appraise_item_value(state, uuid);
                },
                appraise_item_power(uuid) {
                    let state = get_latest_state();
                    return selectors.appraise_item_power(state, uuid);
                },
                find_element(uuid) {
                    let state = get_latest_state();
                    return selectors.find_element(state, uuid);
                },
                get_actions_for_element(uuid) {
                    let state = get_latest_state();
                    return get_actions_for_element(state, uuid);
                },
                get_oldest_pending_flow_engagement() {
                    let state = get_latest_state();
                    return selectors.get_oldest_pending_flow_engagement(state);
                },
                get_oldest_pending_non_flow_engagement() {
                    let state = get_latest_state();
                    return selectors.get_oldest_pending_non_flow_engagement(state);
                },
                get_achievements_snapshot() {
                    let state = get_latest_state();
                    return selectors.get_achievements_snapshot(state);
                }
            },
            model: {
                get_state: get_latest_state,
                reset_state() {
                    const state = state_fns.reseed(state_fns.create());
                    persist_state(state);
                    logger.verbose('Savegame reseted:', { state });
                    emitter.emit('model_change', 'reset_state()');
                },
                // TODO clean
                subscribe(fn) {
                    const unbind = emitter.on('model_change', (src) => {
                        console.log(`🌀 model change reported to a subscriber (source: ${src})`);
                        fn();
                    });
                    return unbind;
                },
            },
            view: {
                // allow managing a transient state
                set_state(fn) {
                    const changed = fn(view_state);
                    console.log('⚡ view change requested', changed);
                    view_state = Object.assign({}, deep_merge(view_state, changed, { arrayMerge: overwriteMerge }), { model: get_latest_state() });
                    emitter.emit('view_change', 'set_state(…)');
                },
                get_state() {
                    return view_state;
                },
            },
            subscribe(fn) {
                const unbind = emitter.on('view_change', (src) => {
                    console.log(`🌀 uber state change reported to a subscriber (source: view/${src})`);
                    fn();
                });
                return unbind;
            },
        };
        emitter.on('model_change', (src) => {
            view_state = Object.assign({}, view_state, { model: get_latest_state() });
            emitter.emit('view_change', `model.${src}`);
        });
        return gi;
    });
}
export { create_game_instance, };
//# sourceMappingURL=game-instance.js.map