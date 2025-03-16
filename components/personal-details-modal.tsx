"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type PersonalDetails = {
  fullName: string
  email: string
  phone: string
  address: string
  currentPosition: string
  yearsOfExperience: string
  currentSalary: string
  expectedSalary: string
  cvLink: string
  aboutMe: string
}

interface PersonalDetailsModalProps {
  onSave: (details: PersonalDetails) => void
}

const initialDetails: PersonalDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  currentPosition: "",
  yearsOfExperience: "",
  currentSalary: "",
  expectedSalary: "",
  cvLink: "",
  aboutMe: "",
}

export function PersonalDetailsModal({ onSave }: PersonalDetailsModalProps) {
  const [details, setDetails] = useState<PersonalDetails>(initialDetails)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const storedDetails = localStorage.getItem("personalDetails")
    if (storedDetails) {
      setDetails(JSON.parse(storedDetails))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDetails((prev) => {
      const newDetails = { ...prev, [name]: value }
      localStorage.setItem("personalDetails", JSON.stringify(newDetails))
      return newDetails
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(details)
    setOpen(false)
  }

  const handleClearData = () => {
    setDetails(initialDetails)
    localStorage.removeItem("personalDetails")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Personal Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Personal Details</DialogTitle>
          <DialogDescription>
            Enter your personal details for HR communications. Fields marked with * are mandatory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name*
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={details.fullName}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={details.email}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone*
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={details.phone}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={details.address}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPosition" className="text-right">
                Current Position
              </Label>
              <Input
                id="currentPosition"
                name="currentPosition"
                value={details.currentPosition}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yearsOfExperience" className="text-right">
                Years of Experience
              </Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                value={details.yearsOfExperience}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentSalary" className="text-right">
                Current Salary
              </Label>
              <Input
                id="currentSalary"
                name="currentSalary"
                value={details.currentSalary}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expectedSalary" className="text-right">
                Expected Salary
              </Label>
              <Input
                id="expectedSalary"
                name="expectedSalary"
                value={details.expectedSalary}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cvLink" className="text-right">
                CV Link
              </Label>
              <Input
                id="cvLink"
                name="cvLink"
                type="url"
                value={details.cvLink}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="aboutMe" className="text-right">
                About Me
              </Label>
              <Textarea
                id="aboutMe"
                name="aboutMe"
                value={details.aboutMe}
                onChange={handleChange}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClearData}>
              Clear Data
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

