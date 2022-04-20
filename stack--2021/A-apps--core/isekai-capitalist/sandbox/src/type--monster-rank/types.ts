/* Monster/Enemies classification

https://en.wikipedia.org/wiki/International_Nuclear_Event_Scale

 * Examples:
   - https://tensura.fandom.com/wiki/Rank
   - https://tensura.fandom.com/wiki/WN/Rank

 See also:
 * https://www.thesaurus.com/browse/devastation
 * http://scp-wiki.wikidot.com/object-classes
 */
import { Enum } from 'typescript-string-enums'


export const MonsterRank = Enum(
	'disturbance', // E, non-life-threatening, ex. damage to harvest
	'hazard',      // D, single life threatening
	'ravage',      // C,B village or smaller
	'calamity',    // B,A city
	'disaster',    // A single country
	'devastation', // A,S whole country
	'catastrophe', // xS, several countries
	'cataclysm',   // xSSR, continent
	'apocalypse',  // xSSR, planet
)
export type MonsterRank = Enum<typeof MonsterRank> // eslint-disable-line no-redeclare



/*
https://tensura.fandom.com/wiki/WN/Rank

Hazard-class: A threat that could potentially cause widespread damage to a single town or region.
	Includes the Ranks A+, A and A-.

A/Calamity-class: A threat that could topple a nation's government, caused by the maneuvering of high-level Majin and demons.

S/Disaster-class: Normally applied to demon lords. Small nations would have no chance against such a threat, and a larger one would need to expend all its resources to handle it.
	Just being a Demon Lord Seed by itself is not enough to qualify for Disaster-class, as for example Orc Disaster Geld, only advanced from Hazard-class as Orc Lord to Calamity-class as Orc Disaster. However, being accepted into the Ten Great Demon Lords or later Octagram immediately warrants the newcomer to the "Demon Lords' club" to be considered S Rank.

SS/Catastrophe-class: This applied only to some demon lords, as well as True Dragons, and reflected the kind of threat that no single nation could handle. It would require international cooperation to give the human race even a chance at survival.

 */
