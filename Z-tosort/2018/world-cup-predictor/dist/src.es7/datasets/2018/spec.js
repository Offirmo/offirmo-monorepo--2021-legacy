import { expect } from 'chai';
import { Enum } from 'typescript-string-enums';
import { Team } from '../../types';
import { FIFA_RANKING } from '.';
describe('dataset 2018', function () {
    describe('FIFA ranking', function () {
        it('should cover all teams', () => {
            Enum.keys(Team).forEach(team => {
                expect(FIFA_RANKING[team], team).to.be.a('number');
            });
        });
    });
});
//# sourceMappingURL=spec.js.map