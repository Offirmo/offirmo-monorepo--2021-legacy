# offirmo-monorepo

A monorepo for all my JavaScript / TypeScript projects. So convenient.


## Contributing

Unless exceptions, this repo follow those principles:
- code in TypeScript
- command / query separation
- compatible with event sourcing (for offline first with server replay when back online)


Doc:
* monorepo managed by https://github.com/boltpkg/bolt
  * TODO use https://www.npmjs.com/package/@atlaskit/build-releases as well
* stable code is in TypeScript https://www.typescriptlang.org/docs/handbook/compiler-options.html


```bash
nvm install
npm i -g yarn
yarn global add bolt
bolt
bolt ws run build
bolt ws run test
bolt ws run cheatsheet
bolt ws run cheatsheet --only @offirmo-private/*
bolt ws run cheatsheet --only @oh-my-rpg/*


bolt ws run build --only @offirmo-private/*
bolt ws run test --only @offirmo-private/*
bolt ws run build --only @oh-my-rpg/*
bolt ws run test --only @oh-my-rpg/*
bolt ws run build

bolt clean
  bolt ws run clean
  bolt ws exec -- rm -rf .cache .parcel dist node_modules yarn.lock package-lock.json yarn-error.log
bolt clean && rm -rf node_modules yarn.lock package-lock.json && bolt && yarn outdated && bolt build
npx yarn-tools list-duplicates yarn.lock


bolt w @oh-my-rpg/definitions run build
ngrok http -subdomain=offirmo 1234
yarn puer
```


## Hat tips

Tools
- Color converter http://www.cssportal.com/css-color-converter/
- favicon https://realfavicongenerator.net/
- https://github.com/scottsidwell/bundle-inspector
