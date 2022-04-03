// https://storybook.js.org/docs/react/essentials/viewport

const KNOWN_PHONES = {
	iphone: {
		// https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/
		'12': {
			mini:     { w: 375, h: 812 },
			standard: { w: 390, h: 844 },
			pro:      { w: 390, h: 844 },
			proⵧmax:  { w: 428, h: 926 },
		},
	},
}

const custom_viewports = {
	// addon defaults =
	// mobile1 = 320x568
	// mobile2 = 414x896
	// tablet = 834x1112
	// common screen sizes https://www.screensizemap.com/

	mobileXXS: {
		name: 'XXS - Very small mobile 320x568', // from viewport addon defaults
		styles: {
			// ratio 1.77
			width: '320px',
			height: '568px',
		},
	},

	mobileXS: {
		name: 'XS - small mobile 360x640 (most common)', // ~20% popularity https://screensizemap.com/
		styles: {
			// ratio 1.78
			width: '360px',
			height: '640px',
		},
	},

	mobileS: {
		name: 'S - Small iphone 360x780',
		styles: {
			// ratio 1.22
			width: '360px',
			height: '780px',
		},
	},

	iphone12mini: {
		name: `iphone 12 mini 375x812`,
		styles: {
			// ratio 2.16
			width: `${KNOWN_PHONES.iphone['12'].mini.w}px`,
			height: `${KNOWN_PHONES.iphone['12'].mini.h}px`,
		},
	},
	iphone12pro: {
		name: `iphone 12 pro 390x844`,
		styles: {
			// ratio 2.16
			width: `${KNOWN_PHONES.iphone['12'].pro.w}px`,
			height: `${KNOWN_PHONES.iphone['12'].pro.h}px`,
		},
	},
	iphone12promax: {
		name: `iphone 12 pro max 428x926`,
		styles: {
			// ratio 2.16
			width: `${KNOWN_PHONES.iphone['12'].proⵧmax.w}px`,
			height: `${KNOWN_PHONES.iphone['12'].proⵧmax.h}px`,
		},
	},

	tabletM: {
		name: 'M - tablet 834x1112',
		styles: {
			// ratio 1.33
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
