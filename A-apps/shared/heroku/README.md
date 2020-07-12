

## Admin

### Install

```bash

## https://medium.com/inato/how-to-setup-heroku-with-yarn-workspaces-d8eac0db0256
heroku apps

heroku buildpacks:add --app online-adventures-staging heroku/nodejs
heroku buildpacks:add --app online-adventures-staging https://github.com/heroku/heroku-buildpack-multi-procfile
heroku config:set --app online-adventures-staging PROCFILE=A-apps/shared/heroku/Procfile
heroku buildpacks --app online-adventures-staging

heroku buildpacks:add --app online-adventures-prod https://github.com/heroku/heroku-buildpack-multi-procfile
heroku config:set --app online-adventures-prod PROCFILE=A-apps/shared/heroku/Procfile

```

### PostGres
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
