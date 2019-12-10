# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* [doc] README++
* [chore] bumped deps

## 2.0.0
2019/04/04
* **breaking** [chore] typescript is now a `peerDependency`, thus requiring npm 3+
* [doc] README++
* [chore] bumped deps


## 1.2.0
2018/01/08
- verbose option
- spawn + params now only displayed if verbose = true
- errors are no longer displayed, unless verbose = true.
  They were unreadable and displaying stderr is sufficient
- optionally display a custom msg before starting stderr,
  useful in case of concurrent builds in the same terminal
  
## 1.1.1
2016/08/15
- handle new tsc 2.0 array params
- filter empty stdout lines for a more compact output
- print a *** line between watch refresh stdout for finding errors more easily

## 1.1.0
2016/08/09
- fixed node 4 compatibility
- added this changelog

## 1.0.1
- works fine ;)