# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* ...

## v3.1.0
2021/01/03
* [feat] improve typing to better enforce immutability
* [feat] extend input options for normalizeArguments
* [doc] ++
* [doc] marked as maintained in 2021! Happy new year!
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
* [chore] bumped dependencies (minor)

## v3.0.0
2020/07/01
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [chore] bumped dependencies

## v2.1.1
2019/12/12
* [chore] reorganized source paths = links updated in the doc

## v2.1.0
2019/11/18
* [feat] remove .fromEntries() usage which requires a polyfill with current oldest node LTS
* [chore] use TypeScript 3.7 features
* [chore] linted automatically (no logic change)

## v2.0.1
2019/11/05
* [feat] better recovery of bad invocations, also smaller code
* [feat] shaved a few bytes of size here and there 6.87k -> 6k
* [chore] bumped dependencies

## v2.0.0
2019/10/27
* [feat] [breaking] now implementing 2.0.0 interface
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [feat] handle the new `forcedLevel` creation param (see interface)
* [feat] now using Typescript 3.7 assertions
* [feat] split a file to allow pinpoint consumption in some rare cases
* [fix] correctly allows passing no args to createLogger() (this was intended)
* [test] additional unit tests
* [chore] bumped dependencies
* [refactor] internal package @offirmo/practical-logger-interfaces renamed to @offirmo/practical-logger-types

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
