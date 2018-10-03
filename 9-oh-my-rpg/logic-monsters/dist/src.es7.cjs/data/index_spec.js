"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
describe('@oh-my-rpg/logic-monsters - data:', function () {
    it('should have all the expected monsters', () => {
        chai_1.expect(_1.ENTRIES).to.have.lengthOf(76);
    });
});
//# sourceMappingURL=index_spec.js.map