import { Link } from "react-router-dom";

type ParkCardProps = {
  park: {
    id: string;
    name: string;
    cityName: string;
    regionName: string;
  };
};

export function ParkCard({ park }: ParkCardProps) {
    return (
        <Link 
        to={`/parks/${park.id}`}
        className="block rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
            <h3 className="text-lg font-semibold text-foreground">
                {park.name}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
                {park.cityName}, {park.regionName}
            </p>
        </Link>
    )
}
