import { IconName } from "obsidian";

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
	minZoom?: number;
	maxZoom?: number;
	defaultZoom?: number;
	zoomDelta?: number;
}

export type ValidatorFunction<T> = (value: unknown) => value is T;
