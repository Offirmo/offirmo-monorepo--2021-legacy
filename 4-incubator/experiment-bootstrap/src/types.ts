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


interface Feedback {
	type: 'error' | 'warning',
	msg: string
	details: Object
}

interface Requirement<T> {
	key: string
	resolver: (params: Partial<T>) => Promise<boolean>
}

interface ResolvedExperiment {
	isOn: boolean
	initialCohort?: Cohort

	shouldRun: boolean
	cohort: Cohort
	ineligibilityReasons: string[];

	feedback: Feedback[]
}


/*
export type CohortPicker = () => Cohort;

export type Checker = () => boolean;

export type Requirements = {
  [string]: Checker,
};

export type TriggerAnalyticsFn = (
  eventId: string,
  details?: { [string]: boolean | number | string | null | void },
) => void;

export type BaseContext = {|
  experimentKey: string,
  cohort: Cohort,
  shouldRun: boolean,

  triggerAnalytics: TriggerAnalyticsFn,
|};

export type ExtraContext = {
  [string]: any,
};
*/

export {
	Cohort,
	Feedback,
	Requirement,
	ResolvedExperiment,
}
