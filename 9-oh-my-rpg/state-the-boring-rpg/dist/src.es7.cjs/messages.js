"use strict";
// TODO move outside? tbrpg-engagement?
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
function get_recap(state) {
    const isNewGame = (state.meaningful_interaction_count === 0);
    if (isNewGame) {
        return RichText.section()
            .pushStrong('You are an otherworlder.{{br}}')
            .pushText('Congratulations, adventurer from another world!{{br}}')
            .pushText('You were chosen to enter the unknown realm of ')
            .pushStrong('Jaema')
            .pushText('.{{br}}')
            .pushText('Maybe were you just more courageous, cunning and curious than your peers?{{br}}')
            .pushText('But for now, let’s go on an adventure, for glory ⚔ and loot 📦 💰 !')
            .done();
    }
    return RichText.section()
        .pushText('You are ')
        .pushNode(RichText.span().addClass('avatar__name').pushText(state.avatar.name).done(), 'name')
        .pushText(', the ')
        .pushNode(RichText.span().addClass('avatar__class').pushText(state.avatar.klass).done(), 'class')
        .pushText(' from another world.{{br}}')
        .pushText('You are adventuring in the mysterious world of ')
        .pushStrong('Jaema')
        .pushText('…{{br}}')
        .pushStrong('For glory ⚔  and loot 📦 💰 !')
        .done();
}
exports.get_recap = get_recap;
function get_tip(state) {
    const hasEverPlayed = !!state.click_count;
    if (!hasEverPlayed)
        return RichText.section()
            .pushStrong('Tip: ')
            .pushText('Select ')
            .pushStrong('play')
            .pushText(' to start adventuring!')
            .done();
    // TODO suggest changing name
    // TODO suggest changing class
    return null;
}
exports.get_tip = get_tip;
//# sourceMappingURL=messages.js.map