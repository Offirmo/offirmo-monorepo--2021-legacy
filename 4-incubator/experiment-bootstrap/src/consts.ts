import { Enum } from 'typescript-string-enums'

import { Cohort } from './types'

export const LIB = 'XBL'
export const DEBUG = true // TODO remove usages

// https://browsehappy.com/
// 14/01/2019
export const LATEST_CHROME_VERSION = 72
export const LATEST_FIREFOX_VERSION = 65

export const POSSIBLE_COHORTS = Enum.keys(Cohort)
