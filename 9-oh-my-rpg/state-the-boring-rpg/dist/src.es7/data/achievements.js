import { AchievementStatus } from '@oh-my-rpg/state-progress';
import { CharacterClass, DEFAULT_AVATAR_NAME } from '@oh-my-rpg/state-character';
/*
🍪🎂🏴🏳
📦💰
🥇🥈🥉
🎖🏆🏅
👑🎓
https://www.wowhead.com/the-entitled-a-guide-to-titles
https://www.wowhead.com/achievements
http://cookieclicker.wikia.com/wiki/Achievement
https://www.trueachievements.com/game/Diablo-III-Reaper-of-Souls-Ultimate-Evil-Edition/achievements
 */
// https://www.begeek.fr/vous-galerez-sur-red-dead-redemption-ii-voici-les-codes-pour-tricher-298991
// https://www.trueachievements.com/game/Diablo-III-Reaper-of-Souls-Ultimate-Evil-Edition/achievements
const RAW_ENTRIES_TEST = [
    {
        icon: '🍪',
        name: 'TEST',
        description: 'This secret achievement can only be obtained through debug commands, to test the achievements system.',
        lore: '…and a piece of lore should appear here',
        get_status: (state) => state.progress.achievements['TEST'] === undefined || state.progress.achievements['TEST'] === AchievementStatus.secret
            ? AchievementStatus.secret // keep it secret
            : AchievementStatus.unlocked,
    },
];
const RAW_ENTRIES_GAME_PHASES = [
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
        description: 'You played during the beta. (no beta yet, though)',
        lore: 'Those were the days my friend…',
        get_status: () => AchievementStatus.revealed,
    },
];
const RAW_ENTRIES_CTAS = [
    // main CTA
    {
        icon: '🥉',
        name: 'I am bored',
        description: 'Having played for the first time.',
        lore: 'I am looking for someone to share in an adventure…',
        get_status: (state) => state.progress.statistics.good_play_count
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🥈',
        name: 'I am very bored',
        description: 'Having played 7 times.',
        lore: 'If I take one more step, I’ll be the farthest away from home I’ve ever been…',
        get_status: (state) => state.progress.statistics.good_play_count >= 7
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🥈',
        // https://www.urbandictionary.com/define.php?term=Turn%20it%20up%20to%20eleven
        name: 'Turn it up to eleven',
        description: 'Having played 11 times.',
        lore: 'You step onto the road, and there’s no telling where you might be swept off to…',
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
        lore: 'Not all those who wander are lost.',
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
        icon: '🌱',
        name: 'I’ll be back',
        description: 'Having been playing for 2 days.',
        get_status: (state) => state.progress.statistics.active_day_count >= 2
            ? AchievementStatus.unlocked
            : AchievementStatus.revealed,
    },
    {
        icon: '🌿',
        name: 'Regular',
        description: 'Having been playing for 7 days.',
        get_status: (state) => state.progress.statistics.active_day_count >= 7
            ? AchievementStatus.unlocked
            : state.progress.statistics.active_day_count >= 2
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '🌳',
        name: 'Faithful',
        description: 'Having been playing for 30 days.',
        get_status: (state) => state.progress.statistics.active_day_count >= 30
            ? AchievementStatus.unlocked
            : state.progress.statistics.active_day_count >= 7
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '💉',
        name: 'Hooked',
        description: 'Having been playing for 120 days.',
        get_status: (state) => state.progress.statistics.active_day_count >= 120
            ? AchievementStatus.unlocked
            : state.progress.statistics.active_day_count >= 30
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
    {
        icon: '🎂',
        name: 'Addicted',
        description: 'Having been playing for 365 days.',
        get_status: (state) => state.progress.statistics.active_day_count >= 365
            ? AchievementStatus.unlocked
            : state.progress.statistics.active_day_count >= 120
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
];
const RAW_ENTRIES_COUNTER_CTAS = [
    // bad clicks
    {
        icon: '😱',
        name: 'Sorry my hand slipped',
        description: 'Having played too soon for the 1st time.',
        lore: 'each mistake teaches us something…',
        get_status: (state) => state.progress.statistics.bad_play_count
            ? AchievementStatus.unlocked
            : AchievementStatus.hidden,
    },
    {
        icon: '🙀',
        name: 'Oops!... I Did It Again',
        description: 'Having played too soon for the 2nd time.',
        lore: 'Anyone who has never made a mistake has never tried anything new.',
        get_status: (state) => state.progress.statistics.bad_play_count >= 2
            ? AchievementStatus.unlocked
            : AchievementStatus.hidden,
    },
    {
        icon: '😼',
        name: 'I’m not that innocent',
        description: 'Having played too soon 10 times.',
        lore: 'There is no such thing as accident; it is fate misnamed.',
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
        lore: 'Never retreat, never retract… never admit a mistake…',
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
        lore: 'Give yourself to the dark side…',
        get_status: (state) => state.progress.statistics.bad_play_count >= 666
            ? AchievementStatus.unlocked
            : state.progress.statistics.bad_play_count >= 66
                ? AchievementStatus.revealed
                : AchievementStatus.hidden,
    },
];
const RAW_ENTRIES_ENGAGEMENT = [
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
];
const RAW_ENTRIES_PROGRESSION_EQUIPMENT = [
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
];
const RAW_ENTRIES_PROGRESSION_ATTRIBUTES = [
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

    you've been officially labeled a 'disturber of the peace.'

    https://en.wikipedia.org/wiki/All_that_is_gold_does_not_glitter

    https://www.brainyquote.com/search_results?q=adventure
 */
const RAW_ENTRIES_SECRETS = [
    {
        icon: '👑',
        name: 'Usurper',
        description: 'Having set the name "Offirmo".',
        lore: 'I see you…',
        get_status: (state) => state.avatar.name === 'Offirmo'
            ? AchievementStatus.unlocked
            : AchievementStatus.secret,
    },
    {
        icon: '🍀',
        name: 'Just plain lucky',
        description: 'You have 1/500000 chance to gain this on each activity.',
        lore: 'The amount of good luck coming your way depends on your willingness to act.',
        get_status: () => Math.floor(Math.random() * 500000) === 123456
            ? AchievementStatus.unlocked
            : AchievementStatus.secret,
    },
    {
        icon: '🏴‍☠️',
        name: 'Cheater',
        description: 'You manipulated the threads of reality to obtain this achievement. (can’t be obtained by normal means)',
        lore: 'Just a different way of looking at problems that no one’s thought of ;)',
        get_status: (state) => AchievementStatus.secret,
    },
];
const RAW_ENTRIES = [
    ...RAW_ENTRIES_TEST,
    ...RAW_ENTRIES_GAME_PHASES,
    // Intro
    {
        icon: '✨',
        name: 'Summoned',
        description: 'You began your adventures in another world.',
        lore: 'Thanks for visiting!',
        get_status: () => AchievementStatus.unlocked,
    },
    ...RAW_ENTRIES_CTAS,
    ...RAW_ENTRIES_COUNTER_CTAS,
    ...RAW_ENTRIES_ENGAGEMENT,
    // Progression/milestones
    ...RAW_ENTRIES_PROGRESSION_EQUIPMENT,
    ...RAW_ENTRIES_PROGRESSION_ATTRIBUTES,
    ...RAW_ENTRIES_SECRETS,
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
//# sourceMappingURL=achievements.js.map