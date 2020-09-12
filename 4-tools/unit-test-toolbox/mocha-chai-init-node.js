"use strict";

try {
	require('@offirmo/universal-debug-api-node')
} catch {
	// private monorepo case where this module is not available / broken / not built yet
	if (process.env['OFFIRMO_IS_HERE'])
		console.warn('(@offirmo/universal-debug-api-node install skipped, require() error)')
}

try {
	let secnode, udanode
	try {
		secnode = require('@offirmo-private/soft-execution-context-node')
		udanode = require('@offirmo/universal-debug-api-node')
	}
	catch {
		secnode = require('../../3-advanced--multi/soft-execution-context-node')
		udanode = require('../../3-advanced--multi/universal-debug-api-node')
	}
	const {
		listenToUncaughtErrors,
		listenToUnhandledRejections,
		decorateWithDetectedEnv,
		getRootSEC,
	} = secnode
	listenToUncaughtErrors()
	listenToUnhandledRejections()
	decorateWithDetectedEnv()

	const { getLogger } = udanode
	getRootSEC().injectDependencies({ logger: getLogger({ suggestedLevel: 'silly' }) })
} catch (err) {
	// private monorepo case where this module is not available / broken / not built yet
	if (process.env['OFFIRMO_IS_HERE'])
		console.warn('(@offirmo-private/soft-execution-context-node init skipped, require() error)')
}

const path = require('path')

const Mocha = require('mocha')
const sinon = require('sinon')
const chai = require('chai')
const chai_as_promised = require('chai-as-promised')
const sinon_chai = require('sinon-chai')
const chai_subset = require('chai-subset')
const chai_moment = require('chai-moment')


// expose some global variables as convenience
global.expect = chai.expect
global.sinon = sinon

// activate chai extensions
// order is important: https://github.com/prodatakey/dirty-chai#use-with-chai-as-promised
chai.use(chai_as_promised)
chai.use(sinon_chai)
chai.use(chai_subset)
chai.use(chai_moment)

try {
	//const chai_fetch_mock = require('chai-fetch-mock')
	//chai.use(chai_fetch_mock);
}
catch (e) { /* ignore */ }

// convenience
console.log(`* Starting tests for "${path.basename(process.cwd())}"... [powered by @offirmo/unit-test-toolbox]`)
