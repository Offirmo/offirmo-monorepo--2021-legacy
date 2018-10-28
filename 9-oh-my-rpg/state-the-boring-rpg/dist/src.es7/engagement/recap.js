import * as RichText from '@offirmo/rich-text-format';
function get_recap(state) {
    const isNewGame = (state.revision === 0);
    if (isNewGame) {
        return RichText.inline_fragment()
            .pushText('You are an ')
            .pushStrong('otherworlder')
            .pushText(', an adventurer from another world…{{br}}')
            .pushText('Congratulations, you were chosen to enter the unknown realm of ')
            .pushStrong('Jaema')
            .pushText('!{{br}}')
            .pushText('Maybe were you just more courageous, cunning and curious than your peers?{{br}}')
            .pushText('But for now, let’s go on an adventure, for glory ⚔ and loot 📦 💰 !')
            .done();
    }
    return RichText.block_fragment()
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
export { get_recap, };
//# sourceMappingURL=recap.js.map