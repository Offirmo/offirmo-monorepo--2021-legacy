
## policy

* We strive for the latest LTS unless feature needed. Using `yarn outdated`
* prod vs dev


## dependencies version

### Actual exceptions to `yarn outdated`

In alphabetical order:
* `@atlaskit/*` requires work to upgrade
* `@types/node` we rightfully target the oldest active LTS, should be ignored
* `pg` there is a breaking change that we can't overcome yet through our ORM (knex)
* `react-overlays` requires work to upgrade
* `styled-components` old version required by @atlaskit
* `typescript` always tricky to update

### Pending upgrade

* parcel 2 when stable https://medium.com/@devongovett/parcel-2-beta-1-improved-stability-tree-shaking-source-map-performance-and-more-78179779e8b7
* pg ^8 with https://github.com/brianc/node-postgres/blob/master/CHANGELOG.md#pg810
* Atlaskit: replace with formix?

## prod vs dev

We use prod vs. dev as an indicator of what is a build/dev/test tool vs. a lib used in the actual code.

Note that "bolt" is needed to launch heroku thus is listed in "prod"
