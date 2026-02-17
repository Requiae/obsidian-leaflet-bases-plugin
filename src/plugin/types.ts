import { BasesViewRegistration, IconName } from "obsidian";

export type ViewRegistrationBuilder = () => [string, BasesViewRegistration];

export type Wiki = string[][]; // Wiki links take the shape of string[][]
export type Coordinates = `${number}, ${number}`;
export type Hex = `#${string}`;

export interface MarkerObject {
	mapName?: string;
	coordinates: Coordinates;
	icon?: IconName;
	colour?: Hex;
	minZoom?: number;
}

export interface MapObject {
	name?: string;
	image: string | Wiki;
	height?: number;
	minZoom?: number;
	maxZoom?: number;
	defaultZoom?: number;
	zoomDelta?: number;
	scale?: number;
	unit?: string;
}

// Set all properties of MapObject to required except name
export type RequiredMapObject = Omit<Required<MapObject>, "name"> & { name?: string };

export type ValidatorFunction<T> = (value: unknown) => value is T;

export enum MarkerModalMode {
	Add = "add",
	Edit = "edit",
}
