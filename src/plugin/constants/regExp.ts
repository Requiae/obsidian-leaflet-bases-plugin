/* eslint-disable no-useless-escape */

export const regExpMap = {
	hexColourValidation: /([0-9A-F]{3}){1,2}$/i,
	iconValidation: /([a-z]+:)?[a-z]+([\-][a-z]+)*/,
} as const;
