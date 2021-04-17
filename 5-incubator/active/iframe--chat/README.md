https://tlk.io/

Improvement over tlk.io which loads a script into the host page!
Turns that into a safe embedding of an iframe, passing params as query params. Much safer + allows easier reloading.

API:

- channel name
- theme: Day | Night | Pop | Minimal
- custom CSS
- custom nickname `data-nickname="somename"`
- note: the chat has a breakpoint at <765px (or 762?)

```html
<div id="tlkio"
  data-channel="hey"
  data-theme="theme--day"
  style="width:100%;height:100%;"
  data-custom-css="foo/bar.css"
  data-nickname="somename"
></div>
<script async src="http://tlk.io/embed.js" type="text/javascript"></script>
```
