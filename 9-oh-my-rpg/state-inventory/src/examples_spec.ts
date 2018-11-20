/////////////////////

import {expect} from 'chai'

import {LIB} from './consts'
import {get_lib_SEC} from './sec'
import { DEMO_STATE } from './examples'
import { migrate_to_latest } from './migrations'

/////////////////////

describe(`${LIB} - examples`, function() {
	describe('DEMO_STATE', function () {
		it('should be stable and up to date', () => {
			const migrated = migrate_to_latest(get_lib_SEC(), DEMO_STATE)
			expect(migrated).to.equal(DEMO_STATE)
		})
	})
})
