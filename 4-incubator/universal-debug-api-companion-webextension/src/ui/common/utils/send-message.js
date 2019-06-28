
export default function send_message(msg) {
	if (!chrome.tabs) return

	chrome.runtime.sendMessage(msg)
}
