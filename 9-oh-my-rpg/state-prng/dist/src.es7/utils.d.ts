import { State } from './types';
declare function generate_random_seed(): number;
interface RegenerateParams {
    id: string;
    generate: () => number | string;
    state: State;
    max_tries?: number;
}
declare function regenerate_until_not_recently_encountered({ id, generate, state, max_tries, }: RegenerateParams): string | number;
export { generate_random_seed, RegenerateParams, regenerate_until_not_recently_encountered, };
