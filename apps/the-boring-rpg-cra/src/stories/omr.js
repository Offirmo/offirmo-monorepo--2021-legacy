import React from 'react';
import '../../node_modules/@oh-my-rpg/view-browser/src/style.css';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

storiesOf('Oh-My-RPG CSS framework UI', module)
	.add('background - tiled-marble_black', () =>
		<div className="omr⋄full-size-background-layer omr⋄bg-image⁚tiled-marble_black" />
	)
	.add('background - fields of gold', () => (
		<div className="omr⋄full-size-fixed-layer omr⋄bg⁚cover" style={{
			'background-image': "url('fieldsofgold01_by_andreasrocha-d9zgly8.jpg')",
			'background-position': '62%',
		}}/>
	));
