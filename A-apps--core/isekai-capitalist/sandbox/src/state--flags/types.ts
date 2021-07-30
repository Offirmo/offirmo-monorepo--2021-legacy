import { Enum } from 'typescript-string-enums'
import { BaseState } from '@offirmo-private/state-utils'

/*
There are usually 4 common goals for a film’s story. Will your story be about:
- Winning?
- Escaping?
- Stopping something or someone?
- Retrieving something of value?


We were taught the 3 act structure mirroring the Hero’s Journey popularised by Joseph Campbell in his 1949 work The Hero with a Thousand Faces, where the:
- 1st Act sets context of the status quo, with an inciting incident that causes the world to change and a call to adventure for the hero.
- 2nd Act has escalating challenges in the main plot that the hero faces, and the introduction of a secondary plot (e.g. a love story strengthening the main plot) coming full circle in the 3rd Act.
- 3rd Act results in a resolution, climax or twist that the hero experiences to the point of no return, which results in a new status quo in the world.

Dan Harmon (creator of Rick and Morty and Community) has since simplified the theory into 8 steps:
- Establish a protagonist (You) - A character is in a zone of comfort.
- Something ain’t quite right (Need) - We learn that things aren’t perfect in our hero’s universe, setting the stage for external conflict.
- Crossing the Threshold (Go) - They enter an unfamiliar situation, and begin their journey.
- The Road of Trials (Search) - They adapt to their unfamiliar situation. They gain the skills they’ll need to achieve their goals and return home.
- Meeting with the Goddess (Find) - They get what they wanted. The Need (number 2) is fulfilled.
- Pay the Price (Take) - They pay a price for achieving their goal, but a secondary goal is achieved.
- Bringing it Home (Return) - They cross the return threshold, and come back to where they started.
- Master of both Worlds (Change) - The protagonist is in control of their situation, having changed.

A good story always contains conflicts, of which it can be broken down into:
- External: escalating challenges in the short-term as the world changes - or tactics.
- Internal: decisions with significant impacts on long-term success - or strategy.

Beats
We analysed the script and were asked to identify the parts where we thought were important.
This is usually something where there is a change from the status quo - it could be a new character introduced, the meeting of hearts, a power dynamic change between characters or a climax/twist.
We call this a beat. A short film like this (~10 minutes) will probably have a maximum of 5-6 beats, so we started with around 10+ beats and culled it to 6 core ones.
Of all the different beats, there will be the heart of the film in one of the beats. If we had to only show one scene, this will be the beat that we will show.
 */

// Inspired from:
// - 10 great pleasures https://appliedjung.com/an-internal-singularity/
// - The 5 Basic Levels of Life’s Pleasures https://www.yogajournal.com/yoga-101/philosophy/feels-good/
// - https://en.wikipedia.org/wiki/The_Top_Five_Regrets_of_the_Dying
// (don't have to tick them all)
export const LifeGreatness = Enum(
	// sorted by Maslow

	// physiological
	'great_food', // or drink
	//'~no_self_pressure', // not worked so hard
	//'let_go_and_be_happy',

	// safety
	'great_physical_condition',
	'able_to_defend_oneself',

	// belongness and love needs
	'a_place_to_call_home',
	'good_friends',
	'intimacy', // with a partner
	'happy_home',
	'children',

	// esteem needs, prestige, accomplishments
	'being_true_to_oneself',
	'making_a_difference',
	'being_expert_at_sth',
	'improving_the_civilization',

	// self actualization, full potential, creative activities
	'stimulating_conversation',
	'great_book',
	'great_art',
	'travelling',
	'ruling_the_world',
)
export type LifeGreatness = Enum<typeof LifeGreatness> // eslint-disable-line no-redeclare



export interface State extends BaseState {
	has_saved_the_world: boolean

	great_life_experiences_count: {
		[k: string]: number // LifeGreatness
	}
}
