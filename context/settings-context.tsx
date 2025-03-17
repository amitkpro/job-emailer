"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { encryptData, decryptData } from "@/lib/encryption"

export type ModelInfo = {
  id: string
  object: string
  created: number
  owned_by: string
  active: boolean
  context_window: number
  public_apps: null | boolean
}

export type SmtpSettings = {
  host: string
  port: string
  secure: boolean
  user: string
  pass: string
  from: string
}

export type AppSettings = {
  apiKey: string
  selectedModel: string
  smtp: SmtpSettings
}

const defaultSmtpSettings: SmtpSettings = {
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  user: "",
  pass: "",
  from: "",
}

const defaultSettings: AppSettings = {
  apiKey: "",
  selectedModel: "deepseek-r1-distill-llama-70b", // Default model
  smtp: defaultSmtpSettings,
}

type SettingsContextType = {
  settings: AppSettings
  updateApiKey: (key: string) => void
  updateSelectedModel: (modelId: string) => void
  updateSmtpSettings: (settings: Partial<SmtpSettings>) => void
  resetSettings: () => void
  models: ModelInfo[]
  isLoadingModels: boolean
  fetchModels: () => Promise<void>
  modelError: string | null
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)

  // Load settings from localStorage on initial render
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedApiKey = localStorage.getItem("groqApiKey")
        const storedModel = localStorage.getItem("selectedModel")
        const storedSmtp = localStorage.getItem("smtpSettings")

        const newSettings = { ...defaultSettings }

        if (storedApiKey) {
          newSettings.apiKey = decryptData(storedApiKey)
        }

        if (storedModel) {
          newSettings.selectedModel = storedModel
        }

        if (storedSmtp) {
          try {
            const parsedSmtp = JSON.parse(decryptData(storedSmtp))
            newSettings.smtp = { ...defaultSmtpSettings, ...parsedSmtp }
          } catch (e) {
            console.error("Failed to parse SMTP settings:", e)
          }
        }

        setSettings(newSettings)
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    loadSettings()
  }, [])

  const updateApiKey = (key: string) => {
    setSettings((prev) => {
      const newSettings = { ...prev, apiKey: key }
      localStorage.setItem("groqApiKey", encryptData(key))
      return newSettings
    })
  }

  const updateSelectedModel = (modelId: string) => {
    setSettings((prev) => {
      const newSettings = { ...prev, selectedModel: modelId }
      localStorage.setItem("selectedModel", modelId)
      return newSettings
    })
  }

  const updateSmtpSettings = (smtpUpdates: Partial<SmtpSettings>) => {
    setSettings((prev) => {
      // If user is updating, automatically set from to match user unless explicitly provided
      if (smtpUpdates.user && !smtpUpdates.from) {
        smtpUpdates.from = smtpUpdates.user
      }

      const newSmtp = { ...prev.smtp, ...smtpUpdates }
      const newSettings = { ...prev, smtp: newSmtp }

      localStorage.setItem("smtpSettings", encryptData(JSON.stringify(newSmtp)))
      return newSettings
    })
  }

  const resetSettings = () => {
    localStorage.removeItem("groqApiKey")
    localStorage.removeItem("selectedModel")
    localStorage.removeItem("smtpSettings")
    setSettings(defaultSettings)
  }

  const fetchModels = async () => {
    if (!settings.apiKey) {
      setModelError("API key is required to fetch models")
      return
    }

    setIsLoadingModels(true)
    setModelError(null)

    try {
      const response = await fetch("/api/models", {
        headers: {
          "x-api-key": settings.apiKey,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch models")
      }

      const data = await response.json()
      setModels(data.data || [])
    } catch (error) {
      console.error("Error fetching models:", error)
      setModelError(error instanceof Error ? error.message : "Failed to fetch models")
    } finally {
      setIsLoadingModels(false)
    }
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateApiKey,
        updateSelectedModel,
        updateSmtpSettings,
        resetSettings,
        models,
        isLoadingModels,
        fetchModels,
        modelError,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

