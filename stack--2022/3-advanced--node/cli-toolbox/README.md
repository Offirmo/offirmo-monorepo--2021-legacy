# cli-toolbox
An aggregation of useful quality modules related to writing CLI node apps.


## Introduction

This module is an aggregation of frequently used terminal / CLI related modules that frequently work together.

Goals:
- not have to depend on a flurry of small modules, depend on this single one instead
- wrap some modules for a more uniform API


## usage

### framework/meow
Based on:
* meow v7.1.1
  * CLI app helper
```js
const meow = require('@offirmo/cli-toolbox/framework/meow')

const cli = meow('build', {
	flags: {
		watch: {
			type: 'boolean',
			default: false,
		},
	},
})

console.log('building…', { flags: cli.flags })
```
output:
```
building… { flags: { watch: false } }
```

### fs/json
Based on:
* load-json-file v6.2.0
  * Read and parse a JSON file
* write-json-file v4.3.0
  * Stringify and write JSON to a file atomically
```js
const json = require('@offirmo/cli-toolbox/fs/json')

return json.read(path.join(__dirname, ROOT_RELATIVE_PATH, 'package.json'))
	.then(({name, version, description, author, license}) => {
		console.log({name, version, description, author, license})
	})
```
output:
```
{
  name: '@offirmo/cli-toolbox',
  version: '2.0.0',
  description: 'An aggregation of useful quality modules related to writing CLI node apps',
  author: 'Offirmo <offirmo.net@gmail.com>',
  license: 'UNLICENSED'
}
```

### fs/extra
Based on:
* fs-extra v9.0.1
  * https://github.com/jprichardson/node-fs-extra
  * fs-extra contains methods that aren't included in the vanilla Node.js fs package. Such as recursive mkdir, copy, and remove.
```js
const fs = require('@offirmo/cli-toolbox/fs/extra')

const dirs = fs.lsDirsSync(path.join(__dirname, ROOT_RELATIVE_PATH))
console.log(dirs)
```
output:
```
[
  '/Users/user/work/src/off/cli-toolbox/.git',
  '/Users/user/work/src/off/cli-toolbox/_doc',
  '/Users/user/work/src/off/cli-toolbox/_tosort',
  '/Users/user/work/src/off/cli-toolbox/framework',
  '/Users/user/work/src/off/cli-toolbox/fs',
  '/Users/user/work/src/off/cli-toolbox/node_modules',
  '/Users/user/work/src/off/cli-toolbox/stdout',
  '/Users/user/work/src/off/cli-toolbox/string'
]
```

### stdout/clear-cli
Based on:
See more at https://github.com/sindresorhus/clear-cli
```js
const clearCli = require('@offirmo/cli-toolbox/stdout/clear-cli')

//clearCli()
```
output:
```
```

### string/stylize-string
Based on:
* chalk v4.1.0
  * Terminal string styling done right
```js
const stylize_string = require('@offirmo/cli-toolbox/string/stylize')

console.log(stylize_string.bold.yellow.bgBlue('Hello'))
console.log(stylize_string.red('red'), stylize_string.red.bold('bold'))
console.log(stylize_string.green('green'), stylize_string.green.bold('green'))
console.log(stylize_string.yellow('yellow'), stylize_string.yellow.bold('yellow'))
console.log(stylize_string.blue('blue'), stylize_string.blue.bold('blue'))
console.log(stylize_string.magenta('magenta'), stylize_string.magenta.bold('magenta'))
console.log(stylize_string.cyan('cyan'), stylize_string.cyan.bold('cyan'))
console.log(stylize_string.white('white'), stylize_string.white.bold('white'))
console.log(stylize_string.gray('gray'), stylize_string.gray.bold('gray'))
```
output:
```
Hello
red bold
green green
yellow yellow
blue blue
magenta magenta
cyan cyan
white white
gray gray
```

### string/boxify
Based on:
* boxen v4.2.0
  * Create boxes in the terminal
```js
const boxify = require('@offirmo/cli-toolbox/string/boxify')

console.log(boxify('Hello'))
```
output:
```
┌─────┐
│Hello│
└─────┘
```

### string/columnify
Based on:
* cli-columns v3.1.2
  * https://github.com/shannonmoeller/cli-columns#readme
  * Columnated lists for the CLI.
