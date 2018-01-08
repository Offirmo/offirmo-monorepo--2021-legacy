"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const RichText = require("@offirmo/rich-text-format");
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const { rich_text_to_ansi } = require('../../../the-npm-rpg/src/utils/rich_text_to_ansi');
const _1 = require(".");
describe('💰  wallet rendering', function () {
    context('when empty', function () {
        it('should render properly', () => {
            let wallet = state_wallet_1.create();
            const $doc = _1.render_wallet(wallet);
            const str = RichText.to_text($doc);
            chai_1.expect(str).to.be.a('string');
            chai_1.expect(str).to.contain(' 0 coins');
            chai_1.expect(str).to.contain(' 0 tokens');
        });
    });
    context('when not empty', function () {
        it('should render properly', () => {
            let wallet = state_wallet_1.create();
            wallet = state_wallet_1.add_amount(wallet, state_wallet_1.Currency.coin, 12345);
            wallet = state_wallet_1.add_amount(wallet, state_wallet_1.Currency.token, 67);
            const $doc = _1.render_wallet(wallet);
            const str = RichText.to_text($doc);
            chai_1.expect(str).to.be.a('string');
            chai_1.expect(str).not.to.contain('0');
            chai_1.expect(str).to.contain(' 12345 coins');
            chai_1.expect(str).to.contain(' 67 tokens');
        });
    });
    describe('demo', function () {
        it('shows off', () => {
            const $doc = _1.render_wallet(state_wallet_1.DEMO_STATE);
            console.log(rich_text_to_ansi($doc));
        });
    });
});
//# sourceMappingURL=wallet_spec.js.map