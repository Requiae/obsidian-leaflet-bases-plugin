import { MapObject, MarkerObject, ValidatorFunction } from "plugin/types";
import { Validator } from "./validators";

type Schema<T extends string> = Record<T, { validator: ValidatorFunction; required?: boolean }>;

const markerSchema: Schema<keyof MarkerObject> = {
	mapName: { validator: Validator.name },
	coordinates: { validator: Validator.coordinates, required: true },
	icon: { validator: Validator.icon },
	colour: { validator: Validator.colour },
	minZoom: { validator: Validator.number },
};
const mapSchema: Schema<keyof MapObject> = {
	name: { validator: Validator.name },
	image: { validator: Validator.source, required: true },
	minZoom: { validator: Validator.number },
	maxZoom: { validator: Validator.number },
	defaultZoom: { validator: Validator.number },
	zoomDelta: { validator: Validator.number },
};

function schemaValidatorFactory(schema: Schema<string>): ValidatorFunction {
	return (value: unknown) => {
		function isNonEmptyObject(value: unknown): value is { [key: string]: unknown } {
			if (!value || typeof value !== "object") return false;
			return Object.keys.length > 0;
		}

		if (!isNonEmptyObject(value)) return false;

		return Object.entries(schema)
			.map(([key, validate]) => {
				return (value[key] === undefined && !validate.required) || validate.validator(value[key]);
			})
			.every(Boolean);
	};
}

export const SchemaValidator = {
	marker: schemaValidatorFactory(markerSchema),
	map: schemaValidatorFactory(mapSchema),
} as const satisfies Record<string, ValidatorFunction>;
