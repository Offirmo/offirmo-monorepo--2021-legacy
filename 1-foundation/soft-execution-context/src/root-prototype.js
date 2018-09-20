import EventEmitter from 'emittery'

/////////////////////

const ROOT_PROTOTYPE = Object.create(null)

// global bus shared by all SECs
ROOT_PROTOTYPE.emitter = new EventEmitter()

// common functions

// because we often set the same details
ROOT_PROTOTYPE.setAnalyticsAndErrorDetails = function setAnalyticsAndErrorDetails(details = {}) {
	const SEC = this
	return SEC
		.setAnalyticsDetails(details)
		.setErrorReportDetails(details)
}

/////////////////////

export {
	ROOT_PROTOTYPE,
}
