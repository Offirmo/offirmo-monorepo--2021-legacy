# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* TODO unit tests!
* ...

## v1.0.1
2021/01/03
* [doc] marked as maintained in 2021! Happy new year!
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
* [chore] bumped dependencies (minor)

## v1.0.0
2020/07/01
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [chore] tweaked the tsconfig to not use nor import tslib, it was bloating the bundle size.
* [feat] micro refactor to lower the lib size
* [chore] bumped dependencies (incl. most recent interface)
* [doc] ++

## v0.3.1
2019/12/12
* [chore] reorganized source paths = links updated in the doc

## v0.3
2019/11/18
* [feat] now provides a pre-bundled version (beta)
* [doc] fix README related to the renaming
* [chore] bumped dependencies

## v0.2
2019/11/08
* [refactor] [breaking] renamed to "placeholder"
* [refactor] [breaking] remove mentions of "web" since this lib is not restricted to the web
* [doc] README++
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [chore] bumped dependencies

## v0.1.1
2019/07/07
* [chore] fixed dist folder name to match the target (ES2019)
* [feat] also provide an ES5 pre-built version
* [doc] README++

## v0.1
2019/06/30
* [chore] bumped deps

## v0.0.3
2019/04/05
* **feature:** implement the v0.0.3 new APIs: `exposeInternal(...)` and `overrideHook(...)`!
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
