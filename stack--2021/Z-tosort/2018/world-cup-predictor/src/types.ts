
import { Enum } from 'typescript-string-enums'

const RoundType = Enum(
	'Group',
	'Round of 16',
	'Quarter-final',
	'Semi-final',
	'Third place play-off',
	'Final',
)
type RoundType = Enum<typeof RoundType> // eslint-disable-line no-redeclare


const Team = Enum(
	'Argentina',
	'Australia',
	'Belgium',
	'Brazil',
	'Colombia',
	'Costa Rica',
	'Croatia',
	'Denmark',
	'Egypt',
	'England',
	'France',
	'Germany',
	'Iceland',
	'Iran',
	'Japan',
	'Mexico',
	'Morocco',
	'Nigeria',
	'Panama',
	'Peru',
	'Poland',
	'Portugal',
	'Russia',
	'Saudi Arabia',
	'Senegal',
	'Serbia',
	'South Korea',
	'Spain',
	'Sweden',
	'Switzerland',
	'Tunisia',
	'Uruguay',
)
type Team = Enum<typeof Team> // eslint-disable-line no-redeclare

interface MatchResult {
	match: number
	round: RoundType
	team1: {
		name: Team
		score: number
		winner: boolean
	}
	team2: {
		name: Team
		score: number
		winner: boolean
	}
}


interface PredictionRequest {
	round: RoundType
	match: number
	team1: Team
	team2: Team
	results: MatchResult[]
}

interface PredictionResult {
	winner: Team | 'draw'
}

type Predictor = (request: PredictionRequest) => PredictionResult

export {
	RoundType,
	Team,
	MatchResult,
	PredictionRequest,
	PredictionResult,
	Predictor,
}
