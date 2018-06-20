/////////////////////
// TODO move to separate file
import nanoid from 'nanoid';
import format from 'nanoid/format';
import url from 'nanoid/url';
import { Random } from '@offirmo/random';
///////
const UUID_RADIX = 'uu1';
const NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES = 21; // according to the doc
const UUID_LENGTH = UUID_RADIX.length + NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES;
// TODO externalize!
function generate_uuid({ length = NANOID_LENGTH_FOR_1BTH_COLLISION_CHANCES, rng } = {}) {
    return UUID_RADIX + (rng
        ? format((size) => {
            let result = [];
            const gen = Random.integer(0, 255);
            for (let i = 0; i < size; i++)
                result.push(gen(rng));
            return result;
        }, url, length)
        : nanoid(length));
}
/////////////////////
export { UUID_LENGTH, generate_uuid, };
/////////////////////
//# sourceMappingURL=generate.js.map