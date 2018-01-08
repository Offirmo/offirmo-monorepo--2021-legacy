import { Enum } from 'typescript-string-enums';
declare const Currency: {
    coin: "coin";
    token: "token";
};
declare type Currency = Enum<typeof Currency>;
interface State {
    schema_version: number;
    revision: number;
    coin_count: number;
    token_count: number;
}
export { Currency, State };
