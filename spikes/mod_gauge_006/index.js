#!/usr/bin/env node
"use strict";

// contribution to official README
var Gauge = require("gauge")

var gauge = new Gauge()

gauge.show("working…", 0)
setTimeout(() => { gauge.pulse(); gauge.show("working…", 0.25) }, 500)
setTimeout(() => { gauge.pulse(); gauge.show("working…", 0.50) }, 1000)
setTimeout(() => { gauge.pulse(); gauge.show("working…", 0.75) }, 1500)
setTimeout(() => { gauge.pulse(); gauge.show("working…", 0.99) }, 2000)
setTimeout(() => gauge.hide(), 2300)
