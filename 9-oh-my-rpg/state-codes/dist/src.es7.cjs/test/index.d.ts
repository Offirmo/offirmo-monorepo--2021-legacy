import { CodeSpec } from '../types';
interface CodesConditions {
    has_energy_depleted: boolean;
    good_play_count: number;
    is_alpha_player: boolean;
    is_player_since_alpha: boolean;
}
declare const ALL_CODESPECS: Readonly<CodeSpec<CodesConditions>>[];
declare const CODESPECS_BY_KEY: {
    [key: string]: Readonly<CodeSpec<CodesConditions>>;
};
export { CodesConditions, CODESPECS_BY_KEY, ALL_CODESPECS };
