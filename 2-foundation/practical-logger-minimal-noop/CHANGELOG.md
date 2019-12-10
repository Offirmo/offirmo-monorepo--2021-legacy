# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* [chore] bumped dependencies
* [chore] linted automatically (no logic change)
* ...

## v2.0.0
2019/10/28
* [feat] [breaking] now implementing 2.0.0 interface
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [fix] correctly allows passing args to createLogger() (unused of course)
* [test] added unit tests
* [doc] README++
* [doc] comments++
* [refactor] internal package @offirmo/practical-logger-interfaces renamed to @offirmo/practical-logger-types
* [chore] [breaking] bumped dependencies, now implementing 2.0.0 interface

## v1.1.1
2019/07/07
* [chore] fixed dist folder name to match the target (ES2019)
* [feat] also provide an ES5 pre-built version

## v1.1.0
2019/06/30
* [feat] (follow new interface v1.1) new API: group() groupCollapsed() groupEnd()
* [test] improved demo ~ "unit test"
* [chore] upgraded pre-built code target to latest stable JS (ES2019)
  note: It shouldn't change anything on such a lib...

## v1.0.0
2019/04/04
* no breaking change, just stable enough for 1.0
* [doc] README++
* [chore] tweaked tsconfig
* [chore] bumped deps
* [test] enabled more eslint rules

## v0.0.2
2019/04/04
* [doc] README++
* [chore] tweaked tsconfig
* [chore] bumped deps
* [test] enabled eslint

## v0.0.1
2019/04/02
* initial release to npm

## template
* [doc] README++
* [chore] bumped deps
* [chore] upgraded pre-built code target to latest stable JS (ES2019)