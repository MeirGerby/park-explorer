import { ParkCard } from "./ParkCard";

type Park = {
  id: string;
  name: string;
  cityName: string;
  regionName: string;
};

type ParkGridProps = {
  parks: Park[];
};

export function ParkGrid({ parks }: ParkGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {parks.map((park) => (
        <li key={park.id}>
          <ParkCard park={park} />
        </li>
      ))}
    </ul>
  );
}
