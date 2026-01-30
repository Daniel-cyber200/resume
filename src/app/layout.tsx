import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ResumeCraft Pro - Professional Resume Builder',
  description: 'Build beautiful, professional resumes in minutes with our customizable resume builder.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}