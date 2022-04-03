// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	workspaceRoot: false, //'..',
	mount: {
		"src": "/",
	},

	exclude: [
		//https://github.com/snowpackjs/snowpack/issues/2499
		//https://www.npmjs.com/package/glob
		"**/node_modules/!(@offirmo/*|@offirmo\-private/*|@oh-my-rpg/*|@tbrpg/*)**/*"
	],

	plugins: [
	/* ... */
	],
	packageOptions: {
		/*knownEntrypoints: [

		]*/
	/* ... */
	},
	devOptions: {
	/* ... */
	},
	buildOptions: {
	/* ... */
	},
};
