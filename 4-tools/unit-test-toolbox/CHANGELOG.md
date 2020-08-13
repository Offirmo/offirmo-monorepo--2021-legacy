# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* [chore] @offirmo/universal-debug-api-node is now an `optionalDependencies` Should not change anything, it's for semantic reasons.
* [chore] re-organized the source (monorepo) and tweaked the build script. No logic change.
* [chore] bumped dependencies (minor)
* ...

## v6.0.0
2020/07/01
* [chore] [breaking] following the deprecation of `--opts mocha.opts` in mocha 8, converted the options to `--config mocharc.json`
* [chore] [breaking] now requiring oldest node LTS = 12 (may still work with older ones)
* [chore] bumped deps: sinon 8, mocha 7
* [chore] reorganized source paths = links update in the doc
* [feat] added *optional* installation of [chai-fetch-mock](https://github.com/gakimball/chai-fetch-mock)
* [chore] bumped deps (eslint mocha 6)
* [feat] now preloads UDA node
* [chore] mark as supported

## v5.0.1
2019/04/01
* [doc] updated the repo url in `package.json`
* [doc] cleaned this CHANGELOG
* [chore] bumped deps

## v5
2019/04/01
* bumped all to latest major (as usual)
* engines now enforce node and npm minimum version

## v4.0.1
* republish after repo move, to check everything is still ok

## v4
* bumped all to latest major (as usual)
* dropped legacy node compatibility (<2) may still work but didn't try and won't maintain.
* added eslint plugins

## v1, v2, v3
* bump of the underlying packages

## v0.0.1
2016/09/19
- released to npm

## 2016/08/09
- this module's development is actively in progress…
