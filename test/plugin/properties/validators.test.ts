import { Validator } from "@plugin/properties/validators";
import { test, expect, describe } from "vitest";

describe("String validator", () => {
	const validator = Validator.string;

	test("returns true on string value", () => {
		expect(validator("")).toEqual(true);
		expect(validator("j")).toEqual(true);
		expect(validator("hsagdj")).toEqual(true);
		expect(validator("213")).toEqual(true);
	});

	describe("returns false on", () => {
		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("number value", () => {
			expect(validator(0)).toEqual(false);
			expect(validator(1)).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Source validator", () => {
	const validator = Validator.source;

	describe("returns true on", () => {
		test("non-empty string value", () => {
			expect(validator("j")).toEqual(true);
			expect(validator("hsagdj")).toEqual(true);
			expect(validator("213")).toEqual(true);
		});

		test("wiki value", () => {
			expect(validator([["f"]])).toEqual(true);
			expect(validator([["asffsc"]])).toEqual(true);
			expect(validator([["123"]])).toEqual(true);
		});
	});

	describe("returns false on", () => {
		test("empty string value", () => {
			expect(validator("")).toEqual(false);
		});

		test("empty wiki value", () => {
			expect(validator([[""]])).toEqual(false);
		});

		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("number value", () => {
			expect(validator(0)).toEqual(false);
			expect(validator(1)).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Number validator", () => {
	const validator = Validator.number;

	test("returns true on finite number value", () => {
		expect(validator(0)).toEqual(true);
		expect(validator(1)).toEqual(true);
		expect(validator(3284972389)).toEqual(true);
		expect(validator(-541)).toEqual(true);
	});

	describe("returns false on", () => {
		test("infinite number value", () => {
			expect(validator(Number.POSITIVE_INFINITY)).toEqual(false);
			expect(validator(Number.NEGATIVE_INFINITY)).toEqual(false);
		});

		test("NaN value", () => {
			expect(validator(NaN)).toEqual(false);
		});

		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("string value", () => {
			expect(validator("")).toEqual(false);
			expect(validator("j")).toEqual(false);
			expect(validator("hsagdj")).toEqual(false);
			expect(validator("213")).toEqual(false);
			expect(validator("0")).toEqual(false);
			expect(validator("-213")).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Positive number validator", () => {
	const validator = Validator.positiveNumber;

	test("returns true on finite number value", () => {
		expect(validator(1)).toEqual(true);
		expect(validator(3284972389)).toEqual(true);
	});

	describe("returns false on", () => {
		test("negative number value", () => {
			expect(validator(-1)).toEqual(false);
			expect(validator(-14564812)).toEqual(false);
		});

		test("zero number value", () => {
			expect(validator(0)).toEqual(false);
		});

		test("infinite number value", () => {
			expect(validator(Number.POSITIVE_INFINITY)).toEqual(false);
			expect(validator(Number.NEGATIVE_INFINITY)).toEqual(false);
		});

		test("NaN value", () => {
			expect(validator(NaN)).toEqual(false);
		});

		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("string value", () => {
			expect(validator("")).toEqual(false);
			expect(validator("j")).toEqual(false);
			expect(validator("hsagdj")).toEqual(false);
			expect(validator("213")).toEqual(false);
			expect(validator("0")).toEqual(false);
			expect(validator("-213")).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Coordinates validator", () => {
	const validator = Validator.coordinates;

	test("returns true on valid coordinates string value", () => {
		expect(validator("1, 123")).toEqual(true);
		expect(validator("0,0")).toEqual(true);
		expect(validator("   0  , 1234   ")).toEqual(true);
	});

	describe("returns false on", () => {
		test("invalid coordinates string value", () => {
			expect(validator("")).toEqual(false);
			expect(validator("e, 234")).toEqual(false);
			expect(validator("a, a")).toEqual(false);
			expect(validator("-1, 231")).toEqual(false);
			expect(validator(", 231")).toEqual(false);
			expect(validator("-1,")).toEqual(false);
			expect(validator("1, 231, 1")).toEqual(false);
		});

		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("number value", () => {
			expect(validator(0)).toEqual(false);
			expect(validator(1)).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Icon validator", () => {
	const validator = Validator.icon;

	test("returns true on valid icon string value", () => {
		expect(validator("test")).toEqual(true);
		expect(validator("test-icon")).toEqual(true);
		expect(validator("also-a-test-icon")).toEqual(true);
	});

	describe("returns false on", () => {
		test("invalid icon string value", () => {
			expect(validator("")).toEqual(false);
			expect(validator("e, 234")).toEqual(false);
			expect(validator("A-f")).toEqual(false);
			expect(validator("also--a-test-icon")).toEqual(false);
			expect(validator("test aa")).toEqual(false);
			expect(validator("asd test-icon")).toEqual(false);
			expect(validator(" 12 also-a-test-icon")).toEqual(false);
			expect(validator("test    ")).toEqual(false);
		});

		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("number value", () => {
			expect(validator(0)).toEqual(false);
			expect(validator(1)).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});

describe("Colour validator", () => {
	const validator = Validator.colour;

	test("returns true on valid colour string value", () => {
		expect(validator("#fff")).toEqual(true);
		expect(validator("#02adf3")).toEqual(true);
		expect(validator("#FFa")).toEqual(true);
		expect(validator("#F082Fa")).toEqual(true);
	});

	describe("returns false on", () => {
		test("invalid colour string value", () => {
			expect(validator("")).toEqual(false);
			expect(validator("  #fff")).toEqual(false);
			expect(validator("#02adf3s")).toEqual(false);
			expect(validator("#ghi")).toEqual(false);
			expect(validator("#F082Fa   ")).toEqual(false);
			expect(validator("also-a-test-icon")).toEqual(false);
			expect(validator("test")).toEqual(false);
		});

		test("undefined value", () => {
			expect(validator(undefined)).toEqual(false);
		});

		test("null value", () => {
			expect(validator(null)).toEqual(false);
		});

		test("object value", () => {
			expect(validator({})).toEqual(false);
			expect(validator({ 1: "aaa" })).toEqual(false);
		});

		test("number value", () => {
			expect(validator(0)).toEqual(false);
			expect(validator(1)).toEqual(false);
		});

		test("boolean value", () => {
			expect(validator(true)).toEqual(false);
			expect(validator(false)).toEqual(false);
		});

		test("array value", () => {
			expect(validator([])).toEqual(false);
			expect(validator([1, 2])).toEqual(false);
			expect(validator(["a", "b"])).toEqual(false);
		});

		test("function value", () => {
			expect(validator(() => {})).toEqual(false);
			expect(validator((a: number) => a + 1)).toEqual(false);
		});
	});
});
