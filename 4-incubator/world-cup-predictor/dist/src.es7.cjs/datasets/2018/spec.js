"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const typescript_string_enums_1 = require("typescript-string-enums");
const types_1 = require("../../types");
const _1 = require(".");
describe('dataset 2018', function () {
    describe('FIFA ranking', function () {
        it('should cover all teams', () => {
            typescript_string_enums_1.Enum.keys(types_1.Team).forEach(team => {
                chai_1.expect(_1.FIFA_RANKING[team], team).to.be.a('number');
            });
        });
    });
});
//# sourceMappingURL=spec.js.map