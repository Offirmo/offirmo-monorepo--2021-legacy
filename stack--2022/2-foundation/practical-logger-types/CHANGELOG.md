# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* TODO add an extra level for no logs at all?
* TODO type tests!
* [chore] bumped deps
* ...

## v3.0.1
2021/01/03
* [doc] ++
* [doc] marked as maintained in 2021! Happy new year!
* [chore] tweaked the tsconfig to not use nor import tslib. NOT NEEDED for now but will avoid accidents bloating the bundle size.
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.

## v3.0.0
2020/07/01
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)

## v2.0.1
2019/12/12
* [chore] reorganized source paths = links updated in the doc

## v2.0.0
2019/10/27
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [feat] new "forcedLevel" creation option
* [feat] allow passing a custom sink or options to the sink (platform dependent)
* [test] added unit tests
* [doc] README++
* [chore] package renamed to @offirmo/practical-logger-types (not breaking, old version still exists. Warning set.)

## v1.1.1
2019/07/07
* [chore] fixed dist folder name to match the target (ES2019)
* [feat] also provide an ES5 pre-built version
* [doc] README++

## v1.1.0
2019/06/30
* [feat] new API: group() groupCollapsed() groupEnd()
* [doc] improve API doc (comments)
* [chore] upgraded build target to latest stable JS (ES2019)
  but it doesn't matter since there is no code in this lib.

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
* [chore] upgraded pre-built code target to latest stable JS (ES2019)
