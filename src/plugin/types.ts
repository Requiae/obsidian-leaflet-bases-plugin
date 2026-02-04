export interface MarkerObject {
	mapName?: string;
	coordinates: [number, number];
	icon?: string;
	colour?: string;
	minZoom?: number;
}

export interface MapObject {
	name?: string;
	image: string | string[][]; // Wiki links take the shape of string[][]
	minZoom?: number;
	maxZoom?: number;
	defaultZoom?: number;
	zoomDelta?: number;
}

export type ValidatorFunction = (value: unknown) => boolean;
