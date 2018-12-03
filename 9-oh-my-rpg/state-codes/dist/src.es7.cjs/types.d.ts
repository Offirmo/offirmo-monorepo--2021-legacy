import { HumanReadableTimestampUTCMinutes } from '@offirmo/timestamps';
interface CodeSpec<T> {
    code: string;
    redeem_limit: number | null;
    is_redeemable: (infos: Readonly<T>, state: Readonly<State>) => boolean;
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
export { CodeSpec, CodeRedemption, State, };