```js
const columnify = require('@offirmo/cli-toolbox/string/columnify')

const data = require('pokemon').all()

console.log(columnify(data))
```
output:
```
Abomasnow     Bibarel       Chimchar      Dewgong       Excadrill     Gloom         Hoopa         Landorus      Manaphy       Musharna      Pidgey        Rhydon        Shinx         Steelix       Toxicroak     Watchog
Abra          Bidoof        Chimecho      Dewott        Exeggcute     Gogoat        Hoothoot      Lanturn       Mandibuzz     Natu          Pidove        Rhyhorn       Shroomish     Steenee       Tranquill     Weavile
Absol         Binacle       Chinchou      Dewpider      Exeggutor     Golbat        Hoppip        Lapras        Manectric     Necrozma      Pignite       Rhyperior     Shuckle       Stoutland     Trapinch      Weedle
Accelgor      Bisharp       Chingling     Dhelmise      Exploud       Goldeen       Horsea        Larvesta      Mankey        Nidoking      Pikachu       Ribombee      Shuppet       Stufful       Treecko       Weepinbell
Aegislash     Blastoise     Cinccino      Dialga        Farfetch’d    Golduck       Houndoom      Larvitar      Mantine       Nidoqueen     Pikipek       Riolu         Sigilyph      Stunfisk      Trevenant     Weezing
Aerodactyl    Blaziken      Clamperl      Diancie       Fearow        Golem         Houndour      Latias        Mantyke       Nidoran♀      Piloswine     Rockruff      Silcoon       Stunky        Tropius       Whimsicott
Aggron        Blissey       Clauncher     Diggersby     Feebas        Golett        Huntail       Latios        Maractus      Nidoran♂      Pineco        Roggenrola    Silvally      Sudowoodo     Trubbish      Whirlipede
Aipom         Blitzle       Clawitzer     Diglett       Fennekin      Golisopod     Hydreigon     Leafeon       Mareanie      Nidorina      Pinsir        Roselia       Simipour      Suicune       Trumbeak      Whiscash
Alakazam      Boldore       Claydol       Ditto         Feraligatr    Golurk        Hypno         Leavanny      Mareep        Nidorino      Piplup        Roserade      Simisage      Sunflora      Tsareena      Whismur
Alomomola     Bonsly        Clefable      Dodrio        Ferroseed     Goodra        Igglybuff     Ledian        Marill        Nihilego      Plusle        Rotom         Simisear      Sunkern       Turtonator    Wigglytuff
Altaria       Bouffalant    Clefairy      Doduo         Ferrothorn    Goomy         Illumise      Ledyba        Marowak       Nincada       Politoed      Rowlet        Skarmory      Surskit       Turtwig       Wimpod
Amaura        Bounsweet     Cleffa        Donphan       Finneon       Gorebyss      Incineroar    Lickilicky    Marshadow     Ninetales     Poliwag       Rufflet       Skiddo        Swablu        Tympole       Wingull
Ambipom       Braixen       Cloyster      Doublade      Flaaffy       Gothita       Infernape     Lickitung     Marshtomp     Ninjask       Poliwhirl     Sableye       Skiploom      Swadloon      Tynamo        Wishiwashi
Amoonguss     Braviary      Cobalion      Dragalge      Flabebe       Gothitelle    Inkay         Liepard       Masquerain    Noctowl       Poliwrath     Salamence     Skitty        Swalot        Type: Null    Wobbuffet
Ampharos      Breloom       Cofagrigus    Dragonair     Flareon       Gothorita     Ivysaur       Lileep        Mawile        Noibat        Ponyta        Salandit      Skorupi       Swampert      Typhlosion    Woobat
Anorith       Brionne       Combee        Dragonite     Fletchinder   Gourgeist     Jangmo-o      Lilligant     Medicham      Noivern       Poochyena     Salazzle      Skrelp        Swanna        Tyranitar     Wooper
Araquanid     Bronzong      Combusken     Drampa        Fletchling    Granbull      Jellicent     Lillipup      Meditite      Nosepass      Popplio       Samurott      Skuntank      Swellow       Tyrantrum     Wormadam
Arbok         Bronzor       Comfey        Drapion       Floatzel      Graveler      Jigglypuff    Linoone       Meganium      Numel         Porygon       Sandile       Slaking       Swinub        Tyrogue       Wurmple
Arcanine      Bruxish       Conkeldurr    Dratini       Floette       Greninja      Jirachi       Litleo        Meloetta      Nuzleaf       Porygon-Z     Sandshrew     Slakoth       Swirlix       Tyrunt        Wynaut
Arceus        Budew         Corphish      Drifblim      Florges       Grimer        Jolteon       Litten        Meowstic      Octillery     Porygon2      Sandslash     Sliggoo       Swoobat       Umbreon       Xatu
Archen        Buizel        Corsola       Drifloon      Flygon        Grotle        Joltik        Litwick       Meowth        Oddish        Primarina     Sandygast     Slowbro       Sylveon       Unfezant      Xerneas
Archeops      Bulbasaur     Cosmoem       Drilbur       Fomantis      Groudon       Jumpluff      Lombre        Mesprit       Omanyte       Primeape      Sawk          Slowking      Taillow       Unown         Xurkitree
Ariados       Buneary       Cosmog        Drowzee       Foongus       Grovyle       Jynx          Lopunny       Metagross     Omastar       Prinplup      Sawsbuck      Slowpoke      Talonflame    Ursaring      Yamask
Armaldo       Bunnelby      Cottonee      Druddigon     Forretress    Growlithe     Kabuto        Lotad         Metang        Onix          Probopass     Scatterbug    Slugma        Tangela       Uxie          Yanma
Aromatisse    Burmy         Crabominable  Ducklett      Fraxure       Grubbin       Kabutops      Loudred       Metapod       Oranguru      Psyduck       Sceptile      Slurpuff      Tangrowth     Vanillish     Yanmega
Aron          Butterfree    Crabrawler    Dugtrio       Frillish      Grumpig       Kadabra       Lucario       Mew           Oricorio      Pumpkaboo     Scizor        Smeargle      Tapu Bulu     Vanillite     Yungoos
Articuno      Buzzwole      Cradily       Dunsparce     Froakie       Gulpin        Kakuna        Ludicolo      Mewtwo        Oshawott      Pupitar       Scolipede     Smoochum      Tapu Fini     Vanilluxe     Yveltal
Audino        Cacnea        Cranidos      Duosion       Frogadier     Gumshoos      Kangaskhan    Lugia         Mienfoo       Pachirisu     Purrloin      Scrafty       Sneasel       Tapu Koko     Vaporeon      Zangoose
Aurorus       Cacturne      Crawdaunt     Durant        Froslass      Gurdurr       Karrablast    Lumineon      Mienshao      Palkia        Purugly       Scraggy       Snivy         Tapu Lele     Venipede      Zapdos
Avalugg       Camerupt      Cresselia     Dusclops      Furfrou       Guzzlord      Kartana       Lunala        Mightyena     Palossand     Pyroar        Scyther       Snorlax       Tauros        Venomoth      Zebstrika
Axew          Carbink       Croagunk      Dusknoir      Furret        Gyarados      Kecleon       Lunatone      Milotic       Palpitoad     Pyukumuku     Seadra        Snorunt       Teddiursa     Venonat       Zekrom
Azelf         Carnivine     Crobat        Duskull       Gabite        Hakamo-o      Keldeo        Lurantis      Miltank       Pancham       Quagsire      Seaking       Snover        Tentacool     Venusaur      Zigzagoon
Azumarill     Carracosta    Croconaw      Dustox        Gallade       Happiny       Kingdra       Luvdisc       Mime Jr.      Pangoro       Quilava       Sealeo        Snubbull      Tentacruel    Vespiquen     Zoroark
Azurill       Carvanha      Crustle       Dwebble       Galvantula    Hariyama      Kingler       Luxio         Mimikyu       Panpour       Quilladin     Seedot        Solgaleo      Tepig         Vibrava       Zorua
Bagon         Cascoon       Cryogonal     Eelektrik     Garbodor      Haunter       Kirlia        Luxray        Minccino      Pansage       Qwilfish      Seel          Solosis       Terrakion     Victini       Zubat
Baltoy        Castform      Cubchoo       Eelektross    Garchomp      Hawlucha      Klang         Lycanroc      Minior        Pansear       Raichu        Seismitoad    Solrock       Throh         Victreebel    Zweilous
Banette       Caterpie      Cubone        Eevee         Gardevoir     Haxorus       Klefki        Machamp       Minun         Paras         Raikou        Sentret       Spearow       Thundurus     Vigoroth      Zygarde
Barbaracle    Celebi        Cutiefly      Ekans         Gastly        Heatmor       Klink         Machoke       Misdreavus    Parasect      Ralts         Serperior     Spewpa        Timburr       Vikavolt
Barboach      Celesteela    Cyndaquil     Electabuzz    Gastrodon     Heatran       Klinklang     Machop        Mismagius     Passimian     Rampardos     Servine       Spheal        Tirtouga      Vileplume
Basculin      Chandelure    Darkrai       Electivire    Genesect      Heliolisk     Koffing       Magby         Moltres       Patrat        Rapidash      Seviper       Spinarak      Togedemaru    Virizion
Bastiodon     Chansey       Darmanitan    Electrike     Gengar        Helioptile    Komala        Magcargo      Monferno      Pawniard      Raticate      Sewaddle      Spinda        Togekiss      Vivillon
Bayleef       Charizard     Dartrix       Electrode     Geodude       Heracross     Kommo-o       Magearna      Morelull      Pelipper      Rattata       Sharpedo      Spiritomb     Togepi        Volbeat
Beartic       Charjabug     Darumaka      Elekid        Gible         Herdier       Krabby        Magikarp      Mothim        Persian       Rayquaza      Shaymin       Spoink        Togetic       Volcanion
Beautifly     Charmander    Decidueye     Elgyem        Gigalith      Hippopotas    Kricketot     Magmar        Mr. Mime      Petilil       Regice        Shedinja      Spritzee      Torchic       Volcarona
Beedrill      Charmeleon    Dedenne       Emboar        Girafarig     Hippowdon     Kricketune    Magmortar     Mudbray       Phanpy        Regigigas     Shelgon       Squirtle      Torkoal       Voltorb
Beheeyem      Chatot        Deerling      Emolga        Giratina      Hitmonchan    Krokorok      Magnemite     Mudkip        Phantump      Regirock      Shellder      Stantler      Tornadus      Vullaby
Beldum        Cherrim       Deino         Empoleon      Glaceon       Hitmonlee     Krookodile    Magneton      Mudsdale      Pheromosa     Registeel     Shellos       Staraptor     Torracat      Vulpix
Bellossom     Cherubi       Delcatty      Entei         Glalie        Hitmontop     Kyogre        Magnezone     Muk           Phione        Relicanth     Shelmet       Staravia      Torterra      Wailmer
Bellsprout    Chesnaught    Delibird      Escavalier    Glameow       Ho-Oh         Kyurem        Makuhita      Munchlax      Pichu         Remoraid      Shieldon      Starly        Totodile      Wailord
Bergmite      Chespin       Delphox       Espeon        Gligar        Honchkrow     Lairon        Malamar       Munna         Pidgeot       Reshiram      Shiftry       Starmie       Toucannon     Walrein
Bewear        Chikorita     Deoxys        Espurr        Gliscor       Honedge       Lampent       Mamoswine     Murkrow       Pidgeotto     Reuniclus     Shiinotic     Staryu        Toxapex       Wartortle
```

### string/arrayify
Based on:
* columnify v1.5.4
  * https://github.com/timoxley/columnify
  * Render data in text columns. Supports in-column text-wrap.
```js
const arrayify = require('@offirmo/cli-toolbox/string/arrayify')

const data = {
	"commander@0.6.1": 1,
	"minimatch@0.2.14": 3,
	"mkdirp@0.3.5": 2,
	"sigmund@1.0.0": 3
}

console.log(arrayify(data))
```
output:
```
KEY              VALUE
commander@0.6.1  1
minimatch@0.2.14 3
mkdirp@0.3.5     2
sigmund@1.0.0    3
```

### string/log-symbols
Based on:
* log-symbols v4.0.0
  * Colored symbols for various log levels. Example: `✔︎ Success`
```js
const logSymbols = require('@offirmo/cli-toolbox/string/log-symbols')

console.log(logSymbols.info, 'info')
console.log(logSymbols.success, 'success')
console.log(logSymbols.warning, 'warning')
console.log(logSymbols.error, 'error')
```
output:
```
ℹ info
✔ success
⚠ warning
✖ error
```
