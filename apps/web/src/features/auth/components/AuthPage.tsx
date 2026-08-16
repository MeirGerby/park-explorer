import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Sign in" : "Create an account"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign in to Park Explorer to create and manage parks."
              : "Register a new Park Explorer account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Need an account? Register"
              : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
