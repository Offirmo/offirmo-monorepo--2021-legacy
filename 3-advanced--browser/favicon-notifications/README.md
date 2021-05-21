

This is an aggregation of 2 other libs:
* https://github.com/ejci/favico.js (dual licensed GPL or MIT)
  * [demo](https://lab.ejci.net/favico.js/)
* https://github.com/lipka/piecon (MIT)
  * [demo](https://lipka.github.io/piecon/)

Modifications made:
* sub-libs can take a target "window"
* using the above, made it work for simple same-origin iframe setups
* TODO fix a CORS issue


Be careful of the prerequisites / bugs
- https://github.com/ejci/favico.js/issues/139#issuecomment-366200563
- https://github.com/ejci/favico.js/issues/117
