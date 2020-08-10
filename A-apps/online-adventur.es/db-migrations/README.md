

## Principles

We only store in the DB **EXPLICIT** data.
for ex.
* user "called": if not explicitly set, stay empty (will default in code)
* user avatar_url: if not explicitly set, stay empty (will be inferred)

We target the current heroku PostgreSQL addon version: 12.3 (2020/07/17)

* https://softwareengineering.stackexchange.com/questions/328458/is-it-good-practice-to-always-have-an-autoincrement-integer-primary-key


## Usage

```bash

## migrate:
yarn latest --debug
SECRET_DATABASE_URL=xxx NODE_ENV=staging yarn up
SECRET_DATABASE_URL=xxx NODE_ENV=prod    yarn up

yarn down = cancel the last one

## reset:
yarn reset

## new file
yarn new
```

### local dev

1. docker
2. kitematic
3. in kitematic, create a PostgreSQL container with the correct version + set `POSTGRES_PASSWORD` = `password`
4. pgAdmin (password)


## References

* http://knexjs.org/
* https://github.com/Offirmo-team/wiki/wiki/PostgreSQL

## Misc
* TODO try store a hash of the pwd even if using Netlify, to be able to unplug
* TODO sessions? with confidence level?
* TODO auto migrate on heroku deploy??
