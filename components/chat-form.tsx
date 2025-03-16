// "use client"

// import { cn } from "@/lib/utils"
// import { useState, useRef, useEffect } from "react"
// import { ArrowUpIcon, ImageIcon, MailIcon, Trash2Icon, RefreshCwIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { AutoResizeTextarea } from "@/components/autoresize-textarea"
// import { PersonalDetailsModal } from "@/components/personal-details-modal"
// import { SettingsModal } from "@/components/settings-modal"
// import { useToast } from "@/components/ui/use-toast"
// import type React from "react"
// import { createWorker } from "tesseract.js"

// type Message = {
//   role: "user" | "assistant"
//   content:
//     | string
//     | {
//         email?: string
//         subject?: string
//         body?: string
//       }
//   image?: string
// }

// type PersonalDetails = {
//   fullName: string
//   email: string
//   phone: string
//   address: string
//   currentPosition: string
//   yearsOfExperience: string
//   currentSalary: string
//   expectedSalary: string
//   cvLink: string
//   aboutMe: string
// }

// export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
//   const [messages, setMessages] = useState<Message[]>([])
//   // const [input, setInput] = useState("Write an email ")
//   const [input, setInput] = useState("Write an email for apply job  ")
//   const [isLoading, setIsLoading] = useState(false)
//   const [imageFile, setImageFile] = useState<File | null>(null)
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [extractedText, setExtractedText] = useState<string>("")
//   const [isRequestingEmail, setIsRequestingEmail] = useState(false)
//   const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//    const { toast } = useToast()

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [])

//   useEffect(() => {
//     const storedDetails = localStorage.getItem("personalDetails")
//     if (storedDetails) {
//       setPersonalDetails(JSON.parse(storedDetails))
//     }
//   }, [])

//   useEffect(() => {
//     const handleDragOver = (e: DragEvent) => {
//       e.preventDefault()
//       e.stopPropagation()
//     }

//     const handleDrop = (e: DragEvent) => {
//       e.preventDefault()
//       e.stopPropagation()

//       if (e.dataTransfer && e.dataTransfer.files) {
//         const file = e.dataTransfer.files[0]
//         if (file && file.type.startsWith("image/")) {
//           handleImageUpload(file)
//         }
//       }
//     }

//     document.addEventListener("dragover", handleDragOver)
//     document.addEventListener("drop", handleDrop)

//     return () => {
//       document.removeEventListener("dragover", handleDragOver)
//       document.removeEventListener("drop", handleDrop)
//     }
//   }, [])

//   const handleImageUpload = async (file: File) => {
//     if (file) {
//       setImageFile(file)
//       setImagePreview(URL.createObjectURL(file))

//       try {
//         setIsLoading(true)
//         const worker = await createWorker("eng")
//         const {
//           data: { text },
//         } = await worker.recognize(file)
//         await worker.terminate()
//         setExtractedText(text)
//         toast({
//           title: "Image Uploaded",
//           description: "Text has been extracted from the image.",
          
//         })
//       } catch (err) {
//         console.error("Error extracting text from image:", err)
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: "Failed to extract text from the image.",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     const file = e.dataTransfer.files[0]
//     if (file && file.type.startsWith("image/")) {
//       handleImageUpload(file)
//     }
//   }

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     if ((input.trim() === "" && !imageFile && !isRequestingEmail) || isLoading) return

//     setIsLoading(true)

//     const userMessage: Message = {
//       role: "user",
//       content: isRequestingEmail ? "Please generate an email template based on the provided JSON data." : input,
//       image: imagePreview || undefined,
//     }
//     setMessages((prevMessages) => [...prevMessages, userMessage])
//     setInput("Write an email for apply job  ")
//     setImageFile(null)
//     setImagePreview(null)
//     setIsRequestingEmail(false)

//     try {
//       const response = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMessage],
//           extractedText,
//           isRequestingEmail,
//           personalDetails,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to get response")
//       }

//       const data = await response.json()
//       const assistantMessage: Message = {
//         role: "assistant",
//         content: {
//           email: data.email,
//           subject: data.subject,
//           body: data.body,
//         },
//       }
//       setMessages((prevMessages) => [...prevMessages, assistantMessage])
//       toast({
//         title: "Response Received",
//         description: "The AI has generated a response.",
//       })
//     } catch (err) {
//       console.error("Error:", err)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "An error occurred while fetching the response.",
//       })
//     } finally {
//       setIsLoading(false)
//       setExtractedText("")
//     }
//   }

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
//     }
//   }

