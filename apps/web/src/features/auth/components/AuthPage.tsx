import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 bg-stone-100 overflow-hidden select-none antialiased">
      {/* 1. Organic Warm Ambient Glows (Sage, Amber & Soft Earth) */}
      <div className="absolute inset-0 opacity-70 pointer-events-none filter blur-[100px] sm:blur-[130px] transition-all duration-1000">
        <div className="absolute top-[20%] left-[10%] h-125 w-125 sm:h-162.5 sm:w-162.5 rounded-full bg-emerald-200/50 animate-pulse [animation-duration:14s]" />
        <div className="absolute bottom-[20%] right-[10%] h-137.5 w-137.5 sm:h-175 sm:w-175 rounded-full bg-amber-200/40 animate-pulse [animation-duration:18s]" />
        <div className="absolute top-[30%] right-[25%] h-87.5 w-87.5 rounded-full bg-teal-200/30 animate-pulse [animation-duration:10s]" />
      </div>

      {/* 2. Topo-style Subtle Micro Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none" />

      {/* 3. Main Warm Glass Card */}
      <div className="relative z-10 w-full max-w-105 transition-all duration-300">
        {/* Soft Ambient Card Shadow Base */}
        <div className="absolute -inset-1.5 rounded-3xl bg-linear-to-b from-emerald-600/15 via-amber-500/10 to-transparent blur-xl opacity-90 pointer-events-none" />

        <Card className="relative overflow-hidden border border-stone-200/80 bg-stone-50/85 backdrop-blur-2xl shadow-2xl shadow-stone-900/10 text-stone-800 rounded-3xl ring-1 ring-white/60">
          {/* Subtle Inner Warm Highlight Edge */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-600/50 to-transparent" />

          {/* Brand Header Display */}
          <div className="flex flex-col items-center justify-center pt-8 pb-2 gap-2.5">
            <div className="group flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-900 text-emerald-50 shadow-md shadow-emerald-900/15 transition-transform duration-300 group-hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
              </svg>
            </div>
            <span className="text-xs font-bold tracking-[0.25em] text-emerald-900 uppercase mt-1">
              Park Explorer
            </span>
          </div>

          <CardHeader className="space-y-1.5 pt-2 text-center px-6 sm:px-8">
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription className="text-stone-500 text-sm max-w-72.5 mx-auto leading-relaxed">
              {mode === "login"
                ? "Enter your credentials to access your outdoor management ecosystem."
                : "Join our global network of wilderness mapping trackers."}
            </CardDescription>
          </CardHeader>

          {/* Form Area with Smooth Fade/Scale */}
          <CardContent
            key={mode}
            className="text-stone-700 px-6 sm:px-8 pt-2 pb-6 animate-in fade-in-50 zoom-in-95 duration-300"
          >
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </CardContent>

          <CardFooter className="flex flex-col border-t border-stone-200/60 bg-stone-100/60 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-stone-600 hover:text-emerald-900 hover:bg-stone-200/50 transition-all duration-200 group text-xs sm:text-sm rounded-xl py-2.5"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? (
                <span>
                  New explorer?{" "}
                  <strong className="text-emerald-800 font-semibold ml-1 group-hover:underline">
                    Register here
                  </strong>
                </span>
              ) : (
                <span>
                  Have an active profile?{" "}
                  <strong className="text-emerald-800 font-semibold ml-1 group-hover:underline">
                    Sign in
                  </strong>
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
