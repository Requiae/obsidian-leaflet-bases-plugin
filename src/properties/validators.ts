import { markerColourMap, regExpMap } from "plugin/constants";

type Validator = "name" | "source" | "integer" | "number" | "coordinates" | "icon" | "colour";
export type ValidatorFunction = (value: unknown) => boolean;

function nameValidator(value: unknown): boolean {
	return String.isString(value);
}

function sourcevalidator(value: unknown): boolean {
	const preparedValue = typeof value === "string" ? value : value?.toString();
	return !!preparedValue;
}

function integerValidator(value: unknown): boolean {
	return Number.isInteger(value);
}

function numberValidator(value: unknown): boolean {
	return Number.isNumber(value);
}

function coordinatesValidator(value: unknown): boolean {
	if (!String.isString(value)) return false;
	const innerValues = value.replace(/\s/g, "").split(",");
	return innerValues.length === 2 && innerValues.every((innerValue) => parseInt(innerValue));
}

function iconValidator(value: unknown): boolean {
	return String.isString(value) && regExpMap.iconValidation.test(value);
}

function colourValidator(value: unknown): boolean {
	if (typeof value !== "string") return false;
	return (
		Object.keys(markerColourMap).includes(value.toLowerCase()) ||
		regExpMap.hexColourValidation.test(value)
	);
}

const validators: Record<Validator, ValidatorFunction> = {
	name: nameValidator,
	source: sourcevalidator,
	integer: integerValidator,
	number: numberValidator,
	coordinates: coordinatesValidator,
	icon: iconValidator,
	colour: colourValidator,
};

export function validatorFactory(validatorType: Validator): ValidatorFunction {
	return validators[validatorType];
}
