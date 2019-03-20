# Universal web debug tool

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
,
		"96": "icons/icon_96x96.png",
		"48": "icons/icon_48x48.png"


possible icons:
* https://thenounproject.com/term/spanner/1151516/
* https://thenounproject.com/term/debugging/1053402/
* https://thenounproject.com/term/debugging/1053401/
* https://thenounproject.com/term/breaking-point/1053394/
