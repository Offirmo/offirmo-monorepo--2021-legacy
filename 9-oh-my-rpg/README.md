# Oh My RPG ⚔ 👑

**If you're looking for:**
- **the npm rpg** → go here: [the-npm-rpg/README.md](packages/the-npm-rpg/README.md)



## Intro

My RPG framework, comprised of:
* composable building blocks
* final RPG implementations (using the blocks)

Code is isomorphic, targeting node & browser. This is achieved by being text based with progressive augmentations:
1. pure text
1. text with emojis
1. text with styles: ASCII or CSS
1. pictures (displayable in browser or iterm2)
1. ...

Under the hood, it's a [lerna](https://lernajs.io/) collection of packages.
Those modules are either in TypeScript or JavaScript, whatever makes the most sense in each case.



## Installation
```bash
nvm install
npm install --global lerna
lerna bootstrap --hoist
lerna --sort run build
```


## Usage
Compose and profit !

Example: see `packages/the-npm-rpg`


## Contributing
```bash
lerna clean --yes
npm run clean:deps & lerna run clean:deps & lerna run clean:build
lerna bootstrap --hoist
lerna --sort run build
lerna --sort run test
```

misc/TOSORT
```bash
lerna exec -- rm -rf dist
rm -f package-lock.json & lerna exec -- rm -f package-lock.json
rm -rf node_modules & lerna exec -- rm -rf node_modules

lerna exec -- npm outdated
```

TODO
- remove node typings


## Misc / TOSORT

### Interesting reads:
* https://github.com/Offirmo-team/wiki/wiki/RPG
* https://gamedevelopment.tutsplus.com/categories/game-design
  * https://gamedevelopment.tutsplus.com/tutorials/making-difficult-fun-how-to-challenge-your-players--cms-25873
* ;-) https://gamedevelopment.tutsplus.com/articles/3-questions-to-help-you-finish-your-first-game--gamedev-9576
* https://github.com/mozilla/BrowserQuest

```bash
git push --set-upstream origin master
npm install
lerna run install
```
