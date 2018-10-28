import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps';
interface CodesConditions {
    has_energy_depleted: boolean;
    good_play_count: number;
    is_alpha_player: boolean;
    is_player_since_alpha: boolean;
}
interface Code {
    key: string;
    code: string;
    redeem_limit: number | null;
    is_redeemable: (state: Readonly<State>, infos: Readonly<CodesConditions>) => boolean;
    redemption_success_message?: string;
}
interface CodeRedemption {
    redeem_count: number;
    last_redeem_date_minutes: HumanReadableTimestampUTCMinutes;
}
interface State {
    schema_version: number;
    revision: number;
    redeemed_codes: {
        [key: string]: CodeRedemption;
    };
}
export { CodesConditions, Code, CodeRedemption, State, };
