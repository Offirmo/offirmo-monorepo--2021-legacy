#!/bin/sh
':' //# http://sambal.org/?p=1014 ; exec /usr/bin/env node "$0" "$@"
'use strict';

////////////////////////////////////////////////////////////

const { hello, goodbye } = require('../..')
const vorpal = require('vorpal')()

////////////////////////////////////////////////////////////

const APP_ID = 'hello_world_emo';
vorpal.history(APP_ID);
vorpal.localStorage(APP_ID);

vorpal.delimiter('test>');

vorpal.log('Hello from vorpal !');

vorpal
.command('hello <target>', 'call MUT.hello(target)')
.action(function(args, callback) {
	hello(args.target)
	callback();
});

vorpal
.command('goodbye <target>', 'call MUT.goodbye(target)')
.action(function(args, callback) {
	goodbye(args.target)
	callback();
});

vorpal.show();

vorpal.ui.input('hello master');
