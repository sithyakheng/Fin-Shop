'use client'

import Link from 'next/link'
import { useLanguage } from '../i18n/LanguageContext'
import { dictionaries } from '../i18n/dictionary'
import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export function Navbar() {
  const { lang, setLang } = useLanguage()
  const t = dictionaries[lang]
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setUserRole(null)
        setLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setUserRole(profile?.role || null)
      setLoading(false)
    }

    fetchUserRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUserRole()
    })

    return () => subscription.unsubscribe()
  }, [supabase])
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
          {!loading && userRole === 'seller' && (
            <Link href="/seller/dashboard" className="text-sm text-gray-700 hover:underline">
              Seller Dashboard
            </Link>
          )}
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
