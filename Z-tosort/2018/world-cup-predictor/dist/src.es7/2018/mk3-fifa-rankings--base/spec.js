import { expect } from 'chai';
import { RoundType, Team } from '../../types';
import { iterateXTimes, iterateOverPossibleCases, } from '../../helpers/test';
import predict from '.';
describe('FIFA world cup 2018 predictor mk3', function () {
    context('when used on random data', () => {
        it('should return one of the teams or draw in Group stage', function () {
            this.timeout(5000);
            iterateOverPossibleCases(predict, ({ debugId, result }) => {
                //console.log(debugId, '=', result.winner)
            });
        });
    });
    context('when used on 2014 data', () => {
    });
    context('when used on 2018 data', () => {
        it('should correctly predict the opening match', () => {
            const request = {
                round: RoundType.Group,
                match: 1,
                team1: Team.Russia,
                team2: Team['Saudi Arabia'],
                results: [],
            };
            iterateXTimes((iteration) => {
                const result = predict(request);
                expect(result.winner, `#${iteration}`).to.equal(Team.Russia);
            });
        });
    });
});
//# sourceMappingURL=spec.js.map