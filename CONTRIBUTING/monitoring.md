# Monitoring of the stuff controlled by this monorepo


## Prod

Pipelines:
* Netlify: [![Netlify Status](https://api.netlify.com/api/v1/badges/b2bbd92c-ab3d-43c5-ba8f-44bb0dbcd8cb/deploy-status)](https://app.netlify.com/sites/online-adventures/deploys)
* Heroku: [pipeline](https://dashboard.heroku.com/pipelines/3da19b18-c3a6-4a10-bd8c-ae45c236da98) | [Activity](https://dashboard.heroku.com/apps/online-adventures-prod/activity) | [Logs](https://dashboard.heroku.com/apps/online-adventures-prod/logs)

Monitoring:
* uptime + perfs: https://onlineornot.com/app/pages
* Sentry: [Backend](https://sentry.io/organizations/offirmo/issues/?project=1772719) | [Frontend -- TBRPG](https://sentry.io/organizations/offirmo/issues/?project=1235383)
* functions log: https://app.netlify.com/sites/online-adventures/functions
* Analytics: [UA](https://analytics.google.com/analytics/web/#/report/content-event-overview/a103238291w176401989p175259321/_u.date00=20210101&_u.date01=20210131&_u.date10=20201201&_u.date11=20201231)


| web surface | status |
| ----------- | ------ |
| `https://www.online-adventur.es`**`/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.online-adventur.es.svg)](https://www.online-adventur.es/) |
| `https://www.online-adventur.es`**`/apps/the-boring-rpg/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.online-adventur.es/apps/the-boring-rpg.svg)](https://www.online-adventur.es/apps/the-boring-rpg) |
| `https://www.online-adventur.es`**`/apps/the-boring-rpg-preprod/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.online-adventur.es/apps/the-boring-rpg-preprod.svg)](https://www.online-adventur.es/apps/the-boring-rpg-preprod) |
| `https://www.online-adventur.es`**`/.netlify/functions/hello-world/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.online-adventur.es/.netlify/functions/hello-world.svg)](https://www.online-adventur.es/.netlify/functions/hello-world)
| `https://online-adventures-prod.herokuapp.com`**`/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/online-adventures-prod.herokuapp.com.svg)](https://online-adventures-prod.herokuapp.com)

| module | version | build time |
| ------ | ------- | ---------- |
| webapp -- TBRPG | ![Custom badge](https://img.shields.io/endpoint?color=green&url=https%3A%2F%2Fwww.online-adventur.es%2Fapps%2Fthe-boring-rpg%2Fbuild_badge_version.json) | ![Custom badge](https://img.shields.io/endpoint?color=green&url=https%3A%2F%2Fwww.online-adventur.es%2Fapps%2Fthe-boring-rpg%2Fbuild_badge_time.json)
| webapp -- TBRPG preprod | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Fwww.online-adventur.es%2Fapps%2Fthe-boring-rpg-preprod%2Fbuild_badge_version.json) | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Fwww.online-adventur.es%2Fapps%2Fthe-boring-rpg-preprod%2Fbuild_badge_time.json)
| support -- API ([functions](https://app.netlify.com/sites/online-adventures/functions)) | ![Custom badge](https://img.shields.io/endpoint?color=green&url=https%3A%2F%2Fwww.online-adventur.es%2F.netlify%2Ffunctions%2Fbadges%2Fversion) | ![Custom badge](https://img.shields.io/endpoint?color=green&url=https%3A%2F%2Fwww.online-adventur.es%2F.netlify%2Ffunctions%2Fbadges%2Ftime)
| support -- DB ([heroku](https://dashboard.heroku.com/pipelines/3da19b18-c3a6-4a10-bd8c-ae45c236da98)) | ![Custom badge](https://img.shields.io/endpoint?color=green&url=https%3A%2F%2Fonline-adventures-prod.herokuapp.com%2Fbadges%2Fversion) | ![Custom badge](https://img.shields.io/endpoint?color=green&url=https%3A%2F%2Fonline-adventures-prod.herokuapp.com%2Fbadges%2Ftime)

No-code
* [Tag Manager](https://tagmanager.google.com/)
* TODO graphql?



## Staging

Pipelines:
* Netlify: [![Netlify Status](https://api.netlify.com/api/v1/badges/25734112-d205-4789-ad2f-bfcdf8d65252/deploy-status)](https://app.netlify.com/sites/offirmo-monorepo/deploys)
* Heroku: [pipeline](https://dashboard.heroku.com/pipelines/3da19b18-c3a6-4a10-bd8c-ae45c236da98) | [Activity](https://dashboard.heroku.com/apps/online-adventures-staging/activity) | [Logs](https://dashboard.heroku.com/apps/online-adventures-staging/logs)

| web surface | status |
| ----------- | ------ |
| `https://offirmo-monorepo.netlify.app`**`/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/offirmo-monorepo.netlify.app/index.html.svg)](https://offirmo-monorepo.netlify.app/)
| `https://offirmo-monorepo.netlify.app`**`/C-apps--clients/the-boring-rpg/client--browser/dist/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/offirmo-monorepo.netlify.app/C-apps--clients/the-boring-rpg/client--browser/dist.svg)](https://offirmo-monorepo.netlify.app/C-apps--clients/the-boring-rpg/client--browser/dist)
| `https://offirmo-monorepo.netlify.app`**`/.netlify/functions/hello-world/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/offirmo-monorepo.netlify.app/.netlify/functions/hello-world.svg)](https://offirmo-monorepo.netlify.app/.netlify/functions/hello-world)
| `https://online-adventures-staging.herokuapp.com`**`/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/online-adventures-staging.herokuapp.com.svg)](https://online-adventures-staging.herokuapp.com)

| module | version | build time |
| ------ | ------- | ---------- |
| webapp -- TBRPG | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Foffirmo-monorepo.netlify.app%2FC-apps--clients%2Fthe-boring-rpg%2Fclient--browser%2Fdist%2Fbuild_badge_version.json) | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Foffirmo-monorepo.netlify.app%2FC-apps--clients%2Fthe-boring-rpg%2Fclient--browser%2Fdist%2Fbuild_badge_time.json)
| support -- API ([functions](https://app.netlify.com/sites/offirmo-monorepo/functions)) | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Foffirmo-monorepo.netlify.app%2F.netlify%2Ffunctions%2Fbadges%2Fversion) | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Foffirmo-monorepo.netlify.app%2F.netlify%2Ffunctions%2Fbadges%2Ftime)
| support -- DB ([heroku](https://dashboard.heroku.com/pipelines/3da19b18-c3a6-4a10-bd8c-ae45c236da98)) | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Fonline-adventures-staging.herokuapp.com%2Fbadges%2Fversion) | ![Custom badge](https://img.shields.io/endpoint?color=yellow&url=https%3A%2F%2Fonline-adventures-staging.herokuapp.com%2Fbadges%2Ftime)



## Github pages

| web surface | status |
| ----------- | ------ |
| `https://www.offirmo.net`**`/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.offirmo.net.svg)](https://www.offirmo.net/)
| `https://www.offirmo.net`**`/blog/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.offirmo.net/blog.svg)](https://www.offirmo.net/blog)
| `https://www.offirmo.net`**`/offirmo-monorepo/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.offirmo.net/offirmo-monorepo/.svg)](https://www.offirmo.net/offirmo-monorepo/)
| `https://www.offirmo.net`**`/offirmo-monorepo/C-apps--clients/the-boring-rpg/client--browser/dist/`** | [![Website](https://img.shields.io/website-up-down-green-red/https/www.offirmo.net/offirmo-monorepo/C-apps--clients/the-boring-rpg/client--browser/dist/.svg)](https://www.offirmo.net/offirmo-monorepo/C-apps--clients/the-boring-rpg/client--browser/dist/)

Versions
* TBRPG client ![Custom badge](https://img.shields.io/endpoint?color=orange&url=https%3A%2F%2Fraw.githubusercontent.com%2FOffirmo%2Foffirmo-monorepo%2Fmaster%2FC-apps--clients%2Fthe-boring-rpg%2Fclient--browser%2Fdist%2Fbuild_badge_version.json) ![Custom badge](https://img.shields.io/endpoint?color=orange&url=https%3A%2F%2Fraw.githubusercontent.com%2FOffirmo%2Foffirmo-monorepo%2Fmaster%2FC-apps--clients%2Fthe-boring-rpg%2Fclient--browser%2Fdist%2Fbuild_badge_time.json)

## src

Versions
* TBRPG state (src) ![Custom badge](https://img.shields.io/endpoint?color=orange&url=https%3A%2F%2Fraw.githubusercontent.com%2FOffirmo%2Foffirmo-monorepo%2Fmaster%2FA-apps--core%2Fthe-boring-rpg%2Fstate%2Fsrc%2Fbuild_badge_version.json)


Open issues
[![GitHub issues](https://img.shields.io/github/issues/Offirmo/offirmo-monorepo)](https://github.com/Offirmo/offirmo-monorepo/issues)



## Notes
* https://shields.io/endpoint
