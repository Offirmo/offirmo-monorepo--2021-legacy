import { iterateOverPossibleCases, } from '../../helpers/test';
import predict from '.';
describe('FIFA world cup 2018 predictor mk1', function () {
    context('when used on random data', () => {
        it('should return one of the teams or draw in Group stage', function () {
            this.timeout(5000);
            iterateOverPossibleCases(predict, ({ debugId, result }) => {
                //console.log(debugId, '=', result.winner)
            });
        });
    });
});
//# sourceMappingURL=spec.js.map