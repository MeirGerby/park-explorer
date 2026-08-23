import { useState, type BaseSyntheticEvent } from "react"

import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const utils = trpc.useUtils()

  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate()
    },
  })

  function handleSubmit(event: BaseSyntheticEvent) {
    event.preventDefault()
    register.mutate({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {register.isError && (
        <p className="text-sm text-destructive">{register.error.message}</p>
      )}
      <Button type="submit" disabled={register.isPending} className="w-full">
        {register.isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
