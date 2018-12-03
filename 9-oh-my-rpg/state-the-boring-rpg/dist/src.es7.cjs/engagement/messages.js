"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
const types_1 = require("./types");
function get_engagement_message(state, pe) {
    const { engagement: { key }, params } = pe;
    switch (key) {
        case types_1.EngagementKey['just-some-text']:
            return RichText.block_fragment()
                .pushText(params.text)
                .done();
        case types_1.EngagementKey['hello_world--flow']:
        case types_1.EngagementKey['hello_world--aside']:
        case types_1.EngagementKey['hello_world--warning']:
            return RichText.block_fragment()
                .pushText('[TEST] Hello, ')
                .pushInlineFragment(params.name || 'world', { id: 'name' })
                .pushText('!')
                .done();
        case types_1.EngagementKey['tip--first_play']:
            return RichText.block_fragment()
                .pushStrong('Tip: ')
                .pushText('Select ')
                .pushStrong('play')
                .pushText(' to start adventuring!')
                .done();
        case types_1.EngagementKey['code_redemption--failed']:
            return RichText.block_fragment()
                .pushStrong('Error: This code is either non-existing or non redeemable at the moment.')
                .done();
        case types_1.EngagementKey['code_redemption--succeeded']:
            return RichText.block_fragment()
                .pushWeak('Code successfully redeemed.')
                .done();
        case types_1.EngagementKey['achievement-unlocked']:
            return RichText.block_fragment()
                .pushStrong(`🏆 Achievement unlocked:`)
                .pushLineBreak()
                .pushText(`“${params.icon} ${params.name}“`)
                .done();
        default:
            throw new Error(`Missing engagement message for "${key}"! (not implemented?)`);
    }
}
exports.get_engagement_message = get_engagement_message;
//# sourceMappingURL=messages.js.map