import { Engine } from '@offirmo/random';
import { UUID } from './types';
declare const UUID_LENGTH: number;
declare function generate_uuid({length, rng}?: {
    length?: number;
    rng?: Engine;
}): UUID;
export { UUID_LENGTH, generate_uuid };
