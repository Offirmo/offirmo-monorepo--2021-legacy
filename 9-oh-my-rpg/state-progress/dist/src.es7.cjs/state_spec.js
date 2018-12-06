"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const sinon_1 = tslib_1.__importDefault(require("sinon"));
const consts_1 = require("./consts");
const _1 = require(".");
const sec_1 = require("./sec");
describe('@oh-my-rpg/state-progress - reducer', function () {
    beforeEach(function () {
        this.clock = sinon_1.default.useFakeTimers(); // needed to have a reproducible timestamp
    });
    describe('🆕  initial state', function () {
        it('should have correct defaults', function () {
            let state = _1.create(sec_1.get_lib_SEC());
            chai_1.expect(state.statistics.last_visited_timestamp).to.have.lengthOf(8);
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                wiki: null,
                flags: null,
                achievements: {},
                statistics: {
                    last_visited_timestamp: "19700101",
                    active_day_count: 1,
                    good_play_count: 0,
                    bad_play_count: 0,
                    encountered_adventures: {},
                    encountered_monsters: {},
                    good_play_count_by_active_class: {},
                    bad_play_count_by_active_class: {},
                    coins_gained: 0,
                    tokens_gained: 0,
                    items_gained: 0,
                    has_account: false,
                    is_registered_alpha_player: false,
                }
            });
        });
    });
    describe('on_played', function () {
        context('bad', function () {
            it('should correct updates relevant values', function () {
                let state = _1.create(sec_1.get_lib_SEC());
                state = _1.on_played(state, {
                    good: false,
                    adventure_key: 'foo_adv',
                    encountered_monster_key: null,
                    active_class: 'foo',
                    coins_gained: 12,
                    tokens_gained: 34,
                    items_gained: 56,
                });
                chai_1.expect(state.statistics).to.deep.equal({
                    last_visited_timestamp: "19700101",
                    active_day_count: 1,
                    good_play_count: 0,
                    bad_play_count: 1,
                    encountered_adventures: {
                        'foo_adv': true,
                    },
                    encountered_monsters: {},
                    good_play_count_by_active_class: {},
                    bad_play_count_by_active_class: {
                        'foo': 1,
                    },
                    coins_gained: 12,
                    tokens_gained: 34,
                    items_gained: 56,
                    has_account: false,
                    is_registered_alpha_player: false,
                });
            });
        });
        context('good', function () {
            it('should correct updates relevant values', function () {
                let state = _1.create(sec_1.get_lib_SEC());
                state = _1.on_played(state, {
                    good: true,
                    adventure_key: 'foo_adv',
                    encountered_monster_key: null,
                    active_class: 'foo',
                    coins_gained: 12,
                    tokens_gained: 34,
                    items_gained: 56,
                });
                chai_1.expect(state.statistics).to.deep.equal({
                    last_visited_timestamp: "19700101",
                    active_day_count: 1,
                    good_play_count: 1,
                    bad_play_count: 0,
                    encountered_adventures: {
                        'foo_adv': true,
                    },
                    encountered_monsters: {},
                    good_play_count_by_active_class: {
                        'foo': 1,
                    },
                    bad_play_count_by_active_class: {},
                    coins_gained: 12,
                    tokens_gained: 34,
                    items_gained: 56,
                    has_account: false,
                    is_registered_alpha_player: false,
                });
                state = _1.on_played(state, {
                    good: true,
                    adventure_key: 'foo_adv',
                    encountered_monster_key: 'foo_mon',
                    active_class: 'foo',
                    coins_gained: 12,
                    tokens_gained: 34,
                    items_gained: 56,
                });
                chai_1.expect(state.statistics).to.deep.equal({
                    last_visited_timestamp: "19700101",
                    active_day_count: 1,
                    good_play_count: 2,
                    bad_play_count: 0,
                    encountered_adventures: {
                        'foo_adv': true,
                    },
                    encountered_monsters: {
                        'foo_mon': true,
                    },
                    good_play_count_by_active_class: {
                        'foo': 2,
                    },
                    bad_play_count_by_active_class: {},
                    coins_gained: 24,
                    tokens_gained: 68,
                    items_gained: 112,
                    has_account: false,
                    is_registered_alpha_player: false,
                });
            });
        });
    });
    describe('on_achieved', function () {
        it('should correct updates relevant values', function () {
            let state = _1.create(sec_1.get_lib_SEC());
            state = _1.on_achieved(state, 'foo', _1.AchievementStatus.revealed);
            chai_1.expect(state.achievements).to.deep.equal({
                foo: _1.AchievementStatus.revealed,
            });
            state = _1.on_achieved(state, 'bar', _1.AchievementStatus.revealed);
            state = _1.on_achieved(state, 'foo', _1.AchievementStatus.unlocked);
            chai_1.expect(state.achievements).to.deep.equal({
                bar: _1.AchievementStatus.revealed,
                foo: _1.AchievementStatus.unlocked,
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map