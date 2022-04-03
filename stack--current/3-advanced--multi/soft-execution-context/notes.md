https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript


Advocacy
* Should catch errors
* what if endpoints?
* what if sub-lib need to signal problem?
* NOT It's in foo/index.js!
* YES It's in the ORM, when making a JOIN!



// get_own_function_name(arguments.callee)
function get_own_function_name(arguments_callee) {
	// https://www.tek-tips.com/viewthread.cfm?qid=1209619
	const FN_CODE = arguments_callee.toString()
	return FN_CODE
		.substr(0, FN_CODE.indexOf('('))  // trim off everything after the function name
		.substr('function '.length)       // trim off "function "
}



* Stack trace
* app/lib trace
*

Other attempts:
* Sentry Wrap() and Context()

About the deprecated "domains" feature in node.js
* https://nodejs.org/en/docs/guides/domain-postmortem/

Attempts to fix the hole
* https://stackoverflow.com/questions/33986859/what-is-the-alternative-to-node-js-domain-module
* https://stackoverflow.com/questions/33149785/alternative-to-domain-in-nodejs
* https://github.com/strongloop/zone/
* https://github.com/btford/zone.js/


TOREAD

* The absolute base
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/prototype
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#Exception_Handling_Statements
  * https://www.ecma-international.org/ecma-262/6.0/#sec-error-objects

https://github.com/sindresorhus/serialize-error
https://github.com/sindresorhus?utf8=%E2%9C%93&tab=repositories&q=error&type=&language=


https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript


Standard fields:
*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types
      https://stackoverflow.com/questions/1382107/whats-a-good-way-to-extend-error-in-javascript
      https://www.ecma-international.org/ecma-262/5.1/#sec-15.11.1
      https://github.com/sindresorhus/aggregate-error


https://www.npmjs.com/package/universal-analytics


* TODO stoppable
* TODO logger ?


"logical stack trace" vs. "technical stack trace"

meta-feedback, back pressure, like "I upgraded the schema", "maybe misconfiguration", etc.

logger

"triage"

"details"

correct error extension

Sentry
* Sentry supports a concept called Breadcrumbs, which is a trail of events which happened prior to an issue https://docs.sentry.io/learn/breadcrumbs/
* releases

React
* error boundaries https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html


/**
 * An exception to skip execution of the experiment.
 *
 * This class has been extended without using ES6 so that "instanceof" works as intended.
 *
 * See:
 * https://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

function WithdrawExperimentException(message) {
  this.name = 'WithdrawExperimentException';
  this.message = message || 'The experiment was withdrawn and will not run.';
  this.stack = (new Error()).stack;
}

WithdrawExperimentException.prototype = Object.create(Error.prototype);
WithdrawExperimentException.prototype.constructor = WithdrawExperimentException;

export default WithdrawExperimentException;

