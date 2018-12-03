"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/////////////////////
const definitions_1 = require("@oh-my-rpg/definitions");
const EnergyState = tslib_1.__importStar(require("@oh-my-rpg/state-energy"));
const EngagementState = tslib_1.__importStar(require("@oh-my-rpg/state-engagement"));
const PRNGState = tslib_1.__importStar(require("@oh-my-rpg/state-prng"));
const CodesState = tslib_1.__importStar(require("@oh-my-rpg/state-codes"));
const ProgressState = tslib_1.__importStar(require("@oh-my-rpg/state-progress"));
const state_prng_1 = require("@oh-my-rpg/state-prng");
const logic_weapons_1 = require("@oh-my-rpg/logic-weapons");
const logic_armors_1 = require("@oh-my-rpg/logic-armors");
const engagement_1 = require("../../engagement");
const codes_1 = require("../../data/codes");
const base_1 = require("./base");
const achievements_1 = require("./achievements");
const salvage_1 = require("../migrations/salvage");
const create_1 = require("./create");
const autoplay_1 = require("./autoplay");
/////////////////////
/*
    if (!is_code_redeemable(state, code, infos))
        throw new Error(`This code is either non-existing or non redeemable at the moment!`)
 */
function attempt_to_redeem_code(state, code) {
    let engagement_key = engagement_1.EngagementKey['code_redemption--failed'];
    let engagement_params = {};
    code = CodesState.normalize_code(code);
    const code_spec = codes_1.CODE_SPECS_BY_KEY[code];
    if (!code_spec || !CodesState.is_code_redeemable(state.codes, code_spec, state)) {
        // this should not having been called
        // nothing to do, will trigger an engagement rejection
    }
    else {
        state = Object.assign({}, state, { codes: CodesState.attempt_to_redeem_code(state.codes, code_spec, state) });
        engagement_key = engagement_1.EngagementKey['code_redemption--succeeded'];
        engagement_params.code = code;
        switch (code) {
            case 'TESTNOTIFS':
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.flow,
                        key: engagement_1.EngagementKey['hello_world--flow'],
                    }, {
                        // TODO make flow have semantic levels as well!
                        name: 'flow from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: engagement_1.EngagementKey['hello_world--aside'],
                    }, {
                        name: 'aside default from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: engagement_1.EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'error',
                        name: 'aside error from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: engagement_1.EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'warning',
                        name: 'aside warning from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: engagement_1.EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'info',
                        name: 'aside info from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.aside,
                        key: engagement_1.EngagementKey['hello_world--aside'],
                    }, {
                        semantic_level: 'success',
                        name: 'aside success from TESTNOTIFS',
                    }) });
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.warning,
                        key: engagement_1.EngagementKey['hello_world--warning'],
                    }, {
                        name: 'warning from TESTNOTIFS',
                    }) });
                break;
            case 'TESTACH':
                // complicated, but will auto-re-gain this achievement
                state = Object.assign({}, state, { progress: ProgressState.on_achieved(state.progress, 'TEST', ProgressState.AchievementStatus.revealed) });
                break;
            case 'BORED':
                state = Object.assign({}, state, { energy: EnergyState.restore_energy(state.energy, 1.) });
                break;
            case 'XYZZY':
                // http://www.plover.net/~davidw/sol/xyzzy.html
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.flow,
                        key: engagement_1.EngagementKey['just-some-text'],
                    }, {
                        text: 'Nothing happens.',
                    }) });
                break;
            case 'PLUGH':
                // http://www.plover.net/~davidw/sol/plugh.html
                state = Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
                        type: EngagementState.EngagementType.flow,
                        key: engagement_1.EngagementKey['just-some-text'],
                    }, {
                        text: 'A hollow voice says "Ahhhhhhh".',
                    }) });
                break;
            case 'REBORNX':
                state = create_1.reseed(state); // force random reseed to see new stuff
                state = salvage_1.reset_and_salvage(state);
                state = Object.assign({}, state, { progress: ProgressState.on_achieved(state.progress, 'Reborn!', ProgressState.AchievementStatus.unlocked) });
                break;
            case 'REBORN':
                state = salvage_1.reset_and_salvage(state);
                state = Object.assign({}, state, { progress: ProgressState.on_achieved(state.progress, 'Reborn!', ProgressState.AchievementStatus.unlocked) });
                break;
            case 'ALPHATWINK': {
                const rng = state_prng_1.get_prng(state.prng);
                const weapon = logic_weapons_1.create(rng, { quality: definitions_1.ItemQuality.artifact });
                const armor = logic_armors_1.create(rng, { quality: definitions_1.ItemQuality.artifact });
                state = autoplay_1._auto_make_room(state);
                state = base_1._receive_item(state, weapon);
                state = autoplay_1._auto_make_room(state);
                state = base_1._receive_item(state, armor);
                state = Object.assign({}, state, { prng: PRNGState.update_use_count(state.prng, rng, 8) });
                break;
            }
            default:
                throw new Error(`Internal error: code "${code}" not implemented!`);
        }
    }
    return achievements_1._refresh_achievements(Object.assign({}, state, { engagement: EngagementState.enqueue(state.engagement, {
            type: EngagementState.EngagementType.flow,
            key: engagement_key,
        }, engagement_params), revision: state.revision + 1 }));
}
exports.attempt_to_redeem_code = attempt_to_redeem_code;
/////////////////////
//# sourceMappingURL=codes.js.map