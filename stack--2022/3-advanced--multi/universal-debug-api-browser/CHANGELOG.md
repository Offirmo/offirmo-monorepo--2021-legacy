# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
NOTE: Reminder to increase REVISION when releasing!
* TODO unit tests!
* TODO extract core implementation common bw node & browser?
* TODO better handle no local storage
* TODO handle iframes?
* ...

## v1.0.1
2021/01/03
* [doc] marked as maintained in 2021! Happy new year!
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
* [chore] tweaked some logs
* [chore] bumped dependencies (minor)

## v1.0.0
2020/07/02
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [feat] better internal logging
* [doc] README++
* [chore] improved "attaching" logic with hints on setup error and improves some bad cases
* [chore] bumped dependencies (incl. most recent interface)
* [chore] tweak the tsconfig to not use nor import tslib, to avoid bloating the bundle size.

## v0.1.1
2019/12/12
* [chore] reorganized source paths = links updated in the doc

## v0.1.0
2019/11/22
* [fix] silence the internal logger
* [chore] linted automatically (no logic change)
* [chore] bumped dependencies

## v0.0.1
2019/11/11
* initial release to npm

## TEMPLATE
* [doc] README++
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [chore] bumped dependencies
* ...
