
# export and transpilation policy

## policy

The public modules in this mono-repo ase exposed as:
- Latest stable ES, with latest stable module exports
  - with sometimes a few stage 4 features when they are already widely supported https://github.com/tc39/ecma262
- as a convenience, pre-built CJS for latest ES (https://node.green/) supported by the oldest active LTS node (https://nodejs.org/en/about/releases/)
- for modules in Typescript, trying to use the latest Typescript, best effort.

See below more exact numbers.

Note: I do NOT agree with the opinion "don't transpile node_modules", see (issue)[]

### last update 2019-07-27
* latest ES = ES2019
* oldest active LTS node = 10
* latest ES supported by this node LTS = [ES2018](https://node.green/#ES2018)

### PENDING NEXT UPDATE scheduled around: 2020-04
* latest ES = ES2020
* oldest active LTS node = 12
* latest ES supported by this node LTS = TODO



## TODO
- TODO are refreshes major or minor?? Most likely major (see @sindre)
- TODO new typescript ?

