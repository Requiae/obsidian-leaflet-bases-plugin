import {
	ExtendedIconifyIcon,
	IconifyDimenisons,
	IconifyIcons,
	IconifyTransformations,
} from "@iconify/types";
import { IconifyJSONIconsObject, ReducedIconifyInfo, Schema } from "@plugin/types";
import { isNonEmptyObject } from "@plugin/util";
import { schemaValidatorFactory } from "@plugin/validation/schemaValidators";
import { Validator } from "@plugin/validation/validators";

function iconifyIconsValidator(value: unknown): value is IconifyIcons {
	if (!isNonEmptyObject(value)) return false;

	return Object.values(value)
		.map((value) => schemaValidatorFactory(iconifyIconSchema)(value))
		.every(Boolean);
}

const iconifyDimensionsSchema: Schema<keyof IconifyDimenisons> = {
	left: { validator: Validator.number },
	top: { validator: Validator.number },
	width: { validator: Validator.number },
	height: { validator: Validator.number },
};

const iconifyTransformationsSchema: Schema<keyof IconifyTransformations> = {
	rotate: { validator: Validator.number },
	hFlip: { validator: Validator.boolean },
	vFlip: { validator: Validator.boolean },
};

const iconifyIconSchema: Schema<keyof ExtendedIconifyIcon> = {
	body: { validator: Validator.string, required: true },
	hidden: { validator: Validator.boolean },
	...iconifyDimensionsSchema,
	...iconifyTransformationsSchema,
};

const iconifyAuthorSchema: Schema<keyof ReducedIconifyInfo["author"]> = {
	name: { validator: Validator.string, required: true },
	url: { validator: Validator.url },
};

const iconifyLicenseSchema: Schema<keyof ReducedIconifyInfo["license"]> = {
	title: { validator: Validator.string, required: true },
	spdx: { validator: Validator.string },
	url: { validator: Validator.url },
};

const iconifyInfoSchema: Schema<keyof ReducedIconifyInfo> = {
	name: { validator: Validator.string, required: true },
	author: { validator: schemaValidatorFactory(iconifyAuthorSchema), required: true },
	license: { validator: schemaValidatorFactory(iconifyLicenseSchema), required: true },
};

export const iconifyJsonSchema: Schema<keyof IconifyJSONIconsObject> = {
	prefix: { validator: Validator.string, required: true },
	provider: { validator: Validator.string },
	icons: { validator: iconifyIconsValidator, required: true },
	aliases: { validator: Validator.ignore },
	...iconifyDimensionsSchema,
	info: { validator: schemaValidatorFactory(iconifyInfoSchema) },
};
