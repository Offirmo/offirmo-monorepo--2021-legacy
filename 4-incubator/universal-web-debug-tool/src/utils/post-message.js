const POST_MSG_NAMESPACE = '_OUDT';

function listenForSafePostMessages({
	logger = console,
	window = window,
	debugId,
	isOriginAllowed = () => true,
	onMessage,
}) {
	function onMessageInternal(event) {
		if (!isOriginAllowed(event.origin)) {
			// no big deal, some browser extensions and some libs (ex. google) send postMessage
			logger.log(
				`${debugId} → postMessage: Ignoring, wrong origin: "${event.origin}".`,
			);
			return;
		}

		if (
			!event.data ||
			typeof event.data !== 'object' ||
			!event.data[POST_MSG_NAMESPACE]
		) {
			// no big deal, google apis client sends a postMessage to parents on load
			logger.log(
				`${debugId} → postMessage: Ignoring, unrecognized data format.`,
				event.data,
			);
			return;
		}

		logger.log(`${debugId} → postMessage: received valid message:`, event.data);

		onMessage({
			origin: event.origin,
			source: event.source,
			data: event.data[POST_MSG_NAMESPACE],
		});
	}

	const listenerOptions = {
		capture: false, // http://devdocs.io/dom/window/postmessage
	};

	window.addEventListener('message', onMessageInternal, listenerOptions);

	return function removeListener() {
		window.removeEventListener('message', onMessageInternal, listenerOptions);
	};
}

export { POST_MSG_NAMESPACE, listenForSafePostMessages };
