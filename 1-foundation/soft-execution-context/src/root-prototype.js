//import EventEmitter from './forks/emittery_0.3.0'
import EventEmitter from 'emittery'

/////////////////////

const ROOT_PROTOTYPE = Object.create(null)

ROOT_PROTOTYPE.emitter = new EventEmitter()

/////////////////////

export {
	ROOT_PROTOTYPE,
}
