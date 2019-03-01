import 'babel-polyfill'

console.log(`🧩 [T=${+Date.now()}] Hello from hello-world-browser-extension (content-scripts/start)`)


// https://github.com/intoli/intoli-article-materials/blob/master/articles/sandbox-breakout/extension/sandbox-breakout.js
// https://intoli.com/blog/sandbox-breakout/
// Breaks out of the content script context by injecting a specially
// constructed script tag and injecting it into the page.
function runInPageContext(method, ...args) {
	// The stringified method which will be parsed as a function object.
	const stringifiedMethod = method instanceof Function
		? method.toString()
		: `() => { ${method} }`;

	// The stringified arguments for the method as JS code that will reconstruct the array.
	const stringifiedArgs = JSON.stringify(args);

	// The full content of the script tag.
	const scriptContent = `
    // Parse and run the method with its arguments.
    (${stringifiedMethod})(...${stringifiedArgs});
    // Remove the script element to cover our tracks.
    //document.currentScript.parentElement.removeChild(document.currentScript);
  `;

	// Create a script tag and inject it into the document.
	const scriptElement = document.createElement('script');
	//scriptElement.setAttribute("type", "module");
	scriptElement.innerHTML = scriptContent;
	document.documentElement.prepend(scriptElement);
}


let sent = false
window.addEventListener("message", (event) => {
	console.log(`🧩 [T=${+Date.now()}] [content-scripts/start] received message:`, event);

	if(!sent) {
		sent = true
		window.postMessage({
           message: "Message from content-scripts/start"
       }, "*");
	}
});


// experiment modifying js env
window.foo = window.foo || 'content-scripts/start v1'
try {
	// local files may not have local storage
	localStorage.setItem('foo', 'content-scripts/start v1')
}
catch {}



const port = chrome.runtime.connect({name:"port-from-content-script"});
port.postMessage({greeting: "hello from content script"});

port.onMessage.addListener(function(m) {
	console.log("In content script, received message from background script: ");
	console.log(m);
});

runInPageContext(install_in_context)

function install_in_context() {
	// experiment modifying js env
	window.foo = window.foo || 'content-scripts/start v1 in context'


	console.log(`🧩 [T=${+Date.now()}] Hello from hello-world-browser-extension (content-scripts/start) IN PAGE CONTEXT`, {
		foo_js: window.foo,
		foo_ls: (() => {
			try {
				// local files may not have local storage
				return localStorage.getItem('foo')
			}
			catch {}
		})(),
	})

	window.addEventListener("message", (event) => {
		console.log(`🧩 [T=${+Date.now()}] [content-scripts/start/IN CONTEXT] received message:`, event);
	});


	// experimenting communicating with the extension
	console.log(`🧩 [T=${+Date.now()}] [content-scripts/start/IN CONTEXT] sending message...`);
	window.postMessage({
		message: "Message from the page context"
	}, "*");
}
