# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* [feat] [BREAKING] `normalizeError(errLike)` will now return the passed object if it has a proper error shape.
  It no longer always creates a copy, unless `{ alwaysRecreate: true }` is passed as a second argument
* [feat] `normalizeError(errLike)` now accept the "unknown" type as an input, to help handling Typescript 4.4 changes
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables
* [feat] new `hasErrorShape(errLike)` exposed (should hardly be useful)
* [chore] bumped deps
* ...

## v0.0.1
2021/01/03
* initial release to npm

## template
* [doc] README++
* [chore] bumped deps
