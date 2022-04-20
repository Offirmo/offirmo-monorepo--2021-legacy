#!/usr/bin/env node
'use strict';

console.log('Mixing emojis')

const stylize = require('chalk')

const ZERO_WIDTH_JOINER = '\u200D'

const COMBINING_DIACRITICAL__SYMBOL__ARROW__UP_POINTING_LEFT  = `\u20D6`
const COMBINING_DIACRITICAL__SYMBOL__ARROW__UP_POINTING_RIGHT = `\u20D7`

const COMBINING_DIACRITICAL__HALF_MARK__UP_BAR = `\ufe26`

console.log('Hello w\ufe26o\ufe26r\ufe26ld')

console.log('          |●●○○|')
console.log('0305      |●\u0305●\u0305○\u0305○\u0305|')
console.log('035e      |●\u035e●\u035e○\u035e○\u035e|')
console.log('fe26      |●\ufe26●\ufe26○\ufe26○\ufe26|')
console.log('fe25      |●\ufe25●\ufe25○\ufe25○\ufe25|')
console.log('fe26+035e |●\ufe26\u035e●\ufe26\u035e○\ufe26\u035e○\ufe26\u035e|')

console.log('fe2d      |●\ufe2d●\ufe2d○\ufe2d○\ufe2d|')

console.log('          |●●\u20D7○○|')


console.log('he\u0366l\u036cl\u1DDDo\u0369')


// tests
//console.log(BASES.person_with_blond_hair + ZERO_WIDTH_JOINER + GENDER.female)
