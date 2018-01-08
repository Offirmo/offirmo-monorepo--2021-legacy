#!/usr/bin/env node
'use strict';

const fs = require('fs')

const hjson = require('hjson')

const content = fs.readFileSync('./test.hjson', {encoding: 'utf-8'})

var obj = hjson.parse(content)

console.log(obj)
