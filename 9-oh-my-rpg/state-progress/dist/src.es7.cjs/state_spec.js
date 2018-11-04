"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const consts_1 = require("./consts");
const _1 = require(".");
const sec_1 = require("./sec");
describe('@oh-my-rpg/state-progress - reducer', function () {
    describe('🆕  initial state', function () {
        it('should have correct defaults', function () {
            const state = _1.create(sec_1.get_lib_SEC());
            chai_1.expect(state).to.deep.equal({
                schema_version: consts_1.SCHEMA_VERSION,
                revision: 0,
                flags: null,
                achievements: null,
                statistics: {
                    good_play_count: 0,
                    bad_play_count: 0,
                    encountered_adventures: {},
                    encountered_monsters: {},
                    good_play_count_by_active_class: {},
                    bad_play_count_by_active_class: {},
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
                });
                chai_1.expect(state).to.deep.equal({
                    schema_version: consts_1.SCHEMA_VERSION,
                    revision: 1,
                    flags: null,
                    achievements: null,
                    statistics: {
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
                        has_account: false,
                        is_registered_alpha_player: false,
                    }
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
                });
                chai_1.expect(state).to.deep.equal({
                    schema_version: consts_1.SCHEMA_VERSION,
                    revision: 1,
                    flags: null,
                    achievements: null,
                    statistics: {
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
                        has_account: false,
                        is_registered_alpha_player: false,
                    }
                });
                state = _1.on_played(state, {
                    good: true,
                    adventure_key: 'foo_adv',
                    encountered_monster_key: 'foo_mon',
                    active_class: 'foo',
                });
                chai_1.expect(state).to.deep.equal({
                    schema_version: consts_1.SCHEMA_VERSION,
                    revision: 2,
                    flags: null,
                    achievements: null,
                    statistics: {
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
                        has_account: false,
                        is_registered_alpha_player: false,
                    }
                });
            });
        });
    });
});
//# sourceMappingURL=state_spec.js.map