import { MT19937 } from '@offirmo/random';
interface MTEngineWithSeed extends MT19937 {
    _seed?: number;
}
interface State {
    schema_version: number;
    revision: number;
    seed: number;
    use_count: number;
    recently_encountered_by_id: {
        [k: string]: Array<string | number>;
    };
}
export { MTEngineWithSeed, State };
