import { Link } from "react-router-dom";

type ParkCardProps = {
  park: {
    id: string;
    name: string;
    cityName: string;
    regionName: string;
  };
  isCompact?: boolean; 
};

export function ParkCard({ park, isCompact }: ParkCardProps) {
  return (
    <Link 
      to={`/parks/${park.id}`}
      className="block rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Conditionally apply tighter, smaller styling if used on dashboard */}
      <h3 className={`${isCompact ? "text-base" : "text-lg"} font-semibold text-foreground`}>
        {park.name}
      </h3>

      <p className={`mt-1 ${isCompact ? "text-xs" : "text-sm"} text-muted-foreground`}>
        {park.cityName}, {park.regionName}
      </p>
    </Link>
  );
}
