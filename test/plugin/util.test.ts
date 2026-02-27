import { test, expect, describe } from "vitest";
import { clamp } from "@plugin/util";

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
