import { IconName } from "obsidian";
import { Constants as C } from "@plugin/constants";
import { Coordinates, Hex, ValidatorFunction, Wiki } from "@plugin/types";

type ValidatedProperties = string | Wiki | number;

function stringValidator(value: unknown): value is string {
	return String.isString(value);
}

function sourcevalidator(value: unknown): value is string | Wiki {
	const preparedValue = typeof value === "string" ? value : value?.toString();
	return !!preparedValue;
}

function numberValidator(value: unknown): value is number {
	return Number.isFinite(value);
}

function positiveNumberValidator(value: unknown): value is number {
	return numberValidator(value) && value > 0;
}

function coordinatesValidator(value: unknown): value is Coordinates {
	return String.isString(value) && C.regExp.coordinatesValidation.test(value);
}

function iconValidator(value: unknown): value is IconName {
	return String.isString(value) && C.regExp.iconValidation.test(value);
}

function colourValidator(value: unknown): value is Hex {
	return String.isString(value) && C.regExp.hexColourValidation.test(value);
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
