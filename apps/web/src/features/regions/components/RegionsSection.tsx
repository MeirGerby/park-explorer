import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { CreateRegionForm } from "./CreateRegionForm"
import { RegionList } from "./RegionList"

export function RegionsSection() {
  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add a region</CardTitle>
          <CardDescription>Create a new region to organize cities under.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRegionForm />
        </CardContent>
      </Card>
      <RegionList />
    </section>
  )
}
