
## Installation

I use macOS 11.6.5 [](update marker) but should work on any unix-like system.

This set of command will build everything: (required as there are dependencies between modules)
```bash
## (update OS, brew, nvm, etc.)
nvm install
npm i -g yarn # bolt only works when installed by yarn
npx browserslist@latest --update-db # cf. https://github.com/browserslist/browserslist#browsers-data-updating
yarn
yarn build
yarn test
```
