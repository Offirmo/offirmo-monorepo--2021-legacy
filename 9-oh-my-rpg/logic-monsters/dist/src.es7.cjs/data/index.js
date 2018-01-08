"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unicode_data_1 = require("@offirmo/unicode-data");
const EMOJI_ENTRIES = Object.keys(unicode_data_1.UNICODE_CHARS)
    .map(key => unicode_data_1.UNICODE_CHARS[key])
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