import { test, expect, describe } from "vitest";
import { LatLngLiteral } from "leaflet";
import { clamp, distance, isNonEmptyObject, isNotNull, parseCoordinates } from "@plugin/util";
import { Coordinates } from "@plugin/types";

describe("Clamp function", () => {
	const minimum = 2;
	const maximum = 4;
	const middle = (minimum + maximum) / 2;

	test("keep value if within boundaries", () => {
		expect(clamp(middle, minimum, maximum)).toEqual(middle);
	});

	test("keep value if at lower boundary", () => {
		expect(clamp(minimum, minimum, maximum)).toEqual(minimum);
	});

	test("keep value if at upper boundary", () => {
		expect(clamp(maximum, minimum, maximum)).toEqual(maximum);
	});

	test("increase value to minimum if below boundaries", () => {
		expect(clamp(minimum - 1, minimum, maximum)).toEqual(minimum);
	});

	test("reduce value to maximum if above boundaries", () => {
		expect(clamp(maximum + 1, minimum, maximum)).toEqual(maximum);
	});
});

describe("Distance function", () => {
	const origin: LatLngLiteral = { lat: 0, lng: 0 };
	const pointA: LatLngLiteral = { lat: 3, lng: 4 };
	const pointB: LatLngLiteral = { lat: -3, lng: 4 };
	const pointC: LatLngLiteral = { lat: 3, lng: -4 };
	const pointD: LatLngLiteral = { lat: -3, lng: -4 };

	test("corresponds to Pythagorean theorem", () => {
		expect(distance(origin, origin)).toEqual(0);
		expect(distance(origin, pointA)).toEqual(5);
		expect(distance(origin, pointB)).toEqual(5);
		expect(distance(origin, pointC)).toEqual(5);
		expect(distance(origin, pointD)).toEqual(5);

		expect(distance(pointA, origin)).toEqual(5);
		expect(distance(pointA, pointA)).toEqual(0);
		expect(distance(pointA, pointB)).toEqual(6);
		expect(distance(pointA, pointC)).toEqual(8);
		expect(distance(pointA, pointD)).toEqual(10);

		expect(distance(pointB, origin)).toEqual(5);
		expect(distance(pointB, pointA)).toEqual(6);
		expect(distance(pointB, pointB)).toEqual(0);
		expect(distance(pointB, pointC)).toEqual(10);
		expect(distance(pointB, pointD)).toEqual(8);

		expect(distance(pointC, origin)).toEqual(5);
		expect(distance(pointC, pointA)).toEqual(8);
		expect(distance(pointC, pointB)).toEqual(10);
		expect(distance(pointC, pointC)).toEqual(0);
		expect(distance(pointC, pointD)).toEqual(6);

		expect(distance(pointD, origin)).toEqual(5);
		expect(distance(pointD, pointA)).toEqual(10);
		expect(distance(pointD, pointB)).toEqual(8);
		expect(distance(pointD, pointC)).toEqual(6);
		expect(distance(pointD, pointD)).toEqual(0);
	});
});

describe("Parse coordinates function", () => {
	test("parses valid string values correctly", () => {
		expect(parseCoordinates("0, 0")).toEqual([0, 0]);
		expect(parseCoordinates("1, 0")).toEqual([1, 0]);
		expect(parseCoordinates("0, 4")).toEqual([0, 4]);
		expect(parseCoordinates("-1, -5")).toEqual([-1, -5]);
	});

	test("throws error on invalid string values", () => {
		expect(() => parseCoordinates("" as Coordinates)).toThrow();
		expect(() => parseCoordinates("1" as Coordinates)).toThrow();
		expect(() => parseCoordinates(",1" as Coordinates)).toThrow();
		expect(() => parseCoordinates("1, 1, 1" as Coordinates)).toThrow();
		expect(() => parseCoordinates("asdfe" as Coordinates)).toThrow();
	});
});

describe("Is not empty object type guard", () => {
	test("is true on non empty objects", () => {
		expect(isNonEmptyObject({ 1: 1 })).toEqual(true);
		expect(isNonEmptyObject({ a: 1 })).toEqual(true);
		expect(isNonEmptyObject({ 1: "aaa" })).toEqual(true);
		expect(isNonEmptyObject({ a: "aaa" })).toEqual(true);
		expect(isNonEmptyObject({ 1: {} })).toEqual(true);
		expect(isNonEmptyObject({ a: {} })).toEqual(true);
	});

	describe("is false on", () => {
		test("empty objects", () => {
			expect(isNonEmptyObject({})).toEqual(false);
		});

		test("null values", () => {
			expect(isNonEmptyObject(null)).toEqual(false);
		});

		test("undefined values", () => {
			expect(isNonEmptyObject(undefined)).toEqual(false);
		});

		test("number values", () => {
			expect(isNonEmptyObject(0)).toEqual(false);
			expect(isNonEmptyObject(1)).toEqual(false);
		});

		test("boolean values", () => {
			expect(isNonEmptyObject(true)).toEqual(false);
			expect(isNonEmptyObject(false)).toEqual(false);
		});

		test("string values", () => {
			expect(isNonEmptyObject("a")).toEqual(false);
		});

		test("array values", () => {
			expect(isNonEmptyObject([])).toEqual(false);
			expect(isNonEmptyObject([1, 2])).toEqual(false);
			expect(isNonEmptyObject(["a", "b"])).toEqual(false);
		});

		test("function values", () => {
			expect(isNonEmptyObject(() => {})).toEqual(false);
			expect(isNonEmptyObject((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Is not null type guard", () => {
	describe("is true on", () => {
		test("undefined values", () => {
			expect(isNotNull(undefined)).toEqual(true);
		});

		test("object values", () => {
			expect(isNotNull({})).toEqual(true);
			expect(isNotNull({ 1: "aaa" })).toEqual(true);
		});

		test("number values", () => {
			expect(isNotNull(0)).toEqual(true);
			expect(isNotNull(1)).toEqual(true);
		});

		test("boolean values", () => {
			expect(isNotNull(true)).toEqual(true);
			expect(isNotNull(false)).toEqual(true);
		});

		test("string values", () => {
			expect(isNotNull("a")).toEqual(true);
		});

		test("array values", () => {
			expect(isNotNull([])).toEqual(true);
			expect(isNotNull([1, 2])).toEqual(true);
			expect(isNotNull(["a", "b"])).toEqual(true);
		});

		test("function values", () => {
			expect(isNotNull(() => {})).toEqual(true);
			expect(isNotNull((a: number) => a + 1)).toEqual(true);
		});
	});

	test("is false on null values", () => {
		expect(isNotNull(null)).toEqual(false);
	});
});
