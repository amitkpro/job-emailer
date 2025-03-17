import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { decryptData } from "@/lib/encryption"

export async function POST(req: Request) {
  try {
    const { email, subject, body } = await req.json()

    // Get encrypted SMTP settings from request headers
    const encryptedSmtpSettings = req.headers.get("x-smtp-settings") || ""

    // Default SMTP settings
    let smtpSettings = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      user: "",
      pass: "",
      from: "",
    }

    // Decrypt SMTP settings if available
    if (encryptedSmtpSettings) {
      try {
        const decryptedSettings = decryptData(encryptedSmtpSettings)
        smtpSettings = { ...smtpSettings, ...JSON.parse(decryptedSettings) }
      } catch (error) {
        console.error("Error decrypting SMTP settings:", error)
      }
    }

    // Validate required SMTP settings
    if (!smtpSettings.host || !smtpSettings.user || !smtpSettings.pass) {
      return NextResponse.json({ error: "Missing required SMTP settings" }, { status: 400 })
    }

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: smtpSettings.host,
      port: Number(smtpSettings.port),
      secure: smtpSettings.secure,
      auth: {
        user: smtpSettings.user,
        pass: smtpSettings.pass,
      },
    })

    // Send mail with defined transport object
    await transporter.sendMail({
      from: smtpSettings.from || smtpSettings.user,
      to: email,
      subject: subject,
      text: body,
    })

    return NextResponse.json({ message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

