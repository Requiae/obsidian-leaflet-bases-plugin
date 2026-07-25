import {
	DivIcon,
	divIcon,
	LayerGroup,
	LeafletEvent,
	LeafletMouseEvent,
	LeafletMouseEventHandlerFn,
	Map,
	Marker,
	marker,
} from "leaflet";
import { App, BasesEntry, IconName, Notice, TFile, Value } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MarkerObject, StringMap } from "@plugin/types";
import {
	formatCoordinates,
	getIconWithDefault,
	isNonEmptyObject,
	isNotNull,
	parseCoordinates,
} from "@plugin/util";
import { SchemaValidator, toRawMarkerArray } from "@plugin/validation/schemaValidators";

interface MarkerEntry extends MarkerObject {
	name: string;
	link: string;
}

interface DragModeChangedEvent extends LeafletEvent {
	enabled: boolean;
}

function isProperEntry(entry: unknown): entry is { [key: string]: string } {
	if (!isNonEmptyObject(entry)) return false;
	return Object.values(entry).every((property) => typeof property === "string");
}

function parseMarkerFromEntry(entry: unknown, name: string, link: string): MarkerEntry | null {
	if (!isProperEntry(entry)) return null;

	// The POJO cast messes with number properties, repair minZoom before validation
	const fixedPOJO = {
		...entry,
		minZoom: "minZoom" in entry ? parseFloat(entry.minZoom) : undefined,
	};
	if (!SchemaValidator.marker(fixedPOJO)) return null;

	return {
		...fixedPOJO,
		name,
		link,
	};
}

interface IndexedMarkerEntry {
	markerEntry: MarkerEntry;
	index: number;
}

function markersFromEntry(entry: Value | null, file: TFile): IndexedMarkerEntry[] | null {
	if (entry === null) return null;

	// ListValue is not iterable and ObjectValue is burdensome
	// Because working with nested Values is horrible, JSON cast to POJO
	// Value converted to string is CSV, even when array, make into a proper array
	let entryString = entry.toString();
	if (!C.regExp.arrayString.test(entryString)) entryString = `[${entryString}]`;

	let markerEntries: unknown;
	try {
		markerEntries = JSON.parse(entryString);
	} catch {
		return null;
	}

	if (!Array.isArray(markerEntries)) return null;
	// Index reflects the position in the raw frontmatter array, needed to update the
	// correct entry when a marker is dragged, so it must be captured before any filtering.
	return markerEntries
		.map((rawEntry, index) => {
			const markerEntry = parseMarkerFromEntry(rawEntry, file.basename, file.path);
			return markerEntry ? { markerEntry, index } : null;
		})
		.filter(isNotNull);
}

export class MarkerManager {
	private xmlSerializer: XMLSerializer;

	private mapName: string | undefined;
	private mapMinZoom: number = 0;
	// Only enabled by an explicit dragModeChanged event (fired when the pan tool is selected),
	// so dragging stays off if no control container exists to police it (e.g. all optional map
	// tools disabled in settings).
	private dragEnabled: boolean = false;
	private markerItems: Marker[] = [];

	constructor(
		private app: App,
		private map: Map,
		private markerLayer: LayerGroup,
	) {
		this.xmlSerializer = new XMLSerializer();
		this.map.on(C.map.events.dragModeChanged, (event) => {
			this.setDraggable((event as DragModeChangedEvent).enabled);
		});
	}

	unload(): void {
		this.markerLayer.clearLayers();
	}

	private addMarkerWhenZoom(markerItem: Marker, markerEntry: MarkerEntry) {
		const tolerance = 0.00001; // We have to deal with floating point errors
		if (this.map.getZoom() >= (markerEntry.minZoom ?? this.mapMinZoom) - tolerance) {
			markerItem.addTo(this.markerLayer);
		} else {
			markerItem.remove();
		}
	}

