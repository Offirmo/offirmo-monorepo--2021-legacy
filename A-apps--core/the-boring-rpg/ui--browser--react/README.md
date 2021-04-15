
## Usage

Remember to tweak the body and root! (see demo)

```js
<OhMyRPGUIContext.Consumer>
	{omr => {
		omr.enqueueNotification({
		level: 'info', // error, warning, success
		title: 'info', message: ...text, // OR use only "children"
		children: rich_text_to_react($doc),
		position: 'bottom-center', // top-center
		auto_dismiss_delay_ms: 0,
		})
	}}
</OhMyRPGUIContext.Consumer>
```

## Credits
* https://github.com/igorprado/react-notification-system
* https://github.com/negomi/react-burger-menu
  * scale-down
  * slide
