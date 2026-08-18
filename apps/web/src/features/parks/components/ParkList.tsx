import { useState } from "react"
import { Link } from "react-router-dom"

import { trpc } from "@/lib/trpc"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"

export function ParkList() {
  const [search, setSearch] = useState("")
  const [regionId, setRegionId] = useState("")
  const [cityId, setCityId] = useState("")

  const { data: regions } = trpc.regions.getRegions.useQuery()
  const { data: region } = trpc.regions.getRegionById.useQuery(
    { id: regionId },
    { enabled: regionId !== "" }
  )

  const {
    data: parks,
    isLoading,
    isError,
    error,
  } = trpc.parks.getParks.useQuery({
    regionId: regionId || undefined,
    cityId: cityId || undefined,
  })

  const filteredParks = parks?.filter((park) =>
    park.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>Search by name</FieldLabel>
          <Input
            type="text"
            placeholder="Search parks..."
            value={search}
            onValueChange={setSearch}
          />
        </Field>
        <div className="grid gap-1.5">
          <label htmlFor="park-filter-region" className="text-sm leading-none font-medium">
            Region
          </label>
          <Select
            id="park-filter-region"
            value={regionId}
            onChange={(event) => {
              setRegionId(event.target.value)
              setCityId("")
            }}
          >
            <option value="">All regions</option>
            {regions?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="park-filter-city" className="text-sm leading-none font-medium">
            City
          </label>
          <Select
            id="park-filter-city"
            disabled={!regionId}
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
          >
            <option value="">{regionId ? "All cities" : "Select a region first"}</option>
            {region?.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading && <div className="p-4 text-gray-500">Loading parks...</div>}

      {isError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-semibold">Error loading parks</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading && !isError && filteredParks && filteredParks.length === 0 && (
        <div className="p-4 text-gray-500">No parks found.</div>
      )}

      {!isLoading && !isError && filteredParks && filteredParks.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filteredParks.map((park) => (
            <li key={park.id}>
              <Link
                to={`/parks/${park.id}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {park.cityName}, {park.regionName}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
