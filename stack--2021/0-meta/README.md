

## Browsers list
See [README.md](./browserslist-config/README.md)


## ESLint
I'm not actively using ESLint. Config would need a review.


## storybook viewports
The viewports I plan to support.


## tsconfig

Too bad one can't add comments to the file.
```js
{
	"compileOnSave": false,
	"compilerOptions": {

		"allowJs": false,
		"checkJs": false,
		"lib": [ "ES2019" ],
		"moduleResolution": "node",

		"listEmittedFiles": false,
		"listFiles": false,
		"skipLibCheck": true,
		"noEmitOnError": true,
		"pretty": true,
		"extendedDiagnostics": false,

		"strict": true,
		"allowUnreachableCode": false,
		"allowUnusedLabels": false,
		"forceConsistentCasingInFileNames": true,
		"keyofStringsOnly": true,
		"noFallthroughCasesInSwitch": true,
		"noImplicitAny": true,
		"noImplicitOverride": true,
		"noImplicitReturns": true,
		"noImplicitThis": true,
		"strictBindCallApply": true,
		"strictFunctionTypes": true,
		"strictNullChecks": true,
		"strictPropertyInitialization": true,

		"alwaysStrict": true,
		"declaration": true,
		"experimentalDecorators": false,
		"emitDecoratorMetadata": false,
		"importHelpers": true,
		"noEmitHelpers": true,
		"jsx": "react-jsx",

		"module": "ES2015",
		"esModuleInterop": true, // recommended standard https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#support-for-import-d-from-cjs-from-commonjs-modules-with---esmoduleinterop
"allowSyntheticDefaultImports": true, // recommended standard https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#support-for-import-d-from-cjs-from-commonjs-modules-with---esmoduleinterop
"target": "ES2019",
		"newLine": "lf",
		"sourceMap": true,
		"resolveJsonModule": true,

		"preserveSymlinks": false
	},
}

```

This should be the standard
```json
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
```
Also the correct way to import React is `import * as React from 'react'`, cf. https://github.com/facebook/react/pull/18102


### TODO
review latest!

		"noPropertyAccessFromIndexSignature": true,
