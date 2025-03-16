"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

type EnvVariables = {
  GROQ_API_KEY: string
  SMTP_HOST: string
  SMTP_PORT: string
  SMTP_SECURE: string
  SMTP_USER: string
  SMTP_PASS: string
  SMTP_FROM: string
}

export function SettingsModal() {
  const [envVars, setEnvVars] = useState<EnvVariables>({
    GROQ_API_KEY: "",
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_SECURE: "",
    SMTP_USER: "",
    SMTP_PASS: "",
    SMTP_FROM: "",
  })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedEnvVars = localStorage.getItem("envVariables")
    if (storedEnvVars) {
      setEnvVars(JSON.parse(storedEnvVars))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEnvVars((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("envVariables", JSON.stringify(envVars))
    setOpen(false)
    toast({
      title: "Settings Saved",
      description: "Your environment variables have been updated.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Environment Variables</DialogTitle>
          <DialogDescription>
            Set your environment variables for the application. These will be stored locally.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={key} className="text-right">
                  {key}
                </Label>
                <Input
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="col-span-3"
                  type={key.includes("PASS") ? "password" : "text"}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

