"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CHARACTERS = {
    '01f400': {
        code_point: 128000,
        char: '🐀',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'rat',
        },
    },
    '01f401': {
        code_point: 128001,
        char: '🐁',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'mouse',
        },
    },
    '01f402': {
        code_point: 128002,
        char: '🐂',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ox',
        },
    },
    '01f403': {
        code_point: 128003,
        char: '🐃',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'water buffalo',
        },
    },
    '01f404': {
        code_point: 128004,
        char: '🐄',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'cow',
        },
    },
    '01f405': {
        code_point: 128005,
        char: '🐅',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'tiger',
        },
    },
    '01f406': {
        code_point: 128006,
        char: '🐆',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'leopard',
        },
    },
    '01f407': {
        code_point: 128007,
        char: '🐇',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'rabbit',
        },
    },
    '01f408': {
        code_point: 128008,
        char: '🐈',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'cat',
        },
    },
    '01f409': {
        code_point: 128009,
        char: '🐉',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dragon',
        },
    },
    '01f40a': {
        code_point: 128010,
        char: '🐊',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'crocodile',
        },
    },
    '01f40b': {
        code_point: 128011,
        char: '🐋',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'whale',
        },
    },
    '01f40c': {
        code_point: 128012,
        char: '🐌',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'snail',
        },
    },
    '01f40d': {
        code_point: 128013,
        char: '🐍',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'snake',
        },
    },
    '01f40e': {
        code_point: 128014,
        char: '🐎',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'horse',
        },
    },
    '01f40f': {
        code_point: 128015,
        char: '🐏',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ram',
        },
    },
    '01f410': {
        code_point: 128016,
        char: '🐐',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'goat',
        },
    },
    '01f411': {
        code_point: 128017,
        char: '🐑',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ewe',
        },
    },
    '01f412': {
        code_point: 128018,
        char: '🐒',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'monkey',
        },
    },
    '01f413': {
        code_point: 128019,
        char: '🐓',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'chicken',
        },
    },
    '01f414': {
        code_point: 128020,
        char: '🐔',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'chicken head',
        },
    },
    '01f415': {
        code_point: 128021,
        char: '🐕',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dog',
        },
    },
    '01f416': {
        code_point: 128022,
        char: '🐖',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'pig',
        },
    },
    '01f417': {
        code_point: 128023,
        char: '🐗',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'boar',
        },
    },
    '01f418': {
        code_point: 128024,
        char: '🐘',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'elephant',
        },
    },
    '01f419': {
        code_point: 128025,
        char: '🐙',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'octopus',
        },
    },
    '01f41a': {
        code_point: 128026,
        char: '🐚',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'spiral shell',
        },
    },
    '01f41b': {
        code_point: 128027,
        char: '🐛',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'caterpillar',
        },
    },
    '01f41c': {
        code_point: 128028,
        char: '🐜',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'ant',
        },
    },
    '01f41d': {
        code_point: 128029,
        char: '🐝',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'bee',
        },
    },
    '01f41e': {
        code_point: 128030,
        char: '🐞',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'lady beetle',
        },
    },
    '01f41f': {
        code_point: 128031,
        char: '🐟',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'fish',
        },
    },
    '01f420': {
        code_point: 128032,
        char: '🐠',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'tropical fish',
        },
    },
    '01f421': {
        code_point: 128033,
        char: '🐡',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'blowfish',
        },
    },
    '01f422': {
        code_point: 128034,
        char: '🐢',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'turtle',
        },
    },
    '01f423': {
        code_point: 128035,
        char: '🐣',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'hatching chick',
        },
    },
    '01f424': {
        code_point: 128036,
        char: '🐤',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'baby chick',
        },
    },
    '01f425': {
        code_point: 128037,
        char: '🐥',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'baby chick',
        },
    },
    '01f426': {
        code_point: 128038,
        char: '🐦',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'pigeon',
        },
    },
    '01f427': {
        code_point: 128039,
        char: '🐧',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'penguin',
        },
    },
    '01f428': {
        code_point: 128040,
        char: '🐨',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'koala',
        },
    },
    '01f429': {
        code_point: 128041,
        char: '🐩',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'poodle',
        },
    },
    '01f42a': {
        code_point: 128042,
        char: '🐪',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dromedary',
        },
    },
    '01f42b': {
        code_point: 128043,
        char: '🐫',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'camel',
        },
    },
    '01f42c': {
        code_point: 128044,
        char: '🐬',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dolphin',
        },
    },
    '01f42d': {
        code_point: 128045,
        char: '🐭',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'mouse',
        },
    },
    '01f42e': {
        code_point: 128046,
        char: '🐮',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'cow',
        },
    },
    '01f42f': {
        code_point: 128047,
        char: '🐯',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'tiger',
        },
    },
    '01f430': {
        code_point: 128048,
        char: '🐰',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'rabbit',
        },
    },
    '01f431': {
        code_point: 128049,
        char: '🐱',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'cat',
        },
    },
    '01f432': {
        code_point: 128050,
        char: '🐲',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'dragon',
        },
    },
    '01f433': {
        code_point: 128051,
        char: '🐳',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'spouting whale',
        },
    },
    '01f434': {
        code_point: 128052,
        char: '🐴',
        taxonomy: ['animal', 'living'],
        tags: ['emoji'],
        properties: {
            description: 'horse',
        },
    },
    '01f435': {
        code_point: 128053,
        char: '🐵',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'monkey',
        },
    },
    '01f436': {
        code_point: 128054,
        char: '🐶',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'dog',
        },
    },
    '01f437': {
        code_point: 128055,
        char: '🐷',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'pig',
        },
    },
    '01f438': {
        code_point: 128056,
        char: '🐸',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'frog',
        },
    },
    '01f439': {
        code_point: 128057,
        char: '🐹',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'hamster',
        },
    },
    '01f43a': {
        code_point: 128058,
        char: '🐺',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji'],
        properties: {
            description: 'wolf',
        },
    },
    '01f43b': {
        code_point: 128059,
        char: '🐻',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'bear',
        },
    },
    '01f43c': {
        code_point: 128060,
        char: '🐼',
        taxonomy: ['animal', 'living', 'monster', 'face'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'panda',
        },
    },
    '01f43d': {
        code_point: 128061,
        char: '🐽',
        taxonomy: [],
        tags: ['emoji'],
        properties: {
            description: '???',
        },
    },
    '01f43e': {
        code_point: 128062,
        char: '🐾',
        taxonomy: [],
        tags: ['emoji'],
        properties: {
            description: '???',
        },
    },
    '01f43f': {
        code_point: 128063,
        char: '🐿',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'chipmunk',
        },
    },
    '01f5ff': {
        code_point: 128511,
        char: '🗿',
        taxonomy: ['monster'],
        tags: ['emoji'],
        properties: {
            description: 'golem',
        },
    },
    '01f47b': {
        code_point: 128123,
        char: '👻',
        taxonomy: ['monster'],
        tags: ['emoji'],
        properties: {
            description: 'ghost',
        },
    },
    '01f54a': {
        code_point: 128330,
        char: '🕊',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'dove',
        },
    },
    '01f577': {
        code_point: 128375,
        char: '🕷',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'spider',
        },
    },
    '01f980': {
        code_point: 129408,
        char: '🦀',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'crab',
        },
    },
    '01f981': {
        code_point: 129409,
        char: '🦁',
        taxonomy: ['animal', 'living'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'lion',
        },
    },
    '01f982': {
        code_point: 129410,
        char: '🦂',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'scorpion',
        },
    },
    '01f983': {
        code_point: 129411,
        char: '🦃',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'turkey',
        },
    },
    '01f984': {
        code_point: 129412,
        char: '🦄',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji'],
        properties: {
            description: 'unicorn',
        },
    },
    '01f985': {
        code_point: 129413,
        char: '🦅',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'eagle',
        },
    },
    '01f986': {
        code_point: 129414,
        char: '🦆',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'duck',
        },
    },
    '01f987': {
        code_point: 129415,
        char: '🦇',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'bat',
        },
    },
    '01f988': {
        code_point: 129416,
        char: '🦈',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'shark',
        },
    },
    '01f989': {
        code_point: 129417,
        char: '🦉',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'owl',
        },
    },
    '01f98a': {
        code_point: 129418,
        char: '🦊',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'face'],
        properties: {
            description: 'fox',
        },
    },
    '01f98b': {
        code_point: 129419,
        char: '🦋',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'butterfly',
        },
    },
    '01f98c': {
        code_point: 129420,
        char: '🦌',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'deer',
        },
    },
    '01f98d': {
        code_point: 129421,
        char: '🦍',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'gorilla',
        },
    },
    '01f98e': {
        code_point: 129422,
        char: '🦎',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'lizard',
        },
    },
    '01f98f': {
        code_point: 129423,
        char: '🦏',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'rhinoceros',
        },
    },
    '01f990': {
        code_point: 129424,
        char: '🦐',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'shrimp',
        },
    },
    '01f991': {
        code_point: 129425,
        char: '🦑',
        taxonomy: ['animal', 'living', 'monster'],
        tags: ['emoji', 'full'],
        properties: {
            description: 'squid',
        },
    },
};
exports.CHARACTERS = CHARACTERS;
//# sourceMappingURL=index.js.map