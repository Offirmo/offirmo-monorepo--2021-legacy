# offirmo-monorepo
A monorepo for all my JavaScript / TypeScript projects. So convenient.


## Contributing

Doc:
* https://github.com/boltpkg/bolt
* https://www.typescriptlang.org/docs/handbook/compiler-options.html



```bash
bolt ws run build
bolt ws run test
bolt ws run cheatsheet
bolt ws run cheatsheet --only @oh-my-rpg/*
bolt ws run clean

bolt ws exec -- rm -rf dist
bolt ws exec -- rm -rf node_modules yarn.lock package-lock.json
rm -rf node_modules yarn.lock package-lock.json

bolt ws run build --only @offirmo/*
bolt ws run build --only @oh-my-rpg/*

bolt w @oh-my-rpg/definitions run build
```

## Notes
