import style_once from '//localhost:1981/1-stdlib/style-once/index.js'

console.log('iframed loading with:', {search: window.location.search})

const searchParams = new URLSearchParams(window.location.search)

const style = searchParams.get('style_select')

if (style.startsWith('base'))
	style_once({ id: 'style', href: '//localhost:1981/3-advanced--browser/ui--browser--css/src/style.css' })
if (style.startsWith('omr'))
	style_once({ id: 'style', href: '//localhost:1981/9-oh-my-rpg/view-browser/src/style.css' })

if (style.endsWith('lod'))
	document.body.dataset.oTheme = 'dark--default'
if (style.endsWith('lod--c212'))
	document.body.dataset.oTheme = 'dark--colorhunt212'

const bg = searchParams.get('bg_select')

if (bg === 'gnomon')
	style_once({ id: 'bg', css: `
body {
	background-size: cover;
	background-image: url(//localhost:1981/9-oh-my-rpg/rsrc-backgrounds/src/rsrc/license-pending/Raphael_Lacoste/gnomon-raphael_lacoste.jpg);
	background-position: 32% 50%;
}

.test-container {
	background-color: var(--o⋄color⁚bg--main--backdrop);
}
` })
