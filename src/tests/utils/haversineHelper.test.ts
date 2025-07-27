import { haversineDistanceKm } from "../../utils/helpers/haversineHelper";

describe("Distance Calculation", () => {
  const LAS_PALMAS = [28.09973, -15.41344]; // [lat, lon]
  const SORIA = [41.76401, -2.46883];

  test("calculates correct distance between known cities", () => {
    const distance = haversineDistanceKm(LAS_PALMAS[0], LAS_PALMAS[1], SORIA[0], SORIA[1]);

    // Actual distance is ~1919km
    expect(distance).toBeGreaterThan(1900);
    expect(distance).toBeLessThan(1920);
  });

  test("returns 0 for same coordinates", () => {
    const distance = haversineDistanceKm(LAS_PALMAS[0], LAS_PALMAS[1], LAS_PALMAS[0], LAS_PALMAS[1]);
    expect(distance).toBe(0);
  });

  test("handles invalid coordinates", () => {
    expect(() => haversineDistanceKm(-91, 0, -91, 0)).toThrow();
    expect(() => haversineDistanceKm(91, 0, 91, 0)).toThrow();
    expect(() => haversineDistanceKm(0, -181, 0, -181)).toThrow();
    expect(() => haversineDistanceKm(0, 181, 0, 181)).toThrow();
  });
});
