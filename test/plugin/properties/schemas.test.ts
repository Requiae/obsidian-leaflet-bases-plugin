import { describe, expect, test } from "vitest";
import { SchemaValidator } from "@plugin/validation/schemaValidators";

describe("Marker schema validator", () => {
	const validator = SchemaValidator.marker;

	test("returns true on valid input", () => {
		expect(validator({ coordinates: "1, 1" })).toEqual(true);
		expect(
			validator({
				mapName: "a very mappy name",
				coordinates: "1, 1",
				icon: "iconic",
				colour: "#bad",
				minZoom: 1,
			}),
		).toEqual(true);
	});

	test("returns false on invalid input", () => {
		expect(validator(undefined)).toEqual(false);
		expect(validator(null)).toEqual(false);
		expect(validator("aaaa")).toEqual(false);
		expect(validator(1)).toEqual(false);
		expect(validator(() => {})).toEqual(false);
		expect(validator({})).toEqual(false);
		expect(validator({ coordinates: "-1, 1" })).toEqual(false);
		expect(validator({ coordinates: "1, 1", mapName: 1 })).toEqual(false);
		expect(validator({ coordinates: "1, 1", icon: "iconic_a" })).toEqual(false);
		expect(validator({ coordinates: "1, 1", colour: "#badcode" })).toEqual(false);
		expect(validator({ coordinates: "1, 1", minZoom: "cheese" })).toEqual(false);
	});
});

describe("Map schema validator", () => {
	const validator = SchemaValidator.map;

	test("returns true on valid input", () => {
		expect(validator({ image: "link" })).toEqual(true);
		expect(validator({ image: [["link"]] })).toEqual(true);
		expect(
			validator({
				name: "whoosh",
				image: "link",
				height: 1,
				minZoom: 1,
				maxZoom: 1,
				defaultZoom: 1,
				zoomDelta: 1,
				scale: 1,
				unit: "kilomiles",
			}),
		).toEqual(true);
	});

	test("returns false on invalid input", () => {
		expect(validator(undefined)).toEqual(false);
		expect(validator(null)).toEqual(false);
		expect(validator("aaaa")).toEqual(false);
		expect(validator(1)).toEqual(false);
		expect(validator(() => {})).toEqual(false);
		expect(validator({})).toEqual(false);
		expect(validator({ image: ["link"] })).toEqual(false);
		expect(validator({ image: "link", name: 1 })).toEqual(false);
		expect(validator({ image: "link", height: -1 })).toEqual(false);
		expect(validator({ image: "link", minZoom: "1" })).toEqual(false);
		expect(validator({ image: "link", maxZoom: "1" })).toEqual(false);
		expect(validator({ image: "link", defaultZoom: "1" })).toEqual(false);
		expect(validator({ image: "link", zoomDelta: -1 })).toEqual(false);
		expect(validator({ image: "link", scale: -1 })).toEqual(false);
		expect(validator({ image: "link", unit: 1 })).toEqual(false);
	});
});

describe("Icon schema validator", () => {
	const validator = SchemaValidator.icon;

	test("returns true on valid input", () => {
		expect(validator({ prefix: "prefix", icons: { icon: { body: "body" } } })).toEqual(true);
		expect(
			validator({
				prefix: "prefix",
				provider: "provider",
				icons: {
					icon1: {
						body: "body",
						left: 0,
						top: 0,
						width: 48,
						height: 24,
						rotate: 90,
						hFlip: true,
						vFlip: false,
					},
					icon2: {
						body: "body",
						left: 0,
						top: 0,
						width: 24,
						height: 24,
						rotate: 90,
						hFlip: false,
						vFlip: false,
					},
				},
				aliases: undefined,
				left: 0,
				top: 0,
				width: 24,
				height: 24,
			}),
		).toEqual(true);
	});

	test("returns false on invalid input", () => {
		expect(validator(undefined)).toEqual(false);
		expect(validator(null)).toEqual(false);
		expect(validator("aaaa")).toEqual(false);
		expect(validator(1)).toEqual(false);
		expect(validator(() => {})).toEqual(false);
		expect(validator({})).toEqual(false);
		expect(validator({ prefix: "prefix" })).toEqual(false);
		expect(validator({ prefix: "prefix", icons: [] })).toEqual(false);
		expect(validator({ prefix: "prefix", icons: [{}] })).toEqual(false);
		expect(validator({ prefix: "prefix", icons: [{ body: "body" }] })).toEqual(false);
		expect(validator({ prefix: "prefix", icons: { icon1: { body: "body", left: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon1: { body: "body", top: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon1: { body: "body", width: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefi", icons: { icon1: { body: "body", height: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefi", icons: { icon1: { body: "body", rotate: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon1: { body: "body", hFlip: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon1: { body: "body", vFlip: "a" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: 11, icons: { icon: { body: "body" } } })).toEqual(false);
		expect(validator({ prefix: "prefix", provider: 1, icons: { icon: { body: "body" } } })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon: { body: "body" } }, left: "a" })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon: { body: "body" } }, top: "a" })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon: { body: "body" } }, width: "a" })).toEqual(
			false,
		);
		expect(validator({ prefix: "prefix", icons: { icon: { body: "body" } }, height: "a" })).toEqual(
			false,
		);
		expect(validator(undefined)).toEqual(false);
		expect(validator(null)).toEqual(false);
		expect(validator("aaaa")).toEqual(false);
		expect(validator(1)).toEqual(false);
		expect(validator(() => {})).toEqual(false);
	});
});
