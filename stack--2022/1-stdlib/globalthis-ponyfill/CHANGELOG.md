# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* [test] TODO unit tests!
* [chore] [breaking] cjs pre-build now targeting node12/ES2021 [details](../../0-CONTRIBUTING/06-conventions--js--modules.md)
* [chore] [breaking] module now advertised as ESM `"type": "module"` in package.json
* ...

## v3.0.2
2022/04/02
* [chore] improved the TS annotations to use the more precise @ts-expect-error
* [doc] marked as maintained in 2022! Happy new year!

## v3.0.1
2021/01/03
* [doc] marked as maintained in 2021! Happy new year!
* [doc] ++
* [chore] tweaked the tsconfig to not use nor import tslib. NOT NEEDED for now but will avoid accidents bloating the bundle size.
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.

## v3.0.0
2020/07/01
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [doc] README++
* [feat] also provide unnamed export

## v2.0.1
2019/12/12
* [chore] reorganized source paths = links updated in the doc

## v2.0.0
2019/11/18
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [chore] linted automatically (no logic change)

## v1.0.2
2019/07/07
* [chore] fixed dist folder name to match the target (ES2019)
* [feat] also provide an ES5 pre-built version

## v1.0.1
2019/06/30
* [feat] default to `this` in last resort
* [doc] README++
* [chore] upgraded pre-built code target to latest stable JS (ES2019)

## v1.0.0
2019/04/04
* no breaking change, just stable enough for 1.0
* [doc] README++
* [chore] tweaked tsconfig
* [test] enabled more eslint rules

## v0.0.4
2019/04/02
* [doc] README++
* [chore] corrected es7 to es9
* [chore] smaller npm footprint

## v0.0.3
2019/04/01
* [doc] playing with badges ;)

## v0.0.2
2019/04/01
* [doc] improve package.json, README
* [test] added bundle size control
* [chore] added pre-publish

## v0.0.1
2019/04/01
* initial release to npm

## template
* [doc] README++
* [chore] upgraded pre-built code target to latest stable JS (ES2019)
