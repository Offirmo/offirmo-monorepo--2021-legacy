import React, { Component, Fragment } from 'react';
import './index.css';
import logo from './tbrpg_logo_512x98.png';

export class OhMyRpg extends Component {
	render() {
		return (
			<div className="o⋄top-container omr⋄font-family⁚pixantiqua">

				<div className="omr⋄full-size-background-layer omr⋄bg-image⁚tiled-marble_black" />

				<div className="omr⋄full-size-fixed-layer omr⋄bg⁚cover" style={{
					'background-image': "url('fieldsofgold01_by_andreasrocha-d9zgly8.jpg')",
					'background-position': '62%',
				}}/>

				<div className="omr⋄top-hud">
					<div className="omr⋄hamburger">
						<span className="icomoon-menu" />
					</div>

					<div className="omr⋄logo">
						<img src={logo} height="100%" />
					</div>

					<div className="omr⋄status⁚avatar">
						<div className="o⋄flex-row o⋄height⁚100pc">
							<span className="icomoon-user omr⋄status⁚avatar⁚icon" />
							<div className="omr⋄status⁚avatar⁚details o⋄flex-column">
								<span>Pertenax</span>
								<span>paladin L.28</span>
							</div>
						</div>
					</div>

					<div className="omr⋄status⁚location">
						<span className="icomoon-person_pin_circle" />
					</div>
				</div>

				<div className="omr⋄z-index⁚immersion o⋄top-container o⋄centered-article">
					<p>
						Normal text
						<strong>emphasized text</strong>
						<span className="o⋄color⁚secondary">secondary text</span>
						<span className="o⋄color⁚ancillary">ancillary text</span>
						What I’m saying is that it’s so, so simple to make sites easier to read. Websites are broken by default, they are functional, high-performing, and accessible, but they’re also fucking ugly. You and all the other web designers out there need to make them not total shit.
						<button>Click me!</button>
						<a>Click me!</a>
					</p>
					<blockquote className="o⋄font⁚fast-and-good-enough">
						<p>“😀 Blockquote featuring the "fast and good enough" font-family (.o⋄font⁚fast-and-good-enough)”
							— Some stranger 🥰</p>
					</blockquote>
					<blockquote className="o⋄font⁚system">
						<p>“😀 Blockquote featuring the "system" font-family (.o⋄font⁚system)”
							— Some stranger 🥰</p>
					</blockquote>
					<blockquote className="o⋄font⁚roboto">
						<p>“😀 Blockquote featuring the nice and precise "roboto" font-family (.o⋄font⁚roboto)”
							— Some stranger 🥰</p>
					</blockquote>
					<blockquote className="o⋄font⁚roboto-condensed">
						<p>“😀 Blockquote featuring the nice and precise "roboto condensed" font-family (.o⋄font⁚roboto-condensed)”
							— Some stranger 🥰</p>
					</blockquote>
					<blockquote className="omr⋄font-family⁚pixantiqua">
						<p>“😀 Blockquote featuring the fun and gamy "Pix Antiqua" font-family (.omr⋄font-family⁚pixantiqua)”
							— Some stranger 🥰</p>
					</blockquote>
					<blockquote className="omr⋄font-family⁚spectral">
						<p>“😀 Blockquote featuring the nice and fantasy "Spectral" font-family (.omr⋄font-family⁚spectral)”
							— Some stranger 🥰</p>
					</blockquote>
				</div>

				<div className="omr⋄bottom-hud">
					<div className="omr⋄bottom-menu">
						<span className="omr⋄bottom-menu⁚icon icomoon-treasure-map" />
						<span className="omr⋄bottom-menu⁚icon icomoon-battle-gear" />
						<span className="omr⋄bottom-menu⁚icon icomoon-locked-chest" />
						<span className="omr⋄bottom-menu⁚icon icomoon-conversation" />
					</div>
				</div>
			</div>
		);
	}
}

export default OhMyRpg;
