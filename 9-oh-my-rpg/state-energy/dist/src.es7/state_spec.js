import { expect } from 'chai';
import { SCHEMA_VERSION } from './consts';
import { create, use_energy, get_snapshot, } from '.';
import { get_human_readable_UTC_timestamp_ms } from '@offirmo/timestamps';
describe('state reducer', function () {
    describe('🆕  initial state', function () {
        it('should have correct defaults', function () {
            let state = create();
            expect(state).to.deep.equal({
                schema_version: SCHEMA_VERSION,
                revision: 0,
                max_energy: 7,
                base_energy_refilling_rate_per_day: 7,
                last_date: 'ts1_19700101_00h00:00.000',
                last_available_energy_float: 7.,
            });
        });
    });
    describe('energy usage', function () {
        context('when having enough energy', function () {
            it('should decrement energy correctly', function () {
                let state = create();
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                const snapshot = get_snapshot(state);
                expect(snapshot.available_energy).to.equal(4);
            });
            it('should memorize the usage', function () {
                let state = create();
                const date = new Date();
                state = use_energy(state, 1, date);
                state = use_energy(state, 2, date);
                state = use_energy(state, 3, date);
                expect(state.last_available_energy_float).to.equal(1);
                expect(state.last_date).to.equal(get_human_readable_UTC_timestamp_ms(date));
            });
            it('should discard irrelevant usages if any', function () {
                let state = create();
                // outdated usages
                state = use_energy(state, 4, new Date(2017, 1, 1));
                state = use_energy(state, 4, new Date(2017, 1, 2));
                state = use_energy(state, 4, new Date(2017, 1, 3));
                state = use_energy(state, 4, new Date(2017, 1, 4));
                state = use_energy(state, 4, new Date(2017, 1, 5));
                state = use_energy(state, 4, new Date(2017, 1, 6));
                state = use_energy(state, 4, new Date(2017, 1, 7));
                // now let's do it
                state = use_energy(state, 1, new Date(Date.UTC(2018, 1, 1, 1)));
                state = use_energy(state, 1, new Date(Date.UTC(2018, 1, 1, 2)));
                state = use_energy(state, 1, new Date(Date.UTC(2018, 1, 1, 3)));
                expect(get_snapshot(state, new Date(Date.UTC(2018, 1, 1, 3))).available_energy).to.equal(4);
                expect(state.last_available_energy_float).to.be.above(4.);
                expect(state.last_available_energy_float).to.be.below(5.);
                expect(state.last_date).to.equal('ts1_20180201_03h00:00.000');
            });
        });
        context('when not having enough energy', function () {
            it('should throw', function () {
                let state = create();
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                state = use_energy(state, 1);
                expect(() => use_energy(state, 1)).to.throw('not enough energy');
            });
        });
    });
    describe('energy limitations', function () {
        it('should not allow playing more than X times in 24 hours - case 1', function () {
            let state = create();
            // all at once
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            // not yet
            expect(get_snapshot(state, new Date(2017, 1, 1, 23)).available_energy).to.be.below(7);
            // 24h elapsed
            expect(get_snapshot(state, new Date(2017, 1, 2, 0)).available_energy).to.equal(7);
        });
        it('should not allow playing more than X times in 24 hours - case 2', function () {
            let state = create();
            // time to time but less than full reload
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 1));
            state = use_energy(state, 1, new Date(2017, 1, 1, 2));
            state = use_energy(state, 1, new Date(2017, 1, 1, 5));
            state = use_energy(state, 1, new Date(2017, 1, 1, 6));
            state = use_energy(state, 1, new Date(2017, 1, 1, 9));
            state = use_energy(state, 1, new Date(2017, 1, 1, 10));
            // not yet
            expect(get_snapshot(state, new Date(2017, 1, 1, 23)).available_energy).to.be.below(7);
            // 24h elapsed +1min for rounding reasons
            expect(get_snapshot(state, new Date(2017, 1, 2, 0, 1)).available_energy).to.equal(7);
        });
        it('should not allow playing more than X times in 24 hours - case 3', function () {
            let state = create();
            // inefficient play, last one too late
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 3, 30));
            state = use_energy(state, 1, new Date(2017, 1, 1, 7));
            state = use_energy(state, 1, new Date(2017, 1, 1, 10, 30));
            state = use_energy(state, 1, new Date(2017, 1, 1, 14));
            state = use_energy(state, 1, new Date(2017, 1, 1, 17, 30));
            state = use_energy(state, 1, new Date(2017, 1, 1, 21));
            // not yet
            expect(get_snapshot(state, new Date(2017, 1, 1, 23)).available_energy).to.be.below(7);
            // 24h elapsed
            expect(get_snapshot(state, new Date(2017, 1, 2, 0)).available_energy).to.be.below(7);
        });
    });
    describe('exploit', function () {
        // case 1 = a wrong implementation I did first
        it('should not be allowed - case 1', function () {
            let state = create();
            // burst to 0
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            state = use_energy(state, 1, new Date(2017, 1, 1, 0));
            // the play as soon as energy is restored, 7 times
            state = use_energy(state, 1, new Date(2017, 1, 1, 3, 30));
            state = use_energy(state, 1, new Date(2017, 1, 1, 7));
            state = use_energy(state, 1, new Date(2017, 1, 1, 10, 30));
            state = use_energy(state, 1, new Date(2017, 1, 1, 14));
            state = use_energy(state, 1, new Date(2017, 1, 1, 17, 30));
            state = use_energy(state, 1, new Date(2017, 1, 1, 21));
            state = use_energy(state, 1, new Date(2017, 1, 2, 0, 30));
            // bingo, energy is at 7 again
            expect(get_snapshot(state, new Date(2017, 1, 2, 4)).available_energy).to.be.below(7);
        });
    });
});
//# sourceMappingURL=state_spec.js.map