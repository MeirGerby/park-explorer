import { type LatLngExpression } from "leaflet";

function parseWKT(wkt: string): LatLngExpression[] | null {
  const match = wkt.match(/POLYGON\s*\(\((.*?)\)\)/i);
  if (!match || !match[1]) return null;

  const pairs = match[1].split(",");
  const coords: LatLngExpression[] = [];

  for (const pair of pairs) {
    const parts = pair.trim().split(/\s+/);
    if (parts.length >= 2) {
      const lng = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        coords.push([lat, lng]);
      }
    }
  }

  return coords.length > 0 ? coords : null;
}

export function parseParkPolygon(polygon: unknown): LatLngExpression[] | null {
  if (!polygon) return null;

  let parsed: any = polygon;

  // 1. If it's a string, attempt WKT parsing first, then JSON parsing
  if (typeof polygon === "string") {
    const trimmed = polygon.trim();
    if (trimmed.toUpperCase().startsWith("POLYGON")) {
      return parseWKT(trimmed);
    }

    try {
      parsed = JSON.parse(polygon);
    } catch (err) {
      console.warn("Failed to parse polygon string:", polygon, err);
      return null;
    }
  }

  // 2. Process GeoJSON Object ({ type: "Polygon", coordinates: [...] })
  if (parsed && typeof parsed === "object" && parsed.type === "Polygon" && Array.isArray(parsed.coordinates)) {
    const ring = parsed.coordinates[0];
    return ring.map(([lng, lat]: [number, number]) => [lat, lng]);
  }

  // 3. Process Array format ([[lng, lat], ...] or [{lat, lng}, ...])
  if (Array.isArray(parsed)) {
    return parsed.map((item) => {
      if (Array.isArray(item)) return [item[1], item[0]];
      return [item.lat, item.lng];
    });
  }

  return null;
}