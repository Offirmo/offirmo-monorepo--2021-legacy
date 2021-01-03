# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
NOTE: Reminder to increase REVISION when releasing!
* TODO fix underlying practical-logger-node!!
* TODO node & browser should share some logic
* TODO unit tests!
* ...

## v0.2.0
2021/01/03
* [feat] [breaking] added ENV key normalization of a few unicode separator chars to "_"
* [doc] marked as maintained in 2021! Happy new year!
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
* [chore] tweaked some logs
* [chore] bumped dependencies (minor)

## v0.1.0
* [chore] [breaking] cjs pre-build now targeting node12/ES2019 [details](../../CONTRIBUTING/module-exports.md)
* [chore] improved "attaching" logic with hints on setup error and improves some bad cases
* [chore] node & browser now have the exact same "attaching" logic (as it should be)
* [feat] better internal logging
* [chore] bumped dependencies (incl. most recent interface)
* [chore] [breaking] correctly document the tslib peer dep

## v0.0.2
2019/12/12
* [chore] reorganized source paths = links updated in the doc
* [chore] linted automatically (no logic change)
* [chore] bumped dependencies
* [feat] now split an extra separator

## v0.0.1
2019/11/11
* initial release to npm

## TEMPLATE
* [doc] README++
* [chore] [breaking] no longer exporting ES5, reverted to [this more rationale export setup](../../CONTRIBUTING/module-exports.md)
* [chore] bumped dependencies
* ...
