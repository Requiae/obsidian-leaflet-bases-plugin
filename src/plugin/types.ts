import { BasesViewRegistration, IconName } from "obsidian";
import { IconifyJSONIconsData } from "@iconify/types";

export type ViewRegistrationBuilder = () => [string, BasesViewRegistration];

export type Wiki = [[string]]; // Wiki links take the shape of string[][]
export type Coordinates = `${number}, ${number}`;
export type Hex = `#${string}`;
export type StringMap = Record<string, unknown>;

export type MarkerObject = {
	mapName?: string;
	coordinates: Coordinates;
	icon?: IconName;
	colour?: Hex;
	minZoom?: number;
};

export type MapObject = {
	name?: string;
	image: string | Wiki;
	height?: number;
	minZoom?: number;
	maxZoom?: number;
	defaultZoom?: number;
	zoomDelta?: number;
	scale?: number;
	unit?: string;
};

// Reconstruct interface as type to avoid "Index signature is missing" error
export type IconifyJSONIconsObject = {
	[Properties in keyof IconifyJSONIconsData]: IconifyJSONIconsData[Properties];
};

// Set all properties of MapObject to required except name
export type RequiredMapObject = Omit<Required<MapObject>, "name"> & { name?: string };

export type ValidatorFunction<T> = (value: unknown) => value is T;

export type Schema<T extends keyof StringMap> = Record<
	T,
	{ validator: ValidatorFunction<unknown>; required?: boolean }
>;

export enum MarkerModalMode {
	Add = "add",
	Edit = "edit",
}
