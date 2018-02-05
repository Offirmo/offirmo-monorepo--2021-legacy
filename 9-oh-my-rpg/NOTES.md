
TOREAD https://josephg.com/blog/fixing-fortnite/

Schema:
http://www.vertabelo.com/blog/technical-articles/a-song-of-ice-and-databases-a-game-of-thrones-data-model



## Misc / TOSORT

### Interesting reads:
* https://github.com/Offirmo-team/wiki/wiki/RPG
* https://gamedevelopment.tutsplus.com/categories/game-design
  * https://gamedevelopment.tutsplus.com/tutorials/making-difficult-fun-how-to-challenge-your-players--cms-25873
* ;-) https://gamedevelopment.tutsplus.com/articles/3-questions-to-help-you-finish-your-first-game--gamedev-9576
* https://github.com/mozilla/BrowserQuest




TODO
* immutabilité https://github.com/mweststrate/immer
* CQRS
  if switch to immutable: change all action parameters to Readonly<State>
* time
  * seasonal content
* countdowns
* accumulator on non-play
- energy/rate limit
- windows support
- more tips (equip)
- non tty
- check new version
- more adventures with good distrib
- social/virality server
- stride
- error reporting
- analytics
- savegame backup
- achievements
- non-repeatability
- slack
- re-seeding

Marketing
- shareable web page
- news
- live démo

bugs:
- full inventory
- display on windows

TODO:
- luck should have an effect: more money, more chance to gain artifacts, etc.
- funny negative adventure
- battles

Otherworlder: https://www.dandwiki.com/wiki/Otherworlder_(5e_Background)


/*
.pushText(''
	+ 'Great sages prophesied your coming,{{br}}'
	+ 'commoners are waiting for their hero{{br}}'
	+ 'and kings are trembling from fear of change...{{br}}'
	+ '…undoubtedly, you’ll make a name in this world and fulfill your destiny!{{br}}'
	+ '{{br}}'
)
.pushStrong('A great saga just started.')
*/


https://github.com/f/graphql.js




Priest = ce qui devrait être
besoin d'un cœur pur sans préjugés
rare, difficile d'accès


Content:
* stories
  * https://ifcomp.org/comp/2017
  * http://mangakakalot.com/chapter/the_great_ruler/chapter_21
* pics
  * https://www.pinterest.com.au/athn1/commoner-for-dd/
  * https://lonewolfangel.deviantart.com/favourites/63788883/Fantasy-Male
  * https://www.pinterest.com.au/msquirewriting/fantasy-art/
  * https://deathbornaeon.deviantart.com/favourites/69459555/Druids-and-Shamans
* world
  * http://forgottenrealms.wikia.com/wiki/Main_Page
  




https://getavataaars.com/?accessoriesType=Wayfarers&avatarStyle=Circle&clotheColor=PastelRed&clotheType=Hoodie&eyeType=Dizzy&eyebrowType=RaisedExcitedNatural&hairColor=Platinum&mouthType=Serious&ref=producthunt&skinColor=Brown&topType=LongHairFroBand

http://paizo.com/pathfinderRPG

http://idlerpg.net/


emotions: https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/563b31ea778daf121cc3a5fa
    "anger": 0.00300731952,
      "contempt": 5.14648448E-08,
      "disgust": 9.180124E-06,
      "fear": 0.0001912825,
      "happiness": 0.9875571,
      "neutral": 0.0009861537,
      "sadness": 1.889955E-05,
      "surprise": 0.008229999
    



https://games.slashdot.org/story/17/05/29/0632250/esr-announces-the-open-sourcing-of-the-worlds-first-text-adventure
https://gamedevelopment.tutsplus.com/categories/game-design


https://github.com/rangle/typed-immutable-record

http://mewo2.com/notes/naming-language/
http://mewo2.com/notes/terrain/ Generating fantasy maps
https://github.com/dariusk/NaNoGenMo-2015/issues/156

			/*
			const header = _.map(schema.properties, (val, key) => ({
				value: key,
				align : 'left',
			}))
			 const t = Table(header,raw_data, {
				borderColor : "blue",
				paddingBottom : 0,
			})
			console.log(t.render())
			*/
			

randoms: [number, number, number, number, number, number]



/*
 import {
 ACTIVATE_LOCATION
 } from './actions';

 import { Map } from 'immutable';

 const initialState = Map({})

 export let ui = (state = initialState, action) => {
 switch (action.type) {
 case ACTIVATE_LOCATION:
 return state.set('activeLocationId', action.id);
 default:
 return state;
 }
 };
 */


declare module "random-js" {
	export = random;
}


