// https://storybook.js.org/docs/react/configure/overview#configure-story-rendering

import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'
console.log(MINIMAL_VIEWPORTS)

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	// addons
	viewport: {
		viewports: {
			...MINIMAL_VIEWPORTS,
			//...customViewports,
		},
		defaultViewport: 'mobile1',
	},
}
