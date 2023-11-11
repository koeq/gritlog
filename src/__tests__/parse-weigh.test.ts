import { parseWeight } from "../utils/parse-weight";

describe("Parse weight:", () => {
  it("Should return undefined for null input", () => {
    expect(parseWeight(null)).toBeUndefined();
  });

  it("Should return undefined for undefined input", () => {
    expect(parseWeight(undefined)).toBeUndefined();
  });

  it("Should return undefined for empty string", () => {
    expect(parseWeight("")).toBeUndefined();
  });

  it("Should parse value with decimal point and kg unit", () => {
    const result = parseWeight("10.5kg");
    expect(result).toEqual({ value: 10.5, unit: "kg" });
  });

  it("Should parse value with comma and kg unit", () => {
    const result = parseWeight("10,5kg");
    expect(result).toEqual({ value: 10.5, unit: "kg" });
  });

  it("Should parse value without decimal and kg unit", () => {
    const result = parseWeight("10kg");
    expect(result).toEqual({ value: 10, unit: "kg" });
  });

  it("Should parse value with decimal point and lbs unit", () => {
    const result = parseWeight("10.5lbs");
    expect(result).toEqual({ value: 10.5, unit: "lbs" });
  });

  it("Should return undefined for invalid unit", () => {
    expect(parseWeight("10.5xyz")).toBeUndefined();
  });
});
