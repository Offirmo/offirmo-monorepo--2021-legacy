"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("@oh-my-rpg/data");
const EMOJI_ENTRIES = Object.keys(data_1.UNICODE_CHARS)
    .map(key => data_1.UNICODE_CHARS[key])
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
        emoji: '🐏',
    },
];
const ENTRIES = [].concat(...EMOJI_ENTRIES, ...EXTRA_ENTRIES);
exports.ENTRIES = ENTRIES;
//# sourceMappingURL=index.js.map