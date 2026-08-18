import { useState, type BaseSyntheticEvent } from "react"

import { trpc } from "@/lib/trpc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const utils = trpc.useUtils()

  const login = trpc.auth.login.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate()
    },
  })

  function handleSubmit(event: BaseSyntheticEvent) {
    event.preventDefault()
    login.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input
          type="email"
          required
          autoComplete="email"
          value={email}
          onValueChange={setEmail}
        />
      </Field>
      <Field>
        <FieldLabel>Password</FieldLabel>
        <Input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onValueChange={setPassword}
        />
      </Field>
      {login.isError && (
        <p className="text-sm text-destructive">{login.error.message}</p>
      )}
      <Button type="submit" disabled={login.isPending} className="w-full">
        {login.isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
