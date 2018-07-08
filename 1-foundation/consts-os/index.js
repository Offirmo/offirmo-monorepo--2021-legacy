// https://en.wikipedia.org/wiki/Usage_share_of_operating_systems


// https://www.android.com/
// https://en.wikipedia.org/wiki/Android_(operating_system)
export const OS_Android = {
	id: 'android',
	name: 'Android',
	versions: [
		'8', // Oreo
		'7', // Nougat
		'6', // Marshmallow
		'5', // Lollipop
	],
}

// https://www.microsoft.com/en-us/windows
//
export const OS_Windows = {
	id: '',
	name: 'Windows',
	versions: [
		'10',
		'8',
		'7',
		'Vista',
		'XP',
		'2000',
		'98',
	],
}

// https://en.wikipedia.org/wiki/IOS
export const OS_iOs = {
	id: '',
	name: 'iOs',
	versions: [
		'12',
		'11',
	],
}

// https://www.apple.com/macos/
export const OS_macOS = {
	id: '',
	name: 'iOs',
	versions: [
		'10.14', // Mojave
		'10.13', // High Sierra
		'10.12', // Sierra
		'10.11', // El Capitan
	],
}

export const OS_Linux = {
	id: '',
	name: 'Linux'
}

export const OSES = {
	[OS_Android.id]: OS_Android,
	[OS_Windows.id]: OS_Windows,
	[OS_iOs.id]: OS_iOs,
	[OS_macOS.id]: OS_macOS,
	[OS_Linux.id]: OS_Linux,
}
