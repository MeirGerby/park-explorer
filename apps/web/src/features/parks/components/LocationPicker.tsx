import { useMapEvents, Marker } from "react-leaflet"

type Props = {
  position: [number, number] | null
  onChange: (position: [number, number]) => void
}

export function LocationPicker({ position, onChange }: Props) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng])
    },
  })

  return position ? <Marker position={position} /> : null
}