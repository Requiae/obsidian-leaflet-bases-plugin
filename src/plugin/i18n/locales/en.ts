import { MarkerModalMode } from "@plugin/types";

export default {
	view: {
		name: "Leaflet Map",
		options: {
			image: "Image",
			height: "Embedded height",
			mapname: {
				title: "Map name",
				placeholder: "Optional",
			},
			zoom: {
				header: "Zoom",
				default: "Default zoom",
				min: "Minimum zoom",
				max: "Maximum zoom",
				delta: "Zoom stepsize",
			},
			measure: {
				header: "Measure",
				scale: "Scale",
				unit: {
					title: "Unit",
					placeholder: "Unit of measurement",
				},
			},
		},
	},
	modal: {
		title: {
			[MarkerModalMode.Add]: "Add marker",
			[MarkerModalMode.Edit]: "Edit marker",
		},
		submit: {
			[MarkerModalMode.Add]: "Create marker",
			[MarkerModalMode.Edit]: "Submit changes",
		},
		mapName: {
			title: "Map name",
			description:
				"Optional. Name of the map this marker is specific to. Useful if you want to add this note as a marker to multiple different maps.",
		},
		coordinates: {
			title: "Coordinates",
			description: "Required. Marker coordinates on the map.",
			error: {
				required: "Value is required",
				invalid: "Value not a valid coordinate",
			},
		},
		icon: {
			title: "Icon",
			description: "Optional. The marker icon, defaults to a dot if left empty.",
			placeholder: "Search for an icon",
		},
		colour: {
			title: "Colour",
			description:
				"The marker colour. The dropdown menu has some default values, on custom values it shows empty.",
			predefined: {
				green: "green",
				lime: "lime",
				yellow: "yellow",
				pink: "pink",
				blue: "blue",
				lightblue: "lightblue",
				brown: "brown",
				orange: "orange",
				red: "red",
				purple: "purple",
			},
		},
		minZoom: {
			title: "Minimal zoom",
			description: "Optional. Minimal zoom from which the marker becomes visible.",
		},
	},
	map: {
		controls: {
			measure: "Measure",
			pan: {
				label: "Pan",
			},
			copy: {
				label: "Copy coordinates",
				notice: {
					success: "Coordinates copied to clipboard",
					failure: "Failed copying coordinates to clipboard",
				},
			},
		},
	},
	marker: {
		name: "Marker",
	},
};
