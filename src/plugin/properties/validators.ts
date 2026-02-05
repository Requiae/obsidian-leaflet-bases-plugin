import { Constants as C } from "plugin/constants";
import { ValidatorFunction } from "plugin/types";

function nameValidator(value: unknown): boolean {
	return String.isString(value);
}

function sourcevalidator(value: unknown): boolean {
	const preparedValue = typeof value === "string" ? value : value?.toString();
	return !!preparedValue;
}

function numberValidator(value: unknown): boolean {
	return Number.isNumber(value);
}

function coordinatesValidator(value: unknown): boolean {
	if (!String.isString(value)) return false;
	const innerValues = value.replace(/\s/g, "").split(",");
	return (
		innerValues.length === 2 &&
		innerValues.every((innerValue) => Number.isInteger(parseInt(innerValue)))
	);
}

function iconValidator(value: unknown): boolean {
	return String.isString(value) && C.regExp.iconValidation.test(value);
}

function colourValidator(value: unknown): boolean {
	if (typeof value !== "string") return false;
	return C.regExp.hexColourValidation.test(value);
}

export const Validator = {
	name: nameValidator,
	source: sourcevalidator,
	number: numberValidator,
	coordinates: coordinatesValidator,
	icon: iconValidator,
	colour: colourValidator,
} as const satisfies Record<string, ValidatorFunction>;
