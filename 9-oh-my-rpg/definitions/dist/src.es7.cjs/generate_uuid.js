"use strict";
/////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
const nanoid = require("nanoid");
const format = require("nanoid/format");
const url = require("nanoid/url");
const random_1 = require("@offirmo/random");
///////
const UUID_RADIX = 'uu1';
const NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES = 21; // according to the doc
const UUID_LENGTH = UUID_RADIX.length + NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES;
exports.UUID_LENGTH = UUID_LENGTH;
function generate_uuid({ length = NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES, rng } = {}) {
    return UUID_RADIX + (rng
        ? format((size) => {
            let result = [];
            const gen = random_1.Random.integer(0, 255);
            for (let i = 0; i < size; i++)
                result.push(gen(rng));
            return result;
        }, url, length)
        : nanoid(length));
}
exports.generate_uuid = generate_uuid;
/////////////////////
//# sourceMappingURL=generate_uuid.js.map