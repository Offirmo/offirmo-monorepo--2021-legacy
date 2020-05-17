
# export and transpilation policy

## policy

The public modules in this mono-repo ase exposed as:
- Latest stable ES, with latest stable module exports
  - with sometimes a few stage 4 features when they are already widely supported https://github.com/tc39/ecma262
- as a convenience, pre-built CJS for latest ES (https://node.green/)
  supported by the oldest active LTS node (https://nodejs.org/en/about/releases/ or https://github.com/nodejs/Release)
- for modules in Typescript, trying to use the latest Typescript, best effort.

See below more exact numbers.

Note: I do NOT agree with the opinion "don't transpile node_modules", see [issue]()

Note: when updating here, also update `0-scripts/build-typescript.js`

### FUTURE update 2020-06
ES2020 approved
https://github.com/tc39/ecma262/releases/tag/es2020

### FUTURE update 2020-05-19
Node 10 in maintenance mode https://nodejs.org/en/about/releases/

### update 2019-07-27
* latest ES = [ES2019](https://en.wikipedia.org/wiki/ECMAScript#Versions)
* oldest active LTS node = [10](https://nodejs.org/en/about/releases/)
* latest ES supported by this node LTS = [ES2018](https://node.green/#ES2018)

## TODO
- TODO are refreshes major or minor?? Most likely major (see @sindre)
- TODO new typescript ?

