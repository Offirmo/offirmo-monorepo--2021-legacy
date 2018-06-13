"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typescript_string_enums_1 = require("typescript-string-enums");
const types_1 = require("./types");
describe('types', function () {
    describe('Team', function () {
        it('should match the inputs', () => {
            [
                'Russia',
                'Germany',
                'Brazil',
                'Portugal',
                'Argentina',
                'Belgium',
                'Poland',
                'France',
                'Spain',
                'Peru',
                'Switzerland',
                'England',
                'Colombia',
                'Mexico',
                'Uruguay',
                'Croatia',
                'Denmark',
                'Iceland',
                'Costa Rica',
                'Sweden',
                'Tunisia',
                'Egypt',
                'Senegal',
                'Iran',
                'Serbia',
                'Nigeria',
                'Australia',
                'Japan',
                'Morocco',
                'Panama',
                'South Korea',
                'Saudi Arabia',
            ].forEach(teamStr => {
                chai_1.expect(typescript_string_enums_1.Enum.isType(types_1.Team, teamStr), teamStr).to.be.true;
            });
        });
    });
});
//# sourceMappingURL=types_spec.js.map