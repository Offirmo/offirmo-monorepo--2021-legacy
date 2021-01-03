# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* TODO unit & type tests!
* TODO clean the useless debug setup? NO IT PROVED USEFUL EVEN FOR MYSELF
* ...

## v1.0.1
2021/01/03
* [doc] marked as maintained in 2021! Happy new year!
* [chore] tweaked the tsconfig to not use nor import tslib. NOT NEEDED for now but will avoid accidents bloating the bundle size.
* [chore] fix incorrect LIB
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.

## v1.0.0
2020/07/02
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [chore] exposes some internal properties for debugging the setup
* [chore] bumped dependencies
* [doc] README++

## v0.2.1
2019/12/12
* [doc] README++
* [chore] reorganized source paths = links updated in the doc

## v0.2.0
2019/11/08
* [refactor] [breaking] remove mentions of "web" since this lib is not restricted to the web
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [chore] bumped dependencies

## v0.1.1
2019/07/07
* [chore] fixed dist folder name to match the target (ES2019)
* [feat] also provide an ES5 pre-built version

## v0.1
2019/06/30
* [chore] bumped deps

## v0.0.3
2019/04/05
* **feature:** 2 new APIs: `exposeInternal(...)` and `overrideHook(...)`!
* [test] enabled more eslint rules
* [doc] README++

## v0.0.2
2019/04/04
* [doc] README++
* [chore] tweaked tsconfig
* [chore] bumped deps
* [test] enabled eslint

## v0.0.1
2019/04/03
* initial release to npm
