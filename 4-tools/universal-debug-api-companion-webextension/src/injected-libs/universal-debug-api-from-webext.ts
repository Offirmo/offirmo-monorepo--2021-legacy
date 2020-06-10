// by contract, injected in order = #1
// reminder that this code is by design
// the 1st and foremost execution of the universal-debug-api-browser
// There is NO possible way a user's version could have been installed previously.
import '@offirmo/universal-debug-api-browser'
(window as any)._debug.v1._.source = 'browser-ext'
