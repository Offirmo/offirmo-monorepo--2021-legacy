import { STYLES } from './consts';

import {
	ExperimentInternal,

	getKey,
	isActive,
	isResolved,
	hasError,
} from '@atlassian/experiment-bootstrap/dist/src.es7.cjs/experiment'

type ExperimentDB = { [k: string]: Readonly<ExperimentInternal<any>> }

const BUG_ICON = '💣💥';
const RESOLVING_ICON = '🔄'
const INACTIVE_ICON = '⏸️'
const COHORT_TO_EMOTICON: { [k: string]: string } = {
	'not-enrolled': '⛔',
	'control': '❎',
	'variation': '✅',
	'variation-1': '✅1️⃣',
	'variation-2': '✅2️⃣',
	'variation-3': '✅3️⃣',
	'variation-4': '✅4️⃣',
};


function getIconForExperiment(state: Readonly<ExperimentInternal<any>>) {
	if (hasError(state)) return BUG_ICON

	if (isResolved(state)) return COHORT_TO_EMOTICON[state.publicResult.cohort] || '❓'

	if (isActive(state)) return RESOLVING_ICON

	return INACTIVE_ICON
}

/*
function printRequirements(requirements: Readonly<ExperimentSpec['requirements']>) {
	const keys = Object.keys(requirements);
	console.groupCollapsed(
		`%c%c${keys.length}%c requirements`,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
	);
	keys.forEach(key => {
		try {
			const met: boolean = requirements[key]();
			console.log(`%c${met ? '☑' : '☐'} ${key}`, STYLES.reset);
		} catch (err) {
			console.error(`${BUG_ICON} ${key}: ${err.message}`);
		}
	});
	console.groupEnd();
}

function printResolvedTouchpoint(
	resolvedExperiment: ResolvedExperiment,
	resolvedTouchpoint: ResolvedTouchpoint,
) {
	const { touchpoint, cohort, unenrollmentReason, err } = resolvedTouchpoint;
	const { touchpointKey, extraRequirements, experiment } = touchpoint;
	console.groupCollapsed(
		`%c${getIconForResolvedTouchpoint(
			resolvedTouchpoint,
		)} %c${touchpointKey}%c: ${cohort}${
			unenrollmentReason ? ` (reason: ${unenrollmentReason})` : ''
			}`,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
	);
	if (err) {
		if (resolvedExperiment.err || experiment.err)
			console.error(
				`${BUG_ICON} Error inherited from parent experiment! (see above)`,
			);
		if (
			touchpoint.err &&
			touchpoint.err !== resolvedExperiment.err &&
			touchpoint.err !== experiment.err
		)
			console.error(`${BUG_ICON} Error during declaration!`, touchpoint.err);
		if (
			err !== touchpoint.err &&
			err !== resolvedExperiment.err &&
			err !== experiment.err
		)
			console.error(`${BUG_ICON} Error during resolution!`, err);
	}
	printRequirements(extraRequirements);
	console.groupEnd();
}
*/

function printExperiment(db: ExperimentDB, state: Readonly<ExperimentInternal<any>>) {
	/*
	const {
		experiment,
		initialCohort,
		cohort,
		unenrollmentReason,
		err,
	} = resolvedExperiment;
	const { key: experimentKey, requirements } = experiment;
	const EXPERIMENT_RESOLVED_TOUCHPOINTS: ResolvedTouchpoint[] = RDB.resolvedTouchpoints.filter(
		rt => rt.touchpoint.experiment.key === experimentKey,
	);
	const aggregatedData = EXPERIMENT_RESOLVED_TOUCHPOINTS.reduce(
		(acc: Object, resolvedTouchpoint): Object => {
			acc.touchpointCount++;
			if (resolvedTouchpoint.cohort !== 'not-enrolled')
				acc.enrolledTouchpointCount++;
			if (resolvedTouchpoint.meta.isActive) acc.activeTouchpointCount++;
			return acc;
		},
		{
			touchpointCount: 0,
			activeTouchpointCount: 0,
			enrolledTouchpointCount: 0,
		},
	);
	//console.log({aggregatedData})
	*/

	let intro_line = `${getIconForExperiment(state)} %c%c${getKey(state)}%c:`
	// @ts-ignore
	console.groupCollapsed(
		intro_line,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
	);

	/*
		console.groupCollapsed(
		`${getIconForExperiment(state)} %c%c${getKey(state)}%c: ${cohort}${
			unenrollmentReason ? ` (reason: ${unenrollmentReason})` : ''
			}; Touchpoints: %c${aggregatedData.touchpointCount}%c declared, %c${
			aggregatedData.activeTouchpointCount
			}%c active, %c${aggregatedData.enrolledTouchpointCount}%c enrolled`,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
	);
	if (err) {
		if (experiment.err)
			console.error(`${BUG_ICON} Error during declaration!`, experiment.err);
		if (err !== experiment.err)
			console.error(`${BUG_ICON} Error during resolution!`, err);
	}
	if (cohort !== initialCohort) {
		console.log(`%cInitial cohort: ${String(initialCohort)}`, STYLES.reset);
	}
	printRequirements(requirements);
	console.group(
		`%c%c${EXPERIMENT_RESOLVED_TOUCHPOINTS.length}%c declared touchpoints:`,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
	);
	EXPERIMENT_RESOLVED_TOUCHPOINTS.forEach(
		printResolvedTouchpoint.bind(null, resolvedExperiment),
	);
	console.groupEnd();
	*/
	console.groupEnd();
}


export function list(db: ExperimentDB) {
	console.log('list', db);
	const experiments: Readonly<ExperimentInternal<any>>[] = Object.values(db)

	const aggregatedData = experiments.reduce(
		(acc, experiment) => {
			acc.experimentCount++;
			if (isActive(experiment))
				acc.activeExperimentCount++;
			if (isResolved(experiment) && experiment.publicResult.cohort !== 'not-enrolled')
				acc.enrolledExperimentCount++;
			return acc;
		},
		{
			experimentCount: 0,
			activeExperimentCount: 0,
			enrolledExperimentCount: 0,
		},
	);
	console.group(
		`%cExperiments: %c${aggregatedData.experimentCount}%c declared, %c${
			aggregatedData.activeExperimentCount
			}%c active, %c${aggregatedData.enrolledExperimentCount}%c enrolled`,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
		STYLES.strong,
		STYLES.reset,
	);
	experiments.forEach(e => printExperiment(db, e));
	console.groupEnd();
}
