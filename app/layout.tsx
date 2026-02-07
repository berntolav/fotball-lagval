import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lagval - Fotball',
  description: 'Vel kven du vil spele med på laget',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
