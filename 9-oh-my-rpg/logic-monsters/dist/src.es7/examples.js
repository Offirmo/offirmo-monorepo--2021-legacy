/////////////////////
import { Random } from '@offirmo/random';
import { create } from './state';
import { MonsterRank, } from './types';
/////////////////////
const DEMO_MONSTER_01 = {
    name: 'chicken',
    level: 7,
    rank: MonsterRank.elite,
    possible_emoji: '🐓',
};
// for demo purpose, all attributes having the same probability + also random enhancement level
function generate_random_demo_monster() {
    const rng = Random.engines.mt19937().autoSeed();
    return create(rng);
}
/////////////////////
export { DEMO_MONSTER_01, generate_random_demo_monster, };
/////////////////////
//# sourceMappingURL=examples.js.map