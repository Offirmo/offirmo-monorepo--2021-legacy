import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

import { default_viewport__mobile } from '../../../0-meta/storybook-viewports'

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
		<main className="omr⋄font⁚spectral o⋄centered-article">
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

import DemoBgForestGreen from '@oh-my-rpg/assets--background--artbreeder/src/assets/biome--terrestrial--forest--green/2fd369e60d1911ab963d1636868c.jpeg'
// 			<img alt="green forest" className="xxo⋄width⁚100pc" src={DemoBgForestGreen} />
export function FontEffectsTODO() {
	return (
		<main className="o⋄top-container omr⋄font⁚spectral o⋄centered-article">

			<h1>TODO one day</h1>

			<p className="omr⋄text-with-shadow">
				Text with shadow.
			</p>

			<p className="omr⋄text⁚glowing--gold">
				Text glowing gold.
			</p>

			<p className="omr⋄text⁚outlined">
				Text outlined.
			</p>

			<div className="omr⋄bg⁚cover" style={{backgroundImage: `url(` + DemoBgForestGreen + ')' }}>
				<p className="omr⋄text-with-shadow">
					Text with shadow.
				</p>

				<p className="omr⋄text⁚glowing--gold">
					Text glowing gold.
				</p>

				<p className="omr⋄text⁚outlined">
					Text outlined.
				</p>
			</div>

		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Fonts() {
	// https://en.wikipedia.org/wiki/Pangram
	const pangram = 'The five boxing wizards jump quickly -> Sphinx of black quartz, judge my vow! Pack my box with five dozen liquor jugs…'

	return (
		<main className="o⋄centered-article">

			<p className="omr⋄font⁚spectral">
				Featuring the elegant "Spectral" font-family (<code>.omr⋄font⁚spectral</code>)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="omr⋄font⁚pixantiqua">
				Featuring the playful "PixAntiqua" font-family (<code>.omr⋄font⁚pixantiqua</code>)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="o⋄font⁚roboto">
				Featuring the nice and precise "roboto" font-family (<code>.o⋄font⁚roboto</code>)
				<br/>{ pangram }
			</p>
			<hr/>

			<p className="o⋄font⁚roboto-condensed">
				Featuring the nice and precise "roboto condensed" font-family (<code>.o⋄font⁚roboto-condensed</code>)
				<br/>{ pangram }
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
		<main className="o⋄centered-article">

			<ColorsAsCSSVariablesTable
				radixes={ SEMANTIC_COLORS_VARS_RADIX }
				caption={ 'Semantic colors from CSS variables' }
			/>

			<hr/>

			<ColorsAsCSSVariablesTable
				radixes={ BASE_COLORS_VARS_RADIX }
				caption={ 'Base colors from CSS variables = building blocks (do NOT use directly!)' }
			/>
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Controls() {
	return (
		<main className="o⋄centered-article">
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
		</main>
	)
}

////////////////////////////////////////////////////////////////////////////////////

export function Containers() {
	return (
		<div className="o⋄top-container omr⋄bg⁚cover omr⋄font⁚pixantiqua o⋄text-alignꘌcenter" style={{backgroundImage: `url(` + DemoBgForestGreen + ')' }}>

			<h1>Immersion <code>o⋄top-container omr⋄bg⁚cover"</code></h1>

			<main className="omr⋄font⁚spectral o⋄centered-article" style={{overflowY: 'scroll'}}>

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

			<footer>
				controls
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

////////////////////////////////////////////////////////////////////////////////////

export function GameDemo() {
	return (
		<div className="o⋄top-container omr⋄bg⁚cover omr⋄font⁚pixantiqua" style={{backgroundImage: `url(` + DemoBgForestGreen + ')' }}>

			<h1>Immersion <code>o⋄top-container omr⋄bg⁚cover"</code></h1>

			<main className="omr⋄font⁚spectral o⋄centered-article" style={{overflowY: 'scroll'}}>

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

			<footer className="o⋄text-alignꘌcenter">
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
GameDemo.parameters = {
	viewport: {
		defaultViewport: default_viewport__mobile,
	},
}
