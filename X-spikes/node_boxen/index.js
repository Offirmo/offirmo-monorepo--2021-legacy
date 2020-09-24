#!/usr/bin/env node
'use strict';

console.log('The boring RPG')

const boxen = require('boxen')

console.log(boxen('unicorn', {padding: 1}))

console.log(boxen(`
12345678901234567890123
🙂👶💗💙🏋🏽🤸🏊👵🤹
`, {padding: 0}))


console.log(boxen(`12345678901234567890123
🙂  CHARACTERISTICS 💗
👶🏽  level.........1
💗  health........1
💙  mana..........0
🏋🏽  strength......1
🤸🏽  agility.......1
🏊🏽  vitality......1
👵🏽  wisdom........1
🤹🏼‍♀️  luck..........1`))
