https://tlk.io/

Improvement over tlk.io which loads a script into the host page!
Turns that into a safe embedding of an iframe, passing params as query params. Much safer + allows easier reloading.

API:

## Usage

https://cdn.jsdelivr.net/gh/Offirmo/offirmo-monorepo@master/3-advanced--browser/iframe--chat/dist/single-chat-container.html


```html
		<iframe id="group-chat-container"
			class="o⋄top-container"
			title="chat"
			width="100%"
			height="800px"
			referrerpolicy="same-origin"
			allow=""
			sandbox="allow-same-origin allow-scripts"
			src="../node_modules/@offirmo-private/iframe--chat/src/single-chat-container.html?id=test&nickname=dev&theme=night"
		>The chat should load here</iframe>

xsrc="../../src/single-chat-container.html?id=test&nickname=dev&theme=night&bg_color=transparent"
src="../../src/single-chat-container.html?id=none"
xxsrc="../../src/single-chat-container.html?id=test&theme=pop&bg_color=yellow&nickname=dev"
```

Properties:
* `id` = channel id, [a-z\-]*, defaulting to: referrer hostname (sanitized). Special value: `null` = won't load the chat (useful for early loading that needs to wait for data)
* `theme` defaulting to: 'minimal'
* `bg_color` defaulting to: [variable according to the theme]
* `nickname` defaulting to: 'anonymousⵧ' + random id (stored in LS for stability)
* `css_overrides_url` defaulting to: [none]

## Dev

### demo files

```
http://localhost:1234/demo--tlk.io.html
http://localhost:1234/demo.html
http://localhost:1234/__/__/src/single-chat-container.html?theme=pop&bg_color=yellow&nickname=admin
http://localhost:1234/overrides.css

https://www.offirmo.net/offirmo-monorepo/3-advanced--browser/iframe--chat/doc/demo/demo.html
https://www.offirmo.net/offirmo-monorepo/3-advanced--browser/iframe--chat/src/single-chat-container.html
```

### tlk.io interface

- channel name
- theme: Day | Night | Pop | Minimal
- custom CSS
- custom nickname `data-nickname="somename"`
- note: the chat has a breakpoint at <765px (or 762? depending )

```html
<div id="tlkio"
  data-channel="hey"
  data-theme="theme--day"
  style="width:100%;height:100%;"
  data-custom-css="foo/bar.css"
  data-nickname="somename"
></div>
<script async src="//tlk.io/embed.js" type="text/javascript"></script>
```
