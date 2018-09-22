"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
//declare const console: any
describe('@offirmo/timestamps', function () {
    describe('parse_human_readable_UTC_timestamp_ms()', function () {
        it('should correctly parse corresponding timestamps', function () {
            for (let i = 0; i < 10; ++i) {
                const date = new Date(1510177449000 + i * 1000000000);
                date.setMilliseconds(i * 100 + i * 10 + i);
                const stamp = _1.get_human_readable_UTC_timestamp_ms(date);
                //console.log(stamp)
                const date_back = _1.parse_human_readable_UTC_timestamp_ms(stamp);
                chai_1.expect(date_back).to.deep.equal(date);
            }
        });
    });
});
//# sourceMappingURL=parse_spec.js.map