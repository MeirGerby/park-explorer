import { useState, type FormEvent } from "react"

import { trpc } from "@/lib/trpc"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"

export function CreateParkForm() {
  const { data: user } = useCurrentUser()
  const utils = trpc.useUtils()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [regionId, setRegionId] = useState("")
  const [cityId, setCityId] = useState("")

  const { data: regions } = trpc.regions.getRegions.useQuery()
  const { data: region } = trpc.regions.getRegionById.useQuery(
    { id: regionId },
    { enabled: regionId !== "" }
  )

  const createPark = trpc.parks.createPark.useMutation({
    onSuccess: () => {
      utils.parks.getParks.invalidate()
      setName("")
      setDescription("")
      setRegionId("")
      setCityId("")
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!user || !cityId) {
      return
    }

    createPark.mutate({
      name,
      description: description || undefined,
      cityId,
      creatorId: user.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input type="text" required value={name} onValueChange={setName} />
      </Field>
      <Field>
        <FieldLabel>Description</FieldLabel>
        <Input type="text" value={description} onValueChange={setDescription} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="park-region" className="text-sm leading-none font-medium">
            Region
          </label>
          <Select
            id="park-region"
            required
            value={regionId}
            onChange={(event) => {
              setRegionId(event.target.value)
              setCityId("")
            }}
          >
            <option value="" disabled>
              Select a region
            </option>
            {regions?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="park-city" className="text-sm leading-none font-medium">
            City
          </label>
          <Select
            id="park-city"
            required
            disabled={!regionId}
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
          >
            <option value="" disabled>
              {regionId ? "Select a city" : "Select a region first"}
            </option>
            {region?.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {createPark.isError && (
        <p className="text-sm text-destructive">{createPark.error.message}</p>
      )}
      <Button type="submit" disabled={createPark.isPending || !cityId}>
        {createPark.isPending ? "Creating..." : "Create park"}
      </Button>
    </form>
  )
}
