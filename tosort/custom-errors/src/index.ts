/* New Errors to be thrown,
 * to complement the rather limited js set.
 * Note : we keep the "error" naming scheme of javascript
 *
 * new hierarchy :
 * Error
 *  ExtendedError
 *   LogicError
 *    InvalidArgument
 *    LengthError
 *    OutOfRange
 *    InvariantNotMet
 *   RuntimeError
 *    NotImplemented
 *    UnknownEnumValue
 *    IllegalState
 */

// Note : extending js errors is not trivial at all ! cf.
// http://stackoverflow.com/questions/17530782/extending-javascript-error
// http://stackoverflow.com/questions/8802845/inheriting-from-the-error-object-where-is-the-message-property
// http://stackoverflow.com/questions/783818/how-do-i-create-a-custom-error-in-javascript
// http://stackoverflow.com/a/8804539/587407

const error_instance = Error // to clearly remind us that Error always return a new object
// cf. http://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1


// a base, for other exceptions to derive
// contrary to Error, this error will be correctly derivable
function ExtendedError(message_or_error) {
	// Note : This is ONE way to derive from error.
	// I find it convenient but I don't pretend it's the best

	let err, message

	if(message_or_error instanceof Error) {
		// we are wrapping an existing error
		err = message_or_error
		message = err.message
		// TODO other fields!
	}
	else {
		// we must create an error to have an up-to-date stacktrace
		// we must handle cases where given message is not a string
		message = '' + (message_or_error || '')
		err = new Error(message)
	}

	// Import everything needed into 'this' object
	// so it has the same prototype as an Error object.
	// We must copy manually due to Error object specificity.
	this.message = message // assign directly from param.
									// If we assign from err.message, FF sometimes fails to copy for unknown reasons
	this.stack = err.stack
	//XXX

	// fix stuff
	this.name = 'ExtendedError'
}
ExtendedError.prototype = Object.create(error_instance.prototype) // since we can't directly access Error.prototype
ExtendedError.prototype.constructor = ExtendedError


// now that we have a base error which is derivable
// wrap classical inheritance in this utility func to avoid code duplication
function create_custom_error(name, ParentErrorClass) {
	if (typeof ParentErrorClass === 'undefined') {
		ParentErrorClass = ExtendedError
	}

	function CustomExtendedErrorClass() {
		// Call the parent constructor
		ParentErrorClass.prototype.constructor.apply(this, arguments)
		this.name = name
	}
	CustomExtendedErrorClass.prototype = Object.create(ParentErrorClass.prototype)
	CustomExtendedErrorClass.prototype.constructor = CustomExtendedErrorClass

	return CustomExtendedErrorClass
}


// so we can create other custom errors outside of this module
extended_exceptions.ExtendedError = ExtendedError
extended_exceptions.create_custom_error = create_custom_error

// a first batch inspired by C++

// LogicError : represent problems in the internal logic of a program
// in theory, these are preventable, and even detectable before the program runs
// (e.g., violations of class invariants).
extended_exceptions.LogicError = create_custom_error('LogicError')

// invalid_argument thr. to report invalid arguments to functions.
extended_exceptions.InvalidArgument = create_custom_error('InvalidArgument', extended_exceptions.LogicError)

// length_error thr. when an object is constructed
// that would exceed its maximum permitted size
// (e.g., a basic_string instance).
extended_exceptions.LengthError = create_custom_error('LengthError', extended_exceptions.LogicError)

// out_of_range indicate an argument whose value
// is not within the expected range
// (e.g., boundary checks in basic_string).
extended_exceptions.OutOfRange = create_custom_error('OutOfRange', extended_exceptions.LogicError)

// runtime_error represent problems outside the scope
// of a program they cannot be easily predicted
// and can generally only be caught as the program executes.
extended_exceptions.RuntimeError = create_custom_error('RuntimeError')


// a second batch with other commonly needed errors

// when we encounter code not implemented
extended_exceptions.NotImplemented = create_custom_error('NotImplemented', extended_exceptions.RuntimeError)

// when we switch case on an enumerated var and don't recognize a value (usually a newly added one)
extended_exceptions.UnknownEnumValue = create_custom_error('UnknownEnumValue', extended_exceptions.RuntimeError)

// Signals that a method has been invoked at an illegal or inappropriate time.
// In other words, the application is not in an appropriate state for the
// requested operation.
extended_exceptions.IllegalState = create_custom_error('IllegalState', extended_exceptions.RuntimeError)

// Signals that an invariant (= stuff that should always be true) is not met
// This should, of course, never happen...
// https://en.wikipedia.org/wiki/Invariant_%28computer_science%29
extended_exceptions.InvariantNotMet = create_custom_error('InvariantNotMet', extended_exceptions.LogicError)

