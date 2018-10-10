import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'


import { RoundType, Team, PredictionRequest, PredictionResult, Predictor } from '../../types'

import {
	iterateXTimes,
	ExpectFunctionParams,
	iterateOverPossibleCases,
} from '../../helpers/test'


import predict from '.'



describe('FIFA world cup 2018 predictor mk2', function() {

	context('when used on random data', () => {

		it('should return one of the teams or draw in Group stage', function () {
			this.timeout(5000)
			iterateOverPossibleCases(predict, ({debugId, result}: ExpectFunctionParams) => {
				//console.log(debugId, '=', result.winner)
			})
		})
	})
})
