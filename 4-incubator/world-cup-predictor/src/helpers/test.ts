import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { RoundType, Team, PredictionRequest, PredictionResult, Predictor } from '../types'

const DEFAULT_EXAMPLE: PredictionRequest = {
	"round": "Group",
	"match": 5,
	"team1": "Australia",
	"team2": "France",
	"results": [
		{
			"match": 1,
			"round": "Group",
			"team1": {
				"name": "Russia",
				"score": 1,
				"winner": true
			},
			"team2": {
				"name": "Saudi Arabia",
				"score": 0,
				"winner": false
			}
		},
		{
			"match": 2,
			"round": "Group",
			"team1": {
				"name": "Egypt",
				"score": 2,
				"winner": false
			},
			"team2": {
				"name": "Uruguay",
				"score": 3,
				"winner": true
			}
		},
		{
			"match": 3,
			"round": "Group",
			"team1": {
				"name": "Portugal",
				"score": 2,
				"winner": false
			},
			"team2": {
				"name": "Spain",
				"score": 2,
				"winner": false
			}
		},
		{
			"match": 4,
			"round": "Group",
			"team1": {
				"name": "Morocco",
				"score": 1,
				"winner": true
			},
			"team2": {
				"name": "Iran",
				"score": 0,
				"winner": false
			}
		}
	]
}


function iterateXTimes(fn: (iteration: number) => void, times = 10): void {
	for(let iteration = 0; iteration<10; ++iteration) {
		fn(iteration)
	}
}

interface ExpectFunctionParams {
	request: PredictionRequest
	result: PredictionResult
	debugId: string
	iteration: number
}

function assertBasic(request: PredictionRequest, result: PredictionResult, debugId: string): void {
	if (request.round === RoundType.Group)
		expect(result.winner === request.team1 || result.winner === request.team2 || result.winner === 'draw', debugId).to.be.true
	else
		expect(result.winner === request.team1 || result.winner === request.team2, debugId).to.be.true
}

function iterateOverPossibleCases(
	predict: Predictor,
	expectFn: (params: ExpectFunctionParams) => void): void {

	function test(request: PredictionRequest, iteration: number): void {
		const debugId = `when predicting ${request.team1} vs ${request.team2} in ${request.round} #${iteration}`
		const result: PredictionResult = predict(request)
		assertBasic(request, result, debugId)
		expectFn({request, result, debugId, iteration})
	}

	iterateXTimes(iteration => {
		test(DEFAULT_EXAMPLE, iteration)
	})

	Enum.values(RoundType).forEach(round => {
		Enum.values(Team).forEach(team1 => {
			Enum.values(Team).forEach(team2 => {
				if (team2 === team1) return

				const request: PredictionRequest = {
					round,
					match: 1,
					team1,
					team2,
					results: [],
				}

				iterateXTimes(iteration => {
					test(request, iteration)
				})
			})
		})
	})
}

export {
	iterateXTimes,
	ExpectFunctionParams,
	iterateOverPossibleCases,
}
