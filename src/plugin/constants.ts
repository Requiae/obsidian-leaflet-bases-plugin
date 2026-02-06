/* eslint-disable no-useless-escape */

export const Constants = {
	map: {
		defaultMinZoom: 0,
		defaultMaxZoom: 2,
		defaultZoomDelta: 0.5,
		defaultZoomSnap: 0.01,
	},
	marker: {
		defaultColour: "#21409a",
	},
	property: {
		predefinedColours: {
			"#039c4b": "green",
			"#66d313": "lime",
			"#e2c505": "yellow",
			"#ff0984": "pink",
			"#21409a": "blue",
			"#04adff": "lightblue",
			"#e48873": "brown",
			"#f16623": "orange",
			"#f44546": "red",
			"#7623a5": "purple",
		},
	},
	regExp: {
		hexColourValidation: /([0-9A-F]{3}){1,2}$/i,
		coordinatesValidation: /[0-9]+\s*,\s*[0-9]+/,
		iconValidation: /([a-z]+:)?[a-z]+([\-][a-z]+)*/,
		url: /https?:/,
		arrayString: /^\[.*[\]]$/,
	},
} as const;
