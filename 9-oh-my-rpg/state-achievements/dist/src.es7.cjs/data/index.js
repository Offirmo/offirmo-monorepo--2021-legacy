"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
// TODO tests!!
const RAW_ENTRIES = [
    // Intro
    {
        name: 'The First Step',
        description: 'You began your adventures in another world.',
        lore: 'Thanks for visiting!',
        get_status: () => types_1.AchievementStatus.unlocked,
    },
    // main CTA
    {
        name: 'I am bored',
        description: 'Having played for the first time.',
    },
    {
        name: 'I am very bored',
        description: 'Having played 7 times.',
    },
    {
        name: 'I am dead bored',
        description: 'Having played 77 times.',
    },
    {
        name: 'did I mention I was bored?',
        description: 'Having played 500 times.',
    },
    {
        name: 'king of boredom',
        description: 'Having played 1000 times.',
    },
    {
        name: 'No-life except for boredom',
        description: 'Having played 10.000 times.',
    },
    // regularity
    {
        name: 'I’ll be back',
        description: 'Having been playing for 2 days.',
    },
    {
        name: 'Regular',
        description: 'Having been playing for 7 days.',
    },
    {
        name: 'Faithful',
        description: 'Having been playing for 30 days.',
    },
    {
        name: 'Hooked',
        description: 'Having been playing for 120 days.',
    },
    {
        name: 'Addicted',
        description: 'Having been playing for 365 days.',
    },
    // counter-CTA
    {
        name: 'Sorry my hand slipped',
        description: 'Having played too soon for the 1st time.',
    },
    {
        name: 'Oops!... I Did It Again',
        description: 'Having played too soon for the 2nd time.',
    },
    {
        name: 'I’m not that innocent',
        description: 'Having played too soon 10 times.',
    },
    {
        name: 'It’s good to be bad',
        description: 'Having played too soon 66 times.',
    },
    {
        name: 'Hello darkness my old friend',
        description: 'Having played too soon 666 times.',
    },
    // Engagement
    {
        name: 'What’s in a name?',
        description: 'Having set one’s name.',
    },
    {
        name: 'Graduated',
        description: 'Having selected a class.',
    },
    // Progression/milestones
    // ..
    {
        name: 'There is no spoon',
        description: 'Having replaced your starting weapon.',
    },
    // - quality
    {
        name: 'U got the look',
        description: 'All equipped items of quality uncommon or higher.',
    },
    {
        name: 'Rare sight',
        description: 'All equipped items of quality rare or higher.',
    },
    {
        name: 'Epic smile',
        description: 'All equipped items of quality epic or higher.',
    },
    {
        name: 'I am a legend',
        description: 'All equipped items of quality legendary or higher.',
    },
    // - power
    {
        name: 'Frog in a well',
        description: 'Having a combined equipment’s power of 100 or higher.',
    },
    {
        name: '',
        description: 'Having a combined equipment’s power of 1000 or higher.',
    },
    {
        name: '',
        description: 'Having a combined equipment’s power of 2000 or higher.',
    },
    {
        name: 'God complex',
        description: 'Having the name "Perte" or "Offirmo"',
    },
    {
        name: 'Just plain lucky',
        description: 'You have 1/500000 chance to gain this on each activity.',
    },
];
exports.RAW_ENTRIES = RAW_ENTRIES;
const ENTRIES = RAW_ENTRIES
    .filter(raw => raw.name && raw.get_status)
    .map(({ name, description, lore, get_status }, index) => {
    return {
        key: name,
        name,
        description,
        lore,
        sorting_rank: index,
        get_status: get_status,
    };
});
exports.ENTRIES = ENTRIES;
exports.default = ENTRIES;
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
//# sourceMappingURL=index.js.map