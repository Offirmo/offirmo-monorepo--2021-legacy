import 'babel-polyfill'

const LIB = '🧩 UWDT/devtools'

console.log(`[${LIB}.${+Date.now()}]  Hello!`, {
	panels: chrome.devtools.panels,
})

function get_browser() {
	if (typeof chrome !== 'undefined') {
		if (typeof browser !== 'undefined')
			return 'Firefox'

		return 'Chrome'
	}

	return 'Other'
}

// only this script has access to the devtools API
// https://developer.chrome.com/extensions/devtools

chrome.devtools.inspectedWindow.eval(
	`console.log('[${LIB}.${+Date.now()}] Hello injected from the devtools panel!')`,
	function(result, isException) {
		console.log({
			result,
			isException,
		})
	}
)

const PANEL_NAME = '🛠'
chrome.devtools.panels.create(
	PANEL_NAME,
	'/icons/icon_32x32.png', // works only on FF
	// Chrome and FF have different paths
	'/ui/devtools/devtools-panel.html',
	/*	get_browser() === 'Firefox'
		? './devtools-panel.html'
		: 'ui/devtools-panel.html',*/
	(panel) => {
		// code invoked on panel creation
		console.log(`[${LIB}.${+Date.now()}] Hello from devtools panel "${PANEL_NAME}" creation!`, panel)

		setTimeout(() => {
			console.log('devtools panels = ', chrome.devtools.panels)
		}, 5000)
		/*panel.createSidebarPane(
				"Offirmo Sidebar",
				function(sidebar) {
					 // sidebar initialization code here
					 sidebar.setObject({ some_data: "Some data to show" });
				}
		  );*/
	}
)
