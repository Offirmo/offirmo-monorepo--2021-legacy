# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* ...

## v3.0.1
2021/01/03
* [doc] ++
* [doc] marked as maintained in 2021! Happy new year!
* [chore] tweaked the tsconfig to not use nor import tslib. NOT NEEDED for now but will avoid accidents bloating the bundle size.
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
* [chore] bumped dependencies (minor)

## v3.0.0
2020/07/01
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [feat] micro refactor to lower the lib size
* [chore] bumped dependencies

## v2.0.1
2019/12/12
* [chore] bumped dependencies
* [chore] linted automatically (no logic change)
* [chore] reorganized source paths = links update in the doc

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
