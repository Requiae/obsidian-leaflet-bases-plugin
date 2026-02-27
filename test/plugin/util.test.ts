import { test, expect, describe } from "vitest";
import { LatLngLiteral } from "leaflet";
import { clamp, distance } from "@plugin/util";

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

describe("Distance method", () => {
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
