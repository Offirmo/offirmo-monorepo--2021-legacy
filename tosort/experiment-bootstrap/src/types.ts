import { Enum } from 'typescript-string-enums'

const Cohort = Enum(
	'not-enrolled',
	'control',
	'variation',
	'variation-1',
	'variation-2',
	'variation-3',
	'variation-4',
)
type Cohort = Enum<typeof Cohort> // eslint-disable-line no-redeclare

type RequirementResolver<T> = (params: Partial<T>) => boolean | Promise<boolean>

interface Requirement<T> {
	key: string
	resolver: RequirementResolver<T>
}

interface Feedback {
	type: 'error' | 'warning',
	msg: string
	details: Object
}

interface ResolvedExperiment {
	// react interface
	cohort: Cohort
	isEligible: boolean
	ineligibilityReasons: string[]

	// extras
	shouldRun: boolean
	feedback: Feedback[]
}


export {
	Cohort,
	Feedback,
	Requirement,
	ResolvedExperiment,
}