//   const handleSavePersonalDetails = (details: PersonalDetails) => {
//     setPersonalDetails(details)
//     localStorage.setItem("personalDetails", JSON.stringify(details))
//     toast({
//       title: "Personal Details Saved",
//       description: "Your personal details have been updated.",
//     })
//   }

//   const handleSendEmail = async (emailContent: { email?: string; subject?: string; body?: string }) => {
//     try {
//       const response = await fetch("/api/send-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(emailContent),
//       })

//       if (response.ok) {
//         toast({
//           title: "Email Sent",
//           description: `Email successfully sent to ${emailContent.email}`,
//         })
//       } else {
//         throw new Error("Failed to send email")
//       }
//     } catch (error) {
//       console.error("Error sending email:", error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to send email. Please try again.",
//       })
//     }
//   }

//   const handleUpdateInput = (name: string, value: string, index: number) => {
//     const updatedMessages = [...messages]
//     updatedMessages[index].content[name] = value
//     setMessages(updatedMessages)
//   }

//   const handleClearContext = () => {
//     setMessages([])
//     toast({
//       title: "Context Cleared",
//       description: "The conversation history has been cleared.",
//     })
//   }

//   const handleRegenerate = () => {
//     if (messages.length > 0) {
//       const lastUserMessage = messages[messages.length - 2]
//       setMessages(messages.slice(0, -1))
//       handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
//     }
//   }

//   function wordCount(text: string) {
//     return text.trim().split(/\s+/).length
//   }

//   const header = (
//     <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
//       <h1 className="text-2xl font-semibold leading-none tracking-tight">AI Chatbot</h1>
//       <p className="text-neutral-500 text-sm dark:text-neutral-400">
//         Chat with AI, upload images, or generate email templates based on JSON data.
//       </p>
//     </header>
//   )

//   const messageList = (
//     <div className="my-4 flex h-fit min-h-full flex-col gap-4">
//       {messages.map((message, index) => (
//         <div
//           key={index}
//           data-role={message.role}
//           className="max-w-[80%] rounded-xl data-[role=assistant]:w-5/6 px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
//         >
//           {message.image && (
//             <img
//               src={message.image || "/placeholder.svg"}
//               alt="Uploaded"
//               className="aspect-square object-fill mb-2 rounded max-w-[200px] max-h-[200px]"
//             />
//           )}
//           {message.role === "assistant" && typeof message.content === "object" ? (
//             <div className="space-y-2">
//               <div>
//                 <label htmlFor={`email-${index}`} className="block text-sm font-medium text-gray-700">
//                   Email:
//                 </label>
//                 <input
//                   id={`email-${index}`}
//                   type="email"
//                   value={message.content.email || ""}
//                   onChange={(e) => handleUpdateInput("email", e.target.value, index)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`subject-${index}`} className="block text-sm font-medium text-gray-700">
//                   Subject:
//                 </label>
//                 <input
//                   id={`subject-${index}`}
//                   type="text"
//                   value={message.content.subject || ""}
//                   onChange={(e) => handleUpdateInput("subject", e.target.value, index)}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`body-${index}`} className="block text-sm font-medium text-gray-700">
//                   Body:
//                 </label>
//                 <textarea
//                   id={`body-${index}`}
//                   value={message?.content?.body || ""}
//                   onChange={(e) => handleUpdateInput("body", e.target.value, index)}
//                   rows={5}
//                   className="mt-1 block w-full h-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 />
//               </div>
//               <Button onClick={() => handleSendEmail(message?.content)}>Send Email</Button>
//               <p className="text-sm text-neutral-500">Word Count: {wordCount(message?.content?.body || "")}</p>
//             </div>
//           ) : (
//             <p>{typeof message.content === "string" ? message.content : JSON.stringify(message.content)}</p>
//           )}
//         </div>
//       ))}
//       {isLoading && <div className="self-start rounded-xl bg-gray-100 px-3 py-2 text-sm text-black">Thinking...</div>}
//       <div ref={messagesEndRef} />
//     </div>
//   )

