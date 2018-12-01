import { State as WalletState, Currency } from '@oh-my-rpg/state-wallet';
import * as RichText from '@offirmo/rich-text-format';
declare function render_currency_amount(currency: Currency, amount: number): RichText.Document;
declare function render_wallet(wallet: Readonly<WalletState>): RichText.Document;
export { render_currency_amount, render_wallet, };
