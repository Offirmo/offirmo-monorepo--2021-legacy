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
                .pushNode(RichText.span().pushText(params.name || 'world').done(), 'name')
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
        default:
            throw new Error(`No engagement message for "${key}"!`);
    }
}
////////////////////////////////////
export { get_engagement_message, };
//# sourceMappingURL=messages.js.map