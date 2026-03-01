import { SchemaValidator } from "@plugin/properties/schemas";
import { test, expect, describe } from "vitest";

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
