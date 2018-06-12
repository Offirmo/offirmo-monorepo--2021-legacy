# unit-test-toolbox
A convenient aggregation of quality npm modules to be used for writing unit tests.
Just install this module and you get everything needed at once!

**v4 breaking change:**
* bumped all to latest major (as usual)
* dropped legacy node compatibility (<2) may still work but didn't try and won't maintain.

This modules bundles:
* `mocha`
* `chai`
* `sinon`
* `sinon-chai`
* `chai-as-promised`
* `chai-subset`
* `chai-moment`
* `eslint-plugin-mocha` and `eslint-plugin-chai-expect`

It also exposes:
- a pre-made plumbing for:
  - activating the `chai.expect` interface
  - activating correctly the chai plugins: `sinon-chai`, `chai-as-promised`, `chai-subset`, `chai-moment`
- a pre-made mocha options file

**In progress**:
- working on integrating sinon properly
- working on typescript compatibility


## Introduction - the problem
Writing unit tests in JavaScript with mocha/chai requires assembling a bunch of modules and repeating the same operations:

**:-1: WITHOUT @offirmo/unit-test-toolbox :-1: :hurtrealbad:**:
1. remembering all the libs needed
1. installing them: `npm install mocha chai sinon sinon-chai chai-as-promised chai-subset chai-moment`
1. if using typescript: `npm install @types/mocha @types/chai @types/sinon @types/sinon-chai @types/chai-as-promised`
1. write an init file for activating `chai.expect` (what else ?), `sinon-chai` and `chai-as-promised`
1. write the npm task `"test": "mocha --opts mocha.opts path/to/init.js '<glob_to_my_tests/**/*spec.js>'"`
1. keep all those dependencies up-to-date

The proposed solution:

**:+1: WITH @offirmo/unit-test-toolbox :+1: :sunglasses:**:
1. install only one module `npm i -D @offirmo/unit-test-toolbox`
1. copy this npm task `"test": "mocha --opts mocha.opts node_modules/@offirmo/unit-test-toolbox/mocha-chai-init-node.js '<glob_to_my_tests/**/*spec.js>'"`
1. keep @offirmo/unit-test-toolbox up-to-date


## Installation & usage

### recent npm
Targeting node >= 8 & npm >= 3 (for we abuse the flat deps)

```shell
npm i --save-dev @offirmo/unit-test-toolbox
```

If you want to use the pre-written init file, reference it in your `test` task:
```json
  "scripts": {
    "test": "mocha --opts node_modules/@offirmo/unit-test-toolbox/mocha.opts node_modules/@offirmo/unit-test-toolbox/mocha-chai-init.js 'test/unit/src/**/*spec.js'"
  },
```


## See also
* mocha
* chai
* sinon
* sinon-chai
* chai-as-promised
* chai-subset
* chai-moment https://www.npmjs.com/package/chai-moment


## Contributing
Suggestions welcome.
