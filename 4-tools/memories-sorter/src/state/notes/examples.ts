import { Immutable, enforce_immutability } from '@offirmo-private/state-utils'

import { SCHEMA_VERSION } from './consts'
import { State } from './types'
import { PersistedNotes as FileNotes } from '../file'
import { Basename, SimpleYYYYMMDD } from '../../types'

/////////////////////

// needed to test migrations, both here and in composing parents

// a full featured, non-trivial demo state
// needed for demos

const DEMO_STATE: Immutable<State> = enforce_immutability<State>({
	_comment: 'This data is from @offirmo/photo-sorter https://github.com/Offirmo/offirmo-monorepo/tree/master/5-incubator/active/photos-sorter',
	schema_version: SCHEMA_VERSION,
	revision: 0,
	last_user_investment_tms: 1613965853218,

	'encountered_files': {

		'1a78788de0e03b60824166b7e17a86668c052067655c54842c0abcb484c2ab93': {
			historical: {
				'basename': 'Image from iOS (15).jpg',
				'parent_path': '',
				'fs_bcd_tms': 1571961828388,
				'neighbor_hints': {
					'fs_bcd_assessed_reliability': 'unknown'
				},
			},
			// user data
			deleted: undefined,
			starred: undefined,
			manual_date: undefined,
			// meta
			best_date_afawk_symd: undefined,
			// debug
			currently_known_as: 'Image from iOS (15).jpg',
			renaming_source: undefined,
		},

		'ce6b3d3128a28331db2a25c42671a3793af557454165aa5a1d56c71160cb291c': {
			historical: {
				'basename': 'IMG_1474.JPG',
				'parent_path': '',
				'fs_bcd_tms': 1566873905000,
				'neighbor_hints': {
					'fs_bcd_assessed_reliability': 'unreliable'
				},
				'exif_orientation': 6
			},
			// user data
			deleted: undefined,
			starred: undefined,
			manual_date: undefined,
			// meta
			best_date_afawk_symd: undefined,
			// debug
			'currently_known_as': 'MM2019-08-27_12h45m05s158_IMG_1474.jpg',
			'renaming_source': 'exif'
		},


		'324c096dc39b96d71a73bfa558f0bdddb708c226f0f13bb231a548208257b857': {
			historical: {
				'basename': 'CLIP0003.AVI',
				'parent_path': '2003/88- St Gilles',
				'fs_bcd_tms': 1052375074000,
				'neighbor_hints': {
					'fs_bcd_assessed_reliability': 'reliable'
				}
			},

			// user data
			deleted: undefined,
			starred: undefined,
			manual_date: undefined,
			// meta
			best_date_afawk_symd: undefined,
			// debug
			currently_known_as: 'CLIP0003.avi',
			renaming_source: 'historical_fs+historical_env_hints',
		},

		'fb7b013a830e451de2dfc444d5eaa9af9f67e1eb7f542a422d835cd3123d5e29': {
			historical: {
				basename: 'MM2020-01-01_17h57m29s625_IMG_8763.jpg',
				parent_path: '2020/20200101 - life',
				fs_bcd_tms: 1581630576844,
				'neighbor_hints': {
					'fs_bcd_assessed_reliability': 'unknown'
				},
			},

			// user data
			deleted: undefined,
			starred: undefined,
			manual_date: undefined,
			// meta
			best_date_afawk_symd: undefined,
			// debug
			currently_known_as: 'MM2020-01-01_17h57m29s625_IMG_8763.jpg',
			renaming_source: undefined,
		},

	},

	known_modifications_new_to_old: {
		// TODO
	},
})

/////////////////////

export {
	DEMO_STATE,
}
