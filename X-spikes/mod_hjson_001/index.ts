#!/bin/sh
':' //# https://sambal.org/?p=1014 ; exec `dirname $0`/../../node_modules/.bin/ts-node "$0" "$@"

import * as fs from 'fs'

import * as hjson from 'hjson'

const content = fs.readFileSync('./test.hjson', {encoding: 'utf-8'})

var obj = hjson.parse(content)

console.log(obj)
