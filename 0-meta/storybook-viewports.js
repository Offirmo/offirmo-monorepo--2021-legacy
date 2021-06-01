// https://storybook.js.org/docs/react/essentials/viewport
const custom_viewports = {
	// addon defaults =
	// mobile1 = 320x568
	// mobile2 = 414x896
	// tablet = 834x1112
	// common screen sizes https://www.screensizemap.com/

	mobileXXS: {
		name: 'XXS - Very small mobile 320x568', // from viewport addon defaults
		styles: {
			width: '320px',
			height: '568px',
		},
	},

	mobileXS: {
		name: 'XS - small mobile 360x640 (most common)', // ~20% popularity https://screensizemap.com/
		styles: {
			width: '360px',
			height: '640px',
		},
	},

	mobileS: {
		name: 'S - Small iphone 360x780',
		styles: {
			width: '360px',
			height: '780px',
		},
	},

	// TODO big iPhone

	tabletM: {
		name: 'M - tablet 834x1112',
		styles: {
			width: '834px',
			height: '1112px',
		},
	},

	desktopL: {
		name: 'L - sub HD browser viewport 1366x660 (most common)', // ~11% popularity https://screensizemap.com/
		styles: {
			width: '1366px',
			height: '660px', // 768 - 40 - 68
		},
	},

	desktopXL: {
		name: 'XL - HD browser viewport 1920x972', // ~8% popularity https://screensizemap.com/
		styles: {
			width: '1920px',
			height: '972px', // 1080 - 40 - 68
		},
	},

	desktopXXL: {
		name: 'XL - 4k browser viewport 3840x2052',
		styles: {
			width: '3840px',
			height: '2052px', // 2160 - 40 - 68
		},
	},
};

export default custom_viewports
export const default_viewport__mobile = 'mobileXS'