	updateMarkers(data: { data: BasesEntry[] }): void {
		this.markerLayer.clearLayers();
		this.markerItems = [];

		data.data
			.flatMap((entry) =>
				(markersFromEntry(entry.getValue("note.marker"), entry.file) ?? []).map(
					({ markerEntry, index }) => ({ markerEntry, index, file: entry.file }),
				),
			)
			.filter(
				({ markerEntry }) =>
					markerEntry.mapName === undefined || markerEntry.mapName === this.mapName,
			)
			.forEach(({ markerEntry, index, file }) => {
				const options = {
					icon: this.buildMarkerIcon(markerEntry.icon, markerEntry.colour),
					draggable: true,
				};
				// LatLng is y, x so we reverse the coordinates
				const markerItem = marker(parseCoordinates(markerEntry.coordinates), options)
					.bindTooltip(markerEntry.name)
					.on("click", this.getMarkerOnClick(markerEntry.link))
					.on("dragend", () => void this.onMarkerDragEnd(markerItem, file, index));
				// TODO: Add middle mouse click detection
				// Leaflet does not detect middle mouse click, and the mouseup event does not lead to a smooth experience

				markerItem.on("mouseover", this.getMarkerOnHover(markerItem, markerEntry.link));

				this.markerItems.push(markerItem);
				if (!this.dragEnabled) markerItem.dragging?.disable();

				this.addMarkerWhenZoom(markerItem, markerEntry);
				this.map.on("zoomend", () => this.addMarkerWhenZoom(markerItem, markerEntry));
			});
	}

	updateSettings(mapName: string | undefined, mapMinZoom: number) {
		this.mapName = mapName;
		this.mapMinZoom = mapMinZoom;
	}

	private setDraggable(enabled: boolean): void {
		this.dragEnabled = enabled;
		this.markerItems.forEach((markerItem) => {
			if (enabled) markerItem.dragging?.enable();
			else markerItem.dragging?.disable();
		});
	}

	private async onMarkerDragEnd(markerItem: Marker, file: TFile, index: number): Promise<void> {
		const coordinates = formatCoordinates(markerItem.getLatLng());

		try {
			await this.app.fileManager.processFrontMatter(file, (frontmatter: StringMap) => {
				const markers = toRawMarkerArray(frontmatter[C.property.marker.identifier]);

				const target = markers[index];
				if (SchemaValidator.marker(target)) markers[index] = { ...target, coordinates };
				frontmatter[C.property.marker.identifier] = markers;
			});
		} catch {
			new Notice(t("map.markerDrag.notice.failure"));
		}
	}

	private buildMarkerIcon(iconId: IconName | undefined, colour: string | undefined): DivIcon {
		const innerIcon = getIconWithDefault(iconId);
		innerIcon.addClass("leaflet-marker-inner-icon");

		return divIcon({
			className: "leaflet-marker-icon",
			html: `
				<svg class="leaflet-marker-pin" style="fill:${colour ?? C.marker.defaultColour}" viewBox="0 0 32 48">
					<path d="m32,19c0,12 -12,24 -16,29c-4,-5 -16,-16 -16,-29a16,19 0 0 1 32,0"/>
				</svg>
				${this.xmlSerializer.serializeToString(innerIcon)}
			`,
			iconSize: [32, 48],
			iconAnchor: [16, 48],
			tooltipAnchor: [17, -30],
		});
	}

	private getMarkerOnClick(url: string): LeafletMouseEventHandlerFn {
		return (event: LeafletMouseEvent) => {
			return void this.app.workspace.openLinkText("", url, event.originalEvent.ctrlKey);
		};
	}

	private getMarkerOnHover(markerItem: Marker, url: string): LeafletMouseEventHandlerFn {
		return (event: LeafletMouseEvent) => {
			this.app.workspace.trigger("hover-link", {
				event: event.originalEvent,
				source: "bases",
				hoverParent: this.app.renderContext,
				targetEl: markerItem.getElement(),
				linktext: url,
			});
		};
	}
}
