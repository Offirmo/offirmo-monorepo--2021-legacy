// https://storybook.js.org/docs/react/configure/overview#configure-story-rendering

import '@storybook/addon-console'
import VIEWPORTS from '../../../0-meta/storybook-viewports'


export const parameters = {
	actions: {
		argTypesRegex: '^on[A-Z].*',
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	// addons
	backgrounds: {
		// https://storybook.js.org/docs/react/essentials/backgrounds
	},
	darkMode: {
		// https://storybook.js.org/addons/storybook-dark-mode
		stylePreview: true, // affect the preview area, not just storybook UI
	},
	viewport: {
		// https://storybook.js.org/docs/react/essentials/viewport
		viewports: VIEWPORTS,
		//defaultViewport: 'mobile1',
	},
	// https://storybook.js.org/addons/storybook-addon-paddings
	// https://storybook.js.org/addons/storybook-formik
}


export const decorators = [
	/*(MyStory) => {
		console.log({ useDarkMode: useDarkMode() })

		return <MyStory />
	}*/
]
