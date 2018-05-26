
# soft-execution-context

A fresh take on asynchronous contexts for node and browser. Inspired by zone.js and node domains.

Because I need it for work and personal projects.

WORK IN PROGRESS, COMPLETELY EXPERIMENTAL FOR NOW


Objectives:
* reliably catch errors
  * either in a correctly chained path
  * or in any async path
* clear and exploitable errors
  * have an exploitable stack
  * have details
* pass data around (DI)
* can abort a whole process and have a fallback
* can bubble events
* not too slow (lots of forks)

BE DEFENSIVE !!!
