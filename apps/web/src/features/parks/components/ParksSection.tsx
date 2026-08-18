import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { CreateParkForm } from "./CreateParkForm"
import { ParkList } from "./ParkList"

export function ParksSection() {
  return (
    <section className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add a park</CardTitle>
          <CardDescription>Create a new park in an existing city.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateParkForm />
        </CardContent>
      </Card>
      <ParkList />
    </section>
  )
}
