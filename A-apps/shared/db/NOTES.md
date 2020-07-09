
## Principles

### No mixing of persisted data and logic data

- in general, persisted data should really reflect what is in the persistence layer
- A conversion may be needed from persisted data to actual logic data,
  note the role of thi lib
- Defaults may be provided, however the persisted data shouldn't have them,
  in order to preserve the fact that the data is missing in the first place


## Admin

https://devcenter.heroku.com/articles/heroku-postgres-maintenance

```bash
heroku pg:info --app online-adventures

heroku maintenance:on --app online-adventures
heroku pg:maintenance:run DATABASE --app online-adventures
heroku maintenance:off --app online-adventures

## https://devcenter.heroku.com/articles/upgrading-heroku-postgres-databases
heroku addons:create heroku-postgresql:hobby-dev --app online-adventures
heroku pg:wait --app online-adventures
heroku pg:info --app online-adventures
heroku maintenance:on --app online-adventures
heroku pg:copy DATABASE_URL HEROKU_POSTGRESQL_BLACK --app online-adventures
heroku pg:promote HEROKU_POSTGRESQL_BLACK --app online-adventures
heroku maintenance:off --app online-adventures
heroku addons:destroy HEROKU_POSTGRESQL_MAROON --app online-adventures
```
## Tosort

postgres://someuser:somepassword@somehost:port/somedatabase

dev:
postgres://postgres:@127.0.0.1:32768/postgres


export UDA_OVERRIDE__LOGGER_OA_DB_LOGLEVEL=\"silly\" \


https://github.com/Offirmo-team/wiki/wiki/courriel
https://github.com/johno/normalize-email
https://github.com/iDoRecall/email-normalize
