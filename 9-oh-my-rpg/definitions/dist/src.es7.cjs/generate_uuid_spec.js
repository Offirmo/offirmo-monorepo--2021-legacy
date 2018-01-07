"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const random_1 = require("@offirmo/random");
const _1 = require(".");
describe('generate_uuid()', function () {
    context('when provided a random generator', function () {
        it('should return correct uuids', function () {
            const rng = random_1.Random.engines.mt19937().seed(123);
            for (let i = 0; i < 10; ++i) {
                const uuid = _1.generate_uuid({ rng });
                console.log(uuid);
                chai_1.expect(uuid).to.be.a('string');
                chai_1.expect(uuid).to.have.lengthOf(_1.UUID_LENGTH);
                chai_1.expect(uuid.startsWith(('uu1'))).to.be.true;
            }
        });
    });
    context('when NOT provided a random generator', function () {
        it('should return correct uuids', function () {
            for (let i = 0; i < 10; ++i) {
                const uuid = _1.generate_uuid();
                console.log(uuid);
                chai_1.expect(uuid).to.be.a('string');
                chai_1.expect(uuid).to.have.lengthOf(_1.UUID_LENGTH);
                chai_1.expect(uuid.startsWith(('uu1'))).to.be.true;
            }
        });
    });
});
//# sourceMappingURL=generate_uuid_spec.js.map