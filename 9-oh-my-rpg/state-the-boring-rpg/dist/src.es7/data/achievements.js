import { AchievementStatus } from '@oh-my-rpg/state-progress';
import { CharacterClass, DEFAULT_AVATAR_NAME } from '@oh-my-rpg/state-character';
/*
🍪🎂🏴🏳
📦💰
🥇🥈🥉
🎖🏆🏅
👑🎓
 */
const RAW_ENTRIES = [
    {
        icon: '🍪',
        name: 'TEST',
        description: 'This secret achievement can only be obtained through debug commands, to test the achievements system.',
        lore: '…and a piece of lore should appear here',
        get_status: (state) => state.progress.achievements['TEST'] === undefined || state.progress.achievements['TEST'] === AchievementStatus.secret
            ? AchievementStatus.secret // keep it secret
            : AchievementStatus.unlocked,
    },
    // Intro
    {
        icon: '✨',
        name: 'Summoned',
        description: 'You began your adventures in another world.',
        lore: 'Thanks for visiting!',
        get_status: () => AchievementStatus.unlocked,
    },
    // alpha / beta
    {
        icon: '🐺',
        name: 'Alpha player',
        description: 'You started playing during the alpha or earlier.',
        lore: 'Let me tell you of a time of great adventure…',
        get_status: () => AchievementStatus.unlocked,
    },
    {
        icon: '🦍',
        name: 'Beta player',
        description: 'You played during the beta.',
        get_status: () => AchievementStatus.revealed,
    },
    // main CTA
    {
        icon: '🥉',
        name: 'I am bored',
        description: 'Having played for the first time.',
        get_status: (state) => state.progress.statistics.good_play_count
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🥈',
        name: 'I am very bored',
        description: 'Having played 7 times.',
        get_status: (state) => state.progress.statistics.good_play_count >= 7
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🥈',
        // https://www.urbandictionary.com/define.php?term=Turn%20it%20up%20to%20eleven
        name: 'Turn it up to eleven',
        description: 'Having played 11 times.',
        get_status: (state) => state.progress.statistics.good_play_count >= 11
            ? AchievementStatus.unlocked
            : state.progress.statistics.good_play_count >= 7
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '🥇',
        name: 'I am dead bored',
        description: 'Having played 77 times.',
        get_status: (state) => state.progress.statistics.good_play_count >= 77
            ? AchievementStatus.unlocked
            : state.progress.statistics.good_play_count >= 11
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '🏅',
        name: 'did I mention I was bored?',
        description: 'Having played 500 times.',
        get_status: (state) => state.progress.statistics.good_play_count >= 500
            ? AchievementStatus.unlocked
            : state.progress.statistics.good_play_count >= 77
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '👑',
        name: 'king of boredom',
        description: 'Having played 1000 times.',
        get_status: (state) => state.progress.statistics.good_play_count >= 1000
            ? AchievementStatus.unlocked
            : state.progress.statistics.good_play_count >= 500
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '🎖',
        name: 'No-life except for boredom',
        description: 'Having played 10.000 times.',
        get_status: (state) => state.progress.statistics.good_play_count >= 10000
            ? AchievementStatus.unlocked
            : state.progress.statistics.good_play_count >= 1000
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    // regularity
    {
        icon: '',
        name: 'I’ll be back',
        description: 'Having been playing for 2 days.',
    },
    {
        icon: '',
        name: 'Regular',
        description: 'Having been playing for 7 days.',
    },
    {
        icon: '',
        name: 'Faithful',
        description: 'Having been playing for 30 days.',
    },
    {
        icon: '',
        name: 'Hooked',
        description: 'Having been playing for 120 days.',
    },
    {
        icon: '🎂',
        name: 'Addicted',
        description: 'Having been playing for 365 days.',
    },
    // counter-CTA
    {
        icon: '😱',
        name: 'Sorry my hand slipped',
        description: 'Having played too soon for the 1st time.',
        get_status: (state) => state.progress.statistics.bad_play_count
            ? AchievementStatus.unlocked
            : AchievementStatus.hidden,
    },
    {
        icon: '🙀',
        name: 'Oops!... I Did It Again',
        description: 'Having played too soon for the 2nd time.',
        get_status: (state) => state.progress.statistics.bad_play_count >= 2
            ? AchievementStatus.unlocked
            : AchievementStatus.hidden,
    },
    {
        icon: '😼',
        name: 'I’m not that innocent',
        description: 'Having played too soon 10 times.',
        get_status: (state) => state.progress.statistics.bad_play_count >= 10
            ? AchievementStatus.unlocked
            : state.progress.statistics.bad_play_count >= 3
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '😈',
        name: 'It’s good to be bad',
        description: 'Having played too soon 66 times.',
        get_status: (state) => state.progress.statistics.bad_play_count >= 66
            ? AchievementStatus.unlocked
            : state.progress.statistics.bad_play_count >= 10
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '👻',
        name: 'Hello darkness my old friend',
        description: 'Having played too soon 666 times.',
        get_status: (state) => state.progress.statistics.bad_play_count >= 666
            ? AchievementStatus.unlocked
            : state.progress.statistics.bad_play_count >= 66
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    // Engagement
    {
        icon: '🆙',
        name: 'What’s in a name?',
        description: 'Having set one’s name.',
        get_status: (state) => state.avatar.name !== DEFAULT_AVATAR_NAME
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🎓',
        name: 'Graduated',
        description: 'Having selected a class.',
        get_status: (state) => state.avatar.klass !== CharacterClass.novice
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🆔',
        name: 'Registered',
        description: 'Having signed up.',
    },
    // Progression/milestones
    // ..
    {
        icon: '🥄',
        name: 'There is no spoon',
        description: 'Having replaced your starting weapon.',
    },
    // - quality
    {
        icon: '',
        name: 'U got the look',
        description: 'All equipped items of quality uncommon or higher.',
    },
    {
        icon: '',
        name: 'Rare sight',
        description: 'All equipped items of quality rare or higher.',
    },
    {
        icon: '',
        name: 'Epic smile',
        description: 'All equipped items of quality epic or higher.',
    },
    {
        icon: '',
        name: 'I am a legend',
        description: 'All equipped items of quality legendary or higher.',
    },
    // - power
    {
        icon: '🐸',
        name: 'Frog in a well',
        description: 'Having a combined equipment’s power of 100 or higher.',
    },
    {
        icon: '',
        name: '',
        description: 'Having a combined equipment’s power of 1000 or higher.',
    },
    {
        icon: '',
        name: '',
        description: 'Having a combined equipment’s power of 2000 or higher.',
    },
    {
        icon: '',
        name: 'God complex',
        description: 'Having the name "Perte" or "Offirmo"',
    },
    {
        icon: '',
        name: 'Just plain lucky',
        description: 'You have 1/500000 chance to gain this on each activity.',
    },
    // attributes
    // https://www.google.com/search?q=silver+tongue
    {
        icon: '',
        name: 'Sharp tongue',
        description: 'Having a charisma of 10 or higher.',
    },
    {
        icon: '',
        name: 'Silver tongue',
        description: 'Having a charisma of 50 or higher.',
    },
    {
        icon: '',
        name: 'Golden tongue',
        description: 'Having a charisma of 100 or higher.',
    },
];
const ENTRIES = RAW_ENTRIES
    .filter(raw => raw.name && raw.description && raw.get_status)
    .map(({ name, icon, description, lore, get_status }, index) => {
    const session_uuid = [`${index}`.padStart(4, '0'), name].join(' ');
    return {
        session_uuid,
        icon: icon || '🏆',
        name: name,
        description: description,
        lore,
        get_status: get_status,
    };
});
export default ENTRIES;
/*’
- I was born ready - having replaced all starting equipment

- I like swords - having equipped a sword
- attributes milestones

Classes
- - having played X times as a X

Adventures
- having found the 4 rare gems
- having met X NPC
- having looted X items
- having had  enhancements applied
- - having had X different adventures
-  - having won X random encounters
- First Attempt In Learning - having lost X random encounters
- live another day - having fled X random encounters

Exploration
-

Social / virality
-

Misc
- here you go - (see cookie clicker)

Shadow achievements
- cheated

Titles
- class related (see WoW)
- visitor -
- explorer -
- X, dragonslayer- having won a random encounter with a dragon
- X from another world
- X the bored
- PvP

https://www.imdb.com/title/tt0120737/quotes?ref_=tt_ql_trv_4
https://www.imdb.com/title/tt0167261/quotes?ref_=tt_ql_trv_4
https://www.imdb.com/title/tt0167260/quotes?ref_=tt_ql_trv_4

The red pill
The blue pill
Free your mind
You are the One
What is best in life?
the enigma of steel
the jeweled crown of Aquilonia
You cannot pass!
A wizard is never late
One does not simply walk into Mordor
You have my sword...
Legolas: And you have my bow.
Gimli: And *my* axe.
they are coming
Such a little thing

    {
        name: '',
        description: '',
    },
 */
//# sourceMappingURL=achievements.js.map