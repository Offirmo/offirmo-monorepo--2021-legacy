


TODO debug = dynamic
TODO emittery?
TODO remove all TODOs
TODO check React.lazy https://itnext.io/react-code-splitting-in-2019-9a5d2776c502

using https://github.com/jamiebuilds/react-loadable for demo


## Concepts

### kill switch, cohort picker, requirement

## API

### concept
* See an example of a real experiment: https://drive.google.com/file/d/1OX4S1U56BOvtbGyGLbf2a3wkk8BSJPSv/view?usp=sharing
* Concept of resolution https://drive.google.com/file/d/1qPzlaxh3Apde3yyfSPc7evL5ggSMjlGX/view?usp=sharing
* API principles https://hello.atlassian.net/wiki/spaces/~yjutard/pages/248727231/XBL+-+Experiment+Bootstrap+Logic

### Error reporting

This lib will never throw and always default to "not-enrolled" EXCEPT during the spec phase,
where errors are thrown on bad use. The rationale is that those early errors can only happen during local dev.

