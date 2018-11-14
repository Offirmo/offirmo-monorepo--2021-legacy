"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const state_progress_1 = require("@oh-my-rpg/state-progress");
const RichText = tslib_1.__importStar(require("@offirmo/rich-text-format"));
function render_achievement_snapshot_short(achievement_snapshot) {
    const { uuid, icon, name, status } = achievement_snapshot;
    const builder = RichText.inline_fragment()
        .addClass('achievement', `achievement--${status}`);
    let icon_text = '';
    let legend = '???';
    switch (status) {
        case state_progress_1.AchievementStatus.secret:
            throw new Error(`Secret achievements should never make it there!`);
        case state_progress_1.AchievementStatus.hidden:
            break;
        case state_progress_1.AchievementStatus.revealed:
            icon_text = '❔';
            legend = name;
            break;
        case state_progress_1.AchievementStatus.unlocked:
            icon_text = icon;
            legend = name + ' ★';
            break;
        default:
            throw new Error(`Unknown achievement status!`);
    }
    if (icon_text) {
        builder
            .pushText(icon_text)
            .pushText('  ');
    }
    if (status === state_progress_1.AchievementStatus.unlocked)
        builder.pushStrong(legend);
    else
        builder.pushWeak(legend);
    builder.addHints({ uuid });
    return builder.done();
}
exports.render_achievement_snapshot_short = render_achievement_snapshot_short;
function render_achievement_snapshot_detailed(achievement_snapshot) {
    const { uuid, icon, name, description, lore, status } = achievement_snapshot;
    const element_tags = ['achievement'];
    const builder = RichText.block_fragment()
        .addClass('achievement');
    let icon_text = null;
    let name_text = '???';
    let description_text = '???';
    let lore_text = null;
    switch (status) {
        case state_progress_1.AchievementStatus.secret:
            throw new Error(`Secret achievements should never make it there!`);
        case state_progress_1.AchievementStatus.hidden:
            description_text = '(this achievement is hidden at the moment. Try playing more!)';
            element_tags.push('hidden');
            break;
        case state_progress_1.AchievementStatus.revealed:
            element_tags.push('locked');
            icon_text = '❔';
            name_text = name;
            description_text = description;
            lore_text = lore;
            break;
        case state_progress_1.AchievementStatus.unlocked:
            element_tags.push('unlocked');
            icon_text = icon;
            name_text = name;
            description_text = description;
            lore_text = lore;
            break;
        default:
            throw new Error(`Unknown achievement status!`);
    }
    if (icon_text) {
        builder
            .pushText(icon_text)
            .pushText(' ');
    }
    builder
        .pushStrong(name_text, { classes: ['achievement__title'] })
        .pushHorizontalRule();
    /* TODO
    .pushWeak(element_tags.join(', '))
    .()*/
    builder
        .pushText(description_text)
        .pushLineBreak();
    if (lore_text) {
        builder
            .pushWeak(`“${lore_text}“`, { classes: ['achievement__lore'] })
            .pushLineBreak();
    }
    builder.addHints({ uuid });
    return builder.done();
}
exports.render_achievement_snapshot_detailed = render_achievement_snapshot_detailed;
function render_achievements_snapshot(ordered_achievement_snapshots) {
    const builder = RichText.unordered_list()
        .addClass('achievements-snapshot');
    ordered_achievement_snapshots.forEach((achievement_snapshot) => {
        const { uuid } = achievement_snapshot;
        console.log(uuid);
        builder.pushRawNode(render_achievement_snapshot_short(achievement_snapshot), { id: uuid });
    });
    const $doc_list = builder.done();
    const $doc = RichText.block_fragment()
        .pushNode(RichText.heading().pushText(`Achievements`).done(), { id: 'header' })
        .pushNode($doc_list, { id: 'list' })
        .done();
    //console.log('render_achievements_snapshot', ordered_achievement_snapshots, $doc)
    return $doc;
}
exports.render_achievements_snapshot = render_achievements_snapshot;
//# sourceMappingURL=achievements.js.map