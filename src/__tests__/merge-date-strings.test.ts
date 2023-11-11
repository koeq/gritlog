import { mergeDateStrings } from "../utils/date";

describe("Merge date picker date with trainings date:", () => {
  describe("With valid inputs:", () => {
    it("Should correctly merge date and time", () => {
      const datePicker = "2023-04-02";
      const trainingDate = "2023-04-01T15:30:00.000Z";

      const result = mergeDateStrings({ datePicker, trainingDate });
      expect((result as Date)?.toISOString()).toBe("2023-04-02T15:30:00.000Z");
    });
  });

  // Suppress expected error logs for readability.
  console.error = jest.fn();

  describe("With invalid inputs:", () => {
    const invalidTestCases = [
      ["invalid date", "2023-04-01T15:30:00.000Z"],
      ["2023-04-01", "invalid time"],
      ["invalid date", "invalid time"],
    ];

    test.each(invalidTestCases)(
      'Should handle invalid inputs "%s" and "%s"',
      (datePicker, trainingDate) => {
        const result = mergeDateStrings({ datePicker, trainingDate });
        expect(result).toBeUndefined();
      }
    );
  });
});
