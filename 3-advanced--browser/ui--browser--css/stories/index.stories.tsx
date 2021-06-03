import { useState, useEffect } from "react"
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

import { default_viewport__mobile } from '../../../0-meta/storybook-viewports'

import './index.css'

const LIB = '@offirmo-private/ui--browser--css'

////////////////////////////////////////////////////////////////////////////////////

export default {
	title: LIB,
	//component: Component,
	argTypes: {
		//backgroundColor: { control: 'color' },
	},
} as Meta

////////////////////////////////////////////////////////////////////////////////////

export function Default() {
	return (
		<main>
			<h1>{ LIB }</h1>
			<h2>a CSS micro framework</h2>

			<p>
				What I’m saying is that it’s so, so simple to make sites easier to read. Websites are broken by default,
				they are
				functional, high-performing, and accessible, but they’re also fucking ugly. You and all the other web
				designers out
				there need to make them not total shit.
			</p>

			<p>
				<strong>emphasized text</strong>{' '}
				Normal text{' '}
				<span className="o⋄color⁚secondary">secondary text</span>{' '}
				<span className="o⋄color⁚ancillary">ancillary text</span>{' '}
				<a href=".">link</a>{' '}
			</p>

			<p>Strongly inspired by:</p>
			<ol>
				<li><a href="https://motherfuckingwebsite.com/">motherfuckingwebsite.com</a>,</li>
				<li><a href="https://bettermotherfuckingwebsite.com/">bettermotherfuckingwebsite.com</a>,</li>
				<li><a href="https://perfectmotherfuckingwebsite.com/">perfectmotherfuckingwebsite.com</a></li>
				<li>and many blogs posts…</li>
			</ol>
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Normalization() {
	return (
		<>
			<div>
				<h1>The five boxing wizards jump quickly</h1>
				<h2>Sphinx of black quartz, judge my vow!</h2>
				<h3>Pack my box with five dozen liquor jugs!</h3>
				<p>
					{ LIB } provides CSS reset/normalization through
					{' '}
					<a href="https://necolas.github.io/normalize.css/">normalize.css</a>
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at varius eros. Curabitur pulvinar metus diam, nec aliquet felis pellentesque et. Ut iaculis aliquam augue, sed vestibulum lacus varius at. Mauris et facilisis massa. Sed vehicula placerat convallis. Sed dui magna, semper non neque non, semper dapibus lacus.
				</p>
				<ul>
					<li>Foo</li>
					<li>Bar</li>
				</ul>
				<ol>
					<li>Foo</li>
					<li>Bar</li>
				</ol>

				<details>
					<summary>Details: expand me...</summary>
					<p>Hello, world!</p>
				</details>

				<dl><dt>Term</dt><dd>Definition.</dd></dl>

				<figure>
					<img alt="a cute kitty" src='https://placekitten.com/200/300'/>
					<figcaption>A figure caption!</figcaption>
				</figure>

				<q>Quoted text</q> <cite>— Author Name</cite>
			</div>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Semantic() {
	return (
		<div className="o⋄font⁚fast-and-good-enough o⋄flow">
			<header>
				<nav>
					<ul className="o⋄nav-list">
						<li className="o⋄text-noselect o⋄color⁚secondary"><a href=".">Home</a></li>
						<li className="o⋄text-noselect o⋄color⁚secondary"><a href=".">Nav1</a></li>
						<li className="o⋄text-noselect o⋄color⁚secondary"><a href=".">Nav2</a></li>
					</ul>
				</nav>
			</header>

			<hr className="o⋄border-color⁚ancillary"/>

			<main>
				<article>
					<h1>The five boxing wizards jump quickly</h1>
					Posted <time datetime="2017-01-01">1y ago</time>.
					<figure>
						<img alt="a cute kitty" src='https://placekitten.com/200/300'/>
						<figcaption>A figure caption!</figcaption>
					</figure>
					<h2>Sphinx of black quartz, judge my vow!</h2>
					<h3>Pack my box with five dozen liquor jugs!</h3>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id augue ante. Aliquam tristique viverra tellus sed ullamcorper. Vivamus velit ipsum, tempus et sapien sit amet, luctus ultricies est. Phasellus ac ipsum vulputate, volutpat libero non, dictum ligula. Cras tincidunt justo urna, nec consequat lectus luctus vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec lacinia sed nisi nec viverra.
					</p>
					<p>
						Maecenas in laoreet est. Morbi blandit enim magna, a semper orci facilisis quis. In vehicula sagittis turpis vel eleifend. Nullam aliquet feugiat cursus. Mauris orci purus, pellentesque vitae interdum eu, blandit sed ligula. Cras eu mattis quam, vel ornare ante. Duis molestie eros dui, at varius odio viverra in. In rhoncus, ante eget fermentum eleifend, massa eros tincidunt purus, quis maximus sapien odio ut enim. Suspendisse ex purus, aliquet sed velit porta, tempus sodales lorem.
					</p>
					<h3>Pack my box with five dozen liquor jugs!</h3>
					<p>
						Pellentesque gravida tincidunt risus sit amet varius. Cras ac luctus mauris. Aliquam erat volutpat. In hac habitasse platea dictumst. Aliquam metus sapien, suscipit vel dapibus a, convallis nec lorem. Suspendisse ac rhoncus urna, nec ornare metus. Sed at porttitor nisl. Curabitur vestibulum tempus mattis.
					</p>
					<ul>
						<li>Foo</li>
						<li>Bar</li>
					</ul>
					<p>
						Nullam euismod massa neque, vitae sollicitudin diam tincidunt non. Phasellus interdum felis congue, semper libero et, efficitur mauris. Aenean velit leo, egestas dignissim enim ut, tincidunt facilisis velit. Aliquam orci augue, facilisis nec mauris quis, finibus sagittis quam. Morbi orci libero, consequat in placerat sit amet, dignissim at elit. Curabitur lobortis neque vel aliquet ultrices. Mauris efficitur auctor pulvinar. In finibus nunc quis nisl interdum fermentum sit amet at odio. Suspendisse vitae lorem vulputate, eleifend nunc nec, scelerisque enim. Aliquam vulputate venenatis porttitor. In hac habitasse platea dictumst.
					</p>
					<ol>
						<li>Foo</li>
						<li>Bar</li>
					</ol>
					<p>
						Vestibulum varius nisl a ante vehicula, eu euismod justo ornare. Praesent purus velit, finibus at varius sed, malesuada et orci. Integer vel accumsan enim, sit amet elementum lorem. Fusce tincidunt urna vitae ligula vehicula, consectetur sagittis orci bibendum. Praesent quis velit in massa aliquam commodo in ut elit. Nulla viverra lectus in nibh semper, id ultricies est vehicula. Phasellus fermentum eget augue vitae consequat. Praesent bibendum fringilla ullamcorper. Praesent luctus ultrices enim, dapibus pretium tortor hendrerit vel. Fusce ultrices, risus vitae iaculis vehicula, ipsum dui tincidunt lacus, eu volutpat nibh magna vitae nisi. Aliquam quis nibh in erat faucibus cursus sit amet nec nisi. Sed bibendum diam ut eros pharetra tempus.
					</p>
					<q>[Quoted text] Vestibulum varius nisl a ante vehicula, eu euismod justo ornare. Praesent purus velit, finibus at varius sed, malesuada et orci.</q> <cite>— Author Name</cite>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas at varius eros. Curabitur pulvinar metus diam, nec aliquet felis pellentesque et. Ut iaculis aliquam augue, sed vestibulum lacus varius at. Mauris et facilisis massa. Sed vehicula placerat convallis. Sed dui magna, semper non neque non, semper dapibus lacus.
					</p>
				</article>
				<aside>
					[aside]
				</aside>
			</main>

			<hr className="o⋄border-color⁚ancillary"/>

			<footer>
				bla bla copyright links
				<nav>
					<ul className="o⋄nav-list o⋄flex--centered-content">
						<li className="o⋄text-noselect o⋄color⁚secondary"><a href="./try">Try all products</a></li>
						<li className="o⋄text-noselect o⋄color⁚secondary"><a href="./privacy-policy">Privacy policy</a></li>
						<li className="o⋄text-noselect o⋄color⁚secondary"><a href="./customer-agreement">Terms of service</a>
						</li>
					</ul>
				</nav>
			</footer>
		</div>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Fonts() {
	// https://en.wikipedia.org/wiki/Pangram
	const pangram = 'The five boxing wizards jump quickly -> Sphinx of black quartz, judge my vow! Pack my box with five dozen liquor jugs…'

	return (
		<>
			<p className="o⋄font⁚fast-and-good-enough">
				Featuring the "fast and good enough" font-family (.o⋄font⁚fast-and-good-enough)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="o⋄font⁚system">
				Featuring the "system" font-family (.o⋄font⁚system)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="o⋄font⁚roboto">
				Featuring the nice and precise "roboto" font-family (.o⋄font⁚roboto)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="o⋄font⁚roboto-condensed">
				Featuring the nice and precise "roboto condensed" font-family (.o⋄font⁚roboto-condensed)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="o⋄font⁚roboto-mono">
				Featuring the code wise "roboto mono" font-family (.o⋄font⁚roboto-mono)
				<br/>{ pangram }
			</p>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Emojis() {
	return (
		<main>
			<p>emoji 13.1
				https://emojipedia.org/emoji-13.1/

				😮‍💨 Face Exhaling
				😵‍💫 Face with Spiral Eyes
				😶‍🌫️ Face in Clouds
				❤️‍🔥 Heart on Fire
				❤️‍🩹 Mending Heart
				🧔‍♀️ Woman: Beard
				🧔🏻‍♀️ Woman: Light Skin Tone, Beard
				🧔🏼‍♀️ Woman: Medium-Light Skin Tone, Beard
				🧔🏽‍♀️ Woman: Medium Skin Tone, Beard
				🧔🏾‍♀️ Woman: Medium-Dark Skin Tone, Beard
				🧔🏿‍♀️ Woman: Dark Skin Tone, Beard
				🧔‍♂️ Man: Beard
				🧔🏻‍♂️ Man: Light Skin Tone, Beard
				🧔🏼‍♂️ Man: Medium-Light Skin Tone, Beard
				🧔🏽‍♂️ Man: Medium Skin Tone, Beard
				🧔🏾‍♂️ Man: Medium-Dark Skin Tone, Beard
				🧔🏿‍♂️ Man: Dark Skin Tone, Beard
			</p>
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

function ColorsAsCSSVariablesTable({radixes, caption}: { radixes: string[], caption: string }) {
	console.log({
		radixes,
		caption,
	})
	return (
		<table style={ {border: '1px solid var(--o⋄color⁚fg--main)'} }>
			<caption>{ caption }</caption>
			<thead>
			<tr>
				<th>CSS variable</th>
				<th>name</th>
				<th>foreground</th>
				<th>background</th>
			</tr>
			</thead>
			<tbody>
			{ radixes.map(radix => {
				const css_var = `--o⋄color⁚` + radix
				return (
					<tr key={ radix }>
						<td className="o⋄font⁚roboto-mono">{ css_var }</td>
						<td>{ radix }</td>
						{
							radix.startsWith('bg--')
								? <td className="o⋄text-alignꘌcenter">-</td>
								: <td style={ {color: `var(${ css_var })`} }>as foreground</td>
						}
						{
							radix.startsWith('fg--')
								? <td className="o⋄text-alignꘌcenter">-</td>
								: <td style={ {backgroundColor: `var(${ css_var })`} }>as background</td>
						}
					</tr>
				)
			}) }
			</tbody>
		</table>
	)
}

export function Colors() {

	const SEMANTIC_COLORS_VARS_RADIX = [
		'fg--main',
		'fg--secondary',
		'fg--ancillary',

		'fg--error',
		'fg--warning',
		'fg--info',
		'fg--success',

		'bg--main',
		'bg--main--backdrop',
		'bg--highlight--1',
		'bg--highlight--2',

		'fg--accent',
	]

	const BASE_COLORS_VARS_RADIX = [
		'transparent',
		'darker--10',
		'darker--20',
		'darker--90',
		'lighter--10',
		'lighter--20',
		'lighter--90',
		'boz__gray',
		'boz__yellow',
		'boz__pink',
		'boz__green',
		'boz__cyan',
		'boz__blue',
		'boz__purple',
		'co212__beige',
		'co212__blue',
		'co212__brown',
		'co212__dark',
	]

	return (
		<>

			<ColorsAsCSSVariablesTable
				radixes={ SEMANTIC_COLORS_VARS_RADIX }
				caption={ 'Semantic colors from CSS variables' }
			/>

			<hr/>

			<ColorsAsCSSVariablesTable
				radixes={ BASE_COLORS_VARS_RADIX }
				caption={ 'Base colors from CSS variables = building blocks (do NOT use directly!)' }
			/>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Controls() {
	return (
		<>
			<p>
				…some text… <a href="https://bettermotherfuckingwebsite.com/">link</a> …some text… <button>Click me!</button> …some text… <progress value=".5">progress</progress> …some text…
			</p>

			<p>
				What I’m saying is that it’s so, <button className="o⋄button--inline">so simple to make
				sites</button> easier to read...
			</p>

			Nicer scrollbars by default
			<div className="o⋄border⁚default" style={{
				height: '200px',
				overflowY: 'scroll',
			}}>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
			</div>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Advanced() {
	return (
		<>
			<ul>
				<li><span className="o⋄character-as-icon">🗡</span> character as icon <span className="o⋄character-as-icon">🛡 👕 🍽 🍴 🥄 🔪 🗡 ⚔ 🏹 🔧 🔨 ⛏ ⚒ 🛠</span></li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚45deg">🗡</span> rotated 45°</li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚90deg">🗡</span> rotated 90°</li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚180deg">🗡</span> rotated 180°</li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚270deg">🗡</span> rotated 270°</li>
			</ul>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Containers() {
	return (
		<>
			<p>
				<code>o⋄top-container</code> = very convenient container to propagate full height (flexbox column)
			</p>
			<p>
				<code>o⋄centered-article</code> = max width + auto-centered
			</p>
			<p>
				<code>o⋄body⁚full-viewport</code> = try to force the body to take the full viewport
			</p>

			<div className='o⋄box'>
				This is a box
			</div>

			<div style={{
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundImage: `url(https://placekitten.com/1024/512)`,
				padding: '5px',
				margin: '5px 0',
			}}>
				<p className="o⋄bg-colorꘌbackdrop">
					Text on a backdrop <code>o⋄bg-colorꘌbackdrop</code>
				</p>
			</div>

			<hr />

			Default border <code>o⋄border⁚default</code> + y-scroll <code>o⋄overflow-y⁚auto</code>
			<div className="o⋄border⁚default o⋄overflow-y⁚auto" style={{height: '100px'}}>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
				<p>Hi</p>
			</div>

			<p>
				img with 100% width: <code>o⋄width⁚100pc</code>
				<img alt="cute kitten" className="o⋄width⁚100pc" src="https://placekitten.com/1024/512" />
			</p>

			<hr />

			<div className="o⋄error-report">
				A sample error report
				<pre>[Intervention] Slow network is detected. See https://www.chromestatus.com/feature/5636954674692096 for more details. Fallback font will be used while loading: https://fonts.gstatic.com/stats/Merriweather/normal/900
				</pre>
			</div>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function AppDemo() {
	return (
		<div className="o⋄top-container">

			<header className="o⋄border⁚default">
				[header]
			</header>

			<main className="o⋄overflow-y⁚auto">

				<p>
					Ai! laurië lantar lassi súrinen,
					yéni únótimë ve rámar aldaron!
					Yéni ve lintë yuldar avánier
					mi oromardi lissë-miruvóreva
					Andúnë pella, Vardo tellumar
					nu luini yassen tintilar i eleni
					ómaryo airetári-lírinen.
				</p>

				<p>
					Sí man i yulma nin enquantuva?
				</p>

				<p className="o⋄bg-colorꘌbackdrop">
					An sí Tintallë Varda Oiolossëo
					ve fanyar máryat Elentári ortanë
					ar ilyë tier undulávë lumbulë
					ar sindanóriello caita mornië
					i falmalinnar imbë met,
					ar hísië untúpa Calaciryo míri oialë.
					Sí vanwa ná, Rómello vanwa, Valimar!
					Namárië! Nai hiruvalyë Valimar!
					Nai elyë hiruva! Namárië!
				</p>

				<p>
					Ai! laurië lantar lassi súrinen,
					yéni únótimë ve rámar aldaron!
					Yéni ve lintë yuldar avánier
					mi oromardi lissë-miruvóreva
					Andúnë pella, Vardo tellumar
					nu luini yassen tintilar i eleni
					ómaryo airetári-lírinen.
				</p>

				<p>
					Sí man i yulma nin enquantuva?
				</p>

				<p>
					An sí Tintallë Varda Oiolossëo
					ve fanyar máryat Elentári ortanë
					ar ilyë tier undulávë lumbulë
					ar sindanóriello caita mornië
					i falmalinnar imbë met,
					ar hísië untúpa Calaciryo míri oialë.
					Sí vanwa ná, Rómello vanwa, Valimar!
					Namárië! Nai hiruvalyë Valimar!
					Nai elyë hiruva! Namárië!
				</p>

				<p>
					Ai! laurië lantar lassi súrinen,
					yéni únótimë ve rámar aldaron!
					Yéni ve lintë yuldar avánier
					mi oromardi lissë-miruvóreva
					Andúnë pella, Vardo tellumar
					nu luini yassen tintilar i eleni
					ómaryo airetári-lírinen.
				</p>

				<p>
					Sí man i yulma nin enquantuva?
				</p>

				<p>
					An sí Tintallë Varda Oiolossëo
					ve fanyar máryat Elentári ortanë
					ar ilyë tier undulávë lumbulë
					ar sindanóriello caita mornië
					i falmalinnar imbë met,
					ar hísië untúpa Calaciryo míri oialë.
					Sí vanwa ná, Rómello vanwa, Valimar!
					Namárië! Nai hiruvalyë Valimar!
					Nai elyë hiruva! Namárië!
				</p>

				<p>
					Ai! laurië lantar lassi súrinen,
					yéni únótimë ve rámar aldaron!
					Yéni ve lintë yuldar avánier
					mi oromardi lissë-miruvóreva
					Andúnë pella, Vardo tellumar
					nu luini yassen tintilar i eleni
					ómaryo airetári-lírinen.
				</p>

				<p>
					Sí man i yulma nin enquantuva?
				</p>

				<p>
					An sí Tintallë Varda Oiolossëo
					ve fanyar máryat Elentári ortanë
					ar ilyë tier undulávë lumbulë
					ar sindanóriello caita mornië
					i falmalinnar imbë met,
					ar hísië untúpa Calaciryo míri oialë.
					Sí vanwa ná, Rómello vanwa, Valimar!
					Namárië! Nai hiruvalyë Valimar!
					Nai elyë hiruva! Namárië!
				</p>
			</main>

			<footer className="o⋄text-alignꘌcenter o⋄border⁚default">
				<nav className="o⋄bg-colorꘌbackdrop toolbar">
					<ul className="o⋄nav-list o⋄flex--centered-content">
						<li className="o⋄text-noselect"><a href="."><span className="emoji-as-icon">🗺</span></a></li>
						<li className="o⋄text-noselect"><a href="."><span className="emoji-as-icon">⚔️💰</span></a></li>
						<li className="o⋄text-noselect"><a href="."><span className="emoji-as-icon">👤</span></a></li>
						<li className="o⋄text-noselect"><a href="."><span className="emoji-as-icon">🏆</span></a></li>
						<li className="o⋄text-noselect"><a href="."><span className="emoji-as-icon">💬</span></a></li>
						<li className="o⋄text-noselect"><a href="."><span className="emoji-as-icon">⚙️</span></a></li>
					</ul>
				</nav>
			</footer>

		</div>
	)
}
AppDemo.parameters = {
	viewport: {
		defaultViewport: default_viewport__mobile,
	},
}

////////////////////////////////////////////////////////////////////////////////////

export function Diagnostics() {
	return (
		<>
			<h2>Empties</h2>
			<ol>
				<li>empty line item, comment-only line item, and space-only line item follow:</li>
				<li></li>
				<li>{/* can't HTML comment from JSX*/}</li>
				<li> </li>
				<li>empty span [ <span></span> ], and a break [ <br/> ]</li>
				<li>empty div follows: [<div></div>]</li>
				<li>see also first cell of following table</li>
			</ol>


			<h2>Images</h2>

			<table summary="Testing image attribute based diagnostic styling" id="imgtest">
				<thead>
				<tr>
					<th></th>
					<th scope="col">no alt</th>
					<th scope="col">empty alt</th>
					<th scope="col">filled alt</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<th scope="row">no title</th>
					<td><img src="https://placekitten.com/64/64" /></td>
					<td><img src="https://placekitten.com/64/64" alt="" /></td>
					<td><img src="https://placekitten.com/64/64" alt="blah" /></td>
				</tr>
				<tr>
					<th scope="row">empty title</th>
					<td><img src="https://placekitten.com/64/64" title="" /></td>
					<td><img src="https://placekitten.com/64/64" title="" alt="" /></td>
					<td><img src="https://placekitten.com/64/64" title="" alt="blah" /></td>
				</tr>
				<tr>
					<th scope="row">filled title</th>
					<td><img src="https://placekitten.com/64/64" title="blah" /></td>
					<td><img src="https://placekitten.com/64/64" title="blah" alt="" /></td>
					<td><img src="https://placekitten.com/64/64" title="blah" alt="blah" /></td>
				</tr>
				</tbody>
			</table>


			<h2>Tables</h2>

			<table>
				<tr>
					<th>A</th>
					<th>B</th>
				</tr>
				<tr>
					<th>C</th>
					<td>1</td>
				</tr>
			</table>

			<table>
				<tr>
					<th scope>A</th>
					<th scope="">B</th>
				</tr>
				<tr>
					<th scope="diag">C</th>
					<td>1</td>
				</tr>
			</table>

			<table summary="">
				<tr>
					<th scope="col">A</th>
					<th scope="col">B</th>
				</tr>
				<tr>
					<th scope="row">C</th>
					<td>1</td>
				</tr>
			</table>


			<h2>Links</h2>

			<ol>
				<li><a href="none">fillblah</a> (no title, filled href)</li>
				<li><a href="none" title="">fillblah</a> (empty title, filled href)</li>
				<li><a href="none" title="blah">fillblah</a> (filled title, filled href)</li>
				<li><a href="#">blah#</a> (no title, '#' href)</li>
				<li><a href="#" title="">blah#</a> (empty title, '#' href)</li>
				<li><a href="#" title="blah">blah#</a> (filled title, '#' href)</li>
				<li><a href="">blah</a> (no title, blank href)</li>
				<li><a href="" title="">blah</a> (empty title, blank href)</li>
				<li><a href="" title="blah">blah</a> (filled title, blank href)</li>
			</ol>

			<hr />
			<img src='http://placekitten.com/200/300'/>
			<a href='http://placekitten.com/'>a nice site in HTTP</a>
			<iframe src='http://placekitten.com/'/>
			<a href="#">Home</a>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Debug() {
	const Wrapper = styled.div`
	border-width: 1px;
`
	return (
		<Wrapper className="o⋄top-container">
			<h1>{ LIB } - CSS micro framework</h1>

			<p>
				What I’m saying is that it’s so, so simple to make sites easier to read. Websites are broken by default,
				they are
				functional, high-performing, and accessible, but they’re also fucking ugly. You and all the other web
				designers out
				there need to make them not total shit.
			</p>

			<p>
				<strong>emphasized text</strong> &nbsp;
				Normal text &nbsp;
				<span className="o⋄color⁚secondary">secondary text</span> &nbsp;
				<span className="o⋄color⁚ancillary">ancillary text</span> &nbsp;
				<a href=".">link</a>
			</p>

			<p>Strongly inspired by:</p>
			<ol>
				<li><a href="https://motherfuckingwebsite.com/">motherfuckingwebsite.com</a>,</li>
				<li><a href="https://bettermotherfuckingwebsite.com/">bettermotherfuckingwebsite.com</a>,</li>
				<li><a href="https://perfectmotherfuckingwebsite.com/">perfectmotherfuckingwebsite.com</a></li>
				<li>and many blogs posts…</li>
			</ol>
		</Wrapper>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Experimental() {
	return (
		<>
			<p className="o⋄glass">
				<code>o⋄glass</code>
			</p>
			<p>
				<code>o⋄outline</code>
				<span className="o⋄outline">Test</span>
			</p>
			<p>
				<code>o⋄visually-hidden</code>
				<span className="o⋄visually-hidden">can't see me</span>
			</p>
		</>
	)
}

////////////////////////////////////////////////////////////////////////////////////

// https://usehooks.com/useWindowSize/
function useWindowSize() {
	// Initialize state with undefined width/height so server and client renders match
	// Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	useEffect(() => {
		// Handler to call on window resize
		function handleResize() {
			// Set window width/height to state
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		// Add event listener
		window.addEventListener("resize", handleResize); // TODO debounce

		// Call handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, []); // Empty array ensures that effect is only run on mount

	return windowSize;
}

import iphone12mini_bg_url from './assets/iphone12_375x812_mini.png'
import iphone12pro_bg_url from './assets/iphone12_390x844_pro.png'
import iphone12promax_bg_url from './assets/iphone12_428x926_promax.png'

function Notches({ children }) {
	const { width: viewport_width, height: viewport_height } = useWindowSize()
	const display_mode: 'portrait' | 'landscape' = viewport_width < viewport_height
		? 'portrait'
		: 'landscape'

	const [ viewport_pwidth, viewport_pheight ] = [ viewport_width, viewport_height ].sort()
	const iphone12mini = {
		p_w: 375,
		p_h: 812,
		corner_w: 75, // 46
		home_indicator_w: 134,
		bg_url: iphone12mini_bg_url,
		inset: {
			notch: 50,
			home_indicator: {
				portrait: 34,
				landscape: 21,
			},
		},
	}
	const iphone12pro = {
		p_w: 390,
		p_h: 844,
		corner_w: 82,
		home_indicator_w: 139,
		bg_url: iphone12pro_bg_url,
		inset: {
			notch: 47,
			home_indicator: {
				portrait: 34,
				landscape: 21,
			},
		},
	}
	const iphone12promax = {
		p_w: 428,
		p_h: 926,
		corner_w: 90, // 55
		home_indicator_w: 153,
		bg_url: iphone12promax_bg_url,
		inset: {
			notch: 47,
			home_indicator: {
				portrait: 34,
				landscape: 21,
			},
		},
	}

	const { corner_w, home_indicator_w, bg_url, inset } = (() => {
		function distance(aw, ah, bw, bh) {
			const diag_a = Math.sqrt(aw * aw + ah * ah)
			const diag_b = Math.sqrt(bw * bw + bh * bh)
			return Math.abs(diag_a - diag_b)
		}

		let closest = [iphone12mini, iphone12pro, iphone12promax]
			.reduce((acc, val) => {
				const existing_diff = distance(viewport_width, viewport_height, acc.p_w, acc.p_h)
				const candidate_diff = distance(viewport_width, viewport_height, val.p_w, val.p_h)

				if (candidate_diff < existing_diff)
					return val
				return acc
			}, iphone12pro)

		return closest
	})()
	const corner_bezier = corner_w / 18. * 11.

	console.log({
		display_mode,
		viewport_width, viewport_height,
		viewport_pwidth, viewport_pheight,
		corner_w,
		home_indicator_w,
		bg_url,
		inset,
	})

	document.documentElement.style.setProperty('--safe-area-inset-top', `${display_mode === 'portrait' ? inset.notch : 0}px`)
	document.documentElement.style.setProperty('--safe-area-inset-right', `${display_mode === 'landscape' ? inset.notch : 0}px`)
	document.documentElement.style.setProperty('--safe-area-inset-bottom', `${inset.home_indicator[display_mode]}px`)
	document.documentElement.style.setProperty('--safe-area-inset-left', `${display_mode === 'landscape' ? inset.notch : 0}px`)

	const corner_path = `M 0,0 C 0,0 0,${corner_w + corner_bezier} 0,${corner_w} 0,${corner_w-corner_bezier} ${corner_w-corner_bezier},0 ${corner_w},0 ${corner_w + corner_bezier},0 0,0 0,0 Z`
	const corner_viewbox = `0 0 ${corner_w + corner_bezier} ${corner_w + corner_bezier}`

	return (
		<div className="o⋄top-container">
			<div className="o⋄top-container o⋄bg⁚cover" style={{backgroundImage: `url(x` + bg_url + ')' }}>
				{children}
			</div>

			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--top-left" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╭</path>
			</svg>
			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--top-right" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╮</path>
			</svg>
			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--bottom-right" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╯</path>
			</svg>
			<svg className="o⋄mobile-design-helper o⋄mobile-design-helper--corner--bottom-left" xmlns="http://www.w3.org/2000/svg" width={corner_w} height={corner_w} viewBox={corner_viewbox}>
				<path className="o⋄mobile-design-helper--svg-shape" d={corner_path} >╰</path>
			</svg>

			<div className={`o⋄mobile-design-helper o⋄mobile-design-helper--notch o⋄mobile-design-helper--notch--${display_mode}`}>N</div>
			<div className="o⋄mobile-design-helper o⋄mobile-design-helper--home-indicator" style={{width: home_indicator_w}}>--</div>

		</div>
	)
}


export function SVGTest() {
	return <div className="o⋄top-container" style={{
		backgroundColor: 'red',
		paddingTop: 'var(--safe-area-inset-top)',
		paddingRight: 'var(--safe-area-inset-right)',
		paddingBottom: 'var(--safe-area-inset-bottom)',
		paddingLeft: 'var(--safe-area-inset-left)',
	}}>
		<div className="o⋄top-container" style={{
			backgroundColor: 'yellow',
		}}>
			Content
		</div>
	</div>
}
SVGTest.parameters = {
	viewport: {
		defaultViewport: 'iphone12promax',
	},
}
SVGTest.decorators = [
	(Story) => (
		<Notches>
			{Story()}
		</Notches>
	),
]
