import { useT } from '../../components/i18n/LanguageContext'

export default function TermsPage() {
  const t = useT()
  return (
    <div className="prose max-w-3xl">
      <h1>{t('terms.title')}</h1>
      <p>{t('terms.disclaimer')}</p>
    </div>
  )
}
