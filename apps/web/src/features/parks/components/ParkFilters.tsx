import { trpc } from "@/lib/trpc"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"

type ParkFiltersProps = {
  search: string
  regionId: string
  cityId: string
  onSearchChange: (value: string) => void
  onRegionChange: (value: string) => void
  onCityChange: (value: string) => void
}

export function ParkFilters({
  search,
  regionId,
  cityId,
  onSearchChange,
  onRegionChange,
  onCityChange,
}: ParkFiltersProps) {
  const { data: regions } = trpc.regions.getRegions.useQuery()

  const { data: region } = trpc.regions.getRegionById.useQuery(
    { id: regionId },
    { enabled: regionId !== "" },
  )

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field>
        <FieldLabel>Search by name</FieldLabel>

        <Input
          type="text"
          placeholder="Search parks..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </Field>

      <div className="grid gap-1.5">
        <label
          htmlFor="park-filter-region"
          className="text-sm leading-none font-medium"
        >
          Region
        </label>

        <Select
          id="park-filter-region"
          value={regionId}
          onChange={(event) => onRegionChange(event.target.value)}
        >
          <option value="">All regions</option>

          {regions?.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-1.5">
        <label
          htmlFor="park-filter-city"
          className="text-sm leading-none font-medium"
        >
          City
        </label>

        <Select
          id="park-filter-city"
          disabled={!regionId}
          value={cityId}
          onChange={(event) => onCityChange(event.target.value)}
        >
          <option value="">
            {regionId ? "All cities" : "Select a region first"}
          </option>

          {region?.cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}