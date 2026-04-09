import { iconifyJsonSchema } from "@plugin/icons/iconSchemas";
import { mapSchema, markerSchema } from "@plugin/properties/propertySchemas";
import {
	IconifyJSONIconsObject,
	MapObject,
	MarkerObject,
	Schema,
	StringMap,
	ValidatorFunction,
} from "@plugin/types";
import { isNonEmptyObject } from "@plugin/util";

export function schemaValidatorFactory<T extends StringMap>(
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
	icon: schemaValidatorFactory<IconifyJSONIconsObject>(iconifyJsonSchema),
	marker: schemaValidatorFactory<MarkerObject>(markerSchema),
	map: schemaValidatorFactory<MapObject>(mapSchema),
} as const satisfies Record<string, ValidatorFunction<StringMap>>;
