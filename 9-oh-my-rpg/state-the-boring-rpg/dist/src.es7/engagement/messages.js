import * as RichText from '@offirmo/rich-text-format';
import { EngagementKey, } from './types';
function get_engagement_message(state, pe) {
    const { engagement: { key }, params } = pe;
    switch (key) {
        case EngagementKey['hello_world--flow']:
        case EngagementKey['hello_world--aside']:
        case EngagementKey['hello_world--warning']:
            return RichText.block_fragment()
                .pushText('[TEST] Hello, ')
                .pushInlineFragment(params.name || 'world', { id: 'name' })
                .pushText('!')
                .done();
        case EngagementKey['tip--first_play']:
            return RichText.block_fragment()
                .pushStrong('Tip: ')
                .pushText('Select ')
                .pushStrong('play')
                .pushText(' to start adventuring!')
                .done();
        case EngagementKey['code_redemption--failed']:
            return RichText.block_fragment()
                .pushStrong('Error: This code is either non-existing or non redeemable at the moment.')
                .done();
        case EngagementKey['code_redemption--succeeded']:
            return RichText.block_fragment()
                .pushStrong('Code successfully redeemed.')
                .done();
        case EngagementKey['achievement-unlocked']:
            return RichText.block_fragment()
                .pushStrong(`🏆 Achievement unlocked:`)
                .pushLineBreak()
                .pushText(`“${params.icon} ${params.name}“`)
                .done();
        default:
            throw new Error(`Missing engagement message for "${key}"! (not implemented?)`);
    }
}
////////////////////////////////////
export { get_engagement_message, };
//# sourceMappingURL=messages.js.map