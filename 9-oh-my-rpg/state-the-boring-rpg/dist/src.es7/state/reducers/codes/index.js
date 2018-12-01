/////////////////////
import * as EnergyState from '@oh-my-rpg/state-energy';
import * as EngagementState from '@oh-my-rpg/state-engagement';
import * as CodesState from '@oh-my-rpg/state-codes';
import * as ProgressState from '@oh-my-rpg/state-progress';
/////////////////////
import { get_lib_SEC } from '../../../sec';
import { EngagementKey } from '../../../engagement';
import { get_energy_snapshot, } from '../../../selectors';
import { _refresh_achievements } from '../achievements';
/////////////////////
function attempt_to_redeem_code(state, code) {
    const infos = {
        has_energy_depleted: get_energy_snapshot(state).available_energy < 1,
        good_play_count: state.progress.statistics.good_play_count,
        is_alpha_player: true,
        is_player_since_alpha: true,
    };
    let engagement_key = EngagementKey['code_redemption--failed'];
    let engagement_params = {};
    if (!CodesState.is_code_redeemable(state.codes, code, infos)) {
        // TODO ?
    }
    else {
        state = Object.assign({}, state, { codes: CodesState.redeem_code(get_lib_SEC(), state.codes, code, infos) });
        code = CodesState.normalize_code(code);
        engagement_key = EngagementKey['code_redemption--succeeded'];
        engagement_params.code = code;
        switch (code) {
            case 'TESTNEVER':
            case 'TESTALWAYS':
            case 'TESTONCE':
            case 'TESTTWICE':
                // test codes which do nothing
                break;
            case 'TESTNOTIFS':
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.flow,
                        key: EngagementKey['hello_world--flow'],
                    }, {
                        // TODO make flow have semantic levels as well!
                        name: 'flow from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        name: 'aside default from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'error',
                        name: 'aside error from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'warning',
                        name: 'aside warning from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'info',
                        name: 'aside info from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'success',
                        name: 'aside success from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.warning,
                        key: EngagementKey['hello_world--warning'],
                    }, {
                        name: 'warning from TESTNOTIFS',
                    }) });
                break;
            case 'TESTACH':
                // this will auto-re-gain this achievement
                state = Object.assign({}, state, { progress: ProgressState.on_achieved(state.progress, 'TEST', ProgressState.AchievementStatus.revealed) });
                break;
            case 'BORED':
                state = Object.assign({}, state, { energy: EnergyState.restore_energy(state.energy, 1.) });
                break;
            // TODO
            /*case 'REBORN': {

               }
               break
           case 'ALPHART': {

               }
               break*/
            default:
                throw new Error(`Internal error: code "${code}" not implemented!`);
        }
    }
    return _refresh_achievements(Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
            type: EngagementState.EngagementType.flow,
            key: engagement_key,
        }, engagement_params), revision: state.revision + 1 }));
}
/////////////////////
export { attempt_to_redeem_code, };
/////////////////////
//# sourceMappingURL=index.js.map