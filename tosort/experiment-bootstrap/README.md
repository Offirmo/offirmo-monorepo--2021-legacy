
# [go/xbl](http://go/xbl)

README TODOOO

## Concepts

kill switch, cohort picker, requirement

## API

### concept
* See an example of a real experiment: https://drive.google.com/file/d/1OX4S1U56BOvtbGyGLbf2a3wkk8BSJPSv/view?usp=sharing
* Concept of resolution https://drive.google.com/file/d/1qPzlaxh3Apde3yyfSPc7evL5ggSMjlGX/view?usp=sharing
* API principles https://hello.atlassian.net/wiki/spaces/~yjutard/pages/248727231/XBL+-+Experiment+Bootstrap+Logic

### Error reporting

This lib will never throw and always default to "not-enrolled" EXCEPT during the spec phase,
where errors are thrown on bad use. The rationale is that those early errors can only happen during local dev.
