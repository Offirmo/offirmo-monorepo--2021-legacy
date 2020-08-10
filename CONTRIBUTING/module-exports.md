
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

Notes:
* when updating here, also update `0-scripts/build-typescript.js`
* when updating node, also update
  * `.nvmrc`
  * `engines` from root `package.json`
  * `@types/node`

### FUTURE 2020-10-20
oldest active LTS node is no longer 12, now 14

### FUTURE ???
webpack 5 featuring Acorn 7 released = able to parse ES2020
https://github.com/webpack/webpack/milestone/18

### 2020-06-28
ES2020 approved https://github.com/tc39/ecma262/releases/tag/es2020
* latest ES = [ES2020](https://en.wikipedia.org/wiki/ECMAScript#Versions)
* oldest active LTS node = [12](https://nodejs.org/en/about/releases/)
* latest ES supported by this node LTS = [ES2019](https://node.green/#ES2019)
* latest ES syntax supported by Webpack (= Acorn supports it + webpack bumped Acorn) = 2019
* FYI compilers/polyfills https://kangax.github.io/compat-table/es2016plus/

Babel plugins
* https://devblogs.microsoft.com/typescript/typescript-and-babel-7/


### 2020-05-29
Switching to supporting oldest node = 12
since node 10 in maintenance mode since 2020-05-19 https://nodejs.org/en/about/releases/
* latest ES = [ES2019](https://en.wikipedia.org/wiki/ECMAScript#Versions)
* oldest active LTS node = [12](https://nodejs.org/en/about/releases/)
* latest ES supported by this node LTS = [ES2019](https://node.green/#ES2019)

### update 2019-07-27
* latest ES = [ES2019](https://en.wikipedia.org/wiki/ECMAScript#Versions)
* oldest active LTS node = [10](https://nodejs.org/en/about/releases/)
* latest ES supported by this node LTS = [ES2018](https://node.green/#ES2018)

## TODO
- TODO are refreshes major or minor?? Most likely major (see @sindre)
- TODO new typescript ?
