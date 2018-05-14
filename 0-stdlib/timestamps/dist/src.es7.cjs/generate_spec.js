"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
describe('@offirmo/timestamps', function () {
    describe('get_UTC_timestamp_ms()', function () {
        it('should return correct UTC unix timestamps in ms', function () {
            for (let i = 0; i < 10; ++i) {
                const stamp = _1.get_UTC_timestamp_ms();
                console.log(stamp);
                chai_1.expect(stamp).to.be.a('number');
                chai_1.expect(stamp).to.be.within(1510177449000, // 2017
                4665851049000 // 2117
                );
            }
        });
    });
    describe('get_human_readable_UTC_timestamp_ms_v1()', function () {
        it('should return correct UTC timestamps', function () {
            for (let i = 0; i < 10; ++i) {
                const stamp = _1.get_human_readable_UTC_timestamp_ms_v1();
                console.log(stamp);
                chai_1.expect(stamp).to.be.a('string');
            }
        });
    });
    describe('get_human_readable_UTC_timestamp_ms()', function () {
        it('should return correct UTC timestamps up to the millisecond', function () {
            for (let i = 0; i < 10; ++i) {
                const stamp = _1.get_human_readable_UTC_timestamp_ms();
                console.log(stamp);
                chai_1.expect(stamp).to.be.a('string');
            }
        });
    });
    describe('get_human_readable_UTC_timestamp_minutes()', function () {
        it('should return correct UTC timestamps up to the minute', function () {
            for (let i = 0; i < 10; ++i) {
                const stamp = _1.get_human_readable_UTC_timestamp_minutes();
                console.log(stamp);
                chai_1.expect(stamp).to.be.a('string');
            }
        });
    });
});
//# sourceMappingURL=generate_spec.js.map