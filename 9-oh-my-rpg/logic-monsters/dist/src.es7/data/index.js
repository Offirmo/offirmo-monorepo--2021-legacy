import { UNICODE_CHARS, } from '@offirmo/unicode-data';
const EMOJI_ENTRIES = Object.keys(UNICODE_CHARS)
    .map(key => UNICODE_CHARS[key])
    .filter(charDetails => charDetails.taxonomy.includes('monster'))
    .map((charDetails) => ({
    name: charDetails.properties.description,
    emoji: charDetails.char,
}));
const EXTRA_ENTRIES = [
    {
        name: 'drop bear',
        emoji: '🐨',
    },
    {
        name: 'dahu',
        emoji: '🐐',
    },
    // TODO https://en.wikipedia.org/wiki/Fearsome_critters
    {
        name: 'hoop snake',
        emoji: '🐍',
    },
    {
        name: 'joint snake',
        emoji: '🐍',
    },
    {
        name: 'spreading adder',
        emoji: '🐍',
    },
    {
        name: 'fur-bearing truit',
        emoji: '🐡',
    },
    {
        name: 'splintercat',
        emoji: '🐡',
    },
];
const ENTRIES = [].concat(...EMOJI_ENTRIES, ...EXTRA_ENTRIES);
export { ENTRIES, };
//# sourceMappingURL=index.js.map