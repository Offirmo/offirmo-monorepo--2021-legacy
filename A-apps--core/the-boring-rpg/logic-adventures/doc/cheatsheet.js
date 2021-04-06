const stylize_string = require('@offirmo/cli-toolbox/string/stylize')
const boxify = require('@offirmo/cli-toolbox/string/boxify')

const PKG_JSON = require('../package.json')

console.log(boxify(`
Declaring adventures:

You have defeated a {{encounter}}!{{br}}
You looted {{coin}} {{item_slot}} {{[slot]}} {{item}} from its corpse.
You perfected your {{attr_name}} during the fight: +{{attr}} {{attr_name}}!
You gained +{{strength}} strength!
You gained +{{level}} level!
You gained +{{mana}} mana!
You gained +{{health}} health!
You gained +{{wisdom}} wisdom!
You gained +{{agility}} agility!
You gained +{{charisma}} charisma!
You gained +{{luck}} luck!

outcome: {
  token: true
  coin: ...
  armor: true
  weapon: true
  armor_or_weapon: true
  improvementⵧarmor: true
  improvementⵧweapon: true
  improvementⵧarmor_or_weapon: true

  random_attribute: true
  lowest_attribute: true
  class_primary_attribute: true
  class_secondary_attribute: true

  level: true
  health: true
  mana: true
  strength: true
  agility: true
  charisma: true
  wisdom: true
  luck: true

Note: max 1 attribute at a time!
`.trim()))

