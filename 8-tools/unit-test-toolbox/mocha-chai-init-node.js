"use strict";

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

// convenience
console.log('* Starting tests...')
