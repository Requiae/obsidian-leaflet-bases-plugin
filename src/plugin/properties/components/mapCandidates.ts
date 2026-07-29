import { App, BasesConfigFile, BasesConfigFileView, parseYaml, TFile } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { MapObject, RequiredMapObject } from "@plugin/types";
import { fillMapDefaults, isNotNull } from "@plugin/util";
import { SchemaValidator } from "@plugin/validation/schemaValidators";

export interface MapCandidate {
	file: TFile;
	viewName: string;
	settings: RequiredMapObject;
}

type RawView = BasesConfigFileView & Record<string, unknown>;

export async function findLeafletMapCandidates(app: App): Promise<MapCandidate[]> {
	const baseFiles = app.vault.getFiles().filter((file) => file.extension === "base");
	const candidateLists = await Promise.all(baseFiles.map((file) => findInFile(app, file)));
	return candidateLists.flat();
}

export async function openMapCandidate(app: App, candidate: MapCandidate): Promise<void> {
	await app.workspace.openLinkText(`${candidate.file.path}#${candidate.viewName}`, "", true);
}

async function findInFile(app: App, file: TFile): Promise<MapCandidate[]> {
	const config = await readBaseConfig(app, file);
	const views = config?.views;
	if (!Array.isArray(views)) return [];

	return views
		.filter((view): view is RawView => view.type === C.view.type)
		.map((view) => toCandidate(file, view))
		.filter(isNotNull);
}

async function readBaseConfig(app: App, file: TFile): Promise<BasesConfigFile | null> {
	try {
		const parsed: unknown = parseYaml(await app.vault.cachedRead(file));
		return typeof parsed === "object" && parsed !== null ? parsed : null;
	} catch {
		return null;
	}
}

function toCandidate(file: TFile, view: RawView): MapCandidate | null {
	const raw: MapObject = {
		name: toStringOrUndefined(view[C.view.obsidianIdentifiers.mapName]),
		image: normaliseImage(view[C.view.obsidianIdentifiers.image]) ?? "",
		height: toNumberOrUndefined(view[C.view.obsidianIdentifiers.height]),
		minZoom: toNumberOrUndefined(view[C.view.obsidianIdentifiers.minZoom]),
		maxZoom: toNumberOrUndefined(view[C.view.obsidianIdentifiers.maxZoom]),
		defaultZoom: toNumberOrUndefined(view[C.view.obsidianIdentifiers.defaultZoom]),
		zoomDelta: toNumberOrUndefined(view[C.view.obsidianIdentifiers.zoomDelta]),
		scale: toNumberOrUndefined(view[C.view.obsidianIdentifiers.scale]),
		unit: toStringOrUndefined(view[C.view.obsidianIdentifiers.unit]),
	};

	if (!SchemaValidator.map(raw)) return null;

	return { file, viewName: view.name, settings: fillMapDefaults(raw) };
}

function normaliseImage(value: unknown): string | undefined {
	if (typeof value !== "string" || value === "") return undefined;
	const wikilink = /^\[\[(.+?)(\|.*)?\]\]$/.exec(value);
	return wikilink ? wikilink[1] : value;
}

function toStringOrUndefined(value: unknown): string | undefined {
	return typeof value === "string" && value !== "" ? value : undefined;
}

function toNumberOrUndefined(value: unknown): number | undefined {
	if (typeof value === "number" && isFinite(value)) return value;
	if (typeof value === "string" && value !== "") {
		const parsed = parseFloat(value);
		if (!isNaN(parsed)) return parsed;
	}
	return undefined;
}
