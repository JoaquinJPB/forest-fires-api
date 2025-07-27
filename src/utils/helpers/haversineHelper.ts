export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 < -90 || lat1 > 90 || lon1 < -180 || lon1 > 180 || lat2 < -90 || lat2 > 90 || lon2 < -180 || lon2 > 180) {
    throw new Error("Invalid coordinates");
  }
  const earthRadiusKm = 6371;
  const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = degreesToRadians(lat2 - lat1);
  const deltaLon = degreesToRadians(lon2 - lon1);

  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);

  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;

  return Math.round(distance * 100) / 100;
}
