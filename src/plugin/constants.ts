/* eslint-disable no-useless-escape */

export const Constants = {
	map: {
		default: {
			minZoom: 0,
			maxZoom: 2,
			zoomDelta: 0.5,
			zoomSnap: 0.01,
			height: 600,
		},
		controlIcons: {
			copy: "pin",
			measure: "ruler",
			pan: "mouse-pointer-2",
		},
		imageTypes: ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"],
	},
	marker: {
		defaultColour: "#21409a",
	},
	property: {
		marker: {
			identifier: "marker",
			icon: "lucide-map-pin",
		},
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
	view: {
		type: "leaflet-map",
		icon: "lucide-map",
		obsidianIdentifiers: {
			mapName: "mapName",
			image: "image",
			height: "height",
			minZoom: "minZoom",
			maxZoom: "maxZoom",
			defaultZoom: "defaultZoom",
			zoomDelta: "zoomDelta",
		},
		config: {
			height: {
				min: 200,
				max: 800,
				step: 20,
			},
			zoom: {
				base: {
					min: -30,
					max: 30,
					step: 1,
				},
				delta: {
					min: 0,
					max: 1,
					step: 0.01,
				},
			},
		},
	},
} as const;
