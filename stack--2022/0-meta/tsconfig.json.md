## tsconfig

Too bad we can't add comments to the file ;)

### Introduction

This is a base config meant to be *extended* (through https://www.typescriptlang.org/tsconfig#extends)

Last update: [https://devblogs.microsoft.com/typescript/](update marker) 2022/03/21


### References

* "What is a tsconfig.json" https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
* "reference" https://www.typescriptlang.org/tsconfig
* VERY IMPORTANT https://www.typescriptlang.org/docs/handbook/module-resolution.html




### TOSORT

TODO  "moduleResolution": "node12",
* ??? https://www.typescriptlang.org/tsconfig#downlevelIteration
  * useful for older JS runtimes, we are not concerned
* ??? https://www.typescriptlang.org/tsconfig#preserveConstEnums
* TODO https://www.typescriptlang.org/tsconfig#plugins
* composite: disabled for now as it needs rootDir and not sure of the benefits
*
This should be the standard
```json
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
```
Also the correct way to import React is `import * as React from 'react'`, cf. https://github.com/facebook/react/pull/18102
