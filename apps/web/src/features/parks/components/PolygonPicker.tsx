import { Polygon, useMapEvents } from "react-leaflet";

export function PolygonPicker({ 
  points, 
  onChange 
}: { 
  points: Array<[number, number]> | null; 
  onChange: (points: Array<[number, number]> | null) => void;
}) {
  useMapEvents({
    click(e) {
      const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
      const currentPoints = points || [];
      onChange([...currentPoints, newPoint]);
    },
  });

  if (!points || points.length === 0) return null;

  return <Polygon positions={points} pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.3 }} />;
}