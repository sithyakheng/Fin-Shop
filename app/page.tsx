import Link from 'next/link'
import { useT } from '../components/i18n/LanguageContext'

export default function HomePage() {
  const t = useT()
  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-8">
        <h1 className="text-3xl font-bold">{t('app.title')}</h1>
        <p className="mt-2 text-gray-700">{t('app.subtitle')}</p>
        <div className="mt-4 flex gap-3">
          <Link href="/products" className="btn btn-primary animate-pulse-soft">
            {t('cta.browse')}
          </Link>
          <Link href="/seller" className="btn btn-ghost">
            {t('cta.sell')}
          </Link>
        </div>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-semibold">{t('sections.featured')}</h2>
        <p className="text-gray-600">{t('sections.featured_desc')}</p>
      </section>
    </div>
  )
}
