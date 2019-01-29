# offirmo-monorepo

A monorepo for all my JavaScript / TypeScript projects. So convenient.


## Contributing

Doc:
* https://github.com/boltpkg/bolt
* https://www.typescriptlang.org/docs/handbook/compiler-options.html



```bash
nvm install
npm i -g yarn
yarn global add bolt
bolt
bolt ws run build
bolt ws run test
bolt ws run cheatsheet
bolt ws run cheatsheet --only @offirmo/*
bolt ws run cheatsheet --only @oh-my-rpg/*


bolt ws run build --only @offirmo/*
bolt ws run test --only @offirmo/*
bolt ws run build --only @oh-my-rpg/*
bolt ws run test --only @oh-my-rpg/*
bolt ws run build

bolt clean
  bolt ws run clean
  bolt ws exec -- rm -rf .cache .parcel dist node_modules yarn.lock package-lock.json yarn-error.log
rm -rf node_modules yarn.lock package-lock.json && bolt && yarn outdated
npx yarn-tools list-duplicates yarn.lock


bolt w @oh-my-rpg/definitions run build
ngrok http -subdomain=offirmo 1234
yarn puer
```

## Notes

```bash
npm i -g yarn
yarn global add bolt
```
TODO https://www.npmjs.com/package/eslint-import-resolver-typescript

Fragments
```js
		"memoize-one": "^5",
		"tiny-invariant": "^1",

```
## Hat tips

Tools
- Color converter http://www.cssportal.com/css-color-converter/
- favicon https://realfavicongenerator.net/
* https://github.com/scottsidwell/bundle-inspector



https://github.com/netlify/netlify-identity-widget
