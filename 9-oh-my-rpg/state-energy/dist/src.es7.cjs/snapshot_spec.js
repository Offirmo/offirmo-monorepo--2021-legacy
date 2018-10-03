"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const utils_1 = require("./utils");
const _1 = require(".");
describe('@oh-my-rpg/state-energy - snapshot', function () {
    context('🆕  initial state', function () {
        it('should yield a correct snapshot', function () {
            const state = _1.create();
            const snapshot = _1.get_snapshot(state);
            chai_1.expect(snapshot).to.deep.equal({
                available_energy: 7,
                available_energy_float: 7.,
                total_energy_refilling_ratio: 1,
                next_energy_refilling_ratio: 1,
                human_time_to_next: '',
            });
        });
    });
    context('when fully depleted state', function () {
        context('depleted in one shot', function () {
            it('should yield a correct snapshot with 0', function () {
                let state = _1.create();
                state = _1.use_energy(state, 7);
                const snapshot = _1.get_snapshot(state);
                chai_1.expect(snapshot).to.deep.equal({
                    available_energy: 0,
                    available_energy_float: 0.,
                    total_energy_refilling_ratio: 0,
                    next_energy_refilling_ratio: 0.,
                    human_time_to_next: '3h25',
                });
            });
        });
        context('depleted in consecutive shots', function () {
            it('should yield a correct snapshot with 0', function () {
                let state = _1.create();
                state = _1.use_energy(state, 1);
                state = _1.use_energy(state, 1);
                state = _1.use_energy(state, 1);
                state = _1.use_energy(state, 1);
                state = _1.use_energy(state, 1);
                state = _1.use_energy(state, 1);
                state = _1.use_energy(state, 1);
                const snapshot = _1.get_snapshot(state);
                chai_1.expect(snapshot).to.deep.equal({
                    available_energy: 0,
                    available_energy_float: 0.,
                    total_energy_refilling_ratio: 0,
                    next_energy_refilling_ratio: 0.,
                    human_time_to_next: '3h25',
                });
            });
        });
    });
    context('when intermediate state', function () {
        it('should yield a correct snapshot', function () {
            let state = _1.create();
            state = _1.use_energy(state, 1);
            state = _1.use_energy(state, 1);
            state = _1.use_energy(state, 1);
            const snapshot = _1.get_snapshot(state);
            chai_1.expect(snapshot).to.deep.equal({
                available_energy: 4,
                available_energy_float: 4.,
                total_energy_refilling_ratio: utils_1.round_float(4 / 7.),
                next_energy_refilling_ratio: 0.,
                human_time_to_next: '3h25',
            });
        });
    });
});
//# sourceMappingURL=snapshot_spec.js.map