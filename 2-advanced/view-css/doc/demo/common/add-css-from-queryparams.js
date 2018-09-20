import style_once from '//localhost:1981/0-stdlib/style-once/index.js'

console.log('iframed loading with:', {search: window.location.search})

const searchParams = new URLSearchParams(window.location.search)

const style = searchParams.get('style_select')

if (style.startsWith('base'))
	style_once({ id: 'style', href: '//localhost:1981/2-advanced/view-css/src/style.css' })
if (style.startsWith('omr'))
	style_once({ id: 'style', href: '//localhost:1981/9-oh-my-rpg/view-browser/src/style.css' })

if (style.endsWith('lod'))
	document.body.dataset.oTheme = 'light-on-dark'
if (style.endsWith('lod--c212'))
	document.body.dataset.oTheme = 'lod--colorhunt212'
