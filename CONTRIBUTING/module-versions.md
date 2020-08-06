
## policy

We strive for the latest stable.


## Actual exceptions

In alphabetical order:
* `@atlaskit/*` requires work to upgrade
* `@types/node` we rightfully target the oldest LTS, should be ignored
* `pg` there is a breaking change that we can't overcome yet through our ORM (knex)
* `react-overlays` requires work to upgrade
* `styled-components` old version required by @atlaskit


## Pending

* parcel 2 when stable https://medium.com/@devongovett/parcel-2-beta-1-improved-stability-tree-shaking-source-map-performance-and-more-78179779e8b7
