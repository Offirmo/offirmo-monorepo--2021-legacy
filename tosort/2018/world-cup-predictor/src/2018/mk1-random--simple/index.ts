import {PredictionRequest, PredictionResult} from '../../types'

import { pickRandom } from '../../helpers/random'

function predict(request: PredictionRequest): PredictionResult {

	const possible_output: Array<PredictionResult['winner']> = [
		request.team1,
		request.team2,
	]

	return {
		winner: pickRandom(...possible_output)
	}
}

export default predict

