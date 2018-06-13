import { expect } from 'chai'
import { Enum } from 'typescript-string-enums'

import { RoundType, Team, PredictionRequest, PredictionResult, Predictor } from './types'

describe('types', function() {

	describe('Team', function() {

		it('should match the inputs', () => {
			[
				'Russia',
				'Germany',
				'Brazil',
				'Portugal',
				'Argentina',
				'Belgium',
				'Poland',
				'France',
				'Spain',
				'Peru',
				'Switzerland',
				'England',
				'Colombia',
				'Mexico',
				'Uruguay',
				'Croatia',
				'Denmark',
				'Iceland',
				'Costa Rica',
				'Sweden',
				'Tunisia',
				'Egypt',
				'Senegal',
				'Iran',
				'Serbia',
				'Nigeria',
				'Australia',
				'Japan',
				'Morocco',
				'Panama',
				'South Korea',
				'Saudi Arabia',
			].forEach(teamStr => {
				expect(Enum.isType(Team, teamStr), teamStr).to.be.true
			})
		})
	})
})
