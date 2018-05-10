import React from 'react';

import logo from '../tbrpg_logo_512x98.png';
import './index.css'

export default function About() {
	return (
		<div>
			<a href="https://www.online-adventur.es/the-boring-rpg/" target="_blank">
				<img src={logo} />
			</a>
			<p>
				A hobby game from <a href="https://github.com/Offirmo" target="_blank">Offirmo</a>
			</p>
			<p>A remake
				of the original, now defunct, browser game <a href="https://www.reddit.com/r/boringrpg/" target="_blank">The boring RPG</a>
				{' '}by <a href="https://www.reddit.com/user/andypants" target="_blank">andypants</a>.
			</p>
			<p>
				See <a href="https://www.online-adventur.es/" target="_blank">all my games</a>
			</p>
		</div>
	)
}
