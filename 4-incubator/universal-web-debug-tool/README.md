# hello-world-browser-extension

The simplest, most trivial browser extension, featuring:
* content script (aka. injected)
* background script
* toolbar button opening a popup
* options page
* notification
* ...

## references

* https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_first_WebExtension
* https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Your_second_WebExtension
* https://developer.chrome.com/extensions/getstarted

API
* permissions https://developer.chrome.com/extensions/declare_permissions#manifest

```json
	"permissions": [
		"alarms",
		"background",
		"bookmarks",
		"clipboardRead",
		"clipboardWrite",
		"contentSettings",
		"contextMenus",
		"cookies",
		"debugger",
		"downloads",
		"geolocation",
		"history",
		"idle",
		"management",
		"nativeMessaging",
		"notifications",
		"storage",
		"tabs",
		"unlimitedStorage",
		"webNavigation"
	],
```
