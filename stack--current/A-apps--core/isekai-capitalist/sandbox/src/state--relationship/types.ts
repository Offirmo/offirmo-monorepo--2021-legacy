import { Enum } from 'typescript-string-enums'
import { BaseState } from '@offirmo-private/state-utils'

import { RelationshipLevel } from '../type--relationship-level'


/*
Translations of fidélité
loyalty
fidélité, loyauté, dévouement
fidelity
fidélité, loyauté, exactitude
faithfulness
fidélité, loyauté
accuracy
précision, exactitude, justesse, fidélité
faith
foi, confiance, religion, croyance, fidélité
trustworthiness
fiabilité, loyauté, fidélité
constancy
constance, stabilité, fidélité, fermeté, indéfectibilité
closeness
proximité, fermeture, fidélité
trustfulness
fidélité, loyauté
nearness
proximité, intimité, fidélité, exactitude
steadiness
stabilité, fermeté, régularité, solidité, ténacité, fidélité
 */

export const SharedMemoryType = Enum(
	'life_pleasure', // ex. treats etc.
	'victory', // big or little
	'celebration', // after a victory, anniversary...
	'growth', // shared growth, rite of passage
	'intimacy', // increase in level, trust, psychological safety...
	'assistance', // mental or physical assistance, ex. rescue or emotional support
	'adventure', // anything else ending as a "good story to tell"
)
export type SharedMemoryType = Enum<typeof SharedMemoryType> // eslint-disable-line no-redeclare


export interface State extends BaseState {
	memories: {
		count: number,
		recent_pipeline: string // emoji summary of recent memories
	}
	level: RelationshipLevel
}
