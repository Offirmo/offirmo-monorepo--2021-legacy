import EventEmitter from 'emittery'

/////////////////////

const ROOT_PROTOTYPE = Object.create(null)

// global bus shared by all SECs
ROOT_PROTOTYPE.emitter = new EventEmitter()

/////////////////////

export {
	ROOT_PROTOTYPE,
}
