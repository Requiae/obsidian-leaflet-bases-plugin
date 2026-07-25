/* eslint-disable no-useless-escape */

export const Constants = {
	map: {
		default: {
			minZoom: 0,
			maxZoom: 2,
			zoomDelta: 0.5,
			zoomSnap: 0.01,
			height: 600,
			scale: 1,
			unit: "",
		},
		controlIcons: {
			copy: "pin",
			measure: "ruler",
			pan: "mouse-pointer-2",
			createNote: "file-plus",
		},
		imageTypes: ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"],
		events: {
			dragModeChanged: "bases-leaflet-view:drag-mode-changed",
		},
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
		hexColourValidation: /^#([0-9A-F]{3}){1,2}$$/i,
		coordinatesValidation: /^\s*[0-9]+\s*,\s*[0-9]+\s*$/,
		iconValidation: /^([a-z]+([\-][a-z]+)*:)?[a-z]+([\-][a-z]+)*([\-][0-9]+)?$/,
		url: /https?:/,
		arrayString: /^\[.*[\]]$/,
	},
	settings: {
		default: {
			enableMeasureTool: true,
			enableCopyTool: true,
			enableCreateNoteTool: true,
		},
		links: {
			preview: "https://icon-sets.iconify.design/",
			github: "https://github.com/iconify/icon-sets/tree/master/json",
		},
		iconify: {
			apiBaseUrl: "https://api.iconify.design",
			// The live API's `{prefix}.json` route is only for on-demand icon data
			// (and returns a "200 with body 404" sentinel for unsupported requests,
			// see https://github.com/iconify/api/issues/30), not a full collection dump.
			// The full per-collection JSON files live in this repo instead (the same
			// one users are told to browse manually in the icons settings section).
			rawJsonBaseUrl: "https://raw.githubusercontent.com/iconify/icon-sets/master/json",
		},
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
			scale: "scale",
			unit: "unit",
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
