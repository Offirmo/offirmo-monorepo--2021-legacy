import { Currency, State } from './types';
declare const ALL_CURRENCIES: Currency[];
declare function create(): Readonly<State>;
declare function add_amount(state: Readonly<State>, currency: Currency, amount: number): Readonly<State>;
declare function remove_amount(state: Readonly<State>, currency: Currency, amount: number): Readonly<State>;
declare function get_currency_amount(state: Readonly<State>, currency: Currency): number;
declare function iterables_currency(state: Readonly<State>): IterableIterator<"coin" | "token">;
export { ALL_CURRENCIES, create, add_amount, remove_amount, get_currency_amount, iterables_currency, };
