import { validatorFactory, ValidatorFunction } from "./validators";

type SchemaType = "marker";
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
	minZoom: { validator: validatorFactory("integer") },
};

const schemas: Record<SchemaType, Schema<string>> = {
	marker: markerSchema,
};

export function schemaValidatorFactory(schema: SchemaType): ValidatorFunction {
	return (value: { [key: string]: any }) => {
		return Object.entries(schemas[schema])
			.map(
				([key, validate]) =>
					(key in value === false && !validate.required) || validate.validator(value[key]),
			)
			.every(Boolean);
	};
}
