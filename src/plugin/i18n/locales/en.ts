import { MarkerModalMode } from "@plugin/types";

export default {
	settings: {
		tools: {
			title: "Map tools",
			measure: {
				title: "Enable measure tool",
				description: "Enable tool that allows you to measure distances",
			},
			copy: {
				title: "Enable copy tool",
				description: "Enable tool that allows you to copy coordinated to your clipboard",
			},
			createNote: {
				title: "Enable create note tool",
				description: "Enable tool that creates a new note with a marker at the clicked location",
			},
		},
		icons: {
			title: "Additional icon sets",
			browse: {
				settingName: "Browse Iconify icon sets",
				settingDescription:
					"Search Iconify's collection of open-source icon sets and add one with a single click.",
				buttonText: "Browse icon sets",
				title: "Browse Iconify icon sets",
				searchPlaceholder: "Search by name, prefix, or category",
				addButtonText: "Add",
				addedButtonText: "Added",
				loading: "Loading icon sets…",
				loadError: "Could not load the Iconify collection list. Check your connection and try again.",
				retry: "Retry",
				addError: "There was an error adding this icon set",
				empty: "No icon sets match your search",
			},
			add: {
				title: "Add iconify icon set manually",
				description: {
					start: "Already have a file, or need a custom set not on Iconify's registry? Additional",
					previewLink: "Iconify icon sets",
					middle: "can be downloaded as .json files at the",
					githubLink: "Iconify GitHub repository",
					end: "",
					warning: "Adding too many icons can negatively impact the performance of your device",
				},
				buttonText: "Add iconset",
				error: "There was an error loading your icon set(s)",
			},
		},
	},
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
		noteName: {
			title: "Note name",
			description: 'Optional. Name for the new note, defaults to "Untitled" if left empty.',
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
		openMap: {
			title: "Show on map",
			description: "Open the base and Leaflet map view this marker belongs to.",
			button: "Open map",
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
			createNote: {
				label: "Create note here",
				defaultName: "Untitled",
				notice: {
					failure: "Failed creating note",
				},
			},
		},
		markerDrag: {
			notice: {
				failure: "Failed moving marker",
			},
		},
	},
	marker: {
		name: "Marker",
		picker: {
			baseModal: {
				placeholder: "Select a base with a Leaflet map view",
			},
			mapModal: {
				title: "Pick coordinates",
				description: "Click on the map to set this marker's coordinates.",
			},
			notice: {
				noMaps: "No Leaflet map views found in this vault",
				noMatchingMap: "No Leaflet map view found for this marker's map name",
				imageLoadFailed: "Failed to load the map image",
			},
		},
	},
};
