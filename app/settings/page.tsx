"use client"

import { useState, useEffect } from "react"
import { useSettings, type ModelInfo } from "@/context/settings-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Server, Globe, Database, Clock, Check, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const {
    settings,
    updateApiKey,
    updateSelectedModel,
    updateSmtpSettings,
    resetSettings,
    models,
    isLoadingModels,
    fetchModels,
    modelError,
  } = useSettings()

  const { toast } = useToast()
  const [apiKeyInput, setApiKeyInput] = useState("")
  const [smtpSettings, setSmtpSettings] = useState(settings.smtp)
  const [selectedModelId, setSelectedModelId] = useState(settings.selectedModel)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    setApiKeyInput(settings.apiKey)
    setSmtpSettings(settings.smtp)
    setSelectedModelId(settings.selectedModel)
  }, [settings])

  const handleSaveApiKey = () => {
    updateApiKey(apiKeyInput)
    toast({
      title: "API Key Saved",
      description: "Your Groq API key has been saved.",
    })
  }

  const handleFetchModels = async () => {
    if (!settings.apiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter your Groq API key first.",
      })
      return
    }

    await fetchModels()
  }

  const handleSaveModel = () => {
    updateSelectedModel(selectedModelId)
    toast({
      title: "Model Saved",
      description: `Model has been updated to ${selectedModelId}.`,
    })
  }

  const handleSaveSmtpSettings = () => {
    updateSmtpSettings(smtpSettings)
    toast({
      title: "SMTP Settings Saved",
      description: "Your email settings have been updated.",
    })
  }

  const handleResetSettings = () => {
    resetSettings()
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    })
  }

  const getModelProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "meta":
        return <Globe className="h-4 w-4 text-blue-500" />
      case "google":
        return <Globe className="h-4 w-4 text-green-500" />
      case "groq":
        return <Database className="h-4 w-4 text-purple-500" />
      default:
        return <Server className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center mb-8">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="email">Email Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Groq API Key</CardTitle>
              <CardDescription>Enter your Groq API key to access available models.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter your Groq API key"
                      className="flex-1"
                    />
                    <Button variant="outline" type="button" onClick={() => setShowApiKey(!showApiKey)} className="ml-2">
                      {showApiKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleFetchModels} disabled={isLoadingModels}>
                {isLoadingModels ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>Fetch Available Models</>
                )}
              </Button>
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Selection</CardTitle>
              <CardDescription>Choose the AI model to use for generating responses.</CardDescription>
            </CardHeader>
            <CardContent>
              {modelError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-800">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  {modelError}
                </div>
              )}

              {models.length === 0 && !isLoadingModels && !modelError ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No models available. Please fetch models first.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {models.map((model: ModelInfo) => (
                    <div
                      key={model.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedModelId === model.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedModelId(model.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getModelProviderIcon(model.owned_by)}
                          <div>
                            <h3 className="font-medium">{model.id}</h3>
                            <p className="text-sm text-muted-foreground">Provider: {model.owned_by}</p>
                          </div>
                        </div>
                        {selectedModelId === model.id && <Check className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Context: {model.context_window.toLocaleString()} tokens</span>
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-1 ${model.active ? "bg-green-500" : "bg-red-500"}`}
                          />
                          <span>{model.active ? "Active" : "Inactive"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveModel} disabled={models.length === 0}>
                Save Selected Model
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Settings</CardTitle>
              <CardDescription>Configure your email server settings for sending emails.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={smtpSettings.host}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                      placeholder="smtp.example.com"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={smtpSettings.port}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                      placeholder="587"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtpSecure"
                    checked={smtpSettings.secure}
                    onCheckedChange={(checked) => setSmtpSettings({ ...smtpSettings, secure: checked })}
                  />
                  <Label htmlFor="smtpSecure">Use Secure Connection (TLS)</Label>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input
                    id="smtpUser"
                    value={smtpSettings.user}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, user: e.target.value, from: e.target.value })}
                    placeholder="your-email@example.com"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input
                    id="smtpPass"
                    type="password"
                    value={smtpSettings.pass}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, pass: e.target.value })}
                    placeholder="Your password or app password"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="smtpFrom">From Email Address</Label>
                  <Input
                    id="smtpFrom"
                    value={smtpSettings.from}
                    onChange={(e) => setSmtpSettings({ ...smtpSettings, from: e.target.value })}
                    placeholder="your-email@example.com"
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">This will automatically match your SMTP username</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSmtpSettings}>Save SMTP Settings</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reset Settings</CardTitle>
              <CardDescription>Reset all settings to their default values.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This will reset all your settings, including API keys, model selection, and SMTP configuration. This
                action cannot be undone.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={handleResetSettings}>
                Reset All Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

