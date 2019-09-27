# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* [feat] split a file to allow pinpoint consumption in some rare cases
* [feat] handle the new `forcedLevel` creation param (see interface)
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [chore] bumped dependencies
* ...

## v1.1.1
2019/07/07
* [chore] fixed dist folder name to match the target (ES2019)
* [feat] also provide an ES5 pre-built version

## v1.1.0
2019/06/30
* [feat] new API: group() groupCollapsed() groupEnd()
* [test] unit tests! especially on the argument normalizer!
* [fix] avoid mutating params by accident
* [fix] err is no longer treated as a normal object and accidentally destroyed
* [fix] ironed out the argument normalizer thanks to unit tests
* [test] improved demo ~ "unit test"
* [chore] upgraded pre-built code target to latest stable JS (ES2019)
* [chore] bumped deps

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
* [chore] tslib no longer a dependency but slight size-limit increase

## v0.0.1
2019/04/02
* initial release to npm

## template
* [doc] README++
* [chore] bumped deps
* [chore] upgraded pre-built code target to latest stable JS (ES2019)
