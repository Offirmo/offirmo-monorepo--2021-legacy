# CHANGELOG
**This package follows [semver](https://semver.org/).**

## PENDING
* TODO v1
* TODO release to FF
* TODO [fix] edition fields
* TODO [fix] stale overrides handling (last_reported: -1)
* TODO [fix] ugly styling
* TODO bump dependencies (major)
* TODO finish migration to Immutable
* TODO [fix] TS typings
* [test] TODO unit tests!
* [doc] inject comments in the page as well as the libs
* [chore] new JSX transform (internal)
* [chore] bumped dependencies (minor)
* ...

## v0.2.0
Submitted 2021/04/07
* [feat] extension is public on Chrome Web Store
* [feat] added option "all frames" https://developer.chrome.com/extensions/content_scripts#frames so that the extension can work with iframes
* [feat] removed unused permission "activeTabs" per Chrome Web Store request
* [chore] re-organized the source (monorepo) and tweaked the shared build script. No logic change.
* [chore] explicitly declares tslib as dependency (no change, just cleaner)
* [chore] bumped dependencies (minor)

## v0.1.0
2020/07/03
* [feat] added Microsoft Edge support

## v0.0.4
2020/07/02
* [feat] improved popup step-by-step instructions
* [feat] lowered the required permissions
* [chore] cleaned up some TODO comments
* [chore] cleaned up some dead code, small touchups (logs)
* [chore] bumped dependencies and corresponding fixes

## v0.0.3
2020/01/29
* [fix] changing window without changing tab is now detected, causing the popup to self-closes for clarity
* [fix] restoring the previous value on re-enable
* [chore] bumped dependencies
* [doc] README++

## v0.0.2
2019/11/14
* [feat] updated Universal Debug API (browser) with new features
* [feat] now correctly not support local files, with a warning
* [feat] better support for undefined
* [feat] better styling of select
* [feat] automatic intelligent default when toggling an override on
* [chore] bumped dependencies
* [doc] README++

## v0.0.1
* initial release to Chrome Store

## template
* [doc] README++
* [chore] bumped dependencies
