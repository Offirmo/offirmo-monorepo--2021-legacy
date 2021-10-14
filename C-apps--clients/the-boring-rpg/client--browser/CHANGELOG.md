# CHANGELOG


## NEXT
- TODO no console.x
- 🤩 feature: X new adventures (now totalling X!)
- 😍 feature: X new backgrounds (now totalling X!)
- 🤩 feature: X new achievements (now totalling X!)
- 👋 feature dropped: X
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors
- 😷 chore: dependencies bump


## NEXT

## v0.68.1
2021/10/11
- 😍 feature: 3 new backgrounds (now totalling 137!)
- 🤩 feature: the licensed new background picture is now used in the loader and as an open-graph picture
- 😍 feature: open graph, the link is now shareable in some social medias
- 😷 chore: some internal refactors (CSS)
- 😷 chore: dependencies bump

## v0.67.2
2021/06/30
- 😅 fix: the size of the app was once again cut in half! (much faster loading time 🚀)
- 😅 fix: the scrollbars are now properly styled in Firefox 💅
- 😷 chore: some internal refactors (CSS)
- 😷 chore: dependencies bump

## v0.67.1
2021/05/16
- 😅 fix: the size of the app was cut in half! (much faster loading time 🚀)
- 👋 feature: slightly improved the default player name + its handling in the chat
- 👋 feature: (feature flagged) progress on the cloud save
- 😷 chore: some internal refactors (data format now v15)
- 😷 chore: added a bundle size detection that should prevent unexpected app size explosion 💥
- 😷 chore: bump dependencies

## v0.66.2
2021/04/26
- 😅 fix: the chat is back!
- 😅 fix: diversity supporter detection was broken (no one was a diversity supporter anymore)
- 😷 chore: reorganised code internally
- 😷 chore: bump dependencies

