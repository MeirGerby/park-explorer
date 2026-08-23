import { useState, type ChangeEvent } from "react";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

export function CreateRegionForm() {
  const [name, setName] = useState("");
  const utils = trpc.useUtils();

  const createRegion = trpc.regions.createRegion.useMutation({
    onSuccess: () => {
      utils.regions.getRegions.invalidate();
      setName("");
    },
  });

  function handleSubmit(event: ChangeEvent) {
    event.preventDefault();
    createRegion.mutate({ name });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <div className="flex items-end gap-4">
        <Field className="flex-1">
          <FieldLabel>Name</FieldLabel>
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={createRegion.isPending}>
          {createRegion.isPending ? "Creating..." : "Create region"}
        </Button>
      </div>
      {createRegion.isError && (
        <p className="text-sm text-destructive">{createRegion.error.message}</p>
      )}
    </form>
  );
}
