import { MapObject, MarkerObject, ValidatorFunction } from "plugin/types";
import { Validator } from "./validators";
import { isNonEmptyObject } from "plugin/util";

type Schema<T extends string> = Record<
	T,
	{ validator: ValidatorFunction<unknown>; required?: boolean }
>;
type ValidatedSchemas = MarkerObject | MapObject;

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

function schemaValidatorFactory<T extends ValidatedSchemas>(
	schema: Schema<string>,
): ValidatorFunction<T> {
	function schemaValidator(value: unknown): value is T {
		if (!isNonEmptyObject(value)) return false;

		return Object.entries(schema)
			.map(([key, validate]) => {
				return (value[key] === undefined && !validate.required) || validate.validator(value[key]);
			})
			.every(Boolean);
	}
	return schemaValidator;
}

export const SchemaValidator = {
	marker: schemaValidatorFactory<MarkerObject>(markerSchema),
	map: schemaValidatorFactory<MapObject>(mapSchema),
} as const satisfies Record<string, ValidatorFunction<ValidatedSchemas>>;
