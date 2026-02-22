import React, { createContext, useContext, useMemo, useState } from 'react'
import { dictionaries } from './dictionary'

type Lang = 'en' | 'km'
type Ctx = { lang: Lang; setLang: (l: Lang) => void }
const LanguageContext = createContext<Ctx | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useT() {
  const { lang } = useLanguage()
  const dict = dictionaries[lang]
  return (key: keyof typeof dictionaries['en']) => dict[key] ?? key
}
