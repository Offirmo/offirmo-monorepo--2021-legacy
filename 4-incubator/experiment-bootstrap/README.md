

//import EventEmitter from 'emittery'

TODO obvious error = invariant
TODO debug = dynamic
TODO emittery


using https://github.com/jamiebuilds/react-loadable for demo


## Concepts

### kill switch, cohort picker, requirement

## API

### concept
see https://hello.atlassian.net/wiki/spaces/~yjutard/pages/248727231/XBL+-+Experiment+Bootstrap+Logic

### Error reporting

This lib will never throw and always default to "not-enrolled" EXCEPT during the spec phase,
where errors are thrown on bad use. The rationale is that those early errors can only happen during local dev.

After the 
