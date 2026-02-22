import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageContext'
import { dictionaries } from '../i18n/dictionary'
import React from 'react'

export function Navbar() {
  const { lang, setLang } = useLanguage()
  const t = dictionaries[lang]
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-bold">
          Fin Shop
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/products" className="text-sm text-gray-700 hover:underline">
            {t['nav.products']}
          </Link>
          <Link href="/seller" className="text-sm text-gray-700 hover:underline">
            {t['nav.seller']}
          </Link>
          <Link href="/admin" className="text-sm text-gray-700 hover:underline">
            {t['nav.admin']}
          </Link>
          <Link href="/auth/login" className="text-sm text-gray-700 hover:underline">
            {t['nav.login']}
          </Link>
          <Link href="/auth/register" className="text-sm text-gray-700 hover:underline">
            {t['nav.register']}
          </Link>
          <Link href="/terms" className="text-sm text-gray-700 hover:underline">
            {t['nav.terms']}
          </Link>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="rounded border bg-white p-1 text-sm"
            aria-label="Language"
          >
            <option value="en">EN</option>
            <option value="km">KM</option>
          </select>
        </nav>
      </div>
    </header>
  )
}
