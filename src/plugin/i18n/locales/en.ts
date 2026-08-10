import { MarkerModalMode } from "@plugin/types";

export default {
	settings: {
		tools: {
			title: "Map tools",
			measure: {
				title: "Enable measure tool",
				description: "Enable tool that allows you to measure distances",
			},
			drag: {
				title: "Enable drag tool",
				description: "Enable tool that allows you to drag markers",
			},
			createNote: {
				title: "Enable create note tool",
				description: "Enable tool that creates a new note with a marker at the clicked location",
				error: {
					deserialise: "Obsidian could not deserialise your formula",
				},
			},
		},
		icons: {
			title: "Additional icon sets",
			add: {
				title: "Add iconify icon set",
				description: {
					start: "Additional",
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
			mapname: "Map name",
			center: "Default center point",
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
			placeholder: "Optional",
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
			description:
				'Optional. Type a name to create a new note there, or pick an existing note shown in the base to add the marker to that note instead. Defaults to "Untitled" if left empty.',
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
			pan: "Pan",
			drag: "Drag",
			createNote: {
				label: "Create note here",
			},
			copy: {
				label: "Copy coordinates",
				notice: {
					success: "Coordinates copied to clipboard",
					failure: "Failed copying coordinates to clipboard",
				},
			},
		},
		contextMenu: {
			marker: {
				addNote: "Add marker to note",
				edit: "Edit marker",
				setMinimalZoom: "Set marker minimal zoom",
				resetMinimalZoom: "Reset marker minimal zoom",
				delete: "Delete",
			},
			map: {
				copyCoordinates: "Copy coordinates",
				setDefaultZoom: "Set map default zoom",
				setDefaultCenterPoint: "Set map default center point",
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
