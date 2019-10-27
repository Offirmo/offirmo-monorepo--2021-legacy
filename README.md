# Offirmo’s monorepo

[![Netlify Status](https://api.netlify.com/api/v1/badges/25734112-d205-4789-ad2f-bfcdf8d65252/deploy-status)](https://app.netlify.com/sites/offirmo-monorepo/deploys)

A monorepo for all my JavaScript / TypeScript projects. So convenient.

Public npm modules:
* final
	* [@offirmo/deferred](https://www.npmjs.com/package/@offirmo/deferred)
	* [@offirmo/globalthis-ponyfill](https://www.npmjs.com/package/@offirmo/globalthis-ponyfill)
	* [@offirmo/practical-logger-browser](https://www.npmjs.com/package/@offirmo/practical-logger-browser)
	* [@offirmo/practical-logger-minimal-noop](https://www.npmjs.com/package/@offirmo/practical-logger-minimal-noop)
	* [@offirmo/unit-test-toolbox](https://www.npmjs.com/package/@offirmo/unit-test-toolbox)
	* [@offirmo/universal-debug-api-minimal-noop](https://www.npmjs.com/package/@offirmo/universal-debug-api-minimal-noop)
	* [node-typescript-compiler](https://www.npmjs.com/package/node-typescript-compiler)
* internal
	* [@offirmo/practical-logger-types](https://www.npmjs.com/package/@offirmo/practical-logger-types)
	* [@offirmo/practical-logger-core](https://www.npmjs.com/package/@offirmo/practical-logger-core)
	* [@offirmo/universal-debug-api-interface](https://www.npmjs.com/package/@offirmo/universal-debug-api-interface)
	* [hello-world-emo](https://www.npmjs.com/package/hello-world-emo)


Public webapps:
* [The Boring RPG, reborn](https://www.online-adventur.es/apps/the-boring-rpg/)

Public webextensions:
* [Universal Debug API companion](4-incubator/universal-debug-api-companion-webextension/README.md)
  * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/universal-debug-api-companion/)
  * Chrome: pending


## Usage

This repo is published on [Github Pages](https://www.offirmo.net/offirmo-monorepo/), but this is most likely not what you're looking for.


## Contributing

### Principles
Unless exceptions, this repo follow those principles:
- code in TypeScript
- command / query separation
- compatible with event sourcing (for offline first with server replay when back online)

Doc:
* monorepo managed through [bolt](https://github.com/boltpkg/bolt)
  * TODO use [this tool](https://www.npmjs.com/package/@atlaskit/build-releases) as well?
* stable code is in TypeScript https://www.typescriptlang.org/docs/handbook/compiler-options.html

### Installation
I use macOS 10.14 but should work on any unix-like system.

This set of command will build everything:
```bash
nvm install
npm i -g yarn
yarn global add bolt
bolt
bolt ws run build
```

Additional dev commands:
```bash
## run all tests or a subset
bolt ws run test
bolt ws run cheatsheet
bolt ws run cheatsheet --only @offirmo-private/*
bolt ws run cheatsheet --only @oh-my-rpg/*


## build all or a subset
bolt ws run build
bolt ws run build --only @offirmo-private/*
bolt ws run test --only @offirmo-private/*
bolt ws run build --only @oh-my-rpg/*
bolt ws run test --only @oh-my-rpg/*
bolt w @oh-my-rpg/definitions run build


## clean
bolt clean
  bolt ws run clean
  bolt ws exec -- rm -rf .cache .parcel dist node_modules yarn.lock package-lock.json yarn-error.log
## updates dependencies (minor + patch)
bolt clean && rm -rf node_modules yarn.lock package-lock.json && bolt && yarn outdated     && bolt build
npx yarn-tools list-duplicates yarn.lock

## serve for dev
ngrok http -subdomain=offirmo 1234
yarn puer

## publish a package
npm adduser
user: offirmo
email: offirmo.net@gmail.com
npm publish
npm publish --access public
```


## Hat tips

Tools
- Color converter http://www.cssportal.com/css-color-converter/
- favicon https://realfavicongenerator.net/
- https://github.com/scottsidwell/bundle-inspector

## License

`UNLICENSE` so far.

I'm not an expert in licenses, so my work is **implicitly dual-licensed** as fully private for my own use.
This is to allow me to change the license in the future if deemed needed.
```
                  UNLICENSE branch, may stop being updated at some point
                 /
private version ---------- (forever living private branch)
                       \ (maybe in the future)
                         CC0 branch
```
The general principle is that I want to give back,
and I don't mind people reusing my code and creating jobs / value from it even without crediting me.

However, I'd like the (small) marketing efforts I made to benefit only me,
for ex. the name of the modules or the apps may not be re-usable.
Also I don't want my name to be used as an endorsement.

That's why I'm looking into [CC0](https://creativecommons.org/publicdomain/zero/1.0/).

Not sure yet.
