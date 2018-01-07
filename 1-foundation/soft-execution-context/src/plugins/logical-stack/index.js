"use strict";

import { LIB, INTERNAL_PROP } from '../../constants'
import {
	SUB_LIB,
	LOGICAL_STACK_BEGIN_MARKER,
	LOGICAL_STACK_END_MARKER,
	LOGICAL_STACK_MODULE_MARKER,
	LOGICAL_STACK_SEPARATOR,
	LOGICAL_STACK_OPERATION_MARKER,
	LOGICAL_STACK_SEPARATOR_NON_ADJACENT,
} from './constants'

import { COMMON_ERROR_FIELDS } from '@offirmo/common-error-fields'
COMMON_ERROR_FIELDS.add('logicalStack')


// TODO add non-inheritable instance

function getLogicalStack(module, operation, parentModule, parentFullLStack = '') {

	module = module || parentModule
	if (!module)
		throw new Error(`${LIB}/${SUB_LIB}: you must provide 'module' to start building a logical stack!`)

	if (parentModule && !parentFullLStack)
		throw new Error(`${LIB}/${SUB_LIB}: you must provide the parent full LStack!`)

	if (parentFullLStack && !parentModule)
		throw new Error(`${LIB}/${SUB_LIB}: incoherency parentModule / parent LStack!`)

	/// SHORT ///
	let shortLStack = ''
		+ LOGICAL_STACK_BEGIN_MARKER
		+ LOGICAL_STACK_MODULE_MARKER
		+ module

	if (operation) {
		shortLStack += ''
			+ LOGICAL_STACK_SEPARATOR
			+ operation
			+ LOGICAL_STACK_OPERATION_MARKER
	}

	/// FULL ///
	let fullLStack = parentFullLStack || LOGICAL_STACK_BEGIN_MARKER

	if (module !== parentModule)
		fullLStack += ''
			+ (parentModule ? LOGICAL_STACK_SEPARATOR: '')
			+ LOGICAL_STACK_MODULE_MARKER
			+ module

	if (operation) {
		fullLStack += ''
			+ LOGICAL_STACK_SEPARATOR
			+ operation
			+ LOGICAL_STACK_OPERATION_MARKER
	}

	return {
		short: shortLStack,
		full: fullLStack,
	}
}


function installPluginLogicalStack(SEC, {module, operation, parent}) {
	// TODO check params

	// inherit some stuff from our parent
	if (parent) {
		module = module || parent[INTERNAL_PROP].LS.module
	}

	const SECInternal = SEC[INTERNAL_PROP]

	const logicalStack = getLogicalStack(
		module,
		operation,
		SECInternal.hasNonRootParent
				? parent[INTERNAL_PROP].LS.module
				: undefined,
		SECInternal.hasNonRootParent
			? parent[INTERNAL_PROP].LS.logicalStack.full
			: undefined,
	)

	SECInternal.errDecorators.push(function attachLogicalStackToError(err) {
		if (err.logicalStack) {
			// OK this error is already decorated.
			// Thus the message is also already decorated, don't touch it.

			// can we add more info?
			if (err.logicalStack.includes(logicalStack.full)) {
				// ok, logical stack already chained
			}
			else {
				// SEC chain was interrupted
				err.logicalStack = logicalStack.full + LOGICAL_STACK_SEPARATOR_NON_ADJACENT + err.logicalStack
			}
		}
		else {
			if (!err.message.startsWith(logicalStack.short))
					err.message = logicalStack.short + LOGICAL_STACK_END_MARKER + ' ' + err.message
			err.logicalStack = logicalStack.full
		}

		return err
	})

	SECInternal.LS = {
		module,
		operation,
		logicalStack,
	}

	return SEC
}

export {
	installPluginLogicalStack,
}
