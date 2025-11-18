import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js 14 Todo App',
  description: 'Full-stack Todo List application built with Next.js 14 App Router',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
