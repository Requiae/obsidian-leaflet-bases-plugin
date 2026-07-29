import { BasesAllOptions, BasesView } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { t } from "@plugin/i18n/locale";
import { MapObject, RequiredMapObject, StringMap } from "@plugin/types";
import { clamp } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";

const KeyIdentifierMap: Record<keyof MapObject, string> = {
	name: C.view.obsidianIdentifiers.mapName,
	image: C.view.obsidianIdentifiers.image,
	height: C.view.obsidianIdentifiers.height,
	minZoom: C.view.obsidianIdentifiers.minZoom,
	maxZoom: C.view.obsidianIdentifiers.maxZoom,
	defaultZoom: C.view.obsidianIdentifiers.defaultZoom,
	zoomDelta: C.view.obsidianIdentifiers.zoomDelta,
	scale: C.view.obsidianIdentifiers.scale,
	unit: C.view.obsidianIdentifiers.unit,
	center: C.view.obsidianIdentifiers.center,
} as const;

export class ViewUtil {
	constructor(private view: BasesView) {}

	getSettings(): RequiredMapObject | void {
		const settings = Object.fromEntries(
			Object.entries(KeyIdentifierMap).map(([key, value]) => [key, this.view.config.get(value)]),
		);

		// Obsidian view options doesn't have a text based number input and type slider is impractical
		// If view options is used we always get a string instead of number, so we fix that
		if (typeof settings.scale === "string") settings.scale = parseFloat(settings.scale);

		if (!SchemaValidator.map(settings)) return;

		const minZoom = settings.minZoom ?? C.map.default.minZoom;
		const maxZoom = Math.max(settings.maxZoom ?? C.map.default.maxZoom, minZoom);

		return {
			...settings,
			height: settings.height ?? C.map.default.height,
			minZoom,
			maxZoom,
			defaultZoom: clamp(settings.defaultZoom ?? minZoom, minZoom, maxZoom),
			zoomDelta: settings.zoomDelta ?? C.map.default.zoomDelta,
			scale: settings.scale ?? C.map.default.scale,
			unit: settings.unit ?? C.map.default.unit,
		};
	}

	updateSetting<K extends keyof MapObject>(key: K, value: NonNullable<MapObject[K]>): void {
		this.view.config.set(KeyIdentifierMap[key], value);
	}

	createFileForView(frontmatterData: StringMap) {
		void this.view.createFileForView(undefined, (frontmatter: StringMap) => {
			Object.entries(frontmatterData).forEach(([key, value]) => (frontmatter[key] = value));
		});
	}

	static getViewOptions(): BasesAllOptions[] {
		return [
			{
				displayName: t("view.options.image"),
				type: "file",
				key: C.view.obsidianIdentifiers.image,
				filter: (file) => (C.map.imageTypes as readonly string[]).includes(file.extension),
			},
			{
				displayName: t("view.options.height"),
				type: "slider",
				key: C.view.obsidianIdentifiers.height,
				default: C.map.default.height,
				...C.view.config.height,
			},
			{
				displayName: t("view.options.mapname"),
				type: "text",
				key: C.view.obsidianIdentifiers.mapName,
				placeholder: t("view.options.placeholder"),
			},
			{
				displayName: t("view.options.center"),
				type: "text",
				key: C.view.obsidianIdentifiers.center,
				placeholder: t("view.options.placeholder"),
			},
			{
				displayName: t("view.options.zoom.header"),
				type: "group",
				items: [
					{
						displayName: t("view.options.zoom.default"),
						type: "slider",
						key: C.view.obsidianIdentifiers.defaultZoom,
						default: C.map.default.minZoom,
						...C.view.config.zoom.base,
					},
					{
						displayName: t("view.options.zoom.min"),
						type: "slider",
						key: C.view.obsidianIdentifiers.minZoom,
						default: C.map.default.minZoom,
						...C.view.config.zoom.base,
					},
					{
						displayName: t("view.options.zoom.max"),
						type: "slider",
						key: C.view.obsidianIdentifiers.maxZoom,
						default: C.map.default.maxZoom,
						...C.view.config.zoom.base,
					},
					{
						displayName: t("view.options.zoom.delta"),
						type: "slider",
						key: C.view.obsidianIdentifiers.zoomDelta,
						default: C.map.default.zoomDelta,
						...C.view.config.zoom.delta,
					},
				],
			},
			{
				displayName: t("view.options.measure.header"),
				type: "group",
				items: [
					{
						displayName: t("view.options.measure.scale"),
						type: "text",
						key: C.view.obsidianIdentifiers.scale,
						default: C.map.default.scale.toString(),
					},
					{
						displayName: t("view.options.measure.unit.title"),
						type: "text",
						key: C.view.obsidianIdentifiers.unit,
						placeholder: t("view.options.measure.unit.placeholder"),
					},
				],
			},
		];
	}
}
