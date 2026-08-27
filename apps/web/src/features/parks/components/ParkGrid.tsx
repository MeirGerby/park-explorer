import { ParkCard } from "./ParkCard";

type Park = {
  id: string;
  name: string;
  cityName: string;
  regionName: string;
};

type ParkGridProps = {
  parks: Park[];
  isCompact?: boolean; 
};

export function ParkGrid({ parks, isCompact }: ParkGridProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {parks.map((park) => (
        <li key={park.id}>
          <ParkCard park={park} isCompact={isCompact} />
        </li>
      ))}
    </ul>
  );
}
