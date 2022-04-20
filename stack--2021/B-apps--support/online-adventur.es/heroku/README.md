
This app exists only for the sake of getting the free db addons!

## Admin

### Install

```bash

## https://medium.com/inato/how-to-setup-heroku-with-yarn-workspaces-d8eac0db0256
heroku apps

## STAGING
heroku buildpacks:add --app online-adventures-staging heroku/nodejs
heroku buildpacks:add --app online-adventures-staging https://github.com/heroku/heroku-buildpack-multi-procfile
heroku config:set     --app online-adventures-staging PROCFILE=B-apps--support/online-adventur.es/heroku/Procfile
heroku config:set     --app online-adventures-staging PGSSLMODE=no-verify ## https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js

## PROD
## no buildpack heroku/nodejs for PROD (reason?)
heroku buildpacks:add --app online-adventures-prod https://github.com/heroku/heroku-buildpack-multi-procfile
heroku config:set     --app online-adventures-prod PROCFILE=B-apps--support/online-adventur.es/heroku/Procfile
heroku config:set     --app online-adventures-prod PGSSLMODE=no-verify ## https://devcenter.heroku.com/articles/heroku-postgresql#connecting-in-node-js
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

### troubleshoot

```bash
heroku apps

heroku buildpacks --app online-adventures-staging
heroku config --app online-adventures-staging
heroku addons --app online-adventures-staging
```

Node version (need a recent deploy!) [](update marker)
- 2021/10/12 seen 16.11.0
- 2021/08/03 seen 14.17.4
- 2021/06/25 seen 14.17.1
- 2021/03/30 seen 14.16
- 2021/01/04 seen 14.15.4
- 2020/11/02 seen 14.15
- 2020/09/06 seen 12.18.3 = latest 12.x
Adjust it into [.babelrc](update marker) !