//   return (
//     <TooltipProvider>
//       <main
//         className={cn(
//           "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[80rem] flex-col items-stretch border-none",
//           className,
//         )}
//         {...props}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <h1 className="text-xl font-semibold">AI Chatbot</h1>
//           <div className="flex space-x-2">
//             <PersonalDetailsModal onSave={handleSavePersonalDetails} />
//             <SettingsModal />
//           </div>
//         </div>
//         <div className="flex-1 content-center overflow-y-auto px-6">{messages.length ? messageList : header}</div>
//         <form
//           onSubmit={handleSubmit}
//           className="border-neutral-200 bg-white focus-within:ring-neutral-950/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:ring-neutral-300/10"
//         >
//           <div className="flex items-center gap-2 mr-4">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <ImageIcon className="h-4 w-4" />
//                   <span className="sr-only">Upload Image</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Upload Image</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleClearContext}>
//                   <Trash2Icon className="h-4 w-4" />
//                   <span className="sr-only">Clear Context</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Clear Context</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleRegenerate}>
//                   <RefreshCwIcon className="h-4 w-4" />
//                   <span className="sr-only">Regenerate Response</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Regenerate Response</TooltipContent>
//             </Tooltip>
//           </div>

//           <AutoResizeTextarea
//             onKeyDown={handleKeyDown}
//             onChange={(value) => setInput(value)}
//             value={input}
//             placeholder="Enter a message or request an email template"
//             className="placeholder:text-neutral-500 flex-1 bg-transparent focus:outline-none dark:placeholder:text-neutral-400 min-h-[40px]"
//           />

//           <div className="flex items-center gap-2 ml-4">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="h-8 w-8"
//                   onClick={() => {
//                     setIsRequestingEmail(true)
//                     handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
//                   }}
//                 >
//                   <MailIcon className="h-4 w-4" />
//                   <span className="sr-only">Generate Email Template</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Generate Email Template</TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button type="submit" variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
//                   <ArrowUpIcon className="h-4 w-4" />
//                   <span className="sr-only">Submit</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Submit</TooltipContent>
//             </Tooltip>
//           </div>

//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
//             ref={fileInputRef}
//             className="hidden"
//           />
//         </form>
//         <div
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//           className="mx-6 hidden mb-4 border-2 border-dashed border-gray-300 p-4 text-center rounded-lg"
//         >
//           <p>Drag and drop an image here, or click to select a file</p>
//         </div>
//         {imagePreview && (
//           <div className="mx-6 mb-4">
//             <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-48 w-96 object-contain rounded" />
//             {extractedText && (
//               <div className="mt-2 text-sm text-neutral-500 h-48  overflow-auto rounded p-2 bg-neutral-100 dark:bg-neutral-800">
//                 <strong>Extracted Text:</strong> {extractedText}
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </TooltipProvider>
//   )
// }



"use client"

