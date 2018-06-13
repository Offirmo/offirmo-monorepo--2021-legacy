"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const test_1 = require("../../helpers/test");
const _1 = tslib_1.__importDefault(require("."));
describe('FIFA world cup 2018 predictor mk2', function () {
    context('when used on random data', () => {
        it('should return one of the teams or draw in Group stage', function () {
            this.timeout(5000);
            test_1.iterateOverPossibleCases(_1.default, ({ debugId, result }) => {
                //console.log(debugId, '=', result.winner)
            });
        });
    });
});
//# sourceMappingURL=spec.js.map