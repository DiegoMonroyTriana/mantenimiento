import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mantenimiento',
  description: 'App to manage time and tasks'
}

export default async function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