import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"
import { ArrowUpIcon, ImageIcon, MailIcon, Trash2Icon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { AutoResizeTextarea } from "@/components/autoresize-textarea"
import { PersonalDetailsModal } from "@/components/personal-details-modal"
import { SettingsModal } from "@/components/settings-modal"
import { useToast } from "@/components/ui/use-toast"
import  Slider  from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { createWorker } from "tesseract.js"
import { setgid } from "process"

type Message = {
  role: "user" | "assistant"
  content:
    | string
    | {
        email?: string
        subject?: string
        body?: string
      }
  image?: string
}

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

export function ChatForm({ className, ...props }: React.ComponentProps<"form">) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("Write an email for apply job  ")
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [isRequestingEmail, setIsRequestingEmail] = useState(false)
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null)
  const [wordLimit, setWordLimit] = useState<number>(100)
  const [wordLimitInput, setWordLimitInput] = useState<string>("150")
  const [showWordLimitError, setShowWordLimitError] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sentIds, setSentIds] = useState<any>({})
  const { toast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const storedDetails = localStorage.getItem("personalDetails")
    if (storedDetails) {
      setPersonalDetails(JSON.parse(storedDetails))
    }
  }, [])

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.dataTransfer && e.dataTransfer.files) {
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
          handleImageUpload(file)
        }
      }
    }

    document.addEventListener("dragover", handleDragOver)
    document.addEventListener("drop", handleDrop)

    return () => {
      document.removeEventListener("dragover", handleDragOver)
      document.removeEventListener("drop", handleDrop)
    }
  }, [])

  const handleImageUpload = async (file: File) => {
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))

      try {
        setIsLoading(true)
        const worker = await createWorker("eng")
        const {
          data: { text },
        } = await worker.recognize(file)
        await worker.terminate()
        setExtractedText(text)
        toast({
          title: "Image Uploaded",
          description: "Text has been extracted from the image.",
        })
      } catch (err) {
        console.error("Error extracting text from image:", err)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to extract text from the image.",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleWordLimitChange = (value: string) => {
    setWordLimitInput(value)
    const numValue = Number.parseInt(value, 10)

    if (isNaN(numValue) || numValue <= 0) {
      setShowWordLimitError(true)
      return
    }

    setShowWordLimitError(false)
    setWordLimit(numValue)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if ((input.trim() === "" && !imageFile && !isRequestingEmail) || isLoading) return

    setIsLoading(true)

    const userMessage: Message = {
      role: "user",
      content: isRequestingEmail
        ? `Please generate an email template based on the provided JSON data. Keep it under ${wordLimit} words.`
        : `${input} Keep the response under ${wordLimit} words.`,
      image: imagePreview || undefined,
    }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("Write an email for apply job  ")
    setImageFile(null)
    setImagePreview(null)
    setIsRequestingEmail(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          extractedText,
          isRequestingEmail,
          personalDetails,
          wordLimit,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      const assistantMessage: Message = {
        role: "assistant",
        content: {
          email: data.email,
          subject: data.subject,
          body: data.body,
        },
      }
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
      toast({
        title: "Response Received",
        description: "The AI has generated a response.",
      })
    } catch (err) {
      console.error("Error:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching the response.",
      })
    } finally {
      setIsLoading(false)
      setExtractedText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleSavePersonalDetails = (details: PersonalDetails) => {
    setPersonalDetails(details)
    localStorage.setItem("personalDetails", JSON.stringify(details))
    toast({
      title: "Personal Details Saved",
      description: "Your personal details have been updated.",
    })
  }

  const handleSendEmail = async (id:number ,emailContent: { email?: string; subject?: string; body?: string  }) => {
    setSentIds((prev:any) =>({...prev ,[id]:"Sending" }))
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailContent),
      })

      if (response.ok) {
        toast({
          title: "Email Sent",
          description: `Email successfully sent to ${emailContent.email}`,

        })
        setSentIds((prev:any) =>({...prev ,[id]:"sent" }))
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send email. Please try again.",
      })
    }
  }

  const handleUpdateInput = (name: string, value: string, index: number) => {
    const updatedMessages = [...messages]
    updatedMessages[index].content[name] = value
    setMessages(updatedMessages)
  }

  const handleClearContext = () => {
    setMessages([])
    toast({
      title: "Context Cleared",
      description: "The conversation history has been cleared.",
    })
  }

  const handleRegenerate = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages[messages.length - 2]
      setMessages(messages.slice(0, -1))
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
    }
  }

  function wordCount(text: string) {
    return text.trim().split(/\s+/).length
  }

  const header = (
    <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">AI Chatbot</h1>
      <p className="text-neutral-500 text-sm dark:text-neutral-400">
        Chat with AI, upload images, or generate email templates based on JSON data.
      </p>
    </header>
  )

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          data-role={message.role}
          className="max-w-[80%] rounded-xl data-[role=assistant]:w-5/6 px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
        >
          {message.image && (
            <img
              src={message.image || "/placeholder.svg"}
              alt="Uploaded"
              className="aspect-square object-fill mb-2 rounded max-w-[200px] max-h-[200px]"
            />
          )}
          {message.role === "assistant" && typeof message.content === "object" ? (
            <div className="space-y-2">
              <div>
                <label htmlFor={`email-${index}`} className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  id={`email-${index}`}
                  type="email"
                  value={message.content.email || ""}
                  onChange={(e) => handleUpdateInput("email", e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor={`subject-${index}`} className="block text-sm font-medium text-gray-700">
                  Subject:
                </label>
                <input
                  id={`subject-${index}`}
                  type="text"
                  value={message.content.subject || ""}
                  onChange={(e) => handleUpdateInput("subject", e.target.value, index)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor={`body-${index}`} className="block text-sm font-medium text-gray-700">
                  Body:
                </label>
                <textarea
                  id={`body-${index}`}
                  value={message?.content?.body || ""}
                  onChange={(e) => handleUpdateInput("body", e.target.value, index)}
                  rows={5}
                  className="mt-1 block w-full h-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={() => handleSendEmail(index+ 1 ,message?.content)}> {sentIds[index+ 1] ?? "Send Email"}</Button>
                <p
                  className={cn(
                    "text-sm",
                    wordCount(message?.content?.body || "") > wordLimit ? "text-red-500" : "text-neutral-500",
                  )}
                >
                  Word Count: {wordCount(message?.content?.body || "")} / {wordLimit}
                </p>
              </div>
            </div>
          ) : (
            <p>{typeof message.content === "string" ? message.content : JSON.stringify(message.content)}</p>
          )}
        </div>
      ))}
      {isLoading && <div className="self-start rounded-xl bg-gray-100 px-3 py-2 text-sm text-black">Thinking...</div>}
      <div ref={messagesEndRef} />
    </div>
  )

  const wordLimitControl = (
    <div className="mx-6 mb-4 flex items-center space-x-4">
      <Label htmlFor="word-limit" className="min-w-24">
        Word Limit:
      </Label>
      <div className="flex-1 flex items-center space-x-2">
        <Input
          id="word-limit"
          type="number"
          min="1"
          value={wordLimitInput}
          onChange={(e) => handleWordLimitChange(e.target.value)}
          className={cn("w-24", showWordLimitError && "border-red-500")}
        />
        <Slider
          value={[wordLimit]}
          min={50}
          max={500}
          step={10}
          onValueChange={(value) => {
            setWordLimit(value[0])
            setWordLimitInput(value[0].toString())
            setShowWordLimitError(false)
          }}
          className="flex-1"
        />
      </div>
      {showWordLimitError && <p className="text-red-500 text-xs">Please enter a valid positive number</p>}
    </div>
  )

  return (
    <TooltipProvider>
      <main
        className={cn(
          "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[80rem] flex-col items-stretch border-none",
          className,
        )}
        {...props}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-semibold">AI Chatbot</h1>
          <div className="flex space-x-2">
            <PersonalDetailsModal onSave={handleSavePersonalDetails} />
            <SettingsModal />
          </div>
        </div>
        <div className="flex-1 content-center overflow-y-auto px-6">{messages.length ? messageList : header}</div>

        {wordLimitControl}

        <form
          onSubmit={handleSubmit}
          className="border-neutral-200 bg-white focus-within:ring-neutral-950/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:ring-neutral-300/10"
        >
          <div className="flex items-center gap-2 mr-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="sr-only">Upload Image</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Upload Image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleClearContext}>
                  <Trash2Icon className="h-4 w-4" />
                  <span className="sr-only">Clear Context</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear Context</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={handleRegenerate}>
                  <RefreshCwIcon className="h-4 w-4" />
                  <span className="sr-only">Regenerate Response</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Regenerate Response</TooltipContent>
            </Tooltip>
          </div>

          <AutoResizeTextarea
            onKeyDown={handleKeyDown}
            onChange={(value) => setInput(value)}
            value={input}
            placeholder="Enter a message or request an email template"
            className="placeholder:text-neutral-500 flex-1 bg-transparent focus:outline-none dark:placeholder:text-neutral-400 min-h-[40px]"
          />

          <div className="flex items-center gap-2 ml-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setIsRequestingEmail(true)
                    handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
                  }}
                >
                  <MailIcon className="h-4 w-4" />
                  <span className="sr-only">Generate Email Template</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate Email Template</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
                  <ArrowUpIcon className="h-4 w-4" />
                  <span className="sr-only">Submit</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Submit</TooltipContent>
            </Tooltip>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            ref={fileInputRef}
            className="hidden"
          />
        </form>

        {imagePreview && (
          <div className="mx-6 mb-4 flex border rounded-lg overflow-hidden h-80">
            <div className="w-2/5 flex-shrink-0 border-r">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
            </div>
            <div className="w-3/5 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Extracted Text:</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {extractedText || "No text extracted"}
              </p>
            </div>
          </div>
        )}
      </main>
    </TooltipProvider>
  )
}

