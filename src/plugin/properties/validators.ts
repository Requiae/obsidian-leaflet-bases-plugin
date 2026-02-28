import { IconName } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { Coordinates, Hex, ValidatorFunction, Wiki } from "@plugin/types";

type ValidatedProperties = string | Wiki | number;

function stringValidator(value: unknown): value is string {
	return typeof value === "string";
}

function sourcevalidator(value: unknown): value is string | Wiki {
	if (stringValidator(value)) return value.length > 0;
	if (Array.isArray(value) && Array.isArray(value[0]) && stringValidator(value[0][0]))
		return value[0][0].length > 0;
	return false;
}

function numberValidator(value: unknown): value is number {
	return typeof value === "number" && isFinite(value) && !isNaN(value);
}

function positiveNumberValidator(value: unknown): value is number {
	return numberValidator(value) && value > 0;
}

function coordinatesValidator(value: unknown): value is Coordinates {
	return typeof value === "string" && C.regExp.coordinatesValidation.test(value);
}

function iconValidator(value: unknown): value is IconName {
	return typeof value === "string" && C.regExp.iconValidation.test(value);
}

function colourValidator(value: unknown): value is Hex {
	return typeof value === "string" && C.regExp.hexColourValidation.test(value);
}

export const Validator = {
	string: stringValidator,
	source: sourcevalidator,
	number: numberValidator,
	positiveNumber: positiveNumberValidator,
	coordinates: coordinatesValidator,
	icon: iconValidator,
	colour: colourValidator,
} as const satisfies Record<string, ValidatorFunction<ValidatedProperties>>;
