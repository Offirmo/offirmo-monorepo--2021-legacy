module.export = {
	"plugins": [
		["@babel/plugin-proposal-class-properties", { "loose": false }],
		"@babel/plugin-proposal-export-default-from",
		"@babel/plugin-proposal-object-rest-spread",
		"@babel/plugin-transform-spread"
	],
	"presets": [
		"@babel/react",
		[
			"@babel/env",
			{
				"targets": {
					"browsers": [
						">1%",
						"not ie 11"
					]
				}
			}
		]
	]
}
