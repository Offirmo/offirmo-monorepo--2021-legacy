
## policy

* We strive for the latest LTS unless a feature is critically needed. Using `yarn outdated`
* prod vs dev


## dependencies version

### Actual bugs / forced resolutions

* open bug https://github.com/parcel-bundler/parcel/issues/5943#issuecomment-788928442

### Actual outdated (cf. `yarn outdated`)

In alphabetical order:
* `@atlaskit/*` requires work to upgrade
* `@types/node` we rightfully target the oldest active LTS, should be ignored
* `parcel-bundler` should be upgraded to v2 according to https://github.com/parcel-bundler/parcel/issues/5943#issuecomment-789080294
* `pg` there is a breaking change that we can't overcome yet through our ORM (knex) TODO https://github.com/brianc/node-postgres/blob/master/CHANGELOG.md#pg810   https://github.com/knex/knex/blob/master/UPGRADING.md
* `styled-components` old version required by @atlaskit
* parcel 2 when stable https://medium.com/@devongovett/parcel-2-beta-1-improved-stability-tree-shaking-source-map-performance-and-more-78179779e8b7
* Atlaskit: replace with formix?


## prod vs dev

We use prod vs. dev as an indicator of what is a build/dev/test tool vs. a lib used in the actual code.

Note that "bolt" is needed to launch heroku thus is listed in "prod"
