/* Guild rank usually used in isekai mangas and games
 * Ref: https://en.wikipedia.org/wiki/Academic_grading_in_Japan
 * Examples:
   - https://tensura.fandom.com/wiki/Rank
   - https://tensura.fandom.com/wiki/WN/Rank
   * Novice -> Beginner -> Intermediate -> Advanced

 * See also: https://solo-leveling.fandom.com/wiki/System?commentId=4400000000000001032&replyId=4400000000000002801
 */
import { Enum } from 'typescript-string-enums'


export const SSRRank = Enum(
	'F',
	'E',
	'D',
	'C',
	'B',
	'A',
	'S',
	'SS',
	'SSR',
)
export type SSRRank = Enum<typeof SSRRank> // eslint-disable-line no-redeclare




/*
	[tensura] Rank B and below adventurers aren't famous enough to be known outside their country's borders.

	'F', // [Fail, not used in every isekai, should be counted as very weak]
	// summary: tutorial rank
	// Guild manual: rank F is the starting rank = training rank,
	// you can quickly climb to rank E once you demonstrate basic understanding of the guild rules and basic adventuring knowledge
	// Requirements:
	// - NONE

	'E', // [NOT present in academic grading but present in mangas/manhwas]
	// summary: junior rank
	// Guild manual: rank E is a learning rank,
	// you should be constantly learning at this stage, asking questions, occasionally joining higher level parties
	// Requirements:
	// - guild knowledge exam: E rank
	// - power: NONE
	// - experience: at least TODO guild experience points
	// - cross-recognition: NONE

	'D', // [average]
	// summary: middle/common
	// Guild manual: rank D is one of the main force of adventurers
	// you should be an efficient member of your party
	// Requirements:
	// - guild knowledge: passing D-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: NONE

	'C',
	// summary: senior/common
	// Guild manual: rank C is one of the main force of adventurers
	// you are mentoring the juniors in your party, may start leading your party
	// Requirements:
	// - guild knowledge: passing C-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: NONE

	'B', // [good]
	// summary: middle/common
	// Guild manual: rank B is an experienced level
	// you may coordinate several parties during an outbreak
	// Requirements:
	// - guild knowledge: passing B-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: at least 2 countries

	[tensura] Rank A- and above humans are considered "Champions" by Human countries.

	'A', // [very good]
	// summary: TODO
	// Guild manual: TODO
	// Requirements:
	// - guild knowledge: passing B-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: at least TODO countries

	'S', // [max standard, would represent top ~10%]
	// summary: TODO
	// Guild manual: TODO
	// Requirements:
	// - guild knowledge: passing B-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: at least TODO countries

	// non-standard
	'SS', // "Special"
	// summary: TODO
	// Guild manual: TODO
	// Requirements:
	// - guild knowledge: passing B-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: at least TODO countries

	'SSR', // "Ranked"
	// summary: TODO
	// Guild manual: TODO
	// Requirements:
	// - guild knowledge: passing B-rank exam
	// - power: at least TODO
	// - experience: at least TODO guild experience points
	// - cross-recognition: at least TODO countries

* rank A can only be granted by agreement from the kingdom
* rank S and above can only be granted by a collective agreement of the neighboring kindoms
* rank SS is the top rank,
*/
