***See all sibling files***

## Introduction

Welcome to this repo and thanks for considering to contribute!

This repo is a monorepo managed through [bolt](https://github.com/boltpkg/bolt)

It aggregates most of my (Offirmo) personal projects, including:
* npm modules
* node tools
* web apps
* mobile apps
* dev tools
* etc.


## Principles

Unless it's more convenient for some reasons, this repo strives to adhere to those principles:
- readable code
  - TypeScript https://www.typescriptlang.org/
- problems broken down in manageable components = separation of concerns
- immutability if possible
- command / query separation
- compatible with event sourcing (for offline first with server replay when back online)
- mobile first
- offline first


## Installation

I use macOS 11.6 [](update marker) but should work on any unix-like system.

This set of command will build everything: (required as there are dependencies between modules)
```bash
## (update OS, brew, nvm, etc.)
nvm install
npm i -g yarn # bolt only works when installed by yarn
yarn global add bolt
npx browserslist@latest --update-db # cf. https://github.com/browserslist/browserslist#browsers-data-updating
bolt
bolt xpostinstall
bolt xpostinstall    # <- yes, one more time
bolt build
bolt test
```


## Usage (dev commands)

### normal dev

Now that all modules are built (required), you can move into an individual module:
```bash
## this will trigger watch build of the compatible cjs version, which works in all envs
yarn dev

yarn test
```

Note than modifying a module's source most likely requires a build for it to take effect.
Be aware of the dependencies.

At the moment, there are dependency loops which require a refactoring I don't plan to do right now. They don't prevent development.
* TODO fix dependency loop tbrpg/state


### build/test only a subset

For ex. to make everything work again step by step!

```bash
bolt ws run test  --only-fs "0-meta/*"
bolt --only-fs "1-stdlib/*" ws run build
bolt --only-fs "1-stdlib/*" ws run test
bolt --only-fs "2-foundation/*" ws run build
bolt --only-fs "2-foundation/*" ws run test
bolt --only-fs "3-advanced--multi/*" ws run build
bolt --only-fs "3-advanced--multi/*" ws run test
bolt --only-fs "3-advanced--isomorphic/*" ws run build
bolt --only-fs "3-advanced--isomorphic/*" ws run test
bolt --only-fs "3-advanced--browser/*" ws run build
bolt --only-fs "3-advanced--browser/*" ws run test
bolt --only-fs "3-advanced--node/*" ws run build
bolt --only-fs "3-advanced--node/*" ws run test
bolt --only-fs "4-tools/*" ws run build
bolt --only-fs "4-tools/*" ws run test
bolt --only-fs "5-incubator/**/*" ws run build
bolt --only-fs "5-incubator/**/*" ws run test
bolt --only-fs "9-oh-my-rpg/**/*" ws run build
bolt --only-fs "9-oh-my-rpg/**/*" ws run test
bolt --only-fs "A-apps--core/the-boring-rpg/**/*" ws run build
bolt --only-fs "A-apps--core/the-boring-rpg/**/*" ws run test
bolt --only-fs "B-apps--support/online-adventur.es/**/*" ws run build
bolt --only-fs "B-apps--support/online-adventur.es/**/*" ws run test
bolt --only-fs "C-apps--clients/the-boring-rpg/**/*" ws run build
bolt --only-fs "C-apps--clients/the-boring-rpg/**/*" ws run test
bolt --only-fs "D-minisites/*" ws run build

## Alt:
bolt --only @oh-my-rpg/* ws run test
bolt --only-fs "A-apps--core/**/*" ws run build
bolt --only-fs "A-apps--core/**/*" ws run test
bolt --only-fs "B-apps--support/**/*" ws run build
bolt --only-fs "B-apps--support/**/*" ws run test
bolt --only-fs "C-apps--clients/**/*" ws run build
bolt --only-fs "C-apps--clients/**/*" ws run test
bolt w @tbrpg/definitions run build
bolt ws run build --only @offirmo-private/*
bolt ws run test  --only @offirmo-private/*

## misc:
bolt ws run cheatsheet
bolt ws run cheatsheet --only @offirmo-private/*
bolt ws run cheatsheet --only @oh-my-rpg/*
```

## clean
```bash
bolt clean
# equivalent to:
#  bolt ws run clean
#  bolt ws exec -- rm -rf .cache .parcel dist node_modules yarn.lock package-lock.json yarn-error.log
```

## updates dependencies (minor + patch)
```bash
nvm i
onn
bolt clean && rm -rf node_modules yarn.lock package-lock.json && bolt && bolt xpostinstall && bolt xpostinstall && yarn outdated     && bolt build
bolt clean && rm -rf node_modules yarn.lock package-lock.json && bolt && bolt build
npx yarn-tools list-duplicates yarn.lock
yarn eslint:packages --fix
```

## serve for dev
```bash
ngrok http -subdomain=offirmo 1981
yarn serve
```

## publish a package
```bash
npm adduser
user: offirmo
email: offirmo.net@gmail.com
npm publish
npm publish --access public
```


## tosort

### tabset

yellow FDEE00
