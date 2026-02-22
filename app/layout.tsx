import './globals.css'
import { ReactNode } from 'react'
import { LanguageProvider } from '../components/i18n/LanguageContext'
import { Navbar } from '../components/layout/Navbar'

export const metadata = {
  title: 'Fin Shop',
  description: 'Cambodia multi-vendor marketplace (manual payments)',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <LanguageProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  )
}
