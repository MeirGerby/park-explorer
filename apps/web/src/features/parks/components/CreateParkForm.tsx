import { useState, type SubmitEvent } from "react";

import { trpc } from "@/lib/trpc";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

import { MapContainer, TileLayer } from "react-leaflet";
import { LocationPicker } from "./LocationPicker";
import "leaflet/dist/leaflet.css";
import { PolygonPicker } from "./PolygonPicker";

interface CreateParkFormProps {
  onSuccess?: () => void;
}




export function CreateParkForm({ onSuccess }: CreateParkFormProps) {
  const { data: user } = useCurrentUser();
  const utils = trpc.useUtils();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [regionId, setRegionId] = useState("");
  const [cityId, setCityId] = useState("");
  const [openedAt, setOpenedAt] = useState("");
  
  const [pickerType, setPickerType] = useState<"point" | "polygon">("point");
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [polygon, setPolygon] = useState<Array<[number, number]> | null>(null);

  const { data: regions } = trpc.regions.getRegions.useQuery();
  const { data: region } = trpc.regions.getRegionById.useQuery(
    { id: regionId },
    { enabled: regionId !== "" },
  );

  const createPark = trpc.parks.createPark.useMutation({
    onSuccess: () => {
      utils.parks.getParks.invalidate();
      setName("");
      setDescription("");
      setRegionId("");
      setOpenedAt("");
      setCityId("");
      setLocation(null);
      setPolygon(null);
      onSuccess?.();
    },
  });

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!user || !cityId) {
      return;
    }

    if (pickerType === "point" && !location) {
      alert("Please select a location on the map.");
      return;
    }

    if (pickerType === "polygon" && (!polygon || polygon.length < 3)) {
      alert("Please select at least 3 points to define an area.");
      return;
    }

    createPark.mutate({
      name,
      description: description || undefined,
      cityId,
      creatorId: user.id,
      openedAt,
      location: pickerType === "point" ? location : undefined,
      polygon: pickerType === "polygon" ? polygon : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start max-w-5xl mx-auto">
      {/* LEFT COLUMN: Text Fields, Dropdowns, and Submit Button */}
      <div className="grid gap-4">
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <label
              htmlFor="park-region"
              className="text-sm leading-none font-medium"
            >
              Region
            </label>
            <Select
              id="park-region"
              required
              value={regionId}
              onChange={(event) => {
                setRegionId(event.target.value);
                setCityId("");
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
            <label
              htmlFor="park-city"
              className="text-sm leading-none font-medium"
            >
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
          
          <div className="col-span-2">
            <Field>
              <FieldLabel>Opening Date</FieldLabel>
              <Input
                type="date"
                required
                value={openedAt}
                onChange={(e) => setOpenedAt(e.target.value)}
              />
            </Field>
          </div>
        </div>

        {createPark.isError && (
          <p className="text-sm text-destructive">{createPark.error.message}</p>
        )}
        
        <Button type="submit" disabled={createPark.isPending || !cityId} className="mt-2">
          {createPark.isPending ? "Creating..." : "Create park"}
        </Button>
      </div>

      {/* RIGHT COLUMN: Map Selector & Type Picker */}
      <div className="grid gap-4 h-full">
        <div className="grid gap-1.5">
          <label htmlFor="picker-type" className="text-sm leading-none font-medium">
            Position Selection Method
          </label>
          <Select
            id="picker-type"
            value={pickerType}
            onChange={(e) => setPickerType(e.target.value as "point" | "polygon")}
          >
            <option value="point">Single Location Point</option>
            <option value="polygon">Area Boundary (Polygon)</option>
          </Select>
        </div>

        <section>
          <Field>
            <div className="flex justify-between items-center mb-1">
              <FieldLabel>
                {pickerType === "point" ? "Park Location" : "Park Boundaries"}
              </FieldLabel>
              {pickerType === "polygon" && polygon && polygon.length > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setPolygon(null)}
                >
                  Clear Area
                </Button>
              )}
            </div>

            <MapContainer
              center={[31.7683, 35.2137]}
              zoom={8}
              className="h-80 lg:h-90 w-full rounded-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {pickerType === "point" ? (
                <LocationPicker position={location} onChange={setLocation} />
              ) : (
                <PolygonPicker points={polygon} onChange={setPolygon} />
              )}
            </MapContainer>

            <div className="mt-2 space-y-1">
              {pickerType === "point" && location && (
                <p className="text-sm text-muted-foreground">
                  <strong>Coordinates:</strong> {location[0].toFixed(6)}, {location[1].toFixed(6)}
                </p>
              )}
              {pickerType === "polygon" && (
                <p className="text-sm text-muted-foreground">
                  <strong>Selected Points:</strong> {polygon ? polygon.length : 0} {polygon && polygon.length >= 3 ? "✓ (Valid Area)" : "(Click at least 3 points)"}
                </p>
              )}
            </div>
          </Field>
        </section>
      </div>
    </form>
  );
}
