import { getTwoYearsAgoDate } from "../../utils/helpers/dateHelper";

describe("Date Helper", () => {
  test("gets the correct date two years ago", () => {
    const today = new Date();
    const expectedDate = new Date(today);
    expectedDate.setFullYear(today.getFullYear() - 2);

    const expectedString = expectedDate.toISOString().split("T")[0];

    expect(getTwoYearsAgoDate()).toBe(expectedString);
  });

  test('should return a string in the format YYYY-MM-DD', () => {
    const result = getTwoYearsAgoDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
