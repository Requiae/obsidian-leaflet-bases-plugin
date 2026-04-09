import { MapObject, MarkerObject, Schema } from "@plugin/types";
import { Validator } from "@plugin/validation/validators";

export const markerSchema: Schema<keyof MarkerObject> = {
	mapName: { validator: Validator.string },
	coordinates: { validator: Validator.coordinates, required: true },
	icon: { validator: Validator.icon },
	colour: { validator: Validator.colour },
	minZoom: { validator: Validator.number },
};

export const mapSchema: Schema<keyof MapObject> = {
	name: { validator: Validator.string },
	image: { validator: Validator.source, required: true },
	height: { validator: Validator.positiveNumber },
	minZoom: { validator: Validator.number },
	maxZoom: { validator: Validator.number },
	defaultZoom: { validator: Validator.number },
	zoomDelta: { validator: Validator.positiveNumber },
	scale: { validator: Validator.positiveNumber },
	unit: { validator: Validator.string },
};
