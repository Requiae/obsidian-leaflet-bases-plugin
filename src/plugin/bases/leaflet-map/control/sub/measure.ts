import {
	CircleMarker,
	LatLng,
	LayerGroup,
	LeafletMouseEvent,
	Polyline,
	Tooltip,
	circleMarker,
	layerGroup,
	polyline,
	tooltip,
} from "leaflet";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { distance, getIconWithDefault } from "@plugin/util";
import { SubControl } from "../subControl";

enum MeasureState {
	Ready,
	Measuring,
	Finishing,
	Done,
}

export class MeasureControl extends SubControl {
	private state: MeasureState = MeasureState.Ready;
	private pathItems: LatLng[] = [];
	private distance: number = 0;

	private lineLayer: LayerGroup | undefined;
	private pointLayer: LayerGroup | undefined;
	private pathLine: Polyline | undefined;
	private previewLine: Polyline | undefined;
	private previewTooltip: Tooltip | undefined;
	private lastElement: CircleMarker | undefined;

	override onAdded(): void {
		if (this.button) {
			this.button.appendChild(getIconWithDefault(C.map.controlIcons.measure));
			this.button.ariaLabel = t("map.controls.measure");
		}

		this.lineLayer = layerGroup().addTo(this.map);
		this.pointLayer = layerGroup().addTo(this.map);

		this.pathLine = polyline([]).addTo(this.lineLayer);
		this.previewLine = polyline([], { dashArray: "8" }).addTo(this.lineLayer);
		this.previewTooltip = this.getTooltip(true).setLatLng([0, 0]);
	}

	override onSelected(): void {
		this.map.getContainer().setCssStyles({ cursor: "crosshair" });
		this.map.on("mousemove", (event) => {
			this.renderPreview(event.latlng);
		});
	}

	override onDeselected(): void {
		this.map.getContainer().setCssStyles({ cursor: "" });
		this.map.removeEventListener("mousemove");
		this.resetPath();
		this.state = MeasureState.Ready;
	}

	override mapClicked(event: LeafletMouseEvent): void {
		if (!this.lineLayer) throw new Error("Line layer not initialised");
		switch (this.state) {
			case MeasureState.Ready:
			case MeasureState.Measuring: {
				this.state = MeasureState.Measuring;
				this.pathItems.push(event.latlng);
				this.renderPath();
				this.previewTooltip?.addTo(this.lineLayer);
				this.renderPreview(event.latlng);
				break;
			}
			case MeasureState.Finishing: {
				this.state = MeasureState.Done;
				this.lastElement?.bindTooltip(this.getTooltip(true)).bringToFront();
				this.previewTooltip?.remove();
				break;
			}
			case MeasureState.Done: {
				this.resetPath();
				this.state = MeasureState.Ready;
			}
		}
	}

	private renderPath(): void {
		this.cleanLastElement();
		this.updatePolyline(this.pathLine, this.pathItems);

		const lastCoordinate = this.pathItems.at(-1);
		if (lastCoordinate === undefined) return;

		this.lastElement = this.getCircleMarker(lastCoordinate);

		const secondLastCoordinate = this.pathItems.at(-2);
		if (secondLastCoordinate === undefined) return;

		this.distance += distance(lastCoordinate, secondLastCoordinate) * this.options.scale;
	}

	private renderPreview(mouseCoordinate: LatLng): void {
		if (this.state !== MeasureState.Measuring) return;

		const lastCoordinate = this.pathItems.at(-1);
		if (lastCoordinate === undefined) return;

		this.updatePolyline(this.previewLine, [lastCoordinate, mouseCoordinate]);
		this.previewTooltip = this.previewTooltip
			?.setLatLng(mouseCoordinate)
			.setContent(
				this.getContent(
					this.distance + distance(lastCoordinate, mouseCoordinate) * this.options.scale,
				),
			);
	}

	private resetPath(): void {
		this.pathItems = [];
		this.distance = 0;
		this.cleanLastElement();
		this.pointLayer?.clearLayers();
		this.updatePolyline(this.pathLine, []);
		this.updatePolyline(this.previewLine, []);
		this.previewTooltip?.remove();
	}

	private updatePolyline(line: Polyline | undefined, coordinates: LatLng[]): void {
		line?.setLatLngs(coordinates).redraw();
		line?.getElement()?.removeClass("leaflet-interactive");
	}

	private cleanLastElement(): void {
		this.lastElement?.removeEventListener("click");
		this.lastElement?.getElement()?.removeClass("leaflet-interactive");
	}

	private getTooltip(permanent: boolean = false): Tooltip {
		return tooltip({ permanent, offset: [15, 0] }).setContent(this.getContent(this.distance));
	}

	private getCircleMarker(coordinate: LatLng): CircleMarker {
		if (!this.pointLayer) throw new Error("Point layer not initialised");
		return circleMarker(coordinate, { radius: 4, fill: true, fillColor: "#3388ff", fillOpacity: 1 })
			.addTo(this.pointLayer)
			.addEventListener("click", () => (this.state = MeasureState.Finishing));
	}

	private getContent(measurement: number): string {
		return `${measurement.toFixed(1)} ${this.options?.unit ?? C.map.default.unit}`;
	}
}
