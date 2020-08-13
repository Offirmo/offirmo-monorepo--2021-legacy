"use strict";

try {
	require('@offirmo/universal-debug-api-node')
} catch {
	// private monorepo case where this module is not available / broken / not built yet
	console.log('(@offirmo/universal-debug-api-node skipped, require() error)')
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
	const chai_fetch_mock = require('chai-fetch-mock')
	chai.use(chai_fetch_mock);
}
catch (e) { /* ignore */ }

// convenience
console.log(`* Starting tests for "${path.basename(process.cwd())}"... [powered by @offirmo/unit-test-toolbox]`)
