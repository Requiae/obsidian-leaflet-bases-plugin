/* eslint-disable no-useless-escape */

export const Constants = {
	map: {
		minZoom: 0,
		maxZoom: 2,
		zoomDelta: 0.5,
		zoomSnap: 0.01,
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
		iconValidation: /([a-z]+:)?[a-z]+([\-][a-z]+)*/,
		url: /https?:/,
		arrayString: /^\[.*[\]]$/,
	},
} as const;
