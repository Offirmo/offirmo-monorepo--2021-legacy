import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

import './index.css'

const LIB = '@oh-my-rpg/ui--browser--css'

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
		<main className="omr⋄font⁚spectral">
			<h1>{ LIB }</h1>
			<h2>a CSS micro framework for RPGs</h2>

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
				<strong>emphasized text</strong>{' '}
				Normal text{' '}
				<span className="o⋄color⁚secondary">secondary text</span>{' '}
				<span className="o⋄color⁚ancillary">ancillary text</span>{' '}
				<a href=".">link</a>
			</p>

		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function FontEffects() {
	return (
		<main className="omr⋄font⁚spectral">

			<p className="omr⋄text-with-shadow">
				Text with shadow.
			</p>

			<p className="omr⋄text⁚glowing--gold">
				Text glowing gold.
			</p>

			<p className="omr⋄text⁚outlined">
				Text outlined.
			</p>

		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Normalization() {
	return (
		<>
			<div className="o⋄flow">
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
			<hr/>

			<p className="omr⋄font⁚spectral">
				Featuring the elegant "Spectral" font-family (.omr⋄font⁚spectral)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="omr⋄font⁚pixantiqua">
				Featuring the playful "PixAntiqua" font-family (.omr⋄font⁚pixantiqua)
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
								? <td className="o⋄text-align⁚center">-</td>
								: <td style={ {color: `var(${ css_var })`} }>as foreground</td>
						}
						{
							radix.startsWith('fg--')
								? <td className="o⋄text-align⁚center">-</td>
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
		'dolt__quasi-black',
		'dolt__dark-grey',
		'dolt__medium-grey',
		'dolt__quasi-white',
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

			Scrollbar
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
			<nav>
				<ul className="o⋄nav-list">
					<li className="o⋄text-noselect o⋄color⁚secondary"><a href=".">Home</a></li>
					<li className="o⋄text-noselect o⋄color⁚secondary"><a href=".">Nav1</a></li>
					<li className="o⋄text-noselect o⋄color⁚secondary"><a href=".">Nav2</a></li>
				</ul>
			</nav>

			<hr />

			<div className='o⋄box'>
				This is a box
			</div>

			<hr />
			<ul>
				<li><span className="o⋄character-as-icon">🗡</span> character as icon <span className="o⋄character-as-icon">🛡 👕 🍽 🍴 🥄 🔪 🗡 ⚔ 🏹 🔧 🔨 ⛏ ⚒ 🛠</span></li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚45deg">🗡</span> rotated 45°</li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚90deg">🗡</span> rotated 90°</li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚180deg">🗡</span> rotated 180°</li>
				<li><span className="o⋄character-as-icon o⋄rotated⁚270deg">🗡</span> rotated 270°</li>
			</ul>

			Footer:
			<hr />
			<nav>
				<ul className="o⋄nav-list o⋄flex--centered-content">
					<li className="o⋄text-noselect o⋄color⁚secondary"><a href="./try">Try all products</a></li>
					<li className="o⋄text-noselect o⋄color⁚secondary"><a href="./privacy-policy">Privacy policy</a></li>
					<li className="o⋄text-noselect o⋄color⁚secondary"><a href="./customer-agreement">Terms of service</a>
					</li>
				</ul>
			</nav>
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

			<hr/>

			<div className='o⋄box'>
				This is a box
			</div>

			<hr />

			<div className="o⋄error-report">
				A sample error report
				<pre>[Intervention] Slow network is detected. See https://www.chromestatus.com/feature/5636954674692096 for more details. Fallback font will be used while loading: https://fonts.gstatic.com/stats/Merriweather/normal/900
				</pre>
			</div>

			<hr />

			Default border: <code>o⋄border⁚default</code>
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

