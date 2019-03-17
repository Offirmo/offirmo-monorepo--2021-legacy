The most official change log is a non-formal one on Reddit: https://www.reddit.com/r/boringrpg/

This file is just for taking notes for the next Reddit post.

/////////////
- 🤩 feature: 
- 😍 feature: 
- 😅 fix (hopefully!): 
- 😷 chore: 
/////////////

- TODO 😷 chore: ESLINT

Next
- 🤩 feature: X new adventures (now totalling X!)
- 😍 feature: X new backgrounds (now totalling X!)
- 🤩 feature: X new achievements (now totalling X!)
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors


v0.59.1
- 🤩 feature: 1 new achievements (now totalling 98!)
- 🤩 feature: a custom cursor
- 😅 fix: (hopefully) fixed a few crashes cases when selling or equipping items
- 😅 fix: autoplay now ends up with as much energy you previously had 
- 😷 chore: some internal refactors and cleanups (revision, stores, etc.)

v0.58.3
- 🤩 feature: a loader while the page downloads
- 😷 chore: some internal refactors and cleanups

2019/02/16 v0.58.1
- 🤩 feature: new classes! (now totalling 25!)
- 😅 fix: removed 3 background pictures I didn't like that much
- 😷 chore: some internal refactors for preparing the server feature


2019/02/16 v0.57.1
- 😍 feature: ~76 new backgrounds (now totalling 101!)
- 🤩 feature: background images are now credited to their author
- 😍 feature: the background for the next adventures now preloads itself! Avoid loading time when playing.
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors for the future server feature
- 😷 chore: some internal refactors around React rendering
- 😷 chore: extra secret dev tools


2019/02/11 v0.56.5
- 🤩 feature: Firefox now has nicer scrolls
- 😅 fix: unscrollable areas on Chrome and Firefox
- 😅 fix: modal behaviour and modal blanket


2019/02/06 v0.56.3
- 🤩 feature: item qualities now no longer overlap
- 😍 feature: items are now much more powerful (because everyone like big numbers ;)
- 🤩 feature: "Artifact" quality is now equal in strength to "legendary". Rationale: Artifact quality is made for seasonal items. They should not be stronger than droppable items so that it won't imbalance the game.
- 😅 fix: no longer outdated actions after being reborn (reported by LiddiLidd)
- 😅 fix: temporary correction for the Chrome 72 change (reported by Raxon, LiddiLidd, IrdaRichbeth)


2019/01/30 v0.56.2
- 😍 feature: 4 new backgrounds (now totalling 27!)
- 😅 fix: a rounding error on energy display (thanks LiddiLidd)
- 😅 fix: a temporary limitation on UI refresh
- 😅 fix: the savegame editor no longer needs a page refresh after edit
- 😷 chore: big internal refactor (React) that was painful but now the game UI is smooth and refreshes parts only when it should


2019/01/11 v0.55.1
- 😍 feature: 2 new backgrounds (now totalling 24!)
- 🤩 new energy display with favicon
- 😅 fix: tweaks, typos, small bugs…
- 😷 internal refactors around energy


2018/12/13 v0.54.11
- 🤩 feature: 70 new achievements!! (now totalling 97)
- 😅 fix (hopefully!): autoplay/reborn no longer discards all the armors (now balanced)


2018/12/03 v0.54.4
- 🤩 feature: 4 new adventures (now totalling 162!)
- 😍 improved good drops distribution! Now 20x times more chance to get legendary drops! (computed to get ~one every 1.5 month)
- 🤩 feature: reborn! When I make internal changes to the savegame format, instead of resetting the game, it will now triggers an auto-replay so you won't loose your hard work!
  - You can trigger a rebirth now (to benefit from the new drop rate) by using the code "reborn"
- 😍 feature: 1 new background (now totalling 22!)
- 🤩 added an update notification with a link to Reddit
- 😎 a secret code to get "artifact" level items (as a reward to alpha players)
- 😅 fix: tweaks, typos, small bugs…
- 😷 chore: some internal refactors


2018/11/22 v0.53.1
- 🤩 feature: 33 new adventures!! (now totalling 158!)
- 😍 feature: 4 new backgrounds (now totalling 21!)
- 🤩 feature: 9 new achievements (now totalling 27!)
- 😅 fix: tweaked the interface here and there
- 😷 chore: some internal refactors


2018/11/14 v0.52.46
- 😍 achievements!!! (18 so far)
- 🤩 feature: 7 new adventures (now totalling 125!)
- 😷 chore: better rich text capabilities in messages
- 😷 chore: better capabilities in notifications


2018/11/06 v0.52.41
- 😍 feature: 2 new background (now totalling 16!)
- 🤩 feature: 3 new adventures (now totalling 118!)
- 😍 feature: enabled migration of savegames! (for now, no more resets)
- 😅 fix (hopefully!): minor bugs with signup/signin
- 😅 fix (hopefully!): bug abusively reseting the savegame (reported by u/LiddiLidd )
- 😷 chore: added safeties to detect/prevent abusive game resets in the future
- 😷 chore: better typings


2018/10/29 v0.52.34
- 😍 feature: users can now enter codes! (in the hamburger menu). Will be useful for special rewards (alpha testers), seasonal content, cheat, internal tests...
- 🤩 feature: a notification system, will be useful for achievements (test it by entering the code "testnotifs")
- 😍 feature: 1 new background (now totalling 14!)
- 🤩 feature: 5 new adventures (now totalling 115!)
- 😍 feature: inventory size and limit are now displayed, ex. 12/20
- 🤩 feature: users can now login (will unlock features in the future)
- 😍 feature: small UI improvements
- 😅 fix (hopefully!): a crashing story
- 😅 fix (hopefully!): minor UI bugs


2018/10/18 v0.52.20
- 😍 feature: 1 new background
- 🤩 feature: 15 new adventures (now totalling 110!)
- 😍 feature: cleaned and uniformized existing adventures (usage of past tense)
- 🤩 feature: uniformized the outcome distribution of adventures, stats upgrades are now more evenly distributed (and should stay that way)
- 😍 feature: the savegame can now be edited, conveniently with a superb JSON editor with syntax highlighting
- 🤩 feature: cleaned the meta panel
- 😍 feature: improved load time of the game by deferring non-critical scripts
- 😅 fix: fixed the key-ing of react elements produced by rendering a rich text
- 😅 fix (hopefully!): fixed a bug causing the inventory backpack to appear not sorted when having more than 10 items

2018/10/11 v0.52.11
- 🤩 feature: the inventory now displays the power of your items
- 🤩 feature: the inventory now displays whether an item is better or worse than your currently equipped one
- 🤩 feature: 2 new backgrounds
- 🤩 feature: 3 new adventures (now totalling 95!)
