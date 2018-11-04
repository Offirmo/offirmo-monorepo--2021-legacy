"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const state_wallet_1 = require("@oh-my-rpg/state-wallet");
const { rich_text_to_ansi } = require('../../../../apps/the-boring-rpg-node/src/services/rich_text_to_ansi');
const _1 = require(".");
describe('🔠  view to @offirmo/rich-text-format - wallet', function () {
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
            //console.log(prettify_json($doc))
            const str = rich_text_to_ansi($doc);
            // should just not throw
        });
    });
});
//# sourceMappingURL=wallet_spec.js.map