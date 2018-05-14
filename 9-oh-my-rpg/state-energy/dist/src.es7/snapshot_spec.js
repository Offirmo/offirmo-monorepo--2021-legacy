import { expect } from 'chai';
import { round_float } from './utils';
import { create, use_energy, get_snapshot, } from '.';
describe('snapshot', function () {
    context('🆕  initial state', function () {
        it('should yield a correct snapshot', function () {
            const state = create();
            const snapshot = get_snapshot(state);
            expect(snapshot).to.deep.equal({
                available_energy: 7,
                available_energy_float: 7.,
                human_time_to_next: '',
                total_energy_refilling_ratio: 1,
            });
        });
    });
    context('when fully depleted state', function () {
        context('depleted in one shot', function () {
            it('should yield a correct snapshot with 0', function () {
                let state = create();
                state = use_energy(state, 7);
                const snapshot = get_snapshot(state);
                expect(snapshot).to.deep.equal({
                    available_energy: 0,
                    available_energy_float: 0.,
                    human_time_to_next: '',
                    total_energy_refilling_ratio: 0,
                });
            });
        });
        context('depleted in consecutive shots', function () {
            it('should yield a correct snapshot with 0', function () {
                let state = create();
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                const snapshot = get_snapshot(state);
                expect(snapshot).to.deep.equal({
                    available_energy: 0,
                    available_energy_float: 0.,
                    human_time_to_next: '',
                    total_energy_refilling_ratio: 0,
                });
            });
        });
    });
    context('when intermediate state', function () {
        it('should yield a correct snapshot', function () {
            let state = create();
            state = use_energy(state, 1);
            state = use_energy(state, 1);
            state = use_energy(state, 1);
            const snapshot = get_snapshot(state);
            expect(snapshot).to.deep.equal({
                available_energy: 4,
                available_energy_float: 4.,
                human_time_to_next: '',
                total_energy_refilling_ratio: round_float(4 / 7.),
            });
        });
    });
});
//# sourceMappingURL=snapshot_spec.js.map