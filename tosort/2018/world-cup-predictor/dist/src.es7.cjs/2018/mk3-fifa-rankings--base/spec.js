"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const types_1 = require("../../types");
const test_1 = require("../../helpers/test");
const _1 = tslib_1.__importDefault(require("."));
describe('FIFA world cup 2018 predictor mk3', function () {
    context('when used on random data', () => {
        it('should return one of the teams or draw in Group stage', function () {
            this.timeout(5000);
            test_1.iterateOverPossibleCases(_1.default, ({ debugId, result }) => {
                //console.log(debugId, '=', result.winner)
            });
        });
    });
    context('when used on 2014 data', () => {
    });
    context('when used on 2018 data', () => {
        it('should correctly predict the opening match', () => {
            const request = {
                round: types_1.RoundType.Group,
                match: 1,
                team1: types_1.Team.Russia,
                team2: types_1.Team['Saudi Arabia'],
                results: [],
            };
            test_1.iterateXTimes((iteration) => {
                const result = _1.default(request);
                chai_1.expect(result.winner, `#${iteration}`).to.equal(types_1.Team.Russia);
            });
        });
    });
});
//# sourceMappingURL=spec.js.map