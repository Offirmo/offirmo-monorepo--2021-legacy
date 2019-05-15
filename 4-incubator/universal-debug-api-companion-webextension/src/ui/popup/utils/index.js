

async function get_current_tab() {
	return new Promise(resolve => {
		// https://stackoverflow.com/a/39840655/587407
		chrome.tabs.query({active: true, currentWindow: true}, ([current_tab]) => {
			resolve({
				...current_tab,
				url: current_tab.url && new URL(current_tab.url),
				index: undefined, // because dangerous to use
			})
		})
	})
}

get_current_tab()
	.then(infos => {
		console.log('current tab=', infos)
	})

