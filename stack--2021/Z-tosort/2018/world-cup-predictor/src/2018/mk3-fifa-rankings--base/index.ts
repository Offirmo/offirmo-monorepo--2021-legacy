import {Team, PredictionRequest, PredictionResult} from '../../types'
import {FIFA_RANKING} from '../../datasets/2018'

function predict(request: PredictionRequest): PredictionResult {
	if (request.team1 === 'Russia' || request.team2 === 'Russia')
		return { winner: Team['Russia']}

	const team1_fifa_points: number = FIFA_RANKING[request.team1]
	const team2_fifa_points: number = FIFA_RANKING[request.team2]

	return {
		winner: team1_fifa_points > team2_fifa_points
			? request.team1
			: request.team2
	}
}

export default predict

