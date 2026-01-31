import { validatorFactory, ValidatorFunction } from "./validators";

type SchemaType = "marker" | "map";
type Schema<T extends string> = Record<T, Entry>;
type Entry = {
	validator: ValidatorFunction;
	required?: boolean;
};

type MarkerKeys = "mapName" | "coordinates" | "icon" | "colour" | "minZoom";
const markerSchema: Schema<MarkerKeys> = {
	mapName: { validator: validatorFactory("name") },
	coordinates: { validator: validatorFactory("coordinates"), required: true },
	icon: { validator: validatorFactory("icon") },
	colour: { validator: validatorFactory("colour") },
	minZoom: { validator: validatorFactory("number") },
};

type MapKeys = "name" | "image" | "minZoom" | "maxZoom" | "initialZoom" | "zoomStep";
const mapSchema: Schema<MapKeys> = {
	name: { validator: validatorFactory("name") },
	image: { validator: validatorFactory("source"), required: true },
	minZoom: { validator: validatorFactory("number") },
	maxZoom: { validator: validatorFactory("number") },
	initialZoom: { validator: validatorFactory("number") },
	zoomStep: { validator: validatorFactory("number") },
};

const schemas: Record<SchemaType, Schema<string>> = {
	marker: markerSchema,
	map: mapSchema,
};

export function schemaValidatorFactory(schema: SchemaType): ValidatorFunction {
	return (value: { [key: string]: unknown }) => {
		return Object.entries(schemas[schema])
			.map(
				([key, validate]) =>
					(value[key] === undefined && !validate.required) || validate.validator(value[key]),
			)
			.every(Boolean);
	};
}
