import { MapObject, MarkerObject } from "plugin/types";
import { validatorFactory, ValidatorFunction } from "./validators";

type SchemaType = "marker" | "map";
type Schema<T extends string> = Record<T, Entry>;
type Entry = {
	validator: ValidatorFunction;
	required?: boolean;
};

const markerSchema: Schema<keyof MarkerObject> = {
	mapName: { validator: validatorFactory("name") },
	coordinates: { validator: validatorFactory("coordinates"), required: true },
	icon: { validator: validatorFactory("icon") },
	colour: { validator: validatorFactory("colour") },
	minZoom: { validator: validatorFactory("number") },
};
const mapSchema: Schema<keyof MapObject> = {
	name: { validator: validatorFactory("name") },
	image: { validator: validatorFactory("source"), required: true },
	minZoom: { validator: validatorFactory("number") },
	maxZoom: { validator: validatorFactory("number") },
	defaultZoom: { validator: validatorFactory("number") },
	zoomDelta: { validator: validatorFactory("number") },
};

const schemas: Record<SchemaType, Schema<string>> = {
	marker: markerSchema,
	map: mapSchema,
};

export function schemaValidatorFactory(schema: SchemaType): ValidatorFunction {
	return (value: unknown) => {
		function isNonEmptyObject(value: unknown): value is { [key: string]: unknown } {
			if (!value || typeof value !== "object") return false;
			return Object.keys.length > 0;
		}

		if (!isNonEmptyObject(value)) return false;

		return Object.entries(schemas[schema])
			.map(([key, validate]) => {
				return (value[key] === undefined && !validate.required) || validate.validator(value[key]);
			})
			.every(Boolean);
	};
}
