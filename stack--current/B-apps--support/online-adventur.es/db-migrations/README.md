

## Principles

We only store in the DB **EXPLICIT** data.
for ex.
* user "called": if not explicitly set, stay empty (will default in code)
* user avatar_url: if not explicitly set, stay empty (will be inferred)

We target the current heroku PostgreSQL addon version:
* 12.7 (2021/08/03)
* 12.6 (2021/05/02)
* 12.4 (2020/11/10)
* 12.3 (2020/07/17)

* https://softwareengineering.stackexchange.com/questions/328458/is-it-good-practice-to-always-have-an-autoincrement-integer-primary-key


## Usage

```bash

## migrate:
yarn latest --debug
SECRET_DATABASE_URL=xxx NODE_ENV=staging yarn latest
SECRET_DATABASE_URL=xxx NODE_ENV=prod    yarn latest

yarn up = advance by one
yarn down = cancel the last one

## reset:
yarn reset

## new file
yarn new
```

### local dev

1. launch docker
2. launch kitematic
3. in kitematic
   1. create a PostgreSQL container with the correct version (see above)
   1. set `POSTGRES_PASSWORD` = `password`
   1. map port 5432 -> 5432
4. check access in pgAdmin (password)


## References

* https://knexjs.org/
* https://github.com/Offirmo-team/wiki/wiki/PostgreSQL

postgres array:
* https://stackoverflow.com/questions/50118196/how-to-insert-array-data-type-using-knex-and-potsgres


## Misc
* TODO try store a hash of the pwd even if using Netlify, to be able to unplug?
* TODO sessions? with confidence level?
* TODO auto migrate on heroku deploy??

## Troubleshooting

### Knex: Timeout acquiring a connection. The pool is probably full. Are you missing a .transacting(trx) call?

Use --debug

Use node 12 and pg^7!! (due to https://github.com/brianc/node-postgres/blob/master/CHANGELOG.md#pg800)

In prod:
- check SSL

In dev:
- if fresh docker image: ensure port mapping 5432 -> 5432
- otherwise check whether the docker DB matches the hardcoded dev preset