## v0.66.1
2020/03/30
- 😅 fix: correction of impossibility to load the game in case of some URL variant
- 😅 fix: correction of the weapon/armor improvement bug (thanks [u/Nateinthe90s](https://www.reddit.com/r/boringrpg/comments/m4zc2o/weapon_enhancements_not_working/))
  - most likely introduced in v0.65.12 😭
- 😷 chore: bump dependencies

## v0.65.15
2020/03/11
- 😷 chore: Google Analytics 4 (in progress)
- 😷 chore: bump dependencies

## v0.65.14
- 😷 chore: facilities for internal monitoring
- 😷 chore: bump dependencies

## v0.65.13
2020/11/13
- 😅 fix: added circuit breakers on Sentry and Netlify to prevent draining the free tier on bug (ouch!)
- 👋 feature: (feature flagged) progress on the cloud save
- 😷 chore: some internal refactors: mainly the serverless functions
- 😷 chore: bump dependencies (incl. React 17)

## v0.65.12
2020/11/06
- 👋 feature: (feature flagged) progress on the cloud save
- 😅 fix: the login works again!
- 😷 chore: some internal refactors (immutability)
- 😷 chore: bump dependencies

## v0.65.11
2020/10/08
- 😅 fix: the savegame editor works again!
- 😅 fix: the administrator (me) can log in again!
- 😍 (behind a feature flag) progress on the cloud save
- 😷 chore: improved logs
- 😷 chore: some internal refactors, bump dependencies

## v0.65.10
2020/09/19
- 😷 chore: progress toward cloud save:
  - new API endpoint able to intelligently store and save the latest version
  - clarified the savegame structure
  - rewrote the flux architecture and the bkp to local storage
- 😷 chore: improved timing semantics (and maybe perf but not a goal)
- 😷 chore: improved logs
- 😷 chore: some internal refactors, bump dependencies

## v0.65.9
2020/07/20
- 😷 chore: progress toward cloud save:
  - many things
  - the server code catches errors better (needed to troubleshoot the DB connexion)
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors, bump dependencies

## v0.65.8
- 😷 chore: progress toward server
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors, bump dependencies

## v0.65.7
2020/07/13
- 😷 chore: improved analytics (more events, not sending them for me the developer)
- 😷 chore: improved migration of old savegames

## v0.65.5
- 😷 chore: improved cordova compatibility for potential mobile app version
- 😷 chore: improved analytics, I'll finally see what users are doing AND exclude myself from it :)
- 😷 chore: better debug infos
- 😷 chore: some internal refactors, bump dependencies

## v0.65.4
2020/06/30
(most likely skipped very fast)

## v0.65.1
- 🤩 feature: 14 new adventures (now totalling 201!)
- 😍 feature: 36 new backgrounds (now totalling 134!)
- 😅 fix: favicon status was sometimes broken, improved all favicons on the way
- 😅 fix: no more ugly hover on Safari iOs
- 😷 improved compatibility for future mobile app
- 😷 chore: some internal refactors, bump dependencies

## v0.64.1
- 🤩 feature: 25 new adventures, notably featuring new coin loss! (now totalling 187!)
     it was present in the original game, allows us to recover additional adventures
- 😅 fix: login and reload features are working again
- 😅 fix: tweaks, typos, small bugs…

## v0.63.1
- 😍 feature: 16 new backgrounds (now totalling 114!
- 🤩 feature: improved new version detection

## v0.62.1
- 👋 feature dropped: the snow for Christmas season
- 🤩 feature: new loader
- 😷 chore: bump dependencies

## v0.61.3
2019/12/17
- 😍 feature: snow for Christmas season!
- 😅 progress on cloud save but still not there...
- 😷 chore: some auto linting

## v0.61.1
2019/11/23
- 😅 fix: wrong english loose -> lose
- 😷 chore: some internal refactors, bump dependencies

## v0.60.12
2019/11/02
- 😅 fix an achievement message (thanks LiddiLidd)
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors, bump dependencies

## v0.60.5
2019/09/28
- 🤩 feature: A sound effect! (when selling stuff) I did it for fun, sound is not a priority
- 😷 chore: tweaked an error to better interpret it in the reports
- 😷 chore: some internal refactors, bump dependencies

## v0.60.4
2019/08/02
- 🤩 feature: better start experience: better refill rate easing, better starting adventures
- 😷 chore: some internal refactors, bump dependencies

## v0.60.3
- 😷 chore: fixed early instantiation of the game instance
- 😷 chore: use UDA debug features
- 😷 chore: some internal refactors, bump dependencies

## v0.60.2
2019/07/22
- 😷 chore: some internal refactors: bump dependencies, tweaked the colors

## v0.60.1
2919/04/23
- 🤩 feature: 1 new achievement (now totalling 100!)
- 😍 feature: energy is refill faster at the beginning of the game (similar to the original)
- 😷 chore: some internal refactors and cleanups (revision, stores, etc.)
- 😅 fix: harmonized the background colors and the contrast of the progress bars
- 😅 fix: codes could be redeemed infinitely…
- 😅 fix: in adventure messages, coins and tokens were displayed incorrectly
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors and cleanups (renamings, server-related)


## v0.59.1
- 🤩 feature: 2 new achievements (now totalling 99!)
- 😍 feature: a custom cursor
- 😅 fix: (hopefully) fixed a few crashes cases when selling or equipping items
- 😅 fix: autoplay now ends up with as much energy you previously had
- 😅 fix: the notifications no longer prevent clicking below / above
- 😅 fix: (hopefully) on Safari mobile, the screen won't stay zoomed after an input
- 😷 chore: some internal refactors and cleanups (revision, stores, etc.)


## v0.58.3
2019/03/07
- 🤩 feature: a loader while the page downloads
- 😷 chore: some internal refactors and cleanups


## v0.58.1
2019/02/16
- 🤩 feature: new classes! (now totalling 25!)
- 😅 fix: removed 3 background pictures I didn't like that much
- 😷 chore: some internal refactors for preparing the server feature


## v0.57.1
2019/02/16
- 😍 feature: ~76 new backgrounds (now totalling 101!)
- 🤩 feature: background images are now credited to their author
- 😍 feature: the background for the next adventures now preloads itself! Avoid loading time when playing.
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors for the future server feature
- 😷 chore: some internal refactors around React rendering
- 😷 chore: extra secret dev tools


## v0.56.5
2019/02/11
- 🤩 feature: Firefox now has nicer scrolls
- 😅 fix: unscrollable areas on Chrome and Firefox
- 😅 fix: modal behaviour and modal blanket


## v0.56.3
2019/02/06
- 🤩 feature: item qualities now no longer overlap
- 😍 feature: items are now much more powerful (because everyone like big numbers ;)
- 🤩 feature: "Artifact" quality is now equal in strength to "legendary". Rationale: Artifact quality is made for seasonal items. They should not be stronger than droppable items so that it won't imbalance the game.
- 😅 fix: no longer outdated actions after being reborn (reported by LiddiLidd)
- 😅 fix: temporary correction for the Chrome 72 change (reported by Raxon, LiddiLidd, IrdaRichbeth)


## v0.56.2
2019/01/30
- 😍 feature: 4 new backgrounds (now totalling 27!)
- 😅 fix: a rounding error on energy display (thanks LiddiLidd)
- 😅 fix: a temporary limitation on UI refresh
- 😅 fix: the savegame editor no longer needs a page refresh after edit
- 😷 chore: big internal refactor (React) that was painful but now the game UI is smooth and refreshes parts only when it should


## v0.55.1
2019/01/11
- 😍 feature: 2 new backgrounds (now totalling 24!)
- 🤩 new energy display with favicon
- 😅 fix: tweaks, typos, small bugs…
- 😷 internal refactors around energy


## v0.54.11
2018/12/13
- 🤩 feature: 70 new achievements!! (now totalling 97)
- 😅 fix (hopefully!): autoplay/reborn no longer discards all the armors (now balanced)


## v0.54.4
2018/12/03
- 🤩 feature: 4 new adventures (now totalling 162!)
- 😍 improved good drops distribution! Now 20x times more chance to get legendary drops! (computed to get ~one every 1.5 month)
- 🤩 feature: reborn! When I make internal changes to the savegame format, instead of resetting the game, it will now triggers an auto-replay so you won't loose your hard work!
  - You can trigger a rebirth now (to benefit from the new drop rate) by using the code "reborn"
- 😍 feature: 1 new background (now totalling 22!)
- 🤩 added an update notification with a link to Reddit
- 😎 a secret code to get "artifact" level items (as a reward to alpha players)
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors


## v0.53.1
2018/11/22
- 🤩 feature: 33 new adventures!! (now totalling 158!)
- 😍 feature: 4 new backgrounds (now totalling 21!)
- 🤩 feature: 9 new achievements (now totalling 27!)
- 😅 fix: tweaked the interface here and there
- 😷 chore: some internal refactors


## v0.52.46
2018/11/14
- 😍 achievements!!! (18 so far)
- 🤩 feature: 7 new adventures (now totalling 125!)
- 😷 chore: better rich text capabilities in messages
- 😷 chore: better capabilities in notifications


## v0.52.41
2018/11/06
- 😍 feature: 2 new background (now totalling 16!)
- 🤩 feature: 3 new adventures (now totalling 118!)
- 😍 feature: enabled migration of savegames! (for now, no more resets)
- 😅 fix (hopefully!): minor bugs with signup/signin
- 😅 fix (hopefully!): bug abusively reseting the savegame (reported by u/LiddiLidd )
- 😷 chore: added safeties to detect/prevent abusive game resets in the future
- 😷 chore: better typings


## v0.52.34
2018/10/29
- 😍 feature: users can now enter codes! (in the hamburger menu). Will be useful for special rewards (alpha testers), seasonal content, cheat, internal tests...
- 🤩 feature: a notification system, will be useful for achievements (test it by entering the code "testnotifs")
- 😍 feature: 1 new background (now totalling 14!)
- 🤩 feature: 5 new adventures (now totalling 115!)
- 😍 feature: inventory size and limit are now displayed, ex. 12/20
- 🤩 feature: users can now login (will unlock features in the future)
- 😍 feature: small UI improvements
- 😅 fix (hopefully!): a crashing story
- 😅 fix (hopefully!): minor UI bugs


## v0.52.20
2018/10/18
- 😍 feature: 1 new background
- 🤩 feature: 15 new adventures (now totalling 110!)
- 😍 feature: cleaned and uniformized existing adventures (usage of past tense)
- 🤩 feature: uniformized the outcome distribution of adventures, stats upgrades are now more evenly distributed (and should stay that way)
- 😍 feature: the savegame can now be edited, conveniently with a superb JSON editor with syntax highlighting
- 🤩 feature: cleaned the meta panel
- 😍 feature: improved load time of the game by deferring non-critical scripts
- 😅 fix: fixed the key-ing of react elements produced by rendering a rich text
- 😅 fix (hopefully!): fixed a bug causing the inventory backpack to appear not sorted when having more than 10 items

## v0.52.11
2018/10/11
- 🤩 feature: the inventory now displays the power of your items
- 🤩 feature: the inventory now displays whether an item is better or worse than your currently equipped one
- 🤩 feature: 2 new backgrounds
- 🤩 feature: 3 new adventures (now totalling 95!)


## Notes / template

/////////////
- 🤩 feature:
- 😍 feature:
- 😅 fix (hopefully!):
- 😷 chore:
/////////////

- TODO 😷 chore: ESLINT

## NEXT
- 🤩 feature: X new adventures (now totalling X!)
- 😍 feature: X new backgrounds (now totalling X!)
- 🤩 feature: X new achievements (now totalling X!)
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors (bump dependencies)
